import { Link } from "@inertiajs/react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

interface Props {
    moduleTitle: string;
    steps: any[];
    viewMode: string;
    currentStepIndex: number;
    progress: any;
    isPreview: boolean;
    onNavigate: (mode: string, stepIndex?: number) => void;
}

export default function ModulSidebar({ 
    moduleTitle, steps, viewMode, currentStepIndex, progress, isPreview, onNavigate 
}: Props) {
    const canAccessMaterial = isPreview || progress?.pretest_score != null || viewMode === 'pre_result';
    const isStepActive = (idx: number) => viewMode === 'material' && currentStepIndex === idx;
    const isStepDone = (idx: number) => viewMode.includes('post') || (viewMode === 'material' && idx < currentStepIndex);

    return (
        <div className="flex flex-col h-full bg-white border-r-2 border-slate-200 w-full">
            {/* Header Sidebar */}
            <div className="p-6 border-b-2 border-slate-100 shrink-0 bg-white">
                <Link href="/peserta/dashboard" className="flex items-center text-slate-400 hover:text-orange-500 mb-3 text-xs font-bold uppercase tracking-wider transition-colors">
                    <ArrowLeft size={14} className="mr-1" /> Dashboard
                </Link>
                <h2 className="font-black text-slate-800 text-lg leading-tight truncate" title={moduleTitle}>
                    {moduleTitle}
                </h2>
                
                {/* Progress Bar */}
                <div className="mt-4">
                    <div className="flex justify-between text-[10px] uppercase font-extrabold text-slate-400 mb-1.5">
                        <span>Progres Belajar</span>
                        <span>{viewMode.includes('post') ? '100%' : viewMode === 'material' ? `${Math.round(((currentStepIndex + 1) / steps.length) * 80)}%` : '10%'}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 transition-all duration-700 ease-out rounded-full" 
                             style={{width: viewMode.includes('post') ? '100%' : viewMode === 'material' ? `${((currentStepIndex + 1) / steps.length) * 80}%` : '10%'}}>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* List Navigasi */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
                
                {/* 1. PRE-TEST */}
                <div>
                    <div className="px-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Tahap 1: Evaluasi Awal</div>
                    <button 
                        onClick={() => onNavigate('pre_test')}
                        disabled={!isPreview && progress?.pretest_score != null} 
                        className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold border-2 transition-all
                        ${viewMode.includes('pre') 
                            ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm' 
                            : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-50'}
                    `}>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 text-xs
                            ${(progress?.pretest_score != null) ? 'bg-green-500 border-green-500 text-white' : 'border-current bg-white'}`}>
                            {(progress?.pretest_score != null) ? <CheckCircle2 size={16}/> : '1'}
                        </div>
                        Pre-Test
                    </button>
                </div>

                {/* 2. MATERI */}
                <div>
                    <div className="px-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Tahap 2: Materi Inti</div>
                    <div className="space-y-1.5">
                        {steps.map((step, index) => (
                            <button key={step.id} 
                                disabled={!canAccessMaterial}
                                onClick={() => onNavigate('material', index)}
                                className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-all border border-transparent
                                    ${isStepActive(index) ? 'bg-orange-50 text-orange-700 font-bold border-orange-100' : 'text-slate-600 hover:bg-slate-50'}
                                    ${!canAccessMaterial ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                            >
                                <div className={`w-2 h-2 flex-shrink-0 rounded-full 
                                    ${isStepActive(index) ? 'bg-orange-500 ring-2 ring-orange-200' : isStepDone(index) ? 'bg-green-500' : 'bg-slate-300'}`}>
                                </div>
                                <span className="text-sm leading-snug line-clamp-1">{step.title}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 3. POST-TEST */}
                <div>
                    <div className="px-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Tahap 3: Evaluasi Akhir</div>
                    <button 
                        onClick={() => onNavigate('post_test')}
                        disabled={!canAccessMaterial} 
                        className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-bold border-2 transition-all
                        ${viewMode.includes('post') 
                            ? 'bg-purple-50 border-purple-200 text-purple-700 shadow-sm' 
                            : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-50'}
                        ${!canAccessMaterial ? 'opacity-50 cursor-not-allowed' : ''}
                    `}>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 text-xs
                            ${(progress?.posttest_score != null) ? 'bg-green-500 border-green-500 text-white' : 'border-current bg-white'}`}>
                            {(progress?.posttest_score != null) ? <CheckCircle2 size={16}/> : '3'}
                        </div>
                        Post-Test
                    </button>
                </div>
            </div>
        </div>
    );
}