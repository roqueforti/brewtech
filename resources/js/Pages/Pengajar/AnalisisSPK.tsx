import { useState } from "react";
import { BarChart3, Users, GraduationCap, Download, FileText, Search } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import SidebarPengajar from "@/Components/SidebarPengajar";
import HeaderPengajar from "@/Components/HeaderPengajar"; 
import { Head } from "@inertiajs/react";

// Tipe Data
interface StudentSPK {
  id: number;
  nama: string;
  kelas: string;
  visualRecognition: number;
  softSkill: number;
  totalNilai: number;
  status: string;
  rekomendasi: string;
}

interface AnalisisSPKProps {
  auth: { user: { name: string } };
  students?: StudentSPK[]; // Opsional agar tidak crash jika undefined
}

// ✅ Tambahkan default value students = [] di sini untuk mencegah Blank Screen
export default function AnalisisSPK({ auth, students = [] }: AnalisisSPKProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter Data
  const filteredPeserta = students.filter(p => 
    p.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.kelas.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Hitung Statistik
  const stats = {
    siap: students.filter(s => s.status === 'Siap PKL').length,
    pendampingan: students.filter(s => s.status === 'Perlu Pendampingan').length,
    lanjutan: students.filter(s => s.status === 'Perlu Pelatihan Lanjutan').length,
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Siap PKL': return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' };
      case 'Perlu Pendampingan': return { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' };
      case 'Perlu Pelatihan Lanjutan': return { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' };
      default: return { bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-border' };
    }
  };

  const getNilaiColor = (nilai: number) => {
    if (nilai >= 85) return 'text-green-600';
    if (nilai >= 75) return 'text-purple-600';
    return 'text-orange-600';
  };

  return (
    <div className="flex min-h-screen bg-background font-sans text-foreground">
      <Head title="Analisis SPK" />
      <SidebarPengajar />

      <main className="flex-1 w-full flex flex-col">
        {/* Header Dinamis */}
        <HeaderPengajar onSearch={(q) => setSearchQuery(q)} />

        <div className="p-6 md:p-10 flex-1 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-foreground mb-2">Analisis SPK 📊</h1>
              <p className="text-muted-foreground font-medium text-lg">Keputusan kelulusan berbasis data real-time.</p>
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl h-12 px-6 shadow-lg border-b-4 border-orange-600 active:border-b-0 active:translate-y-1 transition-all font-bold">
              <Download className="w-5 h-5 mr-2" />
              Export Laporan
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-green-50 p-6 rounded-[2rem] border-2 border-green-200 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-green-500 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-8 h-8" strokeWidth={2.5} />
                </div>
                <Badge className="bg-green-200 text-green-800 border-0 rounded-full px-3 py-1 font-bold">Lulus</Badge>
              </div>
              <h3 className="text-green-800 font-bold text-sm uppercase tracking-wider mb-1">Siap PKL</h3>
              <p className="text-green-900 text-4xl font-black">{stats.siap} <span className="text-lg font-medium opacity-60">Siswa</span></p>
            </Card>

            <Card className="bg-purple-50 p-6 rounded-[2rem] border-2 border-purple-200 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-purple-500 group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8" strokeWidth={2.5} />
                </div>
                <Badge className="bg-purple-200 text-purple-800 border-0 rounded-full px-3 py-1 font-bold">Pantau</Badge>
              </div>
              <h3 className="text-purple-800 font-bold text-sm uppercase tracking-wider mb-1">Butuh Pendampingan</h3>
              <p className="text-purple-900 text-4xl font-black">{stats.pendampingan} <span className="text-lg font-medium opacity-60">Siswa</span></p>
            </Card>

            <Card className="bg-orange-50 p-6 rounded-[2rem] border-2 border-orange-200 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-orange-500 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-8 h-8" strokeWidth={2.5} />
                </div>
                <Badge className="bg-orange-200 text-orange-800 border-0 rounded-full px-3 py-1 font-bold">Remedial</Badge>
              </div>
              <h3 className="text-orange-800 font-bold text-sm uppercase tracking-wider mb-1">Pelatihan Lanjutan</h3>
              <p className="text-orange-900 text-4xl font-black">{stats.lanjutan} <span className="text-lg font-medium opacity-60">Siswa</span></p>
            </Card>
          </div>

          {/* Data Table */}
          <Card className="bg-card rounded-[2.5rem] border-2 border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b-2 border-border bg-muted/20 flex justify-between items-center">
              <h3 className="text-foreground text-xl font-black flex items-center gap-2">
                  <FileText className="text-primary" />
                  Detail Penilaian
              </h3>
              {searchQuery && (
                  <span className="text-sm text-muted-foreground bg-background px-3 py-1 rounded-lg border border-border">
                      Mencari: "{searchQuery}"
                  </span>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="px-6 py-5 text-left text-sm font-black text-foreground uppercase tracking-wider">Siswa</th>
                    <th className="px-6 py-5 text-left text-sm font-black text-foreground uppercase tracking-wider">Kelas</th>
                    <th className="px-6 py-5 text-center text-sm font-black text-foreground uppercase tracking-wider">Visual</th>
                    <th className="px-6 py-5 text-center text-sm font-black text-foreground uppercase tracking-wider">Soft Skill</th>
                    <th className="px-6 py-5 text-center text-sm font-black text-foreground uppercase tracking-wider">Total</th>
                    <th className="px-6 py-5 text-left text-sm font-black text-foreground uppercase tracking-wider">Status</th>
                    <th className="px-6 py-5 text-left text-sm font-black text-foreground uppercase tracking-wider">Rekomendasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredPeserta.length > 0 ? filteredPeserta.map((peserta, index) => {
                      const style = getStatusStyle(peserta.status);
                      return (
                          <tr key={index} className="hover:bg-muted/20 transition-colors group bg-card">
                              <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center font-bold text-sm">
                                          {index + 1}
                                      </div>
                                      <p className="text-foreground font-bold text-base group-hover:text-primary transition-colors">{peserta.nama}</p>
                                  </div>
                              </td>
                              <td className="px-6 py-4">
                                  <Badge variant="outline" className="border-2 border-border text-muted-foreground font-medium rounded-lg">
                                      {peserta.kelas}
                                  </Badge>
                              </td>
                              <td className="px-6 py-4 text-center">
                                  <span className={`text-lg font-black ${getNilaiColor(peserta.visualRecognition)}`}>
                                      {peserta.visualRecognition}
                                  </span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                  <span className={`text-lg font-black ${getNilaiColor(peserta.softSkill)}`}>
                                      {peserta.softSkill}
                                  </span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                  <div className="bg-muted/30 rounded-xl py-1 px-3 border border-border inline-block">
                                      <span className={`text-xl font-black ${getNilaiColor(peserta.totalNilai)}`}>
                                          {peserta.totalNilai}
                                      </span>
                                  </div>
                              </td>
                              <td className="px-6 py-4">
                                  <Badge className={`${style.bg} ${style.text} ${style.border} border px-3 py-1.5 rounded-full font-bold shadow-none`}>
                                      {peserta.status}
                                  </Badge>
                              </td>
                              <td className="px-6 py-4">
                                  <p className="text-muted-foreground text-sm font-medium line-clamp-2">{peserta.rekomendasi}</p>
                              </td>
                          </tr>
                      );
                  }) : (
                    <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground italic">
                            Belum ada data penilaian siswa.
                        </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}