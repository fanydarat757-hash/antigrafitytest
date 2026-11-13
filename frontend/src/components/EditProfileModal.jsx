import React, { useState, useEffect } from 'react';
import { Camera, User, Phone, MapPin, CheckCircle2, Upload } from 'lucide-react';
import Modal from './Modal';

export default function EditProfileModal({ isOpen, onClose, user, onSave }) {
  const [formData, setFormData] = useState({
    nama: '',
    kelas: '',
    role: '',
    telepon: '',
    alamat: '',
    foto: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nama: user.nama || '',
        kelas: user.kelas || '',
        role: user.role || '',
        telepon: user.telepon || '0821-7788-9900',
        alamat: user.alamat || 'Pekalongan, Lampung Timur',
        foto: user.foto || '',
      });
    }
  }, [user]);

  if (!isOpen || !user) return null;

  // Handle Upload Foto dari File Komputer / HP
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, foto: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...user,
      nama: formData.nama,
      kelas: formData.kelas,
      role: formData.role,
      telepon: formData.telepon,
      alamat: formData.alamat,
      foto: formData.foto,
    });
    onClose();
  };

  const isStudent = user.type === 'siswa';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ubah Profil & Foto Pengguna"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
        {/* Upload Foto Profil */}
        <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="relative group cursor-pointer">
            <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-emerald-500/30 border-2 border-emerald-500 shadow-md bg-slate-800">
              {formData.foto ? (
                <img
                  src={formData.foto}
                  alt="Foto Profil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <User className="w-12 h-12" />
                </div>
              )}
            </div>

            {/* Overlay Icon Kamera */}
            <label className="absolute inset-0 bg-slate-950/50 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-bold">Ganti Foto</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          </div>

          <label className="mt-3 inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-slate-700 font-bold hover:bg-slate-100 transition-colors cursor-pointer shadow-sm">
            <Upload className="w-3.5 h-3.5 text-emerald-600" />
            <span>Pilih File Foto...</span>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </label>
          <p className="text-[10px] text-slate-400 mt-1">Format: JPG, PNG, WEBP (Maks 2MB)</p>
        </div>

        {/* Input Nama Lengkap */}
        <div>
          <label className="block font-bold text-slate-800 mb-1">Nama Lengkap</label>
          <input
            type="text"
            required
            value={formData.nama}
            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-600 text-slate-900 font-bold"
          />
        </div>

        {/* Kelas atau Jabatan */}
        <div>
          <label className="block font-bold text-slate-800 mb-1">
            {isStudent ? 'Program Studi / Kelas' : 'Jabatan / Posisi'}
          </label>
          <input
            type="text"
            required
            value={isStudent ? formData.kelas : formData.role}
            onChange={(e) => setFormData({ 
              ...formData, 
              [isStudent ? 'kelas' : 'role']: e.target.value 
            })}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-600 text-slate-900 font-medium"
          />
        </div>

        {/* Nomor Telepon / WhatsApp */}
        <div>
          <label className="block font-bold text-slate-800 mb-1">Nomor Telepon / WhatsApp</label>
          <div className="relative">
            <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={formData.telepon}
              onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
              placeholder="0812-xxxx-xxxx"
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-600 text-slate-900 font-medium"
            />
          </div>
        </div>

        {/* Alamat */}
        <div>
          <label className="block font-bold text-slate-800 mb-1">Alamat Domisili</label>
          <div className="relative">
            <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={formData.alamat}
              onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
              placeholder="Kecamatan / Kabupaten"
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-600 text-slate-900 font-medium"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-600/25 flex items-center space-x-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}

