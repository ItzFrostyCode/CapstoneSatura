'use client';

import React from 'react';
import { 
  Search, Plus, Filter, Download, 
  ChevronRight, ArrowUpRight
} from 'lucide-react';

// Custom Hooks
import { useBilling, BillingTab } from './hooks/useBilling';

// Modular Components
import { BillingStats } from './components/BillingStats';
import { InvoiceTable } from './components/InvoiceTable';
import { BillTable } from './components/BillTable';
import { SettlementTable } from './components/SettlementTable';
import { PaymentModal } from './components/PaymentModal';
import { SettlementModal } from './components/SettlementModal';
import { CreateInvoiceModal } from './components/CreateInvoiceModal';
import { InvoiceDetailModal } from './components/InvoiceDetailModal';

export default function BillingPage() {
  const {
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
    filteredInvoices, filteredBills, filteredSettlements,
    stats,
    handlePaymentSubmit, handleSettlementSubmit, handleCreateInvoiceSubmit,
    handlePrintInvoice, handleExportAging,
    customers
  } = useBilling();

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto animate-in fade-in duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-[32px] font-black text-slate-900 tracking-tight leading-none mb-2">Billing & ERP</h1>
          <p className="text-[14px] text-slate-500 font-medium">Manage sales invoices, supplier settlements, and financial aging.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportAging}
            className="h-12 px-6 rounded-2xl bg-white border border-slate-200 text-slate-600 text-[14px] font-black hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
          >
            <Download size={18} /> Export Aging
          </button>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="h-12 px-6 rounded-2xl bg-slate-900 text-white text-[14px] font-black hover:bg-indigo-600 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/10"
          >
            <Plus size={18} /> Create Invoice
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <BillingStats stats={stats} />

      {/* Tab Switcher & Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/40 rounded-2xl w-max border border-slate-200/50 overflow-x-auto">
          {[
            { id: 'invoices', label: 'Sales Invoices' },
            { id: 'bills', label: 'Supplier Bills' },
            { id: 'settlements', label: 'Payments' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as BillingTab)}
              className={`px-6 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-72 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 w-full pl-12 pr-6 bg-white border border-slate-200 rounded-xl text-[12px] font-bold outline-none focus:border-slate-900 transition-all shadow-sm" 
          />
        </div>
      </div>

      {/* Main Ledger Section */}
      <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Data Table */}
        <div className="overflow-x-auto">
          {activeTab === 'invoices' && (
            <InvoiceTable 
              invoices={filteredInvoices} 
              onPay={(inv) => {
                setPaymentInvoice(inv);
                setPaymentAmount(inv.balance);
                setIsPaymentModalOpen(true);
              }}
              onView={(inv) => {
                setSelectedInvoice(inv);
                setIsDetailModalOpen(true);
              }}
            />
          )}

          {activeTab === 'bills' && (
            <BillTable 
              bills={filteredBills}
              onRecordPayment={(bill) => {
                setSelectedBill(bill);
                setIsSettlementModalOpen(true);
              }}
            />
          )}

          {activeTab === 'settlements' && (
            <SettlementTable settlements={filteredSettlements} />
          )}

          {/* Empty States */}
          {((activeTab === 'invoices' && filteredInvoices.length === 0) ||
            (activeTab === 'bills' && filteredBills.length === 0) ||
            (activeTab === 'settlements' && filteredSettlements.length === 0)) && (
            <div className="px-6 py-20 text-center text-slate-400">
              <div className="flex flex-col items-center gap-2">
                <Search size={32} className="opacity-20" />
                <p className="text-[14px] font-bold">No results found in {activeTab}</p>
              </div>
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        <div className="px-8 py-5 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[12px] text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-900">
              {activeTab === 'invoices' ? filteredInvoices.length : activeTab === 'bills' ? filteredBills.length : filteredSettlements.length}
            </span> records
          </p>
          <div className="flex items-center gap-2">
            <button className="h-9 px-4 rounded-lg bg-white border border-slate-200 text-[12px] font-bold text-slate-400 cursor-not-allowed">Previous</button>
            <button className="h-9 px-4 rounded-lg bg-white border border-slate-200 text-[12px] font-bold text-slate-900 hover:bg-slate-50 transition-colors">
              Next <ChevronRight size={14} className="inline ml-1"/>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <InvoiceDetailModal 
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        invoice={selectedInvoice}
        onPrint={handlePrintInvoice}
        onRecordPayment={(inv) => {
          setIsDetailModalOpen(false);
          setPaymentInvoice(inv);
          setPaymentAmount(inv.balance);
          setIsPaymentModalOpen(true);
        }}
      />

      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        invoice={paymentInvoice}
        paymentAmount={paymentAmount}
        setPaymentAmount={setPaymentAmount}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        paymentRef={paymentRef}
        setPaymentRef={setPaymentRef}
        paymentDate={paymentDate}
        setPaymentDate={setPaymentDate}
        paymentNotes={paymentNotes}
        setPaymentNotes={setPaymentNotes}
        paymentImage={paymentImage}
        setPaymentImage={setPaymentImage}
        onSubmit={handlePaymentSubmit}
      />

      <SettlementModal 
        isOpen={isSettlementModalOpen}
        onClose={() => setIsSettlementModalOpen(false)}
        bill={selectedBill}
        amount={settlementAmount}
        setAmount={setSettlementAmount}
        method={settlementMethod}
        setMethod={setSettlementMethod}
        refNo={settlementRef}
        setRefNo={setSettlementRef}
        onSubmit={handleSettlementSubmit}
      />

      <CreateInvoiceModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        customers={customers}
        form={newInvoiceForm}
        setForm={setNewInvoiceForm}
        items={invoiceItems}
        setItems={setInvoiceItems}
        onSubmit={handleCreateInvoiceSubmit}
      />

    </div>
  );
}
