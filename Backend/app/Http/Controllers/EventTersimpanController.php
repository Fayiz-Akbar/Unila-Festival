<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EventTersimpan;
use App\Models\Acara;
use Illuminate\Support\Facades\Auth;

class EventTersimpanController extends Controller
{
    /**
     * Ambil semua event yang disimpan user
     */
    public function index()
    {
        $user = Auth::user();
        
        $eventTersimpan = EventTersimpan::where('id_pengguna', $user->id)
            ->with(['acara.kategori', 'acara.penyelenggara'])
            ->orderBy('created_at', 'desc')
            ->get();
        
        // Return hanya data acara-nya saja, filter yang null
        $acara = $eventTersimpan->map(function($item) {
            return $item->acara;
        })->filter(function($acara) {
            return $acara !== null;
        })->values();

        return response()->json([
            'status' => 'success',
            'data' => $acara
        ]);
    }

    /**
     * Simpan event (bookmark)
     */
    public function store(Request $request)
    {
        $request->validate([
            'id_acara' => 'required|exists:acara,id'
        ]);

        $user = Auth::user();

        // Cek apakah sudah disimpan sebelumnya
        $exists = EventTersimpan::where('id_pengguna', $user->id)
            ->where('id_acara', $request->id_acara)
            ->exists();

        if ($exists) {
            return response()->json([
                'status' => 'error',
                'message' => 'Event sudah disimpan sebelumnya'
            ], 400);
        }

        // Simpan
        $saved = EventTersimpan::create([
            'id_pengguna' => $user->id,
            'id_acara' => $request->id_acara
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Event berhasil disimpan',
            'data' => $saved
        ], 201);
    }

    /**
     * Hapus event dari simpanan (unbookmark)
     */
    public function destroy($id_acara)
    {
        $user = Auth::user();

        $deleted = EventTersimpan::where('id_pengguna', $user->id)
            ->where('id_acara', $id_acara)
            ->delete();

        if (!$deleted) {
            return response()->json([
                'status' => 'error',
                'message' => 'Event tidak ditemukan di simpanan'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Event berhasil dihapus dari simpanan'
        ]);
    }

    /**
     * Cek apakah event sudah disimpan user atau belum
     */
    public function check($id_acara)
    {
        $user = Auth::user();

        $isSaved = EventTersimpan::where('id_pengguna', $user->id)
            ->where('id_acara', $id_acara)
            ->exists();

        return response()->json([
            'status' => 'success',
            'is_saved' => $isSaved
        ]);
    }
}
