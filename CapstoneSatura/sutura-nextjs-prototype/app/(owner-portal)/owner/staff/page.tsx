'use client';

import { 
  Users2, 
  Plus, 
  Mail, 
  Shield, 
  CheckCircle2, 
  MoreVertical, 
  Search, 
  Filter, 
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  Phone,
  Clock,
  Calendar,
  X,
  FileText,
  Activity,
  User,
  Settings,
  Briefcase,
  Scissors
} from 'lucide-react';
import { useState } from 'react';
import teamMembersData from '@/data/staff.json';

interface StaffMember {
  name: string;
  role: string;
  email: string;
  phone: string;
  status: string;
  avatar: string;
  color: string;
}

export default function TeamManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [drawerTab, setDrawerTab] = useState('overview');
  const [activeTab, setActiveTab] = useState('Users');
  const [isRolesModalOpen, setIsRolesModalOpen] = useState(false);
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  
  const teamMembers = teamMembersData as StaffMember[];

  const systemUsersCount = teamMembers.filter(m => m.role === 'Staff' || m.role === 'Shop Owner').length;
  const tailoringTeamCount = teamMembers.filter(m => m.role === 'Measure' || m.role === 'Cutting' || m.role === 'Sewing' || m.role === 'QC Check').length;

  const stats = [
    { label: "Total Staff", val: teamMembers.length.toString(), trend: "Active", color: "indigo" },
    { label: "On Duty Today", val: (teamMembers.length - 2).toString(), trend: "Normal", color: "emerald" },
    { label: "System Users", val: systemUsersCount.toString(), trend: "Admin", color: "amber" },
    { label: "Tailoring Team", val: tailoringTeamCount.toString(), trend: "Production", color: "sky" },
  ];

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'Users') {
      return matchesSearch && (member.role === 'Shop Owner' || member.role === 'Staff');
    }
    return matchesSearch && (member.role === 'Measure' || member.role === 'Cutting' || member.role === 'Sewing' || member.role === 'QC Check');
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight leading-none">Staff Directory</h1>
          <p className="text-[14px] text-slate-500 font-medium mt-1">Manage your tailoring team and administrative permissions.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsRolesModalOpen(true)}
            className="bg-white text-slate-600 h-11 px-5 rounded-xl text-[13px] font-bold border border-slate-200 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
          >
            <ShieldAlert size={16} /> Roles & Permissions
          </button>
          <button 
            onClick={() => setIsAddStaffModalOpen(true)}
            className="bg-slate-900 text-white h-11 px-6 rounded-xl text-[13px] font-black hover:bg-indigo-600 transition-all shadow-lg shadow-slate-900/10 flex items-center gap-2"
          >
            <Plus size={18} /> Add New Staff
          </button>
        </div>
      </div>

      {/* ── KPI GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((kpi, i) => (
          <div key={i} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[12px] font-bold text-slate-500">{kpi.label}</span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${kpi.trend === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
                {kpi.trend}
              </span>
            </div>
            <div className="text-[28px] font-black text-slate-900 tracking-tight">{kpi.val}</div>
          </div>
        ))}
      </div>

      {/* Secondary Navigation Tabs */}
      <div className="flex flex-wrap bg-slate-100/80 p-1.5 rounded-full w-max gap-1 border border-slate-200/50">
        {[
          { id: 'Users', name: 'System Users', icon: <ShieldCheck size={14} /> },
          { id: 'Employees', name: 'Tailoring Employees', icon: <Scissors size={14} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2.5 px-6 py-2.5 rounded-full text-[12px] font-black transition-all uppercase tracking-widest whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-white text-slate-900 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] border border-slate-200/50' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>


      {/* ── MAIN CONTENT ── */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Integrated Search/Filter Bar */}
        <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative group flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search staff by name, role or email..." 
              className="h-10 w-full pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium outline-none focus:bg-white focus:border-slate-900 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <button className="h-10 px-4 bg-white border border-slate-200 rounded-xl flex items-center gap-2 text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-all">
              <Filter size={16} /> All Roles
            </button>
            <button className="h-10 px-4 bg-white border border-slate-200 rounded-xl flex items-center gap-2 text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-all">
              <Settings size={16} /> Configure
            </button>
          </div>
        </div>

        {/* Staff Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                <th className="px-6 py-4">Member Identity</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Email Address</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredMembers.map((member, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-6 py-5">
                    <div>
                      <div className="text-[15px] font-black text-slate-900 leading-none mb-1">{member.name}</div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">STF-2023-{i+1}</div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                     <div className="flex items-center gap-2.5">
                       <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                         member.role === 'Shop Owner' ? 'bg-amber-50 text-amber-600' : 
                         member.role === 'Measure' ? 'bg-emerald-50 text-emerald-600' :
                         member.role === 'Cutting' ? 'bg-rose-50 text-rose-600' :
                         member.role === 'Sewing' ? 'bg-indigo-50 text-indigo-600' :
                         member.role === 'QC Check' ? 'bg-sky-50 text-sky-600' :
                         'bg-slate-50 text-slate-600'
                       }`}>
                         <ShieldCheck size={16} />
                       </div>
                       <span className="text-[14px] font-bold text-slate-700">{member.role}</span>
                     </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[14px] font-medium text-slate-500">{member.phone}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[14px] font-medium text-slate-500">{member.email}</span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setSelectedStaff(member)}
                        className="h-9 px-4 rounded-lg bg-white border border-slate-200 text-slate-900 text-[12px] font-bold hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm"
                      >
                        Manage
                      </button>
                      <button className="h-9 w-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors shadow-sm">
                        <MoreVertical size={16}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
          <p className="text-[12px] text-slate-500 font-medium">Showing <span className="font-bold text-slate-900">{filteredMembers.length}</span> members in organization</p>
          <div className="flex items-center gap-2">
            <button className="h-9 px-4 rounded-lg bg-white border border-slate-200 text-[12px] font-bold text-slate-400 cursor-not-allowed">Previous</button>
            <button className="h-9 px-4 rounded-lg bg-white border border-slate-200 text-[12px] font-bold text-slate-900 hover:bg-slate-50 transition-colors">Next <ChevronRight size={14} className="inline ml-1"/></button>
          </div>
        </div>
      </div>

      {/* ── STAFF DETAIL DRAWER ── */}
      {selectedStaff && (
        <>
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110] animate-in fade-in duration-300"
            onClick={() => setSelectedStaff(null)}
          />
          <div className="fixed top-0 right-0 w-full max-w-[600px] h-full bg-white z-[120] shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-[24px]">
                  {selectedStaff.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-[22px] font-black text-slate-900 tracking-tight leading-none">{selectedStaff.name}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[11px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-wider">{selectedStaff.role}</span>
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">ID: STF-2023-01</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedStaff(null)} className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"><X size={20}/></button>
            </div>

            <div className="flex px-8 border-b border-slate-100 bg-slate-50/30">
              {['overview', 'activity', 'permissions'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setDrawerTab(tab)}
                  className={`h-14 px-6 text-[13px] font-black uppercase tracking-widest transition-all relative ${drawerTab === tab ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {tab}
                  {drawerTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-900 rounded-t-full" />}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
              {drawerTab === 'overview' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Address</div>
                      <div className="text-[14px] font-bold text-slate-900">{selectedStaff.email}</div>
                    </div>
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Phone Number</div>
                      <div className="text-[14px] font-bold text-slate-900">+63 912 345 6789</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                      <Briefcase size={16} className="text-slate-400" /> Professional Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between p-4 rounded-xl border border-slate-100 bg-white">
                        <span className="text-[13px] font-medium text-slate-500">Employment Type</span>
                        <span className="text-[13px] font-black text-slate-900">Full-Time / Bespoke</span>
                      </div>
                      <div className="flex justify-between p-4 rounded-xl border border-slate-100 bg-white">
                        <span className="text-[13px] font-medium text-slate-500">Joined Date</span>
                        <span className="text-[13px] font-black text-slate-900">Oct 20, 2023</span>
                      </div>
                      <div className="flex justify-between p-4 rounded-xl border border-slate-100 bg-white">
                        <span className="text-[13px] font-medium text-slate-500">Assigned Branch</span>
                        <span className="text-[13px] font-black text-slate-900">Main Headquarters</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                      <Activity size={16} className="text-slate-400" /> Performance Metrics
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-5 rounded-2xl border border-slate-100 bg-emerald-50/30">
                        <div className="text-[24px] font-black text-emerald-600">98%</div>
                        <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Task Accuracy</div>
                      </div>
                      <div className="p-5 rounded-2xl border border-slate-100 bg-indigo-50/30">
                        <div className="text-[24px] font-black text-indigo-600">12</div>
                        <div className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider">Orders Today</div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {drawerTab === 'activity' && (
                <div className="space-y-6">
                  {[
                    { action: 'Completed Job Order', target: 'ORD-1024', time: '2 hours ago', icon: <CheckCircle2 size={16}/> },
                    { action: 'Updated Measurements', target: 'CUST-201', time: '5 hours ago', icon: <FileText size={16}/> },
                    { action: 'Logged in to Dashboard', target: 'HQ Terminal', time: '8 hours ago', icon: <Clock size={16}/> },
                  ].map((act, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                        {act.icon}
                      </div>
                      <div className="pt-1">
                        <div className="text-[14px] font-bold text-slate-900">{act.action}</div>
                        <div className="text-[12px] text-slate-500 font-medium">Target: <span className="text-slate-700 font-bold">{act.target}</span> · {act.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-8 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
              <button className="px-6 h-11 rounded-xl text-[13px] font-black text-rose-600 hover:bg-rose-50 transition-all flex items-center gap-2">
                Deactivate Member
              </button>
              <div className="flex gap-3">
                <button className="px-6 h-11 rounded-xl bg-white border border-slate-200 text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-all">Send Message</button>
                <button className="px-6 h-11 rounded-xl bg-slate-900 text-white text-[13px] font-black hover:bg-indigo-600 transition-all">Update Access</button>
              </div>
            </div>
          </div>
        </>
      )}
      {/* ── ROLES & PERMISSIONS MODAL ── */}
      {isRolesModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[600px] rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div>
                <h2 className="text-[20px] font-black text-slate-900 tracking-tight">Roles & Privileges</h2>
                <p className="text-[13px] text-slate-500 font-medium">Configure access levels for each department.</p>
              </div>
              <button onClick={() => setIsRolesModalOpen(false)} className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"><X size={20}/></button>
            </div>
            
            <div className="p-8 space-y-6">
              {[
                { role: 'Shop Owner', desc: 'Full administrative access to all branches and financials.', icon: <Shield size={18} /> },
                { role: 'Staff', desc: 'Standard access to orders, measurements, and production.', icon: <Users2 size={18} /> },
                { role: 'Measure', desc: 'Specialized access to client measurements and body profiling.', icon: <FileText size={18} /> },
                { role: 'Cutting', desc: 'Access to fabric inventory and pattern drafting tasks.', icon: <Scissors size={18} /> },
                { role: 'Sewing', desc: 'Focus on production timeline and garment construction.', icon: <Zap size={18} /> },
                { role: 'QC Check', desc: 'Final quality assurance and order release permissions.', icon: <ClipboardCheck size={18} /> },
              ].map((r, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-all group cursor-pointer bg-white">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      {r.icon}
                    </div>
                    <div>
                      <div className="text-[14px] font-black text-slate-900">{r.role}</div>
                      <p className="text-[12px] text-slate-500 font-medium">{r.desc}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
                </div>
              ))}
            </div>

            <div className="p-8 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button onClick={() => setIsRolesModalOpen(false)} className="px-8 h-12 bg-slate-900 text-white rounded-xl text-[14px] font-black shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all">Save Configuration</button>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD NEW STAFF MODAL ── */}
      {isAddStaffModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[550px] rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div>
                <h2 className="text-[20px] font-black text-slate-900 tracking-tight">Add New Staff</h2>
                <p className="text-[13px] text-slate-500 font-medium">Invite a new member to your tailoring team.</p>
              </div>
              <button onClick={() => setIsAddStaffModalOpen(false)} className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"><X size={20}/></button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Full Name</label>
                  <input type="text" placeholder="e.g. Juan Dela Cruz" className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-medium" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Email Address</label>
                    <input type="email" placeholder="email@example.com" className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-medium" />
                  </div>
                  <div>
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Temporary Password</label>
                    <input type="password" placeholder="••••••••" className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-medium" />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Assign Primary Role</label>
                  <select className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-medium appearance-none">
                    <option>Shop Owner</option>
                    <option>Staff</option>
                    <option>Measure</option>
                    <option>Cutting</option>
                    <option>Sewing</option>
                    <option>QC Check</option>
                  </select>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="text-[14px] font-black text-indigo-900">Access Permissions</h4>
                  <p className="text-[12px] text-indigo-700/70 font-medium leading-relaxed mt-0.5">Permissions are automatically assigned based on the role. You can customize them later in the Manage section.</p>
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setIsAddStaffModalOpen(false)} className="px-6 h-12 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
              <button onClick={() => setIsAddStaffModalOpen(false)} className="px-8 h-12 bg-slate-900 text-white rounded-xl text-[14px] font-black shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all">Add Member</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function Zap({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      <path d="M13 2 L3 14 12 14 11 22 21 10 12 10 13 2 Z" />
    </svg>
  );
}

function ClipboardCheck({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="m9 14 2 2 4-4" />
    </svg>
  );
}
