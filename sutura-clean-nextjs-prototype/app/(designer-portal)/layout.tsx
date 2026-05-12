'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useERPStore } from '@/store/useERPStore';
import { Sidebar } from '@/components/shared/Sidebar';
import { Navbar } from '@/components/shared/Navbar';
import { 
  Search, Plus, UserPlus, History, ChevronDown, Zap
} from 'lucide-react';

export default function DesignerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { currentPlan, currentUser } = useERPStore();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  // Clock Logic
  useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date());

    const timer = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-outfit text-slate-900">
      
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        setIsCollapsed={setIsSidebarCollapsed} 
        pathname={pathname}
        currentPlan={currentPlan}
      />

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        <Navbar 
          currentUser={currentUser?.name === 'John Clock' ? { ...currentUser, name: 'Neneng B' } : currentUser || { name: 'Neneng B', email: 'designer@sutura.ph', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Designer_Neneng' }}
          mounted={mounted}
          currentTime={currentTime}
          isUserMenuOpen={isUserMenuOpen}
          setIsUserMenuOpen={setIsUserMenuOpen}
          isNotificationsOpen={isNotificationsOpen}
          setIsNotificationsOpen={setIsNotificationsOpen}
        />

        {/* ── PAGE CONTENT (Scrollable) ── */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <div className="p-6 pt-2 w-full">
            {children}
          </div>
        </main>
      </main>

      {/* ── COMMAND PALETTE (UX Layer) ── */}
      <div className="fixed inset-0 z-[300] flex items-start justify-center pt-[10vh] pointer-events-none">
         <div className="w-full max-w-[650px] bg-white border border-slate-200 rounded-[32px] shadow-2xl p-4 opacity-0 scale-95 pointer-events-auto transform transition-all duration-300 translate-y-4 group-focus-within:opacity-100 group-focus-within:scale-100 group-focus-within:translate-y-0 hidden">
            <div className="flex items-center gap-4 px-4 py-3 border-b border-slate-100">
               <Search size={22} className="text-slate-400" />
               <input 
                 type="text" 
                 placeholder="Search for designs, requests, or run commands..." 
                 className="flex-1 bg-transparent border-none outline-none text-[16px] font-medium text-slate-900"
               />
               <div className="px-2 py-1 bg-slate-100 rounded text-[10px] font-black text-slate-400 uppercase tracking-widest">ESC</div>
            </div>
            
            <div className="p-4 space-y-6">
               <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-2">Designer Actions</div>
                  <div className="grid grid-cols-2 gap-2">
                     <button className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors text-left group">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all"><Plus size={18} /></div>
                        <div>
                           <div className="text-[13px] font-black text-slate-900">Post Design</div>
                           <div className="text-[11px] text-slate-400 font-medium">Add to your portfolio</div>
                        </div>
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
