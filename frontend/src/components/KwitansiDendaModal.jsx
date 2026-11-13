import React from 'react';
import { Receipt, Printer, X, GraduationCap, CheckCircle2 } from 'lucide-react';
import Modal from './Modal';

export default function KwitansiDendaModal({ isOpen, onClose, data }) {
  if (!isOpen || !data) return null;

  const handlePrint = () => {
    window.print();
  };

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num || 0);
  };

  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Kwitansi Bukti Pembayaran Denda"
      maxWidth="max-w-lg"
    >
      <div className="space-y-4">
        {/* Printable Receipt Paper */}
        <div 
          id="printable-receipt"
          className="bg-white p-6 rounded-2xl border-2 border-slate-300 shadow-sm text-slate-800 text-xs font-sans space-y-4"
        >
          {/* Header Kwitansi */}
          <div className="border-b-2 border-slate-800 pb-3 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs uppercase text-slate-900">SMA MUHAMMADIYAH 1 PEKALONGAN</h4>
                <p className="text-[10px] text-slate-500 font-medium">Unit Pengelola Perpustakaan • Lampung Timur</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`font-mono font-bold text-[11px] px-2.5 py-1 rounded border ${
                data.status_denda === 'Tertunggak'
                  ? 'text-rose-700 bg-rose-50 border-rose-200'
                  : 'text-emerald-700 bg-emerald-50 border-emerald-200'
              }`}>
                {data.status_denda === 'Tertunggak' ? '⚠ TERTUNGGAK' : '✓ LUNAS'}
              </span>
            </div>
          </div>

          <div className="text-center py-1">
            <h3 className="font-black text-sm uppercase tracking-wider text-slate-900 underline decoration-1">
              BUKTI PEMBAYARAN DENDA
            </h3>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">No. Bukti: BKD-{data.kd_pengembalian}-{Date.now().toString().slice(-4)}</p>
          </div>

          {/* Rincian Transaksi */}
          <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Telah diterima dari:</span>
              <span className="font-bold text-slate-900">{data.peminjaman?.nama_anggota || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Kode Peminjaman:</span>
              <span className="font-mono font-bold text-slate-700">{data.kd_peminjaman}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Buku yang Dikembalikan:</span>
              <span className="font-semibold text-slate-800 max-w-[200px] truncate">{data.peminjaman?.buku?.judul_buku || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Tanggal Pengembalian:</span>
              <span className="font-mono text-slate-700">{data.tgl_pengembalian}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Keterangan:</span>
              <span className="font-medium text-slate-800">{data.keterangan || 'Keterlambatan Pengembalian'}</span>
            </div>

            {data.metode_pembayaran && (
              <div className="flex justify-between items-center bg-white px-2.5 py-1.5 rounded-lg border border-slate-200">
                <span className="text-slate-500">Metode Bayar:</span>
                <span className="font-bold text-slate-800">{data.metode_pembayaran}</span>
              </div>
            )}

            {data.id_transaksi_gateway && (
              <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                <span>Ref Gateway:</span>
                <span className="font-bold text-slate-700">{data.id_transaksi_gateway}</span>
              </div>
            )}

            <div className="border-t border-slate-200 pt-2 flex justify-between items-center text-sm">
              <span className="font-bold text-slate-900">Total Denda Dibayar:</span>
              <span className="font-extrabold text-emerald-700 font-mono text-base">
                {formatRupiah(data.denda)}
              </span>
            </div>
          </div>

          {/* Kolom Tanda Tangan */}
          <div className="pt-2 flex justify-between text-[11px] text-slate-700">
            <div>
              <p className="text-slate-500">Penyetor (Siswa):</p>
              <div className="h-12"></div>
              <p className="font-bold">({data.peminjaman?.nama_anggota?.split(' ')[0] || 'Siswa'})</p>
            </div>
            <div className="text-right">
              <p className="text-slate-500">Pekalongan, {currentDate}</p>
              <p className="text-slate-500">Penerima (Petugas Perpustakaan):</p>
              <div className="h-9"></div>
              <p className="font-bold underline">Siti Farida, A.Md</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/25 flex items-center space-x-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Kwitansi (Print / PDF)</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}

