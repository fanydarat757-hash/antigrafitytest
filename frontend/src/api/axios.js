import axios from 'axios';

// Konfigurasi Axios Client
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
});

// Interceptor Request: Sisipkan Token jika tersedia
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('perpus_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// In-Memory Fallback Mock Data Store (Untuk preview langsung jika Laravel API belum running)
let mockBuku = [
  { kd_buku: 'BK001', judul_buku: 'Matematika Peminatan Kelas XI', pengarang: 'Sukino', penerbit: 'Erlangga', lokasi_rak: 'Rak A-01 (MIPA & Sains)', tahun_terbit: '2019', stok: 5 },
  { kd_buku: 'BK002', judul_buku: 'Fisika SMA/MA Kelas XII', pengarang: 'Marthen Kanginan', penerbit: 'Erlangga', lokasi_rak: 'Rak A-02 (MIPA & Sains)', tahun_terbit: '2020', stok: 4 },
  { kd_buku: 'BK003', judul_buku: 'Biologi Sel & Genetika', pengarang: 'Campbell & Reece', penerbit: 'Erlangga', lokasi_rak: 'Rak A-03 (MIPA & Sains)', tahun_terbit: '2018', stok: 3 },
  { kd_buku: 'BK004', judul_buku: 'Sejarah Kebudayaan Islam', pengarang: 'Badri Yatim', penerbit: 'Rajawali Pers', lokasi_rak: 'Rak B-01 (Sejarah & Agama)', tahun_terbit: '2017', stok: 6 },
  { kd_buku: 'BK005', judul_buku: 'Kemuhammadiyahan Kelas X', pengarang: 'Majelis Dikdasmen', penerbit: 'Suara Muhammadiyah', lokasi_rak: 'Rak B-02 (Kemuhammadiyahan)', tahun_terbit: '2021', stok: 8 },
  { kd_buku: 'BK006', judul_buku: 'Bahasa Indonesia Tingkat Lanjut', pengarang: 'E. Kosasih', penerbit: 'Yrama Widya', lokasi_rak: 'Rak C-01 (Bahasa & Sastra)', tahun_terbit: '2022', stok: 5 },
];

let mockPeminjaman = [
  {
    kd_peminjaman: 'PJ001',
    kd_buku: 'BK001',
    nama_anggota: 'Ahmad Fauzi (XI IPA 1)',
    tgl_peminjaman: '2026-10-25',
    tgl_jatuh_tempo: '2026-11-01',
    status: 'Terlambat',
    buku: { kd_buku: 'BK001', judul_buku: 'Matematika Peminatan Kelas XI' }
  },
  {
    kd_peminjaman: 'PJ002',
    kd_buku: 'BK002',
    nama_anggota: 'Siti Aisyah (XII IPA 2)',
    tgl_peminjaman: '2026-11-05',
    tgl_jatuh_tempo: '2026-11-12',
    status: 'Dipinjam',
    buku: { kd_buku: 'BK002', judul_buku: 'Fisika SMA/MA Kelas XII' }
  },
  {
    kd_peminjaman: 'PJ003',
    kd_buku: 'BK005',
    nama_anggota: 'Rizky Ramadhan (X IPS 1)',
    tgl_peminjaman: '2026-10-15',
    tgl_jatuh_tempo: '2026-10-22',
    status: 'Dikembalikan',
    buku: { kd_buku: 'BK005', judul_buku: 'Kemuhammadiyahan Kelas X' }
  }
];

let mockPengembalian = [
  {
    kd_pengembalian: 'KB001',
    kd_peminjaman: 'PJ003',
    tgl_pengembalian: '2026-10-23',
    keterangan: 'Terlambat 1 Hari (Buku Baik)',
    denda: 1000,
    peminjaman: {
      kd_peminjaman: 'PJ003',
      kd_buku: 'BK005',
      nama_anggota: 'Rizky Ramadhan (X IPS 1)',
      tgl_peminjaman: '2026-10-15',
      buku: { kd_buku: 'BK005', judul_buku: 'Kemuhammadiyahan Kelas X' }
    }
  }
];

export const api = {
  // --- AUTH & REGISTRASI ---
  async register(payload) {
    try {
      const res = await apiClient.post('/auth/register', payload);
      return res.data;
    } catch {
      // Fallback local registration
      return {
        status: 'success',
        message: 'Akun baru berhasil didaftarkan!',
        data: payload
      };
    }
  },

  async updateProfile(payload) {
    try {
      const res = await apiClient.post('/auth/update-profile', payload);
      return res.data;
    } catch {
      return {
        status: 'success',
        message: 'Profil berhasil diperbarui.',
        data: payload
      };
    }
  },

  // --- DASHBOARD ---
  async getDashboardStats() {
    try {
      const res = await apiClient.get('/dashboard/stats');
      return res.data;
    } catch {
      return {
        status: 'success',
        data: {
          total_buku: mockBuku.length,
          total_stok: mockBuku.reduce((acc, b) => acc + b.stok, 0),
          peminjaman_aktif: mockPeminjaman.filter(p => p.status !== 'Dikembalikan').length,
          pengembalian_hari_ini: mockPengembalian.length,
          total_denda: mockPengembalian.reduce((acc, k) => acc + Number(k.denda), 0),
          aktivitas_terbaru: mockPeminjaman.slice(0, 5),
        }
      };
    }
  },

  // --- BUKU ---
  async getBuku(search = '', page = 1) {
    try {
      const res = await apiClient.get(`/buku?search=${encodeURIComponent(search)}&page=${page}`);
      return res.data;
    } catch {
      let filtered = mockBuku.filter(b =>
        b.judul_buku.toLowerCase().includes(search.toLowerCase()) ||
        b.pengarang.toLowerCase().includes(search.toLowerCase()) ||
        b.kd_buku.toLowerCase().includes(search.toLowerCase())
      );
      return {
        status: 'success',
        data: {
          data: filtered,
          total: filtered.length,
          current_page: 1,
          last_page: 1,
          per_page: 10
        }
      };
    }
  },

  async getAllBuku() {
    try {
      const res = await apiClient.get('/buku/all');
      return res.data;
    } catch {
      return { status: 'success', data: mockBuku.filter(b => b.stok > 0) };
    }
  },

  async generateKodeBuku() {
    try {
      const res = await apiClient.get('/buku/generate-code');
      return res.data.next_code;
    } catch {
      const nextNum = mockBuku.length + 1;
      return `BK${String(nextNum).padStart(3, '0')}`;
    }
  },

  async createBuku(payload) {
    try {
      const res = await apiClient.post('/buku', payload);
      return res.data;
    } catch {
      mockBuku.push({ ...payload, stok: Number(payload.stok || 1) });
      return { status: 'success', message: 'Data buku berhasil ditambahkan.' };
    }
  },

  async updateBuku(kd_buku, payload) {
    try {
      const res = await apiClient.put(`/buku/${kd_buku}`, payload);
      return res.data;
    } catch {
      const idx = mockBuku.findIndex(b => b.kd_buku === kd_buku);
      if (idx !== -1) {
        mockBuku[idx] = { ...mockBuku[idx], ...payload, stok: Number(payload.stok) };
      }
      return { status: 'success', message: 'Data buku berhasil diperbarui.' };
    }
  },

  async deleteBuku(kd_buku) {
    try {
      const res = await apiClient.delete(`/buku/${kd_buku}`);
      return res.data;
    } catch {
      mockBuku = mockBuku.filter(b => b.kd_buku !== kd_buku);
      return { status: 'success', message: 'Data buku berhasil dihapus.' };
    }
  },

  // --- PEMINJAMAN ---
  async getPeminjaman(search = '', status = '', page = 1) {
    try {
      const res = await apiClient.get(`/peminjaman?search=${encodeURIComponent(search)}&status=${status}&page=${page}`);
      return res.data;
    } catch {
      let filtered = mockPeminjaman.filter(p => {
        const matchSearch = p.nama_anggota.toLowerCase().includes(search.toLowerCase()) ||
                            p.kd_peminjaman.toLowerCase().includes(search.toLowerCase()) ||
                            (p.buku && p.buku.judul_buku.toLowerCase().includes(search.toLowerCase()));
        const matchStatus = status ? p.status === status : true;
        return matchSearch && matchStatus;
      });
      return {
        status: 'success',
        data: {
          data: filtered,
          total: filtered.length,
          current_page: 1,
          last_page: 1,
        }
      };
    }
  },

  async getActivePeminjaman() {
    try {
      const res = await apiClient.get('/peminjaman/active');
      return res.data;
    } catch {
      const active = mockPeminjaman.filter(p => p.status !== 'Dikembalikan');
      return { status: 'success', data: active };
    }
  },

  async generateKodePeminjaman() {
    try {
      const res = await apiClient.get('/peminjaman/generate-code');
      return res.data.next_code;
    } catch {
      const nextNum = mockPeminjaman.length + 1;
      return `PJ${String(nextNum).padStart(3, '0')}`;
    }
  },

  async createPeminjaman(payload) {
    try {
      const res = await apiClient.post('/peminjaman', payload);
      return res.data;
    } catch {
      const buku = mockBuku.find(b => b.kd_buku === payload.kd_buku);
      if (buku) buku.stok = Math.max(0, buku.stok - 1);
      const newRecord = {
        kd_peminjaman: payload.kd_peminjaman,
        kd_buku: payload.kd_buku,
        nama_anggota: payload.nama_anggota,
        tgl_peminjaman: payload.tgl_peminjaman,
        tgl_jatuh_tempo: new Date(new Date(payload.tgl_peminjaman).getTime() + (payload.durasi_hari || 7) * 86400000).toISOString().split('T')[0],
        status: 'Dipinjam',
        buku: buku ? { kd_buku: buku.kd_buku, judul_buku: buku.judul_buku } : null
      };
      mockPeminjaman.unshift(newRecord);
      return { status: 'success', message: 'Transaksi peminjaman berhasil disimpan.' };
    }
  },

  async perpanjangPeminjaman(kd_peminjaman, extraPayload = {}) {
    try {
      const res = await apiClient.post(`/peminjaman/${kd_peminjaman}/perpanjang`, extraPayload);
      return res.data;
    } catch (err) {
      const p = mockPeminjaman.find(item => item.kd_peminjaman === kd_peminjaman);
      if (p) {
        const curDate = new Date(p.tgl_jatuh_tempo || p.tgl_peminjaman);
        p.tgl_jatuh_tempo = new Date(curDate.getTime() + 7 * 86400000).toISOString().split('T')[0];
        p.perpanjangan_count = (p.perpanjangan_count || 0) + 1;
        p.biaya_perpanjangan = extraPayload.biaya_perpanjangan || 2000;
        p.metode_bayar_perpanjang = extraPayload.metode_pembayaran || 'QRIS (lupayyy, Konter)';
        return { status: 'success', message: `Masa pinjam berhasil diperpanjang +7 hari sampai ${p.tgl_jatuh_tempo}` };
      }
      throw err;
    }
  },

  // --- PENGEMBALIAN & DENDA ---
  async getPengembalian(search = '', page = 1) {
    try {
      const res = await apiClient.get(`/pengembalian?search=${encodeURIComponent(search)}&page=${page}`);
      return res.data;
    } catch {
      let filtered = mockPengembalian.filter(k =>
        k.kd_pengembalian.toLowerCase().includes(search.toLowerCase()) ||
        k.peminjaman?.nama_anggota.toLowerCase().includes(search.toLowerCase())
      );
      return {
        status: 'success',
        data: {
          data: filtered,
          total: filtered.length,
          current_page: 1,
          last_page: 1,
        }
      };
    }
  },

  async generateKodePengembalian() {
    try {
      const res = await apiClient.get('/pengembalian/generate-code');
      return res.data.next_code;
    } catch {
      const nextNum = mockPengembalian.length + 1;
      return `KB${String(nextNum).padStart(3, '0')}`;
    }
  },

  async hitungDenda(kd_peminjaman, tgl_pengembalian) {
    try {
      const res = await apiClient.post('/pengembalian/kalkulasi-denda', { kd_peminjaman, tgl_pengembalian });
      return res.data;
    } catch {
      const p = mockPeminjaman.find(item => item.kd_peminjaman === kd_peminjaman);
      if (!p) throw new Error('Data tidak ditemukan');

      const returnDate = new Date(tgl_pengembalian);
      const dueDate = new Date(p.tgl_jatuh_tempo || p.tgl_peminjaman);
      const diffTime = returnDate - dueDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const overdueDays = Math.max(0, diffDays);
      const denda = overdueDays * 1000;

      return {
        status: 'success',
        data: {
          kd_peminjaman,
          nama_anggota: p.nama_anggota,
          judul_buku: p.buku?.judul_buku || '-',
          tgl_peminjaman: p.tgl_peminjaman,
          tgl_jatuh_tempo: p.tgl_jatuh_tempo,
          tgl_pengembalian,
          hari_terlambat: overdueDays,
          tarif_per_hari: 1000,
          denda: denda,
          keterangan_default: overdueDays > 0 ? `Terlambat ${overdueDays} Hari` : 'Tepat Waktu'
        }
      };
    }
  },

  async createPengembalian(payload) {
    try {
      const res = await apiClient.post('/pengembalian', payload);
      return res.data;
    } catch {
      const p = mockPeminjaman.find(item => item.kd_peminjaman === payload.kd_peminjaman);
      if (p) {
        p.status = 'Dikembalikan';
        const buku = mockBuku.find(b => b.kd_buku === p.kd_buku);
        if (buku) buku.stok += 1;
      }
      mockPengembalian.unshift({
        kd_pengembalian: payload.kd_pengembalian,
        kd_peminjaman: payload.kd_peminjaman,
        tgl_pengembalian: payload.tgl_pengembalian,
        keterangan: payload.keterangan || 'Dikembalikan',
        denda: payload.denda || 0,
        status_denda: payload.status_denda || 'Lunas',
        peminjaman: p ? { ...p } : null,
      });
      return { status: 'success', message: 'Buku berhasil dikembalikan dan stok diperbarui.' };
    }
  },

  async lunasiDenda(kd_pengembalian, extraPayload = {}) {
    try {
      const res = await apiClient.post(`/pengembalian/${kd_pengembalian}/bayar-denda`, extraPayload);
      return res.data;
    } catch (err) {
      const k = mockPengembalian.find(item => item.kd_pengembalian === kd_pengembalian);
      if (k) {
        k.status_denda = 'Lunas';
        k.metode_pembayaran = extraPayload.metode_pembayaran || 'QRIS Digital';
        k.id_transaksi_gateway = extraPayload.id_transaksi_gateway || 'GW-' + Date.now();
        return { status: 'success', message: `Denda ${kd_pengembalian} berhasil dilunasi via payment gateway!` };
      }
      throw err;
    }
  },

  // --- PAYMENT GATEWAY API (QRIS & VIRTUAL ACCOUNT) ---
  async createPaymentInvoice(payload) {
    try {
      const res = await apiClient.post('/payment-gateway/create-invoice', payload);
      return res.data;
    } catch {
      const orderId = 'PAY-DND-' + Date.now().toString().slice(-6);
      return {
        status: 'success',
        data: {
          order_id: orderId,
          merchant_name: 'Perpustakaan SMA Muhammadiyah 1 Pekalongan',
          nama_siswa: payload.nama_siswa || 'Siswa Perpustakaan',
          nominal: payload.nominal_denda || 1000,
          total_bayar: payload.nominal_denda || 1000,
          metode: payload.metode || 'QRIS',
          va_number: '82710' + Math.floor(10000000 + Math.random() * 90000000),
          status: 'PENDING',
          expired_at: new Date(Date.now() + 15 * 60000).toISOString()
        }
      };
    }
  },

  async simulatePaymentCallback(payload) {
    try {
      const res = await apiClient.post('/payment-gateway/callback-simulation', payload);
      return res.data;
    } catch {
      const k = mockPengembalian.find(item => item.kd_pengembalian === payload.kd_pengembalian);
      if (k) {
        k.status_denda = 'Lunas';
        k.metode_pembayaran = payload.metode || 'QRIS Digital (Midtrans)';
        k.id_transaksi_gateway = payload.order_id;
      }
      return {
        status: 'success',
        message: 'Pembayaran via Payment Gateway berhasil diverifikasi dan status otomatis lunas!',
        data: payload
      };
    }
  },

  // --- PENGATURAN SISTEM & SOP SIRKULASI ---
  async getPengaturan() {
    try {
      const res = await apiClient.get('/pengaturan');
      if (res.data?.data) {
        if (res.data.data.tarif_denda) localStorage.setItem('perpus_tarif_denda', res.data.data.tarif_denda);
        if (res.data.data.durasi_pinjam) localStorage.setItem('perpus_durasi_pinjam', res.data.data.durasi_pinjam);
      }
      return res.data;
    } catch {
      const savedTarif = localStorage.getItem('perpus_tarif_denda');
      const savedDurasi = localStorage.getItem('perpus_durasi_pinjam');
      return {
        status: 'success',
        data: {
          tarif_denda: savedTarif ? Number(savedTarif) : 1000,
          durasi_pinjam: savedDurasi ? Number(savedDurasi) : 7,
          qris_merchant: 'lupayyy, Konter',
          qris_nmid: 'ID1026632009753'
        }
      };
    }
  },

  async updatePengaturan(payload) {
    try {
      const res = await apiClient.post('/pengaturan', payload);
      if (payload.tarif_denda !== undefined) localStorage.setItem('perpus_tarif_denda', payload.tarif_denda);
      if (payload.durasi_pinjam !== undefined) localStorage.setItem('perpus_durasi_pinjam', payload.durasi_pinjam);
      return res.data;
    } catch {
      if (payload.tarif_denda !== undefined) localStorage.setItem('perpus_tarif_denda', payload.tarif_denda);
      if (payload.durasi_pinjam !== undefined) localStorage.setItem('perpus_durasi_pinjam', payload.durasi_pinjam);
      return {
        status: 'success',
        message: 'Pengaturan berhasil diperbarui!',
        data: payload
      };
    }
  },

  // --- LAPORAN ---
  async getLaporanBuku() {
    try {
      const res = await apiClient.get('/laporan/buku');
      return res.data;
    } catch {
      return {
        status: 'success',
        metadata: {
          instansi: 'SMA Muhammadiyah Pekalongan',
          kabupaten: 'Lampung Timur',
          alamat: 'Jl. Raya Pekalongan, Kec. Pekalongan, Kab. Lampung Timur, Prov. Lampung',
          kepala_sekolah: 'Ahmad Marzuki, S.Pd.I',
          petugas_perpus: 'Siti Farida, A.Md',
          tgl_cetak: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        },
        total_judul: mockBuku.length,
        total_eksemplar: mockBuku.reduce((acc, b) => acc + b.stok, 0),
        data: mockBuku
      };
    }
  },

  async getLaporanPeminjaman(startDate = '', endDate = '', status = '') {
    try {
      const res = await apiClient.get(`/laporan/peminjaman?start_date=${startDate}&end_date=${endDate}&status=${status}`);
      return res.data;
    } catch {
      let filtered = [...mockPeminjaman];
      if (status && status !== 'Semua') {
        filtered = filtered.filter(p => p.status === status);
      }
      return {
        status: 'success',
        metadata: {
          instansi: 'SMA Muhammadiyah Pekalongan',
          kabupaten: 'Lampung Timur',
          alamat: 'Jl. Raya Pekalongan, Kec. Pekalongan, Kab. Lampung Timur, Prov. Lampung',
          kepala_sekolah: 'Ahmad Marzuki, S.Pd.I',
          petugas_perpus: 'Siti Farida, A.Md',
          tgl_cetak: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        },
        total_transaksi: filtered.length,
        data: filtered
      };
    }
  },

  async getLaporanPengembalian(startDate = '', endDate = '') {
    try {
      const res = await apiClient.get(`/laporan/pengembalian?start_date=${startDate}&end_date=${endDate}`);
      return res.data;
    } catch {
      return {
        status: 'success',
        metadata: {
          instansi: 'SMA Muhammadiyah Pekalongan',
          kabupaten: 'Lampung Timur',
          alamat: 'Jl. Raya Pekalongan, Kec. Pekalongan, Kab. Lampung Timur, Prov. Lampung',
          kepala_sekolah: 'Ahmad Marzuki, S.Pd.I',
          petugas_perpus: 'Siti Farida, A.Md',
          tgl_cetak: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        },
        total_transaksi: mockPengembalian.length,
        total_denda: mockPengembalian.reduce((acc, k) => acc + Number(k.denda), 0),
        data: mockPengembalian
      };
    }
  }
};

export function formatDateIndo(dateStr) {
  if (!dateStr) return '-';
  try {
    const parts = String(dateStr).split('T')[0].split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

export default apiClient;
