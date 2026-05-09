'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Customer, MeasurementProfile, Staff } from '@/types/erp';

export interface CustomerForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  gender: 'Male' | 'Female';
}

export interface FittingForm {
  adjustment_notes: string;
  next_fitting_date: string;
  handled_by_staff_id: string;
}

interface CustomerModalsProps {
  isAddCustomerModalOpen: boolean;
  setIsAddCustomerModalOpen: (open: boolean) => void;
  customerForm: CustomerForm;
  setCustomerForm: React.Dispatch<React.SetStateAction<CustomerForm>>;
  handleCreateCustomer: () => void;
  
  selectedEditCustomer: Customer | null;
  setSelectedEditCustomer: (customer: Customer | null) => void;
  handleUpdateCustomer: () => void;

  isAddMeasurementModalOpen: boolean;
  setIsAddMeasurementModalOpen: (open: boolean) => void;
  measForm: Partial<MeasurementProfile>;
  setMeasForm: React.Dispatch<React.SetStateAction<Partial<MeasurementProfile>>>;
  measValues: Record<string, string>;
  setMeasValues: (values: Record<string, string>) => void;
  handleSaveMeasurement: () => void;
  selectedEditMeasurement: MeasurementProfile | null;
  selectedCustomer: Customer | undefined;
  garmentTypes: string[];
  upperFields: string[];
  lowerFields: string[];
  fullBodyFields: string[];

  isAddFittingModalOpen: boolean;
  setIsAddFittingModalOpen: (open: boolean) => void;
  fittingForm: FittingForm;
  setFittingForm: React.Dispatch<React.SetStateAction<FittingForm>>;
  fittingMetrics: Record<string, string>;
  setFittingMetrics: (metrics: Record<string, string>) => void;
  handleSaveFitting: () => void;
  activeProfile: MeasurementProfile | undefined;
  staff: Staff[];
}

