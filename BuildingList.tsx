import React, { useState } from 'react';
import { Building } from '../../types';
import { useAuth } from '../../context/AuthContext';
import {
  Building2,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  MapPin,
  Layers,
  DoorClosed,
} from 'lucide-react';

interface BuildingListProps {
  buildings: Building[];
  loading: boolean;
  onRefresh: () => void;
  onCreate: (data: {
    name: string;
    code: string;
    functionType?: string;
    location?: string;
    description?: string;
    status?: 'ACTIVE' | 'INACTIVE';
  }) => Promise<void>;
  onUpdate: (
    id: string,
    data: {
      name?: string;
      code?: string;
      functionType?: string;
      location?: string;
      description?: string;
      status?: 'ACTIVE' | 'INACTIVE';
    }
  ) => Promise<void>;
  onToggleStatus: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const BuildingList: React.FC<BuildingListProps> = ({
  buildings,
  loading,
  onRefresh,
  onCreate,
  onUpdate,
  onToggleStatus,
  onDelete,
}) => {
  const { hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);
  const [deleteConfirmBuilding, setDeleteConfirmBuilding] = useState<Building | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formFunctionType, setFormFunctionType] = useState('Asrama Santri');
  const [formLocation, setFormLocation] = useState('Kampus Utama');
  const [formDescription, setFormDescription] = useState('');
  const [formStatus, setFormStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');

  const openCreateModal = () => {
    setEditingBuilding(null);
    setFormName('');
    setFormCode('');
    setFormFunctionType('Asrama Santri');
    setFormLocation('Kampus Utama');
    setFormDescription('');
    setFormStatus('ACTIVE');
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (bld: Building) => {
    setEditingBuilding(bld);
    setFormName(bld.name);
    setFormCode(bld.code);
    setFormFunctionType(bld.functionType || 'Asrama Santri');
    setFormLocation(bld.location || 'Kampus Utama');
    setFormDescription(bld.description || '');
    setFormStatus(bld.status);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formCode.trim()) {
      setErrorMessage('Nama dan Kode Gedung wajib diisi.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      if (editingBuilding) {
        await onUpdate(editingBuilding.id, {
          name: formName.trim(),
          code: formCode.trim().toUpperCase(),
          functionType: formFunctionType,
          location: formLocation,
          description: formDescription,
          status: formStatus,
        });
      } else {
        await onCreate({
          name: formName.trim(),
          code: formCode.trim().toUpperCase(),
          functionType: formFunctionType,
          location: formLocation,
          description: formDescription,
          status: formStatus,
        });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal menyimpan data gedung.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmBuilding) return;
    setSubmitting(true);
    setErrorMessage(null);
    try {
      await onDelete(deleteConfirmBuilding.id);
      setDeleteConfirmBuilding(null);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal menghapus gedung.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredBuildings = buildings.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.location && b.location.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'ALL' || b.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="search-building-input"
              type="text"
              placeholder="Cari gedung atau kode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <select
            id="filter-building-status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs py-2 px-3 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          >
            <option value="ALL">Semua Status</option>
            <option value="ACTIVE">Aktif Saja</option>
            <option value="INACTIVE">Nonaktif Saja</option>
          </select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {hasPermission('building.create') && (
            <button
              id="btn-add-building"
              onClick={openCreateModal}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Gedung</span>
            </button>
          )}
        </div>
      </div>

      {/* Buildings Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Kode & Nama Gedung</th>
                <th className="py-3 px-4">Fungsi / Peruntukan</th>
                <th className="py-3 px-4">Lokasi Kampus</th>
                <th className="py-3 px-4 text-center">Unit Asrama</th>
                <th className="py-3 px-4 text-center">Total Kamar</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    Memuat data gedung pesantren...
                  </td>
                </tr>
              ) : filteredBuildings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    Tidak ada gedung yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredBuildings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-medium">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{b.name}</div>
                          <div className="font-mono text-[11px] text-emerald-700 font-medium">
                            {b.code}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        {b.functionType || 'Asrama'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{b.location || 'Kampus Utama'}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1 font-semibold text-slate-800">
                        <Layers className="w-3.5 h-3.5 text-sky-500" />
                        <span>{b.dormitoryCount ?? 0}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1 font-semibold text-slate-800">
                        <DoorClosed className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{b.roomCount ?? 0}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {b.status === 'ACTIVE' ? (
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

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {hasPermission('building.update') && (
                          <>
                            <button
                              title={b.status === 'ACTIVE' ? 'Nonaktifkan Gedung' : 'Aktifkan Gedung'}
                              onClick={() => onToggleStatus(b.id)}
                              className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-emerald-700 transition-colors"
                            >
                              {b.status === 'ACTIVE' ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <XCircle className="w-4 h-4 text-slate-400" />
                              )}
                            </button>
                            <button
                              title="Edit Gedung"
                              onClick={() => openEditModal(b)}
                              className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-sky-600 transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        {hasPermission('building.delete') && (
                          <button
                            title="Hapus Gedung"
                            onClick={() => {
                              setDeleteConfirmBuilding(b);
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

      {/* Modal Add / Edit Gedung */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>{editingBuilding ? 'Ubah Data Gedung' : 'Tambah Gedung Baru'}</span>
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
                  Nama Gedung <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Gedung Abu Bakar Ash-Shiddiq"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kode Gedung <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: GD-AB"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fungsi Gedung</label>
                  <select
                    value={formFunctionType}
                    onChange={(e) => setFormFunctionType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    <option value="Asrama Santri">Asrama Santri</option>
                    <option value="Asrama & Kelas">Asrama & Kelas</option>
                    <option value="Asrama Guru/Musyrif">Asrama Guru/Musyrif</option>
                    <option value="Gedung Serbaguna">Gedung Serbaguna</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lokasi Kampus</label>
                <input
                  type="text"
                  placeholder="Contoh: Kampus Putra - Sayap Timur"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Keterangan Tambahan</label>
                <textarea
                  rows={2}
                  placeholder="Catatan kondisi gedung, lantai total, atau fasilitas..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status Gedung</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="buildingStatus"
                      value="ACTIVE"
                      checked={formStatus === 'ACTIVE'}
                      onChange={() => setFormStatus('ACTIVE')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-medium text-slate-700">Aktif Digunakan</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="buildingStatus"
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
                  {submitting ? 'Menyimpan...' : 'Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Delete Confirmation with Safety Guard */}
      {deleteConfirmBuilding && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 text-xs">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-5 h-5" />
            </div>

            <h3 className="font-bold text-slate-900 text-center text-sm">Hapus Gedung?</h3>
            <p className="mt-2 text-center text-slate-600">
              Apakah Anda yakin ingin menghapus gedung{' '}
              <strong className="text-slate-900">{deleteConfirmBuilding.name}</strong> ({deleteConfirmBuilding.code})?
            </p>

            {(deleteConfirmBuilding.dormitoryCount || 0) > 0 ? (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
                <strong className="block font-bold">Peringatan Keamanan Relasi Data:</strong>
                Gedung ini masih memiliki{' '}
                <span className="font-bold">{deleteConfirmBuilding.dormitoryCount} unit asrama</span> terdaftar.
                Anda harus menghapus atau memindahkan asrama tersebut terlebih dahulu.
              </div>
            ) : (
              <p className="mt-2 text-center text-slate-500 text-[11px]">
                Tindakan ini permanen dan akan tercatat di log audit sistem.
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
                onClick={() => setDeleteConfirmBuilding(null)}
                className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={submitting || (deleteConfirmBuilding.dormitoryCount || 0) > 0}
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold shadow-xs transition-colors disabled:opacity-50"
              >
                {submitting ? 'Menghapus...' : 'Ya, Hapus Gedung'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
