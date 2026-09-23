import { Router, Response } from 'express';
import { db, PERMISSIONS_LIST, ROLES_DEFINITIONS } from './db';
import {
  authenticate,
  requirePermission,
  requireAnyPermission,
  enforceTenantIsolation,
  createSession,
  revokeSession,
  AuthenticatedRequest,
} from './auth';
import { RoleType, DataScope } from './types';

export const apiRouter = Router();

// ==========================================
// 1. HEALTH & SYSTEM INFO
// ==========================================
apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'E-PESANTREN 360',
    phase: 'PHASE 1 - FOUNDATION',
    timestamp: new Date().toISOString(),
    security: {
      rbac: 'ACTIVE',
      multiTenantIsolation: 'ENFORCED',
      auditLogging: 'ENABLED',
    },
  });
});

// ==========================================
// 2. AUTHENTICATION (LOGIN, LOGOUT, ME, QUICK-SWITCH)
// ==========================================
apiRouter.post('/auth/login', (req, res) => {
  const { identifier, password, tenantCode } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({
      success: false,
      error: 'Username atau email dan kata sandi wajib diisi.',
    });
  }

  let targetTenantId: string | undefined;
  if (tenantCode) {
    const foundTenant = db.getTenantByCode(tenantCode);
    if (!foundTenant) {
      return res.status(404).json({
        success: false,
        error: `Pesantren dengan kode '${tenantCode}' tidak ditemukan.`,
      });
    }
    targetTenantId = foundTenant.id;
  }

  const user = db.getUserByUsernameOrEmail(identifier, targetTenantId);

  if (!user || user.passwordHash !== password) {
    // Record failed login audit log
    db.addAuditLog({
      tenantId: targetTenantId || 'GLOBAL',
      userId: 'UNKNOWN',
      userName: identifier,
      userRole: 'KARYAWAN',
      action: 'LOGIN_FAILED',
      module: 'Autentikasi',
      entityName: 'Login Sesi',
      entityId: identifier,
      previousData: null,
      newData: `Percobaan login gagal dengan kredensial '${identifier}' dari IP ${req.ip}`,
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.status(401).json({
      success: false,
      error: 'Kredensial tidak valid. Silakan periksa kembali username/email dan password.',
    });
  }

  if (user.status !== 'ACTIVE') {
    return res.status(403).json({
      success: false,
      error: 'Akun Anda sedang dinonaktifkan oleh administrator. Silakan hubungi bagian admin pesantren.',
    });
  }

  // Update last login
  db.updateUser(user.id, { lastLoginAt: new Date().toISOString() });

  // Create session
  const token = createSession(user);
  const tenant = db.getTenantById(user.tenantId) || db.getTenants()[0];
  const roleDef = ROLES_DEFINITIONS[user.role];

  // Log successful login
  db.addAuditLog({
    tenantId: user.tenantId,
    userId: user.id,
    userName: user.fullName,
    userRole: user.role,
    action: 'LOGIN_SUCCESS',
    module: 'Autentikasi',
    entityName: 'Sesi Login',
    entityId: user.id,
    previousData: null,
    newData: `Pengguna berhasil login sebagai ${roleDef?.name || user.role}`,
    ipAddress: req.ip || '127.0.0.1',
    userAgent: req.headers['user-agent'] || 'Unknown',
  });

  return res.json({
    success: true,
    token,
    user: {
      id: user.id,
      tenantId: user.tenantId,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      scope: user.scope,
      phone: user.phone,
      assignedEntityName: user.assignedEntityName,
      lastLoginAt: user.lastLoginAt,
    },
    tenant,
    roleDefinition: roleDef,
  });
});

apiRouter.post('/auth/logout', authenticate, (req: AuthenticatedRequest, res: Response) => {
  if (req.token) {
    revokeSession(req.token);
  }

  if (req.user) {
    db.addAuditLog({
      tenantId: req.user.tenantId,
      userId: req.user.id,
      userName: req.user.fullName,
      userRole: req.user.role,
      action: 'LOGOUT',
      module: 'Autentikasi',
      entityName: 'Sesi Login',
      entityId: req.user.id,
      previousData: null,
      newData: 'Pengguna mengakhiri sesi login (logout).',
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });
  }

  return res.json({
    success: true,
    message: 'Anda berhasil keluar dari sistem.',
  });
});

apiRouter.get('/auth/me', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const tenant = req.tenant!;
  const roleDef = ROLES_DEFINITIONS[user.role];

  return res.json({
    success: true,
    user: {
      id: user.id,
      tenantId: user.tenantId,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      scope: user.scope,
      phone: user.phone,
      assignedEntityName: user.assignedEntityName,
      lastLoginAt: user.lastLoginAt,
    },
    tenant,
    roleDefinition: roleDef,
    permissions: roleDef ? roleDef.permissions : [],
  });
});

// Quick switch role endpoint (specifically for QA / Product Owner testing)
apiRouter.post('/auth/quick-switch', (req, res) => {
  const { role, tenantId } = req.body as { role: RoleType; tenantId?: string };

  const targetTenantId = tenantId || 'ten_darulmusthafa';
  const allUsers = db.getUsers();
  
  // Find matching user
  const user = allUsers.find(
    (u) => u.role === role && (role === 'SUPER_ADMIN' || u.tenantId === targetTenantId)
  ) || allUsers[0];

  const token = createSession(user);
  const tenant = db.getTenantById(user.tenantId) || db.getTenants()[0];
  const roleDef = ROLES_DEFINITIONS[user.role];

  db.addAuditLog({
    tenantId: user.tenantId,
    userId: user.id,
    userName: user.fullName,
    userRole: user.role,
    action: 'DEMO_ROLE_SWITCH',
    module: 'Testing & QA',
    entityName: 'Pergantian Role Cepat',
    entityId: role,
    previousData: null,
    newData: `Beralih peran ke: ${roleDef.name} (${user.fullName})`,
    ipAddress: req.ip || '127.0.0.1',
    userAgent: req.headers['user-agent'] || 'Demo Switcher',
  });

  return res.json({
    success: true,
    token,
    user: {
      id: user.id,
      tenantId: user.tenantId,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      scope: user.scope,
      phone: user.phone,
      assignedEntityName: user.assignedEntityName,
    },
    tenant,
    roleDefinition: roleDef,
    permissions: roleDef.permissions,
  });
});

// ==========================================
// 3. TENANT MANAGEMENT
// ==========================================
apiRouter.get('/tenants', authenticate, (req: AuthenticatedRequest, res: Response) => {
  // If Super Admin, can list all tenants. Otherwise only own tenant
  if (req.user?.role === 'SUPER_ADMIN') {
    return res.json({
      success: true,
      tenants: db.getTenants(),
    });
  }

  const myTenant = db.getTenantById(req.user!.tenantId);
  return res.json({
    success: true,
    tenants: myTenant ? [myTenant] : [],
  });
});

// ==========================================
// 4. USER MANAGEMENT (RBAC & TENANT ISOLATION)
// ==========================================
apiRouter.get(
  '/users',
  authenticate,
  requirePermission('user.view'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const roleFilter = req.query.role as string | undefined;
    const search = (req.query.search as string | undefined)?.toLowerCase().trim();

    let users = db.getUsers(req.user?.role === 'SUPER_ADMIN' ? undefined : req.user?.tenantId);

    if (roleFilter && roleFilter !== 'ALL') {
      users = users.filter((u) => u.role === roleFilter);
    }

    if (search) {
      users = users.filter(
        (u) =>
          u.fullName.toLowerCase().includes(search) ||
          u.username.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search) ||
          (u.assignedEntityName && u.assignedEntityName.toLowerCase().includes(search))
      );
    }

    // Strip passwordHash before returning to frontend
    const sanitized = users.map(({ passwordHash, ...safeUser }) => safeUser);

    return res.json({
      success: true,
      total: sanitized.length,
      users: sanitized,
    });
  }
);

apiRouter.post(
  '/users',
  authenticate,
  requirePermission('user.create'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { fullName, username, email, phone, role, scope, password, assignedEntityName } = req.body;

    // Strict validations
    if (!fullName || !username || !email || !role || !password) {
      return res.status(400).json({
        success: false,
        error: 'Nama lengkap, username, email, role, dan kata sandi wajib diisi.',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Format email tidak valid. Contoh: ustadz@darulmusthafa.sch.id',
      });
    }

    // Check duplicate
    const existing = db.getUserByUsernameOrEmail(username) || db.getUserByUsernameOrEmail(email);
    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'Username atau email tersebut telah digunakan oleh akun lain.',
      });
    }

    const tenantId = req.user?.role === 'SUPER_ADMIN' && req.body.tenantId
      ? req.body.tenantId
      : req.user!.tenantId;

    const defaultScope = ROLES_DEFINITIONS[role as RoleType]?.defaultScope || 'GLOBAL';

    const newUser = db.createUser({
      tenantId,
      fullName: fullName.trim(),
      username: username.trim().toLowerCase(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || '-',
      role: role as RoleType,
      scope: (scope as DataScope) || defaultScope,
      passwordHash: password,
      status: 'ACTIVE',
      assignedEntityName: assignedEntityName || undefined,
    });

    // Record audit log
    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'USER_CREATED',
      module: 'Master Pengguna',
      entityName: 'Akun Pengguna',
      entityId: newUser.id,
      previousData: null,
      newData: JSON.stringify({
        fullName: newUser.fullName,
        role: newUser.role,
        email: newUser.email,
      }),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    const { passwordHash, ...safeUser } = newUser;
    return res.status(201).json({
      success: true,
      message: 'Pengguna baru berhasil ditambahkan.',
      user: safeUser,
    });
  }
);

apiRouter.put(
  '/users/:id',
  authenticate,
  requirePermission('user.update'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const existingUser = db.getUserById(id);

    if (!existingUser) {
      return res.status(404).json({ success: false, error: 'Pengguna tidak ditemukan.' });
    }

    // Non-super-admin can only update users within their own tenant
    if (req.user?.role !== 'SUPER_ADMIN' && existingUser.tenantId !== req.user?.tenantId) {
      return res.status(403).json({
        success: false,
        error: 'Anda tidak diizinkan memperbarui data pengguna dari pesantren lain.',
      });
    }

    const { fullName, phone, role, scope, status, assignedEntityName } = req.body;
    const previousData = JSON.stringify({
      fullName: existingUser.fullName,
      role: existingUser.role,
      status: existingUser.status,
    });

    const updated = db.updateUser(id, {
      fullName: fullName || existingUser.fullName,
      phone: phone !== undefined ? phone : existingUser.phone,
      role: role || existingUser.role,
      scope: scope || existingUser.scope,
      status: status || existingUser.status,
      assignedEntityName: assignedEntityName !== undefined ? assignedEntityName : existingUser.assignedEntityName,
    });

    if (!updated) {
      return res.status(500).json({ success: false, error: 'Gagal memperbarui pengguna.' });
    }

    // Audit log
    db.addAuditLog({
      tenantId: existingUser.tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'USER_UPDATED',
      module: 'Master Pengguna',
      entityName: 'Akun Pengguna',
      entityId: id,
      previousData,
      newData: JSON.stringify({
        fullName: updated.fullName,
        role: updated.role,
        status: updated.status,
      }),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    const { passwordHash, ...safeUser } = updated;
    return res.json({
      success: true,
      message: 'Data pengguna berhasil diperbarui.',
      user: safeUser,
    });
  }
);

apiRouter.delete(
  '/users/:id',
  authenticate,
  requirePermission('user.delete'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const targetUser = db.getUserById(id);

    if (!targetUser) {
      return res.status(404).json({ success: false, error: 'Pengguna tidak ditemukan.' });
    }

    if (targetUser.id === req.user?.id) {
      return res.status(400).json({
        success: false,
        error: 'Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif.',
      });
    }

    // Soft delete
    db.deleteUser(id);

    db.addAuditLog({
      tenantId: targetUser.tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'USER_SOFT_DELETED',
      module: 'Master Pengguna',
      entityName: 'Akun Pengguna',
      entityId: id,
      previousData: JSON.stringify({ status: 'ACTIVE', username: targetUser.username }),
      newData: JSON.stringify({ status: 'INACTIVE', note: 'Dinonaktifkan melalui audit soft-delete' }),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      message: 'Akun pengguna berhasil dinonaktifkan (Soft Delete diterapkan).',
    });
  }
);

// ==========================================
// 5. ROLES & PERMISSIONS DEFINITIONS
// ==========================================
apiRouter.get('/roles', authenticate, (req: AuthenticatedRequest, res: Response) => {
  return res.json({
    success: true,
    roles: Object.values(ROLES_DEFINITIONS),
  });
});

apiRouter.get('/permissions', authenticate, (req: AuthenticatedRequest, res: Response) => {
  return res.json({
    success: true,
    permissions: PERMISSIONS_LIST,
  });
});

// ==========================================
// 6. AUDIT LOGS
// ==========================================
apiRouter.get(
  '/audit-logs',
  authenticate,
  requirePermission('audit.view'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = req.user?.role === 'SUPER_ADMIN' ? undefined : req.user?.tenantId;
    const logs = db.getAuditLogs(tenantId);

    return res.json({
      success: true,
      total: logs.length,
      logs,
    });
  }
);

// ==========================================
// 7. DASHBOARD METRICS
// ==========================================
apiRouter.get('/dashboard/stats', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const stats = db.getDashboardStats(req.user!.tenantId, req.user!.role, req.user!.id);
  return res.json({
    success: true,
    data: stats,
  });
});

// ==========================================
// 8. MASTER DATA: DATA LEMBAGA (INSTITUTION PROFILE)
// ==========================================
apiRouter.get(
  '/institution',
  authenticate,
  requirePermission('institution.view'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = (req.query.tenantId as string) || req.user!.tenantId;
    const institution = db.getInstitution(tenantId);

    if (!institution) {
      return res.status(404).json({
        success: false,
        error: 'Data profil lembaga pesantren belum ditemukan.',
      });
    }

    return res.json({
      success: true,
      data: institution,
    });
  }
);

apiRouter.put(
  '/institution',
  authenticate,
  requirePermission('institution.update'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = (req.body.tenantId as string) || req.user!.tenantId;
    const currentInst = db.getInstitution(tenantId);

    if (!currentInst) {
      return res.status(404).json({
        success: false,
        error: 'Data lembaga tidak ditemukan.',
      });
    }

    const {
      name,
      officialName,
      npsn,
      nsm,
      address,
      village,
      district,
      city,
      province,
      postalCode,
      phone,
      email,
      website,
      logoUrl,
      directorName,
      foundedYear,
      description,
    } = req.body;

    // Validation
    if (!name || name.trim().length < 3) {
      return res.status(400).json({
        success: false,
        error: 'Nama pesantren wajib diisi (minimal 3 karakter).',
      });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Format alamat email pesantren tidak valid.',
      });
    }

    if (foundedYear && (isNaN(Number(foundedYear)) || Number(foundedYear) < 1900 || Number(foundedYear) > new Date().getFullYear())) {
      return res.status(400).json({
        success: false,
        error: `Tahun berdiri harus berupa angka valid antara 1900 dan ${new Date().getFullYear()}.`,
      });
    }

    const updated = db.updateInstitution(tenantId, {
      name: name.trim(),
      officialName: officialName !== undefined ? officialName.trim() : (currentInst.officialName || name.trim()),
      npsn: npsn !== undefined ? npsn.trim() : currentInst.npsn,
      nsm: nsm !== undefined ? nsm.trim() : currentInst.nsm,
      address: address !== undefined ? address.trim() : currentInst.address,
      village: village !== undefined ? village.trim() : currentInst.village,
      district: district !== undefined ? district.trim() : currentInst.district,
      city: city !== undefined ? city.trim() : currentInst.city,
      province: province !== undefined ? province.trim() : currentInst.province,
      postalCode: postalCode !== undefined ? postalCode.trim() : currentInst.postalCode,
      phone: phone !== undefined ? phone.trim() : currentInst.phone,
      email: email !== undefined ? email.trim() : currentInst.email,
      website: website !== undefined ? website.trim() : currentInst.website,
      logoUrl: logoUrl !== undefined ? logoUrl : currentInst.logoUrl,
      directorName: directorName !== undefined ? directorName.trim() : currentInst.directorName,
      foundedYear: foundedYear !== undefined ? Number(foundedYear) : currentInst.foundedYear,
      description: description !== undefined ? description.trim() : currentInst.description,
    });

    // Also update tenant name and phone if present
    db.updateTenant(tenantId, {
      name: name.trim(),
      phone: phone !== undefined ? phone.trim() : currentInst.phone,
    });

    // Record Audit Log
    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'INSTITUTION_UPDATED',
      module: 'Data Lembaga',
      entityName: 'Profil Pesantren',
      entityId: currentInst.id,
      previousData: JSON.stringify({ name: currentInst.name, director: currentInst.directorName }),
      newData: JSON.stringify({ name: updated?.name, director: updated?.directorName, email: updated?.email }),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      message: 'Profil data lembaga pesantren berhasil diperbarui.',
      data: updated,
    });
  }
);

