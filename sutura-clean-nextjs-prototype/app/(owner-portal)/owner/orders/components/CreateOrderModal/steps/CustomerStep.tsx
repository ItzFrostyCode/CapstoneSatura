import React from 'react';
import { User, Plus, X } from 'lucide-react';
import { Customer, MeasurementProfile } from '@/types/erp';
import { AddCustomerForm, NewCustomerForm, NewMeasurementForm } from '../forms/AddCustomerForm';
import { OrderFormData } from '@/types/orderFormData';

interface CustomerStepProps {
  customers: Customer[];
  measurementProfiles: MeasurementProfile[];
  formData: OrderFormData;
  setFormData: React.Dispatch<React.SetStateAction<OrderFormData>>;
  showAddCustomer: boolean;
  setShowAddCustomer: (val: boolean) => void;
  newCustomer: NewCustomerForm;
  setNewCustomer: React.Dispatch<React.SetStateAction<NewCustomerForm>>;
  newMeasurement: NewMeasurementForm;
  setNewMeasurement: React.Dispatch<React.SetStateAction<NewMeasurementForm>>;
  onAddCustomer: () => void;
}

export const CustomerStep: React.FC<CustomerStepProps> = ({
  customers,
  measurementProfiles,
  formData,
  setFormData,
  showAddCustomer,
  setShowAddCustomer,
  newCustomer,
  setNewCustomer,
  newMeasurement,
  setNewMeasurement,
  onAddCustomer
}) => {
  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 pb-12">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <User size={14}/> Select Customer
        </h3>
        <button 
          onClick={() => setShowAddCustomer(!showAddCustomer)} 
          className={`text-[11px] font-black uppercase tracking-widest flex items-center gap-1 transition-colors ${showAddCustomer ? 'text-rose-500' : 'text-indigo-600 hover:underline'}`}
        >
          {showAddCustomer ? <X size={14}/> : <Plus size={14}/>} {showAddCustomer ? 'Cancel Registration' : 'New Customer'}
        </button>
      </div>
      
      {showAddCustomer ? (
        <AddCustomerForm 
          newCustomer={newCustomer}
          setNewCustomer={setNewCustomer}
          newMeasurement={newMeasurement}
          setNewMeasurement={setNewMeasurement}
          onSubmit={onAddCustomer}
        />
      ) : (
        <div className="space-y-6">
          <div className="p-1.5 bg-slate-100 rounded-2xl flex gap-1">
            <div className="flex-1 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[13px] font-bold text-slate-900">
              Existing Customer
            </div>
          </div>
          <select 
            value={formData.customerId}
            onChange={e => {
              const custId = e.target.value;
              const profile = measurementProfiles.find(p => p.customer_id === custId);
              setFormData({
                ...formData, 
                customerId: custId,
                measurementProfileId: profile ? profile.id : ''
              });
            }}
            className="w-full h-14 px-5 rounded-2xl border border-slate-200 text-[15px] font-bold outline-none focus:border-slate-900 bg-white shadow-sm"
          >
            <option value="">Select a customer...</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>{customer.name}</option>
            ))}
          </select>

          {formData.customerId && (
            <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-[24px] space-y-4 animate-in fade-in slide-in-from-top-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase">Active Measurements</span>
                <span className="px-2 py-1 bg-white text-indigo-600 text-[9px] font-black rounded-lg border border-indigo-100">
                  {measurementProfiles.filter(p => p.customer_id === formData.customerId).length} Profile(s) Found
                </span>
              </div>
              <div className="space-y-2">
                {measurementProfiles.filter(p => p.customer_id === formData.customerId).map(profile => (
                  <button 
                    key={profile.id}
                    onClick={() => setFormData({...formData, measurementProfileId: profile.id})}
                    className={`w-full p-4 rounded-xl border text-left transition-all ${formData.measurementProfileId === profile.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-bold">{profile.profile_name}</span>
                      <span className="text-[10px] font-medium opacity-60">{profile.garment_type} ({profile.fit_preference})</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
