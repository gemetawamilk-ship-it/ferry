import React, { useState, useEffect } from 'react';
import { AcademicYear } from '../../types';
import { X, Calendar, AlertCircle, RefreshCw } from 'lucide-react';

interface AcademicYearModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    startDate: string;
    endDate: string;
    isActive?: boolean;
    status?: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  }) => Promise<void>;
  initialData?: AcademicYear | null;
}

export const AcademicYearModal: React.FC<AcademicYearModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE' | 'ARCHIVED'>('INACTIVE');
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setStartDate(initialData.startDate);
      setEndDate(initialData.endDate);
      setStatus(initialData.status);
      setIsActive(initialData.isActive);
    } else {
      setName('');
      setStartDate('');
      setEndDate('');
      setStatus('INACTIVE');
      setIsActive(false);
    }
    setError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Nama tahun ajaran wajib diisi (contoh: 2026/2027).');
      return;
    }

    if (!startDate || !endDate) {
      setError('Tanggal mulai dan tanggal selesai wajib diisi.');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('Tanggal mulai tidak boleh melebihi tanggal selesai.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        startDate,
        endDate,
        isActive,
        status: isActive ? 'ACTIVE' : status,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat menyimpan data tahun ajaran.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {initialData ? 'Ubah Tahun Ajaran' : 'Tambah Tahun Ajaran Baru'}
              </h3>
              <p className="text-xs text-slate-500">
                {initialData
                  ? 'Perbarui rincian periode kalender akademik pesantren'
                  : 'Daftarkan periode tahun ajaran baru untuk operasional pesantren'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Tahun Ajaran <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: 2026/2027 atau 1447/1448 H"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Gunakan format standar tahun masehi atau hijriah. Nama tidak boleh duplikat.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tanggal Mulai <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tanggal Selesai <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          {!initialData ? (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => {
                    setIsActive(e.target.checked);
                    if (e.target.checked) setStatus('ACTIVE');
                  }}
                  className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <span className="text-xs font-bold text-emerald-900 block">
                    Jadikan Tahun Ajaran Ini Langsung AKTIF
                  </span>
                  <span className="text-[11px] text-emerald-700 block mt-0.5 leading-snug">
                    Perhatian: Pesantren hanya memiliki 1 tahun ajaran aktif. Mengaktifkan ini akan secara otomatis menonaktifkan tahun ajaran berjalan sebelumnya.
                  </span>
                </div>
              </label>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
              <select
                value={status}
                disabled={initialData.isActive}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:bg-slate-100 disabled:text-slate-500"
              >
                <option value="ACTIVE">ACTIVE (Aktif Berjalan)</option>
                <option value="INACTIVE">INACTIVE (Tidak Aktif)</option>
                <option value="ARCHIVED">ARCHIVED (Diarsipkan)</option>
              </select>
              {initialData.isActive && (
                <p className="text-[11px] text-amber-600 mt-1">
                  * Tahun ajaran yang sedang aktif tidak dapat diubah statusnya secara manual dari dropdown ini. Aktifkan tahun ajaran lain untuk menggantikannya.
                </p>
              )}
            </div>
          )}

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors flex items-center gap-2"
            >
              {submitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              <span>{initialData ? 'Simpan Perubahan' : 'Tambah Tahun Ajaran'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