// ==========================================
// 9. MASTER DATA: TAHUN AJARAN (ACADEMIC YEARS)
// ==========================================
apiRouter.get(
  '/academic-years',
  authenticate,
  requirePermission('academic_year.view'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = (req.query.tenantId as string) || req.user!.tenantId;
    let years = db.getAcademicYears(tenantId);

    const statusFilter = req.query.status as string;
    if (statusFilter && statusFilter !== 'ALL') {
      years = years.filter((y) => y.status === statusFilter);
    }

    const searchQuery = (req.query.search as string)?.toLowerCase();
    if (searchQuery) {
      years = years.filter((y) => y.name.toLowerCase().includes(searchQuery));
    }

    return res.json({
      success: true,
      total: years.length,
      data: years,
    });
  }
);

apiRouter.post(
  '/academic-years',
  authenticate,
  requirePermission('academic_year.manage'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = (req.body.tenantId as string) || req.user!.tenantId;
    const { name, startDate, endDate, isActive, status } = req.body;

    // Validations
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Nama tahun ajaran wajib diisi (contoh: 2026/2027).',
      });
    }

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Tanggal mulai dan tanggal selesai tahun ajaran wajib diisi.',
      });
    }

    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({
        success: false,
        error: 'Tanggal mulai tidak boleh lebih besar dari tanggal selesai.',
      });
    }

    // Check duplicate name within the same tenant
    const existingYears = db.getAcademicYears(tenantId);
    const isDuplicate = existingYears.some(
      (y) => y.name.trim().toLowerCase() === name.trim().toLowerCase()
    );

    if (isDuplicate) {
      return res.status(400).json({
        success: false,
        error: `Tahun ajaran '${name.trim()}' sudah ada di pesantren ini. Nama tidak boleh duplikat.`,
      });
    }

    const newYear = db.createAcademicYear({
      tenantId,
      name: name.trim(),
      startDate,
      endDate,
      status: isActive ? 'ACTIVE' : status || 'INACTIVE',
      isActive: !!isActive,
    });

    // Audit Log
    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'ACADEMIC_YEAR_CREATED',
      module: 'Tahun Ajaran',
      entityName: 'Tahun Ajaran',
      entityId: newYear.id,
      previousData: null,
      newData: JSON.stringify({ name: newYear.name, isActive: newYear.isActive, status: newYear.status }),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.status(201).json({
      success: true,
      message: `Tahun ajaran ${newYear.name} berhasil dibuat.`,
      data: newYear,
    });
  }
);

apiRouter.put(
  '/academic-years/:id',
  authenticate,
  requirePermission('academic_year.manage'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;
    const existing = db.getAcademicYearById(id, tenantId);

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Tahun ajaran tidak ditemukan.',
      });
    }

    const { name, startDate, endDate, status } = req.body;

    if (name && !name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Nama tahun ajaran tidak boleh kosong.',
      });
    }

    if (name && name.trim().toLowerCase() !== existing.name.toLowerCase()) {
      const existingYears = db.getAcademicYears(tenantId);
      const isDuplicate = existingYears.some(
        (y) => y.id !== id && y.name.trim().toLowerCase() === name.trim().toLowerCase()
      );
      if (isDuplicate) {
        return res.status(400).json({
          success: false,
          error: `Nama tahun ajaran '${name.trim()}' sudah digunakan oleh data lain.`,
        });
      }
    }

    const start = startDate || existing.startDate;
    const end = endDate || existing.endDate;

    if (new Date(start) > new Date(end)) {
      return res.status(400).json({
        success: false,
        error: 'Tanggal mulai tidak boleh lebih besar dari tanggal selesai.',
      });
    }

    const updated = db.updateAcademicYear(id, tenantId, {
      name: name ? name.trim() : existing.name,
      startDate: start,
      endDate: end,
      status: status || existing.status,
    });

    // Audit Log
    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'ACADEMIC_YEAR_UPDATED',
      module: 'Tahun Ajaran',
      entityName: 'Tahun Ajaran',
      entityId: id,
      previousData: JSON.stringify({ name: existing.name, status: existing.status }),
      newData: JSON.stringify({ name: updated?.name, status: updated?.status }),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      message: 'Tahun ajaran berhasil diperbarui.',
      data: updated,
    });
  }
);

apiRouter.post(
  '/academic-years/:id/activate',
  authenticate,
  requirePermission('academic_year.manage'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;

    const result = db.setActiveAcademicYear(id, tenantId);

    if (!result.success || !result.activeYear) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Gagal mengaktifkan tahun ajaran.',
      });
    }

    // Record Audit Log with both previous and active year
    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'ACADEMIC_YEAR_ACTIVATED',
      module: 'Tahun Ajaran',
      entityName: 'Status Aktif Tahun Ajaran',
      entityId: id,
      previousData: result.previousActiveYear
        ? JSON.stringify({ id: result.previousActiveYear.id, name: result.previousActiveYear.name, status: 'INACTIVE' })
        : null,
      newData: JSON.stringify({ id: result.activeYear.id, name: result.activeYear.name, status: 'ACTIVE' }),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      message: `Tahun Ajaran ${result.activeYear.name} kini resmi berstatus AKTIF.`,
      activeYear: result.activeYear,
      previousActiveYear: result.previousActiveYear,
    });
  }
);

apiRouter.post(
  '/academic-years/:id/archive',
  authenticate,
  requirePermission('academic_year.manage'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;

    const existing = db.getAcademicYearById(id, tenantId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Tahun ajaran tidak ditemukan.',
      });
    }

    if (existing.isActive) {
      return res.status(400).json({
        success: false,
        error: 'Tidak dapat mengarsipkan tahun ajaran yang sedang aktif.',
      });
    }

    const archived = db.archiveAcademicYear(id, tenantId);

    // Audit Log
    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'ACADEMIC_YEAR_ARCHIVED',
      module: 'Tahun Ajaran',
      entityName: 'Arsip Tahun Ajaran',
      entityId: id,
      previousData: JSON.stringify({ name: existing.name, status: existing.status }),
      newData: JSON.stringify({ name: existing.name, status: 'ARCHIVED' }),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      message: `Tahun ajaran ${existing.name} berhasil diarsipkan.`,
      data: archived,
    });
  }
);

apiRouter.delete(
  '/academic-years/:id',
  authenticate,
  requirePermission('academic_year.manage'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;

    const existing = db.getAcademicYearById(id, tenantId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Tahun ajaran tidak ditemukan.',
      });
    }

    const result = db.deleteAcademicYear(id, tenantId);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
      });
    }

    // Audit Log
    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'ACADEMIC_YEAR_DELETED',
      module: 'Tahun Ajaran',
      entityName: 'Tahun Ajaran',
      entityId: id,
      previousData: JSON.stringify({ name: existing.name, status: existing.status }),
      newData: null,
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      message: `Tahun ajaran ${existing.name} berhasil dihapus.`,
    });
  }
);

// ==========================================
// 10. MASTER DATA: PROGRAM PENDIDIKAN (PROGRAMS)
// ==========================================
apiRouter.get(
  '/programs',
  authenticate,
  requirePermission('program.view'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = (req.query.tenantId as string) || req.user!.tenantId;
    let programs = db.getPrograms(tenantId);

    const statusFilter = req.query.status as string;
    if (statusFilter && statusFilter !== 'ALL') {
      programs = programs.filter((p) => p.status === statusFilter);
    }

    const searchQuery = (req.query.search as string)?.toLowerCase();
    if (searchQuery) {
      programs = programs.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery) ||
          p.code.toLowerCase().includes(searchQuery) ||
          p.description.toLowerCase().includes(searchQuery)
      );
    }

    return res.json({
      success: true,
      total: programs.length,
      data: programs,
    });
  }
);

apiRouter.post(
  '/programs',
  authenticate,
  requirePermission('program.manage'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = (req.body.tenantId as string) || req.user!.tenantId;
    const { name, code, description, status } = req.body;

    // Validations
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Nama program pendidikan wajib diisi.',
      });
    }

    if (!code || !code.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Kode program pendidikan wajib diisi (contoh: REG, TFZ).',
      });
    }

    const cleanCode = code.trim().toUpperCase();

    // Check duplicate code in same tenant
    const existing = db.getPrograms(tenantId);
    if (existing.some((p) => p.code === cleanCode)) {
      return res.status(400).json({
        success: false,
        error: `Kode program '${cleanCode}' sudah digunakan dalam pesantren ini.`,
      });
    }

    const newProg = db.createProgram({
      tenantId,
      name: name.trim(),
      code: cleanCode,
      description: description?.trim() || '',
      status: status || 'ACTIVE',
    });

    // Audit Log
    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'PROGRAM_CREATED',
      module: 'Program Pendidikan',
      entityName: 'Program Pendidikan',
      entityId: newProg.id,
      previousData: null,
      newData: JSON.stringify({ name: newProg.name, code: newProg.code, status: newProg.status }),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.status(201).json({
      success: true,
      message: `Program pendidikan '${newProg.name}' berhasil ditambahkan.`,
      data: newProg,
    });
  }
);

apiRouter.put(
  '/programs/:id',
  authenticate,
  requirePermission('program.manage'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;

    const existing = db.getProgramById(id, tenantId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Program pendidikan tidak ditemukan.',
      });
    }

    const { name, code, description, status } = req.body;

    if (name && !name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Nama program pendidikan tidak boleh kosong.',
      });
    }

    const cleanCode = code ? code.trim().toUpperCase() : existing.code;

    if (cleanCode !== existing.code) {
      const allPrograms = db.getPrograms(tenantId);
      if (allPrograms.some((p) => p.id !== id && p.code === cleanCode)) {
        return res.status(400).json({
          success: false,
          error: `Kode program '${cleanCode}' sudah digunakan oleh program lain.`,
        });
      }
    }

    const updated = db.updateProgram(id, tenantId, {
      name: name ? name.trim() : existing.name,
      code: cleanCode,
      description: description !== undefined ? description.trim() : existing.description,
      status: status || existing.status,
    });

    // Audit Log
    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'PROGRAM_UPDATED',
      module: 'Program Pendidikan',
      entityName: 'Program Pendidikan',
      entityId: id,
      previousData: JSON.stringify({ name: existing.name, code: existing.code, status: existing.status }),
      newData: JSON.stringify({ name: updated?.name, code: updated?.code, status: updated?.status }),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      message: 'Program pendidikan berhasil diperbarui.',
      data: updated,
    });
  }
);

apiRouter.patch(
  '/programs/:id/toggle-status',
  authenticate,
  requirePermission('program.manage'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;

    const existing = db.getProgramById(id, tenantId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Program pendidikan tidak ditemukan.',
      });
    }

    const updated = db.toggleProgramStatus(id, tenantId);

    // Audit Log
    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'PROGRAM_STATUS_TOGGLED',
      module: 'Program Pendidikan',
      entityName: 'Status Program',
      entityId: id,
      previousData: JSON.stringify({ status: existing.status }),
      newData: JSON.stringify({ status: updated?.status }),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      message: `Status program kini '${updated?.status === 'ACTIVE' ? 'Aktif' : 'Nonaktif'}'.`,
      data: updated,
    });
  }
);

apiRouter.delete(
  '/programs/:id',
  authenticate,
  requirePermission('program.manage'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;

    const existing = db.getProgramById(id, tenantId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Program pendidikan tidak ditemukan.',
      });
    }

    db.deleteProgram(id, tenantId);

    // Audit Log
    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'PROGRAM_DELETED',
      module: 'Program Pendidikan',
      entityName: 'Program Pendidikan',
      entityId: id,
      previousData: JSON.stringify({ name: existing.name, code: existing.code }),
      newData: null,
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      message: `Program '${existing.name}' berhasil dihapus.`,
    });
  }
);

// ============================================================================
// PHASE 2.2: MASTER DATA ASRAMA & KAMAR API ENDPOINTS
// ============================================================================

// --- 1. GEDUNG (BUILDINGS) ---
apiRouter.get(
  '/buildings',
  authenticate,
  requirePermission('building.view'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = req.user!.tenantId;
    const buildings = db.getBuildings(tenantId);
    return res.json({
      success: true,
      data: buildings,
    });
  }
);

apiRouter.get(
  '/buildings/:id',
  authenticate,
  requirePermission('building.view'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;
    const building = db.getBuildingById(id, tenantId);

    if (!building) {
      return res.status(404).json({
        success: false,
        error: 'Gedung tidak ditemukan.',
      });
    }

    return res.json({
      success: true,
      data: building,
    });
  }
);

apiRouter.post(
  '/buildings',
  authenticate,
  requirePermission('building.create'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = req.user!.tenantId;
    const { name, code, functionType, location, description, status } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Nama gedung wajib diisi.',
      });
    }

    if (!code || !code.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Kode gedung wajib diisi.',
      });
    }

    const trimmedCode = code.trim().toUpperCase();
    const existingCode = db.getBuildingByCode(trimmedCode, tenantId);
    if (existingCode) {
      return res.status(400).json({
        success: false,
        error: `Kode gedung '${trimmedCode}' sudah digunakan di pesantren ini.`,
      });
    }

    const buildings = db.getBuildings(tenantId);
    const existingName = buildings.find(
      (b) => b.name.trim().toLowerCase() === name.trim().toLowerCase()
    );
    if (existingName) {
      return res.status(400).json({
        success: false,
        error: `Nama gedung '${name.trim()}' sudah digunakan di pesantren ini.`,
      });
    }

    const newBuilding = db.createBuilding({
      tenantId,
      name: name.trim(),
      code: trimmedCode,
      functionType: (functionType && functionType.trim()) || 'Asrama',
      location: (location && location.trim()) || 'Kampus Utama',
      description: (description && description.trim()) || '',
      status: status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE',
    });

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'BUILDING_CREATED',
      module: 'Sarana & Gedung',
      entityName: 'Gedung',
      entityId: newBuilding.id,
      previousData: null,
      newData: JSON.stringify({ name: newBuilding.name, code: newBuilding.code, functionType: newBuilding.functionType }),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.status(201).json({
      success: true,
      message: `Gedung '${newBuilding.name}' berhasil ditambahkan.`,
      data: newBuilding,
    });
  }
);

apiRouter.put(
  '/buildings/:id',
  authenticate,
  requirePermission('building.update'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;
    const { name, code, functionType, location, description, status } = req.body;

    const existing = db.getBuildingById(id, tenantId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Gedung tidak ditemukan.',
      });
    }

    if (name && !name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Nama gedung tidak boleh kosong.',
      });
    }

    if (code && !code.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Kode gedung tidak boleh kosong.',
      });
    }

    if (code && code.trim().toUpperCase() !== existing.code.toUpperCase()) {
      const isDuplicateCode = db.getBuildingByCode(code.trim().toUpperCase(), tenantId);
      if (isDuplicateCode && isDuplicateCode.id !== id) {
        return res.status(400).json({
          success: false,
          error: `Kode gedung '${code.trim().toUpperCase()}' sudah digunakan gedung lain.`,
        });
      }
    }

    if (name && name.trim().toLowerCase() !== existing.name.toLowerCase()) {
      const buildings = db.getBuildings(tenantId);
      const isDuplicateName = buildings.some(
        (b) => b.id !== id && b.name.trim().toLowerCase() === name.trim().toLowerCase()
      );
      if (isDuplicateName) {
        return res.status(400).json({
          success: false,
          error: `Nama gedung '${name.trim()}' sudah digunakan gedung lain.`,
        });
      }
    }

    const updated = db.updateBuilding(id, tenantId, {
      name: name ? name.trim() : existing.name,
      code: code ? code.trim().toUpperCase() : existing.code,
      functionType: functionType !== undefined ? functionType.trim() : existing.functionType,
      location: location !== undefined ? location.trim() : existing.location,
      description: description !== undefined ? description.trim() : existing.description,
      status: status ? status : existing.status,
    });

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'BUILDING_UPDATED',
      module: 'Sarana & Gedung',
      entityName: 'Gedung',
      entityId: id,
      previousData: JSON.stringify({ name: existing.name, code: existing.code, status: existing.status }),
      newData: JSON.stringify({ name: updated?.name, code: updated?.code, status: updated?.status }),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      message: 'Data gedung berhasil diperbarui.',
      data: updated,
    });
  }
);

