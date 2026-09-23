import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../services/api';
import { Employee, Teacher, Musyrif, StaffStats, User } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { StaffStatsOverview } from './StaffStatsOverview';
import { EmployeeList } from './EmployeeList';
import { TeacherList } from './TeacherList';
import { MusyrifList } from './MusyrifList';
import {
  Users,
  GraduationCap,
  HeartHandshake,
  LayoutDashboard,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

export const StaffManagement: React.FC = () => {
  const { user, tenant, hasPermission } = useAuth();

  const [activeTab, setActiveTab] = useState<'ringkasan' | 'pegawai' | 'guru' | 'musyrif'>('ringkasan');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<StaffStats | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [musyrifs, setMusyrifs] = useState<Musyrif[]>([]);
  const [tenantUsers, setTenantUsers] = useState<User[]>([]);

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
      const [statsRes, employeesRes, teachersRes, musyrifsRes, usersRes] = await Promise.allSettled([
        api.getStaffStats(),
        api.getEmployees(),
        api.getTeachers(),
        api.getMusyrifs(),
        api.getUsers(),
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value.success) {
        setStats(statsRes.value.data);
      }
      if (employeesRes.status === 'fulfilled' && employeesRes.value.success) {
        setEmployees(employeesRes.value.data);
      }
      if (teachersRes.status === 'fulfilled' && teachersRes.value.success) {
        setTeachers(teachersRes.value.data);
      }
      if (musyrifsRes.status === 'fulfilled' && musyrifsRes.value.success) {
        setMusyrifs(musyrifsRes.value.data);
      }
      if (usersRes.status === 'fulfilled' && usersRes.value.success) {
        setTenantUsers(usersRes.value.users);
      }
    } catch (err: any) {
      console.error('Failed loading SDM data:', err);
      showNotification('error', 'Gagal memuat data SDM.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Master Data SDM: Guru & Musyrif
            </h1>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
              FASE 2.3
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Pengelolaan identitas pendidik (Asatidz), musyrif asrama, dan sinkronisasi akun login di{' '}
            <span className="font-semibold text-emerald-700">{tenant?.name}</span>
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
          <span>Segarkan Data</span>
        </button>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl text-sm font-medium transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : 'bg-rose-50 text-rose-900 border border-rose-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('ringkasan')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'ringkasan'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Statistik SDM</span>
        </button>

        {hasPermission('employee.view') && (
          <button
            onClick={() => setActiveTab('pegawai')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'pegawai'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Master Pegawai</span>
            <span className="ml-1 text-xs px-2 py-0.2 rounded-full bg-slate-100 text-slate-700 font-semibold">
              {employees.length}
            </span>
          </button>
        )}

        {hasPermission('teacher.view') && (
          <button
            onClick={() => setActiveTab('guru')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'guru'
                ? 'border-sky-600 text-sky-700'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Guru & Pengajar</span>
            <span className="ml-1 text-xs px-2 py-0.2 rounded-full bg-sky-100 text-sky-800 font-semibold">
              {teachers.length}
            </span>
          </button>
        )}

        {hasPermission('musyrif.view') && (
          <button
            onClick={() => setActiveTab('musyrif')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'musyrif'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Musyrif Asrama</span>
            <span className="ml-1 text-xs px-2 py-0.2 rounded-full bg-teal-100 text-teal-800 font-semibold">
              {musyrifs.length}
            </span>
          </button>
        )}
      </div>

      {/* Tab Content Rendering */}
      <div>
        {activeTab === 'ringkasan' && (
          <StaffStatsOverview
            stats={stats}
            onSelectTab={(tab) => {
              if (tab === 'pegawai' && hasPermission('employee.view')) setActiveTab('pegawai');
              else if (tab === 'guru' && hasPermission('teacher.view')) setActiveTab('guru');
              else if (tab === 'musyrif' && hasPermission('musyrif.view')) setActiveTab('musyrif');
            }}
          />
        )}

        {activeTab === 'pegawai' && hasPermission('employee.view') && (
          <EmployeeList
            employees={employees}
            users={tenantUsers}
            onRefresh={loadData}
            showNotification={showNotification}
          />
        )}

        {activeTab === 'guru' && hasPermission('teacher.view') && (
          <TeacherList
            teachers={teachers}
            employees={employees}
            onRefresh={loadData}
            showNotification={showNotification}
          />
        )}

        {activeTab === 'musyrif' && hasPermission('musyrif.view') && (
          <MusyrifList
            musyrifs={musyrifs}
            employees={employees}
            onRefresh={loadData}
            showNotification={showNotification}
          />
        )}
      </div>
    </div>
  );
};
