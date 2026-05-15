'use client';

import React from 'react';
import { ArrowLeft, Ruler, Plus, Edit2, Mail, Phone, Search, Calendar } from 'lucide-react';
import { Customer, Order, MeasurementProfile, Appointment, FittingSession } from '@/types/erp';
import { OverviewTab } from './tabs/OverviewTab';
import { OrdersTab } from './tabs/OrdersTab';
import { MeasurementsTab } from './tabs/MeasurementsTab';
import { AppointmentsTab } from './tabs/AppointmentsTab';
import { HistoryTab } from './tabs/HistoryTab';

interface CustomerProfileProps {
  customer: Customer;
  orders: Order[];
  measurementProfiles: MeasurementProfile[];
  appointments: Appointment[];
  fittingSessions: FittingSession[];
  profileTab: 'overview' | 'orders' | 'measurements' | 'appointments' | 'history';
  setProfileTab: (tab: 'overview' | 'orders' | 'measurements' | 'appointments' | 'history') => void;
  onBack: () => void;
  onEditCustomer: (customer: Customer) => void;
  onNewProfile: () => void;
  onNewOrder: () => void;
  onUpdatePosture: (tags: string[]) => void;
  onUpdateStyle: (style: string) => void;
  newPostureTag: string;
  setNewPostureTag: (tag: string) => void;
  onAddCustomTag: () => void;
  onRecordFitting: (profile: MeasurementProfile) => void;
  onEditProfile: (profile: MeasurementProfile) => void;
  onDeleteProfile: (profileId: string) => void;
  onNewAppointment: () => void;
  postureTags: string[];
  hideAppointmentBtn?: boolean;
  hideAppointmentsTab?: boolean;
  hideNewOrderBtn?: boolean;
}

export const CustomerProfile: React.FC<CustomerProfileProps> = ({
  customer,
  orders,
  measurementProfiles,
  appointments,
  fittingSessions,
  profileTab,
  setProfileTab,
  onBack,
  onEditCustomer,
  onNewProfile,
  onNewOrder,
  onUpdatePosture,
  onUpdateStyle,
  newPostureTag,
  setNewPostureTag,
  onAddCustomTag,
  onRecordFitting,
  onEditProfile,
  onDeleteProfile,
  onNewAppointment,
  postureTags,
  hideAppointmentBtn = false,
  hideAppointmentsTab = false,
  hideNewOrderBtn = false
}) => {
  const customerOrders = orders.filter(o => o.customer_id === customer.id);
  const ltv = customerOrders.reduce((sum, o) => sum + o.total_amount, 0);

  return (
    <div className="animate-in fade-in duration-500 space-y-8 font-poppins">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[12px] font-black text-slate-400 hover:text-slate-900 transition-colors group uppercase tracking-widest"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Directory
        </button>
        <div className="flex items-center gap-3">
          {!hideAppointmentBtn && (
            <button 
              onClick={onNewAppointment}
              className="h-10 px-5 bg-white border border-slate-200 rounded-xl text-[12px] font-bold text-slate-600 hover:border-slate-900 hover:text-slate-900 transition-all flex items-center gap-2 shadow-sm"
            >
              <Calendar size={16} /> Schedule Session
            </button>
          )}
          <button 
            onClick={onNewProfile}
            className="h-10 px-5 bg-white border border-slate-200 rounded-xl text-[12px] font-bold text-slate-600 hover:border-slate-900 hover:text-slate-900 transition-all flex items-center gap-2 shadow-sm"
          >
            <Ruler size={16} /> New Profile
          </button>
          {!hideNewOrderBtn && (
            <button 
              onClick={onNewOrder}
              className="h-10 px-5 bg-slate-900 text-white rounded-xl text-[12px] font-bold shadow-lg hover:shadow-slate-900/20 transition-all flex items-center gap-2 active:scale-95"
            >
              <Plus size={16} /> New Order
            </button>
          )}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className={`w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center text-[24px] font-black shadow-inner ${customer.gender === 'Female' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}>
            {customer.avatar ? (
              <img src={customer.avatar} alt={customer.name} className="w-full h-full object-cover" />
            ) : (
              customer.name.split(' ').map(n => n[0]).join('').toUpperCase()
            )}
          </div>
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4">
              <h2 className="text-[32px] font-bold text-slate-900 tracking-tight leading-none">{customer.name}</h2>
              <button 
                onClick={() => onEditCustomer(customer)}
                className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 hover:bg-slate-50 transition-all shadow-sm"
              >
                <Edit2 size={16} />
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3">
              <span className="flex items-center gap-2 text-[13px] font-bold text-slate-500"><Mail size={14} className="text-slate-300" /> {customer.email}</span>
              <span className="flex items-center gap-2 text-[13px] font-bold text-slate-500"><Phone size={14} className="text-slate-300" /> {customer.phone}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 text-center min-w-[120px] shadow-inner">
            <div className="text-[20px] font-black text-slate-900">{customerOrders.length}</div>
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Total Orders</div>
          </div>
          <div className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 text-center min-w-[120px] shadow-inner">
            <div className="text-[20px] font-black text-slate-900">₱{ltv.toLocaleString()}</div>
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Customer LTV</div>
          </div>
        </div>
      </div>

      <div className="px-8 py-5 border border-slate-200 rounded-[24px] bg-white flex items-center justify-between gap-8">
        <div className="flex items-center gap-1.5 bg-slate-200/50 p-1 rounded-xl w-fit border border-slate-200/60 shadow-inner">
          {(['overview', 'orders', 'measurements', 'appointments', 'history'] as const)
            .filter(tab => !(tab === 'appointments' && hideAppointmentsTab))
            .map(tab => (
            <button
              key={tab}
              onClick={() => setProfileTab(tab)}
              className={`px-5 py-2 text-[11px] font-black uppercase tracking-widest rounded-lg transition-all duration-300 ${
                profileTab === tab 
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/50' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-white/40'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {profileTab === 'orders' && (
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input 
              type="text" 
              placeholder="Search by order ID or garment..." 
              className="h-10 w-full pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-[13px] font-bold outline-none focus:border-slate-900 transition-all shadow-sm"
            />
          </div>
        )}
      </div>

      <div className="min-h-[400px]">
        {profileTab === 'overview' && (
          <OverviewTab 
            customer={customer}
            fittingSessions={fittingSessions}
            measurementProfiles={measurementProfiles}
            postureTags={postureTags}
            onUpdatePosture={onUpdatePosture}
            onUpdateStyle={onUpdateStyle}
            newPostureTag={newPostureTag}
            setNewPostureTag={setNewPostureTag}
            onAddCustomTag={onAddCustomTag}
          />
        )}

        {profileTab === 'orders' && <OrdersTab orders={orders} customerId={customer.id} />}

        {profileTab === 'measurements' && (
          <MeasurementsTab 
            profiles={measurementProfiles}
            customerId={customer.id}
            onRecordFitting={onRecordFitting}
            onEditProfile={onEditProfile}
            onDeleteProfile={onDeleteProfile}
            unit="Inches"
          />
        )}

        {profileTab === 'appointments' && (
          <AppointmentsTab 
            appointments={appointments}
            customerName={customer.name}
          />
        )}

        {profileTab === 'history' && <HistoryTab customerId={customer.id} />}
      </div>
    </div>
  );
};
