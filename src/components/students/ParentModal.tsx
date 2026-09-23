import React, { useState, useEffect } from 'react';
import { Parent, ParentRelationshipType } from '../../types';
import { X, Save, AlertCircle, HeartHandshake } from 'lucide-react';

interface ParentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Parent>) => Promise<void>;
  parent?: Parent | null;
}

export const ParentModal: React.FC<ParentModalProps> = ({ isOpen, onClose, onSave, parent }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    relationshipType: 'AYAH' as ParentRelationshipType,
    phone: '',
    email: '',
    nik: '',
    occupation: '',
    address: '',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (parent) {
      setFormData({
        fullName: parent.fullName || '',
        relationshipType: parent.relationshipType || 'AYAH',
        phone: parent.phone || '',
        email: parent.email || '',
        nik: parent.nik || '',
        occupation: parent.occupation || '',
        address: parent.address || '',
      });
    } else {
      setFormData({
        fullName: '',
        relationshipType: 'AYAH',
        phone: '',
        email: '',
        nik: '',
        occupation: '',
        address: '',
      });
    }
    setError(null);
  }, [parent, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.fullName.trim()) {
      setError('Nama lengkap wali santri wajib diisi.');
      return;
    }
    if (!formData.phone.trim()) {
      setError('Nomor telepon/WhatsApp wajib diisi.');
      return;
    }

    setSaving(true);
    try {
      await onSave({
        fullName: formData.fullName.trim(),
        relationshipType: formData.relationshipType,
        phone: formData.phone.trim(),
        email: formData.email.trim() || null,
        nik: formData.nik.trim() || null,
        occupation: formData.occupation.trim() || null,
        address: formData.address.trim() || null,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan data wali santri.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {parent ? 'Edit Data Wali Santri' : 'Tambah Wali Santri Baru'}
              </h3>
              <p className="text-xs text-slate-300">
                {parent ? `Perbarui data untuk ${parent.fullName}` : 'Registrasi data orang tua / wali santri'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Lengkap Wali / Orang Tua <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Drs. H. Muhammad Ridwan"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hubungan Keluarga <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.relationshipType}
                onChange={(e) => setFormData({ ...formData, relationshipType: e.target.value as ParentRelationshipType })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-semibold"
              >
                <option value="AYAH">Ayah</option>
                <option value="IBU">Ibu</option>
                <option value="WALI">Wali</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor Telepon / WhatsApp <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="Contoh: 08123456789"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="wali@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">NIK (KTP)</label>
              <input
                type="text"
                placeholder="16 digit nomor NIK"
                value={formData.nik}
                onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pekerjaan</label>
              <input
                type="text"
                placeholder="Contoh: Wiraswasta / Pegawai Negeri / Dokter"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Domisili</label>
              <textarea
                rows={2}
                placeholder="Alamat rumah lengkap"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg flex items-center gap-2 shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Menyimpan...' : parent ? 'Simpan Perubahan' : 'Daftarkan Wali'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
