import React, { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import Swal from "sweetalert2";

export default function AdminManajemenAcaraPage() {
  const [acaraList, setAcaraList] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 1. Fetch Data ---
  const fetchAcara = async () => {
    try {
      const response = await axiosClient.get("/admin/manajemen-acara");
      // Debugging: Cek di console browser untuk memastikan data masuk
      console.log("Data Acara:", response.data); 
      setAcaraList(response.data);
    } catch (error) {
      console.error("Gagal memuat data acara:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcara();
  }, []);

  // --- 2. Helper Functions (Perbaikan Logic) ---
  
  // LOGIC JUDUL: Prioritas ambil 'judul' (dari Seeder) lalu 'nama_acara'
  const getTitle = (item) => {
    return item.judul || item.nama_acara || "Tanpa Judul";
  };

  // LOGIC GAMBAR: Menangani Data Dummy (URL) vs Data Upload (Storage)
  const getPoster = (item) => {
    // 1. Cek apakah ada 'poster_url' (Data dari Seeder/Unsplash)
    if (item.poster_url && item.poster_url.startsWith('http')) {
        return item.poster_url;
    }
    
    // 2. Cek apakah ada 'poster' (Data Upload Manual)
    if (item.poster) {
        // Jika upload manual, kita harus tambahkan URL server di depannya
        return `http://localhost:8000/storage/${item.poster}`;
    }

    // 3. Gambar Default jika kosong
    return "https://via.placeholder.com/150?text=No+Image";
  };

  // Logic Tanggal
  const getDate = (item) => {
    const dateStr = item.waktu_mulai || item.tanggal_mulai || item.created_at;
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  // --- 3. Action Handlers ---

  const handleHapus = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Permanen?",
      text: "Data acara akan hilang selamanya!",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal"
    });

    if (result.isConfirmed) {
      try {
        await axiosClient.delete(`/admin/manajemen-acara/${id}`);
        Swal.fire("Terhapus", "Data acara dihapus.", "success");
        fetchAcara();
      } catch (error) {
        Swal.fire("Gagal", "Terjadi kesalahan menghapus data.", "error");
      }
    }
  };

  // --- 4. Render UI ---

  if (loading) return <div className="p-8 text-center text-gray-500">Memuat data...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Acara Aktif</h1>
          <p className="text-gray-500 text-sm mt-1">
            Kontrol penuh acara yang sedang tayang (Data Seeder & Upload).
          </p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium border border-blue-100">
          Total Aktif: <span className="font-bold">{acaraList.length}</span>
        </div>
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider w-1/3">Detail Acara</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Penyelenggara</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Lokasi & Waktu</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {acaraList.length > 0 ? (
                acaraList.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    
                    {/* Kolom 1: Gambar & Judul */}
                    <td className="px-6 py-4">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                          <img 
                            src={getPoster(item)} 
                            alt="Poster" 
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=Error"; }}
                          />
                        </div>
                        <div className="flex flex-col justify-center">
                          <h3 className="font-bold text-gray-900 text-sm line-clamp-2 leading-snug">
                            {getTitle(item)}
                          </h3>
                          <span className="mt-1 inline-flex self-start px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                            {item.kategori?.nama_kategori || "Umum"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Kolom 2: Penyelenggara */}
                    <td className="px-6 py-4 align-middle">
                      <div className="text-sm font-medium text-gray-900">
                        {item.penyelenggara?.nama_penyelenggara || "Internal"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.status || "Status -"}
                      </div>
                    </td>

                    {/* Kolom 3: Lokasi */}
                    <td className="px-6 py-4 align-middle">
                      <div className="text-sm text-gray-700 mb-1">
                        <i className="fa-solid fa-location-dot mr-2 text-gray-400"></i>
                        {item.lokasi || "Online"}
                      </div>
                      <div className="text-xs text-gray-500">
                        <i className="fa-regular fa-calendar mr-2 text-gray-400"></i>
                        {getDate(item)}
                      </div>
                    </td>

                    {/* Kolom 4: Aksi (Hapus Saja) */}
                    <td className="px-6 py-4 align-middle text-center">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleHapus(item.id)}
                          className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100 transition text-xs font-bold"
                          title="Hapus Permanen"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center">
                      <i className="fa-solid fa-folder-open text-3xl mb-2 text-gray-300"></i>
                      <p>Belum ada acara aktif.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}