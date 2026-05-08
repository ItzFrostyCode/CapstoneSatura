'use client';

import React, { useMemo } from 'react';
import { ShoppingBag, Calendar, Ruler, CreditCard, CheckCircle2 } from 'lucide-react';
import { useERPStore } from '@/store/useERPStore';

interface HistoryEvent {
  id: string;
  type: 'ORDER' | 'APPOINTMENT' | 'FITTING' | 'PAYMENT';
  date: string;
  title: string;
  subtitle: string;
  status?: string;
  amount?: number;
}

interface HistoryTabProps {
  customerId: string;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({ customerId }) => {
  const { orders, appointments, fittingSessions, payments, measurementProfiles } = useERPStore();

  const historyEvents = useMemo(() => {
    const events: HistoryEvent[] = [];

    // Add Orders
    orders
      .filter(o => o.customer_id === customerId)
      .forEach(o => {
        events.push({
          id: o.id,
          type: 'ORDER',
          date: o.created_at,
          title: `Order #${o.id.replace('ORD-', '')}`,
          subtitle: `${o.order_type} order initiated`,
          status: o.status,
          amount: o.total_amount
        });
      });

    // Add Appointments
    // Appointments use customer name instead of ID in this prototype schema usually
    // Let's find the customer name
    const customer = useERPStore.getState().customers.find(c => c.id === customerId);
    if (customer) {
      appointments
        .filter(a => a.customer === customer.name)
        .forEach(a => {
          events.push({
            id: a.id,
            type: 'APPOINTMENT',
            date: a.date, // Note: Appointment date is YYYY-MM-DD
            title: a.type,
            subtitle: `Appointment with ${a.staff}`,
            status: a.status
          });
        });
    }

    // Add Fitting Sessions
    const customerProfiles = measurementProfiles.filter(p => p.customer_id === customerId);
    const profileIds = new Set(customerProfiles.map(p => p.id));
    
    fittingSessions
      .filter(s => profileIds.has(s.measurement_profile_id))
      .forEach(s => {
        events.push({
          id: s.id,
          type: 'FITTING',
          date: s.created_at || new Date().toISOString(), // Fallback if missing
          title: `Fitting Session #${s.session_no}`,
          subtitle: `Adjustment: ${s.adjustment_notes.substring(0, 50)}${s.adjustment_notes.length > 50 ? '...' : ''}`,
        });
      });

    // Add Payments
    payments
      .filter(p => orders.find(o => o.id === p.job_order_id && o.customer_id === customerId))
      .forEach(p => {
        events.push({
          id: p.id,
          type: 'PAYMENT',
          date: p.paid_at || new Date().toISOString(),
          title: 'Payment Received',
          subtitle: `Via ${p.payment_method} (Ref: ${p.reference_no})`,
          amount: p.amount,
          status: p.status
        });
      });

    // Sort by date descending
    return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [customerId, orders, appointments, fittingSessions, payments, measurementProfiles]);

  if (historyEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-slate-50/50 rounded-[32px] border-2 border-dashed border-slate-200">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
          <CheckCircle2 size={32} />
        </div>
        <p className="font-black text-[16px] text-slate-600">No History Records</p>
        <p className="text-[13px] font-medium max-w-[280px] text-center mt-1">This customer hasnt had any interactions recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-slate-100" />

        <div className="space-y-10 relative">
          {historyEvents.map((event) => (
            <div key={event.id} className="flex gap-8 group">
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm border-2 border-white transition-all group-hover:scale-110 ${getEventStyles(event.type)}`}>
                  {getEventIcon(event.type)}
                </div>
              </div>

              <div className="flex-1 pt-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[16px] font-black text-slate-900">{event.title}</span>
                    {event.status && (
                       <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusStyles(event.status)}`}>
                         {event.status}
                       </span>
                    )}
                  </div>
                  <span className="text-[12px] font-black text-slate-400 uppercase tracking-widest">
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:border-indigo-200 transition-all">
                  <div className="flex items-center justify-between">
                    <p className="text-[14px] font-medium text-slate-600">{event.subtitle}</p>
                    {event.amount !== undefined && (
                      <span className="text-[16px] font-black text-slate-900">₱{event.amount.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const getEventIcon = (type: HistoryEvent['type']) => {
  switch (type) {
    case 'ORDER': return <ShoppingBag size={20} />;
    case 'APPOINTMENT': return <Calendar size={20} />;
    case 'FITTING': return <Ruler size={20} />;
    case 'PAYMENT': return <CreditCard size={20} />;
  }
};

const getEventStyles = (type: HistoryEvent['type']) => {
  switch (type) {
    case 'ORDER': return 'bg-indigo-50 text-indigo-600';
    case 'APPOINTMENT': return 'bg-amber-50 text-amber-600';
    case 'FITTING': return 'bg-rose-50 text-rose-600';
    case 'PAYMENT': return 'bg-emerald-50 text-emerald-600';
  }
};

const getStatusStyles = (status: string) => {
  const s = status.toUpperCase();
  if (s === 'COMPLETED' || s === 'PAID' || s === 'CONFIRMED') return 'bg-emerald-50 text-emerald-600';
  if (s === 'IN_PRODUCTION' || s === 'READY_FOR_PICKUP' || s === 'SCHEDULED') return 'bg-indigo-50 text-indigo-600';
  if (s === 'CANCELLED' || s === 'FAILED') return 'bg-rose-50 text-rose-600';
  return 'bg-slate-50 text-slate-600';
};
