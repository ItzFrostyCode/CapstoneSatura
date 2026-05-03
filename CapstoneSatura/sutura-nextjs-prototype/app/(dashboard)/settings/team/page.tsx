import { Users2, Plus, Mail, Shield, CheckCircle2 } from 'lucide-react';

export default function TeamManagement() {
  const teamMembers = [
    { name: 'Admin User', role: 'Shop Owner', email: 'admin@sutura.com', status: 'Active', avatar: 'A' },
    { name: 'Maria Garcia', role: 'Master Tailor', email: 'maria@sutura.com', status: 'Active', avatar: 'M' },
    { name: 'Juan Reyes', role: 'Staff / Cutter', email: 'juan@sutura.com', status: 'Invite Sent', avatar: 'J' },
  ];

  return (
    <div className="p-[36px_40px] flex-1 overflow-y-auto max-w-7xl mx-auto w-full">
      <header className="mb-8 flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-[24px] font-bold tracking-tight text-slate-900 drop-shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-indigo-600 text-white rounded-xl flex items-center justify-center shadow-sm">
              <Users2 size={20} />
            </div>
            Team Management
          </h1>
          <p className="text-[14px] text-slate-500 font-medium ml-14">Manage shop staff, tailors, and their access permissions.</p>
        </div>
        <button className="flex items-center gap-2 bg-linear-to-b from-slate-800 to-black text-white h-10 px-5 rounded-xl text-[14px] font-bold shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.2)] transition-all hover:-translate-y-0.5 border border-white/10">
          <Plus size={18} /> Add Team Member
        </button>
      </header>

      <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.03)] mb-10">
        <div className="p-[20px_32px] border-b border-slate-100/50 bg-white/40">
          <div className="text-[16px] font-bold tracking-tight flex items-center gap-2">
            Active Members
            <span className="text-[11px] font-extrabold px-[10px] py-[4px] rounded-[8px] uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-100 ml-2">3 Accounts</span>
          </div>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100/50 bg-slate-50/30">
              <th className="p-[16px_32px] text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Employee</th>
              <th className="p-[16px_32px] text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Contact</th>
              <th className="p-[16px_32px] text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Role Level</th>
              <th className="p-[16px_32px] text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Status</th>
              <th className="p-[16px_32px] text-[11px] font-extrabold text-slate-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.map((member, i) => (
              <tr key={i} className="hover:bg-white/60 border-b border-slate-100/50 transition-colors group cursor-pointer">
                <td className="p-[20px_32px]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-slate-100 to-slate-200 border border-white shadow-sm flex items-center justify-center font-bold text-[14px] text-slate-700 shrink-0">
                      {member.avatar}
                    </div>
                    <div className="text-[14px] font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{member.name}</div>
                  </div>
                </td>
                <td className="p-[20px_32px] text-[13px] font-medium text-slate-500">
                  <div className="flex items-center gap-2"><Mail size={14}/> {member.email}</div>
                </td>
                <td className="p-[20px_32px]">
                  <div className="flex items-center gap-1.5 text-[13px] font-bold text-slate-700">
                    <Shield size={14} className={member.role === 'Shop Owner' ? 'text-amber-500' : 'text-slate-400'}/> {member.role}
                  </div>
                </td>
                <td className="p-[20px_32px]">
                  <span className={`text-[11px] font-bold px-[10px] py-[4px] rounded-[8px] uppercase tracking-wider border flex items-center gap-1 w-max ${
                    member.status === 'Active' 
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' 
                    : 'bg-amber-50 text-amber-600 border-amber-100/50'
                  }`}>
                    {member.status === 'Active' && <CheckCircle2 size={12}/>}
                    {member.status}
                  </span>
                </td>
                <td className="p-[20px_32px] text-right">
                  <button className="text-[13px] font-bold text-slate-400 hover:text-indigo-600 transition-colors px-2 py-1">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
