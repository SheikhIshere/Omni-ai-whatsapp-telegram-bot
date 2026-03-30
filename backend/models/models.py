"""
Data Models (Database Schema)
=============================
WHY: Defines the structure of our data. It tells SQLAlchemy how to map Python classes
     to SQL tables.
WHAT: Contains definitions for Users, ChatHistory, and Appointments.
HOW: Uses SQLAlchemy's Declarative mapping to define columns and relationships.
"""

from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from core.database import Base

class User(Base):
    """
    The core entity representing a person interacting with the bot.
    - Each user is identified by the platform they use (WhatsApp/Telegram).
    - platform_id is their unique identifier on that platform (Phone or Chat ID).
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    platform = Column(String)  # "whatsapp" or "telegram"
    platform_id = Column(String, unique=True, index=True) 
    
    # NEW: Metadata for better CRM / Dashboard visibility
    name = Column(String, nullable=True)      # Real name (if detectable)
    username = Column(String, nullable=True)  # Platform handle (@username)
    phone = Column(String, nullable=True)     # Phone number
    last_seen = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships: One user can have many chat records and many appointments.
    chat_history = relationship("ChatHistory", back_populates="user")
    appointments = relationship("Appointment", back_populates="user")

class ChatHistory(Base):
    """
    Stores individual messages for context and logging.
    - role: differentiates if the message was sent by the 'user' or the 'ai'.
    - timestamp: essential for sorting messages in the correct conversation order.
    """
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    role = Column(String)  # "user" or "ai"
    message = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="chat_history")

class Appointment(Base):
    """
    Represents a successful booking event extracted by the AI.
    - service_needed: what the customer wants (e.g., 'Massage').
    - appointment_date: extracted date/time for the service.
    - customer_details: normalized info retrieved from the conversation.
    """
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    service_needed = Column(String)
    appointment_date = Column(String)  # Stored as string for flexibility with AI output
    customer_name = Column(String)
    customer_address = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="appointments")
