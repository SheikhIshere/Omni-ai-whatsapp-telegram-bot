"""
Omni-AI Booking Agent - Backend Entry Point
===========================================
WHY: This file serves as the main execution script that boots up the entire backend ecosystem.
WHAT: It initializes the FastAPI application, sets up CORS policies, connects to the database,
      and orchestrates the routing for webhooks and admin functionalities.
HOW: It uses Uvicorn as an ASGI server to listen for incoming requests and distributes them
      to the appropriate routers (webhooks for bot interactions and admin for data management).
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import webhooks, admin
from core.database import engine, Base
import uvicorn

# --- APP CONFIGURATION ---
# The FastAPI instance is the core object that handles all routing and middleware logic.
app = FastAPI(
    title="Omni-AI Booking Agent",
    description="A production-ready AI agent backend for automated bookings via WhatsApp & Telegram.",
    version="1.0.0"
)

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
    uvicorn.run("run:app", host="0.0.0.0", port=port, reload=True)
