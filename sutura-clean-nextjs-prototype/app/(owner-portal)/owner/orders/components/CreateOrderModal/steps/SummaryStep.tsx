import React from 'react';
import { Clipboard, Ruler, Shirt, Scissors, CreditCard, Calendar, User, Info } from 'lucide-react';
import { Customer, Staff, GarmentTemplate, MeasurementProfile } from '@/types/erp';
import { OrderFormData } from '../../../../../../../types/orderFormData';

interface SummaryStepProps {
  formData: OrderFormData;
  setFormData: React.Dispatch<React.SetStateAction<OrderFormData>>;
  selectedCustomer: Customer | undefined;
  selectedTemplate: GarmentTemplate | null;
  measurementProfiles: MeasurementProfile[];
  totalPrice: number;
  financials: Record<string, number>;
  staff: Staff[];
}

export const SummaryStep: React.FC<SummaryStepProps> = ({
  formData,
  setFormData,
  selectedCustomer,
  selectedTemplate,
  measurementProfiles,
  totalPrice,
  financials,
  staff
}) => {
  const profile = measurementProfiles.find(p => p.id === formData.measurementProfileId);
  const isBespoke = formData.orderType === 'BESPOKE';
  const isBulk = formData.orderType === 'BULK';
  const isAlteration = formData.orderType === 'ALTERATION';
  const isReadyMade = formData.orderType === 'READY_MADE';

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 pb-12">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Clipboard size={14}/> Job Order Summary & Audit Review
        </h3>
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
          isBespoke ? 'bg-amber-100 text-amber-700' :
          isBulk ? 'bg-blue-100 text-blue-700' :
          isAlteration ? 'bg-purple-100 text-purple-700' :
          'bg-emerald-100 text-emerald-700'
        }`}>
          {formData.orderType.replace('_', ' ')}
        </span>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Column: Core Details */}
        <div className="col-span-7 space-y-6">
          {/* Specific Details Card */}
          <div className="p-8 bg-white border border-slate-100 rounded-[40px] shadow-sm space-y-6 relative overflow-hidden">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
                {isBespoke && <Ruler size={20} />}
                {isBulk && <User size={20} />}
                {isAlteration && <Scissors size={20} />}
                {isReadyMade && <Shirt size={20} />}
              </div>
              <div>
                <h4 className="text-[16px] font-black text-slate-900 leading-none">
                  {isBulk ? (formData.organizationName || 'Bulk Order') : (isAlteration ? formData.alterationDetails.itemDescription : (selectedTemplate?.name || 'Custom Garment'))}
                </h4>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                  {isBulk ? `${formData.bulkMembers.length} Personnel • ${selectedTemplate?.name || 'Garment Template'}` : `Quantity: ${formData.quantity}`}
                </p>
              </div>
            </div>

            {/* Bespoke Details */}
            {isBespoke && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Fit Preference</span>
                  <p className="text-[13px] font-bold text-slate-900">{profile?.fit_preference || 'Regular'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Profile Version</span>
                  <p className="text-[13px] font-bold text-slate-900">V1 (Manual Entry)</p>
                </div>
              </div>
            )}

            {/* Bulk Details */}
            {isBulk && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 py-3 px-4 bg-slate-50 rounded-2xl">
                  <Info size={14} className="text-blue-500" />
                  <span className="text-[12px] font-bold text-slate-600 italic">
                    Using {formData.bulkSizingStrategy} sizing strategy.
                  </span>
                </div>
                {formData.bulkSizingStrategy === 'STANDARD' && (
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(formData.bulkSizeMatrix).map(([size, qty]) => (qty as number) > 0 && (
                      <span key={size} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-black">
                        {size}: {qty}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Alteration Details */}
            {isAlteration && (
              <div className="space-y-4">
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl">
                  <span className="text-[10px] font-black text-rose-400 uppercase block mb-1">Garment Condition</span>
                  <p className="text-[13px] font-bold text-rose-900 uppercase tracking-widest">{formData.alterationDetails.itemCondition}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-[12px]">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase block">Tasks</span>
                    <p className="font-bold">{formData.alterationDetails.tasks.length} services selected</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase block">Materials</span>
                    <p className="font-bold">{formData.alterationDetails.materialsNeeded.length} allocated items</p>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 space-y-2">
              <span className="text-[10px] font-black text-slate-400 uppercase block ml-1">Final Instructions</span>
              <textarea 
                placeholder="Final production notes..."
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
                className="w-full h-24 p-4 rounded-2xl bg-slate-50 border-none outline-none text-[13px] font-medium"
              />
            </div>
          </div>

          {/* Production Path */}
          <div className="space-y-3">
            <span className="text-[10px] font-black text-slate-400 uppercase block ml-1">Assigned Workflow</span>
            <div className="space-y-2">
              {(isAlteration ? formData.alterationDetails.tasks.map(t => t.title) : (selectedTemplate?.default_tasks || [])).map((task: string) => (
                <div key={task} className="flex justify-between items-center p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                    <span className="text-[13px] font-bold text-slate-600">{task}</span>
                  </div>
                  <span className="text-[12px] font-black text-slate-900">
                    {staff.find(s => s.id === formData.taskAssignments[task])?.name || 'Unassigned'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Financial & Logistics */}
        <div className="col-span-5 space-y-6">
          {/* Logistics Card */}
          <div className="p-6 bg-slate-900 rounded-[40px] text-white shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Calendar size={100} className="rotate-12" />
            </div>
            
            <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                  <User size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Customer Invoiced</p>
                  <h4 className="text-[16px] font-black">{selectedCustomer?.name || 'N/A'}</h4>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Calendar size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Expected Completion</p>
                  <h4 className="text-[16px] font-black">{new Date(formData.estimatedCompletionDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</h4>
                  {formData.isRush && <span className="text-[10px] font-black text-rose-400 uppercase bg-rose-400/10 px-2 py-0.5 rounded-md mt-1 inline-block">Rush Order Applied</span>}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                  <CreditCard size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Payment Strategy</p>
                  <h4 className="text-[16px] font-black">{formData.paymentMethod} {formData.paymentReference ? `(${formData.paymentReference})` : ''}</h4>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 space-y-4 relative z-10">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Total Valuation</span>
                <span className="text-white text-[28px] font-black">₱{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Initial Deposit</span>
                <span className="text-emerald-400 text-[20px] font-black">₱{formData.deposit.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="p-6 border-2 border-dashed border-slate-200 rounded-[40px] text-center space-y-2 opacity-60">
            <Info size={24} className="mx-auto text-slate-300" />
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Audit Ready Statement</p>
            <p className="text-[10px] text-slate-400 italic">This job order will be finalized and recorded in the Shop Branch {formData.branchId} ledger upon confirmation.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
