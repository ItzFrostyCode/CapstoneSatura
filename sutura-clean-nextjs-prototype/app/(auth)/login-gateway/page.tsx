'use client';

import { 
  Building2, Users, ShoppingBag, 
  Settings, ArrowRight, Scissors,
  ShieldCheck, UserCircle
} from 'lucide-react';
import Link from 'next/link';

export default function LoginGateway() {
  const portals = [
    {
      name: 'Owner Portal',
      desc: 'Management, analytics, and business scaling.',
      icon: <Building2 className="text-slate-900" />,
      href: '/owner/dashboard',
      color: 'bg-slate-50',
      badge: 'Admin Access'
    },
    {
      name: 'Staff Workspace',
      desc: 'Production, inventory, and task management.',
      icon: <Users className="text-indigo-600" />,
      href: '/staff/dashboard',
      color: 'bg-indigo-50/50',
      badge: 'Internal'
    },
    {
      name: 'Customer Studio',
      desc: 'Order tracking, measurements, and design.',
      icon: <UserCircle className="text-emerald-600" />,
      href: '/customer/dashboard',
      color: 'bg-emerald-50/50',
      badge: 'Client Side'
    }
  ];

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 font-outfit">
      
      <div className="w-full max-w-[1000px] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left: Branding */}
        <div className="space-y-8 text-center lg:text-left">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white mx-auto lg:mx-0 shadow-xl shadow-slate-900/10">
            <Scissors size={32} />
          </div>
          <div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none mb-4">
              Access the <br/><span className="text-indigo-600">SUTURA</span> Ecosystem
            </h1>
            <p className="text-lg text-slate-500 font-medium max-w-md">
              Secure gateway to your tailoring business operations. Select your portal to continue.
            </p>
          </div>
          <div className="flex items-center gap-3 justify-center lg:justify-start">
             <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-[11px] font-black text-slate-400 uppercase tracking-widest shadow-sm">
                <ShieldCheck size={14} className="text-emerald-500" /> AES-256 Encrypted
             </div>
          </div>
        </div>

        {/* Right: Portals */}
        <div className="space-y-4">
          {portals.map((portal) => (
            <Link 
              key={portal.name} 
              href={portal.href}
              className={`group flex items-center justify-between p-8 rounded-[32px] border border-slate-200/60 bg-white hover:border-slate-900 hover:shadow-2xl hover:shadow-slate-900/5 transition-all duration-500 relative overflow-hidden`}
            >
              <div className="flex items-center gap-6 relative z-10">
                <div className={`w-14 h-14 ${portal.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                  {portal.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-[18px] font-black text-slate-900">{portal.name}</h3>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-400 text-[9px] font-black rounded-md uppercase tracking-tighter">{portal.badge}</span>
                  </div>
                  <p className="text-[14px] text-slate-400 font-medium">{portal.desc}</p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all duration-500 relative z-10">
                <ArrowRight size={20} />
              </div>
            </Link>
          ))}
        </div>

      </div>

      <div className="mt-16 flex items-center gap-8 text-slate-300 font-bold text-[13px]">
        <Link href="/" className="hover:text-slate-900 transition-colors">Documentation</Link>
        <span className="w-1 h-1 bg-slate-200 rounded-full" />
        <Link href="/" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
        <span className="w-1 h-1 bg-slate-200 rounded-full" />
        <Link href="/" className="hover:text-slate-900 transition-colors">Support</Link>
      </div>

    </main>
  );
}
