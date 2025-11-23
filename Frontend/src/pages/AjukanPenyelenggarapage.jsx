import React from 'react';
import Layout from "../components/Common/Layout";
import FormAjuanPenyelenggara from "../components/Submission/FormAjuanPenyelenggara";

const AjukanPenyelenggaraPage = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-10">
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
    </Layout>
  );
};

export default AjukanPenyelenggaraPage;