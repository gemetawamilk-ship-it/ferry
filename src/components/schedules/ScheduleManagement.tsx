import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  Schedule,
  ScheduleStatus,
  DayOfWeek,
  ScheduleStats,
  ClassSubject,
  ClassGroup,
  Room,
  Teacher,
} from '../../types';
import { ScheduleModal } from './ScheduleModal';
import {
  Calendar,
  Clock,
  School,
  GraduationCap,
  DoorOpen,
  BookOpen,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Layers,
  LayoutGrid,
  List,
  AlertTriangle,
} from 'lucide-react';

const DAYS_ORDER: DayOfWeek[] = ['SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU', 'AHAD'];

const DAY_LABELS: Record<DayOfWeek, string> = {
  SENIN: 'Senin',
  SELASA: 'Selasa',
  RABU: 'Rabu',
  KAMIS: 'Kamis',
  JUMAT: 'Jumat',
  SABTU: 'Sabtu',
  AHAD: 'Ahad',
};

const DAY_COLORS: Record<DayOfWeek, { bg: string; text: string; border: string }> = {
  SENIN: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  SELASA: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  RABU: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
  KAMIS: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  JUMAT: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  SABTU: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  AHAD: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
};

export const ScheduleManagement: React.FC = () => {
  const { hasPermission } = useAuth();

  const [loading, setLoading] = useState(true);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [stats, setStats] = useState<ScheduleStats | null>(null);

  // References
  const [classSubjects, setClassSubjects] = useState<ClassSubject[]>([]);
  const [classes, setClasses] = useState<ClassGroup[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  // View mode: 'TABLE' or 'WEEKLY_GRID'
  const [viewMode, setViewMode] = useState<'TABLE' | 'WEEKLY_GRID'>('TABLE');
  const [selectedDayTab, setSelectedDayTab] = useState<DayOfWeek | 'ALL'>('ALL');

  // Filters
  const [selectedClassId, setSelectedClassId] = useState<string>('ALL');
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('ALL');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('ALL');
  const [selectedRoomId, setSelectedRoomId] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Schedule | null>(null);

  // Delete
  const [deleteTarget, setDeleteTarget] = useState<Schedule | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Notifications
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const canCreate = hasPermission('schedule.create');
  const canUpdate = hasPermission('schedule.update');
  const canDelete = hasPermission('schedule.delete');

  const loadData = async () => {
    try {
      setLoading(true);
      setActionError(null);

      const [schRes, statsRes, csRes, clsRes, rmRes, tchRes] = await Promise.all([
        api.getSchedules(),
        api.getScheduleStats(),
        api.getClassSubjects(),
        api.getClasses(),
        api.getRooms(),
        api.getTeachers(),
      ]);

      if (schRes.success) setSchedules(schRes.data || []);
      if (statsRes.success) setStats(statsRes.data || null);
      if (csRes.success) setClassSubjects(csRes.data || []);
      if (clsRes.success) setClasses(clsRes.data || []);
      if (rmRes.success) setRooms(rmRes.data || []);
      if (tchRes.success) setTeachers(tchRes.data || []);
    } catch (err: any) {
      setActionError(err.message || 'Gagal memuat jadwal pelajaran.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateOrUpdate = async (data: {
    classSubjectId: string;
    classId: string;
    roomId: string;
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
    status: ScheduleStatus;
  }) => {
    setActionError(null);
    setActionSuccess(null);

    if (editingItem) {
      const res = await api.updateSchedule(editingItem.id, {
        classSubjectId: data.classSubjectId,
        roomId: data.roomId,
        dayOfWeek: data.dayOfWeek,
        startTime: data.startTime,
        endTime: data.endTime,
        status: data.status,
      });
      if (res.success) {
        setActionSuccess(res.message || 'Jadwal pelajaran berhasil diperbarui.');
        await loadData();
      }
    } else {
      const res = await api.createSchedule({
        classSubjectId: data.classSubjectId,
        classId: data.classId,
        roomId: data.roomId,
        dayOfWeek: data.dayOfWeek,
        startTime: data.startTime,
        endTime: data.endTime,
        status: data.status,
      });
      if (res.success) {
        setActionSuccess(res.message || 'Jadwal pelajaran baru berhasil ditambahkan.');
        await loadData();
      }
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      setActionError(null);
      const res = await api.deleteSchedule(deleteTarget.id);
      if (res.success) {
        setActionSuccess(res.message || 'Jadwal pelajaran berhasil dihapus.');
        setDeleteTarget(null);
        await loadData();
      }
    } catch (err: any) {
      setActionError(err.message || 'Gagal menghapus jadwal pelajaran.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered schedules
  const filteredSchedules = useMemo(() => {
    return schedules.filter((s) => {
      if (selectedClassId !== 'ALL' && s.classId !== selectedClassId) return false;
      if (selectedDayFilter !== 'ALL' && s.dayOfWeek !== selectedDayFilter) return false;
      if (selectedRoomId !== 'ALL' && s.roomId !== selectedRoomId) return false;
      if (selectedStatus !== 'ALL' && s.status !== selectedStatus) return false;

      if (selectedTeacherId !== 'ALL') {
        const teacherId = s.classSubject?.teacherId || s.teacher?.id;
        if (teacherId !== selectedTeacherId) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const className = s.classGroup?.name.toLowerCase() || '';
        const subjectName = s.subject?.name.toLowerCase() || '';
        const teacherName =
          s.teacher?.employee?.fullName.toLowerCase() ||
          s.teacher?.teacherCode.toLowerCase() ||
          '';
        const roomName = s.room?.name.toLowerCase() || '';
        const roomCode = s.room?.code.toLowerCase() || '';
        const day = s.dayOfWeek.toLowerCase();

        return (
          className.includes(q) ||
          subjectName.includes(q) ||
          teacherName.includes(q) ||
          roomName.includes(q) ||
          roomCode.includes(q) ||
          day.includes(q) ||
          s.startTime.includes(q) ||
          s.endTime.includes(q)
        );
      }

      return true;
    });
  }, [
    schedules,
    selectedClassId,
    selectedDayFilter,
    selectedTeacherId,
    selectedRoomId,
    selectedStatus,
    searchQuery,
  ]);

  // Group schedules by day for the calendar/weekly grid view
  const schedulesByDay = useMemo(() => {
    const map: Record<DayOfWeek, Schedule[]> = {
      SENIN: [],
      SELASA: [],
      RABU: [],
      KAMIS: [],
      JUMAT: [],
      SABTU: [],
      AHAD: [],
    };
    for (const s of filteredSchedules) {
      if (map[s.dayOfWeek]) {
        map[s.dayOfWeek].push(s);
      }
    }
    // Sort each day by startTime
    for (const d of DAYS_ORDER) {
      map[d].sort((a, b) => a.startTime.localeCompare(b.startTime));
    }
    return map;
  }, [filteredSchedules]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
              FASE 3.3 • AKADEMIK
            </span>
            <span className="text-xs text-slate-500">• Jadwal Kegiatan Belajar Mengajar</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mt-1 flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-emerald-600" />
            Jadwal Pelajaran
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pengelolaan alokasi waktu mata pelajaran, penugasan guru, dan pemakaian ruangan belajar per rombel.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
            title="Muat Ulang"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {canCreate && (
            <button
              onClick={() => {
                setEditingItem(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-2 transition-all duration-150"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Jadwal</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3 text-emerald-800 text-sm">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button
            onClick={() => setActionSuccess(null)}
            className="text-xs text-emerald-600 hover:text-emerald-800 font-semibold"
          >
            Tutup
          </button>
        </div>
      )}

      {actionError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between gap-3 text-rose-800 text-sm">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{actionError}</span>
          </div>
          <button
            onClick={() => setActionError(null)}
            className="text-xs text-rose-600 hover:text-rose-800 font-semibold"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Jadwal</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-2">{stats?.totalSchedules ?? '-'}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Sesi KBM Terdaftar</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Jadwal Aktif</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-2">{stats?.activeSchedules ?? '-'}</p>
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Sedang Berjalan</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Kelas Terjadwal</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <School className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-2">{stats?.totalClassesScheduled ?? '-'}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Rombel Aktif</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Guru Bertugas</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-2">{stats?.totalTeachersScheduled ?? '-'}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Ustadz/Pengajar</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Ruangan Digunakan</span>
            <div className="p-2 bg-teal-50 text-teal-600 rounded-xl">
              <DoorOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-2">{stats?.totalRoomsUsed ?? '-'}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Kelas & Lab</p>
        </div>
      </div>

      {/* Control Bar: Filters & View Switcher */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari mapel, guru, kelas, atau ruangan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-colors"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl self-start md:self-auto border border-slate-200">
            <button
              onClick={() => setViewMode('TABLE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'TABLE'
                  ? 'bg-white text-slate-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Tabel Jadwal</span>
            </button>
            <button
              onClick={() => setViewMode('WEEKLY_GRID')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'WEEKLY_GRID'
                  ? 'bg-white text-slate-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Kalender Mingguan</span>
            </button>
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-3 border-t border-slate-100 text-xs">
          {/* Filter Kelas */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
              <School className="w-3 h-3 text-emerald-600" />
              Filter Kelas
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            >
              <option value="ALL">Semua Kelas</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>

          {/* Filter Hari */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-blue-600" />
              Filter Hari
            </label>
            <select
              value={selectedDayFilter}
              onChange={(e) => setSelectedDayFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            >
              <option value="ALL">Semua Hari</option>
              {DAYS_ORDER.map((d) => (
                <option key={d} value={d}>
                  {DAY_LABELS[d]}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Guru */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
              <GraduationCap className="w-3 h-3 text-amber-600" />
              Filter Guru
            </label>
            <select
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            >
              <option value="ALL">Semua Guru</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.employee?.fullName || t.teacherCode}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Ruangan */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
              <DoorOpen className="w-3 h-3 text-teal-600" />
              Filter Ruangan
            </label>
            <select
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            >
              <option value="ALL">Semua Ruangan</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.code})
                </option>
              ))}
            </select>
          </div>

          {/* Filter Status */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-purple-600" />
              Status Jadwal
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            >
              <option value="ALL">Semua Status</option>
              <option value="ACTIVE">Aktif (ACTIVE)</option>
              <option value="INACTIVE">Nonaktif (INACTIVE)</option>
            </select>
          </div>
        </div>
      </div>

      {/* VIEW 1: TABEL JADWAL */}
      {viewMode === 'TABLE' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Hari & Jam</th>
                  <th className="py-3.5 px-4">Kelas / Rombel</th>
                  <th className="py-3.5 px-4">Mata Pelajaran</th>
                  <th className="py-3.5 px-4">Guru / Pengajar</th>
                  <th className="py-3.5 px-4">Ruangan</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
                        <span>Memuat data jadwal pelajaran...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredSchedules.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Calendar className="w-8 h-8 text-slate-300" />
                        <span className="font-semibold text-slate-600">Tidak ada jadwal ditemukan</span>
                        <span className="text-[11px]">
                          Coba sesuaikan filter atau tambahkan jadwal pelajaran baru.
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSchedules.map((s) => {
                    const dayTheme = DAY_COLORS[s.dayOfWeek] || {
                      bg: 'bg-slate-50',
                      text: 'text-slate-700',
                      border: 'border-slate-200',
                    };

                    const teacherName =
                      s.teacher?.employee?.fullName || s.teacher?.teacherCode || 'Guru';
                    const subjectName = s.subject?.name || 'Mata Pelajaran';
                    const subjectCode = s.subject?.code || '';
                    const className = s.classGroup?.name || 'Kelas';
                    const roomName = s.room?.name || 'Ruangan';
                    const roomCode = s.room?.code || '';

                    return (
                      <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Hari & Jam */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded-md font-bold text-[11px] border ${dayTheme.bg} ${dayTheme.text} ${dayTheme.border}`}
                            >
                              {DAY_LABELS[s.dayOfWeek]}
                            </span>
                            <span className="font-mono text-slate-700 font-semibold">
                              {s.startTime} - {s.endTime}
                            </span>
                          </div>
                        </td>

                        {/* Kelas */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <School className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                            <span className="font-semibold text-slate-800">{className}</span>
                          </div>
                        </td>

                        {/* Mata Pelajaran */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <div>
                              <span className="font-semibold text-slate-800">{subjectName}</span>
                              {subjectCode && (
                                <span className="ml-1.5 text-[10px] text-slate-400 font-mono">
                                  ({subjectCode})
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Guru */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span>{teacherName}</span>
                          </div>
                        </td>

                        {/* Ruangan */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <DoorOpen className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                            <span className="font-medium text-slate-700">{roomName}</span>
                            {roomCode && (
                              <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded font-mono">
                                {roomCode}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                              s.status === 'ACTIVE'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            {s.status === 'ACTIVE' ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </td>

                        {/* Aksi */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {canUpdate && (
                              <button
                                onClick={() => {
                                  setEditingItem(s);
                                  setIsModalOpen(true);
                                }}
                                className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                title="Edit Jadwal"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {canDelete && (
                              <button
                                onClick={() => setDeleteTarget(s)}
                                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Hapus Jadwal"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
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
      )}

      {/* VIEW 2: KALENDER MINGGUAN / JADWAL PER HARI */}
      {viewMode === 'WEEKLY_GRID' && (
        <div className="space-y-4">
          {/* Day Pills Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedDayTab('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                selectedDayTab === 'ALL'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Semua Hari ({filteredSchedules.length})
            </button>
            {DAYS_ORDER.map((d) => {
              const count = schedulesByDay[d]?.length || 0;
              const isCurrent = selectedDayTab === d;
              return (
                <button
                  key={d}
                  onClick={() => setSelectedDayTab(d)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 ${
                    isCurrent
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>{DAY_LABELS[d]}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isCurrent ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Day Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DAYS_ORDER.filter((d) => selectedDayTab === 'ALL' || selectedDayTab === d).map((d) => {
              const items = schedulesByDay[d] || [];
              const theme = DAY_COLORS[d];

              return (
                <div
                  key={d}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col"
                >
                  {/* Card Day Header */}
                  <div
                    className={`px-4 py-3 border-b flex items-center justify-between ${theme.bg} ${theme.border}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-sm ${theme.text}`}>
                        {DAY_LABELS[d]}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        ({items.length} sesi)
                      </span>
                    </div>
                    {canCreate && (
                      <button
                        onClick={() => {
                          setEditingItem(null);
                          setIsModalOpen(true);
                        }}
                        className="text-[11px] text-emerald-700 hover:underline font-semibold flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Tambah</span>
                      </button>
                    )}
                  </div>

                  {/* Card Content List */}
                  <div className="p-3 divide-y divide-slate-100 flex-1 space-y-2.5">
                    {items.length === 0 ? (
                      <div className="py-8 text-center text-slate-400 text-xs">
                        Tidak ada sesi belajar pada hari {DAY_LABELS[d]}
                      </div>
                    ) : (
                      items.map((item) => (
                        <div key={item.id} className="pt-2.5 first:pt-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 font-mono font-bold text-[11px] rounded-md mb-1">
                                {item.startTime} - {item.endTime}
                              </span>
                              <h4 className="font-bold text-sm text-slate-800">
                                {item.subject?.name || 'Mata Pelajaran'}
                              </h4>
                            </div>

                            <div className="flex items-center gap-1">
                              {canUpdate && (
                                <button
                                  onClick={() => {
                                    setEditingItem(item);
                                    setIsModalOpen(true);
                                  }}
                                  className="p-1 text-slate-400 hover:text-emerald-600 rounded-md transition-colors"
                                  title="Edit"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                              )}
                              {canDelete && (
                                <button
                                  onClick={() => setDeleteTarget(item)}
                                  className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                                  title="Hapus"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="mt-1.5 space-y-1 text-xs text-slate-500">
                            <div className="flex items-center gap-1.5">
                              <School className="w-3 h-3 text-indigo-500 shrink-0" />
                              <span>{item.classGroup?.name || 'Kelas'}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <GraduationCap className="w-3 h-3 text-amber-500 shrink-0" />
                              <span>
                                {item.teacher?.employee?.fullName || item.teacher?.teacherCode || 'Guru'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <DoorOpen className="w-3 h-3 text-teal-600 shrink-0" />
                              <span className="font-medium text-slate-700">
                                {item.room?.name || 'Ruangan'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
        schedule={editingItem}
        classSubjects={classSubjects}
        classes={classes}
        rooms={rooms}
      />

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-800">Konfirmasi Hapus Jadwal</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Apakah Anda yakin ingin menghapus jadwal pelajaran{' '}
              <strong className="text-slate-800">{deleteTarget.subject?.name || 'Mata Pelajaran'}</strong>{' '}
              pada kelas <strong className="text-slate-800">{deleteTarget.classGroup?.name}</strong>{' '}
              hari {DAY_LABELS[deleteTarget.dayOfWeek]} ({deleteTarget.startTime} - {deleteTarget.endTime})?
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-colors flex items-center gap-2 shadow-xs"
              >
                {isDeleting && (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                <span>Hapus Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
