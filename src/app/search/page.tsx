"use client";
import { fetchUserByStdEmail } from "@/services/fetchUserByEmail";
import { fetchUserByStdId } from "@/services/fetchUserByStdId";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      setError(null);

      const searchType = searchParams.get("type");
      const searchValue = searchParams.get("value");

      if (!searchType || !searchValue) {
        setError("Missing search parameters");
        setLoading(false);
        return;
      }

      try {
        let result;

        if (searchType === "email") {
          result = await fetchUserByStdEmail(searchValue);
        } else if (searchType === "stdId") {
          result = await fetchUserByStdId(searchValue);
        } else {
          setError("Invalid search type");
          setLoading(false);
          return;
        }

        if (result.error) {
          setError(result.error);
          setLoading(false);
          return;
        }

        if (result.data && Object.keys(result.data).length > 0) {
          // If user found, redirect to their page
          if (searchType === "email") {
            // Use existing route structure for email searches
            router.push(`/${encodeURIComponent(searchValue.toLowerCase())}`);
          } else {
            // For stdId searches, we'll redirect to the email route with stdId as a query parameter
            // This allows the email page to know this was a stdId search
            const email = result.data.email;
            if (email) {
              router.push(
                `/${encodeURIComponent(email.toLowerCase())}?stdId=${encodeURIComponent(searchValue)}`,
              );
            } else {
              setError("User found but email is missing");
              setLoading(false);
            }
          }
        } else {
          // Pass the search type to no-user-found page
          router.push(`/no-user-found?type=${searchType}`);
        }
      } catch (err) {
        setError("An unexpected error occurred");
        setLoading(false);
      }
    }

    fetchUser();
  }, [searchParams, router]);

  if (loading && !notFound) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-[#e2f3ff] to-[#c2e0f7] text-black">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg font-medium animate-pulse">
            Searching...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-[#e2f3ff] to-[#c2e0f7] text-black p-4">
        <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="w-full bg-[#1a3a9a] text-white font-semibold py-3 rounded-lg hover:bg-[#16317d] transition-all duration-200"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // This should not be visible as we redirect in the useEffect
  return null;
}
