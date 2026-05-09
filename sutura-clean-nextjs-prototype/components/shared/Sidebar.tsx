'use client';

import Link from 'next/link';
import { 
  Scissors, Home, UserPlus, Calendar, 
  ShoppingBag, PackageSearch, Building2, Users, 
  Receipt, BarChart3, ChevronLeft, ChevronRight, HelpCircle,
  Activity, Ruler, ListTodo
} from 'lucide-react';
import { useERPStore } from '../../store/useERPStore';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  pathname: string;
  currentPlan: string;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  roles?: string[];
}

const ownerNavItems: NavItem[] = [
  { name: 'Home', path: '/owner/dashboard', icon: <Home size={20} /> },
  { name: 'Customers', path: '/owner/customers', icon: <UserPlus size={20} /> },
  { name: 'Appointments', path: '/owner/appointments', icon: <Calendar size={20} /> },
  { name: 'Orders', path: '/owner/orders', icon: <ShoppingBag size={20} /> },
  { name: 'Inventory', path: '/owner/inventory', icon: <PackageSearch size={20} /> },
  { name: 'Suppliers', path: '/owner/suppliers', icon: <Building2 size={20} /> },
  { name: 'Staff', path: '/owner/staff', icon: <Users size={20} /> },
  { name: 'Branches', path: '/owner/branches', icon: <Building2 size={20} />, roles: ['ADMIN'] },
  { name: 'Billing', path: '/owner/billing', icon: <Receipt size={20} /> },
  { name: 'Reports', path: '/owner/reports', icon: <BarChart3 size={20} /> },
  { name: 'Support', path: '/owner/support', icon: <HelpCircle size={20} /> },
];

const staffNavItems: NavItem[] = [
  { name: 'Production', path: '/staff/tasks', icon: <ListTodo size={20} /> },
  { name: 'Inventory View', path: '/staff/inventory', icon: <PackageSearch size={20} /> },
  { name: 'Measurements', path: '/staff/measurements', icon: <Ruler size={20} /> },
  { name: 'My Schedule', path: '/staff/appointments', icon: <Calendar size={20} /> },
];

export function Sidebar({ isCollapsed, setIsCollapsed, pathname, currentPlan }: SidebarProps) {
  const { currentUser } = useERPStore();
  const userRole = currentUser?.role || 'SALES';

  return (
    <aside 
      className={`bg-white h-[calc(100vh-32px)] m-4 rounded-[32px] border border-slate-200/60 flex flex-col shrink-0 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] relative z-50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ${
        isCollapsed ? 'w-[88px]' : 'w-[280px]'
      }`}
    >
      {/* Modern Tab Toggle */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-12 -right-3 w-6 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 shadow-sm transition-all z-[60] group"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Branding */}
      <div className={`h-24 flex items-center transition-all duration-300 ${isCollapsed ? 'justify-center' : 'px-8 gap-4'}`}>
        <div className="w-12 h-12 bg-white border border-slate-200/60 rounded-2xl flex items-center justify-center text-slate-900 shrink-0 shadow-sm">
          <Scissors size={24} strokeWidth={2.5} />
        </div>
        {!isCollapsed && (
          <div className="animate-in fade-in slide-in-from-left-2 duration-300">
            <div className="text-[18px] font-black tracking-tight text-slate-900 flex items-center gap-2">
               <span className="text-[10px] bg-slate-900 text-white px-1.5 py-0.5 rounded ml-1">{currentPlan}</span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className={`flex-1 overflow-y-auto overflow-x-hidden py-4 space-y-1.5 flex flex-col ${
        isCollapsed 
          ? 'items-center px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]' 
          : 'px-6 custom-scrollbar'
      }`}>
        {/* Dynamic Selection of Nav Items */}
        {(pathname.startsWith('/staff') ? staffNavItems : ownerNavItems).map((item) => {
          // Role-based visibility check
          if (item.roles && !item.roles.includes(userRole)) {
            return null;
          }

          const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center rounded-2xl transition-all group relative h-12 ${
                isCollapsed ? 'justify-center w-12' : 'px-4 gap-4 w-full'
              } ${
                isActive 
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className={`shrink-0 transition-transform duration-200 ${isActive ? 'scale-110 text-white' : 'text-slate-400 group-hover:text-slate-600'}`}>
                {item.icon}
              </div>
              {!isCollapsed && (
                <span className="text-[14px] font-bold whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
                  {item.name}
                </span>
              )}
              {isCollapsed && (
                <div className="absolute left-16 px-3 py-1.5 bg-slate-900 text-white text-[12px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[100] shadow-xl">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
