import React, { useState } from 'react';
import { Dormitory, Building, User, DormitoryGenderType } from '../../types';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  Building2,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  Crown,
  UserCheck,
  UserX,
  BedDouble,
  ShieldCheck,
  Filter,
} from 'lucide-react';

interface DormitoryListProps {
  dormitories: Dormitory[];
  buildings: Building[];
  staffUsers: User[];
  loading: boolean;
  onRefresh: () => void;
  onCreate: (data: {
    buildingId: string;
    name: string;
    code: string;
    genderType: DormitoryGenderType;
    totalCapacity: number;
    description?: string;
    status?: 'ACTIVE' | 'INACTIVE';
  }) => Promise<void>;
  onUpdate: (
    id: string,
    data: {
      buildingId?: string;
      name?: string;
      code?: string;
      genderType?: DormitoryGenderType;
      totalCapacity?: number;
      description?: string;
      status?: 'ACTIVE' | 'INACTIVE';
    }
  ) => Promise<void>;
  onToggleStatus: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onAssignSupervisor: (dormitoryId: string, data: { userId: string; roleType?: 'MUSYRIF' | 'PENANGGUNG_JAWAB'; isPrimary?: boolean }) => Promise<void>;
  onRemoveSupervisor: (dormitoryId: string, supervisorId: string) => Promise<void>;
  onSetPrimarySupervisor: (dormitoryId: string, supervisorId: string) => Promise<void>;
}

