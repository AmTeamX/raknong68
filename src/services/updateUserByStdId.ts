import { supabase } from "@/utils/supabase/client";

/**
 * Update user fields by stdId.
 * @param stdId - The student ID to match.
 * @param updates - An object with the fields to update, e.g. { name: "New Name", faculty: "New Faculty" }
 * @returns { error, data }
 */
export async function updateUserByStdId(
  stdId: string,
  updates: Record<string, any>,
) {
  const { data, error } = await supabase
    .from("group") // Change to "gruop" if that's your actual table name
    .update(updates)
    .eq("stdId", stdId)
    .select()
    .single();

  if (error) {
    return { error: error.message, data: null };
  }
  return { error: null, data };
}
