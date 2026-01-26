import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/Components/ui/button";

interface Props {
    showPrev: boolean;
    showNext: boolean;
    nextLabel?: string;
    isNextDisabled?: boolean;
    onPrev: () => void;
    onNext: () => void;
}

export default function NavigationFooter({ showPrev, showNext, nextLabel = "Selanjutnya", isNextDisabled, onPrev, onNext }: Props) {
    if (!showPrev && !showNext) return null;

    return (
        <div className="h-20 bg-white border-t-2 border-slate-200 flex items-center justify-between px-6 md:px-10 shrink-0 z-40">
            <div className="flex-1">
                {showPrev && (
                    <Button variant="ghost" size="lg" onClick={onPrev} className="text-slate-500 font-bold hover:bg-slate-50 hover:text-slate-800 rounded-2xl h-12 px-6 transition-colors">
                        <ChevronLeft className="mr-2 h-5 w-5"/> Sebelumnya
                    </Button>
                )}
            </div>
            <div className="flex-1 flex justify-end">
                {showNext && (
                    <Button size="lg" onClick={onNext} 
                        disabled={isNextDisabled}
                        className={`h-12 px-8 rounded-2xl font-bold text-base shadow-lg hover:shadow-xl transition-all active:scale-95
                            ${isNextDisabled 
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
                                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20'
                            }
                        `}
                    >
                        {nextLabel} <ChevronRight className="ml-2 h-5 w-5"/>
                    </Button>
                )}
            </div>
        </div>
    );
}