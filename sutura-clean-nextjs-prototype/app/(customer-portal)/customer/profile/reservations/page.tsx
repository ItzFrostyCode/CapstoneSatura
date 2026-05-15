'use client';

import { useERPStore } from "@/store/useERPStore";
import { useState, useMemo } from 'react';
import { 
  ArrowLeft, ShoppingBag, CreditCard, 
  MapPin, X
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

export default function MyReservationsPage() {
  const { currentUser, orders } = useERPStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedRes, setSelectedRes] = useState<import("@/types/erp").Order | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'gcash' | 'maya'>('gcash');
  const [referenceNo, setReferenceNo] = useState('');

  const myReservations = useMemo(() => (orders || [])
    .filter(o => o.customer_id === currentUser?.id && (o.order_type === 'READY_MADE' || o.source_type === 'ONLINE')), [orders, currentUser]);

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-32 animate-in fade-in duration-500">
      {/* ── HEADER ── */}
      <div className="bg-white px-6 pt-12 pb-8 sticky top-0 z-[100] shadow-sm border-b border-slate-50">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
           <Link href="/customer/dashboard" className="w-10 h-10 bg-slate-50 rounded-[8px] flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all shadow-sm">
              <ArrowLeft size={20} />
           </Link>
           <div>
              <h1 className="text-[24px] font-black text-slate-900 tracking-tight italic uppercase">Reservation</h1>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">RTW Items & Pending Fittings</p>
           </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-10">

        {/* POLICY CARD */}
        <div className="bg-amber-50 rounded-[8px] p-6 flex items-start gap-4">
           <div className="w-14 h-14 bg-white rounded-[22px] flex items-center justify-center text-amber-600 shadow-sm shrink-0">
              <CreditCard size={24} />
           </div>
           <div>
              <h3 className="text-[16px] font-black text-amber-900 mb-1">Reservation Policy</h3>
              <p className="text-[13px] text-amber-700/70 font-medium leading-relaxed">
                 Reservations are held for 7 days. A 50% downpayment is required to secure the item. Once paid, the item is moved to &quot;Pending Fitting&quot;.
              </p>
           </div>
        </div>

        {/* RESERVATION LIST */}
        <div className="space-y-6">
           {myReservations.length === 0 ? (
             <div className="text-center py-20 bg-white border border-slate-100 rounded-[40px] border-dashed">
                <ShoppingBag size={48} className="text-slate-100 mx-auto mb-4" />
                <p className="text-[13px] font-bold text-slate-300 uppercase tracking-widest">No active reservations</p>
             </div>
           ) : (
             myReservations.map(res => {
               const mainItem = res.items?.[0];
               const isPaid = res.balance === 0;
               return (
                 <div key={res.id} className="bg-white rounded-[8px] overflow-hidden shadow-sm hover:shadow-md transition-all group">
                    <div className="p-6 flex flex-col md:flex-row gap-6">
                       <div className="w-full md:w-32 h-32 bg-slate-50 rounded-[8px] overflow-hidden shrink-0">
                          <img src="/catalog/Classsic Barong Tagalog.png" className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all" alt="" />
                       </div>
                       <div className="flex-1">
                          <div className="flex justify-between items-start mb-4">
                             <div>
                                <h3 className="text-[18px] font-black text-slate-900 tracking-tight">{mainItem?.garment_name || 'Reserved Item'}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Size: {mainItem?.size || 'Custom'}</p>
                                   <div className="w-1 h-1 bg-slate-200 rounded-full" />
                                   <button 
                                     onClick={() => setIsAddModalOpen(true)}
                                     className="text-[10px] font-black text-[#069668] uppercase tracking-widest hover:underline"
                                   >
                                     Customize
                                   </button>
                                </div>
                             </div>
                             <span className={`px-3 py-1 rounded-[4px] text-[9px] font-black uppercase tracking-widest ${
                               isPaid ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                             }`}>
                                {isPaid ? 'Paid & Confirmed' : 'Awaiting DP'}
                             </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-6">
                             <div className="p-3 bg-slate-50 rounded-[8px]">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                   {isPaid ? 'Total Paid' : '50% DP Required'}
                                </p>
                                <p className={`text-[16px] font-black ${isPaid ? 'text-slate-900' : 'text-emerald-600'}`}>
                                   ₱{(isPaid ? res.total_amount : (res.total_amount * 0.5)).toLocaleString()}
                                </p>
                             </div>
                             <div className={`p-3 rounded-[8px] ${isPaid ? 'bg-slate-50' : 'bg-rose-50'}`}>
                                <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${isPaid ? 'text-slate-400' : 'text-rose-400'}`}>
                                   {isPaid ? 'Production Start' : 'Expires On'}
                                </p>
                                <p className={`text-[16px] font-black ${isPaid ? 'text-slate-900' : 'text-rose-600'}`}>
                                   {format(new Date(res.due_date), 'MMM d, yyyy')}
                                </p>
                             </div>
                          </div>

                          <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400">
                             <div className="flex items-center gap-1.5">
                                <MapPin size={14} className="text-slate-300" />
                                Golden Needle Studio
                             </div>
                          </div>
                       </div>
                    </div>
                     <div className="bg-slate-50/30 px-6 py-4 flex items-center justify-between border-t border-slate-50">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID: {res.id}</span>
                        {!isPaid && (
                          <button 
                            onClick={() => {
                              setSelectedRes(res);
                              setIsPaymentModalOpen(true);
                            }}
                            className="flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase tracking-widest hover:gap-3 transition-all"
                          >
                             Complete Reservation <ArrowLeft size={12} className="rotate-180" />
                          </button>
                        )}
                     </div>
                 </div>
               );
             })
           )}
        </div>

        {/* BOTTOM ACTION */}
        <div className="bg-slate-900 rounded-[8px] p-8 text-center text-white shadow-xl shadow-slate-900/20">
           <h4 className="text-[18px] font-black tracking-tight mb-2">Explore the Collection</h4>
           <p className="text-[13px] text-slate-400 font-medium mb-6">Browse ready-made designs and reserve your fit today.</p>
           <Link href="/customer/shops" className="inline-flex h-12 px-8 bg-white text-slate-900 rounded-[8px] items-center justify-center font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">
              Go to Catalog
           </Link>
        </div>
      </div>

      {/* ── PAYMENT MODAL ── */}
      {isPaymentModalOpen && selectedRes && (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center bg-black/60 backdrop-blur-md p-6 animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-md rounded-[8px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white">
                 <div>
                    <h2 className="text-[18px] font-black text-slate-900 tracking-tight uppercase">Complete Payment</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sutura Online Checkout</p>
                 </div>
                 <button onClick={() => setIsPaymentModalOpen(false)} className="w-10 h-10 bg-slate-50 rounded-[4px] flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
                    <X size={20} />
                 </button>
              </div>

              <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                 {/* AMOUNT SUMMARY */}
                 <div className="text-center p-6 bg-slate-50 rounded-[8px]">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Balance Due</p>
                    <p className="text-[32px] font-black text-slate-900 tracking-tighter">₱{selectedRes.total_amount.toLocaleString()}</p>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">Order {selectedRes.id}</p>
                 </div>

                 {/* PAYMENT METHOD TABS */}
                 <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setPaymentMethod('gcash')}
                      className={`h-14 rounded-2xl font-black text-[14px] transition-all ${paymentMethod === 'gcash' ? 'bg-[#0F172A] text-white shadow-lg' : 'bg-white border border-slate-100 text-slate-400'}`}
                    >
                       GCash
                    </button>
                    <button 
                      onClick={() => setPaymentMethod('maya')}
                      className={`h-14 rounded-2xl font-black text-[14px] transition-all ${paymentMethod === 'maya' ? 'bg-[#0F172A] text-white shadow-lg' : 'bg-white border border-slate-100 text-slate-400'}`}
                    >
                       Maya
                    </button>
                 </div>

                 {/* REFERENCE NUMBER INPUT */}
                 <div className="relative group">
                    <div className="absolute inset-y-0 left-0 w-20 flex items-center justify-center border-r border-slate-100/50">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">REF #</span>
                    </div>
                    <input 
                      placeholder="Enter Reference Number"
                      value={referenceNo}
                      onChange={(e) => setReferenceNo(e.target.value)}
                      className="w-full h-16 bg-slate-50/50 rounded-[24px] pl-24 pr-6 text-[14px] font-bold text-slate-900 placeholder:text-slate-300 outline-none border border-transparent focus:border-slate-100 transition-all"
                    />
                 </div>

                 {/* UPLOAD BOX */}
                 <div className="w-full aspect-[2/1] bg-slate-50/30 border-2 border-dashed border-slate-100 rounded-[32px] flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all group">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 text-slate-400 group-hover:scale-110 transition-transform">
                       <ShoppingBag size={24} />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">UPLOAD SCREENSHOT</span>
                 </div>
              </div>

              <div className="p-8">
                 <button 
                   onClick={() => {
                     setIsPaymentModalOpen(false);
                     setReferenceNo('');
                   }}
                   disabled={!referenceNo}
                   className={`w-full h-16 rounded-[20px] font-black text-[12px] uppercase tracking-[0.2em] transition-all active:scale-[0.98] ${
                     referenceNo ? 'bg-[#0F172A] text-white shadow-xl shadow-slate-900/20' : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                   }`}
                 >
                    Confirm Payment
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* ── ADD NEW MEASUREMENT MODAL (CONTEXTUAL) ── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[5000] flex items-end md:items-center justify-center bg-black/80 backdrop-blur-xl animate-in fade-in duration-500 p-0 md:p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-t-[20px] md:rounded-[8px] shadow-2xl p-8 md:p-12 animate-in slide-in-from-bottom duration-500 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-start mb-12 sticky top-0 bg-white z-10 pb-4 border-b border-slate-50">
              <div>
                <h2 className="text-[28px] font-black text-slate-900 tracking-tight mb-2 uppercase italic">Add New Measurement</h2>
                <p className="text-[13px] text-slate-400 font-bold uppercase tracking-widest">Customizing RTW Item</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="w-12 h-12 bg-slate-50 rounded-[4px] flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-12 pb-32">
              {/* SECTION: VERSION NAME */}
              <div className="space-y-3">
                 <SectionTitle number="1" title="Fit Version Name" />
                 <input placeholder="e.g. Wedding Suit V2, Casual Relaxed" defaultValue="RTW Customization" className="w-full h-16 bg-slate-50 border border-slate-100 rounded-[8px] px-6 text-[14px] font-bold text-slate-900 placeholder:text-slate-300 focus:bg-white focus:border-slate-900 transition-all outline-none shadow-sm" />
              </div>

              {/* SECTION 1: POSTURE */}
              <div className="space-y-4">
                 <SectionTitle number="2" title="Posture & Figuration" />
                 <div className="flex flex-wrap gap-2">
                    {['SQUARE SHOULDERS', 'STOOPED', 'ERECT', 'PROMINENT CHEST', 'PROMINENT SEAT', 'SWAY BACK', 'HEAD FORWARD'].map(opt => (
                      <button key={opt} className="px-5 py-3 bg-slate-50 border border-slate-100 rounded-[4px] text-[10px] font-black text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all active:scale-95">
                         {opt}
                      </button>
                    ))}
                 </div>
              </div>

              {/* SECTION 2: FIT PREFERENCE */}
              <div className="space-y-4">
                 <SectionTitle number="3" title="Fit Preference" />
                 <div className="bg-slate-50 p-1.5 rounded-[12px] flex items-center shadow-inner">
                    {['SLIM', 'REGULAR', 'LOOSE', 'OVERSIZED'].map(opt => (
                      <button key={opt} className={`flex-1 h-12 rounded-[8px] text-[10px] font-black tracking-widest transition-all ${opt === 'REGULAR' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>
                         {opt}
                      </button>
                    ))}
                 </div>
              </div>

              {/* SECTION 3: METRICS */}
              <div className="space-y-4">
                 <SectionTitle number="4" title="Detailed Metrics (Inches)" />
                 <div className="bg-white border border-slate-100 rounded-[8px] p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1 shadow-sm">
                    {[
                      { l: 'NECK', v: '15.5' }, { l: 'SHOULDER', v: '18' }, { l: 'CHEST', v: '40' }, { l: 'WAIST', v: '34' },
                      { l: 'HIPS', v: '38' }, { l: 'SLEEVE', v: '24' }, { l: 'ARMHOLE', v: '19' }, { l: 'BICEP', v: '14' },
                      { l: 'WRIST', v: '7' }, { l: 'BACK WIDTH', v: '16' }, { l: 'FRONT WIDTH', v: '15' }, { l: 'SLOPE', v: '2' },
                      { l: 'LENGTH', v: '28' }
                    ].map(m => (
                      <div key={m.l} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                         <span className="text-[10px] font-black text-slate-300 tracking-widest">{m.l}</span>
                         <span className="text-[14px] font-black text-slate-400">{m.v}</span>
                      </div>
                    ))}
                 </div>
              </div>

              {/* SECTION 4: NOTES */}
              <div className="space-y-4">
                 <SectionTitle number="5" title="Style Preferences & Notes" />
                 <textarea placeholder="Specific fit requests..." className="w-full h-32 bg-slate-50 border border-slate-100 rounded-[8px] p-6 text-[14px] font-medium text-slate-600 placeholder:text-slate-300 focus:bg-white focus:border-slate-900 transition-all outline-none resize-none shadow-sm" />
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-8 bg-white/80 backdrop-blur-md border-t border-slate-50">
               <button onClick={() => setIsAddModalOpen(false)} className="w-full h-20 bg-[#0F172A] text-white rounded-[8px] font-black text-[13px] uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/30 active:scale-[0.98] transition-all">
                 Save Pattern to Vault
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionTitle({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-2">
       <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">
          {number}
       </div>
       <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-widest">{title}</h3>
    </div>
  );
}
