import React, { useState, useEffect } from 'react';
import { 
  ArrowDownLeft, 
  Plus, 
  Search, 
  RefreshCw, 
  Coins, 
  Sparkles, 
  Calendar, 
  AlertCircle,
  CheckCircle2,
  Receipt,
  CreditCard,
  QrCode,
  Settings,
  Edit3
} from 'lucide-react';
import Modal from '../components/Modal';
import KwitansiDendaModal from '../components/KwitansiDendaModal';
import PaymentGatewayModal from '../components/PaymentGatewayModal';
import { TableRowSkeleton } from '../components/Skeleton';
import { api, formatDateIndo } from '../api/axios';

export default function PengembalianPage({ showNotification, initialLoanCode = null, user }) {
  const roleCode = user?.roleCode || (user?.username === 'admin' ? 'kepala_perpus' : user?.username === 'kepsek' ? 'kepala_sekolah' : 'petugas_sirkulasi');
  const [list, setList] = useState([]);
  const [activeLoans, setActiveLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Active Settings State
  const [settings, setSettings] = useState({
    tarif_denda: 1000,
    durasi_pinjam: 7,
    durasi_perpanjangan: 7,
    biaya_perpanjangan: 2000
  });

  // Modal Tambah Pengembalian State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [gatewayData, setGatewayData] = useState(null);
  const [formData, setFormData] = useState({
    kd_pengembalian: '',
    kd_peminjaman: '',
    tgl_pengembalian: new Date().toISOString().split('T')[0],
    keterangan: 'Buku Dikembalikan dalam Kondisi Baik',
    denda: 0,
    status_denda: 'Lunas',
    metode_pembayaran: 'Tunai Loket',
  });
  const [dendaPreview, setDendaPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Modal Edit Denda Transaksi Yang Ada State
  const [isEditDendaModalOpen, setIsEditDendaModalOpen] = useState(false);
  const [selectedReturnForEdit, setSelectedReturnForEdit] = useState(null);
  const [editDendaForm, setEditDendaForm] = useState({
    denda: 0,
    status_denda: 'Lunas',
    keterangan: ''
  });
  const [submittingEditDenda, setSubmittingEditDenda] = useState(false);

  // Modal Edit Tarif Denda Cepat State
  const [isTarifModalOpen, setIsTarifModalOpen] = useState(false);
  const [tempTarif, setTempTarif] = useState(1000);
  const [submittingTarif, setSubmittingTarif] = useState(false);

  const loadSettings = async () => {
    try {
      const res = await api.getPengaturan();
      if (res?.data) {
        setSettings({
          tarif_denda: Number(res.data.tarif_denda ?? 1000),
          durasi_pinjam: Number(res.data.durasi_pinjam ?? 7),
          durasi_perpanjangan: Number(res.data.durasi_perpanjangan ?? 7),
          biaya_perpanjangan: Number(res.data.biaya_perpanjangan ?? 2000)
        });
        setTempTarif(Number(res.data.tarif_denda ?? 1000));
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.getPengembalian(search);
      if (res && res.data) {
        setList(res.data.data || []);
      }
    } catch (err) {
      showNotification('Gagal memuat data pengembalian: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadActiveLoans = async () => {
    try {
      const res = await api.getActivePeminjaman();
      setActiveLoans(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  const handleOpenAdd = async (loanCode = null) => {
    await loadActiveLoans();
    try {
      const nextCode = await api.generateKodePengembalian();
      const selectedLoan = loanCode || (activeLoans[0]?.kd_peminjaman || '');
      setFormData({
        kd_pengembalian: nextCode,
        kd_peminjaman: selectedLoan,
        tgl_pengembalian: new Date().toISOString().split('T')[0],
        keterangan: 'Buku Dikembalikan dalam Kondisi Baik',
        denda: 0,
        status_denda: 'Lunas',
        metode_pembayaran: 'Tunai Loket',
      });

      if (selectedLoan) {
        calcDenda(selectedLoan, new Date().toISOString().split('T')[0]);
      }
    } catch {
      setFormData({
        kd_pengembalian: 'KB' + Math.floor(100 + Math.random() * 900),
        kd_peminjaman: loanCode || '',
        tgl_pengembalian: new Date().toISOString().split('T')[0],
        keterangan: 'Buku Dikembalikan',
        denda: 0,
        status_denda: 'Lunas',
        metode_pembayaran: 'Tunai Loket',
      });
    }
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (initialLoanCode) {
      handleOpenAdd(initialLoanCode);
    }
  }, [initialLoanCode]);

  const calcDenda = async (loanCode, returnDate) => {
    if (!loanCode || !returnDate) return;
    try {
      const res = await api.hitungDenda(loanCode, returnDate);
      if (res && res.data) {
        setDendaPreview(res.data);
        const nominal = Number(res.data.denda ?? 0);
        setFormData(prev => ({
          ...prev,
          denda: nominal,
          status_denda: nominal > 0 ? 'Lunas' : 'Tanpa Denda',
          keterangan: res.data.keterangan_default
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLoanChange = (e) => {
    const loanCode = e.target.value;
    setFormData(prev => ({ ...prev, kd_peminjaman: loanCode }));
    calcDenda(loanCode, formData.tgl_pengembalian);
  };

  const handleReturnDateChange = (e) => {
    const date = e.target.value;
    setFormData(prev => ({ ...prev, tgl_pengembalian: date }));
    calcDenda(formData.kd_peminjaman, date);
  };

  const handleBayarDenda = async (item) => {
    if (!window.confirm(`Konfirmasi penerimaan pembayaran denda sebesar ${formatRupiah(item.denda)} untuk ${item.peminjaman?.nama_anggota || item.kd_peminjaman}?`)) {
      return;
    }
    try {
      const res = await api.lunasiDenda(item.kd_pengembalian);
      showNotification(res.message || 'Denda berhasil dilunasi!', 'success');
      setReceiptData({ ...item, status_denda: 'Lunas' });
      fetchData();
    } catch (err) {
      showNotification('Gagal melunasi denda: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  // --- HANDLER MODAL EDIT DENDA PADA REKAMAN TRANSAKSI YANG ADA ---
  const handleOpenEditDenda = (item) => {
    setSelectedReturnForEdit(item);
    setEditDendaForm({
      denda: Number(item.denda ?? 0),
      status_denda: item.status_denda || 'Lunas',
      keterangan: item.keterangan || ''
    });
    setIsEditDendaModalOpen(true);
  };

  const handleSubmitEditDenda = async (e) => {
    e.preventDefault();
    if (!selectedReturnForEdit) return;
    setSubmittingEditDenda(true);
    try {
      const res = await api.editDendaPengembalian(selectedReturnForEdit.kd_pengembalian, {
        denda: Number(editDendaForm.denda),
        status_denda: editDendaForm.status_denda,
        keterangan: editDendaForm.keterangan
      });
      showNotification(res.message || 'Besaran denda berhasil diperbarui!', 'success');
      setIsEditDendaModalOpen(false);
      fetchData();
    } catch (err) {
      showNotification('Gagal memperbarui denda: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setSubmittingEditDenda(false);
    }
  };

  // --- HANDLER MODAL CEPAT ATUR TARIF DENDA GLOBAL ---
  const handleSaveTarifGlobal = async (e) => {
    e.preventDefault();
    setSubmittingTarif(true);
    try {
      await api.updatePengaturan({
        ...settings,
        tarif_denda: Number(tempTarif)
      });
      setSettings(prev => ({ ...prev, tarif_denda: Number(tempTarif) }));
      showNotification(`Besaran tarif denda global berhasil diubah menjadi Rp ${Number(tempTarif).toLocaleString('id-ID')} / hari!`, 'success');
      setIsTarifModalOpen(false);
      if (formData.kd_peminjaman) {
        calcDenda(formData.kd_peminjaman, formData.tgl_pengembalian);
      }
    } catch (err) {
      showNotification('Gagal menyimpan tarif: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setSubmittingTarif(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.kd_peminjaman) {
      showNotification('Pilih transaksi peminjaman yang akan dikembalikan.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await api.createPengembalian(formData);
      showNotification('Pengembalian buku berhasil diproses dan stok telah diperbarui!', 'success');
      setIsModalOpen(false);

      if (formData.metode_pembayaran?.includes('Payment Gateway') || formData.metode_pembayaran?.includes('QRIS')) {
        const selectedLoan = activeLoans.find(l => l.kd_peminjaman === formData.kd_peminjaman);
        setGatewayData({
          ...formData,
          denda: formData.denda,
          nama_siswa: selectedLoan?.nama_anggota || 'Siswa'
        });
      }

      fetchData();
    } catch (err) {
      showNotification('Gagal memproses pengembalian: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num || 0);
  };

  return (
    <div className="space-y-6">
      {/* Banner Khusus Mode Supervisi Kepala Sekolah */}
      {roleCode === 'kepala_sekolah' && (
        <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900 flex items-center space-x-3 text-xs font-semibold">
          <span className="p-2 rounded-xl bg-purple-100 text-purple-700 font-bold">🏛️ Pengawasan</span>
          <div>
            <p className="font-extrabold text-sm">Mode Audit Kas Denda & Pengembalian (Read-Only)</p>
            <p className="text-purple-700">Sebagai Kepala Sekolah, Anda dapat memantau rekonsiliasi denda keterlambatan dan mencetak kwitansi audit.</p>
          </div>
        </div>
      )}

      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
            <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
            <span>{roleCode === 'petugas_sirkulasi' ? 'Loket Penerimaan Kembali Buku & Denda' : 'Sirkulasi: Transaksi Pengembalian & Denda'}</span>
          </h2>
          <div className="flex items-center space-x-3 mt-1 text-xs text-slate-600 font-medium flex-wrap">
            <span>Pencatatan pengembalian buku dan kalkulasi denda otomatis</span>
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 font-mono text-[11px] font-bold border border-amber-200">
              <Coins className="w-3 h-3 text-amber-600" />
              <span>Tarif Denda Aktif: Rp {settings.tarif_denda.toLocaleString('id-ID')} / hari / buku</span>
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto flex-wrap gap-y-2">
          {/* Tombol Cepat: Atur Tarif Denda Global */}
          <button
            onClick={() => { setTempTarif(settings.tarif_denda); setIsTarifModalOpen(true); }}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold border border-slate-300 transition-all shadow-xs"
            title="Ubah besaran tarif denda harian perpustakaan"
          >
            <Settings className="w-3.5 h-3.5 text-slate-700" />
            <span>⚙️ Edit Tarif Denda</span>
          </button>

          {roleCode !== 'kepala_sekolah' && (
            <button
              onClick={() => handleOpenAdd()}
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <Plus className="w-4 h-4" />
              <span>+ Catat Pengembalian Buku</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Cari catatan pengembalian"
            placeholder="Cari berdasarkan kode pengembalian, siswa, atau peminjaman..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-600 transition-all text-slate-900 font-medium"
          />
        </div>

        <button
          onClick={fetchData}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-300 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500"
          title="Segarkan Data"
          aria-label="Segarkan Data Pengembalian"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
        </button>
      </div>

      {/* Tabel Data Pengembalian dengan Skeleton Screen */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Kode Kembali</th>
                <th className="py-3.5 px-4">Kode Pinjam</th>
                <th className="py-3.5 px-4">Nama Siswa</th>
                <th className="py-3.5 px-4">Buku Dikembalikan</th>
                <th className="py-3.5 px-4">Tgl Kembali</th>
                <th className="py-3.5 px-4">Denda</th>
                <th className="py-3.5 px-4 text-right">Aksi & Kwitansi</th>
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
                  <tr key={item.kd_pengembalian} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-md font-mono text-[11px] border border-emerald-300">
                        {item.kd_pengembalian}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      {item.kd_peminjaman}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {item.peminjaman?.nama_anggota || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-800 font-semibold max-w-xs truncate">
                      <div>{item.peminjaman?.buku?.judul_buku || '-'}</div>
                      {item.peminjaman?.buku?.lokasi_rak && (
                        <div className="text-[10px] text-slate-500 font-mono">📍 {item.peminjaman.buku.lokasi_rak}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">{formatDateIndo(item.tgl_pengembalian)}</td>
                    <td className="py-3.5 px-4">
                      {Number(item.denda) > 0 ? (
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="font-bold text-rose-700 font-mono bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                              {formatRupiah(item.denda)}
                            </span>
                            {/* Tombol Edit Denda pada Baris Transaksi */}
                            {roleCode !== 'kepala_sekolah' && (
                              <button
                                onClick={() => handleOpenEditDenda(item)}
                                title="Edit besaran denda transaksi ini"
                                className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800 transition-colors"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                              </button>
                            )}
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-1">
                            <span className={`inline-flex px-1.5 py-0.2 rounded text-[9px] font-bold ${
                              item.status_denda === 'Tertunggak'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            }`}>
                              {item.status_denda === 'Tertunggak' ? '⚠ Tertunggak' : '✓ Lunas'}
                            </span>
                            {item.metode_pembayaran && (
                              <span className="inline-flex px-1.5 py-0.2 rounded text-[9px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                                {item.metode_pembayaran.includes('QRIS') ? '📱 QRIS' : item.metode_pembayaran.includes('VA') || item.metode_pembayaran.includes('Virtual') ? '🏦 VA' : '💵 Tunai'}
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1.5">
                          <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Rp 0 (Tepat Waktu)
                          </span>
                          {roleCode !== 'kepala_sekolah' && (
                            <button
                              onClick={() => handleOpenEditDenda(item)}
                              title="Tambah denda manual (misal: denda kerusakan)"
                              className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700 transition-colors"
                            >
                              <Edit3 className="w-3 h-3 text-slate-500" />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {Number(item.denda) > 0 ? (
                        <div className="flex items-center justify-end space-x-1.5">
                          {roleCode !== 'kepala_sekolah' && item.status_denda === 'Tertunggak' && (
                            <>
                              <button
                                onClick={() => setGatewayData(item)}
                                className="inline-flex items-center space-x-1 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
                                title="Bayar via QRIS / Virtual Account Payment Gateway"
                              >
                                <CreditCard className="w-3.5 h-3.5" />
                                <span>Gateway</span>
                              </button>
                              <button
                                onClick={() => handleBayarDenda(item)}
                                className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
                                title="Terima Tunai di Loket"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Tunai</span>
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => setReceiptData(item)}
                            className="inline-flex items-center space-x-1 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-lg text-xs font-bold border border-amber-300 shadow-sm transition-colors"
                            title="Cetak Bukti Pembayaran Denda"
                          >
                            <Receipt className="w-3.5 h-3.5 text-amber-600" />
                            <span>Kwitansi</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs italic">Bebas Denda</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-slate-500 font-medium">
                    Belum ada rekaman pengembalian buku.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: FORM PENGEMBALIAN BUKU DENGAN INPUT DENDA YANG BISA DIEDIT */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Formulir Pengembalian Buku & Denda"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-800 mb-1">Kode Pengembalian (Primary Key)</label>
            <div className="relative">
              <input
                type="text"
                disabled
                value={formData.kd_pengembalian}
                className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-xl font-mono font-bold text-slate-800"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-emerald-700 font-bold flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>Auto-Generated</span>
              </span>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">Pilih Transaksi Peminjaman Siswa</label>
            <select
              value={formData.kd_peminjaman}
              onChange={handleLoanChange}
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-600 text-slate-900 font-medium"
            >
              <option value="">-- Pilih Transaksi Pinjam Aktif --</option>
              {activeLoans.map((l) => (
                <option key={l.kd_peminjaman} value={l.kd_peminjaman}>
                  [{l.kd_peminjaman}] {l.nama_anggota} - {l.buku?.judul_buku || l.kd_buku} (Tempo: {l.tgl_jatuh_tempo})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">Tanggal Pengembalian Real</label>
            <input
              type="date"
              value={formData.tgl_pengembalian}
              onChange={handleReturnDateChange}
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-600 text-slate-900 font-medium font-mono"
            />
          </div>

          {/* Denda Calculator Card (Hasil Hitung Otomatis) */}
          {dendaPreview && (
            <div className={`p-3.5 rounded-xl border ${
              dendaPreview.hari_terlambat > 0 
                ? 'bg-rose-50 border-rose-300 text-rose-950' 
                : 'bg-emerald-50 border-emerald-300 text-emerald-950'
            }`}>
              <div className="flex items-center justify-between font-bold mb-1.5">
                <span className="flex items-center space-x-1.5">
                  <Coins className="w-4 h-4 text-emerald-600" />
                  <span>Kalkulasi Otomatis Sistem</span>
                </span>
                <span className="text-sm font-mono font-extrabold">{formatRupiah(dendaPreview.denda)}</span>
              </div>
              <div className="space-y-0.5 text-[11px] font-medium opacity-90">
                <div className="flex justify-between">
                  <span>Jatuh Tempo:</span>
                  <span className="font-bold">{dendaPreview.tgl_jatuh_tempo}</span>
                </div>
                <div className="flex justify-between">
                  <span>Keterlambatan:</span>
                  <span className="font-bold">{dendaPreview.hari_terlambat} Hari</span>
                </div>
                <div className="flex justify-between">
                  <span>Tarif Per Hari:</span>
                  <span>{formatRupiah(dendaPreview.tarif_per_hari)}</span>
                </div>
              </div>
            </div>
          )}

          {/* INPUT KHUSUS: EDIT BESARAN DENDA SECARA MANUAL */}
          <div className="p-3 bg-amber-50/70 border border-amber-300 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 flex items-center space-x-1.5 text-xs">
                <Coins className="w-4 h-4 text-amber-600" />
                <span>Nominal Denda Yang Ditagihkan (Bisa Diedit Manual)</span>
              </label>
              <span className="text-[10px] text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded">
                Dapat disesuaikan
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-500">Rp</span>
              <input
                type="number"
                min={0}
                step={1}
                value={formData.denda}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setFormData({
                    ...formData,
                    denda: val,
                    status_denda: val > 0 ? (formData.status_denda === 'Tanpa Denda' ? 'Lunas' : formData.status_denda) : 'Tanpa Denda'
                  });
                }}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/25 text-sm"
                required
              />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              <span className="text-[10px] text-slate-500 font-semibold">Preset Cepat:</span>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, denda: 0, status_denda: 'Tanpa Denda' })}
                className="px-2 py-0.5 rounded text-[10px] font-bold border border-slate-300 bg-white hover:bg-slate-100 text-slate-700"
              >
                Bebaskan Denda (Rp 0)
              </button>
              {dendaPreview && dendaPreview.denda > 0 && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, denda: dendaPreview.denda, status_denda: 'Lunas' })}
                  className="px-2 py-0.5 rounded text-[10px] font-bold border border-amber-400 bg-amber-100 hover:bg-amber-200 text-amber-900"
                >
                  Hitungan Standar ({formatRupiah(dendaPreview.denda)})
                </button>
              )}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, denda: Number(formData.denda) + 5000 })}
                className="px-2 py-0.5 rounded text-[10px] font-bold border border-slate-300 bg-white hover:bg-slate-100 text-slate-700"
              >
                + Rp 5.000 (Kerusakan)
              </button>
            </div>
          </div>

          {/* Opsi Metode Pembayaran jika Ada Denda */}
          {Number(formData.denda) > 0 && (
            <div>
              <label className="block font-bold text-slate-800 mb-1">Metode & Status Pembayaran Denda</label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status_denda: 'Lunas', metode_pembayaran: 'Tunai Loket' })}
                  className={`py-2 px-2 rounded-xl border text-[11px] font-bold transition-all text-center ${
                    formData.status_denda === 'Lunas' && formData.metode_pembayaran === 'Tunai Loket'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  💵 Tunai di Loket
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status_denda: 'Lunas', metode_pembayaran: 'QRIS / Payment Gateway' })}
                  className={`py-2 px-2 rounded-xl border text-[11px] font-bold transition-all text-center ${
                    formData.metode_pembayaran === 'QRIS / Payment Gateway'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  💳 Gateway (QRIS/VA)
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status_denda: 'Tertunggak', metode_pembayaran: 'Belum Dibayar' })}
                  className={`py-2 px-2 rounded-xl border text-[11px] font-bold transition-all text-center ${
                    formData.status_denda === 'Tertunggak'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  ⚠ Tertunggak
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-800 mb-1">Keterangan / Kondisi Buku</label>
            <input
              type="text"
              value={formData.keterangan}
              onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
              placeholder="Contoh: Kondisi buku mulus / Terlambat 2 hari"
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-600 text-slate-900 font-medium"
            />
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
              {submitting ? 'Memproses...' : 'Selesaikan Pengembalian'}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: EDIT BESARAN DENDA PADA REKAMAN PENGEMBALIAN TERTENTU */}
      <Modal
        isOpen={isEditDendaModalOpen}
        onClose={() => setIsEditDendaModalOpen(false)}
        title="Edit Besaran Denda Transaksi Pengembalian"
      >
        {selectedReturnForEdit && (
          <form onSubmit={handleSubmitEditDenda} className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex justify-between font-bold text-slate-900">
                <span>{selectedReturnForEdit.kd_pengembalian}</span>
                <span className="font-mono text-slate-600">Pinjam: {selectedReturnForEdit.kd_peminjaman}</span>
              </div>
              <p className="text-slate-600 mt-1">
                Peminjam: <strong className="text-slate-900">{selectedReturnForEdit.peminjaman?.nama_anggota || '-'}</strong>
              </p>
              <p className="text-slate-600">
                Buku: {selectedReturnForEdit.peminjaman?.buku?.judul_buku || '-'}
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Besaran Nominal Denda (Rp)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-500">Rp</span>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={editDendaForm.denda}
                  onChange={(e) => setEditDendaForm({ ...editDendaForm, denda: Number(e.target.value) })}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/25"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Status Denda</label>
              <select
                value={editDendaForm.status_denda}
                onChange={(e) => setEditDendaForm({ ...editDendaForm, status_denda: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/25"
              >
                <option value="Lunas">✓ Lunas (Telah Dibayar)</option>
                <option value="Tertunggak">⚠ Tertunggak (Belum Dibayar)</option>
                <option value="Tanpa Denda">Tanpa Denda (Bebas Biaya)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Catatan / Alasan Penyesuaian</label>
              <input
                type="text"
                value={editDendaForm.keterangan}
                onChange={(e) => setEditDendaForm({ ...editDendaForm, keterangan: e.target.value })}
                placeholder="Contoh: Dispensasi keterlambatan izin sakit / denda buku rusak"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100 mt-4">
              <button
                type="button"
                onClick={() => setIsEditDendaModalOpen(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-bold"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submittingEditDenda}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-md shadow-amber-600/25 disabled:opacity-50"
              >
                {submittingEditDenda ? 'Menyimpan...' : 'Simpan Perubahan Denda'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* MODAL 3: EDIT TARIF DENDA GLOBAL CEPAT */}
      <Modal
        isOpen={isTarifModalOpen}
        onClose={() => setIsTarifModalOpen(false)}
        title="Pengaturan Besaran Tarif Denda Global"
      >
        <form onSubmit={handleSaveTarifGlobal} className="space-y-4 text-xs">
          <p className="text-slate-500 text-[11px]">
            Pengaturan ini mengatur tarif denda per hari per buku pada tabel master <strong className="text-slate-800">tb_pengaturan</strong> MySQL dan langsung berdampak ke perhitungan denda sirkulasi.
          </p>

          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Besaran Tarif Denda Keterlambatan (Rp / Hari / Buku)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-500">Rp</span>
              <input
                type="number"
                min={0}
                step={1}
                value={tempTarif}
                onChange={(e) => setTempTarif(Number(e.target.value))}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/25 text-sm"
                required
              />
            </div>
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {[0, 500, 1000, 2000, 5000, 10000].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setTempTarif(val)}
                  className={`text-[10px] px-2.5 py-1 rounded-lg border font-bold ${
                    tempTarif === val ? 'bg-amber-600 text-white border-amber-600' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {val === 0 ? 'Bebas Denda (Rp 0)' : `Rp ${val.toLocaleString('id-ID')}`}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100 mt-4">
            <button
              type="button"
              onClick={() => setIsTarifModalOpen(false)}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submittingTarif}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-600/25 disabled:opacity-50"
            >
              {submittingTarif ? 'Menyimpan...' : 'Simpan Tarif Denda'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Kwitansi Resmi Pelunasan Denda */}
      <KwitansiDendaModal
        isOpen={Boolean(receiptData)}
        onClose={() => setReceiptData(null)}
        data={receiptData}
      />

      {/* Modal Payment Gateway Interaktif (QRIS & Virtual Account) */}
      <PaymentGatewayModal
        isOpen={Boolean(gatewayData)}
        onClose={() => setGatewayData(null)}
        data={gatewayData}
        onSuccess={() => {
          showNotification('Pembayaran denda via Gateway berhasil diverifikasi!', 'success');
          fetchData();
        }}
      />
    </div>
  );
}
