import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 

const CardAcara = ({ acara }) => {
  const { user } = useAuth(); 
  const navigate = useNavigate();

  // --- Helper: Format Tanggal ---
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // --- Helper: Potong Teks Deskripsi ---
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // --- LOGIKA BARU PENENTU GAMBAR ---
  const getImageUrl = (item) => {
    // Ambil value dari kolom poster_url (satu-satunya kolom gambar di DB)
    const url = item.poster_url;

    // 1. Jika kosong/null, pakai placeholder
    if (!url) {
      return 'https://via.placeholder.com/400x300?text=No+Poster';
    }

    // 2. Jika string dimulai dengan "http", berarti ini link dari Seeder/Internet
    if (url.startsWith('http')) {
      return url;
    }

    // 3. Jika tidak, berarti ini Path Upload (contoh: "posters/file.jpg")
    // Kita harus tambahkan URL backend di depannya
    return `http://localhost:8000/storage/${url}`;
  };

  const imageUrl = getImageUrl(acara);

  // --- Logic Klik Card ---
  const handleDetailClick = () => {
    navigate(`/acara/${acara.slug}`);
  };

  return (
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
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = 'https://via.placeholder.com/400x200?text=Image+Error';
          }}
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
          <div className="flex items-center text-xs text-gray-500">
             <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
             </svg>
             <span className="truncate max-w-[100px]">{acara.lokasi || 'Online'}</span>
          </div>
          
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