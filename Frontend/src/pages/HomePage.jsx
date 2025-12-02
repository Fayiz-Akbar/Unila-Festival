import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import publicApi from "../api/publicApi"; 

// URL Backend untuk gambar
const STORAGE_URL = "http://localhost:8000/storage/";

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // State untuk Filter
  const [filterType, setFilterType] = useState("Tipe Acara");
  const [filterDay, setFilterDay] = useState("Hari"); // State baru untuk filter hari

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      if (!publicApi || typeof publicApi.getAcara !== 'function') {
         console.warn("API belum siap atau import salah");
         setEvents([]);
         return;
      }
      const response = await publicApi.getAcara();
      const data = response?.data?.data || response?.data || [];
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Gagal mengambil data acara:", error);
      setEvents([]); 
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) throw new Error("Invalid date");
        return {
            day: date.getDate(),
            month: date.toLocaleString('default', { month: 'short' }).toUpperCase(),
            full: date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        };
    } catch (e) {
        return { day: '-', month: '---', full: '-' };
    }
  };

  return (
    <div className="bg-white font-sans text-gray-800 w-full">
      
      {/* --- HERO SECTION --- */}
      <div 
        className="relative w-full overflow-hidden"
        style={{ backgroundColor: '#1a1a2e', height: '500px', minHeight: '500px' }}
      >
        <div className="absolute inset-0 opacity-40">
            <img 
                src="https://images.unsplash.com/photo-1459749411177-2a296581dca1?q=80&w=1470&auto=format&fit=crop" 
                alt="Concert Background" 
                className="w-full h-full object-cover"
            />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1221] to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center pt-10">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-4 drop-shadow-lg">
            <span className="text-[#FF7F3E]">Unila</span>Fest
          </h1>
          <p className="text-gray-200 max-w-xl text-lg mb-8 leading-relaxed drop-shadow-md">
            Platform resmi Universitas Lampung untuk mengelola, menemukan, dan merayakan setiap momen kemahasiswaan.
          </p>
          <button className="px-8 py-3 rounded-full border-2 border-white text-white font-medium hover:bg-white hover:text-[#0B1221] transition duration-300">
            Pelajari Lebih Lanjut
          </button>
        </div>
      </div>

      {/* --- SEARCH BAR FLOATING --- */}
      <div className="relative -mt-8 z-20 max-w-5xl mx-auto px-4 w-full">
        <div className="bg-[#1F2937] rounded-xl shadow-2xl p-2 flex items-center border border-gray-700">
            <div className="pl-4 text-gray-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input 
                type="text" 
                placeholder="Cari acara..." 
                className="w-full bg-transparent border-none text-white px-4 py-3 focus:ring-0 placeholder-gray-400 text-lg outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <button className="bg-[#FF7F3E] hover:bg-orange-600 text-white p-3 rounded-lg transition">
                Cari
            </button>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
            <h2 className="text-3xl font-bold text-[#1a1a2e]">Acara Mendatang</h2>
            
            <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                {/* FILTER HARI (SENIN - MINGGU) */}
                <select 
                    className="bg-[#F3F4F6] border-none text-sm font-medium text-gray-600 rounded-full px-4 py-2 cursor-pointer hover:bg-gray-200 outline-none"
                    value={filterDay}
                    onChange={(e) => setFilterDay(e.target.value)}
                >
                    <option>Hari</option>
                    <option value="Senin">Senin</option>
                    <option value="Selasa">Selasa</option>
                    <option value="Rabu">Rabu</option>
                    <option value="Kamis">Kamis</option>
                    <option value="Jumat">Jumat</option>
                    <option value="Sabtu">Sabtu</option>
                    <option value="Minggu">Minggu</option>
                </select>

                {/* FILTER KATEGORI (DITAMBAH PENYELENGGARA) */}
                <select 
                    className="bg-[#F3F4F6] border-none text-sm font-medium text-gray-600 rounded-full px-4 py-2 cursor-pointer hover:bg-gray-200 outline-none"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                >
                    <option>Tipe Acara</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Lomba">Lomba</option>
                    <option value="Penyelenggara">Penyelenggara</option>
                </select>
            </div>
        </div>

        {/* --- EVENTS GRID --- */}
        {loading ? (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF7F3E]"></div>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.length > 0 ? (
                    events.map((event) => {
                        const dateParts = formatDate(event.tanggal_mulai);
                        const imageUrl = event.poster ? `${STORAGE_URL}${event.poster}` : 'https://via.placeholder.com/400x200?text=No+Image';

                        return (
                            <Link to={`/acara/${event.id}`} key={event.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
                                <div className="relative h-48 overflow-hidden bg-gray-200">
                                    <img 
                                            src={imageUrl} 
                                            alt={event.nama_acara} 
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                                            onError={(e) => {e.target.src = 'https://via.placeholder.com/400x200?text=Image+Error'}}
                                    />
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#0B1221] shadow-sm">
                                        {event.kategori?.nama_kategori || 'Event'}
                                    </div>
                                </div>

                                <div className="p-5 flex gap-4 flex-1">
                                    <div className="flex flex-col items-center justify-start pt-1 min-w-[50px]">
                                        <span className="text-xs font-bold text-[#FF7F3E] uppercase tracking-wide">{dateParts.month}</span>
                                        <span className="text-2xl font-extrabold text-gray-900 leading-none mt-1">{dateParts.day}</span>
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#FF7F3E] transition-colors line-clamp-2 mb-2">
                                            {event.nama_acara}
                                        </h3>
                                        <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                                            {event.deskripsi || 'Tidak ada deskripsi.'}
                                        </p>
                                        <div className="flex items-center text-xs text-gray-400 mt-auto">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                            {event.lokasi || 'Online'}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                ) : (
                    <div className="col-span-full text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        Belum ada event yang tersedia saat ini.
                    </div>
                )}
            </div>
        )}

        {/* Load More Button */}
        {!loading && events.length > 0 && (
            <div className="flex justify-center mt-16">
                <button className="px-8 py-3 rounded-full border border-[#4F46E5] text-[#4F46E5] font-semibold hover:bg-[#4F46E5] hover:text-white transition duration-300">
                    Muat Lebih Banyak
                </button>
            </div>
        )}
      </div>
    </div>
  );
}