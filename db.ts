import {
  Tenant,
  RoleType,
  RoleDefinition,
  Permission,
  User,
  AuditLog,
  DataScope,
  Institution,
  AcademicYear,
  Program,
  Building,
  Dormitory,
  Room,
  DormitorySupervisor,
  DormitoryStats,
  DormitoryGenderType,
  RoomGenderType,
  RoomStatus,
  SupervisorRoleType,
  Employee,
  Teacher,
  Musyrif,
  StaffStats,
  EmploymentStatus,
  EmployeeGender,
  EmployeeType,
  EmployeeStatus,
  TeachingStatus,
  MusyrifStatus,
  Student,
  Parent,
  StudentParent,
  StudentRoomHistory,
  StudentStats,
  StudentGender,
  StudentStatus,
  ParentRelationshipType,
  StudentParentRelationship,
  ClassGroup,
  StudentClassHistory,
  ClassGender,
  ClassStatus,
  StudentClassStatus,
  ClassStats,
  Subject,
  SubjectType,
  SubjectStatus,
  SubjectStats,
  ClassSubject,
  ClassSubjectStatus,
  ClassSubjectStats,
  DayOfWeek,
  Schedule,
  ScheduleStatus,
  ScheduleStats,
  AttendanceType,
  AttendanceCategory,
  AttendanceTypeStatus,
  AttendanceSession,
  AttendanceSessionStatus,
  AttendanceRecord,
  AttendanceRecordStatus,
  AttendanceSessionStats,
  AttendanceOverallStats,
} from './types';

export const PERMISSIONS_LIST: Permission[] = [
  // User & Tenant Management
  { id: 'p1', code: 'tenant.view', name: 'Lihat Data Lembaga/Tenant', module: 'Sistem', description: 'Melihat profil dan informasi pesantren' },
  { id: 'p2', code: 'tenant.manage', name: 'Kelola Lembaga/Tenant', module: 'Sistem', description: 'Mengubah konfigurasi dan langganan pesantren' },
  { id: 'p3', code: 'user.view', name: 'Lihat Data Pengguna', module: 'Pengguna', description: 'Melihat daftar akun dan profil pengguna' },
  { id: 'p4', code: 'user.create', name: 'Tambah Pengguna Baru', module: 'Pengguna', description: 'Membuat akun staf, santri, dan wali' },
  { id: 'p5', code: 'user.update', name: 'Ubah Data Pengguna', module: 'Pengguna', description: 'Memperbarui informasi atau status akun' },
  { id: 'p6', code: 'user.delete', name: 'Hapus/Nonaktifkan Pengguna', module: 'Pengguna', description: 'Menonaktifkan akun pengguna' },
  { id: 'p7', code: 'role.view', name: 'Lihat Matriks Role & Izin', module: 'Otorisasi', description: 'Melihat hak akses dan cakupan data' },
  { id: 'p8', code: 'role.manage', name: 'Ubah Izin Role', module: 'Otorisasi', description: 'Mengonfigurasi hak akses role' },
  
  // Santri & Master Data
  { id: 'p9', code: 'student.view', name: 'Lihat Data Santri', module: 'Master Data', description: 'Melihat direktori dan profil santri' },
  { id: 'p10', code: 'student.create', name: 'Tambah Santri', module: 'Master Data', description: 'Mendaftarkan santri baru' },
  { id: 'p11', code: 'student.update', name: 'Ubah Data Santri', module: 'Master Data', description: 'Memperbarui berkas dan data santri' },
  { id: 'p12', code: 'student.delete', name: 'Hapus Santri', module: 'Master Data', description: 'Menghapus atau mengarsipkan santri' },
  { id: 'p12ai', code: 'parent.view', name: 'Lihat Data Wali Santri', module: 'Master Data', description: 'Melihat direktori dan profil wali santri' },
  { id: 'p12aj', code: 'parent.create', name: 'Tambah Wali Santri', module: 'Master Data', description: 'Mendaftarkan data orang tua/wali santri baru' },
  { id: 'p12ak', code: 'parent.update', name: 'Ubah Data Wali Santri', module: 'Master Data', description: 'Memperbarui data kontak dan alamat wali santri' },
  { id: 'p12al', code: 'parent.delete', name: 'Hapus Wali Santri', module: 'Master Data', description: 'Menghapus data orang tua/wali santri' },

  { id: 'p12a', code: 'institution.view', name: 'Lihat Data Lembaga', module: 'Master Data', description: 'Melihat profil dan informasi resmi lembaga pesantren' },
  { id: 'p12b', code: 'institution.update', name: 'Ubah Data Lembaga', module: 'Master Data', description: 'Memperbarui profil, SK, kontak, dan logo pesantren' },
  { id: 'p12c', code: 'academic_year.view', name: 'Lihat Tahun Ajaran', module: 'Master Data', description: 'Melihat daftar tahun ajaran dan status aktif' },
  { id: 'p12d', code: 'academic_year.manage', name: 'Kelola Tahun Ajaran', module: 'Master Data', description: 'Menambah, mengubah, mengaktifkan, dan mengarsipkan tahun ajaran' },
  { id: 'p12e', code: 'program.view', name: 'Lihat Program Pendidikan', module: 'Master Data', description: 'Melihat daftar program pendidikan santri' },
  { id: 'p12f', code: 'program.manage', name: 'Kelola Program Pendidikan', module: 'Master Data', description: 'Menambah, mengubah, dan mengaktifkan program pendidikan' },

  // Master Data: Gedung, Asrama, Kamar & Musyrif (Phase 2.2)
  { id: 'p12g', code: 'building.view', name: 'Lihat Data Gedung', module: 'Master Data', description: 'Melihat daftar gedung sarana pesantren' },
  { id: 'p12h', code: 'building.create', name: 'Tambah Gedung Baru', module: 'Master Data', description: 'Mendaftarkan gedung sarana pesantren baru' },
  { id: 'p12i', code: 'building.update', name: 'Ubah Data Gedung', module: 'Master Data', description: 'Memperbarui informasi dan status gedung' },
  { id: 'p12j', code: 'building.delete', name: 'Hapus Gedung', module: 'Master Data', description: 'Menghapus gedung sarana pesantren' },

  { id: 'p12k', code: 'dormitory.view', name: 'Lihat Data Asrama', module: 'Master Data', description: 'Melihat daftar asrama dan kapasitas' },
  { id: 'p12l', code: 'dormitory.create', name: 'Tambah Asrama Baru', module: 'Master Data', description: 'Mendaftarkan unit asrama santri baru' },
  { id: 'p12m', code: 'dormitory.update', name: 'Ubah Data Asrama', module: 'Master Data', description: 'Memperbarui informasi & status asrama santri' },
  { id: 'p12n', code: 'dormitory.delete', name: 'Hapus Asrama', module: 'Master Data', description: 'Menghapus unit asrama santri' },

  { id: 'p12o', code: 'room.view', name: 'Lihat Data Kamar', module: 'Master Data', description: 'Melihat daftar kamar, lantai, kapasitas dan status' },
  { id: 'p12p', code: 'room.create', name: 'Tambah Kamar Baru', module: 'Master Data', description: 'Mendaftarkan kamar asrama baru' },
  { id: 'p12q', code: 'room.update', name: 'Ubah Data Kamar', module: 'Master Data', description: 'Memperbarui data kamar dan status maintenance' },
  { id: 'p12r', code: 'room.delete', name: 'Hapus Kamar', module: 'Master Data', description: 'Menghapus data kamar asrama santri' },

  { id: 'p12s', code: 'dormitory_supervisor.view', name: 'Lihat Musyrif Asrama', module: 'Master Data', description: 'Melihat penugasan musyrif dan penanggung jawab asrama' },
  { id: 'p12t', code: 'dormitory_supervisor.create', name: 'Tambah Musyrif Asrama', module: 'Master Data', description: 'Menugaskan musyrif atau penanggung jawab asrama' },
  { id: 'p12u', code: 'dormitory_supervisor.update', name: 'Ubah Musyrif Asrama', module: 'Master Data', description: 'Mengubah status musyrif utama/pendamping' },
  { id: 'p12v', code: 'dormitory_supervisor.delete', name: 'Hapus Musyrif Asrama', module: 'Master Data', description: 'Mencopot penugasan musyrif asrama' },

  // Master Data: SDM Pegawai, Guru & Musyrif (Phase 2.3)
  { id: 'p12w', code: 'employee.view', name: 'Lihat Data Pegawai', module: 'Master Data', description: 'Melihat direktori staf dan data personel pegawai pesantren' },
  { id: 'p12x', code: 'employee.create', name: 'Tambah Pegawai Baru', module: 'Master Data', description: 'Mendaftarkan pegawai/personel baru pesantren' },
  { id: 'p12y', code: 'employee.update', name: 'Ubah Data Pegawai', module: 'Master Data', description: 'Memperbarui data profil, jabatan dan akun pegawai' },
  { id: 'p12z', code: 'employee.delete', name: 'Hapus Pegawai', module: 'Master Data', description: 'Menghapus data pegawai pesantren' },

  { id: 'p12aa', code: 'teacher.view', name: 'Lihat Data Guru', module: 'Master Data', description: 'Melihat daftar guru dan tenaga pendidik pesantren' },
  { id: 'p12ab', code: 'teacher.create', name: 'Tambah Guru Baru', module: 'Master Data', description: 'Mendaftarkan guru/pengajar baru pesantren' },
  { id: 'p12ac', code: 'teacher.update', name: 'Ubah Data Guru', module: 'Master Data', description: 'Memperbarui spesialisasi dan status mengajar guru' },
  { id: 'p12ad', code: 'teacher.delete', name: 'Hapus Guru', module: 'Master Data', description: 'Menghapus data guru pesantren' },

  { id: 'p12ae', code: 'musyrif.view', name: 'Lihat Data Musyrif', module: 'Master Data', description: 'Melihat daftar musyrif dan pengasuh asrama' },
  { id: 'p12af', code: 'musyrif.create', name: 'Tambah Musyrif Baru', module: 'Master Data', description: 'Mendaftarkan musyrif baru pesantren' },
  { id: 'p12ag', code: 'musyrif.update', name: 'Ubah Data Musyrif', module: 'Master Data', description: 'Memperbarui data musyrif dan spesialisasi pembinaan' },
  { id: 'p12ah', code: 'musyrif.delete', name: 'Hapus Musyrif', module: 'Master Data', description: 'Menghapus data musyrif pesantren' },

  // Master Data: Kelas & Rombel (Phase 2.5)
  { id: 'p12ai', code: 'class.view', name: 'Lihat Data Kelas & Rombel', module: 'Master Data', description: 'Melihat direktori rombongan belajar dan santri terdaftar' },
  { id: 'p12aj', code: 'class.create', name: 'Tambah Kelas Baru', module: 'Master Data', description: 'Membuka rombel baru pada tahun ajaran aktif' },
  { id: 'p12ak', code: 'class.update', name: 'Ubah Data Kelas', module: 'Master Data', description: 'Memperbarui nama, kapasitas dan penugasan wali kelas' },
  { id: 'p12al', code: 'class.delete', name: 'Hapus Kelas', module: 'Master Data', description: 'Menghapus data rombel yang kosong' },
  { id: 'p12am', code: 'class.assign_student', name: 'Kelola Santri Rombel', module: 'Master Data', description: 'Menempatkan, memindahkan, dan mengeluarkan santri dari rombel' },

  // Master Data: Mata Pelajaran (Phase 3.1)
  { id: 'p12an', code: 'subject.view', name: 'Lihat Mata Pelajaran', module: 'Akademik', description: 'Melihat direktori mata pelajaran dan alokasi JPL' },
  { id: 'p12ao', code: 'subject.create', name: 'Tambah Mata Pelajaran', module: 'Akademik', description: 'Menambahkan mata pelajaran baru' },
  { id: 'p12ap', code: 'subject.update', name: 'Ubah Data Mata Pelajaran', module: 'Akademik', description: 'Memperbarui nama, jenis, dan beban JPL mata pelajaran' },
  { id: 'p12aq', code: 'subject.delete', name: 'Hapus Mata Pelajaran', module: 'Akademik', description: 'Menghapus mata pelajaran yang belum digunakan relasi akademik' },

  // Kurikulum Rombel (Phase 3.2)
  { id: 'p12ar', code: 'class_subject.view', name: 'Lihat Kurikulum Rombel', module: 'Akademik', description: 'Melihat alokasi mata pelajaran dan guru pengajar per rombel' },
  { id: 'p12as', code: 'class_subject.create', name: 'Tambah Kurikulum Rombel', module: 'Akademik', description: 'Menambahkan mata pelajaran dan penugasan guru pada rombel' },
  { id: 'p12at', code: 'class_subject.update', name: 'Ubah Kurikulum Rombel', module: 'Akademik', description: 'Memperbarui guru pengajar, JPL, dan status alokasi kurikulum rombel' },
  { id: 'p12au', code: 'class_subject.delete', name: 'Hapus Kurikulum Rombel', module: 'Akademik', description: 'Menghapus alokasi mata pelajaran dari rombel' },

  // Jadwal Pelajaran (Phase 3.3)
  { id: 'p12av', code: 'schedule.view', name: 'Lihat Jadwal Pelajaran', module: 'Akademik', description: 'Melihat jadwal kegiatan belajar mengajar per kelas, guru, dan ruangan' },
  { id: 'p12aw', code: 'schedule.create', name: 'Tambah Jadwal Pelajaran', module: 'Akademik', description: 'Menyusun alokasi waktu dan ruangan untuk mata pelajaran rombel' },
  { id: 'p12ax', code: 'schedule.update', name: 'Ubah Jadwal Pelajaran', module: 'Akademik', description: 'Memperbarui hari, jam, atau ruangan jadwal pelajaran' },
  { id: 'p12ay', code: 'schedule.delete', name: 'Hapus Jadwal Pelajaran', module: 'Akademik', description: 'Menghapus sesi jadwal pelajaran' },

  // Akademik & Jadwal
  { id: 'p13', code: 'academic.view', name: 'Lihat Akademik & Jadwal', module: 'Akademik', description: 'Melihat kurikulum, jadwal & kelas' },
  { id: 'p14', code: 'academic.manage', name: 'Kelola Akademik', module: 'Akademik', description: 'Mengatur kelas, kurikulum dan jadwal' },
  { id: 'p15', code: 'grade.view', name: 'Lihat Nilai', module: 'Akademik', description: 'Melihat nilai dan raport' },
  { id: 'p16', code: 'grade.update', name: 'Input & Edit Nilai', module: 'Akademik', description: 'Menginput nilai ujian dan hafalan' },

  // Absensi Multi-Event (Phase 3.4)
  { id: 'p17', code: 'attendance.view', name: 'Lihat Absensi', module: 'Absensi', description: 'Melihat sesi dan rekapitulasi kehadiran santri' },
  { id: 'p18', code: 'attendance.create', name: 'Buka Sesi & Catat Absensi', module: 'Absensi', description: 'Membuka sesi absensi baru dan mencatat presensi santri' },
  { id: 'p18b', code: 'attendance.update', name: 'Ubah Data Absensi', module: 'Absensi', description: 'Mengubah status presensi santri dan sesi absensi' },
  { id: 'p18c', code: 'attendance.delete', name: 'Hapus Sesi & Record Absensi', module: 'Absensi', description: 'Menghapus sesi absensi atau rekam kehadiran' },
  { id: 'p18d', code: 'attendance.manage', name: 'Kelola Jenis & Pengaturan Absensi', module: 'Absensi', description: 'Mengelola jenis absensi multi-event dan menutup sesi' },

  // Pengasuhan & Asrama
  { id: 'p19', code: 'parenting.view', name: 'Lihat Pengasuhan & Asrama', module: 'Pengasuhan', description: 'Melihat kamar, kegiatan dan pembinaan' },
  { id: 'p20', code: 'parenting.manage', name: 'Kelola Pengasuhan', module: 'Pengasuhan', description: 'Mengatur perizinan, pelanggaran & kamar' },

  // Keuangan
  { id: 'p21', code: 'finance.view', name: 'Lihat Keuangan', module: 'Keuangan', description: 'Melihat arus kas, tagihan dan piutang' },
  { id: 'p22', code: 'finance.create', name: 'Input Transaksi Keuangan', module: 'Keuangan', description: 'Mencatat pembayaran dan pengeluaran' },
  { id: 'p23', code: 'finance.approve', name: 'Persetujuan Keuangan', module: 'Keuangan', description: 'Menyetujui pencairan dana dan anggaran' },

  // Laporan & Audit
  { id: 'p24', code: 'report.view', name: 'Lihat Laporan Terpadu', module: 'Laporan', description: 'Melihat ringkasan eksekutif dan laporan' },
  { id: 'p25', code: 'report.export', name: 'Ekspor Dokumen Laporan', module: 'Laporan', description: 'Mengunduh laporan dalam PDF/Excel' },
  { id: 'p26', code: 'audit.view', name: 'Lihat Log Audit Sistem', module: 'Audit', description: 'Melihat rekam jejak aktivitas operasional' },
  { id: 'p27', code: 'settings.manage', name: 'Pengaturan Sistem', module: 'Sistem', description: 'Mengatur preferensi dan integrasi' },
];

export const ROLES_DEFINITIONS: Record<RoleType, RoleDefinition> = {
  SUPER_ADMIN: {
    code: 'SUPER_ADMIN',
    name: 'Super Admin',
    description: 'Akses penuh platform SaaS lintas seluruh lembaga/pesantren',
    defaultScope: 'GLOBAL',
    permissions: PERMISSIONS_LIST.map((p) => p.code),
  },
  DIREKTUR: {
    code: 'DIREKTUR',
    name: 'Direktur / Pengasuh Pesantren',
    description: 'Pimpinan tertinggi pesantren, pengawas eksekutif & persetujuan global',
    defaultScope: 'GLOBAL',
    permissions: [
      'tenant.view',
      'institution.view',
      'institution.update',
      'academic_year.view',
      'academic_year.manage',
      'program.view',
      'building.view',
      'building.create',
      'building.update',
      'building.delete',
      'dormitory.view',
      'dormitory.create',
      'dormitory.update',
      'dormitory.delete',
      'room.view',
      'room.create',
      'room.update',
      'room.delete',
      'dormitory_supervisor.view',
      'dormitory_supervisor.create',
      'dormitory_supervisor.update',
      'dormitory_supervisor.delete',
      'employee.view',
      'employee.create',
      'employee.update',
      'employee.delete',
      'teacher.view',
      'teacher.create',
      'teacher.update',
      'teacher.delete',
      'musyrif.view',
      'musyrif.create',
      'musyrif.update',
      'musyrif.delete',
      'user.view',
      'student.view',
      'parent.view',
      'academic.view',
      'grade.view',
      'attendance.view',
      'attendance.create',
      'attendance.update',
      'attendance.delete',
      'attendance.manage',
      'parenting.view',
      'finance.view',
      'finance.approve',
      'report.view',
      'report.export',
      'audit.view',
      'class.view',
      'subject.view',
      'class_subject.view',
      'schedule.view',
    ],
  },
  MANAGER: {
    code: 'MANAGER',
    name: 'Manager Operasional',
    description: 'Kepala departemen operasional, mengelola staf dan unit divisi',
    defaultScope: 'DEPARTMENT',
    permissions: [
      'institution.view',
      'academic_year.view',
      'program.view',
      'building.view',
      'dormitory.view',
      'room.view',
      'dormitory_supervisor.view',
      'dormitory_supervisor.create',
      'dormitory_supervisor.update',
      'employee.view',
      'employee.create',
      'employee.update',
      'teacher.view',
      'teacher.create',
      'teacher.update',
      'musyrif.view',
      'musyrif.create',
      'musyrif.update',
      'user.view',
      'student.view',
      'parent.view',
      'academic.view',
      'attendance.view',
      'attendance.create',
      'attendance.update',
      'attendance.delete',
      'attendance.manage',
      'parenting.view',
      'parenting.manage',
      'report.view',
    ],
  },
  ADMIN: {
    code: 'ADMIN',
    name: 'Administrator Pesantren',
    description: 'Pengelola teknis administrasi, pendaftaran, akun pengguna & master data',
    defaultScope: 'GLOBAL',
    permissions: [
      'tenant.view',
      'institution.view',
      'institution.update',
      'academic_year.view',
      'academic_year.manage',
      'program.view',
      'program.manage',
      'building.view',
      'building.create',
      'building.update',
      'building.delete',
      'dormitory.view',
      'dormitory.create',
      'dormitory.update',
      'dormitory.delete',
      'room.view',
      'room.create',
      'room.update',
      'room.delete',
      'dormitory_supervisor.view',
      'dormitory_supervisor.create',
      'dormitory_supervisor.update',
      'dormitory_supervisor.delete',
      'employee.view',
      'employee.create',
      'employee.update',
      'employee.delete',
      'teacher.view',
      'teacher.create',
      'teacher.update',
      'teacher.delete',
      'musyrif.view',
      'musyrif.create',
      'musyrif.update',
      'musyrif.delete',
      'user.view',
      'user.create',
      'user.update',
      'user.delete',
      'role.view',
      'student.view',
      'student.create',
      'student.update',
      'student.delete',
      'parent.view',
      'parent.create',
      'parent.update',
      'parent.delete',
      'academic.view',
      'academic.manage',
      'attendance.view',
      'attendance.create',
      'attendance.update',
      'attendance.delete',
      'attendance.manage',
      'parenting.view',
      'parenting.manage',
      'report.view',
      'audit.view',
      'class.view',
      'class.create',
      'class.update',
      'class.delete',
      'class.assign_student',
      'subject.view',
      'subject.create',
      'subject.update',
      'subject.delete',
      'class_subject.view',
      'class_subject.create',
      'class_subject.update',
      'class_subject.delete',
      'schedule.view',
      'schedule.create',
      'schedule.update',
      'schedule.delete',
    ],
  },
  BENDAHARA: {
    code: 'BENDAHARA',
    name: 'Bendahara Pesantren',
    description: 'Pengelola arus kas, penerimaan SPP, tagihan, dan pengeluaran operasional',
    defaultScope: 'GLOBAL',
    permissions: [
      'institution.view',
      'academic_year.view',
      'student.view',
      'parent.view',
      'finance.view',
      'finance.create',
      'report.view',
      'report.export',
      'audit.view',
    ],
  },
  PENGAJAR: {
    code: 'PENGAJAR',
    name: 'Guru / Ustadz Pengajar',
    description: 'Tenaga pendidik kelas & halaqah, presensi mengajar, pengisian nilai santri',
    defaultScope: 'ASSIGNED',
    permissions: [
      'institution.view',
      'academic_year.view',
      'program.view',
      'employee.view',
      'teacher.view',
      'academic.view',
      'grade.view',
      'grade.update',
      'attendance.view',
      'attendance.create',
      'attendance.update',
      'student.view',
      'parent.view',
      'class.view',
      'subject.view',
      'class_subject.view',
      'schedule.view',
    ],
  },
  MUSYRIF: {
    code: 'MUSYRIF',
    name: 'Musyrif / Pengasuh Asrama',
    description: 'Pengasuh harian asrama, pembina kedisiplinan, absensi shalat & perizinan',
    defaultScope: 'ASSIGNED',
    permissions: [
      'institution.view',
      'academic_year.view',
      'building.view',
      'dormitory.view',
      'room.view',
      'dormitory_supervisor.view',
      'employee.view',
      'musyrif.view',
      'student.view',
      'parent.view',
      'attendance.view',
      'attendance.create',
      'attendance.update',
      'parenting.view',
      'parenting.manage',
    ],
  },
  KARYAWAN: {
    code: 'KARYAWAN',
    name: 'Staf / Karyawan Umum',
    description: 'Staf sarana prasarana, operasional kantor, atau logistik',
    defaultScope: 'OWN',
    permissions: [
      'institution.view',
      'academic_year.view',
      'building.view',
      'dormitory.view',
      'room.view',
      'attendance.view',
      'attendance.create',
    ],
  },
  SANTRI: {
    code: 'SANTRI',
    name: 'Santri / Pelajar',
    description: 'Pelajar pesantren, akses jadwal pribadi, catatan hafalan & saldo wallet',
    defaultScope: 'OWN',
    permissions: [
      'institution.view',
      'academic_year.view',
      'dormitory.view',
      'room.view',
      'academic.view',
      'grade.view',
      'attendance.view',
      'parenting.view',
      'class.view',
      'subject.view',
      'class_subject.view',
      'schedule.view',
    ],
  },
  WALI_SANTRI: {
    code: 'WALI_SANTRI',
    name: 'Wali Santri / Orang Tua',
    description: 'Akses khusus memantau perkembangan, kehadiran, tagihan & kesehatan anak',
    defaultScope: 'CHILD',
    permissions: [
      'institution.view',
      'academic_year.view',
      'dormitory.view',
      'room.view',
      'student.view',
      'parent.view',
      'grade.view',
      'attendance.view',
      'parenting.view',
      'finance.view',
      'class.view',
      'subject.view',
      'class_subject.view',
      'schedule.view',
    ],
  },
};

export const INITIAL_TENANTS: Tenant[] = [
  {
    id: 'ten_darulmusthafa',
    code: 'darulmusthafa',
    name: 'Pesantren Darul Musthafa Al-Islamiyah',
    tagline: 'Mencetak Generasi Ulama Rabbani Berakhlakul Karimah',
    address: 'Jl. Pesantren Luhur No. 12, Cisarua',
    city: 'Bogor, Jawa Barat',
    phone: '+62 251 8254 991',
    email: 'info@darulmusthafa.sch.id',
    plan: 'PRO',
    status: 'ACTIVE',
    totalStudents: 1284,
    totalTeachers: 84,
    createdAt: '2025-01-10T08:00:00Z',
  },
  {
    id: 'ten_alhidayah',
    code: 'alhidayah',
    name: 'Pondok Pesantren Al-Hidayah Modern',
    tagline: 'Berilmu Amaliyah, Beramal Ilmiyah',
    address: 'Jl. Raya Salabintana KM 7',
    city: 'Sukabumi, Jawa Barat',
    phone: '+62 266 2210 445',
    email: 'sekretariat@alhidayah-bs.com',
    plan: 'ENTERPRISE',
    status: 'ACTIVE',
    totalStudents: 940,
    totalTeachers: 62,
    createdAt: '2025-02-01T08:00:00Z',
  },
  {
    id: 'ten_madinah',
    code: 'madinah',
    name: 'Madinah Islamic Boarding School',
    tagline: 'Tahfidzul Quran & International Studies',
    address: 'Jl. KH. Hasyim Asyari No. 88',
    city: 'Malang, Jawa Timur',
    phone: '+62 341 5567 12',
    email: 'admin@madinah-ibs.id',
    plan: 'BASIC',
    status: 'ACTIVE',
    totalStudents: 520,
    totalTeachers: 38,
    createdAt: '2025-03-15T08:00:00Z',
  },
];

