import React from 'react';
import { StatCard } from '../common/StatCard';
import { Users, Shield, Building2, UserPlus, FileClock, CheckCircle, Database } from 'lucide-react';
import { DashboardData } from '../../types';

interface DashboardProps {
  data?: DashboardData | null;
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<DashboardProps> = ({ onNavigateTab }) => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 text-xs font-semibold mb-2">
          <span>Administrator Operasional Pesantren</span>
          <span>•</span>
          <span>Scope: GLOBAL TENANT</span>
        </div>
        <h2 className="text-2xl font-bold">Pusat Kendali Administrasi</h2>
        <p className="mt-1 text-sm text-indigo-100/80">
          Kelola data pengguna, perizinan role (RBAC), audit keamanan sistem, dan master data pesantren.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Akun Pengguna Aktif"
          value="12 Pengguna"
          subtitle="Pimpinan, Staf, Guru, Musyrif"
          badgeText="Terverifikasi"
          badgeType="success"
          icon={Users}
          colorScheme="blue"
        />
        <StatCard
          title="Matriks Role Sistem"
          value="10 Peran"
          subtitle="Granular RBAC Enforced"
          badgeText="100% Aktif"
          badgeType="success"
          icon={Shield}
          colorScheme="emerald"
        />
        <StatCard
          title="Audit Log Terkini"
          value="5 Rekam Jejak"
          subtitle="Perubahan Tercatat Otomatis"
          badgeText="Realtime"
          badgeType="info"
          icon={FileClock}
          colorScheme="purple"
        />
        <StatCard
          title="Status Database & Multi-Tenant"
          value="Terisolasi"
          subtitle="ID: ten_darulmusthafa"
          badgeText="Aman"
          badgeType="success"
          icon={Database}
          colorScheme="amber"
        />
      </div>

      {/* Aksi Cepat Admin */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
          Aksi Cepat Administrator (Fase 1 Foundation)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-xs">
          <button
            onClick={() => onNavigateTab('users')}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50/50 hover:border-emerald-300 transition-all text-left group"
          >
            <div className="p-2 w-fit rounded-lg bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <UserPlus className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm mt-3">Kelola Pengguna & Akun</h4>
            <p className="text-slate-500 mt-1">
              Tambah pengguna baru, ubah peran, perbarui kontak, atau nonaktifkan akun staf/santri.
            </p>
          </button>

          <button
            onClick={() => onNavigateTab('roles')}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50/50 hover:border-amber-300 transition-all text-left group"
          >
            <div className="p-2 w-fit rounded-lg bg-amber-100 text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm mt-3">Matriks Hak Akses (RBAC)</h4>
            <p className="text-slate-500 mt-1">
              Periksa 10 peran sistem, izin granular, dan cakupan data (GLOBAL, ASSIGNED, CHILD, OWN).
            </p>
          </button>

          <button
            onClick={() => onNavigateTab('audit')}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-purple-50/50 hover:border-purple-300 transition-all text-left group"
          >
            <div className="p-2 w-fit rounded-lg bg-purple-100 text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <FileClock className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm mt-3">Periksa Log Audit Sistem</h4>
            <p className="text-slate-500 mt-1">
              Telusuri catatan keamanan: siapa melakukan apa, kapan, data sebelum dan sesudahnya.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
