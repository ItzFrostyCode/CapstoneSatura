'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Plus, Edit2, Trash2, X, FileText, Ruler, Phone, Mail, Users, Calendar, ArrowLeft, Receipt, Clock, ShoppingCart, Eye, Layout, Image as ImageIcon, Target, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useERPStore, type Customer, type MeasurementProfile } from '../../store/useERPStore';

const TAILORING_POSTURE_TAGS = [
  "Sloping Shoulders", "Square Shoulders", "Stooped", "Erect", 
  "Prominent Chest", "Prominent Seat", "Sway Back", "Head Forward",
  "Low Right Shoulder", "Low Left Shoulder", "Full Bicep", "Thin Bicep"
];

interface MeasurementEntry {
  id: number;
  customer: string;
  garment: string;
  details: string;
}

// ── MEASUREMENT CONFIGURATION ──
const UPPER_GARMENTS = ['Shirt', 'Polo', 'Long Sleeve', 'Short Sleeve', 'Sando'];
const LOWER_GARMENTS = ['Pants', 'Short Pants', 'Shorts'];
const STANDARD_SIZES = ['Custom', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];

const UPPER_FIELDS_CONFIG: Record<string, string[]> = {
  'Long Sleeve': ['Neck', 'Shoulder', 'Chest', 'Waist', 'Length', 'Armhole', 'Sleeve Length', 'Cuff'],
  'Short Sleeve': ['Neck', 'Shoulder', 'Chest', 'Waist', 'Length', 'Armhole', 'Sleeve Length'],
  'Shirt': ['Neck', 'Shoulder', 'Chest', 'Waist', 'Length', 'Armhole', 'Sleeve Length'],
  'Polo': ['Neck', 'Shoulder', 'Chest', 'Waist', 'Length', 'Armhole', 'Sleeve Length'],
  'Sando': ['Neck', 'Shoulder', 'Chest', 'Waist', 'Length', 'Armhole']
};

const LOWER_FIELDS_CONFIG: Record<string, string[]> = {
  'Pants': ['Waist', 'Hip', 'Thigh', 'Rise', 'Inseam', 'Outseam', 'Leg Opening'],
  'Short Pants': ['Waist', 'Hip', 'Thigh', 'Rise', 'Outseam', 'Leg Opening'],
  'Shorts': ['Waist', 'Hip', 'Thigh', 'Rise', 'Outseam', 'Leg Opening']
};

const MOCK_SIZE_CHART: Record<string, Record<string, Record<string, string>>> = {
  'Upper Wear': {
    'XS': { Neck: '13', Shoulder: '15', Chest: '34', Waist: '28', Length: '25', Armhole: '17', 'Sleeve Length': '23', Cuff: '7.5' },
    'S': { Neck: '14', Shoulder: '16', Chest: '36', Waist: '30', Length: '26', Armhole: '18', 'Sleeve Length': '24', Cuff: '8' },
    'M': { Neck: '15', Shoulder: '17', Chest: '38', Waist: '32', Length: '27', Armhole: '19', 'Sleeve Length': '25', Cuff: '8.5' },
    'L': { Neck: '16', Shoulder: '18', Chest: '40', Waist: '34', Length: '28', Armhole: '20', 'Sleeve Length': '26', Cuff: '9' },
    'XL': { Neck: '17', Shoulder: '19', Chest: '42', Waist: '36', Length: '29', Armhole: '21', 'Sleeve Length': '26.5', Cuff: '9.5' },
    'XXL': { Neck: '18', Shoulder: '20', Chest: '44', Waist: '38', Length: '30', Armhole: '22', 'Sleeve Length': '27', Cuff: '10' },
  },
  'Lower Wear': {
    'XS': { Waist: '28', Hip: '34', Thigh: '21', Rise: '9.5', Inseam: '29', Outseam: '39', 'Leg Opening': '13' },
    'S': { Waist: '30', Hip: '36', Thigh: '22', Rise: '10', Inseam: '30', Outseam: '40', 'Leg Opening': '14' },
    'M': { Waist: '32', Hip: '38', Thigh: '23', Rise: '10.5', Inseam: '31', Outseam: '41', 'Leg Opening': '15' },
    'L': { Waist: '34', Hip: '40', Thigh: '24', Rise: '11', Inseam: '32', Outseam: '42', 'Leg Opening': '16' },
    'XL': { Waist: '36', Hip: '42', Thigh: '25', Rise: '11.5', Inseam: '33', Outseam: '43', 'Leg Opening': '17' },
    'XXL': { Waist: '38', Hip: '44', Thigh: '26', Rise: '12', Inseam: '34', Outseam: '44', 'Leg Opening': '18' },
  }
};

