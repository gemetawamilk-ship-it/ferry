import React, { useState, useMemo } from 'react';
import { ClassGroup, Student } from '../../types';
import { X, UserPlus, Search, AlertCircle, CheckCircle2, User, Sparkles } from 'lucide-react';

interface AssignStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (studentId: string, notes?: string) => Promise<boolean>;
  classGroup: ClassGroup;
  allStudents: Student[];
}

export const AssignStudentModal: React.FC<AssignStudentModalProps> = ({
  isOpen,
  onClose,
  onAssign,
  classGroup,
  allStudents,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [search, setSearch] = useState('');
  const [notes, setNotes] = useState('Penempatan santri ke rombel');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Eligible students for this class
  const eligibleStudents = useMemo(() => {
    return allStudents.filter((student) => {
      // 1. Must be active student
      if (student.status !== 'ACTIVE') return false;

      // 2. Gender compatibility
      if (classGroup.gender === 'PUTRA' && student.gender !== 'LAKI_LAKI') return false;
      if (classGroup.gender === 'PUTRI' && student.gender !== 'PEREMPUAN') return false;

      // 3. Must not already be active in THIS class
      if (student.currentClassId === classGroup.id) return false;

      // 4. Must not already have an active placement in the same academic year
      const hasActiveInSameYear = student.classHistories?.some(
        (h) => h.academicYearId === classGroup.academicYearId && h.status === 'ACTIVE' && !h.exitDate
      );
      if (hasActiveInSameYear) return false;

      // 5. Search filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = student.fullName.toLowerCase().includes(q);
        const matchNis = student.nis.toLowerCase().includes(q);
        return matchName || matchNis;
      }

      return true;
    });
  }, [allStudents, classGroup, search]);

  if (!isOpen) return null;

  const currentCount = classGroup.students?.length || classGroup.totalStudents || 0;
  const isFull = currentCount >= classGroup.capacity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) {
      setError('Silakan pilih santri terlebih dahulu.');
      return;
    }
    if (isFull) {
      setError('Rombel sudah penuh.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const success = await onAssign(selectedStudentId, notes.trim());
      if (success) {
        onClose();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gagal menempatkan santri ke kelas.');
    } finally {
      setLoading(false);
    }
  };

  const selectedStudent = allStudents.find((s) => s.id === selectedStudentId);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-800/60 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Tambah Santri ke Kelas</h2>
              <p className="text-xs text-slate-400">
                Rombel: <span className="text-emerald-400 font-medium">{classGroup.name}</span> ({classGroup.code})
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
          {/* Status info bar */}
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-slate-400">Gender Rombel:</span>
              <span
                className={`font-semibold px-2 py-0.5 rounded ${
                  classGroup.gender === 'PUTRA'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : classGroup.gender === 'PUTRI'
                    ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                {classGroup.gender}
              </span>
            </div>
            <div className="text-slate-300">
              Keterisian:{' '}
              <span className={`font-semibold ${isFull ? 'text-rose-400' : 'text-emerald-400'}`}>
                {currentCount} / {classGroup.capacity}
              </span>{' '}
              Santri
            </div>
          </div>

          {isFull && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center gap-2 text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Rombel ini sudah mencapai kapasitas maksimal. Anda tidak dapat menambah santri lagi.</span>
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center gap-2 text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Search box */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Cari Santri Belum Memiliki Kelas di Tahun Ini
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Ketik nama santri atau NIS..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                disabled={isFull}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          {/* Student selection list */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-slate-300">
                Pilih Santri ({eligibleStudents.length} santri memenuhi syarat)
              </span>
              {selectedStudent && (
                <span className="text-xs text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Terpilih: {selectedStudent.fullName}
                </span>
              )}
            </div>

            <div className="max-h-52 overflow-y-auto border border-slate-800 rounded-lg divide-y divide-slate-800/60 bg-slate-950">
              {eligibleStudents.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  Tidak ada santri yang dapat dimasukkan ke rombel ini.
                  <br />
                  (Semua santri yang sesuai gender sudah memiliki rombel aktif di tahun akademik ini).
                </div>
              ) : (
                eligibleStudents.map((s) => {
                  const isSelected = selectedStudentId === s.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => !isFull && setSelectedStudentId(s.id)}
                      className={`p-3 flex items-center justify-between cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-emerald-950/40 border-l-4 border-emerald-500'
                          : 'hover:bg-slate-900/80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                          {s.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white flex items-center gap-2">
                            <span>{s.fullName}</span>
                            <span
                              className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                                s.gender === 'LAKI_LAKI'
                                  ? 'bg-blue-500/10 text-blue-400'
                                  : 'bg-pink-500/10 text-pink-400'
                              }`}
                            >
                              {s.gender === 'LAKI_LAKI' ? 'L' : 'P'}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400">
                            NIS: {s.nis} • Program: {s.program?.name || s.programId}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="studentSelect"
                          checked={isSelected}
                          onChange={() => setSelectedStudentId(s.id)}
                          className="w-4 h-4 text-emerald-600 bg-slate-900 border-slate-700 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Catatan */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Catatan Penempatan (Opsional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Penempatan santri baru tahun ajaran 2025/2026"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
            />
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
              disabled={loading || !selectedStudentId || isFull}
              className="px-5 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg flex items-center gap-2 shadow-sm transition-colors disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4" />
              <span>{loading ? 'Memproses...' : 'Tempatkan Santri'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
