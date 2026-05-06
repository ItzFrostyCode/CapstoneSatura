'use client';

import React from 'react';
import { Target, Layout, Clock, X } from 'lucide-react';
import { Customer, FittingSession, MeasurementProfile } from '@/types/erp';

interface OverviewTabProps {
  customer: Customer;
  fittingSessions: FittingSession[];
  measurementProfiles: MeasurementProfile[];
  postureTags: string[];
  onUpdatePosture: (tags: string[]) => void;
  onUpdateStyle: (style: string) => void;
  newPostureTag: string;
  setNewPostureTag: (tag: string) => void;
  onAddCustomTag: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  customer,
  fittingSessions,
  measurementProfiles,
  postureTags,
  onUpdatePosture,
  onUpdateStyle,
  newPostureTag,
  setNewPostureTag,
  onAddCustomTag
}) => {
  const customerFittings = fittingSessions.filter(
    s => measurementProfiles.find(m => m.id === s.measurement_profile_id)?.customer_id === customer.id
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white border border-slate-200 rounded-[32px] p-8 space-y-6">
          <h3 className="text-[18px] font-black text-slate-900 flex items-center gap-2">
            <Target size={20} className="text-indigo-500" /> Posture & Figuration
          </h3>
          
          <div className="flex flex-wrap gap-2">
            {(customer.posture_tags || []).map(tag => (
              <div key={tag} className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[12px] font-bold border border-slate-900">
                {tag}
                <button onClick={() => onUpdatePosture(customer.posture_tags?.filter(t => t !== tag) || [])}>
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-50">
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Quick Add Tags</div>
            <div className="flex flex-wrap gap-2">
              {postureTags.filter(tag => !customer.posture_tags?.includes(tag)).map(tag => (
                <button 
                  key={tag} 
                  onClick={() => onUpdatePosture([...(customer.posture_tags || []), tag])} 
                  className="px-3 py-1.5 bg-white text-slate-400 border border-slate-200 rounded-lg text-[11px] font-bold hover:border-indigo-500 hover:text-indigo-600 transition-all"
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={newPostureTag} 
                onChange={e => setNewPostureTag(e.target.value)}
                placeholder="Add custom tag..." 
                className="flex-1 h-11 px-4 bg-slate-50 border border-slate-100 rounded-xl text-[13px] font-medium outline-none focus:bg-white"
              />
              <button onClick={onAddCustomTag} className="px-4 bg-slate-900 text-white rounded-xl text-[12px] font-black">Add</button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[32px] p-8 space-y-6">
          <h3 className="text-[18px] font-black text-slate-900 flex items-center gap-2">
            <Layout size={20} className="text-emerald-500" /> Style Preferences
          </h3>
          <textarea 
            className="w-full h-32 bg-slate-50 border border-slate-100 rounded-[24px] p-6 text-[14px] font-medium text-slate-600 outline-none focus:bg-white focus:border-indigo-500 transition-all resize-none"
            value={customer.style_preferences || ''}
            onChange={(e) => onUpdateStyle(e.target.value)}
            placeholder="e.g. Prefers slim fit, double vents, peak lapel..."
          />
        </div>
      </div>

      <div className="space-y-8">
         <div className="bg-slate-900 rounded-[32px] p-8 text-white space-y-6">
            <h3 className="text-[16px] font-black flex items-center gap-2">
              <Clock size={18} className="text-indigo-400" /> Recent Fitting
            </h3>
            <div className="space-y-6">
              {customerFittings.slice(0, 2).map(session => (
                <div key={session.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase text-indigo-400">Session #{session.session_no}</span>
                    <span className="text-[11px] text-slate-500">{new Date(session.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-[13px] text-slate-300 font-medium line-clamp-2 italic">&quot;{session.adjustment_notes}&quot;</p>
                </div>
              ))}
              {customerFittings.length === 0 && (
                <p className="text-[12px] text-slate-500 font-medium italic">No recent fitting history.</p>
              )}
            </div>
         </div>
      </div>
    </div>
  );
};
