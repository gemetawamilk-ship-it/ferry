import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserCheck, Shield, Building, Lock, CheckCircle2, Key } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, tenant, roleDefinition, permissions } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-emerald-600" />
          <span>Profil Pengguna & Izin Akses Aktif</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Informasi akun, lembaga pesantren terdaftar, serta otoritas peran yang terenkripsi dalam sesi Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Card */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-2xs text-xs">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white font-black text-2xl flex items-center justify-center shadow-md">
              {user?.fullName.charAt(0)}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{user?.fullName}</h3>
              <p className="text-slate-500 text-xs">@{user?.username}</p>
              <span className="mt-1 inline-block px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px]">
                {roleDefinition?.name}
              </span>
            </div>
          </div>

          <div className="mt-4 space-y-2.5">
            <div>
              <span className="text-slate-400 block text-[11px]">Email Resmi:</span>
              <span className="font-semibold text-slate-800">{user?.email}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Nomor Kontak:</span>
              <span className="font-semibold text-slate-800">{user?.phone || '-'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Cakupan Data (Scope):</span>
              <span className="font-mono font-bold text-slate-800 px-2 py-0.5 bg-slate-100 rounded inline-block mt-0.5">
                {user?.scope}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Penugasan Entitas:</span>
              <span className="font-semibold text-slate-800">{user?.assignedEntityName || 'Pusat Pesantren'}</span>
            </div>
          </div>
        </div>

        {/* Tenant Information Card */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-2xs text-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm">Afiliasi Pesantren (Tenant)</h3>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <span className="text-slate-400 block text-[11px]">Nama Lembaga:</span>
              <span className="font-bold text-slate-900 text-sm">{tenant?.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Kode Identifikasi:</span>
              <span className="font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded">{tenant?.code}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Alamat & Kota:</span>
              <span className="text-slate-700">{tenant?.city}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Status Langganan SaaS:</span>
              <span className="font-bold text-emerald-600">{tenant?.plan} SUBSCRIPTION</span>
            </div>
          </div>
        </div>

        {/* Security & Token Info */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-2xs text-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Lock className="w-4 h-4 text-amber-600" />
            <h3 className="font-bold text-slate-900 text-sm">Keamanan & Token Sesi</h3>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <span className="text-slate-400 block text-[11px]">Metode Enkripsi:</span>
              <span className="font-mono text-slate-800">Bearer Token (JWT Standard)</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Isolasi Tenant Terverifikasi:</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Backend Filter Aktif</span>
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Jumlah Hak Akses:</span>
              <span className="font-bold text-slate-900">{permissions.length} Izin Operasional</span>
            </div>
          </div>
        </div>
      </div>

      {/* Permissions Breakdown */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
          <Key className="w-4 h-4 text-emerald-600" />
          <span>Daftar Hak Akses Otoritatif Akun Anda ({permissions.length} Hak Akses)</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 mt-4">
          {permissions.map((permCode) => (
            <div
              key={permCode}
              className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg text-[11px] flex items-center gap-2"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="font-mono text-slate-700 truncate">{permCode}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
