<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Buku;
use App\Models\Peminjaman;
use App\Models\Pengembalian;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    /**
     * Endpoint ringkasan data statistik perpustakaan
     * GET /api/dashboard/stats
     */
    public function getStats(): JsonResponse
    {
        $today = Carbon::today()->toDateString();

        // 1. Total Koleksi Judul Buku
        $totalBuku = Buku::count();
        $totalStok = Buku::sum('stok');

        // 2. Total Peminjaman Aktif (Status 'Dipinjam' atau 'Terlambat')
        $peminjamanAktif = Peminjaman::whereIn('status', ['Dipinjam', 'Terlambat'])->count();

        // 3. Pengembalian Hari Ini
        $pengembalianHariIni = Pengembalian::whereDate('tgl_pengembalian', $today)->count();

        // 4. Total Denda Terkumpul
        $totalDenda = Pengembalian::sum('denda');

        // 5. Update otomatis status jika lewat tgl jatuh tempo (7 hari setelah pinjam)
        Peminjaman::where('status', 'Dipinjam')
            ->whereNotNull('tgl_jatuh_tempo')
            ->whereDate('tgl_jatuh_tempo', '<', $today)
            ->update(['status' => 'Terlambat']);

        // 6. Aktivitas Peminjaman Terbaru (5 data terakhir)
        $aktivitasTerbaru = Peminjaman::with('buku')
            ->latest('created_at')
            ->limit(6)
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'total_buku' => $totalBuku,
                'total_stok' => (int) $totalStok,
                'peminjaman_aktif' => $peminjamanAktif,
                'pengembalian_hari_ini' => $pengembalianHariIni,
                'total_denda' => (float) $totalDenda,
                'aktivitas_terbaru' => $aktivitasTerbaru,
            ]
        ]);
    }
}

