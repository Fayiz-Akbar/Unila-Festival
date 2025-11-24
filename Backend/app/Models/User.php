<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Menunjuk ke tabel 'pengguna' di database.
     */
    protected $table = 'pengguna'; // Sesuaikan jika nama tabelnya 'users' atau 'pengguna'

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nama',
        'email',
        'kata_sandi',
        'peran',
        'email_verified_at',
        'remember_token',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'kata_sandi',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'kata_sandi' => 'hashed',
        ];
    }

    /**
     * Memberitahu Laravel untuk menggunakan 'kata_sandi' saat autentikasi.
     */
    public function getAuthPassword()
    {
        return $this->kata_sandi;
    }

    // --- DEFINISI RELASI ---

    /**
     * Relasi 1-ke-Banyak: Satu Pengguna bisa mengajukan banyak Acara.
     */
    public function acaraYangDiajukan()
    {
        return $this->hasMany(Acara::class, 'id_pengaju');
    }

    /**
     * Relasi Banyak-ke-Banyak: Satu Pengguna bisa mengelola banyak Penyelenggara.
     * Mengakses tabel pivot 'pengelola_penyelenggara'
     */
    public function penyelenggaraYangDikelola()
    {
        return $this->belongsToMany(Penyelenggara::class, 'pengelola_penyelenggara', 'id_pengguna', 'id_penyelenggara')
            ->withPivot('status_tautan', 'catatan_admin')
            ->withTimestamps();
    }

    /**
     * Relasi Banyak-ke-Banyak: Satu Pengguna bisa mendaftar ke banyak Acara.
     */
    public function acaraYangDidafari()
    {
        return $this->belongsToMany(Acara::class, 'pendaftaran_acara', 'id_pengguna', 'id_acara')
            ->withPivot('status_pendaftaran', 'tanggal_daftar')
            ->withTimestamps();
    }
}