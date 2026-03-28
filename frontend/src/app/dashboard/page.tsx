"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";

interface Appointment {
  id: number;
  customer_name: string;
  service_needed: string;
  appointment_date: string;
  customer_address: string;
  status: string;
  created_at: string;
}

export default function DashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/api/appointments`)
      .then((res) => res.json())
      .then((data) => {
        setAppointments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch appointments:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-container-lowest border-r border-outline-variant flex flex-col p-6 space-y-8">
        <div className="text-xl font-extrabold text-sky-700 font-headline tracking-tighter">
          OmniAgent AI
        </div>
        
        <nav className="flex-1 space-y-2">
          <Link href="/dashboard" className="flex items-center space-x-3 p-3 bg-secondary/10 text-secondary rounded-xl font-bold">
            <span className="material-symbols-outlined !fill-1">dashboard</span>
            <span>Dashboard</span>
          </Link>
          <Link href="/" className="flex items-center space-x-3 p-3 text-on-surface-variant hover:bg-surface-container rounded-xl">
            <span className="material-symbols-outlined">home</span>
            <span>Landing Page</span>
          </Link>
          <Link href="/about" className="flex items-center space-x-3 p-3 text-on-surface-variant hover:bg-surface-container rounded-xl">
            <span className="material-symbols-outlined">person</span>
            <span>Developer</span>
          </Link>
        </nav>

        <div className="pt-6 border-t border-outline-variant">
          <button className="w-full flex items-center space-x-3 p-3 text-error hover:bg-error/10 rounded-xl">
            <span className="material-symbols-outlined">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="flex-1 p-8 overflow-y-auto">
          <header className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-3xl font-extrabold font-headline">Operations Hub</h1>
              <p className="text-on-surface-variant">Manage your autonomous agents and bookings.</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full relative">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
              </button>
              <div className="flex items-center space-x-3 pl-4 border-l border-outline-variant">
                <div className="text-right">
                  <div className="text-sm font-bold">Imran Rafi</div>
                  <div className="text-[10px] text-on-surface-variant uppercase tracking-widest">Admin</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">IR</div>
              </div>
            </div>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/30">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                  <span className="material-symbols-outlined">event_note</span>
                </div>
                <span className="text-emerald-500 text-xs font-bold bg-emerald-50 px-2 py-1 rounded">+12%</span>
              </div>
              <div className="text-3xl font-extrabold font-headline">{appointments.length}</div>
              <div className="text-sm text-on-surface-variant font-bold tracking-tight">Total Bookings</div>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/30">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-2xl bg-secondary/10 text-secondary">
                  <span className="material-symbols-outlined">chat</span>
                </div>
                <span className="text-emerald-500 text-xs font-bold bg-emerald-50 px-2 py-1 rounded">+4k</span>
              </div>
              <div className="text-3xl font-extrabold font-headline">218</div>
              <div className="text-sm text-on-surface-variant font-bold tracking-tight">Active Chats</div>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/30">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-2xl bg-tertiary/10 text-tertiary">
                  <span className="material-symbols-outlined">monitoring</span>
                </div>
                <span className="text-on-surface-variant text-[10px] font-bold">Uptime</span>
              </div>
              <div className="text-3xl font-extrabold font-headline text-tertiary tracking-tighter">99.98%</div>
              <div className="text-sm text-on-surface-variant font-bold tracking-tight">System Health</div>
            </div>
          </div>

          {/* Appointments Table */}
          <div className="bg-surface-container-lowest rounded-3xl shadow-sm border border-outline-variant/30 overflow-hidden mb-8">
            <div className="p-6 border-b border-outline-variant flex justify-between items-center">
              <h3 className="text-xl font-bold font-headline">Recent Appointments</h3>
              <div className="flex items-center space-x-2">
                <button className="px-4 py-2 text-xs font-bold bg-surface-container-low rounded-lg hover:bg-surface-container transition-all">Filter</button>
                <button className="px-4 py-2 text-xs font-bold bg-primary text-white rounded-lg shadow-md active:scale-95 transition-all">Export</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                  <tr>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Service</th>
                    <th className="px-6 py-4">Date & Time</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {loading ? (
                    Array(3).fill(0).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-32"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-28"></div></td>
                        <td className="px-6 py-4"><div className="h-6 bg-slate-200 rounded-full w-16"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-12"></div></td>
                      </tr>
                    ))
                  ) : appointments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-on-surface-variant italic">
                        No appointments found. Send a message to your bot to book!
                      </td>
                    </tr>
                  ) : (
                    appointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-surface-container-low/50 transition-colors group">
                        <td className="px-6 py-5">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center font-bold text-primary text-xs italic">
                              {apt.customer_name?.[0] || "?"}
                            </div>
                            <span className="font-bold text-sm tracking-tight">{apt.customer_name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm text-on-surface-variant">{apt.service_needed}</td>
                        <td className="px-6 py-5">
                          <div className="text-sm font-bold tracking-tight">{apt.appointment_date}</div>
                          <div className="text-[10px] text-on-surface-variant truncate max-w-[150px]">{apt.customer_address}</div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-tighter ${
                            apt.status === "confirmed" ? "bg-emerald-100 text-emerald-700" : "bg-primary-container text-white"
                          }`}>
                            {apt.status || "Pending"}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <Footer />
        </div>
      </main>
    </div>
  );
}
