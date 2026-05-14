'use server';

/**
 * SUTURA — Production Workflow Server Actions
 * Controls the 9-stage production lifecycle for each order.
 */

export type ProductionStage =
  | 'ORDER_INTAKE'
  | 'MEASURING'
  | 'MATERIAL_SOURCING'
  | 'CUTTING'
  | 'SEWING'
  | 'FIRST_FITTING'
  | 'ALTERATIONS'
  | 'FINISHING'
  | 'READY_FOR_PICKUP';

export const PRODUCTION_STAGE_ORDER: ProductionStage[] = [
  'ORDER_INTAKE',
  'MEASURING',
  'MATERIAL_SOURCING',
  'CUTTING',
  'SEWING',
  'FIRST_FITTING',
  'ALTERATIONS',
  'FINISHING',
  'READY_FOR_PICKUP',
];

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AdvanceStagePayload {
  orderId: string;
  currentStage: ProductionStage;
  advancedByUserId: string;
  notes?: string;
}

export interface LogProductionNotePayload {
  orderId: string;
  taskId?: string;
  note: string;
  loggedByUserId: string;
}

export interface AssignProductionTaskPayload {
  orderId: string;
  taskName: string;
  assignedToUserId: string;
  specializationId?: string;
  notes?: string;
}

/**
 * Advances an order to the next production stage.
 * Validates that the stage transition is sequential.
 */
export async function advanceProductionStage(
  payload: AdvanceStagePayload
): Promise<ActionResult<{ newStage: ProductionStage }>> {
  try {
    const currentIndex = PRODUCTION_STAGE_ORDER.indexOf(payload.currentStage);

    if (currentIndex === -1) {
      return { success: false, error: `Invalid stage: ${payload.currentStage}` };
    }

    if (currentIndex >= PRODUCTION_STAGE_ORDER.length - 1) {
      return { success: false, error: 'Order is already at final production stage.' };
    }

    const newStage = PRODUCTION_STAGE_ORDER[currentIndex + 1];

    // Production:
    // await supabase.from('orders')
    //   .update({ status: newStage })  // or map stage → OrderStatus
    //   .eq('id', payload.orderId);
    // await supabase.from('production_tasks')
    //   .insert({ order_id: payload.orderId, task_name: newStage, notes: payload.notes, ... });

    console.log('[advanceProductionStage]', { orderId: payload.orderId, newStage });
    return { success: true, data: { newStage } };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

/**
 * Logs a production note against an order or specific task.
 */
export async function logProductionNote(
  payload: LogProductionNotePayload
): Promise<ActionResult> {
  try {
    // Production:
    // await supabase.from('production_tasks').insert({
    //   order_id: payload.orderId,
    //   task_name: 'NOTE',
    //   notes: payload.note,
    //   assigned_to_user_id: payload.loggedByUserId,
    //   status: 'COMPLETED',
    //   completed_at: new Date().toISOString(),
    // });

    console.log('[logProductionNote]', payload);
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

/**
 * Assigns a production task to a staff member.
 */
export async function assignProductionTask(
  payload: AssignProductionTaskPayload
): Promise<ActionResult<{ taskId: string }>> {
  try {
    const taskId = `TASK-${Date.now().toString(36).toUpperCase()}`;

    // Production:
    // const { data } = await supabase.from('production_tasks').insert({
    //   order_id: payload.orderId,
    //   task_name: payload.taskName,
    //   assigned_to_user_id: payload.assignedToUserId,
    //   specialization_id: payload.specializationId,
    //   notes: payload.notes,
    //   status: 'PENDING',
    // }).select('id').single();

    console.log('[assignProductionTask]', { taskId, payload });
    return { success: true, data: { taskId } };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

/**
 * Marks a production task as completed.
 */
export async function completeProductionTask(
  taskId: string,
  completedByUserId: string,
  notes?: string
): Promise<ActionResult> {
  try {
    // Production:
    // await supabase.from('production_tasks')
    //   .update({ status: 'COMPLETED', completed_at: new Date().toISOString(), notes })
    //   .eq('id', taskId);

    console.log('[completeProductionTask]', { taskId, completedByUserId, notes });
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}
