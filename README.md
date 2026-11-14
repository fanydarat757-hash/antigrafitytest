# SISTEM INFORMASI PERPUSTAKAAN SMA MUHAMMADIYAH 1 PEKALONGAN

[![React](https://img.shields.io/badge/Frontend-React%2018%20(Vite)-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/CSS-Tailwind%20v3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PHP](https://img.shields.io/badge/Backend-PHP%20RESTful%20API-777BB4?logo=php&logoColor=white)](https://www.php.net/)
[![MySQL](https://img.shields.io/badge/Database-MySQL%20(InnoDB%203NF)-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![QRIS](https://img.shields.io/badge/Payment-QRIS%20Digital%20Gateway-DC2626)](https://qris.id/)

Sistem Informasi Perpustakaan berbasis Web Application dengan arsitektur **Modern Decoupled Client-Server (REST API)** yang mentransformasikan tata kelola perpustakaan konvensional (buku besar & sistem legacy) menjadi sistem terintegrasi, transparan, dan terotomatisasi secara digital.

---

## 👥 1. Akun Pengujian Multi-Role (RBAC)

Sistem menerapkan pengamanan akses berbasis peran (*Role-Based Access Control*). Untuk pengujian sistem dan demo sidang skripsi, gunakan akun default berikut:

| Peran Pengguna | Username / ID | Password | Hak Akses Utama |
| :--- | :---: | :---: | :--- |
| **Kepala Unit Perpustakaan** (`admin`) | `admin` | `admin123` | CRUD Master Buku, Manajemen Staf, Pengaturan Tarif Denda, Laporan |
| **Petugas Sirkulasi & Loket** (`petugas2`) | `petugas2` | `petugas123` | Pelayanan Peminjaman, Validasi Pengembalian, Cetak Kwitansi Denda & Barcode |
| **Kepala Sekolah** (`kepsek`) | `kepsek` | `kepsek123` | Audit Mutu Eksekutif, Pengesahan Laporan Bertanda Tangan Digital |
| **Siswa / Anggota** (`nisn`) | `2024001` | `siswa123` | Katalog Digital, Peminjaman Mandiri, Bayar Denda QRIS, Cetak KTA Digital |

---

## 🌟 2. Fitur Unggulan Sistem

1. **Digital Payment Gateway QRIS**:
   - Pelunasan denda keterlambatan dan administrasi perpanjangan pinjaman secara mandiri melalui scan QRIS (terintegrasi DANA, BCA Mobile, Livin, GoPay, OVO, dll).
2. **Kalkulasi Denda Dinamis & Otomatis**:
   - Perhitungan denda keterlambatan dihitung otomatis berbasis selisih hari dan tarif denda per hari yang dapat dikonfigurasi melalui tabel `tb_pengaturan`.
3. **Validasi Kuota Peminjaman (Integritas ACID)**:
   - Setiap siswa dibatasi maksimal meminjam 2 buku aktif secara bersamaan, dengan pemotongan dan pemulihan stok buku otomatis secara real-time.
4. **Cetak Kartu Tanda Anggota (KTA) Digital**:
   - Kartu anggota perpustakaan resmi berstandar nasional lengkap dengan barcode NISN, foto siswa, dan QR code profil.
5. **Generator Label & Barcode Rak Koleksi**:
   - Pencetakan label barcode buku (standar Code 128) untuk kemudahan penataan di rak fisik perpustakaan.
6. **Pelaporan Eksekutif & Pengesahan Resmi**:
   - Cetak laporan sirkulasi dan kas denda ber-KOP resmi SMA Muhammadiyah 1 Pekalongan lengkap dengan tanda tangan digital Kepala Sekolah dan ekspor ke format Excel/CSV.

---

## 🗄️ 3. Arsitektur Basis Data (6 Tabel Relasional 3NF)

Database `skripsi_perpus` telah dinormalisasi hingga tahap Third Normal Form (3NF) dengan Foreign Key Constraints aktif di engine InnoDB:

1. **`tb_petugas`**: Data staf perpustakaan, jabatan, hash password, dan role otoritas.
2. **`tb_anggota`**: Data profil siswa, NISN (Primary Key), kelas, foto profil base64, dan password.
3. **`tb_buku`**: Master katalog buku, judul, pengarang, penerbit, lokasi rak fisik, dan stok tersedia.
4. **`tb_peminjaman`**: Transaksi peminjaman buku (FK: `kd_buku`, `nisn`, `petugas_pinjam`), jatuh tempo, dan riwayat perpanjangan.
5. **`tb_pengembalian`**: Bukti pengembalian buku, kalkulasi denda, status pelunasan (`Lunas` / `Tertunggak`), metode bayar, dan ID gateway.
6. **`tb_pengaturan`**: Key-Value store untuk konfigurasi global (tarif denda harian, durasi standar pinjam, merchant QRIS).

---

## 🚀 4. Panduan Menjalankan Sistem

### Cara 1: Sekali Klik (Rekomendasi Windows)
Cukup klik dua kali file berikut di folder root project:
* **`JALANKAN_PERPUSTAKAAN.bat`** (Otomatis membuka backend, frontend, dan browser sekaligus).

---

### Cara 2: Menjalankan Secara Manual via Terminal

#### A. Persiapan Basis Data (MySQL / phpMyAdmin)
1. Nyalakan modul **Apache** dan **MySQL** di XAMPP Control Panel.
2. Impor database skripsi:
   ```powershell
   & "C:\xampp\mysql\bin\mysql.exe" -u root < "backend\database\skripsi_perpus.sql"
   ```

#### B. Menjalankan Backend API
```powershell
cd backend
C:\xampp\php\php.exe -S 127.0.0.1:8000 -t public
```
*Backend API aktif di: `http://127.0.0.1:8000`*

#### C. Menjalankan Frontend React
```powershell
cd frontend
npm install
npm run dev
```
*Aplikasi web aktif di: **`http://localhost:3000`***

---

## 📑 5. Dokumentasi Teknis & Skripsi Lengkap
Dokumen rujukan diagram lengkap (Arsitektur 3-Tier, DFD Level 0 & 1, Use Case, ERD, Sequence, Activity, Class, State, dan 7 SOP Flowcharts) tersedia pada:
👉 **[PANDUAN_TEKNIS_DAN_ARSITEKTUR_SKRIPSI.md](./PANDUAN_TEKNIS_DAN_ARSITEKTUR_SKRIPSI.md)**
