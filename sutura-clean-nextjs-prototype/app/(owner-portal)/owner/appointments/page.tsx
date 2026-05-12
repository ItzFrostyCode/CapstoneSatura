'use client';

import { useState, useMemo } from 'react';
import { Plus, Search, Calendar, History, ClipboardList, Clock } from 'lucide-react';
import { useERPStore, Appointment } from '@/store/useERPStore';

// New Components
import { AppointmentKPIs } from './components/AppointmentKPIs';
import { OnlineRequestsTable } from './components/OnlineRequestsTable';
import { TodayAppointmentsTable } from './components/TodayAppointmentsTable';
import { AppointmentModals } from './components/AppointmentModals';

// We'll keep the calendar components for the Calendar tab
import { CalendarSidebar } from './components/CalendarSidebar';
import { CalendarHeader } from './components/CalendarHeader';
import { CalendarGrid } from './components/CalendarGrid';
import { MonthCalendarGrid } from './components/MonthCalendarGrid';
import { ConfirmScheduleModal, DeclineRequestModal } from './components/ApprovalModals';

export default function AppointmentsPage() {
  const { 
    appointments, 
    updateAppointment,
    deleteAppointment,
    staff, 
    customers,
    pushNotification,
    addAppointment
  } = useERPStore();

  const [activeTab, setActiveTab] = useState<'requests' | 'today' | 'calendar' | 'history'>('requests');
  const [calendarView, setCalendarView] = useState<'Week' | 'Month' | 'Agenda'>('Month');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Demo date: 2026-05-07
  const demoToday = '2026-05-07';
  const [selectedDate, setSelectedDate] = useState(new Date(demoToday));

  const weekDays = useMemo(() => {
    const start = new Date(selectedDate);
    start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [selectedDate]);

  // Modal States
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Form State for new appointment
  const [newApt, setNewApt] = useState({
    customerId: '',
    type: 'FITTING',
    date: demoToday,
    time: '10:00',
    staffId: staff[0]?.id || '',
    reason: '',
    source: 'Walk-in' as 'Walk-in' | 'Online'
  });

  // Filter Logic
  const onlineRequests = useMemo(() => {
    return appointments.filter(a => 
      a.source === 'Online' && 
      a.status === 'Pending Review' &&
      (a.customer.toLowerCase().includes(searchQuery.toLowerCase()) || a.id.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [appointments, searchQuery]);

  const todayAppointments = useMemo(() => {
    return appointments.filter(a => 
      a.date === demoToday && 
      a.status !== 'Cancelled' && 
      a.status !== 'Pending Review' &&
      (a.customer.toLowerCase().includes(searchQuery.toLowerCase()) || a.id.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [appointments, searchQuery]);

  const appointmentHistory = useMemo(() => {
    return appointments.filter(a => 
      (a.status === 'Completed' || a.status === 'Cancelled' || a.status === 'No Show') &&
      (a.customer.toLowerCase().includes(searchQuery.toLowerCase()) || a.id.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [appointments, searchQuery]);

  // Handlers
  const handleApprove = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setIsApproveModalOpen(true);
  };

  const handleReject = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setIsDeclineModalOpen(true);
  };

  const handleConfirmApproval = (data: { staffId: string; date: string; time: string }) => {
    if (selectedAppointment) {
      const staffMember = staff.find(s => s.id === data.staffId);
      updateAppointment(selectedAppointment.id, {
        status: 'Scheduled',
        staff: staffMember?.name || 'Unassigned',
        date: data.date,
        startTime: data.time
      });
      setIsApproveModalOpen(false);
      pushNotification(`Appointment for ${selectedAppointment.customer} approved.`, 'success');
    }
  };

  const handleConfirmDecline = (reason: string) => {
    if (selectedAppointment) {
      updateAppointment(selectedAppointment.id, { status: 'Cancelled', reason });
      setIsDeclineModalOpen(false);
      pushNotification('Appointment request rejected.', 'info');
    }
  };

  const handleSaveAppointment = () => {
    if (!newApt.customerId) {
      pushNotification('Please select a customer.', 'error');
      return;
    }
    const customer = customers.find(c => c.id === newApt.customerId);
    const staffMember = staff.find(s => s.id === newApt.staffId);

    addAppointment({
      customer: customer?.name || 'Unknown',
      email: customer?.email || '',
      phone: customer?.phone || '',
      type: newApt.type,
      category: newApt.type,
      date: newApt.date,
      startTime: newApt.time,
      duration: 60,
      status: newApt.source === 'Walk-in' ? 'Scheduled' : 'Pending Review',
      staff: staffMember?.name || 'Unassigned',
      source: newApt.source,
      reason: newApt.reason
    });

    setIsCreateModalOpen(false);
    pushNotification(`New ${newApt.source} appointment recorded.`, 'success');
  };

  return (
    <div className="space-y-0 animate-in fade-in duration-500 max-w-[1400px] mx-auto pb-20">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div>
          <h1 className="text-[32px] font-black text-slate-900 tracking-tight leading-none">Appointment Management</h1>
          <p className="text-[13px] text-slate-500 font-bold mt-2 uppercase tracking-widest flex items-center gap-2">
            Manage customer appointments, fittings, pickups, and online booking requests.
          </p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="h-12 px-8 bg-slate-900 text-white rounded-[20px] flex items-center gap-3 text-[14px] font-black hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" /> Schedule Walk In Appointment
        </button>
      </div>

      <AppointmentKPIs appointments={appointments} />

      {/* TABS & SEARCH */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 px-2">
        <div className="flex items-center gap-1 p-1 bg-slate-50 border border-slate-200 rounded-full w-fit">
          {[
            { id: 'calendar', label: 'Schedule', icon: Calendar },
            { id: 'requests', label: 'Online Requests', icon: ClipboardList },
            { id: 'today', label: 'Today', icon: Clock },
            { id: 'history', label: 'History', icon: History }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'requests' | 'today' | 'calendar' | 'history')}
              className={`px-6 py-2 text-[12px] font-bold capitalize transition-all rounded-full flex items-center gap-2 ${
                activeTab === tab.id 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search appointments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-12 pr-6 bg-slate-50 border border-slate-200 rounded-full text-[14px] font-medium outline-none focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* TAB CONTENT */}
      <div className="px-2">
        {activeTab === 'requests' && (
          <OnlineRequestsTable 
            requests={onlineRequests}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}
        
        {activeTab === 'today' && (
          <TodayAppointmentsTable 
            appointments={todayAppointments}
            onViewDetails={(apt) => {
              setSelectedAppointment(apt);
              setIsDetailsModalOpen(true);
            }}
          />
        )}

        {activeTab === 'history' && (
          <TodayAppointmentsTable 
            appointments={appointmentHistory}
            onViewDetails={(apt) => {
              setSelectedAppointment(apt);
              setIsDetailsModalOpen(true);
            }}
          />
        )}

        {activeTab === 'calendar' && (
          <div className="flex flex-col bg-white border border-slate-200 rounded-[40px] overflow-hidden shadow-2xl shadow-slate-200/50 min-h-[800px]">
            <CalendarHeader 
              selectedDate={selectedDate} 
              view={calendarView}
              setView={setCalendarView}
              onPrev={() => {
                const d = new Date(selectedDate);
                if (calendarView === 'Month') d.setMonth(d.getMonth() - 1);
                else d.setDate(d.getDate() - 7);
                setSelectedDate(d);
              }}
              onNext={() => {
                const d = new Date(selectedDate);
                if (calendarView === 'Month') d.setMonth(d.getMonth() + 1);
                else d.setDate(d.getDate() + 7);
                setSelectedDate(d);
              }}
              onToday={() => setSelectedDate(new Date(demoToday))}
            />
            
            <div className="flex-1 overflow-hidden">
              {calendarView === 'Month' ? (
                <MonthCalendarGrid 
                  selectedDate={selectedDate}
                  appointments={appointments}
                  onSelectAppointment={(apt) => {
                    setSelectedAppointment(apt);
                    setIsDetailsModalOpen(true);
                  }}
                />
              ) : calendarView === 'Week' ? (
                <CalendarGrid 
                  hours={Array.from({ length: 24 }, (_, i) => i)}
                  weekDays={weekDays} 
                  mappedAppointments={appointments}
                  onSelectAppointment={(apt) => {
                    setSelectedAppointment(apt);
                    setIsDetailsModalOpen(true);
                  }}
                />
              ) : (
                <div className="p-10 space-y-4 overflow-y-auto max-h-full custom-scrollbar bg-slate-50/30">
                  {appointments
                    .filter(a => a.status !== 'Cancelled')
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map((apt) => (
                      <div 
                        key={apt.id} 
                        onClick={() => {
                          setSelectedAppointment(apt);
                          setIsDetailsModalOpen(true);
                        }}
                        className="bg-white p-6 rounded-[24px] border border-slate-200 flex items-center justify-between hover:border-indigo-600 transition-all cursor-pointer group shadow-sm"
                      >
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 rounded-2xl bg-slate-50 flex flex-col items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                            <div className="text-[10px] font-black uppercase tracking-widest">{new Date(apt.date).toLocaleString('default', { month: 'short' })}</div>
                            <div className="text-[20px] font-black leading-none mt-1">{new Date(apt.date).getDate()}</div>
                          </div>
                          <div>
                            <div className="text-[16px] font-black text-slate-900">{apt.customer}</div>
                            <div className="flex items-center gap-2 text-[12px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                              {apt.startTime} • {apt.type} • {apt.staff}
                            </div>
                          </div>
                        </div>
                        <div className="text-[12px] font-black text-slate-900 uppercase tracking-widest px-4 py-2 bg-slate-50 rounded-xl">{apt.status}</div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      <ConfirmScheduleModal 
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        appointment={selectedAppointment}
        staffMembers={staff}
        allAppointments={appointments}
        onConfirm={handleConfirmApproval}
      />

      <DeclineRequestModal 
        isOpen={isDeclineModalOpen}
        onClose={() => setIsDeclineModalOpen(false)}
        appointment={selectedAppointment}
        onConfirm={handleConfirmDecline}
      />

      <AppointmentModals 
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
        newApt={newApt}
        setNewApt={setNewApt}
        customers={customers}
        staff={staff}
        handleSaveAppointment={handleSaveAppointment}
        selectedAppointment={selectedAppointment}
        isDetailsModalOpen={isDetailsModalOpen}
        setIsDetailsModalOpen={setIsDetailsModalOpen}
        getStatusStyles={() => ({ badge: '', cardOpacity: '' })}
        renderModalActions={() => null}
      />
    </div>
  );
}
