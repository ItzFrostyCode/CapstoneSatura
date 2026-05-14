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
  'Upper Wear': 'bg-[#1E3A1F]/5 text-[#1E3A1F]',
  'Lower Wear': 'bg-emerald-50 text-emerald-600',
  'Full Body':  'bg-violet-50 text-violet-600',
};

export default function MeasurementsPage() {
  const [showArchived, setShowArchived] = useState(false);

  const profiles = MOCK_PROFILES.filter((p) => showArchived || p.status !== 'ARCHIVED');

  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      {/* Header */}
      <section className="bg-[#1E3A1F] pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-[#C9A84C] via-transparent to-transparent" />
        <div className="max-w-5xl mx-auto relative z-10 text-center">
           <Link href="/customer/dashboard" className="inline-flex items-center gap-2 text-[#C9A84C] text-[12px] font-bold uppercase tracking-widest mb-6 hover:opacity-80 transition-opacity">
              <ChevronLeft size={16} /> Back to Dashboard
           </Link>
           <h1 className="text-5xl font-bold font-serif text-[#FAF8F5] tracking-tight mb-4">Sizing Archives</h1>
           <p className="text-[#FAF8F5]/60 font-medium max-w-xl mx-auto">Your precision metrics, curated and maintained by your master tailors.</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 -mt-10 pb-24 relative z-10">
        {/* Info Banner */}
        <div className="bg-white rounded-[40px] border border-[#E2DDD7] shadow-xl p-8 mb-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-[#F0EDE8] rounded-[24px] flex items-center justify-center shrink-0">
              <User size={28} className="text-[#1E3A1F]" />
            </div>
            <div>
              <div className="text-[20px] font-bold font-serif text-[#1C1917]">Juan dela Cruz</div>
              <div className="text-[13px] text-[#78716C] font-bold uppercase tracking-widest mt-1">
                {MOCK_PROFILES.filter(p => p.isCurrent).length} Active Profiles · {MOCK_PROFILES.filter(p => !p.isCurrent).length} Archived
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowArchived(!showArchived)}
            className="h-12 px-8 bg-[#FAF8F5] border border-[#E2DDD7] rounded-xl text-[13px] font-bold text-[#78716C] hover:border-[#1E3A1F] hover:text-[#1E3A1F] transition-all flex items-center gap-2"
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
              className={`bg-white rounded-[40px] border hover:shadow-2xl hover:shadow-[#1E3A1F]/5 transition-all duration-500 p-8 group relative overflow-hidden ${
                profile.status === 'ARCHIVED' ? 'border-[#E2DDD7] opacity-60 grayscale' : 'border-[#E2DDD7]'
              }`}
            >
              {profile.isCurrent && (
                <div className="absolute top-0 right-0 p-1">
                   <div className="bg-[#1E3A1F] text-[#C9A84C] text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-2xl">Current</div>
                </div>
              )}
              
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-4">
                    <span className={`inline-block px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-current/10 ${CATEGORY_COLOR[profile.garmentCategory] ?? 'bg-slate-100 text-slate-600'}`}>
                      {profile.garmentCategory}
                    </span>
                    <div>
                      <h3 className="text-[20px] font-bold font-serif text-[#1C1917] group-hover:text-[#1E3A1F] transition-colors">{profile.profileName}</h3>
                      <p className="text-[14px] text-[#78716C] font-bold mt-1 uppercase tracking-wider">{profile.garmentType} · {profile.fitPreference} Fit</p>
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-[#FAF8F5] rounded-xl flex items-center justify-center text-[#C9A84C] font-black text-[12px] border border-[#E2DDD7]">
                    {profile.versionNo}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-6 border-t border-[#F0EDE8]">
                  <div className="flex items-center gap-2 text-[12px] text-[#78716C] font-bold uppercase tracking-widest">
                    <History size={14} className="text-[#C9A84C]" />
                    <span>Updated {new Date(profile.recordedAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#78716C] group-hover:bg-[#1E3A1F] group-hover:text-[#C9A84C] transition-all">
                    <ChevronRight size={18} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Note */}
        <div className="mt-12 p-8 bg-[#1E3A1F] rounded-[40px] text-[14px] text-[#FAF8F5]/60 font-medium relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A84C]/10 rounded-full -mr-16 -mt-16 blur-3xl" />
           <div className="relative z-10 flex items-start gap-4">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                 <Ruler size={18} className="text-[#C9A84C]" />
              </div>
              <p>
                <span className="font-bold text-[#FAF8F5] block mb-1 uppercase tracking-widest text-[11px]">Precision Guarantee</span>
                Your measurement profiles are curated by master Staffs during fitting sessions. These records ensure a consistent, perfect fit for every bespoke commission across the SUTURA network.
              </p>
           </div>
        </div>
      </div>
    </main>
  );
}
