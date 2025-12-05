// Frontend/src/components/Common/ProtectedRoute.jsx
// (PJ 1 - GATEKEEPER)

import { useAuth } from '../../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ allowedRoles = [] }) {
  const { user, token } = useAuth();

  // 1. Cek apakah user sudah login
  if (!token || !user) {
    // Jika belum, lempar ke halaman login
    return <Navigate to="/login" replace />;
  }

  // 2. Cek apakah user memiliki role yang diizinkan
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.peran)) {
    // Jika role user tidak diizinkan, lempar ke Homepage
    return <Navigate to="/" replace />;
  }

  // 3. Jika lolos semua, tampilkan halamannya
  return <Outlet />;
}