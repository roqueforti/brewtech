import { useState, useRef, useEffect } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import SidebarPengajar from '@/Components/SidebarPengajar';
import HeaderPengajar from '@/Components/HeaderPengajar';
import { 
    ArrowLeft, Save, Eye, FileText, List, Layers, HelpCircle, 
    Image as ImageIcon, Trash2, Plus, X, GripVertical, CheckCircle2,
    Lock, UploadCloud, XCircle, Wrench, RefreshCcw, Search
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Card, CardContent } from '@/Components/ui/card';
import { Label } from '@/Components/ui/label';
import { Toaster, toast } from 'sonner';

// --- KONFIGURASI API ---
const UNSPLASH_ACCESS_KEY = 'GANTI_DENGAN_ACCESS_KEY_UNSPLASH_ANDA'; 

// --- TYPES ---
interface Option { text: string; media_url?: string | null; media_file?: File | null; }
interface Question { id?: number; type?: 'pre_test' | 'post_test'; question: string; media_url?: string | null; media_file?: File | null; options: Option[]; correct_option: number; correct_answer?: number; }
interface Step { id?: number; title: string; description: string; media_url?: string | null; media_file?: File | null; }
interface Tool { id?: number; name: string; media_url?: string | null; media_file?: File | null; }
interface ModuleData { id: number; title: string; description: string; tools: Tool[]; pre_test_questions: Question[]; post_test_questions: Question[]; steps: Step[]; }
interface Props { auth: any; module: ModuleData; }

// --- COMPONENT: IMPORT MODAL ---
const ImportModal = ({ isOpen, onClose, onImport, type }: any) => {
    const [text, setText] = useState('');
    if (!isOpen) return null;

    const handleProcess = () => {
        if (!text.trim()) { toast.error('Teks tidak boleh kosong!'); return; }
        onImport(text); setText(''); onClose();
    };

    let config = { title: '', desc: '', placeholder: '' };
    if (type === 'question') config = { title: 'Import Soal Cepat', desc: 'Format: Baris biasa = Pertanyaan, Awalan A-D = Opsi.', placeholder: 'Minuman Choco Latte dibuat dari …\nA. Teh dan gula\nB. Bubuk cokelat dan susu\n...' };
    else if (type === 'step') config = { title: 'Import Langkah Praktikum', desc: 'Paste langkah-langkah (List angka/bullet).', placeholder: '1. Timbang bubuk coklat 20 gram...\n2. Tuangkan air panas...' };
    else config = { title: 'Import Alat & Bahan', desc: 'Paste daftar alat & bahan (List per baris).', placeholder: 'Bahan:\n- 20 gr coklat bubuk\n- 15 gr gula pasir\n\nAlat:\n- Gelas/cup' };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-6 space-y-4">
                <div className="flex justify-between items-center border-b pb-4">
                    <div><h3 className="text-xl font-black text-slate-800">{config.title}</h3><p className="text-sm text-slate-500">{config.desc}</p></div>
                    <button onClick={onClose}><XCircle className="text-slate-400 hover:text-red-500" /></button>
                </div>
                <Textarea value={text} onChange={e => setText(e.target.value)} placeholder={config.placeholder} className="min-h-[300px] font-mono text-sm" />
                <div className="flex justify-end gap-3 pt-2">
                    <Button variant="ghost" onClick={onClose}>Batal</Button>
                    <Button onClick={handleProcess} className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-xl px-6">Proses & Simpan</Button>
                </div>
            </div>
        </div>
    );
};

