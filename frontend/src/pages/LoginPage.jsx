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
  Sparkle
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

  // 2. Akun Demo Mahasiswa / Siswa
  const [studentList, setStudentList] = useState([
    { username: '2024001', pass: 'siswa123', nama: 'Ahmad Fauzi', kelas: 'Kelas XI IPA 1' },
    { username: '2024002', pass: 'siswa123', nama: 'Siti Aisyah', kelas: 'Kelas XII IPA 2' },
    { username: '2024003', pass: 'siswa123', nama: 'Rizky Ramadhan', kelas: 'Kelas X IPS 1' },
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

  // Submit Handler: LOGIN
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (role === 'petugas') {
        const found = officialPetugas.find(p => p.username === username);
        if (found) {
          onLogin({
            type: 'petugas',
            username: found.username,
            nama: found.nama,
            role: found.role,
            roleCode: found.roleCode || (found.username === 'admin' ? 'kepala_perpus' : found.username === 'kepsek' ? 'kepala_sekolah' : 'petugas_sirkulasi'),
            instansi: 'SMA Muhammadiyah Pekalongan'
          });
        } else {
          setError('Kredensial Petugas tidak valid. Silakan klik salah satu akun resmi di bawah.');
          setLoading(false);
        }
      } else {
        const found = studentList.find(s => s.username === username);
        if (found) {
          onLogin({
            type: 'siswa',
            nisn: found.username,
            nama: found.nama,
            kelas: found.kelas,
            instansi: 'SMA Muhammadiyah Pekalongan'
          });
        } else {
          setError('NIM / NISN mahasiswa tidak terdaftar. Silakan buat akun baru melalui tombol di bawah.');
          setLoading(false);
        }
      }
    }, 350);
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
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative overflow-y-auto overflow-x-hidden font-sans">
      {/* 3D Modern Library Background (Format Lanskap 16:9) */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-[1.02]"
        style={{ backgroundImage: `url('/library_3d_bg.jpg')` }}
      />

      {/* Dark Overlay Layer (Efek Transparan Gelap agar Teks & Card Terlihat Sangat Jelas) */}
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px]" />
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/75 to-slate-900/60" />

      {/* Ambient Lighting Glow Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Wrapper Utama Responsif: Desktop (2 Kolom berdampingan) & Mobile (1 Kolom terpusat) */}
      <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-8 xl:gap-14 relative z-10 py-4 my-auto">
        
        {/* ================= SISI KIRI (KHUSUS DESKTOP): BRANDING & INFORMASI PERPUSTAKAAN ================= */}
        <div className="hidden lg:flex flex-col flex-1 text-white space-y-6 max-w-xl animate-fade-in">
          {/* Badge Instansi & Akreditasi */}
          <div className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-full bg-slate-900/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold backdrop-blur-md w-fit shadow-lg shadow-emerald-950/40">
            <School className="w-4 h-4 text-emerald-400" />
            <span>SMA Muhammadiyah 1 Pekalongan • Lampung Timur</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>

          {/* Heading Utama */}
          <div className="space-y-3">
            <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight leading-tight text-white drop-shadow-md">
              Sistem Otomasi & <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">
                Perpustakaan Digital Terpadu
              </span>
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Pusat khazanah literatur digital, sirkulasi peminjaman mandiri, perpanjangan masa pinjam fleksibel, dan integrasi pembayaran denda multi-channel untuk mendukung kemajuan literasi sekolah.
            </p>
          </div>

          {/* Kartu Fitur Unggulan */}
          <div className="grid grid-cols-1 gap-3.5">
            <div className="flex items-start space-x-3.5 p-3.5 rounded-2xl bg-slate-900/75 border border-slate-700/60 backdrop-blur-md hover:border-emerald-500/60 transition-all hover:bg-slate-900/90 shadow-md">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0 border border-emerald-500/30">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>Katalog Buku & Modul Pelajaran</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono">1.250+ Judul</span>
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Pencarian cepat buku paket Kurikulum Merdeka, karya sastra, modul olimpiade, hingga ensiklopedia ilmiah.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5 p-3.5 rounded-2xl bg-slate-900/75 border border-slate-700/60 backdrop-blur-md hover:border-teal-500/60 transition-all hover:bg-slate-900/90 shadow-md">
              <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400 shrink-0 border border-teal-500/30">
                <BookmarkCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>Sirkulasi & Perpanjangan Fleksibel</span>
                  <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full">Mandiri & Petugas</span>
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Layanan pinjam-kembali kilat dengan barcode, notifikasi jatuh tempo otomatis, serta opsi perpanjangan +3 hingga +30 hari.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5 p-3.5 rounded-2xl bg-slate-900/75 border border-slate-700/60 backdrop-blur-md hover:border-cyan-500/60 transition-all hover:bg-slate-900/90 shadow-md">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 shrink-0 border border-cyan-500/30">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>Multi-Channel Pembayaran QRIS & Tunai</span>
                  <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full">Real-time</span>
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Dukungan pembayaran denda resmi melalui QRIS nasional (BCA, Mandiri, BRI, DANA, GoPay) maupun loket kasir tunai.
                </p>
              </div>
            </div>
          </div>

          {/* Baris Statistik Cepat */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs backdrop-blur-sm">
            <div className="flex flex-col">
              <span className="text-xl font-black text-emerald-400">1.250+</span>
              <span className="text-slate-400 text-[11px] font-medium">Koleksi Terdaftar</span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="flex flex-col">
              <span className="text-xl font-black text-teal-400">450+</span>
              <span className="text-slate-400 text-[11px] font-medium">Siswa & Guru Aktif</span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="flex flex-col">
              <span className="text-xl font-black text-cyan-400">100%</span>
              <span className="text-slate-400 text-[11px] font-medium">Tercatat Digital</span>
            </div>
          </div>

          {/* Kutipan Edukatif */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-900/40 to-transparent border-l-4 border-emerald-500 text-xs text-slate-300 italic flex items-center space-x-2">
            <Sparkle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>"Iqra' — Bacalah dengan nama Tuhanmu. Membaca membuka jendela ilmu dan mencerahkan masa depan."</span>
          </div>
        </div>

        {/* ================= SISI KANAN: FORM CARD LOGIN & REGISTER ================= */}
        <div className="w-full max-w-md lg:max-w-[440px] shrink-0">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl shadow-black/70 border border-white/40 overflow-hidden relative z-10 animate-scale-up">
        {/* Brand Header */}
        <div className="bg-[#1E293B] p-6 text-center text-white relative">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 items-center justify-center text-white shadow-lg mb-3">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-lg font-extrabold tracking-wide">PERPUSTAKAAN DIGITAL</h1>
          <p className="text-xs text-emerald-400 font-semibold">SMA Muhammadiyah Pekalongan Lampung Timur</p>
        </div>

        {/* View Mode Switcher: MASUK vs BUAT AKUN BARU */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-1.5 gap-1.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setViewMode('login'); setError(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
              viewMode === 'login'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Masuk Akun</span>
          </button>

          <button
            type="button"
            onClick={() => { setViewMode('register'); setError(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
              viewMode === 'register'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-4 h-4 text-blue-600" />
            <span>+ Buat Akun Baru</span>
          </button>
        </div>

        {/* ===================== VIEW 1: FORM LOGIN ===================== */}
        {viewMode === 'login' && (
          <div>
            {/* Sub-Role Selector: Petugas vs Mahasiswa/Siswa */}
            <div className="grid grid-cols-2 p-2 gap-2 bg-slate-100/70 border-b border-slate-200/80">
              <button
                type="button"
                onClick={() => handleRoleSwitch('petugas')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
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
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                  role === 'siswa'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Portal Mahasiswa</span>
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4 text-center">
                <h2 className="text-base font-extrabold text-slate-900">
                  {role === 'petugas' ? 'Login Pengelola Perpustakaan' : 'Login Mahasiswa / Siswa'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  {role === 'petugas'
                    ? 'Kepala Perpustakaan & Petugas Peminjaman'
                    : 'Masukkan NIM / NISN akun anggota Anda'}
                </p>
              </div>

              {/* Feedback Alerts */}
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold animate-shake">
                  {error}
                </div>
              )}
              {successMsg && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                  {successMsg}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    {role === 'petugas' ? 'Username Petugas' : 'NIM / NISN Mahasiswa'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder={role === 'petugas' ? 'admin / petugas2' : 'Contoh: 2024001'}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-600 text-slate-900 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Kata Sandi (Password)</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-600 text-slate-900 font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2.5 px-4 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center space-x-2 ${
                    role === 'petugas'
                      ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25'
                      : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/25'
                  }`}
                >
                  <span>{loading ? 'Memverifikasi Akun...' : 'Masuk Sekarang'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* 1-Klik Pilihan Akun Resmi */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <p className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>1-Klik Akun Resmi Tersedia:</span>
                </p>

                {role === 'petugas' ? (
                  <div className="space-y-2">
                    {officialPetugas.map((item) => (
                      <button
                        key={item.username}
                        type="button"
                        onClick={() => setDemoAccount(item)}
                        className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 transition-all flex items-center justify-between group"
                      >
                        <div>
                          <p className="text-xs font-extrabold text-slate-900 group-hover:text-emerald-800">
                            {item.nama}
                          </p>
                          <p className="text-[10px] text-emerald-700 font-bold">{item.role}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{item.deskripsi}</p>
                        </div>
                        <span className="text-[10px] px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold group-hover:bg-emerald-600 group-hover:text-white transition-colors">
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
                        className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-blue-50 hover:border-blue-300 border border-slate-200 transition-all flex items-center justify-between group"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-900 group-hover:text-blue-800">{item.nama}</p>
                          <p className="text-[10px] text-slate-500 font-mono">NIM: {item.username} • {item.kelas}</p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-slate-300 text-slate-700 font-bold group-hover:bg-blue-600 group-hover:text-white">
                          Pilih
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===================== VIEW 2: FORM REGISTRASI AKUN BARU ===================== */}
        {viewMode === 'register' && (
          <div className="p-6">
            <div className="mb-4 text-center">
              <h2 className="text-base font-extrabold text-slate-900">
                Pendaftaran Anggota Mahasiswa Baru
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Buat akun perpustakaan baru untuk meminjam buku & akses katalog
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
                {error}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Nomor Induk Mahasiswa / Siswa (NIM / NISN)
                </label>
                <input
                  type="text"
                  required
                  value={regData.nisn}
                  onChange={(e) => setRegData({ ...regData, nisn: e.target.value })}
                  placeholder="Contoh: 2024005"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-600 text-slate-900 font-bold font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={regData.nama_lengkap}
                  onChange={(e) => setRegData({ ...regData, nama_lengkap: e.target.value })}
                  placeholder="Nama lengkap Anda..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-600 text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Program Studi / Kelas</label>
                <input
                  type="text"
                  required
                  value={regData.kelas}
                  onChange={(e) => setRegData({ ...regData, kelas: e.target.value })}
                  placeholder="Contoh: Pend. Biologi / Kelas XI IPA 3"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-600 text-slate-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Kata Sandi</label>
                  <input
                    type="password"
                    required
                    value={regData.password}
                    onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                    placeholder="Min 4 karakter"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-600 text-slate-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Konfirmasi Sandi</label>
                  <input
                    type="password"
                    required
                    value={regData.confirmPassword}
                    onChange={(e) => setRegData({ ...regData, confirmPassword: e.target.value })}
                    placeholder="Ulangi sandi"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-600 text-slate-900 font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-600/25 transition-all flex items-center justify-center space-x-2"
              >
                <span>{loading ? 'Mendaftarkan Akun...' : 'Daftar Akun Anggota'}</span>
                <UserPlus className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-4 text-center">
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
      </div>

      <p className="text-slate-400 text-xs mt-4 pb-2 text-center relative z-10 font-medium">
        © 2026 Perpustakaan SMA Muhammadiyah 1 Pekalongan, Lampung Timur • Sistem Informasi Manajemen Perpustakaan
      </p>
    </div>
  );
}
