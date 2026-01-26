import { useState, useRef, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SidebarPengajar from '@/Components/SidebarPengajar';
import HeaderPengajar from '@/Components/HeaderPengajar';
import { 
    ArrowLeft, Save, Eye, FileText, List, Layers, HelpCircle, 
    Image as ImageIcon, Trash2, Plus, X, GripVertical, CheckCircle2,
    Copy, Unlock, Lock
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Card, CardContent } from '@/Components/ui/card';
import { Label } from '@/Components/ui/label';
import { Switch } from "@/Components/ui/switch"; 
import { toast } from 'sonner';

// --- TYPES ---
interface Option {
    text: string;
    media_url?: string | null;
}

interface Question {
    id?: number;
    question: string;
    media_url?: string | null;
    options: Option[];
    correct_option: number;
}

interface Step {
    id?: number;
    title: string;
    description: string;
    media_url?: string | null;
}

interface ModuleData {
    id: number;
    title: string;
    description: string;
    pre_test_questions: Question[];
    post_test_questions: Question[];
    steps: Step[];
}

interface Props {
    auth: any;
    module: ModuleData;
}

// --- HELPER: MEDIA UPLOADER ---
const MediaUploader = ({ mediaUrl, onUpload, onRemove, compact = false, label = "Upload Media", disabled = false }: any) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const fakeUrl = URL.createObjectURL(file); 
            onUpload(fakeUrl); 
        }
    };

    if (mediaUrl) {
        return (
            <div className={`relative group border border-slate-200 rounded-xl overflow-hidden bg-slate-50 ${compact ? 'w-16 h-16 flex-shrink-0' : 'w-full h-full min-h-[200px]'}`}>
                <img src={mediaUrl} alt="Media" className="w-full h-full object-cover" />
                {!disabled && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                            onClick={(e) => { e.stopPropagation(); onRemove(); }}
                            className="bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600 hover:scale-110 transition-all"
                            title="Hapus Media"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={handleFileChange} disabled={disabled} />
            {compact ? (
                <Button 
                    variant="ghost" size="icon" 
                    className="text-slate-400 border border-dashed border-slate-300 rounded-xl hover:text-orange-500 hover:bg-orange-50 hover:border-orange-300 h-16 w-16"
                    onClick={() => !disabled && fileInputRef.current?.click()} 
                    title="Tambah Gambar"
                    disabled={disabled}
                >
                    <ImageIcon size={20} />
                </Button>
            ) : (
                <div 
                    onClick={() => !disabled && fileInputRef.current?.click()}
                    className={`border-2 border-dashed border-slate-200 rounded-xl h-full min-h-[200px] flex flex-col items-center justify-center text-center transition-all group p-6 ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-50' : 'cursor-pointer hover:bg-slate-50 hover:border-orange-300'}`}
                >
                    <div className="bg-white p-4 rounded-full shadow-sm border border-slate-100 group-hover:scale-110 group-hover:shadow-md transition-all mb-3">
                        <ImageIcon size={28} className="text-slate-300 group-hover:text-orange-500 transition-colors" />
                    </div>
                    <span className="text-sm font-bold text-slate-500 group-hover:text-orange-600 transition-colors">{label}</span>
                    <span className="text-xs text-slate-400 mt-1">{disabled ? 'Upload dinonaktifkan' : 'Klik untuk upload'}</span>
                </div>
            )}
        </>
    );
};

// --- SUB-COMPONENT: QUESTION EDITOR (Updated with Disabled Prop) ---
const QuestionEditor = ({ question, index, onChange, onDelete, disabled = false }: any) => {
    return (
        <Card className={`border border-slate-200 rounded-3xl mb-8 overflow-hidden bg-white shadow-sm hover:shadow-md transition-all group ${disabled ? 'opacity-80 bg-slate-50/50' : ''}`}>
            {/* Header Card */}
            <div className="bg-slate-50/80 border-b border-slate-100 p-4 px-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <span className={`border w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black shadow-sm ${disabled ? 'bg-slate-200 text-slate-500 border-slate-300' : 'bg-white text-slate-600 border-slate-200'}`}>
                        {index + 1}
                    </span>
                    <span className="font-bold text-slate-700 text-sm">
                        {disabled ? 'Soal (Tersinkronisasi)' : 'Soal Pengetahuan (Hard Skill)'}
                    </span>
                </div>

                {!disabled && (
                    <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg px-3">
                        <Trash2 size={16} className="mr-2"/> Hapus
                    </Button>
                )}
                {disabled && <Lock size={16} className="text-slate-400"/>}
            </div>
            
            <CardContent className="p-6 space-y-8">
                {/* GRID LAYOUT: SOAL & MEDIA */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                    {/* Kolom Kiri: Input Teks */}
                    <div className="md:col-span-8 flex flex-col gap-2">
                        <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Pertanyaan Utama</Label>
                        <Textarea 
                            value={question.question} 
                            onChange={(e) => onChange('question', e.target.value)}
                            placeholder="Tulis pertanyaan di sini..." 
                            disabled={disabled}
                            className="flex-1 min-h-[160px] text-lg font-medium p-4 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all resize-none disabled:cursor-not-allowed disabled:text-slate-500"
                        />
                    </div>
                    {/* Kolom Kanan: Media Upload */}
                    <div className="md:col-span-4 flex flex-col gap-2">
                        <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Media Visual (Opsional)</Label>
                        <div className="flex-1 h-full min-h-[160px]">
                            <MediaUploader 
                                mediaUrl={question.media_url} 
                                onUpload={(url: string) => onChange('media_url', url)}
                                onRemove={() => onChange('media_url', null)}
                                label="Gambar / Video Soal"
                                disabled={disabled}
                            />
                        </div>
                    </div>
                </div>

                {/* PILIHAN JAWABAN */}
                <div className="space-y-4 pt-4 border-t border-dashed border-slate-100">
                    <div className="flex justify-between items-end px-1">
                        <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pilihan Jawaban</Label>
                        {!disabled && (
                            <span className="text-[10px] bg-green-50 text-green-600 px-2 py-1 rounded-md font-bold border border-green-100">
                                *Klik huruf untuk set kunci jawaban
                            </span>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                        {question.options.map((opt: Option, i: number) => (
                            <div key={i} className={`relative flex items-center gap-4 p-2 pr-4 rounded-2xl border-2 transition-all group
                                ${question.correct_option === i ? 'border-green-500 bg-green-50/30 ring-1 ring-green-500/20' : 'border-slate-100 bg-white hover:border-orange-200'}
                                ${disabled ? 'bg-slate-50' : ''}
                            `}>
                                {/* Tombol Huruf (Kunci Jawaban) */}
                                <button 
                                    disabled={disabled}
                                    className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center font-black text-lg transition-all shadow-sm
                                        ${question.correct_option === i 
                                            ? 'bg-gradient-to-br from-green-500 to-green-600 text-white scale-105 shadow-green-500/30' 
                                            : 'bg-white border border-slate-200 text-slate-400 hover:border-orange-400 hover:text-orange-500'}
                                        ${disabled && question.correct_option !== i ? 'opacity-50' : ''}
                                    `}
                                    onClick={() => onChange('correct_option', i)}
                                >
                                    {question.correct_option === i ? <CheckCircle2 size={24}/> : String.fromCharCode(65 + i)}
                                </button>
                                
                                {/* Input Teks Jawaban */}
                                <div className="flex-1">
                                    <Input 
                                        value={opt.text} 
                                        disabled={disabled}
                                        onChange={(e) => {
                                            const newOptions = [...question.options];
                                            newOptions[i] = { ...newOptions[i], text: e.target.value };
                                            onChange('options', newOptions);
                                        }}
                                        className="border-none shadow-none focus-visible:ring-0 bg-transparent h-10 px-0 font-bold text-slate-700 placeholder:text-slate-300 placeholder:font-normal w-full disabled:cursor-not-allowed"
                                        placeholder={`Tulis jawaban opsi ${String.fromCharCode(65 + i)}...`}
                                    />
                                </div>

                                {/* Media Upload Kecil */}
                                <MediaUploader 
                                    compact
                                    disabled={disabled}
                                    mediaUrl={opt.media_url}
                                    onUpload={(url: string) => {
                                        const newOptions = [...question.options];
                                        newOptions[i] = { ...newOptions[i], media_url: url };
                                        onChange('options', newOptions);
                                    }}
                                    onRemove={() => {
                                        const newOptions = [...question.options];
                                        newOptions[i] = { ...newOptions[i], media_url: null };
                                        onChange('options', newOptions);
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

// --- SUB-COMPONENT: STEP EDITOR ---
const StepEditor = ({ step, index, onChange, onDelete }: any) => {
    return (
        <Card className="border border-slate-200 rounded-3xl mb-6 overflow-hidden bg-white shadow-sm hover:shadow-md transition-all group">
            <div className="p-6 flex flex-col md:flex-row gap-6 items-start">
                <div className="flex md:flex-col items-center gap-3 pt-2">
                    <div className="cursor-grab text-slate-300 hover:text-orange-500 active:cursor-grabbing"><GripVertical size={24}/></div>
                    <span className="bg-slate-900 text-white font-black text-lg w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-slate-900/20">
                        {index + 1}
                    </span>
                </div>

                <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-8 space-y-4">
                        <Input 
                            value={step.title}
                            onChange={(e) => onChange('title', e.target.value)}
                            placeholder="Judul Langkah (misal: Persiapan Alat)"
                            className="font-black text-xl border-x-0 border-t-0 border-b-2 border-slate-100 rounded-none px-0 py-2 focus:border-orange-500 focus:ring-0 bg-transparent placeholder:text-slate-300"
                        />
                        <Textarea 
                            value={step.description}
                            onChange={(e) => onChange('description', e.target.value)}
                            placeholder="Jelaskan detail langkah ini secara rinci..."
                            className="min-h-[120px] bg-slate-50 border-slate-100 rounded-2xl focus:bg-white focus:border-orange-500 transition-all p-4 resize-none"
                        />
                    </div>
                    <div className="md:col-span-4">
                        <div className="h-full min-h-[180px]">
                            <MediaUploader 
                                mediaUrl={step.media_url} 
                                onUpload={(url: string) => onChange('media_url', url)}
                                onRemove={() => onChange('media_url', null)}
                                label="Foto / Video Langkah"
                            />
                        </div>
                    </div>
                </div>

                <Button variant="ghost" size="icon" onClick={onDelete} className="text-slate-300 hover:text-red-500 hover:bg-red-50 absolute top-4 right-4 md:static">
                    <Trash2 size={20} />
                </Button>
            </div>
        </Card>
    )
}

// --- MAIN PAGE ---
export default function Edit({ auth, module }: Props) {
    const [activeTab, setActiveTab] = useState('pre-test');
    const [syncPostTest, setSyncPostTest] = useState(false); // ✅ State untuk centangan sinkronisasi

    const { data, setData, put, processing } = useForm({
        title: module.title || '',
        description: module.description || '',
        pre_test_questions: module.pre_test_questions?.map(q => ({
            ...q,
            options: q.options || [{text: ''}, {text: ''}, {text: ''}, {text: ''}]
        })) || [],
        post_test_questions: module.post_test_questions?.map(q => ({
            ...q,
            options: q.options || [{text: ''}, {text: ''}, {text: ''}, {text: ''}]
        })) || [],
        steps: module.steps || [] 
    });

    // ✅ Effect: Sinkronisasi Pre-Test ke Post-Test
    useEffect(() => {
        if (syncPostTest) {
            // Deep copy untuk menghindari referensi objek yang sama
            const copiedQuestions = JSON.parse(JSON.stringify(data.pre_test_questions));
            setData('post_test_questions', copiedQuestions);
        }
    }, [data.pre_test_questions, syncPostTest]);

    // --- HANDLERS ---
    const updateItem = (key: 'pre_test_questions' | 'post_test_questions' | 'steps', index: number, field: string, value: any) => {
        const updatedList = [...data[key]];
        updatedList[index] = { ...updatedList[index], [field]: value };
        setData(key, updatedList);
    };

    const addItem = (key: 'pre_test_questions' | 'post_test_questions' | 'steps') => {
        if (key === 'steps') {
            setData('steps', [...data.steps, { title: '', description: '', media_url: null }]);
        } else {
            setData(key, [...data[key], {
                question: '',
                media_url: null,
                options: [{text: ''}, {text: ''}, {text: ''}, {text: ''}],
                correct_option: 0
            }]);
        }
    };

    const deleteItem = (key: 'pre_test_questions' | 'post_test_questions' | 'steps', index: number) => {
        const updatedList = data[key].filter((_, i) => i !== index);
        setData(key, updatedList);
    };

    const handleSave = () => {
        put(`/pengajar/modul/${module.id}`, {
            onSuccess: () => toast.success("Perubahan modul berhasil disimpan!")
        });
    };

    return (
        <div className="flex h-screen bg-[#FAFAF9] font-sans text-foreground overflow-hidden md:pl-72 transition-all duration-300">
            <Head title={`Edit Modul - ${data.title}`} />
            
            <aside className="hidden md:block w-72 fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 shadow-sm">
                <SidebarPengajar />
            </aside>

            <div className="flex-1 flex flex-col min-h-screen relative w-full">
                <header className="sticky top-0 z-40 bg-[#FAFAF9]/95 backdrop-blur-md border-b border-slate-200/50 w-full supports-[backdrop-filter]:bg-[#FAFAF9]/60">
                     <HeaderPengajar />
                </header>

                <div className="flex-1 flex overflow-hidden">
                    <nav className="w-64 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col hidden lg:flex h-full overflow-y-auto">
                        <div className="p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
                            <Link href="/pengajar/modul" className="flex items-center text-slate-400 hover:text-orange-600 text-xs font-bold transition-colors mb-3 uppercase tracking-wider group">
                                <ArrowLeft size={14} className="mr-1 group-hover:-translate-x-1 transition-transform"/> Kembali
                            </Link>
                            <h2 className="font-black text-xl text-slate-800 leading-tight">Struktur Materi</h2>
                        </div>
                        
                        <div className="p-4 space-y-2 flex-1">
                            {[
                                { id: 'info', icon: FileText, label: 'Informasi Umum', count: null },
                                { id: 'pre-test', icon: HelpCircle, label: 'Pre-Test', count: data.pre_test_questions.length },
                                { id: 'materi', icon: Layers, label: 'Praktikum', count: data.steps.length },
                                { id: 'post-test', icon: List, label: 'Post-Test', count: data.post_test_questions.length },
                            ].map((item) => (
                                <button 
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full text-left px-4 py-3.5 rounded-xl flex items-center justify-between font-bold transition-all text-sm group ${activeTab === item.id ? 'bg-orange-50 text-orange-600 ring-1 ring-orange-200 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon size={18} className={activeTab === item.id ? 'text-orange-500' : 'text-slate-400 group-hover:text-slate-600'} /> 
                                        {item.label}
                                    </div>
                                    {item.count !== null && (
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === item.id ? 'bg-white text-orange-600' : 'bg-slate-100 text-slate-400'}`}>
                                            {item.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </nav>

                    <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#FAFAF9] scrollbar-hide">
                        <div className="w-full pb-32">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sticky top-0 z-30 pt-2 bg-[#FAFAF9]/95 backdrop-blur-sm pb-4 border-b border-transparent transition-all">
                                <div>
                                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                                        {activeTab === 'info' && 'Informasi Umum'}
                                        {activeTab === 'pre-test' && 'Pre-Test Assessment'}
                                        {activeTab === 'materi' && 'Materi Praktikum'}
                                        {activeTab === 'post-test' && 'Post-Test Assessment'}
                                    </h1>
                                    <p className="text-slate-500 mt-1 font-medium text-sm">Kelola konten modul dan materi pembelajaran.</p>
                                </div>
                                <div className="flex gap-3">
                                    <Button variant="outline" className="gap-2 h-11 px-5 border-slate-300 text-slate-600 hover:text-slate-900 rounded-xl font-bold bg-white hover:border-slate-400">
                                        <Eye size={18}/> Preview
                                    </Button>
                                    <Button onClick={handleSave} disabled={processing} className="gap-2 h-11 px-6 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 active:scale-95 transition-all">
                                        <Save size={18}/> Simpan Perubahan
                                    </Button>
                                </div>
                            </div>

                            {/* --- CONTENT --- */}
                            
                            {activeTab === 'info' && (
                                <Card className="border border-slate-200 rounded-[2.5rem] shadow-sm bg-white p-8 space-y-8">
                                    <div className="space-y-3">
                                        <Label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Judul Modul</Label>
                                        <Input value={data.title} onChange={e => setData('title', e.target.value)} className="h-14 text-2xl font-black border-slate-200 focus:border-orange-500 bg-slate-50/50 focus:bg-white transition-all rounded-xl px-4" />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Deskripsi Singkat</Label>
                                        <Textarea value={data.description} onChange={e => setData('description', e.target.value)} className="min-h-[160px] text-lg leading-relaxed border-slate-200 p-6 focus:border-orange-500 bg-slate-50/50 focus:bg-white transition-all rounded-2xl resize-none" />
                                    </div>
                                </Card>
                            )}

                            {activeTab === 'pre-test' && (
                                <div className="space-y-6">
                                    <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 flex items-start gap-4 text-blue-800">
                                        <div className="bg-white p-3 rounded-full shadow-sm"><HelpCircle size={24} className="text-blue-500"/></div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-1">Pre-Test (Hard Skill)</h3>
                                            <p className="opacity-80 text-sm leading-relaxed max-w-2xl">Soal pengetahuan untuk mengukur pemahaman awal siswa. Penilaian Soft Skill akan diambil dari nilai observasi terpisah.</p>
                                        </div>
                                    </div>
                                    
                                    {data.pre_test_questions.map((q, idx) => (
                                        <QuestionEditor 
                                            key={idx} index={idx} question={q} 
                                            onChange={(field: string, val: any) => updateItem('pre_test_questions', idx, field, val)}
                                            onDelete={() => deleteItem('pre_test_questions', idx)}
                                        />
                                    ))}
                                    
                                    <Button onClick={() => addItem('pre_test_questions')} variant="outline" className="w-full h-16 border-2 border-dashed border-slate-300 text-slate-500 hover:border-orange-400 hover:text-orange-600 hover:bg-orange-50 rounded-3xl gap-2 text-base font-bold transition-all bg-white hover:shadow-md">
                                        <Plus size={24}/> Tambah Pertanyaan Pre-Test
                                    </Button>
                                </div>
                            )}

                            {activeTab === 'materi' && (
                                <div className="space-y-6">
                                    <div className="bg-orange-50 border border-orange-100 rounded-3xl p-6 flex items-start gap-4 text-orange-800">
                                        <div className="bg-white p-3 rounded-full shadow-sm"><Layers size={24} className="text-orange-500"/></div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-1">Langkah Praktikum</h3>
                                            <p className="opacity-80 text-sm leading-relaxed max-w-2xl">Susun materi pembelajaran dalam langkah-langkah terstruktur. Setiap langkah dapat menyertakan media visual (Gambar/Video).</p>
                                        </div>
                                    </div>

                                    {data.steps.map((step, idx) => (
                                        <StepEditor 
                                            key={idx} index={idx} step={step}
                                            onChange={(field: string, val: any) => updateItem('steps', idx, field, val)}
                                            onDelete={() => deleteItem('steps', idx)}
                                        />
                                    ))}

                                    <Button onClick={() => addItem('steps')} variant="outline" className="w-full h-16 border-2 border-dashed border-slate-300 text-slate-500 hover:border-orange-400 hover:text-orange-600 hover:bg-orange-50 rounded-3xl gap-2 text-base font-bold transition-all bg-white hover:shadow-md">
                                        <Plus size={24}/> Tambah Langkah Praktikum
                                    </Button>
                                </div>
                            )}

                            {activeTab === 'post-test' && (
                                <div className="space-y-6">
                                    <div className="bg-purple-50 border border-purple-100 rounded-3xl p-6 flex flex-col md:flex-row items-start justify-between gap-4 text-purple-800">
                                        <div className="flex gap-4">
                                            <div className="bg-white p-3 rounded-full shadow-sm h-fit"><List size={24} className="text-purple-500"/></div>
                                            <div>
                                                <h3 className="font-bold text-lg mb-1">Post-Test (Hard Skill)</h3>
                                                <p className="opacity-80 text-sm leading-relaxed max-w-xl">Evaluasi akhir pengetahuan siswa. Penilaian Soft Skill akan diambil dari nilai observasi terpisah.</p>
                                            </div>
                                        </div>
                                        
                                        {/* ✅ SAKELAR SINKRONISASI */}
                                        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-purple-100 shadow-sm">
                                            <Switch 
                                                id="sync-mode"
                                                checked={syncPostTest}
                                                onCheckedChange={setSyncPostTest}
                                                className="data-[state=checked]:bg-purple-600"
                                            />
                                            <Label htmlFor="sync-mode" className="cursor-pointer text-sm font-bold text-slate-600 flex items-center gap-2">
                                                {syncPostTest ? <Link size={14} className="text-purple-600"/> : <Copy size={14}/>}
                                                Samakan dengan Pre-Test
                                            </Label>
                                        </div>
                                    </div>

                                    {data.post_test_questions.map((q, idx) => (
                                        <QuestionEditor 
                                            key={idx} index={idx} question={q}
                                            disabled={syncPostTest} // ✅ Disable jika sinkronisasi aktif
                                            onChange={(field: string, val: any) => updateItem('post_test_questions', idx, field, val)}
                                            onDelete={() => deleteItem('post_test_questions', idx)}
                                        />
                                    ))}
                                    
                                    {!syncPostTest && (
                                        <Button onClick={() => addItem('post_test_questions')} variant="outline" className="w-full h-16 border-2 border-dashed border-slate-300 text-slate-500 hover:border-orange-400 hover:text-orange-600 hover:bg-orange-50 rounded-3xl gap-2 text-base font-bold transition-all bg-white hover:shadow-md">
                                            <Plus size={24}/> Tambah Pertanyaan Post-Test
                                        </Button>
                                    )}
                                </div>
                            )}

                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}