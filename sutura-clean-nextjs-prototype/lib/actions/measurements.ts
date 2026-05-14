'use server';

/**
 * SUTURA — Measurement Server Actions
 */

export interface MeasurementProfilePayload {
  customerId: string;
  branchId: string;
  recordedByUserId: string;
  profileName: string;
  garmentCategory: 'Upper Wear' | 'Lower Wear' | 'Full Body';
  garmentType: string;
  fitPreference: 'Slim' | 'Regular' | 'Loose' | 'Oversized';
  measurementUnit: 'Inches' | 'Centimeters';
  // Upper body
  neck?: number;
  shoulder?: number;
  chest?: number;
  bust?: number;
  waist?: number;
  hip?: number;
  sleeveLength?: number;
  jacketLength?: number;
  // Lower body
  pantsWaist?: number;
  pantsHip?: number;
  inseam?: number;
  outseam?: number;
  thigh?: number;
  hem?: number;
  // Notes
  postureNotes?: string;
  specialInstructions?: string;
}

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Saves a new measurement profile for a customer.
 * Creates a new version if a previous profile exists for the same garment type.
 */
export async function saveMeasurementProfile(
  payload: MeasurementProfilePayload
): Promise<ActionResult<{ profileId: string }>> {
  try {
    const profileId = `MEAS-${Date.now().toString(36).toUpperCase()}`;

    // Production:
    // const { data, error } = await supabase
    //   .from('customer_measurements')
    //   .insert({
    //     customer_id: payload.customerId,
    //     branch_id: payload.branchId,
    //     recorded_by_user_id: payload.recordedByUserId,
    //     garment_category: payload.garmentCategory,
    //     ...
    //   })
    //   .select('id').single();
    // Then insert MeasurementValues for each field.

    console.log('[saveMeasurementProfile]', { profileId, payload });
    return { success: true, data: { profileId } };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

/**
 * Links an existing measurement profile to an order.
 */
export async function linkMeasurementToOrder(
  orderId: string,
  measurementProfileId: string
): Promise<ActionResult> {
  try {
    // Production:
    // await supabase.from('orders')
    //   .update({ measurement_profile_id: measurementProfileId })
    //   .eq('id', orderId);

    console.log('[linkMeasurementToOrder]', { orderId, measurementProfileId });
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

/**
 * Archives an old measurement profile (marks isCurrent = false).
 * Called when a newer version replaces an old one.
 */
export async function archiveMeasurementProfile(
  profileId: string
): Promise<ActionResult> {
  try {
    // Production:
    // await supabase.from('customer_measurements')
    //   .update({ is_current: false, status: 'ARCHIVED' })
    //   .eq('id', profileId);

    console.log('[archiveMeasurementProfile]', { profileId });
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}
