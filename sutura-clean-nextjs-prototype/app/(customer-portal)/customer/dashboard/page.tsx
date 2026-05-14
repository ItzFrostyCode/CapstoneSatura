'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Scissors, Clock, ChevronRight, Star, Ruler, Calendar, ArrowUpRight, 
  CheckCircle2, AlertCircle, X, MapPin, Sparkles, MessageSquare,
  TrendingUp, Award, Zap
} from "lucide-react";
import { useERPStore } from "@/store/useERPStore";

// --- BOOKING MODAL ---
const BookConsultationModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { currentShop, addAppointment } = useERPStore();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00 AM");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleBook = () => {
    if (!date) return alert("Please select a date");
    addAppointment({
      branch_id: "BRN-001",
      customer: "CUST-001",
      email: "unknown@example.com",
      phone: "000-000-0000",
      type: "Consultation",
      category: "Initial Design",
      status: "Pending Review",
      source: "Online",
      date: date,
      startTime: time,
      duration: 45,
      notes: notes,
      staff: "Unassigned"
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[500px] rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Request Consultation</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400"><X size={24} /></button>
        </div>

        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Date</label>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-14 px-5 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Preferred Time</label>
            <select 
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full h-14 px-5 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold appearance-none"
            >
              {["10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Design Notes</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe your vision..."
              className="w-full h-32 p-5 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-medium resize-none"
            />
          </div>

          <button 
            onClick={handleBook}
            className="w-full h-16 bg-slate-900 text-emerald-400 rounded-2xl text-[15px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl active:scale-95"
          >
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default function CustomerDashboard() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const { appointments, getEnrichedOrders } = useERPStore();
  
  const activeOrders = getEnrichedOrders().filter(o => !["RELEASED", "CANCELLED"].includes(o.status));
  const upcomingApts = appointments.filter(a => new Date(a.date) >= new Date()).slice(0, 3);

  return (
    <div className="max-w-[1200px] mx-auto py-8 font-outfit animate-in fade-in duration-700">
      <BookConsultationModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
      
      {/* WELCOME HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-md border border-emerald-100">
              Verified Client
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
              <MapPin size={10} /> Manila Studio
            </span>
          </div>
          <h1 className="text-[42px] font-black text-slate-900 tracking-tight leading-none">
            Hello, <span className="text-slate-400 italic">Maria.</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg mt-2">You have <span className="text-slate-900 font-bold">{activeOrders.length} active orders</span> in production.</p>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: "Active Orders", value: activeOrders.length, icon: Scissors, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Loyalty Points", value: "850", icon: Award, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Saved Specs", value: "04", icon: Ruler, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Voucher Credits", value: "₱1.2k", icon: Zap, color: "text-rose-600", bg: "bg-rose-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <stat.icon size={22} />
            </div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">{stat.label}</div>
            <div className="text-3xl font-black text-slate-900">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* PRODUCTION TRACKING */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[20px] font-black text-slate-900 tracking-tight flex items-center gap-3">
              <div className="w-1.5 h-6 bg-emerald-600 rounded-full" />
              Production Status
            </h3>
            <Link href="/customer/orders" className="text-[12px] font-black text-emerald-600 hover:underline uppercase tracking-widest">Archive</Link>
          </div>
          
          <div className="space-y-6">
            {activeOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden flex flex-col sm:flex-row hover:shadow-xl transition-all group">
                <div className="w-full sm:w-[220px] h-[220px] relative bg-slate-100">
                  <img 
                    src={"https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=400&q=80"}
                    alt="Garment" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-black/5" />
                </div>
                <div className="flex-1 p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{order.id}</div>
                        <h4 className="text-[22px] font-black text-slate-900 tracking-tight">{order.items?.[0]?.garment_name || "Bespoke Suit"}</h4>
                      </div>
                      <div className="text-right">
                        <div className="text-[14px] font-black text-slate-900">Tailoring Shopsatura</div>
                        <div className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Est: {new Date(order.due_date).toLocaleDateString()}</div>
                      </div>
                    </div>
                    
                    {/* ENHANCED PROGRESS */}
                    <div className="mt-8">
                      <div className="flex justify-between items-end mb-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-emerald-500" />
                          <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{order.status.replace("_", " ")}</span>
                        </div>
                        <span className="text-[14px] font-black text-slate-900 italic">65% Complete</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                        <div className="h-full w-[65%] bg-emerald-500 rounded-full relative">
                          <div className="absolute inset-0 bg-white/20 animate-pulse" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-8">
                    <Link href={"/customer/orders/" + order.id} className="flex-1 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center text-[13px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-[0.98]">
                      Real-time Tracking
                    </Link>
                    <button className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all">
                      <MessageSquare size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-8">
          
          {/* APPOINTMENTS CARD */}
          <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:scale-150 transition-transform duration-1000" />
            <h3 className="text-[20px] font-black mb-8 flex items-center gap-3">
              <Calendar size={22} className="text-emerald-400" /> Upcoming
            </h3>
            <div className="space-y-5">
              {upcomingApts.map((apt, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-sm">
                  <div className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mb-1">{new Date(apt.date).toLocaleDateString()} • {apt.startTime}</div>
                  <div className="text-[16px] font-black">{apt.type.charAt(0) + apt.type.slice(1).toLowerCase()}</div>
                  <div className="text-[12px] text-slate-400 font-medium">Main Studio • {apt.status}</div>
                </div>
              ))}
              {upcomingApts.length === 0 && (
                <div className="text-center py-6 text-slate-500 font-bold text-sm">No scheduled sessions</div>
              )}
            </div>
          </div>

          {/* MEASUREMENT SUMMARY */}
          <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black text-slate-900">Measurement Profiles</h3>
              <Ruler size={20} className="text-slate-300" />
            </div>
            <div className="space-y-6">
              {[
                { name: "Bespoke Suit Profile", date: "Updated Apr 12", status: "Verified" },
                { name: "Traditional Barong", date: "Updated Jan 05", status: "Outdated" },
              ].map((p, i) => (
                <div key={i} className="flex items-center justify-between pb-6 border-b border-slate-50 last:border-0 last:pb-0">
                  <div>
                    <div className="text-[14px] font-black text-slate-900 mb-0.5">{p.name}</div>
                    <div className="text-[11px] text-slate-400 font-medium uppercase tracking-widest">{p.date}</div>
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${p.status === 'Verified' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
            <Link href="/customer/measurements" className="w-full h-14 mt-8 bg-slate-50 text-slate-900 rounded-2xl flex items-center justify-center text-[13px] font-black hover:bg-slate-100 transition-all">
              Manage Measurements
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

