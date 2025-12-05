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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const onLogout = () => {
    logout();
    navigate('/login');
  };

<<<<<<< HEAD
=======
  // Helper style active link (Konsisten untuk semua menu)
>>>>>>> b8d690722913a125b3c2ed26e514c4a63fecb8ce
  const linkStyle = (path) => 
    `text-sm font-medium transition-colors ${location.pathname === path ? "text-[#FF7F3E]" : "text-gray-300 hover:text-white"}`;

  const getUserInitial = () => {
    return user && user.nama ? user.nama.charAt(0).toUpperCase() : "U"; 
  };

  // --- LOGIKA PENENTUAN MENU ---
  // Karena backend belum kirim status "is_penyelenggara", 
  // Kita pakai logika sementara: 
  // Jika emailnya 'bem@unila.ac.id' atau role 'Admin' -> Anggap Penyelenggara
  // User lain -> Anggap User Biasa
  const isOrganizerOrAdmin = user && (user.peran === 'Admin' || user.email === 'bem@unila.ac.id');

  return (
    <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-white/10 ${
            scrolled ? 'bg-[#1a1a2e]/95 backdrop-blur-md shadow-md' : 'bg-[#1a1a2e]'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* --- LOGO --- */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center mr-8">
              <span className="text-2xl font-extrabold text-white tracking-tight">
                <span className="text-[#FF7F3E]">Unila</span>Fest
              </span>
            </Link>
          </div>

          {/* --- MENU NAVIGATION --- */}
          <div className="hidden md:flex items-center space-x-8">
            
            {/* 1. MENU UMUM (Semua Orang Lihat) */}
            <Link to="/" className={linkStyle('/')}>Beranda</Link>
            <Link to="/acara" className={linkStyle('/acara')}>Event</Link>

            {/* 2. MENU BERDASARKAN USER */}
            {user ? (
              <>
                <div className="flex items-center space-x-6 mr-4 border-r border-gray-600 pr-6 h-6">
                    
                    {isOrganizerOrAdmin ? (
                        /* A. TAMPILAN PENYELENGGARA / ADMIN */
                        <>
                            <Link to="/agenda-saya" className={linkStyle('/agenda-saya')}>
                                Kelola Event
                            </Link>
                            <Link to="/ajukan-acara" className={linkStyle('/ajukan-acara')}>
                                Ajukan Event
                            </Link>
                            {user.peran === 'Admin' && (
                                <Link to="/admin/dashboard" className="text-sm font-medium text-red-400 hover:text-red-300 ml-4">
                                    Dashboard
                                </Link>
                            )}
                        </>
                    ) : (
                        /* B. TAMPILAN USER BIASA (Mahasiswa) */
                        <Link to="/ajukan-penyelenggara" className="text-sm font-bold text-blue-400 hover:text-blue-300 border border-blue-400/30 px-4 py-1.5 rounded-full hover:bg-blue-400/10 transition">
                            Daftar Penyelenggara
                        </Link>
                    )}

<<<<<<< HEAD
=======
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

>>>>>>> b8d690722913a125b3c2ed26e514c4a63fecb8ce
                </div>

                {/* --- PROFIL USER --- */}
                <div className="relative">
                   <button 
                     onClick={() => setIsProfileOpen(!isProfileOpen)}
                     className="flex items-center space-x-3 focus:outline-none group"
                   >
                       <div className="text-right hidden lg:block">
                          <p className="text-sm font-bold text-white leading-none group-hover:text-[#FF7F3E] transition">
                              {user.nama}
                          </p>
                          {/* Tampilkan Label Role */}
                          <p className="text-[10px] text-gray-400 uppercase tracking-wide mt-1">
                              {isOrganizerOrAdmin ? 'Penyelenggara' : 'Mahasiswa'}
                          </p>
                       </div>
                       <div className="h-9 w-9 rounded-full bg-white/10 text-white flex items-center justify-center font-bold text-sm border border-white/20 shadow-sm group-hover:border-[#FF7F3E] transition backdrop-blur-sm">
                          {getUserInitial()}
                       </div>
                   </button>
                   
                   {isProfileOpen && (
                    <div className="origin-top-right absolute right-0 mt-3 w-48 rounded-xl shadow-xl py-2 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 animate-fade-in-down">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-xs text-gray-400">Masuk sebagai</p>
                        <p className="text-sm font-bold text-[#1a1a2e]">{user.email}</p>
                      </div>
                      
                      <button 
                        onClick={onLogout}
                        className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
                      >
                        Keluar
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // 3. TAMPILAN GUEST (Belum Login)
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
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md text-gray-400 hover:text-white">
              <svg className="block h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE MENU --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#1a1a2e] border-t border-white/10 shadow-xl">
          <div className="pt-2 pb-4 space-y-1 px-4">
<<<<<<< HEAD
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-white/5">Beranda</Link>
            <Link to="/acara" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-white/5">Event</Link>
            
            {user && (
                <>
                   <div className="border-t border-white/10 my-2"></div>
                   {isOrganizerOrAdmin ? (
                       <>
                           <Link to="/agenda-saya" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-white/5">Kelola Event</Link>
                           <Link to="/ajukan-acara" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-white/5">Ajukan Event</Link>
                       </>
                   ) : (
                       <Link to="/ajukan-penyelenggara" className="block px-3 py-2 rounded-md text-base font-medium text-blue-400 hover:bg-white/5">Daftar Penyelenggara</Link>
                   )}
=======
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
>>>>>>> b8d690722913a125b3c2ed26e514c4a63fecb8ce
                </>
            )}
          </div>
          {/* Footer Mobile Menu sama seperti sebelumnya... */}
          <div className="pt-4 pb-4 border-t border-white/10 px-4 bg-black/20">
            {user ? (
                <button onClick={onLogout} className="text-red-400 font-bold text-sm w-full text-left">Keluar</button>
            ) : (
                <Link to="/login" className="text-white font-bold text-sm">Masuk</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;