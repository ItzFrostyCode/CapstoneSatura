'use client';

import React from 'react';
import { Zap, ChevronRight, CheckCircle2, Package, Camera, MapPin, AlertTriangle, Info, ArrowUpRight } from 'lucide-react';
import { InventoryItem } from '@/store/useERPStore';

export interface BOMRecipe {
  productId: string;
  materials: Array<{ sku: string; qty: number }>;
}

interface ProductionAssemblyProps {
  assemblyStep: number;
  setAssemblyStep: (step: number) => void;
  assemblyProductId: string;
  setAssemblyProductId: (id: string) => void;
  assemblyQty: number;
  setAssemblyQty: (qty: number) => void;
  assemblySuccess: boolean;
  targetProduct: InventoryItem | null;
  selectedRecipe: BOMRecipe | null;
  inventory: InventoryItem[];
  recipes: BOMRecipe[];
  onExecute: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => void;
  updateInventoryItem: (sku: string, data: Partial<InventoryItem>) => void;
  assemblyValidation: {
    canAssemble: boolean;
    missing: Array<{ name: string; needed: number; avail: number; unit: string }>;
  };
}

export function ProductionAssembly({
  assemblyStep,
  setAssemblyStep,
  assemblyProductId,
  setAssemblyProductId,
  assemblyQty,
  setAssemblyQty,
  assemblySuccess,
  targetProduct,
  selectedRecipe,
  inventory,
  recipes,
  onExecute,
  onImageUpload,
  updateInventoryItem,
  assemblyValidation
}: ProductionAssemblyProps) {

  return (
    <div className="p-12 animate-in fade-in zoom-in-95 duration-500">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <Zap size={32} />
          </div>
          <h2 className="text-[24px] font-black text-slate-900">Production Assembly</h2>
          <p className="text-[15px] text-slate-500 font-medium max-w-md mx-auto">
            Follow the steps to convert raw materials into finished garment stock.
          </p>
        </div>

        {/* Stepper Header */}
        <div className="flex items-center justify-center max-w-2xl mx-auto mb-4">
          {[
            { step: 1, label: 'Configure' },
            { step: 2, label: 'Validate' },
            { step: 3, label: 'Execute' }
          ].map((s, i) => (
            <div key={s.step} className="flex items-center">
              <div className="flex flex-col items-center relative">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-black text-[14px] transition-all z-10 ${assemblyStep >= s.step ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
                  {s.step}
                </div>
                <span className={`absolute top-12 whitespace-nowrap text-[11px] font-black uppercase tracking-widest ${assemblyStep >= s.step ? 'text-slate-900' : 'text-slate-400'}`}>
                  {s.label}
                </span>
              </div>
              {i < 2 && (
                <div className={`w-24 h-1 mx-2 rounded-full transition-all ${assemblyStep > s.step ? 'bg-indigo-600' : 'bg-slate-100'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white border border-slate-200 rounded-[32px] shadow-sm p-8 min-h-[400px] flex flex-col relative overflow-hidden">
          {assemblySuccess && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center animate-in fade-in duration-300">
               <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={40} />
               </div>
               <h3 className="text-[24px] font-black text-slate-900">Production Logged!</h3>
               <p className="text-[14px] font-medium text-slate-500 mt-2">Materials deducted and finished goods stocked.</p>
            </div>
          )}
          
          {assemblyStep === 1 && (
            <div className="flex-1 animate-in slide-in-from-right-4 duration-300">
              <h3 className="text-[16px] font-black text-slate-900 mb-6">1. Configure Target Product</h3>
              <div className="bg-slate-50/50 p-8 rounded-[40px] border border-slate-100 shadow-inner">
                <div className="flex flex-col md:flex-row gap-10">
                  {/* Left Column: Big Image */}
                  <div className="w-full md:w-[240px] shrink-0">
                     <div className="relative group aspect-square rounded-[36px] overflow-hidden bg-white border-4 border-white shadow-xl hover:scale-[1.02] transition-all duration-500">
                        {targetProduct?.image ? (
                          <img src={targetProduct.image} alt={targetProduct.item || targetProduct.item_name || ''} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-50/50">
                             <Package size={64} strokeWidth={1} />
                             <p className="text-[10px] font-black uppercase tracking-[0.2em] mt-4 text-center px-4">No Product Photo</p>
                          </div>
                        )}
                        <label className="absolute inset-0 flex items-center justify-center bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-[2px]">
                           <div className="flex flex-col items-center gap-2 text-white">
                              <Camera size={24} />
                              <span className="text-[10px] font-black uppercase tracking-widest">Change Photo</span>
                           </div>
                           <input 
                             type="file" 
                             className="hidden" 
                             onChange={(e) => onImageUpload(e, (url) => targetProduct && updateInventoryItem(targetProduct.sku, { image: url }))} 
                           />
                        </label>
                     </div>
                  </div>

                  {/* Right Column: Configuration */}
                  <div className="flex-1 space-y-8">
                     <div>
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Target Product for Assembly</label>
                        <div className="relative">
                           <select 
                              value={assemblyProductId}
                              onChange={(e) => setAssemblyProductId(e.target.value)}
                              className="w-full h-16 px-6 rounded-[24px] border border-slate-200 bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 outline-none transition-all text-[16px] font-bold shadow-sm appearance-none cursor-pointer"
                           >
                              {recipes.map(r => {
                                const p = inventory.find(i => i.sku === r.productId);
                                return <option key={r.productId} value={r.productId}>{(p?.item || p?.item_name || '') || r.productId}</option>;
                              })}
                           </select>
                           <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                              <ChevronRight size={20} className="rotate-90" />
                           </div>
                        </div>
                     </div>

                     <div>
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Production Batch Quantity</label>
                        <div className="relative">
                           <input
                             type="number"
                             value={assemblyQty}
                             onChange={(e) => setAssemblyQty(Math.max(1, parseInt(e.target.value) || 0))}
                             min={1}
                             className="h-16 w-full px-6 rounded-[24px] border border-slate-200 bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 outline-none transition-all text-[28px] font-black shadow-sm"
                           />
                           <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
                              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-l border-slate-200 pl-4 h-6 flex items-center">
                                 Units
                              </span>
                           </div>
                        </div>
                     </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button 
                  onClick={() => setAssemblyStep(2)}
                  disabled={assemblyQty < 1}
                  className="h-12 px-8 bg-slate-900 text-white rounded-xl text-[14px] font-black hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  Next: Validate BOM <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {assemblyStep === 2 && (
            <div className="flex-1 animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-[16px] font-black text-slate-900">2. Validate BOM Requirements</h3>
                 <span className="text-[12px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-lg">Target: {assemblyQty} units</span>
              </div>
              
              <div className="space-y-4 mb-8">
                {selectedRecipe?.materials.map((req: { sku: string; qty: number }, i: number) => {
                  const item = inventory.find(inv => inv.sku === req.sku);
                  const needed = req.qty * assemblyQty;
                  const isShort = item && (item.stock || 0) < needed;

                  return (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${isShort ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                        <span className="text-[14px] font-bold text-slate-700">{(item?.item || item?.item_name || '') || req.sku}</span>
                      </div>
                      <div className="text-right flex items-center gap-6">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Avail: <span className="text-slate-700">{item?.stock ?? 0}</span> {item?.unit || ''}</div>
                        <div className={`text-[15px] font-black w-20 ${isShort ? 'text-rose-600' : 'text-slate-900'}`}>-{needed}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {!assemblyValidation.canAssemble && (
                <div className="flex items-start gap-3 text-rose-600 mb-6 p-4 bg-rose-50 rounded-xl border border-rose-100">
                  <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[13px] font-bold">Shortage Detected!</p>
                    <p className="text-[12px] font-medium mt-1">
                      Missing {assemblyValidation.missing.map(m => `${m.needed - m.avail} ${m.unit} of ${m.name}`).join(', ')}. Please restock before proceeding.
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-auto flex justify-between pt-4 border-t border-slate-100">
                <button 
                  onClick={() => setAssemblyStep(1)}
                  className="h-12 px-6 bg-white border border-slate-200 text-slate-600 rounded-xl text-[14px] font-bold hover:bg-slate-50 transition-all"
                >
                  Back
                </button>
                <button 
                  onClick={() => setAssemblyStep(3)}
                  disabled={!assemblyValidation.canAssemble}
                  className="h-12 px-8 bg-indigo-600 text-white rounded-xl text-[14px] font-black shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 disabled:opacity-50 disabled:shadow-none transition-all flex items-center gap-2"
                >
                  Next: Review & Execute <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {assemblyStep === 3 && (
            <div className="flex-1 animate-in slide-in-from-right-4 duration-300">
              <h3 className="text-[16px] font-black text-slate-900 mb-6">3. Review & Execute</h3>
              <div className="bg-indigo-50 border border-indigo-100 p-8 rounded-[24px] space-y-6">
                 <div className="flex items-start gap-4">
                    <Info size={24} className="text-indigo-600 shrink-0" />
                    <div>
                       <h4 className="text-[15px] font-bold text-indigo-900">Ready for Production</h4>
                       <p className="text-[13px] font-medium text-indigo-700/80 mt-2 leading-relaxed">
                         Executing this batch will deduct the required raw materials from your inventory and automatically add <strong>{assemblyQty} units</strong> of <strong>{targetProduct?.item || targetProduct?.item_name || ''}</strong> to Finished Goods. This action will be logged in the history.
                       </p>
                    </div>
                 </div>
              </div>
              
              <div className="mt-8 flex justify-between pt-4 border-t border-slate-100">
                <button 
                  onClick={() => setAssemblyStep(2)}
                  className="h-12 px-6 bg-white border border-slate-200 text-slate-600 rounded-xl text-[14px] font-bold hover:bg-slate-50 transition-all"
                >
                  Back
                </button>
                <button 
                  onClick={onExecute}
                  className="h-12 px-8 bg-slate-900 text-white rounded-xl text-[14px] font-black shadow-xl shadow-slate-900/20 hover:bg-indigo-600 transition-all flex items-center gap-2"
                >
                  <ArrowUpRight size={18} /> Confirm & Execute
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
