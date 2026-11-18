# 📚 Sistem Informasi Manajemen Perpustakaan SMA Muhammadiyah 1 Pekalongan Berbasis Web

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![PHP](https://img.shields.io/badge/PHP-8.2%2B-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://www.php.net)
[![MySQL](https://img.shields.io/badge/MySQL-3NF%20Compliant-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![QRIS](https://img.shields.io/badge/QRIS-Payment_Gateway_API-DC2626?style=for-the-badge)](https://qris.id)
[![Status](https://img.shields.io/badge/Status-Completed%20%26%20Tested-success?style=for-the-badge)](#)

> **Tugas Akhir / Skripsi & Basis Data Lanjut**  
> **Universitas Muhammadiyah Metro**  
> **Program Studi:** S1 Ilmu Komputer / Sistem Informasi  
> **Instansi Mitra:** SMA Muhammadiyah 1 Pekalongan, Kabupaten Lampung Timur  

---

## 📑 Daftar Isi
1. [Ringkasan Proyek](#-ringkasan-proyek)
2. [Fitur Utama Sistem](#-fitur-utama-sistem)
3. [Perancangan Sistem & Diagram](#-perancangan-sistem--diagram)
   - [1. Flowchart Aliran Sistem Informasi (ASI) Swimlane](#1-flowchart-aliran-sistem-informasi-asi-swimlane-4-jalur-wewenang)
   - [2. Activity Flowchart Siklus Peminjaman & Pengembalian](#2-activity-flowchart-siklus-peminjaman--pengembalian-end-to-end)
   - [3. Data Flow Diagram (DFD) Level 0 / Konteks](#3-data-flow-diagram-dfd-level-0--diagram-konteks)
   - [4. Use Case Diagram UML](#4-use-case-diagram-uml-14-use-case)
   - [5. Entity Relationship Diagram (ERD) Normalisasi 3NF](#5-entity-relationship-diagram-erd-normalisasi-3nf)
4. [Tangkapan Layar Antarmuka Aplikasi (Screenshots)](#-tangkapan-layar-antarmuka-aplikasi-screenshots)
   - [1. Halaman Login Multi-Role](#1-halaman-login-multi-role)
   - [2. Panel Admin IT / Kepala Perpustakaan](#2-panel-admin-it--kepala-perpustakaan-kelola-buku--staf)
   - [3. Loket Sirkulasi Petugas](#3-loket-sirkulasi-petugas-pelayanan-pinjam-kembali--denda)
   - [4. Dashboard Eksekutif Kepala Sekolah](#4-dashboard-eksekutif-kepala-sekolah-pengesahan-laporan-resmi)
   - [5. Portal Mandiri Siswa](#5-portal-mandiri-siswa-katalog--kta-digital-barcode)
   - [6. Payment Gateway QRIS Otomatis](#6-payment-gateway-qris-otomatis-anti-kecurangan)
5. [Struktur Basis Data Normalisasi 3NF](#-struktur-basis-data-normalisasi-3nf)
6. [Panduan Instalasi & Menjalankan Proyek](#-panduan-instalasi--menjalankan-proyek)
7. [Akun Pengujian Demo (Credentials)](#-akun-pengujian-demo-credentials)
8. [Pengujian Black Box Testing](#-pengujian-black-box-testing)
9. [Profil Penyusun](#-profil-penyusun)

---

## 📌 Ringkasan Proyek

Sistem Informasi Manajemen Perpustakaan SMA Muhammadiyah 1 Pekalongan merupakan aplikasi berbasis web modern dengan model arsitektur **Modern Decoupled Client-Server (3-Tier)**. Sistem ini dibangun untuk mentransformasikan pengelolaan perpustakaan sekolah konvensional (pencatatan buku besar fisik & sistem legacy) menjadi ekosistem digital yang terintegrasi, transparan, dan terotomatisasi secara komprehensif.

Keunggulan utama sistem ini meliputi:
1. **Model Relasional 3NF & Integritas Transaksi ACID**: Skema basis data normalisasi bentuk ketiga (3NF) dengan foreign key strict di InnoDB MySQL yang mencegah anomali data, memastikan kuota peminjaman maksimal 2 buku per siswa, dan mengelola stok buku fisik secara real-time.
2. **Kalkulasi Denda Dinamis & Konfigurasi Global**: Perhitungan denda keterlambatan berjalan otomatis berdasarkan selisih hari dikalikan tarif denda yang tersimpan pada tabel master `tb_pengaturan`.
3. **Integrasi Digital Payment Gateway QRIS**: Penyelesaian denda keterlambatan dan biaya administrasi perpanjangan pinjaman melalui scan barcode QRIS Nasional (mendukung BCA Mobile, Livin Mandiri, BRImo, BNI, DANA, GoPay, OVO, ShopeePay) dengan verifikasi otomatis dan proteksi anti-kecurangan manual.
4. **Portal Siswa Mandiri & KTA Digital Ber-Barcode**: Siswa dapat mencari katalog buku beserta lokasi rak fisiknya, meminjam buku secara mandiri, dan mengunduh Kartu Tanda Anggota (KTA) digital resmi berstandar nasional lengkap dengan barcode NISN.
5. **Pengesahan Dokumen Laporan Digital Bertanda Tangan**: Eksekutif Kepala Sekolah dapat memantau indikator literasi dan mengesahkan dokumen laporan resmi ber-KOP Majelis Dikdasmen Muhammadiyah lengkap dengan tanda tangan digital dan opsi ekspor ke Microsoft Excel (.CSV).

---

## ⭐ Fitur Utama Sistem

| Modul Fungsional | Deskripsi Kemampuan Sistem | Aktor Pengguna |
| :--- | :--- | :--- |
| **Autentikasi Multi-Role (RBAC)** | Sistem Single-Sign-On tunggal berbasis username atau NISN dengan enkripsi Bcrypt. Dilengkapi pergantian foto profil dan update kredensial. | Admin, Petugas, Kepsek, Siswa |
| **Katalog Master Koleksi Buku** | Pengelolaan data koleksi buku (judul, pengarang, penerbit, tahun terbit, stok fisik), dan lokasi penempatan rak fisik (MIPA, Agama, Bahasa, Sosial). | Kepala Perpustakaan |
| **Generator Barcode Label Rak** | Pembuatan dan pencetakan label barcode standar Code 128 untuk ditempel pada punggung buku fisik perpustakaan. | Petugas & Kepala Perpus |
| **Sirkulasi Peminjaman Cepat** | Validasi kuota maksimal 2 buku aktif, pencegahan peminjaman buku stok 0, auto-generate kode PJxxx, dan pemotongan stok instan. | Petugas & Siswa Mandiri |
| **Pengembalian & Denda Otomatis** | Perhitungan selisih hari keterlambatan x tarif denda harian `tb_pengaturan`, pemulihan stok buku (+1), dan cetak kwitansi resmi loket. | Petugas Sirkulasi |
| **Payment Gateway QRIS Digital** | Pembayaran denda via barcode QRIS tajam (400x400 px), deteksi otomatis status pelunasan Lunas (Settled), dan pencatatan ID transaksi gateway. | Siswa & Petugas |
| **Perpanjangan Durasi (+7 Hari)** | Fasilitas perpanjangan pinjaman buku +7 hari dengan batas frekuensi maksimal 1 kali dan pencatatan biaya administrasi. | Petugas & Siswa |
| **Pengingat WhatsApp Gateway** | Tombol satu klik *Ingatkan WA* untuk mengirimkan pesan WhatsApp penagihan sopan berformat resmi ke nomor HP siswa yang terlambat. | Petugas Sirkulasi |
| **Portal Mandiri Siswa & KTA** | Akses katalog buku, pencarian rak fisik, riwayat transaksi pinjam, dan cetak Kartu Anggota (KTA) digital ber-barcode. | Siswa / Anggota |
| **Audit Mutu & Pengesahan Laporan** | Cetak laporan sirkulasi dan kas denda ber-KOP resmi dengan tanda tangan digital Kepala Sekolah, serta ekspor file spreadsheet (.CSV / Excel). | Kepala Sekolah & Admin |

---

## 📊 Perancangan Sistem & Diagram

Semua diagram dirancang dengan standar akademis teknik informatika, beresolusi tinggi, dan telah diverifikasi bebas dari sintaks error (*clean rendering*).

### 1. Flowchart Aliran Sistem Informasi (ASI) Swimlane 4 Jalur Wewenang
Diagram ini memetakan pemisahan wewenang (*Separation of Duties*) antara **Siswa/Anggota**, **Petugas Sirkulasi Loket**, **Kepala Sekolah / Kepala Perpus**, dan **Payment Gateway QRIS**.

<p align="center">
  <img src="diagram_images/flowchart_asi_swimlane.png" alt="Flowchart Aliran Sistem Informasi ASI Swimlane 4 Jalur" width="850">
</p>
<p align="center"><em>Gambar 1: Aliran Sistem Informasi (ASI) Swimlane 4 Jalur Wewenang</em></p>

---

### 2. Activity Flowchart Siklus Peminjaman & Pengembalian End-to-End
Diagram alur aktivitas logika sistem mulai dari seleksi buku di rak, verifikasi kuota maksimal 2 buku, pemotongan stok otomatis, pemantauan tanggal tempo, kalkulasi denda keterlambatan, pelunasan QRIS, hingga penerbitan bukti kwitansi.

<p align="center">
  <img src="diagram_images/activity_flowchart_sirkulasi.png" alt="Activity Flowchart Siklus Peminjaman dan Pengembalian" width="850">
</p>
<p align="center"><em>Gambar 2: Activity Flowchart Logika Sirkulasi Perpustakaan End-to-End</em></p>

---

### 3. Data Flow Diagram (DFD) Level 0 / Diagram Konteks
Memodelkan batas sistem (*system boundary*) serta arus pertukaran data antara Sistem Informasi Perpustakaan SMA Muhammadiyah 1 Pekalongan dengan 4 entitas eksternal (*Siswa*, *Petugas Sirkulasi*, *Kepala Perpustakaan*, *Kepala Sekolah*, serta *Payment Gateway QRIS Provider*).

<p align="center">
  <img src="diagram_images/dfd_level_0_konteks.png" alt="Data Flow Diagram DFD Level 0 Konteks" width="850">
</p>
<p align="center"><em>Gambar 3: Data Flow Diagram (DFD) Level 0 / Diagram Konteks</em></p>

---

### 4. Use Case Diagram UML (14 Use Case)
Memetakan 14 fungsionalitas utama sistem ke dalam 4 modul utama (Autentikasi, Layanan Sirkulasi, Finansial Denda QRIS, dan Manajerial Pelaporan Eksekutif).

<p align="center">
  <img src="diagram_images/usecase_diagram_perpustakaan.png" alt="Use Case Diagram UML Sistem Perpustakaan" width="850">
</p>
<p align="center"><em>Gambar 4: Use Case Diagram UML Sistem Perpustakaan SMA Muhammadiyah 1 Pekalongan</em></p>

---

### 5. Entity Relationship Diagram (ERD) Normalisasi 3NF
Rancangan basis data relasional 3NF yang menghubungkan 6 tabel utama tanpa anomali data (*insertion*, *update*, atau *deletion anomaly*) dengan integritas Foreign Key aktif di engine InnoDB MySQL.

<p align="center">
  <img src="diagram_images/erd_basis_data_3nf.png" alt="Entity Relationship Diagram ERD Basis Data 3NF" width="850">
</p>
<p align="center"><em>Gambar 5: Entity Relationship Diagram (ERD) Normalisasi 3NF Terelasi</em></p>

---

## 🖥️ Tangkapan Layar Antarmuka Aplikasi (Screenshots)

Berikut adalah dokumentasi antarmuka aplikasi yang telah berjalan secara langsung (*live system*). Gambar tersimpan di folder `SS`.

### 1. Halaman Login Multi-Role
Halaman autentikasi gerbang tunggal dengan validasi username/NISN dan password terenkripsi, dilengkapi tombol pintas demo role untuk mempermudah evaluasi pengujian.

<p align="center">
  <img src="SS/halaman%20login.png" alt="Halaman Login Multi-Role" width="900">
</p>
<p align="center"><em>Gambar 6: Tampilan Halaman Login Multi-Role Aplikasi</em></p>

---

### 2. Panel Admin IT / Kepala Perpustakaan (Kelola Buku & Staf)
Dashboard khusus Kepala Unit Perpustakaan untuk manajemen data master koleksi buku, penataan rak fisik, pengaturan tarif denda dinamis, generator barcode rak, dan manajemen akun staf.

<p align="center">
  <img src="SS/admin.png" alt="Panel Admin IT Kepala Perpustakaan" width="900">
</p>
<p align="center"><em>Gambar 7: Tampilan Dashboard & Manajemen Koleksi oleh Kepala Unit Perpustakaan</em></p>

---

### 3. Loket Sirkulasi Petugas (Pelayanan Pinjam, Kembali & Denda)
Panel Petugas Sirkulasi untuk pencatatan pinjaman buku front-desk, validasi pengembalian fisik buku, perhitungan denda otomatis, tombol perpanjang +7 hari, kirim pengingat WhatsApp, dan cetak kwitansi loket.

<p align="center">
  <img src="SS/petugas.png" alt="Loket Sirkulasi Petugas" width="900">
</p>
<p align="center"><em>Gambar 8: Tampilan Pengolahan Data Transaksi Sirkulasi oleh Petugas Loket</em></p>

---

### 4. Dashboard Eksekutif Kepala Sekolah (Pengesahan Laporan Resmi)
Dashboard Pimpinan Sekolah untuk mengaudit keaktifan membaca siswa per kelas, meninjau rekonsiliasi kas denda, dan mengesahkan dokumen laporan resmi ber-KOP sekolah dengan tanda tangan digital sah.

<p align="center">
  <img src="SS/kepsek.png" alt="Dashboard Eksekutif Kepala Sekolah" width="900">
</p>
<p align="center"><em>Gambar 9: Tampilan Dashboard Supervisi dan Pengesahan Laporan oleh Kepala Sekolah</em></p>

---

### 5. Portal Mandiri Siswa (Katalog & KTA Digital Barcode)
Portal khusus siswa untuk menelusuri katalog buku dan lokasi rak secara mandiri, mengajukan peminjaman buku (kuota maks 2), memantau riwayat pinjam, serta mengunduh Kartu Tanda Anggota (KTA) digital resmi ber-barcode NISN.

<p align="center">
  <img src="SS/siswa.png" alt="Portal Mandiri Siswa" width="900">
</p>
<p align="center"><em>Gambar 10: Tampilan Portal Mandiri Siswa & Kartu Digital KTA</em></p>

---

### 6. Payment Gateway QRIS Otomatis (Anti-Kecurangan)
Gerbang pembayaran digital QRIS resolusi tinggi (400x400 px) yang langsung dapat di-scan dari seluruh aplikasi mobile banking dan e-wallet nasional dengan verifikasi status otomatis.

<p align="center">
  <img src="SS/qris_modal.png" alt="Modal Payment Gateway QRIS" width="900">
</p>
<p align="center"><em>Gambar 11: Tampilan Modal Payment Gateway QRIS Real-Time</em></p>

---

## 🗄️ Struktur Basis Data Normalisasi 3NF

Basis data dirancang dengan mematuhi kaidah **Bentuk Normal Ketiga (3NF)**:
1. **1NF**: Setiap atribut bersifat atomik dan tidak terdapat grup data berulang (*repeating groups*).
2. **2NF**: Seluruh atribut non-kunci bergantung penuh pada Primary Key (*no partial functional dependency*).
3. **3NF**: Tidak ada ketergantungan transitif antar atribut non-kunci (*no transitive dependency*).

```
tb_petugas (username, nama_petugas, role, jabatan, foto, password, remember_token)
    └── 1:N ──> tb_peminjaman (kd_peminjaman, kd_buku, nisn, nama_anggota, tgl_peminjaman, tgl_jatuh_tempo, status, petugas_pinjam, perpanjangan_count, biaya_perpanjangan, metode_bayar_perpanjang, id_transaksi_perpanjang)
                    ├── N:1 ──> tb_buku (kd_buku, judul_buku, pengarang, penerbit, lokasi_rak, tahun_terbit, stok)
                    ├── N:1 ──> tb_anggota (nisn, nama_lengkap, kelas, foto, jenis_kelamin, password)
                    └── 1:1 ──> tb_pengembalian (kd_pengembalian, kd_peminjaman, tgl_pengembalian, keterangan, denda, status_denda, metode_pembayaran, id_transaksi_gateway, waktu_bayar, petugas_kembali)

tb_pengaturan (id, kunci, nilai, keterangan, diubah_oleh, updated_at)
```

---

## 🚀 Panduan Instalasi & Menjalankan Proyek

### Prasyarat Perangkat Lunak
- **Web Server & Database**: XAMPP v3.3+ (Apache & MySQL / MariaDB)
- **Runtime Environment**: Node.js v18+ dan NPM v9+
- **PHP**: Versi `8.2` atau lebih baru
- **Web Browser**: Google Chrome / Microsoft Edge / Mozilla Firefox

---

### Langkah-Langkah Menjalankan Aplikasi

#### Cara 1: Sekali Klik (Rekomendasi Windows)
Cukup klik dua kali file pintasan berikut pada direktori utama proyek:
```
JALANKAN_PERPUSTAKAAN.bat
```
*Skrip ini akan secara otomatis menyalakan Backend PHP, Frontend React, dan membuka browser secara langsung.*

---

#### Cara 2: Menjalankan Secara Manual via Terminal

1. **Clone Repositori**:
   ```bash
   git clone https://github.com/fanydarat757-hash/antigrafitytest.git
   cd antigrafitytest
   ```

2. **Persiapan Basis Data (MySQL / phpMyAdmin)**:
   - Pastikan modul **MySQL** pada XAMPP Control Panel dalam status `Running`.
   - Buka terminal PowerShell lalu impor skema database lengkap:
     ```powershell
     & "C:\xampp\mysql\bin\mysql.exe" -u root < "backend\database\skripsi_perpus.sql"
     ```

3. **Jalankan Backend RESTful API**:
   ```powershell
   cd backend
   C:\xampp\php\php.exe -S 127.0.0.1:8000 -t public
   ```
   *Backend API aktif di:* `http://127.0.0.1:8000`

4. **Jalankan Frontend React (Vite SPA)**:
   Buka jendela terminal baru:
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```
   *Aplikasi web siap diakses di:* [http://localhost:3000](http://localhost:3000)

---

## 🔑 Akun Pengujian Demo (Credentials)

Untuk mempermudah evaluasi pengujian fitur berdasarkan kontrol akses berbasis peran (*Role-Based Access Control*), gunakan akun demo berikut:

| Peran (Role) | Username / NISN | Password | Deskripsi Wewenang Akun |
| :--- | :--- | :--- | :--- |
| **Kepala Unit Perpustakaan** | `admin` | `admin123` | Akses penuh: Master buku, penataan rak, tarif denda, staf & laporan |
| **Petugas Sirkulasi Loket** | `petugas2` | `petugas123` | Pelayanan loket: Pinjam, kembali, denda tunai, barcode, dan notifikasi WA |
| **Kepala Sekolah** | `kepsek` | `kepsek123` | Pengawasan mutu: Audit sirkulasi, kas denda, dan pengesahan laporan resmi |
| **Siswa / Anggota** | `2024001` | `siswa123` | Portal mandiri: Katalog buku, pinjam mandiri, QRIS denda, cetak KTA |

---

## 🧪 Pengujian Black Box Testing

Pengujian fungsionalitas sistem dilakukan menggunakan metode **Black Box Testing** pada 12 skenario pengujian utama:

| No | Skenario Pengujian | Masukan (Input) | Hasil yang Diharapkan | Status |
| :-: | :--- | :--- | :--- | :-: |
| 1 | Autentikasi Login Multi-Role | Input username & password 4 role akun | Berhasil masuk ke dashboard sesuai hak akses masing-masing | **Valid (100%)** |
| 2 | Proteksi Akses & Password | Input password salah atau tidak terdaftar | Sistem menolak akses dan memunculkan toast peringatan error | **Valid (100%)** |
| 3 | Registrasi Anggota Siswa Baru | Input NISN, Nama, dan Kelas siswa baru | Data tersimpan di `tb_anggota` dan KTA digital aktif instan | **Valid (100%)** |
| 4 | Validasi Kuota Maksimal Pinjam | Siswa meminjam buku ke-3 saat 2 buku aktif | Sistem menolak pinjaman ke-3 sesuai SOP kuota perpustakaan | **Valid (100%)** |
| 5 | Validasi Stok Buku Habis | Meminjam buku fisik dengan stok = 0 | Peminjaman ditolak dan form menampilkan peringatan stok habis | **Valid (100%)** |
| 6 | Perpanjangan Pinjaman (+7 Hari) | Klik perpanjang pada transaksi `count = 0` | Tanggal tempo bertambah +7 hari dan tombol terkunci (maks 1x) | **Valid (100%)** |
| 7 | Kalkulasi Denda Keterlambatan | Buku terlambat 3 hari (Tarif Rp 1.000/hari) | Denda terhitung otomatis tepat $3 \times \text{Rp } 1.000 = \text{Rp } 3.000$ | **Valid (100%)** |
| 8 | Pembayaran Denda QRIS Gateway | Scan barcode QRIS dan verifikasi | Status denda berubah menjadi *Lunas* dan ID gateway tersimpan | **Valid (100%)** |
| 9 | Notifikasi WhatsApp Gateway | Klik tombol *Ingatkan WA* pada pinjaman jatuh tempo | Membuka API WhatsApp dengan template draf penagihan resmi | **Valid (100%)** |
| 10 | Cetak Kartu Anggota (KTA) Digital | Klik cetak KTA pada portal siswa | Tampil kartu anggota standar nasional lengkap barcode NISN & foto | **Valid (100%)** |
| 11 | Pengesahan Laporan Kepala Sekolah | Cetak laporan pada akun Kepala Sekolah | Lembar laporan memuat kop resmi dan tanda tangan digital sah | **Valid (100%)** |
| 12 | Ekspor Rekapitulasi Excel CSV | Klik tombol *Export ke Excel/CSV* | File `.csv` terunduh sempurna dan dapat dibuka rapi di Excel | **Valid (100%)** |

---

## 👨‍🎓 Profil Penyusun

- **Perguruan Tinggi:** Universitas Muhammadiyah Metro  
- **Fakultas / Program Studi:** S1 Ilmu Komputer / Sistem Informasi  
- **Mata Kuliah / Tugas:** Basis Data Lanjut (Semester 5) / Tugas Akhir Skripsi  
- **Tahun Akademik:** 2026 / 2027  
- **Instansi Penelitian:** SMA Muhammadiyah 1 Pekalongan, Kab. Lampung Timur  
- **Repositori GitHub:** [https://github.com/fanydarat757-hash/antigrafitytest](https://github.com/fanydarat757-hash/antigrafitytest)  

---
