import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import Swal from 'sweetalert2'; // Pastikan sudah install: npm install sweetalert2

export default function AdminValidasiAcaraPage() {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSubmissions = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get('/admin/validasi/acara');
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

    // --- Helper: Get Poster URL (Sama seperti di CardAcara/Manajemen) ---
    const getPosterUrl = (acara) => {
        const url = acara.poster_url;
        if (!url) return null;
        if (url.startsWith('http')) return url;
        return `http://localhost:8000/storage/${url}`;
    };

    // --- Helper: Format Date ---
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    // --- ACTION 1: Lihat Poster ---
    const handleViewPoster = (acara) => {
        const url = getPosterUrl(acara);
        if (!url) {
            Swal.fire("Info", "Acara ini tidak memiliki poster.", "info");
            return;
        }

        Swal.fire({
            title: acara.judul,
            text: 'Poster Acara',
            imageUrl: url,
            imageAlt: 'Poster Acara',
            imageHeight: 500, // Tinggi gambar agar proporsional
            width: 600,
            showCloseButton: true,
            showConfirmButton: false // Hanya tombol close X
        });
    };

    // --- ACTION 2: Lihat Detail Lengkap ---
    const handleViewDetail = (acara) => {
        Swal.fire({
            title: `<h3 class="text-xl font-bold text-gray-800">${acara.judul}</h3>`,
            html: `
                <div class="text-left text-sm space-y-3 mt-4">
                    <p><strong> Kategori:</strong> ${acara.kategori?.nama_kategori || '-'}</p>
                    <p><strong> Penyelenggara:</strong> ${acara.penyelenggara?.nama_penyelenggara || '-'}</p>
                    <p><strong> Pengaju:</strong> ${acara.pengaju?.nama || '-'}</p>
                    <hr class="border-gray-200" />
                    <p><strong> Lokasi:</strong> ${acara.lokasi}</p>
                    <p><strong> Mulai:</strong> ${formatDate(acara.waktu_mulai)}</p>
                    <p><strong> Selesai:</strong> ${formatDate(acara.waktu_selesai)}</p>
                    <hr class="border-gray-200" />
                    <div class="bg-gray-50 p-3 rounded border border-gray-100">
                        <strong class="block mb-1 text-gray-600"> Deskripsi:</strong>
                        <p class="whitespace-pre-line text-gray-700">${acara.deskripsi}</p>
                    </div>
                     ${acara.link_pendaftaran ? `<p class="mt-2 text-blue-600"><a href="${acara.link_pendaftaran}" target="_blank">🔗 Link Pendaftaran</a></p>` : ''}
                </div>
            `,
            width: 700,
            showCloseButton: true,
            confirmButtonText: 'Tutup',
            confirmButtonColor: '#3085d6',
        });
    };

    // --- ACTION 3: PUBLISH (Tanpa Komentar) ---
    const handlePublish = async (id) => {
        const result = await Swal.fire({
            title: 'Publikasikan Acara?',
            text: "Acara akan langsung tayang di halaman publik.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981', // Hijau
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Ya, Publikasikan!',
            cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
            try {
                // Kirim ke backend status Published
                await axiosClient.post(`/admin/validasi/acara/${id}`, {
                    status: 'Published',
                    catatan_admin_acara: null // Tidak perlu catatan
                });
                
                Swal.fire('Terpublikasi!', 'Acara berhasil ditayangkan.', 'success');
                fetchSubmissions(); // Refresh tabel
            } catch (error) {
                console.error(error);
                Swal.fire('Gagal', 'Terjadi kesalahan saat memproses data.', 'error');
            }
        }
    };

    // --- ACTION 4: REJECT (Wajib Alasan) ---
    const handleReject = async (id) => {
        const { value: text } = await Swal.fire({
            title: 'Tolak Pengajuan?',
            input: 'textarea',
            inputLabel: 'Alasan Penolakan (Wajib)',
            inputPlaceholder: 'Jelaskan kenapa acara ini ditolak (misal: Poster buram, data kurang)...',
            inputAttributes: {
                'aria-label': 'Tulis alasan penolakan di sini'
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
                // Kirim ke backend status Rejected + Catatan
                await axiosClient.post(`/admin/validasi/acara/${id}`, {
                    status: 'Rejected',
                    catatan_admin_acara: text // Alasan dari input textarea
                });

                Swal.fire('Ditolak', 'Acara telah ditolak dan alasan tersimpan.', 'success');
                fetchSubmissions();
            } catch (error) {
                console.error(error);
                Swal.fire('Gagal', 'Terjadi kesalahan saat menolak data.', 'error');
            }
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Memuat data pengajuan...</div>;

    return (
        <div className="mx-auto max-w-7xl">
            <div className="flex flex-col sm:flex-row justify-between items-end mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Validasi Pengajuan Acara
                    </h1>
                    <p className="mt-1 text-gray-500">
                        Tinjau acara masuk. 'Publish' untuk menayangkan, 'Reject' untuk mengembalikan ke penyelenggara.
                    </p>
                </div>
                <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium">
                    Pending: {submissions.length}
                </div>
            </div>
            
            {submissions.length === 0 ? (
                <div className="rounded-xl bg-white p-12 text-center shadow-sm border border-gray-200">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
                        <i className="fa-solid fa-check text-2xl text-green-600"></i>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Semua Bersih!</h3>
                    <p className="mt-1 text-gray-500">Tidak ada pengajuan acara baru saat ini.</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                    Info Acara
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                    Waktu & Lokasi
                                </th>
                                <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-500 w-1/4">
                                    Aksi Cepat
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {submissions.map((acara) => (
                                <tr key={acara.id} className="hover:bg-gray-50 transition-colors">
                                    {/* Kolom 1: Judul, Kategori, Penyelenggara */}
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-900 text-base mb-1">{acara.judul}</span>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                                                    {acara.kategori?.nama_kategori || 'Umum'}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    oleh {acara.penyelenggara?.nama_penyelenggara}
                                                </span>
                                            </div>
                                            
                                            {/* Tombol Detail & Poster */}
                                            <div className="flex gap-3 text-sm mt-1">
                                                <button 
                                                    onClick={() => handleViewDetail(acara)}
                                                    className="text-blue-600 hover:text-blue-800 font-medium hover:underline flex items-center"
                                                >
                                                    <i className="fa-regular fa-eye mr-1"></i> Cek Detail
                                                </button>
                                                <button 
                                                    onClick={() => handleViewPoster(acara)}
                                                    className="text-pink-600 hover:text-pink-800 font-medium hover:underline flex items-center"
                                                >
                                                    <i className="fa-regular fa-image mr-1"></i> Cek Poster
                                                </button>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Kolom 2: Waktu */}
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center">
                                                <i className="fa-regular fa-calendar w-5 text-center mr-2 text-gray-400"></i>
                                                <span>{formatDate(acara.waktu_mulai)}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <i className="fa-solid fa-location-dot w-5 text-center mr-2 text-gray-400"></i>
                                                <span className="truncate max-w-[150px]" title={acara.lokasi}>
                                                    {acara.lokasi}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Kolom 3: Tombol Aksi */}
                                    <td className="px-6 py-4 text-center align-middle">
                                        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                                            <button
                                                onClick={() => handlePublish(acara.id)}
                                                className="inline-flex justify-center items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition shadow-sm w-full sm:w-auto"
                                                title="Langsung tayangkan"
                                            >
                                                <i className="fa-solid fa-check mr-2"></i> Publish
                                            </button>
                                            
                                            <button
                                                onClick={() => handleReject(acara.id)}
                                                className="inline-flex justify-center items-center px-4 py-2 bg-white border border-red-300 text-red-600 hover:bg-red-50 text-sm font-medium rounded-lg transition shadow-sm w-full sm:w-auto"
                                                title="Tolak dan beri alasan"
                                            >
                                                <i className="fa-solid fa-xmark mr-2"></i> Reject
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