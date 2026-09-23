import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Program } from '../../types';
import { ProgramModal } from './ProgramModal';
import {
  BookOpen,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Trash2,
  Power,
  RefreshCw,
  Award,
} from 'lucide-react';

export const ProgramManagement: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);

  // Dialogs
  const [deletingProgram, setDeletingProgram] = useState<Program | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const canManage = hasPermission('program.manage');

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4500);
  };

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const res = await api.getPrograms({
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        search: searchQuery || undefined,
      });
      if (res.success) {
        setPrograms(res.data);
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal memuat daftar program pendidikan.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, [statusFilter, user?.tenantId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPrograms();
  };

  const handleSaveModal = async (data: {
    name: string;
    code: string;
    description?: string;
    status?: 'ACTIVE' | 'INACTIVE';
  }) => {
    if (editingProgram) {
      const res = await api.updateProgram(editingProgram.id, data);
      if (res.success) {
        showToast(`Program '${data.name}' berhasil diperbarui.`);
        fetchPrograms();
      }
    } else {
      const res = await api.createProgram(data);
      if (res.success) {
        showToast(`Program '${data.name}' berhasil ditambahkan.`);
        fetchPrograms();
      }
    }
  };

  const handleToggleStatus = async (prog: Program) => {
    setActionLoading(true);
    try {
      const res = await api.toggleProgramStatus(prog.id);
      if (res.success) {
        showToast(
          `Status program ${prog.name} kini ${res.data.status === 'ACTIVE' ? 'Aktif' : 'Nonaktif'}.`
        );
        fetchPrograms();
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal mengubah status program.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingProgram) return;
    setActionLoading(true);
    try {
      const res = await api.deleteProgram(deletingProgram.id);
      if (res.success) {
        showToast(res.message);
        setDeletingProgram(null);
        fetchPrograms();
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus program.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const activeProgramsCount = programs.filter((p) => p.status === 'ACTIVE').length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
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
            <span className="text-emerald-700 font-semibold">Program Pendidikan</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-emerald-600" />
            <span>Program Pendidikan Pesantren</span>
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Kelola jalur kurikulum dan spesialisasi santri (Tahfidz, Kitab Kuning, Reguler, Bahasa).
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => {
              setEditingProgram(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Program</span>
          </button>
        )}
      </div>

      {/* Metric Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Total Program</span>
            <span className="text-xl font-bold text-slate-900">{programs.length} Program</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-teal-50 text-teal-700 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Program Aktif</span>
            <span className="text-xl font-bold text-emerald-700">{activeProgramsCount} Aktif</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-slate-100 text-slate-600 rounded-xl">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Status Isolasi Data</span>
            <span className="text-xs font-bold text-slate-800">Tersinkron per Pesantren</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'ALL', label: 'Semua Status' },
            { id: 'ACTIVE', label: 'Aktif Diselenggarakan' },
            { id: 'INACTIVE', label: 'Nonaktif / Ditutup' },
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
            placeholder="Cari program atau kode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </form>
      </div>

      {/* Programs Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Kode</th>
                <th className="px-5 py-3.5">Nama Program Pendidikan</th>
                <th className="px-5 py-3.5">Deskripsi & Target</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                    <span>Memuat data program...</span>
                  </td>
                </tr>
              ) : programs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-500">
                    <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700">Tidak ada program pendidikan ditemukan.</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Klik "Tambah Program" untuk mendaftarkan spesialisasi pendidikan pesantren.
                    </p>
                  </td>
                </tr>
              ) : (
                programs.map((prog) => (
                  <tr key={prog.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Code */}
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-md text-xs font-mono font-extrabold bg-slate-100 text-slate-800 border border-slate-300 shadow-2xs">
                        {prog.code}
                      </span>
                    </td>

                    {/* Name */}
                    <td className="px-5 py-4 font-bold text-slate-900 text-sm">
                      {prog.name}
                    </td>

                    {/* Description */}
                    <td className="px-5 py-4 text-slate-600 max-w-sm">
                      <p className="truncate line-clamp-2 text-xs">
                        {prog.description || <span className="text-slate-400 italic">Tidak ada deskripsi</span>}
                      </p>
                    </td>

                    {/* Status Badge */}
                    <td className="px-5 py-4">
                      {prog.status === 'ACTIVE' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          Nonaktif
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {canManage && (
                          <button
                            onClick={() => handleToggleStatus(prog)}
                            disabled={actionLoading}
                            title={prog.status === 'ACTIVE' ? 'Nonaktifkan Program' : 'Aktifkan Program'}
                            className={`p-1.5 rounded-lg transition-colors ${
                              prog.status === 'ACTIVE'
                                ? 'text-amber-600 hover:text-amber-800 hover:bg-amber-50'
                                : 'text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50'
                            }`}
                          >
                            <Power className="w-4 h-4" />
                          </button>
                        )}

                        {canManage && (
                          <button
                            onClick={() => {
                              setEditingProgram(prog);
                              setIsModalOpen(true);
                            }}
                            title="Ubah Program"
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}

                        {canManage && (
                          <button
                            onClick={() => setDeletingProgram(prog)}
                            title="Hapus Program"
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

      {/* MODAL: Tambah / Ubah Program */}
      <ProgramModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProgram(null);
        }}
        onSubmit={handleSaveModal}
        initialData={editingProgram}
      />

      {/* CONFIRMATION DIALOG: Hapus */}
      {deletingProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-4 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center">
              Hapus Program Pendidikan?
            </h3>
            <p className="text-xs text-slate-600 text-center mt-2 leading-relaxed">
              Apakah Anda yakin ingin menghapus <span className="font-bold text-slate-900">{deletingProgram.name}</span> ({deletingProgram.code})?
              Data program ini akan dihapus dari sistem pesantren.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingProgram(null)}
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
                <span>Ya, Hapus Program</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
