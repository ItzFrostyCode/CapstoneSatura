'use client';

import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useERPStore, Appointment } from '@/store/useERPStore';

// Sub-components
import { CalendarSidebar } from './components/CalendarSidebar';
import { CalendarHeader } from './components/CalendarHeader';
import { CalendarGrid } from './components/CalendarGrid';
import { AppointmentModals, NewAppointmentForm } from './components/AppointmentModals';

const normalizeStatus = (status: string) => {
  const s = status.toLowerCase();
  if (s === 'pending' || s === 'scheduled') return 'Scheduled';
  if (s === 'delayed' || s === 'no show' || s === 'no_show') return 'No Show';
  if (s === 'confirmed') return 'Confirmed';
  if (s === 'completed') return 'Completed';
  if (s === 'cancelled') return 'Cancelled';
  return 'Scheduled';
};

export default function AppointmentsPage() {
  const { 
    appointments, 
    addAppointment, 
    updateAppointmentStatus, 
    staff, 
    customers,
    pushNotification
  } = useERPStore();

  const [selectedDate, setSelectedDate] = useState(new Date('2026-10-28')); // Fixed date for demo
  const [selectedAppointment, setSelectedAppointment] = useState<(Appointment & { normalizedStatus: string }) | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const [visibleStaffIds, setVisibleStaffIds] = useState<string[]>(() => staff.map(s => s.id));
  const allStatuses = ['Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'No Show'];
  const [visibleStatuses, setVisibleStatuses] = useState<string[]>(allStatuses);
  
  // Form State
  const [newApt, setNewApt] = useState<NewAppointmentForm>(() => ({
    customerId: '',
    type: 'Fitting',
    date: '2026-10-28',
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
      case 'Scheduled': return { badge: 'bg-blue-50 text-blue-600', cardOpacity: 'opacity-100' };
      case 'Confirmed': return { badge: 'bg-indigo-50 text-indigo-600', cardOpacity: 'opacity-100' };
      case 'Completed': return { badge: 'bg-slate-100 text-slate-500', cardOpacity: 'opacity-60 grayscale' };
      case 'Cancelled': return { badge: 'bg-rose-50 text-rose-600', cardOpacity: 'opacity-40 grayscale' };
      case 'No Show': return { badge: 'bg-orange-50 text-orange-600', cardOpacity: 'opacity-80' };
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
    // For demo purposes, we'll fix it to 10:30 AM to show the line
    const h = 10, m = 30;
    return (h - 8) * HOUR_HEIGHT + (m / 60) * HOUR_HEIGHT;
  };

  const toggleStaff = (staffId: string) => {
    setVisibleStaffIds(prev => 
      prev.includes(staffId) ? prev.filter(s => s !== staffId) : [...prev, staffId]
    );
  };

  const toggleStatus = (status: string) => {
    setVisibleStatuses(prev => 
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const handleEmptySlotClick = (date: string, hour: number) => {
    const formattedHour = `${hour.toString().padStart(2, '0')}:00`;
    setNewApt(prev => ({ ...prev, date, time: formattedHour, customerId: '', reason: '' }));
    setIsCreateModalOpen(true);
  };

  const handleSaveAppointment = () => {
    if (!newApt.customerId) {
      pushNotification('Please select a customer.', 'error');
      return;
    }
    const selectedCust = customers.find(c => c.id === newApt.customerId);
    const selectedStaffMember = staff.find(s => s.id === newApt.staffId);
    
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
      reason: newApt.reason || 'New appointment scheduled from portal.',
    });
    
    setIsCreateModalOpen(false);
    pushNotification('Appointment scheduled successfully.', 'success');
  };

  const handleReschedule = () => {
    if (selectedAppointment) {
      setNewApt({
        customerId: customers.find(c => c.name === selectedAppointment.customer)?.id || '',
        type: selectedAppointment.type,
        date: selectedAppointment.date,
        time: selectedAppointment.startTime,
        staffId: staff.find(s => s.name === selectedAppointment.staff)?.id || '',
        reason: selectedAppointment.reason || ''
      });
      setIsDetailsModalOpen(false);
      setIsCreateModalOpen(true);
    }
  };

  const mappedAppointments = useMemo(() => {
    return appointments.map(apt => ({
      ...apt,
      normalizedStatus: normalizeStatus(apt.status)
    }));
  }, [appointments]);

  const renderModalActions = (status: string) => {
    if (!selectedAppointment) return null;
    switch (status) {
      case 'Scheduled':
        return (
          <>
            <button onClick={() => { updateAppointmentStatus(selectedAppointment.id, 'Cancelled'); setIsDetailsModalOpen(false); pushNotification('Appointment cancelled.', 'info'); }} className="h-12 px-6 text-[14px] font-black text-rose-600 hover:bg-rose-50 rounded-xl transition-all">Cancel Apt</button>
            <button onClick={handleReschedule} className="h-12 px-6 text-[14px] font-black text-slate-500 hover:text-slate-900 transition-all">Reschedule</button>
            <button onClick={() => { updateAppointmentStatus(selectedAppointment.id, 'Confirmed'); setIsDetailsModalOpen(false); pushNotification('Appointment confirmed.', 'success'); }} className="h-12 px-8 bg-indigo-600 text-white rounded-[18px] font-black text-[14px] hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 active:scale-95">Confirm</button>
          </>
        );
      case 'Confirmed':
        return (
          <>
            <button onClick={handleReschedule} className="h-12 px-6 text-[14px] font-black text-slate-500 hover:text-slate-900 transition-all">Reschedule</button>
            <button onClick={() => { updateAppointmentStatus(selectedAppointment.id, 'Completed'); setIsDetailsModalOpen(false); pushNotification('Appointment completed.', 'success'); }} className="h-12 px-8 bg-emerald-600 text-white rounded-[18px] font-black text-[14px] hover:bg-slate-900 transition-all shadow-xl shadow-emerald-100 active:scale-95">Mark Completed</button>
          </>
        );
      case 'No Show':
        return (
          <>
            <button onClick={handleReschedule} className="h-12 px-6 text-[14px] font-black text-slate-500 hover:text-slate-900 transition-all">Reschedule</button>
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
      <div className="flex items-center justify-between mb-8 px-2">
        <div>
          <h1 className="text-[32px] font-black text-slate-900 tracking-tight leading-none">Appointments</h1>
          <p className="text-[14px] text-slate-500 font-bold mt-2 uppercase tracking-widest">Customer Fittings & Consultations</p>
        </div>
        <button 
          onClick={() => {
            setNewApt(prev => ({ ...prev, customerId: '', date: formatDate(selectedDate), time: '10:00', reason: '' }));
            setIsCreateModalOpen(true);
          }}
          className="h-12 px-6 bg-slate-900 text-white rounded-[18px] flex items-center gap-2 text-[13px] font-black hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
        >
          <Plus size={18} /> New Appointment
        </button>
      </div>

      <div className="flex h-[calc(100vh-280px)] bg-white border border-slate-200 rounded-[40px] overflow-hidden shadow-2xl shadow-slate-200/50">
        <CalendarSidebar 
          staff={staff}
          visibleStaffIds={visibleStaffIds}
          toggleStaff={toggleStaff}
          allStatuses={allStatuses}
          visibleStatuses={visibleStatuses}
          toggleStatus={toggleStatus}
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
            onToday={() => setSelectedDate(new Date('2026-10-28'))}
          />
          
          <CalendarGrid 
            hours={hours}
            weekDays={weekDays}
            mappedAppointments={mappedAppointments}
            staff={staff}
            visibleStaffIds={visibleStaffIds}
            visibleStatuses={visibleStatuses}
            formatDate={formatDate}
            getStatusStyles={getStatusStyles}
            getStaffColor={getStaffColor}
            calculatePosition={calculatePosition}
            getCurrentTimePosition={getCurrentTimePosition}
            handleEmptySlotClick={handleEmptySlotClick}
            setSelectedAppointment={(apt) => { setSelectedAppointment(apt); setIsDetailsModalOpen(true); }}
            setIsModalOpen={setIsDetailsModalOpen}
          />
        </div>
      </div>

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
