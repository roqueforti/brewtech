import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Lock, Maximize, Minimize, ArrowLeft } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { toast } from "sonner";
import { Link, usePage } from "@inertiajs/react";

export default function ModulSidebar({ 
    moduleTitle, steps, viewMode, currentStepIndex, progress, isPreview, onNavigate 
}: any) {
    const isCompleted = (idx: number) => isPreview ? idx < currentStepIndex : false; 
    const [isFullscreen, setIsFullscreen] = useState(false);

    // --- 1. AMBIL DATA USER & MODUL DARI INERTIA ---
    const { props } = usePage();
    const { auth, module } = props as any;
    const userRole = auth?.user?.role;

    // --- 2. TENTUKAN LINK KEMBALI ---
    // Jika siswa -> Dashboard. Jika Pengajar -> Edit Modul.
    const backLink = userRole === 'student' 
        ? '/peserta/dashboard' 
        : `/pengajar/modul/${module?.id}/edit`;

    const backLabel = userRole === 'student' 
        ? 'Kembali ke Dashboard' 
        : 'Kembali ke Detail Modul';

    // --- LOGIC FULLSCREEN ---
    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => {
                setIsFullscreen(true);
                toast.success("Layar Penuh Aktif");
            }).catch((err) => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    // Listener untuk sinkronisasi tombol Esc
    useEffect(() => {
        const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    return (
        <div className="flex flex-col h-full bg-white">
            
            {/* HEADER SIDEBAR (Title & Back Button) */}
            <div className="px-6 py-6 border-b border-slate-100 bg-white z-10 sticky top-0">
                
                {/* TOMBOL KEMBALI DINAMIS */}
                <Link 
                    href={backLink} 
                    className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-cyan-600 transition-colors mb-4 group"
                >
                    <div className="p-1 rounded-full bg-slate-50 group-hover:bg-cyan-50 transition-colors">
                        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform"/>
                    </div>
                    {backLabel}
                </Link>

                <div className="flex flex-col gap-2">
                    <span className="w-fit text-[10px] font-bold text-cyan-500 uppercase tracking-widest bg-cyan-50 px-2 py-1 rounded">
                        Modul Pelatihan
                    </span>
                    <h2 className="text-xl font-black text-slate-800 leading-tight line-clamp-2" title={moduleTitle}>
                        {moduleTitle}
                    </h2>
                </div>

                {isPreview && (
                    <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-cyan-500 transition-all duration-500 ease-out" 
                            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                        ></div>
                    </div>
                )}
            </div>

            {/* LIST MENU (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-hide">
                <SidebarItem 
                    label="Evaluasi Awal"
                    title="Pre-Test"
                    active={viewMode === 'pre_test'}
                    completed={viewMode === 'pre_result' || viewMode === 'material' || (progress && progress.pretest_score !== null)}
                    onClick={() => onNavigate('pre_test')}
                />

                <div className="py-4 relative">
                    {/* Garis Vertikal Konektor */}
                    <div className="absolute left-8 top-0 bottom-0 w-px bg-slate-100 -z-10 hidden md:block"></div>

                    <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 bg-white w-fit">Materi Praktikum</p>
                    
                    {/* Menu Alat & Bahan */}
                    <SidebarItem 
                        label="Persiapan"
                        title="Alat & Bahan"
                        active={viewMode === 'tools'}
                        completed={viewMode === 'material'}
                        onClick={() => onNavigate('tools')}
                        compact
                    />
                    
                    {/* List Langkah-Langkah */}
                    <div className="space-y-1 mt-1">
                        {steps.map((step: any, idx: number) => (
                            <button 
                                key={idx}
                                onClick={() => onNavigate('material', idx)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-left group ml-2 relative
                                    ${viewMode === 'material' && currentStepIndex === idx 
                                        ? 'bg-cyan-50 text-cyan-700 font-bold border-l-4 border-cyan-500' 
                                        : 'text-slate-600 hover:bg-slate-50 border-l-4 border-transparent'
                                    }
                                `}
                            >
                                <div className={`w-2 h-2 rounded-full shrink-0 transition-colors ${viewMode === 'material' && currentStepIndex === idx ? 'bg-cyan-50 ring-4 ring-cyan-100' : 'bg-slate-300'}`}></div>
                                <span className="text-xs font-medium truncate line-clamp-1 flex-1">{step.title}</span>
                                {(viewMode === 'material' && currentStepIndex > idx) && <CheckCircle2 size={12} className="text-green-500"/>}
                            </button>
                        ))}
                    </div>
                </div>

                <SidebarItem 
                    label="Evaluasi Akhir"
                    title="Post-Test"
                    active={viewMode === 'post_test'}
                    completed={progress && progress.posttest_score !== null} 
                    onClick={() => onNavigate('post_test')}
                />
            </div>

            {/* FOOTER: FULL SCREEN BUTTON */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                <Button 
                    variant="outline" 
                    className="w-full justify-center gap-2 border-slate-200 text-slate-600 hover:bg-white hover:text-cyan-600 hover:border-cyan-200 transition-all shadow-sm h-10 rounded-xl"
                    onClick={toggleFullScreen}
                >
                    {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                    <span className="text-xs font-bold">{isFullscreen ? "Keluar Layar Penuh" : "Mode Layar Penuh"}</span>
                </Button>
            </div>
        </div>
    );
}

const SidebarItem = ({ label, title, active, completed, onClick, compact }: any) => (
    <button 
        onClick={onClick}
        className={`w-full ${compact ? 'p-3 py-2' : 'p-4'} rounded-2xl border-2 transition-all flex items-center justify-between group relative overflow-hidden
            ${active 
                ? 'border-cyan-500 bg-white shadow-lg shadow-cyan-100/50 ring-1 ring-cyan-500 z-10' 
                : 'border-transparent hover:bg-slate-50'
            }
        `}
    >
        <div className="text-left relative z-10">
            {!compact && <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">{label}</span>}
            <span className={`font-bold ${compact ? 'text-xs' : 'text-sm'} ${active ? 'text-cyan-700' : 'text-slate-700'}`}>{title}</span>
        </div>
        {completed 
            ? <div className="bg-green-100 p-1 rounded-full"><CheckCircle2 size={16} className="text-green-600"/></div> 
            : (active 
                ? <div className="bg-cyan-100 p-1 rounded-full animate-pulse"><Circle size={16} className="text-cyan-600"/></div> 
                : <Lock size={16} className="text-slate-300"/>
            )
        }
    </button>
);