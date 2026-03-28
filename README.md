# Omni-Channel AI Booking Agent

An enterprise-grade, autonomous booking assistant that integrates seamlessly with **WhatsApp** and **Telegram**. Powered by **FastAPI** and **Google Gemini 1.5 Flash**, it qualifies leads and books appointments directly into your database.

---

## 🚀 Weapon of Choice: The Tech Stack

### Backend (The Brain)
- **FastAPI**: High-performance asynchronous API framework.
- **SQLAlchemy**: Robust ORM for database management.
- **Google Gemini 1.5 Flash**: State-of-the-art AI for natural conversation and JSON extraction.
- **Twilio API**: WhatsApp Business integration.
- **Telegram Bot API**: Instant messaging connectivity.

### Frontend (The Hub)
- **Next.js 15 (App Router)**: Modern React framework for the admin dashboard.
- **Tailwind CSS v4**: Utility-first styling with "Azure Concierge" design system.
- **TypeScript**: Type-safe development for both layers.

---

## ✨ Features

- **Omni-Channel Sync**: Unified messaging flow across WhatsApp and Telegram.
- **Context-Aware AI**: Remembers previous interactions for accurate lead qualification.
- **Autonomous Booking**: Automatically extracts service, date, and contact info into a structured database.
- **Operations Hub**: Real-time admin dashboard to track bookings and system health.
- **Privacy First**: Built with high-trust data isolation and PII protection.

---

## 🛠️ Setup Instructions

### 1. Backend Configuration
1. Navigate to the `backend` directory.
2. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure your `.env` file (see [Environment Variables](#environment-variables)).
5. Start the server:
   ```bash
   python run.py --port 8011
   ```

### 2. Frontend Configuration
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file:
   ```
   NEXT_PUBLIC_API_URL=http://0.0.0.0:8011
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### 3. Docker Deployment (Optional)
If you prefer containerized deployment:
1. Ensure Docker and Docker Compose are installed.
2. Run:
   ```bash
   docker-compose up --build
   ```
   The backend will run on port 8000 and the frontend on port 3000.

### 4. Ngrok Integration (Webhook Debugging)
To receive messages from Telegram/Twilio on your local machine:
1. Start an Ngrok tunnel:
   ```bash
   ngrok http 8011
   ```
2. Update your webhook URLs in Telegram (BotFather) and Twilio Console to:
   `https://<your-ngrok-id>.ngrok-free.app/webhook/telegram`
   `https://<your-ngrok-id>.ngrok-free.app/webhook/whatsapp`

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Your Google AI Studio API Key. |
| `TELEGRAM_BOT_TOKEN` | Token from @BotFather. |
| `TWILIO_ACCOUNT_SID` | Twilio Account SID. |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token. |
| `TWILIO_PHONE_NUMBER` | Your Twilio WhatsApp Sandbox number. |
| `DATABASE_URL` | Optional (defaults to SQLite: `sqlite:///./omni_demo.db`). |

---

## 📂 Project Structure

- `backend/`: FastAPI application, models, and AI logic.
- `frontend/`: Next.js dashboard and landing page.
- `design/`: Original UI designs and reference files.
- `docs/`: Walkthroughs and implementation notes.

---
© 2024 OmniAgent AI. Built for High-Trust Interactions.
