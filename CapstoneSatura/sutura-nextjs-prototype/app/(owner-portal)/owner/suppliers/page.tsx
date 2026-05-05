'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { Building2, Plus, Search, Truck, Mail, Phone, ChevronRight, Star, FileText, CheckCircle2, X, Clock, PackageCheck, AlertCircle, MoreVertical, History, BarChart3 } from 'lucide-react';
import { useERPStore, Supplier, PurchaseOrder, POItem, InventoryItem } from '../../store/useERPStore';

type NavTab = 'directory' | 'purchase-orders' | 'receiving';
type DetailTab = 'info' | 'items' | 'history' | 'performance';
type SupplierStatus = 'Active' | 'Inactive' | 'Blacklisted' | 'Verified' | 'Preferred';

function getStatusClasses(status: string) {
  switch (status) {
    case 'Active': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    case 'Verified': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    case 'Preferred': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
    case 'Inactive': return 'bg-slate-50 text-slate-500 border-slate-200';
    case 'Blacklisted': return 'bg-rose-50 text-rose-700 border-rose-100';
    default: return 'bg-slate-50 text-slate-500 border-slate-200';
  }
}

function getPOStatusClasses(status: string) {
  switch (status) {
    case 'Ordered': return 'bg-amber-50 text-amber-700 border-amber-100';
    case 'Partially Received': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
    case 'Received': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    case 'Cancelled': return 'bg-rose-50 text-rose-700 border-rose-100';
    default: return 'bg-slate-50 text-slate-500 border-slate-200';
  }
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(n);
}

