// Frontend/src/components/Common/Navbar.jsx
// (PJ 1 - GATEKEEPER) - Header Dark Mode Sesuai Mockup

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import Button from './Button';

export default function Navbar() {
  const { user, clearAuthData } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosClient.post('/logout');
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      clearAuthData();
      navigate('/login');
    }
  };
  
  // Link navigasi (Teks Putih)
  const navLinks = [
      { to: '/', label: 'Event' },
      ...(user ? [{ to: '/agenda-saya', label: 'Agenda Saya' }] : []),
  ];

  return (
    // Background menggunakan warna Secondary (#1A202C)
    <nav className="bg-secondary shadow-lg border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* LOGO: Unila (Orange) + Fest (Putih) */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
            {/* Opsional: Jika ada logo gambar, taruh di sini */}
            <span className="text-3xl font-extrabold tracking-tight">
              <span className="text-primary group-hover:text-primary-hover transition-colors">Unila</span>
              <span className="text-white">Fest</span>
            </span>
          </Link>

          {/* NAVIGASI TENGAH (Desktop) */}
          <div className="hidden sm:flex sm:space-x-8">
              {navLinks.map((link) => (
                  <Link
                      key={link.to}
                      to={link.to}
                      className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-300 hover:text-white hover:border-b-2 hover:border-primary transition-all h-full"
                  >
                      {link.label}
                  </Link>
              ))}
          </div>

          {/* TOMBOL LOGIN/DAFTAR (Kanan) */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-300 hidden md:block">
                  Halo, <span className="font-bold text-primary">{user.nama}</span>
                </span>
                <Button 
                    onClick={handleLogout} 
                    className="bg-gray-700 text-white hover:bg-gray-600 border border-gray-600 text-xs px-3 py-1.5"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {/* Login: Teks Putih/Abu */}
                <Link 
                    to="/login" 
                    className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Masuk
                </Link>
                {/* Daftar: Tombol Orange */}
                <Link
                    to="/register"
                    className="bg-primary text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-primary-hover shadow-lg hover:shadow-orange-500/20 transition-all transform hover:-translate-y-0.5"
                >
                  Daftar Sekarang
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}