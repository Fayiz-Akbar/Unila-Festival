import React from 'react';
import { Link } from 'react-router-dom';
// import Layout from '../components/Common/Layout'; // HAPUS INI JIKA MASIH ADA
import AgendaSayaList from '../components/Public/AgendaSayaList';
import { useAuth } from '../context/AuthContext';

const AgendaSayaPage = () => {
  const { user } = useAuth();

  return (
    // PERBAIKAN: Tambahkan 'pt-24' (padding top 6rem / 96px) agar tidak tertutup Navbar
    <div className="bg-gray-50 min-h-screen py-12 pt-24">
       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
             <div>
                <h1 className="text-3xl font-extrabold text-[#1a1a2e]">Event Saya</h1>
                <p className="text-gray-600 mt-1">
                   Halo <span className="font-semibold text-[#FF7F3E]">{user?.nama || 'User'}</span>, kelola semua acara yang Anda buat di sini.
                </p>
             </div>
             
             <Link 
               to="/ajukan-acara" 
               className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-[#1a1a2e] hover:bg-gray-800 transition-all transform hover:-translate-y-0.5"
             >
               <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
               Buat Event Baru
             </Link>
          </div>

          {/* List Component */}
          <div className="max-w-5xl mx-auto md:mx-0 w-full">
             <AgendaSayaList />
          </div>

       </div>
    </div>
  );
};

export default AgendaSayaPage;