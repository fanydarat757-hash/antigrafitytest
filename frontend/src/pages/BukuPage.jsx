import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  RefreshCw, 
  Sparkles,
  AlertTriangle,
  Tag
} from 'lucide-react';
import Modal from '../components/Modal';
import BarcodeModal from '../components/BarcodeModal';
import { TableRowSkeleton } from '../components/Skeleton';
import { api } from '../api/axios';

export default function BukuPage({ showNotification, user }) {
  const roleCode = user?.roleCode || (user?.username === 'admin' ? 'kepala_perpus' : user?.username === 'kepsek' ? 'kepala_sekolah' : 'petugas_sirkulasi');
  const [bukuList, setBukuList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [selectedBookForBarcode, setSelectedBookForBarcode] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    kd_buku: '',
    judul_buku: '',
    pengarang: '',
    penerbit: '',
    tahun_terbit: '',
    stok: 1,
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchBuku = async () => {
    setLoading(true);
    try {
      const res = await api.getBuku(search);
      if (res && res.data) {
        setBukuList(res.data.data || []);
      }
    } catch (err) {
      showNotification('Gagal memuat data buku: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuku();
  }, [search]);

  const handleOpenAdd = async () => {
    setIsEditMode(false);
    try {
      const nextCode = await api.generateKodeBuku();
      setFormData({
        kd_buku: nextCode,
        judul_buku: '',
        pengarang: '',
        penerbit: '',
        lokasi_rak: 'Rak A-01 (MIPA & Sains)',
        tahun_terbit: new Date().getFullYear().toString(),
        stok: 3,
      });
    } catch {
      setFormData({
        kd_buku: 'BK' + Math.floor(100 + Math.random() * 900),
        judul_buku: '',
        pengarang: '',
        penerbit: '',
        lokasi_rak: 'Rak A-01 (MIPA & Sains)',
        tahun_terbit: '2024',
        stok: 1,
      });
    }
    setIsModalOpen(true);
  };

  const handleOpenEdit = (buku) => {
    setIsEditMode(true);
    setFormData({
      kd_buku: buku.kd_buku,
      judul_buku: buku.judul_buku,
      pengarang: buku.pengarang,
      penerbit: buku.penerbit,
      lokasi_rak: buku.lokasi_rak || 'Rak A-01 (Umum)',
      tahun_terbit: buku.tahun_terbit,
      stok: buku.stok,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEditMode) {
        await api.updateBuku(formData.kd_buku, formData);
        showNotification('Data buku berhasil diperbarui!', 'success');
      } else {
        await api.createBuku(formData);
        showNotification('Buku baru berhasil ditambahkan ke katalog!', 'success');
      }
      setIsModalOpen(false);
      fetchBuku();
    } catch (err) {
      showNotification('Gagal menyimpan buku: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteCandidate) return;
    try {
      await api.deleteBuku(deleteCandidate.kd_buku);
      showNotification(`Buku '${deleteCandidate.judul_buku}' berhasil dihapus.`, 'success');
      setDeleteCandidate(null);
      fetchBuku();
    } catch (err) {
      showNotification('Gagal menghapus: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner Khusus Mode Supervisi Kepala Sekolah */}
      {roleCode === 'kepala_sekolah' && (
        <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900 flex items-center space-x-3 text-xs font-semibold">
          <span className="p-2 rounded-xl bg-purple-100 text-purple-700 font-bold">🏛️ Pengawasan</span>
          <div>
            <p className="font-extrabold text-sm">Mode Supervisi Eksekutif (Read-Only)</p>
            <p className="text-purple-700">Sebagai Kepala Sekolah, Anda dapat memeriksa seluruh inventaris buku perpustakaan untuk kepentingan akreditasi.</p>
          </div>
        </div>
      )}

      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <span>Master Data Buku</span>
          </h2>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Katalog dan inventaris buku SMA Muhammadiyah Pekalongan
          </p>
        </div>

        {roleCode !== 'kepala_sekolah' && (
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all self-start sm:self-auto focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Buku Baru</span>
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Cari buku berdasarkan judul, pengarang, penerbit"
            placeholder="Cari berdasarkan judul, pengarang, penerbit, atau kode buku..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-600 transition-all text-slate-900 font-medium"
          />
        </div>

        <button
          onClick={fetchBuku}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-300 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500"
          title="Segarkan Data"
          aria-label="Segarkan Data Buku"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
        </button>
      </div>

      {/* Tabel Data Buku dengan Skeleton Screen */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Kode Buku</th>
                <th className="py-3.5 px-4">Judul Buku</th>
                <th className="py-3.5 px-4">Pengarang</th>
                <th className="py-3.5 px-4">Penerbit</th>
                <th className="py-3.5 px-4">Lokasi Rak Fisik</th>
                <th className="py-3.5 px-4">Tahun</th>
                <th className="py-3.5 px-4 text-center">Stok Fisik</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <>
                  <TableRowSkeleton columns={8} />
                  <TableRowSkeleton columns={8} />
                  <TableRowSkeleton columns={8} />
                  <TableRowSkeleton columns={8} />
                </>
              ) : bukuList.length > 0 ? (
                bukuList.map((item) => (
                  <tr key={item.kd_buku} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <span className="px-2.5 py-1 bg-slate-100 rounded-md font-mono text-[11px] border border-slate-300 text-slate-800">
                        {item.kd_buku}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-900 font-bold max-w-xs truncate">
                      {item.judul_buku}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">{item.pengarang}</td>
                    <td className="py-3.5 px-4 text-slate-700">{item.penerbit}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 text-[11px] font-semibold border border-blue-200">
                        {item.lokasi_rak || 'Rak A-01 (Umum)'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono">{item.tahun_terbit}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        item.stok > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {item.stok > 0 ? `${item.stok} Tersedia` : 'Habis'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      {/* Tombol Cetak Label Barcode Buku (Dapat diakses semua akun termasuk Kepsek) */}
                      <button
                        onClick={() => setSelectedBookForBarcode(item)}
                        title="Cetak Label & Barcode Buku"
                        aria-label={`Barcode ${item.judul_buku}`}
                        className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500"
                      >
                        <Tag className="w-4 h-4 text-emerald-600" />
                      </button>

                      {roleCode === 'kepala_sekolah' ? (
                        <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-500 font-mono text-[10px] font-bold">
                          Terdata
                        </span>
                      ) : (
                        <>
                          <button
                            onClick={() => handleOpenEdit(item)}
                            title="Edit Buku"
                            aria-label={`Edit ${item.judul_buku}`}
                            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (roleCode === 'petugas_sirkulasi') {
                                showNotification('Hanya Kepala Perpustakaan yang berwenang menghapus koleksi buku secara permanen.', 'error');
                              } else {
                                setDeleteCandidate(item);
                              }
                            }}
                            title={roleCode === 'petugas_sirkulasi' ? 'Hanya Kepala Perpustakaan yang dapat menghapus' : 'Hapus Buku'}
                            aria-label={`Hapus ${item.judul_buku}`}
                            className="p-1.5 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-rose-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-slate-500 font-medium">
                    Tidak ditemukan data buku yang sesuai.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form Tambah / Edit Buku */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditMode ? 'Ubah Data Buku' : 'Tambah Koleksi Buku Baru'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-800 mb-1">Kode Buku (Primary Key)</label>
            <div className="relative">
              <input
                type="text"
                disabled={isEditMode}
                value={formData.kd_buku}
                onChange={(e) => setFormData({ ...formData, kd_buku: e.target.value.toUpperCase() })}
                placeholder="Contoh: BK001"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-600 font-mono font-bold uppercase disabled:bg-slate-100 disabled:text-slate-600 text-slate-900"
              />
              {!isEditMode && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-emerald-700 font-bold flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>Auto-Generated</span>
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">Judul Buku</label>
            <input
              type="text"
              value={formData.judul_buku}
              onChange={(e) => setFormData({ ...formData, judul_buku: e.target.value })}
              placeholder="Masukkan judul lengkap buku..."
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-600 text-slate-900 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-800 mb-1">Pengarang</label>
              <input
                type="text"
                value={formData.pengarang}
                onChange={(e) => setFormData({ ...formData, pengarang: e.target.value })}
                placeholder="Nama penulis"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-600 text-slate-900 font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-800 mb-1">Penerbit</label>
              <input
                type="text"
                value={formData.penerbit}
                onChange={(e) => setFormData({ ...formData, penerbit: e.target.value })}
                placeholder="Penerbit buku"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-600 text-slate-900 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">Lokasi Rak Fisik di Perpustakaan</label>
            <input
              type="text"
              value={formData.lokasi_rak || ''}
              onChange={(e) => setFormData({ ...formData, lokasi_rak: e.target.value })}
              placeholder="Contoh: Rak A-01 (MIPA & Sains)"
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-600 text-slate-900 font-semibold"
            />
            <p className="text-[10px] text-slate-500 mt-0.5">Memudahkan pencarian dan pengembalian buku di rak fisik perpustakaan.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-800 mb-1">Tahun Terbit</label>
              <input
                type="text"
                maxLength={4}
                value={formData.tahun_terbit}
                onChange={(e) => setFormData({ ...formData, tahun_terbit: e.target.value })}
                placeholder="Contoh: 2022"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-600 text-slate-900 font-medium font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-800 mb-1">Jumlah Stok Fisik</label>
              <input
                type="number"
                min={0}
                value={formData.stok}
                onChange={(e) => setFormData({ ...formData, stok: parseInt(e.target.value) || 0 })}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-600 text-slate-900 font-bold font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100 mt-5">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-600/25 disabled:opacity-50"
            >
              {submitting ? 'Menyimpan...' : (isEditMode ? 'Simpan Perubahan' : 'Tambahkan Buku')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Konfirmasi Hapus */}
      <Modal
        isOpen={Boolean(deleteCandidate)}
        onClose={() => setDeleteCandidate(null)}
        title="Konfirmasi Penghapusan Buku"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-xs">
          <div className="flex items-center space-x-3 p-3 bg-rose-50 text-rose-800 rounded-xl border border-rose-200 font-medium">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-600" />
            <p>
              Apakah Anda yakin ingin menghapus buku <strong>"{deleteCandidate?.judul_buku}"</strong> ({deleteCandidate?.kd_buku})? Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              onClick={() => setDeleteCandidate(null)}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-bold"
            >
              Batal
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-md shadow-rose-600/25"
            >
              Ya, Hapus Buku
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal Cetak Barcode & Label Punggung Buku */}
      <BarcodeModal
        isOpen={Boolean(selectedBookForBarcode)}
        onClose={() => setSelectedBookForBarcode(null)}
        book={selectedBookForBarcode}
      />
    </div>
  );
}
