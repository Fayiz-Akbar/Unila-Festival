<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Acara;

class ManajemenAcaraController extends Controller
{
    public function index()
    {
        // PERBAIKAN:
        // Daripada menebak status 'approved' atau 'active',
        // kita ambil SEMUA yang TIDAK 'pending' dan TIDAK 'rejected'.
        // Ini akan menangkap status apapun seperti 'Approved', 'Published', 'Selesai', dll.
        
        $acara = Acara::with(['kategori', 'penyelenggara'])
            ->whereNotIn('status', ['pending', 'Pending', 'rejected', 'Rejected', 'draft', 'Draft'])
            ->latest()
            ->get();

        // DEBUGGING (Opsional):
        // Jika masih kosong, uncomment baris di bawah ini untuk melihat apa status yang sebenarnya ada di database
        // return response()->json(Acara::select('status')->distinct()->get());

        return response()->json($acara);
    }

    public function batalkan($id, Request $request)
    {
        $acara = Acara::findOrFail($id);
        
        $request->validate([
            'alasan' => 'required|string|max:255',
        ]);

        $acara->status = 'rejected'; 
        $acara->alasan_penolakan = $request->input('alasan');
        $acara->save();

        return response()->json([
            'message' => 'Acara berhasil dibatalkan.',
            'data' => $acara
        ]);
    }

    public function destroy($id)
    {
        $acara = Acara::findOrFail($id);
        
        if ($acara->poster && file_exists(public_path('storage/' . $acara->poster))) {
            unlink(public_path('storage/' . $acara->poster));
        }

        $acara->delete();

        return response()->json([
            'message' => 'Acara berhasil dihapus permanen.'
        ]);
    }
}