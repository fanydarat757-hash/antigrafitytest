import React from 'react';
import { Printer, X, Tag, BookOpen, GraduationCap } from 'lucide-react';

export default function BarcodeModal({ isOpen, onClose, book }) {
  if (!isOpen || !book) return null;

  const handlePrint = () => {
    window.print();
  };

  // Generate pseudo Dewey call number berdasarkan pengarang dan judul
  const authorCode = (book.pengarang || 'XXX').substring(0, 3).toUpperCase();
  const titleInitial = (book.judul_buku || 'b').substring(0, 1).toLowerCase();
  const ddcClass = book.judul_buku?.toLowerCase().includes('matematika') ? '510'
    : book.judul_buku?.toLowerCase().includes('fisika') ? '530'
    : book.judul_buku?.toLowerCase().includes('biologi') ? '570'
    : book.judul_buku?.toLowerCase().includes('islam') || book.judul_buku?.toLowerCase().includes('muhammadiyah') ? '297'
    : book.judul_buku?.toLowerCase().includes('bahasa') ? '410'
    : '000';

  const callNumber = `${ddcClass} ${authorCode} ${titleInitial}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
        {/* Modal Header (No-Print) */}
        <div className="no-print p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Label Punggung & Barcode Buku</h3>
              <p className="text-[11px] text-slate-500 font-medium">Siap cetak stiker fisik inventaris buku perpustakaan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AREA LABEL STIKER FISIK (PRINTABLE) */}
        <div className="p-6 flex flex-col items-center">
          <div 
            id="printable-barcode-label" 
            className="w-full max-w-xs p-4 bg-white border-2 border-dashed border-slate-400 rounded-2xl shadow-sm text-center font-sans"
          >
            {/* Header Instansi */}
            <div className="flex items-center justify-center space-x-1.5 border-b border-slate-300 pb-2 mb-3">
              <div className="w-5 h-5 rounded bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold">
                M
              </div>
              <div className="leading-none text-left">
                <p className="text-[10px] font-extrabold text-slate-900 uppercase tracking-tight">Perpustakaan SMA</p>
                <p className="text-[8px] text-emerald-700 font-bold uppercase">Muhammadiyah Pekalongan</p>
              </div>
            </div>

            {/* Nomor Panggil (Call Number) */}
            <div className="bg-slate-100 py-1.5 px-3 rounded-lg border border-slate-300 mb-3">
              <p className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Nomor Panggil (DDC):</p>
              <p className="font-mono text-sm font-extrabold text-slate-900 tracking-wider">{callNumber}</p>
            </div>

            {/* Barcode Lines Visual */}
            <div className="py-2 flex flex-col items-center justify-center">
              <svg className="w-56 h-14" viewBox="0 0 200 50">
                {/* Visual Barcode Pattern */}
                <rect x="5" y="0" width="3" height="40" fill="#000" />
                <rect x="11" y="0" width="2" height="40" fill="#000" />
                <rect x="16" y="0" width="4" height="40" fill="#000" />
                <rect x="23" y="0" width="1" height="40" fill="#000" />
                <rect x="27" y="0" width="5" height="40" fill="#000" />
                <rect x="35" y="0" width="2" height="40" fill="#000" />
                <rect x="40" y="0" width="3" height="40" fill="#000" />
                <rect x="46" y="0" width="2" height="40" fill="#000" />
                <rect x="51" y="0" width="4" height="40" fill="#000" />
                <rect x="58" y="0" width="1" height="40" fill="#000" />
                <rect x="62" y="0" width="5" height="40" fill="#000" />
                <rect x="70" y="0" width="3" height="40" fill="#000" />
                <rect x="76" y="0" width="2" height="40" fill="#000" />
                <rect x="81" y="0" width="4" height="40" fill="#000" />
                <rect x="88" y="0" width="2" height="40" fill="#000" />
                <rect x="93" y="0" width="3" height="40" fill="#000" />
                <rect x="99" y="0" width="5" height="40" fill="#000" />
                <rect x="107" y="0" width="2" height="40" fill="#000" />
                <rect x="112" y="0" width="4" height="40" fill="#000" />
                <rect x="119" y="0" width="1" height="40" fill="#000" />
                <rect x="123" y="0" width="4" height="40" fill="#000" />
                <rect x="130" y="0" width="3" height="40" fill="#000" />
                <rect x="136" y="0" width="2" height="40" fill="#000" />
                <rect x="141" y="0" width="5" height="40" fill="#000" />
                <rect x="149" y="0" width="2" height="40" fill="#000" />
                <rect x="154" y="0" width="4" height="40" fill="#000" />
                <rect x="161" y="0" width="1" height="40" fill="#000" />
                <rect x="165" y="0" width="3" height="40" fill="#000" />
                <rect x="171" y="0" width="5" height="40" fill="#000" />
                <rect x="179" y="0" width="2" height="40" fill="#000" />
                <rect x="184" y="0" width="4" height="40" fill="#000" />
                <rect x="191" y="0" width="3" height="40" fill="#000" />
              </svg>
              <span className="font-mono text-xs font-bold tracking-widest text-slate-800 mt-1">
                *{book.kd_buku}*
              </span>
            </div>

            {/* Info Singkat Buku */}
            <div className="border-t border-slate-300 pt-2 text-left text-[10px] space-y-0.5">
              <p className="font-bold text-slate-900 truncate">{book.judul_buku}</p>
              <p className="text-slate-600 truncate">{book.pengarang} • {book.penerbit}</p>
              <p className="font-bold text-emerald-700 font-mono text-[9px] truncate">📍 Lokasi: {book.lokasi_rak || 'Rak A-01 (Umum)'}</p>
            </div>
          </div>

          <p className="no-print text-[11px] text-slate-500 mt-4 text-center">
            Stiker ini ditempel pada punggung buku fisik untuk memudahkan scanning peminjaman dan penataan di rak buku perpustakaan.
          </p>
        </div>

        {/* Modal Actions (No-Print) */}
        <div className="no-print p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
          >
            Tutup
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/25 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Stiker Barcode</span>
          </button>
        </div>
      </div>
    </div>
  );
}
