-- =========================================================================
-- DATABASE DUMP LENGKAP: skripsi_perpus
-- Sistem Informasi Perpustakaan SMA Muhammadiyah 1 Pekalongan, Lampung Timur
-- Dilengkapi 25 Data Master Buku, 25 Anggota, 25 Peminjaman, & 20 Pengembalian
-- =========================================================================

CREATE DATABASE IF NOT EXISTS `skripsi_perpus` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `skripsi_perpus`;

SET FOREIGN_KEY_CHECKS = 0;

-- -------------------------------------------------------------------------
-- 1. Tabel Master Petugas (Aktor Sistem / RBAC)
-- -------------------------------------------------------------------------
DROP TABLE IF EXISTS `tb_petugas`;
CREATE TABLE `tb_petugas` (
  `username` varchar(30) NOT NULL,
  `nama_petugas` varchar(50) NOT NULL DEFAULT 'Petugas Perpustakaan',
  `role` varchar(50) DEFAULT 'petugas_sirkulasi',
  `jabatan` varchar(100) DEFAULT 'Petugas Perpustakaan',
  `foto` mediumtext DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `tb_petugas` (`username`, `nama_petugas`, `role`, `jabatan`, `foto`, `password`) VALUES
('admin', 'Siti Farida, A.Md', 'kepala_perpus', 'Kepala Unit Perpustakaan', NULL, 'admin123'),
('petugas2', 'Samsul Arifin, S.Pd', 'petugas_sirkulasi', 'Petugas Peminjaman & Sirkulasi', NULL, 'petugas123'),
('kepsek', 'Ahmad Marzuki, S.Pd.I', 'kepala_sekolah', 'Kepala Sekolah (Supervisor)', NULL, 'kepsek123');

-- -------------------------------------------------------------------------
-- 2. Tabel Master Anggota / Siswa (25 Data Siswa)
-- -------------------------------------------------------------------------
DROP TABLE IF EXISTS `tb_anggota`;
CREATE TABLE `tb_anggota` (
  `nisn` varchar(20) NOT NULL,
  `nama_lengkap` varchar(50) NOT NULL,
  `kelas` varchar(30) NOT NULL,
  `foto` mediumtext DEFAULT NULL,
  `jenis_kelamin` enum('L','P') DEFAULT 'L',
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`nisn`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `tb_anggota` (`nisn`, `nama_lengkap`, `kelas`, `foto`, `jenis_kelamin`, `password`) VALUES
('2024001', 'Ahmad Fauzi', 'Kelas XI IPA 1', NULL, 'L', 'siswa123'),
('2024002', 'Siti Aisyah', 'Kelas XII IPA 2', NULL, 'P', 'siswa123'),
('2024003', 'Rizky Ramadhan', 'Kelas X IPS 1', NULL, 'L', 'siswa123'),
('2024004', 'Nurul Hidayah', 'Kelas XI IPS 2', NULL, 'P', 'siswa123'),
('2024005', 'Budi Santoso', 'Kelas X IPA 1', NULL, 'L', 'siswa123'),
('2024006', 'Dewi Sartika', 'Kelas XI IPA 2', NULL, 'P', 'siswa123'),
('2024007', 'Dimas Pratama', 'Kelas XII IPA 1', NULL, 'L', 'siswa123'),
('2024008', 'Fatimah Zahra', 'Kelas X IPA 2', NULL, 'P', 'siswa123'),
('2024009', 'Gilang Ramadhan', 'Kelas XI IPS 1', NULL, 'L', 'siswa123'),
('2024010', 'Hani Puspitasari', 'Kelas XII IPS 1', NULL, 'P', 'siswa123'),
('2024011', 'Ilham Maulana', 'Kelas X IPS 2', NULL, 'L', 'siswa123'),
('2024012', 'Jihan Nabila', 'Kelas XI IPA 1', NULL, 'P', 'siswa123'),
('2024013', 'Kevin Pratama', 'Kelas XII IPA 2', NULL, 'L', 'siswa123'),
('2024014', 'Laila Rahmawati', 'Kelas X IPA 1', NULL, 'P', 'siswa123'),
('2024015', 'Muhammad Zidan', 'Kelas XI IPS 2', NULL, 'L', 'siswa123'),
('2024016', 'Nabila Putri', 'Kelas XII IPS 2', NULL, 'P', 'siswa123'),
('2024017', 'Oki Kurniawan', 'Kelas X IPS 1', NULL, 'L', 'siswa123'),
('2024018', 'Putri Lestari', 'Kelas XI IPA 2', NULL, 'P', 'siswa123'),
('2024019', 'Qori Annisa', 'Kelas XII IPA 1', NULL, 'P', 'siswa123'),
('2024020', 'Raditya Pratama', 'Kelas X IPA 2', NULL, 'L', 'siswa123'),
('2024021', 'Syifa Maulida', 'Kelas XI IPS 1', NULL, 'P', 'siswa123'),
('2024022', 'Taufik Hidayatullah', 'Kelas XII IPS 1', NULL, 'L', 'siswa123'),
('2024023', 'Umi Kulsum', 'Kelas X IPS 2', NULL, 'P', 'siswa123'),
('2024024', 'Viko Ardiansyah', 'Kelas XI IPA 1', NULL, 'L', 'siswa123'),
('2024025', 'Wahyu Hidayat', 'Kelas XII IPA 2', NULL, 'L', 'siswa123');

-- -------------------------------------------------------------------------
-- 3. Tabel Master Buku (25 Data Koleksi Lengkap SMA Muhammadiyah)
-- -------------------------------------------------------------------------
DROP TABLE IF EXISTS `tb_buku`;
CREATE TABLE `tb_buku` (
  `kd_buku` varchar(11) NOT NULL,
  `judul_buku` varchar(100) NOT NULL,
  `pengarang` varchar(50) NOT NULL,
  `penerbit` varchar(60) NOT NULL,
  `lokasi_rak` varchar(50) DEFAULT 'Rak A-01 (Umum)',
  `tahun_terbit` varchar(10) NOT NULL,
  `stok` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`kd_buku`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `tb_buku` (`kd_buku`, `judul_buku`, `pengarang`, `penerbit`, `lokasi_rak`, `tahun_terbit`, `stok`) VALUES
('BK001', 'Matematika Peminatan Kelas XI', 'Sukino', 'Erlangga', 'Rak A-01 (MIPA & Sains)', '2019', 5),
('BK002', 'Fisika SMA/MA Kelas XII', 'Marthen Kanginan', 'Erlangga', 'Rak A-02 (MIPA & Sains)', '2020', 4),
('BK003', 'Biologi Sel & Genetika', 'Campbell & Reece', 'Erlangga', 'Rak A-03 (MIPA & Sains)', '2018', 3),
('BK004', 'Sejarah Kebudayaan Islam', 'Badri Yatim', 'Rajawali Pers', 'Rak B-01 (Sejarah & Agama)', '2017', 6),
('BK005', 'Kemuhammadiyahan Kelas X', 'Majelis Dikdasmen', 'Suara Muhammadiyah', 'Rak B-02 (Kemuhammadiyahan)', '2021', 8),
('BK006', 'Bahasa Indonesia Tingkat Lanjut', 'E. Kosasih', 'Yrama Widya', 'Rak C-01 (Bahasa & Sastra)', '2022', 5),
('BK007', 'Kimia Mandiri SMA/MA Kelas XI', 'Unggul Sudarmo', 'Erlangga', 'Rak A-01 (MIPA & Sains)', '2021', 6),
('BK008', 'Sosiologi: Individu, Kelompok & Masyarakat', 'Kun Maryati', 'Esis', 'Rak B-03 (Sosial & Humaniora)', '2020', 4),
('BK009', 'Ekonomi & Akuntansi Keuangan Kelas XII', 'Alam S.', 'Erlangga', 'Rak B-03 (Sosial & Humaniora)', '2022', 5),
('BK010', 'Geografi: Dinamika Litosfer & Atmosfer', 'K. Wardiyatmoko', 'Erlangga', 'Rak B-03 (Sosial & Humaniora)', '2019', 4),
('BK011', 'Kemuhammadiyahan & Ke-HW-an Kelas XI', 'Majelis Dikdasmen PWM', 'Suara Muhammadiyah', 'Rak B-02 (Kemuhammadiyahan)', '2022', 7),
('BK012', 'Fikih Ibadah & Himpunan Putusan Tarjih', 'Majelis Tarjih PP Muhammadiyah', 'Suara Muhammadiyah', 'Rak B-01 (Sejarah & Agama)', '2020', 6),
('BK013', 'English on Target for Senior High Grade XI', 'Nur Zaida', 'Erlangga', 'Rak C-02 (Bahasa Asing)', '2021', 5),
('BK014', 'Informatika & Pemrograman Python SMA', 'Henry Pandia', 'Erlangga', 'Rak A-04 (Teknologi & Komputer)', '2023', 6),
('BK015', 'Laskar Pelangi', 'Andrea Hirata', 'Bentang Pustaka', 'Rak C-03 (Fiksi & Sastra)', '2015', 4),
('BK016', 'Bumi Manusia', 'Pramoedya Ananta Toer', 'Lentera Dipantara', 'Rak C-03 (Fiksi & Sastra)', '2018', 4),
('BK017', 'Tenggelamnya Kapal Van der Wijck', 'Buya Hamka', 'Bulan Bintang', 'Rak C-03 (Fiksi & Sastra)', '2016', 5),
('BK018', 'Sejarah Indonesia Modern 1200–2008', 'M.C. Ricklefs', 'Serambi', 'Rak B-01 (Sejarah & Agama)', '2019', 3),
('BK019', 'Pendidikan Pancasila & Kewarganegaraan XII', 'Yuyus Kardiman', 'Erlangga', 'Rak B-03 (Sosial & Humaniora)', '2022', 8),
('BK020', 'Ensiklopedia Sains & Teknologi Populer', 'Taufik Hidayat', 'Lentera Ilmu', 'Rak A-01 (MIPA & Sains)', '2021', 3),
('BK021', 'Astronomi Praktis & Pengamatan Hisab Falak', 'K.H. Ahmad Dahlan', 'Suara Muhammadiyah', 'Rak A-02 (MIPA & Falak)', '2020', 4),
('BK022', 'Mahir Desain Grafis & Multimedia Kreatif', 'Wahana Komputer', 'Andi Publisher', 'Rak A-04 (Teknologi & Komputer)', '2023', 5),
('BK023', 'Tafsir Al-Azhar Lengkap Juz 1-30', 'Buya Hamka', 'Gema Insani', 'Rak B-01 (Sejarah & Agama)', '2020', 3),
('BK024', 'Kimia Organik & Biokimia Praktis SMA', 'Fessenden & Fessenden', 'Erlangga', 'Rak A-01 (MIPA & Sains)', '2018', 3),
('BK025', 'Kumpulan Soal & Pembahasan OSN Fisika', 'Tim Surya Institute', 'Grasindo', 'Rak A-02 (MIPA & Sains)', '2023', 4);

-- -------------------------------------------------------------------------
-- 4. Tabel Konfigurasi Sistem (SOP Tarif & Kebijakan Sirkulasi)
-- -------------------------------------------------------------------------
DROP TABLE IF EXISTS `tb_pengaturan`;
CREATE TABLE `tb_pengaturan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `kunci` varchar(50) NOT NULL,
  `nilai` text NOT NULL,
  `keterangan` varchar(100) DEFAULT NULL,
  `diubah_oleh` varchar(30) DEFAULT 'admin',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `kunci` (`kunci`),
  KEY `fk_pengaturan_petugas` (`diubah_oleh`),
  CONSTRAINT `fk_pengaturan_petugas` FOREIGN KEY (`diubah_oleh`) REFERENCES `tb_petugas` (`username`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `tb_pengaturan` (`id`, `kunci`, `nilai`, `keterangan`, `diubah_oleh`) VALUES
(1, 'tarif_denda', '1000', 'Besaran tarif denda keterlambatan per hari per buku (Rupiah)', 'admin'),
(2, 'durasi_pinjam', '7', 'Batas standar peminjaman buku (Hari)', 'admin'),
(3, 'nama_perpustakaan', 'Perpustakaan SMA Muhammadiyah 1 Pekalongan', 'Nama resmi unit perpustakaan', 'admin'),
(4, 'qris_merchant', 'lupayyy, Konter', 'Nama Merchant QRIS resmi', 'admin'),
(5, 'qris_nmid', 'ID1026632009753', 'NMID QRIS Standar Nasional', 'admin'),
(6, 'durasi_perpanjangan', '7', 'Durasi penambahan hari masa pinjam saat perpanjangan', 'admin'),
(7, 'biaya_perpanjangan', '0', 'Biaya administrasi perpanjangan pinjaman buku (Rupiah)', 'admin');

-- -------------------------------------------------------------------------
-- 5. Tabel Transaksi Peminjaman (25 Transaksi Peminjaman Buku)
-- -------------------------------------------------------------------------
DROP TABLE IF EXISTS `tb_peminjaman`;
CREATE TABLE `tb_peminjaman` (
  `kd_peminjaman` varchar(11) NOT NULL,
  `kd_buku` varchar(11) NOT NULL,
  `nisn` varchar(20) DEFAULT NULL,
  `nama_anggota` varchar(50) NOT NULL,
  `tgl_peminjaman` date NOT NULL,
  `tgl_jatuh_tempo` date DEFAULT NULL,
  `status` enum('Dipinjam','Dikembalikan','Terlambat') NOT NULL DEFAULT 'Dipinjam',
  `petugas_pinjam` varchar(30) DEFAULT NULL,
  `perpanjangan_count` int(11) DEFAULT 0,
  `biaya_perpanjangan` decimal(12,2) DEFAULT 0.00,
  `metode_bayar_perpanjang` varchar(50) DEFAULT NULL,
  `id_transaksi_perpanjang` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`kd_peminjaman`),
  KEY `fk_peminjaman_buku` (`kd_buku`),
  KEY `fk_peminjaman_anggota` (`nisn`),
  KEY `fk_peminjaman_petugas` (`petugas_pinjam`),
  CONSTRAINT `fk_peminjaman_anggota` FOREIGN KEY (`nisn`) REFERENCES `tb_anggota` (`nisn`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_peminjaman_buku` FOREIGN KEY (`kd_buku`) REFERENCES `tb_buku` (`kd_buku`) ON UPDATE CASCADE,
  CONSTRAINT `fk_peminjaman_petugas` FOREIGN KEY (`petugas_pinjam`) REFERENCES `tb_petugas` (`username`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `tb_peminjaman` (`kd_peminjaman`, `kd_buku`, `nisn`, `nama_anggota`, `tgl_peminjaman`, `tgl_jatuh_tempo`, `status`, `petugas_pinjam`, `perpanjangan_count`, `biaya_perpanjangan`, `metode_bayar_perpanjang`, `id_transaksi_perpanjang`) VALUES
('PJ001', 'BK001', '2024001', 'Ahmad Fauzi (XI IPA 1)', '2026-10-25', '2026-11-01', 'Dikembalikan', 'petugas2', 0, 0.00, NULL, NULL),
('PJ002', 'BK002', '2024002', 'Siti Aisyah (XII IPA 2)', '2026-10-28', '2026-11-04', 'Dikembalikan', 'petugas2', 0, 0.00, NULL, NULL),
('PJ003', 'BK005', '2024003', 'Rizky Ramadhan (X IPS 1)', '2026-10-26', '2026-11-02', 'Dikembalikan', 'petugas2', 0, 0.00, NULL, NULL),
('PJ004', 'BK003', '2024004', 'Nurul Hidayah (XI IPS 2)', '2026-11-01', '2026-11-08', 'Dikembalikan', 'petugas2', 0, 0.00, NULL, NULL),
('PJ005', 'BK007', '2024005', 'Budi Santoso (X IPA 1)', '2026-11-03', '2026-11-10', 'Dikembalikan', 'petugas2', 0, 0.00, NULL, NULL),
('PJ006', 'BK008', '2024006', 'Dewi Sartika (XI IPA 2)', '2026-11-04', '2026-11-11', 'Dikembalikan', 'petugas2', 0, 0.00, NULL, NULL),
('PJ007', 'BK009', '2024007', 'Dimas Pratama (XII IPA 1)', '2026-11-05', '2026-11-12', 'Dikembalikan', 'petugas2', 0, 0.00, NULL, NULL),
('PJ008', 'BK010', '2024008', 'Fatimah Zahra (X IPA 2)', '2026-11-06', '2026-11-13', 'Dikembalikan', 'petugas2', 0, 0.00, NULL, NULL),
('PJ009', 'BK011', '2024009', 'Gilang Ramadhan (XI IPS 1)', '2026-11-08', '2026-11-15', 'Dikembalikan', 'petugas2', 0, 0.00, NULL, NULL),
('PJ010', 'BK012', '2024010', 'Hani Puspitasari (XII IPS 1)', '2026-11-09', '2026-11-16', 'Dikembalikan', 'petugas2', 0, 0.00, NULL, NULL),
('PJ011', 'BK013', '2024011', 'Ilham Maulana (X IPS 2)', '2026-11-10', '2026-11-17', 'Dikembalikan', 'petugas2', 0, 0.00, NULL, NULL),
('PJ012', 'BK014', '2024012', 'Jihan Nabila (XI IPA 1)', '2026-11-11', '2026-11-18', 'Dikembalikan', 'petugas2', 0, 0.00, NULL, NULL),
('PJ013', 'BK015', '2024013', 'Kevin Pratama (XII IPA 2)', '2026-11-12', '2026-11-19', 'Dikembalikan', 'petugas2', 0, 0.00, NULL, NULL),
('PJ014', 'BK016', '2024014', 'Laila Rahmawati (X IPA 1)', '2026-11-13', '2026-11-20', 'Dikembalikan', 'petugas2', 0, 0.00, NULL, NULL),
('PJ015', 'BK017', '2024015', 'Muhammad Zidan (XI IPS 2)', '2026-11-14', '2026-11-21', 'Dikembalikan', 'petugas2', 0, 0.00, NULL, NULL),
('PJ016', 'BK018', '2024016', 'Nabila Putri (XII IPS 2)', '2026-11-15', '2026-11-22', 'Dikembalikan', 'petugas2', 0, 0.00, NULL, NULL),
('PJ017', 'BK019', '2024017', 'Oki Kurniawan (X IPS 1)', '2026-11-16', '2026-11-23', 'Dikembalikan', 'petugas2', 0, 0.00, NULL, NULL),
('PJ018', 'BK020', '2024018', 'Putri Lestari (XI IPA 2)', '2026-11-17', '2026-11-24', 'Dikembalikan', 'petugas2', 0, 0.00, NULL, NULL),
('PJ019', 'BK021', '2024019', 'Qori Annisa (XII IPA 1)', '2026-11-18', '2026-11-25', 'Dikembalikan', 'petugas2', 0, 0.00, NULL, NULL),
('PJ020', 'BK022', '2024020', 'Raditya Pratama (X IPA 2)', '2026-11-18', '2026-11-25', 'Dikembalikan', 'petugas2', 0, 0.00, NULL, NULL),
('PJ021', 'BK001', '2024021', 'Syifa Maulida (XI IPS 1)', '2026-11-18', '2026-11-25', 'Terlambat', 'petugas2', 0, 0.00, NULL, NULL),
('PJ022', 'BK002', '2024022', 'Taufik Hidayatullah (XII IPS 1)', '2026-11-19', '2026-11-26', 'Dipinjam', 'petugas2', 0, 0.00, NULL, NULL),
('PJ023', 'BK004', '2024023', 'Umi Kulsum (X IPS 2)', '2026-11-20', '2026-12-04', 'Dipinjam', 'petugas2', 1, 0.00, 'Bebas Biaya', NULL),
('PJ024', 'BK006', '2024024', 'Viko Ardiansyah (XI IPA 1)', '2026-11-22', '2026-11-29', 'Dipinjam', 'petugas2', 0, 0.00, NULL, NULL),
('PJ025', 'BK025', '2024025', 'Wahyu Hidayat (XII IPA 2)', '2026-11-23', '2026-11-30', 'Dipinjam', 'petugas2', 0, 0.00, NULL, NULL);

-- -------------------------------------------------------------------------
-- 6. Tabel Transaksi Pengembalian (20 Transaksi Pengembalian & Denda)
-- -------------------------------------------------------------------------
DROP TABLE IF EXISTS `tb_pengembalian`;
CREATE TABLE `tb_pengembalian` (
  `kd_pengembalian` varchar(11) NOT NULL,
  `kd_peminjaman` varchar(11) NOT NULL,
  `tgl_pengembalian` date NOT NULL,
  `keterangan` varchar(100) NOT NULL DEFAULT 'Selesai',
  `denda` decimal(12,2) NOT NULL DEFAULT 0.00,
  `petugas_kembali` varchar(30) DEFAULT NULL,
  `status_denda` enum('Lunas','Tertunggak','Tanpa Denda') DEFAULT 'Lunas',
  `metode_pembayaran` varchar(50) DEFAULT 'Tunai Loket',
  `id_transaksi_gateway` varchar(100) DEFAULT NULL,
  `waktu_bayar` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`kd_pengembalian`),
  KEY `fk_pengembalian_peminjaman` (`kd_peminjaman`),
  KEY `fk_pengembalian_petugas` (`petugas_kembali`),
  CONSTRAINT `fk_pengembalian_peminjaman` FOREIGN KEY (`kd_peminjaman`) REFERENCES `tb_peminjaman` (`kd_peminjaman`) ON UPDATE CASCADE,
  CONSTRAINT `fk_pengembalian_petugas` FOREIGN KEY (`petugas_kembali`) REFERENCES `tb_petugas` (`username`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `tb_pengembalian` (`kd_pengembalian`, `kd_peminjaman`, `tgl_pengembalian`, `keterangan`, `denda`, `petugas_kembali`, `status_denda`, `metode_pembayaran`, `id_transaksi_gateway`, `waktu_bayar`) VALUES
('KB001', 'PJ001', '2026-11-03', 'Terlambat 2 Hari (Buku Baik)', 2000.00, 'petugas2', 'Lunas', 'Tunai Loket', NULL, '2026-11-03 10:15:00'),
('KB002', 'PJ002', '2026-11-04', 'Tepat Waktu / Kondisi Mulus', 0.00, 'petugas2', 'Tanpa Denda', 'Tunai Loket', NULL, '2026-11-04 09:20:00'),
('KB003', 'PJ003', '2026-11-03', 'Terlambat 1 Hari (Buku Rapi)', 1000.00, 'petugas2', 'Lunas', 'QRIS Standar Nasional', 'PAY-QRIS-20261103-0182', '2026-11-03 11:05:00'),
('KB004', 'PJ004', '2026-11-08', 'Tepat Waktu / Kondisi Baik', 0.00, 'petugas2', 'Tanpa Denda', 'Tunai Loket', NULL, '2026-11-08 14:10:00'),
('KB005', 'PJ005', '2026-11-12', 'Terlambat 2 Hari', 2000.00, 'petugas2', 'Lunas', 'Tunai Loket', NULL, '2026-11-12 08:45:00'),
('KB006', 'PJ006', '2026-11-11', 'Tepat Waktu / Kondisi Baik', 0.00, 'petugas2', 'Tanpa Denda', 'Tunai Loket', NULL, '2026-11-11 10:30:00'),
('KB007', 'PJ007', '2026-11-15', 'Terlambat 3 Hari (+ Ganti Lecek)', 3000.00, 'petugas2', 'Lunas', 'QRIS Standar Nasional', 'PAY-QRIS-20261115-8812', '2026-11-15 13:40:00'),
('KB008', 'PJ008', '2026-11-13', 'Tepat Waktu / Kondisi Bersih', 0.00, 'petugas2', 'Tanpa Denda', 'Tunai Loket', NULL, '2026-11-13 11:20:00'),
('KB009', 'PJ009', '2026-11-16', 'Terlambat 1 Hari', 1000.00, 'petugas2', 'Lunas', 'Tunai Loket', NULL, '2026-11-16 09:10:00'),
('KB010', 'PJ010', '2026-11-16', 'Tepat Waktu / Kondisi Baik', 0.00, 'petugas2', 'Tanpa Denda', 'Tunai Loket', NULL, '2026-11-16 14:05:00'),
('KB011', 'PJ011', '2026-11-17', 'Tepat Waktu / Buku Lengkap', 0.00, 'petugas2', 'Tanpa Denda', 'Tunai Loket', NULL, '2026-11-17 10:00:00'),
('KB012', 'PJ012', '2026-11-19', 'Terlambat 1 Hari (Dispensasi Guru)', 0.00, 'petugas2', 'Tanpa Denda', 'Bebas Denda', NULL, '2026-11-19 08:30:00'),
('KB013', 'PJ013', '2026-11-20', 'Terlambat 1 Hari', 1000.00, 'petugas2', 'Lunas', 'QRIS Standar Nasional', 'PAY-QRIS-20261120-1123', '2026-11-20 12:15:00'),
('KB014', 'PJ014', '2026-11-20', 'Tepat Waktu / Kondisi Sangat Baik', 0.00, 'petugas2', 'Tanpa Denda', 'Tunai Loket', NULL, '2026-11-20 09:40:00'),
('KB015', 'PJ015', '2026-11-21', 'Tepat Waktu / Kondisi Baik', 0.00, 'petugas2', 'Tanpa Denda', 'Tunai Loket', NULL, '2026-11-21 11:55:00'),
('KB016', 'PJ016', '2026-11-23', 'Terlambat 1 Hari', 1000.00, 'petugas2', 'Lunas', 'Tunai Loket', NULL, '2026-11-23 08:25:00'),
('KB017', 'PJ017', '2026-11-23', 'Tepat Waktu / Kondisi Rapi', 0.00, 'petugas2', 'Tanpa Denda', 'Tunai Loket', NULL, '2026-11-23 10:50:00'),
('KB018', 'PJ018', '2026-11-25', 'Terlambat 1 Hari', 1000.00, 'petugas2', 'Lunas', 'QRIS Standar Nasional', 'PAY-QRIS-20261125-9943', '2026-11-25 14:30:00'),
('KB019', 'PJ019', '2026-11-25', 'Tepat Waktu / Kondisi Baik', 0.00, 'petugas2', 'Tanpa Denda', 'Tunai Loket', NULL, '2026-11-25 09:15:00'),
('KB020', 'PJ020', '2026-11-25', 'Tepat Waktu / Kondisi Baik', 0.00, 'petugas2', 'Tanpa Denda', 'Tunai Loket', NULL, '2026-11-25 13:00:00');

SET FOREIGN_KEY_CHECKS = 1;
