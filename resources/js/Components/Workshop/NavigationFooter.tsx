import { Button } from "@/Components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function NavigationFooter({ 
    showPrev, showNext, nextLabel, isNextDisabled, onPrev, onNext 
}: any) {
    if (!showPrev && !showNext) return null;

    return (
        // UBAH: justify-between -> justify-end, dan tambah gap-4
        <div className="h-24 bg-white border-t border-slate-200 px-6 md:px-10 flex items-center justify-end gap-4 shrink-0 z-40">
            
            {showPrev && (
                <Button 
                    variant="ghost" 
                    onClick={onPrev}
                    className="text-slate-400 hover:text-slate-800 hover:bg-slate-100 font-bold text-base h-12 px-6 rounded-xl"
                >
                    <ArrowLeft className="mr-2" size={20} /> Sebelumnya
                </Button>
            )}

            {showNext && (
                <Button 
                    onClick={onNext}
                    disabled={isNextDisabled}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white font-black text-lg h-14 px-8 rounded-2xl shadow-[0px_4px_0px_#22d3ee] active:translate-y-1 active:shadow-none transition-all disabled:opacity-50 disabled:shadow-none"
                >
                    {nextLabel || "Selanjutnya"} <ArrowRight className="ml-2" size={24} strokeWidth={3} />
                </Button>
            )}
            
        </div>
    );
}