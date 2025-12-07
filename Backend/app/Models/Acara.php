<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Acara extends Model
{
    use HasFactory;

    protected $table = 'acara';
    protected $fillable = [
        'judul',
        'slug',
        'deskripsi',
        'poster_url',
        'id_pengaju',
        'id_penyelenggara',
        'id_kategori',
        'lokasi',
        'waktu_mulai',
        'waktu_selesai',
        'link_pendaftaran',
        'status',
        'catatan_admin_acara',
    ];

    /**
     * Tentukan cast untuk kolom tanggal
     */
    protected $casts = [
        'waktu_mulai' => 'datetime',
        'waktu_selesai' => 'datetime',
    ];

    // --- DEFINISI RELASI ---

    /**
     * Relasi Balik (Many-to-One): Acara ini diajukan oleh satu User.
     */
    public function pengaju()
    {
        return $this->belongsTo(User::class, 'id_pengaju');
    }

    /**
     * Relasi Balik (Many-to-One): Acara ini dimiliki oleh satu Penyelenggara.
     */
    public function penyelenggara()
    {
        return $this->belongsTo(Penyelenggara::class, 'id_penyelenggara');
    }

    /**
     * Relasi Balik (Many-to-One): Acara ini termasuk dalam satu Kategori.
     */
    public function kategori()
    {
        return $this->belongsTo(Kategori::class, 'id_kategori');
    }
}