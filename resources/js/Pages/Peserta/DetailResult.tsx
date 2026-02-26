import { Head, Link } from '@inertiajs/react';
import { 
    CheckCircle2, XCircle, ArrowLeft, RefreshCcw, 
    Award, BookOpen, AlertCircle 
} from 'lucide-react';
// import HeaderPeserta from '@/Components/HeaderPeserta'; // Asumsi punya header ini
import SidebarPeserta from '@/Components/SidebarPeserta'; // Asumsi punya sidebar

interface ReviewItem {
    id: number;
    question: string;
    media_url?: string | null;
    user_answer_text: string;   // Teks jawaban yang dipilih siswa
    correct_answer_text: string; // Teks kunci jawaban
    is_correct: boolean;
}

interface Props {
    auth: any;
    module: {
        id: number;
        title: string;
    };
    score: number;
    total_questions: number;
    correct_count: number;
    wrong_count: number;
    review_data: ReviewItem[];
    type: 'Pre-Test' | 'Post-Test';
}

export default function DetailResult({ auth, module, score, total_questions, correct_count, wrong_count, review_data, type }: Props) {
    
    // Tentukan warna & pesan berdasarkan skor
    const isPassed = score >= 70;
    const gradeColor = isPassed ? 'bg-green-500' : 'bg-orange-500';
    const gradeText = isPassed ? 'Kompeten! 🎉' : 'Belum Kompeten 💪';
    const gradeDesc = isPassed 
        ? 'Selamat! Kamu telah menguasai materi ini dengan baik.' 
        : 'Jangan menyerah! Pelajari lagi materinya dan coba lagi.';

    return (
        <div className="flex h-screen bg-[#FAFAF9] font-sans text-slate-600 overflow-hidden">
            <Head title={`Hasil ${type} - ${module.title}`} />
            
            {/* Sidebar (Optional, sesuaikan dengan layout utamamu) */}
            <div className="hidden md:block w-72 fixed inset-y-0 left-0 z-50">
                <SidebarPeserta user={auth.user} />
            </div>

            <div className="flex-1 flex flex-col min-h-screen w-full md:pl-72">
                <HeaderPeserta user={auth.user} title="Hasil Evaluasi" />

                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-4xl mx-auto space-y-8">
                        
                        {/* 1. HEADER & TOMBOL KEMBALI */}
                        <div className="flex items-center gap-4">
                            <Link href={`/peserta/modul/${module.id}`} className="p-2 bg-white rounded-xl border hover:bg-slate-50 transition-colors">
                                <ArrowLeft size={20} />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-black text-slate-800">{module.title}</h1>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{type} Result</p>
                            </div>
                        </div>

                        {/* 2. SCORE CARD (Rapor Nilai) */}
                        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border-4 border-white relative">
                            <div className={`absolute top-0 left-0 w-full h-2 ${gradeColor}`}></div>
                            
                            <div className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-10">
                                {/* Lingkaran Skor */}
                                <div className="relative shrink-0">
                                    <div className={`w-40 h-40 rounded-full flex items-center justify-center text-white text-5xl font-black shadow-2xl ${gradeColor} ring-8 ring-slate-100`}>
                                        {Math.round(score)}
                                    </div>
                                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white px-4 py-1 rounded-full shadow-md border text-xs font-bold uppercase tracking-widest text-slate-500 whitespace-nowrap">
                                        Skor Akhir
                                    </div>
                                </div>

                                {/* Detail Statistik */}
                                <div className="flex-1 text-center md:text-left space-y-6">
                                    <div>
                                        <h2 className={`text-3xl font-black mb-2 ${isPassed ? 'text-green-600' : 'text-orange-600'}`}>
                                            {gradeText}
                                        </h2>
                                        <p className="text-slate-500 font-medium leading-relaxed">
                                            {gradeDesc}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center md:items-start">
                                            <span className="text-xs font-bold text-slate-400 uppercase">Total Soal</span>
                                            <span className="text-xl font-black text-slate-700 flex items-center gap-2">
                                                <BookOpen size={18}/> {total_questions}
                                            </span>
                                        </div>
                                        <div className="p-4 bg-green-50 rounded-2xl border border-green-100 flex flex-col items-center md:items-start">
                                            <span className="text-xs font-bold text-green-600 uppercase">Benar</span>
                                            <span className="text-xl font-black text-green-700 flex items-center gap-2">
                                                <CheckCircle2 size={18}/> {correct_count}
                                            </span>
                                        </div>
                                        <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex flex-col items-center md:items-start">
                                            <span className="text-xs font-bold text-red-600 uppercase">Salah</span>
                                            <span className="text-xl font-black text-red-700 flex items-center gap-2">
                                                <XCircle size={18}/> {wrong_count}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. PEMBAHASAN SOAL (Accordion List) */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 px-2">
                                <div className="p-2 bg-cyan-100 text-cyan-600 rounded-lg"><RefreshCcw size={20}/></div>
                                <h3 className="text-lg font-black text-slate-800">Pembahasan Jawaban</h3>
                            </div>

                            {review_data.map((item, idx) => (
                                <div key={item.id} className={`bg-white rounded-3xl p-6 border-2 transition-all ${item.is_correct ? 'border-slate-100' : 'border-red-100 shadow-sm'}`}>
                                    
                                    {/* Judul Soal */}
                                    <div className="flex gap-4 mb-4">
                                        <span className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-lg font-black text-sm ${item.is_correct ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                            {idx + 1}
                                        </span>
                                        <div className="space-y-3 flex-1">
                                            <p className="font-bold text-slate-700 text-lg leading-snug">
                                                {item.question}
                                            </p>
                                            {item.media_url && (
                                                <div className="rounded-xl overflow-hidden border border-slate-100 max-w-sm">
                                                    {item.media_url.includes('video') ? (
                                                        <video src={item.media_url} controls className="w-full" />
                                                    ) : (
                                                        <img src={item.media_url} alt="Soal" className="w-full object-cover" />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div className="shrink-0">
                                            {item.is_correct 
                                                ? <CheckCircle2 className="text-green-500" size={28} />
                                                : <XCircle className="text-red-500" size={28} />
                                            }
                                        </div>
                                    </div>

                                    {/* Perbandingan Jawaban */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100 border-dashed">
                                        
                                        {/* Jawaban Siswa */}
                                        <div className={`p-4 rounded-xl border-l-4 ${item.is_correct ? 'bg-slate-50 border-slate-300' : 'bg-red-50 border-red-400'}`}>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 block">
                                                Jawaban Kamu
                                            </span>
                                            <p className={`font-bold ${item.is_correct ? 'text-slate-700' : 'text-red-700'}`}>
                                                {item.user_answer_text || "- Tidak Dijawab -"}
                                            </p>
                                        </div>

                                        {/* Kunci Jawaban (Hanya muncul jika salah, atau selalu muncul biar jelas) */}
                                        {!item.is_correct && (
                                            <div className="p-4 rounded-xl bg-green-50 border-l-4 border-green-500">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-green-600/70 mb-1 block">
                                                    Kunci Jawaban
                                                </span>
                                                <p className="font-bold text-green-800">
                                                    {item.correct_answer_text}
                                                </p>
                                            </div>
                                        )}
                                        
                                        {/* Jika Benar, tampilkan pesan validasi */}
                                        {item.is_correct && (
                                            <div className="p-4 rounded-xl bg-green-50/50 border border-green-100 flex items-center gap-2 text-green-700 font-medium">
                                                <Award size={18}/> Jawaban kamu sudah tepat!
                                            </div>
                                        )}

                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 4. FOOTER ACTION */}
                        <div className="pt-8 pb-20 flex justify-center">
                            <Link 
                                href={`/peserta/modul/${module.id}`}
                                className="bg-cyan-500 hover:bg-cyan-600 text-white font-black py-4 px-10 rounded-2xl shadow-lg shadow-cyan-200 transition-all transform hover:-translate-y-1 active:translate-y-0 active:shadow-none flex items-center gap-3"
                            >
                                <ArrowLeft strokeWidth={3} size={20} /> Kembali ke Materi
                            </Link>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}