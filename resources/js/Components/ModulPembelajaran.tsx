import { Play, CheckCircle, Lock, BookOpen, Clock } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { HeaderPeserta } from './HeaderPeserta';
import { BottomNavPeserta } from './BottomNavPeserta';

interface ModulPembelajaranProps {
  onNavigate: (page: string) => void;
  userName?: string;
  kelasId?: number;
}

export function ModulPembelajaran({ onNavigate, userName = "Peserta", kelasId = 1 }: ModulPembelajaranProps) {
  
  // Mock data kelas
  const kelasInfo = {
    1: { namaKelas: "Kelas A - Pagi", color: "from-[#7FFF00] to-[#00E5FF]", emoji: "🌅" },
    2: { namaKelas: "Kelas B - Siang", color: "from-[#FFEB3B] to-[#FFA500]", emoji: "☀️" },
    3: { namaKelas: "Kelas C - Sore", color: "from-[#FF1B6B] to-[#CE93D8]", emoji: "🌆" },
  }[kelasId] || { namaKelas: "Kelas A - Pagi", color: "from-[#7FFF00] to-[#00E5FF]", emoji: "🌅" };

  // Mock data workshop per kelas
  const workshopsPerKelas = {
    1: [ // Kelas A - Pagi (4 workshop)
      { 
        id: 1, 
        title: 'Workshop 1: Pengenalan Alat Barista', 
        emoji: '🔧',
        color: 'from-[#FF1B6B] to-[#FF6B9D]',
        durasi: '2 jam',
        status: 'completed',
        progress: 100,
        videoCount: 5
      },
      { 
        id: 2, 
        title: 'Workshop 2: Teknik Menyeduh Kopi', 
        emoji: '☕',
        color: 'from-[#FF6B00] to-[#FF9E40]',
        durasi: '3 jam',
        status: 'in-progress',
        progress: 60,
        videoCount: 8
      },
      { 
        id: 3, 
        title: 'Workshop 3: Latte Art Dasar', 
        emoji: '🎨',
        color: 'from-[#9C27B0] to-[#CE93D8]',
        durasi: '4 jam',
        status: 'locked',
        progress: 0,
        videoCount: 10
      },
      { 
        id: 4, 
        title: 'Workshop 4: Pelayanan Customer', 
        emoji: '😊',
        color: 'from-[#00B8D4] to-[#00E5FF]',
        durasi: '2.5 jam',
        status: 'locked',
        progress: 0,
        videoCount: 6
      },
    ],
    2: [ // Kelas B - Siang (3 workshop)
      { 
        id: 1, 
        title: 'Workshop 1: Pengenalan Alat Barista', 
        emoji: '🔧',
        color: 'from-[#FF1B6B] to-[#FF6B9D]',
        durasi: '2 jam',
        status: 'in-progress',
        progress: 40,
        videoCount: 5
      },
      { 
        id: 2, 
        title: 'Workshop 2: Teknik Menyeduh Kopi', 
        emoji: '☕',
        color: 'from-[#FF6B00] to-[#FF9E40]',
        durasi: '3 jam',
        status: 'locked',
        progress: 0,
        videoCount: 8
      },
      { 
        id: 3, 
        title: 'Workshop 3: Latte Art Dasar', 
        emoji: '🎨',
        color: 'from-[#9C27B0] to-[#CE93D8]',
        durasi: '4 jam',
        status: 'locked',
        progress: 0,
        videoCount: 10
      },
    ],
    3: [ // Kelas C - Sore (2 workshop)
      { 
        id: 1, 
        title: 'Workshop 1: Pengenalan Alat Barista', 
        emoji: '🔧',
        color: 'from-[#FF1B6B] to-[#FF6B9D]',
        durasi: '2 jam',
        status: 'completed',
        progress: 100,
        videoCount: 5
      },
      { 
        id: 2, 
        title: 'Workshop 2: Teknik Menyeduh Kopi', 
        emoji: '☕',
        color: 'from-[#FF6B00] to-[#FF9E40]',
        durasi: '3 jam',
        status: 'locked',
        progress: 0,
        videoCount: 8
      },
    ],
  };

  const workshops = workshopsPerKelas[kelasId as keyof typeof workshopsPerKelas] || workshopsPerKelas[1];

  const handleWorkshopClick = (workshop: typeof workshops[0]) => {
    if (workshop.status === 'locked') return;
    
    // Navigate to workshop detail (PreTest for now)
    onNavigate('pretest');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return { text: '✓ Selesai', className: 'bg-gradient-to-r from-[#7FFF00] to-[#00E5FF] text-white' };
      case 'in-progress':
        return { text: '▶ Sedang Belajar', className: 'bg-gradient-to-r from-[#FF6B00] to-[#FF9E40] text-white' };
      case 'locked':
        return { text: '🔒 Terkunci', className: 'bg-gray-300 text-gray-600' };
      default:
        return { text: 'Belum Mulai', className: 'bg-gray-200 text-gray-600' };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3E5F5] via-[#FCE4EC] to-[#FFF3E0] pb-24">
      <HeaderPeserta userName={userName} onNavigate={onNavigate} />

      <div className="p-6 max-w-4xl mx-auto">
        {/* Kelas Header */}
        <Card className={`bg-gradient-to-br ${kelasInfo.color} rounded-2xl p-6 mb-6 border-0 shadow-lg relative overflow-hidden`}>
          <div className="absolute right-6 top-6 text-8xl opacity-20">
            {kelasInfo.emoji}
          </div>
          <div className="relative z-10">
            <Badge className="bg-white/30 backdrop-blur text-white border-0 px-4 py-1 rounded-full mb-3">
              Kelas Saya
            </Badge>
            <h1 className="text-white mb-2">{kelasInfo.namaKelas}</h1>
            <p className="text-white/90 text-lg mb-3">Halo, {userName}! 👋</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-2">
                <BookOpen className="w-5 h-5 text-white" />
                <span className="text-white">{workshops.length} Workshop</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-2">
                <CheckCircle className="w-5 h-5 text-white" />
                <span className="text-white">
                  {workshops.filter(w => w.status === 'completed').length} Selesai
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Workshop List */}
        <div className="space-y-4 mb-6">
          <h3 className="text-gray-800 text-xl mb-4">📚 Daftar Workshop</h3>
          
          {workshops.map((workshop, index) => {
            const statusBadge = getStatusBadge(workshop.status);
            const isLocked = workshop.status === 'locked';
            const isInProgress = workshop.status === 'in-progress';
            const isCompleted = workshop.status === 'completed';

            return (
              <div key={workshop.id}>
                <Card
                  onClick={() => handleWorkshopClick(workshop)}
                  className={`rounded-2xl p-5 border-0 shadow-md transition-all relative overflow-hidden ${
                    isLocked
                      ? 'bg-gray-200 cursor-not-allowed'
                      : 'cursor-pointer hover:scale-105 bg-white'
                  }`}
                >
                  {/* Background Emoji */}
                  <div className="absolute right-4 top-4 text-7xl opacity-10">
                    {isLocked ? '🔒' : workshop.emoji}
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-start gap-4 mb-4">
                      {/* Icon */}
                      <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 ${
                        isLocked 
                          ? 'bg-gray-300' 
                          : `bg-gradient-to-br ${workshop.color}`
                      }`}>
                        {isLocked ? '🔒' : workshop.emoji}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className={`${isLocked ? 'text-gray-600' : 'text-gray-800'}`}>
                            {workshop.title}
                          </h3>
                        </div>
                        
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`flex items-center gap-2 rounded-full px-3 py-1 ${
                            isLocked ? 'bg-gray-100' : 'bg-gradient-to-r from-[#f8f9ff] to-[#fff5f8]'
                          }`}>
                            <BookOpen className={`w-4 h-4 ${isLocked ? 'text-gray-400' : 'text-[#9C27B0]'}`} />
                            <span className={`text-sm ${isLocked ? 'text-gray-500' : 'text-gray-700'}`}>
                              {workshop.videoCount} video
                            </span>
                          </div>
                          <div className={`flex items-center gap-2 rounded-full px-3 py-1 ${
                            isLocked ? 'bg-gray-100' : 'bg-gradient-to-r from-[#f8f9ff] to-[#fff5f8]'
                          }`}>
                            <Clock className={`w-4 h-4 ${isLocked ? 'text-gray-400' : 'text-[#00B8D4]'}`} />
                            <span className={`text-sm ${isLocked ? 'text-gray-500' : 'text-gray-700'}`}>
                              {workshop.durasi}
                            </span>
                          </div>
                        </div>

                        <Badge className={`${statusBadge.className} border-0 rounded-full text-xs`}>
                          {statusBadge.text}
                        </Badge>
                      </div>
                    </div>

                    {/* Progress Bar (only for non-locked workshops) */}
                    {!isLocked && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-600 text-sm">Progress</span>
                          <span className="text-gray-800">{workshop.progress}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${workshop.color} transition-all`}
                            style={{ width: `${workshop.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    {!isLocked && (
                      <Button
                        onClick={() => handleWorkshopClick(workshop)}
                        className={`w-full mt-4 h-12 rounded-xl shadow-md hover:scale-105 active:scale-95 transition-all border-0 ${
                          isCompleted
                            ? 'bg-gradient-to-r from-[#7FFF00] to-[#00E5FF] text-white'
                            : `bg-gradient-to-r ${workshop.color} text-white`
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle className="w-5 h-5 mr-2" />
                            Lihat Ulang
                          </>
                        ) : (
                          <>
                            <Play className="w-5 h-5 mr-2" />
                            {isInProgress ? 'Lanjutkan' : 'Mulai'} Belajar
                          </>
                        )}
                      </Button>
                    )}

                    {isLocked && (
                      <div className="mt-4 bg-gray-100 rounded-xl p-3">
                        <p className="text-gray-600 text-sm text-center">
                          🔒 Selesaikan workshop sebelumnya untuk membuka
                        </p>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Connector Line */}
                {index < workshops.length - 1 && (
                  <div className="flex justify-center py-2">
                    <div className={`w-1 h-8 rounded-full ${
                      workshops[index + 1].status === 'locked' 
                        ? 'bg-gray-300' 
                        : 'bg-gradient-to-b from-[#00E5FF] to-[#1E90FF]'
                    }`}></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Info Card */}
        <Card className="bg-gradient-to-br from-[#00E5FF] to-[#1E90FF] rounded-2xl p-5 border-0 shadow-md">
          <h4 className="text-white mb-3 text-center">💡 Tips Belajar</h4>
          <div className="space-y-2">
            <div className="flex items-start gap-3 bg-white/20 backdrop-blur rounded-xl p-3">
              <span className="text-2xl">1️⃣</span>
              <p className="text-white text-sm flex-1">Selesaikan workshop secara berurutan</p>
            </div>
            <div className="flex items-start gap-3 bg-white/20 backdrop-blur rounded-xl p-3">
              <span className="text-2xl">2️⃣</span>
              <p className="text-white text-sm flex-1">Tonton semua video dengan seksama</p>
            </div>
            <div className="flex items-start gap-3 bg-white/20 backdrop-blur rounded-xl p-3">
              <span className="text-2xl">3️⃣</span>
              <p className="text-white text-sm flex-1">Kerjakan pre-test dan post-test dengan baik</p>
            </div>
            <div className="flex items-start gap-3 bg-white/20 backdrop-blur rounded-xl p-3">
              <span className="text-2xl">4️⃣</span>
              <p className="text-white text-sm flex-1">Jangan ragu bertanya jika ada kesulitan!</p>
            </div>
          </div>
        </Card>
      </div>

      <BottomNavPeserta onNavigate={onNavigate} currentPage="modul" />
    </div>
  );
}
