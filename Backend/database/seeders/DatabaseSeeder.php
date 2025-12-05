<?php

namespace Database\Seeders;

use App\Models\User; // <-- IMPORT USER
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash; // <-- IMPORT HASH

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Hapus user lama jika ada, agar tidak duplikat
        User::where('email', 'admin@unilafest.com')->delete();

        // Buat Admin baru
        User::create([
            'nama' => 'Admin UnilaFest',
            'email' => 'admin@gmail.com',
            'email_verified_at' => now(),
            'kata_sandi' => 'password123', // Model akan otomatis hash ini
            'peran' => 'Admin',
            'remember_token' => \Illuminate\Support\Str::random(10),
        ]);
        
        // (Opsional) Buat user biasa untuk tes
        User::where('email', 'user@unilafest.com')->delete();
        User::create([
            'nama' => 'User Biasa',
            'email' => 'user@unilafest.com',
            'email_verified_at' => now(),
            'kata_sandi' => 'password123',
            'peran' => 'User',
            'remember_token' => \Illuminate\Support\Str::random(10),
        ]);

        $this->call([
            AcaraSeeder::class,
        ]);
    }
}