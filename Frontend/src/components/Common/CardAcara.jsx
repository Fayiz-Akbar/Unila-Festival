import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import eventTersimpanApi from '../../api/eventTersimpanApi'; 
import Swal from 'sweetalert2'; // Pastikan library ini sudah diinstall

const STORAGE_URL = "http://127.0.0.1:8000/storage/";

const CardAcara = ({ acara }) => {
  const { user } = useAuth(); 
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoadingBookmark, setIsLoadingBookmark] = useState(false);

  // --- Helper: Format Tanggal ---
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // --- Helper: Potong Teks ---
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // --- Helper: URL Gambar Cerdas ---
  const getImageUrl = (item) => {
    const url = item.poster_url;
    // Fallback jika kosong
    if (!url) return 'https://via.placeholder.com/400x300?text=No+Poster';
    
    // Jika link eksternal (http...)
    if (url.startsWith('http')) return url;
    
    // Jika upload lokal
    return `${STORAGE_URL}${url}`;
  };

  const imageUrl = getImageUrl(acara);

  // --- 1. Cek Bookmark Status (Hanya jika user login) ---
  useEffect(() => {
    if (user && acara.id) {
      checkBookmarkStatus();
    }
  }, [user, acara.id]);

  const checkBookmarkStatus = async () => {
    try {
      const response = await eventTersimpanApi.checkEvent(acara.id);
      setIsSaved(response.data.is_saved); 
    } catch (error) {
      // Silent error (misal token expired atau guest)
      setIsSaved(false);
    }
  };

  // --- 2. Handle Klik Bookmark ---
  const handleBookmarkClick = async (e) => {
    e.stopPropagation(); // Agar tidak men-trigger klik card

    // Jika Guest: Tampilkan Alert (Tanpa Paksa Pindah)
    if (!user) {
      Swal.fire({
        icon: 'info',
        title: 'Simpan Event?',
        text: 'Fitur simpan hanya untuk pengguna yang login.',
        showCancelButton: true,
        confirmButtonText: 'Login',
        cancelButtonText: 'Tutup',
        confirmButtonColor: '#FF7F3E',
      }).then((result) => {
        if (result.isConfirmed) navigate('/login');
      });
      return;
    }

    // Jika User: Proses Simpan/Hapus
    setIsLoadingBookmark(true);
    try {
      if (isSaved) {
        await eventTersimpanApi.hapusEvent(acara.id);
        setIsSaved(false);
        // Toast kecil di pojok (tidak mengganggu)
        const Toast = Swal.mixin({
          toast: true, position: 'top-end', showConfirmButton: false, timer: 1500
        });
        Toast.fire({ icon: 'success', title: 'Dihapus dari simpanan' });
      } else {
        await eventTersimpanApi.simpanEvent(acara.id);
        setIsSaved(true);
        const Toast = Swal.mixin({
          toast: true, position: 'top-end', showConfirmButton: false, timer: 1500
        });
        Toast.fire({ icon: 'success', title: 'Event berhasil disimpan' });
      }
    } catch (error) {
      console.error('Error bookmark:', error);
      Swal.fire({ icon: 'error', title: 'Gagal', text: 'Terjadi kesalahan saat menyimpan event.' });
    } finally {
      setIsLoadingBookmark(false);
    }
  };

  // --- 3. Handle Klik Detail ---
  const handleDetailClick = () => {
    if (!acara || !acara.slug) {
      console.error('CardAcara: Acara tidak memiliki slug', acara);
      alert('Event tidak valid');
      return;
    }
    
    // Jika guest, tampilkan SweetAlert untuk login
    if (!user) {
      Swal.fire({
        icon: 'warning',
        title: 'Akses Terbatas',
        text: 'Anda harus login untuk melihat detail dan mendaftar acara ini.',
        showCancelButton: true,
        confirmButtonText: 'Login Sekarang',
        cancelButtonText: 'Lihat-lihat Dulu',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
      return;
    }
    
    // Jika sudah login, langsung ke detail
    navigate(`/acara/${acara.slug}`);
  };

  if (!acara) return null;

  return (
    <div 
        className="group bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 flex flex-col h-full relative"
    >
      {/* Bagian Gambar */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-200">
        <img
          src={imageUrl}
          alt={acara.judul}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = 'https://via.placeholder.com/400x200?text=Image+Error';
          }}
        />
        
        {/* Kategori Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#0B1221] shadow-sm z-10">
          {acara.kategori?.nama_kategori || 'Event'}
        </div>

        {/* Tombol Bookmark - Hanya tampil jika sudah login */}
        {user && (
          <button
            onClick={handleBookmarkClick}
            disabled={isLoadingBookmark}
            className="absolute top-3 left-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all disabled:opacity-50 z-20 hover:scale-110"
            title={isSaved ? 'Hapus dari simpanan' : 'Simpan event'}
          >
            {isSaved ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-500">
                <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500 hover:text-red-500 transition-colors">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Bagian Konten */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center text-xs text-gray-500 mb-2 space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{formatDate(acara.waktu_mulai)}</span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight transition-colors group-hover:text-blue-600">
          {acara.judul}
        </h3>

        <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-grow">
          {truncateText(acara.deskripsi, 100)}
        </p>

        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate max-w-[150px]">{acara.lokasi || 'Online'}</span>
          </div>
          
          {/* Tombol Detail */}
          <button
            onClick={handleDetailClick}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center transition-colors"
          >
            Detail
            <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardAcara;