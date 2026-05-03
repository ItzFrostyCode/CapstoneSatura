'use client';

import { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  AlertTriangle,
  History,
  X,
  Zap,
  Boxes,
  Database,
  PackageCheck,
  Filter,
  Layers,
  Eye,
  CheckCircle2,
  Info,
  ShieldCheck,
  ArrowUpRight,
  TrendingUp,
  BarChart3
} from 'lucide-react';

import { useERPStore, InventoryItem } from '../../store/useERPStore';

// ── HELPER FUNCTIONS ──
function getStatus(item: InventoryItem) {
  if (item.stock <= 0) return 'Out of Stock';
  if (item.stock <= item.minStock) return 'Low Stock';
  return 'In Stock';
}

function getStatusClasses(status: string) {
  switch (status) {
    case 'In Stock': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    case 'Low Stock': return 'bg-amber-50 text-amber-700 border-amber-100';
    case 'Out of Stock': return 'bg-rose-50 text-rose-700 border-rose-100';
    default: return 'bg-slate-100 text-slate-600 border-slate-200';
  }
}

function getMovementClasses(type: string) {
  switch (type) {
    case 'Stock In': return 'bg-emerald-50 text-emerald-700';
    case 'Production': return 'bg-indigo-50 text-indigo-700';
    case 'Adjustment': return 'bg-amber-50 text-amber-700';
    case 'Rework': return 'bg-rose-50 text-rose-700';
    default: return 'bg-slate-100 text-slate-700';
  }
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
}

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<'materials' | 'finished' | 'assembly' | 'history'>('materials');
  const [searchQuery, setSearchQuery] = useState('');
  const [isBOMModalOpen, setIsBOMModalOpen] = useState(false);

  // Core ERP Store
  const {
    inventory,
    movements,
    recipes,
    addInventoryItem,
    saveRecipe: globalSaveRecipe,
    executeAssembly: globalExecuteAssembly,
    createPO
  } = useERPStore();

  // Derived State
  const materials = useMemo(() => inventory.filter((i) => i.cat !== 'Finished Goods'), [inventory]);
  const finishedGoods = useMemo(() => inventory.filter((i) => i.cat === 'Finished Goods'), [inventory]);

  // Add Item State
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    sku: '', item: '', cat: 'Fabric', stock: 0, minStock: 0, unit: 'm', price: 0, cost: 0, location: ''
  });

  const handleAddItem = () => {
    if (!newItem.item || !newItem.sku) return;
    addInventoryItem({ ...newItem, reserved: 0 } as InventoryItem);
    setIsAddItemModalOpen(false);
    setNewItem({ sku: '', item: '', cat: 'Fabric', stock: 0, minStock: 0, unit: 'm', price: 0, cost: 0, location: '' });
  };

  // BOM Setup State
  const [bomProductId, setBomProductId] = useState<string>('');
  const [bomMaterials, setBomMaterials] = useState<{sku: string, qty: number}[]>([]);

  const openBOMModal = (productId: string = '') => {
    const existing = recipes.find(r => r.productId === productId);
    setBomProductId(productId);
    if (existing) {
      setBomMaterials(existing.materials.map(m => ({ ...m })));
    } else {
      setBomMaterials([]);
    }
    setIsBOMModalOpen(true);
  };

  const handleAddBOMMaterial = () => {
    setBomMaterials(prev => [...prev, { sku: materials[0]?.sku || '', qty: 1 }]);
  };

  const handleUpdateBOMMaterial = (index: number, field: 'sku' | 'qty', value: string | number) => {
    setBomMaterials(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleRemoveBOMMaterial = (index: number) => {
    setBomMaterials(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveRecipe = () => {
    if (!bomProductId || bomMaterials.length === 0) return;
    globalSaveRecipe({ productId: bomProductId, materials: bomMaterials });
    setIsBOMModalOpen(false);
  };


  const filteredMaterials = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return materials;
    return materials.filter(
      (item) =>
        item.item.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.cat.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        getStatus(item).toLowerCase().includes(q)
    );
  }, [materials, searchQuery]);

  const filteredFinishedGoods = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return finishedGoods;
    return finishedGoods.filter(
      (item) =>
        item.item.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        getStatus(item).toLowerCase().includes(q)
    );
  }, [finishedGoods, searchQuery]);

  // Assembly State
  const [assemblyProductId, setAssemblyProductId] = useState<string>('UNF-POL-001');
  const [assemblyQty, setAssemblyQty] = useState<number>(1);
  const [assemblySuccess, setAssemblySuccess] = useState(false);

  const selectedRecipe = useMemo(() => recipes.find(r => r.productId === assemblyProductId), [assemblyProductId, recipes]);
  const targetProduct = useMemo(() => inventory.find(i => i.sku === assemblyProductId), [assemblyProductId, inventory]);

  const assemblyValidation = useMemo(() => {
    if (!selectedRecipe || !targetProduct) return { canAssemble: false, missing: [] };
    const missing: { name: string; needed: number; avail: number; unit: string }[] = [];
    selectedRecipe.materials.forEach(m => {
      const item = inventory.find(i => i.sku === m.sku);
      const needed = m.qty * assemblyQty;
      if (!item || item.stock < needed) {
        missing.push({
          name: item?.item || m.sku,
          needed: needed,
          avail: item?.stock || 0,
          unit: item?.unit || 'units'
        });
      }
    });
    return { canAssemble: missing.length === 0 && assemblyQty > 0, missing };
  }, [selectedRecipe, targetProduct, inventory, assemblyQty]);

  const executeAssembly = () => {
    if (!assemblyValidation.canAssemble || !selectedRecipe || !targetProduct) return;
    globalExecuteAssembly(targetProduct.sku, assemblyQty, 'Joshua Arabejo');
    setAssemblySuccess(true);
    setTimeout(() => setAssemblySuccess(false), 3000);
  };

  const lowStockCount = inventory.filter(i => getStatus(i) === 'Low Stock' || getStatus(i) === 'Out of Stock').length;

  const stats = [
    { label: 'Raw Materials', value: materials.length.toString(), color: 'indigo', sub: 'Available SKUs' },
    { label: 'Finished Units', value: finishedGoods.reduce((sum, i) => sum + i.stock, 0).toString(), color: 'emerald', sub: 'Ready for Release' },
    { label: 'Active Recipes', value: recipes.length.toString(), color: 'amber', sub: 'BOMs Configured' },
    { label: 'Low Stock Alerts', value: lowStockCount.toString(), color: 'rose', sub: 'Action Required' },
  ] as const;

  const colorClassMap: Record<string, string> = {
    indigo: 'bg-indigo-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1400px] mx-auto pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight leading-none">Material Inventory</h1>
          <p className="text-[14px] text-slate-500 font-medium mt-1">
            Real-time tracking of fabrics, linings, and garment accessories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openBOMModal()}
            className="bg-white text-slate-600 h-11 px-5 rounded-xl text-[13px] font-bold border border-slate-200 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
          >
            <Layers size={16} /> BOM Setup
          </button>
          <button 
            onClick={() => setIsAddItemModalOpen(true)}
            className="bg-slate-900 text-white h-11 px-6 rounded-xl text-[13px] font-black hover:bg-indigo-600 transition-all shadow-lg shadow-slate-900/10 flex items-center gap-2"
          >
            <Plus size={18} /> Add New Item
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em]">{stat.label}</span>
              <div className={`w-2 h-2 rounded-full ${colorClassMap[stat.color]} shadow-[0_0_8px_rgba(0,0,0,0.1)]`} />
            </div>
            <div className="text-[28px] font-black text-slate-900 tracking-tight">{stat.value}</div>
            <div className="text-[11px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{stat.sub}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap bg-slate-100/80 p-1.5 rounded-full w-max gap-1 mb-6 border border-slate-200/50">
        {[
          { id: 'materials', name: 'Materials', icon: <Database size={14} /> },
          { id: 'finished', name: 'Finished Goods', icon: <PackageCheck size={14} /> },
          { id: 'assembly', name: 'Assembly', icon: <Zap size={14} /> },
          { id: 'history', name: 'History', icon: <History size={14} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'materials' | 'finished' | 'assembly' | 'history')}
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

      <div className="bg-white border border-slate-200 rounded-[32px] shadow-sm overflow-hidden">
        {activeTab === 'materials' && (
          <div className="animate-in slide-in-from-bottom-2 duration-500">
            <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-[18px] font-black text-slate-900">Raw Inventory</h3>
                <p className="text-[13px] text-slate-500 font-medium">Fabrics, threads, and accessory stock levels.</p>
              </div>

              <div className="flex items-center gap-3 md:w-[420px]">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search materials..."
                    className="h-10 w-full pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium outline-none focus:bg-white focus:border-slate-900 transition-all"
                  />
                </div>
                <button className="h-10 px-4 rounded-xl border border-slate-200 bg-white text-slate-600 text-[13px] font-bold flex items-center gap-2">
                  <Filter size={15} /> Filter
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                    <th className="px-6 py-4">Item & SKU</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4 text-center">Stock</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-center">Location</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredMaterials.map((item) => (
                    <tr key={item.sku} className="hover:bg-slate-50/50 transition-all group">
                      <td className="px-6 py-5">
                        <div>
                          <div className="text-[15px] font-bold text-slate-900 leading-none mb-1">{item.item}</div>
                          <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{item.sku}</div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 px-2.5 py-1 rounded-lg">
                          {item.cat}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="text-[15px] font-black text-slate-900">{item.stock}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.unit}</div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={`inline-flex text-[11px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${getStatusClasses(getStatus(item))}`}>
                          {getStatus(item)}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="text-[12px] font-bold text-slate-600 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                          {item.location}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button className="h-9 px-4 rounded-lg bg-white border border-slate-200 text-slate-900 text-[12px] font-bold hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                          Stock In
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'finished' && (
          <div className="animate-in slide-in-from-bottom-2 duration-500">
            <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-[18px] font-black text-slate-900">Finished Goods</h3>
                <p className="text-[13px] text-slate-500 font-medium">Assembled uniform sets ready for delivery.</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="h-10 px-4 bg-white border border-slate-200 rounded-xl text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2">
                  <Eye size={16} /> View Output
                </button>
                <button className="h-10 px-4 bg-emerald-600 text-white rounded-xl text-[13px] font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center gap-2">
                  <PackageCheck size={16} /> Batch Release
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                    <th className="px-6 py-4">Product Name</th>
                    <th className="px-6 py-4 text-center">Available Units</th>
                    <th className="px-6 py-4">Linked BOM</th>
                    <th className="px-6 py-4 text-center">Valuation (Price)</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredFinishedGoods.map((item) => (
                    <tr key={item.sku} className="hover:bg-slate-50/50 transition-all group">
                      <td className="px-6 py-5">
                        <div>
                          <div className="text-[15px] font-bold text-slate-900 leading-none mb-1">{item.item}</div>
                          <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{item.sku}</div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="text-[15px] font-black text-slate-900">{item.stock}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.unit}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="inline-flex items-center gap-2 text-[12px] font-bold text-indigo-600 px-3 py-1 bg-indigo-50 rounded-lg border border-indigo-100">
                          <Layers size={12} /> Standard Recipe
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center font-bold text-slate-700">{formatCurrency(item.price)}</td>
                      <td className="px-6 py-5 text-right">
                        <button className="h-9 px-4 rounded-lg bg-white border border-slate-200 text-slate-900 text-[12px] font-bold hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'assembly' && (
          <div className="p-12 animate-in fade-in zoom-in-95 duration-500">
            <div className="max-w-4xl mx-auto space-y-10">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                  <Zap size={32} />
                </div>
                <h2 className="text-[24px] font-black text-slate-900">Production Assembly Engine</h2>
                <p className="text-[15px] text-slate-500 font-medium max-w-md mx-auto">
                  Select a product recipe to convert raw materials into finished garment stock.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                  <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 space-y-6">
                    <div>
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Target Product</label>
                      <select 
                        value={assemblyProductId}
                        onChange={(e) => setAssemblyProductId(e.target.value)}
                        className="w-full h-14 px-5 rounded-2xl border border-slate-200 bg-white focus:border-slate-900 outline-none transition-all text-[15px] font-bold shadow-sm appearance-none"
                      >
                        {recipes.map(r => {
                          const p = inventory.find(i => i.sku === r.productId);
                          return <option key={r.productId} value={r.productId}>{p?.item || r.productId}</option>;
                        })}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Batch Quantity</label>
                      <div className="flex items-center gap-4">
                        <input
                          type="number"
                          value={assemblyQty}
                          onChange={(e) => setAssemblyQty(Math.max(1, parseInt(e.target.value) || 0))}
                          min={1}
                          className="h-14 flex-1 px-5 rounded-2xl border border-slate-200 bg-white focus:border-slate-900 outline-none transition-all text-[18px] font-black shadow-sm"
                        />
                        <span className="text-[14px] font-black text-slate-400 uppercase tracking-widest">Units</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={executeAssembly} 
                    disabled={!assemblyValidation.canAssemble}
                    className={`w-full h-16 rounded-[24px] text-[16px] font-black flex items-center justify-center gap-3 transition-all ${
                      assemblySuccess ? 'bg-emerald-500 text-white' : 
                      !assemblyValidation.canAssemble ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 
                      'bg-slate-900 text-white shadow-xl shadow-slate-900/20 hover:bg-indigo-600'
                    }`}
                  >
                    {assemblySuccess ? <><CheckCircle2 size={20} /> Production Logged</> : 
                     !assemblyValidation.canAssemble ? 'Insufficient Materials' : 
                     <><ArrowUpRight size={20} /> Execute Production Build</>}
                  </button>
                </div>

                <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h4 className="text-[14px] font-black text-slate-900 uppercase tracking-widest">BOM Requirements</h4>
                    <span className="text-[12px] font-bold text-slate-400">Target: {assemblyQty} units</span>
                  </div>

                  <div className="space-y-4">
                    {selectedRecipe?.materials.map((req, i) => {
                      const item = inventory.find(inv => inv.sku === req.sku);
                      const needed = req.qty * assemblyQty;
                      const isShort = item && item.stock < needed;

                      return (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${isShort ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                            <span className="text-[14px] font-bold text-slate-700">{item?.item || req.sku}</span>
                          </div>
                          <div className="text-right">
                            <div className={`text-[14px] font-black ${isShort ? 'text-rose-600' : 'text-slate-900'}`}>-{needed}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase">Avail: {item?.stock} {item?.unit}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-4 border-t border-slate-100 mt-6">
                    {!assemblyValidation.canAssemble && (
                      <div className="flex items-start gap-3 text-rose-600 mb-4 p-3 bg-rose-50 rounded-xl">
                        <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[12px] font-bold">Shortage Detected!</p>
                          <p className="text-[11px] font-medium mt-1">
                            Missing {assemblyValidation.missing.map(m => `${m.needed - m.avail} ${m.unit} of ${m.name}`).join(', ')}.
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-slate-500">
                      <Info size={18} />
                      <p className="text-[12px] font-medium">Materials will be deducted dynamically upon execution.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="animate-in slide-in-from-bottom-2 duration-500">
            <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-[18px] font-black text-slate-900">Stock Movements</h3>
                <p className="text-[13px] text-slate-500 font-medium">Real-time audit log of all material usage and receiving.</p>
              </div>
            
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                    <th className="px-6 py-4">Date & Time</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Item Involved</th>
                    <th className="px-6 py-4 text-center">Quantity</th>
                    <th className="px-6 py-4">Actor</th>
                    <th className="px-6 py-4 text-right">Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {movements.map((move) => (
                    <tr key={move.id} className="hover:bg-slate-50/50 transition-all group">
                      <td className="px-6 py-5 text-[14px] font-medium text-slate-700">{move.date}</td>
                      <td className="px-6 py-5">
                        <span
                          className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest ${getMovementClasses(move.type)}`}
                        >
                          {move.type}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-[14px] font-bold text-slate-900">{move.itemName}</td>
                      <td className={`px-6 py-5 text-center font-black ${move.qty > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {move.qty > 0 ? `+${move.qty}` : move.qty} {move.unit}
                      </td>
                      <td className="px-6 py-5 text-[14px] font-medium text-slate-600">{move.staff}</td>
                      <td className="px-6 py-5 text-right font-black text-indigo-600 text-[12px]">{move.ref}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}


      </div>

      {isBOMModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[750px] rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div>
                <h2 className="text-[20px] font-black text-slate-900 tracking-tight">Bill of Materials (BOM)</h2>
                <p className="text-[13px] text-slate-500 font-medium">Define material recipes for your premade production lines.</p>
              </div>
              <button
                onClick={() => setIsBOMModalOpen(false)}
                className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Target Product</label>
                  <select
                    value={bomProductId}
                    onChange={(e) => setBomProductId(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-medium appearance-none"
                  >
                    <option value="" disabled>Select Finished Good</option>
                    {finishedGoods.map(fg => (
                      <option key={fg.sku} value={fg.sku}>{fg.item} ({fg.sku})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-50">
                <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-widest">BOM Ingredients</h3>

                {bomMaterials.map((mat, i) => {
                  const selectedMat = materials.find(m => m.sku === mat.sku);
                  return (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white shadow-sm">
                      <div className="flex flex-1 items-center gap-3 mr-4">
                        <button onClick={() => handleRemoveBOMMaterial(i)} className="text-rose-400 hover:text-rose-600 p-1">
                          <X size={16} />
                        </button>
                        <select
                          value={mat.sku}
                          onChange={(e) => handleUpdateBOMMaterial(i, 'sku', e.target.value)}
                          className="flex-1 h-9 bg-transparent border-none outline-none text-[14px] font-bold text-slate-700"
                        >
                          <option value="" disabled>Select Material</option>
                          {materials.map(m => (
                            <option key={m.sku} value={m.sku}>{m.item}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          value={mat.qty || ''}
                          onChange={(e) => handleUpdateBOMMaterial(i, 'qty', Number(e.target.value))}
                          step="0.1"
                          min="0"
                          placeholder="Qty"
                          className="w-20 h-9 px-2 bg-slate-50 border border-slate-100 rounded-lg text-center text-[14px] font-black text-slate-900 outline-none focus:border-indigo-400"
                        />
                        <span className="text-[12px] font-bold text-slate-400 uppercase w-8 text-left">{selectedMat ? selectedMat.unit : '-'}</span>
                      </div>
                    </div>
                  );
                })}

                <button 
                  onClick={handleAddBOMMaterial}
                  className="w-full h-12 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-[13px] font-bold text-slate-400 hover:text-slate-900 hover:border-slate-400 transition-all"
                >
                  <Plus size={16} /> Add Material to Recipe
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100 flex gap-4">
                <ShieldCheck size={20} className="text-indigo-600 shrink-0" />
                <p className="text-[12px] text-indigo-700/80 font-medium">
                  Automatic stock deduction will occur whenever a new production batch is executed in the Assembly tab.
                </p>
              </div>
            </div>

            <div className="p-8 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => setIsBOMModalOpen(false)}
                className="px-6 h-12 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-600 hover:bg-slate-50 transition-all"
              >
                Discard
              </button>
              <button
                onClick={handleSaveRecipe}
                disabled={!bomProductId || bomMaterials.length === 0}
                className="px-8 h-12 bg-slate-900 text-white rounded-xl text-[14px] font-black shadow-lg shadow-slate-900/10 hover:bg-slate-800 disabled:opacity-50 transition-all"
              >
                Save BOM Recipe
              </button>
            </div>
          </div>
        </div>
      )}

      {isAddItemModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[600px] rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div>
                <h2 className="text-[20px] font-black text-slate-900 tracking-tight">Add New Item</h2>
                <p className="text-[13px] text-slate-500 font-medium">Register a new raw material or finished good into inventory.</p>
              </div>
              <button
                onClick={() => setIsAddItemModalOpen(false)}
                className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Item Name</label>
                  <input
                    type="text"
                    value={newItem.item}
                    onChange={e => setNewItem(prev => ({ ...prev, item: e.target.value }))}
                    placeholder="e.g. Silk Thread"
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-medium"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">SKU</label>
                  <input
                    type="text"
                    value={newItem.sku}
                    onChange={e => setNewItem(prev => ({ ...prev, sku: e.target.value }))}
                    placeholder="e.g. THR-SLK-001"
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-medium"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Category</label>
                  <select
                    value={newItem.cat}
                    onChange={e => setNewItem(prev => ({ ...prev, cat: e.target.value }))}
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-medium appearance-none"
                  >
                    <option value="Fabric">Fabric</option>
                    <option value="Thread">Thread</option>
                    <option value="Buttons">Buttons</option>
                    <option value="Zipper">Zipper</option>
                    <option value="Label">Label</option>
                    <option value="Finished Goods">Finished Goods</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Initial Stock</label>
                  <input
                    type="number"
                    value={newItem.stock || ''}
                    onChange={e => setNewItem(prev => ({ ...prev, stock: Number(e.target.value) }))}
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-medium"
                  />
                </div>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Min Stock</label>
                    <input
                      type="number"
                      value={newItem.minStock || ''}
                      onChange={e => setNewItem(prev => ({ ...prev, minStock: Number(e.target.value) }))}
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-medium"
                    />
                  </div>
                  <div className="w-[80px]">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Unit</label>
                    <select
                      value={newItem.unit}
                      onChange={e => setNewItem(prev => ({ ...prev, unit: e.target.value }))}
                      className="w-full h-12 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-medium appearance-none"
                    >
                      <option value="m">m</option>
                      <option value="pcs">pcs</option>
                      <option value="cones">cones</option>
                      <option value="sets">sets</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Cost (Per Unit)</label>
                  <input
                    type="number"
                    value={newItem.cost || ''}
                    onChange={e => setNewItem(prev => ({ ...prev, cost: Number(e.target.value) }))}
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-medium"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Storage Location</label>
                  <input
                    type="text"
                    value={newItem.location}
                    onChange={e => setNewItem(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g. Shelf A-2"
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => setIsAddItemModalOpen(false)}
                className="px-6 h-12 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-600 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAddItem}
                disabled={!newItem.item || !newItem.sku}
                className="px-8 h-12 bg-slate-900 text-white rounded-xl text-[14px] font-black shadow-lg shadow-slate-900/10 hover:bg-slate-800 disabled:opacity-50 transition-all"
              >
                Create Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
