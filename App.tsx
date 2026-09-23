import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { RoleSwitcherBar } from './components/layout/RoleSwitcherBar';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { DirekturDashboard } from './components/dashboard/DirekturDashboard';
import { BendaharaDashboard } from './components/dashboard/BendaharaDashboard';
import { PengajarDashboard } from './components/dashboard/PengajarDashboard';
import { MusyrifDashboard } from './components/dashboard/MusyrifDashboard';
import { SantriWaliDashboard } from './components/dashboard/SantriWaliDashboard';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { SuperAdminDashboard } from './components/dashboard/SuperAdminDashboard';
import { UserManagement } from './components/users/UserManagement';
import { RolesPermissionsMatrix } from './components/roles/RolesPermissionsMatrix';
import { TenantManagement } from './components/tenants/TenantManagement';
import { AuditLogView } from './components/audit/AuditLogView';
import { ProfileView } from './components/profile/ProfileView';
import { InstitutionProfileView } from './components/institution/InstitutionProfileView';
import { AcademicYearManagement } from './components/academic-years/AcademicYearManagement';
import { ProgramManagement } from './components/programs/ProgramManagement';
import { DormitoryManagement } from './components/dormitories/DormitoryManagement';
import { StaffManagement } from './components/sdm/StaffManagement';
import { StudentManagement } from './components/students/StudentManagement';
import { ClassManagement } from './components/classes/ClassManagement';
import { SubjectManagement } from './components/subjects/SubjectManagement';
import { CurriculumManagement } from './components/curriculum/CurriculumManagement';
import { ScheduleManagement } from './components/schedules/ScheduleManagement';
import { AttendanceManagement } from './components/attendance/AttendanceManagement';
import { AccessDenied } from './components/common/AccessDenied';
import { api } from './services/api';
import { DashboardData } from './types';
import { RefreshCw } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { user, isAuthenticated, hasPermission } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loadingDashboard, setLoadingDashboard] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setLoadingDashboard(true);
      api
        .getDashboardStats()
        .then((res) => {
          setDashboardData(res.data);
        })
        .catch((err: any) => {
          console.error('Error fetching dashboard stats:', err);
        })
        .finally(() => {
          setLoadingDashboard(false);
        });
    }
  }, [isAuthenticated, user?.role, user?.tenantId]);

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const renderDashboardByRole = () => {
    switch (user?.role) {
      case 'DIREKTUR':
        return <DirekturDashboard data={dashboardData} />;
      case 'BENDAHARA':
        return <BendaharaDashboard data={dashboardData} />;
      case 'PENGAJAR':
        return <PengajarDashboard data={dashboardData} />;
      case 'MUSYRIF':
        return <MusyrifDashboard data={dashboardData} />;
      case 'SANTRI':
      case 'WALI_SANTRI':
        return <SantriWaliDashboard />;
      case 'SUPER_ADMIN':
        return <SuperAdminDashboard data={dashboardData} onNavigateTab={setCurrentTab} />;
      case 'ADMIN':
      case 'MANAGER':
      case 'KARYAWAN':
      default:
        return <AdminDashboard data={dashboardData} onNavigateTab={setCurrentTab} />;
    }
  };

  const renderMainContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return renderDashboardByRole();

      case 'users':
        if (!hasPermission('user.read')) {
          return (
            <AccessDenied
              requiredPermission="user.read"
              onBack={() => setCurrentTab('dashboard')}
            />
          );
        }
        return <UserManagement />;

      case 'roles':
        return <RolesPermissionsMatrix />;

      case 'tenants':
        return <TenantManagement />;

      case 'audit':
        if (!hasPermission('audit.read')) {
          return (
            <AccessDenied
              requiredPermission="audit.read"
              onBack={() => setCurrentTab('dashboard')}
            />
          );
        }
        return <AuditLogView />;

      case 'profile':
        return <ProfileView />;

      case 'institution':
        if (!hasPermission('institution.view')) {
          return (
            <AccessDenied
              requiredPermission="institution.view"
              onBack={() => setCurrentTab('dashboard')}
            />
          );
        }
        return <InstitutionProfileView />;

      case 'academic-years':
        if (!hasPermission('academic_year.view')) {
          return (
            <AccessDenied
              requiredPermission="academic_year.view"
              onBack={() => setCurrentTab('dashboard')}
            />
          );
        }
        return <AcademicYearManagement />;

      case 'programs':
        if (!hasPermission('program.view')) {
          return (
            <AccessDenied
              requiredPermission="program.view"
              onBack={() => setCurrentTab('dashboard')}
            />
          );
        }
        return <ProgramManagement />;

      case 'dormitories':
        if (!hasPermission('dormitory.view') && !hasPermission('building.view') && !hasPermission('room.view')) {
          return (
            <AccessDenied
              requiredPermission="dormitory.view"
              onBack={() => setCurrentTab('dashboard')}
            />
          );
        }
        return <DormitoryManagement />;

      case 'staff':
        if (!hasPermission('employee.view') && !hasPermission('teacher.view') && !hasPermission('musyrif.view')) {
          return (
            <AccessDenied
              requiredPermission="employee.view"
              onBack={() => setCurrentTab('dashboard')}
            />
          );
        }
        return <StaffManagement />;

      case 'students':
        if (!hasPermission('student.view') && !hasPermission('parent.view')) {
          return (
            <AccessDenied
              requiredPermission="student.view"
              onBack={() => setCurrentTab('dashboard')}
            />
          );
        }
        return <StudentManagement />;

      case 'classes':
        if (!hasPermission('class.view')) {
          return (
            <AccessDenied
              requiredPermission="class.view"
              onBack={() => setCurrentTab('dashboard')}
            />
          );
        }
        return <ClassManagement />;

      case 'subjects':
        if (!hasPermission('subject.view')) {
          return (
            <AccessDenied
              requiredPermission="subject.view"
              onBack={() => setCurrentTab('dashboard')}
            />
          );
        }
        return <SubjectManagement />;

      case 'curriculum':
        if (!hasPermission('class_subject.view')) {
          return (
            <AccessDenied
              requiredPermission="class_subject.view"
              onBack={() => setCurrentTab('dashboard')}
            />
          );
        }
        return <CurriculumManagement />;

      case 'schedules':
        if (!hasPermission('schedule.view')) {
          return (
            <AccessDenied
              requiredPermission="schedule.view"
              onBack={() => setCurrentTab('dashboard')}
            />
          );
        }
        return <ScheduleManagement />;

      case 'attendance':
        if (!hasPermission('attendance.view')) {
          return (
            <AccessDenied
              requiredPermission="attendance.view"
              onBack={() => setCurrentTab('dashboard')}
            />
          );
        }
        return <AttendanceManagement />;

      default:
        return renderDashboardByRole();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased selection:bg-emerald-500 selection:text-white">
      {/* Quick QA Role Switcher Bar at the top */}
      <RoleSwitcherBar />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Dynamic RBAC Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <Topbar onOpenMobile={() => setMobileMenuOpen(true)} currentTab={currentTab} />

          <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
            {loadingDashboard && currentTab === 'dashboard' && !dashboardData ? (
              <div className="flex items-center justify-center p-16">
                <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
              </div>
            ) : (
              renderMainContent()
            )}
          </main>

          <footer className="py-4 px-6 border-t border-slate-200/80 text-center text-xs text-slate-500 bg-white">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
              <span>E-PESANTREN 360 © 2026 • Satu Sistem untuk Mengelola Seluruh Kehidupan Pesantren</span>
              <span className="font-mono text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                FASE 1: FOUNDATION (MULTI-TENANT & RBAC READY)
              </span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}

export default App;