export const INITIAL_USERS: User[] = [
  // Super Admin (SaaS Platform Owner)
  {
    id: 'usr_superadmin',
    tenantId: 'GLOBAL',
    username: 'superadmin',
    email: 'superadmin@epesantren360.id',
    passwordHash: 'password123',
    fullName: 'Ust. H. Ridwan Kamil, Lc., M.Ag',
    role: 'SUPER_ADMIN',
    scope: 'GLOBAL',
    phone: '+62 811 0000 001',
    status: 'ACTIVE',
    createdAt: '2025-01-01T00:00:00Z',
    lastLoginAt: '2026-09-20T21:00:00Z',
  },
  
  // TENANT 1: DARUL MUSTHAFA
  {
    id: 'usr_direktur_dm',
    tenantId: 'ten_darulmusthafa',
    username: 'direktur',
    email: 'direktur@darulmusthafa.sch.id',
    passwordHash: 'password123',
    fullName: 'K.H. Abdullah Gymnastiar Al-Hafidz',
    role: 'DIREKTUR',
    scope: 'GLOBAL',
    phone: '+62 812 3456 7890',
    status: 'ACTIVE',
    createdAt: '2025-01-10T09:00:00Z',
    lastLoginAt: '2026-09-20T20:15:00Z',
  },
  {
    id: 'usr_manager_dm',
    tenantId: 'ten_darulmusthafa',
    username: 'manager',
    email: 'manager@darulmusthafa.sch.id',
    passwordHash: 'password123',
    fullName: 'Ust. Fahmi Zulkarnain, S.Pd.I',
    role: 'MANAGER',
    scope: 'DEPARTMENT',
    phone: '+62 813 1122 3344',
    status: 'ACTIVE',
    assignedEntityName: 'Bidang Tarbiyah & Akademik',
    createdAt: '2025-01-11T10:00:00Z',
    lastLoginAt: '2026-09-20T19:30:00Z',
  },
  {
    id: 'usr_admin_dm',
    tenantId: 'ten_darulmusthafa',
    username: 'admin',
    email: 'admin@darulmusthafa.sch.id',
    passwordHash: 'password123',
    fullName: 'Ahmad Fauzi, S.Kom',
    role: 'ADMIN',
    scope: 'GLOBAL',
    phone: '+62 813 9988 7766',
    status: 'ACTIVE',
    createdAt: '2025-01-10T10:30:00Z',
    lastLoginAt: '2026-09-20T21:40:00Z',
  },
  {
    id: 'usr_bendahara_dm',
    tenantId: 'ten_darulmusthafa',
    username: 'bendahara',
    email: 'bendahara@darulmusthafa.sch.id',
    passwordHash: 'password123',
    fullName: 'Hj. Siti Mariam, S.E., M.M',
    role: 'BENDAHARA',
    scope: 'GLOBAL',
    phone: '+62 812 8877 6655',
    status: 'ACTIVE',
    createdAt: '2025-01-12T08:00:00Z',
    lastLoginAt: '2026-09-20T18:10:00Z',
  },
  {
    id: 'usr_guru_dm',
    tenantId: 'ten_darulmusthafa',
    username: 'guru',
    email: 'guru.ahmad@darulmusthafa.sch.id',
    passwordHash: 'password123',
    fullName: 'Ustadz Ahmad Al-Farisi, Lc.',
    role: 'PENGAJAR',
    scope: 'ASSIGNED',
    phone: '+62 815 4433 2211',
    status: 'ACTIVE',
    assignedEntityId: 'cls_3a',
    assignedEntityName: 'Kelas 3A (Nahwu & Tahfidz)',
    createdAt: '2025-01-15T09:00:00Z',
    lastLoginAt: '2026-09-20T16:45:00Z',
  },
  {
    id: 'usr_musyrif_dm',
    tenantId: 'ten_darulmusthafa',
    username: 'musyrif',
    email: 'musyrif.hassan@darulmusthafa.sch.id',
    passwordHash: 'password123',
    fullName: 'Ustadz Hassan As-Segaf',
    role: 'MUSYRIF',
    scope: 'ASSIGNED',
    phone: '+62 856 7788 9900',
    status: 'ACTIVE',
    assignedEntityId: 'dorm_umar',
    assignedEntityName: 'Asrama Umar bin Khattab (Kamar 01 - 08)',
    createdAt: '2025-01-15T09:30:00Z',
    lastLoginAt: '2026-09-20T17:20:00Z',
  },
  {
    id: 'usr_karyawan_dm',
    tenantId: 'ten_darulmusthafa',
    username: 'karyawan',
    email: 'karyawan@darulmusthafa.sch.id',
    passwordHash: 'password123',
    fullName: 'Bambang Supriyanto',
    role: 'KARYAWAN',
    scope: 'OWN',
    phone: '+62 878 1234 5678',
    status: 'ACTIVE',
    assignedEntityName: 'Divisi Logistik & Sarpras',
    createdAt: '2025-01-20T08:00:00Z',
    lastLoginAt: '2026-09-20T14:15:00Z',
  },
  {
    id: 'usr_santri_dm',
    tenantId: 'ten_darulmusthafa',
    username: 'santri',
    email: 'ahmad.muhammad@darulmusthafa.sch.id',
    passwordHash: 'password123',
    fullName: 'Ahmad Muhammad Faqih',
    role: 'SANTRI',
    scope: 'OWN',
    phone: '+62 899 1122 3344',
    status: 'ACTIVE',
    assignedEntityId: 'st_1042',
    assignedEntityName: 'NIS: 2026.03.1042 | Kelas 3A Aliyah',
    createdAt: '2025-02-01T08:00:00Z',
    lastLoginAt: '2026-09-20T19:00:00Z',
  },
  {
    id: 'usr_wali_dm',
    tenantId: 'ten_darulmusthafa',
    username: 'wali',
    email: 'wali.faqih@gmail.com',
    passwordHash: 'password123',
    fullName: 'H. Muhammad Yusuf (Wali dari Ahmad Muhammad)',
    role: 'WALI_SANTRI',
    scope: 'CHILD',
    phone: '+62 811 7766 5544',
    status: 'ACTIVE',
    assignedEntityId: 'st_1042',
    assignedEntityName: 'Santri: Ahmad Muhammad Faqih (Kelas 3A)',
    createdAt: '2025-02-01T08:30:00Z',
    lastLoginAt: '2026-09-20T20:00:00Z',
  },

  // TENANT 2: AL-HIDAYAH (Used to verify multi-tenant isolation!)
  {
    id: 'usr_admin_ah',
    tenantId: 'ten_alhidayah',
    username: 'admin_alhidayah',
    email: 'admin@alhidayah-bs.com',
    passwordHash: 'password123',
    fullName: 'Ust. Nurul Huda, S.Ag',
    role: 'ADMIN',
    scope: 'GLOBAL',
    phone: '+62 813 4455 6677',
    status: 'ACTIVE',
    createdAt: '2025-02-05T08:00:00Z',
    lastLoginAt: '2026-09-19T10:00:00Z',
  },
  {
    id: 'usr_direktur_ah',
    tenantId: 'ten_alhidayah',
    username: 'direktur_alhidayah',
    email: 'pimpinan@alhidayah-bs.com',
    passwordHash: 'password123',
    fullName: 'Dr. KH. Mahmud Yunus, M.A.',
    role: 'DIREKTUR',
    scope: 'GLOBAL',
    phone: '+62 812 6677 8899',
    status: 'ACTIVE',
    createdAt: '2025-02-05T08:30:00Z',
    lastLoginAt: '2026-09-19T11:00:00Z',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud_1',
    tenantId: 'ten_darulmusthafa',
    userId: 'usr_admin_dm',
    userName: 'Ahmad Fauzi, S.Kom',
    userRole: 'ADMIN',
    action: 'LOGIN',
    module: 'Authentication',
    entityName: 'Sesi Pengguna',
    entityId: 'usr_admin_dm',
    previousData: null,
    newData: 'Login berhasil via web desktop (Chrome 124, Windows 11)',
    ipAddress: '180.252.164.21',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    createdAt: '2026-09-20T21:40:12Z',
  },
  {
    id: 'aud_2',
    tenantId: 'ten_darulmusthafa',
    userId: 'usr_admin_dm',
    userName: 'Ahmad Fauzi, S.Kom',
    userRole: 'ADMIN',
    action: 'CREATE_USER',
    module: 'Pengguna',
    entityName: 'User Account',
    entityId: 'usr_guru_dm',
    previousData: null,
    newData: JSON.stringify({ fullName: 'Ustadz Ahmad Al-Farisi, Lc.', role: 'PENGAJAR', scope: 'ASSIGNED' }),
    ipAddress: '180.252.164.21',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    createdAt: '2026-09-20T20:50:00Z',
  },
  {
    id: 'aud_3',
    tenantId: 'ten_darulmusthafa',
    userId: 'usr_direktur_dm',
    userName: 'K.H. Abdullah Gymnastiar Al-Hafidz',
    userRole: 'DIREKTUR',
    action: 'APPROVE_DISBURSEMENT',
    module: 'Keuangan',
    entityName: 'Pencairan Anggaran',
    entityId: 'trx_exp_091',
    previousData: JSON.stringify({ status: 'PENDING_APPROVAL', amount: 12500000 }),
    newData: JSON.stringify({ status: 'APPROVED', amount: 12500000, note: 'Persetujuan Pengadaan Kitab Santri' }),
    ipAddress: '114.122.204.88',
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 17_4 like Mac OS X)',
    createdAt: '2026-09-20T20:18:40Z',
  },
  {
    id: 'aud_4',
    tenantId: 'ten_darulmusthafa',
    userId: 'usr_musyrif_dm',
    userName: 'Ustadz Hassan As-Segaf',
    userRole: 'MUSYRIF',
    action: 'ATTENDANCE_RECORD',
    module: 'Absensi',
    entityName: 'Presensi Shalat Subuh Berjamaah',
    entityId: 'att_subuh_20260920',
    previousData: null,
    newData: 'Terekam 142 santri hadir tepat waktu di Masjid Jami',
    ipAddress: '36.85.12.90',
    userAgent: 'Mozilla/5.0 (Linux; Android 14; SM-S928B)',
    createdAt: '2026-09-20T04:45:10Z',
  },
  {
    id: 'aud_5',
    tenantId: 'ten_alhidayah',
    userId: 'usr_admin_ah',
    userName: 'Ust. Nurul Huda, S.Ag',
    userRole: 'ADMIN',
    action: 'LOGIN',
    module: 'Authentication',
    entityName: 'Sesi Pengguna',
    entityId: 'usr_admin_ah',
    previousData: null,
    newData: 'Login sukses di Pesantren Al-Hidayah',
    ipAddress: '182.253.110.15',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    createdAt: '2026-09-19T10:00:00Z',
  },
];

export const INITIAL_INSTITUTIONS: Institution[] = [
  {
    id: 'inst_darulmusthafa',
    tenantId: 'ten_darulmusthafa',
    name: 'Pesantren Darul Musthafa Al-Islamiyah',
    officialName: 'Yayasan Pendidikan Islam Darul Musthafa Al-Islamiyah',
    npsn: '69987654',
    nsm: '131232010045',
    address: 'Jl. Pesantren Luhur No. 12',
    village: 'Tugu Selatan',
    district: 'Cisarua',
    city: 'Kabupaten Bogor',
    province: 'Jawa Barat',
    postalCode: '16750',
    phone: '+62 251 8254 991',
    email: 'sekretariat@darulmusthafa.sch.id',
    website: 'https://darulmusthafa.sch.id',
    logoUrl: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=160&auto=format&fit=crop&q=80',
    directorName: 'K.H. Abdullah Gymnastiar Al-Hafidz',
    foundedYear: 1998,
    description: 'Lembaga pendidikan Islam terpadu yang memadukan kurikulum salafiyah, tahfidzul quran 30 juz, dan penguasaan bahasa Arab secara aktif dan mandiri.',
    updatedAt: '2026-09-20T10:00:00Z',
  },
  {
    id: 'inst_alhidayah',
    tenantId: 'ten_alhidayah',
    name: 'Pondok Pesantren Al-Hidayah Modern',
    officialName: 'Yayasan Pesantren Al-Hidayah Sukabumi Mandiri',
    npsn: '69882211',
    nsm: '131232020088',
    address: 'Jl. Raya Salabintana KM 7',
    village: 'Sudajaya Girang',
    district: 'Sukabumi',
    city: 'Kabupaten Sukabumi',
    province: 'Jawa Barat',
    postalCode: '43151',
    phone: '+62 266 2210 445',
    email: 'sekretariat@alhidayah-bs.com',
    website: 'https://alhidayah-bs.com',
    logoUrl: '',
    directorName: 'K.H. Ahmad Syahid, M.Pd.I',
    foundedYear: 2004,
    description: 'Pesantren modern berwawasan global dengan pembinaan adab, sains terpadu, dan keterampilan kepemimpinan santri.',
    updatedAt: '2026-09-18T14:20:00Z',
  },
  {
    id: 'inst_madinah',
    tenantId: 'ten_madinah',
    name: 'Madinah Islamic Boarding School',
    officialName: 'Yayasan Bina Ummah Madinah Malang',
    npsn: '69774433',
    nsm: '131235730012',
    address: 'Jl. KH. Hasyim Asyari No. 88',
    village: 'Klojen',
    district: 'Klojen',
    city: 'Kota Malang',
    province: 'Jawa Timur',
    postalCode: '65111',
    phone: '+62 341 5567 12',
    email: 'admin@madinah-ibs.id',
    website: 'https://madinah-ibs.id',
    logoUrl: '',
    directorName: 'Dr. H. M. Zainal Arifin, Lc., MA',
    foundedYear: 2012,
    description: 'Islamic Boarding School berbasis tahfidz dan kurikulum internasional.',
    updatedAt: '2026-09-15T09:00:00Z',
  },
];

export const INITIAL_ACADEMIC_YEARS: AcademicYear[] = [
  // Darul Musthafa
  {
    id: 'ay_dm_2025',
    tenantId: 'ten_darulmusthafa',
    name: '2025/2026',
    startDate: '2025-07-15',
    endDate: '2026-06-20',
    status: 'ACTIVE',
    isActive: true,
    createdAt: '2025-06-01T08:00:00Z',
    updatedAt: '2026-06-25T10:00:00Z',
  },
  {
    id: 'ay_dm_2025_2026',
    tenantId: 'ten_darulmusthafa',
    name: '2025/2026',
    startDate: '2025-07-15',
    endDate: '2026-06-20',
    status: 'ACTIVE',
    isActive: true,
    createdAt: '2025-06-01T08:00:00Z',
    updatedAt: '2026-06-25T10:00:00Z',
  },
  {
    id: 'ay_dm_2026',
    tenantId: 'ten_darulmusthafa',
    name: '2026/2027',
    startDate: '2026-07-15',
    endDate: '2027-06-20',
    status: 'ACTIVE',
    isActive: true,
    createdAt: '2026-06-10T08:00:00Z',
    updatedAt: '2026-07-15T08:00:00Z',
  },
  // Al-Hidayah
  {
    id: 'ay_ah_2026',
    tenantId: 'ten_alhidayah',
    name: '2026/2027',
    startDate: '2026-07-10',
    endDate: '2027-06-25',
    status: 'ACTIVE',
    isActive: true,
    createdAt: '2026-06-05T08:00:00Z',
    updatedAt: '2026-07-10T08:00:00Z',
  },
];

export const INITIAL_PROGRAMS: Program[] = [
  // Darul Musthafa Programs
  {
    id: 'prog_dm_1',
    tenantId: 'ten_darulmusthafa',
    name: 'Program Reguler',
    code: 'REG',
    description: 'Program pendidikan formal diniyah & kurikulum nasional terpadu dengan asrama 24 jam.',
    status: 'ACTIVE',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-10T08:00:00Z',
  },
  {
    id: 'prog_dm_2',
    tenantId: 'ten_darulmusthafa',
    name: 'Program Tahfidz',
    code: 'TFZ',
    description: 'Program akselerasi hafalan Al-Quran 30 juz mutqin beserta sanad qiraah dan matan jazariyah.',
    status: 'ACTIVE',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-10T08:00:00Z',
  },
  {
    id: 'prog_dm_3',
    tenantId: 'ten_darulmusthafa',
    name: 'Program Bahasa Arab',
    code: 'ARB',
    description: 'Pendalaman tata bahasa Arab, Nahwu, Sharaf, Balaghah, dan bi’ah lughawiyah aktif.',
    status: 'ACTIVE',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-10T08:00:00Z',
  },
  {
    id: 'prog_dm_4',
    tenantId: 'ten_darulmusthafa',
    name: 'Program Takhasus',
    code: 'TKH',
    description: 'Kajian intensif kitab kuning turats salaf para ulama klasik dalam bidang fiqih dan ushul fiqih.',
    status: 'ACTIVE',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-10T08:00:00Z',
  },
  // Al-Hidayah Programs
  {
    id: 'prog_ah_1',
    tenantId: 'ten_alhidayah',
    name: 'Program Bilingual Sains & Diniyah',
    code: 'BSD',
    description: 'Program kombinasi sains modern dan tsaqafah islamiyah berbahasa Arab & Inggris.',
    status: 'ACTIVE',
    createdAt: '2025-02-01T08:00:00Z',
    updatedAt: '2025-02-01T08:00:00Z',
  },
];

// ==================== PHASE 2.2: INITIAL ASRAMA & KAMAR DATA ====================
export const INITIAL_BUILDINGS: Building[] = [
  // Darul Musthafa Buildings
  {
    id: 'bld_dm_1',
    tenantId: 'ten_darulmusthafa',
    name: 'Gedung Asrama Putra',
    code: 'GP',
    functionType: 'Asrama',
    location: 'Kampus Putra Sektor Timur',
    description: 'Kompleks gedung hunian santri putra 3 lantai dengan fasilitas kajian dan halaqah tahfidz.',
    status: 'ACTIVE',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-10T08:00:00Z',
  },
  {
    id: 'bld_dm_2',
    tenantId: 'ten_darulmusthafa',
    name: 'Gedung Asrama Putri',
    code: 'GW',
    functionType: 'Asrama',
    location: 'Kampus Putri Sektor Barat',
    description: 'Kompleks gedung hunian santri putri mandiri dengan pengawasan santriwati dan ruang halaqah adab.',
    status: 'ACTIVE',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-10T08:00:00Z',
  },
  // Al-Hidayah Buildings (Multi-Tenant Isolation testing)
  {
    id: 'bld_ah_1',
    tenantId: 'ten_alhidayah',
    name: 'Gedung Al-Fatih Terpadu',
    code: 'GAF',
    functionType: 'Asrama',
    location: 'Kampus Terpadu Sayap Utara',
    description: 'Gedung asrama terpadu santri Al-Hidayah boarding school.',
    status: 'ACTIVE',
    createdAt: '2025-02-01T08:00:00Z',
    updatedAt: '2025-02-01T08:00:00Z',
  },
];

export const INITIAL_DORMITORIES: Dormitory[] = [
  // Darul Musthafa Dormitories
  {
    id: 'dorm_dm_1',
    tenantId: 'ten_darulmusthafa',
    buildingId: 'bld_dm_1',
    name: 'Asrama Putra',
    code: 'ASP',
    genderType: 'PUTRA',
    totalCapacity: 120,
    description: 'Unit asrama santri putra utama (Umar bin Khattab & Ali bin Abi Thalib).',
    status: 'ACTIVE',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-10T08:00:00Z',
  },
  {
    id: 'dorm_dm_2',
    tenantId: 'ten_darulmusthafa',
    buildingId: 'bld_dm_2',
    name: 'Asrama Putri',
    code: 'ASW',
    genderType: 'PUTRI',
    totalCapacity: 100,
    description: 'Unit asrama santri putri utama (Sayyidah Khadijah & Sayyidah Aisyah).',
    status: 'ACTIVE',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-10T08:00:00Z',
  },
  // Al-Hidayah Dormitories
  {
    id: 'dorm_ah_1',
    tenantId: 'ten_alhidayah',
    buildingId: 'bld_ah_1',
    name: 'Asrama Putra Al-Fatih',
    code: 'AFP',
    genderType: 'PUTRA',
    totalCapacity: 80,
    description: 'Asrama santri putra Al-Hidayah.',
    status: 'ACTIVE',
    createdAt: '2025-02-01T08:00:00Z',
    updatedAt: '2025-02-01T08:00:00Z',
  },
];

export const INITIAL_ROOMS: Room[] = [
  // Darul Musthafa - Asrama Putra (dorm_dm_1, bld_dm_1)
  {
    id: 'room_dm_a01',
    tenantId: 'ten_darulmusthafa',
    buildingId: 'bld_dm_1',
    dormitoryId: 'dorm_dm_1',
    name: 'Kamar A-01',
    code: 'A-01',
    floor: 1,
    capacity: 12,
    genderType: 'PUTRA',
    status: 'ACTIVE',
    description: 'Kamar lantai 1 sayap timur, dekat mushalla asrama.',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-10T08:00:00Z',
  },
  {
    id: 'room_dm_a02',
    tenantId: 'ten_darulmusthafa',
    buildingId: 'bld_dm_1',
    dormitoryId: 'dorm_dm_1',
    name: 'Kamar A-02',
    code: 'A-02',
    floor: 1,
    capacity: 12,
    genderType: 'PUTRA',
    status: 'ACTIVE',
    description: 'Kamar lantai 1 sayap tengah.',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-10T08:00:00Z',
  },
  {
    id: 'room_dm_a03',
    tenantId: 'ten_darulmusthafa',
    buildingId: 'bld_dm_1',
    dormitoryId: 'dorm_dm_1',
    name: 'Kamar A-03',
    code: 'A-03',
    floor: 1,
    capacity: 12,
    genderType: 'PUTRA',
    status: 'ACTIVE',
    description: 'Kamar lantai 1 sayap barat.',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-10T08:00:00Z',
  },
  {
    id: 'room_dm_a04',
    tenantId: 'ten_darulmusthafa',
    buildingId: 'bld_dm_1',
    dormitoryId: 'dorm_dm_1',
    name: 'Kamar A-04',
    code: 'A-04',
    floor: 2,
    capacity: 12,
    genderType: 'PUTRA',
    status: 'ACTIVE',
    description: 'Kamar lantai 2 sayap timur, sirkulasi udara baik.',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-10T08:00:00Z',
  },
  {
    id: 'room_dm_a05',
    tenantId: 'ten_darulmusthafa',
    buildingId: 'bld_dm_1',
    dormitoryId: 'dorm_dm_1',
    name: 'Kamar A-05',
    code: 'A-05',
    floor: 2,
    capacity: 12,
    genderType: 'PUTRA',
    status: 'MAINTENANCE',
    description: 'Perbaikan plafon & instalasi exhaust fan berkala.',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-10T08:00:00Z',
  },

  // Darul Musthafa - Asrama Putri (dorm_dm_2, bld_dm_2)
  {
    id: 'room_dm_b01',
    tenantId: 'ten_darulmusthafa',
    buildingId: 'bld_dm_2',
    dormitoryId: 'dorm_dm_2',
    name: 'Kamar B-01',
    code: 'B-01',
    floor: 1,
    capacity: 10,
    genderType: 'PUTRI',
    status: 'ACTIVE',
    description: 'Kamar lantai 1 sayap utara, area santriwati pemula.',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-10T08:00:00Z',
  },
  {
    id: 'room_dm_b02',
    tenantId: 'ten_darulmusthafa',
    buildingId: 'bld_dm_2',
    dormitoryId: 'dorm_dm_2',
    name: 'Kamar B-02',
    code: 'B-02',
    floor: 1,
    capacity: 10,
    genderType: 'PUTRI',
    status: 'ACTIVE',
    description: 'Kamar lantai 1 sayap tengah.',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-10T08:00:00Z',
  },
  {
    id: 'room_dm_b03',
    tenantId: 'ten_darulmusthafa',
    buildingId: 'bld_dm_2',
    dormitoryId: 'dorm_dm_2',
    name: 'Kamar B-03',
    code: 'B-03',
    floor: 1,
    capacity: 10,
    genderType: 'PUTRI',
    status: 'ACTIVE',
    description: 'Kamar lantai 1 sayap selatan.',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-10T08:00:00Z',
  },
  {
    id: 'room_dm_b04',
    tenantId: 'ten_darulmusthafa',
    buildingId: 'bld_dm_2',
    dormitoryId: 'dorm_dm_2',
    name: 'Kamar B-04',
    code: 'B-04',
    floor: 2,
    capacity: 10,
    genderType: 'PUTRI',
    status: 'ACTIVE',
    description: 'Kamar lantai 2 sayap utara, kamar santriwati senior tahfidz.',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-10T08:00:00Z',
  },
  {
    id: 'room_dm_b05',
    tenantId: 'ten_darulmusthafa',
    buildingId: 'bld_dm_2',
    dormitoryId: 'dorm_dm_2',
    name: 'Kamar B-05',
    code: 'B-05',
    floor: 2,
    capacity: 10,
    genderType: 'PUTRI',
    status: 'ACTIVE',
    description: 'Kamar lantai 2 sayap selatan.',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-10T08:00:00Z',
  },

  // Al-Hidayah Room (dorm_ah_1, bld_ah_1)
  {
    id: 'room_ah_1',
    tenantId: 'ten_alhidayah',
    buildingId: 'bld_ah_1',
    dormitoryId: 'dorm_ah_1',
    name: 'Kamar Fatih 01',
    code: 'FT-01',
    floor: 1,
    capacity: 8,
    genderType: 'PUTRA',
    status: 'ACTIVE',
    description: 'Kamar santri baru Al-Hidayah.',
    createdAt: '2025-02-01T08:00:00Z',
    updatedAt: '2025-02-01T08:00:00Z',
  },

  // Ruang Belajar & Kelas Madrasah Darul Musthafa
  {
    id: 'room_dm_rk1',
    tenantId: 'ten_darulmusthafa',
    buildingId: 'bld_dm_1',
    dormitoryId: 'dorm_dm_1',
    name: 'Ruang Kelas 1-A (RK-01)',
    code: 'RK-01',
    floor: 1,
    capacity: 35,
    genderType: 'PUTRA',
    status: 'ACTIVE',
    description: 'Ruang belajar utama kelas 1-A dengan pendingin ruangan dan proyektor.',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-10T08:00:00Z',
  },
  {
    id: 'room_dm_rk2',
    tenantId: 'ten_darulmusthafa',
    buildingId: 'bld_dm_1',
    dormitoryId: 'dorm_dm_1',
    name: 'Ruang Kelas 1-B (RK-02)',
    code: 'RK-02',
    floor: 1,
    capacity: 35,
    genderType: 'PUTRA',
    status: 'ACTIVE',
    description: 'Ruang belajar kelas 1-B program Tahfidz & Diniyah.',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-10T08:00:00Z',
  },
  {
    id: 'room_dm_lab',
    tenantId: 'ten_darulmusthafa',
    buildingId: 'bld_dm_1',
    dormitoryId: 'dorm_dm_1',
    name: 'Laboratorium Bahasa (LAB-01)',
    code: 'LAB-01',
    floor: 2,
    capacity: 30,
    genderType: 'KHUSUS',
    status: 'ACTIVE',
    description: 'Lab audio bahasa Arab & Inggris terpadu multimedia.',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-10T08:00:00Z',
  },
  {
    id: 'room_dm_hal',
    tenantId: 'ten_darulmusthafa',
    buildingId: 'bld_dm_1',
    dormitoryId: 'dorm_dm_1',
    name: 'Halaqah Masjid Utama (MSJ-01)',
    code: 'MSJ-01',
    floor: 1,
    capacity: 60,
    genderType: 'PUTRA',
    status: 'ACTIVE',
    description: 'Ruang halaqah talaqqi Al-Quran dan kajian kitab kuning bandongan.',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-10T08:00:00Z',
  },

  // Ruang Belajar Al-Hidayah
  {
    id: 'room_ah_rk1',
    tenantId: 'ten_alhidayah',
    buildingId: 'bld_ah_1',
    dormitoryId: 'dorm_ah_1',
    name: 'Ruang Kelas Al-Fatih 1 (RK-F1)',
    code: 'RK-F1',
    floor: 1,
    capacity: 30,
    genderType: 'PUTRA',
    status: 'ACTIVE',
    description: 'Ruang belajar madrasah Al-Hidayah.',
    createdAt: '2025-02-01T08:00:00Z',
    updatedAt: '2025-02-01T08:00:00Z',
  },
  {
    id: 'room_ah_hal',
    tenantId: 'ten_alhidayah',
    buildingId: 'bld_ah_1',
    dormitoryId: 'dorm_ah_1',
    name: 'Halaqah Masjid Al-Fatih (MSJ-F1)',
    code: 'MSJ-F1',
    floor: 1,
    capacity: 50,
    genderType: 'PUTRA',
    status: 'ACTIVE',
    description: 'Area halaqah tahfidz sore & malam.',
    createdAt: '2025-02-01T08:00:00Z',
    updatedAt: '2025-02-01T08:00:00Z',
  },
];

export const INITIAL_DORMITORY_SUPERVISORS: DormitorySupervisor[] = [
  {
    id: 'sup_dm_1',
    tenantId: 'ten_darulmusthafa',
    dormitoryId: 'dorm_dm_1',
    userId: 'usr_musyrif_dm', // Ustadz Hassan As-Segaf
    roleType: 'MUSYRIF',
    isPrimary: true,
    createdAt: '2025-01-15T09:30:00Z',
    updatedAt: '2025-01-15T09:30:00Z',
  },
  {
    id: 'sup_dm_2',
    tenantId: 'ten_darulmusthafa',
    dormitoryId: 'dorm_dm_1',
    userId: 'usr_manager_dm', // Ust. Fahmi Zulkarnain
    roleType: 'PENANGGUNG_JAWAB',
    isPrimary: false,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  },
];

// ==================== PHASE 2.3: MASTER DATA INITIAL SDM ====================
export const INITIAL_EMPLOYEES: Employee[] = [
  // 1. Ustadz Ahmad Al-Farisi, Lc. (Guru - Terhubung ke akun usr_guru_dm)
  {
    id: 'emp_dm_1',
    tenantId: 'ten_darulmusthafa',
    userId: 'usr_guru_dm',
    employeeNumber: 'EMP-DM-001',
    fullName: 'Ustadz Ahmad Al-Farisi, Lc.',
    nickname: 'Ustadz Ahmad',
    gender: 'LAKI_LAKI',
    birthPlace: 'Kudus',
    birthDate: '1988-06-14',
    phone: '+62 815 4433 2211',
    email: 'guru.ahmad@darulmusthafa.sch.id',
    address: 'Komplek Perumahan Asatidz No. 04, Cisarua, Bogor',
    joinDate: '2020-07-15',
    employmentStatus: 'TETAP',
    position: 'Guru Pengajar Fiqih & Tafsir',
    type: 'GURU',
    notes: 'Lulusan Fakultas Syariah Al-Ahgaff University, Yaman. Pengajar kitab Bidayatul Hidayah & Safinatun Najah.',
    status: 'ACTIVE',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-10T08:00:00Z',
  },
  // 2. Ustadz Muhammad Ridho, M.Ag (Guru - Belum memiliki akun)
  {
    id: 'emp_dm_2',
    tenantId: 'ten_darulmusthafa',
    userId: null,
    employeeNumber: 'EMP-DM-002',
    fullName: 'Ustadz Muhammad Ridho, M.Ag',
    nickname: 'Ustadz Muhammad',
    gender: 'LAKI_LAKI',
    birthPlace: 'Jombang',
    birthDate: '1991-03-22',
    phone: '+62 812 7788 1122',
    email: 'm.ridho@darulmusthafa.sch.id',
    address: 'Jl. Pesantren Luhur No. 08, Cisarua, Bogor',
    joinDate: '2022-08-01',
    employmentStatus: 'TETAP',
    position: 'Guru Pengajar Hadits & Bahasa Arab',
    type: 'GURU',
    notes: 'Magister Ilmu Hadits UIN Syarif Hidayatullah. Pengampu Bulughul Maram & Jurumiyah.',
    status: 'ACTIVE',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-10T08:00:00Z',
  },
  // 3. Ustadz Hassan As-Segaf (Musyrif - Terhubung ke usr_musyrif_dm)
  {
    id: 'emp_dm_3',
    tenantId: 'ten_darulmusthafa',
    userId: 'usr_musyrif_dm',
    employeeNumber: 'EMP-DM-003',
    fullName: 'Ustadz Hassan As-Segaf',
    nickname: 'Bib Hassan',
    gender: 'LAKI_LAKI',
    birthPlace: 'Surabaya',
    birthDate: '1993-11-10',
    phone: '+62 856 7788 9900',
    email: 'musyrif.hassan@darulmusthafa.sch.id',
    address: 'Kamar Pembina Asrama Putra Lt 1, Pesantren Darul Musthafa',
    joinDate: '2021-01-10',
    employmentStatus: 'TETAP',
    position: 'Musyrif Utama Asrama Putra',
    type: 'MUSYRIF',
    notes: 'Musyrif senior pembimbing hafalan malam santri & ketertiban ibadah harian.',
    status: 'ACTIVE',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-10T08:00:00Z',
  },
  // 4. Ust. Fahmi Zulkarnain, S.Pd.I (Musyrif / Pembina - Terhubung ke usr_manager_dm)
  {
    id: 'emp_dm_4',
    tenantId: 'ten_darulmusthafa',
    userId: 'usr_manager_dm',
    employeeNumber: 'EMP-DM-004',
    fullName: 'Ust. Fahmi Zulkarnain, S.Pd.I',
    nickname: 'Ust. Fahmi',
    gender: 'LAKI_LAKI',
    birthPlace: 'Bogor',
    birthDate: '1986-09-05',
    phone: '+62 813 1122 3344',
    email: 'manager@darulmusthafa.sch.id',
    address: 'Jl. Raya Puncak KM 78, Cisarua, Bogor',
    joinDate: '2019-06-01',
    employmentStatus: 'TETAP',
    position: 'Penanggung Jawab Asrama & Kepala Tarbiyah',
    type: 'MUSYRIF',
    notes: 'Penanggung jawab pembinaan akhlak, konseling, dan koordinasi perizinan santri.',
    status: 'ACTIVE',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-10T08:00:00Z',
  },
  // 5. Bambang Supriyanto (Staff - Terhubung ke usr_karyawan_dm)
  {
    id: 'emp_dm_5',
    tenantId: 'ten_darulmusthafa',
    userId: 'usr_karyawan_dm',
    employeeNumber: 'EMP-DM-005',
    fullName: 'Bambang Supriyanto',
    nickname: 'Pak Bambang',
    gender: 'LAKI_LAKI',
    birthPlace: 'Cilacap',
    birthDate: '1984-04-18',
    phone: '+62 878 1234 5678',
    email: 'karyawan@darulmusthafa.sch.id',
    address: 'Kp. Sukamaju RT 02/05, Cisarua, Bogor',
    joinDate: '2018-03-01',
    employmentStatus: 'TETAP',
    position: 'Staf Administrasi & Sarpras',
    type: 'STAFF',
    notes: 'Pengelola inventaris aset, pemeliharaan fasilitas, dan logistik harian.',
    status: 'ACTIVE',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-10T08:00:00Z',
  },

  // Al-Hidayah Tenant Data (for Tenant Isolation Testing)
  {
    id: 'emp_ah_1',
    tenantId: 'ten_alhidayah',
    userId: null,
    employeeNumber: 'EMP-AH-001',
    fullName: 'Ust. Zulkifli Harahap, Lc.',
    nickname: 'Ust. Zul',
    gender: 'LAKI_LAKI',
    birthPlace: 'Medan',
    birthDate: '1989-12-01',
    phone: '+62 819 1234 5678',
    email: 'zulkifli@alhidayah.sch.id',
    address: 'Jl. Raya Salabintana, Sukabumi',
    joinDate: '2022-01-15',
    employmentStatus: 'TETAP',
    position: 'Guru Tahfidzul Quran',
    type: 'GURU',
    notes: 'Pembimbing tahfidz santri Al-Hidayah.',
    status: 'ACTIVE',
    createdAt: '2025-02-01T08:00:00Z',
    updatedAt: '2025-02-01T08:00:00Z',
  },
  {
    id: 'emp_ah_2',
    tenantId: 'ten_alhidayah',
    userId: null,
    employeeNumber: 'EMP-AH-002',
    fullName: 'Ust. Syarif Hidayatullah',
    nickname: 'Ust. Syarif',
    gender: 'LAKI_LAKI',
    birthPlace: 'Sukabumi',
    birthDate: '1994-07-20',
    phone: '+62 819 8765 4321',
    email: 'syarif@alhidayah.sch.id',
    address: 'Komplek Asrama Al-Fatih, Sukabumi',
    joinDate: '2023-01-10',
    employmentStatus: 'TETAP',
    position: 'Musyrif Asrama Putra Al-Fatih',
    type: 'MUSYRIF',
    notes: 'Musyrif gedung asrama Al-Fatih Al-Hidayah.',
    status: 'ACTIVE',
    createdAt: '2025-02-01T08:00:00Z',
    updatedAt: '2025-02-01T08:00:00Z',
  },
];

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 'tch_101',
    tenantId: 'ten_darulmusthafa',
    employeeId: 'emp_dm_1',
    teacherCode: 'GUR-101',
    specialization: 'Fiqih & Kitab Kuning',
    educationLevel: 'S2',
    qualification: 'Lc., MA',
    teachingStatus: 'ACTIVE',
    notes: 'Ustadz Pengajar Kitab Kuning & Wali Rombel 1-A Takhassus.',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-10T08:00:00Z',
  },
  {
    id: 'tch_103',
    tenantId: 'ten_darulmusthafa',
    employeeId: 'emp_dm_2',
    teacherCode: 'GUR-103',
    specialization: 'Tahfidzul Quran & Qiraat',
    educationLevel: 'S2',
    qualification: 'M.Ag',
    teachingStatus: 'ACTIVE',
    notes: 'Ustadzah Pembimbing Tahfidz & Wali Rombel 1-A Tahfidz.',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-10T08:00:00Z',
  },
  {
    id: 'tch_dm_1',
    tenantId: 'ten_darulmusthafa',
    employeeId: 'emp_dm_1',
    teacherCode: 'GUR-001',
    specialization: 'Fiqih & Tafsir Al-Quran',
    educationLevel: 'S1',
    qualification: 'Lc.',
    teachingStatus: 'ACTIVE',
    notes: 'Mengampu materi Fiqih Ibadah & Muamalah tingkat Tsanawiyah dan Aliyah.',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-10T08:00:00Z',
  },
  {
    id: 'tch_dm_2',
    tenantId: 'ten_darulmusthafa',
    employeeId: 'emp_dm_2',
    teacherCode: 'GUR-002',
    specialization: 'Hadits & Bahasa Arab',
    educationLevel: 'S2',
    qualification: 'M.Ag',
    teachingStatus: 'ACTIVE',
    notes: 'Mengampu kajian Hadits Arbain, Bulughul Maram, dan Nahwu Sharaf lanjutan.',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-10T08:00:00Z',
  },
  {
    id: 'tch_ah_1',
    tenantId: 'ten_alhidayah',
    employeeId: 'emp_ah_1',
    teacherCode: 'GUR-AH-001',
    specialization: 'Tahfidzul Quran',
    educationLevel: 'S1',
    qualification: 'Lc., Al-Hafidz',
    teachingStatus: 'ACTIVE',
    notes: 'Guru pengampu tahfidz 30 juz Al-Hidayah.',
    createdAt: '2025-02-01T08:00:00Z',
    updatedAt: '2025-02-01T08:00:00Z',
  },
];

