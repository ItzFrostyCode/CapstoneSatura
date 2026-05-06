import { OrderType, BulkSizingStrategy, AssetType } from './erp';

export interface AlterationMeasurement {
  area: string;
  current: number;
  desired: number;
  difference: number;
}

export interface AlterationMaterial {
  item_id: string;
  item_name: string;
  quantity: number;
}

export interface AlterationTask {
  title: string;
  price: number;
}

export interface AlterationDetails {
  itemDescription: string;
  itemCondition: 'Good' | 'Needs Repair' | 'Damaged';
  specificIssue: string;
  affectedAreas: string[];
  measurements: AlterationMeasurement[];
  materialsNeeded: AlterationMaterial[];
  tasks: AlterationTask[];
  beforePhotos: string[];
  afterPhotos: string[];
}

export interface BulkMember {
  id: string;
  name: string;
  base_size: string;
  jersey_number?: string;
  measurement_type?: string;
  adjustment_notes: string;
}

export interface DesignAsset {
  type: AssetType;
  file?: string;
  link?: string;
  notes?: string;
}

export interface ExternalLink {
  label: string;
  url: string;
}

export interface OrderFormData {
  orderType: OrderType;
  variantId: string;
  bulkSizingStrategy: BulkSizingStrategy;
  bulkMembers: BulkMember[];
  bulkSizeMatrix: Record<string, number>;
  organizationName: string;
  customerId: string;
  measurementProfileId: string;
  garmentTemplateId: string;
  quantity: number;
  deposit: number;
  paymentMethod: string;
  paymentReference: string;
  paymentReceiptImage: string;
  assignedTailorId: string;
  branchId: string;
  isRush: boolean;
  rushFeeAmount: number;
  notes: string;
  alterationDetails: AlterationDetails;
  swatchImages: string[];
  designAssets: DesignAsset[];
  externalLinks: ExternalLink[];
  fabricWidth: number;
  fabricName: string;
  taskAssignments: Record<string, string>;
  estimatedCompletionDate: string;
}
