<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\BukuController;
use App\Http\Controllers\Api\PeminjamanController;
use App\Http\Controllers\Api\PengembalianController;
use App\Http\Controllers\Api\LaporanController;

/*
|--------------------------------------------------------------------------
| API Routes - Sistem Informasi Perpustakaan
|--------------------------------------------------------------------------
*/

// 1. Otentikasi & Registrasi Akun Baru
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/update-profile', [AuthController::class, 'updateProfile']);
    Route::get('/me', [AuthController::class, 'me']);
});

// 2. Statistik Dashboard
Route::get('/dashboard/stats', [DashboardController::class, 'getStats']);

// 3. Manajemen Master Data Buku
Route::prefix('buku')->group(function () {
    Route::get('/', [BukuController::class, 'index']);
    Route::get('/all', [BukuController::class, 'all']);
    Route::get('/generate-code', [BukuController::class, 'generateCode']);
    Route::post('/', [BukuController::class, 'store']);
    Route::get('/{kd_buku}', [BukuController::class, 'show']);
    Route::put('/{kd_buku}', [BukuController::class, 'update']);
    Route::delete('/{kd_buku}', [BukuController::class, 'destroy']);
});

// 4. Transaksi Peminjaman Buku
Route::prefix('peminjaman')->group(function () {
    Route::get('/', [PeminjamanController::class, 'index']);
    Route::get('/active', [PeminjamanController::class, 'getActive']);
    Route::get('/generate-code', [PeminjamanController::class, 'generateCode']);
    Route::post('/', [PeminjamanController::class, 'store']);
    Route::post('/{kd_peminjaman}/perpanjang', [PeminjamanController::class, 'perpanjang']);
    Route::get('/{kd_peminjaman}', [PeminjamanController::class, 'show']);
    Route::delete('/{kd_peminjaman}', [PeminjamanController::class, 'destroy']);
});

// 5. Transaksi Pengembalian & Kalkulasi Denda
Route::prefix('pengembalian')->group(function () {
    Route::get('/', [PengembalianController::class, 'index']);
    Route::get('/generate-code', [PengembalianController::class, 'generateCode']);
    Route::post('/kalkulasi-denda', [PengembalianController::class, 'hitungDenda']);
    Route::post('/', [PengembalianController::class, 'store']);
    Route::get('/{kd_pengembalian}', [PengembalianController::class, 'show']);
});

// 6. Cetak & Rekap Laporan
Route::prefix('laporan')->group(function () {
    Route::get('/buku', [LaporanController::class, 'buku']);
    Route::get('/peminjaman', [LaporanController::class, 'peminjaman']);
    Route::get('/pengembalian', [LaporanController::class, 'pengembalian']);
});
