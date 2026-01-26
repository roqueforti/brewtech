import React, { useState } from 'react';
import { TrendingUp, Award, BookOpen, AlertCircle, Menu } from "lucide-react";
import { Card } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import SidebarPeserta from '@/Components/SidebarPeserta'; // Pastikan path import benar

// --- Types ---
export interface AssessmentData {
  period: string;
  preTestScore: number;
  postTestScore: number;
  activityScore: number;
  status: "Kompeten" | "Belum Kompeten"; 
  knowledgeRating: "Sangat Baik" | "Baik" | "Cukup" | "Kurang";
  skillRating: "Sangat Baik" | "Baik" | "Cukup" | "Kurang";
  attitudeRating: "Sangat Baik" | "Baik" | "Cukup" | "Kurang";
  strengths: string[];
  areasToImprove: string[];
  overallScore: number;
  recommendationText: string;
  isAboveAverage: boolean;
}

interface HasilSPKProps {
  // onNavigate mungkin tidak diperlukan jika menggunakan Link inertia di sidebar
  // tapi saya biarkan optional jika Anda masih memakainya untuk tombol internal
  onNavigate?: (page: string) => void; 
  auth: { user: any }; // Butuh data user untuk sidebar
  data?: AssessmentData;
}

export default function HasilSPK({ onNavigate, auth, data }: HasilSPKProps) {
  // State untuk sidebar mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- Helper Functions ---
  const getScoreDifference = (pre: number, post: number) => post - pre;

  const getStatusColor = (status: string) => {
    return status === "Kompeten" ? "bg-green-500" : "bg-yellow-500";
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case "Sangat Baik": return "text-orange-600";
      case "Baik": return "text-blue-600";
      case "Cukup": return "text-yellow-600";
      default: return "text-gray-600";
    }
  };

  // --- Content Render Logic ---
  const renderContent = () => {
    if (!data) {
        return (
          <div className="flex flex-col items-center justify-center h-full min-h-[50vh] text-center p-6">
             <AlertCircle className="w-16 h-16 text-gray-300 mb-4" />
             <h3 className="text-lg font-bold text-gray-700">Data Belum Tersedia</h3>
             <p className="text-gray-500 mb-6">Kamu belum menyelesaikan asesmen untuk periode ini.</p>
             {onNavigate && (
                 <Button onClick={() => onNavigate('dashboard')} variant="outline">
                   Kembali ke Dashboard
                 </Button>
             )}
          </div>
        );
    }

    const scoreDiff = getScoreDifference(data.preTestScore, data.postTestScore);
    const isPositiveDiff = scoreDiff >= 0;

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Summary Card */}
            <Card className="bg-white p-6 rounded-2xl border-0 shadow-sm">
              <div className="text-center mb-6">
                <div className="text-5xl mb-3">🎯</div>
                <h3 className="text-gray-800 font-bold text-xl mb-1">Ringkasan Nilai</h3>
                <p className="text-gray-500 text-sm">Periode: {data.period}</p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-yellow-50 p-4 rounded-xl text-center border border-yellow-100">
                  <p className="text-gray-500 text-xs uppercase font-bold mb-1">Pre-Test</p>
                  <p className="text-gray-800 font-black text-xl">{data.preTestScore}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl text-center border border-green-100">
                  <p className="text-gray-500 text-xs uppercase font-bold mb-1">Post-Test</p>
                  <p className="text-gray-800 font-black text-xl">{data.postTestScore}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl text-center border border-blue-100">
                  <p className="text-gray-500 text-xs uppercase font-bold mb-1">Aktivitas</p>
                  <p className="text-gray-800 font-black text-xl">{data.activityScore}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 justify-center font-medium text-sm">
                <TrendingUp className={`w-4 h-4 ${isPositiveDiff ? 'text-green-600' : 'text-red-500'}`} />
                <span className={`${isPositiveDiff ? 'text-green-600' : 'text-red-500'}`}>
                  {isPositiveDiff ? '+' : ''}{scoreDiff} poin dari pre-test!
                </span>
              </div>
            </Card>

            {/* Assessment Result */}
            <Card className="bg-white p-6 rounded-2xl border-0 shadow-sm">
              <h3 className="text-gray-800 font-bold text-lg mb-1">Hasil Asesmen SPK</h3>
              <p className="text-gray-500 text-sm mb-6">Analisis sistem pendukung keputusan</p>

              <div className="space-y-6">
                {/* Status Badge */}
                <div className={`bg-opacity-10 border-2 p-6 rounded-2xl text-center ${data.status === 'Kompeten' ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                  <div className="text-4xl mb-3">🏆</div>
                  <Badge className={`${getStatusColor(data.status)} hover:${getStatusColor(data.status)} text-white border-0 px-6 py-1.5 mb-3 text-sm tracking-wide`}>
                    {data.status.toUpperCase()}
                  </Badge>
                  <p className="text-gray-600 text-sm font-medium">
                    {data.status === 'Kompeten' 
                      ? "Selamat! Kemampuan kamu sudah memenuhi standar." 
                      : "Semangat! Terus berlatih untuk mencapai standar."}
                  </p>
                </div>

                {/* Scores Breakdown */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-4 bg-blue-50 rounded-2xl border border-blue-100">
                    <div className="text-2xl mb-2">📚</div>
                    <p className="text-gray-500 text-xs font-bold uppercase mb-1">Pengetahuan</p>
                    <p className={`font-black ${getRatingColor(data.knowledgeRating)}`}>{data.knowledgeRating}</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-2xl border border-orange-100">
                    <div className="text-2xl mb-2">🛠️</div>
                    <p className="text-gray-500 text-xs font-bold uppercase mb-1">Keterampilan</p>
                    <p className={`font-black ${getRatingColor(data.skillRating)}`}>{data.skillRating}</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-2xl border border-purple-100">
                    <div className="text-2xl mb-2">💼</div>
                    <p className="text-gray-500 text-xs font-bold uppercase mb-1">Sikap</p>
                    <p className={`font-black ${getRatingColor(data.attitudeRating)}`}>{data.attitudeRating}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Detailed Analysis */}
            <Card className="bg-white p-6 rounded-2xl border-0 shadow-sm">
              <h3 className="text-gray-800 font-bold text-lg mb-4">Analisis Detail</h3>

              <div className="space-y-6">
                {/* Strength */}
                {data.strengths.length > 0 && (
                  <div className="bg-green-50/50 p-4 rounded-xl border border-green-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                        <span className="text-lg">💪</span>
                      </div>
                      <h4 className="text-green-800 font-bold">Kelebihan</h4>
                    </div>
                    <ul className="space-y-2 ml-2 text-sm text-gray-600">
                      {data.strengths.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Areas to Improve */}
                {data.areasToImprove.length > 0 && (
                  <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                        <span className="text-lg">📈</span>
                      </div>
                      <h4 className="text-orange-800 font-bold">Area Pengembangan</h4>
                    </div>
                    <ul className="space-y-2 ml-2 text-sm text-gray-600">
                      {data.areasToImprove.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                            <span className="text-orange-500 mt-1">•</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Overall Score */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-700 font-bold">Nilai Keseluruhan</span>
                  <span className="text-2xl font-black text-green-600">{data.overallScore}%</span>
                </div>
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-1000"
                    style={{ width: `${data.overallScore}%` }}
                  ></div>
                </div>
              </div>

              {data.isAboveAverage && (
                <div className="bg-orange-50 p-3 rounded-xl mt-6 text-center border border-orange-100">
                  <p className="text-orange-700 text-sm font-medium">
                    🎉 Hebat! Nilai kamu di atas rata-rata kelas.
                  </p>
                </div>
              )}
            </Card>

            {/* Recommendations */}
            <Card className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 border-0 shadow-lg text-white">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Rekomendasi Selanjutnya</h3>
                  <p className="text-white/90 text-sm leading-relaxed">
                    {data.recommendationText}
                  </p>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-10">
              {onNavigate && (
                  <Button 
                    onClick={() => onNavigate('dashboard')}
                    className="h-14 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 rounded-xl font-bold"
                  >
                    Kembali ke Dashboard
                  </Button>
              )}
              {onNavigate && (
                  <Button 
                    onClick={() => onNavigate('kewirausahaan')}
                    className="h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-lg shadow-orange-200 font-bold"
                  >
                    <BookOpen className="w-5 h-5 mr-2" />
                    Modul Kewirausahaan
                  </Button>
              )}
            </div>
        </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
      
      {/* --- 1. SIDEBAR (DESKTOP) --- */}
      <div className="hidden lg:block w-72 shrink-0 h-full border-r border-gray-200 bg-white">
          <SidebarPeserta auth={auth} />
      </div>

      {/* --- 2. SIDEBAR (MOBILE OVERLAY) --- */}
      {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
              <div 
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
                  onClick={() => setIsMobileMenuOpen(false)}
              />
              <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-2xl animate-in slide-in-from-left duration-300">
                  <SidebarPeserta auth={auth} />
              </div>
          </div>
      )}

      {/* --- 3. MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#F8F9FA]">
          
          {/* Header Mobile */}
          <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 sticky top-0 z-30">
              <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
                      <Menu className="h-6 w-6" />
                  </Button>
                  <h1 className="font-bold text-lg">Hasil SPK</h1>
              </div>
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {auth.user.name.charAt(0)}
              </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
              
              {/* Header Halaman (Desktop) */}
              <div className="hidden lg:block mb-8">
                  <h1 className="text-2xl font-black text-gray-800">Rapor Kompetensi</h1>
                  <p className="text-gray-500 font-medium">Analisis detail performa dan rekomendasi karirmu.</p>
              </div>

              {renderContent()}
          </div>
      </main>
    </div>
  );
}