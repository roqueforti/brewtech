import { Volume2, FileText } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Card } from "@/Components/ui/card";

interface Props {
    stepData: any;
    currentIndex: number;
    totalSteps: number;
    onSpeak: (text: string) => void;
}

export default function MaterialView({ stepData, currentIndex, totalSteps, onSpeak }: Props) {
    if (!stepData) return null;

    return (
        <div className="flex-1 overflow-y-auto scroll-smooth p-6 md:p-8 bg-[#FAFAF9]">
            <div className="max-w-4xl mx-auto w-full pb-32">
                
                <Card className="rounded-[2.5rem] border-2 border-slate-200 shadow-sm bg-white p-8">
                    {/* Header Section */}
                    <div className="flex items-center justify-between mb-6">
                        <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 px-3 py-1.5 rounded-lg border-2 border-orange-100 font-bold">
                            Langkah {currentIndex + 1} dari {totalSteps}
                        </Badge>
                        <Button variant="outline" size="sm" onClick={() => onSpeak(`${stepData.title}. ${stepData.description}`)} className="rounded-full border-2 border-slate-200 text-slate-600 hover:bg-slate-50">
                            <Volume2 className="h-4 w-4" />
                        </Button>
                    </div>
                    
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-8">{stepData.title}</h1>
                    
                    {/* Media Container */}
                    <div className="rounded-[2rem] overflow-hidden bg-slate-100 shadow-inner aspect-video relative max-h-[60vh] mx-auto w-full border-2 border-slate-200 mb-8">
                        {stepData.media_url ? (
                            stepData.media_type === 'video' ? (
                                <video key={stepData.media_url} controls className="w-full h-full object-contain">
                                    <source src={stepData.media_url} type="video/mp4" />
                                </video>
                            ) : (
                                <img src={stepData.media_url} alt="Materi" className="w-full h-full object-contain"/>
                            )
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-slate-400 bg-slate-50">
                                <FileText size={48} className="opacity-50"/>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="prose prose-lg max-w-none text-slate-600 leading-relaxed">
                        <p>{stepData.description}</p>
                    </div>
                </Card>
            </div>
        </div>
    );
}