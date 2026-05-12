'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Download,
  Scissors,
  Palette,
  Ruler,
  Clock,
  CheckCircle2,
  Calculator,
  ArrowUpRight,
  User,
  Phone,
  Mail,
  UserCircle,
  Plus,
  Upload,
  ShieldCheck,
  Box,
  Activity,
  MessageSquare,
  XCircle,
  Calendar,
  Package,
  ExternalLink,
  ChevronRight,
  History,
} from 'lucide-react';

type Status =
  | 'Awaiting Shop Approval'
  | 'Converted to Job Order'
  | 'Rejected'
  | 'Revision Requested';

type Measurement = {
  label: string;
  value: string;
  icon: string;
};

type MockBlueprint = {
  id: string;
  designerName: string;
  customer: {
    name: string;
    phone: string;
    gender: string;
    email: string;
  };
  bodyProfile: {
    posture: string;
    figuration: string;
    stylePreferences: string;
    measurementsProfile: string;
    measurements: Measurement[];
  };
  garmentType: string;
  targetDate: string;
  status: Status;
  sketches: { url: string; version: string }[];
  fabricSpec: {
    name: string;
    rollWidth: string;
    isCMT: boolean;
    notes: string;
  };
  designAssets: {
    externalLinks: string[];
    notes: string;
  };
};

const mockBlueprint: MockBlueprint = {
  id: 'DS-2026-001',
  designerName: 'Elena Cruz',
  customer: {
    name: 'Maria Clara Santos',
    phone: '0917 123 4567',
    gender: 'Female',
    email: 'maria.clara@example.com',
  },
  bodyProfile: {
    posture: 'Slight Forward Lean',
    figuration: 'Average Build',
    stylePreferences: 'Traditional-Modern Fusion, Conservative Neckline',
    measurementsProfile: 'MEAS-003',
    measurements: [
      { label: 'Neck', value: '14.5"', icon: 'circle' },
      { label: 'Shoulder', value: '17.0"', icon: 'ruler' },
      { label: 'Chest', value: '38.0"', icon: 'activity' },
      { label: 'Waist', value: '32.0"', icon: 'ruler' },
      { label: 'Hips', value: '40.0"', icon: 'ruler' },
      { label: 'Sleeve', value: '24.0"', icon: 'scissors' },
      { label: 'Garment Length', value: '58.0"', icon: 'ruler' },
    ],
  },
  garmentType: 'Modern Filipiniana Gown',
  targetDate: 'June 15, 2026',
  status: 'Awaiting Shop Approval',
  sketches: [
    {
      url: '/mockups/emerald-filipiniana.png',
      version: 'v1.2',
    },
  ],
  fabricSpec: {
    name: 'Ivory Premium Silk & French Lace (SLK-902)',
    rollWidth: '54 Inches',
    isCMT: false,
    notes: 'Hand-stitched lace applique on bodice and sleeves',
  },
  designAssets: {
    externalLinks: ['https://canva.com/design/sutura-gown-v1-final'],
    notes: 'Requires reinforced boning for structured silhouette',
  },
};

function StatusPill({ status }: { status: Status }) {
  const variant =
    status === 'Converted to Job Order'
      ? {
          bg: 'bg-emerald-50 border-emerald-200 shadow-emerald-900/5',
          title: 'text-emerald-600',
          meta: 'text-emerald-400',
          label: 'Handed to Production',
        }
      : status === 'Rejected'
      ? {
          bg: 'bg-rose-50 border-rose-200 shadow-rose-900/5',
          title: 'text-rose-600',
          meta: 'text-rose-400',
          label: 'Current Status',
        }
      : {
          bg: 'bg-amber-50 border-amber-200 shadow-amber-900/5',
          title: 'text-amber-600',
          meta: 'text-amber-400',
          label: 'Current Status',
        };

  return (
    <div className={`px-8 py-6 rounded-[32px] text-center shadow-lg transition-all ${variant.bg}`}>
      <div className={`text-[18px] font-black uppercase leading-none ${variant.title}`}>
        {status === 'Awaiting Shop Approval' ? 'Awaiting Approval' : status}
      </div>
      <div className={`text-[10px] font-black uppercase tracking-widest mt-2 ${variant.meta}`}>
        {variant.label}
      </div>
    </div>
  );
}

