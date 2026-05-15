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
          <h3 className="text-[15px] font-bold text-slate-800">
            Posture & Figuration
          </h3>
          
          <div className="flex flex-wrap gap-2">
            {(customer.posture_tags || []).map(tag => (
              <div key={tag} className="flex items-center gap-2 px-5 py-2.5 bg-[#222] text-white rounded-full text-[14px] font-medium group">
                {tag}
                <button 
                  onClick={() => onUpdatePosture(customer.posture_tags?.filter(t => t !== tag) || [])}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <div className="text-[15px] font-bold text-slate-800 mb-5">Quick Add Tags</div>
            <div className="flex flex-wrap gap-3">
              {[
                'Full Bicep', 'Square', 'Stopped', 'Thin',
                'Square Shoulders', 'Stooped', 'Erect', 'Prominent Seat', 
                'Sway Back', 'Head Forward', 'Low Right Shoulder', 
                'Low Left Shoulder'
              ].filter(tag => !customer.posture_tags?.includes(tag)).map(tag => (
                <button 
                  key={tag} 
                  onClick={() => onUpdatePosture([...(customer.posture_tags || []), tag])} 
                  className="flex items-center gap-3 px-5 py-2.5 bg-white text-slate-400 border border-slate-100 rounded-full text-[14px] font-medium hover:border-slate-400 hover:text-slate-600 transition-all shadow-sm shadow-slate-100/50"
                >
                  {tag} <span className="text-[18px] leading-none text-slate-900 font-light">+</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6">
            <div className="flex gap-3">
              <input 
                type="text" 
                value={newPostureTag} 
                onChange={e => setNewPostureTag(e.target.value)}
                placeholder="Add custom tag..." 
                className="flex-1 h-12 px-6 bg-slate-50/50 border border-slate-100 rounded-2xl text-[14px] font-medium outline-none focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all"
              />
              <button 
                onClick={onAddCustomTag} 
                className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-600 transition-all active:scale-95 shadow-lg shadow-slate-900/10"
              >
                <span className="text-[20px] font-light">+</span>
              </button>
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
         <div className="bg-slate-900 rounded-[32px] p-8 text-white space-y-6 shadow-2xl">
            <h3 className="text-[12px] font-black flex items-center gap-2 uppercase tracking-[0.2em] text-indigo-400">
               Client Identity & Source
            </h3>
            <div className="grid grid-cols-1 gap-6">
               <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Entry Source</div>
                  <div className={`px-3 py-1 rounded-lg text-[11px] font-black uppercase tracking-widest ${
                    customer.source === 'ONLINE' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {customer.source || 'WALKIN'}
                  </div>
               </div>
               <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Professional Category</div>
                  <div className="text-[13px] font-black text-white uppercase tracking-wider">
                    {customer.type?.replace('_', ' ') || 'REGULAR CLIENT'}
                  </div>
               </div>
               <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Account Status</div>
                  <div className={`text-[12px] font-black uppercase tracking-widest ${customer.is_active ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {customer.is_active ? '● Active' : '○ Inactive'}
                  </div>
               </div>
               <div className="flex items-center justify-between">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Client Since</div>
                  <div className="text-[13px] font-black text-slate-300">
                    {new Date(customer.createdAt).toLocaleDateString('en-PH', { month: 'long', year: 'numeric' })}
                  </div>
               </div>
            </div>
         </div>

         <div className="bg-white border border-slate-200 rounded-[32px] p-8 space-y-6 shadow-sm">
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
