import React, { useState, useEffect } from 'react';
import {
  Schedule,
  ScheduleStatus,
  DayOfWeek,
  ClassSubject,
  ClassGroup,
  Room,
} from '../../types';
import { api } from '../../services/api';
import {
  Calendar,
  Clock,
  X,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  School,
  GraduationCap,
  DoorOpen,
  BookOpen,
} from 'lucide-react';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    classSubjectId: string;
    classId: string;
    roomId: string;
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
    status: ScheduleStatus;
  }) => Promise<void>;
  schedule?: Schedule | null;
  classSubjects: ClassSubject[];
  classes: ClassGroup[];
  rooms: Room[];
}

const DAYS: { value: DayOfWeek; label: string }[] = [
  { value: 'SENIN', label: 'Senin' },
  { value: 'SELASA', label: 'Selasa' },
  { value: 'RABU', label: 'Rabu' },
  { value: 'KAMIS', label: 'Kamis' },
  { value: 'JUMAT', label: 'Jumat' },
  { value: 'SABTU', label: 'Sabtu' },
  { value: 'AHAD', label: 'Ahad' },
];

const TIME_PRESETS = [
  { start: '07:30', end: '09:00', label: '07:30 - 09:00 (Sesi 1 Pagi)' },
  { start: '09:15', end: '10:45', label: '09:15 - 10:45 (Sesi 2 Pagi)' },
  { start: '10:45', end: '12:00', label: '10:45 - 12:00 (Sesi 3 Siang)' },
  { start: '13:30', end: '15:00', label: '13:30 - 15:00 (Sesi 4 Siang)' },
  { start: '16:00', end: '17:30', label: '16:00 - 17:30 (Sesi Sore / Halaqah)' },
  { start: '19:30', end: '21:00', label: '19:30 - 21:00 (Sesi Malam / Ba\'da Isya)' },
];

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  schedule,
  classSubjects,
  classes,
  rooms,
}) => {
  const isEditing = Boolean(schedule);

  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedClassSubjectId, setSelectedClassSubjectId] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>('SENIN');
  const [startTime, setStartTime] = useState('07:30');
  const [endTime, setEndTime] = useState('09:00');
  const [status, setStatus] = useState<ScheduleStatus>('ACTIVE');

  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Real-time conflict state
  const [conflictChecking, setConflictChecking] = useState(false);
  const [conflictResult, setConflictResult] = useState<{
    hasConflict: boolean;
    type?: 'CLASS' | 'TEACHER' | 'ROOM';
    message?: string;
  } | null>(null);

  // Filter active rooms
  const activeRooms = rooms.filter((r) => r.status === 'ACTIVE');
  const activeClasses = classes.filter((c) => c.status === 'ACTIVE');

  // Filter classSubjects for the selected class that are ACTIVE
  const availableClassSubjects = classSubjects.filter(
    (cs) => cs.status === 'ACTIVE' && (!selectedClassId || cs.classId === selectedClassId)
  );

  // Selected ClassSubject detail
  const currentClassSubject = classSubjects.find((cs) => cs.id === selectedClassSubjectId);

  useEffect(() => {
    if (schedule) {
      setSelectedClassId(schedule.classId);
      setSelectedClassSubjectId(schedule.classSubjectId);
      setSelectedRoomId(schedule.roomId);
      setDayOfWeek(schedule.dayOfWeek);
      setStartTime(schedule.startTime);
      setEndTime(schedule.endTime);
      setStatus(schedule.status);
    } else {
      const firstClassId = activeClasses[0]?.id || '';
      setSelectedClassId(firstClassId);

      const subjectsForFirstClass = classSubjects.filter(
        (cs) => cs.classId === firstClassId && cs.status === 'ACTIVE'
      );
      setSelectedClassSubjectId(subjectsForFirstClass[0]?.id || '');
      setSelectedRoomId(activeRooms[0]?.id || '');
      setDayOfWeek('SENIN');
      setStartTime('07:30');
      setEndTime('09:00');
      setStatus('ACTIVE');
    }
    setSubmitError(null);
    setConflictResult(null);
  }, [schedule, isOpen]);

  // When class changes in create mode, pick the first valid classSubject
  const handleClassChange = (newClassId: string) => {
    setSelectedClassId(newClassId);
    const validCS = classSubjects.filter(
      (cs) => cs.classId === newClassId && cs.status === 'ACTIVE'
    );
    setSelectedClassSubjectId(validCS[0]?.id || '');
  };

  // Real-time conflict check debounced
  useEffect(() => {
    if (!isOpen || status === 'INACTIVE') {
      setConflictResult(null);
      return;
    }

    if (!selectedClassId || !selectedClassSubjectId || !selectedRoomId || !startTime || !endTime) {
      setConflictResult(null);
      return;
    }

    const cs = classSubjects.find((item) => item.id === selectedClassSubjectId);
    if (!cs) {
      setConflictResult(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setConflictChecking(true);
        const res = await api.checkScheduleConflict({
          classId: selectedClassId,
          teacherId: cs.teacherId,
          roomId: selectedRoomId,
          dayOfWeek,
          startTime,
          endTime,
          excludeScheduleId: schedule?.id,
        });

        if (res.success && res.data) {
          setConflictResult(res.data);
        }
      } catch (err: any) {
        // Silent catch for live check
      } finally {
        setConflictChecking(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [
    isOpen,
    selectedClassId,
    selectedClassSubjectId,
    selectedRoomId,
    dayOfWeek,
    startTime,
    endTime,
    status,
    schedule?.id,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!selectedClassSubjectId) {
      setSubmitError('Silakan pilih mata pelajaran rombel.');
      return;
    }
    if (!selectedRoomId) {
      setSubmitError('Silakan pilih ruangan kegiatan belajar.');
      return;
    }
    if (!startTime || !endTime) {
      setSubmitError('Waktu mulai dan selesai wajib diisi.');
      return;
    }
    if (startTime >= endTime) {
      setSubmitError(`Waktu mulai (${startTime}) harus lebih awal dari waktu selesai (${endTime}).`);
      return;
    }

    if (conflictResult?.hasConflict && status === 'ACTIVE') {
      setSubmitError(conflictResult.message || 'Terdapat bentrok jadwal. Silakan periksa jam/hari/ruangan.');
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        classSubjectId: selectedClassSubjectId,
        classId: selectedClassId,
        roomId: selectedRoomId,
        dayOfWeek,
        startTime,
        endTime,
        status,
      });
      onClose();
    } catch (err: any) {
      setSubmitError(err.message || 'Gagal menyimpan jadwal pelajaran.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl">
              <Calendar className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {isEditing ? 'Ubah Jadwal Pelajaran' : 'Tambah Jadwal Pelajaran Baru'}
              </h3>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                Pengaturan alokasi waktu dan ruangan kegiatan belajar mengajar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {submitError && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
              <div>
                <p className="font-semibold">Perhatian</p>
                <p className="text-xs mt-0.5 leading-relaxed">{submitError}</p>
              </div>
            </div>
          )}

          {/* Row 1: Kelas & Mata Pelajaran Rombel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <School className="w-3.5 h-3.5 text-emerald-600" />
                Kelas / Rombel Target <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedClassId}
                disabled={isEditing}
                onChange={(e) => handleClassChange(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-colors ${
                  isEditing ? 'bg-slate-100 text-slate-500 cursor-not-allowed border-slate-200' : 'bg-white border-slate-300'
                }`}
              >
                <option value="">-- Pilih Kelas --</option>
                {activeClasses.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} ({cls.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                Mata Pelajaran & Pengajar <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedClassSubjectId}
                onChange={(e) => setSelectedClassSubjectId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="">-- Pilih Mata Pelajaran Rombel --</option>
                {availableClassSubjects.map((cs) => {
                  const subjectName = cs.subject?.name || 'Mata Pelajaran';
                  const teacherName = cs.teacher?.employee?.fullName || cs.teacher?.teacherCode || 'Guru';
                  return (
                    <option key={cs.id} value={cs.id}>
                      {subjectName} • {teacherName} ({cs.creditHours} JPL)
                    </option>
                  );
                })}
              </select>
              {availableClassSubjects.length === 0 && selectedClassId && (
                <p className="text-[11px] text-amber-600 mt-1">
                  Belum ada kurikulum aktif untuk kelas ini. Atur di menu <strong>Kurikulum Rombel</strong> terlebih dahulu.
                </p>
              )}
            </div>
          </div>

          {/* Current ClassSubject info banner */}
          {currentClassSubject && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                <span>
                  Pengajar:{' '}
                  <strong className="text-slate-800">
                    {currentClassSubject.teacher?.employee?.fullName || currentClassSubject.teacher?.teacherCode || 'Guru Pengajar'}
                  </strong>
                </span>
              </div>
              <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-semibold text-[11px]">
                Beban: {currentClassSubject.creditHours} JPL / Minggu
              </span>
            </div>
          )}

          {/* Row 2: Ruangan & Hari */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <DoorOpen className="w-3.5 h-3.5 text-amber-600" />
                Ruangan Belajar <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="">-- Pilih Ruangan --</option>
                {activeRooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.code}) - Kapasitas {r.capacity}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                Hari Kegiatan <span className="text-red-500">*</span>
              </label>
              <select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(e.target.value as DayOfWeek)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white font-medium"
              >
                {DAYS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Jam Mulai & Jam Selesai + Presets */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                Waktu Pembelajaran (HH:mm) <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-500">Pilih cepat:</span>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {TIME_PRESETS.map((p, idx) => {
                const isActive = startTime === p.start && endTime === p.end;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setStartTime(p.start);
                      setEndTime(p.end);
                    }}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                      isActive
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {p.start} - {p.end}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] text-slate-500 mb-1 block">Jam Mulai</span>
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 mb-1 block">Jam Selesai</span>
                <input
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Real-time Collision Indicator */}
          {status === 'ACTIVE' && (
            <div>
              {conflictChecking ? (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2 text-xs text-slate-500">
                  <div className="w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                  <span>Memeriksa ketersediaan jadwal, guru, dan ruangan...</span>
                </div>
              ) : conflictResult?.hasConflict ? (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold block mb-0.5">Bentrok Terdeteksi!</strong>
                    <span>{conflictResult.message}</span>
                  </div>
                </div>
              ) : conflictResult && !conflictResult.hasConflict ? (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Tidak ada bentrok jadwal. Alokasi waktu, guru, dan ruangan aman.</span>
                </div>
              ) : null}
            </div>
          )}

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Status Jadwal
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="ACTIVE"
                  checked={status === 'ACTIVE'}
                  onChange={() => setStatus('ACTIVE')}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-xs font-medium text-slate-700">Aktif (ACTIVE)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="INACTIVE"
                  checked={status === 'INACTIVE'}
                  onChange={() => setStatus('INACTIVE')}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-xs font-medium text-slate-700">Non-Aktif (INACTIVE)</span>
              </label>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading || (status === 'ACTIVE' && conflictResult?.hasConflict)}
              className={`px-5 py-2 rounded-xl text-xs font-semibold text-white shadow-xs transition-colors flex items-center gap-2 ${
                loading || (status === 'ACTIVE' && conflictResult?.hasConflict)
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {loading && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              <span>{isEditing ? 'Simpan Perubahan' : 'Tambahkan Jadwal'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
