import { supabase } from "@/utils/supabase/client";

/**
 * Interface representing a user report
 */
export interface UserReport {
  id: number;
  stdId: string;
  email: string;
  report_type: "uid" | "email";
  reportMessage: string;
  status: "pending" | "resolved" | "rejected";
  created_at: string;
  updated_at: string;
  resolution_notes?: string;
}

/**
 * Fetch all user reports with optional filtering
 * @param status Optional status filter
 * @returns Object containing reports data and any error
 */
export async function fetchUserReports(
  status?: "pending" | "resolved" | "rejected",
) {
  try {
    let query = supabase
      .from("user_reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching reports:", error);
      return {
        data: null,
        error: "Failed to fetch reports. Please try again.",
      };
    }

    return {
      data: data as UserReport[],
      error: null,
    };
  } catch (err) {
    console.error("Exception in fetchUserReports:", err);
    return {
      data: null,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}

/**
 * Fetch a single user report by ID
 * @param reportId The ID of the report to fetch
 * @returns Object containing the report data and any error
 */
export async function fetchUserReportById(reportId: number) {
  try {
    const { data, error } = await supabase
      .from("user_reports")
      .select("*")
      .eq("id", reportId)
      .single();

    if (error) {
      console.error("Error fetching report:", error);
      return {
        data: null,
        error: "Failed to fetch report. Please try again.",
      };
    }

    return {
      data: data as UserReport,
      error: null,
    };
  } catch (err) {
    console.error("Exception in fetchUserReportById:", err);
    return {
      data: null,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}

/**
 * Update a user report's status and resolution notes
 * @param reportId The ID of the report to update
 * @param status The new status for the report
 * @param resolutionNotes Optional notes about how the issue was resolved
 * @returns Object containing success status and any error
 */
export async function updateUserReportStatus(
  reportId: number,
  status: "pending" | "resolved" | "rejected",
  resolutionNotes?: string,
) {
  try {
    const { error } = await supabase
      .from("user_reports")
      .update({
        status,
        resolution_notes: resolutionNotes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", reportId);

    if (error) {
      console.error("Error updating report:", error);
      return {
        success: false,
        error: "Failed to update report. Please try again.",
      };
    }

    return {
      success: true,
      error: null,
    };
  } catch (err) {
    console.error("Exception in updateUserReportStatus:", err);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}
