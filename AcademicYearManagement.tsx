import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { AcademicYear } from '../../types';
import { AcademicYearModal } from './AcademicYearModal';
import {
  CalendarCheck,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Archive,
  Trash2,
  Edit2,
  Star,
  RefreshCw,
  HelpCircle,
  AlertTriangle,
  X,
} from 'lucide-react';

export const AcademicYearManagement: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingYear, setEditingYear] = useState<AcademicYear | null>(null);

  // Dialogs
  const [activatingYear, setActivatingYear] = useState<AcademicYear | null>(null);
  const [deletingYear, setDeletingYear] = useState<AcademicYear | null>(null);
  const [archivingYear, setArchivingYear] = useState<AcademicYear | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Notifications
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const canManage = hasPermission('academic_year.manage');

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4500);
  };

  const fetchAcademicYears = async () => {
    setLoading(true);
    try {
      const res = await api.getAcademicYears({
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        search: searchQuery || undefined,
      });
      if (res.success) {
        setAcademicYears(res.data);
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal memuat daftar tahun ajaran.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcademicYears();
  }, [statusFilter, user?.tenantId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAcademicYears();
  };

  const handleSaveModal = async (data: {
    name: string;
    startDate: string;
    endDate: string;
    isActive?: boolean;
    status?: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  }) => {
    if (editingYear) {
      const res = await api.updateAcademicYear(editingYear.id, {
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
      });
      if (res.success) {
        showToast(`Tahun ajaran '${data.name}' berhasil diperbarui.`);
        fetchAcademicYears();
      }
    } else {
      const res = await api.createAcademicYear(data);
      if (res.success) {
        showToast(`Tahun ajaran '${data.name}' berhasil ditambahkan.`);
        fetchAcademicYears();
      }
    }
  };

  const handleConfirmActivate = async () => {
    if (!activatingYear) return;
    setActionLoading(true);
    try {
      const res = await api.setActiveAcademicYear(activatingYear.id);
      if (res.success) {
        showToast(res.message);
        setActivatingYear(null);
        fetchAcademicYears();
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal mengaktifkan tahun ajaran.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmArchive = async () => {
    if (!archivingYear) return;
    setActionLoading(true);
    try {
      const res = await api.archiveAcademicYear(archivingYear.id);
      if (res.success) {
        showToast(res.message);
        setArchivingYear(null);
        fetchAcademicYears();
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal mengarsipkan tahun ajaran.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingYear) return;
    setActionLoading(true);
    try {
      const res = await api.deleteAcademicYear(deletingYear.id);
      if (res.success) {
        showToast(res.message);
        setDeletingYear(null);
        fetchAcademicYears();
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus tahun ajaran.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const activeYearItem = academicYears.find((y) => y.isActive);

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl animate-fade-in border ${
            toastMessage.type === 'success'
              ? 'bg-emerald-700 text-white border-emerald-500'
              : 'bg-rose-700 text-white border-rose-500'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-200 shrink-0" />
          )}
          <span className="text-sm font-medium">{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <span>E-PESANTREN 360</span>
            <span>/</span>
            <span>Master Data</span>
            <span>/</span>
            <span className="text-emerald-700 font-semibold">Tahun Ajaran</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <CalendarCheck className="w-7 h-7 text-emerald-600" />
            <span>Manajemen Tahun Ajaran</span>
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Kelola periode kalender akademik pesantren. Tepat satu tahun ajaran berstatus aktif untuk operasional harian.
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => {
              setEditingYear(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Tahun Ajaran</span>
          </button>
        )}
      </div>

      {/* Active Academic Year Summary Card */}
      {activeYearItem ? (
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-xl p-5 sm:p-6 shadow-sm border border-emerald-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
              <Star className="w-6 h-6 text-amber-300 fill-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-400 text-emerald-950 font-mono">
                  AKTIF BERJALAN
                </span>
                <span className="text-xs text-emerald-200">Periode Saat Ini</span>
              </div>
              <h2 className="text-xl font-extrabold text-white mt-1">
                Tahun Ajaran {activeYearItem.name}
              </h2>
              <p className="text-xs text-emerald-100/90 mt-0.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-300" />
                <span>
                  {formatDate(activeYearItem.startDate)} s/d {formatDate(activeYearItem.endDate)}
                </span>
              </p>
            </div>
          </div>

          <div className="text-xs text-emerald-200 bg-white/5 p-3 rounded-lg border border-white/10 max-w-xs">
            <span className="font-semibold text-white block mb-0.5">Sistem Operasional:</span>
            Seluruh data santri, kelas, dan proses akademik secara default terikat pada tahun ajaran aktif ini.
          </div>
        </div>
      ) : (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl flex items-center gap-3 text-amber-900 text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <div className="flex-1">
            <span className="font-bold">Perhatian:</span> Belum ada Tahun Ajaran yang diaktifkan. Silakan aktifkan salah satu tahun ajaran di bawah ini agar sistem dapat beroperasi optimal.
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'ALL', label: 'Semua Status' },
            { id: 'ACTIVE', label: 'Aktif' },
            { id: 'INACTIVE', label: 'Tidak Aktif' },
            { id: 'ARCHIVED', label: 'Diarsipkan' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === tab.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari tahun ajaran..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </form>
      </div>

      {/* Academic Years Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Nama Tahun Ajaran</th>
                <th className="px-5 py-3.5">Rentang Kalender</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Peran Aktif</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                    <span>Memuat data tahun ajaran...</span>
                  </td>
                </tr>
              ) : academicYears.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-500">
                    <CalendarCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700">Tidak ada data tahun ajaran.</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Klik tombol "Tambah Tahun Ajaran" untuk memulai pendaftaran periode akademik.
                    </p>
                  </td>
                </tr>
              ) : (
                academicYears.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Name */}
                    <td className="px-5 py-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{item.name}</span>
                        {item.isActive && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                            <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                            Aktif
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Dates */}
                    <td className="px-5 py-4 text-slate-700">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {formatDate(item.startDate)} - {formatDate(item.endDate)}
                        </span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-5 py-4">
                      {item.status === 'ACTIVE' && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          ACTIVE
                        </span>
                      )}
                      {item.status === 'INACTIVE' && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                          INACTIVE
                        </span>
                      )}
                      {item.status === 'ARCHIVED' && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                          ARCHIVED
                        </span>
                      )}
                    </td>

                    {/* Active State Indicator */}
                    <td className="px-5 py-4">
                      {item.isActive ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1 text-xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Tahun Berjalan
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">Bukan Aktif</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {canManage && !item.isActive && item.status !== 'ARCHIVED' && (
                          <button
                            onClick={() => setActivatingYear(item)}
                            title="Aktifkan Tahun Ajaran Ini"
                            className="px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Star className="w-3 h-3" />
                            <span>Set Aktif</span>
                          </button>
                        )}

                        {canManage && (
                          <button
                            onClick={() => {
                              setEditingYear(item);
                              setIsModalOpen(true);
                            }}
                            title="Ubah Rincian"
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}

                        {canManage && !item.isActive && item.status !== 'ARCHIVED' && (
                          <button
                            onClick={() => setArchivingYear(item)}
                            title="Arsipkan Tahun Ajaran"
                            className="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors"
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                        )}

                        {canManage && !item.isActive && (
                          <button
                            onClick={() => setDeletingYear(item)}
                            title="Hapus Tahun Ajaran"
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
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

      {/* MODAL: Tambah / Ubah */}
      <AcademicYearModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingYear(null);
        }}
        onSubmit={handleSaveModal}
        initialData={editingYear}
      />

      {/* CONFIRMATION DIALOG: Set Active */}
      {activatingYear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 mx-auto">
              <Star className="w-6 h-6 fill-emerald-600 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center">
              Aktifkan Tahun Ajaran?
            </h3>
            <p className="text-xs text-slate-600 text-center mt-2 leading-relaxed">
              Anda akan mengaktifkan <span className="font-bold text-slate-900">Tahun Ajaran {activatingYear.name}</span>.
              <br />
              Tahun ajaran yang aktif saat ini ({activeYearItem?.name || 'tidak ada'}) akan secara otomatis dialihkan menjadi tidak aktif.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setActivatingYear(null)}
                disabled={actionLoading}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmActivate}
                disabled={actionLoading}
                className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors flex items-center gap-2"
              >
                {actionLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>Ya, Aktifkan Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION DIALOG: Archive */}
      {archivingYear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 mx-auto">
              <Archive className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center">
              Arsipkan Tahun Ajaran?
            </h3>
            <p className="text-xs text-slate-600 text-center mt-2 leading-relaxed">
              Tahun ajaran <span className="font-bold text-slate-900">{archivingYear.name}</span> akan dialihkan ke status arsip histori. Data tetap tersimpan untuk keperluan rekam jejak.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setArchivingYear(null)}
                disabled={actionLoading}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmArchive}
                disabled={actionLoading}
                className="px-5 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs transition-colors flex items-center gap-2"
              >
                {actionLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>Arsipkan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION DIALOG: Delete */}
      {deletingYear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-4 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center">
              Hapus Tahun Ajaran?
            </h3>
            <p className="text-xs text-slate-600 text-center mt-2 leading-relaxed">
              Apakah Anda yakin ingin menghapus <span className="font-bold text-slate-900">Tahun Ajaran {deletingYear.name}</span>?
              Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingYear(null)}
                disabled={actionLoading}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={actionLoading}
                className="px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition-colors flex items-center gap-2"
              >
                {actionLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>Ya, Hapus</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
