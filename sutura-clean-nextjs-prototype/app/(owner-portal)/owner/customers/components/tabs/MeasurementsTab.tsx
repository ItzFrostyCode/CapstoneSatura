'use client';

import React from 'react';
import { Ruler, History, Info, Edit2, Trash2 } from 'lucide-react';
import { MeasurementProfile } from '@/types/erp';

interface MeasurementsTabProps {
  profiles: MeasurementProfile[];
  customerId: string;
  onRecordFitting: (profile: MeasurementProfile) => void;
  onEditProfile: (profile: MeasurementProfile) => void;
  onDeleteProfile: (profileId: string) => void;
  unit: 'Inches' | 'Centimeters';
}

export const MeasurementsTab: React.FC<MeasurementsTabProps> = ({
  profiles,
  customerId,
  onRecordFitting,
  onEditProfile,
  onDeleteProfile,
  unit
}) => {
  const filteredProfiles = profiles
    .filter(m => m.customer_id === customerId)
    .sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime());


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
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${profile.is_current ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-200 text-slate-500'}`}>{profile.version_no}</span>
                  {!profile.is_current && <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[9px] font-black uppercase">Previous</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {profile.is_current && (
                <>
                  <button 
                    onClick={() => onEditProfile(profile)}
                    className="h-9 w-9 bg-white border border-slate-200 text-slate-600 rounded-lg flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm"
                    title="Edit Profile"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={() => onRecordFitting(profile)}
                    className="h-9 px-4 bg-slate-900 text-white rounded-lg text-[11px] font-black hover:bg-indigo-600 transition-all flex items-center gap-2 shadow-sm shadow-slate-900/10"
                  >
                    <History size={14} /> Record Fitting
                  </button>
                </>
              )}
              <button 
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this profile? This action cannot be undone.')) {
                    onDeleteProfile(profile.id);
                  }
                }}
                className="h-9 w-9 bg-white border border-slate-200 text-rose-500 rounded-lg flex items-center justify-center hover:bg-rose-50 hover:border-rose-100 transition-all shadow-sm"
                title="Delete Profile"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          <div className={`p-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 ${!profile.is_current ? 'opacity-50 grayscale' : ''}`}>
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
