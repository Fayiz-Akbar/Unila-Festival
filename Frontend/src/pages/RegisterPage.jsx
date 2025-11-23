import { useState } from "react";
import authApi from "../api/authApi"; // Import langsung API karena register jarang ada di context
import { useNavigate, Link } from "react-router-dom";
import Input from "../components/Common/Input";
import Button from "../components/Common/button";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nama: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Sesuai request backend: nama, email, password
      await authApi.register(form);
      alert("Registrasi berhasil! Silakan login.");
      navigate("/login");
    } catch (err) {
      // Menangkap validasi error dari Laravel (misal: email sudah ada)
      const msg = err.response?.data?.message || "Terjadi kesalahan saat mendaftar.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-900">Daftar Akun Baru</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <Input
              type="text"
              placeholder="Nama Anda"
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <Input
              type="email"
              placeholder="email@contoh.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kata Sandi</label>
            <Input
              type="password"
              placeholder="Minimal 8 karakter"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Mendaftar..." : "Daftar Sekarang"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Masuk disini
          </Link>
        </p>
      </div>
    </div>
  );
}