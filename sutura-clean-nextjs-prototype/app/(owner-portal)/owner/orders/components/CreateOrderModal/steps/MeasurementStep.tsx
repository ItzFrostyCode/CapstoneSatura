import React from 'react';
import { Scissors, AlertTriangle, Check } from 'lucide-react';
import { MeasurementProfile } from '@/types/erp';
import { OrderFormData } from '../../../../../../../types/orderFormData';

interface MeasurementStepProps {
  formData: OrderFormData;
  setFormData: (val: OrderFormData) => void;
  filteredMeasurements: MeasurementProfile[];
}

export const MeasurementStep: React.FC<MeasurementStepProps> = ({
  formData,
  setFormData,
  filteredMeasurements
}) => {
  return (
    <div className="space-y-6 animate-in slide-in-from-right-4">
      <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
        <Scissors size={14}/> Measurement Profile
      </h3>
      {!formData.customerId ? (
        <div className="p-8 text-center bg-amber-50 border border-amber-200 rounded-2xl">
          <AlertTriangle className="mx-auto text-amber-500 mb-2" size={32} />
          <p className="text-[13px] font-bold text-amber-700">Please select a customer first.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMeasurements.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {filteredMeasurements.map(m => (
                <button 
                  key={m.id}
                  onClick={() => setFormData({...formData, measurementProfileId: m.id})}
                  className={`p-5 rounded-2xl border transition-all text-left flex items-center justify-between ${formData.measurementProfileId === m.id ? 'border-indigo-600 bg-indigo-50 shadow-sm' : 'border-slate-200 hover:border-slate-400'}`}
                >
                  <div>
                    <div className="text-[14px] font-bold text-slate-900">{m.profile_name || m.id}</div>
                    <div className="text-[11px] text-slate-400 font-medium">Recorded: {new Date(m.recorded_at).toLocaleDateString()}</div>
                  </div>
                  {formData.measurementProfileId === m.id && <Check className="text-indigo-600" size={20} />}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-rose-50 border border-rose-200 rounded-2xl">
              <AlertTriangle className="mx-auto text-rose-500 mb-2" size={32} />
              <p className="text-[13px] font-bold text-rose-700">No measurement profile found for this customer.</p>
              <p className="text-[11px] text-rose-600 mt-1">Please add measurements in the Customer module first.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
