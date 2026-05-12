export interface DesignBlueprint {
  id: string;
  requestId: string;
  customerName: string;
  garmentType: string;
  targetDate: string;
  status: 'Draft' | 'Approved' | 'SentToShop' | 'InProduction';
  
  // Visual Assets
  inspirationImages: { url: string; note?: string }[];
  sketches: { url: string; version: string; date: string }[];
  
  // Design Details
  fabricSuggestions: { name: string; type: string; color: string }[];
  colorPalette: { name: string; hex: string }[];
  
  // Technical Notes
  styleNotes: string[];
  measurementRequirements: string[];
  specialInstructions: string[];
  
  // History
  revisions: { date: string; note: string; author: string }[];
}
