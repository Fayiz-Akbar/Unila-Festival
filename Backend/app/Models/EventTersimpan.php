<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventTersimpan extends Model
{
    protected $table = 'event_tersimpan';
    
    protected $fillable = [
        'id_pengguna',
        'id_acara',
    ];

    // Relasi ke User
    public function pengguna()
    {
        return $this->belongsTo(User::class, 'id_pengguna');
    }

    // Relasi ke Acara
    public function acara()
    {
        return $this->belongsTo(Acara::class, 'id_acara');
    }
}
