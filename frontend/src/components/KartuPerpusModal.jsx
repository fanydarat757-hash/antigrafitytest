import React, { useRef } from 'react';
import { GraduationCap, Printer, X, ShieldCheck, QrCode } from 'lucide-react';
import Modal from './Modal';

export default function KartuPerpusModal({ isOpen, onClose, member }) {
  if (!isOpen || !member) return null;

  const handlePrintCard = () => {
    window.print();
  };

  const defaultPhoto = member.foto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Kartu Tanda Anggota Perpustakaan Resmi"
      maxWidth="max-w-xl"
    >
      <div className="space-y-5">
        <p className="text-xs text-slate-500">
          Kartu identitas resmi peminjaman buku perpustakaan SMA Muhammadiyah Pekalongan Lampung Timur.
        </p>

        {/* CONTAINER KARTU FISIK (PRINTABLE CR80 PROPORTION) */}
        <div 
          id="printable-library-card"
          className="w-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-amber-400/30 relative overflow-hidden font-sans select-none"
        >
          {/* Watermark Logo Pattern */}
          <div className="absolute -right-8 -bottom-8 w-56 h-56 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute -left-8 -top-8 w-44 h-44 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

          {/* KOP KARTU IDENTITAS RESMI */}
          <div className="flex items-center space-x-3 border-b border-white/20 pb-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md flex-shrink-0">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div className="leading-tight">
              <h4 className="text-[10px] sm:text-[11px] uppercase tracking-widest text-emerald-400 font-extrabold">
                KARTU TANDA ANGGOTA PERPUSTAKAAN
              </h4>
              <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wide text-white">
                SMA MUHAMMADIYAH 1 PEKALONGAN
              </h2>
              <p className="text-[9px] sm:text-[10px] text-slate-300">
                Kabupaten Lampung Timur • Prov. Lampung
              </p>
            </div>
          </div>

          {/* KONTEN UTAMA: FOTO & DATA ANGGOTA */}
          <div className="grid grid-cols-3 gap-5 mt-5 items-center relative z-10">
            {/* Foto Profil Anggota */}
            <div className="col-span-1 flex flex-col items-center">
              <div className="w-24 h-32 sm:w-28 sm:h-36 rounded-2xl overflow-hidden ring-4 ring-white/20 shadow-xl border-2 border-white/30 bg-slate-800">
                <img
                  src={defaultPhoto}
                  alt={member.nama}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="mt-2 text-[9px] font-bold uppercase tracking-wider text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30">
                Anggota Aktif
              </span>
            </div>

            {/* Detail Data Anggota */}
            <div className="col-span-2 space-y-2 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                  Nomor Anggota / NISN
                </span>
                <span className="font-mono text-base sm:text-lg font-black tracking-wider text-amber-300">
                  {member.nisn || member.username || '2024001'}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                  Nama Lengkap
                </span>
                <h3 className="font-extrabold text-sm sm:text-base text-white tracking-wide">
                  {member.nama}
                </h3>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                  Kelas / Program Studi
                </span>
                <span className="font-semibold text-slate-200 text-xs">
                  {member.kelas || member.role || 'Kelas XI IPA 1'}
                </span>
              </div>

              <div className="pt-1 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-slate-400 block font-semibold">Masa Berlaku</span>
                  <span className="text-[10px] font-bold text-slate-300">Seumur Masa Studi</span>
                </div>

                {/* Simulasi Barcode / QR Code SVG */}
                <div className="p-1.5 bg-white rounded-lg shadow-sm">
                  <QrCode className="w-8 h-8 text-slate-900" />
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER: LEGALITAS & PENGESAHAN */}
          <div className="mt-5 pt-3 border-t border-white/15 flex items-center justify-between text-[9px] text-slate-300 relative z-10">
            <div>
              <p className="font-mono text-white tracking-wide">ID-{member.nisn || member.username}-PERPUS-MUH</p>
              <p className="text-[8px] text-slate-400">Harap membawa kartu ini saat meminjam buku fisik.</p>
            </div>

            <div className="text-right">
              <p className="text-[8px] text-slate-400">Kepala Perpustakaan,</p>
              <p className="font-bold text-white text-[10px] underline decoration-emerald-400 decoration-1">
                Siti Farida, A.Md
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={handlePrintCard}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/25 transition-all flex items-center space-x-2"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Kartu Perpustakaan (PDF / Print)</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}

