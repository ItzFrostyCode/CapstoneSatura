'use client';

import { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  MoreVertical,
  Mail,
  Phone,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ArrowUpRight,
  Copy,
  Settings,
  Building2,
  Ruler,
  X,
  Filter,
  Calendar,
} from 'lucide-react';
import customersData from '@/data/customers.json';
import appointmentsData from '@/data/appointments.json';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastOrder?: string;
  status?: string;
  ordersCount?: number;
  address?: string;
  notes?: string;
  type?: string;
  is_active?: boolean;
  style_preferences?: string;
  posture_tags?: string[];
  tier?: string;
  fitProfile?: 'Male' | 'Female';
}

interface Measurement {
  id: string;
  customerId: string;
  type: 'Upper' | 'Lower' | 'Standard' | 'Bulk';
  subType?: 'Polo' | 'T-Shirt' | 'Pants' | 'Shorts';
  version: string;
  data?: string;
  date?: string;
  measuredBy?: string;
  gender?: 'Male' | 'Female';
  standardSize?: string;
}

type ActiveTab = 'directory' | 'measurements' | 'appointments';
type DrawerTab = 'profile' | 'orders' | 'measurements';
type MeasType = 'Upper' | 'Lower' | 'Standard' | 'Bulk';
type SubType = 'Polo' | 'T-Shirt' | 'Pants' | 'Shorts';
type EntryMode = 'Custom' | 'Standard';

const MEASUREMENT_FIELDS = {
  Polo: ['Chest', 'Shoulder', 'Sleeve', 'Neck', 'Full Length'],
  'T-Shirt': ['Chest', 'Length', 'Shoulder Width', 'Sleeve Opening'],
  Pants: ['Waist', 'Outseam', 'Inseam', 'Hips', 'Thigh', 'Knee'],
  Shorts: ['Waist', 'Total Length', 'Hips', 'Leg Opening'],
} as const;

const STANDARD_SIZES = {
  Upper: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  Lower: ['28', '30', '32', '34', '36', '38', '40'],
} as const;

