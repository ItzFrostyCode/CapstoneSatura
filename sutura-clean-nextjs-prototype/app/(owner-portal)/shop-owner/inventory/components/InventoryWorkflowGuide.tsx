'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Plus,
  TrendingDown,
  Layers,
  Zap,
  Package,
  ArrowRightLeft,
  History,
  ShieldCheck,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

interface WorkflowStep {
  number: number;
  title: string;
  purpose: string;
  entry: string;
  outputs: string[];
  color: string;
  icon: React.ReactNode;
}

const STEPS: WorkflowStep[] = [
  {
    number: 1,
    title: 'Add New Item',
    purpose: 'Register a material or product in the system before any stock is recorded.',
    entry: '+ New Item button',
    outputs: ['Item appears in Raw Materials or Finished Goods', 'Starting stock is zero', 'Ready to receive stock'],
    color: 'indigo',
    icon: <Plus size={16} />,
  },
  {
    number: 2,
    title: 'Receive Stock',
    purpose: 'Record new materials arriving from a supplier or delivery.',
    entry: 'Stock Movement → Stock In',
    outputs: ['Stock count increases', 'Movement logged with date and reference', 'Appears in Audit Log'],
    color: 'emerald',
    icon: <TrendingDown size={16} className="rotate-180" />,
  },
  {
    number: 3,
    title: 'Set Up Recipe (BOM)',
    purpose: 'Define what materials are needed to produce one finished product.',
    entry: 'Production tab → Edit Recipe',
    outputs: ['Recipe saved for the product', 'Used during production to auto-deduct materials', 'No stock change yet'],
    color: 'violet',
    icon: <Layers size={16} />,
  },
  {
    number: 4,
    title: 'Run Production',
    purpose: 'Use materials to produce finished goods. System auto-deducts materials.',
    entry: 'Production tab → Confirm & Execute',
    outputs: ['Material stock decreases', 'Finished goods stock increases', 'Logged in Audit Log'],
    color: 'amber',
    icon: <Zap size={16} />,
  },
  {
    number: 5,
    title: 'Store Finished Goods',
    purpose: 'Completed garments held in the shop, ready for customer pickup.',
    entry: 'Finished Goods tab',
    outputs: ['Shows all ready-to-release items', 'Displays total stock value', 'Owner selects items for release'],
    color: 'teal',
    icon: <Package size={16} />,
  },
  {
    number: 6,
    title: 'Release to Customer',
    purpose: 'Hand over finished goods to a customer tied to a job order.',
    entry: 'Finished Goods → Add to Release → Batch Release',
    outputs: ['Finished goods stock decreases', 'Sale record created for the customer', 'Logged in Audit Log'],
    color: 'rose',
    icon: <ArrowRight size={16} />,
  },
  {
    number: 7,
    title: 'Transfer Between Branches',
    purpose: 'Move stock from one branch to another (e.g., Main → Katipunan).',
    entry: 'Internal Transfer button',
    outputs: ['Stock removed from source branch', 'Stock added to destination branch', 'Both movements logged'],
    color: 'sky',
    icon: <ArrowRightLeft size={16} />,
  },
  {
    number: 8,
    title: 'Adjust or Write Off',
    purpose: 'Fix stock count after damage, loss, or recount error.',
    entry: 'Stock Movement → Adjustment or Damage',
    outputs: ['Stock corrected to actual count', 'Reason recorded', 'Cannot be silently edited — always logged'],
    color: 'orange',
    icon: <ShieldCheck size={16} />,
  },
  {
    number: 9,
    title: 'Audit Log',
    purpose: 'Full history of every stock change — who, what, when, and why.',
    entry: 'Audit Log tab (read-only)',
    outputs: ['Every receive, issue, transfer, and adjustment visible', 'Date and staff reference per row', 'Cannot be deleted or edited'],
    color: 'slate',
    icon: <History size={16} />,
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string; badge: string; badgeText: string; dot: string }> = {
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-100', badge: 'bg-indigo-100', badgeText: 'text-indigo-700', dot: 'bg-indigo-500' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', badge: 'bg-emerald-100', badgeText: 'text-emerald-700', dot: 'bg-emerald-500' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-100', badge: 'bg-violet-100', badgeText: 'text-violet-700', dot: 'bg-violet-500' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100', badge: 'bg-amber-100', badgeText: 'text-amber-700', dot: 'bg-amber-500' },
  teal: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-100', badge: 'bg-teal-100', badgeText: 'text-teal-700', dot: 'bg-teal-500' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-100', badge: 'bg-rose-100', badgeText: 'text-rose-700', dot: 'bg-rose-500' },
  sky: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-100', badge: 'bg-sky-100', badgeText: 'text-sky-700', dot: 'bg-sky-500' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-100', badge: 'bg-orange-100', badgeText: 'text-orange-700', dot: 'bg-orange-500' },
  slate: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', badge: 'bg-slate-100', badgeText: 'text-slate-600', dot: 'bg-slate-500' },
};

