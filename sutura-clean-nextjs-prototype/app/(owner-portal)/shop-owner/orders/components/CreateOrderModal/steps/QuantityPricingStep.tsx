import React from 'react';
import { Hash, Zap } from 'lucide-react';

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
  const isBulkStandard = formData.orderType === 'BULK_ORDER' && formData.bulkSizingStrategy === 'STANDARD';

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 pb-12 text-center py-10">
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
      
      <div className="max-w-[400px] mx-auto pt-4">
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

        <div className="mt-8 p-6 bg-slate-900 rounded-[28px] text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
             <Zap size={60} />
          </div>
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-1">Total Estimated Price</span>
          <div className="text-3xl font-black text-white">₱{(totalQuantity * (selectedTemplate?.base_price || 0) + (formData.customizationFee || 0)).toLocaleString()}</div>
          <div className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-tighter">
             Includes base tailoring + customization fees
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest text-left">Additional Service Charges</div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₱</span>
              <input 
                type="number"
                placeholder="0"
                value={formData.customizationFee || ''}
                onChange={e => setFormData({...formData, customizationFee: Number(e.target.value)})}
                className="w-full h-14 pl-10 pr-5 rounded-2xl border border-slate-200 text-[16px] font-bold outline-none focus:border-indigo-500 bg-white shadow-sm"
              />
            </div>
            <p className="text-[11px] text-slate-400 font-medium text-left italic">
              * Add tubo/markup for S, M, L, XL customization or specialized artisanal requests.
            </p>
          </div>

          {(formData.orderType === 'CUSTOM_TAILORING') && (
            <div className="space-y-4">
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest text-left">Production Size Tier</div>
              <div className="grid grid-cols-5 gap-2">
                {['S', 'M', 'L', 'XL', 'Custom'].map(size => {
                  const markup = selectedTemplate?.size_additional_charges?.[size] || 0;
                  return (
                    <button
                      key={size}
                      onClick={() => {
                        setFormData({
                          ...formData, 
                          baseSize: size,
                          customizationFee: markup || formData.customizationFee
                        });
                      }}
                      className={`py-3 rounded-xl border text-[12px] font-black transition-all ${
                        formData.baseSize === size 
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' 
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <div>{size}</div>
                      {markup > 0 && <div className="text-[9px] opacity-60">+{markup}</div>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
