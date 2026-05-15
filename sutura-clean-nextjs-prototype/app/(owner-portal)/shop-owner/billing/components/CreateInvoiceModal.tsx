import React from 'react';
import { X, Plus } from 'lucide-react';
import { Customer } from '@/types/erp';
import { formatPHP } from '../utils/billingUtils';

interface InvoiceItem {
  description: string;
  qty: number;
  unitPrice: number;
}

interface CreateInvoiceForm {
  customer_id: string;
  subject: string;
  discount_amount: number;
  discount_type: 'FLAT' | 'PERCENT';
  tax_rate: number;
  notes: string;
  issueDate: string;
  dueDate: string;
}

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  form: CreateInvoiceForm;
  setForm: (form: CreateInvoiceForm) => void;
  items: InvoiceItem[];
  setItems: (items: InvoiceItem[]) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({
  isOpen, onClose, customers, form, setForm, items, setItems, onSubmit
}) => {
  if (!isOpen) return null;

  const calculateTotal = () => {
    const sub = items.reduce((s, i) => s + (i.qty * i.unitPrice), 0);
    const disc = form.discount_type === 'PERCENT' ? (sub * form.discount_amount / 100) : form.discount_amount;
    const taxable = sub - disc;
    return taxable + (taxable * form.tax_rate / 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <Plus size={20} />
            </div>
            <h2 className="text-[18px] font-black text-slate-900">Create New Invoice</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors text-slate-500">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Customer</label>
              <select 
                required
                value={form.customer_id}
                onChange={(e) => setForm({...form, customer_id: e.target.value})}
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
                type="text" required placeholder="e.g. Wedding Suit Deposit"
                value={form.subject}
                onChange={(e) => setForm({...form, subject: e.target.value})}
                className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold outline-none focus:bg-white focus:border-slate-900 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Issue Date</label>
              <input 
                type="date" required value={form.issueDate}
                onChange={(e) => setForm({...form, issueDate: e.target.value})}
                className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold outline-none focus:bg-white focus:border-slate-900 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Due Date</label>
              <input 
                type="date" required value={form.dueDate}
                onChange={(e) => setForm({...form, dueDate: e.target.value})}
                className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold outline-none focus:bg-white focus:border-slate-900 transition-all"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Items</label>
              <button 
                type="button"
                onClick={() => setItems([...items, { description: '', qty: 1, unitPrice: 0 }])}
                className="text-[11px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest flex items-center gap-1"
              >
                <Plus size={12} /> Add Item
              </button>
            </div>
            
            {items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-3 items-end bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="col-span-6 space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Description</label>
                  <input 
                    type="text" required placeholder="Service/Product name"
                    value={item.description}
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[idx].description = e.target.value;
                      setItems(newItems);
                    }}
                    className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-[13px] font-bold outline-none focus:border-slate-900 transition-all"
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Qty</label>
                  <input 
                    type="number" required min="1"
                    value={item.qty}
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[idx].qty = parseInt(e.target.value) || 0;
                      setItems(newItems);
                    }}
                    className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-[13px] font-bold outline-none focus:border-slate-900 transition-all"
                  />
                </div>
                <div className="col-span-3 space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Price</label>
                  <input 
                    type="number" required min="0"
                    value={item.unitPrice}
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[idx].unitPrice = parseFloat(e.target.value) || 0;
                      setItems(newItems);
                    }}
                    className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-[13px] font-bold outline-none focus:border-slate-900 transition-all"
                  />
                </div>
                <div className="col-span-1 pb-1 text-center">
                  <button 
                    type="button" disabled={items.length === 1}
                    onClick={() => setItems(items.filter((_, i) => i !== idx))}
                    className="text-slate-400 hover:text-rose-500 disabled:opacity-0"
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
                    type="number" value={form.discount_amount}
                    onChange={(e) => setForm({...form, discount_amount: parseFloat(e.target.value) || 0})}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold outline-none focus:bg-white focus:border-slate-900 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Type</label>
                  <select 
                    value={form.discount_type}
                    onChange={(e) => setForm({...form, discount_type: e.target.value as 'FLAT' | 'PERCENT'})}
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
                  type="number" value={form.tax_rate}
                  onChange={(e) => setForm({...form, tax_rate: parseFloat(e.target.value) || 0})}
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold outline-none focus:bg-white focus:border-slate-900 transition-all"
                />
              </div>
            </div>
            <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col justify-between">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Grand Total</span>
              <div className="text-[32px] font-black tracking-tight">{formatPHP(calculateTotal())}</div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Notes</label>
            <textarea 
              rows={2} placeholder="Payment instructions or terms..."
              value={form.notes}
              onChange={(e) => setForm({...form, notes: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium outline-none focus:bg-white focus:border-slate-900 transition-all resize-none"
            />
          </div>
        </form>

        <div className="p-6 border-t border-slate-100 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 h-12 rounded-xl bg-white border border-slate-200 text-[14px] font-black text-slate-500 hover:bg-slate-50 transition-all">
            Cancel
          </button>
          <button onClick={onSubmit} className="flex-[2] h-12 rounded-xl bg-slate-900 text-white text-[14px] font-black hover:bg-indigo-600 transition-all shadow-lg shadow-slate-900/10">
            Generate Invoice
          </button>
        </div>
      </div>
    </div>
  );
};
