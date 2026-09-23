import React, { useState } from 'react';
import { Parent, User } from '../../types';
import {
  Search,
  Plus,
  HeartHandshake,
  Phone,
  Mail,
  Edit3,
  Trash2,
  Link2,
  Unlink,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { ParentModal } from './ParentModal';
import { LinkUserModal } from './LinkUserModal';

interface ParentListProps {
  parents: Parent[];
  users: User[];
  onRefresh: () => void;
  onCreateParent: (data: Partial<Parent>) => Promise<void>;
  onUpdateParent: (id: string, data: Partial<Parent>) => Promise<void>;
  onDeleteParent: (id: string) => Promise<void>;
  onLinkUser: (parentId: string, userId: string) => Promise<void>;
  onUnlinkUser: (parentId: string) => Promise<void>;
  hasPermission: (perm: string) => boolean;
}

export const ParentList: React.FC<ParentListProps> = ({
  parents,
  users,
  onRefresh,
  onCreateParent,
  onUpdateParent,
  onDeleteParent,
  onLinkUser,
  onUnlinkUser,
  hasPermission,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [relationFilter, setRelationFilter] = useState('');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingParent, setEditingParent] = useState<Parent | null>(null);
  const [linkUserParent, setLinkUserParent] = useState<Parent | null>(null);

  const filteredParents = parents.filter((p) => {
    const matchesSearch =
      p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.email && p.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.nik && p.nik.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.occupation && p.occupation.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRelation = !relationFilter || p.relationshipType === relationFilter;

    return matchesSearch && matchesRelation;
  });

  const handleDelete = async (parent: Parent) => {
    const childCount = parent.children?.length || 0;
    const confirmMsg =
      childCount > 0
        ? `Wali ${parent.fullName} memiliki ${childCount} santri terhubung. Yakin ingin menghapus data wali ini?`
        : `Yakin ingin menghapus data wali santri ${parent.fullName}?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      await onDeleteParent(parent.id);
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus data wali santri.');
    }
  };

  const handleUnlink = async (parent: Parent) => {
    if (!window.confirm(`Yakin ingin mencabut tautan akun login untuk wali ${parent.fullName}?`)) {
      return;
    }
    try {
      await onUnlinkUser(parent.id);
    } catch (err: any) {
      alert(err.message || 'Gagal melepas tautan akun pengguna.');
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama, nomor telepon, email, NIK, atau pekerjaan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={relationFilter}
              onChange={(e) => setRelationFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
            >
              <option value="">Semua Hubungan</option>
              <option value="AYAH">Ayah</option>
              <option value="IBU">Ibu</option>
              <option value="WALI">Wali</option>
            </select>

            {hasPermission('parent.create') && (
              <button
                onClick={() => setIsCreateOpen(true)}
                className="px-4 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Wali</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Count & Reset */}
      <div className="flex items-center justify-between px-1 text-xs text-slate-500 font-medium">
        <span>
          Menampilkan <strong className="text-slate-900">{filteredParents.length}</strong> dari {parents.length} wali santri
        </span>
        {(searchTerm || relationFilter) && (
          <button
            onClick={() => {
              setSearchTerm('');
              setRelationFilter('');
            }}
            className="text-purple-700 hover:underline font-semibold"
          >
            Reset Filter
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px] tracking-wider">
                <th className="py-3 px-4">Nama & Hubungan</th>
                <th className="py-3 px-4">Kontak (HP & Email)</th>
                <th className="py-3 px-4">NIK & Pekerjaan</th>
                <th className="py-3 px-4">Santri yang Diampu</th>
                <th className="py-3 px-4">Akun Login</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredParents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Tidak ada data wali santri yang sesuai kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredParents.map((parent) => {
                  return (
                    <tr key={parent.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Name & Relation */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs">
                            {parent.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{parent.fullName}</p>
                            <span className="inline-block text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 border border-purple-200 mt-0.5">
                              {parent.relationshipType}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <p className="text-slate-800 font-semibold flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            {parent.phone}
                          </p>
                          {parent.email && (
                            <p className="text-slate-500 text-[11px] flex items-center gap-1">
                              <Mail className="w-3.5 h-3.5 text-slate-400" />
                              {parent.email}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* NIK & Pekerjaan */}
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-800">{parent.occupation || '-'}</p>
                        <p className="text-[11px] text-slate-400 font-mono">NIK: {parent.nik || '-'}</p>
                      </td>

                      {/* Children */}
                      <td className="py-3 px-4">
                        {parent.children && parent.children.length > 0 ? (
                          <div className="space-y-1">
                            {parent.children.map((childRel) => (
                              <div key={childRel.id} className="flex items-center gap-1.5">
                                <Users className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span className="font-semibold text-slate-800">
                                  {childRel.student?.fullName || 'Santri'}
                                </span>
                                <span className="font-mono text-[10px] text-slate-400">
                                  ({childRel.student?.nis})
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Belum terhubung ke santri</span>
                        )}
                      </td>

                      {/* Linked User Account */}
                      <td className="py-3 px-4">
                        {parent.user ? (
                          <div className="flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <div>
                              <p className="font-mono text-slate-800 font-semibold">@{parent.user.username}</p>
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
                                {parent.user.role}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Belum ada akun</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Link User */}
                          {hasPermission('parent.update') && !parent.userId && (
                            <button
                              onClick={() => setLinkUserParent(parent)}
                              className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="Tautkan Akun Pengguna"
                            >
                              <Link2 className="w-4 h-4" />
                            </button>
                          )}

                          {hasPermission('parent.update') && parent.userId && (
                            <button
                              onClick={() => handleUnlink(parent)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Lepas Tautan Akun Pengguna"
                            >
                              <Unlink className="w-4 h-4" />
                            </button>
                          )}

                          {/* Edit */}
                          {hasPermission('parent.update') && (
                            <button
                              onClick={() => setEditingParent(parent)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit Data Wali"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          )}

                          {/* Delete */}
                          {hasPermission('parent.delete') && (
                            <button
                              onClick={() => handleDelete(parent)}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Hapus Data Wali"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALS */}
      <ParentModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSave={onCreateParent}
      />

      <ParentModal
        isOpen={!!editingParent}
        onClose={() => setEditingParent(null)}
        onSave={async (data) => {
          if (editingParent) {
            await onUpdateParent(editingParent.id, data);
            setEditingParent(null);
          }
        }}
        parent={editingParent}
      />

      {linkUserParent && (
        <LinkUserModal
          isOpen={!!linkUserParent}
          onClose={() => setLinkUserParent(null)}
          targetType="PARENT"
          targetEntity={linkUserParent}
          availableUsers={users}
          onLink={onLinkUser}
        />
      )}
    </div>
  );
};