export default function DesignProposalReview() {
  const [status, setStatus] = useState<Status>(mockBlueprint.status);
  const [costEstimate, setCostEstimate] = useState<string>('');
  const [productionDays, setProductionDays] = useState<string>('');
  const [assignedTailor, setAssignedTailor] = useState<string>('');
  const [isCMT, setIsCMT] = useState<boolean>(mockBlueprint.fabricSpec.isCMT);
  const [activeTab, setActiveTab] = useState<'blueprint' | 'job_order'>('blueprint');

  const isReadOnly = useMemo(
    () => status === 'Converted to Job Order' || status === 'Rejected',
    [status]
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] animate-in fade-in duration-500 pb-20 font-outfit">
      <nav className="sticky top-0 z-50 bg-transparent px-8 py-4 flex items-center justify-between">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-[12px] font-black text-slate-400 hover:text-slate-900 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Proposals
        </button>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 h-10 px-5 bg-white border border-slate-200 rounded-xl text-[11px] font-black text-slate-600 hover:border-indigo-600 hover:text-indigo-600 transition-all active:scale-95">
            <Download size={14} />
            Download Spec Package
          </button>
        </div>
      </nav>

      <main className="max-w-[1300px] mx-auto px-8 pt-4">
        <div className="bg-white border border-slate-200 rounded-[40px] p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-10 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[28px] flex items-center justify-center shadow-inner">
              <Scissors size={32} />
            </div>

            <div className="max-w-[1450px] mx-auto">
              {/* CONTEXT TABS FOR PROCESSED PROPOSALS */}
              {isReadOnly && status === 'Converted to Job Order' && (
                <div className="flex items-center gap-1 p-1 bg-slate-100/50 border border-slate-200/50 rounded-full w-fit mb-8">
                  <button 
                    onClick={() => setActiveTab('blueprint')}
                    className={`px-6 py-2.5 rounded-full text-[13px] font-black transition-all flex items-center gap-2 ${activeTab === 'blueprint' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <History size={16}/> View Blueprint in History
                  </button>
                  <button 
                    onClick={() => setActiveTab('job_order')}
                    className={`px-6 py-2.5 rounded-full text-[13px] font-black transition-all flex items-center gap-2 ${activeTab === 'job_order' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <Package size={16}/> View Job Order
                  </button>
                </div>
              )}

              <div className="flex items-center gap-4 mb-3">
                <span className="text-[10px] font-black tracking-widest uppercase text-indigo-500 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                  Intake Approval
                </span>
                <div className="flex items-center gap-2 text-[12px] font-bold text-slate-400 uppercase tracking-widest">
                  <Palette size={14} className="text-indigo-500" />
                  <span>Blueprint Detail</span>
                  <ChevronRight size={12} />
                  <span className="text-slate-900">{activeTab === 'blueprint' ? 'Design Specification' : 'Associated Production Order'}</span>
                </div>
              </div>
              <h1 className="text-[32px] font-black text-slate-900 tracking-tight leading-none mb-3">
                {activeTab === 'blueprint' ? mockBlueprint.garmentType : `Production: ${mockBlueprint.garmentType}`}
              </h1>
              <p className="text-[14px] font-bold text-slate-400 italic">
                &quot;Converting designer vision into production-ready specifications.&quot;
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Assigned Designer</div>
              <div className="text-[14px] font-black text-slate-900">{mockBlueprint.designerName}</div>
            </div>
            <div className="w-12 h-12 rounded-[18px] bg-white border border-slate-200 flex items-center justify-center text-slate-400">
              <UserCircle size={24} />
            </div>
            <StatusPill status={status} />
          </div>
        </div>

      {activeTab === 'blueprint' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <UserCircle size={14} className="text-indigo-400" />
                  Customer Information
                </h4>
                <div className="space-y-5">
                  <div>
                    <div className="text-[9px] font-black uppercase text-slate-300 tracking-wider mb-1">
                      Full Name
                    </div>
                    <div className="text-[15px] font-black text-slate-900">
                      {mockBlueprint.customer.name}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[9px] font-black uppercase text-slate-300 tracking-wider mb-1">
                        Phone Number
                      </div>
                      <div className="text-[13px] font-bold text-slate-700 flex items-center gap-2">
                        <Phone size={14} className="text-slate-400" />
                        {mockBlueprint.customer.phone}
                      </div>
                    </div>

                    <div>
                      <div className="text-[9px] font-black uppercase text-slate-300 tracking-wider mb-1">
                        Gender
                      </div>
                      <div className="text-[13px] font-bold text-slate-700">
                        {mockBlueprint.customer.gender}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-[9px] font-black uppercase text-slate-300 tracking-wider mb-1">
                      Email Address
                    </div>
                    <div className="text-[13px] font-bold text-slate-700 flex items-center gap-2">
                      <Mail size={14} className="text-slate-400" />
                      {mockBlueprint.customer.email}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Activity size={14} className="text-rose-400" />
                  Body & Figuration
                </h4>
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[9px] font-black uppercase text-slate-300 tracking-wider mb-1">
                        Posture
                      </div>
                      <div className="text-[13px] font-bold text-slate-700">
                        {mockBlueprint.bodyProfile.posture}
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] font-black uppercase text-slate-300 tracking-wider mb-1">
                        Figuration
                      </div>
                      <div className="text-[13px] font-bold text-slate-700">
                        {mockBlueprint.bodyProfile.figuration}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-[9px] font-black uppercase text-slate-300 tracking-wider mb-1">
                      Style Preferences
                    </div>
                    <div className="text-[13px] font-bold text-slate-700 leading-relaxed">
                      {mockBlueprint.bodyProfile.stylePreferences}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Ruler size={14} className="text-emerald-400" />
                  Snapshot Measurements
                </h4>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                  Standardized: Inches
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mockBlueprint.bodyProfile.measurements.map((m, i) => (
                  <div
                    key={i}
                    className="p-4 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-emerald-200 transition-all"
                  >
                    <div className="text-[9px] font-black uppercase text-slate-400 mb-1 group-hover:text-emerald-500 transition-colors">
                      {m.label}
                    </div>
                    <div className="text-[18px] font-black text-slate-900">{m.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                <Palette size={14} className="text-indigo-400" />
                Design & Fabric Specification
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-[11px] font-black text-slate-900 uppercase tracking-tight">
                        Fabric Detail
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase">
                          CMT Mode
                        </span>
                        <button
                          onClick={() => setIsCMT((prev) => !prev)}
                          className={`w-10 h-5 rounded-full relative transition-all ${
                            isCMT ? 'bg-emerald-500' : 'bg-slate-200'
                          }`}
                          type="button"
                        >
                          <div
                            className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${
                              isCMT ? 'right-1' : 'left-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                        <div className="text-[9px] font-black uppercase text-slate-400 mb-1">
                          Fabric Name / Code
                        </div>
                        <div className="text-[14px] font-black text-slate-900">
                          {mockBlueprint.fabricSpec.name}
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                        <div className="text-[9px] font-black uppercase text-slate-400 mb-1">
                          Roll Width (Inches)
                        </div>
                        <div className="text-[14px] font-black text-slate-900">
                          {mockBlueprint.fabricSpec.rollWidth}
                        </div>
                      </div>
                    </div>

                    {isCMT && (
                      <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl animate-in slide-in-from-top-2 duration-300">
                        <ShieldCheck className="text-emerald-500 shrink-0" size={18} />
                        <p className="text-[11px] font-bold text-emerald-800 leading-tight">
                          <span className="block font-black uppercase mb-1">
                            Customer-Provided Material
                          </span>
                          System will bypass fabric inventory deduction and only charge for labor/trim.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="text-[11px] font-black text-slate-900 uppercase tracking-tight">
                      Fabric Swatches
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-1 hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer group">
                        <Plus className="text-slate-400 group-hover:text-indigo-600" size={16} />
                        <span className="text-[9px] font-black text-slate-400 group-hover:text-indigo-600 uppercase">
                          Upload Swatch
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="text-[11px] font-black text-slate-900 uppercase tracking-tight">
                      Design Preview & Assets
                    </div>

                    <div className="aspect-video bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden relative group">
                      <img
                        src={mockBlueprint.sketches[0].url}
                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                        alt="Mockup"
                      />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button className="px-5 py-2.5 bg-white rounded-xl text-[12px] font-black flex items-center gap-2 shadow-xl active:scale-95 transition-all">
                          <Upload size={14} />
                          Update Preview
                        </button>
                      </div>
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[9px] font-black border border-white shadow-sm uppercase tracking-widest">
                          Final Mockup
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="text-[9px] font-black uppercase text-slate-400 mb-2 px-1">
                          Design & Production Notes
                        </div>
                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold text-slate-600 leading-relaxed italic">
                          &quot;{mockBlueprint.fabricSpec.notes}. {mockBlueprint.designAssets.notes}.&quot;
                        </div>
                      </div>

                      <div>
                        <div className="text-[9px] font-black uppercase text-slate-400 mb-2 px-1">
                          External Links (Drive/Canva/Figma)
                        </div>
                        <div className="space-y-2">
                          {mockBlueprint.designAssets.externalLinks.map((link, i) => (
                            <a
                              key={i}
                              href={link}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center justify-between p-3.5 bg-white border border-slate-100 hover:border-indigo-200 rounded-xl transition-all group shadow-sm"
                            >
                              <div className="flex items-center gap-3">
                                <ExternalLink size={14} className="text-indigo-500" />
                                <span className="text-[12px] font-bold text-slate-600 truncate max-w-[200px]">
                                  {link}
                                </span>
                              </div>
                              <ArrowUpRight size={14} className="text-slate-400 group-hover:text-indigo-600" />
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white border border-slate-200 rounded-[40px] p-8 shadow-xl shadow-slate-200/20 relative overflow-hidden">
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-indigo-50 rounded-full opacity-50 blur-3xl" />

                <div className="relative">
                  <div className="flex items-center gap-2 mb-6">
                    <Calculator size={20} className="text-indigo-500" />
                    <h3 className="text-[20px] font-black text-slate-900 tracking-tight">
                      Final Decision
                    </h3>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block px-1">
                        Final Price Quote
                      </label>
                      <div className="relative group">
                        <span
                          className={`absolute left-5 top-1/2 -translate-y-1/2 font-black text-[16px] transition-colors ${
                            isReadOnly
                              ? 'text-slate-400'
                              : 'text-slate-400 group-focus-within:text-indigo-600'
                          }`}
                        >
                          ₱
                        </span>
                        <input
                          type="number"
                          value={costEstimate}
                          disabled={isReadOnly}
                          onChange={(e) => setCostEstimate(e.target.value)}
                          placeholder={isReadOnly ? '18,500' : 'Set amount...'}
                          className={`w-full h-14 border rounded-[20px] pl-10 pr-4 text-[18px] font-black placeholder:text-slate-300 outline-none transition-all shadow-sm ${
                            isReadOnly
                              ? 'bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed'
                              : 'bg-slate-50 border-slate-200 focus:border-indigo-600 focus:bg-white'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block px-1">
                          Lead Time
                        </label>
                        <div className="relative group">
                          <Clock
                            size={14}
                            className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                              isReadOnly
                                ? 'text-slate-300'
                                : 'text-slate-400 group-focus-within:text-indigo-600'
                            }`}
                          />
                          <input
                            type="number"
                            value={productionDays}
                            disabled={isReadOnly}
                            onChange={(e) => setProductionDays(e.target.value)}
                            placeholder={isReadOnly ? '14 Days' : 'Days'}
                            className={`w-full h-12 border rounded-[18px] pl-10 pr-4 text-[15px] font-black outline-none transition-all shadow-sm ${
                              isReadOnly
                                ? 'bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-slate-50 border-slate-200 focus:border-indigo-600 focus:bg-white'
                            }`}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block px-1">
                          Primary Tailor
                        </label>
                        <div className="relative group">
                          <User
                            size={14}
                            className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                              isReadOnly
                                ? 'text-slate-300'
                                : 'text-slate-400 group-focus-within:text-indigo-600'
                            }`}
                          />
                          <select
                            value={assignedTailor}
                            disabled={isReadOnly}
                            onChange={(e) => setAssignedTailor(e.target.value)}
                            className={`w-full h-12 border rounded-[18px] pl-10 pr-4 text-[12px] font-bold outline-none appearance-none transition-all ${
                              isReadOnly
                                ? 'bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-slate-50 border-slate-200 text-slate-900 cursor-pointer'
                            }`}
                          >
                            <option value="">{isReadOnly ? 'Juan (Bespoke)' : 'Assign...'}</option>
                            <option value="T1">Juan (Bespoke)</option>
                            <option value="T2">Rosa (Gown)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 space-y-3">
                      {status === 'Awaiting Shop Approval' ? (
                        <>
                          <button
                            onClick={() => setStatus('Converted to Job Order')}
                            className="w-full h-14 bg-slate-900 text-white rounded-[20px] text-[13px] font-black hover:bg-emerald-600 transition-all shadow-lg shadow-slate-900/10 active:scale-[0.98] flex items-center justify-center gap-3"
                            type="button"
                          >
                            <CheckCircle2 size={20} />
                            Approve & Issue Invoice
                          </button>

                          <div className="grid grid-cols-2 gap-3">
                            <button
                              onClick={() => setStatus('Revision Requested')}
                              className="h-12 bg-white border border-slate-200 text-slate-600 rounded-[18px] text-[11px] font-black hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all flex items-center justify-center gap-2"
                              type="button"
                            >
                              <MessageSquare size={16} />
                              Revision
                            </button>

                            <button
                              className="h-12 bg-white border border-slate-200 text-slate-600 rounded-[18px] text-[11px] font-black hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                              type="button"
                            >
                              <Calendar size={16} />
                              Consultation
                            </button>
                          </div>

                          <button
                            onClick={() => setStatus('Rejected')}
                            className="w-full h-12 bg-white border border-rose-100 text-rose-500 rounded-[18px] text-[12px] font-black hover:bg-rose-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                            type="button"
                          >
                            <XCircle size={18} />
                            Reject Proposal
                          </button>
                        </>
                      ) : status === 'Converted to Job Order' ? (
                        <div className="space-y-4">
                          <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-[28px] text-center">
                            <CheckCircle2 size={32} className="text-emerald-600 mx-auto mb-3" />
                            <div className="text-[14px] font-black text-emerald-900 mb-1">
                              Invoice Issued Successfully
                            </div>
                            <div className="text-[11px] font-bold text-emerald-600">
                              Awaiting downpayment to start production.
                            </div>
                          </div>

                          <Link
                            href="/owner/billing"
                            className="w-full h-14 bg-slate-900 text-white rounded-[20px] text-[13px] font-black hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-[0.98] flex items-center justify-center gap-3"
                          >
                            <Package size={18} />
                            Go to Billing & Payments
                          </Link>
                        </div>
                      ) : (
                        <div className="p-6 bg-slate-100 border border-slate-200 rounded-[28px] text-center">
                          <div className="text-[14px] font-black text-slate-400">
                            This proposal has been {status.toLowerCase()}.
                          </div>
                          <div className="text-[10px] font-bold text-slate-400 mt-1">
                            See history for details.
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-[32px] p-6 text-white overflow-hidden relative mt-6">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Box size={80} />
                  </div>

                  <div className="relative">
                    <div className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-4 flex items-center gap-2">
                      <ShieldCheck size={14} />
                      Production Safety
                    </div>
                    <p className="text-[12px] font-bold text-slate-300 leading-relaxed">
                      Approved blueprints are instantly converted into internal job orders and queued for the cutting floor.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <main className="max-w-[1450px] mx-auto px-10 pb-32">
          <div className="bg-white border border-slate-200 rounded-[40px] p-12 text-center">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-[30px] flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Package size={40} />
            </div>
            <h2 className="text-[24px] font-black text-slate-900 mb-2">Production Order Linked</h2>
            <p className="text-[14px] font-medium text-slate-500 max-w-[400px] mx-auto mb-8">
              This blueprint has been successfully converted into a production-ready job order. Once the downpayment is confirmed, tracking will begin here.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link 
                href="/owner/orders?search=ORD-2026-001"
                className="h-14 px-8 bg-slate-900 text-white rounded-2xl text-[14px] font-black hover:bg-slate-800 transition-all flex items-center gap-3 shadow-lg shadow-slate-900/10"
              >
                Track Production <ArrowUpRight size={18}/>
              </Link>
              <Link 
                href="/owner/billing"
                className="h-14 px-8 bg-white border border-slate-200 text-slate-900 rounded-2xl text-[14px] font-black hover:bg-slate-50 transition-all flex items-center gap-3"
              >
                Check Billing <Activity size={18}/>
              </Link>
            </div>
          </div>
        </main>
      )}
      </main>
    </div>
  );
}