apiRouter.patch(
  '/buildings/:id/toggle-status',
  authenticate,
  requirePermission('building.update'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;

    const existing = db.getBuildingById(id, tenantId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Gedung tidak ditemukan.',
      });
    }

    const updated = db.toggleBuildingStatus(id, tenantId);

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: updated?.status === 'ACTIVE' ? 'BUILDING_ACTIVATED' : 'BUILDING_DEACTIVATED',
      module: 'Sarana & Gedung',
      entityName: 'Status Gedung',
      entityId: id,
      previousData: JSON.stringify({ status: existing.status }),
      newData: JSON.stringify({ status: updated?.status }),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      message: `Status gedung kini '${updated?.status === 'ACTIVE' ? 'Aktif' : 'Nonaktif'}'.`,
      data: updated,
    });
  }
);

apiRouter.delete(
  '/buildings/:id',
  authenticate,
  requirePermission('building.delete'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;

    const existing = db.getBuildingById(id, tenantId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Gedung tidak ditemukan.',
      });
    }

    const result = db.deleteBuilding(id, tenantId);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Gagal menghapus gedung.',
      });
    }

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'BUILDING_DELETED',
      module: 'Sarana & Gedung',
      entityName: 'Gedung',
      entityId: id,
      previousData: JSON.stringify({ name: existing.name, code: existing.code }),
      newData: null,
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      message: `Gedung '${existing.name}' berhasil dihapus.`,
    });
  }
);

// --- 2. ASRAMA (DORMITORIES) ---
apiRouter.get(
  '/dormitories/stats',
  authenticate,
  requirePermission('dormitory.view'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = req.user!.tenantId;
    const stats = db.getDormitoryStats(tenantId);
    return res.json({
      success: true,
      data: stats,
    });
  }
);

apiRouter.get(
  '/dormitories',
  authenticate,
  requirePermission('dormitory.view'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = req.user!.tenantId;
    const dormitories = db.getDormitories(tenantId);
    return res.json({
      success: true,
      data: dormitories,
    });
  }
);

apiRouter.get(
  '/dormitories/:id',
  authenticate,
  requirePermission('dormitory.view'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;
    const dormitory = db.getDormitoryById(id, tenantId);

    if (!dormitory) {
      return res.status(404).json({
        success: false,
        error: 'Asrama tidak ditemukan.',
      });
    }

    return res.json({
      success: true,
      data: dormitory,
    });
  }
);

apiRouter.post(
  '/dormitories',
  authenticate,
  requirePermission('dormitory.create'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = req.user!.tenantId;
    const { buildingId, name, code, genderType, totalCapacity, description, status } = req.body;

    if (!buildingId) {
      return res.status(400).json({
        success: false,
        error: 'Gedung penempatan asrama wajib dipilih.',
      });
    }

    // Verify building belongs to tenant
    const building = db.getBuildingById(buildingId, tenantId);
    if (!building) {
      return res.status(400).json({
        success: false,
        error: 'Gedung yang dipilih tidak valid atau tidak terdaftar pada lembaga ini.',
      });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Nama asrama wajib diisi.',
      });
    }

    if (!code || !code.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Kode asrama wajib diisi.',
      });
    }

    const trimmedCode = code.trim().toUpperCase();
    const existingCode = db.getDormitoryByCode(trimmedCode, tenantId);
    if (existingCode) {
      return res.status(400).json({
        success: false,
        error: `Kode asrama '${trimmedCode}' sudah digunakan di lembaga ini.`,
      });
    }

    const dormitories = db.getDormitories(tenantId);
    const existingName = dormitories.find(
      (d) => d.name.trim().toLowerCase() === name.trim().toLowerCase()
    );
    if (existingName) {
      return res.status(400).json({
        success: false,
        error: `Nama asrama '${name.trim()}' sudah digunakan di lembaga ini.`,
      });
    }

    const cap = parseInt(totalCapacity, 10);
    if (isNaN(cap) || cap < 0) {
      return res.status(400).json({
        success: false,
        error: 'Kapasitas total asrama tidak boleh bernilai negatif.',
      });
    }

    const validGender = ['PUTRA', 'PUTRI', 'CAMPURAN', 'LAINNYA'].includes(genderType)
      ? genderType
      : 'PUTRA';

    const newDorm = db.createDormitory({
      tenantId,
      buildingId,
      name: name.trim(),
      code: trimmedCode,
      genderType: validGender,
      totalCapacity: cap,
      description: (description && description.trim()) || '',
      status: status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE',
    });

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'DORMITORY_CREATED',
      module: 'Sarana & Asrama',
      entityName: 'Asrama',
      entityId: newDorm.id,
      previousData: null,
      newData: JSON.stringify({ name: newDorm.name, code: newDorm.code, genderType: newDorm.genderType, buildingId }),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.status(201).json({
      success: true,
      message: `Asrama '${newDorm.name}' berhasil ditambahkan.`,
      data: newDorm,
    });
  }
);

apiRouter.put(
  '/dormitories/:id',
  authenticate,
  requirePermission('dormitory.update'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;
    const { buildingId, name, code, genderType, totalCapacity, description, status } = req.body;

    const existing = db.getDormitoryById(id, tenantId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Asrama tidak ditemukan.',
      });
    }

    if (buildingId) {
      const bld = db.getBuildingById(buildingId, tenantId);
      if (!bld) {
        return res.status(400).json({
          success: false,
          error: 'Gedung penempatan tidak valid untuk lembaga ini.',
        });
      }
    }

    if (name && !name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Nama asrama tidak boleh kosong.',
      });
    }

    if (code && !code.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Kode asrama tidak boleh kosong.',
      });
    }

    if (code && code.trim().toUpperCase() !== existing.code.toUpperCase()) {
      const isDuplicateCode = db.getDormitoryByCode(code.trim().toUpperCase(), tenantId);
      if (isDuplicateCode && isDuplicateCode.id !== id) {
        return res.status(400).json({
          success: false,
          error: `Kode asrama '${code.trim().toUpperCase()}' sudah digunakan asrama lain.`,
        });
      }
    }

    if (name && name.trim().toLowerCase() !== existing.name.toLowerCase()) {
      const dormitories = db.getDormitories(tenantId);
      const isDuplicateName = dormitories.some(
        (d) => d.id !== id && d.name.trim().toLowerCase() === name.trim().toLowerCase()
      );
      if (isDuplicateName) {
        return res.status(400).json({
          success: false,
          error: `Nama asrama '${name.trim()}' sudah digunakan asrama lain.`,
        });
      }
    }

    let parsedCap = existing.totalCapacity;
    if (totalCapacity !== undefined) {
      parsedCap = parseInt(totalCapacity, 10);
      if (isNaN(parsedCap) || parsedCap < 0) {
        return res.status(400).json({
          success: false,
          error: 'Kapasitas total asrama tidak boleh negatif.',
        });
      }
    }

    const updated = db.updateDormitory(id, tenantId, {
      buildingId: buildingId || existing.buildingId,
      name: name ? name.trim() : existing.name,
      code: code ? code.trim().toUpperCase() : existing.code,
      genderType: genderType || existing.genderType,
      totalCapacity: parsedCap,
      description: description !== undefined ? description.trim() : existing.description,
      status: status || existing.status,
    });

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'DORMITORY_UPDATED',
      module: 'Sarana & Asrama',
      entityName: 'Asrama',
      entityId: id,
      previousData: JSON.stringify({ name: existing.name, code: existing.code, totalCapacity: existing.totalCapacity }),
      newData: JSON.stringify({ name: updated?.name, code: updated?.code, totalCapacity: updated?.totalCapacity }),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      message: 'Data asrama berhasil diperbarui.',
      data: updated,
    });
  }
);

apiRouter.patch(
  '/dormitories/:id/toggle-status',
  authenticate,
  requirePermission('dormitory.update'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;

    const existing = db.getDormitoryById(id, tenantId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Asrama tidak ditemukan.',
      });
    }

    const updated = db.toggleDormitoryStatus(id, tenantId);

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: updated?.status === 'ACTIVE' ? 'DORMITORY_ACTIVATED' : 'DORMITORY_DEACTIVATED',
      module: 'Sarana & Asrama',
      entityName: 'Status Asrama',
      entityId: id,
      previousData: JSON.stringify({ status: existing.status }),
      newData: JSON.stringify({ status: updated?.status }),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      message: `Status asrama kini '${updated?.status === 'ACTIVE' ? 'Aktif' : 'Nonaktif'}'.`,
      data: updated,
    });
  }
);

apiRouter.delete(
  '/dormitories/:id',
  authenticate,
  requirePermission('dormitory.delete'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;

    const existing = db.getDormitoryById(id, tenantId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Asrama tidak ditemukan.',
      });
    }

    const result = db.deleteDormitory(id, tenantId);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Gagal menghapus asrama.',
      });
    }

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'DORMITORY_DELETED',
      module: 'Sarana & Asrama',
      entityName: 'Asrama',
      entityId: id,
      previousData: JSON.stringify({ name: existing.name, code: existing.code }),
      newData: null,
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      message: `Asrama '${existing.name}' berhasil dihapus.`,
    });
  }
);

// --- 3. MUSYRIF / PENANGGUNG JAWAB ASRAMA ---
apiRouter.get(
  '/dormitories/:id/supervisors',
  authenticate,
  requirePermission('dormitory_supervisor.view'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;

    const dorm = db.getDormitoryById(id, tenantId);
    if (!dorm) {
      return res.status(404).json({
        success: false,
        error: 'Asrama tidak ditemukan.',
      });
    }

    const supervisors = db.getDormitorySupervisors(id, tenantId);
    return res.json({
      success: true,
      data: supervisors,
    });
  }
);

apiRouter.post(
  '/dormitories/:id/supervisors',
  authenticate,
  requirePermission('dormitory_supervisor.create'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;
    const { userId, roleType, isPrimary } = req.body;

    const dorm = db.getDormitoryById(id, tenantId);
    if (!dorm) {
      return res.status(404).json({
        success: false,
        error: 'Asrama tidak ditemukan.',
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'Pengguna / staf penanggung jawab wajib dipilih.',
      });
    }

    const result = db.addDormitorySupervisor({
      tenantId,
      dormitoryId: id,
      userId,
      roleType: roleType === 'PENANGGUNG_JAWAB' ? 'PENANGGUNG_JAWAB' : 'MUSYRIF',
      isPrimary: Boolean(isPrimary),
    });

    if (!result.success || !result.data) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Gagal menetapkan musyrif asrama.',
      });
    }

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'SUPERVISOR_ASSIGNED',
      module: 'Sarana & Asrama',
      entityName: 'Penugasan Musyrif',
      entityId: result.data.id,
      previousData: null,
      newData: JSON.stringify({ dormitoryId: id, assignedUserId: userId, isPrimary }),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.status(201).json({
      success: true,
      message: `Musyrif '${result.data.userName}' berhasil ditugaskan di asrama ini.`,
      data: result.data,
    });
  }
);

apiRouter.delete(
  '/dormitories/:id/supervisors/:supervisorId',
  authenticate,
  requirePermission('dormitory_supervisor.delete'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id, supervisorId } = req.params;
    const tenantId = req.user!.tenantId;

    const dorm = db.getDormitoryById(id, tenantId);
    if (!dorm) {
      return res.status(404).json({
        success: false,
        error: 'Asrama tidak ditemukan.',
      });
    }

    const removed = db.removeDormitorySupervisor(supervisorId, tenantId);
    if (!removed) {
      return res.status(404).json({
        success: false,
        error: 'Data penugasan musyrif tidak ditemukan.',
      });
    }

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'SUPERVISOR_REMOVED',
      module: 'Sarana & Asrama',
      entityName: 'Penugasan Musyrif',
      entityId: supervisorId,
      previousData: JSON.stringify({ dormitoryId: id }),
      newData: null,
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      message: 'Penugasan musyrif asrama berhasil dicopot.',
    });
  }
);

apiRouter.patch(
  '/dormitories/:id/supervisors/:supervisorId/primary',
  authenticate,
  requirePermission('dormitory_supervisor.update'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id, supervisorId } = req.params;
    const tenantId = req.user!.tenantId;

    const dorm = db.getDormitoryById(id, tenantId);
    if (!dorm) {
      return res.status(404).json({
        success: false,
        error: 'Asrama tidak ditemukan.',
      });
    }

    const updated = db.setPrimarySupervisor(supervisorId, id, tenantId);
    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Data penugasan musyrif tidak ditemukan.',
      });
    }

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'SUPERVISOR_SET_PRIMARY',
      module: 'Sarana & Asrama',
      entityName: 'Musyrif Utama',
      entityId: supervisorId,
      previousData: null,
      newData: JSON.stringify({ dormitoryId: id, primarySupervisor: updated.userName }),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      message: `${updated.userName} kini menjadi Musyrif Utama untuk asrama ini.`,
      data: updated,
    });
  }
);

// --- 4. KAMAR (ROOMS) ---
apiRouter.get(
  '/rooms',
  authenticate,
  requirePermission('room.view'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = req.user!.tenantId;
    const { buildingId, dormitoryId, status, genderType, search } = req.query;

    const rooms = db.getRooms(tenantId, {
      buildingId: buildingId as string,
      dormitoryId: dormitoryId as string,
      status: status as any,
      genderType: genderType as any,
      search: search as string,
    });

    return res.json({
      success: true,
      data: rooms,
    });
  }
);

apiRouter.get(
  '/rooms/:id',
  authenticate,
  requirePermission('room.view'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;

    const room = db.getRoomById(id, tenantId);
    if (!room) {
      return res.status(404).json({
        success: false,
        error: 'Kamar tidak ditemukan.',
      });
    }

    return res.json({
      success: true,
      data: room,
    });
  }
);

apiRouter.post(
  '/rooms',
  authenticate,
  requirePermission('room.create'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = req.user!.tenantId;
    const { dormitoryId, name, code, floor, capacity, genderType, status, description } = req.body;

    if (!dormitoryId) {
      return res.status(400).json({
        success: false,
        error: 'Asrama penempatan kamar wajib dipilih.',
      });
    }

    const dorm = db.getDormitoryById(dormitoryId, tenantId);
    if (!dorm) {
      return res.status(400).json({
        success: false,
        error: 'Asrama yang dipilih tidak valid atau tidak terdaftar pada lembaga ini.',
      });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Nomor atau nama kamar wajib diisi.',
      });
    }

    if (!code || !code.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Kode kamar wajib diisi.',
      });
    }

    const trimmedCode = code.trim().toUpperCase();
    const existingCode = db.getRoomByCode(trimmedCode, tenantId);
    if (existingCode) {
      return res.status(400).json({
        success: false,
        error: `Kode kamar '${trimmedCode}' sudah digunakan di lembaga ini.`,
      });
    }

    const parsedFloor = parseInt(floor, 10);
    if (isNaN(parsedFloor) || parsedFloor < 1) {
      return res.status(400).json({
        success: false,
        error: 'Lantai harus berupa angka minimal 1.',
      });
    }

    const parsedCap = parseInt(capacity, 10);
    if (isNaN(parsedCap) || parsedCap < 1 || parsedCap > 100) {
      return res.status(400).json({
        success: false,
        error: 'Kapasitas kamar minimal 1 dan maksimal 100 santri.',
      });
    }

    const validStatus = ['ACTIVE', 'INACTIVE', 'MAINTENANCE'].includes(status) ? status : 'ACTIVE';
    const validGender = ['PUTRA', 'PUTRI', 'KHUSUS', 'LAINNYA'].includes(genderType)
      ? genderType
      : (dorm.genderType === 'PUTRI' ? 'PUTRI' : 'PUTRA');

    const newRoom = db.createRoom({
      tenantId,
      buildingId: dorm.buildingId,
      dormitoryId: dorm.id,
      name: name.trim(),
      code: trimmedCode,
      floor: parsedFloor,
      capacity: parsedCap,
      genderType: validGender,
      status: validStatus,
      description: (description && description.trim()) || '',
    });

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'ROOM_CREATED',
      module: 'Sarana & Asrama',
      entityName: 'Kamar Asrama',
      entityId: newRoom.id,
      previousData: null,
      newData: JSON.stringify({ name: newRoom.name, code: newRoom.code, capacity: newRoom.capacity, floor: newRoom.floor }),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.status(201).json({
      success: true,
      message: `Kamar '${newRoom.name}' berhasil ditambahkan.`,
      data: newRoom,
    });
  }
);

