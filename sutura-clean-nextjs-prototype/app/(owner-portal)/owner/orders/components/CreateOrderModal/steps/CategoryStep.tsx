import React from 'react';
import { User, Users, Scissors, Shirt, ChevronRight } from 'lucide-react';
import { OrderType } from '@/types/erp';

interface CategoryStepProps {
  onSelect: (type: OrderType) => void;
}

export const CategoryStep: React.FC<CategoryStepProps> = ({ onSelect }) => {
  const categories = [
    { id: 'BESPOKE' as OrderType, icon: <User />, label: 'Custom Tailoring', desc: 'Bespoke one-of-a-kind garment', color: 'bg-indigo-600' },
    { id: 'BULK' as OrderType, icon: <Users />, label: 'Bulk Production', desc: 'Uniforms, corporate, teams', color: 'bg-amber-500' },
    { id: 'ALTERATION' as OrderType, icon: <Scissors />, label: 'Alteration Service', desc: 'Adjustments, repairs & resizing', color: 'bg-rose-500' },
    { id: 'READY_MADE' as OrderType, icon: <Shirt />, label: 'Ready-made Sale', desc: 'Instant inventory checkout', color: 'bg-emerald-500' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-black text-slate-900">What type of order is this?</h3>
        <p className="text-slate-400 text-[14px]">Select a production workflow to continue</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {categories.map((type) => (
          <button
            key={type.id}
            onClick={() => onSelect(type.id)}
            className="group relative p-6 bg-white border border-slate-200 rounded-[32px] hover:border-slate-900 hover:shadow-2xl hover:shadow-slate-200 transition-all text-left overflow-hidden"
          >
            <div className={`w-12 h-12 ${type.color} text-white rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              {type.icon}
            </div>
            <h4 className="text-[16px] font-black text-slate-900">{type.label}</h4>
            <p className="text-[12px] text-slate-400 font-medium leading-relaxed mt-1">{type.desc}</p>
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight className="text-slate-900" size={20} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
