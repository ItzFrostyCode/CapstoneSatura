import React from 'react';
import { X, Check } from 'lucide-react';
import { GarmentCategory, FitPreference } from '@/types/erp';

export interface NewCustomerForm {
  name: string;
  phone: string;
  email: string;
  gender: 'Male' | 'Female';
  posture_tags: string[];
  style_preferences: string;
}

export interface NewMeasurementForm {
  garment_category: GarmentCategory;
  measurement_unit: 'Inches' | 'Centimeters';
  fit_preference: FitPreference;
  [key: string]: string | number;
}

interface AddCustomerFormProps {
  newCustomer: NewCustomerForm;
  setNewCustomer: React.Dispatch<React.SetStateAction<NewCustomerForm>>;
  newMeasurement: NewMeasurementForm;
  setNewMeasurement: React.Dispatch<React.SetStateAction<NewMeasurementForm>>;
  onSubmit: () => void;
}

export const AddCustomerForm: React.FC<AddCustomerFormProps> = ({
  newCustomer,
  setNewCustomer,
  newMeasurement,
  setNewMeasurement,
  onSubmit
}) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      {/* Section 1: Basic Info */}
      <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-200 space-y-6">
        <h4 className="text-[14px] font-black text-slate-900 flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px]">1</div>
          Register Client
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Full Name</label>
            <input 
              placeholder="e.g. Juan Dela Cruz" 
              value={newCustomer.name} 
              onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} 
              className="w-full h-12 px-4 rounded-xl border border-slate-200 text-[14px] font-medium outline-none focus:border-indigo-500" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Phone Number</label>
            <input 
              placeholder="09XX XXX XXXX" 
              value={newCustomer.phone} 
              onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})} 
              className="w-full h-12 px-4 rounded-xl border border-slate-200 text-[14px] font-medium outline-none focus:border-indigo-500" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Email Address</label>
            <input 
              placeholder="client@example.com" 
              value={newCustomer.email} 
              onChange={e => setNewCustomer({...newCustomer, email: e.target.value})} 
              className="w-full h-12 px-4 rounded-xl border border-slate-200 text-[14px] font-medium outline-none focus:border-indigo-500" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Gender</label>
            <select 
              value={newCustomer.gender} 
              onChange={e => setNewCustomer({...newCustomer, gender: e.target.value as 'Male' | 'Female'})} 
              className="w-full h-12 px-4 rounded-xl border border-slate-200 text-[14px] font-bold outline-none focus:border-indigo-500 bg-white"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>

        {/* Posture Tags */}
        <div className="space-y-3 pt-4 border-t border-slate-200">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Posture & Figuration</label>
          <div className="flex flex-wrap gap-2">
            {newCustomer.posture_tags.map((tag: string) => (
              <span key={tag} className="px-3 py-1.5 bg-indigo-600 text-white text-[11px] font-black rounded-full flex items-center gap-2 animate-in zoom-in-75">
                {tag}
                <button onClick={() => setNewCustomer({...newCustomer, posture_tags: newCustomer.posture_tags.filter((t: string) => t !== tag)})}><X size={10}/></button>
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              'Square Shoulders', 'Stooped', 'Erect', 'Prominent Chest', 
              'Prominent Seat', 'Sway Back', 'Head Forward', 
              'Low Right Shoulder', 'Low Left Shoulder', 'Full Bicep', 'Thin Bicep'
            ].filter(t => !newCustomer.posture_tags.includes(t)).map(tag => (
              <button 
                key={tag}
                type="button"
                onClick={() => setNewCustomer({...newCustomer, posture_tags: [...newCustomer.posture_tags, tag]})}
                className="px-2.5 py-1.5 bg-white border border-slate-200 text-slate-500 text-[10px] font-bold rounded-lg hover:border-indigo-500 hover:text-indigo-600 transition-all"
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1 pt-4 border-t border-slate-200">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Style Preferences</label>
          <textarea 
            rows={3}
            placeholder="e.g. Prefers slim fit Italian cut."
            value={newCustomer.style_preferences}
            onChange={e => setNewCustomer({...newCustomer, style_preferences: e.target.value})}
            className="w-full p-4 rounded-xl border border-slate-200 text-[13px] font-medium outline-none focus:border-indigo-500 resize-none"
          />
        </div>
      </div>

      {/* Section 2: Measurements */}
      <div className="p-8 bg-indigo-50/50 rounded-[32px] border border-indigo-100 space-y-6">
        <h4 className="text-[14px] font-black text-slate-900 flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-[10px]">2</div>
          Measurement Profile
        </h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Category</label>
            <select 
              value={newMeasurement.garment_category} 
              onChange={e => setNewMeasurement({...newMeasurement, garment_category: e.target.value as GarmentCategory})} 
              className="w-full h-12 px-4 rounded-xl border border-slate-200 text-[14px] font-bold bg-white"
            >
              <option>Upper Wear</option>
              <option>Lower Wear</option>
              <option>Full Body</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Unit</label>
            <div className="flex gap-2">
              {['Inches', 'Centimeters'].map(u => (
                <button 
                  key={u}
                  type="button"
                  onClick={() => setNewMeasurement({...newMeasurement, measurement_unit: u as 'Inches' | 'Centimeters'})}
                  className={`flex-1 h-12 rounded-xl border text-[13px] font-bold transition-all ${newMeasurement.measurement_unit === u ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-400'}`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Fit Preference</label>
            <div className="flex gap-2">
              {['Slim', 'Regular', 'Loose', 'Oversized'].map((fit) => (
                <button
                  key={fit}
                  type="button"
                  onClick={() => setNewMeasurement({...newMeasurement, fit_preference: fit as FitPreference})}
                  className={`flex-1 h-12 rounded-xl border text-[12px] font-bold transition-all ${newMeasurement.fit_preference === fit ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-400'}`}
                >
                  {fit}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-indigo-100">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Detailed Metrics ({newMeasurement.measurement_unit})</label>
          <div className="grid grid-cols-4 gap-3">
            {[
              ['Neck', 'neck_circumference'], ['Shoulder', 'shoulder_width'], ['Chest', 'chest_circumference'], ['Waist', 'waist_circumference'],
              ['Hip', 'hip_circumference'], ['Sleeve', 'sleeve_length'], ['Armhole', 'armhole_circumference'], ['Bicep', 'bicep_circumference'],
              ['Wrist', 'wrist_circumference'], ['Back W.', 'back_width'], ['Front W.', 'front_width'], ['Slope', 'shoulder_slope'],
              ['Jacket L.', 'jacket_length']
            ].map(([label, key]) => (
              <div key={key} className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase truncate block ml-1">{label}</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={newMeasurement[key] || 0} 
                  onChange={e => setNewMeasurement({...newMeasurement, [key]: parseFloat(e.target.value) || 0})}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[14px] font-bold outline-none focus:border-indigo-500 bg-white" 
                />
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={onSubmit}
          className="w-full h-14 bg-slate-900 text-white rounded-2xl text-[15px] font-black shadow-xl shadow-slate-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Check size={20}/> Register Client & Measurements
        </button>
      </div>
    </div>
  );
};
