import { useState, useEffect } from "react";
import publicApi from "../api/publicApi";
import AcaraList from "../components/Public/AcaraList";
import SearchFilter from "../components/Public/SearchFilter";
// Import ikon untuk visual yang lebih menarik
import { FaUniversity, FaUsers, FaCalendarCheck } from "react-icons/fa";

export default function HomePage() {
  const [acaraList, setAcaraList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State untuk filter
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("");

  useEffect(() => {
    const fetchAcara = async () => {
      try {
        setLoading(true);
        const response = await publicApi.getPublicAcara();
        setAcaraList(response.data);
        setError(null);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
        setError("Gagal mengambil data acara.");
      } finally {
        setLoading(false);
      }
    };
    fetchAcara();
  }, []);

  // Logika Filter Client-side
  const filteredAcara = acaraList.filter((acara) => {
    const matchSearch = acara.judul.toLowerCase().includes(searchTerm.toLowerCase());
    const matchKategori = !selectedKategori ? true : acara.id_kategori === parseInt(selectedKategori);
    return matchSearch && matchKategori;
  });

  // Komponen Kartu Statistik (Visual Candy)
  const StatCard = ({ icon, number, label }) => (
    <div className="flex flex-col items-center p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg">
      <div className="text-3xl text-purple-200 mb-2">{icon}</div>
      <div className="text-2xl font-bold text-white">{number}</div>
      <div className="text-xs text-purple-100 uppercase tracking-wider font-medium">{label}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* --- HERO SECTION (PROFESIONAL) --- */}
      <div className="relative bg-secondary-900 text-white overflow-hidden">
        {/* Background Abstract */}
        <div className="absolute inset-0 opacity-20">
           <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary-500 blur-[100px]"></div>
           <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-purple-800 blur-[120px]"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 pt-20 pb-32 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-sm mb-6 backdrop-blur-sm">
            🎉 Platform Event Terbesar di Unila
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
            Temukan Potensi <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Kembangkan Diri
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Satu pintu untuk semua kegiatan mahasiswa. Seminar, workshop, lomba, dan festival seni di Universitas Lampung.
          </p>

          {/* Statistik Row */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-8">
            <StatCard icon={<FaCalendarCheck />} number="150+" label="Event Aktif" />
            <StatCard icon={<FaUsers />} number="12K+" label="Mahasiswa" />
            <StatCard icon={<FaUniversity />} number="60+" label="Organisasi" />
          </div>
        </div>

        {/* Wave Divider SVG */}
        <div className="absolute bottom-0 left-0 w-full leading-none text-slate-50">
          <svg className="relative block w-full h-[80px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
          </svg>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="container mx-auto px-6 pb-24">
        
        {/* SEARCH & FILTER (FLOATING) */}
        <div className="-mt-24 relative z-20 mb-16">
          <div className="bg-white p-2 rounded-2xl shadow-xl border border-gray-100">
             <SearchFilter 
                onSearchChange={setSearchTerm}
                onKategoriChange={setSelectedKategori}
             />
          </div>
        </div>

        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-3xl font-bold text-secondary-900">Jelajahi Acara</h2>
            <p className="text-gray-500 mt-1">Jangan lewatkan kesempatan emas minggu ini.</p>
          </div>
          <span className="mt-4 md:mt-0 px-4 py-2 bg-purple-50 text-primary-700 rounded-lg text-sm font-semibold">
            Menampilkan {filteredAcara.length} Acara
          </span>
        </div>

        {/* LIST ACARA */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
             <div className="w-16 h-16 border-4 border-purple-100 border-t-primary-600 rounded-full animate-spin mb-4"></div>
             <p className="text-gray-400 font-medium animate-pulse">Sedang memuat data...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-8 rounded-xl text-center border border-red-100">
            <p className="font-bold text-lg">Terjadi Kesalahan</p>
            <p>{error}</p>
          </div>
        ) : (
          /* AcaraList ini akan merender CardAcara kawan Anda */
          <AcaraList acaraList={filteredAcara} />
        )}
      </div>
    </div>
  );
}