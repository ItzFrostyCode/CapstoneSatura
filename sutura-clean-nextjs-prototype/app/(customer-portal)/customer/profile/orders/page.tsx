'use client';

import { useERPStore } from "@/store/useERPStore";
import { useMemo } from 'react';
import { 
  Package, ArrowLeft, Clock, MapPin, 
  ChevronRight, TrendingUp, CheckCircle2, ShieldCheck
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { resolveOrderState, getCustomerMilestone } from "@/features/orders/orderEngine";

export default function MyOrdersPage() {
  const { currentUser, orders, jobOrderItems } = useERPStore();

  const bespokeOrders = useMemo(() => {
     const myOrders = (orders || []).filter(o => o.customer_id === currentUser?.id);
     return myOrders.filter(o => o.order_type === 'BESPOKE' || o.order_type === 'BULK' || o.order_type === 'ALTERATION');
  }, [orders, currentUser]);

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-32 animate-in fade-in duration-500">
      {/* ── HEADER ── */}
      <div className="bg-white px-6 pt-10 pb-4 sticky top-0 z-[100] shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
           <Link href="/customer/dashboard" className="w-10 h-10 bg-slate-50 rounded-[8px] flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
              <ArrowLeft size={20} />
           </Link>
           <div>
              <h1 className="text-[20px] font-black text-slate-900 tracking-tight italic uppercase">Job Orders</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bespoke & Custom Orders</p>
           </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-8">
        
        {/* LIST OF ORDERS */}
        <div className="space-y-6">
           {bespokeOrders.length === 0 ? (
             <div className="text-center py-20 bg-white rounded-[8px] border border-slate-100 border-dashed">
                <Package size={48} className="text-slate-100 mx-auto mb-4" />
                <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest">No bespoke orders in progress</p>
             </div>
           ) : (
             bespokeOrders.map(order => {
               const item = jobOrderItems?.find(i => i.job_order_id === order.id);
               const state = resolveOrderState(order);
               const { progress, customerMilestone } = state;
               
               return (
                 <div key={order.id} className="bg-white rounded-[8px] p-6 shadow-sm group transition-all">
                    <div className="flex items-start justify-between mb-8">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-50 rounded-[8px] flex items-center justify-center text-slate-400 border border-slate-100 text-xl">
                             {order.order_type === 'BESPOKE' ? '🕴️' : order.order_type === 'BULK' ? '🏢' : '🧵'}
                          </div>
                          <div>
                             <h3 className="text-[16px] font-black text-slate-900 tracking-tight leading-tight">
                                {item?.garment_name || 'Custom Garment'}
                             </h3>
                             <div className="flex items-center gap-2 mt-1">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ID: {order.id}</span>
                                <div className="w-1 h-1 bg-slate-200 rounded-full" />
                                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{format(new Date(order.created_at), 'MMM d')}</span>
                             </div>
                          </div>
                       </div>
                       <StatusBadge status={customerMilestone} />
                    </div>

                    {/* PRODUCTION PROGRESS */}
                    <div className="mb-8">
                       <div className="flex justify-between items-end mb-2 px-1">
                          <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Production Progress</span>
                          <span className="text-[12px] font-black text-slate-900">{progress}%</span>
                       </div>
                       <div className="h-2 bg-slate-50 rounded-full overflow-hidden p-[2px]">
                          <div 
                            className="h-full bg-slate-900 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(0,0,0,0.1)]" 
                            style={{ width: `${progress}%` }}
                          />
                       </div>
                    </div>

                    {/* STAGES (CUSTOMER VIEW) */}
                    <div className="grid grid-cols-5 gap-1 mb-8">
                       <StageStep 
                        label="Agreement" 
                        active={customerMilestone === 'Request Sent' || customerMilestone === 'Appointment Approved'} 
                        completed={progress > 10} 
                       />
                       <StageStep 
                        label="Production" 
                        active={customerMilestone === 'In Production'} 
                        completed={progress > 40} 
                       />
                       <StageStep 
                        label="Fitting" 
                        active={customerMilestone === 'Ready for Fitting' || customerMilestone === 'Under Alteration'} 
                        completed={progress > 70} 
                       />
                       <StageStep 
                        label="Pickup" 
                        active={customerMilestone === 'Ready for Pickup'} 
                        completed={progress > 90} 
                       />
                       <StageStep 
                        label="Released" 
                        active={customerMilestone === 'Released'} 
                        completed={progress === 100} 
                       />
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                       <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <Clock size={14} className="text-slate-200" />
                          Est. Completion: {format(new Date(order.due_date), 'MMM d')}
                       </div>
                       <button className="flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase tracking-widest group-hover:gap-3 transition-all">
                          Timeline <ChevronRight size={14} />
                       </button>
                    </div>
                 </div>
               );
             })
           )}
        </div>

        {/* QUALITY GUARANTEE */}
        <div className="bg-white rounded-[8px] p-6 flex items-start gap-5 shadow-sm border-l-4 border-emerald-500/30">
           <div className="w-10 h-10 bg-emerald-50 rounded-[8px] flex items-center justify-center text-emerald-600 shrink-0">
              <ShieldCheck size={20} />
           </div>
           <div>
              <h3 className="text-[14px] font-black text-slate-900 mb-1 italic uppercase">Quality Standards</h3>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                 Every garment undergoes a 12-point quality check. Status is updated live by our studio master tailors.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="px-3 py-1 bg-slate-900 text-white rounded-[4px] text-[8px] font-black uppercase tracking-widest border border-slate-900 shadow-sm">
       {status}
    </span>
  );
}

function StageStep({ label, active, completed }: { label: string; active: boolean; completed: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
       <div className={`w-8 h-8 rounded-[4px] flex items-center justify-center transition-all ${completed ? 'bg-emerald-500 text-white shadow-sm' : active ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-50 text-slate-200'}`}>
          {completed ? <CheckCircle2 size={14} /> : <div className="w-1.5 h-1.5 bg-current rounded-full" />}
       </div>
       <span className={`text-[7px] font-black uppercase tracking-widest text-center leading-none ${active || completed ? 'text-slate-900' : 'text-slate-300'}`}>{label}</span>
    </div>
  );
}
