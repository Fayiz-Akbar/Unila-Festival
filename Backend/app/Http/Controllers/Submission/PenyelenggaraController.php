<?php

namespace App\Http\Controllers\Submission;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Penyelenggara; // Pastikan model ini ada (Tugas PJ 1)
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class PenyelenggaraController extends Controller
{
    /**
     * Mengajukan diri sebagai Penyelenggara Baru
     */
    public function store(Request $request)
    {
        // 1. Validasi Input
        $validator = Validator::make($request->all(), [
            'nama_penyelenggara' => 'required|string|max:255|unique:penyelenggara,nama_penyelenggara',
            'tipe' => 'required|in:Internal,Eksternal',
            'deskripsi_singkat' => 'nullable|string',
            'logo' => 'required|image|mimes:jpeg,png,jpg|max:2048', // Max 2MB
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // 2. Cek apakah user sudah pernah mengajukan penyelenggara yang pending
            $existingPending = $request->user()
                ->penyelenggaraYangDikelola()
                ->wherePivot('status_tautan', 'pending')
                ->exists();
            
            if ($existingPending) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Anda masih memiliki pengajuan yang sedang diproses. Mohon tunggu validasi admin.'
                ], 422);
            }

            // 3. Upload Logo
            $logoUrl = null;
            if ($request->hasFile('logo')) {
                // Simpan di folder: storage/app/public/logos
                $logoPath = $request->file('logo')->store('logos', 'public');
                $logoUrl = asset('storage/' . $logoPath);
            }

            // 4. Simpan ke tabel penyelenggara
            $penyelenggara = Penyelenggara::create([
                'nama_penyelenggara' => $request->nama_penyelenggara,
                'tipe' => $request->tipe,
                'deskripsi_singkat' => $request->deskripsi_singkat,
                'logo_url' => $logoUrl,
            ]);
            
            // 5. Hubungkan user dengan penyelenggara melalui tabel pivot (pengelola_penyelenggara)
            $request->user()->penyelenggaraYangDikelola()->attach($penyelenggara->id, [
                'status_tautan' => 'pending',
                'catatan_admin' => null,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Pengajuan penyelenggara berhasil dikirim. Menunggu validasi admin.',
                'data' => $penyelenggara
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan server: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Mendapatkan daftar penyelenggara milik user yang sedang login
     */
    public function index(Request $request)
    {
        // Ambil semua penyelenggara yang dikelola oleh user ini
        $penyelenggara = $request->user()
            ->penyelenggaraYangDikelola()
            ->withPivot('status_tautan', 'catatan_admin')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $penyelenggara
        ]);
    }
}