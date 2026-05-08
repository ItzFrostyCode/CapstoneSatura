import React from 'react';
import { Users } from 'lucide-react';
import { Staff, ShopBranch, GarmentTemplate } from '@/types/erp';
import { OrderFormData } from '@/types/orderFormData';

interface PersonnelAssignmentStepProps {
  staff: Staff[];
  currentBranch: ShopBranch | null;
  selectedTemplate: GarmentTemplate | null;
  formData: OrderFormData;
  setFormData: React.Dispatch<React.SetStateAction<OrderFormData>>;
}

export const PersonnelAssignmentStep: React.FC<PersonnelAssignmentStepProps> = ({
  staff,
  currentBranch,
  selectedTemplate,
  formData,
  setFormData
}) => {
  return (
    <div className="space-y-8 animate-in slide-in-from-right-4">
      <div className="flex items-center justify-between">
        <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-3xl flex-1 mr-4">
          <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Processing Branch</div>
          <div className="text-[16px] font-black text-indigo-900">{currentBranch?.branchName || 'Main Branch'}</div>
        </div>
        <button 
          onClick={() => {
            const localStaff = staff.filter(s => s.branch_id === (currentBranch?.id || 'BRN-001'));
            const assignments: Record<string, string> = {};
            (selectedTemplate?.default_tasks || []).forEach((task: string, idx: number) => {
              assignments[task] = localStaff[idx % localStaff.length]?.id;
            });
            setFormData({...formData, taskAssignments: assignments});
          }}
          className="px-6 h-16 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-[11px] hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
        >
          Auto-Assign (Workload)
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
          <Users size={14}/> Production Team Assignment
        </h3>
        {(selectedTemplate?.default_tasks || []).map((task: string) => (
          <div key={task} className="p-5 rounded-3xl border border-slate-100 bg-white shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-[14px] font-black text-slate-900">{task}</div>
              <div className="px-3 py-1 rounded-full bg-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-tighter">Production Stage</div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {staff.filter(s => s.branch_id === (currentBranch?.id || 'BRN-001') && s.roles.includes('Tailor')).map(t => (
                <button 
                  key={t.id}
                  onClick={() => setFormData({
                    ...formData, 
                    taskAssignments: { ...formData.taskAssignments, [task]: t.id }
                  })}
                  className={`p-3 rounded-xl border transition-all text-left flex items-center gap-3 ${formData.taskAssignments[task] === t.id ? 'border-indigo-600 bg-indigo-50' : 'border-slate-50 hover:border-slate-200 bg-slate-50/50'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black ${formData.taskAssignments[task] === t.id ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-[12px] font-bold text-slate-900 leading-none">{t.name}</div>
                    <div className="text-[10px] text-slate-400 font-medium">Workload: 4</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
