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
  platform?: string;
  platform_id?: string;
  created_at: string;
}

interface UserChat {
  id: number;
  name?: string;
  username?: string;
  platform: string;
  platform_id: string;
  last_seen?: string;
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
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

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

  /**
   * COPY TO CLIPBOARD HELPER
   * Why: Provide a seamless way for users to grab handles/numbers.
   */
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(id);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface flex flex-col md:flex-row relative">
      {/* 
        --- MOBILE SIDEBAR OVERLAY ---
      */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 
        --- SIDEBAR NAVIGATION ---
      */}
      <aside className={`fixed md:sticky left-0 top-0 h-screen w-72 bg-slate-50 border-r border-outline-variant/30 py-8 px-4 z-50 transition-transform duration-300 md:translate-x-0 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between mb-8 px-2">
          <div>
            <h1 className="font-headline font-extrabold text-sky-700 text-lg tracking-tight">OmniAgent AI</h1>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em]">Operational Core</p>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 text-slate-400">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <nav className="space-y-1 mb-8">
          <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:text-sky-600 hover:bg-slate-100 transition-all font-semibold text-sm">
            <span className="material-symbols-outlined text-xl">home</span> Home
          </Link>
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sky-700 bg-sky-50 border-r-4 border-sky-600 font-bold text-sm">
            <span className="material-symbols-outlined text-xl !fill-1">dashboard</span> Dashboard
          </Link>          
          <Link href="/about" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:text-sky-600 hover:bg-slate-100 transition-all font-semibold text-sm">
            <span className="material-symbols-outlined text-xl">person</span> Developer
          </Link>          
        </nav>

        {/* --- RECENT INTERACTIONS (SIDEBAR FEED) --- */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          <div className="px-3 mb-4 flex items-center justify-between">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Users</h3>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[8px] font-bold text-emerald-600 uppercase">Live</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {loading ? (
               Array(5).fill(0).map((_, i) => (
                 <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse"></div>
               ))
            ) : users.length === 0 ? (
              <div className="px-3 py-10 text-center">
                <p className="text-[10px] text-slate-400 font-bold italic">No active sessions.</p>
              </div>
            ) : (
              users.map((user) => (
                <button 
                  key={user.id}
                  onClick={() => openChat(user)}
                  className={`w-full text-left p-3 rounded-xl transition-all border border-transparent hover:bg-white hover:shadow-sm hover:border-slate-200 group flex items-center gap-3 ${selectedUser?.id === user.id ? 'bg-white border-sky-200 shadow-sm' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${user.platform === 'whatsapp' ? 'bg-emerald-500' : 'bg-sky-500'}`}>
                    <span className="material-symbols-outlined text-sm">
                      {user.platform === 'whatsapp' ? 'chat' : 'send'}
                    </span>
                  </div>
                  <div className="flex-1 truncate">
                    <div className="text-xs font-bold text-slate-700 truncate">{user.name || user.platform_id}</div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                      {user.platform} • ID #{user.id} {user.name ? `• ${user.platform_id}` : ''}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-outline-variant/20">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-error hover:bg-error/10 rounded-lg text-sm font-semibold transition-colors">
            <span className="material-symbols-outlined text-xl">logout</span> Logout
          </button>
        </div>
      </aside>

      {/* --- MAIN DASHBOARD CONTENT --- */}
      <main className="flex-1 flex flex-col min-h-screen max-w-full overflow-hidden">
        {/* Mobile Header / Toggle */}
        <header className="md:hidden flex items-center justify-between px-6 py-4 bg-white border-b border-outline-variant/20 sticky top-0 z-30">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-slate-600">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <span className="font-headline font-extrabold text-sky-700">OmniAgent AI</span>
          <div className="w-8"></div> {/* Spacer for alignment */}
        </header>

        <div className="flex-1 p-4 md:p-8 space-y-8 md:space-y-12 max-w-7xl mx-auto w-full">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-tertiary rounded-full animate-pulse-soft"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary">Live System Status</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-headline text-on-surface">Agent Connectivity Hub</h1>
              <p className="text-slate-500 max-w-2xl text-sm md:text-base">Monitor real-time interactions across encrypted messaging platforms and test AI response latency.</p>
            </div>
            
            <div className="bg-surface-container rounded-xl p-1 flex gap-1">
              <button onClick={syncData} className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold bg-white shadow-sm rounded-lg text-primary active:scale-95 transition-all">
                <span className="material-symbols-outlined text-sm">refresh</span> Sync Now
              </button>
            </div>
          </div>

          {/* Instruction Cards Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* WhatsApp Instruction */}
            <div className="group relative overflow-hidden bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-sm border border-transparent hover:border-tertiary/20 transition-all">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-[60px] md:text-[80px]">chat</span>
              </div>
              <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                <div className="space-y-4">
                  <div className="w-10 md:w-12 h-10 md:h-12 rounded-2xl bg-tertiary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-tertiary font-bold">forum</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold font-headline">WhatsApp Direct Access</h3>
                  <p className="text-slate-500 text-xs md:text-sm leading-relaxed">Send "Hello Omni" to the verified business account below to trigger the concierge flow.</p>
                </div>
                <div className="flex items-center gap-3 bg-surface-container-low p-3 md:p-4 rounded-2xl">
                  {/* <span className="text-sm md:text-lg font-mono font-semibold tracking-tight text-on-surface truncate">+1 415 523 8886</span> */}
                  <span className="text-sm md:text-lg font-mono font-semibold tracking-tight text-on-surface truncate">Unavailable for now :(</span>
                  <button 
                    onClick={() => copyToClipboard("+14155238886", "whatsapp")}
                    className={`ml-auto flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1.5 border rounded-lg text-[10px] md:text-xs font-bold transition-all active:scale-90 flex-shrink-0 ${
                      copyStatus === 'whatsapp' 
                        ? 'bg-emerald-600 border-emerald-600 text-white' 
                        : 'bg-white border-outline-variant hover:bg-tertiary hover:text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px] md:text-sm">
                      {copyStatus === 'whatsapp' ? 'check' : 'content_copy'}
                    </span> 
                    {copyStatus === 'whatsapp' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>

            {/* Telegram Instruction */}
            <div className="group relative overflow-hidden bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-sm border border-transparent hover:border-primary/20 transition-all">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-[60px] md:text-[80px]">send</span>
              </div>
              <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                <div className="space-y-4">
                  <div className="w-10 md:w-12 h-10 md:h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary font-bold">send</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold font-headline">Telegram Bot Interface</h3>
                  <p className="text-slate-500 text-xs md:text-sm leading-relaxed">Search for the global handle below to start a secure encrypted session with the agent.</p>
                </div>
                <div className="flex items-center gap-3 bg-surface-container-low p-3 md:p-4 rounded-2xl">
                  <span className="text-sm md:text-lg font-mono font-semibold tracking-tight text-on-surface truncate">@Omni_demo_69_bot</span>
                  <button 
                    onClick={() => copyToClipboard("@Omni_demo_69_bot", "telegram")}
                    className={`ml-auto flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1.5 border rounded-lg text-[10px] md:text-xs font-bold transition-all active:scale-90 flex-shrink-0 ${
                      copyStatus === 'telegram' 
                        ? 'bg-primary border-primary text-white' 
                        : 'bg-white border-outline-variant hover:bg-primary hover:text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px] md:text-sm">
                      {copyStatus === 'telegram' ? 'check' : 'content_copy'}
                    </span> 
                    {copyStatus === 'telegram' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* All Interactions Section */}
          <section className="space-y-6">
             <div className="flex items-center justify-between">
              <h2 className="text-xl font-black font-headline text-slate-800">All Active Interactions</h2>
              <span className="px-4 py-1.5 bg-sky-100 rounded-full text-[10px] font-black uppercase tracking-widest text-sky-600 flex items-center gap-2">
                <span className="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></span> {users.length} Users Tracked
              </span>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto min-h-[400px]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-50 bg-slate-50/30">
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">User Identity & Name</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Platform Gateway</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Last Activity</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Operational Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {loading ? (
                      Array(5).fill(0).map((_, i) => (
                        <tr key={i} className="animate-pulse">
                          <td className="px-8 py-6"><div className="h-4 w-40 bg-slate-100 rounded"></div></td>
                          <td className="px-8 py-6"><div className="h-4 w-24 bg-slate-100 rounded"></div></td>
                          <td className="px-8 py-6"><div className="h-4 w-12 bg-slate-100 rounded"></div></td>
                          <td className="px-8 py-6 text-right"><div className="h-10 w-24 bg-slate-100 rounded ml-auto"></div></td>
                        </tr>
                      ))
                    ) : users.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-medium italic">No incoming messages detected.</td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${user.platform === 'whatsapp' ? 'bg-emerald-500 shadow-lg shadow-emerald-100' : 'bg-sky-500 shadow-lg shadow-sky-100'}`}>
                                <span className="material-symbols-outlined text-lg">
                                  {user.platform === 'whatsapp' ? 'chat' : 'send'}
                                </span>
                              </div>
                              <div className="flex flex-col">
                                <span className="font-black text-slate-800 tracking-tight">{user.name || "Unknown Identity"}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{user.platform_id} {user.username ? `(@${user.username})` : ''}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                              user.platform === 'whatsapp' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-sky-50 text-sky-600 border border-sky-100'
                            }`}>
                              {user.platform}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex flex-col">
                               <span className="text-xs font-bold text-slate-700">{user.last_seen ? new Date(user.last_seen).toLocaleDateString() : 'N/A'}</span>
                               <span className="text-[10px] font-semibold text-slate-400 uppercase">{user.last_seen ? new Date(user.last_seen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                             </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <button 
                              onClick={() => openChat(user)}
                              className="px-6 py-2.5 bg-slate-900 text-white text-xs font-black rounded-xl hover:bg-primary transition-all active:scale-95 shadow-md"
                            >
                              VIEW TRANSCRIPT
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

          {/* Booked Appointments Section */}
          <section className="space-y-6">
             <div className="flex items-center justify-between">
              <h2 className="text-xl font-black font-headline text-slate-800">Upcoming Bookings (AI Extracted)</h2>
              <span className="px-4 py-1.5 bg-emerald-100 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> {appointments.length} Appointments
              </span>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto min-h-[300px]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-50 bg-slate-50/30">
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Customer Name</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Service Needed</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Date/Time</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Address</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Platform</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {loading ? (
                      Array(3).fill(0).map((_, i) => (
                        <tr key={i} className="animate-pulse">
                          <td className="px-8 py-6"><div className="h-4 w-40 bg-slate-100 rounded"></div></td>
                          <td className="px-8 py-6"><div className="h-4 w-24 bg-slate-100 rounded"></div></td>
                          <td className="px-8 py-6"><div className="h-4 w-24 bg-slate-100 rounded"></div></td>
                          <td className="px-8 py-6"><div className="h-4 w-40 bg-slate-100 rounded"></div></td>
                          <td className="px-8 py-6 text-right"><div className="h-8 w-16 bg-slate-100 rounded ml-auto"></div></td>
                        </tr>
                      ))
                    ) : appointments.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-medium italic">No AI-booked appointments found.</td>
                      </tr>
                    ) : (
                      appointments.map((appt) => (
                        <tr key={appt.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-8 py-6 font-black text-slate-800">{appt.customer_name}</td>
                          <td className="px-8 py-6 text-sm font-bold text-sky-700">{appt.service_needed}</td>
                          <td className="px-8 py-6 text-sm text-slate-600 italic font-medium">{appt.appointment_date}</td>
                          <td className="px-8 py-6 text-xs text-slate-500 max-w-[200px] truncate">{appt.customer_address}</td>
                          <td className="px-8 py-6 text-right">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                              appt.platform === 'whatsapp' ? 'bg-emerald-100 text-emerald-700' : 'bg-sky-100 text-sky-700'
                            }`}>
                              {appt.platform}
                            </span>
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-sky-600 text-sm font-bold">group</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Users</span>
              <div className="text-2xl font-black font-headline text-slate-800">{users.length}</div>
            </div>
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-emerald-600 text-sm font-bold">calendar_today</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Bookings</span>
              <div className="text-2xl font-black font-headline text-slate-800">{appointments.length}</div>
            </div>
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-amber-600 text-sm font-bold">bolt</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Avg Latency</span>
              <div className="text-2xl font-black font-headline text-slate-800">1.2s</div>
            </div>
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-rose-600 text-sm font-bold">query_stats</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Success Rate</span>
              <div className="text-2xl font-black font-headline text-slate-800">99.9%</div>
            </div>
          </div>
        </div>
        <Footer />
      </main>

      {/* --- MODAL OVERLAY: Chat Transcript --- */}
      {selectedUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center md:p-4 bg-black/60 animate-in fade-in duration-300">
          <div className="bg-surface-bright w-full h-full md:h-auto md:max-w-2xl md:rounded-3xl shadow-2xl flex flex-col md:max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-300 border border-outline-variant/30">
            {/* Modal Header */}
            <header className="flex items-center justify-between px-6 py-5 border-b border-surface-container bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg hidden sm:block">
                  <span className="material-symbols-outlined text-primary">chat_bubble</span>
                </div>
                <div>
                  <h2 className="font-headline font-bold text-base md:text-lg tracking-tight text-on-surface truncate max-w-[200px] sm:max-w-none">Chat Transcript: {selectedUser.name || selectedUser.platform_id}</h2>
                  <p className="md:hidden text-[9px] font-bold text-slate-400 uppercase tracking-widest">{selectedUser?.platform}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedUser(null)}
                className="text-slate-500 hover:bg-slate-100 p-2 rounded-full transition-colors active:scale-95"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </header>

            {/* Scrollable Chat Feed */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-surface">
              {loadingHistory ? (
                <div className="flex flex-col items-center justify-center h-40 gap-4 text-slate-400">
                  <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                  <p className="text-[10px] font-bold uppercase tracking-widest">Retrieving History...</p>
                </div>
              ) : chatHistory.length > 0 ? (
                chatHistory.map((chat, idx) => (
                  <div key={idx} className={`flex flex-col ${chat.role === 'user' ? 'items-end' : 'items-start'} space-y-1`}>
                    <div className={`${
                      chat.role === 'user' 
                        ? 'bg-tertiary text-white asymmetric-user' 
                        : 'bg-primary text-white asymmetric-ai'
                    } p-4 md:p-5 max-w-[85%] md:max-w-[80%] shadow-sm`}>
                      <p className="text-sm md:text-[15px] leading-relaxed font-medium">{chat.message}</p>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-outline px-1">
                      {new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {chat.role === 'user' ? 'USER' : 'CONCIERGE'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                   <p className="text-sm italic font-medium">No messages found in this session.</p>
                </div>
              )}

              {/* System Badge */}
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
            <footer className="px-6 py-4 bg-surface-container-low flex flex-col sm:flex-row gap-3 justify-between border-t border-surface-container">
              {selectedUser.platform === 'whatsapp' && (
                <button 
                  onClick={async () => {
                    const res = await fetch(`${API_URL}/admin/api/send-whatsapp-test`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ platform_id: selectedUser.platform_id })
                    });
                    const data = await res.json();
                    if (data.status === 'success') {
                      alert("Template sent successfully! SID: " + data.message_sid);
                    } else {
                      alert("Error: " + data.message);
                    }
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 text-white font-bold text-sm rounded-lg hover:bg-emerald-700 transition-all active:scale-95 shadow-md flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">magic_button</span>
                  SEND TEST TEMPLATE
                </button>
              )}
              <button 
                onClick={() => setSelectedUser(null)}
                className="w-full sm:w-auto px-10 py-2.5 bg-on-surface text-white font-bold text-sm rounded-lg hover:opacity-90 transition-all active:scale-95 shadow-md"
              >
                Close
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
