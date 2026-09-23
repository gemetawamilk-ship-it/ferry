import React, { useState, useEffect } from 'react';
import { Student, Program, AcademicYear, Room, StudentGender, StudentStatus } from '../../types';
import { X, Save, AlertCircle, BedDouble, Calendar, UserCheck } from 'lucide-react';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Student>) => Promise<void>;
  student?: Student | null;
  programs: Program[];
  academicYears: AcademicYear[];
  rooms: Room[];
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  student,
  programs,
  academicYears,
  rooms,
}) => {
  const [formData, setFormData] = useState({
    nis: '',
    nisn: '',
    nik: '',
    fullName: '',
    nickname: '',
    gender: 'LAKI_LAKI' as StudentGender,
    birthPlace: '',
    birthDate: '',
    phone: '',
    email: '',
    address: '',
    admissionDate: new Date().toISOString().split('T')[0],
    status: 'ACTIVE' as StudentStatus,
    programId: '',
    academicYearId: '',
    currentRoomId: '',
    notes: '',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (student) {
      setFormData({
        nis: student.nis || '',
        nisn: student.nisn || '',
        nik: student.nik || '',
        fullName: student.fullName || '',
        nickname: student.nickname || '',
        gender: student.gender || 'LAKI_LAKI',
        birthPlace: student.birthPlace || '',
        birthDate: student.birthDate || '',
        phone: student.phone || '',
        email: student.email || '',
        address: student.address || '',
        admissionDate: student.admissionDate || new Date().toISOString().split('T')[0],
        status: student.status || 'ACTIVE',
        programId: student.programId || '',
        academicYearId: student.academicYearId || '',
        currentRoomId: student.currentRoomId || '',
        notes: student.notes || '',
      });
    } else {
      setFormData({
        nis: '',
        nisn: '',
        nik: '',
        fullName: '',
        nickname: '',
        gender: 'LAKI_LAKI',
        birthPlace: '',
        birthDate: '',
        phone: '',
        email: '',
        address: '',
        admissionDate: new Date().toISOString().split('T')[0],
        status: 'ACTIVE',
        programId: programs[0]?.id || '',
        academicYearId: academicYears[0]?.id || '',
        currentRoomId: '',
        notes: '',
      });
    }
    setError(null);
  }, [student, isOpen, programs, academicYears]);

  if (!isOpen) return null;

  // Filter rooms matching selected gender
  const expectedRoomGender = formData.gender === 'LAKI_LAKI' ? 'PUTRA' : 'PUTRI';
  const availableRooms = rooms.filter((r) => r.genderType === expectedRoomGender && r.status === 'ACTIVE');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.nis.trim()) {
      setError('Nomor Induk Santri (NIS) wajib diisi.');
      return;
    }
    if (!formData.fullName.trim()) {
      setError('Nama lengkap santri wajib diisi.');
      return;
    }
    if (!formData.admissionDate) {
      setError('Tanggal masuk pesantren wajib diisi.');
      return;
    }

    setSaving(true);
    try {
      await onSave({
        nis: formData.nis.trim(),
        nisn: formData.nisn.trim() || null,
        nik: formData.nik.trim() || null,
        fullName: formData.fullName.trim(),
        nickname: formData.nickname.trim() || null,
        gender: formData.gender,
        birthPlace: formData.birthPlace.trim() || null,
        birthDate: formData.birthDate || null,
        phone: formData.phone.trim() || null,
        email: formData.email.trim() || null,
        address: formData.address.trim() || null,
        admissionDate: formData.admissionDate,
        status: formData.status,
        programId: formData.programId || null,
        academicYearId: formData.academicYearId || null,
        // Only allow room set during create if selected
        ...(student ? {} : { currentRoomId: formData.currentRoomId || null }),
        notes: formData.notes.trim() || null,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan data santri.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {student ? 'Edit Biodata Santri' : 'Tambah Santri Baru'}
              </h3>
              <p className="text-xs text-slate-300">
                {student
                  ? `Memperbarui data santri NIS: ${student.nis}`
                  : 'Registrasi santri baru ke dalam sistem pesantren'}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Identitas Pokok */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider pb-1 border-b border-slate-100">
              Identitas Pokok Santri
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor Induk Santri (NIS) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 2026001"
                  value={formData.nis}
                  onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  NISN (Nasional)
                </label>
                <input
                  type="text"
                  placeholder="10 digit nomor NISN"
                  value={formData.nisn}
                  onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap Santri <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nama lengkap sesuai dokumen kependudukan"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Panggilan
                </label>
                <input
                  type="text"
                  placeholder="Nama panggilan santri"
                  value={formData.nickname}
                  onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jenis Kelamin <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      gender: e.target.value as StudentGender,
                      currentRoomId: '', // Reset room if gender changed
                    })
                  }
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="LAKI_LAKI">Laki-laki (Santri Putra / Ikhwan)</option>
                  <option value="PEREMPUAN">Perempuan (Santri Putri / Akhwat)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  NIK (KTP / KK)
                </label>
                <input
                  type="text"
                  placeholder="16 digit NIK"
                  value={formData.nik}
                  onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Status Santri
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as StudentStatus })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold"
                >
                  <option value="ACTIVE">AKTIF (Aktif Belajar)</option>
                  <option value="GRADUATED">LULUS (Alumni)</option>
                  <option value="SUSPENDED">SKORSING (Masa Disiplin)</option>
                  <option value="MUTASI">MUTASI (Pindah Sekolah/Pesantren)</option>
                  <option value="DROPOUT">DROP OUT (Berhenti)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Program & Tahun Masuk */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider pb-1 border-b border-slate-100">
              Program Pendidikan & Tahun Masuk
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Program Pendidikan
                </label>
                <select
                  value={formData.programId}
                  onChange={(e) => setFormData({ ...formData, programId: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="">-- Pilih Program --</option>
                  {programs.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tahun Ajaran Masuk
                </label>
                <select
                  value={formData.academicYearId}
                  onChange={(e) => setFormData({ ...formData, academicYearId: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="">-- Pilih Tahun Ajaran --</option>
                  {academicYears.map((ay) => (
                    <option key={ay.id} value={ay.id}>
                      {ay.name} {ay.isActive ? '(Aktif)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tanggal Masuk <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.admissionDate}
                  onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Room Assignment on create */}
            {!student && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Penempatan Kamar Awal (Opsional)
                </label>
                <div className="relative">
                  <select
                    value={formData.currentRoomId}
                    onChange={(e) => setFormData({ ...formData, currentRoomId: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    <option value="">-- Belum Ditempatkan di Kamar --</option>
                    {availableRooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} (Kamar {r.genderType === 'PUTRA' ? 'Putra' : 'Putri'} | Kapasitas: {r.capacity} santri)
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  * Hanya menampilkan kamar peruntukan {formData.gender === 'LAKI_LAKI' ? 'Putra' : 'Putri'} yang masih tersedia.
                </p>
              </div>
            )}
          </div>

          {/* Section 3: Data Kontak & Domisili */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider pb-1 border-b border-slate-100">
              Tempat Lahir & Kontak Santri
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tempat Lahir</label>
                <input
                  type="text"
                  placeholder="Kota / Kabupaten Lahir"
                  value={formData.birthPlace}
                  onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Lahir</label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor Telepon / HP</label>
                <input
                  type="tel"
                  placeholder="Contoh: 08123456789"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="email@santri.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Asal</label>
                <textarea
                  rows={2}
                  placeholder="Alamat domisili lengkap santri / orang tua"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Catatan Tambahan</label>
                <input
                  type="text"
                  placeholder="Catatan riwayat kesehatan, prestasi, atau informasi penting lainnya"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
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
              className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg flex items-center gap-2 shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Menyimpan...' : student ? 'Simpan Perubahan' : 'Daftarkan Santri'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
