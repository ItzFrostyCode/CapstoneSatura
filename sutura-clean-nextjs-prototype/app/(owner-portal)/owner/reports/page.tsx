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
  
  const { payments, invoices, inventory, movements, supplierBills, settlements } = useERPStore();

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

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight leading-none">Reports</h1>
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
                className="text-[12px] font-bold text-slate-900 bg-transparent outline-none"
              />
            </div>
            <div className="w-px h-6 bg-slate-100 mx-2" />
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">To</span>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="text-[12px] font-bold text-slate-900 bg-transparent outline-none"
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
              className="h-11 px-4 bg-white border border-slate-200 rounded-xl text-slate-900 text-[13px] font-black hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
            >
              <Download size={16} /> Export Receipts
            </button>
            <button className="h-11 px-4 bg-slate-900 text-white rounded-xl text-[13px] font-black hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm">
              <Download size={16} /> Export PDF
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap bg-white p-1.5 rounded-full w-max gap-1 border border-slate-200 shadow-sm">
        {reportTabs.map((tab) => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2.5 px-6 py-2.5 rounded-full text-[12px] font-black transition-all uppercase tracking-widest whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
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
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Realized Revenue</div>
                <div className="text-[32px] font-black text-slate-900 leading-none">{formatPHP(totalRevenue)}</div>
                <div className="text-[12px] text-slate-500 mt-2 font-medium">Based on {filteredPayments.length} recorded payments</div>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 col-span-2">
                 <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Revenue by Payment Method</div>
                 <div className="flex items-center gap-8 overflow-x-auto pb-2">
                   {Object.entries(paymentMethods).map(([method, amount]) => (
                     <div key={method} className="shrink-0">
                       <div className="text-[14px] font-bold text-slate-700">{method}</div>
                       <div className="text-[20px] font-black text-emerald-600">{formatPHP(amount)}</div>
                     </div>
                   ))}
                   {Object.keys(paymentMethods).length === 0 && (
                     <div className="text-slate-400 text-[13px] italic font-medium">No revenue recorded for this period.</div>
                   )}
                 </div>
              </div>
            </div>

            <div>
              <h3 className="text-[16px] font-black text-slate-900 mb-4">Payment Ledger</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50">
                      <th className="px-4 py-3 rounded-tl-lg">Date</th>
                      <th className="px-4 py-3">Receipt ID</th>
                      <th className="px-4 py-3">Invoice / Order</th>
                      <th className="px-4 py-3">Method</th>
                      <th className="px-4 py-3">Reference No.</th>
                      <th className="px-4 py-3 text-right rounded-tr-lg">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredPayments.length === 0 && (
                      <tr><td colSpan={6} className="p-8 text-center text-slate-500">No payments found in this date range.</td></tr>
                    )}
                    {filteredPayments.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-[13px] font-medium text-slate-600">{new Date(p.paid_at || '').toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-[13px] font-bold text-slate-900">{p.id}</td>
                        <td className="px-4 py-3 text-[13px] text-slate-500">{p.invoice_id} / {p.job_order_id}</td>
                        <td className="px-4 py-3 text-[13px] font-bold text-slate-600">{p.payment_method}</td>
                        <td className="px-4 py-3 text-[12px] font-mono text-slate-500">{p.reference_no || '—'}</td>
                        <td className="px-4 py-3 text-[14px] font-black text-emerald-600 text-right">+{formatPHP(p.amount_paid || p.amount || 0)}</td>
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
             <div className="flex items-center gap-6 p-6 bg-amber-50 border border-amber-100 rounded-2xl">
               <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                 <DollarSign size={24} />
               </div>
               <div>
                 <div className="text-[12px] font-black text-amber-600 uppercase tracking-widest">Total Outstanding Accounts Receivable</div>
                 <div className="text-[32px] font-black text-slate-900 leading-none mt-1">{formatPHP(totalOutstanding)}</div>
               </div>
             </div>

             <div className="overflow-x-auto">
               <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50">
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Invoice</th>
                    <th className="px-4 py-3">Due Date</th>
                    <th className="px-4 py-3 text-right">Total</th>
                    <th className="px-4 py-3 text-right">Paid</th>
                    <th className="px-4 py-3 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {arInvoices.length === 0 && (
                    <tr><td colSpan={6} className="p-8 text-center text-slate-500">No outstanding invoices.</td></tr>
                  )}
                  {arInvoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-[13px] font-bold text-slate-900">{inv.customer}</td>
                      <td className="px-4 py-3 text-[13px] font-medium text-slate-500">{inv.id}</td>
                      <td className="px-4 py-3 text-[13px] font-medium text-slate-600">{new Date(inv.dueDate).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-[13px] font-medium text-slate-600 text-right">{formatPHP(inv.total_amount)}</td>
                      <td className="px-4 py-3 text-[13px] font-medium text-emerald-600 text-right">{formatPHP(inv.amountPaid)}</td>
                      <td className="px-4 py-3 text-[14px] font-black text-amber-600 text-right">{formatPHP(inv.balance)}</td>
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
               <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center">
                 <AlertCircle size={24} />
               </div>
               <div>
                 <div className="text-[12px] font-black text-rose-600 uppercase tracking-widest">Total Overdue</div>
                 <div className="text-[32px] font-black text-slate-900 leading-none mt-1">{formatPHP(totalOverdue)}</div>
               </div>
             </div>

             <div className="overflow-x-auto">
               <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50">
                    <th className="px-4 py-3">Customer / Invoice</th>
                    <th className="px-4 py-3">Due Date</th>
                    <th className="px-4 py-3">Days Overdue</th>
                    <th className="px-4 py-3">Aging Bucket</th>
                    <th className="px-4 py-3 text-right">Balance Due</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {overdueInvoices.length === 0 && (
                    <tr><td colSpan={5} className="p-8 text-center text-slate-500">No overdue invoices.</td></tr>
                  )}
                  {overdueInvoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="text-[13px] font-bold text-slate-900">{inv.customer}</div>
                        <div className="text-[11px] text-slate-500">{inv.id}</div>
                      </td>
                      <td className="px-4 py-3 text-[13px] font-medium text-slate-600">{new Date(inv.dueDate).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-[13px] font-black text-rose-600">{inv.agingDays} days</td>
                      <td className="px-4 py-3 text-[12px] font-bold text-slate-700">
                        <span className="bg-slate-200 px-2 py-1 rounded-md">{inv.agingBucket}</span>
                      </td>
                      <td className="px-4 py-3 text-[14px] font-black text-rose-600 text-right">{formatPHP(inv.balance)}</td>
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
               <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl">
                 <h3 className="text-[14px] font-black text-rose-700 flex items-center gap-2 mb-4"><AlertCircle size={18}/> Low Stock Alerts</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   {lowStockItems.map(item => (
                     <div key={item.sku} className="bg-white p-4 rounded-xl border border-rose-100 flex items-center justify-between">
                       <div>
                         <div className="text-[13px] font-bold text-slate-900">{item.item_name}</div>
                         <div className="text-[11px] text-slate-500">{item.sku}</div>
                       </div>
                       <div className="text-right">
                         <div className="text-[16px] font-black text-rose-600">{item.computedStock} {item.unit}</div>
                         <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Min: {item.minStock}</div>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             )}

             <div className="overflow-x-auto">
               <h3 className="text-[16px] font-black text-slate-900 mb-4">Stock Levels (Computed from Movements Ledger)</h3>
               <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50">
                    <th className="px-4 py-3">SKU</th>
                    <th className="px-4 py-3">Item Name</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3 text-right">Unit Cost</th>
                    <th className="px-4 py-3 text-right">Computed Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {computedInventory.map(item => (
                    <tr key={item.sku} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-[13px] font-bold text-slate-500">{item.sku}</td>
                      <td className="px-4 py-3 text-[13px] font-bold text-slate-900">{item.item_name}</td>
                      <td className="px-4 py-3 text-[12px] font-medium text-slate-600">{item.category}</td>
                      <td className="px-4 py-3 text-[13px] font-medium text-slate-600 text-right">{formatPHP(item.unit_cost || 0)}</td>
                      <td className="px-4 py-3 text-[14px] font-black text-right">
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
             <div className="flex items-center gap-6 p-6 bg-slate-50 border border-slate-200 rounded-2xl">
               <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                 <ArrowDownRight size={24} />
               </div>
               <div>
                 <div className="text-[12px] font-black text-slate-500 uppercase tracking-widest">Total Outstanding Accounts Payable</div>
                 <div className="text-[32px] font-black text-slate-900 leading-none">{formatPHP(supplierBills.reduce((sum, b) => sum + (b.balance || 0), 0))}</div>
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div>
                 <h3 className="text-[16px] font-black text-slate-900 mb-4 flex items-center gap-2">
                   <FileText size={18} className="text-slate-400" /> Recent Supplier Bills
                 </h3>
                 <div className="space-y-3">
                   {supplierBills.slice(0, 5).map(bill => (
                     <div key={bill.id} className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm flex items-center justify-between">
                       <div>
                         <div className="text-[14px] font-black text-slate-900">{bill.supplier_name}</div>
                         <div className="text-[11px] text-slate-500 font-medium">{bill.id} • Due {bill.dueDate}</div>
                       </div>
                       <div className="text-right">
                         <div className="text-[14px] font-black text-slate-900">{formatPHP(bill.amount)}</div>
                         <div className={`text-[10px] font-bold uppercase ${bill.balance > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                           {bill.balance > 0 ? `Bal: ${formatPHP(bill.balance)}` : 'Fully Settled'}
                         </div>
                       </div>
                     </div>
                   ))}
                   {supplierBills.length === 0 && <div className="text-slate-400 text-[13px] italic p-4 text-center">No supplier bills.</div>}
                 </div>
               </div>

               <div>
                 <h3 className="text-[16px] font-black text-slate-900 mb-4 flex items-center gap-2">
                   <ArrowUpRight size={18} className="text-emerald-500" /> Settlement Ledger
                 </h3>
                 <div className="space-y-3">
                   {settlements.slice(0, 5).map(set => (
                     <div key={set.id} className="p-4 rounded-xl border border-emerald-50 bg-emerald-50/30 shadow-sm flex items-center justify-between">
                       <div>
                         <div className="text-[14px] font-black text-slate-900">{set.supplier_name}</div>
                         <div className="text-[11px] text-slate-500 font-medium">{set.bill_id} • {set.method}</div>
                       </div>
                       <div className="text-right">
                         <div className="text-[14px] font-black text-emerald-600">-{formatPHP(set.amount_paid || set.amount || 0)}</div>
                         <div className="text-[10px] text-slate-400 font-medium italic">{new Date(set.date || '').toLocaleDateString()}</div>
                       </div>
                     </div>
                   ))}
                   {settlements.length === 0 && <div className="text-slate-400 text-[13px] italic p-4 text-center">No settlements recorded.</div>}
                 </div>
               </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
}
