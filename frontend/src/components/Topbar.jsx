import React, { useState } from 'react';
import { Search, Bell, User, Calendar, ShieldCheck, LogOut, ChevronDown, Menu, Edit, CreditCard } from 'lucide-react';
import KartuPerpusModal from './KartuPerpusModal';
import EditProfileModal from './EditProfileModal';

export default function Topbar({ 
  user = { nama: 'Siti Farida, A.Md', role: 'Kepala Unit Perpustakaan' }, 
  onLogout,
  onOpenMobileMenu,
  onUpdateUser 
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const currentDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const roleCode = user?.roleCode || (user?.username === 'admin' ? 'kepala_perpus' : user?.username === 'kepsek' ? 'kepala_sekolah' : 'petugas_sirkulasi');

  return (
    <header className="h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-md transform-gpu">
      {/* Left: Mobile Hamburger & Search */}
      <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          aria-label="Buka Menu Navigasi"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            aria-label="Pencarian Cepat Perpustakaan"
            placeholder="Cari buku, siswa, atau transaksi..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900/80 border border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all placeholder:text-slate-500 text-slate-100 font-medium"
          />
        </div>

        <div className="hidden xl:flex items-center space-x-2 text-xs text-slate-300 font-semibold bg-slate-900/70 py-1.5 px-3 rounded-xl border border-slate-700/70">
          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          <span>{currentDate}</span>
        </div>
      </div>

      {/* Right: Role Badge, School Badge, Notification & User Profile */}
      <div className="flex items-center space-x-2 sm:space-x-3 ml-2 sm:ml-4">
        {/* Role Pill Badge */}
        <div className={`hidden md:flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-bold border shadow-sm ${
          roleCode === 'kepala_sekolah'
            ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
            : roleCode === 'petugas_sirkulasi'
            ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
        }`}>
          <span>
            {roleCode === 'kepala_sekolah' ? '🏛️ Pengawas (Kepsek)' : roleCode === 'petugas_sirkulasi' ? '📋 Petugas Sirkulasi' : '👑 Kepala Perpustakaan'}
          </span>
        </div>

        {/* Tombol Cetak Kartu Perpus Cepat */}
        <button
          onClick={() => setIsCardOpen(true)}
          className="hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 rounded-xl text-[11px] font-bold border border-amber-500/30 transition-colors shadow-sm"
          title="Lihat & Cetak Kartu Anggota Perpustakaan"
        >
          <CreditCard className="w-3.5 h-3.5 text-amber-400" />
          <span>Kartu Perpus</span>
        </button>

        {/* School Badge */}
        <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 bg-emerald-500/15 text-emerald-300 rounded-full text-[11px] font-bold border border-emerald-500/30">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>SMA Muhammadiyah</span>
        </div>

        <div className="h-7 w-px bg-slate-800 hidden sm:block"></div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer select-none group text-left p-1 rounded-xl hover:bg-slate-900/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
          >
            {user.foto ? (
              <img
                src={user.foto}
                alt={user.nama}
                className="w-9 h-9 rounded-xl object-cover ring-2 ring-emerald-500 shadow-sm flex-shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-slate-700 group-hover:ring-emerald-500 transition-all flex-shrink-0">
                <User className="w-4 h-4 text-emerald-400" />
              </div>
            )}
            
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-slate-100 leading-none">{user.nama}</p>
              <p className="text-[10px] text-slate-400 font-semibold mt-1 truncate max-w-[130px]">{user.role || 'Petugas'}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 hidden sm:block" />
          </button>

          {/* Accessible Dropdown Menu */}
          {dropdownOpen && (
            <div 
              className="absolute right-0 mt-2 w-56 bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-700 py-2 z-50 animate-scale-up text-xs font-medium text-slate-200"
              onMouseLeave={() => setDropdownOpen(false)}
              role="menu"
            >
              <div className="px-4 py-2.5 border-b border-slate-800 bg-slate-950/50">
                <p className="font-bold text-white truncate">{user.nama}</p>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">{user.username ? `@${user.username}` : user.nisn}</p>
                <span className="inline-block mt-1.5 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  {user.role || 'Petugas'}
                </span>
              </div>

              <div className="py-1">
                <button
                  role="menuitem"
                  onClick={() => {
                    setDropdownOpen(false);
                    setIsEditProfileOpen(true);
                  }}
                  className="w-full text-left px-4 py-2 text-slate-200 hover:bg-slate-800 hover:text-white font-bold flex items-center space-x-2 transition-colors"
                >
                  <Edit className="w-4 h-4 text-blue-400" />
                  <span>Ubah Profil & Foto</span>
                </button>

                <button
                  role="menuitem"
                  onClick={() => {
                    setDropdownOpen(false);
                    setIsCardOpen(true);
                  }}
                  className="w-full text-left px-4 py-2 text-slate-200 hover:bg-slate-800 hover:text-white font-bold flex items-center space-x-2 transition-colors"
                >
                  <CreditCard className="w-4 h-4 text-amber-400" />
                  <span>Cetak Kartu Perpus</span>
                </button>

                <div className="border-t border-slate-800 my-1"></div>

                <button
                  role="menuitem"
                  onClick={() => {
                    setDropdownOpen(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full text-left px-4 py-2 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 font-bold flex items-center space-x-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Ganti Akun / Keluar</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Kartu Perpustakaan */}
      <KartuPerpusModal
        isOpen={isCardOpen}
        onClose={() => setIsCardOpen(false)}
        member={user}
      />

      {/* Modal Edit Profil */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        user={user}
        onSave={(updated) => {
          if (onUpdateUser) onUpdateUser(updated);
        }}
      />
    </header>
  );
}
