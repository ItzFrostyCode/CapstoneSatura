'use client';

import React from 'react';
import { Ruler, History, Info } from 'lucide-react';
import { MeasurementProfile } from '@/types/erp';

interface MeasurementsTabProps {
  profiles: MeasurementProfile[];
  customerId: string;
  onRecordFitting: (profile: MeasurementProfile) => void;
  unit: 'Inches' | 'Centimeters';
}

export const MeasurementsTab: React.FC<MeasurementsTabProps> = ({
  profiles,
  customerId,
  onRecordFitting,
  unit
}) => {
  const filteredProfiles = profiles.filter(m => m.customer_id === customerId);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {filteredProfiles.map(profile => (
        <div key={profile.id} className="bg-white border border-slate-200 rounded-[32px] overflow-hidden">
          <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shadow-sm">
                <Ruler size={24} />
              </div>
              <div>
                <h4 className="text-[16px] font-black text-slate-900">{profile.profile_name}</h4>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{profile.garment_type} • {profile.fit_preference}</span>
                  {profile.base_size && <span className="px-2 py-0.5 rounded-full bg-slate-900 text-white text-[9px] font-black uppercase">Size {profile.base_size}</span>}
                  <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase">{profile.version_no}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => onRecordFitting(profile)}
                className="h-9 px-4 bg-slate-900 text-white rounded-lg text-[11px] font-black hover:bg-indigo-600 transition-all flex items-center gap-2"
              >
                <History size={14} /> Record Fitting
              </button>
            </div>
          </div>
          <div className="p-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {(Object.entries(profile) as [string, unknown][])
              .filter((entry): entry is [string, number] => typeof entry[1] === 'number' && entry[1] > 0)
              .map(([key, val]) => (
                <div key={key} className="space-y-1">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{key.replace(/_/g, ' ')}</div>
                  <div className="text-[16px] font-black text-slate-900">{val} <span className="text-[10px] text-slate-400">{unit === 'Inches' ? 'in' : 'cm'}</span></div>
                </div>
              ))}
          </div>
          {profile.special_instructions && (
            <div className="px-8 pb-8">
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3">
                <Info size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] font-black text-amber-700 uppercase tracking-widest mb-1">Special Instructions</div>
                  <p className="text-[13px] text-amber-800 font-medium">{profile.special_instructions}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
      {filteredProfiles.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-[32px] py-20 text-center text-slate-400 font-bold text-[14px]">
          No measurement profiles found for this customer.
        </div>
      )}
    </div>
  );
};
