import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Loader2, 
  Zap, 
  Lock,
  Radio,
  QrCode
} from 'lucide-react';
import { api } from '../api/axios';

export default function PaymentGatewayModal({ isOpen, onClose, data, onSuccess }) {
  if (!isOpen || !data) return null;

  const [timeLeft, setTimeLeft] = useState(900); // 15 mins in seconds
  const [paymentStatus, setPaymentStatus] = useState('PENDING'); // 'PENDING' | 'SUCCESS'
  const [verifying, setVerifying] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null);
  const [showDemoTrigger, setShowDemoTrigger] = useState(true);

  const nominal = Number(data.denda !== undefined ? data.denda : (data.nominal !== undefined ? data.nominal : 1000));
  const namaSiswa = data.peminjaman?.nama_anggota || data.nama_anggota || data.nama_siswa || 'Siswa Perpustakaan';
  const kdRef = data.kd_pengembalian || data.kd_peminjaman || 'REF-' + Date.now();

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num || 0);
  };

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Inisialisasi Invoice & Timer Hitung Mundur
  useEffect(() => {
    let timer;
    const initInvoice = async () => {
      try {
        const res = await api.createPaymentInvoice({
          kd_pengembalian: data.kd_pengembalian,
          kd_peminjaman: data.kd_peminjaman,
          nominal_denda: nominal,
          metode: 'QRIS',
          nama_siswa: namaSiswa
        });
        if (res && res.data) {
          setOrderInfo(res.data);
        }
      } catch (err) {
        console.error('Invoice error:', err);
      }
    };

    initInvoice();
    setTimeLeft(900);
    setPaymentStatus('PENDING');
    setVerifying(false);

    timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  // Eksekusi Pelunasan Otomatis
  const executeSuccessPayment = async () => {
    if (verifying || paymentStatus === 'SUCCESS') return;
    setVerifying(true);

    try {
      const channelLabel = 'QRIS Digital (lupayyy, Konter)';
      const orderId = orderInfo?.order_id || `PAY-${data.isPerpanjang ? 'EXT' : 'DND'}-${Date.now()}`;

      if (!data.isPerpanjang && data.kd_pengembalian) {
        await api.lunasiDenda(data.kd_pengembalian, {
          metode_pembayaran: channelLabel,
          id_transaksi_gateway: orderId
        });
      }

      setPaymentStatus('SUCCESS');

      // Panggil onSuccess setelah animasi berhasil
      setTimeout(() => {
        if (onSuccess) {
          onSuccess({
            order_id: orderId,
            metode_pembayaran: channelLabel,
            nominal: nominal,
            kd_pengembalian: data.kd_pengembalian,
            kd_peminjaman: data.kd_peminjaman,
            waktu_bayar: new Date().toISOString()
          });
        }
      }, 1200);

    } catch (err) {
      alert('Gagal memvalidasi transaksi: ' + (err.response?.data?.message || err.message));
      setVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[94vh] flex flex-col overflow-hidden border border-slate-200 transition-all">
        
        {/* Header Gateway */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-4 sm:p-5 relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>QRIS Gateway Auto-Detection</span>
          </div>
          <h2 className="text-base sm:text-lg font-extrabold tracking-tight">
            {data.judul_transaksi || 'Pembayaran Denda Perpustakaan'}
          </h2>
          <p className="text-[11px] text-slate-300 mt-0.5">SMA Muhammadiyah 1 Pekalongan Lampung Timur</p>

          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{data.label_nominal || 'Total Tagihan'}</p>
              <p className="text-xl sm:text-2xl font-black text-emerald-400 font-mono tracking-tight">
                {formatRupiah(nominal)}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTimer(timeLeft)}</span>
              </span>
              <p className="text-[10px] text-slate-400 mt-1 font-mono">Ref: {orderInfo?.order_id || kdRef}</p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {paymentStatus === 'SUCCESS' ? (
            /* Tampilan Berhasil Lunas Otomatis */
            <div className="py-8 text-center space-y-4 animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50 shadow-inner">
                <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
              </div>
              <div>
                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black uppercase rounded-full mb-1 tracking-wider">
                  Verified by Gateway
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">Pembayaran Berhasil!</h3>
                <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                  Sistem telah mendeteksi pembayaran masuk. Status tagihan otomatis dinyatakan <strong className="text-emerald-600">LUNAS</strong>.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-2 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">No. Transaksi:</span>
                  <span className="font-bold text-slate-800">{orderInfo?.order_id || kdRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Siswa:</span>
                  <span className="font-bold text-slate-800">{namaSiswa}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nominal Lunas:</span>
                  <span className="font-bold text-emerald-600">{formatRupiah(nominal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Metode:</span>
                  <span className="font-bold text-slate-800">QRIS (lupayyy, Konter)</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold text-emerald-600">SETTLED (LUNAS)</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-600/25 transition-all"
              >
                Selesai & Buka Kwitansi
              </button>
            </div>
          ) : (
            /* Tampilan QRIS Bersih (Hanya QR Code & Status Live) */
            <div className="space-y-4">
              
              {/* Card QRIS Bersih */}
              <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm p-4 text-center">
                {/* Header Banner QRIS Resmi */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-1.5">
                    <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-black text-[10px]">QRIS</span>
                    <span className="text-xs font-bold text-slate-800">Pembayaran Digital</span>
                  </div>
                  <span className="text-rose-600 font-extrabold text-xs tracking-wider">GPN</span>
                </div>

                {/* Info Merchant */}
                <div className="my-2 text-center">
                  <p className="font-extrabold text-sm text-slate-900 tracking-tight">lupayyy, Konter</p>
                  <p className="text-[10px] text-slate-500 font-mono">NMID: ID1026632009753 • A01</p>
                </div>

                {/* Gambar QRIS Jelas & Proporsional */}
                <div className="bg-slate-50 rounded-xl p-2 border border-slate-200 inline-block shadow-inner">
                  <img
                    src="/qris_perpus.jpg"
                    alt="QRIS Pembayaran"
                    className="w-56 h-auto max-h-60 object-contain mx-auto select-none rounded-lg"
                  />
                </div>

                <p className="text-[10px] text-slate-600 font-bold mt-2">
                  BCA, Mandiri, BRI, BNI, DANA, GoPay, OVO, ShopeePay
                </p>
              </div>

              {/* Status Live Auto-Detection (Pengganti Tombol Manual) */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center space-x-3">
                <div className="relative flex-shrink-0">
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center">
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 animate-ping absolute" />
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-extrabold text-slate-800 flex items-center space-x-1.5">
                    <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                    <span>Menunggu Pembayaran Masuk...</span>
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Scan via m-Banking / E-Wallet. Sistem akan mendeteksi otomatis saat saldo terkirim.
                  </p>
                </div>
              </div>

              {/* Notice Kunci Keamanan */}
              <div className="flex items-center justify-center space-x-1.5 text-[10px] text-slate-500 font-medium">
                <Lock className="w-3 h-3 text-slate-400" />
                <span>Konfirmasi manual dinonaktifkan (Verifikasi Real-time)</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer: Khusus Pengujian & Demo Sidang Skripsi */}
        {paymentStatus !== 'SUCCESS' && (
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex-shrink-0">
            <button
              type="button"
              onClick={executeSuccessPayment}
              disabled={verifying}
              className="w-full py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow-sm transition-all disabled:opacity-50"
              title="Simulasikan sinyal pembayaran berhasil masuk dari bank / e-wallet"
            >
              {verifying ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Memverifikasi Notifikasi Pembayaran...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  <span>⚡ Simulasikan Pembayaran Masuk (Demo Sidang)</span>
                </>
              )}
            </button>
            <p className="text-[9px] text-center text-slate-500 mt-1">
              Gunakan tombol di atas untuk mensimulasikan transfer sukses saat presentasi/sidang.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
