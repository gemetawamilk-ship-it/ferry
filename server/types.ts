export interface Tenant {
  id: string;
  code: string;
  name: string;
  tagline: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  plan: 'TRIAL' | 'BASIC' | 'PRO' | 'ENTERPRISE';
  status: 'ACTIVE' | 'SUSPENDED';
  totalStudents: number;
  totalTeachers: number;
  createdAt: string;
}

export type RoleType =
  | 'SUPER_ADMIN'
  | 'DIREKTUR'
  | 'MANAGER'
  | 'ADMIN'
  | 'BENDAHARA'
  | 'PENGAJAR'
  | 'MUSYRIF'
  | 'KARYAWAN'
  | 'SANTRI'
  | 'WALI_SANTRI';

export type DataScope = 'GLOBAL' | 'DEPARTMENT' | 'ASSIGNED' | 'OWN' | 'CHILD';

export interface Permission {
  id: string;
  code: string;
  name: string;
  module: string;
  description: string;
}

export interface RoleDefinition {
  code: RoleType;
  name: string;
  description: string;
  defaultScope: DataScope;
  permissions: string[];
}

export interface User {
  id: string;
  tenantId: string;
  username: string;
  email: string;
  passwordHash: string; // hashed in production, simulated here
  fullName: string;
  role: RoleType;
  scope: DataScope;
  phone: string;
  avatarUrl?: string;
  status: 'ACTIVE' | 'INACTIVE';
  assignedEntityId?: string; // e.g. class_id for teacher, child_id for parent
  assignedEntityName?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuditLog {
  id: string;
  tenantId: string;
  userId: string;
  userName: string;
  userRole: RoleType;
  action: string;
  module: string;
  entityName: string;
  entityId: string;
  previousData?: string | null;
  newData?: string | null;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

export interface Institution {
  id: string;
  tenantId: string;
  name: string;
  officialName: string;
  npsn?: string;
  nsm?: string;
  address: string;
  village: string;
  district: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  email: string;
  website: string;
  logoUrl?: string;
  directorName: string;
  foundedYear: number;
  description: string;
  updatedAt: string;
}

export interface AcademicYear {
  id: string;
  tenantId: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Program {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

// ==================== PHASE 2.2: ASRAMA & KAMAR ====================
export type DormitoryGenderType = 'PUTRA' | 'PUTRI' | 'CAMPURAN' | 'LAINNYA';
export type RoomGenderType = 'PUTRA' | 'PUTRI' | 'KHUSUS' | 'LAINNYA';
export type RoomStatus = 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
export type SupervisorRoleType = 'MUSYRIF' | 'PENANGGUNG_JAWAB';

export interface Building {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  functionType: string;
  location: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  dormitoryCount?: number;
  roomCount?: number;
}

export interface DormitorySupervisor {
  id: string;
  tenantId: string;
  dormitoryId: string;
  userId: string;
  roleType: SupervisorRoleType;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
  userName?: string;
  userRole?: string;
  userPhone?: string;
  userEmail?: string;
}

export interface Dormitory {
  id: string;
  tenantId: string;
  buildingId: string;
  name: string;
  code: string;
  genderType: DormitoryGenderType;
  totalCapacity: number;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  buildingName?: string;
  buildingCode?: string;
  roomCount?: number;
  calculatedCapacity?: number;
  supervisors?: DormitorySupervisor[];
}

export interface Room {
  id: string;
  tenantId: string;
  buildingId: string;
  dormitoryId: string;
  name: string;
  code: string;
  floor: number;
  capacity: number;
  genderType: RoomGenderType;
  status: RoomStatus;
  description?: string;
  createdAt: string;
  updatedAt: string;
  dormitoryName?: string;
  dormitoryCode?: string;
  buildingName?: string;
}

export interface DormitoryStats {
  totalBuildings: number;
  totalDormitories: number;
  totalRooms: number;
  totalCapacity: number;
  activeRooms: number;
  maintenanceRooms: number;
  inactiveRooms: number;
}

// ==================== PHASE 2.3: MASTER DATA GURU & MUSYRIF ====================
export type EmploymentStatus = 'TETAP' | 'KONTRAK' | 'HONORER' | 'MAGANG' | 'LAINNYA';
export type EmployeeGender = 'LAKI_LAKI' | 'PEREMPUAN';
export type EmployeeType = 'GURU' | 'MUSYRIF' | 'STAFF' | 'LAINNYA';
export type EmployeeStatus = 'ACTIVE' | 'INACTIVE';
export type TeachingStatus = 'ACTIVE' | 'INACTIVE';
export type MusyrifStatus = 'ACTIVE' | 'INACTIVE';

export interface Employee {
  id: string;
  tenantId: string;
  userId: string | null;
  employeeNumber: string;
  fullName: string;
  nickname?: string | null;
  gender: EmployeeGender;
  birthPlace?: string | null;
  birthDate?: string | null;
  phone: string;
  email: string;
  address?: string | null;
  joinDate: string;
  employmentStatus: EmploymentStatus;
  position: string;
  type: EmployeeType;
  photo?: string | null;
  notes?: string | null;
  status: EmployeeStatus;
  createdAt: string;
  updatedAt: string;

  // Enriched / relational
  user?: {
    id: string;
    username: string;
    email?: string;
    fullName?: string;
    role: RoleType;
    status?: string;
  } | null;
  userAccount?: {
    id: string;
    username: string;
    email: string;
    fullName: string;
    role: RoleType;
    status: string;
  } | null;
  hasAccount?: boolean;
  isTeacher?: boolean;
  isMusyrif?: boolean;
  teacherId?: string | null;
  musyrifId?: string | null;
  teacherProfile?: {
    id: string;
    teacherCode: string;
    specialization: string;
    educationLevel?: string;
    qualification?: string;
  } | null;
  musyrifProfile?: {
    id: string;
    musyrifCode: string;
    specialization: string;
  } | null;
}

export interface Teacher {
  id: string;
  tenantId: string;
  employeeId: string;
  teacherCode: string;
  specialization: string;
  educationLevel: string;
  qualification: string;
  teachingStatus: TeachingStatus;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;

  // Enriched from employee
  employee?: Employee;
  employeeNumber?: string;
  fullName?: string;
  gender?: EmployeeGender;
  phone?: string;
  email?: string;
  employmentStatus?: EmploymentStatus;
  position?: string;
  userId?: string | null;
  hasAccount?: boolean;
  user?: {
    id: string;
    username: string;
    email?: string;
    fullName?: string;
    role: RoleType;
    status?: string;
  } | null;
  userAccount?: {
    id: string;
    username: string;
    role: RoleType;
    status: string;
  } | null;
}

export interface Musyrif {
  id: string;
  tenantId: string;
  employeeId: string;
  musyrifCode: string;
  specialization: string;
  notes?: string | null;
  status: MusyrifStatus;
  createdAt: string;
  updatedAt: string;

  // Enriched from employee & dormitory_supervisors
  employee?: Employee;
  employeeNumber?: string;
  fullName?: string;
  gender?: EmployeeGender;
  phone?: string;
  email?: string;
  employmentStatus?: EmploymentStatus;
  position?: string;
  userId?: string | null;
  hasAccount?: boolean;
  user?: {
    id: string;
    username: string;
    email?: string;
    fullName?: string;
    role: RoleType;
    status?: string;
  } | null;
  userAccount?: {
    id: string;
    username: string;
    role: RoleType;
    status: string;
  } | null;
  assignedDormitories?: {
    dormitoryId: string;
    dormitoryName: string;
    dormitoryCode: string;
    buildingName: string;
    roleType: string;
    isPrimary: boolean;
  }[];
}

export interface StaffStats {
  totalEmployees: number;
  totalTeachers: number;
  totalMusyrifs: number;
  activeEmployees: number;
  activeTeachers: number;
  activeMusyrifs: number;
  inactiveEmployees: number;
  withUserAccount: number;
  withoutUserAccount: number;
  byType: {
    GURU: number;
    MUSYRIF: number;
    STAF: number;
    STRUKTURAL: number;
    [key: string]: number;
  };
  byEmploymentStatus: {
    TETAP: number;
    KONTRAK: number;
    HONORER: number;
    MAGANG: number;
    [key: string]: number;
  };
  byGender: {
    LAKI_LAKI: number;
    PEREMPUAN: number;
  };
}

// ==================== PHASE 2.4: MASTER DATA SANTRI & WALI SANTRI ====================

export type StudentGender = 'LAKI_LAKI' | 'PEREMPUAN';
export type StudentStatus = 'ACTIVE' | 'GRADUATED' | 'DROPOUT' | 'MUTASI' | 'SUSPENDED';
export type ParentRelationshipType = 'AYAH' | 'IBU' | 'WALI';
export type StudentParentRelationship = 'AYAH_KANDUNG' | 'IBU_KANDUNG' | 'WALI_RESMI';

export interface Student {
  id: string;
  tenantId: string;
  userId?: string | null;
  programId?: string | null;
  academicYearId?: string | null;
  currentRoomId?: string | null;
  currentClassId?: string | null;
  nis: string;
  nisn?: string | null;
  nik?: string | null;
  fullName: string;
  nickname?: string | null;
  gender: StudentGender;
  birthPlace?: string | null;
  birthDate?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  admissionDate: string;
  status: StudentStatus;
  photo?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;

  // Enriched
  user?: {
    id: string;
    username: string;
    email?: string;
    fullName?: string;
    role: RoleType;
    status?: string;
  } | null;
  program?: Program | null;
  academicYear?: AcademicYear | null;
  currentRoom?: (Room & { dormitoryName?: string; buildingName?: string }) | null;
  currentClass?: (ClassGroup & { homeroomTeacherName?: string; academicYearName?: string; programName?: string }) | null;
  parents?: (StudentParent & { parent: Parent })[];
  roomHistories?: StudentRoomHistory[];
  classHistories?: StudentClassHistory[];
}

export interface Parent {
  id: string;
  tenantId: string;
  userId?: string | null;
  nik?: string | null;
  fullName: string;
  relationshipType: ParentRelationshipType;
  phone: string;
  email?: string | null;
  occupation?: string | null;
  address?: string | null;
  createdAt: string;
  updatedAt: string;

  // Enriched
  user?: {
    id: string;
    username: string;
    email?: string;
    fullName?: string;
    role: RoleType;
    status?: string;
  } | null;
  children?: (StudentParent & { student: Student })[];
}

export interface StudentParent {
  id: string;
  tenantId: string;
  studentId: string;
  parentId: string;
  relationship: StudentParentRelationship;
  isPrimaryContact: boolean;
  isEmergencyContact: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StudentRoomHistory {
  id: string;
  tenantId: string;
  studentId: string;
  roomId: string;
  checkInDate: string;
  checkOutDate?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;

  // Enriched
  room?: (Room & { dormitoryName?: string; buildingName?: string }) | null;
}

export interface StudentStats {
  totalStudents: number;
  activeStudents: number;
  maleStudents: number;
  femaleStudents: number;
  withRoom: number;
  withoutRoom: number;
  totalParents: number;
  byStatus: {
    ACTIVE: number;
    GRADUATED: number;
    DROPOUT: number;
    MUTASI: number;
    SUSPENDED: number;
  };
  byProgram: Record<string, number>;
}

// ==================== PHASE 2.5: MASTER DATA KELAS & ROMBEL ====================

export type ClassGender = 'PUTRA' | 'PUTRI' | 'CAMPURAN';
export type ClassStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
export type StudentClassStatus = 'ACTIVE' | 'PROMOTED' | 'TRANSFERRED' | 'RETAINED' | 'DROPOUT';

export interface ClassGroup {
  id: string;
  tenantId: string;
  academicYearId: string;
  programId: string;
  homeroomTeacherId: string | null;
  name: string;
  code: string;
  level: number;
  gender: ClassGender;
  capacity: number;
  roomLocation?: string | null;
  status: ClassStatus;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;

  // Enriched (Virtual)
  academicYear?: AcademicYear | null;
  program?: Program | null;
  homeroomTeacher?: (Teacher & { employee?: Employee; user?: User }) | null;
  totalStudents?: number;
  students?: (StudentClassHistory & { student?: Student })[];
}

export interface StudentClassHistory {
  id: string;
  tenantId: string;
  studentId: string;
  classId: string;
  academicYearId: string;
  enrollDate: string;
  exitDate?: string | null;
  status: StudentClassStatus;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;

  // Enriched
  student?: Student | null;
  classGroup?: (ClassGroup & { homeroomTeacherName?: string; academicYearName?: string; programName?: string }) | null;
}

export interface ClassStats {
  totalClasses: number;
  activeClasses: number;
  inactiveClasses: number;
  archivedClasses: number;
  totalCapacity: number;
  totalEnrolledStudents: number;
  totalEnrolled: number;
  occupancyRate: number;
  withHomeroomTeacher: number;
  withoutHomeroomTeacher: number;
  byGender: {
    PUTRA: number;
    PUTRI: number;
    CAMPURAN: number;
  };
  byLevel: Record<string, number>;
  byProgram: Record<string, number>;
}

// ==================== PHASE 3.1: MASTER DATA MATA PELAJARAN ====================

export type SubjectType = 'DINIYAH' | 'UMUM' | 'BAHASA' | 'TAHFIDZ' | 'KETERAMPILAN' | 'LAINNYA';
export type SubjectStatus = 'ACTIVE' | 'INACTIVE';

export interface Subject {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  shortName: string;
  type: SubjectType;
  creditHours: number;
  status: SubjectStatus;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SubjectStats {
  totalSubjects: number;
  activeSubjects: number;
  inactiveSubjects: number;
  diniyahSubjects: number;
  totalCreditHours: number;
  byType: Record<SubjectType, number>;
}

// ==========================================
// PHASE 3.2: KURIKULUM ROMBEL (CLASS SUBJECT)
// ==========================================
export type ClassSubjectStatus = 'ACTIVE' | 'INACTIVE';

export interface ClassSubject {
  id: string;
  tenantId: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  creditHours: number;
  status: ClassSubjectStatus;
  createdAt: string;
  updatedAt: string;

  // Joined relations for presentation
  classGroup?: ClassGroup | null;
  subject?: Subject | null;
  teacher?: (Teacher & { employee?: Employee | null }) | null;
}

export interface ClassSubjectStats {
  totalAllocations: number;
  activeAllocations: number;
  inactiveAllocations: number;
  totalCreditHours: number;
  totalClassesConfigured: number;
  totalTeachersAssigned: number;
}

// ==========================================
// PHASE 3.3: JADWAL PELAJARAN (SCHEDULE)
// ==========================================
export type DayOfWeek = 'SENIN' | 'SELASA' | 'RABU' | 'KAMIS' | 'JUMAT' | 'SABTU' | 'AHAD';
export type ScheduleStatus = 'ACTIVE' | 'INACTIVE';

export interface Schedule {
  id: string;
  tenantId: string;
  classSubjectId: string;
  classId: string;
  roomId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  status: ScheduleStatus;
  createdAt: string;
  updatedAt: string;

  // Joined relations for presentation
  classSubject?: ClassSubject | null;
  classGroup?: ClassGroup | null;
  room?: Room | null;
  teacher?: (Teacher & { employee?: Employee | null }) | null;
  subject?: Subject | null;
}

export interface ScheduleStats {
  totalSchedules: number;
  activeSchedules: number;
  inactiveSchedules: number;
  totalClassesScheduled: number;
  totalTeachersScheduled: number;
  totalRoomsUsed: number;
  byDay: Record<DayOfWeek, number>;
}

// ==========================================
// PHASE 3.4: ABSENSI MULTI-EVENT (ATTENDANCE)
// ==========================================
export type AttendanceCategory = 'PAGI' | 'PEMBELAJARAN' | 'ASRAMA' | 'KEGIATAN' | 'IBADAH' | 'LAINNYA';
export type AttendanceTypeStatus = 'ACTIVE' | 'INACTIVE';
export type AttendanceSessionStatus = 'OPEN' | 'CLOSED';
export type AttendanceRecordStatus = 'HADIR' | 'TERLAMBAT' | 'IZIN' | 'SAKIT' | 'ALPA';

export interface AttendanceType {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  category: AttendanceCategory;
  status: AttendanceTypeStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface AttendanceSession {
  id: string;
  tenantId: string;
  attendanceTypeId: string;
  classId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: AttendanceSessionStatus;
  createdAt: string;
  updatedAt: string;

  // Joined relations
  attendanceType?: AttendanceType | null;
  classGroup?: ClassGroup | null;
  recordsCount?: number;
  presentCount?: number;
  lateCount?: number;
  permissionCount?: number;
  sickCount?: number;
  absentCount?: number;
  attendanceRate?: number;
}

export interface AttendanceRecord {
  id: string;
  tenantId: string;
  sessionId: string;
  studentId: string;
  status: AttendanceRecordStatus;
  note?: string;
  recordedAt: string;
  recordedBy: string;

  // Joined relation
  student?: Student | null;
}

export interface AttendanceSessionStats {
  totalStudents: number;
  hadir: number;
  terlambat: number;
  izin: number;
  sakit: number;
  alpa: number;
  attendanceRate: number;
}

export interface AttendanceOverallStats {
  totalSessions: number;
  openSessions: number;
  closedSessions: number;
  totalRecords: number;
  overallAttendanceRate: number;
  byCategory: Record<AttendanceCategory, number>;
}


