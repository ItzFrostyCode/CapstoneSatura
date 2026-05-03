'use client';

import { 
  Building2,
  TrendingUp, 
  ArrowUpRight, 
  ChevronRight,
  Clock as ClockIcon,
  ChevronLeft,
  Users,
  Plus,
  X,
  Ruler,
  Shirt,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Search,
  FileText,
  BadgeCheck,
  Settings,
  Palette,
  CreditCard,
  Mail,
  Phone,
  Database,
  UserPlus,
  Globe,
  Upload,
  Lock,
  History,
  FileJson,
  FileSpreadsheet,
  Calendar as CalendarIcon,
  Package,
  Wallet,
  ShieldCheck
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [time, setTime] = useState(new Date());
  
  // Modal & Drawer States
  const [isOrderIntakeOpen, setIsOrderIntakeOpen] = useState(false);
  const [intakeStep, setIntakeStep] = useState(1);
  const [isNewClient, setIsNewClient] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState('General');
  
  // Form States
  const [newMeasGarment, setNewMeasGarment] = useState('Polo');
  const [measFractions, setMeasFractions] = useState<Record<string, string>>({});
  const [orderType, setOrderType] = useState<'Solo' | 'Bulk'>('Solo');
  const [garmentType, setGarmentType] = useState('Polo');
  const [quantity] = useState(1);
  const [rushActive, setRushActive] = useState(true);
  const [basePrice, setBasePrice] = useState(4500);
  const [deposit, setDeposit] = useState(2000);
  const [notes, setNotes] = useState('Polo with mandarin collar, slim fit, 3-button placket. Client prefers light Pina Silk.');

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dateStr = time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

  const rushFee = orderType === 'Solo' ? 500 : (basePrice * 0.1);
  const totalPrice = basePrice + (rushActive ? rushFee : 0);

  const fabricData: Record<string, { name: string, stock: number, neededPerUnit: number }> = {
    'Polo': { name: 'Pina Silk', stock: 1.5, neededPerUnit: 1.5 },
    'Tuxedo': { name: 'Wool Blend', stock: 5.0, neededPerUnit: 3.5 },
    'Uniform': { name: 'Cotton Blend', stock: 125.5, neededPerUnit: 2.0 },
    'Gown': { name: 'Satin Silk', stock: 10.0, neededPerUnit: 4.5 },
  };

  const selectedFabric = fabricData[garmentType] || fabricData['Polo'];
  const totalNeeded = selectedFabric.neededPerUnit * quantity;
  const hasShortage = selectedFabric.stock < totalNeeded;

  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-10 bg-slate-50/30 min-h-screen">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-[36px] font-black text-slate-900 tracking-tight leading-none">Enterprise Command Center</h1>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse mt-1"></div>
          </div>
          <div className="flex items-center gap-3 text-[15px] text-slate-500 font-medium">
            <CalendarIcon size={16} className="text-slate-400" />
            <span>{dateStr}</span>
            <span className="opacity-20">|</span>
            <span className="text-indigo-600 font-bold tracking-tight">SYSTEM OPERATIONAL</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-2 rounded-[24px] border border-slate-200 shadow-sm">
          <div className="bg-slate-50 px-6 py-3 rounded-[20px] flex items-center gap-4 border border-slate-100">
            <ClockIcon size={20} className="text-slate-400" />
            <div className="text-right">
              <div className="text-[20px] font-black text-slate-900 font-mono tracking-tighter" suppressHydrationWarning>{timeStr}</div>
              <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">GMT+8 Manila</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── KPI QUICK-VIEW ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { label: "Active Revenue", val: "₱2.51M", change: "+12.5%", icon: Wallet, color: "emerald" },
          { label: "Pending Orders", val: "142", change: "+8 new", icon: Shirt, color: "indigo" },
          { label: "Customer Reach", val: "842", change: "+24% total", icon: Users, color: "amber" },
          { label: "Inventory Health", val: "94%", change: "Optimal", icon: Package, color: "sky" },
        ].map((kpi, i) => (
          <div key={i} className="bg-white border border-slate-100 p-8 rounded-[36px] shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 translate-x-1/2 -translate-y-1/2 rounded-full opacity-5 bg-${kpi.color}-500`}></div>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-${kpi.color}-50 text-${kpi.color}-600 group-hover:scale-110 transition-transform`}>
                <kpi.icon size={24} />
              </div>
              <span className={`text-[11px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider ${kpi.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
                {kpi.change}
              </span>
            </div>
            <div>
              <div className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</div>
              <div className="text-[32px] font-black text-slate-900 tracking-tighter leading-none">{kpi.val}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        
        {/* ── MAIN CONTENT (Left) ── */}
        <div className="col-span-12 xl:col-span-8 space-y-8">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <button 
              onClick={() => { setIntakeStep(1); setIsOrderIntakeOpen(true); }}
              className="relative group bg-slate-900 text-white p-10 rounded-[44px] flex items-center justify-between overflow-hidden shadow-2xl shadow-slate-900/20 active:scale-[0.98] transition-all"
            >
              <div className="absolute inset-0 bg-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="text-left relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6 group-hover:bg-white/20 transition-colors">
                  <Plus size={28} />
                </div>
                <h3 className="text-[24px] font-black tracking-tight leading-none mb-2">Quick Order Intake</h3>
                <p className="text-slate-400 text-[14px] font-medium max-w-[240px]">Unified 4-step wizard for branch-independent job orders.</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:text-white group-hover:scale-110 transition-all relative z-10">
                <ChevronRight size={40} />
              </div>
            </button>

            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="relative group bg-white border border-slate-100 p-10 rounded-[44px] flex items-center justify-between shadow-sm hover:border-indigo-200 transition-all active:scale-[0.98]"
            >
              <div className="text-left">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:bg-indigo-100 transition-colors">
                  <Settings size={28} />
                </div>
                <h3 className="text-[24px] font-black tracking-tight leading-none text-slate-900 mb-2">System Settings</h3>
                <p className="text-slate-500 text-[14px] font-medium max-w-[240px]">Global shop preferences, staff roles, and security logs.</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-200 group-hover:text-slate-900 group-hover:bg-indigo-50 transition-all">
                <ChevronRight size={40} />
              </div>
            </button>
          </div>
          
          <section className="bg-white border border-slate-100 rounded-[48px] p-12 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-16 opacity-[0.03] rotate-12">
              <Building2 size={240} />
            </div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 relative z-10">
              <div className="space-y-8 flex-1">
                <div className="flex items-center gap-4">
                  <div className="px-5 py-2 bg-indigo-600 text-white rounded-[14px] text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-200">
                    Flagship Branch
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-[14px]">
                    <TrendingUp size={18} /> High Growth Mode
                  </div>
                </div>
                <div>
                  <h3 className="text-[44px] font-black text-slate-900 leading-none tracking-tight">Makati Central</h3>
                  <p className="text-[17px] text-slate-500 font-medium max-w-lg mt-4 leading-relaxed">System-wide top performer in operational accuracy and customer retention for Q2 2026.</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 uppercase">
                        {i}
                      </div>
                    ))}
                  </div>
                  <span className="text-[13px] font-bold text-slate-400">Master Tailors Active</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-[40px] p-10 border border-slate-100 flex flex-col items-center justify-center text-center gap-2 min-w-[240px]">
                <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Revenue MTD</div>
                <div className="text-[48px] font-black text-slate-900 tracking-tighter">₱2.51M</div>
                <button className="mt-4 px-8 h-12 bg-slate-900 text-white rounded-2xl text-[13px] font-black hover:bg-indigo-600 transition-all shadow-xl">Performance Audit</button>
              </div>
            </div>
          </section>

          <section className="bg-white border border-slate-100 rounded-[48px] overflow-hidden shadow-sm">
            <div className="px-12 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <h2 className="text-[14px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
                <Users size={20} className="text-slate-400" /> Operational Calendar
              </h2>
              <span className="text-[11px] font-black text-indigo-600 uppercase tracking-widest bg-white border border-slate-200 px-4 py-1.5 rounded-full">3 Scheduled Today</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <tbody className="divide-y divide-slate-100">
                  {[
                    { name: "Maria Garcia", type: "Initial Consultation", status: "Scheduled", time: "10:00 AM", branch: "Makati" },
                    { name: "Elena Rostova", type: "1st Fitting", status: "Confirmed", time: "02:30 PM", branch: "BGC" },
                    { name: "Alexander McQueen", type: "Final Fitting", status: "Delayed", time: "04:00 PM", branch: "Makati" },
                  ].map((a, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-12 py-7">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-[20px] bg-slate-100 flex items-center justify-center font-black text-[14px] text-slate-500 group-hover:bg-white transition-colors">{a.name.charAt(0)}</div>
                          <div>
                            <div className="font-black text-[18px] text-slate-900">{a.name}</div>
                            <div className="text-[12px] text-slate-400 font-bold uppercase tracking-widest">{a.branch} Branch</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-12 py-7">
                        <div className="font-bold text-[15px] text-slate-700">{a.type}</div>
                        <div className={`mt-1.5 flex items-center gap-1.5 text-[10px] font-black uppercase ${
                          a.status === 'Confirmed' ? 'text-emerald-600' : 
                          a.status === 'Delayed' ? 'text-rose-600' : 
                          'text-amber-600'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${a.status === 'Confirmed' ? 'bg-emerald-500' : a.status === 'Delayed' ? 'bg-rose-500' : 'bg-amber-500'}`}></div>
                          {a.status}
                        </div>
                      </td>
                      <td className="px-12 py-7 text-right">
                        <div className="font-mono font-black text-[20px] text-slate-900 tracking-tighter">{a.time}</div>
                        <div className="text-[10px] text-slate-400 font-black uppercase mt-1">Start Time</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* ── SIDEBAR CONTEXT (Right) ── */}
        <div className="col-span-12 xl:col-span-4 space-y-8">
          
          <div className="bg-white border border-slate-100 rounded-[48px] p-10 shadow-sm relative group overflow-hidden">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <div className="flex items-center justify-between mb-10 relative z-10">
               <h3 className="text-[13px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                 <CalendarIcon size={16} /> System Schedule
               </h3>
             </div>
             <div className="grid grid-cols-7 gap-y-6 text-center relative z-10">
              {['S','M','T','W','T','F','S'].map((d, i) => <div key={`cal-header-${d}-${i}`} className="text-[11px] font-black text-slate-300 uppercase tracking-widest">{d}</div>)}
              {Array.from({length: 31}).map((_, i) => (
                <div key={`cal-day-${i}`} className={`text-[14px] font-black h-10 flex items-center justify-center relative cursor-pointer transition-all ${i + 1 === 2 ? 'text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                  {i + 1 === 2 && <div className="absolute inset-1.5 bg-indigo-600 rounded-2xl -z-10 shadow-xl shadow-indigo-200"></div>}
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 rounded-[48px] p-10 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
            <div className="flex items-center justify-between mb-10 relative z-10">
              <h3 className="text-[13px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Package size={16} /> Supply Chain Status
              </h3>
            </div>
            <div className="space-y-8 relative z-10">
              {[
                { item: "Premium Pina Silk", stock: "3.2m", limit: "5.0m", color: "rose" },
                { item: "Royal Blue Wool", stock: "12.5m", limit: "10.0m", color: "emerald" },
                { item: "Gold Emblems", stock: "8 units", limit: "20 units", color: "amber" },
              ].map((inv, i) => {
                const percent = Math.min(100, (parseFloat(inv.stock) / parseFloat(inv.limit)) * 100);
                return (
                  <div key={i} className="space-y-3">
                    <div className="flex items-center justify-between text-[13px] font-black">
                      <span className="text-slate-300">{inv.item}</span>
                      <span className={inv.color === 'rose' ? 'text-rose-400' : inv.color === 'amber' ? 'text-amber-400' : 'text-emerald-400'}>{inv.stock}</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-1000 ${inv.color === 'rose' ? 'bg-rose-500' : inv.color === 'amber' ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[48px] p-10 shadow-sm flex items-center gap-6">
            <div className="w-16 h-16 rounded-[28px] bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-sm shrink-0">
              <ShieldCheck size={32} />
            </div>
            <div>
              <div className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-1">System Security</div>
              <div className="text-[16px] font-black text-slate-900">Encrypted & Secure</div>
              <div className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> All Systems Nominal
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK ORDER INTAKE MODAL */}
      {isOrderIntakeOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-[900px] max-h-[95vh] rounded-[56px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border-8 border-white">
            <div className="px-14 py-12 border-b border-slate-50 flex items-start justify-between shrink-0">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg"><Plus size={24}/></div>
                  <h2 className="text-[32px] font-black text-slate-900 tracking-tight leading-none">Quick Order Intake Hub</h2>
                </div>
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 4].map(s => (
                    <div key={`ms-${s}`} className={`h-2 rounded-full transition-all ${intakeStep >= s ? 'w-16 bg-slate-900' : 'w-4 bg-slate-100'}`}></div>
                  ))}
                  <span className="text-[11px] text-slate-400 font-black uppercase tracking-[0.2em] ml-6">
                    {intakeStep === 4 ? 'FINAL REVIEW' : `STEP ${intakeStep} OF 4`}
                  </span>
                </div>
              </div>
              <button onClick={() => setIsOrderIntakeOpen(false)} className="w-16 h-16 rounded-[24px] bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-600 transition-all hover:bg-rose-50">
                <X size={28} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-14 bg-white min-h-[500px]">
              {intakeStep === 1 && (
                <div className="space-y-12 animate-in fade-in duration-300">
                   <div className="space-y-3">
                      <h3 className="text-[24px] font-black text-slate-900 tracking-tight">1. Client Identity</h3>
                      <p className="text-[15px] text-slate-500 font-medium">Start by linking an existing customer or creating a new digital profile.</p>
                   </div>
                   <div className="p-2 bg-slate-100 rounded-[32px] flex max-w-md">
                    <button onClick={() => setIsNewClient(false)} className={`flex-1 h-14 rounded-[26px] text-[14px] font-black transition-all ${!isNewClient ? 'bg-white shadow-xl text-slate-900' : 'text-slate-500'}`}>Existing Profile</button>
                    <button onClick={() => setIsNewClient(true)} className={`flex-1 h-14 rounded-[26px] text-[14px] font-black transition-all ${isNewClient ? 'bg-white shadow-xl text-slate-900' : 'text-slate-500'}`}>+ New Customer</button>
                  </div>
                  {isNewClient ? (
                    <div className="p-12 flex flex-col gap-8 bg-slate-50 rounded-[48px] border border-slate-100 shadow-inner">
                      <input type="text" placeholder="Client Full Name *" className="w-full h-18 bg-white border border-slate-200 rounded-[28px] px-8 text-[18px] font-black outline-none focus:border-slate-900 shadow-sm"/>
                      <div className="grid grid-cols-2 gap-8">
                        <input type="email" placeholder="Contact Email" className="w-full h-18 bg-white border border-slate-200 rounded-[28px] px-8 text-[18px] font-black outline-none focus:border-slate-900 shadow-sm"/>
                        <input type="text" placeholder="Mobile Number *" className="w-full h-18 bg-white border border-slate-200 rounded-[28px] px-8 text-[18px] font-black outline-none focus:border-slate-900 shadow-sm"/>
                      </div>
                    </div>
                  ) : (
                    <div className="relative group">
                      <div className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors pointer-events-none"><Search size={36} /></div>
                      <input type="text" placeholder="Search customer name or ID..." className="w-full h-28 bg-white border-2 border-slate-100 rounded-[48px] pl-24 pr-10 text-[22px] font-black outline-none focus:border-slate-900 shadow-xl" />
                    </div>
                  )}
                </div>
              )}
              {intakeStep === 2 && (
                <div className="space-y-12 animate-in fade-in duration-300">
                  <h3 className="text-[24px] font-black text-slate-900 tracking-tight">2. Fit Record</h3>
                  <div className="flex gap-4">
                    {['Polo', 'Pants', 'Custom'].map((type) => (
                      <button key={type} onClick={() => setNewMeasGarment(type)} className={`flex-1 h-18 rounded-[28px] text-[16px] font-black border transition-all ${newMeasGarment === type ? 'bg-slate-900 text-white shadow-xl' : 'bg-white text-slate-500 border-slate-200'}`}>{type}</button>
                    ))}
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-[48px] p-12 shadow-inner grid grid-cols-2 gap-x-12 gap-y-10">
                    {(newMeasGarment === 'Polo' ? ['Chest', 'Shoulder', 'Sleeve', 'Neck'] : ['Waist', 'Length', 'Inseam', 'Hips']).map((field) => (
                      <div key={field} className="space-y-4">
                        <label className="text-[13px] font-black text-slate-700 ml-1 uppercase tracking-widest">{field}</label>
                        <div className="flex items-center gap-4">
                          <div className="flex bg-white border border-slate-200 rounded-[24px] p-1.5 shadow-sm">
                            {['1/8', '1/4', '1/2', '3/4'].map(frac => (
                              <button key={frac} onClick={() => setMeasFractions({...measFractions, [field]: frac})} className={`w-12 h-10 text-[12px] font-black rounded-2xl flex items-center justify-center transition-all ${measFractions[field] === frac ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}>{frac}</button>
                            ))}
                          </div>
                          <input type="text" placeholder="00.0" className="flex-1 h-14 border border-slate-200 rounded-[24px] px-6 text-[18px] font-mono font-black text-center outline-none focus:border-slate-900 shadow-sm" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {intakeStep === 3 && (
                <div className="space-y-10 animate-in fade-in duration-300">
                  <div className="bg-white border-2 border-slate-100 rounded-[48px] shadow-sm overflow-hidden">
                    <div className="px-10 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                      <h3 className="text-[14px] font-black text-slate-900 flex items-center gap-3 tracking-[0.2em]"><Shirt size={20} className="text-slate-400"/> ORDER CONFIGURATION</h3>
                      <div className="flex bg-slate-100 p-1.5 rounded-[20px] border border-slate-200">
                        <button onClick={() => setOrderType('Solo')} className={`px-8 py-2.5 text-[13px] font-black rounded-[14px] transition-all ${orderType === 'Solo' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500'}`}>SOLO</button>
                        <button onClick={() => setOrderType('Bulk')} className={`px-8 py-2.5 text-[13px] font-black rounded-[14px] transition-all ${orderType === 'Bulk' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500'}`}>BULK</button>
                      </div>
                    </div>
                    <div className="p-12 grid grid-cols-2 gap-10">
                      <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block ml-2">Garment Category</label>
                        <select value={garmentType} onChange={(e) => setGarmentType(e.target.value)} className="w-full h-18 bg-slate-50 border border-slate-200 rounded-[28px] px-8 text-[18px] font-black outline-none focus:bg-white focus:border-slate-900 shadow-sm appearance-none">
                          <option value="Polo">Bespoke Polo</option>
                          <option value="Uniform">Corporate Uniform</option>
                          <option value="Tuxedo">Two-Piece Tuxedo</option>
                          <option value="Gown">Classic Wedding Gown</option>
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block ml-2">Base Price (₱)</label>
                        <input type="number" value={basePrice} onChange={(e) => setBasePrice(parseFloat(e.target.value))} className="w-full h-18 bg-slate-50 border border-slate-200 rounded-[28px] px-8 text-[18px] font-black outline-none focus:bg-white shadow-sm" />
                      </div>
                      <div className="col-span-2 bg-slate-50 border border-slate-200 rounded-[40px] p-8 flex items-center justify-between">
                        <div className="flex items-center gap-5">
                          <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center transition-all ${rushActive ? 'bg-amber-100 text-amber-600 shadow-xl shadow-amber-200/50' : 'bg-white text-slate-300'}`}><Zap size={32} /></div>
                          <div><h4 className="text-[20px] font-black text-slate-900 leading-none mb-1.5">Priority / Rush Order</h4><p className="text-[14px] text-slate-500 font-medium">Add rush fee and prioritize in production queue.</p></div>
                        </div>
                        <button onClick={() => setRushActive(!rushActive)} className={`w-18 h-10 rounded-full relative transition-all ${rushActive ? 'bg-amber-500 shadow-xl shadow-amber-200' : 'bg-slate-300'}`}>
                          <div className={`absolute top-1.5 w-7 h-7 rounded-full bg-white shadow-md transition-all ${rushActive ? 'left-9.5' : 'left-1.5'}`}></div>
                        </button>
                      </div>
                      <div className="col-span-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-4 ml-2">Production Notes</label>
                        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full h-40 bg-slate-50 border border-slate-200 rounded-[32px] p-8 text-[16px] font-medium text-slate-600 outline-none focus:bg-white shadow-sm resize-none"></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {intakeStep === 4 && (
                <div className="space-y-10 animate-in fade-in duration-300">
                  <div className="bg-emerald-50 border-2 border-emerald-100 rounded-[48px] p-12 flex items-center justify-between shadow-xl shadow-emerald-100/50">
                    <div className="flex items-center gap-8">
                       <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center text-emerald-600 shadow-xl shadow-emerald-200/50"><BadgeCheck size={48}/></div>
                       <div className="space-y-2">
                          <h4 className="text-[32px] font-black text-slate-900 tracking-tighter leading-none">₱{totalPrice.toLocaleString()}</h4>
                          <p className="text-[14px] text-emerald-700 font-black uppercase tracking-widest">Total Valuation Ready</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <div className="text-[18px] font-black text-slate-900">₱{deposit.toLocaleString()} Deposit</div>
                       <div className="text-[14px] text-slate-500 font-medium">Balance: ₱{(totalPrice - deposit).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                     <div className="bg-slate-50 rounded-[40px] p-10 border border-slate-100 space-y-6">
                        <div className="flex items-center gap-3"><Users size={20} className="text-indigo-600"/><h5 className="text-[13px] font-black text-slate-900 uppercase tracking-widest">Client Identity</h5></div>
                        <div className="text-[20px] font-black text-slate-900">Alexander McQueen</div>
                     </div>
                     <div className="bg-slate-50 rounded-[40px] p-10 border border-slate-100 space-y-6">
                        <div className="flex items-center gap-3"><Shirt size={20} className="text-indigo-600"/><h5 className="text-[13px] font-black text-slate-900 uppercase tracking-widest">Garment Detail</h5></div>
                        <div className="text-[20px] font-black text-slate-900">{garmentType} Order</div>
                     </div>
                  </div>
                  <div className="bg-slate-900 rounded-[48px] p-12 text-white relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-16 opacity-10 rotate-12"><Ruler size={160} /></div>
                     <div className="flex items-center gap-4 mb-10 relative z-10"><FileText size={24} className="text-indigo-400"/><h5 className="text-[13px] font-black text-slate-400 uppercase tracking-[0.2em]">Fit Record Preview</h5></div>
                     <div className="grid grid-cols-4 gap-12 relative z-10">
                        {Object.entries(measFractions).map(([field, frac]) => (
                          <div key={field} className="space-y-2">
                            <div className="text-[11px] text-slate-500 font-black uppercase tracking-widest">{field}</div>
                            <div className="text-[24px] font-black font-mono">16 {frac}&quot;</div>
                          </div>
                        ))}
                     </div>
                  </div>
                </div>
              )}
            </div>

            <div className="px-14 py-12 bg-slate-50/50 flex items-center justify-between border-t border-slate-50 shrink-0">
              <button onClick={() => setIntakeStep(Math.max(1, intakeStep - 1))} className="flex items-center gap-3 h-18 px-12 rounded-[28px] text-[16px] font-black text-slate-400 hover:text-slate-900 transition-all hover:bg-white shadow-sm border border-slate-200">
                <ChevronLeft size={24} /> {intakeStep === 1 ? 'CANCEL' : 'GO BACK'}
              </button>
              <button onClick={() => { if (intakeStep < 4) setIntakeStep(intakeStep + 1); else setIsOrderIntakeOpen(false); }}
                className={`h-18 px-16 rounded-[32px] text-[18px] font-black transition-all shadow-2xl active:scale-95 flex items-center gap-4 ${ intakeStep === 4 ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' : 'bg-slate-900 hover:bg-indigo-600 shadow-slate-900/20' } text-white`}
              >
                {intakeStep === 4 ? ( <div className="flex items-center gap-3 uppercase tracking-widest"><BadgeCheck size={26} /> CONFIRM & CREATE</div> ) : (
                  <div className="flex items-center gap-3 uppercase tracking-[0.2em]">NEXT STEP <ChevronRight size={24} /> </div>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS MODAL */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsSettingsOpen(false)}></div>
          <div className="w-[1100px] h-[85vh] bg-white rounded-[56px] shadow-2xl relative z-10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border-8 border-white">
            <div className="p-14 border-b border-slate-50 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-[36px] font-black text-slate-900 tracking-tight">System Settings</h2>
                <p className="text-[16px] text-slate-500 font-medium">Global shop preferences, staff accounts, and business security.</p>
              </div>
              <button onClick={() => setIsSettingsOpen(false)} className="w-18 h-18 rounded-[28px] bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-600 transition-colors"><X size={36} /></button>
            </div>
            
            <div className="flex-1 overflow-hidden flex">
              <div className="w-[320px] border-r border-slate-50 p-10 space-y-3 bg-slate-50/30 shrink-0">
                {[
                  { label: "General", icon: Settings },
                  { label: "Staff & Accounts", icon: UserPlus },
                  { label: "Subscription", icon: CreditCard },
                  { label: "Security & Logs", icon: Lock },
                  { label: "Shop Branding", icon: Palette },
                ].map((item, i) => (
                  <button key={i} onClick={() => setSettingsTab(item.label)} className={`w-full flex items-center gap-5 px-8 py-5 rounded-[24px] text-[15px] font-black transition-all ${settingsTab === item.label ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/20' : 'text-slate-500 hover:bg-white hover:shadow-sm'}`}>
                    <item.icon size={22} /> {item.label}
                  </button>
                ))}
              </div>

              <div className="flex-1 p-14 overflow-y-auto bg-white custom-scrollbar">
                {settingsTab === 'General' && (
                  <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-2 gap-10">
                      <div className="col-span-2 space-y-4">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">Business Name</label>
                        <input type="text" defaultValue="Sutura Tailoring" className="w-full h-18 bg-slate-50 border border-slate-200 rounded-[28px] px-8 text-[18px] font-black outline-none focus:bg-white focus:border-slate-900 shadow-sm" />
                      </div>
                      <div className="col-span-2 space-y-4">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">Shop Address</label>
                        <textarea defaultValue="123 Makati Avenue, Makati City, Metro Manila, 1200 Philippines" className="w-full h-36 bg-slate-50 border border-slate-200 rounded-[32px] p-8 text-[18px] font-medium text-slate-600 outline-none focus:bg-white focus:border-slate-900 shadow-sm resize-none"></textarea>
                      </div>
                      <div className="space-y-4">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">Primary Email</label>
                        <input type="email" defaultValue="admin@sutura.com" className="w-full h-18 bg-slate-50 border border-slate-200 rounded-[28px] px-8 text-[18px] font-black shadow-sm outline-none" />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">Contact Number</label>
                        <input type="text" defaultValue="+63 917 123 4567" className="w-full h-18 bg-slate-50 border border-slate-200 rounded-[28px] px-8 text-[18px] font-black shadow-sm outline-none" />
                      </div>
                    </div>
                  </div>
                )}
                {settingsTab === 'Staff & Accounts' && (
                  <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-300">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[18px] font-black text-slate-900 tracking-tight">Active Team Members</h4>
                      <button className="bg-slate-900 text-white h-14 px-8 rounded-2xl text-[13px] font-black hover:bg-indigo-600 transition-all flex items-center gap-3 shadow-lg"><UserPlus size={18} /> Register Staff</button>
                    </div>
                    <div className="space-y-4">
                      {[{ name: "Juan dela Cruz", role: "Master Tailor" }, { name: "Maria Clara", role: "Shop Manager" }].map((staff, i) => (
                        <div key={i} className="flex items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-[32px] hover:bg-white hover:border-indigo-100 transition-all group">
                          <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center font-black text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">{staff.name.charAt(0)}</div>
                            <div><div className="text-[17px] font-black text-slate-900">{staff.name}</div><div className="text-[12px] text-indigo-600 font-bold uppercase tracking-widest">{staff.role}</div></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {settingsTab === 'Subscription' && (
                  <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-300">
                    <div className="bg-slate-900 rounded-[48px] p-12 text-white relative overflow-hidden shadow-2xl">
                      <div className="absolute top-0 right-0 p-16 opacity-10 rotate-12"><CreditCard size={160} /></div>
                      <div className="relative z-10 space-y-6">
                        <div className="px-5 py-2 bg-indigo-600 text-white rounded-full text-[11px] font-black uppercase tracking-[0.2em] w-fit shadow-lg shadow-indigo-500/20">Active Professional Plan</div>
                        <h3 className="text-[48px] font-black tracking-tighter leading-none">₱749.00 <span className="text-[18px] text-slate-400 font-medium">/ month</span></h3>
                      </div>
                    </div>
                  </div>
                )}
                {settingsTab === 'Security & Logs' && (
                  <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-300">
                    <div className="grid grid-cols-2 gap-8">
                       <div className="bg-slate-50 rounded-[44px] p-10 border border-slate-100 space-y-8">
                          <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-[24px] bg-white text-indigo-600 flex items-center justify-center shadow-sm"><Database size={32}/></div>
                            <h4 className="text-[18px] font-black text-slate-900">System Archive</h4>
                          </div>
                          <button className="w-full h-16 bg-slate-900 text-white rounded-[24px] text-[14px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3"><FileJson size={20}/> Generate JSON</button>
                       </div>
                       <div className="bg-slate-50 rounded-[44px] p-10 border border-slate-100 space-y-8">
                          <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-[24px] bg-white text-emerald-600 flex items-center justify-center shadow-sm"><FileSpreadsheet size={32}/></div>
                            <h4 className="text-[18px] font-black text-slate-900">CSV Export</h4>
                          </div>
                          <button className="w-full h-16 bg-slate-900 text-white rounded-[24px] text-[14px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3"><FileSpreadsheet size={20}/> Export Data</button>
                       </div>
                    </div>
                  </div>
                )}
                {settingsTab === 'Shop Branding' && (
                  <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-300">
                    <div className="grid grid-cols-12 gap-10">
                      <div className="col-span-4 space-y-6">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block ml-2">Shop Logo</label>
                        <div className="aspect-square bg-slate-50 rounded-[48px] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:bg-indigo-50/50 transition-all shadow-inner">
                           <Upload size={40} className="text-slate-300 group-hover:text-indigo-600 transition-transform group-hover:-translate-y-2" />
                           <span className="text-[13px] font-black text-slate-400 group-hover:text-indigo-900 uppercase">UPLOAD</span>
                        </div>
                      </div>
                      <div className="col-span-8 space-y-8">
                        <input type="text" defaultValue="La Belle Couture" className="w-full h-18 bg-slate-50 border border-slate-200 rounded-[28px] px-8 text-[18px] font-black outline-none focus:border-slate-900 shadow-sm" />
                        <div className="relative">
                          <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                          <input type="text" defaultValue="123 Fashion Ave, Makati City" className="w-full h-18 bg-slate-50 border border-slate-200 rounded-[28px] pl-16 pr-8 text-[18px] font-black outline-none focus:border-slate-900 shadow-sm" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-12 bg-slate-50/50 border-t border-slate-50 flex justify-end gap-6 shrink-0">
              <button onClick={() => setIsSettingsOpen(false)} className="h-18 px-12 rounded-[28px] text-[16px] font-black text-slate-400 hover:text-slate-900 transition-all bg-white shadow-sm border border-slate-100">CANCEL</button>
              <button onClick={() => setIsSettingsOpen(false)} className="bg-slate-900 text-white h-18 px-16 rounded-[32px] text-[18px] font-black hover:bg-indigo-600 transition-all shadow-2xl active:scale-95">SAVE CHANGES</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
