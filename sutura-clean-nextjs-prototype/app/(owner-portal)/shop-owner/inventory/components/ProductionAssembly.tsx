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
  Edit3,
  Scissors,
  ChevronRight,
  PlusCircle,
  Info,
  User,
  Beaker,
  AlertTriangle,
  FileText,
  Printer,
  Mail,
  Download
} from 'lucide-react';
import { InventoryItem, Order, JobOrderItem, Customer, InventoryMovement, Staff } from '@/types/erp';

export interface BOMRecipe {
  productId: string;
  materials: Array<{ sku: string; qty: number }>;
}

// Utility functions moved outside the component to ensure render purity
const generateRandomSuffix = () => Math.random().toString(36).substring(2, 9).toUpperCase();
const getNowLocaleString = () => new Date().toLocaleString();

export interface SaleData {
  receiptNo: string;
  customer: string;
  item: string;
  qty: number;
  price: number;
  total: number;
  date: string;
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
  staff: Staff[];
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

type ProductionMode = 'INTERNAL_STOCK' | 'RTW';

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
  staff,
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
  const [mode, setMode] = useState<ProductionMode>('INTERNAL_STOCK');
  const [quickSaleItemSku, setQuickSaleItemSku] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastSaleData, setLastSaleData] = useState<SaleData | null>(null);
  
  // Internal Stock Production State
  const [productName, setProductName] = useState('');
  const [productSku, setProductSku] = useState('');
  const [bomList, setBomList] = useState<Array<{ sku: string; qty: number }>>([]);
  const [tempMatSku, setTempMatSku] = useState('');
  const [tempMatQty, setTempMatQty] = useState('');

  const materialsList = inventory.filter(i => i.cat !== 'Finished Goods' && i.item_type !== 'FINISHED_GOOD');
  const finishedGoods = inventory.filter(i => i.cat === 'Finished Goods' || i.item_type === 'FINISHED_GOOD');

  const totalInternalUnits = Object.values(assemblySizes).reduce((a, b) => a + b, 0);

  const internalValidation = useMemo(() => {
    if (bomList.length === 0 || totalInternalUnits === 0) return { canStart: false, missing: [] };
    
    // 1. Aggregate requirements by SKU
    const totalNeeded: Record<string, number> = {};
    bomList.forEach(mat => {
      totalNeeded[mat.sku] = (totalNeeded[mat.sku] || 0) + (mat.qty * totalInternalUnits);
    });

    // 2. Check against inventory
    const missingSet = new Set<string>();
    Object.entries(totalNeeded).forEach(([sku, needed]) => {
      const inv = inventory.find(i => i.sku === sku);
      if (!inv || (inv.stock || 0) < needed) {
        missingSet.add(inv?.item || inv?.item_name || sku);
      }
    });

    const missingArray = Array.from(missingSet);
    return { canStart: missingArray.length === 0, missing: missingArray };
  }, [bomList, totalInternalUnits, inventory]);

  const handleProcessSale = () => {
    const item = finishedGoods.find(i => i.sku === quickSaleItemSku);
    if (!item) return;

    const price = item.unit_price || item.price || 0;
    
    // Call external utility functions which are not tracked by the component's render purity
    const saleData = {
      receiptNo: `RCT-${generateRandomSuffix()}`,
      customer: quickSaleCustomer || 'Walk-in Customer',
      item: item.item_name || item.item || 'Unknown Item',
      qty: quickSaleQty,
      price: price,
      total: price * quickSaleQty,
      date: getNowLocaleString()
    };

    setLastSaleData(saleData);
    onQuickSale(quickSaleItemSku);
    setShowReceipt(true);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* PRODUCTION MODE SELECTOR */}
      <div className="px-10 py-6 border-b border-slate-100 bg-slate-50/20">
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/40 rounded-2xl w-fit border border-slate-200/50">
          {[
            { id: 'INTERNAL_STOCK', label: 'Internal Production', icon: Beaker, sub: 'Create stock for sale' },
            { id: 'RTW', label: 'Direct Sale (RTW)', icon: ShoppingBag, sub: 'Instant inventory checkout' }
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => {
                 setMode(m.id as ProductionMode);
              }}
              className={`flex flex-col items-start px-6 py-3 rounded-xl transition-all ${
                mode === m.id
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-100'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-white/40'
              }`}
            >
              <div className="flex items-center gap-2 mb-0.5">
                <m.icon size={14} className={mode === m.id ? 'text-indigo-600' : ''} />
                <span className="text-[12px] font-black uppercase tracking-widest">{m.label}</span>
              </div>
              <span className="text-[10px] font-bold opacity-60">{m.sub}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: MAIN CONFIGURATION (Wider) */}
        <div className="lg:col-span-9 space-y-8">
          
          <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
             
             {/* Header Context */}
             <div className="p-8 border-b border-slate-100 bg-slate-50/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-[20px] font-black text-slate-900 tracking-tight">
                      {mode === 'INTERNAL_STOCK' ? 'Internal Production Batch' : 'Quick Sale Interface'}
                    </h2>
                    <p className="text-[12px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                      {mode === 'INTERNAL_STOCK' ? 'Define output quantities and required materials.' : 'Process an instant sale from finished stock.'}
                    </p>
                  </div>
                </div>
             </div>

             <div className="p-10 space-y-10">
                {/* MODE: INTERNAL PRODUCTION */}
                {mode === 'INTERNAL_STOCK' && (
                  <div className="space-y-10">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* PRODUCT INFO */}
                        <div className="space-y-6">
                           <div>
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 block px-1">Production Name</label>
                              <input 
                                type="text"
                                value={productName}
                                onChange={e => setProductName(e.target.value)}
                                placeholder="e.g. Modern Barong RTW Batch"
                                className="w-full h-16 px-6 rounded-[24px] border-2 border-slate-100 focus:border-slate-900 outline-none text-[16px] font-black text-slate-900 transition-all shadow-sm"
                              />
                           </div>
                           <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100/50">
                              <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-2 mb-2"><Info size={14} /> Production Tracking</p>
                              <p className="text-[12px] text-slate-500 leading-relaxed font-medium">This batch will be automatically logged to the production history and added to finished goods upon completion.</p>
                           </div>
                        </div>

                        {/* SIZING BATCH */}
                        <div className="bg-slate-50 p-8 rounded-[36px] border border-slate-100">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 block text-center italic">Batch Quantities per Standard Size</label>
                           <div className="grid grid-cols-5 gap-3">
                              {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                                <div key={size} className="space-y-2">
                                  <div className="text-center text-[11px] font-black text-slate-900">{size}</div>
                                  <input 
                                    type="number"
                                    min="0"
                                    value={assemblySizes[size] || 0}
                                    onChange={e => setAssemblySizes({...assemblySizes, [size]: parseInt(e.target.value) || 0})}
                                    className="w-full h-12 rounded-xl border border-slate-200 text-center text-[14px] font-black focus:border-indigo-500 outline-none transition-all shadow-sm"
                                  />
                                </div>
                              ))}
                           </div>
                           <div className="mt-8 flex items-center justify-between px-2">
                              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Total Batch Output</span>
                              <span className="text-[20px] font-black text-slate-900">{totalInternalUnits} <span className="text-[10px] text-slate-400 uppercase">Units</span></span>
                           </div>
                        </div>
                     </div>

                     {/* BILL OF MATERIALS (BOM) */}
                     <div className="space-y-6">
                        <div className="flex items-center justify-between px-1">
                           <div className="flex items-center gap-2">
                              <PlusCircle size={14} className="text-indigo-600" />
                              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Add Materials (Needed per Piece)</h3>
                           </div>
                        </div>

                        <div className="grid grid-cols-12 gap-3 items-end bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                           <div className="col-span-7">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Inventory Item</label>
                              <div className="relative">
                                 <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                 <select 
                                    value={tempMatSku}
                                    onChange={e => setTempMatSku(e.target.value)}
                                    className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 bg-white text-[12px] font-black text-slate-700 outline-none focus:border-slate-900 transition-all cursor-pointer shadow-sm"
                                 >
                                    <option value="">Select Material...</option>
                                    {materialsList.map(m => (
                                       <option key={m.sku} value={m.sku}>{m.item || m.item_name} ({m.stock} {m.unit} on hand)</option>
                                    ))}
                                 </select>
                              </div>
                           </div>
                           <div className="col-span-3">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Qty per Unit</label>
                              <input 
                                 type="number"
                                 step="0.1"
                                 value={tempMatQty}
                                 onChange={e => setTempMatQty(e.target.value)}
                                 placeholder="e.g. 1.5"
                                 className="w-full h-12 px-4 rounded-xl border border-slate-200 text-[14px] font-black outline-none focus:border-slate-900 shadow-sm"
                              />
                           </div>
                           <div className="col-span-2">
                              <button 
                                 onClick={() => {
                                    if (tempMatSku && tempMatQty) {
                                       setBomList([...bomList, { sku: tempMatSku, qty: parseFloat(tempMatQty) }]);
                                       setTempMatSku(''); setTempMatQty('');
                                    }
                                 }}
                                 disabled={!tempMatSku || !tempMatQty}
                                 className="w-full h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-indigo-600 disabled:opacity-20 transition-all shadow-lg active:scale-95"
                              >
                                 <Plus size={20} />
                              </button>
                           </div>
                        </div>

                        {/* BOM LIST */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           {bomList.length === 0 ? (
                              <div className="col-span-3 py-12 text-center bg-white rounded-[32px] border-2 border-dashed border-slate-100 text-slate-300">
                                 <Info size={32} className="mx-auto mb-3 opacity-20" />
                                 <p className="text-[10px] font-black uppercase tracking-widest">Recipe ingredients will appear here</p>
                              </div>
                           ) : (
                              bomList.map((m, idx) => {
                                 const item = inventory.find(inv => inv.sku === m.sku);
                                 return (
                                    <div key={idx} className="p-5 rounded-[24px] border border-slate-200 bg-white shadow-sm flex items-center justify-between group hover:border-indigo-600 transition-all">
                                       <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                             <Package size={16} />
                                          </div>
                                          <div>
                                             <p className="text-[13px] font-black text-slate-900">{item?.item || item?.item_name || m.sku}</p>
                                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{m.qty} {item?.unit} / pc</p>
                                          </div>
                                       </div>
                                       <button onClick={() => setBomList(bomList.filter((_, i) => i !== idx))} className="w-8 h-8 rounded-lg text-slate-300 hover:bg-rose-50 hover:text-rose-600 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                          <X size={16} />
                                       </button>
                                    </div>
                                 );
                              })
                           )}
                        </div>
                     </div>
                  </div>
                )}

                {/* MODE: RTW QUICK SALE */}
                {mode === 'RTW' && (
                  <div className="space-y-10 py-10">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="relative group">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 block px-1">Finished Stock Selection</label>
                          <div className="relative">
                            <ShoppingBag className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <select
                              value={quickSaleItemSku}
                              onChange={e => setQuickSaleItemSku(e.target.value)}
                              className="w-full h-16 pl-14 pr-10 rounded-[24px] border-2 border-slate-100 bg-white outline-none text-[15px] font-black text-slate-700 appearance-none cursor-pointer focus:border-slate-900 transition-all shadow-sm"
                            >
                              <option value="">Select On-Hand Stock...</option>
                              {finishedGoods.filter(i => (i.stock || 0) > 0).map(p => (
                                <option key={p.sku} value={p.sku}>{p.item_name || p.item} ({p.stock} available)</option>
                              ))}
                            </select>
                            <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          </div>
                        </div>

                        <div className="relative group">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 block px-1">Customer Entry</label>
                          <div className="relative">
                            <Users className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                              type="text" 
                              placeholder="Name or Phone Number..."
                              value={quickSaleCustomer}
                              onChange={(e) => setQuickSaleCustomer(e.target.value)}
                              className="w-full h-16 pl-14 pr-5 rounded-[24px] border-2 border-slate-100 bg-white text-[15px] font-black text-slate-900 outline-none focus:border-slate-900 transition-all shadow-sm"
                            />
                          </div>
                        </div>
                     </div>

                     {quickSaleItemSku ? (
                        <div className="max-w-[450px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                           <div className="bg-slate-50 p-12 rounded-[48px] border border-slate-100 flex flex-col items-center justify-center">
                              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 block">Quantity for Release</label>
                              <div className="flex items-center gap-10">
                                <button onClick={() => setQuickSaleQty(Math.max(1, quickSaleQty - 1))} className="w-16 h-16 rounded-[24px] bg-white border-2 border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm active:scale-90"><Minus size={28} /></button>
                                <span className="text-[72px] font-black text-slate-900 tabular-nums">{quickSaleQty}</span>
                                <button onClick={() => setQuickSaleQty(quickSaleQty + 1)} className="w-16 h-16 rounded-[24px] bg-white border-2 border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm active:scale-90"><Plus size={28} /></button>
                              </div>
                           </div>
                           
                           <div className="p-8 rounded-[32px] bg-slate-900 text-white shadow-2xl shadow-slate-900/30 flex justify-between items-center">
                              <div>
                                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Estimated Total</p>
                                 <p className="text-[28px] font-black tracking-tight">₱{(((finishedGoods.find(i => i.sku === quickSaleItemSku)?.unit_price || finishedGoods.find(i => i.sku === quickSaleItemSku)?.price) || 0) * quickSaleQty).toLocaleString()}</p>
                              </div>
                              <div className="text-right">
                                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Stock Status</p>
                                 <p className="text-[14px] font-black uppercase text-indigo-400">{finishedGoods.find(i => i.sku === quickSaleItemSku)?.stock || 0} on hand</p>
                              </div>
                           </div>
                        </div>
                     ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-slate-300 opacity-50 bg-slate-50/50 rounded-[48px] border-2 border-dashed border-slate-100">
                           <ShoppingBag size={56} strokeWidth={1} />
                           <p className="mt-6 font-black text-[13px] uppercase tracking-[0.2em]">Select finished goods to start sale</p>
                        </div>
                     )}
                  </div>
                )}
             </div>

             {/* Footer Action */}
             <div className="p-10 border-t border-slate-100 bg-slate-50/50">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                   <div className="flex items-center gap-10">
                      <div>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Protocol Validation</p>
                        <div className="flex items-center gap-2.5">
                           <div className={`w-3 h-3 rounded-full ${
                              (mode === 'INTERNAL_STOCK' && productName && bomList.length > 0 && totalInternalUnits > 0) ||
                              (mode === 'RTW' && quickSaleItemSku)
                                ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]' 
                                : 'bg-slate-300'
                           }`} />
                           <span className={`text-[12px] font-black uppercase tracking-widest ${
                              (mode === 'INTERNAL_STOCK' && productName && bomList.length > 0 && totalInternalUnits > 0) ||
                              (mode === 'RTW' && quickSaleItemSku)
                                ? 'text-emerald-600' : 'text-slate-400'
                           }`}>
                              {((mode === 'INTERNAL_STOCK' && productName && bomList.length > 0 && totalInternalUnits > 0) || (mode === 'RTW' && quickSaleItemSku)) ? 'Ready to Sync' : 'Awaiting Configuration'}
                           </span>
                        </div>
                      </div>
                      <div className="h-10 w-px bg-slate-200 hidden md:block" />
                      <div>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Projected Stock Update</p>
                        <p className="text-[24px] font-black text-slate-900 leading-none">
                           {mode === 'INTERNAL_STOCK' ? `+${totalInternalUnits}` : (mode === 'RTW' ? `-${quickSaleQty}` : '0')}
                           <span className="text-[12px] text-slate-400 font-bold uppercase ml-2">Units</span>
                        </p>
                      </div>
                   </div>

                   <button 
                     onClick={() => {
                        if (mode === 'INTERNAL_STOCK') {
                           if (!internalValidation.canStart) return;
                           onExecute(); 
                        } else {
                           handleProcessSale();
                        }
                     }}
                     disabled={
                        (mode === 'INTERNAL_STOCK' && (!productName || bomList.length === 0 || totalInternalUnits === 0 || !internalValidation.canStart)) ||
                        (mode === 'RTW' && !quickSaleItemSku)
                     }
                     className="px-16 h-16 bg-slate-900 text-white rounded-[24px] text-[15px] font-black flex items-center justify-center gap-4 hover:bg-indigo-600 transition-all disabled:opacity-20 shadow-2xl shadow-slate-900/30 active:scale-95 group"
                   >
                     {mode === 'INTERNAL_STOCK' ? 'Start Production' : 'Process Sale'}
                     <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>

                {mode === 'INTERNAL_STOCK' && !internalValidation.canStart && internalValidation.missing.length > 0 && (
                  <div className="mt-8 p-5 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-4 animate-in slide-in-from-top-2 duration-300">
                     <AlertTriangle className="text-rose-500 shrink-0 mt-0.5" size={20} />
                     <div>
                        <p className="text-[13px] font-black text-rose-900 leading-none mb-1">Insufficient Inventory</p>
                        <p className="text-[11px] font-bold text-rose-600/80 uppercase tracking-tight">Missing: {internalValidation.missing.join(', ')}</p>
                     </div>
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: HISTORY ONLY (Narrower) */}
        <div className="lg:col-span-3">
           {/* OUTPUT LEDGER */}
           <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[700px]">
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                 <div className="flex items-center gap-3">
                    <History size={16} className="text-slate-400" />
                    <h3 className="text-[12px] font-black uppercase tracking-widest text-slate-900">Production Ledger</h3>
                 </div>
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
                 {movements.filter(m => m.movement_type === 'PRODUCTION' || m.movement_type === 'RELEASE').length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-300 opacity-50">
                       <History size={32} strokeWidth={1} className="mb-2" />
                       <p className="text-[10px] font-black uppercase tracking-widest">No recent logs</p>
                    </div>
                 ) : (
                    movements.filter(m => m.movement_type === 'PRODUCTION' || m.movement_type === 'RELEASE').slice(0, 15).map((move, i) => {
                       const item = inventory.find(inv => inv.sku === move.inventory_item_id);
                       const isOut = move.qty < 0;
                       return (
                          <div key={i} className="flex items-center gap-4 group animate-in slide-in-from-right-2 duration-300" style={{ animationDelay: `${i * 50}ms` }}>
                             <div className={`w-10 h-10 rounded-[14px] border-2 border-slate-50 bg-white flex items-center justify-center transition-all shadow-sm ${isOut ? 'text-amber-500' : 'text-emerald-500'}`}>
                                {isOut ? <ShoppingBag size={14} /> : <Zap size={14} />}
                             </div>
                             <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-0.5">
                                   <p className="text-[13px] font-black text-slate-900 truncate">{item?.item || item?.item_name || move.inventory_item_id}</p>
                                   <span className={`text-[13px] font-black ${isOut ? 'text-amber-600' : 'text-emerald-600'}`}>
                                      {isOut ? '' : '+'}{move.qty}
                                   </span>
                                </div>
                                <div className="flex items-center justify-between">
                                   <p className="text-[10px] font-bold text-slate-400 uppercase truncate max-w-[120px]">{move.reference_id}</p>
                                   <p className="text-[9px] font-black text-slate-300 uppercase">{new Date(move.created_at || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
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

      {/* RECEIPT MODAL */}
      {showReceipt && lastSaleData && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-[480px] rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
              {/* Receipt Header */}
              <div className="bg-slate-900 p-10 text-center relative">
                 <button onClick={() => setShowReceipt(false)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all">
                    <X size={20} />
                 </button>
                 <div className="w-16 h-16 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/30">
                    <CheckCircle2 size={32} className="text-white" />
                 </div>
                 <h3 className="text-[24px] font-black text-white tracking-tight">Sale Confirmed</h3>
                 <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-2">{lastSaleData.receiptNo}</p>
              </div>

              {/* Receipt Content */}
              <div className="p-10 space-y-8">
                 <div className="flex justify-between items-center border-b border-slate-100 pb-6">
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Customer</p>
                       <p className="text-[16px] font-black text-slate-900">{lastSaleData.customer}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date</p>
                       <p className="text-[13px] font-bold text-slate-600">{lastSaleData.date}</p>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="flex justify-between items-center bg-slate-50 p-6 rounded-3xl border border-slate-100">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center">
                             <Package size={20} className="text-slate-400" />
                          </div>
                          <div>
                             <p className="text-[14px] font-black text-slate-900">{lastSaleData.item}</p>
                             <p className="text-[10px] font-bold text-slate-400 uppercase">Qty: {lastSaleData.qty} × ₱{lastSaleData.price.toLocaleString()}</p>
                          </div>
                       </div>
                       <p className="text-[16px] font-black text-slate-900">₱{lastSaleData.total.toLocaleString()}</p>
                    </div>
                 </div>

                 <div className="pt-4 space-y-2">
                    <div className="flex justify-between items-center">
                       <span className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Payment Method</span>
                       <span className="text-[12px] font-black text-slate-900 uppercase">CASH</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                       <span className="text-[18px] font-black text-slate-900 tracking-tight">Total Collected</span>
                       <span className="text-[28px] font-black text-indigo-600 tracking-tighter">₱{lastSaleData.total.toLocaleString()}</span>
                    </div>
                 </div>

                 {/* Actions */}
                 <div className="grid grid-cols-2 gap-4 pt-6">
                    <button className="h-14 rounded-2xl border-2 border-slate-100 flex items-center justify-center gap-2 text-[12px] font-black text-slate-600 hover:border-slate-900 hover:text-slate-900 transition-all">
                       <Printer size={16} /> Print Receipt
                    </button>
                    <button className="h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center gap-2 text-[12px] font-black hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/20">
                       <Mail size={16} /> Email Customer
                    </button>
                 </div>
              </div>

              {/* Bottom Decoration */}
              <div className="p-6 bg-slate-50 text-center border-t border-slate-100">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Thank you for your business</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
