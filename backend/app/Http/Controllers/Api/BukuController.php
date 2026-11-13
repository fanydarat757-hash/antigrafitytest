<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Buku;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BukuController extends Controller
{
    /**
     * Tampilkan data buku dengan pencarian & paginasi
     * GET /api/buku
     */
    public function index(Request $request): JsonResponse
    {
        $search = $request->query('search');
        $perPage = (int) $request->query('per_page', 10);

        $query = Buku::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('kd_buku', 'like', "%{$search}%")
                  ->orWhere('judul_buku', 'like', "%{$search}%")
                  ->orWhere('pengarang', 'like', "%{$search}%")
                  ->orWhere('penerbit', 'like', "%{$search}%")
                  ->orWhere('tahun_terbit', 'like', "%{$search}%");
            });
        }

        $buku = $query->orderBy('kd_buku', 'asc')->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => $buku
        ]);
    }

    /**
     * Ambil semua daftar buku (untuk dropdown peminjaman)
     * GET /api/buku/all
     */
    public function all(): JsonResponse
    {
        $buku = Buku::where('stok', '>', 0)->orderBy('judul_buku', 'asc')->get();
        return response()->json([
            'status' => 'success',
            'data' => $buku
        ]);
    }

    /**
     * Generate Kode Buku Otomatis (BK001, BK002, ...)
     * GET /api/buku/generate-code
     */
    public function generateCode(): JsonResponse
    {
        $last = Buku::orderBy('kd_buku', 'desc')->first();
        if (!$last) {
            $nextCode = 'BK001';
        } else {
            $num = (int) substr($last->kd_buku, 2);
            $nextCode = 'BK' . str_pad($num + 1, 3, '0', STR_PAD_LEFT);
        }

        return response()->json([
            'status' => 'success',
            'next_code' => $nextCode
        ]);
    }

    /**
     * Simpan data buku baru
     * POST /api/buku
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'kd_buku' => 'required|string|max:11|unique:tb_buku,kd_buku',
            'judul_buku' => 'required|string|max:100',
            'pengarang' => 'required|string|max:50',
            'penerbit' => 'required|string|max:60',
            'tahun_terbit' => 'required|string|max:10',
            'stok' => 'nullable|integer|min:0',
        ], [
            'kd_buku.unique' => 'Kode buku sudah digunakan.',
            'judul_buku.required' => 'Judul buku wajib diisi.',
            'pengarang.required' => 'Pengarang buku wajib diisi.',
            'penerbit.required' => 'Penerbit buku wajib diisi.',
            'tahun_terbit.required' => 'Tahun terbit wajib diisi.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $buku = Buku::create([
            'kd_buku' => strtoupper($request->kd_buku),
            'judul_buku' => $request->judul_buku,
            'pengarang' => $request->pengarang,
            'penerbit' => $request->penerbit,
            'tahun_terbit' => $request->tahun_terbit,
            'stok' => $request->input('stok', 1),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Data buku berhasil ditambahkan.',
            'data' => $buku
        ], 201);
    }

    /**
     * Ambil 1 buku spesifik
     * GET /api/buku/{kd_buku}
     */
    public function show(string $kd_buku): JsonResponse
    {
        $buku = Buku::find($kd_buku);
        if (!$buku) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data buku tidak ditemukan.'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $buku
        ]);
    }

    /**
     * Update data buku
     * PUT /api/buku/{kd_buku}
     */
    public function update(Request $request, string $kd_buku): JsonResponse
    {
        $buku = Buku::find($kd_buku);
        if (!$buku) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data buku tidak ditemukan.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'judul_buku' => 'required|string|max:100',
            'pengarang' => 'required|string|max:50',
            'penerbit' => 'required|string|max:60',
            'tahun_terbit' => 'required|string|max:10',
            'stok' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $buku->update($request->only(['judul_buku', 'pengarang', 'penerbit', 'tahun_terbit', 'stok']));

        return response()->json([
            'status' => 'success',
            'message' => 'Data buku berhasil diperbarui.',
            'data' => $buku
        ]);
    }

    /**
     * Hapus data buku
     * DELETE /api/buku/{kd_buku}
     */
    public function destroy(string $kd_buku): JsonResponse
    {
        $buku = Buku::find($kd_buku);
        if (!$buku) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data buku tidak ditemukan.'
            ], 404);
        }

        // Cek apakah buku sedang dalam masa peminjaman aktif
        $sedangDipinjam = $buku->peminjaman()->whereIn('status', ['Dipinjam', 'Terlambat'])->exists();
        if ($sedangDipinjam) {
            return response()->json([
                'status' => 'error',
                'message' => 'Buku tidak dapat dihapus karena masih tercatat sedang dipinjam oleh siswa.'
            ], 400);
        }

        $buku->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Data buku berhasil dihapus.'
        ]);
    }
}

