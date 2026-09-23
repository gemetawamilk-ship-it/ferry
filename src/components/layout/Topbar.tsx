import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Menu, Bell, Shield, LogOut, CheckCircle2, AlertTriangle, Building, ChevronDown } from 'lucide-react';

interface TopbarProps {
  onOpenMobile: () => void;
  currentTab: string;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenMobile, currentTab }) => {
  const { user, tenant, roleDefinition, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const tabTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: {
      title: `Dashboard ${roleDefinition?.name || 'Eksekutif'}`,
      subtitle: 'Ringkasan operasional dan indikator utama pesantren hari ini',
    },
    users: {
      title: 'Manajemen Pengguna & Akun',
      subtitle: 'Pengelolaan akun pimpinan, staf, ustadz, musyrif, santri, dan wali',
    },
    roles: {
      title: 'Matriks Role & Hak Akses (RBAC)',
      subtitle: 'Konfigurasi 10 peran dan cakupan perizinan granular data',
    },
    tenants: {
      title: 'Isolasi Multi-Tenant Lembaga',
      subtitle: 'Verifikasi isolasi data antar pondok pesantren dan status langganan',
    },
    audit: {
      title: 'Log Audit & Jejak Aktivitas',
      subtitle: 'Rekam jejak forensik keamanan: siapa, kapan, dan perubahan data apa',
    },
    profile: {
      title: 'Profil & Izin Pengguna',
      subtitle: 'Detail otorisasi akun dan batasan cakupan data aktif Anda',
    },
    institution: {
      title: 'Data Lembaga Pesantren',
      subtitle: 'Profil identitas resmi, legalitas kementerian, alamat, dan kontak pondok',
    },
    'academic-years': {
      title: 'Manajemen Tahun Ajaran',
      subtitle: 'Periode kalender akademik dengan proteksi 1 tahun ajaran aktif berjalan',
    },
    programs: {
      title: 'Program Pendidikan & Kurikulum',
      subtitle: 'Manajemen peminatan santri: Reguler, Tahfidz, Kitab Kuning, dan Bahasa',
    },
    dormitories: {
      title: 'Master Data Asrama & Kamar',
      subtitle: 'Pengelolaan gedung hunian, blok asrama, penetapan musyrif, kapasitas dan pemeliharaan kamar',
    },
    staff: {
      title: 'Master Data SDM: Guru & Musyrif',
      subtitle: 'Pengelolaan identitas pendidik (Asatidz), pembina asrama, dan penautan akun login pengguna',
    },
    students: {
      title: 'Master Data Santri & Wali Santri',
      subtitle: 'Direktori santri terdaftar, biodata orang tua / wali, dan status kependidikan aktif',
    },
    classes: {
      title: 'Master Data Kelas & Rombel',
      subtitle: 'Pengorganisasian rombongan belajar, wali kelas (asatidz), dan penempatan santri per tahun ajaran',
    },
  };

  const currentInfo = tabTitles[currentTab] || {
    title: 'E-PESANTREN 360',
    subtitle: 'Satu Sistem untuk Mengelola Seluruh Kehidupan Pesantren',
  };

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-2xs">
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobile}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-hidden"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>{currentInfo.title}</span>
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block">{currentInfo.subtitle}</p>
          </div>
        </div>

        {/* Right: Tenant badge, Notifications, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Tenant Pill */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200/80 rounded-lg text-xs">
            <Building className="w-3.5 h-3.5 text-emerald-700" />
            <div className="text-left">
              <span className="font-semibold text-emerald-950 block leading-tight">
                {tenant?.name.replace('Pesantren ', '').replace('Pondok Pesantren ', '')}
              </span>
              <span className="text-[10px] text-emerald-700 block">ID: {tenant?.code}</span>
            </div>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Notifikasi Operasional"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Notifikasi Pesantren</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                    3 Baru
                  </span>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 text-xs">
                  <div className="p-3 hover:bg-slate-50 transition-colors flex gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-800">Presensi Subuh 100% Tercatat</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">Asrama Umar bin Khattab selesai input.</p>
                      <span className="text-[10px] text-slate-400">10 menit lalu</span>
                    </div>
                  </div>
                  <div className="p-3 hover:bg-slate-50 transition-colors flex gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-800">Permohonan Izin Keluar Pending</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">Santri Ahmad Farhan butuh persetujuan musyrif.</p>
                      <span className="text-[10px] text-slate-400">25 menit lalu</span>
                    </div>
                  </div>
                  <div className="p-3 hover:bg-slate-50 transition-colors flex gap-2.5">
                    <Shield className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-800">Sistem Audit Aman</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">Integritas data multi-tenant terverifikasi.</p>
                      <span className="text-[10px] text-slate-400">1 jam lalu</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                {user?.fullName.charAt(0) || 'U'}
              </div>
              <div className="text-left hidden sm:block">
                <span className="text-xs font-semibold text-slate-900 block leading-tight truncate max-w-[120px]">
                  {user?.fullName}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {roleDefinition?.name.split(' ')[0] || user?.role}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900 truncate">{user?.fullName}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                  <div className="mt-1.5 inline-block px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-mono rounded font-semibold">
                    Scope: {user?.scope}
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      logout();
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Keluar Sistem (Logout)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
