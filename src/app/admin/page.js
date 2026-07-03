
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [menuForm, setMenuForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Main-Course',
    isVeg: true,
    isAvailable: true,
    isChefSpecial: false,
  });

  const fetchBookings = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reservations`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.data) setBookings(data.data);
  };

  const fetchMenu = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/menu', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.data) setMenuItems(data.data);
  };

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/reservations/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchBookings();
    } catch (err) {
      console.log(err);
    }
  };

  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const url = editingItem
      ? `http://localhost:5000/api/menu/${editingItem._id}`
      : 'http://localhost:5000/api/menu';
    const method = editingItem ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...menuForm,
          price: parseInt(menuForm.price),
        }),
      });
      if (res.ok) {
        fetchMenu();
        setShowMenuForm(false);
        setEditingItem(null);
        setMenuForm({
          name: '',
          description: '',
          price: '',
          category: 'Main-Course',
          isVeg: true,
          isAvailable: true,
          isChefSpecial: false,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteMenuItem = async (id) => {
    const token = localStorage.getItem('token');
    if (!confirm('Delete this item?')) return;
    try {
      await fetch(`http://localhost:5000/api/menu/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMenu();
    } catch (err) {
      console.log(err);
    }
  };

  const editMenuItem = (item) => {
    setEditingItem(item);
    setMenuForm({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      isVeg: item.isVeg,
      isAvailable: item.isAvailable,
      isChefSpecial: item.isChefSpecial,
    });
    setShowMenuForm(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/secret_admin_access');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/secret_admin_access');
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || user.role !== 'admin') {
        router.push('/secret_admin_access');
        return;
      }
    } catch (e) {
      router.push('/secret_admin_access');
      return;
    }

    fetchBookings();
    fetchMenu();
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      Pending: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40',
      Confirmed: 'bg-green-500/20 text-green-400 border border-green-500/40',
      Seated: 'bg-blue-500/20 text-blue-400 border border-blue-500/40',
      Cancelled: 'bg-red-500/20 text-red-400 border border-red-500/40',
      'No-Show': 'bg-gray-500/20 text-gray-400 border border-gray-500/40',
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] px-6 py-10 md:px-12">
      <div className="flex justify-between items-center mb-8">
        <h1
          className="text-3xl text-white"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Admin Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-400 hover:text-red-400 border border-gray-700 hover:border-red-400 px-4 py-2 rounded-md transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-[#1A1A1A] border border-gray-800 p-6 rounded-xl">
          <h2 className="text-sm text-gray-400 mb-1">Total Bookings</h2>
          <p className="text-4xl font-bold text-white">{bookings.length}</p>
        </div>
        <div className="bg-[#1A1A1A] border border-gray-800 p-6 rounded-xl">
          <h2 className="text-sm text-gray-400 mb-1">Menu Items</h2>
          <p className="text-4xl font-bold text-[#FF7A00]">{menuItems.length}</p>
        </div>
      </div>

      {/* Menu Management */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
            Menu Items
          </h2>
          <button
            onClick={() => {
              setShowMenuForm(!showMenuForm);
              setEditingItem(null);
              setMenuForm({
                name: '',
                description: '',
                price: '',
                category: 'Main-Course',
                isVeg: true,
                isAvailable: true,
                isChefSpecial: false,
              });
            }}
            className="bg-[#FF7A00] text-black font-semibold px-4 py-2 rounded-md hover:bg-[#FF9640] transition-colors"
          >
            + Add New Item
          </button>
        </div>

        {/* Menu Form */}
        {showMenuForm && (
          <div className="bg-[#1A1A1A] border border-gray-800 p-6 rounded-xl mb-6">
            <h3 className="text-xl text-white mb-4">
              {editingItem ? 'Edit Item' : 'Add New Item'}
            </h3>
            <form onSubmit={handleMenuSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Item Name"
                  value={menuForm.name}
                  onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                  className="px-4 py-2.5 bg-[#0D0D0D] border border-gray-700 rounded-md text-white placeholder-gray-600 focus:outline-none focus:border-[#FF7A00]"
                  required
                />
                <input
                  type="number"
                  placeholder="Price (₹)"
                  value={menuForm.price}
                  onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })}
                  className="px-4 py-2.5 bg-[#0D0D0D] border border-gray-700 rounded-md text-white placeholder-gray-600 focus:outline-none focus:border-[#FF7A00]"
                  required
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={menuForm.description}
                  onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                  className="px-4 py-2.5 bg-[#0D0D0D] border border-gray-700 rounded-md text-white placeholder-gray-600 focus:outline-none focus:border-[#FF7A00] md:col-span-2"
                  required
                />
                <select
                  value={menuForm.category}
                  onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value })}
                  className="px-4 py-2.5 bg-[#0D0D0D] border border-gray-700 rounded-md text-white focus:outline-none focus:border-[#FF7A00]"
                >
                  <option value="Appetizers">Appetizers</option>
                  <option value="Tandoori">Tandoori</option>
                  <option value="Main-Course">Main Course</option>
                  <option value="Biryani">Biryani</option>
                  <option value="Sweets">Sweets</option>
                  <option value="Namkeen">Namkeen</option>
                  <option value="Desserts">Desserts</option>
                </select>

                <div className="flex items-center gap-6 text-gray-300 text-sm">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={menuForm.isAvailable}
                      onChange={(e) => setMenuForm({ ...menuForm, isAvailable: e.target.checked })}
                    />
                    Available
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={menuForm.isChefSpecial}
                      onChange={(e) => setMenuForm({ ...menuForm, isChefSpecial: e.target.checked })}
                    />
                    Chef Special
                  </label>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  {editingItem ? 'Update' : 'Add'} Item
                </button>
                <button
                  type="button"
                  onClick={() => setShowMenuForm(false)}
                  className="bg-gray-700 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Menu List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item) => (
            <div
              key={item._id}
              className="bg-[#1A1A1A] border border-gray-800 rounded-xl p-4"
            >
              <h3 className="text-lg font-bold text-white">{item.name}</h3>
              <p className="text-sm text-gray-400 line-clamp-2">{item.description}</p>
              <p className="text-lg font-bold text-[#FF7A00] mt-1">₹{item.price}</p>
              <div className="text-xs mt-2 flex flex-wrap gap-2">
                <span
                  className={`px-2 py-1 rounded ${
                    item.isAvailable
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {item.isAvailable ? 'Available' : 'Unavailable'}
                </span>
                {item.isChefSpecial && (
                  <span className="px-2 py-1 rounded bg-yellow-500/20 text-yellow-400">
                    ⭐ Chef Special
                  </span>
                )}
              </div>
              <div className="mt-3 flex gap-4">
                <button
                  onClick={() => editMenuItem(item)}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteMenuItem(item._id)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div>
        <h2 className="text-2xl text-white mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
          All Bookings
        </h2>
        {bookings.length === 0 ? (
          <p className="text-gray-500">No bookings yet.</p>
        ) : (
          <div className="overflow-x-auto bg-[#1A1A1A] border border-gray-800 rounded-xl">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 text-left">
                  <th className="p-3">Booking ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Guests</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id} className="border-b border-gray-800 text-gray-300">
                    <td className="p-3 text-[#FF7A00] font-medium">{booking.bookingId}</td>
                    <td className="p-3">{booking.customerName}</td>
                    <td className="p-3">{booking.date}</td>
                    <td className="p-3">{booking.timeSlot}</td>
                    <td className="p-3">{booking.guestCount}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <select
                        value={booking.status}
                        onChange={(e) => updateStatus(booking._id, e.target.value)}
                        className="bg-[#0D0D0D] border border-gray-700 rounded px-2 py-1 text-sm text-white"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirm</option>
                        <option value="Seated">Seated</option>
                        <option value="Cancelled">Cancel</option>
                        <option value="No-Show">No-Show</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}