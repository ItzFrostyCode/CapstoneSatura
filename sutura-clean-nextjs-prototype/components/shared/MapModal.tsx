'use client';

import React from 'react';
import { X, MapPin, Scissors, Star, Navigation, User } from 'lucide-react';

interface Shop {
  id: string;
  name: string;
  type: string;
  location: string;
  rating: number;
  reviews: number;
  image: string;
  isVerified: boolean;
}

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  shops: Shop[];
  title?: string;
  type?: 'shop' | 'designer';
}

export const MapModal: React.FC<MapModalProps> = ({ 
  isOpen, 
  onClose, 
  shops, 
  title = "Tailoring Network Map",
  type = 'shop'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="bg-white w-full max-w-[1200px] h-full max-h-[800px] rounded-[40px] flex flex-col overflow-hidden relative z-10 shadow-[0_40px_100px_rgba(0,0,0,0.3)] animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h2>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Showing {shops.length} verified {type === 'shop' ? 'locations' : 'professionals'}</p>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row min-h-0">
          {/* Map Area */}
          <div className="flex-1 bg-slate-100 relative overflow-hidden">
             <iframe 
              src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d31643.43574581177!2d125.60155!3d7.0707!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!2stailoring%20shops%20davao!5e0!3m2!1sen!2sph!4v1715560000000!5m2!1sen!2sph" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 z-0"
            ></iframe>

            {/* Mock Floating Markers on top of Real Map */}
            <div className="absolute inset-0 pointer-events-none z-10">
               {/* Mock Shop 1 */}
               <div className="absolute top-[35%] left-[45%] pointer-events-auto group">
                  <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-2xl border-4 border-white animate-bounce-slow cursor-pointer">
                    {type === 'shop' ? <Scissors size={18} strokeWidth={2.5} /> : <User size={18} strokeWidth={2.5} />}
                  </div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-slate-900 text-white px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all text-[10px] font-black whitespace-nowrap">
                    {shops[0]?.name || 'Partner'} ({type === 'shop' ? 'Verified Shop' : 'Verified Designer'})
                  </div>
               </div>

               {/* Mock Shop 2 */}
               <div className="absolute top-[50%] left-[55%] pointer-events-auto group">
                  <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-2xl border-4 border-white animate-bounce-slow cursor-pointer">
                    {type === 'shop' ? <Scissors size={18} strokeWidth={2.5} /> : <User size={18} strokeWidth={2.5} />}
                  </div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-slate-900 text-white px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all text-[10px] font-black whitespace-nowrap">
                    {shops[1]?.name || 'Partner'} ({type === 'shop' ? 'Verified Shop' : 'Verified Designer'})
                  </div>
               </div>

               {/* Current User Location */}
               <div className="absolute top-[60%] left-[50%]">
                  <div className="w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-lg animate-pulse" />
                  <div className="mt-2 bg-white px-3 py-1 rounded-full text-[10px] font-black text-blue-600 shadow-sm border border-blue-100">You are here</div>
               </div>
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
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-indigo-600 rounded-full" /> {type === 'shop' ? 'Sutura Verified Shop' : 'Sutura Verified Designer'}</span>
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
