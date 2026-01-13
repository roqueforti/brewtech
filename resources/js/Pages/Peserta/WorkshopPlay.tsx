import { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import { 
    ArrowLeft, ArrowRight, CheckCircle, Play, 
    BookOpen, HelpCircle, XCircle, Volume2, StopCircle 
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { Progress } from "@/Components/ui/progress"; 
import { Badge } from "@/Components/ui/badge";

// --- TYPES ---
interface Step { 
    title: string; 
    description: string; 
    media_url?: string; 
    media_type?: 'image'|'video'; 
}

interface Question { 
    type: 'pre_test'|'post_test'; 
    question: string; 
    options: string[]; 
    correct_answer: string; 
    media_url?: string; 
    media_type?: 'image'|'video'; 
    options_media?: { url: string; type: 'image'|'video' }[];
}

interface Module { 
    title: string; 
    steps: Step[]; 
    questions: Question[]; 
    category: string; 
    duration: string; 
}

export default function WorkshopPlay({ module, isPreview = false }: { module: Module, isPreview?: boolean }) {
    const [phase, setPhase] = useState<'intro' | 'pre_test' | 'learning' | 'post_test' | 'finish'>('intro');
    const [currentStepIdx, setCurrentStepIdx] = useState(0);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const preTestQuestions = module.questions.filter(q => q.type === 'pre_test');
    const postTestQuestions = module.questions.filter(q => q.type === 'post_test');

    // --- TEXT TO SPEECH ---
    const speakText = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'id-ID'; 
            utterance.rate = 0.9; 
            utterance.onend = () => setIsSpeaking(false);
            setIsSpeaking(true);
            window.speechSynthesis.speak(utterance);
        }
    };

    const stopSpeak = () => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    };

    useEffect(() => {
        return () => window.speechSynthesis.cancel();
    }, [phase, currentQuestionIdx, currentStepIdx]);

    // --- LOGIC ---
    const startModule = () => {
        if (preTestQuestions.length > 0) setPhase('pre_test');
        else if (module.steps.length > 0) setPhase('learning');
        else setPhase('finish');
    };

    const handleAnswerClick = (idx: number, text: string) => {
        setSelectedAnswer(idx);
        const label = ['A', 'B', 'C', 'D'][idx];
        speakText(`Pilihan ${label}. ${text}`);
    };

    const handleAnswerSubmit = (isPostTest: boolean) => {
        stopSpeak();
        const list = isPostTest ? postTestQuestions : preTestQuestions;
        
        if (currentQuestionIdx < list.length - 1) {
            setCurrentQuestionIdx(currentQuestionIdx + 1);
            setSelectedAnswer(null);
        } else {
            setCurrentQuestionIdx(0); 
            setSelectedAnswer(null);
            if (!isPostTest) setPhase('learning'); 
            else setPhase('finish'); 
        }
    };

    const nextStep = () => {
        stopSpeak();
        if (currentStepIdx < module.steps.length - 1) {
            setCurrentStepIdx(currentStepIdx + 1);
        } else {
            if (postTestQuestions.length > 0) setPhase('post_test');
            else setPhase('finish');
        }
    };

    const prevStep = () => {
        stopSpeak();
        if (currentStepIdx > 0) setCurrentStepIdx(currentStepIdx - 1);
    };

    const renderMedia = (url?: string, type?: 'image'|'video', className?: string) => {
        if (!url) return null;
        return (
            <div className={`w-full bg-black rounded-xl overflow-hidden shadow-sm border border-slate-200 ${className}`}>
                {type === 'video' ? (
                    <video src={url} controls className="w-full h-full object-contain max-h-[400px]" />
                ) : (
                    <img src={url} alt="Visual Materi" className="w-full h-full object-contain max-h-[400px] bg-gray-50" />
                )}
            </div>
        );
    };

    // 1. INTRO
    if (phase === 'intro') return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <Card className="max-w-2xl w-full p-8 rounded-3xl text-center border shadow-lg bg-white">
                {isPreview && <Badge className="mb-6 bg-yellow-400 text-yellow-900 hover:bg-yellow-400">Mode Preview</Badge>}
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                    <BookOpen size={40} />
                </div>
                <h1 className="text-3xl font-black text-gray-900 mb-4">{module.title}</h1>
                <p className="text-gray-500 font-medium mb-10 text-lg">
                    {module.steps.length} Langkah • {module.questions.length} Soal
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={startModule} className="h-12 px-8 text-lg rounded-xl font-bold bg-primary hover:bg-primary/90 shadow-lg">
                        Mulai Belajar <Play className="ml-2 fill-current" />
                    </Button>
                    {isPreview && (
                        <Button variant="outline" asChild className="h-12 px-8 text-lg rounded-xl font-bold border-2">
                            <a href={`/pengajar/modul/${(module as any).id}/edit`}>Kembali ke Edit</a>
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    );

    // 2. QUIZ (RESPONSIVE FIX)
    if (phase === 'pre_test' || phase === 'post_test') {
        const questions = phase === 'pre_test' ? preTestQuestions : postTestQuestions;
        const currentQ = questions[currentQuestionIdx];
        const progress = ((currentQuestionIdx + 1) / questions.length) * 100;

        return (
            <div className="h-screen flex flex-col bg-slate-50">
                {/* Header Compact */}
                <div className="h-14 bg-white border-b flex items-center px-6 justify-between shrink-0 z-20 shadow-sm">
                    <div className="flex items-center gap-4">
                        <Badge variant="outline" className="font-bold bg-slate-100 text-slate-600">
                            {phase === 'pre_test' ? 'PRE-TEST' : 'POST-TEST'}
                        </Badge>
                        <span className="font-bold text-slate-500 text-sm">Soal {currentQuestionIdx + 1}/{questions.length}</span>
                    </div>
                    <div className="w-24 md:w-48">
                        <Progress value={progress} className="h-2 rounded-full" />
                    </div>
                </div>

                {/* Main Content Wrapper */}
                {/* Mobile: overflow-y-auto (satu scrollbar besar). Desktop: flex-row, overflow-hidden (split screen) */}
                <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
                    
                    {/* KIRI: Soal & Media */}
                    <div className="w-full lg:flex-1 lg:h-full lg:overflow-y-auto p-6 lg:p-8 bg-white/50">
                        <div className="max-w-3xl mx-auto h-full flex flex-col lg:justify-center">
                            {/* Media Soal */}
                            {currentQ.media_url && (
                                <div className="mb-6 flex justify-center">
                                    {renderMedia(currentQ.media_url, currentQ.media_type, "max-w-2xl")}
                                </div>
                            )}
                            
                            {/* Teks Soal */}
                            <div className="flex items-start gap-4 mb-6 lg:mb-0">
                                <h2 className="text-xl md:text-2xl font-bold text-gray-800 leading-relaxed flex-1">
                                    {currentQ.question}
                                </h2>
                                <Button 
                                    variant="ghost" size="icon" 
                                    onClick={() => isSpeaking ? stopSpeak() : speakText(currentQ.question)}
                                    className="rounded-full shrink-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                >
                                    {isSpeaking ? <StopCircle size={24} className="text-destructive animate-pulse" /> : <Volume2 size={24} />}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* KANAN: Pilihan Jawaban */}
                    {/* Desktop: Fixed width sidebar. Mobile: Full width below question. */}
                    <div className="w-full lg:w-[500px] xl:w-[600px] lg:h-full bg-white border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col shrink-0 shadow-xl z-10">
                        
                        {/* Container Opsi */}
                        <div className="flex-1 p-4 lg:p-6 lg:overflow-y-auto flex flex-col">
                            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 hidden lg:block shrink-0">Pilih Jawaban:</h3>
                            
                            {/* Grid Layout */}
                            {/* Desktop (lg): h-full agar stretch. Mobile: h-auto agar menumpuk natural */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:flex-1 lg:min-h-0 lg:content-stretch">
                                {currentQ.options.map((opt, idx) => {
                                    const hasImage = currentQ.options_media && currentQ.options_media[idx];
                                    return (
                                        <button 
                                            key={idx} 
                                            onClick={() => handleAnswerClick(idx, opt)}
                                            className={`
                                                relative w-full rounded-2xl border-2 text-left transition-all active:scale-[0.98] group flex flex-col overflow-hidden
                                                /* MOBILE: Fixed height biar gambar kelihatan jelas (h-48) */
                                                /* DESKTOP: Stretch height (h-full) */
                                                ${hasImage ? 'h-48 lg:h-full' : 'min-h-[100px] lg:h-full p-4 justify-center'}
                                                
                                                ${selectedAnswer === idx 
                                                    ? 'border-primary bg-primary/5 ring-2 ring-primary ring-offset-2' 
                                                    : 'border-slate-200 hover:border-primary/50 hover:bg-slate-50'
                                                }
                                            `}
                                        >
                                            {/* GAMBAR FULL BACKGROUND */}
                                            {hasImage && (
                                                <div className="absolute inset-0 z-0">
                                                    <img 
                                                        src={currentQ.options_media![idx].url} 
                                                        alt={`Jawaban ${['A','B','C','D'][idx]}`} 
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                    {/* Gradient Overlay */}
                                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                                                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                                                </div>
                                            )}

                                            {/* LABEL HURUF */}
                                            <div className={`
                                                absolute top-3 left-3 z-10 w-9 h-9 rounded-xl flex items-center justify-center text-lg font-black border shadow-sm
                                                ${selectedAnswer === idx 
                                                    ? 'bg-primary text-white border-primary' 
                                                    : 'bg-white/90 backdrop-blur text-slate-700 border-slate-300'
                                                }
                                            `}>
                                                {['A','B','C','D'][idx]}
                                            </div>

                                            {/* CHECKMARK */}
                                            {selectedAnswer === idx && (
                                                <div className="absolute top-3 right-3 z-10 bg-primary text-white rounded-full p-1 shadow-lg animate-in zoom-in">
                                                    <CheckCircle size={20} className="fill-current" />
                                                </div>
                                            )}
                                            
                                            {/* TEKS JAWABAN */}
                                            <div className={`
                                                relative z-10 mt-auto w-full 
                                                ${hasImage ? 'p-4 text-white text-shadow-sm' : 'flex-1 flex items-center'}
                                            `}>
                                                <span className={`text-base font-bold leading-snug ${!hasImage && selectedAnswer === idx ? 'text-primary-foreground text-gray-900' : ''} ${!hasImage && selectedAnswer !== idx ? 'text-gray-600' : ''}`}>
                                                    {opt}
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Footer Tombol Next */}
                        <div className="p-4 border-t bg-slate-50 sticky bottom-0 z-30 shrink-0">
                            <Button 
                                onClick={() => handleAnswerSubmit(phase === 'post_test')} 
                                disabled={selectedAnswer === null}
                                className="w-full h-14 text-lg rounded-xl font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:shadow-none transition-all"
                            >
                                {currentQuestionIdx === questions.length - 1 ? 'Selesaikan Tes' : 'Jawab & Lanjut'} 
                                <ArrowRight className="ml-2 w-6 h-6" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 3. LEARNING SCREEN (Responsive Fix)
    if (phase === 'learning') {
        const step = module.steps[currentStepIdx];
        const progress = ((currentStepIdx + 1) / module.steps.length) * 100;

        return (
            <div className="h-screen flex flex-col bg-white">
                <div className="h-14 border-b flex items-center px-6 justify-between shrink-0 z-20 bg-white">
                    <Button variant="ghost" onClick={() => setPhase('intro')} className="text-muted-foreground hover:text-destructive text-sm">
                        <XCircle className="mr-2 h-4 w-4" /> Keluar
                    </Button>
                    <div className="flex-1 max-w-xs mx-4 hidden sm:block">
                        <Progress value={progress} className="h-2 rounded-full" />
                    </div>
                    <span className="font-bold text-sm text-muted-foreground">Langkah {currentStepIdx + 1}/{module.steps.length}</span>
                </div>

                {/* Mobile: Scrollable Vertical. Desktop: Split Fixed */}
                <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
                    {/* Kiri: Media */}
                    <div className="w-full lg:flex-1 bg-black flex items-center justify-center p-4 lg:p-0 min-h-[300px] lg:min-h-0 lg:h-full">
                        {step.media_url ? (
                            step.media_type === 'video' ? (
                                <video src={step.media_url} controls className="max-w-full max-h-[400px] lg:max-h-full" />
                            ) : (
                                <img src={step.media_url} alt="Step Visual" className="max-w-full max-h-[400px] lg:max-h-full object-contain" />
                            )
                        ) : (
                            <div className="text-white/30 flex flex-col items-center">
                                <BookOpen size={48} className="mb-4 opacity-50" />
                                <p className="text-sm">Tidak ada media visual</p>
                            </div>
                        )}
                    </div>

                    {/* Kanan: Penjelasan */}
                    <div className="w-full lg:w-[450px] border-t lg:border-t-0 lg:border-l bg-white flex flex-col lg:h-full shrink-0">
                        <div className="flex-1 p-6 md:p-8 lg:overflow-y-auto">
                            <div className="flex justify-between items-start gap-4 mb-4">
                                <h2 className="text-2xl font-bold text-gray-900">{step.title}</h2>
                                <Button 
                                    variant="outline" size="icon" 
                                    onClick={() => isSpeaking ? stopSpeak() : speakText(`${step.title}. ${step.description}`)}
                                    className="rounded-full shrink-0 w-10 h-10"
                                >
                                    {isSpeaking ? <StopCircle className="text-destructive w-5 h-5"/> : <Volume2 className="text-primary w-5 h-5"/>}
                                </Button>
                            </div>
                            <div className="prose prose-sm prose-slate max-w-none text-gray-600 leading-relaxed">
                                {step.description}
                            </div>
                        </div>

                        <div className="p-4 border-t bg-gray-50 flex gap-3 sticky bottom-0 lg:static">
                            <Button variant="outline" onClick={prevStep} disabled={currentStepIdx === 0} className="flex-1 h-12 font-bold rounded-xl border-2">
                                <ArrowLeft className="mr-2 w-4 h-4" /> Kembali
                            </Button>
                            <Button onClick={nextStep} className="flex-[2] h-12 font-bold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
                                {currentStepIdx === module.steps.length - 1 ? 'Selesai' : 'Lanjut'} <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 4. FINISH
    return (
        <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
             <Card className="max-w-md w-full p-10 rounded-3xl text-center border-none shadow-xl bg-white">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                    <CheckCircle size={40} strokeWidth={4} />
                </div>
                <h1 className="text-3xl font-black text-gray-900 mb-2">Selesai!</h1>
                <p className="text-gray-500 mb-8">Anda telah menyelesaikan seluruh rangkaian modul ini.</p>
                {isPreview ? (
                    <Button asChild className="w-full h-12 text-lg rounded-xl font-bold bg-slate-900 text-white hover:bg-black"><a href={`/pengajar/modul/${(module as any).id}/edit`}>Tutup Preview</a></Button>
                ) : (
                    <Button asChild className="w-full h-12 text-lg rounded-xl font-bold"><Link href="/peserta/dashboard">Kembali ke Dashboard</Link></Button>
                )}
            </Card>
        </div>
    );
}