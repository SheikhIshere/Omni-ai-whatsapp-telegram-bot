from fastapi import APIRouter, Request, Depends
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from core.database import get_db
from models.models import Appointment, User, ChatHistory
from pathlib import Path

# Get project root
BASE_DIR = Path(__file__).resolve().parent.parent
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))

router = APIRouter(prefix="/admin")

@router.get("/dashboard")
async def dashboard(request: Request, db: Session = Depends(get_db)):
    appointments = db.query(Appointment).join(User).all()
    return templates.TemplateResponse(
        request=request, 
        name="dashboard.html", 
        context={"appointments": appointments}
    )

@router.get("/api/appointments")
async def get_appointments(db: Session = Depends(get_db)):
    appointments = db.query(Appointment).all()
    # Simple serialization
    return [
        {
            "id": a.id,
            "customer_name": a.customer_name,
            "service_needed": a.service_needed,
            "appointment_date": a.appointment_date,
            "customer_address": a.customer_address,
            "status": a.status,
            "created_at": a.created_at.isoformat() if a.created_at else None
        } for a in appointments
    ]

@router.get("/api/chat-history/{user_id}")
async def get_chat_history(user_id: int, db: Session = Depends(get_db)):
    history = db.query(ChatHistory).filter(ChatHistory.user_id == user_id).order_by(ChatHistory.timestamp.asc()).all()
    return [
        {
            "role": h.role,
            "message": h.message,
            "timestamp": h.timestamp.isoformat() if h.timestamp else None
        } for h in history
    ]
