import React from 'react';
import { Activity, Check, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';
import { InventoryAnalysis, GarmentTemplate } from '@/types/erp';
import { OrderFormData } from '@/types/orderFormData';

interface FabricAnalysisStepProps {
  fabricAnalysis: InventoryAnalysis | null;
  selectedTemplate: GarmentTemplate | null;
  formData: OrderFormData;
  setFormData: React.Dispatch<React.SetStateAction<OrderFormData>>;
}

export const FabricAnalysisStep: React.FC<FabricAnalysisStepProps> = ({
  fabricAnalysis,
  selectedTemplate,
  formData,
  setFormData
}) => {
  if (!fabricAnalysis) return null;

  const healthPercentage = Math.min(100, (fabricAnalysis.available / fabricAnalysis.needed) * 100);
  const isOk = fabricAnalysis.status === 'OK';
  
  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 pb-12">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Activity size={14}/> Smart Inventory Analysis
        </h3>
        {!formData.isCustomerProvidedFabric && (
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${isOk ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
            {isOk ? 'Stock Secured' : 'Action Required'}
          </span>
        )}
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex items-start gap-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => setFormData((p: OrderFormData) => ({ ...p, isCustomerProvidedFabric: !p.isCustomerProvidedFabric }))}>
        <div className={`w-6 h-6 rounded flex items-center justify-center border-2 transition-colors mt-0.5 ${formData.isCustomerProvidedFabric ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white'}`}>
          {formData.isCustomerProvidedFabric && <Check size={14} className="text-white" />}
        </div>
        <div className="flex-1">
          <h4 className="text-[14px] font-black text-slate-900 leading-none mb-1">Customer-Provided Fabric (CMT Mode)</h4>
          <p className="text-[12px] text-slate-500 font-medium">Check this if the customer is bringing their own material. The system will bypass fabric inventory deduction and only charge for labor/trim.</p>
        </div>
      </div>

      <div className={`grid grid-cols-12 gap-6 transition-opacity duration-300 ${formData.isCustomerProvidedFabric ? 'opacity-40 grayscale pointer-events-none' : 'opacity-100'}`}>
        {/* Main Analysis Card */}
        <div className="col-span-12 p-8 bg-white border border-slate-100 rounded-[40px] shadow-sm space-y-8 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h4 className="text-[18px] font-black text-slate-900 leading-none">Resource Forecasting</h4>
              <p className="text-[12px] text-slate-400 font-medium italic">Calculated based on {selectedTemplate?.name} requirements.</p>
            </div>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isOk ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
              {isOk ? <Check size={24} /> : <AlertTriangle size={24} />}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8">
            <div className="space-y-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <TrendingUp size={12}/> Demand
              </span>
              <p className="text-[32px] font-black text-slate-900 leading-none">
                {fabricAnalysis.needed.toFixed(1)}<span className="text-sm ml-1 text-slate-400">m</span>
              </p>
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Activity size={12}/> On Hand
              </span>
              <p className={`text-[32px] font-black leading-none ${isOk ? 'text-slate-900' : 'text-rose-500'}`}>
                {fabricAnalysis.available.toFixed(1)}<span className="text-sm ml-1 text-slate-400">m</span>
              </p>
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <DollarSign size={12}/> Est. Cost
              </span>
              <p className="text-[32px] font-black text-slate-900 leading-none text-indigo-600">
                ₱{(fabricAnalysis.needed * 450).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Health Bar */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
              <span className="text-slate-400">Inventory Health Score</span>
              <span className={isOk ? 'text-emerald-500' : 'text-rose-500'}>{healthPercentage.toFixed(0)}%</span>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
              <div 
                className={`h-full transition-all duration-1000 ${isOk ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]' : 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.4)]'}`} 
                style={{ width: `${healthPercentage}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 italic">
              {isOk 
                ? "Optimal stock levels detected. Proceed with high production confidence."
                : `System detected a shortage of ${fabricAnalysis.shortage.toFixed(1)} meters. Allocation blocked.`}
            </p>
          </div>
        </div>

        {/* Action Recommendation */}
        {!isOk && (
          <div className="col-span-12 p-6 bg-rose-50 border border-rose-100 rounded-[32px] flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-200">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h5 className="text-[14px] font-black text-rose-900 uppercase tracking-tight">Purchase Requisition Recommended</h5>
              <p className="text-[12px] text-rose-700/70 font-medium leading-relaxed mt-0.5">
                The current inventory in Branch #01 is insufficient. You must either procure more fabric from a supplier or transfer stock from another branch before this Job Order can be moved to the Cutting stage.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