// --- COMPONENT: IMAGE SEARCH MODAL ---
const ImageSearchModal = ({ isOpen, onClose, onSelect, initialQuery }: any) => {
    const [query, setQuery] = useState(initialQuery || '');
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && initialQuery) { setQuery(initialQuery); handleSearch(initialQuery); }
    }, [isOpen, initialQuery]);

    const handleSearch = async (searchTerm: string) => {
        if (!searchTerm) return;
        setLoading(true);
        try {
            if (UNSPLASH_ACCESS_KEY === 'GANTI_DENGAN_ACCESS_KEY_UNSPLASH_ANDA') {
                setTimeout(() => {
                    setImages(Array(4).fill(0).map((_, i) => ({ id: i, urls: { regular: `https://source.unsplash.com/random/400x400/?${searchTerm}&sig=${i}` }, alt_description: searchTerm })));
                    setLoading(false);
                }, 1000);
            } else {
                const response = await fetch(`https://api.unsplash.com/search/photos?page=1&query=${searchTerm}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=8`);
                const data = await response.json();
                setImages(data.results || []);
                setLoading(false);
            }
        } catch (error) { toast.error("Gagal mengambil gambar."); setLoading(false); }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl p-6 h-[80vh] flex flex-col">
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                    <h3 className="text-xl font-black text-slate-800 flex items-center gap-2"><Search size={20}/> Cari Gambar Otomatis</h3>
                    <button onClick={onClose}><XCircle className="text-slate-400 hover:text-red-500" /></button>
                </div>
                <div className="flex gap-2 mb-6">
                    <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ketik kata kunci..." onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)} className="h-12 text-lg" />
                    <Button onClick={() => handleSearch(query)} className="h-12 px-6 bg-cyan-500 hover:bg-cyan-600 text-white font-bold">Cari</Button>
                </div>
                <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-4 gap-4 p-2">
                    {loading ? <div className="col-span-full flex justify-center py-20 text-slate-400">Sedang mencari...</div> : images.map((img: any) => (
                        <div key={img.id} onClick={() => { onSelect(img.urls.regular); onClose(); }} className="group cursor-pointer relative aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-cyan-500 transition-all">
                            <img src={img.urls.regular} alt={img.alt_description} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><span className="bg-white text-slate-900 px-3 py-1 rounded-full text-xs font-bold">Pilih Ini</span></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- HELPER: MEDIA UPLOADER ---
const MediaUploader = ({ mediaUrl, onUpload, onRemove, onOpenSearch, compact = false, label = "Media", disabled = false }: any) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onUpload(URL.createObjectURL(file), file);
    };

    if (mediaUrl) {
        return (
            <div className={`relative group border border-slate-200 rounded-xl overflow-hidden bg-slate-50 ${compact ? 'w-14 h-14 shrink-0' : 'w-full h-full min-h-[150px]'}`}>
                {(typeof mediaUrl === 'string' && (mediaUrl.endsWith('.mp4') || mediaUrl.includes('video'))) ? (
                    <video src={mediaUrl} className="w-full h-full object-cover" controls />
                ) : (
                    <img src={mediaUrl} alt="Media" className="w-full h-full object-cover bg-white" />
                )}
                {!disabled && (
                    <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(); }} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white z-10">
                        <X size={20} className="bg-red-500 rounded-full p-1" />
                    </button>
                )}
            </div>
        );
    }
    return (
        <div className={`flex flex-col gap-2 ${compact ? 'items-center justify-center' : 'h-full'}`}>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={handleFileChange} disabled={disabled} />
            <div 
                onClick={(e) => { e.preventDefault(); if(!disabled) fileInputRef.current?.click(); }} 
                className={`border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:text-cyan-500 hover:border-cyan-300 cursor-pointer transition-all bg-white hover:bg-cyan-50/20 ${compact ? 'w-14 h-14' : 'flex-1 w-full min-h-[100px]'} ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
            >
                <ImageIcon size={compact ? 20 : 32} className={compact ? "" : "mb-2"} />
                {!compact && <span className="text-xs font-bold text-center px-2">{label}</span>}
            </div>
            {!disabled && onOpenSearch && (
                <Button 
                    type="button" variant="outline" size={compact ? "icon" : "sm"} 
                    className={`w-full text-[10px] font-bold ${compact ? 'h-7 w-14' : ''} bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100`}
                    onClick={(e) => { e.preventDefault(); onOpenSearch(); }}
                    title="Cari gambar otomatis"
                >
                    {compact ? <Search size={12} /> : <><Search size={12} className="mr-1"/> Cari</>}
                </Button>
            )}
        </div>
    );
};

// --- COMPONENT: TOOL EDITOR ---
const ToolEditor = ({ tool, index, onChange, onDelete, onSearch }: any) => (
    <Card className="border border-slate-200 rounded-2xl mb-4 overflow-hidden bg-white shadow-sm hover:shadow-md transition-all">
        <div className="p-4 flex items-center gap-4">
            <GripVertical size={20} className="text-slate-300" />
            <MediaUploader compact mediaUrl={tool.media_url} onUpload={(url: string, file: File) => onChange({ media_url: url, media_file: file })} onRemove={() => onChange({ media_url: null, media_file: null })} onOpenSearch={() => onSearch(tool.name)} />
            <div className="flex-1">
                <Label className="text-[10px] font-bold text-slate-400 uppercase">Nama Alat/Bahan</Label>
                <Input value={tool.name} onChange={e => onChange('name', e.target.value)} className="font-bold border-slate-200 focus:border-cyan-500 h-9" />
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={onDelete} className="text-slate-300 hover:text-red-500"><Trash2 size={18} /></Button>
        </div>
    </Card>
);

// --- COMPONENT: STEP EDITOR ---
const StepEditor = ({ step, index, onChange, onDelete, onSearch }: any) => (
    <Card className="border border-slate-200 rounded-3xl mb-6 overflow-hidden bg-white shadow-sm hover:shadow-md transition-all">
        <div className="p-6 flex flex-col md:flex-row gap-6">
            <div className="flex md:flex-col items-center gap-3">
                <GripVertical size={24} className="text-slate-300" />
                <span className="bg-slate-900 text-white font-black w-8 h-8 flex items-center justify-center rounded-lg">{index + 1}</span>
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-8 space-y-4">
                    <Input value={step.title} onChange={e => onChange('title', e.target.value)} placeholder="Judul Langkah" className="font-black text-xl border-x-0 border-t-0 border-b-2 rounded-none px-0 focus:border-cyan-500" />
                    <Textarea value={step.description} onChange={e => onChange('description', e.target.value)} placeholder="Deskripsi..." className="bg-slate-50 border-slate-100 min-h-[120px]" />
                </div>
                <div className="md:col-span-4 h-full flex flex-col justify-end pb-1">
                    <MediaUploader mediaUrl={step.media_url} onUpload={(url: string, file: File) => onChange({ media_url: url, media_file: file })} onRemove={() => onChange({ media_url: null, media_file: null })} onOpenSearch={() => onSearch(`${step.title} ${step.description}`.substring(0, 30))} label="Foto/Video Langkah" />
                </div>
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={onDelete} className="absolute top-4 right-4 md:static text-slate-300 hover:text-red-500"><Trash2 size={20} /></Button>
        </div>
    </Card>
);

// --- COMPONENT: QUESTION EDITOR ---
const QuestionEditor = ({ question, index, onChange, onDelete, onSearch, disabled = false }: any) => {
    const handleOptionChange = (optIndex: number, field: 'text' | 'media', value: any, file: File | null = null) => {
        const newOptions = [...question.options];
        if (field === 'text') {
            newOptions[optIndex] = { ...newOptions[optIndex], text: value };
        } else {
            newOptions[optIndex] = { ...newOptions[optIndex], media_url: value, media_file: file };
        }
        onChange('options', newOptions);
    };

    return (
        <Card className={`border border-slate-200 rounded-3xl mb-8 overflow-hidden bg-white shadow-sm hover:shadow-md transition-all ${disabled ? 'opacity-75 bg-slate-50' : ''}`}>
            <div className="bg-slate-50 border-b p-4 px-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <span className={`border w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${disabled ? 'bg-slate-200 text-slate-500' : 'bg-white text-slate-700'}`}>{index + 1}</span>
                    {disabled && <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Lock size={12}/> Tersinkronisasi dengan Pre-Test</span>}
                </div>
                {!disabled && <Button type="button" variant="ghost" size="sm" onClick={onDelete} className="text-red-400 hover:bg-red-50"><Trash2 size={16} /> Hapus</Button>}
            </div>
            <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-8 space-y-2">
                        <Label>Pertanyaan</Label>
                        <Textarea value={question.question} onChange={e => onChange('question', e.target.value)} placeholder="Tulis pertanyaan..." disabled={disabled} className="min-h-[120px]" />
                    </div>
                    <div className="md:col-span-4 h-full flex flex-col justify-end">
                        <MediaUploader mediaUrl={question.media_url} onUpload={(url: string, file: File) => onChange({ media_url: url, media_file: file })} onRemove={() => onChange({ media_url: null, media_file: null })} onOpenSearch={() => onSearch(question.question)} disabled={disabled} label="Cari Gambar Soal" />
                    </div>
                </div>
                <div className="space-y-3">
                    <Label>Pilihan Jawaban</Label>
                    {question.options.map((opt: Option, i: number) => (
                        <div key={i} className={`flex items-center gap-3 p-2 border-2 rounded-xl ${question.correct_option === i ? 'border-green-500 bg-green-50' : 'border-slate-100'}`}>
                            <button type="button" disabled={disabled} onClick={() => onChange('correct_option', i)} className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${question.correct_option === i ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                {question.correct_option === i ? <CheckCircle2 size={20} /> : String.fromCharCode(65 + i)}
                            </button>
                            <Input value={opt.text} disabled={disabled} onChange={e => handleOptionChange(i, 'text', e.target.value)} className="border-none shadow-none focus-visible:ring-0" placeholder={`Opsi ${String.fromCharCode(65 + i)}`} />
                            <MediaUploader 
                                compact 
                                disabled={disabled} 
                                mediaUrl={opt.media_url} 
                                onUpload={(url: string, file: File) => handleOptionChange(i, 'media', url, file)}
                                onRemove={() => handleOptionChange(i, 'media', null, null)}
                                onOpenSearch={() => onSearch(opt.text)}
                            />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

// --- MAIN PAGE ---
export default function Edit({ auth, module }: Props) {
    const [activeTab, setActiveTab] = useState('pre-test');
    const [syncPostTest, setSyncPostTest] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [importType, setImportType] = useState<'question' | 'step' | 'tools'>('question');
    const [searchModalOpen, setSearchModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchCallback, setSearchCallback] = useState<(url: string) => void>(() => {});

    const { data, setData, put, processing } = useForm({
        title: module.title || '',
        description: module.description || '',
        tools: module.tools || [],
        steps: module.steps || [],
        pre_test_questions: (module.pre_test_questions || []).map(q => ({
            ...q, type: 'pre_test', correct_option: Number(q.correct_answer ?? q.correct_option ?? 0),
            options: q.options || Array(4).fill({ text: '' })
        })),
        post_test_questions: (module.post_test_questions || []).map(q => ({
            ...q, type: 'post_test', correct_option: Number(q.correct_answer ?? q.correct_option ?? 0),
            options: q.options || Array(4).fill({ text: '' })
        }))
    });

    // --- LOGIKA SINKRONISASI POST-TEST ---
    useEffect(() => {
        if (syncPostTest) {
            const mirroredQuestions = data.pre_test_questions.map(q => ({
                ...q, 
                type: 'post_test', 
                media_file: q.media_file, 
                options: q.options.map(opt => ({ ...opt, media_file: opt.media_file }))
            }));
            setData('post_test_questions', mirroredQuestions as any);
        }
    }, [data.pre_test_questions, syncPostTest]);

    // --- HELPER UNTUK MENGHITUNG JUMLAH ITEM (UNTUK BADGE NOTIFIKASI) ---
    const getCount = (tabId: string) => {
        if (tabId === 'pre-test') return data.pre_test_questions.length;
        if (tabId === 'post-test') return data.post_test_questions.length;
        if (tabId === 'materi') return data.steps.length;
        return 0;
    };

    const updateItem = (key: 'tools' | 'steps' | 'pre_test_questions' | 'post_test_questions', index: number, field: string | object, value?: any) => {
        const updatedList = [...(data[key] || [])];
        if (updatedList[index]) {
            if (typeof field === 'object') updatedList[index] = { ...updatedList[index], ...field };
            else updatedList[index] = { ...updatedList[index], [field]: value };
            setData(key, updatedList as any);
        }
    };

    const addItem = (key: string) => {
        if (key === 'tools') setData('tools', [...data.tools, { name: '', media_url: null }]);
        else if (key === 'steps') setData('steps', [...data.steps, { title: '', description: '', media_url: null }]);
        else setData(key as any, [...(data as any)[key], { type: key === 'pre_test_questions' ? 'pre_test' : 'post_test', question: '', options: Array(4).fill({ text: '' }), correct_option: 0 }]);
    };

    const deleteItem = (key: string, index: number) => {
        setData(key as any, (data as any)[key].filter((_: any, i: number) => i !== index));
    };

    const handleImport = (rawText: string) => {
        // Pisahkan per baris, buang baris kosong
        const lines = rawText.split('\n').map(l => l.trim()).filter(l => l);
        
        if (importType === 'tools') {
            const newTools = lines.filter(l => !l.endsWith(':') && !['alat', 'bahan', 'alat:', 'bahan:'].includes(l.toLowerCase())).map(l => ({ name: l.replace(/^[\d\-\.\•]+\s*/, ''), media_url: null }));
            setData('tools', [...data.tools, ...newTools]);
            toast.success(`Berhasil mengimpor ${newTools.length} alat/bahan!`);
        } else if (importType === 'step') {
            const newSteps = lines.map((l, i) => ({ title: `Langkah ${data.steps.length + i + 1}`, description: l.replace(/^[\d-]+\.?\s*/, ''), media_url: null }));
            setData('steps', [...data.steps, ...newSteps]);
            toast.success(`Berhasil mengimpor ${newSteps.length} langkah!`);
        } else {
            // --- LOGIKA IMPORT SOAL YANG DIPERBAIKI ---
            const newQuestions: any[] = [];
            let currentQ: any = null;

            lines.forEach(l => {
                // Regex: Cek apakah baris dimulai dengan A., B., C., atau D.
                const optionMatch = l.match(/^([A-D])\.\s*(.*)/i);

                if (optionMatch) {
                    // Jika ini adalah opsi jawaban (A-D)
                    if (currentQ) {
                        const charCode = optionMatch[1].toUpperCase().charCodeAt(0); // Ambil huruf A/B/C/D
                        const idx = charCode - 65; // Konversi ke index 0-3 (A=0, B=1, dst)
                        
                        if (idx >= 0 && idx < 4) {
                            // Masukkan teks ke opsi yang sesuai index-nya
                            // PENTING: Gunakan spread operator (...) agar array opsi ter-update dengan benar
                            const updatedOptions = [...currentQ.options];
                            updatedOptions[idx] = { text: optionMatch[2].trim(), media_url: null };
                            currentQ.options = updatedOptions;
                        }
                    }
                } else {
                    // Jika bukan opsi, berarti ini Pertanyaan baru
                    // Simpan pertanyaan sebelumnya jika ada
                    if (currentQ) {
                        newQuestions.push(currentQ);
                    }
                    
                    // Buat objek pertanyaan baru
                    currentQ = { 
                        question: l.replace(/^\d+[\.\)]\s*/, ''), // Hapus nomor soal jika ada (misal "1. Apa...")
                        options: Array(4).fill({ text: '', media_url: null }), // Reset opsi kosong
                        correct_option: 0, 
                        type: activeTab === 'pre-test' ? 'pre_test' : 'post_test' 
                    };
                }
            });

            // Jangan lupa push pertanyaan terakhir setelah loop selesai
            if (currentQ) {
                newQuestions.push(currentQ);
            }

            const targetKey = activeTab === 'pre-test' ? 'pre_test_questions' : 'post_test_questions';
            setData(targetKey as any, [...(data as any)[targetKey], ...newQuestions]);
            toast.success(`Berhasil mengimpor ${newQuestions.length} soal!`);
        }
    };

    const handleSave = () => {
        const transformQ = (qs: any[]) => qs.map(q => ({
            ...q, correct_answer: q.correct_option,
            options_media_files: q.options.map((o: any) => o.media_file || null)
        }));
        router.post(`/pengajar/modul/${module.id}`, {
            _method: 'PUT', ...data,
            questions: [...transformQ(data.pre_test_questions), ...transformQ(data.post_test_questions)]
        }, { forceFormData: true, onSuccess: () => toast.success("Berhasil disimpan!"), onError: () => toast.error("Gagal menyimpan.") });
    };

    const openImageSearch = (query: string, callback: (url: string) => void) => {
        setSearchQuery(query);
        setSearchCallback(() => callback);
        setSearchModalOpen(true);
    };

    const handleImageSelect = (url: string) => {
        searchCallback(url); 
    };

    const handleToolSearch = (index: number, query: string) => {
        openImageSearch(query, (url) => updateItem('tools', index, { media_url: url, media_file: null }));
    };

    const handleStepSearch = (index: number, query: string) => {
        openImageSearch(query, (url) => updateItem('steps', index, { media_url: url, media_file: null }));
    };

    const handleQuestionSearch = (key: 'pre_test_questions'|'post_test_questions', index: number, query: string) => {
        openImageSearch(query, (url) => updateItem(key, index, { media_url: url, media_file: null }));
    };

    const handleOptionSearch = (key: 'pre_test_questions'|'post_test_questions', qIndex: number, optIndex: number, query: string) => {
        openImageSearch(query, (url) => {
            const list = [...(data[key] || [])];
            const newOpts = [...list[qIndex].options];
            newOpts[optIndex] = { ...newOpts[optIndex], media_url: url, media_file: null };
            updateItem(key, qIndex, 'options', newOpts);
        });
    };

    return (
        <div className="flex h-screen bg-[#FAFAF9] font-sans text-foreground overflow-hidden md:pl-72">
            <Head title={`Edit - ${data.title}`} />
            <Toaster position="top-center" richColors />
            <ImportModal isOpen={showImportModal} onClose={() => setShowImportModal(false)} onImport={handleImport} type={importType} />
            <ImageSearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} initialQuery={searchQuery} onSelect={handleImageSelect} />
            <aside className="hidden md:block w-72 fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 shadow-sm"><SidebarPengajar /></aside>
            <div className="flex-1 flex flex-col min-h-screen w-full">
                <header className="sticky top-0 z-40 bg-[#FAFAF9]/95 backdrop-blur border-b border-slate-200/50"><HeaderPengajar /></header>
                <div className="flex-1 flex overflow-hidden">
                    
                    {/* --- SIDEBAR NAVIGASI MENU --- */}
                    <nav className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col h-full p-4 space-y-2">
                        <Link href="/pengajar/modul" className="text-slate-400 hover:text-cyan-600 text-xs font-bold mb-4 flex items-center gap-1"><ArrowLeft size={14}/> KEMBALI</Link>
                        
                        {[{id:'info',icon:FileText,label:'Info'},{id:'pre-test',icon:HelpCircle,label:'Pre-Test'},{id:'materi',icon:Layers,label:'Praktikum'},{id:'post-test',icon:List,label:'Post-Test'}].map(item => (
                            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between gap-3 font-bold text-sm ${activeTab===item.id ? 'bg-cyan-50 text-cyan-600' : 'text-slate-500 hover:bg-slate-50'}`}>
                                <div className="flex items-center gap-3">
                                    <item.icon size={18}/> {item.label}
                                </div>
                                {/* BADGE JUMLAH ITEM (New Feature) */}
                                {item.id !== 'info' && (
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === item.id ? 'bg-cyan-200 text-cyan-800' : 'bg-slate-100 text-slate-500'}`}>
                                        {getCount(item.id)}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>

                    <main className="flex-1 overflow-y-auto p-8 bg-[#FAFAF9] pb-32">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-3xl font-black text-slate-800 capitalize">{activeTab.replace('-', ' ')}</h1>
                            <div className="flex gap-3">
                                <Link href={`/pengajar/modul/${module.id}/preview`} className="px-5 py-2 border-2 border-slate-200 rounded-xl font-bold bg-white hover:text-cyan-600 flex gap-2 items-center"><Eye size={18}/> Preview</Link>
                                <Button onClick={handleSave} disabled={processing} className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold px-6 rounded-xl shadow-lg"><Save size={18} className="mr-2"/> Simpan</Button>
                            </div>
                        </div>
                        {activeTab === 'info' && <Card className="p-8 space-y-6 rounded-[2rem] border-slate-200 shadow-sm"><div><Label>Judul Modul</Label><Input value={data.title} onChange={e => setData('title', e.target.value)} className="text-xl font-bold h-12" /></div><div><Label>Deskripsi</Label><Textarea value={data.description} onChange={e => setData('description', e.target.value)} className="min-h-[150px]" /></div></Card>}
                        {activeTab === 'materi' && <div className="space-y-8">
                            <div className="bg-yellow-50 border border-yellow-100 p-6 rounded-3xl"><div className="flex justify-between items-center mb-4"><h3 className="font-bold text-yellow-800 flex gap-2 items-center"><Wrench className="text-yellow-600"/> Alat & Bahan</h3><Button variant="outline" size="sm" onClick={() => {setImportType('tools'); setShowImportModal(true)}} className="bg-white text-yellow-600 border-yellow-200"><UploadCloud size={16} className="mr-2"/> Import</Button></div>{data.tools.map((t, i) => <ToolEditor key={i} index={i} tool={t} onChange={(val: any) => updateItem('tools', i, typeof val === 'string' ? val : val, typeof val === 'string' ? arguments[1] : undefined)} onDelete={() => deleteItem('tools', i)} onSearch={handleToolSearch.bind(null, i)} />)}<Button onClick={() => addItem('tools')} className="w-full border-dashed border-2 border-yellow-300 text-yellow-600 bg-white hover:bg-yellow-50"><Plus size={18} className="mr-2"/> Tambah Alat</Button></div>
                            <div className="bg-cyan-50 border border-cyan-100 p-6 rounded-3xl"><div className="flex justify-between items-center mb-4"><h3 className="font-bold text-cyan-800 flex gap-2 items-center"><Layers className="text-cyan-600"/> Langkah Praktikum</h3><Button variant="outline" size="sm" onClick={() => {setImportType('step'); setShowImportModal(true)}} className="bg-white text-cyan-600 border-cyan-200"><UploadCloud size={16} className="mr-2"/> Import</Button></div>{data.steps.map((s, i) => <StepEditor key={i} index={i} step={s} onChange={(f: any, v: any) => updateItem('steps', i, f, v)} onDelete={() => deleteItem('steps', i)} onSearch={handleStepSearch.bind(null, i)} />)}<Button onClick={() => addItem('steps')} className="w-full border-dashed border-2 border-cyan-300 text-cyan-600 bg-white hover:bg-cyan-50"><Plus size={18} className="mr-2"/> Tambah Langkah</Button></div>
                        </div>}
                        
                        {(activeTab === 'pre-test' || activeTab === 'post-test') && <div className="space-y-6">
                            <div className={`p-6 rounded-3xl flex items-start justify-between gap-4 ${activeTab==='pre-test' ? 'bg-blue-50 text-blue-800 border-blue-100' : 'bg-purple-50 text-purple-800 border-purple-100'} border`}>
                                <div className="flex items-center gap-3"><div className="bg-white p-2 rounded-full shadow-sm"><HelpCircle size={24}/></div><h3 className="font-bold text-lg">{activeTab === 'pre-test' ? 'Pre-Test Assessment' : 'Post-Test Assessment'}</h3></div>
                                {!(activeTab === 'post-test' && syncPostTest) && <Button variant="outline" size="sm" onClick={() => {setImportType('question'); setShowImportModal(true)}} className="bg-white border-2 font-bold"><UploadCloud size={16} className="mr-2"/> Import Soal</Button>}
                            </div>
                            
                            {/* SWITCH BUTTON SINKRONISASI */}
                            {activeTab === 'post-test' && (
                                <div className="bg-white p-4 rounded-xl border flex justify-between items-center shadow-sm">
                                    <span className="font-bold text-slate-600 flex items-center gap-2">
                                        <RefreshCcw size={16}/> Samakan dengan Pre-Test?
                                    </span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            className="sr-only peer"
                                            checked={syncPostTest}
                                            onChange={(e) => setSyncPostTest(e.target.checked)}
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                                    </label>
                                </div>
                            )}

                            {(data[activeTab === 'pre-test' ? 'pre_test_questions' : 'post_test_questions']).map((q: any, i: number) => (
                                <QuestionEditor 
                                    key={i} index={i} question={q} 
                                    disabled={activeTab === 'post-test' && syncPostTest} 
                                    onChange={(f: any, v: any) => updateItem(activeTab === 'pre-test' ? 'pre_test_questions' : 'post_test_questions', i, f, v)} 
                                    onDelete={() => deleteItem(activeTab === 'pre-test' ? 'pre_test_questions' : 'post_test_questions', i)}
                                    onSearch={(query: string) => handleQuestionSearch(activeTab === 'pre-test' ? 'pre_test_questions' : 'post_test_questions', i, query)} 
                                />
                            ))}
                            {!(activeTab === 'post-test' && syncPostTest) && <Button onClick={() => addItem(activeTab === 'pre-test' ? 'pre_test_questions' : 'post_test_questions')} className="w-full h-14 text-lg border-dashed border-2 border-slate-300 text-slate-500 bg-white hover:border-cyan-500 hover:text-cyan-500"><Plus size={24}/> Tambah Soal</Button>}
                        </div>}
                    </main>
                </div>
            </div>
        </div>
    );
}