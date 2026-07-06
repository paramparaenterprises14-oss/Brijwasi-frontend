'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SecretAdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Agar already admin logged in hai toh dashboard pe bhejo
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.role === 'admin') {
          router.push('/admin');
        }
      } catch (e) {}
    }
  }, []);

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage('');

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    console.log('Login Response:', data);

    if (res.ok) {
      // Check if data.data exists
      if (!data.data || !data.data.token) {
        setMessage('❌ No token received');
        setLoading(false);
        return;
      }

      // Admin role check
      if (data.data.user.role !== 'admin') {
        setMessage('❌ Access denied. Unauthorized.');
        setLoading(false);
        return;
      }

      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      
      console.log('Token saved:', localStorage.getItem('token'));
      
      setMessage('✅ Access granted! Redirecting...');
      
      setTimeout(() => {
        router.push('/admin');
      }, 1000);
    } else {
      setMessage('❌ ' + data.message);
    }
  } catch (err) {
    console.error('Login error:', err);
    setMessage('❌ Something went wrong');
  }

  setLoading(false);
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-zinc-900 p-8 rounded-lg w-96 border border-zinc-700">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-amber-500">🔐 Admin Access</h1>
          <p className="text-gray-400 text-sm mt-1">Restricted Area</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-300 text-sm mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-8 py-6 border border-zinc-700 rounded bg-zinc-800 text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-700 rounded bg-zinc-800 text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-amber-500 text-black font-semibold py-2 rounded hover:bg-amber-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Access Dashboard'}
          </button>
        </form>
        
        {message && (
          <p className={`mt-4 text-center text-sm ${message.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}