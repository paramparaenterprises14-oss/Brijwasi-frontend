
"use client";

import { useState, useEffect, useRef } from "react";

function useCountUp(target, isVisible) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const duration = 1500;
    const stepTime = Math.max(Math.floor(duration / target), 20);

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= target) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, [isVisible, target]);

  return count;
}

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const years = useCountUp(15, isVisible);
  const dishes = useCountUp(50, isVisible);
  const customers = useCountUp(10000, isVisible);
  const rating = useCountUp(48, isVisible);

  return (
    <main className="min-h-screen bg-[#0D0D0D] px-16 py-25 md:px-18">
      {/* Hero split section */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <h1
            className="text-4xl md:text-5xl text-white mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Our Story
          </h1>
          <p className="text-gray-400 leading-relaxed mb-4">
            The Brijwasi was born from a simple idea — to bring the authentic
            flavours of traditional Indian cooking to every table, made with
            the same care and purity our families have followed for
            generations.
          </p>
          <p className="text-gray-400 leading-relaxed mb-4">
            Every dish we serve is crafted using time-honoured recipes,
            fresh ingredients, and a commitment to purely vegetarian
            cooking. From our kitchen to your table, we bring the spirit of
            Brij's rich culinary heritage.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Whether you're here for a family celebration or a quiet evening
            meal, we promise an experience rooted in tradition and served
            with warmth.
          </p>
        </div>

        <div className="rounded-xl overflow-hidden border border-gray-800 h-80 md:h-96 bg-[#1A1A1A] flex items-center justify-center">
          <span className="text-gray-600 text-sm">Restaurant image goes here</span>
        </div>
      </div>

      {/* Animated Counters */}
      <div
        ref={sectionRef}
        className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
      >
        <div className="text-center bg-[#1A1A1A] border border-gray-800 rounded-xl py-8 px-4">
          <p className="text-4xl font-bold text-[#FF7A00] mb-1">{years}+</p>
          <p className="text-gray-400 text-sm">Years of Legacy</p>
        </div>
        <div className="text-center bg-[#1A1A1A] border border-gray-800 rounded-xl py-8 px-4">
          <p className="text-4xl font-bold text-[#FF7A00] mb-1">{dishes}+</p>
          <p className="text-gray-400 text-sm">Signature Dishes</p>
        </div>
        <div className="text-center bg-[#1A1A1A] border border-gray-800 rounded-xl py-8 px-4">
          <p className="text-4xl font-bold text-[#FF7A00] mb-1">
            {customers.toLocaleString()}+
          </p>
          <p className="text-gray-400 text-sm">Happy Customers</p>
        </div>
        <div className="text-center bg-[#1A1A1A] border border-gray-800 rounded-xl py-8 px-4">
          <p className="text-4xl font-bold text-[#FF7A00] mb-1">
            {(rating / 10).toFixed(1)}
          </p>
          <p className="text-gray-400 text-sm">Average Rating</p>
        </div>
      </div>

      {/* Values section */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
        <div className="bg-[#1A1A1A] border border-gray-800 rounded-xl p-6">
          <h3
            className="text-xl text-white mb-2"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Pure Vegetarian
          </h3>
          <p className="text-gray-400 text-sm">
            Every dish on our menu is 100% vegetarian, prepared with
            respect for tradition and purity.
          </p>
        </div>
        <div className="bg-[#1A1A1A] border border-gray-800 rounded-xl p-6">
          <h3
            className="text-xl text-white mb-2"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Authentic Recipes
          </h3>
          <p className="text-gray-400 text-sm">
            Passed down through generations, our recipes stay true to
            Brij's culinary roots.
          </p>
        </div>
        <div className="bg-[#1A1A1A] border border-gray-800 rounded-xl p-6">
          <h3
            className="text-xl text-white mb-2"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Warm Hospitality
          </h3>
          <p className="text-gray-400 text-sm">
            We treat every guest like family, with service that reflects
            genuine care.
          </p>
        </div>
      </div>
    </main>
  );
}