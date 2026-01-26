import { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { 
    ChevronLeft, ChevronRight, CheckCircle, 
    FileText, CheckCircle2, Menu, Timer,
    Volume2, StopCircle, GraduationCap, ArrowLeft, BookOpen, Eye, 
    Play, Star, Trophy, Info, X
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Progress } from "@/Components/ui/progress";
import { Badge } from "@/Components/ui/badge";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/Components/ui/sheet";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { Label } from "@/Components/ui/label";
import { Card, CardContent } from "@/Components/ui/card";
import { toast } from "sonner"; 

// --- TYPES ---
interface OptionMedia { url: string; type: string; }
interface Question {
    id: number; question: string; options: string[];
    media_url: string | null; media_type: 'image' | 'video' | null;
    options_media: (OptionMedia | null)[] | null; type: 'pre_test' | 'post_test';
}
interface Step {
    id: number; title: string; description: string;
    media_url: string | null; media_type: 'video' | 'image' | null;
}
interface Module {
    id: number; title: string; description: string; emoji: string;
    steps: Step[]; questions: Question[];
}
interface Props {
    auth?: { user: any }; module: Module; progress?: any; isPreview?: boolean;
}

type ViewMode = 'intro' | 'pre_test' | 'pre_result' | 'material' | 'post_test' | 'post_result';

export default function WorkshopPlay({ auth, module, progress, isPreview = false }: Props) {
    const allQuestions = module.questions || [];
    const preTestQuestions = allQuestions.filter(q => q.type === 'pre_test');
    const postTestQuestions = allQuestions.filter(q => q.type === 'post_test');
    const steps = module.steps || [];

    // STATE
    const [viewMode, setViewMode] = useState<ViewMode>('intro');
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [quizIndex, setQuizIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({}); 
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar state

    // --- INIT STATE ---
    useEffect(() => {
        if (isPreview) {
            setViewMode('intro');
        } else {
            if (progress?.status === 'completed') setViewMode('post_result');
            else if (progress?.posttest_score !== null) setViewMode('post_result');
            else if (progress?.pretest_score !== null) setViewMode('material');
            else setViewMode('intro');
        }
    }, [progress, isPreview]);

    // --- TTS HELPER ---
    const handleSpeak = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            if (isSpeaking) { setIsSpeaking(false); return; }
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'id-ID'; utterance.rate = 0.9; 
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        } else { alert("Browser tidak mendukung suara."); }
    };
    useEffect(() => { return () => window.speechSynthesis.cancel(); }, [viewMode, currentStepIndex]);

    // --- SUBMIT QUIZ ---
    const submitQuiz = (type: 'pre_test' | 'post_test') => {
        if (isPreview) {
            toast.info("Preview: Langsung ke Hasil.");
            setViewMode(type === 'pre_test' ? 'pre_result' : 'post_result');
            return;
        }
        window.speechSynthesis.cancel(); setIsSpeaking(false);
        router.post(`/api/workshop/${module.id}/quiz/submit`, { type, score: 80 }, {
            onSuccess: () => {
                toast.success("Jawaban Terkirim!");
                setViewMode(type === 'pre_test' ? 'pre_result' : 'post_result');
            },
            onError: () => toast.error("Gagal mengirim jawaban.")
        });
    };

    // --- RENDER HELPERS ---
    const PreviewControls = () => isPreview ? (
        <div className="bg-yellow-100 border-b border-yellow-200 p-1 text-center text-[10px] font-bold text-yellow-800 flex justify-center items-center gap-2 sticky top-0 z-50">
            <Eye size={12}/> PREVIEW:
            {['intro','pre_test','pre_result','material','post_test','post_result'].map((m) => (
                <button key={m} onClick={() => setViewMode(m as ViewMode)} className={`px-1 rounded border ${viewMode === m ? 'bg-yellow-300' : 'bg-white'}`}>{m}</button>
            ))}
        </div>
    ) : null;

    // --- 1. SIDEBAR NAVIGATION (DICODING STYLE) ---
    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white border-r border-slate-200 w-full lg:w-80">
            <div className="p-6 border-b border-slate-100">
                <Link href="/peserta/dashboard" className="flex items-center text-slate-500 hover:text-slate-800 mb-4 text-sm font-bold transition-colors">
                    <ArrowLeft size={16} className="mr-1" /> Kembali ke Dashboard
                </Link>
                <h2 className="font-bold text-slate-800 text-lg leading-tight">{module.title}</h2>
                {/* Progress Bar Kecil */}
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 font-bold">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" 
                             style={{width: viewMode === 'post_result' ? '100%' : viewMode === 'material' ? `${((currentStepIndex+1)/steps.length)*80}%` : '10%'}}
                        ></div>
                    </div>
                    <span>{viewMode === 'post_result' ? '100%' : viewMode === 'material' ? `${Math.round(((currentStepIndex+1)/steps.length)*80)}%` : '0%'}</span>
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-6">
                    
                    {/* SECTION: PRE-TEST */}
                    <div>
                        <h3 className="px-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Evaluasi Awal</h3>
                        <button disabled className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 text-sm font-medium ${viewMode === 'pre_test' || viewMode === 'pre_result' ? 'bg-blue-50 text-blue-700' : (progress?.pretest_score ? 'text-slate-500' : 'text-slate-700')}`}>
                            {progress?.pretest_score ? <CheckCircle2 size={16} className="text-green-500"/> : <div className="w-4 h-4 rounded-full border-2 border-slate-300"/>}
                            Pre-Test
                        </button>
                    </div>

                    {/* SECTION: MATERI */}
                    <div>
                        <h3 className="px-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Materi Belajar</h3>
                        <div className="space-y-1">
                            {steps.map((step, index) => {
                                const isActive = viewMode === 'material' && currentStepIndex === index;
                                const isDone = viewMode === 'material' && index < currentStepIndex || viewMode === 'post_test' || viewMode === 'post_result';
                                return (
                                    <button 
                                        key={step.id} 
                                        onClick={() => {
                                            if (progress?.pretest_score !== null || isPreview) {
                                                setViewMode('material');
                                                setCurrentStepIndex(index);
                                                setSidebarOpen(false); // Close mobile sidebar on click
                                            }
                                        }}
                                        disabled={!progress?.pretest_score && !isPreview}
                                        className={`w-full text-left px-3 py-2.5 rounded-lg flex items-start gap-3 transition-all
                                            ${isActive ? 'bg-blue-50 text-blue-700 border border-blue-100 font-bold' : 'text-slate-600 hover:bg-slate-50'}
                                            ${!progress?.pretest_score && !isPreview ? 'opacity-50 cursor-not-allowed' : ''}
                                        `}
                                    >
                                        <div className={`mt-0.5 w-4 h-4 flex-shrink-0 rounded-full flex items-center justify-center border 
                                            ${isActive ? 'border-blue-500 bg-blue-500' : isDone ? 'border-green-500 bg-green-500 text-white' : 'border-slate-300'}
                                        `}>
                                            {isActive ? <div className="w-1.5 h-1.5 bg-white rounded-full"/> : isDone ? <CheckCircle2 size={12}/> : null}
                                        </div>
                                        <span className="text-sm leading-snug">{step.title}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* SECTION: POST-TEST */}
                    <div>
                        <h3 className="px-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Evaluasi Akhir</h3>
                        <button disabled className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 text-sm font-medium ${viewMode === 'post_test' || viewMode === 'post_result' ? 'bg-purple-50 text-purple-700' : (progress?.posttest_score ? 'text-slate-500' : 'text-slate-700')}`}>
                            {progress?.posttest_score ? <CheckCircle2 size={16} className="text-green-500"/> : <div className="w-4 h-4 rounded-full border-2 border-slate-300"/>}
                            Post-Test
                        </button>
                    </div>

                </div>
            </ScrollArea>
        </div>
    );

    // --- MAIN RENDER ---
    return (
        <div className="flex h-screen bg-white font-sans text-slate-900 overflow-hidden">
            <Head title={`Belajar - ${module.title}`} />
            <PreviewControls />

            {/* SIDEBAR DESKTOP */}
            <aside className="hidden lg:block w-80 h-full border-r border-slate-200 z-20">
                <SidebarContent />
            </aside>

            {/* MAIN AREA */}
            <main className="flex-1 flex flex-col h-full relative w-full">
                
                {/* HEADER MOBILE */}
                <header className="lg:hidden h-16 bg-white border-b flex items-center justify-between px-4 sticky top-0 z-30 shrink-0">
                    <span className="font-bold text-slate-800 truncate max-w-[200px]">{module.title}</span>
                    <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                        <SheetTrigger asChild><Button variant="ghost" size="icon"><Menu /></Button></SheetTrigger>
                        <SheetContent side="left" className="p-0 w-80"><SidebarContent /></SheetContent>
                    </Sheet>
                </header>

                {/* SCROLLABLE CONTENT AREA */}
                <ScrollArea className="flex-1 bg-white">
                    <div className="max-w-3xl mx-auto p-6 md:p-12 pb-32 min-h-full">
                        
                        {/* 1. VIEW INTRO */}
                        {viewMode === 'intro' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                                <div className="text-center space-y-4">
                                    <div className="text-[6rem] mx-auto animate-bounce">{module.emoji || '🎓'}</div>
                                    <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">{module.title}</h1>
                                    <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">{module.description}</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Card className="bg-slate-50 border-slate-200"><CardContent className="p-4 text-center"><h4 className="font-bold text-slate-700">Pre-Test</h4><p className="text-xs text-slate-500">Cek kemampuan awal</p></CardContent></Card>
                                    <Card className="bg-slate-50 border-slate-200"><CardContent className="p-4 text-center"><h4 className="font-bold text-slate-700">{steps.length} Materi</h4><p className="text-xs text-slate-500">Video & Bacaan</p></CardContent></Card>
                                    <Card className="bg-slate-50 border-slate-200"><CardContent className="p-4 text-center"><h4 className="font-bold text-slate-700">Post-Test</h4><p className="text-xs text-slate-500">Evaluasi akhir</p></CardContent></Card>
                                </div>
                                <div className="flex justify-center pt-8">
                                    <Button size="lg" className="h-14 px-8 text-lg rounded-full font-bold shadow-xl shadow-blue-200 bg-blue-600 hover:bg-blue-700 transition-transform hover:-translate-y-1"
                                        onClick={() => preTestQuestions.length > 0 ? setViewMode('pre_test') : setViewMode('material')}
                                    >
                                        Mulai Belajar Sekarang <ArrowLeft className="rotate-180 ml-2"/>
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* 2. VIEW QUIZ (Pre/Post) */}
                        {(viewMode === 'pre_test' || viewMode === 'post_test') && (
                            <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in">
                                {viewMode === 'pre_test' ? questions(preTestQuestions) : questions(postTestQuestions)}
                            </div>
                        )}

                        {/* 3. VIEW RESULT */}
                        {(viewMode === 'pre_result' || viewMode === 'post_result') && (
                            <div className="text-center space-y-8 animate-in zoom-in-95 duration-500 py-10">
                                <div className="inline-block p-6 rounded-full bg-slate-50 border-4 border-white shadow-2xl">
                                    {(viewMode === 'pre_result' ? (progress?.pretest_score ?? 80) : (progress?.posttest_score ?? 80)) >= 70 
                                        ? <Trophy size={80} className="text-yellow-500 animate-pulse"/> 
                                        : <Star size={80} className="text-blue-500"/>
                                    }
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-slate-800 mb-2">
                                        {viewMode === 'pre_result' ? "Hasil Pre-Test" : "Selamat! Modul Selesai"}
                                    </h2>
                                    <div className="text-6xl font-black text-slate-800 my-4">
                                        {viewMode === 'pre_result' ? (progress?.pretest_score ?? 80) : (progress?.posttest_score ?? 80)}
                                        <span className="text-2xl text-slate-400 font-medium">/100</span>
                                    </div>
                                    <p className="text-slate-500 max-w-md mx-auto">
                                        {viewMode === 'pre_result' ? "Awal yang bagus! Yuk pelajari materinya agar nilaimu makin sempurna." : "Kamu luar biasa! Teruslah berlatih untuk menjadi ahli."}
                                    </p>
                                </div>
                                <Button size="lg" className="h-14 px-10 rounded-full font-bold text-lg" 
                                    onClick={viewMode === 'pre_result' ? () => setViewMode('material') : () => router.visit('/peserta/dashboard')}
                                >
                                    {viewMode === 'pre_result' ? "Lanjut Materi" : "Kembali ke Dashboard"} <ArrowLeft className="rotate-180 ml-2"/>
                                </Button>
                            </div>
                        )}

                        {/* 4. VIEW MATERIAL */}
                        {viewMode === 'material' && steps[currentStepIndex] && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                                <div className="space-y-2 border-b border-slate-100 pb-6">
                                    <div className="flex items-center gap-2 text-sm font-bold text-blue-600 uppercase tracking-wider">
                                        <span className="bg-blue-50 px-2 py-1 rounded">Langkah {currentStepIndex + 1}</span>
                                        <span className="text-slate-300">/</span>
                                        <span className="text-slate-400">{steps.length}</span>
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                                        {steps[currentStepIndex].title}
                                    </h1>
                                </div>

                                {/* Media */}
                                <div className="rounded-2xl overflow-hidden bg-slate-900 shadow-xl ring-1 ring-slate-200">
                                    {steps[currentStepIndex].media_url ? (
                                        steps[currentStepIndex].media_type === 'video' ? (
                                            <video key={steps[currentStepIndex].media_url} controls className="w-full aspect-video object-cover" controlsList="nodownload"><source src={steps[currentStepIndex].media_url} type="video/mp4" /></video>
                                        ) : (<img src={steps[currentStepIndex].media_url} alt="Materi" className="w-full h-auto object-contain bg-black"/>)
                                    ) : (
                                        <div className="h-64 flex flex-col items-center justify-center text-slate-500"><FileText size={48} className="mb-2 opacity-50"/><p>Tidak ada media visual</p></div>
                                    )}
                                </div>

                                {/* Text Content */}
                                <div className="prose prose-lg prose-slate max-w-none text-slate-700 leading-relaxed">
                                    <p>{steps[currentStepIndex].description}</p>
                                </div>

                                {/* TTS Button */}
                                <div className="flex justify-end pt-4">
                                    <Button variant="outline" onClick={() => handleSpeak(`Judul: ${steps[currentStepIndex].title}. ${steps[currentStepIndex].description}`)} className="rounded-full border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200">
                                        {isSpeaking ? <StopCircle className="mr-2 animate-pulse text-red-500"/> : <Volume2 className="mr-2"/>}
                                        {isSpeaking ? "Stop Suara" : "Bacakan Materi"}
                                    </Button>
                                </div>
                            </div>
                        )}

                    </div>
                </ScrollArea>

                {/* BOTTOM NAVIGATION BAR (FIXED) */}
                {(viewMode === 'material' || viewMode === 'pre_test' || viewMode === 'post_test') && (
                    <div className="h-20 bg-white border-t border-slate-200 flex items-center justify-between px-6 md:px-10 shrink-0 z-40">
                        {/* Tombol Sebelumnya */}
                        <Button variant="ghost" size="lg" 
                            disabled={(viewMode === 'material' && currentStepIndex === 0) || (viewMode !== 'material' && quizIndex === 0)}
                            onClick={() => {
                                if(viewMode === 'material') setCurrentStepIndex(p => p - 1);
                                else setQuizIndex(p => p - 1);
                            }}
                            className="text-slate-500 font-bold"
                        >
                            <ChevronLeft className="mr-2"/> Sebelumnya
                        </Button>

                        {/* Tombol Selanjutnya / Selesai */}
                        {viewMode === 'material' ? (
                            <Button size="lg" className="bg-slate-900 text-white hover:bg-slate-800 rounded-lg px-8 font-bold"
                                onClick={() => {
                                    if(currentStepIndex < steps.length - 1) setCurrentStepIndex(p => p + 1);
                                    else {
                                        if(postTestQuestions.length > 0) { if(confirm("Lanjut Post-Test?")) setViewMode('post_test'); }
                                        else { toast.success("Modul Selesai!"); router.visit('/peserta/dashboard'); }
                                    }
                                }}
                            >
                                {currentStepIndex === steps.length - 1 ? "Lanjut Post-Test" : "Selanjutnya"} <ChevronRight className="ml-2"/>
                            </Button>
                        ) : (
                            // Tombol Quiz
                            <Button size="lg" className="bg-slate-900 text-white hover:bg-slate-800 rounded-lg px-8 font-bold"
                                onClick={() => {
                                    const qList = viewMode === 'pre_test' ? preTestQuestions : postTestQuestions;
                                    if(quizIndex < qList.length - 1) setQuizIndex(p => p + 1);
                                    else submitQuiz(viewMode as any);
                                }}
                                disabled={answers[(viewMode === 'pre_test' ? preTestQuestions : postTestQuestions)[quizIndex].id] === undefined}
                            >
                                {quizIndex === (viewMode === 'pre_test' ? preTestQuestions : postTestQuestions).length - 1 ? "Selesai" : "Selanjutnya"} <ChevronRight className="ml-2"/>
                            </Button>
                        )}
                    </div>
                )}

            </main>
        </div>
    );

    // --- HELPER RENDER QUESTION ---
    function questions(list: Question[]) {
        const q = list[quizIndex];
        return (
            <div key={q.id} className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <h2 className="font-bold text-slate-800 text-lg">Pertanyaan {quizIndex+1} dari {list.length}</h2>
                    <Button variant="ghost" size="sm" onClick={() => handleSpeak(q.question)}><Volume2/></Button>
                </div>
                {q.media_url && <img src={q.media_url} className="rounded-lg border border-slate-200 max-h-64 mx-auto"/>}
                <p className="text-xl font-medium text-slate-800 leading-relaxed">{q.question}</p>
                <div className="grid grid-cols-1 gap-3">
                    {q.options.map((opt, idx) => (
                        <div key={idx} onClick={() => setAnswers(p => ({...p, [q.id]: idx}))}
                            className={`p-4 rounded-xl border-2 cursor-pointer flex items-center gap-4 transition-all
                                ${answers[q.id] === idx ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}
                            `}
                        >
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold
                                ${answers[q.id] === idx ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 text-slate-400'}
                            `}>{String.fromCharCode(65+idx)}</div>
                            <span className="font-medium text-slate-700">{opt}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}