export const INITIAL_MUSYRIFS: Musyrif[] = [
  {
    id: 'msy_dm_1',
    tenantId: 'ten_darulmusthafa',
    employeeId: 'emp_dm_3',
    musyrifCode: 'MSY-001',
    specialization: 'Tahfidz & Kedisiplinan Asrama Putra',
    notes: 'Bertanggung jawab atas ketertiban santri putra, shalat berjamaah 5 waktu dan murojaah malam.',
    status: 'ACTIVE',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-10T08:00:00Z',
  },
  {
    id: 'msy_dm_2',
    tenantId: 'ten_darulmusthafa',
    employeeId: 'emp_dm_4',
    musyrifCode: 'MSY-002',
    specialization: 'Pengasuhan Karakter & Bimbingan Moral',
    notes: 'Membawahi pembinaan adab santri, penanganan santri sakit, dan koordinasi dengan wali santri.',
    status: 'ACTIVE',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-10T08:00:00Z',
  },
  {
    id: 'msy_ah_1',
    tenantId: 'ten_alhidayah',
    employeeId: 'emp_ah_2',
    musyrifCode: 'MSY-AH-001',
    specialization: 'Ketertiban & Bimbingan Ibadah',
    notes: 'Musyrif asrama santri baru Al-Hidayah.',
    status: 'ACTIVE',
    createdAt: '2025-02-01T08:00:00Z',
    updatedAt: '2025-02-01T08:00:00Z',
  },
];

export const INITIAL_STUDENTS: Student[] = [
  // Darul Musthafa Students
  {
    id: 'st_1042',
    tenantId: 'ten_darulmusthafa',
    userId: 'usr_santri_dm',
    programId: 'prog_dm_2',
    academicYearId: 'ay_dm_2025',
    currentRoomId: 'room_dm_a01',
    currentClassId: 'cls_dm_1',
    nis: '2026.03.1042',
    nisn: '0081234567',
    nik: '3201020304050001',
    fullName: 'Ahmad Muhammad Faqih',
    nickname: 'Faqih',
    gender: 'LAKI_LAKI',
    birthPlace: 'Jakarta',
    birthDate: '2010-05-15',
    phone: '+62 899 1122 3344',
    email: 'ahmad.muhammad@darulmusthafa.sch.id',
    address: 'Jl. Melati No. 15, Tebet, Jakarta Selatan',
    admissionDate: '2024-07-15',
    status: 'ACTIVE',
    photo: null,
    notes: 'Santri program unggulan tahfidz 30 juz mutqin.',
    createdAt: '2025-02-01T08:00:00Z',
    updatedAt: '2025-02-01T08:00:00Z',
  },
  {
    id: 'st_1043',
    tenantId: 'ten_darulmusthafa',
    userId: null,
    programId: 'prog_dm_1',
    academicYearId: 'ay_dm_2025',
    currentRoomId: 'room_dm_a01',
    currentClassId: 'cls_dm_1',
    nis: '2026.03.1043',
    nisn: '0081234568',
    nik: '3201020304050002',
    fullName: 'Muhammad Zaky Al-Farisi',
    nickname: 'Zaky',
    gender: 'LAKI_LAKI',
    birthPlace: 'Bandung',
    birthDate: '2010-08-20',
    phone: '+62 812 3344 5566',
    email: 'zaky.farisi@gmail.com',
    address: 'Jl. Dago No. 45, Bandung',
    admissionDate: '2024-07-15',
    status: 'ACTIVE',
    photo: null,
    notes: 'Santri aktif halaqah tajwid dan qiraah.',
    createdAt: '2025-02-01T08:00:00Z',
    updatedAt: '2025-02-01T08:00:00Z',
  },
  {
    id: 'st_1044',
    tenantId: 'ten_darulmusthafa',
    userId: null,
    programId: 'prog_dm_2',
    academicYearId: 'ay_dm_2025',
    currentRoomId: 'room_dm_b01',
    currentClassId: 'cls_dm_3',
    nis: '2026.03.1044',
    nisn: '0081234569',
    nik: '3201020304050003',
    fullName: 'Aisyah Humaira Putri',
    nickname: 'Aisyah',
    gender: 'PEREMPUAN',
    birthPlace: 'Surabaya',
    birthDate: '2011-01-10',
    phone: '+62 813 9988 7766',
    email: 'aisyah.humaira@gmail.com',
    address: 'Jl. Rungkut Asri No. 12, Surabaya',
    admissionDate: '2024-07-15',
    status: 'ACTIVE',
    photo: null,
    notes: 'Santriwati teladan asrama putri Khadijah.',
    createdAt: '2025-02-01T08:00:00Z',
    updatedAt: '2025-02-01T08:00:00Z',
  },
  {
    id: 'st_1045',
    tenantId: 'ten_darulmusthafa',
    userId: null,
    programId: 'prog_dm_3',
    academicYearId: 'ay_dm_2025',
    currentRoomId: null,
    nis: '2026.03.1045',
    nisn: '0081234570',
    nik: '3201020304050004',
    fullName: 'Umar Abdullah Al-Khattab',
    nickname: 'Umar',
    gender: 'LAKI_LAKI',
    birthPlace: 'Semarang',
    birthDate: '2010-11-25',
    phone: '+62 815 1122 4455',
    email: 'umar.abdullah@gmail.com',
    address: 'Jl. Pandanaran No. 78, Semarang',
    admissionDate: '2024-07-15',
    status: 'ACTIVE',
    photo: null,
    notes: 'Santri pindahan, menunggu verifikasi kamar asrama.',
    createdAt: '2025-02-01T08:00:00Z',
    updatedAt: '2025-02-01T08:00:00Z',
  },
  // Al-Hidayah Students (For Multi-Tenant Isolation)
  {
    id: 'st_ah_1',
    tenantId: 'ten_alhidayah',
    userId: null,
    programId: 'prog_ah_1',
    academicYearId: 'ay_ah_2025',
    currentRoomId: 'room_ah_101',
    nis: 'AH.2026.001',
    nisn: '0081234571',
    nik: '3301020304050001',
    fullName: 'Farih Hamizan',
    nickname: 'Farih',
    gender: 'LAKI_LAKI',
    birthPlace: 'Solo',
    birthDate: '2010-03-12',
    phone: '+62 822 5566 7788',
    email: 'farih.hamizan@alhidayah.sch.id',
    address: 'Jl. Slamet Riyadi No. 90, Surakarta',
    admissionDate: '2025-01-10',
    status: 'ACTIVE',
    photo: null,
    notes: 'Santri tahfidz Al-Hidayah.',
    createdAt: '2025-02-01T08:00:00Z',
    updatedAt: '2025-02-01T08:00:00Z',
  },
];

export const INITIAL_PARENTS: Parent[] = [
  // Darul Musthafa Parents
  {
    id: 'par_1001',
    tenantId: 'ten_darulmusthafa',
    userId: 'usr_wali_dm',
    nik: '3201020304050099',
    fullName: 'H. Muhammad Yusuf',
    relationshipType: 'AYAH',
    phone: '+62 811 7766 5544',
    email: 'wali.faqih@gmail.com',
    occupation: 'Wiraswasta',
    address: 'Jl. Melati No. 15, Tebet, Jakarta Selatan',
    createdAt: '2025-02-01T08:30:00Z',
    updatedAt: '2025-02-01T08:30:00Z',
  },
  {
    id: 'par_1002',
    tenantId: 'ten_darulmusthafa',
    userId: null,
    nik: '3201020304050098',
    fullName: 'Hj. Siti Aminah',
    relationshipType: 'IBU',
    phone: '+62 812 8899 0011',
    email: 'siti.aminah@gmail.com',
    occupation: 'Guru PNS',
    address: 'Jl. Melati No. 15, Tebet, Jakarta Selatan',
    createdAt: '2025-02-01T08:30:00Z',
    updatedAt: '2025-02-01T08:30:00Z',
  },
  {
    id: 'par_1003',
    tenantId: 'ten_darulmusthafa',
    userId: null,
    nik: '3201020304050097',
    fullName: 'Drs. Bambang Hendrawan',
    relationshipType: 'AYAH',
    phone: '+62 813 1122 3388',
    email: 'bambang.hendrawan@yahoo.com',
    occupation: 'Dokter Spesialis',
    address: 'Jl. Rungkut Asri No. 12, Surabaya',
    createdAt: '2025-02-01T08:30:00Z',
    updatedAt: '2025-02-01T08:30:00Z',
  },
  // Al-Hidayah Parents
  {
    id: 'par_ah_1',
    tenantId: 'ten_alhidayah',
    userId: null,
    nik: '3301020304050099',
    fullName: 'Drs. H. Syarif Hidayat',
    relationshipType: 'AYAH',
    phone: '+62 821 3344 5511',
    email: 'syarif.hidayat@gmail.com',
    occupation: 'Pengusaha',
    address: 'Jl. Slamet Riyadi No. 90, Surakarta',
    createdAt: '2025-02-01T08:30:00Z',
    updatedAt: '2025-02-01T08:30:00Z',
  },
];

export const INITIAL_STUDENT_PARENTS: StudentParent[] = [
  {
    id: 'sp_1',
    tenantId: 'ten_darulmusthafa',
    studentId: 'st_1042',
    parentId: 'par_1001',
    relationship: 'AYAH_KANDUNG',
    isPrimaryContact: true,
    isEmergencyContact: true,
    createdAt: '2025-02-01T08:30:00Z',
    updatedAt: '2025-02-01T08:30:00Z',
  },
  {
    id: 'sp_2',
    tenantId: 'ten_darulmusthafa',
    studentId: 'st_1042',
    parentId: 'par_1002',
    relationship: 'IBU_KANDUNG',
    isPrimaryContact: false,
    isEmergencyContact: true,
    createdAt: '2025-02-01T08:30:00Z',
    updatedAt: '2025-02-01T08:30:00Z',
  },
  {
    id: 'sp_3',
    tenantId: 'ten_darulmusthafa',
    studentId: 'st_1044',
    parentId: 'par_1003',
    relationship: 'AYAH_KANDUNG',
    isPrimaryContact: true,
    isEmergencyContact: true,
    createdAt: '2025-02-01T08:30:00Z',
    updatedAt: '2025-02-01T08:30:00Z',
  },
  {
    id: 'sp_ah_1',
    tenantId: 'ten_alhidayah',
    studentId: 'st_ah_1',
    parentId: 'par_ah_1',
    relationship: 'AYAH_KANDUNG',
    isPrimaryContact: true,
    isEmergencyContact: true,
    createdAt: '2025-02-01T08:30:00Z',
    updatedAt: '2025-02-01T08:30:00Z',
  },
];

export const INITIAL_STUDENT_ROOM_HISTORIES: StudentRoomHistory[] = [
  {
    id: 'srh_1',
    tenantId: 'ten_darulmusthafa',
    studentId: 'st_1042',
    roomId: 'room_dm_a01',
    checkInDate: '2024-07-15T08:00:00Z',
    checkOutDate: null,
    notes: 'Penempatan awal santri baru di Asrama Putra Kamar A-01.',
    createdAt: '2024-07-15T08:00:00Z',
    updatedAt: '2024-07-15T08:00:00Z',
  },
  {
    id: 'srh_2',
    tenantId: 'ten_darulmusthafa',
    studentId: 'st_1043',
    roomId: 'room_dm_a01',
    checkInDate: '2024-07-15T08:00:00Z',
    checkOutDate: null,
    notes: 'Penempatan awal santri baru di Asrama Putra Kamar A-01.',
    createdAt: '2024-07-15T08:00:00Z',
    updatedAt: '2024-07-15T08:00:00Z',
  },
  {
    id: 'srh_3',
    tenantId: 'ten_darulmusthafa',
    studentId: 'st_1044',
    roomId: 'room_dm_b01',
    checkInDate: '2024-07-15T08:00:00Z',
    checkOutDate: null,
    notes: 'Penempatan asrama santriwati Asrama Putri Kamar B-01.',
    createdAt: '2024-07-15T08:00:00Z',
    updatedAt: '2024-07-15T08:00:00Z',
  },
  {
    id: 'srh_ah_1',
    tenantId: 'ten_alhidayah',
    studentId: 'st_ah_1',
    roomId: 'room_ah_101',
    checkInDate: '2025-01-10T08:00:00Z',
    checkOutDate: null,
    notes: 'Penempatan kamar santri baru Al-Hidayah.',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-10T08:00:00Z',
  },
];

export const INITIAL_CLASSES: ClassGroup[] = [
  {
    id: 'cls_dm_1',
    tenantId: 'ten_darulmusthafa',
    academicYearId: 'ay_dm_2025',
    programId: 'prog_dm_1',
    homeroomTeacherId: 'tch_101',
    name: 'Kelas 1-A Takhassus Kitab Kuning',
    code: 'KLS-1A-TKK',
    level: 1,
    gender: 'PUTRA',
    capacity: 30,
    roomLocation: 'Gedung Abu Bakar Lt. 2 Ruang 201',
    status: 'ACTIVE',
    notes: 'Rombongan belajar khusus santri putra pendalaman kitab kuning turats.',
    createdAt: '2025-07-10T08:00:00Z',
    updatedAt: '2025-07-10T08:00:00Z',
  },
  {
    id: 'cls_dm_2',
    tenantId: 'ten_darulmusthafa',
    academicYearId: 'ay_dm_2025',
    programId: 'prog_dm_2',
    homeroomTeacherId: 'tch_103',
    name: 'Kelas 1-A Tahfidz',
    code: 'KLS-1A-TFZ',
    level: 1,
    gender: 'PUTRA',
    capacity: 25,
    roomLocation: 'Gedung Abu Bakar Lt. 2 Ruang 202',
    status: 'ACTIVE',
    notes: 'Rombongan belajar halaqah akselerasi tahfidz Al-Quran 30 juz putra.',
    createdAt: '2025-07-10T08:00:00Z',
    updatedAt: '2025-07-10T08:00:00Z',
  },
  {
    id: 'cls_dm_3',
    tenantId: 'ten_darulmusthafa',
    academicYearId: 'ay_dm_2025',
    programId: 'prog_dm_1',
    homeroomTeacherId: 'tch_dm_2',
    name: 'Kelas 1-B Reguler Putri',
    code: 'KLS-1B-PI',
    level: 1,
    gender: 'PUTRI',
    capacity: 28,
    roomLocation: 'Gedung Khadijah Lt. 1 Ruang 101',
    status: 'ACTIVE',
    notes: 'Rombongan belajar santri putri program reguler diniyah.',
    createdAt: '2025-07-10T08:00:00Z',
    updatedAt: '2025-07-10T08:00:00Z',
  },
  {
    id: 'cls_ah_1',
    tenantId: 'ten_alhidayah',
    academicYearId: 'ay_ah_2026',
    programId: 'prog_ah_1',
    homeroomTeacherId: 'tch_ah_1',
    name: 'Kelas 7-A MTs Al-Hidayah',
    code: 'KLS-7A-AH',
    level: 7,
    gender: 'PUTRA',
    capacity: 32,
    roomLocation: 'Gedung Utama Lt. 1 Ruang 1',
    status: 'ACTIVE',
    notes: 'Kelas santri baru MTs Al-Hidayah Sukabumi.',
    createdAt: '2026-07-10T08:00:00Z',
    updatedAt: '2026-07-10T08:00:00Z',
  },
];

export const INITIAL_STUDENT_CLASS_HISTORIES: StudentClassHistory[] = [
  {
    id: 'sch_1',
    tenantId: 'ten_darulmusthafa',
    studentId: 'st_1042',
    classId: 'cls_dm_1',
    academicYearId: 'ay_dm_2025',
    enrollDate: '2025-07-15T08:00:00Z',
    exitDate: null,
    status: 'ACTIVE',
    notes: 'Penempatan awal santri di Kelas 1-A Takhassus Kitab Kuning.',
    createdAt: '2025-07-15T08:00:00Z',
    updatedAt: '2025-07-15T08:00:00Z',
  },
  {
    id: 'sch_2',
    tenantId: 'ten_darulmusthafa',
    studentId: 'st_1043',
    classId: 'cls_dm_1',
    academicYearId: 'ay_dm_2025',
    enrollDate: '2025-07-15T08:00:00Z',
    exitDate: null,
    status: 'ACTIVE',
    notes: 'Penempatan awal santri baru di rombel 1-A Takhassus.',
    createdAt: '2025-07-15T08:00:00Z',
    updatedAt: '2025-07-15T08:00:00Z',
  },
  {
    id: 'sch_3',
    tenantId: 'ten_darulmusthafa',
    studentId: 'st_1044',
    classId: 'cls_dm_3',
    academicYearId: 'ay_dm_2025',
    enrollDate: '2025-07-15T08:00:00Z',
    exitDate: null,
    status: 'ACTIVE',
    notes: 'Penempatan santriwati di rombel 1-B Reguler Putri.',
    createdAt: '2025-07-15T08:00:00Z',
    updatedAt: '2025-07-15T08:00:00Z',
  },
];

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'sbj_dm_1',
    tenantId: 'ten_darulmusthafa',
    code: 'NWH',
    name: 'Nahwu',
    shortName: 'NWH',
    type: 'DINIYAH',
    creditHours: 2,
    status: 'ACTIVE',
    description: 'Ilmu kaidah tata bahasa Arab dasar hingga lanjutan untuk membaca kitab kuning (Jurumiyyah & Imrithi).',
    createdAt: '2025-07-01T08:00:00Z',
    updatedAt: '2025-07-01T08:00:00Z',
  },
  {
    id: 'sbj_dm_2',
    tenantId: 'ten_darulmusthafa',
    code: 'FIQ',
    name: 'Fiqih',
    shortName: 'FIQ',
    type: 'DINIYAH',
    creditHours: 2,
    status: 'ACTIVE',
    description: 'Kajian hukum syariat praktis madzhab Syafi\'i meliputi thaharah, ibadah shalat, puasa, dan zakat (Safinatun Naja & Fathul Qarib).',
    createdAt: '2025-07-01T08:00:00Z',
    updatedAt: '2025-07-01T08:00:00Z',
  },
  {
    id: 'sbj_dm_3',
    tenantId: 'ten_darulmusthafa',
    code: 'BHS-AR',
    name: 'Bahasa Arab',
    shortName: 'BHS-AR',
    type: 'BAHASA',
    creditHours: 4,
    status: 'ACTIVE',
    description: 'Muhadatsah harian, insya\', mufrodat, dan penerapan bahasa percakapan di lingkungan pondok.',
    createdAt: '2025-07-01T08:00:00Z',
    updatedAt: '2025-07-01T08:00:00Z',
  },
  {
    id: 'sbj_dm_4',
    tenantId: 'ten_darulmusthafa',
    code: 'TAHFIDZ',
    name: 'Tahfidz Al-Qur\'an',
    shortName: 'TAHFIDZ',
    type: 'TAHFIDZ',
    creditHours: 3,
    status: 'ACTIVE',
    description: 'Halaqah setoran ziyadah hafalan baru, muraja\'ah mandiri, dan pengujian tajwid makharijul huruf.',
    createdAt: '2025-07-01T08:00:00Z',
    updatedAt: '2025-07-01T08:00:00Z',
  },
  {
    id: 'sbj_dm_5',
    tenantId: 'ten_darulmusthafa',
    code: 'MTK',
    name: 'Matematika',
    shortName: 'MTK',
    type: 'UMUM',
    creditHours: 2,
    status: 'ACTIVE',
    description: 'Pelajaran kurikulum nasional matematika dasar, logika berhitung, dan penerapan hitung hisab zakat/waris.',
    createdAt: '2025-07-01T08:00:00Z',
    updatedAt: '2025-07-01T08:00:00Z',
  },
  {
    id: 'sbj_ah_1',
    tenantId: 'ten_alhidayah',
    code: 'FIQ-AH',
    name: 'Fiqih Ibadah MTs',
    shortName: 'FIQ-AH',
    type: 'DINIYAH',
    creditHours: 2,
    status: 'ACTIVE',
    description: 'Pelajaran fiqih ibadah tingkat MTs Al-Hidayah.',
    createdAt: '2026-07-01T08:00:00Z',
    updatedAt: '2026-07-01T08:00:00Z',
  },
  {
    id: 'sbj_ah_2',
    tenantId: 'ten_alhidayah',
    code: 'BHS-ING',
    name: 'Bahasa Inggris',
    shortName: 'BHS-ING',
    type: 'BAHASA',
    creditHours: 2,
    status: 'ACTIVE',
    description: 'Dasar percakapan dan tata bahasa Inggris santri MTs Al-Hidayah.',
    createdAt: '2026-07-01T08:00:00Z',
    updatedAt: '2026-07-01T08:00:00Z',
  },
];

export const INITIAL_CLASS_SUBJECTS: ClassSubject[] = [
  // Class 1-A Takhassus (cls_dm_1)
  {
    id: 'cs_dm_1',
    tenantId: 'ten_darulmusthafa',
    classId: 'cls_dm_1',
    subjectId: 'sbj_dm_1',
    teacherId: 'tch_101',
    creditHours: 2,
    status: 'ACTIVE',
    createdAt: '2025-07-15T08:00:00Z',
    updatedAt: '2025-07-15T08:00:00Z',
  },
  {
    id: 'cs_dm_2',
    tenantId: 'ten_darulmusthafa',
    classId: 'cls_dm_1',
    subjectId: 'sbj_dm_2',
    teacherId: 'tch_101',
    creditHours: 2,
    status: 'ACTIVE',
    createdAt: '2025-07-15T08:00:00Z',
    updatedAt: '2025-07-15T08:00:00Z',
  },
  {
    id: 'cs_dm_3',
    tenantId: 'ten_darulmusthafa',
    classId: 'cls_dm_1',
    subjectId: 'sbj_dm_3',
    teacherId: 'tch_dm_2',
    creditHours: 4,
    status: 'ACTIVE',
    createdAt: '2025-07-15T08:00:00Z',
    updatedAt: '2025-07-15T08:00:00Z',
  },
  {
    id: 'cs_dm_4',
    tenantId: 'ten_darulmusthafa',
    classId: 'cls_dm_1',
    subjectId: 'sbj_dm_4',
    teacherId: 'tch_103',
    creditHours: 3,
    status: 'ACTIVE',
    createdAt: '2025-07-15T08:00:00Z',
    updatedAt: '2025-07-15T08:00:00Z',
  },
  // Class 1-A Tahfidz (cls_dm_2)
  {
    id: 'cs_dm_5',
    tenantId: 'ten_darulmusthafa',
    classId: 'cls_dm_2',
    subjectId: 'sbj_dm_4',
    teacherId: 'tch_103',
    creditHours: 6,
    status: 'ACTIVE',
    createdAt: '2025-07-15T08:00:00Z',
    updatedAt: '2025-07-15T08:00:00Z',
  },
  {
    id: 'cs_dm_6',
    tenantId: 'ten_darulmusthafa',
    classId: 'cls_dm_2',
    subjectId: 'sbj_dm_1',
    teacherId: 'tch_101',
    creditHours: 2,
    status: 'ACTIVE',
    createdAt: '2025-07-15T08:00:00Z',
    updatedAt: '2025-07-15T08:00:00Z',
  },
  // Al-Hidayah Tenant
  {
    id: 'cs_ah_1',
    tenantId: 'ten_alhidayah',
    classId: 'cls_ah_1',
    subjectId: 'sbj_ah_1',
    teacherId: 'tch_ah_1',
    creditHours: 2,
    status: 'ACTIVE',
    createdAt: '2025-07-15T08:00:00Z',
    updatedAt: '2025-07-15T08:00:00Z',
  },
];

// ==========================================
// PHASE 3.3: INITIAL SCHEDULES SEED DATA
// ==========================================
export const INITIAL_SCHEDULES: Schedule[] = [
  // Darul Musthafa - Kelas 1-A Takhassus (cls_dm_1) di Ruang Kelas 1-A (room_dm_rk1)
  {
    id: 'sch_dm_1',
    tenantId: 'ten_darulmusthafa',
    classSubjectId: 'cs_dm_1', // Nahwu (tch_101)
    classId: 'cls_dm_1',
    roomId: 'room_dm_rk1',
    dayOfWeek: 'SENIN',
    startTime: '07:30',
    endTime: '09:00',
    status: 'ACTIVE',
    createdAt: '2025-07-16T08:00:00Z',
    updatedAt: '2025-07-16T08:00:00Z',
  },
  {
    id: 'sch_dm_2',
    tenantId: 'ten_darulmusthafa',
    classSubjectId: 'cs_dm_2', // Shorof (tch_101)
    classId: 'cls_dm_1',
    roomId: 'room_dm_rk1',
    dayOfWeek: 'SENIN',
    startTime: '09:15',
    endTime: '10:45',
    status: 'ACTIVE',
    createdAt: '2025-07-16T08:00:00Z',
    updatedAt: '2025-07-16T08:00:00Z',
  },
  {
    id: 'sch_dm_3',
    tenantId: 'ten_darulmusthafa',
    classSubjectId: 'cs_dm_3', // Fiqih Syafiiyah (tch_dm_2)
    classId: 'cls_dm_1',
    roomId: 'room_dm_rk1',
    dayOfWeek: 'SELASA',
    startTime: '07:30',
    endTime: '09:30',
    status: 'ACTIVE',
    createdAt: '2025-07-16T08:00:00Z',
    updatedAt: '2025-07-16T08:00:00Z',
  },
  {
    id: 'sch_dm_4',
    tenantId: 'ten_darulmusthafa',
    classSubjectId: 'cs_dm_4', // Tahfidz (tch_103)
    classId: 'cls_dm_1',
    roomId: 'room_dm_hal',
    dayOfWeek: 'RABU',
    startTime: '07:30',
    endTime: '09:30',
    status: 'ACTIVE',
    createdAt: '2025-07-16T08:00:00Z',
    updatedAt: '2025-07-16T08:00:00Z',
  },
  // Darul Musthafa - Kelas 1-A Tahfidz (cls_dm_2) di Ruang Kelas 1-B & Halaqah
  {
    id: 'sch_dm_5',
    tenantId: 'ten_darulmusthafa',
    classSubjectId: 'cs_dm_5', // Tahfidz (tch_103)
    classId: 'cls_dm_2',
    roomId: 'room_dm_hal',
    dayOfWeek: 'SENIN',
    startTime: '07:30',
    endTime: '09:30',
    status: 'ACTIVE',
    createdAt: '2025-07-16T08:00:00Z',
    updatedAt: '2025-07-16T08:00:00Z',
  },
  {
    id: 'sch_dm_6',
    tenantId: 'ten_darulmusthafa',
    classSubjectId: 'cs_dm_6', // Nahwu (tch_101)
    classId: 'cls_dm_2',
    roomId: 'room_dm_rk2',
    dayOfWeek: 'SELASA',
    startTime: '07:30',
    endTime: '09:00',
    status: 'ACTIVE',
    createdAt: '2025-07-16T08:00:00Z',
    updatedAt: '2025-07-16T08:00:00Z',
  },
  // Al-Hidayah Tenant Schedule
  {
    id: 'sch_ah_1',
    tenantId: 'ten_alhidayah',
    classSubjectId: 'cs_ah_1',
    classId: 'cls_ah_1',
    roomId: 'room_ah_rk1',
    dayOfWeek: 'SENIN',
    startTime: '08:00',
    endTime: '09:30',
    status: 'ACTIVE',
    createdAt: '2025-07-16T08:00:00Z',
    updatedAt: '2025-07-16T08:00:00Z',
  },
];

// ==========================================
// PHASE 3.4: INITIAL ATTENDANCE SEED DATA
// ==========================================
export const INITIAL_ATTENDANCE_TYPES: AttendanceType[] = [
  // Darul Musthafa
  {
    id: 'att_type_dm_1',
    tenantId: 'ten_darulmusthafa',
    code: 'KBM-PAGI',
    name: 'KBM Pembelajaran Pagi',
    category: 'PEMBELAJARAN',
    status: 'ACTIVE',
    createdAt: '2025-07-10T08:00:00Z',
    updatedAt: '2025-07-10T08:00:00Z',
  },
  {
    id: 'att_type_dm_2',
    tenantId: 'ten_darulmusthafa',
    code: 'APEL-PAGI',
    name: 'Apel Kedisiplinan Pagi',
    category: 'PAGI',
    status: 'ACTIVE',
    createdAt: '2025-07-10T08:00:00Z',
    updatedAt: '2025-07-10T08:00:00Z',
  },
  {
    id: 'att_type_dm_3',
    tenantId: 'ten_darulmusthafa',
    code: 'SHALAT-SBH',
    name: 'Shalat Subuh Berjamaah & Wirid',
    category: 'IBADAH',
    status: 'ACTIVE',
    createdAt: '2025-07-10T08:00:00Z',
    updatedAt: '2025-07-10T08:00:00Z',
  },
  {
    id: 'att_type_dm_4',
    tenantId: 'ten_darulmusthafa',
    code: 'ASRAMA-MLM',
    name: 'Inspeksi & Jam Belajar Asrama',
    category: 'ASRAMA',
    status: 'ACTIVE',
    createdAt: '2025-07-10T08:00:00Z',
    updatedAt: '2025-07-10T08:00:00Z',
  },
  {
    id: 'att_type_dm_5',
    tenantId: 'ten_darulmusthafa',
    code: 'KGT-TAHFIDZ',
    name: 'Halaqah Tahfidz & Setoran Ziyadah',
    category: 'KEGIATAN',
    status: 'ACTIVE',
    createdAt: '2025-07-10T08:00:00Z',
    updatedAt: '2025-07-10T08:00:00Z',
  },
  {
    id: 'att_type_dm_6',
    tenantId: 'ten_darulmusthafa',
    code: 'EKS-BAHASA',
    name: 'Muhadharah & Pengayaan Bahasa',
    category: 'LAINNYA',
    status: 'ACTIVE',
    createdAt: '2025-07-10T08:00:00Z',
    updatedAt: '2025-07-10T08:00:00Z',
  },

  // Al-Hidayah
  {
    id: 'att_type_ah_1',
    tenantId: 'ten_alhidayah',
    code: 'KBM-MTS',
    name: 'KBM Jam Pelajaran Reguler MTs',
    category: 'PEMBELAJARAN',
    status: 'ACTIVE',
    createdAt: '2026-07-10T08:00:00Z',
    updatedAt: '2026-07-10T08:00:00Z',
  },
  {
    id: 'att_type_ah_2',
    tenantId: 'ten_alhidayah',
    code: 'APEL-MTS',
    name: 'Apel Pagi & Ikrar Santri',
    category: 'PAGI',
    status: 'ACTIVE',
    createdAt: '2026-07-10T08:00:00Z',
    updatedAt: '2026-07-10T08:00:00Z',
  },
  {
    id: 'att_type_ah_3',
    tenantId: 'ten_alhidayah',
    code: 'IBD-ZHUR',
    name: 'Shalat Zhuhur Berjamaah Masjid',
    category: 'IBADAH',
    status: 'ACTIVE',
    createdAt: '2026-07-10T08:00:00Z',
    updatedAt: '2026-07-10T08:00:00Z',
  },
];

