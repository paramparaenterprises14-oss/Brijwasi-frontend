"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (!data.data || !data.data.token) {
        throw new Error("Login failed. Please try again.");
      }

      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));

      router.push("/");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md bg-[#1A1A1A] border border-gray-800 rounded-xl p-8">
        <h1
          className="text-3xl text-center text-white mb-2"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Welcome Back
        </h1>
        <p className="text-center text-gray-400 text-sm mb-8">
          Log in to manage your bookings at The Brijwasi
        </p>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4 bg-red-500/10 border border-red-500/30 rounded-md py-2 px-3">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-300 text-sm mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full bg-[#0D0D0D] border border-gray-700 rounded-md px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#FF7A00] transition-colors"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="w-full bg-[#0D0D0D] border border-gray-700 rounded-md px-4 py-2.5 pr-12 text-white placeholder-gray-600 focus:outline-none focus:border-[#FF7A00] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FF7A00] text-sm"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#FF7A00] text-black font-semibold py-2.5 rounded-md hover:bg-[#FF9640] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-[#FF7A00] hover:underline">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}