import { Head, Link } from "@inertiajs/react";
import SidebarPengajar from "@/Components/SidebarPengajar";
import HeaderPengajar from "@/Components/HeaderPengajar";
import { ArrowLeft, School, Accessibility, BookOpen } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Progress } from "@/Components/ui/progress";

// Tipe Data
interface StudentDetailProps {
    auth: any;
    student: {
        id: number;
        name: string;
        // email dihapus
        phone: string;
        avatar: string;
        kelas: string;
        join_date: string;
        status_pkl: string; // Ini yang jadi badge utama
        age: string;
        school_grade: string;
        disability: string;
        // persona dihapus
    };
    stats: {
        progress: number;
        avg_score: number;
        completed_modules: number;
        total_modules: number;
    };
    workshops: any[]; 
    history: any[]; 
}

export default function DetailSiswa({ auth, student, stats, workshops }: StudentDetailProps) {
    return (
        <div className="flex min-h-screen bg-background font-sans text-foreground">
            <Head title={`Detail Siswa - ${student.name}`} />
            <div className="hidden md:block"><SidebarPengajar /></div>
            
            <main className="flex-1 w-full flex flex-col bg-[#FAFAF9] h-screen overflow-hidden">
                <HeaderPengajar />
                
                <div className="flex-1 overflow-y-auto p-6 md:p-10">
                    <div className="max-w-6xl mx-auto pb-20">
                        
                        {/* HEADER NAV */}
                        <div className="mb-6">
                            <Link href="/pengajar/siswa" className="inline-flex items-center text-muted-foreground hover:text-primary mb-4 font-bold transition-colors text-sm">
                                <ArrowLeft size={18} className="mr-2" /> Kembali ke Data Peserta
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            
                            {/* KOLOM KIRI: PROFIL RINGKAS */}
                            <div className="lg:col-span-1 space-y-6">
                                <Card className="rounded-[2.5rem] border-2 border-border/60 shadow-sm overflow-hidden bg-white">
                                    <div className="h-24 bg-gradient-to-r from-orange-100 to-amber-100"></div>
                                    <div className="px-6 pb-6 relative text-center">
                                        <Avatar className="h-24 w-24 border-4 border-white shadow-md mx-auto -mt-12 bg-white">
                                            <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${student.name}`} />
                                            <AvatarFallback className="text-2xl font-black bg-slate-100 text-slate-500">{student.avatar}</AvatarFallback>
                                        </Avatar>
                                        
                                        <h2 className="mt-3 text-2xl font-black text-slate-800">{student.name}</h2>
                                        
                                        {/* BADGE STATUS PKL (HASIL SPK) */}
                                        <div className="mt-2 flex justify-center">
                                            <Badge className={`
                                                px-3 py-1 text-sm font-bold shadow-sm
                                                ${student.status_pkl === 'Siap PKL' ? 'bg-green-100 text-green-700 hover:bg-green-100 border-green-200' : 
                                                  student.status_pkl === 'Butuh Pendampingan' ? 'bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200' :
                                                  'bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200'}
                                            `}>
                                                {student.status_pkl || 'Belum Evaluasi'}
                                            </Badge>
                                        </div>

                                        <div className="mt-6 space-y-3 text-left">
                                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                                <School size={16} className="text-slate-400" /> 
                                                <span className="font-bold">Jenjang:</span> {student.school_grade}
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                                <Accessibility size={16} className="text-slate-400" /> 
                                                <span className="font-bold">Disabilitas:</span> {student.disability || '-'}
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                                <BookOpen size={16} className="text-slate-400" /> 
                                                <span className="font-bold">Kelas:</span> {student.kelas}
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="rounded-[2.5rem] border-2 border-border/60 shadow-sm bg-white p-6">
                                    <h3 className="font-black text-lg mb-4 text-slate-800">Statistik Belajar</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                                                <span>Progres Total</span>
                                                <span>{stats.progress}%</span>
                                            </div>
                                            <Progress value={stats.progress} className="h-2" indicatorClassName="bg-primary"/>
                                        </div>
                                        <div className="flex justify-between items-center border-t pt-4">
                                            <span className="text-sm font-bold text-slate-600">Rata-rata Nilai</span>
                                            <span className="text-xl font-black text-primary">{stats.avg_score}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-t pt-4">
                                            <span className="text-sm font-bold text-slate-600">Modul Selesai</span>
                                            <span className="text-xl font-black text-green-600">{stats.completed_modules}/{stats.total_modules}</span>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* KOLOM KANAN: DETAIL MODUL & NILAI */}
                            <div className="lg:col-span-2 space-y-6">
                                <Card className="rounded-[2.5rem] border-2 border-border/60 shadow-sm bg-white overflow-hidden">
                                    <CardHeader className="border-b border-border/60 p-6 bg-slate-50/50">
                                        <CardTitle className="text-xl font-black text-slate-800">Riwayat Pelatihan</CardTitle>
                                    </CardHeader>
                                    <div className="p-6 space-y-4">
                                        {workshops.map((ws, idx) => (
                                            <div key={idx} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-white border-2 border-slate-100 rounded-2xl hover:border-orange-200 transition-colors gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-bold text-lg ${ws.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                                                        {idx + 1}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-800">{ws.title}</h4>
                                                        <p className="text-xs text-muted-foreground">Terakhir update: {ws.last_update}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                                                    <Badge variant={ws.status === 'completed' ? 'default' : 'outline'} className={ws.status === 'completed' ? 'bg-green-500 hover:bg-green-600' : 'text-slate-400'}>
                                                        {ws.status === 'completed' ? 'Selesai' : 'Belum Selesai'}
                                                    </Badge>
                                                    <div className="text-right min-w-[60px]">
                                                        <span className="block text-[10px] font-bold text-slate-400 uppercase">Nilai</span>
                                                        <span className="text-xl font-black text-slate-800">{ws.score || '-'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {workshops.length === 0 && (
                                            <div className="text-center py-10 text-slate-400">Belum ada modul yang dikerjakan.</div>
                                        )}
                                    </div>
                                </Card>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}