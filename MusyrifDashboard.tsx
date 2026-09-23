import React from 'react';
import { StatCard } from '../common/StatCard';
import { HeartHandshake, BedDouble, CheckCircle2, AlertTriangle, Clock, ShieldCheck } from 'lucide-react';
import { DashboardData } from '../../types';

interface DashboardProps {
  data?: DashboardData | null;
}

export const MusyrifDashboard: React.FC<DashboardProps> = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-cyan-900 to-slate-900 text-white rounded-2xl p-6 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-200 text-xs font-semibold mb-2">
          <span>Portal Musyrif & Pengasuhan Asrama</span>
          <span>•</span>
          <span>Scope: ASSIGNED DORMITORY</span>
        </div>
        <h2 className="text-2xl font-bold">Ustadz Hassan As-Segaf</h2>
        <p className="mt-1 text-sm text-cyan-100/80">
          Penanggung Jawab: Gedung Asrama Umar bin Khattab (Kamar 01 - Kamar 08)
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Santri Binaan Asrama"
          value="36 Santri"
          subtitle="8 Kamar Terisi Penuh"
          badgeText="Kamar 01 - 08"
          badgeType="info"
          icon={BedDouble}
          colorScheme="blue"
        />
        <StatCard
          title="Presensi Shalat Subuh"
          value="36 / 36 Santri"
          subtitle="Tepat Waktu Berjamaah"
          badgeText="100% Hadir"
          badgeType="success"
          icon={CheckCircle2}
          colorScheme="emerald"
        />
        <StatCard
          title="Permohonan Izin Keluar"
          value="1 Menunggu"
          subtitle="Santri Butuh Berobat ke Klinik"
          badgeText="Verifikasi Musyrif"
          badgeType="warning"
          icon={Clock}
          colorScheme="amber"
        />
        <StatCard
          title="Catatan Pembinaan / Pelanggaran"
          value="0 Kasus Hari Ini"
          subtitle="Kondisi Asrama Tertib & Bersih"
          badgeText="Aman"
          badgeType="success"
          icon={ShieldCheck}
          colorScheme="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daftar Kamar Binaan */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <BedDouble className="w-4 h-4 text-cyan-600" />
              <span>Status Kamar Binaan (Asrama Umar)</span>
            </span>
            <span className="text-xs text-slate-500">8 Kamar</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            {[
              { room: 'Kamar 01', santri: 5, status: 'Lengkap' },
              { room: 'Kamar 02', santri: 4, status: 'Lengkap' },
              { room: 'Kamar 03', santri: 5, status: 'Lengkap' },
              { room: 'Kamar 04', santri: 4, status: '1 Izin Sakit' },
              { room: 'Kamar 05', santri: 5, status: 'Lengkap' },
              { room: 'Kamar 06', santri: 4, status: 'Lengkap' },
              { room: 'Kamar 07', santri: 5, status: 'Lengkap' },
              { room: 'Kamar 08', santri: 4, status: 'Lengkap' },
            ].map((kamar, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-center">
                <span className="text-xs font-bold text-slate-800 block">{kamar.room}</span>
                <span className="text-lg font-extrabold text-cyan-700 block mt-1">{kamar.santri}</span>
                <span className="text-[10px] text-slate-500 block">Santri</span>
                <span
                  className={`mt-1.5 inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    kamar.status === 'Lengkap'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {kamar.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Alur Pengasuhan & Perizinan */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-emerald-600" />
              <span>Verifikasi Perizinan Santri Binaan</span>
            </span>
            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold">
              1 Permohonan
            </span>
          </h3>

          <div className="mt-4 p-3.5 rounded-lg border border-amber-200 bg-amber-50/40 text-xs">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-bold text-slate-900 text-sm">Santri: Ahmad Farhan (Kamar 04)</span>
                <p className="text-slate-600 mt-1">Keperluan: Berobat ke Dokter Gigi (RSUD Cisarua)</p>
                <p className="text-slate-500 text-[11px] mt-0.5">Waktu: Pukul 14:00 - 17:00 WIB (Didampingi Staf Medis)</p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-amber-200/60 flex items-center gap-2">
              <button
                onClick={() => alert('Izin disetujui. Sesuai arsitektur, data perizinan akan tercatat ke audit log.')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold"
              >
                Setujui Izin Keluar
              </button>
              <button
                onClick={() => alert('Pemberitahuan telah diteruskan ke wali santri.')}
                className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded font-semibold hover:bg-slate-50"
              >
                Hubungi Wali Santri
              </button>
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-50 rounded-lg text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Catatan Pengasuhan:</span> Modul komprehensif
            pengasuhan (Asrama, Pembinaan, Pelanggaran & Poin Disiplin) akan diaktifkan secara penuh pada
            Fase 5.
          </div>
        </div>
      </div>
    </div>
  );
};
