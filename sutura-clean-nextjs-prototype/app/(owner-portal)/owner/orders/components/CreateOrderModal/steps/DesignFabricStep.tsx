import React from 'react';
import { Image as ImageIcon, Plus, X, Camera } from 'lucide-react';
import Image from 'next/image';
import { AssetType } from '@/types/erp';
import { OrderFormData } from '@/types/orderFormData';

interface DesignFabricStepProps {
  formData: OrderFormData;
  setFormData: (val: OrderFormData) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddDesignAsset: (type: string) => void;
  onAddExternalLink: () => void;
}

export const DesignFabricStep: React.FC<DesignFabricStepProps> = ({
  formData,
  setFormData,
  onFileChange,
  onAddDesignAsset,
  onAddExternalLink
}) => {
  return (
    <div className="space-y-8 animate-in slide-in-from-right-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <ImageIcon size={14}/> Design & Fabric Assets
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Left: Fabric Technicals */}
        <div className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-100 space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase">Fabric Specification</h4>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block opacity-60">Fabric Name/Code</label>
                <input 
                  value={formData.fabricName}
                  onChange={e => setFormData({...formData, fabricName: e.target.value})}
                  placeholder="e.g. Navy Blue Wool (W-001)" 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-slate-900 text-[13px] font-medium" 
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block opacity-60">Roll Width (Inches)</label>
                <input 
                  type="number"
                  value={formData.fabricWidth}
                  onChange={e => setFormData({...formData, fabricWidth: Number(e.target.value)})}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-slate-900 text-[13px] font-medium" 
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black text-slate-400 uppercase">Fabric Swatches</h4>
              <label className="cursor-pointer text-indigo-600 font-black text-[10px] uppercase hover:underline">
                Upload Swatch
                <input type="file" className="hidden" onChange={onFileChange} accept="image/*" />
              </label>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {formData.swatchImages.map((img: string, i: number) => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-slate-100 relative group">
                  <Image 
                    src={img} 
                    alt="Swatch" 
                    fill
                    unoptimized
                    className="object-cover" 
                  />
                  <button 
                    onClick={() => setFormData({...formData, swatchImages: formData.swatchImages.filter((_: string, idx: number) => idx !== i)})}
                    className="absolute top-1 right-1 bg-white/90 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-lg text-rose-500"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 transition-all text-slate-400 hover:text-slate-600">
                <Camera size={20} />
                <span className="text-[10px] font-bold">Add</span>
                <input type="file" className="hidden" onChange={onFileChange} accept="image/*" />
              </label>
            </div>
          </div>
        </div>

        {/* Right: Design References */}
        <div className="space-y-6">
          <div className="bg-indigo-50/50 p-6 rounded-[32px] border border-indigo-100/50 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Design Assets & Files</h4>
              <button 
                onClick={() => onAddDesignAsset('MOCKUP')}
                className="p-1.5 bg-white rounded-lg shadow-sm text-indigo-600 hover:scale-110 transition-all"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {formData.designAssets.map((asset, i: number) => (
                <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-indigo-100/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <select 
                      value={asset.type}
                      onChange={e => {
                        const newAssets = [...formData.designAssets];
                        newAssets[i].type = e.target.value as AssetType;
                        setFormData({...formData, designAssets: newAssets});
                      }}
                      className="text-[10px] font-black text-slate-500 uppercase outline-none bg-transparent"
                    >
                      <option value="FRONT_DESIGN">Front Design</option>
                      <option value="BACK_DESIGN">Back Design</option>
                      <option value="LOGO">Team Logo</option>
                      <option value="SPONSOR">Sponsor Logo</option>
                      <option value="MOCKUP">Full Mockup</option>
                      <option value="REFERENCE">Style Reference</option>
                    </select>
                    <button 
                      onClick={() => setFormData({...formData, designAssets: formData.designAssets.filter((_, idx: number) => idx !== i)})}
                      className="text-slate-300 hover:text-rose-500 transition-all"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <label className="flex-1 cursor-pointer group">
                      <div className="w-full py-2 px-3 border-2 border-dashed border-slate-100 rounded-xl flex items-center justify-center gap-2 text-slate-400 group-hover:bg-slate-50 transition-all">
                        <Camera size={14} />
                        <span className="text-[11px] font-bold">Upload File</span>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const newAssets = [...formData.designAssets];
                              newAssets[i].file = reader.result as string;
                              setFormData({...formData, designAssets: newAssets});
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    {asset.file && (
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 shrink-0 shadow-sm relative">
                        <Image src={asset.file} alt="Design Asset" fill unoptimized className="object-cover" />
                      </div>
                    )}
                  </div>
                  <input 
                    placeholder="Design notes (e.g. Sublimation print)"
                    value={asset.notes}
                    onChange={e => {
                      const newAssets = [...formData.designAssets];
                      newAssets[i].notes = e.target.value;
                      setFormData({...formData, designAssets: newAssets});
                    }}
                    className="w-full text-[11px] font-medium outline-none text-slate-500 placeholder:text-slate-300"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black text-slate-400 uppercase">External Links (Drive/Canva)</h4>
              <button onClick={onAddExternalLink} className="text-indigo-600 hover:scale-110 transition-all">
                <Plus size={16} />
              </button>
            </div>
            <div className="space-y-3">
              {formData.externalLinks.map((link, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <input 
                    placeholder="Label (e.g. Google Drive)"
                    value={link.label}
                    onChange={e => {
                      const newLinks = [...formData.externalLinks];
                      newLinks[i].label = e.target.value;
                      setFormData({...formData, externalLinks: newLinks});
                    }}
                    className="w-1/3 px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-slate-900 text-[11px] font-bold uppercase tracking-tight"
                  />
                  <input 
                    placeholder="Paste URL here..."
                    value={link.url}
                    onChange={e => {
                      const newLinks = [...formData.externalLinks];
                      newLinks[i].url = e.target.value;
                      setFormData({...formData, externalLinks: newLinks});
                    }}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-slate-900 text-[11px] font-medium"
                  />
                  <button 
                    onClick={() => setFormData({...formData, externalLinks: formData.externalLinks.filter((_, idx: number) => idx !== i)})}
                    className="text-slate-300 hover:text-rose-500 transition-all"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