export const INITIAL_ATTENDANCE_SESSIONS: AttendanceSession[] = [
  // Sesi 1: Darul Musthafa - Sesi Terbuka (OPEN) untuk KBM Kelas 1-A Takhassus
  {
    id: 'att_sess_dm_1',
    tenantId: 'ten_darulmusthafa',
    attendanceTypeId: 'att_type_dm_1', // KBM Pembelajaran Pagi
    classId: 'cls_dm_1', // Kelas 1-A Takhassus Kitab Kuning
    date: '2026-09-22',
    startTime: '07:30',
    endTime: '09:00',
    status: 'OPEN',
    createdAt: '2026-09-22T07:00:00Z',
    updatedAt: '2026-09-22T07:15:00Z',
  },
  // Sesi 2: Darul Musthafa - Sesi Ditutup (CLOSED) untuk Apel Pagi Kemarin
  {
    id: 'att_sess_dm_2',
    tenantId: 'ten_darulmusthafa',
    attendanceTypeId: 'att_type_dm_2', // Apel Kedisiplinan Pagi
    classId: 'cls_dm_1',
    date: '2026-09-21',
    startTime: '06:30',
    endTime: '07:00',
    status: 'CLOSED',
    createdAt: '2026-09-21T06:00:00Z',
    updatedAt: '2026-09-21T07:05:00Z',
  },
  // Sesi 3: Darul Musthafa - Halaqah Tahfidz Kelas 1-A Tahfidz (CLOSED)
  {
    id: 'att_sess_dm_3',
    tenantId: 'ten_darulmusthafa',
    attendanceTypeId: 'att_type_dm_5', // Halaqah Tahfidz
    classId: 'cls_dm_2',
    date: '2026-09-21',
    startTime: '05:30',
    endTime: '06:30',
    status: 'CLOSED',
    createdAt: '2026-09-21T05:00:00Z',
    updatedAt: '2026-09-21T06:35:00Z',
  },
  // Sesi 4: Al-Hidayah - KBM MTs Kelas 7-A (OPEN)
  {
    id: 'att_sess_ah_1',
    tenantId: 'ten_alhidayah',
    attendanceTypeId: 'att_type_ah_1',
    classId: 'cls_ah_1',
    date: '2026-09-22',
    startTime: '08:00',
    endTime: '09:30',
    status: 'OPEN',
    createdAt: '2026-09-22T07:30:00Z',
    updatedAt: '2026-09-22T07:30:00Z',
  },
];

export const INITIAL_ATTENDANCE_RECORDS: AttendanceRecord[] = [
  // Record untuk Sesi 1 (OPEN) - sebagian sudah diabsen
  {
    id: 'att_rec_1',
    tenantId: 'ten_darulmusthafa',
    sessionId: 'att_sess_dm_1',
    studentId: 'st_1042', // Muhammad Zaidan Al-Faqih
    status: 'HADIR',
    note: 'Tepat waktu dan membawa kitab.',
    recordedAt: '2026-09-22T07:35:00Z',
    recordedBy: 'Ustadz Ahmad Al-Farisi, Lc.',
  },

  // Record untuk Sesi 2 (CLOSED) - lengkap
  {
    id: 'att_rec_2',
    tenantId: 'ten_darulmusthafa',
    sessionId: 'att_sess_dm_2',
    studentId: 'st_1042',
    status: 'HADIR',
    note: 'Hadir baris pertama apel.',
    recordedAt: '2026-09-21T06:40:00Z',
    recordedBy: 'Ustadz Hassan As-Segaf',
  },
  {
    id: 'att_rec_3',
    tenantId: 'ten_darulmusthafa',
    sessionId: 'att_sess_dm_2',
    studentId: 'st_1043', // Ahmad Farhan Syauqi
    status: 'TERLAMBAT',
    note: 'Terlambat 10 menit karena piket kamar.',
    recordedAt: '2026-09-21T06:45:00Z',
    recordedBy: 'Ustadz Hassan As-Segaf',
  },

  // Record untuk Sesi 3 (CLOSED) - Kelas Tahfidz
  {
    id: 'att_rec_4',
    tenantId: 'ten_darulmusthafa',
    sessionId: 'att_sess_dm_3',
    studentId: 'st_1044', // Syamil Hafizh Al-Mubarak
    status: 'HADIR',
    note: 'Setoran Ziyadah Surah An-Naba juz 30 lancar.',
    recordedAt: '2026-09-21T05:45:00Z',
    recordedBy: 'Ustadz Fahmi Zulkarnain',
  },
];

// In-Memory Database Store
class PesantrenDatabase {
  private tenants: Tenant[] = [...INITIAL_TENANTS];
  private users: User[] = [...INITIAL_USERS];
  private auditLogs: AuditLog[] = [...INITIAL_AUDIT_LOGS];
  private institutions: Institution[] = [...INITIAL_INSTITUTIONS];
  private academicYears: AcademicYear[] = [...INITIAL_ACADEMIC_YEARS];
  private programs: Program[] = [...INITIAL_PROGRAMS];
  private buildings: Building[] = [...INITIAL_BUILDINGS];
  private dormitories: Dormitory[] = [...INITIAL_DORMITORIES];
  private rooms: Room[] = [...INITIAL_ROOMS];
  private dormitorySupervisors: DormitorySupervisor[] = [...INITIAL_DORMITORY_SUPERVISORS];
  private employees: Employee[] = [...INITIAL_EMPLOYEES];
  private teachers: Teacher[] = [...INITIAL_TEACHERS];
  private musyrifs: Musyrif[] = [...INITIAL_MUSYRIFS];
  private students: Student[] = [...INITIAL_STUDENTS];
  private parents: Parent[] = [...INITIAL_PARENTS];
  private studentParents: StudentParent[] = [...INITIAL_STUDENT_PARENTS];
  private studentRoomHistories: StudentRoomHistory[] = [...INITIAL_STUDENT_ROOM_HISTORIES];
  private classes: ClassGroup[] = [...INITIAL_CLASSES];
  private studentClassHistories: StudentClassHistory[] = [...INITIAL_STUDENT_CLASS_HISTORIES];
  private subjects: Subject[] = [...INITIAL_SUBJECTS];
  private classSubjects: ClassSubject[] = [...INITIAL_CLASS_SUBJECTS];
  private schedules: Schedule[] = [...INITIAL_SCHEDULES];
  private attendanceTypes: AttendanceType[] = [...INITIAL_ATTENDANCE_TYPES];
  private attendanceSessions: AttendanceSession[] = [...INITIAL_ATTENDANCE_SESSIONS];
  private attendanceRecords: AttendanceRecord[] = [...INITIAL_ATTENDANCE_RECORDS];

  // Tenants
  getTenants(): Tenant[] {
    return this.tenants;
  }

  getTenantById(id: string): Tenant | undefined {
    return this.tenants.find((t) => t.id === id);
  }

  getTenantByCode(code: string): Tenant | undefined {
    return this.tenants.find((t) => t.code.toLowerCase() === code.toLowerCase());
  }

  updateTenant(id: string, updates: Partial<Tenant>): Tenant | null {
    const index = this.tenants.findIndex((t) => t.id === id);
    if (index === -1) return null;
    this.tenants[index] = { ...this.tenants[index], ...updates };
    return this.tenants[index];
  }

  // Users
  getUsers(tenantId?: string): User[] {
    if (!tenantId || tenantId === 'GLOBAL') {
      return this.users;
    }
    return this.users.filter((u) => u.tenantId === tenantId || u.tenantId === 'GLOBAL');
  }

  getUserById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  getUserByUsernameOrEmail(identifier: string, tenantId?: string): User | undefined {
    const cleanId = identifier.trim().toLowerCase();
    return this.users.find((u) => {
      const match = u.username.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId;
      if (!match) return false;
      if (!tenantId || u.role === 'SUPER_ADMIN') return true;
      return u.tenantId === tenantId;
    });
  }

  createUser(data: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      ...data,
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    this.users.unshift(newUser);
    return newUser;
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return null;
    this.users[index] = { ...this.users[index], ...updates };
    return this.users[index];
  }

  deleteUser(id: string): boolean {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return false;
    // Soft delete: status INACTIVE
    this.users[index].status = 'INACTIVE';
    return true;
  }

  // Audit Logs
  getAuditLogs(tenantId?: string): AuditLog[] {
    if (!tenantId || tenantId === 'GLOBAL') {
      return this.auditLogs;
    }
    return this.auditLogs.filter((l) => l.tenantId === tenantId);
  }

