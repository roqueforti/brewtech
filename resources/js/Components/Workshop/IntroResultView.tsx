import { Button } from "@/Components/ui/button";
import { PlayCircle, Trophy, BookOpen, Clock } from "lucide-react";

export default function IntroResultView({ type, moduleData, score, onAction }: any) {
    const isIntro = type === 'intro';
    const isPreResult = type === 'pre_result';
    const isPostResult = type === 'post_result';

    return (
        <div className="flex-1 overflow-y-auto relative bg-[#FAFAF9]">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-5 bg-[radial-gradient(#5BCCEA_1px,transparent_1px)] [background-size:16px_16px]"></div>

            <div className="relative z-10 flex flex-col items-center justify-center min-h-full p-6 text-center">
                
                {/* --- INTRO VIEW --- */}
                {isIntro && (
                    <div className="max-w-lg w-full space-y-8 animate-in zoom-in-95 duration-500">
                        <div className="relative group mx-auto w-fit">
                            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                            <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl">
                                <BookOpen size={48} className="text-cyan-500" />
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl font-black text-slate-800 leading-tight">
                                {moduleData.title}
                            </h1>
                            <p className="text-lg text-slate-500 leading-relaxed">
                                {moduleData.description || "Siap untuk meningkatkan keahlian Baristamu hari ini?"}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
                                <span className="text-2xl font-black text-slate-800">{moduleData.steps?.length || 0}</span>
                                <span className="text-xs font-bold text-slate-400 uppercase">Langkah</span>
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
                                <span className="text-2xl font-black text-slate-800">~15</span>
                                <span className="text-xs font-bold text-slate-400 uppercase">Menit</span>
                            </div>
                        </div>

                        <Button onClick={onAction} className="w-full h-14 text-lg font-black bg-cyan-500 hover:bg-cyan-600 text-white rounded-2xl shadow-[0px_4px_0px_#22d3ee] active:translate-y-1 active:shadow-none transition-all">
                            Mulai Belajar Sekarang <PlayCircle className="ml-2" />
                        </Button>
                    </div>
                )}

                {/* --- RESULT VIEW --- */}
                {(isPreResult || isPostResult) && (
                    <div className="max-w-md w-full space-y-8 animate-in slide-in-from-bottom-10 duration-500">
                        <div className="w-32 h-32 mx-auto bg-yellow-100 rounded-full flex items-center justify-center animate-bounce">
                            <Trophy size={64} className="text-yellow-500" />
                        </div>
                        
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black text-slate-800">
                                {isPreResult ? "Pre-Test Selesai!" : "Modul Tuntas!"}
                            </h2>
                            <p className="text-slate-500 font-medium">
                                {isPreResult ? "Hasil awal kamu cukup bagus. Yuk lanjut belajar!" : "Selamat! Kamu telah menyelesaikan modul ini."}
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] border-2 border-slate-100 shadow-xl">
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Skor Simulasi</span>
                            <div className="text-7xl font-black text-cyan-500 mt-2 mb-2">{score}</div>
                            <div className="inline-block px-3 py-1 bg-cyan-50 text-cyan-700 text-xs font-bold rounded-full">
                                {score >= 70 ? "KOMPETEN" : "PERLU LATIHAN"}
                            </div>
                        </div>

                        <Button onClick={onAction} className="w-full h-14 text-lg font-black bg-slate-800 hover:bg-slate-900 text-white rounded-2xl shadow-lg">
                            {isPreResult ? "Lanjut ke Materi" : "Kembali ke Beranda"}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}