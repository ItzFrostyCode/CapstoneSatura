'use client';

import { useState, useMemo, useRef } from 'react';
import { 
  Search, Plus, FileText, X, Mail, Phone, Clock, Building2, History, 
  BarChart3, PackageCheck, AlertCircle, CheckCircle2, ChevronRight, 
  MapPin, User, ArrowRight, PackageOpen, ClipboardList, Info, ChevronDown
} from 'lucide-react';
import { 
  useERPStore, Supplier, PurchaseOrder, POStatus
} from '../../../../store/useERPStore';
import { getNextPOStatus, getPOStatusLabel } from '@/store/slices/supplierSlice';

type NavTab = 'directory' | 'purchase-orders' | 'receiving';
type DetailTab = 'info' | 'catalog' | 'po-history' | 'receiving-history' | 'performance';
type SupplierStatus = 'Active' | 'Inactive' | 'Blacklisted' | 'Verified' | 'Preferred';

function getStatusClasses(status: string) {
  switch (status) {
    case 'Active':      return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    case 'Verified':    return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    case 'Preferred':   return 'bg-indigo-50 text-indigo-700 border-indigo-100';
    case 'Inactive':    return 'bg-slate-50 text-slate-500 border-slate-200';
    case 'Blacklisted': return 'bg-rose-50 text-rose-700 border-rose-100';
    default:            return 'bg-slate-50 text-slate-500 border-slate-200';
  }
}

/** Maps POStatus to badge colors — aligned with new 6-stage lifecycle */
function getPOStatusClasses(status: string) {
  switch (status) {
    case 'DRAFT':      return 'bg-slate-100 text-slate-500 border-slate-200';
    case 'PENDING':    return 'bg-amber-50 text-amber-700 border-amber-100';
    case 'CONFIRMED':  return 'bg-blue-50 text-blue-700 border-blue-100';
    case 'IN_TRANSIT': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
    case 'DELIVERED':  return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    case 'CANCELLED':  return 'bg-rose-50 text-rose-700 border-rose-100';
    default:           return 'bg-slate-50 text-slate-500 border-slate-200';
  }
}

const PO_STEP_ICON: Record<string, string> = {
  DRAFT:      '',
  PENDING:    '',
  CONFIRMED:  '',
  IN_TRANSIT: '',
  DELIVERED:  '',
  CANCELLED:  '',
};

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(n);
}

