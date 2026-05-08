import React from 'react';
import { Users } from 'lucide-react';
import { BulkSizingStrategy } from '@/types/erp';
import { OrderFormData } from '@/types/orderFormData';

interface BulkStep1Props {
  formData: OrderFormData;
  setFormData: React.Dispatch<React.SetStateAction<OrderFormData>>;
}

export const BulkStep1: React.FC<BulkStep1Props> = ({
  formData,
  setFormData
}) => {
  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 pb-12">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Users size={14}/> Organization Details
        </h3>
      </div>

      <div className="space-y-6">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Organization / Group Name</label>
          <input 
            placeholder="e.g. UE Basketball Team, PNP Region 12" 
            value={formData.organizationName}
            onChange={e => setFormData({...formData, organizationName: e.target.value})}
            className="w-full h-14 px-5 rounded-2xl border border-slate-200 text-[16px] font-bold outline-none focus:border-indigo-500 bg-white shadow-sm"
          />
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Sizing Strategy</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'STANDARD', label: 'Standard', desc: 'S, M, L, XL Matrix' },
              { id: 'CUSTOM', label: 'Custom', desc: 'Individual Metrics' },
              { id: 'HYBRID', label: 'Hybrid', desc: 'Size + Adjustments' }
            ].map(strategy => (
              <button
                key={strategy.id}
                onClick={() => setFormData({...formData, bulkSizingStrategy: strategy.id as BulkSizingStrategy})}
                className={`p-4 rounded-2xl border text-left transition-all ${formData.bulkSizingStrategy === strategy.id ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-400'}`}
              >
                <h4 className="text-[13px] font-black">{strategy.label}</h4>
                <p className={`text-[10px] mt-1 ${formData.bulkSizingStrategy === strategy.id ? 'text-slate-300' : 'text-slate-400'}`}>{strategy.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
