"""
Admin Management & API Layer
============================
WHY: Provides a secure interface for human administrators to monitor the AI's actions.
     It allows viewing of bookings (appointments) and raw chat transcripts.
WHAT: Implements both HTML-based dashboard and JSON-based APIs for the Next.js frontend.
HOW: Uses FastAPI APIRouter, Jinja2 for server-side rendering, and SQLAlchemy for data retrieval.
"""

from fastapi import APIRouter, Request, Depends
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from core.database import get_db
from models.models import Appointment, User, ChatHistory
from pathlib import Path

# --- TEMPLATE CONFIGURATION ---
# Why: Allows serving a simple, zero-JS HTML dashboard for quick internal status checks.
BASE_DIR = Path(__file__).resolve().parent.parent
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))

router = APIRouter(prefix="/admin")

@router.get("/dashboard")
async def dashboard(request: Request, db: Session = Depends(get_db)):
    """
    HTML DASHBOARD VIEW
    - Fetches all appointments and joins with User data.
    - Renders using the 'dashboard.html' Jinja2 template.
    """
    appointments = db.query(Appointment).join(User).all()
    return templates.TemplateResponse(
        request=request, 
        name="dashboard.html", 
        context={"appointments": appointments}
    )

@router.get("/api/appointments")
async def get_appointments(db: Session = Depends(get_db)):
    """
    JSON API: Fetch all appointments.
    Why: Used by external tools or frontend components to list bookings.
    """
    appointments = db.query(Appointment).all()
    # Simple manual serialization to ensure clean JSON output.
    return [
        {
            "id": a.id,
            "customer_name": a.customer_name,
            "service_needed": a.service_needed,
            "appointment_date": a.appointment_date,
            "customer_address": a.customer_address,
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
            "platform": u.platform,
            "platform_id": u.platform_id
        } for u in users
    ]
