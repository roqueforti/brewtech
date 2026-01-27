import { CheckCircle2, Circle, Lock } from "lucide-react";

export default function ModulSidebar({ 
    moduleTitle, steps, viewMode, currentStepIndex, progress, isPreview, onNavigate 
}: any) {
    const isCompleted = (idx: number) => isPreview ? idx < currentStepIndex : false; // Mock logic

    return (
        <div className="flex flex-col h-full">
            <div className="px-6 pb-6 border-b border-slate-100">
                <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest bg-cyan-50 px-2 py-1 rounded">
                    Modul Pelatihan
                </span>
                <h2 className="text-xl font-black text-slate-800 mt-2 leading-tight line-clamp-2">
                    {moduleTitle}
                </h2>
                {isPreview && (
                    <div className="mt-3 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500 w-[20%]"></div>
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-hide">
                <SidebarItem 
                    label="Evaluasi Awal"
                    title="Pre-Test"
                    active={viewMode === 'pre_test'}
                    completed={viewMode === 'pre_result' || viewMode === 'material'}
                    onClick={() => onNavigate('pre_test')}
                />

                <div className="py-4">
                    <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Materi Praktikum</p>
                    <SidebarItem 
                        label="Persiapan"
                        title="Alat & Bahan"
                        active={viewMode === 'tools'}
                        completed={viewMode === 'material'}
                        onClick={() => onNavigate('tools')}
                    />
                    
                    {steps.map((step: any, idx: number) => (
                        <button 
                            key={idx}
                            onClick={() => onNavigate('material', idx)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left group
                                ${viewMode === 'material' && currentStepIndex === idx 
                                    ? 'bg-cyan-50 text-cyan-700 font-bold' 
                                    : 'text-slate-600 hover:bg-slate-50'
                                }
                            `}
                        >
                            <div className={`w-2 h-2 rounded-full shrink-0 ${viewMode === 'material' && currentStepIndex === idx ? 'bg-cyan-500' : 'bg-slate-300'}`}></div>
                            <span className="text-sm truncate line-clamp-1">{step.title}</span>
                        </button>
                    ))}
                </div>

                <SidebarItem 
                    label="Evaluasi Akhir"
                    title="Post-Test"
                    active={viewMode === 'post_test'}
                    completed={false}
                    onClick={() => onNavigate('post_test')}
                />
            </div>
        </div>
    );
}

const SidebarItem = ({ label, title, active, completed, onClick }: any) => (
    <button 
        onClick={onClick}
        className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between group
            ${active 
                ? 'border-cyan-500 bg-white shadow-lg shadow-cyan-100 ring-1 ring-cyan-500' 
                : 'border-transparent hover:bg-slate-50'
            }
        `}
    >
        <div className="text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">{label}</span>
            <span className={`text-sm font-bold ${active ? 'text-cyan-700' : 'text-slate-700'}`}>{title}</span>
        </div>
        {completed ? <CheckCircle2 size={20} className="text-green-500"/> : (active ? <Circle size={20} className="text-cyan-500"/> : <Lock size={18} className="text-slate-300"/>)}
    </button>
);