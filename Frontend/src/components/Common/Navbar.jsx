import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase() + (name.split(' ')[1]?.charAt(0).toUpperCase() || '');
  };

  const isAdmin = user?.peran === 'admin' || user?.peran === 'Admin';
  // Cek apakah user sudah punya data penyelenggara
  const penyelenggara = user?.penyelenggara_yang_dikelola?.[0];
  // Cek apakah statusnya sudah disetujui
  const isApprovedOrganizer = penyelenggara?.pivot?.status_tautan === 'Approved';
  // Cek apakah user adalah penyelenggara (pending atau approved)
  const isOrganizer = !!penyelenggara;

  return (
    <nav className="bg-[#0B1221] border-b border-gray-800 sticky top-0 z-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* LOGO */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <Link to="/" className="text-2xl font-bold tracking-tight flex items-center">
               <span className="text-[#FF7F3E]">Unila</span>
               <span className="text-white">Fest</span>
            </Link>
          </div>

          {/* SEARCH BAR (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-lg mx-12">
            <form onSubmit={handleSearch} className="w-full relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-700 rounded-full leading-5 bg-[#1F2937] text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-[#374151] focus:border-[#FF7F3E] focus:ring-1 focus:ring-[#FF7F3E] sm:text-sm transition-all"
                placeholder="Cari event seminar, lomba..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {/* RIGHT MENU */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-300 hover:text-white font-medium text-sm">
              Event
            </Link>

            {/* Tampilkan tombol "Jadi Penyelenggara" jika user BELUM jadi penyelenggara (baik user login maupun tamu) */}
            {!isOrganizer && (
                 <Link to="/ajukan-penyelenggara" className="text-gray-300 hover:text-white font-medium text-sm">
                    Daftar Penyelenggara
                 </Link>
            )}

            {user ? (
              <div className="flex items-center gap-3 pl-4 border-l border-gray-700">
                <div className="flex flex-col items-end">
                  <span className="text-white text-sm font-bold leading-none">
                    {user.nama?.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">
                    {isAdmin ? 'ADMIN' : 'USER'}
                  </span>
                </div>
                
                <div className="relative group">
                    <div className="h-10 w-10 rounded-full bg-[#FF7F3E] flex items-center justify-center text-white font-bold cursor-pointer hover:bg-orange-600 transition">
                        {getInitials(user.nama)}
                    </div>
                    {/* Dropdown Logout */}
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                        {isAdmin && (
                            <Link to="/admin/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard Admin</Link>
                        )}
                        {isApprovedOrganizer && (
                             <Link to="/agenda-saya" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard Penyelenggara</Link>
                        )}
                        <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                            Logout
                        </button>
                    </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                 <Link to="/login" className="text-white font-medium text-sm hover:text-[#FF7F3E]">Masuk</Link>
                 <Link to="/register" className="bg-[#FF7F3E] hover:bg-orange-600 text-white px-5 py-2 rounded-full text-sm font-medium transition">
                    Daftar
                 </Link>
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 hover:text-white p-2">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#0B1221] border-b border-gray-800 px-4 pt-2 pb-4">
            <Link to="/" className="block py-2 text-gray-300">Event</Link>
            {!isOrganizer && (
                <Link to="/ajukan-penyelenggara" className="block py-2 text-gray-300">Jadi Penyelenggara</Link>
            )}
            {!user ? (
                <>
                    <Link to="/login" className="block py-2 text-gray-300">Masuk</Link>
                    <Link to="/register" className="block py-2 text-[#FF7F3E]">Daftar</Link>
                </>
            ) : (
                <button onClick={logout} className="block py-2 text-red-500">Logout</button>
            )}
        </div>
      )}
    </nav>
  );
}