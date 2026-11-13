<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Buku extends Model
{
    use HasFactory;

    protected $table = 'tb_buku';
    protected $primaryKey = 'kd_buku';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'kd_buku',
        'judul_buku',
        'pengarang',
        'penerbit',
        'tahun_terbit',
        'stok',
    ];

    public function peminjaman()
    {
        return $this->hasMany(Peminjaman::class, 'kd_buku', 'kd_buku');
    }
}

