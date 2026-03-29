"""
Webhook Ingestion Layer
=======================
WHY: This is the 'entry point' for all end-user interactions. 
     When a customer sends a message on WhatsApp or Telegram, these endpoints receive the data.
WHAT: It implements endpoints for Twilio (WhatsApp) and Telegram webhooks.
HOW: It parses the incoming payload, identifies the user in our DB, retrieves recent context, 
     asks the Gemini AI for a response, and then sends that response back to the original platform.
"""

from fastapi import APIRouter, Request, Depends, Form
from sqlalchemy.orm import Session
from core.database import get_db
from models.models import User, ChatHistory, Appointment
from utils.ai_handler import ai_handler
from utils.twilio_handler import twilio_handler
from utils.telegram_handler import telegram_handler
import logging
import json

# --- LOGGING SETUP ---
# Why: Crucial for monitoring production traffic and debugging AI response patterns.
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/webhook")

@router.post("/whatsapp")
async def whatsapp_webhook(
    request: Request,
    db: Session = Depends(get_db),
    # Twilio sends data as Form data, not JSON
    From: str = Form(None),
    Body: str = Form(None)
):
    """
    WHATSAPP HANDLER (via Twilio)
    Flow:
    1. Receive Form data from Twilio (Phone number and Message body).
    2. Normalize the phone number (platform_id).
    3. Check if user exists; if not, create them.
    4. Save the user's message to ChatHistory for context.
    5. Fetch the last few messages to give 'memory' to the AI.
    6. Send text to Gemini AI via ai_handler.
    7. If Gemini performs a 'booking' (JSON extraction), save an Appointment.
    8. Send the AI's response back to the user via Twilio API.
    """
    try:
        logger.info(f"DEBUG: Received WhatsApp payload from {From}")
        if not From or not Body:
            return {"status": "ignored"}
        
        # Twilio sends 'whatsapp:+123456789', we strip the prefix for our DB
        platform_id = From.replace("whatsapp:", "")
        logger.info(f"DEBUG: User said: {Body}")

        # --- USER IDENTIFICATION ---
        # We use (platform, platform_id) as a unique composite key to identify return customers.
        user = db.query(User).filter(User.platform == "whatsapp", User.platform_id == platform_id).first()
        if not user:
            logger.info("DEBUG: Creating new WhatsApp user")
            user = User(platform="whatsapp", platform_id=platform_id)
            db.add(user)
            db.commit()
            db.refresh(user)

        # --- PERSISTENCE: USER MESSAGE ---
        db.add(ChatHistory(user_id=user.id, role="user", message=Body))
        db.commit()
        
        # --- CONTEXT RETRIEVAL ---
        # Why: AI needs to know what was said previously to answer 'Who are you talking about?'
        history_entries = db.query(ChatHistory).filter(ChatHistory.user_id == user.id)\
            .order_by(ChatHistory.timestamp.desc()).limit(6).all()
        history = [{"role": h.role, "message": h.message} for h in reversed(history_entries[1:])]

        # --- AI CORE PROCESSING ---
        # The ai_handler is our bridge to Google Gemini 1.5 Flash.
        ai_response = ai_handler.process_message(Body, history)
        logger.info(f"DEBUG: Gemini response: {ai_response}")

        final_text = ""
        # If AI detected an intent to book (e.g., 'I want a massage tomorrow at 5pm')
        if ai_response["type"] == "booking":
            data = ai_response["data"]
            # Save the structural data into the Appointment table
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

        # --- PERSISTENCE: AI RESPONSE ---
        db.add(ChatHistory(user_id=user.id, role="ai", message=final_text))
        db.commit()
        
        # Flush the message out to the end user
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
    """
    TELEGRAM HANDLER
    Flow: Similar to WhatsApp, but Telegram sends native JSON payloads.
    It extracts the 'chat_id' ensuring we send the response back to the right person.
    """
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

        # Persistence: User message
        db.add(ChatHistory(user_id=user.id, role="user", message=user_text))
        db.commit()

        # Context retrieval
        history_entries = db.query(ChatHistory).filter(ChatHistory.user_id == user.id)\
            .order_by(ChatHistory.timestamp.desc()).limit(6).all()
        history = [{"role": h.role, "message": h.message} for h in reversed(history_entries[1:])]

        # AI Core Processing
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

        # Persistence: AI message
        db.add(ChatHistory(user_id=user.id, role="ai", message=final_text))
        db.commit()

        # Send back
        telegram_handler.send_message(chat_id, final_text)
        logger.info("DEBUG: Telegram message sent successfully")

    except Exception as e:
        logger.error(f"CRITICAL ERROR (Telegram): {str(e)}")
        return {"status": "error", "message": str(e)}

    return {"status": "success"}
