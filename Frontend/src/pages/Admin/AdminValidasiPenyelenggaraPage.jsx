import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import Swal from 'sweetalert2';
import { format } from 'date-fns';

export default function AdminValidasiPenyelenggaraPage() {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- 1. Fetch Data ---
    const fetchSubmissions = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get('/admin/validasi/penyelenggara');
            setSubmissions(response.data);
        } catch (err) {
            console.error("Fetch Error:", err);
            Swal.fire("Error", "Gagal mengambil data pengajuan.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubmissions();
    }, []);

    // --- 2. Helper Functions ---
    
    // Logic URL Cerdas (untuk Logo/Dokumen)
    const getAssetUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `http://localhost:8000/storage/${path}`;
    };

    const formatDateTime = (dateTime) => {
        return dateTime ? format(new Date(dateTime), 'dd MMM yyyy, HH:mm') : '-';
    };

    // --- 3. Action Handlers ---

    // Lihat Detail (Modal)
    const handleViewDetail = (item) => {
        const logoUrl = getAssetUrl(item.penyelenggara.logo_url);
        const docUrl = getAssetUrl(item.penyelenggara.dokumen_validasi_url);

        Swal.fire({
            title: `<h3 class="text-xl font-bold text-gray-800">${item.penyelenggara.nama_penyelenggara}</h3>`,
            html: `
                <div class="text-left text-sm space-y-4 mt-4">
                    
                    ${logoUrl ? `
                        <div class="flex justify-center mb-4">
                            <img src="${logoUrl}" alt="Logo" class="h-24 w-24 object-contain rounded-full border border-gray-200 shadow-sm">
                        </div>
                    ` : ''}

                    <div class="grid grid-cols-2 gap-2">
                        <div>
                            <span class="block text-xs text-gray-500 uppercase">Tipe Organisasi</span>
                            <span class="font-medium text-gray-900">${item.penyelenggara.tipe}</span>
                        </div>
                        <div>
                             <span class="block text-xs text-gray-500 uppercase">Diajukan Oleh</span>
                             <span class="font-medium text-gray-900">${item.pengguna.nama}</span>
                             <div class="text-xs text-blue-600">${item.pengguna.email}</div>
                        </div>
                    </div>

                    <div class="bg-gray-50 p-3 rounded border border-gray-100">
                        <strong class="block mb-1 text-gray-600 text-xs uppercase">Deskripsi Singkat</strong>
                        <p class="text-gray-700 leading-relaxed">${item.penyelenggara.deskripsi_singkat || '-'}</p>
                    </div>

                    ${docUrl ? `
                        <div class="mt-4 pt-3 border-t border-gray-100 text-center">
                            <a href="${docUrl}" target="_blank" class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                                <i class="fa-solid fa-file-pdf mr-2"></i> Lihat Dokumen Validasi (SK)
                            </a>
                        </div>
                    ` : '<p class="text-center text-gray-400 italic text-xs mt-2">Tidak ada dokumen lampiran</p>'}
                </div>
            `,
            width: 600,
            showCloseButton: true,
            confirmButtonText: 'Tutup',
            confirmButtonColor: '#64748b',
        });
    };

    // Approve (Konfirmasi Saja)
    const handleApprove = async (id) => {
        const result = await Swal.fire({
            title: 'Setujui Penyelenggara?',
            text: "User akan mendapatkan hak akses sebagai penyelenggara.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981', // Hijau
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Ya, Setujui',
            cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
            try {
                await axiosClient.post(`/admin/validasi/penyelenggara/${id}`, {
                    status_tautan: 'Approved',
                    catatan_admin: null 
                });
                Swal.fire('Disetujui!', 'Penyelenggara berhasil diaktifkan.', 'success');
                fetchSubmissions();
            } catch (error) {
                Swal.fire('Gagal', 'Terjadi kesalahan sistem.', 'error');
            }
        }
    };

    // Reject (Wajib Alasan)
    const handleReject = async (id) => {
        const { value: text } = await Swal.fire({
            title: 'Tolak Pengajuan?',
            input: 'textarea',
            inputLabel: 'Alasan Penolakan (Wajib)',
            inputPlaceholder: 'Jelaskan alasan penolakan (misal: Dokumen SK buram, bukan organisasi valid)...',
            inputAttributes: {
                'aria-label': 'Tulis alasan penolakan'
            },
            showCancelButton: true,
            confirmButtonText: 'Tolak Permanen',
            confirmButtonColor: '#ef4444', // Merah
            cancelButtonText: 'Batal',
            inputValidator: (value) => {
                if (!value) {
                    return 'Anda harus menuliskan alasan penolakan!';
                }
            }
        });

        if (text) {
            try {
                await axiosClient.post(`/admin/validasi/penyelenggara/${id}`, {
                    status_tautan: 'Rejected',
                    catatan_admin: text
                });
                Swal.fire('Ditolak', 'Pengajuan ditolak dan alasan tersimpan.', 'success');
                fetchSubmissions();
            } catch (error) {
                Swal.fire('Gagal', 'Terjadi kesalahan sistem.', 'error');
            }
        }
    };

    // --- 4. Render UI ---

    if (loading) return <div className="p-8 text-center text-gray-500">Memuat data pengajuan...</div>;

    return (
        <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-end mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Validasi Penyelenggara
                    </h1>
                    <p className="mt-1 text-gray-500 text-sm">
                        Verifikasi pengajuan hak akses penyelenggara (HIMA/UKM) dari user.
                    </p>
                </div>
                <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium border border-blue-100">
                    Pending: <span className="font-bold">{submissions.length}</span>
                </div>
            </div>
            
            {/* Tabel */}
            {submissions.length === 0 ? (
                <div className="rounded-xl bg-white p-12 text-center shadow-sm border border-gray-200">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
                        <i className="fa-solid fa-check-double text-2xl text-green-600"></i>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Semua Bersih!</h3>
                    <p className="mt-1 text-gray-500">Tidak ada pengajuan penyelenggara baru.</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                    Organisasi / Penyelenggara
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                    Pemohon (User)
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                    Tanggal Masuk
                                </th>
                                <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-500">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {submissions.map((sub) => (
                                <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                                    
                                    {/* Kolom 1: Penyelenggara */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            {/* Avatar Logo Kecil */}
                                            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center text-gray-400">
                                                {sub.penyelenggara.logo_url ? (
                                                    <img src={getAssetUrl(sub.penyelenggara.logo_url)} alt="Logo" className="h-full w-full object-cover" />
                                                ) : (
                                                    <i className="fa-solid fa-building"></i>
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <div className="font-bold text-gray-900">{sub.penyelenggara.nama_penyelenggara}</div>
                                                <div className="text-xs text-gray-500 mt-0.5">
                                                    Tipe: <span className="font-medium text-gray-700">{sub.penyelenggara.tipe}</span>
                                                </div>
                                                <button 
                                                    onClick={() => handleViewDetail(sub)}
                                                    className="text-xs text-blue-600 hover:text-blue-800 hover:underline mt-1 flex items-center"
                                                >
                                                    <i className="fa-regular fa-eye mr-1"></i> Cek Detail & Dokumen
                                                </button>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Kolom 2: Pemohon */}
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{sub.pengguna.nama}</div>
                                        <div className="text-xs text-gray-500">{sub.pengguna.email}</div>
                                    </td>

                                    {/* Kolom 3: Tanggal */}
                                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                        {formatDateTime(sub.created_at)}
                                    </td>

                                    {/* Kolom 4: Aksi */}
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => handleApprove(sub.id)}
                                                className="inline-flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded transition shadow-sm"
                                                title="Setujui Pengajuan"
                                            >
                                                <i className="fa-solid fa-check mr-1.5"></i> Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(sub.id)}
                                                className="inline-flex items-center px-3 py-1.5 bg-white border border-red-300 text-red-600 hover:bg-red-50 text-xs font-bold rounded transition shadow-sm"
                                                title="Tolak Pengajuan"
                                            >
                                                <i className="fa-solid fa-xmark mr-1.5"></i> Reject
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}