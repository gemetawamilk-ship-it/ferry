import React, { useState } from 'react';
import { Student, Program, AcademicYear, Room, Parent, User } from '../../types';
import {
  Search,
  Plus,
  Filter,
  Eye,
  Edit3,
  Trash2,
  BedDouble,
  Link2,
  Unlink,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  HeartHandshake,
  GraduationCap,
  Users,
} from 'lucide-react';
import { StudentModal } from './StudentModal';
import { StudentDetailModal } from './StudentDetailModal';
import { StudentRoomModal } from './StudentRoomModal';
import { LinkUserModal } from './LinkUserModal';

interface StudentListProps {
  students: Student[];
  programs: Program[];
  academicYears: AcademicYear[];
  rooms: Room[];
  parents: Parent[];
  users: User[];
  onRefresh: () => void;
  onCreateStudent: (data: Partial<Student>) => Promise<void>;
  onUpdateStudent: (id: string, data: Partial<Student>) => Promise<void>;
  onDeleteStudent: (id: string) => Promise<void>;
  onToggleStatus: (id: string, status?: string) => Promise<void>;
  onAssignRoom: (studentId: string, roomId: string, notes?: string) => Promise<void>;
  onRemoveRoom: (studentId: string) => Promise<void>;
  onLinkUser: (studentId: string, userId: string) => Promise<void>;
  onUnlinkUser: (studentId: string) => Promise<void>;
  onAddParent: (
    studentId: string,
    data: {
      parentId: string;
      relationship: any;
      isPrimaryContact?: boolean;
      isEmergencyContact?: boolean;
    }
  ) => Promise<void>;
  onRemoveParent: (studentId: string, parentId: string) => Promise<void>;
  hasPermission: (perm: string) => boolean;
}

