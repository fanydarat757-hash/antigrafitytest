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
  MessageCircle,
  Clock,
  Coins,
  Settings,
  CalendarPlus,
  ShieldCheck,
  CreditCard,
  Download
} from 'lucide-react';
import Modal from '../components/Modal';
import PaymentGatewayModal from '../components/PaymentGatewayModal';
import { TableRowSkeleton } from '../components/Skeleton';
import { api, formatDateIndo } from '../api/axios';

export default function PeminjamanPage({ showNotification, onNavigateToReturn, user }) {
  const roleCode = user?.roleCode || (user?.username === 'admin' ? 'kepala_perpus' : user?.username === 'kepsek' ? 'kepala_sekolah' : 'petugas_sirkulasi');
  const [list, setList] = useState([]);
  const [allList, setAllList] = useState([]);
  const [bukuOptions, setBukuOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [gatewayData, setGatewayData] = useState(null);

  // Settings State
  const [settings, setSettings] = useState({
    tarif_denda: 1000,
    durasi_pinjam: 7,
    durasi_perpanjangan: 7,
    biaya_perpanjangan: 2000
  });

  // Modal Tambah Peminjaman
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    kd_peminjaman: '',
    kd_buku: '',
    nama_anggota: '',
    tgl_peminjaman: new Date().toISOString().split('T')[0],
    durasi_hari: 7,
    dispensasi: false,
  });
  const [submitting, setSubmitting] = useState(false);

  // Modal Perpanjang Masa Pinjam Khusus
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
  const [selectedLoanForExtend, setSelectedLoanForExtend] = useState(null);
  const [extendForm, setExtendForm] = useState({
    hari_tambahan: 7,
    tgl_jatuh_tempo_baru: '',
    biaya_perpanjangan: 0,
    metode_pembayaran: 'Tunai di Loket',
    force: false,
    catatan: ''
  });
  const [submittingExtend, setSubmittingExtend] = useState(false);

  // Modal Edit Tarif Denda & Kebijakan Sirkulasi Cepat
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [tempSettings, setTempSettings] = useState({
    tarif_denda: 1000,
    durasi_pinjam: 7,
    durasi_perpanjangan: 7,
    biaya_perpanjangan: 2000
  });
  const [submittingSettings, setSubmittingSettings] = useState(false);

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
      const res = await api.getPeminjaman(search, statusFilter);
      if (res && res.data) {
        setList(res.data.data || []);
      }
      // Ambil dataset lengkap untuk counter badge status
      if (!search && !statusFilter) {
        setAllList(res.data.data || []);
      } else if (allList.length === 0) {
        const fullRes = await api.getPeminjaman('', '');
        if (fullRes?.data) setAllList(fullRes.data.data || []);
      }
    } catch (err) {
      showNotification('Gagal memuat data peminjaman: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const calculateOverdueDays = (tempoDateStr) => {
    if (!tempoDateStr) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(tempoDateStr);
    due.setHours(0, 0, 0, 0);
    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const handleExportCSV = () => {
    if (!list || list.length === 0) {
      showNotification('Tidak ada data peminjaman untuk diekspor.', 'error');
      return;
    }
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'No,Kode Pinjam,Nama Anggota,Kode Buku,Judul Buku,Tgl Pinjam,Jatuh Tempo,Status,Jumlah Perpanjangan\n';
    list.forEach((row, idx) => {
      csvContent += `${idx + 1},"${row.kd_peminjaman}","${row.nama_anggota}","${row.kd_buku}","${row.buku?.judul_buku || row.kd_buku}","${row.tgl_peminjaman}","${row.tgl_jatuh_tempo || '-'}","${row.status}",${row.perpanjangan_count || 0}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Sirkulasi_Peminjaman_SMA_Muhammadiyah_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Data peminjaman berhasil diekspor ke file CSV/Excel!', 'success');
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

  const getDaysUntilDue = (tempoStr) => {
    if (!tempoStr) return 999;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tempo = new Date(tempoStr);
    tempo.setHours(0, 0, 0, 0);
    return Math.ceil((tempo - today) / (1000 * 60 * 60 * 24));
  };

  // --- HANDLER MODAL TAMBAH PINJAM ---
  const handleOpenAdd = async () => {
    await loadBukuOptions();
    const defaultDuration = settings.durasi_pinjam || 7;
    try {
      const nextCode = await api.generateKodePeminjaman();
      setFormData({
        kd_peminjaman: nextCode,
        kd_buku: bukuOptions[0]?.kd_buku || '',
        nama_anggota: '',
        tgl_peminjaman: new Date().toISOString().split('T')[0],
        durasi_hari: defaultDuration,
      });
    } catch {
      setFormData({
        kd_peminjaman: 'PJ' + Math.floor(100 + Math.random() * 900),
        kd_buku: '',
        nama_anggota: '',
        tgl_peminjaman: new Date().toISOString().split('T')[0],
        durasi_hari: defaultDuration,
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

  // --- HANDLER MODAL PERPANJANG MASA PINJAM ---
  const handleOpenExtendModal = (item) => {
    const defaultDays = settings.durasi_perpanjangan || 7;
    const baseDate = new Date(item.tgl_jatuh_tempo || new Date());
    const newDate = new Date(baseDate.getTime() + defaultDays * 86400000);
    const newTempoStr = newDate.toISOString().split('T')[0];

    setSelectedLoanForExtend(item);
    setExtendForm({
      hari_tambahan: defaultDays,
      tgl_jatuh_tempo_baru: newTempoStr,
      biaya_perpanjangan: settings.biaya_perpanjangan ?? 0,
      metode_pembayaran: (settings.biaya_perpanjangan > 0) ? 'Tunai di Loket' : 'Gratis / Bebas Biaya',
      force: (item.perpanjangan_count || 0) >= 1 || item.status === 'Terlambat',
      catatan: ''
    });
    setIsExtendModalOpen(true);
  };

  const handlePresetDays = (days) => {
    if (!selectedLoanForExtend) return;
    const baseDate = new Date(selectedLoanForExtend.tgl_jatuh_tempo || new Date());
    const newDate = new Date(baseDate.getTime() + days * 86400000);
    setExtendForm(prev => ({
      ...prev,
      hari_tambahan: days,
      tgl_jatuh_tempo_baru: newDate.toISOString().split('T')[0]
    }));
  };

  const handleCustomDateChange = (newDateStr) => {
    if (!selectedLoanForExtend || !newDateStr) return;
    const baseDate = new Date(selectedLoanForExtend.tgl_jatuh_tempo || new Date());
    const newDate = new Date(newDateStr);
    const diffDays = Math.max(1, Math.round((newDate - baseDate) / 86400000));
    setExtendForm(prev => ({
      ...prev,
      tgl_jatuh_tempo_baru: newDateStr,
      hari_tambahan: diffDays
    }));
  };

  const handleSubmitExtend = async (e) => {
    e.preventDefault();
    if (!selectedLoanForExtend) return;

    // Jika metode QRIS dan ada biaya, arahkan ke PaymentGatewayModal
    if (extendForm.metode_pembayaran === 'QRIS Digital' && Number(extendForm.biaya_perpanjangan) > 0) {
      setGatewayData({
        ...selectedLoanForExtend,
        denda: Number(extendForm.biaya_perpanjangan),
        nama_siswa: selectedLoanForExtend.nama_anggota,
        isPerpanjang: true,
        judul_transaksi: `Biaya Perpanjang Masa Pinjam (+${extendForm.hari_tambahan} Hari)`,
        label_nominal: 'Biaya Layanan Perpanjangan',
        extendPayload: {
          hari_tambahan: extendForm.hari_tambahan,
          tgl_jatuh_tempo_baru: extendForm.tgl_jatuh_tempo_baru,
          biaya_perpanjangan: Number(extendForm.biaya_perpanjangan),
          metode_pembayaran: 'QRIS Digital',
          force: extendForm.force
        }
      });
      setIsExtendModalOpen(false);
      return;
    }

    setSubmittingExtend(true);
    try {
      const res = await api.perpanjangPeminjaman(selectedLoanForExtend.kd_peminjaman, {
        hari_tambahan: extendForm.hari_tambahan,
        tgl_jatuh_tempo_baru: extendForm.tgl_jatuh_tempo_baru,
        biaya_perpanjangan: Number(extendForm.biaya_perpanjangan),
        metode_pembayaran: extendForm.metode_pembayaran,
        force: extendForm.force
      });
      showNotification(res.message || 'Masa pinjam berhasil diperpanjang!', 'success');
      setIsExtendModalOpen(false);
      fetchData();
    } catch (err) {
      showNotification('Gagal memperpanjang: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setSubmittingExtend(false);
    }
  };

  // --- HANDLER MODAL CEPAT ATUR TARIF DENDA & MASA PINJAM ---
  const handleOpenSettingsModal = () => {
    setTempSettings({ ...settings });
    setIsSettingsModalOpen(true);
  };

  const handleSaveQuickSettings = async (e) => {
    e.preventDefault();
    setSubmittingSettings(true);
    try {
      await api.updatePengaturan({
        tarif_denda: Number(tempSettings.tarif_denda),
        durasi_pinjam: Number(tempSettings.durasi_pinjam),
        durasi_perpanjangan: Number(tempSettings.durasi_perpanjangan),
        biaya_perpanjangan: Number(tempSettings.biaya_perpanjangan)
      });
      setSettings({ ...tempSettings });
      showNotification('Konfigurasi tarif denda & masa pinjam berhasil disimpan!', 'success');
      setIsSettingsModalOpen(false);
    } catch (err) {
      showNotification('Gagal menyimpan: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setSubmittingSettings(false);
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

      {/* Header Halaman dengan Tombol Tambah & Tombol Cepat Atur Denda/Masa Pinjam */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
            <ArrowUpRight className="w-5 h-5 text-amber-500" />
            <span>{roleCode === 'petugas_sirkulasi' ? 'Loket Pelayanan Peminjaman Siswa' : 'Sirkulasi: Transaksi Peminjaman Buku'}</span>
          </h2>
          <div className="flex items-center space-x-3 mt-1 text-xs text-slate-600 font-medium flex-wrap">
            <span>Pencatatan sirkulasi peminjaman siswa SMA Muhammadiyah 1 Pekalongan</span>
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[11px] font-bold border border-slate-200">
              <Coins className="w-3 h-3 text-amber-600" />
              <span>Denda: Rp {settings.tarif_denda.toLocaleString('id-ID')}/hari</span>
              <span className="text-slate-300">•</span>
              <Clock className="w-3 h-3 text-blue-600" />
              <span>Masa Pinjam: {settings.durasi_pinjam} Hari</span>
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto flex-wrap gap-y-2">
          {/* Tombol Ekspor Data CSV/Excel */}
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold border border-slate-300 transition-all shadow-xs"
            title="Unduh seluruh data sirkulasi peminjaman ke format file CSV / Excel"
          >
            <Download className="w-3.5 h-3.5 text-slate-700" />
            <span>📥 Unduh CSV / Excel</span>
          </button>

          {/* Tombol Pintas: Edit Tarif Denda & Masa Pinjam */}
          <button
            onClick={handleOpenSettingsModal}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold border border-slate-300 transition-all shadow-xs"
            title="Ubah tarif denda harian dan durasi standar peminjaman/perpanjangan"
          >
            <Settings className="w-3.5 h-3.5 text-slate-700" />
            <span>⚙️ Atur Tarif Denda & Durasi Pinjam</span>
          </button>

          {roleCode !== 'kepala_sekolah' && (
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <Plus className="w-4 h-4" />
              <span>+ Pinjam Buku Baru</span>
            </button>
          )}
        </div>
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

        {/* Status Filter Badges dengan Indikator Jumlah Real-Time */}
        {(() => {
          const effective = allList.length > 0 ? allList : list;
          const countTotal = effective.length;
          const countDipinjam = effective.filter(p => p.status === 'Dipinjam').length;
          const countTerlambat = effective.filter(p => p.status === 'Terlambat').length;
          const countDikembalikan = effective.filter(p => p.status === 'Dikembalikan').length;

          return (
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
              {[
                { label: 'Semua Status', value: '', count: countTotal, isAlert: false },
                { label: 'Sedang Dipinjam', value: 'Dipinjam', count: countDipinjam, isAlert: false },
                { label: 'Terlambat', value: 'Terlambat', count: countTerlambat, isAlert: countTerlambat > 0 },
                { label: 'Dikembalikan', value: 'Dikembalikan', count: countDikembalikan, isAlert: false },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setStatusFilter(item.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                    statusFilter === item.value
                      ? 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-900'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{item.label}</span>
                  <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-mono font-bold ${
                    item.isAlert
                      ? 'bg-rose-600 text-white animate-pulse'
                      : statusFilter === item.value
                      ? 'bg-slate-700 text-slate-200'
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {item.count}
                  </span>
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
          );
        })()}
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
                <th className="py-3.5 px-4 text-right">Aksi Sirkulasi</th>
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
                        <span className="text-[10px] text-blue-600 font-semibold">(Diperpanjang {item.perpanjangan_count}x)</span>
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
                      {item.status === 'Terlambat' && (() => {
                        const lateDays = calculateOverdueDays(item.tgl_jatuh_tempo);
                        const estFine = lateDays * (settings.tarif_denda || 1000);
                        return (
                          <div className="flex flex-col items-start gap-1">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-900 border border-rose-300 animate-pulse">
                              🚨 Terlambat {lateDays > 0 ? `${lateDays} Hari` : ''}
                            </span>
                            {lateDays > 0 && (
                              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 font-mono">
                                Denda: Rp {estFine.toLocaleString('id-ID')}
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                      {roleCode === 'kepala_sekolah' ? (
                        <span className="text-slate-500 font-mono text-[10px] font-bold">
                          {item.status === 'Dikembalikan' ? 'Selesai' : 'Aktif Dipantau'}
                        </span>
                      ) : item.status !== 'Dikembalikan' ? (
                        <>
                          {/* Tombol Interaktif: Perpanjang Masa Pinjam */}
                          <button
                            onClick={() => handleOpenExtendModal(item)}
                            title="Buka dialog formulir perpanjangan masa pinjam buku"
                            className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300 rounded-lg text-xs font-bold transition-colors inline-flex items-center space-x-1 focus-visible:ring-2 focus-visible:ring-blue-500"
                          >
                            <CalendarPlus className="w-3.5 h-3.5 text-blue-600" />
                            <span>Perpanjang</span>
                          </button>

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

      {/* MODAL 1: PERPANJANG MASA PINJAM INTERAKTIF */}
      <Modal
        isOpen={isExtendModalOpen}
        onClose={() => setIsExtendModalOpen(false)}
        title="Formulir Perpanjangan Masa Pinjam Buku"
      >
        {selectedLoanForExtend && (
          <form onSubmit={handleSubmitExtend} className="space-y-4 text-xs">
            {/* Info Transaksi yang Sedang Diperpanjang */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900 font-mono text-sm">{selectedLoanForExtend.kd_peminjaman}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  selectedLoanForExtend.status === 'Terlambat' 
                    ? 'bg-rose-100 text-rose-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  Status: {selectedLoanForExtend.status}
                </span>
              </div>
              <div className="text-slate-700">
                <span className="text-slate-500">Peminjam:</span> <strong className="text-slate-900">{selectedLoanForExtend.nama_anggota}</strong>
              </div>
              <div className="text-slate-700">
                <span className="text-slate-500">Buku:</span> <strong className="text-slate-900">{selectedLoanForExtend.buku?.judul_buku || selectedLoanForExtend.kd_buku}</strong>
              </div>
              <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-200/70 text-[11px]">
                <span>Mulai Pinjam: {formatDateIndo(selectedLoanForExtend.tgl_peminjaman)}</span>
                <span>Jatuh Tempo Saat Ini: <strong className="text-slate-800">{formatDateIndo(selectedLoanForExtend.tgl_jatuh_tempo)}</strong></span>
              </div>
            </div>

            {/* Pilihan Cepat Tambahan Hari */}
            <div>
              <label className="block font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                <span>Pilihan Durasi Tambahan Hari:</span>
                <span className="text-[11px] font-mono text-blue-700 font-bold">
                  +{extendForm.hari_tambahan} Hari
                </span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[3, 7, 14, 30].map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => handlePresetDays(days)}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-all ${
                      extendForm.hari_tambahan === days
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    +{days} Hari {days === 7 ? '★' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Tanggal Jatuh Tempo Baru */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Tanggal Jatuh Tempo Baru (Hasil Perpanjangan):
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input
                  type="date"
                  value={extendForm.tgl_jatuh_tempo_baru}
                  onChange={(e) => handleCustomDateChange(e.target.value)}
                  min={selectedLoanForExtend.tgl_jatuh_tempo || new Date().toISOString().split('T')[0]}
                  required
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Tanggal jatuh tempo baru: <strong className="text-blue-700">{formatDateIndo(extendForm.tgl_jatuh_tempo_baru)}</strong>
              </p>
            </div>

            {/* Biaya Administrasi Perpanjangan */}
            <div>
              <label className="block font-bold text-slate-800 mb-1 flex items-center justify-between">
                <span>Biaya Administrasi Perpanjangan (Rp):</span>
                <span className="text-[10px] text-slate-500">Bisa diisi 0 jika bebas biaya</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-500">Rp</span>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={extendForm.biaya_perpanjangan}
                  onChange={(e) => setExtendForm({ ...extendForm, biaya_perpanjangan: Number(e.target.value) })}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/25"
                />
              </div>
              <div className="flex gap-2 mt-1.5">
                <button
                  type="button"
                  onClick={() => setExtendForm({ ...extendForm, biaya_perpanjangan: 0, metode_pembayaran: 'Gratis / Bebas Biaya' })}
                  className="text-[10px] px-2 py-0.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 font-bold text-slate-700"
                >
                  Set Gratis (Rp 0)
                </button>
                <button
                  type="button"
                  onClick={() => setExtendForm({ ...extendForm, biaya_perpanjangan: 1000, metode_pembayaran: 'Tunai di Loket' })}
                  className="text-[10px] px-2 py-0.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 font-bold text-slate-700"
                >
                  Rp 1.000
                </button>
                <button
                  type="button"
                  onClick={() => setExtendForm({ ...extendForm, biaya_perpanjangan: 2000, metode_pembayaran: 'Tunai di Loket' })}
                  className="text-[10px] px-2 py-0.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 font-bold text-slate-700"
                >
                  Rp 2.000 (Standar)
                </button>
              </div>
            </div>

            {/* Pilihan Metode Pembayaran Biaya Perpanjangan (Jika Biaya > 0) */}
            {Number(extendForm.biaya_perpanjangan) > 0 && (
              <div>
                <label className="block font-bold text-slate-800 mb-1">Metode Pembayaran Biaya:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setExtendForm({ ...extendForm, metode_pembayaran: 'Tunai di Loket' })}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold text-center transition-all ${
                      extendForm.metode_pembayaran === 'Tunai di Loket'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    💵 Tunai di Loket
                  </button>
                  <button
                    type="button"
                    onClick={() => setExtendForm({ ...extendForm, metode_pembayaran: 'QRIS Digital' })}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold text-center transition-all ${
                      extendForm.metode_pembayaran === 'QRIS Digital'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    💳 Scan QRIS Digital
                  </button>
                </div>
              </div>
            )}

            {/* Checkbox Dispensasi Petugas */}
            {((selectedLoanForExtend.perpanjangan_count || 0) >= 1 || selectedLoanForExtend.status === 'Terlambat') && (
              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="forceOverride"
                  checked={extendForm.force}
                  onChange={(e) => setExtendForm({ ...extendForm, force: e.target.checked })}
                  className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="forceOverride" className="text-[11px] text-amber-950 font-medium">
                  <strong>Otorisasi Petugas Sirkulasi:</strong> Berikan dispensasi perpanjangan khusus meskipun transaksi sudah pernah diperpanjang atau berstatus terlambat.
                </label>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100 mt-4">
              <button
                type="button"
                onClick={() => setIsExtendModalOpen(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-bold"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submittingExtend}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-600/25 disabled:opacity-50 flex items-center space-x-1.5"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{submittingExtend ? 'Menyimpan...' : 'Perpanjang Sekarang'}</span>
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* MODAL 2: EDIT TARIF DENDA & MASA PINJAM CEPAT (GLOBAL SETTINGS) */}
      <Modal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        title="Pengaturan Besaran Denda & Kebijakan Masa Pinjam"
      >
        <form onSubmit={handleSaveQuickSettings} className="space-y-4 text-xs">
          <p className="text-slate-500 text-[11px]">
            Perubahan konfigurasi ini disimpan langsung ke tabel master <strong className="text-slate-800">tb_pengaturan</strong> di database MySQL dan langsung berlaku pada kalkulasi denda transaksi baru.
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
                value={tempSettings.tarif_denda}
                onChange={(e) => setTempSettings({ ...tempSettings, tarif_denda: Number(e.target.value) })}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/25"
                required
              />
            </div>
            <div className="flex gap-1.5 mt-1.5 flex-wrap">
              {[0, 500, 1000, 2000, 5000].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setTempSettings({ ...tempSettings, tarif_denda: val })}
                  className={`text-[10px] px-2 py-0.5 rounded border ${
                    tempSettings.tarif_denda === val ? 'bg-amber-600 text-white border-amber-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {val === 0 ? 'Gratis' : `Rp ${val.toLocaleString('id-ID')}`}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Batas Waktu Standar Peminjaman (Hari)
            </label>
            <input
              type="number"
              min={1}
              max={60}
              value={tempSettings.durasi_pinjam}
              onChange={(e) => setTempSettings({ ...tempSettings, durasi_pinjam: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/25"
              required
            />
            <div className="flex gap-1.5 mt-1.5">
              {[3, 7, 10, 14, 30].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setTempSettings({ ...tempSettings, durasi_pinjam: val })}
                  className={`text-[10px] px-2 py-0.5 rounded border ${
                    tempSettings.durasi_pinjam === val ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {val} Hari
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Durasi Tambahan Saat Perpanjang (Hari)
            </label>
            <input
              type="number"
              min={1}
              max={60}
              value={tempSettings.durasi_perpanjangan}
              onChange={(e) => setTempSettings({ ...tempSettings, durasi_perpanjangan: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/25"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Biaya Administrasi Perpanjangan (Rp)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-500">Rp</span>
              <input
                type="number"
                min={0}
                step={1}
                value={tempSettings.biaya_perpanjangan}
                onChange={(e) => setTempSettings({ ...tempSettings, biaya_perpanjangan: Number(e.target.value) })}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/25"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100 mt-4">
            <button
              type="button"
              onClick={() => setIsSettingsModalOpen(false)}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submittingSettings}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-600/25 disabled:opacity-50"
            >
              {submittingSettings ? 'Menyimpan...' : 'Simpan Konfigurasi'}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 3: FORM TAMBAH PEMINJAMAN BARU */}
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

          {/* Member Active Loans Status Check */}
          {(() => {
            const memberName = formData.nama_anggota.trim();
            if (!memberName) return null;
            const activeLoans = (allList.length > 0 ? allList : list).filter(
              p => p.nama_anggota.toLowerCase().includes(memberName.toLowerCase()) && p.status !== 'Dikembalikan'
            );
            if (activeLoans.length === 0) return null;

            return (
              <div className={`p-3 rounded-xl border text-xs ${
                activeLoans.length >= 2 ? 'bg-amber-50 border-amber-300 text-amber-950' : 'bg-blue-50 border-blue-200 text-blue-950'
              }`}>
                <div className="flex items-center justify-between font-bold">
                  <span>Peminjaman Aktif Anggota:</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                    activeLoans.length >= 2 ? 'bg-amber-600 text-white' : 'bg-blue-600 text-white'
                  }`}>
                    {activeLoans.length} / 2 Buku (Maksimal Kuota)
                  </span>
                </div>
                <div className="mt-1 space-y-0.5 text-[11px] text-slate-700">
                  {activeLoans.map(l => (
                    <div key={l.kd_peminjaman} className="flex justify-between">
                      <span className="truncate max-w-[200px]">• {l.buku?.judul_buku || l.kd_buku}</span>
                      <span className="font-mono text-slate-500">Tempo: {formatDateIndo(l.tgl_jatuh_tempo)}</span>
                    </div>
                  ))}
                </div>
                {activeLoans.length >= 2 && (
                  <label className="flex items-center space-x-2 mt-2 pt-2 border-t border-amber-200 font-bold text-amber-900 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.dispensasi}
                      onChange={(e) => setFormData({ ...formData, dispensasi: e.target.checked })}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Berikan Dispensasi Petugas (Izin Khusus Kepala Perpustakaan)</span>
                  </label>
                )}
              </div>
            );
          })()}

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
                max={60}
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
              hari_tambahan: gatewayData.extendPayload?.hari_tambahan || 7,
              tgl_jatuh_tempo_baru: gatewayData.extendPayload?.tgl_jatuh_tempo_baru,
              biaya_perpanjangan: result.nominal,
              metode_pembayaran: result.metode_pembayaran,
              id_transaksi: result.order_id,
              force: gatewayData.extendPayload?.force || false
            });
            showNotification(res.message || 'Masa pinjam berhasil diperpanjang!', 'success');
            fetchData();
          } catch (err) {
            showNotification('Gagal memperpanjang: ' + (err.response?.data?.message || err.message), 'error');
          }
        }}
      />
    </div>
  );
}