  addAuditLog(log: Omit<AuditLog, 'id' | 'createdAt'>): AuditLog {
    const newLog: AuditLog = {
      ...log,
      id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    this.auditLogs.unshift(newLog);
    return newLog;
  }

  // Dashboard Metrics
  getDashboardStats(tenantId: string, role: RoleType, userId: string) {
    const tenant = this.getTenantById(tenantId) || this.tenants[0];
    const tenantUsers = this.getUsers(tenantId);
    
    // Base stats tailored to roles
    return {
      tenant: {
        id: tenant.id,
        name: tenant.name,
        tagline: tenant.tagline,
        city: tenant.city,
        plan: tenant.plan,
        totalStudents: tenant.totalStudents,
        totalTeachers: tenant.totalTeachers,
      },
      stats: {
        totalSantri: tenant.totalStudents,
        kehadiranSantri: 96.8,
        totalGuru: tenant.totalTeachers,
        totalKaryawan: 28,
        kehadiranStaf: 98.2,
        keuangan: {
          tagihanBulanIni: 125000000,
          pemasukanBulanIni: 450000000,
          pengeluaranBulanIni: 285000000,
          piutangSantri: 18500000,
          kasTersedia: 890450000,
        },
        pengasuhan: {
          santriSakit: 6,
          izinKeluarHariIni: 4,
          pelanggaranBulanIni: 12,
          hafalanBulanIniJuz: 342,
        },
        personal: {
          role,
          santriBinaan: role === 'MUSYRIF' ? 36 : undefined,
          jamMengajarMingguIni: role === 'PENGAJAR' ? 18 : undefined,
          saldoWallet: role === 'SANTRI' ? 245000 : undefined,
          anakDipantau: role === 'WALI_SANTRI' ? 'Ahmad Muhammad Faqih (Kelas 3A)' : undefined,
        },
      },
      quickActivities: [
        { time: '04:15 WIB', title: 'Shalat Subuh Berjamaah', status: 'Selesai', note: 'Kehadiran 98%' },
        { time: '05:30 WIB', title: 'Setoran Tahfidz Pagi', status: 'Selesai', note: 'Halaqah 1-12' },
        { time: '07:30 WIB', title: 'Kegiatan Belajar Mengajar', status: 'Berlangsung', note: 'Kurikulum Diniyah' },
        { time: '12:00 WIB', title: 'Shalat Dzuhur & Qailulah', status: 'Terjadwal', note: 'Masjid Jami' },
        { time: '16:00 WIB', title: 'Ekstrakurikuler & Olahraga', status: 'Terjadwal', note: 'Lapangan Utama' },
      ],
      recentAuditTrail: this.getAuditLogs(tenantId).slice(0, 5),
    };
  }

  // ==================== MASTER DATA: INSTITUTIONS ====================
  getInstitution(tenantId: string): Institution | undefined {
    let inst = this.institutions.find((i) => i.tenantId === tenantId);
    if (!inst) {
      // Fallback: create default from tenant
      const tenant = this.getTenantById(tenantId);
      if (tenant) {
        inst = {
          id: `inst_${tenant.code}`,
          tenantId: tenant.id,
          name: tenant.name,
          officialName: tenant.name,
          address: tenant.address,
          village: 'Desa Pesantren',
          district: 'Kecamatan Pesantren',
          city: tenant.city,
          province: 'Jawa Barat',
          postalCode: '16000',
          phone: tenant.phone,
          email: tenant.email,
          website: `https://${tenant.code}.epesantren360.id`,
          logoUrl: '',
          directorName: 'Pimpinan Pesantren',
          foundedYear: 2000,
          description: tenant.tagline,
          updatedAt: new Date().toISOString(),
        };
        this.institutions.push(inst);
      }
    }
    return inst;
  }

  updateInstitution(tenantId: string, updates: Partial<Institution>): Institution | null {
    const index = this.institutions.findIndex((i) => i.tenantId === tenantId);
    if (index === -1) {
      // If doesn't exist, generate then update
      const inst = this.getInstitution(tenantId);
      if (!inst) return null;
      return this.updateInstitution(tenantId, updates);
    }
    this.institutions[index] = {
      ...this.institutions[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.institutions[index];
  }

  // ==================== MASTER DATA: ACADEMIC YEARS ====================
  getAcademicYears(tenantId: string): AcademicYear[] {
    return this.academicYears
      .filter((ay) => ay.tenantId === tenantId)
      .sort((a, b) => (b.name > a.name ? 1 : -1));
  }

  getAcademicYearById(id: string, tenantId?: string): AcademicYear | undefined {
    return this.academicYears.find((ay) => ay.id === id && (!tenantId || ay.tenantId === tenantId));
  }

  createAcademicYear(data: Omit<AcademicYear, 'id' | 'createdAt' | 'updatedAt'>): AcademicYear {
    // If set to active, deactivate others in the same tenant
    if (data.isActive || data.status === 'ACTIVE') {
      this.academicYears.forEach((ay) => {
        if (ay.tenantId === data.tenantId && ay.isActive) {
          ay.isActive = false;
          ay.status = 'INACTIVE';
          ay.updatedAt = new Date().toISOString();
        }
      });
    }

    const newYear: AcademicYear = {
      ...data,
      id: `ay_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      status: data.isActive ? 'ACTIVE' : data.status || 'INACTIVE',
      isActive: !!data.isActive,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.academicYears.unshift(newYear);
    return newYear;
  }

  updateAcademicYear(id: string, tenantId: string, updates: Partial<AcademicYear>): AcademicYear | null {
    const index = this.academicYears.findIndex((ay) => ay.id === id && ay.tenantId === tenantId);
    if (index === -1) return null;

    // If setting active, deactivate existing active
    if (updates.isActive) {
      this.academicYears.forEach((ay, idx) => {
        if (ay.tenantId === tenantId && idx !== index && ay.isActive) {
          ay.isActive = false;
          ay.status = 'INACTIVE';
          ay.updatedAt = new Date().toISOString();
        }
      });
      updates.status = 'ACTIVE';
    }

    this.academicYears[index] = {
      ...this.academicYears[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return this.academicYears[index];
  }

  setActiveAcademicYear(
    id: string,
    tenantId: string
  ): { success: boolean; activeYear?: AcademicYear; previousActiveYear?: AcademicYear; error?: string } {
    const targetIndex = this.academicYears.findIndex((ay) => ay.id === id && ay.tenantId === tenantId);
    if (targetIndex === -1) {
      return { success: false, error: 'Tahun ajaran tidak ditemukan atau bukan milik pesantren Anda.' };
    }

    let previousActiveYear: AcademicYear | undefined;

    // Deactivate currently active
    this.academicYears.forEach((ay) => {
      if (ay.tenantId === tenantId && ay.isActive && ay.id !== id) {
        previousActiveYear = { ...ay };
        ay.isActive = false;
        ay.status = 'INACTIVE';
        ay.updatedAt = new Date().toISOString();
      }
    });

    // Activate target
    this.academicYears[targetIndex].isActive = true;
    this.academicYears[targetIndex].status = 'ACTIVE';
    this.academicYears[targetIndex].updatedAt = new Date().toISOString();

    return {
      success: true,
      activeYear: this.academicYears[targetIndex],
      previousActiveYear,
    };
  }

  archiveAcademicYear(id: string, tenantId: string): AcademicYear | null {
    const index = this.academicYears.findIndex((ay) => ay.id === id && ay.tenantId === tenantId);
    if (index === -1) return null;

    // Cannot archive if currently active
    if (this.academicYears[index].isActive) {
      return null;
    }

    this.academicYears[index].status = 'ARCHIVED';
    this.academicYears[index].updatedAt = new Date().toISOString();
    return this.academicYears[index];
  }

  deleteAcademicYear(id: string, tenantId: string): { success: boolean; error?: string } {
    const index = this.academicYears.findIndex((ay) => ay.id === id && ay.tenantId === tenantId);
    if (index === -1) {
      return { success: false, error: 'Tahun ajaran tidak ditemukan.' };
    }

    if (this.academicYears[index].isActive) {
      return { success: false, error: 'Tahun ajaran yang sedang aktif tidak boleh dihapus.' };
    }

    this.academicYears.splice(index, 1);
    return { success: true };
  }

  // ==================== MASTER DATA: PROGRAMS ====================
  getPrograms(tenantId: string): Program[] {
    return this.programs.filter((p) => p.tenantId === tenantId);
  }

  getProgramById(id: string, tenantId?: string): Program | undefined {
    return this.programs.find((p) => p.id === id && (!tenantId || p.tenantId === tenantId));
  }

  createProgram(data: Omit<Program, 'id' | 'createdAt' | 'updatedAt'>): Program {
    const newProg: Program = {
      ...data,
      id: `prog_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.programs.push(newProg);
    return newProg;
  }

  updateProgram(id: string, tenantId: string, updates: Partial<Program>): Program | null {
    const index = this.programs.findIndex((p) => p.id === id && p.tenantId === tenantId);
    if (index === -1) return null;

    this.programs[index] = {
      ...this.programs[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.programs[index];
  }

  toggleProgramStatus(id: string, tenantId: string): Program | null {
    const index = this.programs.findIndex((p) => p.id === id && p.tenantId === tenantId);
    if (index === -1) return null;

    this.programs[index].status = this.programs[index].status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    this.programs[index].updatedAt = new Date().toISOString();
    return this.programs[index];
  }

  deleteProgram(id: string, tenantId: string): boolean {
    const index = this.programs.findIndex((p) => p.id === id && p.tenantId === tenantId);
    if (index === -1) return false;
    this.programs.splice(index, 1);
    return true;
  }

  // ==================== PHASE 2.2: GEDUNG (BUILDINGS) ====================
  getBuildings(tenantId: string): Building[] {
    return this.buildings
      .filter((b) => b.tenantId === tenantId)
      .map((b) => {
        const dorms = this.dormitories.filter((d) => d.tenantId === tenantId && d.buildingId === b.id);
        const dormIds = dorms.map((d) => d.id);
        const rooms = this.rooms.filter((r) => r.tenantId === tenantId && dormIds.includes(r.dormitoryId));
        return {
          ...b,
          dormitoryCount: dorms.length,
          roomCount: rooms.length,
        };
      });
  }

  getBuildingById(id: string, tenantId?: string): Building | undefined {
    const b = this.buildings.find((item) => item.id === id && (!tenantId || item.tenantId === tenantId));
    if (!b) return undefined;
    const dorms = this.dormitories.filter((d) => d.tenantId === b.tenantId && d.buildingId === b.id);
    const dormIds = dorms.map((d) => d.id);
    const rooms = this.rooms.filter((r) => r.tenantId === b.tenantId && dormIds.includes(r.dormitoryId));
    return {
      ...b,
      dormitoryCount: dorms.length,
      roomCount: rooms.length,
    };
  }

  getBuildingByCode(code: string, tenantId: string): Building | undefined {
    return this.buildings.find(
      (b) => b.tenantId === tenantId && b.code.trim().toLowerCase() === code.trim().toLowerCase()
    );
  }

  createBuilding(data: Omit<Building, 'id' | 'createdAt' | 'updatedAt' | 'dormitoryCount' | 'roomCount'>): Building {
    const newBuilding: Building = {
      ...data,
      id: `bld_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.buildings.push(newBuilding);
    return newBuilding;
  }

  updateBuilding(id: string, tenantId: string, updates: Partial<Building>): Building | null {
    const index = this.buildings.findIndex((b) => b.id === id && b.tenantId === tenantId);
    if (index === -1) return null;

    this.buildings[index] = {
      ...this.buildings[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.buildings[index];
  }

  toggleBuildingStatus(id: string, tenantId: string): Building | null {
    const index = this.buildings.findIndex((b) => b.id === id && b.tenantId === tenantId);
    if (index === -1) return null;

    this.buildings[index].status = this.buildings[index].status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    this.buildings[index].updatedAt = new Date().toISOString();
    return this.buildings[index];
  }

  deleteBuilding(id: string, tenantId: string): { success: boolean; error?: string } {
    const index = this.buildings.findIndex((b) => b.id === id && b.tenantId === tenantId);
    if (index === -1) {
      return { success: false, error: 'Gedung tidak ditemukan.' };
    }

    // Safety rule: do not delete if dormitory exists
    const hasDormitory = this.dormitories.some((d) => d.tenantId === tenantId && d.buildingId === id);
    if (hasDormitory) {
      return {
        success: false,
        error: 'Gedung tidak dapat dihapus karena masih memiliki unit asrama yang terdaftar. Hapus atau pindahkan asrama terlebih dahulu.',
      };
    }

    this.buildings.splice(index, 1);
    return { success: true };
  }

  // ==================== PHASE 2.2: ASRAMA (DORMITORIES) ====================
  getDormitories(tenantId: string): Dormitory[] {
    return this.dormitories
      .filter((d) => d.tenantId === tenantId)
      .map((d) => this.enrichDormitory(d, tenantId));
  }

  getDormitoryById(id: string, tenantId?: string): Dormitory | undefined {
    const d = this.dormitories.find((item) => item.id === id && (!tenantId || item.tenantId === tenantId));
    if (!d) return undefined;
    return this.enrichDormitory(d, d.tenantId);
  }

  getDormitoryByCode(code: string, tenantId: string): Dormitory | undefined {
    return this.dormitories.find(
      (d) => d.tenantId === tenantId && d.code.trim().toLowerCase() === code.trim().toLowerCase()
    );
  }

  private enrichDormitory(d: Dormitory, tenantId: string): Dormitory {
    const building = this.buildings.find((b) => b.id === d.buildingId && b.tenantId === tenantId);
    const dormRooms = this.rooms.filter((r) => r.dormitoryId === d.id && r.tenantId === tenantId);
    const calculatedCapacity = dormRooms.reduce((sum, r) => sum + (r.capacity || 0), 0);

    const supervisors = this.dormitorySupervisors
      .filter((s) => s.dormitoryId === d.id && s.tenantId === tenantId)
      .map((s) => {
        const user = this.users.find((u) => u.id === s.userId && u.tenantId === tenantId);
        return {
          ...s,
          userName: user?.fullName || 'Musyrif',
          userRole: user?.role || 'MUSYRIF',
          userPhone: user?.phone,
          userEmail: user?.email,
        };
      });

    return {
      ...d,
      buildingName: building?.name || 'Gedung Terdaftar',
      buildingCode: building?.code || '-',
      roomCount: dormRooms.length,
      calculatedCapacity,
      supervisors,
    };
  }

  createDormitory(
    data: Omit<Dormitory, 'id' | 'createdAt' | 'updatedAt' | 'buildingName' | 'buildingCode' | 'roomCount' | 'calculatedCapacity' | 'supervisors'>
  ): Dormitory {
    const newDorm: Dormitory = {
      ...data,
      id: `dorm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.dormitories.push(newDorm);
    return this.enrichDormitory(newDorm, data.tenantId);
  }

  updateDormitory(id: string, tenantId: string, updates: Partial<Dormitory>): Dormitory | null {
    const index = this.dormitories.findIndex((d) => d.id === id && d.tenantId === tenantId);
    if (index === -1) return null;

    this.dormitories[index] = {
      ...this.dormitories[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.enrichDormitory(this.dormitories[index], tenantId);
  }

  toggleDormitoryStatus(id: string, tenantId: string): Dormitory | null {
    const index = this.dormitories.findIndex((d) => d.id === id && d.tenantId === tenantId);
    if (index === -1) return null;

    this.dormitories[index].status = this.dormitories[index].status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    this.dormitories[index].updatedAt = new Date().toISOString();
    return this.enrichDormitory(this.dormitories[index], tenantId);
  }

  deleteDormitory(id: string, tenantId: string): { success: boolean; error?: string } {
    const index = this.dormitories.findIndex((d) => d.id === id && d.tenantId === tenantId);
    if (index === -1) {
      return { success: false, error: 'Asrama tidak ditemukan.' };
    }

    // Safety rule: do not delete if rooms exist
    const hasRooms = this.rooms.some((r) => r.tenantId === tenantId && r.dormitoryId === id);
    if (hasRooms) {
      return {
        success: false,
        error: 'Asrama tidak dapat dihapus karena masih memiliki kamar yang terdaftar. Hapus atau pindahkan kamar terlebih dahulu.',
      };
    }

    // Remove supervisors for this dorm
    this.dormitorySupervisors = this.dormitorySupervisors.filter((s) => s.dormitoryId !== id);

    this.dormitories.splice(index, 1);
    return { success: true };
  }

  // ==================== PHASE 2.2: KAMAR (ROOMS) ====================
  getRooms(
    tenantId: string,
    filter?: {
      buildingId?: string;
      dormitoryId?: string;
      status?: RoomStatus;
      genderType?: RoomGenderType;
      search?: string;
    }
  ): Room[] {
    let result = this.rooms.filter((r) => r.tenantId === tenantId);

    if (filter) {
      if (filter.buildingId) {
        result = result.filter((r) => r.buildingId === filter.buildingId);
      }
      if (filter.dormitoryId) {
        result = result.filter((r) => r.dormitoryId === filter.dormitoryId);
      }
      if (filter.status) {
        result = result.filter((r) => r.status === filter.status);
      }
      if (filter.genderType) {
        result = result.filter((r) => r.genderType === filter.genderType);
      }
      if (filter.search && filter.search.trim()) {
        const q = filter.search.trim().toLowerCase();
        result = result.filter(
          (r) =>
            r.name.toLowerCase().includes(q) ||
            r.code.toLowerCase().includes(q) ||
            (r.description && r.description.toLowerCase().includes(q))
        );
      }
    }

    return result.map((r) => {
      const dorm = this.dormitories.find((d) => d.id === r.dormitoryId && d.tenantId === tenantId);
      const building = this.buildings.find((b) => b.id === r.buildingId && b.tenantId === tenantId);
      return {
        ...r,
        dormitoryName: dorm?.name || 'Asrama Terdaftar',
        dormitoryCode: dorm?.code || '-',
        buildingName: building?.name || 'Gedung Terdaftar',
      };
    });
  }

  getRoomById(id: string, tenantId?: string): Room | undefined {
    const r = this.rooms.find((item) => item.id === id && (!tenantId || item.tenantId === tenantId));
    if (!r) return undefined;
    const dorm = this.dormitories.find((d) => d.id === r.dormitoryId && d.tenantId === r.tenantId);
    const building = this.buildings.find((b) => b.id === r.buildingId && b.tenantId === r.tenantId);
    return {
      ...r,
      dormitoryName: dorm?.name || 'Asrama Terdaftar',
      dormitoryCode: dorm?.code || '-',
      buildingName: building?.name || 'Gedung Terdaftar',
    };
  }

  getRoomByCode(code: string, tenantId: string): Room | undefined {
    return this.rooms.find(
      (r) => r.tenantId === tenantId && r.code.trim().toLowerCase() === code.trim().toLowerCase()
    );
  }

  createRoom(
    data: Omit<Room, 'id' | 'createdAt' | 'updatedAt' | 'dormitoryName' | 'dormitoryCode' | 'buildingName'>
  ): Room {
    const newRoom: Room = {
      ...data,
      id: `room_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.rooms.push(newRoom);

    const dorm = this.dormitories.find((d) => d.id === newRoom.dormitoryId && d.tenantId === data.tenantId);
    const building = this.buildings.find((b) => b.id === newRoom.buildingId && b.tenantId === data.tenantId);
    return {
      ...newRoom,
      dormitoryName: dorm?.name || 'Asrama Terdaftar',
      dormitoryCode: dorm?.code || '-',
      buildingName: building?.name || 'Gedung Terdaftar',
    };
  }

  updateRoom(id: string, tenantId: string, updates: Partial<Room>): Room | null {
    const index = this.rooms.findIndex((r) => r.id === id && r.tenantId === tenantId);
    if (index === -1) return null;

    this.rooms[index] = {
      ...this.rooms[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const r = this.rooms[index];
    const dorm = this.dormitories.find((d) => d.id === r.dormitoryId && d.tenantId === tenantId);
    const building = this.buildings.find((b) => b.id === r.buildingId && b.tenantId === tenantId);
    return {
      ...r,
      dormitoryName: dorm?.name || 'Asrama Terdaftar',
      dormitoryCode: dorm?.code || '-',
      buildingName: building?.name || 'Gedung Terdaftar',
    };
  }

  updateRoomStatus(id: string, tenantId: string, status: RoomStatus, description?: string): Room | null {
    const index = this.rooms.findIndex((r) => r.id === id && r.tenantId === tenantId);
    if (index === -1) return null;

    this.rooms[index].status = status;
    if (description !== undefined) {
      this.rooms[index].description = description;
    }
    this.rooms[index].updatedAt = new Date().toISOString();

    const r = this.rooms[index];
    const dorm = this.dormitories.find((d) => d.id === r.dormitoryId && d.tenantId === tenantId);
    const building = this.buildings.find((b) => b.id === r.buildingId && b.tenantId === tenantId);
    return {
      ...r,
      dormitoryName: dorm?.name || 'Asrama Terdaftar',
      dormitoryCode: dorm?.code || '-',
      buildingName: building?.name || 'Gedung Terdaftar',
    };
  }

  deleteRoom(id: string, tenantId: string): { success: boolean; error?: string } {
    const index = this.rooms.findIndex((r) => r.id === id && r.tenantId === tenantId);
    if (index === -1) {
      return { success: false, error: 'Kamar tidak ditemukan.' };
    }
    this.rooms.splice(index, 1);
    return { success: true };
  }

  // ==================== PHASE 2.2: MUSYRIF / SUPERVISORS ====================
  getDormitorySupervisors(dormitoryId: string, tenantId: string): DormitorySupervisor[] {
    return this.dormitorySupervisors
      .filter((s) => s.dormitoryId === dormitoryId && s.tenantId === tenantId)
      .map((s) => {
        const user = this.users.find((u) => u.id === s.userId && u.tenantId === tenantId);
        return {
          ...s,
          userName: user?.fullName || 'Musyrif',
          userRole: user?.role || 'MUSYRIF',
          userPhone: user?.phone,
          userEmail: user?.email,
        };
      });
  }

  addDormitorySupervisor(
    data: Omit<DormitorySupervisor, 'id' | 'createdAt' | 'updatedAt' | 'userName' | 'userRole' | 'userPhone' | 'userEmail'>
  ): { success: boolean; data?: DormitorySupervisor; error?: string } {
    // Check user in same tenant
    const user = this.users.find((u) => u.id === data.userId && u.tenantId === data.tenantId);
    if (!user) {
      return { success: false, error: 'Pengguna tidak ditemukan dalam lembaga ini.' };
    }

    // Check duplicate assignment
    const alreadyAssigned = this.dormitorySupervisors.some(
      (s) => s.dormitoryId === data.dormitoryId && s.userId === data.userId && s.tenantId === data.tenantId
    );
    if (alreadyAssigned) {
      return { success: false, error: 'Pengguna ini sudah terdaftar sebagai pengurus pada asrama ini.' };
    }

    // If new is primary, remove primary status from existing ones in same dorm
    if (data.isPrimary) {
      this.dormitorySupervisors.forEach((s) => {
        if (s.dormitoryId === data.dormitoryId && s.tenantId === data.tenantId) {
          s.isPrimary = false;
        }
      });
    }

    const newSup: DormitorySupervisor = {
      ...data,
      id: `sup_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.dormitorySupervisors.push(newSup);

    return {
      success: true,
      data: {
        ...newSup,
        userName: user.fullName,
        userRole: user.role,
        userPhone: user.phone,
        userEmail: user.email,
      },
    };
  }

  removeDormitorySupervisor(id: string, tenantId: string): boolean {
    const index = this.dormitorySupervisors.findIndex((s) => s.id === id && s.tenantId === tenantId);
    if (index === -1) return false;
    this.dormitorySupervisors.splice(index, 1);
    return true;
  }

  setPrimarySupervisor(id: string, dormitoryId: string, tenantId: string): DormitorySupervisor | null {
    const target = this.dormitorySupervisors.find(
      (s) => s.id === id && s.dormitoryId === dormitoryId && s.tenantId === tenantId
    );
    if (!target) return null;

    this.dormitorySupervisors.forEach((s) => {
      if (s.dormitoryId === dormitoryId && s.tenantId === tenantId) {
        s.isPrimary = s.id === id;
        s.updatedAt = new Date().toISOString();
      }
    });

    const user = this.users.find((u) => u.id === target.userId && u.tenantId === tenantId);
    return {
      ...target,
      isPrimary: true,
      userName: user?.fullName || 'Musyrif',
      userRole: user?.role || 'MUSYRIF',
      userPhone: user?.phone,
      userEmail: user?.email,
    };
  }

  // ==================== PHASE 2.2: RINGKASAN STATISTIK ASRAMA ====================
  getDormitoryStats(tenantId: string): DormitoryStats {
    const tenantBuildings = this.buildings.filter((b) => b.tenantId === tenantId);
    const tenantDorms = this.dormitories.filter((d) => d.tenantId === tenantId);
    const tenantRooms = this.rooms.filter((r) => r.tenantId === tenantId);

    const totalCapacity = tenantRooms.reduce((acc, r) => acc + (r.capacity || 0), 0);
    const activeRooms = tenantRooms.filter((r) => r.status === 'ACTIVE').length;
    const maintenanceRooms = tenantRooms.filter((r) => r.status === 'MAINTENANCE').length;
    const inactiveRooms = tenantRooms.filter((r) => r.status === 'INACTIVE').length;

    return {
      totalBuildings: tenantBuildings.length,
      totalDormitories: tenantDorms.length,
      totalRooms: tenantRooms.length,
      totalCapacity,
      activeRooms,
      maintenanceRooms,
      inactiveRooms,
    };
  }

  // ==================== PHASE 2.3: MASTER DATA SDM, GURU & MUSYRIF ====================

  // Helper: Enrich Employee with User & Sub-Roles
  private enrichEmployee(emp: Employee): Employee {
    const user = emp.userId
      ? this.users.find((u) => u.id === emp.userId && u.tenantId === emp.tenantId)
      : null;

    const teacher = this.teachers.find(
      (t) => t.employeeId === emp.id && t.tenantId === emp.tenantId
    );
    const musyrif = this.musyrifs.find(
      (m) => m.employeeId === emp.id && m.tenantId === emp.tenantId
    );

    const userObj = user
      ? {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          status: user.status,
        }
      : null;

    return {
      ...emp,
      user: userObj,
      userAccount: userObj,
      hasAccount: Boolean(user),
      isTeacher: Boolean(teacher),
      isMusyrif: Boolean(musyrif),
      teacherId: teacher ? teacher.id : null,
      musyrifId: musyrif ? musyrif.id : null,
      teacherProfile: teacher
        ? {
            id: teacher.id,
            teacherCode: teacher.teacherCode,
            specialization: teacher.specialization,
            educationLevel: teacher.educationLevel,
            qualification: teacher.qualification,
          }
        : null,
      musyrifProfile: musyrif
        ? {
            id: musyrif.id,
            musyrifCode: musyrif.musyrifCode,
            specialization: musyrif.specialization,
          }
        : null,
    };
  }

  // Helper: Enrich Teacher with Employee & User Data
  private enrichTeacher(tch: Teacher): Teacher {
    const emp = this.employees.find(
      (e) => e.id === tch.employeeId && e.tenantId === tch.tenantId
    );
    const user = emp?.userId
      ? this.users.find((u) => u.id === emp.userId && u.tenantId === tch.tenantId)
      : null;

    const userObj = user
      ? {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          status: user.status,
        }
      : null;

    return {
      ...tch,
      employee: emp,
      employeeNumber: emp?.employeeNumber || '-',
      fullName: emp?.fullName || 'Nama Pegawai',
      gender: emp?.gender || 'LAKI_LAKI',
      phone: emp?.phone || '-',
      email: emp?.email || '-',
      employmentStatus: emp?.employmentStatus || 'TETAP',
      position: emp?.position || '-',
      userId: emp?.userId || null,
      hasAccount: Boolean(user),
      user: userObj,
      userAccount: userObj,
    };
  }

  // Helper: Enrich Musyrif with Employee, User & Dormitory Assignments
  private enrichMusyrif(msy: Musyrif): Musyrif {
    const emp = this.employees.find(
      (e) => e.id === msy.employeeId && e.tenantId === msy.tenantId
    );
    const user = emp?.userId
      ? this.users.find((u) => u.id === emp.userId && u.tenantId === msy.tenantId)
      : null;

    const userObj = user
      ? {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          status: user.status,
        }
      : null;

    const assignedDormitories: {
      dormitoryId: string;
      dormitoryName: string;
      dormitoryCode: string;
      buildingName: string;
      roleType: string;
      isPrimary: boolean;
    }[] = [];

    if (emp?.userId) {
      const supervisors = this.dormitorySupervisors.filter(
        (s) => s.tenantId === msy.tenantId && s.userId === emp.userId
      );
      supervisors.forEach((s) => {
        const dorm = this.dormitories.find(
          (d) => d.id === s.dormitoryId && d.tenantId === msy.tenantId
        );
        if (dorm) {
          const bld = this.buildings.find(
            (b) => b.id === dorm.buildingId && b.tenantId === msy.tenantId
          );
          assignedDormitories.push({
            dormitoryId: dorm.id,
            dormitoryName: dorm.name,
            dormitoryCode: dorm.code,
            buildingName: bld?.name || '-',
            roleType: s.roleType,
            isPrimary: s.isPrimary,
          });
        }
      });
    }

    return {
      ...msy,
      employee: emp,
      employeeNumber: emp?.employeeNumber || '-',
      fullName: emp?.fullName || 'Nama Pegawai',
      gender: emp?.gender || 'LAKI_LAKI',
      phone: emp?.phone || '-',
      email: emp?.email || '-',
      employmentStatus: emp?.employmentStatus || 'TETAP',
      position: emp?.position || '-',
      userId: emp?.userId || null,
      hasAccount: Boolean(user),
      user: userObj,
      userAccount: userObj,
      assignedDormitories,
    };
  }

  // Ringkasan Statistik SDM
  getStaffStats(tenantId: string): StaffStats {
    const tenantEmployees = this.employees.filter((e) => e.tenantId === tenantId);
    const tenantTeachers = this.teachers.filter((t) => t.tenantId === tenantId);
    const tenantMusyrifs = this.musyrifs.filter((m) => m.tenantId === tenantId);

    const activeEmployees = tenantEmployees.filter((e) => e.status === 'ACTIVE').length;
    const inactiveEmployees = tenantEmployees.length - activeEmployees;
    const withUserAccount = tenantEmployees.filter((e) => !!e.userId).length;
    const withoutUserAccount = tenantEmployees.length - withUserAccount;

    const byType = {
      GURU: tenantEmployees.filter((e) => e.type === 'GURU').length,
      MUSYRIF: tenantEmployees.filter((e) => e.type === 'MUSYRIF').length,
      STAF: tenantEmployees.filter((e) => e.type === 'STAFF' || (e.type as string) === 'STAF').length,
      STRUKTURAL: tenantEmployees.filter((e) => (e.type as string) === 'STRUKTURAL').length,
    };

    const byEmploymentStatus = {
      TETAP: tenantEmployees.filter((e) => e.employmentStatus === 'TETAP').length,
      KONTRAK: tenantEmployees.filter((e) => e.employmentStatus === 'KONTRAK').length,
      HONORER: tenantEmployees.filter((e) => e.employmentStatus === 'HONORER').length,
      MAGANG: tenantEmployees.filter((e) => e.employmentStatus === 'MAGANG').length,
    };

    const byGender = {
      LAKI_LAKI: tenantEmployees.filter((e) => e.gender === 'LAKI_LAKI').length,
      PEREMPUAN: tenantEmployees.filter((e) => e.gender === 'PEREMPUAN').length,
    };

    return {
      totalEmployees: tenantEmployees.length,
      totalTeachers: tenantTeachers.length,
      totalMusyrifs: tenantMusyrifs.length,
      activeEmployees,
      activeTeachers: tenantTeachers.filter((t) => t.teachingStatus === 'ACTIVE').length,
      activeMusyrifs: tenantMusyrifs.filter((m) => m.status === 'ACTIVE').length,
      inactiveEmployees,
      withUserAccount,
      withoutUserAccount,
      byType,
      byEmploymentStatus,
      byGender,
    };
  }

  // ==================== EMPLOYEES CRUD ====================

  getEmployees(
    tenantId: string,
    filters?: { search?: string; status?: string; type?: string }
  ): Employee[] {
    let result = this.employees.filter((e) => e.tenantId === tenantId);

    if (filters?.status && filters.status !== 'ALL') {
      result = result.filter((e) => e.status === filters.status);
    }

    if (filters?.type && filters.type !== 'ALL') {
      result = result.filter((e) => e.type === filters.type);
    }

    if (filters?.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (e) =>
          e.fullName.toLowerCase().includes(q) ||
          e.employeeNumber.toLowerCase().includes(q) ||
          (e.phone && e.phone.toLowerCase().includes(q)) ||
          (e.email && e.email.toLowerCase().includes(q)) ||
          (e.position && e.position.toLowerCase().includes(q))
      );
    }

    return result.map((e) => this.enrichEmployee(e));
  }

  getEmployeeById(id: string, tenantId: string): Employee | null {
    const employee = this.employees.find((e) => e.id === id && e.tenantId === tenantId);
    if (!employee) return null;
    return this.enrichEmployee(employee);
  }

  getEmployeeByNumber(employeeNumber: string, tenantId: string): Employee | null {
    const employee = this.employees.find(
      (e) =>
        e.tenantId === tenantId &&
        e.employeeNumber.trim().toUpperCase() === employeeNumber.trim().toUpperCase()
    );
    if (!employee) return null;
    return this.enrichEmployee(employee);
  }

  getEmployeeByUserId(userId: string, tenantId: string): Employee | null {
    const employee = this.employees.find(
      (e) => e.tenantId === tenantId && e.userId === userId
    );
    if (!employee) return null;
    return this.enrichEmployee(employee);
  }

  createEmployee(
    data: Omit<Employee, 'id' | 'createdAt' | 'updatedAt' | 'userAccount' | 'hasAccount' | 'isTeacher' | 'isMusyrif' | 'teacherId' | 'musyrifId'>
  ): Employee {
    const now = new Date().toISOString();
    const newEmployee: Employee = {
      ...data,
      id: `emp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: now,
      updatedAt: now,
    };

    this.employees.push(newEmployee);
    return this.enrichEmployee(newEmployee);
  }

  updateEmployee(
    id: string,
    tenantId: string,
    data: Partial<Omit<Employee, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>>
  ): Employee | null {
    const index = this.employees.findIndex((e) => e.id === id && e.tenantId === tenantId);
    if (index === -1) return null;

    const existing = this.employees[index];
    const updated: Employee = {
      ...existing,
      ...data,
      id: existing.id,
      tenantId: existing.tenantId,
      updatedAt: new Date().toISOString(),
    };

    this.employees[index] = updated;
    return this.enrichEmployee(updated);
  }

  toggleEmployeeStatus(id: string, tenantId: string): Employee | null {
    const index = this.employees.findIndex((e) => e.id === id && e.tenantId === tenantId);
    if (index === -1) return null;

    const current = this.employees[index];
    const newStatus: EmployeeStatus = current.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    this.employees[index] = {
      ...current,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };

    return this.enrichEmployee(this.employees[index]);
  }

  deleteEmployee(id: string, tenantId: string): { success: boolean; error?: string } {
    const employee = this.employees.find((e) => e.id === id && e.tenantId === tenantId);
    if (!employee) {
      return { success: false, error: 'Data pegawai tidak ditemukan' };
    }

    // Check if employee is associated with teacher or musyrif
    const isTeacher = this.teachers.some(
      (t) => t.employeeId === id && t.tenantId === tenantId
    );
    if (isTeacher) {
      return {
        success: false,
        error: 'Pegawai tidak dapat dihapus karena masih terdaftar sebagai Guru. Hapus data Guru terlebih dahulu.',
      };
    }

    const isMusyrif = this.musyrifs.some(
      (m) => m.employeeId === id && m.tenantId === tenantId
    );
    if (isMusyrif) {
      return {
        success: false,
        error: 'Pegawai tidak dapat dihapus karena masih terdaftar sebagai Musyrif. Hapus data Musyrif terlebih dahulu.',
      };
    }

    this.employees = this.employees.filter((e) => !(e.id === id && e.tenantId === tenantId));
    return { success: true };
  }

  linkUserToEmployee(
    employeeId: string,
    userId: string,
    tenantId: string
  ): { success: boolean; error?: string; employee?: Employee } {
    const employee = this.employees.find((e) => e.id === employeeId && e.tenantId === tenantId);
    if (!employee) {
      return { success: false, error: 'Data pegawai tidak ditemukan' };
    }

    // Verify user exists and belongs to same tenant
    const targetUser = this.users.find((u) => u.id === userId && u.tenantId === tenantId);
    if (!targetUser) {
      return {
        success: false,
        error: 'Akun user tidak ditemukan atau bukan milik lembaga/pesantren ini',
      };
    }

    // Verify user is not already linked to another employee in this tenant
    const existingLink = this.employees.find(
      (e) => e.tenantId === tenantId && e.userId === userId && e.id !== employeeId
    );
    if (existingLink) {
      return {
        success: false,
        error: `Akun ${targetUser.username} sudah terhubung ke pegawai lain (${existingLink.fullName})`,
      };
    }

    employee.userId = userId;
    employee.updatedAt = new Date().toISOString();

    return {
      success: true,
      employee: this.enrichEmployee(employee),
    };
  }

  unlinkUserFromEmployee(
    employeeId: string,
    tenantId: string
  ): { success: boolean; error?: string; employee?: Employee } {
    const employee = this.employees.find((e) => e.id === employeeId && e.tenantId === tenantId);
    if (!employee) {
      return { success: false, error: 'Data pegawai tidak ditemukan' };
    }

    employee.userId = null;
    employee.updatedAt = new Date().toISOString();

    return {
      success: true,
      employee: this.enrichEmployee(employee),
    };
  }

  // ==================== TEACHERS CRUD ====================

  getTeachers(tenantId: string, filters?: { search?: string; status?: string }): Teacher[] {
    let result = this.teachers.filter((t) => t.tenantId === tenantId);

    if (filters?.status && filters.status !== 'ALL') {
      result = result.filter((t) => t.teachingStatus === filters.status);
    }

    const enriched = result.map((t) => this.enrichTeacher(t));

    if (filters?.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      return enriched.filter(
        (t) =>
          t.teacherCode.toLowerCase().includes(q) ||
          (t.fullName && t.fullName.toLowerCase().includes(q)) ||
          (t.specialization && t.specialization.toLowerCase().includes(q)) ||
          (t.educationLevel && t.educationLevel.toLowerCase().includes(q)) ||
          (t.qualification && t.qualification.toLowerCase().includes(q)) ||
          (t.phone && t.phone.toLowerCase().includes(q))
      );
    }

    return enriched;
  }

  getTeacherById(id: string, tenantId: string): Teacher | null {
    const teacher = this.teachers.find((t) => t.id === id && t.tenantId === tenantId);
    if (!teacher) return null;
    return this.enrichTeacher(teacher);
  }

  getTeacherByCode(teacherCode: string, tenantId: string): Teacher | null {
    const teacher = this.teachers.find(
      (t) =>
        t.tenantId === tenantId &&
        t.teacherCode.trim().toUpperCase() === teacherCode.trim().toUpperCase()
    );
    if (!teacher) return null;
    return this.enrichTeacher(teacher);
  }

  getTeacherByEmployeeId(employeeId: string, tenantId: string): Teacher | null {
    const teacher = this.teachers.find(
      (t) => t.tenantId === tenantId && t.employeeId === employeeId
    );
    if (!teacher) return null;
    return this.enrichTeacher(teacher);
  }

  createTeacher(
    data: Omit<Teacher, 'id' | 'createdAt' | 'updatedAt' | 'employeeNumber' | 'fullName' | 'gender' | 'phone' | 'email' | 'employmentStatus' | 'position' | 'userId' | 'hasAccount' | 'userAccount'>
  ): Teacher {
    const now = new Date().toISOString();
    const newTeacher: Teacher = {
      ...data,
      id: `tch_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: now,
      updatedAt: now,
    };

    this.teachers.push(newTeacher);

    // Ensure employee type is GURU or has teacher status
    const emp = this.employees.find(
      (e) => e.id === data.employeeId && e.tenantId === data.tenantId
    );
    if (emp && emp.type !== 'GURU') {
      emp.type = 'GURU';
      emp.updatedAt = now;
    }

    return this.enrichTeacher(newTeacher);
  }

  updateTeacher(
    id: string,
    tenantId: string,
    data: Partial<Omit<Teacher, 'id' | 'tenantId' | 'employeeId' | 'createdAt' | 'updatedAt'>>
  ): Teacher | null {
    const index = this.teachers.findIndex((t) => t.id === id && t.tenantId === tenantId);
    if (index === -1) return null;

    const existing = this.teachers[index];
    const updated: Teacher = {
      ...existing,
      ...data,
      id: existing.id,
      tenantId: existing.tenantId,
      employeeId: existing.employeeId,
      updatedAt: new Date().toISOString(),
    };

    this.teachers[index] = updated;
    return this.enrichTeacher(updated);
  }

  toggleTeacherStatus(id: string, tenantId: string): Teacher | null {
    const index = this.teachers.findIndex((t) => t.id === id && t.tenantId === tenantId);
    if (index === -1) return null;

    const current = this.teachers[index];
    const newStatus: TeachingStatus =
      current.teachingStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    this.teachers[index] = {
      ...current,
      teachingStatus: newStatus,
      updatedAt: new Date().toISOString(),
    };

    return this.enrichTeacher(this.teachers[index]);
  }

  deleteTeacher(id: string, tenantId: string): { success: boolean; error?: string } {
    const exists = this.teachers.some((t) => t.id === id && t.tenantId === tenantId);
    if (!exists) {
      return { success: false, error: 'Data guru tidak ditemukan' };
    }

    this.teachers = this.teachers.filter((t) => !(t.id === id && t.tenantId === tenantId));
    return { success: true };
  }

  // ==================== MUSYRIFS CRUD ====================

  getMusyrifs(tenantId: string, filters?: { search?: string; status?: string }): Musyrif[] {
    let result = this.musyrifs.filter((m) => m.tenantId === tenantId);

    if (filters?.status && filters.status !== 'ALL') {
      result = result.filter((m) => m.status === filters.status);
    }

    const enriched = result.map((m) => this.enrichMusyrif(m));

    if (filters?.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      return enriched.filter(
        (m) =>
          m.musyrifCode.toLowerCase().includes(q) ||
          (m.fullName && m.fullName.toLowerCase().includes(q)) ||
          (m.specialization && m.specialization.toLowerCase().includes(q)) ||
          (m.phone && m.phone.toLowerCase().includes(q)) ||
          (m.assignedDormitories &&
            m.assignedDormitories.some((d) =>
              d.dormitoryName.toLowerCase().includes(q) ||
              d.dormitoryCode.toLowerCase().includes(q)
            ))
      );
    }

    return enriched;
  }

  getMusyrifById(id: string, tenantId: string): Musyrif | null {
    const musyrif = this.musyrifs.find((m) => m.id === id && m.tenantId === tenantId);
    if (!musyrif) return null;
    return this.enrichMusyrif(musyrif);
  }

  getMusyrifByCode(musyrifCode: string, tenantId: string): Musyrif | null {
    const musyrif = this.musyrifs.find(
      (m) =>
        m.tenantId === tenantId &&
        m.musyrifCode.trim().toUpperCase() === musyrifCode.trim().toUpperCase()
    );
    if (!musyrif) return null;
    return this.enrichMusyrif(musyrif);
  }

  getMusyrifByEmployeeId(employeeId: string, tenantId: string): Musyrif | null {
    const musyrif = this.musyrifs.find(
      (m) => m.tenantId === tenantId && m.employeeId === employeeId
    );
    if (!musyrif) return null;
    return this.enrichMusyrif(musyrif);
  }

  createMusyrif(
    data: Omit<Musyrif, 'id' | 'createdAt' | 'updatedAt' | 'employeeNumber' | 'fullName' | 'gender' | 'phone' | 'email' | 'employmentStatus' | 'position' | 'userId' | 'hasAccount' | 'userAccount' | 'assignedDormitories'>
  ): Musyrif {
    const now = new Date().toISOString();
    const newMusyrif: Musyrif = {
      ...data,
      id: `msy_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: now,
      updatedAt: now,
    };

    this.musyrifs.push(newMusyrif);

    // Ensure employee type is MUSYRIF or has musyrif status
    const emp = this.employees.find(
      (e) => e.id === data.employeeId && e.tenantId === data.tenantId
    );
    if (emp && emp.type !== 'MUSYRIF') {
      emp.type = 'MUSYRIF';
      emp.updatedAt = now;
    }

    return this.enrichMusyrif(newMusyrif);
  }

  updateMusyrif(
    id: string,
    tenantId: string,
    data: Partial<Omit<Musyrif, 'id' | 'tenantId' | 'employeeId' | 'createdAt' | 'updatedAt'>>
  ): Musyrif | null {
    const index = this.musyrifs.findIndex((m) => m.id === id && m.tenantId === tenantId);
    if (index === -1) return null;

    const existing = this.musyrifs[index];
    const updated: Musyrif = {
      ...existing,
      ...data,
      id: existing.id,
      tenantId: existing.tenantId,
      employeeId: existing.employeeId,
      updatedAt: new Date().toISOString(),
    };

    this.musyrifs[index] = updated;
    return this.enrichMusyrif(updated);
  }

  toggleMusyrifStatus(id: string, tenantId: string): Musyrif | null {
    const index = this.musyrifs.findIndex((m) => m.id === id && m.tenantId === tenantId);
    if (index === -1) return null;

    const current = this.musyrifs[index];
    const newStatus: MusyrifStatus = current.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    this.musyrifs[index] = {
      ...current,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };

    return this.enrichMusyrif(this.musyrifs[index]);
  }

  deleteMusyrif(id: string, tenantId: string): { success: boolean; error?: string } {
    const exists = this.musyrifs.some((m) => m.id === id && m.tenantId === tenantId);
    if (!exists) {
      return { success: false, error: 'Data musyrif tidak ditemukan' };
    }

    this.musyrifs = this.musyrifs.filter((m) => !(m.id === id && m.tenantId === tenantId));
    return { success: true };
  }

  // ==================== PHASE 2.4: MASTER DATA SANTRI & WALI SANTRI ====================

  private enrichStudent(student: Student): Student {
    const user = student.userId
      ? this.users.find((u) => u.id === student.userId && u.tenantId === student.tenantId)
      : null;

    const program = student.programId
      ? this.programs.find((p) => p.id === student.programId && p.tenantId === student.tenantId) || null
      : null;

    const academicYear = student.academicYearId
      ? this.academicYears.find((ay) => ay.id === student.academicYearId && ay.tenantId === student.tenantId) || null
      : null;

    let currentRoom: (Room & { dormitoryName?: string; buildingName?: string }) | null = null;
    if (student.currentRoomId) {
      const room = this.rooms.find((r) => r.id === student.currentRoomId && r.tenantId === student.tenantId);
      if (room) {
        const dorm = this.dormitories.find((d) => d.id === room.dormitoryId);
        const bld = dorm ? this.buildings.find((b) => b.id === dorm.buildingId) : null;
        currentRoom = {
          ...room,
          dormitoryName: dorm?.name,
          buildingName: bld?.name,
        };
      }
    }

    const parents = this.studentParents
      .filter((sp) => sp.studentId === student.id && sp.tenantId === student.tenantId)
      .map((sp) => {
        const rawParent = this.parents.find((p) => p.id === sp.parentId && p.tenantId === student.tenantId);
        const enrichedP = rawParent ? this.enrichParent(rawParent) : ({} as Parent);
        return {
          ...sp,
          parent: enrichedP,
        };
      });

    const roomHistories = this.studentRoomHistories
      .filter((h) => h.studentId === student.id && h.tenantId === student.tenantId)
      .sort((a, b) => new Date(b.checkInDate).getTime() - new Date(a.checkInDate).getTime())
      .map((h) => {
        const room = this.rooms.find((r) => r.id === h.roomId);
        let roomDetails: (Room & { dormitoryName?: string; buildingName?: string }) | null = null;
        if (room) {
          const dorm = this.dormitories.find((d) => d.id === room.dormitoryId);
          const bld = dorm ? this.buildings.find((b) => b.id === dorm.buildingId) : null;
          roomDetails = {
            ...room,
            dormitoryName: dorm?.name,
            buildingName: bld?.name,
          };
        }
        return {
          ...h,
          room: roomDetails,
        };
      });

    let currentClass: (ClassGroup & { homeroomTeacherName?: string; academicYearName?: string; programName?: string }) | null = null;
    if (student.currentClassId) {
      const cls = this.classes.find((c) => c.id === student.currentClassId && c.tenantId === student.tenantId);
      if (cls) {
        const ay = this.academicYears.find((a) => a.id === cls.academicYearId);
        const prog = this.programs.find((p) => p.id === cls.programId);
        let teacherName = undefined;
        if (cls.homeroomTeacherId) {
          const tch = this.teachers.find((t) => t.id === cls.homeroomTeacherId);
          const emp = tch ? this.employees.find((e) => e.id === tch.employeeId) : null;
          teacherName = emp?.fullName;
        }
        currentClass = {
          ...cls,
          academicYearName: ay?.name,
          programName: prog?.name,
          homeroomTeacherName: teacherName,
        };
      }
    }

    const classHistories = this.studentClassHistories
      .filter((h) => h.studentId === student.id && h.tenantId === student.tenantId)
      .sort((a, b) => new Date(b.enrollDate).getTime() - new Date(a.enrollDate).getTime())
      .map((h) => {
        const cls = this.classes.find((c) => c.id === h.classId);
        let classDetails: (ClassGroup & { homeroomTeacherName?: string; academicYearName?: string; programName?: string }) | null = null;
        if (cls) {
          const ay = this.academicYears.find((a) => a.id === cls.academicYearId);
          const prog = this.programs.find((p) => p.id === cls.programId);
          let teacherName = undefined;
          if (cls.homeroomTeacherId) {
            const tch = this.teachers.find((t) => t.id === cls.homeroomTeacherId);
            const emp = tch ? this.employees.find((e) => e.id === tch.employeeId) : null;
            teacherName = emp?.fullName;
          }
          classDetails = {
            ...cls,
            academicYearName: ay?.name,
            programName: prog?.name,
            homeroomTeacherName: teacherName,
          };
        }
        return {
          ...h,
          classGroup: classDetails,
        };
      });

    return {
      ...student,
      user: user
        ? {
            id: user.id,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            status: user.status,
          }
        : null,
      program,
      academicYear,
      currentRoom,
      currentClass,
      parents,
      roomHistories,
      classHistories,
    };
  }

  private enrichParent(parent: Parent): Parent {
    const user = parent.userId
      ? this.users.find((u) => u.id === parent.userId && u.tenantId === parent.tenantId)
      : null;

    const children = this.studentParents
      .filter((sp) => sp.parentId === parent.id && sp.tenantId === parent.tenantId)
      .map((sp) => {
        const rawStudent = this.students.find((s) => s.id === sp.studentId && s.tenantId === parent.tenantId);
        const basicStudent = rawStudent ? { ...rawStudent } : ({} as Student);
        return {
          ...sp,
          student: basicStudent,
        };
      });

    return {
      ...parent,
      user: user
        ? {
            id: user.id,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            status: user.status,
          }
        : null,
      children,
    };
  }

  // Students Methods
  getStudents(
    tenantId: string,
    filters?: {
      search?: string;
      status?: string;
      gender?: string;
      programId?: string;
      academicYearId?: string;
      hasRoom?: string; // 'true' | 'false' | 'all'
    }
  ): Student[] {
    return this.students
      .filter((s) => {
        if (s.tenantId !== tenantId) return false;

        if (filters?.search) {
          const q = filters.search.toLowerCase().trim();
          const matchName = s.fullName.toLowerCase().includes(q);
          const matchNis = s.nis.toLowerCase().includes(q);
          const matchNisn = s.nisn?.toLowerCase().includes(q) || false;
          if (!matchName && !matchNis && !matchNisn) return false;
        }

        if (filters?.status && filters.status !== 'ALL') {
          if (s.status !== filters.status) return false;
        }

        if (filters?.gender && filters.gender !== 'ALL') {
          if (s.gender !== filters.gender) return false;
        }

        if (filters?.programId && filters.programId !== 'ALL') {
          if (s.programId !== filters.programId) return false;
        }

        if (filters?.academicYearId && filters.academicYearId !== 'ALL') {
          if (s.academicYearId !== filters.academicYearId) return false;
        }

        if (filters?.hasRoom) {
          if (filters.hasRoom === 'true' && !s.currentRoomId) return false;
          if (filters.hasRoom === 'false' && s.currentRoomId) return false;
        }

        return true;
      })
      .map((s) => this.enrichStudent(s));
  }

  getStudentById(id: string, tenantId: string): Student | null {
    const student = this.students.find((s) => s.id === id && s.tenantId === tenantId);
    if (!student) return null;
    return this.enrichStudent(student);
  }

  getStudentByNis(nis: string, tenantId: string): Student | null {
    const student = this.students.find(
      (s) => s.tenantId === tenantId && s.nis.trim().toUpperCase() === nis.trim().toUpperCase()
    );
    if (!student) return null;
    return this.enrichStudent(student);
  }

  createStudent(
    data: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>
  ): { success: boolean; student?: Student; error?: string } {
    // 1. Validate NIS uniqueness within tenant
    const nisExists = this.students.some(
      (s) => s.tenantId === data.tenantId && s.nis.trim().toUpperCase() === data.nis.trim().toUpperCase()
    );
    if (nisExists) {
      return { success: false, error: `NIS '${data.nis}' sudah terdaftar di pesantren ini.` };
    }

    // 2. Validate Program if provided
    if (data.programId) {
      const prog = this.programs.find((p) => p.id === data.programId && p.tenantId === data.tenantId);
      if (!prog) {
        return { success: false, error: 'Program pendidikan tidak ditemukan dalam lembaga ini.' };
      }
    }

    // 3. Validate Academic Year if provided
    if (data.academicYearId) {
      const ay = this.academicYears.find((a) => a.id === data.academicYearId && a.tenantId === data.tenantId);
      if (!ay) {
        return { success: false, error: 'Tahun ajaran tidak ditemukan dalam lembaga ini.' };
      }
    }

    // 4. Validate Room if provided
    if (data.currentRoomId) {
      const room = this.rooms.find((r) => r.id === data.currentRoomId && r.tenantId === data.tenantId);
      if (!room) {
        return { success: false, error: 'Kamar asrama tidak ditemukan dalam lembaga ini.' };
      }
      // Gender check
      const expectedGenderType = data.gender === 'LAKI_LAKI' ? 'PUTRA' : 'PUTRI';
      if (room.genderType !== expectedGenderType) {
        return {
          success: false,
          error: `Jenis kelamin santri (${data.gender === 'LAKI_LAKI' ? 'Putra' : 'Putri'}) tidak sesuai dengan peruntukan kamar (${room.genderType === 'PUTRA' ? 'Asrama Putra' : 'Asrama Putri'}).`,
        };
      }
      // Capacity check
      const occupied = this.students.filter(
        (s) => s.tenantId === data.tenantId && s.currentRoomId === data.currentRoomId && s.status === 'ACTIVE'
      ).length;
      if (occupied >= room.capacity) {
        return {
          success: false,
          error: `Kamar ${room.name} telah penuh (kapasitas: ${room.capacity}, terisi: ${occupied}).`,
        };
      }
    }

    const now = new Date().toISOString();
    const newStudent: Student = {
      ...data,
      id: `st_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: now,
      updatedAt: now,
    };

    this.students.push(newStudent);

    // If room assigned, record in history
    if (newStudent.currentRoomId) {
      this.studentRoomHistories.push({
        id: `srh_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        tenantId: newStudent.tenantId,
        studentId: newStudent.id,
        roomId: newStudent.currentRoomId,
        checkInDate: now,
        checkOutDate: null,
        notes: 'Penempatan awal santri baru',
        createdAt: now,
        updatedAt: now,
      });
    }

    return { success: true, student: this.enrichStudent(newStudent) };
  }

  updateStudent(
    id: string,
    tenantId: string,
    data: Partial<Omit<Student, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>>
  ): { success: boolean; student?: Student; error?: string } {
    const index = this.students.findIndex((s) => s.id === id && s.tenantId === tenantId);
    if (index === -1) {
      return { success: false, error: 'Data santri tidak ditemukan.' };
    }

    const existing = this.students[index];

    // Check NIS uniqueness if updated
    if (data.nis && data.nis.trim().toUpperCase() !== existing.nis.trim().toUpperCase()) {
      const nisExists = this.students.some(
        (s) => s.id !== id && s.tenantId === tenantId && s.nis.trim().toUpperCase() === data.nis!.trim().toUpperCase()
      );
      if (nisExists) {
        return { success: false, error: `NIS '${data.nis}' sudah digunakan santri lain di lembaga ini.` };
      }
    }

    // Validate Program if changed
    if (data.programId) {
      const prog = this.programs.find((p) => p.id === data.programId && p.tenantId === tenantId);
      if (!prog) {
        return { success: false, error: 'Program pendidikan tidak ditemukan dalam lembaga ini.' };
      }
    }

    // Validate Academic Year if changed
    if (data.academicYearId) {
      const ay = this.academicYears.find((a) => a.id === data.academicYearId && a.tenantId === tenantId);
      if (!ay) {
        return { success: false, error: 'Tahun ajaran tidak ditemukan dalam lembaga ini.' };
      }
    }

    // Filter out undefined fields so they do not overwrite existing values
    const cleanData: any = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        cleanData[key] = value;
      }
    }

    const updated: Student = {
      ...existing,
      ...cleanData,
      id: existing.id,
      tenantId: existing.tenantId,
      // Retain existing room if not explicitly modified via room API
      currentRoomId: cleanData.currentRoomId !== undefined ? cleanData.currentRoomId : existing.currentRoomId,
      updatedAt: new Date().toISOString(),
    };

    this.students[index] = updated;
    return { success: true, student: this.enrichStudent(updated) };
  }

  toggleStudentStatus(id: string, tenantId: string, newStatus?: StudentStatus): Student | null {
    const index = this.students.findIndex((s) => s.id === id && s.tenantId === tenantId);
    if (index === -1) return null;

    const current = this.students[index];
    const statusToSet: StudentStatus =
      newStatus || (current.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE');

    this.students[index] = {
      ...current,
      status: statusToSet,
      updatedAt: new Date().toISOString(),
    };

    return this.enrichStudent(this.students[index]);
  }

  deleteStudent(id: string, tenantId: string): { success: boolean; error?: string } {
    const index = this.students.findIndex((s) => s.id === id && s.tenantId === tenantId);
    if (index === -1) {
      return { success: false, error: 'Data santri tidak ditemukan.' };
    }

    // Clean up student parent pivot
    this.studentParents = this.studentParents.filter((sp) => !(sp.studentId === id && sp.tenantId === tenantId));
    // Clean up room histories
    this.studentRoomHistories = this.studentRoomHistories.filter((h) => !(h.studentId === id && h.tenantId === tenantId));
    // Clean up class histories
    this.studentClassHistories = this.studentClassHistories.filter((h) => !(h.studentId === id && h.tenantId === tenantId));

    // Remove student
    this.students.splice(index, 1);
    return { success: true };
  }

  linkUserToStudent(
    studentId: string,
    userId: string,
    tenantId: string
  ): { success: boolean; error?: string; student?: Student } {
    const studentIndex = this.students.findIndex((s) => s.id === studentId && s.tenantId === tenantId);
    if (studentIndex === -1) {
      return { success: false, error: 'Data santri tidak ditemukan.' };
    }

    const user = this.users.find((u) => u.id === userId && u.tenantId === tenantId);
    if (!user) {
      return { success: false, error: 'Akun pengguna tidak ditemukan di pesantren ini.' };
    }

    const student = this.students[studentIndex];
    student.userId = user.id;
    student.updatedAt = new Date().toISOString();

    user.assignedEntityId = student.id;
    user.assignedEntityName = `NIS: ${student.nis} | ${student.fullName}`;

    return { success: true, student: this.enrichStudent(student) };
  }

  unlinkUserFromStudent(
    studentId: string,
    tenantId: string
  ): { success: boolean; error?: string; student?: Student } {
    const studentIndex = this.students.findIndex((s) => s.id === studentId && s.tenantId === tenantId);
    if (studentIndex === -1) {
      return { success: false, error: 'Data santri tidak ditemukan.' };
    }

    const student = this.students[studentIndex];
    if (student.userId) {
      const user = this.users.find((u) => u.id === student.userId && u.tenantId === tenantId);
      if (user && user.assignedEntityId === student.id) {
        user.assignedEntityId = undefined;
        user.assignedEntityName = undefined;
      }
    }

    student.userId = null;
    student.updatedAt = new Date().toISOString();

    return { success: true, student: this.enrichStudent(student) };
  }

  assignStudentRoom(
    studentId: string,
    roomId: string,
    tenantId: string,
    notes?: string
  ): { success: boolean; error?: string; student?: Student } {
    const studentIndex = this.students.findIndex((s) => s.id === studentId && s.tenantId === tenantId);
    if (studentIndex === -1) {
      return { success: false, error: 'Santri tidak ditemukan di lembaga ini.' };
    }

    const student = this.students[studentIndex];

    const room = this.rooms.find((r) => r.id === roomId && r.tenantId === tenantId);
    if (!room) {
      return { success: false, error: 'Kamar asrama tidak ditemukan di lembaga ini.' };
    }

    // Gender check
    const expectedGenderType = student.gender === 'LAKI_LAKI' ? 'PUTRA' : 'PUTRI';
    if (room.genderType !== expectedGenderType) {
      return {
        success: false,
        error: `Jenis kelamin santri (${student.gender === 'LAKI_LAKI' ? 'Putra' : 'Putri'}) tidak sesuai dengan peruntukan kamar (${room.genderType === 'PUTRA' ? 'Asrama Putra' : 'Asrama Putri'}).`,
      };
    }

    // Capacity check
    const currentOccupants = this.students.filter(
      (s) => s.tenantId === tenantId && s.currentRoomId === roomId && s.status === 'ACTIVE' && s.id !== studentId
    ).length;

    if (currentOccupants >= room.capacity) {
      return {
        success: false,
        error: `Kamar ${room.name} telah penuh. Kapasitas maksimum ${room.capacity} santri (terisi ${currentOccupants}).`,
      };
    }

    const now = new Date().toISOString();

    // Close old room history if moved from another room
    if (student.currentRoomId && student.currentRoomId !== roomId) {
      const activeHistories = this.studentRoomHistories.filter(
        (h) => h.studentId === student.id && h.roomId === student.currentRoomId && !h.checkOutDate
      );
      for (const h of activeHistories) {
        h.checkOutDate = now;
        h.updatedAt = now;
      }
    }

    // Add new room history
    this.studentRoomHistories.push({
      id: `srh_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      tenantId,
      studentId: student.id,
      roomId: room.id,
      checkInDate: now,
      checkOutDate: null,
      notes: notes || 'Penempatan kamar santri',
      createdAt: now,
      updatedAt: now,
    });

    student.currentRoomId = room.id;
    student.updatedAt = now;

    return { success: true, student: this.enrichStudent(student) };
  }

  removeStudentRoom(
    studentId: string,
    tenantId: string
  ): { success: boolean; error?: string; student?: Student } {
    const studentIndex = this.students.findIndex((s) => s.id === studentId && s.tenantId === tenantId);
    if (studentIndex === -1) {
      return { success: false, error: 'Santri tidak ditemukan.' };
    }

    const student = this.students[studentIndex];
    const now = new Date().toISOString();

    if (student.currentRoomId) {
      const activeHistories = this.studentRoomHistories.filter(
        (h) => h.studentId === student.id && !h.checkOutDate
      );
      for (const h of activeHistories) {
        h.checkOutDate = now;
        h.updatedAt = now;
      }
    }

    student.currentRoomId = null;
    student.updatedAt = now;

    return { success: true, student: this.enrichStudent(student) };
  }

  getStudentParents(studentId: string, tenantId: string): (StudentParent & { parent: Parent })[] {
    return this.studentParents
      .filter((sp) => sp.studentId === studentId && sp.tenantId === tenantId)
      .map((sp) => {
        const rawParent = this.parents.find((p) => p.id === sp.parentId && p.tenantId === tenantId);
        const enrichedP = rawParent ? this.enrichParent(rawParent) : ({} as Parent);
        return {
          ...sp,
          parent: enrichedP,
        };
      });
  }

  addStudentParent(
    studentId: string,
    parentId: string,
    tenantId: string,
    data: {
      relationship: StudentParentRelationship;
      isPrimaryContact?: boolean;
      isEmergencyContact?: boolean;
    }
  ): { success: boolean; error?: string; studentParent?: StudentParent } {
    const student = this.students.find((s) => s.id === studentId && s.tenantId === tenantId);
    if (!student) {
      return { success: false, error: 'Santri tidak ditemukan di lembaga ini.' };
    }

    const parent = this.parents.find((p) => p.id === parentId && p.tenantId === tenantId);
    if (!parent) {
      return { success: false, error: 'Wali santri tidak ditemukan di lembaga ini.' };
    }

    // Check duplicate
    const exists = this.studentParents.some(
      (sp) => sp.studentId === studentId && sp.parentId === parentId && sp.tenantId === tenantId
    );
    if (exists) {
      return { success: false, error: 'Relasi santri dan wali ini sudah terdaftar sebelumnya.' };
    }

    const now = new Date().toISOString();

    // If isPrimaryContact is true, unset other primary contacts for this student
    if (data.isPrimaryContact) {
      for (const sp of this.studentParents) {
        if (sp.studentId === studentId && sp.tenantId === tenantId) {
          sp.isPrimaryContact = false;
          sp.updatedAt = now;
        }
      }
    }

    const newRelation: StudentParent = {
      id: `sp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      tenantId,
      studentId,
      parentId,
      relationship: data.relationship,
      isPrimaryContact: data.isPrimaryContact || false,
      isEmergencyContact: data.isEmergencyContact ?? true,
      createdAt: now,
      updatedAt: now,
    };

    this.studentParents.push(newRelation);
    return { success: true, studentParent: newRelation };
  }

  removeStudentParent(
    studentId: string,
    parentId: string,
    tenantId: string
  ): { success: boolean; error?: string } {
    const initialLen = this.studentParents.length;
    this.studentParents = this.studentParents.filter(
      (sp) => !(sp.studentId === studentId && sp.parentId === parentId && sp.tenantId === tenantId)
    );

    if (this.studentParents.length === initialLen) {
      return { success: false, error: 'Hubungan santri dan wali tidak ditemukan.' };
    }

    return { success: true };
  }

  // Parents Methods
  getParents(
    tenantId: string,
    filters?: {
      search?: string;
      relationshipType?: string;
    }
  ): Parent[] {
    return this.parents
      .filter((p) => {
        if (p.tenantId !== tenantId) return false;

        if (filters?.search) {
          const q = filters.search.toLowerCase().trim();
          const matchName = p.fullName.toLowerCase().includes(q);
          const matchPhone = p.phone.toLowerCase().includes(q);
          const matchEmail = p.email?.toLowerCase().includes(q) || false;
          if (!matchName && !matchPhone && !matchEmail) return false;
        }

        if (filters?.relationshipType && filters.relationshipType !== 'ALL') {
          if (p.relationshipType !== filters.relationshipType) return false;
        }

        return true;
      })
      .map((p) => this.enrichParent(p));
  }

  getParentById(id: string, tenantId: string): Parent | null {
    const parent = this.parents.find((p) => p.id === id && p.tenantId === tenantId);
    if (!parent) return null;
    return this.enrichParent(parent);
  }

  createParent(data: Omit<Parent, 'id' | 'createdAt' | 'updatedAt'>): Parent {
    const now = new Date().toISOString();
    const newParent: Parent = {
      ...data,
      id: `par_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: now,
      updatedAt: now,
    };

    this.parents.push(newParent);
    return this.enrichParent(newParent);
  }

  updateParent(
    id: string,
    tenantId: string,
    data: Partial<Omit<Parent, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>>
  ): Parent | null {
    const index = this.parents.findIndex((p) => p.id === id && p.tenantId === tenantId);
    if (index === -1) return null;

    const existing = this.parents[index];

    const cleanData: any = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        cleanData[key] = value;
      }
    }

    const updated: Parent = {
      ...existing,
      ...cleanData,
      id: existing.id,
      tenantId: existing.tenantId,
      updatedAt: new Date().toISOString(),
    };

    this.parents[index] = updated;
    return this.enrichParent(updated);
  }

  deleteParent(id: string, tenantId: string): { success: boolean; error?: string } {
    const index = this.parents.findIndex((p) => p.id === id && p.tenantId === tenantId);
    if (index === -1) {
      return { success: false, error: 'Data wali santri tidak ditemukan.' };
    }

    // Clean up relation pivots
    this.studentParents = this.studentParents.filter(
      (sp) => !(sp.parentId === id && sp.tenantId === tenantId)
    );

    this.parents.splice(index, 1);
    return { success: true };
  }

  linkUserToParent(
    parentId: string,
    userId: string,
    tenantId: string
  ): { success: boolean; error?: string; parent?: Parent } {
    const parentIndex = this.parents.findIndex((p) => p.id === parentId && p.tenantId === tenantId);
    if (parentIndex === -1) {
      return { success: false, error: 'Data wali tidak ditemukan.' };
    }

    const user = this.users.find((u) => u.id === userId && u.tenantId === tenantId);
    if (!user) {
      return { success: false, error: 'Akun pengguna tidak ditemukan di pesantren ini.' };
    }

    const parent = this.parents[parentIndex];
    parent.userId = user.id;
    parent.updatedAt = new Date().toISOString();

    user.assignedEntityId = parent.id;
    user.assignedEntityName = `Wali: ${parent.fullName}`;

    return { success: true, parent: this.enrichParent(parent) };
  }

  unlinkUserFromParent(
    parentId: string,
    tenantId: string
  ): { success: boolean; error?: string; parent?: Parent } {
    const parentIndex = this.parents.findIndex((p) => p.id === parentId && p.tenantId === tenantId);
    if (parentIndex === -1) {
      return { success: false, error: 'Data wali tidak ditemukan.' };
    }

    const parent = this.parents[parentIndex];
    if (parent.userId) {
      const user = this.users.find((u) => u.id === parent.userId && u.tenantId === tenantId);
      if (user && user.assignedEntityId === parent.id) {
        user.assignedEntityId = undefined;
        user.assignedEntityName = undefined;
      }
    }

    parent.userId = null;
    parent.updatedAt = new Date().toISOString();

    return { success: true, parent: this.enrichParent(parent) };
  }

  // Student Statistics
  getStudentStats(tenantId: string): StudentStats {
    const studentsInTenant = this.students.filter((s) => s.tenantId === tenantId);
    const parentsInTenant = this.parents.filter((p) => p.tenantId === tenantId);

    const activeStudents = studentsInTenant.filter((s) => s.status === 'ACTIVE').length;
    const maleStudents = studentsInTenant.filter((s) => s.gender === 'LAKI_LAKI').length;
    const femaleStudents = studentsInTenant.filter((s) => s.gender === 'PEREMPUAN').length;
    const withRoom = studentsInTenant.filter((s) => s.currentRoomId).length;
    const withoutRoom = studentsInTenant.filter((s) => !s.currentRoomId).length;

    const byStatus = {
      ACTIVE: studentsInTenant.filter((s) => s.status === 'ACTIVE').length,
      GRADUATED: studentsInTenant.filter((s) => s.status === 'GRADUATED').length,
      DROPOUT: studentsInTenant.filter((s) => s.status === 'DROPOUT').length,
      MUTASI: studentsInTenant.filter((s) => s.status === 'MUTASI').length,
      SUSPENDED: studentsInTenant.filter((s) => s.status === 'SUSPENDED').length,
    };

    const byProgram: Record<string, number> = {};
    for (const s of studentsInTenant) {
      const progKey = s.programId || 'Tanpa Program';
      byProgram[progKey] = (byProgram[progKey] || 0) + 1;
    }

    return {
      totalStudents: studentsInTenant.length,
      activeStudents,
      maleStudents,
      femaleStudents,
      withRoom,
      withoutRoom,
      totalParents: parentsInTenant.length,
      byStatus,
      byProgram,
    };
  }

  // ==================== PHASE 2.5: MASTER DATA KELAS & ROMBEL ====================

  private enrichClass(cls: ClassGroup): ClassGroup {
    const academicYear = this.academicYears.find((ay) => ay.id === cls.academicYearId);
    const program = this.programs.find((p) => p.id === cls.programId);

    let homeroomTeacher: (Teacher & { employee?: Employee; user?: User }) | undefined = undefined;
    if (cls.homeroomTeacherId) {
      const tch = this.teachers.find((t) => t.id === cls.homeroomTeacherId && t.tenantId === cls.tenantId);
      if (tch) {
        const emp = this.employees.find((e) => e.id === tch.employeeId);
        const usr = emp?.userId ? this.users.find((u) => u.id === emp.userId) : undefined;
        homeroomTeacher = {
          ...tch,
          employee: emp,
          user: usr,
        };
      }
    }

    const activeHistories = this.studentClassHistories.filter(
      (h) => h.classId === cls.id && h.tenantId === cls.tenantId && h.status === 'ACTIVE' && !h.exitDate
    );

    const enrolledStudents = activeHistories
      .map((h) => {
        const rawStudent = this.students.find((s) => s.id === h.studentId && s.tenantId === cls.tenantId);
        return {
          ...h,
          student: rawStudent ? this.enrichStudent(rawStudent) : undefined,
        };
      })
      .filter((item) => !!item.student);

    return {
      ...cls,
      academicYear,
      program,
      homeroomTeacher,
      students: enrolledStudents,
      totalStudents: activeHistories.length,
    };
  }

  getClasses(
    tenantId: string,
    filters?: {
      academicYearId?: string;
      programId?: string;
      gender?: string;
      status?: string;
      search?: string;
      level?: number | string;
    }
  ): ClassGroup[] {
    let list = this.classes.filter((c) => c.tenantId === tenantId);

    if (filters?.academicYearId) {
      list = list.filter((c) => c.academicYearId === filters.academicYearId);
    }

    if (filters?.programId) {
      list = list.filter((c) => c.programId === filters.programId);
    }

    if (filters?.gender) {
      list = list.filter((c) => c.gender === filters.gender);
    }

    if (filters?.status) {
      list = list.filter((c) => c.status === filters.status);
    }

    if (filters?.level !== undefined && filters?.level !== '') {
      const levelNum = Number(filters.level);
      if (!isNaN(levelNum)) {
        list = list.filter((c) => c.level === levelNum);
      }
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          (c.roomLocation && c.roomLocation.toLowerCase().includes(q))
      );
    }

    return list.map((c) => this.enrichClass(c));
  }

  getClassById(id: string, tenantId: string): ClassGroup | null {
    const cls = this.classes.find((c) => c.id === id && c.tenantId === tenantId);
    if (!cls) return null;
    return this.enrichClass(cls);
  }

  getClassByCode(code: string, tenantId: string): ClassGroup | null {
    const cls = this.classes.find(
      (c) => c.code.trim().toUpperCase() === code.trim().toUpperCase() && c.tenantId === tenantId
    );
    if (!cls) return null;
    return this.enrichClass(cls);
  }

  createClass(
    data: Omit<ClassGroup, 'id' | 'createdAt' | 'updatedAt'>
  ): { success: boolean; classGroup?: ClassGroup; error?: string } {
    // 1. Validate Code uniqueness per tenant
    const codeExists = this.classes.some(
      (c) => c.tenantId === data.tenantId && c.code.trim().toUpperCase() === data.code.trim().toUpperCase()
    );
    if (codeExists) {
      return { success: false, error: `Kode kelas '${data.code}' sudah digunakan di lembaga ini.` };
    }

    // 2. Validate Academic Year
    const ay = this.academicYears.find((a) => a.id === data.academicYearId && a.tenantId === data.tenantId);
    if (!ay) {
      return { success: false, error: 'Tahun akademik tidak ditemukan atau bukan milik lembaga ini.' };
    }

    // 3. Validate Program
    const prog = this.programs.find((p) => p.id === data.programId && p.tenantId === data.tenantId);
    if (!prog) {
      return { success: false, error: 'Program pendidikan tidak ditemukan atau bukan milik lembaga ini.' };
    }

    // 4. Validate Homeroom Teacher if provided
    if (data.homeroomTeacherId) {
      const tch = this.teachers.find((t) => t.id === data.homeroomTeacherId && t.tenantId === data.tenantId);
      if (!tch) {
        return { success: false, error: 'Ustadz/Wali kelas yang ditunjuk tidak ditemukan dalam lembaga ini.' };
      }
    }

    // 5. Validate Capacity
    if (data.capacity <= 0) {
      return { success: false, error: 'Kapasitas rombel harus lebih besar dari 0.' };
    }

    const newClass: ClassGroup = {
      ...data,
      id: `cls_${Date.now()}`,
      name: data.name.trim(),
      code: data.code.trim().toUpperCase(),
      level: Number(data.level),
      capacity: Number(data.capacity),
      status: data.status || 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.classes.push(newClass);
    return { success: true, classGroup: this.enrichClass(newClass) };
  }

  updateClass(
    id: string,
    tenantId: string,
    data: Partial<Omit<ClassGroup, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>>
  ): { success: boolean; classGroup?: ClassGroup; error?: string } {
    const index = this.classes.findIndex((c) => c.id === id && c.tenantId === tenantId);
    if (index === -1) {
      return { success: false, error: 'Data kelas tidak ditemukan dalam lembaga ini.' };
    }

    const existing = this.classes[index];

    // Check code uniqueness if changed
    if (data.code && data.code.trim().toUpperCase() !== existing.code.toUpperCase()) {
      const codeExists = this.classes.some(
        (c) => c.tenantId === tenantId && c.id !== id && c.code.trim().toUpperCase() === data.code!.trim().toUpperCase()
      );
      if (codeExists) {
        return { success: false, error: `Kode kelas '${data.code}' sudah digunakan rombel lain.` };
      }
    }

    // Check academic year if changed
    if (data.academicYearId && data.academicYearId !== existing.academicYearId) {
      const ay = this.academicYears.find((a) => a.id === data.academicYearId && a.tenantId === tenantId);
      if (!ay) {
        return { success: false, error: 'Tahun akademik tidak valid.' };
      }
    }

    // Check program if changed
    if (data.programId && data.programId !== existing.programId) {
      const prog = this.programs.find((p) => p.id === data.programId && p.tenantId === tenantId);
      if (!prog) {
        return { success: false, error: 'Program pendidikan tidak valid.' };
      }
    }

    // Check homeroom teacher if changed
    if (data.homeroomTeacherId !== undefined && data.homeroomTeacherId !== null) {
      const tch = this.teachers.find((t) => t.id === data.homeroomTeacherId && t.tenantId === tenantId);
      if (!tch) {
        return { success: false, error: 'Wali kelas tidak valid atau bukan milik lembaga ini.' };
      }
    }

    // Check capacity reduction against current active students
    if (data.capacity !== undefined) {
      const activeCount = this.studentClassHistories.filter(
        (h) => h.classId === id && h.tenantId === tenantId && h.status === 'ACTIVE' && !h.exitDate
      ).length;
      if (Number(data.capacity) < activeCount) {
        return {
          success: false,
          error: `Kapasitas baru (${data.capacity}) tidak boleh lebih kecil dari jumlah santri aktif saat ini (${activeCount}).`,
        };
      }
    }

    const updated: ClassGroup = {
      ...existing,
      ...data,
      name: data.name ? data.name.trim() : existing.name,
      code: data.code ? data.code.trim().toUpperCase() : existing.code,
      level: data.level !== undefined ? Number(data.level) : existing.level,
      capacity: data.capacity !== undefined ? Number(data.capacity) : existing.capacity,
      updatedAt: new Date().toISOString(),
    };

    this.classes[index] = updated;
    return { success: true, classGroup: this.enrichClass(updated) };
  }

  deleteClass(id: string, tenantId: string): { success: boolean; error?: string } {
    const index = this.classes.findIndex((c) => c.id === id && c.tenantId === tenantId);
    if (index === -1) {
      return { success: false, error: 'Data kelas tidak ditemukan.' };
    }

    // Check if any active students enrolled
    const activeStudents = this.studentClassHistories.filter(
      (h) => h.classId === id && h.tenantId === tenantId && h.status === 'ACTIVE' && !h.exitDate
    );
    if (activeStudents.length > 0) {
      return {
        success: false,
        error: `Tidak dapat menghapus rombel yang masih memiliki ${activeStudents.length} santri aktif. Silakan pindahkan atau keluarkan santri terlebih dahulu.`,
      };
    }

    // Clear class histories for this class
    this.studentClassHistories = this.studentClassHistories.filter(
      (h) => !(h.classId === id && h.tenantId === tenantId)
    );

    // Remove from students' currentClassId if any
    for (const student of this.students) {
      if (student.currentClassId === id && student.tenantId === tenantId) {
        student.currentClassId = null;
      }
    }

    this.classes.splice(index, 1);
    return { success: true };
  }

  getClassStudents(classId: string, tenantId: string): (StudentClassHistory & { student?: Student })[] {
    const cls = this.classes.find((c) => c.id === classId && c.tenantId === tenantId);
    if (!cls) return [];

    const histories = this.studentClassHistories.filter(
      (h) => h.classId === classId && h.tenantId === tenantId && h.status === 'ACTIVE' && !h.exitDate
    );

    return histories.map((h) => {
      const raw = this.students.find((s) => s.id === h.studentId && s.tenantId === tenantId);
      return {
        ...h,
        student: raw ? this.enrichStudent(raw) : undefined,
      };
    });
  }

  assignStudentClass(
    classId: string,
    studentId: string,
    tenantId: string,
    notes?: string
  ): { success: boolean; error?: string; classGroup?: ClassGroup; student?: Student } {
    // 1. Validate class
    const cls = this.classes.find((c) => c.id === classId && c.tenantId === tenantId);
    if (!cls) {
      return { success: false, error: 'Data kelas tidak ditemukan dalam lembaga ini.' };
    }
    if (cls.status === 'ARCHIVED') {
      return { success: false, error: 'Kelas dalam status ARCHIVED tidak dapat menerima santri baru.' };
    }

    // 2. Validate student
    const studentIndex = this.students.findIndex((s) => s.id === studentId && s.tenantId === tenantId);
    if (studentIndex === -1) {
      return { success: false, error: 'Data santri tidak ditemukan dalam lembaga ini.' };
    }
    const student = this.students[studentIndex];

    // 3. Check capacity
    const activeInClass = this.studentClassHistories.filter(
      (h) => h.classId === classId && h.tenantId === tenantId && h.status === 'ACTIVE' && !h.exitDate
    ).length;
    if (activeInClass >= cls.capacity) {
      return {
        success: false,
        error: `Rombel '${cls.name}' sudah penuh (kapasitas: ${cls.capacity}, terisi: ${activeInClass}).`,
      };
    }

    // 4. Validate gender compatibility
    if (cls.gender === 'PUTRA' && student.gender !== 'LAKI_LAKI') {
      return { success: false, error: 'Rombel ini khusus santri putra (Laki-laki).' };
    }
    if (cls.gender === 'PUTRI' && student.gender !== 'PEREMPUAN') {
      return { success: false, error: 'Rombel ini khusus santriwati putri (Perempuan).' };
    }

    // 5. Check if student is already in this same class
    const alreadyInSame = this.studentClassHistories.some(
      (h) => h.studentId === studentId && h.classId === classId && h.status === 'ACTIVE' && !h.exitDate
    );
    if (alreadyInSame) {
      return { success: false, error: 'Santri sudah terdaftar aktif di rombel ini.' };
    }

    // 6. Check if student already has an active placement in the same academic year
    const activeInSameYear = this.studentClassHistories.some(
      (h) =>
        h.studentId === studentId &&
        h.academicYearId === cls.academicYearId &&
        h.status === 'ACTIVE' &&
        !h.exitDate &&
        h.classId !== classId
    );
    if (activeInSameYear) {
      return {
        success: false,
        error: 'Santri sudah memiliki rombel aktif pada tahun ajaran yang sama. Gunakan fitur Pindah Rombel.',
      };
    }

    // 7. Create StudentClassHistory
    const newHistory: StudentClassHistory = {
      id: `sch_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      tenantId,
      studentId,
      classId,
      academicYearId: cls.academicYearId,
      enrollDate: new Date().toISOString(),
      exitDate: null,
      status: 'ACTIVE',
      notes: notes || 'Penempatan awal santri ke rombongan belajar',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.studentClassHistories.push(newHistory);

    // 8. Update student currentClassId
    this.students[studentIndex] = {
      ...student,
      currentClassId: classId,
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      classGroup: this.enrichClass(cls),
      student: this.enrichStudent(this.students[studentIndex]),
    };
  }

  transferStudentClass(
    sourceClassId: string,
    studentId: string,
    targetClassId: string,
    tenantId: string,
    notes?: string
  ): { success: boolean; error?: string; student?: Student } {
    if (sourceClassId === targetClassId) {
      return { success: false, error: 'Rombel tujuan tidak boleh sama dengan rombel asal.' };
    }

    const sourceCls = this.classes.find((c) => c.id === sourceClassId && c.tenantId === tenantId);
    if (!sourceCls) {
      return { success: false, error: 'Rombel asal tidak ditemukan.' };
    }

    const targetCls = this.classes.find((c) => c.id === targetClassId && c.tenantId === tenantId);
    if (!targetCls) {
      return { success: false, error: 'Rombel tujuan tidak ditemukan.' };
    }

    if (targetCls.status === 'ARCHIVED') {
      return { success: false, error: 'Rombel tujuan berstatus ARCHIVED.' };
    }

    const studentIndex = this.students.findIndex((s) => s.id === studentId && s.tenantId === tenantId);
    if (studentIndex === -1) {
      return { success: false, error: 'Data santri tidak ditemukan.' };
    }
    const student = this.students[studentIndex];

    // Check target capacity
    const targetActiveCount = this.studentClassHistories.filter(
      (h) => h.classId === targetClassId && h.tenantId === tenantId && h.status === 'ACTIVE' && !h.exitDate
    ).length;
    if (targetActiveCount >= targetCls.capacity) {
      return {
        success: false,
        error: `Rombel tujuan '${targetCls.name}' sudah penuh (kapasitas: ${targetCls.capacity}).`,
      };
    }

    // Gender check
    if (targetCls.gender === 'PUTRA' && student.gender !== 'LAKI_LAKI') {
      return { success: false, error: 'Rombel tujuan dikhususkan untuk santri putra.' };
    }
    if (targetCls.gender === 'PUTRI' && student.gender !== 'PEREMPUAN') {
      return { success: false, error: 'Rombel tujuan dikhususkan untuk santri putri.' };
    }

    // Find active history in source class
    const sourceHistory = this.studentClassHistories.find(
      (h) => h.classId === sourceClassId && h.studentId === studentId && h.tenantId === tenantId && h.status === 'ACTIVE' && !h.exitDate
    );
    if (!sourceHistory) {
      return { success: false, error: 'Santri tidak terdaftar aktif di rombel asal.' };
    }

    const now = new Date().toISOString();

    // Close source history
    sourceHistory.exitDate = now;
    sourceHistory.status = 'TRANSFERRED';
    sourceHistory.notes = (sourceHistory.notes ? sourceHistory.notes + ' | ' : '') + (notes || `Mutasi ke ${targetCls.name}`);
    sourceHistory.updatedAt = now;

    // Create target history
    const targetHistory: StudentClassHistory = {
      id: `sch_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      tenantId,
      studentId,
      classId: targetClassId,
      academicYearId: targetCls.academicYearId,
      enrollDate: now,
      exitDate: null,
      status: 'ACTIVE',
      notes: notes || `Pindahan dari rombel ${sourceCls.name}`,
      createdAt: now,
      updatedAt: now,
    };
    this.studentClassHistories.push(targetHistory);

    // Update student currentClassId
    this.students[studentIndex] = {
      ...student,
      currentClassId: targetClassId,
      updatedAt: now,
    };

    return {
      success: true,
      student: this.enrichStudent(this.students[studentIndex]),
    };
  }

  removeStudentFromClass(
    classId: string,
    studentId: string,
    tenantId: string,
    reason?: string
  ): { success: boolean; error?: string; student?: Student } {
    const cls = this.classes.find((c) => c.id === classId && c.tenantId === tenantId);
    if (!cls) {
      return { success: false, error: 'Data rombel tidak ditemukan.' };
    }

    const studentIndex = this.students.findIndex((s) => s.id === studentId && s.tenantId === tenantId);
    if (studentIndex === -1) {
      return { success: false, error: 'Data santri tidak ditemukan.' };
    }
    const student = this.students[studentIndex];

    const history = this.studentClassHistories.find(
      (h) => h.classId === classId && h.studentId === studentId && h.tenantId === tenantId && h.status === 'ACTIVE' && !h.exitDate
    );
    if (!history) {
      return { success: false, error: 'Santri tidak terdaftar aktif di rombel ini.' };
    }

    const now = new Date().toISOString();
    history.exitDate = now;
    history.status = 'DROPOUT';
    history.notes = (history.notes ? history.notes + ' | ' : '') + (reason || 'Dikeluarkan dari rombongan belajar');
    history.updatedAt = now;

    if (student.currentClassId === classId) {
      this.students[studentIndex] = {
        ...student,
        currentClassId: null,
        updatedAt: now,
      };
    }

    return {
      success: true,
      student: this.enrichStudent(this.students[studentIndex]),
    };
  }

  updateClassHomeroom(
    classId: string,
    homeroomTeacherId: string | null,
    tenantId: string
  ): { success: boolean; error?: string; classGroup?: ClassGroup; previousTeacherId?: string | null } {
    const index = this.classes.findIndex((c) => c.id === classId && c.tenantId === tenantId);
    if (index === -1) {
      return { success: false, error: 'Rombel tidak ditemukan dalam lembaga ini.' };
    }

    const cls = this.classes[index];
    const previousTeacherId = cls.homeroomTeacherId;

    if (homeroomTeacherId) {
      const tch = this.teachers.find((t) => t.id === homeroomTeacherId && t.tenantId === tenantId);
      if (!tch) {
        return { success: false, error: 'Ustadz pengajar tidak ditemukan dalam lembaga ini.' };
      }
    }

    this.classes[index] = {
      ...cls,
      homeroomTeacherId: homeroomTeacherId || null,
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      classGroup: this.enrichClass(this.classes[index]),
      previousTeacherId,
    };
  }

  getClassStats(tenantId: string): ClassStats {
    const tenantClasses = this.classes.filter((c) => c.tenantId === tenantId);
    const activeClasses = tenantClasses.filter((c) => c.status === 'ACTIVE').length;
    const inactiveClasses = tenantClasses.filter((c) => c.status === 'INACTIVE').length;
    const archivedClasses = tenantClasses.filter((c) => c.status === 'ARCHIVED').length;

    let totalCapacity = 0;
    let totalEnrolled = 0;
    let withHomeroomTeacher = 0;
    let withoutHomeroomTeacher = 0;

    const byGender = {
      PUTRA: 0,
      PUTRI: 0,
      CAMPURAN: 0,
    };

    const byLevel: Record<number, number> = {};
    const byProgram: Record<string, number> = {};

    for (const c of tenantClasses) {
      totalCapacity += c.capacity;
      const enrolledCount = this.studentClassHistories.filter(
        (h) => h.classId === c.id && h.tenantId === tenantId && h.status === 'ACTIVE' && !h.exitDate
      ).length;
      totalEnrolled += enrolledCount;

      if (c.homeroomTeacherId) {
        withHomeroomTeacher++;
      } else {
        withoutHomeroomTeacher++;
      }

      if (c.gender === 'PUTRA') byGender.PUTRA++;
      else if (c.gender === 'PUTRI') byGender.PUTRI++;
      else if (c.gender === 'CAMPURAN') byGender.CAMPURAN++;

      byLevel[c.level] = (byLevel[c.level] || 0) + 1;

      const prog = this.programs.find((p) => p.id === c.programId);
      const progName = prog?.name || c.programId;
      byProgram[progName] = (byProgram[progName] || 0) + 1;
    }

    const occupancyRate = totalCapacity > 0 ? Math.round((totalEnrolled / totalCapacity) * 100) : 0;

    return {
      totalClasses: tenantClasses.length,
      activeClasses,
      inactiveClasses,
      archivedClasses,
      totalCapacity,
      totalEnrolled,
      totalEnrolledStudents: totalEnrolled,
      occupancyRate,
      withHomeroomTeacher,
      withoutHomeroomTeacher,
      byGender,
      byLevel,
      byProgram,
    };
  }

  // ==================== PHASE 3.1: MASTER DATA MATA PELAJARAN ====================

  getSubjects(
    tenantId: string,
    filters?: { search?: string; type?: string; status?: string }
  ): Subject[] {
    let result = this.subjects.filter((s) => s.tenantId === tenantId);

    if (filters?.type && filters.type !== 'ALL') {
      result = result.filter((s) => s.type === filters.type);
    }

    if (filters?.status && filters.status !== 'ALL') {
      result = result.filter((s) => s.status === filters.status);
    }

    if (filters?.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.code.toLowerCase().includes(q) ||
          s.name.toLowerCase().includes(q) ||
          s.shortName.toLowerCase().includes(q) ||
          (s.description && s.description.toLowerCase().includes(q))
      );
    }

    return result.sort((a, b) => a.code.localeCompare(b.code));
  }

  getSubjectById(id: string, tenantId: string): Subject | null {
    const subject = this.subjects.find((s) => s.id === id && s.tenantId === tenantId);
    return subject || null;
  }

  getSubjectByCode(code: string, tenantId: string): Subject | null {
    const cleanCode = code.trim().toUpperCase();
    const subject = this.subjects.find(
      (s) => s.tenantId === tenantId && s.code.toUpperCase() === cleanCode
    );
    return subject || null;
  }

  createSubject(
    tenantId: string,
    data: {
      code: string;
      name: string;
      shortName?: string;
      type: SubjectType;
      creditHours: number;
      status?: SubjectStatus;
      description?: string | null;
    }
  ): { success: boolean; subject?: Subject; error?: string } {
    const code = (data.code || '').trim().toUpperCase();
    const name = (data.name || '').trim();
    const shortName = (data.shortName || code || name).trim();
    const creditHours = Number(data.creditHours);
    const type = data.type;
    const status = data.status || 'ACTIVE';

    if (!code) {
      return { success: false, error: 'Kode mata pelajaran wajib diisi.' };
    }

    if (!name) {
      return { success: false, error: 'Nama mata pelajaran wajib diisi.' };
    }

    if (!creditHours || isNaN(creditHours) || creditHours <= 0) {
      return { success: false, error: 'Beban JPL (credit hours) harus berupa angka positif lebih dari 0.' };
    }

    const validTypes: SubjectType[] = ['DINIYAH', 'UMUM', 'BAHASA', 'TAHFIDZ', 'KETERAMPILAN', 'LAINNYA'];
    if (!validTypes.includes(type)) {
      return { success: false, error: 'Jenis mata pelajaran tidak valid.' };
    }

    // Check code uniqueness within tenant
    const existing = this.getSubjectByCode(code, tenantId);
    if (existing) {
      return {
        success: false,
        error: `Kode mata pelajaran '${code}' sudah digunakan di pesantren ini. Gunakan kode lain.`,
      };
    }

    const now = new Date().toISOString();
    const newSubject: Subject = {
      id: `sbj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      tenantId,
      code,
      name,
      shortName,
      type,
      creditHours,
      status,
      description: data.description ? data.description.trim() : null,
      createdAt: now,
      updatedAt: now,
    };

    this.subjects.push(newSubject);
    return { success: true, subject: newSubject };
  }

  updateSubject(
    id: string,
    tenantId: string,
    data: Partial<{
      code: string;
      name: string;
      shortName: string;
      type: SubjectType;
      creditHours: number;
      status: SubjectStatus;
      description: string | null;
    }>
  ): { success: boolean; subject?: Subject; error?: string } {
    const index = this.subjects.findIndex((s) => s.id === id && s.tenantId === tenantId);
    if (index === -1) {
      return { success: false, error: 'Mata pelajaran tidak ditemukan atau bukan milik tenant Anda.' };
    }

    const current = this.subjects[index];

    // If code is being updated, check uniqueness within tenant
    if (data.code !== undefined) {
      const code = data.code.trim().toUpperCase();
      if (!code) {
        return { success: false, error: 'Kode mata pelajaran tidak boleh kosong.' };
      }
      const existing = this.subjects.find(
        (s) => s.tenantId === tenantId && s.id !== id && s.code.toUpperCase() === code
      );
      if (existing) {
        return {
          success: false,
          error: `Kode mata pelajaran '${code}' sudah digunakan oleh mata pelajaran lain di pesantren ini.`,
        };
      }
      current.code = code;
    }

    if (data.name !== undefined) {
      const name = data.name.trim();
      if (!name) {
        return { success: false, error: 'Nama mata pelajaran tidak boleh kosong.' };
      }
      current.name = name;
    }

    if (data.shortName !== undefined) {
      current.shortName = data.shortName.trim() || current.code;
    }

    if (data.creditHours !== undefined) {
      const creditHours = Number(data.creditHours);
      if (isNaN(creditHours) || creditHours <= 0) {
        return { success: false, error: 'Beban JPL (credit hours) harus berupa angka positif lebih dari 0.' };
      }
      current.creditHours = creditHours;
    }

    if (data.type !== undefined) {
      const validTypes: SubjectType[] = ['DINIYAH', 'UMUM', 'BAHASA', 'TAHFIDZ', 'KETERAMPILAN', 'LAINNYA'];
      if (!validTypes.includes(data.type)) {
        return { success: false, error: 'Jenis mata pelajaran tidak valid.' };
      }
      current.type = data.type;
    }

    if (data.status !== undefined) {
      if (data.status !== 'ACTIVE' && data.status !== 'INACTIVE') {
        return { success: false, error: 'Status mata pelajaran harus ACTIVE atau INACTIVE.' };
      }
      current.status = data.status;
    }

    if (data.description !== undefined) {
      current.description = data.description ? data.description.trim() : null;
    }

    current.updatedAt = new Date().toISOString();
    this.subjects[index] = current;

    return { success: true, subject: current };
  }

  isSubjectInUse(subjectId: string, tenantId: string): boolean {
    // Check if subject is associated with any ClassSubject (Phase 3.2+)
    return this.classSubjects.some(
      (cs) => cs.subjectId === subjectId && cs.tenantId === tenantId
    );
  }

  deleteSubject(id: string, tenantId: string): { success: boolean; error?: string } {
    const idx = this.subjects.findIndex((s) => s.id === id && s.tenantId === tenantId);
    if (idx === -1) {
      return { success: false, error: 'Mata pelajaran tidak ditemukan atau bukan milik tenant Anda.' };
    }

    // Safety check for Phase 3.2 relations
    if (this.isSubjectInUse(id, tenantId)) {
      return {
        success: false,
        error: 'Tidak dapat menghapus mata pelajaran karena masih digunakan oleh data akademik (Kurikulum Rombel). Ubah status menjadi Tidak Aktif jika tidak digunakan.',
      };
    }

    this.subjects.splice(idx, 1);
    return { success: true };
  }

  getSubjectStats(tenantId: string): SubjectStats {
    const tenantSubjects = this.getSubjects(tenantId);
    const totalSubjects = tenantSubjects.length;
    const activeSubjects = tenantSubjects.filter((s) => s.status === 'ACTIVE').length;
    const inactiveSubjects = tenantSubjects.filter((s) => s.status === 'INACTIVE').length;
    const diniyahSubjects = tenantSubjects.filter((s) => s.type === 'DINIYAH').length;
    const totalCreditHours = tenantSubjects.reduce((sum, s) => sum + (s.creditHours || 0), 0);

    const byType: Record<SubjectType, number> = {
      DINIYAH: 0,
      UMUM: 0,
      BAHASA: 0,
      TAHFIDZ: 0,
      KETERAMPILAN: 0,
      LAINNYA: 0,
    };

    for (const s of tenantSubjects) {
      if (byType[s.type] !== undefined) {
        byType[s.type]++;
      } else {
        byType.LAINNYA++;
      }
    }

    return {
      totalSubjects,
      activeSubjects,
      inactiveSubjects,
      diniyahSubjects,
      totalCreditHours,
      byType,
    };
  }

  // ==========================================
  // PHASE 3.2: KURIKULUM ROMBEL (CLASS SUBJECT)
  // ==========================================
  private enrichClassSubject(cs: ClassSubject): ClassSubject {
    return {
      ...cs,
      classGroup: this.getClassById(cs.classId, cs.tenantId),
      subject: this.getSubjectById(cs.subjectId, cs.tenantId),
      teacher: this.getTeacherById(cs.teacherId, cs.tenantId),
    };
  }

  getClassSubjects(
    tenantId: string,
    filters?: {
      classId?: string;
      subjectId?: string;
      teacherId?: string;
      status?: string;
      search?: string;
    }
  ): ClassSubject[] {
    let list = this.classSubjects.filter((cs) => cs.tenantId === tenantId);

    if (filters?.classId) {
      list = list.filter((cs) => cs.classId === filters.classId);
    }

    if (filters?.subjectId) {
      list = list.filter((cs) => cs.subjectId === filters.subjectId);
    }

    if (filters?.teacherId) {
      list = list.filter((cs) => cs.teacherId === filters.teacherId);
    }

    if (filters?.status && filters.status !== 'ALL') {
      list = list.filter((cs) => cs.status === filters.status);
    }

    let enriched = list.map((cs) => this.enrichClassSubject(cs));

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      enriched = enriched.filter((cs) => {
        const subjName = cs.subject?.name?.toLowerCase() || '';
        const subjCode = cs.subject?.code?.toLowerCase() || '';
        const clsName = cs.classGroup?.name?.toLowerCase() || '';
        const clsCode = cs.classGroup?.code?.toLowerCase() || '';
        const teacherName = cs.teacher?.employee?.fullName?.toLowerCase() || '';
        const teacherCode = cs.teacher?.teacherCode?.toLowerCase() || '';

        return (
          subjName.includes(q) ||
          subjCode.includes(q) ||
          clsName.includes(q) ||
          clsCode.includes(q) ||
          teacherName.includes(q) ||
          teacherCode.includes(q)
        );
      });
    }

    // Sort by class name, then subject name
    enriched.sort((a, b) => {
      const clsComp = (a.classGroup?.name || '').localeCompare(b.classGroup?.name || '');
      if (clsComp !== 0) return clsComp;
      return (a.subject?.name || '').localeCompare(b.subject?.name || '');
    });

    return enriched;
  }

  getClassSubjectById(id: string, tenantId: string): ClassSubject | null {
    const cs = this.classSubjects.find((item) => item.id === id && item.tenantId === tenantId);
    if (!cs) return null;
    return this.enrichClassSubject(cs);
  }

  createClassSubject(
    tenantId: string,
    data: {
      classId: string;
      subjectId: string;
      teacherId: string;
      creditHours?: number;
      status?: ClassSubjectStatus;
    }
  ): { success: boolean; classSubject?: ClassSubject; error?: string } {
    if (!data.classId || !data.classId.trim()) {
      return { success: false, error: 'Kelas (Rombel) wajib dipilih.' };
    }
    if (!data.subjectId || !data.subjectId.trim()) {
      return { success: false, error: 'Mata pelajaran wajib dipilih.' };
    }
    if (!data.teacherId || !data.teacherId.trim()) {
      return { success: false, error: 'Guru / pengajar wajib dipilih.' };
    }

    // 1. Verify Class
    const classGroup = this.classes.find((c) => c.id === data.classId.trim() && c.tenantId === tenantId);
    if (!classGroup) {
      return { success: false, error: 'Kelas tidak ditemukan atau bukan milik tenant Anda.' };
    }
    if (classGroup.status !== 'ACTIVE') {
      return {
        success: false,
        error: `Kelas '${classGroup.name}' berstatus tidak aktif. Mata pelajaran hanya dapat ditambahkan pada kelas aktif.`,
      };
    }

    // 2. Verify Subject
    const subject = this.subjects.find((s) => s.id === data.subjectId.trim() && s.tenantId === tenantId);
    if (!subject) {
      return { success: false, error: 'Mata pelajaran tidak ditemukan atau bukan milik tenant Anda.' };
    }
    if (subject.status !== 'ACTIVE') {
      return {
        success: false,
        error: `Mata pelajaran '${subject.name}' berstatus tidak aktif. Hanya mata pelajaran aktif yang dapat dialokasikan.`,
      };
    }

    // 3. Verify Teacher
    const teacher = this.teachers.find((t) => t.id === data.teacherId.trim() && t.tenantId === tenantId);
    if (!teacher) {
      return { success: false, error: 'Guru/pengajar tidak ditemukan atau bukan milik tenant Anda.' };
    }
    if (teacher.teachingStatus !== 'ACTIVE') {
      return {
        success: false,
        error: `Guru/pengajar (${teacher.teacherCode}) berstatus tidak aktif mengajar. Pilih guru yang aktif.`,
      };
    }

    // 4. Validate CreditHours
    let creditHours = subject.creditHours || 2;
    if (data.creditHours !== undefined && data.creditHours !== null) {
      const parsed = Number(data.creditHours);
      if (isNaN(parsed) || parsed <= 0) {
        return { success: false, error: 'Beban Jam Pelajaran (JPL) harus bernilai angka lebih besar dari 0.' };
      }
      creditHours = Math.round(parsed);
    }

    // 5. Uniqueness: one class cannot have the same subject twice
    const duplicate = this.classSubjects.find(
      (cs) => cs.tenantId === tenantId && cs.classId === data.classId.trim() && cs.subjectId === data.subjectId.trim()
    );
    if (duplicate) {
      return {
        success: false,
        error: `Mata pelajaran '${subject.name}' sudah dialokasikan di kelas '${classGroup.name}'. Satu kelas tidak boleh memiliki mata pelajaran yang sama dua kali.`,
      };
    }

    // 6. Status
    const status: ClassSubjectStatus = data.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';

    const now = new Date().toISOString();
    const newClassSubject: ClassSubject = {
      id: `cs_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      tenantId,
      classId: data.classId.trim(),
      subjectId: data.subjectId.trim(),
      teacherId: data.teacherId.trim(),
      creditHours,
      status,
      createdAt: now,
      updatedAt: now,
    };

    this.classSubjects.push(newClassSubject);
    return { success: true, classSubject: this.enrichClassSubject(newClassSubject) };
  }

  updateClassSubject(
    id: string,
    tenantId: string,
    data: Partial<{
      teacherId: string;
      creditHours: number;
      status: ClassSubjectStatus;
    }>
  ): { success: boolean; classSubject?: ClassSubject; error?: string } {
    const index = this.classSubjects.findIndex((cs) => cs.id === id && cs.tenantId === tenantId);
    if (index === -1) {
      return { success: false, error: 'Data kurikulum rombel tidak ditemukan atau bukan milik tenant Anda.' };
    }

    const current = { ...this.classSubjects[index] };

    // Teacher update
    if (data.teacherId !== undefined) {
      const teacher = this.teachers.find((t) => t.id === data.teacherId?.trim() && t.tenantId === tenantId);
      if (!teacher) {
        return { success: false, error: 'Guru/pengajar tidak ditemukan atau bukan milik tenant Anda.' };
      }
      if (teacher.teachingStatus !== 'ACTIVE') {
        return {
          success: false,
          error: `Guru/pengajar (${teacher.teacherCode}) berstatus tidak aktif. Silakan pilih guru aktif.`,
        };
      }
      current.teacherId = data.teacherId.trim();
    }

    // CreditHours update
    if (data.creditHours !== undefined) {
      const parsed = Number(data.creditHours);
      if (isNaN(parsed) || parsed <= 0) {
        return { success: false, error: 'Beban Jam Pelajaran (JPL) harus bernilai angka lebih besar dari 0.' };
      }
      current.creditHours = Math.round(parsed);
    }

    // Status update
    if (data.status !== undefined) {
      if (data.status !== 'ACTIVE' && data.status !== 'INACTIVE') {
        return { success: false, error: 'Status kurikulum rombel harus ACTIVE atau INACTIVE.' };
      }
      current.status = data.status;
    }

    current.updatedAt = new Date().toISOString();
    this.classSubjects[index] = current;

    return { success: true, classSubject: this.enrichClassSubject(current) };
  }

  isClassSubjectInUse(classSubjectId: string, tenantId: string): boolean {
    return this.schedules.some((s) => s.classSubjectId === classSubjectId && s.tenantId === tenantId);
  }

  deleteClassSubject(id: string, tenantId: string): { success: boolean; error?: string } {
    const index = this.classSubjects.findIndex((cs) => cs.id === id && cs.tenantId === tenantId);
    if (index === -1) {
      return { success: false, error: 'Data kurikulum rombel tidak ditemukan atau bukan milik tenant Anda.' };
    }

    // Safety check for Phase 3.3 (Jadwal Pelajaran)
    if (this.isClassSubjectInUse(id, tenantId)) {
      return {
        success: false,
        error: 'Tidak dapat menghapus alokasi mata pelajaran ini karena sudah digunakan pada jadwal pelajaran aktif. Nonaktifkan status atau hapus jadwal terlebih dahulu.',
      };
    }

    this.classSubjects.splice(index, 1);
    return { success: true };
  }

  getClassSubjectStats(tenantId: string): ClassSubjectStats {
    const tenantCS = this.classSubjects.filter((cs) => cs.tenantId === tenantId);
    const totalAllocations = tenantCS.length;
    const activeAllocations = tenantCS.filter((cs) => cs.status === 'ACTIVE').length;
    const inactiveAllocations = tenantCS.filter((cs) => cs.status === 'INACTIVE').length;
    const totalCreditHours = tenantCS.reduce((sum, cs) => sum + (cs.creditHours || 0), 0);

    const classSet = new Set<string>();
    const teacherSet = new Set<string>();

    for (const cs of tenantCS) {
      classSet.add(cs.classId);
      teacherSet.add(cs.teacherId);
    }

    return {
      totalAllocations,
      activeAllocations,
      inactiveAllocations,
      totalCreditHours,
      totalClassesConfigured: classSet.size,
      totalTeachersAssigned: teacherSet.size,
    };
  }

  // ==========================================
  // PHASE 3.3: JADWAL PELAJARAN (SCHEDULE)
  // ==========================================

  private static DAY_ORDER: Record<DayOfWeek, number> = {
    SENIN: 1,
    SELASA: 2,
    RABU: 3,
    KAMIS: 4,
    JUMAT: 5,
    SABTU: 6,
    AHAD: 7,
  };

  private timeToMinutes(t: string): number {
    if (!t || typeof t !== 'string') return 0;
    const [h, m] = t.split(':').map((v) => parseInt(v, 10));
    return (isNaN(h) ? 0 : h) * 60 + (isNaN(m) ? 0 : m);
  }

  private enrichSchedule(s: Schedule): Schedule {
    const cs = this.classSubjects.find((item) => item.id === s.classSubjectId && item.tenantId === s.tenantId);
    const classGroup = this.classes.find((c) => c.id === s.classId && c.tenantId === s.tenantId);
    const room = this.getRoomById(s.roomId, s.tenantId);

    let teacher: (Teacher & { employee?: Employee | null }) | null = null;
    let subject: Subject | null = null;

    if (cs) {
      const rawTeacher = this.teachers.find((t) => t.id === cs.teacherId && t.tenantId === s.tenantId);
      if (rawTeacher) {
        const emp = this.employees.find((e) => e.id === rawTeacher.employeeId && e.tenantId === s.tenantId);
        teacher = {
          ...rawTeacher,
          employee: emp || undefined,
        };
      }
      subject = this.subjects.find((sb) => sb.id === cs.subjectId && sb.tenantId === s.tenantId) || null;
    }

    return {
      ...s,
      classSubject: cs ? this.enrichClassSubject(cs) : null,
      classGroup: classGroup || null,
      room: room || null,
      teacher,
      subject,
    };
  }

  getSchedules(
    tenantId: string,
    filter?: {
      classId?: string;
      dayOfWeek?: DayOfWeek;
      teacherId?: string;
      roomId?: string;
      status?: ScheduleStatus;
      search?: string;
    }
  ): Schedule[] {
    let result = this.schedules.filter((s) => s.tenantId === tenantId);

    if (filter?.classId) {
      result = result.filter((s) => s.classId === filter.classId);
    }
    if (filter?.dayOfWeek) {
      result = result.filter((s) => s.dayOfWeek === filter.dayOfWeek);
    }
    if (filter?.roomId) {
      result = result.filter((s) => s.roomId === filter.roomId);
    }
    if (filter?.status) {
      result = result.filter((s) => s.status === filter.status);
    }
    if (filter?.teacherId) {
      result = result.filter((s) => {
        const cs = this.classSubjects.find((c) => c.id === s.classSubjectId && c.tenantId === tenantId);
        return cs?.teacherId === filter.teacherId;
      });
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase().trim();
      result = result.filter((s) => {
        const cs = this.classSubjects.find((c) => c.id === s.classSubjectId && c.tenantId === tenantId);
        const cl = this.classes.find((c) => c.id === s.classId && c.tenantId === tenantId);
        const rm = this.rooms.find((r) => r.id === s.roomId && r.tenantId === tenantId);
        const sb = cs ? this.subjects.find((sub) => sub.id === cs.subjectId && sub.tenantId === tenantId) : null;
        const tch = cs ? this.teachers.find((t) => t.id === cs.teacherId && t.tenantId === tenantId) : null;
        const emp = tch ? this.employees.find((e) => e.id === tch.employeeId && e.tenantId === tenantId) : null;

        return (
          s.dayOfWeek.toLowerCase().includes(q) ||
          s.startTime.includes(q) ||
          s.endTime.includes(q) ||
          cl?.name.toLowerCase().includes(q) ||
          rm?.name.toLowerCase().includes(q) ||
          rm?.code.toLowerCase().includes(q) ||
          sb?.name.toLowerCase().includes(q) ||
          sb?.code.toLowerCase().includes(q) ||
          tch?.teacherCode.toLowerCase().includes(q) ||
          emp?.fullName.toLowerCase().includes(q)
        );
      });
    }

    // Sort by day order, then startTime asc
    result.sort((a, b) => {
      const dayDiff = (PesantrenDatabase.DAY_ORDER[a.dayOfWeek] || 99) - (PesantrenDatabase.DAY_ORDER[b.dayOfWeek] || 99);
      if (dayDiff !== 0) return dayDiff;
      return a.startTime.localeCompare(b.startTime);
    });

    return result.map((s) => this.enrichSchedule(s));
  }

  getScheduleById(id: string, tenantId?: string): Schedule | undefined {
    const s = this.schedules.find((item) => item.id === id && (!tenantId || item.tenantId === tenantId));
    if (!s) return undefined;
    return this.enrichSchedule(s);
  }

  checkScheduleConflict(
    tenantId: string,
    params: {
      classId: string;
      teacherId: string;
      roomId: string;
      dayOfWeek: DayOfWeek;
      startTime: string;
      endTime: string;
      excludeScheduleId?: string;
    }
  ): { hasConflict: boolean; type?: 'CLASS' | 'TEACHER' | 'ROOM'; message?: string; conflictingSchedule?: Schedule } {
    const s1 = this.timeToMinutes(params.startTime);
    const e1 = this.timeToMinutes(params.endTime);

    if (s1 >= e1) {
      return {
        hasConflict: true,
        type: 'CLASS',
        message: `Jam mulai (${params.startTime}) harus lebih awal dari jam selesai (${params.endTime}).`,
      };
    }

    // Only compare against active schedules of same tenant on the same day
    const candidateSchedules = this.schedules.filter(
      (s) =>
        s.tenantId === tenantId &&
        s.status === 'ACTIVE' &&
        s.dayOfWeek === params.dayOfWeek &&
        (!params.excludeScheduleId || s.id !== params.excludeScheduleId)
    );

    for (const existing of candidateSchedules) {
      const s2 = this.timeToMinutes(existing.startTime);
      const e2 = this.timeToMinutes(existing.endTime);

      // Overlap condition: start1 < end2 AND end1 > start2
      const overlaps = s1 < e2 && e1 > s2;
      if (!overlaps) continue;

      // 1. Check Class Conflict
      if (existing.classId === params.classId) {
        const cl = this.classes.find((c) => c.id === existing.classId);
        const cs = this.classSubjects.find((c) => c.id === existing.classSubjectId);
        const sb = cs ? this.subjects.find((sub) => sub.id === cs.subjectId) : null;
        return {
          hasConflict: true,
          type: 'CLASS',
          message: `Bentrok Kelas: Kelas '${cl?.name || 'ini'}' sudah memiliki jadwal ${
            sb ? `'${sb.name}'` : 'kegiatan'
          } pada hari ${params.dayOfWeek} pukul ${existing.startTime} - ${existing.endTime}.`,
          conflictingSchedule: this.enrichSchedule(existing),
        };
      }

      // 2. Check Teacher Conflict
      const existingCS = this.classSubjects.find((c) => c.id === existing.classSubjectId);
      if (existingCS && existingCS.teacherId === params.teacherId) {
        const tch = this.teachers.find((t) => t.id === params.teacherId);
        const emp = tch ? this.employees.find((e) => e.id === tch.employeeId) : null;
        const cl = this.classes.find((c) => c.id === existing.classId);
        const teacherName = emp?.fullName || tch?.teacherCode || 'Guru';
        return {
          hasConflict: true,
          type: 'TEACHER',
          message: `Bentrok Guru: Ustadz/Guru '${teacherName}' sudah memiliki jadwal mengajar di kelas '${
            cl?.name || 'lain'
          }' pada hari ${params.dayOfWeek} pukul ${existing.startTime} - ${existing.endTime}.`,
          conflictingSchedule: this.enrichSchedule(existing),
        };
      }

      // 3. Check Room Conflict
      if (existing.roomId === params.roomId) {
        const rm = this.rooms.find((r) => r.id === existing.roomId);
        const cl = this.classes.find((c) => c.id === existing.classId);
        const cs = this.classSubjects.find((c) => c.id === existing.classSubjectId);
        const sb = cs ? this.subjects.find((sub) => sub.id === cs.subjectId) : null;
        return {
          hasConflict: true,
          type: 'ROOM',
          message: `Bentrok Ruangan: Ruangan '${rm?.name || existing.roomId}' sudah digunakan oleh kelas '${
            cl?.name || 'lain'
          }' (${sb?.name || 'Pelajaran'}) pada hari ${params.dayOfWeek} pukul ${existing.startTime} - ${
            existing.endTime
          }.`,
          conflictingSchedule: this.enrichSchedule(existing),
        };
      }
    }

    return { hasConflict: false };
  }

  createSchedule(
    tenantId: string,
    data: {
      classSubjectId: string;
      classId?: string;
      roomId: string;
      dayOfWeek: DayOfWeek;
      startTime: string;
      endTime: string;
      status?: ScheduleStatus;
    }
  ): { success: boolean; schedule?: Schedule; error?: string; conflictType?: 'CLASS' | 'TEACHER' | 'ROOM' } {
    // 1. Validate ClassSubject
    if (!data.classSubjectId) {
      return { success: false, error: 'Mata pelajaran rombel (ClassSubject) wajib dipilih.' };
    }
    const cs = this.classSubjects.find((c) => c.id === data.classSubjectId.trim() && c.tenantId === tenantId);
    if (!cs) {
      return { success: false, error: 'Mata pelajaran rombel tidak ditemukan atau bukan milik tenant Anda.' };
    }
    if (cs.status !== 'ACTIVE') {
      return {
        success: false,
        error: 'Mata pelajaran rombel terpilih berstatus tidak aktif. Silakan aktifkan di menu Kurikulum Rombel.',
      };
    }

    // 2. Validate Class
    const targetClassId = (data.classId || cs.classId).trim();
    if (targetClassId !== cs.classId) {
      return {
        success: false,
        error: 'ID kelas tidak sesuai dengan alokasi mata pelajaran rombel yang dipilih.',
      };
    }
    const cl = this.classes.find((c) => c.id === targetClassId && c.tenantId === tenantId);
    if (!cl) {
      return { success: false, error: 'Kelas tidak ditemukan atau bukan milik tenant Anda.' };
    }
    if (cl.status !== 'ACTIVE') {
      return {
        success: false,
        error: `Kelas '${cl.name}' berstatus tidak aktif. Jadwal hanya dapat disusun untuk kelas aktif.`,
      };
    }

    // 3. Validate Room
    if (!data.roomId) {
      return { success: false, error: 'Ruangan belajar wajib dipilih.' };
    }
    const rm = this.rooms.find((r) => r.id === data.roomId.trim() && r.tenantId === tenantId);
    if (!rm) {
      return { success: false, error: 'Ruangan tidak ditemukan atau bukan milik tenant Anda.' };
    }
    if (rm.status !== 'ACTIVE') {
      return {
        success: false,
        error: `Ruangan '${rm.name}' berstatus ${rm.status} (tidak aktif). Silakan pilih ruangan yang berstatus aktif.`,
      };
    }

    // 4. Validate DayOfWeek
    const validDays: DayOfWeek[] = ['SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU', 'AHAD'];
    if (!data.dayOfWeek || !validDays.includes(data.dayOfWeek)) {
      return {
        success: false,
        error: 'Hari tidak valid. Pilihan hari yang diperbolehkan: SENIN, SELASA, RABU, KAMIS, JUMAT, SABTU, AHAD.',
      };
    }

    // 5. Validate Time
    const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
    if (!timeRegex.test(data.startTime) || !timeRegex.test(data.endTime)) {
      return {
        success: false,
        error: 'Format jam tidak valid. Harap gunakan format HH:mm (contoh: 07:30, 09:00).',
      };
    }
    const sMin = this.timeToMinutes(data.startTime);
    const eMin = this.timeToMinutes(data.endTime);
    if (sMin >= eMin) {
      return {
        success: false,
        error: `Waktu mulai (${data.startTime}) harus lebih awal dari waktu selesai (${data.endTime}).`,
      };
    }
    if (eMin - sMin < 15) {
      return {
        success: false,
        error: 'Durasi jadwal pelajaran minimal adalah 15 menit.',
      };
    }

    const scheduleStatus: ScheduleStatus = data.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';

    // 6. Check Conflicts (if active)
    if (scheduleStatus === 'ACTIVE') {
      const conflict = this.checkScheduleConflict(tenantId, {
        classId: targetClassId,
        teacherId: cs.teacherId,
        roomId: rm.id,
        dayOfWeek: data.dayOfWeek,
        startTime: data.startTime,
        endTime: data.endTime,
      });

      if (conflict.hasConflict) {
        return {
          success: false,
          error: conflict.message,
          conflictType: conflict.type,
        };
      }
    }

    const newSchedule: Schedule = {
      id: `sch_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      tenantId,
      classSubjectId: cs.id,
      classId: targetClassId,
      roomId: rm.id,
      dayOfWeek: data.dayOfWeek,
      startTime: data.startTime,
      endTime: data.endTime,
      status: scheduleStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.schedules.push(newSchedule);
    return { success: true, schedule: this.enrichSchedule(newSchedule) };
  }

  updateSchedule(
    id: string,
    tenantId: string,
    data: Partial<{
      classSubjectId: string;
      roomId: string;
      dayOfWeek: DayOfWeek;
      startTime: string;
      endTime: string;
      status: ScheduleStatus;
    }>
  ): { success: boolean; schedule?: Schedule; error?: string; conflictType?: 'CLASS' | 'TEACHER' | 'ROOM' } {
    const index = this.schedules.findIndex((s) => s.id === id && s.tenantId === tenantId);
    if (index === -1) {
      return { success: false, error: 'Data jadwal pelajaran tidak ditemukan atau bukan milik tenant Anda.' };
    }

    const current = { ...this.schedules[index] };

    // 1. ClassSubject
    let cs = this.classSubjects.find((c) => c.id === current.classSubjectId && c.tenantId === tenantId);
    if (data.classSubjectId !== undefined && data.classSubjectId !== current.classSubjectId) {
      cs = this.classSubjects.find((c) => c.id === data.classSubjectId?.trim() && c.tenantId === tenantId);
      if (!cs) {
        return { success: false, error: 'Mata pelajaran rombel tidak ditemukan atau bukan milik tenant Anda.' };
      }
      if (cs.status !== 'ACTIVE') {
        return {
          success: false,
          error: 'Mata pelajaran rombel terpilih berstatus tidak aktif. Silakan aktifkan di menu Kurikulum Rombel.',
        };
      }
      current.classSubjectId = cs.id;
      current.classId = cs.classId;
    }

    if (!cs) {
      return { success: false, error: 'Data alokasi mata pelajaran rombel tidak valid.' };
    }

    // 2. Room
    let rm = this.rooms.find((r) => r.id === current.roomId && r.tenantId === tenantId);
    if (data.roomId !== undefined && data.roomId !== current.roomId) {
      rm = this.rooms.find((r) => r.id === data.roomId?.trim() && r.tenantId === tenantId);
      if (!rm) {
        return { success: false, error: 'Ruangan tidak ditemukan atau bukan milik tenant Anda.' };
      }
      if (rm.status !== 'ACTIVE') {
        return {
          success: false,
          error: `Ruangan '${rm.name}' berstatus ${rm.status} (tidak aktif). Silakan pilih ruangan yang berstatus aktif.`,
        };
      }
      current.roomId = rm.id;
    }

    if (!rm) {
      return { success: false, error: 'Data ruangan tidak valid.' };
    }

    // 3. Day of week
    if (data.dayOfWeek !== undefined) {
      const validDays: DayOfWeek[] = ['SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU', 'AHAD'];
      if (!validDays.includes(data.dayOfWeek)) {
        return { success: false, error: 'Hari tidak valid.' };
      }
      current.dayOfWeek = data.dayOfWeek;
    }

    // 4. Time
    const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
    if (data.startTime !== undefined) {
      if (!timeRegex.test(data.startTime)) {
        return { success: false, error: 'Format jam mulai tidak valid. Gunakan format HH:mm.' };
      }
      current.startTime = data.startTime;
    }
    if (data.endTime !== undefined) {
      if (!timeRegex.test(data.endTime)) {
        return { success: false, error: 'Format jam selesai tidak valid. Gunakan format HH:mm.' };
      }
      current.endTime = data.endTime;
    }

    const sMin = this.timeToMinutes(current.startTime);
    const eMin = this.timeToMinutes(current.endTime);
    if (sMin >= eMin) {
      return {
        success: false,
        error: `Waktu mulai (${current.startTime}) harus lebih awal dari waktu selesai (${current.endTime}).`,
      };
    }
    if (eMin - sMin < 15) {
      return { success: false, error: 'Durasi jadwal pelajaran minimal adalah 15 menit.' };
    }

    // 5. Status
    if (data.status !== undefined) {
      if (data.status !== 'ACTIVE' && data.status !== 'INACTIVE') {
        return { success: false, error: 'Status jadwal harus ACTIVE atau INACTIVE.' };
      }
      current.status = data.status;
    }

    // 6. Conflict check if active
    if (current.status === 'ACTIVE') {
      const conflict = this.checkScheduleConflict(tenantId, {
        classId: current.classId,
        teacherId: cs.teacherId,
        roomId: current.roomId,
        dayOfWeek: current.dayOfWeek,
        startTime: current.startTime,
        endTime: current.endTime,
        excludeScheduleId: id,
      });

      if (conflict.hasConflict) {
        return {
          success: false,
          error: conflict.message,
          conflictType: conflict.type,
        };
      }
    }

    current.updatedAt = new Date().toISOString();
    this.schedules[index] = current;

    return { success: true, schedule: this.enrichSchedule(current) };
  }

  deleteSchedule(id: string, tenantId: string): { success: boolean; error?: string } {
    const index = this.schedules.findIndex((s) => s.id === id && s.tenantId === tenantId);
    if (index === -1) {
      return { success: false, error: 'Data jadwal pelajaran tidak ditemukan atau bukan milik tenant Anda.' };
    }

    this.schedules.splice(index, 1);
    return { success: true };
  }

  getScheduleStats(tenantId: string): ScheduleStats {
    const tenantSchedules = this.schedules.filter((s) => s.tenantId === tenantId);
    const totalSchedules = tenantSchedules.length;
    const activeSchedules = tenantSchedules.filter((s) => s.status === 'ACTIVE').length;
    const inactiveSchedules = tenantSchedules.filter((s) => s.status === 'INACTIVE').length;

    const classSet = new Set<string>();
    const teacherSet = new Set<string>();
    const roomSet = new Set<string>();

    const byDay: Record<DayOfWeek, number> = {
      SENIN: 0,
      SELASA: 0,
      RABU: 0,
      KAMIS: 0,
      JUMAT: 0,
      SABTU: 0,
      AHAD: 0,
    };

    for (const s of tenantSchedules) {
      classSet.add(s.classId);
      roomSet.add(s.roomId);
      if (s.dayOfWeek in byDay) {
        byDay[s.dayOfWeek]++;
      }
      const cs = this.classSubjects.find((c) => c.id === s.classSubjectId);
      if (cs) {
        teacherSet.add(cs.teacherId);
      }
    }

    return {
      totalSchedules,
      activeSchedules,
      inactiveSchedules,
      totalClassesScheduled: classSet.size,
      totalTeachersScheduled: teacherSet.size,
      totalRoomsUsed: roomSet.size,
      byDay,
    };
  }

  // ==========================================
  // PHASE 3.4: ABSENSI MULTI-EVENT (ATTENDANCE)
  // ==========================================

  private enrichAttendanceSession(session: AttendanceSession): AttendanceSession {
    const attendanceType =
      this.attendanceTypes.find(
        (t) => t.id === session.attendanceTypeId && t.tenantId === session.tenantId
      ) || null;

    const rawClass = this.classes.find(
      (c) => c.id === session.classId && c.tenantId === session.tenantId
    );
    const classGroup = rawClass ? this.enrichClass(rawClass) : null;

    const records = this.attendanceRecords.filter(
      (r) => r.sessionId === session.id && r.tenantId === session.tenantId
    );

    const recordsCount = records.length;
    const presentCount = records.filter((r) => r.status === 'HADIR').length;
    const lateCount = records.filter((r) => r.status === 'TERLAMBAT').length;
    const permissionCount = records.filter((r) => r.status === 'IZIN').length;
    const sickCount = records.filter((r) => r.status === 'SAKIT').length;
    const absentCount = records.filter((r) => r.status === 'ALPA').length;

    const effectivePresent = presentCount + lateCount;
    const attendanceRate =
      recordsCount > 0 ? Math.round((effectivePresent / recordsCount) * 1000) / 10 : 0;

    return {
      ...session,
      attendanceType,
      classGroup,
      recordsCount,
      presentCount,
      lateCount,
      permissionCount,
      sickCount,
      absentCount,
      attendanceRate,
    };
  }

  // Helper to check if student belongs to class
  isStudentInClass(studentId: string, classId: string, tenantId: string): boolean {
    const student = this.students.find((s) => s.id === studentId && s.tenantId === tenantId);
    if (!student || student.status !== 'ACTIVE') return false;
    if (student.currentClassId === classId) return true;
    return this.studentClassHistories.some(
      (h) =>
        h.studentId === studentId &&
        h.classId === classId &&
        h.tenantId === tenantId &&
        h.status === 'ACTIVE' &&
        !h.exitDate
    );
  }

  // Attendance Types
  getAttendanceTypes(
    tenantId: string,
    filters?: { category?: AttendanceCategory; status?: AttendanceTypeStatus }
  ): AttendanceType[] {
    let list = this.attendanceTypes.filter((t) => t.tenantId === tenantId);
    if (filters?.category) {
      list = list.filter((t) => t.category === filters.category);
    }
    if (filters?.status) {
      list = list.filter((t) => t.status === filters.status);
    }
    return list;
  }

  getAttendanceTypeById(id: string, tenantId: string): AttendanceType | null {
    const type = this.attendanceTypes.find((t) => t.id === id && t.tenantId === tenantId);
    return type || null;
  }

  createAttendanceType(data: {
    tenantId: string;
    code: string;
    name: string;
    category: AttendanceCategory;
    status?: AttendanceTypeStatus;
  }): { success: boolean; data?: AttendanceType; error?: string } {
    if (!data.code || !data.name || !data.category) {
      return { success: false, error: 'Kode, nama, dan kategori jenis absensi wajib diisi.' };
    }

    const validCategories: AttendanceCategory[] = [
      'PAGI',
      'PEMBELAJARAN',
      'ASRAMA',
      'KEGIATAN',
      'IBADAH',
      'LAINNYA',
    ];
    if (!validCategories.includes(data.category)) {
      return { success: false, error: `Kategori absensi tidak valid. Pilihan: ${validCategories.join(', ')}` };
    }

    const codeClean = data.code.trim().toUpperCase();
    const codeExists = this.attendanceTypes.some(
      (t) => t.tenantId === data.tenantId && t.code.toUpperCase() === codeClean
    );
    if (codeExists) {
      return { success: false, error: `Kode jenis absensi "${codeClean}" sudah digunakan di lembaga ini.` };
    }

    const newType: AttendanceType = {
      id: `att_type_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      tenantId: data.tenantId,
      code: codeClean,
      name: data.name.trim(),
      category: data.category,
      status: data.status || 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.attendanceTypes.push(newType);
    return { success: true, data: newType };
  }

  updateAttendanceType(
    id: string,
    tenantId: string,
    updates: Partial<{
      code: string;
      name: string;
      category: AttendanceCategory;
      status: AttendanceTypeStatus;
    }>
  ): { success: boolean; data?: AttendanceType; error?: string } {
    const index = this.attendanceTypes.findIndex((t) => t.id === id && t.tenantId === tenantId);
    if (index === -1) {
      return { success: false, error: 'Jenis absensi tidak ditemukan atau bukan milik tenant Anda.' };
    }

    const current = { ...this.attendanceTypes[index] };

    if (updates.code) {
      const codeClean = updates.code.trim().toUpperCase();
      const codeExists = this.attendanceTypes.some(
        (t) => t.tenantId === tenantId && t.id !== id && t.code.toUpperCase() === codeClean
      );
      if (codeExists) {
        return { success: false, error: `Kode jenis absensi "${codeClean}" sudah digunakan.` };
      }
      current.code = codeClean;
    }

    if (updates.name) {
      current.name = updates.name.trim();
    }

    if (updates.category) {
      const validCategories: AttendanceCategory[] = [
        'PAGI',
        'PEMBELAJARAN',
        'ASRAMA',
        'KEGIATAN',
        'IBADAH',
        'LAINNYA',
      ];
      if (!validCategories.includes(updates.category)) {
        return { success: false, error: 'Kategori absensi tidak valid.' };
      }
      current.category = updates.category;
    }

    if (updates.status) {
      current.status = updates.status;
    }

    current.updatedAt = new Date().toISOString();
    this.attendanceTypes[index] = current;
    return { success: true, data: current };
  }

  deleteAttendanceType(id: string, tenantId: string): { success: boolean; error?: string } {
    const index = this.attendanceTypes.findIndex((t) => t.id === id && t.tenantId === tenantId);
    if (index === -1) {
      return { success: false, error: 'Jenis absensi tidak ditemukan.' };
    }

    // Check if any sessions reference this type
    const usedInSessions = this.attendanceSessions.filter(
      (s) => s.attendanceTypeId === id && s.tenantId === tenantId
    );
    if (usedInSessions.length > 0) {
      return {
        success: false,
        error: `Jenis absensi tidak dapat dihapus karena digunakan pada ${usedInSessions.length} sesi absensi. Nonaktifkan status jenis absensi jika tidak ingin digunakan.`,
      };
    }

    this.attendanceTypes.splice(index, 1);
    return { success: true };
  }

  // Attendance Sessions
  getAttendanceSessions(
    tenantId: string,
    filters?: {
      classId?: string;
      attendanceTypeId?: string;
      date?: string;
      status?: AttendanceSessionStatus;
    }
  ): AttendanceSession[] {
    let list = this.attendanceSessions.filter((s) => s.tenantId === tenantId);

    if (filters?.classId) {
      list = list.filter((s) => s.classId === filters.classId);
    }
    if (filters?.attendanceTypeId) {
      list = list.filter((s) => s.attendanceTypeId === filters.attendanceTypeId);
    }
    if (filters?.date) {
      list = list.filter((s) => s.date === filters.date);
    }
    if (filters?.status) {
      list = list.filter((s) => s.status === filters.status);
    }

    // Sort descending by date, then startTime
    list.sort((a, b) => {
      const cmpDate = b.date.localeCompare(a.date);
      if (cmpDate !== 0) return cmpDate;
      return b.startTime.localeCompare(a.startTime);
    });

    return list.map((s) => this.enrichAttendanceSession(s));
  }

  getAttendanceSessionById(id: string, tenantId: string): AttendanceSession | null {
    const session = this.attendanceSessions.find((s) => s.id === id && s.tenantId === tenantId);
    if (!session) return null;
    return this.enrichAttendanceSession(session);
  }

  createAttendanceSession(data: {
    tenantId: string;
    attendanceTypeId: string;
    classId: string;
    date: string;
    startTime: string;
    endTime: string;
    status?: AttendanceSessionStatus;
  }): { success: boolean; data?: AttendanceSession; error?: string } {
    // 1. Validate required fields
    if (!data.attendanceTypeId || !data.classId || !data.date || !data.startTime || !data.endTime) {
      return { success: false, error: 'Jenis absensi, kelas, tanggal, jam mulai, dan jam selesai wajib diisi.' };
    }

    // 2. Validate tenant relation: attendanceType
    const attType = this.attendanceTypes.find(
      (t) => t.id === data.attendanceTypeId && t.tenantId === data.tenantId
    );
    if (!attType) {
      return { success: false, error: 'Jenis absensi tidak ditemukan atau bukan milik tenant Anda.' };
    }
    if (attType.status !== 'ACTIVE') {
      return { success: false, error: 'Jenis absensi yang dipilih sedang tidak aktif (INACTIVE).' };
    }

    // 3. Validate tenant relation: classGroup
    const classGroup = this.classes.find(
      (c) => c.id === data.classId && c.tenantId === data.tenantId
    );
    if (!classGroup) {
      return { success: false, error: 'Kelas/rombel tidak ditemukan atau bukan milik tenant Anda.' };
    }
    if (classGroup.status !== 'ACTIVE') {
      return { success: false, error: 'Kelas/rombel yang dipilih sedang tidak aktif (ARCHIVED/INACTIVE).' };
    }

    // 4. Validate time range
    if (data.startTime >= data.endTime) {
      return { success: false, error: 'Jam selesai harus lebih akhir dari jam mulai.' };
    }

    // 5. Check duplicate session for same class, type, and date
    const existing = this.attendanceSessions.find(
      (s) =>
        s.tenantId === data.tenantId &&
        s.classId === data.classId &&
        s.attendanceTypeId === data.attendanceTypeId &&
        s.date === data.date
    );
    if (existing) {
      return {
        success: false,
        error: `Sesi absensi untuk kelas "${classGroup.name}" dengan jenis "${attType.name}" pada tanggal ${data.date} sudah ada (${existing.status}). Silakan gunakan sesi yang sudah dibuat.`,
      };
    }

    const newSession: AttendanceSession = {
      id: `att_sess_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      tenantId: data.tenantId,
      attendanceTypeId: data.attendanceTypeId,
      classId: data.classId,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      status: data.status || 'OPEN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.attendanceSessions.push(newSession);
    return { success: true, data: this.enrichAttendanceSession(newSession) };
  }

  updateAttendanceSession(
    id: string,
    tenantId: string,
    updates: Partial<{
      attendanceTypeId: string;
      startTime: string;
      endTime: string;
      status: AttendanceSessionStatus;
    }>
  ): { success: boolean; data?: AttendanceSession; error?: string } {
    const index = this.attendanceSessions.findIndex((s) => s.id === id && s.tenantId === tenantId);
    if (index === -1) {
      return { success: false, error: 'Sesi absensi tidak ditemukan atau bukan milik tenant Anda.' };
    }

    const current = { ...this.attendanceSessions[index] };

    // If session is CLOSED, only status change (reopening) is permitted
    if (current.status === 'CLOSED' && updates.status !== 'OPEN' && Object.keys(updates).some((k) => k !== 'status')) {
      return {
        success: false,
        error: 'Sesi absensi sudah ditutup (CLOSED). Buka kembali sesi terlebih dahulu untuk mengubah konfigurasi.',
      };
    }

    if (updates.attendanceTypeId) {
      const attType = this.attendanceTypes.find(
        (t) => t.id === updates.attendanceTypeId && t.tenantId === tenantId
      );
      if (!attType) {
        return { success: false, error: 'Jenis absensi tidak valid.' };
      }
      current.attendanceTypeId = updates.attendanceTypeId;
    }

    if (updates.startTime) current.startTime = updates.startTime;
    if (updates.endTime) current.endTime = updates.endTime;
    if (current.startTime >= current.endTime) {
      return { success: false, error: 'Jam selesai harus lebih akhir dari jam mulai.' };
    }

    if (updates.status) {
      if (updates.status !== 'OPEN' && updates.status !== 'CLOSED') {
        return { success: false, error: 'Status sesi harus OPEN atau CLOSED.' };
      }
      current.status = updates.status;
    }

    current.updatedAt = new Date().toISOString();
    this.attendanceSessions[index] = current;
    return { success: true, data: this.enrichAttendanceSession(current) };
  }

  closeAttendanceSession(id: string, tenantId: string): { success: boolean; data?: AttendanceSession; error?: string } {
    return this.updateAttendanceSession(id, tenantId, { status: 'CLOSED' });
  }

  deleteAttendanceSession(id: string, tenantId: string): { success: boolean; error?: string } {
    const index = this.attendanceSessions.findIndex((s) => s.id === id && s.tenantId === tenantId);
    if (index === -1) {
      return { success: false, error: 'Sesi absensi tidak ditemukan.' };
    }

    // Cascade delete records
    this.attendanceRecords = this.attendanceRecords.filter(
      (r) => !(r.sessionId === id && r.tenantId === tenantId)
    );

    this.attendanceSessions.splice(index, 1);
    return { success: true };
  }

  // Attendance Records
  getAttendanceRecords(sessionId: string, tenantId: string): AttendanceRecord[] {
    const session = this.attendanceSessions.find((s) => s.id === sessionId && s.tenantId === tenantId);
    if (!session) return [];

    const records = this.attendanceRecords.filter(
      (r) => r.sessionId === sessionId && r.tenantId === tenantId
    );

    return records.map((r) => {
      const student = this.students.find((s) => s.id === r.studentId && s.tenantId === tenantId);
      return {
        ...r,
        student: student ? this.enrichStudent(student) : null,
      };
    });
  }

  recordAttendance(
    sessionId: string,
    tenantId: string,
    records: { studentId: string; status: AttendanceRecordStatus; note?: string }[],
    recordedBy: string
  ): { success: boolean; count?: number; error?: string } {
    // 1. Validate session
    const session = this.attendanceSessions.find((s) => s.id === sessionId && s.tenantId === tenantId);
    if (!session) {
      return { success: false, error: 'Sesi absensi tidak ditemukan atau bukan milik tenant Anda.' };
    }

    // 2. CRITICAL VALIDATION: Session must be OPEN
    if (session.status !== 'OPEN') {
      return {
        success: false,
        error: 'Sesi absensi sudah berstatus DITUTUP (CLOSED). Tidak dapat menambah atau memperbarui presensi kehadiran santri.',
      };
    }

    // 3. Validate duplicate studentIds in payload
    const studentIds = records.map((r) => r.studentId);
    if (new Set(studentIds).size !== studentIds.length) {
      return { success: false, error: 'Terdapat santri duplikat dalam data absensi yang dikirim.' };
    }

    // 4. Validate each student belongs to tenant, is ACTIVE, and belongs to session class
    const validStatuses: AttendanceRecordStatus[] = ['HADIR', 'TERLAMBAT', 'IZIN', 'SAKIT', 'ALPA'];

    for (const item of records) {
      if (!validStatuses.includes(item.status)) {
        return { success: false, error: `Status absensi "${item.status}" tidak valid.` };
      }

      const student = this.students.find((s) => s.id === item.studentId && s.tenantId === tenantId);
      if (!student) {
        return { success: false, error: `Santri dengan ID "${item.studentId}" tidak ditemukan dalam lembaga ini.` };
      }
      if (student.status !== 'ACTIVE') {
        return {
          success: false,
          error: `Santri "${student.fullName}" berstatus ${student.status} (bukan ACTIVE). Hanya santri aktif yang dapat diabsen.`,
        };
      }

      const isInClass = this.isStudentInClass(item.studentId, session.classId, tenantId);
      if (!isInClass) {
        return {
          success: false,
          error: `Santri "${student.fullName}" bukan merupakan anggota dari rombel sesi ini. Hanya santri rombel terkait yang dapat diabsen.`,
        };
      }
    }

    // 5. Upsert records (no duplicate record for same student in same session)
    const now = new Date().toISOString();
    let savedCount = 0;

    for (const item of records) {
      const existingIdx = this.attendanceRecords.findIndex(
        (r) => r.sessionId === sessionId && r.studentId === item.studentId && r.tenantId === tenantId
      );

      if (existingIdx !== -1) {
        this.attendanceRecords[existingIdx] = {
          ...this.attendanceRecords[existingIdx],
          status: item.status,
          note: item.note ? item.note.trim() : undefined,
          recordedAt: now,
          recordedBy,
        };
      } else {
        const newRecord: AttendanceRecord = {
          id: `att_rec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          tenantId,
          sessionId,
          studentId: item.studentId,
          status: item.status,
          note: item.note ? item.note.trim() : undefined,
          recordedAt: now,
          recordedBy,
        };
        this.attendanceRecords.push(newRecord);
      }
      savedCount++;
    }

    // Update session timestamp
    session.updatedAt = now;

    return { success: true, count: savedCount };
  }

  updateAttendanceRecord(
    id: string,
    tenantId: string,
    updates: { status?: AttendanceRecordStatus; note?: string },
    recordedBy: string
  ): { success: boolean; data?: AttendanceRecord; error?: string } {
    const index = this.attendanceRecords.findIndex((r) => r.id === id && r.tenantId === tenantId);
    if (index === -1) {
      return { success: false, error: 'Catatan absensi tidak ditemukan.' };
    }

    const current = this.attendanceRecords[index];
    const session = this.attendanceSessions.find((s) => s.id === current.sessionId && s.tenantId === tenantId);
    if (!session || session.status !== 'OPEN') {
      return {
        success: false,
        error: 'Sesi absensi telah ditutup (CLOSED). Tidak dapat mengubah data kehadiran.',
      };
    }

    if (updates.status) {
      const validStatuses: AttendanceRecordStatus[] = ['HADIR', 'TERLAMBAT', 'IZIN', 'SAKIT', 'ALPA'];
      if (!validStatuses.includes(updates.status)) {
        return { success: false, error: 'Status absensi tidak valid.' };
      }
      current.status = updates.status;
    }

    if (updates.note !== undefined) {
      current.note = updates.note ? updates.note.trim() : undefined;
    }

    current.recordedAt = new Date().toISOString();
    current.recordedBy = recordedBy;
    this.attendanceRecords[index] = current;

    const student = this.students.find((s) => s.id === current.studentId && s.tenantId === tenantId);
    return {
      success: true,
      data: {
        ...current,
        student: student ? this.enrichStudent(student) : null,
      },
    };
  }

  deleteAttendanceRecord(id: string, tenantId: string): { success: boolean; error?: string } {
    const index = this.attendanceRecords.findIndex((r) => r.id === id && r.tenantId === tenantId);
    if (index === -1) {
      return { success: false, error: 'Catatan absensi tidak ditemukan.' };
    }

    const session = this.attendanceSessions.find(
      (s) => s.id === this.attendanceRecords[index].sessionId && s.tenantId === tenantId
    );
    if (!session || session.status !== 'OPEN') {
      return {
        success: false,
        error: 'Sesi absensi telah ditutup (CLOSED). Tidak dapat menghapus catatan presensi.',
      };
    }

    this.attendanceRecords.splice(index, 1);
    return { success: true };
  }

  getAttendanceStats(tenantId: string): AttendanceOverallStats {
    const sessions = this.attendanceSessions.filter((s) => s.tenantId === tenantId);
    const totalSessions = sessions.length;
    const openSessions = sessions.filter((s) => s.status === 'OPEN').length;
    const closedSessions = sessions.filter((s) => s.status === 'CLOSED').length;

    const records = this.attendanceRecords.filter((r) => r.tenantId === tenantId);
    const totalRecords = records.length;
    const presentRecords = records.filter((r) => r.status === 'HADIR' || r.status === 'TERLAMBAT').length;
    const overallAttendanceRate =
      totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 1000) / 10 : 0;

    const byCategory: Record<AttendanceCategory, number> = {
      PAGI: 0,
      PEMBELAJARAN: 0,
      ASRAMA: 0,
      KEGIATAN: 0,
      IBADAH: 0,
      LAINNYA: 0,
    };

    for (const session of sessions) {
      const attType = this.attendanceTypes.find((t) => t.id === session.attendanceTypeId);
      if (attType && attType.category in byCategory) {
        byCategory[attType.category]++;
      }
    }

    return {
      totalSessions,
      openSessions,
      closedSessions,
      totalRecords,
      overallAttendanceRate,
      byCategory,
    };
  }
}

export const db = new PesantrenDatabase();

