import { supabase } from "@/utils/supabase/client";

/**
 * Update user fields by stdId.
 * @param stdId - The student ID to match.
 * @param updates - An object with the fields to update, e.g. { name: "New Name", faculty: "New Faculty" }
 * @returns { error, data }
 */
export async function updateUserByStdId(
  email: string,
  updates: Record<string, any>,
) {
  const cleanedEmail = email.trim().toLowerCase();

  const { data, error } = await supabase
    .from("group")
    .update(updates)
    .ilike("email", cleanedEmail)
    .select()

  if (!data || data.length === 0) {
    console.log("User not found");
  }

  if (error) {
    return { error: error.message, data: null };
  }
  return { error: null, data };
}
