import { Button } from "@/Components/ui/button";
import { Volume2 } from "lucide-react";

export default function MaterialView({ stepData, currentIndex, totalSteps, onSpeak }: any) {
    if (!stepData) return null;

    return (
        <div className="w-full h-full flex flex-col p-4 md:p-6 lg:p-8 gap-4 md:gap-6 overflow-hidden">
            
            {/* 1. TOP BAR */}
            <div className="shrink-0 flex items-center gap-4 bg-white/80 backdrop-blur rounded-2xl p-3 border border-slate-200 shadow-sm">
                <span className="bg-cyan-500 text-white px-4 py-1.5 rounded-xl text-sm font-black shadow-lg shadow-cyan-500/20 whitespace-nowrap">
                    Langkah {currentIndex + 1} / {totalSteps}
                </span>
                <div className="h-3 flex-1 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div 
                        className="h-full bg-cyan-500 transition-all duration-700 ease-out rounded-full"
                        style={{ width: `${((currentIndex + 1) / totalSteps) * 100}%` }}
                    ></div>
                </div>
            </div>

            {/* 2. MAIN LAYOUT */}
            <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* KOLOM KIRI: MEDIA */}
                <div className="lg:col-span-8 h-full bg-slate-900 rounded-[2rem] border-4 border-white shadow-xl overflow-hidden relative group">
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50">
                        {stepData.media_url ? (
                            stepData.media_type === 'video' || stepData.media_url.endsWith('.mp4') ? (
                                <video 
                                    src={stepData.media_url} 
                                    className="w-full h-full object-contain"
                                    controls 
                                    autoPlay 
                                    muted 
                                    loop 
                                    playsInline 
                                />
                            ) : (
                                <img 
                                    src={stepData.media_url} 
                                    alt={stepData.title} 
                                    className="w-full h-full object-contain bg-black/20 backdrop-blur-sm"
                                />
                            )
                        ) : (
                            <div className="text-slate-500 font-bold flex flex-col items-center gap-2">
                                <span className="text-4xl">📷</span>
                                <span>Tidak ada media visual</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* KOLOM KANAN: TEXT */}
                <div className="lg:col-span-4 h-full flex flex-col">
                    
                    <div className="flex-1 bg-white rounded-[2rem] border-2 border-slate-100 shadow-xl p-6 md:p-8 flex flex-col overflow-hidden relative">
                        {/* Dekorasi Background */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                        <div className="relative z-10 flex flex-col h-full">
                            {/* Judul & Suara */}
                            <div className="flex justify-between items-start gap-4 mb-4 shrink-0 border-b border-slate-100 pb-4">
                                <h2 className="text-2xl md:text-3xl lg:text-3xl font-black text-slate-800 leading-[1.1]">
                                    {stepData.title}
                                </h2>
                                <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="rounded-full border-2 border-cyan-100 text-cyan-600 hover:bg-cyan-50 hover:border-cyan-300 hover:text-cyan-700 shrink-0 w-10 h-10 transition-all shadow-sm"
                                    onClick={() => onSpeak(stepData.description)}
                                >
                                    <Volume2 size={20} />
                                </Button>
                            </div>
                            
                            {/* Deskripsi (Scrollable) */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 mb-4">
                                <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium font-body">
                                    {stepData.description}
                                </p>
                            </div>

                            {/* Label Kecil (Hiasan) */}
                            <div className="mt-auto pt-4 border-t border-dashed border-slate-200 shrink-0">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">
                                    Panduan Praktikum Brewtech
                                </p>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}