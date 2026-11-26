# 📚 LAPORAN LENGKAP PENGEMBANGAN SISTEM & DOKUMEN ARSITEKTUR SKRIPSI
## Sistem Informasi Manajemen Perpustakaan SMA Muhammadiyah 1 Pekalongan Berbasis Web

> **Dokumen Resmi Rujukan Tugas Akhir / Skripsi & Mata Kuliah Basis Data Lanjut (Semester 5)**  
> **Program Studi:** S1 Ilmu Komputer / Sistem Informasi — Universitas Muhammadiyah Metro  
> **Instansi Penelitian:** SMA Muhammadiyah 1 Pekalongan, Kabupaten Lampung Timur  
> **Repositori Resmi GitHub:** [https://github.com/fanydarat757-hash/antigrafitytest](https://github.com/fanydarat757-hash/antigrafitytest)  
> **Status Sistem:** Selesai, Teruji 100% (*Production Ready*, Lulus Black Box Testing & Terverifikasi MySQL/Vite)

---

## 📑 DAFTAR ISI LAPORAN

1. [Identitas Sistem, Objek Penelitian & Ringkasan Eksekutif](#1-identitas-sistem-objek-penelitian--ringkasan-eksekutif)
2. [Matriks Hak Akses Pengguna & Entitas Sistem (RBAC Komprehensif)](#2-matriks-hak-akses-pengguna--entitas-sistem-rbac-komprehensif)
   - [2.1 Definisi 4 Aktor Pengguna Sistem](#21-definisi-4-aktor-pengguna-sistem)
   - [2.2 Definisi 6 Entitas Basis Data](#22-definisi-6-entitas-basis-data)
   - [2.3 Matriks Hak Akses CRUD Entitas](#23-matriks-hak-akses-crud-entitas-entity-role-matrix)
   - [2.4 Matriks 20 Fitur Operasional Lanjutan](#24-matriks-20-fitur-operasional-lanjutan-extended-permissions)
   - [2.5 Diagram Aliran Data Wewenang Otorisasi](#25-diagram-aliran-data-wewenang-otorisasi)
3. [Arsitektur Sistem 3-Tier (Modern Decoupled Client-Server)](#3-arsitektur-sistem-3-tier-modern-decoupled-client-server)
4. [Diagram Konteks & Data Flow Diagram (DFD Level 0 & Level 1)](#4-diagram-konteks--data-flow-diagram-dfd-level-0--level-1)
5. [Use Case Diagram UML & Spesifikasi Peranan](#5-use-case-diagram-uml--spesifikasi-peranan)
6. [Struktur Basis Data 3NF, ERD & Populasi 20+ Data Dummy](#6-struktur-basis-data-3nf-erd--populasi-20-data-dummy)
   - [6.1 Entity Relationship Diagram (ERD Terkoneksi Penuh)](#61-entity-relationship-diagram-erd-terkoneksi-penuh)
   - [6.2 Kaidah Normalisasi Bentuk Ketiga (3NF)](#62-kaidah-normalisasi-bentuk-ketiga-3nf)
   - [6.3 Ringkasan Volume Dataset (Target vs Realisasi Aktual)](#63-ringkasan-volume-dataset-target-vs-realisasi-aktual)
   - [6.4 Daftar 25 Master Koleksi Buku (`tb_buku`)](#64-daftar-25-master-koleksi-buku-tb_buku)
   - [6.5 Daftar 25 Master Siswa / Anggota (`tb_anggota`)](#65-daftar-25-master-siswa--anggota-tb_anggota)
   - [6.6 Rincian Transaksi Sirkulasi Peminjaman & Pengembalian](#66-rincian-transaksi-sirkulasi-peminjaman--pengembalian)
   - [6.7 Master Petugas & Konfigurasi SOP (`tb_pengaturan`)](#67-master-petugas--konfigurasi-sop-tb_pengaturan)
7. [Activity Diagram, State Machine & Sequence Diagram](#7-activity-diagram-state-machine--sequence-diagram)
   - [7.1 Activity Diagram Peminjaman Buku](#71-activity-diagram-peminjaman-buku)
   - [7.2 Activity Diagram Pengembalian & Denda](#72-activity-diagram-pengembalian--denda)
   - [7.3 Sequence Diagram Interaksi Payment Gateway QRIS](#73-sequence-diagram-interaksi-payment-gateway-qris)
   - [7.4 State Machine Diagram Siklus Status Pustaka](#74-state-machine-diagram-siklus-status-pustaka)
8. [Class Diagram & Pemodelan Berorientasi Objek](#8-class-diagram--pemodelan-berorientasi-objek)
9. [Standar Operasional Prosedur & Flowchart Sistem (7 Alur)](#9-standar-operasional-prosedur--flowchart-sistem-7-alur)
10. [Panduan Instalasi, Menjalankan Aplikasi & Kredensial Demo](#10-panduan-instalasi-menjalankan-aplikasi--kredensial-demo)
11. [Hasil Verifikasi Teknis & Pengujian Black Box Testing (17 Kasus)](#11-hasil-verifikasi-teknis--pengujian-black-box-testing-17-kasus)
    - [11.1 Verifikasi Integritas MySQL Basis Data](#111-verifikasi-integritas-mysql-basis-data)
    - [11.2 Verifikasi Kompilasi Frontend React (Vite Build)](#112-verifikasi-kompilasi-frontend-react-vite-build)
    - [11.3 Pengujian Fungsional Black Box Testing (17 Skenario)](#113-pengujian-fungsional-black-box-testing-17-skenario)
12. [Profil Penyusun](#12-profil-penyusun)

---

## 📌 1. Identitas Sistem, Objek Penelitian & Ringkasan Eksekutif

* **Nama Sistem**: Sistem Informasi Manajemen Perpustakaan Berbasis Web Modern
* **Instansi Mitra**: SMA Muhammadiyah 1 Pekalongan, Kabupaten Lampung Timur, Lampung
* **Alamat Sekolah**: Jl. Raya Pekalongan, Kec. Pekalongan, Kab. Lampung Timur, Prov. Lampung
* **Teknologi Utama**:
  * **Frontend**: React.js 18 (Vite SPA) + Tailwind CSS + Lucide React Icons (Port 3000)
  * **Backend**: Arsitektur RESTful API PHP 8.2+ / Service Layer Pattern (Port 8000)
  * **Basis Data**: MySQL 8.x / MariaDB (Storage Engine InnoDB dengan Relasi Foreign Key Strict)
  * **Gerbang Pembayaran**: QRIS Nasional (NMID: ID1026632009753, Merchant: lupayyy, Konter) & Multi-Bank Virtual Account (BCA, Mandiri, BRI)
* **Ringkasan Transformasi**:
  Sistem ini mentransformasikan operasional perpustakaan sekolah konvensional (pencatatan buku besar kertas & sistem lokal legacy) menjadi sistem digital terpadu yang transparan, presisi, dan terotomatisasi. Sistem mengintegrasikan validasi kuota pinjam 2 buku per siswa, kalkulasi denda harian dinamis, notifikasi WhatsApp Gateway, portal mandiri pencetakan KTA digital ber-barcode NISN, serta modul pengesahan dokumen bertanda tangan digital oleh Kepala Sekolah.

---

## 🔐 2. Matriks Hak Akses Pengguna & Entitas Sistem (RBAC Komprehensif)

Sistem mengimplementasikan kendali akses berbasis peran (*Role-Based Access Control / RBAC*) yang ketat dengan pemisahan wewenang (*Separation of Duties*) antara 4 aktor pengguna terhadap 6 entitas basis data utama:

### 2.1 Definisi 4 Aktor Pengguna Sistem
1. **Kepala Unit Perpustakaan (`admin` / Siti Farida, A.Md)**:
   - **Peranan:** Administrator Utama & Manajerial Perpustakaan.
   - **Wewenang:** Pengelolaan master katalog buku, penataan barcode rak fisik, manajemen data siswa dan staf, penetapan kebijakan operasional perpustakaan (tarif denda per hari, masa pinjam, biaya administrasi) pada tabel `tb_pengaturan`, monitoring rekapitulasi denda, serta pencetakan laporan inventaris.
2. **Petugas Layanan & Sirkulasi (`petugas2` / Samsul Arifin, S.Pd)**:
   - **Peranan:** Operator Loket Front-Desk Sirkulasi.
   - **Wewenang:** Pelayanan transaksi peminjaman buku harian siswa, validasi kuota pinjam maksimal 2 buku aktif, pengecekan fisik buku saat pengembalian, kalkulasi denda otomatis, penyesuaian/dispensasi denda saat pengembalian, penerimaan kas tunai di loket maupun verifikasi QRIS, pencetakan kwitansi sah, dan pengiriman notifikasi pengingat via WhatsApp Gateway kepada siswa yang menunggak.
3. **Kepala Sekolah / Supervisor Eksekutif (`kepsek` / Ahmad Marzuki, S.Pd.I)**:
   - **Peranan:** Supervisor Eksekutif & Penjamin Mutu (*Executive Supervisor*).
   - **Wewenang:** Mengawasi indikator kinerja utama (KPI) literasi dan minat baca siswa, mengaudit inventaris koleksi buku sekolah secara *read-only*, serta melakukan **Pengesahan Resmi Laporan Perpustakaan** dengan membubuhkan tanda tangan digital dan stempel sekolah pada dokumen laporan untuk keperluan akreditasi sekolah.
4. **Siswa / Anggota Perpustakaan (`siswa` / Login: NISN)**:
   - **Peranan:** Pengguna Layanan Mandiri (*Self-Service Portal*).
   - **Wewenang:** Mencari katalog buku dan letak rak fisiknya, mendaftar akun anggota secara mandiri, mengunduh Kartu Tanda Anggota (KTA) digital ber-barcode NISN, memantau riwayat peminjaman buku, memperpanjang masa pinjam secara mandiri, dan melunasi denda keterlambatan melalui scan QRIS Nasional.

---

### 2.2 Definisi 6 Entitas Basis Data
1. **`tb_buku`**: Master katalog koleksi pustaka fisik perpustakaan.
2. **`tb_anggota`**: Master data siswa dan anggota perpustakaan.
3. **`tb_petugas`**: Master kredensial akun staf dan tingkatan hak akses.
4. **`tb_peminjaman`**: Transaksi peminjaman buku dan perpanjangan durasi pinjam.
5. **`tb_pengembalian`**: Transaksi pengembalian fisik buku dan denda keterlambatan.
6. **`tb_pengaturan`**: Konfigurasi SOP sistem (tarif denda, durasi pinjam, biaya administrasi).

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

*\*Keterangan Aturan Bisnis & Least-Privilege:*
- `C, R, U*` (Siswa pada `tb_anggota`): Siswa hanya dapat mendaftar baru (C) dan mengedit data profil pribadinya (R, U).
- `R, U*` (Petugas pada `tb_petugas`): Petugas hanya berwenang memperbarui nama profil dan foto miliknya sendiri.
- `C*, R*` (Siswa pada `tb_peminjaman` & `tb_pengembalian`): Siswa hanya dapat mengajukan perpanjangan/peminjaman mandiri dan melihat riwayat transaksinya sendiri.
- `R*, Pay` (Siswa pada Modul Denda): Siswa hanya dapat melihat rincian denda miliknya, membayar via QRIS, dan mencetak struk bukti pembayaran mandiri.

---

### 2.4 Matriks 20 Fitur Operasional Lanjutan (Extended Permissions)

| No | Fitur Operasional Spesifik | Kepala Perpus | Petugas Sirkulasi | Kepala Sekolah | Siswa / Anggota |
| :-: | :--- | :---: | :---: | :---: | :---: |
| 1 | Tambah / Edit / Hapus Master Koleksi Buku | ✅ Ya | ❌ Tidak | ❌ Tidak | ❌ Tidak |
| 2 | Generate Barcode Rak Buku (Standar Code 128) | ✅ Ya | ✅ Ya | ❌ Tidak | ❌ Tidak |
| 3 | Ekspor Data Buku ke Format Excel / CSV | ✅ Ya | ✅ Ya | ✅ Ya | ❌ Tidak |
| 4 | Input Peminjaman Koleksi Buku Baru | ✅ Ya | ✅ Ya | ❌ Tidak | ✅ Ya (Mandiri) |
| 5 | Dispensasi Pelanggaran Kuota (> 2 Buku) | ✅ Ya | ✅ Ya | ❌ Tidak | ❌ Tidak |
| 6 | Perpanjang Masa Pinjam (+7 Hari) | ✅ Ya | ✅ Ya | ❌ Tidak | ✅ Ya (Maks 1x) |
| 7 | Override Tanggal Jatuh Tempo Kustom | ✅ Ya | ✅ Ya | ❌ Tidak | ❌ Tidak |
| 8 | Edit / Bebaskan Denda (Dispensasi Rp 0) | ✅ Ya | ✅ Ya | ❌ Tidak | ❌ Tidak |
| 9 | Edit Besaran Denda pada Riwayat Pengembalian | ✅ Ya | ✅ Ya | ❌ Tidak | ❌ Tidak |
| 10 | Cetak Struk Kwitansi Denda Resmi Loket | ✅ Ya | ✅ Ya | ❌ Tidak | ✅ Ya (Struk Sendiri) |
| 11 | Penerimaan Pembayaran Tunai Loket Perpustakaan | ✅ Ya | ✅ Ya | ❌ Tidak | ❌ Tidak |
| 12 | Pembayaran Denda via Gateway QRIS Multi-Bank | ✅ Ya | ✅ Ya | ❌ Tidak | ✅ Ya (Scan QRIS) |
| 13 | Notifikasi WhatsApp Gateway (1-Klik Tagihan) | ❌ Tidak | ✅ Ya (1-Klik WA) | ❌ Tidak | ❌ Tidak |
| 14 | Cetak Kartu Tanda Anggota (KTA) Barcode NISN | ✅ Ya | ✅ Ya | ❌ Tidak | ✅ Ya (KTA Sendiri) |
| 15 | Konfigurasi Tarif Denda Global (`tb_pengaturan`) | ✅ Ya | ✅ Ya | ❌ Tidak | ❌ Tidak |
| 16 | Filter Riwayat Transaksi Berdasarkan Rentang Tanggal | ✅ Ya | ✅ Ya | ✅ Ya | ❌ Tidak |
| 17 | Unduh Rekapitulasi Laporan ke Spreadsheet CSV | ✅ Ya | ✅ Ya | ✅ Ya | ❌ Tidak |
| 18 | Cetak Dokumen Laporan Resmi Ber-KOP Sekolah | ✅ Ya | ✅ Ya | ✅ Ya | ❌ Tidak |
| 19 | Pengesahan & Tanda Tangan Digital Resmi Dokumen | ❌ Tidak | ❌ Tidak | ✅ Ya (Otoritas Utama) | ❌ Tidak |
| 20 | Manajemen & Penonaktifan Akun Staf Petugas | ✅ Ya | ❌ Tidak | ❌ Tidak | ❌ Tidak |

---

### 2.5 Diagram Aliran Data Wewenang Otorisasi

```mermaid
flowchart TD
    subgraph Aktor ["Aktor Pengguna Sistem"]
        A["Siswa / Anggota<br/>(Portal Siswa)"]
        B["Petugas Sirkulasi<br/>(Loket Pelayanan)"]
        C["Kepala Perpustakaan<br/>(Panel Admin Penuh)"]
        D["Kepala Sekolah<br/>(Supervisor Eksekutif)"]
    end

    subgraph Entitas ["Entitas & Modul Basis Data"]
        E1[("tb_buku<br/>Katalog & Stok")]
        E2[("tb_anggota<br/>Profil & KTA")]
        E3[("tb_peminjaman<br/>Sirkulasi Pinjam")]
        E4[("tb_pengembalian<br/>Sirkulasi Kembali")]
        E5[("Denda & QRIS<br/>Kas Masuk")]
        E6[("tb_pengaturan<br/>SOP Kebijakan")]
        E7[("Laporan Resmi<br/>Akreditasi")]
    end

    A -->|"1. Cari Buku / KTA Digital"| E1
    A -->|"2. Pinjam Mandiri / Perpanjang"| E3
    A -->|"3. Bayar Denda QRIS"| E5

    B -->|"1. Validasi Peminjaman Loket"| E3
    B -->|"2. Terima Buku Kembali"| E4
    B -->|"3. Rekonsiliasi Kas Denda"| E5
    B -->|"4. Kirim Notifikasi WA"| E2

    C -->|"1. Kelola Master Buku & Barcode"| E1
    C -->|"2. Atur Tarif & Durasi SOP"| E6
    C -->|"3. Manajemen Penuh Sirkulasi"| E3
    C -->|"4. Rekonsiliasi Kas & Denda"| E5

    D -->|"1. Audit Koleksi & KPI"| E1
    D -->|"2. Monitoring Sirkulasi"| E3
    D -->|"3. PENGESAHAN DOKUMEN RESMI"| E7
```

---

## 🏗️ 3. Arsitektur Sistem 3-Tier (Modern Decoupled Client-Server)

Sistem menggunakan model arsitektur **Modern Decoupled Client-Server (3-Tier)** yang memisahkan antarmuka interaktif pengguna, logika bisnis terpusat, dan persistensi basis data relasional serta layanan payment gateway eksternal.

```mermaid
flowchart TD
    subgraph Client_Layer ["1. Presentation Layer (Client Browser)"]
        UI_Siswa["Portal Siswa (Katalog, Pinjam Mandiri, Bayar Denda QRIS)"]
        UI_Petugas["Portal Petugas (Loket Sirkulasi, Validasi & Cetak Barcode)"]
        UI_Admin["Portal Kepala Perpus (Manajemen Koleksi, Staf & Konfigurasi)"]
        UI_Kepsek["Portal Kepala Sekolah (Audit Eksekutif & Pengesahan Laporan)"]
    end

    subgraph API_Gateway ["2. Application & Business Logic Layer (RESTful API Engine)"]
        Router["API Routing & Request Dispatcher"]
        AuthService["Authentication & RBAC Guard"]
        SirkulasiService["Sirkulasi Service (Aturan Kuota 2 Buku & Validasi Stok)"]
        DendaService["Denda Engine (Kalkulasi Tarif Dinamis tb_pengaturan)"]
        PaymentService["Payment Gateway Engine (QRIS & Virtual Account)"]
        ReportService["Reporting & PDF Export Engine"]
    end

    subgraph Data_Layer ["3. Data & External Integration Layer"]
        MySQL[("MySQL Relational Database (InnoDB Engine)<br/>- tb_anggota<br/>- tb_petugas<br/>- tb_buku<br/>- tb_peminjaman<br/>- tb_pengembalian<br/>- tb_pengaturan")]
        PG_Provider["Payment Gateway Provider (QRIS Merchant & Bank Host)"]
    end

    UI_Siswa -->|"HTTPS / JSON Axios"| Router
    UI_Petugas -->|"HTTPS / JSON Axios"| Router
    UI_Admin -->|"HTTPS / JSON Axios"| Router
    UI_Kepsek -->|"HTTPS / JSON Axios"| Router

    Router --> AuthService
    Router --> SirkulasiService
    Router --> DendaService
    Router --> PaymentService
    Router --> ReportService

    AuthService --> MySQL
    SirkulasiService --> MySQL
    DendaService --> MySQL
    PaymentService --> MySQL
    ReportService --> MySQL
    PaymentService -->|"API Invoice"| PG_Provider
    PG_Provider -->|"Callback Settlement"| PaymentService
```

---

## 🔄 4. Diagram Konteks & Data Flow Diagram (DFD Level 0 & Level 1)

### Diagram Konteks (Context Diagram / DFD Level 0)
```mermaid
flowchart LR
    Siswa["Siswa / Anggota"]
    Petugas["Petugas Sirkulasi"]
    KepalaPerpus["Kepala Perpustakaan"]
    KepalaSekolah["Kepala Sekolah"]
    PaymentGW["Payment Gateway"]

    Sistem(("SISTEM INFORMASI PERPUSTAKAAN SMA MUHAMMADIYAH 1 PEKALONGAN"))

    Siswa -->|"Data Pendaftaran, Request Pinjam, Bukti Bayar Denda/Perpanjang"| Sistem
    Sistem -->|"KTA Digital, Info Peminjaman, Tagihan Denda, QRIS / No VA"| Siswa

    Petugas -->|"Input Peminjaman, Validasi Pengembalian, Update Denda Tunai"| Sistem
    Sistem -->|"Daftar Antrean Sirkulasi, Cetak Kwitansi Denda, Label Barcode"| Petugas

    KepalaPerpus -->|"Master Data Buku, Manajemen Akun Petugas, Konfigurasi Tarif"| Sistem
    Sistem -->|"Statistik Koleksi, Log Aktivitas, Laporan Inventaris Buku"| KepalaPerpus

    KepalaSekolah -->|"Permintaan Audit & Filter Periode Laporan"| Sistem
    Sistem -->|"Laporan Eksekutif Sirkulasi & Kas Denda Sah (Bertanda Tangan)"| KepalaSekolah

    Sistem -->|"Generate Request Tagihan (Invoice)"| PaymentGW
    PaymentGW -->|"Notifikasi Pembayaran Lunas (Callback Settlement)"| Sistem
```

### Data Flow Diagram (DFD Level 1)
```mermaid
flowchart TD
    Siswa["Siswa"]
    Petugas["Petugas Sirkulasi"]
    Admin["Kepala Perpustakaan"]
    Kepsek["Kepala Sekolah"]
    PayGW["Payment Gateway"]

    DS_Anggota[("D1 tb_anggota")]
    DS_Petugas[("D2 tb_petugas")]
    DS_Buku[("D3 tb_buku")]
    DS_Pinjam[("D4 tb_peminjaman")]
    DS_Kembali[("D5 tb_pengembalian")]
    DS_Atur[("D6 tb_pengaturan")]

    P1(("1.0 Autentikasi & Registrasi"))
    P2(("2.0 Manajemen Katalog & Rak"))
    P3(("3.0 Layanan Sirkulasi Peminjaman"))
    P4(("4.0 Layanan Pengembalian & Denda"))
    P5(("5.0 Transaksi Payment Gateway"))
    P6(("6.0 Pelaporan & Pengesahan"))

    Siswa -->|"Form Login / Register"| P1
    Petugas -->|"Kredensial Petugas"| P1
    Admin -->|"Kredensial Admin"| P1
    Kepsek -->|"Kredensial Kepsek"| P1
    P1 --- DS_Anggota
    P1 --- DS_Petugas

    Admin -->|"Kelola Data Buku & Stok"| P2
    P2 --- DS_Buku

    Siswa -->|"Request Pinjam Mandiri"| P3
    Petugas -->|"Pencatatan Peminjaman Loket"| P3
    P3 --- DS_Pinjam
    P3 --- DS_Buku
    P3 --- DS_Anggota
    P3 --- DS_Petugas

    Petugas -->|"Input Pengembalian Buku"| P4
    P4 --- DS_Kembali
    P4 --- DS_Pinjam
    P4 --- DS_Buku
    P4 --- DS_Atur

    Siswa -->|"Bayar Denda / Perpanjang"| P5
    P5 --> PayGW
    PayGW --> P5
    P5 --- DS_Kembali
    P5 --- DS_Pinjam

    Kepsek -->|"Cetak Rekap Laporan"| P6
    Admin -->|"Cetak Inventaris"| P6
    DS_Buku --> P6
    DS_Pinjam --> P6
    DS_Kembali --> P6
```

---

## 🎭 5. Use Case Diagram UML & Spesifikasi Peranan

```mermaid
flowchart LR
    subgraph Aktor ["Aktor Pengguna"]
        A_Siswa["👤 Siswa / Anggota"]
        A_Petugas["👮 Petugas Sirkulasi"]
        A_Admin["👩‍💼 Kepala Perpustakaan"]
        A_Kepsek["👨‍💼 Kepala Sekolah"]
        A_PG["💳 Payment Gateway Provider"]
    end

    subgraph Use_Cases ["Use Cases Sistem Perpustakaan"]
        UC1(["Login & Registrasi Siswa"])
        UC2(["Pencarian & Pratinjau Katalog Buku"])
        UC3(["Peminjaman Buku Mandiri (Maks 2)"])
        UC4(["Cetak KTA Digital Siswa"])
        UC5(["Pembayaran Digital (QRIS / VA)"])
        UC6(["Pelayanan Front-Desk Peminjaman"])
        UC7(["Pengembalian Buku & Cek Fisik"])
        UC8(["Kalkulasi Denda Keterlambatan"])
        UC9(["Cetak Kwitansi Denda Loket"])
        UC10(["CRUD Master Data Koleksi Buku"])
        UC11(["Cetak Barcode & Label Rak Buku"])
        UC12(["Pengaturan Tarif Denda & SOP"])
        UC13(["Manajemen Akun Staf"])
        UC14(["Monitoring Eksekutif & Pengesahan Laporan"])
    end

    A_Siswa --> UC1
    A_Siswa --> UC2
    A_Siswa --> UC3
    A_Siswa --> UC4
    A_Siswa --> UC5

    A_Petugas --> UC1
    A_Petugas --> UC2
    A_Petugas --> UC6
    A_Petugas --> UC7
    A_Petugas --> UC8
    A_Petugas --> UC9
    A_Petugas --> UC11

    A_Admin --> UC1
    A_Admin --> UC2
    A_Admin --> UC10
    A_Admin --> UC11
    A_Admin --> UC12
    A_Admin --> UC13
    A_Admin --> UC14

    A_Kepsek --> UC1
    A_Kepsek --> UC14

    UC7 -.->|"[include]"| UC8
    UC8 -.->|"[extend]"| UC5
    UC8 -.->|"[extend]"| UC9
    A_PG --> UC5
```

---

## 🗄️ 6. Struktur Basis Data 3NF, ERD & Populasi 20+ Data Dummy

### 6.1 Entity Relationship Diagram (ERD Terkoneksi Penuh)

```mermaid
erDiagram
    tb_anggota ||--o{ tb_peminjaman : memiliki_riwayat
    tb_petugas ||--o{ tb_peminjaman : mencatat_pinjam
    tb_buku ||--o{ tb_peminjaman : item_pinjam
    tb_peminjaman ||--o| tb_pengembalian : diselesaikan_pada
    tb_petugas ||--o{ tb_pengembalian : menerima_kembali
    tb_petugas ||--o{ tb_pengaturan : mengonfigurasi

    tb_anggota {
        varchar nisn PK
        varchar nama_lengkap
        varchar kelas
        mediumtext foto
        enum jenis_kelamin
        varchar password
        timestamp created_at
        timestamp updated_at
    }

    tb_petugas {
        varchar username PK
        varchar nama_petugas
        varchar role
        varchar jabatan
        mediumtext foto
        varchar password
        varchar remember_token
        timestamp created_at
        timestamp updated_at
    }

    tb_buku {
        varchar kd_buku PK
        varchar judul_buku
        varchar pengarang
        varchar penerbit
        varchar lokasi_rak
        varchar tahun_terbit
        int stok
        timestamp created_at
        timestamp updated_at
    }

    tb_peminjaman {
        varchar kd_peminjaman PK
        varchar kd_buku FK
        varchar nisn FK
        varchar nama_anggota
        date tgl_peminjaman
        date tgl_jatuh_tempo
        enum status
        varchar petugas_pinjam FK
        int perpanjangan_count
        decimal biaya_perpanjangan
        varchar metode_bayar_perpanjang
        varchar id_transaksi_perpanjang
        timestamp created_at
        timestamp updated_at
    }

    tb_pengembalian {
        varchar kd_pengembalian PK
        varchar kd_peminjaman FK
        date tgl_pengembalian
        varchar keterangan
        decimal denda
        varchar petugas_kembali FK
        enum status_denda
        varchar metode_pembayaran
        varchar id_transaksi_gateway
        datetime waktu_bayar
        timestamp created_at
        timestamp updated_at
    }

    tb_pengaturan {
        int id PK
        varchar kunci UK
        text nilai
        varchar keterangan
        varchar diubah_oleh FK
        timestamp updated_at
    }
```

---

### 6.2 Kaidah Normalisasi Bentuk Ketiga (3NF)

1. **Bentuk Normal Pertama (1NF)**: Setiap kolom hanya memuat nilai skalar tunggal (atomik), tidak ada kolom bernilai jamak (*multivalued*), dan tidak ada kelompok berulang (*repeating groups*).
2. **Bentuk Normal Kedua (2NF)**: Memenuhi 1NF dan seluruh atribut bukan kunci (*non-key attributes*) memiliki ketergantungan fungsional penuh (*fully functionally dependent*) pada kunci utama (*Primary Key*).
3. **Bentuk Normal Ketiga (3NF)**: Memenuhi 2NF dan tidak mengandung ketergantungan transitif (*no transitive dependency*), di mana atribut bukan kunci tidak boleh bergantung pada atribut bukan kunci lainnya.

---

### 6.3 Ringkasan Volume Dataset (Target vs Realisasi Aktual)

| Nama Tabel / Entitas | Target Minimal Tugas | Realisasi Aktual | Persentase | Status Pengujian |
| :--- | :---: | :---: | :---: | :---: |
| **`tb_buku`** (Master Koleksi Buku) | $\ge 20$ record | **25 Buku** | **125%** | ✅ Valid (MySQL & Mock Sync) |
| **`tb_anggota`** (Master Siswa/Anggota) | $\ge 20$ record | **25 Siswa** | **125%** | ✅ Valid (MySQL & Mock Sync) |
| **`tb_peminjaman`** (Sirkulasi Pinjam) | $\ge 20$ record | **25 Transaksi** | **125%** | ✅ Valid (MySQL & Mock Sync) |
| **`tb_pengembalian`** (Sirkulasi Kembali) | $\ge 20$ record | **20 Transaksi** | **100%** | ✅ Valid (MySQL & Mock Sync) |
| **`tb_petugas`** (Staf & Supervisor) | $\ge 3$ record | **3 Akun** | **100%** | ✅ Valid (MySQL & Mock Sync) |
| **`tb_pengaturan`** (Kebijakan SOP) | 1 konfigurasi | **1 Master SOP** | **100%** | ✅ Valid (MySQL & Mock Sync) |

---

### 6.4 Daftar 25 Master Koleksi Buku (`tb_buku`)

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

### 6.5 Daftar 25 Master Siswa / Anggota (`tb_anggota`)

| No | NISN (Login) | Nama Lengkap Siswa | Kelas | No. Handphone / WhatsApp | Alamat Siswa |
| :-: | :--- | :--- | :---: | :--- | :--- |
| 1 | `2024001` | Muhammad Rizky Pratama | XII MIPA 1 | 081234567890 | Jl. Ahmad Dahlan No. 12, Pekalongan |
| 2 | `2024002` | Annisa Putri Maharani | XI IPS 2 | 081234567891 | Jl. Sudirman No. 45, Batanghari |
| 3 | `2024003` | Dimas Arya Sena | XII MIPA 2 | 081234567892 | Jl. Ki Hajar Dewantara No. 8, Metro |
| 4 | `2024004` | Siti Nur Aini | X-1 | 081234567893 | Jl. KH Ahmad Dahlan No. 99, Pekalongan |
| 5 | `2024005` | Fajar Ramadhan | XI MIPA 1 | 081234567894 | Jl. Merdeka No. 17, Sekampung |
| 6 | `2024006` | Dewi Lestari | XII IPS 1 | 081234567895 | Jl. Diponegoro No. 3, Batanghari |
| 7 | `2024007` | Rahmat Hidayat | XI MIPA 2 | 081234567896 | Jl. Gajah Mada No. 22, Pekalongan |
| 8 | `2024008` | Tiara Safitri | X-2 | 081234567897 | Jl. Imam Bonjol No. 14, Pekalongan |
| 9 | `2024009` | Bagas Kurniawan | XII MIPA 1 | 081234567898 | Jl. Pahlawan No. 56, Pekalongan |
| 10 | `2024010` | Nurul Hasanah | XI IPS 1 | 081234567899 | Jl. Kartini No. 7, Pekalongan |
| 11 | `2024011` | Bayu Pamungkas | X-3 | 081345678901 | Jl. Hasanuddin No. 88, Pekalongan |
| 12 | `2024012` | Indah Permatasari | XII IPS 2 | 081345678902 | Jl. Cut Nyak Dien No. 19, Pekalongan |
| 13 | `2024013` | Galih Pratama | XI MIPA 3 | 081345678903 | Jl. Teuku Umar No. 31, Pekalongan |
| 14 | `2024014` | Zahra Amelia | X-1 | 081345678904 | Jl. Pattimura No. 62, Batanghari |
| 15 | `2024015` | Dede Kurnia | XII MIPA 2 | 081345678905 | Jl. Raden Intan No. 5, Metro |
| 16 | `2024016` | Maya Anggraini | XI IPS 2 | 081345678906 | Jl. Dr. Sutomo No. 11, Pekalongan |
| 17 | `2024017` | Hendra Wijaya | X-2 | 081345678907 | Jl. Yos Sudarso No. 44, Pekalongan |
| 18 | `2024018` | Putri Sekar Arum | XII MIPA 1 | 081345678908 | Jl. Veteran No. 23, Pekalongan |
| 19 | `2024019` | Aditya Pratama | XI MIPA 1 | 081345678909 | Jl. Pemuda No. 78, Pekalongan |
| 20 | `2024020` | Luthfi Hakim | X-3 | 081345678910 | Jl. Cendrawasih No. 15, Pekalongan |
| 21 | `2024021` | Nabila Syakieb | XII IPS 1 | 081345678911 | Jl. Melati No. 2, Batanghari |
| 22 | `2024022` | Kevin Sanjaya | XI IPS 1 | 081345678912 | Jl. Anggrek No. 9, Pekalongan |
| 23 | `2024023` | Farhan Maulana | X-2 | 081345678913 | Jl. Mawar No. 33, Pekalongan |
| 24 | `2024024` | Tari Rahmawati | XII MIPA 2 | 081345678914 | Jl. Flamboyan No. 27, Pekalongan |
| 25 | `2024025` | Wildan Nugraha | XI MIPA 2 | 081345678915 | Jl. Kenanga No. 51, Pekalongan |

---

### 6.6 Rincian Transaksi Sirkulasi Peminjaman & Pengembalian
- **Peminjaman (`tb_peminjaman`)**:
  - `PJ001` s/d `PJ020`: Transaksi selesai yang telah dikembalikan (`status = kembali`).
  - `PJ021` s/d `PJ025`: Transaksi aktif yang sedang berjalan (`status = dipinjam`), termasuk buku yang mendekati jatuh tempo dan melewati jatuh tempo guna menguji kalkulasi denda dinamis dan fitur WhatsApp Reminder.
- **Pengembalian & Denda (`tb_pengembalian`)**:
  - `KB001` s/d `KB020`: Total 20 data pengembalian dengan rincian denda bervariasi:
    - 11 Transaksi bebas denda / tepat waktu ($denda = 0$, `status_denda = lunas`).
    - 5 Transaksi terlambat dilunasi melalui **Payment Gateway QRIS Nasional** (`metode_pembayaran = QRIS`, disertai ID Transaksi settlement resmi).
    - 4 Transaksi terlambat dilunasi secara **Tunai di Loket Konter Sirkulasi** (`metode_pembayaran = Tunai Loket`).

---

### 6.7 Master Petugas & Konfigurasi SOP (`tb_pengaturan`)

- **Master Petugas (`tb_petugas`)**:
  - `admin` (Siti Farida, A.Md - Kepala Unit Perpustakaan)
  - `petugas2` (Samsul Arifin, S.Pd - Petugas Sirkulasi)
  - `kepsek` (Ahmad Marzuki, S.Pd.I - Kepala Sekolah)
- **Konfigurasi SOP (`tb_pengaturan`)**:
  - `tarif_denda`: Rp 1.000 / hari keterlambatan
  - `durasi_pinjam`: 7 hari kalender
  - `biaya_perpanjangan`: Rp 0 (Dispensasi)
  - `qris_merchant`: `lupayyy, Konter`
  - `qris_nmid`: `ID1026632009753`

---

## 📈 7. Activity Diagram, State Machine & Sequence Diagram

### 7.1 Activity Diagram Peminjaman Buku
```mermaid
flowchart TD
    Start(["Mulai Transaksi Pinjam"]) --> InputForm["Input / Pilih Siswa dan Buku"]
    InputForm --> CekStok{"Cek Stok Fisik Buku > 0 ?"}
    
    CekStok -- "Tidak" --> ErrStok["Tampilkan Peringatan: Stok Buku Sedang Habis"]
    ErrStok --> SelesaiFail(["Transaksi Dibatalkan"])
    
    CekStok -- "Ya" --> CekKuota{"Cek Kuota Pinjam Aktif Siswa < 2 Buku ?"}
    CekKuota -- "Tidak" --> ErrKuota["Tampilkan Peringatan: Batas Maksimal 2 Buku Aktif Tercapai"]
    ErrKuota --> SelesaiFail
    
    CekKuota -- "Ya" --> GenerateKode["Generate Kode Transaksi Otomatis PJxxx"]
    GenerateKode --> HitungTempo["Hitung Tanggal Jatuh Tempo Sesuai Durasi tb_pengaturan"]
    HitungTempo --> SimpanDB["Simpan ke tb_peminjaman dengan Relasi NISN & Petugas"]
    SimpanDB --> PotongStok["Update tb_buku: Kurangi Stok Fisik -1"]
    PotongStok --> SuksesPinjam["Peminjaman Aktif & Masuk Antrean Sirkulasi"]
    SuksesPinjam --> Selesai(["Selesai"])
```

### 7.2 Activity Diagram Pengembalian & Denda
```mermaid
flowchart TD
    Start(["Mulai Pengembalian Buku"]) --> CariKode["Petugas Memilih Kode Peminjaman PJxxx"]
    CariKode --> CekTanggal{"Tanggal Pengembalian > Tanggal Jatuh Tempo ?"}
    
    CekTanggal -- "Tidak Terlambat" --> DendaNol["Set Denda = Rp 0 & Status Tanpa Denda"]
    DendaNol --> UpdatePengembalian["Simpan Record ke tb_pengembalian"]
    
    CekTanggal -- "Terlambat" --> HitungHari["Hitung Selisih Hari Keterlambatan"]
    HitungHari --> AmbilTarif["Ambil Tarif Denda Per Hari dari tb_pengaturan"]
    AmbilTarif --> KalkulasiDenda["Hitung Total: Selisih Hari x Tarif Denda"]
    KalkulasiDenda --> PilihanBayar{"Pilih Jalur Pelunasan Denda"}
    
    PilihanBayar -- "Tunai Loket" --> SetLunasTunai["Petugas Terima Uang Tunai & Cetak Kwitansi"]
    SetLunasTunai --> UpdatePengembalian
    
    PilihanBayar -- "Payment Gateway" --> BukaGateway["Buka Modal Gateway: Scan QRIS / No VA"]
    BukaGateway --> VerifGateway["Konfirmasi Pembayaran Digital Berhasil"]
    VerifGateway --> UpdatePengembalian
    
    UpdatePengembalian --> PulihkanStok["Update tb_buku: Tambah Stok Fisik +1"]
    PulihkanStok --> UpdateStatusPinjam["Update Status tb_peminjaman = Dikembalikan"]
    UpdateStatusPinjam --> Selesai(["Selesai & Kwitansi Siap Dicetak"])
```

### 7.3 Sequence Diagram Interaksi Payment Gateway QRIS
```mermaid
sequenceDiagram
    autonumber
    actor Siswa as "Siswa / Anggota"
    participant UI as "React Frontend (PaymentGatewayModal)"
    participant API as "PHP RESTful API"
    participant DB as "Database MySQL (skripsi_perpus)"
    participant PG as "Payment Gateway (QRIS / Bank)"

    Siswa->>UI: Klik Lunasi Denda Digital atau Perpanjang Pinjaman
    UI->>API: POST /api/payment-gateway/create-invoice (Nominal, KD Transaksi)
    API->>DB: Query tarif denda & merchant info dari tb_pengaturan
    DB-->>API: Data konfigurasi (NMID: ID1026632009753, Merchant: lupayyy, Konter)
    API-->>UI: Return Invoice (Order ID, Nomor VA BCA/BRI/Mandiri, Barcode QRIS)
    
    UI-->>Siswa: Tampilkan QR Code Standar Nasional
    Siswa->>PG: Scan QRIS via Mobile Banking / E-Wallet (DANA, Livin, BCA)
    PG-->>Siswa: Notifikasi Uang Berhasil Ditransfer
    
    Siswa->>UI: Verifikasi otomatis status transaksi
    UI->>API: POST /api/pengembalian/bayar-denda (id_transaksi_gateway, metode)
    API->>DB: UPDATE tb_pengembalian SET status_denda='Lunas', waktu_bayar=NOW()
    API->>DB: UPDATE tb_peminjaman SET status='Dikembalikan'
    DB-->>API: Transaksi Berhasil Diperbarui
    API-->>UI: Response HTTP 200 (Status: SETTLED / LUNAS)
    UI-->>Siswa: Tampilkan Badge LUNAS, Nomor Referensi & Kwitansi
```

### 7.4 State Machine Diagram Siklus Status Pustaka
```mermaid
stateDiagram-v2
    [*] --> TersediaDiRak: Buku Baru / Stok Bertambah
    TersediaDiRak --> Dipinjam: Siswa Melakukan Transaksi Peminjaman (Stok -1)
    
    state Dipinjam {
        [*] --> Aktif
        Aktif --> Diperpanjang: Siswa Ajukan Perpanjangan (+7 Hari)
        Diperpanjang --> Aktif: Masa Pinjam Diperbarui
    }

    Dipinjam --> Terlambat: Melewati Tanggal Jatuh Tempo
    
    Dipinjam --> Dikembalikan: Buku Dikembalikan Tepat Waktu (Tanpa Denda)
    Terlambat --> Dikembalikan: Buku Dikembalikan & Denda Terbayar (Tunai / Gateway)

    Dikembalikan --> TersediaDiRak: Stok Fisik Buku Dipulihkan (+1)
    Dikembalikan --> [*]: Transaksi Selesai & Diarsipkan
```

---

## 🧩 8. Class Diagram & Pemodelan Berorientasi Objek

```mermaid
classDiagram
    class Anggota {
        +String nisn
        +String nama_lengkap
        +String kelas
        +String foto
        +String jenis_kelamin
        +String password
        +login()
        +register()
        +updateProfile()
        +cetakKTADigital()
    }

    class Petugas {
        +String username
        +String nama_petugas
        +String role
        +String jabatan
        +String password
        +login()
        +validasiSirkulasi()
        +cetakLaporan()
    }

    class Buku {
        +String kd_buku
        +String judul_buku
        +String pengarang
        +String penerbit
        +String lokasi_rak
        +String tahun_terbit
        +int stok
        +tambahBuku()
        +updateStok(int delta)
        +cetakBarcode()
    }

    class Peminjaman {
        +String kd_peminjaman
        +String kd_buku
        +String nisn
        +String nama_anggota
        +Date tgl_peminjaman
        +Date tgl_jatuh_tempo
        +String status
        +String petugas_pinjam
        +int perpanjangan_count
        +decimal biaya_perpanjangan
        +createPeminjaman()
        +perpanjangDurasi()
    }

    class Pengembalian {
        +String kd_pengembalian
        +String kd_peminjaman
        +Date tgl_pengembalian
        +String keterangan
        +decimal denda
        +String status_denda
        +String metode_pembayaran
        +String id_transaksi_gateway
        +DateTime waktu_bayar
        +String petugas_kembali
        +hitungDenda()
        +prosesPengembalian()
        +cetakKwitansi()
    }

    class PengaturanSistem {
        +int id
        +String kunci
        +String nilai
        +String keterangan
        +getPengaturan()
        +updatePengaturan()
    }

    class PaymentGatewayService {
        +createInvoice(orderId, nominal, channel)
        +simulateCallback(orderId)
        +verifySettlement(orderId)
    }

    Anggota --> Peminjaman : melakukan
    Petugas --> Peminjaman : melayani_input
    Buku --> Peminjaman : dipinjam
    Peminjaman --> Pengembalian : diselesaikan_dengan
    Petugas --> Pengembalian : memverifikasi
    Pengembalian ..> PaymentGatewayService : menggunakan
    Peminjaman ..> PengaturanSistem : membaca_durasi
    Pengembalian ..> PengaturanSistem : membaca_tarif_denda
```

---

## 🧭 9. Standar Operasional Prosedur & Flowchart Sistem (7 Alur)

### A. Flowchart Sistem Berjalan vs Sistem Usulan
```mermaid
flowchart TD
    subgraph Flowchart_Sistem_Berjalan ["Sistem Berjalan (Konvensional Manual)"]
        SB_Start(["Mulai"]) --> SB_1[/"Siswa Menyerahkan Kartu & Buku Fisik"/]
        SB_1 --> SB_2["Petugas Mencari Kartu Anggota di Rak Dokumen"]
        SB_2 --> SB_3["Petugas Menulis di Buku Besar Peminjaman"]
        SB_3 --> SB_4{"Apakah Terjadi Keterlambatan?"}
        SB_4 -- "Ya" --> SB_5["Petugas Menghitung Denda Manual"]
        SB_4 -- "Tidak" --> SB_6["Buku Masuk Rak"]
        SB_5 --> SB_7[/"Siswa Membayar Tunai Fisik"/]
        SB_7 --> SB_8["Petugas Menulis Bukti di Kertas Bon"]
        SB_8 --> SB_End(["Selesai"])
        SB_6 --> SB_End
    end

    subgraph Flowchart_Sistem_Usulan ["Sistem Usulan (Modern Web Decoupled + QRIS)"]
        SU_Start(["Mulai"]) --> SU_1[/"Siswa / Petugas Input Kode Buku & NISN di Web"/]
        SU_1 --> SU_2[("Sistem Validasi Kuota 2 Buku & Stok Otomatis di MySQL")]
        SU_2 --> SU_3{"Data Valid & Stok Ada?"}
        SU_3 -- "Tidak" --> SU_Err[/"Tolak Transaksi & Munculkan Notifikasi"/]
        SU_3 -- "Ya" --> SU_4["Simpan Transaksi & Auto-Generate Kode PJxxx"]
        SU_4 --> SU_5{"Buku Dikembalikan?"}
        SU_5 -- "Ya" --> SU_6[("Engine Denda Hitung Otomatis via tb_pengaturan")]
        SU_6 --> SU_7{"Ada Denda Keterlambatan?"}
        SU_7 -- "Ya" --> SU_8[/"Pilihan Bayar: Tunai Loket / QRIS Payment Gateway"/]
        SU_8 --> SU_9["Konfirmasi Bayar & Pulihkan Stok +1"]
        SU_7 -- "Tidak" --> SU_9
        SU_9 --> SU_10[/"Cetak Kwitansi & Laporan Otomatis Bertanda Tangan"/]
        SU_10 --> SU_End(["Selesai"])
        SU_Err --> SU_End
    end
```

### B. Flowchart Login Multi-Role (RBAC)
```mermaid
flowchart TD
    StartLogin(["Mulai"]) --> TampilkanLogin[/"Tampilkan Halaman Login Portal"/]
    TampilkanLogin --> PilihRole{"Pilih Jenis Akun"}
    
    PilihRole -- "Petugas / Admin" --> InputStaff[/"Input Username & Password Petugas"/]
    PilihRole -- "Siswa / Anggota" --> InputSiswa[/"Input NISN & Password Siswa"/]
    
    InputStaff --> CekStaffDB[("Query ke tb_petugas WHERE username=?")]
    CekStaffDB --> ValidStaff{"Kredensial Sesuai?"}
    ValidStaff -- "Tidak" --> PesanGagalStaff[/"Tampilkan Pesan: Username / Password Salah"/]
    PesanGagalStaff --> TampilkanLogin
    ValidStaff -- "Ya" --> CekRoleStaff{"Cek Kolom Role"}
    
    CekRoleStaff -- "kepala_perpus (admin)" --> DashAdmin[/"Buka Dashboard Super Admin: Kelola Buku, Staf & Pengaturan"/]
    CekRoleStaff -- "petugas_sirkulasi (petugas2)" --> DashPetugas[/"Buka Loket Sirkulasi: Pelayanan Pinjam & Denda"/]
    CekRoleStaff -- "kepala_sekolah (kepsek)" --> DashKepsek[/"Buka Portal Eksekutif: Audit Mutu & Pengesahan Laporan"/]

    InputSiswa --> CekSiswaDB[("Query ke tb_anggota WHERE nisn=?")]
    CekSiswaDB --> ValidSiswa{"Password Sesuai?"}
    ValidSiswa -- "Tidak" --> PesanGagalSiswa[/"Tampilkan Pesan: NISN / Password Tidak Valid"/]
    PesanGagalSiswa --> TampilkanLogin
    ValidSiswa -- "Ya" --> DashSiswa[/"Buka Portal Siswa: Katalog, Pinjam Mandiri & KTA Digital"/]

    DashAdmin --> SelesaiLogin(["Selesai"])
    DashPetugas --> SelesaiLogin
    DashKepsek --> SelesaiLogin
    DashSiswa --> SelesaiLogin
```

### C. Flowchart Transaksi Peminjaman Buku
```mermaid
flowchart TD
    StartPinjam(["Mulai Peminjaman Buku"]) --> PilihBuku[/"Pilih Buku dari Katalog Rak"/]
    PilihBuku --> QueryStok[("Query Stok dari tb_buku")]
    QueryStok --> CekStokBuku{"Stok Fisik > 0 ?"}
    
    CekStokBuku -- "Tidak" --> AlertHabis[/"Tampilkan: Stok Buku Sedang Kosong di Rak"/]
    AlertHabis --> StopFail(["Selesai / Gagal"])
    
    CekStokBuku -- "Ya" --> InputPeminjam[/"Pilih / Masukkan NISN Siswa"/]
    InputPeminjam --> QueryKuota[("Hitung Transaksi Aktif Siswa di tb_peminjaman")]
    QueryKuota --> CekMaksimal{"Jumlah Buku Aktif < 2 Buku ?"}
    
    CekMaksimal -- "Tidak" --> AlertKuota[/"Tampilkan: Kuota Maksimal 2 Buku Telah Tercapai"/]
    AlertKuota --> StopFail
    
    CekMaksimal -- "Ya" --> GenerateNomor["Generate Otomatis Kode Transaksi: PJxxx"]
    GenerateNomor --> AmbilDurasi[("Ambil durasi_pinjam dari tb_pengaturan")]
    AmbilDurasi --> HitungTempo["Hitung Tanggal Jatuh Tempo = Hari Pinjam + Durasi"]
    HitungTempo --> BeginTrans["Mulai Transaksi Database (ACID)"]
    BeginTrans --> InsertPinjam[("INSERT INTO tb_peminjaman dengan FK nisn, kd_buku, petugas")]
    InsertPinjam --> KurangStok[("UPDATE tb_buku SET stok = stok - 1")]
    KurangStok --> CommitTrans["Commit Transaksi ke MySQL"]
    CommitTrans --> TampilSukses[/"Tampilkan Notifikasi Berhasil & Masuk Daftar Sirkulasi"/]
    TampilSukses --> StopSuccess(["Selesai"])
```

### D. Flowchart Pengembalian Buku & Perhitungan Denda Otomatis
```mermaid
flowchart TD
    StartKembali(["Mulai Pengembalian Buku"]) --> PilihTransaksi[/"Pilih Transaksi Peminjaman Aktif PJxxx"/]
    PilihTransaksi --> BacaData[("Baca Data Transaksi & tgl_jatuh_tempo")]
    BacaData --> InputKondisi[/"Input Tanggal Kembali & Keterangan Kondisi Buku"/]
    InputKondisi --> BandingkanTanggal{"Tanggal Kembali > Tanggal Jatuh Tempo ?"}
    
    BandingkanTanggal -- "Tidak Terlambat" --> NolDenda["Set Denda = Rp 0, Status = Tanpa Denda"]
    NolDenda --> SimpanPengembalian["Mulai Simpan Pengembalian Database"]
    
    BandingkanTanggal -- "Terlambat" --> HitungSelisih["Hitung Selisih Hari Terlambat = Kembali - Tempo"]
    HitungSelisih --> BacaTarif[("SELECT nilai FROM tb_pengaturan WHERE kunci = tarif_denda")]
    BacaTarif --> HitungTotalDenda["Total Denda = Selisih Hari x Tarif Denda"]
    HitungTotalDenda --> TampilNominalDenda[/"Tampilkan Rincian Hari Terlambat & Total Denda"/]
    TampilNominalDenda --> MetodeBayar{"Pilih Metode Bayar"}
    
    MetodeBayar -- "Tunai Loket" --> BayarTunai[/"Siswa Menyerahkan Uang Tunai ke Petugas"/]
    BayarTunai --> SetLunasTunai["Set status_denda = Lunas, metode = Tunai Loket"]
    SetLunasTunai --> SimpanPengembalian
    
    MetodeBayar -- "Payment Gateway" --> BukaModalGateway[/"Buka Modal Gateway: Tampilkan QRIS / Virtual Account"/]
    BukaModalGateway --> ProsesGateway["Siswa Transfer via HP & Konfirmasi Pembayaran"]
    ProsesGateway --> SetLunasGateway["Set status_denda = Lunas, metode = QRIS/VA, simpan order_id"]
    SetLunasGateway --> SimpanPengembalian

    SimpanPengembalian --> InsertKembali[("INSERT INTO tb_pengembalian")]
    InsertKembali --> UpdatePinjam[("UPDATE tb_peminjaman SET status = Dikembalikan")]
    UpdatePinjam --> TambahStok[("UPDATE tb_buku SET stok = stok + 1")]
    TambahStok --> CetakKwitansiOpsi{"Cetak Kwitansi Denda?"}
    
    CetakKwitansiOpsi -- "Ya" --> PrintBon[/"Generate & Cetak Struk Kwitansi Denda"/]
    CetakKwitansiOpsi -- "Tidak" --> SelesaiKembali(["Selesai"])
    PrintBon --> SelesaiKembali
```

### E. Flowchart Pembayaran Digital Melalui Payment Gateway QRIS
```mermaid
flowchart TD
    StartPG(["Mulai Pembayaran Digital"]) --> KlikBayar[/"Klik Tombol Bayar Digital pada Transaksi"/]
    KlikBayar --> PanggilAPI["POST /api/payment-gateway/create-invoice"]
    PanggilAPI --> AmbilConfig[("Ambil qris_merchant & qris_nmid dari tb_pengaturan")]
    AmbilConfig --> GenerateInvoice["Buat Invoice Tagihan: Order ID & Nominal Tepat"]
    GenerateInvoice --> TampilModal[/"Tampilkan Modal Payment Gateway"/]
    
    TampilModal --> PilihChannel{"Pilih Saluran Pembayaran"}
    
    PilihChannel -- "QRIS" --> TampilQRIS[/"Tampilkan Barcode QRIS lupayyy Konter"/]
    TampilQRIS --> ScanHP[/"Siswa Buka E-Wallet / Mobile Banking & Scan Barcode"/]
    ScanHP --> TransferDana[/"Input Nominal Sesuai Tagihan & Konfirmasi di HP"/]
    TransferDana --> KlikKonfirmasi[/"Siswa / Petugas Melakukan Verifikasi Pembayaran"/]
    
    PilihChannel -- "Virtual Account Bank" --> GenerateVA["Generate Nomor VA Unik: 88012+NISN"]
    GenerateVA --> TampilVA[/"Tampilkan Nomor VA BCA / BRI / Mandiri"/]
    TampilVA --> SalinVA[/"Klik Tombol Salin Nomor VA"/]
    SalinVA --> TransferATM[/"Siswa Transfer via Menu Virtual Account ATM / Livin / BRIMO"/]
    TransferATM --> KlikKonfirmasi

    KlikKonfirmasi --> KirimVerifikasi["POST /api/pengembalian/bayar-denda atau perpanjang"]
    KirimVerifikasi --> UpdateStatusDB[("UPDATE Database: status = Lunas & simpan id_gateway")]
    UpdateStatusDB --> TampilBadgeLunas[/"Tampilkan Badge Hijau: LUNAS SETTLED"/]
    TampilBadgeLunas --> EndPG(["Selesai & Modal Ditutup"])
```

### F. Flowchart Perpanjangan Peminjaman Buku (+7 Hari)
```mermaid
flowchart TD
    StartPerpanjang(["Mulai Perpanjangan Pinjaman"]) --> CekPerpanjangCount[("Cek perpanjangan_count di tb_peminjaman")]
    CekPerpanjangCount --> BolehPerpanjang{"perpanjangan_count < 1 ?"}
    
    BolehPerpanjang -- "Tidak" --> TolakPerpanjang[/"Tampilkan: Batas Maksimal 1x Perpanjangan Telah Dipakai"/]
    TolakPerpanjang --> EndFail(["Selesai / Gagal"])
    
    BolehPerpanjang -- "Ya" --> AmbilBiaya[("Ambil biaya_perpanjangan dari tb_pengaturan")]
    AmbilBiaya --> CekBiayaAdmin{"Biaya Administrasi > 0 ?"}
    
    CekBiayaAdmin -- "Ya" --> JalurBayarPerpanjang{"Pilih Jalur Pembayaran"}
    JalurBayarPerpanjang -- "Tunai" --> PetugasTerima[/"Petugas Terima Biaya Tunai di Loket"/]
    JalurBayarPerpanjang -- "Payment Gateway" --> BukaPGPerpanjang[/"Buka Modal QRIS: Siswa Bayar Administrasi"/]
    BukaPGPerpanjang --> VerifBayarPerpanjang["Konfirmasi Pembayaran Gateway Berhasil"]
    
    CekBiayaAdmin -- "Tidak (Gratis)" --> ProsesUpdateMasa
    PetugasTerima --> ProsesUpdateMasa
    VerifBayarPerpanjang --> ProsesUpdateMasa
    
    ProsesUpdateMasa["Hitung Tanggal Jatuh Tempo Baru = Tempo Lama + 7 Hari"] --> UpdatePeminjamanDB[("UPDATE tb_peminjaman SET tgl_jatuh_tempo=baru, perpanjangan_count=1")]
    UpdatePeminjamanDB --> TampilSuksesPerpanjang[/"Tampilkan Notifikasi: Masa Pinjam Berhasil Diperpanjang +7 Hari"/]
    TampilSuksesPerpanjang --> EndPerpanjang(["Selesai"])
```

### G. Flowchart Pelaporan Eksekutif & Pengesahan Kepala Sekolah
```mermaid
flowchart TD
    StartLaporan(["Mulai Cetak Laporan"]) --> BukaMenuLaporan[/"Pilih Menu Laporan Eksekutif"/]
    BukaMenuLaporan --> PilihKategori{"Pilih Jenis Laporan"}
    
    PilihKategori -- "Laporan Inventaris Buku" --> FilterBuku[/"Pilih Filter: Semua Buku / Per Kategori Rak"/]
    FilterBuku --> QueryBuku[("SELECT * FROM tb_buku ORDER BY kd_buku")]
    QueryBuku --> RenderBuku[/"Tampilkan Tabel Lengkap Koleksi & Lokasi Rak Fisik"/]
    RenderBuku --> CetakDoc
    
    PilihKategori -- "Laporan Peminjaman" --> FilterTglPinjam[/"Input Rentang Tanggal: Tanggal Awal s.d. Tanggal Akhir"/]
    FilterTglPinjam --> QueryPinjam[("SELECT * FROM tb_peminjaman WHERE tgl_pinjam BETWEEN ? AND ?")]
    QueryPinjam --> RenderPinjam[/"Tampilkan Rekap Peminjaman Siswa"/]
    RenderPinjam --> CetakDoc

    PilihKategori -- "Laporan Pengembalian & Kas Denda" --> FilterTglKembali[/"Input Rentang Tanggal Pengembalian"/]
    FilterTglKembali --> QueryKembali[("SELECT * FROM tb_pengembalian WHERE tgl_kembali BETWEEN ? AND ?")]
    QueryKembali --> HitungTotalKas["Hitung Akumulasi Total Penerimaan Kas Denda"]
    HitungTotalKas --> RenderKembali[/"Tampilkan Rekap Pengembalian & Total Denda Terkumpul"/]
    RenderKembali --> CetakDoc

    CetakDoc[/"Klik Tombol Cetak Dokumen Resmi / Export PDF"/] --> AutoInjectKop["Sistem Menyematkan Kop Resmi SMA Muhammadiyah 1 Pekalongan"]
    AutoInjectKop --> AutoInjectTTD["Sistem Menyematkan Titimangsa Pekalongan & Tanda Tangan Digital Kepala Sekolah"]
    AutoInjectTTD --> DialogPrint[/"Buka Jendela Dialog Cetak Printer / Simpan PDF Browser"/]
    DialogPrint --> SelesaiLaporan(["Selesai & Laporan Sah Terbit"])
```

---

## 🚀 10. Panduan Instalasi, Menjalankan Aplikasi & Kredensial Demo

### A. Persiapan Basis Data (MySQL / phpMyAdmin)
1. Buka XAMPP Control Panel dan nyalakan modul **Apache** dan **MySQL** hingga berstatus `Running`.
2. Impor database skema dan dataset lengkap:
   ```powershell
   & "C:\xampp\mysql\bin\mysql.exe" -u root < "c:\semester 5\basis data lanjut\skripsi_perpus\backend\database\skripsi_perpus.sql"
   ```

### B. Menjalankan Backend RESTful API
```powershell
cd "c:\semester 5\basis data lanjut\skripsi_perpus\backend"
C:\xampp\php\php.exe -S 127.0.0.1:8000 -t public
```

### C. Menjalankan Frontend React (Vite SPA)
```powershell
cd "c:\semester 5\basis data lanjut\skripsi_perpus\frontend"
npm run dev
```
Aplikasi web siap diakses melalui peramban di: **`http://localhost:3000`**

### D. Kredensial Akun Pengujian Demo (Credentials)
| Peran (Role) | Username / NISN | Password | Wewenang Akses |
| :--- | :--- | :--- | :--- |
| **Kepala Unit Perpustakaan** | `admin` | `admin123` | Akses Penuh: Master buku, rak, denda, staf & laporan |
| **Petugas Sirkulasi Loket** | `petugas2` | `petugas123` | Pelayanan loket: Pinjam, kembali, denda tunai, barcode, WA |
| **Kepala Sekolah** | `kepsek` | `kepsek123` | Pengawasan mutu: Audit sirkulasi, kas denda & pengesahan laporan |
| **Siswa / Anggota** | `2024001` | `siswa123` | Portal mandiri: Katalog, pinjam mandiri, QRIS denda, cetak KTA |

---

## 🧪 11. Hasil Verifikasi Teknis & Pengujian Black Box Testing (17 Kasus)

### 11.1 Verifikasi Integritas MySQL Basis Data
Pengecekan integritas skema dan volume data baris dijalankan secara langsung pada MySQL database `skripsi_perpus`:
```sql
SELECT 'tb_buku' AS Entitas, COUNT(*) AS Total FROM tb_buku UNION ALL
SELECT 'tb_anggota', COUNT(*) FROM tb_anggota UNION ALL
SELECT 'tb_petugas', COUNT(*) FROM tb_petugas UNION ALL
SELECT 'tb_peminjaman', COUNT(*) FROM tb_peminjaman UNION ALL
SELECT 'tb_pengembalian', COUNT(*) FROM tb_pengembalian;
```
**Hasil Eksekusi:**
- `tb_buku`: **25 Baris** (Status: Valid, Berelasi Foreign Key)
- `tb_anggota`: **25 Baris** (Status: Valid, NISN Unique)
- `tb_petugas`: **3 Baris** (Status: Valid, RBAC Enkripsi Terverifikasi)
- `tb_peminjaman`: **25 Baris** (Status: Valid, Relasi Siswa & Koleksi Buku)
- `tb_pengembalian`: **20 Baris** (Status: Valid, Perhitungan Denda & QRIS Terhubung)

### 11.2 Verifikasi Kompilasi Frontend React (Vite Build)
Kompilasi kode sumber antarmuka dijalankan melalui perintah `npm run build` di lingkungan Node.js:
```bash
vite v5.4.21 building for production...
transforming...
✓ 1653 modules transformed.
dist/index.html                   0.78 kB │ gzip:   0.46 kB
dist/assets/index-DFwknTwe.css   64.71 kB │ gzip:  10.19 kB
dist/assets/index-Dfzq8zh-.js   472.52 kB │ gzip: 122.15 kB
✓ built in 4.60s
```
**Hasil:** Kompilasi berhasil 100% tanpa error (*Zero Warning, Zero Compilation Error*).

### 11.3 Pengujian Fungsional Black Box Testing (17 Skenario)

Pengujian fungsionalitas sistem menggunakan metode **Black Box Testing** dengan teknik *Equivalence Partitioning* dan *Boundary Value Analysis*:

| No | Kode Uji | Skenario Pengujian | Data Masukan (Input) | Hasil yang Diharapkan | Hasil Pengujian Aktual | Kesimpulan |
| :---: | :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | **TC-01** | Autentikasi Petugas / Admin | Username: `admin`, Password: `admin123` | Sistem memvalidasi kredensial, membuat sesi, dan mengarahkan ke Dashboard Utama | Berhasil masuk ke Dashboard Unit Perpustakaan | **VALID** |
| 2 | **TC-02** | Autentikasi dengan Kredensial Salah | Username: `admin`, Password: `salahpassword` | Sistem menolak akses dan menampilkan pesan peringatan kredensial tidak valid | Sistem memblokir akses dan memunculkan toast error | **VALID** |
| 3 | **TC-03** | Pendaftaran Anggota Baru (Siswa) | NISN: `2024099`, Nama: `Budi Santoso`, Kelas: `XI IPA 1` | Record baru tersimpan di `tb_anggota` dan siswa dapat langsung login mandiri | Data tersimpan di database dan KTA digital langsung aktif | **VALID** |
| 4 | **TC-04** | Validasi Duplikasi NISN Anggota | NISN: `2024001` (sudah terdaftar) | Sistem mendeteksi Primary Key duplikat dan menolak penyimpanan record | Sistem menampilkan pesan "NISN sudah digunakan" | **VALID** |
| 5 | **TC-05** | Transaksi Peminjaman Buku Normal | Siswa: `2024001`, Buku: `BK001` (Stok: 5, Pinjam Aktif: 0) | Transaksi tercatat di `tb_peminjaman`, stok buku berkurang menjadi 4 | Transaksi berhasil, stok `tb_buku` otomatis terpotong -1 | **VALID** |
| 6 | **TC-06** | Validasi Kuota Maksimal Pinjam Siswa | Siswa telah meminjam 2 buku aktif, mengajukan pinjaman ke-3 | Sistem menolak transaksi pinjaman ke-3 sesuai SOP kuota maksimal perpustakaan | Muncul notifikasi: "Batas maksimal 2 buku aktif tercapai" | **VALID** |
| 7 | **TC-07** | Validasi Stok Buku Kosong | Meminjam buku dengan `stok = 0` | Sistem menolak transaksi peminjaman dan memberi peringatan stok fisik habis | Peminjaman dibatalkan dan form memberikan instruksi ke petugas | **VALID** |
| 8 | **TC-08** | Perpanjangan Peminjaman (+7 Hari) | Peminjaman aktif dengan `perpanjangan_count = 0` | Tanggal jatuh tempo bertambah +7 hari dan `perpanjangan_count` menjadi 1 | Tanggal tempo diperbarui dan tombol perpanjang terkunci (1x) | **VALID** |
| 9 | **TC-09** | Validasi Batas Maksimal Perpanjangan | Mengajukan perpanjangan kedua pada record dengan `count = 1` | Sistem menolak perpanjangan kedua | Sistem mengunci tombol dan membatasi kuota maksimal 1 kali | **VALID** |
| 10 | **TC-10** | Pengembalian Buku Tepat Waktu | Buku dikembalikan sebelum/pada tanggal jatuh tempo | `status_denda` = `Tanpa Denda`, `denda` = Rp 0, stok buku dipulihkan +1 | Denda otomatis Rp 0 dan stok fisik kembali bertambah | **VALID** |
| 11 | **TC-11** | Kalkulasi Denda Keterlambatan Otomatis | Terlambat 3 hari (Tarif: Rp 1.000/hari di `tb_pengaturan`) | Sistem menghitung denda: $3 \times \text{Rp } 1.000 = \text{Rp } 3.000$ | Nominal denda tertera tepat Rp 3.000 secara otomatis | **VALID** |
| 12 | **TC-12** | Pelunasan Denda via QRIS Gateway | Scan QRIS dan verifikasi pembayaran digital | Record `tb_pengembalian` di-update: `status_denda`='Lunas', simpan `id_gateway` | Transaksi otomatis lunas dan kwitansi resmi siap terbit | **VALID** |
| 13 | **TC-13** | Cetak Kartu Anggota (KTA) Digital | Klik tombol cetak KTA pada data siswa | Kartu siswa ter-render rapi lengkap dengan barcode NISN dan foto | Desain KTA standar nasional siap dicetak printer / PDF | **VALID** |
| 14 | **TC-14** | Cetak Struk Kwitansi Denda Resmi | Klik tombol cetak kwitansi pada transaksi lunas | Struk kwitansi memuat nomor transaksi, kop sekolah, dan rincian denda | Kwitansi resmi terbit dengan format termal/standar loket | **VALID** |
| 15 | **TC-15** | Pengesahan Laporan oleh Kepala Sekolah | Login peran `kepsek`, buka modul laporan, cetak | Dokumen laporan menyematkan kop surat resmi dan TTD Kepala Sekolah | Laporan terbit sah dengan nama Ahmad Marzuki, S.Pd.I | **VALID** |
| 16 | **TC-16** | Ekspor Laporan ke Spreadsheet / Excel | Klik tombol "Export ke Excel/CSV" | Berkas `.csv` otomatis terunduh dengan struktur kolom lengkap | File spreadsheet terunduh dan dapat dibuka sempurna di Excel | **VALID** |
| 17 | **TC-17** | Notifikasi Pengingat Jatuh Tempo WhatsApp | Klik tombol "Ingatkan WA" pada transaksi terlambat/H-1 | Membuka API WhatsApp dengan template pesan penagihan otomatis | Pesan peringatan terisi otomatis menuju nomor siswa | **VALID** |

---

## 👨‍🎓 12. Profil Penyusun

* **Perguruan Tinggi:** Universitas Muhammadiyah Metro
* **Fakultas / Program Studi:** S1 Ilmu Komputer / Sistem Informasi
* **Mata Kuliah / Tugas:** Basis Data Lanjut (Semester 5) / Tugas Akhir Skripsi
* **Tahun Akademik:** 2026 / 2027
* **Instansi Penelitian:** SMA Muhammadiyah 1 Pekalongan, Kab. Lampung Timur
* **Repositori GitHub:** [https://github.com/fanydarat757-hash/antigrafitytest](https://github.com/fanydarat757-hash/antigrafitytest)
