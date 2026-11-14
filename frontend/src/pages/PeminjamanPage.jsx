import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, 
  Plus, 
  Search, 
  RefreshCw, 
  Sparkles, 
  Calendar, 
  UserCheck,
  Book,
  CheckCircle2,
  AlertCircle,
  MessageCircle
} from 'lucide-react';
import Modal from '../components/Modal';
import PaymentGatewayModal from '../components/PaymentGatewayModal';
import { TableRowSkeleton } from '../components/Skeleton';
import { api, formatDateIndo } from '../api/axios';

export default function PeminjamanPage({ showNotification, onNavigateToReturn, user }) {
  const roleCode = user?.roleCode || (user?.username === 'admin' ? 'kepala_perpus' : user?.username === 'kepsek' ? 'kepala_sekolah' : 'petugas_sirkulasi');
  const [list, setList] = useState([]);
  const [bukuOptions, setBukuOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [extendingCode, setExtendingCode] = useState(null);
  const [gatewayData, setGatewayData] = useState(null);
  const [extensionFee, setExtensionFee] = useState(2000);

  useEffect(() => {
    api.getPengaturan().then(res => {
      if (res?.data?.biaya_perpanjangan !== undefined) {
        setExtensionFee(Number(res.data.biaya_perpanjangan));
      }
    }).catch(() => {});
  }, []);

  const handleExtendLoan = async (item) => {
    if (extensionFee > 0) {
      setGatewayData({
        ...item,
        denda: extensionFee,
        nama_siswa: item.nama_anggota,
        isPerpanjang: true,
        judul_transaksi: 'Biaya Administrasi Perpanjang Pinjaman (+7 Hari)',
        label_nominal: 'Biaya Layanan Perpanjangan'
      });
      return;
    }

    setExtendingCode(item.kd_peminjaman);
    try {
      const res = await api.perpanjangPeminjaman(item.kd_peminjaman);
      showNotification(res.message || 'Masa pinjam berhasil diperpanjang +7 hari!', 'success');
      fetchData();
    } catch (err) {
      showNotification('Gagal memperpanjang: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setExtendingCode(null);
    }
  };

  const getDaysUntilDue = (tempoStr) => {
    if (!tempoStr) return 999;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tempo = new Date(tempoStr);
    tempo.setHours(0, 0, 0, 0);
    return Math.ceil((tempo - today) / (1000 * 60 * 60 * 24));
  };

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    kd_peminjaman: '',
    kd_buku: '',
    nama_anggota: '',
    tgl_peminjaman: new Date().toISOString().split('T')[0],
    durasi_hari: 7,
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.getPeminjaman(search, statusFilter);
      if (res && res.data) {
        setList(res.data.data || []);
      }
    } catch (err) {
      showNotification('Gagal memuat data peminjaman: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadBukuOptions = async () => {
    try {
      const res = await api.getAllBuku();
      setBukuOptions(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, statusFilter]);

  const handleOpenAdd = async () => {
    await loadBukuOptions();
    try {
      const nextCode = await api.generateKodePeminjaman();
      setFormData({
        kd_peminjaman: nextCode,
        kd_buku: bukuOptions[0]?.kd_buku || '',
        nama_anggota: '',
        tgl_peminjaman: new Date().toISOString().split('T')[0],
        durasi_hari: 7,
      });
    } catch {
      setFormData({
        kd_peminjaman: 'PJ' + Math.floor(100 + Math.random() * 900),
        kd_buku: '',
        nama_anggota: '',
        tgl_peminjaman: new Date().toISOString().split('T')[0],
        durasi_hari: 7,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.kd_buku) {
      showNotification('Pilih buku yang hendak dipinjam terlebih dahulu.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await api.createPeminjaman(formData);
      showNotification('Transaksi peminjaman berhasil disimpan dan stok buku telah dikurangi!', 'success');
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      showNotification('Gagal mencatat peminjaman: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendWaReminder = (item) => {
    const judul = item.buku?.judul_buku || item.kd_buku || 'buku perpustakaan';
    const text = `Halo *${item.nama_anggota}*,\nKami dari Perpustakaan SMA Muhammadiyah 1 Pekalongan mengingatkan bahwa masa peminjaman buku *${judul}* (Kode Pinjam: ${item.kd_peminjaman}) telah jatuh tempo pada ${formatDateIndo(item.tgl_jatuh_tempo)}.\n\nMohon segera mengembalikan buku ke loket perpustakaan untuk mencegah akumulasi denda. Terima kasih.`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const computedJatuhTempo = () => {
    if (!formData.tgl_peminjaman) return '-';
    const date = new Date(formData.tgl_peminjaman);
    date.setDate(date.getDate() + parseInt(formData.durasi_hari || 7));
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="space-y-6">
      {/* Banner Khusus Mode Supervisi Kepala Sekolah */}
      {roleCode === 'kepala_sekolah' && (
        <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900 flex items-center space-x-3 text-xs font-semibold">
          <span className="p-2 rounded-xl bg-purple-100 text-purple-700 font-bold">🏛️ Pengawasan</span>
          <div>
            <p className="font-extrabold text-sm">Mode Supervisi Sirkulasi Siswa (Read-Only)</p>
            <p className="text-purple-700">Sebagai Kepala Sekolah, Anda memantau keaktifan siswa meminjam buku dan kepatuhan pengembalian.</p>
          </div>
        </div>
      )}

      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
            <ArrowUpRight className="w-5 h-5 text-amber-500" />
            <span>{roleCode === 'petugas_sirkulasi' ? 'Loket Pelayanan Peminjaman Siswa' : 'Sirkulasi: Transaksi Peminjaman Buku'}</span>
          </h2>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Pencatatan sirkulasi peminjaman siswa SMA Muhammadiyah Pekalongan
          </p>
        </div>

        {roleCode !== 'kepala_sekolah' && (
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all self-start sm:self-auto focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <Plus className="w-4 h-4" />
            <span>+ Transaksi Pinjam Baru</span>
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
        {/* Search Input */}
        <div className="relative w-full md:max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Cari transaksi peminjaman"
            placeholder="Cari kode, siswa, judul buku..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-600 transition-all text-slate-900 font-medium"
          />
        </div>

        {/* Status Filter Badges */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
          {[
            { label: 'Semua Status', value: '' },
            { label: 'Sedang Dipinjam', value: 'Dipinjam' },
            { label: 'Terlambat', value: 'Terlambat' },
            { label: 'Dikembalikan', value: 'Dikembalikan' },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setStatusFilter(item.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === item.value
                  ? 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-900'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
          
          <button
            onClick={fetchData}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-300 transition-colors ml-auto md:ml-2 focus-visible:ring-2 focus-visible:ring-emerald-500"
            title="Segarkan Data"
            aria-label="Segarkan Data Peminjaman"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Tabel Data Peminjaman dengan Skeleton Screen */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Kode Pinjam</th>
                <th className="py-3.5 px-4">Nama Siswa / Anggota</th>
                <th className="py-3.5 px-4">Buku Yang Dipinjam</th>
                <th className="py-3.5 px-4">Tgl Pinjam</th>
                <th className="py-3.5 px-4">Jatuh Tempo</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <>
                  <TableRowSkeleton columns={7} />
                  <TableRowSkeleton columns={7} />
                  <TableRowSkeleton columns={7} />
                  <TableRowSkeleton columns={7} />
                </>
              ) : list.length > 0 ? (
                list.map((item) => (
                  <tr key={item.kd_peminjaman} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <span className="px-2.5 py-1 bg-slate-100 rounded-md font-mono text-[11px] border border-slate-300 text-slate-800">
                        {item.kd_peminjaman}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-900 font-bold">
                      {item.nama_anggota}
                    </td>
                    <td className="py-3.5 px-4 text-slate-800">
                      <div className="font-bold">{item.buku?.judul_buku || 'Data Buku'}</div>
                      <div className="text-[11px] text-slate-500 font-mono">Kode: {item.kd_buku}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">{formatDateIndo(item.tgl_peminjaman)}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      <div>{formatDateIndo(item.tgl_jatuh_tempo)}</div>
                      {(item.perpanjangan_count || 0) > 0 && (
                        <span className="text-[10px] text-blue-600 font-semibold">(Diperpanjang 1x)</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {item.status === 'Dikembalikan' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Dikembalikan
                        </span>
                      )}
                      {item.status === 'Dipinjam' && (() => {
                        const daysLeft = getDaysUntilDue(item.tgl_jatuh_tempo);
                        if (daysLeft === 0) {
                          return (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 text-orange-900 border border-orange-300 animate-pulse">
                              🚨 Jatuh Tempo Hari Ini
                            </span>
                          );
                        } else if (daysLeft > 0 && daysLeft <= 2) {
                          return (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                              ⏳ H-{daysLeft} Jatuh Tempo
                            </span>
                          );
                        }
                        return (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-900 border border-blue-200">
                            Dipinjam
                          </span>
                        );
                      })()}
                      {item.status === 'Terlambat' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-900 border border-rose-200 animate-pulse">
                          Terlambat
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                      {roleCode === 'kepala_sekolah' ? (
                        <span className="text-slate-500 font-mono text-[10px] font-bold">
                          {item.status === 'Dikembalikan' ? 'Selesai' : 'Aktif Dipantau'}
                        </span>
                      ) : item.status !== 'Dikembalikan' ? (
                        <>
                          {/* Tombol Perpanjang +7 Hari (Jika belum terlambat dan belum pernah diperpanjang) */}
                          {item.status === 'Dipinjam' && (item.perpanjangan_count || 0) < 1 && (
                            <button
                              onClick={() => handleExtendLoan(item)}
                              disabled={extendingCode === item.kd_peminjaman}
                              title={extensionFee > 0 ? `Perpanjang batas waktu pinjam +7 hari (Biaya: Rp ${extensionFee.toLocaleString('id-ID')})` : 'Perpanjang batas waktu pinjam +7 hari'}
                              className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300 rounded-lg text-xs font-bold transition-colors focus-visible:ring-2 focus-visible:ring-blue-500"
                            >
                              {extendingCode === item.kd_peminjaman 
                                ? '...' 
                                : extensionFee > 0 
                                  ? `+7 Hari (Rp ${extensionFee.toLocaleString('id-ID')})` 
                                  : '+7 Hari'}
                            </button>
                          )}
                          {/* Tombol Pengingat WhatsApp (Khusus Terlambat / H-1) */}
                          {(item.status === 'Terlambat' || getDaysUntilDue(item.tgl_jatuh_tempo) <= 1) && (
                            <button
                              onClick={() => handleSendWaReminder(item)}
                              title="Kirim pesan notifikasi pengingat jatuh tempo via WhatsApp"
                              className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold inline-flex items-center space-x-1 transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Ingatkan WA</span>
                            </button>
                          )}
                          <button
                            onClick={() => onNavigateToReturn && onNavigateToReturn(item.kd_peminjaman)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500"
                          >
                            Proses Kembali
                          </button>
                        </>
                      ) : (
                        <span className="text-slate-400 text-xs font-medium italic">Selesai</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-slate-500 font-medium">
                    Tidak ada data transaksi peminjaman.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form Tambah Peminjaman */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Formulir Transaksi Peminjaman Buku"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-800 mb-1">Kode Peminjaman (Primary Key)</label>
            <div className="relative">
              <input
                type="text"
                disabled
                value={formData.kd_peminjaman}
                className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-xl font-mono font-bold text-slate-800"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-emerald-700 font-bold flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>Auto-Generated</span>
              </span>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">Nama Siswa / Anggota</label>
            <div className="relative">
              <UserCheck className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              <input
                type="text"
                value={formData.nama_anggota}
                onChange={(e) => setFormData({ ...formData, nama_anggota: e.target.value })}
                placeholder="Contoh: Ahmad Fauzi (Kelas XI IPA 1)"
                required
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-600 text-slate-900 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">Pilih Buku Dari Katalog</label>
            <div className="relative">
              <Book className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              <select
                value={formData.kd_buku}
                onChange={(e) => setFormData({ ...formData, kd_buku: e.target.value })}
                required
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-600 text-slate-900 font-medium"
              >
                <option value="">-- Pilih Buku Tersedia --</option>
                {bukuOptions.map((b) => (
                  <option key={b.kd_buku} value={b.kd_buku}>
                    [{b.kd_buku}] {b.judul_buku} (Sisa Stok: {b.stok})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-800 mb-1">Tanggal Peminjaman</label>
              <input
                type="date"
                value={formData.tgl_peminjaman}
                onChange={(e) => setFormData({ ...formData, tgl_peminjaman: e.target.value })}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-600 text-slate-900 font-medium font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-800 mb-1">Durasi Pinjam (Hari)</label>
              <input
                type="number"
                min={1}
                max={30}
                value={formData.durasi_hari}
                onChange={(e) => setFormData({ ...formData, durasi_hari: parseInt(e.target.value) || 7 })}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-600 text-slate-900 font-bold font-mono"
              />
            </div>
          </div>

          {/* Info Card Jatuh Tempo */}
          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
            <span className="text-slate-800 font-bold">Batas Waktu Pengembalian:</span>
            <span className="font-extrabold text-emerald-800 font-mono text-xs">{computedJatuhTempo()}</span>
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100 mt-5">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-600/25 disabled:opacity-50"
            >
              {submitting ? 'Memproses...' : 'Simpan Transaksi Pinjam'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Payment Gateway untuk Pembayaran Biaya Perpanjangan Pinjaman */}
      <PaymentGatewayModal
        isOpen={Boolean(gatewayData)}
        onClose={() => setGatewayData(null)}
        data={gatewayData}
        onSuccess={async (result) => {
          try {
            const res = await api.perpanjangPeminjaman(gatewayData.kd_peminjaman, {
              biaya_perpanjangan: result.nominal,
              metode_pembayaran: result.metode_pembayaran,
              id_transaksi: result.order_id
            });
            showNotification(res.message || 'Masa pinjam berhasil diperpanjang +7 hari!', 'success');
            fetchData();
          } catch (err) {
            showNotification('Gagal memperpanjang: ' + (err.response?.data?.message || err.message), 'error');
          }
        }}
      />
    </div>
  );
}
