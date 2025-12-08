// Frontend/src/pages/EventPage.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import publicApi from "../api/publicApi"; 
import eventTersimpanApi from "../api/eventTersimpanApi";
import Swal from 'sweetalert2';

// Sesuaikan URL storage Laravel Anda
const STORAGE_URL = "http://127.0.0.1:8000/storage/";

export default function EventPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("Semua Kategori");
  const [filterMonth, setFilterMonth] = useState("Bulan");
  const [savedEvents, setSavedEvents] = useState({});

  // Daftar Bulan untuk Dropdown
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  useEffect(() => {
    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await publicApi.getPublicAcara();
            const data = response.data.data ? response.data.data : response.data;
            setEvents(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchEvents();
    if (user) {
      checkAllBookmarks();
    }
  }, [user]);

  const checkAllBookmarks = async () => {
    try {
      const response = await eventTersimpanApi.getEventTersimpan();
      const saved = {};
      response.data.data.forEach(event => {
        saved[event.id] = true;
      });
      setSavedEvents(saved);
    } catch (error) {
      console.error("Error checking bookmarks:", error);
    }
  };

  const handleBookmarkClick = async (e, eventId) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      if (window.confirm("Anda harus login untuk menyimpan event. Login sekarang?")) {
        navigate('/login');
      }
      return;
    }

    try {
      if (savedEvents[eventId]) {
        await eventTersimpanApi.hapusEvent(eventId);
        setSavedEvents(prev => ({ ...prev, [eventId]: false }));
      } else {
        await eventTersimpanApi.simpanEvent(eventId);
        setSavedEvents(prev => ({ ...prev, [eventId]: true }));
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      alert(error.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  // Helper Format Tanggal
  const formatDate = (dateString) => {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return { day: '-', month: '-' };
        return {
            day: date.getDate(),
            month: date.toLocaleString('id-ID', { month: 'short' }).toUpperCase().replace('.', ''),
        };
    } catch (e) { return { day: '-', month: '-' }; }
  };

  // Filter Logic
  const filteredEvents = events.filter((event) => {
    // 1. Filter Search (Judul)
    const matchSearch = event.judul.toLowerCase().includes(search.toLowerCase());
    
    // 2. Filter Tipe (Kategori)
    const matchType = filterType === "Semua Kategori" || (event.kategori && event.kategori.nama_kategori === filterType);

    // 3. Filter Bulan (Baru)
    let matchMonth = true;
    if (filterMonth !== "Bulan") {
        const eventDate = new Date(event.waktu_mulai);
        const eventMonthName = eventDate.toLocaleString('id-ID', { month: 'long' });
        matchMonth = eventMonthName === filterMonth;
    }

    return matchSearch && matchType && matchMonth;
  });

  return (
    // pt-24 agar tidak tertutup Navbar fixed
    <div className="bg-gray-50 min-h-screen py-10 pt-24 font-sans"> 
      <div className="container mx-auto px-4">
        
        {/* Header & Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-[#1a1a2e]">Jelajahi Event</h1>
                    <p className="text-gray-500 mt-1">Temukan berbagai kegiatan menarik di kampus.</p>
                </div>
                <div className="text-sm text-gray-400 mt-2 md:mt-0">
                    Menampilkan <strong>{filteredEvents.length}</strong> acara
                </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
                {/* Input Search */}
                <div className="flex-grow relative">
                    <svg className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    <input 
                        type="text" 
                        placeholder="Cari nama event..." 
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#FF7F3E] focus:border-transparent outline-none transition text-gray-700"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                
                {/* Dropdown Filter Bulan */}
                <div className="relative min-w-[150px]">
                    <select 
                        className="w-full appearance-none px-4 py-3 pr-8 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#FF7F3E] outline-none bg-white cursor-pointer text-gray-700"
                        value={filterMonth}
                        onChange={(e) => setFilterMonth(e.target.value)}
                    >
                        <option value="Bulan">Semua Bulan</option>
                        {months.map((m) => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                    {/* Ikon Panah Bawah (Chevron Down) */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                </div>

                {/* Dropdown Filter Kategori */}
                <div className="relative min-w-[200px]">
                    <select 
                        className="w-full appearance-none px-4 py-3 pr-8 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#FF7F3E] outline-none bg-white cursor-pointer text-gray-700"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="Semua Kategori">Semua Kategori</option>
                        <option value="Seminar & Talkshow">Seminar</option>
                        <option value="Lomba & Kompetisi">Lomba</option>
                        <option value="Konser Musik">Konser</option>
                        <option value="Workshop & Pelatihan">Workshop</option>
                        <option value="Pameran & Expo">Pameran</option>
                    </select>
                    {/* Ikon Panah Bawah (Chevron Down) */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                </div>

            </div>
        </div>

        {/* Grid Event */}
        {loading ? (
            <div className="flex justify-center py-32">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#FF7F3E]"></div>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => {
                        const dateParts = formatDate(event.waktu_mulai);
                        const imageUrl = event.poster_url 
                            ? (event.poster_url.startsWith('http') ? event.poster_url : `${STORAGE_URL}${event.poster_url}`) 
                            : 'https://via.placeholder.com/400x200?text=No+Image';
                        
                        return (
                            <div key={event.id} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col border border-gray-100 group h-full transform hover:-translate-y-1">
                                <div className="relative h-48 bg-gray-200 overflow-hidden">
                                    <img 
                                        src={imageUrl} 
                                        alt={event.judul} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-700 pointer-events-none"
                                        onError={(e) => {e.target.src = 'https://via.placeholder.com/400x200?text=Image+Error'}} 
                                    />
                                    
                                    {/* Kategori Badge */}
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#1a1a2e] shadow-sm pointer-events-none">
                                        {event.kategori?.nama_kategori || 'Event'}
                                    </div>

                                    {/* Tombol Bookmark */}
                                    <button
                                        onClick={(e) => handleBookmarkClick(e, event.id)}
                                        className="absolute top-3 left-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all z-10"
                                        title={savedEvents[event.id] ? 'Hapus dari simpanan' : 'Simpan event'}
                                    >
                                        <svg 
                                            className="w-5 h-5 text-red-500" 
                                            fill={savedEvents[event.id] ? 'currentColor' : 'none'} 
                                            stroke="currentColor" 
                                            strokeWidth="2" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                                        </svg>
                                    </button>
                                </div>
                                
                                <div className="p-5 flex gap-4 flex-1 pointer-events-none">
                                    <div className="flex flex-col items-center min-w-[50px]">
                                        <span className="text-xs font-bold text-[#FF7F3E] uppercase tracking-wider">{dateParts.month}</span>
                                        <span className="text-2xl font-extrabold text-gray-800 leading-none mt-1">{dateParts.day}</span>
                                    </div>
                                    
                                    <div className="flex flex-col flex-1 border-l border-gray-100 pl-4">
                                        <h3 className="font-bold text-gray-900 line-clamp-2 mb-2 transition-colors leading-tight">
                                            {event.judul}
                                        </h3>
                                        
                                        <div className="mt-auto space-y-2 pointer-events-auto">
                                            <div className="flex items-center text-xs text-gray-500">
                                                <svg className="w-3.5 h-3.5 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                <span>{new Date(event.waktu_mulai).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})} WIB</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center text-xs text-gray-500">
                                                    <svg className="w-3.5 h-3.5 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                                    <span className="truncate w-24">{event.lokasi || 'Online'}</span>
                                                </div>
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
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
                                                                if (result.isConfirmed) navigate('/login');
                                                            });
                                                        } else {
                                                            navigate(`/acara/${event.slug}`);
                                                        }
                                                    }}
                                                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center transition-colors"
                                                >
                                                    Detail
                                                    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-full text-center py-20">
                        <div className="bg-white p-8 rounded-2xl border-2 border-dashed border-gray-200 inline-block max-w-md">
                             <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                             <h3 className="text-lg font-bold text-gray-900">Tidak ada acara ditemukan</h3>
                             <p className="text-gray-500 mt-2">Coba gunakan kata kunci lain atau ubah filter bulan/kategori.</p>
                             <button onClick={() => {setSearch(''); setFilterType('Semua Kategori'); setFilterMonth('Bulan')}} className="mt-4 text-[#FF7F3E] font-semibold hover:underline">
                                Reset Filter
                             </button>
                        </div>
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
}