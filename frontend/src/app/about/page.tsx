"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="bg-background text-on-surface font-body min-h-screen">
      <Navbar />

      <main className="relative">
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block mb-6 relative">
              <div className="w-32 h-32 rounded-full ring-4 ring-primary/20 overflow-hidden mx-auto shadow-2xl">
                <img 
                  alt="Developer Profile" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOUVadSSnUrgrw10VnCacSd5a7AvhAbp0qQiUtqM6vb1_lM79RNFKcqkK18CEfzO1k5CY7KqvT9S2LRmRyA6MVkixXsLoGtO6qj7-8dOaLCfQaoxZH-SjDzXqJqvoq2aOjJI8AyHfEdBDnqv_hUoFGspyI9Bth_xCgHWD4m2KxU6XVza14G8WJSS9FzuRJ08U2rVrvRYhrudjGljDutT9Det_y71idEPGnS-hEHxtMsfHkvORXKSYEJ4rT4wIG15987xqo21rbFyCZ"
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

        {/* The FastAPI Brain: Execution Flow */}
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
                {/* Flow Steps */}
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

        {/* The Arsenal: Tech Stack Card */}
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

        {/* Banner CTA */}
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
      </main>

      <Footer />
    </div>
  );
}
