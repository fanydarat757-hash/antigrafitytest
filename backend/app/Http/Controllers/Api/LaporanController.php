<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Buku;
use App\Models\Peminjaman;
use App\Models\Pengembalian;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LaporanController extends Controller
{
    /**
     * Data metadata kop surat dan penandatangan dokumen
     */
    private function getMetadata(): array
    {
        return [
            'instansi' => 'SMA Muhammadiyah Pekalongan',
            'kabupaten' => 'Lampung Timur',
            'alamat' => 'Jl. Raya Pekalongan, Kec. Pekalongan, Kab. Lampung Timur, Prov. Lampung',
            'kepala_sekolah' => 'Ahmad Marzuki, S.Pd.I',
            'petugas_perpus' => 'Siti Farida, A.Md',
            'tgl_cetak' => Carbon::now()->isoFormat('D MMMM Y'),
        ];
    }

    /**
     * Laporan Seluruh Master Data Buku
     * GET /api/laporan/buku
     */
    public function buku(): JsonResponse
    {
        $data = Buku::orderBy('kd_buku', 'asc')->get();

        return response()->json([
            'status' => 'success',
            'metadata' => $this->getMetadata(),
            'total_judul' => $data->count(),
            'total_eksemplar' => $data->sum('stok'),
            'data' => $data
        ]);
    }

    /**
     * Laporan Data Peminjaman Buku dengan Filter Rentang Tanggal
     * GET /api/laporan/peminjaman
     */
    public function peminjaman(Request $request): JsonResponse
    {
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');
        $status = $request->query('status');

        $query = Peminjaman::with('buku');

        if ($startDate && $endDate) {
            $query->whereBetween('tgl_peminjaman', [$startDate, $endDate]);
        }

        if ($status && in_array($status, ['Dipinjam', 'Dikembalikan', 'Terlambat'])) {
            $query->where('status', $status);
        }

        $data = $query->orderBy('tgl_peminjaman', 'asc')->get();

        return response()->json([
            'status' => 'success',
            'metadata' => $this->getMetadata(),
            'filter' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'status' => $status ?? 'Semua',
            ],
            'total_transaksi' => $data->count(),
            'data' => $data
        ]);
    }

    /**
     * Laporan Data Pengembalian Buku & Rekap Denda dengan Filter Rentang Tanggal
     * GET /api/laporan/pengembalian
     */
    public function pengembalian(Request $request): JsonResponse
    {
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        $query = Pengembalian::with(['peminjaman.buku']);

        if ($startDate && $endDate) {
            $query->whereBetween('tgl_pengembalian', [$startDate, $endDate]);
        }

        $data = $query->orderBy('tgl_pengembalian', 'asc')->get();

        return response()->json([
            'status' => 'success',
            'metadata' => $this->getMetadata(),
            'filter' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
            'total_transaksi' => $data->count(),
            'total_denda' => $data->sum('denda'),
            'data' => $data
        ]);
    }
}

