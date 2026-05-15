'use client';

import { useERPStore } from '@/store/useERPStore';
import { 
  Scissors, Clock, MapPin, Box, MessageSquare, Truck, Package, UserCircle
} from 'lucide-react';
import Link from 'next/link';

export default function ProductionStatusPage() {
  const { getEnrichedOrders } = useERPStore();
  const activeOrders = getEnrichedOrders().filter(o => !["RELEASED", "CANCELLED"].includes(o.status));

  return (
    <div className="max-w-[1200px] mx-auto py-4 md:py-8 animate-in fade-in duration-700 font-poppins">
      
      {/* HEADER (Mobile Optimized) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 md:mb-12 px-2">
        <div>
          <h1 className="text-[32px] md:text-[42px] font-black text-slate-900 tracking-tight leading-none">
            Live <span className="text-slate-600 italic">Progress.</span>
          </h1>
          <p className="text-slate-500 font-medium text-[15px] md:text-lg mt-2">Track your garments through tailoring.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="w-2 h-2 bg-slate-900 rounded-full animate-pulse" />
          <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest text-center">Live Updates</span>
        </div>
      </div>

      {activeOrders.length === 0 ? (
        <div className="bg-white rounded-[40px] border border-slate-100 p-12 md:p-20 text-center flex flex-col items-center shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <Box size={32} className="text-slate-200" />
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-2">No Active Orders</h2>
          <p className="text-slate-500 max-w-sm mx-auto text-sm md:text-base">You don&apos;t have any garments in production right now.</p>
          <Link href="/customer/book" className="mt-8 h-14 px-8 bg-slate-900 text-blue-400 rounded-2xl flex items-center justify-center text-[14px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all w-full md:w-auto">
            Book Consultation
          </Link>
        </div>
      ) : (
        <div className="space-y-8 md:space-y-12">
          {activeOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-[32px] md:rounded-[48px] border border-slate-100 shadow-sm overflow-hidden flex flex-col xl:flex-row hover:shadow-xl transition-all duration-500">
              
              {/* ORDER SUMMARY (Mobile Top / Desktop Left) */}
              <div className="xl:w-[380px] p-6 md:p-10 bg-slate-50/50 flex flex-col justify-between border-b xl:border-b-0 xl:border-r border-slate-100">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                      Order #ORD-1070
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <MapPin size={10} /> Manila Studio
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight mb-2">
                    {order.items?.[0]?.garment_name || "Midnight Navy Bespoke Tuxedo"}
                  </h3>
                  <p className="text-[13px] md:text-base text-slate-500 font-medium italic">Handled by: <span className="font-bold text-slate-900 not-italic">SUTURA Tailoring</span></p>
                </div>

                <div className="mt-8 xl:mt-10 space-y-4 md:space-y-6">
                  <div className="p-5 md:p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 md:mb-4">Target Completion</div>
                    <div className="text-xl md:text-2xl font-black text-slate-900">June 15, 2026</div>
                    <div className="flex items-center gap-2 mt-2 text-blue-600 font-bold text-[12px]">
                      <Clock size={14} /> 12 Days Remaining
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex-1 h-12 bg-slate-900 text-white rounded-xl text-[12px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all">
                      View Design
                    </button>
                    <button className="w-12 h-12 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-all">
                      <MessageSquare size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* VERTICAL TIMELINE (Mobile) / GRID (Desktop) */}
              <div className="flex-1 p-6 md:p-10 lg:p-16">
                <div className="flex justify-between items-center mb-8 md:mb-12">
                  <h4 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">Tailoring in Progress</h4>
                  <span className="text-xl md:text-2xl font-black text-slate-900 italic">65%</span>
                </div>

                {/* Progress Bar */}
                <div className="relative mb-10 md:mb-16">
                  <div className="h-2 md:h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full w-[65%] bg-slate-900 rounded-full animate-pulse" />
                  </div>
                </div>

                {/* TIMELINE */}
                <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-4 md:gap-8">
                  {[
                    { name: "Order Placed", date: "May 10", desc: "Design & fabric finalized.", status: "done", icon: Package },
                    { name: "In Tailoring", date: "May 14", desc: "Crafting your silhouette.", status: "active", icon: Scissors },
                    { name: "Fitting", date: "May 18", desc: "Refining for perfect fit.", status: "todo", icon: UserCircle },
                    { name: "Ready", date: "May 22", desc: "Ready for your pick up.", status: "todo", icon: Truck },
                  ].map((step, i) => (
                    <div key={i} className="relative flex md:flex-col items-start gap-4 md:gap-0 group">
                      {/* Connector Line (Mobile) */}
                      {i < 3 && (
                        <div className="absolute left-6 top-12 bottom-[-32px] w-[2px] bg-slate-100 md:hidden" />
                      )}
                      
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-0 md:mb-6 shrink-0 transition-all duration-500 z-10 ${
                        step.status === 'done' ? 'bg-slate-900 text-white' : 
                        step.status === 'active' ? 'bg-slate-800 text-blue-400 ring-8 ring-slate-50' : 
                        'bg-slate-50 text-slate-300'
                      }`}>
                        <step.icon size={20} className={step.status === 'active' ? 'animate-pulse' : ''} />
                      </div>

                      <div className="flex-1">
                        <h5 className={`text-[15px] font-black mb-0.5 md:mb-1 ${step.status === 'todo' ? 'text-slate-400' : 'text-slate-900'}`}>{step.name}</h5>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1 md:mb-2">{step.date}</p>
                        <p className={`text-[12px] leading-relaxed font-medium ${step.status === 'todo' ? 'text-slate-300' : 'text-slate-500'}`}>{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
