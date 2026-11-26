# SISTEM PANDUAN TEKNIS & DOKUMENTASI ARSITEKTUR

## Sistem Informasi Perpustakaan SMA Muhammadiyah 1 Pekalongan, Lampung Timur
### Dokumen Rujukan Tugas Akhir / Skripsi & Mata Kuliah Dasar Data Lanjut

---

### 📌 1. Identitas Sistem & Objek Penelitian
* **Instansi**: SMA Muhammadiyah 1 Pekalongan
* **Alamat**: Jl. Raya Pekalongan, Kec. Pekalongan, Kab. Lampung Timur, Prov. Lampung
* **Stack Teknologi**:
  * **Frontend**: React.js 18 (Vite SPA) + Tailwind CSS + Lucide Icons (Port 3000)
  * **Backend**: Arsitektur API RESTful PHP / Pola Layanan Laravel (Port 8000)
  * **Basis Data**: MySQL / MariaDB (InnoDB Relational Engine dengan Foreign Key yang Diterapkan)
  * **Gerbang Pembayaran**: Multi Channel QRIS (Merchant Nasional) & Bank Virtual Account (BCA, BRI, Mandiri)
* **Aktor Sistem (Kontrol Akses Berbasis Peran / RBAC)**:
  1. **Kepala Unit Perpustakaan** (`admin`): Siti Farida, A.Md
  2. **Petugas Sirkulasi & Pelayanan** (`petugas2`): Samsul Arifin, S.Pd
  3. **Kepala Sekolah / Pembimbing Mutu** (`kepsek`): Ahmad Marzuki, S.Pd.I
  4. **Siswa / Anggota Perpustakaan** (`nisn`): Login mandiri & registrasi siswa
  > 📑 *Rujukan Lengkap Otorisasi & Matriks CRUD Pengguna vs Entitas:* [MATRIKS_HAK_AKSES_DAN_ENTITAS.md](MATRIKS_HAK_AKSES_DAN_ENTITAS.md) | [LAPORAN_PROGRESS_DAN_MATRIKS_SISTEM.md](LAPORAN_PROGRESS_DAN_MATRIKS_SISTEM.md)

---

### 🏗️ 2. Arsitektur Sistem 3-Tier (Three-Tier Architecture)

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

### 🔄 3. Diagram Konteks (Context Diagram / DFD Level 0)

Diagram Konteks menggambarkan batas sistem (*system boundary*) serta arus pertukaran data antara Sistem Informasi Perpustakaan SMA Muhammadiyah 1 Pekalongan dengan seluruh entitas eksternal.

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

---

### 📊 4. Data Flow Diagram (DFD Level 1)

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

### 🎭 5. Use Case Diagram (UML)

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

### 🗄️ 6. Entity Relationship Diagram (ERD Terkoneksi Penuh)

Relasi antar-tabel dalam database `skripsi_perpus` telah dinormalisasi hingga tahap **Third Normal Form (3NF)** dengan seluruh **Foreign Key Constraints** yang aktif di engine InnoDB MySQL:

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

> [!NOTE] Penjelasan Entitas `tb_pengaturan` pada Ujian Sidang Skripsi
> Tabel `tb_pengaturan` bertindak sebagai *Tabel Master Konfigurasi Global Sistem* (*Key-Value Store*). Sesuai kaidah normalisasi basis data, parameter global (seperti besaran denda harian Rp 1.000 atau durasi standar peminjaman 7 hari) sengaja disimpan dalam tabel independen tanpa foreign key, agar ketika perpustakaan mengubah kebijakan SOP, sistem tidak perlu memodifikasi ribuan baris record transaksi masa lalu.

---

### 📈 7. Activity Diagram (Alur Proses Bisnis Utama)

#### A. Alur Peminjaman Buku & Validasi Kuota Maksimal
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

#### B. Alur Pengembalian Buku & Perhitungan Denda Otomatis
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

---

### ⏱️ 8. Sequence Diagram (Interaksi Transaksi Digital Payment Gateway)

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

---

### 🧩 9. Class Diagram (Struktur Kelas & Model Sistem)

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

### 🔄 10. State Machine Diagram (Siklus Status Transaksi Sirkulasi)

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

### 🧭 11. Flowchart Sistem (Standar Operasional Prosedur / SOP Skripsi)

Bagian ini memuat diagram alir prosedural (*System Flowcharts*) standar penulisan skripsi teknik informatika dan sistem informasi untuk menggambarkan interaksi nyata antara pengguna, sistem web, dan basis data.

