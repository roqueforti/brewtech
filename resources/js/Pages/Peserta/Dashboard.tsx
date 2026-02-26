import { Head, Link, usePage } from '@inertiajs/react';
import SidebarPeserta from '@/Components/SidebarPeserta'; 
import { 
    BookOpen, CheckCircle, Clock, PlayCircle, 
    Award, Star, Coffee, ArrowRight, BarChart3, 
    CircleDashed // Pastikan import ini ada, jika error hapus dan pakai fungsi bawah
} from 'lucide-react';
import { Card } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Progress } from '@/Components/ui/progress';

interface ModuleProgress {
    status: string;
    pretest_score: number | null;
    posttest_score: number | null;
}

interface Module {
    id: number;
    title: string;
    description: string;
    category: string;
    duration: string;
    progress: ModuleProgress | null;
}

interface Props {
    auth: any;
    // ✅ PERBAIKAN: Berikan tanda tanya (?) agar opsional
    modules?: Module[]; 
    total_progress?: number;
    completed_modules?: number;
}

// ✅ PERBAIKAN UTAMA: Tambahkan default value = [] dan = 0
export default function Dashboard({ 
    auth, 
    modules = [], 
    total_progress = 0, 
    completed_modules = 0 
}: Props) {
    
    const user = auth.user;

    // Helper untuk menentukan status tampilan
    const getModuleStatus = (progress: ModuleProgress | null) => {
        if (!progress) return { label: 'Belum Dimulai', color: 'bg-slate-100 text-slate-500', icon: <CustomCircleDashed size={14}/> };
        
        if (progress.pretest_score !== null && progress.posttest_score === null) {
            return { label: 'Sedang Berjalan', color: 'bg-yellow-100 text-yellow-700', icon: <Clock size={14}/> };
        }
        
        if (progress.posttest_score !== null) {
            return { label: 'Selesai', color: 'bg-green-100 text-green-700', icon: <CheckCircle size={14}/> };
        }

        return { label: 'Proses', color: 'bg-blue-100 text-blue-700', icon: <Clock size={14}/> };
    };

    // Helper untuk teks tombol
    const getButtonLabel = (progress: ModuleProgress | null) => {
        if (!progress) return 'Mulai Belajar';
        if (progress.pretest_score !== null && progress.posttest_score === null) return 'Lanjut Materi';
        if (progress.posttest_score !== null) return 'Lihat Hasil';
        return 'Lanjut';
    };

    return (
        <div className="flex min-h-screen bg-[#FAFAF9] font-sans text-slate-800">
            <Head title="Dashboard Siswa" />
            
            <div className="hidden md:block fixed h-full z-50">
                <SidebarPeserta user={user} />
            </div>

            <main className="flex-1 md:pl-80 p-6 md:p-8 w-full">
                {/* Header Welcome */}
                <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            SLB YPAC Kota Malang
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-2">
                            Halo, <span className="text-primary">{user.name.split(' ')[0]}!</span> 👋
                        </h1>
                        <p className="text-slate-500 font-medium">Lanjutkan progres belajarmu hari ini.</p>
                    </div>

                    {/* Progress Card Header */}
                    <Card className="w-full md:w-auto min-w-[300px] p-5 bg-white border-none shadow-sm rounded-3xl flex flex-col gap-3">
                        <div className="flex justify-between items-center text-sm font-bold text-slate-600">
                            <span className="flex items-center gap-2"><BarChart3 size={16}/> Progres Global</span>
                            <span className="text-primary">{Math.round(total_progress)}%</span>
                        </div>
                        <Progress value={total_progress} className="h-3 bg-slate-100" indicatorClassName="bg-primary" />
                        <p className="text-xs text-right text-slate-400 font-bold">{completed_modules} dari {modules.length} Modul Selesai</p>
                    </Card>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center">
                        <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mb-2">
                            <BookOpen size={20}/>
                        </div>
                        <span className="text-2xl font-black text-slate-800">{modules.length}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Modul</span>
                    </div>
                    <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center">
                        <div className="w-10 h-10 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center mb-2">
                            <Award size={20}/>
                        </div>
                        <span className="text-2xl font-black text-slate-800">{completed_modules}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Selesai</span>
                    </div>
                    {/* Placeholder Stats */}
                    <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center opacity-50">
                        <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-2">
                            <Star size={20}/>
                        </div>
                        <span className="text-2xl font-black text-slate-800">-</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Poin</span>
                    </div>
                    <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center opacity-50">
                        <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-2">
                            <Coffee size={20}/>
                        </div>
                        <span className="text-2xl font-black text-slate-800">-</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Skill</span>
                    </div>
                </div>

                {/* Kurikulum Section */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-black text-slate-800">Kurikulum Materi</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {modules.length > 0 ? (
                            modules.map((modul) => {
                                const status = getModuleStatus(modul.progress);
                                const btnText = getButtonLabel(modul.progress);
                                const isCompleted = modul.progress?.posttest_score !== null;

                                return (
                                    <Card key={modul.id} className="group relative bg-white border-2 border-transparent hover:border-primary/20 rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                                        <div className="absolute top-6 right-6">
                                            <Badge className={`${status.color} border-0 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm`}>
                                                {status.icon} {status.label}
                                            </Badge>
                                        </div>

                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm transition-colors ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500 group-hover:bg-primary/10 group-hover:text-primary'}`}>
                                            {isCompleted ? <CheckCircle size={28}/> : <Coffee size={28}/>}
                                        </div>

                                        <div className="flex-1 mb-6">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Modul {modul.id}</span>
                                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{modul.category || 'Basic'}</span>
                                            </div>
                                            <h3 className="text-xl font-black text-slate-800 mb-2 leading-tight group-hover:text-primary transition-colors">
                                                {modul.title}
                                            </h3>
                                            <p className="text-sm text-slate-500 font-medium line-clamp-2 leading-relaxed">
                                                {modul.description || 'Pelajari teknik dasar barista dan SOP pelayanan.'}
                                            </p>
                                        </div>

                                        {modul.progress && modul.progress.pretest_score !== null && !isCompleted && (
                                            <div className="mb-6 p-3 bg-yellow-50 rounded-xl border border-yellow-100 flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-yellow-200 flex items-center justify-center text-yellow-700 font-bold text-xs">
                                                    {modul.progress.pretest_score}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-bold text-yellow-800">Pre-Test Selesai</p>
                                                    <p className="text-[10px] text-yellow-600">Lanjut ke materi inti</p>
                                                </div>
                                            </div>
                                        )}

                                        <Link href={route('workshop.play', modul.id)} className="w-full">
                                            <Button 
                                                className={`w-full h-12 rounded-xl font-black text-sm shadow-md transition-transform active:scale-95 flex items-center justify-between px-6 
                                                    ${isCompleted 
                                                        ? 'bg-white border-2 border-slate-200 text-slate-600 hover:border-primary hover:text-primary' 
                                                        : 'bg-primary hover:bg-orange-600 text-white'
                                                    }`}
                                            >
                                                {btnText}
                                                {isCompleted ? <ArrowRight size={16}/> : <PlayCircle size={18}/>}
                                            </Button>
                                        </Link>
                                    </Card>
                                );
                            })
                        ) : (
                            <div className="col-span-full text-center py-10">
                                <p className="text-slate-400 font-bold">Belum ada modul yang tersedia.</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}

// Icon komponen kecil (Alternatif jika lucide error)
function CustomCircleDashed({size}:{size:number}) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-dashed"><path d="M10.1 2.18a9.93 9.93 0 0 1 3.8 0"/><path d="M17.6 3.71a9.95 9.95 0 0 1 2.69 2.7"/><path d="M21.82 10.1a9.93 9.93 0 0 1 0 3.8"/><path d="M20.29 17.6a9.95 9.95 0 0 1-2.7 2.69"/><path d="M13.9 21.82a9.94 9.94 0 0 1-3.8 0"/><path d="M6.4 20.29a9.95 9.95 0 0 1-2.69-2.7"/><path d="M2.18 13.9a9.93 9.93 0 0 1 0-3.8"/><path d="M3.71 6.4a9.95 9.95 0 0 1 2.7-2.69"/></svg>
    )
}