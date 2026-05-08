'use client';

import { useState, useMemo } from 'react';
import { Plus, Calendar, ListChecks, Search, Filter, SlidersHorizontal, Briefcase } from 'lucide-react';
import { useERPStore, Appointment } from '@/store/useERPStore';

// Sub-components
import { CalendarSidebar } from './components/CalendarSidebar';
import { CalendarHeader } from './components/CalendarHeader';
import { CalendarGrid } from './components/CalendarGrid';
import { AppointmentModals, NewAppointmentForm } from './components/AppointmentModals';
import { AppointmentKPIs } from './components/AppointmentKPIs';
import { AppointmentRequestsTable } from './components/AppointmentRequestsTable';
import { AppointmentSidePanel } from './components/AppointmentSidePanel';
import { ConfirmScheduleModal, DeclineRequestModal, CompleteAppointmentModal } from './components/ApprovalModals';

const normalizeStatus = (status: string) => {
  const s = status.toLowerCase();
  if (s === 'pending') return 'Pending Review';
  if (s === 'scheduled' || s === 'rescheduled') return 'Scheduled';
  if (s === 'no show' || s === 'no_show') return 'No Show';
  if (s === 'completed') return 'Completed';
  if (s === 'cancelled') return 'Cancelled';
  return 'Scheduled';
};

