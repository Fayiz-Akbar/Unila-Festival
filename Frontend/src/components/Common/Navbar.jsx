import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from './button';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --- HANDLER PENCARIAN ---
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirect ke halaman home dengan parameter pencarian
      navigate(`/?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // --- LOGIKA HAK AKSES ---
  // 1. Cek apakah Admin
  const isAdmin = user?.peran === 'admin' || user?.peran === 'Admin';

  // 2. Cek apakah User adalah Penyelenggara yang Disetujui (Approved)
  // Kita cek array relasi 'penyelenggara_yang_dikelola' yang dikirim AuthController
  // Menggunakan optional chaining (?.) untuk keamanan jika data null
  const penyelenggara = user?.penyelenggara_yang_dikelola?.[0]; // Ambil data pertama
  const isApprovedOrganizer = penyelenggara?.pivot?.status_tautan === 'Approved';

  return (
    <nav className="bg-secondary border-b border-gray-800 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* A. LOGO SECTION */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <Link to="/" className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
               <div>
                 <span className="text-primary">Unila</span>
                 <span className="text-white">Fest</span>
               </div>
            </Link>
          </div>

          {/* B. SEARCH BAR (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-full leading-5 bg-gray-800 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-gray-900 focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm transition-all duration-300"
                placeholder="Cari event seminar, lomba..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {/* C. DESKTOP MENU */}
          <div className="hidden md:flex items-center space-x-6">
            
            {/* Menu Global: Semua User bisa lihat */}
            <Link to="/" className="text-gray-300 hover:text-primary font-medium text-sm transition-colors">
              Event
            </Link>

            {/* Logika User Login */}
            {user ? (
              <>
                {/* --- MENU ADMIN --- */}
                {isAdmin && (
                  <Link to="/admin/dashboard" className="text-primary font-semibold text-sm hover:text-orange-400 transition-colors">
                    Dashboard Admin
                  </Link>
                )}

                {/* --- MENU USER / PENYELENGGARA --- */}
                {!isAdmin && (
                  <>
                    {isApprovedOrganizer ? (
                      // 1. Jika Status Approved -> Tampilkan Menu Manajemen Event
                      <>
                        <Link to="/agenda-saya" className="text-gray-300 hover:text-primary font-medium text-sm transition-colors">
                          Event Saya
                        </Link>
                        <Link to="/ajukan-acara">
                          <Button variant="outline" className="py-1.5 px-4 text-xs border-primary text-primary hover:bg-primary hover:text-white rounded-full">
                            + Tambah Event
                          </Button>
                        </Link>
                      </>
                    ) : (
                      // 2. Jika Belum Approved / Belum Daftar -> Tampilkan Menu Daftar
                      <Link to="/ajukan-penyelenggara" className="text-gray-300 hover:text-primary font-medium text-sm transition-colors">
                        Daftar Penyelenggara
                      </Link>
                    )}
                  </>
                )}

                {/* User Profile & Logout */}
                <div className="flex items-center gap-4 pl-6 border-l border-gray-700 ml-2">
                  <div className="flex flex-col items-end hidden lg:flex">
                    <span className="text-white text-sm font-semibold leading-none">
                      {user.nama?.split(' ')[0]}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      {isAdmin ? 'Administrator' : isApprovedOrganizer ? 'Mitra Event' : 'User'}
                    </span>
                  </div>
                  
                  <button 
                    onClick={logout} 
                    className="p-2 text-gray-400 hover:text-red-500 bg-gray-800 hover:bg-gray-700 rounded-full transition-all duration-300" 
                    title="Keluar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              // Logika Tamu (Guest)
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-300 hover:text-white font-medium text-sm transition-colors">
                  Masuk
                </Link>
                <Link to="/register">
                  <Button className="py-2 px-6 text-sm shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all">
                    Daftar
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* D. MOBILE MENU BUTTON */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="text-gray-300 hover:text-white p-2 rounded-md focus:outline-none"
            >
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

      {/* E. MOBILE MENU DROPDOWN */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 border-b border-gray-800 animate-fade-in-down">
          {/* Mobile Search */}
          <div className="px-4 pt-4 pb-2">
            <form onSubmit={handleSearch} className="relative">
               <input
                type="text"
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg py-2 pl-3 pr-10 focus:border-primary focus:ring-1 focus:ring-primary placeholder-gray-500"
                placeholder="Cari event..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-2 top-2 text-gray-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
          
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800">
              Event
            </Link>

            {user ? (
              <>
                {isAdmin ? (
                  <Link to="/admin/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-gray-800">
                    Dashboard Admin
                  </Link>
                ) : (
                   isApprovedOrganizer ? (
                    <>
                      <Link to="/agenda-saya" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800">
                        Event Saya
                      </Link>
                      <Link to="/ajukan-acara" className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-gray-800">
                        + Tambah Event
                      </Link>
                    </>
                   ) : (
                    <Link to="/ajukan-penyelenggara" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800">
                      Daftar Penyelenggara
                    </Link>
                   )
                )}
                
                <div className="border-t border-gray-800 mt-4 pt-4 px-3">
                  <div className="flex items-center mb-3">
                    <div className="ml-0">
                      <div className="text-base font-medium leading-none text-white">{user.nama}</div>
                      <div className="text-xs font-medium leading-none text-gray-500 mt-1">{user.email}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-gray-800"
                  >
                    Keluar
                  </button>
                </div>
              </>
            ) : (
              <div className="border-t border-gray-800 mt-4 pt-4 flex flex-col gap-2 px-3">
                <Link to="/login" className="block w-full text-center px-4 py-2 border border-gray-600 rounded-md text-gray-300 font-medium hover:bg-gray-800">
                  Masuk
                </Link>
                <Link to="/register" className="block w-full text-center px-4 py-2 bg-primary rounded-md text-white font-medium hover:bg-orange-600">
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}