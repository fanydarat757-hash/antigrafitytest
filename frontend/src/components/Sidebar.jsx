import React, { useEffect } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  ArrowUpRight, 
  ArrowDownLeft, 
  FileText, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  GraduationCap,
  ShieldCheck,
  Building,
  UserCheck,
  X,
  Award
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  collapsed, 
  setCollapsed, 
  mobileOpen, 
  setMobileOpen,
  user
}) {
  const roleCode = user?.roleCode || (user?.username === 'admin' ? 'kepala_perpus' : user?.username === 'kepsek' ? 'kepala_sekolah' : 'petugas_sirkulasi');

  // Konfigurasi Menu Berdasarkan Hak Akses Peran (Role-Based Access Control)
  let menuItems = [];
  let roleBadge = {
    title: 'Kepala Perpustakaan',
    sub: 'Super Administrator',
    color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    icon: ShieldCheck
  };

  if (roleCode === 'kepala_sekolah') {
    roleBadge = {
      title: 'Kepala Sekolah',
      sub: 'Pengawas Eksekutif',
      color: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      icon: Building
    };
    menuItems = [
      { id: 'dashboard', label: 'Dashboard Eksekutif & KPI', icon: LayoutDashboard },
      { id: 'laporan', label: 'Pengesahan & Cetak Laporan', icon: FileText, highlight: true },
      { id: 'buku', label: 'Monitoring Koleksi Buku', icon: BookOpen },
      { id: 'peminjaman', label: 'Monitoring Sirkulasi Siswa', icon: ArrowUpRight },
      { id: 'pengembalian', label: 'Audit Denda & Pengembalian', icon: ArrowDownLeft },
    ];
  } else if (roleCode === 'petugas_sirkulasi') {
    roleBadge = {
      title: 'Petugas Sirkulasi',
      sub: 'Front-Desk Layanan',
      color: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
      icon: UserCheck
    };
    menuItems = [
      { id: 'dashboard', label: 'Loket Layanan Sirkulasi', icon: LayoutDashboard },
      { id: 'peminjaman', label: 'Layanan Peminjaman', icon: ArrowUpRight, highlight: true },
      { id: 'pengembalian', label: 'Layanan Pengembalian & Denda', icon: ArrowDownLeft, highlight: true },
      { id: 'buku', label: 'Katalog & Stok Rak Buku', icon: BookOpen },
      { id: 'laporan', label: 'Laporan Harian Sirkulasi', icon: FileText },
    ];
  } else {
    // Default: Kepala Perpustakaan (Full Access)
    roleBadge = {
      title: 'Kepala Perpustakaan',
      sub: 'Manajemen Penuh',
      color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      icon: ShieldCheck
    };
    menuItems = [
      { id: 'dashboard', label: 'Dashboard Manajerial', icon: LayoutDashboard },
      { id: 'buku', label: 'Master Data Koleksi Buku', icon: BookOpen },
      { id: 'peminjaman', label: 'Transaksi Peminjaman', icon: ArrowUpRight },
      { id: 'pengembalian', label: 'Transaksi Pengembalian', icon: ArrowDownLeft },
      { id: 'laporan', label: 'Cetak Laporan Resmi', icon: FileText },
      { id: 'pengaturan', label: 'Pengaturan Sistem & Staf', icon: Settings },
    ];
  }

  // Close mobile drawer on escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen, setMobileOpen]);

  const handleSelectTab = (id) => {
    setActiveTab(id);
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };

  const RoleIcon = roleBadge.icon;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden transition-opacity animate-fade-in"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-slate-950/85 backdrop-blur-md border-r border-slate-800/80 text-slate-200 transition-all duration-200 flex flex-col shadow-2xl lg:shadow-xl transform-gpu ${
          mobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
        } ${
          collapsed ? 'lg:w-20' : 'lg:w-64'
        }`}
        aria-label="Navigasi Utama Perpustakaan"
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 flex-shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            {(!collapsed || mobileOpen) && (
              <div className="leading-tight truncate">
                <h1 className="font-extrabold text-white text-sm tracking-wide">PERPUSTAKAAN</h1>
                <p className="text-[11px] text-emerald-400 font-semibold truncate">SMA Muhammadiyah Pekalongan</p>
              </div>
            )}
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Indikator Peran / Hak Akses Sistem */}
        {(!collapsed || mobileOpen) && (
          <div className="px-3.5 pt-3.5 pb-2">
            <div className={`p-2.5 rounded-xl border flex items-center space-x-2.5 ${roleBadge.color}`}>
              <RoleIcon className="w-4 h-4 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-extrabold leading-tight truncate">{roleBadge.title}</p>
                <p className="text-[10px] opacity-80 truncate">{roleBadge.sub}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation List */}
        <nav className="flex-1 py-2 px-3 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                title={collapsed && !mobileOpen ? item.label : undefined}
                className={`w-full flex items-center rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-500/10 font-bold'
                    : 'hover:bg-slate-800/60 hover:text-white text-slate-400'
                } ${collapsed && !mobileOpen ? 'justify-center' : 'space-x-3'}`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-emerald-400 transition-colors'}`} />
                {(!collapsed || mobileOpen) && (
                  <div className="flex-1 flex items-center justify-between truncate text-left">
                    <span className="truncate">{item.label}</span>
                    {item.highlight && !isActive && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 ml-1.5"></span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer / Desktop Collapse Toggle */}
        <div className="hidden lg:block p-3 border-t border-slate-800/80 bg-slate-900/30">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            aria-label={collapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : (
              <div className="flex items-center space-x-2">
                <ChevronLeft className="w-4 h-4" />
                <span>Ciutkan Sidebar</span>
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}