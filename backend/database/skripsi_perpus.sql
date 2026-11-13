-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: skripsi_perpus
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `skripsi_perpus`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `skripsi_perpus` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;

USE `skripsi_perpus`;

--
-- Table structure for table `tb_anggota`
--

DROP TABLE IF EXISTS `tb_anggota`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_anggota`
--

LOCK TABLES `tb_anggota` WRITE;
/*!40000 ALTER TABLE `tb_anggota` DISABLE KEYS */;
INSERT INTO `tb_anggota` VALUES ('2024001','Ahmad Fauzi','Kelas XI IPA 1',NULL,'L','siswa123','2026-11-09 10:57:02','2026-11-09 10:57:02'),('2024002','Siti Aisyah','Kelas XII IPA 2',NULL,'P','siswa123','2026-11-09 10:57:02','2026-11-09 10:57:02'),('2024003','Rizky Ramadhan','Kelas X IPS 1',NULL,'L','siswa123','2026-11-09 10:57:02','2026-11-09 10:57:02'),('2024004','Nurul Hidayah','Kelas XI IPS 2',NULL,'P','siswa123','2026-11-09 10:57:02','2026-11-09 10:57:02');
/*!40000 ALTER TABLE `tb_anggota` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_buku`
--

DROP TABLE IF EXISTS `tb_buku`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tb_buku` (
  `kd_buku` varchar(11) NOT NULL,
  `judul_buku` varchar(100) NOT NULL,
  `pengarang` varchar(50) NOT NULL,
  `penerbit` varchar(60) NOT NULL,
  `lokasi_rak` varchar(50) DEFAULT 'Rak A-01 (Umum)',
  `tahun_terbit` varchar(10) NOT NULL,
  `stok` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`kd_buku`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_buku`
--

