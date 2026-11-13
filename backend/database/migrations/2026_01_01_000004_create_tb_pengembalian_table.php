<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Sesuai rancangan skripsi SMA Muhammadiyah Pekalongan: tb_pengembalian
     */
    public function up(): void
    {
        Schema::create('tb_pengembalian', function (Blueprint $table) {
            $table->string('kd_pengembalian', 11)->primary();
            $table->string('kd_peminjaman', 11);
            $table->date('tgl_pengembalian');
            $table->string('keterangan', 50)->default('Selesai');
            $table->decimal('denda', 12, 2)->default(0.00);
            $table->timestamps();

            $table->foreign('kd_peminjaman')
                  ->references('kd_peminjaman')
                  ->on('tb_peminjaman')
                  ->onUpdate('cascade')
                  ->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tb_pengembalian');
    }
};

