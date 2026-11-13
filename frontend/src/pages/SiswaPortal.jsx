import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Clock, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  GraduationCap, 
  LogOut, 
  User, 
  BookMarked,
  ShieldCheck,
  Coins,
  BookmarkPlus,
  BookCheck,
  CreditCard,
  Edit,
  Camera
} from 'lucide-react';
import { BookCardSkeleton } from '../components/Skeleton';
import Modal from '../components/Modal';
import KartuPerpusModal from '../components/KartuPerpusModal';
import EditProfileModal from '../components/EditProfileModal';
import PaymentGatewayModal from '../components/PaymentGatewayModal';
import { api, formatDateIndo } from '../api/axios';

export default function SiswaPortal({ user, onLogout, onUpdateUser }) {
  const [bukuList, setBukuList] = useState([]);
  const [peminjamanList, setPeminjamanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('buku'); // 'buku' | 'pinjaman_saya'
  const [extendingId, setExtendingId] = useState(null);
  const [selectedGatewayLoan, setSelectedGatewayLoan] = useState(null);
  const [extensionFee, setExtensionFee] = useState(2000);

  useEffect(() => {
    api.getPengaturan().then(res => {
      if (res?.data?.biaya_perpanjangan !== undefined) {
        setExtensionFee(Number(res.data.biaya_perpanjangan));
      }
    }).catch(() => {});
  }, []);

  const handleExtendLoanSiswa = async (loan) => {
    if (extensionFee > 0) {
      setSelectedGatewayLoan({
        ...loan,
        denda: extensionFee,
        nama_siswa: user.nama,
        isPerpanjang: true,
        judul_transaksi: 'Biaya Administrasi Perpanjang Pinjaman (+7 Hari)',
        label_nominal: 'Biaya Administrasi Perpanjangan'
      });
      return;
    }

    setExtendingId(loan.kd_peminjaman);
    try {
      const res = await api.perpanjangPeminjaman(loan.kd_peminjaman);
      setFeedbackToast(res.message || 'Masa pinjam berhasil diperpanjang +7 hari!');
      setTimeout(() => setFeedbackToast(''), 4500);
      loadData();
    } catch (err) {
      alert('Gagal memperpanjang: ' + (err.response?.data?.message || err.message));
    } finally {
      setExtendingId(null);
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

  // Modals State
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [selectedBookToBorrow, setSelectedBookToBorrow] = useState(null);
  const [borrowDuration, setBorrowDuration] = useState(7);
  const [borrowing, setBorrowing] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState('');

  const loadData = () => {
    setLoading(true);
    Promise.all([
      api.getBuku(search),
      api.getPeminjaman()
    ]).then(([resBuku, resPinjam]) => {
      setBukuList(resBuku.data?.data || []);
      const allLoans = resPinjam.data?.data || [];
      const myLoans = allLoans.filter(p => 
        p.nama_anggota.toLowerCase().includes(user.nama.toLowerCase()) ||
        p.nama_anggota.includes(user.nisn)
      );
      setPeminjamanList(myLoans);
    }).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, [search, user.nama, user.nisn]);

  const activeLoans = peminjamanList.filter(p => p.status !== 'Dikembalikan');
  const returnedLoans = peminjamanList.filter(p => p.status === 'Dikembalikan');

  const handleConfirmBorrow = async (e) => {
    e.preventDefault();
    if (!selectedBookToBorrow) return;

    if (activeLoans.length >= 2) {
      alert('Maaf, Anda sudah meminjam 2 buku aktif (batas maksimal kuota perpustakaan). Harap kembalikan buku sebelumnya terlebih dahulu.');
      setSelectedBookToBorrow(null);
      return;
    }

    setBorrowing(true);
    try {
      const nextCode = await api.generateKodePeminjaman();
      const payload = {
        kd_peminjaman: nextCode,
        kd_buku: selectedBookToBorrow.kd_buku,
        nama_anggota: `${user.nama} (${user.nisn})`,
        tgl_peminjaman: new Date().toISOString().split('T')[0],
        durasi_hari: borrowDuration,
      };

      await api.createPeminjaman(payload);
      setFeedbackToast(`Berhasil meminjam buku "${selectedBookToBorrow.judul_buku}"!`);
      setTimeout(() => setFeedbackToast(''), 4500);
      setSelectedBookToBorrow(null);
      loadData();
      setActiveTab('pinjaman_saya');
    } catch (err) {
      alert('Gagal meminjam buku: ' + err.message);
    } finally {
      setBorrowing(false);
    }
  };

  const getReturnDatePreview = () => {
    const d = new Date();
    d.setDate(d.getDate() + parseInt(borrowDuration));
    return d.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative">
      {/* 3D Modern Library Fixed Responsive Background (Lanskap 16:9) */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none z-0 transform scale-[1.01]"
        style={{ backgroundImage: `url('/library_3d_bg.jpg')` }}
      />
      <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-[2px] pointer-events-none z-0" />
      <div className="fixed inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-slate-950/75 pointer-events-none z-0" />
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed -bottom-40 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Top Navbar Siswa */}
      <header className="bg-slate-950/80 backdrop-blur-2xl border-b border-slate-800/80 sticky top-0 z-20 shadow-md px-4 sm:px-6 py-3.5 relative">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-white text-sm leading-tight">PORTAL MAHASISWA & SISWA</h1>
              <p className="text-[11px] text-emerald-400 font-bold">SMA Muhammadiyah Pekalongan Lampung Timur</p>
            </div>
          </div>

          {/* User Info & Actions */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-extrabold text-white">{user.nama}</p>
              <p className="text-[11px] text-slate-400 font-semibold">{user.kelas} • NIM/NISN: {user.nisn}</p>
            </div>

            {/* Tombol Cetak Kartu Perpus */}
            <button
              onClick={() => setIsCardModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-colors shadow-sm"
              title="Lihat & Cetak Kartu Perpustakaan"
            >
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">Kartu Perpus</span>
            </button>

            <button
              onClick={onLogout}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition-colors focus-visible:ring-2 focus-visible:ring-rose-500"
              title="Keluar dari Portal Mahasiswa"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Siswa */}
      <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 relative z-10">
        {/* Toast Notifikasi Sukses Peminjaman */}
        {feedbackToast && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center justify-between shadow-lg animate-scale-up">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 bg-emerald-600 text-white rounded-lg">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="font-extrabold">{feedbackToast}</p>
                <p className="text-emerald-800 font-medium mt-0.5">Buku telah masuk ke tab 'Buku Peminjaman Saya' di bawah.</p>
              </div>
            </div>
          </div>
        )}

        {/* Banner Kartu Anggota Digital Siswa dengan Foto & Tombol Edit */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center space-x-5">
              {/* Foto Profil Siswa */}
              <div className="relative group flex-shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden ring-4 ring-white/20 border-2 border-white/40 shadow-xl bg-slate-800">
                  <img
                    src={user.foto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
                    alt={user.nama}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => setIsEditProfileOpen(true)}
                  className="absolute -bottom-1 -right-1 p-1.5 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-500 transition-colors"
                  title="Ganti Foto Profil"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Data Siswa */}
              <div>
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-blue-500/30 rounded-full text-[11px] font-bold text-blue-100 border border-blue-400/30 mb-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Kartu Anggota Perpustakaan Resmi</span>
                </div>
                <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight">{user.nama}</h2>
                <p className="text-xs sm:text-sm text-slate-200 mt-1 font-medium">
                  {user.kelas} • Nomor Identitas: <span className="font-mono font-bold text-white tracking-wider">{user.nisn}</span>
                </p>

                {/* Tombol Aksi Cepat Profil */}
                <div className="flex flex-wrap gap-2 mt-3">
                  <button
                    onClick={() => setIsEditProfileOpen(true)}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 transition-colors backdrop-blur-sm"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Ubah Profil & Foto</span>
                  </button>

                  <button
                    onClick={() => setIsCardModalOpen(true)}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-xl text-xs font-bold shadow-md transition-colors"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Cetak Kartu Perpus</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Counter Ringkasan Sirkulasi */}
            <div className="flex gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 self-start md:self-auto">
              <div className="text-center px-3 border-r border-white/15">
                <span className="block text-xl font-bold text-amber-300 font-mono">{activeLoans.length} / 2</span>
                <span className="text-[10px] text-slate-200 uppercase tracking-wider font-bold">Kuota Pinjam</span>
              </div>
              <div className="text-center px-3">
                <span className="block text-xl font-bold text-emerald-400 font-mono">{returnedLoans.length}</span>
                <span className="text-[10px] text-slate-200 uppercase tracking-wider font-bold">Telah Kembali</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 space-x-4">
          <button
            onClick={() => setActiveTab('buku')}
            className={`pb-3 text-xs font-bold transition-all flex items-center space-x-2 border-b-2 ${
              activeTab === 'buku'
                ? 'border-blue-600 text-blue-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Katalog & Cari Buku</span>
          </button>

          <button
            onClick={() => setActiveTab('pinjaman_saya')}
            className={`pb-3 text-xs font-bold transition-all flex items-center space-x-2 border-b-2 ${
              activeTab === 'pinjaman_saya'
                ? 'border-blue-600 text-blue-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookMarked className="w-4 h-4" />
            <span>Buku Peminjaman Saya ({activeLoans.length})</span>
          </button>
        </div>

        {/* TAB 1: KATALOG BUKU */}
        {activeTab === 'buku' && (
          <div className="space-y-4">
            {/* Search Input */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Cari buku sekolah"
                  placeholder="Ketik judul buku, pengarang, atau materi pelajaran..."
                  className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-600 shadow-sm text-slate-900 font-medium"
                />
              </div>

              <span className="text-xs text-slate-500 font-medium hidden sm:block">
                Pilih buku lalu klik tombol <strong className="text-blue-700">"Pinjam Buku Ini"</strong>
              </span>
            </div>

            {/* Grid Kartu Buku */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {loading ? (
                <>
                  <BookCardSkeleton />
                  <BookCardSkeleton />
                  <BookCardSkeleton />
                </>
              ) : bukuList.length > 0 ? (
                bukuList.map((buku) => (
                  <div 
                    key={buku.kd_buku} 
                    className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Header Kartu: Kode & Status Stok */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-1 rounded-md bg-slate-100 font-mono text-[11px] font-bold text-slate-800 border border-slate-300">
                          {buku.kd_buku}
                        </span>
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          buku.stok > 0 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}>
                          {buku.stok > 0 ? `${buku.stok} Tersedia di Rak` : 'Sedang Habis'}
                        </span>
                      </div>

                      {/* Judul Buku */}
                      <h3 className="font-extrabold text-slate-900 text-sm leading-snug line-clamp-2 min-h-[40px]">
                        {buku.judul_buku}
                      </h3>
                      
                      {/* Penulis, Penerbit & Lokasi Rak */}
                      <div className="mt-3 space-y-1 text-xs text-slate-600 border-t border-slate-100 pt-3">
                        <p>Penulis: <span className="text-slate-900 font-bold">{buku.pengarang}</span></p>
                        <p>Penerbit: <span className="text-slate-900 font-bold">{buku.penerbit} ({buku.tahun_terbit})</span></p>
                        <p className="font-bold text-emerald-700 text-[11px] pt-1">
                          📍 {buku.lokasi_rak || 'Rak A-01 (Umum)'}
                        </p>
                      </div>
                    </div>

                    {/* Tombol Aksi Peminjaman Buku */}
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      {buku.stok > 0 ? (
                        <button
                          onClick={() => setSelectedBookToBorrow(buku)}
                          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/25 transition-all flex items-center justify-center space-x-2 group focus-visible:ring-2 focus-visible:ring-blue-500"
                        >
                          <BookmarkPlus className="w-4 h-4 transition-transform group-hover:scale-110" />
                          <span>Pinjam Buku Ini</span>
                        </button>
                      ) : (
                        <button
                          disabled
                          className="w-full py-2.5 px-4 bg-slate-100 text-slate-400 rounded-xl text-xs font-bold cursor-not-allowed border border-slate-200"
                        >
                          Stok Buku Habis
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-10 text-slate-500 text-xs">
                  Tidak ditemukan buku yang sesuai dengan pencarian Anda.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PEMINJAMAN SAYA */}
        {activeTab === 'pinjaman_saya' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
              <h3 className="font-extrabold text-slate-900 text-sm mb-4 flex items-center space-x-2">
                <BookCheck className="w-5 h-5 text-blue-600" />
                <span>Daftar Buku Yang Sedang Anda Pinjam ({activeLoans.length})</span>
              </h3>

              {activeLoans.length > 0 ? (
                <div className="space-y-3">
                  {activeLoans.map((loan) => (
                    <div 
                      key={loan.kd_peminjaman}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-mono text-xs font-bold text-slate-800">[{loan.kd_peminjaman}]</span>
                          {loan.status === 'Terlambat' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-900 animate-pulse border border-rose-300">
                              Terlambat
                            </span>
                          ) : (() => {
                            const days = getDaysUntilDue(loan.tgl_jatuh_tempo);
                            if (days === 0) {
                              return (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-900 border border-orange-300 animate-pulse">
                                  🚨 Jatuh Tempo Hari Ini!
                                </span>
                              );
                            } else if (days > 0 && days <= 2) {
                              return (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                                  ⏳ Segera Kembalikan (H-{days})
                                </span>
                              );
                            }
                            return (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-200">
                                Dipinjam
                              </span>
                            );
                          })()}
                        </div>
                        <h4 className="font-extrabold text-slate-900 text-sm">{loan.buku?.judul_buku || loan.kd_buku}</h4>
                        <div className="flex flex-wrap gap-4 text-xs text-slate-600 mt-1">
                          <span>Dipinjam: <strong className="text-slate-800">{formatDateIndo(loan.tgl_peminjaman)}</strong></span>
                          <span>Batas Kembali: <strong className="text-rose-700 font-bold">{formatDateIndo(loan.tgl_jatuh_tempo)}</strong></span>
                          {(loan.perpanjangan_count || 0) > 0 && (
                            <span className="text-blue-600 font-semibold">(Telah diperpanjang 1x)</span>
                          )}
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
                        {loan.status === 'Terlambat' ? (
                          <div className="flex flex-col items-end gap-1.5">
                            {(() => {
                              const tempo = new Date(loan.tgl_jatuh_tempo || loan.tgl_peminjaman);
                              const today = new Date();
                              const lateDays = Math.max(1, Math.ceil((today - tempo) / 86400000));
                              const dendaEst = lateDays * 1000;
                              return (
                                <>
                                  <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 font-mono">
                                    Denda: Rp {dendaEst.toLocaleString('id-ID')} ({lateDays} Hari)
                                  </span>
                                  <button
                                    onClick={() => setSelectedGatewayLoan({ ...loan, denda: dendaEst, nama_siswa: user.nama })}
                                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-500/20 transition-all"
                                    title="Bayar Denda via QRIS atau Virtual Account"
                                  >
                                    <CreditCard className="w-3.5 h-3.5" />
                                    <span>Bayar Denda via Gateway</span>
                                  </button>
                                </>
                              );
                            })()}
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-slate-900">Masa Pinjam Aktif</span>
                        )}

                        {loan.status === 'Dipinjam' && (loan.perpanjangan_count || 0) < 1 && (
                          <button
                            onClick={() => handleExtendLoanSiswa(loan)}
                            disabled={extendingId === loan.kd_peminjaman}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/20 transition-all focus-visible:ring-2 focus-visible:ring-blue-500"
                          >
                            <span>
                              {extendingId === loan.kd_peminjaman 
                                ? 'Memproses...' 
                                : extensionFee > 0 
                                  ? `+ Perpanjang (+7 Hari) • Rp ${extensionFee.toLocaleString('id-ID')}` 
                                  : '+ Perpanjang (+7 Hari)'}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-500 text-xs">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600 mb-2" />
                  <p className="font-semibold">Anda sedang tidak memiliki pinjaman buku yang aktif.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modal Pinjam Buku */}
      <Modal
        isOpen={Boolean(selectedBookToBorrow)}
        onClose={() => setSelectedBookToBorrow(null)}
        title="Konfirmasi Peminjaman Buku"
        maxWidth="max-w-md"
      >
        {selectedBookToBorrow && (
          <form onSubmit={handleConfirmBorrow} className="space-y-4 text-xs">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-blue-950">
              <span className="px-2 py-0.5 rounded-md bg-white font-mono text-[10px] font-bold border border-blue-200 text-blue-700">
                {selectedBookToBorrow.kd_buku}
              </span>
              <h4 className="font-extrabold text-sm text-slate-900 mt-2 leading-snug">
                {selectedBookToBorrow.judul_buku}
              </h4>
              <p className="text-xs text-slate-700 mt-1 font-medium">Penulis: {selectedBookToBorrow.pengarang}</p>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Pilih Durasi Peminjaman</label>
              <select
                value={borrowDuration}
                onChange={(e) => setBorrowDuration(parseInt(e.target.value))}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/25"
              >
                <option value={7}>7 Hari (Standar Perpustakaan Sekolah)</option>
                <option value={3}>3 Hari</option>
                <option value={14}>14 Hari (Khusus Tugas Belajar)</option>
              </select>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedBookToBorrow(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-bold"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={borrowing}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-600/25 flex items-center space-x-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{borrowing ? 'Menyimpan...' : 'Konfirmasi Pinjam Sekarang'}</span>
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Modal Cetak Kartu Perpustakaan Resmi */}
      <KartuPerpusModal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        member={user}
      />

      {/* Modal Edit Profil & Foto Siswa */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        user={user}
        onSave={(updated) => {
          if (onUpdateUser) onUpdateUser(updated);
          setFeedbackToast('Profil & foto Anda berhasil diperbarui!');
          setTimeout(() => setFeedbackToast(''), 4000);
        }}
      />

      {/* Modal Payment Gateway Interaktif Siswa */}
      <PaymentGatewayModal
        isOpen={Boolean(selectedGatewayLoan)}
        onClose={() => setSelectedGatewayLoan(null)}
        data={selectedGatewayLoan}
        onSuccess={async (result) => {
          if (selectedGatewayLoan?.isPerpanjang) {
            try {
              const res = await api.perpanjangPeminjaman(selectedGatewayLoan.kd_peminjaman, {
                biaya_perpanjangan: result.nominal,
                metode_pembayaran: result.metode_pembayaran,
                id_transaksi: result.order_id
              });
              setFeedbackToast(res.message || 'Masa pinjam berhasil diperpanjang +7 hari!');
              setTimeout(() => setFeedbackToast(''), 5500);
              loadData();
            } catch (err) {
              alert('Gagal memperpanjang: ' + (err.response?.data?.message || err.message));
            }
          } else {
            setFeedbackToast(`Pembayaran denda sebesar Rp ${(result.nominal || 0).toLocaleString('id-ID')} berhasil diverifikasi via ${result.metode_pembayaran}! Silakan serahkan buku ke loket.`);
            setTimeout(() => setFeedbackToast(''), 5500);
            loadData();
          }
        }}
      />
    </div>
  );
}
