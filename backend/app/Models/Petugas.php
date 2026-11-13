<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Petugas extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $table = 'tb_petugas';
    protected $primaryKey = 'username';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'username',
        'nama_petugas',
        'role',
        'jabatan',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];
}

