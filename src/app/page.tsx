"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [searchValue, setSearchValue] = useState("");
  const [searchType, setSearchType] = useState<"email" | "stdId">("email");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim() && !isSubmitting) {
      setIsSubmitting(true);
      // Create a query parameter with the type and value
      const searchParam = new URLSearchParams();
      searchParam.append("type", searchType);
      searchParam.append("value", searchValue.trim());

      if (searchType === "email") {
        // Maintain backward compatibility
        router.push(`/${encodeURIComponent(searchValue.trim().toLowerCase())}`);
      } else {
        // For student ID search
        router.push(`/search?${searchParam.toString()}`);
      }
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
        {/* Search Type Toggle */}
        <div className="flex w-full mb-2">
          <button
            type="button"
            onClick={() => setSearchType("email")}
            className={`flex-1 py-2 text-center rounded-l-lg transition-all duration-200 ${
              searchType === "email"
                ? "bg-[#1a3a9a] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            disabled={isSubmitting}
          >
            Search by Email
          </button>
          <button
            type="button"
            onClick={() => setSearchType("stdId")}
            className={`flex-1 py-2 text-center rounded-r-lg transition-all duration-200 ${
              searchType === "stdId"
                ? "bg-[#1a3a9a] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            disabled={isSubmitting}
          >
            Search by Student ID
          </button>
        </div>

        <input
          type="text"
          placeholder={
            searchType === "email"
              ? "Enter Your Email Ex: example@email.com"
              : "Enter Your Student ID Ex: 65XXXXXXXX"
          }
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="text-black w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-[#1a3a9a]"
          required
          disabled={isSubmitting}
        />
        <button
          type="submit"
          className={`w-full ${
            isSubmitting
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-[#1a3a9a] hover:bg-[#16317d]"
          } text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              Searching...
            </>
          ) : (
            "Get My Ticket"
          )}
        </button>
      </form>
    </div>
  );
}
