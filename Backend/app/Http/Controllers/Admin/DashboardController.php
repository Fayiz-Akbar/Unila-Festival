<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Acara;
use App\Models\PengelolaPenyelenggara;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // 1. Hitung Statistik Kartu Utama
        $counts = [
            'penyelenggara_pending' => PengelolaPenyelenggara::where('status_tautan', 'Pending')->count(),
            'acara_pending' => Acara::where('status', 'Pending')->count(),
            'acara_published' => Acara::where('status', 'Published')->count(),
            'total_user' => User::where('peran', 'User')->count(), // Filter hanya role User
        ];

        // 2. Hitung Pie Chart
        $submissionStatus = [
            [ 'name' => 'Published', 'value' => Acara::where('status', 'Published')->count() ],
            [ 'name' => 'Rejected', 'value' => Acara::where('status', 'Rejected')->count() ],
            [ 'name' => 'Pending', 'value' => Acara::where('status', 'Pending')->count() ],
        ];

        // 3. Hitung Grafik Tren Registrasi
        $range = $request->query('range', '6m'); 
        $startDate = now();
        $formatLabel = 'd M'; // Format default untuk Label Grafik

        // Tentukan Start Date
        switch ($range) {
            case '1w': $startDate = now()->subWeek(); break;
            case '1m': $startDate = now()->subMonth(); break;
            case '3m': $startDate = now()->subMonths(3); break;
            case '6m': $startDate = now()->subMonths(6); break;
            case '1y': $startDate = now()->subYear(); break;
        }

        // --- QUERY AGGREGATE YANG DIPERBAIKI ---
        // Menggunakan groupBy pada RAW function agar grouping valid di semua mode SQL
        $usersData = User::select(
                DB::raw('DATE(created_at) as date'), 
                DB::raw('count(*) as count')
            )
            ->where('created_at', '>=', $startDate)
            ->where('peran', 'User') // Opsional: Hanya hitung User biasa, Admin tidak
            ->groupBy(DB::raw('DATE(created_at)')) // <--- PENTING: Group by Raw Function
            ->orderBy('date', 'ASC')
            ->get()
            ->keyBy('date'); // Index array menggunakan tanggal agar mudah dicari

        // --- MENGISI TANGGAL KOSONG (ZERO FILLING) ---
        // Agar grafik tidak putus-putus jika ada hari tanpa pendaftar
        $trendData = [];
        $period = \Carbon\CarbonPeriod::create($startDate, now());

        foreach ($period as $date) {
            $formattedDate = $date->format('Y-m-d');
            
            // Cek apakah ada data di tanggal ini dari database
            $count = isset($usersData[$formattedDate]) ? $usersData[$formattedDate]->count : 0;

            $trendData[] = [
                'label' => $date->format($formatLabel), // Label tampil di grafik (misal: 08 Dec)
                'date' => $formattedDate, // Data asli untuk debugging
                'count' => $count
            ];
        }

        return response()->json([
            'counts' => $counts,
            'submission_status' => $submissionStatus,
            'registration_trend' => $trendData
        ]);
    }
}