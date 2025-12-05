import React from 'react';
// import Layout from '../components/Common/Layout'; // <-- HAPUS INI
import FormAjuanAcara from '../components/Submission/FormAjuanAcara';

const AjukanAcaraPage = () => {
  return (
    // <Layout> <-- HAPUS PEMBUNGKUS INI
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-gray-900">Ajukan Acara Baru</h1>
            <p className="mt-2 text-gray-600">
              Isi formulir di bawah ini untuk mendaftarkan event Anda di Unila Festival.
              Pastikan data yang Anda masukkan valid.
            </p>
          </div>

          {/* Form Component */}
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
            <FormAjuanAcara />
          </div>
        </div>

      </div>
    </div>
    // </Layout> <-- DAN TUTUPNYA JUGA
  );
};

export default AjukanAcaraPage;