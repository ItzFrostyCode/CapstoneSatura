"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Ruler, ChevronRight, Plus, User, Archive, CheckCircle2, History, ChevronLeft } from 'lucide-react';

interface MeasurementProfile {
  id: string;
  profileName: string;
  garmentCategory: string;
  garmentType: string;
  fitPreference: string;
  versionNo: string;
  status: string;
  recordedAt: string;
  isCurrent: boolean;
}

const MOCK_PROFILES: MeasurementProfile[] = [
  {
    id: 'meas-001',
    profileName: 'Formal Suit Profile',
    garmentCategory: 'Upper Wear',
    garmentType: 'Business Suit',
    fitPreference: 'Slim',
    versionNo: 'V2',
    status: 'CONFIRMED',
    recordedAt: '2026-05-11',
    isCurrent: true,
  },
  {
    id: 'meas-002',
    profileName: 'Casual Trousers',
    garmentCategory: 'Lower Wear',
    garmentType: 'Chino Pants',
    fitPreference: 'Regular',
    versionNo: 'V1',
    status: 'CONFIRMED',
    recordedAt: '2026-04-20',
    isCurrent: true,
  },
  {
    id: 'meas-003',
    profileName: 'Barong Tagalog',
    garmentCategory: 'Upper Wear',
    garmentType: 'Barong',
    fitPreference: 'Regular',
    versionNo: 'V1',
    status: 'ARCHIVED',
    recordedAt: '2025-12-10',
    isCurrent: false,
  },
];

const CATEGORY_COLOR: Record<string, string> = {
  'Upper Wear': 'bg-slate-50 text-slate-900',
  'Lower Wear': 'bg-blue-50 text-blue-600',
  'Full Body':  'bg-violet-50 text-violet-600',
};

export default function MeasurementsPage() {
  const [showArchived, setShowArchived] = useState(false);

  const profiles = MOCK_PROFILES.filter((p) => showArchived || p.status !== 'ARCHIVED');

  return (
    <main className="min-h-screen bg-[#FAF8F5] font-poppins">
      {/* Header */}
      <section className="bg-slate-900 pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent" />
        <div className="max-w-5xl mx-auto relative z-10 text-center">
           <Link href="/customer/dashboard" className="inline-flex items-center gap-2 text-blue-400 text-[12px] font-bold uppercase tracking-widest mb-6 hover:opacity-80 transition-opacity">
              <ChevronLeft size={16} /> Back to Dashboard
           </Link>
           <h1 className="text-5xl font-bold text-[#FAF8F5] tracking-tight mb-4">Sizing Archives</h1>
           <p className="text-[#FAF8F5]/60 font-medium max-w-xl mx-auto">Your precision metrics, curated and maintained by your master tailors.</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 -mt-10 pb-24 relative z-10">
        {/* Info Banner */}
        <div className="bg-white rounded-[40px] border border-slate-200 shadow-xl p-8 mb-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-slate-50 rounded-[24px] flex items-center justify-center shrink-0">
              <User size={28} className="text-slate-900" />
            </div>
            <div>
              <div className="text-[20px] font-bold text-slate-900">Juan dela Cruz</div>
              <div className="text-[13px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                {MOCK_PROFILES.filter(p => p.isCurrent).length} Active Profiles · {MOCK_PROFILES.filter(p => !p.isCurrent).length} Archived
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowArchived(!showArchived)}
            className="h-12 px-8 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-bold text-slate-600 hover:border-slate-900 hover:text-slate-900 transition-all flex items-center gap-2 shadow-sm"
          >
            {showArchived ? <CheckCircle2 size={18} /> : <Archive size={18} />}
            {showArchived ? 'Hide Archived' : 'Show Archived'}
          </button>
        </div>

        {/* Profile Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profiles.map((profile) => (
            <Link
              key={profile.id}
              href={`/customer/measurements/${profile.id}`}
              className={`bg-white rounded-[40px] border hover:shadow-2xl hover:shadow-slate-900/5 transition-all duration-500 p-8 group relative overflow-hidden ${
                profile.status === 'ARCHIVED' ? 'border-slate-200 opacity-60 grayscale' : 'border-slate-200'
              }`}
            >
              {profile.isCurrent && (
                <div className="absolute top-0 right-0 p-1">
                   <div className="bg-slate-900 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-2xl">Current</div>
                </div>
              )}
              
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-4">
                    <span className={`inline-block px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-current/10 ${CATEGORY_COLOR[profile.garmentCategory] ?? 'bg-slate-100 text-slate-600'}`}>
                      {profile.garmentCategory}
                    </span>
                    <div>
                      <h3 className="text-[20px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{profile.profileName}</h3>
                      <p className="text-[14px] text-slate-500 font-bold mt-1 uppercase tracking-wider">{profile.garmentType} · {profile.fitPreference} Fit</p>
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-900 font-black text-[12px] border border-slate-200">
                    {profile.versionNo}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-[12px] text-slate-500 font-bold uppercase tracking-widest">
                    <History size={14} className="text-slate-400" />
                    <span>Updated {new Date(profile.recordedAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                    <ChevronRight size={18} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Note */}
        <div className="mt-12 p-8 bg-slate-900 rounded-[40px] text-[14px] text-white/60 font-medium relative overflow-hidden shadow-2xl shadow-slate-900/20">
           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
           <div className="relative z-10 flex items-start gap-4">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                <Ruler size={18} className="text-blue-400" />
              </div>
              <p>
                <span className="font-bold text-white block mb-1 uppercase tracking-widest text-[11px]">Precision Guarantee</span>
                Your measurement profiles are curated by master artisans during fitting sessions. These records ensure a consistent, perfect fit for every bespoke commission across the SUTURA network.
              </p>
           </div>
        </div>
      </div>
    </main>
  );
}
