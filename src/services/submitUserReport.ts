import { supabase } from "@/utils/supabase/client";

export interface UserReportData {
  user_id?: string;
  std_id?: string;
  email?: string;
  report_type: "uid" | "email" | "name";
  report_message: string;
  status?: "pending" | "resolved" | "rejected";
}

/**
 * Submit a user report to the database
 * @param reportData The report data to submit
 * @returns Object containing success status and any error message
 */
export async function submitUserReport(reportData: UserReportData) {
  try {
    // Add default values and ensure column names match the database
    const dataToInsert = {
      ...reportData,
      status: "pending",
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("user_reports")
      .insert(dataToInsert)
      .select();

    if (error) {
      console.error("Error submitting report:", error);
      return {
        success: false,
        error: "Failed to submit report. Please try again later.",
      };
    }

    return {
      success: true,
      data,
    };
  } catch (err) {
    console.error("Exception in submitUserReport:", err);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}
