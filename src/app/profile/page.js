
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const STATUS_COLORS = {
  Pending: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40",
  Confirmed: "bg-green-500/20 text-green-400 border border-green-500/40",
  Seated: "bg-blue-500/20 text-blue-400 border border-blue-500/40",
  Cancelled: "bg-red-500/20 text-red-400 border border-red-500/40",
  "No-Show": "bg-gray-500/20 text-gray-400 border border-gray-500/40",
};

export default function ProfilePage() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setUserName(user?.name || "");
    } catch (e) {}

    async function fetchMyBookings() {
      try {
        const res = await fetch('${process.env.NEXT_PUBLIC_API_URL}/api/reservations/my', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Unable to load your bookings");
        }

        setBookings(data.data || []);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchMyBookings();
  }, [router]);

  return (
    <main className="min-h-screen bg-[#0D0D0D] px-6 py-16 md:px-16">
      <h1
        className="text-4xl text-center text-white mb-2"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        My Bookings
      </h1>
      <p className="text-center text-gray-400 mb-10">
        {userName ? `Welcome back, ${userName}` : "Track your reservations at The Brijwasi"}
      </p>

      <div className="max-w-3xl mx-auto">
        {isLoading && (
          <p className="text-center text-gray-400">Loading your bookings...</p>
        )}

        {error && (
          <p className="text-center text-red-500 bg-red-500/10 border border-red-500/30 rounded-md py-2 px-4">
            {error}
          </p>
        )}

        {!isLoading && !error && bookings.length === 0 && (
          <div className="text-center bg-[#1A1A1A] border border-gray-800 rounded-xl py-10 px-6">
            <p className="text-gray-400 mb-4">
              You haven&apos;t made any bookings yet.
            </p>
             <a
              href="/reservation"
              className="inline-block bg-[#FF7A00] text-black font-semibold px-6 py-2.5 rounded-md hover:bg-[#FF9640] transition-colors"
            >
              Reserve a Table
            </a>
          </div>
        )}

        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-[#1A1A1A] border border-gray-800 rounded-xl p-5 flex justify-between items-center flex-wrap gap-3"
            >
              <div>
                <p className="text-[#FF7A00] font-semibold mb-1">
                  {booking.bookingId}
                </p>
                <p className="text-gray-300 text-sm">
                  {booking.date} · {booking.timeSlot} · {booking.guestCount} guests
                </p>
              </div>
              <span
                className={`text-xs px-3 py-1 rounded-full ${STATUS_COLORS[booking.status] || "bg-gray-500/20 text-gray-400"}`}
              >
                {booking.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}