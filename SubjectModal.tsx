import React, { useState, useEffect } from 'react';
import { Subject, SubjectType, SubjectStatus } from '../../types';
import { BookOpen, X, AlertCircle } from 'lucide-react';

interface SubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    code: string;
    name: string;
    shortName: string;
    type: SubjectType;
    creditHours: number;
    status: SubjectStatus;
    description?: string | null;
  }) => Promise<void>;
  subject?: Subject | null;
}

const SUBJECT_TYPES: { value: SubjectType; label: string; desc: string }[] = [
  { value: 'DINIYAH', label: 'Diniyah (Salaf / Turats)', desc: 'Kajian kitab kuning, aqidah, fiqih, nahwu, hadits' },
  { value: 'UMUM', label: 'Umum (Nasional)', desc: 'Kurikulum Kemendikbud/Kemenag seperti Matematika, IPA, IPS' },
  { value: 'BAHASA', label: 'Bahasa (Arab & Asing)', desc: 'Bahasa Arab percakapan, grammar, dan bahasa asing lainnya' },
  { value: 'TAHFIDZ', label: 'Tahfidz Al-Qur\'an', desc: 'Halaqah ziyadah setoran hafalan dan muraja\'ah' },
  { value: 'KETERAMPILAN', label: 'Keterampilan & Vokasi', desc: 'Kaligrafi, hadrah, kepanduan, dan teknologi informasi' },
  { value: 'LAINNYA', label: 'Lainnya', desc: 'Muatan lokal pesantren dan kegiatan terpadu' },
];

export const SubjectModal: React.FC<SubjectModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  subject,
}) => {
  const isEditing = Boolean(subject);

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [type, setType] = useState<SubjectType>('DINIYAH');
  const [creditHours, setCreditHours] = useState<number>(2);
  const [status, setStatus] = useState<SubjectStatus>('ACTIVE');
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (subject) {
      setCode(subject.code || '');
      setName(subject.name || '');
      setShortName(subject.shortName || subject.code || '');
      setType(subject.type || 'DINIYAH');
      setCreditHours(subject.creditHours || 2);
      setStatus(subject.status || 'ACTIVE');
      setDescription(subject.description || '');
    } else {
      setCode('');
      setName('');
      setShortName('');
      setType('DINIYAH');
      setCreditHours(2);
      setStatus('ACTIVE');
      setDescription('');
    }
    setError(null);
  }, [subject, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanCode = code.trim().toUpperCase();
    const cleanName = name.trim();
    const cleanShortName = (shortName.trim() || cleanCode).toUpperCase();
    const cleanCredit = Number(creditHours);

    if (!cleanCode) {
      setError('Kode mata pelajaran wajib diisi.');
      return;
    }

    if (!cleanName) {
      setError('Nama mata pelajaran wajib diisi.');
      return;
    }

    if (!cleanCredit || cleanCredit <= 0) {
      setError('Jumlah JPL harus berupa angka positif lebih dari 0.');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        code: cleanCode,
        name: cleanName,
        shortName: cleanShortName,
        type,
        creditHours: cleanCredit,
        status,
        description: description.trim() ? description.trim() : null,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan mata pelajaran.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                {isEditing ? 'Ubah Data Mata Pelajaran' : 'Tambah Mata Pelajaran Baru'}
              </h3>
              <p className="text-xs text-slate-400">
                {isEditing
                  ? `Memperbarui konfigurasi silabus untuk ${subject?.name}`
                  : 'Daftarkan mata pelajaran ke dalam kurikulum pembelajaran'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-start gap-2.5 text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Kode Mata Pelajaran */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Kode Mata Pelajaran <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Contoh: NWH, FIQ, MTK"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono uppercase"
                required
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Kode unik dalam tenant (huruf kapital & tanda strip)
              </span>
            </div>

            {/* Singkatan */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Singkatan Label <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
                placeholder="Contoh: NWH, FIQ, ARAB"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 uppercase"
                required
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Digunakan pada tabel jadwal KBM ringkas
              </span>
            </div>
          </div>

          {/* Nama Mata Pelajaran */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Nama Mata Pelajaran <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!shortName && !isEditing) {
                  setShortName(e.target.value.substring(0, 6).toUpperCase());
                }
              }}
              placeholder="Contoh: Nahwu, Fiqih Ibadah, Bahasa Arab"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Jenis Mata Pelajaran */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Jenis / Kategori <span className="text-rose-400">*</span>
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as SubjectType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                {SUBJECT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Klasifikasi bidang studi kurikulum
              </span>
            </div>

            {/* Beban Jam Pelajaran (JPL) */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Beban JPL (Jam/Minggu) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="24"
                value={creditHours}
                onChange={(e) => setCreditHours(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                required
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Alokasi tatap muka KBM per pekan (minimal 1 JPL)
              </span>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Status Keaktifan
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors ${
                  status === 'ACTIVE'
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="ACTIVE"
                  checked={status === 'ACTIVE'}
                  onChange={() => setStatus('ACTIVE')}
                  className="text-emerald-500 focus:ring-emerald-500/30"
                />
                <div>
                  <div className="text-xs font-semibold">Aktif</div>
                  <div className="text-[10px] text-slate-400">Siap dialokasikan pada kurikulum & jadwal</div>
                </div>
              </label>

              <label
                className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors ${
                  status === 'INACTIVE'
                    ? 'bg-slate-800/40 border-slate-600 text-slate-200'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="INACTIVE"
                  checked={status === 'INACTIVE'}
                  onChange={() => setStatus('INACTIVE')}
                  className="text-slate-500 focus:ring-slate-500/30"
                />
                <div>
                  <div className="text-xs font-semibold">Tidak Aktif</div>
                  <div className="text-[10px] text-slate-400">Ditangguhkan / tidak diajarkan periode ini</div>
                </div>
              </label>
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Deskripsi Silabus / Catatan <span className="text-slate-500 text-[11px]">(Opsional)</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: Rujukan kitab Jurumiyyah & Imrithi, materi mencakup kalam, i'rab, dan pembagian isim/fi'il."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-colors flex items-center gap-2"
            >
              {loading && <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              <span>{isEditing ? 'Simpan Perubahan' : 'Tambah Mata Pelajaran'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
