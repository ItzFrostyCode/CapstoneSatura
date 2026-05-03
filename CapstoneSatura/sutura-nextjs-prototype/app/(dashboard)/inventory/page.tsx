'use client';

import { useState } from 'react';
import { Plus, Search, Filter, AlertTriangle, Trash2, X, Boxes, FileText, Truck, ClipboardCheck, Eye, Edit2, BarChart3 } from 'lucide-react';

interface InventoryItem {
  item: string;
  sku: string;
  cat: string;
  stock: string;
  cost: string;
  price: string;
  status: string;
}

interface ProcurementOrder {
  po: string;
  supplier: string;
  date: string;
  total: string;
  status: string;
  action: string;
}

interface Supplier {
  name: string;
  email: string;
  contact: string;
  phone: string;
  category: string;
  rating: string;
}

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState('items');
  const [isAssemblyModalOpen, setIsAssemblyModalOpen] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  
  // Procurement Modals
  const [poDetailModal, setPoDetailModal] = useState(false);
  const [approveRestockModal, setApproveRestockModal] = useState(false);
  const [receiveItemsModal, setReceiveItemsModal] = useState(false);
  const [createPoModal, setCreatePoModal] = useState(false);
  const [addSupplierModal, setAddSupplierModal] = useState(false);
  const [isEditSupplierModalOpen, setIsEditSupplierModalOpen] = useState(false);
  const [isViewSupplierModalOpen, setIsViewSupplierModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [newSupplierRating, setNewSupplierRating] = useState(4.5);

  // New Item Modals
  const [isAddFabricModalOpen, setIsAddFabricModalOpen] = useState(false);
  const [isAddUniformModalOpen, setIsAddUniformModalOpen] = useState(false);
  const [isAddAccessoryModalOpen, setIsAddAccessoryModalOpen] = useState(false);
  const [isAddEquipmentModalOpen, setIsAddEquipmentModalOpen] = useState(false);
  const [isAddItemMenuOpen, setIsAddItemMenuOpen] = useState(false);
  const [isMaterialPickerOpen, setIsMaterialPickerOpen] = useState(false);
  
  const [assemblyMaterials, setAssemblyMaterials] = useState([
    { id: 'mat-1', name: 'Cotton Fabric Roll', sku: 'SKU-FAB-001', required: 5.0, available: 450, quantity: 100, status: 'In Stock' },
    { id: 'mat-2', name: 'Premium Buttons (White)', sku: 'SKU-ACC-002', required: 10.0, available: 80, quantity: 200, status: 'Shortage' }
  ]);

  const stats = [
    { label: "Total SKUs", value: "26", color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Healthy Stock", value: "17", color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Low Stock", value: "5", color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Out of Stock", value: "1", color: "text-rose-600", bg: "bg-rose-50" },
  ];

  const inventoryData: InventoryItem[] = [
    { item: "Cotton Fabric Roll", sku: "SKU-FAB-001", cat: "Fabrics", stock: "50 rolls", cost: "₱1,200.00", price: "₱1,800.00", status: "In Stock" },
    { item: "Polyester Fabric Roll", sku: "SKU-FAB-004", cat: "Fabrics", stock: "40 rolls", cost: "₱900.00", price: "₱1,450.00", status: "In Stock" },
    { item: "Denim Fabric Roll", sku: "SKU-FAB-005", cat: "Fabrics", stock: "15 rolls", cost: "₱2,000.00", price: "₱3,200.00", status: "Low Stock" },
    { item: "Thread (White)", sku: "SKU-THR-001", cat: "Threads", stock: "200 spools", cost: "₱50.00", price: "₱85.00", status: "In Stock" },
  ];

  const procurementOrders: ProcurementOrder[] = [
    { po: "PO-2023-094", supplier: "Premium Fabrics Inc.", date: "Oct 24, 2023", total: "₱4,500.00", status: "Pending Receipt", action: "Receive" },
    { po: "PO-2023-093", supplier: "QC Garment Supplies", date: "Apr 25, 2026", total: "₱2,650.00", status: "Pending Approval", action: "Approve" },
    { po: "PO-2023-089", supplier: "Premium Fabrics Inc.", date: "Oct 15, 2023", total: "₱12,400.00", status: "In Transit", action: "View" },
  ];

  const suppliersData = [
    { name: "Premium Fabrics Inc.", email: "orders@premiumfabrics.com", contact: "Elena Cruz", phone: "+63 917 555 8888", category: "Wholesale Fabrics", rating: "4.9" },
    { name: "QC Garment Supplies", email: "wholesale@qcgarments.com", contact: "Ricardo Santos", phone: "+63 920 123 4567", category: "Buttons & Zippers", rating: "4.5" },
    { name: "Textile World Manila", email: "sales@textileworld.ph", contact: "Maria Clara", phone: "+63 918 765 4321", category: "Premium Fabrics", rating: "4.9" },
    { name: "Sewing Essentials Co.", email: "hello@sewingessentials.com", contact: "Juan Dela Cruz", phone: "+63 905 111 2222", category: "Threads & Needles", rating: "4.7" },
  ];

  return (
    <>
      <div className="p-8 max-w-[1500px] mx-auto w-full relative">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[32px] font-bold text-slate-900 tracking-tight leading-tight">Supply Chain & Inventory</h1>
          <p className="text-[16px] text-slate-500 mt-1 font-normal leading-relaxed">Manage fabrics, ready-to-wear stock, and procurement.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsAssemblyModalOpen(true)} className="flex items-center gap-2 bg-indigo-50 text-indigo-700 border border-indigo-200 h-9 px-4 rounded-md text-[13px] font-bold hover:bg-indigo-100 transition-colors">
            <Boxes size={16} /> Production Assembly
          </button>
          <div className="w-px h-6 bg-slate-200 mx-1"></div>
          {activeTab === 'procurement' && (
            <button onClick={() => setCreatePoModal(true)} className="flex items-center gap-2 bg-slate-900 text-white h-9 px-4 rounded-md text-[13px] font-semibold hover:bg-slate-800 transition-colors shadow-sm">
              <Plus size={16} /> Create PO
            </button>
          )}
          {activeTab === 'suppliers' && (
            <button onClick={() => setAddSupplierModal(true)} className="flex items-center gap-2 bg-slate-900 text-white h-9 px-4 rounded-md text-[13px] font-semibold hover:bg-slate-800 transition-colors shadow-sm">
              <Plus size={16} /> Add Supplier
            </button>
          )}
          {activeTab === 'items' && (
            <div className="relative">
              <button 
                onClick={() => setIsAddItemMenuOpen(!isAddItemMenuOpen)} 
                className="flex items-center gap-2 bg-slate-900 text-white h-9 px-4 rounded-md text-[13px] font-semibold hover:bg-slate-800 transition-colors shadow-sm"
              >
                <Plus size={16} /> Add Item
              </button>
              
              {isAddItemMenuOpen && (
                <div className="absolute right-0 top-11 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-2 animate-in fade-in slide-in-from-top-2">
                  <button onClick={() => { setIsAddFabricModalOpen(true); setIsAddItemMenuOpen(false); }} className="w-full text-left px-4 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center"><FileText size={16}/></div>
                    Add Fabric Item
                  </button>
                  <button onClick={() => { setIsAddUniformModalOpen(true); setIsAddItemMenuOpen(false); }} className="w-full text-left px-4 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><Boxes size={16}/></div>
                    Add Premade Uniform
                  </button>
                  <button onClick={() => { setIsAddAccessoryModalOpen(true); setIsAddItemMenuOpen(false); }} className="w-full text-left px-4 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center"><Plus size={16}/></div>
                    Add Accessories
                  </button>
                  <button onClick={() => { setIsAddEquipmentModalOpen(true); setIsAddItemMenuOpen(false); }} className="w-full text-left px-4 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center"><Truck size={16}/></div>
                    Add Tools & Machines
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2">{stat.label}</div>
            <div className={`text-[28px] font-black tracking-tight ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-8 border-b border-slate-200 mb-6">
        <button onClick={() => setActiveTab('items')} className={`pb-3 text-[14px] font-bold relative transition-colors ${activeTab === 'items' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>
          Inventory Items
          {activeTab === 'items' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-slate-900"></div>}
        </button>
        <button onClick={() => setActiveTab('procurement')} className={`pb-3 text-[14px] font-bold relative transition-colors ${activeTab === 'procurement' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>
          Procurement
          {activeTab === 'procurement' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-slate-900"></div>}
        </button>
        <button onClick={() => setActiveTab('suppliers')} className={`pb-3 text-[14px] font-bold relative transition-colors ${activeTab === 'suppliers' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>
          Suppliers
          {activeTab === 'suppliers' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-slate-900"></div>}
        </button>
      </div>

      {/* ITEMS VIEW */}
      {activeTab === 'items' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-[600px]">
          <div className="p-4 border-b border-slate-200 flex gap-4 bg-slate-50/50 shrink-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" placeholder="Search by name, SKU, or category..." className="w-full h-9 pl-9 pr-4 rounded-md bg-white border border-slate-200 text-[13px] outline-none focus:border-slate-300 transition-colors shadow-sm" />
            </div>
            <div className="flex gap-2">
              <button 
                onClick={(e) => { e.stopPropagation(); setIsAddItemMenuOpen(!isAddItemMenuOpen); }} 
                className="w-9 h-9 bg-slate-100 border border-slate-200 text-slate-600 rounded-md flex items-center justify-center hover:bg-slate-200 transition-all shadow-sm active:scale-95"
              >
                <Plus size={18} />
              </button>
              <button className="h-9 px-4 border border-slate-200 bg-white rounded-md text-[13px] font-semibold text-slate-700 flex items-center gap-2 hover:bg-slate-50 shadow-sm">
                <Filter size={16} /> Categories
              </button>
            </div>
          </div>
          
          <div className="overflow-y-auto flex-1">
            <table className="w-full text-left text-[13px]">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 z-10 shadow-sm">
                <tr>
                  <th className="px-5 py-3 text-[13px] font-medium text-slate-600">Item & SKU</th>
                  <th className="px-5 py-3 text-[13px] font-medium text-slate-600">Category</th>
                  <th className="px-5 py-3 text-[13px] font-medium text-slate-600">Stock Level</th>
                  <th className="px-5 py-3 text-[13px] font-medium text-slate-600 text-right">Unit Cost</th>
                  <th className="px-5 py-3 text-[13px] font-medium text-slate-600 text-right">Retail Price (₱)</th>
                  <th className="px-5 py-3 text-[13px] font-medium text-slate-600">Status</th>
                  <th className="px-5 py-3 text-[13px] font-medium text-slate-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inventoryData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => setSelectedItem(item)}>
                    <td className="px-5 py-3">
                      <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{item.item}</div>
                      <div className="text-[11px] font-mono text-slate-500">{item.sku}</div>
                    </td>
                    <td className="px-5 py-3 font-medium text-slate-700">{item.cat}</td>
                    <td className="px-5 py-3 font-bold text-slate-900">{item.stock}</td>
                    <td className="px-5 py-3 text-right font-medium text-slate-600">{item.cost}</td>
                    <td className="px-5 py-3 text-right font-medium text-slate-600">{item.price}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${
                        item.status === 'In Stock' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        item.status === 'Low Stock' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedItem(item); setIsRestockModalOpen(true); }}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 rounded-md transition-colors border border-slate-200 shadow-sm"
                          title="Restock Item"
                        >
                          <Plus size={16} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedItem(item); }}
                          className="p-1.5 text-slate-400 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors border border-slate-200 shadow-sm"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PROCUREMENT VIEW */}
      {activeTab === 'procurement' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-[600px]">
          <div className="p-4 border-b border-slate-200 flex gap-4 bg-slate-50/50 shrink-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" placeholder="Search PO number..." className="w-full h-9 pl-9 pr-4 rounded-md bg-white border border-slate-200 text-[13px] outline-none focus:border-slate-300 transition-colors shadow-sm" />
            </div>
          </div>
          
          <div className="overflow-y-auto flex-1">
            <table className="w-full text-left text-[13px]">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 z-10 shadow-sm">
                <tr>
                  <th className="px-5 py-3 font-semibold text-slate-600">PO Number</th>
                  <th className="px-5 py-3 font-semibold text-slate-600">Supplier</th>
                  <th className="px-5 py-3 font-semibold text-slate-600">Order Date</th>
                  <th className="px-5 py-3 font-semibold text-slate-600 text-right">Total Amount</th>
                  <th className="px-5 py-3 font-semibold text-slate-600">Status</th>
                  <th className="px-5 py-3 font-semibold text-slate-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {procurementOrders.map((po, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-5 py-4 font-mono font-bold text-slate-900">{po.po}</td>
                    <td className="px-5 py-4 font-medium text-slate-700">{po.supplier}</td>
                    <td className="px-5 py-4 text-slate-600">{po.date}</td>
                    <td className="px-5 py-4 text-right font-bold text-slate-900">{po.total}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${
                        po.status === 'In Transit' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        po.status === 'Pending Approval' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {po.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {po.action === 'View' && <button onClick={() => setPoDetailModal(true)} className="px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-700 rounded-md text-[12px] font-bold hover:bg-slate-200">View PO</button>}
                      {po.action === 'Approve' && <button onClick={() => setApproveRestockModal(true)} className="px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-md text-[12px] font-bold hover:bg-rose-100">Approve Request</button>}
                      {po.action === 'Receive' && <button onClick={() => setReceiveItemsModal(true)} className="px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-md text-[12px] font-bold hover:bg-indigo-100">Receive Items</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUPPLIERS VIEW */}
      {activeTab === 'suppliers' && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2">Total Partners</div>
              <div className="text-[28px] font-black tracking-tight text-slate-900">12</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2">Preferred Suppliers</div>
              <div className="text-[28px] font-black tracking-tight text-emerald-600">4</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2">Current Orders</div>
              <div className="text-[28px] font-black tracking-tight text-blue-600">2</div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-[500px]">
            <div className="p-4 border-b border-slate-200 flex gap-4 bg-slate-50/50 shrink-0">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input type="text" placeholder="Search by name, contact, or category..." className="w-full h-9 pl-9 pr-4 rounded-md bg-white border border-slate-200 text-[13px] outline-none focus:border-slate-300 transition-colors shadow-sm" />
              </div>
            </div>
            
            <div className="overflow-y-auto flex-1">
              <table className="w-full text-left text-[13px]">
                <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 z-10 shadow-sm">
                  <tr>
                    <th className="px-5 py-3 font-semibold text-slate-600">Supplier & Email</th>
                    <th className="px-5 py-3 font-semibold text-slate-600">Primary Contact</th>
                    <th className="px-5 py-3 font-semibold text-slate-600">Category</th>
                    <th className="px-5 py-3 font-semibold text-slate-600">Rating</th>
                    <th className="px-5 py-3 font-semibold text-slate-600 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {suppliersData.map((sup, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900">{sup.name}</div>
                        <div className="text-[11px] text-blue-600">{sup.email}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-700">{sup.contact}</div>
                        <div className="text-[11px] font-mono text-slate-500">{sup.phone}</div>
                      </td>
                      <td className="px-5 py-4 font-medium text-slate-700">{sup.category}</td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2 py-1 rounded-md text-[11px] font-bold">
                          ⭐ {sup.rating}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right flex items-center justify-end gap-2">
                        <button 
                          onClick={() => { setSelectedSupplier(sup); setIsViewSupplierModalOpen(true); }}
                          className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors border border-slate-200 shadow-sm"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => { setSelectedSupplier(sup); setIsEditSupplierModalOpen(true); }}
                          className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors border border-slate-200 shadow-sm"
                        >
                          <Edit2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PO Detail Modal */}
      {poDetailModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-[800px] max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="px-8 py-6 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
              <div>
                <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider rounded border border-blue-200 mb-2">In Transit</span>
                <h2 className="text-[20px] font-bold text-slate-900 tracking-tight">Purchase Order #PO-2023-089</h2>
              </div>
              <button onClick={() => setPoDetailModal(false)} className="text-slate-400 hover:text-slate-900"><X size={20}/></button>
            </div>
            <div className="p-8 overflow-y-auto">
              <h3 className="text-[12px] font-bold text-slate-900 uppercase tracking-wider mb-3">Itemized Order</h3>
              <table className="w-full text-left text-[13px] border border-slate-200 rounded-lg overflow-hidden mb-8">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-slate-600">Item Description</th>
                    <th className="px-4 py-3 font-semibold text-slate-600 text-right">Price</th>
                    <th className="px-4 py-3 font-semibold text-slate-600 text-center">Qty</th>
                    <th className="px-4 py-3 font-semibold text-slate-600 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="px-4 py-3 font-bold text-slate-900">Cotton Fabric Roll <span className="font-normal font-mono text-slate-500 block text-[11px]">SKU-FAB-001 • Royal Blue</span></td>
                    <td className="px-4 py-3 text-right">₱1,200.00</td><td className="px-4 py-3 text-center">8</td><td className="px-4 py-3 text-right font-medium">₱9,600.00</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-bold text-slate-900">Denim Fabric Roll <span className="font-normal font-mono text-slate-500 block text-[11px]">SKU-FAB-005 • Heavyweight</span></td>
                    <td className="px-4 py-3 text-right">₱2,000.00</td><td className="px-4 py-3 text-center">1</td><td className="px-4 py-3 text-right font-medium">₱2,000.00</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-bold text-slate-900">White Thread Spools <span className="font-normal font-mono text-slate-500 block text-[11px]">SKU-THR-001 • Industrial</span></td>
                    <td className="px-4 py-3 text-right">₱50.00</td><td className="px-4 py-3 text-center">16</td><td className="px-4 py-3 text-right font-medium">₱800.00</td>
                  </tr>
                </tbody>
              </table>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="text-[12px] font-bold text-slate-900 uppercase tracking-wider mb-3">Supplier & Shipping</h3>
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg flex flex-col gap-3">
                    <div><div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Vendor</div><div className="font-bold text-slate-900 text-[13px]">Premium Fabrics Inc.<br/><span className="text-blue-600 font-normal">orders@premiumfabrics.com</span></div></div>
                    <div><div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Shipment Type</div><div className="font-bold text-slate-900 text-[13px]">Standard Courier<br/><span className="text-slate-500 font-mono font-normal text-[12px]">Tracking: LBC-90823411</span></div></div>
                  </div>
                </div>
                <div>
                  <h3 className="text-[12px] font-bold text-slate-900 uppercase tracking-wider mb-3">Cost Summary</h3>
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg flex flex-col gap-2">
                    <div className="flex justify-between text-[13px] text-slate-600"><span>Subtotal</span><span>₱12,400.00</span></div>
                    <div className="flex justify-between text-[13px] text-slate-600"><span>Shipping Fee</span><span>₱0.00</span></div>
                    <div className="flex justify-between text-[13px] text-slate-600 border-b border-slate-200 pb-2 mb-1"><span>Tax (Included)</span><span>₱0.00</span></div>
                    <div className="flex justify-between text-[16px] font-black text-slate-900"><span>Total Amount</span><span>₱12,400.00</span></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-8 py-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">History</div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold">JD</div>
                  <div className="text-[12px] text-slate-600">Created by <span className="font-bold text-slate-900">John Doe</span> on Oct 24</div>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setPoDetailModal(false)} className="h-10 px-5 rounded-lg border border-slate-300 text-slate-700 font-bold text-[13px] hover:bg-slate-100 bg-white">Close Details</button>
                <button className="h-10 px-5 rounded-lg bg-slate-900 text-white font-bold text-[13px] hover:bg-slate-800 flex items-center gap-2">
                  <FileText size={16}/> Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approve Restock Request Modal */}
      {approveRestockModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-[700px] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="px-8 py-6 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
              <div>
                <span className="inline-flex items-center px-2 py-1 bg-rose-100 text-rose-700 text-[10px] font-bold uppercase tracking-wider rounded border border-rose-200 mb-2"><AlertTriangle size={12} className="mr-1"/> Pending Approval</span>
                <h2 className="text-[20px] font-bold text-slate-900 tracking-tight">Approve Restock Request</h2>
                <p className="text-[13px] text-slate-500 mt-1">PO-2023-093 — Requested by Staff · Apr 25, 2026 at 9:00 AM</p>
              </div>
            </div>
            <div className="p-8">
              <div className="flex gap-8 mb-6">
                <div><div className="text-[11px] font-bold text-slate-400 uppercase">Requested By</div><div className="font-bold text-slate-900">Staff User</div></div>
                <div><div className="text-[11px] font-bold text-slate-400 uppercase">Supplier</div><div className="font-bold text-slate-900">QC Garment Supplies</div></div>
                <div><div className="text-[11px] font-bold text-slate-400 uppercase">Estimated Cost</div><div className="font-bold text-slate-900 text-[16px]">₱2,650.00</div></div>
              </div>
              <h3 className="text-[12px] font-bold text-slate-900 uppercase tracking-wider mb-3">Requested Materials</h3>
              <table className="w-full text-left text-[13px] border border-slate-200 rounded-lg overflow-hidden mb-6">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2 font-semibold text-slate-600">Material</th>
                    <th className="px-4 py-2 font-semibold text-slate-600">Current Stock</th>
                    <th className="px-4 py-2 font-semibold text-slate-600">Qty to Order</th>
                    <th className="px-4 py-2 font-semibold text-slate-600">Unit Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="px-4 py-3 font-bold">Piña Fabric (Natural) <span className="font-normal font-mono text-slate-500 block text-[10px]">SKU: FAB-PIA-002</span></td>
                    <td className="px-4 py-3 text-rose-600 font-bold">2 meters</td><td className="px-4 py-3 font-bold">20 meters</td><td className="px-4 py-3">₱85/m</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-bold">Silk Lining (Ivory) <span className="font-normal font-mono text-slate-500 block text-[10px]">SKU: FAB-SLK-011</span></td>
                    <td className="px-4 py-3 text-rose-600 font-bold">1.5 meters</td><td className="px-4 py-3 font-bold">15 meters</td><td className="px-4 py-3">₱120/m</td>
                  </tr>
                </tbody>
              </table>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <h4 className="text-[12px] font-bold text-amber-900 uppercase mb-1">Reason for Request</h4>
                <p className="text-[13px] text-amber-800 leading-relaxed">Stock below minimum threshold. Piña fabric needed for ORD-1006 (Barong, due Apr 29). Silk lining needed for ORD-1003 (Cocktail Dress, due Apr 28). Both orders at risk of delay.</p>
              </div>
              <div>
                <label className="text-[12px] font-bold text-slate-700 block mb-1">Approval Note (optional)</label>
                <input type="text" placeholder="e.g. Approved for urgent orders ORD-1003 and ORD-1006..." className="w-full border border-slate-300 rounded-md h-9 px-3 text-[13px]"/>
              </div>
            </div>
            <div className="px-8 py-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
              <button 
                onClick={() => setApproveRestockModal(false)}
                className="h-10 px-5 rounded-lg border-2 border-rose-200 text-rose-600 font-bold text-[13px] hover:bg-rose-50 transition-colors"
              >
                Reject Request
              </button>
              <div className="flex gap-3">
                <button onClick={() => setApproveRestockModal(false)} className="h-10 px-5 rounded-lg border border-slate-300 text-slate-700 font-bold text-[13px] hover:bg-slate-100 bg-white">Cancel</button>
                <button onClick={() => setApproveRestockModal(false)} className="h-10 px-5 rounded-lg bg-emerald-600 text-white font-bold text-[13px] hover:bg-emerald-700 shadow-sm">Approve & Send PO</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receive Items Modal */}
      {receiveItemsModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-[600px] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="px-8 py-6 border-b border-slate-200 bg-indigo-900 text-white">
              <h2 className="text-[20px] font-bold flex items-center gap-2"><ClipboardCheck size={20}/> Receive Items</h2>
              <p className="text-[13px] text-indigo-200 mt-1">PO-2023-094 • Premium Fabrics Inc. • Exp: Oct 28</p>
            </div>
            <div className="p-8">
              <table className="w-full text-left text-[13px] border border-slate-200 rounded-lg overflow-hidden mb-6">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2 font-semibold text-slate-600">Item Details</th>
                    <th className="px-4 py-2 font-semibold text-slate-600 text-center">Expected</th>
                    <th className="px-4 py-2 font-semibold text-slate-600 text-center">Received Now</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="px-4 py-4 font-bold text-slate-900">Denim Fabric Roll <span className="font-normal font-mono text-slate-500 block text-[10px]">SKU: FAB-DEN-001</span></td>
                    <td className="px-4 py-4 text-center font-bold">50</td>
                    <td className="px-4 py-4 text-center"><input type="number" defaultValue={30} className="w-16 h-8 text-center border border-slate-300 rounded font-bold"/> <span className="text-slate-500 text-[11px] ml-1">yards</span></td>
                  </tr>
                  <tr>
                    <td className="px-4 py-4 font-bold text-slate-900">Industrial Needles <span className="font-normal font-mono text-slate-500 block text-[10px]">SKU: ACC-NEE-055</span></td>
                    <td className="px-4 py-4 text-center font-bold">10</td>
                    <td className="px-4 py-4 text-center"><input type="number" defaultValue={10} className="w-16 h-8 text-center border border-slate-300 rounded font-bold"/> <span className="text-slate-500 text-[11px] ml-1">packs</span></td>
                  </tr>
                </tbody>
              </table>
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <input type="checkbox" id="backorder" className="w-4 h-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500"/>
                  <label htmlFor="backorder" className="text-[12px] font-bold text-amber-900">Mark missing items as Backordered</label>
                </div>
                <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-[12px] font-medium border border-blue-200 text-center">
                  Status will change to <strong className="text-blue-900">Partial Received</strong>. Current fulfillment: <span className="font-bold">40/60 units</span>.
                </div>
              </div>
            </div>
            <div className="px-8 py-5 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button onClick={() => setReceiveItemsModal(false)} className="h-10 px-5 rounded-lg border border-slate-300 text-slate-700 font-bold text-[13px] hover:bg-slate-100 bg-white">Cancel</button>
              <button onClick={() => setReceiveItemsModal(false)} className="h-10 px-5 rounded-lg bg-indigo-600 text-white font-bold text-[13px] hover:bg-indigo-700">Confirm Receipt</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Purchase Order Modal */}
      {createPoModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-[750px] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="px-8 py-6 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
              <div>
                <h2 className="text-[20px] font-bold text-slate-900 tracking-tight">Create Purchase Order</h2>
                <p className="text-[13px] text-slate-500 mt-1">Draft a new order for inventory replenishment.</p>
              </div>
              <button onClick={() => setCreatePoModal(false)} className="text-slate-400 hover:text-slate-900"><X size={20}/></button>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Select Supplier</label>
                  <select className="w-full h-9 border border-slate-300 rounded-md text-[13px] px-3 font-semibold"><option>Premium Fabrics Inc.</option></select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Order Date</label>
                  <input type="date" defaultValue="2023-10-24" className="w-full h-9 border border-slate-300 rounded-md text-[13px] px-3 font-semibold"/>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Expected Delivery</label>
                  <input type="date" className="w-full h-9 border border-slate-300 rounded-md text-[13px] px-3 font-semibold"/>
                </div>
              </div>
              
              <h3 className="text-[12px] font-bold text-slate-900 uppercase tracking-wider mb-3">Order Items</h3>
              <table className="w-full text-left text-[13px] mb-4">
                <thead className="bg-slate-50 border border-slate-200">
                  <tr>
                    <th className="px-4 py-2 font-semibold text-slate-600 w-1/2">Item Name</th>
                    <th className="px-4 py-2 font-semibold text-slate-600">Unit Price</th>
                    <th className="px-4 py-2 font-semibold text-slate-600">Quantity</th>
                    <th className="px-4 py-2 font-semibold text-slate-600 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="pt-2"><select className="w-full h-9 border border-slate-300 rounded-md px-2 text-[13px]"><option>Cotton Fabric Roll (SKU-FAB-001)</option></select></td>
                    <td className="pt-2"><div className="relative"><span className="absolute left-2 top-2 text-slate-400">₱</span><input type="number" defaultValue={1200} className="w-full h-9 border border-slate-300 rounded-md pl-6 pr-2 text-[13px]"/></div></td>
                    <td className="pt-2"><input type="number" defaultValue={1} className="w-full h-9 border border-slate-300 rounded-md px-2 text-[13px]"/></td>
                    <td className="pt-2 text-right font-bold text-slate-900 mt-2">₱ 1,200.00</td>
                  </tr>
                </tbody>
              </table>
              <button className="text-[13px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 mb-8">
                <Plus size={16}/> Add Another Item
              </button>
              
              <div className="flex justify-end border-t border-slate-200 pt-4 gap-12">
                <div className="text-right"><div className="text-[11px] font-bold text-slate-500 uppercase">Total Items</div><div className="text-[16px] font-bold">1</div></div>
                <div className="text-right"><div className="text-[11px] font-bold text-slate-500 uppercase">Estimated Total</div><div className="text-[20px] font-black text-slate-900">₱ 1,200.00</div></div>
              </div>
            </div>
            <div className="px-8 py-5 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button onClick={() => setCreatePoModal(false)} className="h-10 px-5 rounded-lg border border-slate-300 text-slate-700 font-bold text-[13px] hover:bg-slate-100 bg-white">Cancel</button>
              <button onClick={() => setCreatePoModal(false)} className="h-10 px-5 rounded-lg bg-slate-900 text-white font-bold text-[13px] hover:bg-slate-800">Confirm Order</button>
            </div>
          </div>
        </div>
      )}

      {/* Item Detail View Modal */}
      {selectedItem && !isRestockModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-[600px] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
              <div>
                <h2 className="text-[20px] font-bold text-slate-900 tracking-tight">{selectedItem.item}</h2>
                <p className="text-[13px] font-mono text-slate-500 mt-1">{selectedItem.sku}</p>
              </div>
              <button onClick={() => setSelectedItem(null)} className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-slate-900 shadow-sm transition-colors">
                <X size={16} />
              </button>
            </div>
            
            <div className="p-6">
              {/* Status-Aware Stock Banner */}
              {selectedItem.status === 'In Stock' && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-4 mb-6">
                  <div className="text-[32px] font-black text-emerald-600 leading-none">{selectedItem.stock.split(' ')[0]}</div>
                  <div>
                    <div className="text-[12px] font-bold text-emerald-900 uppercase tracking-wider">{selectedItem.stock.split(' ')[1]} IN STOCK</div>
                    <div className="text-[13px] text-emerald-700">Healthy Stock Level — No action required.</div>
                  </div>
                </div>
              )}

              {selectedItem.status === 'Low Stock' && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="text-[32px] font-black text-amber-600 leading-none">{selectedItem.stock.split(' ')[0]}</div>
                    <div className="flex-1">
                      <div className="text-[12px] font-bold text-amber-900 uppercase tracking-wider">{selectedItem.stock.split(' ')[1]} REMAINING</div>
                      <div className="text-[13px] text-amber-700 font-medium flex items-center gap-1.5"><AlertTriangle size={14}/> Threshold reached: 20 units</div>
                    </div>
                    <button 
                      onClick={() => { setSelectedItem(null); setCreatePoModal(true); }}
                      className="bg-amber-600 text-white px-4 py-2 rounded-lg text-[12px] font-bold hover:bg-amber-700 transition-all shadow-sm"
                    >
                      Quick Restock
                    </button>
                  </div>
                  <div className="text-[11px] text-amber-600 bg-white/50 p-2 rounded border border-amber-100 italic">
                    Smart Analysis: This item is used in 3 active Job Orders this week. Suggested restock: 25 rolls.
                  </div>
                </div>
              )}

              {selectedItem.status === 'Out of Stock' && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex flex-col gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="text-[32px] font-black text-rose-600 leading-none">0</div>
                    <div className="flex-1">
                      <div className="text-[12px] font-bold text-rose-900 uppercase tracking-wider">OUT OF STOCK</div>
                      <div className="text-[13px] text-rose-700 font-bold">Production Blocked for 2 Orders</div>
                    </div>
                    <button 
                      onClick={() => { setSelectedItem(null); setCreatePoModal(true); }}
                      className="bg-rose-600 text-white px-4 py-2 rounded-lg text-[12px] font-bold animate-pulse"
                    >
                      Urgent Order
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Item Specifications</h3>
                  <div className="flex flex-col gap-3">
                    <div>
                      <div className="text-[12px] text-slate-500">Category</div>
                      <div className="font-bold text-[14px] text-slate-900">{selectedItem.cat}</div>
                    </div>
                    <div>
                      <div className="text-[12px] text-slate-500">Fabric Type / Material</div>
                      <div className="font-bold text-[14px] text-slate-900">Cotton (100%)</div>
                    </div>
                    <div>
                      <div className="text-[12px] text-slate-500">Color / Pattern</div>
                      <div className="font-bold text-[14px] text-slate-900">Royal Blue / Solid</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Financial Details</h3>
                  <div className="flex flex-col gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div>
                      <div className="text-[12px] text-slate-500">Unit Cost</div>
                      <div className="font-mono font-bold text-[14px] text-slate-900">{selectedItem.cost} / unit</div>
                    </div>
                    <div>
                      <div className="text-[12px] text-slate-500">Retail Price (₱)</div>
                      <div className="font-mono font-bold text-[14px] text-emerald-600">{selectedItem.price} / unit</div>
                    </div>
                    <div>
                      <div className="text-[12px] text-slate-500">Markup</div>
                      <div className="font-mono font-bold text-[14px] text-slate-900">50%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Production Assembly Modal */}
      {isAssemblyModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-[800px] h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right">
            <div className="px-8 py-6 border-b border-slate-200 flex items-center justify-between bg-indigo-900 text-white">
              <div>
                <h2 className="text-[20px] font-bold flex items-center gap-2"><Boxes size={20}/> Production Assembly</h2>
                <p className="text-[13px] text-indigo-200 mt-1">Convert raw materials into finished inventory products.</p>
              </div>
              <button onClick={() => setIsAssemblyModalOpen(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                <X size={16}/>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8">
              
              {/* Step 1: Resource Selection & Validation */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[14px] font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center text-[12px]">1</div>
                    Raw Material Consumption
                  </h3>
                  <div className="text-[11px] font-bold text-rose-500 uppercase flex items-center gap-1 bg-rose-50 px-2 py-1 rounded border border-rose-100">
                    <AlertTriangle size={12}/> Auto-Validation Active
                  </div>
                </div>
                
                <div className="border border-slate-200 rounded-xl overflow-hidden mb-3 shadow-sm">
                  {assemblyMaterials.map((mat, idx) => {
                    const isShortage = mat.quantity > mat.available;
                    return (
                      <div key={mat.id} className={`p-4 flex items-center justify-between border-b border-slate-100 transition-colors ${isShortage ? 'bg-rose-50/30' : 'bg-white hover:bg-slate-50'}`}>
                        <div className="flex-1">
                          <div className="font-bold text-[14px] text-slate-900 flex items-center gap-2">
                            {mat.name} 
                            <span className={`px-1.5 py-0.5 text-[9px] font-black uppercase rounded ${isShortage ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                              {isShortage ? 'Shortage' : 'In Stock'}
                            </span>
                          </div>
                          <div className="text-[12px] text-slate-500 mt-0.5">
                            {isShortage ? (
                              <span className="text-rose-600 font-medium italic">Shortage: {mat.quantity - mat.available} units missing</span>
                            ) : (
                              <span>SKU: {mat.sku} · Available: <span className="font-bold text-slate-700">{mat.available}</span></span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-[10px] font-bold text-slate-400 uppercase">Usage</div>
                            <div className="text-[13px] font-bold text-slate-700">{mat.required} / unit</div>
                          </div>
                          <input 
                            type="number" 
                            value={mat.quantity} 
                            onChange={(e) => {
                              const newMats = [...assemblyMaterials];
                              newMats[idx].quantity = parseInt(e.target.value) || 0;
                              setAssemblyMaterials(newMats);
                            }}
                            className={`w-24 h-10 border rounded-md text-center font-bold text-[15px] outline-none ${isShortage ? 'border-rose-300 text-rose-700 focus:ring-rose-200' : 'border-slate-300 focus:border-indigo-500'}`} 
                          />
                          <button 
                            onClick={() => setAssemblyMaterials(assemblyMaterials.filter(m => m.id !== mat.id))}
                            className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 size={16}/>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="flex items-center justify-between px-1 relative">
                  <button 
                    onClick={() => setIsMaterialPickerOpen(!isMaterialPickerOpen)}
                    className="text-[13px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm transition-all hover:shadow-md"
                  >
                    <Plus size={16}/> Add Raw Material
                  </button>

                  {isMaterialPickerOpen && (
                    <div className="absolute left-0 top-11 w-64 bg-white border border-slate-200 rounded-xl shadow-2xl z-60 py-2 animate-in zoom-in-95">
                      <div className="px-4 py-2 border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest">Select from Inventory</div>
                      {inventoryData.map((item, i) => (
                        <button 
                          key={i}
                          onClick={() => {
                            setAssemblyMaterials([...assemblyMaterials, {
                              id: `mat-${Date.now()}`,
                              name: item.item,
                              sku: item.sku,
                              required: 1.0,
                              available: parseInt(item.stock) || 0,
                              quantity: 1,
                              status: 'In Stock'
                            }]);
                            setIsMaterialPickerOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-[13px] hover:bg-slate-50 flex items-center justify-between group"
                        >
                          <span className="font-bold text-slate-700">{item.item}</span>
                          <Plus size={14} className="text-slate-300 group-hover:text-indigo-600" />
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-[13px]">
                    <span className="text-slate-500">Estimated Wastage (Fabric):</span>
                    <div className="flex items-center gap-2">
                      <input type="number" defaultValue={2} className="w-12 h-7 border border-slate-300 rounded text-center text-[12px] font-bold" />
                      <span className="font-bold text-slate-700">%</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Step 2: Output Selection & Cost Preview */}
              <section>
                <h3 className="text-[14px] font-bold text-slate-900 flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center text-[12px]">2</div>
                  Finished Product & Cost Accumulation
                </h3>

                <div className="bg-slate-900 rounded-xl p-6 shadow-xl relative overflow-hidden">
                  <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Target Finished Product</label>
                      <select className="w-full h-11 px-4 rounded-lg border border-white/10 bg-white/5 text-white text-[15px] font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all">
                        <option className="text-slate-900">Standard White Polo (Male)</option>
                        <option className="text-slate-900">Corporate Pants (Navy)</option>
                        <option className="text-slate-900">School Uniform Set - Elementary</option>
                      </select>
                      
                      <div className="mt-6 flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
                        <div>
                          <div className="text-[11px] text-slate-400 uppercase font-bold">Planned Yield</div>
                          <div className="text-[20px] font-black text-white">20 Units</div>
                        </div>
                        <input type="number" defaultValue={20} className="w-16 h-10 bg-white/10 border border-white/20 rounded-md text-center text-white font-bold text-[18px] outline-none" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 border-l border-white/10 pl-8">
                      <div className="flex justify-between items-center text-[13px]">
                        <span className="text-slate-400">Raw Material Cost</span>
                        <span className="font-mono text-white">₱12,500.00</span>
                      </div>
                      <div className="flex justify-between items-center text-[13px]">
                        <span className="text-slate-400">Est. Labor (Internal)</span>
                        <span className="font-mono text-white">₱3,000.00</span>
                      </div>
                      <div className="flex justify-between items-center text-[13px] pb-2 border-b border-white/10">
                        <span className="text-slate-400">Waste Factor (2%)</span>
                        <span className="font-mono text-rose-400">+₱250.00</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-[12px] font-bold text-indigo-400 uppercase tracking-widest">Unit Cost Preview</span>
                        <span className="text-[22px] font-black text-white">₱787.50</span>
                      </div>
                      <p className="text-[10px] text-slate-500 italic mt-1 text-right leading-tight">Suggested Price: ₱1,200.00 (52% Margin)</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Step 3 */}
              <section>
                <h3 className="text-[14px] font-bold text-slate-900 flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center text-[12px]">3</div>
                  Assign to Job Order (Optional)
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                  <label className="block text-[12px] font-bold text-blue-900 mb-1.5">Select Active Job Order</label>
                  <select className="w-full h-10 px-3 rounded-md border border-blue-300 bg-white text-[13px] outline-none focus:ring-2 focus:ring-blue-500">
                    <option>None (Add to General Stock)</option>
                    <option>ORD-1006 – Mr. Reyes (Barong Tagalog)</option>
                    <option>ORD-1004 – Ms. Santos (Cocktail Dress)</option>
                    <option>ORD-1002 – Dela Cruz Corp. (Office Uniforms)</option>
                  </select>
                  <p className="text-[11px] text-blue-700 mt-2">If assigned, these items will be automatically reserved for the selected order upon finalization.</p>
                </div>
              </section>
            </div>

            <div className="px-8 py-5 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button onClick={() => setIsAssemblyModalOpen(false)} className="h-10 px-5 rounded-lg border border-slate-300 text-slate-700 font-bold text-[13px] hover:bg-slate-100 transition-colors bg-white shadow-sm">Cancel</button>
              <button onClick={() => setIsAssemblyModalOpen(false)} className="h-10 px-5 rounded-lg bg-indigo-600 text-white font-bold text-[13px] hover:bg-indigo-700 transition-all shadow-[0_4px_12px_rgba(79,70,229,0.2)] hover:-translate-y-0.5">Finalize Production</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Supplier Modal */}
      {addSupplierModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-[600px] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="px-8 py-6 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
              <div>
                <h2 className="text-[20px] font-bold text-slate-900 tracking-tight">Add New Supplier</h2>
                <p className="text-[13px] text-slate-500 mt-1">Register a new vendor to your supply chain network.</p>
              </div>
              <button onClick={() => setAddSupplierModal(false)} className="text-slate-400 hover:text-slate-900"><X size={20}/></button>
            </div>
            
            <div className="p-8 overflow-y-auto">
              <h3 className="text-[12px] font-bold text-slate-900 uppercase tracking-wider mb-4">Company Information</h3>
              <div className="flex flex-col gap-4 mb-8">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1.5">Company Name</label>
                  <input type="text" placeholder="e.g. Italian Fabrics Co." className="w-full h-10 border border-slate-300 rounded-md text-[13px] px-3 outline-none focus:border-indigo-500"/>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1.5">Office Address</label>
                  <input type="text" placeholder="123 Textile Ave, Manila" className="w-full h-10 border border-slate-300 rounded-md text-[13px] px-3 outline-none focus:border-indigo-500"/>
                </div>
              </div>

              <h3 className="text-[12px] font-bold text-slate-900 uppercase tracking-wider mb-4">Primary Contact</h3>
              <div className="flex flex-col gap-4 mb-8">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1.5">Contact Name</label>
                  <input type="text" placeholder="Juan Dela Cruz" className="w-full h-10 border border-slate-300 rounded-md text-[13px] px-3 outline-none focus:border-indigo-500"/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1.5">Phone Number</label>
                    <input type="text" placeholder="+63 917 555 0000" className="w-full h-10 border border-slate-300 rounded-md text-[13px] px-3 outline-none focus:border-indigo-500"/>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1.5">Email Address</label>
                    <input type="email" placeholder="orders@supplier.com" className="w-full h-10 border border-slate-300 rounded-md text-[13px] px-3 outline-none focus:border-indigo-500"/>
                  </div>
                </div>
              </div>

              <h3 className="text-[12px] font-bold text-slate-900 uppercase tracking-wider mb-4">Partnership Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1.5">Category</label>
                  <select className="w-full h-10 border border-slate-300 rounded-md text-[13px] px-3 outline-none focus:border-indigo-500">
                    <option>Premium Fabrics</option>
                    <option>Threads & Needles</option>
                    <option>Accessories</option>
                    <option>Machinery</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1.5">Initial Rating (1-5)</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="number" 
                      min="1" 
                      max="5" 
                      step="0.1" 
                      value={newSupplierRating} 
                      onChange={(e) => setNewSupplierRating(parseFloat(e.target.value) || 0)}
                      className="w-20 h-10 border border-slate-300 rounded-md text-[14px] font-bold px-3 outline-none focus:border-indigo-500" 
                    />
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 transition-all duration-300" style={{ width: `${(newSupplierRating / 5) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-8 py-5 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button onClick={() => setAddSupplierModal(false)} className="h-10 px-5 rounded-lg border border-slate-300 text-slate-700 font-bold text-[13px] hover:bg-slate-100 bg-white">Cancel</button>
              <button onClick={() => setAddSupplierModal(false)} className="h-10 px-5 rounded-lg bg-slate-900 text-white font-bold text-[13px] hover:bg-slate-800">Register Supplier</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD FABRIC MODAL */}
      {isAddFabricModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-[600px] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="px-8 py-6 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
              <div>
                <h2 className="text-[24px] font-semibold text-slate-900 tracking-tight">Add Fabric Item</h2>
                <p className="text-[14px] text-slate-500 mt-1">Register a new fabric roll to the inventory.</p>
              </div>
              <button onClick={() => setIsAddFabricModalOpen(false)} className="text-slate-400 hover:text-slate-900"><X size={20}/></button>
            </div>
            <div className="p-8 overflow-y-auto max-h-[70vh]">
              <div className="space-y-6">
                <div>
                  <h3 className="text-[13px] font-medium text-slate-500 uppercase tracking-wider mb-4">Fabric Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="text-[13px] font-medium text-slate-700 block mb-1.5">Fabric Name</label>
                      <input type="text" placeholder="e.g. Premium Cotton Roll" className="w-full h-10 px-3 rounded-md border border-slate-300 text-[14px] outline-none focus:border-indigo-500 transition-colors"/>
                    </div>
                    <div>
                      <label className="text-[13px] font-medium text-slate-700 block mb-1.5">SKU</label>
                      <input type="text" placeholder="FAB-721" className="w-full h-10 px-3 rounded-md border border-slate-300 text-[14px] outline-none focus:border-indigo-500 transition-colors font-mono uppercase"/>
                    </div>
                    <div>
                      <label className="text-[13px] font-medium text-slate-700 block mb-1.5">Fabric Type</label>
                      <select className="w-full h-10 px-3 rounded-md border border-slate-300 text-[14px] outline-none focus:border-indigo-500 transition-colors">
                        <option>Cotton</option>
                        <option>Polyester</option>
                        <option>Silk</option>
                        <option>Linen</option>
                        <option>Denim</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="text-[13px] font-medium text-slate-700 block mb-1.5">Color / Pattern</label>
                      <input type="text" placeholder="e.g. Royal Blue" className="w-full h-10 px-3 rounded-md border border-slate-300 text-[14px] outline-none focus:border-indigo-500 transition-colors"/>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-[13px] font-medium text-slate-500 uppercase tracking-wider mb-4">Supplier & Costing</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="text-[13px] font-medium text-slate-700 block mb-1.5">Preferred Supplier</label>
                      <select className="w-full h-10 px-3 rounded-md border border-slate-300 text-[14px] outline-none focus:border-indigo-500 transition-colors">
                        <option>Select Supplier...</option>
                        <option>Premium Fabrics Inc.</option>
                        <option>Textile World Manila</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[13px] font-medium text-slate-700 block mb-1.5">Unit Cost (₱)</label>
                      <input type="number" placeholder="0.00" className="w-full h-10 px-3 rounded-md border border-slate-300 text-[14px] outline-none focus:border-indigo-500 transition-colors font-mono"/>
                    </div>
                    <div>
                      <label className="text-[13px] font-medium text-slate-700 block mb-1.5">Retail Price (₱)</label>
                      <input type="number" placeholder="0.00" className="w-full h-10 px-3 rounded-md border border-slate-300 text-[14px] outline-none focus:border-indigo-500 transition-colors font-mono"/>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-[13px] font-medium text-slate-500 uppercase tracking-wider mb-4">Stock Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[13px] font-medium text-slate-700 block mb-1.5">Initial Quantity (Rolls)</label>
                      <input type="number" placeholder="0" className="w-full h-10 px-3 rounded-md border border-slate-300 text-[14px] outline-none focus:border-indigo-500 transition-colors font-mono"/>
                    </div>
                    <div>
                      <label className="text-[13px] font-medium text-slate-700 block mb-1.5">Low Stock Alert Level</label>
                      <input type="number" placeholder="5" className="w-full h-10 px-3 rounded-md border border-slate-300 text-[14px] outline-none focus:border-indigo-500 transition-colors font-mono"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-8 py-5 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setIsAddFabricModalOpen(false)} className="h-10 px-5 rounded-lg border border-slate-300 text-slate-700 font-bold text-[13px] hover:bg-slate-100 bg-white shadow-sm">Cancel</button>
              <button onClick={() => setIsAddFabricModalOpen(false)} className="h-10 px-5 rounded-lg bg-slate-900 text-white font-bold text-[13px] hover:bg-slate-800 shadow-sm transition-all">Save Fabric</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD UNIFORM MODAL */}
      {isAddUniformModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-[600px] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="px-8 py-6 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
              <div>
                <h2 className="text-[24px] font-semibold text-slate-900 tracking-tight">Add Premade Uniform</h2>
                <p className="text-[14px] text-slate-500 mt-1">Register a finished uniform set to stock.</p>
              </div>
              <button onClick={() => setIsAddUniformModalOpen(false)} className="text-slate-400 hover:text-slate-900"><X size={20}/></button>
            </div>
            <div className="p-8 overflow-y-auto max-h-[70vh]">
              <div className="space-y-6">
                <div>
                  <h3 className="text-[13px] font-medium text-slate-500 uppercase tracking-wider mb-4">Uniform Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="text-[13px] font-medium text-slate-700 block mb-1.5">Uniform Name</label>
                      <input type="text" placeholder="e.g. School Uniform Set - Elementary" className="w-full h-10 px-3 rounded-md border border-slate-300 text-[14px] outline-none focus:border-indigo-500 transition-colors"/>
                    </div>
                    <div>
                      <label className="text-[13px] font-medium text-slate-700 block mb-1.5">SKU</label>
                      <input type="text" placeholder="UNI-402" className="w-full h-10 px-3 rounded-md border border-slate-300 text-[14px] outline-none focus:border-indigo-500 transition-colors font-mono uppercase"/>
                    </div>
                    <div>
                      <label className="text-[13px] font-medium text-slate-700 block mb-1.5">Uniform Type</label>
                      <select className="w-full h-10 px-3 rounded-md border border-slate-300 text-[14px] outline-none focus:border-indigo-500 transition-colors">
                        <option>School</option>
                        <option>Corporate</option>
                        <option>Security</option>
                        <option>Medical</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[13px] font-medium text-slate-700 block mb-1.5">Gender</label>
                      <select className="w-full h-10 px-3 rounded-md border border-slate-300 text-[14px] outline-none focus:border-indigo-500 transition-colors">
                        <option>Male</option>
                        <option>Female</option>
                        <option>Unisex</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[13px] font-medium text-slate-700 block mb-1.5">Size Range</label>
                      <input type="text" placeholder="e.g. S, M, L, XL" className="w-full h-10 px-3 rounded-md border border-slate-300 text-[14px] outline-none focus:border-indigo-500 transition-colors"/>
                    </div>
                    <div className="col-span-2">
                      <label className="text-[13px] font-medium text-slate-700 block mb-1.5">Material Composition</label>
                      <input type="text" placeholder="e.g. 60% Cotton, 40% Poly" className="w-full h-10 px-3 rounded-md border border-slate-300 text-[14px] outline-none focus:border-indigo-500 transition-colors"/>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-[13px] font-medium text-slate-500 uppercase tracking-wider mb-4">Pricing & Supplier</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="text-[13px] font-medium text-slate-700 block mb-1.5">Internal Source / Supplier</label>
                      <select className="w-full h-10 px-3 rounded-md border border-slate-300 text-[14px] outline-none focus:border-indigo-500 transition-colors">
                        <option>Internal Production</option>
                        <option>Premium Fabrics Inc.</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[13px] font-medium text-slate-700 block mb-1.5">Unit Cost (₱)</label>
                      <input type="number" placeholder="0.00" className="w-full h-10 px-3 rounded-md border border-slate-300 text-[14px] outline-none focus:border-indigo-500 transition-colors font-mono"/>
                    </div>
                    <div>
                      <label className="text-[13px] font-medium text-slate-700 block mb-1.5">Retail Price (₱)</label>
                      <input type="number" placeholder="0.00" className="w-full h-10 px-3 rounded-md border border-slate-300 text-[14px] outline-none focus:border-indigo-500 transition-colors font-mono"/>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-[13px] font-medium text-slate-500 uppercase tracking-wider mb-4">Stock Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[13px] font-medium text-slate-700 block mb-1.5">Initial Quantity (Sets)</label>
                      <input type="number" placeholder="0" className="w-full h-10 px-3 rounded-md border border-slate-300 text-[14px] outline-none focus:border-indigo-500 transition-colors font-mono"/>
                    </div>
                    <div>
                      <label className="text-[13px] font-medium text-slate-700 block mb-1.5">Low Stock Alert Level</label>
                      <input type="number" placeholder="10" className="w-full h-10 px-3 rounded-md border border-slate-300 text-[14px] outline-none focus:border-indigo-500 transition-colors font-mono"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-8 py-5 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setIsAddUniformModalOpen(false)} className="h-10 px-5 rounded-lg border border-slate-300 text-slate-700 font-bold text-[13px] hover:bg-slate-100 bg-white shadow-sm">Cancel</button>
              <button onClick={() => setIsAddUniformModalOpen(false)} className="h-10 px-5 rounded-lg bg-slate-900 text-white font-bold text-[13px] hover:bg-slate-800 shadow-sm transition-all">Save Uniform</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD ACCESSORY MODAL */}
      {isAddAccessoryModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-[600px] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="px-8 py-6 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
              <div>
                <h2 className="text-[24px] font-semibold text-slate-900 tracking-tight">Add Accessories</h2>
                <p className="text-[14px] text-slate-500 mt-1">Register buttons, zippers, or other notions.</p>
              </div>
              <button onClick={() => setIsAddAccessoryModalOpen(false)} className="text-slate-400 hover:text-slate-900"><X size={20}/></button>
            </div>
            <div className="p-8 overflow-y-auto max-h-[70vh]">
              <div className="space-y-6">
                <div>
                  <h3 className="text-[13px] font-medium text-slate-500 uppercase tracking-wider mb-4">Item Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="text-[13px] font-medium text-slate-700 block mb-1.5">Item Name</label>
                      <input type="text" placeholder="e.g. Buttons (Medium - White)" className="w-full h-10 px-3 rounded-md border border-slate-300 text-[14px] outline-none focus:border-indigo-500 transition-colors"/>
                    </div>
                    <div>
                      <label className="text-[13px] font-medium text-slate-700 block mb-1.5">SKU</label>
                      <input type="text" placeholder="ACC-119" className="w-full h-10 px-3 rounded-md border border-slate-300 text-[14px] outline-none focus:border-indigo-500 transition-colors font-mono uppercase"/>
                    </div>
                    <div>
                      <label className="text-[13px] font-medium text-slate-700 block mb-1.5">Accessory Type</label>
                      <select className="w-full h-10 px-3 rounded-md border border-slate-300 text-[14px] outline-none focus:border-indigo-500 transition-colors">
                        <option>Buttons</option>
                        <option>Zippers</option>
                        <option>Elastic</option>
                        <option>Threads</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[13px] font-medium text-slate-700 block mb-1.5">Unit of Measure</label>
                      <input type="text" placeholder="pcs" className="w-full h-10 px-3 rounded-md border border-slate-300 text-[14px] outline-none focus:border-indigo-500 transition-colors"/>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-[13px] font-medium text-slate-500 uppercase tracking-wider mb-4">Supplier & Costing</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="text-[13px] font-medium text-slate-700 block mb-1.5">Preferred Supplier</label>
                      <select className="w-full h-10 px-3 rounded-md border border-slate-300 text-[14px] outline-none focus:border-indigo-500 transition-colors">
                        <option>Select Supplier...</option>
                        <option>QC Garment Supplies</option>
                        <option>Sewing Essentials Co.</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[13px] font-medium text-slate-700 block mb-1.5">Unit Cost (₱)</label>
                      <input type="number" placeholder="0.00" className="w-full h-10 px-3 rounded-md border border-slate-300 text-[14px] outline-none focus:border-indigo-500 transition-colors font-mono"/>
                    </div>
                    <div>
                      <label className="text-[13px] font-medium text-slate-700 block mb-1.5">Retail Price (₱)</label>
                      <input type="number" placeholder="0.00" className="w-full h-10 px-3 rounded-md border border-slate-300 text-[14px] outline-none focus:border-indigo-500 transition-colors font-mono"/>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-[13px] font-medium text-slate-500 uppercase tracking-wider mb-4">Stock Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[13px] font-medium text-slate-700 block mb-1.5">Initial Quantity</label>
                      <input type="number" placeholder="0" className="w-full h-10 px-3 rounded-md border border-slate-300 text-[14px] outline-none focus:border-indigo-500 transition-colors font-mono"/>
                    </div>
                    <div>
                      <label className="text-[13px] font-medium text-slate-700 block mb-1.5">Low Stock Alert Level</label>
                      <input type="number" placeholder="100" className="w-full h-10 px-3 rounded-md border border-slate-300 text-[14px] outline-none focus:border-indigo-500 transition-colors font-mono"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-8 py-5 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setIsAddAccessoryModalOpen(false)} className="h-10 px-5 rounded-lg border border-slate-300 text-slate-700 font-bold text-[13px] hover:bg-slate-100 bg-white shadow-sm">Cancel</button>
              <button onClick={() => setIsAddAccessoryModalOpen(false)} className="h-10 px-5 rounded-lg bg-slate-900 text-white font-bold text-[13px] hover:bg-slate-800 shadow-sm transition-all">Save Accessory</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD TOOLS & MACHINES MODAL */}
      {isAddEquipmentModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-[600px] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="px-8 py-6 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
              <div>
                <h2 className="text-[24px] font-semibold text-slate-900 tracking-tight">Add Tools & Machines</h2>
                <p className="text-[14px] text-slate-500 mt-1">Register machinery or industrial tools.</p>
              </div>
              <button onClick={() => setIsAddEquipmentModalOpen(false)} className="text-slate-400 hover:text-slate-900"><X size={20}/></button>
            </div>
            <div className="p-8 overflow-y-auto max-h-[70vh]">
              <div className="space-y-6">
                <div>
                  <h3 className="text-[13px] font-medium text-slate-500 uppercase tracking-wider mb-4">Equipment Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="text-[13px] font-medium text-slate-700 block mb-1.5">Item Name</label>
                      <input type="text" placeholder="e.g. Industrial Overlock Machine" className="w-full h-10 px-3 rounded-md border border-slate-300 text-[14px] outline-none focus:border-indigo-500 transition-colors"/>
                    </div>
                    <div>
                      <label className="text-[13px] font-medium text-slate-700 block mb-1.5">SKU / Serial No.</label>
                      <input type="text" placeholder="MCH-801" className="w-full h-10 px-3 rounded-md border border-slate-300 text-[14px] outline-none focus:border-indigo-500 transition-colors font-mono uppercase"/>
                    </div>
                    <div>
                      <label className="text-[13px] font-medium text-slate-700 block mb-1.5">Type</label>
                      <select className="w-full h-10 px-3 rounded-md border border-slate-300 text-[14px] outline-none focus:border-indigo-500 transition-colors">
                        <option>Machines</option>
                        <option>Tools</option>
                        <option>Electronics</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[13px] font-medium text-slate-700 block mb-1.5">Condition</label>
                      <select className="w-full h-10 px-3 rounded-md border border-slate-300 text-[14px] outline-none focus:border-indigo-500 transition-colors">
                        <option>New</option>
                        <option>Refurbished</option>
                        <option>Used</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[13px] font-medium text-slate-700 block mb-1.5">Brand</label>
                      <input type="text" placeholder="e.g. Juki, Singer" className="w-full h-10 px-3 rounded-md border border-slate-300 text-[14px] outline-none focus:border-indigo-500 transition-colors"/>
                    </div>
                    <div className="col-span-2">
                      <label className="text-[13px] font-medium text-slate-700 block mb-1.5">Model Number</label>
                      <input type="text" placeholder="e.g. MO-6700" className="w-full h-10 px-3 rounded-md border border-slate-300 text-[14px] outline-none focus:border-indigo-500 transition-colors"/>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-[13px] font-medium text-slate-500 uppercase tracking-wider mb-4">Supplier & Costing</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="text-[13px] font-medium text-slate-700 block mb-1.5">Preferred Supplier</label>
                      <select className="w-full h-10 px-3 rounded-md border border-slate-300 text-[14px] outline-none focus:border-indigo-500 transition-colors">
                        <option>Select Supplier...</option>
                        <option>Machinery Solutions PH</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[13px] font-medium text-slate-700 block mb-1.5">Unit Cost (₱)</label>
                      <input type="number" placeholder="0.00" className="w-full h-10 px-3 rounded-md border border-slate-300 text-[14px] outline-none focus:border-indigo-500 transition-colors font-mono"/>
                    </div>
                    <div>
                      <label className="text-[13px] font-medium text-slate-700 block mb-1.5">Retail Price (₱)</label>
                      <input type="number" placeholder="0.00" className="w-full h-10 px-3 rounded-md border border-slate-300 text-[14px] outline-none focus:border-indigo-500 transition-colors font-mono"/>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-[13px] font-medium text-slate-500 uppercase tracking-wider mb-4">Inventory Status</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[13px] font-medium text-slate-700 block mb-1.5">Current Quantity</label>
                      <input type="number" placeholder="0" className="w-full h-10 px-3 rounded-md border border-slate-300 text-[14px] outline-none focus:border-indigo-500 transition-colors font-mono"/>
                    </div>
                    <div>
                      <label className="text-[13px] font-medium text-slate-700 block mb-1.5">Maintenance Reorder Point</label>
                      <input type="number" placeholder="1" className="w-full h-10 px-3 rounded-md border border-slate-300 text-[14px] outline-none focus:border-indigo-500 transition-colors font-mono"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-8 py-5 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setIsAddEquipmentModalOpen(false)} className="h-10 px-5 rounded-lg border border-slate-300 text-slate-700 font-bold text-[13px] hover:bg-slate-100 bg-white shadow-sm">Cancel</button>
              <button onClick={() => setIsAddEquipmentModalOpen(false)} className="h-10 px-5 rounded-lg bg-slate-900 text-white font-bold text-[13px] hover:bg-slate-800 shadow-sm transition-all">Save Equipment</button>
            </div>
          </div>
        </div>
      )}
      </div>
      {/* Edit Supplier Modal */}
      {isEditSupplierModalOpen && selectedSupplier && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-[600px] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="px-8 py-6 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
              <div>
                <h2 className="text-[20px] font-bold text-slate-900 tracking-tight">Edit Supplier Details</h2>
                <p className="text-[13px] text-slate-500 mt-1">Update profile for {selectedSupplier.name}</p>
              </div>
              <button onClick={() => setIsEditSupplierModalOpen(false)} className="text-slate-400 hover:text-slate-900"><X size={20}/></button>
            </div>
            
            <div className="p-8 overflow-y-auto max-h-[70vh]">
              <h3 className="text-[12px] font-bold text-slate-900 uppercase tracking-wider mb-4">Company Information</h3>
              <div className="flex flex-col gap-4 mb-8">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1.5">Company Name</label>
                  <input type="text" defaultValue={selectedSupplier.name} className="w-full h-10 border border-slate-300 rounded-md text-[13px] px-3 outline-none focus:border-indigo-500"/>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1.5">Office Address</label>
                  <input type="text" placeholder="123 Textile Ave, Manila" className="w-full h-10 border border-slate-300 rounded-md text-[13px] px-3 outline-none focus:border-indigo-500"/>
                </div>
              </div>

              <h3 className="text-[12px] font-bold text-slate-900 uppercase tracking-wider mb-4">Primary Contact</h3>
              <div className="flex flex-col gap-4 mb-8">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1.5">Contact Name</label>
                  <input type="text" defaultValue={selectedSupplier.contact} className="w-full h-10 border border-slate-300 rounded-md text-[13px] px-3 outline-none focus:border-indigo-500"/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1.5">Phone Number</label>
                    <input type="text" defaultValue={selectedSupplier.phone} className="w-full h-10 border border-slate-300 rounded-md text-[13px] px-3 outline-none focus:border-indigo-500"/>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1.5">Email Address</label>
                    <input type="email" defaultValue={selectedSupplier.email} className="w-full h-10 border border-slate-300 rounded-md text-[13px] px-3 outline-none focus:border-indigo-500"/>
                  </div>
                </div>
              </div>

              <h3 className="text-[12px] font-bold text-slate-900 uppercase tracking-wider mb-4">Partnership Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1.5">Category</label>
                  <select defaultValue={selectedSupplier.category} className="w-full h-10 border border-slate-300 rounded-md text-[13px] px-3 outline-none focus:border-indigo-500">
                    <option>Premium Fabrics</option>
                    <option>Threads & Needles</option>
                    <option>Accessories</option>
                    <option>Machinery</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1.5">Rating (1-5)</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="number" 
                      min="1" 
                      max="5" 
                      step="0.1" 
                      defaultValue={parseFloat(selectedSupplier.rating)} 
                      className="w-20 h-10 border border-slate-300 rounded-md text-[14px] font-bold px-3 outline-none focus:border-indigo-500" 
                    />
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400" style={{ width: `${(parseFloat(selectedSupplier.rating) / 5) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-8 py-5 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button onClick={() => setIsEditSupplierModalOpen(false)} className="h-10 px-5 rounded-lg border border-slate-300 text-slate-700 font-bold text-[13px] hover:bg-slate-100 bg-white shadow-sm">Cancel</button>
              <button onClick={() => setIsEditSupplierModalOpen(false)} className="h-10 px-5 rounded-lg bg-slate-900 text-white font-bold text-[13px] hover:bg-slate-800 shadow-sm transition-all hover:scale-[1.02]">Save Changes</button>
            </div>
          </div>
        </div>
      )}
      {/* View Supplier Modal */}
      {isViewSupplierModalOpen && selectedSupplier && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-[550px] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="px-8 py-6 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Truck size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-[18px] font-bold tracking-tight">{selectedSupplier.name}</h2>
                  <p className="text-[12px] text-slate-400">Supplier Profile</p>
                </div>
              </div>
              <button onClick={() => setIsViewSupplierModalOpen(false)} className="text-slate-400 hover:text-white transition-colors"><X size={20}/></button>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Primary Contact</div>
                  <div className="font-bold text-slate-900 text-[14px]">{selectedSupplier.contact}</div>
                  <div className="text-[13px] text-slate-500 mt-0.5">{selectedSupplier.phone}</div>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</div>
                  <div className="font-bold text-blue-600 text-[14px] break-all">{selectedSupplier.email}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Category</div>
                  <div className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-[13px] font-bold text-slate-700 inline-block">
                    {selectedSupplier.category}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Supplier Rating</div>
                  <div className="flex items-center gap-2">
                    <span className="text-[18px] font-black text-amber-500">⭐ {selectedSupplier.rating}</span>
                    <span className="text-[12px] text-slate-400">/ 5.0</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3">
                <BarChart3 size={18} className="text-slate-400 mt-0.5" />
                <div>
                  <div className="text-[13px] font-bold text-slate-900">Partnership Overview</div>
                  <p className="text-[12px] text-slate-500 mt-1">Consistent delivery record with 98% quality pass rate on fabrics.</p>
                </div>
              </div>
            </div>

            <div className="px-8 py-5 border-t border-slate-200 bg-slate-50 flex justify-between items-center shrink-0">
              <button className="text-[13px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1.5">
                <Trash2 size={16} /> Archive Partner
              </button>
              <div className="flex gap-3">
                <button onClick={() => setIsViewSupplierModalOpen(false)} className="h-10 px-5 rounded-lg border border-slate-300 text-slate-700 font-bold text-[13px] hover:bg-slate-100 bg-white shadow-sm">Close</button>
                <button 
                  onClick={() => { setIsViewSupplierModalOpen(false); setIsEditSupplierModalOpen(true); }}
                  className="h-10 px-5 rounded-lg bg-indigo-600 text-white font-bold text-[13px] hover:bg-indigo-700 shadow-sm flex items-center gap-2"
                >
                  <Edit2 size={16} /> Edit Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Restock / Quick Order Modal */}
      {isRestockModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-[500px] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="px-8 py-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <Truck size={20} className="text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-[18px] font-bold text-slate-900 tracking-tight">Create Restock Order</h2>
                  <p className="text-[12px] text-slate-500 font-medium">{selectedItem.item}</p>
                </div>
              </div>
              <button onClick={() => setIsRestockModalOpen(false)} className="text-slate-400 hover:text-slate-900 transition-colors"><X size={20}/></button>
            </div>
            
            <div className="p-8">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 flex justify-between items-center">
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Current Stock</div>
                  <div className="text-[18px] font-black text-slate-900">{selectedItem.stock}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">SKU</div>
                  <div className="text-[14px] font-mono font-bold text-slate-700 uppercase">{selectedItem.sku}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1.5">Quantity to Order</label>
                  <div className="relative">
                    <input type="number" placeholder="Enter amount..." className="w-full h-11 border border-slate-300 rounded-lg text-[14px] px-4 outline-none focus:border-indigo-500 shadow-sm" />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-bold text-slate-400 uppercase">Units</div>
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1.5">Preferred Supplier</label>
                  <select className="w-full h-11 border border-slate-300 rounded-lg text-[14px] px-4 outline-none focus:border-indigo-500 shadow-sm">
                    <option>Premium Fabrics Inc.</option>
                    <option>QC Garment Supplies</option>
                    <option>Textile World Manila</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="px-8 py-5 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button onClick={() => setIsRestockModalOpen(false)} className="h-10 px-5 rounded-lg border border-slate-300 text-slate-700 font-bold text-[13px] hover:bg-slate-100 bg-white">Cancel</button>
              <button onClick={() => setIsRestockModalOpen(false)} className="h-10 px-5 rounded-lg bg-indigo-600 text-white font-bold text-[13px] hover:bg-indigo-700 shadow-md">Submit Order</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
