import React from 'react';
import { StatCard } from '../common/StatCard';
import { Wallet, TrendingUp, ArrowDownRight, ArrowUpRight, Receipt, AlertTriangle, FileText } from 'lucide-react';
import { DashboardData } from '../../types';

interface DashboardProps {
  data?: DashboardData | null;
}

export const BendaharaDashboard: React.FC<DashboardProps> = ({ data }) => {
  const stats = data?.stats;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-amber-800 to-amber-950 text-white rounded-2xl p-6 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 text-xs font-semibold mb-2">
          <span>Otoritas Keuangan Pesantren</span>
          <span>•</span>
          <span>Scope: GLOBAL FINANCIAL</span>
        </div>
        <h2 className="text-2xl font-bold">Dashboard Bendahara & Keuangan</h2>
        <p className="mt-1 text-sm text-amber-100/80">
          Kelola penerimaan SPP, infaq jariyah, operasional asrama, dapur santri, dan laporan buku besar.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Pemasukan Bulan Ini"
          value="Rp 450.000.000"
          subtitle="92% Santri Tepat Waktu"
          badgeText="+12% vs Agustus"
          badgeType="success"
          icon={ArrowUpRight}
          colorScheme="emerald"
        />
        <StatCard
          title="Pengeluaran Operasional"
          value="Rp 285.000.000"
          subtitle="Gaji Guru, Sarpras & Konsumsi"
          badgeText="Sesuai Anggaran"
          badgeType="info"
          icon={ArrowDownRight}
          colorScheme="rose"
        />
        <StatCard
          title="Total Piutang Santri"
          value="Rp 18.500.000"
          subtitle="14 Santri Belum Lunas"
          badgeText="Perlu Tindak Lanjut"
          badgeType="warning"
          icon={AlertTriangle}
          colorScheme="amber"
        />
        <StatCard
          title="Kas Riil Terverifikasi"
          value="Rp 890.450.000"
          subtitle="Rekening Utama & Kas Kecil"
          badgeText="Sehat & Likuid"
          badgeType="success"
          icon={Wallet}
          colorScheme="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rekapitulasi Tagihan SPP */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-600" />
              <span>Status Pembayaran SPP September 2026</span>
            </span>
            <span className="text-xs text-slate-500">1.284 Santri</span>
          </h3>

          <div className="mt-4 space-y-3">
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Lunas (1.182 Santri)</span>
                <span className="text-emerald-600 font-bold">92.1%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '92.1%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Bayar Sebagian / Cicilan (88 Santri)</span>
                <span className="text-blue-600 font-bold">6.8%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '6.8%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Belum Bayar (14 Santri)</span>
                <span className="text-rose-600 font-bold">1.1%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-rose-500 h-2.5 rounded-full" style={{ width: '1.1%' }}></div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => alert('Modul Tagihan & Pembayaran Lengkap akan diimplementasikan pada FASE 6 - KEUANGAN.')}
              className="text-xs text-emerald-600 font-semibold hover:underline flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Lihat Rincian Seluruh Invoice SPP (Fase 6)</span>
            </button>
          </div>
        </div>

        {/* Transaksi Terakhir */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
            Arus Kas Terkini (Buku Kas Umum)
          </h3>
          <div className="mt-3 divide-y divide-slate-100 text-xs">
            {[
              { type: 'IN', title: 'Pembayaran SPP Santri Ahmad Muhammad', nominal: '+Rp 750.000', time: 'Hari ini, 10:15 WIB', via: 'Virtual Account BSI' },
              { type: 'IN', title: 'Wakaf Tunai Sarpras dari Wali Santri', nominal: '+Rp 5.000.000', time: 'Hari ini, 09:30 WIB', via: 'Transfer Bank Muamalat' },
              { type: 'OUT', title: 'Belanja Bahan Pokok Dapur Santri', nominal: '-Rp 14.800.000', time: 'Hari ini, 08:00 WIB', via: 'Kas Tunai Logistik' },
              { type: 'OUT', title: 'Pembayaran Listrik & Token Pesantren', nominal: '-Rp 6.250.000', time: 'Kemarin, 15:45 WIB', via: 'Auto-Debit PLN' },
            ].map((tx, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{tx.title}</p>
                  <p className="text-[11px] text-slate-400">{tx.via} • {tx.time}</p>
                </div>
                <span
                  className={`font-mono font-bold ${
                    tx.type === 'IN' ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {tx.nominal}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
