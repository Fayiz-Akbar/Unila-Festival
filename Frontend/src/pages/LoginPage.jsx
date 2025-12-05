// Frontend/src/pages/LoginPage.jsx

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Input from "../components/Common/Input";
import Button from "../components/Common/button";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Panggil fungsi login dari AuthContext
      // Fungsi ini mengembalikan response lengkap dari Axios
      const response = await login(form.email, form.password);
      
      // 2. Ambil data user dari response backend
      // Struktur: response -> data -> user
      const user = response.data.user;

      // 3. Cek Role (Peran) untuk menentukan arah redirect
      // Kita cek 'admin' (huruf kecil) dan 'Admin' (kapital) untuk jaga-jaga
      if (user.peran === 'admin' || user.peran === 'Admin') {
        console.log("Login sebagai Admin, redirect ke Dashboard...");
        navigate("/admin/dashboard");
      } else {
        console.log("Login sebagai User, redirect ke Home...");
        navigate("/"); // Bisa juga diganti ke "/agenda-saya" jika ingin spesifik
      }

    } catch (err) {
      // Log error ke console untuk debugging
      console.error("Login error:", err);
      
      // Menangkap pesan error dari backend (response 401/422)
      setError(err.response?.data?.message || "Login gagal. Periksa email dan kata sandi Anda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-900">Masuk Akun</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <Input
              type="email"
              placeholder="contoh@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Kata Sandi</label>
              <Link to="/forgot-password" className="text-xs text-blue-600 hover:underline">
                Lupa password?
              </Link>
            </div>
            <Input
              type="password"
              placeholder="******"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Memproses..." : "Masuk"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Belum punya akun?{" "}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Daftar disini
          </Link>
        </p>
      </div>
    </div>
  );
}