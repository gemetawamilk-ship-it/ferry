import React, { useState } from 'react';
import { Teacher, Employee, EducationLevel, GenderType } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  Search,
  Plus,
  Edit2,
  Trash2,
  Power,
  BookOpen,
  Award,
  Phone,
  Mail,
  UserCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface TeacherListProps {
  teachers: Teacher[];
  employees: Employee[];
  onRefresh: () => void;
  showNotification: (type: 'success' | 'error', message: string) => void;
}

export const TeacherList: React.FC<TeacherListProps> = ({
  teachers,
  employees,
  onRefresh,
  showNotification,
}) => {
  const { hasPermission } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    employeeId: '',
    teacherCode: '',
    specialization: '',
    educationLevel: 'S1' as EducationLevel,
    qualification: '',
    teachingStatus: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
    notes: '',
  });

  // Employees who are NOT yet registered as teachers
  const registeredEmployeeIds = teachers
    .filter((t) => !editingTeacher || t.id !== editingTeacher.id)
    .map((t) => t.employeeId);
  const eligibleEmployees = employees.filter((e) => !registeredEmployeeIds.includes(e.id));

  const openCreateModal = () => {
    setEditingTeacher(null);
    const defaultEmp = eligibleEmployees[0];
    const generatedCode = `GUR-${String(teachers.length + 1).padStart(3, '0')}`;
    setFormData({
      employeeId: defaultEmp ? defaultEmp.id : '',
      teacherCode: generatedCode,
      specialization: '',
      educationLevel: 'S1',
      qualification: 'Sarjana Pendidikan Islam (S.Pd.I)',
      teachingStatus: 'ACTIVE',
      notes: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      employeeId: teacher.employeeId,
      teacherCode: teacher.teacherCode,
      specialization: teacher.specialization,
      educationLevel: teacher.educationLevel,
      qualification: teacher.qualification,
      teachingStatus: teacher.teachingStatus,
      notes: teacher.notes || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingTeacher && !formData.employeeId) {
      showNotification('error', 'Pilih pegawai yang akan didaftarkan sebagai guru.');
      return;
    }
    if (!formData.teacherCode.trim() || !formData.specialization.trim()) {
      showNotification('error', 'Kode guru dan spesialisasi keilmuan wajib diisi.');
      return;
    }

    setSubmitting(true);
    try {
      if (editingTeacher) {
        await api.updateTeacher(editingTeacher.id, {
          teacherCode: formData.teacherCode.trim().toUpperCase(),
          specialization: formData.specialization.trim(),
          educationLevel: formData.educationLevel,
          qualification: formData.qualification.trim(),
          teachingStatus: formData.teachingStatus,
          notes: formData.notes || undefined,
        });
        showNotification('success', `Profil guru '${editingTeacher.fullName}' berhasil diperbarui.`);
      } else {
        await api.createTeacher({
          employeeId: formData.employeeId,
          teacherCode: formData.teacherCode.trim().toUpperCase(),
          specialization: formData.specialization.trim(),
          educationLevel: formData.educationLevel,
          qualification: formData.qualification.trim(),
          teachingStatus: formData.teachingStatus,
          notes: formData.notes || undefined,
        });
        showNotification('success', `Guru baru berhasil didaftarkan.`);
      }
      setModalOpen(false);
      onRefresh();
    } catch (err: any) {
      showNotification('error', err.message || 'Gagal menyimpan data guru.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (teacher: Teacher) => {
    try {
      await api.toggleTeacherStatus(teacher.id);
      showNotification('success', `Status mengajar '${teacher.fullName}' berhasil diubah.`);
      onRefresh();
    } catch (err: any) {
      showNotification('error', err.message || 'Gagal mengubah status mengajar.');
    }
  };

  const handleDelete = async (teacher: Teacher) => {
    if (!confirm(`Hapus status guru '${teacher.fullName}' (${teacher.teacherCode})? Data pokok pegawai tidak akan dihapus.`)) {
      return;
    }
    try {
      await api.deleteTeacher(teacher.id);
      showNotification('success', `Data guru '${teacher.fullName}' berhasil dihapus.`);
      onRefresh();
    } catch (err: any) {
      showNotification('error', err.message || 'Gagal menghapus data guru.');
    }
  };

  const filteredTeachers = teachers.filter((t) => {
    const fullName = t.fullName || '';
    const matchSearch =
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.teacherCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.qualification.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || t.teachingStatus === filterStatus;
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
              placeholder="Cari kode guru, nama ustadz, bidang spesialisasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:bg-white"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
          >
            <option value="ALL">Semua Status Mengajar</option>
            <option value="ACTIVE">Aktif Mengajar</option>
            <option value="INACTIVE">Nonaktif / Cuti</option>
          </select>
        </div>

        {hasPermission('teacher.create') && (
          <button
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            Daftarkan Guru Baru
          </button>
        )}
      </div>

      {/* Teachers Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Kode & Nama Guru</th>
                <th className="px-4 py-3">Spesialisasi Keilmuan</th>
                <th className="px-4 py-3">Pendidikan & Gelar</th>
                <th className="px-4 py-3">Kontak & Akun</th>
                <th className="px-4 py-3">Status Mengajar</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                    Tidak ada data guru yang sesuai dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Kode & Nama Guru */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center text-xs">
                          {(teacher.fullName || teacher.teacherCode).charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{teacher.fullName || teacher.teacherCode}</span>
                            {(teacher.gender || teacher.employee?.gender) === 'PEREMPUAN' ? (
                              <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded font-semibold">
                                Ustadzah
                              </span>
                            ) : (
                              <span className="text-[10px] bg-sky-100 text-sky-700 px-1.5 py-0.2 rounded font-semibold">
                                Ustadz
                              </span>
                            )}
                          </div>
                          <div className="text-xs font-mono text-slate-500 flex items-center gap-2">
                            <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-bold">
                              {teacher.teacherCode}
                            </span>
                            <span>NIP: {teacher.employeeNumber || teacher.employee?.employeeNumber || '-'}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Spesialisasi */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 font-medium text-slate-800">
                        <BookOpen className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        <span>{teacher.specialization}</span>
                      </div>
                      {teacher.notes && (
                        <p className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">{teacher.notes}</p>
                      )}
                    </td>

                    {/* Pendidikan & Gelar */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1 text-xs font-semibold text-slate-700">
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        <span>{teacher.qualification}</span>
                      </div>
                      <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded mt-0.5 inline-block">
                        Jenjang: {teacher.educationLevel}
                      </span>
                    </td>

                    {/* Kontak & Akun */}
                    <td className="px-4 py-3.5 text-xs text-slate-600 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{teacher.phone || teacher.employee?.phone || '-'}</span>
                      </div>
                      {teacher.user || teacher.userAccount ? (
                        <span className="text-[11px] font-mono text-indigo-700 font-semibold">
                          @{teacher.user?.username || teacher.userAccount?.username}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Tanpa akun login</span>
                      )}
                    </td>

                    {/* Status Mengajar */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          teacher.teachingStatus === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            teacher.teachingStatus === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-400'
                          }`}
                        />
                        {teacher.teachingStatus === 'ACTIVE' ? 'Aktif Mengajar' : 'Nonaktif'}
                      </span>
                    </td>

                    {/* Aksi */}
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {hasPermission('teacher.update') && (
                          <>
                            <button
                              onClick={() => handleToggleStatus(teacher)}
                              title={
                                teacher.teachingStatus === 'ACTIVE'
                                  ? 'Nonaktifkan status mengajar'
                                  : 'Aktifkan status mengajar'
                              }
                              className={`p-1.5 rounded-lg transition-colors ${
                                teacher.teachingStatus === 'ACTIVE'
                                  ? 'text-slate-500 hover:text-amber-600 hover:bg-amber-50'
                                  : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                              }`}
                            >
                              <Power className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openEditModal(teacher)}
                              title="Edit Profil Guru"
                              className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {hasPermission('teacher.delete') && (
                          <button
                            onClick={() => handleDelete(teacher)}
                            title="Hapus Profil Guru"
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

      {/* Modal Daftarkan / Edit Guru */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-sky-100 text-sky-800">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {editingTeacher ? 'Edit Profil Guru / Pengajar' : 'Daftarkan Guru Baru'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Kualifikasi keilmuan dan penugasan pengajar pesantren
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
              {/* Pilih Pegawai (jika buat baru) */}
              {!editingTeacher ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Pilih Pegawai <span className="text-rose-500">*</span>
                  </label>
                  {eligibleEmployees.length === 0 ? (
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800">
                      Semua pegawai yang terdaftar telah memiliki profil Guru. Tambahkan pegawai baru terlebih dahulu di tab Pegawai.
                    </div>
                  ) : (
                    <select
                      required
                      value={formData.employeeId}
                      onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                      className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
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
                    {editingTeacher.fullName || editingTeacher.teacherCode} ({editingTeacher.employeeNumber || editingTeacher.employee?.employeeNumber || '-'})
                  </div>
                </div>
              )}

              {/* Kode Guru */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Kode Guru <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: GUR-001 / UST-FQH"
                  value={formData.teacherCode}
                  onChange={(e) => setFormData({ ...formData, teacherCode: e.target.value })}
                  className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg uppercase font-mono focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                />
              </div>

              {/* Spesialisasi Keilmuan */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Bidang Studi / Spesialisasi Keilmuan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Fiqih, Ushul Fiqih & Hadits Nabawi"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Jenjang Pendidikan */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Jenjang Pendidikan <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.educationLevel}
                    onChange={(e) =>
                      setFormData({ ...formData, educationLevel: e.target.value as EducationLevel })
                    }
                    className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  >
                    <option value="S1">S1 / Sarjana</option>
                    <option value="S2">S2 / Magister</option>
                    <option value="S3">S3 / Doktoral</option>
                    <option value="D3">Diploma 3 (D3)</option>
                    <option value="SMA">SMA / MA / Setara</option>
                    <option value="PESANTREN">Pesantren Salaf / Ma'had Aly</option>
                  </select>
                </div>

                {/* Status Mengajar */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Status Mengajar
                  </label>
                  <select
                    value={formData.teachingStatus}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        teachingStatus: e.target.value as 'ACTIVE' | 'INACTIVE',
                      })
                    }
                    className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  >
                    <option value="ACTIVE">Aktif Mengajar</option>
                    <option value="INACTIVE">Nonaktif / Cuti</option>
                  </select>
                </div>
              </div>

              {/* Kualifikasi / Gelar */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Kualifikasi Akademis / Gelar Resmi
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Lc., M.Ag (Universitas Al-Azhar Kairo)"
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                />
              </div>

              {/* Catatan */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Catatan / Riwayat Pengajaran
                </label>
                <textarea
                  rows={2}
                  placeholder="Keterangan tambahan mengenai guru"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
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
                  disabled={submitting || (!editingTeacher && eligibleEmployees.length === 0)}
                  className="px-5 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : editingTeacher ? 'Perbarui Guru' : 'Daftarkan Guru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
