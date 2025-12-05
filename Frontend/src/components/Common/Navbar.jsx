// Frontend/src/components/Common/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 

const Navbar = () => {
  const { user, logout } = useAuth(); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Deteksi scroll untuk efek samar/transparan
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper style active link (Konsisten untuk semua menu)
  const linkStyle = (path) => 
    `text-sm font-medium transition-colors ${location.pathname === path ? "text-[#FF7F3E]" : "text-gray-300 hover:text-white"}`;

  const getUserInitial = () => {
    return user && user.nama ? user.nama.charAt(0).toUpperCase() : "U"; 
  };

  return (
    <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-white/10 ${
            scrolled ? 'bg-[#1a1a2e]/95 backdrop-blur-md shadow-md' : 'bg-[#1a1a2e]'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* --- LOGO (Kiri) --- */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center mr-8">
              <span className="text-2xl font-extrabold text-white tracking-tight">
                <span className="text-[#FF7F3E]">Unila</span>Fest
              </span>
            </Link>
          </div>

          {/* --- MENU NAVIGATION (Kanan Semua) --- */}
          <div className="hidden md:flex items-center space-x-8">
            
            {/* 1. Menu Umum */}
            <Link to="/" className={linkStyle('/')}>Beranda</Link>
            <Link to="/acara" className={linkStyle('/acara')}>Event</Link>

            {/* 2. Logika Menu Berdasarkan Auth */}
            {user ? (
              <>
                {/* Group Menu User */}
                <div className="flex items-center space-x-6 mr-4 border-r border-gray-600 pr-6 h-6">
                    
                    {user.peran === 'Admin' && (
                        <Link to="/admin/dashboard" className="text-sm font-medium text-red-400 hover:text-red-300">
                            Dashboard Admin
                        </Link>
                    )}

                    {/* --- LOGIKA BARU: Cek Status Penyelenggara --- */}
                    
                    {/* KONDISI A: User BELUM jadi Penyelenggara Approved */}
                    {!user.is_penyelenggara && (
                        <Link to="/ajukan-penyelenggara" className={linkStyle('/ajukan-penyelenggara')}>
                            Daftar Penyelenggara
                        </Link>
                    )}

                    {/* KONDISI B: User SUDAH jadi Penyelenggara Approved */}
                    {user.is_penyelenggara && (
                        <>
                            <Link to="/agenda-saya" className={linkStyle('/agenda-saya')}>
                                Event Saya
                            </Link>
                            
                            <Link to="/ajukan-acara" className={linkStyle('/ajukan-acara')}>
                                Ajukan Event
                            </Link>
                        </>
                    )}
                    {/* ------------------------------------------- */}

                </div>

                {/* Profil Dropdown */}
                <div className="relative">
                   <button 
                     onClick={() => setIsProfileOpen(!isProfileOpen)}
                     className="flex items-center space-x-3 focus:outline-none group"
                   >
                       <div className="text-right hidden lg:block">
                          <p className="text-sm font-bold text-white leading-none group-hover:text-[#FF7F3E] transition">{user.nama || 'User'}</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wide mt-1">{user.peran || 'Member'}</p>
                       </div>
                       <div className="h-9 w-9 rounded-full bg-white/10 text-white flex items-center justify-center font-bold text-sm border border-white/20 shadow-sm group-hover:border-[#FF7F3E] transition backdrop-blur-sm overflow-hidden">
                          {user.foto_profile_url ? (
                            <img src={user.foto_profile_url} alt={user.nama} className="w-full h-full object-cover" />
                          ) : (
                            getUserInitial()
                          )}
                       </div>
                   </button>
                   
                   {isProfileOpen && (
                    <div className="origin-top-right absolute right-0 mt-3 w-48 rounded-xl shadow-xl py-2 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 animate-fade-in-down">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-xs text-gray-400">Halo,</p>
                        <p className="text-sm font-bold text-[#1a1a2e] truncate">{user.nama}</p>
                      </div>
                      
                      <Link 
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#FF7F3E]"
                      >
                        Profile
                      </Link>
                      
                      <button 
                        onClick={onLogout}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600"
                      >
                        Keluar
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // 3. Jika Guest (Belum Login)
              <div className="flex items-center space-x-3 pl-4 border-l border-gray-600">
                <Link to="/login" className="text-gray-300 hover:text-white font-medium px-4 py-2 transition">
                  Masuk
                </Link>
                <Link to="/register" className="bg-white text-[#1a1a2e] hover:bg-[#FF7F3E] hover:text-white px-5 py-2.5 rounded-full font-bold transition-all shadow-lg transform hover:-translate-y-0.5 text-sm">
                  Daftar
                </Link>
              </div>
            )}
          </div>

          {/* --- MOBILE TOGGLE --- */}
          <div className="-mr-2 flex items-center md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none"
            >
              <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                 ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                 )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE MENU --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#1a1a2e] border-t border-white/10 shadow-xl">
          <div className="pt-2 pb-4 space-y-1 px-4">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5">Beranda</Link>
            <Link to="/acara" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5">Event</Link>
            
            {user && (
                <>
                    <p className="px-3 pt-4 pb-1 text-xs font-bold text-gray-500 uppercase">Menu User</p>
                    
                    {user.peran === 'Admin' && (
                       <Link to="/admin/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-red-400 hover:text-red-300 hover:bg-white/5">Dashboard Admin</Link>
                    )}

                    {/* --- LOGIKA MOBILE --- */}
                    {!user.is_penyelenggara && (
                        // Di sini juga disamakan stylenya dengan menu biasa
                        <Link to="/ajukan-penyelenggara" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5">
                            Daftar Penyelenggara
                        </Link>
                    )}

                    {user.is_penyelenggara && (
                        <>
                            <Link to="/agenda-saya" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5">Event Saya</Link>
                            <Link to="/ajukan-acara" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5">Ajukan Event</Link>
                        </>
                    )}
                </>
            )}
          </div>
          
          <div className="pt-4 pb-4 border-t border-white/10 px-4 bg-black/20">
            {user ? (
              <div className="flex items-center justify-between">
                 <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-white/10 text-white flex items-center justify-center font-bold border border-white/20">
                        {getUserInitial()}
                    </div>
                    <div className="ml-3">
                        <div className="text-base font-bold text-white">{user.nama}</div>
                        <div className="text-sm font-medium text-gray-400">{user.email}</div>
                    </div>
                 </div>
                 <button onClick={onLogout} className="text-sm font-bold text-red-400 hover:text-red-300">Keluar</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link to="/login" className="block w-full text-center px-4 py-2 border border-gray-500 rounded-lg text-gray-300 font-bold hover:bg-white/5 hover:text-white transition">Masuk</Link>
                <Link to="/register" className="block w-full text-center px-4 py-2 bg-[#FF7F3E] rounded-lg text-white font-bold hover:bg-orange-600">Daftar</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;