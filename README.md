# SISTEM INFORMASI PERPUSTAKAAN SMA MUHAMMADIYAH PEKALONGAN LAMPUNG TIMUR

Sistem modern berbasis Web Application dengan arsitektur **Decoupled Client-Server (REST API)** yang mentransformasikan sistem perpustakaan konvensional (buku besar / legacy Delphi) menjadi sistem terotomatisasi, responsif, dan elegan.

---

## 🛠️ Stack Teknologi

- **Backend**: Laravel 11 (API-driven backend, Eloquent ORM, REST API)
- **Frontend**: React 18 + Vite + Tailwind CSS + Lucide Icons
- **Protokol Komunikasi**: Asynchronous AJAX via Axios (dengan automated fallback mock store)
- **Database**: MySQL / MariaDB (InnoDb)

---

## 📐 Arsitektur Database & Relasi Tabel

1. **`tb_petugas`** (Tabel Autentikasi Petugas Perpustakaan)
   - `username` (VARCHAR 30, Primary Key)
   - `nama_petugas` (VARCHAR 50)
   - `password` (VARCHAR 255 / Hashed)

2. **`tb_buku`** (Tabel Master Katalog Buku)
   - `kd_buku` (VARCHAR 11, Primary Key)
   - `judul_buku` (VARCHAR 100)
   - `pengarang` (VARCHAR 50)
   - `penerbit` (VARCHAR 60)
   - `tahun_terbit` (VARCHAR 10)
   - `stok` (INT)

3. **`tb_peminjaman`** (Tabel Transaksi Peminjaman)
   - `kd_peminjaman` (VARCHAR 11, Primary Key)
   - `kd_buku` (VARCHAR 11, Foreign Key -> `tb_buku.kd_buku`)
   - `nama_anggota` (VARCHAR 50)
   - `tgl_peminjaman` (DATE)
   - `tgl_jatuh_tempo` (DATE)
   - `status` (ENUM: `'Dipinjam'`, `'Dikembalikan'`, `'Terlambat'`)

4. **`tb_pengembalian`** (Tabel Transaksi Pengembalian & Denda)
   - `kd_pengembalian` (VARCHAR 11, Primary Key)
   - `kd_peminjaman` (VARCHAR 11, Foreign Key -> `tb_peminjaman.kd_peminjaman`)
   - `tgl_pengembalian` (DATE)
   - `keterangan` (VARCHAR 50)
   - `denda` (DECIMAL 12,2)

---

## 🚀 Panduan Menjalankan Sistem

### 1. Menjalankan Backend Laravel
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```
Backend API akan berjalan di: `http://127.0.0.1:8000`

### 2. Menjalankan Frontend React
```bash
cd frontend
npm install
npm run dev
```
Aplikasi web siap diakses di: `http://localhost:3000`

*(Catatan: Frontend dilengkapi dengan dynamic fallback mock handler sehingga dapat diuji dan dijalankan secara interaktif kapan pun)*

