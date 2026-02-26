import { useState, useEffect, useRef } from "react";
import { Head, router } from "@inertiajs/react";
import { Menu, BookOpen, Wrench, Eye, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/Components/ui/sheet";
import { toast } from "sonner";

// Import Komponen UI Modular
import ModulSidebar from "@/Components/Workshop/ModulSidebar"; 
import IntroResultView from "@/Components/Workshop/IntroResultView"; 
import QuizView from "@/Components/Workshop/QuizCard"; 
import MaterialView from "@/Components/Workshop/MaterialView"; 
import NavigationFooter from "@/Components/Workshop/NavigationFooter"; 

type ViewMode = 'intro' | 'pre_test' | 'pre_result' | 'tools' | 'material' | 'post_test' | 'post_result';

export default function Play({ auth, module, progress }: any) {
    
    // --- 1. DATA PREPARATION ---
    const steps = module.steps || []; 
    const tools = module.tools || []; 
    const preQuestions = module.pre_test_questions || []; 
    const postQuestions = module.post_test_questions || [];

    const hasHistoryPre = progress?.history?.pre_test && Object.keys(progress.history.pre_test).length > 0;
    const hasHistoryPost = progress?.history?.post_test && Object.keys(progress.history.post_test).length > 0;

    // --- 2. STATE ---
    const [viewMode, setViewMode] = useState<ViewMode>(() => {
        if (progress?.status === 'completed' || hasHistoryPost) return 'post_result';
        if (hasHistoryPre) return tools.length > 0 ? 'tools' : 'material';
        return 'intro';
    });

    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [quizIndex, setQuizIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    // State Audio
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [autoPlayEnabled, setAutoPlayEnabled] = useState(true); // Toggle fitur auto-play

    // --- 3. HELPER: SMART TTS (AUTO QUEUE) ---
    const speakUtterance = (text: string, lang = 'id-ID') => {
        if (!text) return;
        const u = new SpeechSynthesisUtterance(text);
        u.lang = lang;
        u.rate = 0.9; // Sedikit lebih cepat agar tidak membosankan
        u.onstart = () => setIsSpeaking(true);
        u.onend = () => { /* Nanti bisa handle logic selesai per kalimat */ };
        window.speechSynthesis.speak(u);
    };

    // Fungsi membaca Soal + Semua Opsi berurutan
    const playQuestionSequence = (q: any) => {
        if (!autoPlayEnabled || !q || !('speechSynthesis' in window)) return;

        window.speechSynthesis.cancel(); // Stop suara sebelumnya

        // 1. Baca Soal
        speakUtterance(`Pertanyaan. ${q.question}`);

        // 2. Baca Opsi A-D (Browser otomatis mengantrekan ini)
        (q.options || []).forEach((opt: any, idx: number) => {
            const label = String.fromCharCode(65 + idx); // A, B, C, D...
            if (opt.text) {
                // Beri jeda sedikit dengan titik
                speakUtterance(`Pilihan ${label}. ${opt.text}`); 
            }
        });
        
        // Callback global saat semua antrean habis (opsional, browser handle sendiri)
    };

    // Fungsi manual (saat klik jawaban/tombol) - Stop antrean, baca yang diklik aja
    const handleManualSpeak = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Hentikan auto-play
            if (text) speakUtterance(text);
            else setIsSpeaking(false);
        }
    };

    // --- 4. EFFECT: AUTO PLAY SAAT SOAL GANTI ---
    const currentQ = viewMode === 'pre_test' ? preQuestions[quizIndex] : (viewMode === 'post_test' ? postQuestions[quizIndex] : null);

    useEffect(() => {
        // Matikan suara jika pindah ke mode non-kuis
        if (!currentQ) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }

        // Jalankan Auto Play Sequence
        playQuestionSequence(currentQ);

        // Cleanup saat unmount/ganti soal
        return () => window.speechSynthesis.cancel();
    }, [currentQ, quizIndex, viewMode]); // Trigger setiap index/soal berubah

    // --- 5. NAVIGASI UTAMA ---
    const handleNext = () => {
        window.speechSynthesis.cancel(); // Stop suara saat pindah

        if (viewMode === 'intro') {
            if (preQuestions.length > 0 && !hasHistoryPre) {
                setViewMode('pre_test'); setQuizIndex(0); setAnswers({});
            } else if (tools.length > 0) {
                setViewMode('tools');
            } else {
                setViewMode('material'); setCurrentStepIndex(0);
            }
        } 
        else if (viewMode === 'pre_test') {
            if (quizIndex < preQuestions.length - 1) setQuizIndex(p => p + 1);
            else submitQuiz('pre_test');
        }
        else if (viewMode === 'pre_result') {
            if (tools.length > 0) setViewMode('tools');
            else { setViewMode('material'); setCurrentStepIndex(0); }
        }
        else if (viewMode === 'tools') {
            setViewMode('material'); setCurrentStepIndex(0);
        }
        else if (viewMode === 'material') {
            if (currentStepIndex < steps.length - 1) {
                setCurrentStepIndex(p => p + 1);
            } else {
                if (postQuestions.length > 0 && !hasHistoryPost) {
                    if (confirm("Lanjut ke Post-Test?")) {
                        setViewMode('post_test'); setQuizIndex(0); setAnswers({});
                    }
                } else {
                    toast.success("Selesai!");
                    router.visit('/peserta/dashboard');
                }
            }
        }
        else if (viewMode === 'post_test') {
            if (quizIndex < postQuestions.length - 1) setQuizIndex(p => p + 1);
            else submitQuiz('post_test');
        }
        else if (viewMode === 'post_result') {
            router.visit('/peserta/dashboard');
        }
    };

    const handlePrev = () => {
        window.speechSynthesis.cancel(); // Stop suara
        
        if (viewMode === 'pre_test') {
            if (quizIndex > 0) setQuizIndex(p => p - 1); 
            else setViewMode('intro');
        }
        else if (viewMode === 'tools') {
            if (hasHistoryPre) setViewMode('pre_result'); 
            else setViewMode('intro');
        }
        else if (viewMode === 'material') {
            if (currentStepIndex > 0) {
                setCurrentStepIndex(p => p - 1);
            } else {
                if (tools.length > 0) setViewMode('tools');
                else if (hasHistoryPre) setViewMode('pre_result');
                else setViewMode('intro');
            }
        }
        else if (viewMode === 'post_test') {
            if (quizIndex > 0) setQuizIndex(p => p - 1);
            else { 
                setViewMode('material'); setCurrentStepIndex(steps.length - 1); 
            }
        }
    };

    const handleSidebarNavigate = (mode: any, stepIdx?: number) => {
        window.speechSynthesis.cancel(); // Stop suara jika navigasi manual
        if (mode === 'intro') {
            setViewMode('intro'); setSidebarOpen(false); return;
        }
        const isPreTestDone = hasHistoryPre || preQuestions.length === 0;
        if (!isPreTestDone) { toast.error("Kerjakan Pre-Test dulu ya!"); return; }

        if (mode === 'tools') setViewMode('tools');
        else if (mode === 'material') {
            setViewMode('material');
            if (stepIdx !== undefined) setCurrentStepIndex(stepIdx);
        }
        setSidebarOpen(false);
    };

    const submitQuiz = (type: 'pre_test' | 'post_test') => {
        const loadingToast = toast.loading("Mengirim jawaban...");
        window.speechSynthesis.cancel();

        router.post(`/api/workshop/${module.id}/quiz/submit`, { type, answers }, {
            preserveScroll: true,
            preserveState: true, 
            onSuccess: () => {
                toast.dismiss(loadingToast);
                toast.success("Jawaban tersimpan!");
                if (type === 'pre_test') setViewMode('pre_result');
                else setViewMode('post_result');
            },
            onError: () => {
                toast.dismiss(loadingToast);
                toast.error("Gagal mengirim.");
            }
        });
    };

    // --- 6. RENDER VIEW ---
    return (
        <div className="fixed inset-0 flex flex-col lg:flex-row bg-[#FAFAF9] overflow-hidden font-sans text-foreground">
            <Head title={`Belajar - ${module.title}`} />

            {/* SIDEBAR */}
            <aside className="hidden lg:block w-80 h-full bg-white border-r border-slate-200 shrink-0 z-20 pt-0 shadow-sm">
                <ModulSidebar 
                    moduleTitle={module.title}
                    steps={steps}
                    viewMode={viewMode}
                    currentStepIndex={currentStepIndex}
                    progress={progress}
                    tools={tools} 
                    isPreview={false}
                    onNavigate={handleSidebarNavigate}
                />
            </aside>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col h-full relative min-w-0 overflow-hidden">
                
                {/* HEADER MOBILE & TOGGLE AUDIO */}
                <header className="h-16 bg-white border-b flex items-center justify-between px-6 shrink-0 z-30">
                    <div className="flex items-center gap-2 lg:hidden">
                        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                            <SheetTrigger asChild><Button variant="outline" size="icon"><Menu/></Button></SheetTrigger>
                            <SheetContent side="left" className="p-0 w-80 pt-0">
                                <ModulSidebar 
                                    moduleTitle={module.title} steps={steps} viewMode={viewMode}
                                    currentStepIndex={currentStepIndex} progress={progress} 
                                    tools={tools} isPreview={false} onNavigate={handleSidebarNavigate}
                                />
                            </SheetContent>
                        </Sheet>
                        <span className="font-black text-slate-800 truncate max-w-[150px]">{module.title}</span>
                    </div>

                    {/* Tombol Kontrol Audio di Header */}
                    <div className="flex items-center gap-2 ml-auto">
                        {(viewMode === 'pre_test' || viewMode === 'post_test') && (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => {
                                    if (autoPlayEnabled) window.speechSynthesis.cancel(); // Stop langsung jika dimatikan
                                    setAutoPlayEnabled(!autoPlayEnabled);
                                    toast.info(autoPlayEnabled ? "Auto-baca dimatikan" : "Auto-baca diaktifkan");
                                }}
                                className={`rounded-full px-3 ${autoPlayEnabled ? 'bg-cyan-50 text-cyan-600' : 'text-slate-400'}`}
                            >
                                {autoPlayEnabled ? <Volume2 size={18} className="mr-2"/> : <VolumeX size={18} className="mr-2"/>}
                                <span className="text-xs font-bold hidden sm:inline">{autoPlayEnabled ? 'Auto Baca: ON' : 'Auto Baca: OFF'}</span>
                            </Button>
                        )}
                        <div className="hidden lg:flex items-center gap-2 font-black text-slate-800">
                            <BookOpen size={18} className="text-orange-500"/> {module.title}
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-hidden relative flex flex-col">
                    {(viewMode === 'intro' || viewMode === 'pre_result' || viewMode === 'post_result') && (
                        <IntroResultView 
                            type={viewMode} moduleData={module} 
                            score={viewMode === 'pre_result' ? progress?.pretest_score : progress?.posttest_score}
                            onAction={handleNext} 
                        />
                    )}

                    {viewMode === 'tools' && (
                        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center bg-[#FAFAF9] animate-in fade-in duration-500">
                            <div className="max-w-4xl w-full text-center space-y-8 pb-20">
                                <div className="space-y-4 pt-10">
                                    <div className="inline-flex p-5 bg-yellow-100 rounded-[2.5rem] mb-2 text-yellow-600 shadow-sm border-2 border-yellow-200">
                                        <Wrench size={48} />
                                    </div>
                                    <h1 className="text-4xl font-black text-slate-800 tracking-tight">Alat & Bahan</h1>
                                    <p className="text-lg text-slate-500 font-medium">Pastikan semua perlengkapan ini siap sebelum praktik.</p>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {tools.map((tool: any, idx: number) => (
                                        <div key={idx} className="bg-white p-5 rounded-[2rem] border-2 border-slate-100 hover:border-yellow-300 hover:shadow-xl transition-all group flex flex-col items-center">
                                            <div className="w-full aspect-square bg-slate-50 rounded-[1.5rem] mb-4 flex items-center justify-center overflow-hidden border border-slate-50 relative">
                                                {tool.media_url ? <img src={tool.media_url} className="w-full h-full object-cover"/> : <Wrench size={40} className="text-slate-300 opacity-50"/>}
                                            </div>
                                            <p className="font-bold text-slate-700 text-lg">{tool.name}</p>
                                        </div>
                                    ))}
                                    {tools.length === 0 && <div className="col-span-full py-10 text-slate-400 font-bold italic">Tidak ada data alat.</div>}
                                </div>
                                <div className="pt-8"><Button onClick={handleNext} className="h-16 px-10 text-xl rounded-2xl font-black bg-cyan-500 hover:bg-cyan-600 shadow-lg shadow-cyan-200">Mulai Praktik <Eye className="ml-2" /></Button></div>
                            </div>
                        </div>
                    )}

                    {viewMode === 'material' && steps.length > 0 && (
                        <MaterialView 
                            stepData={steps[currentStepIndex]} currentIndex={currentStepIndex} totalSteps={steps.length} 
                            onSpeak={handleManualSpeak} // Materi tetap manual klik
                        />
                    )}

                    {(viewMode === 'pre_test' || viewMode === 'post_test') && currentQ && (
                        <QuizView 
                            title={viewMode === 'pre_test' ? "Pre-Test" : "Post-Test"}
                            questionData={currentQ}
                            currentIndex={quizIndex}
                            totalQuestions={viewMode === 'pre_test' ? preQuestions.length : postQuestions.length}
                            selectedAnswer={answers[currentQ.id]}
                            onSelectAnswer={(idx: number) => {
                                setAnswers({...answers, [currentQ.id]: idx});
                                // Jika user klik jawaban, stop auto play, baca jawaban yang dipilih saja
                                if(currentQ.options[idx]?.text) handleManualSpeak(currentQ.options[idx].text);
                            }}
                            onSpeak={handleManualSpeak} // Tombol speaker manual di soal
                        />
                    )}
                </div>

                <NavigationFooter 
                    showPrev={viewMode !== 'intro' && !viewMode.includes('result')}
                    showNext={!viewMode.includes('result')}
                    nextLabel={(viewMode.includes('test')) ? "Kirim Jawaban" : (viewMode === 'tools' ? "Mulai Praktik" : "Selanjutnya")}
                    isNextDisabled={(viewMode.includes('test') && answers[currentQ?.id] === undefined)}
                    onPrev={handlePrev}
                    onNext={handleNext}
                />
            </div>
        </div>
    );
}