export default function CustomersPage() {
  const router = useRouter();
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  type ProfileTab = 'overview' | 'measurements' | 'orders' | 'appointments' | 'style' | 'fabrics' | 'payments';
  const [profileTab, setProfileTab] = useState<ProfileTab>('overview');
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [isAddMeasurementModalOpen, setIsAddMeasurementModalOpen] = useState(false);
  const [isAddAppointmentModalOpen, setIsAddAppointmentModalOpen] = useState(false);
  const [selectedEditCustomer, setSelectedEditCustomer] = useState<{id: string, name: string, email: string, phone: string} | null>(null);
  
  // Measurement Modal State
  const [measCategory, setMeasCategory] = useState<'Upper Wear' | 'Lower Wear' | 'Custom'>('Upper Wear');
  const [measGarmentType, setMeasGarmentType] = useState('Polo');
  const [measVersionName, setMeasVersionName] = useState('');
  const [measFitType, setMeasFitType] = useState<'Slim' | 'Regular' | 'Loose'>('Regular');
  const [measStandardSize, setMeasStandardSize] = useState('Custom');
  const [measFields, setMeasFields] = useState<Record<string, string>>({});
  const [measFractions, setMeasFractions] = useState<Record<string, string>>({});

  // Style Preferences editing
  const [isEditingStyle, setIsEditingStyle] = useState(false);
  const [tempStyleNote, setTempStyleNote] = useState('');

  const handleCategoryChange = (cat: 'Upper Wear' | 'Lower Wear' | 'Custom') => {
    setMeasCategory(cat);
    setMeasFields({});
    setMeasFractions({});
    if (cat === 'Upper Wear') setMeasGarmentType('Polo');
    else if (cat === 'Lower Wear') setMeasGarmentType('Pants');
    else setMeasGarmentType('Custom');
    setMeasStandardSize('Custom');
  };

  const handleGarmentTypeChange = (type: string) => {
    setMeasGarmentType(type);
    setMeasFields({});
    setMeasFractions({});
    setMeasStandardSize('Custom');
  };

  const handleStandardSizeChange = (size: string) => {
    setMeasStandardSize(size);
    if (size !== 'Custom' && MOCK_SIZE_CHART[measCategory]?.[size]) {
      const chartValues = MOCK_SIZE_CHART[measCategory][size];
      setMeasFields(chartValues);
      setMeasFractions({}); // Clear fractions when applying standard size
    } else {
      setMeasFields({});
    }
  };

  const currentRequiredFields = useMemo(() => {
    if (measCategory === 'Upper Wear') return UPPER_FIELDS_CONFIG[measGarmentType] || [];
    if (measCategory === 'Lower Wear') return LOWER_FIELDS_CONFIG[measGarmentType] || [];
    return [];
  }, [measCategory, measGarmentType]);

  // ── MOCK DATA (NORMALIZED SCHEMA) ──

  const { 
    customers: customersData, 
    measurementProfiles: measurementData, 
    orders: ordersData, 
    appointments: appointmentsData, 
    payments: paymentsData,
    updateCustomer
  } = useERPStore();

  const staffData = [
    { id: "STF-001", name: "Joshua Arabejo", role: "Admin" },
    { id: "STF-002", name: "Elena Rostova", role: "Tailor" }
  ];

  // Helper functions
  const getStaffName = (id: string) => staffData.find(s => s.id === id)?.name || 'Unknown';

  const getOrderStatusColor = (status: string) => {
    switch(status) {
      case 'Draft': return 'bg-slate-50 text-slate-600 border-slate-200';
      case 'Confirmed': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'In Production': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'For Fitting': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'For Pickup': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Cancelled': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-50 text-slate-500 border-slate-200';
    }
  };

  const getAppointmentStatusColor = (status: string) => {
    switch(status) {
      case 'Scheduled': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Confirmed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Completed': return 'bg-slate-50 text-slate-700 border-slate-200';
      case 'Cancelled': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'No Show': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-slate-50 text-slate-500 border-slate-200';
    }
  };

  const getPaymentStatus = (balance: number, total: number) => {
    if (balance === total) return { label: 'Unpaid', color: 'bg-rose-50 text-rose-700 border-rose-200' };
    if (balance === 0) return { label: 'Full', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    return { label: 'Partial', color: 'bg-amber-50 text-amber-700 border-amber-200' };
  };

  // Filtered Data globally
  const filteredCustomers = useMemo(() => {
    return customersData.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
    );
  }, [customersData, searchQuery]);

  const calculateVariance = (current?: number, previous?: number) => {
    if (current === undefined || previous === undefined) return null;
    const diff = current - previous;
    const percent = (diff / previous) * 100;
    return { diff, percent };
  };

  const fieldToKey = (field: string) => field.toLowerCase().replace(/\s+/g, '_') as keyof MeasurementProfile;

  const handleSaveStyle = () => {
    if (!selectedCustomer) return;
    updateCustomer(selectedCustomer.id, { style_preferences: tempStyleNote });
    setIsEditingStyle(false);
  };

  const togglePostureTag = (tag: string) => {
    if (!selectedCustomer) return;
    const currentTags = selectedCustomer.posture_tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    
    updateCustomer(selectedCustomer.id, { posture_tags: newTags });
  };

  // Handle Quick Actions
  const handleQuickAction = (e: React.MouseEvent, customerId: string, action: 'order' | 'measurement' | 'appointment') => {
    e.stopPropagation();
    setSelectedCustomerId(customerId);
    if (action === 'order') router.push('/owner/orders/new');
    if (action === 'measurement') setIsAddMeasurementModalOpen(true);
    if (action === 'appointment') setIsAddAppointmentModalOpen(true);
  };

  // Profile Specific Data
  const selectedCustomer = selectedCustomerId ? customersData.find(c => c.id === selectedCustomerId) : null;
  const profileMeasurements = measurementData.filter(m => m.customer_id === selectedCustomerId);
  const profileOrders = ordersData.filter(o => o.customer_id === selectedCustomerId);
  const profileAppointments = appointmentsData.filter(a => a.customer === selectedCustomer?.name || a.email === selectedCustomer?.email);
  // Get payments for this customer's orders
  const profileOrderIds = profileOrders.map(o => o.id);
  const profilePayments = paymentsData.filter(p => profileOrderIds.includes(p.order_id));

  const resetModals = () => {
    setIsAddCustomerModalOpen(false);
    setIsAddMeasurementModalOpen(false);
    setIsAddAppointmentModalOpen(false);
    setSelectedEditCustomer(null);
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto w-full relative">
      {!selectedCustomerId ? (
        // ── DIRECTORY VIEW ──
        <>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-[28px] font-black text-slate-900 tracking-tight leading-none">Customers</h1>
              <p className="text-[14px] text-slate-500 font-medium mt-1">Manage your customer database and measurement profiles.</p>
            </div>
            <button onClick={() => setIsAddCustomerModalOpen(true)} className="flex items-center gap-2 bg-slate-900 text-white h-10 px-5 rounded-lg text-[13px] font-semibold hover:bg-slate-800 transition-colors shadow-sm">
              <Plus size={16} /> New Customer
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-8">
            <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative group flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search customers..." 
                  className="h-10 w-full pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium outline-none focus:bg-white focus:border-slate-900 transition-all"
                />
              </div>

              <div className="flex items-center gap-2">
                <button className="h-10 px-4 bg-white border border-slate-200 rounded-xl flex items-center gap-2 text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-all">
                  <Filter size={16} /> Status
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400">
                    <th className="py-4 px-6 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest">Name</th>
                    <th className="py-4 px-6 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest">Contact Info</th>
                    <th className="py-4 px-6 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest">Status</th>
                    <th className="py-4 px-6 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest text-right">Quick Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCustomers.length > 0 ? filteredCustomers.map((c) => (
                    <tr key={c.id} onClick={() => setSelectedCustomerId(c.id)} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900">{c.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">{c.id}</div>
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        <div className="flex flex-col gap-1">
                          <span className="flex items-center gap-2 text-[12px]"><Mail size={12} className="text-slate-400"/> {c.email}</span>
                          <span className="flex items-center gap-2 text-[12px]"><Phone size={12} className="text-slate-400"/> {c.phone}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border ${c.is_active !== false ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                          {c.is_active !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={(e) => { e.stopPropagation(); setSelectedCustomerId(c.id); }} className="w-8 h-8 rounded-md border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-900 hover:text-white transition-all shadow-sm" title="View Profile">
                            <Eye size={14}/>
                          </button>
                          <div className="w-px h-4 bg-slate-200 mx-1"></div>
                          <button onClick={(e) => handleQuickAction(e, c.id, 'order')} className="w-8 h-8 rounded-md border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm" title="New Order">
                            <ShoppingCart size={14}/>
                          </button>
                          <button onClick={(e) => handleQuickAction(e, c.id, 'measurement')} className="w-8 h-8 rounded-md border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm" title="Add Measurement">
                            <Ruler size={14}/>
                          </button>
                          <button onClick={(e) => handleQuickAction(e, c.id, 'appointment')} className="w-8 h-8 rounded-md border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm" title="Schedule Appointment">
                            <Calendar size={14}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-slate-500">No customers match your search.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
               <div className="text-[12px] font-medium text-slate-500">Showing {filteredCustomers.length} customers</div>
            </div>
          </div>
        </>
      ) : selectedCustomer ? (
        // ── CUSTOMER PROFILE VIEW ──
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <button onClick={() => { setSelectedCustomerId(null); setProfileTab('overview'); }} className="mb-6 flex items-center gap-2 text-[13px] font-bold text-slate-500 hover:text-slate-900 transition-colors w-max">
            <ArrowLeft size={16} /> Back to Directory
          </button>
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-[32px] font-bold text-slate-900 tracking-tight leading-tight">{selectedCustomer.name}</h1>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border ${selectedCustomer.is_active !== false ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                  {selectedCustomer.is_active !== false ? 'Active' : 'Inactive'}
                </span>
                <button onClick={() => setSelectedEditCustomer({id: selectedCustomer.id, name: selectedCustomer.name, email: selectedCustomer.email, phone: selectedCustomer.phone})} className="ml-2 w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors" title="Edit Profile Info">
                   <Edit2 size={14}/>
                </button>
              </div>
              <div className="flex items-center gap-6 mt-3">
                <span className="flex items-center gap-2 text-[14px] text-slate-600 font-medium"><Mail size={16} className="text-slate-400"/> {selectedCustomer.email}</span>
                <span className="flex items-center gap-2 text-[14px] text-slate-600 font-medium"><Phone size={16} className="text-slate-400"/> {selectedCustomer.phone}</span>
                <span className="flex items-center gap-2 text-[14px] text-slate-600 font-medium"><Users size={16} className="text-slate-400"/> {selectedCustomer.id}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button onClick={() => setIsAddMeasurementModalOpen(true)} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 h-10 px-4 rounded-lg text-[13px] font-bold hover:bg-slate-50 transition-all shadow-sm">
                <Ruler size={16} /> Add Measurement
              </button>
              <button onClick={() => setIsAddAppointmentModalOpen(true)} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 h-10 px-4 rounded-lg text-[13px] font-bold hover:bg-slate-50 transition-all shadow-sm">
                <Calendar size={16} /> Schedule Fitting
              </button>
              <button onClick={() => router.push('/owner/orders/new')} className="flex items-center gap-2 bg-slate-900 text-white h-10 px-5 rounded-lg text-[13px] font-semibold hover:bg-slate-800 transition-colors shadow-sm">
                <Plus size={16} /> New Order
              </button>
            </div>
          </div>

          {/* Secondary Navigation */}
          <div className="flex border-b border-slate-200 mb-8 gap-8 overflow-x-auto no-scrollbar">
            {([
              { id: 'overview', name: 'Overview' },
              { id: 'orders', name: 'Orders', count: profileOrders.length },
              { id: 'measurements', name: 'Measurements', count: profileMeasurements.length },
              { id: 'style', name: 'Style & Fit' },
              { id: 'fabrics', name: 'Fabric Vault', icon: <ImageIcon size={14} /> },
              { id: 'appointments', name: 'Appointments', count: profileAppointments.length },
              { id: 'payments', name: 'Payments', count: profilePayments.length },
            ] as { id: ProfileTab, name: string, count?: number, icon?: React.ReactNode }[]).map(tab => (
              <button 
                key={tab.id}
                onClick={() => setProfileTab(tab.id)}
                className={`pb-4 text-[14px] font-bold transition-all relative whitespace-nowrap flex items-center gap-2 ${profileTab === tab.id ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {tab.icon} {tab.name}
                {tab.count !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${profileTab === tab.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'}`}>{tab.count}</span>
                )}
                {profileTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-slate-900 rounded-t-full"></div>}
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[400px]">
            {profileTab === 'overview' && (
              <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50/50 min-h-[400px]">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-max">
                  <div className="text-[13px] font-bold text-slate-500 uppercase mb-4 flex items-center gap-2"><ShoppingCart size={16}/> Order Summary</div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-black text-slate-900">{profileOrders.length}</span>
                    <span className="text-slate-500 text-[14px] font-medium">total orders</span>
                  </div>
                  <div className="text-[13px] text-slate-600 font-medium">Active: {profileOrders.filter(o => !['Completed', 'Cancelled'].includes(o.status)).length}</div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-max">
                  <div className="text-[13px] font-bold text-slate-500 uppercase mb-4 flex items-center gap-2"><Receipt size={16}/> Financials</div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-black text-slate-900">₱{profileOrders.reduce((sum, o) => sum + (o.totalValue || 0), 0).toLocaleString()}</span>
                    <span className="text-slate-500 text-[14px] font-medium">LTV</span>
                  </div>
                  <div className="text-[13px] text-amber-600 font-bold">Outstanding Balance: ₱{profileOrders.reduce((sum, o) => sum + (o.balance || 0), 0).toLocaleString()}</div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-max">
                  <div className="text-[13px] font-bold text-slate-500 uppercase mb-4 flex items-center gap-2"><Clock size={16}/> Recent Activity</div>
                  <div className="space-y-4">
                    {profileAppointments.slice(0,2).map(a => (
                      <div key={a.id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0"><Calendar size={14} className="text-slate-500"/></div>
                        <div>
                          <div className="text-[13px] font-bold text-slate-900">{a.type}</div>
                          <div className="text-[11px] text-slate-500">{a.startTime}</div>
                        </div>
                      </div>
                    ))}
                    {profileAppointments.length === 0 && (
                       <div className="text-[12px] text-slate-500">No recent activity.</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {profileTab === 'orders' && (
              <table className="w-full text-left text-[13px]">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 font-black uppercase text-slate-400 tracking-widest text-[11px]">Order Details</th>
                    <th className="px-6 py-4 font-black uppercase text-slate-400 tracking-widest text-[11px]">Garment / Fabric</th>
                    <th className="px-6 py-4 font-black uppercase text-slate-400 tracking-widest text-[11px]">Financials</th>
                    <th className="px-6 py-4 font-black uppercase text-slate-400 tracking-widest text-[11px]">Status</th>
                    <th className="px-6 py-4 font-black uppercase text-slate-400 tracking-widest text-[11px] text-right">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {profileOrders.map((o) => {
                    const payStatus = getPaymentStatus(o.balance, o.totalValue);
                    return (
                      <tr key={o.id} className="hover:bg-slate-50 group">
                        <td className="px-6 py-4">
                          <div className="font-mono font-bold text-slate-900">{o.id}</div>
                          <div className="text-[11px] text-slate-500 font-medium">Assigned: {getStaffName(o.assigned_tailor_id)}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                              {o.swatch_images && o.swatch_images.length > 0 ? (
                                <img src={o.swatch_images[0]} alt="Swatch" className="w-full h-full object-cover" />
                              ) : (
                                <ImageIcon size={18} className="text-slate-300" />
                              )}
                            </div>
                            <div>
                              <div className="text-slate-900 font-bold">{o.garment || 'Custom'}</div>
                              <div className="text-[11px] text-slate-500 font-medium">{o.fabric_name || 'No Fabric Assigned'} {o.fabric_width ? `(${o.fabric_width}&quot; w)` : ''}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900">₱{o.totalValue?.toLocaleString() || '0'}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${payStatus.color}`}>{payStatus.label}</span>
                            <span className="text-[11px] font-medium text-slate-500">Bal: ₱{o.balance?.toLocaleString() || '0'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border ${getOrderStatusColor(o.status)}`}>{o.status}</span>
                        </td>
                        <td className="px-6 py-4 text-right text-slate-500 font-medium">{o.dueDate}</td>
                      </tr>
                    )
                  })}
                  {profileOrders.length === 0 && (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">No orders found for this customer.</td></tr>
                  )}
                </tbody>
              </table>
            )}

            {profileTab === 'measurements' && (
              <table className="w-full text-left text-[13px]">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 font-black uppercase text-slate-400 tracking-widest text-[11px]">Version ID</th>
                    <th className="px-6 py-4 font-black uppercase text-slate-400 tracking-widest text-[11px]">Profile / Garment</th>
                    <th className="px-6 py-4 font-black uppercase text-slate-400 tracking-widest text-[11px]">Key Metrics</th>
                    <th className="px-6 py-4 font-black uppercase text-slate-400 tracking-widest text-[11px]">Figuration</th>
                    <th className="px-6 py-4 font-black uppercase text-slate-400 tracking-widest text-[11px] text-right">Date Taken</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {profileMeasurements.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-mono font-bold text-slate-900">{m.id}</td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{m.version_name || `${m.id} Profile`}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                           <span className="text-[11px] text-slate-500 font-medium">Measurement</span>
                           <span className={`px-1.5 py-0.5 rounded text-[10px] font-black uppercase border ${m.fit_type === 'Slim' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : m.fit_type === 'Loose' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                             {m.fit_type || 'Regular'} Fit
                           </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        <div className="flex flex-col gap-1">
                          <div>Neck: {m.neck || '—'} | Chest: {m.chest || '—'} | Waist: {m.waist || '—'}</div>
                          {profileMeasurements.length > 1 && profileMeasurements.indexOf(m) < profileMeasurements.length - 1 && (
                            <div className="flex items-center gap-2 text-[10px] font-bold">
                              <TrendingUp size={10} className="text-slate-400" />
                              <span className="text-slate-400 italic">Trend from previous: </span>
                              {['waist', 'chest'].map(field => {
                                const prev = profileMeasurements[profileMeasurements.indexOf(m) + 1] as MeasurementProfile;
                                const varData = calculateVariance(m[field as keyof MeasurementProfile] as number, prev[field as keyof MeasurementProfile] as number);
                                if (!varData || varData.diff === 0) return null;
                                return (
                                  <span key={field} className={varData.diff > 0 ? 'text-rose-500' : 'text-emerald-500'}>
                                    {field}: {varData.diff > 0 ? '+' : ''}{varData.diff}&quot;
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-[120px]">
                           {selectedCustomer.posture_tags && selectedCustomer.posture_tags.length > 0 ? (
                             selectedCustomer.posture_tags.map(tag => (
                               <span key={tag} className="px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-[9px] font-bold text-slate-500 uppercase">{tag}</span>
                             ))
                           ) : (
                             <span className="text-[10px] text-slate-400 italic">Standard</span>
                           )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-slate-500 font-medium">{new Date(m.recorded_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {profileMeasurements.length === 0 && (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">No measurement profiles found.</td></tr>
                  )}
                </tbody>
              </table>
            )}

            {profileTab === 'style' && selectedCustomer && (
              <div className="p-8 space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* Style Preferences Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-slate-900 font-bold">
                      <Layout size={18} className="text-indigo-600" />
                      <h3>Style Preferences</h3>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 relative group">
                      {isEditingStyle ? (
                        <div className="space-y-3">
                          <textarea 
                            value={tempStyleNote}
                            onChange={(e) => setTempStyleNote(e.target.value)}
                            className="w-full h-32 p-3 bg-white border border-slate-200 rounded-xl text-[14px] outline-none focus:border-indigo-600 transition-all resize-none"
                            placeholder="Describe fit preferences, lapel styles, etc..."
                          />
                          <div className="flex gap-2">
                            <button onClick={handleSaveStyle} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-[12px] font-bold hover:bg-indigo-700 transition-all">Save</button>
                            <button onClick={() => setIsEditingStyle(false)} className="px-4 py-2 bg-white border border-slate-200 text-slate-500 rounded-lg text-[12px] font-bold hover:bg-slate-50 transition-all">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-[14px] text-slate-600 leading-relaxed italic">
                            {selectedCustomer.style_preferences || "No style preferences recorded. Add notes about lapel widths, pocket styles, or fit preferences here."}
                          </p>
                          <button 
                            onClick={() => { setIsEditingStyle(true); setTempStyleNote(selectedCustomer.style_preferences || ''); }}
                            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-white rounded-lg border border-slate-200 text-slate-400 hover:text-slate-900 shadow-sm"
                          >
                            <Edit2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-slate-900 font-bold">
                      <Target size={18} className="text-indigo-600" />
                      <h3>Posture & Figuration</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['Sloping Shoulders', 'Erect Posture', 'Prominent Chest', 'High Right Shoulder', 'Forward Neck', 'Flat Seat'].map(tag => {
                        const isActive = selectedCustomer.posture_tags?.includes(tag);
                        return (
                          <button 
                            key={tag}
                            onClick={() => togglePostureTag(tag)}
                            className={`px-4 py-2 rounded-xl text-[12px] font-bold transition-all border ${isActive ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400'}`}
                          >
                            {tag}
                          </button>
                        );
                      })}
                      <button className="px-4 py-2 rounded-xl text-[12px] font-bold border border-dashed border-slate-300 text-slate-400 hover:border-slate-900 hover:text-slate-900 transition-all">
                        + Add Tag
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed mt-2">
                      Figuration tags help the cutter adjust the pattern for the customers unique body posture beyond standard measurements.
                    </p>
                  </div>
                </div>

                {/* Swatch Library */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-900 font-bold">
                      <ImageIcon size={18} className="text-indigo-600" />
                      <h3>Historical Fabric Usage</h3>
                    </div>
                    <div className="text-[11px] text-slate-500 italic font-medium">Auto-synced from Job Orders</div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {profileOrders.filter(o => o.swatch_images && o.swatch_images.length > 0).map(o => (
                      <div key={o.id} className="aspect-square bg-white rounded-2xl border border-slate-200 overflow-hidden group relative hover:ring-2 hover:ring-indigo-500 transition-all cursor-pointer shadow-sm">
                         <img src={o.swatch_images![0]} alt={o.fabric_name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                         <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                            <div className="text-[9px] font-black text-white truncate">{o.fabric_name}</div>
                            <div className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter">{o.id}</div>
                         </div>
                      </div>
                    ))}
                    {profileOrders.filter(o => o.swatch_images && o.swatch_images.length > 0).length === 0 && (
                      <div className="col-span-full py-8 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                         <div className="text-slate-400 text-[12px] font-medium italic">No fabric swatches recorded in order history.</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {profileTab === 'fabrics' && (
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-[18px] font-black text-slate-900 tracking-tight">Fabric Vault</h3>
                    <p className="text-[13px] text-slate-500 mt-1">Archive of all swatches used in previous orders for {selectedCustomer.name}.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {profileOrders.filter(o => o.fabric_name).map(o => (
                    <div key={o.id} className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                      <div className="aspect-[4/5] bg-slate-100 relative">
                        {o.swatch_images && o.swatch_images.length > 0 ? (
                          <img src={o.swatch_images[0]} alt={o.fabric_name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                            <ImageIcon size={32} />
                            <span className="text-[10px] font-bold mt-2 uppercase tracking-widest">No Swatch</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                          <button onClick={() => setProfileTab('orders')} className="px-3 py-1.5 bg-white text-slate-900 rounded-lg text-[11px] font-black uppercase">View Order</button>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="text-[13px] font-black text-slate-900 truncate">{o.fabric_name}</div>
                        <div className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-tight">{o.garment} • {o.id}</div>
                      </div>
                    </div>
                  ))}
                  {profileOrders.filter(o => o.fabric_name).length === 0 && (
                    <div className="col-span-full py-16 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                      <ImageIcon size={48} className="mx-auto text-slate-300 mb-4" />
                      <p className="text-[14px] text-slate-500 font-medium">No swatches found. Fabrics are archived here when orders are created.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            {profileTab === 'appointments' && (
              <table className="w-full text-left text-[13px]">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 font-black uppercase text-slate-400 tracking-widest text-[11px]">Schedule</th>
                    <th className="px-6 py-4 font-black uppercase text-slate-400 tracking-widest text-[11px]">Type / Notes</th>
                    <th className="px-6 py-4 font-black uppercase text-slate-400 tracking-widest text-[11px]">Staff</th>
                    <th className="px-6 py-4 font-black uppercase text-slate-400 tracking-widest text-[11px]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {profileAppointments.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{new Date(a.date).toLocaleDateString()}</div>
                        <div className="text-[11px] text-slate-500 font-bold uppercase tracking-tighter mt-0.5">{a.startTime} ({a.duration} min)</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{a.type}</div>
                        <div className="text-[12px] text-slate-500 mt-0.5">{a.reason}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-medium flex items-center gap-2">
                        <Users size={14} className="text-slate-400" /> {a.staff}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border ${getAppointmentStatusColor(a.status)}`}>{a.status}</span>
                      </td>
                    </tr>
                  ))}
                  {profileAppointments.length === 0 && (
                    <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-500">No appointments scheduled.</td></tr>
                  )}
                </tbody>
              </table>
            )}

            {profileTab === 'payments' && (
              <table className="w-full text-left text-[13px]">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 font-black uppercase text-slate-400 tracking-widest text-[11px]">Payment ID</th>
                    <th className="px-6 py-4 font-black uppercase text-slate-400 tracking-widest text-[11px]">Order Reference</th>
                    <th className="px-6 py-4 font-black uppercase text-slate-400 tracking-widest text-[11px]">Type</th>
                    <th className="px-6 py-4 font-black uppercase text-slate-400 tracking-widest text-[11px]">Amount</th>
                    <th className="px-6 py-4 font-black uppercase text-slate-400 tracking-widest text-[11px] text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {profilePayments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-mono font-bold text-slate-900">{p.id}</td>
                      <td className="px-6 py-4 font-mono font-bold text-indigo-600 hover:underline cursor-pointer">{p.order_id}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border border-slate-200`}>{p.payment_method}</span>
                      </td>
                      <td className="px-6 py-4 font-black text-slate-900">₱{p.amount_paid?.toLocaleString() || '0'}</td>
                      <td className="px-6 py-4 text-right text-slate-500 font-medium">{new Date(p.paid_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {profilePayments.length === 0 && (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">No payments recorded.</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : null}

      {/* ── MODALS ── */}

      {/* Add Customer Modal */}
      {isAddCustomerModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-[500px] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
              <div>
                <h2 className="text-[18px] font-bold text-slate-900">Add New Customer</h2>
                <p className="text-[13px] text-slate-500">Register a new client profile.</p>
              </div>
              <button onClick={resetModals} className="text-slate-400 hover:text-slate-900"><X size={20}/></button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">First Name</label>
                <input type="text" placeholder="e.g. John" className="w-full h-10 border border-slate-300 rounded-md px-3 text-[13px] outline-none focus:border-slate-500"/>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Last Name</label>
                <input type="text" placeholder="e.g. Doe" className="w-full h-10 border border-slate-300 rounded-md px-3 text-[13px] outline-none focus:border-slate-500"/>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Email Address</label>
                <input type="email" placeholder="john@example.com" className="w-full h-10 border border-slate-300 rounded-md px-3 text-[13px] outline-none focus:border-slate-500"/>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Phone Number</label>
                <input type="text" placeholder="+63 900 000 0000" className="w-full h-10 border border-slate-300 rounded-md px-3 text-[13px] outline-none focus:border-slate-500"/>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button onClick={resetModals} className="h-9 px-4 rounded-md border border-slate-300 text-slate-700 font-bold text-[13px] hover:bg-slate-100 bg-white">Cancel</button>
              <button onClick={resetModals} className="h-9 px-4 rounded-md bg-slate-900 text-white font-bold text-[13px] hover:bg-slate-800">Save Customer</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Measurement Version Modal (Context-Locked & Dynamic) */}
      {isAddMeasurementModalOpen && selectedCustomer && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-[800px] max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
              <div className="max-w-[80%]">
                <h2 className="text-[20px] font-bold text-slate-900 tracking-tight">New Measurement Session</h2>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-2">
                  <p className="text-[13px] text-slate-500">Record body dimensions for <strong>{selectedCustomer.name}</strong></p>
                  {selectedCustomer.posture_tags && selectedCustomer.posture_tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {selectedCustomer.posture_tags.slice(0, 3).map(tag => (
                        <div key={tag} className="flex items-center gap-1.5 px-2 py-0.5 bg-amber-50 border border-amber-200 rounded text-[10px] font-black text-amber-700 uppercase tracking-tighter">
                          <Target size={10} /> {tag}
                        </div>
                      ))}
                      {selectedCustomer.posture_tags.length > 3 && (
                        <div className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-black text-slate-500 uppercase">
                          +{selectedCustomer.posture_tags.length - 3} More
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <button onClick={resetModals} className="text-slate-400 hover:text-slate-900 transition-colors pt-1"><X size={20}/></button>
            </div>
            
            <div className="p-8 overflow-y-auto">
              {/* Context Fields */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="col-span-2">
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Measurement Version Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Polo - Regular Fit - v2" 
                    value={measVersionName}
                    onChange={(e) => setMeasVersionName(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-slate-300 text-[13px] outline-none focus:border-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Fit Silhouette</label>
                  <select 
                    value={measFitType}
                    onChange={(e) => setMeasFitType(e.target.value as 'Slim' | 'Regular' | 'Loose')}
                    className="w-full h-10 px-3 rounded-md border border-slate-300 text-[13px] font-bold outline-none focus:border-slate-500"
                  >
                    <option value="Regular">Regular Fit</option>
                    <option value="Slim">Slim Fit</option>
                    <option value="Loose">Relaxed Fit</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Category</label>
                  <select 
                    value={measCategory}
                    onChange={(e) => handleCategoryChange(e.target.value as 'Upper Wear' | 'Lower Wear' | 'Custom')}
                    className="w-full h-10 px-3 rounded-md border border-slate-300 bg-white text-[13px] font-bold focus:bg-white focus:border-slate-500 outline-none"
                  >
                    <option value="Upper Wear">Upper Wear</option>
                    <option value="Lower Wear">Lower Wear</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Garment Type</label>
                  <select 
                    value={measGarmentType}
                    onChange={(e) => handleGarmentTypeChange(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-slate-300 bg-white text-[13px] font-bold focus:bg-white focus:border-slate-500 outline-none"
                    disabled={measCategory === 'Custom'}
                  >
                    {measCategory === 'Upper Wear' && UPPER_GARMENTS.map(g => <option key={g} value={g}>{g}</option>)}
                    {measCategory === 'Lower Wear' && LOWER_GARMENTS.map(g => <option key={g} value={g}>{g}</option>)}
                    {measCategory === 'Custom' && <option value="Custom">Custom</option>}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Standard Size</label>
                  <select 
                    value={measStandardSize}
                    onChange={(e) => handleStandardSizeChange(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-slate-300 bg-amber-50 text-[13px] font-bold focus:bg-white focus:border-slate-500 outline-none"
                    disabled={measCategory === 'Custom'}
                  >
                    {STANDARD_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Fit Type</label>
                  <select 
                    value={measFitType}
                    onChange={(e) => setMeasFitType(e.target.value as 'Slim' | 'Regular' | 'Loose')}
                    className="w-full h-10 px-3 rounded-md border border-slate-300 bg-white text-[13px] font-bold focus:bg-white focus:border-slate-500 outline-none"
                  >
                    <option value="Slim">Slim</option>
                    <option value="Regular">Regular</option>
                    <option value="Loose">Loose</option>
                  </select>
                </div>
              </div>

              {/* Figuration & Posture Selector */}
              <div className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <Target size={16} className="text-amber-600" /> Anatomical Figuration
                  </h3>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Affects Pattern Drafting</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {TAILORING_POSTURE_TAGS.map(tag => {
                    const isSelected = selectedCustomer.posture_tags?.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => togglePostureTag(tag)}
                        className={`px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-tight transition-all border ${
                          isSelected 
                            ? 'bg-amber-600 border-amber-600 text-white shadow-md shadow-amber-600/20' 
                            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-slate-400 mt-4 italic font-medium">Figuration tags provide context for the cutter to make necessary adjustments to the default block pattern.</p>
              </div>

              {/* Dynamic Measurement Grid */}
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-[13px] font-bold text-slate-900 uppercase tracking-widest">{measGarmentType} Dimensions</h3>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                {currentRequiredFields.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {currentRequiredFields.map((field) => (
                      <div key={field} className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[12px] font-bold text-slate-700">{field}</label>
                          {profileMeasurements[0] && profileMeasurements[0][fieldToKey(field)] && (
                            <span className="text-[10px] font-bold text-slate-400 italic">Last: {profileMeasurements[0][fieldToKey(field)]}&quot;</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                           <input 
                             type="number" 
                             placeholder="0" 
                             value={measFields[field] || ''}
                             onChange={(e) => setMeasFields({...measFields, [field]: e.target.value})}
                             className="w-20 h-10 text-center bg-white border border-slate-300 rounded-lg text-[14px] font-mono font-bold text-slate-900 focus:border-slate-500 outline-none" 
                           />
                           <div className="flex bg-white p-1 rounded-lg border border-slate-300 shadow-sm flex-1 justify-between">
                              {['1/8', '1/4', '1/2', '3/4'].map(frac => (
                                <button 
                                  key={frac} 
                                  onClick={() => setMeasFractions({...measFractions, [field]: measFractions[field] === frac ? '' : frac})}
                                  className={`px-2 py-1.5 rounded-md text-[11px] font-bold transition-all flex-1 ${measFractions[field] === frac ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}
                                >
                                  {frac}
                                </button>
                              ))}
                           </div>
                           <span className="text-[12px] font-bold text-slate-400 w-4">in</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500 text-[13px]">
                     {measCategory === 'Custom' ? 'Custom garment types do not have predefined fields yet.' : 'No fields configured for this garment type.'}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="px-8 py-5 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button onClick={resetModals} className="h-10 px-5 rounded-lg border border-slate-300 text-slate-700 font-bold text-[13px] hover:bg-slate-100 bg-white">Cancel</button>
              <button onClick={resetModals} className="h-10 px-6 rounded-lg bg-slate-900 text-white font-bold text-[13px] hover:bg-slate-800 shadow-lg">Save New Version</button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Appointment Modal */}
      {isAddAppointmentModalOpen && selectedCustomer && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-[500px] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
              <div>
                <h2 className="text-[18px] font-bold text-slate-900">Schedule Appointment</h2>
                <p className="text-[13px] text-slate-500">Book a fitting or consultation.</p>
              </div>
              <button onClick={resetModals} className="text-slate-400 hover:text-slate-900"><X size={20}/></button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Customer (Locked)</label>
                <div className="w-full h-10 border border-slate-200 bg-slate-50 rounded-md px-3 text-[13px] font-bold text-slate-500 flex items-center cursor-not-allowed">
                  {selectedCustomer.name}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Date</label>
                  <input type="date" className="w-full h-10 border border-slate-300 rounded-md px-3 text-[13px] outline-none focus:border-slate-500"/>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Time</label>
                  <input type="time" className="w-full h-10 border border-slate-300 rounded-md px-3 text-[13px] outline-none focus:border-slate-500"/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Type</label>
                  <select className="w-full h-10 border border-slate-300 rounded-md px-3 text-[13px] font-bold outline-none focus:border-slate-500">
                    <option>Consultation</option>
                    <option>1st Fitting</option>
                    <option>Final Fitting</option>
                    <option>Pickup</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Assigned Staff</label>
                  <select className="w-full h-10 border border-slate-300 rounded-md px-3 text-[13px] font-bold outline-none focus:border-slate-500">
                    <option>Admin User</option>
                    <option>Elena Rostova</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Notes</label>
                <input type="text" placeholder="Any special requests..." className="w-full h-10 border border-slate-300 rounded-md px-3 text-[13px] outline-none focus:border-slate-500"/>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button onClick={resetModals} className="h-9 px-4 rounded-md border border-slate-300 text-slate-700 font-bold text-[13px] hover:bg-slate-100 bg-white">Cancel</button>
              <button onClick={resetModals} className="h-9 px-4 rounded-md bg-slate-900 text-white font-bold text-[13px] hover:bg-slate-800">Confirm Booking</button>
            </div>
          </div>
        </div>
      )}


      {/* Edit Customer Modal */}
      {selectedEditCustomer && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-[500px] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
              <div>
                <h2 className="text-[18px] font-bold text-slate-900">Edit Customer Information</h2>
                <p className="text-[13px] text-slate-500">Update client profile details.</p>
              </div>
              <button onClick={resetModals} className="text-slate-400 hover:text-slate-900"><X size={20}/></button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Full Name</label>
                <input type="text" defaultValue={selectedEditCustomer.name} className="w-full h-10 border border-slate-300 rounded-md px-3 text-[13px] outline-none focus:border-slate-500"/>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Email Address</label>
                <input type="email" defaultValue={selectedEditCustomer.email} className="w-full h-10 border border-slate-300 rounded-md px-3 text-[13px] outline-none focus:border-slate-500"/>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Phone Number</label>
                <input type="text" defaultValue={selectedEditCustomer.phone} className="w-full h-10 border border-slate-300 rounded-md px-3 text-[13px] outline-none focus:border-slate-500"/>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button onClick={resetModals} className="h-9 px-4 rounded-md border border-slate-300 text-slate-700 font-bold text-[13px] hover:bg-slate-100 bg-white">Cancel</button>
              <button onClick={resetModals} className="h-9 px-4 rounded-md bg-slate-900 text-white font-bold text-[13px] hover:bg-slate-800">Save Changes</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
