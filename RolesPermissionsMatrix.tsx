import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { RoleDefinition, Permission, RoleType } from '../../types';
import { ShieldCheck, Check, X, Search, Info, Layers } from 'lucide-react';

export const RolesPermissionsMatrix: React.FC = () => {
  const [roles, setRoles] = useState<RoleDefinition[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedModule, setSelectedModule] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [rolesRes, permsRes] = await Promise.all([api.getRoles(), api.getPermissions()]);
        setRoles(rolesRes.roles);
        setPermissions(permsRes.permissions);
      } catch (err) {
        console.error('Error loading roles & permissions:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const modules = Array.from(new Set(permissions.map((p) => p.module)));

  const filteredPermissions = permissions.filter((p) => {
    const matchModule = selectedModule === 'ALL' || p.module === selectedModule;
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchModule && matchSearch;
  });

  const scopeLabels: Record<string, { label: string; desc: string; color: string }> = {
    GLOBAL: { label: 'GLOBAL', desc: 'Akses penuh seluruh data pesantren', color: 'bg-emerald-100 text-emerald-800' },
    DEPARTMENT: { label: 'DEPARTMENT', desc: 'Akses terbatas pada divisi/bidang kerja', color: 'bg-blue-100 text-blue-800' },
    ASSIGNED: { label: 'ASSIGNED', desc: 'Hanya santri/kelas/kamar yang ditugaskan resmi', color: 'bg-teal-100 text-teal-800' },
    OWN: { label: 'OWN', desc: 'Hanya data profil & riwayat pribadi sendiri', color: 'bg-purple-100 text-purple-800' },
    CHILD: { label: 'CHILD', desc: 'Hanya data anak santri yang terhubung dengan akun wali', color: 'bg-rose-100 text-rose-800' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-600" />
          <span>Matriks Hak Akses & Cakupan Data (RBAC Matrix)</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Prinsip Keamanan: ROLE + PERMISSION + SCOPE. Memastikan perlindungan data antar pengajar, santri, dan manajemen.
        </p>
      </div>

      {/* Scope Explanation Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-3">
          <Layers className="w-4 h-4 text-emerald-600" />
          <span>5 Tingkatan Cakupan Data (Data Scope)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
          {Object.entries(scopeLabels).map(([key, item]) => (
            <div key={key} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className={`px-2 py-0.5 rounded-full font-bold font-mono text-[10px] ${item.color}`}>
                {item.label}
              </span>
              <p className="text-slate-600 text-[11px] mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 10 Roles Cards Carousel / Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {roles.map((r) => (
          <div key={r.code} className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-slate-900">{r.name}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-100 rounded font-semibold text-slate-600">
                {r.defaultScope}
              </span>
            </div>
            <p className="text-slate-500 text-[11px] line-clamp-2">{r.description}</p>
            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>{r.permissions.length} Izin Akses</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Permission Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-slate-600">Filter Modul:</span>
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-800 focus:outline-hidden"
            >
              <option value="ALL">Semua Modul</option>
              {modules.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau kode izin..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4 min-w-[200px]">Izin Sistem (Permissions)</th>
                <th className="py-3 px-2 text-center">Super Admin</th>
                <th className="py-3 px-2 text-center">Direktur</th>
                <th className="py-3 px-2 text-center">Manager</th>
                <th className="py-3 px-2 text-center">Admin</th>
                <th className="py-3 px-2 text-center">Bendahara</th>
                <th className="py-3 px-2 text-center">Guru</th>
                <th className="py-3 px-2 text-center">Musyrif</th>
                <th className="py-3 px-2 text-center">Karyawan</th>
                <th className="py-3 px-2 text-center">Santri</th>
                <th className="py-3 px-2 text-center">Wali</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPermissions.map((perm) => (
                <tr key={perm.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-800 block">{perm.name}</span>
                    <span className="font-mono text-[10px] text-slate-400 block">{perm.code}</span>
                    <span className="text-[11px] text-slate-500">{perm.description}</span>
                  </td>

                  {/* Matrix Check for each role */}
                  {roles.map((role) => {
                    const hasPerm =
                      role.code === 'SUPER_ADMIN' || role.permissions.includes(perm.code);
                    return (
                      <td key={role.code} className="py-3 px-2 text-center">
                        {hasPerm ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-300 flex items-center justify-center mx-auto">
                            <X className="w-3 h-3 stroke-[2]" />
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
