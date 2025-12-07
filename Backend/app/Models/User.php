<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\DB; // <-- PENTING: Import DB untuk pengecekan status

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Menunjuk ke tabel 'pengguna' di database.
     */
    protected $table = 'pengguna';

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
        'foto_profile_url',
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
     * Memberitahu Laravel untuk menggunakan kolom 'kata_sandi' sebagai password saat autentikasi.
     */
    public function getAuthPassword()
    {
        return $this->kata_sandi;
    }

    // =========================================================
    // === LOGIC GATEKEEPER (PENTING UNTUK FRONTEND NAVBAR) ===
    // =========================================================

    /**
     * Menambahkan atribut 'is_penyelenggara' ke dalam response JSON user.
     */
    protected $appends = ['is_penyelenggara'];

    /**
     * Accessor: Mengecek apakah user ini terdaftar sebagai pengelola yang APPROVED.
     * Frontend akan menggunakan user.is_penyelenggara (true/false) untuk menampilkan menu.
     */
    public function getIsPenyelenggaraAttribute()
    {
        // Menggunakan DB Facade agar lebih ringan/cepat saat login
        return DB::table('pengelola_penyelenggara')
            ->where('id_pengguna', $this->id)
            ->where('status_tautan', 'Approved') // Hanya status Approved yang dianggap valid
            ->exists();
    }

    // =========================================================
    // === DEFINISI RELASI ===
    // =========================================================

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
}