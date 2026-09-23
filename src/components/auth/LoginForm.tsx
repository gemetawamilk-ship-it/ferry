import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Building2, Lock, User, ShieldCheck, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { RoleType } from '../../types';

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('direktur');
  const [password, setPassword] = useState('password123');
  const [tenantCode, setTenantCode] = useState('darulmusthafa');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(username, password, tenantCode);
    } catch (err: any) {
      setError(err.message || 'Username atau password tidak cocok.');
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts: { label: string; role: RoleType; u: string; t: string; desc: string }[] = [
    { label: 'Direktur', role: 'DIREKTUR', u: 'direktur', t: 'darulmusthafa', desc: 'Pimpinan Pesantren' },
    { label: 'Bendahara', role: 'BENDAHARA', u: 'bendahara', t: 'darulmusthafa', desc: 'Keuangan & SPP' },
    { label: 'Guru / Ustadz', role: 'PENGAJAR', u: 'ustadz.farisi', t: 'darulmusthafa', desc: 'Kelas 3A Aliyah' },
    { label: 'Musyrif', role: 'MUSYRIF', u: 'musyrif.hassan', t: 'darulmusthafa', desc: 'Asrama Umar' },
    { label: 'Admin Pesantren', role: 'ADMIN', u: 'admin.pesantren', t: 'darulmusthafa', desc: 'Administrator Operasional' },
    { label: 'Wali Santri', role: 'WALI_SANTRI', u: 'wali.faqih', t: 'darulmusthafa', desc: 'Orang Tua Santri' },
    { label: 'Santri', role: 'SANTRI', u: 'santri.faqih', t: 'darulmusthafa', desc: 'Ahmad Muhammad Faqih' },
    { label: 'Super Admin', role: 'SUPER_ADMIN', u: 'superadmin', t: 'darulmusthafa', desc: 'Platform SaaS Owner' },
  ];

  const handleSelectDemo = (u: string, t: string) => {
    setUsername(u);
    setPassword('password123');
    setTenantCode(t);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Islamic Geometric/Aesthetic Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-emerald-500 blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-teal-500 blur-3xl"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-xl shadow-emerald-900/40 mb-3 border border-emerald-400/30">
          <Building2 className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-serif">
          E-PESANTREN 360
        </h1>
        <p className="text-xs sm:text-sm text-emerald-300/90 font-medium mt-1">
          "Satu Sistem untuk Mengelola Seluruh Kehidupan Pesantren"
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-slate-100">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Lembaga / Kode Pesantren
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <select
                  value={tenantCode}
                  onChange={(e) => setTenantCode(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-slate-900 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="darulmusthafa">Pesantren Darul Musthafa Al-Islamiyah (Bogor)</option>
                  <option value="alhidayah">Pondok Pesantren Al-Hidayah Modern (Sukabumi)</option>
                  <option value="madinah">Madinah Boarding School (Malang)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Username / ID Pengguna
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Contoh: direktur / bendahara / ustadz.farisi"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-xs disabled:opacity-50"
              >
                <span>{isLoading ? 'Mengautentikasi...' : 'Masuk ke Sistem (Login)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Pilih Akun Demo Cepat (Klik untuk Isi Otomatis):</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.u}
                  type="button"
                  onClick={() => handleSelectDemo(acc.u, acc.t)}
                  className={`p-2 text-left rounded-lg border text-[11px] transition-all ${
                    username === acc.u
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-400'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="font-bold block truncate">{acc.label}</span>
                  <span className="text-[10px] text-slate-400 block truncate">{acc.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-slate-400">
          <span>Keamanan Terjamin • Isolasi Multi-Tenant Enforced • E-PESANTREN 360</span>
        </div>
      </div>
    </div>
  );
};