export const DormitoryList: React.FC<DormitoryListProps> = ({
  dormitories,
  buildings,
  staffUsers,
  loading,
  onRefresh,
  onCreate,
  onUpdate,
  onToggleStatus,
  onDelete,
  onAssignSupervisor,
  onRemoveSupervisor,
  onSetPrimarySupervisor,
}) => {
  const { hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState<string>('ALL');
  const [filterBuilding, setFilterBuilding] = useState<string>('ALL');

  // Modal states for Dormitory CRUD
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDormitory, setEditingDormitory] = useState<Dormitory | null>(null);
  const [deleteConfirmDorm, setDeleteConfirmDorm] = useState<Dormitory | null>(null);

  // Supervisor modal state
  const [supervisorModalDorm, setSupervisorModalDorm] = useState<Dormitory | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [selectedRoleType, setSelectedRoleType] = useState<'MUSYRIF' | 'PENANGGUNG_JAWAB'>('MUSYRIF');
  const [isPrimaryChecked, setIsPrimaryChecked] = useState(false);

  // Form states
  const [formBuildingId, setFormBuildingId] = useState('');
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formGenderType, setFormGenderType] = useState<DormitoryGenderType>('PUTRA');
  const [formTotalCapacity, setFormTotalCapacity] = useState('40');
  const [formDescription, setFormDescription] = useState('');
  const [formStatus, setFormStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingDormitory(null);
    setFormBuildingId(buildings.length > 0 ? buildings[0].id : '');
    setFormName('');
    setFormCode('');
    setFormGenderType('PUTRA');
    setFormTotalCapacity('40');
    setFormDescription('');
    setFormStatus('ACTIVE');
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (dorm: Dormitory) => {
    setEditingDormitory(dorm);
    setFormBuildingId(dorm.buildingId);
    setFormName(dorm.name);
    setFormCode(dorm.code);
    setFormGenderType(dorm.genderType);
    setFormTotalCapacity(dorm.totalCapacity.toString());
    setFormDescription(dorm.description || '');
    setFormStatus(dorm.status);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formBuildingId) {
      setErrorMessage('Pilih gedung penempatan asrama.');
      return;
    }
    if (!formName.trim() || !formCode.trim()) {
      setErrorMessage('Nama dan Kode Asrama wajib diisi.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      if (editingDormitory) {
        await onUpdate(editingDormitory.id, {
          buildingId: formBuildingId,
          name: formName.trim(),
          code: formCode.trim().toUpperCase(),
          genderType: formGenderType,
          totalCapacity: parseInt(formTotalCapacity, 10) || 0,
          description: formDescription,
          status: formStatus,
        });
      } else {
        await onCreate({
          buildingId: formBuildingId,
          name: formName.trim(),
          code: formCode.trim().toUpperCase(),
          genderType: formGenderType,
          totalCapacity: parseInt(formTotalCapacity, 10) || 0,
          description: formDescription,
          status: formStatus,
        });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal menyimpan data asrama.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmDorm) return;
    setSubmitting(true);
    setErrorMessage(null);
    try {
      await onDelete(deleteConfirmDorm.id);
      setDeleteConfirmDorm(null);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal menghapus asrama.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddSupervisor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supervisorModalDorm || !selectedStaffId) return;

    setSubmitting(true);
    setErrorMessage(null);
    try {
      await onAssignSupervisor(supervisorModalDorm.id, {
        userId: selectedStaffId,
        roleType: selectedRoleType,
        isPrimary: isPrimaryChecked,
      });
      setSelectedStaffId('');
      setIsPrimaryChecked(false);
      // Update local modal view with fresh dorm data
      const updated = dormitories.find((d) => d.id === supervisorModalDorm.id);
      if (updated) setSupervisorModalDorm(updated);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal menetapkan musyrif.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveSupervisorClick = async (supId: string) => {
    if (!supervisorModalDorm) return;
    setSubmitting(true);
    setErrorMessage(null);
    try {
      await onRemoveSupervisor(supervisorModalDorm.id, supId);
      const updated = dormitories.find((d) => d.id === supervisorModalDorm.id);
      if (updated) setSupervisorModalDorm(updated);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal melepas penugasan musyrif.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetPrimaryClick = async (supId: string) => {
    if (!supervisorModalDorm) return;
    setSubmitting(true);
    setErrorMessage(null);
    try {
      await onSetPrimarySupervisor(supervisorModalDorm.id, supId);
      const updated = dormitories.find((d) => d.id === supervisorModalDorm.id);
      if (updated) setSupervisorModalDorm(updated);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal mengatur musyrif utama.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredDormitories = dormitories.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.buildingName && d.buildingName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesGender = filterGender === 'ALL' || d.genderType === filterGender;
    const matchesBuilding = filterBuilding === 'ALL' || d.buildingId === filterBuilding;
    return matchesSearch && matchesGender && matchesBuilding;
  });

  return (
    <div className="space-y-4">
      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="search-dormitory-input"
              type="text"
              placeholder="Cari asrama atau gedung..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <select
            id="filter-dormitory-gender"
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
            className="text-xs py-2 px-3 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          >
            <option value="ALL">Semua Tipe Penghuni</option>
            <option value="PUTRA">Khusus Santri Putra</option>
            <option value="PUTRI">Khusus Santri Putri</option>
            <option value="CAMPURAN">Campuran</option>
          </select>

          <select
            id="filter-dormitory-building"
            value={filterBuilding}
            onChange={(e) => setFilterBuilding(e.target.value)}
            className="text-xs py-2 px-3 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          >
            <option value="ALL">Semua Gedung</option>
            {buildings.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.code})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {hasPermission('dormitory.create') && (
            <button
              id="btn-add-dormitory"
              onClick={openCreateModal}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Asrama</span>
            </button>
          )}
        </div>
      </div>

      {/* Dormitory Cards / Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Kode & Nama Asrama</th>
                <th className="py-3 px-4">Gedung Penempatan</th>
                <th className="py-3 px-4 text-center">Jenis Asrama</th>
                <th className="py-3 px-4 text-center">Kamar & Kapasitas</th>
                <th className="py-3 px-4">Musyrif / Penanggung Jawab</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    Memuat data asrama pesantren...
                  </td>
                </tr>
              ) : filteredDormitories.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    Tidak ada unit asrama yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredDormitories.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Nama & Kode */}
                    <td className="py-3.5 px-4 font-medium">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            d.genderType === 'PUTRI'
                              ? 'bg-purple-50 text-purple-700'
                              : 'bg-sky-50 text-sky-700'
                          }`}
                        >
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{d.name}</div>
                          <div className="font-mono text-[11px] text-sky-700 font-medium">
                            {d.code}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Gedung */}
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-800">{d.buildingName}</span>
                      <span className="block text-[11px] text-slate-400 font-mono">
                        {d.buildingCode}
                      </span>
                    </td>

                    {/* Gender Type */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                          d.genderType === 'PUTRI'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : d.genderType === 'PUTRA'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {d.genderType}
                      </span>
                    </td>

                    {/* Kamar & Kapasitas */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="font-semibold text-slate-900 flex items-center gap-1">
                          <BedDouble className="w-3.5 h-3.5 text-indigo-500" />
                          {d.roomCount || 0} Kamar
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {d.calculatedCapacity || 0} / {d.totalCapacity} santri
                        </span>
                      </div>
                    </td>

                    {/* Musyrif */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1 max-w-[200px]">
                        {d.supervisors && d.supervisors.length > 0 ? (
                          d.supervisors.map((s) => (
                            <div
                              key={s.id}
                              className="flex items-center gap-1.5 text-[11px] bg-slate-50 px-2 py-0.5 rounded border border-slate-200/80"
                            >
                              {s.isPrimary ? (
                                <Crown className="w-3 h-3 text-amber-500 shrink-0" />
                              ) : (
                                <UserCheck className="w-3 h-3 text-slate-400 shrink-0" />
                              )}
                              <span
                                className={`truncate font-medium ${
                                  s.isPrimary ? 'text-slate-900 font-bold' : 'text-slate-700'
                                }`}
                              >
                                {s.userName}
                              </span>
                              {s.isPrimary && (
                                <span className="text-[9px] bg-amber-100 text-amber-800 px-1 rounded font-semibold ml-auto shrink-0">
                                  Utama
                                </span>
                              )}
                            </div>
                          ))
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">
                            Belum ada musyrif ditugaskan
                          </span>
                        )}

                        {hasPermission('dormitory_supervisor.create') && (
                          <button
                            onClick={() => {
                              setSupervisorModalDorm(d);
                              setSelectedStaffId('');
                              setIsPrimaryChecked(false);
                              setErrorMessage(null);
                            }}
                            className="text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold hover:underline flex items-center gap-1 pt-0.5"
                          >
                            <Users className="w-3 h-3" />
                            <span>Kelola Musyrif</span>
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      {d.status === 'ACTIVE' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                          <XCircle className="w-3 h-3 text-slate-400" />
                          Nonaktif
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {hasPermission('dormitory.update') && (
                          <>
                            <button
                              title={d.status === 'ACTIVE' ? 'Nonaktifkan Asrama' : 'Aktifkan Asrama'}
                              onClick={() => onToggleStatus(d.id)}
                              className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-emerald-700 transition-colors"
                            >
                              {d.status === 'ACTIVE' ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <XCircle className="w-4 h-4 text-slate-400" />
                              )}
                            </button>
                            <button
                              title="Edit Asrama"
                              onClick={() => openEditModal(d)}
                              className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-sky-600 transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        {hasPermission('dormitory.delete') && (
                          <button
                            title="Hapus Asrama"
                            onClick={() => {
                              setDeleteConfirmDorm(d);
                              setErrorMessage(null);
                            }}
                            className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-rose-600 transition-colors"
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

      {/* Modal Add / Edit Asrama */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>{editingDormitory ? 'Ubah Data Asrama' : 'Tambah Unit Asrama Baru'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMessage && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Gedung Penempatan <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={formBuildingId}
                  onChange={(e) => setFormBuildingId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="" disabled>
                    Pilih Gedung
                  </option>
                  {buildings.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.code}) - {b.location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Asrama <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Asrama Al-Fatih"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kode Asrama <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: ASR-FATIH"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenis Penghuni</label>
                  <select
                    value={formGenderType}
                    onChange={(e) => setFormGenderType(e.target.value as DormitoryGenderType)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    <option value="PUTRA">Santri Putra</option>
                    <option value="PUTRI">Santri Putri</option>
                    <option value="CAMPURAN">Campuran</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Target Kapasitas Total (Santri)
                </label>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  placeholder="40"
                  value={formTotalCapacity}
                  onChange={(e) => setFormTotalCapacity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Kapasitas riil akan dihitung otomatis berdasarkan jumlah dan kuota kamar di bawah asrama ini.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Keterangan Tambahan</label>
                <textarea
                  rows={2}
                  placeholder="Catatan blok asrama, tata tertib khusus, atau lokasi sayap..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status Asrama</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="dormStatus"
                      value="ACTIVE"
                      checked={formStatus === 'ACTIVE'}
                      onChange={() => setFormStatus('ACTIVE')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-medium text-slate-700">Aktif Beroperasi</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="dormStatus"
                      value="INACTIVE"
                      checked={formStatus === 'INACTIVE'}
                      onChange={() => setFormStatus('INACTIVE')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-medium text-slate-700">Nonaktif</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-xs transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Asrama'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Kelola Musyrif & Penanggung Jawab */}
      {supervisorModalDorm && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>Musyrif & Pembina: {supervisorModalDorm.name}</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Gedung {supervisorModalDorm.buildingName} • {supervisorModalDorm.code}
                </p>
              </div>
              <button
                onClick={() => setSupervisorModalDorm(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMessage && (
              <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Existing Supervisors List */}
            <div className="mt-4">
              <h4 className="font-semibold text-slate-800 mb-2">
                Musyrif & Staf yang Saat Ini Bertugas:
              </h4>

              {supervisorModalDorm.supervisors && supervisorModalDorm.supervisors.length > 0 ? (
                <div className="space-y-2">
                  {supervisorModalDorm.supervisors.map((s) => (
                    <div
                      key={s.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                            s.isPrimary ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {s.isPrimary ? <Crown className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-2">
                            <span>{s.userName}</span>
                            {s.isPrimary && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold text-[10px]">
                                Musyrif Utama
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2">
                            <span>Peran: {s.roleType}</span>
                            {s.userPhone && <span>• Telp: {s.userPhone}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {!s.isPrimary && hasPermission('dormitory_supervisor.update') && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryClick(s.id)}
                            disabled={submitting}
                            className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded font-semibold border border-amber-200 text-[10px] transition-colors"
                          >
                            Jadikan Utama
                          </button>
                        )}
                        {hasPermission('dormitory_supervisor.delete') && (
                          <button
                            type="button"
                            title="Lepas Penugasan"
                            onClick={() => handleRemoveSupervisorClick(s.id)}
                            disabled={submitting}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center text-slate-500">
                  Belum ada musyrif yang ditugaskan pada asrama ini.
                </div>
              )}
            </div>

            {/* Form Assign New Supervisor */}
            {hasPermission('dormitory_supervisor.create') && (
              <form onSubmit={handleAddSupervisor} className="mt-5 pt-4 border-t border-slate-100 space-y-3">
                <h4 className="font-bold text-slate-900">Tambah Penugasan Musyrif Baru:</h4>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Pilih Staf / Musyrif Pesantren
                  </label>
                  <select
                    required
                    value={selectedStaffId}
                    onChange={(e) => setSelectedStaffId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    <option value="">-- Pilih Staf / Musyrif --</option>
                    {staffUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.fullName} ({u.role}) - {u.email}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Peran Penugasan</label>
                    <select
                      value={selectedRoleType}
                      onChange={(e) => setSelectedRoleType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    >
                      <option value="MUSYRIF">Musyrif Harian</option>
                      <option value="PENANGGUNG_JAWAB">Penanggung Jawab / Kepala Asrama</option>
                    </select>
                  </div>

                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isPrimaryChecked}
                        onChange={(e) => setIsPrimaryChecked(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="font-semibold text-slate-800">Sebagai Musyrif Utama</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={submitting || !selectedStaffId}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-xs transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Menyimpan...' : 'Tugaskan ke Asrama'}
                  </button>
                </div>
              </form>
            )}

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSupervisorModalDorm(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Delete Confirmation with Safety Guard */}
      {deleteConfirmDorm && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 text-xs">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-5 h-5" />
            </div>

            <h3 className="font-bold text-slate-900 text-center text-sm">Hapus Unit Asrama?</h3>
            <p className="mt-2 text-center text-slate-600">
              Apakah Anda yakin ingin menghapus asrama{' '}
              <strong className="text-slate-900">{deleteConfirmDorm.name}</strong> ({deleteConfirmDorm.code})?
            </p>

            {(deleteConfirmDorm.roomCount || 0) > 0 ? (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
                <strong className="block font-bold">Peringatan Keamanan Relasi Data:</strong>
                Asrama ini masih memiliki{' '}
                <span className="font-bold">{deleteConfirmDorm.roomCount} kamar</span> terdaftar. Anda harus
                menghapus atau memindahkan kamar terlebih dahulu sebelum asrama dapat dihapus.
              </div>
            ) : (
              <p className="mt-2 text-center text-slate-500 text-[11px]">
                Tindakan ini permanen dan akan menghapus penugasan musyrif terkait serta tercatat di log audit sistem.
              </p>
            )}

            {errorMessage && (
              <div className="mt-3 p-2.5 bg-rose-50 border border-rose-200 rounded text-rose-700 text-[11px]">
                {errorMessage}
              </div>
            )}

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmDorm(null)}
                className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={submitting || (deleteConfirmDorm.roomCount || 0) > 0}
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold shadow-xs transition-colors disabled:opacity-50"
              >
                {submitting ? 'Menghapus...' : 'Ya, Hapus Asrama'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
