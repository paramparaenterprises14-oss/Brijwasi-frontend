"use client";

import { useState, useEffect } from "react";

const CATEGORIES = [
  "All",
  "Appetizers",
  "Tandoori",
  "Main-Course",
  "Sweets",
  "Namkeen",
  "Desserts",
];

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch('${process.env.NEXT_PUBLIC_API_URL}/api/menu');
        if (!res.ok) {
          throw new Error("Failed to load menu");
        }
        const data = await res.json();

        // Backend might send a plain array, or wrap it inside
        // { data: [...] } or { menuItems: [...] } — handle all cases safely
        const items = Array.isArray(data)
          ? data
          : data.data || data.menuItems || [];

        setMenuItems(items);
      } catch (err) {
        setError("Unable to load menu right now. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchMenu();
  }, []);

  const filteredItems =
    activeCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  return (
    <main className="min-h-screen bg-[#0D0D0D] px-10 py-16 md:px-18">
      <h1
        className="text-4xl md:text-5xl text-center text-white mb-2"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Our Menu
      </h1>
      <p className="text-center text-gray-400 mb-10">
        Authentic flavours, crafted with tradition
      </p>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full border transition-colors ${
              activeCategory === cat
                ? "bg-[#FF7A00] text-black border-[#FF7A00]"
                : "bg-transparent text-gray-300 border-gray-600 hover:border-[#FF7A00] hover:text-[#FF7A00]"
            }`}
          >
            {cat.replace("-", " ")}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <p className="text-center text-gray-400">Loading menu...</p>
      )}

      {/* Error State */}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Empty State */}
      {!isLoading && !error && filteredItems.length === 0 && (
        <p className="text-center text-gray-500">
          No dishes found in this category.
        </p>
      )}

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => (
          <MenuCard key={item._id} item={item} />
        ))}
      </div>
    </main>
  );
}

function MenuCard({ item }) {
  return (
    <div className="relative bg-[#1A1A1A] rounded-xl shadow-lg overflow-hidden border border-gray-800 hover:border-[#FF7A00]/50 transition-colors">
      {/* Out of Stock Overlay */}
      {!item.isAvailable && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
          <span className="text-white font-semibold tracking-wide border border-white px-4 py-1 rounded-full">
            Out of Stock
          </span>
        </div>
      )}

      {/* Image */}
      <div className="relative h-48 w-full bg-[#111]">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}

        {/* Chef Special Tag */}
        {item.isChefSpecial && (
          <span className="absolute top-2 left-2 bg-[#FF7A00] text-black text-xs font-semibold px-3 py-1 rounded-full">
            Chef Special
          </span>
        )}

        {/* Pure Veg Badge */}
        <span className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center border-2 border-green-500 rounded bg-black">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
        </span>
      </div>

      {/* Details */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3
            className="text-lg text-white"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {item.name}
          </h3>
          <span className="text-[#FF7A00] font-semibold">₹{item.price}</span>
        </div>
        <p className="text-sm text-gray-400 line-clamp-2">
          {item.description}
        </p>
      </div>
    </div>
  );
}