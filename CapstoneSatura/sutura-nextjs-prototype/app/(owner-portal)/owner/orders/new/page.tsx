'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Zap, Scissors, Shirt, Users, AlertTriangle, CheckCircle2, ShoppingCart, Calendar, AlertCircle } from 'lucide-react';

export default function NewJobOrder() {
  const [orderType, setOrderType] = useState<'Solo' | 'Bulk'>('Solo');
  const [rushActive, setRushActive] = useState(false);
  const [customer, setCustomer] = useState('');
  const [selectedMeasurement, setSelectedMeasurement] = useState('');
  const [garmentType, setGarmentType] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [basePrice, setBasePrice] = useState(4500);
  const [deposit, setDeposit] = useState(2000);
  const [isUsingBatch, setIsUsingBatch] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [assignmentMode, setAssignmentMode] = useState<'auto' | 'manual'>('manual');
  const [assignments, setAssignments] = useState({
    patternMaker: 'John (Pattern Maker)',
    cutter: 'Sarah (Cutter)',
    tailor: 'Mike (Tailor)'
  });

  const isSolo = orderType === 'Solo';
  const rushFee = isSolo ? 500 : (basePrice * 0.1);
  const totalPrice = basePrice + (rushActive ? rushFee : 0);

  const fabricData: Record<string, { name: string, stock: number, neededPerUnit: number }> = {
    'Polo': { name: 'Pina Silk', stock: 1.5, neededPerUnit: 1.5 },
    'Tuxedo': { name: 'Wool Blend', stock: 5.0, neededPerUnit: 3.5 },
    'Uniform': { name: 'Cotton Blend', stock: 125.5, neededPerUnit: 2.0 },
    'Gown': { name: 'Satin Silk', stock: 10.0, neededPerUnit: 4.5 },
  };

  const selectedFabric = fabricData[garmentType] || null;
  const totalNeeded = selectedFabric ? selectedFabric.neededPerUnit * quantity : 0;
  const hasShortage = selectedFabric ? selectedFabric.stock < totalNeeded : false;
  
  // Logic: Smart Analysis only works if Customer, Measurement AND Garment are selected
  const canAnalyze = customer !== '' && garmentType !== '' && selectedMeasurement !== '';

  const customerMeasurements: Record<string, string[]> = {
    'Alexander McQueen': ['v1.2 - Slim Fit Polo (Oct 2023)', 'v1.1 - Standard Shirt (Aug 2023)'],
    'Maria Garcia': ['v2.4 - Wedding Gown Final (Sep 2023)', 'v2.3 - Fitting Draft (July 2023)'],
    'David Torres': ['v1.0 - Linen Set (Sep 2023)'],
    'Elena Gomez': ['v3.1 - Corporate Jacket (Oct 2023)'],
    'Elena Rostova': ['v2.1 - Bespoke Suit (Apr 2026)'],
  };
  
  const mockBatches: Record<string, { id: string, name: string, count: number }> = {
    'Alexander McQueen': { id: 'B-901', name: 'Wedding Party (8 profiles)', count: 8 },
    'David Torres': { id: 'B-905', name: 'Corporate Uniforms (25 profiles)', count: 25 },
  };

  return (
    <div className="p-8 max-w-[1200px] mx-auto w-full">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/owner/orders" className="w-8 h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors shadow-sm">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">Create New Job Order</h1>
          <p className="text-[13px] text-slate-500 mt-1 flex items-center gap-1.5">
            <span className="font-semibold text-slate-700">{orderType} Order</span> · 
            {rushActive && <span className="text-amber-600 font-semibold flex items-center gap-1"><Zap size={12}/> Priority/Rush Active</span>}
            {canAnalyze && hasShortage && <span className="text-rose-600 font-semibold ml-1">· Fabric Shortage Detected</span>}
            {!canAnalyze && <span className="text-slate-400 italic">· Select customer, measurement & garment to start analysis</span>}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Main Details */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Order Details Card */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <h2 className="text-[14px] font-bold text-slate-900 flex items-center gap-2"><Shirt size={16} className="text-slate-400"/> Order Configuration</h2>
              
              <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button onClick={() => setOrderType('Solo')} className={`px-4 py-1.5 text-[12px] font-bold rounded-md transition-all ${isSolo ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Solo</button>
                <button onClick={() => setOrderType('Bulk')} className={`px-4 py-1.5 text-[12px] font-bold rounded-md transition-all ${!isSolo ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Bulk</button>
              </div>
            </div>
            
            <div className="p-6 grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">End Customer <span className="text-rose-500">*</span></label>
                <select 
                  value={customer} 
                  onChange={(e) => {
                    setCustomer(e.target.value);
                    setSelectedMeasurement(''); // Reset measurement on customer change
                  }}
                  className="w-full h-10 px-3 rounded-md border border-slate-200 bg-slate-50 text-[13px] focus:bg-white focus:border-slate-300 outline-none"
                >
                  <option value="">Select a Customer...</option>
                  <option>Alexander McQueen</option>
                  <option>Maria Garcia</option>
                  <option>David Torres</option>
                  <option>Elena Gomez</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Customer Measurement <span className="text-rose-500">*</span></label>
                {!isSolo && (
                  <div className="flex items-center gap-2 mb-2">
                    <button 
                      onClick={() => setIsUsingBatch(!isUsingBatch)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border transition-all ${isUsingBatch ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-200'}`}
                    >
                      {isUsingBatch ? '✅ Using Batch List' : 'Use Batch List?'}
                    </button>
                  </div>
                )}
                {isUsingBatch ? (
                  <select 
                    value={selectedBatch}
                    onChange={(e) => {
                      setSelectedBatch(e.target.value);
                      if (e.target.value) setQuantity(mockBatches[customer]?.count || 1);
                    }}
                    className="w-full h-10 px-3 rounded-md border border-indigo-200 bg-indigo-50/30 text-[13px] font-bold text-indigo-900 outline-none focus:border-indigo-400"
                  >
                    <option value="">Select an Existing Batch...</option>
                    {customer && mockBatches[customer] && (
                      <option value={mockBatches[customer].id}>{mockBatches[customer].name}</option>
                    )}
                  </select>
                ) : (
                  <select 
                    value={selectedMeasurement}
                    onChange={(e) => setSelectedMeasurement(e.target.value)}
                    disabled={!customer}
                    className={`w-full h-10 px-3 rounded-md border text-[13px] outline-none transition-colors ${
                      !customer ? 'bg-slate-100 border-slate-200 text-slate-400' : 'bg-white border-slate-200 text-slate-900 focus:border-slate-300'
                    }`}
                  >
                    <option value="">{customer ? 'Select Measurement Profile...' : 'First select a customer'}</option>
                    {customer && customerMeasurements[customer]?.map((m, i) => (
                      <option key={i} value={m}>{m}</option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Garment Type <span className="text-rose-500">*</span></label>
                <select 
                  value={garmentType} 
                  onChange={(e) => {
                    setGarmentType(e.target.value);
                    if (e.target.value === 'Polo') setBasePrice(4500);
                    if (e.target.value === 'Uniform') setBasePrice(800);
                    if (e.target.value === 'Tuxedo') setBasePrice(12000);
                    if (e.target.value === 'Gown') setBasePrice(25000);
                  }}
                  className="w-full h-10 px-3 rounded-md border border-slate-200 bg-slate-50 text-[13px] focus:bg-white focus:border-slate-300 outline-none"
                >
                  <option value="">Select Garment...</option>
                  <option value="Polo">Polo</option>
                  <option value="Uniform">Uniform</option>
                  <option value="Tuxedo">Tuxedo</option>
                  <option value="Gown">Wedding Gown</option>
                </select>
              </div>

              {!isSolo && (
                <>
                  <div>
                    <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Quantity (pcs) <span className="text-rose-500">*</span></label>
                    <input 
                      type="number" 
                      value={quantity} 
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full h-10 px-3 rounded-md border border-blue-200 bg-blue-50/30 text-blue-900 font-bold text-[13px] outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Size Breakdown</label>
                    <input type="text" placeholder="e.g. S: 5, M: 10..." className="w-full h-10 px-3 rounded-md border border-slate-200 bg-slate-50 text-[13px] outline-none" />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Schedule & Pricing Card */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <h2 className="text-[14px] font-bold text-slate-900 flex items-center gap-2"><Calendar size={16} className="text-slate-400"/> Schedule & Pricing</h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Due Date <span className="text-rose-500">*</span></label>
                  <input type="date" value={isSolo ? "2023-11-20" : "2023-11-30"} readOnly className="w-full h-10 px-3 rounded-md border border-slate-200 bg-slate-50 text-[13px] outline-none" />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Payment Method</label>
                  <select className="w-full h-10 px-3 rounded-md border border-slate-200 bg-slate-50 text-[13px] outline-none">
                    <option>Cash</option>
                    <option>Bank Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Base Price (₱) <span className="text-rose-500">*</span></label>
                  <input 
                    type="number" 
                    value={basePrice} 
                    onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)}
                    className="w-full h-10 px-3 rounded-md border border-slate-200 bg-slate-50 text-[13px] font-mono outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Deposit (₱)</label>
                  <input 
                    type="number" 
                    value={deposit} 
                    onChange={(e) => setDeposit(parseFloat(e.target.value) || 0)}
                    className="w-full h-10 px-3 rounded-md border border-slate-200 bg-slate-50 text-[13px] font-mono outline-none" 
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mb-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${rushActive ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-400'}`}>
                    <Zap size={20} />
                  </div>
                  <div>
                    <h3 className="text-[13px] font-bold text-slate-900">Priority / Rush Order</h3>
                    <p className="text-[11px] text-slate-500">Add rush fee and prioritize in production queue.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setRushActive(!rushActive)}
                  className={`w-12 h-6 rounded-full relative transition-colors ${rushActive ? 'bg-amber-500' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${rushActive ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>

              {rushActive && (
                <div className="bg-amber-50/50 border border-amber-200 rounded-lg p-5">
                  <div className="flex items-end gap-6">
                    <div className="w-1/3">
                      <label className="block text-[12px] font-bold text-amber-900 mb-1.5">{isSolo ? 'Fixed Rush Fee (₱)' : 'Rush Percentage Increase (%)'}</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600 font-bold">{isSolo ? '₱' : '%'}</span>
                        <input type="text" value={isSolo ? "500" : "10"} readOnly className="w-full h-10 pl-8 pr-3 rounded-md border border-amber-300 bg-white text-[13px] font-bold outline-none" />
                      </div>
                    </div>
                    <div className="flex-1 text-right">
                      <div className="text-[12px] text-amber-700 font-medium mb-1">Total (Base ₱{basePrice.toLocaleString()} + {isSolo ? `Rush ₱${rushFee}` : '10% Rush'})</div>
                      <div className="text-[24px] font-bold text-slate-900 tracking-tight">₱{totalPrice.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <label className="block text-[12px] font-bold text-slate-700 mb-1.5">Description & Notes</label>
            <textarea readOnly value={isSolo ? "Polo with mandarin collar, slim fit, 3-button placket. Client prefers light Pina Silk." : "Corporate uniform set. Standard logo embroidery on chest left side."} className="w-full h-24 p-3 rounded-md border border-slate-200 bg-slate-50 text-[13px] outline-none resize-none"></textarea>
          </div>

        </div>

        {/* RIGHT COLUMN: Smart Fabric & Team */}
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
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
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
            <button className="flex-2 h-12 bg-slate-900 text-white rounded-lg font-bold text-[14px] flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:-translate-y-0.5">
              <ShoppingCart size={18} /> Create New Job Order
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
