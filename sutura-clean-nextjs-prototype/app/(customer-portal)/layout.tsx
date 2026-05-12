'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Scissors, Search, Menu, X, User, Bell, MapPin
} from 'lucide-react';

export default function CustomerPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: '/customer/dashboard' },
    { name: 'Explore Shops', path: '/customer/shops' },
    { name: 'Meet Designers', path: '/customer/designs' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* 1. Top Navigation Bar (Consumer-facing) */}
      <header className="h-[72px] bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center group-hover:bg-slate-800 transition-colors">
              <Scissors size={20} strokeWidth={2.5} />
            </div>
            <div className="font-bold text-[20px] tracking-tight text-slate-900">SUTURA</div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item, idx) => {
              const isActive = pathname === item.path || (pathname.startsWith(item.path) && item.path !== '/');
              return (
                <Link 
                  key={idx} 
                  href={item.path}
                  className={`text-[14px] font-semibold transition-colors ${
                    isActive 
                      ? 'text-slate-900' 
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              className="text-[12px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors hidden lg:block"
            >
              SUTURA for Business
            </Link>

            <div className="w-px h-6 bg-slate-200 hidden lg:block"></div>
            
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-slate-900 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 fixed w-full top-[72px] z-40 animate-in slide-in-from-top-2">
          <nav className="flex flex-col p-4 gap-2">
            {navItems.map((item, idx) => (
              <Link 
                key={idx} 
                href={item.path}
                className="px-4 py-3 text-[16px] font-semibold text-slate-900 rounded-lg hover:bg-slate-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="h-px w-full bg-slate-100 my-2"></div>
            </nav>
          </div>
      )}

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col w-full relative">
        {children}
      </main>

      {/* 3. Simple Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
             <Scissors size={20} className="text-slate-400" />
             <span className="text-[16px] font-black text-slate-400 tracking-tight">SUTURA</span>
          </div>
          <p className="text-[13px] text-slate-500 font-medium text-center md:text-left">
            Empowering local tailors and connecting fashion designers.
          </p>
          <div className="flex gap-6 text-[13px] font-semibold text-slate-500">
             <Link href="#" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
             <Link href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
