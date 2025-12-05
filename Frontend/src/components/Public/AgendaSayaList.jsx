import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import registrationApi from '../../api/registrationApi';

// Sesuaikan URL storage backend
const STORAGE_URL = "http://127.0.0.1:8000/storage/";

const AgendaSayaList = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data saat komponen dimuat
  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      setLoading(true);
      const response = await registrationApi.getAgendaSaya();
      // Handle response structure Laravel
      const data = response.data.data ? response.data.data : response.data;
      setMyEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal mengambil agenda saya:", err);
      setError("Gagal memuat data. Pastikan Anda sudah login.");
    } finally {
      setLoading(false);
    }
  };

  // Helper Status Badge
  const getStatusBadge = (status) => {
    const styles = {
      Published: "bg-green-100 text-green-800 border-green-200",
      Approved: "bg-blue-100 text-blue-800 border-blue-200",
      Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Rejected: "bg-red-100 text-red-800 border-red-200",
      Draft: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.Draft}`}>
        {status}
      </span>
    );
  };

  if (loading) return (
    <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center border border-red-100">
        {error}
    </div>
  );

  if (myEvents.length === 0) return (
    <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
        <div className="mb-4 text-gray-300">
           <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900">Belum ada event yang Anda ikuti</h3>
        <p className="text-gray-500 mb-6">Daftar ke event menarik sekarang!</p>
        <Link to="/acara" className="px-6 py-3 bg-[#FF7F3E] text-white rounded-full font-bold hover:bg-orange-600 transition shadow-md">
            Jelajahi Event
        </Link>
    </div>
  );

  return (
    <div className="space-y-6">
      {myEvents.map((event) => {
        const imageUrl = event.poster_url 
            ? (event.poster_url.startsWith('http') ? event.poster_url : `${STORAGE_URL}${event.poster_url}`)
            : 'https://via.placeholder.com/150?text=No+Img';

        return (
          <div key={event.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col sm:flex-row">
            {/* Gambar Kecil */}
            <div className="sm:w-48 h-48 sm:h-auto bg-gray-200 relative shrink-0">
               <img src={imageUrl} alt={event.judul} className="w-full h-full object-cover" />
            </div>

            {/* Konten */}
            <div className="p-6 flex-1 flex flex-col justify-between">
               <div>
                  <div className="flex justify-between items-start mb-2">
                     <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{event.judul}</h3>
                     {getStatusBadge(event.status)}
                  </div>
                  
                  <div className="text-sm text-gray-500 space-y-1 mb-4">
                     <p className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        {new Date(event.waktu_mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                     </p>
                     <p className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        {event.lokasi}
                     </p>
                  </div>
               </div>

               {/* Action Buttons */}
               <div className="flex items-center gap-3 mt-2 pt-4 border-t border-gray-50">
                  <Link 
                    to={`/acara/${event.acara?.slug || event.slug}`} 
                    className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    Lihat Detail Event
                  </Link>
                  
                  <div className="flex-grow"></div>

                  <span className="text-xs text-gray-500">
                    Terdaftar pada: {new Date(event.created_at).toLocaleDateString('id-ID')}
                  </span>
               </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AgendaSayaList;