LOCK TABLES `tb_buku` WRITE;
/*!40000 ALTER TABLE `tb_buku` DISABLE KEYS */;
INSERT INTO `tb_buku` VALUES ('BK001','Matematika Peminatan Kelas XI','Sukino','Erlangga','Rak A-01 (MIPA & Sains)','2019',5,'2026-11-09 10:56:30','2026-11-09 10:56:30'),('BK002','Fisika SMA/MA Kelas XII','Marthen Kanginan','Erlangga','Rak A-02 (MIPA & Sains)','2020',4,'2026-11-09 10:56:30','2026-11-09 10:56:30'),('BK003','Biologi Sel & Genetika','Campbell & Reece','Erlangga','Rak A-03 (MIPA & Sains)','2018',3,'2026-11-09 10:56:30','2026-11-09 10:56:30'),('BK004','Sejarah Kebudayaan Islam','Badri Yatim','Rajawali Pers','Rak B-01 (Sejarah & Agama)','2017',6,'2026-11-09 10:56:30','2026-11-09 10:56:30'),('BK005','Kemuhammadiyahan Kelas X','Majelis Dikdasmen','Suara Muhammadiyah','Rak B-02 (Kemuhammadiyahan)','2021',8,'2026-11-09 10:56:30','2026-11-09 10:56:30'),('BK006','Bahasa Indonesia Tingkat Lanjut','E. Kosasih','Yrama Widya','Rak C-01 (Bahasa & Sastra)','2022',5,'2026-11-09 10:56:30','2026-11-09 10:56:30');
/*!40000 ALTER TABLE `tb_buku` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_peminjaman`
--

DROP TABLE IF EXISTS `tb_peminjaman`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`kd_peminjaman`),
  KEY `fk_peminjaman_buku` (`kd_buku`),
  KEY `fk_peminjaman_anggota` (`nisn`),
  KEY `fk_peminjaman_petugas` (`petugas_pinjam`),
  CONSTRAINT `fk_peminjaman_anggota` FOREIGN KEY (`nisn`) REFERENCES `tb_anggota` (`nisn`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_peminjaman_buku` FOREIGN KEY (`kd_buku`) REFERENCES `tb_buku` (`kd_buku`) ON UPDATE CASCADE,
  CONSTRAINT `fk_peminjaman_petugas` FOREIGN KEY (`petugas_pinjam`) REFERENCES `tb_petugas` (`username`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_peminjaman`
--

LOCK TABLES `tb_peminjaman` WRITE;
/*!40000 ALTER TABLE `tb_peminjaman` DISABLE KEYS */;
INSERT INTO `tb_peminjaman` VALUES ('PJ001','BK001','2024001','Ahmad Fauzi (XI IPA 1)','2026-10-30','2026-11-06','Dikembalikan','petugas2',0,0.00,NULL,NULL,'2026-11-09 10:56:30','2026-11-09 10:56:30'),('PJ002','BK002','2024002','Siti Aisyah (XII IPA 2)','2026-11-07','2026-11-14','Dikembalikan','petugas2',0,0.00,NULL,NULL,'2026-11-09 10:56:30','2026-11-09 10:56:30'),('PJ003','BK005','2024003','Rizky Ramadhan (X IPS 1)','2026-10-26','2026-11-02','Dikembalikan','petugas2',0,0.00,NULL,NULL,'2026-11-09 10:56:30','2026-11-09 10:56:30'),('PJ004','BK003','2024003','Rizky Ramadhan (2024003)','2026-11-09','2026-11-16','Dikembalikan','petugas2',0,0.00,NULL,NULL,NULL,NULL),('PJ005','BK001','2024001','Ahmad Fauzi (2024001)','2026-11-09','2026-11-23','Dipinjam','petugas2',1,0.00,NULL,NULL,NULL,NULL),('PJ006','BK002','2024001','Ahmad Fauzi (2024001)','2026-11-09','2026-11-19','Dipinjam','petugas2',1,1.00,'Virtual Account Bank BRI','PAY-DND-20261110-4A1941',NULL,NULL);
/*!40000 ALTER TABLE `tb_peminjaman` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_pengaturan`
--

DROP TABLE IF EXISTS `tb_pengaturan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_pengaturan`
--

LOCK TABLES `tb_pengaturan` WRITE;
/*!40000 ALTER TABLE `tb_pengaturan` DISABLE KEYS */;
INSERT INTO `tb_pengaturan` VALUES (1,'tarif_denda','5000','Besaran tarif denda keterlambatan per hari per buku (Rupiah)','admin','2026-11-10 05:55:24'),(2,'durasi_pinjam','10','Batas standar peminjaman buku (Hari)','admin','2026-11-10 05:55:24'),(3,'nama_perpustakaan','Perpustakaan SMA Muhammadiyah 1 Pekalongan','Nama resmi unit perpustakaan','admin','2026-11-10 05:33:05'),(4,'qris_merchant','lupayyy, Konter','Nama Merchant QRIS resmi','admin','2026-11-10 05:33:05'),(5,'qris_nmid','ID1026632009753','NMID QRIS Standar Nasional','admin','2026-11-10 05:33:05'),(10,'biaya_perpanjangan','1','Tarif biaya administrasi perpanjangan pinjaman buku (Rupiah)','admin','2026-11-10 05:55:24');
/*!40000 ALTER TABLE `tb_pengaturan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_pengembalian`
--

DROP TABLE IF EXISTS `tb_pengembalian`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tb_pengembalian` (
  `kd_pengembalian` varchar(11) NOT NULL,
  `kd_peminjaman` varchar(11) NOT NULL,
  `tgl_pengembalian` date NOT NULL,
  `keterangan` varchar(50) NOT NULL DEFAULT 'Selesai',
  `denda` decimal(12,2) NOT NULL DEFAULT 0.00,
  `petugas_kembali` varchar(30) DEFAULT NULL,
  `status_denda` enum('Lunas','Tertunggak','Tanpa Denda') DEFAULT 'Lunas',
  `metode_pembayaran` varchar(50) DEFAULT 'Tunai Loket',
  `id_transaksi_gateway` varchar(100) DEFAULT NULL,
  `waktu_bayar` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`kd_pengembalian`),
  KEY `fk_pengembalian_peminjaman` (`kd_peminjaman`),
  KEY `fk_pengembalian_petugas` (`petugas_kembali`),
  CONSTRAINT `fk_pengembalian_peminjaman` FOREIGN KEY (`kd_peminjaman`) REFERENCES `tb_peminjaman` (`kd_peminjaman`) ON UPDATE CASCADE,
  CONSTRAINT `fk_pengembalian_petugas` FOREIGN KEY (`petugas_kembali`) REFERENCES `tb_petugas` (`username`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_pengembalian`
--

LOCK TABLES `tb_pengembalian` WRITE;
/*!40000 ALTER TABLE `tb_pengembalian` DISABLE KEYS */;
INSERT INTO `tb_pengembalian` VALUES ('KB001','PJ003','2026-11-03','Terlambat 1 Hari (Buku Baik)',1000.00,'petugas2','Lunas','Tunai Loket',NULL,NULL,'2026-11-09 10:56:30','2026-11-09 10:56:30'),('KB002','PJ002','2026-11-09','Tepat Waktu / Kondisi Baik',0.00,'petugas2','Tanpa Denda','Tunai Loket',NULL,NULL,NULL,NULL),('KB003','PJ001','2026-11-09','Terlambat 3 Hari',3000.00,'petugas2','Lunas','Tunai Loket',NULL,NULL,NULL,NULL),('KB004','PJ004','2026-11-11','Tepat Waktu / Kondisi Baik',0.00,'petugas2','Tanpa Denda','Tunai Loket','',NULL,NULL,NULL);
/*!40000 ALTER TABLE `tb_pengembalian` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_petugas`
--

DROP TABLE IF EXISTS `tb_petugas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tb_petugas` (
  `username` varchar(30) NOT NULL,
  `nama_petugas` varchar(50) NOT NULL DEFAULT 'Petugas Perpustakaan',
  `role` varchar(50) DEFAULT 'petugas_sirkulasi',
  `jabatan` varchar(100) DEFAULT 'Petugas Perpustakaan',
  `foto` mediumtext DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_petugas`
--

LOCK TABLES `tb_petugas` WRITE;
/*!40000 ALTER TABLE `tb_petugas` DISABLE KEYS */;
INSERT INTO `tb_petugas` VALUES ('admin','Siti Farida, A.Md','kepala_perpus','Kepala Perpustakaan',NULL,'$2y$12$R.P96Wq45yH9d74x2gQe6uH76B.4GjU4o4Yy58X9q4w1.Fh6b.F/y',NULL,'2026-11-09 10:56:30','2026-11-09 10:56:30'),('kepsek','Ahmad Marzuki, S.Pd.I','kepala_sekolah','Kepala Sekolah (Supervisor)',NULL,'\\.P96Wq45yH9d74x2gQe6uH76B.4GjU4o4Yy58X9q4w1.Fh6b.F/y',NULL,'2026-11-09 10:57:02','2026-11-09 10:57:02'),('petugas2','Samsul Arifin, S.Pd','petugas_sirkulasi','Petugas Peminjaman & Sirkulasi',NULL,'\\.P96Wq45yH9d74x2gQe6uH76B.4GjU4o4Yy58X9q4w1.Fh6b.F/y',NULL,'2026-11-09 10:57:02','2026-11-09 10:57:02');
/*!40000 ALTER TABLE `tb_petugas` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-11 20:29:02
