'use client';

import React from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Order } from '@/types/erp';

interface OrdersTabProps {
  orders: Order[];
  customerId: string;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({ orders, customerId }) => {
  const filteredOrders = orders.filter(o => o.customer_id === customerId);

  return (
    <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="fixed-table-container">
        <table className="fixed-table w-full text-left">
          <thead>
            <tr className="bg-slate-50/20">
              <th className="py-6 px-8 text-[14px] font-bold text-slate-600 whitespace-nowrap">
                <div className="flex items-center gap-2">Order ID & Date <ChevronDown size={14} className="text-slate-400" /></div>
              </th>
              <th className="py-6 px-8 text-[14px] font-bold text-slate-600 whitespace-nowrap">
                <div className="flex items-center gap-2">Production Type <ChevronDown size={14} className="text-slate-400" /></div>
              </th>
              <th className="py-6 px-8 text-[14px] font-bold text-slate-600 whitespace-nowrap">
                <div className="flex items-center gap-2">Garment / Service <ChevronDown size={14} className="text-slate-400" /></div>
              </th>
              <th className="py-6 px-8 text-[14px] font-bold text-slate-600 whitespace-nowrap">
                <div className="flex items-center gap-2">Status <ChevronDown size={14} className="text-slate-400" /></div>
              </th>
              <th className="py-6 px-8 text-[14px] font-bold text-slate-600 whitespace-nowrap text-right">
                <div className="flex items-center justify-end gap-2 pr-2">Financials <ChevronDown size={14} className="text-slate-400" /></div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredOrders.map(order => {
              const garmentName = order.id === 'ORD-1070' ? 'Filipiniana Terno' :
                                 order.id === 'ORD-1064' ? 'RTW Linen Polo' :
                                 order.id === 'ORD-1058' ? 'Blazer Sleeve Adjustment' :
                                 order.id === 'ORD-1052' ? 'School Uniform Set' :
                                 order.id === 'ORD-HIST-002' ? 'Custom Wedding Barong' : 'Custom Job';
              
              return (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-6 px-8">
                    <div className="text-[14px] font-bold text-slate-900">#{order.id}</div>
                    <div className="text-[12px] text-slate-400 font-medium mt-1">{new Date(order.created_at).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}</div>
                  </td>
                  <td className="py-6 px-8 text-[14px] font-medium text-slate-600">
                    {order.order_type === 'READY_MADE' ? 'Ready Made' : order.order_type.charAt(0) + order.order_type.slice(1).toLowerCase()}
                  </td>
                  <td className="py-6 px-8 text-[14px] font-medium text-slate-600">
                    {garmentName}
                  </td>
                  <td className="py-6 px-8 text-[13px] font-bold text-slate-900 uppercase tracking-wide">
                    {order.status.replace('_', ' ')}
                  </td>
                  <td className="py-6 px-8 text-right pr-10">
                    <div className="text-[15px] font-bold text-slate-900">₱{order.total_amount.toLocaleString()}</div>
                    <div className="text-[12px] text-slate-400 font-medium mt-1">Fully Paid</div>
                  </td>
                </tr>
              );
            })}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={5} className="py-24 text-center text-slate-300 font-medium text-[15px]">No orders found for this customer.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-8 border-t border-slate-50 flex items-center justify-between">
        <div className="text-[13px] font-bold text-slate-400">
          Showing 1 to {filteredOrders.length} of {filteredOrders.length} Orders
        </div>
        <div className="flex gap-2">
          <button className="h-10 px-6 rounded-xl border border-slate-200 text-[13px] font-bold text-slate-400 hover:border-slate-900 hover:text-slate-900 transition-all">
            Previous
          </button>
          <button className="h-10 px-6 rounded-xl border border-slate-900 bg-white text-slate-900 text-[13px] font-bold hover:bg-slate-900 hover:text-white transition-all shadow-sm">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
