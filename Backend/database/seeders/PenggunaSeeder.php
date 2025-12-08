<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User; // Pastikan menggunakan Model User yang benar
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon; // Untuk memanipulasi tanggal dan waktu

class PenggunaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Untuk contoh ini, saya akan membuat 23 data secara manual
        $userData = [
            // --- Akun Admin (1) ---
            [
                'nama' => 'Admin Unila Festival',
                'email' => 'admin@unila.ac.id',
                'kata_sandi' => Hash::make('password'), // Kata sandi akan di-hash
                'peran' => 'Admin',
                'email_verified_at' => Carbon::parse('2025-11-20 10:00:00'),
                'created_at' => Carbon::parse('2025-11-20 10:00:00'),
                'updated_at' => Carbon::parse('2025-11-20 10:00:00'),
                // 'foto_profile_url' tidak perlu diisi jika kolomnya nullable
            ],

            // --- Akun User (22) dengan tanggal bervariasi ---
            [
                'nama' => 'User Biasa 1',
                'email' => 'user1@unila.ac.id',
                'kata_sandi' => Hash::make('password'),
                'peran' => 'User',
                'created_at' => Carbon::parse('2025-11-20 11:30:00'),
                'updated_at' => Carbon::parse('2025-11-20 11:30:00'),
            ],
            [
                'nama' => 'User Biasa 2',
                'email' => 'user2@unila.ac.id',
                'kata_sandi' => Hash::make('password'),
                'peran' => 'User',
                'created_at' => Carbon::parse('2025-11-21 08:00:00'),
                'updated_at' => Carbon::parse('2025-11-21 08:00:00'),
            ],
            [
                'nama' => 'User Biasa 3',
                'email' => 'user3@unila.ac.id',
                'kata_sandi' => Hash::make('password'),
                'peran' => 'User',
                'created_at' => Carbon::parse('2025-11-21 15:45:00'),
                'updated_at' => Carbon::parse('2025-11-21 15:45:00'),
            ],
            [
                'nama' => 'User Biasa 4',
                'email' => 'user4@unila.ac.id',
                'kata_sandi' => Hash::make('password'),
                'peran' => 'User',
                'created_at' => Carbon::parse('2025-11-22 09:10:00'),
                'updated_at' => Carbon::parse('2025-11-22 09:10:00'),
            ],
            [
                'nama' => 'User Biasa 5',
                'email' => 'user5@unila.ac.id',
                'kata_sandi' => Hash::make('password'),
                'peran' => 'User',
                'created_at' => Carbon::parse('2025-11-22 17:00:00'),
                'updated_at' => Carbon::parse('2025-11-22 17:00:00'),
            ],
            [
                'nama' => 'User Biasa 6',
                'email' => 'user6@unila.ac.id',
                'kata_sandi' => Hash::make('password'),
                'peran' => 'User',
                'created_at' => Carbon::parse('2025-11-23 14:00:00'),
                'updated_at' => Carbon::parse('2025-11-23 14:00:00'),
            ],
            [
                'nama' => 'User Biasa 7',
                'email' => 'user7@unila.ac.id',
                'kata_sandi' => Hash::make('password'),
                'peran' => 'User',
                'created_at' => Carbon::parse('2025-11-24 10:30:00'),
                'updated_at' => Carbon::parse('2025-11-24 10:30:00'),
            ],
            [
                'nama' => 'User Biasa 8',
                'email' => 'user8@unila.ac.id',
                'kata_sandi' => Hash::make('password'),
                'peran' => 'User',
                'created_at' => Carbon::parse('2025-11-24 16:20:00'),
                'updated_at' => Carbon::parse('2025-11-24 16:20:00'),
            ],
            [
                'nama' => 'User Biasa 9',
                'email' => 'user9@unila.ac.id',
                'kata_sandi' => Hash::make('password'),
                'peran' => 'User',
                'created_at' => Carbon::parse('2025-11-25 08:45:00'),
                'updated_at' => Carbon::parse('2025-11-25 08:45:00'),
            ],
            [
                'nama' => 'User Biasa 10',
                'email' => 'user10@unila.ac.id',
                'kata_sandi' => Hash::make('password'),
                'peran' => 'User',
                'created_at' => Carbon::parse('2025-11-25 18:00:00'),
                'updated_at' => Carbon::parse('2025-11-25 18:00:00'),
            ],
            [
                'nama' => 'User Biasa 11',
                'email' => 'user11@unila.ac.id',
                'kata_sandi' => Hash::make('password'),
                'peran' => 'User',
                'created_at' => Carbon::parse('2025-11-26 11:15:00'),
                'updated_at' => Carbon::parse('2025-11-26 11:15:00'),
            ],
            [
                'nama' => 'User Biasa 12',
                'email' => 'user12@unila.ac.id',
                'kata_sandi' => Hash::make('password'),
                'peran' => 'User',
                'created_at' => Carbon::parse('2025-11-27 13:00:00'),
                'updated_at' => Carbon::parse('2025-11-27 13:00:00'),
            ],
            [
                'nama' => 'User Biasa 13',
                'email' => 'user13@unila.ac.id',
                'kata_sandi' => Hash::make('password'),
                'peran' => 'User',
                'created_at' => Carbon::parse('2025-11-28 09:45:00'),
                'updated_at' => Carbon::parse('2025-11-28 09:45:00'),
            ],
            [
                'nama' => 'User Biasa 14',
                'email' => 'user14@unila.ac.id',
                'kata_sandi' => Hash::make('password'),
                'peran' => 'User',
                'created_at' => Carbon::parse('2025-11-29 14:10:00'),
                'updated_at' => Carbon::parse('2025-11-29 14:10:00'),
            ],
            [
                'nama' => 'User Biasa 15',
                'email' => 'user15@unila.ac.id',
                'kata_sandi' => Hash::make('password'),
                'peran' => 'User',
                'created_at' => Carbon::parse('2025-11-30 11:00:00'),
                'updated_at' => Carbon::parse('2025-11-30 11:00:00'),
            ],
            [
                'nama' => 'User Biasa 16',
                'email' => 'user16@unila.ac.id',
                'kata_sandi' => Hash::make('password'),
                'peran' => 'User',
                'created_at' => Carbon::parse('2025-12-01 10:00:00'),
                'updated_at' => Carbon::parse('2025-12-01 10:00:00'),
            ],
            [
                'nama' => 'User Biasa 17',
                'email' => 'user17@unila.ac.id',
                'kata_sandi' => Hash::make('password'),
                'peran' => 'User',
                'created_at' => Carbon::parse('2025-12-02 12:30:00'),
                'updated_at' => Carbon::parse('2025-12-02 12:30:00'),
            ],
            [
                'nama' => 'User Biasa 18',
                'email' => 'user18@unila.ac.id',
                'kata_sandi' => Hash::make('password'),
                'peran' => 'User',
                'created_at' => Carbon::parse('2025-12-03 08:15:00'),
                'updated_at' => Carbon::parse('2025-12-03 08:15:00'),
            ],
            [
                'nama' => 'User Biasa 19',
                'email' => 'user19@unila.ac.id',
                'kata_sandi' => Hash::make('password'),
                'peran' => 'User',
                'created_at' => Carbon::parse('2025-12-04 14:00:00'),
                'updated_at' => Carbon::parse('2025-12-04 14:00:00'),
            ],
            [
                'nama' => 'User Biasa 20',
                'email' => 'user20@unila.ac.id',
                'kata_sandi' => Hash::make('password'),
                'peran' => 'User',
                'created_at' => Carbon::parse('2025-12-05 16:45:00'),
                'updated_at' => Carbon::parse('2025-12-05 16:45:00'),
            ],
            [
                'nama' => 'User Biasa 21',
                'email' => 'user21@unila.ac.id',
                'kata_sandi' => Hash::make('password'),
                'peran' => 'User',
                'created_at' => Carbon::parse('2025-12-06 09:30:00'),
                'updated_at' => Carbon::parse('2025-12-06 09:30:00'),
            ],
            [
                'nama' => 'User Biasa 22',
                'email' => 'user22@unila.ac.id',
                'kata_sandi' => Hash::make('password'),
                'peran' => 'User',
                'created_at' => Carbon::parse('2025-12-07 11:50:00'),
                'updated_at' => Carbon::parse('2025-12-07 11:50:00'),
            ],
            [
                'nama' => 'User Biasa 23',
                'email' => 'user23@unila.ac.id',
                'kata_sandi' => Hash::make('password'),
                'peran' => 'User',
                'created_at' => Carbon::parse('2025-12-08 14:25:00'),
                'updated_at' => Carbon::parse('2025-12-08 14:25:00'),
            ],
        ];

        foreach ($userData as $user) {
            User::create($user);
        }
    }
}