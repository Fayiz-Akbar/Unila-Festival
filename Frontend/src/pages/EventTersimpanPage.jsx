// Frontend/src/pages/EventTersimpanPage.jsx
import React, { useState, useEffect } from 'react';
import Layout from '../components/Common/Layout';
import CardAcara from '../components/Common/CardAcara';
import eventTersimpanApi from '../api/eventTersimpanApi';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function EventTersimpanPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchEventTersimpan();
  }, [user, navigate]);

  const fetchEventTersimpan = async () => {
    try {
      setLoading(true);
      const response = await eventTersimpanApi.getEventTersimpan();
      setEvents(response.data.data || []);
    } catch (err) {
      console.error('Error fetching saved events:', err);
      setError('Gagal memuat event tersimpan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Event Tersimpan
            </h1>
            <p className="text-gray-600">
              Kumpulan event yang Anda simpan untuk diikuti nanti
            </p>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF7F3E]"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <svg className="w-12 h-12 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700">{error}</p>
              <button
                onClick={fetchEventTersimpan}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          ) : events.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Belum Ada Event Tersimpan
              </h3>
              <p className="text-gray-600 mb-6">
                Simpan event yang menarik untuk Anda dengan klik ikon bookmark
              </p>
              <button
                onClick={() => navigate('/acara')}
                className="px-6 py-3 bg-[#FF7F3E] text-white rounded-lg hover:bg-[#e6722f] transition-colors font-medium"
              >
                Jelajahi Event
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <CardAcara key={event.id} acara={event} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
