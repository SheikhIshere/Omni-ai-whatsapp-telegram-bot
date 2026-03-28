import requests
from core.settings import settings
import logging

class TelegramHandler:
    def __init__(self):
        self.bot_token = settings.TELEGRAM_BOT_TOKEN
        self.api_url = f"https://api.telegram.org/bot{self.bot_token}/sendMessage"

    def send_message(self, chat_id: str, text: str):
        if not self.bot_token:
            logging.error("Telegram bot token not found.")
            return False
        
        data = {
            "chat_id": chat_id,
            "text": text
        }
        
        try:
            response = requests.post(self.api_url, json=data)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logging.error(f"Error sending Telegram message: {e}")
            return False

telegram_handler = TelegramHandler()
