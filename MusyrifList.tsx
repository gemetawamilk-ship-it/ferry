import React, { useState } from 'react';
import { Musyrif, Employee } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  HeartHandshake,
  Search,
  Plus,
  Edit2,
  Trash2,
  Power,
  Shield,
  Phone,
  Mail,
  Building2,
  BedDouble,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';

interface MusyrifListProps {
  musyrifs: Musyrif[];
  employees: Employee[];
  onRefresh: () => void;
  showNotification: (type: 'success' | 'error', message: string) => void;
}

export const MusyrifList: React.FC<MusyrifListProps> = ({
  musyrifs,
  employees,
  onRefresh,
  showNotification,
}) => {
  const { hasPermission } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMusyrif, setEditingMusyrif] = useState<Musyrif | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    employeeId: '',
    musyrifCode: '',
    specialization: '',
    notes: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
  });

  // Employees not yet registered as musyrif
  const registeredEmployeeIds = musyrifs
    .filter((m) => !editingMusyrif || m.id !== editingMusyrif.id)
    .map((m) => m.employeeId);
  const eligibleEmployees = employees.filter((e) => !registeredEmployeeIds.includes(e.id));

  const openCreateModal = () => {
    setEditingMusyrif(null);
    const defaultEmp = eligibleEmployees[0];
    const generatedCode = `MSY-${String(musyrifs.length + 1).padStart(3, '0')}`;
    setFormData({
      employeeId: defaultEmp ? defaultEmp.id : '',
      musyrifCode: generatedCode,
      specialization: '',
      notes: '',
      status: 'ACTIVE',
    });
    setModalOpen(true);
  };

  const openEditModal = (musyrif: Musyrif) => {
    setEditingMusyrif(musyrif);
    setFormData({
      employeeId: musyrif.employeeId,
      musyrifCode: musyrif.musyrifCode,
      specialization: musyrif.specialization,
      notes: musyrif.notes || '',
      status: musyrif.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingMusyrif && !formData.employeeId) {
      showNotification('error', 'Pilih pegawai yang akan didaftarkan sebagai musyrif.');
      return;
    }
    if (!formData.musyrifCode.trim() || !formData.specialization.trim()) {
      showNotification('error', 'Kode musyrif dan spesialisasi pengasuhan wajib diisi.');
      return;
    }

    setSubmitting(true);
    try {
      if (editingMusyrif) {
        await api.updateMusyrif(editingMusyrif.id, {
          musyrifCode: formData.musyrifCode.trim().toUpperCase(),
          specialization: formData.specialization.trim(),
          notes: formData.notes || undefined,
          status: formData.status,
        });
        showNotification('success', `Data musyrif '${editingMusyrif.fullName}' berhasil diperbarui.`);
      } else {
        await api.createMusyrif({
          employeeId: formData.employeeId,
          musyrifCode: formData.musyrifCode.trim().toUpperCase(),
          specialization: formData.specialization.trim(),
          notes: formData.notes || undefined,
          status: formData.status,
        });
        showNotification('success', 'Musyrif baru berhasil didaftarkan.');
      }
      setModalOpen(false);
      onRefresh();
    } catch (err: any) {
      showNotification('error', err.message || 'Gagal menyimpan data musyrif.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (musyrif: Musyrif) => {
    try {
      await api.toggleMusyrifStatus(musyrif.id);
      showNotification('success', `Status musyrif '${musyrif.fullName}' berhasil diubah.`);
      onRefresh();
    } catch (err: any) {
      showNotification('error', err.message || 'Gagal mengubah status musyrif.');
    }
  };

  const handleDelete = async (musyrif: Musyrif) => {
    if (
      !confirm(
        `Hapus status musyrif '${musyrif.fullName}' (${musyrif.musyrifCode})? Data pokok pegawai tidak akan dihapus.`
      )
    ) {
      return;
    }
    try {
      await api.deleteMusyrif(musyrif.id);
      showNotification('success', `Data musyrif '${musyrif.fullName}' berhasil dihapus.`);
      onRefresh();
    } catch (err: any) {
      showNotification('error', err.message || 'Gagal menghapus data musyrif.');
    }
  };

  const filteredMusyrifs = musyrifs.filter((m) => {
    const fullName = m.fullName || '';
    const matchSearch =
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.musyrifCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || m.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-4">
      {/* Search & Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari kode musyrif, nama pengasuh, spesialisasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
          >
            <option value="ALL">Semua Status Musyrif</option>
            <option value="ACTIVE">Aktif Bertugas</option>
            <option value="INACTIVE">Nonaktif / Cuti</option>
          </select>
        </div>

        {hasPermission('musyrif.create') && (
          <button
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            Daftarkan Musyrif Baru
          </button>
        )}
      </div>

      {/* Musyrifs Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Kode & Nama Musyrif</th>
                <th className="px-4 py-3">Spesialisasi Pengasuhan</th>
                <th className="px-4 py-3">Asrama Binaan</th>
                <th className="px-4 py-3">Kontak & Akun</th>
                <th className="px-4 py-3">Status Tugas</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMusyrifs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                    Tidak ada data musyrif yang sesuai dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredMusyrifs.map((musyrif) => (
                  <tr key={musyrif.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Kode & Nama Musyrif */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs">
                          {(musyrif.fullName || musyrif.musyrifCode).charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{musyrif.fullName || musyrif.musyrifCode}</span>
                            {(musyrif.gender || musyrif.employee?.gender) === 'PEREMPUAN' ? (
                              <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded font-semibold">
                                Musyrifah
                              </span>
                            ) : (
                              <span className="text-[10px] bg-teal-100 text-teal-700 px-1.5 py-0.2 rounded font-semibold">
                                Musyrif
                              </span>
                            )}
                          </div>
                          <div className="text-xs font-mono text-slate-500 flex items-center gap-2">
                            <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-bold">
                              {musyrif.musyrifCode}
                            </span>
                            <span>NIP: {musyrif.employeeNumber || musyrif.employee?.employeeNumber || '-'}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Spesialisasi */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 font-medium text-slate-800">
                        <Shield className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>{musyrif.specialization}</span>
                      </div>
                      {musyrif.notes && (
                        <p className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">{musyrif.notes}</p>
                      )}
                    </td>

                    {/* Asrama Binaan */}
                    <td className="px-4 py-3.5">
                      {musyrif.assignedDormitories && musyrif.assignedDormitories.length > 0 ? (
                        <div className="space-y-1">
                          {musyrif.assignedDormitories.map((asrama, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded"
                            >
                              <BedDouble className="w-3 h-3 text-emerald-600" />
                              {asrama.dormitoryName} ({asrama.buildingName})
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Belum ada tugas asrama</span>
                      )}
                    </td>

                    {/* Kontak & Akun */}
                    <td className="px-4 py-3.5 text-xs text-slate-600 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{musyrif.phone || musyrif.employee?.phone || '-'}</span>
                      </div>
                      {musyrif.user || musyrif.userAccount ? (
                        <span className="text-[11px] font-mono text-indigo-700 font-semibold">
                          @{musyrif.user?.username || musyrif.userAccount?.username}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Tanpa akun login</span>
                      )}
                    </td>

                    {/* Status Tugas */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          musyrif.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            musyrif.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-400'
                          }`}
                        />
                        {musyrif.status === 'ACTIVE' ? 'Aktif Bertugas' : 'Nonaktif'}
                      </span>
                    </td>

                    {/* Aksi */}
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {hasPermission('musyrif.update') && (
                          <>
                            <button
                              onClick={() => handleToggleStatus(musyrif)}
                              title={
                                musyrif.status === 'ACTIVE'
                                  ? 'Nonaktifkan status bertugas'
                                  : 'Aktifkan status bertugas'
                              }
                              className={`p-1.5 rounded-lg transition-colors ${
                                musyrif.status === 'ACTIVE'
                                  ? 'text-slate-500 hover:text-amber-600 hover:bg-amber-50'
                                  : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                              }`}
                            >
                              <Power className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openEditModal(musyrif)}
                              title="Edit Profil Musyrif"
                              className="p-1.5 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {hasPermission('musyrif.delete') && (
                          <button
                            onClick={() => handleDelete(musyrif)}
                            title="Hapus Profil Musyrif"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Daftarkan / Edit Musyrif */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-teal-100 text-teal-800">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {editingMusyrif ? 'Edit Data Musyrif' : 'Daftarkan Musyrif Baru'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pengasuhan santri dan pembinaan asrama pesantren
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Pilih Pegawai (jika baru) */}
              {!editingMusyrif ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Pilih Pegawai <span className="text-rose-500">*</span>
                  </label>
                  {eligibleEmployees.length === 0 ? (
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800">
                      Semua pegawai yang terdaftar telah memiliki profil Musyrif. Tambahkan pegawai baru di tab Pegawai terlebih dahulu.
                    </div>
                  ) : (
                    <select
                      required
                      value={formData.employeeId}
                      onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                      className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                    >
                      <option value="">-- Pilih Pegawai --</option>
                      {eligibleEmployees.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.fullName} ({e.employeeNumber}) — {e.position}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                  <span className="text-slate-500">Pegawai Terkait:</span>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">
                    {editingMusyrif.fullName || editingMusyrif.musyrifCode} ({editingMusyrif.employeeNumber || editingMusyrif.employee?.employeeNumber || '-'})
                  </div>
                </div>
              )}

              {/* Kode Musyrif */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Kode Musyrif <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: MSY-001 / PBN-PUTRA"
                  value={formData.musyrifCode}
                  onChange={(e) => setFormData({ ...formData, musyrifCode: e.target.value })}
                  className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg uppercase font-mono focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>

              {/* Spesialisasi Pembinaan */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Bidang Pembinaan / Pengasuhan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pembinaan Adab, Disiplin & Tahfidz Asrama"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>

              {/* Status Tugas */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Status Tugas
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as 'ACTIVE' | 'INACTIVE' })
                  }
                  className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                >
                  <option value="ACTIVE">Aktif Bertugas</option>
                  <option value="INACTIVE">Nonaktif / Cuti</option>
                </select>
              </div>

              {/* Catatan Tambahan */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Catatan Pembinaan
                </label>
                <textarea
                  rows={2}
                  placeholder="Keterangan penugasan atau catatan pengasuhan"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting || (!editingMusyrif && eligibleEmployees.length === 0)}
                  className="px-5 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : editingMusyrif ? 'Perbarui Musyrif' : 'Daftarkan Musyrif'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
