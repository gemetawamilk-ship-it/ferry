import {
  User,
  Tenant,
  RoleDefinition,
  Permission,
  AuditLog,
  DashboardData,
  RoleType,
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
  Employee,
  Teacher,
  Musyrif,
  StaffStats,
  Student,
  Parent,
  StudentParent,
  StudentRoomHistory,
  StudentStats,
  ClassGroup,
  StudentClassHistory,
  ClassStats,
  Subject,
  SubjectStats,
  ClassSubject,
  ClassSubjectStats,
  Schedule,
  ScheduleStats,
  ScheduleStatus,
  DayOfWeek,
} from '../types';

const TOKEN_KEY = 'epesantren360_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  const raw = await response.text();
  let data: any = null;

  if (contentType.includes('application/json')) {
    try {
      data = JSON.parse(raw);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    throw new Error(
      data?.error ||
      `Server API mengembalikan HTTP ${response.status}. Periksa konfigurasi deployment.`
    );
  }

  if (!data) {
    throw new Error('Respons server bukan JSON. Pastikan API E-PESANTREN 360 ter-deploy dengan benar.');
  }

  return data;
}

export const api = {
  // Auth
  async login(identifier: string, password: string, tenantCode?: string) {
    return request<{
      success: boolean;
      token: string;
      user: User;
      tenant: Tenant;
      roleDefinition: RoleDefinition;
    }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password, tenantCode }),
    });
  },

  async logout() {
    try {
      await request('/api/auth/logout', { method: 'POST' });
    } finally {
      removeStoredToken();
    }
  },

  async getMe() {
    return request<{
      success: boolean;
      user: User;
      tenant: Tenant;
      roleDefinition: RoleDefinition;
      permissions: string[];
    }>('/api/auth/me');
  },

  async quickSwitchRole(role: RoleType, tenantId?: string) {
    return request<{
      success: boolean;
      token: string;
      user: User;
      tenant: Tenant;
      roleDefinition: RoleDefinition;
      permissions: string[];
    }>('/api/auth/quick-switch', {
      method: 'POST',
      body: JSON.stringify({ role, tenantId }),
    });
  },

  // Tenants
  async getTenants() {
    return request<{ success: boolean; tenants: Tenant[] }>('/api/tenants');
  },

  // Users
  async getUsers(params?: { role?: string; search?: string }) {
    const query = new URLSearchParams();
    if (params?.role) query.append('role', params.role);
    if (params?.search) query.append('search', params.search);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return request<{ success: boolean; total: number; users: User[] }>(`/api/users${qs}`);
  },

  async createUser(userData: {
    fullName: string;
    username: string;
    email: string;
    phone: string;
    role: RoleType;
    scope?: DataScope;
    password: string;
    assignedEntityName?: string;
    tenantId?: string;
  }) {
    return request<{ success: boolean; message: string; user: User }>('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  async updateUser(id: string, updates: Partial<User>) {
    return request<{ success: boolean; message: string; user: User }>(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deleteUser(id: string) {
    return request<{ success: boolean; message: string }>(`/api/users/${id}`, {
      method: 'DELETE',
    });
  },

  // Roles & Permissions
  async getRoles() {
    return request<{ success: boolean; roles: RoleDefinition[] }>('/api/roles');
  },

  async getPermissions() {
    return request<{ success: boolean; permissions: Permission[] }>('/api/permissions');
  },

  // Audit Logs
  async getAuditLogs() {
    return request<{ success: boolean; total: number; logs: AuditLog[] }>('/api/audit-logs');
  },

  // Dashboard
  async getDashboardStats() {
    return request<{ success: boolean; data: DashboardData }>('/api/dashboard/stats');
  },

  // ==================== MASTER DATA: INSTITUTION ====================
  async getInstitution(tenantId?: string) {
    const query = tenantId ? `?tenantId=${tenantId}` : '';
    return request<{ success: boolean; data: Institution }>(`/api/institution${query}`);
  },

  async updateInstitution(data: Partial<Institution>) {
    return request<{ success: boolean; message: string; data: Institution }>('/api/institution', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // ==================== MASTER DATA: ACADEMIC YEARS ====================
  async getAcademicYears(params?: { status?: string; search?: string; tenantId?: string }) {
    const q = new URLSearchParams();
    if (params?.status) q.append('status', params.status);
    if (params?.search) q.append('search', params.search);
    if (params?.tenantId) q.append('tenantId', params.tenantId);
    const queryString = q.toString() ? `?${q.toString()}` : '';
    return request<{ success: boolean; total: number; data: AcademicYear[] }>(`/api/academic-years${queryString}`);
  },

  async createAcademicYear(data: {
    name: string;
    startDate: string;
    endDate: string;
    isActive?: boolean;
    status?: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
    tenantId?: string;
  }) {
    return request<{ success: boolean; message: string; data: AcademicYear }>('/api/academic-years', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateAcademicYear(
    id: string,
    updates: {
      name?: string;
      startDate?: string;
      endDate?: string;
      status?: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
    }
  ) {
    return request<{ success: boolean; message: string; data: AcademicYear }>(`/api/academic-years/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async setActiveAcademicYear(id: string) {
    return request<{
      success: boolean;
      message: string;
      activeYear: AcademicYear;
      previousActiveYear?: AcademicYear;
    }>(`/api/academic-years/${id}/activate`, {
      method: 'POST',
    });
  },

  async archiveAcademicYear(id: string) {
    return request<{ success: boolean; message: string; data: AcademicYear }>(
      `/api/academic-years/${id}/archive`,
      {
        method: 'POST',
      }
    );
  },

  async deleteAcademicYear(id: string) {
    return request<{ success: boolean; message: string }>(`/api/academic-years/${id}`, {
      method: 'DELETE',
    });
  },

  // ==================== MASTER DATA: PROGRAMS ====================
  async getPrograms(params?: { status?: string; search?: string; tenantId?: string }) {
    const q = new URLSearchParams();
    if (params?.status) q.append('status', params.status);
    if (params?.search) q.append('search', params.search);
    if (params?.tenantId) q.append('tenantId', params.tenantId);
    const queryString = q.toString() ? `?${q.toString()}` : '';
    return request<{ success: boolean; total: number; data: Program[] }>(`/api/programs${queryString}`);
  },

  async createProgram(data: {
    name: string;
    code: string;
    description?: string;
    status?: 'ACTIVE' | 'INACTIVE';
    tenantId?: string;
  }) {
    return request<{ success: boolean; message: string; data: Program }>('/api/programs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateProgram(
    id: string,
    updates: {
      name?: string;
      code?: string;
      description?: string;
      status?: 'ACTIVE' | 'INACTIVE';
    }
  ) {
    return request<{ success: boolean; message: string; data: Program }>(`/api/programs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async toggleProgramStatus(id: string) {
    return request<{ success: boolean; message: string; data: Program }>(`/api/programs/${id}/toggle-status`, {
      method: 'PATCH',
    });
  },

  async deleteProgram(id: string) {
    return request<{ success: boolean; message: string }>(`/api/programs/${id}`, {
      method: 'DELETE',
    });
  },

  // ==================== PHASE 2.2: BUILDINGS (GEDUNG) ====================
  async getBuildings() {
    return request<{ success: boolean; data: Building[] }>('/api/buildings');
  },

  async getBuildingById(id: string) {
    return request<{ success: boolean; data: Building }>(`/api/buildings/${id}`);
  },

  async createBuilding(data: {
    name: string;
    code: string;
    functionType?: string;
    location?: string;
    description?: string;
    status?: 'ACTIVE' | 'INACTIVE';
  }) {
    return request<{ success: boolean; message: string; data: Building }>('/api/buildings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateBuilding(
    id: string,
    updates: {
      name?: string;
      code?: string;
      functionType?: string;
      location?: string;
      description?: string;
      status?: 'ACTIVE' | 'INACTIVE';
    }
  ) {
    return request<{ success: boolean; message: string; data: Building }>(`/api/buildings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async toggleBuildingStatus(id: string) {
    return request<{ success: boolean; message: string; data: Building }>(`/api/buildings/${id}/toggle-status`, {
      method: 'PATCH',
    });
  },

  async deleteBuilding(id: string) {
    return request<{ success: boolean; message: string }>(`/api/buildings/${id}`, {
      method: 'DELETE',
    });
  },

  // ==================== PHASE 2.2: DORMITORIES (ASRAMA) ====================
  async getDormitoryStats() {
    return request<{ success: boolean; data: DormitoryStats }>('/api/dormitories/stats');
  },

  async getDormitories() {
    return request<{ success: boolean; data: Dormitory[] }>('/api/dormitories');
  },

  async getDormitoryById(id: string) {
    return request<{ success: boolean; data: Dormitory }>(`/api/dormitories/${id}`);
  },

  async createDormitory(data: {
    buildingId: string;
    name: string;
    code: string;
    genderType: DormitoryGenderType;
    totalCapacity: number;
    description?: string;
    status?: 'ACTIVE' | 'INACTIVE';
  }) {
    return request<{ success: boolean; message: string; data: Dormitory }>('/api/dormitories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateDormitory(
    id: string,
    updates: {
      buildingId?: string;
      name?: string;
      code?: string;
      genderType?: DormitoryGenderType;
      totalCapacity?: number;
      description?: string;
      status?: 'ACTIVE' | 'INACTIVE';
    }
  ) {
    return request<{ success: boolean; message: string; data: Dormitory }>(`/api/dormitories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async toggleDormitoryStatus(id: string) {
    return request<{ success: boolean; message: string; data: Dormitory }>(`/api/dormitories/${id}/toggle-status`, {
      method: 'PATCH',
    });
  },

  async deleteDormitory(id: string) {
    return request<{ success: boolean; message: string }>(`/api/dormitories/${id}`, {
      method: 'DELETE',
    });
  },

  // ==================== PHASE 2.2: DORMITORY SUPERVISORS (MUSYRIF) ====================
  async getDormitorySupervisors(dormitoryId: string) {
    return request<{ success: boolean; data: DormitorySupervisor[] }>(`/api/dormitories/${dormitoryId}/supervisors`);
  },

  async addDormitorySupervisor(
    dormitoryId: string,
    data: {
      userId: string;
      roleType?: 'MUSYRIF' | 'PENANGGUNG_JAWAB';
      isPrimary?: boolean;
    }
  ) {
    return request<{ success: boolean; message: string; data: DormitorySupervisor }>(
      `/api/dormitories/${dormitoryId}/supervisors`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  },

  async removeDormitorySupervisor(dormitoryId: string, supervisorId: string) {
    return request<{ success: boolean; message: string }>(
      `/api/dormitories/${dormitoryId}/supervisors/${supervisorId}`,
      {
        method: 'DELETE',
      }
    );
  },

  async setPrimarySupervisor(dormitoryId: string, supervisorId: string) {
    return request<{ success: boolean; message: string; data: DormitorySupervisor }>(
      `/api/dormitories/${dormitoryId}/supervisors/${supervisorId}/primary`,
      {
        method: 'PATCH',
      }
    );
  },

  // ==================== PHASE 2.2: ROOMS (KAMAR) ====================
  async getRooms(params?: {
    buildingId?: string;
    dormitoryId?: string;
    status?: string;
    genderType?: string;
    search?: string;
  }) {
    const q = new URLSearchParams();
    if (params?.buildingId) q.append('buildingId', params.buildingId);
    if (params?.dormitoryId) q.append('dormitoryId', params.dormitoryId);
    if (params?.status) q.append('status', params.status);
    if (params?.genderType) q.append('genderType', params.genderType);
    if (params?.search) q.append('search', params.search);
    const queryString = q.toString() ? `?${q.toString()}` : '';
    return request<{ success: boolean; data: Room[] }>(`/api/rooms${queryString}`);
  },

  async getRoomById(id: string) {
    return request<{ success: boolean; data: Room }>(`/api/rooms/${id}`);
  },

  async createRoom(data: {
    dormitoryId: string;
    name: string;
    code: string;
    floor: number;
    capacity: number;
    genderType?: RoomGenderType;
    status?: RoomStatus;
    description?: string;
  }) {
    return request<{ success: boolean; message: string; data: Room }>('/api/rooms', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateRoom(
    id: string,
    updates: {
      dormitoryId?: string;
      name?: string;
      code?: string;
      floor?: number;
      capacity?: number;
      genderType?: RoomGenderType;
      status?: RoomStatus;
      description?: string;
    }
  ) {
    return request<{ success: boolean; message: string; data: Room }>(`/api/rooms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async updateRoomStatus(id: string, status: RoomStatus, description?: string) {
    return request<{ success: boolean; message: string; data: Room }>(`/api/rooms/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, description }),
    });
  },

  async deleteRoom(id: string) {
    return request<{ success: boolean; message: string }>(`/api/rooms/${id}`, {
      method: 'DELETE',
    });
  },

  // ==========================================
  // SDM (EMPLOYEES, TEACHERS, MUSYRIFS)
  // ==========================================
  async getStaffStats() {
    return request<{ success: boolean; data: StaffStats }>('/api/staff/stats');
  },

  // Employees
  async getEmployees(params?: { search?: string; status?: string; type?: string }) {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.status) query.append('status', params.status);
    if (params?.type) query.append('type', params.type);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request<{ success: boolean; count: number; data: Employee[] }>(`/api/employees${queryString}`);
  },

  async getEmployeeById(id: string) {
    return request<{ success: boolean; data: Employee }>(`/api/employees/${id}`);
  },

  async createEmployee(data: Partial<Employee>) {
    return request<{ success: boolean; message: string; data: Employee }>('/api/employees', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateEmployee(id: string, updates: Partial<Employee>) {
    return request<{ success: boolean; message: string; data: Employee }>(`/api/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async toggleEmployeeStatus(id: string) {
    return request<{ success: boolean; message: string; data: Employee }>(`/api/employees/${id}/toggle-status`, {
      method: 'PATCH',
    });
  },

  async deleteEmployee(id: string) {
    return request<{ success: boolean; message: string }>(`/api/employees/${id}`, {
      method: 'DELETE',
    });
  },

  async linkUserToEmployee(id: string, userId: string) {
    return request<{ success: boolean; message: string; data: Employee }>(`/api/employees/${id}/link-user`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  },

  async unlinkUserFromEmployee(id: string) {
    return request<{ success: boolean; message: string; data: Employee }>(`/api/employees/${id}/unlink-user`, {
      method: 'POST',
    });
  },

  // Teachers
  async getTeachers(params?: { search?: string; status?: string }) {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.status) query.append('status', params.status);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request<{ success: boolean; count: number; data: Teacher[] }>(`/api/teachers${queryString}`);
  },

  async getTeacherById(id: string) {
    return request<{ success: boolean; data: Teacher }>(`/api/teachers/${id}`);
  },

  async createTeacher(data: Partial<Teacher>) {
    return request<{ success: boolean; message: string; data: Teacher }>('/api/teachers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateTeacher(id: string, updates: Partial<Teacher>) {
    return request<{ success: boolean; message: string; data: Teacher }>(`/api/teachers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async toggleTeacherStatus(id: string) {
    return request<{ success: boolean; message: string; data: Teacher }>(`/api/teachers/${id}/toggle-status`, {
      method: 'PATCH',
    });
  },

  async deleteTeacher(id: string) {
    return request<{ success: boolean; message: string }>(`/api/teachers/${id}`, {
      method: 'DELETE',
    });
  },

  // Musyrifs
  async getMusyrifs(params?: { search?: string; status?: string }) {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.status) query.append('status', params.status);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request<{ success: boolean; count: number; data: Musyrif[] }>(`/api/musyrifs${queryString}`);
  },

  async getMusyrifById(id: string) {
    return request<{ success: boolean; data: Musyrif }>(`/api/musyrifs/${id}`);
  },

  async createMusyrif(data: Partial<Musyrif>) {
    return request<{ success: boolean; message: string; data: Musyrif }>('/api/musyrifs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateMusyrif(id: string, updates: Partial<Musyrif>) {
    return request<{ success: boolean; message: string; data: Musyrif }>(`/api/musyrifs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async toggleMusyrifStatus(id: string) {
    return request<{ success: boolean; message: string; data: Musyrif }>(`/api/musyrifs/${id}/toggle-status`, {
      method: 'PATCH',
    });
  },

  async deleteMusyrif(id: string) {
    return request<{ success: boolean; message: string }>(`/api/musyrifs/${id}`, {
      method: 'DELETE',
    });
  },

  // ==================== PHASE 2.4: MASTER DATA SANTRI & WALI ====================

  // Students
  async getStudents(params?: {
    search?: string;
    status?: string;
    gender?: string;
    programId?: string;
    academicYearId?: string;
    hasRoom?: string;
  }) {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.status) query.append('status', params.status);
    if (params?.gender) query.append('gender', params.gender);
    if (params?.programId) query.append('programId', params.programId);
    if (params?.academicYearId) query.append('academicYearId', params.academicYearId);
    if (params?.hasRoom) query.append('hasRoom', params.hasRoom);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request<{ success: boolean; count: number; data: Student[] }>(`/api/students${queryString}`);
  },

  async getStudentStats() {
    return request<{ success: boolean; data: StudentStats }>('/api/students/stats');
  },

  async getStudentById(id: string) {
    return request<{ success: boolean; data: Student }>(`/api/students/${id}`);
  },

  async createStudent(data: Partial<Student>) {
    return request<{ success: boolean; message: string; data: Student }>('/api/students', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateStudent(id: string, updates: Partial<Student>) {
    return request<{ success: boolean; message: string; data: Student }>(`/api/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async toggleStudentStatus(id: string, status?: string) {
    return request<{ success: boolean; message: string; data: Student }>(`/api/students/${id}/toggle-status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  async deleteStudent(id: string) {
    return request<{ success: boolean; message: string }>(`/api/students/${id}`, {
      method: 'DELETE',
    });
  },

  async linkStudentUser(id: string, userId: string) {
    return request<{ success: boolean; message: string; data: Student }>(`/api/students/${id}/link-user`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  },

  async unlinkStudentUser(id: string) {
    return request<{ success: boolean; message: string; data: Student }>(`/api/students/${id}/unlink-user`, {
      method: 'POST',
    });
  },

  async assignStudentRoom(id: string, roomId: string, notes?: string) {
    return request<{ success: boolean; message: string; data: Student }>(`/api/students/${id}/room`, {
      method: 'POST',
      body: JSON.stringify({ roomId, notes }),
    });
  },

  async removeStudentRoom(id: string) {
    return request<{ success: boolean; message: string; data: Student }>(`/api/students/${id}/room`, {
      method: 'DELETE',
    });
  },

  async getStudentParents(id: string) {
    return request<{ success: boolean; data: StudentParent[] }>(`/api/students/${id}/parents`);
  },

  async addStudentParent(
    id: string,
    data: {
      parentId: string;
      relationship: string;
      isPrimaryContact?: boolean;
      isEmergencyContact?: boolean;
    }
  ) {
    return request<{ success: boolean; message: string; data: StudentParent; student?: Student }>(
      `/api/students/${id}/parents`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  },

  async removeStudentParent(id: string, parentId: string) {
    return request<{ success: boolean; message: string; student?: Student }>(
      `/api/students/${id}/parents/${parentId}`,
      {
        method: 'DELETE',
      }
    );
  },

  // Parents
  async getParents(params?: { search?: string; relationshipType?: string }) {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.relationshipType) query.append('relationshipType', params.relationshipType);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request<{ success: boolean; count: number; data: Parent[] }>(`/api/parents${queryString}`);
  },

  async getParentById(id: string) {
    return request<{ success: boolean; data: Parent }>(`/api/parents/${id}`);
  },

  async createParent(data: Partial<Parent>) {
    return request<{ success: boolean; message: string; data: Parent }>('/api/parents', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateParent(id: string, updates: Partial<Parent>) {
    return request<{ success: boolean; message: string; data: Parent }>(`/api/parents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deleteParent(id: string) {
    return request<{ success: boolean; message: string }>(`/api/parents/${id}`, {
      method: 'DELETE',
    });
  },

  async linkParentUser(id: string, userId: string) {
    return request<{ success: boolean; message: string; data: Parent }>(`/api/parents/${id}/link-user`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  },

  async unlinkParentUser(id: string) {
    return request<{ success: boolean; message: string; data: Parent }>(`/api/parents/${id}/unlink-user`, {
      method: 'POST',
    });
  },

  // ==========================================
  // PHASE 2.5: MASTER DATA KELAS & ROMBEL
  // ==========================================
  async getClassStats() {
    return request<{ success: boolean; data: ClassStats }>('/api/classes/stats');
  },

  async getClasses(params?: {
    academicYearId?: string;
    programId?: string;
    gender?: string;
    status?: string;
    search?: string;
    level?: string | number;
  }) {
    const query = new URLSearchParams();
    if (params?.academicYearId) query.append('academicYearId', params.academicYearId);
    if (params?.programId) query.append('programId', params.programId);
    if (params?.gender) query.append('gender', params.gender);
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    if (params?.level !== undefined && params?.level !== '') query.append('level', String(params.level));
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request<{ success: boolean; count: number; data: ClassGroup[] }>(`/api/classes${queryString}`);
  },

  async getClassById(id: string) {
    return request<{ success: boolean; data: ClassGroup }>(`/api/classes/${id}`);
  },

  async createClass(data: Partial<ClassGroup>) {
    return request<{ success: boolean; message: string; data: ClassGroup }>('/api/classes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateClass(id: string, updates: Partial<ClassGroup>) {
    return request<{ success: boolean; message: string; data: ClassGroup }>(`/api/classes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deleteClass(id: string) {
    return request<{ success: boolean; message: string }>(`/api/classes/${id}`, {
      method: 'DELETE',
    });
  },

  async getClassStudents(id: string) {
    return request<{
      success: boolean;
      count: number;
      data: (StudentClassHistory & { student?: Student })[];
    }>(`/api/classes/${id}/students`);
  },

  async assignStudentClass(classId: string, studentId: string, notes?: string) {
    return request<{
      success: boolean;
      message: string;
      data: { classGroup: ClassGroup; student: Student };
    }>(`/api/classes/${classId}/students`, {
      method: 'POST',
      body: JSON.stringify({ studentId, notes }),
    });
  },

  async transferStudentClass(sourceClassId: string, studentId: string, targetClassId: string, notes?: string) {
    return request<{
      success: boolean;
      message: string;
      data: Student;
    }>(`/api/classes/${sourceClassId}/students/${studentId}`, {
      method: 'PUT',
      body: JSON.stringify({ targetClassId, notes }),
    });
  },

  async removeStudentFromClass(classId: string, studentId: string, reason?: string) {
    return request<{
      success: boolean;
      message: string;
      data: Student;
    }>(`/api/classes/${classId}/students/${studentId}`, {
      method: 'DELETE',
      body: JSON.stringify({ reason }),
    });
  },

  async updateClassHomeroom(classId: string, homeroomTeacherId: string | null) {
    return request<{
      success: boolean;
      message: string;
      data: ClassGroup;
    }>(`/api/classes/${classId}/homeroom`, {
      method: 'PUT',
      body: JSON.stringify({ homeroomTeacherId }),
    });
  },

  // ==========================================
  // PHASE 3.1: MASTER DATA MATA PELAJARAN
  // ==========================================
  async getSubjectStats() {
    return request<{ success: boolean; data: SubjectStats }>('/api/subjects/stats');
  },

  async getSubjects(params?: { search?: string; type?: string; status?: string }) {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.type && params.type !== 'ALL') query.append('type', params.type);
    if (params?.status && params.status !== 'ALL') query.append('status', params.status);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return request<{ success: boolean; count: number; data: Subject[] }>(`/api/subjects${qs}`);
  },

  async getSubjectById(id: string) {
    return request<{ success: boolean; data: Subject }>(`/api/subjects/${id}`);
  },

  async createSubject(data: {
    code: string;
    name: string;
    shortName?: string;
    type: string;
    creditHours: number;
    status?: string;
    description?: string | null;
  }) {
    return request<{ success: boolean; message: string; data: Subject }>('/api/subjects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateSubject(
    id: string,
    updates: Partial<{
      code: string;
      name: string;
      shortName: string;
      type: string;
      creditHours: number;
      status: string;
      description: string | null;
    }>
  ) {
    return request<{ success: boolean; message: string; data: Subject }>(`/api/subjects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deleteSubject(id: string) {
    return request<{ success: boolean; message: string }>(`/api/subjects/${id}`, {
      method: 'DELETE',
    });
  },

  // Class Subjects (Kurikulum Rombel - Phase 3.2)
  async getClassSubjectStats() {
    return request<{ success: boolean; data: ClassSubjectStats }>('/api/class-subjects/stats');
  },

  async getClassSubjects(params?: {
    classId?: string;
    subjectId?: string;
    teacherId?: string;
    status?: string;
    search?: string;
  }) {
    const query = new URLSearchParams();
    if (params?.classId) query.append('classId', params.classId);
    if (params?.subjectId) query.append('subjectId', params.subjectId);
    if (params?.teacherId) query.append('teacherId', params.teacherId);
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request<{ success: boolean; count: number; data: ClassSubject[] }>(`/api/class-subjects${queryString}`);
  },

  async getClassSubjectById(id: string) {
    return request<{ success: boolean; data: ClassSubject }>(`/api/class-subjects/${id}`);
  },

  async createClassSubject(data: {
    classId: string;
    subjectId: string;
    teacherId: string;
    creditHours?: number;
    status?: string;
  }) {
    return request<{ success: boolean; message: string; data: ClassSubject }>('/api/class-subjects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateClassSubject(
    id: string,
    updates: Partial<{
      teacherId: string;
      creditHours: number;
      status: string;
    }>
  ) {
    return request<{ success: boolean; message: string; data: ClassSubject }>(`/api/class-subjects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deleteClassSubject(id: string) {
    return request<{ success: boolean; message: string }>(`/api/class-subjects/${id}`, {
      method: 'DELETE',
    });
  },

  // ==================== PHASE 3.3: SCHEDULE (JADWAL PELAJARAN) ====================
  async getScheduleStats() {
    return request<{ success: boolean; data: ScheduleStats }>('/api/schedules/stats');
  },

  async getSchedules(params?: {
    classId?: string;
    dayOfWeek?: DayOfWeek;
    teacherId?: string;
    roomId?: string;
    status?: ScheduleStatus;
    search?: string;
  }) {
    const query = new URLSearchParams();
    if (params?.classId) query.append('classId', params.classId);
    if (params?.dayOfWeek) query.append('dayOfWeek', params.dayOfWeek);
    if (params?.teacherId) query.append('teacherId', params.teacherId);
    if (params?.roomId) query.append('roomId', params.roomId);
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request<{ success: boolean; count: number; data: Schedule[] }>(`/api/schedules${queryString}`);
  },

  async getScheduleById(id: string) {
    return request<{ success: boolean; data: Schedule }>(`/api/schedules/${id}`);
  },

  async getSchedulesByClass(classId: string) {
    return request<{ success: boolean; count: number; data: Schedule[] }>(`/api/schedules/by-class/${classId}`);
  },

  async getSchedulesByTeacher(teacherId: string) {
    return request<{ success: boolean; count: number; data: Schedule[] }>(`/api/schedules/by-teacher/${teacherId}`);
  },

  async getSchedulesByRoom(roomId: string) {
    return request<{ success: boolean; count: number; data: Schedule[] }>(`/api/schedules/by-room/${roomId}`);
  },

  async checkScheduleConflict(data: {
    classId: string;
    teacherId: string;
    roomId: string;
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
    excludeScheduleId?: string;
  }) {
    return request<{
      success: boolean;
      data: {
        hasConflict: boolean;
        type?: 'CLASS' | 'TEACHER' | 'ROOM';
        message?: string;
        conflictingSchedule?: Schedule;
      };
    }>('/api/schedules/check-conflict', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async createSchedule(data: {
    classSubjectId: string;
    classId?: string;
    roomId: string;
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
    status?: ScheduleStatus;
  }) {
    return request<{ success: boolean; message: string; data: Schedule; conflictType?: 'CLASS' | 'TEACHER' | 'ROOM' }>(
      '/api/schedules',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  },

  async updateSchedule(
    id: string,
    updates: Partial<{
      classSubjectId: string;
      roomId: string;
      dayOfWeek: DayOfWeek;
      startTime: string;
      endTime: string;
      status: ScheduleStatus;
    }>
  ) {
    return request<{ success: boolean; message: string; data: Schedule; conflictType?: 'CLASS' | 'TEACHER' | 'ROOM' }>(
      `/api/schedules/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(updates),
      }
    );
  },

  async deleteSchedule(id: string) {
    return request<{ success: boolean; message: string }>(`/api/schedules/${id}`, {
      method: 'DELETE',
    });
  },
};

