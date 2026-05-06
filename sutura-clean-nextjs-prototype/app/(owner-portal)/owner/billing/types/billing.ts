import { Invoice, Payment, SupplierBill } from '@/types/erp';

export interface EnhancedInvoice extends Invoice {
  amountPaid: number;
  balance: number;
  computedTotal: number;
  lineSubtotal: number;
  discountValue: number;
  taxAmount: number;
  computedStatus: string;
  agingDays: number;
  agingBucket: string;
  invPayments: Payment[];
  issueDate: string;
  dueDate: string;
  paidDate?: string;
}

export interface EnhancedBill extends SupplierBill {
  paid: number;
  balance: number;
}
