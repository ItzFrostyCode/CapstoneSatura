'use client';

import React from 'react';
import { X, Plus, ShieldCheck, MapPin, Layers, Lock, Unlock, Edit3, ChevronRight, ArrowUpRight } from 'lucide-react';
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
  const [isEditMode, setIsEditMode] = React.useState(false);

  // Reset edit mode when product changes
  React.useEffect(() => {
    const hasRecipe = recipes.find(r => r.productId === bomProductId);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsEditMode(!hasRecipe); // Default to edit mode if NEW recipe, otherwise locked
  }, [bomProductId, recipes]);

  if (!isOpen) return null;

  const handleUpdateBOMMaterial = (index: number, field: 'sku' | 'qty', value: string | number) => {
    if (!isEditMode) return;
    setBomMaterials(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleRemoveBOMMaterial = (index: number) => {
    if (!isEditMode) return;
    setBomMaterials(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddBOMMaterial = () => {
    if (!isEditMode) return;
    setBomMaterials(prev => [...prev, { sku: materials[0]?.sku || '', qty: 1 }]);
  };

  const handleBOMProductChange = (productId: string) => {
    setBomProductId(productId);
    const existing = recipes.find(r => r.productId === productId);
    setBomMaterials(existing ? existing.materials.map((m: { sku: string; qty: number }) => ({ ...m })) : []);
    setIsEditMode(!existing);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-[#1C1917]/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-[800px] rounded-[48px] shadow-2xl border border-[#E2DDD7] overflow-hidden animate-in zoom-in-95 duration-500">
        <div className="p-10 border-b border-[#F0EDE8] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[24px] bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-900/10">
              <Layers size={28} />
            </div>
            <div>
              <h2 className="text-[28px] font-bold font-sans text-[#1C1917] tracking-tight">Workshoppp Bill of Materials</h2>
              <p className="text-[14px] text-[#78716C] mt-1 font-medium">Defining the architectural recipes for your couture production.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {bomProductId && (
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                className={`flex items-center gap-2 px-6 h-12 rounded-xl text-[12px] font-bold transition-all border shadow-sm ${
                  isEditMode 
                    ? 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100' 
                    : 'bg-slate-900/5 text-slate-900 border-slate-900/10 hover:bg-slate-900/10'
                }`}
              >
                {isEditMode ? <><Unlock size={14} /> Unlocked</> : <><Lock size={14} /> View Only</>}
              </button>
            )}
            <button
              onClick={onClose}
              className="w-12 h-12 rounded-xl border border-[#E2DDD7] flex items-center justify-center text-[#78716C] hover:text-[#1C1917] hover:bg-white transition-all shadow-sm"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-10 space-y-10 max-h-[65vh] overflow-y-auto custom-scrollbar">
          {/* Section A: Finished Product */}
          <div className="space-y-5">
            <label className="text-[11px] font-bold text-[#78716C] uppercase tracking-[0.1em] block ml-1">Phase 1: Product Selection</label>
            <div className="flex items-center gap-6 p-6 rounded-[32px] border border-[#E2DDD7] bg-[#FAF8F5]/50 group hover:border-slate-900/20 transition-all">
              {bomProductId ? (
                <div className="shrink-0 scale-110">
                  {renderAvatar((finishedGoods.find(fg => fg.sku === bomProductId)?.item || finishedGoods.find(fg => fg.sku === bomProductId)?.item_name || 'P'), 64, finishedGoods.find(fg => fg.sku === bomProductId)?.image)}
                </div>
              ) : (
                <div className="w-16 h-16 rounded-[24px] bg-white border-2 border-dashed border-[#E2DDD7] flex items-center justify-center text-[#E2DDD7]" />
              )}
              <div className="flex-1 relative">
                <select
                  value={bomProductId}
                  onChange={(e) => handleBOMProductChange(e.target.value)}
                  disabled={isEditMode && bomMaterials.length > 0}
                  className={`w-full h-14 px-6 rounded-2xl border border-[#E2DDD7] bg-white focus:border-slate-900 outline-none transition-all text-[15px] font-bold appearance-none shadow-sm ${isEditMode && bomMaterials.length > 0 ? 'cursor-not-allowed opacity-70 bg-[#FAF8F5]' : ''}`}
                >
                  <option value="" disabled>Select Primary Garment</option>
                  {finishedGoods.map(fg => (
                    <option key={fg.sku} value={fg.sku}>
                      {fg.item || fg.item_name} — {fg.sku}{recipes.find(r => r.productId === fg.sku) ? ' (BOM Active)' : ''}
                    </option>
                  ))}
                </select>
                <ChevronRight size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-[#78716C] rotate-90 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Section B: Ingredients */}
          <div className="space-y-5 pt-8 border-t border-[#F0EDE8]">
            <div className="flex items-center justify-between ml-1">
              <label className="text-[11px] font-bold text-[#78716C] uppercase tracking-[0.1em] block">Phase 2: Material Blueprint</label>
              <span className="text-[11px] font-bold text-slate-900 bg-slate-900/5 px-3 py-1.5 rounded-full border border-slate-900/10">
                {bomMaterials.length} Resources Required
              </span>
            </div>

            <div className="space-y-4">
              {bomMaterials.map((mat, i) => {
                const selectedMat = materials.find(m => m.sku === mat.sku);
                return (
                  <div key={i} className="flex items-center justify-between p-5 rounded-[28px] border border-[#E2DDD7] bg-white shadow-sm hover:border-slate-900/20 hover:shadow-md transition-all group animate-in slide-in-from-top-2 duration-500">
                    <div className="flex flex-1 items-center gap-5 mr-6 min-w-0">
                      {isEditMode && (
                        <button onClick={() => handleRemoveBOMMaterial(i)} className="text-rose-400 hover:text-rose-600 p-2 shrink-0 transition-colors bg-rose-50 rounded-xl">
                          <X size={18} />
                        </button>
                      )}
                      <div className="shrink-0">
                        {selectedMat ? renderAvatar(selectedMat.item || '', 48, selectedMat.image) : <div className="w-12 h-12 rounded-xl bg-[#FAF8F5]" />}
                      </div>
                      <div className="flex-1 flex flex-col min-w-0">
                        <select
                          value={mat.sku}
                          onChange={(e) => handleUpdateBOMMaterial(i, 'sku', e.target.value)}
                          disabled={!isEditMode}
                          className={`w-full h-10 bg-transparent border-none outline-none text-[15px] font-bold text-[#1C1917] appearance-none ${!isEditMode ? 'cursor-not-allowed opacity-70' : ''}`}
                        >
                          <option value="" disabled>Select Material Component</option>
                          {materials.map(m => (
                            <option key={m.sku} value={m.sku}>{m.item || m.item_name}</option>
                          ))}
                        </select>
                        {selectedMat && (
                          <div className="flex items-center gap-2 text-[10px] font-bold text-[#78716C] uppercase tracking-widest mt-0.5">
                            <MapPin size={10} className="text-white" />
                            {selectedMat.location || 'Central Workshop'}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="flex flex-col items-center">
                        <input
                          type="number"
                          value={mat.qty || ''}
                          onChange={(e) => handleUpdateBOMMaterial(i, 'qty', Number(e.target.value))}
                          disabled={!isEditMode}
                          step="0.1"
                          min="0.1"
                          placeholder="0.0"
                          className={`w-24 h-11 px-4 bg-[#FAF8F5] border border-[#E2DDD7] rounded-xl text-center text-[15px] font-bold text-[#1C1917] outline-none focus:border-slate-900 transition-all shadow-inner ${!isEditMode ? 'cursor-not-allowed opacity-70' : ''}`}
                        />
                        <span className="text-[9px] font-bold text-[#78716C] uppercase tracking-widest mt-2">{selectedMat ? selectedMat.unit || selectedMat.unit_of_measure : 'Unit'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {isEditMode && (
                <button 
                  onClick={handleAddBOMMaterial}
                  className="w-full h-16 border-2 border-dashed border-[#E2DDD7] rounded-[24px] flex items-center justify-center gap-3 text-[14px] font-bold text-[#78716C] hover:text-slate-900 hover:border-slate-900/30 hover:bg-[#FAF8F5] transition-all group"
                >
                  <Plus size={20} className="group-hover:rotate-90 transition-transform" /> Add Material to Recipe
                </button>
              )}
            </div>
          </div>

          <div className="p-6 rounded-[32px] bg-slate-900/5 border border-slate-900/10 flex gap-6 items-start">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-lg">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-[15px] text-slate-900 font-bold">Operational Precision Guarantee</p>
              <p className="text-[13px] text-[#78716C] font-medium leading-relaxed mt-1">
                This blueprint enables automated resource reservation. Upon execution, SUTURA will deduct these quantities from workshop inventory and calculate actual vs estimated production variance.
              </p>
            </div>
          </div>
        </div>

        <div className="p-10 border-t border-[#F0EDE8] bg-[#FAF8F5] flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-8 h-14 bg-white border border-[#E2DDD7] rounded-2xl text-[14px] font-bold text-[#78716C] hover:bg-[#F0EDE8] hover:text-[#1C1917] transition-all shadow-sm"
          >
            Discard Changes
          </button>
          <button
            onClick={onSave}
            disabled={!isEditMode || bomMaterials.length === 0 || !bomProductId}
            className="px-12 h-14 bg-slate-900 text-white rounded-2xl text-[14px] font-bold shadow-xl shadow-slate-900/20 hover:bg-[#1C1917] disabled:opacity-50 transition-all active:scale-95 flex items-center gap-3"
          >
            Commit BOM Recipe <ArrowUpRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