apiRouter.put(
  '/rooms/:id',
  authenticate,
  requirePermission('room.update'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;
    const { dormitoryId, name, code, floor, capacity, genderType, status, description } = req.body;

    const existing = db.getRoomById(id, tenantId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Kamar tidak ditemukan.',
      });
    }

    let targetBuildingId = existing.buildingId;
    let targetDormitoryId = existing.dormitoryId;

    if (dormitoryId && dormitoryId !== existing.dormitoryId) {
      const targetDorm = db.getDormitoryById(dormitoryId, tenantId);
      if (!targetDorm) {
        return res.status(400).json({
          success: false,
          error: 'Asrama tujuan tidak valid untuk lembaga ini.',
        });
      }
      targetDormitoryId = targetDorm.id;
      targetBuildingId = targetDorm.buildingId;
    }

    if (name && !name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Nama kamar tidak boleh kosong.',
      });
    }

    if (code && !code.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Kode kamar tidak boleh kosong.',
      });
    }

    if (code && code.trim().toUpperCase() !== existing.code.toUpperCase()) {
      const isDuplicate = db.getRoomByCode(code.trim().toUpperCase(), tenantId);
      if (isDuplicate && isDuplicate.id !== id) {
        return res.status(400).json({
          success: false,
          error: `Kode kamar '${code.trim().toUpperCase()}' sudah digunakan kamar lain.`,
        });
      }
    }

    let parsedFloor = existing.floor;
    if (floor !== undefined) {
      parsedFloor = parseInt(floor, 10);
      if (isNaN(parsedFloor) || parsedFloor < 1) {
        return res.status(400).json({
          success: false,
          error: 'Lantai harus angka minimal 1.',
        });
      }
    }

    let parsedCap = existing.capacity;
    if (capacity !== undefined) {
      parsedCap = parseInt(capacity, 10);
      if (isNaN(parsedCap) || parsedCap < 1 || parsedCap > 100) {
        return res.status(400).json({
          success: false,
          error: 'Kapasitas kamar minimal 1 dan maksimal 100 santri.',
        });
      }
    }

    const updated = db.updateRoom(id, tenantId, {
      dormitoryId: targetDormitoryId,
      buildingId: targetBuildingId,
      name: name ? name.trim() : existing.name,
      code: code ? code.trim().toUpperCase() : existing.code,
      floor: parsedFloor,
      capacity: parsedCap,
      genderType: genderType || existing.genderType,
      status: status || existing.status,
      description: description !== undefined ? description.trim() : existing.description,
    });

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'ROOM_UPDATED',
      module: 'Sarana & Asrama',
      entityName: 'Kamar Asrama',
      entityId: id,
      previousData: JSON.stringify({ name: existing.name, code: existing.code, status: existing.status }),
      newData: JSON.stringify({ name: updated?.name, code: updated?.code, status: updated?.status }),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      message: 'Data kamar berhasil diperbarui.',
      data: updated,
    });
  }
);

apiRouter.patch(
  '/rooms/:id/status',
  authenticate,
  requirePermission('room.update'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;
    const { status, description } = req.body;

    const existing = db.getRoomById(id, tenantId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Kamar tidak ditemukan.',
      });
    }

    if (!['ACTIVE', 'INACTIVE', 'MAINTENANCE'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Status kamar hanya boleh 'ACTIVE', 'INACTIVE', atau 'MAINTENANCE'.",
      });
    }

    const updated = db.updateRoomStatus(id, tenantId, status, description);

    let auditAction = 'ROOM_STATUS_CHANGED';
    if (status === 'MAINTENANCE') auditAction = 'ROOM_MAINTENANCE_STARTED';
    else if (status === 'ACTIVE') auditAction = 'ROOM_ACTIVATED';
    else if (status === 'INACTIVE') auditAction = 'ROOM_DEACTIVATED';

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: auditAction,
      module: 'Sarana & Asrama',
      entityName: 'Status Kamar',
      entityId: id,
      previousData: JSON.stringify({ status: existing.status, description: existing.description }),
      newData: JSON.stringify({ status: updated?.status, description: updated?.description }),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    const statusLabels: Record<string, string> = {
      ACTIVE: 'Aktif',
      INACTIVE: 'Nonaktif',
      MAINTENANCE: 'Dalam Perbaikan (Maintenance)',
    };

    return res.json({
      success: true,
      message: `Status kamar '${existing.name}' kini diubah menjadi '${statusLabels[status]}'.`,
      data: updated,
    });
  }
);

apiRouter.delete(
  '/rooms/:id',
  authenticate,
  requirePermission('room.delete'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;

    const existing = db.getRoomById(id, tenantId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Kamar tidak ditemukan.',
      });
    }

    const result = db.deleteRoom(id, tenantId);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Gagal menghapus kamar.',
      });
    }

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'ROOM_DELETED',
      module: 'Sarana & Asrama',
      entityName: 'Kamar Asrama',
      entityId: id,
      previousData: JSON.stringify({ name: existing.name, code: existing.code }),
      newData: null,
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      message: `Kamar '${existing.name}' berhasil dihapus.`,
    });
  }
);

// ==========================================
// 8. MASTER DATA SDM: STATISTIK RINGKASAN
// ==========================================
apiRouter.get(
  '/staff/stats',
  authenticate,
  requireAnyPermission('employee.view', 'teacher.view', 'musyrif.view'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = req.user!.tenantId;
    const stats = db.getStaffStats(tenantId);
    return res.json({
      success: true,
      data: stats,
    });
  }
);

// ==========================================
// 9. MASTER DATA PEGAWAI / PERSONEL (EMPLOYEES)
// ==========================================
apiRouter.get(
  '/employees',
  authenticate,
  requirePermission('employee.view'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = req.user!.tenantId;
    const { search, status, type } = req.query as {
      search?: string;
      status?: string;
      type?: string;
    };

    const employees = db.getEmployees(tenantId, { search, status, type });
    return res.json({
      success: true,
      count: employees.length,
      data: employees,
    });
  }
);

apiRouter.get(
  '/employees/:id',
  authenticate,
  requirePermission('employee.view'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;

    const employee = db.getEmployeeById(id, tenantId);
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Data pegawai tidak ditemukan.',
      });
    }

    return res.json({
      success: true,
      data: employee,
    });
  }
);

apiRouter.post(
  '/employees',
  authenticate,
  requirePermission('employee.create'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = req.user!.tenantId;
    const {
      employeeNumber,
      fullName,
      nickname,
      gender,
      birthPlace,
      birthDate,
      phone,
      email,
      address,
      joinDate,
      employmentStatus,
      position,
      type,
      notes,
      userId,
      status,
    } = req.body;

    if (!employeeNumber || !employeeNumber.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Nomor induk pegawai (NIP/KODE) wajib diisi.',
      });
    }

    if (!fullName || !fullName.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Nama lengkap pegawai wajib diisi.',
      });
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Nomor telepon/WhatsApp wajib diisi.',
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Alamat email pegawai wajib diisi.',
      });
    }

    // Check duplicate employeeNumber per tenant
    const trimmedNumber = employeeNumber.trim().toUpperCase();
    const duplicate = db.getEmployeeByNumber(trimmedNumber, tenantId);
    if (duplicate) {
      return res.status(409).json({
        success: false,
        error: `Nomor pegawai '${trimmedNumber}' sudah digunakan oleh '${duplicate.fullName}' di lembaga ini.`,
      });
    }

    // If userId provided, validate user in tenant
    let linkedUserId: string | null = null;
    if (userId && String(userId).trim()) {
      const user = db.getUserById(String(userId).trim());
      if (!user || user.tenantId !== tenantId) {
        return res.status(400).json({
          success: false,
          error: 'Akun user yang dipilih tidak valid atau bukan milik lembaga ini.',
        });
      }

      const existingLinked = db.getEmployeeByUserId(user.id, tenantId);
      if (existingLinked) {
        return res.status(409).json({
          success: false,
          error: `Akun user '${user.username}' sudah terhubung ke pegawai lain (${existingLinked.fullName}).`,
        });
      }
      linkedUserId = user.id;
    }

    const newEmployee = db.createEmployee({
      tenantId,
      userId: linkedUserId,
      employeeNumber: trimmedNumber,
      fullName: fullName.trim(),
      nickname: nickname ? nickname.trim() : null,
      gender: gender === 'PEREMPUAN' ? 'PEREMPUAN' : 'LAKI_LAKI',
      birthPlace: birthPlace ? birthPlace.trim() : null,
      birthDate: birthDate || null,
      phone: phone.trim(),
      email: email.trim(),
      address: address ? address.trim() : null,
      joinDate: joinDate || new Date().toISOString().split('T')[0],
      employmentStatus: employmentStatus || 'TETAP',
      position: position ? position.trim() : 'Staf Pegawai',
      type: type || 'GURU',
      notes: notes ? notes.trim() : null,
      status: status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE',
    });

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'EMPLOYEE_CREATED',
      module: 'Master SDM',
      entityName: 'Pegawai',
      entityId: newEmployee.id,
      previousData: null,
      newData: JSON.stringify({
        employeeNumber: newEmployee.employeeNumber,
        fullName: newEmployee.fullName,
        type: newEmployee.type,
      }),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.status(201).json({
      success: true,
      message: `Pegawai '${newEmployee.fullName}' berhasil ditambahkan.`,
      data: newEmployee,
    });
  }
);

apiRouter.put(
  '/employees/:id',
  authenticate,
  requirePermission('employee.update'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;
    const {
      employeeNumber,
      fullName,
      nickname,
      gender,
      birthPlace,
      birthDate,
      phone,
      email,
      address,
      joinDate,
      employmentStatus,
      position,
      type,
      notes,
      userId,
      status,
    } = req.body;

    const existing = db.getEmployeeById(id, tenantId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Data pegawai tidak ditemukan.',
      });
    }

    if (employeeNumber && employeeNumber.trim()) {
      const trimmedNumber = employeeNumber.trim().toUpperCase();
      if (trimmedNumber !== existing.employeeNumber) {
        const duplicate = db.getEmployeeByNumber(trimmedNumber, tenantId);
        if (duplicate && duplicate.id !== id) {
          return res.status(409).json({
            success: false,
            error: `Nomor pegawai '${trimmedNumber}' sudah digunakan oleh '${duplicate.fullName}'.`,
          });
        }
      }
    }

    // Check linked user if specified
    let updatedUserId = existing.userId;
    if (userId !== undefined) {
      if (userId && String(userId).trim()) {
        const targetUserId = String(userId).trim();
        const user = db.getUserById(targetUserId);
        if (!user || user.tenantId !== tenantId) {
          return res.status(400).json({
            success: false,
            error: 'Akun user tidak valid atau bukan milik lembaga ini.',
          });
        }
        const existingLinked = db.getEmployeeByUserId(user.id, tenantId);
        if (existingLinked && existingLinked.id !== id) {
          return res.status(409).json({
            success: false,
            error: `Akun user '${user.username}' sudah terhubung ke pegawai lain (${existingLinked.fullName}).`,
          });
        }
        updatedUserId = user.id;
      } else {
        updatedUserId = null;
      }
    }

    const updated = db.updateEmployee(id, tenantId, {
      ...(employeeNumber ? { employeeNumber: employeeNumber.trim().toUpperCase() } : {}),
      ...(fullName ? { fullName: fullName.trim() } : {}),
      ...(nickname !== undefined ? { nickname: nickname ? nickname.trim() : null } : {}),
      ...(gender ? { gender } : {}),
      ...(birthPlace !== undefined ? { birthPlace: birthPlace ? birthPlace.trim() : null } : {}),
      ...(birthDate !== undefined ? { birthDate } : {}),
      ...(phone ? { phone: phone.trim() } : {}),
      ...(email ? { email: email.trim() } : {}),
      ...(address !== undefined ? { address: address ? address.trim() : null } : {}),
      ...(joinDate ? { joinDate } : {}),
      ...(employmentStatus ? { employmentStatus } : {}),
      ...(position ? { position: position.trim() } : {}),
      ...(type ? { type } : {}),
      ...(notes !== undefined ? { notes: notes ? notes.trim() : null } : {}),
      ...(userId !== undefined ? { userId: updatedUserId } : {}),
      ...(status ? { status } : {}),
    });

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'EMPLOYEE_UPDATED',
      module: 'Master SDM',
      entityName: 'Pegawai',
      entityId: id,
      previousData: JSON.stringify({
        fullName: existing.fullName,
        employeeNumber: existing.employeeNumber,
        position: existing.position,
      }),
      newData: JSON.stringify({
        fullName: updated?.fullName,
        employeeNumber: updated?.employeeNumber,
        position: updated?.position,
      }),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      message: `Data pegawai '${updated?.fullName}' berhasil diperbarui.`,
      data: updated,
    });
  }
);

apiRouter.patch(
  '/employees/:id/toggle-status',
  authenticate,
  requirePermission('employee.update'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;

    const existing = db.getEmployeeById(id, tenantId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Data pegawai tidak ditemukan.',
      });
    }

    const updated = db.toggleEmployeeStatus(id, tenantId);

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: updated?.status === 'ACTIVE' ? 'EMPLOYEE_ACTIVATED' : 'EMPLOYEE_DEACTIVATED',
      module: 'Master SDM',
      entityName: 'Pegawai',
      entityId: id,
      previousData: JSON.stringify({ status: existing.status }),
      newData: JSON.stringify({ status: updated?.status }),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      message: `Status pegawai '${updated?.fullName}' kini ${updated?.status}.`,
      data: updated,
    });
  }
);

apiRouter.delete(
  '/employees/:id',
  authenticate,
  requirePermission('employee.delete'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;

    const existing = db.getEmployeeById(id, tenantId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Data pegawai tidak ditemukan.',
      });
    }

    const result = db.deleteEmployee(id, tenantId);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Gagal menghapus data pegawai.',
      });
    }

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'EMPLOYEE_DELETED',
      module: 'Master SDM',
      entityName: 'Pegawai',
      entityId: id,
      previousData: JSON.stringify({
        fullName: existing.fullName,
        employeeNumber: existing.employeeNumber,
      }),
      newData: null,
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      message: `Pegawai '${existing.fullName}' berhasil dihapus.`,
    });
  }
);

// Link User Account to Employee
apiRouter.post(
  '/employees/:id/link-user',
  authenticate,
  requirePermission('employee.update'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'ID Akun User wajib disertakan.',
      });
    }

    const result = db.linkUserToEmployee(id, userId, tenantId);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Gagal menghubungkan akun user ke pegawai.',
      });
    }

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'USER_ACCOUNT_LINKED',
      module: 'Master SDM',
      entityName: 'Pegawai',
      entityId: id,
      previousData: null,
      newData: JSON.stringify({ userId, employeeId: id }),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      message: 'Akun user berhasil dihubungkan ke data pegawai.',
      data: result.employee,
    });
  }
);

// Unlink User Account from Employee
apiRouter.post(
  '/employees/:id/unlink-user',
  authenticate,
  requirePermission('employee.update'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;

    const existing = db.getEmployeeById(id, tenantId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Data pegawai tidak ditemukan.',
      });
    }

    const previousUserId = existing.userId;
    const result = db.unlinkUserFromEmployee(id, tenantId);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Gagal memutus akun user dari pegawai.',
      });
    }

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'USER_ACCOUNT_UNLINKED',
      module: 'Master SDM',
      entityName: 'Pegawai',
      entityId: id,
      previousData: JSON.stringify({ previousUserId }),
      newData: null,
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      message: 'Hubungan akun user berhasil diputus dari pegawai.',
      data: result.employee,
    });
  }
);

// ==========================================
// 10. MASTER DATA GURU / PENGAJAR (TEACHERS)
// ==========================================
apiRouter.get(
  '/teachers',
  authenticate,
  requirePermission('teacher.view'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = req.user!.tenantId;
    const { search, status } = req.query as {
      search?: string;
      status?: string;
    };

    const teachers = db.getTeachers(tenantId, { search, status });
    return res.json({
      success: true,
      count: teachers.length,
      data: teachers,
    });
  }
);

