'use client';

import { 
  ShoppingBag, 
  Search, 
  Filter, 
  ChevronRight, 
  Tag, 
  Package, 
  Wind,
  Layers
} from 'lucide-react';

const MATERIALS = [
  { id: 1, name: 'Pina-Seda (Handwoven)', category: 'Luxury Fabric', origin: 'Aklan, PH', stock: '24m', img: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=400', price: '₱1,200/m' },
  { id: 2, name: 'Premium Italian Wool', category: 'Suiting', origin: 'Biella, Italy', stock: '15m', img: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&q=80&w=400', price: '₱2,800/m' },
  { id: 3, name: 'Linen-Cotton Blend', category: 'Breathable', origin: 'Local', stock: '45m', img: 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?auto=format&fit=crop&q=80&w=400', price: '₱450/m' },
  { id: 4, name: 'Nacre Shell Buttons', category: 'Trims', origin: 'Zamboanga, PH', stock: '200pcs', img: 'https://images.unsplash.com/photo-1598460341503-490351270258?auto=format&fit=crop&q=80&w=400', price: '₱15/pc' },
];

export default function MaterialsPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2 text-emerald-600">
            <ShoppingBag size={20}/>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Material Sourcing</span>
          </div>
          <h1 className="text-[42px] font-black text-slate-900 tracking-tight leading-tight">
            Material <span className="text-slate-400 italic">Library</span>
          </h1>
          <p className="text-slate-500 font-medium mt-2">Curate and select high-end fabrics and trims for your collections.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="h-14 px-6 bg-white border border-slate-100 rounded-2xl flex items-center gap-3 text-[13px] font-black text-slate-600 hover:bg-slate-50 transition-all">
            <Package size={18}/> Manage Stock
          </button>
          <button className="h-14 px-8 bg-emerald-600 text-white rounded-2xl flex items-center gap-3 text-[14px] font-black hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-95">
             Order Swatches
          </button>
        </div>
      </div>

      {/* CATEGORY TABS */}
      <div className="flex items-center gap-4 mb-10 overflow-x-auto pb-4 scrollbar-hide">
        {['All Materials', 'Luxury Fabrics', 'Suiting', 'Linings', 'Buttons', 'Trims & Lace'].map((cat, i) => (
          <button key={i} className={`whitespace-nowrap h-12 px-6 rounded-xl text-[12px] font-black uppercase tracking-widest transition-all ${
            i === 0 ? 'bg-slate-900 text-white' : 'bg-white border border-slate-100 text-slate-400 hover:text-slate-900 hover:border-slate-300'
          }`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {MATERIALS.map((mat) => (
          <div key={mat.id} className="group cursor-pointer">
             <div className="aspect-square bg-slate-100 rounded-[32px] overflow-hidden mb-5 relative border border-slate-100 shadow-sm group-hover:shadow-xl transition-all duration-500">
                <img src={mat.img} alt={mat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
                <div className="absolute top-4 right-4">
                   <div className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                      <Tag size={16}/>
                   </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 p-4 bg-white/90 backdrop-blur-md rounded-2xl border border-white/20 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Available Stock</div>
                   <div className="text-sm font-black text-slate-900 tracking-tight">{mat.stock}</div>
                </div>
             </div>
             
             <div className="px-2">
                <div className="flex items-center justify-between mb-1">
                   <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{mat.category}</span>
                   <span className="text-xs font-black text-slate-900">{mat.price}</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-600 transition-colors tracking-tight">{mat.name}</h3>
                <div className="flex items-center gap-2 mt-2 text-slate-400 text-[11px] font-bold">
                   <Wind size={12}/> Origin: <span className="text-slate-600">{mat.origin}</span>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
