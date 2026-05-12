'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, Scissors, Clock, AlertTriangle, ArrowRight, ShieldCheck, Package } from 'lucide-react';
import { OrderStatus } from '@/types/erp';

interface UpdateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  currentStatus: string;
  onUpdate: (newStatus: OrderStatus, notes: string) => void;
}

export function UpdateStatusModal({ isOpen, onClose, orderId, currentStatus, onUpdate }: UpdateStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(currentStatus as OrderStatus);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const statuses: { value: OrderStatus; label: string; icon: React.ReactNode; color: string }[] = [
    { value: 'IN_PRODUCTION', label: 'In Tailoring', icon: <Scissors size={18} />, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { value: 'READY_FOR_FITTING', label: 'Ready for Fitting', icon: <CheckCircle2 size={18} />, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { value: 'ALTERATIONS', label: 'Back for Alterations', icon: <AlertTriangle size={18} />, color: 'bg-rose-50 text-rose-700 border-rose-200' },
    { value: 'READY_FOR_RELEASE', label: 'Ready for Pickup', icon: <Package size={18} />, color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { value: 'ON_HOLD', label: 'On Hold', icon: <Clock size={18} />, color: 'bg-slate-50 text-slate-700 border-slate-200' },
  ];

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-[550px] rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="text-[20px] font-black text-slate-900 tracking-tight">Update Job Status</h2>
              <p className="text-[12px] text-slate-500 font-medium">Changing status for Order <span className="text-slate-900 font-bold">{orderId}</span></p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-8">
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">New Status</label>
            <div className="grid grid-cols-1 gap-3">
              {statuses.map((status) => (
                <button
                  key={status.value}
                  onClick={() => setSelectedStatus(status.value)}
                  className={`flex items-center justify-between px-6 py-4 rounded-2xl border transition-all ${
                    selectedStatus === status.value 
                      ? `${status.color} shadow-sm ring-2 ring-slate-900/5` 
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedStatus === status.value ? 'bg-white/50' : 'bg-slate-50'}`}>
                      {status.icon}
                    </div>
                    <span className="text-[14px] font-black">{status.label}</span>
                  </div>
                  {selectedStatus === status.value && <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white"><ArrowRight size={14} /></div>}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Status Remarks (Optional)</label>
            <textarea 
              placeholder="e.g., Sewing phase complete, moving to fitting."
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-medium outline-none focus:bg-white focus:border-indigo-300 transition-all shadow-inner resize-none"
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
            onClick={() => {
              onUpdate(selectedStatus, notes);
              onClose();
            }}
            className="flex-[2] h-12 rounded-xl bg-slate-900 text-white font-black text-[14px] hover:bg-black shadow-lg shadow-slate-200 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={18} /> Confirm Update
          </button>
        </div>
      </div>
    </div>
  );
}
