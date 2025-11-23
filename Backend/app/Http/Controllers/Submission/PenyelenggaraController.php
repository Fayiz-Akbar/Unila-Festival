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
            'deskripsi' => 'required|string',
            'alamat' => 'required|string',
            'no_telp' => 'required|string|max:20',
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
            // 2. Upload Logo
            $logoPath = null;
            if ($request->hasFile('logo')) {
                // Simpan di folder: storage/app/public/logos
                $logoPath = $request->file('logo')->store('logos', 'public');
            }

            // 3. Simpan ke Database
            $penyelenggara = Penyelenggara::create([
                'user_id' => $request->user()->id, // ID user yang sedang login
                'nama_penyelenggara' => $request->nama_penyelenggara,
                'deskripsi' => $request->deskripsi,
                'alamat' => $request->alamat,
                'no_telp' => $request->no_telp,
                'logo' => $logoPath,
                'status_validasi' => 'pending', // Default status
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
     * Cek status pengajuan saya
     */
    public function myStatus(Request $request) {
        $submission = Penyelenggara::where('user_id', $request->user()->id)->first();
        
        if(!$submission) {
            return response()->json(['status' => 'not_found', 'message' => 'Belum mengajukan'], 404);
        }

        return response()->json(['status' => 'success', 'data' => $submission]);
    }
}