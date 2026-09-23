import React from 'react';
import { StatCard } from '../common/StatCard';
import { Award, BookOpen, Calendar, CheckCircle2, User, Wallet, ShieldCheck, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SantriWaliDashboard: React.FC = () => {
  const { user } = useAuth();
  const isWali = user?.role === 'WALI_SANTRI';

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-800 to-teal-950 text-white rounded-2xl p-6 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-semibold mb-2">
          <span>{isWali ? 'Portal Wali Santri (Orang Tua)' : 'Portal Mandiri Santri'}</span>
          <span>•</span>
          <span>Scope: {isWali ? 'CHILD (Data Anak Kandung)' : 'OWN (Data Pribadi)'}</span>
        </div>
        <h2 className="text-2xl font-bold">
          {isWali ? 'Perkembangan Santri: Ahmad Muhammad Faqih' : 'Ahlan wa Sahlan, Ahmad Muhammad Faqih'}
        </h2>
        <p className="mt-1 text-sm text-emerald-100/80">
          NIS: 2026.03.1042 • Kelas 3A Aliyah • Asrama Umar bin Khattab (Kamar 02)
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Kehadiran Shalat & KBM"
          value="100%"
          subtitle="Bulan September 2026"
          badgeText="Sangat Rajin"
          badgeType="success"
          icon={CheckCircle2}
          colorScheme="emerald"
        />
        <StatCard
          title="Pencapaian Tahfidz"
          value="12 Juz Mutqin"
          subtitle="Ziyadah Terakhir: Surat Al-Qalam"
          badgeText="Lancar"
          badgeType="success"
          icon={Award}
          colorScheme="amber"
        />
        <StatCard
          title="Status SPP & Keuangan"
          value="Lunas"
          subtitle="Bulan September 2026"
          badgeText="Terverifikasi"
          badgeType="success"
          icon={ShieldCheck}
          colorScheme="blue"
        />
        <StatCard
          title="Saldo Uang Saku / Kantin"
          value="Rp 245.000"
          subtitle="Limit Harian: Rp 25.000"
          badgeText="Aman"
          badgeType="neutral"
          icon={Wallet}
          colorScheme="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profil Pembina & Asrama */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-600" />
            <span>Informasi Pembina & Pengasuh Santri</span>
          </h3>

          <div className="mt-4 space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 block">Wali Kelas 3A:</span>
              <span className="font-bold text-slate-900 text-sm block mt-0.5">
                Ustadz Ahmad Al-Farisi, Lc.
              </span>
              <span className="text-slate-500 text-[11px] block mt-0.5">Kontak Konsultasi: +62 815 4433 2211</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 block">Musyrif Pembina Asrama:</span>
              <span className="font-bold text-slate-900 text-sm block mt-0.5">
                Ustadz Hassan As-Segaf
              </span>
              <span className="text-slate-500 text-[11px] block mt-0.5">Gedung Umar bin Khattab (Kamar 02)</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 block">Kondisi Kesehatan Santri:</span>
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold mt-1">
                <Heart className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                <span>Sehat wal 'afiat, aktif mengikuti seluruh kegiatan pesantren</span>
              </div>
            </div>
          </div>
        </div>

        {/* Riwayat Mutaba'ah Harian */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-600" />
              <span>Mutaba'ah Ibadah Santri Hari Ini</span>
            </span>
            <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
              Tercatat Lengkap
            </span>
          </h3>

          <div className="mt-4 space-y-2.5 text-xs">
            {[
              { ibadah: 'Shalat Subuh Berjamaah', status: 'Hadir di Shaf Pertama', pic: 'Ust. Hassan' },
              { ibadah: 'Setoran Tahfidz Pagi', status: 'Ziyadah 1 Halaman (Surat Al-Mulk)', pic: 'Ust. Farisi' },
              { ibadah: 'KBM Diniyah & Nahwu', status: 'Aktif bertanya di kelas', pic: 'Ust. Farisi' },
              { ibadah: 'Shalat Dzuhur & Qailulah', status: 'Hadir tepat waktu', pic: 'Ust. Hassan' },
            ].map((item, idx) => (
              <div key={idx} className="p-2.5 rounded-lg border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800 block">{item.ibadah}</span>
                  <span className="text-[11px] text-slate-500">{item.status}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{item.pic}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
