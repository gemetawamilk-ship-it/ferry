import React from 'react';
import { StaffStats } from '../../types';
import {
  Users,
  GraduationCap,
  HeartHandshake,
  UserCheck,
  UserX,
  Link2,
  ShieldCheck,
  Briefcase,
} from 'lucide-react';

interface StaffStatsOverviewProps {
  stats: StaffStats | null;
  onSelectTab: (tab: 'pegawai' | 'guru' | 'musyrif') => void;
}

export const StaffStatsOverview: React.FC<StaffStatsOverviewProps> = ({ stats, onSelectTab }) => {
  if (!stats) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
        Memuat statistik SDM pesantren...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Pegawai */}
        <div
          onClick={() => onSelectTab('pegawai')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total SDM Pegawai
            </span>
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{stats.totalEmployees}</span>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {stats.activeEmployees} Aktif
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {stats.inactiveEmployees} nonaktif / cuti
          </p>
        </div>

        {/* Guru / Pengajar */}
        <div
          onClick={() => onSelectTab('guru')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-sky-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Guru / Pengajar
            </span>
            <div className="p-2.5 rounded-lg bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{stats.totalTeachers}</span>
            <span className="text-xs font-medium text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">
              {stats.activeTeachers} Mengajar
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Ustadz & Asatidz terdaftar
          </p>
        </div>

        {/* Musyrif Pengasuh */}
        <div
          onClick={() => onSelectTab('musyrif')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-teal-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Musyrif Asrama
            </span>
            <div className="p-2.5 rounded-lg bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <HeartHandshake className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{stats.totalMusyrifs}</span>
            <span className="text-xs font-medium text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
              {stats.activeMusyrifs} Aktif Bertugas
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Pembina & Pengasuh santri
          </p>
        </div>

        {/* Akun User Terhubung */}
        <div
          onClick={() => onSelectTab('pegawai')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Akun Login SSO
            </span>
            <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Link2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{stats.withUserAccount}</span>
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
              Terhubung
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {stats.withoutUserAccount} pegawai belum punya akun login
          </p>
        </div>
      </div>

      {/* Detail Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribusi Tipe & Status Kepegawaian */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-600" />
              Distribusi Tipe & Status Kepegawaian
            </h3>
            <span className="text-xs text-slate-500">Master Data SDM</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
              <p className="text-xs text-slate-500">Guru</p>
              <p className="text-lg font-bold text-slate-800">{stats.byType.GURU}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
              <p className="text-xs text-slate-500">Musyrif</p>
              <p className="text-lg font-bold text-slate-800">{stats.byType.MUSYRIF}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
              <p className="text-xs text-slate-500">Staf Administrasi</p>
              <p className="text-lg font-bold text-slate-800">{stats.byType.STAF}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
              <p className="text-xs text-slate-500">Struktural</p>
              <p className="text-lg font-bold text-slate-800">{stats.byType.STRUKTURAL}</p>
            </div>
          </div>

          <div className="pt-2">
            <div className="text-xs font-semibold text-slate-700 mb-2">Status Ikatan Kerja:</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Pegawai Tetap Pesantren</span>
                <span className="font-bold text-slate-800">{stats.byEmploymentStatus.TETAP} Orang</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{
                    width: `${stats.totalEmployees ? (stats.byEmploymentStatus.TETAP / stats.totalEmployees) * 100 : 0}%`,
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-600">Pegawai Kontrak / PKWT</span>
                <span className="font-bold text-slate-800">{stats.byEmploymentStatus.KONTRAK} Orang</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-sky-500 h-full rounded-full"
                  style={{
                    width: `${stats.totalEmployees ? (stats.byEmploymentStatus.KONTRAK / stats.totalEmployees) * 100 : 0}%`,
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-600">Pengajar Honorer / Pengabdian</span>
                <span className="font-bold text-slate-800">
                  {stats.byEmploymentStatus.HONORER + stats.byEmploymentStatus.MAGANG} Orang
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{
                    width: `${
                      stats.totalEmployees
                        ? ((stats.byEmploymentStatus.HONORER + stats.byEmploymentStatus.MAGANG) /
                            stats.totalEmployees) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pemisahan Identitas SDM vs User Account Login */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              Arsitektur SDM: Personel vs User Login
            </h3>
            <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[11px] font-bold">
              Best Practice
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 leading-relaxed space-y-2">
            <p className="font-semibold text-slate-800">Prinsip Arsitektur Phase 2.3:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>
                <strong>Data Personel (Employee):</strong> Menyimpan identitas kepegawaian, biodata resmi, NIP, tanggal bergabung, nomor kontak, serta kualifikasi.
              </li>
              <li>
                <strong>User Account:</strong> Entitas kredensial sistem untuk login dan otorisasi RBAC (Role-Based Access Control).
              </li>
              <li>
                <strong>Relasi 1-to-1 Terkontrol:</strong> Satu pegawai dapat ditautkan ke satu akun user tanpa mengekspos kata sandi di tabel pegawai.
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                Ustadz (Laki-laki)
              </div>
              <p className="text-xl font-bold text-emerald-950">{stats.byGender.LAKI_LAKI}</p>
              <p className="text-[11px] text-emerald-700">Personel Ikhwan</p>
            </div>
            <div className="p-3 bg-rose-50/60 rounded-lg border border-rose-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-800 mb-1">
                <UserCheck className="w-4 h-4 text-rose-600" />
                Ustadzah (Perempuan)
              </div>
              <p className="text-xl font-bold text-rose-950">{stats.byGender.PEREMPUAN}</p>
              <p className="text-[11px] text-rose-700">Personel Akhwat</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
