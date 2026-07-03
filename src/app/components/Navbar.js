
'use client';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Mobile menu toggle state

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
    <nav className="fixed top-0 w-full bg-zinc-900/90 backdrop-blur-sm text-white z-50 px-4 md:px-8 py-4 flex flex-wrap justify-between items-center">
      {/* Logo */}
      <a href="/" className="text-2xl z-50" style={{ fontFamily: 'var(--font-playfair)' }}>
        The Brijwasi
      </a>

      {/* 📱 Mobile Menu Hamburger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="md:hidden block text-white focus:outline-none z-50 p-1"
        aria-label="Toggle Menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* 💻 Links Container (Desktop aur Mobile dono ke liye responsive) */}
      <div className={`
        ${isOpen ? 'flex' : 'hidden'} 
        md:flex flex-col md:flex-row items-center gap-4 md:gap-6 text-sm 
        w-full md:w-auto absolute md:static top-full left-0 bg-zinc-950/95 md:bg-transparent 
        p-6 md:p-0 transition-all duration-300 border-b border-zinc-800 md:border-none
      `}>
        <a href="/" className="hover:text-amber-500 transition-colors py-2 md:py-0 w-full md:w-auto text-center">Home</a>
        <a href="/menu" className="hover:text-amber-500 transition-colors py-2 md:py-0 w-full md:w-auto text-center">Menu</a>
        <a href="/reservation" className="hover:text-amber-500 transition-colors py-2 md:py-0 w-full md:w-auto text-center">Reserve</a>
        <a href="/about" className="hover:text-amber-500 transition-colors py-2 md:py-0 w-full md:w-auto text-center">About</a>
        <a href="/contact" className="hover:text-amber-500 transition-colors py-2 md:py-0 w-full md:w-auto text-center">Contact</a>
        
        {isLoggedIn ? (
          <>
            <a href="/profile" className="hover:text-amber-500 transition-colors py-2 md:py-0 w-full md:w-auto text-center">My Bookings</a>
            <button onClick={handleLogout} className="hover:text-red-400 transition-colors py-2 md:py-0 w-full md:w-auto text-center cursor-pointer">Logout</button>
          </>
        ) : (
          <>
            <a href="/login" className="hover:text-amber-500 transition-colors py-2 md:py-0 w-full md:w-auto text-center">Login</a>
            <a href="/register" className="bg-amber-500 text-black px-4 py-1.5 rounded-full hover:bg-amber-400 transition-colors my-2 md:my-0 block text-center w-40 md:w-auto">
              Register
            </a>
          </>
        )}
      </div>
    </nav>
  );
}