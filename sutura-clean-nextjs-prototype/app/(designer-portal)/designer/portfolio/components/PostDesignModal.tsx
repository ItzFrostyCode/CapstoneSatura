'use client';

import React, { useState } from 'react';
import { 
  X, Upload, Image as ImageIcon, 
  Tag, Globe, Lock, Save,
  CheckCircle2, Sparkles, ChevronRight, Plus
} from 'lucide-react';

interface PostDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PostDesignModal({ isOpen, onClose }: PostDesignModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Signature Design',
    description: '',
    visibility: 'public'
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />

      <div className="relative w-full max-w-[900px] bg-white rounded-[48px] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
        
        {/* Left Side: Studio Upload */}
        <div className="w-full md:w-[40%] bg-slate-50 p-10 border-r border-slate-100 flex flex-col">
           <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                 <Sparkles size={20} />
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Studio Showcase</h2>
           </div>

           <div className="flex-1 flex flex-col justify-center">
              <label className="group relative flex flex-col items-center justify-center w-full aspect-[3/4] border-2 border-dashed border-slate-200 rounded-[32px] bg-white hover:border-indigo-500 hover:bg-indigo-50/30 transition-all cursor-pointer overflow-hidden">
                 <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:scale-110 group-hover:bg-white group-hover:text-indigo-600 transition-all shadow-sm mb-4">
                       <Upload size={24} />
                    </div>
                    <p className="mb-1 text-sm font-black text-slate-900">Drop showcase work</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">JPG, PNG or WEBP (Max 10MB)</p>
                 </div>
                 <input type="file" className="hidden" />
              </label>
              <div className="mt-6 flex items-center gap-3">
                 <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-300"><ImageIcon size={20} /></div>
                 <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-300"><ImageIcon size={20} /></div>
                 <button className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-indigo-600 hover:bg-indigo-50 transition-all"><Plus size={20} /></button>
              </div>
           </div>

           <div className="mt-10 p-6 bg-indigo-50 rounded-[24px] border border-indigo-100/50">
              <p className="text-[11px] font-bold text-indigo-400 leading-relaxed uppercase tracking-wider">
                 <span className="text-indigo-600 font-black">Studio Tip:</span> Use high-fidelity images to showcase texture and silhouette to clients.
              </p>
           </div>
        </div>

        {/* Right Side: Showcase Details */}
        <div className="flex-1 p-10 md:p-14 flex flex-col">
           <div className="flex items-center justify-between mb-12">
              <div className="flex gap-2">
                 {[1, 2].map((s) => (
                    <div key={s} className={`h-1.5 w-12 rounded-full transition-all ${s <= step ? 'bg-indigo-600' : 'bg-slate-100'}`} />
                 ))}
              </div>
              <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all">
                 <X size={20} />
              </button>
           </div>

           <div className="flex-1 space-y-8">
              {step === 1 ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                   <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block px-1">Work Title</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Modern Filipiniana Signature Piece"
                        className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-600 transition-all shadow-sm"
                      />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block px-1">Creative Type</label>
                         <select className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-600 transition-all shadow-sm appearance-none">
                            <option>Signature Design</option>
                            <option>Showcase Piece</option>
                            <option>Concept Sketch</option>
                            <option>Work in Progress</option>
                         </select>
                      </div>
                      <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block px-1">Studio Visibility</label>
                         <div className="flex gap-2 bg-slate-100 p-1 rounded-2xl">
                            <button className="flex-1 bg-white text-slate-900 px-3 py-3 rounded-xl text-[11px] font-black shadow-sm flex items-center justify-center gap-2">
                               <Globe size={14} className="text-indigo-600" /> Public
                            </button>
                            <button className="flex-1 text-slate-400 px-3 py-3 rounded-xl text-[11px] font-black flex items-center justify-center gap-2 hover:text-slate-900">
                               <Lock size={14} /> Private
                            </button>
                         </div>
                      </div>
                   </div>
                   <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block px-1">Creative Story</label>
                      <textarea 
                        rows={4}
                        placeholder="Describe the inspiration and aesthetic of this piece..."
                        className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-600 transition-all shadow-sm resize-none"
                      />
                   </div>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                   <div className="text-center py-10">
                      <div className="w-20 h-20 bg-emerald-50 rounded-[32px] flex items-center justify-center text-emerald-600 mx-auto mb-6">
                         <CheckCircle2 size={40} />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 mb-2">Ready to Showcase</h3>
                      <p className="text-sm font-medium text-slate-500">Your work will be added to your studio and the public SUTURA inspiration gallery.</p>
                   </div>
                   
                   <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-100">
                      <div className="flex items-center justify-between mb-4">
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showcase Preview</span>
                         <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline cursor-pointer">Edit</span>
                      </div>
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-white rounded-xl border border-slate-100"></div>
                         <div>
                            <div className="text-sm font-black text-slate-900">Modern Filipiniana Signature Piece</div>
                            <div className="text-[11px] font-bold text-slate-400">Signature Design • Public Showcase</div>
                         </div>
                      </div>
                   </div>
                </div>
              )}
           </div>

           <div className="mt-auto pt-10 flex gap-4">
              {step === 1 ? (
                <>
                  <button className="flex-1 py-4 bg-slate-900 text-white rounded-[22px] font-black text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2" onClick={() => setStep(2)}>
                    Next Step <ChevronRight size={18} />
                  </button>
                  <button className="px-8 py-4 bg-slate-50 text-slate-400 rounded-[22px] font-black text-sm hover:bg-slate-100 hover:text-slate-900 transition-all">
                    Save Draft
                  </button>
                </>
              ) : (
                <>
                  <button className="flex-1 py-4 bg-indigo-600 text-white rounded-[22px] font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2" onClick={onClose}>
                    Add to Studio <Save size={18} />
                  </button>
                  <button className="px-8 py-4 bg-slate-50 text-slate-400 rounded-[22px] font-black text-sm hover:bg-slate-100 transition-all" onClick={() => setStep(1)}>
                    Back
                  </button>
                </>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
