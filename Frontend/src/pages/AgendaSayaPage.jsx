import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import registrationApi from "../api/registrationApi";
import AgendaSayaList from "../components/Public/AgendaSayaList";
import { FaCalendarAlt, FaHistory, FaTicketAlt } from "react-icons/fa";

// --- DATA DUMMY (Agar UI langsung terlihat "ramai" dan kompleks) ---
const DUMMY_DATA = [
  {
    id: 1,
    judul: "Workshop UI/UX Design Modern 2025",
    slug: "workshop-ui-ux",
    waktu_mulai: "2025-12-20 09:00:00",
    lokasi: "Gedung A Fakultas Teknik",
    kategori: { nama_kategori: "Workshop" },
    penyelenggara: { nama_penyelenggara: "HIMAKOM Unila" },
    // Gambar placeholder berkualitas tinggi
    poster_url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 2,
    judul: "Seminar Nasional Kewirausahaan Digital",
    slug: "seminar-kewirausahaan",
    waktu_mulai: "2025-12-25 08:00:00",
    lokasi: "GSG Universitas Lampung",
    kategori: { nama_kategori: "Seminar" },
    penyelenggara: { nama_penyelenggara: "BEM Unila" },
    poster_url: "https://images.unsplash.com/photo-1475721027760-f75b137d9866?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 3,
    judul: "Lomba Coding Mahasiswa Tingkat Nasional",
    slug: "lomba-coding",
    waktu_mulai: "2024-10-10 10:00:00", // Tanggal lewat (akan masuk ke Tab 'Riwayat Selesai')
    lokasi: "Laboratorium Terpadu",
    kategori: { nama_kategori: "Lomba" },
    penyelenggara: { nama_penyelenggara: "UKM Programming" },
    poster_url: "https://images.unsplash.com/photo-1504384308090-c54be3852f33?auto=format&fit=crop&w=1000&q=80"
  }
];

export default function AgendaSayaPage() {
  const navigate = useNavigate();

  // KITA PAKAI DUMMY DATA SEBAGAI DEFAULT
  const [agendaList, setAgendaList] = useState(DUMMY_DATA); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming"); // 'upcoming' atau 'past'

  useEffect(() => {
    const fetchAgenda = async () => {
      try {
        setLoading(true);
        // Kita coba ambil data asli, tapi...
        const response = await registrationApi.getAgendaSaya();
        
        // ...KITA GABUNGKAN dengan data dummy supaya tampilan tidak kosong
        const combinedData = [...response.data, ...DUMMY_DATA];
        
        setAgendaList(combinedData);
        setError(null);
      } catch (err) {
        console.error("Gagal ambil data, menggunakan data dummy:", err);
        // Jika gagal load (misal belum login), tetap tampilkan dummy data
        setAgendaList(DUMMY_DATA); 
      } finally {
        setLoading(false);
      }
    };
    fetchAgenda();
  }, [navigate]);

  // --- LOGIKA FILTERING (Memisahkan Akan Datang vs Selesai) ---
  const now = new Date();
  // Filter sederhana: Tahun 2025 dianggap 'Akan Datang' untuk keperluan demo
  const upcomingEvents = agendaList.filter(acara => new Date(acara.waktu_mulai) >= now || acara.waktu_mulai.includes('2025'));
  const pastEvents = agendaList.filter(acara => new Date(acara.waktu_mulai) < now && !acara.waktu_mulai.includes('2025'));

  const displayList = activeTab === "upcoming" ? upcomingEvents : pastEvents;

  // Komponen Statistik Kecil
  const StatBox = ({ label, count, icon, color }) => (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 transform hover:scale-105 transition-transform duration-300">
      <div className={`p-3 rounded-lg ${color} text-white text-xl shadow-md`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{count}</p>
        <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">{label}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      
      {/* --- HEADER DASHBOARD (Aesthetic Curved & Gradient) --- */}
      <div className="bg-secondary-900 text-white pt-12 pb-28 px-6 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
         {/* Dekorasi Blob Abstrak di Background */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
         <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

        <div className="container mx-auto relative z-10">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-3 tracking-tight">Agenda Saya</h1>
          <p className="text-purple-200 max-w-2xl text-lg">
            Kelola jadwal kegiatan dan tiket acara Anda di sini. Pantau semua aktivitas akademik dan non-akademikmu.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-20 relative z-10">
        {/* --- BARIS STATISTIK --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatBox 
            label="Total Terdaftar" 
            count={agendaList.length} 
            icon={<FaTicketAlt />} 
            color="bg-gradient-to-br from-primary-500 to-purple-600" 
          />
          <StatBox 
            label="Akan Datang" 
            count={upcomingEvents.length} 
            icon={<FaCalendarAlt />} 
            color="bg-gradient-to-br from-blue-500 to-cyan-600" 
          />
          <StatBox 
            label="Selesai / Riwayat" 
            count={pastEvents.length} 
            icon={<FaHistory />} 
            color="bg-gradient-to-br from-gray-500 to-slate-600" 
          />
        </div>

        {/* --- AREA KONTEN UTAMA --- */}
        <div className="bg-white rounded-2xl shadow-xl min-h-[500px] overflow-hidden border border-gray-100 flex flex-col">
          
          {/* TAB NAVIGASI */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`flex-1 py-5 text-sm font-bold uppercase tracking-wide transition-all duration-300 flex items-center justify-center gap-2 relative
                ${activeTab === "upcoming" 
                  ? "text-primary-700 bg-purple-50" 
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
            >
              <FaCalendarAlt /> Acara Akan Datang
              {activeTab === "upcoming" && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary-600 rounded-t-full"></div>}
            </button>
            
            <button
              onClick={() => setActiveTab("past")}
              className={`flex-1 py-5 text-sm font-bold uppercase tracking-wide transition-all duration-300 flex items-center justify-center gap-2 relative
                ${activeTab === "past" 
                  ? "text-gray-800 bg-gray-100" 
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
            >
               <FaHistory /> Riwayat Selesai
               {activeTab === "past" && <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-600 rounded-t-full"></div>}
            </button>
          </div>

          {/* DAFTAR KARTU ACARA */}
          <div className="p-6 md:p-8 bg-gray-50/30 flex-grow">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center py-20 text-gray-400">
                <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
                Memuat agenda...
              </div>
            ) : (
              /* Kita kirim props 'isHistory' agar List bisa menyesuaikan tampilan */
              <AgendaSayaList agendaList={displayList} isHistory={activeTab === "past"} />
            )}
          </div>

        </div>
      </div>
    </div>
  );
}