import React from 'react';
import { Hash } from 'lucide-react';

import { OrderFormData } from '@/types/orderFormData';
import { GarmentTemplate } from '@/types/erp';

interface QuantityPricingStepProps {
  formData: OrderFormData;
  setFormData: React.Dispatch<React.SetStateAction<OrderFormData>>;
  selectedTemplate: GarmentTemplate | null;
  totalQuantity: number;
}

export const QuantityPricingStep: React.FC<QuantityPricingStepProps> = ({
  formData,
  setFormData,
  selectedTemplate,
  totalQuantity
}) => {
  const isBulkStandard = formData.orderType === 'BULK' && formData.bulkSizingStrategy === 'STANDARD';

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 pb-12 text-center py-20">
      <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-[32px] flex items-center justify-center mx-auto mb-6">
        <Hash size={40} />
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-black text-slate-900">Configure Production Volume</h3>
        <p className="text-slate-400 text-[14px]">
          {isBulkStandard 
            ? 'Quantity is automatically calculated from the Personnel Size Matrix.' 
            : 'How many units will be manufactured?'}
        </p>
      </div>
      
      <div className="max-w-[300px] mx-auto pt-8">
        <div className="flex items-center justify-center gap-8">
          <button 
            onClick={() => setFormData({...formData, quantity: Math.max(1, formData.quantity - 1)})}
            disabled={isBulkStandard}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black transition-colors ${isBulkStandard ? 'bg-slate-50 text-slate-300 cursor-not-allowed' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}
          >
            -
          </button>
          <span className="text-5xl font-black text-slate-900 w-24 tracking-tighter">{totalQuantity}</span>
          <button 
            onClick={() => setFormData({...formData, quantity: formData.quantity + 1})}
            disabled={isBulkStandard}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black transition-colors ${isBulkStandard ? 'bg-slate-50 text-slate-300 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-lg'}`}
          >
            +
          </button>
        </div>

        {isBulkStandard && (
          <div className="mt-4 text-[11px] font-bold text-indigo-500 uppercase tracking-widest bg-indigo-50 py-2 px-4 rounded-xl inline-block">
            Synced with Size Matrix
          </div>
        )}

        <div className="mt-8 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
          <span className="text-[12px] font-black text-emerald-600 uppercase tracking-widest">Total Estimated Price</span>
          <div className="text-2xl font-black text-emerald-700">₱{(totalQuantity * (selectedTemplate?.base_price || 0)).toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};
