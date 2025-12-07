<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// --- Import Controllers ---
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PublicAcaraController;
use App\Http\Controllers\Submission\AcaraSubmissionController;
use App\Http\Controllers\Submission\PenyelenggaraController;
// Admin Controllers
use App\Http\Controllers\Admin\KategoriController;
use App\Http\Controllers\Admin\ValidasiAcaraController;
use App\Http\Controllers\Admin\ValidasiPenyelenggaraController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\EventTersimpanController;
use App\Http\Controllers\Admin\ManajemenAcaraController; // <-- Import Baru

// ===================================================================
// == 1. RUTE PUBLIK (Tanpa Login)
// ===================================================================

Route::get('/acara', [PublicAcaraController::class, 'index']); 
Route::get('/acara/{slug}', [PublicAcaraController::class, 'show']); 
Route::get('/kategori', [PublicAcaraController::class, 'getAllKategori']); 

// ===================================================================
// == 2. RUTE AUTENTIKASI
// ===================================================================

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// ===================================================================
// == 3. RUTE TERPROTEKSI (Login User/Admin)
// ===================================================================

Route::middleware('auth:sanctum')->group(function () {
    
    // --- Auth & Profile ---
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);

    // --- Submission (Penyelenggara & Acara) ---
    Route::prefix('submission')->group(function () {
        Route::get('/penyelenggara', [PenyelenggaraController::class, 'index']);
        Route::post('/penyelenggara', [PenyelenggaraController::class, 'store']);
        
        Route::get('/acara', [AcaraSubmissionController::class, 'index']);
        Route::post('/acara', [AcaraSubmissionController::class, 'store']);
        Route::put('/acara/{id}', [AcaraSubmissionController::class, 'update']);
        Route::delete('/acara/{id}', [AcaraSubmissionController::class, 'destroy']);
    });

    // --- Event Tersimpan (Bookmark) ---
    Route::get('/event-tersimpan', [EventTersimpanController::class, 'index']); // List event tersimpan
    Route::post('/event-tersimpan', [EventTersimpanController::class, 'store']); // Simpan event
    Route::delete('/event-tersimpan/{id_acara}', [EventTersimpanController::class, 'destroy']); // Hapus dari simpanan
    Route::get('/event-tersimpan/check/{id_acara}', [EventTersimpanController::class, 'check']); // Cek status tersimpan
});

// ===================================================================
// == 4. RUTE ADMIN (Login + Role Admin)
// ===================================================================

Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    
    // Dashboard Stats
    Route::get('/dashboard-stats', [DashboardController::class, 'index']);

    // Validasi
    Route::get('/validasi/penyelenggara', [ValidasiPenyelenggaraController::class, 'index']);
    Route::post('/validasi/penyelenggara/{id}', [ValidasiPenyelenggaraController::class, 'validatePenyelenggara']);
    
    Route::get('/validasi/acara', [ValidasiAcaraController::class, 'index']);
    Route::post('/validasi/acara/{id}', [ValidasiAcaraController::class, 'validateAcara']);
    
    // CRUD Kategori
    Route::apiResource('/kategori', KategoriController::class);

    // --- FITUR BARU: Manajemen Acara (Full Control) ---
    Route::get('/manajemen-acara', [ManajemenAcaraController::class, 'index']);
    Route::post('/manajemen-acara/{id}/batalkan', [ManajemenAcaraController::class, 'batalkan']);
    Route::delete('/manajemen-acara/{id}', [ManajemenAcaraController::class, 'destroy']);
});