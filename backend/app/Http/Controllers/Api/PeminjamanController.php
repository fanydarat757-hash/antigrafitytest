<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Buku;
use App\Models\Peminjaman;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class PeminjamanController extends Controller
{
    /**
     * Tampilkan data transaksi peminjaman
     * GET /api/peminjaman
     */
    public function index(Request $request): JsonResponse
    {
        $search = $request->query('search');
        $status = $request->query('status');
        $perPage = (int) $request->query('per_page', 10);

        $query = Peminjaman::with('buku', 'pengembalian');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('kd_peminjaman', 'like', "%{$search}%")
                  ->orWhere('nama_anggota', 'like', "%{$search}%")
                  ->orWhere('kd_buku', 'like', "%{$search}%")
                  ->orWhereHas('buku', function ($sub) use ($search) {
                      $sub->where('judul_buku', 'like', "%{$search}%");
                  });
            });
        }

        if ($status && in_array($status, ['Dipinjam', 'Dikembalikan', 'Terlambat'])) {
            $query->where('status', $status);
        }

        // Cek keterlambatan otomatis untuk peminjaman aktif
        $today = Carbon::today();
        Peminjaman::where('status', 'Dipinjam')
            ->whereNotNull('tgl_jatuh_tempo')
            ->whereDate('tgl_jatuh_tempo', '<', $today)
            ->update(['status' => 'Terlambat']);

        $peminjaman = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => $peminjaman
        ]);
    }

    /**
     * Ambil daftar peminjaman aktif (belum dikembalikan) untuk form transaksi pengembalian
     * GET /api/peminjaman/active
     */
    public function getActive(): JsonResponse
    {
        $active = Peminjaman::with('buku')
            ->whereIn('status', ['Dipinjam', 'Terlambat'])
            ->orderBy('tgl_peminjaman', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $active
        ]);
    }

    /**
     * Generate Kode Peminjaman Otomatis (PJ001, PJ002, ...)
     * GET /api/peminjaman/generate-code
     */
    public function generateCode(): JsonResponse
    {
        $last = Peminjaman::orderBy('kd_peminjaman', 'desc')->first();
        if (!$last) {
            $nextCode = 'PJ001';
        } else {
            $num = (int) substr($last->kd_peminjaman, 2);
            $nextCode = 'PJ' . str_pad($num + 1, 3, '0', STR_PAD_LEFT);
        }

        return response()->json([
            'status' => 'success',
            'next_code' => $nextCode
        ]);
    }

    /**
     * Simpan Transaksi Peminjaman Baru
     * POST /api/peminjaman
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'kd_peminjaman' => 'required|string|max:11|unique:tb_peminjaman,kd_peminjaman',
            'kd_buku' => 'required|string|exists:tb_buku,kd_buku',
            'nama_anggota' => 'required|string|max:50',
            'tgl_peminjaman' => 'required|date',
            'durasi_hari' => 'nullable|integer|min:1|max:30',
        ], [
            'kd_peminjaman.unique' => 'Kode peminjaman sudah digunakan.',
            'kd_buku.exists' => 'Buku yang dipilih tidak terdaftar di sistem.',
            'nama_anggota.required' => 'Nama anggota / siswa peminjam wajib diisi.',
            'tgl_peminjaman.required' => 'Tanggal peminjaman wajib diisi.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        // Cek stok buku
        $buku = Buku::find($request->kd_buku);
        if ($buku->stok < 1) {
            return response()->json([
                'status' => 'error',
                'message' => "Stok buku '{$buku->judul_buku}' sedang habis / telah dipinjam seluruhnya."
            ], 400);
        }

        DB::beginTransaction();
        try {
            $durasi = (int) $request->input('durasi_hari', 7);
            $tglPinjam = Carbon::parse($request->tgl_peminjaman);
            $tglJatuhTempo = $tglPinjam->copy()->addDays($durasi);

            $peminjaman = Peminjaman::create([
                'kd_peminjaman' => strtoupper($request->kd_peminjaman),
                'kd_buku' => $request->kd_buku,
                'nama_anggota' => $request->nama_anggota,
                'tgl_peminjaman' => $tglPinjam->toDateString(),
                'tgl_jatuh_tempo' => $tglJatuhTempo->toDateString(),
                'status' => 'Dipinjam',
            ]);

            // Kurangi stok buku
            $buku->decrement('stok', 1);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Transaksi peminjaman berhasil disimpan.',
                'data' => $peminjaman->load('buku')
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memproses peminjaman: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Detail transaksi peminjaman
     * GET /api/peminjaman/{kd_peminjaman}
     */
    public function show(string $kd_peminjaman): JsonResponse
    {
        $peminjaman = Peminjaman::with('buku', 'pengembalian')->find($kd_peminjaman);
        if (!$peminjaman) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data peminjaman tidak ditemukan.'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $peminjaman
        ]);
    }

    /**
     * Batalkan / Hapus Transaksi Peminjaman
     * DELETE /api/peminjaman/{kd_peminjaman}
     */
    public function destroy(string $kd_peminjaman): JsonResponse
    {
        $peminjaman = Peminjaman::find($kd_peminjaman);
        if (!$peminjaman) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data peminjaman tidak ditemukan.'
            ], 404);
        }

        DB::beginTransaction();
        try {
            // Jika status masih Dipinjam atau Terlambat, kembalikan stok buku
            if (in_array($peminjaman->status, ['Dipinjam', 'Terlambat'])) {
                Buku::where('kd_buku', $peminjaman->kd_buku)->increment('stok', 1);
            }

            // Hapus record pengembalian jika ada
            $peminjaman->pengembalian()->delete();
            $peminjaman->delete();

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Data peminjaman berhasil dihapus.'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menghapus data: ' . $e->getMessage()
            ], 500);
        }
    }
}

