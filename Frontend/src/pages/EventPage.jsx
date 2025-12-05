// Frontend/src/pages/EventPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import publicApi from "../api/publicApi"; 

// Sesuaikan URL storage Laravel Anda
const STORAGE_URL = "http://127.0.0.1:8000/storage/";

export default function EventPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("Semua Kategori");

  // State untuk Kategori (Opsional: Ambil dari API agar dinamis)
  // const [categories, setCategories] = useState([]);

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
  }, []);

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
    const matchSearch = event.judul.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "Semua Kategori" || (event.kategori && event.kategori.nama_kategori === filterType);
    return matchSearch && matchType;
  });

  return (
    // PERBAIKAN DI SINI: Tambahkan 'pt-24' (padding top) agar tidak tertutup Navbar
    <div className="bg-gray-50 min-h-screen py-10 pt-24"> 
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
                <div className="flex-grow relative">
                    <svg className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    <input 
                        type="text" 
                        placeholder="Cari nama event..." 
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#FF7F3E] focus:border-transparent outline-none transition"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select 
                    className="px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#FF7F3E] outline-none bg-white min-w-[200px] cursor-pointer"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                >
                    <option>Semua Kategori</option>
                    <option value="Seminar & Talkshow">Seminar</option>
                    <option value="Lomba & Kompetisi">Lomba</option>
                    <option value="Konser Musik">Konser</option>
                    <option value="Workshop & Pelatihan">Workshop</option>
                    <option value="Pameran & Expo">Pameran</option>
                </select>
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
                            <Link to={`/acara/${event.slug}`} key={event.id} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col border border-gray-100 group h-full transform hover:-translate-y-1">
                                <div className="relative h-48 bg-gray-200 overflow-hidden">
                                    <img 
                                        src={imageUrl} 
                                        alt={event.judul} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                                        onError={(e) => {e.target.src = 'https://via.placeholder.com/400x200?text=Image+Error'}} 
                                    />
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#1a1a2e] shadow-sm">
                                        {event.kategori?.nama_kategori || 'Event'}
                                    </div>
                                </div>
                                
                                <div className="p-5 flex gap-4 flex-1">
                                    <div className="flex flex-col items-center min-w-[50px]">
                                        <span className="text-xs font-bold text-[#FF7F3E] uppercase tracking-wider">{dateParts.month}</span>
                                        <span className="text-2xl font-extrabold text-gray-800 leading-none mt-1">{dateParts.day}</span>
                                    </div>
                                    
                                    <div className="flex flex-col flex-1 border-l border-gray-100 pl-4">
                                        <h3 className="font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-[#FF7F3E] transition-colors leading-tight">
                                            {event.judul}
                                        </h3>
                                        
                                        <div className="mt-auto space-y-2">
                                            <div className="flex items-center text-xs text-gray-500">
                                                <svg className="w-3.5 h-3.5 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                <span>{new Date(event.waktu_mulai).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})} WIB</span>
                                            </div>
                                            <div className="flex items-center text-xs text-gray-500">
                                                <svg className="w-3.5 h-3.5 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                                <span className="truncate w-40">{event.lokasi || 'Online'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                ) : (
                    <div className="col-span-full text-center py-20">
                        <div className="bg-white p-8 rounded-2xl border-2 border-dashed border-gray-200 inline-block max-w-md">
                             <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                             <h3 className="text-lg font-bold text-gray-900">Tidak ada acara ditemukan</h3>
                             <p className="text-gray-500 mt-2">Coba gunakan kata kunci lain atau ubah filter kategori.</p>
                             <button onClick={() => {setSearch(''); setFilterType('Semua Kategori')}} className="mt-4 text-[#FF7F3E] font-semibold hover:underline">
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