// Frontend/src/components/Common/AdminLayout.jsx
// (PJ 1 - GATEKEEPER) - Tampilan Admin Baru (Dark Sidebar)

import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Komponen helper untuk NavLink agar bisa mendeteksi 'active'
const StyledNavLink = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `block rounded-md px-4 py-3 text-sm transition-colors duration-150 ${
        isActive
          ? 'bg-primary-hover/50 text-white shadow-inner font-bold' // Aktif: Warna Amber redup + Teks Putih
          : 'text-gray-300 hover:bg-secondary/70' // Tidak aktif: Abu-abu muda + Hover gelap
      }`
    }
  >
    {children}
  </NavLink>
);

export default function AdminLayout() {
  // Mengambil fungsi 'logout' langsung dari AuthContext agar konsisten
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
        // Panggil fungsi logout dari context (ini akan hapus token & state user)
        await logout(); 
    } catch (e) {
        console.error('Logout error:', e);
    } finally {
        // Apapun yang terjadi, paksa redirect ke login
        navigate('/login', { replace: true });
    }
  };

  return (
    // Latar belakang utama (Bg konten) lebih terang
    <div className="flex h-screen bg-gray-100">
      
      {/* Sidebar Navigasi (Warna Secondary: Dark Slate sesuai tema Anda) */}
      <aside className="w-64 flex-shrink-0 bg-secondary shadow-2xl border-r border-primary/20">
        <div className="flex h-full flex-col p-6">
          {/* Logo & User */}
          <div className="mb-8 border-b border-primary/30 pb-4">
            <h2 className="text-2xl font-extrabold text-primary">
              Unila<span className='text-white'>Fest</span>
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              {user?.peran || 'Admin'} Panel: {user?.nama || 'Guest'}
            </p>
          </div>
          
          {/* Daftar Link Navigasi */}
          <nav className="flex-1 space-y-2">
            <StyledNavLink to="/admin/dashboard">
               Dashboard
            </StyledNavLink>
            <StyledNavLink to="/admin/kategori">
               Manajemen Kategori
            </StyledNavLink>
             {/* --- BAGIAN BARU: Manajemen Acara --- */}
            <StyledNavLink to="/admin/manajemen-acara">
               Manajemen Acara
            </StyledNavLink>
            <StyledNavLink to="/admin/validasi-penyelenggara">
               Validasi Penyelenggara
            </StyledNavLink>
            <StyledNavLink to="/admin/validasi-acara">
               Validasi Acara
            </StyledNavLink>
          </nav>

          {/* Tombol Logout di bawah */}
          <div>
            <button
              onClick={handleLogout}
              className="block w-full rounded-md px-4 py-3 text-left text-sm font-medium text-red-400 hover:bg-red-900/50 transition-colors mt-4"
            >
               Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Konten Utama */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}