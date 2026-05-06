import React from 'react';
import { Shirt, AlertCircle, CheckCircle2, ShoppingBag } from 'lucide-react';
import { InventoryItem } from '@/types/erp';
import { OrderFormData } from '@/types/orderFormData';

interface ReadyMadeStep1Props {
  inventory: InventoryItem[];
  formData: OrderFormData;
  setFormData: (val: OrderFormData) => void;
  pushNotification: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const ReadyMadeStep1: React.FC<ReadyMadeStep1Props> = ({
  inventory,
  formData,
  setFormData,
  pushNotification
}) => {
  const finishedGoods = inventory.filter(i => 
    i.category === 'Finished Goods' || 
    i.category === 'Suits' || 
    i.category === 'Ready-made'
  );

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 pb-12">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <ShoppingBag size={14}/> Instant Inventory Checkout
        </h3>
        <span className="text-[10px] font-bold text-slate-400 px-3 py-1 bg-slate-100 rounded-full uppercase">
          {finishedGoods.length} Items Available
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {finishedGoods.map(item => {
          const isSelected = formData.garmentTemplateId === item.id;
          const currentStock = item.stock || 0;
          const isOutOfStock = currentStock <= 0;
          const isLowStock = currentStock > 0 && currentStock <= 5;

          return (
            <button
              key={item.id}
              disabled={isOutOfStock}
              onClick={() => {
                setFormData({ 
                  ...formData, 
                  garmentTemplateId: item.id, 
                  quantity: 1
                });
                pushNotification(`${item.item_name} reserved for checkout.`, 'success');
              }}
              className={`p-6 bg-white border rounded-[32px] flex items-center justify-between transition-all group relative ${
                isSelected 
                  ? 'border-slate-900 shadow-2xl scale-[1.01] z-10' 
                  : isOutOfStock 
                    ? 'border-slate-100 opacity-50 grayscale cursor-not-allowed'
                    : 'border-slate-200 hover:border-slate-400'
              }`}
            >
              {isSelected && (
                <div className="absolute -top-2 -right-2 bg-slate-900 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle2 size={14} />
                </div>
              )}

              <div className="flex items-center gap-6">
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all ${
                  isSelected ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400'
                }`}>
                  <Shirt size={40} strokeWidth={1.5} />
                </div>
                <div className="text-left">
                  <h4 className="text-[18px] font-black text-slate-900 leading-tight">{item.item_name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{item.sku}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{item.category}</span>
                  </div>
                  
                  {isLowStock && !isOutOfStock && (
                    <div className="flex items-center gap-1.5 mt-2 text-amber-600">
                      <AlertCircle size={12} />
                      <span className="text-[10px] font-black uppercase tracking-tighter">Low Stock Warning</span>
                    </div>
                  )}
                  {isOutOfStock && (
                    <div className="flex items-center gap-1.5 mt-2 text-rose-600">
                      <AlertCircle size={12} />
                      <span className="text-[10px] font-black uppercase tracking-tighter">Temporarily Sold Out</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right">
                <p className={`text-[24px] font-black ${isSelected ? 'text-slate-900' : 'text-slate-900'}`}>
                  ₱{(item.unit_price || 1500).toLocaleString()}
                </p>
                <div className={`mt-1 flex items-center justify-end gap-2 text-[11px] font-bold ${
                  isOutOfStock ? 'text-rose-500' : isLowStock ? 'text-amber-500' : 'text-slate-400'
                }`}>
                  <span>Availability:</span>
                  <span className={`px-2 py-0.5 rounded-full ${
                    isOutOfStock ? 'bg-rose-50' : isLowStock ? 'bg-amber-50' : 'bg-slate-50'
                  }`}>
                    {currentStock} {item.unit || 'pcs'}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-white text-slate-400 flex items-center justify-center shadow-sm">
          <ShoppingBag size={20} />
        </div>
        <div className="text-[12px] text-slate-500 leading-relaxed">
          <span className="font-bold text-slate-900 block mb-1">Smart Checkout Logic</span>
          Selecting an item here immediately reserves the stock for this session. The actual deduction occurs upon Order Confirmation.
        </div>
      </div>
    </div>
  );
};
