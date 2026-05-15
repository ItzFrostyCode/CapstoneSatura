'use client';

import React from 'react';
import { Truck, ArrowRight, MapPin, Calendar, User, Package, CheckCircle2 } from 'lucide-react';
import { InventoryItem } from '@/store/useERPStore';

interface InternalTransfersProps {
  inventory: InventoryItem[];
}

export function InternalTransfers({ inventory }: InternalTransfersProps) {
  // Mock requests from child branches
  const pendingRequests = [
    {
      id: 'REQ-442',
      fromBranch: 'Sutura QC Outlet',
      date: 'Today, 10:30 AM',
      items: [{ name: 'Linen Blue', qty: 15, unit: 'm' }],
      urgency: 'HIGH',
      manager: 'Elena'
    }
  ];

  const transfers = [
    {
      id: 'TR-001',
      date: 'May 08, 2026',
      from: 'Main HQ (Quezon City)',
      to: 'Satellite (Makati)',
      items: [
        { name: 'Italian Wool (Midnight)', qty: 5, unit: 'm' },
        { name: 'Silver Buttons', qty: 50, unit: 'pcs' }
      ],
      status: 'In Transit',
      shipping_fee: 150,
      courier: 'Internal (Rider #1)',
      performedBy: 'Joshua (Admin)'
    },
    {
      id: 'TR-002',
      date: 'May 07, 2026',
      from: 'Satellite (Makati)',
      to: 'Main HQ (Quezon City)',
      items: [
        { name: 'Silk Lining (Beige)', qty: 2, unit: 'm' }
      ],
      status: 'Delivered',
      shipping_fee: 80,
      courier: 'Lalamove',
      performedBy: 'Staff Member'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Info */}
      <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                <Truck size={24} className="text-indigo-400" />
              </div>
              <h2 className="text-[28px] font-black tracking-tight">Inter-Branch Logistics</h2>
            </div>
            <p className="text-slate-400 font-medium max-w-md">
              Fulfill stock requests from satellite branches and track internal deliveries.
            </p>
          </div>
          
          <button className="px-8 h-14 bg-indigo-600 text-white rounded-2xl text-[15px] font-black shadow-lg hover:bg-indigo-500 transition-all active:scale-95 flex items-center gap-2">
            Initiate HQ Transfer <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {/* Incoming Requests Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-widest">Incoming Requests (Awaiting HQ Approval)</h3>
        </div>
        <div className="grid gap-3">
          {pendingRequests.map(req => (
            <div key={req.id} className="bg-white border-2 border-rose-100 p-5 rounded-[24px] flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 font-black">
                  {req.fromBranch.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-[14px] font-black text-slate-900">{req.fromBranch}</p>
                    <span className="text-[9px] font-black bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full">{req.urgency} PRIORITY</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-tight">Requested By: Manager {req.manager} • {req.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-[13px] font-black text-slate-900">{req.items.map(i => `${i.qty}${i.unit} ${i.name}`).join(', ')}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Manifest Required</p>
                </div>
                <button className="h-11 px-6 bg-slate-900 text-white rounded-xl text-[12px] font-black hover:bg-indigo-600 transition-all shadow-md">
                  Review & Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-100 pt-8 space-y-4">
        <h3 className="text-[13px] font-black text-slate-400 uppercase tracking-widest px-2">Recent Logistics History</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {transfers.map(tr => (
            <div key={tr.id} className="bg-white rounded-[28px] border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:border-indigo-200 transition-all group">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{tr.id}</span>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                    tr.status === 'Delivered' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                  }`}>
                    {tr.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar size={14} />
                  <span className="text-[12px] font-bold">{tr.date}</span>
                </div>
              </div>

              <div className="p-6 flex-1 space-y-6">
                <div className="flex items-center justify-between relative">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 text-slate-400">
                      <MapPin size={12} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Origin</span>
                    </div>
                    <p className="text-[14px] font-black text-slate-900">{tr.from}</p>
                  </div>
                  <div className="px-4 flex items-center justify-center text-indigo-200 group-hover:text-indigo-500 transition-colors">
                    <ArrowRight size={24} />
                  </div>
                  <div className="flex-1 space-y-1 text-right">
                    <div className="flex items-center gap-2 text-slate-400 justify-end">
                      <span className="text-[10px] font-black uppercase tracking-widest">Destination</span>
                      <MapPin size={12} />
                    </div>
                    <p className="text-[14px] font-black text-slate-900">{tr.to}</p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 space-y-3 border border-slate-100">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Package size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Manifest</span>
                    </div>
                    <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                      Transpo Fee: ₱{tr.shipping_fee.toFixed(2)}
                    </div>
                  </div>
                  {tr.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-[13px] font-medium text-slate-700">{item.name}</span>
                      <span className="text-[13px] font-black text-slate-900">{item.qty} {item.unit}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[12px] text-slate-500">
                  <div className="flex items-center gap-2">
                    <User size={14} />
                    <span>Authorized by <b>{tr.performedBy}</b></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium italic">Courier: {tr.courier}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50/30">
                <button className="w-full h-10 rounded-xl border border-slate-200 text-slate-600 text-[12px] font-bold hover:bg-white transition-all">
                  View Full Waybill
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-5 rounded-[24px] bg-indigo-50 border border-indigo-100 flex gap-4">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-200">
          <Truck size={20} />
        </div>
        <p className="text-[12px] text-indigo-900 font-medium leading-relaxed">
          <b>Internal Logistics Policy:</b> All transfers from HQ to satellite branches must include a delivery fee for fuel and rider compensation. Receiving managers must acknowledge delivery to update their local branch inventory.
        </p>
      </div>
    </div>
  );
}