apiRouter.get(
  '/teachers/:id',
  authenticate,
  requirePermission('teacher.view'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;

    const teacher = db.getTeacherById(id, tenantId);
    if (!teacher) {
      return res.status(404).json({
        success: false,
        error: 'Data guru tidak ditemukan.',
      });
    }

    return res.json({
      success: true,
      data: teacher,
    });
  }
);

apiRouter.post(
  '/teachers',
  authenticate,
  requirePermission('teacher.create'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = req.user!.tenantId;
    const {
      employeeId,
      teacherCode,
      specialization,
      educationLevel,
      qualification,
      teachingStatus,
      notes,
    } = req.body;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        error: 'Pilih data pegawai yang akan didaftarkan sebagai Guru.',
      });
    }

    if (!teacherCode || !teacherCode.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Kode guru / pengajar wajib diisi.',
      });
    }

    if (!specialization || !specialization.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Spesialisasi bidang studi / keilmuan wajib diisi.',
      });
    }

    // Verify employee belongs to tenant
    const employee = db.getEmployeeById(employeeId, tenantId);
    if (!employee) {
      return res.status(400).json({
        success: false,
        error: 'Pegawai yang dipilih tidak ditemukan di lembaga ini.',
      });
    }

    // Verify employee not already registered as teacher
    const existingProfile = db.getTeacherByEmployeeId(employeeId, tenantId);
    if (existingProfile) {
      return res.status(409).json({
        success: false,
        error: `Pegawai '${employee.fullName}' sudah terdaftar sebagai Guru dengan kode '${existingProfile.teacherCode}'.`,
      });
    }

    // Check duplicate teacherCode
    const trimmedCode = teacherCode.trim().toUpperCase();
    const duplicateCode = db.getTeacherByCode(trimmedCode, tenantId);
    if (duplicateCode) {
      return res.status(409).json({
        success: false,
        error: `Kode guru '${trimmedCode}' sudah digunakan di lembaga ini.`,
      });
    }

    const newTeacher = db.createTeacher({
      tenantId,
      employeeId,
      teacherCode: trimmedCode,
      specialization: specialization.trim(),
      educationLevel: educationLevel || 'S1',
      qualification: qualification ? qualification.trim() : 'Sarjana',
      teachingStatus: teachingStatus === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE',
      notes: notes ? notes.trim() : null,
    });

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'TEACHER_CREATED',
      module: 'Master SDM',
      entityName: 'Guru / Pengajar',
      entityId: newTeacher.id,
      previousData: null,
      newData: JSON.stringify({
        teacherCode: newTeacher.teacherCode,
        fullName: newTeacher.fullName,
        specialization: newTeacher.specialization,
      }),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.status(201).json({
      success: true,
      message: `Guru '${newTeacher.fullName}' (${newTeacher.teacherCode}) berhasil didaftarkan.`,
      data: newTeacher,
    });
  }
);

apiRouter.put(
  '/teachers/:id',
  authenticate,
  requirePermission('teacher.update'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;
    const { teacherCode, specialization, educationLevel, qualification, teachingStatus, notes } =
      req.body;

    const existing = db.getTeacherById(id, tenantId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Data guru tidak ditemukan.',
      });
    }

    if (teacherCode && teacherCode.trim()) {
      const trimmedCode = teacherCode.trim().toUpperCase();
      if (trimmedCode !== existing.teacherCode) {
        const duplicate = db.getTeacherByCode(trimmedCode, tenantId);
        if (duplicate && duplicate.id !== id) {
          return res.status(409).json({
            success: false,
            error: `Kode guru '${trimmedCode}' sudah digunakan di lembaga ini.`,
          });
        }
      }
    }

    const updated = db.updateTeacher(id, tenantId, {
      ...(teacherCode ? { teacherCode: teacherCode.trim().toUpperCase() } : {}),
      ...(specialization ? { specialization: specialization.trim() } : {}),
      ...(educationLevel ? { educationLevel } : {}),
      ...(qualification ? { qualification: qualification.trim() } : {}),
      ...(teachingStatus ? { teachingStatus } : {}),
      ...(notes !== undefined ? { notes: notes ? notes.trim() : null } : {}),
    });

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'TEACHER_UPDATED',
      module: 'Master SDM',
      entityName: 'Guru / Pengajar',
      entityId: id,
      previousData: JSON.stringify({
        teacherCode: existing.teacherCode,
        specialization: existing.specialization,
      }),
      newData: JSON.stringify({
        teacherCode: updated?.teacherCode,
        specialization: updated?.specialization,
      }),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      message: `Data guru '${updated?.fullName}' berhasil diperbarui.`,
      data: updated,
    });
  }
);

apiRouter.patch(
  '/teachers/:id/toggle-status',
  authenticate,
  requirePermission('teacher.update'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;

    const existing = db.getTeacherById(id, tenantId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Data guru tidak ditemukan.',
      });
    }

    const updated = db.toggleTeacherStatus(id, tenantId);

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: updated?.teachingStatus === 'ACTIVE' ? 'TEACHER_ACTIVATED' : 'TEACHER_DEACTIVATED',
      module: 'Master SDM',
      entityName: 'Guru / Pengajar',
      entityId: id,
      previousData: JSON.stringify({ teachingStatus: existing.teachingStatus }),
      newData: JSON.stringify({ teachingStatus: updated?.teachingStatus }),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      message: `Status mengajar guru '${updated?.fullName}' kini ${updated?.teachingStatus}.`,
      data: updated,
    });
  }
);

apiRouter.delete(
  '/teachers/:id',
  authenticate,
  requirePermission('teacher.delete'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;

    const existing = db.getTeacherById(id, tenantId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Data guru tidak ditemukan.',
      });
    }

    const result = db.deleteTeacher(id, tenantId);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Gagal menghapus data guru.',
      });
    }

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'TEACHER_DELETED',
      module: 'Master SDM',
      entityName: 'Guru / Pengajar',
      entityId: id,
      previousData: JSON.stringify({
        teacherCode: existing.teacherCode,
        fullName: existing.fullName,
      }),
      newData: null,
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      message: `Data guru '${existing.fullName}' berhasil dihapus.`,
    });
  }
);

// ==========================================
// 11. MASTER DATA MUSYRIF / PENGASUH ASRAMA
// ==========================================
apiRouter.get(
  '/musyrifs',
  authenticate,
  requirePermission('musyrif.view'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = req.user!.tenantId;
    const { search, status } = req.query as {
      search?: string;
      status?: string;
    };

    const musyrifs = db.getMusyrifs(tenantId, { search, status });
    return res.json({
      success: true,
      count: musyrifs.length,
      data: musyrifs,
    });
  }
);

apiRouter.get(
  '/musyrifs/:id',
  authenticate,
  requirePermission('musyrif.view'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;

    const musyrif = db.getMusyrifById(id, tenantId);
    if (!musyrif) {
      return res.status(404).json({
        success: false,
        error: 'Data musyrif tidak ditemukan.',
      });
    }

    return res.json({
      success: true,
      data: musyrif,
    });
  }
);

apiRouter.post(
  '/musyrifs',
  authenticate,
  requirePermission('musyrif.create'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = req.user!.tenantId;
    const { employeeId, musyrifCode, specialization, notes, status } = req.body;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        error: 'Pilih data pegawai yang akan didaftarkan sebagai Musyrif.',
      });
    }

    if (!musyrifCode || !musyrifCode.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Kode musyrif wajib diisi.',
      });
    }

    if (!specialization || !specialization.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Spesialisasi pengasuhan / pembinaan wajib diisi.',
      });
    }

    // Verify employee belongs to tenant
    const employee = db.getEmployeeById(employeeId, tenantId);
    if (!employee) {
      return res.status(400).json({
        success: false,
        error: 'Pegawai yang dipilih tidak ditemukan di lembaga ini.',
      });
    }

    // Verify employee not already registered as musyrif
    const existingProfile = db.getMusyrifByEmployeeId(employeeId, tenantId);
    if (existingProfile) {
      return res.status(409).json({
        success: false,
        error: `Pegawai '${employee.fullName}' sudah terdaftar sebagai Musyrif dengan kode '${existingProfile.musyrifCode}'.`,
      });
    }

    // Check duplicate musyrifCode
    const trimmedCode = musyrifCode.trim().toUpperCase();
    const duplicateCode = db.getMusyrifByCode(trimmedCode, tenantId);
    if (duplicateCode) {
      return res.status(409).json({
        success: false,
        error: `Kode musyrif '${trimmedCode}' sudah digunakan di lembaga ini.`,
      });
    }

    const newMusyrif = db.createMusyrif({
      tenantId,
      employeeId,
      musyrifCode: trimmedCode,
      specialization: specialization.trim(),
      notes: notes ? notes.trim() : null,
      status: status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE',
    });

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'MUSYRIF_CREATED',
      module: 'Master SDM',
      entityName: 'Musyrif Asrama',
      entityId: newMusyrif.id,
      previousData: null,
      newData: JSON.stringify({
        musyrifCode: newMusyrif.musyrifCode,
        fullName: newMusyrif.fullName,
        specialization: newMusyrif.specialization,
      }),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.status(201).json({
      success: true,
      message: `Musyrif '${newMusyrif.fullName}' (${newMusyrif.musyrifCode}) berhasil didaftarkan.`,
      data: newMusyrif,
    });
  }
);

apiRouter.put(
  '/musyrifs/:id',
  authenticate,
  requirePermission('musyrif.update'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;
    const { musyrifCode, specialization, notes, status } = req.body;

    const existing = db.getMusyrifById(id, tenantId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Data musyrif tidak ditemukan.',
      });
    }

    if (musyrifCode && musyrifCode.trim()) {
      const trimmedCode = musyrifCode.trim().toUpperCase();
      if (trimmedCode !== existing.musyrifCode) {
        const duplicate = db.getMusyrifByCode(trimmedCode, tenantId);
        if (duplicate && duplicate.id !== id) {
          return res.status(409).json({
            success: false,
            error: `Kode musyrif '${trimmedCode}' sudah digunakan di lembaga ini.`,
          });
        }
      }
    }

    const updated = db.updateMusyrif(id, tenantId, {
      ...(musyrifCode ? { musyrifCode: musyrifCode.trim().toUpperCase() } : {}),
      ...(specialization ? { specialization: specialization.trim() } : {}),
      ...(notes !== undefined ? { notes: notes ? notes.trim() : null } : {}),
      ...(status ? { status } : {}),
    });

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'MUSYRIF_UPDATED',
      module: 'Master SDM',
      entityName: 'Musyrif Asrama',
      entityId: id,
      previousData: JSON.stringify({
        musyrifCode: existing.musyrifCode,
        specialization: existing.specialization,
      }),
      newData: JSON.stringify({
        musyrifCode: updated?.musyrifCode,
        specialization: updated?.specialization,
      }),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      message: `Data musyrif '${updated?.fullName}' berhasil diperbarui.`,
      data: updated,
    });
  }
);

apiRouter.patch(
  '/musyrifs/:id/toggle-status',
  authenticate,
  requirePermission('musyrif.update'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;

    const existing = db.getMusyrifById(id, tenantId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Data musyrif tidak ditemukan.',
      });
    }

    const updated = db.toggleMusyrifStatus(id, tenantId);

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: updated?.status === 'ACTIVE' ? 'MUSYRIF_ACTIVATED' : 'MUSYRIF_DEACTIVATED',
      module: 'Master SDM',
      entityName: 'Musyrif Asrama',
      entityId: id,
      previousData: JSON.stringify({ status: existing.status }),
      newData: JSON.stringify({ status: updated?.status }),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      message: `Status musyrif '${updated?.fullName}' kini ${updated?.status}.`,
      data: updated,
    });
  }
);

apiRouter.delete(
  '/musyrifs/:id',
  authenticate,
  requirePermission('musyrif.delete'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = req.user!.tenantId;

    const existing = db.getMusyrifById(id, tenantId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Data musyrif tidak ditemukan.',
      });
    }

    const result = db.deleteMusyrif(id, tenantId);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Gagal menghapus data musyrif.',
      });
    }

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'MUSYRIF_DELETED',
      module: 'Master SDM',
      entityName: 'Musyrif Asrama',
      entityId: id,
      previousData: JSON.stringify({
        musyrifCode: existing.musyrifCode,
        fullName: existing.fullName,
      }),
      newData: null,
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      message: `Data musyrif '${existing.fullName}' berhasil dihapus.`,
    });
  }
);

// ==========================================
// 10. MASTER DATA SANTRI & WALI SANTRI (PHASE 2.4)
// ==========================================

function resolveStudentTenantId(req: AuthenticatedRequest): string {
  if (req.user!.role === 'SUPER_ADMIN') {
    const qTenant = req.query.tenantId as string;
    const hTenant = req.headers['x-tenant-id'] as string;
    if (qTenant) return qTenant;
    if (hTenant) return hTenant;
  }
  return req.user!.tenantId;
}

// GET /api/students/stats
apiRouter.get(
  '/students/stats',
  authenticate,
  requirePermission('student.view'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = resolveStudentTenantId(req);
    const stats = db.getStudentStats(tenantId);
    return res.json({
      success: true,
      data: stats,
    });
  }
);

// GET /api/students
apiRouter.get(
  '/students',
  authenticate,
  requirePermission('student.view'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = resolveStudentTenantId(req);
    const { search, status, gender, programId, academicYearId, hasRoom } = req.query;

    let students = db.getStudents(tenantId, {
      search: search as string,
      status: status as string,
      gender: gender as string,
      programId: programId as string,
      academicYearId: academicYearId as string,
      hasRoom: hasRoom as string,
    });

    // Enforce data scope for self/parent
    if (req.user!.role === 'SANTRI') {
      students = students.filter(
        (s) => s.id === req.user!.assignedEntityId || s.userId === req.user!.id
      );
    } else if (req.user!.role === 'WALI_SANTRI') {
      const parents = db.getParents(tenantId);
      const parent = parents.find(
        (p) => p.userId === req.user!.id || p.id === req.user!.assignedEntityId
      );
      if (parent) {
        const childIds = (parent.children || []).map((c) => c.studentId);
        students = students.filter((s) => childIds.includes(s.id));
      } else {
        students = [];
      }
    }

    return res.json({
      success: true,
      data: students,
      count: students.length,
    });
  }
);

// GET /api/students/:id
apiRouter.get(
  '/students/:id',
  authenticate,
  requirePermission('student.view'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = resolveStudentTenantId(req);

    const student = db.getStudentById(id, tenantId);
    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Data santri tidak ditemukan.',
      });
    }

    // Role-specific scope check
    if (req.user!.role === 'SANTRI') {
      if (student.id !== req.user!.assignedEntityId && student.userId !== req.user!.id) {
        return res.status(403).json({
          success: false,
          error: 'Akses ditolak. Anda hanya diperkenankan melihat data santri Anda sendiri.',
          code: 'FORBIDDEN_SCOPE',
        });
      }
    } else if (req.user!.role === 'WALI_SANTRI') {
      const parents = db.getParents(tenantId);
      const parent = parents.find(
        (p) => p.userId === req.user!.id || p.id === req.user!.assignedEntityId
      );
      const isChild = parent?.children?.some((c) => c.studentId === student.id);
      if (!isChild) {
        return res.status(403).json({
          success: false,
          error: 'Akses ditolak. Anda hanya diperkenankan melihat data santri yang terhubung dengan akun wali Anda.',
          code: 'FORBIDDEN_SCOPE',
        });
      }
    }

    return res.json({
      success: true,
      data: student,
    });
  }
);

