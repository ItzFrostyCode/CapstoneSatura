'use client';

import React, { useState } from 'react';
import { 
  Plus, Search, Filter, 
  MoreHorizontal, Eye, Share2, 
  CheckCircle2, Globe, Lock,
  LayoutGrid, List, BarChart3,
  ArrowUpRight, FileText, Sparkles,
  Palette, ChevronRight
} from 'lucide-react';
import { PostDesignModal } from './components/PostDesignModal';
import { DesignBlueprintModal } from './components/DesignBlueprintModal';

export default function DesignerStudio() {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isBlueprintOpen, setIsBlueprintOpen] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('All Works');

  const portfolioItems = [
    { 
      id: 1, 
      title: 'Midnight Silk Gala', 
      category: 'Evening Wear', 
      type: 'Showcase',
      status: 'Published', 
      views: '1.2k', 
      img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
      aspect: 'aspect-[3/4]'
    },
    { 
      id: 2, 
      title: 'Modern Filipiniana V2', 
      category: 'Couture', 
      type: 'Signature Design',
      status: 'Published', 
      views: '850', 
      img: 'https://images.unsplash.com/photo-1566206091558-7f218b696731?auto=format&fit=crop&q=80&w=800',
      aspect: 'aspect-square'
    },
    { 
      id: 3, 
      title: 'Urban Streetwear Prep', 
      category: 'Streetwear', 
      type: 'Sketch',
      status: 'Draft', 
      views: '0', 
      img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800',
      aspect: 'aspect-[4/3]'
    },
    { 
      id: 4, 
      title: 'Summer Linen Suite', 
      category: 'Ready-to-Wear', 
      type: 'Concept',
      status: 'Published', 
      views: '2.1k', 
      img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800',
      aspect: 'aspect-[3/4]'
    },
    { 
      id: 5, 
      title: 'Avant-Garde Concept', 
      category: 'Conceptual', 
      type: 'Showcase',
      status: 'Private', 
      views: '12', 
      img: 'https://images.unsplash.com/photo-1537832816519-689ad163238b?auto=format&fit=crop&q=80&w=800',
      aspect: 'aspect-[4/5]'
    },
  ];

  const filteredItems = portfolioItems.filter(item => {
    if (activeTab === 'All Works') return true;
    if (activeTab === 'Concepts') return item.type === 'Concept' || item.type === 'Sketch';
    if (activeTab === 'Showcase') return item.type === 'Showcase' || item.type === 'Signature Design';
    return true;
  });

  return (
    <div className="space-y-10 font-outfit">
      
      {/* ── HEADER & STATS ── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">Designer Studio</h1>
          <p className="text-lg font-medium text-slate-500">The creative layer: concept to blueprint showcase.</p>
        </div>

        <div className="flex items-center gap-4 bg-white p-2 rounded-[28px] border border-slate-100 shadow-sm">
           <div className="flex -space-x-3 px-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-100 overflow-hidden shadow-sm">
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=follower_${i}`} alt="" />
                </div>
              ))}
           </div>
           <div className="h-8 w-px bg-slate-100 mx-2"></div>
           <div className="pr-6">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Portfolio Impact</div>
              <div className="text-[14px] font-black text-slate-900 leading-none flex items-center gap-1">
                 4.2k <span className="text-emerald-500 text-[10px] tracking-normal">▲ 12%</span>
              </div>
           </div>
        </div>
      </div>

      {/* ── SEARCH & FILTERS ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl">
          {['All Works', 'Showcase', 'Concepts', 'Drafts'].map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${
                activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search designs..." 
              className="w-64 h-12 pl-12 pr-4 bg-white border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:border-indigo-600 transition-all shadow-sm"
            />
          </div>
          <button 
            onClick={() => setIsPostModalOpen(true)}
            className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            Publish Showcase
          </button>
        </div>
      </div>

      {/* ── PORTFOLIO GRID (Masonry-like Columns) ── */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-8 space-y-8">
        
        <div 
          onClick={() => setIsPostModalOpen(true)}
          className="break-inside-avoid bg-slate-50 border-2 border-dashed border-slate-200 rounded-[40px] p-10 flex flex-col items-center justify-center text-center group hover:border-indigo-500 hover:bg-white transition-all cursor-pointer min-h-[300px]"
        >
           <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <Plus size={32} />
           </div>
           <h3 className="text-lg font-black text-slate-900">Add Creative Work</h3>
           <p className="text-xs font-medium text-slate-400 mt-2">Upload sketches, concepts, or signature styles.</p>
        </div>

        {filteredItems.map((item) => (
          <div 
            key={item.id} 
            className="break-inside-avoid bg-white rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all group overflow-hidden cursor-pointer relative"
          >
            {/* Type Badge Top Left */}
            <div className="absolute top-6 left-6 z-10 flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-md text-slate-900 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg border border-white/50">
               {item.type === 'Signature Design' ? <Sparkles size={12} className="text-amber-500" /> : <Palette size={12} className="text-indigo-500" />}
               {item.type}
            </div>

            {/* Image Wrap */}
            <div className={`w-full overflow-hidden relative ${item.aspect}`}>
               <img 
                 src={item.img} 
                 alt={item.title} 
                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="space-y-3">
                     <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-white text-slate-900 rounded-lg text-[10px] font-black uppercase tracking-widest">{item.category}</span>
                        {item.status === 'Published' && (
                          <span className="px-3 py-1 bg-emerald-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                             <Globe size={10} /> Live Showcase
                          </span>
                        )}
                     </div>
                     <h3 className="text-xl font-black text-white leading-tight">{item.title}</h3>
                  </div>
               </div>
            </div>

            {/* Actions Bar */}
            <div className="p-6 border-t border-slate-50 bg-white group-hover:bg-slate-50 transition-all">
               <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs">
                       <Eye size={14} className="text-indigo-400" />
                       {item.views}
                    </div>
                  </div>
                  <div className="flex gap-2">
                     <button className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all"><Share2 size={16} /></button>
                     <button className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all"><MoreHorizontal size={16} /></button>
                  </div>
               </div>

               {item.type === 'Signature Design' ? (
                 <button 
                   onClick={() => {
                     setSelectedDesign(item);
                     setIsBlueprintOpen(true);
                   }}
                   className="w-full py-3 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
                 >
                    <FileText size={14} /> Design Blueprint <ChevronRight size={14} />
                 </button>
               ) : (
                 <button className="w-full py-3 bg-white border border-slate-100 text-slate-900 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 hover:border-indigo-600 transition-all">
                    View Showcase <ArrowUpRight size={14} />
                 </button>
               )}
            </div>
          </div>
        ))}
      </div>

      <PostDesignModal 
        isOpen={isPostModalOpen} 
        onClose={() => setIsPostModalOpen(false)} 
      />

      <DesignBlueprintModal 
        isOpen={isBlueprintOpen}
        onClose={() => setIsBlueprintOpen(false)}
        design={selectedDesign}
      />
    </div>
  );
}
