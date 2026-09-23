import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Building2,
  FileClock,
  UserCheck,
  GraduationCap,
  BookOpen,
  CalendarCheck,
  HeartHandshake,
  Wallet,
  Settings,
  LogOut,
  X,
  Lock,
  BedDouble,
  School,
  Layers,
  Calendar,
  Award,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  mobileOpen,
  onCloseMobile,
}) => {
  const { user, tenant, roleDefinition, hasPermission, logout } = useAuth();

  const handleNavClick = (tabId: string, disabledPhase?: string) => {
    if (disabledPhase) {
      alert(`Modul ini merupakan bagian dari ${disabledPhase}. Sesuai instruksi Product Owner, pengembangan difokuskan tuntas pada FASE 1 - FOUNDATION terlebih dahulu.`);
      return;
    }
    onSelectTab(tabId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-900/30">
              <span className="text-lg">360</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-base tracking-tight">E-PESANTREN</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-400 font-mono px-1.5 py-0.2 rounded font-semibold">360</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium truncate max-w-[150px]">
                {tenant?.name || 'SaaS Pesantren'}
              </p>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tenant Active Pill */}
        <div className="px-5 py-3 bg-slate-850/60 border-b border-slate-800/60">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Status Langganan:</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              {tenant?.plan || 'PRO'} PLAN
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 text-sm">
          {/* UTAMA */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 tracking-wider">
              MENU UTAMA
            </div>
            <div className="space-y-1">
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  currentTab === 'dashboard'
                    ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                <span>Dashboard ({roleDefinition?.name.split(' ')[0] || user?.role})</span>
              </button>
            </div>
          </div>

          {/* FASE 1: FOUNDATION & SECURITY */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 tracking-wider">
              FONDASI & KEAMANAN (FASE 1)
            </div>
            <div className="space-y-1">
              {hasPermission('user.view') && (
                <button
                  onClick={() => handleNavClick('users')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'users'
                      ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>Manajemen Pengguna</span>
                </button>
              )}

              {hasPermission('role.view') && (
                <button
                  onClick={() => handleNavClick('roles')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'roles'
                      ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Matriks Role & Hak Akses</span>
                </button>
              )}

              {hasPermission('tenant.view') && (
                <button
                  onClick={() => handleNavClick('tenants')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'tenants'
                      ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-blue-400" />
                  <span>Isolasi Multi-Tenant</span>
                </button>
              )}

              {hasPermission('audit.view') && (
                <button
                  onClick={() => handleNavClick('audit')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'audit'
                      ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <FileClock className="w-4 h-4 text-purple-400" />
                  <span>Log Audit Sistem</span>
                </button>
              )}

              <button
                onClick={() => handleNavClick('profile')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  currentTab === 'profile'
                    ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <UserCheck className="w-4 h-4 text-teal-400" />
                <span>Profil & Izin Aktif</span>
              </button>
            </div>
          </div>

          {/* FASE 2: MASTER DATA PESANTREN (TAHAP 1, 2, 3, 4 & 5) */}
          <div>
            <div className="px-3 mb-2 flex items-center justify-between text-[11px] font-semibold text-slate-400 tracking-wider">
              <span>MASTER DATA (FASE 2)</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-bold">
                TAHAP 2.5
              </span>
            </div>
            <div className="space-y-1">
              {hasPermission('institution.view') && (
                <button
                  onClick={() => handleNavClick('institution')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'institution'
                      ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <span>Data Lembaga</span>
                </button>
              )}

              {hasPermission('academic_year.view') && (
                <button
                  onClick={() => handleNavClick('academic-years')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'academic-years'
                      ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <CalendarCheck className="w-4 h-4 text-sky-400" />
                  <span>Tahun Ajaran</span>
                </button>
              )}

              {hasPermission('program.view') && (
                <button
                  onClick={() => handleNavClick('programs')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'programs'
                      ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>Program Pendidikan</span>
                </button>
              )}

              {(hasPermission('dormitory.view') || hasPermission('building.view') || hasPermission('room.view')) && (
                <button
                  id="nav-dormitories-btn"
                  onClick={() => handleNavClick('dormitories')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'dormitories'
                      ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <BedDouble className="w-4 h-4 text-teal-400" />
                  <span>Asrama & Kamar</span>
                </button>
              )}

              {(hasPermission('employee.view') || hasPermission('teacher.view') || hasPermission('musyrif.view')) && (
                <button
                  id="nav-staff-btn"
                  onClick={() => handleNavClick('staff')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'staff'
                      ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-emerald-400" />
                  <span>Guru & Musyrif (SDM)</span>
                </button>
              )}

              {(hasPermission('student.view') || hasPermission('parent.view')) && (
                <button
                  id="nav-students-btn"
                  onClick={() => handleNavClick('students')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'students'
                      ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span>Santri & Wali Santri</span>
                </button>
              )}

              {hasPermission('class.view') && (
                <button
                  id="nav-classes-btn"
                  onClick={() => handleNavClick('classes')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'classes'
                      ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <School className="w-4 h-4 text-violet-400" />
                  <span>Kelas & Rombel</span>
                </button>
              )}

              {hasPermission('subject.view') && (
                <button
                  id="nav-subjects-btn"
                  onClick={() => handleNavClick('subjects')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'subjects'
                      ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>Mata Pelajaran</span>
                </button>
              )}

              {hasPermission('class_subject.view') && (
                <button
                  id="nav-curriculum-btn"
                  onClick={() => handleNavClick('curriculum')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'curriculum'
                      ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>Kurikulum Rombel</span>
                </button>
              )}

              {hasPermission('schedule.view') && (
                <button
                  id="nav-schedules-btn"
                  onClick={() => handleNavClick('schedules')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'schedules'
                      ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Calendar className="w-4 h-4 text-sky-400" />
                  <span>Jadwal Pelajaran</span>
                </button>
              )}
            </div>
          </div>

          {/* ROADMAP MODUL (Locked until next phases) */}
          <div>
            <div className="px-3 mb-2 flex items-center justify-between text-[11px] font-semibold text-slate-400 tracking-wider">
              <span>MODUL MENDATANG</span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">Fase 4+</span>
            </div>
            <div className="space-y-0.5">
              {[
                { name: 'Absensi Multi-Event', phase: 'Fase 4', icon: CalendarCheck },
                { name: 'Penilaian & Rapor Santri', phase: 'Fase 5', icon: Award },
                { name: 'Keuangan & Tagihan SPP', phase: 'Fase 6', icon: Wallet },
                { name: 'Pengaturan Lanjutan', phase: 'Fase 10', icon: Settings },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.name, item.phase)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-800/60 hover:text-slate-200 transition-colors group text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-400" />
                      <span>{item.name}</span>
                    </div>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" />
                      {item.phase}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-700/80 border border-emerald-500/30 flex items-center justify-center font-bold text-white text-sm">
              {user?.fullName.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.fullName}</p>
              <p className="text-[11px] text-emerald-400 truncate font-medium">
                {roleDefinition?.name || user?.role}
              </p>
            </div>
            <button
              onClick={() => logout()}
              title="Keluar dari Sistem (Logout)"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
