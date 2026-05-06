import React from 'react';


export interface NewGarmentForm {
  name: string;
  category: string;
  base_price: number;
  fabric_sku: string;
  fabric_per_unit: number;
  requires_measurement: boolean;
  default_tasks: string[];
}

interface AddGarmentFormProps {
  newGarment: NewGarmentForm;
  setNewGarment: React.Dispatch<React.SetStateAction<NewGarmentForm>>;
  onSubmit: () => void;
}

export const AddGarmentForm: React.FC<AddGarmentFormProps> = ({
  newGarment,
  setNewGarment,
  onSubmit
}) => {
  return (
    <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-200 space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Garment Name</label>
          <input 
            placeholder="e.g. Slim Fit Blazer" 
            value={newGarment.name} 
            onChange={e => setNewGarment({...newGarment, name: e.target.value})} 
            className="w-full h-12 px-4 rounded-xl border border-slate-200 text-[14px] font-bold outline-none bg-white focus:border-indigo-500 shadow-sm" 
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Category</label>
          <select 
            value={newGarment.category} 
            onChange={e => setNewGarment({...newGarment, category: e.target.value})} 
            className="w-full h-12 px-4 rounded-xl border border-slate-200 text-[14px] font-bold bg-white outline-none"
          >
            <option>Suits</option>
            <option>Barong</option>
            <option>Pants</option>
            <option>Dresses</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Base Price (₱)</label>
          <input 
            type="number" 
            value={newGarment.base_price} 
            onChange={e => setNewGarment({...newGarment, base_price: parseInt(e.target.value) || 0})} 
            className="w-full h-12 px-4 rounded-xl border border-slate-200 text-[14px] font-bold outline-none bg-white focus:border-indigo-500 shadow-sm" 
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Fabric Consumption (m)</label>
          <input 
            type="number" 
            step="0.1" 
            value={newGarment.fabric_per_unit} 
            onChange={e => setNewGarment({...newGarment, fabric_per_unit: parseFloat(e.target.value) || 0})} 
            className="w-full h-12 px-4 rounded-xl border border-slate-200 text-[14px] font-bold outline-none bg-white focus:border-indigo-500 shadow-sm" 
          />
        </div>
      </div>
      <button 
        onClick={onSubmit} 
        className="w-full h-14 bg-slate-900 text-white rounded-2xl text-[15px] font-black shadow-xl shadow-slate-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
      >
        Save Template & Continue
      </button>
    </div>
  );
};
