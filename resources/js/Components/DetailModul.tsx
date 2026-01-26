import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SidebarPengajar from '@/Components/SidebarPengajar';
import HeaderPengajar from '@/Components/HeaderPengajar';
import { 
    ArrowLeft, Save, Eye, FileText, List, Layers, HelpCircle, 
    Image as ImageIcon, Trash2, Plus, X
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Card, CardContent } from '@/Components/ui/card';
import { Label } from '@/Components/ui/label';
import { toast } from 'sonner';

// --- TYPES ---
interface Question {
    id?: number;
    question: string;
    media_url?: string;
    media_type?: 'image' | 'video';
    options: string[];
    correct_option: number;
}

interface ModuleData {
    id: number;
    title: string;
    description: string;
    emoji: string;
    pre_test_questions: Question[];
    post_test_questions: Question[];
    steps: any[];
}

interface Props {
    auth: any;
    module: ModuleData;
}

// --- SUB-COMPONENT: Question Editor ---
const QuestionEditor = ({ question, index, onChange, onDelete }: any) => {
    return (
        <Card className="border border-slate-200 rounded-2xl mb-6 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-slate-50 border-b border-slate-100 p-4 flex justify-between items-center">
                <div className="flex items-center gap-2 font-bold text-slate-700">
                    <span className="bg-white border border-slate-200 w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold text-slate-500 shadow-sm">
                        {index + 1}
                    </span>
                    <span className="text-sm">Soal Pertanyaan</span>
                </div>
                <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-500 hover:bg-red-50 hover:text-red-600 h-8 px-3 rounded-lg text-xs font-medium">
                    <Trash2 size={14} className="mr-1.5"/> Hapus
                </Button>
            </div>
            
            <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pertanyaan Utama</Label>
                    <Input 
                        value={question.question} 
                        onChange={(e) => onChange('question', e.target.value)}
                        placeholder="Tulis pertanyaan di sini..." 
                        className="font-medium border-slate-200 focus:border-orange-500 focus:ring-orange-500/20"
                    />
                </div>

                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer group relative">
                    {question.media_url ? (
                        <div className="relative inline-block">
                            <img src={question.media_url} alt="Media Soal" className="max-h-64 rounded-lg shadow-sm" />
                            <Button 
                                size="icon" variant="destructive" 
                                className="absolute -top-3 -right-3 h-8 w-8 rounded-full shadow-md hover:scale-110 transition-transform"
                                onClick={(e) => { e.stopPropagation(); onChange('media_url', null); }}
                            >
                                <X size={16} />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400 py-2">
                            <div className="bg-white p-3 rounded-full shadow-sm mb-3 border border-slate-100 group-hover:scale-110 transition-transform">
                                <ImageIcon size={24} className="text-slate-300 group-hover:text-orange-500 transition-colors" />
                            </div>
                            <span className="text-sm font-medium text-slate-500 group-hover:text-slate-700 transition-colors">Klik untuk upload gambar/video</span>
                            <span className="text-xs mt-1 text-slate-400">JPG, PNG, MP4 (Max 5MB)</span>
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Opsi Jawaban</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {question.options.map((opt: string, i: number) => (
                            <div key={i} className={`relative flex items-center gap-3 p-3 rounded-xl border-2 transition-all group
                                ${question.correct_option === i ? 'border-green-500 bg-green-50/30' : 'border-slate-200 bg-white hover:border-slate-300'}
                            `}>
                                <button 
                                    className={`w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center font-bold text-sm transition-all border-2
                                        ${question.correct_option === i ? 'bg-green-500 border-green-500 text-white shadow-md transform scale-105' : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-white'}
                                    `}
                                    onClick={() => onChange('correct_option', i)}
                                >
                                    {String.fromCharCode(65 + i)}
                                </button>
                                
                                <Input 
                                    value={opt} 
                                    onChange={(e) => {
                                        const newOptions = [...question.options];
                                        newOptions[i] = e.target.value;
                                        onChange('options', newOptions);
                                    }}
                                    className="border-none shadow-none focus-visible:ring-0 bg-transparent h-auto py-0 px-0 font-medium text-slate-700 placeholder:text-slate-400 w-full"
                                    placeholder={`Jawaban ${String.fromCharCode(65 + i)}`}
                                />

                                <Button variant="ghost" size="icon" className="text-slate-300 hover:text-slate-600 h-8 w-8 rounded-lg hover:bg-slate-100">
                                    <ImageIcon size={16} />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

// --- MAIN COMPONENT ---
export default function Edit({ auth, module }: Props) {
    const [activeTab, setActiveTab] = useState('pre-test');

    const { data, setData, put, processing } = useForm({
        title: module.title || '',
        description: module.description || '',
        pre_test_questions: module.pre_test_questions || [],
        post_test_questions: module.post_test_questions || [],
    });

    const addQuestion = (type: 'pre_test_questions' | 'post_test_questions') => {
        const newQuestion: Question = {
            question: '',
            options: ['', '', '', ''],
            correct_option: 0
        };
        setData(type, [...data[type], newQuestion]);
    };

    const updateQuestion = (type: 'pre_test_questions' | 'post_test_questions', index: number, field: string, value: any) => {
        const updatedQuestions = [...data[type]];
        updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
        setData(type, updatedQuestions);
    };

    const deleteQuestion = (type: 'pre_test_questions' | 'post_test_questions', index: number) => {
        const updatedQuestions = data[type].filter((_, i) => i !== index);
        setData(type, updatedQuestions);
    };

    const handleSave = () => {
        put(`/pengajar/modul/${module.id}`, {
            onSuccess: () => toast.success("Perubahan modul berhasil disimpan!")
        });
    };

    return (
        // ✅ LAYOUT FIX: Gunakan padding-left (pl-72) karena sidebar Anda lebarnya 72 (w-72)
        <div className="flex h-screen bg-[#FAFAF9] font-sans text-foreground overflow-hidden md:pl-72 transition-all duration-300">
            <Head title={`Edit Modul - ${data.title}`} />
            
            {/* 1. SIDEBAR UTAMA (Fixed Left) */}
            {/* Saya set width ke w-72 agar konsisten dengan komponen aslinya */}
            <aside className="hidden md:block w-72 fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 shadow-sm">
                <SidebarPengajar />
            </aside>

            {/* 2. WRAPPER UTAMA KONTEN */}
            <div className="flex-1 flex flex-col min-h-screen relative w-full">
                
                {/* 3. HEADER (Sticky Top) */}
                <header className="sticky top-0 z-40 bg-[#FAFAF9]/95 backdrop-blur-md border-b border-slate-200/50 w-full supports-[backdrop-filter]:bg-[#FAFAF9]/60">
                     <HeaderPengajar />
                </header>

                {/* 4. AREA KERJA (Navigasi Modul + Form) */}
                <div className="flex-1 flex overflow-hidden">
                    
                    {/* A. NAVIGASI STRUKTUR MODUL (Sidebar Kedua) */}
                    <nav className="w-64 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col hidden lg:flex h-full overflow-y-auto">
                        <div className="p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
                            <Link href="/pengajar/modul" className="flex items-center text-slate-400 hover:text-orange-600 text-xs font-bold transition-colors mb-3 uppercase tracking-wider group">
                                <ArrowLeft size={14} className="mr-1 group-hover:-translate-x-1 transition-transform"/> Kembali
                            </Link>
                            <h2 className="font-black text-xl text-slate-800 leading-tight">Struktur Materi</h2>
                        </div>
                        
                        <div className="p-4 space-y-1.5 flex-1">
                            <button onClick={() => setActiveTab('info')} className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 font-bold transition-all text-sm ${activeTab === 'info' ? 'bg-orange-50 text-orange-600 ring-1 ring-orange-200 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}>
                                <FileText size={18} className={activeTab === 'info' ? 'text-orange-500' : 'text-slate-400'} /> Informasi Umum
                            </button>
                            <button onClick={() => setActiveTab('pre-test')} className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 font-bold transition-all text-sm ${activeTab === 'pre-test' ? 'bg-orange-50 text-orange-600 ring-1 ring-orange-200 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}>
                                <HelpCircle size={18} className={activeTab === 'pre-test' ? 'text-orange-500' : 'text-slate-400'} /> Pre-Test ({data.pre_test_questions.length})
                            </button>
                            <button onClick={() => setActiveTab('materi')} className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 font-bold transition-all text-sm ${activeTab === 'materi' ? 'bg-orange-50 text-orange-600 ring-1 ring-orange-200 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}>
                                <Layers size={18} className={activeTab === 'materi' ? 'text-orange-500' : 'text-slate-400'} /> Praktikum
                            </button>
                            <button onClick={() => setActiveTab('post-test')} className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 font-bold transition-all text-sm ${activeTab === 'post-test' ? 'bg-orange-50 text-orange-600 ring-1 ring-orange-200 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}>
                                <List size={18} className={activeTab === 'post-test' ? 'text-orange-500' : 'text-slate-400'} /> Post-Test ({data.post_test_questions.length})
                            </button>
                        </div>
                    </nav>

                    {/* B. FORM KONTEN (Area Scrollable) */}
                    <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#FAFAF9] scrollbar-hide">
                        <div className="max-w-3xl mx-auto w-full pb-32">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                                <div>
                                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                                        {activeTab === 'info' && 'Informasi Umum'}
                                        {activeTab === 'pre-test' && 'Pre-Test'}
                                        {activeTab === 'materi' && 'Materi Praktikum'}
                                        {activeTab === 'post-test' && 'Post-Test'}
                                    </h1>
                                    <p className="text-slate-500 mt-1 font-medium text-sm">Edit konten modul dan materi pembelajaran.</p>
                                </div>
                                <div className="flex gap-3">
                                    <Button variant="outline" className="gap-2 h-10 border-slate-300 text-slate-600 hover:text-slate-900 rounded-xl font-bold bg-white">
                                        <Eye size={16}/> Preview
                                    </Button>
                                    <Button onClick={handleSave} disabled={processing} className="gap-2 h-10 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 active:scale-95 transition-all">
                                        <Save size={16}/> Simpan
                                    </Button>
                                </div>
                            </div>

                            {/* --- FORM CONTENT --- */}
                            
                            {activeTab === 'info' && (
                                <Card className="border border-slate-200 rounded-[2rem] shadow-sm bg-white p-8 space-y-6">
                                    <div className="space-y-3">
                                        <Label className="text-sm font-bold text-slate-700">Judul Modul</Label>
                                        <Input value={data.title} onChange={e => setData('title', e.target.value)} className="h-12 text-lg font-bold border-slate-200 focus:border-orange-500" />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-sm font-bold text-slate-700">Deskripsi Singkat</Label>
                                        <Textarea value={data.description} onChange={e => setData('description', e.target.value)} className="min-h-[120px] text-base border-slate-200 p-4 focus:border-orange-500" />
                                    </div>
                                </Card>
                            )}

                            {activeTab === 'pre-test' && (
                                <div className="space-y-6">
                                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3 text-blue-700 text-sm font-medium">
                                        <HelpCircle size={20} className="mt-0.5 flex-shrink-0"/>
                                        <p>Pre-test digunakan untuk mengukur kemampuan awal siswa sebelum materi dimulai.</p>
                                    </div>
                                    {data.pre_test_questions.map((q, idx) => (
                                        <QuestionEditor key={idx} index={idx} question={q} 
                                            onChange={(field: string, val: any) => updateQuestion('pre_test_questions', idx, field, val)}
                                            onDelete={() => deleteQuestion('pre_test_questions', idx)}
                                        />
                                    ))}
                                    <Button onClick={() => addQuestion('pre_test_questions')} variant="outline" className="w-full h-14 border-2 border-dashed border-slate-300 text-slate-500 hover:border-orange-400 hover:text-orange-600 hover:bg-orange-50 rounded-2xl gap-2 text-base font-bold transition-all bg-white">
                                        <Plus size={20}/> Tambah Pertanyaan Pre-Test
                                    </Button>
                                </div>
                            )}

                            {activeTab === 'post-test' && (
                                <div className="space-y-6">
                                    <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 flex items-start gap-3 text-purple-700 text-sm font-medium">
                                        <List size={20} className="mt-0.5 flex-shrink-0"/>
                                        <p>Post-test dilakukan setelah materi selesai untuk evaluasi akhir.</p>
                                    </div>
                                    {data.post_test_questions.map((q, idx) => (
                                        <QuestionEditor key={idx} index={idx} question={q} 
                                            onChange={(field: string, val: any) => updateQuestion('post_test_questions', idx, field, val)}
                                            onDelete={() => deleteQuestion('post_test_questions', idx)}
                                        />
                                    ))}
                                    <Button onClick={() => addQuestion('post_test_questions')} variant="outline" className="w-full h-14 border-2 border-dashed border-slate-300 text-slate-500 hover:border-orange-400 hover:text-orange-600 hover:bg-orange-50 rounded-2xl gap-2 text-base font-bold transition-all bg-white">
                                        <Plus size={20}/> Tambah Pertanyaan Post-Test
                                    </Button>
                                </div>
                            )}

                            {activeTab === 'materi' && (
                                <div className="text-center py-24 bg-white border-2 border-dashed border-slate-200 rounded-[2rem]">
                                    <Layers className="mx-auto h-16 w-16 text-slate-200 mb-4"/>
                                    <p className="text-slate-500 font-bold text-lg">Area Editor Materi Praktikum</p>
                                    <p className="text-slate-400 text-sm mt-1">Langkah-langkah pembelajaran akan diatur di sini.</p>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}