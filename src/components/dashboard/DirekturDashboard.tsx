import React from 'react';
import { StatCard } from '../common/StatCard';
import {
  Users,
  UserCheck,
  GraduationCap,
  TrendingUp,
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { DashboardData } from '../../types';

interface DashboardProps {
  data?: DashboardData | null;
}

export const DirekturDashboard: React.FC<DashboardProps> = ({ data }) => {
  const stats = data?.stats;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-500/30">
            <span>Ringkasan Eksekutif Direktur</span>
            <span>•</span>
            <span>Scope Data: GLOBAL</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ahlan wa Sahlan, Pimpinan Pesantren
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            Sistem E-PESANTREN 360 memantau denyut kehidupan santri dari bangun tidur, tahfidz,
            pembelajaran hingga istirahat malam beserta transparansi keuangan terintegrasi.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-8 translate-y-8">
          <div className="w-80 h-80 rounded-full border-16 border-white/20"></div>
        </div>
      </div>

      {/* Row 1: Primary Operational & Academic KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          id="stat-santri"
          title="Total Santri Mukim"
          value={stats?.totalSantri?.toLocaleString('id-ID') || '1.284'}
          subtitle="Kapasitas Asrama Terisi 94%"
          badgeText="+32 Santri Baru"
          badgeType="success"
          icon={GraduationCap}
          colorScheme="emerald"
        />
        <StatCard
          id="stat-kehadiran-santri"
          title="Kehadiran Santri Hari Ini"
          value={`${stats?.kehadiranSantri || 96.8}%`}
          subtitle="Shalat Subuh & KBM Diniyah"
          badgeText="Sangat Disiplin"
          badgeType="success"
          icon={UserCheck}
          colorScheme="blue"
        />
        <StatCard
          id="stat-guru-karyawan"
          title="Total Ustadz & Staf"
          value={`${stats?.totalGuru || 84} Guru / ${stats?.totalKaryawan || 28} Staf`}
          subtitle="Presensi Guru: 98,2%"
          badgeText="Aktif Mengajar"
          badgeType="info"
          icon={Users}
          colorScheme="purple"
        />
        <StatCard
          id="stat-pelanggaran-izin"
          title="Kedisiplinan & Perizinan"
          value={`${stats?.pengasuhan.izinKeluarHariIni || 4} Izin / ${stats?.pengasuhan.pelanggaranBulanIni || 12} Pelanggaran`}
          subtitle="Status Asrama: Kondusif"
          badgeText="Terkendali"
          badgeType="neutral"
          icon={AlertCircle}
          colorScheme="amber"
        />
      </div>

      {/* Row 2: Financial Integrity Section */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-600" />
              <span>Transparansi Arus Keuangan & SPP Pesantren</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Data konsolidasi rekening penerimaan SPP, operasional, dan saldo kas riil
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">
            Kas Bersih: Rp 890.450.000
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-xs font-medium text-slate-500">Pemasukan Bulan Ini</span>
            <div className="flex items-center gap-1.5 mt-2">
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
              <span className="text-lg font-bold text-slate-900">Rp 450.000.000</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">92% dari target SPP</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-xs font-medium text-slate-500">Pengeluaran Operasional</span>
            <div className="flex items-center gap-1.5 mt-2">
              <ArrowDownRight className="w-4 h-4 text-rose-600" />
              <span className="text-lg font-bold text-slate-900">Rp 285.000.000</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Dapur, listrik & honorarium</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-xs font-medium text-slate-500">Total Tagihan Berjalan</span>
            <div className="flex items-center gap-1.5 mt-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-lg font-bold text-slate-900">Rp 125.000.000</span>
            </div>
            <span className="text-[11px] text-blue-600 font-medium">Jatuh tempo 25 September</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-xs font-medium text-slate-500">Piutang / Tunggakan SPP</span>
            <div className="flex items-center gap-1.5 mt-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span className="text-lg font-bold text-slate-900">Rp 18.500.000</span>
            </div>
            <span className="text-[11px] text-amber-600 font-medium">14 Santri mendapat beasiswa/tenggat</span>
          </div>
        </div>
      </div>

      {/* Row 3: Daily Routine & Life Cycle of Pesantren */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agenda Kehidupan Santri 24 Jam */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-6 shadow-2xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                <span>Siklus Kehidupan Pesantren Hari Ini</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pemantauan real-time dari bangun tidur, shalat, tahfidz hingga belajar malam
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono">Tahun Ajaran 2026/2027</span>
          </div>

          <div className="mt-5 divide-y divide-slate-100">
            {[
              { time: '03:45 - 04:30', activity: 'Bangun Tidur, Qiyamul Lail & Shalat Subuh', pic: 'Musyrif Asrama', status: 'Selesai', note: '1.270 santri hadir di Masjid Jami' },
              { time: '05:00 - 06:15', activity: 'Halaqah Tahfidz & Setoran Ziyadah Pagi', pic: 'Ustadz Halaqah', status: 'Selesai', note: 'Rata-rata 1.5 halaman/santri' },
              { time: '06:15 - 07:15', activity: 'Makan Pagi & Persiapan Masuk Kelas', pic: 'Divisi Dapur & Sarpras', status: 'Selesai', note: 'Menu 4 sehat terdistribusi' },
              { time: '07:30 - 11:45', activity: 'KBM Diniyah & Akademik (Sesi Pagi)', pic: 'Guru Pengajar', status: 'Berlangsung', note: 'Kelas 1 - 6 Aliyah aktif' },
              { time: '12:00 - 13:30', activity: 'Shalat Dzuhur, Makan Siang & Qailulah', pic: 'Musyrif & Wali Kelas', status: 'Terjadwal', note: 'Istirahat siang santri' },
              { time: '15:30 - 17:30', activity: 'Shalat Ashar, Olahraga & Kajian Kitab Kuning', pic: 'Asatidz', status: 'Terjadwal', note: 'Kitab Fathul Qorib' },
              { time: '18:00 - 20:30', activity: 'Maghrib, Dzikir Ratib, Isya & Muwajjahah', pic: 'Seluruh Pembina', status: 'Terjadwal', note: 'Belajar mandiri terbimbing' },
              { time: '21:30', activity: 'Absensi Kamar & Jam Malam Tidur', pic: 'Piket Musyrif', status: 'Terjadwal', note: 'Pintu asrama terkunci' },
            ].map((schedule, idx) => (
              <div key={idx} className="py-3 flex items-start justify-between gap-4 text-xs">
                <div className="flex items-start gap-3">
                  <span className="font-mono font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded shrink-0">
                    {schedule.time}
                  </span>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{schedule.activity}</p>
                    <p className="text-slate-500 mt-0.5">Penanggung Jawab: {schedule.pic}</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">{schedule.note}</p>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0 ${
                    schedule.status === 'Selesai'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : schedule.status === 'Berlangsung'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200 animate-pulse'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {schedule.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Notifikasi Direktur & Aksi Persetujuan */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
              Persetujuan & Kebijakan Pimpinan
            </h3>
            <div className="mt-3 space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200/80">
                <span className="font-bold text-amber-900 block">Pengadaan Kitab Fathul Bari</span>
                <span className="text-amber-800 mt-1 block">
                  Permohonan anggaran Rp 8.500.000 dari Kepala Perpustakaan & Akademik.
                </span>
                <div className="mt-2.5 flex items-center gap-2">
                  <button className="px-2.5 py-1 bg-emerald-600 text-white rounded font-semibold hover:bg-emerald-700">
                    Setujui (Approve)
                  </button>
                  <button className="px-2.5 py-1 bg-white border border-slate-300 text-slate-700 rounded font-semibold hover:bg-slate-50">
                    Tinjau
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200/80">
                <span className="font-bold text-blue-900 block">Izin Pulang Santri Kritis</span>
                <span className="text-blue-800 mt-1 block">
                  Santri M. Raihan (Kelas 2B) izin karena orang tua sakit di Surabaya. Disertai surat dokter.
                </span>
                <div className="mt-2.5 flex items-center gap-2">
                  <button className="px-2.5 py-1 bg-emerald-600 text-white rounded font-semibold hover:bg-emerald-700">
                    Beri Izin
                  </button>
                  <button className="px-2.5 py-1 bg-white border border-slate-300 text-slate-700 rounded font-semibold hover:bg-slate-50">
                    Detail
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
              <span>Keamanan & RBAC Aktif</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                TERVERIFIKASI
              </span>
            </h3>
            <ul className="mt-3 space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Isolasi Multi-Tenant Enforced</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Audit Trail Logging Realtime</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Server-side Permission Check Aktif</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
