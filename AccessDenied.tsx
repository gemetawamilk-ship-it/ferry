import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AccessDeniedProps {
  requiredPermission?: string;
  onBack?: () => void;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({ requiredPermission, onBack }) => {
  const { user, roleDefinition } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-[420px] p-8 text-center bg-white rounded-xl border border-slate-200 shadow-xs max-w-xl mx-auto my-12">
      <div className="w-14 h-14 bg-rose-50 border border-rose-200 text-rose-600 rounded-full flex items-center justify-center mb-4">
        <ShieldAlert className="w-7 h-7" />
      </div>
      <h2 className="text-xl font-bold text-slate-900">Akses Dibatasi (RBAC 403)</h2>
      <p className="mt-2 text-sm text-slate-600 leading-relaxed">
        Peran Anda saat ini sebagai{' '}
        <span className="font-semibold text-slate-800">{roleDefinition?.name || user?.role}</span> tidak
        memiliki izin untuk membuka halaman atau fitur ini.
      </p>

      {requiredPermission && (
        <div className="mt-4 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-600">
          Izin yang dibutuhkan: <span className="font-bold text-slate-900">{requiredPermission}</span>
        </div>
      )}

      <p className="mt-3 text-xs text-slate-600">
        Keamanan E-PESANTREN 360 menerapkan isolasi hak akses berlapis pada sisi server dan client. Hubungi
        Administrator jika Anda memerlukan hak akses tambahan.
      </p>

      {onBack && (
        <button
          onClick={onBack}
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Dashboard
        </button>
      )}
    </div>
  );
};
