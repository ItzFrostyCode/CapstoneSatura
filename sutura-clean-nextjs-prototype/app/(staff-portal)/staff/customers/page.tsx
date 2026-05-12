'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useERPStore } from '@/store/useERPStore';
import { Customer, MeasurementProfile, Appointment } from '@/types/erp';

// Shared Components
import { CustomerDirectory } from '@/components/shared/customers/CustomerDirectory';
import { CustomerProfile } from '@/components/shared/customers/CustomerProfile';
import { CustomerModals, CustomerForm, FittingForm } from '@/components/shared/customers/CustomerModals';

// ── CONSTANTS & CONFIG ──
const TAILORING_POSTURE_TAGS = [
  "Sloping Shoulders", "Square Shoulders", "Stooped", "Erect", 
  "Prominent Chest", "Prominent Seat", "Sway Back", "Head Forward",
  "Low Right Shoulder", "Low Left Shoulder", "Full Bicep", "Thin Bicep"
];

const GARMENT_TYPES = [
  "Suit", "Barong", "Polo", "Blazer", "Uniform", "Slacks", "Dress", "Skirt", "Custom"
];

const JACKET_FIELDS = [
  'Jacket Neck', 'Jacket Shoulder', 'Jacket Chest', 'Jacket Bust', 'Jacket Waist', 'Jacket Hip', 
  'Jacket Sleeve', 'Jacket Length', 'Jacket Armhole', 'Jacket Bicep', 'Jacket Cuff', 
  'Jacket Shoulder Slope', 'Jacket Front Length', 'Jacket Back Length'
];

const PANTS_FIELDS = [
  'Pants Waist', 'Pants Hip', 'Pants Inseam', 'Pants Outseam', 
  'Pants Thigh', 'Pants Knee', 'Pants Hem', 'Pants Rise'
];

const FULL_BODY_FIELDS = [
  ...JACKET_FIELDS,
  ...PANTS_FIELDS
];

// Utility helpers
const generateAppointmentId = () => `APP-${Math.floor(Math.random() * 9000) + 1000}`;

