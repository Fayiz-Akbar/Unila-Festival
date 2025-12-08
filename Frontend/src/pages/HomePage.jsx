// Frontend/src/pages/HomePage.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { useAuth } from "../context/AuthContext";
import publicApi from "../api/publicApi"; 
import eventTersimpanApi from "../api/eventTersimpanApi";

// Sesuaikan URL storage Laravel Anda jika nanti ada upload manual
const STORAGE_URL = "http://127.0.0.1:8000/storage/";

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [savedEvents, setSavedEvents] = useState({}); // Track saved events by ID
  
  // State untuk Filter
  const [filterType, setFilterType] = useState("Tipe Acara");
  const [filterMonth, setFilterMonth] = useState("Bulan"); 

  // State untuk Load More
  const [visibleCount, setVisibleCount] = useState(15); // Tampilkan awal 15

  // Daftar Bulan
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  useEffect(() => {
    fetchEvents();
    if (user) {
      checkAllBookmarks();
    }
  }, [user]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await publicApi.getPublicAcara();
      const data = response.data.data ? response.data.data : response.data;
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Gagal mengambil data acara:", error);
      setEvents([]); 
    } finally {
      setLoading(false);
    }
  };

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
        if (!dateString) throw new Error("No date");
        const date = new Date(dateString);
        if (isNaN(date.getTime())) throw new Error("Invalid date");
        
        return {
            day: date.getDate(),
            month: date.toLocaleString('id-ID', { month: 'short' }).toUpperCase().replace('.', ''),
            full: date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        };
    } catch (e) {
        return { day: '-', month: '---', full: '-' };
    }
  };

  // Filter Logic
  const filteredEvents = events.filter((event) => {
    const matchSearch = event.judul.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "Tipe Acara" || (event.kategori && event.kategori.nama_kategori.includes(filterType));
    
    let matchMonth = true;
    if (filterMonth !== "Bulan") {
        const eventDate = new Date(event.waktu_mulai);
        const eventMonthName = eventDate.toLocaleString('id-ID', { month: 'long' });
        matchMonth = eventMonthName === filterMonth;
    }
    
    return matchSearch && matchType && matchMonth;
  });

  const displayedEvents = filteredEvents.slice(0, visibleCount);
  const hasMoreEvents = filteredEvents.length > visibleCount;
  
  const handleLoadMore = () => {
    setVisibleCount(prevCount => prevCount + 5);
  };

  // FUNGSI SCROLL KE BAWAH
  const scrollToContent = () => {
    const element = document.getElementById('acara-mendatang');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white font-sans text-gray-800 w-full min-h-screen flex flex-col">
      
      {/* --- HERO SECTION (UPDATED) --- */}
      <div className="relative w-full h-[600px] overflow-hidden">
        {/* 1. Background Image */}
        <img 
            src="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1974&auto=format&fit=crop" 
            alt="Concert Crowd" 
            className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* 2. Overlay Gradien */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/90 via-[#1e1b4b]/80 to-[#ea580c]/30"></div>
        
        {/* 3. Konten Hero */}
        <div className="relative z-10 flex flex-col justify-center h-full container mx-auto px-6 lg:px-12 text-white pt-20">
          <div className="max-w-3xl">
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 drop-shadow-lg leading-tight">
                <span className="text-[#FF7F3E]">Unila</span>Fest
              </h1>
              
              <p className="text-lg md:text-2xl text-gray-100 mb-10 leading-relaxed font-light border-l-4 border-[#FF7F3E] pl-6">
                Platform resmi Universitas Lampung untuk mengelola, menemukan, dan merayakan setiap momen kemahasiswaan.
              </p>
              
              {/* TOMBOL SCROLL */}
              <button 
                onClick={scrollToContent}
                className="inline-flex items-center px-8 py-4 rounded-full bg-[#FF7F3E] text-white font-bold text-lg hover:bg-orange-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-orange-500/50 group"
              >
                Pelajari Lebih Lanjut
                {/* Ikon Panah Bawah (Animasi Bounce) */}
                <svg className="w-5 h-5 ml-2 group-hover:animate-bounce mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                </svg>
              </button>
          </div>
        </div>
      </div>

      {/* --- SEARCH BAR FLOATING --- */}
      <div className="relative -mt-8 z-20 max-w-5xl mx-auto px-4 w-full">
        <div className="bg-white rounded-xl shadow-2xl p-2 flex items-center border border-gray-100">
            <div className="pl-4 text-gray-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input 
                type="text" 
                placeholder="Cari acara..." 
                className="w-full bg-transparent border-none text-gray-700 px-4 py-3 focus:ring-0 placeholder-gray-400 text-lg outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <button className="bg-[#FF7F3E] hover:bg-orange-600 text-white px-8 py-3 rounded-lg transition font-bold shadow-md">
                Cari
            </button>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      {/* ID DITAMBAHKAN DI SINI: id="acara-mendatang" */}
      <div id="acara-mendatang" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full flex-grow scroll-mt-24">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
            <h2 className="text-3xl font-bold text-[#1a1a2e] border-b-4 border-[#FF7F3E] pb-1">Acara Mendatang</h2>
            
            <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
                
                {/* FILTER BULAN */}
                <div className="relative min-w-[150px]">
                    <select 
                        className="w-full appearance-none bg-[#F3F4F6] border-none text-sm font-medium text-gray-600 rounded-full pl-4 pr-10 py-2 cursor-pointer hover:bg-gray-200 outline-none transition-colors"
                        value={filterMonth}
                        onChange={(e) => setFilterMonth(e.target.value)}
                    >
                        <option value="Bulan">Semua Bulan</option>
                        {months.map((m) => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                </div>

                {/* FILTER KATEGORI */}
                <div className="relative min-w-[160px]">
                    <select 
                        className="w-full appearance-none bg-[#F3F4F6] border-none text-sm font-medium text-gray-600 rounded-full pl-4 pr-10 py-2 cursor-pointer hover:bg-gray-200 outline-none transition-colors"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="Tipe Acara">Semua Tipe</option>
                        <option value="Seminar & Talkshow">Seminar</option>
                        <option value="Lomba & Kompetisi">Lomba</option>
                        <option value="Konser Musik">Konser</option>
                        <option value="Workshop & Pelatihan">Workshop</option>
                        <option value="Pameran & Expo">Pameran</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                </div>
            </div>
        </div>

        {/* --- EVENTS GRID --- */}
        {loading ? (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF7F3E]"></div>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedEvents.length > 0 ? (
                    displayedEvents.map((event) => {
                        const dateParts = formatDate(event.waktu_mulai); 
                        const imageUrl = event.poster_url 
                            ? (event.poster_url.startsWith('http') ? event.poster_url : `${STORAGE_URL}${event.poster_url}`) 
                            : 'https://via.placeholder.com/400x200?text=No+Image';

                        return (
                            <div key={event.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 flex flex-col h-full">
                                {/* Image Container */}
                                <div className="relative h-48 overflow-hidden bg-gray-200">
                                    <img 
                                        src={imageUrl} 
                                        alt={event.judul} 
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700 pointer-events-none"
                                        onError={(e) => {e.target.src = 'https://via.placeholder.com/400x200?text=Image+Error'}}
                                    />
                                    {/* Overlay Gelap saat Hover */}
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-300 pointer-events-none"></div>
                                    
                                    {/* Kategori Badge */}
                                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#1a1a2e] shadow-sm pointer-events-none">
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

                                {/* Content Container */}
                                <div className="p-5 flex gap-4 flex-1 pointer-events-none">
                                    {/* Date Badge */}
                                    <div className="flex flex-col items-center justify-start pt-1 min-w-[50px]">
                                        <span className="text-xs font-bold text-[#FF7F3E] uppercase tracking-wide">{dateParts.month}</span>
                                        <span className="text-2xl font-extrabold text-gray-900 leading-none mt-1">{dateParts.day}</span>
                                    </div>

                                    {/* Text Content */}
                                    <div className="flex-1 flex flex-col">
                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#FF7F3E] transition-colors line-clamp-2 mb-2 leading-snug">
                                            {event.judul}
                                        </h3>
                                        <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                                            {event.deskripsi || 'Tidak ada deskripsi.'}
                                        </p>
                                        
                                        {/* Footer Card */}
                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 pointer-events-auto">
                                            <div className="flex items-center text-xs text-gray-500">
                                                <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                                <span className="truncate max-w-[120px]">{event.lokasi || 'Online'}</span>
                                            </div>
                                            <Link to={`/acara/${event.slug}`} className="text-xs font-bold text-[#4F46E5] flex items-center group-hover:translate-x-1 transition-transform hover:text-blue-800">
                                                Detail 
                                                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-full text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <p className="text-xl font-bold text-gray-900">Tidak ada event yang ditemukan</p>
                        <p className="text-gray-500 mt-2">Coba ubah filter atau kata kunci pencarian Anda.</p>
                    </div>
                )}
            </div>
        )}

        {/* Load More Button */}
        {!loading && hasMoreEvents && (
            <div className="flex justify-center mt-20">
                <button 
                    onClick={handleLoadMore}
                    className="px-10 py-4 rounded-full bg-white border-2 border-[#4F46E5] text-[#4F46E5] font-bold hover:bg-[#4F46E5] hover:text-white transition-all shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-1"
                >
                    Muat Lebih Banyak Event
                </button>
            </div>
        )}
      </div>
    </div>
  );
}