<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    /**
     * Handle Login Request
     */
    public function login(Request $request)
    {
        // 1. Validasi Input
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // 2. Cari User berdasarkan Email
            // Menggunakan with() untuk memuat relasi. Jika nama kolom salah, ini akan melempar Exception.
            $user = User::with('penyelenggaraYangDikelola')
                        ->where('email', $request->email)
                        ->first();

            // 3. Cek Password
            if (!$user || !Hash::check($request->password, $user->kata_sandi)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Email atau kata sandi salah.',
                ], 401);
            }

            // 4. Buat Token (Sanctum)
            $token = $user->createToken('auth_token')->plainTextToken;

            // 5. Return Response Sukses
            return response()->json([
                'status' => 'success',
                'message' => 'Login berhasil',
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user
            ], 200);

        } catch (\Throwable $e) {
            // LOG ERROR UNTUK DEBUGGING
            // Ini akan mengirim pesan error SQL asli ke Frontend agar Anda bisa melihat penyebabnya (misal: "Column not found: status_tautan")
            Log::error("Login Error: " . $e->getMessage());
            
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan server: ' . $e->getMessage(), // Pesan error spesifik
            ], 500);
        }
    }

    /**
     * Handle Register Request
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:pengguna,email',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi registrasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = User::create([
                'nama' => $request->nama,
                'email' => $request->email,
                'kata_sandi' => Hash::make($request->password),
                'peran' => 'User',
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;
            
            // Coba load relasi, jika gagal biarkan user login tanpa relasi dulu
            try {
                $user->load('penyelenggaraYangDikelola');
            } catch (\Exception $e) {
                // Abaikan error relasi saat register agar user tetap bisa masuk
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Registrasi berhasil',
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user
            ], 201);

        } catch (\Throwable $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal registrasi: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Handle Logout Request
     */
    public function logout(Request $request)
    {
        if ($request->user()) {
            $request->user()->currentAccessToken()->delete();
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Logout berhasil'
        ], 200);
    }

    /**
     * Get Current User
     */
    public function me(Request $request)
    {
        try {
            $user = $request->user()->load('penyelenggaraYangDikelola');
            return response()->json([
                'status' => 'success',
                'user' => $user
            ], 200);
        } catch (\Throwable $e) {
             // Fallback jika relasi error, kembalikan user saja
             return response()->json([
                'status' => 'success',
                'user' => $request->user()
            ], 200);
        }
    }

    /**
     * Update User Profile
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        // Validasi Input
        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:255',
            'email' => 'required|email|unique:pengguna,email,' . $user->id,
            'current_password' => 'required_with:password',
            'password' => 'nullable|min:6|confirmed',
            'foto_profile' => 'nullable|image|mimes:jpeg,png,jpg|max:2048', // Max 2MB
        ], [
            'current_password.required_with' => 'Password lama wajib diisi untuk mengubah password.'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Update data user
            $user->nama = $request->nama;
            $user->email = $request->email;

            // Update password jika diisi
            if ($request->filled('password')) {
                // Validasi password lama
                if (!Hash::check($request->current_password, $user->kata_sandi)) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Password lama tidak sesuai.'
                    ], 422);
                }
                
                $user->kata_sandi = Hash::make($request->password);
            }

            // Upload foto profile jika ada
            if ($request->hasFile('foto_profile')) {
                // Hapus foto lama jika ada
                if ($user->foto_profile_url) {
                    $oldPath = str_replace(asset('storage/'), '', $user->foto_profile_url);
                    \Illuminate\Support\Facades\Storage::disk('public')->delete($oldPath);
                }
                
                // Simpan foto baru
                $fotoPath = $request->file('foto_profile')->store('profiles', 'public');
                $user->foto_profile_url = asset('storage/' . $fotoPath);
            }

            $user->save();

            // Reload relasi
            $user->load('penyelenggaraYangDikelola');

            return response()->json([
                'status' => 'success',
                'message' => 'Profile berhasil diperbarui',
                'user' => $user
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan server: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send password reset link
     */
    public function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:pengguna,email',
        ], [
            'email.exists' => 'Email tidak terdaftar dalam sistem.'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = User::where('email', $request->email)->first();
            
            // Generate token reset password (dalam implementasi nyata, kirim via email)
            $token = Hash::make($user->email . now());
            
            // Simpan token ke database atau cache (untuk demo, kita return token)
            // Dalam produksi, token harus disimpan dan link dikirim via email
            
            return response()->json([
                'status' => 'success',
                'message' => 'Link reset password telah dikirim ke email Anda.',
                // CATATAN: Dalam produksi, jangan return token. Kirim via email.
                'token' => base64_encode($user->email . '|' . time()),
                'email' => $user->email
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan server: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reset password
     */
    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required',
            'email' => 'required|email|exists:pengguna,email',
            'password' => 'required|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Validasi token (dalam implementasi nyata, validasi dari database/cache)
            $tokenData = base64_decode($request->token);
            $parts = explode('|', $tokenData);
            
            if (count($parts) !== 2 || $parts[0] !== $request->email) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Token tidak valid atau sudah kadaluarsa.'
                ], 400);
            }

            // Cek apakah token belum kadaluarsa (maksimal 1 jam)
            $tokenTime = (int)$parts[1];
            if (time() - $tokenTime > 3600) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Token sudah kadaluarsa. Silakan kirim ulang permintaan reset password.'
                ], 400);
            }

            // Update password
            $user = User::where('email', $request->email)->first();
            $user->kata_sandi = Hash::make($request->password);
            $user->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Password berhasil direset. Silakan login dengan password baru Anda.'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan server: ' . $e->getMessage()
            ], 500);
        }
    }
}