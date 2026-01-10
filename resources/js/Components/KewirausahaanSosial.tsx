import { TrendingUp, DollarSign, Users, Lightbulb, ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { HeaderPeserta } from "./HeaderPeserta";
import { BottomNavPeserta } from "./BottomNavPeserta";

interface KewirausahaanSosialProps {
  onNavigate: (page: string) => void;
  userName?: string;
}

export function KewirausahaanSosial({ onNavigate, userName = "Peserta" }: KewirausahaanSosialProps) {
  const [showSimulation, setShowSimulation] = useState(false);
  const [modalBudget, setModalBudget] = useState(1000000);
  const [dailySales, setDailySales] = useState(20);

  const modules = [
    {
      id: 1,
      title: "Dasar Bisnis Kopi",
      color: "from-[#FFB84C] to-[#FFA500]",
      icon: "☕",
      progress: 100,
      lessons: 8,
      status: "completed"
    },
    {
      id: 2,
      title: "Strategi Pemasaran",
      color: "from-[#66BB6A] to-[#7FFF00]",
      icon: "📢",
      progress: 60,
      lessons: 6,
      status: "current"
    },
    {
      id: 3,
      title: "Keuangan Mikro",
      color: "from-[#A2D2FF] to-[#1E90FF]",
      icon: "💰",
      progress: 30,
      lessons: 7,
      status: "current"
    },
    {
      id: 4,
      title: "Pelayanan Pelanggan",
      color: "from-[#CE93D8] to-[#9C27B0]",
      icon: "🤝",
      progress: 0,
      lessons: 5,
      status: "locked"
    }
  ];

  const monthlyProfit = (dailySales * 30 * 15000) - (modalBudget * 0.1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3E5F5] via-[#FCE4EC] to-[#FFF3E0] pb-24">
      <HeaderPeserta userName={userName} onNavigate={onNavigate} />

      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <Card className="bg-gradient-to-br from-[#FF6B00] to-[#FFA500] rounded-2xl p-6 mb-6 border-0 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-white/30 rounded-2xl flex items-center justify-center backdrop-blur text-4xl">
              💼
            </div>
            <div>
              <h1 className="text-white mb-1">Kewirausahaan Sosial</h1>
              <p className="text-white/90 text-sm">Belajar menjalankan bisnis kopi</p>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white text-sm">Progress Keseluruhan</span>
              <span className="text-white">48%</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: '48%' }}
              ></div>
            </div>
          </div>
        </Card>

        {/* Modules */}
        <h3 className="text-gray-800 mb-4">Modul Pembelajaran</h3>
        <div className="space-y-4 mb-6">
          {modules.map((module) => (
            <Card
              key={module.id}
              className={`rounded-2xl p-5 border-0 shadow-md transition-all ${
                module.status === 'locked'
                  ? 'bg-gray-200 opacity-60 cursor-not-allowed'
                  : `bg-gradient-to-r ${module.color} cursor-pointer hover:scale-105`
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl ${
                  module.status === 'locked' ? 'bg-gray-300' : 'bg-white/30 backdrop-blur'
                }`}>
                  {module.status === 'locked' ? '🔒' : module.icon}
                </div>

                <div className="flex-1">
                  <h4 className={`mb-1 ${
                    module.status === 'locked' ? 'text-gray-600' : 'text-white'
                  }`}>
                    {module.title}
                  </h4>
                  <p className={`text-sm mb-2 ${
                    module.status === 'locked' ? 'text-gray-500' : 'text-white/90'
                  }`}>
                    {module.lessons} pembelajaran
                  </p>
                  
                  {module.status !== 'locked' && (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-white rounded-full"
                          style={{ width: `${module.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-white text-xs">{module.progress}%</span>
                    </div>
                  )}
                </div>

                {module.status === 'completed' && (
                  <Badge className="bg-white/30 text-white border-0 px-3 py-1 text-xs">
                    ✓ Selesai
                  </Badge>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Business Simulation */}
        <Card className="bg-white rounded-2xl p-6 mb-6 border-0 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#00E5FF] to-[#1E90FF] rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-gray-800">Simulasi Bisnis</h3>
              <p className="text-gray-600 text-sm">Hitung proyeksi usaha kopi</p>
            </div>
          </div>

          {!showSimulation ? (
            <Button
              onClick={() => setShowSimulation(true)}
              className="w-full h-12 bg-gradient-to-r from-[#00E5FF] to-[#1E90FF] text-white rounded-xl hover:scale-105"
            >
              <PlayCircle className="w-5 h-5 mr-2" />
              Mulai Simulasi
            </Button>
          ) : (
            <div className="space-y-4">
              {/* Inputs */}
              <div>
                <label className="text-gray-700 text-sm mb-2 block">Modal Awal (Rp)</label>
                <input
                  type="range"
                  min="500000"
                  max="5000000"
                  step="100000"
                  value={modalBudget}
                  onChange={(e) => setModalBudget(parseInt(e.target.value))}
                  className="w-full"
                />
                <p className="text-gray-800 mt-1">Rp {modalBudget.toLocaleString('id-ID')}</p>
              </div>

              <div>
                <label className="text-gray-700 text-sm mb-2 block">Penjualan per Hari (cup)</label>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={dailySales}
                  onChange={(e) => setDailySales(parseInt(e.target.value))}
                  className="w-full"
                />
                <p className="text-gray-800 mt-1">{dailySales} cup/hari</p>
              </div>

              {/* Results */}
              <div className="bg-gradient-to-r from-[#66BB6A]/20 to-[#7FFF00]/20 p-4 rounded-xl mt-4">
                <h4 className="text-gray-800 mb-3">Proyeksi Bulanan</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Pendapatan:</span>
                    <span className="text-gray-800">Rp {(dailySales * 30 * 15000).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Biaya Operasional:</span>
                    <span className="text-gray-800">Rp {(modalBudget * 0.1).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="text-gray-800">Keuntungan Bersih:</span>
                    <span className={`${monthlyProfit > 0 ? 'text-[#66BB6A]' : 'text-red-500'}`}>
                      Rp {monthlyProfit.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Tips */}
        <Card className="bg-gradient-to-r from-[#FFEB3B] to-[#FFA500] rounded-2xl p-5 border-0 shadow-md mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center backdrop-blur">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-white mb-1">Tips Wirausaha</h4>
              <p className="text-white/90 text-sm">
                Mulai dengan modal kecil, fokus pada kualitas produk dan pelayanan yang ramah!
              </p>
            </div>
          </div>
        </Card>

        {/* Action */}
        <Button
          onClick={() => onNavigate('dashboard')}
          className="w-full h-12 bg-white text-gray-700 rounded-xl shadow-md hover:bg-gray-50"
        >
          Kembali ke Dashboard
        </Button>
      </div>

      <BottomNavPeserta onNavigate={onNavigate} currentPage="dashboard" />
    </div>
  );
}
