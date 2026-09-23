import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../services/api';
import {
  ClassGroup,
  ClassStats,
  AcademicYear,
  Program,
  Teacher,
  Student,
} from '../../types';
import { useAuth } from '../../context/AuthContext';
import { ClassModal } from './ClassModal';
import { ClassDetailModal } from './ClassDetailModal';
import {
  School,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Users,
  CheckCircle2,
  AlertCircle,
  Calendar,
  BookOpen,
  Edit2,
  Trash2,
  Eye,
  UserCheck,
  Building2,
  Percent,
} from 'lucide-react';

export const ClassManagement: React.FC = () => {
  const { hasPermission } = useAuth();

  // Data states
  const [classes, setClasses] = useState<ClassGroup[]>([]);
  const [stats, setStats] = useState<ClassStats | null>(null);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);

  // Filter states
  const [search, setSearch] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterProgram, setFilterProgram] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterLevel, setFilterLevel] = useState('');

  // UI / Modal states
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassGroup | null>(null);
  const [viewingClassId, setViewingClassId] = useState<string | null>(null);
  const [deletingClass, setDeletingClass] = useState<ClassGroup | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Notification feedback
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, classesRes, ayRes, progRes, tchRes, stRes] = await Promise.allSettled([
        api.getClassStats(),
        api.getClasses({
          academicYearId: filterYear || undefined,
          programId: filterProgram || undefined,
          gender: filterGender || undefined,
          status: filterStatus || undefined,
          search: search || undefined,
          level: filterLevel || undefined,
        }),
        api.getAcademicYears(),
        api.getPrograms(),
        api.getTeachers(),
        api.getStudents(),
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value.success) {
        setStats(statsRes.value.data);
      }
      if (classesRes.status === 'fulfilled' && classesRes.value.success) {
        setClasses(classesRes.value.data);
      }
      if (ayRes.status === 'fulfilled' && ayRes.value.success) {
        setAcademicYears(ayRes.value.data);
      }
      if (progRes.status === 'fulfilled' && progRes.value.success) {
        setPrograms(progRes.value.data);
      }
      if (tchRes.status === 'fulfilled' && tchRes.value.success) {
        setTeachers(tchRes.value.data);
      }
      if (stRes.status === 'fulfilled' && stRes.value.success) {
        setAllStudents(stRes.value.data);
      }
    } catch {
      showNotification('error', 'Gagal memuat data rombongan belajar.');
    } finally {
      setLoading(false);
    }
  }, [filterYear, filterProgram, filterGender, filterStatus, search, filterLevel]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Refresh single class when viewing in detail modal
  const handleRefreshCurrentClass = async () => {
    if (!viewingClassId) return;
    try {
      const res = await api.getClassById(viewingClassId);
      if (res.success) {
        // Update in list as well
        setClasses((prev) => prev.map((c) => (c.id === viewingClassId ? res.data : c)));
      }
      // Also refresh stats and student list
      const [stRes, statsRes] = await Promise.all([api.getStudents(), api.getClassStats()]);
      if (stRes.success) setAllStudents(stRes.data);
      if (statsRes.success) setStats(statsRes.data);
    } catch {
      // silent refresh fail
    }
  };

  const handleSaveClass = async (data: Partial<ClassGroup>) => {
    try {
      if (editingClass) {
        const res = await api.updateClass(editingClass.id, data);
        if (res.success) {
          showNotification('success', res.message || 'Rombel berhasil diperbarui.');
          loadData();
          return true;
        }
      } else {
        const res = await api.createClass(data);
        if (res.success) {
          showNotification('success', res.message || 'Rombel baru berhasil dibuat.');
          loadData();
          return true;
        }
      }
      return false;
    } catch (err: unknown) {
      showNotification('error', err instanceof Error ? err.message : 'Gagal menyimpan rombel.');
      return false;
    }
  };

  const handleDeleteClass = async () => {
    if (!deletingClass) return;
    setDeleteLoading(true);
    try {
      const res = await api.deleteClass(deletingClass.id);
      if (res.success) {
        showNotification('success', res.message || 'Rombel berhasil dihapus.');
        setDeletingClass(null);
        loadData();
      }
    } catch (err: unknown) {
      showNotification('error', err instanceof Error ? err.message : 'Gagal menghapus rombel.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Find currently active viewing class object
  const currentViewingClass = classes.find((c) => c.id === viewingClassId) || null;

  return (
    <div className="space-y-6">
      {/* Header & Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <School className="w-7 h-7 text-emerald-400" />
            <span>Master Data Kelas & Rombel</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Kelola rombongan belajar santri, penempatan kelas, kapasitas, dan penetapan wali kelas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadData()}
            disabled={loading}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors disabled:opacity-50"
            title="Muat Ulang Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
          </button>

          {hasPermission('class.create') && (
            <button
              onClick={() => {
                setEditingClass(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg flex items-center gap-2 shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Rombel</span>
            </button>
          )}
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 animate-in fade-in duration-200 border ${
            notification.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Total Rombel</span>
              <School className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white">{stats.totalClasses}</div>
            <div className="text-xs text-emerald-400 mt-1">{stats.activeClasses} Rombel Aktif</div>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Total Kapasitas</span>
              <Building2 className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-bold text-white">{stats.totalCapacity}</div>
            <div className="text-xs text-slate-400 mt-1">Daya tampung santri</div>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Santri Terisi</span>
              <Users className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-2xl font-bold text-white">{stats.totalEnrolled}</div>
            <div className="text-xs text-slate-400 mt-1">
              {stats.totalCapacity - stats.totalEnrolled} kursi tersisa
            </div>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Tingkat Okupansi</span>
              <Percent className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white">{stats.occupancyRate}%</div>
            <div className="text-xs text-amber-400 mt-1">Rata-rata keterisian</div>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Wali Kelas Ditugaskan</span>
              <UserCheck className="w-4 h-4 text-violet-400" />
            </div>
            <div className="text-2xl font-bold text-white">{stats.withHomeroomTeacher}</div>
            <div className="text-xs text-slate-400 mt-1">
              {stats.withoutHomeroomTeacher} rombel belum ada wali
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari nama rombel, kode, atau ruang..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          {/* Filter Tahun Akademik */}
          <div>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-hidden focus:border-emerald-500"
            >
              <option value="">Semua Tahun Ajaran</option>
              {academicYears.map((ay) => (
                <option key={ay.id} value={ay.id}>
                  {ay.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Program */}
          <div>
            <select
              value={filterProgram}
              onChange={(e) => setFilterProgram(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-hidden focus:border-emerald-500"
            >
              <option value="">Semua Program</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Gender */}
          <div>
            <select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-hidden focus:border-emerald-500"
            >
              <option value="">Semua Gender</option>
              <option value="PUTRA">PUTRA</option>
              <option value="PUTRI">PUTRI</option>
              <option value="CAMPURAN">CAMPURAN</option>
            </select>
          </div>

          {/* Filter Status */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-hidden focus:border-emerald-500"
            >
              <option value="">Semua Status</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </div>
        </div>

        {(search || filterYear || filterProgram || filterGender || filterStatus || filterLevel) && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
            <span>Filter diterapkan: Menampilkan {classes.length} rombel</span>
            <button
              onClick={() => {
                setSearch('');
                setFilterYear('');
                setFilterProgram('');
                setFilterGender('');
                setFilterStatus('');
                setFilterLevel('');
              }}
              className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>

      {/* Classes Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Nama & Kode Rombel</th>
                <th className="py-3.5 px-3">Tingkat & Program</th>
                <th className="py-3.5 px-3">Gender</th>
                <th className="py-3.5 px-3">Kapasitas & Terisi</th>
                <th className="py-3.5 px-3">Wali Kelas</th>
                <th className="py-3.5 px-3">Tahun Akademik</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              {loading && classes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-500" />
                    <span>Memuat data rombongan belajar...</span>
                  </td>
                </tr>
              ) : classes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    Tidak ada rombongan belajar yang ditemukan.
                  </td>
                </tr>
              ) : (
                classes.map((cls) => {
                  const enrolledCount = cls.students?.length || cls.totalStudents || 0;
                  const percent = cls.capacity > 0 ? Math.round((enrolledCount / cls.capacity) * 100) : 0;

                  return (
                    <tr key={cls.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* Nama & Kode */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-lg bg-slate-800 text-emerald-400">
                            <School className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-white text-sm">{cls.name}</div>
                            <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-2">
                              <span>{cls.code}</span>
                              {cls.roomLocation && (
                                <span className="text-slate-400 font-sans">• {cls.roomLocation}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Tingkat & Program */}
                      <td className="py-3.5 px-3">
                        <span className="font-semibold text-slate-200">Kelas {cls.level}</span>
                        <div className="text-[11px] text-slate-400 truncate max-w-[140px]">
                          {cls.program?.name || cls.programId}
                        </div>
                      </td>

                      {/* Gender */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                            cls.gender === 'PUTRA'
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              : cls.gender === 'PUTRI'
                              ? 'bg-pink-500/10 text-pink-400 border border-pink-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {cls.gender}
                        </span>
                      </td>

                      {/* Kapasitas & Terisi */}
                      <td className="py-3.5 px-3">
                        <div className="w-28 space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-semibold text-white">
                              {enrolledCount} / {cls.capacity}
                            </span>
                            <span className="text-slate-400">{percent}%</span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${
                                percent >= 100
                                  ? 'bg-rose-500'
                                  : percent >= 80
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.min(100, percent)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Wali Kelas */}
                      <td className="py-3.5 px-3">
                        {cls.homeroomTeacher ? (
                          <div className="flex items-center gap-1.5">
                            <UserCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                            <span className="text-slate-200 font-medium truncate max-w-[130px]">
                              {cls.homeroomTeacher.employee?.fullName || cls.homeroomTeacher.teacherCode}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-500 italic text-[11px]">Belum diatur</span>
                        )}
                      </td>

                      {/* Tahun Akademik */}
                      <td className="py-3.5 px-3 text-slate-300">
                        {cls.academicYear?.name || cls.academicYearId}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            cls.status === 'ACTIVE'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : cls.status === 'INACTIVE'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-slate-700/50 text-slate-400 border border-slate-600/30'
                          }`}
                        >
                          {cls.status}
                        </span>
                      </td>

                      {/* Aksi */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Detail / Kelola Santri */}
                          <button
                            onClick={() => setViewingClassId(cls.id)}
                            title="Detail Rombel & Kelola Santri"
                            className="p-1.5 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-md transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit Class */}
                          {hasPermission('class.update') && (
                            <button
                              onClick={() => {
                                setEditingClass(cls);
                                setIsModalOpen(true);
                              }}
                              title="Edit Rombel"
                              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}

                          {/* Delete Class */}
                          {hasPermission('class.delete') && (
                            <button
                              onClick={() => setDeletingClass(cls)}
                              title="Hapus Rombel"
                              className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-md transition-colors"
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

      {/* Modal Add / Edit Class */}
      {isModalOpen && (
        <ClassModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingClass(null);
          }}
          onSubmit={handleSaveClass}
          initialData={editingClass}
          academicYears={academicYears}
          programs={programs}
          teachers={teachers}
        />
      )}

      {/* Modal Detail Class & Student Placement */}
      {viewingClassId && currentViewingClass && (
        <ClassDetailModal
          isOpen={!!viewingClassId}
          onClose={() => setViewingClassId(null)}
          classGroup={currentViewingClass}
          allClasses={classes}
          allStudents={allStudents}
          teachers={teachers}
          onRefreshClass={handleRefreshCurrentClass}
          onAssignStudent={async (classId, studentId, notes) => {
            try {
              const res = await api.assignStudentClass(classId, studentId, notes);
              if (res.success) {
                showNotification('success', res.message || 'Santri berhasil ditempatkan.');
                return true;
              }
              return false;
            } catch (err: unknown) {
              showNotification('error', err instanceof Error ? err.message : 'Gagal menempatkan santri.');
              return false;
            }
          }}
          onTransferStudent={async (sourceClassId, studentId, targetClassId, notes) => {
            try {
              const res = await api.transferStudentClass(sourceClassId, studentId, targetClassId, notes);
              if (res.success) {
                showNotification('success', res.message || 'Santri berhasil dimutasi.');
                return true;
              }
              return false;
            } catch (err: unknown) {
              showNotification('error', err instanceof Error ? err.message : 'Gagal memutasi santri.');
              return false;
            }
          }}
          onRemoveStudent={async (classId, studentId, reason) => {
            try {
              const res = await api.removeStudentFromClass(classId, studentId, reason);
              if (res.success) {
                showNotification('success', res.message || 'Santri berhasil dikeluarkan dari rombel.');
                return true;
              }
              return false;
            } catch (err: unknown) {
              showNotification('error', err instanceof Error ? err.message : 'Gagal mengeluarkan santri.');
              return false;
            }
          }}
          onUpdateHomeroom={async (classId, homeroomTeacherId) => {
            try {
              const res = await api.updateClassHomeroom(classId, homeroomTeacherId);
              if (res.success) {
                showNotification('success', res.message || 'Wali kelas berhasil diperbarui.');
                handleRefreshCurrentClass();
                return true;
              }
              return false;
            } catch (err: unknown) {
              showNotification('error', err instanceof Error ? err.message : 'Gagal memperbarui wali kelas.');
              return false;
            }
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingClass && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">Hapus Rombongan Belajar?</h3>
            </div>

            <p className="text-xs text-slate-300">
              Apakah Anda yakin ingin menghapus rombel{' '}
              <strong className="text-white">{deletingClass.name}</strong> ({deletingClass.code})?
            </p>

            {(deletingClass.students?.length || deletingClass.totalStudents || 0) > 0 && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>
                  Rombel ini masih memiliki {deletingClass.students?.length || deletingClass.totalStudents}{' '}
                  santri aktif. Sistem akan menolak penghapusan hingga santri dipindahkan atau dikeluarkan.
                </span>
              </div>
            )}

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingClass(null)}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                disabled={deleteLoading}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteClass}
                disabled={deleteLoading}
                className="px-4 py-2 text-xs font-medium text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors disabled:opacity-50"
              >
                {deleteLoading ? 'Menghapus...' : 'Hapus Rombel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
