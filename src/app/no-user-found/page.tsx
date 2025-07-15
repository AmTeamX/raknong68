"use client";
import { } from "next/navigation";

import { Suspense } from "react";
export default function NoUserFound() {


  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="bg-gradient-to-b from-[#e2f3ff] to-[#c2e0f7] flex flex-col items-center justify-center min-h-screen px-4">
        <div className="bg-white shadow-xl rounded-lg p-10 max-w-xl w-full text-center">
          <h1 className="text-4xl font-extrabold text-red-600 mb-4">
            ไม่พบข้อมูลผู้ใช้
          </h1>
          <p className="text-gray-700 text-lg mb-8">
            ไม่พบข้อมูลสำหรับคุณ
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4">
            <a
              href="/"
              className="bg-blue-600 hover:bg-blue-700 transition text-white font-semibold px-6 py-3 rounded-md shadow"
            >
              🔙 กลับไปหน้าหลัก
            </a>

            {/* <a
              href="https://docs.google.com/forms/d/e/1FAIpQLScfLpap0vnHT3Z8okDq4WDXD0HswgcEnK22eY4Nyc-v2jh6xA/viewform?usp=dialog"
              className="bg-green-600 hover:bg-green-700 transition text-white font-semibold px-6 py-3 rounded-md shadow"
            >
              📩 มั่นใจว่าลงแล้ว กรอกฟอร์มตกหล่นที่นี่เลย
            </a> */}
          </div>
          <a
            href="https://www.instagram.com/smo.mahidol/"
            className="text-red-500 font-semibold px-6 py-3 rounded-md inline-block mt-4"
          >
            ติดต่อเรา
          </a>
        </div>
      </div>
    </Suspense>

  );
}
