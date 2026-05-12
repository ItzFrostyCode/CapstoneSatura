'use client';

import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle2, Ruler, Scissors, AlertCircle } from 'lucide-react';

interface LogDiscrepancyModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  onLog: (data: {
    type: 'MATERIAL_WASTE' | 'EXTRA_LABOR' | 'DEFECTIVE_MATERIAL' | 'UNPLANNED_ALTERATION';
    impact: number;
    description: string;
  }) => void;
}

export function LogDiscrepancyModal({ isOpen, onClose, orderId, onLog }: LogDiscrepancyModalProps) {
  const [type, setType] = useState<'MATERIAL_WASTE' | 'EXTRA_LABOR' | 'DEFECTIVE_MATERIAL' | 'UNPLANNED_ALTERATION'>('MATERIAL_WASTE');
  const [impact, setImpact] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    onLog({
      type,
      impact: parseFloat(impact) || 0,
      description
    });
    setImpact('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-[500px] rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-sm">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h2 className="text-[20px] font-black text-slate-900 tracking-tight">Log Production Issue</h2>
              <p className="text-[12px] text-slate-500 font-medium">Record discrepancies for Order <span className="text-slate-900 font-bold">{orderId}</span></p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          {/* Issue Type */}
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Issue Category</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'MATERIAL_WASTE', label: 'Material Waste', icon: <Ruler size={14}/> },
                { id: 'EXTRA_LABOR', label: 'Extra Labor', icon: <Scissors size={14}/> },
                { id: 'DEFECTIVE_MATERIAL', label: 'Defective Item', icon: <AlertCircle size={14}/> },
                { id: 'UNPLANNED_ALTERATION', label: 'Unplanned Rework', icon: <AlertTriangle size={14}/> },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setType(t.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-[12px] font-bold transition-all ${
                    type === t.id 
                      ? 'bg-rose-50 border-rose-200 text-rose-700 shadow-sm' 
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Financial Impact */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Estimated Cost Impact (₱)</label>
            <input 
              type="number"
              placeholder="0.00"
              value={impact}
              onChange={(e) => setImpact(e.target.value)}
              className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold outline-none focus:bg-white focus:border-rose-300 transition-all shadow-inner"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Description / Remarks</label>
            <textarea 
              placeholder="Explain the issue..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-medium outline-none focus:bg-white focus:border-rose-300 transition-all shadow-inner resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 h-12 rounded-xl border border-slate-300 bg-white text-slate-700 font-black text-[14px] hover:bg-slate-100 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="flex-[2] h-12 rounded-xl bg-rose-600 text-white font-black text-[14px] hover:bg-rose-700 shadow-lg shadow-rose-100 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={18} /> Log Discrepancy
          </button>
        </div>
      </div>
    </div>
  );
}
