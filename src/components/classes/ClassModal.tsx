import React, { useState, useEffect } from 'react';
import {
  ClassGroup,
  AcademicYear,
  Program,
  Teacher,
  ClassGenderType,
  ClassStatus,
} from '../../types';
import { X, Save, AlertCircle, School, UserCheck } from 'lucide-react';

interface ClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<ClassGroup>) => Promise<boolean>;
  initialData?: ClassGroup | null;
  academicYears: AcademicYear[];
  programs: Program[];
  teachers: Teacher[];
}

export const ClassModal: React.FC<ClassModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  academicYears,
  programs,
  teachers,
}) => {
  const [formData, setFormData] = useState<{
    name: string;
    code: string;
    academicYearId: string;
    programId: string;
    level: number;
    gender: ClassGenderType;
    capacity: number;
    roomLocation: string;
    homeroomTeacherId: string;
    status: ClassStatus;
    notes: string;
  }>({
    name: '',
    code: '',
    academicYearId: '',
    programId: '',
    level: 7,
    gender: 'PUTRA',
    capacity: 30,
    roomLocation: '',
    homeroomTeacherId: '',
    status: 'ACTIVE',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        code: initialData.code || '',
        academicYearId: initialData.academicYearId || '',
        programId: initialData.programId || '',
        level: initialData.level ?? 7,
        gender: initialData.gender || 'PUTRA',
        capacity: initialData.capacity || 30,
        roomLocation: initialData.roomLocation || '',
        homeroomTeacherId: initialData.homeroomTeacherId || '',
        status: initialData.status || 'ACTIVE',
        notes: initialData.notes || '',
      });
    } else {
      const activeAy = academicYears.find((a) => a.status === 'ACTIVE') || academicYears[0];
      const defaultProg = programs[0];
      setFormData({
        name: '',
        code: '',
        academicYearId: activeAy ? activeAy.id : '',
        programId: defaultProg ? defaultProg.id : '',
        level: 7,
        gender: 'PUTRA',
        capacity: 30,
        roomLocation: '',
        homeroomTeacherId: '',
        status: 'ACTIVE',
        notes: '',
      });
    }
    setError(null);
  }, [initialData, isOpen, academicYears, programs]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('Nama rombel wajib diisi.');
      return;
    }
    if (!formData.code.trim()) {
      setError('Kode rombel wajib diisi.');
      return;
    }
    if (!formData.academicYearId) {
      setError('Tahun akademik wajib dipilih.');
      return;
    }
    if (!formData.programId) {
      setError('Program pendidikan wajib dipilih.');
      return;
    }
    if (formData.capacity <= 0) {
      setError('Kapasitas rombel harus lebih besar dari 0.');
      return;
    }

    setLoading(true);
    try {
      const payload: Partial<ClassGroup> = {
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        academicYearId: formData.academicYearId,
        programId: formData.programId,
        level: Number(formData.level),
        gender: formData.gender,
        capacity: Number(formData.capacity),
        roomLocation: formData.roomLocation.trim() || null,
        homeroomTeacherId: formData.homeroomTeacherId || null,
        status: formData.status,
        notes: formData.notes.trim() || null,
      };

      const success = await onSubmit(payload);
      if (success) {
        onClose();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat menyimpan data rombel.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-800/60 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
              <School className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                {initialData ? 'Edit Data Rombongan Belajar' : 'Tambah Rombongan Belajar (Kelas)'}
              </h2>
              <p className="text-xs text-slate-400">
                Lengkapi identitas kelas, tahun akademik, kapasitas, dan wali kelas.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center gap-3 text-rose-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nama Kelas */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Nama Kelas / Rombel <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: 7A Tahfidz Putra"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
                required
              />
            </div>

            {/* Kode Kelas */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Kode Rombel (Unik) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="Contoh: 7A-THF-PA"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white uppercase focus:outline-hidden focus:border-emerald-500 transition-colors"
                required
              />
            </div>

            {/* Tahun Akademik */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Tahun Akademik <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.academicYearId}
                onChange={(e) => setFormData({ ...formData, academicYearId: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
                required
              >
                <option value="">-- Pilih Tahun Akademik --</option>
                {academicYears.map((ay) => (
                  <option key={ay.id} value={ay.id}>
                    {ay.name} {ay.status === 'ACTIVE' ? '(• Aktif)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Program Pendidikan */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Program Pendidikan <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.programId}
                onChange={(e) => setFormData({ ...formData, programId: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
                required
              >
                <option value="">-- Pilih Program --</option>
                {programs.map((prog) => (
                  <option key={prog.id} value={prog.id}>
                    {prog.name} ({prog.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Jenjang / Tingkat */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Tingkat / Jenjang <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value, 10) || 1 })}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
                required
              />
            </div>

            {/* Gender Rombel */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Gender Rombel <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as ClassGenderType })}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
                required
              >
                <option value="PUTRA">PUTRA (Khusus Santri Laki-laki)</option>
                <option value="PUTRI">PUTRI (Khusus Santriwati Perempuan)</option>
                <option value="CAMPURAN">CAMPURAN (Putra & Putri)</option>
              </select>
            </div>

            {/* Kapasitas */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Kapasitas Maksimal Santri <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value, 10) || 1 })}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
                required
              />
            </div>

            {/* Lokasi Ruang */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Lokasi Ruang / Gedung
              </label>
              <input
                type="text"
                value={formData.roomLocation}
                onChange={(e) => setFormData({ ...formData, roomLocation: e.target.value })}
                placeholder="Contoh: Gedung Ibnu Sina Lt. 2 R.201"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* Wali Kelas */}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ustadz / Wali Kelas (Homeroom Teacher)</span>
              </label>
              <select
                value={formData.homeroomTeacherId}
                onChange={(e) => setFormData({ ...formData, homeroomTeacherId: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
              >
                <option value="">-- Belum Ditentukan / Kosongkan --</option>
                {teachers
                  .filter((t) => t.teachingStatus !== 'INACTIVE')
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.fullName || t.teacherCode} ({t.teacherCode}) - {t.specialization || 'Guru'}
                    </option>
                  ))}
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                Wali kelas akan memiliki hak akses mengelola dan memantau santri pada kelas binaannya.
              </p>
            </div>

            {/* Status Rombel */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Status Rombel
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ClassStatus })}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
              >
                <option value="ACTIVE">ACTIVE (Aktif Digunakan)</option>
                <option value="INACTIVE">INACTIVE (Tidak Aktif Sementara)</option>
                <option value="ARCHIVED">ARCHIVED (Diarsipkan / Selesai)</option>
              </select>
            </div>

            {/* Catatan */}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Catatan / Keterangan
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={2}
                placeholder="Catatan tambahan mengenai rombel ini..."
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-hidden focus:border-emerald-500 transition-colors resize-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg flex items-center gap-2 shadow-sm transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Menyimpan...' : initialData ? 'Perbarui Rombel' : 'Simpan Rombel'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
