import React, { useState, useEffect } from 'react';
import { Settings, Shield, User, Database, CheckCircle2, Lock, Users, ShieldCheck, UserCheck, Building, Loader2 } from 'lucide-react';
import { api } from '../api/axios';

export default function PengaturanPage({ showNotification, user }) {
  const roleCode = user?.roleCode || (user?.username === 'admin' ? 'kepala_perpus' : user?.username === 'kepsek' ? 'kepala_sekolah' : 'petugas_sirkulasi');
  const [tarifDenda, setTarifDenda] = useState(1000);
  const [durasiPinjam, setDurasiPinjam] = useState(7);
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

  // Jika bukan Kepala Perpustakaan (Super Admin), batasi akses ke pengaturan sistem
  if (roleCode !== 'kepala_perpus') {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-sm">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900">Akses Terbatas: Khusus Kepala Perpustakaan</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          Anda sedang login sebagai <strong className="text-slate-800">{user?.nama || 'Petugas'} ({user?.role || 'Staf'})</strong>.
          Menu konfigurasi SOP peminjaman, tarif denda, dan otorisasi staf perpustakaan merupakan kewenangan mutlak Kepala Perpustakaan SMA Muhammadiyah Pekalongan.
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
        biaya_perpanjangan: Number(biayaPerpanjangan)
      });
      setSaved(true);
      showNotification('Konfigurasi tarif denda, biaya perpanjangan & SOP sirkulasi berhasil disimpan ke MySQL!', 'success');
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
      scope: 'Pengelolaan Penuh, Koleksi Buku, Laporan & Staf',
      icon: ShieldCheck,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200'
    },
    {
      nama: 'Samsul Arifin, S.Pd',
      username: 'petugas2',
      role: 'Petugas Sirkulasi',
      roleBadge: 'Frontdesk Service',
      scope: 'Pelayanan Peminjaman, Pengembalian & Cetak Kwitansi Denda',
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
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
          <Settings className="w-5 h-5 text-emerald-600" />
          <span>Pengaturan Sistem & Manajemen Staf Perpustakaan</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Konfigurasi parameter sirkulasi buku, besaran denda harian, dan otorisasi hak akses staf perpustakaan
        </p>
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
              <span className="font-semibold text-slate-800">SMA Muhammadiyah</span>
            </div>
            <div className="flex justify-between">
              <span>Wilayah:</span>
              <span className="font-semibold text-slate-800">Pekalongan, Lam-Tim</span>
            </div>
          </div>
        </div>

        {/* Form Parameter Sirkulasi */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center space-x-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Parameter Kebijakan & SOP Sirkulasi Buku</span>
          </h3>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Batas Waktu Standar Peminjaman (Hari)
              </label>
              <input
                type="number"
                min={1}
                max={30}
                value={durasiPinjam}
                onChange={(e) => setDurasiPinjam(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold text-slate-900"
              />
              <p className="text-[11px] text-slate-400 mt-1">Standar SOP perpustakaan: 7 hari kalender.</p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Besaran Tarif Denda Keterlambatan (Rp / Hari / Buku)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-500">Rp</span>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={tarifDenda}
                  onChange={(e) => setTarifDenda(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold text-slate-900"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Dapat diatur bebas mulai dari Rp 1 (1 perak), atau 0 jika tanpa denda.</p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Biaya Administrasi Perpanjangan Pinjaman (Rp / Perpanjangan)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-500">Rp</span>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={biayaPerpanjangan}
                  onChange={(e) => setBiayaPerpanjangan(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold text-slate-900"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Dapat diatur bebas mulai dari Rp 1 (1 perak) via QRIS / Tunai, atau 0 jika perpanjangan gratis.</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              {saved ? (
                <span className="text-emerald-600 font-semibold text-xs flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Pengaturan berhasil disimpan</span>
                </span>
              ) : <span></span>}

              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-xl font-bold shadow-md shadow-emerald-600/20 transition-all focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:opacity-50 flex items-center space-x-1.5"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{submitting ? 'Menyimpan...' : 'Simpan Konfigurasi'}</span>
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
          Struktur pemisahan wewenang operasional (Separation of Duties) pada Sistem Informasi Perpustakaan SMA Muhammadiyah Pekalongan:
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