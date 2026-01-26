import { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react"; // ✅ Import router
import { Eye, Menu, MonitorPlay, XCircle } from "lucide-react"; 
import { Button } from "@/Components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/Components/ui/sheet";
import { toast } from "sonner";

// Import Komponen UI Modular
import ModulSidebar from "@/Components/Workshop/ModulSidebar";
import IntroResultView from "@/Components/Workshop/IntroResultView";
import QuizView from "@/Components/Workshop/QuizCard";
import MaterialView from "@/Components/Workshop/MaterialView";
import NavigationFooter from "@/Components/Workshop/NavigationFooter";

type ViewMode = 'intro' | 'pre_test' | 'pre_result' | 'material' | 'post_test' | 'post_result';

export default function TeacherPreview({ module }: any) {
    // --- 1. STATE ---
    const [viewMode, setViewMode] = useState<ViewMode>('intro');
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [quizIndex, setQuizIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    // --- 2. LOGIKA TTS ---
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
    useEffect(() => { return () => window.speechSynthesis.cancel(); }, [viewMode, currentStepIndex, quizIndex]);

    // --- 3. NAVIGASI (LOOSE FLOW) ---
    const handleNext = () => {
        handleSpeak("");
        
        if (viewMode === 'intro') {
            const hasPre = module.questions.some((q:any) => q.type === 'pre_test');
            if (hasPre) { setViewMode('pre_test'); setQuizIndex(0); setAnswers({}); }
            else { setViewMode('material'); setCurrentStepIndex(0); }
        }
        else if (viewMode === 'pre_test') {
            const preQuestions = module.questions.filter((q:any) => q.type === 'pre_test');
            if (quizIndex < preQuestions.length - 1) setQuizIndex(p => p + 1);
            else submitQuizMock('pre_test');
        }
        else if (viewMode === 'pre_result') {
            setViewMode('material'); setCurrentStepIndex(0);
        }
        else if (viewMode === 'material') {
            if (currentStepIndex < module.steps.length - 1) setCurrentStepIndex(p => p + 1);
            else {
                const hasPost = module.questions.some((q:any) => q.type === 'post_test');
                if (hasPost) { 
                    toast.info("[Preview] Materi selesai. Masuk Post-Test.");
                    setViewMode('post_test'); setQuizIndex(0); setAnswers({});
                } else {
                    toast.success("[Preview] Modul Selesai!");
                    setViewMode('intro'); 
                }
            }
        }
        else if (viewMode === 'post_test') {
            const postQuestions = module.questions.filter((q:any) => q.type === 'post_test');
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
        } else if (viewMode === 'material') {
            if (currentStepIndex > 0) setCurrentStepIndex(p => p - 1);
            else setViewMode('pre_result'); 
        } else if (viewMode === 'post_test') {
            if (quizIndex > 0) setQuizIndex(p => p - 1);
            else { setViewMode('material'); setCurrentStepIndex(module.steps.length - 1); }
        }
    };

    const submitQuizMock = (type: string) => {
        toast.info(`[PREVIEW MODE] Jawaban ${type} tersimpan lokal. Skor simulasi: 85.`);
        if (type === 'pre_test') setViewMode('pre_result');
        else setViewMode('post_result');
    };

    const preQuestions = module.questions.filter((q:any) => q.type === 'pre_test');
    const postQuestions = module.questions.filter((q:any) => q.type === 'post_test');
    const currentQ = viewMode === 'pre_test' ? preQuestions[quizIndex] : postQuestions[quizIndex];

    return (
        <div className="fixed inset-0 flex flex-col bg-[#FAFAF9] font-sans text-foreground selection:bg-orange-100">
            <Head title={`[PREVIEW] ${module.title}`} />

            {/* --- ADMIN TOOLBAR (THEMED) --- */}
            <div className="h-14 bg-slate-900 text-white flex items-center justify-between px-6 shadow-md z-50 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="bg-orange-500 p-1.5 rounded-lg">
                        <Eye size={18} className="text-white animate-pulse"/>
                    </div>
                    <span className="font-bold text-sm tracking-wide">MODE PREVIEW INSTRUKTUR</span>
                </div>

                <div className="hidden md:flex items-center bg-slate-800 rounded-lg p-1 gap-1">
                    {['intro','pre_test','pre_result','material','post_test','post_result'].map((m) => (
                        <button key={m} onClick={() => setViewMode(m as ViewMode)} 
                            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${viewMode === m ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}>
                            {m.replace('_', ' ').toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* ✅ UPDATE: Ganti window.close() dengan router.visit() */}
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-slate-300 hover:text-white hover:bg-red-500/20 gap-2" 
                    onClick={() => router.visit('/pengajar/modul')}
                >
                    <XCircle size={18} /> Tutup Preview
                </Button>
            </div>

            {/* --- MAIN LAYOUT --- */}
            <div className="flex flex-1 overflow-hidden relative">
                
                {/* SIDEBAR */}
                <aside className="hidden lg:block w-80 h-full bg-white border-r border-slate-200 shrink-0 z-20 pt-6 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
                    <ModulSidebar 
                        moduleTitle={module.title}
                        steps={module.steps}
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
                            <MonitorPlay size={18} className="text-orange-500"/> {module.title}
                        </span>
                        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                            <SheetTrigger asChild><Button variant="outline" size="icon" className="border-slate-200"><Menu className="text-slate-600"/></Button></SheetTrigger>
                            <SheetContent side="left" className="p-0 w-80 pt-10">
                                <ModulSidebar 
                                    moduleTitle={module.title} steps={module.steps} viewMode={viewMode}
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

                        {viewMode === 'material' && (
                            <MaterialView 
                                stepData={module.steps[currentStepIndex]} 
                                currentIndex={currentStepIndex} 
                                totalSteps={module.steps.length} 
                                onSpeak={handleSpeak}
                            />
                        )}

                        {(viewMode === 'pre_test' || viewMode === 'post_test') && (
                            <QuizView 
                                title={viewMode === 'pre_test' ? "Pre-Test (Preview)" : "Post-Test (Preview)"}
                                questionData={currentQ}
                                currentIndex={quizIndex}
                                totalQuestions={viewMode === 'pre_test' ? preQuestions.length : postQuestions.length}
                                selectedAnswer={answers[currentQ?.id]}
                                onSelectAnswer={(idx) => setAnswers({...answers, [currentQ.id]: idx})}
                                onSpeak={handleSpeak}
                            />
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