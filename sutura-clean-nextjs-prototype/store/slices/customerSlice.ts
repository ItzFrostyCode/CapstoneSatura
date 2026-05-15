import { StateCreator } from 'zustand';
import { Customer, MeasurementProfile, Appointment, FittingSession } from '@/types/erp';
import { INITIAL_CUSTOMERS, INITIAL_MEASUREMENTS, INITIAL_APPOINTMENTS } from '@/mocks/mockData';
import { ERPStore } from '../useERPStore';

export interface CustomerSlice {
  customers: Customer[];
  measurementProfiles: MeasurementProfile[];
  appointments: Appointment[];
  fittingSessions: FittingSession[];
  followedShops: string[];
  heartedItems: string[];
  addCustomer: (customer: Partial<Customer>) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  addMeasurementProfile: (profile: Partial<MeasurementProfile>) => MeasurementProfile;
  addAppointment: (appointment: Partial<Appointment>) => void;
  addFittingSession: (session: Partial<FittingSession>) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  deleteAppointment: (id: string) => void;
  toggleFollowShop: (shopId: string) => void;
  toggleHeartItem: (itemId: string) => void;
}

export const createCustomerSlice: StateCreator<ERPStore, [], [], CustomerSlice> = (set, get) => ({
  customers: INITIAL_CUSTOMERS,
  measurementProfiles: INITIAL_MEASUREMENTS,
  appointments: INITIAL_APPOINTMENTS,
  fittingSessions: [],
  followedShops: ['SHOP-001'], // Default follow for demo
  heartedItems: ['ITM-001', 'ITM-002'], // Default hearts for demo
  addCustomer: (customer: Partial<Customer>) => {
    let newObj: Customer | null = null;
    set((state) => {
      newObj = {
        id: `CUST-${Date.now()}`,
        name: '',
        type: 'Individual',
        is_active: true,
        createdAt: new Date().toISOString(),
        ...customer
      } as Customer;
      return { customers: [newObj, ...state.customers] };
    });
    return newObj as unknown as Customer;
  },
  toggleFollowShop: (shopId) => set((state) => ({
    followedShops: state.followedShops.includes(shopId) 
      ? state.followedShops.filter(id => id !== shopId)
      : [...state.followedShops, shopId]
  })),
  toggleHeartItem: (itemId) => set((state) => ({
    heartedItems: state.heartedItems.includes(itemId)
      ? state.heartedItems.filter(id => id !== itemId)
      : [...state.heartedItems, itemId]
  })),
  updateCustomer: (id: string, updates: Partial<Customer>) => set((state) => ({
    customers: state.customers.map((c) => (c.id === id ? { ...c, ...updates } : c))
  })),
  // ... rest of the slice remains the same ...
  addMeasurementProfile: (profile: Partial<MeasurementProfile>) => {
    let newObj: MeasurementProfile | null = null;
    set((state) => {
      newObj = {
        id: `MEAS-${Date.now()}`,
        recorded_at: new Date().toISOString(),
        is_current: true,
        status: 'DRAFT',
        version_no: 'V1',
        ...profile
      } as MeasurementProfile;
      return { measurementProfiles: [newObj, ...state.measurementProfiles] };
    });
    return newObj as unknown as MeasurementProfile;
  },
  updateMeasurementProfile: (id: string, updates: Partial<MeasurementProfile>) => set((state) => ({
    measurementProfiles: state.measurementProfiles.map((p) => (p.id === id ? { ...p, ...updates } : p))
  })),
  deleteMeasurementProfile: (id: string) => set((state) => ({
    measurementProfiles: state.measurementProfiles.filter((p) => p.id !== id)
  })),
  addAppointment: (appointment: Partial<Appointment>) => {
    set((state) => ({
      appointments: [{ id: `APP-${Date.now()}`, status: 'Pending Review', source: 'Walk-in', ...appointment } as Appointment, ...state.appointments]
    }));
    get().pushNotification('Appointment request received and added to review queue.', 'info');
  },
  addFittingSession: (session: Partial<FittingSession>) => set((state) => ({
    fittingSessions: [{ id: `FIT-${Date.now()}`, status: 'Scheduled', ...session } as FittingSession, ...state.fittingSessions]
  })),
  updateAppointment: (id, updates) => set((state) => ({
    appointments: state.appointments.map(a => a.id === id ? { ...a, ...updates } : a)
  })),
  updateAppointmentStatus: (id, status) => {
    set((state) => ({
      appointments: state.appointments.map(a => a.id === id ? { ...a, status } : a)
    }));
    const msg = status === 'Scheduled' ? 'Appointment approved and added to schedule.' : `Appointment status updated to ${status}.`;
    get().pushNotification(msg, 'success');
  },
  deleteAppointment: (id) => set((state) => ({
    appointments: state.appointments.filter(a => a.id !== id)
  })),
  recordFittingAdjustment: (prev, adjustments, session) => set((state) => {
    const nextVerNum = (parseInt(prev.version_no.replace('V', '')) || 1) + 1;
    const newVerNo = `V${nextVerNum}`;
    
    const newProfile: MeasurementProfile = {
      ...prev,
      ...adjustments,
      id: `MEAS-${Date.now()}`,
      parent_profile_id: prev.id,
      version_no: newVerNo,
      version_notes: session.adjustment_notes,
      next_fitting_date: session.next_fitting_date,
      recorded_at: new Date().toISOString(),
      is_current: true,
      status: 'CONFIRMED'
    };

    const newSession: FittingSession = {
      id: `FIT-${Date.now()}`,
      measurement_profile_id: newProfile.id,
      session_no: nextVerNum,
      status: 'Completed',
      created_at: new Date().toISOString(),
      ...session
    } as FittingSession;

    return {
      measurementProfiles: state.measurementProfiles.map(p => 
        p.id === prev.id ? { ...p, is_current: false } : p
      ).concat(newProfile),
      fittingSessions: [newSession, ...state.fittingSessions]
    };
  }),
});
