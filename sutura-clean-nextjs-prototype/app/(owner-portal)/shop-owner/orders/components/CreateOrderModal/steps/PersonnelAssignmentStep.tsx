import React from 'react';
import { Users, Sparkles } from 'lucide-react';
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
  const isAlteration = formData.orderType === 'ALTERATION';
  const displayTasks = isAlteration 
    ? formData.alterationDetails.tasks.map(t => t.title)
    : (selectedTemplate?.default_tasks || []);

  const branchStaff = staff.filter(s => 
    s.branch_id === (currentBranch?.id || 'BRN-001')
  );

  const handleAutoAssign = () => {
    if (branchStaff.length === 0) return;
    
    const assignments: Record<string, string> = {};
    displayTasks.forEach((task: string) => {
      // Find staff whose specialization matches the task title (simple fuzzy match)
      const matches = branchStaff.filter(s => 
        s.specialization?.some(spec => task.toLowerCase().includes(spec.toLowerCase()))
      );
      const candidates = matches.length > 0 ? matches : branchStaff;
      assignments[task] = candidates[Math.floor(Math.random() * candidates.length)].id;
    });
    setFormData({...formData, taskAssignments: assignments});
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4">
      <div className="flex items-center justify-between">
        <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-3xl flex-1 mr-4">
          <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Processing Branch</div>
          <div className="text-[16px] font-black text-indigo-900">{currentBranch?.branchName || 'Main Branch'}</div>
        </div>
        <button 
          type="button"
          onClick={handleAutoAssign}
          className="px-6 h-16 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-[11px] hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center gap-2"
        >
          <Sparkles size={16} className="text-amber-400" />
          Auto-Assign All
        </button>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Users size={14}/> {isAlteration ? 'Repair Assignment' : 'Production Team Assignment'}
          </h3>
        </div>
        
        {displayTasks.length === 0 ? (
          <div className="p-12 border-2 border-dashed border-slate-100 rounded-[40px] text-center">
            <p className="text-[13px] font-bold text-slate-400 italic">No tasks found for assignment.</p>
          </div>
        ) : displayTasks.map((task: string) => {
          return (
            <div key={task} className="p-5 rounded-3xl border border-slate-100 bg-white shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <div className="text-[14px] font-black text-slate-900">{task}</div>
                </div>
                <div className="px-3 py-1 rounded-full bg-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                  {isAlteration ? 'Repair Stage' : 'Production Stage'}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {branchStaff.map(t => {
                  const isSelected = formData.taskAssignments[task] === t.id;
                  
                  return (
                    <button 
                      key={t.id}
                      type="button"
                      onClick={() => setFormData({
                        ...formData, 
                        taskAssignments: { ...formData.taskAssignments, [task]: t.id }
                      })}
                      className={`p-3 rounded-xl border transition-all text-left flex items-center gap-3 relative ${
                        isSelected 
                          ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-600/10' 
                          : 'border-slate-50 hover:border-slate-200 bg-slate-50/50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {t.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-bold text-slate-900 leading-none truncate">{t.name}</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {t.specialization?.map(spec => (
                            <span key={spec} className="text-[8px] font-black bg-white/60 text-slate-500 px-1 py-0.5 rounded border border-slate-100 uppercase truncate">
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
