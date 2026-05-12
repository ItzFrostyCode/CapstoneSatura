'use client';

import React, { useState } from 'react';
import { 
  ChevronLeft, Save, Send, 
  Download, Image as ImageIcon, 
  User, Calendar, CheckCircle2,
  Palette, Scissors, Info, 
  Plus, Trash2, Sparkles, 
  ArrowUpRight, ListPlus
} from 'lucide-react';
import Link from 'next/link';

export default function NewDesignSheet() {
  const [projectTitle, setProjectTitle] = useState('New Garment Blueprint');
  const [details, setDetails] = useState(['', '', '']);
  const [instructions, setInstructions] = useState(['', '']);
  const [materials, setMaterials] = useState([{ name: '', use: '' }]);

  const addDetail = () => setDetails([...details, '']);
  const addInstruction = () => setInstructions([...instructions, '']);
  const addMaterial = () => setMaterials([...materials, { name: '', use: '' }]);

  return (
    <div className="max-w-[1300px] mx-auto space-y-8 font-outfit pb-20">
      
      {/* ── HEADER: ACTION BAR ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
         <div className="flex items-center gap-5">
            <Link href="/designer/projects">
               <button className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all">
                  <ChevronLeft size={24} />
               </button>
            </Link>
            <div className="flex-1">
               <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase tracking-widest border border-indigo-100">Draft Blueprint</span>
                  <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md uppercase tracking-widest border border-amber-100">Active Consultation</span>
               </div>
               <input 
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="Enter Garment Name..."
                  className="text-3xl font-black text-slate-900 tracking-tight bg-transparent border-none outline-none focus:ring-0 p-0 w-full placeholder:text-slate-200"
               />
            </div>
         </div>
         <div className="flex items-center gap-3">
            <button className="px-6 py-3.5 bg-white border-2 border-slate-100 rounded-2xl font-black text-sm text-slate-900 hover:border-slate-900 transition-all flex items-center gap-2">
               <Save size={18} /> Save Draft
            </button>
            <button className="px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 transition-all flex items-center gap-2">
               <Send size={18} /> Publish Blueprint
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         
         {/* ── LEFT: VISUAL INPUTS ── */}
         <div className="lg:col-span-5 space-y-8">
            <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm relative">
               <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                     <Sparkles size={16} className="text-indigo-600" /> Main Concept Sketch
                  </h3>
               </div>
               <div className="aspect-[3/4] bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center text-center p-12 group hover:border-indigo-600 transition-all cursor-pointer">
                  <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-4 text-slate-300 group-hover:scale-110 group-hover:text-indigo-600 transition-all">
                     <ImageIcon size={32} />
                  </div>
                  <div className="text-sm font-black text-slate-900">Upload Main Sketch</div>
                  <div className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tight">JPG, PNG or PDF (Max 10MB)</div>
               </div>
            </div>

            <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
               <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Inspiration Board</h3>
                  <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">+ Add</button>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="aspect-square bg-slate-50 border border-slate-100 rounded-[24px] flex items-center justify-center text-slate-200 hover:text-indigo-600 cursor-pointer transition-all">
                       <Plus size={24} />
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* ── RIGHT: TECHNICAL INPUTS ── */}
         <div className="lg:col-span-7 space-y-8">
            
            {/* Project Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-5">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                     <User size={24} />
                  </div>
                  <div className="flex-1">
                     <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Select Client</div>
                     <input placeholder="Search client name..." className="w-full text-sm font-black text-slate-900 bg-transparent border-none p-0 outline-none placeholder:text-slate-200" />
                  </div>
               </div>
               <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-5">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                     <Calendar size={24} />
                  </div>
                  <div className="flex-1">
                     <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Date</div>
                     <input type="date" className="w-full text-sm font-black text-slate-900 bg-transparent border-none p-0 outline-none" />
                  </div>
               </div>
            </div>

            {/* Materials & Palette */}
            <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                     <Palette size={18} className="text-amber-500" /> Materials & Palette
                  </h3>
                  <button onClick={addMaterial} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1 hover:underline">
                     <Plus size={12} /> Add Material
                  </button>
               </div>
               <div className="space-y-4 mb-8">
                  {materials.map((m, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                       <input 
                          placeholder="Fabric Name"
                          className="flex-1 bg-transparent border-none outline-none text-sm font-black text-slate-900 placeholder:text-slate-200"
                       />
                       <div className="w-px h-6 bg-slate-200" />
                       <input 
                          placeholder="Usage (e.g. Main Body)"
                          className="flex-1 bg-transparent border-none outline-none text-xs font-bold text-slate-500 placeholder:text-slate-200"
                       />
                       <button className="text-slate-200 hover:text-rose-500 transition-all"><Trash2 size={16} /></button>
                    </div>
                  ))}
               </div>
               <div className="flex flex-wrap gap-4">
                  {[1, 2, 3, 4].map((swatch) => (
                    <div key={swatch} className="w-14 h-14 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 hover:border-indigo-600 hover:text-indigo-600 cursor-pointer transition-all">
                       <Plus size={16} />
                    </div>
                  ))}
               </div>
            </div>

            {/* Technical Breakdown */}
            <div className="bg-slate-900 rounded-[40px] p-10 text-white space-y-10 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full -mr-32 -mt-32 blur-3xl" />
               
               <div>
                  <div className="flex items-center justify-between mb-6">
                     <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Scissors size={18} className="text-indigo-400" /> Style Details
                     </h3>
                     <button onClick={addDetail} className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:underline">+ Add Detail</button>
                  </div>
                  <div className="space-y-3">
                     {details.map((d, i) => (
                        <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 focus-within:border-indigo-500 transition-all">
                           <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                           <input 
                              placeholder="e.g. High-low hemline with structured sleeves"
                              className="w-full bg-transparent border-none outline-none text-sm font-medium text-slate-300 placeholder:text-slate-600"
                           />
                        </div>
                     ))}
                  </div>
               </div>

               <div className="pt-10 border-t border-white/5">
                  <div className="flex items-center justify-between mb-6">
                     <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Info size={18} className="text-amber-400" /> Special Instructions
                     </h3>
                     <button onClick={addInstruction} className="text-[10px] font-black text-amber-400 uppercase tracking-widest hover:underline">+ Add Instruction</button>
                  </div>
                  <div className="space-y-3">
                     {instructions.map((ins, i) => (
                        <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 focus-within:border-amber-500 transition-all">
                           <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                           <input 
                              placeholder="e.g. Reinforced internal boning for structure"
                              className="w-full bg-transparent border-none outline-none text-sm font-medium text-slate-300 placeholder:text-slate-600"
                           />
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Internal Save & Export */}
            <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 flex items-center justify-between">
               <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                  <CheckCircle2 size={16} /> Data auto-saved to local draft
               </div>
               <button className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 hover:underline">
                  Clear All Fields <Trash2 size={14} />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
