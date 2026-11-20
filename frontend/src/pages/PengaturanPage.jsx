import React, { useState, useEffect } from 'react';
import { Settings, Shield, User, Database, CheckCircle2, Lock, Users, ShieldCheck, UserCheck, Building, Loader2, Calendar, Coins, Clock, Sparkles } from 'lucide-react';
import { api } from '../api/axios';

export default function PengaturanPage({ showNotification, user }) {
  const roleCode = user?.roleCode || (user?.username === 'admin' ? 'kepala_perpus' : user?.username === 'kepsek' ? 'kepala_sekolah' : 'petugas_sirkulasi');
  const [tarifDenda, setTarifDenda] = useState(1000);
  const [durasiPinjam, setDurasiPinjam] = useState(7);
  const [durasiPerpanjangan, setDurasiPerpanjangan] = useState(7);
  const [biayaPerpanjangan, setBiayaPerpanjangan] = useState(2000);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.getPengaturan();
        if (res && res.data) {
          if (res.data.tarif_denda !== undefined) setTarifDenda(res.data.tarif_denda);
          if (res.data.durasi_pinjam !== undefined) setDurasiPinjam(res.data.durasi_pinjam);
          if (res.data.durasi_perpanjangan !== undefined) setDurasiPerpanjangan(res.data.durasi_perpanjangan);
          if (res.data.biaya_perpanjangan !== undefined) setBiayaPerpanjangan(res.data.biaya_perpanjangan);
        }
      } catch (err) {
        console.error('Gagal mengambil pengaturan:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // Jika Siswa, batasi akses ke pengaturan sistem
  if (roleCode === 'siswa') {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-sm">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900">Akses Terbatas: Khusus Pengelola Perpustakaan</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          Menu konfigurasi SOP peminjaman, tarif denda, dan perpanjangan masa pinjam diperuntukkan bagi pengelola perpustakaan SMA Muhammadiyah 1 Pekalongan.
        </p>
      </div>
    );
  }

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.updatePengaturan({
        tarif_denda: Number(tarifDenda),
        durasi_pinjam: Number(durasiPinjam),
        durasi_perpanjangan: Number(durasiPerpanjangan),
        biaya_perpanjangan: Number(biayaPerpanjangan)
      });
      setSaved(true);
      showNotification('Konfigurasi tarif denda, durasi pinjam & perpanjangan berhasil disimpan ke MySQL!', 'success');
      setTimeout(() => setSaved(false), 3500);
    } catch (err) {
      showNotification('Gagal menyimpan konfigurasi: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const staffList = [
    {
      nama: 'Siti Farida, A.Md',
      username: 'admin',
      role: 'Kepala Perpustakaan',
      roleBadge: 'Super Administrator',
      scope: 'Pengelolaan Penuh, Koleksi Buku, Kebijakan Denda & Staf',
      icon: ShieldCheck,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200'
    },
    {
      nama: 'Samsul Arifin, S.Pd',
      username: 'petugas2',
      role: 'Petugas Sirkulasi',
      roleBadge: 'Frontdesk Service',
      scope: 'Pelayanan Peminjaman, Perpanjangan Masa Pinjam & Pengembalian',
      icon: UserCheck,
      color: 'bg-sky-50 text-sky-800 border-sky-200'
    },
    {
      nama: 'Ahmad Marzuki, S.Pd.I',
      username: 'kepsek',
      role: 'Kepala Sekolah',
      roleBadge: 'Executive Supervisor',
      scope: 'Monitoring Eksekutif Literasi, Audit & Pengesahan Laporan Resmi',
      icon: Building,
      color: 'bg-purple-50 text-purple-800 border-purple-200'
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
            <Settings className="w-5 h-5 text-emerald-600" />
            <span>Pengaturan Tarif Denda & Kebijakan Masa Pinjam</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Sesuaikan besaran tarif denda harian, durasi standar peminjaman, serta ketentuan perpanjangan masa pinjam buku
          </p>
        </div>
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold flex items-center space-x-1">
            <Shield className="w-3.5 h-3.5" />
            <span>Otorisasi: {user?.role || 'Pengelola Perpustakaan'}</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profil Petugas Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center text-center">
          {user?.foto ? (
            <img
              src={user.foto}
              alt={user.nama}
              className="w-20 h-20 rounded-2xl object-cover shadow-md ring-4 ring-emerald-500/30 mb-4"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-2xl shadow-md ring-4 ring-slate-100 mb-4">
              <User className="w-10 h-10 text-emerald-400" />
            </div>
          )}
          
          <h3 className="font-bold text-slate-900 text-base">{user?.nama || 'Siti Farida, A.Md'}</h3>
          <p className="text-xs text-emerald-700 font-bold mt-0.5">{user?.role || 'Kepala Perpustakaan'}</p>
          <span className="mt-3 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[11px] font-mono">
            Username: @{user?.username || 'admin'}
          </span>
          <div className="w-full border-t border-slate-100 mt-5 pt-4 text-left text-xs text-slate-500 space-y-2">
            <div className="flex justify-between">
              <span>Unit:</span>
              <span className="font-semibold text-slate-800">Perpustakaan SMA</span>
            </div>
            <div className="flex justify-between">
              <span>Sekolah:</span>
              <span className="font-semibold text-slate-800">SMA Muhammadiyah 1</span>
            </div>
            <div className="flex justify-between">
              <span>Wilayah:</span>
              <span className="font-semibold text-slate-800">Pekalongan, Lam-Tim</span>
            </div>
          </div>
        </div>

        {/* Form Parameter Sirkulasi & Denda */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center space-x-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Form Edit Besaran Denda & Perpanjangan Masa Pinjam</span>
          </h3>

          <form onSubmit={handleSave} className="space-y-5 text-xs">
            {/* 1. Besaran Tarif Denda */}
            <div className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/40">
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-slate-900 flex items-center space-x-1.5 text-xs">
                  <Coins className="w-4 h-4 text-amber-600" />
                  <span>Besaran Tarif Denda Keterlambatan (Rp / Hari / Buku)</span>
                </label>
                <span className="text-[11px] font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  Aktif: Rp {Number(tarifDenda).toLocaleString('id-ID')} / hari
                </span>
              </div>
              <div className="relative mt-2">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-500">Rp</span>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={tarifDenda}
                  onChange={(e) => setTarifDenda(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500 font-mono font-extrabold text-sm text-slate-900 shadow-sm"
                  required
                />
              </div>
              <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                <span className="text-[10px] text-slate-500 font-semibold mr-1">Pilihan Cepat:</span>
                {[0, 500, 1000, 2000, 5000, 10000].map((nominal) => (
                  <button
                    key={nominal}
                    type="button"
                    onClick={() => setTarifDenda(nominal)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                      Number(tarifDenda) === nominal
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {nominal === 0 ? 'Rp 0 (Bebas Denda)' : `Rp ${nominal.toLocaleString('id-ID')}`}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Batas Waktu Standar Peminjaman */}
            <div className="p-4 rounded-xl border border-blue-200/80 bg-blue-50/40">
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-slate-900 flex items-center space-x-1.5 text-xs">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>Batas Waktu Standar Peminjaman (Hari)</span>
                </label>
                <span className="text-[11px] font-mono font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                  {durasiPinjam} Hari Kalender
                </span>
              </div>
              <input
                type="number"
                min={1}
                max={60}
                value={durasiPinjam}
                onChange={(e) => setDurasiPinjam(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 font-mono font-extrabold text-sm text-slate-900 shadow-sm mt-2"
                required
              />
              <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                <span className="text-[10px] text-slate-500 font-semibold mr-1">Pilihan Cepat:</span>
                {[3, 7, 10, 14, 30].map((hari) => (
                  <button
                    key={hari}
                    type="button"
                    onClick={() => setDurasiPinjam(hari)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                      Number(durasiPinjam) === hari
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {hari} Hari {hari === 7 ? '(Standar)' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Durasi Tambahan Perpanjangan Masa Pinjam */}
            <div className="p-4 rounded-xl border border-indigo-200/80 bg-indigo-50/40">
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-slate-900 flex items-center space-x-1.5 text-xs">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>Durasi Tambahan Perpanjangan Masa Pinjam (Hari)</span>
                </label>
                <span className="text-[11px] font-mono font-bold text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded">
                  +{durasiPerpanjangan} Hari Tambahan
                </span>
              </div>
              <input
                type="number"
                min={1}
                max={60}
                value={durasiPerpanjangan}
                onChange={(e) => setDurasiPerpanjangan(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 font-mono font-extrabold text-sm text-slate-900 shadow-sm mt-2"
                required
              />
              <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                <span className="text-[10px] text-slate-500 font-semibold mr-1">Pilihan Cepat:</span>
                {[3, 7, 14, 21, 30].map((hari) => (
                  <button
                    key={hari}
                    type="button"
                    onClick={() => setDurasiPerpanjangan(hari)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                      Number(durasiPerpanjangan) === hari
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    +{hari} Hari {hari === 7 ? '(Standar)' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Biaya Administrasi Perpanjangan */}
            <div className="p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/40">
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-slate-900 flex items-center space-x-1.5 text-xs">
                  <Coins className="w-4 h-4 text-emerald-600" />
                  <span>Biaya Administrasi Perpanjangan Pinjaman (Rp / Perpanjangan)</span>
                </label>
                <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  {Number(biayaPerpanjangan) === 0 ? 'Gratis' : `Rp ${Number(biayaPerpanjangan).toLocaleString('id-ID')}`}
                </span>
              </div>
              <div className="relative mt-2">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-500">Rp</span>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={biayaPerpanjangan}
                  onChange={(e) => setBiayaPerpanjangan(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-500 font-mono font-extrabold text-sm text-slate-900 shadow-sm"
                  required
                />
              </div>
              <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                <span className="text-[10px] text-slate-500 font-semibold mr-1">Pilihan Cepat:</span>
                {[0, 1000, 2000, 5000].map((nominal) => (
                  <button
                    key={nominal}
                    type="button"
                    onClick={() => setBiayaPerpanjangan(nominal)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                      Number(biayaPerpanjangan) === nominal
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {nominal === 0 ? 'Rp 0 (Gratis)' : `Rp ${nominal.toLocaleString('id-ID')}`}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              {saved ? (
                <span className="text-emerald-600 font-semibold text-xs flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Pengaturan berhasil disimpan ke database MySQL</span>
                </span>
              ) : <span></span>}

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-xl font-bold shadow-md shadow-emerald-600/20 transition-all focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:opacity-50 flex items-center space-x-2 text-xs"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{submitting ? 'Menyimpan ke MySQL...' : 'Simpan Semua Konfigurasi'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Tabel Manajemen Hak Akses Staf Perpustakaan */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <h3 className="font-extrabold text-slate-900 text-sm mb-2 flex items-center space-x-2">
          <Users className="w-4 h-4 text-emerald-600" />
          <span>Daftar Akun & Pembagian Tugas Petugas Sistem</span>
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Struktur pemisahan wewenang operasional (Separation of Duties) pada Sistem Informasi Perpustakaan SMA Muhammadiyah 1 Pekalongan:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {staffList.map((staf) => {
            const Icon = staf.icon;
            return (
              <div 
                key={staf.username}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-300 transition-all"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-sm text-slate-800">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-extrabold text-slate-900 text-xs truncate">{staf.nama}</p>
                    <p className="text-[10px] text-slate-500 font-mono">@{staf.username}</p>
                  </div>
                </div>

                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border mb-2 ${staf.color}`}>
                  {staf.role}
                </span>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {staf.scope}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
