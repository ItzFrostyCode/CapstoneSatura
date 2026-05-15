'use client';

import { useERPStore } from "@/store/useERPStore";
import { useMemo } from 'react';
import { 
  CreditCard, ArrowLeft, History, 
  ArrowUpRight, Wallet, Receipt,
  CheckCircle2, Clock, AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

export default function MyPaymentsPage() {
  const { currentUser, orders, payments } = useERPStore();

  const activeOrders = useMemo(() => (orders || []).filter(o => o.customer_id === currentUser?.id && o.status !== 'RELEASED'), [orders, currentUser]);
  const totalBalance = useMemo(() => activeOrders.reduce((sum, o) => sum + (o.balance || (o.total_amount - (o.amount_paid || 0))), 0), [activeOrders]);

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-32 animate-in fade-in duration-500">
      {/* ── HEADER ── */}
      <div className="bg-white border-b border-slate-100 px-6 pt-12 pb-8 sticky top-0 z-[100] shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
           <Link href="/customer/dashboard" className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
              <ArrowLeft size={20} />
           </Link>
           <div>
              <h1 className="text-[24px] font-black text-slate-900 tracking-tight">Payments & Invoices</h1>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Financial Ledger & Billing</p>
           </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-8">
        
        {/* SUMMARY CARD */}
        <div className="bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl shadow-slate-900/30 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
           <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Total Remaining Balance</p>
                 <h2 className="text-[42px] font-black tracking-tight leading-none text-emerald-400">₱{totalBalance.toLocaleString()}</h2>
              </div>
              <button className="h-14 px-8 bg-emerald-500 text-slate-900 rounded-2xl font-black text-[11px] uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-emerald-500/20">
                 Clear Balance
              </button>
           </div>
        </div>

        {/* ACTIVE BILLS */}
        <div className="space-y-4">
           <SectionHeader title="Active Billing" sub="Outstanding amounts per order" />
           <div className="space-y-4">
              {activeOrders.map(order => (
                <div key={order.id} className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm">
                   <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                            <Wallet size={20} />
                         </div>
                         <div>
                            <h4 className="text-[15px] font-black text-slate-900">Order #{order.id.slice(-6)}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Production Stage</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-[18px] font-black text-slate-900">₱{(order.balance || order.total_amount - (order.amount_paid || 0)).toLocaleString()}</p>
                         <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Pending</p>
                      </div>
                   </div>
                   <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                         <Receipt size={14} /> Total: ₱{order.total_amount.toLocaleString()}
                      </div>
                      <button className="text-[10px] font-black text-slate-900 uppercase tracking-widest underline decoration-2 underline-offset-4">View Invoice</button>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* RECENT TRANSACTIONS */}
        <div className="space-y-4 pt-4">
           <SectionHeader title="Payment History" sub="Recent receipts and transfers" />
           <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm">
              <TransactionRow id="TXN-5529" date="May 12" amount="₱4,500" method="GCash" status="SUCCESS" />
              <TransactionRow id="TXN-5528" date="May 05" amount="₱2,250" method="Maya" status="SUCCESS" />
              <TransactionRow id="TXN-5527" date="Apr 28" amount="₱1,500" method="Bank Transfer" status="SUCCESS" />
           </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="px-2">
      <h2 className="text-[16px] font-black text-slate-900 tracking-tight leading-none mb-1">{title}</h2>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{sub}</p>
    </div>
  );
}

function TransactionRow({ id, date, amount, method, status }: { id: string; date: string; amount: string; method: string; status: string }) {
  return (
    <div className="p-6 border-b border-slate-50 flex items-center justify-between hover:bg-slate-50 transition-all cursor-pointer group">
       <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 group-hover:text-emerald-600 transition-all">
             <CheckCircle2 size={20} />
          </div>
          <div>
             <p className="text-[13px] font-black text-slate-900 tracking-tight uppercase">{id}</p>
             <p className="text-[10px] font-bold text-slate-400">{date} • {method}</p>
          </div>
       </div>
       <div className="text-right">
          <p className="text-[14px] font-black text-slate-900">{amount}</p>
          <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">{status}</p>
       </div>
    </div>
  );
}
