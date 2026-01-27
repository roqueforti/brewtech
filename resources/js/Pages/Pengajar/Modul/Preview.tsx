import { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react"; 
import { Eye, Menu, MonitorPlay, XCircle, Wrench, Maximize, Minimize } from "lucide-react"; 
import { Button } from "@/Components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/Components/ui/sheet";
import { toast } from "sonner";

// Import Komponen UI Modular
import ModulSidebar from "@/Components/Workshop/ModulSidebar";
import IntroResultView from "@/Components/Workshop/IntroResultView";
import QuizView from "@/Components/Workshop/QuizCard";
import MaterialView from "@/Components/Workshop/MaterialView";
import NavigationFooter from "@/Components/Workshop/NavigationFooter";

// Tipe Data View
type ViewMode = 'intro' | 'pre_test' | 'pre_result' | 'tools' | 'material' | 'post_test' | 'post_result';

export default function TeacherPreview({ module }: any) {
    // --- 1. STATE ---
    const [viewMode, setViewMode] = useState<ViewMode>('intro');
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [quizIndex, setQuizIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false); // ✅ State Fullscreen

    // --- 2. DATA NORMALIZATION ---
    const normalizeQuestions = (data: any[]) => {
        return (data || []).map(q => {
            let parsedOptions = q.options;
            if (typeof parsedOptions === 'string') {
                try { parsedOptions = JSON.parse(parsedOptions); } catch (e) { parsedOptions = []; }
            }
            return {
                ...q,
                options: parsedOptions,
                correct_option: Number(q.correct_answer ?? q.correct_option ?? 0)
            };
        });
    };

    const preQuestions = normalizeQuestions(module.pre_test_questions);
    const postQuestions = normalizeQuestions(module.post_test_questions);
    const tools = module.tools || [];
    const steps = module.steps || [];

    // --- 3. LOGIKA TTS & FULLSCREEN ---
    const handleSpeak = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            if (isSpeaking && text === "") { setIsSpeaking(false); return; }
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'id-ID'; utterance.rate = 0.9;
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        }
    };

    // ✅ Fungsi Toggle Full Screen
    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => {
                setIsFullscreen(true);
                toast.success("Mode Presentasi Aktif");
            }).catch((err) => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
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
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            window.speechSynthesis.cancel();
        };
    }, []);

    // --- 4. NAVIGASI (LOOSE FLOW) ---
    const handleNext = () => {
        handleSpeak("");
        
        if (viewMode === 'intro') {
            if (preQuestions.length > 0) { setViewMode('pre_test'); setQuizIndex(0); setAnswers({}); }
            else if (tools.length > 0) { setViewMode('tools'); }
            else { setViewMode('material'); setCurrentStepIndex(0); }
        }
        else if (viewMode === 'pre_test') {
            if (quizIndex < preQuestions.length - 1) setQuizIndex(p => p + 1);
            else submitQuizMock('pre_test');
        }
        else if (viewMode === 'pre_result') {
            if (tools.length > 0) setViewMode('tools');
            else { setViewMode('material'); setCurrentStepIndex(0); }
        }
        else if (viewMode === 'tools') {
            setViewMode('material'); setCurrentStepIndex(0);
        }
        else if (viewMode === 'material') {
            if (currentStepIndex < steps.length - 1) setCurrentStepIndex(p => p + 1);
            else {
                if (postQuestions.length > 0) { 
                    toast.info("[Preview] Materi selesai. Masuk Post-Test.");
                    setViewMode('post_test'); setQuizIndex(0); setAnswers({});
                } else {
                    toast.success("[Preview] Modul Selesai!");
                    setViewMode('intro'); 
                }
            }
        }
        else if (viewMode === 'post_test') {
            if (quizIndex < postQuestions.length - 1) setQuizIndex(p => p + 1);
            else submitQuizMock('post_test');
        }
        else if (viewMode === 'post_result') {
            toast.success("[Preview] Selesai. Reset ke awal.");
            setViewMode('intro');
        }
    };

    const handlePrev = () => {
        handleSpeak("");
        if (viewMode === 'pre_test') {
            if (quizIndex > 0) setQuizIndex(p => p - 1); else setViewMode('intro');
        } else if (viewMode === 'tools') {
            if (preQuestions.length > 0) setViewMode('pre_result'); else setViewMode('intro');
        } else if (viewMode === 'material') {
            if (currentStepIndex > 0) setCurrentStepIndex(p => p - 1);
            else if (tools.length > 0) setViewMode('tools'); 
            else if (preQuestions.length > 0) setViewMode('pre_result');
            else setViewMode('intro');
        } else if (viewMode === 'post_test') {
            if (quizIndex > 0) setQuizIndex(p => p - 1);
            else { setViewMode('material'); setCurrentStepIndex(steps.length - 1); }
        }
    };

    const submitQuizMock = (type: string) => {
        toast.info(`[PREVIEW MODE] Jawaban ${type} tersimpan lokal. Skor simulasi: 85.`);
        if (type === 'pre_test') setViewMode('pre_result');
        else setViewMode('post_result');
    };

    const currentQ = viewMode === 'pre_test' ? preQuestions[quizIndex] : postQuestions[quizIndex];

    return (
        <div className="fixed inset-0 flex flex-col bg-[#FAFAF9] font-sans text-foreground selection:bg-cyan-100">
            <Head title={`[PREVIEW] ${module.title}`} />

            {/* --- ADMIN TOOLBAR --- */}
            <div className="h-14 bg-slate-900 text-white flex items-center justify-between px-6 shadow-md z-50 shrink-0 select-none">
                <div className="flex items-center gap-3">
                    <div className="bg-cyan-500 p-1.5 rounded-lg">
                        <Eye size={18} className="text-white animate-pulse"/>
                    </div>
                    <span className="font-bold text-sm tracking-wide hidden md:block">MODE PREVIEW INSTRUKTUR</span>
                    <span className="font-bold text-sm tracking-wide md:hidden">PREVIEW</span>
                </div>

                {/* Navigasi Cepat (Desktop Only) */}
                <div className="hidden lg:flex items-center bg-slate-800 rounded-lg p-1 gap-1">
                    {['intro','pre_test','tools','material','post_test'].map((m) => (
                        <button key={m} onClick={() => setViewMode(m as ViewMode)} 
                            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${viewMode === m ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}>
                            {m.replace('_', ' ').toUpperCase()}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    {/* ✅ Tombol Full Screen */}
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={toggleFullScreen}
                        className="text-slate-300 hover:text-white hover:bg-slate-800 gap-2"
                        title={isFullscreen ? "Keluar Full Screen" : "Masuk Full Screen"}
                    >
                        {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                        <span className="hidden md:inline">{isFullscreen ? "Normal" : "Full Screen"}</span>
                    </Button>

                    <div className="w-px h-4 bg-slate-700 mx-1"></div>

                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-300 hover:text-white hover:bg-red-500/20 gap-2" 
                        onClick={() => router.visit('/pengajar/modul')}
                    >
                        <XCircle size={18} /> <span className="hidden md:inline">Tutup</span>
                    </Button>
                </div>
            </div>

            {/* --- MAIN LAYOUT --- */}
            <div className="flex flex-1 overflow-hidden relative">
                
                {/* SIDEBAR */}
                <aside className="hidden lg:block w-80 h-full bg-white border-r border-slate-200 shrink-0 z-20 pt-6 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
                    <ModulSidebar 
                        moduleTitle={module.title}
                        steps={steps}
                        viewMode={viewMode}
                        currentStepIndex={currentStepIndex}
                        progress={{ pretest_score: 85, posttest_score: 90 }} 
                        isPreview={true} 
                        onNavigate={(mode, stepIdx) => {
                            if (mode === 'material' && stepIdx !== undefined) {
                                setViewMode('material'); setCurrentStepIndex(stepIdx);
                            } else {
                                setViewMode(mode as ViewMode);
                            }
                        }}
                    />
                </aside>

                {/* CONTENT AREA */}
                <div className="flex-1 flex flex-col h-full relative min-w-0 bg-[#FAFAF9]">
                    
                    {/* MOBILE HEADER */}
                    <header className="lg:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-30">
                        <span className="font-black text-slate-800 truncate max-w-[200px] flex items-center gap-2">
                            <MonitorPlay size={18} className="text-cyan-500"/> {module.title}
                        </span>
                        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                            <SheetTrigger asChild><Button variant="outline" size="icon" className="border-slate-200"><Menu className="text-slate-600"/></Button></SheetTrigger>
                            <SheetContent side="left" className="p-0 w-80 pt-10">
                                <ModulSidebar 
                                    moduleTitle={module.title} steps={steps} viewMode={viewMode}
                                    currentStepIndex={currentStepIndex} progress={{}} isPreview={true}
                                    onNavigate={(mode, idx) => {
                                        if(mode === 'material') { setViewMode('material'); setCurrentStepIndex(idx || 0); }
                                        else setViewMode(mode as ViewMode);
                                        setSidebarOpen(false);
                                    }} 
                                />
                            </SheetContent>
                        </Sheet>
                    </header>

                    {/* DYNAMIC CONTENT */}
                    <div className="flex-1 overflow-hidden relative flex flex-col">
                        {(viewMode === 'intro' || viewMode.includes('result')) && (
                            <IntroResultView 
                                type={viewMode as any} 
                                moduleData={module} 
                                score={viewMode === 'pre_result' ? 85 : 90} 
                                onAction={handleNext} 
                            />
                        )}

                        {/* TAMPILAN ALAT & BAHAN */}
                        {viewMode === 'tools' && (
                            <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center bg-[#FAFAF9]">
                                <div className="max-w-4xl w-full space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                                    <div className="text-center space-y-3 mb-10">
                                        <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-[2rem] flex items-center justify-center mx-auto mb-4 shadow-sm border-2 border-yellow-200">
                                            <Wrench size={40} />
                                        </div>
                                        <h1 className="text-4xl font-black text-slate-800 tracking-tight">Alat & Bahan</h1>
                                        <p className="text-lg text-slate-500 font-medium">Cek kelengkapan di bawah ini sebelum mulai.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {tools.map((tool: any, idx: number) => (
                                            <div 
                                                key={idx} 
                                                className="bg-white p-6 rounded-[2.5rem] border-2 border-slate-100 shadow-xl hover:shadow-2xl hover:border-yellow-400 hover:scale-[1.02] transition-all duration-300 flex flex-col items-center text-center gap-6 group"
                                            >
                                                <div className="w-full aspect-square max-w-[280px] bg-slate-50 rounded-[2rem] overflow-hidden border border-slate-100 flex items-center justify-center relative">
                                                    {tool.media_url ? (
                                                        <img 
                                                            src={tool.media_url} 
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                                            alt={tool.name} 
                                                        />
                                                    ) : (
                                                        <Wrench size={64} className="text-slate-300 opacity-50"/>
                                                    )}
                                                </div>
                                                <span className="text-2xl md:text-3xl font-black text-slate-700 group-hover:text-yellow-700 transition-colors leading-tight px-2">
                                                    {tool.name}
                                                </span>
                                            </div>
                                        ))}
                                        {tools.length === 0 && (
                                            <div className="col-span-full text-center py-20 text-slate-400 italic bg-white rounded-[3rem] border-4 border-dashed border-slate-200 text-xl font-bold">
                                                Belum ada data alat & bahan.
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="pt-8 pb-10">
                                        <Button 
                                            onClick={handleNext} 
                                            className="w-full h-20 text-2xl font-black bg-cyan-500 hover:bg-cyan-600 text-white rounded-[2rem] shadow-[0px_8px_0px_#22d3ee] active:translate-y-2 active:shadow-none transition-all flex items-center justify-center gap-4"
                                        >
                                            Sudah Siap, Lanjut! <Eye size={32}/>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {viewMode === 'material' && steps.length > 0 && (
                            <MaterialView 
                                stepData={steps[currentStepIndex]} 
                                currentIndex={currentStepIndex} 
                                totalSteps={steps.length} 
                                onSpeak={handleSpeak}
                            />
                        )}

                        {(viewMode === 'pre_test' || viewMode === 'post_test') && currentQ && (
                            <QuizView 
                                title={viewMode === 'pre_test' ? "Pre-Test (Preview)" : "Post-Test (Preview)"}
                                questionData={currentQ} 
                                currentIndex={quizIndex}
                                totalQuestions={viewMode === 'pre_test' ? preQuestions.length : postQuestions.length}
                                selectedAnswer={answers[currentQ?.id]}
                                onSelectAnswer={(idx) => {
                                    setAnswers({...answers, [currentQ.id]: idx});
                                    handleSpeak(currentQ.options[idx]?.text || "");
                                }}
                                onSpeak={handleSpeak}
                            />
                        )}
                        
                        {(viewMode === 'pre_test' || viewMode === 'post_test') && !currentQ && (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-4">
                                <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100 text-center">
                                    <p className="font-bold italic mb-4">Belum ada soal {viewMode.replace('_', ' ')}.</p>
                                    <Button variant="outline" onClick={() => setViewMode('intro')}>Kembali ke Depan</Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* FOOTER */}
                    <NavigationFooter 
                        showPrev={viewMode !== 'intro' && !viewMode.includes('result')}
                        showNext={!viewMode.includes('result')}
                        nextLabel={viewMode.includes('test') && ((viewMode === 'pre_test' ? quizIndex === preQuestions.length -1 : quizIndex === postQuestions.length -1)) ? "Simulasi Kirim" : "Selanjutnya"}
                        isNextDisabled={false} 
                        onPrev={handlePrev}
                        onNext={handleNext}
                    />
                </div>
            </div>
        </div>
    );
}