#### A. Flowchart 1: Sistem Berjalan (Konvensional) vs Sistem Usulan (Modern Web)
```mermaid
flowchart TD
    subgraph Flowchart_Sistem_Berjalan ["Sistem Berjalan (Konvensional / Delphi Manual)"]
        SB_Start(["Mulai"]) --> SB_1[/"Siswa Menyerahkan Kartu & Buku Fisik"/]
        SB_1 --> SB_2["Petugas Mencari Kartu Anggota di Rak Dokumen"]
        SB_2 --> SB_3["Petugas Menulis di Buku Besar Peminjaman"]
        SB_3 --> SB_4{"Apakah Terjadi Keterlambatan?"}
        SB_4 -- "Ya" --> SB_5["Petugas Menghitung Denda Manual dengan Kalkulator"]
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

#### B. Flowchart 2: Login & Autentikasi Pengguna Multi-Role (RBAC)
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

#### C. Flowchart 3: Transaksi Peminjaman Buku (Front-Desk & Portal Mandiri)
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

#### D. Flowchart 4: Transaksi Pengembalian Buku & Perhitungan Denda Otomatis
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

#### E. Flowchart 5: Pembayaran Digital Melalui Payment Gateway (QRIS & Virtual Account)
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

#### F. Flowchart 6: Perpanjangan Peminjaman Buku (+7 Hari & Biaya Administrasi)
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

#### G. Flowchart 7: Pelaporan Eksekutif, Filter Periode & Pengesahan Kepala Sekolah
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

### 👥 12. Matriks Hak Akses Peran (Role-Based Access Control / RBAC)

| Modul / Fitur | Kepala Perpustakaan (`admin`) | Petugas Sirkulasi (`petugas2`) | Kepala Sekolah (`kepsek`) | Siswa / Anggota (`nisn`) |
| :--- | :---: | :---: | :---: | :---: |
| **Login Khusus Portal** | Portal Petugas | Portal Petugas | Portal Petugas | Portal Siswa Mandiri |
| **Dashboard Utama** | Manajerial Penuh | Loket Antrean Sirkulasi | Eksekutif & KPI Mutu | Portal Pinjaman Siswa |
| **Katalog Buku & Rak** | CRUD Penuh (Tambah/Edit/Hapus) | Tambah & Edit Stok | Read-Only (Audit) | Katalog & Pinjam Buku |
| **Cetak Barcode & Label** | ✅ Tersedia | ✅ Tersedia | ✅ Tersedia | ❌ Tidak |
| **Layanan Peminjaman** | Monitoring & Input | Input Front-Desk Loket | Read-Only (Monitoring) | Pinjam Mandiri (Maks 2) |
| **Layanan Pengembalian** | Audit & Monitoring | Input Loket & Kwitansi | Read-Only (Audit Kas) | Riwayat Pengembalian |
| **Kalkulasi Denda Otomatis** | ✅ Dinamis via MySQL | ✅ Dinamis via MySQL | ✅ Pantau Total Denda | Info Keterlambatan Realtime |
| **Cetak Kwitansi Denda** | ✅ Tersedia | ✅ Tersedia | ✅ Pratinjau Audit | ❌ Tidak |
| **Payment Gateway QRIS & VA** | Pantau Mutasi Kas | Verifikasi Loket | Audit Finansial | Bayar Mandiri dari HP |
| **Pengesahan & Cetak Laporan** | ✅ TTD Kepala Perpus | Laporan Harian Loket | ✅ Pengesahan Resmi Kepsek | ❌ Tidak |
| **Cetak Kartu Perpus (KTA)** | ✅ Tersedia | ✅ Tersedia | ✅ Tersedia | ✅ Cetak KTA Mandiri |
| **Pengaturan Sistem & Staf** | ✅ Super Admin | ❌ Dibatasi (Terkunci) | ❌ Dibatasi (Terkunci) | ❌ Dibatasi |

---

### 🚀 13. Panduan Instalasi & Eksekusi Pengujian Sidang Skripsi

#### A. Persiapan Basis Data (MySQL / phpMyAdmin)
1. Buka XAMPP Control Panel dan pastikan modul **Apache** dan **MySQL** berstatus `Running`.
2. Impor file skrip database yang telah memuat seluruh relasi foreign key:
   ```powershell
   & "C:\xampp\mysql\bin\mysql.exe" -u root < "c:\semester 5\basis data lanjut\skripsi_perpus\backend\database\skripsi_perpus.sql"
   ```
3. Buka **phpMyAdmin** (`http://localhost/phpmyadmin`) $\rightarrow$ Pilih database `skripsi_perpus` $\rightarrow$ Klik tab **Desainer (Designer)** untuk memverifikasi garis relasi antar-tabel.

#### B. Menjalankan Backend RESTful API
```powershell
cd "c:\semester 5\basis data lanjut\skripsi_perpus\backend"
C:\xampp\php\php.exe -S 127.0.0.1:8000 -t public
```

#### C. Menjalankan Frontend React (Vite SPA)
```powershell
cd "c:\semester 5\basis data lanjut\skripsi_perpus\frontend"
npm run dev
```
Akses sistem di browser: **`http://localhost:3000`**

#### D. Kredensial Default Pengujian Sistem:
- **Kepala Perpustakaan**: Username `admin` | Password `admin123`
- **Petugas Sirkulasi**: Username `petugas2` | Password `petugas123`
- **Kepala Sekolah**: Username `kepsek` | Password `kepsek123`
- **Siswa / Anggota**: NISN `2024001` (Ahmad Fauzi) | Password `siswa123`


---

### 🧪 14. Matriks Pengujian Black Box Testing (Bab 4 Skripsi)

Pengujian fungsionalitas sistem menggunakan metode **Black Box Testing** dengan teknik *Equivalence Partitioning* dan *Boundary Value Analysis* untuk memastikan seluruh alur bisnis, aturan validasi basis data, dan integritas transaksi berjalan sesuai spesifikasi kebutuhan perangkat lunak:

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
