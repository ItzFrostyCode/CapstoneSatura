'use client';

import { useState } from 'react';
import { Bell, CheckCircle, Package, Calendar, CreditCard, Scissors, AlertCircle } from 'lucide-react';

type NotifType = 'ORDER_UPDATE' | 'APPOINTMENT' | 'PAYMENT' | 'PRODUCTION' | 'SYSTEM';

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  createdAt: string;
  readAt: string | null;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n01',
    type: 'PRODUCTION',
    title: 'Your order is now in the Sewing stage',
    body: 'Order ORD-2026-1024 (Bespoke 3-Piece Suit) has been advanced to the Sewing stage by Carlos Reyes at Davao Famous Tailoring.',
    createdAt: '2026-05-13T10:30:00',
    readAt: null,
  },
  {
    id: 'n02',
    type: 'APPOINTMENT',
    title: 'Fitting appointment confirmed',
    body: 'Your fitting appointment at Davao Famous Tailoring on May 25, 2026 at 2:00 PM has been confirmed.',
    createdAt: '2026-05-12T15:00:00',
    readAt: null,
  },
  {
    id: 'n03',
    type: 'PAYMENT',
    title: 'Down payment of ₱7,000 received',
    body: 'Your GCash payment of ₱7,000 for Order ORD-2026-1024 has been confirmed. Remaining balance: ₱11,500.',
    createdAt: '2026-05-10T09:15:00',
    readAt: '2026-05-10T11:00:00',
  },
  {
    id: 'n04',
    type: 'ORDER_UPDATE',
    title: 'Order accepted by shop',
    body: "Your consultation request has been accepted by Chard's Tailoring. An appointment will be scheduled shortly.",
    createdAt: '2026-05-01T08:45:00',
    readAt: '2026-05-01T09:00:00',
  },
  {
    id: 'n05',
    type: 'SYSTEM',
    title: 'Welcome to SUTURA',
    body: 'Your SUTURA account is active. You can now book consultations, track orders, and manage your measurements.',
    createdAt: '2026-04-28T00:00:00',
    readAt: '2026-04-28T08:00:00',
  },
];

const TYPE_CONFIG: Record<NotifType, { icon: React.ElementType; color: string; bg: string }> = {
  ORDER_UPDATE: { icon: Package,      color: 'text-indigo-600', bg: 'bg-indigo-50' },
  APPOINTMENT:  { icon: Calendar,     color: 'text-blue-600',   bg: 'bg-blue-50'   },
  PAYMENT:      { icon: CreditCard,   color: 'text-emerald-600',bg: 'bg-emerald-50'},
  PRODUCTION:   { icon: Scissors,     color: 'text-violet-600', bg: 'bg-violet-50' },
  SYSTEM:       { icon: AlertCircle,  color: 'text-slate-600',  bg: 'bg-slate-100' },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.readAt).length;

  const markAllRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, readAt: n.readAt ?? new Date().toISOString() }))
    );
  };

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => n.id === id ? { ...n, readAt: n.readAt ?? new Date().toISOString() } : n)
    );
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-slate-900 pt-28 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-amber-400 via-transparent to-transparent" />
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <Bell size={20} className="text-amber-400" />
            <span className="text-amber-400 text-[12px] font-black uppercase tracking-widest">Notifications</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-4xl font-black text-white tracking-tight mb-2">Notifications</h1>
              <p className="text-slate-400 font-medium">Stay updated on your orders, appointments, and payments.</p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="h-10 px-4 bg-white/10 border border-white/20 text-white text-[12px] font-black uppercase tracking-widest rounded-xl hover:bg-white/20 transition-all"
              >
                Mark all read
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 -mt-6 pb-24">
        {unreadCount > 0 && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white shrink-0">
              <Bell size={14} />
            </div>
            <span className="text-[13px] font-black text-indigo-900">{unreadCount} unread notification{unreadCount > 1 ? 's' : ''}</span>
          </div>
        )}

        <div className="space-y-3">
          {notifications.map((notif) => {
            const cfg = TYPE_CONFIG[notif.type];
            const Icon = cfg.icon;
            const isUnread = !notif.readAt;

            return (
              <button
                key={notif.id}
                onClick={() => markRead(notif.id)}
                className={`w-full text-left bg-white rounded-2xl border transition-all duration-200 p-5 flex gap-4 ${
                  isUnread
                    ? 'border-indigo-100 shadow-lg shadow-indigo-500/5 hover:shadow-xl'
                    : 'border-slate-100 hover:shadow-lg hover:shadow-slate-200/40'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg}`}>
                  <Icon size={18} className={cfg.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className={`text-[14px] font-black leading-snug ${isUnread ? 'text-slate-900' : 'text-slate-600'}`}>
                      {notif.title}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      {isUnread && <div className="w-2 h-2 bg-indigo-600 rounded-full" />}
                      <span className="text-[11px] font-bold text-slate-400">{timeAgo(notif.createdAt)}</span>
                    </div>
                  </div>
                  <p className="text-[13px] text-slate-500 font-medium leading-relaxed">{notif.body}</p>
                </div>
              </button>
            );
          })}
        </div>

        {notifications.every((n) => n.readAt) && (
          <div className="text-center mt-12">
            <CheckCircle size={40} className="mx-auto text-slate-200 mb-3" />
            <p className="text-slate-400 font-bold text-[13px] uppercase tracking-widest">All caught up!</p>
          </div>
        )}
      </div>
    </main>
  );
}
