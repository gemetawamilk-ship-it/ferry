import React from 'react';
import { StudentStats } from '../../types';
import {
  Users,
  UserCheck,
  BedDouble,
  Home,
  GraduationCap,
  AlertTriangle,
  HeartHandshake,
  CheckCircle2,
} from 'lucide-react';

interface StudentStatsOverviewProps {
  stats: StudentStats | null;
}

export const StudentStatsOverview: React.FC<StudentStatsOverviewProps> = ({ stats }) => {
  if (!stats) {
    return (
      <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
        <p className="text-slate-500 text-sm">Memuat data statistik kesiswaan...</p>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Santri Terdaftar',
      value: stats.totalStudents,
      icon: Users,
      color: 'from-blue-500 to-indigo-600',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      label: 'Santri Aktif Belajar',
      value: stats.activeStudents,
      icon: UserCheck,
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
    },
    {
      label: 'Santri Putra (Ikhwan)',
      value: stats.maleStudents,
      icon: GraduationCap,
      color: 'from-sky-500 to-cyan-600',
      textColor: 'text-sky-600',
      bgColor: 'bg-sky-50',
      borderColor: 'border-sky-200',
    },
    {
      label: 'Santri Putri (Akhwat)',
      value: stats.femaleStudents,
      icon: GraduationCap,
      color: 'from-rose-500 to-pink-600',
      textColor: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
    },
    {
      label: 'Santri Menetap di Kamar',
      value: stats.withRoom,
      icon: BedDouble,
      color: 'from-teal-500 to-emerald-700',
      textColor: 'text-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
    },
    {
      label: 'Belum Memiliki Kamar',
      value: stats.withoutRoom,
      icon: Home,
      color: 'from-amber-500 to-orange-600',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
    },
    {
      label: 'Total Wali Santri Terdaftar',
      value: stats.totalParents,
      icon: HeartHandshake,
      color: 'from-purple-500 to-violet-600',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`bg-white rounded-xl p-5 border ${card.borderColor} shadow-xs hover:shadow-md transition-shadow relative overflow-hidden`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {card.label}
                  </p>
                  <p className="text-3xl font-black text-slate-900 mt-2 font-mono">{card.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${card.bgColor} ${card.textColor} flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Distribusi Status Santri
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Aktif Belajar', key: 'ACTIVE', color: 'bg-emerald-500', count: stats.byStatus.ACTIVE },
              { label: 'Telah Lulus (Alumni)', key: 'GRADUATED', color: 'bg-blue-500', count: stats.byStatus.GRADUATED },
              { label: 'Mutasi / Pindah', key: 'MUTASI', color: 'bg-purple-500', count: stats.byStatus.MUTASI },
              { label: 'Dalam Masa Skorsing', key: 'SUSPENDED', color: 'bg-amber-500', count: stats.byStatus.SUSPENDED },
              { label: 'Drop Out / Berhenti', key: 'DROPOUT', color: 'bg-rose-500', count: stats.byStatus.DROPOUT },
            ].map((item) => {
              const percentage = stats.totalStudents > 0 ? Math.round((item.count / stats.totalStudents) * 100) : 0;
              return (
                <div key={item.key}>
                  <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                    <span>{item.label}</span>
                    <span className="font-mono font-bold">
                      {item.count} santri ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Program Distribution */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            Sebaran Berdasarkan Program Pendidikan
          </h3>
          {Object.keys(stats.byProgram).length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">Belum ada data program santri.</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(stats.byProgram).map(([programName, count]) => {
                const percentage = stats.totalStudents > 0 ? Math.round((count / stats.totalStudents) * 100) : 0;
                return (
                  <div key={programName}>
                    <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                      <span className="truncate max-w-[200px]">{programName}</span>
                      <span className="font-mono font-bold">
                        {count} santri ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
