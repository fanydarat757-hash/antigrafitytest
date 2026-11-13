<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Sesuai rancangan skripsi SMA Muhammadiyah Pekalongan: tb_petugas
     */
    public function up(): void
    {
        Schema::create('tb_petugas', function (Blueprint $table) {
            $table->string('username', 30)->primary();
            $table->string('nama_petugas', 50)->default('Petugas Perpustakaan');
            $table->string('role', 50)->default('petugas_sirkulasi'); // kepala_perpus, petugas_sirkulasi, kepala_sekolah
            $table->string('jabatan', 100)->default('Petugas Perpustakaan');
            $table->string('password', 255); // Bcrypt hashed
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tb_petugas');
    }
};

