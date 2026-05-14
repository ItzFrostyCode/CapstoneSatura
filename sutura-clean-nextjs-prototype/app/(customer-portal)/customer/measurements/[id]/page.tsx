'use client';

import Link from 'next/link';
import { ArrowLeft, Ruler } from 'lucide-react';

const PROFILE = {
  id: 'meas-001',
  profileName: 'Formal Suit Profile',
  garmentCategory: 'Upper Wear',
  garmentType: 'Business Suit',
  fitPreference: 'Slim',
  measurementUnit: 'Inches',
  versionNo: 'V2',
  status: 'CONFIRMED',
  recordedAt: '2026-05-11',
  recordedBy: 'Carlos Reyes',
  postureNotes: 'Slightly forward shoulder posture. Add 0.25" ease at back shoulder.',
  upperBody: [
    { label: 'Neck',          value: 15.5 },
    { label: 'Shoulder',      value: 17.0 },
    { label: 'Chest',         value: 40.0 },
    { label: 'Waist',         value: 33.5 },
    { label: 'Hip',           value: 39.0 },
    { label: 'Sleeve Length', value: 25.5 },
    { label: 'Jacket Length', value: 30.5 },
    { label: 'Armhole',       value: 18.0 },
    { label: 'Bicep',         value: 14.5 },
    { label: 'Cuff',          value: 10.5 },
  ],
};

export default function MeasurementDetailPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-slate-900 pt-28 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/customer/measurements" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-[13px] font-bold mb-6 transition-colors">
            <ArrowLeft size={16} /> Back to Measurements
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Ruler size={18} className="text-emerald-400" />
            <span className="text-emerald-400 text-[12px] font-black uppercase tracking-widest">{PROFILE.garmentCategory} · {PROFILE.versionNo}</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">{PROFILE.profileName}</h1>
          <p className="text-slate-400 font-medium mt-2">{PROFILE.garmentType} · {PROFILE.fitPreference} Fit · {PROFILE.measurementUnit}</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 -mt-4 pb-24 space-y-6">
        {/* Meta */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/30 p-5 flex flex-wrap gap-6">
          {[
            { label: 'Recorded By', val: PROFILE.recordedBy },
            { label: 'Date Taken', val: new Date(PROFILE.recordedAt).toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' }) },
            { label: 'Status', val: PROFILE.status },
            { label: 'Version', val: PROFILE.versionNo },
          ].map((item) => (
            <div key={item.label}>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{item.label}</div>
              <div className="text-[14px] font-black text-slate-900">{item.val}</div>
            </div>
          ))}
        </div>

        {/* Upper Body Measurements */}
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-xl shadow-slate-200/30">
          <h2 className="text-[16px] font-black text-slate-900 uppercase tracking-widest mb-6">Upper Body Measurements</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {PROFILE.upperBody.map((m) => (
              <div key={m.label} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{m.label}</div>
                <div className="text-[22px] font-black text-slate-900">{m.value}"</div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        {PROFILE.postureNotes && (
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
            <div className="text-[11px] font-black text-amber-600 uppercase tracking-widest mb-2">Tailor Notes</div>
            <p className="text-[14px] text-amber-800 font-medium">{PROFILE.postureNotes}</p>
          </div>
        )}
      </div>
    </main>
  );
}
