'use client';

import { useState } from 'react';
import { Search, Filter, Plus, Clock, Edit2, Trash2, X, FileText, Ruler, Phone, Mail, ShoppingCart, Users, Calendar, Settings, ChevronDown } from 'lucide-react';

interface MeasurementEntry {
  id: number;
  customer: string;
  garment: string;
  details: string;
}

export default function CustomersPage() {
  const [activeTab, setActiveTab] = useState('directory');
  const [selectedHistoryClient, setSelectedHistoryClient] = useState<string | null>(null);
  const [historyTab, setHistoryTab] = useState('orders');

  // Modals state
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [isAddMeasurementModalOpen, setIsAddMeasurementModalOpen] = useState(false);
  const [isAddAppointmentModalOpen, setIsAddAppointmentModalOpen] = useState(false);
  const [selectedEditCustomer, setSelectedEditCustomer] = useState<{name: string, email: string, phone: string} | null>(null);
  const [selectedEditMeasurement, setSelectedEditMeasurement] = useState<{customer: string, garment: string, keyMeasurements: string} | null>(null);
  const [selectedEditAppointment, setSelectedEditAppointment] = useState<{customer: string, date: string, time: string, type: string, assigned: string, notes: string} | null>(null);
  const [isSaveNewVersionModalOpen, setIsSaveNewVersionModalOpen] = useState(false);
  
  // New Measurement Version State
  const [newMeasGarment, setNewMeasGarment] = useState('Polo');
  const [newMeasCustomer, setNewMeasCustomer] = useState('');
  const [measFields, setMeasFields] = useState<Record<string, string>>({});
  const [measFractions, setMeasFractions] = useState<Record<string, string>>({});
  const [bulkMeasurements, setBulkMeasurements] = useState<MeasurementEntry[]>([]);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  const customersData = [
    { id: "CUS-8021", name: "Maria Garcia", email: "maria.garcia@email.com", phone: "+63 917 123 4567", registered: "Jan 12, 2026" },
    { id: "CUS-8020", name: "Alexander McQueen", email: "alex.mcq@email.com", phone: "+63 918 987 6543", registered: "Feb 05, 2026" },
    { id: "CUS-8019", name: "David Torres", email: "dtorres99@email.com", phone: "+63 920 555 0192", registered: "Mar 10, 2026" },
  ];

  const appointmentsData = [
    { customer: "Maria Garcia", date: "May 15, 2026", time: "10:00 AM", type: "Initial Consultation", assigned: "Admin User", notes: "Discussing wedding gown", status: "Scheduled" },
    { customer: "Elena Rostova", date: "May 16, 2026", time: "2:30 PM", type: "1st Fitting", assigned: "Maria Garcia", notes: "Bring altered bodice", status: "Confirmed" },
  ];

  const measurementData = [
    { customer: "Alexander McQueen", version: "v2.1", garment: "Bespoke Suit", keyMeasurements: "Chest: 42, Waist: 34, Inseam: 32", date: "Apr 20, 2026", status: "Active" },
    { customer: "Maria Garcia", version: "v1.0", garment: "Evening Gown", keyMeasurements: "Bust: 36, Waist: 28, Hips: 38", date: "Jan 15, 2026", status: "Archived" },
  ];

  const sampleOrders = [
    { id: "ORD-1001", name: "3-Piece Charcoal Suit", price: "₱45,000", due: "May 10, 2026", status: "In Progress" },
    { id: "ORD-0950", name: "Linen Summer Blazer", price: "₱18,000", due: "Mar 15, 2026", status: "Completed" },
  ];

  // Filtering Logic
  const filteredCustomers = customersData.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  const filteredMeasurements = measurementData.filter(m => 
    m.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.garment.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAppointments = appointmentsData.filter(a => 
    a.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.assigned.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 max-w-[1400px] mx-auto w-full relative">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[32px] font-bold text-slate-900 tracking-tight leading-tight">Customer Management</h1>
          <p className="text-[16px] text-slate-500 mt-1 font-normal leading-relaxed">Manage client profiles, measurements, and appointments.</p>
        </div>
        
        {activeTab === 'directory' && (
          <button onClick={() => setIsAddCustomerModalOpen(true)} className="flex items-center gap-2 bg-slate-900 text-white h-9 px-4 rounded-md text-[13px] font-semibold hover:bg-slate-800 transition-colors shadow-sm">
            <Plus size={16} /> Add Customer
          </button>
        )}
        {activeTab === 'measurements' && (
          <button onClick={() => setIsSaveNewVersionModalOpen(true)} className="flex items-center gap-2 bg-indigo-600 text-white h-9 px-4 rounded-md text-[13px] font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
            <Ruler size={16} /> New Measurement Version
          </button>
        )}
        {activeTab === 'appointments' && (
          <button onClick={() => setIsAddAppointmentModalOpen(true)} className="flex items-center gap-2 bg-slate-900 text-white h-9 px-4 rounded-md text-[13px] font-semibold hover:bg-slate-800 transition-colors shadow-sm">
            <Plus size={16} /> Add Appointment
          </button>
        )}
      </div>

      {/* Secondary Navigation Tabs */}
      <div className="flex flex-wrap bg-slate-100/80 p-1.5 rounded-full w-max gap-1 mb-6 border border-slate-200/50">
        {[
          { id: 'directory', name: 'Client Directory', icon: <Users size={14} /> },
          { id: 'measurements', name: 'Measurements', icon: <Ruler size={14} /> },
          { id: 'appointments', name: 'Appointments', icon: <Calendar size={14} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
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

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-8">
        {/* Integrated Search/Filter Bar */}
        <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative group flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeTab === 'directory' ? 'customers' : activeTab}...`} 
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
        
        <div className="overflow-x-auto">
          {/* TAB 1: Client Directory */}
          {activeTab === 'directory' && (
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400">
                  <th className="py-4 px-6 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest">Name</th>
                  <th className="py-4 px-6 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest">Email</th>
                  <th className="py-4 px-6 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest">Phone</th>
                  <th className="py-4 px-6 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest">Registered</th>
                  <th className="py-4 px-6 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.length > 0 ? filteredCustomers.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-900">{c.name}</div>
                    </td>
                    <td className="px-5 py-4 text-slate-600"><div className="flex items-center gap-2"><Mail size={14} className="text-slate-400"/> {c.email}</div></td>
                    <td className="px-5 py-4 text-slate-600"><div className="flex items-center gap-2"><Phone size={14} className="text-slate-400"/> {c.phone}</div></td>
                    <td className="px-5 py-4 text-slate-600">{c.registered}</td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setSelectedHistoryClient(c.name)} className="w-8 h-8 rounded-md border border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-colors" title="View History">
                          <Clock size={14}/>
                        </button>
                        <button onClick={() => setSelectedEditCustomer(c)} className="w-8 h-8 rounded-md border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-colors">
                          <Edit2 size={14}/>
                        </button>
                        <button className="w-8 h-8 rounded-md border border-slate-200 flex items-center justify-center text-slate-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-colors">
                          <Trash2 size={14}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-slate-500">No customers match your search.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {/* TAB 2: Measurements */}
          {activeTab === 'measurements' && (
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400">
                  <th className="py-4 px-6 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest">Customer</th>
                  <th className="py-4 px-6 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest">Garment</th>
                  <th className="py-4 px-6 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest">Key Measurements</th>
                  <th className="py-4 px-6 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest">Updated</th>
                  <th className="py-4 px-6 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest">Status</th>
                  <th className="py-4 px-6 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMeasurements.length > 0 ? filteredMeasurements.map((m, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-900">{m.customer}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-black bg-slate-900 text-white px-2 py-0.5 rounded uppercase tracking-tighter shadow-sm">{m.version}</span>
                        <span className="text-slate-900 font-bold">{m.garment}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-500 font-medium">{m.keyMeasurements}</td>
                    <td className="px-5 py-4 text-slate-400 font-medium">{m.date}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border ${
                        m.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                      }`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setSelectedEditMeasurement(m)} className="w-8 h-8 rounded-md border border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 transition-all">
                          <Edit2 size={14}/>
                        </button>
                        <button className="w-8 h-8 rounded-md border border-slate-200 flex items-center justify-center text-slate-500 hover:text-rose-600 hover:border-rose-100 hover:bg-rose-50 transition-all">
                          <Trash2 size={14}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-slate-500">No measurements match your search.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {/* TAB 3: Appointments */}
          {activeTab === 'appointments' && (
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400">
                  <th className="py-4 px-6 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest">Customer</th>
                  <th className="py-4 px-6 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest">Schedule</th>
                  <th className="py-4 px-6 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest">Appointment Type</th>
                  <th className="py-4 px-6 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest">Handled By</th>
                  <th className="py-4 px-6 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest">Status</th>
                  <th className="py-4 px-6 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAppointments.length > 0 ? filteredAppointments.map((a, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-900">{a.customer}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-black text-slate-900 tracking-tight">{a.date}</div>
                      <div className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter">{a.time}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-indigo-600 font-black">{a.type}</div>
                      <div className="text-[11px] text-slate-400 font-medium truncate max-w-[150px]">{a.notes}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-slate-600 font-bold">
                        <Users size={14} className="text-slate-300" /> {a.assigned}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border ${
                        a.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                      }`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setSelectedEditAppointment(a)} className="w-8 h-8 rounded-md border border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 transition-all">
                          <Edit2 size={14}/>
                        </button>
                        <button className="w-8 h-8 rounded-md border border-slate-200 flex items-center justify-center text-slate-500 hover:text-rose-600 hover:border-rose-100 hover:bg-rose-50 transition-all">
                          <Trash2 size={14}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-slate-500">No appointments match your search.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Pagination Mockup (Consistent with Orders) */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
           <div className="text-[12px] font-medium text-slate-500">Showing 1 to 8 of 42 items</div>
           <div className="flex gap-2">
              <button className="px-4 py-1.5 rounded-lg border border-slate-200 text-[12px] font-bold bg-white text-slate-400 cursor-not-allowed">Previous</button>
              <button className="px-4 py-1.5 rounded-lg border border-slate-200 text-[12px] font-bold bg-white text-slate-900 hover:bg-slate-50 transition-all shadow-sm">Next</button>
           </div>
        </div>
      </div>

      {/* History Slide-over Drawer / Modal */}
      {selectedHistoryClient && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-[800px] h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right">
            <div className="px-8 py-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h2 className="text-[20px] font-bold text-slate-900">{selectedHistoryClient} — History</h2>
                <p className="text-[13px] text-slate-500">View past orders and measurement versions.</p>
              </div>
              <button onClick={() => setSelectedHistoryClient(null)} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 shadow-sm transition-colors">
                <X size={16}/>
              </button>
            </div>
            
            <div className="flex items-center gap-6 px-8 border-b border-slate-200 pt-4">
              <button onClick={() => setHistoryTab('orders')} className={`pb-3 text-[14px] font-bold relative ${historyTab === 'orders' ? 'text-slate-900' : 'text-slate-500'}`}>
                <div className="flex items-center gap-2"><FileText size={16}/> Orders</div>
                {historyTab === 'orders' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-slate-900"></div>}
              </button>
              <button onClick={() => setHistoryTab('measurements')} className={`pb-3 text-[14px] font-bold relative ${historyTab === 'measurements' ? 'text-slate-900' : 'text-slate-500'}`}>
                <div className="flex items-center gap-2"><Ruler size={16}/> Measurements</div>
                {historyTab === 'measurements' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-slate-900"></div>}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              {historyTab === 'orders' && (
                <table className="w-full text-left text-[13px] border border-slate-200 rounded-lg overflow-hidden">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-slate-600 border-b border-slate-200">Order ID</th>
                      <th className="px-4 py-3 font-semibold text-slate-600 border-b border-slate-200">Order Name</th>
                      <th className="px-4 py-3 font-semibold text-slate-600 border-b border-slate-200">Price</th>
                      <th className="px-4 py-3 font-semibold text-slate-600 border-b border-slate-200">Due Date</th>
                      <th className="px-4 py-3 font-semibold text-slate-600 border-b border-slate-200">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleOrders.map((o, i) => (
                      <tr key={i} className="border-b border-slate-100 last:border-none hover:bg-slate-50">
                        <td className="px-4 py-3 font-mono font-bold text-slate-700">{o.id}</td>
                        <td className="px-4 py-3 font-medium text-slate-900">{o.name}</td>
                        <td className="px-4 py-3 text-slate-600">{o.price}</td>
                        <td className="px-4 py-3 text-slate-600">{o.due}</td>
                        <td className="px-4 py-3"><span className="px-2 py-1 text-[11px] font-bold uppercase border rounded-md">{o.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {historyTab === 'measurements' && (
                <table className="w-full text-left text-[13px] border border-slate-200 rounded-lg overflow-hidden">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-slate-600 border-b border-slate-200">Version</th>
                      <th className="px-4 py-3 font-semibold text-slate-600 border-b border-slate-200">Garment Type</th>
                      <th className="px-4 py-3 font-semibold text-slate-600 border-b border-slate-200">Key Measurements</th>
                      <th className="px-4 py-3 font-semibold text-slate-600 border-b border-slate-200">Date</th>
                      <th className="px-4 py-3 font-semibold text-slate-600 border-b border-slate-200">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {measurementData.filter(m => m.customer === selectedHistoryClient || m.customer === "Maria Garcia").map((m, i) => (
                      <tr key={i} className="border-b border-slate-100 last:border-none hover:bg-slate-50">
                        <td className="px-4 py-3 font-mono font-bold text-slate-700 bg-slate-100">{m.version}</td>
                        <td className="px-4 py-3 font-medium text-slate-900">{m.garment}</td>
                        <td className="px-4 py-3 text-slate-600">{m.keyMeasurements}</td>
                        <td className="px-4 py-3 text-slate-600">{m.date}</td>
                        <td className="px-4 py-3"><span className="px-2 py-1 text-[11px] font-bold uppercase border rounded-md">{m.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {isAddCustomerModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-[500px] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
              <div>
                <h2 className="text-[18px] font-bold text-slate-900">Add New Customer</h2>
                <p className="text-[13px] text-slate-500">Register a new client profile.</p>
              </div>
              <button onClick={() => setIsAddCustomerModalOpen(false)} className="text-slate-400 hover:text-slate-900"><X size={20}/></button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Full Name</label>
                <input type="text" placeholder="e.g. John Doe" className="w-full h-10 border border-slate-300 rounded-md px-3 text-[13px] outline-none focus:border-slate-500"/>
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
              <button onClick={() => setIsAddCustomerModalOpen(false)} className="h-9 px-4 rounded-md border border-slate-300 text-slate-700 font-bold text-[13px] hover:bg-slate-100 bg-white">Cancel</button>
              <button onClick={() => setIsAddCustomerModalOpen(false)} className="h-9 px-4 rounded-md bg-slate-900 text-white font-bold text-[13px] hover:bg-slate-800">Save Customer</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Measurement Modal */}
      {isAddMeasurementModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-[850px] max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="px-8 py-6 border-b border-slate-200 bg-slate-50 flex items-start justify-between shrink-0">
              <div>
                <h2 className="text-[20px] font-bold text-slate-900 tracking-tight">Save New Measurement Version</h2>
                <p className="text-[13px] text-slate-500 mt-1">Record specific body dimensions or standard sizes.</p>
              </div>
              <button onClick={() => setIsAddMeasurementModalOpen(false)} className="text-slate-400 hover:text-slate-900 transition-colors"><X size={22}/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8">
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                  <div>
                    <label className="text-[12px] font-bold text-slate-700 uppercase block mb-1.5">Customer <span className="text-rose-500">*</span></label>
                    <select 
                      value={newMeasCustomer}
                      onChange={(e) => setNewMeasCustomer(e.target.value)}
                      className="w-full h-10 border border-slate-300 rounded-md px-3 text-[13px] outline-none focus:border-slate-500 bg-white"
                    >
                      <option value="">Select Customer...</option>
                      <option>Alexander McQueen</option>
                      <option>Maria Garcia</option>
                      <option>David Torres</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[12px] font-bold text-slate-700 uppercase block mb-1.5">Garment Type <span className="text-rose-500">*</span></label>
                    <div className="flex gap-2">
                      {['Polo', 'Pants', 'Custom'].map((type) => (
                        <button 
                          key={type}
                          onClick={() => setNewMeasGarment(type)}
                          className={`flex-1 h-10 rounded-md text-[13px] font-bold border transition-all ${newMeasGarment === type ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-[12px] font-bold text-slate-700 uppercase block mb-1.5">Notes / Description (Optional)</label>
                  <textarea rows={4} placeholder="Specific notes for this measurement set..." className="w-full border border-slate-300 rounded-md p-3 text-[13px] outline-none focus:border-slate-500 h-[108px] resize-none"></textarea>
                </div>
              </div>

              {/* Dynamic Measurement Fields */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[14px] font-bold text-slate-900 uppercase tracking-wider">{newMeasGarment} — Inches</h3>
                  <div className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[11px] font-bold text-slate-500">View Prototype State</div>
                </div>

                {newMeasGarment === 'Custom' ? (
                  <div className="max-w-md">
                    <label className="text-[12px] font-bold text-slate-700 block mb-2">Standard Size <span className="text-rose-500">*</span></label>
                    <select className="w-full h-11 border border-slate-300 rounded-md px-3 text-[14px] font-medium outline-none focus:border-slate-500 bg-white">
                      <option>Small (S)</option>
                      <option>Medium (M)</option>
                      <option>Large (L)</option>
                      <option>Extra Large (XL)</option>
                      <option>XXL</option>
                    </select>
                    <p className="text-[11px] text-slate-500 mt-2 italic">Standardized measurements based on XS to XXL range.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                    {(newMeasGarment === 'Polo' ? ['Chest', 'Shoulder', 'Sleeve', 'Neck'] : ['Waist', 'Length (Outseam)', 'Inseam', 'Hips']).map((field) => (
                      <div key={field} className="flex flex-col gap-2">
                        <label className="text-[13px] font-bold text-slate-700">{field}</label>
                        <div className="flex items-center gap-2">
                          <div className="flex bg-white border border-slate-200 rounded-md p-1 shrink-0">
                            {['1/8', '1/4', '1/2', '3/4'].map(frac => (
                              <button 
                                key={frac}
                                onClick={() => setMeasFractions({...measFractions, [field]: frac})}
                                className={`w-8 h-7 text-[10px] font-bold rounded flex items-center justify-center transition-all ${measFractions[field] === frac ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'}`}
                              >
                                {frac}
                              </button>
                            ))}
                          </div>
                          <div className="relative flex-1">
                            <input 
                              type="number" 
                              placeholder="0.00"
                              value={measFields[field] || ''}
                              onChange={(e) => setMeasFields({...measFields, [field]: e.target.value})}
                              className="w-full h-9 border border-slate-300 rounded-md px-3 pr-8 text-[14px] font-mono font-bold outline-none focus:border-slate-500" 
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[11px]">&quot;</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-8 flex justify-center">
                  <button 
                    onClick={() => {
                      if (!newMeasCustomer) return alert('Select a customer first');
                      const newEntry = {
                        id: Date.now(),
                        customer: newMeasCustomer,
                        garment: newMeasGarment,
                        details: newMeasGarment === 'Custom' ? 'Standard Size: M' : Object.entries(measFields).map(([k, v]) => `${k}: ${v}${measFractions[k] || ''}"`).join(', ')
                      };
                      setBulkMeasurements([...bulkMeasurements, newEntry]);
                    }}
                    className="flex items-center gap-2 bg-white border-2 border-slate-900 text-slate-900 h-10 px-6 rounded-full text-[13px] font-bold hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                  >
                    <Plus size={16}/> Add to Batch List
                  </button>
                </div>
              </div>

              {/* Bulk List (Cart Concept) */}
              {bulkMeasurements.length > 0 && (
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <ShoppingCart size={18} className="text-slate-400"/>
                    <h3 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">Batch Measurement List</h3>
                  </div>
                  <div className="flex flex-col gap-3">
                    {bulkMeasurements.map((item) => (
                      <div key={item.id} className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                            <Ruler size={18} className="text-slate-400"/>
                          </div>
                          <div>
                            <div className="font-bold text-[14px] text-slate-900">{item.garment} <span className="text-slate-400 font-normal">for</span> {item.customer}</div>
                            <div className="text-[12px] text-slate-500 truncate max-w-md">{item.details}</div>
                          </div>
                        </div>
                        <button 
                          onClick={() => setBulkMeasurements(bulkMeasurements.filter(i => i.id !== item.id))}
                          className="w-8 h-8 rounded-md flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16}/>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="px-8 py-5 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button onClick={() => {
                setIsAddMeasurementModalOpen(false);
                setBulkMeasurements([]);
              }} className="h-11 px-6 rounded-lg border border-slate-300 text-slate-700 font-bold text-[14px] hover:bg-slate-100 bg-white">Cancel</button>
              <button onClick={() => {
                setIsAddMeasurementModalOpen(false);
                setBulkMeasurements([]);
              }} className="h-11 px-8 rounded-lg bg-slate-900 text-white font-bold text-[14px] hover:bg-slate-800 shadow-lg transition-all hover:-translate-y-0.5">Save New Measurement Version</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Appointment Modal */}
      {isAddAppointmentModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-[500px] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
              <div>
                <h2 className="text-[18px] font-bold text-slate-900">Schedule Appointment</h2>
                <p className="text-[13px] text-slate-500">Book a fitting or consultation.</p>
              </div>
              <button onClick={() => setIsAddAppointmentModalOpen(false)} className="text-slate-400 hover:text-slate-900"><X size={20}/></button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Select Customer</label>
                <select className="w-full h-10 border border-slate-300 rounded-md px-3 text-[13px] outline-none focus:border-slate-500">
                  <option>Maria Garcia</option>
                  <option>Alexander McQueen</option>
                </select>
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
                  <select className="w-full h-10 border border-slate-300 rounded-md px-3 text-[13px] outline-none focus:border-slate-500">
                    <option>Consultation</option>
                    <option>1st Fitting</option>
                    <option>Final Fitting</option>
                    <option>Pickup</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Assigned Staff</label>
                  <select className="w-full h-10 border border-slate-300 rounded-md px-3 text-[13px] outline-none focus:border-slate-500">
                    <option>Admin User</option>
                    <option>Maria Tailor</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Notes</label>
                <input type="text" placeholder="Any special requests..." className="w-full h-10 border border-slate-300 rounded-md px-3 text-[13px] outline-none focus:border-slate-500"/>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button onClick={() => setIsAddAppointmentModalOpen(false)} className="h-9 px-4 rounded-md border border-slate-300 text-slate-700 font-bold text-[13px] hover:bg-slate-100 bg-white">Cancel</button>
              <button onClick={() => setIsAddAppointmentModalOpen(false)} className="h-9 px-4 rounded-md bg-slate-900 text-white font-bold text-[13px] hover:bg-slate-800">Confirm Booking</button>
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
                <h2 className="text-[18px] font-bold text-slate-900">Edit Customer</h2>
                <p className="text-[13px] text-slate-500">Update client profile information.</p>
              </div>
              <button onClick={() => setSelectedEditCustomer(null)} className="text-slate-400 hover:text-slate-900"><X size={20}/></button>
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
              <button onClick={() => setSelectedEditCustomer(null)} className="h-9 px-4 rounded-md border border-slate-300 text-slate-700 font-bold text-[13px] hover:bg-slate-100 bg-white">Cancel</button>
              <button onClick={() => setSelectedEditCustomer(null)} className="h-9 px-4 rounded-md bg-blue-600 text-white font-bold text-[13px] hover:bg-blue-700 transition-colors">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Measurement Modal */}
      {selectedEditMeasurement && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-[600px] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
              <div>
                <h2 className="text-[18px] font-bold text-slate-900">Edit Measurement</h2>
                <p className="text-[13px] text-slate-500">Update client body dimensions.</p>
              </div>
              <button onClick={() => setSelectedEditMeasurement(null)} className="text-slate-400 hover:text-slate-900"><X size={20}/></button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Customer</label>
                  <input type="text" readOnly defaultValue={selectedEditMeasurement.customer} className="w-full h-10 border border-slate-300 bg-slate-50 text-slate-500 rounded-md px-3 text-[13px] outline-none"/>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Garment Type</label>
                  <input type="text" defaultValue={selectedEditMeasurement.garment} className="w-full h-10 border border-slate-300 rounded-md px-3 text-[13px] outline-none focus:border-slate-500"/>
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Key Measurements (in inches/cm)</label>
                <textarea rows={4} defaultValue={selectedEditMeasurement.keyMeasurements} className="w-full border border-slate-300 rounded-md p-3 text-[13px] outline-none focus:border-slate-500"></textarea>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button onClick={() => setSelectedEditMeasurement(null)} className="h-9 px-4 rounded-md border border-slate-300 text-slate-700 font-bold text-[13px] hover:bg-slate-100 bg-white">Cancel</button>
              <button onClick={() => setSelectedEditMeasurement(null)} className="h-9 px-4 rounded-md bg-blue-600 text-white font-bold text-[13px] hover:bg-blue-700 transition-colors">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Appointment Modal */}
      {selectedEditAppointment && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-[500px] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
              <div>
                <h2 className="text-[18px] font-bold text-slate-900">Edit Appointment</h2>
                <p className="text-[13px] text-slate-500">Update fitting or consultation details.</p>
              </div>
              <button onClick={() => setSelectedEditAppointment(null)} className="text-slate-400 hover:text-slate-900"><X size={20}/></button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Customer</label>
                <input type="text" readOnly defaultValue={selectedEditAppointment.customer} className="w-full h-10 border border-slate-300 bg-slate-50 text-slate-500 rounded-md px-3 text-[13px] outline-none"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Date</label>
                  <input type="text" defaultValue={selectedEditAppointment.date} className="w-full h-10 border border-slate-300 rounded-md px-3 text-[13px] outline-none focus:border-slate-500"/>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Time</label>
                  <input type="text" defaultValue={selectedEditAppointment.time} className="w-full h-10 border border-slate-300 rounded-md px-3 text-[13px] outline-none focus:border-slate-500"/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Type</label>
                  <select defaultValue={selectedEditAppointment.type} className="w-full h-10 border border-slate-300 rounded-md px-3 text-[13px] outline-none focus:border-slate-500">
                    <option>Consultation</option>
                    <option>1st Fitting</option>
                    <option>Final Fitting</option>
                    <option>Pickup</option>
                    <option>{selectedEditAppointment.type}</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Assigned Staff</label>
                  <select defaultValue={selectedEditAppointment.assigned} className="w-full h-10 border border-slate-300 rounded-md px-3 text-[13px] outline-none focus:border-slate-500">
                    <option>Admin User</option>
                    <option>Maria Garcia</option>
                    <option>Maria Tailor</option>
                    <option>{selectedEditAppointment.assigned}</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Notes</label>
                <input type="text" defaultValue={selectedEditAppointment.notes} className="w-full h-10 border border-slate-300 rounded-md px-3 text-[13px] outline-none focus:border-slate-500"/>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button onClick={() => setSelectedEditAppointment(null)} className="h-9 px-4 rounded-md border border-slate-300 text-slate-700 font-bold text-[13px] hover:bg-slate-100 bg-white">Cancel</button>
              <button onClick={() => setSelectedEditAppointment(null)} className="h-9 px-4 rounded-md bg-blue-600 text-white font-bold text-[13px] hover:bg-blue-700 transition-colors">Save Changes</button>
            </div>
          </div>
        </div>
      )}
      {/* Save New Measurement Version Modal */}
      {isSaveNewVersionModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-[750px] max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="px-8 py-6 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
              <div>
                <h2 className="text-[20px] font-bold text-slate-900 tracking-tight">Save New Measurement Version</h2>
                <p className="text-[13px] text-slate-500 mt-1">Create a refined measurement profile for this client.</p>
              </div>
              <button onClick={() => setIsSaveNewVersionModalOpen(false)} className="text-slate-400 hover:text-slate-900 transition-colors"><X size={20}/></button>
            </div>
            
            <div className="p-8 overflow-y-auto">
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Customer *</label>
                  <select 
                    value={newMeasCustomer}
                    onChange={(e) => setNewMeasCustomer(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-slate-200 bg-slate-50 text-[13px] focus:bg-white focus:border-slate-300 outline-none"
                  >
                    <option value="">Select...</option>
                    <option>Alexander McQueen</option>
                    <option>Maria Garcia</option>
                    <option>David Torres</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Garment Type *</label>
                  <select 
                    value={newMeasGarment}
                    onChange={(e) => setNewMeasGarment(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-slate-200 bg-slate-50 text-[13px] focus:bg-white focus:border-slate-300 outline-none"
                  >
                    <option value="Polo">Polo</option>
                    <option value="Pants">Pants</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Notes / Description (Optional)</label>
                  <textarea placeholder="Specific notes for this measurement set..." className="w-full h-20 p-3 rounded-md border border-slate-200 bg-slate-50 text-[13px] outline-none resize-none focus:bg-white"></textarea>
                </div>
              </div>

              <div className="mb-6 flex items-center justify-between">
                <div className="flex gap-2">
                  <button onClick={() => setNewMeasGarment('Custom (Polo)')} className={`px-4 py-1.5 rounded-full text-[12px] font-bold border transition-all ${newMeasGarment === 'Custom (Polo)' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-100 text-slate-500 border-slate-200 hover:border-slate-300'}`}>Custom (Polo)</button>
                  <button onClick={() => setNewMeasGarment('Custom (Pants)')} className={`px-4 py-1.5 rounded-full text-[12px] font-bold border transition-all ${newMeasGarment === 'Custom (Pants)' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-100 text-slate-500 border-slate-200 hover:border-slate-300'}`}>Custom (Pants)</button>
                  <button onClick={() => setNewMeasGarment('Standard Size')} className={`px-4 py-1.5 rounded-full text-[12px] font-bold border transition-all ${newMeasGarment === 'Standard Size' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-100 text-slate-500 border-slate-200 hover:border-slate-300'}`}>Standard Size</button>
                </div>
                <div className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">{newMeasGarment} — Inches</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                <div className="flex flex-col gap-6">
                  {['Chest', 'Shoulder', 'Sleeve', 'Neck'].map((field) => (
                    <div key={field} className="flex items-center gap-8">
                      <div className="w-24 text-[13px] font-bold text-slate-700">{field}</div>
                      <div className="flex-1 flex items-center gap-3">
                        <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                          {['1/8', '1/4', '1/2', '3/4'].map(frac => (
                            <button 
                              key={frac} 
                              onClick={() => setMeasFractions({...measFractions, [field]: frac})}
                              className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all ${measFractions[field] === frac ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                              {frac}
                            </button>
                          ))}
                        </div>
                        <input 
                          type="text" 
                          placeholder="0.00" 
                          className="w-24 h-9 text-center bg-white border border-slate-200 rounded-lg text-[14px] font-bold text-slate-900 focus:border-slate-400 outline-none" 
                        />
                        <span className="text-[13px] font-bold text-slate-400">&quot;</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-8 py-5 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button onClick={() => setIsSaveNewVersionModalOpen(false)} className="h-10 px-5 rounded-lg border border-slate-300 text-slate-700 font-bold text-[13px] hover:bg-slate-100 bg-white">Cancel</button>
              <button onClick={() => setIsSaveNewVersionModalOpen(false)} className="h-10 px-5 rounded-lg bg-slate-900 text-white font-bold text-[13px] hover:bg-slate-800 shadow-lg">Save New Version</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
