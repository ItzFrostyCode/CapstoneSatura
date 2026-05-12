'use client';

import React, { useState } from 'react';
import { 
  X, FileText, Scissors, 
  Palette, Ruler, Info, 
  ChevronRight, Save, Send,
  Layers, Settings, Sparkles, CheckCircle2
} from 'lucide-react';

interface DesignBlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  design: any;
}

export function DesignBlueprintModal({ isOpen, onClose, design }: DesignBlueprintModalProps) {
  const [step, setStep] = useState(1);
  const [specData, setSpecData] = useState({
    garmentType: design?.category || '',
    fabricRecs: 'Pineapple Silk, Cotton Lining',
    construction: 'Double-needle stitching, concealed zipper',
    sizing: 'Standard S, M, L, XL',
    complexity: 'High',
    estHours: '24'
  });

  if (!isOpen || !design) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-[900px] h-[85vh] bg-white rounded-[48px] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-500">
        
        {/* Left Panel: Preview */}
        <div className="w-full md:w-[35%] bg-slate-900 p-10 flex flex-col justify-between relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full -mr-32 -mt-32 blur-3xl" />
           
           <div className="relative z-10">
              <div className="flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-4">
                 <Sparkles size={14} /> Blueprint Draft
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight mb-2">{design.title}</h2>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                 Converting creative vision into technical specifications for production.
              </p>
           </div>

           <div className="relative z-10 space-y-6">
              <div className="aspect-[4/5] bg-white/5 border border-white/10 rounded-[32px] overflow-hidden">
                 <img src={design.img} alt="" className="w-full h-full object-cover opacity-60" />
              </div>
              <div className="flex items-center justify-between px-2">
                 <div className="text-center">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Complexity</div>
                    <div className="text-white font-black text-sm">{specData.complexity}</div>
                 </div>
                 <div className="w-px h-8 bg-white/10" />
                 <div className="text-center">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Lab Hours</div>
                    <div className="text-white font-black text-sm">{specData.estHours}h</div>
                 </div>
                 <div className="w-px h-8 bg-white/10" />
                 <div className="text-center">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</div>
                    <div className="text-emerald-400 font-black text-sm uppercase tracking-tighter">Draft</div>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Panel: Form */}
        <div className="flex-1 bg-white flex flex-col h-full overflow-hidden">
           <div className="p-8 md:p-12 flex items-center justify-between border-b border-slate-50">
              <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
                 {['Technical', 'Materials', 'Sizing'].map((t, i) => (
                   <button 
                     key={t}
                     onClick={() => setStep(i + 1)}
                     className={`px-6 py-2 rounded-xl text-[10px] font-black transition-all ${step === i + 1 ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-900'}`}
                   >
                      {t}
                   </button>
                 ))}
              </div>
              <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all">
                 <X size={20} />
              </button>
           </div>

           <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
              {step === 1 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                   <div className="space-y-6">
                      <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                         <Settings size={20} className="text-indigo-600" /> Technical Construction
                      </h3>
                      <div className="space-y-4">
                         <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Garment Structure</label>
                            <input 
                              type="text"
                              value={specData.garmentType}
                              onChange={(e) => setSpecData({...specData, garmentType: e.target.value})}
                              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:border-indigo-600 transition-all"
                            />
                         </div>
                         <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Construction Details</label>
                            <textarea 
                              rows={4}
                              value={specData.construction}
                              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:border-indigo-600 transition-all resize-none"
                              placeholder="Describe stitching, internal framing, linings..."
                            />
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                   <div className="space-y-6">
                      <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                         <Palette size={20} className="text-amber-500" /> Material Specifications
                      </h3>
                      <div className="space-y-4">
                         <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Recommended Fabrics</label>
                            <textarea 
                              rows={3}
                              value={specData.fabricRecs}
                              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:border-indigo-600 transition-all resize-none"
                            />
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                               <div className="text-[10px] font-black text-slate-400 uppercase mb-2">Trimmings</div>
                               <div className="text-xs font-bold text-slate-600">Brass Buttons, Silk Thread</div>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                               <div className="text-[10px] font-black text-slate-400 uppercase mb-2">Internal Support</div>
                               <div className="text-xs font-bold text-slate-600">Horsehair Braid, Interfacing</div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                   <div className="space-y-6">
                      <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                         <Ruler size={20} className="text-emerald-500" /> Sizing & Grading
                      </h3>
                      <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-100">
                         <div className="grid grid-cols-2 gap-y-6 gap-x-10">
                            <div>
                               <div className="text-[10px] font-black text-slate-400 uppercase mb-2">Standard Scale</div>
                               <div className="text-sm font-black text-slate-900">Adult Mens (XS - 3XL)</div>
                            </div>
                            <div>
                               <div className="text-[10px] font-black text-slate-400 uppercase mb-2">Key Metric</div>
                               <div className="text-sm font-black text-slate-900">Chest Circumference</div>
                            </div>
                            <div>
                               <div className="text-[10px] font-black text-slate-400 uppercase mb-2">Customizable?</div>
                               <div className="flex items-center gap-2 text-sm font-black text-emerald-600">
                                  <CheckCircle2 size={16} /> Yes, Bespoke Allowed
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              )}
           </div>

           <div className="p-8 md:p-12 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button className="flex items-center gap-2 text-slate-400 font-black text-xs hover:text-slate-900 transition-all">
                 <Save size={16} /> Save Progress
              </button>
              <div className="flex items-center gap-4">
                 {step < 3 ? (
                   <button 
                     onClick={() => setStep(step + 1)}
                     className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-indigo-600 transition-all flex items-center gap-2 shadow-xl shadow-slate-900/10"
                   >
                      Next Step <ChevronRight size={18} />
                   </button>
                 ) : (
                   <button 
                     onClick={onClose}
                     className="px-8 py-3.5 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-xl shadow-emerald-600/20"
                   >
                      Publish Blueprint <Send size={18} />
                   </button>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
