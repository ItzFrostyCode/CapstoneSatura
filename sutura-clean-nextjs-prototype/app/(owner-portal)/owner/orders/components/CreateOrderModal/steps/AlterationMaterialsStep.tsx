import React from 'react';
import { Package, Plus, Trash2, Search } from 'lucide-react';
import { InventoryItem } from '@/types/erp';
import { OrderFormData, AlterationMaterial } from '../../../../../../../types/orderFormData';

interface AlterationMaterialsStepProps {
  inventory: InventoryItem[];
  formData: OrderFormData;
  setFormData: React.Dispatch<React.SetStateAction<OrderFormData>>;
}

export const AlterationMaterialsStep: React.FC<AlterationMaterialsStepProps> = ({
  inventory,
  formData,
  setFormData
}) => {
  const addMaterial = (item: InventoryItem) => {
    const exists = formData.alterationDetails.materialsNeeded.find((m: AlterationMaterial) => m.item_id === item.id);
    if (exists) return;

    setFormData({
      ...formData,
      alterationDetails: {
        ...formData.alterationDetails,
        materialsNeeded: [
          ...formData.alterationDetails.materialsNeeded,
          { item_id: item.id, item_name: item.item_name, quantity: 1 }
        ]
      }
    });
  };

  const removeMaterial = (itemId: string) => {
    setFormData({
      ...formData,
      alterationDetails: {
        ...formData.alterationDetails,
        materialsNeeded: formData.alterationDetails.materialsNeeded.filter((m: AlterationMaterial) => m.item_id !== itemId)
      }
    });
  };

  const updateQuantity = (itemId: string, qty: number) => {
    const updated = formData.alterationDetails.materialsNeeded.map((m: AlterationMaterial) => 
      m.item_id === itemId ? { ...m, quantity: qty } : m
    );
    setFormData({
      ...formData,
      alterationDetails: { ...formData.alterationDetails, materialsNeeded: updated }
    });
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 pb-12">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Package size={14}/> Materials & Components Needed
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Inventory Selection */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              placeholder="Search components (Zipper, Button...)" 
              className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 text-[13px] font-medium outline-none focus:border-indigo-500"
            />
          </div>
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {inventory.filter(i => i.category === 'Components' || i.category === 'Raw Materials').map(item => (
              <button 
                key={item.id}
                onClick={() => addMaterial(item)}
                className="w-full p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between hover:border-indigo-500 transition-all group"
              >
                <div className="text-left">
                  <div className="text-[13px] font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{item.item_name}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.sku}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-black text-slate-400">Stock: {item.stock}</span>
                  <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <Plus size={16} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Materials */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-1 block">Allocated for Order</label>
          <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 space-y-3 min-h-[400px]">
            {formData.alterationDetails.materialsNeeded.length === 0 ? (
              <div className="h-[300px] flex flex-col items-center justify-center text-center p-8 opacity-40">
                <Package size={48} className="mb-4" />
                <p className="text-[13px] font-bold">No materials added</p>
                <p className="text-[10px]">Select components from the inventory to track usage.</p>
              </div>
            ) : (
              formData.alterationDetails.materialsNeeded.map((m: AlterationMaterial) => (
                <div key={m.item_id} className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-between animate-in zoom-in-95">
                  <div className="flex-1">
                    <div className="text-[12px] font-bold text-slate-900">{m.item_name}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <input 
                      type="number" 
                      value={m.quantity}
                      onChange={e => updateQuantity(m.item_id, parseInt(e.target.value) || 1)}
                      className="w-12 h-8 text-center text-[12px] font-bold border border-slate-200 rounded-lg outline-none"
                    />
                    <button 
                      onClick={() => removeMaterial(m.item_id)}
                      className="p-1 text-slate-300 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
