import { BarChart3, Users, GraduationCap, Download } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { HeaderPengajar } from "./HeaderPengajar";

interface AnalisisSPKProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  onBackToRoleSelection?: () => void;
}

export function AnalisisSPK({ onNavigate, currentPage, onBackToRoleSelection }: AnalisisSPKProps) {

  const pesertaData = [
    {
      nama: 'Andi Wijaya',
      kelas: 'Kelas A - Pagi',
      visualRecognition: 85,
      softSkill: 82,
      totalNilai: 83.5,
      status: 'Siap PKL',
      rekomendasi: 'Lulus dengan nilai baik'
    },
    {
      nama: 'Siti Nurhaliza',
      kelas: 'Kelas A - Pagi',
      visualRecognition: 92,
      softSkill: 90,
      totalNilai: 91,
      status: 'Siap PKL',
      rekomendasi: 'Lulus dengan nilai sangat baik'
    },
    {
      nama: 'Budi Santoso',
      kelas: 'Kelas B - Siang',
      visualRecognition: 75,
      softSkill: 78,
      totalNilai: 76.5,
      status: 'Perlu Pendampingan',
      rekomendasi: 'Perlu pendampingan tambahan'
    },
    {
      nama: 'Dewi Lestari',
      kelas: 'Kelas B - Siang',
      visualRecognition: 65,
      softSkill: 70,
      totalNilai: 67.5,
      status: 'Perlu Pelatihan Lanjutan',
      rekomendasi: 'Perlu pelatihan lanjutan'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Siap PKL':
        return 'from-[#00B8D4] to-[#00E5FF]';
      case 'Perlu Pendampingan':
        return 'from-[#9C27B0] to-[#CE93D8]';
      case 'Perlu Pelatihan Lanjutan':
        return 'from-[#FF6B00] to-[#FF9E40]';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getNilaiColor = (nilai: number) => {
    if (nilai >= 85) return 'text-green-600';
    if (nilai >= 70) return 'text-blue-600';
    return 'text-orange-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3E5F5] via-[#FCE4EC] to-[#FFF3E0]">
      <HeaderPengajar onNavigate={onNavigate} currentPage={currentPage} onBackToRoleSelection={onBackToRoleSelection} />

      {/* Main Content */}
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0 mb-6">
          <div>
            <h2 className="text-gray-800 text-xl md:text-2xl mb-2">Hasil Analisis SPK (Sistem Pendukung Keputusan)</h2>
            <p className="text-gray-600 text-sm md:text-base">Penilaian Visual Recognition & Soft Skill peserta pelatihan</p>
          </div>
          <Button className="bg-gradient-to-r from-[#9C27B0] to-[#E91E63] hover:opacity-90 text-white border-0 rounded-xl h-10 md:h-11 px-4 md:px-6 shadow-lg w-full md:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Export Laporan
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card className="bg-gradient-to-br from-[#00B8D4] to-[#00E5FF] p-5 md:p-6 rounded-2xl md:rounded-3xl border-0 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-white/30 rounded-2xl flex items-center justify-center backdrop-blur">
                <GraduationCap className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <Badge className="bg-white/30 text-white border-0 rounded-full backdrop-blur">75%</Badge>
            </div>
            <h3 className="text-white/90 text-sm mb-2">Siap PKL</h3>
            <p className="text-white text-3xl">12 Peserta</p>
          </Card>

          <Card className="bg-gradient-to-br from-[#9C27B0] to-[#CE93D8] p-5 md:p-6 rounded-2xl md:rounded-3xl border-0 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-white/30 rounded-2xl flex items-center justify-center backdrop-blur">
                <Users className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <Badge className="bg-white/30 text-white border-0 rounded-full backdrop-blur">18%</Badge>
            </div>
            <h3 className="text-white/90 text-sm mb-2">Perlu Pendampingan</h3>
            <p className="text-white text-3xl">8 Peserta</p>
          </Card>

          <Card className="bg-gradient-to-br from-[#FF6B00] to-[#FF9E40] p-5 md:p-6 rounded-2xl md:rounded-3xl border-0 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-white/30 rounded-2xl flex items-center justify-center backdrop-blur">
                <BarChart3 className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <Badge className="bg-white/30 text-white border-0 rounded-full backdrop-blur">7%</Badge>
            </div>
            <h3 className="text-white/90 text-sm mb-2">Pelatihan Lanjutan</h3>
            <p className="text-white text-3xl">4 Peserta</p>
          </Card>
        </div>

        {/* Data Table */}
        <Card className="bg-white rounded-2xl md:rounded-3xl border-0 shadow-lg overflow-hidden">
          <div className="p-4 md:p-6 border-b-2 border-gray-100">
            <h3 className="text-gray-800 text-lg md:text-xl">Detail Penilaian Peserta</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#F3E5F5] to-[#FCE4EC]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">No</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nama Peserta</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Kelas</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Visual Recognition</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Soft Skill</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Total Nilai</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Rekomendasi</th>
                </tr>
              </thead>
              <tbody>
                {pesertaData.map((peserta, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#9C27B0] to-[#E91E63] rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-800 font-medium">{peserta.nama}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className="bg-gray-100 text-gray-700 border-0 rounded-full">
                        {peserta.kelas}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-lg font-semibold ${getNilaiColor(peserta.visualRecognition)}`}>
                        {peserta.visualRecognition}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-lg font-semibold ${getNilaiColor(peserta.softSkill)}`}>
                        {peserta.softSkill}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className={`text-xl font-bold ${getNilaiColor(peserta.totalNilai)}`}>
                          {peserta.totalNilai}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={`bg-gradient-to-r ${getStatusColor(peserta.status)} text-white border-0 rounded-full text-xs`}>
                        {peserta.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600 text-sm">{peserta.rekomendasi}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gradient-to-r from-[#F3E5F5] to-[#FCE4EC] border-t-2 border-gray-100">
            <p className="text-gray-600 text-sm">
              Total: {pesertaData.length} peserta • Rata-rata nilai: {(pesertaData.reduce((acc, p) => acc + p.totalNilai, 0) / pesertaData.length).toFixed(1)}
            </p>
          </div>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card className="bg-gradient-to-br from-[#FF1B6B] to-[#FF6B9D] rounded-3xl p-6 border-0 shadow-lg">
            <h4 className="text-white text-lg mb-3">📊 Kriteria Penilaian SPK</h4>
            <div className="space-y-2 text-white/90 text-sm">
              <p>• Visual Recognition: Kemampuan mengenali alat & bahan</p>
              <p>• Soft Skill: Kemampuan komunikasi & pelayanan</p>
              <p>• Nilai ≥ 85: Siap PKL</p>
              <p>• Nilai 70-84: Perlu Pendampingan</p>
              <p>• Nilai &lt; 70: Pelatihan Lanjutan</p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-[#00B8D4] to-[#00E5FF] rounded-3xl p-6 border-0 shadow-lg">
            <h4 className="text-white text-lg mb-3">💡 Rekomendasi Tindak Lanjut</h4>
            <div className="space-y-2 text-white/90 text-sm">
              <p>• Siap PKL: Dapat mengikuti program magang</p>
              <p>• Perlu Pendampingan: Bimbingan khusus 1-2 minggu</p>
              <p>• Pelatihan Lanjutan: Mengulang modul tertentu</p>
              <p>• Evaluasi berkala setiap akhir workshop</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
