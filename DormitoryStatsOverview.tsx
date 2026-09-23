import React from 'react';
import { DormitoryStats } from '../../types';
import { Building2, BedDouble, Wrench, CheckCircle2, XCircle, Users } from 'lucide-react';

interface DormitoryStatsOverviewProps {
  stats: DormitoryStats | null;
  loading: boolean;
  onNavigateTab: (tab: 'gedung' | 'asrama' | 'kamar') => void;
}

export const DormitoryStatsOverview: React.FC<DormitoryStatsOverviewProps> = ({
  stats,
  loading,
  onNavigateTab,
}) => {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-slate-200 rounded-xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Gedung */}
        <div
          id="stat-total-gedung"
          onClick={() => onNavigateTab('gedung')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Gedung
            </span>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-800 tracking-tight">
              {stats.totalBuildings}
            </span>
            <span className="text-xs text-slate-500 font-medium">Gedung Fisik</span>
          </div>
          <p className="mt-1 text-[11px] text-emerald-600 font-medium group-hover:underline">
            Klik untuk kelola gedung &rarr;
          </p>
        </div>

        {/* Total Asrama */}
        <div
          id="stat-total-asrama"
          onClick={() => onNavigateTab('asrama')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-sky-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Unit Asrama
            </span>
            <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-800 tracking-tight">
              {stats.totalDormitories}
            </span>
            <span className="text-xs text-slate-500 font-medium">Kompleks/Blok</span>
          </div>
          <p className="mt-1 text-[11px] text-sky-600 font-medium group-hover:underline">
            Klik untuk kelola unit asrama &rarr;
          </p>
        </div>

        {/* Total Kamar & Kapasitas */}
        <div
          id="stat-total-kamar"
          onClick={() => onNavigateTab('kamar')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Kamar
            </span>
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <BedDouble className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-800 tracking-tight">
              {stats.totalRooms}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              ({stats.totalCapacity} Kapasitas Santri)
            </span>
          </div>
          <p className="mt-1 text-[11px] text-indigo-600 font-medium group-hover:underline">
            Klik untuk rincian kamar &rarr;
          </p>
        </div>

        {/* Status Operasional Kamar */}
        <div
          id="stat-status-kamar"
          onClick={() => onNavigateTab('kamar')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Kondisi Kamar
            </span>
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Wrench className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              {stats.activeRooms} Aktif
            </span>
            <span className="flex items-center gap-1.5 text-amber-700 font-medium">
              <Wrench className="w-3.5 h-3.5 text-amber-500" />
              {stats.maintenanceRooms} Perbaikan
            </span>
            <span className="flex items-center gap-1.5 text-slate-500 font-medium">
              <XCircle className="w-3.5 h-3.5 text-slate-400" />
              {stats.inactiveRooms} Nonaktif
            </span>
          </div>
          <p className="mt-2 text-[11px] text-amber-600 font-medium group-hover:underline">
            Kelola status pemeliharaan &rarr;
          </p>
        </div>
      </div>

      {/* Institutional Dormitory Notice / Information Box */}
      <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-900">
        <div>
          <span className="font-bold text-emerald-800">Struktur Hierarki Master Sarana Pesantren: </span>
          <span className="text-emerald-700">
            Tenant Pesantren &rarr; Gedung &rarr; Unit Asrama (Musyrif) &rarr; Kamar Santri (Kapasitas & Pemeliharaan).
          </span>
        </div>
        <span className="shrink-0 px-2 py-0.5 rounded bg-emerald-600 text-white font-mono font-semibold text-[11px]">
          FASE 2.2 ISOLASI MULTI-TENANT AKTIF
        </span>
      </div>
    </div>
  );
};
