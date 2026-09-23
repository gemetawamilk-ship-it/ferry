import React, { useState } from 'react';
import { Student, Parent, StudentParentRelationship } from '../../types';
import {
  X,
  UserCheck,
  GraduationCap,
  BedDouble,
  HeartHandshake,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Plus,
  Trash2,
  AlertCircle,
  Edit3,
  Link2,
  Unlink,
} from 'lucide-react';

interface StudentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  allParents: Parent[];
  onEditStudent: (student: Student) => void;
  onManageRoom: (student: Student) => void;
  onLinkUser: (student: Student) => void;
  onUnlinkUser: (studentId: string) => Promise<void>;
  onAddParent: (
    studentId: string,
    data: {
      parentId: string;
      relationship: StudentParentRelationship;
      isPrimaryContact?: boolean;
      isEmergencyContact?: boolean;
    }
  ) => Promise<void>;
  onRemoveParent: (studentId: string, parentId: string) => Promise<void>;
  hasPermission: (perm: string) => boolean;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  isOpen,
  onClose,
  student,
  allParents,
  onEditStudent,
  onManageRoom,
  onLinkUser,
  onUnlinkUser,
  onAddParent,
  onRemoveParent,
  hasPermission,
}) => {
  const [activeTab, setActiveTab] = useState<'biodata' | 'kamar' | 'wali' | 'akun'>('biodata');
  const [showAddParentForm, setShowAddParentForm] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState('');
  const [relationship, setRelationship] = useState<StudentParentRelationship>('AYAH');
  const [isPrimaryContact, setIsPrimaryContact] = useState(true);
  const [isEmergencyContact, setIsEmergencyContact] = useState(true);
  const [savingParent, setSavingParent] = useState(false);
  const [parentError, setParentError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddParentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setParentError(null);
    if (!selectedParentId) {
      setParentError('Silakan pilih data wali santri.');
      return;
    }

    setSavingParent(true);
    try {
      await onAddParent(student.id, {
        parentId: selectedParentId,
        relationship,
        isPrimaryContact,
        isEmergencyContact,
      });
      setShowAddParentForm(false);
      setSelectedParentId('');
    } catch (err: any) {
      setParentError(err.message || 'Gagal menghubungkan wali santri.');
    } finally {
      setSavingParent(false);
    }
  };

  const handleRemoveParentClick = async (parentId: string, parentName: string) => {
    if (!window.confirm(`Yakin ingin memutus relasi wali ${parentName} dari santri ini?`)) {
      return;
    }
    try {
      await onRemoveParent(student.id, parentId);
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus relasi wali.');
    }
  };

  const handleUnlinkUserClick = async () => {
    if (!window.confirm(`Yakin ingin mencabut tautan akun login untuk santri ${student.fullName}?`)) {
      return;
    }
    try {
      await onUnlinkUser(student.id);
    } catch (err: any) {
      alert(err.message || 'Gagal mencabut tautan akun.');
    }
  };

  // Filter out parents who are already linked
  const alreadyLinkedParentIds = new Set(student.parents?.map((p) => p.parentId) || []);
  const availableParents = allParents.filter((p) => !alreadyLinkedParentIds.has(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with profile banner */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white flex items-start justify-between border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-black text-2xl flex items-center justify-center shadow-lg border border-emerald-400/30">
              {student.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">{student.fullName}</h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    student.status === 'ACTIVE'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : student.status === 'GRADUATED'
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}
                >
                  {student.status}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                NIS: <span className="font-mono font-bold text-emerald-400">{student.nis}</span>
                {student.nisn ? ` • NISN: ${student.nisn}` : ''} •{' '}
                {student.gender === 'LAKI_LAKI' ? 'Santri Putra' : 'Santri Putri'}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {student.program?.name || 'Program Umum'} • Masuk: {student.admissionDate}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {hasPermission('student.update') && (
              <button
                onClick={() => onEditStudent(student)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="Edit Biodata"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-6 text-xs font-bold">
          {[
            { id: 'biodata', label: 'Biodata Santri', icon: UserCheck },
            { id: 'kamar', label: `Asrama & Kamar (${student.currentRoom ? 'Ada' : 'Kosong'})`, icon: BedDouble },
            { id: 'wali', label: `Wali Santri (${student.parents?.length || 0})`, icon: HeartHandshake },
            { id: 'akun', label: `Akun Login (${student.userId ? 'Aktif' : 'Belum'})`, icon: ShieldCheck },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`py-3 flex items-center gap-2 border-b-2 transition-colors ${
                  activeTab === t.id
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 text-sm">
          {/* TAB 1: BIODATA */}
          {activeTab === 'biodata' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <p className="text-xs text-slate-500">Nama Lengkap</p>
                  <p className="font-semibold text-slate-900">{student.fullName}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Nama Panggilan</p>
                  <p className="font-semibold text-slate-900">{student.nickname || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Nomor Induk Santri (NIS)</p>
                  <p className="font-mono font-bold text-slate-900">{student.nis}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">NISN / NIK</p>
                  <p className="font-mono text-slate-900">
                    {student.nisn || '-'} / {student.nik || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Jenis Kelamin</p>
                  <p className="font-semibold text-slate-900">
                    {student.gender === 'LAKI_LAKI' ? 'Laki-laki (Putra / Ikhwan)' : 'Perempuan (Putri / Akhwat)'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Tempat, Tanggal Lahir</p>
                  <p className="font-semibold text-slate-900">
                    {student.birthPlace || '-'}, {student.birthDate || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Program Pendidikan</p>
                  <p className="font-semibold text-emerald-800">{student.program?.name || 'Belum Ditentukan'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Tahun Ajaran Masuk</p>
                  <p className="font-semibold text-slate-900">{student.academicYear?.name || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Tanggal Masuk Pesantren</p>
                  <p className="font-semibold text-slate-900">{student.admissionDate}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Status Keaktifan</p>
                  <span className="inline-block px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800">
                    {student.status}
                  </span>
                </div>
              </div>

              {/* Contact info */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Kontak & Domisili Santri
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">No. HP / Telepon</p>
                      <p className="font-medium text-slate-800">{student.phone || '-'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Email</p>
                      <p className="font-medium text-slate-800">{student.email || '-'}</p>
                    </div>
                  </div>
                  <div className="sm:col-span-2 flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 mt-1" />
                    <div>
                      <p className="text-xs text-slate-500">Alamat Lengkap</p>
                      <p className="font-medium text-slate-800">{student.address || '-'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {student.notes && (
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Catatan Tambahan
                  </h4>
                  <p className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700">
                    {student.notes}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: KAMAR & ASRAMA */}
          {activeTab === 'kamar' && (
            <div className="space-y-6">
              {/* Current Room */}
              <div className="p-5 rounded-xl border border-teal-200 bg-teal-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
                    <BedDouble className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-teal-800 uppercase tracking-wider">
                      Penempatan Kamar Saat Ini
                    </p>
                    {student.currentRoom ? (
                      <div>
                        <h4 className="text-base font-black text-slate-900">{student.currentRoom.name}</h4>
                        <p className="text-xs text-slate-600">
                          {student.currentRoom.dormitoryName || 'Asrama'} •{' '}
                          {student.currentRoom.buildingName || 'Gedung'} • Peruntukan:{' '}
                          {student.currentRoom.genderType === 'PUTRA' ? 'Santri Putra' : 'Santri Putri'}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm font-semibold text-slate-600 mt-0.5">
                        Belum ditempatkan di kamar asrama manapun.
                      </p>
                    )}
                  </div>
                </div>

                {hasPermission('student.room_assign') && (
                  <button
                    onClick={() => onManageRoom(student)}
                    className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <BedDouble className="w-4 h-4" />
                    <span>{student.currentRoom ? 'Pindah Kamar' : 'Tetapkan Kamar'}</span>
                  </button>
                )}
              </div>

              {/* Room Histories */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span>Riwayat Penempatan Kamar (Historis)</span>
                </h4>
                {(!student.roomHistories || student.roomHistories.length === 0) ? (
                  <p className="text-xs text-slate-400 py-4 text-center bg-slate-50 rounded-xl border border-slate-200">
                    Belum ada riwayat mutasi/penempatan kamar untuk santri ini.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {student.roomHistories.map((hist) => (
                      <div
                        key={hist.id}
                        className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-bold text-slate-900">{hist.room?.name || 'Kamar'}</p>
                          <p className="text-slate-500">
                            {hist.room?.dormitoryName || 'Asrama'} • {hist.room?.buildingName || 'Gedung'}
                          </p>
                          {hist.notes && <p className="text-slate-400 text-[11px] mt-0.5">Catatan: {hist.notes}</p>}
                        </div>
                        <div className="text-right">
                          <span
                            className={`px-2 py-0.5 rounded-full font-semibold ${
                              !hist.checkOutDate
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {!hist.checkOutDate ? 'Aktif Menempati' : 'Selesai'}
                          </span>
                          <p className="text-slate-400 text-[10px] mt-1">
                            Masuk: {hist.checkInDate}
                            {hist.checkOutDate ? ` • Keluar: ${hist.checkOutDate}` : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: WALI SANTRI */}
          {activeTab === 'wali' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Daftar Wali & Orang Tua Terhubung
                  </h4>
                  <p className="text-xs text-slate-500">
                    Satu santri dapat memiliki beberapa kontak wali (Ayah, Ibu, atau Wali).
                  </p>
                </div>
                {hasPermission('student.update') && !showAddParentForm && (
                  <button
                    onClick={() => setShowAddParentForm(true)}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Hubungkan Wali</span>
                  </button>
                )}
              </div>

              {/* Add Parent Form */}
              {showAddParentForm && (
                <form
                  onSubmit={handleAddParentSubmit}
                  className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-emerald-900">Hubungkan Data Wali Santri</h5>
                    <button
                      type="button"
                      onClick={() => setShowAddParentForm(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {parentError && (
                    <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                      {parentError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Pilih Wali Santri <span className="text-rose-500">*</span>
                      </label>
                      <select
                        required
                        value={selectedParentId}
                        onChange={(e) => setSelectedParentId(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                      >
                        <option value="">-- Pilih dari Master Wali --</option>
                        {availableParents.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.fullName} ({p.relationshipType} • {p.phone})
                          </option>
                        ))}
                      </select>
                      {availableParents.length === 0 && (
                        <p className="text-[11px] text-amber-600 mt-1">
                          Semua wali di master data sudah terhubung, atau belum ada data wali.
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Hubungan dengan Santri Ini <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={relationship}
                        onChange={(e) => setRelationship(e.target.value as StudentParentRelationship)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                      >
                        <option value="AYAH">Ayah Kandung</option>
                        <option value="IBU">Ibu Kandung</option>
                        <option value="WALI">Wali Pengasuh</option>
                        <option value="KAKAK">Kakak Kandung</option>
                        <option value="KAKEK">Kakek</option>
                        <option value="NENEK">Nenek</option>
                        <option value="PAMEN">Paman / Bibi</option>
                        <option value="LAINNYA">Lainnya</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-4 sm:col-span-2 pt-1">
                      <label className="flex items-center gap-1.5 text-xs text-slate-700 font-medium cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isPrimaryContact}
                          onChange={(e) => setIsPrimaryContact(e.target.checked)}
                          className="rounded text-emerald-600"
                        />
                        <span>Kontak Utama (Primary)</span>
                      </label>
                      <label className="flex items-center gap-1.5 text-xs text-slate-700 font-medium cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isEmergencyContact}
                          onChange={(e) => setIsEmergencyContact(e.target.checked)}
                          className="rounded text-emerald-600"
                        />
                        <span>Kontak Darurat (Emergency)</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddParentForm(false)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={savingParent || !selectedParentId}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg"
                    >
                      {savingParent ? 'Menyimpan...' : 'Hubungkan'}
                    </button>
                  </div>
                </form>
              )}

              {/* Linked parents list */}
              {(!student.parents || student.parents.length === 0) ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200">
                  <HeartHandshake className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">Belum ada wali santri yang terhubung.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {student.parents.map((sp) => {
                    const p = sp.parent;
                    return (
                      <div
                        key={sp.id}
                        className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-4 shadow-xs"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-sm">
                            {p?.fullName.charAt(0) || 'W'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="font-bold text-slate-900 text-sm">{p?.fullName || 'Data Wali'}</h5>
                              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                                {sp.relationship}
                              </span>
                              {sp.isPrimaryContact && (
                                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                                  Kontak Utama
                                </span>
                              )}
                              {sp.isEmergencyContact && (
                                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-800">
                                  Darurat
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                              HP: <span className="font-medium text-slate-700">{p?.phone || '-'}</span>
                              {p?.email ? ` • Email: ${p.email}` : ''}
                              {p?.occupation ? ` • Pekerjaan: ${p.occupation}` : ''}
                            </p>
                            {p?.address && <p className="text-xs text-slate-400 mt-0.5">Alamat: {p.address}</p>}
                          </div>
                        </div>

                        {hasPermission('student.update') && (
                          <button
                            onClick={() => handleRemoveParentClick(sp.parentId, p?.fullName || 'Wali')}
                            title="Putus Hubungan Wali"
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: AKUN LOGIN PORTAL SANTRI */}
          {activeTab === 'akun' && (
            <div className="space-y-4">
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
                        student.user ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Status Akun Pengguna Pesantren
                      </p>
                      {student.user ? (
                        <div>
                          <h4 className="text-base font-bold text-slate-900">{student.user.fullName}</h4>
                          <p className="text-xs text-slate-600">
                            Username: <strong className="font-mono text-emerald-700">{student.user.username}</strong> •
                            Role: <strong className="text-slate-800">{student.user.role}</strong>
                          </p>
                          <p className="text-xs text-slate-500">{student.user.email}</p>
                        </div>
                      ) : (
                        <p className="text-sm font-semibold text-slate-600 mt-0.5">
                          Santri ini belum ditautkan dengan akun login pengguna manapun.
                        </p>
                      )}
                    </div>
                  </div>

                  {hasPermission('student.link_user') && (
                    <div>
                      {student.user ? (
                        <button
                          onClick={handleUnlinkUserClick}
                          className="px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg flex items-center gap-1.5 transition-colors"
                        >
                          <Unlink className="w-3.5 h-3.5" />
                          <span>Lepas Tautan Akun</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onLinkUser(student)}
                          className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
                        >
                          <Link2 className="w-4 h-4" />
                          <span>Tautkan Akun Login</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-800 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  Prinsip Arsitektur E-Pesantren 360:
                </p>
                <p>
                  Entity <strong>Student</strong> adalah master data kesiswaan dan <strong>BUKAN</strong> akun login.
                  Pemisahan ini menjamin santri dapat didaftarkan tanpa harus membuat username/password, dan sewaktu-waktu dapat
                  ditautkan dengan akun pengguna ber-role <code>SANTRI</code> untuk mengakses portal santri.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
