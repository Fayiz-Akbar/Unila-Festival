import { useState } from "react";
import submissionApi from "../../api/submissionApi"; 
// Menggunakan komponen umum dari PJ 1 (Common)
import Input from "../Common/Input";
import Button from "../Common/button"; // Note: Sesuai file upload Anda 'button.jsx' huruf kecil

export default function FormAjuanPenyelenggara() {
  const [form, setForm] = useState({
    nama_penyelenggara: "",
    tipe: "Internal",
    deskripsi_singkat: "",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [buktiFile, setBuktiFile] = useState(null);
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

  // Handle bukti file input
  const handleBuktiFileChange = (e) => {
    setBuktiFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!logoFile) {
      alert("Mohon upload logo organisasi Anda.");
      return;
    }

    if (!buktiFile) {
      alert("Mohon upload bukti organisasi Anda.");
      return;
    }

    setLoading(true);
    setMessage(null);

    // Bungkus data ke FormData karena ada file
    const formData = new FormData();
    formData.append("nama_penyelenggara", form.nama_penyelenggara);
    formData.append("tipe", form.tipe);
    formData.append("deskripsi_singkat", form.deskripsi_singkat);
    formData.append("logo", logoFile);
    formData.append("dokumen_validasi", buktiFile);

    try {
      await submissionApi.submitPenyelenggara(formData);
      setMessage({ type: "success", text: "Pengajuan Berhasil! Mohon tunggu validasi admin." });
      setForm({ nama_penyelenggara: "", tipe: "Internal", deskripsi_singkat: "" }); // Reset
      setLogoFile(null);
      setBuktiFile(null);
    } catch (error) {
      console.error("Gagal submit:", error);
      console.error("Error response:", error.response);
      
      // Tangani error validasi
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat().join(', ');
        setMessage({ type: "error", text: `Validasi gagal: ${errorMessages}` });
      } else {
        const errorMsg = error.response?.data?.message || "Terjadi kesalahan saat mengirim data.";
        setMessage({ type: "error", text: errorMsg });
      }
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Penyelenggara</label>
          <select
            name="tipe"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.tipe}
            onChange={handleChange}
            required
          >
            <option value="Internal">Internal (HIMA/UKM Unila)</option>
            <option value="Eksternal">Eksternal (Instansi Luar)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Singkat</label>
          <textarea
            name="deskripsi_singkat"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            value={form.deskripsi_singkat}
            onChange={handleChange}
            placeholder="Jelaskan tentang organisasi Anda..."
          />
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bukti Organisasi</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleBuktiFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Upload surat keputusan, sertifikat, atau dokumen resmi organisasi (PDF, DOC, JPG - Max. 5MB)</p>
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