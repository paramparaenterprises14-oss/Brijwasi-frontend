
"use client";

import { useState, useEffect } from "react";

const TIME_SLOTS = [
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
];

export default function ReservationPage() {
  const [step, setStep] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [formData, setFormData] = useState({
    date: "",
    timeSlot: "",
    guestCount: "",
    customerName: "",
    email: "",
    phone: "",
  });

  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availabilityError, setAvailabilityError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [bookingResult, setBookingResult] = useState(null);

  // Auto-fill name & email if the user is logged in
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        setIsLoggedIn(true);
        setFormData((prev) => ({
          ...prev,
          customerName: user.name || "",
          email: user.email || "",
        }));
      }
    } catch (e) {
      // no logged-in user, guest booking continues normally
    }
  }, []);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleCheckAvailability(e) {
    e.preventDefault();
    setAvailabilityError(null);
    setIsChecking(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reservations/check?date=${formData.date}&time=${encodeURIComponent(
          formData.timeSlot
        )}`
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Unable to check availability");
      }

      if (data.data?.isFullyBooked) {
        setAvailabilityError(
          "This slot is fully booked. Please choose a different date or time."
        );
        return;
      }

      setStep(2);
    } catch (err) {
      setAvailabilityError(
        err.message || "Something went wrong while checking availability."
      );
    } finally {
      setIsChecking(false);
    }
  }

  async function handleSubmitBooking(e) {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          date: formData.date,
          timeSlot: formData.timeSlot,
          guestCount: Number(formData.guestCount),
          customerName: formData.customerName,
          email: formData.email,
          phone: formData.phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Booking failed. Please try again.");
      }

      setBookingResult(data);
      setStep(3);
    } catch (err) {
      setSubmitError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleStartOver() {
    setFormData((prev) => ({
      date: "",
      timeSlot: "",
      guestCount: "",
      customerName: isLoggedIn ? prev.customerName : "",
      email: isLoggedIn ? prev.email : "",
      phone: "",
    }));
    setBookingResult(null);
    setAvailabilityError(null);
    setSubmitError(null);
    setStep(1);
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <main className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg bg-[#1A1A1A] border border-gray-800 rounded-xl p-8">
        <h1
          className="text-3xl text-center text-white mb-2"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Reserve a Table
        </h1>
        <p className="text-center text-gray-400 text-sm mb-8">
          Step {step} of 3
        </p>

        {/* STEP 1 — Date & Time */}
        {step === 1 && (
          <form onSubmit={handleCheckAvailability} className="space-y-5">
            <div>
              <label className="block text-gray-300 text-sm mb-1.5">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={today}
                required
                className="w-full bg-[#0D0D0D] border border-gray-700 rounded-md px-4 py-2.5 text-white focus:outline-none focus:border-[#FF7A00] transition-colors [color-scheme:dark]"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-1.5">
                Time Slot
              </label>
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, timeSlot: slot })
                    }
                    className={`py-2 rounded-md border text-sm transition-colors ${
                      formData.timeSlot === slot
                        ? "bg-[#FF7A00] text-black border-[#FF7A00]"
                        : "bg-transparent text-gray-300 border-gray-700 hover:border-[#FF7A00] hover:text-[#FF7A00]"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {availabilityError && (
              <p className="text-red-500 text-sm text-center bg-red-500/10 border border-red-500/30 rounded-md py-2 px-3">
                {availabilityError}
              </p>
            )}

            <button
              type="submit"
              disabled={isChecking || !formData.date || !formData.timeSlot}
              className="w-full bg-[#FF7A00] text-black font-semibold py-2.5 rounded-md hover:bg-[#FF9640] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isChecking ? "Checking Availability..." : "Check Availability"}
            </button>
          </form>
        )}

        {/* STEP 2 — Guest details */}
        {step === 2 && (
          <form onSubmit={handleSubmitBooking} className="space-y-5">
            <div className="bg-[#0D0D0D] border border-gray-800 rounded-md px-4 py-3 text-sm text-gray-300">
              <p>
                <span className="text-gray-500">Date:</span> {formData.date}
              </p>
              <p>
                <span className="text-gray-500">Time:</span>{" "}
                {formData.timeSlot}
              </p>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-[#FF7A00] text-xs mt-1 hover:underline"
              >
                Change
              </button>
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                required
                placeholder="Enter your name"
                className="w-full bg-[#0D0D0D] border border-gray-700 rounded-md px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#FF7A00] transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-1.5">
                Email Address {isLoggedIn && <span className="text-gray-600">(linked to your account)</span>}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required={isLoggedIn}
                readOnly={isLoggedIn}
                placeholder="you@example.com"
                className={`w-full bg-[#0D0D0D] border border-gray-700 rounded-md px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none transition-colors ${
                  isLoggedIn
                    ? "opacity-60 cursor-not-allowed"
                    : "focus:border-[#FF7A00]"
                }`}
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                pattern="[0-9]{10}"
                placeholder="10-digit mobile number"
                className="w-full bg-[#0D0D0D] border border-gray-700 rounded-md px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#FF7A00] transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-1.5">
                Number of Guests
              </label>
              <input
                type="number"
                name="guestCount"
                value={formData.guestCount}
                onChange={handleChange}
                required
                min={1}
                max={30}
                placeholder="e.g. 4"
                className="w-full bg-[#0D0D0D] border border-gray-700 rounded-md px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#FF7A00] transition-colors"
              />
            </div>

            {submitError && (
              <p className="text-red-500 text-sm text-center bg-red-500/10 border border-red-500/30 rounded-md py-2 px-3">
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#FF7A00] text-black font-semibold py-2.5 rounded-md hover:bg-[#FF9640] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Confirming Booking..." : "Confirm Booking"}
            </button>
          </form>
        )}

        {/* STEP 3 — Success */}
        {step === 3 && bookingResult && (
          <div className="text-center space-y-5">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#FF7A00]/10 border border-[#FF7A00] flex items-center justify-center">
              <span className="text-[#FF7A00] text-2xl">✓</span>
            </div>

            <h2
              className="text-2xl text-white"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Booking Confirmed
            </h2>

            <div className="bg-[#0D0D0D] border border-gray-800 rounded-md px-5 py-4 text-left text-sm text-gray-300 space-y-1">
              <p>
                <span className="text-gray-500">Booking ID:</span>{" "}
                <span className="text-[#FF7A00] font-semibold">
                  {bookingResult.data?.bookingId}
                </span>
              </p>
              <p>
                <span className="text-gray-500">Date:</span> {formData.date}
              </p>
              <p>
                <span className="text-gray-500">Time:</span>{" "}
                {formData.timeSlot}
              </p>
              <p>
                <span className="text-gray-500">Guests:</span>{" "}
                {formData.guestCount}
              </p>
            </div>

            <p className="text-gray-400 text-sm">
              A confirmation has been recorded. Please save your Booking ID
              for reference.
            </p>

            <button
              onClick={handleStartOver}
              className="w-full bg-transparent border border-gray-700 text-gray-300 font-semibold py-2.5 rounded-md hover:border-[#FF7A00] hover:text-[#FF7A00] transition-colors"
            >
              Make Another Booking
            </button>
          </div>
        )}
      </div>
    </main>
  );
}