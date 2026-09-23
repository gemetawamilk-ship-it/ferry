import React, { useState } from 'react';
import { Employee, User, EmployeeType, EmploymentStatus, GenderType } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Power,
  Link2,
  Unlink,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Phone,
  Mail,
  Calendar,
  Briefcase,
  UserCheck,
} from 'lucide-react';

interface EmployeeListProps {
  employees: Employee[];
  users: User[];
  onRefresh: () => void;
  showNotification: (type: 'success' | 'error', message: string) => void;
}

export const EmployeeList: React.FC<EmployeeListProps> = ({
  employees,
  users,
  onRefresh,
  showNotification,
}) => {
  const { hasPermission } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterType, setFilterType] = useState<string>('ALL');

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Link User modal
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [selectedEmployeeForLink, setSelectedEmployeeForLink] = useState<Employee | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  // Form state
  const [formData, setFormData] = useState({
    employeeNumber: '',
    fullName: '',
    nickname: '',
    gender: 'LAKI_LAKI' as GenderType,
    birthPlace: '',
    birthDate: '',
    phone: '',
    email: '',
    address: '',
    joinDate: new Date().toISOString().split('T')[0],
    employmentStatus: 'TETAP' as EmploymentStatus,
    position: 'Guru Pengajar',
    type: 'GURU' as EmployeeType,
    notes: '',
    userId: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
  });

  const openCreateModal = () => {
    setEditingEmployee(null);
    setFormData({
      employeeNumber: '',
      fullName: '',
      nickname: '',
      gender: 'LAKI_LAKI',
      birthPlace: '',
      birthDate: '',
      phone: '',
      email: '',
      address: '',
      joinDate: new Date().toISOString().split('T')[0],
      employmentStatus: 'TETAP',
      position: 'Guru Pengajar',
      type: 'GURU',
      notes: '',
      userId: '',
      status: 'ACTIVE',
    });
    setModalOpen(true);
  };

  const openEditModal = (emp: Employee) => {
    setEditingEmployee(emp);
    setFormData({
      employeeNumber: emp.employeeNumber,
      fullName: emp.fullName,
      nickname: emp.nickname || '',
      gender: emp.gender,
      birthPlace: emp.birthPlace || '',
      birthDate: emp.birthDate ? emp.birthDate.split('T')[0] : '',
      phone: emp.phone,
      email: emp.email,
      address: emp.address || '',
      joinDate: emp.joinDate ? emp.joinDate.split('T')[0] : '',
      employmentStatus: emp.employmentStatus,
      position: emp.position,
      type: emp.type,
      notes: emp.notes || '',
      userId: emp.userId || '',
      status: emp.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employeeNumber.trim() || !formData.fullName.trim() || !formData.phone.trim() || !formData.email.trim()) {
      showNotification('error', 'NIP/Kode, Nama Lengkap, Telepon, dan Email wajib diisi.');
      return;
    }

    setSubmitting(true);
    try {
      if (editingEmployee) {
        await api.updateEmployee(editingEmployee.id, {
          employeeNumber: formData.employeeNumber,
          fullName: formData.fullName,
          nickname: formData.nickname || undefined,
          gender: formData.gender,
          birthPlace: formData.birthPlace || undefined,
          birthDate: formData.birthDate || undefined,
          phone: formData.phone,
          email: formData.email,
          address: formData.address || undefined,
          joinDate: formData.joinDate,
          employmentStatus: formData.employmentStatus,
          position: formData.position,
          type: formData.type,
          notes: formData.notes || undefined,
          userId: formData.userId || null,
          status: formData.status,
        });
        showNotification('success', `Data pegawai '${formData.fullName}' berhasil diperbarui.`);
      } else {
        await api.createEmployee({
          employeeNumber: formData.employeeNumber,
          fullName: formData.fullName,
          nickname: formData.nickname || undefined,
          gender: formData.gender,
          birthPlace: formData.birthPlace || undefined,
          birthDate: formData.birthDate || undefined,
          phone: formData.phone,
          email: formData.email,
          address: formData.address || undefined,
          joinDate: formData.joinDate,
          employmentStatus: formData.employmentStatus,
          position: formData.position,
          type: formData.type,
          notes: formData.notes || undefined,
          userId: formData.userId || null,
          status: formData.status,
        });
        showNotification('success', `Pegawai '${formData.fullName}' berhasil ditambahkan.`);
      }
      setModalOpen(false);
      onRefresh();
    } catch (err: any) {
      showNotification('error', err.message || 'Gagal menyimpan data pegawai.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (emp: Employee) => {
    try {
      await api.toggleEmployeeStatus(emp.id);
      showNotification('success', `Status pegawai '${emp.fullName}' berhasil diubah.`);
      onRefresh();
    } catch (err: any) {
      showNotification('error', err.message || 'Gagal mengubah status pegawai.');
    }
  };

  const handleDelete = async (emp: Employee) => {
    if (emp.isTeacher) {
      showNotification('error', `Pegawai '${emp.fullName}' terdaftar sebagai Guru. Hapus profil Guru terlebih dahulu.`);
      return;
    }
    if (emp.isMusyrif) {
      showNotification('error', `Pegawai '${emp.fullName}' terdaftar sebagai Musyrif. Hapus profil Musyrif terlebih dahulu.`);
      return;
    }
    if (!confirm(`Hapus permanen data pegawai '${emp.fullName}' (${emp.employeeNumber})?`)) {
      return;
    }

    try {
      await api.deleteEmployee(emp.id);
      showNotification('success', `Pegawai '${emp.fullName}' berhasil dihapus.`);
      onRefresh();
    } catch (err: any) {
      showNotification('error', err.message || 'Gagal menghapus pegawai.');
    }
  };

  const openLinkModal = (emp: Employee) => {
    setSelectedEmployeeForLink(emp);
    setSelectedUserId(emp.userId || '');
    setLinkModalOpen(true);
  };

  const handleSaveLinkUser = async () => {
    if (!selectedEmployeeForLink) return;
    setSubmitting(true);
    try {
      if (selectedUserId) {
        await api.linkUserToEmployee(selectedEmployeeForLink.id, selectedUserId);
        showNotification('success', `Akun login berhasil dihubungkan ke ${selectedEmployeeForLink.fullName}.`);
      } else {
        await api.unlinkUserFromEmployee(selectedEmployeeForLink.id);
        showNotification('success', `Akun login berhasil diputus dari ${selectedEmployeeForLink.fullName}.`);
      }
      setLinkModalOpen(false);
      onRefresh();
    } catch (err: any) {
      showNotification('error', err.message || 'Gagal mengatur tautan akun login.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnlinkDirect = async (emp: Employee) => {
    if (!confirm(`Putuskan hubungan akun login pengguna '${emp.user?.username}' dari pegawai '${emp.fullName}'?`)) {
      return;
    }
    try {
      await api.unlinkUserFromEmployee(emp.id);
      showNotification('success', `Akun login berhasil diputus dari ${emp.fullName}.`);
      onRefresh();
    } catch (err: any) {
      showNotification('error', err.message || 'Gagal memutus akun login.');
    }
  };

  // Filtered employees
  const filteredEmployees = employees.filter((emp) => {
    const matchSearch =
      emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || emp.status === filterStatus;
    const matchType = filterType === 'ALL' || emp.type === filterType;
    return matchSearch && matchStatus && matchType;
  });

  // Available users for linking (either currently linked to this employee or not linked to any employee)
  const linkedUserIds = employees
    .filter((e) => e.userId && (!selectedEmployeeForLink || e.id !== selectedEmployeeForLink.id))
    .map((e) => e.userId);
  const availableUsers = users.filter((u) => !linkedUserIds.includes(u.id));

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari NIP, nama pegawai, jabatan, no telp..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">Semua Tipe SDM</option>
            <option value="GURU">Guru / Pengajar</option>
            <option value="MUSYRIF">Musyrif Asrama</option>
            <option value="STAF">Staf Administrasi</option>
            <option value="STRUKTURAL">Struktural</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">Semua Status</option>
            <option value="ACTIVE">Aktif Saja</option>
            <option value="INACTIVE">Nonaktif / Cuti</option>
          </select>
        </div>

        {hasPermission('employee.create') && (
          <button
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah Pegawai Baru
          </button>
        )}
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">NIP & Nama Pegawai</th>
                <th className="px-4 py-3">Tipe & Jabatan</th>
                <th className="px-4 py-3">Kontak</th>
                <th className="px-4 py-3">Status Kerja</th>
                <th className="px-4 py-3">Akun Login</th>
                <th className="px-4 py-3">Peran Pesantren</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                    Tidak ada data pegawai yang sesuai dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* NIP & Nama */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                          {emp.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{emp.fullName}</span>
                            {emp.gender === 'PEREMPUAN' ? (
                              <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded font-semibold">
                                Akhwat
                              </span>
                            ) : (
                              <span className="text-[10px] bg-sky-100 text-sky-700 px-1.5 py-0.2 rounded font-semibold">
                                Ikhwan
                              </span>
                            )}
                          </div>
                          <div className="text-xs font-mono text-slate-500 flex items-center gap-2">
                            <span>{emp.employeeNumber}</span>
                            {emp.nickname && <span className="text-slate-400">({emp.nickname})</span>}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Tipe & Jabatan */}
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-slate-800">{emp.position}</div>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                        {emp.type}
                      </span>
                    </td>

                    {/* Kontak */}
                    <td className="px-4 py-3.5 text-xs text-slate-600 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{emp.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate max-w-[140px]">{emp.email}</span>
                      </div>
                    </td>

                    {/* Status Kerja & Keaktifan */}
                    <td className="px-4 py-3.5">
                      <div className="text-xs font-semibold text-slate-700">
                        {emp.employmentStatus}
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full mt-1 ${
                          emp.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            emp.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-400'
                          }`}
                        />
                        {emp.status === 'ACTIVE' ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>

                    {/* Akun Login SSO */}
                    <td className="px-4 py-3.5">
                      {emp.user ? (
                        <div className="flex items-center gap-2">
                          <div className="text-xs">
                            <span className="font-mono font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                              @{emp.user.username}
                            </span>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              Role: {emp.user.role}
                            </div>
                          </div>
                          {hasPermission('employee.update') && (
                            <button
                              onClick={() => handleUnlinkDirect(emp)}
                              title="Putuskan akun login"
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                            >
                              <Unlink className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ) : (
                        <div>
                          <span className="text-xs text-slate-400 italic">Belum terhubung</span>
                          {hasPermission('employee.update') && (
                            <button
                              onClick={() => openLinkModal(emp)}
                              className="block text-[11px] text-indigo-600 font-semibold hover:underline mt-0.5"
                            >
                              + Tautkan Akun
                            </button>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Peran Tambahan (Guru / Musyrif) */}
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {emp.isTeacher && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200">
                            Guru ({emp.teacherProfile?.teacherCode})
                          </span>
                        )}
                        {emp.isMusyrif && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-200">
                            Musyrif ({emp.musyrifProfile?.musyrifCode})
                          </span>
                        )}
                        {!emp.isTeacher && !emp.isMusyrif && (
                          <span className="text-xs text-slate-400">-</span>
                        )}
                      </div>
                    </td>

                    {/* Aksi */}
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {hasPermission('employee.update') && (
                          <>
                            <button
                              onClick={() => openLinkModal(emp)}
                              title="Hubungkan / Atur Akun Pengguna"
                              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            >
                              <Link2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(emp)}
                              title={emp.status === 'ACTIVE' ? 'Nonaktifkan Pegawai' : 'Aktifkan Pegawai'}
                              className={`p-1.5 rounded-lg transition-colors ${
                                emp.status === 'ACTIVE'
                                  ? 'text-slate-500 hover:text-amber-600 hover:bg-amber-50'
                                  : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                              }`}
                            >
                              <Power className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openEditModal(emp)}
                              title="Edit Data Pegawai"
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {hasPermission('employee.delete') && (
                          <button
                            onClick={() => handleDelete(emp)}
                            title="Hapus Pegawai"
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

      {/* Modal Tambah / Edit Pegawai */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {editingEmployee ? 'Edit Data Pegawai' : 'Tambah Pegawai Baru'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Master identitas SDM dan data kepegawaian pesantren
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* NIP / Nomor Pegawai */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    NIP / Nomor Pegawai <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: NIP-2026-001"
                    value={formData.employeeNumber}
                    onChange={(e) => setFormData({ ...formData, employeeNumber: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg uppercase font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                {/* Nama Lengkap */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Nama Lengkap <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama lengkap beserta gelar"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                {/* Nama Panggilan */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Nama Panggilan / Alias
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Ustadz Zaid"
                    value={formData.nickname}
                    onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                {/* Jenis Kelamin */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Jenis Kelamin <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as GenderType })}
                    className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium"
                  >
                    <option value="LAKI_LAKI">Laki-laki (Ikhwan / Asatidz)</option>
                    <option value="PEREMPUAN">Perempuan (Akhwat / Ustadzah)</option>
                  </select>
                </div>

                {/* Tempat Lahir */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Tempat Lahir
                  </label>
                  <input
                    type="text"
                    placeholder="Kota kelahiran"
                    value={formData.birthPlace}
                    onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                {/* Tanggal Lahir */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Tanggal Lahir
                  </label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                {/* Nomor Telepon / WA */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    No Telepon / WhatsApp <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="081234567890"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Email Resmi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="pegawai@pesantren.id"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                {/* Tipe SDM */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Tipe SDM Utama <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as EmployeeType })}
                    className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium"
                  >
                    <option value="GURU">Guru / Pengajar</option>
                    <option value="MUSYRIF">Musyrif Asrama</option>
                    <option value="STAF">Staf Administrasi</option>
                    <option value="STRUKTURAL">Pimpinan / Struktural</option>
                  </select>
                </div>

                {/* Jabatan */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Jabatan Operasional <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Guru Fiqih & Musyrif"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                {/* Status Ikatan Kerja */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Status Kerja <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.employmentStatus}
                    onChange={(e) =>
                      setFormData({ ...formData, employmentStatus: e.target.value as EmploymentStatus })
                    }
                    className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium"
                  >
                    <option value="TETAP">Pegawai Tetap</option>
                    <option value="KONTRAK">Pegawai Kontrak</option>
                    <option value="HONORER">Honorer / Pengabdian</option>
                    <option value="MAGANG">Magang</option>
                  </select>
                </div>

                {/* Tanggal Bergabung */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Tanggal Bergabung
                  </label>
                  <input
                    type="date"
                    value={formData.joinDate}
                    onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Tautkan Akun Login (Opsional) */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Hubungkan Akun User Login (SSO)
                </label>
                <select
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="">-- Belum Dihubungkan (Hanya Data Personel) --</option>
                  {availableUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.fullName} (@{u.username}) — Role: {u.role}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Satu akun login hanya dapat ditautkan ke satu profil pegawai.
                </p>
              </div>

              {/* Alamat */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Alamat Domisili
                </label>
                <textarea
                  rows={2}
                  placeholder="Alamat lengkap tempat tinggal pegawai"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              {/* Catatan Tambahan */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Catatan Tambahan
                </label>
                <textarea
                  rows={2}
                  placeholder="Keterangan khusus mengenai pegawai"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : editingEmployee ? 'Perbarui Pegawai' : 'Simpan Pegawai'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tautkan Akun Login Pengguna */}
      {linkModalOpen && selectedEmployeeForLink && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-700">
                <Link2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Tautkan Akun Login</h3>
                <p className="text-xs text-slate-500">
                  Hubungkan akun pengguna untuk <strong>{selectedEmployeeForLink.fullName}</strong>
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Pilih Akun Pengguna Pesantren
              </label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full text-sm px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              >
                <option value="">-- Putus Hubungan Akun (Tidak ada Akun) --</option>
                {availableUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.fullName} (@{u.username}) — Role: {u.role}
                  </option>
                ))}
              </select>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70 text-xs text-slate-600">
                <p className="font-semibold text-slate-800 mb-1">Keamanan Kredensial:</p>
                <p>
                  Kata sandi tetap tersimpan aman di modul Akun Pengguna dan tidak disimpan pada modul data pegawai.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setLinkModalOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveLinkUser}
                disabled={submitting}
                className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors disabled:opacity-50"
              >
                {submitting ? 'Menyimpan...' : 'Simpan Tautan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