export function InventoryWorkflowGuide() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mx-4 rounded-[28px] border border-slate-200 bg-white shadow-sm overflow-hidden transition-all">
      {/* Toggle Header */}
      <button
        onClick={() => setIsOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-2.5 hover:bg-slate-50/60 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
            <BookOpen size={14} />
          </div>
          <div className="text-left">
            <p className="text-[13px] font-black text-slate-900">Inventory Workflow Sequence</p>
            <p className="text-[10px] font-medium text-slate-400">Manufacturing-aware ERP flow · 9 stages from master record to audit ledger</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 hidden md:block">
            {isOpen ? 'Collapse' : 'Expand Guide'}
          </span>
          <div className={`w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center transition-transform ${isOpen ? 'rotate-180' : ''}`}>
            <ChevronDown size={12} className="text-slate-500" />
          </div>
        </div>
      </button>

      {/* Expandable Content */}
      {isOpen && (
        <div className="border-t border-slate-100 px-6 py-6 animate-in slide-in-from-top-2 duration-300">
          {/* Flow Arrow Bar */}
          <div className="mb-4 flex items-center gap-1 overflow-x-auto pb-2 scrollbar-hide">
            {STEPS.map((step, i) => {
              const c = colorMap[step.color];
              return (
                <React.Fragment key={step.number}>
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${c.badge} shrink-0`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${c.badgeText}`}>{step.title}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <ArrowRight size={12} className="text-slate-300 shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Step Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {STEPS.map((step) => {
              const c = colorMap[step.color];
              return (
                <div
                  key={step.number}
                  className={`p-5 rounded-2xl border ${c.border} ${c.bg} group hover:shadow-md transition-all`}
                >
                  {/* Step Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${c.badge} ${c.text} shrink-0`}>
                        {step.icon}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-[0.12em] ${c.text}`}>
                        Step {step.number}
                      </span>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${c.dot} opacity-60 group-hover:opacity-100 transition-opacity`} />
                  </div>

                  {/* Title */}
                  <h4 className="text-[13px] font-black text-slate-900 mb-1 leading-tight">{step.title}</h4>

                  {/* Purpose */}
                  <p className="text-[11px] font-medium text-slate-500 leading-relaxed mb-3">{step.purpose}</p>

                  {/* Entry Point */}
                  <div className="mb-3">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">UI Entry</span>
                    <span className={`text-[11px] font-bold ${c.text} bg-white/70 px-2 py-0.5 rounded-lg border ${c.border}`}>
                      {step.entry}
                    </span>
                  </div>

                  {/* Outputs */}
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-2">System Outputs</span>
                    <ul className="space-y-1">
                      {step.outputs.map((out, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <div className={`w-1 h-1 rounded-full ${c.dot} mt-1.5 shrink-0`} />
                          <span className="text-[10px] font-medium text-slate-600">{out}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Summary */}
          <div className="mt-6 p-4 bg-slate-900 rounded-2xl text-white">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-2">How Inventory Works</p>
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
              {['Add Item', 'Receive Stock', 'Set Recipe', 'Run Production', 'Store Goods', 'Release to Customer', 'Transfer', 'Audit Log'].map((label, i, arr) => (
                <React.Fragment key={label}>
                  <span className="text-white">{label}</span>
                  {i < arr.length - 1 && <ArrowRight size={10} className="text-slate-600" />}
                </React.Fragment>
              ))}
            </div>
            <p className="text-[10px] font-medium text-slate-500 mt-3">
              Every stock change is tracked and logged automatically. Nothing can be silently edited.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
