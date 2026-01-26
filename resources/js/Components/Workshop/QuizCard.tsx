import React from 'react';
import { Volume2, CheckCircle2 } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Card } from "@/Components/ui/card";

interface Props {
    title: string; 
    questionData: any;
    currentIndex: number;
    totalQuestions: number;
    selectedAnswer: number | undefined;
    onSelectAnswer: (index: number) => void;
    onSpeak: (text: string) => void;
}

export default function QuizCard({ 
    title, questionData, currentIndex, totalQuestions, selectedAnswer, onSelectAnswer, onSpeak 
}: Props) {
    if (!questionData || !questionData.options) return <div>Loading...</div>;

    return (
        <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden p-4 md:p-8 gap-6 bg-[#FAFAF9]">
            
            {/* KARTU SOAL */}
            <Card className="lg:w-[45%] flex flex-col border-2 border-slate-200 shadow-sm rounded-[2.5rem] overflow-hidden bg-white h-full">
                {/* Header Warna */}
                <div className={`h-2 w-full shrink-0 ${title.includes('Pre') ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
                
                <div className="flex-1 overflow-y-auto p-8 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <Badge variant="outline" className="text-slate-500 border-2 border-slate-200 font-bold px-3 py-1 rounded-lg">
                            {title} • {currentIndex + 1}/{totalQuestions}
                        </Badge>
                        <Button variant="ghost" size="icon" onClick={() => onSpeak(questionData.question)} className="rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500">
                            <Volume2 className="h-5 w-5"/>
                        </Button>
                    </div>

                    {/* Media Soal */}
                    {questionData.media_url && (
                        <div className="mb-6 rounded-[1.5rem] overflow-hidden border-2 border-slate-100 bg-slate-50 flex-shrink-0 relative">
                            {questionData.media_type === 'video' 
                                ? <video src={questionData.media_url} controls className="w-full max-h-[30vh] object-contain"/>
                                : <img src={questionData.media_url} alt="Soal" className="w-full max-h-[30vh] object-contain"/>
                            }
                        </div>
                    )}

                    <h3 className="text-2xl md:text-3xl font-black text-slate-800 leading-snug flex-1">
                        {questionData.question}
                    </h3>
                </div>
            </Card>

            {/* OPSI JAWABAN */}
            <div className="lg:w-[55%] grid grid-cols-1 sm:grid-cols-2 gap-4 h-full overflow-y-auto pb-24 lg:pb-0">
                {questionData.options.map((opt: string, i: number) => {
                    const isSelected = selectedAnswer === i;
                    const hasImage = questionData.options_media?.[i]?.url;

                    return (
                        <div key={i} 
                            onClick={() => { onSelectAnswer(i); onSpeak(opt); }}
                            className={`relative rounded-[2rem] border-2 cursor-pointer transition-all flex flex-col overflow-hidden group active:scale-[0.98]
                                ${isSelected 
                                    ? 'border-orange-500 bg-orange-50 ring-4 ring-orange-100 z-10' 
                                    : 'border-slate-200 bg-white hover:border-orange-300 hover:shadow-md'
                                }
                            `}
                            style={{ minHeight: '160px' }}
                        >
                            <div className="absolute top-4 left-4 z-20">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 
                                    ${isSelected ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-slate-400 border-slate-200'}`}>
                                    {String.fromCharCode(65 + i)}
                                </div>
                            </div>

                            {hasImage ? (
                                <div className="flex-1 w-full bg-slate-100 relative">
                                    <img src={questionData.options_media[i].url} alt={`Opsi ${i}`} className="absolute inset-0 w-full h-full object-cover"/>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className={`absolute bottom-0 left-0 w-full p-4 text-white font-bold text-center ${isSelected ? 'bg-orange-600' : ''}`}>
                                        {opt}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex items-center justify-center p-6 text-center">
                                    <span className={`font-bold text-lg md:text-xl ${isSelected ? 'text-orange-900' : 'text-slate-700'}`}>{opt}</span>
                                </div>
                            )}

                            {isSelected && (
                                <div className="absolute top-4 right-4 z-20 bg-orange-500 text-white rounded-full p-1 shadow-lg animate-in zoom-in">
                                    <CheckCircle2 size={20} />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}