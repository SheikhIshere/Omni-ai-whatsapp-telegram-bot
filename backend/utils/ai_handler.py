"""
AI Orchestration Layer (Gemini 1.5 Flash)
=========================================
WHY: This is the 'Brain' of the system. It handles NLU (Natural Language Understanding) 
     and converts human conversation into structured business data (Bookings).
WHAT: A wrapper around Google's Generative AI SDK (Gemini).
HOW: It maintains a system prompt that instructs the AI to behave as a plumbing assistant.
     It tracks conversation state and uses Regex to extract JSON when a booking is ready.
"""

from google import genai
from google.genai import types
import json
import re
from typing import Optional, Dict, Any, List
from core.settings import settings
from .characteristics import get_character

class GeminiHandler:
    """
    Handles all interactions with Google Gemini.
    - System Instruction: Hardcodes the AI's 'personality' and business rules.
    - process_message: The main entry point for turning text + context into AI responses.
    """
    def __init__(self):
        # Initialize the Google GenAI client using the API key from settings.
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        # Using Gemini 1.5 Flash for the best balance of speed and reasoning.
        
        self.model_name = 'gemma-3-27b-it'        
        
        # Why: This defines EXACTLY how the AI should behave.
        # It forces the AI to collect specific fields (Name, Address, Date) 
        # and output a machine-readable JSON format when complete.
        self.system_instruction = get_character("plumber")

    def process_message(self, user_message: str, history: List[Dict[str, str]]) -> Dict[str, Any]:
        """
        Processes a single message within the context of the conversation history.
        
        1. Limits history to avoid context overflow.
        2. Injects system instructions as a 'fake turn' for model compliance.
        3. Calls the generation API and parses structured JSON output.
        """
        # Limit history to last 10 turns to avoid context overflow with Gemma
        history = history[-10:]

        # Inject system prompt as fake first turn (Gemma 3 compatibility)
        genai_history = [
            types.Content(
                role="user",
                parts=[types.Part(text=self.system_instruction)]
            ),
            types.Content(
                role="model",
                parts=[types.Part(text="Understood! I am ready to assist customers as a professional plumbing service assistant.")]
            )
        ]

        # Append real conversation history after the injected system turn
        for entry in history:
            role = "user" if entry["role"] == "user" else "model"
            genai_history.append(
                types.Content(role=role, parts=[types.Part(text=entry["message"])])
            )

        # --- AI INFERENCE ---
        try:
            # We combine historical context + the latest user message.
            # config is intentionally empty here as instructions are now in-line.
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=genai_history + [
                    types.Content(role="user", parts=[types.Part(text=user_message)])
                ],
                config=types.GenerateContentConfig(), 
            )
            response_text = response.text.strip()

            # --- DATA EXTRACTION ---
            try:
                json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
                if json_match:
                    json_data = json.loads(json_match.group())
                    if json_data.get("booking"):
                        return {"type": "booking", "data": json_data}
                
                # If no JSON found, it's just a normal conversational response.
                return {"type": "text", "content": response_text}
            except (json.JSONDecodeError, AttributeError):
                return {"type": "text", "content": response_text}
        
        except Exception as e:
            # ERROR HANDLING
            from .logger import logger
            logger.error(f"AI CORE FAILURE: {str(e)}")
            return {"type": "text", "content": "I'm having a little trouble connecting to my brain right now. Can you try again in a few minutes?"}

# Singleton instance of the handler
ai_handler = GeminiHandler()

