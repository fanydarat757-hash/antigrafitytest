<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with sample data.
     */
    public function run(): void
    {
        // 1. Petugas (Multi-Peran: Kepala Perpustakaan, Petugas Sirkulasi, dan Kepala Sekolah)
        DB::table('tb_petugas')->updateOrInsert(
            ['username' => 'admin'],
            [
                'nama_petugas' => 'Siti Farida, A.Md',
                'role' => 'kepala_perpus',
                'jabatan' => 'Kepala Perpustakaan',
                'password' => Hash::make('admin123'),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        DB::table('tb_petugas')->updateOrInsert(
            ['username' => 'petugas2'],
            [
                'nama_petugas' => 'Samsul Arifin, S.Pd',
                'role' => 'petugas_sirkulasi',
                'jabatan' => 'Petugas Peminjaman & Sirkulasi',
                'password' => Hash::make('petugas123'),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        DB::table('tb_petugas')->updateOrInsert(
            ['username' => 'kepsek'],
            [
                'nama_petugas' => 'Ahmad Marzuki, S.Pd.I',
                'role' => 'kepala_sekolah',
                'jabatan' => 'Kepala Sekolah (Supervisor)',
                'password' => Hash::make('kepsek123'),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // 2. Master Data Buku Pelajaran & Pengetahuan SMA
        $buku = [
            [
                'kd_buku' => 'BK001',
                'judul_buku' => 'Matematika Peminatan Kelas XI',
                'pengarang' => 'Sukino',
                'penerbit' => 'Erlangga',
                'tahun_terbit' => '2019',
                'stok' => 5,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'kd_buku' => 'BK002',
                'judul_buku' => 'Fisika SMA/MA Kelas XII',
                'pengarang' => 'Marthen Kanginan',
                'penerbit' => 'Erlangga',
                'tahun_terbit' => '2020',
                'stok' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'kd_buku' => 'BK003',
                'judul_buku' => 'Biologi Sel & Genetika',
                'pengarang' => 'Campbell & Reece',
                'penerbit' => 'Erlangga',
                'tahun_terbit' => '2018',
                'stok' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'kd_buku' => 'BK004',
                'judul_buku' => 'Sejarah Kebudayaan Islam',
                'pengarang' => 'Badri Yatim',
                'penerbit' => 'Rajawali Pers',
                'tahun_terbit' => '2017',
                'stok' => 6,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'kd_buku' => 'BK005',
                'judul_buku' => 'Kemuhammadiyahan Kelas X',
                'pengarang' => 'Majelis Dikdasmen',
                'penerbit' => 'Suara Muhammadiyah',
                'tahun_terbit' => '2021',
                'stok' => 8,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'kd_buku' => 'BK006',
                'judul_buku' => 'Bahasa Indonesia Tingkat Lanjut',
                'pengarang' => 'E. Kosasih',
                'penerbit' => 'Yrama Widya',
                'tahun_terbit' => '2022',
                'stok' => 5,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('tb_buku')->insertOrIgnore($buku);

        // 3. Data Transaksi Peminjaman
        $peminjaman = [
            [
                'kd_peminjaman' => 'PJ001',
                'kd_buku' => 'BK001',
                'nama_anggota' => 'Ahmad Fauzi',
                'tgl_peminjaman' => Carbon::now()->subDays(10)->toDateString(),
                'tgl_jatuh_tempo' => Carbon::now()->subDays(3)->toDateString(),
                'status' => 'Terlambat',
                'created_at' => Carbon::now()->subDays(10),
                'updated_at' => Carbon::now(),
            ],
            [
                'kd_peminjaman' => 'PJ002',
                'kd_buku' => 'BK002',
                'nama_anggota' => 'Siti Aisyah',
                'tgl_peminjaman' => Carbon::now()->subDays(2)->toDateString(),
                'tgl_jatuh_tempo' => Carbon::now()->addDays(5)->toDateString(),
                'status' => 'Dipinjam',
                'created_at' => Carbon::now()->subDays(2),
                'updated_at' => Carbon::now(),
            ],
            [
                'kd_peminjaman' => 'PJ003',
                'kd_buku' => 'BK005',
                'nama_anggota' => 'Rizky Ramadhan',
                'tgl_peminjaman' => Carbon::now()->subDays(14)->toDateString(),
                'tgl_jatuh_tempo' => Carbon::now()->subDays(7)->toDateString(),
                'status' => 'Dikembalikan',
                'created_at' => Carbon::now()->subDays(14),
                'updated_at' => Carbon::now()->subDays(6),
            ],
        ];

        DB::table('tb_peminjaman')->insertOrIgnore($peminjaman);

        // 4. Data Transaksi Pengembalian
        $pengembalian = [
            [
                'kd_pengembalian' => 'KB001',
                'kd_peminjaman' => 'PJ003',
                'tgl_pengembalian' => Carbon::now()->subDays(6)->toDateString(),
                'keterangan' => 'Terlambat 1 Hari (Buku Baik)',
                'denda' => 1000.00,
                'created_at' => Carbon::now()->subDays(6),
                'updated_at' => Carbon::now()->subDays(6),
            ],
        ];

        DB::table('tb_pengembalian')->insertOrIgnore($pengembalian);
    }
}

