"""
Omni-AI Booking Agent - Backend Entry Point
===========================================
WHY: This file serves as the main execution script that boots up the entire backend ecosystem.
WHAT: It initializes the FastAPI application, sets up CORS policies, connects to the database,
      and orchestrates the routing for webhooks and admin functionalities.
HOW: It uses Uvicorn as an ASGI server to listen for incoming requests and distributes them
      to the appropriate routers (webhooks for bot interactions and admin for data management).
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from api import webhooks, admin
from core.database import engine, Base
from core.limiter import limiter
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler
import uvicorn

# --- APP CONFIGURATION ---
# The FastAPI instance is the core object that handles all routing and middleware logic.
app = FastAPI(
    title="Omni-AI Booking Agent",
    description="A production-ready AI agent backend for automated bookings via WhatsApp & Telegram.",
    version="1.0.0"
)

# --- RATE LIMITING ---
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.middleware("http")
async def capture_request_body(request: Request, call_next):
    """
    PRE-PROCESSING: This middleware reads Form or JSON data and attaches it 
    to the 'request.state' so the rate-limiter can see WHO is messaging.
    """
    request.state.form_data = None
    request.state.json_data = None
    
    # Check Content-Type to decide how to parse
    content_type = request.headers.get("Content-Type", "")
    if "application/x-www-form-urlencoded" in content_type:
        request.state.form_data = await request.form()
    elif "application/json" in content_type:
        try:
            request.state.json_data = await request.json()
        except:
            pass
            
    response = await call_next(request)
    return response

# --- SECURITY: CORS (Cross-Origin Resource Sharing) ---
# Why: This allows our frontend (Next.js) to talk to this backend when they are on different domains/ports.
# In a production environment, you should replace ["*"] with the specific frontend URL for security.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], # Allows GET, POST, PUT, DELETE, etc.
    allow_headers=["*"], # Allows all headers (e.g., Auth tokens)
)

# --- ROUTE REGISTRATION ---
# Modular design: splitting logic into separate files for better maintainability.
app.include_router(webhooks.router) # Handles incoming messages from bot platforms
app.include_router(admin.router)    # Handles the dashboard and management APIs

@app.get("/")
async def root():
    """
    Health check endpoint.
    Verifies that the server is alive and reachable.
    """
    return {
        "status": "online",
        "message": "Omni-AI Booking Agent API is running.",
        "dashboard_link": "/admin/dashboard"
    }

if __name__ == "__main__":
    """
    RUNNER BLOCK: Executed only when the script is run directly.
    It reads the PORT from environment variables (useful for Docker/Deployments) 
    and starts the uvicorn server.
    """
    import os
    # Port 8011 is customized to avoid conflicts with common 8080/8000 ports.
    port = int(os.environ.get("PORT", 8011))
    uvicorn.run("run:app", host="0.0.0.0", port=port, reload=False)
