import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { AuditLog } from '../../types';
import { FileClock, Search, RefreshCw, ShieldAlert, Filter } from 'lucide-react';

export const AuditLogView: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.getAuditLogs();
      setLogs(res.logs);
    } catch (e) {
      console.error('Failed to load audit logs:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((l) => {
    const matchAction = actionFilter === 'ALL' || l.action === actionFilter;
    const matchSearch =
      l.userName.toLowerCase().includes(search.toLowerCase()) ||
      l.entityName.toLowerCase().includes(search.toLowerCase()) ||
      l.module.toLowerCase().includes(search.toLowerCase()) ||
      (l.newData && l.newData.toLowerCase().includes(search.toLowerCase()));
    return matchAction && matchSearch;
  });

  const actionStyles: Record<string, { label: string; color: string }> = {
    LOGIN: { label: 'LOGIN', color: 'bg-emerald-100 text-emerald-800' },
    LOGIN_SUCCESS: { label: 'LOGIN SUKSES', color: 'bg-emerald-100 text-emerald-800' },
    LOGIN_FAILED: { label: 'LOGIN GAGAL', color: 'bg-rose-100 text-rose-800' },
    LOGOUT: { label: 'LOGOUT', color: 'bg-slate-100 text-slate-800' },
    CREATE_USER: { label: 'TAMBAH USER', color: 'bg-blue-100 text-blue-800' },
    USER_CREATED: { label: 'TAMBAH USER', color: 'bg-blue-100 text-blue-800' },
    USER_UPDATED: { label: 'UBAH DATA', color: 'bg-amber-100 text-amber-800' },
    USER_SOFT_DELETED: { label: 'SOFT DELETE', color: 'bg-rose-100 text-rose-800' },
    APPROVE_DISBURSEMENT: { label: 'PERSETUJUAN KAS', color: 'bg-teal-100 text-teal-800' },
    ATTENDANCE_RECORD: { label: 'PRESENSI SUBUH', color: 'bg-cyan-100 text-cyan-800' },
    DEMO_ROLE_SWITCH: { label: 'GANTI PERAN', color: 'bg-purple-100 text-purple-800' },
    UNAUTHORIZED_ACCESS_ATTEMPT: { label: 'AKSES DITOLAK (403)', color: 'bg-rose-100 text-rose-800' },
    CROSS_TENANT_VIOLATION_ATTEMPT: { label: 'PELANGGARAN TENANT', color: 'bg-red-200 text-red-900' },
  };

  const formatDateTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'medium',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileClock className="w-5 h-5 text-purple-600" />
            <span>Jejak Forensik & Log Audit Sistem</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Mencatat SIAPA, KAPAN, APA YANG DILAKUKAN, DATA SEBELUM, dan DATA SESUDAHNYA secara otomatis.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Segarkan Log</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari pelaku, modul, entitas, atau rincian..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">Filter Aksi:</span>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-800 focus:outline-hidden"
          >
            <option value="ALL">Semua Aktivitas</option>
            <option value="LOGIN_SUCCESS">Login Berhasil</option>
            <option value="USER_CREATED">Tambah Akun</option>
            <option value="USER_UPDATED">Ubah Akun</option>
            <option value="USER_SOFT_DELETED">Soft Delete</option>
            <option value="APPROVE_DISBURSEMENT">Persetujuan Keuangan</option>
            <option value="UNAUTHORIZED_ACCESS_ATTEMPT">Percobaan Terlarang (403)</option>
            <option value="CROSS_TENANT_VIOLATION_ATTEMPT">Pelanggaran Tenant</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-600 mb-2" />
            <span>Memuat catatan log audit...</span>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            <FileClock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">Belum ada catatan aktivitas</p>
            <p className="text-slate-400 mt-1">Tidak ada entri log yang cocok dengan pencarian.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Waktu (Kapan)</th>
                  <th className="py-3 px-4">Pengguna (Siapa)</th>
                  <th className="py-3 px-4">Aksi / Tindakan</th>
                  <th className="py-3 px-4">Modul & Entitas</th>
                  <th className="py-3 px-4">Detail Perubahan Data</th>
                  <th className="py-3 px-4 text-right">IP / Device</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {filteredLogs.map((log) => {
                  const style = actionStyles[log.action] || { label: log.action, color: 'bg-slate-100 text-slate-800' };
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                        {formatDateTime(log.createdAt)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 font-sans block">{log.userName}</span>
                        <span className="text-[10px] text-slate-500">{log.userRole}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded font-bold text-[10px] ${style.color}`}>
                          {style.label}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800 font-sans block">{log.entityName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">Modul: {log.module}</span>
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <div className="truncate text-slate-700 font-sans" title={log.newData || '-'}>
                          {log.newData || '-'}
                        </div>
                        {log.previousData && (
                          <div className="text-[10px] text-slate-400 truncate" title={`Sebelumnya: ${log.previousData}`}>
                            Sebelumnya: {log.previousData}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-400 text-[10px]">
                        <div>{log.ipAddress}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
