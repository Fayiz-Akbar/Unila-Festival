// Frontend/src/router.jsx
// (PJ 1 - GATEKEEPER) - Konfigurasi Router Utama

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';

// --- Components & Layouts ---
import ProtectedRoute from './components/Common/ProtectedRoute.jsx';
import AdminLayout from './components/Common/AdminLayout.jsx'; // Layout Admin
import Layout from './components/Common/Layout.jsx'; // Layout Publik (Navbar & Footer)

// --- Pages Publik/User ---
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import HomePage from './pages/HomePage.jsx';
import AcaraDetailPage from './pages/AcaraDetailPage.jsx';
import AgendaSayaPage from './pages/AgendaSayaPage.jsx';

// --- Admin Pages (PJ 1) ---
import AdminDashboardPage from './pages/Admin/AdminDashboardPage.jsx';
import AdminKategoriPage from './pages/Admin/AdminKategoriPage.jsx';
import AdminValidasiPenyelenggaraPage from './pages/Admin/AdminValidasiPenyelenggaraPage.jsx';
import AdminValidasiAcaraPage from './pages/Admin/AdminValidasiAcaraPage.jsx';

const router = createBrowserRouter([
  {
    element: <App />, // Root element (biasanya berisi Global Providers/Toaster)
    children: [
      // ====================================================
      // 1. HALAMAN STANDALONE (Login & Register - Tanpa Navbar/Footer)
      // ====================================================
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },

      // ====================================================
      // 2. HALAMAN PUBLIK (Dibungkus Layout: Navbar + Content + Footer)
      // ====================================================
      {
        element: <Layout />, // Layout ini SEKARANG menggunakan <Outlet />
        children: [
          { path: '/', element: <HomePage /> },
          { path: '/acara/:slug', element: <AcaraDetailPage /> },
          
          // Rute User Terproteksi yang masih menggunakan Layout Publik
          { 
            element: <ProtectedRoute allowedRoles={['User', 'Admin']} />,
            children: [
                { path: '/agenda-saya', element: <AgendaSayaPage /> },
            ]
          }
        ]
      },

      // ====================================================
      // 3. HALAMAN ADMIN (Protected dengan Layout Admin)
      // ====================================================
      {
        path: '/admin',
        element: <ProtectedRoute allowedRoles={['Admin']} />, 
        children: [
          {
            element: <AdminLayout />, // Pastikan AdminLayout juga menggunakan <Outlet /> di dalamnya
            children: [
              { path: 'dashboard', element: <AdminDashboardPage /> },
              { path: 'kategori', element: <AdminKategoriPage /> },
              { path: 'validasi-penyelenggara', element: <AdminValidasiPenyelenggaraPage /> },
              { path: 'validasi-acara', element: <AdminValidasiAcaraPage /> },
            ]
          }
        ]
      },
      
      // Fallback untuk 404 (Opsional)
      { path: '*', element: <div className="text-center mt-20 font-bold">404 Not Found</div> }
    ]
  }
]);

const AppRouter = () => <RouterProvider router={router} />;
export default AppRouter;