import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Institution } from '../../types';
import {
  Building2,
  Edit3,
  Save,
  X,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  Globe,
  Award,
  Calendar,
  User,
  FileText,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export const InstitutionProfileView: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Institution>>({});
  const [logoPreview, setLogoPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canEdit = hasPermission('institution.update');

  const fetchInstitution = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await api.getInstitution();
      if (res.success && res.data) {
        setInstitution(res.data);
        setFormData(res.data);
        setLogoPreview(res.data.logoUrl || '');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal memuat profil lembaga pesantren.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstitution();
  }, [user?.tenantId]);

  const handleInputChange = (field: keyof Institution, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorMessage('Ukuran file logo maksimal 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoPreview(result);
        setFormData((prev) => ({ ...prev, logoUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    if (institution) {
      setFormData(institution);
      setLogoPreview(institution.logoUrl || '');
    }
    setIsEditing(false);
    setErrorMessage(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Frontend validation
    if (!formData.name || formData.name.trim().length < 3) {
      setErrorMessage('Nama pesantren wajib diisi (minimal 3 karakter).');
      return;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage('Format alamat email resmi tidak valid.');
      return;
    }

    if (
      formData.foundedYear &&
      (isNaN(Number(formData.foundedYear)) ||
        Number(formData.foundedYear) < 1900 ||
        Number(formData.foundedYear) > new Date().getFullYear())
    ) {
      setErrorMessage(`Tahun berdiri harus antara 1900 dan ${new Date().getFullYear()}.`);
      return;
    }

    setSaving(true);
    try {
      const res = await api.updateInstitution(formData);
      if (res.success) {
        setInstitution(res.data);
        setFormData(res.data);
        setIsEditing(false);
        setSuccessToast('Data profil lembaga berhasil diperbarui dan dicatat ke Audit Trail.');
        setTimeout(() => setSuccessToast(null), 4000);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal menyimpan perubahan data lembaga.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-16">
        <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-emerald-700 text-white px-5 py-3 rounded-xl shadow-xl animate-fade-in border border-emerald-500">
          <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
          <span className="text-sm font-medium">{successToast}</span>
        </div>
      )}

      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <span>E-PESANTREN 360</span>
            <span>/</span>
            <span>Master Data</span>
            <span>/</span>
            <span className="text-emerald-700 font-semibold">Data Lembaga</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Building2 className="w-7 h-7 text-emerald-600" />
            <span>Profil Lembaga Pesantren</span>
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Informasi legalitas resmi, identitas pimpinan, kontak administratif, dan alamat pesantren.
          </p>
        </div>

        {canEdit && !isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow-xs transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            <span>Ubah Data Lembaga</span>
          </button>
        )}
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{errorMessage}</div>
          <button onClick={() => setErrorMessage(null)} className="text-rose-500 hover:text-rose-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Form or View Container */}
      <form onSubmit={handleSave}>
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950 p-6 sm:p-8 text-white relative">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Logo Box & Upload */}
              <div className="relative group">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-white p-2.5 shadow-xl border-2 border-white/20 flex items-center justify-center overflow-hidden shrink-0">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo Pesantren"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-center p-2">
                      <ImageIcon className="w-10 h-10 text-slate-400 mx-auto mb-1" />
                      <span className="text-[11px] text-slate-500 font-medium">Belum ada logo</span>
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="mt-2 text-center">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleLogoFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-md font-medium inline-flex items-center gap-1.5 shadow-xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Logo</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Title Header Details */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Lembaga Terverifikasi
                  </span>
                  {institution?.foundedYear && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-slate-300">
                      Berdiri sejak {institution.foundedYear}
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  {formData.name || 'Nama Pesantren'}
                </h2>
                <p className="text-emerald-300/90 text-sm font-medium mt-1">
                  {formData.officialName || formData.name}
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-300">
                  {formData.city && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      {formData.city}, {formData.province}
                    </span>
                  )}
                  {formData.directorName && (
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-emerald-400" />
                      Pimpinan: {formData.directorName}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Body Sections */}
          <div className="p-6 sm:p-8 space-y-8">
            {/* Bagian 1: Identitas Pokok & Legalitas */}
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                <span>Identitas Pokok & Nomor Statistik</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Nama Pesantren <span className="text-rose-500">*</span>
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      required
                      value={formData.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Contoh: Pesantren Darul Musthafa Al-Islamiyah"
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  ) : (
                    <p className="text-sm font-semibold text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {institution?.name || '-'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Nama Resmi Yayasan / Badan Hukum
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.officialName || ''}
                      onChange={(e) => handleInputChange('officialName', e.target.value)}
                      placeholder="Contoh: Yayasan Pendidikan Islam..."
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  ) : (
                    <p className="text-sm text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {institution?.officialName || '-'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Nama Direktur / Pengasuh Pimpinan
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.directorName || ''}
                      onChange={(e) => handleInputChange('directorName', e.target.value)}
                      placeholder="Contoh: K.H. Abdullah Gymnastiar Al-Hafidz"
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  ) : (
                    <p className="text-sm text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {institution?.directorName || '-'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    NPSN (Nomor Pokok Sekolah Nasional)
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.npsn || ''}
                      onChange={(e) => handleInputChange('npsn', e.target.value)}
                      placeholder="Contoh: 69987654"
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                    />
                  ) : (
                    <p className="text-sm font-mono text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {institution?.npsn || 'Belum diisi'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    NSM (Nomor Statistik Madrasah / Pesantren)
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.nsm || ''}
                      onChange={(e) => handleInputChange('nsm', e.target.value)}
                      placeholder="Contoh: 131232010045"
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                    />
                  ) : (
                    <p className="text-sm font-mono text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {institution?.nsm || 'Belum diisi'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Tahun Berdiri
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={formData.foundedYear || ''}
                      onChange={(e) => handleInputChange('foundedYear', e.target.value)}
                      placeholder="Contoh: 1998"
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                    />
                  ) : (
                    <p className="text-sm font-mono text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {institution?.foundedYear || '-'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Bagian 2: Alamat Lengkap & Geografis */}
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <span>Lokasi & Alamat Lembaga</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Alamat Lengkap (Jalan, No. Bangunan, RT/RW)
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.address || ''}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Contoh: Jl. Pesantren Luhur No. 12"
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  ) : (
                    <p className="text-sm text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {institution?.address || '-'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Desa / Kelurahan
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.village || ''}
                      onChange={(e) => handleInputChange('village', e.target.value)}
                      placeholder="Contoh: Tugu Selatan"
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  ) : (
                    <p className="text-sm text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {institution?.village || '-'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Kecamatan
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.district || ''}
                      onChange={(e) => handleInputChange('district', e.target.value)}
                      placeholder="Contoh: Cisarua"
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  ) : (
                    <p className="text-sm text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {institution?.district || '-'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Kabupaten / Kota
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.city || ''}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Contoh: Kabupaten Bogor"
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  ) : (
                    <p className="text-sm text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {institution?.city || '-'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Provinsi
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.province || ''}
                      onChange={(e) => handleInputChange('province', e.target.value)}
                      placeholder="Contoh: Jawa Barat"
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  ) : (
                    <p className="text-sm text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {institution?.province || '-'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Kode Pos
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.postalCode || ''}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      placeholder="Contoh: 16750"
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                    />
                  ) : (
                    <p className="text-sm font-mono text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {institution?.postalCode || '-'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Bagian 3: Kontak & Komunikasi Resmi */}
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
                <Phone className="w-5 h-5 text-emerald-600" />
                <span>Kontak & Media Komunikasi</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Nomor Telepon / Hotline
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Contoh: +62 251 8254 991"
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                    />
                  ) : (
                    <p className="text-sm font-mono text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      {institution?.phone || '-'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Email Resmi Sekretariat
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Contoh: sekretariat@darulmusthafa.sch.id"
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  ) : (
                    <p className="text-sm text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      {institution?.email || '-'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Situs Web Resmi
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.website || ''}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="Contoh: https://darulmusthafa.sch.id"
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  ) : (
                    <p className="text-sm text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-slate-400" />
                      {institution?.website ? (
                        <a
                          href={institution.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-700 hover:underline"
                        >
                          {institution.website}
                        </a>
                      ) : (
                        '-'
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Bagian 4: Deskripsi Singkat */}
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <span>Visi & Deskripsi Singkat Pesantren</span>
              </h3>

              <div>
                {isEditing ? (
                  <textarea
                    rows={4}
                    value={formData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Tuliskan deskripsi singkat mengenai fokus pendidikan, visi, dan keistimewaan pesantren Anda..."
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                ) : (
                  <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed">
                    {institution?.description || 'Belum ada deskripsi singkat.'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Bar (Only visible when editing) */}
          {isEditing && (
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Simpan Perubahan</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
