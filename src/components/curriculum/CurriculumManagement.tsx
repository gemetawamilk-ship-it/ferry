import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  ClassSubject,
  ClassSubjectStatus,
  ClassSubjectStats,
  ClassGroup,
  Subject,
  Teacher,
} from '../../types';
import { ClassSubjectModal } from './ClassSubjectModal';
import {
  BookOpen,
  School,
  GraduationCap,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Edit2,
  Trash2,
  AlertCircle,
  Clock,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';

export const CurriculumManagement: React.FC = () => {
  const { hasPermission } = useAuth();

  const [loading, setLoading] = useState(true);
  const [classSubjects, setClassSubjects] = useState<ClassSubject[]>([]);
  const [stats, setStats] = useState<ClassSubjectStats | null>(null);

  // References for dropdowns
  const [classes, setClasses] = useState<ClassGroup[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  // Filters
  const [selectedClassId, setSelectedClassId] = useState<string>('ALL');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('ALL');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ClassSubject | null>(null);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<ClassSubject | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const canCreate = hasPermission('class_subject.create');
  const canUpdate = hasPermission('class_subject.update');
  const canDelete = hasPermission('class_subject.delete');

  const loadData = async () => {
    try {
      setLoading(true);
      setActionError(null);

      const [csRes, statsRes, clsRes, sbjRes, tchRes] = await Promise.all([
        api.getClassSubjects(),
        api.getClassSubjectStats(),
        api.getClasses(),
        api.getSubjects(),
        api.getTeachers(),
      ]);

      if (csRes.success) setClassSubjects(csRes.data || []);
      if (statsRes.success) setStats(statsRes.data || null);
      if (clsRes.success) setClasses(clsRes.data || []);
      if (sbjRes.success) setSubjects(sbjRes.data || []);
      if (tchRes.success) setTeachers(tchRes.data || []);
    } catch (err: any) {
      setActionError(err.message || 'Gagal memuat data kurikulum rombel.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateOrUpdate = async (data: {
    classId: string;
    subjectId: string;
    teacherId: string;
    creditHours: number;
    status: ClassSubjectStatus;
  }) => {
    setActionError(null);
    setActionSuccess(null);

    if (editingItem) {
      const res = await api.updateClassSubject(editingItem.id, {
        teacherId: data.teacherId,
        creditHours: data.creditHours,
        status: data.status,
      });
      if (!res.success) {
        throw new Error(res.message || 'Gagal memperbarui kurikulum rombel.');
      }
      setActionSuccess(res.message || 'Alokasi kurikulum berhasil diperbarui.');
    } else {
      const res = await api.createClassSubject(data);
      if (!res.success) {
        throw new Error(res.message || 'Gagal menambahkan mata pelajaran ke rombel.');
      }
      setActionSuccess(res.message || 'Mata pelajaran berhasil dialokasikan pada rombel.');
    }

    await loadData();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      setIsDeleting(true);
      setActionError(null);
      setActionSuccess(null);

      const res = await api.deleteClassSubject(deleteTarget.id);
      if (!res.success) {
        throw new Error(res.message || 'Gagal menghapus alokasi kurikulum.');
      }

      setActionSuccess(res.message || 'Alokasi kurikulum rombel berhasil dihapus.');
      setDeleteTarget(null);
      await loadData();
    } catch (err: any) {
      setActionError(err.message || 'Gagal menghapus alokasi kurikulum.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered List
  const filteredList = useMemo(() => {
    return classSubjects.filter((cs) => {
      // Class filter
      if (selectedClassId !== 'ALL' && cs.classId !== selectedClassId) return false;
      // Subject filter
      if (selectedSubjectId !== 'ALL' && cs.subjectId !== selectedSubjectId) return false;
      // Teacher filter
      if (selectedTeacherId !== 'ALL' && cs.teacherId !== selectedTeacherId) return false;
      // Status filter
      if (selectedStatus !== 'ALL' && cs.status !== selectedStatus) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const className = cs.classGroup?.name?.toLowerCase() || '';
        const classCode = cs.classGroup?.code?.toLowerCase() || '';
        const subjectName = cs.subject?.name?.toLowerCase() || '';
        const subjectCode = cs.subject?.code?.toLowerCase() || '';
        const teacherName = cs.teacher?.employee?.fullName?.toLowerCase() || '';
        const teacherCode = cs.teacher?.teacherCode?.toLowerCase() || '';

        const match =
          className.includes(q) ||
          classCode.includes(q) ||
          subjectName.includes(q) ||
          subjectCode.includes(q) ||
          teacherName.includes(q) ||
          teacherCode.includes(q);

        if (!match) return false;
      }

      return true;
    });
  }, [classSubjects, selectedClassId, selectedSubjectId, selectedTeacherId, selectedStatus, searchQuery]);

  const resetFilters = () => {
    setSelectedClassId('ALL');
    setSelectedSubjectId('ALL');
    setSelectedTeacherId('ALL');
    setSelectedStatus('ALL');
    setSearchQuery('');
  };

  const getSubjectTypeBadge = (type?: string) => {
    switch (type) {
      case 'DINIYAH':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'TAHFIDZ':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'BAHASA':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'UMUM':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'KETERAMPILAN':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              FASE 3.2 — AKADEMIK PESANTREN
            </span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <span>Kurikulum Rombel</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Pusat alokasi mata pelajaran ke rombongan belajar, penugasan guru/ustadz pengampu, penetapan jam pelajaran (JPL), serta fondasi penyusunan Jadwal Pelajaran (Fase 3.3).
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 transition-colors disabled:opacity-50"
            title="Muat ulang data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {canCreate && (
            <button
              onClick={() => {
                setEditingItem(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tetapkan Kurikulum</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {actionSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-between text-xs text-emerald-400 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="hover:text-emerald-300">
            &times;
          </button>
        </div>
      )}

      {actionError && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center justify-between text-xs text-rose-400 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError(null)} className="hover:text-rose-300">
            &times;
          </button>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Total Alokasi</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">{stats?.totalAllocations ?? classSubjects.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            Mata pelajaran terhubung ke rombel
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Kurikulum Aktif</span>
            <div className="w-7 h-7 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">
            {stats?.activeAllocations ?? classSubjects.filter((c) => c.status === 'ACTIVE').length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Siap untuk jadwal mingguan
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Total Beban Jam (JPL)</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">
            {stats?.totalCreditHours ?? classSubjects.reduce((acc, c) => acc + (c.creditHours || 0), 0)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Jam pelajaran / tatap muka
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Rombel Terisi</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
              <School className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">
            {stats?.totalClassesConfigured ?? new Set(classSubjects.map((c) => c.classId)).size}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Rombongan belajar terkonfigurasi
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Filter className="w-4 h-4 text-emerald-400" />
            <span>Filter & Pencarian Kurikulum</span>
          </div>
          {(selectedClassId !== 'ALL' ||
            selectedSubjectId !== 'ALL' ||
            selectedTeacherId !== 'ALL' ||
            selectedStatus !== 'ALL' ||
            searchQuery.trim()) && (
            <button
              onClick={resetFilters}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              Reset Semua Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari rombel, mapel, guru..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Class Filter */}
          <div>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
            >
              <option value="ALL">Semua Kelas / Rombel</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  [{cls.code}] {cls.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Filter */}
          <div>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
            >
              <option value="ALL">Semua Mata Pelajaran</option>
              {subjects.map((sbj) => (
                <option key={sbj.id} value={sbj.id}>
                  [{sbj.code}] {sbj.name}
                </option>
              ))}
            </select>
          </div>

          {/* Teacher Filter */}
          <div>
            <select
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
            >
              <option value="ALL">Semua Guru / Pengajar</option>
              {teachers.map((tch) => (
                <option key={tch.id} value={tch.id}>
                  {tch.employee?.fullName || 'Pengajar'} ({tch.teacherCode})
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
            >
              <option value="ALL">Semua Status</option>
              <option value="ACTIVE">Aktif (Diajarkan)</option>
              <option value="INACTIVE">Tidak Aktif</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/60 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-5 py-3">Kelas / Rombel</th>
                <th scope="col" className="px-5 py-3">Mata Pelajaran</th>
                <th scope="col" className="px-5 py-3">Guru / Pengajar</th>
                <th scope="col" className="px-4 py-3 text-center">Beban JPL</th>
                <th scope="col" className="px-4 py-3 text-center">Status</th>
                <th scope="col" className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading && classSubjects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-400" />
                    <span>Memuat data kurikulum rombel...</span>
                  </td>
                </tr>
              ) : filteredList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                    <BookOpen className="w-8 h-8 mx-auto mb-3 text-slate-600 opacity-60" />
                    <p className="text-sm font-medium text-slate-300">Belum ada alokasi mata pelajaran</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {searchQuery || selectedClassId !== 'ALL' || selectedSubjectId !== 'ALL' || selectedTeacherId !== 'ALL' || selectedStatus !== 'ALL'
                        ? 'Tidak ada data yang cocok dengan kriteria filter saat ini.'
                        : 'Mulai tambahkan mata pelajaran ke rombongan belajar untuk menyusun kurikulum pesantren.'}
                    </p>
                    {canCreate && (
                      <button
                        onClick={() => {
                          setEditingItem(null);
                          setIsModalOpen(true);
                        }}
                        className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tetapkan Kurikulum Baru</span>
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredList.map((cs) => {
                  const classItem = cs.classGroup;
                  const subjectItem = cs.subject;
                  const teacherItem = cs.teacher;
                  const teacherName = teacherItem?.employee?.fullName || 'Pengajar Tidak Terdaftar';
                  const teacherCode = teacherItem?.teacherCode || '-';
                  const specialization = teacherItem?.specialization || '';

                  return (
                    <tr key={cs.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* Kelas / Rombel */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                            <School className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-white">
                              {classItem?.name || 'Rombel Tidak Ditemukan'}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[11px] font-mono text-emerald-400 font-medium">
                                {classItem?.code || cs.classId}
                              </span>
                              {classItem?.gender && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                                  {classItem.gender}
                                </span>
                              )}
                              {classItem?.level && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                                  Tingkat {classItem.level}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Mata Pelajaran */}
                      <td className="px-5 py-3.5">
                        <div>
                          <div className="font-medium text-white flex items-center gap-2">
                            <span>{subjectItem?.name || 'Mata Pelajaran Tidak Ditemukan'}</span>
                            {subjectItem?.type && (
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${getSubjectTypeBadge(
                                  subjectItem.type
                                )}`}
                              >
                                {subjectItem.type}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                            Kode: <span className="text-slate-300 font-semibold">{subjectItem?.code || cs.subjectId}</span>
                            {subjectItem?.shortName && ` (${subjectItem.shortName})`}
                          </div>
                        </div>
                      </td>

                      {/* Guru / Pengajar */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 text-xs font-semibold shrink-0">
                            {teacherName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-slate-200">{teacherName}</div>
                            <div className="text-[11px] text-slate-400">
                              NIP/Kode: <span className="font-mono text-slate-300">{teacherCode}</span>
                              {specialization ? ` | ${specialization}` : ''}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Beban JPL */}
                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold text-xs">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{cs.creditHours} JPL</span>
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                            cs.status === 'ACTIVE'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-slate-700/50 text-slate-400 border-slate-600'
                          }`}
                        >
                          {cs.status === 'ACTIVE' ? 'Aktif' : 'Tidak Aktif'}
                        </span>
                      </td>

                      {/* Aksi */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          {canUpdate && (
                            <button
                              onClick={() => {
                                setEditingItem(cs);
                                setIsModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                              title="Ubah Alokasi"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {canDelete && (
                            <button
                              onClick={() => setDeleteTarget(cs)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 transition-colors"
                              title="Hapus dari Rombel"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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

        {/* Footer Info */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-850 flex items-center justify-between text-xs text-slate-400">
          <div>
            Menampilkan <span className="font-semibold text-white">{filteredList.length}</span> dari{' '}
            <span className="font-semibold text-white">{classSubjects.length}</span> alokasi kurikulum rombel
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
            <Calendar className="w-3.5 h-3.5" />
            <span>Kesiapan integrasi Phase 3.3 — Jadwal Pelajaran</span>
          </div>
        </div>
      </div>

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <ClassSubjectModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingItem(null);
          }}
          onSubmit={handleCreateOrUpdate}
          classSubject={editingItem}
          classes={classes}
          subjects={subjects}
          teachers={teachers}
        />
      )}

      {/* Confirmation Delete Dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Konfirmasi Hapus Kurikulum</h3>
                <p className="text-xs text-slate-400">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-800/60 border border-slate-700/60 rounded-lg space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Rombongan Belajar:</span>
                <span className="font-semibold text-white">{deleteTarget.classGroup?.name || deleteTarget.classId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Mata Pelajaran:</span>
                <span className="font-semibold text-emerald-400">{deleteTarget.subject?.name || deleteTarget.subjectId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Guru Pengajar:</span>
                <span className="text-slate-200">{deleteTarget.teacher?.employee?.fullName || 'Pengajar'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Alokasi Jam:</span>
                <span className="text-amber-400 font-bold">{deleteTarget.creditHours} JPL</span>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              Apakah Anda yakin ingin menghapus alokasi mata pelajaran ini dari rombel tersebut?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                {isDeleting ? 'Menghapus...' : 'Ya, Hapus Kurikulum'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
