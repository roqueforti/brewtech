import { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import { Menu, BookOpen } from "lucide-react";
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

export default function StudentPlay({ auth, module, progress }: any) {
    // --- 1. STATE & INIT ---
    const [viewMode, setViewMode] = useState<ViewMode>('intro');
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [quizIndex, setQuizIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    useEffect(() => {
        if (progress?.status === 'completed' || progress?.posttest_score != null) {
            setViewMode('post_result');
        } else if (progress?.pretest_score != null) {
            setViewMode('material');
        } else {
            setViewMode('intro');
        }
    }, [progress]);

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

    // --- 3. NAVIGASI ---
    const handleNext = () => {
        handleSpeak(""); 

        if (viewMode === 'intro') {
            if (module.questions.filter((q:any) => q.type === 'pre_test').length > 0 && progress?.pretest_score == null) {
                setViewMode('pre_test'); setQuizIndex(0); setAnswers({});
            } else {
                setViewMode('material'); setCurrentStepIndex(0);
            }
        } 
        else if (viewMode === 'pre_test') {
            const preQuestions = module.questions.filter((q:any) => q.type === 'pre_test');
            if (quizIndex < preQuestions.length - 1) setQuizIndex(p => p + 1);
            else submitQuiz('pre_test');
        }
        else if (viewMode === 'pre_result') {
            setViewMode('material'); setCurrentStepIndex(0);
        }
        else if (viewMode === 'material') {
            if (currentStepIndex < module.steps.length - 1) setCurrentStepIndex(p => p + 1);
            else {
                const postQuestions = module.questions.filter((q:any) => q.type === 'post_test');
                if (postQuestions.length > 0 && progress?.posttest_score == null) {
                    if (confirm("Materi selesai. Siap mengerjakan Post-Test?")) {
                        setViewMode('post_test'); setQuizIndex(0); setAnswers({});
                    }
                } else {
                    router.visit('/peserta/dashboard');
                }
            }
        }
        else if (viewMode === 'post_test') {
            const postQuestions = module.questions.filter((q:any) => q.type === 'post_test');
            if (quizIndex < postQuestions.length - 1) setQuizIndex(p => p + 1);
            else submitQuiz('post_test');
        }
        else if (viewMode === 'post_result') {
            router.visit('/peserta/dashboard');
        }
    };

    const handlePrev = () => {
        handleSpeak("");
        if (viewMode === 'pre_test') {
            if (quizIndex > 0) setQuizIndex(p => p - 1); else setViewMode('intro');
        }
        else if (viewMode === 'material') {
            if (currentStepIndex > 0) setCurrentStepIndex(p => p - 1);
            else {
                 const hasPre = module.questions.some((q:any) => q.type === 'pre_test');
                 setViewMode(hasPre ? 'pre_result' : 'intro');
            }
        }
        else if (viewMode === 'post_test') {
            if (quizIndex > 0) setQuizIndex(p => p - 1);
            else { setViewMode('material'); setCurrentStepIndex(module.steps.length - 1); }
        }
    };

    const submitQuiz = (type: 'pre_test' | 'post_test') => {
        router.post(`/api/workshop/${module.id}/quiz/submit`, { 
            type, answers 
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Jawaban terkirim!");
                setViewMode(type === 'pre_test' ? 'pre_result' : 'post_result');
            },
            onError: () => toast.error("Gagal mengirim jawaban.")
        });
    };

    const preQuestions = module.questions.filter((q:any) => q.type === 'pre_test');
    const postQuestions = module.questions.filter((q:any) => q.type === 'post_test');
    const currentQ = viewMode === 'pre_test' ? preQuestions[quizIndex] : postQuestions[quizIndex];

    return (
        <div className="fixed inset-0 flex flex-col lg:flex-row bg-[#FAFAF9] overflow-hidden font-sans text-foreground selection:bg-orange-100">
            <Head title={`Belajar - ${module.title}`} />

            {/* SIDEBAR DESKTOP */}
            <aside className="hidden lg:block w-80 h-full bg-white border-r border-slate-200 shrink-0 z-20 pt-6 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
                <ModulSidebar 
                    moduleTitle={module.title}
                    steps={module.steps}
                    viewMode={viewMode}
                    currentStepIndex={currentStepIndex}
                    progress={progress}
                    isPreview={false}
                    onNavigate={(mode, stepIdx) => {
                        if (mode === 'material' && stepIdx !== undefined) {
                            setViewMode('material'); setCurrentStepIndex(stepIdx);
                        }
                    }}
                />
            </aside>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col h-full relative min-w-0 overflow-hidden">
                
                {/* HEADER MOBILE */}
                <header className="lg:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-30">
                    <span className="font-black text-slate-800 truncate max-w-[200px] flex items-center gap-2">
                        <BookOpen size={18} className="text-orange-500"/> {module.title}
                    </span>
                    <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                        <SheetTrigger asChild><Button variant="outline" size="icon" className="border-slate-200"><Menu className="text-slate-600"/></Button></SheetTrigger>
                        <SheetContent side="left" className="p-0 w-80 pt-10">
                            <ModulSidebar 
                                moduleTitle={module.title} steps={module.steps} viewMode={viewMode}
                                currentStepIndex={currentStepIndex} progress={progress} isPreview={false}
                                onNavigate={(mode, idx) => {
                                    if(mode === 'material') { setViewMode('material'); setCurrentStepIndex(idx || 0); }
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
                            score={viewMode === 'pre_result' ? progress?.pretest_score : progress?.posttest_score}
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
                            title={viewMode === 'pre_test' ? "Pre-Test" : "Post-Test"}
                            questionData={currentQ}
                            currentIndex={quizIndex}
                            totalQuestions={viewMode === 'pre_test' ? preQuestions.length : postQuestions.length}
                            selectedAnswer={answers[currentQ.id]}
                            onSelectAnswer={(idx) => setAnswers({...answers, [currentQ.id]: idx})}
                            onSpeak={handleSpeak}
                        />
                    )}
                </div>

                {/* FOOTER */}
                <NavigationFooter 
                    showPrev={viewMode !== 'intro' && !viewMode.includes('result')}
                    showNext={!viewMode.includes('result')}
                    nextLabel={viewMode.includes('test') && ((viewMode === 'pre_test' ? quizIndex === preQuestions.length -1 : quizIndex === postQuestions.length -1)) ? "Kirim Jawaban" : "Selanjutnya"}
                    isNextDisabled={viewMode.includes('test') && answers[currentQ?.id] === undefined}
                    onPrev={handlePrev}
                    onNext={handleNext}
                />
            </div>
        </div>
    );
}