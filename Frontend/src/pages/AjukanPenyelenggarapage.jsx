import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FormAjuanPenyelenggara from "../components/Submission/FormAjuanPenyelenggara";

const AjukanPenyelenggaraPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Jika user belum login, tampilkan pesan
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-10">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Diperlukan</h2>
            <p className="text-gray-600 mb-6">
              Anda harus login terlebih dahulu untuk mendaftar sebagai penyelenggara.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="bg-[#FF7F3E] text-white px-6 py-2 rounded-lg hover:bg-[#e66b2b] transition-colors"
            >
              Login Sekarang
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-10">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Daftar Sebagai Penyelenggara</h1>
          <p className="text-gray-600 mt-2">
            Bergabunglah dengan Unila Festival untuk mempublikasikan dan mengelola event kampusmu dengan lebih mudah.
          </p>
        </div>

        {/* Memanggil Komponen Form */}
        <FormAjuanPenyelenggara />
        
      </div>
    </div>
  );
};

export default AjukanPenyelenggaraPage;