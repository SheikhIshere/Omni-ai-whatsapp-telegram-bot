from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional
from pathlib import Path

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./omni_demo.db"
    GEMINI_API_KEY: str
    TELEGRAM_BOT_TOKEN: str
    SECRET_KEY: str
    
    # Optional OpenAI key if needed in future
    OPENAI_API_KEY: Optional[str] = None
    
    # Twilio Credentials (User will need to add these to .env)
    TWILIO_ACCOUNT_SID: Optional[str] = None
    TWILIO_AUTH_TOKEN: Optional[str] = None
    TWILIO_WHATSAPP_NUMBER: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=str(Path(__file__).resolve().parent.parent / ".env"), 
        extra="ignore"
    )

settings = Settings()
