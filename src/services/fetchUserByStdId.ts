import { supabase } from "@/utils/supabase/client";

export async function fetchUserByStdId(stdId: string) {
  const { data, error } = await supabase
    .from("rk_group")
    .select("*")
    .eq("stdId", stdId)
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
