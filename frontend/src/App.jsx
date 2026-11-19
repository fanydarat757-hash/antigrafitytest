import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import BukuPage from './pages/BukuPage';
import PeminjamanPage from './pages/PeminjamanPage';
import PengembalianPage from './pages/PengembalianPage';
import LaporanPage from './pages/LaporanPage';
import PengaturanPage from './pages/PengaturanPage';
import LoginPage from './pages/LoginPage';
import SiswaPortal from './pages/SiswaPortal';
import PaymentGatewayModal from './components/PaymentGatewayModal';
import { api } from './api/axios';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function App() {
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const paramRole = urlParams.get('role');
  const paramTab = urlParams.get('tab');
  const paramModal = urlParams.get('modal');

  // User Session State: Default NULL atau dari URL param untuk keperluan preview/screenshot
  const [currentUser, setCurrentUser] = useState(() => {
    if (paramRole === 'admin') return { username: 'admin', role: 'admin', roleCode: 'kepala_perpus', nama: 'Siti Farida, A.Md' };
    if (paramRole === 'petugas') return { username: 'petugas2', role: 'petugas2', roleCode: 'petugas_sirkulasi', nama: 'Samsul Arifin, S.Pd' };
    if (paramRole === 'kepsek') return { username: 'kepsek', role: 'kepsek', roleCode: 'kepala_sekolah', nama: 'Ahmad Marzuki, S.Pd.I' };
    if (paramRole === 'siswa') return { type: 'siswa', nisn: '2024001', nama: 'Ahmad Fauzi (XI IPA 1)', kelas: 'XI IPA 1' };
    try {
      const saved = sessionStorage.getItem('perpus_active_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState(() => {
    if (paramTab) return paramTab;
    if (paramRole === 'kepsek') return 'laporan';
    if (paramRole === 'petugas' && !paramModal) return 'peminjaman';
    return 'dashboard';
  });
  const [demoGatewayOpen, setDemoGatewayOpen] = useState(paramModal === 'qris');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [preselectedLoanCode, setPreselectedLoanCode] = useState(null);

  // Notification Toast State
  const [toast, setToast] = useState(null);

  const showNotification = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const handleNavigateToReturn = (loanCode) => {
    setPreselectedLoanCode(loanCode);
    setActiveTab('pengembalian');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('perpus_active_user');
    setCurrentUser(null);
    showNotification('Anda telah berhasil keluar (logout).', 'info');
  };

  const handleLogin = (userObj) => {
    sessionStorage.setItem('perpus_active_user', JSON.stringify(userObj));
    setCurrentUser(userObj);
    setActiveTab('dashboard');
    showNotification(`Selamat datang, ${userObj.nama}!`, 'success');
  };

  const handleUpdateUser = async (updatedObj) => {
    sessionStorage.setItem('perpus_active_user', JSON.stringify(updatedObj));
    setCurrentUser(updatedObj);
    try {
      await api.updateProfile({
        type: updatedObj.type || (updatedObj.nisn ? 'siswa' : 'petugas'),
        username: updatedObj.username,
        nisn: updatedObj.nisn,
        nama: updatedObj.nama,
        kelas: updatedObj.kelas,
        foto: updatedObj.foto
      });
      showNotification('Profil & foto Anda berhasil diperbarui dan tersimpan permanen ke database!', 'success');
    } catch {
      showNotification('Profil & foto Anda berhasil diperbarui!', 'success');
    }
  };

  // 1. Tampilan jika belum login (Wajib melewati Gerbang Halaman Login)
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // 2. Tampilan jika login sebagai Siswa / Mahasiswa
  if (currentUser.type === 'siswa') {
    return (
      <SiswaPortal 
        user={currentUser} 
        onLogout={handleLogout} 
        onUpdateUser={handleUpdateUser}
      />
    );
  }

  // 3. Tampilan jika login sebagai Petugas Perpustakaan / Administrator
  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden font-sans text-slate-100 relative">
      {/* 3D Modern Library Fixed Responsive Background (GPU-Accelerated) */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none z-0 transform-gpu will-change-transform"
        style={{ backgroundImage: `url('/library_3d_bg.jpg')` }}
      />

      {/* Dark Ambient & Teal/Emerald Overlay for Optimal Contrast & Speed */}
      <div className="fixed inset-0 bg-slate-950/75 pointer-events-none z-0" />
      <div className="fixed inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-slate-950/75 pointer-events-none z-0" />
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed -bottom-40 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Sidebar Navigasi Responsif (Desktop & Mobile Drawer) */}
      <div className="no-print relative z-30">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={(tab) => {
            setPreselectedLoanCode(null);
            setActiveTab(tab);
          }} 
          collapsed={sidebarCollapsed} 
          setCollapsed={setSidebarCollapsed} 
          mobileOpen={mobileDrawerOpen}
          setMobileOpen={setMobileDrawerOpen} 
          user={currentUser}
        />
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative z-10">
        {/* Topbar dengan info profil petugas & tombol toggle mobile */}
        <div className="no-print">
          <Topbar 
            user={currentUser} 
            onLogout={handleLogout} 
            onOpenMobileMenu={() => setMobileDrawerOpen(true)}
            onUpdateUser={handleUpdateUser}
          />
        </div>

        {/* Dynamic Content Area (Responsif di HP, Tablet, Laptop, Desktop) */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-7">
          <div className="max-w-7xl mx-auto space-y-6">
            {activeTab === 'dashboard' && (
              <Dashboard onNavigate={setActiveTab} user={currentUser} />
            )}
            {activeTab === 'buku' && (
              <BukuPage showNotification={showNotification} user={currentUser} />
            )}
            {activeTab === 'peminjaman' && (
              <PeminjamanPage 
                showNotification={showNotification} 
                onNavigateToReturn={handleNavigateToReturn}
                user={currentUser}
              />
            )}
            {activeTab === 'pengembalian' && (
              <PengembalianPage 
                showNotification={showNotification} 
                initialLoanCode={preselectedLoanCode}
                user={currentUser}
              />
            )}
            {activeTab === 'laporan' && (
              <LaporanPage showNotification={showNotification} user={currentUser} />
            )}
            {activeTab === 'pengaturan' && (
              <PengaturanPage 
                showNotification={showNotification} 
                user={currentUser}
              />
            )}
          </div>
        </main>
      </div>

      {/* Accessible Toast Notification Floating Alerts */}
      {toast && (
        <div 
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 flex items-center space-x-3 px-4 py-3 rounded-2xl shadow-2xl border bg-white animate-scale-up text-xs font-bold max-w-sm"
        >
          {toast.type === 'success' && (
            <div className="p-1.5 rounded-xl bg-emerald-100 text-emerald-700 flex-shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          )}
          {toast.type === 'error' && (
            <div className="p-1.5 rounded-xl bg-rose-100 text-rose-700 flex-shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
          )}
          {toast.type === 'info' && (
            <div className="p-1.5 rounded-xl bg-blue-100 text-blue-700 flex-shrink-0">
              <Info className="w-5 h-5" />
            </div>
          )}

          <span className="text-slate-800 leading-snug">{toast.message}</span>
          
          <button 
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors ml-auto focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label="Tutup Notifikasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {demoGatewayOpen && (
        <PaymentGatewayModal
          isOpen={true}
          onClose={() => setDemoGatewayOpen(false)}
          data={{
            kd_pengembalian: 'KB001',
            kd_peminjaman: 'PJ001',
            denda: 3000,
            nama_anggota: 'Ahmad Fauzi (XI IPA 1)',
            judul_transaksi: 'Pembayaran Denda Perpustakaan'
          }}
          onSuccess={() => {
            showNotification('Pembayaran QRIS berhasil!', 'success');
            setDemoGatewayOpen(false);
          }}
        />
      )}
    </div>
  );
}
