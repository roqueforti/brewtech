import { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import type { ChangeEvent } from "react";
import SidebarPengajar from "@/Components/SidebarPengajar";
import HeaderPengajar from "@/Components/HeaderPengajar";
import { 
    ArrowLeft, Save, ListChecks, HelpCircle, FileText, 
    Plus, X, CheckCircle, Image as ImageIcon, Film, Eye, Upload, AlertTriangle, AlertOctagon 
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Badge } from "@/Components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Card } from "@/Components/ui/card";
import { Checkbox } from "@/Components/ui/checkbox";
import { Toaster } from "@/Components/ui/sonner"; 
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/Components/ui/dialog";

// --- TYPES ---
interface MediaData { url: string; type: 'image' | 'video'; }

interface Step { 
    title: string; 
    description: string;
    media_url?: string | null;
    media_type?: 'image' | 'video' | null;
    media_file?: File | null;
}

interface Question { 
    type: 'pre_test' | 'post_test'; 
    question: string; 
    options: string[]; 
    correct_answer: string; 
    media_url?: string | null;
    media_type?: 'image' | 'video' | null;
    media_file?: File | null;
    options_media?: (MediaData | null)[]; 
    options_media_files?: (File | null)[]; 
}

interface Module {
    id: number;
    title: string;
    description: string;
    category: string;
    duration: string;
    steps: Step[];
    questions: Question[];
}

export default function DetailModul({ module }: { module: Module }) {
    const [activeSection, setActiveSection] = useState<'info' | 'pre_test' | 'steps' | 'post_test'>('info');
    const [isPostTestSame, setIsPostTestSame] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    // ✅ State Dirty Check
    const [isDirty, setIsDirty] = useState(false);
    const [showExitDialog, setShowExitDialog] = useState(false);
    const [pendingUrl, setPendingUrl] = useState<string | null>(null);
    
    const [formData, setFormData] = useState({
        _method: 'PUT',
        title: module.title,
        description: module.description,
        category: module.category,
        duration: module.duration,
        steps: module.steps || [],
        questions: module.questions.map(q => ({
            ...q,
            options_media: q.options_media || [null, null, null, null], 
            options_media_files: [null, null, null, null] as (File | null)[] 
        })) || []
    });

    const preTestQuestions = formData.questions.filter(q => q.type === 'pre_test');
    const postTestQuestions = formData.questions.filter(q => q.type === 'post_test');

    // 1️⃣ Listener Native Browser
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = ''; 
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    // 2️⃣ Listener Inertia
    useEffect(() => {
        const removeListener = router.on('before', (event) => {
            if (isDirty && event.detail.visit.method === 'get') {
                event.preventDefault();
                setPendingUrl((event.detail.visit as any).url);
                setShowExitDialog(true);
            }
        });
        return () => removeListener();
    }, [isDirty]);

    const markAsDirty = () => { if (!isDirty) setIsDirty(true); };

    const handleConfirmExit = () => {
        setIsDirty(false); 
        setShowExitDialog(false);
        if (pendingUrl) router.visit(pendingUrl); 
    };

    const handleCancelExit = () => {
        setShowExitDialog(false);
        setPendingUrl(null);
    };

    const handleSave = () => {
        setIsSaving(true);
        router.post(`/pengajar/modul/${module.id}`, formData as any, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setIsSaving(false);
                setIsDirty(false); 
                // ✅ Toast Putih Bersih
                toast.success("Modul Berhasil Disimpan", { 
                    description: "Semua perubahan telah diperbarui ke sistem.",
                    duration: 3000,
                });
            },
            onError: (err) => {
                setIsSaving(false);
                console.error(err);
                toast.error("Gagal Menyimpan", { description: "Cek inputan Anda kembali." });
            }
        });
    };

    // --- FIELD UPDATERS ---
    const updateField = (field: string, val: string) => { setFormData({ ...formData, [field]: val }); markAsDirty(); };
    const handleSameAsPreTestChange = (checked: boolean) => {
        setIsPostTestSame(checked); markAsDirty(); 
        if (checked) {
            const otherQuestions = formData.questions.filter(q => q.type !== 'post_test');
            const preTests = formData.questions.filter(q => q.type === 'pre_test');
            const clonedPostTests = preTests.map(q => ({ ...q, type: 'post_test' as const }));
            setFormData({ ...formData, questions: [...otherQuestions, ...clonedPostTests] });
            toast.info("Sinkronisasi Aktif", { description: "Soal Post-Test disamakan dengan Pre-Test." });
        }
    };
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>, index: number, section: 'steps' | 'questions') => {
        const file = e.target.files?.[0]; if (!file) return; markAsDirty();
        const isVideo = file.type.startsWith('video/');
        const newData = section === 'steps' ? [...formData.steps] : [...formData.questions];
        const previewUrl = URL.createObjectURL(file);
        // @ts-ignore
        newData[index] = { ...newData[index], media_file: file, media_url: previewUrl, media_type: isVideo ? 'video' : 'image' };
        if (section === 'steps') setFormData({ ...formData, steps: newData as Step[] });
        else setFormData({ ...formData, questions: newData as Question[] });
    };
    const removeMedia = (index: number, section: 'steps' | 'questions') => {
        markAsDirty(); const newData = section === 'steps' ? [...formData.steps] : [...formData.questions];
        // @ts-ignore
        newData[index] = { ...newData[index], media_url: null, media_type: null, media_file: null };
        if (section === 'steps') setFormData({ ...formData, steps: newData as Step[] });
        else setFormData({ ...formData, questions: newData as Question[] });
    };
    const handleOptionFileChange = (e: ChangeEvent<HTMLInputElement>, qIdx: number, optIdx: number) => {
        const file = e.target.files?.[0]; if (!file) return; markAsDirty();
        const newData = [...formData.questions]; const currentQ = newData[qIdx];
        if (!currentQ.options_media) currentQ.options_media = [null, null, null, null];
        if (!currentQ.options_media_files) currentQ.options_media_files = [null, null, null, null];
        const previewUrl = URL.createObjectURL(file);
        currentQ.options_media[optIdx] = { url: previewUrl, type: 'image' };
        currentQ.options_media_files[optIdx] = file;
        setFormData({ ...formData, questions: newData });
    };
    const removeOptionMedia = (qIdx: number, optIdx: number) => {
        markAsDirty(); const newData = [...formData.questions];
        if (newData[qIdx].options_media) newData[qIdx].options_media![optIdx] = null;
        if (newData[qIdx].options_media_files) newData[qIdx].options_media_files![optIdx] = null;
        setFormData({ ...formData, questions: newData });
    };
    const addStep = () => { setFormData({ ...formData, steps: [...formData.steps, { title: "", description: "" }] }); markAsDirty(); };
    const removeStep = (idx: number) => { const n = [...formData.steps]; n.splice(idx, 1); setFormData({ ...formData, steps: n }); markAsDirty(); };
    const updateStep = (idx: number, field: keyof Step, val: string) => { const n = [...formData.steps]; n[idx] = { ...n[idx], [field]: val }; setFormData({ ...formData, steps: n }); markAsDirty(); };
    const addQuestion = (type: 'pre_test' | 'post_test') => {
        setFormData({ ...formData, questions: [...formData.questions, { type, question: "", options: ["", "", "", ""], correct_answer: "0", options_media: [null, null, null, null], options_media_files: [null, null, null, null] as (File | null)[] }] }); markAsDirty(); 
    };
    const updateGlobalQuestion = (originalIdx: number, field: string, val: any) => {
        const updatedQuestions = formData.questions.map((q, i) => i === originalIdx ? { ...q, [field]: val } : q);
        setFormData({ ...formData, questions: updatedQuestions }); markAsDirty(); 
    };
    const updateGlobalOption = (originalIdx: number, optIdx: number, val: string) => { const n = [...formData.questions]; n[originalIdx].options[optIdx] = val; setFormData({ ...formData, questions: n }); markAsDirty(); };
    const removeGlobalQuestion = (originalIdx: number) => { const n = [...formData.questions]; n.splice(originalIdx, 1); setFormData({ ...formData, questions: n }); markAsDirty(); };

    return (
        <div className="flex min-h-screen bg-background font-sans text-foreground">
            <Head title={`Edit - ${module.title}`} />
            <div className="hidden md:block"><SidebarPengajar /></div>
            
            {/* ✅ TOASTER CONFIG YANG ESTETIK & PUTIH */}
            <Toaster 
                position="top-right" 
                theme="light" // Memaksa tema terang
                toastOptions={{
                    style: {
                        background: 'white',
                        color: '#1e293b', // slate-800
                        border: '2px solid #f1f5f9', // slate-100
                        borderRadius: '16px', // Rounded cantik
                        padding: '16px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        fontSize: '14px'
                    },
                    classNames: {
                        title: "font-bold text-base text-slate-800",
                        description: "text-slate-500 font-medium mt-1",
                        actionButton: "bg-orange-500 text-white font-bold",
                        cancelButton: "bg-slate-100 text-slate-500",
                    }
                }}
            />

            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <HeaderPengajar />
                <div className="flex-1 flex overflow-hidden">
                    {/* SIDEBAR */}
                    <aside className="w-72 bg-card border-r-2 border-border overflow-y-auto p-6 hidden lg:block">
                        <Link href="/pengajar/modul" className="flex items-center text-muted-foreground hover:text-primary mb-6 font-bold text-sm">
                            <ArrowLeft size={16} className="mr-2" /> Kembali ke Modul
                        </Link>
                        <h2 className="font-black text-xl mb-4 text-foreground">Struktur Materi</h2>
                        <div className="space-y-2">
                            <NavButton active={activeSection === 'info'} onClick={() => setActiveSection('info')} icon={FileText} label="Informasi Umum" />
                            <div className="my-4 border-t border-border"></div>
                            <NavButton active={activeSection === 'pre_test'} onClick={() => setActiveSection('pre_test')} icon={HelpCircle} label={`Pre-Test (${preTestQuestions.length})`} />
                            <NavButton active={activeSection === 'steps'} onClick={() => setActiveSection('steps')} icon={ListChecks} label={`Praktikum (${formData.steps.length})`} />
                            <NavButton active={activeSection === 'post_test'} onClick={() => setActiveSection('post_test')} icon={HelpCircle} label={`Post-Test (${postTestQuestions.length})`} />
                        </div>
                    </aside>

                    {/* CONTENT */}
                    <div className="flex-1 overflow-y-auto bg-muted/10 p-6 md:p-10 relative">
                        <div className="max-w-4xl mx-auto pb-24">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h1 className="text-3xl font-black text-foreground capitalize">{activeSection.replace('_', ' ')}</h1>
                                    <p className="text-muted-foreground font-medium">Edit konten modul dan materi pembelajaran.</p>
                                </div>
                                <div className="flex gap-3">
                                    <a href={`/pengajar/modul/${module.id}/preview`} target="_blank" rel="noreferrer">
                                        <Button variant="secondary" className="font-bold shadow-sm rounded-xl px-6 h-12 border-2 border-border hover:bg-muted">
                                            <Eye className="mr-2 h-5 w-5" /> Preview Siswa
                                        </Button>
                                    </a>
                                    
                                    {/* ✅ TOMBOL UTAMA (Efek Pulse Halus jika Dirty) */}
                                    <Button 
                                        onClick={handleSave} 
                                        disabled={isSaving} 
                                        className={`
                                            font-bold shadow-lg rounded-xl px-6 h-12 transition-all duration-300
                                            ${isDirty 
                                                ? "bg-primary hover:bg-primary/90 ring-4 ring-primary/20 animate-pulse" 
                                                : "bg-primary text-primary-foreground"
                                            }
                                        `}
                                    >
                                        {isSaving ? "Menyimpan..." : (
                                            <>
                                                <Save className="mr-2 h-5 w-5" /> 
                                                {isDirty ? "Simpan Perubahan" : "Simpan Perubahan"}
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>

                            {/* ALERT BANNER */}
                            {isDirty && (
                                <div className="mb-6 bg-yellow-50 border border-yellow-200 p-4 rounded-2xl shadow-sm flex items-center gap-3 animate-in slide-in-from-top-2">
                                    <div className="bg-yellow-100 p-2 rounded-full">
                                        <AlertTriangle className="text-yellow-600" size={20} />
                                    </div>
                                    <p className="text-yellow-800 text-sm font-bold">
                                        Anda memiliki perubahan yang belum disimpan. Jangan lupa simpan sebelum keluar.
                                    </p>
                                </div>
                            )}

                            <Card className="p-8 rounded-[2rem] border-2 border-border shadow-sm bg-card">
                                {/* INFO SECTION */}
                                {activeSection === 'info' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="col-span-2">
                                            <Label className="font-bold">Judul Modul</Label>
                                            <Input value={formData.title} onChange={e => updateField('title', e.target.value)} className="rounded-xl border-2 h-12 bg-background font-bold text-lg" />
                                        </div>
                                        <div>
                                            <Label className="font-bold">Kategori</Label>
                                            <Select value={formData.category} onValueChange={(val) => updateField('category', val)}>
                                                <SelectTrigger className="rounded-xl border-2 h-12 bg-background"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="beginner">Beginner</SelectItem>
                                                    <SelectItem value="intermediate">Intermediate</SelectItem>
                                                    <SelectItem value="advanced">Advanced</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label className="font-bold">Estimasi Durasi</Label>
                                            <Input value={formData.duration} onChange={e => updateField('duration', e.target.value)} className="rounded-xl border-2 h-12 bg-background" />
                                        </div>
                                        <div className="col-span-2">
                                            <Label className="font-bold">Deskripsi Singkat</Label>
                                            <Textarea value={formData.description} onChange={e => updateField('description', e.target.value)} className="rounded-xl border-2 min-h-[150px] bg-background text-base" />
                                        </div>
                                    </div>
                                )}

                                {/* STEPS & QUIZ CODE (Disingkat) */}
                                {activeSection === 'steps' && (
                                    <div className="space-y-6">
                                        {formData.steps.map((step, idx) => (
                                            <div key={idx} className="flex gap-4 group border-b-2 border-dashed border-border pb-6 last:border-0">
                                                <div className="flex flex-col items-center gap-2"><div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0">{idx + 1}</div></div>
                                                <div className="flex-1 space-y-3">
                                                    <div className="flex gap-3"><Input value={step.title} onChange={e => updateStep(idx, 'title', e.target.value)} placeholder="Judul Langkah" className="font-bold border-2 rounded-xl h-12 bg-background"/><Button variant="ghost" size="icon" className="text-destructive" onClick={() => removeStep(idx)}><X size={20} /></Button></div>
                                                    <Textarea value={step.description} onChange={e => updateStep(idx, 'description', e.target.value)} placeholder="Deskripsi instruksi..." className="rounded-xl border-2 bg-background"/>
                                                    <MediaUploader mediaUrl={step.media_url} mediaType={step.media_type} onChange={(e: ChangeEvent<HTMLInputElement>) => handleFileChange(e, idx, 'steps')} onRemove={() => removeMedia(idx, 'steps')} />
                                                </div>
                                            </div>
                                        ))}
                                        <Button variant="outline" onClick={addStep} className="w-full border-2 border-dashed border-primary/50 text-primary font-bold h-12 rounded-xl"><Plus className="mr-2" /> Tambah Langkah Baru</Button>
                                    </div>
                                )}
                                {(activeSection === 'pre_test' || activeSection === 'post_test') && (
                                    <div className="space-y-8">
                                        {activeSection === 'post_test' && (
                                            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 flex items-center gap-3 mb-6"><Checkbox id="sameAsPreTest" checked={isPostTestSame} onCheckedChange={(c) => handleSameAsPreTestChange(c as boolean)} /><Label htmlFor="sameAsPreTest" className="font-bold text-blue-800 cursor-pointer flex-1">Samakan soal Post-Test dengan Pre-Test?</Label></div>
                                        )}
                                        {formData.questions.map((q, i) => {
                                            if (q.type !== activeSection) return null;
                                            return (
                                                <div key={i} className={`p-6 rounded-2xl border relative ${isPostTestSame && activeSection === 'post_test' ? 'bg-gray-100 border-gray-200 opacity-80' : 'bg-muted/30 border-border'}`}>
                                                    <button onClick={() => removeGlobalQuestion(i)} disabled={isPostTestSame && activeSection === 'post_test'} className="absolute top-4 right-4 text-muted-foreground hover:text-destructive disabled:opacity-0"><X size={18} /></button>
                                                    <Badge variant="outline" className="mb-2 bg-background">Soal {activeSection === 'pre_test' ? 'Pre-Test' : 'Post-Test'}</Badge>
                                                    <div className="mb-4 space-y-3">
                                                        <Label className="block font-bold">Pertanyaan Utama</Label>
                                                        <Input value={q.question} onChange={e => updateGlobalQuestion(i, 'question', e.target.value)} className="bg-background border-2 rounded-xl font-medium" disabled={isPostTestSame && activeSection === 'post_test'} />
                                                        {!(isPostTestSame && activeSection === 'post_test') && (<MediaUploader mediaUrl={q.media_url} mediaType={q.media_type} onChange={(e: ChangeEvent<HTMLInputElement>) => handleFileChange(e, i, 'questions')} onRemove={() => removeMedia(i, 'questions')} />)}
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                        {q.options.map((opt, optIdx) => (
                                                            <div key={optIdx} className="space-y-2">
                                                                <div className="flex items-center gap-2">
                                                                    <div className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center font-bold border-2 ${q.correct_answer === optIdx.toString() ? 'bg-green-500 text-white border-green-600' : 'bg-background text-muted-foreground border-border'}`}>{['A','B','C','D'][optIdx]}</div>
                                                                    <div className="flex-1 relative">
                                                                        <Input value={opt} onChange={e => updateGlobalOption(i, optIdx, e.target.value)} className={`bg-background rounded-xl border-2 pr-10 ${q.correct_answer === optIdx.toString() ? 'border-green-500' : ''}`} placeholder={`Teks Pilihan ${optIdx + 1}`} disabled={isPostTestSame && activeSection === 'post_test'} />
                                                                        {! (isPostTestSame && activeSection === 'post_test') && (<div className="absolute right-2 top-1/2 -translate-y-1/2"><Label htmlFor={`opt-file-${i}-${optIdx}`} className="cursor-pointer text-muted-foreground hover:text-primary transition-colors p-1 block"><ImageIcon size={18} /></Label><input type="file" id={`opt-file-${i}-${optIdx}`} className="hidden" accept="image/*" onChange={(e) => handleOptionFileChange(e, i, optIdx)} /></div>)}
                                                                    </div>
                                                                </div>
                                                                {q.options_media && q.options_media[optIdx] && (<div className="ml-12 relative w-24 h-24 rounded-lg border-2 border-border overflow-hidden group"><img src={q.options_media[optIdx]?.url} className="w-full h-full object-cover" />{! (isPostTestSame && activeSection === 'post_test') && (<button onClick={() => removeOptionMedia(i, optIdx)} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"><X size={16} /></button>)}</div>)}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="flex items-center gap-3 justify-end"><Label className="text-xs font-bold text-muted-foreground">Kunci Jawaban:</Label><Select value={q.correct_answer} onValueChange={val => updateGlobalQuestion(i, 'correct_answer', val)} disabled={isPostTestSame && activeSection === 'post_test'}><SelectTrigger className="w-32 bg-background border-2 rounded-lg h-9"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="0">A</SelectItem><SelectItem value="1">B</SelectItem><SelectItem value="2">C</SelectItem><SelectItem value="3">D</SelectItem></SelectContent></Select></div>
                                                </div>
                                            );
                                        })}
                                        {!(isPostTestSame && activeSection === 'post_test') && (<Button onClick={() => addQuestion(activeSection)} variant="outline" className="w-full border-2 border-dashed border-primary/50 text-primary font-bold h-12 rounded-xl"><Plus className="mr-2" /> Tambah Soal</Button>)}
                                    </div>
                                )}
                            </Card>
                        </div>
                    </div>
                </div>

                {/* ✅ MODAL KONFIRMASI (MERAH/DANGER) */}
                <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
                    <DialogContent className="bg-white rounded-[2rem] border-0 shadow-2xl p-8 max-w-sm w-full mx-auto font-sans">
                        <div className="flex flex-col items-center text-center space-y-6">
                            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center animate-in zoom-in-50 duration-300">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                    <AlertOctagon className="text-red-600 w-7 h-7" strokeWidth={2.5} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <DialogTitle className="text-2xl font-black text-slate-900">Keluar tanpa simpan?</DialogTitle>
                                <DialogDescription className="text-slate-500 font-medium text-base leading-relaxed">
                                    Perubahan Anda belum disimpan. Jika Anda keluar sekarang, data akan <span className="text-red-600 font-bold">hilang permanen</span>.
                                </DialogDescription>
                            </div>
                            <DialogFooter className="flex flex-col gap-3 w-full pt-2 sm:flex-col"> 
                                <Button variant="destructive" onClick={handleConfirmExit} className="w-full h-12 rounded-xl font-bold bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 transition-all text-base">Ya, Keluar & Hapus Data</Button>
                                <Button variant="ghost" onClick={handleCancelExit} className="w-full h-12 rounded-xl font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all">Batal, Saya Mau Simpan</Button>
                            </DialogFooter>
                        </div>
                    </DialogContent>
                </Dialog>

            </main>
        </div>
    );
}

// --- SUB-COMPONENTS ---
function NavButton({ active, onClick, icon: Icon, label }: any) {
    return <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${active ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}><Icon size={18} strokeWidth={2.5} />{label}{active && <CheckCircle size={16} className="ml-auto opacity-50" />}</button>
}

function MediaUploader({ mediaUrl, mediaType, onChange, onRemove }: any) {
    return <div className="bg-muted/20 border-2 border-dashed border-border rounded-xl p-4"><div className="flex justify-between items-center mb-2"><Label className="text-xs font-bold text-muted-foreground flex items-center gap-2">{mediaUrl ? (mediaType === 'video' ? <Film size={14}/> : <ImageIcon size={14}/>) : <ImageIcon size={14}/>} Media Visual</Label>{mediaUrl && <Button variant="link" size="sm" onClick={onRemove} className="text-destructive h-auto p-0 text-xs">Hapus</Button>}</div>{mediaUrl ? (<div className="relative rounded-lg overflow-hidden bg-black/5 border border-border">{mediaType === 'video' ? <video src={mediaUrl} controls className="w-full h-48 object-cover" /> : <img src={mediaUrl} alt="Preview" className="w-full h-48 object-contain" />}</div>) : (<div className="relative"><input type="file" accept="image/*,video/*" onChange={onChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" /><div className="flex flex-col items-center justify-center py-6 text-muted-foreground hover:bg-muted/50 transition-colors rounded-lg cursor-pointer"><Plus size={24} className="mb-2 opacity-50" /><span className="text-xs font-bold">Upload Media</span></div></div>)}</div>
}