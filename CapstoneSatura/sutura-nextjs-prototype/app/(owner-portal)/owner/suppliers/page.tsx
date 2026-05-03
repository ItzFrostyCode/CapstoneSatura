'use client';

import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  Truck, 
  Mail, 
  Phone, 
  ChevronRight, 
  Star, 
  FileText,
  AlertCircle,
  PackageCheck,
  CheckCircle2,
  X,
  DollarSign,
  Info,
  Clock,
  Receipt,
  ChevronDown,
  LayoutGrid,
  List,
  MoreVertical
} from 'lucide-react';
import { useState, useMemo } from 'react';

import { useERPStore, Supplier, PurchaseOrder } from '../../store/useERPStore';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
}

export default function SuppliersPage() {
  const [activeTab, setActiveTab] = useState<'vendors' | 'purchase orders'>('vendors');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  // Core ERP Store
  const { suppliers, purchaseOrders, addSupplier, createPO, receivePO } = useERPStore();

  // Modal State
  const [isAddSupplierModalOpen, setIsAddSupplierModalOpen] = useState(false);
  const [isPOModalOpen, setIsPOModalOpen] = useState(false);

  // New Supplier Form State
  const [newSupName, setNewSupName] = useState('');
  const [newSupCategory, setNewSupCategory] = useState('');
  const [newSupEmail, setNewSupEmail] = useState('');
  const [newSupPhone, setNewSupPhone] = useState('');

  // New PO Form State
  const [newPoSupplier, setNewPoSupplier] = useState('');
  const [newPoAmount, setNewPoAmount] = useState<number>(0);

  // Derived Data
  const filteredSuppliers = useMemo(() => suppliers.filter(sup => 
    sup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sup.category.toLowerCase().includes(searchQuery.toLowerCase())
  ), [suppliers, searchQuery]);

  const filteredPOs = useMemo(() => purchaseOrders.filter(po => 
    po.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    suppliers.find(s => s.id === po.supplierId)?.name.toLowerCase().includes(searchQuery.toLowerCase())
  ), [purchaseOrders, suppliers, searchQuery]);

  // Handlers
  const handleAddSupplier = () => {
    if (!newSupName || !newSupCategory) return;
    const newSup: Omit<Supplier, 'id'> = {
      name: newSupName,
      email: newSupEmail || 'contact@supplier.com',
      contact: 'Admin',
      phone: newSupPhone || '+63 000 000 0000',
      category: newSupCategory,
      items: [],
      leadTime: 'N/A',
      rating: 'New',
      status: 'Active'
    };
    addSupplier(newSup);
    setIsAddSupplierModalOpen(false);
    setNewSupName('');
    setNewSupCategory('');
    setNewSupEmail('');
    setNewSupPhone('');
  };

  const handleCreatePO = () => {
    if (!newPoSupplier || newPoAmount <= 0) return;
    const newPO: Omit<PurchaseOrder, 'id'> = {
      supplierId: newPoSupplier,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      amount: newPoAmount,
      items: [{ sku: 'SYS-ITEM', qty: 10, cost: newPoAmount / 10 }], // Mocked until PO builder UI is created
      eta: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // +5 days
    };
    createPO(newPO);
    setIsPOModalOpen(false);
    setNewPoSupplier('');
    setNewPoAmount(0);
    setActiveTab('purchase orders');
  };

  const handleMarkDelivered = (poId: string) => {
    receivePO(poId, 'System Admin');
  };

  // KPIs
  const activeSuppliers = suppliers.filter(s => s.status !== 'Inactive').length;
  const pendingShipments = purchaseOrders.filter(po => po.status === 'Pending' || po.status === 'Shipped').length;
  const totalSpend = purchaseOrders.reduce((sum, po) => sum + po.amount, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight">Supplier & Vendor Hub</h1>
          <p className="text-[14px] text-slate-500 font-medium mt-1">Manage procurement, vendor relationships, and purchase tracking.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {activeTab === 'purchase orders' && (
            <button onClick={() => setIsPOModalOpen(true)} className="flex items-center gap-2 bg-slate-900 text-white h-9 px-4 rounded-md text-[13px] font-semibold hover:bg-slate-800 transition-colors shadow-sm">
              <FileText size={16} /> Create PO
            </button>
          )}
          {activeTab === 'vendors' && (
            <button onClick={() => setIsAddSupplierModalOpen(true)} className="flex items-center gap-2 bg-slate-900 text-white h-9 px-4 rounded-md text-[13px] font-semibold hover:bg-slate-800 transition-colors shadow-sm">
              <Plus size={16} /> Add Supplier
            </button>
          )}
        </div>
      </div>

      {/* ── KPI GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Active Suppliers", val: activeSuppliers.toString(), color: "bg-indigo-500" },
          { label: "Pending Shipments", val: pendingShipments.toString(), color: "bg-amber-500" },
          { label: "Total PO Spend", val: formatCurrency(totalSpend), color: "bg-emerald-500" },
        ].map((kpi, i) => (
          <div key={i} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[12px] font-bold text-slate-500">{kpi.label}</span>
              <div className={`w-2 h-2 rounded-full ${kpi.color} shadow-[0_0_8px_rgba(0,0,0,0.1)]`}></div>
            </div>
            <div className="text-[28px] font-black text-slate-900 tracking-tight">{kpi.val}</div>
          </div>
        ))}
      </div>

      {/* Secondary Navigation Tabs */}
      <div className="flex flex-wrap bg-slate-100/80 p-1.5 rounded-full w-max gap-1 mb-6 mt-6 border border-slate-200/50">
        {[
          { id: 'vendors', name: 'Vendors', icon: <Building2 size={14} /> },
          { id: 'purchase orders', name: 'Purchase Orders', icon: <Truck size={14} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'vendors' | 'purchase orders')}
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

      <div className="bg-white border border-slate-200 rounded-[24px] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors"
              />
            </div>
            {activeTab === 'vendors' && (
              <div className="flex items-center bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-900'}`}
                >
                  <LayoutGrid size={14} />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-900'}`}
                >
                  <List size={14} />
                </button>
              </div>
            )}
          </div>
          <button className="h-9 px-4 bg-white border border-slate-200 rounded-lg flex items-center gap-2 text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
            <Filter size={14} /> Filter
          </button>
        </div>

        {/* ── VIEWS ── */}
        {activeTab === 'vendors' && (
          viewMode === 'grid' ? (
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-slate-50/30 animate-in fade-in duration-300">
              {filteredSuppliers.map((sup) => {
                const supPosCount = purchaseOrders.filter(po => po.supplierId === sup.id).length;
                return (
                  <div key={sup.id} className="bg-white border border-slate-200 rounded-[24px] p-6 hover:shadow-lg hover:border-slate-300 transition-all group relative overflow-hidden flex flex-col h-full">
                    <div className="flex items-start justify-between mb-5 relative">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md group-hover:bg-indigo-600 transition-colors">
                        <Building2 size={20} />
                      </div>
                      <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </div>

                    <div className="relative">
                      <h3 className="text-[18px] font-black text-slate-900 leading-tight mb-4">{sup.name}</h3>
                      
                      <div className="space-y-2 mb-6">
                        <div className="flex items-center gap-3 text-slate-500">
                          <Mail size={14} className="text-slate-400" />
                          <span className="text-[13px] font-bold truncate">{sup.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-500">
                          <Phone size={14} className="text-slate-400" />
                          <span className="text-[13px] font-bold">{sup.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between relative">
                      <div>
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Orders</div>
                        <div className="text-[13px] font-black text-slate-900">{supPosCount} Total</div>
                      </div>
                      <button className="h-9 px-4 rounded-lg bg-slate-50 text-[11px] font-black text-slate-600 hover:bg-slate-900 hover:text-white transition-all uppercase tracking-widest">
                        Profile
                      </button>
                    </div>
                  </div>
                );
              })}

              <button onClick={() => setIsAddSupplierModalOpen(true)} className="border-2 border-dashed border-slate-200 rounded-[24px] p-6 flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-slate-900 hover:border-slate-400 hover:bg-white transition-all group min-h-[240px]">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-all">
                  <Plus size={24} />
                </div>
                <span className="text-[12px] font-black uppercase tracking-widest">New Supplier</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto animate-in fade-in duration-300">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400">
                    <th className="py-4 px-6 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest">Vendor Identity</th>
                    <th className="py-4 px-6 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest">Specialization</th>
                    <th className="py-4 px-6 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest">Contact</th>
                    <th className="py-4 px-6 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest text-center">Tracked POs</th>
                    <th className="py-4 px-6 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSuppliers.map((sup) => {
                    const supPosCount = purchaseOrders.filter(po => po.supplierId === sup.id).length;
                    return (
                      <tr key={sup.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-sm">
                              <Building2 size={16} />
                            </div>
                            <div className="font-black text-slate-900 text-[14px]">{sup.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-[11px] font-black text-slate-600 uppercase tracking-widest border border-slate-200">{sup.category}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-[13px] font-bold text-slate-600">{sup.email}</div>
                          <div className="text-[11px] text-slate-400 font-medium">{sup.phone}</div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="text-[14px] font-black text-slate-900">{supPosCount}</div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="h-8 px-4 rounded-lg border border-slate-200 text-[11px] font-black text-slate-600 hover:bg-slate-900 hover:text-white transition-all uppercase tracking-widest">
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        )}

        {activeTab === 'purchase orders' && (
          <div className="overflow-x-auto animate-in fade-in duration-300">
            {filteredPOs.length === 0 ? (
              <div className="p-16 text-center text-slate-500">
                <PackageCheck size={48} className="mx-auto text-slate-200 mb-4" />
                <h3 className="text-[18px] font-black text-slate-900 tracking-tight">No Purchase Orders Found</h3>
                <p className="text-[14px] mt-1 font-medium">There are no orders matching your search or no orders exist.</p>
              </div>
            ) : (
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400">
                    <th className="py-4 px-6 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest">PO Reference</th>
                    <th className="py-4 px-6 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest">Vendor</th>
                    <th className="py-4 px-6 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest">Issue Date</th>
                    <th className="py-4 px-6 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest">ETA</th>
                    <th className="py-4 px-6 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest text-center">Status</th>
                    <th className="py-4 px-6 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest text-right">Amount</th>
                    <th className="py-4 px-6 border-b border-slate-100 text-[11px] font-black uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPOs.map((po) => {
                    const sup = suppliers.find(s => s.id === po.supplierId);
                    return (
                      <tr key={po.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
                              <Receipt size={16} />
                            </div>
                            <div>
                              <div className="text-[14px] font-black text-slate-900 leading-none">{po.id}</div>
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{po.items.length} Order Items</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-[14px] font-bold text-slate-900">{sup?.name || 'Unknown Vendor'}</div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-[13px] font-bold text-slate-900">{po.date}</div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Issued</div>
                        </td>
                        <td className="px-6 py-5">
                          {po.status === 'Delivered' ? (
                            <span className="text-slate-300 font-bold">-</span>
                          ) : (
                            <div>
                              <div className="text-[13px] font-bold text-indigo-600">{po.eta}</div>
                              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Expected</div>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${
                            po.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            po.status === 'Shipped' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                            po.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-slate-50 text-slate-600 border-slate-200'
                          }`}>
                            {po.status === 'Delivered' && <CheckCircle2 size={12} />}
                            {po.status === 'Shipped' && <Truck size={12} />}
                            {po.status === 'Pending' && <Clock size={12} />}
                            {po.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right font-black text-[15px] text-slate-900">
                          {formatCurrency(po.amount)}
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex justify-end">
                            {po.status !== 'Delivered' ? (
                              <button 
                                onClick={() => handleMarkDelivered(po.id)}
                                className="h-9 px-4 rounded-xl bg-slate-900 text-[12px] font-black text-white hover:bg-emerald-600 transition-all shadow-md hover:shadow-emerald-500/20 hover:-translate-y-0.5 flex items-center gap-2"
                              >
                                <PackageCheck size={14} /> Receive Stock
                              </button>
                            ) : (
                              <button className="h-9 px-4 rounded-xl bg-slate-50 border border-slate-200 text-[12px] font-black text-slate-400 hover:text-slate-900 hover:bg-white transition-all">
                                View Details
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* ── MODALS ── */}

      {/* Add Supplier Modal */}
      {isAddSupplierModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[500px] rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[40px]"></div>
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg">
                  <Building2 size={24} />
                </div>
                <div>
                  <h2 className="text-[22px] font-black text-slate-900 tracking-tight leading-none">Register Vendor</h2>
                  <p className="text-[13px] text-slate-500 font-medium mt-1">Onboard a new wholesale material supplier.</p>
                </div>
              </div>
              <button onClick={() => setIsAddSupplierModalOpen(false)} className="relative z-10 w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-6 bg-slate-50/50">
              <div className="space-y-4">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Business Identity</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[12px] font-bold text-slate-700 mb-2 block">Company Name</label>
                    <input type="text" value={newSupName} onChange={e => setNewSupName(e.target.value)} className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-[14px] font-bold shadow-sm" placeholder="e.g. Acme Fabrics Inc." />
                  </div>
                  <div>
                    <label className="text-[12px] font-bold text-slate-700 mb-2 block">Category Specialization</label>
                    <input type="text" value={newSupCategory} onChange={e => setNewSupCategory(e.target.value)} className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-[14px] font-bold shadow-sm" placeholder="e.g. Wholesale Threads" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Information</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="text-[12px] font-bold text-slate-700 mb-2 block">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input type="email" value={newSupEmail} onChange={e => setNewSupEmail(e.target.value)} className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-[14px] font-bold shadow-sm" placeholder="orders@company.com" />
                    </div>
                  </div>
                  <div className="relative">
                    <label className="text-[12px] font-bold text-slate-700 mb-2 block">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input type="text" value={newSupPhone} onChange={e => setNewSupPhone(e.target.value)} className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-[14px] font-bold shadow-sm" placeholder="+63 900 000 0000" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3">
              <button onClick={() => setIsAddSupplierModalOpen(false)} className="px-6 h-11 bg-white border border-slate-200 rounded-xl text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
              <button onClick={handleAddSupplier} disabled={!newSupName || !newSupCategory} className="px-8 h-11 bg-slate-900 text-white rounded-xl text-[13px] font-black shadow-lg shadow-slate-900/10 hover:bg-indigo-600 hover:shadow-indigo-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed">Save Supplier Profile</button>
            </div>
          </div>
        </div>
      )}

      {/* Create PO Modal */}
      {isPOModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[500px] rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px]"></div>
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Receipt size={24} />
                </div>
                <div>
                  <h2 className="text-[22px] font-black text-slate-900 tracking-tight leading-none">Draft Purchase Order</h2>
                  <p className="text-[13px] text-slate-500 font-medium mt-1">Create a new procurement transaction.</p>
                </div>
              </div>
              <button onClick={() => setIsPOModalOpen(false)} className="relative z-10 w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-6 bg-slate-50/50">
              <div className="space-y-4">
                <label className="text-[12px] font-bold text-slate-700 block">Select Supplier Network</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <select value={newPoSupplier} onChange={e => setNewPoSupplier(e.target.value)} className="w-full h-14 pl-12 pr-10 rounded-xl border border-slate-200 bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-[15px] font-black text-slate-900 appearance-none shadow-sm">
                    <option value="" disabled>Choose a verified supplier...</option>
                    {suppliers.filter(s => s.status !== 'Inactive').map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                </div>
              </div>
              
              <div className="space-y-4">
                <label className="text-[12px] font-bold text-slate-700 block">Initial Order Value (Estimated)</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[16px] font-black text-slate-400">₱</div>
                  <input type="number" min="0" value={newPoAmount || ''} onChange={e => setNewPoAmount(Number(e.target.value))} className="w-full h-14 pl-10 pr-4 rounded-xl border border-slate-200 bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-[24px] font-black text-slate-900 shadow-sm" placeholder="0.00" />
                </div>
              </div>

              <div className="p-5 bg-white border border-slate-200 rounded-2xl flex gap-4 items-start shadow-sm">
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                  <Clock size={18} />
                </div>
                <div>
                  <h4 className="text-[13px] font-black text-slate-900 mb-1">Status: Pending Verification</h4>
                  <p className="text-[12px] font-medium text-slate-500 leading-relaxed">
                    This PO will be drafted into the ledger. You must manually verify and mark it as <span className="font-bold text-slate-700">Received</span> when the inventory arrives to complete the transaction.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3">
              <button onClick={() => setIsPOModalOpen(false)} className="px-6 h-11 bg-white border border-slate-200 rounded-xl text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
              <button onClick={handleCreatePO} disabled={!newPoSupplier || newPoAmount <= 0} className="px-8 h-11 bg-emerald-500 text-white rounded-xl text-[13px] font-black shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 hover:shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                <CheckCircle2 size={16} /> Authorize PO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
