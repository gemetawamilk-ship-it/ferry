import React from 'react';
import { Subject, SubjectType } from '../../types';
import {
  BookOpen,
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  Tag,
  Calendar,
  Layers,
  FileText,
  Edit2,
  Trash2,
} from 'lucide-react';

interface SubjectDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: Subject | null;
  onEdit?: (subject: Subject) => void;
  onDelete?: (subject: Subject) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export const getSubjectTypeBadge = (type: SubjectType) => {
  switch (type) {
    case 'DINIYAH':
      return {
        label: 'Diniyah',
        bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        desc: 'Kurikulum Salaf & Kitab Kuning',
      };
    case 'UMUM':
      return {
        label: 'Umum',
        bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        desc: 'Kurikulum Nasional',
      };
    case 'BAHASA':
      return {
        label: 'Bahasa',
        bg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        desc: 'Bahasa Arab & Asing',
      };
    case 'TAHFIDZ':
      return {
        label: 'Tahfidz',
        bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        desc: 'Al-Qur\'an & Ziyadah',
      };
    case 'KETERAMPILAN':
      return {
        label: 'Keterampilan',
        bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
        desc: 'Vokasi & Muatan Bakat',
      };
    case 'LAINNYA':
    default:
      return {
        label: 'Lainnya',
        bg: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
        desc: 'Muatan Khusus',
      };
  }
};

export const SubjectDetailModal: React.FC<SubjectDetailModalProps> = ({
  isOpen,
  onClose,
  subject,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
}) => {
  if (!isOpen || !subject) return null;

  const typeBadge = getSubjectTypeBadge(subject.type);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-white">{subject.name}</h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded-sm bg-slate-800 border border-slate-700 text-slate-300">
                  {subject.code}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Detail Master Mata Pelajaran & Konfigurasi Kurikulum
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Key Attributes Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <Tag className="w-3.5 h-3.5 text-emerald-400" />
                <span>Jenis Mata Pelajaran</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2.5 py-1 rounded-md border font-medium ${typeBadge.bg}`}>
                  {typeBadge.label}
                </span>
                <span className="text-[11px] text-slate-500">{typeBadge.desc}</span>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>Beban Alokasi JPL</span>
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-bold font-mono text-white">{subject.creditHours}</span>
                <span className="text-xs text-slate-400">JPL / Pekan</span>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Singkatan Ringkas</span>
              </div>
              <div className="text-sm font-semibold font-mono text-slate-200 mt-1">
                {subject.shortName || subject.code}
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Status Keaktifan</span>
              </div>
              <div className="mt-1">
                {subject.status === 'ACTIVE' ? (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    Aktif
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-400 border border-slate-700 font-medium">
                    <AlertCircle className="w-3 h-3" />
                    Tidak Aktif
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Deskripsi & Silabus */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Deskripsi Silabus & Catatan Pengajaran</span>
            </div>
            {subject.description ? (
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                {subject.description}
              </p>
            ) : (
              <p className="text-xs text-slate-500 italic">
                Belum ada deskripsi atau catatan silabus yang dicantumkan untuk mata pelajaran ini.
              </p>
            )}
          </div>

          {/* Phase 3.2 Kurikulum Rombel Readiness Notice */}
          <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-lg p-3.5 flex items-start gap-3">
            <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-emerald-300">
                Kesiapan Integrasi Kurikulum (Phase 3.2)
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                Mata pelajaran ini siap dialokasikan ke dalam kurikulum rombel per tingkat, penetapan guru pengampu, serta penyusunan jadwal KBM mingguan.
              </p>
            </div>
          </div>

          {/* Metadata Footprint */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Dibuat: {new Date(subject.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            <div>
              <span>ID: <code className="font-mono text-slate-400">{subject.id}</code></span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-950/80 border-t border-slate-800">
          <div>
            {canDelete && onDelete && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDelete(subject);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors border border-rose-500/20"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Mata Pelajaran</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Tutup
            </button>
            {canEdit && onEdit && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(subject);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-xs"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Ubah Data</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
