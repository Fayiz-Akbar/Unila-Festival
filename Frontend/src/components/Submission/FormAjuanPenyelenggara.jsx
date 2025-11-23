import { useState } from "react";
import { submissionApi } from "../../api/submissionApi"; 
// Menggunakan komponen umum dari PJ 1 (Common)
import Input from "../Common/Input";
import Button from "../Common/button"; // Note: Sesuai file upload Anda 'button.jsx' huruf kecil

export default function FormAjuanPenyelenggara() {
  const [form, setForm] = useState({
    nama_penyelenggara: "",
    deskripsi: "",
    alamat: "",
    no_telp: "",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Handle perubahan input text
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle file input
  const handleFileChange = (e) => {
    setLogoFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!logoFile) {
      alert("Mohon upload logo organisasi Anda.");
      return;
    }

    setLoading(true);
    setMessage(null);

    // Bungkus data ke FormData karena ada file
    const formData = new FormData();
    formData.append("nama_penyelenggara", form.nama_penyelenggara);
    formData.append("deskripsi", form.deskripsi);
    formData.append("alamat", form.alamat);
    formData.append("no_telp", form.no_telp);
    formData.append("logo", logoFile);

    try {
      await submissionApi.submitPenyelenggara(formData);
      setMessage({ type: "success", text: "Pengajuan Berhasil! Mohon tunggu validasi admin." });
      setForm({ nama_penyelenggara: "", deskripsi: "", alamat: "", no_telp: "" }); // Reset
      setLogoFile(null);
    } catch (error) {
      console.error("Gagal submit:", error);
      const errorMsg = error.response?.data?.message || "Terjadi kesalahan saat mengirim data.";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Formulir Pengajuan Mitra</h3>
      
      {message && (
        <div className={`p-3 mb-4 rounded text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Menggunakan Input Component dari Common */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Penyelenggara / Organisasi</label>
          <Input 
            name="nama_penyelenggara"
            value={form.nama_penyelenggara} 
            onChange={handleChange} 
            placeholder="Contoh: BEM Unila" 
            required 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Singkat</label>
          <textarea
            name="deskripsi"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            value={form.deskripsi}
            onChange={handleChange}
            placeholder="Jelaskan tentang organisasi Anda..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">No. Telepon / WA</label>
            <Input 
              name="no_telp"
              value={form.no_telp} 
              onChange={handleChange} 
              placeholder="08xxxx" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Sekretariat</label>
            <Input 
              name="alamat"
              value={form.alamat} 
              onChange={handleChange} 
              placeholder="Gedung..." 
              required 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Logo Organisasi</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG (Max. 2MB)</p>
        </div>

        <div className="pt-2">
          <Button type="submit" disabled={loading} className="w-full md:w-auto">
            {loading ? "Sedang Mengirim..." : "Ajukan Sekarang"}
          </Button>
        </div>
      </form>
    </div>
  );
}