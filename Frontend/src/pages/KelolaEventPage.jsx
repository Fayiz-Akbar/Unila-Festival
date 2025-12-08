import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import submissionApi from '../api/submissionApi';
import { useAuth } from '../context/AuthContext';

const STORAGE_URL = "http://127.0.0.1:8000/storage/";

const KelolaEventPage = () => {
  const { user, isPenyelenggara } = useAuth();
  const navigate = useNavigate();
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Redirect jika bukan penyelenggara dan bukan Admin
    if (!isPenyelenggara && user?.peran !== 'Admin') {
      navigate('/');
      return;
    }
    fetchMyEvents();
  }, [isPenyelenggara, user, navigate]);

  const fetchMyEvents = async () => {
    try {
      setLoading(true);
      const response = await submissionApi.getAcaraMilikUser();
      const data = response.data.data ? response.data.data : response.data;
      setMyEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal mengambil event:", err);
      setError(err.response?.data?.message || "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus event ini?")) {
      try {
        await submissionApi.deleteAcara(id);
        setMyEvents(myEvents.filter(event => event.id !== id));
      } catch (err) {
        alert("Gagal menghapus event.");
      }
    }
  };

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

  return (
    <div className="bg-gray-50 min-h-screen py-12 pt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#1a1a2e]">Kelola Event</h1>
            <p className="text-gray-600 mt-1">
              Halo <span className="font-semibold text-[#FF7F3E]">{user?.nama || 'Penyelenggara'}</span>, kelola semua event yang Anda buat di sini.
            </p>
          </div>
          
          <Link 
            to="/ajukan-acara" 
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-[#1a1a2e] hover:bg-gray-800 transition-all transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Buat Event Baru
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-lg text-center border border-red-100">
            <p>{error}</p>
            <button
              onClick={fetchMyEvents}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Coba Lagi
            </button>
          </div>
        ) : myEvents.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
            <div className="mb-4 text-gray-300">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Belum ada event yang dibuat</h3>
            <p className="text-gray-500 mb-6">Mulai buat event pertamamu sekarang!</p>
            <Link to="/ajukan-acara" className="px-6 py-3 bg-[#FF7F3E] text-white rounded-full font-bold hover:bg-orange-600 transition shadow-md">
              + Buat Event Baru
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {myEvents.map((event) => {
              const imageUrl = event.poster_url 
                ? (event.poster_url.startsWith('http') ? event.poster_url : `${STORAGE_URL}${event.poster_url}`)
                : 'https://via.placeholder.com/150?text=No+Img';

              return (
                <div key={event.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col sm:flex-row">
                  {/* Gambar */}
                  <div className="sm:w-48 h-48 sm:h-auto bg-gray-200 relative shrink-0">
                    <img 
                      src={imageUrl} 
                      alt={event.judul} 
                      className="w-full h-full object-cover" 
                      onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=Error"; }}
                    />
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
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          {new Date(event.waktu_mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                        <p className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                          {event.lokasi}
                        </p>
                      </div>

                      {/* --- UPDATE: Tampilkan Alasan Penolakan --- */}
                      {event.status === 'Rejected' && event.catatan_admin_acara && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-start">
                                <svg className="w-5 h-5 text-red-500 mr-2 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                </svg>
                                <div>
                                    <p className="text-xs font-bold text-red-700 uppercase mb-0.5">Alasan Penolakan:</p>
                                    <p className="text-sm text-red-600 leading-snug">{event.catatan_admin_acara}</p>
                                </div>
                            </div>
                        </div>
                      )}
                      {/* ------------------------------------------- */}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 mt-2 pt-4 border-t border-gray-50">
                      <Link 
                        to={`/acara/${event.slug}`} 
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        Lihat Halaman
                      </Link>
                      
                      <div className="flex-grow"></div>

                      <button 
                        disabled 
                        className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-lg cursor-not-allowed"
                        title="Fitur edit akan segera hadir"
                      >
                        Edit
                      </button>
                      
                      <button 
                        onClick={() => handleDelete(event.id)}
                        className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default KelolaEventPage;