import React, { useState, useEffect } from 'react';
import { User, RoleType, DataScope } from '../../types';
import { X, ShieldAlert } from 'lucide-react';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: any) => Promise<void>;
  userToEdit?: User | null;
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSave,
  userToEdit,
}) => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<RoleType>('PENGAJAR');
  const [scope, setScope] = useState<DataScope>('ASSIGNED');
  const [password, setPassword] = useState('');
  const [assignedEntityName, setAssignedEntityName] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (userToEdit) {
      setFullName(userToEdit.fullName);
      setUsername(userToEdit.username);
      setEmail(userToEdit.email);
      setPhone(userToEdit.phone || '');
      setRole(userToEdit.role);
      setScope(userToEdit.scope);
      setPassword(''); // keep blank if not changing
      setAssignedEntityName(userToEdit.assignedEntityName || '');
      setStatus(userToEdit.status);
    } else {
      setFullName('');
      setUsername('');
      setEmail('');
      setPhone('');
      setRole('PENGAJAR');
      setScope('ASSIGNED');
      setPassword('password123');
      setAssignedEntityName('Kelas 3A Aliyah');
      setStatus('ACTIVE');
    }
    setError(null);
  }, [userToEdit, isOpen]);

  // Sync default scope when role changes
  const handleRoleChange = (newRole: RoleType) => {
    setRole(newRole);
    switch (newRole) {
      case 'SUPER_ADMIN':
      case 'DIREKTUR':
      case 'ADMIN':
      case 'BENDAHARA':
        setScope('GLOBAL');
        break;
      case 'MANAGER':
        setScope('DEPARTMENT');
        break;
      case 'PENGAJAR':
      case 'MUSYRIF':
        setScope('ASSIGNED');
        break;
      case 'KARYAWAN':
      case 'SANTRI':
        setScope('OWN');
        break;
      case 'WALI_SANTRI':
        setScope('CHILD');
        break;
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !username.trim() || !email.trim()) {
      setError('Nama lengkap, username, dan email wajib diisi.');
      return;
    }

    if (!userToEdit && !password) {
      setError('Kata sandi wajib diisi untuk akun baru.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        fullName: fullName.trim(),
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        role,
        scope,
        password: password || undefined,
        assignedEntityName: assignedEntityName.trim() || undefined,
        status,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan data pengguna.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base">
            {userToEdit ? 'Ubah Data Pengguna' : 'Tambah Pengguna Baru'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Nama Lengkap & Gelar *</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Contoh: Ustadz Muhammad Yusuf, Lc."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Username Akun *</label>
              <input
                type="text"
                required
                disabled={!!userToEdit}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ustadz.yusuf"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-xs disabled:bg-slate-100"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">No. WhatsApp / HP</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+62 812 3456 7890"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Alamat Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="yusuf@darulmusthafa.sch.id"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Role / Peran *</label>
              <select
                value={role}
                onChange={(e) => handleRoleChange(e.target.value as RoleType)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-xs bg-white"
              >
                <option value="DIREKTUR">Direktur (Pimpinan)</option>
                <option value="MANAGER">Manager Operasional</option>
                <option value="ADMIN">Administrator</option>
                <option value="BENDAHARA">Bendahara</option>
                <option value="PENGAJAR">Guru / Pengajar</option>
                <option value="MUSYRIF">Musyrif Asrama</option>
                <option value="KARYAWAN">Karyawan / Staf</option>
                <option value="SANTRI">Santri</option>
                <option value="WALI_SANTRI">Wali Santri</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Cakupan Data (Scope) *</label>
              <select
                value={scope}
                onChange={(e) => setScope(e.target.value as DataScope)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-xs bg-white"
              >
                <option value="GLOBAL">GLOBAL (Semua Pesantren)</option>
                <option value="DEPARTMENT">DEPARTMENT (Divisi)</option>
                <option value="ASSIGNED">ASSIGNED (Kelas/Asrama Binaan)</option>
                <option value="OWN">OWN (Data Sendiri)</option>
                <option value="CHILD">CHILD (Data Anak Santri)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Entitas Yang Ditugaskan / Keterangan</label>
            <input
              type="text"
              value={assignedEntityName}
              onChange={(e) => setAssignedEntityName(e.target.value)}
              placeholder="Contoh: Kelas 3A Aliyah / Asrama Umar Kamar 01-08 / Santri Ahmad"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-xs"
            />
          </div>

          {!userToEdit && (
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Kata Sandi Awal *</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-xs"
              />
            </div>
          )}

          {userToEdit && (
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Status Akun</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'ACTIVE' | 'INACTIVE')}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-xs bg-white"
              >
                <option value="ACTIVE">ACTIVE (Aktif Dapat Login)</option>
                <option value="INACTIVE">INACTIVE (Dinonaktifkan / Soft Delete)</option>
              </select>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? 'Menyimpan...' : userToEdit ? 'Simpan Perubahan' : 'Tambah Pengguna'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