export default function StaffCustomersPage() {
  const { 
    customers, measurementProfiles, fittingSessions, orders, appointments, staff,
    addCustomer, updateCustomer, addMeasurementProfile, pushNotification,
    updateMeasurementProfile, deleteMeasurementProfile
  } = useERPStore();
  const router = useRouter();

  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [profileTab, setProfileTab] = useState<'overview' | 'orders' | 'measurements' | 'appointments' | 'history'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [selectedEditCustomer, setSelectedEditCustomer] = useState<Customer | null>(null);
  const [isAddMeasurementModalOpen, setIsAddMeasurementModalOpen] = useState(false);
  const [selectedEditMeasurement, setSelectedEditMeasurement] = useState<MeasurementProfile | null>(null);
  const [isAddFittingModalOpen, setIsAddFittingModalOpen] = useState(false);
  const [activeProfileForFitting, setActiveProfileForFitting] = useState<string | null>(null);
  const [isScheduleAppointmentModalOpen, setIsScheduleAppointmentModalOpen] = useState(false);

  // Form States
  const [customerForm, setCustomerForm] = useState<CustomerForm>({ name: '', email: '', phone: '', address: '', gender: 'Male' });
  const [newPostureTag, setNewPostureTag] = useState('');
  const [measForm, setMeasForm] = useState<Partial<MeasurementProfile>>({
    profile_name: '', garment_category: 'Upper Wear', garment_type: 'Suit', fit_preference: 'Regular', measurement_unit: 'Inches', version_no: 'V1', status: 'DRAFT'
  });
  const [measValues, setMeasValues] = useState<Record<string, string>>({});
  const [fittingForm, setFittingForm] = useState<FittingForm>({ adjustment_notes: '', next_fitting_date: '', handled_by_staff_id: 'STF-001' });
  const [fittingMetrics, setFittingMetrics] = useState<Record<string, string>>({});
  const [aptForm, setAptForm] = useState<Partial<Appointment>>({ 
    type: 'CONSULTATION', status: 'Scheduled', duration: 60 
  });

  // ── HELPERS ──
  const selectedCustomer = useMemo(() => customers.find(c => c.id === selectedCustomerId), [customers, selectedCustomerId]);
  const activeProfile = useMemo(() => measurementProfiles.find(m => m.id === activeProfileForFitting), [measurementProfiles, activeProfileForFitting]);
  
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
    );
  }, [customers, searchQuery]);

  // ── HANDLERS ──
  const handleCreateCustomer = () => {
    if (!customerForm.name || !customerForm.phone) {
      pushNotification('Name and phone are required.', 'error');
      return;
    }
    addCustomer({ ...customerForm, type: 'Individual' });
    setCustomerForm({ name: '', email: '', phone: '', address: '', gender: 'Male' });
    setIsAddCustomerModalOpen(false);
    pushNotification('Customer registered successfully.', 'success');
  };

  const handleUpdateCustomer = () => {
    if (!selectedEditCustomer) return;
    updateCustomer(selectedEditCustomer.id, selectedEditCustomer);
    setSelectedEditCustomer(null);
    pushNotification('Customer details updated.', 'success');
  };

  const handleAddCustomTag = () => {
    if (!selectedCustomer || !newPostureTag.trim()) return;
    const currentTags = selectedCustomer.posture_tags || [];
    if (currentTags.includes(newPostureTag.trim())) {
      pushNotification('Tag already exists.', 'info');
      return;
    }
    updateCustomer(selectedCustomer.id, { posture_tags: [...currentTags, newPostureTag.trim()] });
    setNewPostureTag('');
    pushNotification('Custom tag added.', 'success');
  };

  const handleSaveMeasurement = () => {
    if (!selectedCustomerId) return;
    const dynamicMetrics: Record<string, number> = {};
    Object.entries(measValues).forEach(([key, val]) => {
      const fieldKey = key.toLowerCase().replace(/ /g, '_');
      dynamicMetrics[fieldKey] = parseFloat(val);
    });

    addMeasurementProfile({ ...measForm, customer_id: selectedCustomerId, ...dynamicMetrics });
    setIsAddMeasurementModalOpen(false);
    setMeasValues({});
    setMeasForm({
      profile_name: '', garment_category: 'Upper Wear', garment_type: 'Suit', fit_preference: 'Regular', measurement_unit: 'Inches', version_no: 'V1', status: 'DRAFT'
    });
    pushNotification('Professional measurement profile created.', 'success');
  };

  const handleEditMeasurement = (profile: MeasurementProfile) => {
    setSelectedEditMeasurement(profile);
    setMeasForm({
      profile_name: profile.profile_name,
      garment_category: profile.garment_category,
      garment_type: profile.garment_type,
      fit_preference: profile.fit_preference,
      measurement_unit: profile.measurement_unit,
      version_no: profile.version_no,
      status: profile.status
    });
    
    const initial: Record<string, string> = {};
    const fields = profile.garment_category === 'Upper Wear' ? JACKET_FIELDS : profile.garment_category === 'Lower Wear' ? PANTS_FIELDS : FULL_BODY_FIELDS;
    fields.forEach(f => {
      const key = f.toLowerCase().replace(/ /g, '_');
      const val = (profile as unknown as Record<string, unknown>)[key];
      if (val !== undefined && val !== null) initial[f] = String(val);
    });
    setMeasValues(initial);
    setIsAddMeasurementModalOpen(true);
  };

  const handleUpdateMeasurement = () => {
    if (!selectedEditMeasurement) return;
    const dynamicMetrics: Record<string, number> = {};
    Object.entries(measValues).forEach(([key, val]) => {
      const fieldKey = key.toLowerCase().replace(/ /g, '_');
      dynamicMetrics[fieldKey] = parseFloat(val);
    });

    updateMeasurementProfile(selectedEditMeasurement.id, { ...measForm, ...dynamicMetrics });
    setIsAddMeasurementModalOpen(false);
    setSelectedEditMeasurement(null);
    setMeasValues({});
    setMeasForm({
      profile_name: '', garment_category: 'Upper Wear', garment_type: 'Suit', fit_preference: 'Regular', measurement_unit: 'Inches', version_no: 'V1', status: 'DRAFT'
    });
    pushNotification('Measurement profile updated.', 'success');
  };

  const handleSaveFitting = () => {
    if (!activeProfileForFitting || !activeProfile) return;
    
    const updatedMetrics: Record<string, number> = {};
    Object.entries(fittingMetrics).forEach(([k, v]) => {
      if (v) updatedMetrics[k.toLowerCase().replace(/ /g, '_')] = parseFloat(v);
    });

    const { recordFittingAdjustment } = useERPStore.getState();
    recordFittingAdjustment(activeProfile, updatedMetrics, fittingForm);

    setIsAddFittingModalOpen(false);
    setFittingForm({ adjustment_notes: '', next_fitting_date: '', handled_by_staff_id: 'STF-001' });
    setFittingMetrics({});
    pushNotification(`Adjustment recorded. New version created based on fitting results.`, 'success');
  };

  const handleScheduleAppointment = () => {
    if (!selectedCustomerId || !selectedCustomer || !aptForm.date || !aptForm.startTime) {
      pushNotification('Date and Time are required.', 'error');
      return;
    }
    
    const newApt: Appointment = {
      id: generateAppointmentId(),
      customer: selectedCustomer.name,
      email: selectedCustomer.email,
      phone: selectedCustomer.phone,
      type: aptForm.type || 'CONSULTATION',
      category: aptForm.type || 'Consultation',
      date: aptForm.date,
      startTime: aptForm.startTime,
      duration: aptForm.duration || 60,
      status: 'Scheduled',
      staff: aptForm.staff || 'Unassigned',
      source: 'Walk-in',
      reason: aptForm.reason
    };

    useERPStore.getState().appointments.push(newApt);
    
    setIsScheduleAppointmentModalOpen(false);
    setAptForm({ type: 'CONSULTATION', status: 'Scheduled', duration: 60 });
    pushNotification('Appointment scheduled successfully.', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 max-w-[1600px] mx-auto pb-20">
      
      {!selectedCustomerId ? (
        <CustomerDirectory 
          customers={filteredCustomers}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSelectCustomer={setSelectedCustomerId}
          onOpenAddModal={() => setIsAddCustomerModalOpen(true)}
        />
      ) : selectedCustomer ? (
        <CustomerProfile 
          customer={selectedCustomer}
          orders={orders}
          measurementProfiles={measurementProfiles}
          appointments={appointments}
          fittingSessions={fittingSessions}
          profileTab={profileTab}
          setProfileTab={setProfileTab}
          onBack={() => setSelectedCustomerId(null)}
          onEditCustomer={setSelectedEditCustomer}
          onNewProfile={() => setIsAddMeasurementModalOpen(true)}
          onNewOrder={() => pushNotification('Only Shop Owners can create new orders directly. Use the Job Order flow.', 'info')}
          onUpdatePosture={(tags) => updateCustomer(selectedCustomer.id, { posture_tags: tags })}
          onUpdateStyle={(style) => updateCustomer(selectedCustomer.id, { style_preferences: style })}
          newPostureTag={newPostureTag}
          setNewPostureTag={setNewPostureTag}
          onAddCustomTag={handleAddCustomTag}
          onEditProfile={handleEditMeasurement}
          onDeleteProfile={(id) => {
            deleteMeasurementProfile(id);
            pushNotification('Measurement profile deleted.', 'info');
          }}
          onRecordFitting={(profile) => {
             setActiveProfileForFitting(profile.id);
             const initial: Record<string, string> = {};
             const fields = profile.garment_category === 'Upper Wear' ? JACKET_FIELDS : profile.garment_category === 'Lower Wear' ? PANTS_FIELDS : FULL_BODY_FIELDS;
             fields.forEach(f => {
               const key = f.toLowerCase().replace(/ /g, '_');
               const val = (profile as unknown as Record<string, unknown>)[key];
               if (val !== undefined && val !== null) initial[f] = String(val);
             });
             setFittingMetrics(initial);
             setIsAddFittingModalOpen(true);
          }}
          onNewAppointment={() => setIsScheduleAppointmentModalOpen(true)}
          postureTags={TAILORING_POSTURE_TAGS}
          hideAppointmentBtn={true}
          hideAppointmentsTab={true}
          hideNewOrderBtn={true}
        />
      ) : null}

      <CustomerModals 
        isAddCustomerModalOpen={isAddCustomerModalOpen}
        setIsAddCustomerModalOpen={setIsAddCustomerModalOpen}
        customerForm={customerForm}
        setCustomerForm={setCustomerForm}
        handleCreateCustomer={handleCreateCustomer}
        selectedEditCustomer={selectedEditCustomer}
        setSelectedEditCustomer={setSelectedEditCustomer}
        handleUpdateCustomer={handleUpdateCustomer}
        isAddMeasurementModalOpen={isAddMeasurementModalOpen}
        setIsAddMeasurementModalOpen={setIsAddMeasurementModalOpen}
        measForm={measForm}
        setMeasForm={setMeasForm}
        measValues={measValues}
        setMeasValues={setMeasValues}
        handleSaveMeasurement={selectedEditMeasurement ? handleUpdateMeasurement : handleSaveMeasurement}
        selectedEditMeasurement={selectedEditMeasurement}
        selectedCustomer={selectedCustomer}
        garmentTypes={GARMENT_TYPES}
        upperFields={JACKET_FIELDS}
        lowerFields={PANTS_FIELDS}
        fullBodyFields={FULL_BODY_FIELDS}
        isAddFittingModalOpen={isAddFittingModalOpen}
        setIsAddFittingModalOpen={setIsAddFittingModalOpen}
        fittingForm={fittingForm}
        setFittingForm={setFittingForm}
        fittingMetrics={fittingMetrics}
        setFittingMetrics={setFittingMetrics}
        handleSaveFitting={handleSaveFitting}
        activeProfile={activeProfile}
        staff={staff}
        isScheduleAppointmentModalOpen={isScheduleAppointmentModalOpen}
        setIsScheduleAppointmentModalOpen={setIsScheduleAppointmentModalOpen}
        aptForm={aptForm}
        setAptForm={setAptForm}
        handleScheduleAppointment={handleScheduleAppointment}
      />

    </div>
  );
}
