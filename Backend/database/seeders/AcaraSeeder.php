<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;

class AcaraSeeder extends Seeder
{
    public function run(): void
    {
        // ============================================================
        // 1. USER PENGAJU (Tabel: pengguna)
        // ============================================================
        // Pastikan user ada untuk 'id_pengaju'
        $userEmail = 'bem@unila.ac.id';
        $user = DB::table('pengguna')->where('email', $userEmail)->first();
        
        if (!$user) {
            $userId = DB::table('pengguna')->insertGetId([
                'nama' => 'Admin BEM',
                'email' => $userEmail,
                'kata_sandi' => Hash::make('password123'),
                'peran' => 'User',
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } else {
            $userId = $user->id;
        }

        // ============================================================
        // 2. KATEGORI (Tabel: kategori)
        // ============================================================
        $kategoris = [
            'Seminar & Talkshow',
            'Konser Musik',
            'Workshop & Pelatihan',
            'Lomba & Kompetisi',
            'Pameran & Expo',
        ];

        $kategoriIds = [];
        foreach ($kategoris as $namaKategori) {
            $existing = DB::table('kategori')->where('nama_kategori', $namaKategori)->first();
            if ($existing) {
                $kategoriIds[] = $existing->id;
            } else {
                $id = DB::table('kategori')->insertGetId([
                    'nama_kategori' => $namaKategori,
                    'slug' => Str::slug($namaKategori),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                $kategoriIds[] = $id;
            }
        }

        // ============================================================
        // 3. PENYELENGGARA (Tabel: penyelenggara)
        // ============================================================
        // Kolom: nama_penyelenggara, tipe, deskripsi_singkat, logo_url
        $penyelenggaraNama = 'BEM Unila';
        $penyelenggara = DB::table('penyelenggara')->where('nama_penyelenggara', $penyelenggaraNama)->first();

        if ($penyelenggara) {
            $penyelenggaraId = $penyelenggara->id;
        } else {
            $penyelenggaraId = DB::table('penyelenggara')->insertGetId([
                'nama_penyelenggara' => $penyelenggaraNama,
                'tipe' => 'Internal', // Enum: Internal / Eksternal
                'deskripsi_singkat' => 'Badan Eksekutif Mahasiswa Universitas Lampung',
                'logo_url' => null, // Boleh null jika belum ada gambar
                'dokumen_validasi_url' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Link User ke Penyelenggara (Tabel Pivot)
            DB::table('pengelola_penyelenggara')->insertOrIgnore([
                'id_pengguna' => $userId,
                'id_penyelenggara' => $penyelenggaraId,
                'status_tautan' => 'Approved',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // ============================================================
        // 4. DATA ACARA (Tabel: acara)
        // ============================================================
        // Kolom: judul, slug, deskripsi, poster_url, id_pengaju, id_penyelenggara, id_kategori, lokasi, waktu_mulai, waktu_selesai, link_pendaftaran, status
        
        $templateAcara = [
            ['Seminar Nasional AI 2025', 0, 'GSG Unila', 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=600&q=80'],
            ['Konser Musik Harmoni', 1, 'Lapangan Rektorat', 'https://images.unsplash.com/photo-1459749411177-2a296581dca1?w=600&q=80'],
            ['Workshop UI/UX Design', 2, 'Lab FMIPA', 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&q=80'],
            ['Hackathon Coding 24H', 3, 'Gedung Ilkom', 'https://images.unsplash.com/photo-1504384308090-c54be3855462?w=600&q=80'],
            ['Unila Job Fair 2025', 4, 'GSG Unila', 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&q=80'],
            ['Lomba Fotografi Kampus', 3, 'Online Submission', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80'],
            ['Festival Kuliner Lampung', 4, 'Parkiran FEB', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80'],
            ['Pelatihan Public Speaking', 2, 'Aula FKIP', 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80'],
            ['E-Sport Mobile Legends', 3, 'Student Center', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80'],
            ['Jazz Goes To Campus', 1, 'Embung Unila', 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&q=80'],
            ['Bedah Buku Sejarah', 0, 'Perpustakaan', 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&q=80'],
            ['Pameran Seni Rupa', 4, 'Gedung Kesenian', 'https://images.unsplash.com/photo-1460661618165-55e8bsd7e804?w=600&q=80'],
        ];

        foreach ($templateAcara as $data) {
            $judul = $data[0];
            $katIdx = $data[1];
            $lokasi = $data[2];
            $imgUrl = $data[3];
            
            $waktuMulai = Carbon::now()->addDays(rand(1, 60));
            $waktuSelesai = (clone $waktuMulai)->addHours(3);

            // Buat slug unik
            $slug = Str::slug($judul);
            if (DB::table('acara')->where('slug', $slug)->exists()) {
                $slug = $slug . '-' . rand(1, 100);
            }

            DB::table('acara')->insert([
                'judul' => $judul,
                'slug' => $slug,
                'deskripsi' => 'Bergabunglah dalam ' . $judul . ' yang akan diselenggarakan di ' . $lokasi . '. Acara ini terbuka untuk umum dan mahasiswa Unila.',
                'poster_url' => $imgUrl, // Link gambar dari internet
                'id_pengaju' => $userId,
                'id_penyelenggara' => $penyelenggaraId,
                'id_kategori' => $kategoriIds[$katIdx] ?? $kategoriIds[0],
                'lokasi' => $lokasi,
                'waktu_mulai' => $waktuMulai,
                'waktu_selesai' => $waktuSelesai,
                'link_pendaftaran' => 'https://forms.google.com/example',
                'status' => 'Published', // Wajib 'Published' agar tampil di Frontend
                'catatan_admin_acara' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}