from fastapi import APIRouter, Request, Depends, Form
from sqlalchemy.orm import Session
from datetime import datetime
import logging
import json

from core.database import get_db
from models.models import User, ChatHistory, Appointment
from utils.ai_handler import ai_handler
from utils.twilio_handler import twilio_handler
from utils.telegram_handler import telegram_handler
from core.limiter import limiter

# CUSTOM KEY GENERATOR: Identify bot users globally by their phone or Telegram ID
def bot_user_key(request: Request):
    """
    Attached by middleware in run.py
    """
    form_data = getattr(request.state, "form_data", None)
    if form_data and "From" in form_data:
        return form_data["From"]
        
    json_data = getattr(request.state, "json_data", None)
    if json_data and "message" in json_data:
        return str(json_data["message"]["chat"]["id"])
    
    return "0.0.0.0"

# --- LOGGING SETUP ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/webhook")

@router.post("/whatsapp")
@limiter.limit("100/hour", key_func=bot_user_key)
async def whatsapp_webhook(
    request: Request,
    db: Session = Depends(get_db),
    From: str = Form(None),
    Body: str = Form(None)
):
    try:
        if not From or not Body:
            return {"status": "ignored"}
        
        platform_id = From.replace("whatsapp:", "")
        profile_name = (await request.form()).get("ProfileName")

        user = db.query(User).filter(User.platform == "whatsapp", User.platform_id == platform_id).first()
        if not user:
            user = User(platform="whatsapp", platform_id=platform_id, name=profile_name, phone=platform_id)
            db.add(user)
        else:
            user.name = profile_name or user.name
            user.last_seen = datetime.utcnow()
        
        db.commit()
        db.refresh(user)

        db.add(ChatHistory(user_id=user.id, role="user", message=Body))
        db.commit()
        
        history_entries = db.query(ChatHistory).filter(ChatHistory.user_id == user.id)\
            .order_by(ChatHistory.timestamp.desc()).limit(11).all()
        history = [{"role": h.role, "message": h.message} for h in reversed(history_entries[1:])]

        ai_response = ai_handler.process_message(Body, history)
        
        if ai_response["type"] == "booking":
            data = ai_response["data"]
            appt = Appointment(
                user_id=user.id,
                service_needed=data.get("service_needed"),
                appointment_date=data.get("appointment_date"),
                customer_name=data.get("customer_name"),
                customer_address=data.get("customer_address")
            )
            db.add(appt)
            
            try:
                date_val = data.get("appointment_date", "TBD")
                time_val = "Requested" 
                content_vars = json.dumps({"1": date_val, "2": time_val})
                sid = twilio_handler.send_whatsapp_template(platform_id, "HXb5b62575e6e4ff6129ad7c8efe1f983e", content_vars)
                final_text = f"Confirmed! {data.get('customer_name')}, see you on {data.get('appointment_date')}." if not sid else f"[Template Sent] Confirmed! {data.get('customer_name')}."
            except:
                final_text = f"Confirmed! {data.get('customer_name')}, see you on {data.get('appointment_date')}."
        else:
            final_text = ai_response["content"]

        db.add(ChatHistory(user_id=user.id, role="ai", message=final_text))
        db.commit()
        
        if ai_response["type"] != "booking":
            twilio_handler.send_whatsapp_message(platform_id, final_text)
        
    except Exception as e:
        logger.error(f"WhatsApp Error: {str(e)}")
        return {"status": "error"}

    return {"status": "success"}

@router.post("/telegram")
@limiter.limit("100/hour", key_func=bot_user_key)
async def telegram_webhook(
    request: Request,
    db: Session = Depends(get_db)
):
    try:
        data = await request.json()
        if "message" not in data or "text" not in data["message"]:
            return {"status": "ignored"}

        chat_id = str(data["message"]["chat"]["id"])
        user_text = data["message"]["text"]
        
        from_user = data["message"].get("from", {})
        full_name = f"{from_user.get('first_name', '')} {from_user.get('last_name', '')}".strip() or None

        user = db.query(User).filter(User.platform == "telegram", User.platform_id == chat_id).first()
        if not user:
            user = User(platform="telegram", platform_id=chat_id, name=full_name, username=from_user.get("username"))
            db.add(user)
        else:
            user.name = full_name or user.name
            user.last_seen = datetime.utcnow()
        
        db.commit()
        db.refresh(user)

        db.add(ChatHistory(user_id=user.id, role="user", message=user_text))
        db.commit()

        history_entries = db.query(ChatHistory).filter(ChatHistory.user_id == user.id)\
            .order_by(ChatHistory.timestamp.desc()).limit(11).all()
        history = [{"role": h.role, "message": h.message} for h in reversed(history_entries[1:])]

        ai_response = ai_handler.process_message(user_text, history)
        
        if ai_response["type"] == "booking":
            data_json = ai_response["data"]
            appt = Appointment(
                user_id=user.id,
                service_needed=data_json.get("service_needed"),
                appointment_date=data_json.get("appointment_date"),
                customer_name=data_json.get("customer_name"),
                customer_address=data_json.get("customer_address")
            )
            db.add(appt)
            final_text = f"Confirmed! {data_json.get('customer_name')}, see you on {data_json.get('appointment_date')}."
        else:
            final_text = ai_response["content"]

        db.add(ChatHistory(user_id=user.id, role="ai", message=final_text))
        db.commit()

        telegram_handler.send_message(chat_id, final_text)
    except Exception as e:
        logger.error(f"Telegram Error: {str(e)}")
        return {"status": "error"}

    return {"status": "success"}
