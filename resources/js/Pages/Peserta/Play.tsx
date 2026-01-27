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

export default function Play({ auth, module, progress }: any) {
    // --- 1. DATA PREPARATION (SAFETY CHECK) ---
    // Pastikan array tidak undefined agar tidak error .filter
    const allQuestions = module.questions || [];
    const preQuestions = allQuestions.filter((q:any) => q.type === 'pre_test');
    const postQuestions = allQuestions.filter((q:any) => q.type === 'post_test');

    // --- 2. STATE & INITIALIZATION ---
    // Logika Lazy State: Menentukan halaman awal saat refresh berdasarkan data database
    const [viewMode, setViewMode] = useState<ViewMode>(() => {
        // 1. Jika status completed atau sudah ada nilai post-test -> Halaman Akhir
        if (progress?.status === 'completed' || progress?.posttest_score != null) {
            return 'post_result';
        } 
        // 2. Jika baru saja selesai pre-test tapi belum materi -> Masuk Materi
        if (progress?.pretest_score != null) {
            return 'material';
        }
        // 3. Default -> Halaman Intro
        return 'intro';
    });

    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [quizIndex, setQuizIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    // --- 3. TTS & AUDIO HELPER ---
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
    // Stop audio saat pindah step
    useEffect(() => { return () => window.speechSynthesis.cancel(); }, [viewMode, currentStepIndex, quizIndex]);

    // --- 4. NAVIGASI UTAMA (LOGIC JANTUNG APLIKASI) ---
    const handleNext = () => {
        handleSpeak(""); // Matikan suara

        // A. DARI INTRO
        if (viewMode === 'intro') {
            if (preQuestions.length > 0 && progress?.pretest_score == null) {
                // Ada Pre-Test & Belum dikerjakan -> Masuk Pre-Test
                setViewMode('pre_test'); setQuizIndex(0); setAnswers({});
            } else {
                // Tidak ada Pre-Test / Sudah dikerjakan -> Masuk Materi
                setViewMode('material'); setCurrentStepIndex(0);
            }
        } 
        
        // B. SEDANG PRE-TEST
        else if (viewMode === 'pre_test') {
            if (quizIndex < preQuestions.length - 1) {
                setQuizIndex(p => p + 1);
            } else {
                submitQuiz('pre_test');
            }
        }

        // C. DARI HASIL PRE-TEST (Klik Lanjut Materi)
        else if (viewMode === 'pre_result') {
            setViewMode('material'); setCurrentStepIndex(0);
        }

        // D. SEDANG MATERI (PRAKTIKUM)
        else if (viewMode === 'material') {
            if (currentStepIndex < module.steps.length - 1) {
                // Masih ada halaman materi selanjutnya
                setCurrentStepIndex(p => p + 1);
            } else {
                // Materi Habis. Cek Post-Test.
                if (postQuestions.length > 0 && progress?.posttest_score == null) {
                    if (confirm("Praktikum selesai. Lanjut ke Post-Test?")) {
                        setViewMode('post_test'); 
                        setQuizIndex(0); 
                        setAnswers({});
                    }
                } else {
                    // Tidak ada post test / sudah selesai
                    toast.success("Seluruh modul selesai!");
                    router.visit('/peserta/dashboard');
                }
            }
        }

        // E. SEDANG POST-TEST
        else if (viewMode === 'post_test') {
            if (quizIndex < postQuestions.length - 1) {
                setQuizIndex(p => p + 1);
            } else {
                submitQuiz('post_test');
            }
        }

        // F. DARI HASIL POST-TEST (Selesai)
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
            if (currentStepIndex > 0) {
                setCurrentStepIndex(p => p - 1);
            } else {
                // Kalau mundur dari materi pertama, cek apakah sebelumnya ada pre-result
                const hasPre = preQuestions.length > 0;
                setViewMode(hasPre && progress?.pretest_score != null ? 'pre_result' : 'intro');
            }
        }
        else if (viewMode === 'post_test') {
            if (quizIndex > 0) setQuizIndex(p => p - 1);
            else { 
                // Mundur dari post-test kembali ke materi terakhir
                setViewMode('material'); 
                setCurrentStepIndex(module.steps.length - 1); 
            }
        }
    };

    // --- 5. SUBMIT QUIZ ---
    const submitQuiz = (type: 'pre_test' | 'post_test') => {
        router.post(`/api/workshop/${module.id}/quiz/submit`, { 
            type, answers 
        }, {
            preserveScroll: true,
            preserveState: true, // ✅ PENTING: Agar state React tidak reset
            onSuccess: (page) => {
                toast.success("Jawaban terkirim!");
                // Pindah ke halaman Result yang sesuai
                if (type === 'pre_test') {
                    setViewMode('pre_result');
                } else {
                    setViewMode('post_result');
                }
            },
            onError: () => toast.error("Gagal mengirim. Coba lagi.")
        });
    };

    // Helper: Ambil soal yang aktif
    const currentQ = viewMode === 'pre_test' ? preQuestions[quizIndex] : postQuestions[quizIndex];

    // --- 6. RENDER VIEW ---
    return (
        <div className="fixed inset-0 flex flex-col lg:flex-row bg-[#FAFAF9] overflow-hidden font-sans text-foreground selection:bg-orange-100">
            <Head title={`Belajar - ${module.title}`} />

            {/* SIDEBAR DESKTOP */}
            <aside className="hidden lg:block w-80 h-full bg-white border-r border-slate-200 shrink-0 z-20 pt-6 shadow-sm">
                <ModulSidebar 
                    moduleTitle={module.title}
                    steps={module.steps}
                    viewMode={viewMode}
                    currentStepIndex={currentStepIndex}
                    progress={progress}
                    isPreview={false}
                    onNavigate={(mode, stepIdx) => {
                        // Navigasi manual via Sidebar (Hanya boleh ke Intro atau Materi)
                        if (mode === 'material' && stepIdx !== undefined) {
                            setViewMode('material'); setCurrentStepIndex(stepIdx);
                        } else if (mode === 'intro') {
                            setViewMode('intro');
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
                        <SheetTrigger asChild><Button variant="outline" size="icon"><Menu className="text-slate-600"/></Button></SheetTrigger>
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

                {/* AREA KONTEN BERUBAH-UBAH */}
                <div className="flex-1 overflow-hidden relative flex flex-col">
                    
                    {/* TAMPILAN 1: INTRO & RESULT (PRE/POST) */}
                    {(viewMode === 'intro' || viewMode === 'pre_result' || viewMode === 'post_result') && (
                        <IntroResultView 
                            type={viewMode} 
                            moduleData={module} 
                            // Ambil skor terbaru dari props progress (yang diupdate via router.post)
                            score={viewMode === 'pre_result' ? progress?.pretest_score : progress?.posttest_score}
                            onAction={handleNext} 
                        />
                    )}

                    {/* TAMPILAN 2: MATERI PRAKTIKUM */}
                    {viewMode === 'material' && module.steps.length > 0 && (
                        <MaterialView 
                            stepData={module.steps[currentStepIndex]} 
                            currentIndex={currentStepIndex} 
                            totalSteps={module.steps.length} 
                            onSpeak={handleSpeak}
                        />
                    )}

                    {/* TAMPILAN 3: QUIZ (PRE/POST) */}
                    {(viewMode === 'pre_test' || viewMode === 'post_test') && currentQ && (
                        <QuizView 
                            title={viewMode === 'pre_test' ? "Pre-Test" : "Post-Test"}
                            questionData={currentQ}
                            currentIndex={quizIndex}
                            totalQuestions={viewMode === 'pre_test' ? preQuestions.length : postQuestions.length}
                            selectedAnswer={answers[currentQ.id]}
                            onSelectAnswer={(idx) => {
                                setAnswers({...answers, [currentQ.id]: idx});
                                if(currentQ.options[idx]?.text) handleSpeak(currentQ.options[idx].text);
                            }}
                            onSpeak={handleSpeak}
                        />
                    )}
                </div>

                {/* FOOTER NAVIGASI */}
                <NavigationFooter 
                    showPrev={viewMode !== 'intro' && !viewMode.includes('result')}
                    showNext={!viewMode.includes('result')}
                    // Ubah label tombol Next
                    nextLabel={
                        (viewMode === 'pre_test' && quizIndex === preQuestions.length - 1) || 
                        (viewMode === 'post_test' && quizIndex === postQuestions.length - 1) 
                        ? "Kirim Jawaban" : "Selanjutnya"
                    }
                    // Disable Next jika soal belum dijawab
                    isNextDisabled={(viewMode === 'pre_test' || viewMode === 'post_test') && answers[currentQ?.id] === undefined}
                    onPrev={handlePrev}
                    onNext={handleNext}
                />
            </div>
        </div>
    );
}