/**
 * Agent Connectivity Hub (Unified Dashboard)
 * =========================================
 * WHY: This is the operational nerve center where admins monitor AI-customer interactions
 *      across WhatsApp and Telegram in real-time.
 * WHAT: Features specific instruction cards for channel access, a live connection feed,
 *       and a detailed chat transcript modal.
 * HOW: Derived from the "live_demo_dashboard_unified" & "detailed_chat_transcript_modal" designs.
 */

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";

// --- TYPE DEFINITIONS ---
interface Appointment {
  id: number;
  customer_name: string;
  service_needed: string;
  appointment_date: string;
  customer_address: string;
  status: string;
  created_at: string;
}

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

export default function DashboardPage() {
  // --- STATE MANAGEMENT ---
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [users, setUsers] = useState<UserChat[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserChat | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8011";

  /**
   * INITIAL DATA SYNC
   * Why: Pulls both appointments (for metrics) and users (for the connection feed).
   */
  const syncData = async () => {
    try {
      const [apptsRes, usersRes] = await Promise.all([
        fetch(`${API_URL}/admin/api/appointments`),
        fetch(`${API_URL}/admin/api/users`)
      ]);
      const apptsData = await apptsRes.json();
      const usersData = await usersRes.json();
      setAppointments(apptsData);
      setUsers(usersData);
      setLoading(false);
    } catch (err) {
      console.error("CRITICAL: Failed to synchronize dashboard data:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    syncData();
    // Optional: Refresh data every 30 seconds for "Live Feed" effect
    const interval = setInterval(syncData, 30000);
    return () => clearInterval(interval);
  }, []);

  /**
   * FETCH CHAT TRANSCRIPT
   * Why: Power the detailed modal view for a specific user.
   */
  const fetchHistory = async (userId: number) => {
    setLoadingHistory(true);
    try {
      const res = await fetch(`${API_URL}/admin/api/chat-history/${userId}`);
      const data = await res.json();
      setChatHistory(data);
    } catch (err) {
      console.error("Failed to fetch chat history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const openChat = (user: UserChat) => {
    setSelectedUser(user);
    fetchHistory(user.id);
  };

  return (
    <div className="min-h-screen bg-surface flex">
      {/* 
        --- SIDEBAR NAVIGATION ---
        Design Ref: Shared SideNav Component
      */}
      <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-slate-50 border-r border-outline-variant/30 py-8 px-4 z-40">
        <div className="mb-8 px-2">
          <h1 className="font-headline font-extrabold text-sky-700 text-lg">OmniAgent AI</h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Operational Core</p>
        </div>
        
        <nav className="flex-1 space-y-1">
          <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:text-sky-600 hover:bg-slate-100 transition-all font-semibold text-sm">
            <span className="material-symbols-outlined">home</span> Features
          </Link>
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sky-700 bg-sky-50 border-r-4 border-sky-600 font-semibold text-sm">
            <span className="material-symbols-outlined !fill-1">dashboard</span> Dashboard
          </Link>          
          <Link href="/about" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:text-sky-600 hover:bg-slate-100 transition-all font-semibold text-sm">
            <span className="material-symbols-outlined">person</span> About Developer
          </Link>          
        </nav>

        <div className="mt-auto pt-6 border-t border-outline-variant/20">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-error hover:bg-error/10 rounded-lg text-sm font-semibold">
            <span className="material-symbols-outlined">logout</span> Logout
          </button>
        </div>
      </aside>

      {/* --- MAIN DASHBOARD CONTENT --- */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <div className="flex-1 p-8 space-y-12 max-w-7xl mx-auto w-full">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-tertiary rounded-full animate-pulse-soft"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary">Live System Status</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight font-headline text-on-surface">Agent Connectivity Hub</h1>
              <p className="text-slate-500 max-w-2xl">Monitor real-time interactions across encrypted messaging platforms and test AI response latency.</p>
            </div>
            
            <div className="bg-surface-container rounded-xl p-1 flex gap-1">
              <button onClick={syncData} className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-white shadow-sm rounded-lg text-primary active:scale-95 transition-all">
                <span className="material-symbols-outlined text-sm">refresh</span> Sync Now
              </button>
            </div>
          </div>

          {/* Instruction Cards Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* WhatsApp Instruction */}
            <div className="group relative overflow-hidden bg-surface-container-lowest rounded-3xl p-8 shadow-sm border border-transparent hover:border-tertiary/20 transition-all">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-[80px]">chat</span>
              </div>
              <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-tertiary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-tertiary font-bold">forum</span>
                  </div>
                  <h3 className="text-xl font-bold font-headline">WhatsApp Direct Access</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">Send "Hello Omni" to the verified business account below to trigger the concierge flow.</p>
                </div>
                <div className="flex items-center gap-3 bg-surface-container-low p-4 rounded-2xl">
                  <span className="text-lg font-mono font-semibold tracking-tight text-on-surface">Unavailable for now</span>
                  <button className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-white border border-outline-variant rounded-lg text-xs font-bold hover:bg-tertiary hover:text-white transition-all active:scale-90">
                    <span className="material-symbols-outlined text-sm">content_copy</span> Copy
                  </button>
                </div>
              </div>
            </div>

            {/* Telegram Instruction */}
            <div className="group relative overflow-hidden bg-surface-container-lowest rounded-3xl p-8 shadow-sm border border-transparent hover:border-primary/20 transition-all">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-[80px]">send</span>
              </div>
              <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary font-bold">send</span>
                  </div>
                  <h3 className="text-xl font-bold font-headline">Telegram Bot Interface</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">Search for the global handle below to start a secure encrypted session with the agent.</p>
                </div>
                <div className="flex items-center gap-3 bg-surface-container-low p-4 rounded-2xl">
                  <span className="text-lg font-mono font-semibold tracking-tight text-on-surface">@Omni_demo_69_bot</span>
                  <button className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-white border border-outline-variant rounded-lg text-xs font-bold hover:bg-primary hover:text-white transition-all active:scale-90">
                    <span className="material-symbols-outlined text-sm">content_copy</span> Copy
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Live Connection Feed (Mapping Users) */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-headline">Live Connection Feed</h2>
              <span className="px-3 py-1 bg-surface-container-high rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-500">Auto-Refresh Active</span>
            </div>
            
            <div className="overflow-hidden bg-surface-container-lowest rounded-3xl shadow-sm border border-slate-100">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-surface-container-low/50">
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 font-label">User / Identity</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 font-label">Platform</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 font-label">Status</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 font-label">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {loading ? (
                      Array(3).fill(0).map((_, i) => (
                        <tr key={i} className="animate-pulse">
                          <td className="px-6 py-6"><div className="h-10 w-40 bg-slate-100 rounded-lg"></div></td>
                          <td className="px-6 py-6"><div className="h-6 w-24 bg-slate-100 rounded-full"></div></td>
                          <td className="px-6 py-6"><div className="h-4 w-20 bg-slate-100 rounded"></div></td>
                          <td className="px-6 py-6"><div className="h-10 w-32 bg-slate-100 rounded-lg"></div></td>
                        </tr>
                      ))
                    ) : users.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">No connections recorded.</td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                <span className="material-symbols-outlined">person</span>
                              </div>
                              <div>
                                <div className="text-sm font-bold text-on-surface">{user.platform_id}</div>
                                <div className="text-[10px] font-medium text-slate-400 uppercase">User Index: #{user.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-6">
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full w-fit ${
                              user.platform === 'whatsapp' ? 'bg-tertiary/10 text-tertiary' : 'bg-primary/10 text-primary'
                            }`}>
                              <span className="material-symbols-outlined text-sm font-bold">
                                {user.platform === 'whatsapp' ? 'chat' : 'send'}
                              </span>
                              <span className="text-xs font-bold capitalize">{user.platform}</span>
                            </div>
                          </td>
                          <td className="px-6 py-6">
                            <div className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 bg-tertiary rounded-full"></div>
                              <span className="text-xs font-semibold text-tertiary">Active Engagement</span>
                            </div>
                          </td>
                          <td className="px-6 py-6 text-right">
                             <button 
                               onClick={() => openChat(user)}
                               className="px-4 py-2 text-xs font-bold text-primary border border-primary/20 rounded-lg hover:bg-primary hover:text-white transition-all active:scale-95"
                             >
                               View Chat Details
                             </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Stats Overview Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-surface-container-low p-6 rounded-3xl space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Success Rate</span>
              <div className="text-2xl font-extrabold font-headline">99.9%</div>
              <div className="text-[10px] font-bold text-tertiary">+12% this hour</div>
            </div>
            <div className="bg-surface-container-low p-6 rounded-3xl space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Bookings</span>
              <div className="text-2xl font-extrabold font-headline">{appointments.length}</div>
              <div className="text-[10px] font-bold text-tertiary">Real-time Data</div>
            </div>
            <div className="bg-surface-container-low p-6 rounded-3xl space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Avg Response</span>
              <div className="text-2xl font-extrabold font-headline">1.2s</div>
              <div className="text-[10px] font-bold text-slate-400">Last 24 hours</div>
            </div>
            <div className="bg-surface-container-low p-6 rounded-3xl space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Active Agents</span>
              <div className="text-2xl font-extrabold font-headline">1</div>
              <div className="text-[10px] font-bold text-primary">Scalable Load</div>
            </div>
          </div>
        </div>
        <Footer />
      </main>

      {/* --- MODAL OVERLAY: Chat Transcript ---
          Design Ref: detailed_chat_transcript_modal
      */}
      {selectedUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-surface-bright w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-outline-variant/30 animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <header className="flex items-center justify-between px-6 py-5 border-b border-surface-container">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">chat_bubble</span>
                </div>
                <h2 className="font-headline font-bold text-lg tracking-tight text-on-surface">Chat Transcript: {selectedUser.platform_id}</h2>
              </div>
              <button 
                onClick={() => setSelectedUser(null)}
                className="text-slate-400 hover:text-on-surface hover:bg-slate-100 p-2 rounded-full transition-colors active:scale-95"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </header>

            {/* Scrollable Chat Feed */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-surface/30">
              {loadingHistory ? (
                <div className="flex flex-col items-center justify-center h-40 gap-4 text-slate-400">
                  <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                  <p className="text-xs font-bold uppercase tracking-widest">Decrypting Session...</p>
                </div>
              ) : chatHistory.length > 0 ? (
                chatHistory.map((chat, idx) => (
                  <div key={idx} className={`flex flex-col ${chat.role === 'user' ? 'items-end' : 'items-start'} space-y-1`}>
                    <div className={`${
                      chat.role === 'user' 
                        ? 'bg-tertiary text-white asymmetric-user' 
                        : 'bg-primary text-white asymmetric-ai'
                    } p-4 max-w-[85%] shadow-sm`}>
                      <p className="text-[15px] leading-relaxed font-medium">{chat.message}</p>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-outline px-1">
                      {new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {chat.role === 'user' ? 'USER' : 'CONCIERGE'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                   <p className="text-sm italic">Session initiated. Waiting for data...</p>
                </div>
              )}

              {/* System Badge example for visualization (Shows if we have appointments) */}
              {appointments.some(a => a.customer_name && chatHistory.some(m => m.message.includes(a.customer_name))) && (
                <div className="flex justify-center my-4">
                  <div className="bg-secondary/10 border border-secondary/20 rounded-full px-4 py-1.5 flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-sm !fill-1">check_circle</span>
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">JSON Booking Extracted ✓</span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <footer className="px-6 py-4 bg-surface-container-low flex justify-end border-t border-surface-container">
              <button 
                onClick={() => setSelectedUser(null)}
                className="px-6 py-2.5 bg-on-surface text-surface-bright font-bold text-sm rounded-xl hover:opacity-90 transition-all active:scale-95 shadow-md"
              >
                Close Transcript
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
