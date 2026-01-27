import { Head, Link } from "@inertiajs/react";
import SidebarPeserta from "@/Components/SidebarPeserta"; 
import { 
    BookOpen, CheckCircle2, PlayCircle, Lock, Calendar, 
    TrendingUp, Award, ChevronRight, Clock
} from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";

// Definisi route helper
declare function route(name: string, params?: any): string;

interface Module {
    id: number;
    title: string;
    subtitle: string;
    emoji: string;
    status: 'locked' | 'available' | 'completed';
    theme: 'orange' | 'blue';
    date: string | null;
    opens_at?: string; // ✅ Tambahan: Untuk menampilkan jadwal
}

interface Props {
    auth: { user: any };
    workshops: Module[];
    stats: {
        completed: number;
        active: number;
    };
}

export default function Dashboard({ auth, workshops, stats }: Props) {
    const user = auth.user;
    const totalModules = workshops.length;
    const progressPercent = totalModules > 0 ? Math.round((stats.completed / totalModules) * 100) : 0;

    return (
        <div className="flex min-h-screen bg-background font-sans text-foreground selection:bg-primary/30">
            <Head title="Dashboard Peserta" />
            
            <div className="hidden md:block fixed h-full z-20">
                <SidebarPeserta />
            </div>

            <main className="flex-1 p-6 md:p-10 md:ml-64 min-h-screen">
                <div className="max-w-6xl mx-auto space-y-10 pb-20">
                    
                    {/* HERO SECTION */}
                    <div className="relative bg-card rounded-3xl p-8 md:p-10 border-2 border-border shadow-sm overflow-hidden">
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>

                        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                            <div className="space-y-4 max-w-2xl">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted border-2 border-border/50">
                                    <span className="w-3 h-3 rounded-full bg-primary animate-pulse"></span>
                                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                        {user.kelas?.nama ?? 'Peserta Didik'}
                                    </span>
                                </div>
                                
                                <div>
                                    <h1 className="text-4xl md:text-5xl font-black text-foreground leading-tight tracking-tight">
                                        Halo, <span className="text-primary">{user.name.split(' ')[0]}!</span> 👋
                                    </h1>
                                    <p className="text-muted-foreground text-lg mt-3 font-medium leading-relaxed">
                                        Siap meracik ilmu hari ini? Yuk lanjutkan progres belajarmu!
                                    </p>
                                </div>
                            </div>

                            {/* Stats Widget */}
                            <div className="w-full lg:w-auto min-w-[320px] bg-white/80 backdrop-blur-sm border-2 border-border p-6 rounded-3xl shadow-sm hover:shadow-md transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2 text-foreground font-bold">
                                        <div className="p-2 bg-accent rounded-xl text-foreground border border-border/50">
                                            <TrendingUp size={20} />
                                        </div>
                                        <span>Progres Total</span>
                                    </div>
                                    <span className="text-3xl font-black text-primary">{progressPercent}%</span>
                                </div>
                                
                                <div className="h-5 w-full bg-muted rounded-full overflow-hidden p-1 border border-border/30">
                                    <div 
                                        className="h-full bg-primary rounded-full transition-all duration-1000 ease-out shadow-sm relative overflow-hidden"
                                        style={{ width: `${progressPercent}%` }}
                                    >
                                        <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite] transform -skew-x-12"></div>
                                    </div>
                                </div>
                                <div className="mt-4 flex justify-between text-xs font-bold text-muted-foreground">
                                    <span>Start</span>
                                    <span>{stats.completed}/{totalModules} Modul</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SUMMARY GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="group bg-card border-2 border-border p-6 rounded-3xl hover:border-secondary/50 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/5 flex items-center gap-6 cursor-default">
                            <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary border-2 border-secondary/20 group-hover:scale-110 transition-transform duration-300 group-hover:rotate-3">
                                <BookOpen size={32} strokeWidth={2.5} />
                            </div>
                            <div>
                                <p className="text-4xl font-black text-foreground mb-1">{stats.active}</p>
                                <p className="text-secondary font-bold text-sm uppercase tracking-wide">Sedang Dipelajari</p>
                            </div>
                        </div>

                        <div className="group bg-card border-2 border-border p-6 rounded-3xl hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 flex items-center gap-6 cursor-default">
                            <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center text-foreground border-2 border-accent/50 group-hover:scale-110 transition-transform duration-300 group-hover:-rotate-3">
                                <Award size={32} strokeWidth={2.5} />
                            </div>
                            <div>
                                <p className="text-4xl font-black text-foreground mb-1">{stats.completed}</p>
                                <p className="text-muted-foreground font-bold text-sm uppercase tracking-wide">Selesai</p>
                            </div>
                        </div>
                    </div>

                    {/* COURSE LIST */}
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-3xl font-black text-foreground mb-2 flex items-center gap-2">
                                    Kurikulum Materi <span className="text-2xl">📚</span>
                                </h2>
                                <p className="text-muted-foreground font-medium text-lg">Peta perjalanan menjadi barista handal.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {workshops.map((modul, index) => (
                                <div 
                                    key={modul.id} 
                                    className={`relative group flex flex-col h-full rounded-3xl transition-all duration-300 hover:-translate-y-2
                                        ${modul.status === 'locked' 
                                            ? 'bg-muted border-2 border-border' 
                                            : 'bg-card border-2 border-border hover:border-primary shadow-sm hover:shadow-xl hover:shadow-primary/10'
                                        }
                                    `}
                                >
                                    <div className={`flex-1 flex flex-col p-8 h-full ${modul.status === 'locked' ? 'opacity-60 grayscale-[0.3]' : ''}`}>
                                        
                                        <div className="flex justify-between items-start mb-6">
                                            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-sm border-2 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6
                                                ${modul.status === 'locked' 
                                                    ? 'bg-muted border-border text-muted-foreground' 
                                                    : 'bg-accent/30 border-accent text-foreground'
                                                }
                                            `}>
                                                {modul.emoji}
                                            </div>
                                            
                                            {modul.status === 'completed' && (
                                                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-2 border-primary/20 px-3 py-1.5 rounded-xl font-bold flex gap-1.5">
                                                    <CheckCircle2 size={16}/> Selesai
                                                </Badge>
                                            )}
                                            {modul.status === 'available' && (
                                                <Badge className="bg-secondary/10 text-secondary hover:bg-secondary/20 border-2 border-secondary/20 px-3 py-1.5 rounded-xl font-bold flex gap-1.5">
                                                    <PlayCircle size={16}/> Mulai
                                                </Badge>
                                            )}
                                            {modul.status === 'locked' && (
                                                <Badge variant="outline" className="bg-transparent text-muted-foreground border-2 border-muted-foreground/30 px-3 py-1.5 rounded-xl font-bold flex gap-1.5">
                                                    <Lock size={16}/> Terkunci
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="flex-1 mb-8">
                                            <div className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-widest flex items-center gap-2">
                                                <span className="w-8 h-[3px] bg-border inline-block rounded-full"></span>
                                                Modul {index + 1}
                                            </div>
                                            <h3 className="text-2xl font-black text-foreground mb-3 group-hover:text-primary transition-colors leading-tight">
                                                {modul.title}
                                            </h3>
                                            <p className="text-muted-foreground text-base font-medium leading-relaxed line-clamp-3">
                                                {modul.subtitle}
                                            </p>
                                        </div>

                                        <div className="mt-auto">
                                            {/* ✅ LOGIC TOMBOL & JADWAL */}
                                            {modul.status === 'locked' ? (
                                                <div className="flex flex-col items-center justify-center h-16 bg-border/20 rounded-2xl text-muted-foreground font-bold text-sm border-2 border-border cursor-not-allowed select-none px-4">
                                                    <div className="flex items-center gap-2">
                                                        <Lock size={16} /> 
                                                        <span>Belum Tersedia</span>
                                                    </div>
                                                    {/* Tampilkan Jadwal jika ada */}
                                                    {modul.opens_at && modul.opens_at !== 'Sekarang' && (
                                                        <div className="flex items-center gap-1 text-[10px] font-normal mt-1 opacity-80 text-orange-600">
                                                            <Clock size={10} />
                                                            <span>Buka: {modul.opens_at}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <Link href={route('workshop.play', modul.id)} className="block w-full">
                                                    <Button className={`w-full rounded-2xl h-14 font-bold text-base shadow-lg transition-all duration-300 flex justify-between items-center px-6 group/btn
                                                        ${modul.status === 'completed' 
                                                            ? 'bg-card text-foreground border-2 border-border hover:bg-muted hover:border-border' 
                                                            : 'bg-primary text-primary-foreground border-2 border-transparent hover:bg-primary/90 hover:scale-[1.02]' 
                                                        }
                                                    `}>
                                                        <span>{modul.status === 'completed' ? 'Ulangi Materi' : 'Mulai Belajar'}</span>
                                                        <div className={`p-1.5 rounded-full transition-transform duration-300 ${modul.status !== 'completed' ? 'bg-white/20 group-hover/btn:translate-x-1' : 'bg-muted'}`}>
                                                            <ChevronRight size={18} className={modul.status !== 'completed' ? 'text-white' : 'text-foreground'} />
                                                        </div>
                                                    </Button>
                                                </Link>
                                            )}

                                            {modul.date && (
                                                <div className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground/70 uppercase tracking-wide">
                                                    <Calendar size={14} /> 
                                                    <span>Selesai: {modul.date}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}