"""
Admin Management & API Layer
============================
WHY: Provides a secure interface for human administrators to monitor the AI's actions.
     It allows viewing of bookings (appointments) and raw chat transcripts.
WHAT: Implements both HTML-based dashboard and JSON-based APIs for the Next.js frontend.
HOW: Uses FastAPI APIRouter, Jinja2 for server-side rendering, and SQLAlchemy for data retrieval.
"""

from fastapi import APIRouter, Request, Depends
from sqlalchemy.orm import Session
from core.database import get_db
from models.models import Appointment, User, ChatHistory
from pathlib import Path

# --- API ROUTER ---
router = APIRouter(prefix="/admin")

@router.get("/api/appointments")
async def get_appointments(db: Session = Depends(get_db)):
    """
    JSON API: Fetch all appointments with user details.
    Why: Used by the dashboard to show bookings with platform context.
    """
    appointments = db.query(Appointment).join(User).all()
    return [
        {
            "id": a.id,
            "customer_name": a.customer_name,
            "service_needed": a.service_needed,
            "appointment_date": a.appointment_date,
            "customer_address": a.customer_address,
            "platform": a.user.platform,
            "platform_id": a.user.platform_id,
            "created_at": a.created_at.isoformat() if a.created_at else None
        } for a in appointments
    ]

@router.get("/api/chat-history/{user_id}")
async def get_chat_history(user_id: int, db: Session = Depends(get_db)):
    """
    JSON API: Fetch full conversation history for a specific user.
    Why: Powers the 'Chat Modal' in the Next.js dashboard.
    """
    # Sort by timestamp ASC so the chat reads from top to bottom.
    history = db.query(ChatHistory).filter(ChatHistory.user_id == user_id).order_by(ChatHistory.timestamp.asc()).all()
    return [
        {
            "role": h.role,
            "message": h.message,
            "timestamp": h.timestamp.isoformat() if h.timestamp else None
        } for h in history
    ]

@router.get("/api/users")
async def get_users(db: Session = Depends(get_db)):
    """
    JSON API: Fetch list of all unique users known to the system.
    Why: Populates the sidebar/grid of people who have interacted with the bot.
    """
    users = db.query(User).all()
    return [
        {
            "id": u.id,
            "name": u.name,
            "username": u.username,
            "phone": u.phone,
            "platform": u.platform,
            "platform_id": u.platform_id,
            "last_seen": u.last_seen.isoformat() if u.last_seen else None
        } for u in users
    ]


from utils.twilio_handler import twilio_handler
import json

# Send WhatsApp Template Test
@router.post("/api/send-whatsapp-test")
async def send_whatsapp_test(request: Request):
    """
    Triggers the specific Twilio template message requested by user.
    """
    data = await request.json()
    platform_id = data.get("platform_id")
    content_sid = data.get("content_sid", "HXb5b62575e6e4ff6129ad7c8efe1f983e")
    content_variables = data.get("content_variables", '{"1":"12/1","2":"3pm"}')
    
    if not platform_id:
        return {"status": "error", "message": "Phone number (platform_id) is required"}
    
    sid = twilio_handler.send_whatsapp_template(platform_id, content_sid, content_variables)
    
    if sid:
        return {"status": "success", "message_sid": sid}
    else:
        return {"status": "error", "message": "Failed to send message. Check server logs."}

# delete user
@router.delete("/api/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return {"message": "User not found"}
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}