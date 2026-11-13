<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Petugas;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Login Petugas atau Mahasiswa/Siswa
     * POST /api/auth/login
     */
    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string',
            'password' => 'required|string',
            'role_type' => 'nullable|string|in:petugas,siswa',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $roleType = $request->input('role_type', 'petugas');

        if ($roleType === 'siswa') {
            // Cek di tabel tb_anggota
            $siswa = DB::table('tb_anggota')->where('nisn', $request->username)->first();
            if (!$siswa || ($siswa->password !== $request->password && !Hash::check($request->password, $siswa->password))) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'NIM / NISN atau Password mahasiswa/siswa salah.'
                ], 401);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Login mahasiswa berhasil.',
                'data' => [
                    'type' => 'siswa',
                    'nisn' => $siswa->nisn,
                    'nama' => $siswa->nama_lengkap,
                    'kelas' => $siswa->kelas,
                    'token' => 'token-siswa-' . md5($siswa->nisn . time()),
                ]
            ]);
        }

        // Cek di tabel tb_petugas
        $petugas = Petugas::where('username', $request->username)->first();

        if (!$petugas || (!Hash::check($request->password, $petugas->password) && $petugas->password !== $request->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Username atau Password petugas salah.'
            ], 401);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Login petugas berhasil.',
            'data' => [
                'type' => 'petugas',
                'username' => $petugas->username,
                'nama' => $petugas->nama_petugas,
                'role' => $petugas->role ?? 'Petugas Perpustakaan',
                'token' => 'token-petugas-' . md5($petugas->username . time()),
            ]
        ]);
    }

    /**
     * Pendaftaran Akun Baru (Mahasiswa / Siswa)
     * POST /api/auth/register
     */
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'nisn' => 'required|string|max:20|unique:tb_anggota,nisn',
            'nama_lengkap' => 'required|string|max:50',
            'kelas' => 'required|string|max:30',
            'password' => 'required|string|min:4',
        ], [
            'nisn.required' => 'Nomor Identitas (NIM/NISN) wajib diisi.',
            'nisn.unique' => 'Nomor Identitas ini sudah terdaftar sebagai anggota perpustakaan.',
            'nama_lengkap.required' => 'Nama lengkap wajib diisi.',
            'kelas.required' => 'Jurusan / Kelas wajib diisi.',
            'password.min' => 'Kata sandi minimal 4 karakter.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::table('tb_anggota')->insert([
            'nisn' => $request->nisn,
            'nama_lengkap' => $request->nama_lengkap,
            'kelas' => $request->kelas,
            'jenis_kelamin' => $request->input('jenis_kelamin', 'L'),
            'password' => $request->password, // disimpan plain / hash
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Pendaftaran akun mahasiswa baru berhasil! Silakan masuk.',
            'data' => [
                'type' => 'siswa',
                'nisn' => $request->nisn,
                'nama' => $request->nama_lengkap,
                'kelas' => $request->kelas,
            ]
        ], 201);
    }
}
