'use client';

import React, { useState } from 'react';
import { X, Package, Shield, Truck, Info, ChevronDown } from 'lucide-react';
import { InventoryItem, ItemType } from '@/types/erp';

interface NewItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<InventoryItem>) => void;
  defaultCategory?: string;
}

const CATEGORIES = [
  'Fabric', 'Lining', 'Button', 'Zipper', 'Thread', 'Trim', 'Finished Goods', 'Accessories', 'Packaging'
];

const ITEM_TYPES: { value: ItemType; label: string }[] = [
  { value: 'FABRIC', label: 'Fabric (Meters)' },
  { value: 'FINISHED_GOOD', label: 'Finished Good (Pcs)' },
  { value: 'BUTTON', label: 'Buttons (Qty)' },
  { value: 'ZIPPER', label: 'Zippers (Qty)' },
  { value: 'THREAD', label: 'Threads (Rolls)' },
  { value: 'TRIM', label: 'Trims (Meters)' },
  { value: 'OTHER', label: 'Other / Accessory' },
];

export function NewItemModal({ isOpen, onClose, onSave, defaultCategory }: NewItemModalProps) {
  const [form, setForm] = useState({
    item_name: '',
    sku: '',
    category: defaultCategory || 'Fabric',
    item_type: (defaultCategory === 'Finished Goods' ? 'FINISHED_GOOD' : 'FABRIC') as ItemType,
    unit_of_measure: defaultCategory === 'Finished Goods' ? 'Pcs' : 'Meters',
    reorder_level: 5,
    location: '',
    supplier_id: '',
    price: 0
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      stock: 0, // Strict rule: Initial stock is always 0
      is_active: true,
      // Legacy compatibility
      item: form.item_name,
      cat: form.category,
      unit: form.unit_of_measure,
      minStock: form.reorder_level,
    });
    onClose();
    setForm({
      item_name: '',
      sku: '',
      category: 'Fabric',
      item_type: 'FABRIC',
      unit_of_measure: 'Meters',
      reorder_level: 5,
      location: '',
      supplier_id: '',
      price: 0
    });
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-[600px] rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <div>
              <h2 className="text-[22px] font-black text-slate-900 tracking-tight">Add New Inventory Item</h2>
              <p className="text-[13px] text-slate-500 font-medium">Create a master record. Initial stock will be zero.</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
            {/* Section A: Basic Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-indigo-600">
                <Package size={18} />
                <h3 className="text-[14px] font-black uppercase tracking-widest">Basic Information</h3>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Item Name</label>
                  <input
                    required
                    type="text"
                    value={form.item_name}
                    onChange={e => setForm({ ...form, item_name: e.target.value })}
                    placeholder="e.g., Italian Wool Charcoal"
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">SKU / Code</label>
                    <input
                      required
                      type="text"
                      value={form.sku}
                      onChange={e => setForm({ ...form, sku: e.target.value })}
                      placeholder="WOOL-001"
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Category</label>
                    <div className="relative">
                      <select
                        value={form.category}
                        onChange={e => {
                          const newCat = e.target.value;
                          let newItemType = form.item_type;
                          let newUnit = form.unit_of_measure;
                          
                          if (newCat === 'Finished Goods') {
                            newItemType = 'FINISHED_GOOD';
                            newUnit = 'Pcs';
                          } else if (['Fabric', 'Lining', 'Trim'].includes(newCat)) {
                            newItemType = 'FABRIC';
                            newUnit = 'Meters';
                          } else if (newCat === 'Button') {
                            newItemType = 'BUTTON';
                            newUnit = 'Pcs';
                          } else if (newCat === 'Thread') {
                            newItemType = 'THREAD';
                            newUnit = 'Rolls';
                          }

                          setForm({ 
                            ...form, 
                            category: newCat, 
                            item_type: newItemType,
                            unit_of_measure: newUnit 
                          });
                        }}
                        className="w-full h-12 px-4 pr-10 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-medium appearance-none cursor-pointer"
                      >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <ChevronDown size={16} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Item Type</label>
                    <div className="relative">
                      <select
                        value={form.item_type}
                        onChange={e => setForm({ ...form, item_type: e.target.value as ItemType })}
                        className="w-full h-12 px-4 pr-10 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-medium appearance-none cursor-pointer"
                      >
                        {ITEM_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <ChevronDown size={16} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Unit of Measure</label>
                    <input
                      required
                      type="text"
                      value={form.unit_of_measure}
                      onChange={e => setForm({ ...form, unit_of_measure: e.target.value })}
                      placeholder="Meters, Pcs, Yards..."
                      disabled={form.category === 'Finished Goods'}
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-medium disabled:opacity-60 disabled:bg-slate-100 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section B: Inventory Rules */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-amber-600">
                <Shield size={18} />
                <h3 className="text-[14px] font-black uppercase tracking-widest">Inventory Rules</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Reorder Level</label>
                  <input
                    type="number"
                    min="0"
                    value={form.reorder_level}
                    onChange={e => setForm({ ...form, reorder_level: Number(e.target.value) })}
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-medium"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Storage Location</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={e => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g., Shelf A-1"
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-medium"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Standard Unit Cost</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₱</span>
                    <input
                      type="number"
                      min="0"
                      value={form.price || ''}
                      onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                      placeholder="0.00"
                      className="w-full h-12 pl-8 pr-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section C: Supplier */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-600">
                <Truck size={18} />
                <h3 className="text-[14px] font-black uppercase tracking-widest">Primary Supplier</h3>
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Supplier (Optional)</label>
                <select
                  value={form.supplier_id}
                  onChange={e => setForm({ ...form, supplier_id: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-medium appearance-none"
                >
                  <option value="">None / Unlinked</option>
                  <option value="SUP-001">Premium Fabrics Inc.</option>
                  <option value="SUP-002">Global Accessories Co.</option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex gap-3">
              <Info size={18} className="text-slate-400 shrink-0 mt-0.5" />
              <p className="text-[12px] text-slate-500 font-medium">
                Saving this item will create a master record with <span className="font-bold text-slate-900">0 stock</span>. You must perform a Stock Movement to record initial inventory.
              </p>
            </div>
          </div>

          <div className="p-8 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 h-12 bg-white border border-slate-200 rounded-full text-[14px] font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              Discard
            </button>
            <button
              type="submit"
              className="px-8 h-12 bg-slate-900 text-white rounded-full text-[14px] font-black shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-95"
            >
              Save Item Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
