
'use client';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  return (
    <nav className="fixed top-0 w-full bg-zinc-900/90 backdrop-blur-sm text-white z-50 px-8 py-4 flex justify-between items-center">
      <a href="/" className="text-2xl" style={{ fontFamily: 'var(--font-playfair)' }}>
        The Brijwasi
      </a>
      <div className="flex gap-6 text-sm items-center">
        <a href="/" className="hover:text-amber-500 transition-colors">Home</a>
        <a href="/menu" className="hover:text-amber-500 transition-colors">Menu</a>
        <a href="/reservation" className="hover:text-amber-500 transition-colors">Reserve</a>
        <a href="/about" className="hover:text-amber-500 transition-colors">About</a>
        <a href="/contact" className="hover:text-amber-500 transition-colors">Contact</a>
        {isLoggedIn ? (
          <>
            <a href="/profile" className="hover:text-amber-500 transition-colors">My Bookings</a>
            <button onClick={handleLogout} className="hover:text-red-400 transition-colors">Logout</button>
          </>
        ) : (
          <>
            <a href="/login" className="hover:text-amber-500 transition-colors">Login</a>
            <a href="/register" className="bg-amber-500 text-black px-4 py-1.5 rounded-full hover:bg-amber-400 transition-colors">
              Register
            </a>
          </>
        )}
      </div>
    </nav>
  );
}