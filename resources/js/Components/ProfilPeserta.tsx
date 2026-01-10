import { Trophy, Star, Flame, BookOpen, Settings } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { HeaderPeserta } from './HeaderPeserta';
import { BottomNavPeserta } from './BottomNavPeserta';

interface ProfilPesertaProps {
  onNavigate: (page: string) => void;
  userName: string;
}

export function ProfilPeserta({ onNavigate, userName }: ProfilPesertaProps) {
  const achievements = [
    { id: 1, title: 'Pemula', emoji: '🌱', unlocked: true },
    { id: 2, title: 'Rajin Belajar', emoji: '📚', unlocked: true },
    { id: 3, title: 'Barista Muda', emoji: '☕', unlocked: true },
    { id: 4, title: 'Master Kopi', emoji: '👨‍🍳', unlocked: false },
    { id: 5, title: 'Sempurna', emoji: '💯', unlocked: false },
    { id: 6, title: 'Bintang', emoji: '⭐', unlocked: false },
  ];

  const stats = [
    { label: 'Level', value: '5', icon: Trophy, color: 'from-[#FFEB3B] to-[#FFA500]' },
    { label: 'XP Points', value: '850', icon: Star, color: 'from-[#FF1B6B] to-[#CE93D8]' },
    { label: 'Streak', value: '7 Hari', icon: Flame, color: 'from-[#7FFF00] to-[#00E5FF]' },
    { label: 'Workshop', value: '2/6', icon: BookOpen, color: 'from-[#00E5FF] to-[#1E90FF]' },
  ];

  const progressData = [
    { workshop: 'Mengenal Alat Barista', progress: 100, status: 'Selesai', color: 'from-[#66BB6A] to-[#7FFF00]' },
    { workshop: 'Teknik Menyeduh Kopi', progress: 60, status: 'Sedang Belajar', color: 'from-[#FFEB3B] to-[#FFA500]' },
    { workshop: 'Latte Art Dasar', progress: 0, status: 'Belum Dimulai', color: 'from-gray-300 to-gray-400' },
    { workshop: 'Pelayanan Pelanggan', progress: 0, status: 'Belum Dimulai', color: 'from-gray-300 to-gray-400' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3E5F5] via-[#FCE4EC] to-[#FFF3E0] pb-24">
      <HeaderPeserta userName={userName} onNavigate={onNavigate} />

      <div className="p-6 max-w-4xl mx-auto">
        {/* Profile Header */}
        <Card className="bg-gradient-to-br from-[#9C27B0] to-[#E91E63] rounded-2xl p-8 mb-6 border-0 shadow-lg">
          <div className="text-center">
            {/* Avatar */}
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-6xl">😊</span>
            </div>

            {/* Name */}
            <h1 className="text-white mb-2">{userName}</h1>
            <Badge className="bg-white/30 backdrop-blur text-white border-0 px-4 py-1 mb-4">
              🏅 Barista Muda
            </Badge>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-3 mt-6">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="bg-white/20 backdrop-blur rounded-xl p-3 text-center">
                    <Icon className="w-6 h-6 text-white mx-auto mb-1" />
                    <p className="text-white text-xs mb-1">{stat.label}</p>
                    <p className="text-white">{stat.value}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Achievements */}
        <Card className="bg-white rounded-2xl p-6 mb-6 border-0 shadow-md">
          <h3 className="text-gray-800 mb-4">Pencapaian</h3>
          <div className="grid grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-xl text-center transition-all ${
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-[#FFD166]/20 to-[#FFA500]/20 border-2 border-[#FFA500]'
                    : 'bg-gray-100 opacity-50'
                }`}
              >
                <div className={`text-4xl mb-2 ${!achievement.unlocked && 'grayscale'}`}>
                  {achievement.emoji}
                </div>
                <p className={`text-xs ${achievement.unlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                  {achievement.title}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Progress */}
        <Card className="bg-white rounded-2xl p-6 mb-6 border-0 shadow-md">
          <h3 className="text-gray-800 mb-4">Progress Workshop</h3>
          <div className="space-y-4">
            {progressData.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700 text-sm">{item.workshop}</span>
                  <span className="text-gray-600 text-xs">{item.progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{item.status}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Additional Info */}
        <Card className="bg-gradient-to-r from-[#00B8D4] to-[#00E5FF] rounded-2xl p-5 mb-6 border-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center backdrop-blur text-2xl">
              ⭐
            </div>
            <div>
              <h4 className="text-white mb-1">Tips</h4>
              <p className="text-white/90 text-sm">
                Selesaikan semua workshop untuk membuka badge "Master Kopi"!
              </p>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => onNavigate('dashboard')}
            className="h-12 bg-white text-gray-700 rounded-xl shadow-md hover:bg-gray-50"
          >
            Kembali
          </Button>
          <Button
            className="h-12 bg-gradient-to-r from-[#9C27B0] to-[#E91E63] text-white rounded-xl shadow-md hover:scale-105"
          >
            <Settings className="w-5 h-5 mr-2" />
            Pengaturan
          </Button>
        </div>
      </div>

      <BottomNavPeserta onNavigate={onNavigate} currentPage="profil" />
    </div>
  );
}
