"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send message");
      }

      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0D0D0D] px-16 py-25 md:px-18">
      <h1
        className="text-4xl text-center text-white mb-2"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Contact Us
      </h1>
      <p className="text-center text-gray-400 mb-12">
        Have questions or special requests? Reach out to us
      </p>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="bg-[#1A1A1A] border border-gray-800 rounded-xl p-6 space-y-3 text-gray-300">
            <p>
              <span className="text-gray-500 block text-sm">Phone</span>
              +91 98765 43210
            </p>
            <p>
              <span className="text-gray-500 block text-sm">Email</span>
              info@thebrijwasi.com
            </p>
            <p>
              <span className="text-gray-500 block text-sm">Address</span>
              123, Food Street, Your City
            </p>
            <p>
              <span className="text-gray-500 block text-sm">Hours</span>
              12:00 PM – 10:00 PM, Daily
            </p>
          </div>

          <div className="rounded-xl overflow-hidden border border-gray-800 h-64">
            <iframe
              title="The Brijwasi Location"
              src="https://maps.google.com/maps?q=Mathura,Uttar+Pradesh&t=&z=13&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#1A1A1A] border border-gray-800 rounded-xl p-6 space-y-4 h-fit"
        >
          <div>
            <label className="block text-gray-300 text-sm mb-1.5">
              Your Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              placeholder="Enter your name"
              className="w-full bg-[#0D0D0D] border border-gray-700 rounded-md px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#FF7A00] transition-colors"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1.5">
              Your Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              placeholder="you@example.com"
              className="w-full bg-[#0D0D0D] border border-gray-700 rounded-md px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#FF7A00] transition-colors"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1.5">
              Your Message
            </label>
            <textarea
              rows="4"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
              placeholder="Write your message..."
              className="w-full bg-[#0D0D0D] border border-gray-700 rounded-md px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#FF7A00] transition-colors resize-none"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center bg-red-500/10 border border-red-500/30 rounded-md py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#FF7A00] text-black font-semibold py-2.5 rounded-md hover:bg-[#FF9640] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>

          {submitted && (
            <p className="text-green-400 text-center text-sm bg-green-500/10 border border-green-500/30 rounded-md py-2">
              Message sent successfully!
            </p>
          )}
        </form>
      </div>
    </main>
  );
}