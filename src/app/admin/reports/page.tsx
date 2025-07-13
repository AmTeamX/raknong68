"use client";
import {
  fetchUserReports,
  updateUserReportStatus,
  UserReport,
} from "@/services/fetchUserReports";
import { useEffect, useState } from "react";

export default function AdminReportsPage() {
  const [reports, setReports] = useState<UserReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<UserReport | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [filter, setFilter] = useState<
    "all" | "pending" | "resolved" | "rejected"
  >("pending");

  useEffect(() => {
    fetchReports();
  }, [filter]);

  async function fetchReports() {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await fetchUserReports(
        filter !== "all" ? filter : undefined,
      );

      if (error) {
        throw new Error(error);
      }

      setReports(data || []);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError("Failed to load reports. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function updateReportStatus(
    reportId: number,
    status: "resolved" | "rejected",
  ) {
    try {
      const { success, error } = await updateUserReportStatus(
        reportId,
        status,
        resolutionNotes,
      );

      if (!success) {
        throw new Error(error || "Failed to update report");
      }

      // Refresh reports list
      fetchReports();
      setSelectedReport(null);
      setResolutionNotes("");
    } catch (err) {
      console.error("Error updating report:", err);
      setError("Failed to update report. Please try again.");
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString();
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1a3a9a] mb-8">
          User Reports Admin
        </h1>

        {/* Filter controls */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg ${
              filter === "all"
                ? "bg-[#1a3a9a] text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            All Reports
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-lg ${
              filter === "pending"
                ? "bg-[#1a3a9a] text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter("resolved")}
            className={`px-4 py-2 rounded-lg ${
              filter === "resolved"
                ? "bg-[#1a3a9a] text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Resolved
          </button>
          <button
            onClick={() => setFilter("rejected")}
            className={`px-4 py-2 rounded-lg ${
              filter === "rejected"
                ? "bg-[#1a3a9a] text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Rejected
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : reports.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 text-lg">No reports found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 text-black">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                  >
                    Student ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                  >
                    Created
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                      {report.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {report.stdId || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {report.email || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          report.report_type === "uid"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {report.report_type === "uid" ? "Student ID" : "Email"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          report.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : report.status === "resolved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {report.status.charAt(0).toUpperCase() +
                          report.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {formatDate(report.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Report Detail Modal */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-[#1a3a9a]">
                  Report #{selectedReport.id}
                </h2>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-black">
                <div>
                  <p className="text-sm text-black">Student ID</p>
                  <p className="font-medium">{selectedReport.stdId || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-black">Email</p>
                  <p className="font-medium">{selectedReport.email || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-black">Report Type</p>
                  <p className="font-medium">
                    {selectedReport.report_type === "uid"
                      ? "Student ID Issue"
                      : "Email Issue"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-black">Status</p>
                  <p
                    className={`font-medium ${
                      selectedReport.status === "pending"
                        ? "text-yellow-600"
                        : selectedReport.status === "resolved"
                          ? "text-green-600"
                          : "text-red-600"
                    }`}
                  >
                    {selectedReport.status.charAt(0).toUpperCase() +
                      selectedReport.status.slice(1)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-black">Created</p>
                  <p className="font-medium">
                    {formatDate(selectedReport.created_at)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-black">Last Updated</p>
                  <p className="font-medium">
                    {formatDate(selectedReport.updated_at)}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-black mb-1">User Message</p>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="whitespace-pre-wrap text-black">
                    {selectedReport.reportMessage}
                  </p>
                </div>
              </div>

              {selectedReport.status !== "pending" &&
                selectedReport.resolution_notes && (
                  <div className="mb-6">
                    <p className="text-sm text-black mb-1">Resolution Notes</p>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="whitespace-pre-wrap text-black">
                        {selectedReport.resolution_notes}
                      </p>
                    </div>
                  </div>
                )}

              {selectedReport.status === "pending" && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Resolution Notes
                  </label>
                  <textarea
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    className="text-black w-full border border-gray-300 rounded-lg p-3 h-32 focus:outline-none focus:ring-2 focus:ring-[#1a3a9a]"
                    placeholder="Enter notes about how you resolved this issue..."
                  ></textarea>
                </div>
              )}

              {selectedReport.status === "pending" && (
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() =>
                      updateReportStatus(selectedReport.id, "rejected")
                    }
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() =>
                      updateReportStatus(selectedReport.id, "resolved")
                    }
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg "
                  >
                    Mark as Resolved
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
