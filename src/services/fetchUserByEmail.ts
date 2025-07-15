import { supabase } from "@/utils/supabase/client";

export async function fetchUserByStdEmail(email: string) {
  const { data, error } = await supabase
    .from("rk_group") // or "gruop" if that's your actual table name
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    return { error: "No user found or error fetching data.", data: null };
  }

  if (data && "No." in data) {
    const { id, ...rest } = data;
    return { error: null, data: rest };
  }

  return { error: null, data };
}
