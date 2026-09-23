import React, { useState } from 'react';
import { User, Student, Parent } from '../../types';
import { X, ShieldCheck, Link2, AlertCircle, Search, UserCheck } from 'lucide-react';

interface LinkUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'STUDENT' | 'PARENT';
  targetEntity: Student | Parent;
  availableUsers: User[];
  onLink: (targetId: string, userId: string) => Promise<void>;
}

export const LinkUserModal: React.FC<LinkUserModalProps> = ({
  isOpen,
  onClose,
  targetType,
  targetEntity,
  availableUsers,
  onLink,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const expectedRole = targetType === 'STUDENT' ? 'SANTRI' : 'WALI_SANTRI';

  // Filter available users: matching role or unassigned users
  const filteredUsers = availableUsers.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedUserId) {
      setError('Silakan pilih akun pengguna yang akan ditautkan.');
      return;
    }

    setLoading(true);
    try {
      await onLink(targetEntity.id, selectedUserId);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Gagal menautkan akun pengguna.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Tautkan Akun Login {targetType === 'STUDENT' ? 'Santri' : 'Wali Santri'}
              </h3>
              <p className="text-xs text-slate-300">Hubungkan data kesiswaan dengan kredensial sistem</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Entity Summary */}
        <div className="px-6 py-3 bg-emerald-50/70 border-b border-emerald-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-emerald-800 font-semibold uppercase tracking-wider">
              {targetType === 'STUDENT' ? 'Santri' : 'Wali Santri'} yang Dipilih:
            </p>
            <p className="text-sm font-bold text-slate-900">{targetEntity.fullName}</p>
          </div>
          <span className="text-xs font-mono font-bold bg-white px-2.5 py-1 rounded-lg border border-emerald-200 text-emerald-800">
            {targetType === 'STUDENT' ? `NIS: ${(targetEntity as Student).nis}` : `Relasi: ${(targetEntity as Parent).relationshipType}`}
          </span>
        </div>

        {/* Content */}
        <form onSubmit={handleLink} className="p-6 flex-1 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Search filter */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari nama, username, atau email pengguna..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* User List Radio Options */}
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {filteredUsers.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">
                Tidak ditemukan akun pengguna yang cocok.
              </p>
            ) : (
              filteredUsers.map((u) => {
                const isSelected = selectedUserId === u.id;
                const isMatchingRole = u.role === expectedRole;
                return (
                  <label
                    key={u.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/50 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="selectedUser"
                      value={u.id}
                      checked={isSelected}
                      onChange={() => setSelectedUserId(u.id)}
                      className="mt-1 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="flex-1 min-w-0 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-900 truncate">{u.fullName}</span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            isMatchingRole
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {u.role}
                        </span>
                      </div>
                      <p className="text-slate-500 font-mono mt-0.5">@{u.username} • {u.email}</p>
                      {u.assignedEntityName && (
                        <p className="text-[11px] text-amber-700 mt-0.5">
                          Tautan saat ini: {u.assignedEntityName}
                        </p>
                      )}
                    </div>
                  </label>
                );
              })
            )}
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading || !selectedUserId}
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Link2 className="w-4 h-4" />
              <span>{loading ? 'Menautkan...' : 'Tautkan Akun'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
