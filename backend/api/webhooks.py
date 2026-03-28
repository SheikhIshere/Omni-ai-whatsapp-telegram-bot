from fastapi import APIRouter, Request, Depends, Form
from sqlalchemy.orm import Session
from core.database import get_db
from models.models import User, ChatHistory, Appointment
from utils.ai_handler import ai_handler
from utils.twilio_handler import twilio_handler
from utils.telegram_handler import telegram_handler
import logging
import json

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/webhook")

@router.post("/whatsapp")
async def whatsapp_webhook(
    request: Request,
    db: Session = Depends(get_db),
    From: str = Form(None),
    Body: str = Form(None)
):
    try:
        logger.info(f"DEBUG: Received WhatsApp payload from {From}")
        if not From or not Body:
            return {"status": "ignored"}
        
        platform_id = From.replace("whatsapp:", "")
        logger.info(f"DEBUG: User said: {Body}")

        # Identify/Create User
        user = db.query(User).filter(User.platform == "whatsapp", User.platform_id == platform_id).first()
        if not user:
            logger.info("DEBUG: Creating new WhatsApp user")
            user = User(platform="whatsapp", platform_id=platform_id)
            db.add(user)
            db.commit()
            db.refresh(user)

        # Save user message
        db.add(ChatHistory(user_id=user.id, role="user", message=Body))
        db.commit()
        
        # Get history (last 5)
        history_entries = db.query(ChatHistory).filter(ChatHistory.user_id == user.id)\
            .order_by(ChatHistory.timestamp.desc()).limit(6).all()
        history = [{"role": h.role, "message": h.message} for h in reversed(history_entries[1:])]

        # Process with Gemini
        ai_response = ai_handler.process_message(Body, history)
        logger.info(f"DEBUG: Gemini response: {ai_response}")

        final_text = ""
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
            final_text = f"Confirmed! {data.get('customer_name')}, we'll see you for {data.get('service_needed')} on {data.get('appointment_date')}."
        else:
            final_text = ai_response["content"]

        # Save AI message
        db.add(ChatHistory(user_id=user.id, role="ai", message=final_text))
        db.commit()

        # Send back
        twilio_handler.send_whatsapp_message(platform_id, final_text)
        logger.info("DEBUG: WhatsApp message sent successfully")

    except Exception as e:
        logger.error(f"CRITICAL ERROR (WhatsApp): {str(e)}")
        return {"status": "error", "message": str(e)}

    return {"status": "success"}

@router.post("/telegram")
async def telegram_webhook(
    request: Request,
    db: Session = Depends(get_db)
):
    try:
        data = await request.json()
        logger.info("DEBUG: Received payload from Telegram")
        
        if "message" not in data or "text" not in data["message"]:
            logger.info("DEBUG: Ignored non-message/non-text update")
            return {"status": "ignored"}

        chat_id = str(data["message"]["chat"]["id"])
        user_text = data["message"]["text"]
        logger.info(f"DEBUG: User said: {user_text}")

        # Identify/Create User
        user = db.query(User).filter(User.platform == "telegram", User.platform_id == chat_id).first()
        if not user:
            logger.info("DEBUG: Creating new Telegram user")
            user = User(platform="telegram", platform_id=chat_id)
            db.add(user)
            db.commit()
            db.refresh(user)

        # Save user message
        db.add(ChatHistory(user_id=user.id, role="user", message=user_text))
        db.commit()

        # Get history (last 5)
        history_entries = db.query(ChatHistory).filter(ChatHistory.user_id == user.id)\
            .order_by(ChatHistory.timestamp.desc()).limit(6).all()
        history = [{"role": h.role, "message": h.message} for h in reversed(history_entries[1:])]

        # Process with Gemini
        ai_response = ai_handler.process_message(user_text, history)
        logger.info(f"DEBUG: Gemini response: {ai_response}")

        final_text = ""
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
            final_text = f"Confirmed! {data_json.get('customer_name')}, we'll see you for {data_json.get('service_needed')} on {data_json.get('appointment_date')}."
        else:
            final_text = ai_response["content"]

        # Save AI message
        db.add(ChatHistory(user_id=user.id, role="ai", message=final_text))
        db.commit()

        # Send back
        telegram_handler.send_message(chat_id, final_text)
        logger.info("DEBUG: Telegram message sent successfully")

    except Exception as e:
        logger.error(f"CRITICAL ERROR (Telegram): {str(e)}")
        return {"status": "error", "message": str(e)}

    return {"status": "success"}
