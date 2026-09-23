import React, { useState, useEffect } from 'react';
import { ClassSubject, ClassSubjectStatus, ClassGroup, Subject, Teacher } from '../../types';
import { BookOpen, X, AlertCircle, School, GraduationCap, Clock } from 'lucide-react';

interface ClassSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    classId: string;
    subjectId: string;
    teacherId: string;
    creditHours: number;
    status: ClassSubjectStatus;
  }) => Promise<void>;
  classSubject?: ClassSubject | null;
  classes: ClassGroup[];
  subjects: Subject[];
  teachers: Teacher[];
}

export const ClassSubjectModal: React.FC<ClassSubjectModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  classSubject,
  classes,
  subjects,
  teachers,
}) => {
  const isEditing = Boolean(classSubject);

  const [classId, setClassId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [creditHours, setCreditHours] = useState<number>(2);
  const [status, setStatus] = useState<ClassSubjectStatus>('ACTIVE');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Active items only for selection when creating
  const activeClasses = classes.filter((c) => c.status === 'ACTIVE');
  const activeSubjects = subjects.filter((s) => s.status === 'ACTIVE');
  const activeTeachers = teachers.filter((t) => t.teachingStatus === 'ACTIVE');

  useEffect(() => {
    if (classSubject) {
      setClassId(classSubject.classId);
      setSubjectId(classSubject.subjectId);
      setTeacherId(classSubject.teacherId);
      setCreditHours(classSubject.creditHours || 2);
      setStatus(classSubject.status || 'ACTIVE');
    } else {
      setClassId(activeClasses[0]?.id || '');
      const firstSubject = activeSubjects[0];
      setSubjectId(firstSubject?.id || '');
      setTeacherId(activeTeachers[0]?.id || '');
      setCreditHours(firstSubject?.creditHours || 2);
      setStatus('ACTIVE');
    }
    setError(null);
  }, [classSubject, isOpen]);

  // When subject changes in create mode, auto-suggest its creditHours
  const handleSubjectChange = (newSubjectId: string) => {
    setSubjectId(newSubjectId);
    if (!isEditing) {
      const selected = subjects.find((s) => s.id === newSubjectId);
      if (selected && selected.creditHours > 0) {
        setCreditHours(selected.creditHours);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!classId) {
      setError('Silakan pilih kelas / rombongan belajar.');
      return;
    }
    if (!subjectId) {
      setError('Silakan pilih mata pelajaran.');
      return;
    }
    if (!teacherId) {
      setError('Silakan pilih guru / pengajar.');
      return;
    }
    if (!creditHours || creditHours <= 0) {
      setError('Beban jam pelajaran (JPL) harus bernilai angka lebih dari 0.');
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        classId,
        subjectId,
        teacherId,
        creditHours: Math.round(Number(creditHours)),
        status,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan alokasi kurikulum rombel.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const selectedClass = classes.find((c) => c.id === classId);
  const selectedSubject = subjects.find((s) => s.id === subjectId);
  const selectedTeacher = teachers.find((t) => t.id === teacherId);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                {isEditing ? 'Ubah Alokasi Kurikulum Rombel' : 'Tambah Mata Pelajaran ke Rombel'}
              </h3>
              <p className="text-xs text-slate-400">
                {isEditing
                  ? 'Perbarui pengajar, alokasi JPL, atau status mata pelajaran pada kelas ini'
                  : 'Tetapkan mata pelajaran, guru pengajar, dan beban JPL per rombongan belajar'}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-start gap-2.5 text-xs text-rose-400">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Rombel Selection */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <School className="w-3.5 h-3.5 text-slate-400" />
              <span>Kelas / Rombongan Belajar <span className="text-rose-400">*</span></span>
            </label>
            {isEditing ? (
              <div className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/60 rounded-lg text-sm text-slate-200">
                <span className="font-semibold text-emerald-400">{selectedClass?.code}</span> — {selectedClass?.name}
              </div>
            ) : (
              <select
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
              >
                <option value="">-- Pilih Rombel --</option>
                {activeClasses.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    [{cls.code}] {cls.name} (Tingkat {cls.level} - {cls.gender})
                  </option>
                ))}
              </select>
            )}
            <p className="text-[11px] text-slate-400 mt-1">
              Rombel aktif yang akan menerima alokasi kurikulum mata pelajaran ini.
            </p>
          </div>

          {/* Subject Selection */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              <span>Mata Pelajaran <span className="text-rose-400">*</span></span>
            </label>
            {isEditing ? (
              <div className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/60 rounded-lg text-sm text-slate-200">
                <span className="font-semibold text-sky-400">[{selectedSubject?.code}]</span> {selectedSubject?.name} ({selectedSubject?.type})
              </div>
            ) : (
              <select
                value={subjectId}
                onChange={(e) => handleSubjectChange(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
              >
                <option value="">-- Pilih Mata Pelajaran --</option>
                {activeSubjects.map((sbj) => (
                  <option key={sbj.id} value={sbj.id}>
                    [{sbj.code}] {sbj.name} ({sbj.type} - Standar {sbj.creditHours} JPL)
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Teacher Selection */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
              <span>Guru / Pengajar yang Ditugaskan <span className="text-rose-400">*</span></span>
            </label>
            <select
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              required
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
            >
              <option value="">-- Pilih Guru / Pengajar --</option>
              {activeTeachers.map((tch) => {
                const name = tch.employee?.fullName || 'Ustadz/ah Pengajar';
                const code = tch.teacherCode || '';
                const spec = tch.specialization ? `(${tch.specialization})` : '';
                return (
                  <option key={tch.id} value={tch.id}>
                    {name} [{code}] {spec}
                  </option>
                );
              })}
            </select>
            {selectedTeacher && (
              <div className="mt-1 text-[11px] text-slate-400">
                Spesialisasi: <span className="text-slate-300">{selectedTeacher.specialization || '-'}</span> | Status: <span className="text-emerald-400 font-medium">Aktif Mengajar</span>
              </div>
            )}
          </div>

          {/* JPL & Status Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Beban JPL / Pekan <span className="text-rose-400">*</span></span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="40"
                  step="1"
                  value={creditHours}
                  onChange={(e) => setCreditHours(Math.max(1, parseInt(e.target.value) || 1))}
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-hidden focus:border-emerald-500 transition-colors pr-14"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium pointer-events-none">
                  JPL
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Jumlah jam tatap muka terjadwal per minggu.</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Status Kurikulum <span className="text-rose-400">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ClassSubjectStatus)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
              >
                <option value="ACTIVE">Aktif (Diajarkan)</option>
                <option value="INACTIVE">Tidak Aktif (Ditangguhkan)</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1">Status kesiapan untuk penyusunan Jadwal Pelajaran.</p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {loading ? (
                <span>Menyimpan...</span>
              ) : (
                <span>{isEditing ? 'Simpan Perubahan' : 'Tetapkan Kurikulum'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
