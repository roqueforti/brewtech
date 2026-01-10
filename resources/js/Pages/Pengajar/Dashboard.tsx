import { Users, BookOpen, BarChart3, Settings, Plus } from 'lucide-react';
import { HeaderPengajar } from '../../Components/HeaderPengajar';

interface DashboardPengajarProps {
  onNavigate: (page: string, kelasId?: number) => void;
  currentPage: string;
  onBackToRoleSelection?: () => void;
}

export function DashboardPengajar({ onNavigate, currentPage, onBackToRoleSelection }: DashboardPengajarProps) {
  const classes = [
    { id: 1, nama: 'Class A - Morning', jumlahPeserta: 4, workshops: 3, emoji: '🌅', color: 'bg-pink-100', borderColor: 'border-pink-300' },
    { id: 2, nama: 'Class B - Afternoon', jumlahPeserta: 4, workshops: 2, emoji: '☀️', color: 'bg-yellow-100', borderColor: 'border-yellow-300' },
    { id: 3, nama: 'Class C - Evening', jumlahPeserta: 4, workshops: 4, emoji: '🌆', color: 'bg-blue-100', borderColor: 'border-blue-300' },
  ];

  return (
    <div className="min-h-screen bg-[#F5E6D3]">
      <HeaderPengajar currentPage={currentPage} onNavigate={onNavigate} onBackToRoleSelection={onBackToRoleSelection} />

      <div className="p-6 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border-4 border-white mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-6xl">👩‍🏫</div>
            <div className="flex-1">
              <h1 className="text-3xl text-gray-800 mb-1">Dashboard Pengajar</h1>
              <p className="text-lg text-gray-600">Kelola kelas dan workshop BREWTECH</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-blue-100 rounded-2xl p-6 text-center border-4 border-blue-300">
              <div className="text-4xl mb-2">👥</div>
              <div className="text-3xl text-blue-600 mb-1">12</div>
              <p className="text-sm text-gray-700">Total Peserta</p>
            </div>
            <div className="bg-emerald-100 rounded-2xl p-6 text-center border-4 border-emerald-300">
              <div className="text-4xl mb-2">📚</div>
              <div className="text-3xl text-emerald-600 mb-1">3</div>
              <p className="text-sm text-gray-700">Kelas Aktif</p>
            </div>
            <div className="bg-purple-100 rounded-2xl p-6 text-center border-4 border-purple-300">
              <div className="text-4xl mb-2">🎯</div>
              <div className="text-3xl text-purple-600 mb-1">9</div>
              <p className="text-sm text-gray-700">Workshop</p>
            </div>
            <div className="bg-amber-100 rounded-2xl p-6 text-center border-4 border-amber-300">
              <div className="text-4xl mb-2">⭐</div>
              <div className="text-3xl text-amber-600 mb-1">87%</div>
              <p className="text-sm text-gray-700">Avg. Score</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl text-gray-800 mb-4 flex items-center gap-2">
            <Settings className="w-7 h-7" />
            Aksi Cepat
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => onNavigate('data-peserta')}
              className="bg-white hover:bg-blue-50 rounded-2xl p-6 border-4 border-blue-300 transition-all shadow-md hover:scale-105 hover:shadow-lg"
            >
              <Users className="w-10 h-10 text-blue-600 mx-auto mb-3" />
              <p className="text-lg text-gray-800 font-medium">Kelola Peserta</p>
              <p className="text-sm text-gray-600 mt-1">Tambah & edit data</p>
            </button>
            <button
              onClick={() => onNavigate('manajemen-kelas')}
              className="bg-white hover:bg-emerald-50 rounded-2xl p-6 border-4 border-emerald-300 transition-all shadow-md hover:scale-105 hover:shadow-lg"
            >
              <BookOpen className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
              <p className="text-lg text-gray-800 font-medium">Kelola Kelas</p>
              <p className="text-sm text-gray-600 mt-1">Buat & atur kelas</p>
            </button>
            <button
              onClick={() => onNavigate('analisis-spk')}
              className="bg-white hover:bg-purple-50 rounded-2xl p-6 border-4 border-purple-300 transition-all shadow-md hover:scale-105 hover:shadow-lg"
            >
              <BarChart3 className="w-10 h-10 text-purple-600 mx-auto mb-3" />
              <p className="text-lg text-gray-800 font-medium">Analisis SPK</p>
              <p className="text-sm text-gray-600 mt-1">Lihat performa</p>
            </button>
          </div>
        </div>

        {/* Classes List */}
        <div>
          <h2 className="text-2xl text-gray-800 mb-4 flex items-center gap-2">
            <BookOpen className="w-7 h-7" />
            Daftar Kelas
          </h2>
          <div className="grid grid-cols-3 gap-6">
            {classes.map((kelas) => (
              <div
                key={kelas.id}
                className={`${kelas.color} rounded-3xl p-6 border-4 ${kelas.borderColor} shadow-md hover:shadow-lg transition-all`}
              >
                {/* Class Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-5xl">{kelas.emoji}</div>
                    <div>
                      <h3 className="text-xl text-gray-800 font-medium">{kelas.nama}</h3>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white/70 rounded-xl p-3 text-center">
                    <div className="text-2xl text-gray-800 mb-1">{kelas.jumlahPeserta}</div>
                    <p className="text-xs text-gray-600">Peserta</p>
                  </div>
                  <div className="bg-white/70 rounded-xl p-3 text-center">
                    <div className="text-2xl text-gray-800 mb-1">{kelas.workshops}</div>
                    <p className="text-xs text-gray-600">Workshop</p>
                  </div>
                </div>

                {/* Actions */}
                <button
                  onClick={() => onNavigate('manajemen-modul', kelas.id)}
                  className="w-full h-12 bg-white hover:bg-gray-50 text-gray-800 rounded-xl text-sm font-medium transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Kelola Workshop
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}