function BulkEntryRow({ subType }: { subType: SubType }) {
  const [mode, setMode] = useState<EntryMode>('Custom');
  const fields = MEASUREMENT_FIELDS[subType];

  return (
    <tr className="group border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
      <td className="p-2 pl-4">
        <input
          type="text"
          placeholder="Name..."
          className="w-full h-10 bg-transparent text-[13px] font-bold outline-none"
        />
      </td>

      <td className="p-2">
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as EntryMode)}
          className="w-full h-9 px-2 bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-black outline-none"
        >
          <option value="Custom">Custom</option>
          <option value="Standard">Standard</option>
        </select>
      </td>

      {mode === 'Custom' ? (
        fields.map((field) => (
          <td key={field} className="p-2">
            <input
              type="text"
              placeholder='0"'
              className="w-full h-10 px-3 bg-white border border-slate-100 rounded-lg text-[13px] font-bold outline-none focus:border-indigo-500"
            />
          </td>
        ))
      ) : (
        <td colSpan={fields.length} className="p-2">
          <select className="w-full h-10 px-4 bg-indigo-50 border border-indigo-100 rounded-xl text-[13px] font-black text-indigo-900 outline-none">
            {STANDARD_SIZES[subType === 'Polo' || subType === 'T-Shirt' ? 'Upper' : 'Lower'].map(
              (size) => (
                <option key={size} value={size}>
                  Standard Size {size}
                </option>
              )
            )}
          </select>
        </td>
      )}

      <td className="p-2 text-center">
        <button className="p-2 text-slate-300 hover:text-red-500 transition-colors">
          <X size={16} />
        </button>
      </td>
    </tr>
  );
}

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('directory');
  const [drawerTab, setDrawerTab] = useState<DrawerTab>('profile');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isMeasurementModalOpen, setIsMeasurementModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [measType, setMeasType] = useState<MeasType>('Upper');
  const [subType, setSubType] = useState<SubType>('Polo');

  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editingMeasurement, setEditingMeasurement] = useState<Measurement | null>(null);

  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');

  const customers = (customersData as unknown) as Customer[];

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const appointments = appointmentsData;

  const filteredAppointments = appointments.filter(a => 
    a.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const kpis = [
    { label: 'Total Customers', val: filteredCustomers.length.toString(), icon: <Users size={20} className="text-slate-500" /> },
    { label: 'Today\'s Appointments', val: filteredAppointments.length.toString(), icon: <Calendar size={20} className="text-slate-500" /> },
  ];

  const openEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsEditMode(true);
    setIsCustomerModalOpen(true);
  };

  const openEditMeasurement = (meas: Measurement) => {
    setEditingMeasurement(meas);
    setMeasType(meas.type);
    if (meas.subType) setSubType(meas.subType);
    setIsEditMode(true);
    setIsMeasurementModalOpen(true);
  };

  const openAddCustomer = () => {
    setEditingCustomer(null);
    setIsEditMode(false);
    setIsCustomerModalOpen(true);
  };

  const openAddMeasurement = () => {
    setEditingMeasurement(null);
    setIsEditMode(false);
    setIsMeasurementModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-20 relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
        {kpis.map((kpi, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between"
          >
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-1">
                {kpi.label}
              </div>
              <div className="text-[28px] font-black text-slate-900 tracking-tighter leading-none">
                {kpi.val}
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
              {kpi.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Secondary Navigation Tabs */}
      <div className="flex flex-wrap bg-slate-100/80 p-1.5 rounded-full w-max gap-1 mb-6 border border-slate-200/50">
        {[
          { id: 'directory', name: 'Customer Directory', icon: <Users size={14} /> },
          { id: 'measurements', name: 'Measurements', icon: <Ruler size={14} /> },
          { id: 'appointments', name: 'Appointments', icon: <Calendar size={14} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as ActiveTab)}
            className={`flex items-center gap-2.5 px-6 py-2.5 rounded-full text-[12px] font-black transition-all uppercase tracking-widest whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-white text-slate-900 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] border border-slate-200/50' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-4">
          <h2 className="text-[18px] font-black text-slate-900 tracking-tight whitespace-nowrap">
            {activeTab === 'directory'
              ? 'Customer Directory'
              : activeTab === 'measurements'
                ? 'Measurement Archive'
                : 'Appointments'}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {activeTab === 'directory' && (
            <div className="flex items-center p-1 border border-slate-100 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'grid'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-900'
                }`}
              >
                <ArrowUpRight size={14} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'list'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-900'
                }`}
              >
                <MoreVertical size={14} className="rotate-90" />
              </button>
            </div>
          )}

          {activeTab === 'directory' && (
            <button
              onClick={openAddCustomer}
              className="bg-slate-900 text-white h-11 px-6 rounded-xl text-[13px] font-black hover:bg-indigo-600 transition-all flex items-center gap-2 shadow-sm"
            >
              <Plus size={18} />
              Add Customer
            </button>
          )}

          {activeTab === 'measurements' && (
            <button
              onClick={openAddMeasurement}
              className="bg-slate-900 text-white h-11 px-6 rounded-xl text-[13px] font-black hover:bg-indigo-600 transition-all flex items-center gap-2 shadow-sm"
            >
              <Plus size={18} />
              Add New
            </button>
          )}

          {activeTab === 'appointments' && (
            <button
              onClick={() => setIsAppointmentModalOpen(true)}
              className="bg-slate-900 text-white h-11 px-6 rounded-xl text-[13px] font-black hover:bg-indigo-600 transition-all flex items-center gap-2 shadow-sm"
            >
              <Plus size={18} />
              Add Appointment
            </button>
          )}
        </div>
      </div>

      {activeTab === 'directory' ? (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Integrated Search/Filter Bar - Common for Directory */}
            <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative group flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, email..." 
                  className="h-10 w-full pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium outline-none focus:bg-white focus:border-slate-900 transition-all"
                />
              </div>

              <div className="flex items-center gap-2">
                <button className="h-10 px-4 bg-white border border-slate-200 rounded-xl flex items-center gap-2 text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-all">
                  <Filter size={16} /> All Status
                </button>
                <button className="h-10 px-4 bg-white border border-slate-200 rounded-xl flex items-center gap-2 text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-all">
                  <Calendar size={16} /> Date Range
                </button>
              </div>
            </div>

            {viewMode === 'grid' ? (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
                  {filteredCustomers.map((customer) => (
                    <div
                      key={customer.id}
                      className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-5 hover:border-slate-300 transition-all group relative"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div>
                            <h3 className="text-[16px] font-black text-slate-900 leading-tight">
                              {customer.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Phone size={12} className="text-slate-300" />
                              <span className="text-[12px] text-slate-500 font-bold tracking-tight">
                                {customer.phone}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50/50 rounded-xl p-3 flex items-center justify-between mb-5 group-hover:bg-slate-100/50 transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <Mail size={14} className="text-slate-300" />
                          <span className="text-[13px] font-bold text-slate-600 truncate">
                            {customer.email}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() => setSelectedCustomer(customer)}
                          className="flex-1 h-10 bg-white border border-slate-100 rounded-xl text-[13px] font-black text-slate-900 hover:bg-slate-50 transition-all shadow-sm"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => openEditCustomer(customer)}
                          className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all shadow-sm"
                        >
                          <Settings size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto animate-in fade-in duration-500">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-slate-50/50 text-slate-400">
                      <th className="py-4 px-6 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest w-24">
                        Cust-ID
                      </th>
                      <th className="py-4 px-6 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest">
                        Customer
                      </th>
                      <th className="py-4 px-6 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest">
                        Email
                      </th>
                      <th className="py-4 px-6 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest">
                        Phone
                      </th>
                      <th className="py-4 px-6 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest">
                        Last Order
                      </th>
                      <th className="py-4 px-6 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest text-right">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer, idx) => (
                      <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="py-4 px-6 border-b border-slate-100">
                          <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">C-10{idx + 1}</span>
                        </td>
                        <td className="py-4 px-6 border-b border-slate-100">
                          <div className="text-[14px] font-black text-slate-900">{customer.name}</div>
                        </td>
                        <td className="py-4 px-6 border-b border-slate-100 text-[13px] font-bold text-slate-500">
                          {customer.email}
                        </td>
                        <td className="py-4 px-6 border-b border-slate-100 text-[13px] font-bold text-slate-500">
                          {customer.phone}
                        </td>
                        <td className="py-4 px-6 border-b border-slate-100 text-[13px] font-bold text-slate-500">
                          {customer.lastOrder}
                        </td>
                        <td className="py-4 px-6 border-b border-slate-100 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedCustomer(customer)}
                              className="h-9 px-4 bg-white border border-slate-200 rounded-xl text-[12px] font-black text-slate-900 hover:bg-slate-50 transition-all shadow-sm"
                            >
                              View
                            </button>
                            <button
                              onClick={() => openEditCustomer(customer)}
                              className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-slate-900"
                            >
                              <Settings size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Pagination Mockup */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
               <div className="text-[12px] font-medium text-slate-500">Showing 1 to {filteredCustomers.length} of {filteredCustomers.length} customers</div>
               <div className="flex gap-2">
                  <button className="px-4 py-1.5 rounded-lg border border-slate-200 text-[12px] font-bold bg-white text-slate-400 cursor-not-allowed">Previous</button>
                  <button className="px-4 py-1.5 rounded-lg border border-slate-200 text-[12px] font-bold bg-white text-slate-900 hover:bg-slate-50 transition-all shadow-sm">Next</button>
               </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'measurements' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Integrated Search/Filter Bar */}
          <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative group flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search measurements by customer..." 
                className="h-10 w-full pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium outline-none focus:bg-white focus:border-slate-900 transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              <button className="h-10 px-4 bg-white border border-slate-200 rounded-xl flex items-center gap-2 text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-all">
                <Filter size={16} /> All Types
              </button>
            </div>
          </div>

          <table className="w-full border-collapse text-left overflow-x-auto">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400">
                <th className="p-4 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest w-24">
                  Meas-ID
                </th>
                <th className="p-4 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest">
                  Customer
                </th>
                <th className="p-4 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest">
                  Type
                </th>
                <th className="p-4 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest">
                  Version
                </th>
                <th className="p-4 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest">
                  Technical Data
                </th>
                <th className="p-4 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest">
                  Date
                </th>
                <th className="p-4 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
  {filteredCustomers.slice(0, 3).map((customer, i) => (
    <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors">
      <td className="p-4 border-b border-slate-100">
        <span className="text-[11px] font-black text-slate-400">MEAS-50{i + 1}</span>
      </td>

      <td className="p-4 border-b border-slate-100">
        <div className="text-[14px] font-black text-slate-900">{customer.name}</div>
      </td>

      <td className="p-4 border-b border-slate-100">
        <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-[11px] font-black text-slate-600 uppercase tracking-tighter">
          {i % 2 === 0 ? 'Polo' : 'Pants'}
        </span>
      </td>

      <td className="p-4 border-b border-slate-100 font-bold text-slate-900 text-[14px]">
        v{2 - i > 0 ? 2 - i : 1}
      </td>

      <td className="p-4 border-b border-slate-100">
        <div className="bg-slate-900/5 px-3 py-1.5 rounded-lg border border-slate-200 inline-block font-mono text-[12px] font-bold text-slate-700">
          {i % 2 === 0 ? 'Chest: 42" · Sh: 18.5"' : 'Waist: 34" · Len: 40"'}
        </div>
      </td>

      <td className="p-4 border-b border-slate-100">
        <div className="text-[13px] font-bold text-slate-500">{customer.lastOrder}</div>
      </td>

      <td className="p-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              openEditMeasurement({
                id: `m-list-${i}`,
                customerId: customer.id,
                type: i % 2 === 0 ? 'Upper' : 'Lower',
                subType: i % 2 === 0 ? 'Polo' : 'Pants',
                version: 'v1',
              })
            }
            className="p-2 hover:bg-slate-100 rounded-lg transition-all text-slate-400 hover:text-slate-900 border border-slate-100"
          >
            <Ruler size={14} />
          </button>
        </div>
      </td>
    </tr>
  ))}
</tbody>
</table>
          
          {/* Pagination Mockup */}
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
             <div className="text-[12px] font-medium text-slate-500">Showing 1 to {Math.min(3, filteredCustomers.length)} of {filteredCustomers.length} measurements</div>
             <div className="flex gap-2">
                <button className="px-4 py-1.5 rounded-lg border border-slate-200 text-[12px] font-bold bg-white text-slate-400 cursor-not-allowed">Previous</button>
                <button className="px-4 py-1.5 rounded-lg border border-slate-200 text-[12px] font-bold bg-white text-slate-900 hover:bg-slate-50 transition-all shadow-sm">Next</button>
             </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
          {/* Integrated Search/Filter Bar */}
          <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative group flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search appointments..." 
                className="h-10 w-full pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium outline-none focus:bg-white focus:border-slate-900 transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              <button className="h-10 px-4 bg-white border border-slate-200 rounded-xl flex items-center gap-2 text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-all">
                <Calendar size={16} /> Today
              </button>
            </div>
          </div>

          <table className="w-full border-collapse text-left overflow-x-auto">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400">
                <th className="py-3 px-4 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest w-24">
                  Appt-ID
                </th>
                <th className="py-3 px-4 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest">
                  Customer
                </th>
                <th className="py-3 px-4 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest">
                  Service
                </th>
                <th className="py-3 px-4 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest">
                  Date & Time
                </th>
                <th className="py-3 px-4 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appt) => (
                <tr key={appt.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 px-6 border-b border-slate-100">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{appt.id}</span>
                  </td>
                  <td className="py-4 px-6 border-b border-slate-100">
                    <div className="text-[14px] font-black text-slate-900">{appt.customer}</div>
                  </td>
                  <td className="py-4 px-6 border-b border-slate-100 text-[13px] font-bold text-slate-500">
                    {appt.type}
                  </td>
                  <td className="py-4 px-6 border-b border-slate-100 text-[13px] font-bold text-slate-500">
                    {appt.date} · {appt.time}
                  </td>
                  <td className="py-4 px-6 border-b border-slate-100">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        appt.status === 'Confirmed'
                          ? 'bg-emerald-50 text-emerald-600'
                          : appt.status === 'Upcoming'
                            ? 'bg-amber-50 text-amber-600'
                            : 'bg-slate-50 text-slate-600'
                      }`}
                    >
                      {appt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Pagination Mockup */}
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
             <div className="text-[12px] font-medium text-slate-500">Showing 1 to {filteredAppointments.length} of {filteredAppointments.length} appointments</div>
             <div className="flex gap-2">
                <button className="px-4 py-1.5 rounded-lg border border-slate-200 text-[12px] font-bold bg-white text-slate-400 cursor-not-allowed">Previous</button>
                <button className="px-4 py-1.5 rounded-lg border border-slate-200 text-[12px] font-bold bg-white text-slate-900 hover:bg-slate-50 transition-all shadow-sm">Next</button>
             </div>
          </div>
        </div>
      )}

    
      {selectedCustomer && (
        <>
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110] animate-in fade-in duration-300"
            onClick={() => setSelectedCustomer(null)}
          />
          <div className="fixed top-0 right-0 w-full max-w-[550px] h-full bg-white z-[120] shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div>
                <h2 className="text-[20px] font-black text-slate-900 tracking-tight">Customer Details</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] font-black text-slate-900">CUST-101</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300 mx-1" />
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Active Customer
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex px-8 border-b border-slate-100 bg-slate-50/30">
              {[
                { id: 'profile', label: 'Overview' },
                { id: 'orders', label: 'Order History' },
                { id: 'measurements', label: 'Measurements' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setDrawerTab(tab.id as DrawerTab)}
                  className={`px-4 py-4 text-[12px] font-black transition-all relative ${
                    drawerTab === tab.id ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab.label}
                  {drawerTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900" />}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {drawerTab === 'profile' && (
                <div className="p-8 space-y-10">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-5">
                      <div>
                        <h3 className="text-[22px] font-black text-slate-900 leading-tight">
                          {selectedCustomer.name}
                        </h3>
                        <p className="text-[13px] text-slate-400 font-bold mt-1 tracking-tight">
                          {selectedCustomer.phone}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => openEditCustomer(selectedCustomer)}
                      className="bg-slate-900 text-white h-10 px-5 rounded-xl text-[12px] font-black hover:bg-indigo-600 transition-all flex items-center gap-2"
                    >
                      <Settings size={14} />
                      Edit
                    </button>
                  </div>

                  <div className="bg-slate-50/50 rounded-2xl p-8 border border-slate-100 space-y-6">
                    <div className="space-y-3">
                      <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        Contact Information
                      </div>
                      <div className="space-y-4">
                        {[
                          { label: 'Email', val: selectedCustomer.email, icon: <Mail size={16} /> },
                          { label: 'Phone', val: selectedCustomer.phone, icon: <Phone size={16} /> },
                          { label: 'Location', val: 'Quezon City, Manila', icon: <Building2 size={16} /> },
                        ].map((info, i) => (
                          <div key={i} className="flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                              <div className="text-slate-300">{info.icon}</div>
                              <div className="text-[13px] font-bold text-slate-600">{info.val}</div>
                            </div>
                            <button className="text-slate-300 hover:text-slate-900 transition-colors">
                              <Copy size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {drawerTab === 'orders' && (
                <div className="p-8 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="bg-white border border-slate-100 rounded-xl p-4 hover:border-slate-300 transition-all shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-[13px] font-black text-slate-900">Order #ORD-10{i}</div>
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                          Delivered
                        </span>
                      </div>
                      <div className="text-[12px] text-slate-400 font-bold">12 Oct, 2024 · ₱8,500.00</div>
                    </div>
                  ))}
                </div>
              )}

              {drawerTab === 'measurements' && (
                <div className="p-8 space-y-6">
                  {(
                    [
                      { v: 'v2', type: 'Upper', sub: 'Polo', date: 'Jan 20, 2024', data: 'Chest: 42" · Sh: 18.5"' },
                      { v: 'v1', type: 'Lower', sub: 'Pants', date: 'Oct 12, 2023', data: 'Waist: 34" · Len: 40"' },
                    ] as Array<{
                      v: string;
                      type: 'Upper' | 'Lower';
                      sub: 'Polo' | 'Pants';
                      date: string;
                      data: string;
                    }>
                  ).map((m, i) => (
                    <div key={i} className="rounded-xl border border-slate-100 p-5 space-y-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-[16px] font-black text-slate-900">{m.v}</span>
                          <span className="text-[12px] text-slate-400 font-bold uppercase tracking-widest">
                            {m.sub || m.type}
                          </span>
                        </div>
                        <button
                          onClick={() =>
                            openEditMeasurement({
                              id: `m${i}`,
                              customerId: selectedCustomer?.id || '0',
                              type: m.type,
                              subType: m.sub,
                              version: m.v,
                            })
                          }
                          className="text-[12px] font-black text-indigo-600 hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-lg font-mono text-[12px] font-bold text-slate-700">
                        {m.data}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {isCustomerModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
              <h3 className="text-[20px] font-black text-slate-900 tracking-tight">
                {isEditMode ? 'Edit Customer' : 'Add New Customer'}
              </h3>
              <button
                onClick={() => setIsCustomerModalOpen(false)}
                className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-900 transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Full Name *
                </label>
                <input
                  type="text"
                  defaultValue={editingCustomer?.name || ''}
                  placeholder="e.g. Maria Santos"
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-bold outline-none focus:bg-white focus:border-slate-900 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue={editingCustomer?.email || ''}
                    placeholder="customer@example.com"
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-bold outline-none focus:bg-white focus:border-slate-900 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    defaultValue={editingCustomer?.phone || ''}
                    placeholder="+63 9XX XXX XXXX"
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-bold outline-none focus:bg-white focus:border-slate-900 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Complete Address
                </label>
                <input
                  type="text"
                  defaultValue={editingCustomer?.address || ''}
                  placeholder="Unit, Building, Street, City"
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-bold outline-none focus:bg-white focus:border-slate-900 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Customer Tier
                  </label>
                  <div className="relative">
                    <select
                      defaultValue={editingCustomer?.tier || 'Regular'}
                      className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-bold outline-none appearance-none"
                    >
                      <option value="Regular">Regular</option>
                      <option value="Designer">Designer</option>
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Fit Profile
                  </label>
                  <div className="relative">
                    <select
                      defaultValue={editingCustomer?.fitProfile || 'Male'}
                      className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-bold outline-none appearance-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-white">
              <button
                onClick={() => setIsCustomerModalOpen(false)}
                className="px-6 h-11 rounded-xl text-[14px] font-black text-slate-500 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button className="px-8 h-11 bg-slate-900 text-white rounded-xl text-[14px] font-black hover:bg-indigo-600 transition-all shadow-lg shadow-slate-900/10">
                {isEditMode ? 'Update Customer' : 'Save Customer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isMeasurementModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsMeasurementModalOpen(false)}
          />

          <div className="bg-white w-full max-w-5xl h-[85vh] rounded-[32px] shadow-2xl relative overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
              <div>
                <h2 className="text-[22px] font-black text-slate-900 tracking-tight">
                  {isEditMode ? 'Modify Measurement' : 'New Measurement Hub'}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    CUST-101
                  </span>
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    {selectedCustomer?.name || 'Maria Santos'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsMeasurementModalOpen(false)}
                className="w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-hidden flex">
              {measType !== 'Standard' && measType !== 'Bulk' && (
                <div className="w-[380px] border-r border-slate-100 bg-slate-50/30 flex flex-col items-center justify-center p-12 relative overflow-hidden">
                  <div className="absolute top-8 left-8">
                    <div className="flex items-center gap-2 p-1 bg-white border border-slate-100 rounded-lg shadow-sm">
                      <button
                        onClick={() => setGender('Male')}
                        className={`px-3 py-1.5 rounded-md text-[11px] font-black transition-all ${
                          gender === 'Male' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        MALE
                      </button>
                      <button
                        onClick={() => setGender('Female')}
                        className={`px-3 py-1.5 rounded-md text-[11px] font-black transition-all ${
                          gender === 'Female' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        FEMALE
                      </button>
                    </div>
                  </div>

                  <div
                    className={`w-full max-w-[240px] opacity-20 relative animate-in fade-in zoom-in duration-700 ${
                      measType === 'Lower' ? 'translate-y-[-20%]' : ''
                    }`}
                  >
                    {gender === 'Male' ? (
                      <svg viewBox="0 0 100 200" className="w-full h-full text-slate-900 fill-current">
                        <path d="M50 10 C55 10, 60 15, 60 25 C60 35, 55 40, 50 40 C45 40, 40 35, 40 25 C40 15, 45 10, 50 10 M30 45 C40 40, 60 40, 70 45 L75 80 L65 80 L60 55 L60 130 L70 190 L55 190 L50 140 L45 190 L30 190 L40 130 L40 55 L35 80 L25 80 Z" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 100 200" className="w-full h-full text-slate-900 fill-current">
                        <path d="M50 10 C55 10, 58 15, 58 25 C58 35, 55 40, 50 40 C45 40, 42 35, 42 25 C42 15, 45 10, 50 10 M35 45 C40 42, 60 42, 65 45 L70 85 L62 85 L58 60 C58 80, 65 110, 65 130 L60 190 L52 190 L50 145 L48 190 L40 190 L35 130 C35 110, 42 80, 42 60 L38 85 L30 85 Z" />
                      </svg>
                    )}
                    <div
                      className={`absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-indigo-500 rounded-full opacity-40 ${
                        measType === 'Upper' ? 'top-[35%]' : 'top-[75%]'
                      }`}
                    />
                  </div>

                  <div className="mt-12 text-center">
                    <div className="text-[14px] font-black text-slate-900 tracking-tight">
                      {measType === 'Upper' ? 'Upper Body Guide' : 'Lower Body Guide'}
                    </div>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                      Focusing on {subType} points
                    </p>
                  </div>
                </div>
              )}

              <div className="flex-1 overflow-y-auto p-10 space-y-8 bg-white">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Measurement Category
                  </label>
                  <div className="flex gap-2 p-1 border border-slate-100 rounded-xl max-w-lg">
                    {(
                      [
                        { id: 'Upper', label: 'Custom Upper' },
                        { id: 'Lower', label: 'Custom Lower' },
                        { id: 'Standard', label: 'Standard' },
                        { id: 'Bulk', label: 'Bulk Entry' },
                      ] as const
                    ).map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setMeasType(tab.id);
                          if (tab.id === 'Upper') setSubType('Polo');
                          if (tab.id === 'Lower') setSubType('Pants');
                        }}
                        className={`flex-1 py-2.5 rounded-lg text-[12px] font-black transition-all ${
                          measType === tab.id
                            ? 'bg-slate-900 text-white shadow-sm'
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {(measType === 'Upper' || measType === 'Lower') && (
                  <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                    <div className="flex gap-2 p-1 bg-slate-50 border border-slate-100 rounded-lg w-fit">
                      {measType === 'Upper' ? (
                        <>
                          <button
                            onClick={() => setSubType('Polo')}
                            className={`px-4 py-2 rounded-md text-[12px] font-black transition-all ${
                              subType === 'Polo' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'
                            }`}
                          >
                            POLO
                          </button>
                          <button
                            onClick={() => setSubType('T-Shirt')}
                            className={`px-4 py-2 rounded-md text-[12px] font-black transition-all ${
                              subType === 'T-Shirt' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'
                            }`}
                          >
                            T-SHIRT
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setSubType('Pants')}
                            className={`px-4 py-2 rounded-md text-[12px] font-black transition-all ${
                              subType === 'Pants' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'
                            }`}
                          >
                            PANTS
                          </button>
                          <button
                            onClick={() => setSubType('Shorts')}
                            className={`px-4 py-2 rounded-md text-[12px] font-black transition-all ${
                              subType === 'Shorts' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'
                            }`}
                          >
                            SHORTS
                          </button>
                        </>
                      )}
                    </div>

                    <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">
                      {subType} Measurements — Inches
                    </div>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                      {MEASUREMENT_FIELDS[subType].map((field) => (
                        <div key={field} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-[12px] font-black text-slate-900">{field}</label>
                            <div className="flex gap-1">
                              {['1/8', '1/4', '1/2', '3/4'].map((frac) => (
                                <button
                                  key={frac}
                                  className="px-1.5 py-0.5 bg-slate-50 border border-slate-100 rounded text-[9px] font-black text-slate-500 hover:bg-slate-900 hover:text-white transition-all"
                                >
                                  {frac}
                                </button>
                              ))}
                            </div>
                          </div>
                          <input
                            type="text"
                            placeholder='0.00"'
                            className="w-full h-11 px-4 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-bold outline-none focus:bg-white focus:border-slate-900 transition-all"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {measType === 'Standard' && (
                  <div className="max-w-md space-y-8 animate-in slide-in-from-left-4 duration-300">
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                        Garment Category
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setSubType('Polo')}
                          className={`p-4 rounded-2xl border text-left transition-all ${
                            subType === 'Polo'
                              ? 'border-slate-900 bg-slate-900 text-white'
                              : 'border-slate-100 bg-white text-slate-600'
                          }`}
                        >
                          <div className="text-[14px] font-black">Upper Body</div>
                          <div className="text-[10px] font-bold opacity-60">Polo, T-Shirt, etc.</div>
                        </button>
                        <button
                          onClick={() => setSubType('Pants')}
                          className={`p-4 rounded-2xl border text-left transition-all ${
                            subType === 'Pants'
                              ? 'border-slate-900 bg-slate-900 text-white'
                              : 'border-slate-100 bg-white text-slate-600'
                          }`}
                        >
                          <div className="text-[14px] font-black">Lower Body</div>
                          <div className="text-[10px] font-bold opacity-60">Pants, Shorts, etc.</div>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                        Select Reference Size ({subType === 'Polo' ? 'Alphabetic' : 'Numeric'})
                      </label>
                      <div className="relative">
                        <select
                          className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-bold outline-none appearance-none"
                          defaultValue={subType === 'Polo' ? 'M' : '32'}
                        >
                          {subType === 'Polo' ? (
                            <>
                              <option value="XS">Extra Small (XS)</option>
                              <option value="S">Small (S)</option>
                              <option value="M">Medium (M)</option>
                              <option value="L">Large (L)</option>
                              <option value="XL">Extra Large (XL)</option>
                              <option value="XXL">XXL</option>
                            </>
                          ) : (
                            <>
                              <option value="28">Size 28</option>
                              <option value="30">Size 30</option>
                              <option value="32">Size 32</option>
                              <option value="34">Size 34</option>
                              <option value="36">Size 36</option>
                              <option value="38">Size 38</option>
                            </>
                          )}
                        </select>
                        <ChevronDown
                          size={16}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {measType === 'Bulk' && (
                  <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2 p-1 bg-slate-50 border border-slate-100 rounded-lg">
                        <button
                          onClick={() => setSubType('Polo')}
                          className={`px-4 py-2 rounded-md text-[12px] font-black transition-all ${
                            subType === 'Polo' || subType === 'T-Shirt'
                              ? 'bg-white text-slate-900 shadow-sm'
                              : 'text-slate-400'
                          }`}
                        >
                          BULK UPPER
                        </button>
                        <button
                          onClick={() => setSubType('Pants')}
                          className={`px-4 py-2 rounded-md text-[12px] font-black transition-all ${
                            subType === 'Pants' || subType === 'Shorts'
                              ? 'bg-white text-slate-900 shadow-sm'
                              : 'text-slate-400'
                          }`}
                        >
                          BULK LOWER
                        </button>
                      </div>

                      <div className="flex gap-2 p-1 bg-slate-50 border border-slate-100 rounded-lg">
                        {(subType === 'Polo' || subType === 'T-Shirt' ? ['Polo', 'T-Shirt'] : ['Pants', 'Shorts']).map(
                          (type) => (
                            <button
                              key={type}
                              onClick={() => setSubType(type as SubType)}
                              className={`px-3 py-1.5 rounded-md text-[10px] font-black transition-all ${
                                subType === type ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-400'
                              }`}
                            >
                              {type.toUpperCase()}
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    <div className="border border-slate-100 rounded-2xl overflow-x-auto shadow-sm">
                      <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                          <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <th className="p-4 border-b border-slate-100 w-[180px]">Customer Name</th>
                            <th className="p-4 border-b border-slate-100 w-[120px]">Entry Mode</th>
                            {MEASUREMENT_FIELDS[subType].map((field) => (
                              <th key={field} className="p-4 border-b border-slate-100">
                                {field}
                              </th>
                            ))}
                            <th className="p-4 border-b border-slate-100 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[1, 2, 3, 4].map((i) => (
                            <BulkEntryRow key={i} subType={subType} />
                          ))}
                        </tbody>
                      </table>

                      <button className="w-full py-4 bg-slate-50 text-[11px] font-black text-slate-500 hover:bg-slate-100 transition-all uppercase tracking-widest border-t border-slate-100">
                        + Add Entry Row
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end items-center gap-3 bg-white shrink-0">
              <button
                onClick={() => setIsMeasurementModalOpen(false)}
                className="px-6 h-11 rounded-xl text-[14px] font-black text-slate-500 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button className="px-8 h-11 bg-slate-900 text-white rounded-xl text-[14px] font-black hover:bg-indigo-600 transition-all shadow-lg shadow-slate-900/10">
                {isEditMode ? 'Update Measurement' : 'Save Measurement'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isAppointmentModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsAppointmentModalOpen(false)}
          />
          <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl relative overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white">
              <div>
                <h2 className="text-[20px] font-black text-slate-900 tracking-tight">
                  Schedule Appointment
                </h2>
                <p className="text-[12px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                  Fitting & Consultations
                </p>
              </div>
              <button
                onClick={() => setIsAppointmentModalOpen(false)}
                className="w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Select Customer
                  </label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search customer name..."
                      className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-bold outline-none focus:bg-white focus:border-slate-900 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      Date
                    </label>
                    <input
                      type="date"
                      className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-bold outline-none focus:bg-white focus:border-slate-900 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      Time
                    </label>
                    <input
                      type="time"
                      className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-bold outline-none focus:bg-white focus:border-slate-900 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Service Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Initial Fitting', 'Final Fitting', 'Consultation', 'Repair'].map((type) => (
                      <button
                        key={type}
                        className="py-3 px-4 rounded-xl border border-slate-100 text-[12px] font-black text-slate-600 hover:border-slate-900 hover:text-slate-900 transition-all text-left"
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Notes</label>
                  <textarea
                    placeholder="Special instructions or requests..."
                    className="w-full h-24 p-4 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-bold outline-none focus:bg-white focus:border-slate-900 transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-white">
              <button
                onClick={() => setIsAppointmentModalOpen(false)}
                className="px-6 h-11 rounded-xl text-[14px] font-black text-slate-500 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button className="px-8 h-11 bg-slate-900 text-white rounded-xl text-[14px] font-black hover:bg-indigo-600 transition-all shadow-lg shadow-slate-900/10">
                Create Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}