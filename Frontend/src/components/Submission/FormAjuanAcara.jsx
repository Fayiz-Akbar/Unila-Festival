// Frontend/src/components/Submission/FormAjuanAcara.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import publicApi from '../../api/publicApi';      // Untuk ambil kategori
import submissionApi from '../../api/submissionApi'; // Untuk submit form

const FormAjuanAcara = () => {
  const navigate = useNavigate();
  
  // State untuk Data Form
  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    kategori_id: '', // Akan diisi dari dropdown
    lokasi: '',
    waktu_mulai: '',
    waktu_selesai: '',
    link_pendaftaran: '',
    poster: null // File gambar
  });

  // State untuk Data Kategori dari API
  const [kategoriList, setKategoriList] = useState([]);
  const [loadingKategori, setLoadingKategori] = useState(true);
  
  // State UI
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState(null);

  // 1. Fetch Data Kategori saat Component Mount
  useEffect(() => {
    const fetchKategori = async () => {
      try {
        setLoadingKategori(true);
        // Panggil API: GET /api/kategori
        const response = await publicApi.getAllKategori();
        // Pastikan response berupa array
        const data = Array.isArray(response.data) ? response.data : (response.data.data || []);
        setKategoriList(data);
      } catch (err) {
        console.error("Gagal ambil kategori:", err);
      } finally {
        setLoadingKategori(false);
      }
    };

    fetchKategori();
  }, []);

  // Handle Input Teks
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle Input File (Poster)
  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      poster: e.target.files[0]
    }));
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setError(null);

    // Validasi Sederhana
    if (!formData.judul || !formData.kategori_id || !formData.waktu_mulai) {
        setError("Mohon lengkapi judul, kategori, dan waktu mulai.");
        setLoadingSubmit(false);
        return;
    }

    try {
      // Siapkan FormData untuk upload file
      const data = new FormData();
      data.append('judul', formData.judul);
      data.append('deskripsi', formData.deskripsi);
      data.append('id_kategori', formData.kategori_id); // Sesuaikan nama field API
      data.append('lokasi', formData.lokasi);
      data.append('waktu_mulai', formData.waktu_mulai);
      data.append('waktu_selesai', formData.waktu_selesai);
      if (formData.link_pendaftaran) {
         data.append('link_pendaftaran', formData.link_pendaftaran);
      }
      if (formData.poster) {
         data.append('poster', formData.poster);
      }

      // Kirim ke Backend (POST /api/submission/acara)
      await submissionApi.createAcara(data);
      
      alert('Acara berhasil diajukan! Menunggu validasi admin.');
      navigate('/kelola-event');

    } catch (err) {
      console.error("Gagal submit acara:", err);
      // Tampilkan pesan error dari backend jika ada
      const msg = err.response?.data?.message || "Terjadi kesalahan saat mengirim data.";
      setError(msg);
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="p-6 md:p-8">
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Judul Acara */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Judul Acara <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            name="judul"
            value={formData.judul}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none"
            placeholder="Contoh: Seminar Nasional Teknologi 2025"
            required
          />
        </div>

        {/* Kategori & Lokasi (Grid 2 Kolom) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kategori Dropdown - DINAMIS */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori <span className="text-red-500">*</span></label>
            <select 
              name="kategori_id"
              value={formData.kategori_id}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 bg-white transition outline-none"
              required
              disabled={loadingKategori}
            >
              <option value="">-- Pilih Kategori --</option>
              {loadingKategori ? (
                <option disabled>Memuat kategori...</option>
              ) : (
                kategoriList.map((kat) => (
                  <option key={kat.id} value={kat.id}>
                    {kat.nama_kategori}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Lokasi */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Lokasi</label>
            <input 
              type="text" 
              name="lokasi"
              value={formData.lokasi}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition outline-none"
              placeholder="Gedung / Ruangan / Online"
            />
          </div>
        </div>

        {/* Waktu Mulai & Selesai */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Waktu Mulai <span className="text-red-500">*</span></label>
            <input 
              type="datetime-local" 
              name="waktu_mulai"
              value={formData.waktu_mulai}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Waktu Selesai</label>
            <input 
              type="datetime-local" 
              name="waktu_selesai"
              value={formData.waktu_selesai}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition outline-none"
            />
          </div>
        </div>

        {/* Deskripsi */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi Lengkap</label>
          <textarea 
            name="deskripsi"
            value={formData.deskripsi}
            onChange={handleChange}
            rows="5"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition outline-none"
            placeholder="Jelaskan detail acara Anda..."
          ></textarea>
        </div>

        {/* Link Pendaftaran (Opsional) */}
        <div>
           <label className="block text-sm font-semibold text-gray-700 mb-2">Link Pendaftaran (Google Form / Lainnya)</label>
           <input 
              type="url" 
              name="link_pendaftaran"
              value={formData.link_pendaftaran}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition outline-none"
              placeholder="https://forms.google.com/..."
           />
        </div>

        {/* Upload Poster */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Poster</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition cursor-pointer relative">
             <input 
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
             />
             <div className="space-y-2">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="text-sm text-gray-600">
                    {formData.poster ? (
                        <span className="text-green-600 font-medium">{formData.poster.name}</span>
                    ) : (
                        <span><span className="text-blue-600 font-medium hover:underline">Klik untuk upload</span> atau drag and drop</span>
                    )}
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, JPEG hingga 2MB</p>
             </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button 
            type="submit" 
            disabled={loadingSubmit}
            className={`w-full px-6 py-4 text-white font-bold rounded-xl shadow-lg transition transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
              ${loadingSubmit ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1a1a2e] hover:bg-gray-800'}`}
          >
            {loadingSubmit ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Mengirim...
              </span>
            ) : (
              'Ajukan Acara'
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default FormAjuanAcara;