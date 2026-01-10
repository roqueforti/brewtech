import { useState } from 'react';
import { Play, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { HeaderPeserta } from './HeaderPeserta';
import { BottomNavPeserta } from './BottomNavPeserta';

interface PraktikumVideoProps {
  onNavigate: (page: string) => void;
  workshopTitle: string;
  userName?: string;
}

export function PraktikumVideo({ onNavigate, workshopTitle, userName = "Peserta" }: PraktikumVideoProps) {
  const [completedVideos, setCompletedVideos] = useState<number[]>([1]); // Video 1 sudah selesai
  const [currentVideo, setCurrentVideo] = useState(2);

  const videoSteps = [
    {
      id: 1,
      title: 'Persiapan Alat',
      description: 'Siapkan semua alat yang diperlukan',
      duration: '2 menit',
      emoji: '🛠️',
      completed: true
    },
    {
      id: 2,
      title: 'Memanaskan Air',
      description: 'Panaskan air hingga suhu 90-96°C',
      duration: '3 menit',
      emoji: '💧',
      completed: false
    },
    {
      id: 3,
      title: 'Menyeduh Kopi',
      description: 'Tuang air panas ke kopi bubuk',
      duration: '4 menit',
      emoji: '☕',
      completed: false
    },
    {
      id: 4,
      title: 'Penyajian',
      description: 'Sajikan kopi dengan rapi dan menarik',
      duration: '2 menit',
      emoji: '🎨',
      completed: false
    }
  ];

  const currentVideoData = videoSteps.find(v => v.id === currentVideo);
  const completedCount = completedVideos.length;
  const totalVideos = videoSteps.length;
  const progress = Math.round((completedCount / totalVideos) * 100);

  const handleVideoComplete = () => {
    if (!completedVideos.includes(currentVideo)) {
      setCompletedVideos([...completedVideos, currentVideo]);
    }
    
    if (currentVideo < totalVideos) {
      setCurrentVideo(currentVideo + 1);
    } else {
      // Semua video selesai, lanjut ke post-test
      onNavigate('posttest');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3E5F5] via-[#FCE4EC] to-[#FFF3E0] pb-24">
      <HeaderPeserta userName={userName} onNavigate={onNavigate} />

      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <Card className="bg-gradient-to-br from-[#FF1B6B] to-[#CE93D8] rounded-2xl p-6 mb-6 border-0 shadow-lg">
          <div className="text-center">
            <div className="w-20 h-20 bg-white/30 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-3 text-5xl">
              📹
            </div>
            <h1 className="text-white mb-2">Panduan Video</h1>
            <p className="text-white/90 mb-4">Belajar langkah demi langkah</p>
            
            {/* Progress */}
            <div className="bg-white/20 rounded-xl p-3 backdrop-blur">
              <div className="flex justify-between text-white text-sm mb-2">
                <span>Progress</span>
                <span>{completedCount} dari {totalVideos} video</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Video Player */}
          <div className="md:col-span-2">
            <Card className="bg-white rounded-2xl p-0 border-0 shadow-md overflow-hidden">
              {/* Video Placeholder */}
              <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 relative flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center mx-auto mb-4 cursor-pointer hover:scale-110 transition-all">
                    <Play className="w-10 h-10 text-[#FF1B6B]" fill="#FF1B6B" />
                  </div>
                  <p className="text-gray-600">Video: {currentVideoData?.title}</p>
                </div>
              </div>

              {/* Video Info */}
              <div className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-4xl">{currentVideoData?.emoji}</span>
                  <div className="flex-1">
                    <h2 className="text-gray-800 mb-2">{currentVideoData?.title}</h2>
                    <p className="text-gray-600 text-sm mb-3">{currentVideoData?.description}</p>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{currentVideoData?.duration}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleVideoComplete}
                    className="flex-1 h-12 bg-gradient-to-r from-[#FF1B6B] to-[#CE93D8] text-white rounded-xl hover:scale-105"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Tandai Selesai
                  </Button>
                  {currentVideo < totalVideos ? (
                    <Button
                      onClick={() => setCurrentVideo(currentVideo + 1)}
                      className="h-12 px-6 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300"
                    >
                      Lewati
                    </Button>
                  ) : (
                    <Button
                      onClick={() => onNavigate('posttest')}
                      className="h-12 px-6 bg-[#66BB6A] text-white rounded-xl hover:bg-[#66BB6A]/90"
                    >
                      Post-Test
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Video List */}
          <div className="space-y-3">
            <h3 className="text-gray-800 mb-3">Daftar Video</h3>
            {videoSteps.map((video) => {
              const isCompleted = completedVideos.includes(video.id);
              const isCurrent = currentVideo === video.id;
              
              return (
                <Card
                  key={video.id}
                  onClick={() => setCurrentVideo(video.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    isCurrent
                      ? 'border-[#FF1B6B] bg-[#FF1B6B]/10 shadow-md'
                      : isCompleted
                      ? 'border-[#66BB6A] bg-[#66BB6A]/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                      isCompleted ? 'bg-[#66BB6A]/20' : 'bg-gray-100'
                    }`}>
                      {video.emoji}
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-sm mb-1 ${isCurrent ? 'text-[#FF1B6B]' : 'text-gray-800'}`}>
                        {video.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{video.duration}</span>
                      </div>
                    </div>
                    {isCompleted && (
                      <CheckCircle className="w-5 h-5 text-[#66BB6A]" />
                    )}
                    {isCurrent && !isCompleted && (
                      <Play className="w-5 h-5 text-[#FF1B6B]" />
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Tips Card */}
        <Card className="bg-gradient-to-r from-[#FFEB3B] to-[#FFA500] rounded-2xl p-5 mt-6 border-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center backdrop-blur text-2xl">
              💡
            </div>
            <div>
              <h4 className="text-white mb-1">Tips</h4>
              <p className="text-white/90 text-sm">
                Tonton video sampai selesai dan ulangi jika belum paham. Jangan ragu untuk bertanya pada mentor!
              </p>
            </div>
          </div>
        </Card>
      </div>

      <BottomNavPeserta onNavigate={onNavigate} currentPage="dashboard" />
    </div>
  );
}
