/**
 * Omni-AI Landing Page (Home)
 * ===========================
 * WHY: This is the first experience for new users. It defines the product value
 *      and provides easy entry points for the interactive demo.
 * WHAT: A high-conversion marketing page with Hero, Bento-grid feature highlights,
 *       and trust-building (Privacy/Military grade) sections.
 * HOW: Built with Next.js App Router, using Tailwind CSS for state-of-the-art styling 
 *      (Material Design 3 tokens) and semantic HTML for SEO.
 */

"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="bg-background font-body text-on-surface">
      {/* Global Navigation - Persistent at top */}
      <Navbar />

      <main>
        {/* --- HERO SECTION ---
            Why: Capture attention in < 3 seconds.
            What: Headline + Subtext + Primary CTA.
            How: Uses a high-contrast gradient and ultra-bold typography.
        */}
        <section className="relative pt-12 md:pt-20 pb-20 md:pb-32 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto text-center">
            {/* Tech Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 md:mb-8 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase tracking-widest">
              <span className="material-symbols-outlined text-[14px] !fill-1">bolt</span>
              Powered by Gemini & FastAPI
            </div>
            {/* Main Headline */}
            <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight font-headline max-w-5xl mx-auto mb-6 md:mb-8 leading-tight">
              <span className="text-gradient-signature">Turn WhatsApp & Telegram</span>
              <br className="hidden md:block"/> into your best sales rep.
            </h1>
            <p className="text-base md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-10 md:mb-12">
              Automate lead qualification and appointment booking with enterprise-grade agents that live where your customers talk.
            </p>
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-gradient-signature text-white font-bold text-lg rounded-xl shadow-lg active:scale-95 transition-all text-center">
                Launch Interactive Demo
              </Link>
              <button className="w-full sm:w-auto px-8 py-4 border-2 border-outline-variant text-on-surface font-bold text-lg rounded-xl hover:bg-surface-container transition-all active:scale-95">
                View Tech Stack
              </button>
            </div>
          </div>

          {/* --- FEATURE PREVIEW (Bento Grid) ---
              Why: Visualizes complex concepts (AI logic) into digestible snippets.
              What: Chat bubbles + Uptime Metric.
          */}
          <div className="max-w-6xl mx-auto mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-12 gap-6 px-4">
            {/* AI Experience Preview */}
            <div className="md:col-span-8 bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-sm border border-outline-variant/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">chat_bubble</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold font-headline">Natural Conversation Engine</h3>
                </div>
                {/* Simulated Chat Interface */}
                <div className="space-y-4 mb-8">
                  <div className="asymmetric-ai bg-surface-container p-4 max-w-[90%] md:max-w-md text-xs md:text-sm">
                    "Hi! I'm interested in the premium subscription. Can I pay with crypto?"
                  </div>
                  <div className="asymmetric-user bg-primary text-white p-4 max-w-[90%] md:max-w-md ml-auto text-xs md:text-sm">
                    "Absolutely! We support BTC and ETH. Would you like me to generate a payment link for the Annual plan?"
                  </div>
                </div>
              </div>
              <div className="rounded-2xl w-full h-32 md:h-48 bg-gradient-to-r from-sky-500 to-teal-500 opacity-60 flex items-center justify-center text-white font-bold text-xl md:text-2xl text-center px-4">
                OmniAI Core Engine
              </div>
            </div>
            {/* Uptime Stat Box */}
            <div className="md:col-span-4 bg-inverse-surface text-inverse-on-surface rounded-3xl p-8 shadow-2xl flex flex-col justify-center text-center">
              <span className="material-symbols-outlined text-secondary text-5xl mb-4 !fill-1">verified_user</span>
              <h3 className="text-xl md:text-2xl font-bold font-headline mb-4">99.9% Uptime</h3>
              <p className="text-sm opacity-80 mb-8">High-performance FastAPI backends ensure your agents never sleep.</p>
              <div className="text-4xl font-extrabold text-secondary font-headline">24/7</div>
              <span className="text-[10px] uppercase tracking-widest mt-2">Active Monitoring</span>
            </div>
          </div>
        </section>

        {/* --- PROCESS SECTION (How It Works) ---
            Why: Educates the user on the technical flow.
            What: 1-2-3 Step journey.
        */}
        <section className="py-24 bg-surface-container-low">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold font-headline mb-4">How It Works</h2>
              <p className="text-on-surface-variant">Three steps to autonomous sales excellence.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1: Arrival */}
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-primary font-headline font-extrabold text-5xl mb-6 opacity-20">01</div>
                <h4 className="text-xl font-bold font-headline mb-3">Customer Messages</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-6">OmniAgent connects instantly to your WhatsApp Business or Telegram Bot API to catch every inbound lead.</p>
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                  <span className="material-symbols-outlined text-sm">forum</span>
                  Real-time Sync
                </div>
              </div>
              {/* Step 2: Processing */}
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-primary font-headline font-extrabold text-5xl mb-6 opacity-20">02</div>
                <h4 className="text-xl font-bold font-headline mb-3">AI Context Engine</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-6">Our proprietary logic feeds your business patterns into Gemini 1.5 Flash for hyper-accurate responses.</p>
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                  <span className="material-symbols-outlined text-sm">psychology</span>
                  Zero Hallucinations
                </div>
              </div>
              {/* Step 3: Result */}
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-primary font-headline font-extrabold text-5xl mb-6 opacity-20">03</div>
                <h4 className="text-xl font-bold font-headline mb-3">Auto-Booking</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-6">The agent qualifies the lead and extracts a booking JSON for immediate database entry.</p>
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                  <span className="material-symbols-outlined text-sm">event_available</span>
                  Closed-Loop Sales
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- TRUST & PRIVACY SECTION ---
            Why: Essential for B2B/Enterprise software sales.
            What: Security standards + Data masking visualization.
        */}
        <section className="py-16 md:py-20 bg-inverse-surface text-inverse-on-surface overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2">
              <div className="inline-block px-3 py-1 bg-secondary text-white text-[10px] font-bold uppercase tracking-widest rounded mb-6">Privacy First</div>
              <h2 className="text-3xl md:text-4xl font-extrabold font-headline mb-6">Military-grade data protection.</h2>
              <p className="text-slate-400 leading-relaxed mb-8 text-sm md:text-base">We anonymize all PII before it ever hits the AI engine. Your customer's data stays yours, protected by end-to-end encryption and strict data isolation protocols.</p>
              {/* Certifications icons would go here */}
              <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold">GDPR</span>
                  <span className="text-[10px] uppercase tracking-widest opacity-60">Compliant</span>
                </div>
                <div className="w-px h-10 bg-slate-700"></div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold">SOC2</span>
                  <span className="text-[10px] uppercase tracking-widest opacity-60">Certified</span>
                </div>
              </div>
            </div>
            {/* Visual proof: The Encryption Simulation */}
            <div className="md:w-1/2 w-full">
              <div className="bg-slate-900/50 backdrop-blur-md p-8 rounded-3xl border border-slate-700 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-error"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">ENCRYPTION_LAYER_v4.0</span>
                </div>
                {/* Masked Data Display */}
                <div className="space-y-4 font-mono text-xs text-slate-300">
                  <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                    <span>Incoming Number:</span>
                    <span className="text-secondary tracking-widest">+1 (***) ***-8291</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                    <span>Customer Name:</span>
                    <span className="text-secondary tracking-widest">J*** D**</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-secondary/30">
                    <span>AI Context Token:</span>
                    <span className="truncate ml-4">f7a9...d3e1_mask_active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Persistent Footer */}
      <Footer />
    </div>
  );
}
