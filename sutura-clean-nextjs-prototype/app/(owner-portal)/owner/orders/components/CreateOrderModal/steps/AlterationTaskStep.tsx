import React from 'react';
import { CreditCard, Plus, Trash2, Scissors } from 'lucide-react';
import { OrderFormData, AlterationTask } from '../../../../../../../types/orderFormData';

interface AlterationTaskStepProps {
  formData: OrderFormData;
  setFormData: (val: OrderFormData) => void;
}

export const AlterationTaskStep: React.FC<AlterationTaskStepProps> = ({
  formData,
  setFormData
}) => {
  const commonServices = [
    { title: 'Waist Adjustment', price: 250 },
    { title: 'Sleeve Shortening', price: 150 },
    { title: 'Zipper Replacement', price: 300 },
    { title: 'Tapering (Legs/Arms)', price: 400 },
    { title: 'Hemming', price: 100 },
    { title: 'Button Replacement', price: 50 },
    { title: 'Shoulder Adjustment', price: 600 },
    { title: 'Patching / Repair', price: 200 }
  ];

  const addTask = (title = '', price = 0) => {
    setFormData({
      ...formData,
      alterationDetails: {
        ...formData.alterationDetails,
        tasks: [...formData.alterationDetails.tasks, { title, price }]
      }
    });
  };

  const removeTask = (index: number) => {
    setFormData({
      ...formData,
      alterationDetails: {
        ...formData.alterationDetails,
        tasks: formData.alterationDetails.tasks.filter((_: AlterationTask, i: number) => i !== index)
      }
    });
  };

  const updateTask = (index: number, field: string, value: string | number) => {
    const updated = [...formData.alterationDetails.tasks];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({
      ...formData,
      alterationDetails: { ...formData.alterationDetails, tasks: updated }
    });
  };

  const totalServices = formData.alterationDetails.tasks.reduce((sum: number, t: AlterationTask) => sum + (parseFloat(String(t.price)) || 0), 0);

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 pb-12">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <CreditCard size={14}/> Service-Based Pricing
        </h3>
        <button 
          onClick={() => addTask()}
          className="text-[11px] font-black text-indigo-600 uppercase hover:underline flex items-center gap-1"
        >
          <Plus size={14}/> Custom Service
        </button>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Service Catalog */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-1 block">Standard Services</label>
          <div className="grid grid-cols-1 gap-2">
            {commonServices.map(service => (
              <button 
                key={service.title}
                onClick={() => addTask(service.title, service.price)}
                className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between hover:border-indigo-500 transition-all group"
              >
                <div className="text-left flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600">
                    <Scissors size={14} />
                  </div>
                  <span className="text-[13px] font-bold text-slate-900">{service.title}</span>
                </div>
                <span className="text-[14px] font-black text-slate-900">₱{service.price}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Services / Invoice Preview */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-1 block">Selected for Order</label>
          <div className="p-8 bg-slate-900 rounded-[40px] shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <CreditCard size={120} className="text-white rotate-12" />
            </div>

            <div className="space-y-4 relative z-10">
              {formData.alterationDetails.tasks.length === 0 ? (
                <div className="py-12 text-center text-slate-500">
                  <p className="text-[13px] font-bold uppercase tracking-widest">No services added</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.alterationDetails.tasks.map((task: AlterationTask, i: number) => (
                    <div key={i} className="flex items-center justify-between group">
                      <div className="flex-1">
                        <input 
                          value={task.title}
                          onChange={e => updateTask(i, 'title', e.target.value)}
                          className="bg-transparent border-none text-white text-[13px] font-bold outline-none w-full placeholder:text-slate-700"
                          placeholder="Service Name"
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center text-white font-black text-[14px]">
                          <span className="text-slate-500 mr-1">₱</span>
                          <input 
                            type="number"
                            value={task.price}
                            onChange={e => updateTask(i, 'price', e.target.value)}
                            className="bg-transparent border-none text-white w-16 text-right outline-none"
                          />
                        </div>
                        <button onClick={() => removeTask(i)} className="text-slate-600 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-slate-800 space-y-4 relative z-10">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Total Services</span>
                <span className="text-white text-[24px] font-black">₱{totalServices.toLocaleString()}</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium italic">Final pricing may vary based on material usage and rush fees.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
