'use client';

import { 
  Search, Plus, MoreVertical, ChevronRight, Filter, 
  CheckCircle2, Clock, AlertCircle, FileText, Activity,
  ArrowUpRight, ArrowDownLeft, X, DollarSign, Download, CreditCard,
  Mail, Calendar, FileCheck
} from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { useERPStore, Invoice, Payment, SupplierBill, Settlement } from '../../store/useERPStore';

interface EnhancedInvoice extends Invoice {
  amountPaid: number;
  balance: number;
  computedTotal: number;
  lineSubtotal: number;
  discountValue: number;
  taxAmount: number;
  computedStatus: string;
  agingDays: number;
  agingBucket: string;
  invPayments: Payment[];
  issueDate: string;
  dueDate: string;
  paidDate?: string;
}

interface EnhancedBill extends SupplierBill {
  paid: number;
}

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState('invoices');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [selectedInvoice, setSelectedInvoice] = useState<EnhancedInvoice | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  const [paymentInvoice, setPaymentInvoice] = useState<EnhancedInvoice | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Payment Form State
  const [paymentAmount, setPaymentAmount] = useState<string | number>('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [paymentRef, setPaymentRef] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [cashReceived, setCashReceived] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentImage, setPaymentImage] = useState<string | null>(null);

  const [selectedBill, setSelectedBill] = useState<EnhancedBill | null>(null);
  const [isSettlementModalOpen, setIsSettlementModalOpen] = useState(false);
  const [settlementAmount, setSettlementAmount] = useState('');
  const [settlementMethod, setSettlementMethod] = useState('Bank Transfer');
  const [settlementRef, setSettlementRef] = useState('');

  const { 
    invoices, 
    payments, 
    recordInvoicePayment,
    supplierBills,
    settlements,
    recordSettlement,
    customers,
    createInvoice
  } = useERPStore();

  // Create Invoice Form State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newInvoiceForm, setNewInvoiceForm] = useState({
    customer_id: '',
    subject: '',
    discount_amount: 0,
    discount_type: 'FLAT' as 'FLAT' | 'PERCENT',
    tax_rate: 0,
    notes: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date().toISOString().split('T')[0],
  });
  const [invoiceItems, setInvoiceItems] = useState([{ description: '', qty: 1, unitPrice: 0 }]);

  // Helper: Normalize old date format if missing
  const normalizeDate = (dateStr: string) => {
    // Basic fallback if issueDate/dueDate are missing, though our migration handled it
    if (!dateStr) return new Date().toISOString().split('T')[0];
    return dateStr;
  };

  const safeFormatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      return dateStr;
    }
  };

  const isDueSoon = (dueDateStr: string) => {
    if (!dueDateStr) return false;
    const d = new Date(dueDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDateMidnight = new Date(d);
    dueDateMidnight.setHours(0, 0, 0, 0);
    
    const diff = dueDateMidnight.getTime() - today.getTime();
    // Return true if due within 3 days (including today)
    return diff >= 0 && diff < 3 * 24 * 60 * 60 * 1000;
  };

  // ✅ ENHANCED INVOICES (FIXED — NO MUTATION, REAL STATUS LOGIC)
const enhancedInvoices: EnhancedInvoice[] = useMemo(() => {
  return invoices.map(inv => {
    const invPayments = payments.filter(p => p.invoice_id === inv.id);
    const amountPaid = invPayments.reduce((sum, p) => sum + p.amount_paid, 0);

    const issueDate = inv.issueDate || inv.date || new Date().toISOString().split('T')[0];
    const dueDate = inv.dueDate || issueDate;
    const today = new Date().toISOString().split('T')[0];

    // --- COMPUTATION ---
    const lineSubtotal = (inv.items || []).reduce((sum, item) => sum + item.total, 0);

    let discountValue = 0;
    if (inv.discount_type === 'PERCENT' && inv.discount_amount) {
      discountValue = lineSubtotal * (inv.discount_amount / 100);
    } else if (inv.discount_type === 'FLAT' && inv.discount_amount) {
      discountValue = inv.discount_amount;
    }

    const taxableAmount = lineSubtotal - discountValue;
    const taxAmount = inv.tax_rate ? taxableAmount * (inv.tax_rate / 100) : 0;

    const computedTotal = taxableAmount + taxAmount;
    const balance = computedTotal - amountPaid;

    // --- STATUS (REAL BUSINESS LOGIC) ---
    let computedStatus = 'Open';

    if (inv.statusSnapshot === 'Draft') {
      computedStatus = 'Draft';
    } else if (amountPaid === 0 && dueDate >= today) {
      computedStatus = 'Unpaid';
    } else if (amountPaid > 0 && amountPaid < computedTotal) {
      computedStatus = dueDate < today ? 'Partially Paid (Overdue)' : 'Partially Paid';
    } else if (amountPaid >= computedTotal) {
      computedStatus = 'Paid';
    } else if (dueDate < today) {
      computedStatus = 'Overdue';
    }

    // --- AGING ---
    let agingDays = 0;
    let agingBucket = 'Current';

    if (dueDate < today && balance > 0) {
      agingDays = Math.ceil(
        (new Date(today).getTime() - new Date(dueDate).getTime()) /
        (1000 * 60 * 60 * 24)
      );

      if (agingDays > 90) agingBucket = '91+ Days';
      else if (agingDays > 60) agingBucket = '61-90 Days';
      else if (agingDays > 30) agingBucket = '31-60 Days';
      else if (agingDays > 0) agingBucket = '1-30 Days';
    }

    return {
      ...inv,
      amountPaid,
      balance,
      computedTotal,
      lineSubtotal,
      discountValue,
      taxAmount,
      computedStatus,
      issueDate,
      dueDate,
      paidDate: (amountPaid >= computedTotal && invPayments.length > 0) 
        ? invPayments.sort((a, b) => new Date(b.paid_at).getTime() - new Date(a.paid_at).getTime())[0].paid_at 
        : undefined,
      agingDays,
      agingBucket,
      invPayments
    };
  });
}, [invoices, payments]);

  const enhancedBills = useMemo(() => {
  return supplierBills.map(bill => {
    const billPayments = settlements.filter(s => s.bill_id === bill.id);
    const paid = billPayments.reduce((sum, s) => sum + s.amount_paid, 0);
    const balance = bill.amount - paid;

    let status: 'Paid' | 'Partial' | 'Unpaid' = 'Unpaid';
    if (paid === 0) status = 'Unpaid';
    else if (paid < bill.amount) status = 'Partial';
    else status = 'Paid';

    return {
      ...bill,
      paid,
      balance,
      status
    };
  });
}, [supplierBills, settlements]);

  const filteredInvoices = enhancedInvoices.filter(inv => 
    inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBills = enhancedBills.filter(bill => 
    bill.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bill.supplier_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSettlements = settlements.filter(set => 
    set.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    set.supplier_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    set.bill_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // KPI Calculations
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount_paid, 0);
  const outstanding = enhancedInvoices
    .filter(i => i.computedStatus !== 'Draft' && i.computedStatus !== 'Paid')
    .reduce((sum, i) => sum + i.balance, 0);
    
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const paidThisMonth = payments.filter(p => {
    const d = new Date(p.paid_at);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).reduce((sum, p) => sum + p.amount_paid, 0);
  
  const drafted = enhancedInvoices.filter(i => i.computedStatus === 'Draft').reduce((sum, i) => sum + i.total_amount, 0);

  const formatPHP = (num: number) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(num);

  const stats = [
  { label: "Cash Collected", val: formatPHP(totalRevenue), trend: "Cash In", color: "indigo" },
  { label: "Outstanding AR", val: formatPHP(outstanding), trend: "Unpaid Balance", color: "amber" },
  { label: "Paid This Month", val: formatPHP(paidThisMonth), trend: "Current Period", color: "emerald" },
  { label: "Drafted", val: formatPHP(drafted), trend: "Pending Approval", color: "sky" },
];

 const handlePaymentSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!paymentInvoice) return;

  const amount = parseFloat(String(paymentAmount));

  if (isNaN(amount) || amount <= 0) {
    alert("Invalid amount");
    return;
  }

  if (amount > paymentInvoice.balance) {
    alert("Payment exceeds remaining balance");
    return;
  }

  recordInvoicePayment(
    paymentInvoice.id,
    amount,
    paymentMethod,
    "STF-001",
    paymentRef,
    paymentNotes,
    paymentImage || undefined,
    paymentDate
  );

  setIsPaymentModalOpen(false);
  setPaymentInvoice(null);
  setPaymentAmount('');
  setPaymentRef('');
  setPaymentNotes('');
  setCashReceived('');
  setPaymentImage(null);
};

  const handleSettlementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBill) return;
    const amount = parseFloat(settlementAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Invalid amount");
      return;
    }
    recordSettlement(selectedBill.id, amount, settlementMethod, "STF-001", settlementRef);
    setIsSettlementModalOpen(false);
    setSelectedBill(null);
    setSettlementAmount('');
    setSettlementRef('');
  };

  const handleCreateInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvoiceForm.customer_id) {
      alert("Please select a customer");
      return;
    }

    const customer = customers.find(c => c.id === newInvoiceForm.customer_id);
    if (!customer) return;

    const items = invoiceItems.map(item => ({
      ...item,
      total: item.qty * item.unitPrice
    }));

    const lineSubtotal = items.reduce((sum, item) => sum + item.total, 0);
    
    let discountValue = 0;
    if (newInvoiceForm.discount_type === 'PERCENT') {
      discountValue = lineSubtotal * (newInvoiceForm.discount_amount / 100);
    } else {
      discountValue = newInvoiceForm.discount_amount;
    }

    const taxableAmount = lineSubtotal - discountValue;
    const taxAmount = taxableAmount * (newInvoiceForm.tax_rate / 100);
    const total_amount = taxableAmount + taxAmount;

    createInvoice({
      order_id: `ORD-GEN-${Date.now().toString().slice(-4)}`,
      customer_id: customer.id,
      customer: customer.name,
      email: customer.email,
      issueDate: newInvoiceForm.issueDate,
      dueDate: newInvoiceForm.dueDate,
      total_amount,
      discount_amount: newInvoiceForm.discount_amount,
      discount_type: newInvoiceForm.discount_type,
      tax_rate: newInvoiceForm.tax_rate,
      notes: newInvoiceForm.notes,
      subject: newInvoiceForm.subject || "General Invoice",
      items,
      statusSnapshot: 'Open'
    });

    setIsCreateModalOpen(false);
    setNewInvoiceForm({
      customer_id: '',
      subject: '',
      discount_amount: 0,
      discount_type: 'FLAT',
      tax_rate: 0,
      notes: '',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date().toISOString().split('T')[0],
    });
    setInvoiceItems([{ description: '', qty: 1, unitPrice: 0 }]);
  };

  const handlePrintInvoice = () => {
    if (!selectedInvoice) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const inv = selectedInvoice;
    
    const itemsHtml = (inv.items || []).map((i) => 
      "<tr>" +
        "<td>" + i.description + "</td>" +
        "<td class='text-center'>" + i.qty + "</td>" +
        "<td class='text-right'>" + formatPHP(i.unitPrice) + "</td>" +
        "<td class='text-right'>" + formatPHP(i.total) + "</td>" +
      "</tr>"
    ).join('');

    const discountHtml = inv.discountValue > 0 
      ? "<div class='total-row'>" +
          "<span>Discount (" + (inv.discount_type === 'PERCENT' ? inv.discount_amount + '%' : 'Flat') + ")</span>" +
          "<span>-" + formatPHP(inv.discountValue) + "</span>" +
        "</div>"
      : "";

    const taxHtml = inv.taxAmount > 0 
      ? "<div class='total-row'>" +
          "<span>Tax (" + inv.tax_rate + "%)</span>" +
          "<span>" + formatPHP(inv.taxAmount) + "</span>" +
        "</div>"
      : "";

    const notesHtml = inv.notes 
      ? "<div class='notes'><strong>Notes:</strong><br/>" + inv.notes + "</div>" 
      : "";

    const html = `
      <html>
        <head>
          <title>Invoice ${inv.id}</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; padding: 40px; margin: 0 auto; max-width: 800px; }
            .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .business-info h1 { margin: 0; font-size: 24px; letter-spacing: 1px; }
            .business-info p { margin: 5px 0; color: #666; font-size: 14px; }
            .invoice-details { text-align: right; }
            .invoice-details h2 { margin: 0 0 10px 0; font-size: 28px; color: #111; }
            .invoice-details p { margin: 5px 0; font-size: 14px; color: #555; }
            .customer-info { margin-bottom: 40px; }
            .customer-info h3 { margin: 0 0 5px 0; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
            .customer-info p { margin: 2px 0; font-size: 15px; font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { text-align: left; padding: 12px; border-bottom: 2px solid #ddd; font-size: 12px; text-transform: uppercase; color: #666; }
            td { padding: 12px; border-bottom: 1px solid #eee; font-size: 14px; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .totals-container { display: flex; justify-content: flex-end; }
            .totals { width: 300px; }
            .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
            .total-row.grand-total { font-weight: bold; font-size: 18px; border-top: 2px solid #333; padding-top: 12px; margin-top: 5px; }
            .total-row.balance { font-weight: bold; color: #d97706; }
            .notes { margin-top: 50px; font-size: 13px; color: #666; padding: 15px; background: #f9f9f9; border-left: 4px solid #333; }
            @media print {
              body { padding: 0; }
              @page { margin: 1cm; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="business-info">
              <h1>SUTURA</h1>
              <p>Tailoring Management System</p>
              <p>123 Fashion Ave, Manila, Philippines</p>
            </div>
            <div class="invoice-details">
              <h2>INVOICE</h2>
              <p><strong>Invoice #:</strong> ${inv.id}</p>
              <p><strong>Date Issued:</strong> ${safeFormatDate(inv.issueDate)}</p>
              <p><strong>Due Date:</strong> ${safeFormatDate(inv.dueDate)}</p>
            </div>
          </div>
          
          <div class="customer-info">
            <h3>Bill To</h3>
            <p>${inv.customer}</p>
            <p style="font-weight: normal; color: #555;">${inv.email}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th class="text-center">Qty</th>
                <th class="text-right">Unit Price</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="totals-container">
            <div class="totals">
              <div class="total-row">
                <span>Subtotal</span>
                <span>${formatPHP(inv.lineSubtotal)}</span>
              </div>
              ${discountHtml}
              ${taxHtml}
              <div class="total-row grand-total">
                <span>Total Amount</span>
                <span>${formatPHP(inv.total_amount)}</span>
              </div>
              <div class="total-row">
                <span>Amount Paid</span>
                <span>-${formatPHP(inv.amountPaid)}</span>
              </div>
              <div class="total-row balance">
                <span>Balance Due</span>
                <span>${formatPHP(inv.balance)}</span>
              </div>
            </div>
          </div>
          
          ${notesHtml}
          
          <script>
            window.onload = () => { window.print(); }
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const handlePrintAgingReport = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Filter for outstanding invoices only
    const outstanding = enhancedInvoices.filter(inv => inv.balance > 0);
    
    const tableRows = outstanding.map(inv => `
      <tr>
        <td>${inv.id}</td>
        <td>${inv.customer}</td>
        <td>${safeFormatDate(inv.dueDate)}</td>
        <td style="text-align: right;">${formatPHP(inv.total_amount)}</td>
        <td style="text-align: right;">${formatPHP(inv.balance)}</td>
        <td style="text-align: center;">${inv.agingDays > 0 ? inv.agingDays + ' days' : 'Current'}</td>
        <td style="text-align: right; font-weight: bold;">${inv.agingBucket}</td>
      </tr>
    `).join('');

    const html = `
      <html>
        <head>
          <title>Accounts Receivable Aging Report - ${new Date().toLocaleDateString()}</title>
          <style>
            body { font-family: serif; color: black; padding: 20px; font-size: 12pt; }
            h1 { text-align: center; margin-bottom: 5px; text-transform: uppercase; }
            .subtitle { text-align: center; margin-bottom: 30px; font-size: 10pt; border-bottom: 1px solid black; padding-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { border-bottom: 2px solid black; padding: 8px; text-align: left; font-size: 10pt; text-transform: uppercase; }
            td { border-bottom: 1px solid #ddd; padding: 8px; font-size: 10pt; }
            .total-section { margin-top: 30px; border-top: 2px solid black; padding-top: 10px; }
            .summary-row { display: flex; justify-content: space-between; margin-bottom: 5px; font-weight: bold; }
            @media print { @page { margin: 1.5cm; } }
          </style>
        </head>
        <body>
          <h1>SUTURA - AR Aging Report</h1>
          <div class="subtitle">Generated on ${new Date().toLocaleString()} | Accounts Receivable Audit</div>
          
          <table>
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Customer</th>
                <th>Due Date</th>
                <th style="text-align: right;">Total Amount</th>
                <th style="text-align: right;">Balance</th>
                <th style="text-align: center;">Days Overdue</th>
                <th style="text-align: right;">Aging</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows || '<tr><td colspan="7" style="text-align: center; padding: 40px;">No outstanding balances.</td></tr>'}
            </tbody>
          </table>

          <div class="total-section">
            <div class="summary-row">
              <span>Total Accounts Receivable:</span>
              <span>${formatPHP(outstanding.reduce((sum, inv) => sum + inv.balance, 0))}</span>
            </div>
            <div class="summary-row" style="font-size: 9pt; font-weight: normal; margin-top: 20px;">
              <span>Certified Correct: __________________________</span>
              <span>Date: ________________</span>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight leading-none">Billing</h1>
          <p className="text-[14px] text-slate-500 font-medium mt-1">Manage sales invoices, supplier bills, and settlements.</p>
        </div>
        
        {/* ── HEADER ACTIONS ── */}
        <div className="flex items-center gap-3">
        <button 
          onClick={handlePrintAgingReport}
          className="bg-white text-slate-600 h-11 px-5 rounded-xl text-[13px] font-bold border border-slate-200 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
        >
          <FileText size={16} /> Export Aging Report
        </button>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-slate-900 text-white h-11 px-6 rounded-xl text-[13px] font-black hover:bg-indigo-600 transition-all shadow-lg shadow-slate-900/10 flex items-center gap-2"
        >
          <Plus size={18} /> Create Invoice
        </button>
      </div>
    </div>
      {/* ── KPI GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[12px] font-bold text-slate-500">{stat.label}</span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
                {stat.trend}
              </span>
            </div>
            <div className="text-[28px] font-black text-slate-900 tracking-tight">{stat.val}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Navigation & Search */}
        <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/50 backdrop-blur-sm">
          <div className="flex flex-wrap bg-slate-100/80 p-1.5 rounded-full w-max gap-1 border border-slate-200/50">
            {[
              { id: 'invoices', name: 'Sales Invoices', icon: <ArrowUpRight size={14} /> },
              { id: 'bills', name: 'Supplier Bills', icon: <ArrowDownLeft size={14} /> },
              { id: 'settlements', name: 'Settlements', icon: <Activity size={14} /> },
            ].map((tab) => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-6 py-2.5 rounded-full text-[12px] font-black transition-all uppercase tracking-widest whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-white text-slate-900 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] border border-slate-200/50' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                {tab.icon} {tab.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 flex-1 md:max-w-md">
            <div className="relative group flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${activeTab}...`} 
                className="h-11 w-full pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium outline-none focus:bg-white focus:border-slate-900 transition-all shadow-sm"
              />
            </div>
            <button className="h-11 w-11 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors shadow-sm">
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* The Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              {activeTab === 'invoices' && (
                <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                  <th className="px-6 py-4">Invoice #</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Financials</th>
                  <th className="px-6 py-4">Timeline</th>
                  <th className="px-6 py-4">Status & Risk</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              )}
              {activeTab === 'bills' && (
                <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                  <th className="px-6 py-4">Bill #</th>
                  <th className="px-6 py-4">Supplier</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Timeline</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              )}
              {activeTab === 'settlements' && (
                <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                  <th className="px-6 py-4">Settlement #</th>
                  <th className="px-6 py-4">Bill Ref</th>
                  <th className="px-6 py-4">Supplier</th>
                  <th className="px-6 py-4">Amount Paid</th>
                  <th className="px-6 py-4">Date & Method</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-slate-50">
              {activeTab === 'invoices' && filteredInvoices.map((inv, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-all group border-b border-slate-50 last:border-0">
                  <td className="px-6 py-5 align-top">
                    <div>
                      <div className="text-[14px] font-black text-slate-900 tracking-tight leading-none mb-1">{inv.id}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{inv.subject}</div>
                    </div>
                  </td>
                  <td className="px-6 py-5 align-top">
                    <div>
                      <div className="text-[14px] font-black text-slate-900 leading-none mb-1">{inv.customer}</div>
                      <div className="text-[11px] text-slate-500 font-medium">{inv.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-5 align-top">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between w-32">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Total:</span>
                        <span className="text-[13px] font-black text-slate-900">{formatPHP(inv.total_amount)}</span>
                      </div>
                      <div className="flex items-center justify-between w-32">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Balance:</span>
                        <span className={`text-[13px] font-black ${inv.balance > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {formatPHP(inv.balance)}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 align-top">
                     <div className="flex flex-col gap-1">
                      <div className="text-[12px] font-medium text-slate-600"><span className="text-slate-400 mr-1">Issued:</span>{safeFormatDate(inv.issueDate)}</div>
                      <div className="text-[12px] font-bold text-slate-800"><span className="text-slate-400 font-medium mr-1">Due:</span>{safeFormatDate(inv.dueDate)}</div>
                    </div>
                  </td>
                  <td className="px-6 py-5 align-top">
                    <div className="flex flex-col items-start gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                        inv.computedStatus === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        inv.computedStatus.includes('Overdue') || inv.computedStatus === 'Overdue' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                        inv.computedStatus === 'Draft' ? 'bg-slate-50 text-slate-500 border-slate-200' :
                        inv.computedStatus === 'Partially Paid' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        'bg-blue-50 text-blue-600 border-blue-100'
                      }`}>
                        {inv.computedStatus === 'Paid' ? <CheckCircle2 size={12} /> : 
                         inv.computedStatus.includes('Overdue') || inv.computedStatus === 'Overdue' ? <AlertCircle size={12} /> : 
                         inv.computedStatus === 'Draft' ? <FileText size={12} /> : 
                         <Clock size={12} />}
                        {inv.computedStatus}
                      </span>
                      {inv.computedStatus === 'Paid' && inv.paidDate && (
                        <div className="text-[10px] font-bold text-emerald-600 uppercase flex items-center gap-1">
                          <FileCheck size={10} /> Paid on {safeFormatDate(inv.paidDate)}
                          {new Date(inv.paidDate).getTime() > new Date(inv.dueDate).getTime() + 86400000 && (
                            <span className="text-amber-500 ml-1 lowercase font-medium italic">(late)</span>
                          )}
                        </div>
                      )}
                      {(inv.computedStatus.includes('Overdue') || inv.computedStatus === 'Overdue') && (
                        <div className="text-[10px] font-bold text-rose-500 uppercase flex items-center gap-1">
                          <AlertCircle size={10} /> Overdue by {inv.agingDays} days
                        </div>
                      )}
                      {(inv.computedStatus === 'Unpaid' || inv.computedStatus === 'Partially Paid') && (
                        <div className="flex items-center gap-1.5">
                          <div className={`w-2 h-2 rounded-full ${
                             isDueSoon(inv.dueDate) ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
                          }`}></div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase">
                            {isDueSoon(inv.dueDate) ? 'Due Soon' : 'On Track'}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right align-top">
                    <div className="flex items-center justify-end gap-2">
                      {inv.computedStatus !== 'Paid' && inv.computedStatus !== 'Draft' && (
                        <button 
                          onClick={() => { 
                            setPaymentInvoice(inv); 
                            setPaymentAmount(inv.balance);
                            setIsPaymentModalOpen(true); 
                          }}
                          className="h-8 px-3 rounded-md bg-indigo-50 text-indigo-600 text-[11px] font-bold hover:bg-indigo-100 transition-all"
                        >
                          Pay
                        </button>
                      )}
                      <button 
                        onClick={() => { setSelectedInvoice(inv); setIsDetailModalOpen(true); }}
                        className="h-8 px-3 rounded-md bg-slate-100 text-slate-600 text-[11px] font-bold hover:bg-slate-200 transition-all"
                      >
                        View
                      </button>
                      <button className="h-8 w-8 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                        <MoreVertical size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {activeTab === 'bills' && filteredBills.map((bill, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-all group border-b border-slate-50 last:border-0">
                  <td className="px-6 py-5 font-black text-slate-900">{bill.id}</td>
                  <td className="px-6 py-5">
                    <div className="font-black text-slate-900">{bill.supplier_name}</div>
                    <div className="text-[11px] text-slate-500">{bill.supplier_id}</div>
                  </td>
                  <td className="px-6 py-5 font-black text-slate-900">{formatPHP(bill.amount)}</td>
                  <td className="px-6 py-5">
                    <div className="text-[12px] text-slate-600"><span className="text-slate-400 mr-1">Bill:</span>{bill.bill_date}</div>
                    <div className="text-[12px] font-bold text-slate-800"><span className="text-slate-400 font-medium mr-1">Due:</span>{bill.due_date}</div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${
                      bill.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      bill.status === 'Partial' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      'bg-rose-50 text-rose-600 border-rose-100'
                    }`}>
                      {bill.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button 
                      onClick={() => { setSelectedBill(bill); setIsSettlementModalOpen(true); }}
                      className="h-8 px-3 rounded-md bg-indigo-50 text-indigo-600 text-[11px] font-bold hover:bg-indigo-100 transition-all"
                    >
                      Record Payment
                    </button>
                  </td>
                </tr>
              ))}

              {activeTab === 'settlements' && filteredSettlements.map((set, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-all group border-b border-slate-50 last:border-0">
                  <td className="px-6 py-5 font-black text-slate-900">{set.id}</td>
                  <td className="px-6 py-5 font-bold text-indigo-600">{set.bill_id}</td>
                  <td className="px-6 py-5 font-bold text-slate-900">{set.supplier_name}</td>
                  <td className="px-6 py-5 font-black text-emerald-600">+{formatPHP(set.amount_paid)}</td>
                  <td className="px-6 py-5">
                    <div className="text-[12px] font-bold text-slate-900">{set.method}</div>
                    <div className="text-[11px] text-slate-500">{new Date(set.paid_at).toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="h-8 w-8 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-400"><MoreVertical size={14}/></button>
                  </td>
                </tr>
              ))}

              {(activeTab === 'invoices' && filteredInvoices.length === 0) ||
               (activeTab === 'bills' && filteredBills.length === 0) ||
               (activeTab === 'settlements' && filteredSettlements.length === 0) ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <Search size={32} className="opacity-20" />
                      <p className="text-[14px] font-bold">No results found in {activeTab}</p>
                    </div>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[12px] text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-900">
              {activeTab === 'invoices' ? filteredInvoices.length : activeTab === 'bills' ? filteredBills.length : filteredSettlements.length}
            </span> records
          </p>
          <div className="flex items-center gap-2">
            <button className="h-9 px-4 rounded-lg bg-white border border-slate-200 text-[12px] font-bold text-slate-400 cursor-not-allowed">Previous</button>
            <button className="h-9 px-4 rounded-lg bg-white border border-slate-200 text-[12px] font-bold text-slate-900 hover:bg-slate-50 transition-colors">Next <ChevronRight size={14} className="inline ml-1"/></button>
          </div>
        </div>
      </div>

      {/* ── INVOICE DETAIL MODAL ── */}
      {isDetailModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <FileCheck size={24} />
                </div>
                <div>
                  <h2 className="text-[20px] font-black text-slate-900 leading-none">Invoice {selectedInvoice.id}</h2>
                  <p className="text-[13px] text-slate-500 font-medium mt-1">{selectedInvoice.customer}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-md text-[11px] font-black uppercase tracking-widest ${
                  selectedInvoice.computedStatus === 'Paid' ? 'bg-emerald-50 text-emerald-600' :
                  selectedInvoice.computedStatus === 'Past Due' ? 'bg-rose-50 text-rose-600' :
                  'bg-blue-50 text-blue-600'
                }`}>
                  {selectedInvoice.computedStatus}
                </span>
                <button onClick={() => setIsDetailModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors text-slate-500">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-8 flex-1">
              
              {/* Info Row */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Issue Date</div>
                  <div className="text-[14px] font-black text-slate-900">{new Date(selectedInvoice.issueDate || '').toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Due Date</div>
                  <div className="text-[14px] font-black text-slate-900">{new Date(selectedInvoice.dueDate || '').toLocaleDateString()}</div>
                  {selectedInvoice.agingDays > 0 && (
                    <div className="text-[11px] font-bold text-rose-500 mt-1">{`Overdue by ${selectedInvoice.agingDays} days`}</div>
                  )}
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status Snapshot</div>
                  <div className="text-[14px] font-medium text-slate-600">{selectedInvoice.statusSnapshot || 'N/A'} (Audit)</div>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <h3 className="text-[14px] font-black text-slate-900 mb-3 border-b border-slate-100 pb-2">Line Items</h3>
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-2">Description</th>
                      <th className="py-2 text-center">Qty</th>
                      <th className="py-2 text-right">Unit Price</th>
                      <th className="py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {selectedInvoice.items?.map((item, idx) => (
                      <tr key={idx} className="text-[13px] font-medium text-slate-700">
                        <td className="py-3">{item.description}</td>
                        <td className="py-3 text-center">{item.qty}</td>
                        <td className="py-3 text-right">{formatPHP(item.unitPrice)}</td>
                        <td className="py-3 text-right font-black text-slate-900">{formatPHP(item.total)}</td>
                      </tr>
                    ))}
                    {!selectedInvoice.items?.length && (
                      <tr><td colSpan={4} className="py-4 text-center text-slate-400 text-sm">No line items available.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Financial Breakdown */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 flex flex-col items-end gap-2 w-full md:w-1/2 ml-auto">
                <div className="flex justify-between w-full text-[13px]">
                  <span className="text-slate-500 font-medium">Subtotal</span>
                  <span className="font-bold text-slate-700">{formatPHP(selectedInvoice.lineSubtotal || selectedInvoice.total_amount)}</span>
                </div>
                {(selectedInvoice.discountValue > 0) && (
                  <div className="flex justify-between w-full text-[13px]">
                    <span className="text-slate-500 font-medium">Discount ({selectedInvoice.discount_type === 'PERCENT' ? `${selectedInvoice.discount_amount}%` : 'Flat'})</span>
                    <span className="font-bold text-rose-600">-{formatPHP(selectedInvoice.discountValue)}</span>
                  </div>
                )}
                {(selectedInvoice.taxAmount > 0) && (
                  <div className="flex justify-between w-full text-[13px]">
                    <span className="text-slate-500 font-medium">Tax ({selectedInvoice.tax_rate}%)</span>
                    <span className="font-bold text-slate-700">{formatPHP(selectedInvoice.taxAmount)}</span>
                  </div>
                )}
                <div className="w-full h-px bg-slate-200 my-1"></div>
                <div className="flex justify-between w-full text-[16px]">
                  <span className="text-slate-900 font-black">Total</span>
                  <span className="font-black text-slate-900">{formatPHP(selectedInvoice.total_amount)}</span>
                </div>
                <div className="flex justify-between w-full text-[14px]">
                  <span className="text-emerald-600 font-medium">Amount Paid</span>
                  <span className="font-bold text-emerald-600">-{formatPHP(selectedInvoice.amountPaid)}</span>
                </div>
                <div className="w-full h-px bg-slate-200 my-1"></div>
                <div className="flex justify-between w-full text-[18px]">
                  <span className="text-slate-900 font-black">Balance Due</span>
                  <span className={`font-black ${selectedInvoice.balance > 0 ? 'text-amber-600' : 'text-slate-900'}`}>{formatPHP(selectedInvoice.balance)}</span>
                </div>
              </div>

              {/* Payment History */}
              <div>
                <h3 className="text-[14px] font-black text-slate-900 mb-3 border-b border-slate-100 pb-2">Payment Ledger</h3>
                {selectedInvoice.invPayments?.length > 0 ? (
                  <div className="space-y-3">
                    {selectedInvoice.invPayments.map((p) => (
                      <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-white">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center"><DollarSign size={14}/></div>
                          <div>
                            <div className="text-[13px] font-bold text-slate-900">{p.payment_method} <span className="text-slate-400 font-medium ml-1">({p.id})</span></div>
                            <div className="text-[11px] text-slate-500">{new Date(p.paid_at).toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="text-[14px] font-black text-emerald-600">+{formatPHP(p.amount_paid)}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[13px] text-slate-500 italic">No payments recorded for this invoice yet.</p>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <button onClick={handlePrintInvoice} className="flex items-center gap-2 text-[13px] font-bold text-slate-600 hover:text-slate-900 transition-colors">
                <Download size={16} /> Print Invoice
              </button>
              <div className="flex gap-3">
                <button onClick={() => setIsDetailModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-[13px] font-bold hover:bg-slate-50 transition-all">
                  Close
                </button>
                {selectedInvoice.balance > 0 && (
                  <button 
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      setPaymentInvoice(selectedInvoice);
                      setPaymentAmount(selectedInvoice.balance);
                      setIsPaymentModalOpen(true);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-[13px] font-black hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20"
                  >
                    Record Payment
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── RECORD PAYMENT MODAL ── */}
      {isPaymentModalOpen && paymentInvoice && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col border border-slate-200">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-[18px] font-black text-slate-900 leading-none">Record Payment</h2>
              <button onClick={() => setIsPaymentModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-500">
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handlePaymentSubmit} className="p-6 space-y-5">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-2">
                <div className="flex justify-between text-[13px] mb-1">
                  <span className="text-slate-500">Invoice</span>
                  <span className="font-bold text-slate-900">{paymentInvoice.id}</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-slate-500">Remaining Balance</span>
                  <span className="font-black text-amber-600">{formatPHP(paymentInvoice.balance)}</span>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-2">Payment Amount (₱)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-slate-400 font-medium">₱</span>
                  </div>
                  <input 
                    type="number" 
                    step="0.01"
                    max={paymentInvoice.balance}
                    required
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-[14px] font-black focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-2">Payment Method</label>
                <select 
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-[14px] font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                >
                  <option value="Cash">Cash</option>
                  <option value="GCash">GCash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Credit Card">Credit Card</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-2">Reference Number <span className="font-normal text-slate-400">(Optional)</span></label>
                <input 
                  type="text" 
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-[14px] font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                  placeholder="e.g. TXN-987654321"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-2 uppercase tracking-widest">Payment Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="date" 
                    required
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-[14px] font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-2">Notes <span className="font-normal text-slate-400">(Optional)</span></label>
                <textarea 
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-[14px] font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none resize-none"
                  placeholder="Additional payment details..."
                  rows={2}
                />
              </div>

              {(paymentMethod === 'GCash' || paymentMethod === 'Bank Transfer') && (
                <div className="space-y-3 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                  <label className="block text-[12px] font-bold text-indigo-900">Proof of Payment (Receipt Photo)</label>
                  <div className="relative group">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Mocking image upload as a base64 string for the prototype
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setPaymentImage(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="h-20 border-2 border-dashed border-indigo-200 rounded-lg flex flex-col items-center justify-center bg-white group-hover:border-indigo-400 transition-all">
                      {paymentImage ? (
                        <div className="flex items-center gap-3">
                          <img src={paymentImage} alt="Receipt" className="w-12 h-12 object-cover rounded shadow-sm" />
                          <span className="text-[11px] font-bold text-indigo-600">Receipt Attached</span>
                        </div>
                      ) : (
                        <>
                          <ArrowUpRight size={20} className="text-indigo-400 mb-1" />
                          <span className="text-[11px] font-bold text-slate-500">Tap to upload receipt image</span>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 italic leading-tight">For GCash/Bank transfers, you can optionally provide a reference number or a picture of the receipt.</p>
                </div>
              )}

              <div className="pt-2">
                <button type="submit" className="w-full py-3.5 rounded-xl bg-indigo-600 text-white text-[14px] font-black hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20">
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── RECORD SETTLEMENT MODAL ── */}
      {isSettlementModalOpen && selectedBill && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col border border-slate-200">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-[18px] font-black text-slate-900 leading-none">Record Settlement</h2>
              <button onClick={() => setIsSettlementModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors text-slate-500">
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSettlementSubmit} className="p-6 space-y-5">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-2">
                <div className="flex justify-between text-[13px] mb-1">
                  <span className="text-slate-500 font-medium">Bill Reference</span>
                  <span className="font-bold text-slate-900">{selectedBill.id}</span>
                </div>
                <div className="flex justify-between text-[13px] mb-1">
                  <span className="text-slate-500 font-medium">Supplier</span>
                  <span className="font-bold text-slate-900">{selectedBill.supplier_name}</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-slate-500 font-medium">Remaining Balance</span>
                  <span className="font-black text-rose-600">{formatPHP(selectedBill.balance)}</span>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-2 uppercase tracking-widest">Settlement Amount (₱)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-slate-400 font-medium">₱</span>
                  </div>
                  <input 
                    type="number" 
                    step="0.01"
                    max={selectedBill.balance}
                    required
                    value={settlementAmount}
                    onChange={(e) => setSettlementAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-[14px] font-black focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none shadow-sm"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-2 uppercase tracking-widest">Payment Method</label>
                <select 
                  value={settlementMethod}
                  onChange={(e) => setSettlementMethod(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-[14px] font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none shadow-sm"
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                  <option value="Check">Check</option>
                  <option value="GCash">GCash</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-2 uppercase tracking-widest">Reference No.</label>
                <input 
                  type="text" 
                  value={settlementRef}
                  onChange={(e) => setSettlementRef(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-[14px] font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none shadow-sm"
                  placeholder="e.g. OR#12345, BANK-TR-999"
                />
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full py-4 rounded-xl bg-slate-900 text-white text-[14px] font-black hover:bg-indigo-600 transition-all shadow-lg shadow-slate-900/10">
                  Confirm Settlement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ── CREATE INVOICE MODAL ── */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                  <Plus size={20} />
                </div>
                <h2 className="text-[18px] font-black text-slate-900">Create New Invoice</h2>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors text-slate-500">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateInvoiceSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Customer</label>
                  <select 
                    required
                    value={newInvoiceForm.customer_id}
                    onChange={(e) => setNewInvoiceForm({...newInvoiceForm, customer_id: e.target.value})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold outline-none focus:bg-white focus:border-slate-900 transition-all"
                  >
                    <option value="">Select Customer</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Subject</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Wedding Suit Deposit"
                    value={newInvoiceForm.subject}
                    onChange={(e) => setNewInvoiceForm({...newInvoiceForm, subject: e.target.value})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold outline-none focus:bg-white focus:border-slate-900 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Issue Date</label>
                  <input 
                    type="date"
                    required
                    value={newInvoiceForm.issueDate}
                    onChange={(e) => setNewInvoiceForm({...newInvoiceForm, issueDate: e.target.value})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold outline-none focus:bg-white focus:border-slate-900 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Due Date</label>
                  <input 
                    type="date"
                    required
                    value={newInvoiceForm.dueDate}
                    onChange={(e) => setNewInvoiceForm({...newInvoiceForm, dueDate: e.target.value})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold outline-none focus:bg-white focus:border-slate-900 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Items</label>
                  <button 
                    type="button"
                    onClick={() => setInvoiceItems([...invoiceItems, { description: '', qty: 1, unitPrice: 0 }])}
                    className="text-[11px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest flex items-center gap-1"
                  >
                    <Plus size={12} /> Add Item
                  </button>
                </div>
                
                {invoiceItems.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-3 items-end bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="col-span-6 space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Description</label>
                      <input 
                        type="text"
                        required
                        placeholder="Service/Product name"
                        value={item.description}
                        onChange={(e) => {
                          const newItems = [...invoiceItems];
                          newItems[idx].description = e.target.value;
                          setInvoiceItems(newItems);
                        }}
                        className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-[13px] font-bold outline-none focus:border-slate-900 transition-all"
                      />
                    </div>
                    <div className="col-span-2 space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Qty</label>
                      <input 
                        type="number"
                        required
                        min="1"
                        value={item.qty}
                        onChange={(e) => {
                          const newItems = [...invoiceItems];
                          newItems[idx].qty = parseInt(e.target.value) || 0;
                          setInvoiceItems(newItems);
                        }}
                        className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-[13px] font-bold outline-none focus:border-slate-900 transition-all"
                      />
                    </div>
                    <div className="col-span-3 space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Price</label>
                      <input 
                        type="number"
                        required
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) => {
                          const newItems = [...invoiceItems];
                          newItems[idx].unitPrice = parseFloat(e.target.value) || 0;
                          setInvoiceItems(newItems);
                        }}
                        className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-[13px] font-bold outline-none focus:border-slate-900 transition-all"
                      />
                    </div>
                    <div className="col-span-1 pb-1">
                      <button 
                        type="button"
                        disabled={invoiceItems.length === 1}
                        onClick={() => setInvoiceItems(invoiceItems.filter((_, i) => i !== idx))}
                        className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-rose-500 disabled:opacity-0 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                <div className="space-y-3">
                   <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Discount</label>
                      <input 
                        type="number"
                        value={newInvoiceForm.discount_amount}
                        onChange={(e) => setNewInvoiceForm({...newInvoiceForm, discount_amount: parseFloat(e.target.value) || 0})}
                        className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold outline-none focus:bg-white focus:border-slate-900 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Type</label>
                      <select 
                        value={newInvoiceForm.discount_type}
                        onChange={(e) => setNewInvoiceForm({...newInvoiceForm, discount_type: e.target.value as 'FLAT' | 'PERCENT'})}
                        className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold outline-none focus:bg-white focus:border-slate-900 transition-all"
                      >
                        <option value="FLAT">PHP</option>
                        <option value="PERCENT">%</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Tax Rate (%)</label>
                    <input 
                      type="number"
                      value={newInvoiceForm.tax_rate}
                      onChange={(e) => setNewInvoiceForm({...newInvoiceForm, tax_rate: parseFloat(e.target.value) || 0})}
                      className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold outline-none focus:bg-white focus:border-slate-900 transition-all"
                    />
                  </div>
                </div>
                <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col justify-between">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Grand Total</span>
                  <div className="text-[32px] font-black tracking-tight">
                    {formatPHP(
                      (() => {
                        const sub = invoiceItems.reduce((s, i) => s + (i.qty * i.unitPrice), 0);
                        const disc = newInvoiceForm.discount_type === 'PERCENT' ? (sub * newInvoiceForm.discount_amount / 100) : newInvoiceForm.discount_amount;
                        const taxable = sub - disc;
                        return taxable + (taxable * newInvoiceForm.tax_rate / 100);
                      })()
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Notes</label>
                <textarea 
                  rows={2}
                  placeholder="Payment instructions or terms..."
                  value={newInvoiceForm.notes}
                  onChange={(e) => setNewInvoiceForm({...newInvoiceForm, notes: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium outline-none focus:bg-white focus:border-slate-900 transition-all resize-none"
                />
              </div>
            </form>

            <div className="p-6 border-t border-slate-100 flex gap-3">
              <button 
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="flex-1 h-12 rounded-xl bg-white border border-slate-200 text-[14px] font-black text-slate-500 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateInvoiceSubmit}
                className="flex-[2] h-12 rounded-xl bg-slate-900 text-white text-[14px] font-black hover:bg-indigo-600 transition-all shadow-lg shadow-slate-900/10"
              >
                Generate Invoice
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
