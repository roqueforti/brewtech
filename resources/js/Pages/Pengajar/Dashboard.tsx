import { 
    BookOpen, Users, GraduationCap, AlertCircle, 
    BarChart3, Calendar, CheckCircle, Coffee, Menu, ArrowRight 
} from 'lucide-react';
import { Head } from '@inertiajs/react';
import SidebarPengajar from '@/Components/SidebarPengajar'; // ✅ Import Sidebar

// ... (Interface ClassData, DashboardProps tetap sama, tidak perlu diubah) ...
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
    
    // ... (Helper getThemeStyle tetap sama) ...
    const getThemeStyle = (theme: string) => {
        switch(theme) {
            case 'green': return { card: 'bg-[#E8F5E9] border-[#C8E6C9]', text: 'text-[#2E7D32]', icon: 'bg-[#A5D6A7]/40', btn: 'hover:bg-[#C8E6C9]' };
            case 'yellow': return { card: 'bg-[#FFF8E1] border-[#FFE0B2]', text: 'text-[#EF6C00]', icon: 'bg-[#FFCC80]/40', btn: 'hover:bg-[#FFE0B2]' };
            case 'pink': return { card: 'bg-[#FCE4EC] border-[#F8BBD0]', text: 'text-[#C2185B]', icon: 'bg-[#F48FB1]/40', btn: 'hover:bg-[#F8BBD0]' };
            default: return { card: 'bg-[#E3F2FD] border-[#BBDEFB]', text: 'text-[#1565C0]', icon: 'bg-[#90CAF9]/40', btn: 'hover:bg-[#BBDEFB]' };
        }
    };

    const postTestScores = chart_data?.post_test || [];
    const preTestScores = chart_data?.pre_test || [];

    return (
        // 👇 UBAH LAYOUT DI SINI: Flex Row
        <div className="flex min-h-screen bg-[#FAFAFA] font-sans">
            <Head title="Dashboard Mentor" />

            {/* ✅ SIDEBAR (Fixed di Kiri) */}
            <SidebarPengajar />

            {/* ✅ KONTEN UTAMA (Di Kanan) */}
            <main className="flex-1 max-w-[1600px] w-full">
                
                {/* Mobile Header (Hanya muncul di HP) */}
                <div className="md:hidden bg-white p-4 border-b flex justify-between items-center sticky top-0 z-30">
                    <div className="flex items-center gap-2">
                        <Coffee className="text-[#5D4037]" />
                        <span className="font-black text-[#5D4037]">BREWTECH</span>
                    </div>
                    <button className="p-2 bg-gray-100 rounded-lg">
                        <Menu size={20} />
                    </button>
                </div>

                <div className="p-6 md:p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    
                    {/* Header Halaman */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
                        <div>
                            <h1 className="text-3xl font-black text-[#5D4037]">Dashboard</h1>
                            <p className="text-gray-400 font-medium mt-1">Ringkasan aktivitas pelatihan Anda hari ini.</p>
                        </div>
                        <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm text-sm font-bold text-[#5D4037]">
                            📅 {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                    </div>

                    {/* --- 1. STATS GRID --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {/* ... (Copy Stats Card dari kode sebelumnya, sama persis) ... */}
                        
                        {/* Contoh Card 1 */}
                        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 group-hover:scale-110 transition-transform">
                                    <BookOpen size={24} strokeWidth={2.5} />
                                </div>
                                <span className="text-xs font-bold bg-gray-50 text-gray-400 py-1 px-2 rounded-lg">Aktif</span>
                            </div>
                            <h3 className="text-3xl font-black text-gray-800 mb-1">{stats?.total_kelas || 0}</h3>
                            <p className="text-sm font-medium text-gray-400">Kelas Diampu</p>
                        </div>
                        
                        {/* ... Card 2, 3, 4 (Copy Paste yang lama ke sini) ... */}
                         {/* Card 2: Total Peserta */}
                        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 group-hover:scale-110 transition-transform">
                                    <Users size={24} strokeWidth={2.5} />
                                </div>
                            </div>
                            <h3 className="text-3xl font-black text-gray-800 mb-1">{stats?.total_peserta || 0}</h3>
                            <p className="text-sm font-medium text-gray-400">Total Siswa</p>
                        </div>

                        {/* Card 3: Siap PKL */}
                        <div className="bg-[#F3E5F5] p-5 rounded-3xl border border-purple-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                            <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-purple-200/50 rounded-full blur-2xl"></div>
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-white rounded-2xl text-purple-600 shadow-sm">
                                        <CheckCircle size={24} strokeWidth={2.5} />
                                    </div>
                                </div>
                                <h3 className="text-3xl font-black text-purple-900 mb-1">{stats?.siap_pkl || 0}</h3>
                                <p className="text-sm font-bold text-purple-700">Siswa Siap PKL</p>
                            </div>
                        </div>

                        {/* Card 4: Perlu Bantuan */}
                        <div className="bg-[#FFF3E0] p-5 rounded-3xl border border-orange-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                            <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-orange-200/50 rounded-full blur-2xl"></div>
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-white rounded-2xl text-orange-600 shadow-sm animate-pulse">
                                        <AlertCircle size={24} strokeWidth={2.5} />
                                    </div>
                                </div>
                                <h3 className="text-3xl font-black text-orange-900 mb-1">{stats?.perlu_bantuan || 0}</h3>
                                <p className="text-sm font-bold text-orange-700">Perlu Bimbingan</p>
                            </div>
                        </div>
                    </div>

                    {/* --- 2. MAIN CONTENT GRID --- */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        
                        {/* KOLOM KIRI: Daftar Kelas */}
                        <div className="xl:col-span-2 space-y-6">
                            {/* ... (Konten Daftar Kelas Sama Persis) ... */}
                            <div className="flex justify-between items-end">
                                <div>
                                    <h2 className="text-2xl font-black text-[#5D4037]">Kelas Saya</h2>
                                    <p className="text-sm text-gray-400 font-medium">Kelola workshop dan progres siswa</p>
                                </div>
                                <button className="text-sm font-bold text-[#5D4037] bg-white border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                                    Semua Semester
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {active_classes && active_classes.length > 0 ? active_classes.map((kelas) => {
                                    const style = getThemeStyle(kelas.theme);
                                    return (
                                        <div key={kelas.id} className={`rounded-[2rem] p-6 border-2 relative group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${style.card}`}>
                                            <div className="flex justify-between items-start mb-6">
                                                <div className={`p-3 rounded-2xl ${style.icon}`}>
                                                    <GraduationCap className={style.text} size={24} strokeWidth={2.5} />
                                                </div>
                                                <div className="flex -space-x-2">
                                                    {[...Array(Math.min(3, kelas.student_count))].map((_, i) => (
                                                        <div key={i} className="w-8 h-8 rounded-full bg-white border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-400 shadow-sm">
                                                            {String.fromCharCode(65 + i)}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <h3 className={`text-2xl font-black mb-1 ${style.text}`}>{kelas.name}</h3>
                                            <p className="text-sm font-medium opacity-70 mb-6 flex items-center gap-2">
                                                <Calendar size={14} /> Semester Genap 2024
                                            </p>

                                            <div className="flex items-center justify-between mt-auto">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] uppercase font-bold opacity-60">Workshop</span>
                                                    <span className={`text-xl font-black ${style.text}`}>{kelas.workshop_count}</span>
                                                </div>
                                                <div className="h-8 w-[1px] bg-current opacity-20"></div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] uppercase font-bold opacity-60">Siswa</span>
                                                    <span className={`text-xl font-black ${style.text}`}>{kelas.student_count}</span>
                                                </div>
                                                
                                                <button className={`p-3 rounded-xl bg-white/80 shadow-sm transition-colors ${style.btn} ${style.text}`}>
                                                    <ArrowRight size={20} strokeWidth={3} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                }) : (
                                    <div className="col-span-2 py-10 text-center border-2 border-dashed border-gray-200 rounded-[2rem] bg-white">
                                        <div className="p-4 bg-gray-50 rounded-full inline-block mb-3">
                                            <BookOpen className="text-gray-300" size={32} />
                                        </div>
                                        <p className="text-gray-400 font-bold">Belum ada kelas aktif.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* KOLOM KANAN: Grafik */}
                        <div className="space-y-6">
                            {/* ... (Konten Grafik Sama Persis) ... */}
                            <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-[#5D4037] rounded-lg">
                                        <BarChart3 className="text-[#FFCA28]" size={20} />
                                    </div>
                                    <h3 className="font-black text-lg text-[#5D4037]">Progres Siswa</h3>
                                </div>

                                <div className="relative h-48 flex items-end justify-between gap-2 mt-8">
                                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                                        {[1,2,3,4].map(i => <div key={i} className="w-full h-[1px] bg-gray-100 border-t border-dashed border-gray-200"></div>)}
                                    </div>

                                    {postTestScores.length > 0 ? postTestScores.map((score, i) => (
                                        <div key={i} className="relative w-full h-full flex items-end group">
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#5D4037] text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                Nilai: {score}
                                            </div>
                                            <div 
                                                className="w-full bg-gradient-to-t from-[#5D4037] to-[#8D6E63] rounded-t-lg mx-[2px] transition-all duration-500 hover:opacity-80 relative z-0"
                                                style={{ height: `${score}%` }}
                                            ></div>
                                        </div>
                                    )) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 italic">
                                            Belum ada data nilai
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Quick Tips */}
                            <div className="bg-[#FFF8E1] p-6 rounded-[2.5rem] border border-[#FFE0B2] relative overflow-hidden">
                                <div className="absolute -right-6 -bottom-6 text-[#FFCC80]/30">
                                    <Coffee size={100} />
                                </div>
                                <h4 className="font-black text-[#5D4037] text-lg mb-2 relative z-10">Tips Hari Ini 💡</h4>
                                <p className="text-sm text-[#8D6E63] font-medium leading-relaxed relative z-10">
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