'use client';

import { useState } from 'react';
import { useERPStore } from '../../../store/useERPStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Zap, Scissors, Shirt, Users, AlertTriangle, CheckCircle2, ShoppingCart, Calendar, AlertCircle, Image as ImageIcon, X, Plus } from 'lucide-react';

export default function NewJobOrder() {
  const router = useRouter();
  const { customers, measurementProfiles, createNewOrder } = useERPStore();
  const [orderType, setOrderType] = useState<'Solo' | 'Bulk'>('Solo');
  const [rushActive, setRushActive] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedMeasurement, setSelectedMeasurement] = useState('');
  const [garmentType, setGarmentType] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [basePrice, setBasePrice] = useState(4500);
  const [deposit, setDeposit] = useState(0);
  const [isUsingBatch, setIsUsingBatch] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [cashReceived, setCashReceived] = useState<number | ''>('');
  const [assignmentMode, setAssignmentMode] = useState<'auto' | 'manual'>('manual');
  const [assignments, setAssignments] = useState({
    patternMaker: 'John (Pattern Maker)',
    cutter: 'Sarah (Cutter)',
    tailor: 'Mike (Tailor)'
  });
  
  // Product Type State
  const [productType, setProductType] = useState<'Bespoke' | 'Premade'>('Bespoke');
  const [selectedProductSku, setSelectedProductSku] = useState('');

  // Fabric States
  const [fabricName, setFabricName] = useState('');
  const [fabricWidth, setFabricWidth] = useState(60); // Default 60"
  const [swatchImages, setSwatchImages] = useState<string[]>([]);
  
  const { inventory } = useERPStore();
  const finishedGoods = inventory.filter(i => i.cat === 'Finished Goods');
  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  const isSolo = orderType === 'Solo';
  const rushFee = isSolo ? 500 : (basePrice * 0.1);
  const totalPrice = basePrice + (rushActive ? rushFee : 0);

  const handleSubmit = () => {
    if (!selectedCustomer) return;
    if (productType === 'Bespoke' && !garmentType) return;
    if (productType === 'Premade' && !selectedProductSku) return;
    
    const productItem = productType === 'Premade' ? inventory.find(i => i.sku === selectedProductSku) : null;

    createNewOrder({
      customer_id: selectedCustomer.id,
      garment: productType === 'Premade' ? productItem?.item || 'Premade' : garmentType,
      totalValue: totalPrice,
      amountPaid: deposit,
      dueDate: "May 25", 
      priority: rushActive ? 'High' : 'Normal',
      assigned_tailor_id: 'STF-003',
      fabric_name: productType === 'Premade' ? 'In-Stock' : (fabricName || selectedFabric?.name),
      fabric_width: fabricWidth,
      swatch_images: productType === 'Premade' ? (productItem?.image ? [productItem.image] : []) : swatchImages,
      measurement_profile_id: productType === 'Premade' ? undefined : selectedMeasurement,
      is_premade: productType === 'Premade',
      product_sku: productType === 'Premade' ? selectedProductSku : undefined,
    });
    
    router.push('/owner/orders');
  };

  const fabricData: Record<string, { name: string, stock: number, neededPerUnit: number }> = {
    'Polo': { name: 'Pina Silk', stock: 1.5, neededPerUnit: 1.5 },
    'Tuxedo': { name: 'Wool Blend', stock: 5.0, neededPerUnit: 3.5 },
    'Uniform': { name: 'Cotton Blend', stock: 125.5, neededPerUnit: 2.0 },
    'Gown': { name: 'Satin Silk', stock: 10.0, neededPerUnit: 4.5 },
  };

  const selectedFabric = fabricData[garmentType] || null;
  const totalNeeded = selectedFabric ? selectedFabric.neededPerUnit * quantity : 0;
  const hasShortage = selectedFabric ? selectedFabric.stock < totalNeeded : false;
  
  const canAnalyze = selectedCustomerId !== '' && (productType === 'Premade' ? selectedProductSku !== '' : garmentType !== '');
  const canSubmit = canAnalyze && (productType === 'Premade' || !hasShortage);

  const filteredMeasurements = measurementProfiles.filter(m => m.customer_id === selectedCustomerId);
  
  const mockBatches: Record<string, { id: string, name: string, count: number }> = {};

  return (
    <div className="p-8 max-w-[1200px] mx-auto w-full">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/owner/orders" className="w-8 h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors shadow-sm">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">Create New Order</h1>
          <p className="text-[13px] text-slate-500 mt-1 flex items-center gap-1.5">
            <span className="font-semibold text-slate-700">{productType === 'Bespoke' ? 'Bespoke Tailoring' : 'Ready-to-Wear'}</span> · 
            {rushActive && <span className="text-amber-600 font-semibold flex items-center gap-1"><Zap size={12}/> Priority/Rush Active</span>}
            {productType === 'Bespoke' && hasShortage && <span className="text-rose-600 font-semibold ml-1">· Fabric Shortage Detected</span>}
            {!canAnalyze && <span className="text-slate-400 italic">· Select customer and product details to start</span>}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white border border-slate-200 rounded-[32px] shadow-sm overflow-hidden p-8 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Shirt size={16} className="text-indigo-600" /> 1. Order Configuration
              </h3>
              <div className="flex bg-slate-100 p-1 rounded-full gap-1 border border-slate-200">
                <button 
                  onClick={() => setProductType('Bespoke')}
                  className={`px-6 py-2 rounded-full text-[11px] font-black uppercase transition-all ${productType === 'Bespoke' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Bespoke
                </button>
                <button 
                  onClick={() => setProductType('Premade')}
                  className={`px-6 py-2 rounded-full text-[11px] font-black uppercase transition-all ${productType === 'Premade' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Ready-to-Wear
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 block">End Customer</label>
                <select 
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full h-14 px-5 rounded-2xl border border-slate-200 bg-white focus:border-slate-900 outline-none transition-all text-[15px] font-bold shadow-sm appearance-none"
                >
                  <option value="">Select a Customer...</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.id})</option>
                  ))}
                </select>
              </div>

              {productType === 'Bespoke' ? (
                <div>
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Measurement Profile</label>
                  <select 
                    value={selectedMeasurement}
                    onChange={(e) => setSelectedMeasurement(e.target.value)}
                    className="w-full h-14 px-5 rounded-2xl border border-slate-200 bg-white focus:border-slate-900 outline-none transition-all text-[15px] font-bold shadow-sm appearance-none disabled:opacity-50"
                    disabled={!selectedCustomerId}
                  >
                    <option value="">{selectedCustomerId ? 'Select Profile...' : 'Select Customer First'}</option>
                    {filteredMeasurements.map(m => (
                      <option key={m.id} value={m.id}>{m.id} — Recorded {new Date(m.recorded_at).toLocaleDateString()}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Select Product (In Stock)</label>
                  <select 
                    value={selectedProductSku}
                    onChange={(e) => {
                      const sku = e.target.value;
                      setSelectedProductSku(sku);
                      const item = finishedGoods.find(i => i.sku === sku);
                      if (item) setBasePrice(item.price);
                    }}
                    className="w-full h-14 px-5 rounded-2xl border border-slate-200 bg-white focus:border-slate-900 outline-none transition-all text-[15px] font-bold shadow-sm appearance-none"
                  >
                    <option value="">Choose Finished Good...</option>
                    {finishedGoods.map(i => (
                      <option key={i.sku} value={i.sku}>{i.item} (₱{i.price.toLocaleString()} · {i.stock} in stock)</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {productType === 'Bespoke' && (
              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Garment Type</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Polo', 'Tuxedo', 'Uniform', 'Gown'].map(type => (
                    <button
                      key={type}
                      onClick={() => {
                        setGarmentType(type);
                        if (type === 'Polo') setBasePrice(4500);
                        if (type === 'Uniform') setBasePrice(800);
                        if (type === 'Tuxedo') setBasePrice(12000);
                        if (type === 'Gown') setBasePrice(25000);
                      }}
                      className={`h-12 rounded-xl text-[13px] font-bold transition-all border ${garmentType === type ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {productType === 'Bespoke' && (
            <div className={`col-span-2 p-8 bg-indigo-50/30 rounded-[32px] border border-indigo-100 transition-all duration-300 ${!garmentType ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[12px] font-black text-indigo-900 uppercase tracking-widest flex items-center gap-2">
                  <Scissors size={16} className="text-indigo-600" /> 2. Fabric & Swatch Identification
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 block">Fabric Name/Code</label>
                  <input type="text" placeholder="e.g. Pina Silk - White" value={fabricName} onChange={(e) => setFabricName(e.target.value)} className="w-full h-12 px-4 rounded-xl border border-indigo-100 bg-white focus:border-indigo-500 outline-none transition-all text-[14px] font-medium shadow-sm" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 block">Fabric Width (Inches)</label>
                  <input type="number" value={fabricWidth} onChange={(e) => setFabricWidth(Number(e.target.value))} className="w-full h-12 px-4 rounded-xl border border-indigo-100 bg-white focus:border-indigo-500 outline-none transition-all text-[14px] font-bold shadow-sm" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Swatch Photos ({swatchImages.length}/4)</label>
                  {swatchImages.length < 4 && (
                    <button onClick={() => setSwatchImages([...swatchImages, `https://images.unsplash.com/photo-${['1528459801416-a9e53bbf4e17', '1554188248-986adbb73be4', '1511216335778-7cb8f49fa7a3'][swatchImages.length % 3]}?auto=format&fit=crop&q=80&w=200&h=200`])} className="text-[11px] font-black text-indigo-600 uppercase tracking-widest bg-white px-3 py-1.5 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-all flex items-center gap-2 shadow-sm"><Plus size={14} /> Simulate Add</button>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {swatchImages.map((img, idx) => (
                    <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden border-2 border-white shadow-md ring-1 ring-indigo-100">
                      <img src={img} alt={`Swatch ${idx + 1}`} className="w-full h-full object-cover" />
                      <button onClick={() => setSwatchImages(swatchImages.filter((_, i) => i !== idx))} className="absolute top-1.5 right-1.5 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"><X size={12} /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className={`bg-white border border-slate-200 rounded-[32px] shadow-sm p-8 space-y-8 transition-all duration-300 ${!canAnalyze ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
            <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Calendar size={16} className="text-indigo-600" /> {productType === 'Bespoke' ? '3.' : '2.'} Pricing & Schedule
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Base Price (₱)</label>
                <input type="number" value={basePrice} onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)} className="w-full h-14 px-5 rounded-2xl border border-slate-200 bg-white focus:border-slate-900 outline-none transition-all text-[18px] font-black font-mono shadow-sm" />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Initial Deposit (₱)</label>
                <input type="number" value={deposit} onChange={(e) => setDeposit(parseFloat(e.target.value) || 0)} className="w-full h-14 px-5 rounded-2xl border border-slate-200 bg-white focus:border-slate-900 outline-none transition-all text-[18px] font-black font-mono shadow-sm" />
              </div>
            </div>

            {deposit > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100 animate-in slide-in-from-top-2">
                <div>
                  <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2 block">Cash Received (₱)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400 font-bold">₱</span>
                    <input 
                      type="number" 
                      value={cashReceived} 
                      onChange={(e) => setCashReceived(e.target.value === '' ? '' : parseFloat(e.target.value))} 
                      className="w-full h-12 pl-8 pr-4 rounded-xl border border-emerald-100 bg-white focus:border-emerald-500 outline-none transition-all text-[16px] font-black shadow-sm" 
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Change (Sukli)</label>
                  <div className="h-12 flex items-center px-5 bg-slate-900 rounded-xl">
                    <span className="text-[20px] font-black text-emerald-400 tracking-tight">
                      ₱{Math.max(0, (Number(cashReceived) || 0) - deposit).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${rushActive ? 'bg-amber-100 text-amber-600 shadow-sm' : 'bg-slate-200 text-slate-400'}`}><Zap size={24} /></div>
                <div>
                  <h3 className="text-[14px] font-black text-slate-900">Priority / Rush Order</h3>
                  <p className="text-[12px] text-slate-500 font-medium">Auto-calculates rush fee and moves to top of queue.</p>
                </div>
              </div>
              <button onClick={() => setRushActive(!rushActive)} className={`w-14 h-7 rounded-full relative transition-all ${rushActive ? 'bg-amber-500 shadow-md shadow-amber-500/20' : 'bg-slate-300'}`}><div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all shadow-sm ${rushActive ? 'left-8' : 'left-1'}`}></div></button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Smart Fabric Analysis */}
          <div className="bg-slate-900 rounded-xl shadow-lg overflow-hidden text-white relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
            <div className="px-6 py-4 border-b border-white/10 flex items-center gap-2 relative z-10">
              <Scissors size={16} className="text-indigo-400"/>
              <h2 className="text-[14px] font-bold tracking-wider uppercase text-slate-100">Smart Fabric Analysis</h2>
            </div>
            <div className="p-6 relative z-10">
              {!canAnalyze ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                    <AlertTriangle size={20} className="text-slate-500" />
                  </div>
                  <div className="text-[13px] font-bold text-slate-300 mb-1">Ready for Analysis</div>
                  <p className="text-[11px] text-slate-500 px-4">Select a customer, measurement, and garment to calculate material requirements.</p>
                </div>
              ) : (
                <>
                  <div className="mb-5">
                    <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Primary Fabric</div>
                    <div className="text-[15px] font-bold text-white">{selectedFabric?.name} <span className="text-slate-400 font-normal">({selectedFabric?.stock} m in stock)</span></div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Needed</div>
                      <div className="text-[16px] font-bold">{totalNeeded.toFixed(2)} m</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1">In Stock</div>
                      <div className="text-[16px] font-bold text-indigo-300">{selectedFabric?.stock} m</div>
                    </div>
                  </div>

                  {hasShortage ? (
                    <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-2 mb-2">
                        <AlertTriangle size={16} className="text-rose-400 shrink-0 mt-0.5" />
                        <div className="text-[13px] font-bold text-rose-200">Fabric Shortage Detected</div>
                      </div>
                      <div className="text-[12px] text-rose-300/80 mt-2 pt-2 border-t border-rose-500/20">
                        <div className="font-bold mb-1 uppercase tracking-wider text-[10px]">Purchase Recommendation</div>
                        Shortage: {(totalNeeded - selectedFabric!.stock).toFixed(2)} m · Est. ₱{((totalNeeded - selectedFabric!.stock) * 520).toLocaleString()}
                      </div>
                    </div>
                  ) : totalNeeded === selectedFabric?.stock ? (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-2 mb-2">
                        <AlertCircle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                        <div className="text-[13px] font-bold text-amber-200">⚠️ OK now — short for future orders</div>
                      </div>
                      <div className="text-[12px] text-amber-300/80 mt-2 pt-2 border-t border-amber-500/20">
                        You have exactly {selectedFabric?.stock} m. This will consume ALL stock for this material.
                      </div>
                    </div>
                  ) : (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-2 mb-2">
                        <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                        <div className="text-[13px] font-bold text-emerald-200">✅ OK — Stock Available</div>
                      </div>
                      <div className="text-[12px] text-emerald-300/80 mt-2 pt-2 border-t border-emerald-500/20">
                        Safe for production. Remaining stock after this order: {(selectedFabric!.stock - totalNeeded).toFixed(2)} m.
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Task Assignment */}
          <div className={`bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden transition-opacity duration-300 ${!canAnalyze ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-slate-400"/>
                <h2 className="text-[14px] font-bold text-slate-900">Task Assignment</h2>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button onClick={() => setAssignmentMode('auto')} className={`px-2 py-1 text-[10px] font-bold rounded transition-all ${assignmentMode === 'auto' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Auto</button>
                <button onClick={() => setAssignmentMode('manual')} className={`px-2 py-1 text-[10px] font-bold rounded transition-all ${assignmentMode === 'manual' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Manual</button>
              </div>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Pattern Maker</label>
                {assignmentMode === 'auto' ? (
                  <div className="flex items-center gap-2 p-2 border border-slate-200 rounded-md bg-slate-50">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center">A</div>
                    <div className="text-[13px] font-semibold">Auto-Assigned <span className="text-slate-500 font-normal">(Optimal Availability)</span></div>
                  </div>
                ) : (
                  <select 
                    value={assignments.patternMaker}
                    onChange={(e) => setAssignments({...assignments, patternMaker: e.target.value})}
                    className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-[13px] outline-none"
                  >
                    <option>John (Pattern Maker)</option>
                    <option>Sarah (Cutter)</option>
                    <option>Mike (Tailor)</option>
                  </select>
                )}
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Cutter</label>
                {assignmentMode === 'auto' ? (
                  <div className="flex items-center gap-2 p-2 border border-slate-200 rounded-md bg-slate-50">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center justify-center">A</div>
                    <div className="text-[13px] font-semibold">Auto-Assigned <span className="text-slate-500 font-normal">(Optimal Availability)</span></div>
                  </div>
                ) : (
                  <select 
                    value={assignments.cutter}
                    onChange={(e) => setAssignments({...assignments, cutter: e.target.value})}
                    className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-[13px] outline-none"
                  >
                    <option>Sarah (Cutter)</option>
                    <option>John (Pattern Maker)</option>
                    <option>Mike (Tailor)</option>
                  </select>
                )}
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tailor</label>
                {assignmentMode === 'auto' ? (
                  <div className="flex items-center gap-2 p-2 border border-slate-200 rounded-md bg-slate-50">
                    <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 font-bold text-[10px] flex items-center justify-center">A</div>
                    <div className="text-[13px] font-semibold">Auto-Assigned <span className="text-slate-500 font-normal">(Optimal Availability)</span></div>
                  </div>
                ) : (
                  <select 
                    value={assignments.tailor}
                    onChange={(e) => setAssignments({...assignments, tailor: e.target.value})}
                    className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-[13px] outline-none"
                  >
                    <option>Mike (Tailor)</option>
                    <option>John (Pattern Maker)</option>
                    <option>Sarah (Cutter)</option>
                  </select>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <Link href="/owner/orders" className="flex-1 h-12 border border-slate-300 bg-white rounded-lg font-bold text-[14px] text-slate-700 flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm">
              Cancel
            </Link>
            <button 
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`flex-2 h-12 text-white rounded-lg font-bold text-[14px] flex items-center justify-center gap-2 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 ${canSubmit ? 'bg-slate-900 hover:bg-slate-800' : 'bg-slate-300 cursor-not-allowed shadow-none hover:translate-y-0'}`}
            >
              <ShoppingCart size={18} /> Create New Job Order
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
