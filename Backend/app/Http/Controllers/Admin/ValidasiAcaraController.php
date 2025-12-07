<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Acara; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ValidasiAcaraController extends Controller
{
    public function index()
    {
        $submissions = Acara::where('status', 'Pending')
            ->with('penyelenggara', 'pengaju', 'kategori')
            ->latest()
            ->get();

        return response()->json($submissions);
    }

    public function validateAcara(Request $request, string $id)
    {
        // Validasi input
        $validator = Validator::make($request->all(), [
            'status' => ['required', Rule::in(['Published', 'Rejected'])],
            'catatan_admin_acara' => 'nullable|string|max:1000', // Pastikan key ini sesuai dengan frontend
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $acara = Acara::find($id);

        if (!$acara) {
            return response()->json(['message' => 'Data acara tidak ditemukan'], 404);
        }

        // Logic Update
        $acara->status = $request->status;
        
        // Jika Rejected, simpan alasan. Jika Published, kosongkan catatan (opsional)
        if ($request->status === 'Rejected') {
            $acara->catatan_admin_acara = $request->catatan_admin_acara;
        } else {
             $acara->catatan_admin_acara = null; // Bersihkan catatan lama jika di-approve
        }

        $acara->save();

        return response()->json([
            'message' => 'Validasi acara berhasil disimpan.',
            'data' => $acara
        ]);
    }
}