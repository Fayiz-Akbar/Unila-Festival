import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import publicApi from "../api/publicApi";
import registrationApi from "../api/registrationApi";
// Menggunakan ikon profesional
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaClock, FaShareAlt, FaTicketAlt } from 'react-icons/fa';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

export default function AcaraDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [acara, setAcara] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerMessage, setRegisterMessage] = useState("");

  useEffect(() => {
    const fetchAcaraDetail = async () => {
      try {
        setLoading(true);
        const response = await publicApi.getAcaraDetailBySlug(slug);
        setAcara(response.data);
      } catch (err) {
        setError("Gagal mengambil data acara.");
      } finally {
        setLoading(false);
      }
    };
    fetchAcaraDetail();
  }, [slug]);

  const handleDaftar = async () => {
    setIsRegistering(true);
    setRegisterMessage("");
    try {
      const response = await registrationApi.daftarKeAcara(acara.id);
      setRegisterMessage({ type: 'success', text: response.data.message });
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login", { state: { message: "Login dulu yuk untuk mendaftar!" } });
      } else {
        setRegisterMessage({ type: 'error', text: err.response?.data?.message || "Gagal mendaftar." });
      }
    } finally {
      setIsRegistering(false);
    }
  };

  // Helper Format Tanggal (Menggunakan date-fns sesuai standar kawan Anda)
  const formatDate = (dateStr, fmt) => {
    if (!dateStr) return "-";
    return format(new Date(dateStr), fmt, { locale: localeId });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
  if (!acara) return <div className="min-h-screen flex items-center justify-center text-gray-500">Acara tidak ditemukan</div>;

  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-sans">
      
      {/* --- HEAD: BACKDROP IMAGE --- */}
      <div className="relative w-full h-[350px] bg-secondary-900 overflow-hidden">
        {acara.poster_url && (
          <img 
            src={acara.poster_url} 
            alt="Background" 
            className="w-full h-full object-cover opacity-40 blur-lg scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-black/30"></div>
      </div>

      {/* --- CONTENT CONTAINER --- */}
      <div className="container mx-auto px-4 sm:px-6 -mt-64 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* == KOLOM KIRI (Poster & Deskripsi) == */}
          <div className="lg:col-span-2 space-y-8">
            {/* Poster Utama */}
            <div className="bg-white p-2 rounded-2xl shadow-2xl">
              <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden group">
                {acara.poster_url ? (
                  <img src={acara.poster_url} alt={acara.judul} className="w-full h-full object-contain bg-black/5" />
                ) : (
                   <div className="flex flex-col items-center justify-center h-full text-gray-400">
                     <FaTicketAlt className="text-4xl mb-2 opacity-50"/>
                     <span>Poster Belum Tersedia</span>
                   </div>
                )}
                {/* Badge Kategori */}
                <div className="absolute top-4 left-4">
                   <span className="bg-primary-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg uppercase tracking-wider">
                     {acara.kategori?.nama_kategori}
                   </span>
                </div>
              </div>
            </div>

            {/* Deskripsi Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-2xl font-bold text-secondary-900 mb-6 border-b pb-4">Tentang Acara</h3>
              <div className="prose prose-purple max-w-none text-gray-600 whitespace-pre-line leading-relaxed">
                {acara.deskripsi}
              </div>
            </div>
          </div>

          {/* == KOLOM KANAN (Sidebar Sticky) == */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              
              {/* Kartu Informasi Utama */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border-t-4 border-primary-500">
                <h1 className="text-2xl font-extrabold text-gray-800 mb-6 leading-tight">{acara.judul}</h1>
                
                <div className="space-y-5 mb-8">
                  <InfoRow icon={<FaCalendarAlt />} label="Tanggal" value={formatDate(acara.waktu_mulai, 'eeee, d MMMM yyyy')} />
                  <InfoRow icon={<FaClock />} label="Waktu" value={`${formatDate(acara.waktu_mulai, 'HH:mm')} - ${formatDate(acara.waktu_selesai, 'HH:mm')} WIB`} />
                  <InfoRow icon={<FaMapMarkerAlt />} label="Lokasi" value={acara.lokasi} />
                  <InfoRow icon={<FaUsers />} label="Penyelenggara" value={acara.penyelenggara?.nama_penyelenggara} />
                </div>

                <button 
                  onClick={handleDaftar}
                  disabled={isRegistering}
                  className="w-full bg-gradient-to-r from-primary-600 to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-primary-500/30 hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {isRegistering ? "Sedang Memproses..." : "Daftar Sekarang"}
                </button>

                {registerMessage && (
                  <div className={`mt-4 p-3 rounded-lg text-sm text-center font-medium ${registerMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {registerMessage.text}
                  </div>
                )}
              </div>

              {/* Tombol Share Mockup */}
              <button className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-primary-600 transition-colors py-3 border border-dashed border-gray-300 rounded-xl bg-white hover:bg-gray-50 font-medium">
                <FaShareAlt /> Bagikan ke Teman
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Komponen Baris Info Kecil
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-4">
    <div className="mt-1 text-primary-600 text-lg bg-purple-50 p-2.5 rounded-lg">{icon}</div>
    <div>
      <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-0.5">{label}</p>
      <p className="text-gray-800 font-semibold leading-tight">{value}</p>
    </div>
  </div>
);