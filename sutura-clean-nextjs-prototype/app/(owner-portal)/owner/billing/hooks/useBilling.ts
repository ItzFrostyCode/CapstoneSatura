import { useState, useMemo, useCallback } from 'react';
import { useERPStore, Payment, PaymentMethod } from '@/store/useERPStore';
import { EnhancedInvoice, EnhancedBill } from '../types/billing';
import { formatPHP } from '../utils/billingUtils';

export function useBilling() {
  const [activeTab, setActiveTab] = useState('invoices');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [selectedInvoice, setSelectedInvoice] = useState<EnhancedInvoice | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  const [paymentInvoice, setPaymentInvoice] = useState<EnhancedInvoice | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Payment Form State
  const [paymentAmount, setPaymentAmount] = useState<string | number>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('CASH');
  const [paymentRef, setPaymentRef] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentImage, setPaymentImage] = useState<string | null>(null);

  const [selectedBill, setSelectedBill] = useState<EnhancedBill | null>(null);
  const [isSettlementModalOpen, setIsSettlementModalOpen] = useState(false);
  const [settlementAmount, setSettlementAmount] = useState('');
  const [settlementMethod, setSettlementMethod] = useState<PaymentMethod>('BANK_TRANSFER');
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

  // ✅ ENHANCED INVOICES
  const enhancedInvoices: EnhancedInvoice[] = useMemo(() => {
    return invoices.map(inv => {
      const invPayments = payments.filter(p => p.invoice_id === inv.id);
      const amountPaid = invPayments.reduce((sum: number, p) => sum + (p.amount_paid || 0), 0);

      const issueDate = inv.issueDate || inv.issued_at || inv.date || new Date().toISOString().split('T')[0];
      const dueDate = inv.dueDate || inv.due_date || issueDate;
      const today = new Date().toISOString().split('T')[0];

      const lineSubtotal = (inv.items || []).reduce((sum: number, item) => sum + item.total, 0);

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

      let computedStatus = 'Open';
      if (inv.statusSnapshot === 'Draft') computedStatus = 'Draft';
      else if (amountPaid === 0 && dueDate >= today) computedStatus = 'Unpaid';
      else if (amountPaid > 0 && amountPaid < computedTotal) computedStatus = 'Partially Paid';
      else if (amountPaid >= computedTotal) computedStatus = 'Paid';
      else if (dueDate < today) computedStatus = 'Overdue';

      let agingDays = 0;
      let agingBucket = 'Current';
      if (dueDate < today && balance > 0) {
        agingDays = Math.ceil((new Date(today).getTime() - new Date(dueDate).getTime()) / (1000 * 60 * 60 * 24));
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
          ? invPayments.sort((a, b) => new Date(b.paid_at || '').getTime() - new Date(a.paid_at || '').getTime())[0].paid_at 
          : undefined,
        agingDays,
        agingBucket,
        invPayments
      };
    });
  }, [invoices, payments]);

  const enhancedBills: EnhancedBill[] = useMemo(() => {
    return supplierBills.map(bill => {
      const billPayments = settlements.filter(s => (s.billId === bill.id || s.bill_id === bill.id));
      const paid = billPayments.reduce((sum: number, s) => sum + (s.amount || s.amount_paid || 0), 0);
      const balance = bill.amount - paid;
      let status: 'PAID' | 'PARTIAL' | 'UNPAID' = 'UNPAID';
      if (paid === 0) status = 'UNPAID';
      else if (paid < bill.amount) status = 'PARTIAL';
      else status = 'PAID';
      return { ...bill, paid, balance, status };
    });
  }, [supplierBills, settlements]);

  const filteredInvoices = useMemo(() => enhancedInvoices.filter(inv => 
    inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (inv.customer || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (inv.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  ), [enhancedInvoices, searchQuery]);

  const filteredBills = useMemo(() => enhancedBills.filter(bill => 
    bill.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (bill.supplier_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  ), [enhancedBills, searchQuery]);

  const filteredSettlements = useMemo(() => settlements.filter(set => 
    set.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (set.supplier_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (set.billId || set.bill_id || '').toLowerCase().includes(searchQuery.toLowerCase())
  ), [settlements, searchQuery]);

  // KPI Calculations
  const stats = useMemo(() => {
    const totalRevenue = payments.reduce((sum: number, p) => sum + (p.amount_paid || p.amount || 0), 0);
    const outstanding = enhancedInvoices
      .filter(i => i.computedStatus !== 'Draft' && i.computedStatus !== 'Paid')
      .reduce((sum: number, i) => sum + i.balance, 0);
      
    const paidThisMonth = payments.filter(p => {
      if (!p.paid_at) return false;
      const d = new Date(p.paid_at);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).reduce((sum: number, p) => sum + (p.amount_paid || p.amount || 0), 0);
    
    const drafted = enhancedInvoices.filter(i => i.computedStatus === 'Draft').reduce((sum: number, i) => sum + i.total_amount, 0);

    return [
      { label: "Cash Collected", val: formatPHP(totalRevenue), trend: "Cash In", color: "indigo" },
      { label: "Customer Balances", val: formatPHP(outstanding), trend: "Unpaid Balance", color: "amber" },
      { label: "Paid This Month", val: formatPHP(paidThisMonth), trend: "Current Period", color: "emerald" },
      { label: "Drafted", val: formatPHP(drafted), trend: "Pending Approval", color: "sky" },
    ];
  }, [payments, enhancedInvoices]);

  const handlePaymentSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentInvoice) return;
    const amount = parseFloat(String(paymentAmount));
    if (isNaN(amount) || amount <= 0 || amount > paymentInvoice.balance) return;

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
    setPaymentImage(null);
  }, [paymentInvoice, paymentAmount, paymentMethod, paymentRef, paymentNotes, paymentImage, paymentDate, recordInvoicePayment]);

  const handleSettlementSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBill) return;
    const amount = parseFloat(settlementAmount);
    if (isNaN(amount) || amount <= 0) return;
    recordSettlement(selectedBill.id, amount, settlementMethod, "STF-001", settlementRef);
    setIsSettlementModalOpen(false);
    setSelectedBill(null);
    setSettlementAmount('');
    setSettlementRef('');
  }, [selectedBill, settlementAmount, settlementMethod, settlementRef, recordSettlement]);

  const handleCreateInvoiceSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvoiceForm.customer_id) return;
    const customer = customers.find(c => c.id === newInvoiceForm.customer_id);
    if (!customer) return;

    const items = invoiceItems.map(item => ({
      ...item,
      total: item.qty * item.unitPrice
    }));

    const lineSubtotal = items.reduce((sum, item) => sum + item.total, 0);
    const discountValue = newInvoiceForm.discount_type === 'PERCENT' 
      ? lineSubtotal * (newInvoiceForm.discount_amount / 100)
      : newInvoiceForm.discount_amount;

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
  }, [newInvoiceForm, invoiceItems, customers, createInvoice]);

  return {
    activeTab, setActiveTab,
    searchQuery, setSearchQuery,
    selectedInvoice, setSelectedInvoice,
    isDetailModalOpen, setIsDetailModalOpen,
    paymentInvoice, setPaymentInvoice,
    isPaymentModalOpen, setIsPaymentModalOpen,
    paymentAmount, setPaymentAmount,
    paymentMethod, setPaymentMethod,
    paymentRef, setPaymentRef,
    paymentNotes, setPaymentNotes,
    paymentDate, setPaymentDate,
    paymentImage, setPaymentImage,
    selectedBill, setSelectedBill,
    isSettlementModalOpen, setIsSettlementModalOpen,
    settlementAmount, setSettlementAmount,
    settlementMethod, setSettlementMethod,
    settlementRef, setSettlementRef,
    isCreateModalOpen, setIsCreateModalOpen,
    newInvoiceForm, setNewInvoiceForm,
    invoiceItems, setInvoiceItems,
    enhancedInvoices, enhancedBills,
    filteredInvoices, filteredBills, filteredSettlements,
    stats,
    handlePaymentSubmit, handleSettlementSubmit, handleCreateInvoiceSubmit,
    customers,
    settlements, // Raw settlements for the table
    handlePrintInvoice: () => {
      if (!selectedInvoice) return;
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;

      const html = `
        <html>
          <head>
            <title>Invoice ${selectedInvoice.id}</title>
            <style>
              body { font-family: 'Inter', sans-serif; padding: 40px; color: #1e293b; }
              .header { display: flex; justify-content: space-between; border-bottom: 2px solid #f1f5f9; padding-bottom: 20px; margin-bottom: 30px; }
              .logo { font-size: 24px; font-weight: 900; color: #4f46e5; }
              .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
              .section-title { font-size: 10px; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 0.1em; margin-bottom: 8px; }
              table { w-full; border-collapse: collapse; margin-bottom: 40px; }
              th { text-align: left; font-size: 11px; font-weight: 800; text-transform: uppercase; color: #64748b; padding: 12px; border-bottom: 1px solid #f1f5f9; }
              td { padding: 12px; font-size: 13px; border-bottom: 1px solid #f8fafc; }
              .totals { margin-left: auto; width: 300px; }
              .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 13px; }
              .grand-total { border-top: 2px solid #f1f5f9; margin-top: 8px; padding-top: 12px; font-weight: 900; font-size: 18px; color: #0f172a; }
              .footer { margin-top: 60px; font-size: 11px; color: #94a3b8; text-align: center; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo">SATURA ERP</div>
              <div style="text-align: right">
                <div style="font-size: 20px; font-weight: 900;">INVOICE</div>
                <div style="font-size: 14px; font-weight: 600; color: #64748b;">#${selectedInvoice.id}</div>
              </div>
            </div>

            <div class="info-grid">
              <div>
                <div class="section-title">Billed To</div>
                <div style="font-weight: 800; font-size: 16px;">${selectedInvoice.customer}</div>
                <div style="color: #64748b; font-size: 13px; margin-top: 4px;">${selectedInvoice.email}</div>
              </div>
              <div style="text-align: right">
                <div class="section-title">Invoice Details</div>
                <div style="font-size: 13px;"><b>Issued:</b> ${new Date(selectedInvoice.issueDate).toLocaleDateString()}</div>
                <div style="font-size: 13px;"><b>Due:</b> ${new Date(selectedInvoice.dueDate).toLocaleDateString()}</div>
                <div style="font-size: 13px;"><b>Status:</b> ${selectedInvoice.computedStatus}</div>
              </div>
            </div>

            <table style="width: 100%">
              <thead>
                <tr>
                  <th>Description</th>
                  <th style="text-align: center">Qty</th>
                  <th style="text-align: right">Unit Price</th>
                  <th style="text-align: right">Total</th>
                </tr>
              </thead>
              <tbody>
                ${selectedInvoice.items?.map(item => `
                  <tr>
                    <td>${item.description}</td>
                    <td style="text-align: center">${item.qty}</td>
                    <td style="text-align: right">${formatPHP(item.unitPrice)}</td>
                    <td style="text-align: right; font-weight: 700;">${formatPHP(item.total)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="totals">
              <div class="total-row">
                <span style="color: #64748b">Subtotal</span>
                <span>${formatPHP(selectedInvoice.lineSubtotal)}</span>
              </div>
              ${selectedInvoice.discountValue > 0 ? `
                <div class="total-row">
                  <span style="color: #64748b">Discount</span>
                  <span style="color: #e11d48">-${formatPHP(selectedInvoice.discountValue)}</span>
                </div>
              ` : ''}
              ${selectedInvoice.taxAmount > 0 ? `
                <div class="total-row">
                  <span style="color: #64748b">Tax (${selectedInvoice.tax_rate}%)</span>
                  <span>${formatPHP(selectedInvoice.taxAmount)}</span>
                </div>
              ` : ''}
              <div class="total-row grand-total">
                <span>Grand Total</span>
                <span>${formatPHP(selectedInvoice.total_amount)}</span>
              </div>
              <div class="total-row" style="color: #059669; font-weight: 700;">
                <span>Amount Paid</span>
                <span>-${formatPHP(selectedInvoice.amountPaid)}</span>
              </div>
              <div class="total-row" style="font-weight: 900; font-size: 16px; border-top: 1px solid #f1f5f9; margin-top: 8px; padding-top: 8px;">
                <span>Balance Due</span>
                <span>${formatPHP(selectedInvoice.balance)}</span>
              </div>
            </div>

            <div class="footer">
              <p>Thank you for your business! Payment is expected within 30 days of issue date.</p>
              <p>Satura ERP System | Automated Billing Module</p>
            </div>
          </body>
        </html>
      `;

      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    },
    handleExportAging: () => {
      const csvContent = [
        ["Invoice ID", "Customer", "Issue Date", "Due Date", "Balance", "Aging Days", "Bucket"],
        ...enhancedInvoices
          .filter(inv => inv.balance > 0)
          .map(inv => [
            inv.id,
            inv.customer,
            inv.issueDate,
            inv.dueDate,
            inv.balance,
            inv.agingDays,
            inv.agingBucket
          ])
      ].map(e => e.join(",")).join("\n");

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `AR_Aging_Report_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
}
