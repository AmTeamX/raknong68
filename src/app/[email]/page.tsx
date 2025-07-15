"use client";
import { fetchUserByStdEmail } from "@/services/fetchUserByEmail";
import { fetchUserByStdId } from "@/services/fetchUserByStdId";
import { submitUserReport } from "@/services/submitUserReport";
import { updateUserByStdId } from "@/services/updateUserByStdId";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditUserPage() {
  const { email } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportMessage, setReportMessage] = useState("");
  const [reportType, setReportType] = useState<"uid" | "email" | "name">("uid");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);

      // Check if we're coming from a stdId search
      const stdId = searchParams.get("stdId");

      if (stdId) {
        // If we have a stdId parameter, fetch by stdId
        const { data, error } = await fetchUserByStdId(stdId);
        if (data) setForm(data);
        else {
          setMessage(error || "User not found");
          router.push(`/no-user-found?type=stdId`);
        }
      } else {
        // Otherwise, fetch by email as before
        const decodedEmail = decodeURIComponent(email as string); // ✅ decode it here
        const { data, error } = await fetchUserByStdEmail(decodedEmail);
        if (data) setForm(data);
        else {
          setMessage(error || "User not found");
          router.push(`/no-user-found?type=email`);
        }
      }

      setLoading(false);
    }
    load();
  }, [email, searchParams, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const decodedEmail = decodeURIComponent(email as string); // ✅ decode it here
    const { error } = await updateUserByStdId(decodedEmail, form);
    if (error) {
      setMessage(error);
    } else {
      window.location.href = `/ticket/${form.group}`;
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reportMessage.trim() && !isSubmitting) {
      setIsSubmitting(true);

      try {
        const { success, error } = await submitUserReport({
          std_id: form?.stdId,
          email: form?.email,
          report_type: reportType,
          report_message: reportMessage.trim(),
        });

        if (success) {
          setSubmitted(true);
          // Close the modal after a delay
          setTimeout(() => {
            setShowReportModal(false);
            setReportMessage("");
            setSubmitted(false);
          }, 3000);
        } else {
          setMessage(error || "Failed to submit report. Please try again.");
        }
      } catch (err) {
        console.error("Error submitting report:", err);
        setMessage("An unexpected error occurred. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-[#e2f3ff] to-[#c2e0f7] text-black">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg font-medium animate-pulse">Loading...</span>
        </div>
      </div>
    );
  if (!form) {
    // Error message will be displayed while redirecting
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-[#e2f3ff] to-[#c2e0f7] p-4">
        <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700">Redirecting to error page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-blue-100 to-blue-200 p-4">
      <div className="bg-white shadow-xl rounded-lg w-full max-w-3xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#1a3a9a]">
          Please Check And Edit Your Information
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Student ID */}
            <InputField
              label="student ID (เลขประจำตัวนักศึกษา)"
              name="stdId"
              value={form?.stdId ?? ""}
              onChange={handleChange}
              disabled
            />

            {/* Name */}
            <InputField
              label="Name (ชื่อ-นามสกุล)"
              name="name"
              value={form?.name ?? ""}
              onChange={handleChange}
              disabled

            />

            {/* Nickname */}
            <InputField
              label="Nickname (ชื่อเล่น)"
              name="nickname"
              value={form?.nickname ?? ""}
              onChange={handleChange}
              disabled
            />

            {/* Faculty */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Faculty (คณะ)
              </label>
              <select
                name="faculty"
                value={form?.faculty ? form.faculty.split(" : ")[0] : ""}
                onChange={(e) => {
                  const selected = e.target.value;
                  const labelMap: Record<string, string> = {
                    AM: "โครงการจัดตั้งวิทยาเขตอำนาจเจริญ",
                    CRS: "วิทยาลัยศาสนศึกษา",
                    DT: "คณะทันตแพทยศาสตร์",
                    EG: "คณะวิศวกรรมศาสตร์",
                    EN: "คณะสิ่งแวดล้อมและทรัพยากรศาสตร์",
                    IC: "วิทยาลัยนานาชาติ",
                    ICT: "คณะเทคโนโลยีสารสนเทศและการสื่อสาร",
                    KA: "วิทยาเขตกาญจนบุรี",
                    LA: "คณะศิลปศาสตร์",
                    MS: "วิทยาลัยดุริยางคศิลป์",
                    MT: "คณะเทคนิคการแพทย์",
                    NS: "คณะพยาบาลศาสตร์",
                    NW: "โครงการจัดตั้งวิทยาเขตนครสวรรค์",
                    PH: "คณะสาธารณสุขศาสตร์",
                    PT: "คณะกายภาพบำบัด",
                    PY: "คณะเภสัชศาสตร์",
                    RA: "คณะแพทยศาสตร์โรงพยาบาลรามาธิบดี",
                    SC: "คณะวิทยาศาสตร์",
                    SH: "คณะสังคมศาสตร์และมนุษยศาสตร์",
                    SI: "คณะแพทยศาสตร์ศิริราชพยาบาล",
                    SS: "วิทยาลัยวิทยาศาสตร์และเทคโนโลยีการกีฬา",
                    VS: "คณะสัตวแพทยศาสตร์",
                    PI: "คณะแพทยศาสตร์ สถาบันพระบรมราชชนก",
                    Other: "Other",
                  };
                  setForm({
                    ...form,
                    faculty: selected
                      ? `${selected} : ${labelMap[selected]}`
                      : "",
                  });
                }}
                className="text-black border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">-- เลือกคณะ --</option>
                {Object.entries({
                  AM: "โครงการจัดตั้งวิทยาเขตอำนาจเจริญ",
                  CRS: "วิทยาลัยศาสนศึกษา",
                  DT: "คณะทันตแพทยศาสตร์",
                  EG: "คณะวิศวกรรมศาสตร์",
                  EN: "คณะสิ่งแวดล้อมและทรัพยากรศาสตร์",
                  IC: "วิทยาลัยนานาชาติ",
                  ICT: "คณะเทคโนโลยีสารสนเทศและการสื่อสาร",
                  KA: "วิทยาเขตกาญจนบุรี",
                  LA: "คณะศิลปศาสตร์",
                  MS: "วิทยาลัยดุริยางคศิลป์",
                  MT: "คณะเทคนิคการแพทย์",
                  NS: "คณะพยาบาลศาสตร์",
                  NW: "โครงการจัดตั้งวิทยาเขตนครสวรรค์",
                  PH: "คณะสาธารณสุขศาสตร์",
                  PT: "คณะกายภาพบำบัด",
                  PY: "คณะเภสัชศาสตร์",
                  RA: "คณะแพทยศาสตร์โรงพยาบาลรามาธิบดี",
                  SC: "คณะวิทยาศาสตร์",
                  SH: "คณะสังคมศาสตร์และมนุษยศาสตร์",
                  SI: "คณะแพทยศาสตร์ศิริราชพยาบาล",
                  SS: "วิทยาลัยวิทยาศาสตร์และเทคโนโลยีการกีฬา",
                  VS: "คณะสัตวแพทยศาสตร์",
                  PI: "คณะแพทยศาสตร์ สถาบันพระบรมราชชนก",
                  Other: "Other",
                }).map(([code, label]) => (
                  <option key={code} value={code}>
                    {code} : {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Additional Fields */}
            <InputField
              label="Dietary restrictions (ข้อจำกัดด้านอาหาร เช่น ฮาลาล, มังสวิรัติ)"
              name="diereq"
              value={form?.diereq ?? ""}
              onChange={handleChange}
            />
            <InputField
              label="Disease (โรคประจำตัว)"
              name="ph"
              value={form?.ph ?? ""}
              onChange={handleChange}
            />
            <InputField
              label="Food allergy (อาหารที่แพ้)"
              name="foodalg"
              value={form?.foodalg ?? ""}
              onChange={handleChange}
            />
            <InputField
              label="Email (อีเมล)"
              name="email"
              value={form?.email ?? ""}
              onChange={handleChange}
              disabled
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 text-black">
            <button
              type="button"
              onClick={() => setShowReportModal(true)}
              className="bg-amber-500 hover:bg-amber-600 transition-colors duration-200 text-white font-semibold px-6 py-3 rounded-lg shadow-md"
            >
              Report Problem
            </button>
            <button
              type="submit"
              className="bg-[#1a3a9a] hover:bg-blue-800 transition-colors duration-200 text-white font-semibold px-6 py-3 rounded-lg shadow-md"
            >
              Confirm & Save
            </button>
          </div>
          {message && (
            <div className="text-center text-red-500 mt-2">{message}</div>
          )}
        </form>
      </div>

      {/* Report Problem Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-[#1a3a9a] mb-4">
              Report a Problem
            </h2>

            {submitted ? (
              <div className="text-center py-6">
                <div className="text-green-600 text-5xl mb-4">✓</div>
                <p className="text-lg font-medium text-black">
                  Thank you for your report!
                </p>
                <p className="text-gray-600">
                  We'll review your report and fix your information as soon as
                  possible.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit}>
                <p className="text-gray-700 mb-4">
                  Please tell us what needs to be fixed:
                </p>

                <div className="mb-4 text-black">
                  <div className="flex gap-4 mb-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={reportType === "uid"}
                        onChange={() => setReportType("uid")}
                        className="mr-2"
                      />
                      Student ID issue
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={reportType === "email"}
                        onChange={() => setReportType("email")}
                        className="mr-2"
                      />
                      Email issue
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={reportType === "name"}
                        onChange={() => setReportType("name")}
                        className="mr-2"
                      />
                      Name issue
                    </label>
                  </div>

                  <textarea
                    value={reportMessage}
                    onChange={(e) => setReportMessage(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 h-32 focus:outline-none focus:ring-2 focus:ring-[#1a3a9a]"
                    placeholder={
                      ` Describe the issue with your ${reportType}...`
                    }
                    required
                    disabled={isSubmitting}
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#1a3a9a] hover:bg-blue-800 text-white rounded-lg transition-colors duration-200 flex items-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                        Submitting...
                      </>
                    ) : (
                      "Submit Report"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )
      }
    </div >
  );
}

// Reusable input field component
function InputField({
  label,
  name,
  value,
  onChange,
  disabled = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="text-black border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
      />
    </div>
  );
}
