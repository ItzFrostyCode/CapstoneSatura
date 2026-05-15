"use client";

import { 
  MessageSquare, Search, ChevronLeft
} from 'lucide-react';
import Link from 'next/link';

export default function AppointmentsPage() {

  return (
    <main className="min-h-screen bg-[#FAF8F5] font-poppins flex flex-col">
      {/* MESSENGER STYLE HEADER - EDGE TO EDGE */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md pt-4 pb-2 flex flex-col gap-3 border-b border-slate-50">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link 
              href="/customer/dashboard"
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-900 active:scale-90 transition-all hover:bg-slate-100"
            >
              <ChevronLeft size={24} />
            </Link>
            <h1 className="text-[22px] font-black text-slate-900 tracking-tight">Chats</h1>
          </div>
        </div>

        {/* SEARCH BAR BELOW TITLE */}
        <div className="relative px-4">
          <Search size={14} className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full h-9 pl-9 pr-4 bg-[#E4E6EB]/50 rounded-full text-[13px] font-medium outline-none focus:ring-1 ring-slate-200 transition-all"
          />
        </div>
      </header>

      {/* CHAT LIST - EDGE TO EDGE, NO MARGINS */}
      <div className="flex-1 w-full">
        <div className="divide-y divide-slate-100/50">
          {[
            { shop: 'Golden Needle Tailoring', lastMsg: 'Hello! Your fitting is confirmed for Monday.', time: '2m ago', unread: 2, img: '/catalog/Golden Needle Tailoring LOGO.png' },
            { shop: "Chard's Tailoring", lastMsg: 'We received your inquiry about the wedding suit.', time: '1h ago', unread: 0, img: "/catalog/Davao Tailoring Shop LOGO.png" },
            { shop: 'Davao Famous Tailoring', lastMsg: 'Please send us the fabric swatch photo.', time: 'Yesterday', unread: 0, img: "/catalog/Hiyas Tailoring Studio LOGO.png" },
          ].map((chat, i) => (
            <div key={i} className="px-3 py-4 flex items-center gap-3 hover:bg-white transition-colors cursor-pointer active:bg-slate-100">
              {/* CIRCULAR AVATAR */}
              <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-slate-100 bg-white p-1">
                <img src={chat.img} alt={chat.shop} className="w-full h-full object-contain rounded-full" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h3 className={`text-[15px] truncate ${chat.unread > 0 ? 'font-bold text-slate-900' : 'font-semibold text-slate-800'}`}>
                    {chat.shop}
                  </h3>
                  <span className={`text-[11px] shrink-0 ${chat.unread > 0 ? 'font-bold text-emerald-600' : 'text-slate-400'}`}>
                    {chat.time}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-[13px] truncate flex-1 ${chat.unread > 0 ? 'text-slate-900 font-bold' : 'text-slate-500 font-medium'}`}>
                    {chat.lastMsg}
                  </p>
                  {chat.unread > 0 && (
                    <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full shrink-0" />
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* END OF LIST */}
          <div className="py-10 text-center opacity-20">
            <MessageSquare size={24} className="mx-auto mb-2" />
            <p className="text-[10px] font-bold uppercase tracking-widest">End of Conversations</p>
          </div>
        </div>
      </div>
    </main>
  );
}
