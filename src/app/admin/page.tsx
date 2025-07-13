"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to reports page by default
    router.push("/admin/reports");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
