import { Button } from "@/Components/ui/button";
import { Volume2 } from "lucide-react";

export default function MaterialView({ stepData, currentIndex, totalSteps, onSpeak }: any) {
    if (!stepData) return null;

    return (
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
            <div className="max-w-3xl w-full space-y-6 animate-in fade-in duration-500">
                {/* Step Indicator */}
                <div className="flex items-center gap-4 mb-4">
                    <span className="bg-cyan-500 text-white px-4 py-1.5 rounded-full text-sm font-black shadow-cyan-200 shadow-lg">
                        Langkah {currentIndex + 1} / {totalSteps}
                    </span>
                    <div className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-cyan-500 transition-all duration-500 ease-out"
                            style={{ width: `${((currentIndex + 1) / totalSteps) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Media Container */}
                <div className="aspect-video bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl relative group">
                    {stepData.media_url ? (
                        stepData.media_type === 'video' || stepData.media_url.endsWith('.mp4') ? (
                            <video 
                                src={stepData.media_url} 
                                className="w-full h-full object-cover" 
                                controls 
                                autoPlay 
                                muted 
                            />
                        ) : (
                            <img 
                                src={stepData.media_url} 
                                alt={stepData.title} 
                                className="w-full h-full object-cover"
                            />
                        )
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-500 font-bold bg-slate-100">
                            Tidak ada media visual
                        </div>
                    )}
                </div>

                {/* Text Content */}
                <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                    <div className="flex justify-between items-start gap-4">
                        <h2 className="text-2xl md:text-3xl font-black text-slate-800 leading-tight">
                            {stepData.title}
                        </h2>
                        <Button 
                            variant="secondary" 
                            size="icon" 
                            className="rounded-full bg-cyan-50 text-cyan-600 hover:bg-cyan-100 shrink-0"
                            onClick={() => onSpeak(stepData.description)}
                        >
                            <Volume2 size={24} />
                        </Button>
                    </div>
                    <p className="text-lg text-slate-600 leading-relaxed font-medium">
                        {stepData.description}
                    </p>
                </div>
            </div>
        </div>
    );
}