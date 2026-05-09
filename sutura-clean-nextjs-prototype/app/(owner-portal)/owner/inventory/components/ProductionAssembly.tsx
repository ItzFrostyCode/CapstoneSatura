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
  Scissors
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

type ProductionMode = 'CUSTOM' | 'BULK' | 'ALTERATION' | 'RTW';

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
  const [mode, setMode] = useState<ProductionMode>('CUSTOM');
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

  // Filter orders by current mode
  const filteredOrders = useMemo(() => {
    if (mode === 'CUSTOM') return activeJobOrders.filter(o => o.order_type === 'BESPOKE');
    if (mode === 'BULK') return activeJobOrders.filter(o => o.order_type === 'BULK');
    if (mode === 'ALTERATION') return activeJobOrders.filter(o => o.order_type === 'ALTERATION');
    return [];
  }, [activeJobOrders, mode]);

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
          { id: 'CUSTOM', label: 'Custom Tailoring (Pasadya)', icon: Scissors },
          { id: 'BULK', label: 'Bulk Order (Uniforms)', icon: Users },
          { id: 'ALTERATION', label: 'Repair & Alterations', icon: Edit3 },
          { id: 'RTW', label: 'Ready-to-Wear (RTW)', icon: ShoppingBag }
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => {
               setMode(m.id as ProductionMode);
               setSelectedJoId(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-black transition-all ${
              mode === m.id
                ? 'bg-white text-indigo-600 shadow-sm border border-slate-100'
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
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
            
            {/* Header Section */}
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              {mode !== 'RTW' ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-[18px] font-black text-slate-900 tracking-tight">
                        {mode === 'CUSTOM' ? 'Pasadya Fulfillment' : 
                         mode === 'BULK' ? 'Uniform Production' : 
                         'Alteration Workflow'}
                      </h2>
                      <p className="text-[12px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                        Select active job order to record production completion.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-8">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Active {mode} Orders</label>
                      <div className="relative">
                        <select 
                          value={selectedJoId || ''}
                          onChange={(e) => setSelectedJoId(e.target.value)}
                          className="w-full h-14 pl-12 pr-6 rounded-2xl border-2 border-slate-100 bg-white focus:border-slate-900 outline-none text-[15px] font-black text-slate-700 appearance-none cursor-pointer transition-all shadow-sm"
                        >
                          <option value="">Select Order to Fulfill...</option>
                          {filteredOrders.length > 0 ? (
                            filteredOrders.map(o => {
                              const customer = customers.find(c => c.id === o.customer_id);
                              return (
                                <option key={o.id} value={o.id}>
                                  {o.id} — {customer?.name || o.organization_name || 'Unknown'}
                                </option>
                              );
                            })
                          ) : (
                            <option disabled>No active {mode.toLowerCase()} orders found</option>
                          )}
                        </select>
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                      </div>
                    </div>
                    {selectedJoId && (
                      <div className="md:col-span-4 bg-white p-3 rounded-2xl border-2 border-indigo-50 flex flex-col justify-center animate-in zoom-in-95 duration-200">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 text-center">Commitment Date</p>
                        <p className="text-[16px] font-black text-indigo-600 text-center">
                          {new Date(activeJobOrders.find(o => o.id === selectedJoId)?.due_date || '').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-[18px] font-black text-slate-900 tracking-tight">Walk-in Checkout (RTW)</h2>
                      <p className="text-[12px] text-slate-400 font-bold uppercase tracking-widest mt-1">Direct sale from available finished goods stock.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Finished Garment</label>
                      <select
                        value={quickSaleItemSku}
                        onChange={e => setQuickSaleItemSku(e.target.value)}
                        className="w-full h-14 pl-12 pr-6 rounded-2xl border-2 border-slate-100 bg-white outline-none text-[15px] font-black text-slate-700 appearance-none cursor-pointer focus:border-slate-900 transition-all shadow-sm"
                      >
                        <option value="">Select On-Hand Style...</option>
                        {finishedGoods.filter(i => (i.stock || 0) > 0).map(p => (
                          <option key={p.sku} value={p.sku}>
                            {p.item_name || p.item} ({p.stock} in stock)
                          </option>
                        ))}
                      </select>
                      <ShoppingBag className="absolute left-4 top-[42px] text-slate-300" size={18} />
                      <ChevronDown size={16} className="absolute right-4 top-[42px] text-slate-400 pointer-events-none" />
                    </div>
                    <div>
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Customer Name</label>
                      <input 
                        type="text"
                        placeholder="Walk-in Customer"
                        value={quickSaleCustomer}
                        onChange={(e) => setQuickSaleCustomer(e.target.value)}
                        className="w-full h-14 px-5 rounded-2xl border-2 border-slate-100 bg-white text-[15px] font-black text-slate-900 outline-none focus:border-slate-900 transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Middle Content Section */}
            <div className="flex-1 p-6">
              {mode !== 'RTW' ? (
                <div className="space-y-4">
                   <div className="flex items-center gap-2 mb-2">
                    <Layers size={14} className="text-slate-400" />
                    <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Garments in Order</h3>
                  </div>
                  {!selectedJoId ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-300 opacity-50 bg-slate-50/50 rounded-[32px] border-2 border-dashed border-slate-100">
                      <Search size={48} strokeWidth={1} />
                      <p className="mt-4 font-black text-[12px] uppercase tracking-widest">Select an order above to begin</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      {jobOrderItems.filter(item => item.job_order_id === selectedJoId).map((item, i) => (
                        <div key={i} className="p-5 rounded-[24px] border border-slate-200 bg-white shadow-sm hover:border-indigo-200 transition-all group flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-[16px] shadow-lg shadow-slate-900/10">
                              {item.garment_name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-[15px] font-black text-slate-900">{item.garment_name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100/50 uppercase tracking-tight">Size: {item.size || 'Custom'}</span>
                                <span className="text-[10px] font-bold text-slate-400">Qty: {item.quantity}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                               mode === 'ALTERATION' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                            }`}>
                              {mode === 'ALTERATION' ? 'For Repair' : 'Ready to Fulfill'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {!quickSaleItemSku ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-300 opacity-50 bg-slate-50/50 rounded-[32px] border-2 border-dashed border-slate-100">
                      <ShoppingBag size={48} strokeWidth={1} />
                      <p className="mt-4 font-black text-[12px] uppercase tracking-widest">Select an item to checkout</p>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                       <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 flex flex-col items-center justify-center">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Quantity to Sell</label>
                          <div className="flex items-center gap-8">
                            <button 
                              onClick={() => setQuickSaleQty(Math.max(1, quickSaleQty - 1))}
                              className="w-14 h-14 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm"
                            >
                              <Minus size={24} />
                            </button>
                            <span className="text-[48px] font-black text-slate-900 tabular-nums">{quickSaleQty}</span>
                            <button 
                              onClick={() => {
                                const item = finishedGoods.find(i => i.sku === quickSaleItemSku);
                                if (item && quickSaleQty < (item.stock || 0)) {
                                  setQuickSaleQty(quickSaleQty + 1);
                                }
                              }}
                              className="w-14 h-14 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm"
                            >
                              <Plus size={24} />
                            </button>
                          </div>
                          <p className="text-[11px] font-bold text-slate-400 uppercase mt-4">Stock will be deducted from {quickSaleItemSku}</p>
                       </div>

                       <div className="p-5 rounded-[24px] bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 flex justify-between items-center">
                          <div className="space-y-0.5">
                            <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Expected Total</p>
                            <p className="text-[24px] font-black">
                              ₱{((finishedGoods.find(i => i.sku === quickSaleItemSku)?.price || 0) * quickSaleQty).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Inventory Status</p>
                             <p className="text-[14px] font-black">In Stock: {finishedGoods.find(i => i.sku === quickSaleItemSku)?.stock || 0} pcs</p>
                          </div>
                       </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Footer Section */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-10">
                   <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Production Status</p>
                    <div className="flex items-center gap-2">
                       <div className={`w-2 h-2 rounded-full ${((mode !== 'RTW' && selectedJoId) || (mode === 'RTW' && quickSaleItemSku)) ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                       <span className={`text-[12px] font-black uppercase tracking-widest ${((mode !== 'RTW' && selectedJoId) || (mode === 'RTW' && quickSaleItemSku)) ? 'text-emerald-600' : 'text-slate-400'}`}>
                         {((mode !== 'RTW' && selectedJoId) || (mode === 'RTW' && quickSaleItemSku)) ? 'Valid Order' : 'Missing Info'}
                       </span>
                    </div>
                  </div>
                  <div className="h-10 w-px bg-slate-200 hidden md:block" />
                  <div className="hidden md:block">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Items for Release</p>
                    <p className="text-[20px] font-black text-slate-900 leading-none">
                      {mode === 'RTW' ? quickSaleQty : 
                       selectedJoId ? jobOrderItems.filter(i => i.job_order_id === selectedJoId).reduce((sum, i) => sum + i.quantity, 0) : 0} 
                      <span className="text-[11px] text-slate-400 font-bold uppercase ml-1">Pcs</span>
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    if (mode !== 'RTW' && selectedJoId) onFulfillJO(selectedJoId);
                    else if (mode === 'RTW' && quickSaleItemSku) {
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
                  disabled={ (mode !== 'RTW' && !selectedJoId) || (mode === 'RTW' && !quickSaleItemSku) }
                  className="px-12 h-14 bg-slate-900 text-white rounded-2xl text-[14px] font-black flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all disabled:opacity-20 shadow-2xl shadow-slate-900/20 active:scale-95"
                >
                  {mode === 'RTW' ? 'Complete Checkout' : 'Mark as Ready'}
                  <ArrowRight size={18} />
                </button>
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

      {/* Add Customer Modal */}
      {isRegisterCustomerModalOpen && (
        <div className="fixed inset-0 z-250 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-[450px] rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-[20px] font-black text-slate-900 tracking-tight">Add Customer</h2>
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
