import React from 'react';
import { StatCard } from '../common/StatCard';
import { Building2, Globe, ShieldAlert, Users, Server, Database, CheckCircle2 } from 'lucide-react';
import { DashboardData } from '../../types';

interface DashboardProps {
  data?: DashboardData | null;
  onNavigateTab: (tab: string) => void;
}

export const SuperAdminDashboard: React.FC<DashboardProps> = ({ onNavigateTab }) => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-black text-white rounded-2xl p-6 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 text-xs font-semibold mb-2">
          <span>Pemilik Platform SaaS (E-PESANTREN 360)</span>
          <span>•</span>
          <span>Scope: GLOBAL SAAS PLATFORM</span>
        </div>
        <h2 className="text-2xl font-bold">Pusat Manajemen Multi-Tenant SaaS</h2>
        <p className="mt-1 text-sm text-purple-100/80">
          Mengawasi seluruh pondok pesantren yang berlangganan platform, isolasi database, dan kapasitas sistem.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pesantren Terdaftar (Tenants)"
          value="3 Pesantren"
          subtitle="Darul Musthafa, Al-Hidayah, Madinah"
          badgeText="100% Aktif"
          badgeType="success"
          icon={Building2}
          colorScheme="purple"
        />
        <StatCard
          title="Total Santri Platform"
          value="2.744 Santri"
          subtitle="Akumulasi Seluruh Pesantren"
          badgeText="SaaS Skala Besar"
          badgeType="info"
          icon={Users}
          colorScheme="blue"
        />
        <StatCard
          title="Isolasi Tenant Security"
          value="Ketat & Terisolasi"
          subtitle="tenant_id enforced di backend"
          badgeText="Lolos Uji Forensik"
          badgeType="success"
          icon={ShieldAlert}
          colorScheme="emerald"
        />
        <StatCard
          title="Infrastruktur & Cloud"
          value="Normal (100% SLA)"
          subtitle="Node / Express / Multi-Tenant"
          badgeText="Stabil"
          badgeType="success"
          icon={Server}
          colorScheme="amber"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-2xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-600" />
              <span>Daftar Pesantren & Langganan SaaS Aktif</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Setiap pesantren terisolasi dalam partition data tersendiri tanpa kebocoran data silang
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('tenants')}
            className="text-xs bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-purple-100"
          >
            Lihat Modul Isolasi Tenant
          </button>
        </div>

        <div className="mt-4 divide-y divide-slate-100 text-xs">
          {[
            { name: 'Pesantren Darul Musthafa Al-Islamiyah', code: 'darulmusthafa', city: 'Cisarua, Bogor', santri: 1284, guru: 84, plan: 'PRO' },
            { name: 'Pondok Pesantren Al-Hidayah Modern', code: 'alhidayah', city: 'Sukabumi, Jawa Barat', santri: 940, guru: 62, plan: 'ENTERPRISE' },
            { name: 'Madinah Islamic Boarding School', code: 'madinah', city: 'Malang, Jawa Timur', santri: 520, guru: 38, plan: 'BASIC' },
          ].map((t, idx) => (
            <div key={idx} className="py-3.5 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-bold text-slate-900 text-sm">{t.name}</span>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Kode: <span className="font-mono font-semibold text-slate-700">{t.code}</span> • Lokasi: {t.city}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-slate-600">
                  <strong className="text-slate-900">{t.santri}</strong> Santri •{' '}
                  <strong className="text-slate-900">{t.guru}</strong> Guru
                </span>
                <span className="px-2.5 py-1 bg-purple-100 text-purple-800 font-bold rounded-md text-[10px]">
                  {t.plan} PLAN
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
