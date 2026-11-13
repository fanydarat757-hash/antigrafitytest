<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Buku;
use App\Models\Peminjaman;
use App\Models\Pengembalian;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class PengembalianController extends Controller
{
    // Biaya denda keterlambatan per hari (standar perpustakaan sekolah Rp 1.000/hari)
    const TARIF_DENDA_PER_HARI = 1000;

    /**
     * Tampilkan data transaksi pengembalian
     * GET /api/pengembalian
     */
    public function index(Request $request): JsonResponse
    {
        $search = $request->query('search');
        $perPage = (int) $request->query('per_page', 10);

        $query = Pengembalian::with(['peminjaman.buku']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('kd_pengembalian', 'like', "%{$search}%")
                  ->orWhere('kd_peminjaman', 'like', "%{$search}%")
                  ->orWhere('keterangan', 'like', "%{$search}%")
                  ->orWhereHas('peminjaman', function ($sub) use ($search) {
                      $sub->where('nama_anggota', 'like', "%{$search}%")
                          ->orWhere('kd_buku', 'like', "%{$search}%")
                          ->orWhereHas('buku', function ($bukuSub) use ($search) {
                              $bukuSub->where('judul_buku', 'like', "%{$search}%");
                          });
                  });
            });
        }

        $pengembalian = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => $pengembalian
        ]);
    }

    /**
     * Hitung estimasi denda otomatis berdasarkan keterlambatan
     * POST /api/pengembalian/kalkulasi-denda
     */
    public function hitungDenda(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'kd_peminjaman' => 'required|string|exists:tb_peminjaman,kd_peminjaman',
            'tgl_pengembalian' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $peminjaman = Peminjaman::with('buku')->find($request->kd_peminjaman);

        $tglKembali = Carbon::parse($request->tgl_pengembalian)->startOfDay();
        $tglTempo = $peminjaman->tgl_jatuh_tempo
            ? Carbon::parse($peminjaman->tgl_jatuh_tempo)->startOfDay()
            : Carbon::parse($peminjaman->tgl_peminjaman)->addDays(7)->startOfDay();

        $hariTerlambat = 0;
        $totalDenda = 0;
        $keterangan = 'Tepat Waktu / Kondisi Baik';

        if ($tglKembali->gt($tglTempo)) {
            $hariTerlambat = $tglTempo->diffInDays($tglKembali);
            $totalDenda = $hariTerlambat * self::TARIF_DENDA_PER_HARI;
            $keterangan = "Terlambat {$hariTerlambat} Hari";
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'kd_peminjaman' => $peminjaman->kd_peminjaman,
                'nama_anggota' => $peminjaman->nama_anggota,
                'judul_buku' => $peminjaman->buku->judul_buku ?? '-',
                'tgl_peminjaman' => $peminjaman->tgl_peminjaman->toDateString(),
                'tgl_jatuh_tempo' => $tglTempo->toDateString(),
                'tgl_pengembalian' => $tglKembali->toDateString(),
                'hari_terlambat' => $hariTerlambat,
                'tarif_per_hari' => self::TARIF_DENDA_PER_HARI,
                'denda' => $totalDenda,
                'keterangan_default' => $keterangan,
            ]
        ]);
    }

    /**
     * Generate Kode Pengembalian Otomatis (KB001, KB002, ...)
     * GET /api/pengembalian/generate-code
     */
    public function generateCode(): JsonResponse
    {
        $last = Pengembalian::orderBy('kd_pengembalian', 'desc')->first();
        if (!$last) {
            $nextCode = 'KB001';
        } else {
            $num = (int) substr($last->kd_pengembalian, 2);
            $nextCode = 'KB' . str_pad($num + 1, 3, '0', STR_PAD_LEFT);
        }

        return response()->json([
            'status' => 'success',
            'next_code' => $nextCode
        ]);
    }

    /**
     * Simpan Transaksi Pengembalian Buku
     * POST /api/pengembalian
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'kd_pengembalian' => 'required|string|max:11|unique:tb_pengembalian,kd_pengembalian',
            'kd_peminjaman' => 'required|string|exists:tb_peminjaman,kd_peminjaman',
            'tgl_pengembalian' => 'required|date',
            'keterangan' => 'nullable|string|max:50',
            'denda' => 'nullable|numeric|min:0',
        ], [
            'kd_pengembalian.unique' => 'Kode pengembalian sudah digunakan.',
            'kd_peminjaman.exists' => 'Kode peminjaman tidak ditemukan di database.',
            'tgl_pengembalian.required' => 'Tanggal pengembalian wajib diisi.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $peminjaman = Peminjaman::find($request->kd_peminjaman);

        // Pastikan belum pernah dikembalikan
        if ($peminjaman->status === 'Dikembalikan') {
            return response()->json([
                'status' => 'error',
                'message' => 'Transaksi peminjaman ini sudah pernah diselesaikan / dikembalikan sebelumnya.'
            ], 400);
        }

        DB::beginTransaction();
        try {
            $pengembalian = Pengembalian::create([
                'kd_pengembalian' => strtoupper($request->kd_pengembalian),
                'kd_peminjaman' => $request->kd_peminjaman,
                'tgl_pengembalian' => $request->tgl_pengembalian,
                'keterangan' => $request->input('keterangan', 'Buku Dikembalikan'),
                'denda' => $request->input('denda', 0.00),
            ]);

            // Update status peminjaman menjadi 'Dikembalikan'
            $peminjaman->update(['status' => 'Dikembalikan']);

            // Pulihkan stok buku
            Buku::where('kd_buku', $peminjaman->kd_buku)->increment('stok', 1);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Pengembalian buku berhasil diproses dan stok telah diperbarui.',
                'data' => $pengembalian->load('peminjaman.buku')
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memproses pengembalian: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Detail transaksi pengembalian
     * GET /api/pengembalian/{kd_pengembalian}
     */
    public function show(string $kd_pengembalian): JsonResponse
    {
        $pengembalian = Pengembalian::with('peminjaman.buku')->find($kd_pengembalian);
        if (!$pengembalian) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data pengembalian tidak ditemukan.'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $pengembalian
        ]);
    }
}

