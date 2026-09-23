import React, { useState, useMemo } from 'react';
import { ClassGroup, Student } from '../../types';
import { X, ArrowRightLeft, AlertCircle, School, User } from 'lucide-react';

interface TransferStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransfer: (targetClassId: string, notes?: string) => Promise<boolean>;
  sourceClass: ClassGroup;
  student: Student;
  allClasses: ClassGroup[];
}

export const TransferStudentModal: React.FC<TransferStudentModalProps> = ({
  isOpen,
  onClose,
  onTransfer,
  sourceClass,
  student,
  allClasses,
}) => {
  const [targetClassId, setTargetClassId] = useState('');
  const [notes, setNotes] = useState(`Pindah dari rombel ${sourceClass.name}`);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Eligible target classes
  const eligibleTargetClasses = useMemo(() => {
    return allClasses.filter((c) => {
      // 1. Exclude current class
      if (c.id === sourceClass.id) return false;

      // 2. Must not be archived
      if (c.status === 'ARCHIVED') return false;

      // 3. Gender compatibility
      if (c.gender === 'PUTRA' && student.gender !== 'LAKI_LAKI') return false;
      if (c.gender === 'PUTRI' && student.gender !== 'PEREMPUAN') return false;

      // 4. Must have available capacity
      const currentActive = c.students?.length || c.totalStudents || 0;
      if (currentActive >= c.capacity) return false;

      return true;
    });
  }, [allClasses, sourceClass, student]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetClassId) {
      setError('Silakan pilih rombel tujuan transfer.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const success = await onTransfer(targetClassId, notes.trim());
      if (success) {
        onClose();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gagal memindahkan santri.');
    } finally {
      setLoading(false);
    }
  };

  const selectedTarget = allClasses.find((c) => c.id === targetClassId);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-800/60 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-lg">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Mutasi / Pindah Rombel</h2>
              <p className="text-xs text-slate-400">Pindahkan santri ke rombongan belajar lain.</p>
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
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center gap-2 text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Student & Source Class Info */}
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-semibold text-white">{student.fullName}</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">NIS: {student.nis}</span>
            </div>

            <div className="text-xs text-slate-400 flex items-center gap-2 pt-1 border-t border-slate-800/80">
              <span>Rombel Saat Ini:</span>
              <span className="text-emerald-400 font-medium">
                {sourceClass.name} ({sourceClass.code})
              </span>
            </div>
          </div>

          {/* Target Class Selection */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Pilih Rombel Tujuan <span className="text-rose-400">*</span>
            </label>
            {eligibleTargetClasses.length === 0 ? (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-300 text-xs">
                Tidak ada rombel alternatif lain yang tersedia atau memenuhi syarat gender/kapasitas.
              </div>
            ) : (
              <select
                value={targetClassId}
                onChange={(e) => setTargetClassId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
                required
              >
                <option value="">-- Pilih Rombel Tujuan --</option>
                {eligibleTargetClasses.map((c) => {
                  const active = c.students?.length || c.totalStudents || 0;
                  return (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code}) • Gender: {c.gender} • Terisi: {active}/{c.capacity}
                    </option>
                  );
                })}
              </select>
            )}
          </div>

          {selectedTarget && (
            <div className="p-3 bg-sky-500/10 border border-sky-500/20 rounded-lg text-xs space-y-1 text-sky-200">
              <div>
                <strong>Wali Kelas Tujuan:</strong>{' '}
                {selectedTarget.homeroomTeacher?.employee?.fullName || 'Belum Ditentukan'}
              </div>
              <div>
                <strong>Tahun Akademik:</strong> {selectedTarget.academicYear?.name || selectedTarget.academicYearId}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Alasan / Catatan Pemindahan
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Penyesuaian minat / pemerataan rombel"
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
              disabled={loading || !targetClassId}
              className="px-5 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-500 rounded-lg flex items-center gap-2 shadow-sm transition-colors disabled:opacity-50"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>{loading ? 'Memindahkan...' : 'Pindahkan Santri'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
