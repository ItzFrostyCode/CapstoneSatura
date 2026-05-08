'use client';

import React, { useState, useMemo } from 'react';
import { 
  Zap, 
  CheckCircle2, 
  Package, 
  Plus, 
  X, 
  History, 
  Layers, 
  ShoppingBag, 
  Users, 
  ArrowRight,
  Search,
  TrendingUp,
  Tag,
  Minus,
  ChevronDown,
  AlertCircle,
  Edit3
} from 'lucide-react';
import { InventoryItem, Order, JobOrderItem, Customer, InventoryMovement } from '@/types/erp';

export interface BOMRecipe {
  productId: string;
  materials: Array<{ sku: string; qty: number }>;
}

interface ProductionAssemblyProps {
  assemblyProductId: string;
  setAssemblyProductId: React.Dispatch<React.SetStateAction<string>>;
  assemblyQty: number;
  setAssemblyQty: React.Dispatch<React.SetStateAction<number>>;
  assemblySizes: Record<string, number>;
  setAssemblySizes: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  assemblySuccess: boolean;
  inventory: InventoryItem[];
  recipes: BOMRecipe[];
  activeJobOrders: Order[];
  jobOrderItems: JobOrderItem[];
  customers: Customer[];
  selectedJoId: string | null;
  setSelectedJoId: React.Dispatch<React.SetStateAction<string | null>>;
  quickSaleQty: number;
  setQuickSaleQty: React.Dispatch<React.SetStateAction<number>>;
  quickSaleCustomer: string;
  setQuickSaleCustomer: React.Dispatch<React.SetStateAction<string>>;
  onExecute: () => void;
  onFulfillJO: (orderId: string) => void;
  onQuickSale: (itemSku: string) => void;
  updateInventoryItem: (sku: string, data: Partial<InventoryItem>) => void;
  onSaveRecipe: (recipe: BOMRecipe) => void;
  assemblyValidation: {
    canAssemble: boolean;
    missing: Array<{ name: string; needed: number; avail: number; unit: string }>;
  };
  movements: InventoryMovement[];
}

type ProductionMode = 'BULK' | 'JOB_ORDER' | 'READY_MADE';

interface QuickSaleTransaction {
  id: string;
  item: string;
  sku: string;
  qty: number;
  total: number;
  customer: string;
  date: string;
}

