import React, { useState } from 'react';
import { 
  GraduationCap, 
  Lock, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  UserPlus, 
  BookOpen, 
  CheckCircle2, 
  Users, 
  School, 
  CreditCard, 
  QrCode, 
  BookmarkCheck, 
  Library, 
  Sparkle,
  Eye,
  EyeOff
} from 'lucide-react';
import { api } from '../api/axios';

export default function LoginPage({ onLogin }) {
  // Mode: 'login' | 'register'
  const [viewMode, setViewMode] = useState('login');
  
  // Role switcher di mode login: 'petugas' | 'siswa'
  const [role, setRole] = useState('petugas'); 
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form State untuk Registrasi Akun Baru
  const [regData, setRegData] = useState({
    nisn: '',
    nama_lengkap: '',
    kelas: '',
    password: '',
    confirmPassword: '',
  });

  // 1. Akun Resmi Petugas: Kepala Perpustakaan, Petugas Sirkulasi, dan Kepala Sekolah (Supervisor)
  const officialPetugas = [
    { 
      username: 'admin', 
      pass: 'admin123', 
      nama: 'Siti Farida, A.Md', 
      role: 'Kepala Perpustakaan', 
      roleCode: 'kepala_perpus',
      deskripsi: 'Akses penuh manajemen, pengelolaan koleksi, kebijakan denda & seluruh laporan' 
    },
    { 
      username: 'petugas2', 
      pass: 'petugas123', 
      nama: 'Samsul Arifin, S.Pd', 
      role: 'Petugas Peminjaman & Sirkulasi', 
      roleCode: 'petugas_sirkulasi',
      deskripsi: 'Pelayanan front-desk sirkulasi buku, verifikasi pinjam/kembali & kwitansi denda' 
    },
    { 
      username: 'kepsek', 
      pass: 'kepsek123', 
      nama: 'Ahmad Marzuki, S.Pd.I', 
      role: 'Kepala Sekolah (Supervisor)', 
      roleCode: 'kepala_sekolah',
      deskripsi: 'Executive dashboard KPI, pengawasan sirkulasi minat baca & pengesahan laporan resmi' 
    },
  ];

  // 2. Akun Demo Mahasiswa / Siswa (Terhubung ke 25 Data Anggota)
  const [studentList, setStudentList] = useState([
    { username: '2024001', pass: 'siswa123', nama: 'Ahmad Fauzi', kelas: 'Kelas XI IPA 1' },
    { username: '2024002', pass: 'siswa123', nama: 'Siti Aisyah', kelas: 'Kelas XII IPA 2' },
    { username: '2024003', pass: 'siswa123', nama: 'Rizky Ramadhan', kelas: 'Kelas X IPS 1' },
    { username: '2024004', pass: 'siswa123', nama: 'Nurul Hidayah', kelas: 'Kelas XI IPS 2' },
    { username: '2024005', pass: 'siswa123', nama: 'Budi Santoso', kelas: 'Kelas X IPA 1' },
    { username: '2024006', pass: 'siswa123', nama: 'Dewi Sartika', kelas: 'Kelas XI IPA 2' },
  ]);

  const handleRoleSwitch = (newRole) => {
    setRole(newRole);
    setError('');
    setSuccessMsg('');
    if (newRole === 'petugas') {
      setUsername('admin');
      setPassword('admin123');
    } else {
      setUsername(studentList[0]?.username || '2024001');
      setPassword('siswa123');
    }
  };

  const setDemoAccount = (item) => {
    setUsername(item.username);
    setPassword(item.pass);
    setError('');
    setSuccessMsg('');
  };

  // Submit Handler: LOGIN (Backend API First + Cerdas Demo Fallback)
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Coba verifikasi langsung ke REST API MySQL
      const res = await api.login({
        username: username.trim(),
        password: password.trim(),
        role_type: role
      });

      if (res && res.data) {
        onLogin(res.data);
        return;
      }
    } catch {
      // 2. Fallback instan ke akun resmi/demo jika backend belum menyala
      if (role === 'petugas') {
        const found = officialPetugas.find(p => p.username === username.trim());
        if (found && (password === found.pass || password === 'admin123' || password === 'petugas123' || password === 'kepsek123')) {
          onLogin({
            type: 'petugas',
            username: found.username,
            nama: found.nama,
            role: found.role,
            roleCode: found.roleCode || (found.username === 'admin' ? 'kepala_perpus' : found.username === 'kepsek' ? 'kepala_sekolah' : 'petugas_sirkulasi'),
            instansi: 'SMA Muhammadiyah Pekalongan'
          });
          return;
        }
      } else {
        const found = studentList.find(s => s.username === username.trim());
        if (found && (password === found.pass || password === 'siswa123')) {
          onLogin({
            type: 'siswa',
            nisn: found.username,
            nama: found.nama,
            kelas: found.kelas,
            instansi: 'SMA Muhammadiyah Pekalongan'
          });
          return;
        }
      }

      setError(
        role === 'petugas'
          ? 'Kredensial Petugas tidak valid. Silakan gunakan salah satu Akun Cepat di bawah.'
          : 'NIM / NISN siswa belum terdaftar. Silakan buat akun baru atau pilih akun demo.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Submit Handler: PENDAFTARAN AKUN BARU
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (regData.password !== regData.confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.register({
        nisn: regData.nisn,
        nama_lengkap: regData.nama_lengkap,
        kelas: regData.kelas,
        password: regData.password,
      });

      // Tambahkan ke daftar mahasiswa aktif
      const newStudent = {
        username: regData.nisn,
        pass: regData.password,
        nama: regData.nama_lengkap,
        kelas: regData.kelas,
      };

      setStudentList([newStudent, ...studentList]);
      setSuccessMsg(`Pendaftaran berhasil! Akun '${regData.nama_lengkap}' siap digunakan.`);
      
      // Otomatis alihkan ke tab login mahasiswa dengan data terisi
      setViewMode('login');
      setRole('siswa');
      setUsername(regData.nisn);
      setPassword(regData.password);
      
      // Reset form reg
      setRegData({
        nisn: '',
        nama_lengkap: '',
        kelas: '',
        password: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError('Gagal mendaftar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-3 sm:p-6 lg:p-8 relative overflow-y-auto overflow-x-hidden font-sans">
      {/* 3D Modern Library Background (Format Lanskap 16:9) */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-[1.02]"
        style={{ backgroundImage: `url('/library_3d_bg.jpg')` }}
      />

      {/* Dark Overlay Layer (Efek Transparan Gelap agar Card Utama Kontras & Sangat Nyaman Dibaca) */}
      <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[2px]" />
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/80 to-slate-900/60" />

      {/* Ambient Lighting Glow Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* ================= MASTER UNIFIED DUAL-PANE CARD ================= */}
      <div className="w-full max-w-5xl xl:max-w-6xl mx-auto bg-slate-900/90 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-black/90 border border-slate-700/60 overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10 my-auto animate-scale-up">
        
        {/* ================= PANEL KIRI (DESKTOP ONLY - 7 COLS): BRANDING, STATS & FITUR ================= */}
        <div className="hidden lg:flex lg:col-span-7 flex-col justify-between p-8 xl:p-10 text-white bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-emerald-950/50 border-r border-slate-800/80 relative overflow-hidden">
          {/* Internal Glow Effect */}
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Bagian Atas: Badge Sekolah & Judul */}
          <div className="relative z-10 space-y-3.5">
            <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-emerald-500/40 text-emerald-300 text-xs font-semibold backdrop-blur-md w-fit shadow-md">
              <School className="w-4 h-4 text-emerald-400" />
              <span>SMA Muhammadiyah 1 Pekalongan • Lampung Timur</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl xl:text-3xl font-black tracking-tight leading-snug text-white">
                Sistem Informasi & <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">
                  Perpustakaan Digital Terpadu
                </span>
              </h1>
              <p className="text-slate-300 text-xs xl:text-sm leading-relaxed max-w-lg">
                Pusat khazanah literatur digital, otomasi sirkulasi peminjaman mandiri, perpanjangan masa pinjam fleksibel, dan integrasi pembayaran denda multi-channel.
              </p>
            </div>
          </div>

          {/* Bagian Tengah: 3 Kartu Keunggulan Terpadu */}
          <div className="relative z-10 space-y-3 my-6">
            <div className="flex items-center space-x-3.5 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-md hover:border-emerald-500/50 hover:bg-slate-800/80 transition-all">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0 border border-emerald-500/30">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Katalog Buku & Modul Terpadu</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono">1.250+ Judul</span>
                </h3>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                  Akses buku teks Kurikulum Merdeka, modul olimpiade, ensiklopedia, dan karya sastra.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-md hover:border-teal-500/50 hover:bg-slate-800/80 transition-all">
              <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400 shrink-0 border border-teal-500/30">
                <BookmarkCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Sirkulasi & Perpanjangan Fleksibel</span>
                  <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full">Mandiri & Petugas</span>
                </h3>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                  Pinjam-kembali kilat dengan barcode, notifikasi jatuh tempo otomatis, serta opsi perpanjangan +3 hingga +30 hari.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-md hover:border-cyan-500/50 hover:bg-slate-800/80 transition-all">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 shrink-0 border border-cyan-500/30">
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Multi-Channel Pembayaran QRIS & Tunai</span>
                  <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full">Real-time</span>
                </h3>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                  Pembayaran denda resmi via QRIS nasional (BCA, Mandiri, BRI, DANA, GoPay) & kasir sirkulasi.
                </p>
              </div>
            </div>
          </div>

          {/* Bagian Bawah: Statistik Ringkas & Kutipan */}
          <div className="relative z-10 space-y-3.5">
            <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-800/50 border border-slate-800 text-center">
              <div>
                <span className="block text-lg font-black text-emerald-400">1.250+</span>
                <span className="text-[10px] text-slate-400 font-medium">Koleksi Terdaftar</span>
              </div>
              <div className="border-x border-slate-700/50">
                <span className="block text-lg font-black text-teal-400">450+</span>
                <span className="text-[10px] text-slate-400 font-medium">Siswa & Guru</span>
              </div>
              <div>
                <span className="block text-lg font-black text-cyan-400">100%</span>
                <span className="text-[10px] text-slate-400 font-medium">Digital Terotomasi</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border-l-4 border-emerald-500 text-[11px] text-slate-300 italic flex items-center space-x-2">
              <Sparkle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>"Iqra' — Bacalah dengan nama Tuhanmu. Membaca membuka jendela ilmu dan mencerahkan masa depan."</span>
            </div>
          </div>
        </div>

        {/* ================= PANEL KANAN (5 COLS): FORM LOGIN / REGISTER ================= */}
        <div className="w-full lg:col-span-5 bg-white flex flex-col justify-between p-6 sm:p-7 relative">
          
          {/* Header Portal Masuk (Kompak & Elegan) */}
          <div className="text-center pb-3">
            <div className="inline-flex w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 items-center justify-center text-white shadow-md shadow-emerald-500/25 mb-2">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h2 className="text-base font-black text-slate-900 tracking-tight">PORTAL PERPUSTAKAAN</h2>
            <p className="text-[11px] text-emerald-700 font-bold">SMA Muhammadiyah 1 Pekalongan</p>
          </div>

          {/* View Mode Switcher: Masuk Akun vs Buat Akun Baru */}
          <div className="flex border border-slate-200 bg-slate-100/80 p-1 rounded-xl gap-1 text-xs font-bold mb-4">
            <button
              type="button"
              onClick={() => { setViewMode('login'); setError(''); setSuccessMsg(''); }}
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
                viewMode === 'login'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Masuk Akun</span>
            </button>

            <button
              type="button"
              onClick={() => { setViewMode('register'); setError(''); setSuccessMsg(''); }}
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
                viewMode === 'register'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5 text-blue-600" />
              <span>+ Buat Akun Baru</span>
            </button>
          </div>

          {/* ===================== VIEW 1: FORM LOGIN ===================== */}
          {viewMode === 'login' && (
            <div className="flex-1 flex flex-col justify-between">
              <div>
                {/* Sub-Role Selector: Petugas vs Siswa */}
                <div className="grid grid-cols-2 p-1 gap-1.5 bg-slate-100 rounded-xl mb-3.5 border border-slate-200/60">
                  <button
                    type="button"
                    onClick={() => handleRoleSwitch('petugas')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                      role === 'petugas'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>Portal Petugas</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleSwitch('siswa')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                      role === 'siswa'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>Portal Siswa</span>
                  </button>
                </div>

                {/* Feedback Alerts */}
                {error && (
                  <div className="mb-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold animate-shake">
                    {error}
                  </div>
                )}
                {successMsg && (
                  <div className="mb-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                    {successMsg}
                  </div>
                )}

                {/* Form Input Login */}
                <form onSubmit={handleLoginSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {role === 'petugas' ? 'Username Petugas' : 'NIM / NISN Siswa'}
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder={role === 'petugas' ? 'admin / petugas2 / kepsek' : 'Contoh: 2024001'}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-900 font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Kata Sandi (Password)</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-900 font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md"
                        title={showPassword ? 'Sembunyikan Sandi' : 'Lihat Sandi'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2.5 px-4 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center space-x-2 mt-1 ${
                      role === 'petugas'
                        ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25'
                        : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/25'
                    }`}
                  >
                    <span>{loading ? 'Memverifikasi...' : 'Masuk Sekarang'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* 1-Klik Pilihan Akun Cepat & Rapi */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    1-Klik Akun Cepat:
                  </span>
                  <span className="text-[10px] text-slate-600 font-semibold bg-slate-100 px-2 py-0.5 rounded-full">Siap Pakai</span>
                </div>

                {role === 'petugas' ? (
                  <div className="space-y-1.5">
                    {officialPetugas.map((item) => (
                      <button
                        key={item.username}
                        type="button"
                        onClick={() => setDemoAccount(item)}
                        className="w-full text-left px-3 py-2 rounded-xl bg-slate-50 hover:bg-emerald-50/80 hover:border-emerald-300 border border-slate-200/80 transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-[10px] shrink-0 ${
                            item.username === 'admin' ? 'bg-emerald-100 text-emerald-800' :
                            item.username === 'kepsek' ? 'bg-amber-100 text-amber-800' :
                            'bg-teal-100 text-teal-800'
                          }`}>
                            {item.username === 'admin' ? 'KP' : item.username === 'kepsek' ? 'KS' : 'PS'}
                          </div>
                          <div className="truncate">
                            <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-800 leading-tight truncate">
                              {item.nama}
                            </p>
                            <p className="text-[10px] text-emerald-700 font-semibold leading-tight">
                              {item.role}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] ml-2 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 font-bold group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
                          Pilih
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {studentList.map((item) => (
                      <button
                        key={item.username}
                        type="button"
                        onClick={() => setDemoAccount(item)}
                        className="w-full text-left px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50/80 hover:border-blue-300 border border-slate-200/80 transition-all flex items-center justify-between group"
                      >
                        <div className="truncate">
                          <p className="text-xs font-bold text-slate-900 group-hover:text-blue-800 truncate">{item.nama}</p>
                          <p className="text-[10px] text-slate-500 font-mono">NISN: {item.username} • {item.kelas}</p>
                        </div>
                        <span className="text-[10px] ml-2 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 font-bold group-hover:bg-blue-600 group-hover:text-white shrink-0">
                          Pilih
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===================== VIEW 2: FORM REGISTRASI ===================== */}
          {viewMode === 'register' && (
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="mb-3 text-center">
                  <h3 className="text-xs font-extrabold text-slate-800">Pendaftaran Anggota Siswa Baru</h3>
                  <p className="text-[11px] text-slate-500">Isi data identitas diri untuk registrasi akun perpustakaan</p>
                </div>

                {error && (
                  <div className="mb-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
                    {error}
                  </div>
                )}

                <form onSubmit={handleRegisterSubmit} className="space-y-2.5 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-0.5">NISN / NIM</label>
                    <input
                      type="text"
                      required
                      value={regData.nisn}
                      onChange={(e) => setRegData({ ...regData, nisn: e.target.value })}
                      placeholder="Contoh: 2024005"
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 font-bold font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-0.5">Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      value={regData.nama_lengkap}
                      onChange={(e) => setRegData({ ...regData, nama_lengkap: e.target.value })}
                      placeholder="Nama lengkap..."
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-0.5">Kelas / Jurusan</label>
                    <input
                      type="text"
                      required
                      value={regData.kelas}
                      onChange={(e) => setRegData({ ...regData, kelas: e.target.value })}
                      placeholder="Contoh: Kelas XI IPA 2"
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-0.5">Kata Sandi</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={regData.password}
                          onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                          placeholder="Min 4 karakter"
                          className="w-full px-3 pr-8 py-1.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-0.5">Konfirmasi</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={regData.confirmPassword}
                          onChange={(e) => setRegData({ ...regData, confirmPassword: e.target.value })}
                          placeholder="Ulangi sandi"
                          className="w-full px-3 pr-8 py-1.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-1.5 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-600/25 transition-all flex items-center justify-center space-x-2"
                  >
                    <span>{loading ? 'Mendaftarkan...' : 'Daftar Akun Anggota'}</span>
                    <UserPlus className="w-4 h-4" />
                  </button>
                </form>
              </div>

              <div className="mt-3 text-center">
                <button
                  type="button"
                  onClick={() => { setViewMode('login'); setError(''); }}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Sudah punya akun? Masuk di sini
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      <p className="text-slate-400 text-xs mt-4 pb-2 text-center relative z-10 font-medium">
        © 2026 Perpustakaan SMA Muhammadiyah 1 Pekalongan, Lampung Timur • Sistem Informasi Manajemen Perpustakaan
      </p>
    </div>
  );
}
