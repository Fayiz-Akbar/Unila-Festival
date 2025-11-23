<?php

namespace App\Http\Controllers\Submission;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Acara;
use App\Models\Penyelenggara;
use Illuminate\Support\Facades\Validator;

class AcaraSubmissionController extends Controller
{
    public function store(Request $request)
    {
        // 1. Cek Hak Akses: Apakah User ini adalah Penyelenggara yang VALID?
        $penyelenggara = Penyelenggara::where('user_id', $request->user()->id)
            ->where('status_validasi', 'valid') // Pastikan kolom status di DB sesuai (misal: 'valid' atau 'disetujui')
            ->first();

        if (!$penyelenggara) {
            return response()->json([
                'status' => 'error',
                'message' => 'Anda belum terdaftar sebagai penyelenggara valid. Silakan ajukan penyelenggara terlebih dahulu.'
            ], 403);
        }

        // 2. Validasi Input Acara
        $validator = Validator::make($request->all(), [
            'nama_acara' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'kategori_id' => 'required|exists:kategori,id', // Pastikan tabel kategori ada
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'lokasi' => 'required|string',
            'harga_tiket' => 'required|numeric|min:0',
            'kuota' => 'required|integer|min:1',
            'poster' => 'required|image|mimes:jpeg,png,jpg|max:3072', // Max 3MB
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        try {
            // 3. Upload Poster
            $posterPath = null;
            if ($request->hasFile('poster')) {
                $posterPath = $request->file('poster')->store('posters', 'public');
            }

            // 4. Insert Data Acara
            $acara = Acara::create([
                'penyelenggara_id' => $penyelenggara->id,
                'kategori_id' => $request->kategori_id,
                'nama_acara' => $request->nama_acara,
                'deskripsi' => $request->deskripsi,
                'tanggal_mulai' => $request->tanggal_mulai,
                'tanggal_selesai' => $request->tanggal_selesai,
                'lokasi' => $request->lokasi,
                'harga_tiket' => $request->harga_tiket,
                'kuota' => $request->kuota,
                'poster' => $posterPath,
                'status_acara' => 'pending', // Menunggu approval Admin (PJ 1)
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Acara berhasil diajukan! Menunggu persetujuan admin.',
                'data' => $acara
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menyimpan acara: ' . $e->getMessage()
            ], 500);
        }
    }
}