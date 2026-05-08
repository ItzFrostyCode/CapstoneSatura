import React from 'react';
import { Layout, Clipboard, Plus, Info, X, Scissors, ChevronUp, ChevronDown } from 'lucide-react';
import { OrderFormData, BulkMember } from '@/types/orderFormData';

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

        {/* SIZING REFERENCE GUIDE */}
        <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl flex items-start gap-3">
          <Info size={16} className="text-amber-600 mt-0.5 shrink-0" />
          <div>
            <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest block mb-1">Standard Sizing Reference (Chest Inches)</span>
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              {[
                { s: 'S', v: '36-38"' }, { s: 'M', v: '38-40"' }, { s: 'L', v: '40-42"' },
                { s: 'XL', v: '42-44"' }, { s: '2XL', v: '44-46"' }, { s: '3XL', v: '46-48"' }
              ].map(ref => (
                <div key={ref.s} className="flex items-center gap-1.5">
                  <span className="text-[11px] font-black text-slate-900">{ref.s}:</span>
                  <span className="text-[11px] font-bold text-slate-500">{ref.v}</span>
                </div>
              ))}
            </div>
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
                    <div className="flex flex-col gap-0.5">
                      <button 
                        onClick={() => {
                          const currentVal = formData.bulkSizeMatrix[size] || 0;
                          setFormData({
                            ...formData,
                            bulkSizeMatrix: { ...formData.bulkSizeMatrix, [size]: currentVal + 1 }
                          });
                        }}
                        className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-indigo-600 transition-colors"
                      >
                        <ChevronUp size={12} strokeWidth={3} />
                      </button>
                      <button 
                        onClick={() => {
                          const currentVal = formData.bulkSizeMatrix[size] || 0;
                          if (currentVal > 0) {
                            setFormData({
                              ...formData,
                              bulkSizeMatrix: { ...formData.bulkSizeMatrix, [size]: currentVal - 1 }
                            });
                          }
                        }}
                        className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        <ChevronDown size={12} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="h-px bg-slate-100 w-full" />

      {/* SECTION B: PERSONNEL ASSIGNMENT */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Clipboard size={12}/> Section B: Personnel Assignment
            </h3>
            <p className="text-[9px] text-slate-500 font-medium">Link specific individuals to sizes and custom measurements.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowBulkImport(!showBulkImport)}
              className="h-10 px-4 border border-slate-200 rounded-xl text-[11px] font-black text-slate-600 uppercase hover:border-indigo-500 hover:text-indigo-600 transition-all flex items-center gap-2"
            >
              <Clipboard size={14}/> {showBulkImport ? 'Close' : 'Import CSV/Text'}
            </button>
            <button 
              onClick={() => setFormData({...formData, bulkMembers: [...formData.bulkMembers, { id: `MBR-${Date.now()}`, name: '', base_size: 'M', jersey_number: '', measurement_type: 'Standard', adjustment_notes: '' }]})}
              className="px-4 h-10 bg-slate-900 text-white rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2"
            >
              <Plus size={14}/> Add Member
            </button>
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
              placeholder={"Joshua Arabejo, L, 7\nMaria Santos, M, 12\nAlex Reyes, XL, 23"}
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

        <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-24">Number</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-32">Assigned Size</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Measurement</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {formData.bulkMembers.map((member: BulkMember, idx: number) => (
                <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <input 
                      placeholder="Full Name" 
                      value={member.name}
                      onChange={e => {
                        const newMembers = [...formData.bulkMembers];
                        newMembers[idx].name = e.target.value;
                        setFormData({...formData, bulkMembers: newMembers});
                      }}
                      className="w-full bg-transparent border-none outline-none text-[13px] font-bold text-slate-900"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input 
                      placeholder="--" 
                      value={member.jersey_number}
                      onChange={e => {
                        const newMembers = [...formData.bulkMembers];
                        newMembers[idx].jersey_number = e.target.value;
                        setFormData({...formData, bulkMembers: newMembers});
                      }}
                      className="w-full bg-transparent border-none outline-none text-[13px] font-black text-indigo-600"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      value={member.base_size}
                      onChange={e => {
                        const newMembers = [...formData.bulkMembers];
                        newMembers[idx].base_size = e.target.value;
                        setFormData({...formData, bulkMembers: newMembers});
                      }}
                      className="w-full bg-slate-100 px-3 py-1.5 rounded-xl text-[12px] font-black outline-none border-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      {['S', 'M', 'L', 'XL', '2XL', '3XL'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <select 
                        value={member.measurement_type || 'Standard'}
                        onChange={e => {
                          const newMembers = [...formData.bulkMembers];
                          newMembers[idx].measurement_type = e.target.value;
                          setFormData({...formData, bulkMembers: newMembers});
                        }}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold outline-none border transition-all ${member.measurement_type === 'Custom' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-indigo-50 border-indigo-100 text-indigo-600'}`}
                      >
                        <option value="Standard">Standard</option>
                        <option value="Custom">Custom</option>
                      </select>
                      {member.measurement_type === 'Custom' && (
                        <button className="text-[10px] font-black text-amber-600 uppercase hover:underline flex items-center gap-1">
                          <Scissors size={10}/> Edit Metrics
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setFormData({...formData, bulkMembers: formData.bulkMembers.filter((m: BulkMember) => m.id !== member.id)})}
                      className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all ml-auto"
                    >
                      <X size={14}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {formData.bulkMembers.length === 0 && (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 opacity-50">
              <Plus size={32} className="mb-2" />
              <p className="text-[13px] font-bold">No members assigned yet</p>
              <p className="text-[11px]">The total quantity in Section A is for production planning.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};