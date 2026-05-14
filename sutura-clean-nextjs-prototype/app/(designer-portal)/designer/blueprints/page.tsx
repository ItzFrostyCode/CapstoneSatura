'use client';

import { 
  Plus, 
  Search, 
  Layers, 
  Ruler, 
  Scissors, 
  Download, 
  Edit3, 
  Trash2,
  ChevronRight,
  FileText
} from 'lucide-react';

const BLUEPRINTS = [
  { id: 'BP-102', name: 'Victorian Corset Base', category: 'Foundation', lastEdit: '2h ago', items: 8, status: 'Active' },
  { id: 'BP-101', name: 'Modern Barong V2', category: 'Formal', lastEdit: '1d ago', items: 5, status: 'Draft' },
  { id: 'BP-099', name: 'Linen Summer Set', category: 'Casual', lastEdit: '5d ago', items: 12, status: 'Archived' },
  { id: 'BP-098', name: 'Silk Evening Gown', category: 'Gowns', lastEdit: '1w ago', items: 15, status: 'Active' },
];

export default function BlueprintsPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-widest rounded-md border border-indigo-200">
              Design Vault
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Technical Sketches</span>
          </div>
          <h1 className="text-[42px] font-black text-gray-900 tracking-tight leading-tight">
            Design <span className="text-gray-400 italic">Portfolio</span>
          </h1>
          <p className="text-gray-500 font-medium text-lg mt-1">Manage your design blueprints and technical sketches for customer review.</p>
        </div>
        
        <button className="h-14 px-8 bg-indigo-600 text-white rounded-2xl flex items-center gap-3 text-[14px] font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95">
          <Plus size={20} /> Create New Blueprint
        </button>
      </div>

      {/* QUICK FILTERS */}
      <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {['All Designs', 'Bespoke Bases', 'Formal Wear', 'Foundation', 'Archived'].map((tab, i) => (
          <button key={i} className={`whitespace-nowrap h-11 px-6 rounded-xl text-[12px] font-black uppercase tracking-widest transition-all ${
            i === 0 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white border border-gray-100 text-gray-400 hover:text-gray-900'
          }`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {BLUEPRINTS.map((bp) => (
          <div key={bp.id} className="group bg-white rounded-[40px] border border-gray-100 p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[100px] -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700 opacity-50" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  <Scissors size={24} />
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{bp.id}</span>
                   <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${
                    bp.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                  }`}>
                    {bp.status}
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">{bp.name}</h3>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6">{bp.category}</p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Last Edit</div>
                  <div className="text-xs font-bold text-gray-900">{bp.lastEdit}</div>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Assets</div>
                  <div className="text-xs font-bold text-gray-900">{bp.items} Files</div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button className="flex-1 h-12 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all">
                  Open Sketches
                </button>
                <button className="w-12 h-12 border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:border-indigo-100 transition-all">
                  <Edit3 size={18} />
                </button>
                <button className="w-12 h-12 border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-rose-600 hover:border-rose-100 transition-all">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* ADD NEW PLACEHOLDER */}
        <button className="border-2 border-dashed border-gray-200 rounded-[40px] flex flex-col items-center justify-center gap-4 hover:border-indigo-500 hover:bg-indigo-50/30 transition-all group min-h-[400px]">
          <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-all group-hover:rotate-12">
            <Plus size={40}/>
          </div>
          <div className="text-center">
            <span className="block text-sm font-black text-gray-400 group-hover:text-indigo-600 transition-colors uppercase tracking-widest mb-1">New Pattern</span>
            <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">Start from scratch</span>
          </div>
        </button>
      </div>
    </div>
  );
}
