// Frontend/src/pages/AcaraDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import publicApi from '../api/publicApi';
import { useAuth } from '../context/AuthContext'; // Import Auth Context

const STORAGE_URL = "http://127.0.0.1:8000/storage/";

const AcaraDetailPage = () => {
  const { slug } = useParams(); 
  const { user, loading: authLoading } = useAuth(); // Cek User & Loading status Auth
  const navigate = useNavigate();
  
  const [acara, setAcara] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch detail acara
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const response = await publicApi.getAcaraDetailBySlug(slug);
        setAcara(response.data);
      } catch (err) {
        console.error("Gagal mengambil detail acara:", err);
        setError("Acara tidak ditemukan atau terjadi kesalahan.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchDetail();
    }
  }, [slug]);

  // Tampilkan loading jika sedang fetch data
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (error || !acara) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Oops!</h2>
        <p className="text-gray-600 mb-8 text-lg">{error || "Acara yang Anda cari tidak ditemukan."}</p>
        <Link to="/" className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition shadow-lg font-medium">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  // Data Formatting (Sama seperti sebelumnya)
  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
      time: date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
    };
  };

  const mulai = formatDateTime(acara.waktu_mulai);
  const selesai = formatDateTime(acara.waktu_selesai);
  const posterUrl = acara.poster_url 
    ? (acara.poster_url.startsWith('http') ? acara.poster_url : `${STORAGE_URL}${acara.poster_url}`)
    : 'https://via.placeholder.com/800x400?text=No+Poster';

  // ... (SISA KODE RENDER UI SAMA PERSIS DENGAN SEBELUMNYA)
  // Silakan copy bagian return dari file AcaraDetailPage.jsx sebelumnya
  // Mulai dari: return (<div className="bg-gray-50 ... 
  
  // (Saya tulis ulang bagian return agar lengkap dan mudah dicopy)
  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800 pb-20 pt-20"> 
      
      {/* --- Header / Navbar Sederhana (OPSIONAL: Bisa dihapus jika sudah pakai Layout) --- */}
      {/* Karena di router sudah dibungkus Layout, ini bisa dihapus atau disesuaikan */}
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tombol Kembali */}
        <div className="mb-6">
             <Link to="/" className="inline-flex items-center text-gray-500 hover:text-blue-600 transition font-medium">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Kembali ke Daftar Event
             </Link>
        </div>

        {/* --- Bagian Judul & Poster --- */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Poster Image Banner */}
          <div className="relative w-full h-64 md:h-96 bg-gray-800 group">
             <img 
                src={posterUrl} 
                alt={acara.judul} 
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition duration-500"
                onError={(e) => {e.target.src = 'https://via.placeholder.com/800x400?text=Image+Error'}}
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
             
             <div className="absolute top-6 left-6">
                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                  {acara.kategori?.nama_kategori || 'Umum'}
                </span>
             </div>
          </div>

          {/* Konten Utama */}
          <div className="px-6 py-8 md:px-10 md:py-10">
             <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
               {acara.judul}
             </h1>

             {/* Grid Info */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-b border-gray-100 py-8 mb-8">
                {/* Waktu */}
                <div className="flex items-start">
                   <div className="p-3 bg-orange-50 rounded-xl text-orange-500 mr-4">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                   </div>
                   <div>
                      <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-1">Waktu Pelaksanaan</p>
                      <p className="font-medium text-gray-900">{mulai.date}</p>
                      <p className="text-gray-500 text-sm">{mulai.time} - {selesai.time}</p>
                   </div>
                </div>
                {/* Lokasi */}
                <div className="flex items-start">
                   <div className="p-3 bg-blue-50 rounded-xl text-blue-500 mr-4">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                   </div>
                   <div>
                      <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-1">Lokasi</p>
                      <p className="font-medium text-gray-900">{acara.lokasi}</p>
                   </div>
                </div>
                {/* Penyelenggara */}
                <div className="flex items-start">
                   <div className="p-3 bg-green-50 rounded-xl text-green-500 mr-4">
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 01 1v5m-4 0h4" /></svg>
                   </div>
                   <div>
                      <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-1">Penyelenggara</p>
                      <p className="font-medium text-gray-900">{acara.penyelenggara?.nama_penyelenggara || 'Panitia'}</p>
                   </div>
                </div>
             </div>

             {/* Deskripsi */}
             <div className="mb-10">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Deskripsi Acara</h3>
                <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
                  {acara.deskripsi}
                </div>
             </div>

             {/* Tombol Aksi */}
             <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t border-gray-100">
                {acara.link_pendaftaran ? (
                   user ? (
                     <a 
                       href={acara.link_pendaftaran} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="flex-1 text-center px-8 py-4 bg-[#FF7F3E] hover:bg-orange-600 text-white font-bold rounded-xl transition transform hover:-translate-y-1 shadow-lg shadow-orange-200"
                     >
                       Daftar Sekarang
                     </a>
                   ) : (
                     <button 
                       onClick={() => {
                         if (window.confirm("Anda harus login untuk mendaftar event ini. Login sekarang?")) {
                           navigate('/login');
                         }
                       }}
                       className="flex-1 text-center px-8 py-4 bg-[#FF7F3E] hover:bg-orange-600 text-white font-bold rounded-xl transition transform hover:-translate-y-1 shadow-lg shadow-orange-200"
                     >
                       Daftar Sekarang
                     </button>
                   )
                ) : (
                   <button disabled className="flex-1 px-8 py-4 bg-gray-300 text-gray-500 font-bold rounded-xl cursor-not-allowed">
                     Pendaftaran Belum Dibuka
                   </button>
                )}
             </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AcaraDetailPage;