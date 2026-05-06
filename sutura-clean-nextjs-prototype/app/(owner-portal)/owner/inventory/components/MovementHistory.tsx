'use client';

import React from 'react';
import { History, TrendingUp, TrendingDown, Clock, User, Hash } from 'lucide-react';
import { StockMovement, Staff, InventoryItem } from '@/store/useERPStore';

interface MovementHistoryProps {
  movements: StockMovement[];
  staff: Staff[];
  inventory: InventoryItem[];
}

export function MovementHistory({ movements, staff, inventory }: MovementHistoryProps) {

  const getMovementClasses = (type: string) => {
    switch (type) {
      case 'RECEIVE':
      case 'Stock In': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'ISSUE':
      case 'Stock Out': return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'Production': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'ADJUSTMENT_IN':
      case 'Adjustment': return 'bg-amber-50 text-amber-700 border-amber-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="animate-in slide-in-from-bottom-2 duration-500">
      <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-[18px] font-black text-slate-900 tracking-tight flex items-center gap-2">
            <History size={20} className="text-slate-400" />
            Stock Ledger & Audit Trail
          </h3>
          <p className="text-[13px] text-slate-500 font-medium mt-1">Real-time immutable log of all inventory transactions.</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
              <th className="px-6 py-4"><div className="flex items-center gap-2"><Clock size={12} /> Time</div></th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Item Target</th>
              <th className="px-6 py-4 text-center">Qty Change</th>
              <th className="px-6 py-4"><div className="flex items-center gap-2"><Hash size={12} /> Reference</div></th>
              <th className="px-6 py-4 text-right"><div className="flex items-center gap-2 justify-end"><User size={12} /> By</div></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {movements.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center">
                   <div className="flex flex-col items-center gap-3 opacity-40">
                      <History size={48} strokeWidth={1} />
                      <p className="text-[15px] font-bold text-slate-900">No movements recorded yet</p>
                      <p className="text-[13px] font-medium text-slate-500 max-w-[280px] mx-auto">All stock in/out actions will generate an audit trail here automatically.</p>
                   </div>
                </td>
              </tr>
            ) : (
              movements.map((move) => {
                const item = inventory.find(i => i.id === move.inventory_item_id || i.sku === move.inventory_item_id);
                const isPositive = move.qty > 0;
                
                return (
                  <tr key={move.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-black text-slate-900">{formatTime(move.created_at || '')}</span>
                        <span className="text-[10px] font-bold text-slate-400">{new Date(move.created_at || '').toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getMovementClasses(move.movement_type || move.reference_type || '')}`}>
                        {move.movement_type || move.reference_type}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-[14px] font-black text-slate-900">{item?.item || item?.item_name || move.inventory_item_id}</span>
                        <span className="text-[11px] font-bold text-slate-400">{item?.sku || ''}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className={`inline-flex items-center gap-1 font-black text-[15px] px-3 py-1 rounded-full ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {isPositive ? '+' : ''}{move.qty}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-[12px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md border border-slate-200/50 w-max font-mono">
                        {move.reference_id || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="text-right">
                           <p className="text-[13px] font-black text-slate-900">{staff.find(s => s.id === move.performed_by_user_id)?.name || move.performed_by_user_id || 'System'}</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase">Admin</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-[10px]">
                          {(staff.find(s => s.id === move.performed_by_user_id)?.name || 'S')[0]}
                        </div>
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
  );
}
