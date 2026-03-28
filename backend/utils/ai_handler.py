from google import genai
from google.genai import types
import json
import re
from typing import Optional, Dict, Any, List
from core.settings import settings

class GeminiHandler:
    def __init__(self):
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.model_name = 'gemini-1.5-flash'
        self.system_instruction = (
            "You are a plumbing assistant. Your goal is to help users with their plumbing issues and book appointments. "
            "If the user asks a question, answer it concisely. "
            "If the user wants to book an appointment, you MUST ask for their Name, Address, and Appointment Date. "
            "DO NOT book until you have all three pieces of information. "
            "Once you have Name, Address, and Date, you MUST return a valid JSON object EXCLUSIVELY in the following format: "
            '{"booking": true, "service_needed": "Brief description of the problem", "customer_name": "User Name", '
            '"customer_address": "User Address", "appointment_date": "User Date"}. '
            "If you are still gathering information, respond with natural language text only."
        )

    def process_message(self, user_message: str, history: List[Dict[str, str]]) -> Dict[str, Any]:
        # Format history for the new google-genai SDK
        # The new SDK uses a list of Content objects
        genai_history = []
        for entry in history:
            role = "user" if entry["role"] == "user" else "model"
            genai_history.append(
                types.Content(
                    role=role,
                    parts=[types.Part(text=entry["message"])]
                )
            )

        # Use the generate_content method with system_instruction in config
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=genai_history + [types.Content(role="user", parts=[types.Part(text=user_message)])],
                config=types.GenerateContentConfig(
                    system_instruction=self.system_instruction,
                ),
            )
            response_text = response.text.strip()

            # Try to find JSON in the response
            try:
                # Look for JSON-like structure
                json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
                if json_match:
                    json_data = json.loads(json_match.group())
                    if json_data.get("booking"):
                        return {"type": "booking", "data": json_data}
                
                return {"type": "text", "content": response_text}
            except (json.JSONDecodeError, AttributeError):
                return {"type": "text", "content": response_text}
        except Exception as e:
            return {"type": "text", "content": f"Error: {str(e)}"}

ai_handler = GeminiHandler()
