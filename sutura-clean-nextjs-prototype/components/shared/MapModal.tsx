'use client';

import React from 'react';
import { X, MapPin, Scissors, Star, Navigation } from 'lucide-react';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  shops: any[];
}

export const MapModal: React.FC<MapModalProps> = ({ isOpen, onClose, shops }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="bg-white w-full max-w-[1200px] h-full max-h-[800px] rounded-[40px] flex flex-col overflow-hidden relative z-10 shadow-[0_40px_100px_rgba(0,0,0,0.3)] animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Tailoring Network Map</h2>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Showing {shops.length} verified locations</p>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row min-h-0">
          {/* Map Area */}
          <div className="flex-1 bg-slate-100 relative overflow-hidden bg-[url('https://api.dicebear.com/7.x/identicon/svg?seed=map&backgroundColor=f1f5f9')] bg-repeat opacity-50">
             {/* Visual Map Grid */}
             <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 pointer-events-none opacity-20">
                {Array.from({ length: 144 }).map((_, i) => (
                   <div key={i} className="border-[0.5px] border-slate-300" />
                ))}
             </div>

             {/* Mock Map Markers */}
             {shops.map((shop, i) => (
                <div 
                  key={shop.id}
                  className="absolute animate-bounce-slow"
                  style={{ 
                    top: `${20 + (i * 15)}%`, 
                    left: `${30 + (i * 12)}%` 
                  }}
                >
                   <div className="relative group">
                      <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-2xl cursor-pointer hover:scale-110 transition-transform border-4 border-white">
                         <Scissors size={20} strokeWidth={2.5} />
                      </div>
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 bg-slate-900 text-white p-4 rounded-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none shadow-2xl">
                         <div className="font-black text-sm mb-1">{shop.name}</div>
                         <div className="flex items-center gap-1 text-[10px] text-indigo-300 font-bold mb-2">
                            <Star size={10} className="fill-indigo-300" /> {shop.rating} • {shop.reviews} Reviews
                         </div>
                         <div className="text-[10px] font-medium text-slate-400">{shop.location}</div>
                         <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-900" />
                      </div>
                   </div>
                </div>
             ))}

             {/* Current User Location (Mock) */}
             <div className="absolute top-[60%] left-[45%]">
                <div className="w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-lg animate-pulse" />
                <div className="mt-2 bg-white px-3 py-1 rounded-full text-[10px] font-black text-blue-600 shadow-sm border border-blue-100">You are here</div>
             </div>
          </div>

          {/* Sidebar / Shop List */}
          <div className="w-full lg:w-[380px] bg-white border-l border-slate-100 overflow-y-auto p-6 space-y-4">
             <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Nearby Shops</h3>
             {shops.map((shop) => (
                <div key={shop.id} className="p-5 rounded-3xl border border-slate-100 hover:border-indigo-600 hover:bg-indigo-50/30 transition-all group cursor-pointer">
                   <div className="flex items-center gap-4 mb-3">
                      <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                         <Scissors size={20} />
                      </div>
                      <div>
                         <h4 className="font-black text-slate-900 text-[15px]">{shop.name}</h4>
                         <p className="text-[12px] font-bold text-slate-400">{shop.type}</p>
                      </div>
                   </div>
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[12px] font-black text-slate-500">
                         <Navigation size={14} className="text-indigo-600" /> 2.4 km away
                      </div>
                      <button className="text-[11px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Directions</button>
                   </div>
                </div>
             ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400">
           <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-indigo-600 rounded-full" /> Sutura Verified Shop</span>
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-blue-500 rounded-full" /> Your Location</span>
           </div>
           <div className="uppercase tracking-widest">Map Data © 2026 Sutura Systems</div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
