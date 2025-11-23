import { useState, useEffect } from "react";
import { submissionApi } from "../../api/submissionApi";
// Kita butuh publicApi untuk ambil daftar kategori (tugas PJ 3/1, tapi kita pakai di sini)
import { publicApi } from "../../api/publicApi"; 
import Input from "../Common/Input";
import Button from "../Common/button";

export default function FormAjuanAcara() {
  const [kategoriList, setKategoriList] = useState([]);
  const [form, setForm] = useState({
    nama_acara: "",
    deskripsi: "",
    tanggal_mulai: "",
    tanggal_selesai: "",
    lokasi: "",
    kategori_id: "",
    harga_tiket: 0,
    kuota: 0,
  });
  const [posterFile, setPosterFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Fetch Kategori saat komponen dimuat
  useEffect(() => {
    const fetchKategori = async () => {
      try {
        // Asumsi publicApi sudah ada method getKategori
        // Jika belum ada, minta PJ 1/3 buatkan atau sementara hardcode dulu
        const res = await publicApi.getKategori(); 
        setKategoriList(res.data);
      } catch (err) {
        console.error("Gagal ambil kategori", err);
      }
    };
    fetchKategori();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setPosterFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!posterFile) {
      alert("Wajib upload poster acara!");
      return;
    }

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    // Loop semua field form ke formData
    Object.keys(form).forEach(key => formData.append(key, form[key]));
    formData.append("poster", posterFile);

    try {
      await submissionApi.submitAcara(formData);
      setMessage({ type: "success", text: "Acara berhasil diajukan! Tunggu persetujuan admin." });
      // Reset form simple
      setForm({ ...form, nama_acara: "", deskripsi: "" }); 
      setPosterFile(null);
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: error.response?.data?.message || "Gagal mengajukan acara." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Buat Acara Baru</h3>
      
      {message && (
        <div className={`p-3 mb-4 rounded text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Judul */}
        <div>
          <label className="block text-sm font-medium mb-1">Nama Acara</label>
          <Input name="nama_acara" value={form.nama_acara} onChange={handleChange} required />
        </div>

        {/* Kategori Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-1">Kategori</label>
          <select 
            name="kategori_id" 
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            required
          >
            <option value="">Pilih Kategori</option>
            {kategoriList.map((kat) => (
              <option key={kat.id} value={kat.id}>{kat.nama_kategori}</option>
            ))}
          </select>
        </div>

        {/* Tanggal Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tanggal Mulai</label>
            <Input type="date" name="tanggal_mulai" onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tanggal Selesai</label>
            <Input type="date" name="tanggal_selesai" onChange={handleChange} required />
          </div>
        </div>

        {/* Lokasi & Harga */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Lokasi</label>
            <Input name="lokasi" value={form.lokasi} onChange={handleChange} placeholder="Gedung Serba Guna..." required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Harga Tiket (Rp)</label>
            <Input type="number" name="harga_tiket" value={form.harga_tiket} onChange={handleChange} min="0" required />
          </div>
        </div>

        {/* Kuota & Poster */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Kuota Peserta</label>
            <Input type="number" name="kuota" value={form.kuota} onChange={handleChange} min="1" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Poster Acara</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm" required />
          </div>
        </div>

        {/* Deskripsi */}
        <div>
          <label className="block text-sm font-medium mb-1">Deskripsi Lengkap</label>
          <textarea 
            name="deskripsi" 
            rows="4" 
            className="w-full px-3 py-2 border rounded-md" 
            onChange={handleChange} 
            required
          ></textarea>
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Mengirim..." : "Terbitkan Acara"}
        </Button>
      </form>
    </div>
  );
}