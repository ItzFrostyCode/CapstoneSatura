import React from 'react';
import { Layers, CheckCircle2, AlertTriangle } from 'lucide-react';
import { InventoryItem } from '@/types/erp';
import { OrderFormData } from '@/types/orderFormData';

interface ReadyMadeVariantStepProps {
  inventory: InventoryItem[];
  formData: OrderFormData;
  setFormData: React.Dispatch<React.SetStateAction<OrderFormData>>;
}

export const ReadyMadeVariantStep: React.FC<ReadyMadeVariantStepProps> = ({
  inventory,
  formData,
  setFormData
}) => {
  const selectedProduct = inventory.find(i => i.id === formData.garmentTemplateId);
  const variants = selectedProduct?.variants || [];

  if (!selectedProduct) return <div className="text-slate-400 italic">Please select a product first.</div>;

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 pb-12">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Layers size={14}/> Select Variant (Size/Color)
        </h3>
        <span className="text-[10px] font-bold text-slate-400 px-3 py-1 bg-slate-100 rounded-full uppercase">
          {selectedProduct.item_name}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {variants.length > 0 ? variants.map(variant => {
          const isSelected = formData.variantId === variant.id;
          const isOutOfStock = variant.stock <= 0;

          return (
            <button
              key={variant.id}
              disabled={isOutOfStock}
              onClick={() => setFormData({ ...formData, variantId: variant.id })}
              className={`p-6 bg-white border rounded-[32px] flex items-center justify-between transition-all group relative ${
                isSelected 
                  ? 'border-slate-900 shadow-2xl scale-[1.01] z-10' 
                  : isOutOfStock 
                    ? 'border-slate-100 opacity-50 grayscale cursor-not-allowed'
                    : 'border-slate-200 hover:border-slate-400'
              }`}
            >
              <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                  isSelected ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400'
                }`}>
                  <span className="text-[18px] font-black">{variant.size.charAt(0)}</span>
                </div>
                <div className="text-left">
                  <h4 className="text-[16px] font-black text-slate-900">{variant.size} — {variant.color}</h4>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{variant.sku}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className={`text-[12px] font-black ${isOutOfStock ? 'text-rose-500' : 'text-slate-600'}`}>
                    {isOutOfStock ? 'Out of Stock' : `${variant.stock} available`}
                  </p>
                  {variant.price_adjustment && (
                    <p className="text-[10px] text-emerald-600 font-bold">
                      +{variant.price_adjustment.toLocaleString()} adjustment
                    </p>
                  )}
                </div>
                {isSelected && <CheckCircle2 size={24} className="text-slate-900" />}
              </div>
            </button>
          );
        }) : (
          <div className="p-12 border-2 border-dashed border-slate-100 rounded-[40px] text-center space-y-3">
             <AlertTriangle size={32} className="mx-auto text-slate-200" />
             <p className="text-[13px] font-bold text-slate-400 italic">No variants found for this product category.</p>
          </div>
        )}
      </div>

      {formData.variantId && (
        <div className="p-6 bg-slate-900 rounded-[32px] text-white flex items-center justify-between animate-in zoom-in-95">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Layers size={20} />
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Selected SKU</p>
                <p className="text-[14px] font-black">{variants.find(v => v.id === formData.variantId)?.sku}</p>
             </div>
          </div>
          <div className="text-right">
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</p>
             <p className="text-[12px] font-black text-emerald-400 uppercase">Validated</p>
          </div>
        </div>
      )}
    </div>
  );
};
