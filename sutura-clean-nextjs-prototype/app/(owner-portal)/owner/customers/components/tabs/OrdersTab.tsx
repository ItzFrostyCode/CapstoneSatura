'use client';

import React from 'react';
import { Order } from '@/types/erp';

interface OrdersTabProps {
  orders: Order[];
  customerId: string;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({ orders, customerId }) => {
  const filteredOrders = orders.filter(o => o.customer_id === customerId);

  return (
    <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50/50">
            <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Order ID & Date</th>
            <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Type & Garment</th>
            <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
            <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Financials</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {filteredOrders.map(order => (
            <tr key={order.id} className="hover:bg-slate-50 transition-colors">
              <td className="py-5 px-8">
                <div className="text-[14px] font-black text-slate-900">#{order.id}</div>
                <div className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter">{new Date(order.created_at).toLocaleDateString()}</div>
              </td>
              <td className="py-5 px-8">
                <div className="flex items-center gap-2">
                   <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                     order.order_type === 'BESPOKE' ? 'bg-amber-100 text-amber-700' :
                     order.order_type === 'BULK' ? 'bg-blue-100 text-blue-700' :
                     order.order_type === 'ALTERATION' ? 'bg-purple-100 text-purple-700' :
                     'bg-emerald-100 text-emerald-700'
                   }`}>
                     {order.order_type}
                   </span>
                   <span className="text-[13px] font-bold text-slate-700">{order.items?.[0]?.garment_name ?? 'Custom Job'}</span>
                </div>
                {order.organization_name && (
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                    Org: {order.organization_name}
                  </div>
                )}
              </td>
              <td className="py-5 px-8 text-center">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-slate-100 text-slate-600 border border-slate-200">
                  {order.status.replace('_', ' ')}
                </span>
              </td>
              <td className="py-5 px-8 text-right">
                <div className="text-[14px] font-black text-slate-900">₱{order.total_amount.toLocaleString()}</div>
                <div className={`text-[10px] font-black uppercase ${(order.balance || 0) > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                  {(order.balance || 0) > 0 ? `₱${(order.balance || 0).toLocaleString()} Balance` : 'Fully Paid'}
                </div>
              </td>
            </tr>
          ))}
          {filteredOrders.length === 0 && (
            <tr>
              <td colSpan={4} className="py-20 text-center text-slate-400 font-bold text-[14px]">No orders found for this customer.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
