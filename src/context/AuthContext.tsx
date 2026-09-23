import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Tenant, RoleDefinition, RoleType, DataScope } from '../types';
import { api, getStoredToken, setStoredToken, removeStoredToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  tenant: Tenant | null;
  roleDefinition: RoleDefinition | null;
  permissions: string[];
  isLoading: boolean;
  isAuthenticated: boolean;
  hasPermission: (permissionCode: string) => boolean;
  login: (identifier: string, pass: string, tenantCode?: string) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (role: RoleType, tenantId?: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [roleDefinition, setRoleDefinition] = useState<RoleDefinition | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const initAuth = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      // Default to auto-login as DIREKTUR for quick demo exploration if not logged in
      try {
        const res = await api.quickSwitchRole('DIREKTUR', 'ten_darulmusthafa');
        setStoredToken(res.token);
        setUser(res.user);
        setTenant(res.tenant);
        setRoleDefinition(res.roleDefinition);
        setPermissions(res.permissions || []);
      } catch (e) {
        console.error('Failed to auto-init demo session:', e);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    try {
      const res = await api.getMe();
      setUser(res.user);
      setTenant(res.tenant);
      setRoleDefinition(res.roleDefinition);
      setPermissions(res.permissions || []);
    } catch (err) {
      console.warn('Session expired or invalid, logging out:', err);
      removeStoredToken();
      setUser(null);
      setTenant(null);
      setRoleDefinition(null);
      setPermissions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const login = async (identifier: string, pass: string, tenantCode?: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(identifier, pass, tenantCode);
      setStoredToken(res.token);
      setUser(res.user);
      setTenant(res.tenant);
      setRoleDefinition(res.roleDefinition);
      setPermissions(res.roleDefinition?.permissions || []);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await api.logout();
    } finally {
      setUser(null);
      setTenant(null);
      setRoleDefinition(null);
      setPermissions([]);
      setIsLoading(false);
    }
  };

  const switchRole = async (role: RoleType, tenantId?: string) => {
    setIsLoading(true);
    try {
      const res = await api.quickSwitchRole(role, tenantId);
      setStoredToken(res.token);
      setUser(res.user);
      setTenant(res.tenant);
      setRoleDefinition(res.roleDefinition);
      setPermissions(res.permissions || []);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const res = await api.getMe();
      setUser(res.user);
      setTenant(res.tenant);
      setRoleDefinition(res.roleDefinition);
      setPermissions(res.permissions || []);
    } catch (e) {
      console.error('Refresh user error:', e);
    }
  };

  const hasPermission = (permissionCode: string): boolean => {
    if (!user) return false;
    if (user.role === 'SUPER_ADMIN') return true;
    return permissions.includes(permissionCode);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tenant,
        roleDefinition,
        permissions,
        isLoading,
        isAuthenticated: !!user,
        hasPermission,
        login,
        logout,
        switchRole,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
