"use client";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // For simplicity, we're using a client-side authentication method
  // In a production application, you should use a more secure method
  const ADMIN_PASSWORD = "raknong2568admin"; // Simple password, replace with a more secure method

  useEffect(() => {
    // Check if already authenticated
    const isAdmin = localStorage.getItem("rk_admin_auth");
    if (isAdmin === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (password === ADMIN_PASSWORD) {
      localStorage.setItem("rk_admin_auth", "true");
      setIsAuthenticated(true);
    } else {
      setError("Invalid password");
    }

    setIsSubmitting(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("rk_admin_auth");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold text-center text-[#1a3a9a] mb-6">
            Admin Access
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a3a9a]"
                required
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1a3a9a] text-white py-2 px-4 rounded-md hover:bg-[#16317d] focus:outline-none focus:ring-2 focus:ring-[#1a3a9a] focus:ring-offset-2 transition-colors"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-[#1a3a9a] text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Raknong Admin</h1>
          <div className="flex items-center gap-4">
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <a
                    href="/admin/reports"
                    className={`hover:text-blue-200 ${
                      pathname.includes("/admin/reports")
                        ? "font-bold underline"
                        : ""
                    }`}
                  >
                    Reports
                  </a>
                </li>
                {/* Add more admin navigation items here */}
              </ul>
            </nav>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
