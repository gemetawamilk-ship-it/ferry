import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { db, ROLES_DEFINITIONS } from './db';
import { User, Tenant, RoleType, DataScope } from './types';

// Extend Express Request interface
export interface AuthenticatedRequest extends Request {
  user?: User;
  tenant?: Tenant;
  token?: string;
}

// Stateless signed sessions for Vercel/serverless deployments.
// The token contains only the user/tenant identifiers and expiry; the signature
// prevents tampering and works across separate function invocations.
interface SessionData {
  userId: string;
  tenantId: string;
  expiresAt: number;
}

const SESSION_SECRET = process.env.SESSION_SECRET || 'epesantren360-investor-demo-secret-change-me';

function base64url(value: string): string {
  return Buffer.from(value).toString('base64url');
}

function sign(value: string): string {
  return crypto.createHmac('sha256', SESSION_SECRET).update(value).digest('base64url');
}

export function createSession(user: User): string {
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const payload = base64url(JSON.stringify({
    userId: user.id,
    tenantId: user.tenantId,
    expiresAt,
  }));
  return `eps360_${payload}.${sign(payload)}`;
}

export function revokeSession(_token: string): boolean {
  // Stateless tokens cannot be globally revoked without persistent storage.
  // Logout still removes the browser token on the client.
  return true;
}

export function getSession(token: string): SessionData | null {
  try {
    if (!token.startsWith('eps360_')) return null;
    const tokenBody = token.slice('eps360_'.length);
    const separator = tokenBody.lastIndexOf('.');
    if (separator <= 0) return null;

    const payload = tokenBody.slice(0, separator);
    const signature = tokenBody.slice(separator + 1);
    const expected = sign(payload);

    if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      return null;
    }

    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as SessionData;
    if (!session.userId || !session.tenantId || !session.expiresAt || Date.now() > session.expiresAt) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

// Authentication Middleware
export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Autentikasi diperlukan. Silakan masuk terlebih dahulu.',
      code: 'UNAUTHORIZED',
    });
  }

  const token = authHeader.split(' ')[1];
  const session = getSession(token);
  if (!session) {
    return res.status(401).json({
      success: false,
      error: 'Sesi login telah kedaluwarsa atau tidak valid. Silakan login kembali.',
      code: 'SESSION_EXPIRED',
    });
  }

  const user = db.getUserById(session.userId);
  if (!user || user.status !== 'ACTIVE') {
    return res.status(401).json({
      success: false,
      error: 'Akun pengguna tidak ditemukan atau telah dinonaktifkan.',
      code: 'ACCOUNT_INACTIVE',
    });
  }

  let tenant: Tenant | undefined;
  if (user.role === 'SUPER_ADMIN') {
    // Super admin can specify tenant header or fallback to first
    const reqTenantId = (req.headers['x-tenant-id'] as string) || user.tenantId;
    tenant = db.getTenantById(reqTenantId) || db.getTenants()[0];
  } else {
    tenant = db.getTenantById(user.tenantId);
  }

  req.user = user;
  req.tenant = tenant;
  req.token = token;
  next();
}

// Granular Permission Middleware
export function requirePermission(permissionCode: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Akses ditolak. Tidak terotentikasi.' });
    }

    // SUPER_ADMIN has master bypass
    if (req.user.role === 'SUPER_ADMIN') {
      return next();
    }

    const roleDef = ROLES_DEFINITIONS[req.user.role];
    if (!roleDef) {
      return res.status(403).json({
        success: false,
        error: `Role '${req.user.role}' tidak dikenali oleh sistem.`,
        code: 'FORBIDDEN_ROLE',
      });
    }

    const hasPermission = roleDef.permissions.includes(permissionCode);
    if (!hasPermission) {
      // Record audit log of unauthorized attempt
      db.addAuditLog({
        tenantId: req.user.tenantId,
        userId: req.user.id,
        userName: req.user.fullName,
        userRole: req.user.role,
        action: 'UNAUTHORIZED_ACCESS_ATTEMPT',
        module: 'Security Engine',
        entityName: 'Permission Enforcement',
        entityId: permissionCode,
        previousData: null,
        newData: `Percobaan akses terlarang ke izin '${permissionCode}' dari IP ${req.ip}`,
        ipAddress: req.ip || '127.0.0.1',
        userAgent: req.headers['user-agent'] || 'Unknown',
      });

      return res.status(403).json({
        success: false,
        error: `Akses ditolak. Anda tidak memiliki izin '${permissionCode}' untuk tindakan ini.`,
        code: 'PERMISSION_DENIED',
        requiredPermission: permissionCode,
      });
    }

    next();
  };
}

// Any Permission Middleware (passes if user has at least one of the permissions)
export function requireAnyPermission(...permissionCodes: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Akses ditolak. Tidak terotentikasi.' });
    }

    if (req.user.role === 'SUPER_ADMIN') {
      return next();
    }

    const roleDef = ROLES_DEFINITIONS[req.user.role];
    if (!roleDef) {
      return res.status(403).json({
        success: false,
        error: `Role '${req.user.role}' tidak dikenali oleh sistem.`,
        code: 'FORBIDDEN_ROLE',
      });
    }

    const hasAny = permissionCodes.some((code) => roleDef.permissions.includes(code));
    if (!hasAny) {
      db.addAuditLog({
        tenantId: req.user.tenantId,
        userId: req.user.id,
        userName: req.user.fullName,
        userRole: req.user.role,
        action: 'UNAUTHORIZED_ACCESS_ATTEMPT',
        module: 'Security Engine',
        entityName: 'Permission Enforcement',
        entityId: permissionCodes.join(','),
        previousData: null,
        newData: `Percobaan akses terlarang ke izin '${permissionCodes.join(', ')}' dari IP ${req.ip}`,
        ipAddress: req.ip || '127.0.0.1',
        userAgent: req.headers['user-agent'] || 'Unknown',
      });

      return res.status(403).json({
        success: false,
        error: `Akses ditolak. Anda tidak memiliki salah satu izin yang diperlukan (${permissionCodes.join(', ')}).`,
        code: 'PERMISSION_DENIED',
        requiredPermissions: permissionCodes,
      });
    }

    next();
  };
}

// Tenant Isolation Middleware
export function enforceTenantIsolation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Autentikasi diperlukan.' });
  }

  // If Super Admin, allow cross-tenant query
  if (req.user.role === 'SUPER_ADMIN') {
    return next();
  }

  // If requested resource explicitly specifies a different tenant, block it
  const targetTenantId = req.params.tenantId || req.query.tenantId || req.body?.tenantId;
  if (targetTenantId && targetTenantId !== req.user.tenantId) {
    db.addAuditLog({
      tenantId: req.user.tenantId,
      userId: req.user.id,
      userName: req.user.fullName,
      userRole: req.user.role,
      action: 'CROSS_TENANT_VIOLATION_ATTEMPT',
      module: 'Security Engine',
      entityName: 'Tenant Isolation',
      entityId: String(targetTenantId),
      previousData: null,
      newData: `Mencoba mengakses tenant '${targetTenantId}' padahal user terikat pada '${req.user.tenantId}'`,
      ipAddress: req.ip || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
    });

    return res.status(403).json({
      success: false,
      error: 'Isolasi Keamanan: Anda tidak berhak mengakses data dari pesantren/lembaga lain.',
      code: 'TENANT_ISOLATION_VIOLATION',
    });
  }

  next();
}
