"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchUserByStdId } from "@/services/fetchUserById";
import { updateUserByStdId } from "@/services/updateUserByStdId";

export default function EditUserPage() {
  const { userId } = useParams();
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data, error } = await fetchUserByStdId(userId as string);
      if (data) setForm(data);
      else setMessage(error || "User not found");
      setLoading(false);
    }
    load();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const { error } = await updateUserByStdId(userId as string, form);
    if (error) {
      setMessage(error);
    } else {
      window.location.href = `/ticket/${form.group}`;
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
    if (message === "No user found or error fetching data.") {
      // Redirect to no-user-found page
      if (typeof window !== "undefined") {
        window.location.href = "/no-user-found";
      }
      return null;
    }
    return <div className="p-8 text-red-500">{message}</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-blue-100 to-blue-200 p-4">
      <div className="bg-white shadow-xl rounded-lg w-full max-w-3xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#1a3a9a]">
          Edit Your Information
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
            />

            {/* Nickname */}
            <InputField
              label="Nickname (ชื่อเล่น)"
              name="nickname"
              value={form?.nickname ?? ""}
              onChange={handleChange}
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
                    SI: "แพทยศาสตร์ศิริราชพยาบาล",
                    SC: "วิทยาศาสตร์",
                    RA: "แพทยศาสตร์โรงพยาบาลรามาฯ",
                    DT: "คณะทันตแพทยศาสตร์",
                    MT: "เทคนิคการแพทย์",
                    PH: "สาธารณสุขศาสตร์",
                    NS: "พยาบาลศาสตร์",
                    PT: "กายภาพบำบัด",
                    NR: "โรงเรียนพยาบาลรามาธิบดี คณะแพทยศาสตร์โรงพยาบาลรามาธิบดี",
                    EG: "วิศวกรรมศาสตร์",
                    EN: "สิ่งแวดล้อมและทรัพยากรศาสตร์",
                    KA: "วิทยาเขตกาญจนบุรี",
                    VS: "สัตวแพทยศาสตร์",
                    PI: "หลักสูตรแพทยศาสตร์บัณฑิต โครงการผลิตแพทย์เพื่อชาวชนบท",
                    OT: "สาขาวิชากิจกรรมบำบัด คณะกายภาพบำบัด",
                    NA: "โครงการจัดตั้งวิทยาเขตนครสวรรค์",
                    AM: "โครงการจัดตั้งวิทยาเขตอำนาจเจริญ",
                    LA: "ศิลปศาสตร์",
                    CRS: "วิทยาลัยศาสนศึกษา",
                    IC: "วิทยาลัยนานาชาติ",
                    ICT: "เทคโนโลยีสารสนเทศและการสื่อสาร",
                    PO: "โรงเรียนกายอุปกรณ์สิรินธร คณะแพทยศาสตร์ศิริราชพยาบาล",
                    SS: "วิทยาลัยวิทยาศาสตร์และเทคโนโลยีการกีฬา",
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
                  SI: "แพทยศาสตร์ศิริราชพยาบาล",
                  SC: "วิทยาศาสตร์",
                  RA: "แพทยศาสตร์โรงพยาบาลรามาฯ",
                  DT: "คณะทันตแพทยศาสตร์",
                  MT: "เทคนิคการแพทย์",
                  PH: "สาธารณสุขศาสตร์",
                  NS: "พยาบาลศาสตร์",
                  PT: "กายภาพบำบัด",
                  NR: "โรงเรียนพยาบาลรามาธิบดี คณะแพทยศาสตร์โรงพยาบาลรามาธิบดี",
                  EG: "วิศวกรรมศาสตร์",
                  EN: "สิ่งแวดล้อมและทรัพยากรศาสตร์",
                  KA: "วิทยาเขตกาญจนบุรี",
                  VS: "สัตวแพทยศาสตร์",
                  PI: "แพทย์ชนบท",
                  OT: "กิจกรรมบำบัด",
                  NA: "วิทยาเขตนครสวรรค์",
                  AM: "วิทยาเขตอำนาจเจริญ",
                  LA: "ศิลปศาสตร์",
                  CRS: "ศาสนศึกษา",
                  IC: "นานาชาติ",
                  ICT: "ไอทีและสื่อสาร",
                  PO: "กายอุปกรณ์สิรินธร",
                  SS: "วิทยาศาสตร์การกีฬา",
                }).map(([code, label]) => (
                  <option key={code} value={code}>
                    {code} : {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Additional Fields */}
            <InputField
              label="Food (อาหารที่ไม่ทาน)"
              name="reqfood"
              value={form?.reqfood ?? ""}
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
            />
          </div>

          <div className="flex justify-center">
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
    </div>
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
