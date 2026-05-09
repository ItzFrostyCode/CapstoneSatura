'use client';

import { useState, useMemo } from 'react';
import { useERPStore } from '@/store/useERPStore';
import { 
  OrderType, 
  BulkSizingStrategy, 
  Order,
  FitPreference,
  GarmentCategory,
  TaskStatus,
  AssetType,
  InventoryAnalysis
} from '@/types/erp';
import { OrderFormData } from '@/types/orderFormData';
import { 
  X, ChevronRight, ChevronLeft, Check, 
  
} from 'lucide-react';

// Modular Components
import { CategoryStep } from './CreateOrderModal/steps/CategoryStep';
import { CustomerStep } from './CreateOrderModal/steps/CustomerStep';
import { BulkStep1 } from './CreateOrderModal/steps/BulkStep1';
import { ReadyMadeStep1 } from './CreateOrderModal/steps/ReadyMadeStep1';
import { ReadyMadeVariantStep } from './CreateOrderModal/steps/ReadyMadeVariantStep';
import { MeasurementStep } from './CreateOrderModal/steps/MeasurementStep';
import { PersonnelSizingStep } from './CreateOrderModal/steps/PersonnelSizingStep';
import { AlterationItemStep } from './CreateOrderModal/steps/AlterationItemStep';
import { AlterationRequestStep } from './CreateOrderModal/steps/AlterationRequestStep';
import { AlterationMeasurementsStep } from './CreateOrderModal/steps/AlterationMeasurementsStep';
import { AlterationMaterialsStep } from './CreateOrderModal/steps/AlterationMaterialsStep';
import { GarmentTemplateStep } from './CreateOrderModal/steps/GarmentTemplateStep';
import { AlterationTaskStep } from './CreateOrderModal/steps/AlterationTaskStep';
import { QuantityPricingStep } from './CreateOrderModal/steps/QuantityPricingStep';
import { FabricAnalysisStep } from './CreateOrderModal/steps/FabricAnalysisStep';
import { DesignFabricStep } from './CreateOrderModal/steps/DesignFabricStep';
import { PaymentStep } from './CreateOrderModal/steps/PaymentStep';
import { PersonnelAssignmentStep } from './CreateOrderModal/steps/PersonnelAssignmentStep';
import { SummaryStep } from './CreateOrderModal/steps/SummaryStep';
import { NewCustomerForm, NewMeasurementForm } from './CreateOrderModal/forms/AddCustomerForm';
import { NewGarmentForm } from './CreateOrderModal/forms/AddGarmentForm';

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateOrderModal({ isOpen, onClose }: CreateOrderModalProps) {
  const { 
    customers, 
    garmentTemplates, 
    measurementProfiles, 
    inventory, 
    staff,
    currentUser,
    currentShop,
    currentBranch,
    addCustomer,
    pushNotification,
    addGarmentTemplate,
    addMeasurementProfile,
    createNewOrder,
    recordInventoryTransaction
  } = useERPStore();

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<OrderFormData>(() => ({
    orderType: 'BESPOKE' as OrderType,
    variantId: '', // Added for Ready-Made
    bulkSizingStrategy: 'STANDARD' as BulkSizingStrategy,
    bulkMembers: [] as { id: string, name: string, base_size: string, adjustment_notes: string }[],
    bulkSizeMatrix: {
      'S': 0, 'M': 0, 'L': 0, 'XL': 0, '2XL': 0, '3XL': 0
    } as Record<string, number>,
    organizationName: '',
    customerId: '',
    measurementProfileId: '',
    garmentTemplateId: '',
    quantity: 1,
    deposit: 0,
    paymentMethod: 'Cash',
    paymentReference: '',
    paymentReceiptImage: '',
    assignedTailorId: '',
    branchId: currentBranch?.id || 'BRN-001',
    isRush: false,
    rushFeeAmount: 1500,
    customizationFee: 0,
    discount: 0,
    notes: '',
    alterationDetails: {
      itemDescription: '',
      itemCondition: 'Good' as 'Good' | 'Needs Repair' | 'Damaged',
      specificIssue: '',
      affectedAreas: [] as string[],
      measurements: [] as { area: string, current: number, desired: number, difference: number }[],
      materialsNeeded: [] as { item_id: string, item_name: string, quantity: number }[],
      tasks: [] as { title: string, price: number }[],
      beforePhotos: [] as string[],
      afterPhotos: [] as string[]
    },
    swatchImages: [] as string[],
    designAssets: [] as { type: AssetType, file?: string, link?: string, notes?: string }[],
    externalLinks: [] as { label: string, url: string }[],
    fabricWidth: 60,
    fabricName: '',
    isCustomerProvidedFabric: false,
    taskAssignments: {} as Record<string, string>,
    estimatedCompletionDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  }));

  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState<NewCustomerForm>({ 
    name: '', phone: '', email: '', gender: 'Male' as 'Male' | 'Female', posture_tags: [] as string[], style_preferences: '' 
  });

  const [newMeasurement, setNewMeasurement] = useState<NewMeasurementForm>({
    profile_name: 'Initial Profile', garment_category: 'Upper Wear' as GarmentCategory, garment_type: 'Suit', fit_preference: 'Regular' as FitPreference,
    shoulder_width: 0, chest_circumference: 0, waist_circumference: 0, hip_circumference: 0, sleeve_length: 0,
    neck_circumference: 0, armhole_circumference: 0, bicep_circumference: 0, wrist_circumference: 0,
    back_width: 0, front_width: 0, shoulder_slope: 0, jacket_length: 0, special_instructions: '', measurement_unit: 'Inches' as 'Inches' | 'Centimeters'
  });

  const [showAddGarment, setShowAddGarment] = useState(false);
  const [newGarment, setNewGarment] = useState<NewGarmentForm>({ 
    name: '', category: 'Suits', base_price: 0, fabric_sku: '', fabric_per_unit: 0, requires_measurement: true,
    default_tasks: ['Pattern Making', 'Cutting', 'Assembling', 'Fitting', 'Final Sewing', 'QC']
  });

  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkImportText, setBulkImportText] = useState('');

  // Derived total quantity (avoiding useEffect to prevent cascading renders)
  const totalQuantity = useMemo(() => {
    if (formData.orderType === 'BULK' && formData.bulkSizingStrategy === 'STANDARD') {
      const matrixSum = Object.values(formData.bulkSizeMatrix).reduce((sum, val) => sum + val, 0);
      return matrixSum > 0 ? matrixSum : formData.quantity;
    }
    return formData.quantity;
  }, [formData.quantity, formData.bulkSizeMatrix, formData.orderType, formData.bulkSizingStrategy]);

  const selectedCustomer = customers.find(c => c.id === formData.customerId);
  const selectedTemplate = garmentTemplates.find(g => g.id === formData.garmentTemplateId) || null;
  const selectedProduct = inventory.find(i => i.id === formData.garmentTemplateId) || null;
  const filteredMeasurements = measurementProfiles.filter(m => m.customer_id === formData.customerId);
  
  const fabricAnalysis = useMemo((): InventoryAnalysis | null => {
    if (!selectedTemplate) return null;
    const fabric = inventory.find(i => i.sku.trim().toUpperCase() === selectedTemplate.fabric_sku.trim().toUpperCase());
    if (!fabric) return { status: 'ERROR', message: 'Fabric not found', needed: 0, available: 0, shortage: 0 };
    const needed = selectedTemplate.fabric_per_unit * totalQuantity;
    const available = (fabric.stock || 0) - (fabric.reserved || 0);
    return available >= needed 
      ? { status: 'OK', needed, available, shortage: 0 } 
      : { status: 'SHORTAGE', needed, available, shortage: needed - available };
  }, [selectedTemplate, totalQuantity, inventory]);

  const financials = useMemo(() => {
    let baseAmount = 0;
    let bomCost = 0;
    let laborCost = 0;

    if (formData.orderType === 'ALTERATION') {
      baseAmount = formData.alterationDetails.tasks.reduce((sum, t) => sum + (Number(t.price) || 0), 0);
    } else if (formData.orderType === 'READY_MADE') {
      baseAmount = (selectedProduct?.unit_price || 1500) * totalQuantity;
      bomCost = (selectedProduct?.unit_cost || 0) * totalQuantity;
    } else if (selectedTemplate) {
      baseAmount = formData.isCustomerProvidedFabric 
        ? (selectedTemplate.cmt_price || selectedTemplate.base_price * 0.7) * totalQuantity 
        : selectedTemplate.base_price * totalQuantity;
      
      laborCost = (selectedTemplate.estimated_labor_cost || 0) * totalQuantity;
      
      if (!formData.isCustomerProvidedFabric) {
        const fabric = inventory.find(i => i.sku.trim().toUpperCase() === selectedTemplate.fabric_sku.trim().toUpperCase());
        bomCost = (fabric?.unit_cost || 0) * (selectedTemplate.fabric_per_unit * totalQuantity);
      }
    }

    const rushFee = formData.isRush ? formData.rushFeeAmount : 0;
    const customizationFee = formData.customizationFee || 0;
    const discount = formData.discount || 0;

    const totalSellingPrice = (baseAmount + rushFee + customizationFee) - discount;
    const totalProductionCost = bomCost + laborCost;
    const profitMargin = totalSellingPrice > 0 ? ((totalSellingPrice - totalProductionCost) / totalSellingPrice) * 100 : 0;

    return {
      baseAmount, rushFee, customizationFee, discount, totalSellingPrice,
      totalBomCost: bomCost, totalLaborCost: laborCost, totalProductionCost, profitMargin
    };
  }, [formData, selectedTemplate, selectedProduct, totalQuantity, inventory]);

  // Handlers
  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.phone) {
      pushNotification('Name and phone are required.', 'error');
      return;
    }
    const createdCustomer = addCustomer({ ...newCustomer, type: 'Individual' });
    const createdProfile = addMeasurementProfile({ ...newMeasurement, customer_id: createdCustomer.id, profile_name: `${newCustomer.name} - Initial Profile` });
    setFormData(prev => ({ ...prev, customerId: createdCustomer.id, measurementProfileId: createdProfile.id }));
    setShowAddCustomer(false);
    pushNotification(`Customer ${newCustomer.name} registered.`, 'success');
  };

  const handleAddGarment = () => {
    if (!newGarment.name) return;
    addGarmentTemplate(newGarment);
    setShowAddGarment(false);
    pushNotification(`Garment ${newGarment.name} added.`, 'success');
  };

  const parseBulkText = (text: string) => {
    const lines = text.split('\n').filter(l => l.trim());
    const newMembers = lines.map((line, idx) => {
      const [name, base_size, adjustment_notes] = line.split(',').map(s => s.trim());
      return { id: `MBR-${Date.now()}-${idx}`, name: name || 'Unnamed Player', base_size: base_size || 'M', adjustment_notes: adjustment_notes || '' };
    });
    setFormData(prev => ({ ...prev, bulkMembers: [...prev.bulkMembers, ...newMembers] }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, swatchImages: [...prev.swatchImages, reader.result as string] }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFinalSubmit = () => {
    const isReadyMade = formData.orderType === 'READY_MADE';
    const finalStatus = isReadyMade 
      ? (formData.deposit >= financials.totalSellingPrice ? 'COMPLETED' : 'READY_FOR_PICKUP')
      : (formData.deposit >= (financials.totalSellingPrice * 0.5) ? 'IN_PRODUCTION' : 'ON_HOLD');

    const itemUnitPrice = isReadyMade ? (selectedProduct?.unit_price || 0) : (formData.orderType === 'ALTERATION' ? 0 : (selectedTemplate?.base_price || 0));
    const itemGarmentName = isReadyMade ? (selectedProduct?.item_name || 'Product') : (formData.orderType === 'ALTERATION' ? formData.alterationDetails.itemDescription : (selectedTemplate?.name || 'Custom'));

    const newOrderId = `ORD-${Date.now()}`;
    const mainOrder = {
      id: newOrderId,
      shop_id: currentShop?.id || 'SHOP-001',
      branch_id: currentBranch?.id || 'BRN-001',
      customer_id: formData.customerId || 'CUST-WALK-IN',
      organization_name: formData.organizationName,
      created_by_user_id: currentUser?.id || 'USR-001',
      bulk_sizing_strategy: formData.bulkSizingStrategy,
      bulk_members: formData.bulkMembers.map(m => ({ ...m, status: 'PENDING' })),
      order_type: formData.orderType,
      source_type: 'WALK_IN',
      status: finalStatus,
      priority: formData.isRush ? 'High' : 'Normal',
      fabric_name: formData.fabricName,
      fabric_width: formData.fabricWidth,
      is_customer_provided_fabric: formData.isCustomerProvidedFabric,
      base_amount: financials.baseAmount,
      rush_fee: financials.rushFee,
      customization_fee: financials.customizationFee,
      discount: financials.discount,
      total_amount: financials.totalSellingPrice,
      total_bom_cost: financials.totalBomCost,
      total_labor_cost: financials.totalLaborCost,
      total_production_cost: financials.totalProductionCost,
      profit_margin: financials.profitMargin,
      amount_paid: formData.deposit,
      balance: financials.totalSellingPrice - formData.deposit,
      due_date: formData.estimatedCompletionDate,
      estimated_completion_date: formData.estimatedCompletionDate,
      created_at: new Date().toISOString(),
      variant_id: formData.variantId,
      alteration_details: formData.orderType === 'ALTERATION' ? formData.alterationDetails : undefined,
      items: [{ 
        id: `ITEM-${Date.now()}`, 
        job_order_id: newOrderId, 
        garment_name: itemGarmentName, 
        garment_template_id: formData.garmentTemplateId, 
        quantity: totalQuantity, 
        unit_price: itemUnitPrice,
        line_total: itemUnitPrice * totalQuantity,
        bom_cost: financials.totalBomCost,
        labor_cost: financials.totalLaborCost
      }],
      tasks: isReadyMade ? [] : (formData.orderType === 'ALTERATION' ? formData.alterationDetails.tasks.map(t => t.title) : (selectedTemplate?.default_tasks || [])).map((t: string, idx: number) => ({ 
        id: `T-${idx + 1}`, 
        job_order_id: newOrderId,
        title: t, 
        status: (formData.taskAssignments[t] ? 'Assigned' : 'Pending') as TaskStatus, 
        assigned_staff_id: formData.taskAssignments[t] 
      })),
      measurement_profile_id: formData.measurementProfileId,
      notes: formData.notes
    };

    // --- Record Inventory Deduction ---
    if (isReadyMade && formData.garmentTemplateId) {
      recordInventoryTransaction(
        formData.garmentTemplateId, 
        'OUT', 
        totalQuantity, 
        `Retail Sale ${newOrderId}`, 
        newOrderId, 
        formData.variantId
      );
    } else if (!isReadyMade && formData.orderType !== 'ALTERATION' && !formData.isCustomerProvidedFabric && selectedTemplate) {
      // Find the fabric item ID based on the template's SKU
      const fabric = inventory.find(i => i.sku.trim().toUpperCase() === selectedTemplate.fabric_sku.trim().toUpperCase());
      if (fabric) {
        const needed = selectedTemplate.fabric_per_unit * totalQuantity;
        recordInventoryTransaction(
          fabric.id,
          'RESERVE', // Reserve the fabric for this job order
          needed,
          `Fabric reservation for ${newOrderId}`,
          newOrderId
        );
      }
    }

    createNewOrder(mainOrder as Order);
    pushNotification(isReadyMade ? `Instant sale ${newOrderId} recorded.` : `Job Order ${newOrderId} created.`, 'success');
    onClose();
    setStep(0);
  };

  const nextStep = () => {
    if (formData.orderType === 'READY_MADE') {
       if (step === 1) setStep(1.5);
       else if (step === 1.5) setStep(7);
       else if (step === 7) setStep(9);
       else setStep(step + 1);
    } else if (formData.orderType === 'BULK') {
       if (step === 2) setStep(2.5);
       else if (step === 2.5) setStep(3);
       else setStep(step + 1);
    } else {
       setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (formData.orderType === 'READY_MADE') {
        if (step === 9) setStep(7);
        else if (step === 7) setStep(1.5);
        else if (step === 1.5) setStep(1);
        else setStep(step - 1);
    } else if (formData.orderType === 'BULK') {
        if (step === 3) setStep(2.5);
        else if (step === 2.5) setStep(2);
        else setStep(step - 1);
    } else {
        setStep(step - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-[800px] h-[90vh] rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <h2 className="text-[20px] font-black text-slate-900 tracking-tight">
              {formData.orderType === 'READY_MADE' ? 'Retail / POS Checkout' : 'Create New Job Order'}
            </h2>
            <p className="text-[12px] text-slate-500 font-bold uppercase tracking-widest mt-1">
              {step === 0 ? 'Production Type Selection' : `Stage ${step} — ${getStepTitle(step, formData.orderType)}`}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400">
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-slate-100 w-full shrink-0">
          <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${(step / 9) * 100}%` }} />
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {step === 0 && <CategoryStep onSelect={(type) => { setFormData({...formData, orderType: type}); setStep(1); }} />}
          
          {step === 1 && (
            formData.orderType === 'BESPOKE' || formData.orderType === 'ALTERATION' || formData.orderType === 'BULK'
              ? <CustomerStep customers={customers} measurementProfiles={measurementProfiles} formData={formData} setFormData={setFormData} showAddCustomer={showAddCustomer} setShowAddCustomer={setShowAddCustomer} newCustomer={newCustomer} setNewCustomer={setNewCustomer} newMeasurement={newMeasurement} setNewMeasurement={setNewMeasurement} onAddCustomer={handleAddCustomer} />
              : <ReadyMadeStep1 inventory={inventory} formData={formData} setFormData={setFormData} pushNotification={pushNotification} />
          )}

          {step === 1.5 && <ReadyMadeVariantStep inventory={inventory} formData={formData} setFormData={setFormData} />}

          {step === 2 && (
            formData.orderType === 'BULK'
              ? <BulkStep1 formData={formData} setFormData={setFormData} />
              : (formData.orderType === 'BESPOKE' 
                  ? <MeasurementStep formData={formData} setFormData={setFormData} filteredMeasurements={filteredMeasurements} />
                  : <AlterationItemStep formData={formData} setFormData={setFormData} />)
          )}

          {step === 2.5 && formData.orderType === 'BULK' && (
             <PersonnelSizingStep formData={formData} setFormData={setFormData} showBulkImport={showBulkImport} setShowBulkImport={setShowBulkImport} bulkImportText={bulkImportText} setBulkImportText={setBulkImportText} parseBulkText={parseBulkText} />
          )}

          {step === 3 && (
            formData.orderType === 'ALTERATION'
              ? <AlterationRequestStep formData={formData} setFormData={setFormData} />
              : <GarmentTemplateStep garmentTemplates={garmentTemplates} formData={formData} setFormData={setFormData} showAddGarment={showAddGarment} setShowAddGarment={setShowAddGarment} newGarment={newGarment} setNewGarment={setNewGarment} onAddGarment={handleAddGarment} />
          )}

          {step === 4 && (
            formData.orderType === 'ALTERATION'
              ? <AlterationMeasurementsStep formData={formData} setFormData={setFormData} />
              : <QuantityPricingStep formData={formData} setFormData={setFormData} selectedTemplate={selectedTemplate} totalQuantity={totalQuantity} />
          )}

          {step === 5 && (
            formData.orderType === 'ALTERATION'
              ? <AlterationMaterialsStep inventory={inventory} formData={formData} setFormData={setFormData} />
              : <FabricAnalysisStep fabricAnalysis={fabricAnalysis} selectedTemplate={selectedTemplate} formData={formData} setFormData={setFormData} />
          )}

          {step === 6 && (
            formData.orderType === 'ALTERATION'
              ? <AlterationTaskStep formData={formData} setFormData={setFormData} />
              : <DesignFabricStep formData={formData} setFormData={setFormData} onFileChange={handleFileChange} onAddDesignAsset={(type) => setFormData(p => ({...p, designAssets: [...p.designAssets, { type: type as AssetType, notes: '' }]}))} onAddExternalLink={() => setFormData(p => ({...p, externalLinks: [...p.externalLinks, { label: 'Link', url: '' }]}))} />
          )}

          {step === 7 && <PaymentStep formData={formData} setFormData={setFormData} selectedTemplate={selectedTemplate || null} totalPrice={financials.totalSellingPrice} financials={financials} />}
          {step === 8 && <PersonnelAssignmentStep staff={staff} currentBranch={currentBranch} selectedTemplate={selectedTemplate || null} formData={formData} setFormData={setFormData} />}
          {step === 9 && <SummaryStep formData={formData} setFormData={setFormData} selectedCustomer={selectedCustomer} selectedTemplate={selectedTemplate || null} measurementProfiles={measurementProfiles} totalPrice={financials.totalSellingPrice} financials={financials} staff={staff} />}
        </div>

        {/* Footer */}
        {step > 0 && (
          <div className="px-8 py-6 border-t border-slate-100 bg-white shrink-0 flex items-center justify-between">
            <button onClick={prevStep} className="flex items-center gap-2 px-6 py-3 rounded-xl text-slate-500 font-black uppercase tracking-widest text-[11px] hover:bg-slate-50"><ChevronLeft size={16} /> Back</button>
            {step === 9 ? (
              <button onClick={handleFinalSubmit} className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[12px] shadow-xl hover:bg-indigo-600 transition-all active:scale-95"><Check size={18} /> Confirm Order</button>
            ) : (
              <button onClick={nextStep} className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[12px] shadow-xl hover:bg-slate-800 transition-all active:scale-95">Next Step <ChevronRight size={16} /></button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function getStepTitle(step: number, orderType: OrderType) {
  const titles: Record<number, string> = {
    1: orderType === 'BULK' ? 'Customer (Contact)' : 'Product Catalog',
    1.5: 'Select Variant',
    2: orderType === 'BULK' ? 'Organization' : (orderType === 'ALTERATION' ? 'Garment Intake' : 'Measurements'),
    2.5: 'Personnel Sizing',
    3: orderType === 'ALTERATION' ? 'Scope of Request' : 'Template Selection',
    4: orderType === 'ALTERATION' ? 'Adjustments' : 'Quantity',
    5: orderType === 'ALTERATION' ? 'Materials' : 'Fabric Analysis',
    6: orderType === 'ALTERATION' ? 'Service Pricing' : 'Design & Assets',
    7: 'Payment & Deadline',
    8: 'Production Assignment',
    9: 'Final Review'
  };
  return titles[step] || 'Order Creation';
}
