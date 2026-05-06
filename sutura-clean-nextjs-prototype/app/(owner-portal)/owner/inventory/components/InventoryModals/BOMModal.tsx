'use client';

import React from 'react';
import { X, Plus, ShieldCheck, MapPin, Layers } from 'lucide-react';
import { InventoryItem } from '@/store/useERPStore';
import { BOMRecipe } from '../ProductionAssembly';

interface BOMModalProps {
  isOpen: boolean;
  onClose: () => void;
  bomProductId: string;
  setBomProductId: (id: string) => void;
  bomMaterials: Array<{ sku: string; qty: number }>;
  setBomMaterials: React.Dispatch<React.SetStateAction<Array<{ sku: string; qty: number }>>>;
  finishedGoods: InventoryItem[];
  materials: InventoryItem[];
  recipes: BOMRecipe[];
  onSave: () => void;
  renderAvatar: (name: string, size?: number, imageUrl?: string) => React.ReactNode;
}

export function BOMModal({
  isOpen,
  onClose,
  bomProductId,
  setBomProductId,
  bomMaterials,
  setBomMaterials,
  finishedGoods,
  materials,
  recipes,
  onSave,
  renderAvatar
}: BOMModalProps) {

  if (!isOpen) return null;

  const handleUpdateBOMMaterial = (index: number, field: 'sku' | 'qty', value: string | number) => {
    setBomMaterials(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleRemoveBOMMaterial = (index: number) => {
    setBomMaterials(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddBOMMaterial = () => {
    setBomMaterials(prev => [...prev, { sku: materials[0]?.sku || '', qty: 1 }]);
  };

  const handleBOMProductChange = (productId: string) => {
    setBomProductId(productId);
    const existing = recipes.find(r => r.productId === productId);
    setBomMaterials(existing ? existing.materials.map((m: any) => ({ ...m })) : []);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-[750px] rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Layers size={24} />
            </div>
            <div>
              <h2 className="text-[22px] font-black text-slate-900 tracking-tight">Bill of Materials (BOM)</h2>
              <p className="text-[13px] text-slate-500 font-medium">Define material recipes for your premade production lines.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {/* Section A: Finished Product */}
          <div className="space-y-4">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">Step 1: Select Finished Product</label>
            <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
              {bomProductId ? (
                renderAvatar((finishedGoods.find(fg => fg.sku === bomProductId)?.item || finishedGoods.find(fg => fg.sku === bomProductId)?.item_name || 'P'), 56, finishedGoods.find(fg => fg.sku === bomProductId)?.image)
              ) : (
                <div className="w-14 h-14 rounded-xl bg-slate-100 border-2 border-dashed border-slate-200" />
              )}
              <div className="flex-1">
                <select
                  value={bomProductId}
                  onChange={(e) => handleBOMProductChange(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-bold appearance-none shadow-sm"
                >
                  <option value="" disabled>Select Finished Good</option>
                  {finishedGoods.map(fg => (
                    <option key={fg.sku} value={fg.sku}>
                      {fg.item || fg.item_name} ({fg.sku}){recipes.find(r => r.productId === fg.sku) ? ' ✓' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section B: Ingredients */}
          <div className="space-y-4 pt-4 border-t border-slate-50">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">Step 2: Define Ingredients / BOM</label>
              <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                {bomMaterials.length} Materials Linked
              </span>
            </div>

            <div className="space-y-3">
              {bomMaterials.map((mat, i) => {
                const selectedMat = materials.find(m => m.sku === mat.sku);
                return (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white shadow-sm hover:border-indigo-200 transition-all group animate-in slide-in-from-top-2 duration-300">
                    <div className="flex flex-1 items-center gap-4 mr-4">
                      <button onClick={() => handleRemoveBOMMaterial(i)} className="text-rose-400 hover:text-rose-600 p-1 shrink-0 transition-colors">
                        <X size={16} />
                      </button>
                      {selectedMat ? renderAvatar(selectedMat.item || '', 36, selectedMat.image) : <div className="w-9 h-9 rounded-xl bg-slate-100" />}
                      <div className="flex-1 flex flex-col">
                        <select
                          value={mat.sku}
                          onChange={(e) => handleUpdateBOMMaterial(i, 'sku', e.target.value)}
                          className="w-full h-8 bg-transparent border-none outline-none text-[14px] font-bold text-slate-700 appearance-none"
                        >
                          <option value="" disabled>Select Material</option>
                          {materials.map(m => (
                            <option key={m.sku} value={m.sku}>{m.item || m.item_name}</option>
                          ))}
                        </select>
                        {selectedMat && (
                          <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <MapPin size={10} className="text-indigo-400" />
                            {selectedMat.location || 'Warehouse A'}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        value={mat.qty || ''}
                        onChange={(e) => handleUpdateBOMMaterial(i, 'qty', Number(e.target.value))}
                        step="0.1"
                        min="0.1"
                        placeholder="Qty"
                        className="w-20 h-9 px-2 bg-slate-50 border border-slate-100 rounded-lg text-center text-[14px] font-black text-slate-900 outline-none focus:border-indigo-400 transition-all"
                      />
                      <span className="text-[12px] font-bold text-slate-400 uppercase w-8 text-left">{selectedMat ? selectedMat.unit || selectedMat.unit_of_measure : '-'}</span>
                    </div>
                  </div>
                );
              })}

              <button 
                onClick={handleAddBOMMaterial}
                className="w-full h-14 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-[13px] font-bold text-slate-400 hover:text-slate-900 hover:border-slate-400 hover:bg-slate-50 transition-all"
              >
                <Plus size={18} /> Add Material to Recipe
              </button>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100 flex gap-4">
            <ShieldCheck size={24} className="text-indigo-600 shrink-0" />
            <div>
              <p className="text-[14px] text-indigo-900 font-bold">Audit-Ready Calculation</p>
              <p className="text-[12px] text-indigo-700/80 font-medium leading-relaxed">
                Saving this BOM allows the system to automatically calculate material requirements and deduct stock when production batches are executed.
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 h-12 bg-white border border-slate-200 rounded-full text-[14px] font-bold text-slate-600 hover:bg-slate-50 transition-all"
          >
            Discard
          </button>
          <button
            onClick={onSave}
            disabled={bomMaterials.length === 0 || !bomProductId}
            className="px-10 h-12 bg-slate-900 text-white rounded-full text-[14px] font-black shadow-lg shadow-slate-900/10 hover:bg-slate-800 disabled:opacity-50 transition-all active:scale-95 flex items-center gap-2"
          >
            Save BOM Recipe
          </button>
        </div>
      </div>
    </div>
  );
}
