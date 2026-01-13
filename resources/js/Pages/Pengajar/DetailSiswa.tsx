import { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import SidebarPengajar from "@/Components/SidebarPengajar";
import { 
    ArrowLeft, Award, BookOpen, 
    Calendar, CheckCircle, TrendingUp, Star, Activity, Clock 
} from "lucide-react";
import { Card } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";

// --- TYPES ---
interface WorkshopData {
    title: string;
    status: string;
    score: number;
    last_update: string;
}

interface HistoryItem {
    id: number;
    title: string;
    status: string;
    date: string;
    score: number | null;
    type: 'completion' | 'submission';
}

interface DetailSiswaProps {
    auth: { user: { name: string } };
    student: {
        id: number;
        name: string;
        email: string;
        avatar: string;
        kelas: string;
        join_date: string;
        status_pkl: string;
        persona: string;
    };
    stats: {
        progress: number;
        avg_score: number;
        completed_modules: number;
        total_modules: number;
        xp: number;
    };
    workshops: WorkshopData[];
    history: HistoryItem[];
}

export default function DetailSiswa({ student, stats, workshops, history }: DetailSiswaProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'modules' | 'history'>('overview');

    // Helper Styles (Updated Colors)
    const getStatusColor = (status: string) => {
        if(status === 'completed' || status === 'siap') return 'bg-green-100 text-green-700 border-green-200';
        // GANTI: Biru -> Amber/Kuning agar lebih hangat
        if(status === 'pending' || status === 'dalam_pelatihan') return 'bg-amber-100 text-amber-800 border-amber-200';
        return 'bg-gray-100 text-gray-500 border-gray-200';
    };

    return (
        // GANTI: Background pakai class tema
        <div className="flex min-h-screen bg-background font-sans text-foreground">
            <Head title={`Detail Siswa - ${student.name}`} />
            <SidebarPengajar />

            <main className="flex-1 max-w-[1600px] w-full p-6 md:p-10">
                
                {/* 1. HEADER & NAVIGATION */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/pengajar/siswa">
                        <Button variant="outline" className="rounded-full w-12 h-12 p-0 bg-card hover:bg-muted border-2 border-border shadow-sm">
                            <ArrowLeft size={20} className="text-muted-foreground" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-foreground">Profil Siswa</h1>
                        <p className="text-muted-foreground font-medium">Lihat detail perkembangan dan statistik belajar</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    
                    {/* 2. KOLOM KIRI: PROFIL UTAMA (Sticky) */}
                    <div className="xl:col-span-1 space-y-6">
                        {/* Profile Card */}
                        <Card className="bg-card p-0 rounded-[2rem] border-2 border-border shadow-sm text-center relative overflow-hidden">
                            {/* Header Gradient: Orange Hangat */}
                            <div className="w-full h-28 bg-gradient-to-r from-primary to-orange-400"></div>
                            
                            <div className="px-8 pb-8 relative z-10 -mt-14">
                                <div className="w-28 h-28 mx-auto bg-card p-2 rounded-full shadow-lg mb-4">
                                    <div className="w-full h-full bg-amber-200 rounded-full flex items-center justify-center text-4xl font-black text-amber-800 border-4 border-white">
                                        {student.avatar}
                                    </div>
                                </div>
                                
                                <h2 className="text-2xl font-black text-foreground">{student.name}</h2>
                                <p className="text-muted-foreground font-medium mb-6">{student.email}</p>

                                <div className="flex justify-center gap-2 mb-8">
                                    <Badge className={`${getStatusColor(student.status_pkl)} rounded-full px-4 py-1.5 text-sm font-bold shadow-sm`}>
                                        {student.status_pkl === 'siap' ? 'Siap PKL' : 'Training'}
                                    </Badge>
                                    <Badge className="bg-orange-50 text-orange-700 border-orange-200 rounded-full px-4 py-1.5 text-sm font-bold shadow-sm">
                                        {student.kelas}
                                    </Badge>
                                </div>

                                {/* Mini Stats Grid */}
                                <div className="grid grid-cols-2 gap-4 text-left bg-muted/40 p-5 rounded-3xl border border-border">
                                    <div>
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase mb-1 tracking-wider">Persona</p>
                                        <p className="font-black text-foreground text-sm flex items-center gap-1">
                                            <Star size={16} className="text-yellow-400 fill-current" />
                                            {student.persona}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase mb-1 tracking-wider">Bergabung</p>
                                        <p className="font-black text-foreground text-sm flex items-center gap-1">
                                            <Calendar size={16} className="text-primary" />
                                            {student.join_date}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* XP & Level Card - 🔥 SUDAH DIPERBAIKI 🔥 */}
                        {/* GANTI: Gradient Biru -> Gradient Coklat Kopi (Coffee Roast Theme) */}
                        <Card className="bg-gradient-to-br from-[#8D6E63] to-[#5D4037] p-8 rounded-[2rem] border-0 shadow-lg text-white relative overflow-hidden group">
                            <div className="absolute right-[-30px] top-[-30px] w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
                            
                            <div className="flex items-center gap-5 relative z-10">
                                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md shadow-inner border border-white/10">
                                    <Award size={36} className="text-yellow-300" />
                                </div>
                                <div>
                                    <p className="text-orange-100 text-xs font-bold uppercase tracking-wider mb-1">Total Experience</p>
                                    <h3 className="text-4xl font-black">{stats.xp.toLocaleString()} XP</h3>
                                </div>
                            </div>
                            
                            <div className="mt-8 relative z-10">
                                <div className="flex justify-between text-xs font-bold mb-2 text-orange-100/90">
                                    <span>Level {Math.floor(stats.xp / 1000) + 1}</span>
                                    <span>Next Level</span>
                                </div>
                                <div className="h-4 bg-black/30 rounded-full overflow-hidden border border-white/5">
                                    <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 w-[70%] shadow-[0_0_15px_rgba(251,192,45,0.6)]"></div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* 3. KOLOM KANAN: DETAIL STATS & HISTORY */}
                    <div className="xl:col-span-2 space-y-6">
                        
                        {/* Summary Stats Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Card className="p-6 rounded-[2rem] border-2 border-border shadow-sm flex items-center gap-4 bg-card hover:shadow-md transition-all">
                                <div className="p-4 bg-orange-100 text-orange-600 rounded-2xl">
                                    <TrendingUp size={28} />
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">Rata-Rata Nilai</p>
                                    <p className="text-3xl font-black text-foreground">{stats.avg_score}</p>
                                </div>
                            </Card>
                            <Card className="p-6 rounded-[2rem] border-2 border-border shadow-sm flex items-center gap-4 bg-card hover:shadow-md transition-all">
                                <div className="p-4 bg-green-100 text-green-600 rounded-2xl">
                                    <CheckCircle size={28} />
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">Modul Selesai</p>
                                    <p className="text-3xl font-black text-foreground">{stats.completed_modules}/{stats.total_modules}</p>
                                </div>
                            </Card>
                            <Card className="p-6 rounded-[2rem] border-2 border-border shadow-sm flex items-center gap-4 bg-card hover:shadow-md transition-all">
                                <div className="p-4 bg-purple-100 text-purple-600 rounded-2xl">
                                    <Activity size={28} />
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">Keaktifan</p>
                                    <p className="text-3xl font-black text-foreground">{stats.progress}%</p>
                                </div>
                            </Card>
                        </div>

                        {/* TABS CONTENT AREA */}
                        <div className="bg-card rounded-[2.5rem] border-2 border-border shadow-sm min-h-[500px] overflow-hidden">
                            {/* Tab Headers */}
                            <div className="flex border-b-2 border-border">
                                <button 
                                    onClick={() => setActiveTab('overview')}
                                    className={`flex-1 py-5 text-sm font-bold transition-all ${activeTab === 'overview' ? 'text-primary border-b-4 border-primary bg-primary/5' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
                                >
                                    Overview Modul
                                </button>
                                <button 
                                    onClick={() => setActiveTab('history')}
                                    className={`flex-1 py-5 text-sm font-bold transition-all ${activeTab === 'history' ? 'text-primary border-b-4 border-primary bg-primary/5' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
                                >
                                    Riwayat Aktivitas
                                </button>
                            </div>

                            {/* Tab Content */}
                            <div className="p-8">
                                {activeTab === 'overview' && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                                <BookOpen size={20} />
                                            </div>
                                            <h3 className="font-black text-foreground text-lg">Progres Workshop</h3>
                                        </div>
                                        
                                        {workshops.map((ws, idx) => (
                                            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-3xl border-2 border-border hover:border-primary/50 transition-all group bg-background/50 hover:bg-background hover:shadow-sm">
                                                <div className="flex items-center gap-5 mb-3 sm:mb-0">
                                                    <div className={`p-3 rounded-2xl ${ws.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-muted text-muted-foreground'}`}>
                                                        {ws.status === 'completed' ? <CheckCircle size={24} /> : <BookOpen size={24} />}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-foreground text-lg">{ws.title}</h4>
                                                        <p className="text-xs text-muted-foreground font-medium flex items-center gap-1 mt-1">
                                                            <Clock size={12} /> Update: {ws.last_update}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right pl-16 sm:pl-0">
                                                    <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Nilai Akhir</p>
                                                    <span className={`text-2xl font-black ${ws.score >= 75 ? 'text-green-600' : 'text-orange-500'}`}>
                                                        {ws.score > 0 ? ws.score : '-'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'history' && (
                                    <div className="relative border-l-2 border-dashed border-border ml-4 space-y-8 py-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        {history.length > 0 ? history.map((item) => (
                                            <div key={item.id} className="relative pl-8">
                                                {/* GANTI: Titik biru -> Oranye/Hijau */}
                                                <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${item.type === 'completion' ? 'bg-green-500' : 'bg-orange-400'}`}></div>
                                                
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-background/50 p-4 rounded-2xl border border-border/60 hover:border-border hover:bg-background transition-all">
                                                    <div>
                                                        <p className="text-xs text-muted-foreground font-bold mb-1 flex items-center gap-1">
                                                            <Calendar size={12}/> {item.date}
                                                        </p>
                                                        <h4 className="font-bold text-foreground">
                                                            {item.type === 'completion' ? 'Menyelesaikan Workshop' : 'Mengumpulkan Tugas'}
                                                        </h4>
                                                        <p className="text-sm text-muted-foreground font-medium">{item.title}</p>
                                                    </div>
                                                    {item.score !== null && (
                                                        <Badge variant="outline" className="w-fit border-green-200 text-green-700 bg-green-50 px-3 py-1 text-sm font-bold">
                                                            Nilai: {item.score}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="text-center py-12 text-muted-foreground italic bg-muted/20 rounded-3xl border-2 border-dashed border-border">
                                                Belum ada aktivitas tercatat.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

            </main>
        </div>
    );
}