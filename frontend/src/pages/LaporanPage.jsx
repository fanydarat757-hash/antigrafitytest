import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Printer, 
  Calendar, 
  Filter, 
  CheckCircle2, 
  GraduationCap, 
  RefreshCw,
  Download
} from 'lucide-react';
import { api, formatDateIndo } from '../api/axios';

export default function LaporanPage({ showNotification, user }) {
  const roleCode = user?.roleCode || (user?.username === 'admin' ? 'kepala_perpus' : user?.username === 'kepsek' ? 'kepala_sekolah' : 'petugas_sirkulasi');
  const [reportType, setReportType] = useState('peminjaman'); // 'buku' | 'peminjaman' | 'pengembalian'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  const fetchReport = async () => {
    setLoading(true);
    try {
      let res;
      if (reportType === 'buku') {
        res = await api.getLaporanBuku();
      } else if (reportType === 'peminjaman') {
        res = await api.getLaporanPeminjaman(startDate, endDate, status);
      } else {
        res = await api.getLaporanPengembalian(startDate, endDate);
      }
      setReportData(res);
    } catch (err) {
      showNotification('Gagal memuat preview laporan: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [reportType]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (!reportData || !reportData.data || reportData.data.length === 0) {
      showNotification('Tidak ada data laporan untuk diekspor.', 'error');
      return;
    }

    let csvContent = 'data:text/csv;charset=utf-8,';
    
    if (reportType === 'buku') {
      csvContent += 'No,Kode Buku,Judul Buku,Pengarang,Penerbit,Tahun Terbit,Stok\n';
      reportData.data.forEach((row, idx) => {
        csvContent += `${idx + 1},"${row.kd_buku}","${row.judul_buku}","${row.pengarang}","${row.penerbit}","${row.tahun_terbit}",${row.stok}\n`;
      });
    } else if (reportType === 'peminjaman') {
      csvContent += 'No,Kode Pinjam,Nama Anggota,Judul Buku,Tgl Pinjam,Jatuh Tempo,Status\n';
      reportData.data.forEach((row, idx) => {
        csvContent += `${idx + 1},"${row.kd_peminjaman}","${row.nama_anggota}","${row.buku?.judul_buku || row.kd_buku}","${row.tgl_peminjaman}","${row.tgl_jatuh_tempo || '-'}","${row.status}"\n`;
      });
    } else {
      csvContent += 'No,Kode Kembali,Kode Pinjam,Nama Siswa,Tgl Kembali,Keterangan,Denda\n';
      reportData.data.forEach((row, idx) => {
        csvContent += `${idx + 1},"${row.kd_pengembalian}","${row.kd_peminjaman}","${row.peminjaman?.nama_anggota || '-'}","${row.tgl_pengembalian}","${row.keterangan}",${row.denda}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_${reportType.toUpperCase()}_SMA_Muhammadiyah.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Laporan berhasil diekspor ke format file CSV/Excel!', 'success');
  };

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num || 0);
  };

  return (
    <div className="space-y-6">
      {/* Banner Khusus Pengesahan Kepala Sekolah */}
      {roleCode === 'kepala_sekolah' && (
        <div className="no-print p-4 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900 flex items-center space-x-3 text-xs font-semibold">
          <span className="p-2 rounded-xl bg-purple-100 text-purple-700 font-bold">🏛️ Otorisasi</span>
          <div>
            <p className="font-extrabold text-sm">Portal Pengesahan Berkas Resmi • Kepala Sekolah</p>
            <p className="text-purple-700">Laporan yang Anda cetak dari halaman ini memuat tanda tangan pengesahan Kepala Sekolah (Ahmad Marzuki, S.Pd.I) untuk akreditasi sekolah.</p>
          </div>
        </div>
      )}

      {/* Header Halaman (No-Print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            <span>{roleCode === 'kepala_sekolah' ? 'Pengesahan & Cetak Laporan Resmi' : 'Pusat Cetak Dokumen Laporan'}</span>
          </h2>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Generate dan cetak laporan resmi untuk Kepala Sekolah & Arsip Perpustakaan
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold border border-slate-300 transition-all focus-visible:ring-2 focus-visible:ring-slate-500"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Export ke Excel/CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <Printer className="w-4 h-4" />
            <span>{roleCode === 'kepala_sekolah' ? 'Sahkan & Cetak Laporan' : 'Cetak Dokumen (Print / PDF)'}</span>
          </button>
        </div>
      </div>

      {/* Filter Control Bar (No-Print) */}
      <div className="no-print bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Pilih Tipe Laporan */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Jenis Laporan</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-600 text-slate-900 font-bold"
            >
              <option value="peminjaman">Laporan Transaksi Peminjaman Buku</option>
              <option value="pengembalian">Laporan Pengembalian & Rekap Denda</option>
              <option value="buku">Laporan Master Inventaris Buku</option>
            </select>
          </div>

          {/* Tanggal Mulai */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Dari Tanggal</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              disabled={reportType === 'buku'}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-600 disabled:opacity-50 font-mono text-slate-900 font-medium"
            />
          </div>

          {/* Tanggal Selesai */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Sampai Tanggal</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={reportType === 'buku'}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-600 disabled:opacity-50 font-mono text-slate-900 font-medium"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={fetchReport}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Terapkan Filter Laporan</span>
          </button>
        </div>
      </div>

      {/* Dokumen Lembar Cetak Laporan (Printable Area) */}
      <div 
        id="printable-report"
        className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-sm font-sans"
      >
        {/* KOP SURAT RESMI SEKOLAH */}
        <div className="border-b-2 border-slate-800 pb-4 mb-6 text-center relative">
          <div className="flex items-center justify-center space-x-4 mb-2">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-widest text-slate-700 font-bold">
                Majelis Pendidikan Dasar dan Menengah Muhammadiyah
              </h4>
              <h2 className="text-lg sm:text-xl font-extrabold uppercase text-slate-900 tracking-wide">
                SMA MUHAMMADIYAH 1 PEKALONGAN
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                Alamat: Jl. Raya Pekalongan, Kec. Pekalongan, Kabupaten Lampung Timur, Lampung 34391
              </p>
            </div>
          </div>
          <div className="h-0.5 bg-slate-900 mt-2"></div>
          <div className="h-0.5 bg-slate-900 mt-0.5"></div>
        </div>

        {/* JUDUL LAPORAN */}
        <div className="text-center my-6">
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 uppercase underline decoration-2 underline-offset-4">
            {reportType === 'buku' && 'LAPORAN DATA INVENTARIS BUKU'}
            {reportType === 'peminjaman' && 'LAPORAN DATA PEMINJAMAN BUKU'}
            {reportType === 'pengembalian' && 'LAPORAN DATA PENGEMBALIAN & DENDA BUKU'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {startDate && endDate 
              ? `Periode Transaksi: ${startDate} s/d ${endDate}`
              : `Dicetak Pada: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`}
          </p>
        </div>

        {/* TABEL DATA LAPORAN */}
        <div className="overflow-x-auto my-6">
          {reportType === 'buku' && (
            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <tr>
                  <th className="py-2.5 px-3 border-r border-slate-300 text-center w-12">No</th>
                  <th className="py-2.5 px-3 border-r border-slate-300">Kode Buku</th>
                  <th className="py-2.5 px-3 border-r border-slate-300">Judul Buku</th>
                  <th className="py-2.5 px-3 border-r border-slate-300">Pengarang</th>
                  <th className="py-2.5 px-3 border-r border-slate-300">Penerbit</th>
                  <th className="py-2.5 px-3 border-r border-slate-300">Lokasi Rak</th>
                  <th className="py-2.5 px-3 border-r border-slate-300 text-center">Tahun</th>
                  <th className="py-2.5 px-3 text-center">Stok</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {reportData?.data?.map((item, idx) => (
                  <tr key={item.kd_buku}>
                    <td className="py-2 px-3 border-r border-slate-200 text-center">{idx + 1}</td>
                    <td className="py-2 px-3 border-r border-slate-200 font-mono font-bold text-slate-900">{item.kd_buku}</td>
                    <td className="py-2 px-3 border-r border-slate-200 font-bold text-slate-900">{item.judul_buku}</td>
                    <td className="py-2 px-3 border-r border-slate-200 text-slate-800">{item.pengarang}</td>
                    <td className="py-2 px-3 border-r border-slate-200 text-slate-800">{item.penerbit}</td>
                    <td className="py-2 px-3 border-r border-slate-200 font-semibold text-slate-800">{item.lokasi_rak || 'Rak A-01 (Umum)'}</td>
                    <td className="py-2 px-3 border-r border-slate-200 text-center font-mono">{item.tahun_terbit}</td>
                    <td className="py-2 px-3 text-center font-bold text-slate-900">{item.stok}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'peminjaman' && (
            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <tr>
                  <th className="py-2.5 px-3 border-r border-slate-300 text-center w-12">No</th>
                  <th className="py-2.5 px-3 border-r border-slate-300">Kode Pinjam</th>
                  <th className="py-2.5 px-3 border-r border-slate-300">Nama Anggota/Siswa</th>
                  <th className="py-2.5 px-3 border-r border-slate-300">Judul Buku</th>
                  <th className="py-2.5 px-3 border-r border-slate-300">Tgl Pinjam</th>
                  <th className="py-2.5 px-3 border-r border-slate-300">Jatuh Tempo</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {reportData?.data?.map((item, idx) => (
                  <tr key={item.kd_peminjaman}>
                    <td className="py-2 px-3 border-r border-slate-200 text-center">{idx + 1}</td>
                    <td className="py-2 px-3 border-r border-slate-200 font-mono font-bold text-slate-900">{item.kd_peminjaman}</td>
                    <td className="py-2 px-3 border-r border-slate-200 font-bold text-slate-900">{item.nama_anggota}</td>
                    <td className="py-2 px-3 border-r border-slate-200 font-semibold text-slate-800">{item.buku?.judul_buku || item.kd_buku}</td>
                    <td className="py-2 px-3 border-r border-slate-200 font-medium">{formatDateIndo(item.tgl_peminjaman)}</td>
                    <td className="py-2 px-3 border-r border-slate-200 font-bold">{formatDateIndo(item.tgl_jatuh_tempo)}</td>
                    <td className="py-2 px-3 text-center font-bold">{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'pengembalian' && (
            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <tr>
                  <th className="py-2.5 px-3 border-r border-slate-300 text-center w-12">No</th>
                  <th className="py-2.5 px-3 border-r border-slate-300">Kode Kembali</th>
                  <th className="py-2.5 px-3 border-r border-slate-300">Kode Pinjam</th>
                  <th className="py-2.5 px-3 border-r border-slate-300">Nama Siswa</th>
                  <th className="py-2.5 px-3 border-r border-slate-300">Tgl Kembali</th>
                  <th className="py-2.5 px-3 border-r border-slate-300">Keterangan</th>
                  <th className="py-2.5 px-3 text-right">Denda</th>
                  <th className="py-2.5 px-3 text-center">Status Bayar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {reportData?.data?.map((item, idx) => (
                  <tr key={item.kd_pengembalian}>
                    <td className="py-2 px-3 border-r border-slate-200 text-center">{idx + 1}</td>
                    <td className="py-2 px-3 border-r border-slate-200 font-mono font-bold text-slate-900">{item.kd_pengembalian}</td>
                    <td className="py-2 px-3 border-r border-slate-200 font-mono">{item.kd_peminjaman}</td>
                    <td className="py-2 px-3 border-r border-slate-200 font-bold text-slate-900">{item.peminjaman?.nama_anggota || '-'}</td>
                    <td className="py-2 px-3 border-r border-slate-200 font-medium">{formatDateIndo(item.tgl_pengembalian)}</td>
                    <td className="py-2 px-3 border-r border-slate-200 text-slate-800">{item.keterangan}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold">
                      {item.denda > 0 ? formatRupiah(item.denda) : 'Rp 0'}
                    </td>
                    <td className="py-2 px-3 text-center font-bold">
                      {item.denda > 0 ? (
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] ${
                          item.status_denda === 'Tertunggak' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {item.status_denda || 'Lunas'}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* REKAP TOTAL / STATISTIK BAWAH */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-300 flex justify-between items-center text-xs font-bold text-slate-800">
          <span>Total Baris Rekapitulasi: {reportData?.data?.length || 0} Data</span>
          {reportType === 'pengembalian' && (
            <span className="text-emerald-800">Total Penerimaan Denda: {formatRupiah(reportData?.total_denda || 0)}</span>
          )}
          {reportType === 'buku' && (
            <span>Total Eksemplar Fisik: {reportData?.total_eksemplar || 0} Buku</span>
          )}
        </div>

        {/* KOLOM TANDA TANGAN RESMI */}
        <div className="mt-12 grid grid-cols-2 text-center text-xs text-slate-900">
          <div>
            <p className="text-slate-600 mb-1 font-medium">Mengetahui,</p>
            <p className="font-bold">Kepala SMA Muhammadiyah Pekalongan</p>
            <div className="h-20"></div>
            <p className="font-extrabold underline">Ahmad Marzuki, S.Pd.I</p>
            <p className="text-slate-600 text-[11px] font-mono">NBM / NIP. 19780512 200501 1 008</p>
          </div>
          <div>
            <p className="text-slate-600 mb-1 font-medium">Pekalongan, Lampung Timur</p>
            <p className="font-bold">Kepala Pengelola Perpustakaan</p>
            <div className="h-20"></div>
            <p className="font-extrabold underline">Siti Farida, A.Md</p>
            <p className="text-slate-600 text-[11px] font-mono">NIP. 19840214 200902 2 003</p>
          </div>
        </div>
      </div>
    </div>
  );
}