export function ProductionAssembly({
  assemblyProductId,
  setAssemblyProductId,
  assemblyQty,
  setAssemblyQty,
  assemblySizes,
  setAssemblySizes,
  assemblySuccess,
  inventory,
  recipes,
  activeJobOrders,
  jobOrderItems,
  customers,
  selectedJoId,
  setSelectedJoId,
  quickSaleQty,
  setQuickSaleQty,
  quickSaleCustomer,
  setQuickSaleCustomer,
  onExecute,
  onFulfillJO,
  onQuickSale,
  onSaveRecipe,
  updateInventoryItem,
  assemblyValidation,
  movements
}: ProductionAssemblyProps) {
  const [mode, setMode] = useState<ProductionMode>('BULK');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isNewStyleModalOpen, setIsNewStyleModalOpen] = useState(false);
  const [newStyle, setNewStyle] = useState({ name: '', sku: '' });
  const [newStyleBOM, setNewStyleBOM] = useState<Array<{ sku: string; qty: number }>>([]);
  const [tempMatSku, setTempMatSku] = useState('');
  const [tempMatQty, setTempMatQty] = useState('');
  const [quickSaleItemSku, setQuickSaleItemSku] = useState('');
  const [isRegisterCustomerModalOpen, setIsRegisterCustomerModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', gender: 'Male', email: '' });
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<QuickSaleTransaction | null>(null);

  const selectedRecipe = useMemo(() => 
    recipes.find(r => r.productId === assemblyProductId), 
    [recipes, assemblyProductId]
  );

  const materialsList = inventory.filter(i => i.cat !== 'Finished Goods' && i.item_type !== 'FINISHED_GOOD');
  const finishedGoods = inventory.filter(i => i.cat === 'Finished Goods' || i.item_type === 'FINISHED_GOOD');

  const handleCreateStyle = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStyle.name && newStyle.sku) {
      updateInventoryItem(newStyle.sku, {
        sku: newStyle.sku,
        item: newStyle.name,
        cat: 'Finished Goods',
        item_type: 'FINISHED_GOOD',
        stock: 0,
        unit: 'Pcs',
        reorder_level: 5,
        location: 'Showroom',
        is_active: true
      });
      if (newStyleBOM.length > 0) {
        onSaveRecipe({ productId: newStyle.sku, materials: newStyleBOM });
      }
      setAssemblyProductId(newStyle.sku);
      setIsNewStyleModalOpen(false);
      setNewStyle({ name: '', sku: '' });
      setNewStyleBOM([]);
    }
  };

  return (
    <div className="p-4 max-w-[1400px] mx-auto space-y-4 animate-in fade-in duration-500">
      
      {/* MODE SWITCHER */}
      <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm p-1.5 rounded-2xl border border-slate-200/60 shadow-sm w-fit">
        {[
          { id: 'BULK', label: 'Bulk Tailoring', icon: Package },
          { id: 'READY_MADE', label: 'Walk-in Checkout', icon: ShoppingBag }
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id as ProductionMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-black transition-all ${
              mode === m.id
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <m.icon size={14} />
            {m.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* MAIN OPERATION CARD */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              {mode === 'BULK' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-[18px] font-black text-slate-900 tracking-tight">Bulk Tailoring Log</h2>
                      <p className="text-[12px] text-slate-400 font-bold uppercase tracking-widest mt-1">Record finished garments by size. Automatic material deduction.</p>
                    </div>
                    <button 
                      onClick={() => setIsNewStyleModalOpen(true)}
                      className="px-6 h-12 bg-slate-900 text-white rounded-2xl flex items-center gap-2 font-black text-[13px] hover:bg-indigo-600 shadow-xl shadow-slate-900/10 active:scale-95 transition-all"
                    >
                      <Plus size={18} /> Register New Garment
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
                    <div className="md:col-span-5 relative">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Style Name</label>
                      <div className="relative">
                        <select 
                          value={assemblyProductId}
                          onChange={(e) => setAssemblyProductId(e.target.value)}
                          className="w-full h-14 pl-12 pr-6 rounded-2xl border-2 border-slate-100 bg-white focus:border-slate-900 outline-none text-[15px] font-black text-slate-700 appearance-none cursor-pointer transition-all shadow-sm"
                        >
                          <option value="" disabled>Select Style...</option>
                          {finishedGoods.length > 0 ? (
                            finishedGoods.map(p => (
                              <option key={p.sku} value={p.sku}>{p.item || p.item_name} — {p.sku}</option>
                            ))
                          ) : (
                            <option disabled>No styles registered</option>
                          )}
                        </select>
                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                      </div>
                    </div>
                    
                    <div className="md:col-span-7">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Quantity per Size</label>
                      <div className="grid grid-cols-5 gap-3">
                        {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                          <div key={size} className="bg-white p-3 rounded-2xl border-2 border-slate-100 hover:border-slate-300 transition-all text-center group">
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-tighter group-hover:text-slate-900 transition-colors">{size}</p>
                            <input 
                              type="number"
                              min="0"
                              value={assemblySizes[size] || 0}
                              onChange={(e) => setAssemblySizes({...assemblySizes, [size]: Math.max(0, parseInt(e.target.value) || 0)})}
                              onFocus={e => e.target.select()}
                              className="w-full bg-transparent text-slate-900 text-[18px] font-black text-center outline-none tabular-nums"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}


              {mode === 'READY_MADE' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-[16px] font-black text-slate-900">Walk-in Checkout</h2>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">Instant stock checkout for walk-in customers.</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-xl border border-emerald-100">
                      <TrendingUp size={14} className="text-emerald-600" />
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Active Terminal</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-4">
                      {/* Item Selection */}
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Select Item to Buy</label>
                        <div className="relative">
                          <select
                            value={quickSaleItemSku}
                            onChange={e => setQuickSaleItemSku(e.target.value)}
                            className="w-full h-12 px-4 rounded-xl border-2 border-slate-100 bg-white outline-none text-[13px] font-black text-slate-700 appearance-none cursor-pointer focus:border-indigo-600 transition-all shadow-sm"
                          >
                            <option value="">Select On-Hand Item...</option>
                            {finishedGoods.filter(i => (i.stock || 0) > 0).map(p => (
                              <option key={p.sku} value={p.sku}>
                                {p.item_name || p.item} — {p.stock} pcs left
                              </option>
                            ))}
                          </select>
                          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                        </div>
                      </div>

                      {/* Customer Selection */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Customer Name</label>
                          <button 
                            onClick={() => setIsRegisterCustomerModalOpen(true)}
                            className="text-[10px] font-black text-indigo-600 hover:underline uppercase tracking-widest"
                          >
                            + Register New
                          </button>
                        </div>
                        <div className="relative">
                          <select
                            value={quickSaleCustomer}
                            onChange={e => setQuickSaleCustomer(e.target.value)}
                            className="w-full h-12 px-4 rounded-xl border-2 border-slate-100 bg-white outline-none text-[13px] font-black text-slate-700 appearance-none cursor-pointer focus:border-indigo-600 transition-all shadow-sm"
                          >
                            <option value="">Search/Select Customer...</option>
                            <option value="Walk-in Customer">Walk-in Customer</option>
                            {customers.map(c => (
                              <option key={c.id} value={c.name}>{c.name}</option>
                            ))}
                          </select>
                          <Users size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Quantity Selection */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-center items-center">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Buy Count</label>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => setQuickSaleQty(Math.max(1, quickSaleQty - 1))}
                          className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all shadow-sm"
                        >
                          <Minus size={18} />
                        </button>
                        <span className="text-[32px] font-black text-slate-900 tabular-nums">{quickSaleQty}</span>
                        <button 
                          onClick={() => {
                            const item = finishedGoods.find(i => i.sku === quickSaleItemSku);
                            if (item && quickSaleQty < (item.stock || 0)) {
                              setQuickSaleQty(quickSaleQty + 1);
                            }
                          }}
                          className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all shadow-sm"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase mt-2">Pcs to Checkout</span>
                    </div>
                  </div>

                  {/* Financial & Audit Preview */}
                  {quickSaleItemSku && (
                    <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 grid grid-cols-2 gap-4 animate-in zoom-in-95 duration-200">
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Inventory Deduction</p>
                        <div className="flex items-center gap-2">
                          <Package size={14} className="text-slate-400" />
                          <p className="text-[12px] font-black text-slate-700">
                            -{quickSaleQty} pc <span className="text-slate-400 font-bold">{quickSaleItemSku}</span>
                          </p>
                        </div>
                      </div>
                      <div className="space-y-1 text-right">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Expected Income</p>
                        <div className="flex items-center justify-end gap-2">
                          <ShoppingBag size={14} className="text-emerald-500" />
                          <p className="text-[16px] font-black text-emerald-600">
                            ₱{((finishedGoods.find(i => i.sku === quickSaleItemSku)?.price || 0) * quickSaleQty).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Middle Content */}
            {mode === 'BULK' && (
              <div className="p-5 flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers size={14} className="text-slate-400" />
                    <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-widest">Material Deduction</h3>
                  </div>
                  {selectedRecipe && !isEditMode && (
                    <button onClick={() => setIsEditMode(true)} className="flex items-center gap-2 text-[10px] font-black text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-all border border-indigo-100">
                      <Edit3 size={12} /> Edit Recipe
                    </button>
                  )}
                </div>

                {!assemblyProductId ? (
                  <div className="flex flex-col items-center justify-center py-10 text-slate-300 opacity-50 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100">
                    <Search size={32} strokeWidth={1} />
                    <p className="mt-2 font-black text-[11px] uppercase tracking-widest">Select style to see recipe</p>
                  </div>
                ) : isEditMode ? (
                  <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                    <div className="flex items-center justify-between bg-amber-50 p-3 rounded-xl border border-amber-100">
                      <span className="text-[11px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-2">
                        <Zap size={12} /> Recipe Editor Mode
                      </span>
                      <button 
                        onClick={() => setIsEditMode(false)}
                        className="text-[10px] font-black text-slate-900 bg-white px-3 py-1 rounded-lg shadow-sm border border-slate-200"
                      >
                        Finish Editing
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2">
                      {selectedRecipe?.materials.map((mat, idx) => {
                        const item = inventory.find(inv => inv.sku === mat.sku);
                        return (
                          <div key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
                            <div className="flex items-center gap-3">
                              <Package size={14} className="text-slate-400" />
                              <div>
                                <p className="text-[12px] font-black text-slate-900">{item?.item || mat.sku}</p>
                                <p className="text-[10px] font-bold text-slate-400">{mat.qty} {item?.unit || 'units'} per piece</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => {
                                const newMats = selectedRecipe.materials.filter((_, i) => i !== idx);
                                onSaveRecipe({ productId: assemblyProductId, materials: newMats });
                              }}
                              className="text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-all"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : !selectedRecipe ? (
                  <div className="flex flex-col items-center justify-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <Package size={24} className="text-slate-300 mb-2" />
                    <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest">No Recipe Found</p>
                    <button 
                      onClick={() => setIsEditMode(true)}
                      className="mt-3 px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black hover:bg-slate-800 transition-all shadow-lg"
                    >
                      + Create Recipe
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2.5">
                    {selectedRecipe?.materials.map((mat, i) => {
                      const item = inventory.find(inv => inv.sku === mat.sku);
                      const isFabric = item?.category?.toLowerCase() === 'fabric' || item?.cat?.toLowerCase() === 'fabric' || item?.unit?.toLowerCase() === 'meters' || item?.unit?.toLowerCase() === 'yards';
                      const needed = mat.qty * Object.values(assemblySizes).reduce((a, b) => a + b, 0);
                      const isShort = isFabric && item && (item.stock || 0) < needed;
                      
                      return (
                        <div key={i} className={`p-4 rounded-2xl border transition-all ${!isFabric ? 'bg-slate-50/50 border-slate-100' : isShort ? 'bg-rose-50/30 border-rose-100 ring-1 ring-rose-100' : 'bg-white border-slate-200 shadow-sm'}`}>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isFabric ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                                <Package size={14} />
                              </div>
                              <div>
                                <p className="text-[13px] font-black text-slate-900">{item?.item || mat.sku} <span className="ml-2 text-[10px] text-slate-400 font-bold uppercase">{mat.sku}</span></p>
                                <p className="text-[11px] font-bold text-slate-400 mt-0.5">
                                  {isFabric ? (
                                    <>Total: <span className="text-slate-900 font-black">{needed.toFixed(1)} {item?.unit || 'units'}</span> <span className="ml-1 opacity-60">({mat.qty} per pc)</span></>
                                  ) : (
                                    <>Estimated Use: <span className="text-slate-900 font-black">{needed.toFixed(1)} {item?.unit || 'units'}</span></>
                                  )}
                                </p>
                              </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${!isFabric ? 'bg-slate-100 text-slate-500' : isShort ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                              {!isFabric ? 'Loosely Tracked' : isShort ? 'Low Stock' : 'OK'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Bottom Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Output</p>
                    <p className="text-[28px] font-black text-slate-900 leading-none">
                      {Object.values(assemblySizes).reduce((a, b) => a + b, 0)} <span className="text-[12px] text-slate-400 font-bold uppercase ml-1">Pcs</span>
                    </p>
                  </div>
                  <div className="h-10 w-px bg-slate-200" />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Status</p>
                    <div className="flex items-center gap-2">
                      {(() => {
                        const totalQty = Object.values(assemblySizes).reduce((a, b) => a + b, 0);
                        const isReady = mode === 'BULK'
                          ? (assemblyValidation.canAssemble && assemblyProductId && totalQty > 0)
                          : mode === 'JOB_ORDER'
                          ? !!selectedJoId
                          : !!quickSaleItemSku;
                        return (
                          <>
                            <div className={`w-2 h-2 rounded-full ${isReady ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                            <span className={`text-[12px] font-black uppercase tracking-widest ${isReady ? 'text-emerald-600' : 'text-slate-400'}`}>
                              {isReady ? 'Ready' : 'Wait'}
                            </span>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    if (mode === 'BULK') onExecute();
                    else if (mode === 'JOB_ORDER' && selectedJoId) onFulfillJO(selectedJoId);
                    else if (mode === 'READY_MADE' && quickSaleItemSku) {
                      const item = finishedGoods.find(i => i.sku === quickSaleItemSku);
                      const total = (item?.price || 0) * quickSaleQty;
                      setLastTransaction({
                        id: `TX-${Date.now().toString().slice(-6)}`,
                        item: item?.item_name || item?.item || 'Unknown Item',
                        sku: quickSaleItemSku,
                        qty: quickSaleQty,
                        total: total,
                        customer: quickSaleCustomer || 'Walk-in',
                        date: new Date().toLocaleString()
                      });
                      onQuickSale(quickSaleItemSku);
                      setShowReceipt(true);
                    }
                  }}
                  disabled={
                    (mode === 'BULK' && (!assemblyValidation.canAssemble || !assemblyProductId || Object.values(assemblySizes).reduce((a, b) => a + b, 0) === 0)) ||
                    (mode === 'READY_MADE' && !quickSaleItemSku)
                  }
                  className="px-10 h-14 bg-slate-900 text-white rounded-2xl text-[14px] font-black flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all disabled:opacity-20 shadow-2xl shadow-slate-900/20 active:scale-95"
                >
                  {mode === 'BULK' ? 'Log Tailoring' : 'Complete Sale'}
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-4 space-y-4">
          {/* Summary Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden shadow-sm">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-indigo-600" />
                <h3 className="text-[12px] font-black uppercase tracking-widest text-slate-900">Tailoring Summary</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Today</p>
                  <p className="text-[20px] font-black mt-0.5 text-slate-900">
                    {movements
                      .filter(m => m.movement_type === 'PRODUCTION' && m.qty > 0 && new Date(m.created_at || '').toDateString() === new Date().toDateString())
                      .reduce((sum, m) => sum + Math.abs(m.qty), 0)
                    }
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total</p>
                  <p className="text-[20px] font-black mt-0.5 text-slate-900">
                    {movements.filter(m => m.movement_type === 'PRODUCTION' && m.qty > 0).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[350px]">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center gap-2">
                <History size={14} className="text-slate-400" />
                <h3 className="text-[11px] font-black uppercase tracking-widest">Output History</h3>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
              <div className="relative space-y-4">
                <div className="absolute left-[13px] top-1 bottom-1 w-px bg-slate-100" />
                
                {movements.filter(m => m.movement_type === 'PRODUCTION').length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center py-10 text-slate-300">
                    <History size={24} strokeWidth={1} />
                    <p className="text-[10px] font-black uppercase tracking-widest mt-2">Empty</p>
                  </div>
                ) : (
                  movements.filter(m => m.movement_type === 'PRODUCTION').slice(0, 10).map((move, i) => {
                    const itemSku = move.inventory_item_id;
                    const item = inventory.find(inv => inv.sku === itemSku);
                    const reference = move.reference_id;
                    return (
                      <div key={i} className="relative pl-8">
                        <div className="absolute left-0 top-0 w-7 h-7 rounded-lg border border-indigo-100 bg-indigo-50 text-indigo-600 shadow-sm flex items-center justify-center z-10">
                          <Zap size={10} />
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[12px] font-black text-slate-900 truncate max-w-[100px]">{item?.item || itemSku}</span>
                            <span className="text-[12px] font-black text-emerald-600">+{move.qty}</span>
                          </div>
                          <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase">
                            <span className="truncate max-w-[80px]">{reference}</span>
                            <span>{new Date(move.created_at || '').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
      </div>

      {/* Register New Style Modal */}
      {isNewStyleModalOpen && (
        <div className="fixed inset-0 z-250 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-[500px] rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-[20px] font-black text-slate-900 tracking-tight">Register New Garment Style</h3>
              <p className="text-[12px] text-slate-400 font-bold uppercase tracking-widest mt-1">Add a new garment type to your production catalog.</p>
            </div>
            <form onSubmit={handleCreateStyle} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Garment Name</label>
                  <input 
                    required
                    value={newStyle.name}
                    onChange={e => setNewStyle({...newStyle, name: e.target.value})}
                    placeholder="e.g., Linen Trousers"
                    className="w-full h-12 px-4 rounded-xl border-2 border-slate-100 focus:border-slate-900 outline-none font-bold text-[14px] transition-all bg-slate-50/30"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">SKU / ID</label>
                  <input 
                    required
                    value={newStyle.sku}
                    onChange={e => setNewStyle({...newStyle, sku: e.target.value})}
                    placeholder="e.g., TR-001"
                    className="w-full h-12 px-4 rounded-xl border-2 border-slate-100 focus:border-slate-900 outline-none font-bold text-[14px] uppercase transition-all bg-slate-50/30"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-black text-indigo-600 uppercase tracking-widest">Build Recipe (Linked Materials)</p>
                  <span className="text-[10px] font-bold text-slate-400">{newStyleBOM.length} Items</span>
                </div>
                
                {/* Linked List */}
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                  {newStyleBOM.length === 0 ? (
                    <div className="py-8 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100">
                      <Package size={24} className="mx-auto text-slate-300 mb-2" />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No materials linked yet</p>
                    </div>
                  ) : (
                    newStyleBOM.map((m, i) => {
                      const item = inventory.find(inv => inv.sku === m.sku);
                      return (
                        <div key={i} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl shadow-sm animate-in slide-in-from-top-1 duration-200">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                               <Package size={14} />
                            </div>
                            <div>
                              <p className="text-[12px] font-black text-slate-900">{item?.item || m.sku}</p>
                              <p className="text-[10px] font-bold text-slate-400">{m.qty} per piece</p>
                            </div>
                          </div>
                          <button 
                            type="button"
                            onClick={() => setNewStyleBOM(newStyleBOM.filter((_, idx) => idx !== i))}
                            className="text-rose-400 hover:text-rose-600 p-2 hover:bg-rose-50 rounded-lg transition-all"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Add Row */}
                <div className="grid grid-cols-12 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="col-span-7">
                    <select 
                      value={tempMatSku}
                      onChange={e => setTempMatSku(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-[11px] font-black text-slate-700 outline-none focus:border-slate-900 transition-all cursor-pointer shadow-sm"
                    >
                      <option value="">Select Material...</option>
                      {materialsList.map(m => (
                        <option key={m.sku} value={m.sku}>{m.item} ({m.stock} {m.unit})</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-3">
                    <input 
                      type="number"
                      step="0.1"
                      value={tempMatQty}
                      onChange={e => setTempMatQty(e.target.value)}
                      onFocus={e => e.target.select()}
                      placeholder="Qty"
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 text-[11px] font-bold outline-none focus:border-slate-900"
                    />
                  </div>
                  <button 
                    type="button"
                    disabled={!tempMatSku || !tempMatQty}
                    onClick={() => {
                      setNewStyleBOM([...newStyleBOM, { sku: tempMatSku, qty: parseFloat(tempMatQty) }]);
                      setTempMatSku('');
                      setTempMatQty('');
                    }}
                    className="col-span-2 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center disabled:opacity-20 hover:bg-indigo-600 transition-all shadow-lg"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsNewStyleModalOpen(false)}
                  className="flex-1 h-12 rounded-full text-[13px] font-black text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!newStyle.name || !newStyle.sku}
                  className="flex-1 h-12 bg-slate-900 text-white rounded-full text-[13px] font-black shadow-xl shadow-slate-900/10 active:scale-95 transition-all disabled:opacity-20"
                >
                  Save Style
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Register Customer Modal */}
      {isRegisterCustomerModalOpen && (
        <div className="fixed inset-0 z-250 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-[450px] rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-[20px] font-black text-slate-900 tracking-tight">Register Customer</h2>
                <p className="text-[12px] text-slate-400 font-bold uppercase tracking-widest mt-1">Instant Profile (No Measurement)</p>
              </div>
              <button onClick={() => setIsRegisterCustomerModalOpen(false)} className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 hover:text-slate-900 transition-all"><X size={20} /></button>
            </div>
            <div className="p-8 space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Full Name</label>
                <input value={newCustomer.name} onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} placeholder="e.g. Juan Dela Cruz" className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white focus:border-indigo-600 outline-none text-[13px] font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Phone Number</label>
                  <input value={newCustomer.phone} onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})} placeholder="09XX XXX XXXX" className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white focus:border-indigo-600 outline-none text-[13px] font-bold" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Gender</label>
                  <select value={newCustomer.gender} onChange={e => setNewCustomer({...newCustomer, gender: e.target.value})} className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-white text-[12px] font-bold outline-none cursor-pointer">
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Email Address</label>
                <input value={newCustomer.email} onChange={e => setNewCustomer({...newCustomer, email: e.target.value})} placeholder="customer@example.com" className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white focus:border-indigo-600 outline-none text-[13px] font-bold" />
              </div>
              
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex items-start gap-3">
                 <AlertCircle size={16} className="text-amber-600 mt-0.5" />
                 <p className="text-[11px] font-bold text-amber-700 italic">
                   Note: This will register a profile for sales record keeping. No body measurements will be required for this walk-in checkout.
                 </p>
              </div>

              <button 
                onClick={() => {
                  setQuickSaleCustomer(newCustomer.name);
                  setIsRegisterCustomerModalOpen(false);
                }}
                className="w-full h-12 bg-indigo-600 text-white rounded-2xl font-black text-[13px] shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95 mt-2"
              >
                Register Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Digital Receipt Modal */}
      {showReceipt && lastTransaction && (
        <div className="fixed inset-0 z-250 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-[400px] rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 text-center bg-emerald-50 border-b border-emerald-100">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-[20px] font-black text-slate-900 tracking-tight">Sale Completed!</h2>
              <p className="text-[12px] text-emerald-600 font-bold uppercase tracking-widest mt-1">Transaction Success</p>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Receipt ID</span>
                  <span className="text-[12px] font-black text-slate-900">{lastTransaction.id}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</span>
                  <span className="text-[12px] font-black text-slate-900">{lastTransaction.customer}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Item Purchased</span>
                  <span className="text-[12px] font-black text-slate-900">{lastTransaction.item} x{lastTransaction.qty}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Income</span>
                  <span className="text-[18px] font-black text-emerald-600">₱{lastTransaction.total.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 pt-4">
                <button onClick={() => setShowReceipt(false)} className="w-full h-12 bg-slate-900 text-white rounded-2xl font-black text-[13px] shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95">Done</button>
                <button className="w-full h-12 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold text-[13px] hover:bg-slate-50 transition-all">Print Receipt</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {assemblySuccess && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-300 bg-emerald-600 text-white px-8 py-4 rounded-full flex items-center gap-3 shadow-2xl animate-in slide-in-from-top-10 duration-500">
          <CheckCircle2 size={24} />
          <span className="text-[15px] font-black uppercase tracking-widest">Entry Recorded Successfully!</span>
        </div>
      )}
    </div>
);
}
