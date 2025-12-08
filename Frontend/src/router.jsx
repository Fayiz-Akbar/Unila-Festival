// Frontend/src/router.jsx
// (PJ 1 - GATEKEEPER) - Konfigurasi Router Utama

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';

// --- Components & Layouts ---
import ProtectedRoute from './components/Common/ProtectedRoute.jsx';
import AdminLayout from './components/Common/AdminLayout.jsx'; 
import Layout from './components/Common/Layout.jsx'; 

// --- Pages Publik/User ---
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import HomePage from './pages/HomePage.jsx';
import AcaraDetailPage from './pages/AcaraDetailPage.jsx';
import EventPage from './pages/EventPage.jsx'; // <-- Pastikan file ini ada

// --- Submission Pages (PJ 2) ---
import AjukanPenyelenggaraPage from './pages/AjukanPenyelenggarapage.jsx'; 
import AjukanAcaraPage from './pages/AjukanAcaraPage.jsx';

// --- Profile Pages ---
import ProfilePage from './pages/ProfilePage.jsx';
import EventTersimpanPage from './pages/EventTersimpanPage.jsx';
import KelolaEventPage from './pages/KelolaEventPage.jsx';

// --- Admin Pages (PJ 1) ---
import AdminDashboardPage from './pages/Admin/AdminDashboardPage.jsx';
import AdminKategoriPage from './pages/Admin/AdminKategoriPage.jsx';
import AdminValidasiPenyelenggaraPage from './pages/Admin/AdminValidasiPenyelenggaraPage.jsx';
import AdminValidasiAcaraPage from './pages/Admin/AdminValidasiAcaraPage.jsx';
import AdminManajemenAcaraPage from './pages/Admin/AdminManajemenAcaraPage.jsx';

const router = createBrowserRouter([
  {
    element: <App />, 
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      { path: '/reset-password', element: <ResetPasswordPage /> },

      {
        element: <Layout />, 
        children: [
          { path: '/', element: <HomePage /> },
          
          // Rute Jelajah Event (Untuk Guest & User)
          { path: '/acara', element: <EventPage /> }, 
          
          { path: '/acara/:slug', element: <AcaraDetailPage /> },
          
          // Rute Terproteksi
          { 
            element: <ProtectedRoute allowedRoles={['User', 'Admin']} />,
            children: [
                { path: '/profile', element: <ProfilePage /> },
                { path: '/event-tersimpan', element: <EventTersimpanPage /> },
                { path: '/kelola-event', element: <KelolaEventPage /> },
                { path: '/ajukan-penyelenggara', element: <AjukanPenyelenggaraPage /> },
                { path: '/ajukan-acara', element: <AjukanAcaraPage /> },
            ]
          }
        ]
      },

      {
        path: '/admin',
        // PERBAIKAN: Menambahkan 'admin' (kecil) agar cocok dengan data dari login
        element: <ProtectedRoute allowedRoles={['Admin', 'admin']} />, 
        children: [
          {
            element: <AdminLayout />, 
            children: [
              { path: 'dashboard', element: <AdminDashboardPage /> },
              { path: 'kategori', element: <AdminKategoriPage /> },
              { path: 'validasi-penyelenggara', element: <AdminValidasiPenyelenggaraPage /> },
              { path: 'validasi-acara', element: <AdminValidasiAcaraPage /> },
              { path: 'manajemen-acara', element: <AdminManajemenAcaraPage /> },
            ]
          }
        ]
      },
      
      { 
        path: '*', 
        element: (
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <h1 className="text-6xl font-bold text-gray-800">404</h1>
            <p className="text-xl text-gray-600 mt-4">Halaman tidak ditemukan</p>
            <a href="/" className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
              Kembali ke Beranda
            </a>
          </div>
        ) 
      }
    ]
  }
]);

const AppRouter = () => <RouterProvider router={router} />;
export default AppRouter;