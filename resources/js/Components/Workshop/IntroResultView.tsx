import { Play, Trophy, ChevronRight, CheckCircle2, Star, Sparkles } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";

interface Props {
    type: 'intro' | 'pre_result' | 'post_result';
    moduleData?: any;
    score?: number;
    onAction: () => void;
}

export default function IntroResultView({ type, moduleData, score, onAction }: Props) {
    return (
        <div className="relative flex-1 overflow-y-auto scroll-smooth flex flex-col items-center justify-center p-6 bg-[#FAFAF9]">
            
            <div className="relative z-10 w-full max-w-2xl mx-auto text-center">
                
                {/* =======================
                    1. TAMPILAN INTRO
                   ======================= */}
                {type === 'intro' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
                        {/* Emoji Container */}
                        <div className="relative inline-block group cursor-default">
                            <div className="relative text-[8rem] drop-shadow-xl animate-bounce-slow">
                                {moduleData?.emoji || '🎓'}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight leading-tight">
                                {moduleData?.title || "Judul Modul"}
                            </h1>
                            <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">
                                {moduleData?.description || "Deskripsi singkat mengenai modul pembelajaran ini."}
                            </p>
                        </div>

                        <div className="pt-4">
                            <Button 
                                size="lg" 
                                onClick={onAction}
                                className="h-14 px-10 rounded-2xl font-bold text-lg shadow-lg bg-orange-500 hover:bg-orange-600 hover:scale-[1.02] transition-all duration-300"
                            >
                                <Play className="mr-2 h-5 w-5 fill-current" /> Mulai Belajar
                            </Button>
                        </div>
                    </div>
                )}

                {/* =======================
                    2. RESULT PRE-TEST
                   ======================= */}
                {type === 'pre_result' && (
                    <div className="animate-in zoom-in-95 duration-500 w-full max-w-lg mx-auto">
                        <Card className="border-2 border-slate-200 shadow-sm bg-white overflow-hidden rounded-[2.5rem]">
                            <CardContent className="p-10 flex flex-col items-center">
                                <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-6 border-2 border-blue-100">
                                    <CheckCircle2 size={40} className="text-blue-600" />
                                </div>
                                
                                <h2 className="text-2xl font-black text-slate-800 mb-2">Pre-Test Selesai!</h2>
                                <p className="text-slate-500 font-medium mb-8">
                                    Kemampuan awalmu sudah tercatat.
                                </p>

                                <div className="w-full bg-slate-50 rounded-[1.5rem] p-6 mb-8 border-2 border-slate-100 relative overflow-hidden group">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Skor Kamu</p>
                                    <div className="text-5xl font-black text-slate-800">
                                        {score ?? 0}<span className="text-2xl text-slate-300 ml-1">/100</span>
                                    </div>
                                </div>

                                <Button 
                                    size="lg" 
                                    onClick={onAction}
                                    className="w-full h-12 rounded-xl font-bold text-base bg-slate-900 hover:bg-slate-800 text-white shadow-lg transition-transform active:scale-95"
                                >
                                    Masuk ke Materi <ChevronRight className="ml-2 h-5 w-5"/>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* =======================
                    3. RESULT POST-TEST (FINAL)
                   ======================= */}
                {type === 'post_result' && (
                    <div className="animate-in zoom-in-95 duration-700 w-full max-w-lg mx-auto relative">
                        <Card className="border-2 border-slate-200 shadow-sm bg-white overflow-hidden rounded-[2.5rem] relative z-10">
                            <CardContent className="p-10 flex flex-col items-center">
                                <div className="relative mb-6">
                                    <div className="relative w-24 h-24 rounded-full bg-orange-50 border-2 border-orange-100 flex items-center justify-center">
                                        <Trophy size={48} className="text-orange-500" />
                                        <Sparkles className="absolute -top-2 -right-2 text-yellow-400 animate-bounce" size={20} fill="currentColor" />
                                    </div>
                                </div>
                                
                                <h2 className="text-3xl font-black text-slate-800 mb-2">Luar Biasa! 🎉</h2>
                                <p className="text-slate-500 font-medium mb-8">
                                    Kamu telah menyelesaikan modul ini.
                                </p>

                                <div className="w-full bg-orange-50 rounded-[1.5rem] p-6 mb-8 border-2 border-orange-100 relative overflow-hidden text-center">
                                    <p className="text-xs font-extrabold text-orange-400 uppercase tracking-widest mb-1">Nilai Akhir</p>
                                    <div className="text-6xl font-black text-orange-600">
                                        {score ?? 0}
                                    </div>
                                    <div className="text-sm font-bold text-orange-400 mt-2">Kompeten!</div>
                                </div>

                                <Button 
                                    size="lg" 
                                    onClick={onAction}
                                    className="w-full h-14 rounded-2xl font-bold text-base bg-slate-900 hover:bg-slate-800 text-white shadow-lg transition-all hover:-translate-y-1"
                                >
                                    Kembali ke Dashboard
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                )}

            </div>
        </div>
    );
}