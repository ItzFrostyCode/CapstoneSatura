import React from 'react';
import { Ruler, ArrowRight, Plus, Trash2 } from 'lucide-react';
import { OrderFormData, AlterationMeasurement } from '../../../../../../../types/orderFormData';

interface AlterationMeasurementsStepProps {
  formData: OrderFormData;
  setFormData: React.Dispatch<React.SetStateAction<OrderFormData>>;
}

export const AlterationMeasurementsStep: React.FC<AlterationMeasurementsStepProps> = ({
  formData,
  setFormData
}) => {
  const addAdjustment = () => {
    const area = formData.alterationDetails.affectedAreas[0] || 'Waist';
    setFormData({
      ...formData,
      alterationDetails: {
        ...formData.alterationDetails,
        measurements: [
          ...formData.alterationDetails.measurements,
          { area, current: 0, desired: 0, difference: 0 }
        ]
      }
    });
  };

  const updateAdjustment = (index: number, field: string, value: string | number) => {
    const updated = [...formData.alterationDetails.measurements];
    updated[index] = { ...updated[index], [field]: value };
    
    // Calculate difference
    if (field === 'current' || field === 'desired') {
      const c = field === 'current' ? parseFloat(String(value)) : updated[index].current;
      const d = field === 'desired' ? parseFloat(String(value)) : updated[index].desired;
      updated[index].difference = d - c;
    }

    setFormData({
      ...formData,
      alterationDetails: { ...formData.alterationDetails, measurements: updated }
    });
  };

  const removeAdjustment = (index: number) => {
    setFormData({
      ...formData,
      alterationDetails: {
        ...formData.alterationDetails,
        measurements: formData.alterationDetails.measurements.filter((_: AlterationMeasurement, i: number) => i !== index)
      }
    });
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 pb-12">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Ruler size={14}/> Measurement Adjustments
        </h3>
        <button 
          onClick={addAdjustment}
          className="text-[11px] font-black text-indigo-600 uppercase hover:underline flex items-center gap-1"
        >
          <Plus size={14}/> Add Adjustment
        </button>
      </div>

      <div className="space-y-4">
        {formData.alterationDetails.measurements.length === 0 ? (
          <div className="p-12 text-center bg-slate-50 border border-dashed border-slate-200 rounded-[32px]">
            <Ruler className="mx-auto text-slate-300 mb-4" size={48} />
            <p className="text-[14px] font-bold text-slate-400">No adjustments recorded yet.</p>
            <p className="text-[11px] text-slate-400 mt-1">Click &quot;Add Adjustment&quot; to record sizing changes.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {formData.alterationDetails.measurements.map((m: AlterationMeasurement, i: number) => (
              <div key={i} className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm flex items-center gap-4 animate-in slide-in-from-bottom-2">
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Area</label>
                  <select 
                    value={m.area}
                    onChange={e => updateAdjustment(i, 'area', e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 text-[13px] font-bold bg-slate-50"
                  >
                    {['Waist', 'Sleeves', 'Shoulder', 'Chest', 'Length', 'Hem', 'Hips', 'Rise', 'Thigh', 'Knee'].map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>

                <div className="w-24 space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Current</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={m.current}
                    onChange={e => updateAdjustment(i, 'current', e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 text-[14px] font-bold outline-none focus:border-indigo-500" 
                  />
                </div>

                <div className="flex items-center pt-5 text-slate-300">
                  <ArrowRight size={16} />
                </div>

                <div className="w-24 space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Desired</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={m.desired}
                    onChange={e => updateAdjustment(i, 'desired', e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 text-[14px] font-bold outline-none focus:border-indigo-500" 
                  />
                </div>

                <div className="w-24 space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Delta</label>
                  <div className={`h-12 flex items-center justify-center rounded-xl font-black text-[14px] ${m.difference > 0 ? 'bg-emerald-50 text-emerald-600' : m.difference < 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-400'}`}>
                    {m.difference > 0 ? `+${m.difference}` : m.difference}
                  </div>
                </div>

                <button 
                  onClick={() => removeAdjustment(i)}
                  className="p-3 text-slate-300 hover:text-rose-500 transition-colors pt-5"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
