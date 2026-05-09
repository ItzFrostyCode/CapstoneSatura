'use client';

import React, { useState } from 'react';
import { Ruler, Plus, Search, ChevronRight, Edit2, History, Filter, User, Layers, Maximize2 } from 'lucide-react';

const mockProfiles = [
  { 
    id: 'MP-1024', 
    name: 'Alexander McQueen', 
    category: 'Full Suit', 
    lastFitting: 'Apr 20, 2026',
    measurements: {
      shoulder: '48cm',
      chest: '102cm',
      waist: '88cm',
      hips: '104cm',
      sleeve: '64cm',
      length: '76cm'
    }
  },
  { 
    id: 'MP-1025', 
    name: 'Ms. Beatrice Ramos', 
    category: 'Wedding Gown', 
    lastFitting: 'May 02, 2026',
    measurements: {
      bust: '92cm',
      waist: '72cm',
      hips: '98cm',
      shoulder: '42cm',
      hollowToFloor: '145cm'
    }
  },
  { 
    id: 'MP-1026', 
    name: 'Gov. Jose Rizal', 
    category: 'Barong Tagalog', 
    lastFitting: 'Yesterday',
    measurements: {
      shoulder: '50cm',
      chest: '110cm',
      waist: '102cm',
      neck: '42cm',
      sleeve: '62cm'
    }
  }
];

export default function StaffMeasurementsPage() {
  const [search, setSearch] = useState('');
  const [selectedProfile, setSelectedProfile] = useState(mockProfiles[0]);

  return (
    <div className="flex flex-col xl:flex-row gap-6 animate-in fade-in duration-500">
      
      {/* Left Column: Directory */}
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[24px] font-black text-slate-900 tracking-tight leading-none">Measurement Profiles</h1>
            <p className="text-[12px] text-slate-500 font-bold mt-1.5 uppercase tracking-widest leading-none">Global Client Specification Registry</p>
          </div>
          <button className="h-10 px-4 bg-slate-900 text-white rounded-xl flex items-center gap-2 text-[12px] font-black hover:bg-indigo-600 transition-all shadow-lg shadow-slate-900/10 active:scale-95 group">
            <Plus size={16} /> New Profile
          </button>
        </div>

        {/* Search */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search by name or profile ID..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 pl-12 pr-6 bg-white border border-slate-200 rounded-xl text-[14px] font-medium outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm"
          />
        </div>

        {/* Profile List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockProfiles.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).map((profile) => (
            <button 
              key={profile.id}
              onClick={() => setSelectedProfile(profile)}
              className={`p-5 rounded-[24px] border transition-all text-left group relative overflow-hidden ${
                selectedProfile.id === profile.id 
                ? 'bg-slate-900 border-slate-900 shadow-xl shadow-slate-900/10 text-white' 
                : 'bg-white border-slate-200 hover:border-slate-400 text-slate-900'
              }`}
            >
              <div className="flex items-center gap-4 relative z-10">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black transition-colors ${
                  selectedProfile.id === profile.id ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-900 group-hover:text-white'
                }`}>
                  {profile.name.charAt(0)}
                </div>
                <div>
                  <div className="text-[15px] font-black tracking-tight">{profile.name}</div>
                  <div className={`text-[11px] font-bold uppercase tracking-widest mt-0.5 ${
                    selectedProfile.id === profile.id ? 'text-white/60' : 'text-slate-400'
                  }`}>{profile.category}</div>
                </div>
              </div>
              
              <div className={`mt-4 flex items-center justify-between relative z-10 ${
                selectedProfile.id === profile.id ? 'text-white/40' : 'text-slate-300'
              }`}>
                <div className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                  <History size={12} /> Last Fitting: {profile.lastFitting}
                </div>
                <ChevronRight size={16} />
              </div>

              {/* Decorative Pattern */}
              {selectedProfile.id === profile.id && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Right Column: Spec Sheet Preview */}
      <div className="w-full xl:w-[450px] shrink-0">
        <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-xl sticky top-6">
          <div className="p-8 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-start justify-between mb-6">
              <div>
                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 uppercase tracking-widest">Active Profile</span>
                <h2 className="text-[22px] font-black text-slate-900 mt-2 tracking-tight leading-none">{selectedProfile.name}</h2>
                <div className="text-[11px] font-mono text-slate-400 mt-1 uppercase tracking-tighter">{selectedProfile.id}</div>
              </div>
              <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-900 border border-slate-200 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                <Edit2 size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white border border-slate-100 rounded-2xl">
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Measurements</div>
                 <div className="text-[16px] font-black text-slate-900">{Object.keys(selectedProfile.measurements).length} Points</div>
              </div>
              <div className="p-4 bg-white border border-slate-100 rounded-2xl">
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Build</div>
                 <div className="text-[16px] font-black text-slate-900">Standard</div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Ruler size={14} className="text-indigo-500" /> Key Specifications
            </h3>

            <div className="space-y-3">
              {Object.entries(selectedProfile.measurements).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-slate-900 hover:bg-white transition-all cursor-default">
                  <div className="text-[13px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-900">{key}</div>
                  <div className="flex items-center gap-3">
                    <div className="text-[18px] font-black text-slate-900 tracking-tight">{value}</div>
                    <div className="w-1 h-8 bg-slate-200 rounded-full group-hover:bg-slate-900 transition-colors"></div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-8 h-12 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center gap-2 text-[13px] font-black hover:bg-slate-900 hover:text-white transition-all shadow-sm group">
              <Maximize2 size={16} className="group-hover:scale-110 transition-transform" /> View Full Spec Sheet
            </button>
          </div>
          
          <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400">
             <div className="flex items-center gap-2">
                <Layers size={14} /> 4 Revisions
             </div>
             <span>Updated by Admin</span>
          </div>
        </div>
      </div>

    </div>
  );
}
