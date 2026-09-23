import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../services/api';
import {
  Student,
  Parent,
  StudentStats,
  Program,
  AcademicYear,
  Room,
  User,
} from '../../types';
import { useAuth } from '../../context/AuthContext';
import { StudentStatsOverview } from './StudentStatsOverview';
import { StudentList } from './StudentList';
import { ParentList } from './ParentList';
import {
  Users,
  HeartHandshake,
  LayoutDashboard,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
} from 'lucide-react';

export const StudentManagement: React.FC = () => {
  const { tenant, hasPermission } = useAuth();

  const [activeTab, setActiveTab] = useState<'santri' | 'wali' | 'statistik'>('santri');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [parents, setParents] = useState<Parent[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, studentsRes, parentsRes, programsRes, academicYearsRes, roomsRes, usersRes] =
        await Promise.allSettled([
          api.getStudentStats(),
          api.getStudents(),
          api.getParents(),
          api.getPrograms(),
          api.getAcademicYears(),
          api.getRooms(),
          api.getUsers(),
        ]);

      if (statsRes.status === 'fulfilled' && statsRes.value.success) {
        setStats(statsRes.value.data);
      }
      if (studentsRes.status === 'fulfilled' && studentsRes.value.success) {
        setStudents(studentsRes.value.data);
      }
      if (parentsRes.status === 'fulfilled' && parentsRes.value.success) {
        setParents(parentsRes.value.data);
      }
      if (programsRes.status === 'fulfilled' && programsRes.value.success) {
        setPrograms(programsRes.value.data);
      }
      if (academicYearsRes.status === 'fulfilled' && academicYearsRes.value.success) {
        setAcademicYears(academicYearsRes.value.data);
      }
      if (roomsRes.status === 'fulfilled' && roomsRes.value.success) {
        setRooms(roomsRes.value.data);
      }
      if (usersRes.status === 'fulfilled' && usersRes.value.success) {
        setUsers(usersRes.value.users);
      }
    } catch (err: any) {
      console.error('Failed loading student data:', err);
      showNotification('error', 'Gagal memuat data master santri & wali santri.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Student CRUD
  const handleCreateStudent = async (data: Partial<Student>) => {
    const res = await api.createStudent(data);
    showNotification('success', res.message || 'Santri berhasil didaftarkan.');
    await loadData();
  };

  const handleUpdateStudent = async (id: string, data: Partial<Student>) => {
    const res = await api.updateStudent(id, data);
    showNotification('success', res.message || 'Data santri berhasil diperbarui.');
    await loadData();
  };

  const handleDeleteStudent = async (id: string) => {
    const res = await api.deleteStudent(id);
    showNotification('success', res.message || 'Data santri berhasil dihapus.');
    await loadData();
  };

  const handleToggleStatus = async (id: string, status?: string) => {
    const res = await api.toggleStudentStatus(id, status);
    showNotification('success', res.message || 'Status santri berhasil diperbarui.');
    await loadData();
  };

  const handleAssignRoom = async (studentId: string, roomId: string, notes?: string) => {
    const res = await api.assignStudentRoom(studentId, roomId, notes);
    showNotification('success', res.message || 'Penempatan kamar santri berhasil disimpan.');
    await loadData();
  };

  const handleRemoveRoom = async (studentId: string) => {
    const res = await api.removeStudentRoom(studentId);
    showNotification('success', res.message || 'Kamar santri berhasil dikosongkan.');
    await loadData();
  };

  const handleLinkStudentUser = async (studentId: string, userId: string) => {
    const res = await api.linkStudentUser(studentId, userId);
    showNotification('success', res.message || 'Akun pengguna berhasil ditautkan ke santri.');
    await loadData();
  };

  const handleUnlinkStudentUser = async (studentId: string) => {
    const res = await api.unlinkStudentUser(studentId);
    showNotification('success', res.message || 'Tautan akun login santri berhasil dicabut.');
    await loadData();
  };

  const handleAddStudentParent = async (
    studentId: string,
    data: {
      parentId: string;
      relationship: any;
      isPrimaryContact?: boolean;
      isEmergencyContact?: boolean;
    }
  ) => {
    const res = await api.addStudentParent(studentId, data);
    showNotification('success', res.message || 'Relasi wali santri berhasil dihubungkan.');
    await loadData();
  };

  const handleRemoveStudentParent = async (studentId: string, parentId: string) => {
    const res = await api.removeStudentParent(studentId, parentId);
    showNotification('success', res.message || 'Relasi wali santri berhasil dihapus.');
    await loadData();
  };

  // Parent CRUD
  const handleCreateParent = async (data: Partial<Parent>) => {
    const res = await api.createParent(data);
    showNotification('success', res.message || 'Data wali santri berhasil didaftarkan.');
    await loadData();
  };

  const handleUpdateParent = async (id: string, data: Partial<Parent>) => {
    const res = await api.updateParent(id, data);
    showNotification('success', res.message || 'Data wali santri berhasil diperbarui.');
    await loadData();
  };

  const handleDeleteParent = async (id: string) => {
    const res = await api.deleteParent(id);
    showNotification('success', res.message || 'Data wali santri berhasil dihapus.');
    await loadData();
  };

  const handleLinkParentUser = async (parentId: string, userId: string) => {
    const res = await api.linkParentUser(parentId, userId);
    showNotification('success', res.message || 'Akun pengguna berhasil ditautkan ke wali santri.');
    await loadData();
  };

  const handleUnlinkParentUser = async (parentId: string) => {
    const res = await api.unlinkParentUser(parentId);
    showNotification('success', res.message || 'Tautan akun login wali santri berhasil dicabut.');
    await loadData();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Master Data Santri & Wali Santri
            </h1>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
              FASE 2.4
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Pengelolaan identitas santri, wali santri, penempatan kamar asrama, dan integrasi portal di{' '}
            <span className="font-semibold text-emerald-700">{tenant?.name}</span>
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2 shadow-2xs transition-colors shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
          <span>Muat Ulang</span>
        </button>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-3 border shadow-xs transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('santri')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeTab === 'santri'
              ? 'border-emerald-600 text-emerald-700 bg-white shadow-2xs'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Daftar Santri ({students.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wali')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeTab === 'wali'
              ? 'border-emerald-600 text-emerald-700 bg-white shadow-2xs'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>Wali Santri ({parents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('statistik')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeTab === 'statistik'
              ? 'border-emerald-600 text-emerald-700 bg-white shadow-2xs'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Statistik & Demografi</span>
        </button>
      </div>

      {/* Tab Contents */}
      {loading && !students.length && !parents.length ? (
        <div className="bg-white rounded-xl p-16 text-center border border-slate-200">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700">Memuat data kesiswaan pesantren...</p>
        </div>
      ) : (
        <>
          {activeTab === 'santri' && (
            <StudentList
              students={students}
              programs={programs}
              academicYears={academicYears}
              rooms={rooms}
              parents={parents}
              users={users}
              onRefresh={loadData}
              onCreateStudent={handleCreateStudent}
              onUpdateStudent={handleUpdateStudent}
              onDeleteStudent={handleDeleteStudent}
              onToggleStatus={handleToggleStatus}
              onAssignRoom={handleAssignRoom}
              onRemoveRoom={handleRemoveRoom}
              onLinkUser={handleLinkStudentUser}
              onUnlinkUser={handleUnlinkStudentUser}
              onAddParent={handleAddStudentParent}
              onRemoveParent={handleRemoveStudentParent}
              hasPermission={hasPermission}
            />
          )}

          {activeTab === 'wali' && (
            <ParentList
              parents={parents}
              users={users}
              onRefresh={loadData}
              onCreateParent={handleCreateParent}
              onUpdateParent={handleUpdateParent}
              onDeleteParent={handleDeleteParent}
              onLinkUser={handleLinkParentUser}
              onUnlinkUser={handleUnlinkParentUser}
              hasPermission={hasPermission}
            />
          )}

          {activeTab === 'statistik' && <StudentStatsOverview stats={stats} />}
        </>
      )}
    </div>
  );
};
