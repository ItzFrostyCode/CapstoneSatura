import React from 'react';
import { Layout, Clipboard, Plus, Info, X, Ruler, ChevronUp, Eye } from 'lucide-react';
import { OrderFormData } from '@/types/orderFormData';

interface PersonnelSizingStepProps {
  formData: OrderFormData;
  setFormData: React.Dispatch<React.SetStateAction<OrderFormData>>;
  showBulkImport: boolean;
  setShowBulkImport: (val: boolean) => void;
  bulkImportText: string;
  setBulkImportText: (val: string) => void;
  parseBulkText: (text: string) => void;
}

export const PersonnelSizingStep: React.FC<PersonnelSizingStepProps> = ({
  formData,
  setFormData,
  showBulkImport,
  setShowBulkImport,
  bulkImportText,
  setBulkImportText,
  parseBulkText
}) => {
  // Auto-calculate total from matrix
  const matrixTotal = (Object.values(formData.bulkSizeMatrix || {}) as number[]).reduce((sum: number, val: number) => sum + (val || 0), 0);

  return (
    <div className="space-y-10 animate-in slide-in-from-right-4 pb-12">
      {/* SECTION A: PRODUCTION SIZE MATRIX */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Layout size={12}/> Section A: Production Size Matrix
            </h3>
            <p className="text-[9px] text-slate-500 font-medium">Define manufacturing quantities for production planning.</p>
          </div>
          <div className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center gap-3">
            <span className="text-[10px] font-black text-indigo-400 uppercase">Total Production Qty:</span>
            <span className="text-[18px] font-black text-indigo-600">{matrixTotal}</span>
          </div>
        </div>

        <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-200">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {['S', 'M', 'L', 'XL', '2XL', '3XL'].map(size => (
              <div key={size} className="flex flex-col items-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-200 transition-all">
                <span className="text-[14px] font-black text-slate-900 mb-2">{size}</span>
                <div className="flex items-center justify-between w-full mt-auto">
                  <div className="flex items-center gap-1 flex-1">
                    <input 
                      type="number"
                      min="0"
                      value={formData.bulkSizeMatrix[size] || 0}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        setFormData({
                          ...formData,
                          bulkSizeMatrix: { ...formData.bulkSizeMatrix, [size]: Math.max(0, val) }
                        });
                      }}
                      className="w-full text-center text-[20px] font-black text-slate-900 bg-transparent outline-none py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="h-px bg-slate-100 w-full" />

      {/* SECTION B: MEMBER LIST & SIZES */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Clipboard size={12}/> Section B: Member List & Sizes
            </h3>
            <p className="text-[9px] text-slate-500 font-medium">Link specific individuals to sizes and custom measurements.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                const guide = document.getElementById('staff-size-guide');
                if (guide) guide.classList.toggle('hidden');
              }}
              className="h-10 px-4 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-[11px] font-black uppercase hover:bg-emerald-100 transition-all flex items-center gap-2"
            >
              <Info size={14}/> Size Guide
            </button>
            <button 
              onClick={() => setShowBulkImport(!showBulkImport)}
              className="h-10 px-4 border border-slate-200 rounded-xl text-[11px] font-black text-slate-600 uppercase hover:border-indigo-500 hover:text-indigo-600 transition-all flex items-center gap-2"
            >
              <Clipboard size={14}/> {showBulkImport ? 'Close' : 'Bulk Import'}
            </button>
            <button 
              onClick={() => setFormData({
                ...formData, 
                bulkMembers: [...formData.bulkMembers, { 
                  id: `MBR-${Date.now()}`, 
                  name: '', 
                  base_size: 'M', 
                  jersey_number: '', 
                  measurement_type: 'Standard', 
                  adjustment_notes: '',
                  isExpanded: true,
                  measurements: { neck: '', chest: '', waist: '', hips: '', length: '', shoulder: '' }
                }]
              })}
              className="px-4 h-10 bg-slate-900 text-white rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2"
            >
              <Plus size={14}/> Add Person
            </button>
          </div>
        </div>

        {/* Standard Size Guide Table (Toggled) */}
        <div id="staff-size-guide" className="hidden animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="bg-slate-900 rounded-2xl p-6 overflow-hidden border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Standard Size Reference (Inches)</span>
              <span className="text-[9px] font-medium text-slate-400 uppercase">Generic Artisanal Scale</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[10px] text-left">
                <thead>
                  <tr className="text-white border-b border-slate-700">
                    <th className="pb-3 font-black">SIZE</th>
                    <th className="pb-3 font-black">NECK</th>
                    <th className="pb-3 font-black">CHEST</th>
                    <th className="pb-3 font-black">WAIST</th>
                    <th className="pb-3 font-black">HIPS</th>
                    <th className="pb-3 font-black">SHLDR</th>
                  </tr>
                </thead>
                <tbody className="text-white/90">
                  {[
                    { s: 'S', n: '14.5', c: '36-38', w: '30-32', h: '37-39', sh: '17.5' },
                    { s: 'M', n: '15.5', c: '39-41', w: '32-34', h: '40-42', sh: '18.5' },
                    { s: 'L', n: '16.5', c: '42-44', w: '35-37', h: '43-45', sh: '19.5' },
                    { s: 'XL', n: '17.5', c: '45-47', w: '38-40', h: '46-48', sh: '20.5' },
                    { s: '2XL', n: '18.5', c: '48-50', w: '41-43', h: '49-51', sh: '21.5' },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-slate-800 last:border-0">
                      <td className="py-2.5 font-black text-emerald-400">{row.s}</td>
                      <td className="py-2.5 font-bold">{row.n}&quot;</td>
                      <td className="py-2.5 font-bold">{row.c}&quot;</td>
                      <td className="py-2.5 font-bold">{row.w}&quot;</td>
                      <td className="py-2.5 font-bold">{row.h}&quot;</td>
                      <td className="py-2.5 font-bold">{row.sh}&quot;</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {showBulkImport && (
          <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-[13px] font-black text-indigo-900">Rapid Personnel Ingestion</h4>
                <p className="text-[11px] text-indigo-600 font-medium">Format: Name, Size, Jersey# (One per line)</p>
              </div>
              <span className="p-2 bg-white rounded-lg text-indigo-400 shadow-sm"><Info size={16} /></span>
            </div>
            <textarea 
              value={bulkImportText}
              onChange={e => setBulkImportText(e.target.value)}
              placeholder={"John Clock, L, 7\nMaria Santos, M, 12\nAlex Reyes, XL, 23"}
              className="w-full h-32 p-4 rounded-2xl border border-indigo-200 outline-none focus:border-indigo-600 text-[13px] font-medium"
            />
            <button 
              onClick={() => {
                parseBulkText(bulkImportText);
                setBulkImportText('');
                setShowBulkImport(false);
              }}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl text-[12px] font-black uppercase tracking-widest shadow-lg shadow-indigo-200"
            >
              Process & Append Members
            </button>
          </div>
        )}

        <div className="space-y-4">
          {formData.bulkMembers.map((member: any, idx: number) => (
            <div key={member.id} className="space-y-3 animate-in fade-in slide-in-from-right-2">
              <div className="flex gap-3 p-4 bg-slate-50 rounded-[24px] border border-slate-100 items-center shadow-sm">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-[11px]">
                  {idx + 1}
                </div>
                <input 
                  placeholder="Full Name" 
                  value={member.name}
                  onChange={e => {
                    const newMembers = [...formData.bulkMembers];
                    newMembers[idx].name = e.target.value;
                    setFormData({...formData, bulkMembers: newMembers});
                  }}
                  className="flex-[2] h-10 bg-white border border-slate-200 rounded-xl px-4 text-[13px] font-bold text-slate-900 outline-none focus:border-indigo-500"
                />
                <input 
                  placeholder="#" 
                  value={member.jersey_number}
                  onChange={e => {
                    const newMembers = [...formData.bulkMembers];
                    newMembers[idx].jersey_number = e.target.value;
                    setFormData({...formData, bulkMembers: newMembers});
                  }}
                  className="w-16 h-10 bg-white border border-slate-200 rounded-xl px-2 text-center text-[13px] font-black text-indigo-600 outline-none focus:border-indigo-500"
                />
                <select 
                  value={member.measurement_type || 'Standard'}
                  onChange={e => {
                    const newMembers = [...formData.bulkMembers];
                    newMembers[idx].measurement_type = e.target.value;
                    newMembers[idx].isExpanded = e.target.value === 'Custom';
                    setFormData({...formData, bulkMembers: newMembers});
                  }}
                  className={`flex-1 h-10 bg-white border border-slate-200 rounded-xl px-3 text-[11px] font-black uppercase outline-none focus:border-indigo-500`}
                >
                  <option value="Standard">Standard</option>
                  <option value="Custom">Custom</option>
                </select>

                {member.measurement_type === 'Standard' ? (
                  <select 
                    value={member.base_size}
                    onChange={e => {
                      const newMembers = [...formData.bulkMembers];
                      newMembers[idx].base_size = e.target.value;
                      setFormData({...formData, bulkMembers: newMembers});
                    }}
                    className="w-20 h-10 bg-white border border-slate-200 rounded-xl px-2 text-[12px] font-black outline-none focus:border-indigo-500"
                  >
                    {['S', 'M', 'L', 'XL', '2XL', '3XL'].map(s => <option key={s}>{s}</option>)}
                  </select>
                ) : (
                  <button 
                    onClick={() => {
                      const newMembers = [...formData.bulkMembers];
                      newMembers[idx].isExpanded = !newMembers[idx].isExpanded;
                      setFormData({...formData, bulkMembers: newMembers});
                    }}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all ${member.isExpanded ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-indigo-600'}`}
                  >
                    {member.isExpanded ? <ChevronUp size={18} /> : <Eye size={18} />}
                  </button>
                )}

                <button 
                  onClick={() => setFormData({...formData, bulkMembers: formData.bulkMembers.filter((m: any) => m.id !== member.id)})}
                  className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                >
                  <X size={18}/>
                </button>
              </div>

              {/* Custom Measurements for Staff Entry */}
              {member.measurement_type === 'Custom' && member.isExpanded && (
                <div className="mx-6 p-6 bg-white border-2 border-indigo-50 rounded-[28px] space-y-5 animate-in slide-in-from-top-2 duration-300 shadow-md">
                   <div className="flex items-center justify-between">
                     <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                       <Ruler size={14} />
                       Specific Metrics (Inches)
                     </p>
                     <button 
                       onClick={() => {
                         const newMembers = [...formData.bulkMembers];
                         newMembers[idx].isExpanded = false;
                         setFormData({...formData, bulkMembers: newMembers});
                       }}
                       className="text-[9px] font-black text-slate-400 uppercase hover:text-indigo-600"
                     >
                       Save & Minimize
                     </button>
                   </div>
                   <div className="grid grid-cols-3 gap-4">
                     {['neck', 'chest', 'waist', 'hips', 'length', 'shoulder'].map((metric) => (
                       <div key={metric} className="space-y-1.5">
                         <label className="text-[9px] font-black text-slate-400 uppercase tracking-tight ml-1">{metric}</label>
                         <input 
                           type="number"
                           placeholder='0.0"'
                           className="w-full h-10 bg-slate-50 border border-slate-100 rounded-xl px-4 text-[13px] font-bold outline-none focus:bg-white focus:border-indigo-500"
                           value={member.measurements?.[metric] || ''}
                           onChange={(e) => {
                             const newMembers = [...formData.bulkMembers];
                             if (!newMembers[idx].measurements) newMembers[idx].measurements = {};
                             newMembers[idx].measurements[metric] = e.target.value;
                             setFormData({...formData, bulkMembers: newMembers});
                           }}
                         />
                       </div>
                     ))}
                   </div>
                </div>
              )}
            </div>
          ))}
          
          {formData.bulkMembers.length === 0 && (
            <div className="py-16 bg-slate-50 rounded-[40px] border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
              <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center shadow-sm mb-4">
                <Plus size={24} className="text-slate-300" />
              </div>
              <p className="text-[15px] font-black text-slate-900 mb-1">No Members Added</p>
              <p className="text-[11px] font-bold uppercase tracking-widest">Add persons or import a list to begin sizing.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};