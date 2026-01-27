import { Card } from "@/Components/ui/card";
import { CheckCircle2, Volume2, Image as ImageIcon } from "lucide-react";

export default function QuizCard({ 
    title, questionData, currentIndex, totalQuestions, selectedAnswer, onSelectAnswer, onSpeak 
}: any) {
    if (!questionData) return null;

    return (
        <div className="flex-1 w-full h-full overflow-hidden flex flex-col">
            {/* Header / Progress Bar */}
            <div className="px-6 py-4 bg-white border-b border-slate-100 flex justify-between items-center shrink-0 z-10">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-100">
                    {title}
                </span>
                <span className="text-sm font-bold text-slate-400">
                    Soal {currentIndex + 1} / {totalQuestions}
                </span>
            </div>

            {/* Main Split Layout */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 h-full">
                    
                    {/* --- KOLOM KIRI: SOAL & GAMBAR UTAMA --- */}
                    <div className="flex flex-col gap-6">
                        {/* Teks Pertanyaan */}
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                            <div className="flex gap-4 items-start">
                                <h2 className="text-2xl md:text-3xl font-black text-slate-800 leading-tight flex-1">
                                    {questionData.question}
                                </h2>
                                <button 
                                    onClick={() => onSpeak(questionData.question)} 
                                    className="p-3 bg-slate-50 rounded-full hover:bg-cyan-100 hover:text-cyan-600 transition-colors shrink-0 text-slate-400"
                                >
                                    <Volume2 size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Media Soal (Jika Ada) */}
                        {questionData.media_url ? (
                            <div className="w-full bg-slate-900 rounded-[2rem] overflow-hidden shadow-lg border-4 border-white flex-1 min-h-[250px] relative group">
                                {questionData.media_url.includes('video') ? (
                                    <video src={questionData.media_url} controls className="w-full h-full object-contain bg-black" />
                                ) : (
                                    <img src={questionData.media_url} alt="Soal" className="w-full h-full object-cover" />
                                )}
                            </div>
                        ) : (
                            // Placeholder jika tidak ada gambar soal agar layout tetap seimbang
                            <div className="hidden lg:flex flex-1 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 items-center justify-center text-slate-300">
                                <span className="text-lg font-bold">Tidak ada gambar soal</span>
                            </div>
                        )}
                    </div>

                    {/* --- KOLOM KANAN: PILIHAN JAWABAN (GRID 2 KOLOM 1:1) --- */}
                    <div className="flex flex-col justify-center">
                        <div className="grid grid-cols-2 gap-4 w-full">
                            {questionData.options.map((opt: any, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => onSelectAnswer(idx)}
                                    className={`relative flex flex-col overflow-hidden rounded-[2rem] border-4 transition-all duration-300 group
                                        ${selectedAnswer === idx 
                                            ? 'border-cyan-500 bg-cyan-50 shadow-[0px_8px_20px_rgba(34,211,238,0.3)] scale-[1.02]' 
                                            : 'border-white bg-white shadow-md hover:border-cyan-200 hover:shadow-xl'
                                        }
                                    `}
                                >
                                    {/* Container Gambar (Rasio 1:1 / Square) */}
                                    <div className="w-full aspect-square bg-slate-100 relative overflow-hidden">
                                        {opt.media_url ? (
                                            <img 
                                                src={opt.media_url} 
                                                alt={`Opsi ${String.fromCharCode(65 + idx)}`} 
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-2">
                                                <ImageIcon size={48} className="opacity-50"/>
                                            </div>
                                        )}

                                        {/* Badge Huruf (A, B, C, D) Melayang */}
                                        <div className={`absolute top-4 left-4 w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg shadow-lg
                                            ${selectedAnswer === idx 
                                                ? 'bg-cyan-500 text-white' 
                                                : 'bg-white text-slate-500'
                                            }
                                        `}>
                                            {selectedAnswer === idx ? <CheckCircle2 size={20}/> : String.fromCharCode(65 + idx)}
                                        </div>
                                    </div>

                                    {/* Teks Jawaban (Footer Card) */}
                                    <div className={`p-4 text-center w-full min-h-[80px] flex items-center justify-center border-t-2
                                        ${selectedAnswer === idx ? 'border-cyan-200 bg-cyan-100/50' : 'border-slate-50 bg-white'}
                                    `}>
                                        <span className={`text-sm md:text-base font-bold leading-tight line-clamp-3
                                            ${selectedAnswer === idx ? 'text-cyan-900' : 'text-slate-600 group-hover:text-cyan-600'}
                                        `}>
                                            {opt.text || (opt.media_url ? `Pilihan ${String.fromCharCode(65 + idx)}` : "Teks Kosong")}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}