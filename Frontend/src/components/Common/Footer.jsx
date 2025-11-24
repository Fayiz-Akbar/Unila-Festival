// Frontend/src/components/Common/Footer.jsx
// (PJ 1 - GATEKEEPER) - Footer Dark Mode Sesuai Mockup

import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    // Background #1A202C (secondary), Teks Putih/Abu
    <footer className="bg-secondary text-white pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          
          {/* KOLOM 1: BRANDING & TAGLINE (Lebar 5 kolom) */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="inline-block">
              <h3 className="text-4xl font-extrabold tracking-tight">
                <span className="text-primary">Unila</span>
                <span className="text-white">Fest</span>
              </h3>
            </Link>
            <p className="text-gray-400 leading-relaxed max-w-sm">
              Platform resmi Universitas Lampung untuk mengelola, menemukan, dan merayakan setiap momen kemahasiswaan. Dari seminar hingga konser, semua ada di sini.
            </p>
            {/* Social Media Icons */}
            <div className="flex space-x-5 mt-6">
              <SocialLink href="#" icon="📸" label="Instagram" />
              <SocialLink href="#" icon="🐦" label="Twitter" />
              <SocialLink href="#" icon="▶️" label="Youtube" />
              <SocialLink href="#" icon="🎵" label="TikTok" />
            </div>
          </div>

          {/* KOLOM 2: NAVIGASI (Lebar 3 kolom) */}
          <div className="md:col-span-3">
            <h4 className="text-lg font-bold text-white mb-6 uppercase tracking-wider text-sm">Jelajahi</h4>
            <ul className="space-y-3 text-gray-400">
              <li><FooterLink to="/">Semua Event</FooterLink></li>
              <li><FooterLink to="/kategori">Kategori Lomba</FooterLink></li>
              <li><FooterLink to="/kategori">Seminar Nasional</FooterLink></li>
              <li><FooterLink to="/ajukan-penyelenggara">Jadi Mitra Penyelenggara</FooterLink></li>
            </ul>
          </div>

          {/* KOLOM 3: HUBUNGI KAMI (Lebar 4 kolom) */}
          <div className="md:col-span-4">
            <h4 className="text-lg font-bold text-white mb-6 uppercase tracking-wider text-sm">Hubungi Kami</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start">
                <span className="mr-3 mt-1 text-primary">📍</span>
                <span>
                  Gedung Rektorat Universitas Lampung,<br/>
                  Jl. Prof. Dr. Ir. Sumantri Brojonegoro No.1,<br/>
                  Bandar Lampung, 35145
                </span>
              </li>
              <li className="flex items-center">
                <span className="mr-3 text-primary">📧</span>
                <a href="mailto:humas@unilafest.ac.id" className="hover:text-primary transition">humas@unilafest.ac.id</a>
              </li>
              <li className="flex items-center">
                <span className="mr-3 text-primary">📞</span>
                <span>(0721) 701609</span>
              </li>
            </ul>
          </div>

        </div>

        {/* GARIS PEMBATAS & COPYRIGHT */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} UnilaFest. Developed by Tim Unila.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Helper Components untuk Footer agar kode rapi
const FooterLink = ({ to, children }) => (
  <Link to={to} className="hover:text-primary transition-colors duration-200 flex items-center group">
    <span className="w-0 group-hover:w-2 h-0.5 bg-primary mr-0 group-hover:mr-2 transition-all duration-300"></span>
    {children}
  </Link>
);

const SocialLink = ({ href, icon, label }) => (
  <a 
    href={href} 
    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-xl hover:bg-primary hover:text-white transition-all duration-300 transform hover:-translate-y-1"
    aria-label={label}
  >
    {icon}
  </a>
);