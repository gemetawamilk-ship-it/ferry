import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../services/api';
import { Building, Dormitory, Room, DormitoryStats, User, RoomStatus, DormitoryGenderType, RoomGenderType } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { DormitoryStatsOverview } from './DormitoryStatsOverview';
import { BuildingList } from './BuildingList';
import { DormitoryList } from './DormitoryList';
import { RoomList } from './RoomList';
import {
  Building2,
  Users,
  BedDouble,
  LayoutDashboard,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

export const DormitoryManagement: React.FC = () => {
  const { user, tenant, hasPermission } = useAuth();

  const [activeTab, setActiveTab] = useState<'ringkasan' | 'gedung' | 'asrama' | 'kamar'>('ringkasan');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<DormitoryStats | null>(null);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [dormitories, setDormitories] = useState<Dormitory[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [staffUsers, setStaffUsers] = useState<User[]>([]);

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, buildingsRes, dormsRes, roomsRes, usersRes] = await Promise.allSettled([
        api.getDormitoryStats(),
        api.getBuildings(),
        api.getDormitories(),
        api.getRooms(),
        api.getUsers(),
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value.success) {
        setStats(statsRes.value.data);
      }
      if (buildingsRes.status === 'fulfilled' && buildingsRes.value.success) {
        setBuildings(buildingsRes.value.data);
      }
      if (dormsRes.status === 'fulfilled' && dormsRes.value.success) {
        setDormitories(dormsRes.value.data);
      }
      if (roomsRes.status === 'fulfilled' && roomsRes.value.success) {
        setRooms(roomsRes.value.data);
      }
      if (usersRes.status === 'fulfilled' && usersRes.value.success) {
        setStaffUsers(usersRes.value.users);
      }
    } catch (err: any) {
      console.error('Error fetching dormitory master data:', err);
      showNotification('error', 'Gagal memuat data asrama & gedung.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData, user?.tenantId]);

  // ==================== GEDUNG ACTIONS ====================
  const handleCreateBuilding = async (data: {
    name: string;
    code: string;
    functionType?: string;
    location?: string;
    description?: string;
    status?: 'ACTIVE' | 'INACTIVE';
  }) => {
    const res = await api.createBuilding(data);
    showNotification('success', res.message || 'Gedung berhasil ditambahkan.');
    await loadData();
  };

  const handleUpdateBuilding = async (
    id: string,
    data: {
      name?: string;
      code?: string;
      functionType?: string;
      location?: string;
      description?: string;
      status?: 'ACTIVE' | 'INACTIVE';
    }
  ) => {
    const res = await api.updateBuilding(id, data);
    showNotification('success', res.message || 'Gedung berhasil diperbarui.');
    await loadData();
  };

  const handleToggleBuildingStatus = async (id: string) => {
    try {
      const res = await api.toggleBuildingStatus(id);
      showNotification('success', res.message || 'Status gedung berhasil diubah.');
      await loadData();
    } catch (err: any) {
      showNotification('error', err.message || 'Gagal mengubah status gedung.');
    }
  };

  const handleDeleteBuilding = async (id: string) => {
    const res = await api.deleteBuilding(id);
    showNotification('success', res.message || 'Gedung berhasil dihapus.');
    await loadData();
  };

  // ==================== ASRAMA ACTIONS ====================
  const handleCreateDormitory = async (data: {
    buildingId: string;
    name: string;
    code: string;
    genderType: DormitoryGenderType;
    totalCapacity: number;
    description?: string;
    status?: 'ACTIVE' | 'INACTIVE';
  }) => {
    const res = await api.createDormitory(data);
    showNotification('success', res.message || 'Asrama berhasil ditambahkan.');
    await loadData();
  };

  const handleUpdateDormitory = async (
    id: string,
    data: {
      buildingId?: string;
      name?: string;
      code?: string;
      genderType?: DormitoryGenderType;
      totalCapacity?: number;
      description?: string;
      status?: 'ACTIVE' | 'INACTIVE';
    }
  ) => {
    const res = await api.updateDormitory(id, data);
    showNotification('success', res.message || 'Asrama berhasil diperbarui.');
    await loadData();
  };

  const handleToggleDormitoryStatus = async (id: string) => {
    try {
      const res = await api.toggleDormitoryStatus(id);
      showNotification('success', res.message || 'Status asrama berhasil diubah.');
      await loadData();
    } catch (err: any) {
      showNotification('error', err.message || 'Gagal mengubah status asrama.');
    }
  };

  const handleDeleteDormitory = async (id: string) => {
    const res = await api.deleteDormitory(id);
    showNotification('success', res.message || 'Asrama berhasil dihapus.');
    await loadData();
  };

  // ==================== MUSYRIF ACTIONS ====================
  const handleAssignSupervisor = async (
    dormitoryId: string,
    data: { userId: string; roleType?: 'MUSYRIF' | 'PENANGGUNG_JAWAB'; isPrimary?: boolean }
  ) => {
    const res = await api.addDormitorySupervisor(dormitoryId, data);
    showNotification('success', res.message || 'Musyrif berhasil ditugaskan.');
    await loadData();
  };

  const handleRemoveSupervisor = async (dormitoryId: string, supervisorId: string) => {
    const res = await api.removeDormitorySupervisor(dormitoryId, supervisorId);
    showNotification('success', res.message || 'Penugasan musyrif dicopot.');
    await loadData();
  };

  const handleSetPrimarySupervisor = async (dormitoryId: string, supervisorId: string) => {
    const res = await api.setPrimarySupervisor(dormitoryId, supervisorId);
    showNotification('success', res.message || 'Musyrif utama berhasil diatur.');
    await loadData();
  };

  // ==================== KAMAR ACTIONS ====================
  const handleCreateRoom = async (data: {
    dormitoryId: string;
    name: string;
    code: string;
    floor: number;
    capacity: number;
    genderType?: RoomGenderType;
    status?: RoomStatus;
    description?: string;
  }) => {
    const res = await api.createRoom(data);
    showNotification('success', res.message || 'Kamar berhasil ditambahkan.');
    await loadData();
  };

  const handleUpdateRoom = async (
    id: string,
    data: {
      dormitoryId?: string;
      name?: string;
      code?: string;
      floor?: number;
      capacity?: number;
      genderType?: RoomGenderType;
      status?: RoomStatus;
      description?: string;
    }
  ) => {
    const res = await api.updateRoom(id, data);
    showNotification('success', res.message || 'Kamar berhasil diperbarui.');
    await loadData();
  };

  const handleUpdateRoomStatus = async (id: string, statusVal: RoomStatus, description?: string) => {
    const res = await api.updateRoomStatus(id, statusVal, description);
    showNotification('success', res.message || 'Status operasional kamar berhasil diperbarui.');
    await loadData();
  };

  const handleDeleteRoom = async (id: string) => {
    const res = await api.deleteRoom(id);
    showNotification('success', res.message || 'Kamar berhasil dihapus.');
    await loadData();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              PHASE 2.2 • MASTER SARANA & ASRAMA
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">
              Pesantren: <strong className="text-slate-700">{tenant?.name}</strong>
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <span>Master Data Asrama & Kamar</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Sistem tata kelola fisik hunian santri terstruktur: Gedung fisik, Unit Asrama, penetapan Musyrif/Penanggung Jawab, serta kapasitas kamar dan status pemeliharaan (maintenance).
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          <button
            id="btn-refresh-dormitories"
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Muat Ulang</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs font-medium animate-in fade-in slide-in-from-top-2 duration-200 ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            &times;
          </button>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto text-xs font-semibold">
        <button
          id="tab-btn-ringkasan"
          onClick={() => setActiveTab('ringkasan')}
          className={`pb-3 px-3 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'ringkasan'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Ringkasan & Statistik</span>
        </button>

        <button
          id="tab-btn-gedung"
          onClick={() => setActiveTab('gedung')}
          className={`pb-3 px-3 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'gedung'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Master Gedung ({buildings.length})</span>
        </button>

        <button
          id="tab-btn-asrama"
          onClick={() => setActiveTab('asrama')}
          className={`pb-3 px-3 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'asrama'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Unit Asrama & Musyrif ({dormitories.length})</span>
        </button>

        <button
          id="tab-btn-kamar"
          onClick={() => setActiveTab('kamar')}
          className={`pb-3 px-3 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'kamar'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BedDouble className="w-4 h-4" />
          <span>Kamar Santri ({rooms.length})</span>
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'ringkasan' && (
          <div className="space-y-6">
            <DormitoryStatsOverview
              stats={stats}
              loading={loading}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />

            {/* Quick Preview Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Asrama List Preview */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Users className="w-4 h-4 text-sky-600" />
                    <span>Daftar Asrama Aktif</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('asrama')}
                    className="text-xs text-emerald-600 hover:underline font-semibold"
                  >
                    Lihat Semua &rarr;
                  </button>
                </div>
                <div className="space-y-2.5 text-xs">
                  {dormitories.slice(0, 4).map((d) => (
                    <div
                      key={d.id}
                      className="p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold text-slate-800 flex items-center gap-2">
                          <span>{d.name}</span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                              d.genderType === 'PUTRI'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {d.genderType}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500">
                          Gedung {d.buildingName} • {d.roomCount || 0} Kamar
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900">{d.calculatedCapacity || 0}</span>
                        <span className="text-slate-400 text-[11px]"> / {d.totalCapacity} santri</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kamar Maintenance Alert Box */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <BedDouble className="w-4 h-4 text-indigo-600" />
                    <span>Perhatian Pemeliharaan Kamar</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('kamar')}
                    className="text-xs text-emerald-600 hover:underline font-semibold"
                  >
                    Kelola Kamar &rarr;
                  </button>
                </div>
                {rooms.filter((r) => r.status === 'MAINTENANCE').length > 0 ? (
                  <div className="space-y-2.5 text-xs">
                    {rooms
                      .filter((r) => r.status === 'MAINTENANCE')
                      .map((r) => (
                        <div
                          key={r.id}
                          className="p-2.5 bg-amber-50/70 rounded-lg border border-amber-200 flex items-center justify-between"
                        >
                          <div>
                            <div className="font-bold text-amber-900">{r.name} ({r.code})</div>
                            <div className="text-[11px] text-amber-700">
                              Asrama {r.dormitoryName} • Lt. {r.floor}
                            </div>
                            {r.description && (
                              <p className="text-[10px] text-amber-800 italic mt-0.5">
                                Catatan: {r.description}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => setActiveTab('kamar')}
                            className="px-2 py-1 bg-amber-200 hover:bg-amber-300 text-amber-900 font-semibold rounded text-[11px] transition-colors"
                          >
                            Update
                          </button>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                    Semua kamar dalam kondisi siap huni dan tidak ada laporan perbaikan aktif.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'gedung' && (
          <BuildingList
            buildings={buildings}
            loading={loading}
            onRefresh={loadData}
            onCreate={handleCreateBuilding}
            onUpdate={handleUpdateBuilding}
            onToggleStatus={handleToggleBuildingStatus}
            onDelete={handleDeleteBuilding}
          />
        )}

        {activeTab === 'asrama' && (
          <DormitoryList
            dormitories={dormitories}
            buildings={buildings}
            staffUsers={staffUsers}
            loading={loading}
            onRefresh={loadData}
            onCreate={handleCreateDormitory}
            onUpdate={handleUpdateDormitory}
            onToggleStatus={handleToggleDormitoryStatus}
            onDelete={handleDeleteDormitory}
            onAssignSupervisor={handleAssignSupervisor}
            onRemoveSupervisor={handleRemoveSupervisor}
            onSetPrimarySupervisor={handleSetPrimarySupervisor}
          />
        )}

        {activeTab === 'kamar' && (
          <RoomList
            rooms={rooms}
            dormitories={dormitories}
            buildings={buildings}
            loading={loading}
            onRefresh={loadData}
            onCreate={handleCreateRoom}
            onUpdate={handleUpdateRoom}
            onUpdateStatus={handleUpdateRoomStatus}
            onDelete={handleDeleteRoom}
          />
        )}
      </div>
    </div>
  );
};
