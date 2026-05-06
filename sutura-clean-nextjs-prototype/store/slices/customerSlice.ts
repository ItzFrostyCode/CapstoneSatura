import { StateCreator } from 'zustand';
import { Customer, MeasurementProfile, Appointment, FittingSession } from '@/types/erp';
import { INITIAL_CUSTOMERS, INITIAL_MEASUREMENTS, INITIAL_APPOINTMENTS } from '@/mocks/mockData';
import { ERPStore } from '../useERPStore';

export interface CustomerSlice {
  customers: Customer[];
  measurementProfiles: MeasurementProfile[];
  appointments: Appointment[];
  fittingSessions: FittingSession[];
  addCustomer: (customer: Partial<Customer>) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  addMeasurementProfile: (profile: Partial<MeasurementProfile>) => MeasurementProfile;
  addAppointment: (appointment: Partial<Appointment>) => void;
  addFittingSession: (session: Partial<FittingSession>) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
}

export const createCustomerSlice: StateCreator<ERPStore, [], [], CustomerSlice> = (set) => ({
  customers: INITIAL_CUSTOMERS,
  measurementProfiles: INITIAL_MEASUREMENTS,
  appointments: INITIAL_APPOINTMENTS,
  fittingSessions: [],
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
  updateCustomer: (id: string, updates: Partial<Customer>) => set((state) => ({
    customers: state.customers.map((c) => (c.id === id ? { ...c, ...updates } : c))
  })),
  addMeasurementProfile: (profile: Partial<MeasurementProfile>) => {
    let newObj: MeasurementProfile | null = null;
    set((state) => {
      newObj = {
        id: `MEAS-${Date.now()}`,
        recorded_at: new Date().toISOString(),
        is_current: true,
        status: 'DRAFT',
        ...profile
      } as MeasurementProfile;
      return { measurementProfiles: [newObj, ...state.measurementProfiles] };
    });
    return newObj as unknown as MeasurementProfile;
  },
  addAppointment: (appointment: Partial<Appointment>) => set((state) => ({
    appointments: [{ id: `APT-${Date.now()}`, status: 'Scheduled', ...appointment } as Appointment, ...state.appointments]
  })),
  addFittingSession: (session: Partial<FittingSession>) => set((state) => ({
    fittingSessions: [{ id: `FIT-${Date.now()}`, status: 'Scheduled', ...session } as FittingSession, ...state.fittingSessions]
  })),
  updateAppointmentStatus: (id, status) => set((state) => ({
    appointments: state.appointments.map(a => a.id === id ? { ...a, status } : a)
  })),
});
