import React from 'react';
import { Scissors, Shirt, Plus, X } from 'lucide-react';
import { GarmentTemplate } from '@/types/erp';
import { AddGarmentForm, NewGarmentForm } from '../forms/AddGarmentForm';
import { OrderFormData } from '../../../../../../../types/orderFormData';

interface GarmentTemplateStepProps {
  garmentTemplates: GarmentTemplate[];
  formData: OrderFormData;
  setFormData: React.Dispatch<React.SetStateAction<OrderFormData>>;
  showAddGarment: boolean;
  setShowAddGarment: (val: boolean) => void;
  newGarment: NewGarmentForm;
  setNewGarment: React.Dispatch<React.SetStateAction<NewGarmentForm>>;
  onAddGarment: () => void;
}

export const GarmentTemplateStep: React.FC<GarmentTemplateStepProps> = ({
  garmentTemplates,
  formData,
  setFormData,
  showAddGarment,
  setShowAddGarment,
  newGarment,
  setNewGarment,
  onAddGarment
}) => {
  const filteredTemplates = garmentTemplates.filter(tmpl => {
    if (formData.orderType === 'BESPOKE') return tmpl.category === 'Bespoke';
    if (formData.orderType === 'BULK') return tmpl.category === 'Bulk';
    return true;
  });

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 pb-12">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Scissors size={14}/> Garment Template ({formData.orderType === 'BULK' ? 'Bulk/Uniform' : 'Bespoke'})
        </h3>
        <button 
          onClick={() => setShowAddGarment(!showAddGarment)}
          className={`text-[11px] font-black uppercase tracking-widest flex items-center gap-1 transition-colors ${showAddGarment ? 'text-rose-500' : 'text-indigo-600 hover:underline'}`}
        >
          {showAddGarment ? <X size={14}/> : <Plus size={14}/>} {showAddGarment ? 'Cancel' : 'New Template'}
        </button>
      </div>

      {showAddGarment ? (
        <AddGarmentForm 
          newGarment={newGarment}
          setNewGarment={setNewGarment}
          onSubmit={onAddGarment}
        />
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {filteredTemplates.map(tmpl => (
            <button
              key={tmpl.id}
              onClick={() => setFormData({...formData, garmentTemplateId: tmpl.id})}
              className={`p-6 rounded-[32px] border text-left transition-all ${formData.garmentTemplateId === tmpl.id ? 'bg-slate-900 border-slate-900 text-white shadow-2xl scale-[1.02]' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-900'}`}
            >
              <div className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center ${formData.garmentTemplateId === tmpl.id ? 'bg-white/20' : 'bg-slate-100 text-slate-400'}`}>
                <Shirt size={20} />
              </div>
              <h4 className="text-[15px] font-black leading-tight">{tmpl.name}</h4>
              <p className={`text-[11px] font-bold mt-1 ${formData.garmentTemplateId === tmpl.id ? 'text-slate-400' : 'text-slate-400'}`}>
                ₱{tmpl.base_price.toLocaleString()}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
