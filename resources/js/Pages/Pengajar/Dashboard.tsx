import { useState } from 'react';
import { 
    BookOpen, Users, GraduationCap, AlertCircle, 
    BarChart3, Calendar, CheckCircle, Coffee, ArrowRight 
} from 'lucide-react';
import { Head } from '@inertiajs/react';
import SidebarPengajar from '@/Components/SidebarPengajar';
import HeaderPengajar from '@/Components/HeaderPengajar'; // ✅ Import Header Baru

interface ClassData {
    id: number;
    name: string;
    teacher: string;
    workshop_count: number;
    student_count: number;
    theme: 'green' | 'yellow' | 'pink' | 'blue';
}

interface DashboardProps {
    auth: { user: { name: string } };
    stats: {
        total_kelas: number;
        total_peserta: number;
        siap_pkl: number;
        perlu_bantuan: number;
    };
    active_classes?: ClassData[];
    chart_data?: {
        pre_test: number[];
        post_test: number[];
    };
}

export default function Dashboard({ 
    auth, 
    stats, 
    active_classes = [], 
    chart_data = { pre_test: [], post_test: [] } 
}: DashboardProps) {
    
    // State untuk Search dari Header
    const [searchQuery, setSearchQuery] = useState('');

    // Filter Kelas berdasarkan Search
    const filteredClasses = active_classes.filter(cls => 
        cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.teacher.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getThemeStyle = (theme: string) => {
        switch(theme) {
            case 'green': return { card: 'bg-green-50 border-green-200', text: 'text-green-700', icon: 'bg-green-100', btn: 'hover:bg-green-100' };
            case 'yellow': return { card: 'bg-amber-50 border-amber-200', text: 'text-amber-700', icon: 'bg-amber-100', btn: 'hover:bg-amber-100' };
            case 'pink': return { card: 'bg-pink-50 border-pink-200', text: 'text-pink-700', icon: 'bg-pink-100', btn: 'hover:bg-pink-100' };
            default: return { card: 'bg-blue-50 border-blue-200', text: 'text-blue-700', icon: 'bg-blue-100', btn: 'hover:bg-blue-100' };
        }
    };

    const postTestScores = chart_data?.post_test || [];

    return (
        <div className="flex min-h-screen bg-background font-sans text-foreground">
            <Head title="Dashboard Mentor" />

            <SidebarPengajar />

            <main className="flex-1 w-full flex flex-col">
                {/* ✅ Global Header dengan Search Handler */}
                <HeaderPengajar onSearch={(q) => setSearchQuery(q)} />
                
                <div className="p-6 md:p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 flex-1">
                    
                    {/* Header Halaman */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
                        <div>
                            <h1 className="text-3xl font-black text-foreground">Dashboard</h1>
                            <p className="text-muted-foreground font-medium mt-1">Ringkasan aktivitas pelatihan Anda hari ini.</p>
                        </div>
                        <div className="bg-card px-4 py-2 rounded-2xl border-2 border-border shadow-sm text-sm font-bold text-foreground flex items-center gap-2">
                            <Calendar size={16} className="text-primary"/>
                            {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                    </div>

                    {/* --- 1. STATS GRID --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        <div className="bg-card p-5 rounded-[2rem] border-2 border-border shadow-sm hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-blue-100 rounded-2xl text-blue-600 group-hover:scale-110 transition-transform">
                                    <BookOpen size={24} strokeWidth={2.5} />
                                </div>
                                <span className="text-xs font-bold bg-muted text-muted-foreground py-1 px-2 rounded-lg">Aktif</span>
                            </div>
                            <h3 className="text-4xl font-black text-foreground mb-1">{stats?.total_kelas || 0}</h3>
                            <p className="text-sm font-medium text-muted-foreground">Kelas Diampu</p>
                        </div>
                        
                        <div className="bg-card p-5 rounded-[2rem] border-2 border-border shadow-sm hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-600 group-hover:scale-110 transition-transform">
                                    <Users size={24} strokeWidth={2.5} />
                                </div>
                            </div>
                            <h3 className="text-4xl font-black text-foreground mb-1">{stats?.total_peserta || 0}</h3>
                            <p className="text-sm font-medium text-muted-foreground">Total Siswa</p>
                        </div>

                        <div className="bg-purple-50 p-5 rounded-[2rem] border-2 border-purple-200 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                            <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-purple-200/50 rounded-full blur-2xl"></div>
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-white rounded-2xl text-purple-600 shadow-sm">
                                        <CheckCircle size={24} strokeWidth={2.5} />
                                    </div>
                                </div>
                                <h3 className="text-4xl font-black text-purple-900 mb-1">{stats?.siap_pkl || 0}</h3>
                                <p className="text-sm font-bold text-purple-700">Siswa Siap PKL</p>
                            </div>
                        </div>

                        <div className="bg-orange-50 p-5 rounded-[2rem] border-2 border-orange-200 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                            <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-orange-200/50 rounded-full blur-2xl"></div>
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-white rounded-2xl text-orange-600 shadow-sm">
                                        <AlertCircle size={24} strokeWidth={2.5} />
                                    </div>
                                </div>
                                <h3 className="text-4xl font-black text-orange-900 mb-1">{stats?.perlu_bantuan || 0}</h3>
                                <p className="text-sm font-bold text-orange-700">Perlu Bimbingan</p>
                            </div>
                        </div>
                    </div>

                    {/* --- 2. MAIN CONTENT GRID --- */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        
                        {/* KOLOM KIRI: Daftar Kelas */}
                        <div className="xl:col-span-2 space-y-6">
                            <div className="flex justify-between items-end">
                                <div>
                                    <h2 className="text-2xl font-black text-foreground">Kelas Saya</h2>
                                    <p className="text-sm text-muted-foreground font-medium">Kelola workshop dan progres siswa</p>
                                </div>
                                <button className="text-sm font-bold text-primary bg-card border-2 border-border px-4 py-2 rounded-xl hover:bg-muted transition-colors shadow-sm">
                                    Semua Semester
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {filteredClasses.length > 0 ? filteredClasses.map((kelas) => {
                                    const style = getThemeStyle(kelas.theme);
                                    return (
                                        <div key={kelas.id} className={`rounded-[2.5rem] p-6 border-2 relative group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${style.card}`}>
                                            <div className="flex justify-between items-start mb-6">
                                                <div className={`p-3 rounded-2xl ${style.icon}`}>
                                                    <GraduationCap className={style.text} size={24} strokeWidth={2.5} />
                                                </div>
                                                <div className="flex -space-x-2">
                                                    {[...Array(Math.min(3, kelas.student_count))].map((_, i) => (
                                                        <div key={i} className="w-8 h-8 rounded-full bg-white border-2 border-white flex items-center justify-center text-[10px] font-bold text-muted-foreground shadow-sm">
                                                            {String.fromCharCode(65 + i)}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <h3 className={`text-2xl font-black mb-1 ${style.text}`}>{kelas.name}</h3>
                                            <p className={`text-sm font-medium opacity-80 mb-6 flex items-center gap-2 ${style.text}`}>
                                                <Calendar size={14} /> Semester Genap 2026
                                            </p>

                                            <div className="flex items-center justify-between mt-auto">
                                                <div className="flex flex-col">
                                                    <span className={`text-[10px] uppercase font-bold opacity-70 ${style.text}`}>Workshop</span>
                                                    <span className={`text-xl font-black ${style.text}`}>{kelas.workshop_count}</span>
                                                </div>
                                                <div className={`h-8 w-[1px] opacity-30 bg-current`}></div>
                                                <div className="flex flex-col">
                                                    <span className={`text-[10px] uppercase font-bold opacity-70 ${style.text}`}>Siswa</span>
                                                    <span className={`text-xl font-black ${style.text}`}>{kelas.student_count}</span>
                                                </div>
                                                
                                                <button className={`p-3 rounded-xl bg-white/80 shadow-sm transition-colors ${style.btn} ${style.text}`}>
                                                    <ArrowRight size={20} strokeWidth={3} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                }) : (
                                    <div className="col-span-2 py-12 text-center border-2 border-dashed border-border rounded-[2rem] bg-card/50">
                                        <div className="p-4 bg-muted rounded-full inline-block mb-3">
                                            <BookOpen className="text-muted-foreground" size={32} />
                                        </div>
                                        <p className="text-muted-foreground font-bold">
                                            {searchQuery ? `Tidak ada kelas dengan nama "${searchQuery}"` : "Belum ada kelas aktif."}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* KOLOM KANAN: Grafik */}
                        <div className="space-y-6">
                            <div className="bg-card p-6 rounded-[2.5rem] border-2 border-border shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-primary rounded-lg">
                                        <BarChart3 className="text-primary-foreground" size={20} />
                                    </div>
                                    <h3 className="font-black text-lg text-foreground">Progres Siswa</h3>
                                </div>

                                <div className="relative h-48 flex items-end justify-between gap-2 mt-8">
                                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                                            {[1,2,3,4].map(i => <div key={i} className="w-full h-[1px] bg-border/50 border-t border-dashed border-border"></div>)}
                                    </div>

                                    {postTestScores.length > 0 ? postTestScores.map((score, i) => (
                                        <div key={i} className="relative w-full h-full flex items-end group">
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                Nilai: {score}
                                            </div>
                                            <div 
                                                className="w-full bg-gradient-to-t from-primary to-orange-400 rounded-t-lg mx-[2px] transition-all duration-500 hover:opacity-80 relative z-0"
                                                style={{ height: `${score}%` }}
                                            ></div>
                                        </div>
                                    )) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground italic">
                                            Belum ada data nilai
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Quick Tips */}
                            <div className="bg-yellow-50 p-6 rounded-[2.5rem] border-2 border-yellow-200 relative overflow-hidden">
                                <div className="absolute -right-6 -bottom-6 text-yellow-200">
                                    <Coffee size={100} />
                                </div>
                                <h4 className="font-black text-yellow-800 text-lg mb-2 relative z-10">Tips Hari Ini 💡</h4>
                                <p className="text-sm text-yellow-700 font-medium leading-relaxed relative z-10">
                                    "Jangan lupa cek foto hasil seduhan siswa. *Flat bed* yang rata menandakan tuangan air yang konsisten!"
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}