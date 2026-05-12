'use client';

import React, { useState } from 'react';
import { X, Package, MapPin, TrendingUp, TrendingDown, History, Info, BarChart3, Tag, Edit3 } from 'lucide-react';
import { useERPStore, InventoryItem, StockMovement, Staff } from '@/store/useERPStore';

interface InventoryItemDetailProps {
  item: InventoryItem | null;
  onClose: () => void;
  movements: StockMovement[];
  staff: Staff[];
  renderAvatar: (name: string, size?: number, imageUrl?: string) => React.ReactNode;
}

export function InventoryItemDetail({
  item,
  onClose,
  movements,
  staff,
  renderAvatar
}: InventoryItemDetailProps) {

  const [isUpdatingStock, setIsUpdatingStock] = useState(false);
  const [actualStock, setActualStock] = useState(item?.stock?.toString() || '0');
  const [adjustmentReason, setAdjustmentReason] = useState('Counting Error');
  const recordInventoryTransaction = useERPStore(state => state.recordInventoryTransaction);

  if (!item) return null;

  const itemMovements = movements
    .filter(m => m.inventory_item_id === item.id || m.inventory_item_id === item.sku)
    .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());

  const formatCurrency = (n: number) => {
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(n);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-[450px] bg-white shadow-2xl z-300 border-l border-slate-100 flex flex-col animate-in slide-in-from-right duration-500">
      {/* Header */}
      <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400">
            <Package size={24} />
          </div>
          <div>
            <h2 className="text-[18px] font-black text-slate-900 tracking-tight">Item Details</h2>
            <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest">{item.sku}</p>
          </div>
        </div>
        <button onClick={onClose} className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
        {/* Identity Section */}
        <div className="flex flex-col items-center text-center space-y-4">
           <div className="relative group">
              {renderAvatar(item.item || item.item_name || '', 120, item.image)}
              <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-xl shadow-lg border-4 border-white">
                 <Tag size={18} />
              </div>
           </div>
           <div>
              <h3 className="text-[22px] font-black text-slate-900 leading-tight">{item.item || item.item_name}</h3>
              <p className="text-[14px] font-bold text-slate-500 mt-1">{item.cat || item.category}</p>
           </div>
           <div className="flex items-center gap-2">
              <span className="px-4 py-1.5 bg-slate-100 rounded-full text-[12px] font-black text-slate-600 uppercase tracking-widest border border-slate-200/50 flex items-center gap-2">
                 <MapPin size={12} className="text-indigo-500" />
                 {item.location || 'Warehouse A'}
              </span>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 relative group">
              <div className="flex justify-between items-start mb-1">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">System Stock</p>
                <button 
                  onClick={() => setIsUpdatingStock(!isUpdatingStock)}
                  className="text-slate-400 hover:text-indigo-600 transition-colors"
                  title="Update Stock Count"
                >
                  <Edit3 size={14} />
                </button>
              </div>
              <div className="flex items-baseline gap-2">
                 <span className="text-[24px] font-black text-slate-900">{item.stock}</span>
                 <span className="text-[12px] font-bold text-slate-500 uppercase">{item.unit}</span>
              </div>
           </div>
           <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Asset Valuation</p>
              <div className="flex items-baseline gap-2">
                 <span className="text-[20px] font-black text-emerald-600">
                   {formatCurrency((item.weighted_average_cost || item.unit_cost || item.price || 0) * (item.stock || 0))}
                 </span>
              </div>
           </div>
        </div>

        {/* Update Stock Form */}
        {isUpdatingStock && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
            <h4 className="text-[13px] font-black text-indigo-900 uppercase tracking-widest flex items-center gap-2">
               <Edit3 size={16} /> Update Stock Count
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-black text-indigo-400 uppercase ml-1">Actual Count</label>
                <input 
                  type="number" 
                  value={actualStock}
                  onChange={e => setActualStock(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-indigo-200 text-[14px] font-black outline-none focus:border-indigo-500 bg-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-indigo-400 uppercase ml-1">Reason</label>
                <select 
                  value={adjustmentReason}
                  onChange={e => setAdjustmentReason(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-indigo-200 text-[12px] font-bold outline-none focus:border-indigo-500 bg-white"
                >
                  <option>Counting Error</option>
                  <option>Missing</option>
                  <option>Damaged</option>
                  <option>Spoiled / Wasted</option>
                </select>
              </div>
            </div>
            {parseInt(actualStock) !== (item.stock || 0) && (
              <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-indigo-100">
                <span className="text-[11px] font-bold text-slate-500">Difference:</span>
                <span className={`text-[14px] font-black ${parseInt(actualStock) > (item.stock || 0) ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {parseInt(actualStock) > (item.stock || 0) ? '+' : ''}{parseInt(actualStock) - (item.stock || 0)} {item.unit}
                </span>
              </div>
            )}
            <div className="flex gap-2">
              <button 
                onClick={() => setIsUpdatingStock(false)}
                className="flex-1 py-2 bg-white text-slate-500 font-bold text-[12px] rounded-xl border border-indigo-100 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  const diff = parseInt(actualStock) - (item.stock || 0);
                  if (diff !== 0) {
                    recordInventoryTransaction(item.id, diff > 0 ? 'ADJUST' : 'OUT', Math.abs(diff), adjustmentReason, 'MANUAL_COUNT');
                  }
                  setIsUpdatingStock(false);
                }}
                disabled={parseInt(actualStock) === (item.stock || 0)}
                className="flex-2 py-2 bg-indigo-600 text-white font-black text-[12px] rounded-xl hover:bg-indigo-700 disabled:opacity-50"
              >
                Save Actual Count
              </button>
            </div>
          </div>
        )}

        {/* Info List */}
        <div className="space-y-4">
           <h4 className="text-[13px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <Info size={16} className="text-indigo-500" /> Item Properties
           </h4>
           <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-50 shadow-sm">
              <div className="flex justify-between p-4">
                 <span className="text-[13px] font-bold text-slate-500">Weighted Avg Cost</span>
                 <span className="text-[13px] font-black text-slate-900">{formatCurrency(item.weighted_average_cost || item.unit_cost || item.price || 0)}</span>
              </div>
              <div className="flex justify-between p-4">
                 <span className="text-[13px] font-bold text-slate-500">Last Purchase Price</span>
                 <span className="text-[13px] font-black text-slate-900">{formatCurrency(item.last_purchase_price || item.unit_cost || item.price || 0)}</span>
              </div>
              <div className="flex justify-between p-4">
                 <span className="text-[13px] font-bold text-slate-500">Is Sellable</span>
                 <span className={`text-[13px] font-black ${item.is_sellable ? 'text-emerald-600' : 'text-amber-600'}`}>
                   {item.is_sellable ? 'Yes (Retail)' : 'No (Raw Material)'}
                 </span>
              </div>
              <div className="flex justify-between p-4">
                 <span className="text-[13px] font-bold text-slate-500">Reorder Level</span>
                 <span className="text-[13px] font-black text-rose-500">{item.minStock || item.reorder_level || 0} {item.unit}</span>
              </div>
              <div className="flex justify-between p-4">
                 <span className="text-[13px] font-bold text-slate-500">Storage Zone</span>
                 <span className="text-[13px] font-black text-slate-900">{item.location || 'N/A'}</span>
              </div>
           </div>
        </div>

        {/* Recent History */}
        <div className="space-y-4">
           <h4 className="text-[13px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <History size={16} className="text-amber-500" /> Recent Movements
           </h4>
           <div className="space-y-3">
              {itemMovements.length === 0 ? (
                 <p className="text-[13px] text-slate-400 italic text-center py-4 bg-slate-50 rounded-xl">No recent movements</p>
              ) : (
                 itemMovements.slice(0, 5).map((move) => (
                    <div key={move.id} className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                       <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${move.qty > 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                             {move.qty > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                          </div>
                          <div>
                             <p className="text-[13px] font-bold text-slate-800">{move.movement_type}</p>
                             <p className="text-[11px] text-slate-500">{new Date(move.created_at || '').toLocaleDateString()}</p>
                          </div>
                       </div>
                       <div className={`text-[14px] font-black ${move.qty > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {move.qty > 0 ? '+' : ''}{move.qty}
                       </div>
                    </div>
                 ))
              )}
           </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-8 border-t border-slate-100 bg-slate-50/50 shrink-0">
         <button 
           onClick={() => alert('Generating inventory velocity and demand forecasting report for ' + (item.item || item.item_name) + '...')}
           className="w-full h-12 bg-slate-900 text-white rounded-xl text-[14px] font-black shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 active:scale-95"
         >
            <BarChart3 size={18} /> View Analytics Report
         </button>
      </div>
    </div>
  );
}