// POST /api/students
apiRouter.post(
  '/students',
  authenticate,
  requirePermission('student.create'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = resolveStudentTenantId(req);
    const {
      nis,
      fullName,
      gender,
      admissionDate,
      programId,
      academicYearId,
      currentRoomId,
      nisn,
      nik,
      nickname,
      birthPlace,
      birthDate,
      phone,
      email,
      address,
      notes,
      photo,
      status,
    } = req.body;

    if (!nis || !fullName || !gender || !admissionDate) {
      return res.status(400).json({
        success: false,
        error: 'NIS, nama lengkap, jenis kelamin, dan tanggal masuk wajib diisi.',
      });
    }

    if (gender !== 'LAKI_LAKI' && gender !== 'PEREMPUAN') {
      return res.status(400).json({
        success: false,
        error: "Jenis kelamin harus 'LAKI_LAKI' atau 'PEREMPUAN'.",
      });
    }

    const result = db.createStudent({
      tenantId,
      nis: nis.trim(),
      nisn: nisn?.trim() || null,
      nik: nik?.trim() || null,
      fullName: fullName.trim(),
      nickname: nickname?.trim() || null,
      gender,
      birthPlace: birthPlace?.trim() || null,
      birthDate: birthDate || null,
      phone: phone?.trim() || null,
      email: email?.trim() || null,
      address: address?.trim() || null,
      admissionDate,
      status: status || 'ACTIVE',
      programId: programId || null,
      academicYearId: academicYearId || null,
      currentRoomId: currentRoomId || null,
      userId: null,
      photo: photo || null,
      notes: notes?.trim() || null,
    });

    if (!result.success || !result.student) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Gagal menambahkan data santri.',
      });
    }

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'STUDENT_CREATED',
      module: 'Kesiswaan',
      entityName: 'Santri',
      entityId: result.student.id,
      previousData: null,
      newData: JSON.stringify({
        nis: result.student.nis,
        fullName: result.student.fullName,
        gender: result.student.gender,
        programId: result.student.programId,
        currentRoomId: result.student.currentRoomId,
      }),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.status(201).json({
      success: true,
      data: result.student,
      message: `Santri '${result.student.fullName}' dengan NIS '${result.student.nis}' berhasil didaftarkan.`,
    });
  }
);

// PUT /api/students/:id
apiRouter.put(
  '/students/:id',
  authenticate,
  requirePermission('student.update'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = resolveStudentTenantId(req);

    const existing = db.getStudentById(id, tenantId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Data santri tidak ditemukan.',
      });
    }

    const {
      nis,
      fullName,
      gender,
      admissionDate,
      programId,
      academicYearId,
      nisn,
      nik,
      nickname,
      birthPlace,
      birthDate,
      phone,
      email,
      address,
      notes,
      photo,
      status,
    } = req.body;

    const result = db.updateStudent(id, tenantId, {
      nis: nis !== undefined ? nis.trim() : undefined,
      fullName: fullName !== undefined ? fullName.trim() : undefined,
      gender: gender !== undefined ? gender : undefined,
      admissionDate: admissionDate !== undefined ? admissionDate : undefined,
      programId: programId !== undefined ? programId : undefined,
      academicYearId: academicYearId !== undefined ? academicYearId : undefined,
      nisn: nisn !== undefined ? nisn?.trim() || null : undefined,
      nik: nik !== undefined ? nik?.trim() || null : undefined,
      nickname: nickname !== undefined ? nickname?.trim() || null : undefined,
      birthPlace: birthPlace !== undefined ? birthPlace?.trim() || null : undefined,
      birthDate: birthDate !== undefined ? birthDate : undefined,
      phone: phone !== undefined ? phone?.trim() || null : undefined,
      email: email !== undefined ? email?.trim() || null : undefined,
      address: address !== undefined ? address?.trim() || null : undefined,
      notes: notes !== undefined ? notes?.trim() || null : undefined,
      photo: photo !== undefined ? photo : undefined,
      status: status !== undefined ? status : undefined,
    });

    if (!result.success || !result.student) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Gagal memperbarui data santri.',
      });
    }

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'STUDENT_UPDATED',
      module: 'Kesiswaan',
      entityName: 'Santri',
      entityId: id,
      previousData: JSON.stringify({
        nis: existing.nis,
        fullName: existing.fullName,
        status: existing.status,
      }),
      newData: JSON.stringify({
        nis: result.student.nis,
        fullName: result.student.fullName,
        status: result.student.status,
      }),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      data: result.student,
      message: `Data santri '${result.student.fullName}' berhasil diperbarui.`,
    });
  }
);

// PATCH /api/students/:id/toggle-status
apiRouter.patch(
  '/students/:id/toggle-status',
  authenticate,
  requirePermission('student.update'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = resolveStudentTenantId(req);
    const { status } = req.body;

    const existing = db.getStudentById(id, tenantId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Data santri tidak ditemukan.',
      });
    }

    const updated = db.toggleStudentStatus(id, tenantId, status);
    if (!updated) {
      return res.status(400).json({
        success: false,
        error: 'Gagal mengubah status santri.',
      });
    }

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'STUDENT_STATUS_TOGGLED',
      module: 'Kesiswaan',
      entityName: 'Santri',
      entityId: id,
      previousData: JSON.stringify({ status: existing.status }),
      newData: JSON.stringify({ status: updated.status }),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      data: updated,
      message: `Status santri '${updated.fullName}' berhasil diubah menjadi ${updated.status}.`,
    });
  }
);

// DELETE /api/students/:id
apiRouter.delete(
  '/students/:id',
  authenticate,
  requirePermission('student.delete'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = resolveStudentTenantId(req);

    const existing = db.getStudentById(id, tenantId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Data santri tidak ditemukan.',
      });
    }

    const result = db.deleteStudent(id, tenantId);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Gagal menghapus santri.',
      });
    }

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'STUDENT_DELETED',
      module: 'Kesiswaan',
      entityName: 'Santri',
      entityId: id,
      previousData: JSON.stringify({
        nis: existing.nis,
        fullName: existing.fullName,
      }),
      newData: null,
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      message: `Santri '${existing.fullName}' berhasil dihapus dari sistem.`,
    });
  }
);

// POST /api/students/:id/link-user
apiRouter.post(
  '/students/:id/link-user',
  authenticate,
  requireAnyPermission('student.update', 'user.update'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { userId } = req.body;
    const tenantId = resolveStudentTenantId(req);

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'ID akun pengguna (userId) wajib diisi.',
      });
    }

    const result = db.linkUserToStudent(id, userId, tenantId);
    if (!result.success || !result.student) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Gagal menautkan akun login ke santri.',
      });
    }

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'STUDENT_USER_LINKED',
      module: 'Kesiswaan',
      entityName: 'Santri',
      entityId: id,
      previousData: null,
      newData: JSON.stringify({ userId }),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      data: result.student,
      message: `Akun login berhasil ditautkan ke santri '${result.student.fullName}'.`,
    });
  }
);

// POST /api/students/:id/unlink-user
apiRouter.post(
  '/students/:id/unlink-user',
  authenticate,
  requireAnyPermission('student.update', 'user.update'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = resolveStudentTenantId(req);

    const existing = db.getStudentById(id, tenantId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Data santri tidak ditemukan.',
      });
    }

    const previousUserId = existing.userId;
    const result = db.unlinkUserFromStudent(id, tenantId);
    if (!result.success || !result.student) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Gagal memutus tautan akun login dari santri.',
      });
    }

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'STUDENT_USER_UNLINKED',
      module: 'Kesiswaan',
      entityName: 'Santri',
      entityId: id,
      previousData: JSON.stringify({ userId: previousUserId }),
      newData: null,
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      data: result.student,
      message: `Tautan akun login untuk santri '${result.student.fullName}' berhasil diputus.`,
    });
  }
);

// POST /api/students/:id/room (Penempatan / Pindah Kamar)
apiRouter.post(
  '/students/:id/room',
  authenticate,
  requirePermission('student.update'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { roomId, notes } = req.body;
    const tenantId = resolveStudentTenantId(req);

    if (!roomId) {
      return res.status(400).json({
        success: false,
        error: 'ID kamar (roomId) wajib diisi.',
      });
    }

    const existing = db.getStudentById(id, tenantId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Data santri tidak ditemukan.',
      });
    }

    const hadPreviousRoom = !!existing.currentRoomId;
    const result = db.assignStudentRoom(id, roomId, tenantId, notes);

    if (!result.success || !result.student) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Gagal menempatkan santri ke kamar.',
      });
    }

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: hadPreviousRoom ? 'STUDENT_ROOM_MOVED' : 'STUDENT_ROOM_ASSIGNED',
      module: 'Kesiswaan',
      entityName: 'Kamar Santri',
      entityId: id,
      previousData: JSON.stringify({ previousRoomId: existing.currentRoomId }),
      newData: JSON.stringify({ newRoomId: roomId, notes }),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      data: result.student,
      message: hadPreviousRoom
        ? `Santri '${result.student.fullName}' berhasil dipindahkan ke kamar baru.`
        : `Santri '${result.student.fullName}' berhasil ditempatkan di kamar.`,
    });
  }
);

// DELETE /api/students/:id/room (Keluar Kamar)
apiRouter.delete(
  '/students/:id/room',
  authenticate,
  requirePermission('student.update'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = resolveStudentTenantId(req);

    const existing = db.getStudentById(id, tenantId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Data santri tidak ditemukan.',
      });
    }

    const previousRoomId = existing.currentRoomId;
    const result = db.removeStudentRoom(id, tenantId);

    if (!result.success || !result.student) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Gagal mengosongkan penempatan kamar santri.',
      });
    }

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'STUDENT_ROOM_REMOVED',
      module: 'Kesiswaan',
      entityName: 'Kamar Santri',
      entityId: id,
      previousData: JSON.stringify({ previousRoomId }),
      newData: null,
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      data: result.student,
      message: `Penempatan kamar santri '${result.student.fullName}' berhasil dikosongkan.`,
    });
  }
);

// GET /api/students/:id/parents
apiRouter.get(
  '/students/:id/parents',
  authenticate,
  requirePermission('student.view'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = resolveStudentTenantId(req);

    const student = db.getStudentById(id, tenantId);
    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Data santri tidak ditemukan.',
      });
    }

    const relations = db.getStudentParents(id, tenantId);
    return res.json({
      success: true,
      data: relations,
    });
  }
);

// POST /api/students/:id/parents
apiRouter.post(
  '/students/:id/parents',
  authenticate,
  requirePermission('student.update'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { parentId, relationship, isPrimaryContact, isEmergencyContact } = req.body;
    const tenantId = resolveStudentTenantId(req);

    if (!parentId || !relationship) {
      return res.status(400).json({
        success: false,
        error: 'Wali (parentId) dan hubungan keluarga (relationship) wajib dipilih.',
      });
    }

    const result = db.addStudentParent(id, parentId, tenantId, {
      relationship,
      isPrimaryContact: !!isPrimaryContact,
      isEmergencyContact: isEmergencyContact !== undefined ? !!isEmergencyContact : true,
    });

    if (!result.success || !result.studentParent) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Gagal menghubungkan santri dengan wali.',
      });
    }

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'STUDENT_PARENT_LINKED',
      module: 'Kesiswaan',
      entityName: 'Relasi Santri-Wali',
      entityId: id,
      previousData: null,
      newData: JSON.stringify({ parentId, relationship }),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    const updatedStudent = db.getStudentById(id, tenantId);
    return res.json({
      success: true,
      data: result.studentParent,
      student: updatedStudent,
      message: 'Wali santri berhasil dihubungkan.',
    });
  }
);

// DELETE /api/students/:id/parents/:parentId
apiRouter.delete(
  '/students/:id/parents/:parentId',
  authenticate,
  requirePermission('student.update'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id, parentId } = req.params;
    const tenantId = resolveStudentTenantId(req);

    const result = db.removeStudentParent(id, parentId, tenantId);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Gagal menghapus relasi santri dan wali.',
      });
    }

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'STUDENT_PARENT_UNLINKED',
      module: 'Kesiswaan',
      entityName: 'Relasi Santri-Wali',
      entityId: id,
      previousData: JSON.stringify({ parentId }),
      newData: null,
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    const updatedStudent = db.getStudentById(id, tenantId);
    return res.json({
      success: true,
      student: updatedStudent,
      message: 'Hubungan dengan wali santri berhasil diputus.',
    });
  }
);

// ==================== PARENTS ENDPOINTS ====================

// GET /api/parents
apiRouter.get(
  '/parents',
  authenticate,
  requirePermission('parent.view'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = resolveStudentTenantId(req);
    const { search, relationshipType } = req.query;

    let parents = db.getParents(tenantId, {
      search: search as string,
      relationshipType: relationshipType as string,
    });

    // Enforce data scope for WALI_SANTRI role
    if (req.user!.role === 'WALI_SANTRI') {
      parents = parents.filter(
        (p) => p.userId === req.user!.id || p.id === req.user!.assignedEntityId
      );
    }

    return res.json({
      success: true,
      data: parents,
      count: parents.length,
    });
  }
);

// GET /api/parents/:id
apiRouter.get(
  '/parents/:id',
  authenticate,
  requirePermission('parent.view'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = resolveStudentTenantId(req);

    const parent = db.getParentById(id, tenantId);
    if (!parent) {
      return res.status(404).json({
        success: false,
        error: 'Data wali santri tidak ditemukan.',
      });
    }

    // Role-specific scope check
    if (req.user!.role === 'WALI_SANTRI') {
      if (parent.userId !== req.user!.id && parent.id !== req.user!.assignedEntityId) {
        return res.status(403).json({
          success: false,
          error: 'Akses ditolak. Anda hanya diperkenankan melihat profil wali santri Anda sendiri.',
          code: 'FORBIDDEN_SCOPE',
        });
      }
    }

    return res.json({
      success: true,
      data: parent,
    });
  }
);

// POST /api/parents
apiRouter.post(
  '/parents',
  authenticate,
  requirePermission('parent.create'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = resolveStudentTenantId(req);
    const { fullName, relationshipType, phone, email, nik, occupation, address } = req.body;

    if (!fullName || !relationshipType || !phone) {
      return res.status(400).json({
        success: false,
        error: 'Nama lengkap, hubungan keluarga, dan nomor telepon wali wajib diisi.',
      });
    }

    const newParent = db.createParent({
      tenantId,
      fullName: fullName.trim(),
      relationshipType,
      phone: phone.trim(),
      email: email?.trim() || null,
      nik: nik?.trim() || null,
      occupation: occupation?.trim() || null,
      address: address?.trim() || null,
      userId: null,
    });

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'PARENT_CREATED',
      module: 'Kesiswaan',
      entityName: 'Wali Santri',
      entityId: newParent.id,
      previousData: null,
      newData: JSON.stringify({
        fullName: newParent.fullName,
        relationshipType: newParent.relationshipType,
        phone: newParent.phone,
      }),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.status(201).json({
      success: true,
      data: newParent,
      message: `Data wali santri '${newParent.fullName}' berhasil ditambahkan.`,
    });
  }
);

// PUT /api/parents/:id
apiRouter.put(
  '/parents/:id',
  authenticate,
  requirePermission('parent.update'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = resolveStudentTenantId(req);

    const existing = db.getParentById(id, tenantId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Data wali santri tidak ditemukan.',
      });
    }

    const { fullName, relationshipType, phone, email, nik, occupation, address } = req.body;

    const updated = db.updateParent(id, tenantId, {
      fullName: fullName !== undefined ? fullName.trim() : undefined,
      relationshipType: relationshipType !== undefined ? relationshipType : undefined,
      phone: phone !== undefined ? phone.trim() : undefined,
      email: email !== undefined ? email?.trim() || null : undefined,
      nik: nik !== undefined ? nik?.trim() || null : undefined,
      occupation: occupation !== undefined ? occupation?.trim() || null : undefined,
      address: address !== undefined ? address?.trim() || null : undefined,
    });

    if (!updated) {
      return res.status(400).json({
        success: false,
        error: 'Gagal memperbarui data wali santri.',
      });
    }

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'PARENT_UPDATED',
      module: 'Kesiswaan',
      entityName: 'Wali Santri',
      entityId: id,
      previousData: JSON.stringify({
        fullName: existing.fullName,
        relationshipType: existing.relationshipType,
      }),
      newData: JSON.stringify({
        fullName: updated.fullName,
        relationshipType: updated.relationshipType,
      }),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      data: updated,
      message: `Data wali santri '${updated.fullName}' berhasil diperbarui.`,
    });
  }
);

// DELETE /api/parents/:id
apiRouter.delete(
  '/parents/:id',
  authenticate,
  requirePermission('parent.delete'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = resolveStudentTenantId(req);

    const existing = db.getParentById(id, tenantId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Data wali santri tidak ditemukan.',
      });
    }

    const result = db.deleteParent(id, tenantId);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Gagal menghapus data wali santri.',
      });
    }

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'PARENT_DELETED',
      module: 'Kesiswaan',
      entityName: 'Wali Santri',
      entityId: id,
      previousData: JSON.stringify({
        fullName: existing.fullName,
        relationshipType: existing.relationshipType,
      }),
      newData: null,
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      message: `Data wali santri '${existing.fullName}' berhasil dihapus.`,
    });
  }
);

