export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-24 font-outfit">
      <div className="absolute top-0 left-0 w-full h-1 bg-slate-900" />
      
      <div className="w-24 h-24 bg-slate-900 rounded-[32px] flex items-center justify-center text-white mb-12 shadow-2xl shadow-slate-900/20">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><line x1="20" y1="4" x2="8.12" y2="15.88"></line><line x1="14.47" y1="14.48" x2="20" y2="20"></line><polyline points="8.12 8.12 12 12"></polyline></svg>
      </div>

      <h1 className="text-7xl font-black text-slate-900 mb-6 tracking-tighter leading-none">
        SUTURA<span className="text-indigo-600">.</span>
      </h1>
      
      <p className="text-xl text-slate-500 mb-16 text-center max-w-2xl font-medium leading-relaxed">
        The artisan-first ERP for modern tailoring houses. <br/>
        Orchestrate your production, inventory, and finances with precision.
      </p>
      
      <div className="flex flex-wrap items-center justify-center gap-6">
        <a href="/login-gateway" className="bg-slate-900 text-white h-16 px-10 rounded-2xl font-black text-[15px] hover:bg-indigo-600 transition-all flex items-center shadow-xl shadow-slate-900/10 active:scale-95">
          Enterprise Portal
        </a>
        <a href="/customer/designs" className="bg-white text-slate-900 h-16 px-10 rounded-2xl font-black text-[15px] border-2 border-slate-200 hover:border-slate-900 transition-all flex items-center active:scale-95">
          Customer Studio
        </a>
      </div>

      <div className="mt-24 pt-12 border-t border-slate-100 flex items-center gap-12 grayscale opacity-40">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Trusted By Artisan Houses</span>
      </div>
    </main>
  );
}
