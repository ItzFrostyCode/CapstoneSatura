'use client';

import { CheckCircle2, Circle, Scissors, Clock, Truck, PackageCheck, AlertCircle } from 'lucide-react';

export interface TrackingTimelineProps {
  currentStatus: string;
}

const STATUSES = [
  { id: 'request_received', label: 'Request Received', desc: 'Your request has been logged.', icon: Clock },
  { id: 'appointment_scheduled', label: 'Appointment Scheduled', desc: 'Shop has confirmed your date.', icon: CheckCircle2 },
  { id: 'in_production', label: 'In Production', desc: 'Fabric is cut and sewing has begun.', icon: Scissors },
  { id: 'ready_for_fitting', label: 'Ready for Fitting', desc: 'Please visit the shop for sizing.', icon: AlertCircle },
  { id: 'final_adjustments', label: 'Final Adjustments', desc: 'Perfecting the final details.', icon: Scissors },
  { id: 'ready_for_pickup', label: 'Ready for Pickup', desc: 'Your garment is finished.', icon: PackageCheck },
  { id: 'released', label: 'Released', desc: 'Transaction complete.', icon: Truck },
];

export default function TrackingTimeline({ currentStatus }: TrackingTimelineProps) {
  const currentIndex = STATUSES.findIndex(s => s.id === currentStatus);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="w-full max-w-md mx-auto py-8">
      <div className="relative pl-8 border-l-2 border-slate-100 space-y-10">
        {STATUSES.map((status, idx) => {
          const isCompleted = idx < activeIndex;
          const isActive = idx === activeIndex;
          const isPending = idx > activeIndex;

          const Icon = status.icon;

          return (
            <div key={status.id} className="relative group">
              {/* Timeline Node */}
              <div className={`absolute -left-[41px] w-5 h-5 rounded-full flex items-center justify-center border-4 border-white
                ${isCompleted ? 'bg-slate-900 text-white' : 
                  isActive ? 'bg-indigo-600 text-white ring-4 ring-indigo-50 animate-pulse' : 
                  'bg-slate-200'}`}
              >
              </div>

              {/* Content */}
              <div className={`transition-all duration-300 ${isPending ? 'opacity-40' : 'opacity-100'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className={`text-[15px] font-bold ${isActive ? 'text-indigo-600' : 'text-slate-900'}`}>
                    {status.label}
                  </h4>
                  {isActive && <span className="text-[10px] font-black tracking-widest uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">Current</span>}
                </div>
                <p className="text-[13px] text-slate-500 font-medium">{status.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
