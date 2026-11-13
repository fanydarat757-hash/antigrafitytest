<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Sesuai rancangan skripsi SMA Muhammadiyah Pekalongan: tb_peminjaman
     */
    public function up(): void
    {
        Schema::create('tb_peminjaman', function (Blueprint $table) {
            $table->string('kd_peminjaman', 11)->primary();
            $table->string('kd_buku', 11);
            $table->string('nama_anggota', 50);
            $table->date('tgl_peminjaman');
            $table->date('tgl_jatuh_tempo')->nullable();
            $table->enum('status', ['Dipinjam', 'Dikembalikan', 'Terlambat'])->default('Dipinjam');
            $table->timestamps();

            $table->foreign('kd_buku')
                  ->references('kd_buku')
                  ->on('tb_buku')
                  ->onUpdate('cascade')
                  ->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tb_peminjaman');
    }
};

