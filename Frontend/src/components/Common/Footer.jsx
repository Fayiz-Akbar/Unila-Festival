// Frontend/src/components/Common/Footer.jsx
// (PJ 1 - GATEKEEPER) - Footer Dark Mode dengan Logo Brand SVG

import React from 'react';
import { Link } from 'react-router-dom';

// --- Komponen Logo SVG (Icon Brand Resmi) ---

const FacebookLogo = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const XLogo = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramLogo = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.468 2.53c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
  </svg>
);

const YouTubeLogo = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

// --- Main Component ---

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
            
            {/* Social Media Icons dengan Logo SVG */}
            <div className="flex space-x-4 mt-6">
              <SocialLink href="#" icon={<InstagramLogo />} label="Instagram" />
              <SocialLink href="#" icon={<XLogo />} label="X (Twitter)" />
              <SocialLink href="#" icon={<FacebookLogo />} label="Facebook" />
              <SocialLink href="#" icon={<YouTubeLogo />} label="Youtube" />
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
                <span className="mr-3 mt-1 text-primary"></span>
                <span>
                  Gedung Rektorat Universitas Lampung,<br/>
                  Jl. Prof. Dr. Ir. Sumantri Brojonegoro No.1,<br/>
                  Bandar Lampung, 35145
                </span>
              </li>
              <li className="flex items-center">
                <span className="mr-3 text-primary"></span>
                <a href="mailto:fayizakbar26@gmail.com" className="hover:text-primary transition">fayizakbar26@gmail.com</a>
              </li>
              <li className="flex items-center">
                <span className="mr-3 text-primary"></span>
                <span>081273849256</span>
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
    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-primary hover:text-white transition-all duration-300 transform hover:-translate-y-1"
    aria-label={label}
  >
    {icon}
  </a>
);