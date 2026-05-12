'use client';

import React, { useState } from 'react';
import { 
  User, Mail, Phone, MapPin, 
  Globe, Link2, MessageCircle,
  Award, Scissors, Palette, 
  ShieldCheck, ExternalLink, Camera,
  Plus, Edit3, Sparkles
} from 'lucide-react';
import { PostDesignModal } from '../portfolio/components/PostDesignModal';

export default function DesignerProfile() {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  return (
    <div className="max-w-[1200px] mx-auto space-y-10 font-outfit pb-20">
      
      {/* ── PROFESSIONAL IDENTITY HEADER ── */}
      <div className="relative">
         {/* Portfolio Banner */}
         <div className="h-64 md:h-80 w-full rounded-[48px] bg-gradient-to-br from-indigo-500 to-purple-600 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 opacity-20">
               <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1200" alt="Banner" className="w-full h-full object-cover" />
            </div>
            <button className="absolute top-8 right-8 p-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl text-white hover:bg-white hover:text-slate-900 transition-all flex items-center gap-2 text-xs font-black uppercase tracking-widest">
               <Camera size={14} /> Change Banner
            </button>
         </div>

         {/* Profile Info Overlay */}
         <div className="absolute -bottom-12 left-12 right-12 flex flex-col md:flex-row items-end gap-6">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[40px] bg-white p-2 shadow-2xl border border-white relative group">
               <div className="w-full h-full rounded-[32px] overflow-hidden bg-slate-100">
                  <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400" alt="Profile" className="w-full h-full object-cover" />
               </div>
               <button className="absolute inset-2 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px] flex items-center justify-center">
                  <Camera size={24} />
               </button>
            </div>
            <div className="flex-1 pb-4">
               <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-black text-white drop-shadow-md">Joshua Wayman Arabojo</h1>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-1">
                     <ShieldCheck size={12} /> Verified Designer
                  </span>
               </div>
               <p className="text-white/80 font-bold mt-1 text-sm md:text-base">Couture Designer & Creative Director</p>
            </div>
            <div className="pb-4">
               <button className="bg-white text-slate-900 px-8 py-3.5 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all shadow-xl flex items-center gap-2">
                  <Edit3 size={18} /> Edit Profile
               </button>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-20 pt-10">
         {/* Left Column: About & Specialization */}
         <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
               <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                  <Sparkles size={20} className="text-amber-500" /> About Creative
               </h3>
               <p className="text-sm font-medium text-slate-500 leading-relaxed mb-6">
                  Specializing in the fusion of traditional Philippine textiles with modern avant-garde silhouettes. Over 8 years of experience in custom-made bridal and luxury barong.
               </p>
               <div className="space-y-4">
                  <div className="flex items-center gap-4 text-slate-400">
                     <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center"><MapPin size={18} /></div>
                     <span className="text-sm font-bold text-slate-600">Manila, Philippines</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-400">
                     <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center"><Award size={18} /></div>
                     <span className="text-sm font-bold text-slate-600">8+ Years Experience</span>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
               <h3 className="text-lg font-black text-slate-900 mb-6">Specializations</h3>
               <div className="flex flex-wrap gap-2">
                  {['Modern Filipiniana', 'Bespoke Barong', 'Bridal Couture', 'Streetwear', 'Avant-Garde'].map((tag) => (
                    <span key={tag} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black uppercase tracking-wide">
                       {tag}
                    </span>
                  ))}
               </div>
            </div>

            <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
               <h3 className="text-lg font-black text-slate-900 mb-6">Connect</h3>
               <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 p-3 bg-slate-50 rounded-2xl text-slate-600 hover:bg-slate-900 hover:text-white transition-all text-xs font-black">
                     <Link2 size={16} /> Instagram
                  </button>
                  <button className="flex items-center justify-center gap-2 p-3 bg-slate-50 rounded-2xl text-slate-600 hover:bg-slate-900 hover:text-white transition-all text-xs font-black">
                     <Globe size={16} /> Website
                  </button>
               </div>
            </div>
         </div>

         {/* Right Column: Portfolio Highlights */}
         <div className="lg:col-span-8">
            <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm h-full">
               <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Showcase Highlights</h2>
                    <p className="text-slate-400 text-sm font-medium mt-1">Featured designs and concepts.</p>
                  </div>
                  <button 
                    onClick={() => setIsPostModalOpen(true)}
                    className="flex items-center gap-2 text-indigo-600 font-black text-sm hover:underline"
                  >
                    <Plus size={16} /> Add to Showcase
                  </button>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400',
                    'https://images.unsplash.com/photo-1566206091558-7f218b696731?auto=format&fit=crop&q=80&w=400',
                    'https://images.unsplash.com/photo-1537832816519-689ad163238b?auto=format&fit=crop&q=80&w=400'
                  ].map((url, i) => (
                    <div key={i} className="aspect-[4/5] bg-slate-100 rounded-3xl overflow-hidden relative group cursor-pointer shadow-sm">
                       <img src={url} alt={`Port-${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                       <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ExternalLink size={24} className="text-white" />
                       </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => setIsPostModalOpen(true)}
                    className="aspect-[4/5] bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 hover:border-indigo-500 hover:text-indigo-500 transition-all group"
                  >
                     <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-2 group-hover:scale-110 transition-transform">
                        <Plus size={20} />
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-widest">New Design</span>
                  </button>
               </div>
            </div>
         </div>
      </div>

      <PostDesignModal 
        isOpen={isPostModalOpen} 
        onClose={() => setIsPostModalOpen(false)} 
      />
    </div>
  );
}
