import React, { useState } from 'react';
import {
  ClassGroup,
  Student,
  AcademicYear,
  Program,
  Teacher,
} from '../../types';
import { useAuth } from '../../context/AuthContext';
import { AssignStudentModal } from './AssignStudentModal';
import { TransferStudentModal } from './TransferStudentModal';
import { RemoveStudentModal } from './RemoveStudentModal';
import {
  X,
  School,
  UserCheck,
  UserPlus,
  Users,
  ArrowRightLeft,
  UserMinus,
  Calendar,
  BookOpen,
  MapPin,
  FileText,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface ClassDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  classGroup: ClassGroup;
  allClasses: ClassGroup[];
  allStudents: Student[];
  teachers: Teacher[];
  onRefreshClass: () => Promise<void>;
  onAssignStudent: (classId: string, studentId: string, notes?: string) => Promise<boolean>;
  onTransferStudent: (sourceClassId: string, studentId: string, targetClassId: string, notes?: string) => Promise<boolean>;
  onRemoveStudent: (classId: string, studentId: string, reason?: string) => Promise<boolean>;
  onUpdateHomeroom: (classId: string, homeroomTeacherId: string | null) => Promise<boolean>;
}

export const ClassDetailModal: React.FC<ClassDetailModalProps> = ({
  isOpen,
  onClose,
  classGroup,
  allClasses,
  allStudents,
  teachers,
  onRefreshClass,
  onAssignStudent,
  onTransferStudent,
  onRemoveStudent,
  onUpdateHomeroom,
}) => {
  const { hasPermission } = useAuth();

  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [selectedStudentForTransfer, setSelectedStudentForTransfer] = useState<Student | null>(null);
  const [selectedStudentForRemove, setSelectedStudentForRemove] = useState<Student | null>(null);

  // Homeroom edit state
  const [isEditingHomeroom, setIsEditingHomeroom] = useState(false);
  const [selectedHomeroomId, setSelectedHomeroomId] = useState(classGroup.homeroomTeacherId || '');
  const [homeroomLoading, setHomeroomLoading] = useState(false);

  // Notifications
  const [actionNotice, setActionNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  const enrolledStudents = classGroup.students || [];
  const currentCount = enrolledStudents.length;
  const isFull = currentCount >= classGroup.capacity;
  const occupancyPercent = classGroup.capacity > 0 ? Math.round((currentCount / classGroup.capacity) * 100) : 0;

  const handleSaveHomeroom = async () => {
    setHomeroomLoading(true);
    try {
      const success = await onUpdateHomeroom(classGroup.id, selectedHomeroomId || null);
      if (success) {
        setIsEditingHomeroom(false);
        setActionNotice({ type: 'success', message: 'Wali kelas berhasil diperbarui.' });
        setTimeout(() => setActionNotice(null), 3000);
      }
    } catch {
      setActionNotice({ type: 'error', message: 'Gagal memperbarui wali kelas.' });
    } finally {
      setHomeroomLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-4xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-800/60 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
              <School className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{classGroup.name}</h2>
                <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-800 text-emerald-400 border border-emerald-500/30">
                  {classGroup.code}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    classGroup.status === 'ACTIVE'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : classGroup.status === 'INACTIVE'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-slate-700/50 text-slate-400 border border-slate-600/30'
                  }`}
                >
                  {classGroup.status}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Jenjang Tingkat {classGroup.level} • {classGroup.program?.name || classGroup.programId}
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

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {actionNotice && (
            <div
              className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                actionNotice.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
                  : 'bg-rose-500/10 border border-rose-500/20 text-rose-300'
              }`}
            >
              {actionNotice.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              )}
              <span>{actionNotice.message}</span>
            </div>
          )}

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Tahun Akademik */}
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <Calendar className="w-3.5 h-3.5 text-sky-400" />
                <span>Tahun Akademik</span>
              </div>
              <div className="font-semibold text-white text-sm">
                {classGroup.academicYear?.name || classGroup.academicYearId}
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                {classGroup.academicYear?.status === 'ACTIVE' ? 'Aktif Berjalan' : classGroup.academicYear?.status || '-'}
              </div>
            </div>

            {/* Gender Rombel */}
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span>Gender Rombel</span>
              </div>
              <div>
                <span
                  className={`inline-block font-semibold px-2 py-0.5 rounded text-xs ${
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
              <div className="text-[11px] text-slate-500 mt-0.5">
                {classGroup.gender === 'PUTRA'
                  ? 'Khusus Santri Putra'
                  : classGroup.gender === 'PUTRI'
                  ? 'Khusus Santri Putri'
                  : 'Santri Putra & Putri'}
              </div>
            </div>

            {/* Kapasitas & Okupansi */}
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Kapasitas Rombel</span>
                <span className="font-semibold text-white">
                  {currentCount} / {classGroup.capacity}
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden my-1.5">
                <div
                  className={`h-full transition-all duration-300 ${
                    occupancyPercent >= 100
                      ? 'bg-rose-500'
                      : occupancyPercent >= 80
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, occupancyPercent)}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-500 flex items-center justify-between">
                <span>Okupansi: {occupancyPercent}%</span>
                <span>{classGroup.capacity - currentCount} kursi tersisa</span>
              </div>
            </div>

            {/* Lokasi Ruangan */}
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Lokasi Ruang</span>
              </div>
              <div className="font-semibold text-white text-sm truncate">
                {classGroup.roomLocation || 'Belum diatur'}
              </div>
              <div className="text-[11px] text-slate-500">
                {classGroup.notes ? `Ket: ${classGroup.notes}` : 'Tidak ada catatan'}
              </div>
            </div>
          </div>

          {/* Wali Kelas Section */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded-lg">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Ustadz / Wali Kelas</div>
                {classGroup.homeroomTeacher ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">
                      {classGroup.homeroomTeacher.employee?.fullName || classGroup.homeroomTeacher.teacherCode}
                    </span>
                    <span className="text-xs text-teal-400 font-mono">
                      ({classGroup.homeroomTeacher.teacherCode})
                    </span>
                    <span className="text-xs text-slate-400">
                      • {classGroup.homeroomTeacher.specialization || 'Pengajar'}
                    </span>
                  </div>
                ) : (
                  <div className="text-sm text-slate-400 italic">
                    Belum ditentukan wali kelas untuk rombel ini
                  </div>
                )}
              </div>
            </div>

            {hasPermission('class.update') && (
              <div>
                {isEditingHomeroom ? (
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedHomeroomId}
                      onChange={(e) => setSelectedHomeroomId(e.target.value)}
                      className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-hidden focus:border-emerald-500"
                    >
                      <option value="">-- Kosongkan / Tanpa Wali --</option>
                      {teachers
                        .filter((t) => t.teachingStatus !== 'INACTIVE')
                        .map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.fullName || t.teacherCode} ({t.teacherCode})
                          </option>
                        ))}
                    </select>
                    <button
                      onClick={handleSaveHomeroom}
                      disabled={homeroomLoading}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                      {homeroomLoading ? 'Menyimpan...' : 'Simpan'}
                    </button>
                    <button
                      onClick={() => setIsEditingHomeroom(false)}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs rounded-lg transition-colors"
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedHomeroomId(classGroup.homeroomTeacherId || '');
                      setIsEditingHomeroom(true);
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
                  >
                    {classGroup.homeroomTeacherId ? 'Ganti Wali Kelas' : 'Tugaskan Wali Kelas'}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Student List Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>Daftar Santri di Rombel</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono font-medium">
                    {currentCount} santri terdaftar
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Daftar santri aktif yang ditempatkan pada rombongan belajar ini.
                </p>
              </div>

              {hasPermission('class.assign_student') && (
                <button
                  disabled={isFull || classGroup.status === 'ARCHIVED'}
                  onClick={() => setIsAssignOpen(true)}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg flex items-center gap-2 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Tambah Santri ke Rombel</span>
                </button>
              )}
            </div>

            {/* Students Table */}
            <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Santri</th>
                    <th className="py-3 px-3">NIS / NISN</th>
                    <th className="py-3 px-3">Gender</th>
                    <th className="py-3 px-3">Tgl Masuk</th>
                    <th className="py-3 px-3">Catatan</th>
                    {hasPermission('class.assign_student') && (
                      <th className="py-3 px-4 text-right">Aksi</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {enrolledStudents.length === 0 ? (
                    <tr>
                      <td
                        colSpan={hasPermission('class.assign_student') ? 6 : 5}
                        className="py-8 text-center text-slate-500"
                      >
                        Belum ada santri yang ditempatkan di rombongan belajar ini.
                      </td>
                    </tr>
                  ) : (
                    enrolledStudents.map((item) => {
                      const st = item.student;
                      if (!st) return null;

                      return (
                        <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-300 text-xs">
                                {st.fullName.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-medium text-white">{st.fullName}</span>
                            </div>
                          </td>

                          <td className="py-3 px-3 font-mono text-slate-300">
                            {st.nis}
                            {st.nisn && <span className="text-slate-500 block text-[10px]">NISN: {st.nisn}</span>}
                          </td>

                          <td className="py-3 px-3">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                                st.gender === 'LAKI_LAKI'
                                  ? 'bg-blue-500/10 text-blue-400'
                                  : 'bg-pink-500/10 text-pink-400'
                              }`}
                            >
                              {st.gender === 'LAKI_LAKI' ? 'L' : 'P'}
                            </span>
                          </td>

                          <td className="py-3 px-3 text-slate-400">
                            {new Date(item.enrollDate).toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>

                          <td className="py-3 px-3 text-slate-400 truncate max-w-xs">
                            {item.notes || '-'}
                          </td>

                          {hasPermission('class.assign_student') && (
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setSelectedStudentForTransfer(st)}
                                  title="Pindah Rombel (Mutasi)"
                                  className="p-1.5 text-sky-400 hover:text-sky-300 hover:bg-sky-500/10 rounded-md transition-colors"
                                >
                                  <ArrowRightLeft className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => setSelectedStudentForRemove(st)}
                                  title="Keluarkan dari Rombel"
                                  className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-md transition-colors"
                                >
                                  <UserMinus className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-800/40 border-t border-slate-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>

      {/* Sub-modals */}
      {isAssignOpen && (
        <AssignStudentModal
          isOpen={isAssignOpen}
          onClose={() => setIsAssignOpen(false)}
          classGroup={classGroup}
          allStudents={allStudents}
          onAssign={async (studentId, notes) => {
            const ok = await onAssignStudent(classGroup.id, studentId, notes);
            if (ok) {
              await onRefreshClass();
              setActionNotice({ type: 'success', message: 'Santri berhasil ditambahkan ke kelas.' });
              setTimeout(() => setActionNotice(null), 3000);
            }
            return ok;
          }}
        />
      )}

      {selectedStudentForTransfer && (
        <TransferStudentModal
          isOpen={!!selectedStudentForTransfer}
          onClose={() => setSelectedStudentForTransfer(null)}
          sourceClass={classGroup}
          student={selectedStudentForTransfer}
          allClasses={allClasses}
          onTransfer={async (targetClassId, notes) => {
            const ok = await onTransferStudent(
              classGroup.id,
              selectedStudentForTransfer.id,
              targetClassId,
              notes
            );
            if (ok) {
              await onRefreshClass();
              setActionNotice({ type: 'success', message: 'Santri berhasil dimutasi ke rombel tujuan.' });
              setTimeout(() => setActionNotice(null), 3000);
            }
            return ok;
          }}
        />
      )}

      {selectedStudentForRemove && (
        <RemoveStudentModal
          isOpen={!!selectedStudentForRemove}
          onClose={() => setSelectedStudentForRemove(null)}
          classGroup={classGroup}
          student={selectedStudentForRemove}
          onRemove={async (reason) => {
            const ok = await onRemoveStudent(classGroup.id, selectedStudentForRemove.id, reason);
            if (ok) {
              await onRefreshClass();
              setActionNotice({ type: 'success', message: 'Santri berhasil dikeluarkan dari rombel.' });
              setTimeout(() => setActionNotice(null), 3000);
            }
            return ok;
          }}
        />
      )}
    </div>
  );
};
