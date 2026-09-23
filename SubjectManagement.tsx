import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../services/api';
import { Subject, SubjectStats, SubjectType, SubjectStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { SubjectModal } from './SubjectModal';
import { SubjectDetailModal, getSubjectTypeBadge } from './SubjectDetailModal';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Edit2,
  Trash2,
  Eye,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

export const SubjectManagement: React.FC = () => {
  const { hasPermission } = useAuth();

  // Data states
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [stats, setStats] = useState<SubjectStats | null>(null);

  // Filter states
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // UI / Modal states
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [viewingSubject, setViewingSubject] = useState<Subject | null>(null);
  const [deletingSubject, setDeletingSubject] = useState<Subject | null>(null);
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
      const [statsRes, subjectsRes] = await Promise.allSettled([
        api.getSubjectStats(),
        api.getSubjects({
          search: search.trim() || undefined,
          type: filterType !== 'ALL' ? filterType : undefined,
          status: filterStatus !== 'ALL' ? filterStatus : undefined,
        }),
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value.success) {
        setStats(statsRes.value.data);
      }
      if (subjectsRes.status === 'fulfilled' && subjectsRes.value.success) {
        setSubjects(subjectsRes.value.data);
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Gagal memuat data mata pelajaran.');
    } finally {
      setLoading(false);
    }
  }, [search, filterType, filterStatus]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Create or Update
  const handleSaveSubject = async (formData: {
    code: string;
    name: string;
    shortName: string;
    type: SubjectType;
    creditHours: number;
    status: SubjectStatus;
    description?: string | null;
  }) => {
    if (editingSubject) {
      const res = await api.updateSubject(editingSubject.id, formData);
      if (res.success) {
        showNotification('success', res.message || 'Mata pelajaran berhasil diperbarui.');
        loadData();
      }
    } else {
      const res = await api.createSubject(formData);
      if (res.success) {
        showNotification('success', res.message || 'Mata pelajaran baru berhasil ditambahkan.');
        loadData();
      }
    }
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (!deletingSubject) return;

    setDeleteLoading(true);
    try {
      const res = await api.deleteSubject(deletingSubject.id);
      if (res.success) {
        showNotification('success', res.message || 'Mata pelajaran berhasil dihapus.');
        setDeletingSubject(null);
        loadData();
      }
    } catch (err: any) {
      showNotification('error', err.message || 'Tidak dapat menghapus mata pelajaran karena masih digunakan oleh data akademik.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const resetFilters = () => {
    setSearch('');
    setFilterType('ALL');
    setFilterStatus('ALL');
  };

  const hasActiveFilters = Boolean(search || filterType !== 'ALL' || filterStatus !== 'ALL');

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-5 right-5 z-50 p-4 rounded-xl shadow-2xl border flex items-center gap-3 transition-all transform animate-in slide-in-from-bottom-5 duration-300 ${
            notification.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-200'
              : 'bg-rose-950/90 border-rose-500/30 text-rose-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span className="text-xs font-medium">{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">Mata Pelajaran</h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                Phase 3.1
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Master data mata pelajaran untuk kebutuhan kurikulum dan pembelajaran.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => loadData()}
            disabled={loading}
            className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
            title="Muat Ulang Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {hasPermission('subject.create') && (
            <button
              onClick={() => {
                setEditingSubject(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Mata Pelajaran</span>
            </button>
          )}
        </div>
      </div>

      {/* STATISTIK CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Mata Pelajaran */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Mata Pelajaran</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-white">
              {stats?.totalSubjects ?? subjects.length}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <span>Alokasi total:</span>
              <span className="font-semibold text-slate-300 font-mono">
                {stats?.totalCreditHours ?? subjects.reduce((acc, s) => acc + s.creditHours, 0)} JPL
              </span>
            </div>
          </div>
        </div>

        {/* Aktif */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Aktif</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-emerald-400">
              {stats?.activeSubjects ?? subjects.filter((s) => s.status === 'ACTIVE').length}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Diajarkan pada semester aktif
            </div>
          </div>
        </div>

        {/* Tidak Aktif */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Tidak Aktif</span>
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-slate-300">
              {stats?.inactiveSubjects ?? subjects.filter((s) => s.status === 'INACTIVE').length}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Ditangguhkan / cadangan
            </div>
          </div>
        </div>

        {/* Mata Pelajaran Diniyah */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Mata Pelajaran Diniyah</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-amber-400">
              {stats?.diniyahSubjects ?? subjects.filter((s) => s.type === 'DINIYAH').length}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Karakter kepesantrenan salaf</span>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari kode, nama, singkatan..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Filter Jenis */}
            <div className="relative">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">Semua Jenis</option>
                <option value="DINIYAH">Diniyah (Salaf / Turats)</option>
                <option value="UMUM">Umum (Nasional)</option>
                <option value="BAHASA">Bahasa (Arab & Asing)</option>
                <option value="TAHFIDZ">Tahfidz Al-Qur'an</option>
                <option value="KETERAMPILAN">Keterampilan & Vokasi</option>
                <option value="LAINNYA">Lainnya</option>
              </select>
            </div>

            {/* Filter Status */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">Semua Status</option>
                <option value="ACTIVE">Aktif</option>
                <option value="INACTIVE">Tidak Aktif</option>
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs text-slate-400 hover:text-white px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 shrink-0 self-start md:self-auto"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* SUBJECTS TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 w-28">Kode</th>
                <th className="py-3 px-4">Nama Mata Pelajaran</th>
                <th className="py-3 px-4 w-24">Singkatan</th>
                <th className="py-3 px-4 w-32">Jenis</th>
                <th className="py-3 px-4 w-24 text-center">JPL</th>
                <th className="py-3 px-4 w-28 text-center">Status</th>
                <th className="py-3 px-4 w-32 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading && subjects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-400" />
                    <span>Memuat data mata pelajaran...</span>
                  </td>
                </tr>
              ) : subjects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <BookOpen className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                    <p className="text-sm font-medium text-slate-400">Tidak ada mata pelajaran ditemukan</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {hasActiveFilters
                        ? 'Coba ubah kata kunci atau reset filter pencarian.'
                        : 'Mulai dengan menambahkan mata pelajaran pertama Anda.'}
                    </p>
                  </td>
                </tr>
              ) : (
                subjects.map((subject) => {
                  const typeBadge = getSubjectTypeBadge(subject.type);
                  return (
                    <tr
                      key={subject.id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Kode */}
                      <td className="py-3.5 px-4 font-mono font-bold text-white tracking-wide">
                        <span className="px-2 py-0.5 rounded-sm bg-slate-950 border border-slate-800 text-emerald-400">
                          {subject.code}
                        </span>
                      </td>

                      {/* Nama Mata Pelajaran */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-200 group-hover:text-emerald-300 transition-colors">
                          {subject.name}
                        </div>
                        {subject.description ? (
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 max-w-md">
                            {subject.description}
                          </p>
                        ) : (
                          <span className="text-[11px] text-slate-600 italic">Tanpa catatan deskripsi</span>
                        )}
                      </td>

                      {/* Singkatan */}
                      <td className="py-3.5 px-4 font-mono text-slate-400 font-medium">
                        {subject.shortName || subject.code}
                      </td>

                      {/* Jenis */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block text-[11px] px-2.5 py-0.5 rounded-md border font-medium ${typeBadge.bg}`}
                        >
                          {typeBadge.label}
                        </span>
                      </td>

                      {/* JPL */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 font-mono font-bold text-slate-200 px-2.5 py-0.5 rounded-md bg-slate-950 border border-slate-800">
                          <Clock className="w-3 h-3 text-blue-400" />
                          <span>{subject.creditHours}</span>
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        {subject.status === 'ACTIVE' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                            Tidak Aktif
                          </span>
                        )}
                      </td>

                      {/* Aksi */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Detail Button */}
                          <button
                            onClick={() => setViewingSubject(subject)}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                            title="Lihat Detail Mata Pelajaran"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit Button */}
                          {hasPermission('subject.update') && (
                            <button
                              onClick={() => {
                                setEditingSubject(subject);
                                setIsModalOpen(true);
                              }}
                              className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                              title="Ubah Data"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}

                          {/* Delete Button */}
                          {hasPermission('subject.delete') && (
                            <button
                              onClick={() => setDeletingSubject(subject)}
                              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                              title="Hapus Mata Pelajaran"
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

        {/* Table Footer info */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-950/60 border-t border-slate-800 text-xs text-slate-400">
          <span>
            Menampilkan <strong className="text-white">{subjects.length}</strong> mata pelajaran
          </span>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Aktif: {subjects.filter((s) => s.status === 'ACTIVE').length}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-500" />
              Tidak Aktif: {subjects.filter((s) => s.status === 'INACTIVE').length}
            </span>
          </div>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      <SubjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSubject(null);
        }}
        onSubmit={handleSaveSubject}
        subject={editingSubject}
      />

      {/* DETAIL MODAL */}
      <SubjectDetailModal
        isOpen={Boolean(viewingSubject)}
        onClose={() => setViewingSubject(null)}
        subject={viewingSubject}
        onEdit={(subj) => {
          setEditingSubject(subj);
          setIsModalOpen(true);
        }}
        onDelete={(subj) => setDeletingSubject(subj)}
        canEdit={hasPermission('subject.update')}
        canDelete={hasPermission('subject.delete')}
      />

      {/* DELETE CONFIRMATION DIALOG */}
      {deletingSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Hapus Mata Pelajaran</h3>
                <p className="text-xs text-slate-400">Konfirmasi tindakan penghapusan master data</p>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 space-y-1">
              <p className="font-medium text-white">
                Apakah Anda yakin ingin menghapus mata pelajaran ini?
              </p>
              <div className="pt-1.5 flex items-center gap-2">
                <span className="font-mono text-emerald-400 font-bold px-1.5 py-0.5 rounded-sm bg-slate-900 border border-slate-800">
                  {deletingSubject.code}
                </span>
                <span className="font-semibold text-slate-200">{deletingSubject.name}</span>
                <span className="text-slate-500">({deletingSubject.creditHours} JPL)</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Mata pelajaran yang telah memiliki relasi dengan kurikulum atau rombel belajar tidak dapat dihapus secara permanen. Jika tidak lagi diajarkan, ubah status ke <strong>Tidak Aktif</strong>.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingSubject(null)}
                disabled={deleteLoading}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors flex items-center gap-2"
              >
                {deleteLoading && <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                <span>Ya, Hapus</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
