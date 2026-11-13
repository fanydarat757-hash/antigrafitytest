<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pengembalian extends Model
{
    use HasFactory;

    protected $table = 'tb_pengembalian';
    protected $primaryKey = 'kd_pengembalian';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'kd_pengembalian',
        'kd_peminjaman',
        'tgl_pengembalian',
        'keterangan',
        'denda',
    ];

    protected $casts = [
        'tgl_pengembalian' => 'date',
        'denda' => 'decimal:2',
    ];

    public function peminjaman()
    {
        return $this->belongsTo(Peminjaman::class, 'kd_peminjaman', 'kd_peminjaman');
    }
}

