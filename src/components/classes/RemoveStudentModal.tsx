import React, { useState } from 'react';
import { ClassGroup, Student } from '../../types';
import { X, UserMinus, AlertTriangle } from 'lucide-react';

interface RemoveStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRemove: (reason: string) => Promise<boolean>;
  classGroup: ClassGroup;
  student: Student;
}

export const RemoveStudentModal: React.FC<RemoveStudentModalProps> = ({
  isOpen,
  onClose,
  onRemove,
  classGroup,
  student,
}) => {
  const [reason, setReason] = useState('Dikeluarkan dari rombongan belajar');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const success = await onRemove(reason.trim());
      if (success) {
        onClose();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gagal mengeluarkan santri.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-slate-800/60 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg">
              <UserMinus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Keluarkan Santri dari Rombel</h2>
              <p className="text-xs text-slate-400">Konfirmasi pengeluaran penempatan santri</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-200 space-y-1">
              <p className="font-semibold text-rose-100">Perhatian:</p>
              <p>
                Anda akan mengeluarkan santri <strong className="text-white">{student.fullName}</strong> ({student.nis}) dari kelas{' '}
                <strong className="text-white">{classGroup.name}</strong>.
              </p>
              <p className="text-rose-300/80">
                Riwayat penempatan santri akan ditutup (status: DROPOUT) dan kelas santri saat ini akan dikosongkan.
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Alasan Pengeluaran
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Contoh: Pengunduran diri, restrukturisasi kelas, dll"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-hidden focus:border-rose-500 transition-colors"
              required
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
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
              className="px-5 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-500 rounded-lg flex items-center gap-2 shadow-sm transition-colors disabled:opacity-50"
            >
              <UserMinus className="w-4 h-4" />
              <span>{loading ? 'Memproses...' : 'Keluarkan Santri'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
