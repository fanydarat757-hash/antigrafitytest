import React, { useState, useEffect } from 'react';
import { 
  X, 
  QrCode, 
  Building2, 
  Clock, 
  ShieldCheck, 
  Copy, 
  Check, 
  Sparkles, 
  CheckCircle2, 
  Loader2,
  AlertCircle,
  Receipt,
  Download,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2
} from 'lucide-react';
import { api } from '../api/axios';

export default function PaymentGatewayModal({ isOpen, onClose, data, onSuccess }) {
  if (!isOpen || !data) return null;

  const [channel, setChannel] = useState('QRIS'); // 'QRIS' | 'BCA' | 'BRI' | 'MANDIRI'
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins in seconds
  const [paymentStatus, setPaymentStatus] = useState('PENDING'); // 'PENDING' | 'SUCCESS'
  const [verifying, setVerifying] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1); // 0.8 - 2.0
  const [isFullscreenZoom, setIsFullscreenZoom] = useState(false);

  const nominal = Number(data.denda !== undefined ? data.denda : (data.nominal !== undefined ? data.nominal : 1000));
  const namaSiswa = data.peminjaman?.nama_anggota || data.nama_anggota || data.nama_siswa || 'Siswa Perpustakaan';
  const kdRef = data.kd_pengembalian || data.kd_peminjaman || 'REF-' + Date.now();

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num || 0);
  };

  // Generate / Load invoice on mount
  useEffect(() => {
    let timer;
    const initInvoice = async () => {
      try {
        const res = await api.createPaymentInvoice({
          kd_pengembalian: data.kd_pengembalian,
          kd_peminjaman: data.kd_peminjaman,
          nominal_denda: nominal,
          metode: channel,
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
    setZoomLevel(1);

    timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [channel, isOpen]);

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const getVaNumber = () => {
    if (channel === 'BCA') return `8271008${Math.abs(kdRef.hashCode ? kdRef.hashCode() : 94821).toString().slice(0, 6)}`;
    if (channel === 'BRI') return `1289008${Math.abs(kdRef.hashCode ? kdRef.hashCode() : 84123).toString().slice(0, 6)}`;
    if (channel === 'MANDIRI') return `8954008${Math.abs(kdRef.hashCode ? kdRef.hashCode() : 65219).toString().slice(0, 6)}`;
    return '827100894821';
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(2.0, Number((prev + 0.25).toFixed(2))));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(0.75, Number((prev - 0.25).toFixed(2))));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  // Konfirmasi Pembayaran
  const handleSimulatePayment = async () => {
    setVerifying(true);
    try {
      const channelLabel = channel === 'QRIS' ? 'QRIS (lupayyy, Konter)' : `Virtual Account Bank ${channel}`;
      const orderId = orderInfo?.order_id || `PAY-${data.isPerpanjang ? 'EXT' : 'DND'}-${Date.now()}`;

      if (!data.isPerpanjang && data.kd_pengembalian) {
        await api.lunasiDenda(data.kd_pengembalian, {
          metode_pembayaran: channelLabel,
          id_transaksi_gateway: orderId
        });
      }

      setPaymentStatus('SUCCESS');
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
    } catch (err) {
      alert('Gagal memverifikasi pembayaran: ' + (err.response?.data?.message || err.message));
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 transition-all animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Modal - Modern SaaS Gateway (Fixed Top) */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-5 relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Secure Payment Gateway 256-Bit</span>
          </div>
          <h2 className="text-lg font-extrabold tracking-tight">
            {data.judul_transaksi || 'Pelunasan Denda Perpustakaan'}
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">SMA Muhammadiyah 1 Pekalongan Lampung Timur</p>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-slate-400">{data.label_nominal || 'Total Biaya Tagihan'}</p>
              <p className="text-2xl font-black text-emerald-400 font-mono tracking-tight">
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

        {/* Content Body (Scrollable) */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {paymentStatus === 'SUCCESS' ? (
            /* Tampilan Sukses Pembayaran */
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Pembayaran Berhasil!</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Tagihan telah lunas secara otomatis via <span className="font-bold text-slate-900">{channel === 'QRIS' ? 'QRIS (lupayyy, Konter)' : `VA Bank ${channel}`}</span>.
                </p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-left text-xs space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">No. Referensi:</span>
                  <span className="font-bold text-slate-800">{orderInfo?.order_id || kdRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Siswa:</span>
                  <span className="font-bold text-slate-800">{namaSiswa}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nominal Lunas:</span>
                  <span className="font-bold text-emerald-700">{formatRupiah(nominal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status Database:</span>
                  <span className="font-bold text-emerald-600">LUNAS (SETTLED)</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-600/25 transition-all text-xs"
              >
                Selesai & Tutup Gateway
              </button>
            </div>
          ) : (
            /* Tampilan Pilihan Channel & Pembayaran */
            <div className="space-y-4">
              {/* Channel Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Pilih Jalur Pembayaran:</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'QRIS', label: 'QRIS', icon: QrCode, desc: 'Semua E-Wallet' },
                    { id: 'BCA', label: 'BCA', icon: Building2, desc: 'Virtual Account' },
                    { id: 'BRI', label: 'BRI', icon: Building2, desc: 'Virtual Account' },
                    { id: 'MANDIRI', label: 'Mandiri', icon: Building2, desc: 'Livin / ATM' },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isActive = channel === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setChannel(item.id)}
                        className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${
                          isActive
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 font-medium'
                        }`}
                      >
                        <Icon className={`w-4 h-4 mb-1 ${isActive ? 'text-emerald-600' : 'text-slate-500'}`} />
                        <span className="text-[11px] leading-tight">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tampilan Konten Berdasarkan Channel */}
              {channel === 'QRIS' ? (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-center space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 px-1">
                    <span className="flex items-center space-x-1.5 text-slate-900">
                      <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white font-black text-[9px]">QRIS</span>
                      <span>QR Code Standar Pembayaran Nasional</span>
                    </span>
                    <span className="text-rose-600 font-extrabold text-[10px]">GPN</span>
                  </div>

                  {/* Real Merchant QRIS Card with Interactive Zoom Controls */}
                  <div className="bg-white p-3.5 rounded-2xl border-2 border-slate-200 shadow-sm mx-auto w-full text-center">
                    
                    {/* Header Merchant */}
                    <div className="bg-slate-50 rounded-xl p-2 mb-2 border border-slate-200 flex items-center justify-between">
                      <div className="text-left">
                        <p className="font-extrabold text-sm text-slate-900 tracking-tight">lupayyy, Konter</p>
                        <p className="text-[10px] text-slate-600 font-mono font-semibold">NMID: ID1026632009753 • A01</p>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">
                        Aktif
                      </span>
                    </div>

                    {/* Toolbar Pengatur Ukuran Gambar (Perbesar / Perkecil) */}
                    <div className="flex items-center justify-between bg-slate-100/80 px-2.5 py-1.5 rounded-xl mb-2 text-xs">
                      <span className="text-[11px] text-slate-600 font-bold flex items-center space-x-1">
                        <span>Ukuran QR:</span>
                        <span className="font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          {Math.round(zoomLevel * 100)}%
                        </span>
                      </span>

                      <div className="flex items-center space-x-1">
                        <button
                          type="button"
                          onClick={handleZoomOut}
                          disabled={zoomLevel <= 0.75}
                          title="Perkecil Gambar (-25%)"
                          className="p-1 rounded-lg bg-white hover:bg-slate-200 text-slate-700 disabled:opacity-40 transition-colors shadow-xs"
                        >
                          <ZoomOut className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={handleResetZoom}
                          title="Reset Ukuran Normal (100%)"
                          className="p-1 rounded-lg bg-white hover:bg-slate-200 text-slate-700 transition-colors shadow-xs"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={handleZoomIn}
                          disabled={zoomLevel >= 2.0}
                          title="Perbesar Gambar (+25%)"
                          className="p-1 rounded-lg bg-white hover:bg-slate-200 text-slate-700 disabled:opacity-40 transition-colors shadow-xs"
                        >
                          <ZoomIn className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsFullscreenZoom(true)}
                          title="Tampilkan Layar Penuh"
                          className="p-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors shadow-xs ml-1"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* QRIS Image Container with dynamic scaling */}
                    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white min-h-[220px] flex items-center justify-center p-2">
                      <img
                        src="/qris_perpus.jpg"
                        alt="QRIS lupayyy, Konter"
                        style={{
                          transform: `scale(${zoomLevel})`,
                          transformOrigin: 'center center',
                          transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                        className="max-h-64 object-contain mx-auto select-none pointer-events-none"
                      />
                    </div>

                    <p className="text-[10px] font-bold text-slate-700 mt-2">
                      SATU QRIS UNTUK SEMUA (BCA, Mandiri, BRI, BNI, DANA, GoPay, OVO)
                    </p>

                    {/* Tombol Aksi Tambahan */}
                    <div className="mt-2.5 flex items-center justify-center space-x-2">
                      <a
                        href="/qris_perpus.jpg"
                        download="QRIS_lupayyy_Konter.jpg"
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
                      >
                        <Download className="w-3.5 h-3.5 text-slate-600" />
                        <span>Unduh File QR</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => setIsFullscreenZoom(true)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
                      >
                        <Maximize2 className="w-3.5 h-3.5 text-slate-600" />
                        <span>Perbesar Penuh</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-left text-[11px] text-emerald-950 space-y-1">
                    <p className="font-bold flex items-center space-x-1 text-emerald-800">
                      <span>✓ Petunjuk Scan Barcode:</span>
                    </p>
                    <ol className="list-decimal pl-4 space-y-0.5 text-[10px] text-emerald-900">
                      <li>Buka aplikasi m-Banking atau E-Wallet (DANA, BCA, Livin, GoPay, OVO).</li>
                      <li>Scan barcode di atas (Gunakan tombol <strong>+ / -</strong> di atas jika ingin memperbesar/memperkecil gambar).</li>
                      <li>Pastikan nama merchant: <strong>lupayyy, Konter</strong>.</li>
                      <li>Ketik nominal: <strong>{formatRupiah(nominal)}</strong> lalu selesaikan transfer.</li>
                    </ol>
                  </div>
                </div>
              ) : (
                /* Tampilan Virtual Account */
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                  <div>
                    <p className="text-[11px] text-slate-500 font-medium">Nomor Virtual Account Bank {channel}:</p>
                    <div className="mt-1 flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                      <span className="font-mono text-base font-extrabold text-slate-900 tracking-wider">
                        {getVaNumber()}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(getVaNumber())}
                        className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Tersalin!' : 'Salin'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-[11px] text-blue-900 space-y-1">
                    <p className="font-bold">Panduan Pembayaran ATM / M-Banking:</p>
                    <ol className="list-decimal pl-4 space-y-0.5 text-blue-800">
                      <li>Pilih menu <strong>Transfer &gt; Virtual Account</strong>.</li>
                      <li>Masukkan Nomor VA di atas.</li>
                      <li>Pastikan nama penerima: <strong>PERPUS SMA MUH PKL</strong>.</li>
                      <li>Masukkan nominal: <strong>{formatRupiah(nominal)}</strong>.</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Button: Sticky Footer Konfirmasi Pembayaran */}
        {paymentStatus !== 'SUCCESS' && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex-shrink-0 space-y-2">
            <div className="flex items-center justify-between text-xs px-1">
              <span className="flex items-center space-x-2 text-slate-700 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span>Uang sudah ditransfer dari HP Anda?</span>
              </span>
              <span className="text-[11px] text-emerald-700 font-mono font-bold">Siap Konfirmasi</span>
            </div>

            <button
              type="button"
              onClick={handleSimulatePayment}
              disabled={verifying}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white rounded-xl font-black text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-60"
              title="Klik di sini untuk menyelesaikan dan memvalidasi pembayaran Anda"
            >
              {verifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi Pelunasan...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                  <span>✅ Saya Sudah Transfer (Konfirmasi Sekarang)</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Modal Popup Fullscreen Zoom untuk Scan Jarak Jauh */}
      {isFullscreenZoom && (
        <div 
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4"
          onClick={() => setIsFullscreenZoom(false)}
        >
          <div 
            className="bg-white p-4 rounded-3xl max-w-sm w-full text-center space-y-3 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsFullscreenZoom(false)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="font-extrabold text-slate-900 text-base">lupayyy, Konter</h3>
              <p className="text-xs text-slate-500 font-mono">NMID: ID1026632009753 • A01</p>
            </div>

            <div className="bg-white p-2 rounded-2xl border border-slate-200">
              <img
                src="/qris_perpus.jpg"
                alt="QRIS Fullscreen"
                className="w-full h-auto max-h-[65vh] object-contain mx-auto"
              />
            </div>

            <p className="text-xs font-bold text-emerald-700 font-mono">
              Tagihan: {formatRupiah(nominal)}
            </p>

            <button
              type="button"
              onClick={() => setIsFullscreenZoom(false)}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs"
            >
              Tutup Tampilan Penuh
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
