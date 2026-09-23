import React, { useState } from 'react';
import { Student, Room } from '../../types';
import { X, BedDouble, AlertCircle, Save, LogOut, Info } from 'lucide-react';

interface StudentRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  rooms: Room[];
  allStudents: Student[];
  onAssignRoom: (studentId: string, roomId: string, notes?: string) => Promise<void>;
  onRemoveRoom: (studentId: string) => Promise<void>;
}

export const StudentRoomModal: React.FC<StudentRoomModalProps> = ({
  isOpen,
  onClose,
  student,
  rooms,
  allStudents,
  onAssignRoom,
  onRemoveRoom,
}) => {
  const [selectedRoomId, setSelectedRoomId] = useState<string>(student.currentRoomId || '');
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const expectedGender = student.gender === 'LAKI_LAKI' ? 'PUTRA' : 'PUTRI';
  // Filter rooms matching gender
  const genderMatchedRooms = rooms.filter((r) => r.genderType === expectedGender);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedRoomId) {
      setError('Silakan pilih kamar yang dituju.');
      return;
    }

    if (selectedRoomId === student.currentRoomId) {
      setError('Santri saat ini sudah menempati kamar yang dipilih.');
      return;
    }

    // Client-side capacity pre-check
    const targetRoom = rooms.find((r) => r.id === selectedRoomId);
    if (targetRoom) {
      const occupied = allStudents.filter(
        (s) => s.currentRoomId === targetRoom.id && s.status === 'ACTIVE' && s.id !== student.id
      ).length;
      if (occupied >= targetRoom.capacity) {
        setError(`Kamar ${targetRoom.name} telah penuh (${occupied}/${targetRoom.capacity} santri).`);
        return;
      }
    }

    setLoading(true);
    try {
      await onAssignRoom(student.id, selectedRoomId, notes.trim() || undefined);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Gagal mengatur penempatan kamar.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!window.confirm(`Yakin ingin mengosongkan penempatan kamar santri ${student.fullName}?`)) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onRemoveRoom(student.id);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Gagal mengosongkan kamar santri.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
              <BedDouble className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Kelola Penempatan Kamar</h3>
              <p className="text-xs text-slate-300">
                {student.fullName} ({student.gender === 'LAKI_LAKI' ? 'Putra' : 'Putri'} | NIS: {student.nis})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Current Room Info */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Status Kamar Saat Ini
            </p>
            {student.currentRoom ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">{student.currentRoom.name}</p>
                  <p className="text-xs text-slate-500">
                    {student.currentRoom.dormitoryName || 'Asrama'} • {student.currentRoom.buildingName || 'Gedung'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={loading}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Kosongkan Kamar</span>
                </button>
              </div>
            ) : (
              <p className="text-xs text-amber-700 font-medium bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200">
                Santri saat ini belum ditempatkan di kamar asrama manapun.
              </p>
            )}
          </div>

          {/* Gender Rule Notice */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800">
            <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Sesuai aturan syariah pesantren, santri berjenis kelamin{' '}
              <strong>{student.gender === 'LAKI_LAKI' ? 'Putra' : 'Putri'}</strong> hanya dapat ditempatkan di kamar{' '}
              <strong>{expectedGender === 'PUTRA' ? 'Asrama Putra' : 'Asrama Putri'}</strong>.
            </span>
          </div>

          {/* Room Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Pilih Kamar Tujuan <span className="text-rose-500">*</span>
            </label>
            <select
              required
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="">-- Pilih Kamar Asrama --</option>
              {genderMatchedRooms.map((r) => {
                const occupiedCount = allStudents.filter(
                  (s) => s.currentRoomId === r.id && s.status === 'ACTIVE' && s.id !== student.id
                ).length;
                const isFull = occupiedCount >= r.capacity;
                const isCurrent = r.id === student.currentRoomId;

                return (
                  <option
                    key={r.id}
                    value={r.id}
                    disabled={isFull && !isCurrent}
                    className={isFull && !isCurrent ? 'text-slate-400' : ''}
                  >
                    {r.name} (Terisi: {occupiedCount}/{r.capacity}) {isCurrent ? '★ Kamar Sekarang' : isFull ? '[Penuh]' : ''}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Catatan Penempatan / Alasan Pindah (Opsional)
            </label>
            <input
              type="text"
              placeholder="Contoh: Penempatan santri baru / pindah atas anjuran musyrif"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Tutup
            </button>
            <button
              type="submit"
              disabled={loading || !selectedRoomId || selectedRoomId === student.currentRoomId}
              className="px-5 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 rounded-lg flex items-center gap-2 shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Menyimpan...' : student.currentRoomId ? 'Pindahkan Kamar' : 'Tempatkan di Kamar'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
