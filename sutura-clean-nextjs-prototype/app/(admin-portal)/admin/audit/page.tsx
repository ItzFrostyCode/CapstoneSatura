'use client';

import React from 'react';
import { 
  History, Search, Filter, 
  ShieldCheck, AlertTriangle, Key,
  UserCheck, RefreshCw, FileText, Eye
} from 'lucide-react';
import { LogDetailModal, AuditLog } from './components/LogDetailModal';

export default function AuditLogsPage() {
  const [selectedLog, setSelectedLog] = React.useState<AuditLog | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const logs: AuditLog[] = [
    { id: 'LOG-8842', action: 'Subscription Renewed', tenant: 'Studio S', admin: 'System', date: 'May 10, 2026 - 14:30', type: 'billing', severity: 'info' },
    { id: 'LOG-8841', action: 'Tenant Verified', tenant: 'Golden Needle Tailoring', admin: 'Admin_Juan', date: 'May 10, 2026 - 11:15', type: 'security', severity: 'success' },
    { id: 'LOG-8840', action: 'Failed Login Attempt (x5)', tenant: 'Metro Threads', admin: 'System', date: 'May 09, 2026 - 22:45', type: 'security', severity: 'warning' },
    { id: 'LOG-8839', action: 'Plan Upgraded (Basic -> Premium)', tenant: 'Manila Bespoke', admin: 'System', date: 'May 09, 2026 - 09:00', type: 'billing', severity: 'info' },
    { id: 'LOG-8838', action: 'Tenant Account Suspended', tenant: 'Tailor Express', admin: 'Admin_Maria', date: 'May 08, 2026 - 16:20', type: 'admin', severity: 'critical' },
  ];

  const getIcon = (type: string) => {
    switch(type) {
      case 'billing': return <RefreshCw size={16} />;
      case 'security': return <ShieldCheck size={16} />;
      case 'admin': return <Key size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const getColor = (severity: string) => {
    switch(severity) {
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'success': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'warning': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'critical': return 'text-rose-600 bg-rose-50 border-rose-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="space-y-8 font-outfit pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Operational Audit</h1>
          <p className="text-slate-500 font-medium mt-1">A secure log of business registrations, subscription events, and account governance.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search logs by ID or Tenant..." 
              className="pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-medium focus:border-indigo-600 outline-none w-72 shadow-sm"
            />
          </div>
          <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Log ID / Date</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Event Action</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Account</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Performed By</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log, i) => (
                <tr 
                  key={i} 
                  onClick={() => { setSelectedLog(log); setIsModalOpen(true); }}
                  className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                >
                  <td className="px-8 py-5">
                    <div className="text-sm font-black text-slate-900">{log.id}</div>
                    <div className="text-[11px] font-bold text-slate-400">{log.date}</div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${getColor(log.severity)}`}>
                        {getIcon(log.type)}
                      </div>
                      <span className="text-sm font-bold text-slate-700">{log.action}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-bold text-slate-600">{log.tenant}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-black text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                      {log.admin}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getColor(log.severity)}`}>
                        {log.severity}
                      </span>
                      <Eye size={16} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <LogDetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        log={selectedLog}
      />
    </div>
  );
}
