"use client";

export default function NoUserFound() {
  return (
    <div className=" bg-gradient-to-b from-[#e2f3ff] to-[#c2e0f7] flex flex-col items-center justify-center min-h-screen  px-4">
      <div className="bg-white shadow-xl rounded-lg p-10 max-w-xl w-full text-center">
        <h1 className="text-4xl font-extrabold text-red-600 mb-4">
          ไม่พบข้อมูลผู้ใช้
        </h1>
        <p className="text-gray-700 text-lg mb-8">
          ไม่พบข้อมูลสำหรับรหัสนักศึกษาที่คุณกรอก หรือเกิดข้อผิดพลาดในการค้นหา
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="/"
            className="bg-blue-600 hover:bg-blue-700 transition text-white font-semibold px-6 py-3 rounded-md shadow"
          >
            🔙 กลับไปหน้าหลัก
          </a>
          <a
            href="https://www.instagram.com/smo.mahidol/"
            className="bg-gray-600 hover:bg-gray-700 transition text-white font-semibold px-6 py-3 rounded-md shadow"
          >
            📩 ติดต่อเรา
          </a>
        </div>
      </div>
    </div>
  );
}
