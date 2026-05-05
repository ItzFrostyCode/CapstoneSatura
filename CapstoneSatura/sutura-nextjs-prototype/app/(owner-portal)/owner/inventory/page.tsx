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
  BarChart3,
  MoreVertical,
  Download,
  Upload,
  Archive,
  Inbox,
  FileX,
  ChevronRight,
  ClipboardList,
  MapPin
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

function getHealthBadge(status: string) {
  switch (status) {
    case 'In Stock': return { label: 'Healthy', classes: 'bg-emerald-50 text-emerald-700 border-emerald-100', dot: 'bg-emerald-500' };
    case 'Low Stock': return { label: 'Watch', classes: 'bg-amber-50 text-amber-700 border-amber-100', dot: 'bg-amber-500' };
    case 'Out of Stock': return { label: 'Critical', classes: 'bg-rose-50 text-rose-700 border-rose-100', dot: 'bg-rose-500' };
    default: return { label: 'Unknown', classes: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-500' };
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

const renderAvatar = (name: string, size: number = 40, imageUrl?: string) => {
  if (imageUrl) {
    return (
      <img 
        src={imageUrl} 
        alt={name}
        className="rounded-xl object-cover shrink-0 shadow-sm border border-slate-100"
        style={{ width: `${size}px`, height: `${size}px` }}
      />
    );
  }
  const initial = name.charAt(0).toUpperCase();
  return (
    <div 
      className="rounded-xl flex items-center justify-center font-black text-white shrink-0 shadow-sm bg-slate-900"
      style={{ 
        width: `${size}px`, 
        height: `${size}px`, 
        fontSize: `${size * 0.4}px`
      }}
    >
      {initial}
    </div>
  );
};

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<'materials' | 'finished' | 'assembly' | 'history'>('materials');
  const [searchQuery, setSearchQuery] = useState('');
  const [isBOMModalOpen, setIsBOMModalOpen] = useState(false);

  // Stock In Modal State
  const [isStockInModalOpen, setIsStockInModalOpen] = useState(false);
  const [stockInItem, setStockInItem] = useState<InventoryItem | null>(null);
  const [stockInForm, setStockInForm] = useState({ qty: 0, supplier: '', ref: '' });

  // Adjust Stock Modal State
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustItem, setAdjustItem] = useState<InventoryItem | null>(null);
  const [adjustForm, setAdjustForm] = useState({ qty: 0, reason: '', type: 'Usage' as 'Usage' | 'Stock Adjustment' });

  // Batch Release Modal State
  const [isBatchReleaseModalOpen, setIsBatchReleaseModalOpen] = useState(false);

  // View Item Detail State
  const [viewItem, setViewItem] = useState<InventoryItem | null>(null);

  // Action Menu State
  const [activeActionRow, setActiveActionRow] = useState<string | null>(null);

  // Core ERP Store
  const {
    inventory,
    movements,
    recipes,
    staff,
    suppliers,
    addInventoryItem,
    addMovement,
    updateInventoryItem,
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
    sku: '', item: '', cat: 'Fabric', stock: 0, minStock: 0, unit: 'm', price: 0, cost: 0, location: '', supplier_id: ''
  });

  const handleAddItem = () => {
    if (!newItem.item || !newItem.sku) return;
    addInventoryItem({ ...newItem, reserved: 0, supplier_id: newItem.supplier_id || undefined } as InventoryItem);
    setIsAddItemModalOpen(false);
    setNewItem({ sku: '', item: '', cat: 'Fabric', stock: 0, minStock: 0, unit: 'm', price: 0, cost: 0, location: '', supplier_id: '', image: '' });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // BOM Setup State
  const [bomProductId, setBomProductId] = useState<string>('');
  const [bomMaterials, setBomMaterials] = useState<{sku: string, qty: number}[]>([]);
  const [bomMode, setBomMode] = useState<'select' | 'create'>('select');
  const [bomNewItemName, setBomNewItemName] = useState('');
  const [bomNewItemSKU, setBomNewItemSKU] = useState('');

  const openBOMModal = (productId: string = '') => {
    const existing = recipes.find(r => r.productId === productId);
    setBomProductId(productId);
    setBomMode(productId ? 'select' : 'select');
    setBomNewItemName('');
    setBomNewItemSKU('');
    if (existing) {
      setBomMaterials(existing.materials.map(m => ({ ...m })));
    } else {
      setBomMaterials([]);
    }
    setIsBOMModalOpen(true);
  };

  // Auto-load existing recipe when product is selected inside the BOM modal
  const handleBOMProductChange = (productId: string) => {
    setBomProductId(productId);
    const existing = recipes.find(r => r.productId === productId);
    setBomMaterials(existing ? existing.materials.map(m => ({ ...m })) : []);
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
    let targetProductId = bomProductId;
    if (bomMode === 'create') {
       targetProductId = bomNewItemSKU || `FG-${Date.now().toString().slice(-6)}`;
       addInventoryItem({
          sku: targetProductId,
          item: bomNewItemName || 'New Product',
          cat: 'Finished Goods',
          stock: 0,
          minStock: 5,
          unit: 'pcs',
          price: 0,
          cost: 0,
          location: 'TBD',
          reserved: 0
       });
    }

    if (!targetProductId || bomMaterials.length === 0) return;
    globalSaveRecipe({ productId: targetProductId, materials: bomMaterials });
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
  const [assemblyStep, setAssemblyStep] = useState<1 | 2 | 3>(1);
  const [assemblyProductId, setAssemblyProductId] = useState<string>('UNF-POL-001');
  const [assemblyQty, setAssemblyQty] = useState<number>(1);
  const [assemblySuccess, setAssemblySuccess] = useState(false);

  const handleOpenStockIn = (item: InventoryItem) => {
    const receiptRef = 'REC-' + new Date().getTime().toString().slice(-6);
    setStockInItem(item);
    setStockInForm({ qty: 0, supplier: '', ref: receiptRef });
    setIsStockInModalOpen(true);
    setActiveActionRow(null);
  };

  const handleStockInSubmit = () => {
    if (!stockInItem || !stockInForm.qty || stockInForm.qty <= 0) return;
    updateInventoryItem(stockInItem.sku, { stock: stockInItem.stock + stockInForm.qty });
    addMovement({
      type: 'Stock In',
      itemSku: stockInItem.sku,
      itemName: stockInItem.item,
      qty: stockInForm.qty,
      unit: stockInItem.unit,
      staff_id: 'STF-001',
      ref: stockInForm.ref || '-',
      supplierId: stockInForm.supplier || undefined,
    });
    // Also link supplier to the inventory item if not already set
    if (stockInForm.supplier && !stockInItem.supplier_id) {
      updateInventoryItem(stockInItem.sku, { supplier_id: stockInForm.supplier });
    }
    setIsStockInModalOpen(false);
    setStockInItem(null);
    setStockInForm({ qty: 0, supplier: '', ref: '' });
  };

  const handleOpenAdjust = (item: InventoryItem) => {
    setAdjustItem(item);
    setAdjustForm({ qty: 0, reason: '', type: 'Usage' });
    setIsAdjustModalOpen(true);
    setActiveActionRow(null);
  };

  const handleAdjustSubmit = () => {
    if (!adjustItem || !adjustForm.qty || adjustForm.qty <= 0) return;
    if (adjustItem.stock - adjustForm.qty < 0) {
      alert("Cannot adjust stock below 0.");
      return;
    }
    
    updateInventoryItem(adjustItem.sku, { stock: adjustItem.stock - adjustForm.qty });
    addMovement({
      type: adjustForm.type,
      itemSku: adjustItem.sku,
      itemName: adjustItem.item,
      qty: -adjustForm.qty,
      unit: adjustItem.unit, 
      staff_id: 'STF-001',
      ref: adjustForm.reason || 'Manual Adjustment'
    });
    
    setIsAdjustModalOpen(false);
    setAdjustItem(null);
    setAdjustForm({ qty: 0, reason: '', type: 'Usage' });
  };

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
    globalExecuteAssembly(targetProduct.sku, assemblyQty, 'STF-001');
    setAssemblySuccess(true);
    setTimeout(() => {
      setAssemblySuccess(false);
      setAssemblyStep(1);
    }, 3000);
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight leading-none">Inventory</h1>
          <p className="text-[14px] text-slate-500 font-medium mt-1">Real-time tracking of fabrics, linings, and garment accessories.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openBOMModal()}
            className="bg-white text-slate-600 h-10 px-5 rounded-full text-[12px] font-bold border border-slate-200 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
          >
            <Zap size={14} /> BOM
          </button>
          <button
            onClick={() => setIsAddItemModalOpen(true)}
            className="bg-slate-900 text-white h-10 px-6 rounded-full text-[12px] font-black hover:bg-indigo-600 transition-all shadow-md shadow-slate-900/10 flex items-center gap-2 active:scale-95"
          >
            <Plus size={16} /> New Item
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
                <p className="text-[12px] text-slate-500 italic">Fabrics, threads, and accessory stock levels.</p>
              </div>

              <div className="flex items-center gap-3 md:w-[420px]">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search materials..."
                    className="h-10 w-full pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-full text-[13px] font-medium outline-none focus:bg-white focus:border-slate-900 transition-all"
                  />
                </div>
                <button className="h-10 px-5 rounded-full border border-slate-200 bg-white text-slate-600 text-[12px] font-bold flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
                  <Filter size={14} /> Filter
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                    <th className="px-6 py-4">Item & SKU</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Supplier</th>
                    <th className="px-6 py-4 text-center">Stock (Derived)</th>
                    <th className="px-6 py-4 text-center">Reorder At</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredMaterials.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center">
                            <Search size={24} />
                          </div>
                          <div>
                            <p className="text-[14px] font-bold text-slate-900">No materials found</p>
                            <p className="text-[12px] text-slate-500 font-medium">Try adjusting your search or filters.</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredMaterials.map((item) => {
                      const health = getHealthBadge(getStatus(item));
                      return (
                        <tr key={item.sku} className="hover:bg-slate-50/50 transition-all group">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              {renderAvatar(item.item, 44, item.image)}
                              <div>
                                <div className="text-[15px] font-bold text-slate-900 leading-none mb-1">{item.item}</div>
                                <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{item.sku}</div>
                                {item.location && (
                                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-1.5">
                                    <MapPin size={10} className="text-indigo-400" />
                                    {item.location}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                             <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200/50 uppercase tracking-wide">
                               {item.cat}
                             </span>
                          </td>
                          <td className="px-6 py-5">
                            <span className="text-[12px] font-bold text-indigo-600">{item.supplier_id ? suppliers.find(s => s.id === item.supplier_id)?.name || 'Unlinked' : 'Unlinked'}</span>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <div className="text-[15px] font-black text-slate-900">{item.stock}</div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.unit}</div>
                            <div className="text-[9px] text-slate-300 italic mt-0.5">derived</div>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <div className="text-[13px] font-bold text-amber-600">{item.minStock} {item.unit}</div>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <div className="flex flex-col items-center gap-1.5">
                              <span className={`inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${health.classes}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${health.dot}`} />
                                {health.label}
                              </span>
                              <span className="text-[10px] text-slate-400 font-bold">{getStatus(item)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <div className="flex items-center justify-end gap-2 relative">
                              <button 
                                onClick={() => handleOpenStockIn(item)}
                                className="h-8 px-4 rounded-full bg-indigo-50 text-indigo-600 text-[11px] font-bold hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100 flex items-center gap-1.5 active:scale-95"
                              >
                                <Upload size={12} /> Stock In
                              </button>
                              
                              <button 
                                onClick={() => setActiveActionRow(activeActionRow === item.sku ? null : item.sku)}
                                className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200"
                              >
                                <MoreVertical size={16} />
                              </button>

                              {activeActionRow === item.sku && (
                                <>
                                  <div className="fixed inset-0 z-10" onClick={() => setActiveActionRow(null)}></div>
                                  <div className="absolute top-10 right-0 z-20 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                                    <button 
                                      onClick={() => { setViewItem(item); setActiveActionRow(null); }}
                                      className="w-full px-4 py-2 text-left text-[13px] font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                    >
                                      <Eye size={14} /> View Details
                                    </button>
                                    <button 
                                      onClick={() => handleOpenAdjust(item)}
                                      className="w-full px-4 py-2 text-left text-[13px] font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                    >
                                      <ClipboardList size={14} /> Adjust Stock
                                    </button>
                                    <div className="h-px bg-slate-100 my-1"></div>
                                    <button className="w-full px-4 py-2 text-left text-[13px] font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2">
                                      <Archive size={14} /> Archive Item
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'finished' && (
          <div className="animate-in slide-in-from-bottom-2 duration-500">
            <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-[12px] text-slate-500 italic">Assembled uniform sets ready for delivery.</p>
              </div>
              <div className="flex items-center gap-3 relative">
                <button 
                  onClick={() => setActiveActionRow(activeActionRow === 'filter' ? null : 'filter')}
                  className="h-10 px-5 bg-white border border-slate-200 rounded-full text-[12px] font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
                >
                  <Filter size={14} /> Filter
                </button>
                {activeActionRow === 'filter' && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setActiveActionRow(null)}></div>
                    <div className="absolute top-12 left-0 z-20 w-48 bg-white border border-slate-200 rounded-[20px] shadow-xl py-3 px-4 animate-in fade-in zoom-in-95 duration-100">
                       <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Category Filter</p>
                       <label className="flex items-center gap-2 text-[13px] text-slate-700 py-1 cursor-pointer"><input type="checkbox" className="rounded-full" /> All Categories</label>
                    </div>
                  </>
                )}
                
                <button className="h-10 px-5 bg-white border border-slate-200 rounded-full text-[12px] font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                  <Download size={14} /> Export CSV
                </button>
                <button 
                  onClick={() => setIsBatchReleaseModalOpen(true)}
                  className="h-10 px-6 bg-emerald-600 text-white rounded-full text-[12px] font-black shadow-lg shadow-emerald-600/10 hover:bg-emerald-700 transition-all flex items-center gap-2 active:scale-95"
                >
                  <PackageCheck size={14} /> Batch Release
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                    <th className="px-6 py-4">Product Name</th>
                    <th className="px-6 py-4 text-center">Available Units</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Linked BOM</th>
                    <th className="px-6 py-4 text-center">Valuation (Price)</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredFinishedGoods.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center">
                            <Search size={24} />
                          </div>
                          <div>
                            <p className="text-[14px] font-bold text-slate-900">No finished goods found</p>
                            <p className="text-[12px] text-slate-500 font-medium">Try adjusting your search or filters.</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredFinishedGoods.map((item) => (
                      <tr key={item.sku} className="hover:bg-slate-50/50 transition-all group">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            {renderAvatar(item.item, 44, item.image)}
                            <div>
                              <div className="text-[15px] font-bold text-slate-900 leading-none mb-1">{item.item}</div>
                              <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{item.sku}</div>
                              {item.location && (
                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-1.5">
                                  <MapPin size={10} className="text-indigo-400" />
                                  {item.location}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <div className="text-[15px] font-black text-slate-900">{item.stock}</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.unit}</div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-1.5 text-[12px] font-bold text-slate-600">
                            <MapPin size={12} className="text-indigo-400" />
                            {item.location || '—'}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          {recipes.find(r => r.productId === item.sku) ? (
                            <div className="inline-flex items-center gap-2 text-[10px] font-bold text-indigo-600 px-3 py-1 bg-indigo-50 rounded-full border border-indigo-100 uppercase tracking-wide">
                              <Layers size={11} /> BOM Configured
                            </div>
                          ) : (
                            <button
                              onClick={() => { openBOMModal(item.sku); }}
                              className="inline-flex items-center gap-2 text-[10px] font-bold text-amber-600 px-3 py-1 bg-amber-50 rounded-full border border-amber-100 hover:bg-amber-600 hover:text-white transition-all uppercase tracking-wide active:scale-95"
                            >
                              <Plus size={11} /> Set Up BOM
                            </button>
                          )}
                        </td>
                        <td className="px-6 py-5 text-center font-bold text-slate-700">{formatCurrency(item.price)}</td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2 relative">
                            <button 
                              onClick={() => setActiveActionRow(activeActionRow === item.sku ? null : item.sku)}
                              className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200"
                            >
                              <MoreVertical size={16} />
                            </button>

                            {activeActionRow === item.sku && (
                              <>
                                <div className="fixed inset-0 z-10" onClick={() => setActiveActionRow(null)}></div>
                                <div className="absolute top-10 right-0 z-20 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                                  <button 
                                    onClick={() => { setViewItem(item); setActiveActionRow(null); }}
                                    className="w-full px-4 py-2 text-left text-[13px] font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                  >
                                    <Eye size={14} /> View Details
                                  </button>
                                  <button 
                                    onClick={() => { openBOMModal(item.sku); setActiveActionRow(null); }}
                                    className="w-full px-4 py-2 text-left text-[13px] font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                  >
                                    <Zap size={14} /> Manage BOM
                                  </button>
                                  <div className="h-px bg-slate-100 my-1"></div>
                                  <button className="w-full px-4 py-2 text-left text-[13px] font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2">
                                    <Archive size={14} /> Archive Product
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
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
                  Follow the steps to convert raw materials into finished garment stock.
                </p>
              </div>

              {/* Stepper Header */}
              <div className="flex items-center justify-center max-w-2xl mx-auto mb-4">
                {[
                  { step: 1, label: 'Configure' },
                  { step: 2, label: 'Validate' },
                  { step: 3, label: 'Execute' }
                ].map((s, i) => (
                  <div key={s.step} className="flex items-center">
                    <div className="flex flex-col items-center relative">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full font-black text-[14px] transition-all z-10 ${assemblyStep >= s.step ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
                        {s.step}
                      </div>
                      <span className={`absolute top-12 whitespace-nowrap text-[11px] font-black uppercase tracking-widest ${assemblyStep >= s.step ? 'text-slate-900' : 'text-slate-400'}`}>
                        {s.label}
                      </span>
                    </div>
                    {i < 2 && (
                      <div className={`w-24 h-1 mx-2 rounded-full transition-all ${assemblyStep > s.step ? 'bg-indigo-600' : 'bg-slate-100'}`} />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-16 bg-white border border-slate-200 rounded-[32px] shadow-sm p-8 min-h-[400px] flex flex-col relative overflow-hidden">
                {assemblySuccess && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center animate-in fade-in duration-300">
                     <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 size={40} />
                     </div>
                     <h3 className="text-[24px] font-black text-slate-900">Production Logged!</h3>
                     <p className="text-[14px] font-medium text-slate-500 mt-2">Materials deducted and finished goods stocked.</p>
                  </div>
                )}
                
                {assemblyStep === 1 && (
                  <div className="flex-1 animate-in slide-in-from-right-4 duration-300">
                    <h3 className="text-[16px] font-black text-slate-900 mb-6">1. Configure Target Product</h3>
                    <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-100 space-y-6">
                      <div className="flex items-center gap-6">
                        <div className="relative group shrink-0">
                          {renderAvatar(targetProduct?.item || 'Product', 80, targetProduct?.image)}
                          <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Upload size={20} />
                            <input 
                              type="file" 
                              className="hidden" 
                              onChange={(e) => handleImageUpload(e, (url) => targetProduct && updateInventoryItem(targetProduct.sku, { image: url }))} 
                            />
                          </label>
                        </div>
                        <div className="flex-1">
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
                    <div className="mt-8 flex justify-end">
                      <button 
                        onClick={() => setAssemblyStep(2)}
                        disabled={assemblyQty < 1}
                        className="h-12 px-8 bg-slate-900 text-white rounded-xl text-[14px] font-black hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                        Next: Validate BOM <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                )}

                {assemblyStep === 2 && (
                  <div className="flex-1 animate-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center justify-between mb-6">
                       <h3 className="text-[16px] font-black text-slate-900">2. Validate BOM Requirements</h3>
                       <span className="text-[12px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-lg">Target: {assemblyQty} units</span>
                    </div>
                    
                    <div className="space-y-4 mb-8">
                      {selectedRecipe?.materials.map((req, i) => {
                        const item = inventory.find(inv => inv.sku === req.sku);
                        const needed = req.qty * assemblyQty;
                        const isShort = item && item.stock < needed;

                        return (
                          <div key={i} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${isShort ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                              <span className="text-[14px] font-bold text-slate-700">{item?.item || req.sku}</span>
                            </div>
                            <div className="text-right flex items-center gap-6">
                              <div className="text-[10px] font-bold text-slate-400 uppercase">Avail: <span className="text-slate-700">{item?.stock}</span> {item?.unit}</div>
                              <div className={`text-[15px] font-black w-20 ${isShort ? 'text-rose-600' : 'text-slate-900'}`}>-{needed}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {!assemblyValidation.canAssemble && (
                      <div className="flex items-start gap-3 text-rose-600 mb-6 p-4 bg-rose-50 rounded-xl border border-rose-100">
                        <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[13px] font-bold">Shortage Detected!</p>
                          <p className="text-[12px] font-medium mt-1">
                            Missing {assemblyValidation.missing.map(m => `${m.needed - m.avail} ${m.unit} of ${m.name}`).join(', ')}. Please restock before proceeding.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="mt-auto flex justify-between pt-4 border-t border-slate-100">
                      <button 
                        onClick={() => setAssemblyStep(1)}
                        className="h-12 px-6 bg-white border border-slate-200 text-slate-600 rounded-xl text-[14px] font-bold hover:bg-slate-50 transition-all"
                      >
                        Back
                      </button>
                      <button 
                        onClick={() => setAssemblyStep(3)}
                        disabled={!assemblyValidation.canAssemble}
                        className="h-12 px-8 bg-indigo-600 text-white rounded-xl text-[14px] font-black shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 disabled:opacity-50 disabled:shadow-none transition-all flex items-center gap-2"
                      >
                        Next: Review & Execute <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                )}

                {assemblyStep === 3 && (
                  <div className="flex-1 animate-in slide-in-from-right-4 duration-300">
                    <h3 className="text-[16px] font-black text-slate-900 mb-6">3. Review & Execute</h3>
                    <div className="bg-indigo-50 border border-indigo-100 p-8 rounded-[24px] space-y-6">
                       <div className="flex items-start gap-4">
                          <Info size={24} className="text-indigo-600 shrink-0" />
                          <div>
                             <h4 className="text-[15px] font-bold text-indigo-900">Ready for Production</h4>
                             <p className="text-[13px] font-medium text-indigo-700/80 mt-2 leading-relaxed">
                               Executing this batch will deduct the required raw materials from your inventory and automatically add <strong>{assemblyQty} units</strong> of <strong>{targetProduct?.item}</strong> to Finished Goods. This action will be logged in the history.
                             </p>
                          </div>
                       </div>
                    </div>
                    
                    <div className="mt-8 flex justify-between pt-4 border-t border-slate-100">
                      <button 
                        onClick={() => setAssemblyStep(2)}
                        className="h-12 px-6 bg-white border border-slate-200 text-slate-600 rounded-xl text-[14px] font-bold hover:bg-slate-50 transition-all"
                      >
                        Back
                      </button>
                      <button 
                        onClick={executeAssembly}
                        className="h-12 px-8 bg-slate-900 text-white rounded-xl text-[14px] font-black shadow-xl shadow-slate-900/20 hover:bg-indigo-600 transition-all flex items-center gap-2"
                      >
                        <ArrowUpRight size={18} /> Confirm & Execute
                      </button>
                    </div>
                  </div>
                )}
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
                    <th className="px-6 py-4">Transaction Type</th>
                    <th className="px-6 py-4">Item</th>
                    <th className="px-6 py-4 text-center">Quantity</th>
                    <th className="px-6 py-4">Performed By</th>
                    <th className="px-6 py-4">Order Ref (FK)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {movements.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center">
                            <History size={24} />
                          </div>
                          <div>
                            <p className="text-[14px] font-bold text-slate-900">No movement history</p>
                            <p className="text-[12px] text-slate-500 font-medium">Stock events and assembly logs will appear here.</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    movements.map((move) => (
                      <tr key={move.id} className="hover:bg-slate-50/50 transition-all group">
                        <td className="px-6 py-5 text-[14px] font-medium text-slate-700">{move.date}</td>
                        <td className="px-6 py-5">
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest ${getMovementClasses(move.type)}`}>
                            {move.type}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-[14px] font-bold text-slate-900">{move.itemName}</td>
                        <td className={`px-6 py-5 text-center font-black ${move.qty > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {move.qty > 0 ? `+${move.qty}` : move.qty} {move.unit}
                        </td>
                        <td className="px-6 py-5 text-[14px] font-medium text-slate-600">{staff.find(s => s.id === move.staff_id)?.name || move.staff_id}</td>
                        <td className="px-6 py-5">
                          {move.ref && move.ref.startsWith('ORD') ? (
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                              🔗 {move.ref}
                            </span>
                          ) : (
                            <span className="text-[11px] font-bold text-slate-400">{move.ref || '-'}</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
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
              <div className="flex items-center gap-4">
                {bomProductId && (
                  <div className="relative group">
                    {renderAvatar(finishedGoods.find(fg => fg.sku === bomProductId)?.item || 'P', 56, finishedGoods.find(fg => fg.sku === bomProductId)?.image)}
                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Upload size={14} />
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={(e) => handleImageUpload(e, (url) => updateInventoryItem(bomProductId, { image: url }))} 
                      />
                    </label>
                  </div>
                )}
                <button
                  onClick={() => setIsBOMModalOpen(false)}
                  className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-6">
                <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-max">
                  <button onClick={() => setBomMode('select')} className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-all ${bomMode === 'select' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}>Select Existing</button>
                  <button onClick={() => setBomMode('create')} className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-all ${bomMode === 'create' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}>Create New Recipe</button>
                </div>
                
                {bomMode === 'select' ? (
                  <div>
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Target Product</label>
                    <select
                      value={bomProductId}
                      onChange={(e) => handleBOMProductChange(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-medium appearance-none"
                    >
                      <option value="" disabled>Select Finished Good</option>
                      {finishedGoods.map(fg => (
                        <option key={fg.sku} value={fg.sku}>
                          {fg.item} ({fg.sku}){recipes.find(r => r.productId === fg.sku) ? ' ✓' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">New Product Name</label>
                       <input 
                         type="text" 
                         value={bomNewItemName} 
                         onChange={e => setBomNewItemName(e.target.value)} 
                         placeholder="e.g., Premium Silk Blouse"
                         className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-medium"
                       />
                     </div>
                     <div>
                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">New SKU</label>
                       <input 
                         type="text" 
                         value={bomNewItemSKU} 
                         onChange={e => setBomNewItemSKU(e.target.value)} 
                         placeholder="e.g., FG-BLOUSE-01"
                         className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-medium"
                       />
                     </div>
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-50">
                <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-widest">BOM Ingredients</h3>

                {bomMaterials.map((mat, i) => {
                  const selectedMat = materials.find(m => m.sku === mat.sku);
                  return (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white shadow-sm hover:border-indigo-200 transition-all">
                      <div className="flex flex-1 items-center gap-4 mr-4">
                        <button onClick={() => handleRemoveBOMMaterial(i)} className="text-rose-400 hover:text-rose-600 p-1 shrink-0">
                          <X size={16} />
                        </button>
                        {selectedMat ? renderAvatar(selectedMat.item, 36, selectedMat.image) : <div className="w-9 h-9 rounded-xl bg-slate-100" />}
                        <div className="flex-1 flex flex-col">
                          <select
                            value={mat.sku}
                            onChange={(e) => handleUpdateBOMMaterial(i, 'sku', e.target.value)}
                            className="w-full h-9 bg-transparent border-none outline-none text-[14px] font-bold text-slate-700"
                          >
                            <option value="" disabled>Select Material</option>
                            {materials.map(m => (
                              <option key={m.sku} value={m.sku}>{m.item}</option>
                            ))}
                          </select>
                          {selectedMat && (
                            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                              <MapPin size={10} className="text-indigo-400" />
                              {selectedMat.location || 'No Location Set'}
                            </div>
                          )}
                        </div>
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
                className="px-6 h-12 bg-white border border-slate-200 rounded-full text-[14px] font-bold text-slate-600 hover:bg-slate-50 transition-all"
              >
                Discard
              </button>
              <button
                onClick={handleSaveRecipe}
                disabled={
                  bomMaterials.length === 0 ||
                  (bomMode === 'select' && !bomProductId) ||
                  (bomMode === 'create' && !bomNewItemName.trim())
                }
                className="px-8 h-12 bg-slate-900 text-white rounded-full text-[14px] font-black shadow-lg shadow-slate-900/10 hover:bg-slate-800 disabled:opacity-50 transition-all active:scale-95"
              >
                {bomMode === 'create' ? 'Create Product & Save BOM' : 'Save BOM Recipe'}
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
              <div className="flex items-center gap-6 mb-6">
                <div className="relative group shrink-0">
                  {renderAvatar(newItem.item || 'New Item', 80, newItem.image)}
                  <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Upload size={20} />
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={(e) => handleImageUpload(e, (url) => setNewItem(prev => ({ ...prev, image: url })))} 
                    />
                  </label>
                </div>
                <div className="flex-1">
                  <p className="text-[12px] text-slate-500 font-medium">Add a photo of the item for accurate identification in the workshop.</p>
                </div>
              </div>

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
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">SKU / Item Code</label>
                  <input
                    type="text"
                    value={newItem.sku}
                    onChange={e => setNewItem(prev => ({ ...prev, sku: e.target.value }))}
                    placeholder="e.g. FAB-2204-WOOL-GRY"
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

                <div className="col-span-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Supplier</label>
                  <select
                    value={newItem.supplier_id || ''}
                    onChange={e => setNewItem(prev => ({ ...prev, supplier_id: e.target.value || undefined }))}
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-medium appearance-none"
                  >
                    <option value="">— Not Linked</option>
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2 flex gap-2">
                  <div className="flex-1">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Initial Stock</label>
                    <input
                      type="number"
                      value={newItem.stock || ''}
                      onChange={e => setNewItem(prev => ({ ...prev, stock: Number(e.target.value) }))}
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-medium"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Reorder At</label>
                    <input
                      type="number"
                      value={newItem.minStock || ''}
                      onChange={e => setNewItem(prev => ({ ...prev, minStock: Number(e.target.value) }))}
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-medium"
                    />
                  </div>
                  <div className="w-[90px]">
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
                      <option value="kg">kg</option>
                      <option value="yards">yards</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Cost (Per Unit)</label>
                  <input
                    type="number"
                    value={newItem.cost || ''}
                    onChange={e => setNewItem(prev => ({ ...prev, cost: Number(e.target.value) }))}
                    placeholder="₱0.00"
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-medium"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                    Selling Price
                    <span className="ml-1.5 text-[10px] text-slate-300 normal-case font-medium">(Finished Goods)</span>
                  </label>
                  <input
                    type="number"
                    value={newItem.price || ''}
                    onChange={e => setNewItem(prev => ({ ...prev, price: Number(e.target.value) }))}
                    placeholder="₱0.00"
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-medium"
                  />
                </div>

                <div className="col-span-2">
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
                className="px-6 h-12 bg-white border border-slate-200 rounded-full text-[14px] font-bold text-slate-600 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAddItem}
                disabled={!newItem.item || !newItem.sku}
                className="px-8 h-12 bg-slate-900 text-white rounded-full text-[14px] font-black shadow-lg shadow-slate-900/10 hover:bg-slate-800 disabled:opacity-50 transition-all active:scale-95"
              >
                Create Item
              </button>
            </div>
          </div>
        </div>
      )}

      {isStockInModalOpen && stockInItem && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[500px] rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div>
                <h2 className="text-[20px] font-black text-slate-900 tracking-tight">Stock In: {stockInItem.item}</h2>
                <p className="text-[13px] text-slate-500 font-medium">Record a new delivery or inventory addition.</p>
              </div>
              <button
                onClick={() => setIsStockInModalOpen(false)}
                className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-5">
              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Quantity to Add</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={stockInForm.qty || ''}
                    onChange={e => setStockInForm(prev => ({ ...prev, qty: Number(e.target.value) }))}
                    className="flex-1 h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[16px] font-bold"
                  />
                  <span className="text-[14px] font-bold text-slate-400 uppercase">{stockInItem.unit}</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Supplier</label>
                <select
                  value={stockInForm.supplier}
                  onChange={e => setStockInForm(prev => ({ ...prev, supplier: e.target.value }))}
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-medium appearance-none"
                >
                  <option value="" disabled>Select Supplier</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                  <option value="unlinked">Unlinked Supplier / Unknown</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Reference Code / Receipt #</label>
                <input
                  type="text"
                  value={stockInForm.ref}
                  onChange={e => setStockInForm(prev => ({ ...prev, ref: e.target.value }))}
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-medium"
                />
              </div>
            </div>

            <div className="p-8 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => setIsStockInModalOpen(false)}
                className="px-6 h-12 bg-white border border-slate-200 rounded-full text-[14px] font-bold text-slate-600 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleStockInSubmit}
                disabled={!stockInForm.qty || stockInForm.qty <= 0}
                className="px-8 h-12 bg-indigo-600 text-white rounded-full text-[14px] font-black shadow-lg shadow-indigo-600/10 hover:bg-indigo-700 disabled:opacity-50 transition-all active:scale-95"
              >
                Confirm Stock In
              </button>
            </div>
          </div>
        </div>
      )}

      {isBatchReleaseModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[500px] rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
             <div className="p-10 text-center space-y-4">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                   <PackageCheck size={40} />
                </div>
                <h3 className="text-[24px] font-black text-slate-900">Batch Release Ready</h3>
                <p className="text-[14px] font-medium text-slate-500 max-w-sm mx-auto leading-relaxed">
                   This action will release selected finished goods to fulfilling active orders. This workflow module is currently stubbed for the prototype.
                </p>
                <div className="pt-6">
                   <button 
                     onClick={() => setIsBatchReleaseModalOpen(false)}
                     className="h-12 px-8 bg-slate-900 text-white rounded-full text-[14px] font-black shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95"
                   >
                     Acknowledge
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* ── ADJUST STOCK MODAL ── */}
      {isAdjustModalOpen && adjustItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[400px] rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                  <ClipboardList size={20} />
                </div>
                <div>
                  <h3 className="text-[16px] font-black text-slate-900 leading-tight">Adjust Stock</h3>
                  <p className="text-[12px] font-medium text-slate-500">Manual stock deduction</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAdjustModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-all"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
                <div className="text-[14px] font-bold text-amber-900">{adjustItem.item}</div>
                <div className="text-[12px] text-amber-700 font-medium font-mono mt-0.5">{adjustItem.sku}</div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-amber-200/50">
                  <span className="text-[12px] font-medium text-amber-700">Current Stock</span>
                  <span className="text-[14px] font-black text-amber-900">{adjustItem.stock} {adjustItem.unit}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Deduction Type</label>
                  <select 
                    value={adjustForm.type}
                    onChange={(e) => setAdjustForm({ ...adjustForm, type: e.target.value as 'Usage' | 'Stock Adjustment' })}
                    className="w-full h-11 px-3 border border-slate-200 rounded-xl text-[14px] text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
                  >
                    <option value="Usage">Production Usage (Manual)</option>
                    <option value="Stock Adjustment">Damage / Shrinkage / Loss</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Quantity to Deduct ({adjustItem.unit})</label>
                  <input 
                    type="number" 
                    min="1"
                    max={adjustItem.stock}
                    value={adjustForm.qty || ''}
                    onChange={(e) => setAdjustForm({ ...adjustForm, qty: Number(e.target.value) })}
                    className="w-full h-11 px-3 border border-slate-200 rounded-xl text-[14px] text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-slate-400"
                    placeholder="Enter amount to deduct"
                  />
                  {adjustForm.qty > adjustItem.stock && (
                    <p className="text-[12px] text-rose-500 mt-1 font-medium flex items-center gap-1">
                      <AlertTriangle size={12} /> Cannot deduct more than current stock.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Reason / Reference</label>
                  <input 
                    type="text" 
                    value={adjustForm.reason}
                    onChange={(e) => setAdjustForm({ ...adjustForm, reason: e.target.value })}
                    className="w-full h-11 px-3 border border-slate-200 rounded-xl text-[14px] text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-slate-400"
                    placeholder="e.g. Scraps from JO-102"
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50">
              <button 
                onClick={() => setIsAdjustModalOpen(false)}
                className="px-5 h-10 rounded-full text-[13px] font-bold text-slate-600 hover:bg-slate-100 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleAdjustSubmit}
                disabled={!adjustForm.qty || adjustForm.qty <= 0 || adjustForm.qty > adjustItem.stock}
                className="px-6 h-10 bg-amber-600 text-white rounded-full font-black text-[13px] hover:bg-amber-700 transition-all shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                <ClipboardList size={16} /> Confirm Deduction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── BOM MODAL ── */}

    </div>
  );
}
