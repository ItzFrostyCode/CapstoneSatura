import { z } from 'zod';

export const OrderSchema = z.object({
  customer_id: z.string().min(1, "Customer is required"),
  garment: z.string().min(1, "Garment selection is required"),
  quantity: z.number().int().positive().default(1),
  totalValue: z.number().positive("Total value must be positive"),
  dueDate: z.string().refine((date) => new Date(date) > new Date(), {
    message: "Due date must be in the future",
  }),
  priority: z.enum(['Low', 'Normal', 'High', 'Urgent']),
  notes: z.string().optional(),
});

export type OrderFormData = z.infer<typeof OrderSchema>;
