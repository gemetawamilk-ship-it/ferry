import React, { useState } from 'react';
import { Room, Dormitory, Building, RoomStatus, RoomGenderType } from '../../types';
import { useAuth } from '../../context/AuthContext';
import {
  BedDouble,
  Building2,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  Wrench,
  DoorClosed,
  Layers,
  Info,
  Filter,
} from 'lucide-react';

interface RoomListProps {
  rooms: Room[];
  dormitories: Dormitory[];
  buildings: Building[];
  loading: boolean;
  onRefresh: () => void;
  onCreate: (data: {
    dormitoryId: string;
    name: string;
    code: string;
    floor: number;
    capacity: number;
    genderType?: RoomGenderType;
    status?: RoomStatus;
    description?: string;
  }) => Promise<void>;
  onUpdate: (
    id: string,
    data: {
      dormitoryId?: string;
      name?: string;
      code?: string;
      floor?: number;
      capacity?: number;
      genderType?: RoomGenderType;
      status?: RoomStatus;
      description?: string;
    }
  ) => Promise<void>;
  onUpdateStatus: (id: string, status: RoomStatus, description?: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const RoomList: React.FC<RoomListProps> = ({
  rooms,
  dormitories,
  buildings,
  loading,
  onRefresh,
  onCreate,
  onUpdate,
  onUpdateStatus,
  onDelete,
}) => {
  const { hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBuilding, setFilterBuilding] = useState('ALL');
  const [filterDormitory, setFilterDormitory] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterGender, setFilterGender] = useState('ALL');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [deleteConfirmRoom, setDeleteConfirmRoom] = useState<Room | null>(null);

  // Quick Maintenance & Status modal state
  const [statusModalRoom, setStatusModalRoom] = useState<Room | null>(null);
  const [statusSelection, setStatusSelection] = useState<RoomStatus>('MAINTENANCE');
  const [statusDescription, setStatusDescription] = useState('');

  // Form states
  const [formDormitoryId, setFormDormitoryId] = useState('');
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formFloor, setFormFloor] = useState('1');
  const [formCapacity, setFormCapacity] = useState('4');
  const [formGenderType, setFormGenderType] = useState<RoomGenderType>('PUTRA');
  const [formStatus, setFormStatus] = useState<RoomStatus>('ACTIVE');
  const [formDescription, setFormDescription] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingRoom(null);
    const firstDorm = dormitories.length > 0 ? dormitories[0] : null;
    setFormDormitoryId(firstDorm ? firstDorm.id : '');
    setFormName('');
    setFormCode('');
    setFormFloor('1');
    setFormCapacity('4');
    setFormGenderType(firstDorm && firstDorm.genderType === 'PUTRI' ? 'PUTRI' : 'PUTRA');
    setFormStatus('ACTIVE');
    setFormDescription('');
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (room: Room) => {
    setEditingRoom(room);
    setFormDormitoryId(room.dormitoryId);
    setFormName(room.name);
    setFormCode(room.code);
    setFormFloor(room.floor.toString());
    setFormCapacity(room.capacity.toString());
    setFormGenderType(room.genderType);
    setFormStatus(room.status);
    setFormDescription(room.description || '');
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const openStatusModal = (room: Room) => {
    setStatusModalRoom(room);
    setStatusSelection(room.status);
    setStatusDescription(room.description || '');
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDormitoryId) {
      setErrorMessage('Pilih asrama penempatan kamar.');
      return;
    }
    if (!formName.trim() || !formCode.trim()) {
      setErrorMessage('Nomor/Nama dan Kode Kamar wajib diisi.');
      return;
    }

    const floorNum = parseInt(formFloor, 10);
    if (isNaN(floorNum) || floorNum < 1) {
      setErrorMessage('Lantai harus angka minimal 1.');
      return;
    }

    const capNum = parseInt(formCapacity, 10);
    if (isNaN(capNum) || capNum < 1 || capNum > 100) {
      setErrorMessage('Kapasitas kamar antara 1 dan 100 santri.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      if (editingRoom) {
        await onUpdate(editingRoom.id, {
          dormitoryId: formDormitoryId,
          name: formName.trim(),
          code: formCode.trim().toUpperCase(),
          floor: floorNum,
          capacity: capNum,
          genderType: formGenderType,
          status: formStatus,
          description: formDescription,
        });
      } else {
        await onCreate({
          dormitoryId: formDormitoryId,
          name: formName.trim(),
          code: formCode.trim().toUpperCase(),
          floor: floorNum,
          capacity: capNum,
          genderType: formGenderType,
          status: formStatus,
          description: formDescription,
        });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal menyimpan kamar.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusModalRoom) return;

    setSubmitting(true);
    setErrorMessage(null);
    try {
      await onUpdateStatus(statusModalRoom.id, statusSelection, statusDescription);
      setStatusModalRoom(null);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal memperbarui status kamar.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmRoom) return;
    setSubmitting(true);
    setErrorMessage(null);
    try {
      await onDelete(deleteConfirmRoom.id);
      setDeleteConfirmRoom(null);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal menghapus kamar.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRooms = rooms.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.dormitoryName && r.dormitoryName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.buildingName && r.buildingName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesBuilding = filterBuilding === 'ALL' || r.buildingId === filterBuilding;
    const matchesDorm = filterDormitory === 'ALL' || r.dormitoryId === filterDormitory;
    const matchesStatus = filterStatus === 'ALL' || r.status === filterStatus;
    const matchesGender = filterGender === 'ALL' || r.genderType === filterGender;

    return matchesSearch && matchesBuilding && matchesDorm && matchesStatus && matchesGender;
  });

  return (
    <div className="space-y-4">
      {/* Control & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="relative flex-1 w-full sm:max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="search-room-input"
              type="text"
              placeholder="Cari kamar, nomor, atau kode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {hasPermission('room.create') && (
              <button
                id="btn-add-room"
                onClick={openCreateModal}
                className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Kamar</span>
              </button>
            )}
          </div>
        </div>

        {/* Multi-Filters Row */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1 text-slate-500 font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          {/* Filter Gedung */}
          <select
            id="filter-room-building"
            value={filterBuilding}
            onChange={(e) => {
              setFilterBuilding(e.target.value);
              setFilterDormitory('ALL');
            }}
            className="py-1.5 px-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          >
            <option value="ALL">Semua Gedung</option>
            {buildings.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.code})
              </option>
            ))}
          </select>

          {/* Filter Asrama */}
          <select
            id="filter-room-dormitory"
            value={filterDormitory}
            onChange={(e) => setFilterDormitory(e.target.value)}
            className="py-1.5 px-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          >
            <option value="ALL">Semua Asrama</option>
            {dormitories
              .filter((d) => filterBuilding === 'ALL' || d.buildingId === filterBuilding)
              .map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.genderType})
                </option>
              ))}
          </select>

          {/* Filter Status */}
          <select
            id="filter-room-status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="py-1.5 px-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          >
            <option value="ALL">Semua Status</option>
            <option value="ACTIVE">Aktif Digunakan</option>
            <option value="MAINTENANCE">Dalam Perbaikan (Maintenance)</option>
            <option value="INACTIVE">Nonaktif / Kosong</option>
          </select>

          {/* Filter Gender */}
          <select
            id="filter-room-gender"
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
            className="py-1.5 px-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          >
            <option value="ALL">Semua Peruntukan</option>
            <option value="PUTRA">Santri Putra</option>
            <option value="PUTRI">Santri Putri</option>
            <option value="KHUSUS">Khusus / Isolasi</option>
          </select>

          {(filterBuilding !== 'ALL' ||
            filterDormitory !== 'ALL' ||
            filterStatus !== 'ALL' ||
            filterGender !== 'ALL' ||
            searchTerm) && (
            <button
              onClick={() => {
                setFilterBuilding('ALL');
                setFilterDormitory('ALL');
                setFilterStatus('ALL');
                setFilterGender('ALL');
                setSearchTerm('');
              }}
              className="py-1 px-2 text-[11px] text-slate-500 hover:text-rose-600 hover:underline"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Rooms Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Nomor & Kode Kamar</th>
                <th className="py-3 px-4">Asrama & Gedung</th>
                <th className="py-3 px-4 text-center">Lantai</th>
                <th className="py-3 px-4 text-center">Kapasitas</th>
                <th className="py-3 px-4 text-center">Peruntukan</th>
                <th className="py-3 px-4">Status & Catatan Pemeliharaan</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    Memuat data kamar santri...
                  </td>
                </tr>
              ) : filteredRooms.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    Tidak ada kamar yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                filteredRooms.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Nomor & Kode */}
                    <td className="py-3.5 px-4 font-medium">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            r.status === 'MAINTENANCE'
                              ? 'bg-amber-50 text-amber-600'
                              : r.status === 'ACTIVE'
                              ? 'bg-indigo-50 text-indigo-600'
                              : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          <DoorClosed className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{r.name}</div>
                          <div className="font-mono text-[11px] text-indigo-600 font-medium">
                            {r.code}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Asrama & Gedung */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{r.dormitoryName}</div>
                      <div className="text-[11px] text-slate-500">{r.buildingName}</div>
                    </td>

                    {/* Lantai */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        Lt. {r.floor}
                      </span>
                    </td>

                    {/* Kapasitas */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1 font-semibold text-slate-900">
                        <BedDouble className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{r.capacity} Santri</span>
                      </div>
                    </td>

                    {/* Peruntukan */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          r.genderType === 'PUTRI'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : r.genderType === 'PUTRA'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-purple-50 text-purple-700 border-purple-200'
                        }`}
                      >
                        {r.genderType}
                      </span>
                    </td>

                    {/* Status & Maintenance Notes */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          {r.status === 'ACTIVE' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                              Siap Huni (Aktif)
                            </span>
                          )}
                          {r.status === 'MAINTENANCE' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-300">
                              <Wrench className="w-3 h-3 text-amber-600 animate-spin" />
                              Pemeliharaan (Maintenance)
                            </span>
                          )}
                          {r.status === 'INACTIVE' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                              <XCircle className="w-3 h-3 text-slate-400" />
                              Nonaktif
                            </span>
                          )}

                          {hasPermission('room.update') && (
                            <button
                              onClick={() => openStatusModal(r)}
                              title="Ubah Status Pemeliharaan"
                              className="text-[10px] text-emerald-600 hover:text-emerald-800 font-semibold underline ml-1"
                            >
                              Ganti
                            </button>
                          )}
                        </div>

                        {r.description && (
                          <p className="text-[11px] text-slate-500 truncate max-w-xs">
                            {r.description}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {hasPermission('room.update') && (
                          <button
                            title="Edit Kamar"
                            onClick={() => openEditModal(r)}
                            className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-sky-600 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}

                        {hasPermission('room.delete') && (
                          <button
                            title="Hapus Kamar"
                            onClick={() => {
                              setDeleteConfirmRoom(r);
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

      {/* Modal Add / Edit Kamar */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <DoorClosed className="w-4 h-4 text-emerald-600" />
                <span>{editingRoom ? 'Ubah Data Kamar' : 'Tambah Kamar Santri Baru'}</span>
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
                  Unit Asrama <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={formDormitoryId}
                  onChange={(e) => {
                    setFormDormitoryId(e.target.value);
                    const sel = dormitories.find((d) => d.id === e.target.value);
                    if (sel && sel.genderType === 'PUTRI') setFormGenderType('PUTRI');
                    else if (sel && sel.genderType === 'PUTRA') setFormGenderType('PUTRA');
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="" disabled>
                    Pilih Unit Asrama
                  </option>
                  {dormitories.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.genderType}) - Gedung {d.buildingName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nomor / Nama Kamar <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kamar 101 atau Kamar Shofa"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kode Kamar <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: KMR-101"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lantai</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formFloor}
                    onChange={(e) => setFormFloor(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kapasitas Santri (Ranjang)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    placeholder="4"
                    value={formCapacity}
                    onChange={(e) => setFormCapacity(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Peruntukan</label>
                  <select
                    value={formGenderType}
                    onChange={(e) => setFormGenderType(e.target.value as RoomGenderType)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    <option value="PUTRA">Santri Putra</option>
                    <option value="PUTRI">Santri Putri</option>
                    <option value="KHUSUS">Khusus / Isolasi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status Operasional</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as RoomStatus)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="ACTIVE">Aktif (Siap Huni)</option>
                  <option value="MAINTENANCE">Dalam Perbaikan (Maintenance)</option>
                  <option value="INACTIVE">Nonaktif / Kosong</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Keterangan / Fasilitas</label>
                <textarea
                  rows={2}
                  placeholder="Kelengkapan kasur, lemari, jendela, AC/Kipas, atau catatan perbaikan..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
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
                  {submitting ? 'Menyimpan...' : 'Simpan Kamar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Quick Maintenance & Status Toggle */}
      {statusModalRoom && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Wrench className="w-4 h-4 text-amber-600" />
                <span>Status & Pemeliharaan Kamar</span>
              </h3>
              <button
                onClick={() => setStatusModalRoom(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-900">{statusModalRoom.name}</span>
              <span className="text-slate-500 font-mono text-[11px] block">
                {statusModalRoom.code} • Asrama {statusModalRoom.dormitoryName}
              </span>
            </div>

            {errorMessage && (
              <div className="mt-3 p-2.5 bg-rose-50 border border-rose-200 rounded text-rose-700 text-[11px]">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleStatusSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Pilih Status Operasional:
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="roomMaintenanceStatus"
                      value="ACTIVE"
                      checked={statusSelection === 'ACTIVE'}
                      onChange={() => setStatusSelection('ACTIVE')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <span className="font-semibold text-emerald-700 block">Siap Huni (Aktif)</span>
                      <span className="text-[10px] text-slate-500">
                        Kamar bersih dan memenuhi syarat penempatan santri
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg border border-amber-200 bg-amber-50/50 hover:bg-amber-50 cursor-pointer">
                    <input
                      type="radio"
                      name="roomMaintenanceStatus"
                      value="MAINTENANCE"
                      checked={statusSelection === 'MAINTENANCE'}
                      onChange={() => setStatusSelection('MAINTENANCE')}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <div>
                      <span className="font-semibold text-amber-800 block">
                        Dalam Perbaikan (Maintenance)
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Sedang perbaikan instalasi listrik, cat, atap, atau pintu
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="roomMaintenanceStatus"
                      value="INACTIVE"
                      checked={statusSelection === 'INACTIVE'}
                      onChange={() => setStatusSelection('INACTIVE')}
                      className="text-slate-600 focus:ring-slate-500"
                    />
                    <div>
                      <span className="font-semibold text-slate-700 block">Nonaktif Sementara</span>
                      <span className="text-[10px] text-slate-500">
                        Kamar tidak digunakan pada semester ini
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Catatan Kondisi / Pekerjaan Perbaikan:
                </label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Penggantian kran air dan perbaikan engsel lemari nomor 2..."
                  value={statusDescription}
                  onChange={(e) => setStatusDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setStatusModalRoom(null)}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-xs transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : 'Perbarui Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Delete Confirmation */}
      {deleteConfirmRoom && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 text-xs">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-5 h-5" />
            </div>

            <h3 className="font-bold text-slate-900 text-center text-sm">Hapus Kamar Santri?</h3>
            <p className="mt-2 text-center text-slate-600">
              Apakah Anda yakin ingin menghapus kamar{' '}
              <strong className="text-slate-900">{deleteConfirmRoom.name}</strong> ({deleteConfirmRoom.code})?
            </p>
            <p className="mt-2 text-center text-slate-500 text-[11px]">
              Tindakan ini permanen dan akan tercatat pada audit log sistem.
            </p>

            {errorMessage && (
              <div className="mt-3 p-2.5 bg-rose-50 border border-rose-200 rounded text-rose-700 text-[11px]">
                {errorMessage}
              </div>
            )}

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmRoom(null)}
                className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold shadow-xs transition-colors disabled:opacity-50"
              >
                {submitting ? 'Menghapus...' : 'Ya, Hapus Kamar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