export default function SuppliersPage() {
  const { 
    suppliers, purchaseOrders, purchaseOrderItems, goodsReceipts, 
    goodsReceiptItems, supplierItems, inventory, branches,
    addSupplier, updateSupplier, createPO, updatePOStatus, recordGoodsReceipt 
  } = useERPStore();

  const [navTab, setNavTab] = useState<NavTab>('directory');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>('info');
  const [deliveryFilter, setDeliveryFilter] = useState<string>('All');

  const [receiptPO, setReceiptPO] = useState<PurchaseOrder | null>(null);
  const [receiptStep, setReceiptStep] = useState(1);
  const [receiptForm, setReceiptForm] = useState<{
    items: { poi_id: string; item_id: string; qty: number; damaged_qty: number; cost: number; name: string }[];
    branch_id: string;
    notes: string;
    received_by: string;
    source_context: 'PO' | 'RECEIVING';
  }>({ items: [], branch_id: 'BRN-001', notes: '', received_by: 'STF-001', source_context: 'PO' });

  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [supplierForm, setSupplierForm] = useState({ 
    name: '', contact: '', email: '', phone: '', category: 'Fabric Supplier', 
    leadTime: 7, status: 'Active' as SupplierStatus, address: '', paymentTerms: 'Net 30' 
  });

  const [isCreatePOOpen, setIsCreatePOOpen] = useState(false);
  const [poSupplierId, setPOSupplierId] = useState('');
  const [poETA, setPOETA] = useState('');
  const [newPOItems, setNewPOItems] = useState<{ sku: string; qty: number; cost: number }[]>([{ sku: '', qty: 1, cost: 0 }]);

  const [blacklistTarget, setBlacklistTarget] = useState<Supplier | null>(null);


  const getSupplierName = (id: string) => suppliers.find(s => s.id === id)?.supplier_name || suppliers.find(s => s.id === id)?.name || id;
  const getInventoryItemName = (id: string) => inventory.find(i => i.id === id)?.item_name || inventory.find(i => i.id === id)?.item || id;
  const getBranchName = (id: string) => branches?.find(b => b.id === id)?.branchName || id;

  const openAddSupplier = (existing?: Supplier) => {
    setEditingSupplier(existing || null);
    setSupplierForm(existing
      ? { 
          name: existing.supplier_name || existing.name || '', 
          contact: existing.contact_person || existing.contact || '', 
          email: existing.email || '', 
          phone: existing.phone || '', 
          category: existing.category || 'Fabric Supplier', 
          leadTime: existing.lead_time_days || 7, 
          status: existing.status || 'Active',
          address: existing.address || '',
          paymentTerms: existing.payment_terms || 'Net 30'
        }
      : { 
          name: '', contact: '', email: '', phone: '', category: 'Fabric Supplier', 
          leadTime: 7, status: 'Active', address: '', paymentTerms: 'Net 30' 
        }
    );
    setIsAddSupplierOpen(true);
  };

  const handleSubmitSupplier = () => {
    if (!supplierForm.name.trim()) return;
    const mapped: Partial<Supplier> = {
      supplier_name: supplierForm.name,
      contact_person: supplierForm.contact,
      email: supplierForm.email,
      phone: supplierForm.phone,
      address: supplierForm.address,
      payment_terms: supplierForm.paymentTerms,
      lead_time_days: Number(supplierForm.leadTime),
      status: supplierForm.status,
      name: supplierForm.name,
      contact: supplierForm.contact
    };
    if (editingSupplier) {
      updateSupplier(editingSupplier.id, mapped);
    } else {
      addSupplier({ ...mapped, is_active: true } as Supplier);
    }
    setIsAddSupplierOpen(false);
  };

  const openReceiptModal = (po: PurchaseOrder, context: 'PO' | 'RECEIVING' = 'PO') => {
    const poItems = purchaseOrderItems.filter(poi => poi.purchase_order_id === po.id);
    setReceiptPO(po);
    setReceiptStep(1);
    setReceiptForm({
      items: poItems.map(poi => ({
        poi_id: poi.id,
        item_id: poi.inventory_item_id,
        name: getInventoryItemName(poi.inventory_item_id),
        qty: poi.qty_ordered - (poi.qty_received || 0),
        damaged_qty: 0,
        cost: poi.unit_cost
      })),
      branch_id: po.branch_id || 'BRN-001',
      notes: '',
      received_by: 'STF-001',
      source_context: context
    });
  };

  const handleSubmitReceipt = () => {
    if (!receiptPO) return;
    const itemsToReceive = receiptForm.items.filter(i => i.qty > 0);
    if (itemsToReceive.length === 0) return;

    recordGoodsReceipt({
      purchase_order_id: receiptPO.id,
      branch_id: receiptForm.branch_id,
      received_by_user_id: receiptForm.received_by,
      received_at: new Date().toISOString(),
      notes: receiptForm.notes
    },
    
    itemsToReceive.map(i => ({
      purchase_order_item_id: i.poi_id,
      inventory_item_id: i.item_id,
      qty_received: i.qty,
      qty_damaged: 0, 
      unit_cost: i.cost
    })));

    setReceiptPO(null);
  };

  const filteredSuppliers = useMemo(() =>
    suppliers.filter((s: Supplier) =>
      (s.supplier_name || s.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.status.toLowerCase().includes(searchQuery.toLowerCase())
    ), [suppliers, searchQuery]);

  const receivingOrders = useMemo(() =>
    purchaseOrders.filter((po: PurchaseOrder) => {
      const matchesFilter = deliveryFilter === 'All' ? true : po.status === deliveryFilter;
      // Show orders that are confirmed or in-transit (actionable inbound)
      const isReceivable = po.status === 'CONFIRMED' || po.status === 'IN_TRANSIT';
      return matchesFilter && (navTab === 'receiving' ? isReceivable : true);
    }), [purchaseOrders, deliveryFilter, navTab]);

  return (
    <div className="space-y-0 animate-in fade-in duration-500 max-w-[1400px] mx-auto pb-20">

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight leading-none">Suppliers</h1>
          <p className="text-[14px] text-slate-500 font-medium mt-1">Manage vendor relationships and procurement logistics.</p>
        </div>
        <button onClick={() => openAddSupplier()} className="h-10 px-5 bg-slate-900 text-white rounded-full flex items-center gap-2 text-[12px] font-bold hover:bg-indigo-600 transition-all shadow-md active:scale-95">
          <Plus size={14} /> New Supplier
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Suppliers', val: suppliers.length,                                                                                                          color: 'indigo', sub: 'Active Directory' },
          { label: 'Total Payables',  val: formatCurrency(purchaseOrders.filter(p => p.status !== 'CANCELLED' && p.status !== 'DRAFT').reduce((sum, po) => sum + (po.total_amount - po.amount_paid), 0)), color: 'rose',    sub: 'Accounts Payable' },
          { label: 'Active Orders',   val: purchaseOrders.filter(p => ['PENDING','CONFIRMED','IN_TRANSIT'].includes(p.status)).length,                                color: 'amber',   sub: 'In Progress' },
          { label: 'Delivered POs',   val: purchaseOrders.filter(p => p.status === 'DELIVERED').length,                                                              color: 'emerald', sub: 'Goods Received' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</div>
            <div className="text-[24px] font-black text-slate-900 tracking-tight">{stat.val}</div>
            <div className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* MASTER PROCUREMENT CONTAINER */}
      <div className="bg-white border border-slate-200 rounded-[32px] shadow-sm overflow-hidden">
        {/* INTEGRATED HEADER: SEARCH (LEFT) & TABS (RIGHT) */}
        <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between gap-8">
          {/* SEARCH (LEFT) */}
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
              type="text" 
              placeholder="Search suppliers..." 
              className="h-10 w-full pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-[13px] font-bold outline-none focus:border-slate-900 transition-all shadow-sm" 
            />
          </div>

          {/* TABS (RIGHT) */}
          <div className="flex items-center gap-1.5 bg-slate-200/50 p-1 rounded-xl w-fit border border-slate-200/60 shadow-inner">
            {[
              { id: 'directory' as NavTab, label: 'Supplier Directory', icon: <Building2 size={14} /> },
              { id: 'purchase-orders' as NavTab, label: 'Supplier Orders', icon: <FileText size={14} /> },
              { id: 'receiving' as NavTab, label: 'Delivery Confirmation', icon: <PackageCheck size={14} /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setNavTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-2 text-[11px] font-black rounded-lg transition-all duration-300 uppercase tracking-widest ${navTab === tab.id ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/50' : 'text-slate-400 hover:text-slate-600 hover:bg-white/40'}`}
              >
                {tab.icon}{tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* TAB CONTENT */}

      {navTab === 'directory' && (
        <>
          <div className="pt-2"></div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                <th className="px-6 py-4 rounded-tl-[32px]">
                  <div className="flex items-center gap-2 cursor-pointer hover:text-slate-900 transition-colors">
                    Supplier <ChevronDown size={12} className="text-slate-300" />
                  </div>
                </th>
                <th className="px-6 py-4">
                  <div className="flex items-center gap-2 cursor-pointer hover:text-slate-900 transition-colors">
                    Category <ChevronDown size={12} className="text-slate-300" />
                  </div>
                </th>
                <th className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2 cursor-pointer hover:text-slate-900 transition-colors">
                    Lead Time <ChevronDown size={12} className="text-slate-300" />
                  </div>
                </th>
                <th className="px-6 py-4">
                  <div className="flex items-center gap-2 cursor-pointer hover:text-slate-900 transition-colors">
                    Terms <ChevronDown size={12} className="text-slate-300" />
                  </div>
                </th>
                <th className="px-6 py-4">
                  <div className="flex items-center gap-2 cursor-pointer hover:text-slate-900 transition-colors">
                    Status <ChevronDown size={12} className="text-slate-300" />
                  </div>
                </th>
                <th className="px-6 py-4 text-right rounded-tr-[32px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredSuppliers.map(sup => (
                <tr key={sup.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-6 py-4">
                    <div className="text-[14px] font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{sup.supplier_name || sup.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono uppercase tracking-tight">{sup.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg">{sup.category || 'General'}</span>
                  </td>
                  <td className="px-6 py-4 text-center text-[13px] font-bold text-slate-700">{sup.lead_time_days || sup.leadTime || 0}d</td>
                  <td className="px-6 py-4 text-[12px] font-medium text-slate-500 italic">{sup.payment_terms || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-widest ${getStatusClasses(sup.status)}`}>{sup.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => { setSelectedSupplier(sup); setDetailTab('info'); }}
                      className="h-8 px-4 rounded-full bg-white border border-slate-200 text-[11px] font-bold hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {navTab === 'purchase-orders' && (
        <>
          <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <div>
              <h3 className="text-[13px] font-black text-slate-900 tracking-widest uppercase flex items-center gap-2"><ClipboardList size={16} className="text-slate-400" /> Purchase Orders</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Manually advance each PO through the lifecycle. Delivery confirmation triggers Goods Receipt.</p>
            </div>
            <button onClick={() => setIsCreatePOOpen(true)} className="h-9 px-4 bg-slate-900 text-white rounded-full text-[12px] font-bold flex items-center gap-2 hover:bg-indigo-600 transition-all">
              <Plus size={14} /> Create New PO
            </button>
          </div>

          {/* PO Lifecycle legend */}
          <div className="px-8 py-3 flex items-center gap-2 border-b border-slate-100 bg-slate-50/30">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mr-2">Lifecycle:</span>
            {(['DRAFT','PENDING','CONFIRMED','IN_TRANSIT','DELIVERED'] as POStatus[]).map((s, i, arr) => (
              <div key={s} className="flex items-center gap-2">
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border uppercase tracking-widest ${getPOStatusClasses(s)}`}>{getPOStatusLabel(s)}</span>
                {i < arr.length - 1 && <span className="text-slate-300 text-[10px]">→</span>}
              </div>
            ))}
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                <th className="px-6 py-4">PO ID</th>
                <th className="px-6 py-4">Supplier</th>
                <th className="px-6 py-4 text-center">SKUs</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">ETA</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {purchaseOrders.map(po => {
                const itemsCount = purchaseOrderItems.filter(i => i.purchase_order_id === po.id).length;
                const nextStatus = getNextPOStatus(po.status as POStatus);
                return (
                  <tr key={po.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-6 py-4">
                      <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{po.id}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{new Date(po.requested_at).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 text-[14px] font-bold text-slate-900">{getSupplierName(po.supplier_id)}</td>
                    <td className="px-6 py-4 text-center text-[13px] font-bold text-slate-600">{itemsCount}</td>
                    <td className="px-6 py-4 text-[14px] font-black text-slate-900">{formatCurrency(po.total_amount)}</td>
                    <td className="px-6 py-4 text-[12px] font-medium text-slate-500 flex items-center gap-1.5">
                      <Clock size={12} className="text-slate-300" />
                      {po.expected_delivery_date ? new Date(po.expected_delivery_date).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-widest flex items-center gap-1 w-max ${getPOStatusClasses(po.status)}`}>
                        {getPOStatusLabel(po.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {nextStatus && po.status !== 'DELIVERED' && po.status !== 'CANCELLED' && (
                          <button
                            onClick={() => updatePOStatus(po.id, nextStatus, 'STF-001')}
                            className={`h-8 px-3 rounded-full text-[10px] font-black border transition-all active:scale-95 ${
                              nextStatus === 'DELIVERED'
                                ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-200'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900'
                            }`}
                          >
                            {nextStatus === 'DELIVERED' ? '📦 Mark Delivered' : `→ ${getPOStatusLabel(nextStatus)}`}
                          </button>
                        )}
                        {po.status === 'IN_TRANSIT' && (
                          <button onClick={() => openReceiptModal(po, 'PO')} className="h-8 px-3 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-black hover:bg-indigo-600 hover:text-white transition-all">
                            Receive Items
                          </button>
                        )}
                        {po.status !== 'DELIVERED' && po.status !== 'CANCELLED' && (
                          <button
                            onClick={() => updatePOStatus(po.id, 'CANCELLED', 'STF-001')}
                            className="h-8 px-3 rounded-full text-[10px] font-black border border-transparent text-slate-300 hover:text-rose-500 hover:border-rose-100 hover:bg-rose-50 transition-all"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}

      {navTab === 'receiving' && (
        <>
          <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
            <div>
              <h3 className="text-[13px] font-black text-slate-900 tracking-widest uppercase">Inbound Shipments — Goods Receipt</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">POs confirmed or in-transit. Process intake to update raw material stock.</p>
            </div>
            <div className="flex items-center gap-2">
              <select value={deliveryFilter} onChange={e => setDeliveryFilter(e.target.value)} className="h-9 px-4 rounded-xl border border-slate-200 text-[11px] font-black outline-none focus:border-slate-900 transition-all bg-white shadow-sm">
                <option value="All">All Inbound</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="IN_TRANSIT">In Transit</option>
              </select>
            </div>
          </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                  <th className="px-6 py-4">PO Reference</th>
                  <th className="px-6 py-4">Supplier</th>
                  <th className="px-6 py-4">Line Items</th>
                  <th className="px-6 py-4">Progress</th>
                  <th className="px-6 py-4">Dest. Branch</th>
                  <th className="px-6 py-4">Expected ETA</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {receivingOrders.length === 0 ? (
                  <tr><td colSpan={7} className="px-6 py-20 text-center text-slate-400 italic text-[13px]">No pending shipments found.</td></tr>
                ) : receivingOrders.map(po => {
                  const items = purchaseOrderItems.filter(i => i.purchase_order_id === po.id);
                  const receivedSum = items.reduce((s, i) => s + (i.qty_received || 0), 0);
                  const orderedSum = items.reduce((s, i) => s + i.qty_ordered, 0);
                  const progress = Math.round((receivedSum / (orderedSum || 1)) * 100);

                  return (
                    <tr key={po.id} className="hover:bg-slate-50/50 transition-all">
                      <td className="px-6 py-4">
                        <div className="text-[13px] font-black text-slate-900">{po.id}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{po.requested_at.split('T')[0]}</div>
                      </td>
                      <td className="px-6 py-4 text-[14px] font-bold text-slate-900">{getSupplierName(po.supplier_id)}</td>
                      <td className="px-6 py-4">
                        <div className="text-[13px] font-bold text-slate-700">{items.length} SKUs</div>
                        <div className="text-[11px] text-slate-500 font-medium">Total: {orderedSum} units</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 transition-all" style={{ width: `${progress}%` }} />
                          </div>
                          <span className="text-[11px] font-black text-slate-900">{progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-[12px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg w-fit border border-indigo-100/50">
                          <MapPin size={12} /> {getBranchName(po.branch_id)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[13px] font-medium text-slate-600 flex items-center gap-2">
                        <Clock size={13} className="text-slate-400" />{po.expected_delivery_date || po.eta || 'ASAP'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => openReceiptModal(po, 'RECEIVING')} className="h-9 px-5 rounded-full bg-slate-900 text-white text-[11px] font-black hover:bg-emerald-600 transition-all shadow-md active:scale-95 flex items-center gap-2 justify-end ml-auto">
                          Process Intake <ChevronRight size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
        </>
      )}
    </div>

      {selectedSupplier && (
        <div className="fixed inset-0 z-120 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setSelectedSupplier(null)}>
          <div className="bg-white w-full max-w-[980px] h-[92vh] rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-10 py-8 border-b border-slate-100 bg-slate-50/30">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-[20px] font-black">
                  {selectedSupplier.supplier_name?.charAt(0) || selectedSupplier.name?.charAt(0)}
                </div>
                <div>
                  <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{selectedSupplier.id}</div>
                  <h2 className="text-[24px] font-black text-slate-900 leading-tight">{selectedSupplier.supplier_name || selectedSupplier.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-md border uppercase tracking-widest ${getStatusClasses(selectedSupplier.status)}`}>{selectedSupplier.status}</span>
                    <span className="text-[11px] text-slate-500 font-bold">•</span>
                    <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wide">{selectedSupplier.category || 'General Supplier'}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedSupplier(null)} className="w-12 h-12 flex items-center justify-center hover:bg-slate-100 rounded-full text-slate-400 transition-all group">
                <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            <div className="flex items-center gap-8 px-10 border-b border-slate-100 bg-white">
              {[
                { id: 'info' as DetailTab, label: 'Company Profile', icon: <Info size={14} /> },
                { id: 'catalog' as DetailTab, label: 'Supplier Catalog', icon: <PackageOpen size={14} /> },
                { id: 'po-history' as DetailTab, label: 'Purchase History', icon: <ClipboardList size={14} /> },
                { id: 'receiving-history' as DetailTab, label: 'Goods Receipts', icon: <History size={14} /> },
                { id: 'performance' as DetailTab, label: 'Analytics', icon: <BarChart3 size={14} /> },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setDetailTab(tab.id)}
                  className={`flex items-center gap-2 py-5 text-[13px] font-black border-b-2 transition-all ${detailTab === tab.id ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-700'}`}
                >
                  {tab.icon}{tab.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-8 bg-slate-50/20">
              {detailTab === 'info' && (
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-[13px] font-black text-slate-400 uppercase tracking-widest border-l-4 border-indigo-500 pl-3">Contact Details</h3>
                    <div className="grid gap-4">
                      {[
                        { label: 'Primary Contact', val: selectedSupplier.contact_person || selectedSupplier.contact, icon: <User size={16} /> },
                        { label: 'Official Email', val: selectedSupplier.email, icon: <Mail size={16} /> },
                        { label: 'Phone Number', val: selectedSupplier.phone, icon: <Phone size={16} /> },
                        { label: 'Physical Address', val: selectedSupplier.address || 'N/A', icon: <MapPin size={16} /> },
                      ].map(({ label, val, icon }) => (
                        <div key={label} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{icon}{label}</div>
                          <div className="text-[15px] font-bold text-slate-900">{val}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-[13px] font-black text-slate-400 uppercase tracking-widest border-l-4 border-indigo-500 pl-3">Supply Settings</h3>
                    <div className="grid gap-4">
                      {[
                        { label: 'Payment Terms', val: selectedSupplier.payment_terms || 'Net 30', icon: <FileText size={16} /> },
                        { label: 'Standard Lead Time', val: `${selectedSupplier.lead_time_days || 7} Days`, icon: <Clock size={16} /> },
                      ].map(({ label, val, icon }) => (
                        <div key={label} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{icon}{label}</div>
                          <div className="text-[15px] font-bold text-slate-900">{val}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {detailTab === 'catalog' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[16px] font-black text-slate-900 tracking-tight">Supplied Materials & Items</h3>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">{supplierItems.filter(si => si.supplier_id === selectedSupplier.id).length} Linked Items</span>
                  </div>
                  <div className="grid gap-3">
                    {supplierItems.filter(si => si.supplier_id === selectedSupplier.id).map((si, idx) => {
                      const item = inventory.find(i => i.id === si.inventory_item_id);
                      return (
                        <div key={idx} className="bg-white border border-slate-100 p-5 rounded-2xl flex items-center justify-between shadow-sm hover:border-indigo-200 transition-all group">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-all"><PackageCheck size={24} /></div>
                            <div>
                              <div className="text-[14px] font-black text-slate-900">{item?.item_name || item?.item || 'Unknown Item'}</div>
                              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-tight">{item?.sku || si.inventory_item_id}</div>
                            </div>
                          </div>
                          <div className="text-right flex items-center gap-8">
                            <div>
                              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Unit Cost</div>
                              <div className="text-[15px] font-black text-slate-900">{formatCurrency(si.unit_cost)}</div>
                            </div>
                            <div>
                              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Min Order</div>
                              <div className="text-[14px] font-bold text-slate-700">{si.moq} units</div>
                            </div>
                            {si.is_preferred && (
                              <div className="px-3 py-1 bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-black rounded-lg uppercase tracking-widest">Preferred</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {detailTab === 'po-history' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[16px] font-black text-slate-900 tracking-tight">Supplier Orders Timeline</h3>
                  </div>
                  <div className="space-y-4">
                    {purchaseOrders.filter(po => po.supplier_id === selectedSupplier.id).map(po => {
                      const items = purchaseOrderItems.filter(i => i.purchase_order_id === po.id);
                      return (
                        <div key={po.id} className="bg-white border border-slate-100 p-6 rounded-[24px] shadow-sm relative overflow-hidden group">
                          <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${po.status === 'DELIVERED' ? 'bg-emerald-500' : po.status === 'CANCELLED' ? 'bg-rose-400' : 'bg-amber-500'}`} />
                          <div className="flex items-start justify-between">
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{po.id}</span>
                                <span className="text-slate-200 text-[12px]">•</span>
                                <span className="text-[12px] font-bold text-slate-500">{new Date(po.requested_at).toLocaleDateString()}</span>
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border uppercase tracking-widest ${getPOStatusClasses(po.status)}`}>{po.status}</span>
                              </div>
                              <div className="text-[18px] font-black text-slate-900">{formatCurrency(po.total_amount)}</div>
                              <div className="flex gap-4">
                                {items.slice(0, 3).map((item, i) => (
                                  <div key={i} className="text-[11px] text-slate-500 font-medium bg-slate-50 px-2 py-1 rounded-md border border-slate-100 italic">
                                    {getInventoryItemName(item.inventory_item_id)} (x{item.qty_ordered})
                                  </div>
                                ))}
                                {items.length > 3 && <div className="text-[11px] text-slate-400 font-black">+ {items.length - 3} more</div>}
                              </div>
                            </div>
                            <div className="text-right space-y-2">
                              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Status</div>
                              <div className={`text-[13px] font-black ${po.total_amount - po.amount_paid > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                {po.total_amount - po.amount_paid > 0 ? `Unpaid: ${formatCurrency(po.total_amount - po.amount_paid)}` : 'Fully Settled'}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {detailTab === 'receiving-history' && (
                <div className="space-y-4">
                  <h3 className="text-[16px] font-black text-slate-900 tracking-tight">Delivery Confirmation Ledger</h3>
                  <div className="grid gap-4">
                    {goodsReceipts.filter(gr => {
                      const po = purchaseOrders.find(p => p.id === gr.purchase_order_id);
                      return po?.supplier_id === selectedSupplier.id;
                    }).map(gr => {
                      const items = goodsReceiptItems.filter(gri => gri.goods_receipt_id === gr.id);
                      return (
                        <div key={gr.id} className="bg-white border border-slate-100 p-6 rounded-[24px] shadow-sm flex items-center justify-between group hover:border-emerald-200 transition-all">
                          <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all"><CheckCircle2 size={24} /></div>
                            <div>
                              <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{gr.id} <span className="mx-1">•</span> REF: {gr.purchase_order_id}</div>
                              <div className="text-[14px] font-black text-slate-900">Received {items.reduce((s, i) => s + i.qty_received, 0)} units across {items.length} materials</div>
                              <div className="text-[11px] text-slate-500 font-medium mt-1 flex items-center gap-2">
                                <MapPin size={11} /> {getBranchName(gr.branch_id)} <span className="mx-1">•</span> <User size={11} /> Recipient: {gr.received_by_user_id}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-[12px] font-bold text-slate-900">{new Date(gr.received_at).toLocaleDateString()}</div>
                            <div className="text-[11px] text-slate-400 font-medium italic mt-1 max-w-[200px] truncate">{gr.notes || 'No quality issues noted.'}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {detailTab === 'performance' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="bg-white border border-slate-100 p-8 rounded-[32px] text-center shadow-sm">
                      <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Quality Rating</div>
                      <div className="text-[42px] font-black text-slate-900">4.8</div>
                      <div className="flex justify-center gap-1 mt-2">
                        {[1, 2, 3, 4, 5].map(s => <div key={s} className={`w-1.5 h-1.5 rounded-full ${s <= 4 ? 'bg-indigo-500' : 'bg-slate-200'}`} />)}
                      </div>
                    </div>
                    <div className="bg-white border border-slate-100 p-8 rounded-[32px] text-center shadow-sm">
                      <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Avg Lead Time</div>
                      <div className="text-[42px] font-black text-slate-900">{selectedSupplier.lead_time_days || 7}</div>
                      <div className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2">Days to Receive</div>
                    </div>
                    <div className="bg-white border border-slate-100 p-8 rounded-[32px] text-center shadow-sm">
                      <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Fulfillment %</div>
                      <div className="text-[42px] font-black text-slate-900">98%</div>
                      <div className="text-[11px] text-emerald-500 font-bold uppercase tracking-widest mt-2">Target: 95%</div>
                    </div>
                  </div>
                  <div className="bg-indigo-900 text-white p-8 rounded-[32px] shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10"><BarChart3 size={120} /></div>
                    <h4 className="text-[18px] font-black mb-2 flex items-center gap-2 relative z-10"><PackageCheck size={20} /> Audit-Ready Supplier Orders</h4>
                    <p className="text-indigo-100 text-[14px] leading-relaxed max-w-xl relative z-10">
                      Sutura enforces immutable record-keeping. Every receipt for <strong>{selectedSupplier.supplier_name || selectedSupplier.name}</strong> is cross-verified with branch inventory stocks and financial ledger. 
                      Partial deliveries are flagged for issue follow-ups automatically.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="px-10 py-8 border-t border-slate-100 bg-white flex items-center justify-between">
              <button onClick={() => setBlacklistTarget(selectedSupplier)} className="h-12 px-6 rounded-full text-rose-600 font-black text-[13px] hover:bg-rose-50 transition-all border border-rose-100/50">
                Blacklist Vendor
              </button>
              <div className="flex items-center gap-3">
                <button onClick={() => openAddSupplier(selectedSupplier)} className="h-12 px-8 rounded-full bg-white border border-slate-200 text-slate-900 font-black text-[13px] hover:bg-slate-50 transition-all shadow-sm">Edit Profile</button>
                <button onClick={() => { setIsCreatePOOpen(true); setPOSupplierId(selectedSupplier.id); setSelectedSupplier(null); }} className="h-12 px-8 rounded-full bg-slate-900 text-white font-black text-[13px] hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/20 active:scale-95 flex items-center gap-2">
                  <Plus size={16} /> Issue Purchase Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {receiptPO && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[640px] rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
            <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
              <div>
                <h3 className="text-[18px] font-black text-slate-900 tracking-tight">
                  {receiptForm.source_context === 'RECEIVING' ? 'Inbound Shipment Verification' : 'Order Fulfillment Intake'}
                </h3>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mt-1">Ref: {receiptPO.id} <span className="mx-2">•</span> Step {receiptStep} of 3</p>
              </div>
              <button onClick={() => setReceiptPO(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-all"><X size={20} /></button>
            </div>

            <div className="p-8 flex-1 overflow-y-auto">
              {receiptStep === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-100 rounded-2xl text-amber-800">
                    <AlertCircle size={20} className="shrink-0" />
                    <p className="text-[12px] font-medium leading-relaxed">Please count and verify the physical items received. Enter the exact quantity delivered to update branch stock levels.</p>
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-[1.5fr_60px_60px_90px_90px_60px] gap-3 px-3">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Item Description</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Ordered</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Prev.</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center text-indigo-600">Arrived</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center text-rose-500">Damaged</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Pending</span>
                    </div>
                    {receiptForm.items.map((item, idx) => {
                      const poi = purchaseOrderItems.find(p => p.id === item.poi_id);
                      const ordered = poi?.qty_ordered || 0;
                      const prev = poi?.qty_received || 0;
                      const arrived = item.qty;
                      const damaged = item.damaged_qty;
                      const remaining = Math.max(0, ordered - prev - arrived);
                      const maxReceivable = ordered - prev;

                      return (
                        <div key={idx} className="grid grid-cols-[1.5fr_60px_60px_90px_90px_60px] gap-3 items-center p-3 border border-slate-100 rounded-2xl bg-white shadow-sm hover:border-indigo-200 transition-all">
                          <div>
                            <div className="text-[13px] font-black text-slate-900">{item.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">SKU: {item.item_id.split('-').pop()}</div>
                          </div>
                          <div className="text-center text-[13px] font-bold text-slate-400">{ordered}</div>
                          <div className="text-center text-[13px] font-bold text-slate-400">{prev}</div>
                          <div className="px-1">
                            <input 
                              type="number" 
                              min={0}
                              max={maxReceivable}
                              value={item.qty} 
                              onChange={e => {
                                const val = Math.min(maxReceivable, Math.max(0, Number(e.target.value)));
                                setReceiptForm(p => ({...p, items: p.items.map((it, i) => i === idx ? {...it, qty: val} : it)}));
                              }}
                              className="h-10 w-full rounded-xl border-2 border-indigo-100 bg-indigo-50/30 text-center text-[14px] font-black text-indigo-700 focus:bg-white focus:border-indigo-600 transition-all outline-none" 
                            />
                          </div>
                          <div className="px-1">
                            <input 
                              type="number" 
                              min={0}
                              max={item.qty}
                              value={item.damaged_qty} 
                              onChange={e => {
                                const val = Math.min(item.qty, Math.max(0, Number(e.target.value)));
                                setReceiptForm(p => ({...p, items: p.items.map((it, i) => i === idx ? {...it, damaged_qty: val} : it)}));
                              }}
                              className="h-10 w-full rounded-xl border-2 border-rose-100 bg-rose-50/30 text-center text-[14px] font-black text-rose-700 focus:bg-white focus:border-rose-600 transition-all outline-none" 
                            />
                          </div>
                          <div className={`text-center text-[13px] font-black ${remaining > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                            {remaining === 0 ? 'FIXED' : remaining}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {receiptStep === 2 && (
                <div className="space-y-6">
                  <div className="grid gap-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">Destination Branch</label>
                        {receiptForm.branch_id !== receiptPO.branch_id ? (
                          <span className="text-[9px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full uppercase animate-pulse">Diverted Shipment</span>
                        ) : (
                          <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase">Target Destination</span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {branches?.map(b => {
                          const isTarget = b.id === receiptPO.branch_id;
                          const isSelected = receiptForm.branch_id === b.id;
                          
                          return (
                            <button
                              key={b.id}
                              onClick={() => setReceiptForm(p => ({...p, branch_id: b.id}))}
                              className={`relative flex items-center gap-3 p-4 rounded-2xl border-2 transition-all 
                                ${isSelected ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-sm' : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'}
                              `}
                            >
                              {isTarget && (
                                <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full shadow-sm ring-2 ring-white uppercase tracking-tighter">
                                  Original Requester
                                </div>
                              )}
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'}`}><Building2 size={14} /></div>
                              <div className="text-left">
                                <div className="text-[13px] font-black leading-none mb-1">{b.branchName}</div>
                                <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 flex items-center gap-1">
                                  <span className={`w-1.5 h-1.5 rounded-full ${b.branch_type === 'MAIN' ? 'bg-indigo-400' : 'bg-slate-400'}`} />
                                  {b.branch_type}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {receiptForm.branch_id !== receiptPO.branch_id && (
                        <div className="animate-in slide-in-from-top-2 duration-300">
                          <label className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1.5 block">Reason for Redirection</label>
                          <textarea 
                            value={receiptForm.notes}
                            onChange={e => setReceiptForm(p => ({...p, notes: e.target.value}))}
                            placeholder="Why is this being diverted? (e.g. Branch closed due to weather)"
                            className="w-full h-20 p-3 rounded-xl border-2 border-rose-100 bg-rose-50/30 text-[12px] font-medium focus:bg-white focus:border-rose-300 outline-none transition-all resize-none"
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Inspector / Received By</label>
                      <select 
                        value={receiptForm.received_by} 
                        onChange={e => setReceiptForm(p => ({...p, received_by: e.target.value}))}
                        className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-bold"
                      >
                        <option value="STF-001">Admin (Chief Operations)</option>
                        <option value="STF-002">Warehouse Manager</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Quality / Receiving Issues Notes</label>
                      <textarea 
                        value={receiptForm.notes} 
                        onChange={e => setReceiptForm(p => ({...p, notes: e.target.value}))}
                        placeholder="e.g. 2 units of Italian Silk damaged on arrival. Contacting supplier for replacement." 
                        className="w-full h-24 p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[13px] font-medium resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {receiptStep === 3 && (
                <div className="space-y-8 py-4">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce"><PackageCheck size={32} /></div>
                    <h4 className="text-[20px] font-black text-slate-900">Review Intake Summary</h4>
                    <p className="text-[13px] text-slate-500">Confirm the details below to finalize the stock movement.</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-[28px] overflow-hidden divide-y divide-slate-200/60">
                    <div className="p-6 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center"><Building2 size={18} /></div>
                        <div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Receiving Branch</div>
                          <div className="text-[14px] font-black text-slate-900">{getBranchName(receiptForm.branch_id)}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Intake Metrics</div>
                        <div className="text-[15px] font-black text-slate-900">{receiptForm.items.reduce((s, i) => s + i.qty, 0)} Arrived</div>
                        {receiptForm.items.reduce((s, i) => s + i.damaged_qty, 0) > 0 && (
                          <div className="text-[11px] font-bold text-rose-600">-{receiptForm.items.reduce((s, i) => s + i.damaged_qty, 0)} Damaged</div>
                        )}
                      </div>
                    </div>
                    <div className="p-6 space-y-3">
                      {receiptForm.items.filter(i => i.qty > 0).map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-[13px] font-bold">
                          <div>
                            <span className="text-slate-500">{item.name}</span>
                            {item.damaged_qty > 0 && <span className="ml-2 text-[10px] text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded-md uppercase tracking-tight">Contains {item.damaged_qty} Damaged</span>}
                          </div>
                          <span className="text-slate-900">+ {item.qty - item.damaged_qty} effective units</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-700">
                    <CheckCircle2 size={18} className="shrink-0" />
                    <p className="text-[11px] font-bold leading-relaxed italic">Confirming this receipt will generate immutable INVENTORY_MOVEMENT records and update branch stock levels instantly.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-between gap-3">
              <button 
                onClick={() => receiptStep === 1 ? setReceiptPO(null) : setReceiptStep(p => p - 1)} 
                className="h-12 px-6 bg-white border border-slate-200 rounded-full text-[13px] font-black text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
              >
                {receiptStep === 1 ? 'Cancel' : 'Back'}
              </button>
              <button 
                onClick={() => receiptStep === 3 ? handleSubmitReceipt() : setReceiptStep(p => p + 1)}
                className={`h-12 px-10 rounded-full text-[13px] font-black transition-all shadow-xl active:scale-95 flex items-center gap-2 ${receiptStep === 3 ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200' : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-slate-200'}`}
              >
                {receiptStep === 3 ? 'Finalize Receipt' : 'Continue'} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {isCreatePOOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-[720px] max-h-[90vh] rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div>
                <h2 className="text-[20px] font-black text-slate-900 tracking-tight">Create Purchase Order</h2>
                <p className="text-[13px] text-slate-500 font-medium italic">Issue an official procurement request to a supplier.</p>
              </div>
              <button onClick={() => setIsCreatePOOpen(false)} className="w-12 h-12 flex items-center justify-center hover:bg-slate-100 rounded-full text-slate-400 transition-all"><X size={24} /></button>
            </div>
            <div className="p-8 space-y-6 overflow-y-auto flex-1 bg-slate-50/10">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Supplier Selection *</label>
                  <select value={poSupplierId} onChange={e => setPOSupplierId(e.target.value)} className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-bold shadow-sm">
                    <option value="" disabled>Choose a verified supplier</option>
                    {suppliers.filter(s => s.status !== 'Blacklisted').map(s => <option key={s.id} value={s.id}>{s.supplier_name || s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Target Delivery Branch</label>
                  <select className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-bold shadow-sm">
                    {branches?.map(b => <option key={b.id} value={b.id}>{b.branchName}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Requested ETA</label>
                  <input type="date" value={poETA} onChange={e => setPOETA(e.target.value)} className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-bold shadow-sm" />
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between border-l-4 border-indigo-500 pl-4">
                  <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-widest">Line Item Materials</h3>
                  <button onClick={() => setNewPOItems(prev => [...prev, { sku: '', qty: 1, cost: 0 }])} className="h-8 px-4 rounded-lg bg-indigo-50 text-indigo-700 text-[11px] font-black hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-2">
                    <Plus size={14} /> Add SKU
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-[1fr_80px_120px_48px] gap-3 px-4">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Select Material</span>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Qty</span>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Unit Cost (PHP)</span>
                    <span />
                  </div>
                  {newPOItems.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-[1fr_80px_120px_48px] gap-3 items-center bg-white p-3 rounded-2xl border border-slate-100 shadow-sm group hover:border-indigo-200 transition-all">
                      <select value={item.sku} onChange={e => setNewPOItems(p => p.map((it, i) => i === idx ? {...it, sku: e.target.value} : it))} className="h-11 px-3 rounded-xl border border-slate-100 bg-slate-50 text-[13px] font-bold outline-none focus:bg-white focus:border-slate-900 transition-all">
                        <option value="" disabled>Select Material</option>
                        {inventory.filter(i => (i.category || i.cat) !== 'Finished Goods').map(i => <option key={i.id} value={i.id}>{i.item_name || i.item}</option>)}
                      </select>
                      <input type="number" value={item.qty} onChange={e => setNewPOItems(p => p.map((it, i) => i === idx ? {...it, qty: Number(e.target.value)} : it))} className="h-11 rounded-xl border border-slate-100 bg-slate-50 text-center text-[14px] font-black outline-none focus:bg-white focus:border-slate-900 transition-all" />
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] font-black text-slate-400">₱</span>
                        <input type="number" value={item.cost} onChange={e => setNewPOItems(p => p.map((it, i) => i === idx ? {...it, cost: Number(e.target.value)} : it))} className="h-11 w-full pl-7 pr-3 rounded-xl border border-slate-100 bg-slate-50 text-right text-[14px] font-black outline-none focus:bg-white focus:border-slate-900 transition-all" />
                      </div>
                      <button onClick={() => setNewPOItems(p => p.filter((_, i) => i !== idx))} className="h-11 w-11 flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="p-6 bg-slate-900 rounded-[28px] text-white flex items-center justify-between shadow-xl">
                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Estimated PO Total</div>
                    <div className="text-[24px] font-black">{formatCurrency(newPOItems.reduce((s, i) => s + (i.qty * i.cost), 0))}</div>
                  </div>
                  <div className="text-right text-slate-400 text-[11px] font-medium italic max-w-[200px]">
                    Note: Final billing may differ based on suppliers current pricing at fulfillment.
                  </div>
                </div>
              </div>
            </div>
            <div className="p-8 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setIsCreatePOOpen(false)} className="px-8 h-12 bg-white border border-slate-200 rounded-full text-[14px] font-black text-slate-600 hover:bg-slate-50 transition-all">Discard Draft</button>
              <button 
                onClick={() => {
                  createPO(
                    {
                      supplier_id: poSupplierId,
                      expected_delivery_date: poETA,
                      total_amount: newPOItems.reduce((s, i) => s + (i.qty * i.cost), 0),
                    },
                    // Line items passed separately so createPO can store them properly
                    newPOItems.filter(i => i.sku && i.qty > 0).map(i => ({
                      inventory_item_id: i.sku,
                      qty_ordered: i.qty,
                      unit_cost: i.cost,
                    }))
                  );
                  setIsCreatePOOpen(false);
                  setNewPOItems([{ sku: '', qty: 1, cost: 0 }]);
                  setPOSupplierId('');
                  setPOETA('');
                }} 
                disabled={!poSupplierId || newPOItems.some(i => !i.sku || i.qty <= 0)} 
                className="px-10 h-12 bg-slate-900 text-white rounded-full text-[14px] font-black shadow-2xl shadow-indigo-200 hover:bg-indigo-600 transition-all disabled:opacity-30 active:scale-95 flex items-center gap-2"
              >
                <FileText size={18} /> Save as Draft
              </button>
            </div>
          </div>
        </div>
      )}

      {isAddSupplierOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-[640px] rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div>
                <h2 className="text-[20px] font-black text-slate-900 tracking-tight">{editingSupplier ? 'Modify Vendor Profile' : 'Register New Vendor'}</h2>
                <p className="text-[13px] text-slate-500 font-medium">Capture essential supplier details for procurement audits.</p>
              </div>
              <button onClick={() => setIsAddSupplierOpen(false)} className="w-12 h-12 flex items-center justify-center hover:bg-slate-100 rounded-full text-slate-400 transition-all"><X size={24} /></button>
            </div>
            <div className="p-8 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Company Legal Name *</label>
                  <input type="text" value={supplierForm.name} onChange={e => setSupplierForm(p => ({...p, name: e.target.value}))} placeholder="e.g. Global Textile Innovations Inc." className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-bold" />
                </div>
                <div>
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Account Representative</label>
                  <input type="text" value={supplierForm.contact} onChange={e => setSupplierForm(p => ({...p, contact: e.target.value}))} placeholder="e.g. Maria Clara" className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-medium" />
                </div>
                <div>
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Category</label>
                  <select value={supplierForm.category} onChange={e => setSupplierForm(p => ({...p, category: e.target.value}))} className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-bold">
                    {['Fabric Supplier','Thread Supplier','Accessories Supplier','Mixed Materials','Service Provider'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Email Address</label>
                  <input type="email" value={supplierForm.email} onChange={e => setSupplierForm(p => ({...p, email: e.target.value}))} placeholder="sales@vendor.com" className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-medium" />
                </div>
                <div>
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Contact Number</label>
                  <input type="text" value={supplierForm.phone} onChange={e => setSupplierForm(p => ({...p, phone: e.target.value}))} placeholder="+63 XXX XXX XXXX" className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-medium" />
                </div>
                <div>
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Standard Lead Time (Days)</label>
                  <input type="number" value={supplierForm.leadTime} onChange={e => setSupplierForm(p => ({...p, leadTime: Number(e.target.value)}))} className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-bold" />
                </div>
                <div>
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Trust Tier</label>
                  <select value={supplierForm.status} onChange={e => setSupplierForm(p => ({...p, status: e.target.value as SupplierStatus}))} className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-bold">
                    {['Active','Verified','Preferred','Inactive'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Payment Terms</label>
                  <select value={supplierForm.paymentTerms} onChange={e => setSupplierForm(p => ({...p, paymentTerms: e.target.value}))} className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-bold">
                    {['Net 30','Net 15','COD (Cash on Delivery)','Due on Receipt','30/70 (Down/Balance)'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Official Address</label>
                  <textarea value={supplierForm.address} onChange={e => setSupplierForm(p => ({...p, address: e.target.value}))} className="w-full h-20 p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-medium resize-none" />
                </div>
              </div>
            </div>
            <div className="p-8 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setIsAddSupplierOpen(false)} className="px-8 h-12 bg-white border border-slate-200 rounded-full text-[14px] font-black text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
              <button onClick={handleSubmitSupplier} disabled={!supplierForm.name.trim()} className="px-10 h-12 bg-slate-900 text-white rounded-full text-[14px] font-black shadow-xl shadow-slate-900/10 hover:bg-indigo-600 transition-all active:scale-95">
                {editingSupplier ? 'Update Profile' : 'Register Vendor'}
              </button>
            </div>
          </div>
        </div>
      )}

      {blacklistTarget && (
        <div className="fixed inset-0 z-300 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-[400px] rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 text-center">
              <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-6"><AlertCircle size={40} /></div>
              <h3 className="text-[20px] font-black text-slate-900 mb-2">Blacklist Vendor?</h3>
              <p className="text-[14px] text-slate-500 leading-relaxed mb-8">This will immediately suspend all procurement activities with <strong>{blacklistTarget.supplier_name || blacklistTarget.name}</strong>. This action is recorded in the audit log.</p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setBlacklistTarget(null)} className="h-12 rounded-full bg-slate-50 text-slate-700 font-black text-[13px] hover:bg-slate-100 transition-all">Abort Action</button>
                <button onClick={() => { updateSupplier(blacklistTarget.id, { status: 'Blacklisted' }); setBlacklistTarget(null); setSelectedSupplier(null); }} className="h-12 rounded-full bg-rose-600 text-white font-black text-[13px] hover:bg-rose-700 transition-all shadow-xl shadow-rose-200 active:scale-95">Confirm Blacklist</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
