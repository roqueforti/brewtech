import { Play, Lock, Trophy, Award, BookOpen } from 'lucide-react';
import { HeaderPeserta } from './HeaderPeserta';

interface DashboardPesertaProps {
  onNavigate: (page: string) => void;
  userName: string;
  kelasId?: number;
  onBackToRoleSelection?: () => void;
}

export function DashboardPeserta({ onNavigate, userName, kelasId = 1, onBackToRoleSelection }: DashboardPesertaProps) {
  const kelasInfo = {
    1: { namaKelas: "Class A - Morning", pelatih: "Ms. Sari", totalPeserta: 10 },
    2: { namaKelas: "Class B - Afternoon", pelatih: "Mr. Budi", totalPeserta: 10 },
    3: { namaKelas: "Class C - Evening", pelatih: "Ms. Dewi", totalPeserta: 10 },
  }[kelasId] || { namaKelas: "Class A - Morning", pelatih: "Ms. Sari", totalPeserta: 10 };
  
  const workshops = [
    { 
      id: 1, 
      title: 'Workshop 1', 
      subtitle: 'Chocolate Milk',
      emoji: '🍫',
      status: 'completed',
      color: 'bg-pink-100',
      borderColor: 'border-pink-300'
    },
    { 
      id: 2, 
      title: 'Workshop 2', 
      subtitle: 'Coffee Milk',
      emoji: '☕',
      status: 'completed',
      color: 'bg-amber-100',
      borderColor: 'border-amber-300'
    },
    { 
      id: 3, 
      title: 'Workshop 3', 
      subtitle: 'Latte Art',
      emoji: '🎨',
      status: 'available',
      color: 'bg-blue-100',
      borderColor: 'border-blue-300'
    },
    { 
      id: 4, 
      title: 'Workshop 4', 
      subtitle: 'Cappuccino',
      emoji: '🥛',
      status: 'locked',
      color: 'bg-gray-100',
      borderColor: 'border-gray-300'
    },
    { 
      id: 5, 
      title: 'Workshop 5', 
      subtitle: 'Espresso',
      emoji: '☕',
      status: 'locked',
      color: 'bg-gray-100',
      borderColor: 'border-gray-300'
    },
    { 
      id: 6, 
      title: 'Workshop 6', 
      subtitle: 'Barista Final',
      emoji: '🏆',
      status: 'locked',
      color: 'bg-gray-100',
      borderColor: 'border-gray-300'
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5E6D3]">
      <HeaderPeserta userName={userName} onNavigate={onNavigate} onBackToRoleSelection={onBackToRoleSelection} />

      <div className="p-6 max-w-6xl mx-auto">
        {/* Welcome Card */}
        <div className="bg-white rounded-3xl p-8 shadow-lg mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-6xl">👋</div>
            <div className="flex-1">
              <h1 className="text-3xl text-gray-800 mb-1">Halo, {userName}!</h1>
              <p className="text-lg text-gray-600">{kelasInfo.namaKelas} • {kelasInfo.pelatih}</p>
            </div>
          </div>
          
          {/* Progress Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-emerald-100 rounded-2xl p-4 text-center">
              <div className="text-3xl text-emerald-600 mb-1">2</div>
              <p className="text-sm text-gray-700">Selesai</p>
            </div>
            <div className="bg-blue-100 rounded-2xl p-4 text-center">
              <div className="text-3xl text-blue-600 mb-1">1</div>
              <p className="text-sm text-gray-700">Aktif</p>
            </div>
            <div className="bg-amber-100 rounded-2xl p-4 text-center">
              <div className="text-3xl text-amber-600 mb-1">3</div>
              <p className="text-sm text-gray-700">Terkunci</p>
            </div>
          </div>
        </div>

        {/* Workshops Title */}
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-8 h-8 text-gray-700" />
          <h2 className="text-2xl text-gray-800">Workshop Kamu</h2>
        </div>

        {/* Workshops Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {workshops.map((workshop) => (
            <button
              key={workshop.id}
              onClick={() => workshop.status !== 'locked' && onNavigate('workshop-flow')}
              disabled={workshop.status === 'locked'}
              className={`${workshop.color} rounded-3xl p-6 border-4 ${workshop.borderColor} transition-all shadow-md ${
                workshop.status === 'locked' 
                  ? 'opacity-60 cursor-not-allowed' 
                  : 'hover:scale-105 hover:shadow-xl cursor-pointer'
              }`}
            >
              {/* Status Badge */}
              <div className="flex justify-end mb-2">
                {workshop.status === 'completed' && (
                  <div className="bg-emerald-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    Selesai
                  </div>
                )}
                {workshop.status === 'available' && (
                  <div className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    <Play className="w-3 h-3" />
                    Mulai
                  </div>
                )}
                {workshop.status === 'locked' && (
                  <div className="bg-gray-400 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Terkunci
                  </div>
                )}
              </div>

              {/* Emoji Icon */}
              <div className="text-7xl mb-4 text-center">{workshop.emoji}</div>

              {/* Title */}
              <h3 className="text-xl text-gray-800 mb-1 text-center">{workshop.title}</h3>
              <p className="text-sm text-gray-600 text-center">{workshop.subtitle}</p>
            </button>
          ))}
        </div>

        {/* Achievements Section */}
        <div className="mt-8 bg-white rounded-3xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-8 h-8 text-gray-700" />
            <h2 className="text-2xl text-gray-800">Badge Kamu</h2>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-yellow-100 rounded-2xl p-6 text-center border-4 border-yellow-300">
              <div className="text-5xl mb-2">🏆</div>
              <p className="text-xs text-gray-700">Workshop Master</p>
            </div>
            <div className="bg-pink-100 rounded-2xl p-6 text-center border-4 border-pink-300">
              <div className="text-5xl mb-2">⭐</div>
              <p className="text-xs text-gray-700">Quick Learner</p>
            </div>
            <div className="bg-gray-100 rounded-2xl p-6 text-center border-4 border-gray-300 opacity-50">
              <div className="text-5xl mb-2">🎨</div>
              <p className="text-xs text-gray-700">Latte Artist</p>
            </div>
            <div className="bg-gray-100 rounded-2xl p-6 text-center border-4 border-gray-300 opacity-50">
              <div className="text-5xl mb-2">💯</div>
              <p className="text-xs text-gray-700">Perfect Score</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}