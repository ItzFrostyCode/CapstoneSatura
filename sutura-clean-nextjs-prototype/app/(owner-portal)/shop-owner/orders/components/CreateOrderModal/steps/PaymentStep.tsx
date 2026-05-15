import React, { useEffect} from 'react';
import { CreditCard, Zap, ShieldCheck, Calculator, Camera, FileText } from 'lucide-react';
import { useERPStore } from '@/store/useERPStore';
import { GarmentTemplate } from '@/types/erp';
import { OrderFormData } from '../../../../../../../types/orderFormData';

interface PaymentStepProps {
  formData: OrderFormData;
  setFormData: React.Dispatch<React.SetStateAction<OrderFormData>>;
  selectedTemplate: GarmentTemplate | null;
  totalPrice: number;
  financials: Record<string, number>;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({
  formData,
  setFormData,
  selectedTemplate,
  totalPrice,
  financials
}) => {
  const { inventory } = useERPStore();
  const isReadyMade = formData.orderType === 'READY_MADE';
  const isAlteration = formData.orderType === 'ALTERATION';
  
  // Find product name if it's ready-made
  const selectedProduct = isReadyMade ? inventory.find(i => i.id === formData.garmentTemplateId) : null;
  const displayName = isAlteration 
    ? 'Repair Services' 
    : isReadyMade 
      ? (selectedProduct?.item_name || 'Retail Item')
      : (selectedTemplate?.name || 'Custom Garment');

  // Force full payment for Ready-made
  useEffect(() => {
    if (isReadyMade && formData.deposit !== totalPrice) {
      setFormData({ ...formData, deposit: totalPrice });
    }
  }, [isReadyMade, totalPrice, formData, setFormData]);

  const remainingBalance = totalPrice - formData.deposit;

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, paymentReceiptImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 pb-12">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <CreditCard size={14}/> Financial Transaction & Billing
        </h3>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
            isReadyMade ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'
          }`}>
            {isReadyMade ? 'Full Checkout Required' : 'Standard Payment Terms'}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-12 gap-8">
        {/* Left: Price Breakdown */}
        <div className="col-span-7 space-y-6">
          <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
              <Calculator size={120} />
            </div>
            
            <div className="space-y-5 relative z-10">
              <div className="flex justify-between items-center text-slate-400 font-black uppercase tracking-widest text-[10px]">
                <span>Line Items Summary</span>
                <span>Subtotal</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[14px]">
                  <span className="font-bold text-slate-300">
                    {displayName} (x{formData.quantity})
                  </span>
                  <span className="font-black">₱{financials.baseAmount.toLocaleString()}</span>
                </div>

                {financials.rushFee > 0 && (
                  <div className="flex justify-between items-center text-[14px] text-amber-400">
                    <span className="font-bold flex items-center gap-2"><Zap size={14}/> Priority Rush Surcharge</span>
                    <span className="font-black">+ ₱{financials.rushFee.toLocaleString()}</span>
                  </div>
                )}

                {financials.customizationFee > 0 && (
                  <div className="flex justify-between items-center text-[14px] text-indigo-400">
                    <span className="font-bold">Customization Fee</span>
                    <span className="font-black">+ ₱{financials.customizationFee.toLocaleString()}</span>
                  </div>
                )}

                {financials.discount > 0 && (
                  <div className="flex justify-between items-center text-[14px] text-emerald-400">
                    <span className="font-bold">Discount Applied</span>
                    <span className="font-black">- ₱{financials.discount.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="h-px bg-white/10 my-6" />
              
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <span className="text-slate-500 font-black uppercase tracking-widest text-[10px] block">Contract Valuation</span>
                  <div className="text-[42px] font-black tracking-tighter leading-none">₱{totalPrice.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Conditional Digital Payment Fields */}
          {(formData.paymentMethod === 'GCash' || formData.paymentMethod === 'Bank Transfer') && (
            <div className="grid grid-cols-2 gap-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="col-span-1 space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <FileText size={12}/> Receipt Number
                </label>
                <input 
                  type="text"
                  value={formData.paymentReference}
                  onChange={e => setFormData({...formData, paymentReference: e.target.value})}
                  placeholder="e.g. 5001 123 456"
                  className="w-full h-14 px-5 rounded-[20px] border border-slate-200 text-[15px] font-bold outline-none bg-white shadow-sm focus:border-indigo-500 transition-all"
                />
              </div>
              <div className="col-span-1 space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Camera size={12}/> Attach Proof
                </label>
                <div className="relative h-14">
                  <input 
                    type="file"
                    accept="image/*"
                    onChange={handleReceiptUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  <div className={`w-full h-full rounded-[20px] border-2 border-dashed flex items-center justify-center gap-2 transition-all ${
                    formData.paymentReceiptImage ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
                  }`}>
                    {formData.paymentReceiptImage ? <ShieldCheck size={18} /> : <Camera size={18} />}
                    <span className="text-[12px] font-bold uppercase tracking-tight">
                      {formData.paymentReceiptImage ? 'Proof Attached' : 'Upload Receipt'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Payment Entry */}
        <div className="col-span-5 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Payment Received (Deposit)</label>
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₱</div>
                <input 
                  type="number" 
                  disabled={isReadyMade}
                  value={formData.deposit} 
                  onChange={e => setFormData({...formData, deposit: Math.min(totalPrice, parseInt(e.target.value) || 0)})} 
                  className={`w-full h-16 pl-10 pr-5 rounded-[24px] border text-[24px] font-black outline-none transition-all shadow-sm ${
                    isReadyMade ? 'bg-slate-50 border-slate-200 text-slate-400' : 'bg-white border-slate-200 focus:border-slate-900'
                  }`} 
                />
              </div>
              {!isReadyMade && (
                <div className="flex gap-2 mt-2">
                  <button onClick={() => setFormData({...formData, deposit: Math.round(totalPrice * 0.5)})} className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-[10px] font-black text-slate-600 transition-colors uppercase">50% Deposit</button>
                  <button onClick={() => setFormData({...formData, deposit: totalPrice})} className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-[10px] font-black text-slate-600 transition-colors uppercase">Pay Full</button>
                </div>
              )}
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Channel</label>
              <select 
                value={formData.paymentMethod} 
                onChange={e => setFormData({...formData, paymentMethod: e.target.value})} 
                className="w-full h-14 px-5 rounded-[20px] border border-slate-200 text-[15px] font-bold outline-none bg-white shadow-sm appearance-none"
              >
                <option>Cash</option>
                <option>GCash</option>
                <option>Bank Transfer</option>
              </select>
            </div>

            <div className={`p-6 rounded-[32px] border flex flex-col justify-between h-32 transition-all ${
              remainingBalance === 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'
            }`}>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unpaid Balance</span>
              <div className="flex items-end justify-between">
                <span className={`text-[28px] font-black leading-none ${remainingBalance === 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                  ₱{remainingBalance.toLocaleString()}
                </span>
                {remainingBalance === 0 && <ShieldCheck size={24} className="text-emerald-500" />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
