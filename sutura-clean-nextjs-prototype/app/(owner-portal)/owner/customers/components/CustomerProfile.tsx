'use client';

import React from 'react';
import { ArrowLeft, Ruler, Plus, Edit2, Mail, Phone } from 'lucide-react';
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
  postureTags: string[];
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
  postureTags
}) => {
  const customerOrders = orders.filter(o => o.customer_id === customer.id);
  const ltv = customerOrders.reduce((sum, o) => sum + o.total_amount, 0);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[13px] font-black text-slate-400 hover:text-slate-900 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Directory
        </button>
        <div className="flex items-center gap-3">
          <button 
            onClick={onNewProfile}
            className="h-10 px-4 bg-white border border-slate-200 rounded-xl text-[12px] font-black text-slate-600 hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center gap-2"
          >
            <Ruler size={16} /> New Profile
          </button>
          <button 
            onClick={onNewOrder}
            className="h-10 px-4 bg-slate-900 text-white rounded-xl text-[12px] font-black hover:bg-indigo-600 transition-all flex items-center gap-2"
          >
            <Plus size={16} /> New Order
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[40px] p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className={`w-24 h-24 rounded-[32px] flex items-center justify-center text-[32px] font-black shadow-inner ${customer.gender === 'Female' ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'}`}>
            {customer.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="text-center md:text-left space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <h2 className="text-[36px] font-black text-slate-900 tracking-tight leading-none">{customer.name}</h2>
              <button 
                onClick={() => onEditCustomer(customer)}
                className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-600 hover:bg-indigo-50 transition-all"
              >
                <Edit2 size={18} />
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <span className="flex items-center gap-2 text-[14px] font-bold text-slate-500"><Mail size={16} className="text-indigo-400" /> {customer.email}</span>
              <span className="flex items-center gap-2 text-[14px] font-bold text-slate-500"><Phone size={16} className="text-emerald-400" /> {customer.phone}</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center">
            <div className="text-[24px] font-black text-slate-900">{customerOrders.length}</div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Total Orders</div>
          </div>
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center">
            <div className="text-[24px] font-black text-slate-900">₱{ltv.toLocaleString()}</div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">LTV</div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-8 border-b border-slate-200 pb-0 overflow-x-auto no-scrollbar">
        {(['overview', 'orders', 'measurements', 'appointments', 'history'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setProfileTab(tab)}
            className={`pb-4 text-[14px] font-black uppercase tracking-widest transition-all relative ${profileTab === tab ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-900'}`}
          >
            {tab}
            {profileTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-full" />}
          </button>
        ))}
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