export const StudentList: React.FC<StudentListProps> = ({
  students,
  programs,
  academicYears,
  rooms,
  parents,
  users,
  onRefresh,
  onCreateStudent,
  onUpdateStudent,
  onDeleteStudent,
  onToggleStatus,
  onAssignRoom,
  onRemoveRoom,
  onLinkUser,
  onUnlinkUser,
  onAddParent,
  onRemoveParent,
  hasPermission,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [programFilter, setProgramFilter] = useState('');
  const [roomFilter, setRoomFilter] = useState('');

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [detailStudent, setDetailStudent] = useState<Student | null>(null);
  const [roomStudent, setRoomStudent] = useState<Student | null>(null);
  const [linkUserStudent, setLinkUserStudent] = useState<Student | null>(null);

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.nisn && s.nisn.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = !statusFilter || s.status === statusFilter;
    const matchesGender = !genderFilter || s.gender === genderFilter;
    const matchesProgram = !programFilter || s.programId === programFilter;
    const matchesRoom =
      !roomFilter ||
      (roomFilter === 'HAS_ROOM' && !!s.currentRoomId) ||
      (roomFilter === 'NO_ROOM' && !s.currentRoomId);

    return matchesSearch && matchesStatus && matchesGender && matchesProgram && matchesRoom;
  });

  const handleDelete = async (student: Student) => {
    if (!window.confirm(`Yakin ingin menghapus data santri ${student.fullName} (NIS: ${student.nis})?`)) {
      return;
    }
    try {
      await onDeleteStudent(student.id);
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus santri.');
    }
  };

  const handleToggleStatus = async (student: Student) => {
    const newStatus = student.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    const confirmMsg =
      student.status === 'ACTIVE'
        ? `Ubah status santri ${student.fullName} menjadi SKORSING (SUSPENDED)?`
        : `Aktifkan kembali santri ${student.fullName}?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      await onToggleStatus(student.id, newStatus);
    } catch (err: any) {
      alert(err.message || 'Gagal mengubah status santri.');
    }
  };

  // Sync open modals with updated students data if active
  const currentDetailStudent = detailStudent
    ? students.find((s) => s.id === detailStudent.id) || detailStudent
    : null;
  const currentRoomStudent = roomStudent
    ? students.find((s) => s.id === roomStudent.id) || roomStudent
    : null;

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Cari berdasarkan Nama, NIS, atau NISN santri..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Create Button */}
          {hasPermission('student.create') && (
            <button
              onClick={() => setIsCreateOpen(true)}
              className="w-full md:w-auto px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Daftarkan Santri</span>
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
          >
            <option value="">Semua Status Santri</option>
            <option value="ACTIVE">Aktif Belajar</option>
            <option value="GRADUATED">Lulus (Alumni)</option>
            <option value="SUSPENDED">Skorsing</option>
            <option value="MUTASI">Mutasi</option>
            <option value="DROPOUT">Drop Out</option>
          </select>

          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
          >
            <option value="">Semua Jenis Kelamin</option>
            <option value="LAKI_LAKI">Santri Putra (Ikhwan)</option>
            <option value="PEREMPUAN">Santri Putri (Akhwat)</option>
          </select>

          <select
            value={programFilter}
            onChange={(e) => setProgramFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
          >
            <option value="">Semua Program Pendidikan</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            value={roomFilter}
            onChange={(e) => setRoomFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
          >
            <option value="">Semua Status Asrama</option>
            <option value="HAS_ROOM">Sudah Ditempatkan di Kamar</option>
            <option value="NO_ROOM">Belum Memiliki Kamar</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between px-1 text-xs text-slate-500 font-medium">
        <span>
          Menampilkan <strong className="text-slate-900">{filteredStudents.length}</strong> dari {students.length} santri
        </span>
        {(statusFilter || genderFilter || programFilter || roomFilter || searchTerm) && (
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('');
              setGenderFilter('');
              setProgramFilter('');
              setRoomFilter('');
            }}
            className="text-emerald-700 hover:underline font-semibold"
          >
            Reset Semua Filter
          </button>
        )}
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px] tracking-wider">
                <th className="py-3 px-4">Identitas Santri</th>
                <th className="py-3 px-4">Program</th>
                <th className="py-3 px-4">Kamar Asrama</th>
                <th className="py-3 px-4">Wali Santri</th>
                <th className="py-3 px-4">Akun Login</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Tidak ada data santri yang sesuai kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const isMale = student.gender === 'LAKI_LAKI';
                  return (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Santri info */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                              isMale ? 'bg-sky-100 text-sky-800' : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {student.fullName.charAt(0)}
                          </div>
                          <div>
                            <button
                              onClick={() => setDetailStudent(student)}
                              className="font-bold text-slate-900 hover:text-emerald-700 text-left text-sm"
                            >
                              {student.fullName}
                            </button>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="font-mono text-[11px] text-slate-500 font-semibold">
                                NIS: {student.nis}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                  isMale ? 'bg-sky-50 text-sky-700 border border-sky-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}
                              >
                                {isMale ? 'Putra' : 'Putri'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Program */}
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-800">{student.program?.name || '-'}</p>
                        <p className="text-[11px] text-slate-400">
                          {student.academicYear?.name || 'Thn Masuk: ' + student.admissionDate.split('-')[0]}
                        </p>
                      </td>

                      {/* Room */}
                      <td className="py-3 px-4">
                        {student.currentRoom ? (
                          <div>
                            <span className="font-bold text-teal-800 flex items-center gap-1">
                              <BedDouble className="w-3.5 h-3.5 text-teal-600" />
                              {student.currentRoom.name}
                            </span>
                            <p className="text-[11px] text-slate-400">
                              {student.currentRoom.dormitoryName || 'Asrama'}
                            </p>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Belum ada kamar</span>
                        )}
                      </td>

                      {/* Parents */}
                      <td className="py-3 px-4">
                        {student.parents && student.parents.length > 0 ? (
                          <div className="space-y-0.5">
                            {student.parents.slice(0, 2).map((sp) => (
                              <p key={sp.id} className="text-slate-800 truncate max-w-[140px]">
                                <span className="font-semibold">{sp.parent?.fullName}</span>{' '}
                                <span className="text-[10px] text-slate-500">({sp.relationship})</span>
                              </p>
                            ))}
                            {student.parents.length > 2 && (
                              <p className="text-[10px] text-emerald-700 font-semibold">
                                +{student.parents.length - 2} wali lainnya
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Belum ditautkan</span>
                        )}
                      </td>

                      {/* Linked User Account */}
                      <td className="py-3 px-4">
                        {student.user ? (
                          <div className="flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <div>
                              <p className="font-mono text-slate-800 font-semibold">@{student.user.username}</p>
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
                                {student.user.role}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Belum ada akun</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => hasPermission('student.update') && handleToggleStatus(student)}
                          disabled={!hasPermission('student.update')}
                          title="Klik untuk ubah status aktif/skorsing"
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] transition-transform active:scale-95 ${
                            student.status === 'ACTIVE'
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : student.status === 'GRADUATED'
                              ? 'bg-blue-100 text-blue-800'
                              : student.status === 'SUSPENDED'
                              ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {student.status}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* View Detail */}
                          <button
                            onClick={() => setDetailStudent(student)}
                            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Lihat Detail Santri"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Assign Room */}
                          {hasPermission('student.room_assign') && (
                            <button
                              onClick={() => setRoomStudent(student)}
                              className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                              title="Kelola Penempatan Kamar"
                            >
                              <BedDouble className="w-4 h-4" />
                            </button>
                          )}

                          {/* Link User Account */}
                          {hasPermission('student.link_user') && !student.userId && (
                            <button
                              onClick={() => setLinkUserStudent(student)}
                              className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="Tautkan Akun Pengguna"
                            >
                              <Link2 className="w-4 h-4" />
                            </button>
                          )}

                          {/* Edit */}
                          {hasPermission('student.update') && (
                            <button
                              onClick={() => setEditingStudent(student)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit Data Santri"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          )}

                          {/* Delete */}
                          {hasPermission('student.delete') && (
                            <button
                              onClick={() => handleDelete(student)}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Hapus Data Santri"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALS */}
      {/* Create Modal */}
      <StudentModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSave={onCreateStudent}
        programs={programs}
        academicYears={academicYears}
        rooms={rooms}
      />

      {/* Edit Modal */}
      <StudentModal
        isOpen={!!editingStudent}
        onClose={() => setEditingStudent(null)}
        onSave={async (data) => {
          if (editingStudent) {
            await onUpdateStudent(editingStudent.id, data);
            setEditingStudent(null);
          }
        }}
        student={editingStudent}
        programs={programs}
        academicYears={academicYears}
        rooms={rooms}
      />

      {/* Detail Modal */}
      {currentDetailStudent && (
        <StudentDetailModal
          isOpen={!!currentDetailStudent}
          onClose={() => setDetailStudent(null)}
          student={currentDetailStudent}
          allParents={parents}
          onEditStudent={(s) => {
            setDetailStudent(null);
            setEditingStudent(s);
          }}
          onManageRoom={(s) => {
            setDetailStudent(null);
            setRoomStudent(s);
          }}
          onLinkUser={(s) => {
            setDetailStudent(null);
            setLinkUserStudent(s);
          }}
          onUnlinkUser={onUnlinkUser}
          onAddParent={onAddParent}
          onRemoveParent={onRemoveParent}
          hasPermission={hasPermission}
        />
      )}

      {/* Room Assignment Modal */}
      {currentRoomStudent && (
        <StudentRoomModal
          isOpen={!!currentRoomStudent}
          onClose={() => setRoomStudent(null)}
          student={currentRoomStudent}
          rooms={rooms}
          allStudents={students}
          onAssignRoom={onAssignRoom}
          onRemoveRoom={onRemoveRoom}
        />
      )}

      {/* Link User Modal */}
      {linkUserStudent && (
        <LinkUserModal
          isOpen={!!linkUserStudent}
          onClose={() => setLinkUserStudent(null)}
          targetType="STUDENT"
          targetEntity={linkUserStudent}
          availableUsers={users}
          onLink={onLinkUser}
        />
      )}
    </div>
  );
};
