'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useERPStore } from '@/store/useERPStore';
import { Sidebar } from '@/components/shared/Sidebar';
import { Navbar } from '@/components/shared/Navbar';

export default function StaffPortalLayout({
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

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
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
          currentUser={currentUser?.name === 'John Clock' ? { ...currentUser, name: 'Bulka Chong' } : currentUser || { name: 'Bulka Chong', email: 'bulka@sutura.ph', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Staff' }}
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
    </div>
  );
}
