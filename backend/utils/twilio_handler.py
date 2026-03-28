from twilio.rest import Client
from core.settings import settings
import logging

class TwilioHandler:
    def __init__(self):
        self.client = None
        if settings.TWILIO_ACCOUNT_SID and settings.TWILIO_AUTH_TOKEN:
            self.client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        self.from_whatsapp_number = settings.TWILIO_WHATSAPP_NUMBER

    def send_whatsapp_message(self, to_number: str, message_body: str):
        if not self.client:
            logging.error("Twilio client not initialized. Check TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN.")
            return False
        
        try:
            # Twilio WhatsApp numbers are prefixed with 'whatsapp:'
            if not to_number.startswith("whatsapp:"):
                to_number = f"whatsapp:{to_number}"
            
            from_number = self.from_whatsapp_number
            if not from_number.startswith("whatsapp:"):
                from_number = f"whatsapp:{from_number}"

            message = self.client.messages.create(
                body=message_body,
                from_=from_number,
                to=to_number
            )
            return message.sid
        except Exception as e:
            logging.error(f"Error sending Twilio message: {e}")
            return False

twilio_handler = TwilioHandler()
