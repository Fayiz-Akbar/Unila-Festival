// Frontend/src/components/Public/AcaraList.jsx
import React, { useState, useEffect } from 'react';
import CardAcara from '../Common/CardAcara';
import publicApi from '../../api/publicApi'; 

const AcaraList = () => {
  const [daftarAcara, setDaftarAcara] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAcara = async () => {
      try {
        setLoading(true);
        
        // Menggunakan method dari publicApi object Anda
        const response = await publicApi.getPublicAcara(); 
        
        // Handle response Laravel (biasanya data ada di response.data.data atau response.data)
        const data = response.data.data ? response.data.data : response.data;
        
        setDaftarAcara(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Gagal mengambil data acara:", err);
        setError("Gagal memuat daftar acara.");
      } finally {
        setLoading(false);
      }
    };

    fetchAcara();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500 bg-red-50 rounded-lg mx-4">
        <p>{error}</p>
      </div>
    );
  }

  if (!daftarAcara || daftarAcara.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200 mx-4">
        <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada acara</h3>
        <p className="mt-1 text-sm text-gray-500">Nantikan update acara terbaru.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {daftarAcara.map((acara) => (
          <CardAcara key={acara.id} acara={acara} />
        ))}
      </div>
    </div>
  );
};

export default AcaraList;