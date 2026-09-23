import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../services/api';
import { User, RoleType } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { UserModal } from './UserModal';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Shield,
  Phone,
  Mail,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export const UserManagement: React.FC = () => {
  const { hasPermission } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.getUsers({
        role: roleFilter !== 'ALL' ? roleFilter : undefined,
        search: searchQuery || undefined,
      });
      setUsers(res.users);
    } catch (err: any) {
      setError(err.message || 'Data pengguna belum dapat dimuat. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  }, [roleFilter, searchQuery]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreateOrUpdate = async (userData: any) => {
    if (userToEdit) {
      const res = await api.updateUser(userToEdit.id, userData);
      setActionSuccessMessage(res.message || 'Data pengguna berhasil diperbarui.');
    } else {
      const res = await api.createUser(userData);
      setActionSuccessMessage(res.message || 'Pengguna baru berhasil ditambahkan.');
    }
    fetchUsers();
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  const handleSoftDelete = async () => {
    if (!userToDelete) return;
    try {
      const res = await api.deleteUser(userToDelete.id);
      setActionSuccessMessage(res.message || 'Akun dinonaktifkan (Soft Delete).');
      setUserToDelete(null);
      fetchUsers();
      setTimeout(() => setActionSuccessMessage(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Gagal menonaktifkan pengguna.');
    }
  };

  const roleBadges: Record<RoleType, { label: string; color: string }> = {
    SUPER_ADMIN: { label: 'Super Admin', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    DIREKTUR: { label: 'Direktur', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    MANAGER: { label: 'Manager', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    ADMIN: { label: 'Admin', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    BENDAHARA: { label: 'Bendahara', color: 'bg-amber-100 text-amber-800 border-amber-200' },
    PENGAJAR: { label: 'Guru / Ustadz', color: 'bg-teal-100 text-teal-800 border-teal-200' },
    MUSYRIF: { label: 'Musyrif Asrama', color: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
    KARYAWAN: { label: 'Staf Karyawan', color: 'bg-slate-100 text-slate-800 border-slate-200' },
    SANTRI: { label: 'Santri', color: 'bg-sky-100 text-sky-800 border-sky-200' },
    WALI_SANTRI: { label: 'Wali Santri', color: 'bg-rose-100 text-rose-800 border-rose-200' },
  };

  return (
    <div className="space-y-5">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            <span>Direktori Pengguna & Hak Akses Akun</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar akun operasional pesantren dengan penugasan role dan cakupan data (scope).
          </p>
        </div>

        {hasPermission('user.create') && (
          <button
            onClick={() => {
              setUserToEdit(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Pengguna</span>
          </button>
        )}
      </div>

      {actionSuccessMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, email, username, atau penugasan..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">Filter Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">Semua Peran (10 Role)</option>
            <option value="DIREKTUR">Direktur</option>
            <option value="MANAGER">Manager</option>
            <option value="ADMIN">Admin</option>
            <option value="BENDAHARA">Bendahara</option>
            <option value="PENGAJAR">Guru / Pengajar</option>
            <option value="MUSYRIF">Musyrif Asrama</option>
            <option value="KARYAWAN">Karyawan</option>
            <option value="SANTRI">Santri</option>
            <option value="WALI_SANTRI">Wali Santri</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>

          <button
            onClick={fetchUsers}
            title="Muat Ulang"
            className="p-1.5 text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-slate-500">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-600 mb-2" />
            <span>Memuat data pengguna pesantren...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-xs">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
            <p className="font-semibold text-slate-800 text-sm mb-1">{error}</p>
            <button
              onClick={fetchUsers}
              className="mt-3 px-3 py-1.5 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800"
            >
              Coba Lagi
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">Belum ada data pengguna</p>
            <p className="text-slate-400 mt-1">Tidak ada data yang cocok dengan kriteria pencarian.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Nama Lengkap & Kontak</th>
                  <th className="py-3 px-4">Peran (Role)</th>
                  <th className="py-3 px-4">Cakupan Data (Scope)</th>
                  <th className="py-3 px-4">Penugasan Khusus</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => {
                  const badge = roleBadges[u.role] || { label: u.role, color: 'bg-slate-100 text-slate-800' };
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0 border border-slate-200">
                            {u.fullName.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block leading-tight">{u.fullName}</span>
                            <div className="flex items-center gap-2 mt-0.5 text-slate-400 text-[11px]">
                              <span>@{u.username}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {u.email}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full font-semibold border ${badge.color}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-bold">
                          {u.scope}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {u.assignedEntityName || '-'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            u.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                          {u.status === 'ACTIVE' ? 'AKTIF' : 'NONAKTIF'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          {hasPermission('user.update') && (
                            <button
                              onClick={() => {
                                setUserToEdit(u);
                                setModalOpen(true);
                              }}
                              className="p-1.5 text-slate-500 hover:text-emerald-700 rounded-md hover:bg-emerald-50"
                              title="Ubah Data Pengguna"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {hasPermission('user.delete') && u.status === 'ACTIVE' && (
                            <button
                              onClick={() => setUserToDelete(u)}
                              className="p-1.5 text-slate-500 hover:text-rose-700 rounded-md hover:bg-rose-50"
                              title="Nonaktifkan Pengguna (Soft Delete)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Form Modal */}
      <UserModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleCreateOrUpdate}
        userToEdit={userToEdit}
      />

      {/* Soft Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center border border-slate-200 shadow-2xl">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Konfirmasi Nonaktifkan Akun</h3>
            <p className="text-xs text-slate-600 mt-2">
              Apakah Anda yakin ingin menonaktifkan akun{' '}
              <strong className="text-slate-900">{userToDelete.fullName}</strong>?
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Data tidak akan dihapus permanen (Prinsip Soft Delete & Audit Trail diterapkan).
            </p>
            <div className="mt-5 flex justify-center gap-2 text-xs">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={handleSoftDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold"
              >
                Ya, Nonaktifkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
