import { Head, Link } from '@inertiajs/react';
import SidebarPengajar from '@/Components/SidebarPengajar';
import HeaderPengajar from '@/Components/HeaderPengajar';
import { 
    CheckCircle2, XCircle, ArrowLeft, RefreshCcw, 
    BookOpen, User
} from 'lucide-react';

interface ReviewItem {
    id: number;
    question: string;
    media_url?: string | null;
    user_answer_text: string;
    correct_answer_text: string;
    is_correct: boolean;
}

interface Props {
    kelas_id: number;
    student: { id: number; name: string; avatar: string };
    module: { id: number; title: string };
    score: number;
    total_questions: number;
    correct_count: number;
    wrong_count: number;
    review_data: ReviewItem[];
    type: string;
}

export default function StudentResult({ kelas_id, student, module, score, total_questions, correct_count, wrong_count, review_data, type }: Props) {
    const isPassed = score >= 70;
    const gradeColor = isPassed ? 'bg-green-500' : 'bg-orange-500';

    return (
        <div className="flex min-h-screen bg-background font-sans text-foreground">
            <Head title={`Hasil ${student.name} - ${module.title}`} />
            <div className="hidden md:block"><SidebarPengajar /></div>

            <main className="flex-1 w-full flex flex-col bg-[#FAFAF9] h-screen overflow-hidden">
                <HeaderPengajar />

                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-4xl mx-auto pb-20">
                        
                        {/* HEADER & NAVIGASI */}
                        <div className="mb-8">
                            <Link href={`/pengajar/kelas/${kelas_id}`} className="inline-flex items-center text-slate-400 hover:text-primary mb-4 font-bold transition-colors text-xs uppercase tracking-widest">
                                <ArrowLeft size={16} className="mr-2" /> Kembali ke Kelas
                            </Link>
                            
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                                        <span className="bg-slate-200 px-3 py-1 rounded-lg text-sm text-slate-600 font-bold uppercase tracking-wider">{type}</span>
                                        {module.title}
                                    </h1>
                                    <div className="flex items-center gap-2 mt-2 text-slate-500 font-medium">
                                        <User size={16}/> Hasil Pengerjaan: <strong className="text-slate-800">{student.name}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SCORE CARD */}
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden relative mb-8">
                            <div className={`absolute top-0 left-0 w-full h-2 ${gradeColor}`}></div>
                            <div className="p-8 flex flex-col md:flex-row items-center gap-10">
                                {/* Lingkaran Skor */}
                                <div className="relative shrink-0">
                                    <div className={`w-32 h-32 rounded-full flex items-center justify-center text-white text-4xl font-black shadow-lg ${gradeColor} ring-4 ring-slate-50`}>
                                        {Math.round(score)}
                                    </div>
                                </div>

                                {/* Statistik */}
                                <div className="flex-1 w-full grid grid-cols-3 gap-4 text-center">
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Total Soal</span>
                                        <span className="text-xl font-black text-slate-700 flex items-center justify-center gap-2">
                                            <BookOpen size={18}/> {total_questions}
                                        </span>
                                    </div>
                                    <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                                        <span className="text-[10px] font-black text-green-600 uppercase tracking-widest block mb-1">Benar</span>
                                        <span className="text-xl font-black text-green-700 flex items-center justify-center gap-2">
                                            <CheckCircle2 size={18}/> {correct_count}
                                        </span>
                                    </div>
                                    <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                                        <span className="text-[10px] font-black text-red-600 uppercase tracking-widest block mb-1">Salah</span>
                                        <span className="text-xl font-black text-red-700 flex items-center justify-center gap-2">
                                            <XCircle size={18}/> {wrong_count}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* LIST JAWABAN */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <RefreshCcw size={18} className="text-slate-400"/>
                                <h3 className="font-bold text-slate-700">Detail Jawaban Siswa</h3>
                            </div>

                            {review_data.map((item, idx) => (
                                <div key={item.id} className={`bg-white rounded-2xl p-6 border-2 transition-all ${item.is_correct ? 'border-slate-100' : 'border-red-100 bg-red-50/10'}`}>
                                    <div className="flex gap-4">
                                        <span className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-lg font-black text-sm ${item.is_correct ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                            {idx + 1}
                                        </span>
                                        <div className="flex-1 space-y-4">
                                            <p className="font-bold text-slate-800 leading-snug">{item.question}</p>
                                            
                                            {item.media_url && (
                                                <div className="rounded-xl overflow-hidden border border-slate-100 max-w-sm">
                                                    {item.media_url.includes('video') ? 
                                                        <video src={item.media_url} controls className="w-full" /> : 
                                                        <img src={item.media_url} alt="Soal" className="w-full object-cover" />
                                                    }
                                                </div>
                                            )}

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                <div className={`p-3 rounded-xl border-l-4 ${item.is_correct ? 'bg-slate-50 border-slate-300' : 'bg-red-50 border-red-400'}`}>
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Jawaban Siswa</span>
                                                    <p className={`font-bold ${item.is_correct ? 'text-slate-700' : 'text-red-700'}`}>{item.user_answer_text}</p>
                                                </div>
                                                
                                                {!item.is_correct && (
                                                    <div className="p-3 rounded-xl bg-green-50 border-l-4 border-green-500">
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-green-600/70 block mb-1">Kunci Jawaban</span>
                                                        <p className="font-bold text-green-800">{item.correct_answer_text}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="shrink-0 pt-1">
                                            {item.is_correct ? <CheckCircle2 className="text-green-500" size={24} /> : <XCircle className="text-red-500" size={24} />}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}