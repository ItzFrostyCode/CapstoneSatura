import React from 'react';
import { Activity, Check } from 'lucide-react';
import { OrderFormData } from '../../../../../../../types/orderFormData';

interface AlterationRequestStepProps {
  formData: OrderFormData;
  setFormData: (val: OrderFormData) => void;
}

export const AlterationRequestStep: React.FC<AlterationRequestStepProps> = ({
  formData,
  setFormData
}) => {
  const commonAreas = [
    'Waist', 'Sleeves', 'Shoulder', 'Chest', 'Length', 'Hem', 'Zipper', 'Buttons', 'Tapering', 'Lining'
  ];

  const commonTypes = [
    'Resize', 'Repair', 'Adjust Length', 'Replace Component', 'Patch Repair', 'Waist Adjustment', 'Sleeve Adjustment', 'Logo Replacement'
  ];

  const toggleArea = (area: string) => {
    const current = formData.alterationDetails.affectedAreas;
    const updated = current.includes(area)
      ? current.filter((a: string) => a !== area)
      : [...current, area];
    
    setFormData({
      ...formData,
      alterationDetails: { ...formData.alterationDetails, affectedAreas: updated }
    });
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 pb-12">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Activity size={14}/> Alteration Request Scope
        </h3>
      </div>

      <div className="space-y-8">
        {/* Service Types */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-1 block">What needs to be done? (Primary Issue)</label>
          <textarea 
            placeholder="e.g. Waist is too tight and the left sleeve has a small tear..."
            value={formData.alterationDetails.specificIssue}
            onChange={e => setFormData({
              ...formData,
              alterationDetails: { ...formData.alterationDetails, specificIssue: e.target.value }
            })}
            className="w-full h-24 p-5 rounded-2xl border border-slate-200 text-[14px] font-medium outline-none focus:border-indigo-500 bg-white shadow-sm"
          />
        </div>

        {/* Affected Areas */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1 block">Affected Areas (Multi-select)</label>
            <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full uppercase">Realistic Scope</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {commonAreas.map(area => (
              <button
                key={area}
                onClick={() => toggleArea(area)}
                className={`p-3 rounded-xl border text-[12px] font-bold transition-all text-left flex items-center justify-between group ${formData.alterationDetails.affectedAreas.includes(area) ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400'}`}
              >
                {area}
                {formData.alterationDetails.affectedAreas.includes(area) && <Check size={12} className="text-white" />}
              </button>
            ))}
          </div>
        </div>

        {/* Suggested Quick Tasks */}
        <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase block ml-1">Suggested Workflow Patterns</label>
          <div className="flex flex-wrap gap-2">
            {commonTypes.map(type => (
              <button 
                key={type}
                className="px-4 py-2 bg-white border border-slate-200 text-[11px] font-black text-slate-500 rounded-full hover:border-indigo-500 hover:text-indigo-600 transition-all uppercase tracking-tight"
              >
                + {type}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
