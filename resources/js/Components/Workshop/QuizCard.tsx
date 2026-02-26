import { Card } from "@/Components/ui/card";
import { CheckCircle2, Volume2, Image as ImageIcon } from "lucide-react";

export default function QuizCard({ 
    title, questionData, currentIndex, totalQuestions, selectedAnswer, onSelectAnswer, onSpeak 
}: any) {
    if (!questionData) return null;

    return (
        <div className="flex-1 w-full h-full overflow-hidden flex flex-col">
            
            {/* 1. HEADER (Fixed Height) */}
            <div className="px-6 py-3 bg-white border-b border-slate-100 flex justify-between items-center shrink-0 z-20 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-100">
                    {title}
                </span>
                <span className="text-sm font-black text-slate-400">
                    Soal <span className="text-slate-800">{currentIndex + 1}</span> / {totalQuestions}
                </span>
            </div>

            {/* 2. MAIN CONTENT (Flex Row - Full Height No Scroll) */}
            <div className="flex-1 min-h-0 flex flex-col lg:flex-row p-4 gap-4">
                
                {/* --- PANEL KIRI: SOAL (35%) --- */}
                <div className="lg:w-[35%] w-full h-full flex flex-col gap-4">
                    
                    {/* Teks Soal */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 shrink-0">
                        <div className="flex gap-3 items-start">
                            <h2 className="text-lg md:text-xl font-bold text-slate-800 leading-snug flex-1">
                                {questionData.question}
                            </h2>
                            <button 
                                onClick={() => onSpeak(questionData.question)} 
                                className="p-2 bg-slate-50 rounded-full hover:bg-cyan-100 hover:text-cyan-600 transition-colors shrink-0 text-slate-400"
                            >
                                <Volume2 size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Media Soal (Flexible Height - Isi sisa ruang) */}
                    <div className="flex-1 min-h-0 bg-slate-900 rounded-2xl overflow-hidden shadow-inner border-2 border-slate-100 relative group flex items-center justify-center">
                        {questionData.media_url ? (
                            questionData.media_url.includes('video') ? (
                                <video src={questionData.media_url} controls className="w-full h-full object-contain" />
                            ) : (
                                <img src={questionData.media_url} alt="Soal" className="w-full h-full object-contain" />
                            )
                        ) : (
                            <div className="flex flex-col items-center justify-center text-slate-500 gap-2 opacity-50">
                                <ImageIcon size={48} />
                                <span className="text-xs font-bold uppercase tracking-widest">Tanpa Gambar</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- PANEL KANAN: JAWABAN (65%) --- */}
                <div className="flex-1 h-full min-h-0">
                    <div className="grid grid-cols-2 gap-4 h-full">
                        {questionData.options.map((opt: any, idx: number) => (
                            <button
                                key={idx}
                                onClick={() => onSelectAnswer(idx)}
                                className={`relative flex flex-col rounded-2xl border-4 transition-all duration-200 overflow-hidden h-full
                                    ${selectedAnswer === idx 
                                        ? 'border-cyan-500 bg-cyan-50 shadow-md ring-2 ring-cyan-200' 
                                        : 'border-white bg-white hover:border-cyan-200 hover:bg-slate-50 shadow-sm'
                                    }
                                `}
                            >
                                {/* Badge Huruf */}
                                <div className={`absolute top-3 left-3 z-10 w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm shadow-md transition-colors
                                    ${selectedAnswer === idx ? 'bg-cyan-600 text-white' : 'bg-white text-slate-500'}
                                `}>
                                    {String.fromCharCode(65 + idx)}
                                </div>

                                {/* Gambar Opsi (Flexible Height) */}
                                <div className="flex-1 w-full relative bg-slate-100/50 min-h-0">
                                    {opt.media_url ? (
                                        <img 
                                            src={opt.media_url} 
                                            alt={`Opsi ${idx}`} 
                                            className="w-full h-full object-contain p-2 mix-blend-multiply" 
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <ImageIcon size={32} className="text-slate-200" />
                                        </div>
                                    )}
                                </div>

                                {/* Teks Jawaban (Fixed Footer Height) */}
                                <div className={`w-full p-3 text-center border-t-2 flex items-center justify-center shrink-0 min-h-[60px]
                                    ${selectedAnswer === idx ? 'border-cyan-200 bg-cyan-100/50' : 'border-slate-50'}
                                `}>
                                    <span className={`text-sm font-bold leading-tight line-clamp-2
                                        ${selectedAnswer === idx ? 'text-cyan-900' : 'text-slate-600'}
                                    `}>
                                        {opt.text || (opt.media_url ? `Pilihan ${String.fromCharCode(65 + idx)}` : "-")}
                                    </span>
                                </div>

                                {/* Indikator Terpilih (Overlay) */}
                                {selectedAnswer === idx && (
                                    <div className="absolute top-3 right-3 z-10 text-cyan-600 bg-white rounded-full p-1 shadow-sm">
                                        <CheckCircle2 size={20} className="fill-cyan-100" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}