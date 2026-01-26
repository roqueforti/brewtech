import { useState } from 'react';
import { 
    BookOpen, Users, GraduationCap, AlertCircle, 
    BarChart3, Calendar, CheckCircle, Coffee, ArrowRight, TrendingUp, Activity
} from 'lucide-react';
import { Head, Link } from '@inertiajs/react'; // Import Link for navigation
import SidebarPengajar from '@/Components/SidebarPengajar';
import HeaderPengajar from '@/Components/HeaderPengajar';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card'; // Ensure you have these components
// Optional: Import Recharts if you want the chart to be real
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// --- Types (Sesuaikan dengan data dari Backend) ---
interface ClassData {
    id: number;
    name: string;
    teacher: string;
    workshop_count: number;
    student_count: number;
    theme: 'green' | 'yellow' | 'pink' | 'blue';
    pass_rate?: number; // Optional: % Kelulusan
}

interface DashboardProps {
    auth: { user: { name: string, email: string, avatar?: string } };
    stats: {
        total_kelas: number;
        total_peserta: number;
        siap_pkl: number;
        perlu_bantuan: number;
    };
    active_classes?: ClassData[];
    chart_data?: {
        labels: string[]; // e.g., ["Modul 1", "Modul 2", ...]
        scores: number[]; // e.g., [75, 80, 85, ...]
    };
}

