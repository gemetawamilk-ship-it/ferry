import React from 'react';
import { StatCard } from '../common/StatCard';
import { BookOpen, Calendar, CheckCircle2, Clock, Users, Award, FileCheck } from 'lucide-react';
import { DashboardData } from '../../types';

interface DashboardProps {
  data?: DashboardData | null;
}

export const PengajarDashboard: React.FC<DashboardProps> = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-800 to-teal-950 text-white rounded-2xl p-6 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-200 text-xs font-semibold mb-2">
          <span>Portal Guru & Pengajar</span>
          <span>•</span>
          <span>Scope Data: ASSIGNED (Kelas Binaan)</span>
        </div>
        <h2 className="text-2xl font-bold">Ustadz Ahmad Al-Farisi, Lc.</h2>
        <p className="mt-1 text-sm text-teal-100/80">
          Mata Pelajaran: Nahwu Wadih, Jurumiyah & Halaqah Tahfidz Al-Quran
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Kelas Yang Diampu"
          value="3 Kelas"
          subtitle="Kelas 3A, 3B, dan 4A Aliyah"
          badgeText="96 Santri"
          badgeType="info"
          icon={Users}
          colorScheme="emerald"
        />
        <StatCard
          title="Jam Mengajar Pekan Ini"
          value="18 Jam Tatap Muka"
          subtitle="12 Jam Selesai, 6 Jam Tersisa"
          badgeText="Sesuai Silabus"
          badgeType="success"
          icon={Clock}
          colorScheme="blue"
        />
        <StatCard
          title="Rata-rata Presensi Kelas"
          value="98.5%"
          subtitle="Tingkat Kehadiran Santri Tinggi"
          badgeText="Disiplin"
          badgeType="success"
          icon={CheckCircle2}
          colorScheme="purple"
        />
        <StatCard
          title="Setoran Tahfidz Masuk"
          value="42 Santri"
          subtitle="Halaqah Pagi Subuh & Ashar"
          badgeText="Ziyadah Aktif"
          badgeType="neutral"
          icon={Award}
          colorScheme="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Jadwal Hari Ini */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-600" />
              <span>Jadwal Mengajar Hari Ini</span>
            </span>
            <span className="text-xs text-slate-500">Senin, 21 September 2026</span>
          </h3>

          <div className="mt-3 space-y-3 text-xs">
            <div className="p-3 rounded-lg border border-teal-200 bg-teal-50/50 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider">07:30 - 09:00 WIB • Ruang 3A</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">Nahwu Wadih: Bab I'rab Fi'il Mudhari'</p>
                <p className="text-slate-600 mt-1">Status: Sudah selesai presensi (32/32 Hadir)</p>
              </div>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-semibold rounded text-[10px]">
                Selesai
              </span>
            </div>

            <div className="p-3 rounded-lg border border-blue-200 bg-blue-50/50 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">10:00 - 11:30 WIB • Ruang 3B</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">Matan Al-Jurumiyah: Isim-isim Manshub</p>
                <p className="text-slate-600 mt-1">Status: Siap masuk kelas</p>
              </div>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-semibold rounded text-[10px]">
                Mendatang
              </span>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">16:00 - 17:15 WIB • Masjid Jami</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">Halaqah Tahfidz: Ziyadah Juz 28</p>
                <p className="text-slate-600 mt-1">Peserta: 12 Santri binaan halaqah</p>
              </div>
              <span className="px-2 py-0.5 bg-slate-200 text-slate-700 font-semibold rounded text-[10px]">
                Sore
              </span>
            </div>
          </div>
        </div>

        {/* Input Nilai & Evaluasi Santri */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>Cakupan Hak Akses Pengajar</span>
            </span>
            <span className="text-[10px] bg-slate-100 font-mono px-2 py-0.5 rounded text-slate-600">
              Scope: ASSIGNED
            </span>
          </h3>

          <div className="mt-4 p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
            <p className="font-semibold text-slate-800">
              Prinsip Keamanan E-PESANTREN 360 untuk Pengajar:
            </p>
            <p>
              ✓ Ustadz hanya dapat melihat dan menginput absensi/nilai untuk kelas yang secara resmi ditugaskan (Kelas 3A, 3B).
            </p>
            <p>
              ✗ Sistem backend menolak akses ke Kelas 3C atau kelas lain secara otomatis jika dicoba manipulasi ID URL.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Modul Nilai & Raport:</span>
            <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
              Siap dibuka pada Fase 3 (Akademik)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