export default function SuppliersPage() {
  const { suppliers, purchaseOrders, receivePO, inventory, addSupplier, updateSupplier, createPO } = useERPStore();

  const [navTab, setNavTab] = useState<NavTab>('directory');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>('info');
  const [deliveryFilter, setDeliveryFilter] = useState<string>('All');
  const [confirmPO, setConfirmPO] = useState<{ id: string; supplier: string } | null>(null);

  // Add / Edit Supplier
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [supplierForm, setSupplierForm] = useState({ name: '', contact: '', email: '', phone: '', category: 'Fabric Supplier', leadTime: '7 days', rating: '4.5', status: 'Active' });

  // Create PO
  const [isCreatePOOpen, setIsCreatePOOpen] = useState(false);
  const [poSupplierId, setPOSupplierId] = useState('');
  const [poETA, setPOETA] = useState('');
  const [poItems, setPOItems] = useState<POItem[]>([{ sku: '', qty: 1, cost: 0 }]);

  // Blacklist confirm
  const [blacklistTarget, setBlacklistTarget] = useState<Supplier | null>(null);

  const panelRef = useRef<HTMLDivElement>(null);

  // --- Helper functions for modals ---
  const openAddSupplier = (existing?: Supplier) => {
    setEditingSupplier(existing || null);
    setSupplierForm(existing
      ? { name: existing.name, contact: existing.contact, email: existing.email, phone: existing.phone, category: existing.category, leadTime: existing.leadTime, rating: existing.rating, status: existing.status }
      : { name: '', contact: '', email: '', phone: '', category: 'Fabric Supplier', leadTime: '7 days', rating: '4.5', status: 'Active' }
    );
    setIsAddSupplierOpen(true);
  };

  const handleSubmitSupplier = () => {
    if (!supplierForm.name.trim()) return;
    if (editingSupplier) {
      updateSupplier(editingSupplier.id, supplierForm);
    } else {
      addSupplier({ ...supplierForm, items: [] });
    }
    setIsAddSupplierOpen(false);
  };

  const openCreatePO = (supplierId = '') => {
    setPOSupplierId(supplierId);
    setPOETA('');
    setPOItems([{ sku: '', qty: 1, cost: 0 }]);
    setIsCreatePOOpen(true);
  };

  const poTotal = poItems.reduce((sum, i) => sum + (i.qty * i.cost), 0);

  const handleSubmitPO = () => {
    if (!poSupplierId || poItems.some(i => !i.sku || i.qty <= 0)) return;
    createPO({ supplierId: poSupplierId, date: new Date().toISOString().split('T')[0], status: 'Ordered', amount: poTotal, items: poItems, eta: poETA || 'TBD', created_by: 'STF-001' });
    setIsCreatePOOpen(false);
  };

  const NAV_TABS = [
    { id: 'directory' as NavTab, label: 'Supplier Directory', icon: <Building2 size={14} /> },
    { id: 'purchase-orders' as NavTab, label: 'Purchase Orders', icon: <FileText size={14} /> },
    { id: 'receiving' as NavTab, label: 'Receiving', icon: <PackageCheck size={14} /> },
  ];

  const DETAIL_TABS: { id: DetailTab; label: string; icon: React.ReactNode }[] = [
    { id: 'info', label: 'Info', icon: <Building2 size={13} /> },
    { id: 'items', label: 'Items Supplied', icon: <PackageCheck size={13} /> },
    { id: 'history', label: 'Purchase History', icon: <History size={13} /> },
    { id: 'performance', label: 'Performance', icon: <BarChart3 size={13} /> },
  ];

  const filteredSuppliers = useMemo(() =>
    suppliers.filter(s =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.status.toLowerCase().includes(searchQuery.toLowerCase())
    ), [suppliers, searchQuery]);

  const receivingOrders = useMemo(() =>
    purchaseOrders.filter(po =>
      deliveryFilter === 'All' ? true : po.status === deliveryFilter
    ), [purchaseOrders, deliveryFilter]);

  const getSupplierName = (id: string) => suppliers.find(s => s.id === id)?.name ?? id;
  const supplierPOs = selectedSupplier ? purchaseOrders.filter(po => po.supplierId === selectedSupplier.id) : [];

  return (
    <div className="space-y-0 animate-in fade-in duration-500 max-w-[1400px] mx-auto pb-20">

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight leading-none">Suppliers</h1>
          <p className="text-[14px] text-slate-500 font-medium mt-1">Streamlining procurement and material logistics.</p>
        </div>
        <button onClick={() => openAddSupplier()} className="h-10 px-5 bg-slate-900 text-white rounded-full flex items-center gap-2 text-[12px] font-bold hover:bg-indigo-600 transition-all shadow-md active:scale-95">
          <Plus size={14} /> New Supplier
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Suppliers', val: suppliers.length, color: 'indigo' },
          { label: 'Active', val: suppliers.filter(s => s.status === 'Active' || s.status === 'Verified' || s.status === 'Preferred').length, color: 'emerald' },
          { label: 'Open POs', val: purchaseOrders.filter(p => p.status === 'Ordered' || p.status === 'Partially Received').length, color: 'amber' },
          { label: 'Blacklisted', val: suppliers.filter(s => s.status === 'Blacklisted').length, color: 'rose' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</div>
            <div className="text-[28px] font-black text-slate-900">{stat.val}</div>
          </div>
        ))}
      </div>

      {/* NAV TABS - Circle/Pill Style */}
      <div className="flex items-center gap-2 mb-8 bg-slate-100/50 p-1.5 rounded-full w-fit border border-slate-200/60">
        {NAV_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setNavTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-2.5 text-[12px] font-bold rounded-full transition-all duration-300 ${navTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600 hover:bg-white/40'}`}
          >
            {tab.icon}{tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB: SUPPLIER DIRECTORY ── */}
      {navTab === 'directory' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} type="text" placeholder="Search suppliers..." className="h-10 w-full pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-[13px] outline-none focus:bg-white focus:border-slate-900 transition-all" />
            </div>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                <th className="px-6 py-4">Supplier Code</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Contact Person</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredSuppliers.map(sup => (
                <tr key={sup.id} className="hover:bg-slate-50/50 transition-all">
                  <td className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">{sup.id}</td>
                  <td className="px-6 py-4">
                    <div className="text-[14px] font-bold text-slate-900">{sup.name}</div>
                    <div className="text-[11px] text-slate-500">{sup.email}</div>
                  </td>
                  <td className="px-6 py-4 text-[13px] font-medium text-slate-700">{sup.contact}</td>
                  <td className="px-6 py-4 text-[13px] font-medium text-slate-700">{sup.phone}</td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200/50 uppercase tracking-wide">{sup.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-widest ${getStatusClasses(sup.status)}`}>{sup.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setSelectedSupplier(sup); setDetailTab('info'); }}
                        className="h-8 px-4 rounded-full bg-white border border-slate-200 text-[11px] font-bold hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                      >
                        View Details
                      </button>
                      <button className="h-9 w-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors shadow-sm">
                        <MoreVertical size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── TAB: PURCHASE ORDERS ── */}
      {navTab === 'purchase-orders' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <p className="text-[12px] text-slate-500 font-medium italic">Active purchase cycles and upcoming deliveries.</p>
            <button onClick={() => openCreatePO()} className="h-9 px-5 bg-slate-900 text-white rounded-full text-[12px] font-bold flex items-center gap-2 hover:bg-indigo-600 transition-all shadow-sm">
              <Plus size={14} /> Create PO
            </button>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                <th className="px-6 py-4">PO ID</th>
                <th className="px-6 py-4">Supplier</th>
                <th className="px-6 py-4 text-center">Items</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Expected Delivery</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {purchaseOrders.map(po => (
                <tr key={po.id} className="hover:bg-slate-50/50 transition-all">
                  <td className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">{po.id}</td>
                  <td className="px-6 py-4 text-[14px] font-bold text-slate-900">{getSupplierName(po.supplierId)}</td>
                  <td className="px-6 py-4 text-center text-[13px] font-medium text-slate-600">{po.items.length} item(s)</td>
                  <td className="px-6 py-4 text-right text-[14px] font-black text-slate-900">{formatCurrency(po.amount)}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-widest ${getPOStatusClasses(po.status)}`}>{po.status}</span>
                  </td>
                  <td className="px-6 py-4 text-[13px] font-medium text-slate-600">{po.eta}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {(po.status === 'Ordered' || po.status === 'Partially Received') && (
                        <button onClick={() => setConfirmPO({ id: po.id, supplier: getSupplierName(po.supplierId) })} className="h-9 px-3 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 text-[12px] font-bold hover:bg-emerald-600 hover:text-white transition-all">
                          Mark Received
                        </button>
                      )}
                      <button className="h-9 w-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                        <MoreVertical size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── TAB: RECEIVING ── */}
      {navTab === 'receiving' && (
        <div className="space-y-4">
          {/* Status filter */}
          <div className="flex items-center gap-2">
            {['All', 'Ordered', 'Partially Received', 'Received', 'Cancelled'].map(f => (
              <button
                key={f}
                onClick={() => setDeliveryFilter(f)}
                className={`px-4 py-2 rounded-xl text-[12px] font-bold border transition-all ${deliveryFilter === f ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'}`}
              >
                {f}
                <span className="ml-2 text-[10px] opacity-70">
                  {f === 'All' ? purchaseOrders.length : purchaseOrders.filter(p => p.status === f).length}
                </span>
              </button>
            ))}
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <p className="text-[12px] text-slate-500 italic">Confirmed arrivals log <strong>Stock In</strong> automatically.</p>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                  <th className="px-6 py-4">PO ID</th>
                  <th className="px-6 py-4">Supplier</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">ETA</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {receivingOrders.map(po => (
                  <tr key={po.id} className="hover:bg-slate-50/50 transition-all">
                    <td className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">{po.id}</td>
                    <td className="px-6 py-4 text-[14px] font-bold text-slate-900">{getSupplierName(po.supplierId)}</td>
                    <td className="px-6 py-4 text-[14px] font-black text-slate-900">{formatCurrency(po.amount)}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-widest ${getPOStatusClasses(po.status)}`}>{po.status}</span>
                    </td>
                    <td className="px-6 py-4 text-[13px] font-medium text-slate-600 flex items-center gap-2">
                      <Clock size={13} className="text-slate-400" />{po.eta}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {po.status === 'Received' ? (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-black text-emerald-600">
                          <CheckCircle2 size={14} /> Stock In Triggered
                        </span>
                      ) : (
                        <button onClick={() => setConfirmPO({ id: po.id, supplier: getSupplierName(po.supplierId) })} className="h-9 px-5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[11px] font-black hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                          Confirm Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── SUPPLIER DETAILS DRAWER ── */}
      {selectedSupplier && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedSupplier(null)}
          role="presentation"
        >
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Supplier details for ${selectedSupplier.name}`}
            tabIndex={-1}
            className="bg-white w-full max-w-[860px] h-[88vh] rounded-[24px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col outline-none"
            onClick={e => e.stopPropagation()}
          >

            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-slate-50/30">
              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{selectedSupplier.id}</div>
                <h2 className="text-[20px] font-black text-slate-900 leading-tight">{selectedSupplier.name}</h2>
                <span className={`inline-block text-[10px] font-black px-2.5 py-0.5 rounded-lg border uppercase tracking-widest mt-1 ${getStatusClasses(selectedSupplier.status)}`}>{selectedSupplier.status}</span>
              </div>
              <button onClick={() => setSelectedSupplier(null)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-all">
                <X size={20} />
              </button>
            </div>

            {/* Detail Tabs */}
            <div className="flex items-center gap-6 px-8 border-b border-slate-100">
              {DETAIL_TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setDetailTab(tab.id)}
                  className={`flex items-center gap-2 py-4 text-[13px] font-bold border-b-2 transition-all ${detailTab === tab.id ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-700'}`}
                >
                  {tab.icon}{tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">

              {/* INFO */}
              {detailTab === 'info' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: 'Contact Person', val: selectedSupplier.contact, icon: <Phone size={15} /> },
                    { label: 'Email', val: selectedSupplier.email, icon: <Mail size={15} /> },
                    { label: 'Phone', val: selectedSupplier.phone, icon: <Phone size={15} /> },
                    { label: 'Category', val: selectedSupplier.category, icon: <Building2 size={15} /> },
                    { label: 'Lead Time', val: selectedSupplier.leadTime, icon: <Clock size={15} /> },
                    { label: 'Rating', val: `${selectedSupplier.rating} / 5.0`, icon: <Star size={15} /> },
                  ].map(({ label, val, icon }) => (
                    <div key={label} className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">{icon}{label}</div>
                      <div className="text-[15px] font-bold text-slate-900">{val}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* ITEMS SUPPLIED */}
              {detailTab === 'items' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[16px] font-black text-slate-900">Items Supplied</h3>
                    <span className="text-[12px] font-medium text-slate-400">{inventory.filter(i => i.supplier_id === selectedSupplier.id).length} linked in inventory</span>
                  </div>
                  {(() => {
                    const linked = inventory.filter(i => i.supplier_id === selectedSupplier.id);
                    const legacy = selectedSupplier.items.filter(sku => !linked.find(i => i.sku === sku));
                    const all: InventoryItem[] = [
                      ...linked,
                      ...legacy
                        .map(sku => inventory.find(i => i.sku === sku))
                        .filter((i): i is InventoryItem => i !== undefined),
                    ];
                    return all.length === 0 ? (
                      <p className="text-[13px] text-slate-400">No items linked to this supplier yet.</p>
                    ) : all.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
                        <div>
                          <div className="text-[13px] font-bold text-slate-900">{item.item}</div>
                          <div className="text-[11px] font-mono text-slate-400 mt-0.5">{item.sku}</div>
                        </div>
                        <span className="text-[11px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">{item.cat}</span>
                      </div>
                    ));
                  })()}
                </div>
              )}

              {/* PURCHASE HISTORY */}
              {detailTab === 'history' && (
                <div className="space-y-3">
                  <h3 className="text-[16px] font-black text-slate-900">Purchase History</h3>
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-200" />
                    <div className="space-y-4 pl-10">
                      {supplierPOs.length === 0 ? (
                        <p className="text-[13px] text-slate-400">No purchase orders found.</p>
                      ) : supplierPOs.map(po => (
                        <div key={po.id} className="relative">
                          <div className="absolute -left-10 top-1.5 w-3 h-3 rounded-full border-2 border-white shadow-sm bg-indigo-500" />
                          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{po.id}</span>
                              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-lg border ${getPOStatusClasses(po.status)}`}>{po.status}</span>
                            </div>
                            <div className="text-[14px] font-black text-slate-900">{formatCurrency(po.amount)}</div>
                            <div className="text-[12px] text-slate-500 mt-1">{po.items.length} item(s) · ETA {po.eta}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* PERFORMANCE */}
              {detailTab === 'performance' && (
                <div className="space-y-6">
                  <h3 className="text-[16px] font-black text-slate-900">Supplier Performance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { label: 'Rating', val: `${selectedSupplier.rating} / 5.0`, sub: 'Overall Score' },
                      { label: 'Lead Time', val: selectedSupplier.leadTime, sub: 'Avg. Delivery Window' },
                      { label: 'Total POs', val: supplierPOs.length, sub: 'All Time' },
                    ].map(({ label, val, sub }) => (
                      <div key={label} className="bg-slate-50 border border-slate-100 rounded-xl p-5 text-center">
                        <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</div>
                        <div className="text-[24px] font-black text-slate-900">{val}</div>
                        <div className="text-[11px] text-slate-400 mt-1">{sub}</div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                    <p className="text-[12px] text-indigo-700 font-medium">
                      <strong>Traceability:</strong> All purchase orders from this supplier are recorded in <code className="bg-indigo-100 px-1 rounded">supplier_transactions</code>. Confirmed deliveries trigger <code className="bg-indigo-100 px-1 rounded">inventory_transactions (Stock In)</code> automatically.
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* Action Footer */}
            <div className="border-t border-slate-100 bg-slate-50/50 p-6 flex items-center justify-between">
              <button
                onClick={() => setBlacklistTarget(selectedSupplier)}
                className="h-10 px-5 rounded-full text-rose-600 font-bold text-[12px] hover:bg-rose-50 transition-all disabled:opacity-30 border border-transparent hover:border-rose-100"
                disabled={selectedSupplier.status === 'Blacklisted'}
              >
                {selectedSupplier.status === 'Blacklisted' ? 'Blacklisted' : 'Blacklist'}
              </button>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { openAddSupplier(selectedSupplier); }}
                  className="h-10 px-5 rounded-full bg-white border border-slate-200 text-slate-700 font-bold text-[12px] hover:bg-slate-50 transition-all shadow-sm"
                >
                  Edit Details
                </button>
                <button
                  onClick={() => { openCreatePO(selectedSupplier.id); }}
                  className="h-10 px-6 rounded-full bg-slate-900 text-white font-bold text-[12px] hover:bg-indigo-600 transition-all shadow-md flex items-center gap-2 active:scale-95"
                >
                  <Plus size={14} /> Create PO
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CONFIRMATION MODAL ── */}
      {confirmPO && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[400px] rounded-[24px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={24} />
              </div>
              <h3 className="text-[18px] font-black text-slate-900 mb-2">Confirm Stock In</h3>
              <p className="text-[13px] text-slate-500 mb-6">
                Are you sure you want to mark <strong>{confirmPO.id}</strong> from <strong>{confirmPO.supplier}</strong> as received? This will automatically update your inventory levels.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setConfirmPO(null)}
                  className="h-11 rounded-full bg-slate-50 text-slate-700 font-bold text-[13px] hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    receivePO(confirmPO.id, 'Admin');
                    setConfirmPO(null);
                  }}
                  className="h-11 rounded-full bg-emerald-600 text-white font-bold text-[13px] hover:bg-emerald-700 transition-all shadow-md active:scale-95"
                >
                  Confirm Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── BLACKLIST CONFIRM ── */}
      {blacklistTarget && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[380px] rounded-[24px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4"><AlertCircle size={24} /></div>
              <h3 className="text-[18px] font-black text-slate-900 mb-2">Blacklist Supplier?</h3>
              <p className="text-[13px] text-slate-500 mb-6">This will mark <strong>{blacklistTarget.name}</strong> as Blacklisted and prevent new POs from being created with them.</p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setBlacklistTarget(null)} className="h-11 rounded-full bg-slate-50 text-slate-700 font-bold text-[13px] hover:bg-slate-100 transition-all">Cancel</button>
                <button onClick={() => { updateSupplier(blacklistTarget.id, { status: 'Blacklisted' }); setBlacklistTarget(null); setSelectedSupplier(null); }} className="h-11 rounded-full bg-rose-600 text-white font-bold text-[13px] hover:bg-rose-700 transition-all shadow-md active:scale-95">Confirm Blacklist</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD / EDIT SUPPLIER MODAL ── */}
      {isAddSupplierOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[600px] rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div>
                <h2 className="text-[20px] font-black text-slate-900 tracking-tight">{editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}</h2>
                <p className="text-[13px] text-slate-500 font-medium">{editingSupplier ? `Editing ${editingSupplier.id}` : 'Register a new supplier into the system.'}</p>
              </div>
              <button onClick={() => setIsAddSupplierOpen(false)} className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"><X size={20} /></button>
            </div>
            <div className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Company / Supplier Name *</label>
                  <input type="text" value={supplierForm.name} onChange={e => setSupplierForm(p => ({...p, name: e.target.value}))} placeholder="e.g. Textile Mills Philippines" className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-medium" />
                </div>
                <div>
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Contact Person</label>
                  <input type="text" value={supplierForm.contact} onChange={e => setSupplierForm(p => ({...p, contact: e.target.value}))} placeholder="e.g. Juan dela Cruz" className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-medium" />
                </div>
                <div>
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Phone</label>
                  <input type="text" value={supplierForm.phone} onChange={e => setSupplierForm(p => ({...p, phone: e.target.value}))} placeholder="e.g. +63 917 123 4567" className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-medium" />
                </div>
                <div>
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Email</label>
                  <input type="email" value={supplierForm.email} onChange={e => setSupplierForm(p => ({...p, email: e.target.value}))} placeholder="supplier@example.com" className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-medium" />
                </div>
                <div>
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Category</label>
                  <select value={supplierForm.category} onChange={e => setSupplierForm(p => ({...p, category: e.target.value}))} className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-medium appearance-none">
                    {['Fabric Supplier','Thread Supplier','Accessories Supplier','Button Supplier','Mixed'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Lead Time</label>
                  <input type="text" value={supplierForm.leadTime} onChange={e => setSupplierForm(p => ({...p, leadTime: e.target.value}))} placeholder="e.g. 7 days" className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-medium" />
                </div>
                <div>
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Trust Status</label>
                  <select value={supplierForm.status} onChange={e => setSupplierForm(p => ({...p, status: e.target.value as SupplierStatus}))} className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-medium appearance-none">
                    {['Active','Verified','Preferred','Inactive','Blacklisted'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="p-8 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setIsAddSupplierOpen(false)} className="px-6 h-12 bg-white border border-slate-200 rounded-full text-[14px] font-bold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
              <button onClick={handleSubmitSupplier} disabled={!supplierForm.name.trim()} className="px-8 h-12 bg-slate-900 text-white rounded-full text-[14px] font-black shadow-lg shadow-slate-900/10 hover:bg-slate-800 disabled:opacity-50 transition-all active:scale-95">
                {editingSupplier ? 'Save Changes' : 'Add Supplier'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CREATE PO MODAL ── */}
      {isCreatePOOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[680px] max-h-[90vh] rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30 flex-shrink-0">
              <div>
                <h2 className="text-[20px] font-black text-slate-900 tracking-tight">Create Purchase Order</h2>
                <p className="text-[13px] text-slate-500 font-medium">Issue a new PO to a supplier for restocking.</p>
              </div>
              <button onClick={() => setIsCreatePOOpen(false)} className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"><X size={20} /></button>
            </div>
            <div className="p-8 space-y-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Supplier *</label>
                  <select value={poSupplierId} onChange={e => setPOSupplierId(e.target.value)} className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-medium appearance-none">
                    <option value="" disabled>Select a supplier</option>
                    {suppliers.filter(s => s.status !== 'Blacklisted').map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Expected Delivery Date</label>
                  <input type="date" value={poETA} onChange={e => setPOETA(e.target.value)} className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-medium" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-widest">Line Items</h3>
                  <button onClick={() => setPOItems(prev => [...prev, { sku: '', qty: 1, cost: 0 }])} className="h-8 px-3 rounded-lg border border-dashed border-slate-300 text-[12px] font-bold text-slate-500 hover:border-slate-500 hover:text-slate-900 transition-all flex items-center gap-1.5"><Plus size={12} /> Add Item</button>
                </div>
                {poItems.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-[1fr_80px_100px_36px] gap-2 items-center">
                    <select value={item.sku} onChange={e => setPOItems(prev => prev.map((p, i) => i === idx ? {...p, sku: e.target.value} : p))} className="h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none text-[13px] font-medium appearance-none">
                      <option value="" disabled>Select SKU</option>
                      {inventory.filter(i => i.cat !== 'Finished Goods').map(i => <option key={i.sku} value={i.sku}>{i.item}</option>)}
                    </select>
                    <input type="number" min={1} value={item.qty} onChange={e => setPOItems(prev => prev.map((p, i) => i === idx ? {...p, qty: Number(e.target.value)} : p))} placeholder="Qty" className="h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none text-[13px] font-bold text-center" />
                    <input type="number" min={0} value={item.cost} onChange={e => setPOItems(prev => prev.map((p, i) => i === idx ? {...p, cost: Number(e.target.value)} : p))} placeholder="Unit Cost" className="h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none text-[13px] font-medium" />
                    <button onClick={() => setPOItems(prev => prev.filter((_, i) => i !== idx))} className="h-10 w-9 rounded-xl border border-slate-200 flex items-center justify-center text-rose-400 hover:bg-rose-50 transition-all"><X size={14} /></button>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-[13px] font-bold text-slate-500">Order Total</span>
                  <span className="text-[20px] font-black text-slate-900">{formatCurrency(poTotal)}</span>
                </div>
              </div>
            </div>
            <div className="p-8 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 flex-shrink-0">
              <button onClick={() => setIsCreatePOOpen(false)} className="px-6 h-12 bg-white border border-slate-200 rounded-full text-[14px] font-bold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
              <button onClick={handleSubmitPO} disabled={!poSupplierId || poItems.some(i => !i.sku || i.qty <= 0)} className="px-8 h-12 bg-slate-900 text-white rounded-full text-[14px] font-black shadow-lg shadow-slate-900/10 hover:bg-indigo-600 disabled:opacity-50 transition-all flex items-center gap-2 active:scale-95"><FileText size={16} /> Issue PO</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
