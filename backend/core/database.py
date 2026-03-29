"""
Database Infrastructure Layer
============================
WHY: This module handles the persistence of data (users, chats, appointments). 
     Without this, the AI wouldn't remember who it talked to or what it booked.
WHAT: Configures SQLAlchemy, our Object-Relational Mapper (ORM). 
      It creates the engine, session factory, and the base model class.
HOW: It reads the DATABASE_URL from settings, initializes a connection engine, 
     and provides a 'get_db' generator for dependency injection in routes.
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from core.settings import settings

# --- CONFIGURATION ---
# We retrieve the database URL (e.g., sqlite or postgres) from our settings file.
SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL
print(f"DEBUG: Using DATABASE_URL: {SQLALCHEMY_DATABASE_URL}")

# --- ENGINE CREATION ---
# Why: The engine is the root of our DB connection. 
# 'check_same_thread: False' is specifically for SQLite to allow multiple concurrent requests.
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(SQLALCHEMY_DATABASE_URL)

# --- SESSION FACTORY ---
# Why: We don't want just one connection; we want a factory that generates a new session for every request.
# autoflush=False means we explicitly control when data is written to the database.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# --- DECLARATIVE BASE ---
# Why: This is the parent class for all our models (User, Appointment, etc.).
# Any class inheriting from Base will be mapped to a database table automatically.
Base = declarative_base()

# --- DEPENDENCY INJECTION ---
def get_db():
    """
    Dependency generator for Database Sessions.
    
    How it works:
    1. It opens a new session.
    2. It yields it to the route function.
    3. Once the request is finished, it automatically closes the connection.
    
    This prevents memory leaks and ensures we don't have dangling DB connections.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
