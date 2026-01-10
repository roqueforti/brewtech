import { TrendingUp, Award, BookOpen } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { HeaderPeserta } from "./HeaderPeserta";
import { BottomNavPeserta } from "./BottomNavPeserta";

interface HasilSPKProps {
  onNavigate: (page: string) => void;
  userName?: string;
}

export function HasilSPK({ onNavigate, userName = "Peserta" }: HasilSPKProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3E5F5] via-[#FCE4EC] to-[#FFF3E0] pb-24">
      <HeaderPeserta userName={userName} onNavigate={onNavigate} />

      {/* Content */}
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Summary Card */}
        <Card className="bg-white p-6 rounded-2xl border-0 shadow-md">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">🎯</div>
            <h3 className="text-gray-800 mb-2">Ringkasan Nilai</h3>
            <p className="text-gray-600 text-sm">Periode: November 2024</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-[#FFD166]/20 p-4 rounded-xl text-center">
              <p className="text-gray-600 text-sm mb-1">Pre-Test</p>
              <p className="text-gray-800">72</p>
            </div>
            <div className="bg-[#66BB6A]/20 p-4 rounded-xl text-center">
              <p className="text-gray-600 text-sm mb-1">Post-Test</p>
              <p className="text-gray-800">88</p>
            </div>
            <div className="bg-[#A2D2FF]/20 p-4 rounded-xl text-center">
              <p className="text-gray-600 text-sm mb-1">Aktivitas</p>
              <p className="text-gray-800">95</p>
            </div>
          </div>

          <div className="flex items-center gap-2 justify-center">
            <TrendingUp className="w-5 h-5 text-[#66BB6A]" />
            <span className="text-[#66BB6A]">+16 poin dari pre-test!</span>
          </div>
        </Card>

        {/* Assessment Result */}
        <Card className="bg-white p-6 rounded-2xl border-0 shadow-md">
          <h3 className="text-gray-800 mb-2">Hasil Asesmen SPK</h3>
          <p className="text-gray-600 text-sm mb-6">Berdasarkan analisis sistem pendukung keputusan</p>

          <div className="space-y-4">
            {/* Status Badge */}
            <div className="bg-[#66BB6A]/10 border-2 border-[#66BB6A] p-5 rounded-2xl text-center">
              <div className="text-4xl mb-3">🏆</div>
              <Badge className="bg-[#66BB6A] text-white border-0 px-4 py-1 mb-3">
                KOMPETEN
              </Badge>
              <p className="text-gray-700 text-sm">
                Kemampuan kamu sudah memenuhi standar kompetensi!
              </p>
            </div>

            {/* Scores Breakdown */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-[#A2D2FF]/20 rounded-xl">
                <div className="text-2xl mb-2">📚</div>
                <p className="text-gray-600 text-xs mb-1">Pengetahuan</p>
                <p className="text-[#1E90FF]">Baik</p>
              </div>
              <div className="text-center p-3 bg-[#FFD166]/20 rounded-xl">
                <div className="text-2xl mb-2">🛠️</div>
                <p className="text-gray-600 text-xs mb-1">Keterampilan</p>
                <p className="text-[#FF6B00]">Sangat Baik</p>
              </div>
              <div className="text-center p-3 bg-[#CE93D8]/20 rounded-xl">
                <div className="text-2xl mb-2">💼</div>
                <p className="text-gray-600 text-xs mb-1">Sikap</p>
                <p className="text-[#9C27B0]">Baik</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Detailed Analysis */}
        <Card className="bg-white p-6 rounded-2xl border-0 shadow-md">
          <h3 className="text-gray-800 mb-4">Analisis Detail</h3>

          <div className="space-y-4">
            {/* Strength */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-[#66BB6A]/20 rounded-lg flex items-center justify-center">
                  <span className="text-lg">💪</span>
                </div>
                <h4 className="text-gray-800">Kelebihan</h4>
              </div>
              <ul className="space-y-1 ml-10 text-sm text-gray-600">
                <li>• Sangat teliti dalam mengikuti instruksi</li>
                <li>• Cepat memahami konsep baru</li>
                <li>• Sikap kerja yang baik</li>
              </ul>
            </div>

            {/* Areas to Improve */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-[#FFD166]/20 rounded-lg flex items-center justify-center">
                  <span className="text-lg">📈</span>
                </div>
                <h4 className="text-gray-800">Area Pengembangan</h4>
              </div>
              <ul className="space-y-1 ml-10 text-sm text-gray-600">
                <li>• Tingkatkan kecepatan dalam bekerja</li>
                <li>• Lebih banyak latihan praktik</li>
              </ul>
            </div>
          </div>

          {/* Overall Score */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-700">Nilai Keseluruhan</span>
              <span className="text-2xl text-[#66BB6A]">89%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#66BB6A] to-[#7FFF00] rounded-full"
                style={{ width: '89%' }}
              ></div>
            </div>
          </div>

          <div className="bg-[#FFF9F3] p-4 rounded-xl mt-4">
            <p className="text-gray-700 text-center text-sm">
              🎉 Nilai kamu di atas rata-rata kelas!
            </p>
          </div>
        </Card>

        {/* Recommendations */}
        <Card className="bg-gradient-to-r from-[#9C27B0] to-[#E91E63] rounded-2xl p-6 border-0 shadow-md">
          <div className="flex items-start gap-3 text-white mb-4">
            <Award className="w-6 h-6 mt-1" />
            <div>
              <h3 className="mb-2">Rekomendasi Selanjutnya</h3>
              <p className="text-white/90 text-sm">
                Berdasarkan hasil analisis, kami merekomendasikan untuk melanjutkan ke workshop berikutnya dan mengeksplorasi modul kewirausahaan.
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
            Kembali ke Dashboard
          </Button>
          <Button 
            onClick={() => onNavigate('kewirausahaan')}
            className="h-12 bg-gradient-to-r from-[#FF6B00] to-[#FFA500] text-white rounded-xl shadow-md hover:scale-105"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Modul Kewirausahaan
          </Button>
        </div>
      </div>

      <BottomNavPeserta onNavigate={onNavigate} currentPage="hasil-spk" />
    </div>
  );
}