export default function Dashboard({ 
    auth, 
    stats, 
    active_classes = [], 
    chart_data 
}: DashboardProps) {
    
    const [searchQuery, setSearchQuery] = useState('');

    // Filter Kelas (Client-side filtering for responsiveness)
    const filteredClasses = active_classes.filter(cls => 
        cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.teacher.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Helper untuk styling tema kelas
    const getThemeStyle = (theme: string) => {
        switch(theme) {
            case 'green': return { card: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-800', icon: 'bg-emerald-100 text-emerald-600', btn: 'hover:bg-emerald-100' };
            case 'yellow': return { card: 'bg-amber-50 border-amber-200', text: 'text-amber-800', icon: 'bg-amber-100 text-amber-600', btn: 'hover:bg-amber-100' };
            case 'pink': return { card: 'bg-rose-50 border-rose-200', text: 'text-rose-800', icon: 'bg-rose-100 text-rose-600', btn: 'hover:bg-rose-100' };
            default: return { card: 'bg-blue-50 border-blue-200', text: 'text-blue-800', icon: 'bg-blue-100 text-blue-600', btn: 'hover:bg-blue-100' };
        }
    };

    // Format data untuk Recharts (jika chart_data ada)
    const chartDataFormatted = chart_data?.labels.map((label, index) => ({
        name: label,
        score: chart_data.scores[index] || 0
    })) || [];

    return (
        <div className="flex min-h-screen bg-background font-sans text-foreground selection:bg-primary/20">
            <Head title="Dashboard Mentor" />

            {/* Sidebar Desktop */}
            <div className="hidden md:block w-72 shrink-0 border-r border-border bg-card h-screen sticky top-0">
                <SidebarPengajar />
            </div>

            <main className="flex-1 w-full flex flex-col h-screen overflow-hidden">
                {/* Header Global */}
                <HeaderPengajar 
                    user={auth.user} 
                    title="Dashboard Overview"
                    onSearch={(q) => setSearchQuery(q)} 
                />
                
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 scroll-smooth">
                    <div className="max-w-7xl mx-auto space-y-8 pb-20">
                    
                        {/* Welcome Section */}
                        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                            <div>
                                <h1 className="text-3xl font-black text-foreground tracking-tight">
                                    Halo, {auth.user.name.split(' ')[0]}! 👋
                                </h1>
                                <p className="text-muted-foreground font-medium mt-1">
                                    Berikut ringkasan aktivitas pelatihan Anda hari ini.
                                </p>
                            </div>
                            <div className="bg-white px-4 py-2 rounded-xl border border-border shadow-sm text-sm font-bold text-muted-foreground flex items-center gap-2">
                                <Calendar size={16} className="text-primary"/>
                                {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                            </div>
                        </div>

                        {/* --- 1. STATS GRID (Dynamic Data) --- */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                            <StatCard 
                                title="Kelas Aktif" 
                                value={stats.total_kelas} 
                                icon={<BookOpen size={24} />} 
                                color="blue" 
                                subtext="Sedang berjalan"
                            />
                            <StatCard 
                                title="Total Siswa" 
                                value={stats.total_peserta} 
                                icon={<Users size={24} />} 
                                color="indigo" 
                                subtext="Terdaftar di sistem"
                            />
                            <StatCard 
                                title="Siap PKL" 
                                value={stats.siap_pkl} 
                                icon={<CheckCircle size={24} />} 
                                color="green" 
                                subtext="Kompeten & Lulus"
                            />
                            <StatCard 
                                title="Perlu Bimbingan" 
                                value={stats.perlu_bantuan} 
                                icon={<AlertCircle size={24} />} 
                                color="orange" 
                                subtext="Butuh perhatian khusus"
                            />
                        </div>

                        {/* --- 2. MAIN CONTENT GRID --- */}
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                            
                            {/* KOLOM KIRI: Daftar Kelas (Dynamic List) */}
                            <div className="xl:col-span-2 space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                                        <GraduationCap className="text-primary" size={24}/> Kelas Diampu
                                    </h2>
                                    {/* Optional Filter Button */}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {filteredClasses.length > 0 ? (
                                        filteredClasses.map((kelas) => {
                                            const style = getThemeStyle(kelas.theme);
                                            return (
                                                <Link href={`/pengajar/kelas/${kelas.id}`} key={kelas.id}>
                                                    <div className={`rounded-[2rem] p-6 border-2 relative group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer ${style.card}`}>
                                                        <div className="flex justify-between items-start mb-4">
                                                            <div className={`p-3 rounded-2xl ${style.icon}`}>
                                                                <BookOpen size={20} strokeWidth={2.5} />
                                                            </div>
                                                            <div className="flex -space-x-2">
                                                                {/* Dummy Avatars for visual flair */}
                                                                {[...Array(Math.min(3, kelas.student_count))].map((_, i) => (
                                                                    <div key={i} className="w-8 h-8 rounded-full bg-white border-2 border-white flex items-center justify-center text-[10px] font-bold text-muted-foreground shadow-sm">
                                                                        {(i + 1)}
                                                                    </div>
                                                                ))}
                                                                {kelas.student_count > 3 && (
                                                                    <div className="w-8 h-8 rounded-full bg-white border-2 border-white flex items-center justify-center text-[10px] font-bold text-muted-foreground shadow-sm">
                                                                        +{kelas.student_count - 3}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <h3 className={`text-xl font-black mb-1 line-clamp-1 ${style.text}`}>{kelas.name}</h3>
                                                        <p className={`text-xs font-bold opacity-70 mb-6 ${style.text}`}>
                                                            Pengajar: {kelas.teacher}
                                                        </p>

                                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-current/10">
                                                            <div className="flex gap-4">
                                                                <div>
                                                                    <span className={`text-[10px] uppercase font-bold opacity-60 block ${style.text}`}>Modul</span>
                                                                    <span className={`text-lg font-black ${style.text}`}>{kelas.workshop_count}</span>
                                                                </div>
                                                                <div>
                                                                    <span className={`text-[10px] uppercase font-bold opacity-60 block ${style.text}`}>Siswa</span>
                                                                    <span className={`text-lg font-black ${style.text}`}>{kelas.student_count}</span>
                                                                </div>
                                                            </div>
                                                            <div className={`p-2 rounded-lg bg-white/50 ${style.text}`}>
                                                                <ArrowRight size={20} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            );
                                        })
                                    ) : (
                                        <div className="col-span-1 md:col-span-2 py-16 text-center border-2 border-dashed border-border rounded-[2rem] bg-muted/20">
                                            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                                <BookOpen className="text-muted-foreground opacity-50" size={32} />
                                            </div>
                                            <p className="text-muted-foreground font-bold">
                                                {searchQuery ? `Tidak ada kelas "${searchQuery}"` : "Belum ada kelas aktif."}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* KOLOM KANAN: Grafik & Tips */}
                            <div className="space-y-6">
                                {/* Grafik Performa */}
                                <Card className="bg-white p-6 rounded-[2rem] border-2 border-border shadow-sm overflow-hidden">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                            <BarChart3 size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-foreground">Rata-rata Nilai</h3>
                                            <p className="text-xs text-muted-foreground">Performa Post-Test Siswa</p>
                                        </div>
                                    </div>

                                    <div className="h-48 w-full">
                                        {chartDataFormatted.length > 0 ? (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={chartDataFormatted}>
                                                    <XAxis dataKey="name" hide />
                                                    <Tooltip 
                                                        cursor={{fill: 'transparent'}}
                                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                                    />
                                                    <Bar 
                                                        dataKey="score" 
                                                        fill="#f97316" // Orange Primary
                                                        radius={[4, 4, 0, 0]} 
                                                        barSize={40}
                                                    />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="h-full flex items-center justify-center text-xs text-muted-foreground border border-dashed rounded-xl">
                                                Data grafik belum tersedia
                                            </div>
                                        )}
                                    </div>
                                </Card>

                                {/* Quick Tips Card */}
                                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-[2rem] border-2 border-yellow-100 relative overflow-hidden group">
                                    <div className="absolute -right-6 -bottom-6 text-yellow-200 group-hover:scale-110 transition-transform duration-500">
                                        <Coffee size={120} />
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 mb-3 text-yellow-700">
                                            <div className="p-1.5 bg-yellow-100 rounded-md"><Activity size={16}/></div>
                                            <span className="text-xs font-bold uppercase tracking-wider">Tips Mentor</span>
                                        </div>
                                        <h4 className="font-black text-yellow-900 text-lg mb-2">Evaluasi Rasa! ☕</h4>
                                        <p className="text-sm text-yellow-800 font-medium leading-relaxed">
                                            "Ingatkan siswa untuk selalu mencatat <em>Tasting Notes</em> setelah brewing. Konsistensi rasa adalah kunci!"
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

// --- SUB-COMPONENTS ---

function StatCard({ title, value, icon, color, subtext }: any) {
    const colors: any = {
        blue:   "bg-blue-50 text-blue-700 border-blue-200 icon-bg-blue-100",
        indigo: "bg-indigo-50 text-indigo-700 border-indigo-200 icon-bg-indigo-100",
        green:  "bg-emerald-50 text-emerald-700 border-emerald-200 icon-bg-emerald-100",
        orange: "bg-orange-50 text-orange-700 border-orange-200 icon-bg-orange-100",
    };
    const activeColor = colors[color] || colors.blue;

    return (
        <div className={`p-5 rounded-[2rem] border-2 shadow-sm hover:shadow-md transition-all group ${activeColor}`}>
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl bg-white/60 backdrop-blur-sm group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
            </div>
            <h3 className="text-4xl font-black mb-1">{value}</h3>
            <p className="text-sm font-bold opacity-80">{title}</p>
            <p className="text-[10px] font-medium opacity-60 mt-1">{subtext}</p>
        </div>
    );
}