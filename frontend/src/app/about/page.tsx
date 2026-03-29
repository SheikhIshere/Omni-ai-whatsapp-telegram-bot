/**
 * About Developer & Technical Blueprint Page
 * =========================================
 * WHY: This page serves two main purposes:
 *      1. Technical Disclosure: Explaining the architecture (FastAPI + Gemini) to stakeholders.
 *      2. Live Monitoring: Provides a dashboard for admins to view recent user interactions and chat histories.
 * WHAT: Contains technical diagram-like sections and a data-driven interaction log with modals.
 * HOW: Uses React hooks (useState/useEffect) for client-side data fetching from the backend API.
 */

"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useEffect, useState } from "react";

// --- TYPE DEFINITIONS ---
interface UserChat {
  id: number;
  platform: string;
  platform_id: string;
}

interface ChatMessage {
  role: string;
  message: string;
  timestamp: string;
}

export default function AboutPage() {
  // --- STATE MANAGEMENT ---
  // users: Holds the list of all unique customers (from WhatsApp/Telegram)
  const [users, setUsers] = useState<UserChat[]>([]);
  // selectedUser: Tracks which user's chat history is currently open in the modal
  const [selectedUser, setSelectedUser] = useState<UserChat | null>(null);
  // chatHistory: Holds the actual message tokens for the selected user
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  // loading: Handles UI feedback during asynchronous API calls
  const [loading, setLoading] = useState(false);

  // Fallback to localhost if the environment variable isn't set.
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8011";

  /**
   * Fetches the list of unique users who have talked to the bot.
   * Why: To populate the 'Recent Interactions' grid.
   */
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/api/users`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  /**
   * Fetches the full transcript for a specific user.
   * @param userId The database ID of the user.
   */
  const fetchHistory = async (userId: number) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/api/chat-history/${userId}`);
      const data = await res.json();
      setChatHistory(data);
    } catch (err) {
      console.error("Failed to fetch chat history:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial data load on component mount.
  useEffect(() => {
    fetchUsers();
  }, []);

  /**
   * Orchestrates opening the chat modal for a specific user.
   */
  const openChat = (user: UserChat) => {
    setSelectedUser(user);
    fetchHistory(user.id);
  };

  return (
    <div className="bg-background text-on-surface font-body min-h-screen">
      <Navbar />

      <main className="relative">
        {/* --- HERO SECTION: Personal Branding --- */}
        <section className="pt-20 pb-16 px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block mb-6 relative">
              <div className="w-32 h-32 relative rounded-full ring-4 ring-primary/20 overflow-hidden mx-auto shadow-2xl">
                <Image 
                  alt="Developer Profile" 
                  className="object-cover" 
                  src="/imran_rafi.png"
                  fill
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-secondary text-white p-2 rounded-full shadow-lg">
                <span className="material-symbols-outlined text-sm !fill-1">verified</span>
              </div>
            </div>
            <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-4">
              The Blueprint: Omni-Channel AI Booking Agent
            </h1>
            <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">
              A technical deep dive into the architecture powering high-trust AI interactions across web, SMS, and voice.
            </p>
          </div>
        </section>

        {/* --- ARCHITECTURE SECTION: FastAPI Explanation ---
            Why: Educates technical viewers on how the backend orchestrates calls.
        */}
        <section className="py-16 px-6 bg-surface-container-low">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="w-full md:w-1/2">
                <h2 className="font-headline text-3xl font-bold mb-6 flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-4xl">psychology</span>
                  The FastAPI Brain
                </h2>
                <p className="text-on-surface-variant mb-8 text-lg leading-relaxed">
                  The core engine is a high-performance FastAPI server orchestrating asynchronous workflows between LLMs, database vectors, and external messaging gateways.
                </p>
                {/* Flow Explanation Cards */}
                <div className="space-y-6">
                  <div className="flex gap-4 p-5 bg-white rounded-2xl shadow-sm border-l-4 border-primary">
                    <div className="bg-primary/10 text-primary w-10 h-10 rounded-lg flex items-center justify-center font-bold flex-shrink-0">01</div>
                    <div>
                      <h4 className="font-bold text-on-surface mb-1 font-headline">Semantic Ingestion</h4>
                      <p className="text-sm text-on-surface-variant">User intent is captured via Webhooks and normalized for the Gemini AI pipeline.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-5 bg-white rounded-2xl shadow-sm border-l-4 border-secondary">
                    <div className="bg-secondary/10 text-secondary w-10 h-10 rounded-lg flex items-center justify-center font-bold flex-shrink-0">02</div>
                    <div>
                      <h4 className="font-bold text-on-surface mb-1 font-headline">Prompt Engineering</h4>
                      <p className="text-sm text-on-surface-variant">System instructions ensure the agent knows specific business rules and booking patterns.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-5 bg-white rounded-2xl shadow-sm border-l-4 border-tertiary">
                    <div className="bg-tertiary/10 text-tertiary w-10 h-10 rounded-lg flex items-center justify-center font-bold flex-shrink-0">03</div>
                    <div>
                      <h4 className="font-bold text-on-surface mb-1 font-headline">Atomic Action Execution</h4>
                      <p className="text-sm text-on-surface-variant">JSON extraction triggers database entries and automated confirmation messages.</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Code Snippet Visualization */}
              <div className="w-full md:w-1/2 bg-inverse-surface rounded-3xl p-8 overflow-hidden shadow-2xl">
                <div className="flex gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-error"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                </div>
                <pre className="text-sky-400 font-mono text-sm leading-relaxed overflow-x-auto"><code>{`@app.post("/webhook/telegram")
async def telegram_webhook(request: Request, db: Session):
    # 1. Start Trace
    data = await request.json()
    user_text = data["message"]["text"]
        
    # 2. AI Processing
    ai_response = ai_handler.process_message(
        user_text, history
    )
    
    # 3. Handle Booking
    if ai_response["type"] == "booking":
        save_appointment(ai_response["data"])

    return {"status": "success"}`}</code></pre>
              </div>
            </div>
          </div>
        </section>

        {/* --- TECH STACK SECTION --- */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-[#1E293B] rounded-[2.5rem] p-10 md:p-16 relative overflow-hidden text-white shadow-2xl">
              <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <span className="text-secondary font-bold tracking-widest text-xs uppercase mb-4 block">Engineered for Performance</span>
                  <h2 className="font-headline text-4xl font-extrabold mb-6 leading-tight">The Arsenal: A Production-Ready Stack</h2>
                  <p className="text-slate-400 mb-8 leading-relaxed">
                    Every layer is chosen for low latency and high availability, ensuring the AI agent responds within sub-500ms windows.
                  </p>
                  {/* Tool Badges */}
                  <div className="flex flex-wrap gap-3">
                    <span className="px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 text-sm font-semibold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-sky-500"></span> Python / FastAPI
                    </span>
                    <span className="px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 text-sm font-semibold flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-emerald-500"></span> PostgreSQL / SQLAlchemy
                    </span>
                    <span className="px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 text-sm font-semibold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-orange-500"></span> Google Gemini 1.5 Flash
                    </span>
                    <span className="px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 text-sm font-semibold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Next.js / Tailwind CSS
                    </span>
                  </div>
                </div>
                {/* Metric Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                    <span className="material-symbols-outlined text-sky-400 mb-3">speed</span>
                    <div className="text-2xl font-bold mb-1">99.9%</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">Uptime Reliability</div>
                  </div>
                  <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                    <span className="material-symbols-outlined text-emerald-400 mb-3">security</span>
                    <div className="text-2xl font-bold mb-1">E2E</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">Encryption Standard</div>
                  </div>
                  <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                    <span className="material-symbols-outlined text-orange-400 mb-3">hub</span>
                    <div className="text-2xl font-bold mb-1">Omni</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">Multi-Channel Sync</div>
                  </div>
                  <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                    <span className="material-symbols-outlined text-indigo-400 mb-3">cloud_done</span>
                    <div className="text-2xl font-bold mb-1">Prod</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">Scalable Infrastructure</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- CTA SECTION --- */}
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-inverse-surface rounded-3xl p-12 text-center relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="font-headline text-3xl font-extrabold text-white mb-6">Need an AI architect for your next project?</h2>
                <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto">
                  I specialize in building complex, high-trust AI systems that solve real business problems.
                </p>
                <button className="bg-gradient-signature text-white px-10 py-4 rounded-xl font-bold text-lg shadow-2xl active:scale-95 transition-all flex items-center gap-3 mx-auto">
                  Message Me Directly on Upwork
                  <span className="material-symbols-outlined">launch</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* --- INTERACTION MONITORING SECTION --- 
            Why: Allows the site owner to see who talked to the bot and what was said.
        */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <h2 className="font-headline text-3xl font-bold flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary text-4xl">forum</span>
                  Recent Interactions
                </h2>
                <p className="text-on-surface-variant mt-2">Monitor live conversations across all integrated platforms.</p>
              </div>
              <button 
                onClick={fetchUsers} 
                className="flex items-center gap-2 text-primary font-bold hover:bg-primary/5 px-6 py-3 rounded-2xl border-2 border-primary/20 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined">refresh</span>
                Sync Logs
              </button>
            </div>

            {/* Grid of User Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map(user => (
                <div key={user.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-3xl">person</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-slate-900">{user.platform_id}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`w-2 h-2 rounded-full ${user.platform === 'whatsapp' ? 'bg-emerald-500' : 'bg-sky-500'}`}></span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.platform}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => openChat(user)}
                    className="w-full mt-6 py-4 rounded-2xl bg-slate-50 text-slate-600 font-bold hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-3 shadow-sm"
                  >
                    View Conversation
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                  </button>
                </div>
              ))}
              {/* Empty State */}
              {users.length === 0 && (
                <div className="col-span-full py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                  <span className="material-symbols-outlined text-6xl text-slate-300 mb-4 block">query_stats</span>
                  <p className="text-slate-500 font-medium">Waiting for incoming interactions data...</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* --- MODAL: Chat History Overlay --- 
          Why: Provides deep visibility into conversation context without leaving the page.
          How: Uses fixed positioning and a backdrop blur for a premium feel.
      */}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl h-[85vh] rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
            {/* Modal Header */}
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white/50 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <div>
                  <h3 className="font-headline text-2xl font-bold text-slate-900">{selectedUser.platform_id}</h3>
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${selectedUser.platform === 'whatsapp' ? 'bg-emerald-500' : 'bg-sky-500'}`}></span>
                    {selectedUser.platform}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedUser(null)}
                className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all shadow-sm"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Chat Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#F8FAFC]">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center gap-4 text-slate-400">
                  <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                  <p className="font-bold tracking-tight">Syncing History...</p>
                </div>
              ) : chatHistory.length > 0 ? (
                chatHistory.map((chat, idx) => (
                  <div key={idx} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-5 rounded-[1.5rem] shadow-sm text-sm leading-relaxed ${
                      chat.role === 'user' 
                        ? 'bg-primary text-white rounded-tr-none' 
                        : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                    }`}>
                      <div className="flex items-center gap-2 mb-2 opacity-50 text-[9px] font-bold uppercase tracking-tighter">
                        <span className="material-symbols-outlined text-[12px]">{chat.role === 'user' ? 'person' : 'smart_toy'}</span>
                        {chat.role === 'user' ? 'Customer' : 'AI Agent'}
                      </div>
                      <p className="font-medium whitespace-pre-wrap">{chat.message}</p>
                      <span className={`text-[10px] mt-3 block opacity-60 ${chat.role === 'user' ? 'text-right' : 'text-left'}`}>
                        {new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                /* No history found */
                <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
                  <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl">cloud_off</span>
                  </div>
                  <p className="font-bold">No Records Found</p>
                  <p className="text-xs text-center max-w-[200px]">This user hasn't initiated any conversations yet.</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-center">
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">End of Conversation Transcript</p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
