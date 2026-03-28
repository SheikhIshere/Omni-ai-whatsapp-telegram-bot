from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import webhooks, admin
from core.database import engine, Base
import uvicorn

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Omni-AI Booking Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development, broaden this if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(webhooks.router)
app.include_router(admin.router)

@app.get("/")
async def root():
    return {"message": "Omni-AI Booking Agent API is running. Access /admin/dashboard for appointments."}

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("run:app", host="0.0.0.0", port=port, reload=True)
