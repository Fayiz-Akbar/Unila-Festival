<?php

namespace App\Http\Controllers\Submission;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Acara;
use App\Models\PengelolaPenyelenggara; // Pastikan Model ini ada
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AcaraSubmissionController extends Controller
{
    /**
     * Menampilkan daftar acara milik user yang sedang login (Penyelenggara).
     */
    public function index()
    {
        $user = Auth::user();

        // 1. Cari ID Penyelenggara yang dikelola oleh user ini
        // Asumsi: Satu user bisa mengelola satu atau lebih penyelenggara.
        // Kita ambil yang pertama saja untuk MVP ini.
        $pengelola = DB::table('pengelola_penyelenggara')
                        ->where('id_pengguna', $user->id)
                        ->where('status_tautan', 'Approved') // Pastikan statusnya Approved
                        ->first();

        if (!$pengelola) {
            // Jika user belum punya penyelenggara atau belum diapprove
            return response()->json([
                'message' => 'Anda belum terdaftar sebagai penyelenggara valid atau pengajuan masih pending.',
                'data' => []
            ], 200); // Return kosong tapi sukses, biar frontend tidak error merah
        }

        // 2. Ambil acara berdasarkan id_penyelenggara tersebut
        $acara = Acara::where('id_penyelenggara', $pengelola->id_penyelenggara)
                      ->with('kategori') // Load relasi kategori
                      ->orderBy('created_at', 'desc')
                      ->get();

        return response()->json($acara);
    }

    /**
     * Menyimpan pengajuan acara baru.
     */
    public function store(Request $request)
    {
        // 1. Validasi Input
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'id_kategori' => 'required|exists:kategori,id',
            'lokasi' => 'required|string',
            'waktu_mulai' => 'required|date',
            'waktu_selesai' => 'nullable|date|after:waktu_mulai',
            'link_pendaftaran' => 'nullable|url',
            'poster' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = Auth::user();

        // 2. Cek Hak Akses Penyelenggara
        $pengelola = DB::table('pengelola_penyelenggara')
                        ->where('id_pengguna', $user->id)
                        ->where('status_tautan', 'Approved')
                        ->first();

        if (!$pengelola) {
            return response()->json([
                'message' => 'Anda belum terdaftar sebagai penyelenggara valid. Silakan ajukan penyelenggara terlebih dahulu.'
            ], 403);
        }

        $penyelenggara = DB::table('penyelenggara')->where('id', $pengelola->id_penyelenggara)->first();

        // --- LOGIC TAMBAHAN: Validasi Lokasi Berdasarkan Tipe Penyelenggara ---
        if ($penyelenggara->tipe === 'Eksternal') {
            // Cek apakah string lokasi mengandung kata 'Unila', 'Universitas Lampung', atau gedung fakultas
            // Ini validasi sederhana, bisa diperketat dengan Regex atau Dropdown di frontend
            $lokasiValid = Str::contains(strtolower($validated['lokasi']), ['unila', 'universitas lampung', 'gedung', 'fakultas']);
            
            if (!$lokasiValid) {
                return response()->json([
                    'message' => 'Penyelenggara Eksternal WAJIB mengadakan acara di dalam lingkungan Unila.'
                ], 422);
            }
        }

        // 3. Handle Upload Poster
        $posterPath = null;
        if ($request->hasFile('poster')) {
            // Simpan di folder 'public/posters'
            $posterPath = $request->file('poster')->store('posters', 'public');
        }

        // 4. Simpan ke Database
        // Generate Slug Unik
        $slug = Str::slug($validated['judul']);
        if (Acara::where('slug', $slug)->exists()) {
            $slug = $slug . '-' . time();
        }

        $acara = Acara::create([
            'judul' => $validated['judul'],
            'slug' => $slug,
            'deskripsi' => $validated['deskripsi'],
            'poster_url' => $posterPath, // Simpan path file
            'id_pengaju' => $user->id,
            'id_penyelenggara' => $pengelola->id_penyelenggara, // Ambil dari relasi
            'id_kategori' => $validated['id_kategori'],
            'lokasi' => $validated['lokasi'],
            'waktu_mulai' => $validated['waktu_mulai'],
            'waktu_selesai' => $validated['waktu_selesai'] ?? null,
            'link_pendaftaran' => $validated['link_pendaftaran'] ?? null,
            'status' => 'Pending', // Default status saat diajukan
        ]);

        return response()->json([
            'message' => 'Acara berhasil diajukan dan menunggu validasi.',
            'data' => $acara
        ], 201);
    }

    /**
     * Menghapus acara (Hanya jika status masih Draft/Pending/Rejected).
     */
    public function destroy($id)
    {
        $user = Auth::user();
        $acara = Acara::findOrFail($id);

        // Pastikan yang menghapus adalah pemilik acara
        if ($acara->id_pengaju !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $acara->delete();

        return response()->json(['message' => 'Acara berhasil dihapus.']);
    }
}