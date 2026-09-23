import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Tenant } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Building2, ShieldCheck, Database, KeyRound, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

export const TenantManagement: React.FC = () => {
  const { tenant: activeTenant, user } = useAuth();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testLoading, setTestLoading] = useState(false);

  const fetchTenants = async () => {
    setLoading(true);
    try {
      const res = await api.getTenants();
      setTenants(res.tenants);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  // Simulate cross-tenant unauthorized query attempt to prove security enforcement
  const handleTestCrossTenantSecurity = async () => {
    setTestLoading(true);
    setTestResult(null);
    try {
      // Intentionally request a different tenant ID that the current user does not belong to
      const fakeTargetTenant = activeTenant?.id === 'ten_darulmusthafa' ? 'ten_alhidayah' : 'ten_darulmusthafa';
      const token = localStorage.getItem('epesantren360_token');
      
      const res = await fetch(`/api/users?tenantId=${fakeTargetTenant}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (user?.role === 'SUPER_ADMIN') {
        setTestResult(`[SUPER ADMIN BYPASS] Super Admin berwenang menginspeksi seluruh data multi-tenant.`);
      } else if (res.status === 403) {
        setTestResult(`[UJI KEAMANAN BERHASIL - DITOLAK 403]: Server memblokir percobaan akses silang ke tenant '${fakeTargetTenant}'. Pesan: "${data.error}"`);
      } else {
        setTestResult(`Hasil respons: HTTP ${res.status}`);
      }
    } catch (err: any) {
      setTestResult(`Error: ${err.message}`);
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-600" />
          <span>Isolasi Multi-Tenant & Entitas Pesantren</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Arsitektur Multi-Tenant E-PESANTREN 360 memastikan data Pesantren A tidak dapat dilihat oleh Pesantren B.
        </p>
      </div>

      {/* Active Tenant Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider">
              Tenant Aktif Sesi Ini
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-1">{activeTenant?.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{activeTenant?.tagline}</p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs font-mono font-bold text-slate-700 block">ID: {activeTenant?.id}</span>
            <span className="text-[11px] text-slate-400 block">Kode Unik: {activeTenant?.code}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-5 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 block">Paket SaaS:</span>
            <span className="font-bold text-slate-900 text-sm block mt-0.5">{activeTenant?.plan} PLAN</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 block">Total Santri:</span>
            <span className="font-bold text-slate-900 text-sm block mt-0.5">{activeTenant?.totalStudents} Santri</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 block">Total Dewan Guru:</span>
            <span className="font-bold text-slate-900 text-sm block mt-0.5">{activeTenant?.totalTeachers} Ustadz</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 block">Status Keaktifan:</span>
            <span className="font-bold text-emerald-600 text-sm block mt-0.5">TERDAFTAR & AKTIF</span>
          </div>
        </div>
      </div>

      {/* Security Proof & Penetration Testing Tool */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm border border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-sm">Uji Forensik Isolasi Keamanan (Cross-Tenant Isolation Test)</h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Uji langsung proteksi backend: Tombol ini akan mengirimkan permintaan API palsu yang mencoba mengambil data
          milik lembaga lain. Server-side middleware kami akan langsung menolak dan mencatat insiden ke Log Audit.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={handleTestCrossTenantSecurity}
            disabled={testLoading}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {testLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <KeyRound className="w-3.5 h-3.5" />}
            <span>Jalankan Uji Isolasi Lintas Tenant</span>
          </button>
        </div>

        {testResult && (
          <div className="mt-4 p-3.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-mono text-emerald-300">
            {testResult}
          </div>
        )}
      </div>

      {/* Daftar Seluruh Lembaga yang Terdaftar di Sistem */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
          <span>Daftar Seluruh Tenant di Ekosistem SaaS E-PESANTREN 360</span>
          <span className="text-xs text-slate-500">Isolasi Database per tenant_id</span>
        </h3>

        <div className="mt-4 space-y-3">
          {tenants.map((t) => (
            <div
              key={t.id}
              className={`p-4 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                t.id === activeTenant?.id
                  ? 'border-emerald-300 bg-emerald-50/30 ring-1 ring-emerald-200'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{t.name}</span>
                  {t.id === activeTenant?.id && (
                    <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
                      SEDANG DIBUKA
                    </span>
                  )}
                </div>
                <p className="text-slate-500 mt-0.5">
                  {t.city} • Kontak: {t.phone} • Email: {t.email}
                </p>
                <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-400">
                  <span>ID: <code className="font-mono text-slate-600">{t.id}</code></span>
                  <span>Kode: <code className="font-mono text-slate-600">{t.code}</code></span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-left sm:text-right">
                  <span className="font-bold text-slate-900 block">{t.totalStudents} Santri</span>
                  <span className="text-[11px] text-slate-500 block">{t.totalTeachers} Guru</span>
                </div>
                <span className="px-3 py-1 bg-slate-100 text-slate-800 font-bold rounded-lg text-xs">
                  {t.plan}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
