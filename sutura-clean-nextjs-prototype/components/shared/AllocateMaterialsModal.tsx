'use client';

import React from 'react';
import { Scissors, AlertTriangle, ArrowRight, X, CheckCircle2 } from 'lucide-react';

interface AllocateMaterialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    id: string;
    garment: string;
    customer: string;
    due: string;
  } | null;
}

export function AllocateMaterialsModal({ isOpen, onClose, order }: AllocateMaterialsModalProps) {
  const [showWarning, setShowWarning] = React.useState(true);

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-[850px] max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        
        {/* Modal Header */}
        <div className="px-8 py-6 border-b border-slate-200 bg-slate-50 flex items-start justify-between shrink-0">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-100 text-purple-700 text-[10px] font-bold uppercase tracking-wider mb-3">
              <Scissors size={12}/> Seamstress / Tailor Action
            </span>
            <h2 className="text-[22px] font-bold text-slate-900 tracking-tight">Allocate Materials to Job Order</h2>
            <p className="text-[13px] text-slate-500 mt-1">Check material availability and reserve quantities for production.</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-sm">
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-8 overflow-y-auto flex-1">
          
          {/* Job Info Grid */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 grid grid-cols-4 gap-6 mb-8">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Order ID</div>
              <div className="font-mono font-bold text-slate-900">{order.id}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Item / Garment</div>
              <div className="font-bold text-slate-900">{order.garment}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Due Date</div>
              <div className="font-bold text-slate-900">{order.due}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Customer</div>
              <div className="font-bold text-slate-900">{order.customer}</div>
            </div>
          </div>

          {/* Allocation Table */}
          <h3 className="text-[12px] font-bold text-slate-900 uppercase tracking-wider mb-3">Required Materials</h3>
          <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3 text-[13px] font-medium text-slate-600">Material</th>
                  <th className="px-5 py-3 text-[13px] font-medium text-slate-600">Current Stock</th>
                  <th className="px-5 py-3 text-[13px] font-medium text-slate-600">Availability</th>
                  <th className="px-5 py-3 text-[13px] font-medium text-slate-600">Allocate</th>
                  <th className="px-5 py-3 text-[13px] font-medium text-slate-600">Unit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-900">Piña Fabric (Natural)</div>
                    <div className="text-[11px] font-mono text-slate-500 mt-0.5">SKU: FAB-PIA-002</div>
                  </td>
                  <td className="px-5 py-4 font-medium">22 meters</td>
                  <td className="px-5 py-4"><span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">Sufficient</span></td>
                  <td className="px-5 py-4"><input type="number" defaultValue={3} className="w-16 h-8 border border-slate-300 rounded-md text-center font-bold text-[13px] outline-none focus:border-indigo-500"/></td>
                  <td className="px-5 py-4 text-slate-500 font-medium">meters</td>
                </tr>
                <tr>
                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-900">White Embroidery Thread</div>
                    <div className="text-[11px] font-mono text-slate-500 mt-0.5">SKU: THR-WHT-008</div>
                  </td>
                  <td className="px-5 py-4 font-medium">4 spools</td>
                  <td className="px-5 py-4"><span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">Sufficient</span></td>
                  <td className="px-5 py-4"><input type="number" defaultValue={2} className="w-16 h-8 border border-slate-300 rounded-md text-center font-bold text-[13px] outline-none focus:border-indigo-500"/></td>
                  <td className="px-5 py-4 text-slate-500 font-medium">spools</td>
                </tr>
                <tr>
                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-900">Barong Buttons (Small)</div>
                    <div className="text-[11px] font-mono text-slate-500 mt-0.5">SKU: ACC-BTN-031</div>
                  </td>
                  <td className="px-5 py-4 font-medium text-slate-900">15 sets</td>
                  <td className="px-5 py-4"><span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">Sufficient</span></td>
                  <td className="px-5 py-4"><input type="number" defaultValue={1} className="w-16 h-8 border border-slate-300 rounded-md text-center font-bold text-[13px] outline-none focus:border-indigo-500"/></td>
                  <td className="px-5 py-4 text-slate-500 font-medium">sets</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Success Message */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex items-start gap-4 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-lg shadow-emerald-200">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <h4 className="text-[13px] font-black text-emerald-900 mb-1 uppercase tracking-tight">All materials are sufficient</h4>
              <p className="text-[12px] text-emerald-700 font-medium leading-relaxed">Required resources for <span className="font-bold">{order.id}</span> have been successfully verified. You may now proceed with the allocation and initiate the production workflow.</p>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-8 py-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-6">
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Items to Allocate</div>
              <div className="font-bold text-slate-900 text-[14px]">2 / 3</div>
            </div>
            <div className="w-px h-8 bg-slate-300"></div>
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Next Stage After</div>
              <div className="font-bold text-slate-900 text-[14px] flex items-center gap-2">Cutting <ArrowRight size={14} className="text-slate-400"/> Sewing</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="h-10 px-5 rounded-lg border border-slate-300 text-slate-700 font-bold text-[13px] hover:bg-slate-100 transition-colors bg-white shadow-sm">Cancel</button>
            <button onClick={onClose} className="h-10 px-5 rounded-lg bg-indigo-600 text-white font-bold text-[13px] hover:bg-indigo-700 transition-all shadow-[0_4px_12px_rgba(79,70,229,0.2)] hover:-translate-y-0.5">Allocate & Start Production</button>
          </div>
        </div>
      </div>
    </div>
  );
}
