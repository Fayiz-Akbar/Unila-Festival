<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Import semua controller sesuai wilayah PJ
// (Tidak masalah jika filenya belum ada, kita mendaftarkannya sekarang)
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PublicAcaraController;
use App\Http\Controllers\Registration\PendaftaranController;
use App\Http\Controllers\Submission\AcaraSubmissionController;
use App\Http\Controllers\Submission\PenyelenggaraController;
use App\Http\Controllers\Admin\KategoriController;
use App\Http\Controllers\Admin\ValidasiAcaraController;
use App\Http\Controllers\Admin\ValidasiPenyelenggaraController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\EventTersimpanController;

// ===================================================================
// == 1. RUTE PUBLIK (WILAYAH PJ 3 - Public)
// == Endpoint ini tidak memerlukan login.
// ===================================================================

Route::get('/acara', [PublicAcaraController::class, 'index']); // Dapatkan semua acara (published)
Route::get('/acara/{slug}', [PublicAcaraController::class, 'show']); // Dapatkan detail 1 acara
Route::get('/kategori', [PublicAcaraController::class, 'getAllKategori']); // Dapatkan semua kategori untuk filter

// ===================================================================
// == 2. RUTE AUTENTIKASI (WILAYAH PJ 2 - Auth)
// == Endpoint untuk registrasi dan login.
// ===================================================================

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// ===================================================================
// == 3. RUTE USER TERPROTEKSI (Perlu Login)
// == Endpoint ini memerlukan token (via middleware 'auth:sanctum').
// ===================================================================

Route::middleware('auth:sanctum')->group(function () {
    
    // Endpoint Auth
    Route::post('/logout', [AuthController::class, 'logout']); // PJ 2
    Route::get('/user', function (Request $request) { // PJ 2
        return $request->user(); // Mendapatkan data user yg sedang login
    });
    Route::put('/user/profile', [AuthController::class, 'updateProfile']); // Update Profile

    // --- WILAYAH PJ 2 (Submission) ---
    Route::prefix('submission')->group(function () {
        // Rute untuk Penyelenggara
        Route::get('/penyelenggara', [PenyelenggaraController::class, 'index']); // Dapat data penyelenggara milik user
        Route::post('/penyelenggara', [PenyelenggaraController::class, 'store']); // Mengajukan penyelenggara baru
        
        // Rute untuk Acara
        Route::get('/acara', [AcaraSubmissionController::class, 'index']); // Dapat data acara milik user
        Route::post('/acara', [AcaraSubmissionController::class, 'store']); // Mengajukan acara baru
        Route::put('/acara/{id}', [AcaraSubmissionController::class, 'update']); // Update acara (jika diizinkan)
        Route::delete('/acara/{id}', [AcaraSubmissionController::class, 'destroy']); // Hapus/batalkan acara
    });

    // --- WILAYAH PJ 3 (Registration) ---
    Route::prefix('registration')->group(function () {
        Route::get('/agenda', [PendaftaranController::class, 'index']); // Dapat "Agenda Saya"
        Route::post('/daftar', [PendaftaranController::class, 'store']); // Mendaftar ke sebuah acara
    });

    // --- Event Tersimpan (Bookmark) ---
    Route::get('/event-tersimpan', [EventTersimpanController::class, 'index']); // List event tersimpan
    Route::post('/event-tersimpan', [EventTersimpanController::class, 'store']); // Simpan event
    Route::delete('/event-tersimpan/{id_acara}', [EventTersimpanController::class, 'destroy']); // Hapus dari simpanan
    Route::get('/event-tersimpan/check/{id_acara}', [EventTersimpanController::class, 'check']); // Cek status tersimpan
});

// ===================================================================
// == 4. RUTE ADMIN TERPROTEKSI (Perlu Login + Peran Admin)
// == WILAYAH PJ 1 (Admin)
// ===================================================================

// Middleware 'auth:sanctum' memastikan harus login.
// Middleware 'admin' (yang akan kita buat nanti) memastikan harus peran 'Admin'.
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    
    // Rute Validasi
    Route::get('/validasi/penyelenggara', [ValidasiPenyelenggaraController::class, 'index']); // Get data penyelenggara (pending)
    Route::post('/validasi/penyelenggara/{id}', [ValidasiPenyelenggaraController::class, 'validatePenyelenggara']); // Approve/Reject
    
    Route::get('/validasi/acara', [ValidasiAcaraController::class, 'index']); // Get data acara (pending)
    Route::post('/validasi/acara/{id}', [ValidasiAcaraController::class, 'validateAcara']); // Approve/Reject
    
    // Rute CRUD Kategori
    Route::apiResource('/kategori', KategoriController::class);
    
    // Route Dashboard Statistik
    Route::get('/dashboard-stats', [DashboardController::class, 'index']);
    // (Opsional) Rute CRUD Pengguna & Penyelenggara penuh
    // Route::apiResource('/users', ...);
    // Route::apiResource('/penyelenggara', ...);
});