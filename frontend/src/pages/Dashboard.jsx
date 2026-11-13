import React, { useEffect, useState } from 'react';
import { 
  BookOpen, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Coins, 
  Plus, 
  FileText, 
  AlertCircle, 
  Clock, 
  CheckCircle2,
  RefreshCw,
  Building,
  ShieldCheck,
  UserCheck,
  Settings,
  Sparkles,
  Award
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { StatCardSkeleton, TableRowSkeleton } from '../components/Skeleton';
import { api, formatDateIndo } from '../api/axios';

export default function Dashboard({ onNavigate, user }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const roleCode = user?.roleCode || (user?.username === 'admin' ? 'kepala_perpus' : user?.username === 'kepsek' ? 'kepala_sekolah' : 'petugas_sirkulasi');

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.getDashboardStats();
      if (res && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num || 0);
  };

  return (
    <div className="space-y-6">
      {/* =========================================================================
          ROLE-BASED WELCOME BANNER
         ========================================================================= */}
      {roleCode === 'kepala_sekolah' ? (
        // BANNER KHUSUS: KEPALA SEKOLAH (SUPERVISOR EKSEKUTIF)
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-purple-500/20">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-purple-500/25 text-purple-300 rounded-full text-xs font-bold mb-3 border border-purple-500/40">
              <Building className="w-3.5 h-3.5" />
              <span>Portal Pengawasan Eksekutif • Kepala Sekolah</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Selamat Datang, Bapak {user?.nama || 'Ahmad Marzuki, S.Pd.I'}
            </h2>
            <p className="text-purple-200/90 text-xs sm:text-sm mt-2 leading-relaxed">
              Memantau perkembangan literasi akademik, efektivitas sirkulasi peminjaman buku para siswa, serta verifikasi pengesahan berkas laporan resmi perpustakaan SMA Muhammadiyah Pekalongan.
            </p>

            {/* Quick Action Buttons Kepala Sekolah */}
            <div className="flex flex-wrap gap-2.5 sm:gap-3 mt-6">
              <button
                onClick={() => onNavigate('laporan')}
                className="inline-flex items-center space-x-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-600/30 transition-all focus-visible:ring-2 focus-visible:ring-white"
              >
                <FileText className="w-4 h-4" />
                <span>📑 Tinjau & Cetak Laporan Resmi</span>
              </button>
              <button
                onClick={() => onNavigate('buku')}
                className="inline-flex items-center space-x-2 px-4 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all border border-purple-500/30 focus-visible:ring-2 focus-visible:ring-white"
              >
                <BookOpen className="w-4 h-4 text-purple-300" />
                <span>🔍 Audit Koleksi Buku Sekolah</span>
              </button>
              <button
                onClick={() => onNavigate('peminjaman')}
                className="inline-flex items-center space-x-2 px-4 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all border border-purple-500/30 focus-visible:ring-2 focus-visible:ring-white"
              >
                <ArrowUpRight className="w-4 h-4 text-amber-300" />
                <span>👥 Pantau Sirkulasi Siswa</span>
              </button>
            </div>
          </div>
        </div>
      ) : roleCode === 'petugas_sirkulasi' ? (
        // BANNER KHUSUS: PETUGAS SIRKULASI (FRONT-DESK OPERASIONAL)
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-sky-500/20">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-sky-500/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-sky-500/25 text-sky-300 rounded-full text-xs font-bold mb-3 border border-sky-500/40">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Loket Sirkulasi & Pelayanan Siswa</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Selamat Datang, Bapak {user?.nama || 'Samsul Arifin, S.Pd'}
            </h2>
            <p className="text-sky-200/90 text-xs sm:text-sm mt-2 leading-relaxed">
              Fokus pada pelayanan sirkulasi loket harian: peminjaman buku oleh siswa, penerimaan buku kembali, kalkulasi otomatis denda keterlambatan, dan pencetakan bukti kwitansi resmi.
            </p>

            {/* Quick Action Buttons Petugas Sirkulasi */}
            <div className="flex flex-wrap gap-2.5 sm:gap-3 mt-6">
              <button
                onClick={() => onNavigate('peminjaman')}
                className="inline-flex items-center space-x-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-sky-600/30 transition-all focus-visible:ring-2 focus-visible:ring-white"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>+ Layani Peminjaman Siswa</span>
              </button>
              <button
                onClick={() => onNavigate('pengembalian')}
                className="inline-flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all focus-visible:ring-2 focus-visible:ring-white"
              >
                <ArrowDownLeft className="w-4 h-4" />
                <span>+ Proses Pengembalian & Denda</span>
              </button>
              <button
                onClick={() => onNavigate('buku')}
                className="inline-flex items-center space-x-2 px-4 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all border border-sky-500/30 focus-visible:ring-2 focus-visible:ring-white"
              >
                <BookOpen className="w-4 h-4 text-sky-300" />
                <span>🔍 Cek Posisi & Stok di Rak</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        // BANNER KHUSUS: KEPALA PERPUSTAKAAN (SUPER ADMIN / FULL ACCESS)
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-500/20">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-500/25 text-emerald-300 rounded-full text-xs font-bold mb-3 border border-emerald-500/40">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Panel Manajemen Kepala Perpustakaan • Administrator Penuh</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Selamat Datang, Ibu {user?.nama || 'Siti Farida, A.Md'}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
              SMA Muhammadiyah Pekalongan, Lampung Timur. Kelola seluruh katalog master koleksi buku, pengawasan sirkulasi harian, rekonsiliasi denda kas, penataan akun staf, dan penerbitan laporan resmi.
            </p>

            {/* Quick Action Buttons Kepala Perpus */}
            <div className="flex flex-wrap gap-2.5 sm:gap-3 mt-6">
              <button
                onClick={() => onNavigate('buku')}
                className="inline-flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all focus-visible:ring-2 focus-visible:ring-white"
              >
                <Plus className="w-4 h-4" />
                <span>+ Tambah Koleksi Buku</span>
              </button>
              <button
                onClick={() => onNavigate('laporan')}
                className="inline-flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition-all focus-visible:ring-2 focus-visible:ring-white"
              >
                <FileText className="w-4 h-4" />
                <span>📑 Cetak Laporan Resmi</span>
              </button>
              <button
                onClick={() => onNavigate('pengaturan')}
                className="inline-flex items-center space-x-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all border border-slate-700 focus-visible:ring-2 focus-visible:ring-white"
              >
                <Settings className="w-4 h-4 text-emerald-400" />
                <span>⚙️ Pengaturan Sistem & Staf</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          4 KARTU STATISTIK (DAPAT DISESUAIKAN PER PERAN)
         ========================================================================= */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <StatCard
            title="Total Judul Buku"
            value={`${stats?.total_buku || 0} Judul`}
            subtitle={`Total fisik: ${stats?.total_stok || 0} eksemplar`}
            icon={BookOpen}
            color="emerald"
          />
          <StatCard
            title="Peminjaman Aktif"
            value={`${stats?.peminjaman_aktif || 0} Transaksi`}
            subtitle="Buku sedang dibaca siswa"
            icon={ArrowUpRight}
            color="amber"
          />
          <StatCard
            title="Pengembalian Hari Ini"
            value={`${stats?.pengembalian_hari_ini || 0} Buku`}
            subtitle="Tercatat dalam sistem"
            icon={ArrowDownLeft}
            color="blue"
          />
          <StatCard
            title={roleCode === 'kepala_sekolah' ? 'Kas Denda Tertib' : 'Total Denda Kas'}
            value={formatRupiah(stats?.total_denda)}
            subtitle="Dana denda keterlambatan"
            icon={Coins}
            color="rose"
          />
        </div>
      )}

      {/* =========================================================================
          ANALYTICS CHART: TREN PEMINJAMAN & DISTRIBUSI MINAT BACA
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grafik Batang: Tren Peminjaman 5 Bulan Terakhir */}
        <div className="lg:col-span-2 bg-slate-900/75 backdrop-blur-md rounded-3xl border border-slate-700/60 shadow-xl p-5 sm:p-6 text-white transform-gpu">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-extrabold text-white text-sm sm:text-base flex items-center space-x-2">
                <span>Grafik Tren Sirkulasi Peminjaman Semester Berjalan</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Frekuensi sirkulasi buku per bulan di SMA Muhammadiyah Pekalongan
              </p>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              Semester Ganjil 2026/2027
            </span>
          </div>

          {/* SVG Responsive Bar Chart */}
          <div className="pt-4 pb-2">
            <div className="grid grid-cols-5 gap-3 items-end h-44 sm:h-52 px-2 border-b border-slate-800">
              {[
                { month: 'Juli', count: 28, height: '38%', label: '28 Pinjam' },
                { month: 'Agustus', count: 46, height: '60%', label: '46 Pinjam' },
                { month: 'September', count: 68, height: '88%', label: '68 Pinjam' },
                { month: 'Oktober', count: 76, height: '98%', label: '76 Pinjam (Puncak)' },
                { month: 'November', count: 52, height: '68%', label: '52 Pinjam (Aktif)' },
              ].map((bar, idx) => (
                <div key={bar.month} className="flex flex-col items-center h-full justify-end group">
                  <span className="text-[10px] font-bold text-slate-300 mb-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    {bar.count}
                  </span>
                  <div 
                    style={{ height: bar.height }} 
                    className={`w-full max-w-[48px] rounded-t-xl transition-all duration-300 group-hover:scale-105 shadow-sm ${
                      idx === 3 
                        ? 'bg-gradient-to-t from-emerald-600 to-teal-400 shadow-emerald-500/30' 
                        : idx === 4
                        ? 'bg-gradient-to-t from-blue-600 to-sky-400 shadow-blue-500/30'
                        : 'bg-gradient-to-t from-slate-600 to-slate-500'
                    }`}
                  />
                  <span className="text-[11px] font-bold text-slate-400 mt-2 font-mono">
                    {bar.month}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium pt-3 px-1">
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span>Bulan Kunjungan Tertinggi: <strong className="text-white">Oktober</strong></span>
              </span>
              <span className="font-semibold text-slate-300">Rata-rata: 54 buku/bulan</span>
            </div>
          </div>
        </div>

        {/* Distribusi Minat Baca Berdasarkan Kategori */}
        <div className="bg-slate-900/75 backdrop-blur-md rounded-3xl border border-slate-700/60 shadow-xl p-5 sm:p-6 flex flex-col justify-between text-white transform-gpu">
          <div>
            <div className="pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-extrabold text-white text-sm">Distribusi Minat Baca Siswa</h3>
              <p className="text-xs text-slate-400 mt-0.5">Proporsi subjek buku paling diminati</p>
            </div>

            <div className="space-y-3.5">
              {[
                { name: 'Sains & MIPA (Fisika, Matematika, Bio)', pct: 42, color: 'bg-emerald-500' },
                { name: 'Al-Islam & Kemuhammadiyahan', pct: 28, color: 'bg-blue-500' },
                { name: 'Bahasa & Sastra Indonesia', pct: 18, color: 'bg-amber-500' },
                { name: 'Sejarah & Sosial Humaniora', pct: 12, color: 'bg-purple-500' },
              ].map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-200">
                    <span className="truncate pr-2">{item.name}</span>
                    <span className="font-mono text-white">{item.pct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${item.color} transition-all duration-500`} 
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
            <span className="font-bold text-emerald-400">Analisis Pustakawan: </span>
            Koleksi buku rumpun MIPA dan Kemuhammadiyahan memiliki tingkat perputaran paling intensif menjelang ujian semester.
          </div>
        </div>
      </div>

      {/* =========================================================================
          TABEL AKTIVITAS TERBARU & CARD INFORMASI
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Aktivitas Peminjaman Terbaru */}
        <div className="lg:col-span-2 bg-slate-900/75 backdrop-blur-md rounded-3xl border border-slate-700/60 shadow-xl p-5 sm:p-6 text-white transform-gpu">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-extrabold text-white text-sm sm:text-base">
                {roleCode === 'kepala_sekolah' 
                  ? 'Audit Transaksi Sirkulasi Terkini' 
                  : roleCode === 'petugas_sirkulasi'
                  ? 'Antrean & Layanan Sirkulasi Terbaru'
                  : 'Aktivitas Transaksi Peminjaman Terbaru'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Pembaruan data asinkron langsung dari basis data MySQL
              </p>
            </div>
            <button
              onClick={loadData}
              className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500"
              title="Perbarui Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-3 rounded-l-xl">Kode Pinjam</th>
                  <th className="py-3 px-3">Nama Anggota</th>
                  <th className="py-3 px-3">Judul Buku</th>
                  <th className="py-3 px-3">Tgl Pinjam</th>
                  <th className="py-3 px-3 rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-medium text-slate-300">
                {loading ? (
                  <>
                    <TableRowSkeleton cols={5} />
                    <TableRowSkeleton cols={5} />
                    <TableRowSkeleton cols={5} />
                  </>
                ) : stats?.aktivitas_terbaru?.length > 0 ? (
                  stats.aktivitas_terbaru.map((item) => (
                    <tr key={item.kd_peminjaman} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-white">
                        {item.kd_peminjaman}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-200">
                        {item.nama_anggota}
                      </td>
                      <td className="py-3 px-3 max-w-[200px] truncate text-slate-300">
                        <div className="font-semibold text-white">{item.judul_buku || item.buku?.judul_buku || item.kd_buku}</div>
                        {item.buku?.lokasi_rak && (
                          <div className="text-[10px] text-emerald-400 font-mono">📍 {item.buku.lokasi_rak}</div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-400 font-medium whitespace-nowrap">
                        {formatDateIndo(item.tgl_peminjaman)}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            item.status === 'Dikembalikan'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : item.status === 'Terlambat'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      Belum ada transaksi peminjaman tercatat.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Panel Ringkasan Samping Sesuai Peran */}
        <div className="space-y-6">
          <div className="bg-slate-900/75 backdrop-blur-md rounded-3xl border border-slate-700/60 shadow-xl p-5 sm:p-6 text-white transform-gpu">
            <h3 className="font-extrabold text-white text-sm mb-3 flex items-center space-x-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>
                {roleCode === 'kepala_sekolah'
                  ? 'Kredensial Pengawas Sekolah'
                  : roleCode === 'petugas_sirkulasi'
                  ? 'Petugas Bertugas Hari Ini'
                  : 'Penanggung Jawab Perpustakaan'}
              </span>
            </h3>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Nama Resmi:</span>
                <span className="font-bold text-white">{user?.nama || 'Petugas'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Jabatan:</span>
                <span className="font-bold text-emerald-400">{user?.role || 'Petugas'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Username:</span>
                <span className="font-mono text-slate-300">{user?.username ? `@${user.username}` : '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Sekolah:</span>
                <span className="font-semibold text-slate-300">SMA Muhammadiyah Pekalongan</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status Akses:</span>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {roleCode === 'kepala_sekolah' ? 'Supervisory Access' : roleCode === 'petugas_sirkulasi' ? 'Front-Desk Access' : 'Super Admin Access'}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800">
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {roleCode === 'kepala_sekolah'
                  ? 'Sebagai Kepala Sekolah, Anda memiliki wewenang untuk memeriksa rekapitulasi data dan mengesahkan tanda tangan berkas laporan resmi akreditasi perpustakaan.'
                  : roleCode === 'petugas_sirkulasi'
                  ? 'Sebagai Petugas Sirkulasi, Anda melayani proses peminjaman buku para siswa, penerimaan buku kembali, dan pencetakan kwitansi denda.'
                  : 'Sebagai Kepala Perpustakaan, Anda memiliki wewenang penuh atas konfigurasi sistem, kebijakan denda harian, manajemen koleksi buku, dan staf perpustakaan.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}