// POST /api/parents/:id/link-user
apiRouter.post(
  '/parents/:id/link-user',
  authenticate,
  requireAnyPermission('parent.update', 'user.update'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { userId } = req.body;
    const tenantId = resolveStudentTenantId(req);

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'ID akun pengguna (userId) wajib diisi.',
      });
    }

    const result = db.linkUserToParent(id, userId, tenantId);
    if (!result.success || !result.parent) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Gagal menautkan akun login ke wali santri.',
      });
    }

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'PARENT_USER_LINKED',
      module: 'Kesiswaan',
      entityName: 'Wali Santri',
      entityId: id,
      previousData: null,
      newData: JSON.stringify({ userId }),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      data: result.parent,
      message: `Akun login berhasil ditautkan ke wali santri '${result.parent.fullName}'.`,
    });
  }
);

// POST /api/parents/:id/unlink-user
apiRouter.post(
  '/parents/:id/unlink-user',
  authenticate,
  requireAnyPermission('parent.update', 'user.update'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = resolveStudentTenantId(req);

    const existing = db.getParentById(id, tenantId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Data wali santri tidak ditemukan.',
      });
    }

    const previousUserId = existing.userId;
    const result = db.unlinkUserFromParent(id, tenantId);
    if (!result.success || !result.parent) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Gagal memutus tautan akun login dari wali santri.',
      });
    }

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'PARENT_USER_UNLINKED',
      module: 'Kesiswaan',
      entityName: 'Wali Santri',
      entityId: id,
      previousData: JSON.stringify({ userId: previousUserId }),
      newData: null,
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      data: result.parent,
      message: `Tautan akun login untuk wali santri '${result.parent.fullName}' berhasil diputus.`,
    });
  }
);

// ==========================================
// 11. MASTER DATA KELAS & ROMBEL (PHASE 2.5)
// ==========================================

function resolveClassTenantId(req: AuthenticatedRequest): string {
  if (req.user!.role === 'SUPER_ADMIN') {
    const qTenant = req.query.tenantId as string;
    const hTenant = req.headers['x-tenant-id'] as string;
    if (qTenant) return qTenant;
    if (hTenant) return hTenant;
  }
  return req.user!.tenantId;
}

// GET /api/classes/stats
apiRouter.get(
  '/classes/stats',
  authenticate,
  requirePermission('class.view'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = resolveClassTenantId(req);
    const stats = db.getClassStats(tenantId);
    return res.json({
      success: true,
      data: stats,
    });
  }
);

// GET /api/classes
apiRouter.get(
  '/classes',
  authenticate,
  requirePermission('class.view'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = resolveClassTenantId(req);
    const { academicYearId, programId, gender, status, search, level } = req.query as {
      academicYearId?: string;
      programId?: string;
      gender?: string;
      status?: string;
      search?: string;
      level?: string;
    };

    let classes = db.getClasses(tenantId, {
      academicYearId,
      programId,
      gender,
      status,
      search,
      level,
    });

    // Enforce data scope for restricted roles
    if (req.user!.role === 'PENGAJAR') {
      const teachers = db.getTeachers(tenantId);
      const employees = db.getEmployees(tenantId);
      const teacher = teachers.find((t) => {
        const emp = employees.find((e) => e.id === t.employeeId);
        return emp?.userId === req.user!.id;
      });
      if (teacher) {
        classes = classes.filter((c) => c.homeroomTeacherId === teacher.id);
      } else {
        classes = [];
      }
    } else if (req.user!.role === 'SANTRI') {
      const student = db.getStudents(tenantId).find((s) => s.userId === req.user!.id);
      if (student && student.currentClassId) {
        classes = classes.filter((c) => c.id === student.currentClassId);
      } else {
        classes = [];
      }
    } else if (req.user!.role === 'WALI_SANTRI') {
      const parent = db.getParents(tenantId).find((p) => p.userId === req.user!.id);
      if (parent) {
        const childIds = (parent.children || []).map((c) => c.studentId);
        const children = db.getStudents(tenantId).filter((s) => childIds.includes(s.id));
        const childClassIds = children.map((ch) => ch.currentClassId).filter(Boolean);
        classes = classes.filter((c) => childClassIds.includes(c.id));
      } else {
        classes = [];
      }
    }

    return res.json({
      success: true,
      count: classes.length,
      data: classes,
    });
  }
);

// GET /api/classes/:id
apiRouter.get(
  '/classes/:id',
  authenticate,
  requirePermission('class.view'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = resolveClassTenantId(req);

    const classGroup = db.getClassById(id, tenantId);
    if (!classGroup) {
      return res.status(404).json({
        success: false,
        error: 'Data rombel tidak ditemukan dalam lembaga ini.',
      });
    }

    // Role scope checks
    if (req.user!.role === 'PENGAJAR') {
      const teachers = db.getTeachers(tenantId);
      const employees = db.getEmployees(tenantId);
      const teacher = teachers.find((t) => {
        const emp = employees.find((e) => e.id === t.employeeId);
        return emp?.userId === req.user!.id;
      });
      if (!teacher || classGroup.homeroomTeacherId !== teacher.id) {
        return res.status(403).json({
          success: false,
          error: 'Anda hanya memiliki akses melihat kelas binaan Anda sendiri.',
        });
      }
    } else if (req.user!.role === 'SANTRI') {
      const student = db.getStudents(tenantId).find((s) => s.userId === req.user!.id);
      if (!student || student.currentClassId !== classGroup.id) {
        return res.status(403).json({
          success: false,
          error: 'Anda hanya memiliki akses melihat rombel kelas Anda sendiri.',
        });
      }
    } else if (req.user!.role === 'WALI_SANTRI') {
      const parent = db.getParents(tenantId).find((p) => p.userId === req.user!.id);
      const childIds = parent ? (parent.children || []).map((c) => c.studentId) : [];
      const children = db.getStudents(tenantId).filter((s) => childIds.includes(s.id));
      const childClassIds = children.map((ch) => ch.currentClassId).filter(Boolean);
      if (!childClassIds.includes(classGroup.id)) {
        return res.status(403).json({
          success: false,
          error: 'Anda hanya memiliki akses melihat rombel kelas putra/putri Anda.',
        });
      }
    }

    return res.json({
      success: true,
      data: classGroup,
    });
  }
);

// POST /api/classes
apiRouter.post(
  '/classes',
  authenticate,
  requirePermission('class.create'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = resolveClassTenantId(req);
    const {
      name,
      code,
      academicYearId,
      programId,
      level,
      gender,
      capacity,
      roomLocation,
      homeroomTeacherId,
      notes,
      status,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Nama kelas wajib diisi.' });
    }
    if (!code || !code.trim()) {
      return res.status(400).json({ success: false, error: 'Kode kelas wajib diisi.' });
    }
    if (!academicYearId) {
      return res.status(400).json({ success: false, error: 'Tahun akademik wajib dipilih.' });
    }
    if (!programId) {
      return res.status(400).json({ success: false, error: 'Program pendidikan wajib dipilih.' });
    }
    if (level === undefined || level === null || isNaN(Number(level))) {
      return res.status(400).json({ success: false, error: 'Tingkat / jenjang kelas wajib diisi angka valid.' });
    }
    if (!gender || !['PUTRA', 'PUTRI', 'CAMPURAN'].includes(gender)) {
      return res.status(400).json({ success: false, error: 'Gender rombel harus PUTRA, PUTRI, atau CAMPURAN.' });
    }
    if (!capacity || Number(capacity) <= 0) {
      return res.status(400).json({ success: false, error: 'Kapasitas kelas harus berupa angka positif lebih dari 0.' });
    }

    const result = db.createClass({
      tenantId,
      name: name.trim(),
      code: code.trim(),
      academicYearId,
      programId,
      level: Number(level),
      gender,
      capacity: Number(capacity),
      roomLocation: roomLocation ? roomLocation.trim() : null,
      homeroomTeacherId: homeroomTeacherId || null,
      notes: notes ? notes.trim() : null,
      status: status || 'ACTIVE',
    });

    if (!result.success || !result.classGroup) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Gagal membuat data kelas.',
      });
    }

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'CLASS_CREATED',
      module: 'Master Data',
      entityName: 'Kelas & Rombel',
      entityId: result.classGroup.id,
      previousData: null,
      newData: JSON.stringify({
        code: result.classGroup.code,
        name: result.classGroup.name,
        gender: result.classGroup.gender,
        capacity: result.classGroup.capacity,
        level: result.classGroup.level,
      }),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.status(201).json({
      success: true,
      data: result.classGroup,
      message: `Rombel '${result.classGroup.name}' (${result.classGroup.code}) berhasil dibuat.`,
    });
  }
);

// PUT /api/classes/:id
apiRouter.put(
  '/classes/:id',
  authenticate,
  requirePermission('class.update'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = resolveClassTenantId(req);

    const existing = db.getClassById(id, tenantId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Data rombel tidak ditemukan.',
      });
    }

    const result = db.updateClass(id, tenantId, req.body);
    if (!result.success || !result.classGroup) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Gagal memperbarui data rombel.',
      });
    }

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'CLASS_UPDATED',
      module: 'Master Data',
      entityName: 'Kelas & Rombel',
      entityId: id,
      previousData: JSON.stringify({
        name: existing.name,
        code: existing.code,
        capacity: existing.capacity,
        status: existing.status,
      }),
      newData: JSON.stringify({
        name: result.classGroup.name,
        code: result.classGroup.code,
        capacity: result.classGroup.capacity,
        status: result.classGroup.status,
      }),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      data: result.classGroup,
      message: `Data rombel '${result.classGroup.name}' berhasil diperbarui.`,
    });
  }
);

// DELETE /api/classes/:id
apiRouter.delete(
  '/classes/:id',
  authenticate,
  requirePermission('class.delete'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = resolveClassTenantId(req);

    const existing = db.getClassById(id, tenantId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Data rombel tidak ditemukan.',
      });
    }

    const result = db.deleteClass(id, tenantId);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Gagal menghapus rombel.',
      });
    }

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'CLASS_DELETED',
      module: 'Master Data',
      entityName: 'Kelas & Rombel',
      entityId: id,
      previousData: JSON.stringify({
        code: existing.code,
        name: existing.name,
        level: existing.level,
      }),
      newData: null,
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      message: `Rombel '${existing.name}' (${existing.code}) berhasil dihapus.`,
    });
  }
);

// GET /api/classes/:id/students
apiRouter.get(
  '/classes/:id/students',
  authenticate,
  requirePermission('class.view'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = resolveClassTenantId(req);

    const classGroup = db.getClassById(id, tenantId);
    if (!classGroup) {
      return res.status(404).json({
        success: false,
        error: 'Data rombel tidak ditemukan.',
      });
    }

    // Role checks
    if (req.user!.role === 'PENGAJAR') {
      const teachers = db.getTeachers(tenantId);
      const employees = db.getEmployees(tenantId);
      const teacher = teachers.find((t) => {
        const emp = employees.find((e) => e.id === t.employeeId);
        return emp?.userId === req.user!.id;
      });
      if (!teacher || classGroup.homeroomTeacherId !== teacher.id) {
        return res.status(403).json({
          success: false,
          error: 'Anda hanya dapat melihat daftar santri di kelas binaan Anda.',
        });
      }
    }

    const students = db.getClassStudents(id, tenantId);
    return res.json({
      success: true,
      count: students.length,
      data: students,
    });
  }
);

// POST /api/classes/:id/students (Enroll student to class)
apiRouter.post(
  '/classes/:id/students',
  authenticate,
  requirePermission('class.assign_student'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = resolveClassTenantId(req);
    const { studentId, notes } = req.body;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        error: 'ID santri wajib disertakan.',
      });
    }

    const result = db.assignStudentClass(id, studentId, tenantId, notes);
    if (!result.success || !result.classGroup || !result.student) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Gagal menempatkan santri ke kelas.',
      });
    }

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'CLASS_STUDENT_ENROLLED',
      module: 'Master Data',
      entityName: 'Penempatan Kelas Santri',
      entityId: id,
      previousData: null,
      newData: JSON.stringify({
        classId: id,
        className: result.classGroup.name,
        studentId: result.student.id,
        studentName: result.student.fullName,
        nis: result.student.nis,
      }),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.status(201).json({
      success: true,
      data: {
        classGroup: result.classGroup,
        student: result.student,
      },
      message: `Santri '${result.student.fullName}' (${result.student.nis}) berhasil ditempatkan di ${result.classGroup.name}.`,
    });
  }
);

// PUT /api/classes/:id/students/:studentId (Transfer student to another class)
apiRouter.put(
  '/classes/:id/students/:studentId',
  authenticate,
  requirePermission('class.assign_student'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id: sourceClassId, studentId } = req.params;
    const tenantId = resolveClassTenantId(req);
    const { targetClassId, notes } = req.body;

    if (!targetClassId) {
      return res.status(400).json({
        success: false,
        error: 'Rombel tujuan (targetClassId) wajib dipilih.',
      });
    }

    const result = db.transferStudentClass(sourceClassId, studentId, targetClassId, tenantId, notes);
    if (!result.success || !result.student) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Gagal memindahkan santri ke rombel lain.',
      });
    }

    const sourceCls = db.getClassById(sourceClassId, tenantId);
    const targetCls = db.getClassById(targetClassId, tenantId);

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'CLASS_STUDENT_TRANSFERRED',
      module: 'Master Data',
      entityName: 'Mutasi Kelas Santri',
      entityId: targetClassId,
      previousData: JSON.stringify({
        sourceClassId,
        sourceClassName: sourceCls?.name,
        studentId,
        studentName: result.student.fullName,
      }),
      newData: JSON.stringify({
        targetClassId,
        targetClassName: targetCls?.name,
        studentId,
        studentName: result.student.fullName,
      }),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      data: result.student,
      message: `Santri '${result.student.fullName}' berhasil dipindahkan ke rombel ${targetCls?.name}.`,
    });
  }
);

// DELETE /api/classes/:id/students/:studentId (Remove student from class)
apiRouter.delete(
  '/classes/:id/students/:studentId',
  authenticate,
  requirePermission('class.assign_student'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id: classId, studentId } = req.params;
    const tenantId = resolveClassTenantId(req);
    const reason = (req.body?.reason || req.query?.reason) as string | undefined;

    const result = db.removeStudentFromClass(classId, studentId, tenantId, reason);
    if (!result.success || !result.student) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Gagal mengeluarkan santri dari rombel.',
      });
    }

    const cls = db.getClassById(classId, tenantId);

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'CLASS_STUDENT_REMOVED',
      module: 'Master Data',
      entityName: 'Pengeluaran Santri Rombel',
      entityId: classId,
      previousData: JSON.stringify({
        classId,
        className: cls?.name,
        studentId,
        studentName: result.student.fullName,
      }),
      newData: JSON.stringify({ reason: reason || 'Dikeluarkan' }),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      data: result.student,
      message: `Santri '${result.student.fullName}' berhasil dikeluarkan dari rombel ${cls?.name}.`,
    });
  }
);

// PUT /api/classes/:id/homeroom (Assign or change homeroom teacher)
apiRouter.put(
  '/classes/:id/homeroom',
  authenticate,
  requirePermission('class.update'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = resolveClassTenantId(req);
    const { homeroomTeacherId } = req.body;

    const result = db.updateClassHomeroom(id, homeroomTeacherId || null, tenantId);
    if (!result.success || !result.classGroup) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Gagal menetapkan wali kelas.',
      });
    }

    const action = result.previousTeacherId ? 'CLASS_HOMEROOM_CHANGED' : 'CLASS_HOMEROOM_ASSIGNED';

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action,
      module: 'Master Data',
      entityName: 'Wali Kelas',
      entityId: id,
      previousData: JSON.stringify({ homeroomTeacherId: result.previousTeacherId }),
      newData: JSON.stringify({
        homeroomTeacherId,
        teacherName: result.classGroup.homeroomTeacher?.employee?.fullName,
      }),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      data: result.classGroup,
      message: homeroomTeacherId
        ? `Wali kelas berhasil diperbarui ke ${result.classGroup.homeroomTeacher?.employee?.fullName || 'Ustadz'}.`
        : `Wali kelas untuk rombel '${result.classGroup.name}' berhasil dikosongkan.`,
    });
  }
);

