'use client';

import { 
  TrendingUp, 
  Download, 
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  FileText,
  AlertCircle,
  PackageSearch
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { useERPStore } from '@/store/useERPStore';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<'sales' | 'ar' | 'ap' | 'aging' | 'inventory'>('sales');
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  
  const { payments, invoices, inventory, movements, supplierBills, settlements, orders, productionDiscrepancies } = useERPStore();

  const reportTabs = [
    { id: 'sales' as const, name: 'Sales Report', icon: <TrendingUp size={14} /> },
    { id: 'ar' as const, name: 'Accounts Receivable', icon: <DollarSign size={14} /> },
    { id: 'ap' as const, name: 'Accounts Payable', icon: <ArrowDownRight size={14} /> },
    { id: 'aging' as const, name: 'Aging Report', icon: <AlertCircle size={14} /> },
    { id: 'inventory' as const, name: 'Inventory Report', icon: <PackageSearch size={14} /> },
  ];

  const formatPHP = (num: number) => {
    const safeNum = typeof num === 'number' && !isNaN(num) ? num : 0;
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(safeNum);
  };

  // --- AR & AGING LOGIC ---
  const enhancedInvoices = useMemo(() => {
    return invoices.map(inv => {
      const invPayments = payments.filter(p => p.invoice_id === inv.id);
      const amountPaid = invPayments.reduce((sum, p) => sum + (p.amount_paid || p.amount || 0), 0);
      const balance = inv.total_amount - amountPaid;
      
      const issueDate = inv.issueDate || new Date().toISOString().split('T')[0];
      const dueDate = inv.dueDate || new Date().toISOString().split('T')[0];
      const today = new Date().toISOString().split('T')[0];
      
      let computedStatus: string = inv.statusSnapshot || 'Open';
      if (computedStatus !== 'Draft') {
        if (balance <= 0) computedStatus = 'Paid';
        else if (dueDate < today && balance > 0) computedStatus = 'Past Due';
        else if (amountPaid > 0 && balance > 0) computedStatus = 'Partial';
        else computedStatus = 'Open';
      }

      let agingDays = 0;
      if (computedStatus === 'Past Due') {
        const diffTime = Math.abs(new Date(today).getTime() - new Date(dueDate).getTime());
        agingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }

      let agingBucket = 'Current';
      if (agingDays > 0 && agingDays <= 30) agingBucket = '1-30 Days';
      else if (agingDays > 30 && agingDays <= 60) agingBucket = '31-60 Days';
      else if (agingDays > 60) agingBucket = '60+ Days';

      return { ...inv, amountPaid, balance, computedStatus, issueDate, dueDate, agingDays, agingBucket };
    });
  }, [invoices, payments]);

  const arInvoices = enhancedInvoices.filter(i => i.computedStatus === 'Open' || i.computedStatus === 'Past Due');
  const overdueInvoices = enhancedInvoices.filter(i => i.computedStatus === 'Past Due');
  
  const totalOutstanding = arInvoices.reduce((sum, i) => sum + i.balance, 0);
  const totalOverdue = overdueInvoices.reduce((sum, i) => sum + i.balance, 0);

  // --- SALES LOGIC (Filtered by Date) ---
  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      const paymentDate = (p.paid_at || '').split('T')[0];
      return paymentDate >= startDate && paymentDate <= endDate;
    });
  }, [payments, startDate, endDate]);

  const totalRevenue = filteredPayments.reduce((sum, p) => sum + (p.amount_paid || p.amount || 0), 0);
  const paymentMethods = filteredPayments.reduce((acc, p) => {
    let method = p.payment_method || 'Other';
    // Normalize naming
    if (method.toUpperCase() === 'BANK_TRANSFER' || method === 'Bank Transfer') method = 'Bank Transfer';
    if (method.toUpperCase() === 'GCASH') method = 'GCash';
    
    acc[method] = (acc[method] || 0) + (p.amount_paid || p.amount || 0);
    return acc;
  }, {} as Record<string, number>);

  // --- INVENTORY LOGIC ---
  const computedInventory = inventory.map(item => {
    const itemMovements = movements.filter(m => m.inventory_item_id === item.id);
    const computedStock = itemMovements.reduce((sum, m) => sum + m.qty, 0);
    const isLowStock = computedStock <= (item.minStock || 0);
    return { ...item, computedStock, isLowStock };
  });
  
  const lowStockItems = computedInventory.filter(i => i.isLowStock);

  // --- DISCREPANCY LOGIC ---
  const recentWaste = movements.filter(m => m.movement_type === 'ADJUSTMENT_OUT' || m.movement_type === 'DAMAGE');
  const recentRework = productionDiscrepancies?.filter(d => d.discrepancy_type === 'EXTRA_LABOR') || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 font-poppins">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight leading-none uppercase">Shop Reports</h1>
          <p className="text-[14px] text-slate-500 font-medium mt-1">Analyze your business performance with real-time data insights.</p>
        </div>

        {/* ── HEADER ACTIONS ── */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">From</span>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="text-[12px] font-black text-slate-900 bg-transparent outline-none uppercase tracking-widest"
              />
            </div>
            <div className="w-px h-6 bg-slate-100 mx-2" />
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">To</span>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="text-[12px] font-black text-slate-900 bg-transparent outline-none uppercase tracking-widest"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                const gcashPayments = filteredPayments.filter(p => 
                  (p.payment_method === 'GCash' || p.payment_method === 'Bank Transfer' || p.payment_method === 'GCASH' || p.payment_method === 'BANK_TRANSFER') && p.receipt_image
                );
                if (gcashPayments.length === 0) {
                  alert(`No receipt images found between ${startDate} and ${endDate}.`);
                  return;
                }
                
                const methodFolders = [...new Set(gcashPayments.map(p => p.payment_method))];
                const folderSummary = methodFolders.map(m => {
                  const count = gcashPayments.filter(p => p.payment_method === m).length;
                  return `${m}: ${count} images`;
                }).join('\n');

                alert(`Exporting ${gcashPayments.length} receipt images for ${startDate} to ${endDate}\n\nOrganization:\n${folderSummary}\n\nDownload: receipts_${startDate}_to_${endDate}.zip`);
              }}
              className="h-11 px-4 bg-white border border-slate-200 rounded-xl text-slate-900 text-[12px] font-black hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm uppercase tracking-widest"
            >
              <Download size={16} /> Export Receipts
            </button>
            <button className="h-11 px-4 bg-slate-900 text-white rounded-xl text-[12px] font-black hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm uppercase tracking-widest">
              <Download size={16} /> Download Summary
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap bg-white p-1.5 rounded-full w-max gap-1 border border-slate-200 shadow-sm">
        {reportTabs.map((tab) => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2.5 px-6 py-2.5 rounded-full text-[11px] font-black transition-all uppercase tracking-widest whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>

      {/* ── CONTENT AREA ── */}
      <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
        
        {/* SALES REPORT */}
        {activeTab === 'sales' && (
          <div className="space-y-8 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-inner">
                <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Realized Revenue</div>
                <div className="text-[32px] font-black text-slate-900 leading-none tracking-tight">{formatPHP(totalRevenue)}</div>
                <div className="text-[11px] text-slate-400 mt-2 font-black uppercase tracking-widest">Based on {filteredPayments.length} recorded payments</div>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 col-span-2 shadow-inner">
                 <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Revenue by Payment Method</div>
                 <div className="flex items-center gap-8 overflow-x-auto pb-2">
                   {Object.entries(paymentMethods).map(([method, amount]) => (
                     <div key={method} className="shrink-0">
                       <div className="text-[12px] font-black text-slate-500 uppercase tracking-widest mb-1">{method}</div>
                       <div className="text-[20px] font-black text-blue-600">{formatPHP(amount)}</div>
                     </div>
                   ))}
                   {Object.keys(paymentMethods).length === 0 && (
                     <div className="text-slate-400 text-[11px] font-black uppercase tracking-widest italic">No revenue recorded for this period.</div>
                   )}
                 </div>
              </div>
            </div>

            {/* PROFIT WARNINGS */}
            {(() => {
              const ordersWithLoss = orders.filter(o => 
                o.actual_production_cost && o.actual_production_cost > ((o.total_bom_cost || 0) + (o.total_labor_cost || 0))
              );
              
              if (ordersWithLoss.length === 0) return null;
              
              return (
                <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl">
                  <h3 className="text-[14px] font-black text-rose-700 flex items-center gap-2 mb-4 uppercase tracking-widest"><AlertCircle size={18}/> Orders with Profit Warnings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ordersWithLoss.slice(0, 3).map(order => (
                      <div key={order.id} className="bg-white p-4 rounded-xl border border-rose-100 flex items-center justify-between shadow-sm">
                        <div>
                          <div className="text-[13px] font-black text-slate-900 uppercase tracking-tight">{order.items?.[0]?.garment_name || 'Custom Garment'}</div>
                          <div className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">{order.id}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-[16px] font-black text-rose-600">
                            -₱{((order.actual_production_cost || 0) - ((order.total_bom_cost || 0) + (order.total_labor_cost || 0))).toLocaleString()}
                          </div>
                          <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Lost Margin</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            <div>
              <h3 className="text-[16px] font-black text-slate-900 mb-4 uppercase tracking-widest">Payment Ledger</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50">
                      <th className="px-4 py-4 rounded-tl-lg">Date</th>
                      <th className="px-4 py-4">Receipt ID</th>
                      <th className="px-4 py-4">Invoice / Order</th>
                      <th className="px-4 py-4">Method</th>
                      <th className="px-4 py-4">Reference No.</th>
                      <th className="px-4 py-4 text-right rounded-tr-lg">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredPayments.length === 0 && (
                      <tr><td colSpan={6} className="p-8 text-center text-[11px] font-black text-slate-400 uppercase tracking-widest italic">No payments found in this date range.</td></tr>
                    )}
                    {filteredPayments.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-4 py-4 text-[12px] font-black text-slate-400 uppercase tracking-widest">{new Date(p.paid_at || '').toLocaleDateString()}</td>
                        <td className="px-4 py-4 text-[13px] font-black text-slate-900 uppercase tracking-widest group-hover:text-blue-600 transition-colors">{p.id}</td>
                        <td className="px-4 py-4 text-[12px] font-black text-slate-400 uppercase tracking-widest">{p.invoice_id} / {p.job_order_id}</td>
                        <td className="px-4 py-4 text-[12px] font-black text-slate-600 uppercase tracking-widest">{p.payment_method}</td>
                        <td className="px-4 py-4 text-[11px] font-mono text-slate-400 uppercase tracking-widest">{p.reference_no || '—'}</td>
                        <td className="px-4 py-4 text-[14px] font-black text-blue-600 text-right">+{formatPHP(p.amount_paid || p.amount || 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ACCOUNTS RECEIVABLE REPORT */}
        {activeTab === 'ar' && (
          <div className="space-y-8 animate-in fade-in">
             <div className="flex items-center gap-6 p-6 bg-slate-50 border border-slate-200 rounded-2xl shadow-inner">
               <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg">
                 <DollarSign size={24} />
               </div>
               <div>
                 <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Total Outstanding Accounts Receivable</div>
                 <div className="text-[32px] font-black text-slate-900 leading-none mt-1 tracking-tight">{formatPHP(totalOutstanding)}</div>
               </div>
             </div>

             <div className="overflow-x-auto">
               <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50">
                    <th className="px-4 py-4">Customer</th>
                    <th className="px-4 py-4">Invoice</th>
                    <th className="px-4 py-4">Due Date</th>
                    <th className="px-4 py-4 text-right">Total</th>
                    <th className="px-4 py-4 text-right">Paid</th>
                    <th className="px-4 py-4 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {arInvoices.length === 0 && (
                    <tr><td colSpan={6} className="p-8 text-center text-[11px] font-black text-slate-400 uppercase tracking-widest italic">No outstanding invoices.</td></tr>
                  )}
                  {arInvoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-4 py-4 text-[13px] font-black text-slate-900 uppercase tracking-widest">{inv.customer}</td>
                      <td className="px-4 py-4 text-[12px] font-black text-slate-400 uppercase tracking-widest">{inv.id}</td>
                      <td className="px-4 py-4 text-[12px] font-black text-slate-400 uppercase tracking-widest">{new Date(inv.dueDate).toLocaleDateString()}</td>
                      <td className="px-4 py-4 text-[12px] font-black text-slate-600 text-right uppercase tracking-widest">{formatPHP(inv.total_amount)}</td>
                      <td className="px-4 py-4 text-[12px] font-black text-blue-600 text-right uppercase tracking-widest">{formatPHP(inv.amountPaid)}</td>
                      <td className="px-4 py-4 text-[14px] font-black text-slate-900 text-right tracking-tight">{formatPHP(inv.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
             </div>
          </div>
        )}

        {/* AGING REPORT */}
        {activeTab === 'aging' && (
          <div className="space-y-8 animate-in fade-in">
             <div className="flex items-center gap-6 p-6 bg-rose-50 border border-rose-100 rounded-2xl">
               <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center shadow-md">
                 <AlertCircle size={24} />
               </div>
               <div>
                 <div className="text-[11px] font-black text-rose-600 uppercase tracking-widest">Total Overdue</div>
                 <div className="text-[32px] font-black text-slate-900 leading-none mt-1 tracking-tight">{formatPHP(totalOverdue)}</div>
               </div>
             </div>

             <div className="overflow-x-auto">
               <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50">
                    <th className="px-4 py-4">Customer / Invoice</th>
                    <th className="px-4 py-4">Due Date</th>
                    <th className="px-4 py-4">Days Overdue</th>
                    <th className="px-4 py-4">Aging Bucket</th>
                    <th className="px-4 py-4 text-right">Balance Due</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {overdueInvoices.length === 0 && (
                    <tr><td colSpan={5} className="p-8 text-center text-[11px] font-black text-slate-400 uppercase tracking-widest italic">No overdue invoices.</td></tr>
                  )}
                  {overdueInvoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-4 py-4">
                        <div className="text-[13px] font-black text-slate-900 uppercase tracking-widest">{inv.customer}</div>
                        <div className="text-[11px] text-slate-400 font-black uppercase tracking-widest">{inv.id}</div>
                      </td>
                      <td className="px-4 py-4 text-[12px] font-black text-slate-400 uppercase tracking-widest">{new Date(inv.dueDate).toLocaleDateString()}</td>
                      <td className="px-4 py-4 text-[12px] font-black text-rose-600 uppercase tracking-widest">{inv.agingDays} days</td>
                      <td className="px-4 py-4 text-[11px] font-black text-slate-700 uppercase tracking-widest">
                        <span className="bg-slate-200 px-2 py-1 rounded-md">{inv.agingBucket}</span>
                      </td>
                      <td className="px-4 py-4 text-[14px] font-black text-rose-600 text-right tracking-tight">{formatPHP(inv.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
             </div>
          </div>
        )}

        {/* INVENTORY REPORT */}
        {activeTab === 'inventory' && (
          <div className="space-y-8 animate-in fade-in">
             {lowStockItems.length > 0 && (
               <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl">
                 <h3 className="text-[14px] font-black text-rose-700 flex items-center gap-2 mb-4 uppercase tracking-widest"><AlertCircle size={18}/> Low Stock Alerts</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   {lowStockItems.map(item => (
                     <div key={item.sku} className="bg-white p-4 rounded-xl border border-rose-100 flex items-center justify-between shadow-sm">
                       <div>
                         <div className="text-[13px] font-black text-slate-900 uppercase tracking-widest">{item.item_name}</div>
                         <div className="text-[11px] text-slate-400 font-black uppercase tracking-widest">{item.sku}</div>
                       </div>
                       <div className="text-right">
                         <div className="text-[16px] font-black text-rose-600">{item.computedStock} {item.unit}</div>
                         <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Min: {item.minStock}</div>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             )}

             {/* INVENTORY LOSS SUMMARY */}
             {recentWaste.length > 0 && (
               <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl mt-6 shadow-inner">
                 <h3 className="text-[14px] font-black text-slate-600 flex items-center gap-2 mb-4 uppercase tracking-widest"><AlertCircle size={18}/> Recent Material Waste & Adjustments</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   {recentWaste.slice(0, 3).map(move => {
                     const item = inventory.find(i => i.id === move.inventory_item_id);
                     return (
                       <div key={move.id} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
                         <div>
                           <div className="text-[13px] font-black text-slate-900 uppercase tracking-widest">{item?.item_name || move.inventory_item_id}</div>
                           <div className="text-[11px] text-slate-400 font-black uppercase tracking-widest line-clamp-1">{move.reference_type || 'Manual Adjustment'}</div>
                         </div>
                         <div className="text-right shrink-0">
                           <div className="text-[16px] font-black text-rose-600">-{move.qty}</div>
                           <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{new Date(move.created_at || '').toLocaleDateString()}</div>
                         </div>
                       </div>
                     );
                   })}
                 </div>
               </div>
             )}

             <div className="overflow-x-auto">
               <h3 className="text-[16px] font-black text-slate-900 mb-4 uppercase tracking-widest">Stock Levels (System Stock vs Ledger)</h3>
               <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50">
                    <th className="px-4 py-4">SKU</th>
                    <th className="px-4 py-4">Item Name</th>
                    <th className="px-4 py-4">Category</th>
                    <th className="px-4 py-4 text-right">Unit Cost</th>
                    <th className="px-4 py-4 text-right">System Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {computedInventory.map(item => (
                    <tr key={item.sku} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-4 py-4 text-[12px] font-black text-slate-400 uppercase tracking-widest">{item.sku}</td>
                      <td className="px-4 py-4 text-[13px] font-black text-slate-900 uppercase tracking-widest">{item.item_name}</td>
                      <td className="px-4 py-4 text-[12px] font-black text-slate-400 uppercase tracking-widest">{item.category}</td>
                      <td className="px-4 py-4 text-[12px] font-black text-slate-600 text-right uppercase tracking-widest">{formatPHP(item.unit_cost || 0)}</td>
                      <td className="px-4 py-4 text-[14px] font-black text-right tracking-tight">
                        <span className={item.computedStock <= (item.minStock || 0) ? 'text-rose-600' : 'text-slate-900'}>
                           {item.computedStock} {item.unit}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
             </div>
          </div>
        )}

        {/* ACCOUNTS PAYABLE (AP) REPORT */}
        {activeTab === 'ap' && (
          <div className="space-y-8 animate-in fade-in">
             <div className="flex items-center gap-6 p-6 bg-slate-50 border border-slate-200 rounded-2xl shadow-inner">
               <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg">
                 <ArrowDownRight size={24} />
               </div>
               <div>
                 <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Total Outstanding Accounts Payable</div>
                 <div className="text-[32px] font-black text-slate-900 leading-none tracking-tight">{formatPHP(supplierBills.reduce((sum, b) => sum + (b.balance || 0), 0))}</div>
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div>
                 <h3 className="text-[16px] font-black text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-widest">
                   <FileText size={18} className="text-slate-400" /> Recent Supplier Bills
                 </h3>
                 <div className="space-y-3">
                   {supplierBills.slice(0, 5).map(bill => (
                     <div key={bill.id} className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm flex items-center justify-between group hover:border-slate-900 transition-all">
                       <div>
                         <div className="text-[14px] font-black text-slate-900 uppercase tracking-widest">{bill.supplier_name}</div>
                         <div className="text-[11px] text-slate-400 font-black uppercase tracking-widest">{bill.id} • Due {bill.dueDate}</div>
                       </div>
                       <div className="text-right">
                         <div className="text-[14px] font-black text-slate-900">{formatPHP(bill.amount)}</div>
                         <div className={`text-[10px] font-black uppercase tracking-widest ${bill.balance > 0 ? 'text-blue-600' : 'text-blue-600'}`}>
                           {bill.balance > 0 ? `Bal: ${formatPHP(bill.balance)}` : 'Fully Settled'}
                         </div>
                       </div>
                     </div>
                   ))}
                   {supplierBills.length === 0 && <div className="text-slate-400 text-[11px] font-black uppercase tracking-widest italic p-4 text-center">No supplier bills.</div>}
                 </div>
               </div>

               <div>
                 <h3 className="text-[16px] font-black text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-widest">
                   <ArrowUpRight size={18} className="text-blue-500" /> Settlement Ledger
                 </h3>
                 <div className="space-y-3">
                   {settlements.slice(0, 5).map(set => (
                     <div key={set.id} className="p-4 rounded-xl border border-blue-50 bg-blue-50/30 shadow-sm flex items-center justify-between group hover:border-blue-500 transition-all">
                       <div>
                         <div className="text-[14px] font-black text-slate-900 uppercase tracking-widest">{set.supplier_name}</div>
                         <div className="text-[11px] text-slate-400 font-black uppercase tracking-widest">{set.bill_id} • {set.method}</div>
                       </div>
                       <div className="text-right">
                         <div className="text-[14px] font-black text-blue-600">-{formatPHP(set.amount_paid || set.amount || 0)}</div>
                         <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic">{new Date(set.date || '').toLocaleDateString()}</div>
                       </div>
                     </div>
                   ))}
                   {settlements.length === 0 && <div className="text-slate-400 text-[11px] font-black uppercase tracking-widest italic p-4 text-center">No settlements recorded.</div>}
                 </div>
               </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
}
