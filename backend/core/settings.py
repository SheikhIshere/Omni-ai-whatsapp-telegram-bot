"""
Application Configuration (Environment Secrets)
==============================================
WHY: Centralizes all sensitive keys and app-wide settings in one place. 
     This prevents secrets from being leaked in the code and allows for
     different environments (dev, prod, test).
WHAT: A Pydantic-based settings class that reads from a .env file.
HOW: Uses 'pydantic-settings' to automatically map environment variables to Python types.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional
from pathlib import Path

class Settings(BaseSettings):
    """
    Schema for all required and optional environment variables.
    - DATABASE_URL: Local or remote SQL connection string.
    - API_KEYS: Tokens for third-party AI and messaging providers.
    - SECRET_KEY: Used for session security and data encryption protocols.
    """
    DATABASE_URL: str = "sqlite:///./omni_demo.db"
    
    # --- AI PROVIDERS ---
    GEMINI_API_KEY: str # REQUIRED: From Google AI Studio
    OPENAI_API_KEY: Optional[str] = None # Optional fallback
    
    # --- MESSAGING GATEWAYS ---
    TELEGRAM_BOT_TOKEN: str # From @BotFather
    TWILIO_ACCOUNT_SID: Optional[str] = None # From Twilio Console
    TWILIO_AUTH_TOKEN: Optional[str] = None 
    TWILIO_WHATSAPP_NUMBER: Optional[str] = None # e.g., 'whatsapp:+1415...'

    # Security salt/key
    SECRET_KEY: str # REQUIRED: Used for app integrity

    # We tell Pydantic to look for a file named '.env' in the backend root.
    model_config = SettingsConfigDict(
        env_file=str(Path(__file__).resolve().parent.parent / ".env"), 
        extra="ignore" # Ignore extra env vars we don't need
    )

# Single, app-wide settings object (Singleton)
settings = Settings()