export default function AppointmentsPage() {
  const { 
    appointments, 
    addAppointment, 
    updateAppointment,
    updateAppointmentStatus, 
    deleteAppointment,
    staff, 
    customers,
    pushNotification,
    measurementProfiles,
    orders,
    addCustomer
  } = useERPStore();

  const [activeTab, setActiveTab] = useState<'requests' | 'calendar' | 'approved' | 'archive'>('requests');
  const [selectedDate, setSelectedDate] = useState(new Date('2026-05-07')); // Fixed date for demo
  
  // Modals & Panels State
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState('All');

  const [visibleStaffIds, setVisibleStaffIds] = useState<string[]>(() => staff.map(s => s.id));
  const allStatuses = ['Scheduled', 'Rescheduled', 'Completed', 'Cancelled', 'No Show'];
  const [visibleStatuses, setVisibleStatuses] = useState<string[]>(allStatuses);
  
  // Form State
  const [newApt, setNewApt] = useState<NewAppointmentForm>(() => ({
    customerId: '',
    type: 'Fitting',
    date: '2026-05-07',
    time: '10:00',
    staffId: staff[0]?.id || '',
    reason: ''
  }));

  const hours = Array.from({ length: 11 }, (_, i) => i + 8); // 8 AM to 6 PM
  const HOUR_HEIGHT = 100;

  const weekDays = useMemo(() => {
    const start = new Date(selectedDate);
    start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [selectedDate]);

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  const getStaffColor = (staffName: string) => {
    const colors: Record<string, string> = {
      'Joshua Arabejo': 'bg-indigo-50 text-indigo-700 border-indigo-200',
      'Maria Santos': 'bg-rose-50 text-rose-700 border-rose-200',
      'Elena Cruz': 'bg-amber-50 text-amber-700 border-amber-200',
      'Juan Reyes': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'Robert Chen': 'bg-sky-50 text-sky-700 border-sky-200',
    };
    return colors[staffName] || 'bg-slate-50 text-slate-700 border-slate-200';
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Pending Review': return { badge: 'bg-amber-50 text-amber-600', cardOpacity: 'opacity-100' };
      case 'Scheduled': return { badge: 'bg-blue-50 text-blue-600', cardOpacity: 'opacity-100' };
      case 'Rescheduled': return { badge: 'bg-indigo-50 text-indigo-600', cardOpacity: 'opacity-100' };
      case 'Completed': return { badge: 'bg-slate-100 text-slate-500', cardOpacity: 'opacity-60 grayscale' };
      case 'Cancelled': return { badge: 'bg-slate-100 text-slate-300', cardOpacity: 'opacity-30 grayscale saturate-0' };
      case 'No Show': return { badge: 'bg-rose-50 text-rose-400', cardOpacity: 'opacity-50 grayscale' };
      default: return { badge: 'bg-slate-50 text-slate-600', cardOpacity: 'opacity-100' };
    }
  };

  const calculatePosition = (startTime: string, duration: number) => {
    const [h, m] = startTime.split(':').map(Number);
    const startOffset = (h - 8) * HOUR_HEIGHT + (m / 60) * HOUR_HEIGHT;
    const height = (duration / 60) * HOUR_HEIGHT;
    return { top: `${startOffset}px`, height: `${height}px` };
  };

  const getCurrentTimePosition = () => {
    const h = 10, m = 30;
    return (h - 8) * HOUR_HEIGHT + (m / 60) * HOUR_HEIGHT;
  };

  const pendingRequests = useMemo(() => {
    return appointments.filter(a => {
      if (a.status !== 'Pending Review') return false;
      const matchesSearch = a.customer.toLowerCase().includes(searchQuery.toLowerCase()) || a.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSource = sourceFilter === 'All' || a.source === sourceFilter;
      return matchesSearch && matchesSource;
    });
  }, [appointments, searchQuery, sourceFilter]);

  const approvedRequests = useMemo(() => {
    return appointments.filter(a => {
      const isApproved = a.status === 'Scheduled' || a.status === 'Rescheduled';
      if (!isApproved) return false;
      const matchesSearch = a.customer.toLowerCase().includes(searchQuery.toLowerCase()) || a.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSource = sourceFilter === 'All' || a.source === sourceFilter;
      return matchesSearch && matchesSource;
    });
  }, [appointments, searchQuery, sourceFilter]);

  const archiveRequests = useMemo(() => {
    return appointments.filter(a => {
      const isArchived = a.status === 'Completed' || a.status === 'Cancelled' || a.status === 'No Show';
      if (!isArchived) return false;
      const matchesSearch = a.customer.toLowerCase().includes(searchQuery.toLowerCase()) || a.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSource = sourceFilter === 'All' || a.source === sourceFilter;
      return matchesSearch && matchesSource;
    });
  }, [appointments, searchQuery, sourceFilter]);

  const mappedCalendarAppointments = useMemo(() => {
    return appointments.filter(a => a.status !== 'Pending Review').map(apt => ({
      ...apt,
      normalizedStatus: normalizeStatus(apt.status)
    }));
  }, [appointments]);

  // Actions
  const handleApprove = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setIsApproveModalOpen(true);
  };

  const handleDecline = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setIsDeclineModalOpen(true);
  };

  const handleReschedule = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setNewApt({
      customerId: customers.find(c => c.name === apt.customer)?.id || '',
      type: apt.type,
      date: apt.date,
      time: apt.startTime,
      staffId: staff.find(s => s.name === apt.staff)?.id || '',
      reason: apt.reason || ''
    });
    setIsCreateModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this appointment record?')) {
      deleteAppointment(id);
      pushNotification('Appointment permanently deleted.', 'info');
    }
  };

  const handleConfirmApproval = (data: { staffId: string; date: string; time: string }) => {
    if (selectedAppointment) {
      const staffMember = staff.find(s => s.id === data.staffId);
      updateAppointment(selectedAppointment.id, {
        status: 'Scheduled',
        staff: staffMember?.name || 'Unassigned',
        branch_id: 'BRN-001',
        date: data.date,
        startTime: data.time
      });
      setIsApproveModalOpen(false);
      pushNotification(`Appointment with ${selectedAppointment.customer} has been scheduled.`, 'success');
    }
  };

  const handleConfirmDecline = (reason: string, note?: string) => {
    if (selectedAppointment) {
      updateAppointment(selectedAppointment.id, { 
        status: 'Cancelled',
        reason: reason,
        notes: note
      });
      pushNotification('Appointment request declined.', 'info');
    }
    setIsDeclineModalOpen(false);
  };

  const handleConfirmComplete = (notes: string) => {
    if (selectedAppointment) {
      updateAppointment(selectedAppointment.id, { 
        status: 'Completed',
        notes: notes
      });
      pushNotification('Appointment marked as completed.', 'success');
    }
    setIsCompleteModalOpen(false);
    setSelectedAppointment(null);
  };

  const handleSaveAppointment = () => {
    if (!newApt.customerId) {
      pushNotification('Please select a customer.', 'error');
      return;
    }
    const selectedCust = customers.find(c => c.id === newApt.customerId);
    const selectedStaffMember = staff.find(s => s.id === newApt.staffId);
    
    if (selectedAppointment) {
      // RESCHEDULE MODE: Update existing
      updateAppointment(selectedAppointment.id, {
        date: newApt.date,
        startTime: newApt.time,
        type: newApt.type,
        staff: selectedStaffMember?.name || selectedAppointment.staff,
        status: 'Scheduled',
        reason: newApt.reason
      });
      pushNotification(`Appointment for ${selectedAppointment.customer} updated and rescheduled.`, 'success');
    } else {
      // NEW WALK-IN MODE: Add new
      addAppointment({
        customer: selectedCust?.name || 'Unknown',
        email: selectedCust?.email || '',
        phone: selectedCust?.phone || '',
        type: newApt.type,
        category: newApt.type,
        date: newApt.date,
        startTime: newApt.time,
        duration: 60,
        status: 'Scheduled',
        staff: selectedStaffMember?.name || 'Unknown',
        source: 'Walk-in',
        reason: newApt.reason || 'New appointment scheduled from portal.',
      });
      pushNotification('New walk-in appointment scheduled.', 'success');
    }
    
    setIsCreateModalOpen(false);
    setSelectedAppointment(null); // Clear after save
    setActiveTab('approved');
  };
  
  const handleRegisterCustomer = (name: string, phone: string, email: string) => {
    addCustomer({ name, phone, email });
    pushNotification(`${name} has been added to Customer Management.`, 'success');
  };

  const renderModalActions = (status: string) => {
    if (!selectedAppointment) return null;
    const normalized = normalizeStatus(selectedAppointment.status);
    switch (normalized) {
      case 'Scheduled':
        return (
          <>
            <button onClick={() => { updateAppointmentStatus(selectedAppointment.id, 'Cancelled'); setIsDetailsModalOpen(false); pushNotification('Appointment cancelled.', 'info'); }} className="h-12 px-6 text-[14px] font-black text-rose-600 hover:bg-rose-50 rounded-xl transition-all">Cancel Apt</button>
            <button onClick={() => handleReschedule(selectedAppointment)} className="h-12 px-6 text-[14px] font-black text-slate-500 hover:text-slate-900 transition-all">Reschedule</button>
            <button onClick={() => setIsDetailsModalOpen(false)} className="h-12 px-8 bg-slate-900 text-white rounded-[18px] font-black text-[14px] hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95">Close</button>
          </>
        );
      case 'No Show':
        return (
          <>
            <button onClick={() => handleReschedule(selectedAppointment)} className="h-12 px-6 text-[14px] font-black text-slate-500 hover:text-slate-900 transition-all">Reschedule</button>
            <button onClick={() => { updateAppointmentStatus(selectedAppointment.id, 'Completed'); setIsDetailsModalOpen(false); pushNotification('Appointment marked as completed.', 'success'); }} className="h-12 px-8 bg-emerald-600 text-white rounded-[18px] font-black text-[14px] hover:bg-slate-900 transition-all shadow-xl shadow-emerald-100 active:scale-95">Mark Completed</button>
          </>
        );
      default:
        return (
          <button onClick={() => setIsDetailsModalOpen(false)} className="h-12 px-8 bg-slate-900 text-white rounded-[18px] font-black text-[14px] hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95">Close Details</button>
        );
    }
  };

  return (
    <div className="space-y-0 animate-in fade-in duration-500 max-w-[1400px] mx-auto pb-20">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div>
          <h1 className="text-[24px] font-black text-slate-900 tracking-tight leading-none">Appointment Management</h1>
          <p className="text-[12px] text-slate-500 font-bold mt-1 uppercase tracking-widest flex items-center gap-2">
            Review requests and manage your shops scheduling
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => {
              setNewApt(prev => ({ ...prev, customerId: '', date: formatDate(selectedDate), time: '10:00', reason: '' }));
              setIsCreateModalOpen(true);
            }}
            className="h-10 px-6 bg-slate-900 text-white rounded-xl flex items-center gap-2 text-[13px] font-black hover:bg-indigo-600 transition-all shadow-lg shadow-slate-900/10 active:scale-95 group"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" /> New Walk-in
          </button>
        </div>
      </div>

      <AppointmentKPIs appointments={appointments} />

      {/* VIEW SWITCHER & FILTERS */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 px-2">
        <div className="flex items-center p-1 bg-slate-100 rounded-xl w-fit">
          <button 
            onClick={() => setActiveTab('requests')}
            className={`h-9 px-4 rounded-lg flex items-center gap-2 text-[12px] font-black transition-all ${
              activeTab === 'requests' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <ListChecks size={16} />
            Appointment Requests
          </button>
          <button 
            onClick={() => setActiveTab('approved')}
            className={`h-9 px-4 rounded-lg flex items-center gap-2 text-[12px] font-black transition-all ${
              activeTab === 'approved' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-emerald-600'
            }`}
          >
            <Calendar size={16} />
            Approved
          </button>
          <button 
            onClick={() => setActiveTab('calendar')}
            className={`h-9 px-4 rounded-lg flex items-center gap-2 text-[12px] font-black transition-all ${
              activeTab === 'calendar' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Calendar size={16} />
            Calendar View
          </button>
          <button 
            onClick={() => setActiveTab('archive')}
            className={`h-9 px-4 rounded-lg flex items-center gap-2 text-[12px] font-black transition-all ${
              activeTab === 'archive' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Briefcase size={16} />
            Archive
          </button>
        </div>

        {(activeTab === 'requests' || activeTab === 'approved' || activeTab === 'archive') && (
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text"
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-10 pr-4 bg-white border border-slate-200 rounded-lg text-[13px] font-bold outline-none focus:border-indigo-500 transition-all shadow-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <select 
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="h-9 px-3 bg-white border border-slate-200 rounded-lg text-[12px] font-black outline-none appearance-none cursor-pointer shadow-sm"
              >
                <option value="All">All Sources</option>
                <option value="Online">Online</option>
                <option value="Walk-in">Walk-in</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {activeTab === 'requests' ? (
        <AppointmentRequestsTable 
          requests={pendingRequests}
          onApprove={handleApprove}
          onDecline={handleDecline}
          onReschedule={handleReschedule}
          onViewDetails={(apt) => {
            setSelectedAppointment(apt);
            setIsSidePanelOpen(true);
          }}
        />
      ) : activeTab === 'approved' ? (
        <AppointmentRequestsTable 
          requests={approvedRequests}
          onApprove={() => {}} // Not needed for approved
          onDecline={handleDecline}
          onReschedule={handleReschedule}
          onStatusUpdate={(id, status) => {
            if (status === 'Completed') {
              const apt = appointments.find(a => a.id === id);
              setSelectedAppointment(apt || null);
              setIsCompleteModalOpen(true);
            } else {
              updateAppointmentStatus(id, status);
              pushNotification(`Appointment marked as ${status}.`, 'success');
            }
          }}
          onViewDetails={(apt) => {
            setSelectedAppointment(apt);
            setIsSidePanelOpen(true);
          }}
        />
      ) : activeTab === 'archive' ? (
        <AppointmentRequestsTable 
          requests={archiveRequests}
          onApprove={() => {}} 
          onDecline={() => {}}
          onReschedule={handleReschedule}
          onDelete={handleDelete}
          hideGrouping={true}
          onViewDetails={(apt) => {
            setSelectedAppointment(apt);
            setIsSidePanelOpen(true);
          }}
        />
      ) : (
        <div className="flex h-[calc(100vh-280px)] bg-white border border-slate-200 rounded-[40px] overflow-hidden shadow-2xl shadow-slate-200/50">
          <CalendarSidebar 
            staff={staff}
            visibleStaffIds={visibleStaffIds}
            toggleStaff={(id) => setVisibleStaffIds(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])}
            allStatuses={allStatuses}
            visibleStatuses={visibleStatuses}
            toggleStatus={(s) => setVisibleStatuses(prev => prev.includes(s) ? prev.filter(st => st !== s) : [...prev, s])}
            getStatusStyles={getStatusStyles}
          />

          <div className="flex-1 flex flex-col min-w-0 bg-white">
            <CalendarHeader 
              selectedDate={selectedDate} 
              onPrev={() => {
                const d = new Date(selectedDate);
                d.setDate(d.getDate() - 7);
                setSelectedDate(d);
              }}
              onNext={() => {
                const d = new Date(selectedDate);
                d.setDate(d.getDate() + 7);
                setSelectedDate(d);
              }}
              onToday={() => setSelectedDate(new Date('2026-05-07'))}
            />
            
            <CalendarGrid 
              hours={hours}
              weekDays={weekDays}
              mappedAppointments={mappedCalendarAppointments}
              staff={staff}
              visibleStaffIds={visibleStaffIds}
              visibleStatuses={visibleStatuses}
              formatDate={formatDate}
              getStatusStyles={getStatusStyles}
              getStaffColor={getStaffColor}
              calculatePosition={calculatePosition}
              getCurrentTimePosition={getCurrentTimePosition}
              handleEmptySlotClick={(date, hour) => {
                const formattedHour = `${hour.toString().padStart(2, '0')}:00`;
                setNewApt(prev => ({ ...prev, date, time: formattedHour, customerId: '', reason: '' }));
                setIsCreateModalOpen(true);
              }}
              setSelectedAppointment={(apt) => { 
                setSelectedAppointment(apt as Appointment); 
                setIsDetailsModalOpen(true); 
              }}
              setIsModalOpen={setIsDetailsModalOpen}
            />
          </div>
        </div>
      )}

      {/* MODALS & PANELS */}
      <AppointmentSidePanel 
        isOpen={isSidePanelOpen}
        onClose={() => setIsSidePanelOpen(false)}
        appointment={selectedAppointment}
        onRegisterCustomer={handleRegisterCustomer}
        customer={customers.find(c => c.name === selectedAppointment?.customer)}
        history={appointments.filter(a => a.customer === selectedAppointment?.customer && a.id !== selectedAppointment?.id)}
        measurements={measurementProfiles.filter(m => m.customer_id === customers.find(c => c.name === selectedAppointment?.customer)?.id)}
        orders={orders.filter(o => o.customer_id === customers.find(c => c.name === selectedAppointment?.customer)?.id)}
      />

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

      <CompleteAppointmentModal 
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        appointment={selectedAppointment}
        onConfirm={handleConfirmComplete}
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
        getStatusStyles={getStatusStyles}
        renderModalActions={renderModalActions}
      />
    </div>
  );
}
