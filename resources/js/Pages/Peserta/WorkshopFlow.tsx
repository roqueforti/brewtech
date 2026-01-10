import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { ArrowLeft, ArrowRight, Check, Camera, Coffee, ChevronRight, ChevronLeft, Award } from 'lucide-react';
import Confetti from 'react-confetti'; // Install dulu: npm install react-confetti

interface Props {
    workshop: any;
    progress: any;
    initialState: string;
}

export default function WorkshopFlow({ workshop, progress, initialState }: Props) {
    const [state, setState] = useState(initialState); 
    // State Options: 'INTRO', 'PRETEST', 'PRETEST_RESULT', 'PRAKTIKUM', 'POSTTEST', 'POSTTEST_RESULT', 'PHOTO', 'COMPLETED'
    
    // Data Dinamis
    const [questions, setQuestions] = useState<any[]>([]);
    const [steps, setSteps] = useState<any[]>([]);
    
    // State Internal
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
    const [score, setScore] = useState(0);
    const [photo, setPhoto] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    // --- LOGIC: PRE-TEST ---
    const startPretest = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/workshop/${workshop.id}/quiz/pretest`);
            setQuestions(res.data);
            setState('PRETEST');
        } catch (error) {
            alert("Gagal memuat soal pre-test");
        }
        setLoading(false);
    };

    const submitPretest = async () => {
        setLoading(true);
        try {
            const res = await axios.post(`/api/workshop/${workshop.id}/quiz/submit`, {
                answers: quizAnswers,
                type: 'pretest'
            });
            setScore(res.data.score);
            setState('PRETEST_RESULT');
        } catch (error) {
            alert("Gagal mengirim jawaban");
        }
        setLoading(false);
    };

    // --- LOGIC: PRAKTIKUM (MATERI) ---
    const startPraktikum = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/workshop/${workshop.id}/steps`);
            setSteps(res.data);
            setCurrentStepIndex(0);
            setState('PRAKTIKUM');
        } catch (error) {
            alert("Gagal memuat materi");
        }
        setLoading(false);
    };

    const nextStep = () => {
        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
        } else {
            // Selesai Materi
            axios.post(`/api/workshop/${workshop.id}/praktikum/complete`);
            setState('POSTTEST_INTRO'); // Layar transisi sebelum post-test
        }
    };

    const prevStep = () => {
        if (currentStepIndex > 0) setCurrentStepIndex(currentStepIndex - 1);
    };

    // --- LOGIC: POST-TEST ---
    const startPosttest = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/workshop/${workshop.id}/quiz/posttest`);
            setQuestions(res.data);
            setQuizAnswers({}); // Reset jawaban
            setState('POSTTEST');
        } catch (error) {
            alert("Gagal memuat soal post-test");
        }
        setLoading(false);
    };

    const submitPosttest = async () => {
        setLoading(true);
        try {
            const res = await axios.post(`/api/workshop/${workshop.id}/quiz/submit`, {
                answers: quizAnswers,
                type: 'posttest'
            });
            setScore(res.data.score);
            setState('POSTTEST_RESULT');
        } catch (error) {
            alert("Gagal mengirim jawaban");
        }
        setLoading(false);
    };

    // --- LOGIC: PHOTO UPLOAD ---
    const submitPhoto = () => {
        if (!photo) return;
        const formData = new FormData();
        formData.append('photo', photo);
        
        router.post(`/api/workshop/${workshop.id}/photo`, formData, {
            onSuccess: () => setState('COMPLETED')
        });
    };


    // === RENDERERS (UI Components) ===

    // 1. TAMPILAN KUIS (Dipakai untuk Pre & Post)
    const renderQuiz = (type: 'Pre-Test' | 'Post-Test', onSubmit: () => void) => (
        <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-black text-[#5D4037] text-center mb-6">{type}</h2>
            {questions.map((q, idx) => (
                <div key={q.id} className="bg-white p-6 rounded-3xl border-[4px] border-[#D7CCC8] shadow-sm">
                    <p className="text-lg font-bold text-[#5D4037] mb-4">{idx + 1}. {q.question_text}</p>
                    <div className="space-y-2">
                        {q.options.map((opt: string, optIdx: number) => {
                            const optionLabel = ['A', 'B', 'C', 'D'][optIdx];
                            return (
                                <button
                                    key={optIdx}
                                    onClick={() => setQuizAnswers({...quizAnswers, [q.id]: optionLabel})}
                                    className={`w-full text-left p-4 rounded-xl font-bold border-2 transition-all ${
                                        quizAnswers[q.id] === optionLabel 
                                            ? 'bg-[#FFECB3] border-[#FFCA28] text-[#5D4037]' 
                                            : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                                    }`}
                                >
                                    <span className="font-black mr-2">{optionLabel}.</span> {opt}
                                </button>
                            )
                        })}
                    </div>
                </div>
            ))}
            <button 
                onClick={onSubmit}
                disabled={Object.keys(quizAnswers).length !== questions.length}
                className="w-full py-4 bg-[#66BB6A] text-white font-black rounded-2xl text-xl shadow-lg border-b-[6px] border-[#2E7D32] active:border-b-0 active:translate-y-2 disabled:opacity-50"
            >
                KIRIM JAWABAN 📤
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FFF8E1] font-sans p-6 md:p-10 pb-32">
            {/* Header Mini */}
            <div className="flex items-center justify-between mb-8">
                <button onClick={() => router.visit('/peserta/dashboard')} className="p-2 bg-white rounded-xl border-[3px] border-[#D7CCC8] text-[#8D6E63]">
                    <ArrowLeft />
                </button>
                <div className="bg-[#FFFAF0] px-4 py-2 rounded-full border-[3px] border-[#8D6E63] font-black text-[#5D4037]">
                    {workshop.title}
                </div>
                <div className="w-10"></div>
            </div>

            {loading && <div className="text-center text-xl font-black text-[#5D4037] animate-pulse">Memuat... ☕</div>}

            {/* === STATE: INTRO === */}
            {state === 'INTRO' && (
                <div className="text-center max-w-lg mx-auto mt-10">
                    <div className="text-8xl mb-6">🏁</div>
                    <h1 className="text-4xl font-black text-[#5D4037] mb-4">Siap Belajar?</h1>
                    <p className="text-[#8D6E63] font-bold mb-8">
                        Kita akan mulai dengan Pre-Test singkat untuk mengecek pengetahuan awalmu tentang {workshop.title}.
                    </p>
                    <button onClick={startPretest} className="w-full py-4 bg-[#FFCA28] text-[#5D4037] font-black rounded-2xl text-xl shadow-lg border-b-[6px] border-[#FF8F00] active:border-b-0 active:translate-y-2">
                        MULAI PRE-TEST
                    </button>
                </div>
            )}

            {/* === STATE: PRETEST === */}
            {state === 'PRETEST' && renderQuiz('Pre-Test', submitPretest)}

            {/* === STATE: PRETEST RESULT === */}
            {state === 'PRETEST_RESULT' && (
                <div className="text-center max-w-lg mx-auto mt-10 bg-white p-8 rounded-[2.5rem] border-[6px] border-[#8D6E63]">
                    <h2 className="text-2xl font-black text-[#5D4037] mb-2">Hasil Pre-Test</h2>
                    <div className="text-6xl font-black text-[#1565C0] mb-4">{score} / 100</div>
                    <p className="text-[#8D6E63] font-bold mb-8">
                        Jangan khawatir soal nilai! Sekarang mari kita pelajari cara membuatnya yang benar di sesi Praktikum.
                    </p>
                    <button onClick={startPraktikum} className="w-full py-4 bg-[#29B6F6] text-white font-black rounded-2xl text-xl shadow-lg border-b-[6px] border-[#0288D1] active:border-b-0 active:translate-y-2">
                        MASUK PRAKTIKUM 🚀
                    </button>
                </div>
            )}

            {/* === STATE: PRAKTIKUM (STEP BY STEP) === */}
            {state === 'PRAKTIKUM' && steps.length > 0 && (
                <div className="max-w-3xl mx-auto h-full flex flex-col">
                    {/* Progress Bar */}
                    <div className="w-full bg-[#D7CCC8] h-3 rounded-full mb-6">
                        <div 
                            className="bg-[#FFCA28] h-3 rounded-full transition-all duration-500" 
                            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                        ></div>
                    </div>

                    {/* Step Card */}
                    <div className="bg-white rounded-[2.5rem] overflow-hidden border-[6px] border-[#8D6E63] shadow-xl flex-1 flex flex-col">
                        <img 
                            src={steps[currentStepIndex].image_url} 
                            alt={steps[currentStepIndex].title} 
                            className="w-full h-64 md:h-80 object-cover"
                        />
                        <div className="p-6 md:p-8 flex-1 flex flex-col justify-center text-center">
                            <div className="inline-block bg-[#FFECB3] text-[#FF8F00] font-black px-3 py-1 rounded-lg text-sm mb-3 mx-auto">
                                LANGKAH {currentStepIndex + 1} DARI {steps.length}
                            </div>
                            <h2 className="text-3xl font-black text-[#5D4037] mb-4">{steps[currentStepIndex].title}</h2>
                            <p className="text-lg font-bold text-[#8D6E63] leading-relaxed">
                                {steps[currentStepIndex].description}
                            </p>
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex gap-4 mt-6">
                        <button 
                            onClick={prevStep}
                            disabled={currentStepIndex === 0}
                            className="flex-1 py-4 bg-white text-[#8D6E63] font-black rounded-2xl border-[4px] border-[#D7CCC8] disabled:opacity-50"
                        >
                            <ChevronLeft className="inline mb-1" /> SEBELUMNYA
                        </button>
                        <button 
                            onClick={nextStep}
                            className="flex-[2] py-4 bg-[#FFCA28] text-[#5D4037] font-black rounded-2xl border-b-[6px] border-[#FF8F00] active:border-b-0 active:translate-y-2 shadow-lg"
                        >
                            {currentStepIndex === steps.length - 1 ? 'SELESAI PRAKTIKUM ✅' : 'SELANJUTNYA ➜'}
                        </button>
                    </div>
                </div>
            )}

            {/* === STATE: POSTTEST INTRO === */}
            {state === 'POSTTEST_INTRO' && (
                <div className="text-center max-w-lg mx-auto mt-10">
                    <div className="text-8xl mb-6">🎓</div>
                    <h1 className="text-4xl font-black text-[#5D4037] mb-4">Praktikum Selesai!</h1>
                    <p className="text-[#8D6E63] font-bold mb-8">
                        Sekarang mari kita lihat seberapa jauh pemahamanmu meningkat dibandingkan Pre-Test tadi.
                    </p>
                    <button onClick={startPosttest} className="w-full py-4 bg-[#EF5350] text-white font-black rounded-2xl text-xl shadow-lg border-b-[6px] border-[#C62828] active:border-b-0 active:translate-y-2">
                        KERJAKAN POST-TEST
                    </button>
                </div>
            )}

            {/* === STATE: POSTTEST === */}
            {state === 'POSTTEST' && renderQuiz('Post-Test', submitPosttest)}

            {/* === STATE: POSTTEST RESULT & PHOTO UPLOAD === */}
            {(state === 'POSTTEST_RESULT' || state === 'PHOTO') && (
                <div className="text-center max-w-lg mx-auto mt-4 space-y-6">
                    {/* Score Card */}
                    <div className="bg-white p-6 rounded-[2rem] border-[5px] border-[#8D6E63]">
                        <h2 className="text-xl font-black text-[#5D4037]">Nilai Akhir</h2>
                        <div className="flex items-center justify-center gap-4 mt-2">
                            <div className="text-right">
                                <div className="text-xs font-bold text-gray-400">PRE-TEST</div>
                                <div className="text-2xl font-black text-gray-400">{progress.pretest_score}</div>
                            </div>
                            <div className="text-4xl">➡️</div>
                            <div className="text-left">
                                <div className="text-xs font-bold text-[#2E7D32]">POST-TEST</div>
                                <div className="text-5xl font-black text-[#2E7D32]">{score}</div>
                            </div>
                        </div>
                        <div className="mt-4 bg-[#E8F5E9] text-[#2E7D32] font-bold py-2 rounded-xl">
                            Peningkatan: +{Math.max(0, score - progress.pretest_score)} Poin!
                        </div>
                    </div>

                    {/* Photo Upload */}
                    <div className="bg-[#FFF8E1] p-6 rounded-[2rem] border-[4px] border-dashed border-[#8D6E63]">
                        <h3 className="text-xl font-black text-[#5D4037] mb-2">📸 Final Step: Foto Minumanmu</h3>
                        <p className="text-sm font-bold text-[#8D6E63] mb-4">Upload hasil V60 buatanmu untuk mendapatkan sertifikat.</p>
                        
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)}
                            className="block w-full text-sm text-slate-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-[#FFCA28] file:text-[#5D4037]
                                hover:file:bg-[#FFB300] mb-4
                            "
                        />

                        {photo && (
                            <button onClick={submitPhoto} className="w-full py-3 bg-[#5D4037] text-white font-black rounded-xl shadow-lg">
                                KIRIM HASIL FOTO
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* === STATE: COMPLETED === */}
            {state === 'COMPLETED' && (
                <div className="text-center max-w-lg mx-auto mt-10">
                    <Confetti numberOfPieces={200} recycle={false} />
                    <div className="text-9xl mb-4 animate-bounce">🏆</div>
                    <h1 className="text-4xl font-black text-[#5D4037] mb-4">Workshop Selesai!</h1>
                    <p className="text-[#8D6E63] font-bold mb-8">
                        Selamat! Kamu telah menyelesaikan modul V60 Manual Brew. Hasilmu sudah disimpan.
                    </p>
                    <button onClick={() => router.visit('/peserta/dashboard')} className="w-full py-4 bg-white text-[#5D4037] font-black rounded-2xl text-xl border-[4px] border-[#D7CCC8]">
                        KEMBALI KE DASHBOARD
                    </button>
                </div>
            )}
        </div>
    );
}