export const CustomerModals: React.FC<CustomerModalsProps> = ({
  isAddCustomerModalOpen,
  setIsAddCustomerModalOpen,
  customerForm,
  setCustomerForm,
  handleCreateCustomer,
  selectedEditCustomer,
  setSelectedEditCustomer,
  handleUpdateCustomer,
  isAddMeasurementModalOpen,
  setIsAddMeasurementModalOpen,
  measForm,
  setMeasForm,
  measValues,
  setMeasValues,
  handleSaveMeasurement,
  selectedEditMeasurement,
  selectedCustomer,
  garmentTypes,
  upperFields,
  lowerFields,
  fullBodyFields,
  isAddFittingModalOpen,
  setIsAddFittingModalOpen,
  fittingForm,
  setFittingForm,
  fittingMetrics,
  setFittingMetrics,
  handleSaveFitting,
  activeProfile,
  staff
}) => {
  return (
    <>
      {/* Add Customer Modal */}
      {isAddCustomerModalOpen && (
        <div className="fixed inset-0 z-500 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-[500px] rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-[24px] font-black text-slate-900 tracking-tight">Add Customer</h2>
              <button onClick={() => setIsAddCustomerModalOpen(false)} className="w-10 h-10 rounded-xl hover:bg-white flex items-center justify-center text-slate-400 transition-colors"><X size={20} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                  <input type="text" className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-900" placeholder="e.g. Juan Dela Cruz" value={customerForm.name} onChange={e => setCustomerForm({...customerForm, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Phone Number</label>
                    <input type="text" className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-900" placeholder="09XX XXX XXXX" value={customerForm.phone} onChange={e => setCustomerForm({...customerForm, phone: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Gender</label>
                    <select 
                      className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-900" 
                      value={customerForm.gender} 
                      onChange={e => setCustomerForm({...customerForm, gender: e.target.value as 'Male' | 'Female'})}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                  <input type="email" className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-900" placeholder="customer@example.com" value={customerForm.email} onChange={e => setCustomerForm({...customerForm, email: e.target.value})} />
                </div>
              </div>
              <button onClick={handleCreateCustomer} className="w-full h-14 bg-slate-900 text-white rounded-[24px] font-black text-[15px] hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95">Register Profile</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {selectedEditCustomer && (
        <div className="fixed inset-0 z-500 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-[500px] rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-[24px] font-black text-slate-900 tracking-tight">Edit Customer Details</h2>
              <button onClick={() => setSelectedEditCustomer(null)} className="w-10 h-10 rounded-xl hover:bg-white flex items-center justify-center text-slate-400 transition-colors"><X size={20} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                  <input type="text" className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-900" value={selectedEditCustomer.name} onChange={e => setSelectedEditCustomer({...selectedEditCustomer, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Phone Number</label>
                    <input type="text" className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-900" value={selectedEditCustomer.phone} onChange={e => setSelectedEditCustomer({...selectedEditCustomer, phone: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Gender</label>
                    <select 
                      className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-900" 
                      value={selectedEditCustomer.gender} 
                      onChange={e => setSelectedEditCustomer({...selectedEditCustomer!, gender: e.target.value as 'Male' | 'Female'})}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                  <input type="email" className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-900" value={selectedEditCustomer.email} onChange={e => setSelectedEditCustomer({...selectedEditCustomer!, email: e.target.value})} />
                </div>
              </div>
              <button onClick={handleUpdateCustomer} className="w-full h-14 bg-indigo-600 text-white rounded-[24px] font-black text-[15px] hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 active:scale-95">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Measurement Modal */}
      {isAddMeasurementModalOpen && (
        <div className="fixed inset-0 z-500 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-[1000px] rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-[24px] font-black text-slate-900 tracking-tight">
                  {selectedEditMeasurement ? 'Edit Measurement Profile' : 'New Measurement Profile'}
                </h2>
                <p className="text-[12px] text-slate-400 font-bold uppercase tracking-widest mt-1">{selectedCustomer?.name}</p>
              </div>
              <button onClick={() => setIsAddMeasurementModalOpen(false)} className="w-10 h-10 rounded-xl hover:bg-white flex items-center justify-center text-slate-400 transition-colors"><X size={20} /></button>
            </div>
            <div className="p-8 max-h-[75vh] overflow-y-auto custom-scrollbar grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-4 space-y-8">
                <div className="space-y-4">
                   <h3 className="text-[14px] font-black text-slate-900 flex items-center gap-2 uppercase tracking-widest">General Info</h3>
                   <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Profile Name</label>
                    <input type="text" className="w-full h-11 px-4 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-slate-900" placeholder="e.g. Wedding 2025" value={measForm.profile_name} onChange={e => setMeasForm({...measForm, profile_name: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Category</label>
                      <select 
                        className="w-full h-11 px-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-[12px]" 
                        value={measForm.garment_category} 
                        onChange={e => {
                          const val = e.target.value;
                          if (val === 'Upper Wear' || val === 'Lower Wear' || val === 'Full Body') {
                            setMeasForm({...measForm, garment_category: val});
                          }
                        }}
                      >
                        {['Upper Wear', 'Lower Wear', 'Full Body'].map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Garment</label>
                      <select className="w-full h-11 px-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-[12px]" value={measForm.garment_type} onChange={e => setMeasForm({...measForm, garment_type: e.target.value})}>
                        {garmentTypes.map(type => <option key={type} value={type}>{type}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Fit</label>
                      <select 
                        className="w-full h-11 px-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-[12px]" 
                        value={measForm.fit_preference} 
                        onChange={e => {
                          const val = e.target.value;
                          if (val === 'Slim' || val === 'Regular' || val === 'Loose' || val === 'Oversized') {
                            setMeasForm({...measForm, fit_preference: val});
                          }
                        }}
                      >
                        {['Slim', 'Regular', 'Loose', 'Oversized'].map(fit => <option key={fit} value={fit}>{fit}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Unit</label>
                      <select 
                        className="w-full h-11 px-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-[12px]" 
                        value={measForm.measurement_unit} 
                        onChange={e => {
                          const val = e.target.value;
                          if (val === 'Inches' || val === 'Centimeters') {
                            setMeasForm({...measForm, measurement_unit: val});
                          }
                        }}
                      >
                        {['Inches', 'Centimeters'].map(u => <option key={u} value={u}>{u}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Base Size (Optional)</label>
                    <div className="flex flex-wrap gap-2">
                      {['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'].map(size => (
                        <button 
                          key={size}
                          onClick={() => setMeasForm({...measForm, base_size: size})}
                          className={`w-10 h-10 rounded-lg text-[11px] font-black border transition-all ${measForm.base_size === size ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-300'}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[14px] font-black text-slate-900 flex items-center gap-2 uppercase tracking-widest">Tailoring Notes</h3>
                  <textarea className="w-full h-24 bg-slate-50 border border-slate-100 rounded-xl p-4 text-[13px] font-medium resize-none outline-none focus:bg-white" placeholder="Posture, Figuration, Fabric Allowance..." value={measForm.special_instructions} onChange={e => setMeasForm({...measForm, special_instructions: e.target.value})} />
                </div>
              </div>

              <div className="lg:col-span-8">
                 <h3 className="text-[14px] font-black text-slate-900 flex items-center gap-2 uppercase tracking-widest mb-6">Detailed Metrics ({measForm.measurement_unit})</h3>
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {(measForm.garment_category === 'Upper Wear' ? upperFields : measForm.garment_category === 'Lower Wear' ? lowerFields : fullBodyFields).map(field => (
                      <div key={field} className="space-y-1.5">
                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-tighter">{field}</label>
                        <input type="number" step="0.125" className="w-full h-10 px-3 bg-slate-50 border border-slate-100 rounded-xl font-black text-[14px] outline-none focus:bg-white focus:border-indigo-500 transition-all" placeholder="0.0" value={measValues[field] || ''} onChange={e => setMeasValues({...measValues, [field]: e.target.value})} />
                      </div>
                    ))}
                 </div>
              </div>
            </div>
            <div className="p-8 bg-slate-50 border-t border-slate-100">
               <button onClick={handleSaveMeasurement} className="w-full h-14 bg-slate-900 text-white rounded-[24px] font-black text-[15px] hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95">
                 {selectedEditMeasurement ? 'Update Profile' : 'Record Measurement Profile'}
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Fitting Modal */}
      {isAddFittingModalOpen && (
        <div className="fixed inset-0 z-500 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-[900px] rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-[24px] font-black text-slate-900 tracking-tight">Record Fitting Adjustment</h2>
              <button onClick={() => setIsAddFittingModalOpen(false)} className="w-10 h-10 rounded-xl hover:bg-white flex items-center justify-center text-slate-400 transition-colors"><X size={20} /></button>
            </div>
            <div className="p-8 max-h-[75vh] overflow-y-auto custom-scrollbar grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-5 flex flex-col space-y-6">
                <div className="space-y-4 flex-1 flex flex-col">
                  <div className="flex-1 flex flex-col">
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Adjustment Notes</label>
                    <textarea className="w-full flex-1 min-h-[290px] bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold text-slate-900 outline-none focus:bg-white resize-none" placeholder="e.g. Reduced sleeve by 1 inch, adjusted shoulder slope..." value={fittingForm.adjustment_notes} onChange={e => setFittingForm({...fittingForm, adjustment_notes: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Next Fitting</label>
                    <input type="date" className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl font-bold" value={fittingForm.next_fitting_date} onChange={e => setFittingForm({...fittingForm, next_fitting_date: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Assigned Staff</label>
                    <select className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl font-bold" value={fittingForm.handled_by_staff_id} onChange={e => setFittingForm({...fittingForm, handled_by_staff_id: e.target.value})}>
                      {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-4">
                 <h3 className="text-[14px] font-black text-slate-900 flex items-center gap-2 uppercase tracking-widest mb-4">Adjust Metrics ({activeProfile?.measurement_unit})</h3>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {(activeProfile?.garment_category === 'Upper Wear' ? upperFields : activeProfile?.garment_category === 'Lower Wear' ? lowerFields : fullBodyFields).map(field => (
                      <div key={field} className="space-y-1.5">
                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-tighter">{field}</label>
                        <input type="number" step="0.125" className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl font-black text-[14px] outline-none focus:border-indigo-500 transition-all shadow-sm" value={fittingMetrics[field] || ''} onChange={e => setFittingMetrics({...fittingMetrics, [field]: e.target.value})} />
                      </div>
                    ))}
                 </div>
              </div>
            </div>
            <div className="p-8 bg-slate-50 border-t border-slate-100">
               <button onClick={handleSaveFitting} className="w-full h-14 bg-indigo-600 text-white rounded-[24px] font-black text-[15px] hover:bg-slate-900 transition-all shadow-xl active:scale-95">Record Update {activeProfile ? `(V${(parseInt(activeProfile.version_no.replace('V', '')) || 1) + 1})` : ''}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
