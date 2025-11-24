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
}