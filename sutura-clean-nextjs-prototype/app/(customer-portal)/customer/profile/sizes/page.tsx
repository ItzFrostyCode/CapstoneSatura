'use client';

import { useERPStore } from "@/store/useERPStore";
import { useState } from 'react';
import { 
  Plus, X, ArrowLeft, Ruler,
  ChevronDown, Layers, Tag, Edit3, Save
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

type PageView = 'list' | 'add' | 'edit';

export default function MySizesPage() {
  const { currentUser } = useERPStore();
  const [view, setView] = useState<PageView>('list');
  const [editingData, setEditingData] = useState<any>(null);
  const [expandedPattern, setExpandedPattern] = useState<string | null>(null);

  // ── MOCK DATA (HIERARCHICAL) - DO NOT CHANGE ──
  const patterns = [
    {
      name: 'Slim Wedding Fit',
      versions: [
        {
          id: 'MEAS-101',
          version_no: 2,
          is_current: true,
          recorded_at: '2026-05-10',
          fit_preference: 'Slim',
          posture_tags: ['Square Shoulders', 'Erect'],
          metrics: { neck: 15.5, shoulder: 18, chest: 40, waist: 34, hips: 38, sleeve: 24, armhole: 19, bicep: 14, wrist: 7, back_width: 16, front_width: 15, slope: 2, length: 28 },
          notes: 'Increased chest by 0.5" for better movement during the ceremony.'
        },
        {
          id: 'MEAS-100',
          version_no: 1,
          is_current: false,
          recorded_at: '2026-04-15',
          fit_preference: 'Slim',
          posture_tags: ['Square Shoulders'],
          metrics: { neck: 15.2, shoulder: 17.8, chest: 39.5, waist: 33.5, hips: 37.5, sleeve: 23.8, armhole: 18.5, bicep: 13.5, wrist: 7, back_width: 15.8, front_width: 14.8, slope: 2, length: 27.5 },
          notes: 'Initial measurement profile.'
        }
      ]
    },
    {
      name: 'Casual Relaxed',
      versions: [
        {
          id: 'MEAS-201',
          version_no: 1,
          is_current: true,
          recorded_at: '2026-05-12',
          fit_preference: 'Loose',
          posture_tags: ['Normal Stance'],
          metrics: { neck: 16, shoulder: 19, chest: 42, waist: 36, hips: 40, sleeve: 25, armhole: 20, bicep: 15, wrist: 7.5, back_width: 17, front_width: 16, slope: 2, length: 29 },
          notes: 'Relaxed fit for casual linen shirts and weekend wear.'
        }
      ]
    }
  ];

  if (view === 'add' || view === 'edit') {
    return (
      <div className="min-h-screen bg-[#FDFCFB] pb-32 animate-in slide-in-from-right duration-500">
         <div className="w-full px-5 py-6 space-y-6">
            <div className="flex items-center justify-between sticky top-0 bg-[#FDFCFB]/80 backdrop-blur-md z-10 pb-4 border-b border-slate-100">
               <div className="flex items-center gap-3">
                  <button onClick={() => setView('list')} className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
                    <ArrowLeft size={20} />
                  </button>
                  <div>
                    <h1 className="text-[18px] font-black text-slate-900 tracking-tight italic uppercase leading-none">{view === 'edit' ? 'Edit Measurement' : 'Add Measurement'}</h1>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{view === 'edit' ? `Editing V.${editingData?.version_no}` : 'New Digital Profile'}</p>
                  </div>
               </div>
            </div>

            <div className="space-y-6">
               {/* FIT VERSION NAME */}
               <div className="space-y-2">
                  <SectionTitle number="1" title="Fit Version Name" />
                  <input 
                    placeholder="e.g. Slim Wedding Fit, Casual Relaxed" 
                    defaultValue={editingData?.name || ''}
                    className="w-full h-12 bg-white border border-slate-100 rounded-xl px-4 text-[13px] font-bold text-slate-900 placeholder:text-slate-300 focus:border-slate-900 transition-all outline-none" 
                  />
               </div>

               {/* POSTURE & FIGURATION */}
               <div className="space-y-3">
                  <SectionTitle number="2" title="Posture & Figuration" />
                  <div className="flex flex-wrap gap-1.5">
                     {['SQUARE SHOULDERS', 'STOOPED', 'ERECT', 'PROMINENT CHEST', 'PROMINENT SEAT', 'SWAY BACK', 'HEAD FORWARD'].map(opt => (
                       <button key={opt} className={`px-3 py-2 border rounded-lg text-[9px] font-black transition-all ${editingData?.posture_tags?.includes(opt) ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-100 text-slate-400 hover:text-slate-900 hover:border-slate-900'}`}>
                          {opt}
                       </button>
                     ))}
                  </div>
               </div>

               {/* FIT PREFERENCE */}
               <div className="space-y-3">
                  <SectionTitle number="3" title="Fit Preference" />
                  <div className="bg-slate-100 p-1 rounded-xl flex items-center">
                     {['SLIM', 'REGULAR', 'LOOSE', 'OVERSIZED'].map(opt => (
                       <button key={opt} className={`flex-1 h-10 rounded-lg text-[9px] font-black tracking-widest transition-all ${opt === (editingData?.fit_preference?.toUpperCase() || 'REGULAR') ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>
                          {opt}
                       </button>
                     ))}
                  </div>
               </div>

               {/* DETAILED METRICS */}
               <div className="space-y-3">
                  <SectionTitle number="4" title="Detailed Metrics (Inches)" />
                  <div className="bg-white border border-slate-100 rounded-2xl p-4 grid grid-cols-2 gap-x-6 gap-y-1 shadow-sm">
                     {[
                       { l: 'NECK', k: 'neck' }, { l: 'SHOULDER', k: 'shoulder' }, { l: 'CHEST', k: 'chest' }, { l: 'WAIST', k: 'waist' },
                       { l: 'HIPS', k: 'hips' }, { l: 'SLEEVE', k: 'sleeve' }, { l: 'ARMHOLE', k: 'armhole' }, { l: 'BICEP', k: 'bicep' },
                       { l: 'WRIST', k: 'wrist' }, { l: 'BACK WIDTH', k: 'back_width' }, { l: 'FRONT WIDTH', k: 'front_width' }, { l: 'SLOPE', k: 'slope' },
                       { l: 'LENGTH', k: 'length' }
                     ].map(m => (
                       <div key={m.l} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                          <span className="text-[9px] font-black text-slate-300 tracking-widest leading-none">{m.l}</span>
                          <span className="text-[12px] font-black text-slate-500">{editingData?.metrics?.[m.k] || '0.0'}&quot;</span>
                       </div>
                     ))}
                  </div>
               </div>

               {/* STYLE PREFERENCES */}
               <div className="space-y-3">
                  <SectionTitle number="5" title="Style Preferences & Notes" />
                  <textarea 
                    placeholder="Specific fit requests..." 
                    defaultValue={editingData?.notes || ''}
                    className="w-full h-24 bg-white border border-slate-100 rounded-2xl p-4 text-[13px] font-medium text-slate-600 placeholder:text-slate-300 focus:border-slate-900 transition-all outline-none resize-none shadow-sm" 
                  />
               </div>

               <div className="pt-2 pb-10">
                  <button onClick={() => setView('list')} className="w-full h-14 bg-[#0F172A] text-white rounded-xl flex items-center justify-center gap-2 font-black text-[11px] uppercase tracking-[0.2em] shadow-xl active:scale-[0.98] transition-all">
                    <Save size={16} /> {view === 'edit' ? 'Update Profile' : 'Save Pattern to Vault'}
                  </button>
               </div>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-40 animate-in fade-in duration-500">
      {/* ── HEADER ── */}
      <div className="bg-white px-6 pt-10 pb-8 sticky top-0 z-[100] shadow-sm border-b border-slate-50">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
           <div className="flex items-center gap-4">
              <Link href="/customer/dashboard" className="w-11 h-11 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all shadow-sm">
                 <ArrowLeft size={22} />
              </Link>
              <div>
                 <h1 className="text-[22px] font-black text-slate-900 tracking-tight italic uppercase leading-none">Measurements</h1>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Your perfect fit profiles</p>
              </div>
           </div>
           <button onClick={() => { setEditingData(null); setView('add'); }} className="w-11 h-11 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition-all">
              <Plus size={22} />
           </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-8">
        
        {/* PATTERN LIST */}
        {patterns.map((pattern) => (
          <div key={pattern.name} className="space-y-4">
             <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center">
                      <Layers size={16} />
                   </div>
                   <h2 className="text-[16px] font-black text-slate-900 tracking-tight uppercase leading-none">{pattern.name}</h2>
                </div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{pattern.versions.length} Versions</span>
             </div>

             <div className="space-y-4">
                {pattern.versions.map((v) => (
                   <div key={v.id} className={`bg-white border rounded-[28px] overflow-hidden transition-all duration-500 ${v.is_current ? 'border-slate-900 ring-4 ring-slate-900/5 shadow-xl' : 'border-slate-100 shadow-sm'}`}>
                      {/* Version Header */}
                      <div className="p-5 flex items-center justify-between border-b border-slate-50">
                         <div className="flex items-center gap-3">
                            <div className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${v.is_current ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400'}`}>
                               V.{v.version_no}
                            </div>
                            <span className="text-[11px] font-bold text-slate-400 uppercase">{format(new Date(v.recorded_at), 'MMM d, yyyy')}</span>
                         </div>
                         <button 
                            onClick={() => setExpandedPattern(expandedPattern === v.id ? null : v.id)}
                            className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"
                         >
                            <ChevronDown size={18} className={`transition-transform duration-300 ${expandedPattern === v.id ? 'rotate-180' : ''}`} />
                         </button>
                      </div>

                      {/* Summary Row */}
                      <div className="p-5 grid grid-cols-4 gap-4">
                         <SummaryItem label="Fit" value={v.fit_preference} color="text-indigo-600" />
                         <SummaryItem label="Chest" value={v.metrics.chest + '"'} color="text-slate-900" />
                         <SummaryItem label="Waist" value={v.metrics.waist + '"'} color="text-slate-900" />
                         <SummaryItem label="Length" value={v.metrics.length + '"'} color="text-slate-900" />
                      </div>

                      {/* Expanded Details */}
                      {expandedPattern === v.id && (
                        <div className="px-5 pb-6 space-y-6 animate-in slide-in-from-top-4 duration-500">
                           {/* Posture */}
                           <div className="pt-5 border-t border-slate-50">
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2.5 flex items-center gap-2">
                                 <Tag size={10} /> Posture & Figuration
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                 {v.posture_tags.map(tag => (
                                   <span key={tag} className="px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-600">{tag}</span>
                                 ))}
                              </div>
                           </div>

                           {/* Full Metrics */}
                           <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                 <Ruler size={10} /> Detailed Metrics
                              </p>
                              <div className="grid grid-cols-4 gap-y-4 gap-x-2">
                                 {Object.entries(v.metrics).map(([key, val]) => (
                                   <div key={key} className="flex flex-col">
                                      <span className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter truncate leading-none mb-1">{key.replace('_', ' ')}</span>
                                      <span className="text-[12px] font-black text-slate-900 leading-none">{val}&quot;</span>
                                   </div>
                                 ))}
                              </div>
                           </div>

                           {/* Notes */}
                           <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 italic">
                              <p className="text-[12px] text-slate-500 font-medium leading-relaxed">
                                 &ldquo;{v.notes}&rdquo;
                              </p>
                           </div>
                           
                           {/* Actions */}
                           <div className="pt-6 flex gap-3">
                              <button 
                                onClick={() => {
                                   setEditingData({ ...v, name: pattern.name });
                                   setView('edit');
                                }}
                                className="flex-1 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/10 active:scale-95 transition-all"
                              >
                                 <Edit3 size={14} /> Edit Version
                              </button>
                              <button className="h-12 px-6 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest hover:text-slate-900 transition-all">
                                 New Version
                              </button>
                           </div>
                        </div>
                      )}
                   </div>
                ))}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SummaryItem({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex flex-col">
       <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest mb-1 leading-none">{label}</span>
       <span className={`text-[13px] font-black ${color} tracking-tight leading-none`}>{value}</span>
    </div>
  );
}

function SectionTitle({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-1">
       <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-black text-slate-400">
          {number}
       </div>
       <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest leading-none">{title}</h3>
    </div>
  );
}
