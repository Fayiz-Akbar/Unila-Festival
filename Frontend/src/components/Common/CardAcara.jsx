// Frontend/src/components/Common/CardAcara.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import eventTersimpanApi from '../../api/eventTersimpanApi'; 

const CardAcara = ({ acara }) => {
  const { user } = useAuth(); 
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoadingBookmark, setIsLoadingBookmark] = useState(false);

  // Cek status bookmark saat component mount
  useEffect(() => {
    if (user && acara.id) {
      checkBookmarkStatus();
    }
  }, [user, acara.id]);

  const checkBookmarkStatus = async () => {
    try {
      const response = await eventTersimpanApi.checkEvent(acara.id);
      setIsSaved(response.data.is_saved);
      console.log('Bookmark status for event', acara.id, ':', response.data.is_saved);
    } catch (error) {
      console.error('Error checking bookmark:', error);
      // Jika error (misal belum login), set ke false
      setIsSaved(false);
    }
  };

  const handleBookmarkClick = async (e) => {
    e.stopPropagation(); // Prevent card click
    console.log('BOOKMARK CLICKED!', acara.id);
    
    if (!user) {
      if (window.confirm("Anda harus login untuk menyimpan event. Login sekarang?")) {
        navigate('/login');
      }
      return;
    }

    setIsLoadingBookmark(true);
    try {
      if (isSaved) {
        await eventTersimpanApi.hapusEvent(acara.id);
        setIsSaved(false);
      } else {
        await eventTersimpanApi.simpanEvent(acara.id);
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      alert(error.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setIsLoadingBookmark(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const imageUrl = acara.poster_url 
    ? (acara.poster_url.startsWith('http') ? acara.poster_url : `http://127.0.0.1:8000/storage/${acara.poster_url}`) 
    : 'https://via.placeholder.com/400x300?text=No+Poster';

  // --- LOGIKA UTAMA ---
  const handleDetailClick = () => {
    if (!user) {
      // Jika Guest: Tampilkan Konfirmasi Login
      if (window.confirm("Anda harus login untuk melihat detail acara ini. Login sekarang?")) {
        navigate('/login');
      }
    } else {
      // Jika User: Lanjut ke Detail
      navigate(`/acara/${acara.slug}`);
    }
  };

  console.log('CardAcara rendered - NEW VERSION', acara.id);

  return (
    // Ubah dari Link ke div, dan pasang onClick di sini
    <div 
        onClick={handleDetailClick}
        className="group bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden transition-all duration-300 flex flex-col h-full cursor-pointer"
    >
      {/* Bagian Gambar */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-200">
        <img
          src={imageUrl}
          alt={acara.judul}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {e.target.src = 'https://via.placeholder.com/400x200?text=Image+Error'}}
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#0B1221] shadow-sm">
          {acara.kategori?.nama_kategori || 'Event'}
        </div>
      </div>

      {/* Bagian Konten */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center text-xs text-gray-500 mb-2 space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{formatDate(acara.waktu_mulai)}</span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
          {acara.judul}
        </h3>

        <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-grow">
          {truncateText(acara.deskripsi, 100)}
        </p>

        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            {/* Icon Lokasi */}
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate max-w-[120px]">{acara.lokasi || 'Online'}</span>
            
            {/* TEST - Tombol Bookmark */}
            <button
              onClick={handleBookmarkClick}
              disabled={isLoadingBookmark}
              className="flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-orange-50 rounded transition-all disabled:opacity-50"
              title={isSaved ? 'Hapus dari simpanan' : 'Simpan event'}
            >
              <svg className={`w-4 h-4 ${isSaved ? 'text-[#FF7F3E]' : 'text-gray-500'}`} fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
              </svg>
              <span className="text-gray-700 font-medium">Simpan</span>
            </button>
          </div>
          
          {/* Tombol Detail (Hanya visual, klik ditangani div utama) */}
          <span className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center transition-colors">
            Detail
            <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
};

export default CardAcara;