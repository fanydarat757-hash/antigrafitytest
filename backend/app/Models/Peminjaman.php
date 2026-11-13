<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Peminjaman extends Model
{
    use HasFactory;

    protected $table = 'tb_peminjaman';
    protected $primaryKey = 'kd_peminjaman';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'kd_peminjaman',
        'kd_buku',
        'nama_anggota',
        'tgl_peminjaman',
        'tgl_jatuh_tempo',
        'status',
    ];

    protected $casts = [
        'tgl_peminjaman' => 'date',
        'tgl_jatuh_tempo' => 'date',
    ];

    public function buku()
    {
        return $this->belongsTo(Buku::class, 'kd_buku', 'kd_buku');
    }

    public function pengembalian()
    {
        return $this->hasOne(Pengembalian::class, 'kd_peminjaman', 'kd_peminjaman');
    }
}

