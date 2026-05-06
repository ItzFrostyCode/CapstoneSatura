import * as React from 'react';
import Image from 'next/image';
import { Scissors, Info, Camera, X } from 'lucide-react';
import { OrderFormData } from '../../../../../../../types/orderFormData';

interface AlterationItemStepProps {
  formData: OrderFormData;
  setFormData: (val: OrderFormData) => void;
}

export const AlterationItemStep: React.FC<AlterationItemStepProps> = ({
  formData,
  setFormData
}) => {
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          alterationDetails: {
            ...formData.alterationDetails,
            beforePhotos: [...formData.alterationDetails.beforePhotos, reader.result as string]
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 pb-12">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Scissors size={14}/> Item for Alteration
        </h3>
      </div>

      <div className="space-y-6">
        <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-200 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block ml-1">Garment Description</label>
                <input 
                  placeholder="e.g. Navy Blue 3-Piece Suit" 
                  value={formData.alterationDetails.itemDescription}
                  onChange={e => setFormData({
                    ...formData, 
                    alterationDetails: { ...formData.alterationDetails, itemDescription: e.target.value }
                  })}
                  className="w-full h-14 px-6 rounded-2xl border border-slate-200 text-[15px] font-bold outline-none bg-white focus:border-indigo-500 shadow-sm" 
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block ml-1">Garment Condition</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Good', 'Needs Repair', 'Damaged'].map(condition => (
                    <button 
                      key={condition}
                      onClick={() => setFormData({
                        ...formData,
                        alterationDetails: { ...formData.alterationDetails, itemCondition: condition as 'Good' | 'Needs Repair' | 'Damaged' }
                      })}
                      className={`h-12 rounded-xl border text-[11px] font-black uppercase transition-all ${formData.alterationDetails.itemCondition === condition ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-400'}`}
                    >
                      {condition}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Intake Photos (Before)</label>
                <label className="cursor-pointer text-indigo-600 font-black text-[10px] uppercase hover:underline">
                  Add Photo
                  <input type="file" className="hidden" onChange={handlePhotoUpload} accept="image/*" />
                </label>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {formData.alterationDetails.beforePhotos.map((img: string, i: number) => (
                  <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-slate-200 relative group">
                    <Image 
                      src={img} 
                      fill
                      unoptimized
                      className="object-cover" 
                      alt="Intake photo preview" 
                    />
                    <button 
                      onClick={() => setFormData({
                        ...formData,
                        alterationDetails: {
                          ...formData.alterationDetails,
                          beforePhotos: formData.alterationDetails.beforePhotos.filter((_, idx) => idx !== i)
                        }
                      })}
                      className="absolute top-1 right-1 bg-white/90 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-lg text-rose-500"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 transition-all text-slate-400">
                  <Camera size={20} />
                  <input type="file" className="hidden" onChange={handlePhotoUpload} accept="image/*" />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-4">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-rose-500 shadow-sm shrink-0">
            <Info size={20} />
          </div>
          <div className="space-y-1">
            <p className="text-[13px] font-bold text-rose-900">Professional Intake Protocol</p>
            <p className="text-[11px] text-rose-600 font-medium leading-relaxed">Documenting condition and taking &quot;Before&quot; photos is critical for audit-readiness and avoiding liability for pre-existing damages.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
