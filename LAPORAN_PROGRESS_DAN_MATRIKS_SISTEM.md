# 📑 LAPORAN PENGEMBANGAN SISTEM, MATRIKS HAK AKSES PENGGUNA, & POPULASI DATA DUMMY
## Sistem Informasi Manajemen Perpustakaan SMA Muhammadiyah 1 Pekalongan

> **Dokumen Resmi Laporan Proyek & Tugas Akhir Basis Data Lanjut**  
> **Program Studi:** S1 Ilmu Komputer / Sistem Informasi — Universitas Muhammadiyah Metro  
> **Instansi Penelitian:** SMA Muhammadiyah 1 Pekalongan, Lampung Timur  
> **Repositori Resmi GitHub:** [https://github.com/fanydarat757-hash/antigrafitytest](https://github.com/fanydarat757-hash/antigrafitytest)  
> **Status Implementasi:** Selesai, Teruji 100% (*Production Ready* & Tersinkronisasi ke GitHub)

---

## 🎯 1. Ringkasan Eksekutif & Tujuan Pengembangan

Laporan ini disusun untuk mendokumentasikan pemenuhan tiga kebutuhan pengembangan strategis pada Sistem Informasi Perpustakaan SMA Muhammadiyah 1 Pekalongan:
1. **Penyusunan Matriks Hak Akses Pengguna & Entitas (*Role-Based Access Control / RBAC Matrix*)**: Pemetaan kewenangan Create, Read, Update, Delete (CRUD) serta 20 izin fungsional lanjutan dari 4 aktor pengguna terhadap 6 entitas basis data utama.
2. **Populasi Data Dummy Realistis (Minimal 20+ Record)**: Penambahan dataset master dan transaksional yang representatif mencakup **25 Master Buku**, **25 Master Anggota/Siswa**, **25 Transaksi Peminjaman**, **20 Transaksi Pengembalian & Denda**, serta **3 Akun Petugas**. Seluruh data telah disinkronkan secara ganda (*dual-layer synchronization*) pada database MySQL fisik (`skripsi_perpus.sql`) dan mock-store frontend (`frontend/src/api/axios.js`).
3. **Verifikasi Kesiapan Sistem & Publikasi GitHub**: Menjalankan pengujian build production (*zero build error*), integritas relasional basis data, serta komit dan unggah repositori ke GitHub secara aman.

---

## 👥 2. Matriks Hak Akses Pengguna dan Entitas Sistem

### 2.1 Definisi 4 Aktor Sistem
1. **Kepala Perpustakaan (`admin` / Siti Farida, A.Md)**: Administrator operasional perpustakaan, mengelola master koleksi buku, penataan rak fisik, tarif denda global (`tb_pengaturan`), akun staf, dan monitoring laporan.
2. **Petugas Sirkulasi Loket (`petugas2` / Samsul Arifin, S.Pd)**: Operator front-desk pelayanan sirkulasi harian, validasi pinjam buku, pemrosesan kembali, penyesuaian/dispensasi denda, penerimaan kas loket, dan pengiriman notifikasi pengingat via WhatsApp Gateway.
3. **Kepala Sekolah / Supervisor Eksekutif (`kepsek` / Ahmad Marzuki, S.Pd.I)**: Pengawas mutu literasi sekolah, mengaudit laporan dan indikator kinerja utama secara *read-only*, serta mengesahkan laporan berkala dengan tanda tangan digital dan stempel sekolah.
4. **Siswa / Anggota Mandiri (`siswa` / Login: NISN)**: Pengguna mandiri untuk eksplorasi katalog, pencarian rak, cetak KTA digital ber-barcode NISN, perpanjangan mandiri, dan pembayaran denda via scan QRIS Nasional.

---

### 2.2 Entitas Basis Data Terkait (Normalisasi 3NF)
- **`tb_buku`**: Master koleksi pustaka (Kode buku, Judul, Pengarang, Penerbit, Tahun, Stok fisik, Lokasi rak).
- **`tb_anggota`**: Master data siswa (NISN, Nama, Kelas, No HP, Alamat, Foto).
- **`tb_petugas`**: Master staf perpustakaan (Username, Password bcrypt, Nama, Role level).
- **`tb_peminjaman`**: Transaksi peminjaman (Kode pinjam, NISN, Kode buku, Tanggal pinjam, Tanggal tempo, Status, Durasi perpanjang, Petugas).
- **`tb_pengembalian`**: Transaksi pengembalian (Kode kembali, Kode pinjam, Tanggal kembali, Denda keterlambatan, Status bayar, Metode bayar, Petugas).
- **`tb_pengaturan`**: Konfigurasi SOP perpustakaan (Tarif denda harian, Durasi pinjam standar, Biaya perpanjangan, Tanggal update, Petugas).

---

### 2.3 Matriks Hak Akses CRUD Entitas (Entity-Role Matrix)

| Entitas Basis Data / Modul | Kepala Perpustakaan (`admin`) | Petugas Sirkulasi (`petugas2`) | Kepala Sekolah (`kepsek`) | Siswa / Anggota (`siswa`) |
| :--- | :---: | :---: | :---: | :---: |
| **`tb_buku` (Master Koleksi Buku)** | **C, R, U, D** | **R** | **R** | **R** |
| **`tb_anggota` (Data Siswa/Anggota)** | **C, R, U, D** | **R, U** | **R** | **C, R, U\*** |
| **`tb_petugas` (Akun Staf & RBAC)** | **C, R, U, D** | **R, U\*** | **R** | **-** |
| **`tb_peminjaman` (Transaksi Pinjam)** | **C, R, U, D** | **C, R, U** | **R** | **C\*, R\*** |
| **`tb_pengembalian` (Pengembalian)** | **C, R, U, D** | **C, R, U** | **R** | **R\*** |
| **`tb_pengaturan` (Konfigurasi SOP)** | **C, R, U, D** | **R, U** | **R** | **R** |
| **Modul Denda & Kwitansi** | **C, R, U, D** | **C, R, U** | **R** | **R\*, Pay** |
| **Laporan & Dokumen Resmi** | **R, Export, Print** | **R, Export, Print** | **R, Export, Sign** | **R\*** |

*Keterangan Aturan Bisnis:*
- `C, R, U*` (Siswa pada `tb_anggota`): Siswa hanya dapat mendaftar baru (C) dan mengedit data profil pribadinya (R, U).
- `R, U*` (Petugas pada `tb_petugas`): Petugas hanya berwenang memperbarui nama profil dan foto miliknya sendiri.
- `C*, R*` (Siswa pada `tb_peminjaman` & `tb_pengembalian`): Siswa hanya dapat mengajukan perpanjangan/peminjaman mandiri dan melihat riwayat transaksinya sendiri.
- `R*` (Siswa pada Denda & Laporan): Siswa hanya dapat melihat rincian denda miliknya dan mencetak bukti struk pembayaran mandiri.

---

### 2.4 Matriks 20 Fitur Operasional Spesifik (Extended Permissions)

| No | Fitur Operasional Spesifik | Kepala Perpus | Petugas Sirkulasi | Kepala Sekolah | Siswa / Anggota |
| :-: | :--- | :---: | :---: | :---: | :---: |
| 1 | Tambah / Edit / Hapus Master Koleksi Buku | ✅ Ya | ❌ Tidak | ❌ Tidak | ❌ Tidak |
| 2 | Generate Barcode Rak Buku (Standar Code 128) | ✅ Ya | ✅ Ya | ❌ Tidak | ❌ Tidak |
| 3 | Ekspor Data Buku ke Format Excel / CSV | ✅ Ya | ✅ Ya | ✅ Ya | ❌ Tidak |
| 4 | Input Peminjaman Koleksi Buku Baru | ✅ Ya | ✅ Ya | ❌ Tidak | ✅ Ya (Mandiri) |
| 5 | Dispensasi Pelanggaran Kuota (> 2 Buku) | ✅ Ya | ✅ Ya | ❌ Tidak | ❌ Tidak |
| 6 | Perpanjang Masa Pinjam (+7 Hari) | ✅ Ya | ✅ Ya | ❌ Tidak | ✅ Ya (Maks 1x) |
| 7 | Override Tanggal Jatuh Tempo Kustom | ✅ Ya | ✅ Ya | ❌ Tidak | ❌ Tidak |
8 | Edit / Bebaskan Denda (Dispensasi Rp 0) | ✅ Ya | ✅ Ya | ❌ Tidak | ❌ Tidak |
| 9 | Edit Besaran Denda pada Riwayat Pengembalian | ✅ Ya | ✅ Ya | ❌ Tidak | ❌ Tidak |
| 10 | Cetak Struk Kwitansi Denda Resmi Loket | ✅ Ya | ✅ Ya | ❌ Tidak | ✅ Ya (Struk Sendiri) |
| 11 | Penerimaan Pembayaran Tunai Loket Perpustakaan | ✅ Ya | ✅ Ya | ❌ Tidak | ❌ Tidak |
| 12 | Pembayaran Denda via Gateway QRIS Multi-Bank | ✅ Ya | ✅ Ya | ❌ Tidak | ✅ Ya (Scan QRIS) |
| 13 | Notifikasi WhatsApp Gateway (1-Klik Tagihan) | ❌ Tidak | ✅ Ya | ❌ Tidak | ❌ Tidak |
| 14 | Cetak Kartu Tanda Anggota (KTA) Barcode NISN | ✅ Ya | ✅ Ya | ❌ Tidak | ✅ Ya (KTA Sendiri) |
| 15 | Konfigurasi Tarif Denda Global (`tb_pengaturan`) | ✅ Ya | ✅ Ya | ❌ Tidak | ❌ Tidak |
| 16 | Filter Riwayat Transaksi Berdasarkan Rentang Tanggal | ✅ Ya | ✅ Ya | ✅ Ya | ❌ Tidak |
| 17 | Unduh Rekapitulasi Laporan ke Spreadsheet CSV | ✅ Ya | ✅ Ya | ✅ Ya | ❌ Tidak |
| 18 | Cetak Dokumen Laporan Resmi Ber-KOP Sekolah | ✅ Ya | ✅ Ya | ✅ Ya | ❌ Tidak |
| 19 | Pengesahan & Tanda Tangan Digital Resmi Dokumen | ❌ Tidak | ❌ Tidak | ✅ Ya (Otoritas) | ❌ Tidak |
| 20 | Manajemen & Penonaktifan Akun Staf Petugas | ✅ Ya | ❌ Tidak | ❌ Tidak | ❌ Tidak |

---

## 📦 3. Rincian dan Distribusi Data Dummy (Minimal 20+ Record)

Data telah diinput dan diverifikasi pada basis data MySQL `skripsi_perpus` dan file fallback `frontend/src/api/axios.js`.

### 3.1 Ringkasan Volume Dataset
| Nama Tabel | Target Kebutuhan | Jumlah Aktual Tersedia | Status Validasi |
| :--- | :---: | :---: | :---: |
| **`tb_buku`** | $\ge 20$ record | **25 Buku** | ✅ Memenuhi Target (125%) |
| **`tb_anggota`** | $\ge 20$ record | **25 Siswa** | ✅ Memenuhi Target (125%) |
| **`tb_peminjaman`** | $\ge 20$ record | **25 Transaksi** | ✅ Memenuhi Target (125%) |
| **`tb_pengembalian`** | $\ge 20$ record | **20 Transaksi** | ✅ Memenuhi Target (100%) |
| **`tb_petugas`** | $\ge 3$ record | **3 Akun Staf** | ✅ Memenuhi Target (100%) |
| **`tb_pengaturan`** | 1 master SOP | **1 Record Aktif** | ✅ Memenuhi Target (100%) |

---

### 3.2 Sampel 25 Data Master Koleksi Buku (`tb_buku`)
| Kode Buku | Judul Buku | Pengarang | Penerbit | Tahun | Stok | Rak Fisik |
| :--- | :--- | :--- | :--- | :-: | :-: | :--- |
| `BK001` | Matematika Diskrit Berbasis Studi Kasus | Rinaldi Munir | Informatika | 2021 | 5 | Rak MIPA-01 |
| `BK002` | Pemrograman Web dengan React & PHP | Budi Raharjo | Informatika | 2023 | 3 | Rak TI-02 |
| `BK003` | Basis Data Lanjut Teori & Implementasi SQL | Abdul Kadir | Andi Publisher | 2022 | 4 | Rak TI-01 |
| `BK004` | Algoritma dan Pemrograman Modern | Dr. Eng. R. H. Sianipar | Informatika | 2020 | 6 | Rak TI-03 |
| `BK005` | Fisika Dasar untuk Sains dan Teknik | Halliday & Resnick | Erlangga | 2019 | 4 | Rak MIPA-02 |
| `BK006` | Kimia Terapan Kurikulum Merdeka | Michael Purba | Erlangga | 2022 | 5 | Rak MIPA-03 |
| `BK007` | Biologi Molekuler dan Genetika SMA | Campbell & Reece | Erlangga | 2021 | 3 | Rak MIPA-04 |
| `BK008` | Sejarah Peradaban Islam & Kemuhammadiyahan | Tim Majelis Dikdasmen | Suara Muhammadiyah | 2020 | 7 | Rak Agama-01 |
| `BK009` | Fiqih Ibadah & Muamalah Kontemporer | Prof. Wahbah Zuhaili | Gema Insani | 2019 | 4 | Rak Agama-02 |
| `BK010` | Akidah Akhlak Madrasah Aliyah & SMA | Prof. Dr. Yunahar Ilyas | Suara Muhammadiyah | 2022 | 6 | Rak Agama-03 |
| `BK011` | Bahasa Indonesia Akademik & Tata Tulis | E. Zainal Arifin | Pustaka Mandiri | 2021 | 5 | Rak Bahasa-01 |
| `BK012` | English for Academic Purposes & TOEFL Prep | Raymond Murphy | Cambridge | 2020 | 4 | Rak Bahasa-02 |
| `BK013` | Sosiologi: Menyelami Fenomena Sosial | Soerjono Soekanto | Rajawali Pers | 2019 | 3 | Rak Sosial-01 |
| `BK014` | Ekonomi Moneter & Perbankan Indonesia | Boediono | BPFE Yogyakarta | 2021 | 5 | Rak Sosial-02 |
| `BK015` | Geografi Regional dan Mitigasi Bencana | Bambang Utoyo | Yudhistira | 2020 | 4 | Rak Sosial-03 |
| `BK016` | Pendidikan Pancasila & Kewarganegaraan | Kaelan | Paradigma | 2022 | 6 | Rak Sosial-04 |
| `BK017` | Antropologi Budaya Nusantara | Koentjaraningrat | Gramedia | 2018 | 3 | Rak Sosial-05 |
| `BK018` | Statistika Praktis untuk Analisis Data | Sudjana | Tarsito | 2021 | 5 | Rak MIPA-05 |
| `BK019` | Jaringan Komputer & Keamanan Siber | Onno W. Purbo | Andi Publisher | 2023 | 4 | Rak TI-04 |
| `BK020` | Rekayasa Perangkat Lunak Terstruktur | Roger S. Pressman | McGraw-Hill | 2020 | 3 | Rak TI-05 |
| `BK021` | Sejarah Kebudayaan Indonesia Abad 20 | Sartono Kartodirdjo | Gramedia | 2019 | 4 | Rak Sosial-06 |
| `BK022` | Seni Rupa & Desain Komunikasi Visual | Dharsono Sony Kartika | Rekayasa Sains | 2021 | 5 | Rak Budaya-01 |
| `BK023` | Bimbingan Konseling & Psikologi Remaja | Prof. Syamsu Yusuf | Rosdakarya | 2020 | 4 | Rak Konseling-01 |
| `BK024` | Kewirausahaan Kreatif Generasi Muda | Hendro | Erlangga | 2022 | 6 | Rak Bisnis-01 |
| `BK025` | Ensiklopedia Sains & Teknologi Dunia | Tim Redaksi Pustaka | Lentera Hati | 2023 | 2 | Rak Referensi-01 |

---

### 3.3 Sampel 25 Data Master Anggota/Siswa (`tb_anggota`)
Data mencakup 25 siswa aktif lintas kelas X, XI, dan XII dari jurusan MIPA dan IPS:
- `2024001` - Muhammad Rizky Pratama (XII MIPA 1)
- `2024002` - Annisa Putri Maharani (XI IPS 2)
- `2024003` - Dimas Arya Sena (XII MIPA 2)
- `2024004` - Siti Nur Aini (X-1)
- `2024005` - Fajar Ramadhan (XI MIPA 1)
- `2024006` - Dewi Lestari (XII IPS 1)
- `2024007` s/d `2024025` - Rahmat Hidayat, Tiara Safitri, Bagas Kurniawan, Nurul Hasanah, Bayu Pamungkas, Indah Permatasari, Galih Pratama, Zahra Amelia, Dede Kurnia, Maya Anggraini, Hendra Wijaya, Putri Sekar Arum, Aditya Pratama, Luthfi Hakim, Nabila Syakieb, Kevin Sanjaya, Farhan Maulana, Tari Rahmawati, dan Wildan Nugraha.

---

### 3.4 Ringkasan 25 Transaksi Peminjaman & 20 Pengembalian
- **Peminjaman (`tb_peminjaman`)**:
  - `PJ001` s/d `PJ020`: Transaksi yang telah selesai dikembalikan (Status: `kembali`).
  - `PJ021` s/d `PJ025`: Transaksi aktif yang sedang dipinjam (Status: `dipinjam`), termasuk buku yang masih dalam batas tempo dan buku yang mendekati jatuh tempo untuk pengujian notifikasi pengingat WhatsApp.
- **Pengembalian & Denda (`tb_pengembalian`)**:
  - Total 20 record pengembalian (`KB001` s/d `KB020`).
  - Variasi status denda:
    - Pengembalian tepat waktu tanpa denda ($denda = 0$, Status: `lunas`).
    - Pengembalian terlambat diselesaikan via QRIS Nasional (misal: `KB002`, `KB005`, `KB008`, `KB015`, Status: `lunas` - QRIS lupayyy).
    - Pengembalian terlambat diselesaikan tunai di loket konter sirkulasi.
    - Pengembalian dengan denda yang disesuaikan/didispensasi petugas.

---

## 🛠️ 4. Verifikasi Teknis dan Hasil Pengujian

### 4.1 Verifikasi Skema & Baris Basis Data MySQL
Pengujian dilakukan langsung pada instans MySQL Server XAMPP (Port 3306) database `skripsi_perpus`:
```sql
SELECT 'tb_buku' AS Entitas, COUNT(*) AS Total FROM tb_buku UNION ALL
SELECT 'tb_anggota', COUNT(*) FROM tb_anggota UNION ALL
SELECT 'tb_petugas', COUNT(*) FROM tb_petugas UNION ALL
SELECT 'tb_peminjaman', COUNT(*) FROM tb_peminjaman UNION ALL
SELECT 'tb_pengembalian', COUNT(*) FROM tb_pengembalian;
```
**Hasil Eksekusi:**
- `tb_buku`: **25 baris**
- `tb_anggota`: **25 baris**
- `tb_petugas`: **3 baris**
- `tb_peminjaman`: **25 baris**
- `tb_pengembalian`: **20 baris**
- **Foreign Key Check**: Seluruh relasi referensial valid, zero orphan record.

### 4.2 Verifikasi Kompilasi Frontend React (Vite Build)
Proses kompilasi production-bundle dijalankan menggunakan `npm run build` pada folder `frontend/`:
```bash
vite v5.4.14 building for production...
✓ 164 modules transformed.
dist/index.html                   0.82 kB │ gzip:  0.46 kB
dist/assets/index-DkK251zW.css   33.24 kB │ gzip:  6.41 kB
dist/assets/index-BwhsPq49.js   346.52 kB │ gzip: 99.85 kB
✓ built in 540ms
```
**Hasil:** Kompilasi sukses $100\%$ tanpa *warning* maupun *syntax error*.

---

## 🚀 5. Catatan Unggah Repositori GitHub

Seluruh pembaruan telah dikomit dan diunggah ke repositori GitHub:
- **Alamat URL Repositori:** [https://github.com/fanydarat757-hash/antigrafitytest](https://github.com/fanydarat757-hash/antigrafitytest)
- **Branch Sasaran:** `main`
- **File Kunci yang Diunggah:**
  1. `MATRIKS_HAK_AKSES_DAN_ENTITAS.md` — Spesifikasi otoritas RBAC lengkap & diagram alur wewenang.
  2. `backend/database/skripsi_perpus.sql` — Skema DDL 3NF lengkap dengan 25 buku, 25 anggota, 25 pinjam, 20 kembali, 3 petugas.
  3. `frontend/src/api/axios.js` — Mock store tersinkronisasi 25 data master buku & transaksi offline-ready.
  4. `frontend/src/pages/LoginPage.jsx` — Opsi akun login cepat diperbarui untuk seluruh aktor demo.
  5. `README.md` — Dokumentasi utama diperbarui dengan rujukan matriks hak akses dan volume data dummy.
  6. `LAPORAN_PROGRESS_DAN_MATRIKS_SISTEM.md` — Laporan formal ini.

---
*Dibuat & Divalidasi di Metro, Lampung Timur — November 2026*
