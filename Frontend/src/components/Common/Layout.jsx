// Frontend/src/components/Common/Layout.jsx
// (PJ 1 - GATEKEEPER) - Layout Utama untuk Halaman Publik

import React from 'react';
import Navbar from './Navbar'; 
import Footer from './Footer'; 
import { Outlet } from 'react-router-dom'; // WAJIB: Import Outlet

const Layout = () => {
  return (
    // Menggunakan flex-col dan min-h-screen agar footer selalu di bawah
    <div className="flex flex-col min-h-screen bg-bgbody text-textmain">
      
      {/* 1. Navbar (Sticky) */}
      <header className="sticky top-0 z-30">
        <Navbar />
      </header>

      {/* 2. Konten Utama (Render Halaman Anak di sini) */}
      {/* flex-1 akan mengisi ruang kosong yang tersisa */}
      <main className="flex-1 w-full">
        {/* <Outlet /> adalah tempat di mana HomePage, AcaraDetailPage, dll akan muncul */}
        <Outlet />
      </main>

      {/* 3. Footer */}
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;