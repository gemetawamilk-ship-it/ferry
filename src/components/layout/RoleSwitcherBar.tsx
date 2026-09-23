import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { RoleType } from '../../types';
import { ShieldCheck, Building2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

const ROLES_LIST: { role: RoleType; label: string; badge: string; color: string }[] = [
  { role: 'SUPER_ADMIN', label: 'Super Admin', badge: 'Global SaaS', color: 'bg-purple-100 text-purple-800' },
  { role: 'DIREKTUR', label: 'Direktur', badge: 'Pimpinan', color: 'bg-emerald-100 text-emerald-800' },
  { role: 'MANAGER', label: 'Manager', badge: 'Departemen', color: 'bg-blue-100 text-blue-800' },
  { role: 'ADMIN', label: 'Admin', badge: 'Operasional', color: 'bg-indigo-100 text-indigo-800' },
  { role: 'BENDAHARA', label: 'Bendahara', badge: 'Keuangan', color: 'bg-amber-100 text-amber-800' },
  { role: 'PENGAJAR', label: 'Pengajar', badge: 'Ustadz Guru', color: 'bg-teal-100 text-teal-800' },
  { role: 'MUSYRIF', label: 'Musyrif', badge: 'Asrama', color: 'bg-cyan-100 text-cyan-800' },
  { role: 'KARYAWAN', label: 'Karyawan', badge: 'Staf Umum', color: 'bg-slate-100 text-slate-800' },
  { role: 'SANTRI', label: 'Santri', badge: 'Pelajar', color: 'bg-sky-100 text-sky-800' },
  { role: 'WALI_SANTRI', label: 'Wali Santri', badge: 'Orang Tua', color: 'bg-rose-100 text-rose-800' },
];

export const RoleSwitcherBar: React.FC = () => {
  const { user, tenant, switchRole, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(true);

  if (!user) return null;

  return (
    <div className="bg-slate-900 text-white border-b border-slate-800 px-4 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <div className="flex items-center gap-1.5 font-semibold text-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Mode Uji Coba Role & Tenant (Phase 1):</span>
          </div>
          <span className="hidden sm:inline-block text-slate-400 font-normal">
            Beralih peran secara instan untuk menguji RBAC & Hak Akses
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-300 font-medium">Lembaga:</span>
            <select
              value={tenant?.id || 'ten_darulmusthafa'}
              onChange={(e) => switchRole(user.role, e.target.value)}
              className="bg-transparent text-emerald-300 font-semibold focus:outline-hidden cursor-pointer"
            >
              <option value="ten_darulmusthafa" className="bg-slate-900 text-white">
                Darul Musthafa
              </option>
              <option value="ten_alhidayah" className="bg-slate-900 text-white">
                Al-Hidayah Modern
              </option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-300 font-medium">Scope:</span>
            <span className="font-mono text-amber-300 font-bold">{user.scope}</span>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 text-slate-400 hover:text-white px-2 py-1 rounded-md hover:bg-slate-800 transition-colors"
          >
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            <span>{isOpen ? 'Tutup' : 'Pilih Role'}</span>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="max-w-7xl mx-auto mt-2.5 pt-2.5 border-t border-slate-800 flex flex-wrap gap-1.5">
          {ROLES_LIST.map(({ role, label, color }) => {
            const isActive = user.role === role;
            return (
              <button
                key={role}
                id={`role-btn-${role.toLowerCase()}`}
                disabled={isLoading}
                onClick={() => switchRole(role, tenant?.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-emerald-500 text-white font-bold ring-2 ring-emerald-300 shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <span>{label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
