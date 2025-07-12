"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      // You can encode the email if needed
      router.push(`/${encodeURIComponent(email.trim().toLowerCase())}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-b from-[#e2f3ff] to-[#c2e0f7] py-16 px-4">
      {/* Header Images */}
      <div className="flex items-center gap-8 mb-10">
        <img className="w-28 h-auto" src="./smologo.png" alt="SMO Logo" />
        <img className="w-28 h-auto" src="./rklogo.png" alt="RK Logo" />
      </div>

      {/* Titles */}
      <h1 className="text-5xl font-extrabold text-center text-[#1a3a9a] mb-4 drop-shadow-sm">
        Welcome, Freshy!
      </h1>
      <h2 className="text-2xl font-medium text-center text-[#1a3a9a] mb-8">
        Enter your email to receive your ticket for Raknong 2568
      </h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl px-8 py-10 w-full max-w-md flex flex-col items-center gap-6"
      >
        <input
          type="email"
          placeholder="Enter Your Email Ex : example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="text-black w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-[#1a3a9a]"
          required
        />
        <button
          type="submit"
          className="w-full bg-[#1a3a9a] text-white font-semibold py-3 rounded-lg hover:bg-[#16317d] transition-all duration-200"
        >
          Get My Ticket
        </button>
      </form>
    </div>
  );
}