// ==========================================
// 12. MASTER DATA MATA PELAJARAN (PHASE 3.1)
// ==========================================

function resolveSubjectTenantId(req: AuthenticatedRequest): string {
  if (req.user!.role === 'SUPER_ADMIN') {
    const qTenant = req.query.tenantId as string;
    const hTenant = req.headers['x-tenant-id'] as string;
    if (qTenant) return qTenant;
    if (hTenant) return hTenant;
  }
  return req.user!.tenantId;
}

// GET /api/subjects/stats
apiRouter.get(
  '/subjects/stats',
  authenticate,
  requirePermission('subject.view'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = resolveSubjectTenantId(req);
    const stats = db.getSubjectStats(tenantId);
    return res.json({
      success: true,
      data: stats,
    });
  }
);

// GET /api/subjects
apiRouter.get(
  '/subjects',
  authenticate,
  requirePermission('subject.view'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = resolveSubjectTenantId(req);
    const { search, type, status } = req.query as {
      search?: string;
      type?: string;
      status?: string;
    };

    const subjects = db.getSubjects(tenantId, { search, type, status });
    return res.json({
      success: true,
      count: subjects.length,
      data: subjects,
    });
  }
);

// GET /api/subjects/:id
apiRouter.get(
  '/subjects/:id',
  authenticate,
  requirePermission('subject.view'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = resolveSubjectTenantId(req);

    const subject = db.getSubjectById(id, tenantId);
    if (!subject) {
      return res.status(404).json({
        success: false,
        error: 'Mata pelajaran tidak ditemukan.',
      });
    }

    return res.json({
      success: true,
      data: subject,
    });
  }
);

// POST /api/subjects
apiRouter.post(
  '/subjects',
  authenticate,
  requirePermission('subject.create'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = resolveSubjectTenantId(req);
    const { code, name, shortName, type, creditHours, status, description } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Kode mata pelajaran wajib diisi.',
      });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Nama mata pelajaran wajib diisi.',
      });
    }

    const parsedHours = Number(creditHours);
    if (!creditHours || isNaN(parsedHours) || parsedHours <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Beban JPL (credit hours) harus berupa angka positif lebih dari 0.',
      });
    }

    const validTypes = ['DINIYAH', 'UMUM', 'BAHASA', 'TAHFIDZ', 'KETERAMPILAN', 'LAINNYA'];
    if (!type || !validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'Jenis mata pelajaran tidak valid.',
      });
    }

    const result = db.createSubject(tenantId, {
      code,
      name,
      shortName: shortName || code,
      type,
      creditHours: parsedHours,
      status: status || 'ACTIVE',
      description,
    });

    if (!result.success || !result.subject) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Gagal menambahkan mata pelajaran.',
      });
    }

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'SUBJECT_CREATED',
      module: 'Akademik',
      entityName: 'Mata Pelajaran',
      entityId: result.subject.id,
      previousData: null,
      newData: JSON.stringify(result.subject),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.status(201).json({
      success: true,
      data: result.subject,
      message: `Mata pelajaran '${result.subject.name}' (${result.subject.code}) berhasil ditambahkan.`,
    });
  }
);

// PUT /api/subjects/:id
apiRouter.put(
  '/subjects/:id',
  authenticate,
  requirePermission('subject.update'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = resolveSubjectTenantId(req);

    const existing = db.getSubjectById(id, tenantId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Mata pelajaran tidak ditemukan.',
      });
    }

    const { code, name, shortName, type, creditHours, status, description } = req.body;

    if (creditHours !== undefined) {
      const parsedHours = Number(creditHours);
      if (isNaN(parsedHours) || parsedHours <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Beban JPL (credit hours) harus berupa angka positif lebih dari 0.',
        });
      }
    }

    if (type !== undefined) {
      const validTypes = ['DINIYAH', 'UMUM', 'BAHASA', 'TAHFIDZ', 'KETERAMPILAN', 'LAINNYA'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({
          success: false,
          error: 'Jenis mata pelajaran tidak valid.',
        });
      }
    }

    const result = db.updateSubject(id, tenantId, {
      code,
      name,
      shortName,
      type,
      creditHours,
      status,
      description,
    });

    if (!result.success || !result.subject) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Gagal memperbarui mata pelajaran.',
      });
    }

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'SUBJECT_UPDATED',
      module: 'Akademik',
      entityName: 'Mata Pelajaran',
      entityId: id,
      previousData: JSON.stringify(existing),
      newData: JSON.stringify(result.subject),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      data: result.subject,
      message: `Mata pelajaran '${result.subject.name}' (${result.subject.code}) berhasil diperbarui.`,
    });
  }
);

// DELETE /api/subjects/:id
apiRouter.delete(
  '/subjects/:id',
  authenticate,
  requirePermission('subject.delete'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = resolveSubjectTenantId(req);

    const existing = db.getSubjectById(id, tenantId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Mata pelajaran tidak ditemukan.',
      });
    }

    const result = db.deleteSubject(id, tenantId);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Gagal menghapus mata pelajaran.',
      });
    }

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'SUBJECT_DELETED',
      module: 'Akademik',
      entityName: 'Mata Pelajaran',
      entityId: id,
      previousData: JSON.stringify(existing),
      newData: null,
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      message: `Mata pelajaran '${existing.name}' (${existing.code}) berhasil dihapus.`,
    });
  }
);

// ==========================================
// PHASE 3.2: KURIKULUM ROMBEL (CLASS SUBJECT)
// ==========================================
function resolveClassSubjectTenantId(req: AuthenticatedRequest): string {
  if (req.user?.role === 'SUPER_ADMIN' && req.query.tenantId) {
    return req.query.tenantId as string;
  }
  return req.user!.tenantId;
}

// GET /api/class-subjects/stats
apiRouter.get(
  '/class-subjects/stats',
  authenticate,
  requirePermission('class_subject.view'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = resolveClassSubjectTenantId(req);
    const stats = db.getClassSubjectStats(tenantId);
    return res.json({
      success: true,
      data: stats,
    });
  }
);

// GET /api/class-subjects
apiRouter.get(
  '/class-subjects',
  authenticate,
  requirePermission('class_subject.view'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = resolveClassSubjectTenantId(req);
    const { classId, subjectId, teacherId, status, search } = req.query as {
      classId?: string;
      subjectId?: string;
      teacherId?: string;
      status?: string;
      search?: string;
    };

    const list = db.getClassSubjects(tenantId, {
      classId,
      subjectId,
      teacherId,
      status,
      search,
    });

    return res.json({
      success: true,
      count: list.length,
      data: list,
    });
  }
);

// GET /api/class-subjects/:id
apiRouter.get(
  '/class-subjects/:id',
  authenticate,
  requirePermission('class_subject.view'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = resolveClassSubjectTenantId(req);

    const item = db.getClassSubjectById(id, tenantId);
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Data kurikulum rombel tidak ditemukan.',
      });
    }

    return res.json({
      success: true,
      data: item,
    });
  }
);

// POST /api/class-subjects
apiRouter.post(
  '/class-subjects',
  authenticate,
  requirePermission('class_subject.create'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = resolveClassSubjectTenantId(req);
    const { classId, subjectId, teacherId, creditHours, status } = req.body;

    const result = db.createClassSubject(tenantId, {
      classId,
      subjectId,
      teacherId,
      creditHours,
      status,
    });

    if (!result.success || !result.classSubject) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Gagal menambahkan mata pelajaran ke rombel.',
      });
    }

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'CLASS_SUBJECT_CREATED',
      module: 'Akademik',
      entityName: 'Kurikulum Rombel',
      entityId: result.classSubject.id,
      previousData: null,
      newData: JSON.stringify(result.classSubject),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.status(201).json({
      success: true,
      data: result.classSubject,
      message: `Mata pelajaran '${result.classSubject.subject?.name || ''}' berhasil dialokasikan pada kelas '${result.classSubject.classGroup?.name || ''}'.`,
    });
  }
);

// PUT /api/class-subjects/:id
apiRouter.put(
  '/class-subjects/:id',
  authenticate,
  requirePermission('class_subject.update'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = resolveClassSubjectTenantId(req);
    const { teacherId, creditHours, status } = req.body;

    const existing = db.getClassSubjectById(id, tenantId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Data kurikulum rombel tidak ditemukan.',
      });
    }

    const result = db.updateClassSubject(id, tenantId, {
      teacherId,
      creditHours,
      status,
    });

    if (!result.success || !result.classSubject) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Gagal memperbarui kurikulum rombel.',
      });
    }

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'CLASS_SUBJECT_UPDATED',
      module: 'Akademik',
      entityName: 'Kurikulum Rombel',
      entityId: id,
      previousData: JSON.stringify(existing),
      newData: JSON.stringify(result.classSubject),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      data: result.classSubject,
      message: `Kurikulum rombel untuk mata pelajaran '${result.classSubject.subject?.name || ''}' berhasil diperbarui.`,
    });
  }
);

// DELETE /api/class-subjects/:id
apiRouter.delete(
  '/class-subjects/:id',
  authenticate,
  requirePermission('class_subject.delete'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = resolveClassSubjectTenantId(req);

    const existing = db.getClassSubjectById(id, tenantId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Data kurikulum rombel tidak ditemukan.',
      });
    }

    const result = db.deleteClassSubject(id, tenantId);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Gagal menghapus kurikulum rombel.',
      });
    }

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'CLASS_SUBJECT_DELETED',
      module: 'Akademik',
      entityName: 'Kurikulum Rombel',
      entityId: id,
      previousData: JSON.stringify(existing),
      newData: null,
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      message: `Alokasi mata pelajaran '${existing.subject?.name || ''}' dari kelas '${existing.classGroup?.name || ''}' berhasil dihapus.`,
    });
  }
);

// ==========================================
// PHASE 3.3: JADWAL PELAJARAN (SCHEDULE) API
// ==========================================

function resolveScheduleTenantId(req: AuthenticatedRequest): string {
  if (req.user?.role === 'SUPER_ADMIN') {
    return (req.query.tenantId as string) || (req.body.tenantId as string) || req.user.tenantId || 'ten_darulmusthafa';
  }
  return req.user!.tenantId;
}

// GET /api/schedules/stats
apiRouter.get(
  '/schedules/stats',
  authenticate,
  requirePermission('schedule.view'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = resolveScheduleTenantId(req);
    const stats = db.getScheduleStats(tenantId);
    return res.json({
      success: true,
      data: stats,
    });
  }
);

// GET /api/schedules/by-class/:classId
apiRouter.get(
  '/schedules/by-class/:classId',
  authenticate,
  requirePermission('schedule.view'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { classId } = req.params;
    const tenantId = resolveScheduleTenantId(req);
    const list = db.getSchedules(tenantId, { classId });
    return res.json({
      success: true,
      count: list.length,
      data: list,
    });
  }
);

// GET /api/schedules/by-teacher/:teacherId
apiRouter.get(
  '/schedules/by-teacher/:teacherId',
  authenticate,
  requirePermission('schedule.view'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { teacherId } = req.params;
    const tenantId = resolveScheduleTenantId(req);
    const list = db.getSchedules(tenantId, { teacherId });
    return res.json({
      success: true,
      count: list.length,
      data: list,
    });
  }
);

// GET /api/schedules/by-room/:roomId
apiRouter.get(
  '/schedules/by-room/:roomId',
  authenticate,
  requirePermission('schedule.view'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { roomId } = req.params;
    const tenantId = resolveScheduleTenantId(req);
    const list = db.getSchedules(tenantId, { roomId });
    return res.json({
      success: true,
      count: list.length,
      data: list,
    });
  }
);

// POST /api/schedules/check-conflict
apiRouter.post(
  '/schedules/check-conflict',
  authenticate,
  requirePermission('schedule.view'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = resolveScheduleTenantId(req);
    const { classId, teacherId, roomId, dayOfWeek, startTime, endTime, excludeScheduleId } = req.body;

    if (!classId || !teacherId || !roomId || !dayOfWeek || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        error: 'Parameter pengecekan bentrok jadwal belum lengkap.',
      });
    }

    const check = db.checkScheduleConflict(tenantId, {
      classId,
      teacherId,
      roomId,
      dayOfWeek,
      startTime,
      endTime,
      excludeScheduleId,
    });

    return res.json({
      success: true,
      data: check,
    });
  }
);

// GET /api/schedules
apiRouter.get(
  '/schedules',
  authenticate,
  requirePermission('schedule.view'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = resolveScheduleTenantId(req);
    const { classId, dayOfWeek, teacherId, roomId, status, search } = req.query as {
      classId?: string;
      dayOfWeek?: any;
      teacherId?: string;
      roomId?: string;
      status?: any;
      search?: string;
    };

    const list = db.getSchedules(tenantId, {
      classId,
      dayOfWeek,
      teacherId,
      roomId,
      status,
      search,
    });

    return res.json({
      success: true,
      count: list.length,
      data: list,
    });
  }
);

// GET /api/schedules/:id
apiRouter.get(
  '/schedules/:id',
  authenticate,
  requirePermission('schedule.view'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = resolveScheduleTenantId(req);

    const item = db.getScheduleById(id, tenantId);
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Data jadwal pelajaran tidak ditemukan.',
      });
    }

    return res.json({
      success: true,
      data: item,
    });
  }
);

// POST /api/schedules
apiRouter.post(
  '/schedules',
  authenticate,
  requirePermission('schedule.create'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const tenantId = resolveScheduleTenantId(req);
    const { classSubjectId, classId, roomId, dayOfWeek, startTime, endTime, status } = req.body;

    const result = db.createSchedule(tenantId, {
      classSubjectId,
      classId,
      roomId,
      dayOfWeek,
      startTime,
      endTime,
      status,
    });

    if (!result.success || !result.schedule) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Gagal menambahkan jadwal pelajaran.',
        conflictType: result.conflictType,
      });
    }

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'SCHEDULE_CREATED',
      module: 'Akademik',
      entityName: 'Jadwal Pelajaran',
      entityId: result.schedule.id,
      previousData: null,
      newData: JSON.stringify(result.schedule),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.status(201).json({
      success: true,
      data: result.schedule,
      message: `Jadwal pelajaran untuk ${result.schedule.subject?.name || 'Mata Pelajaran'} (${result.schedule.dayOfWeek} ${result.schedule.startTime}-${result.schedule.endTime}) berhasil ditambahkan.`,
    });
  }
);

// PUT /api/schedules/:id
apiRouter.put(
  '/schedules/:id',
  authenticate,
  requirePermission('schedule.update'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = resolveScheduleTenantId(req);
    const { classSubjectId, roomId, dayOfWeek, startTime, endTime, status } = req.body;

    const existing = db.getScheduleById(id, tenantId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Data jadwal pelajaran tidak ditemukan.',
      });
    }

    const result = db.updateSchedule(id, tenantId, {
      classSubjectId,
      roomId,
      dayOfWeek,
      startTime,
      endTime,
      status,
    });

    if (!result.success || !result.schedule) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Gagal memperbarui jadwal pelajaran.',
        conflictType: result.conflictType,
      });
    }

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'SCHEDULE_UPDATED',
      module: 'Akademik',
      entityName: 'Jadwal Pelajaran',
      entityId: id,
      previousData: JSON.stringify(existing),
      newData: JSON.stringify(result.schedule),
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      data: result.schedule,
      message: `Jadwal pelajaran berhasil diperbarui (${result.schedule.dayOfWeek} ${result.schedule.startTime}-${result.schedule.endTime}).`,
    });
  }
);

// DELETE /api/schedules/:id
apiRouter.delete(
  '/schedules/:id',
  authenticate,
  requirePermission('schedule.delete'),
  enforceTenantIsolation,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const tenantId = resolveScheduleTenantId(req);

    const existing = db.getScheduleById(id, tenantId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Data jadwal pelajaran tidak ditemukan.',
      });
    }

    const result = db.deleteSchedule(id, tenantId);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Gagal menghapus jadwal pelajaran.',
      });
    }

    db.addAuditLog({
      tenantId,
      userId: req.user!.id,
      userName: req.user!.fullName,
      userRole: req.user!.role,
      action: 'SCHEDULE_DELETED',
      module: 'Akademik',
      entityName: 'Jadwal Pelajaran',
      entityId: id,
      previousData: JSON.stringify(existing),
      newData: null,
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.json({
      success: true,
      message: `Jadwal pelajaran '${existing.subject?.name || ''}' hari ${existing.dayOfWeek} berhasil dihapus.`,
    });
  }
);




