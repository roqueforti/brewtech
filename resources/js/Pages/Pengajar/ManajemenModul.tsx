import { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import SidebarPengajar from "@/Components/SidebarPengajar";
import HeaderPengajar from "@/Components/HeaderPengajar";
import { 
    Layers, Plus, Edit2, Trash2, 
    FileText, Clock, ListChecks, HelpCircle, Eye // ✅ Pastikan Eye diimport
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Textarea } from "@/Components/ui/textarea";

// --- TYPES ---
interface Step {
    title: string;
}

interface Question {
    question: string;
}

interface Module {
    id: number;
    title: string;
    description: string;
    category: 'beginner' | 'intermediate' | 'advanced';
    duration: string;
    steps: Step[];
    questions: Question[];
}

interface ManajemenModulProps {
    auth: { user: { name: string } };
    modules: Module[];
}

export default function ManajemenModul({ auth, modules = [] }: ManajemenModulProps) {
    const { errors } = usePage().props;
    const [searchQuery, setSearchQuery] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Form State (Hanya untuk Create)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "beginner",
        duration: "10 Menit",
    });

    const filteredModules = modules.filter(m => 
        m.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // --- HANDLERS ---

    const resetForm = () => {
        setFormData({ 
            title: "", description: "", category: "beginner", duration: "10 Menit" 
        });
    };

    const handleEdit = (modul: Module) => {
        router.visit(`/pengajar/modul/${modul.id}/edit`);
    };

    const handleCreate = () => {
        // ✅ GANTI DI SINI: Gunakan 'as any'
        router.post('/pengajar/modul', formData as any, { 
            onSuccess: () => { 
                setIsDialogOpen(false); 
                resetForm(); 
            }
        });
    };

    const handleDelete = (id: number) => {
        if(confirm("Yakin hapus modul ini?")) router.delete(`/pengajar/modul/${id}`);
    };

    const getCategoryColor = (cat: string) => {
        switch(cat) {
            case 'beginner': return 'bg-green-100 text-green-700 border-green-200';
            case 'intermediate': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'advanced': return 'bg-purple-100 text-purple-700 border-purple-200';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="flex min-h-screen bg-background font-sans text-foreground">
            <Head title="Manajemen Modul" />
            <SidebarPengajar />
            <main className="flex-1 w-full flex flex-col">
                <HeaderPengajar onSearch={setSearchQuery} />
                <div className="p-6 md:p-10 flex-1">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h1 className="text-4xl font-black text-foreground mb-2">Bank Modul & Kuis 📚</h1>
                            <p className="text-muted-foreground">Kelola materi praktikum, langkah-langkah, dan evaluasi siswa.</p>
                        </div>
                        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl h-12 px-6 font-bold shadow-lg">
                            <Plus className="w-5 h-5 mr-2" /> Modul Baru
                        </Button>
                    </div>

                    {/* Module Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredModules.length > 0 ? filteredModules.map((modul) => (
                            <Card key={modul.id} className="p-6 rounded-[2rem] border-2 border-border shadow-sm hover:shadow-md transition-all group bg-card flex flex-col h-full">
                                
                                {/* 1. Header: Icon & Badge */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                                        <Layers size={24} />
                                    </div>
                                    <Badge className={`${getCategoryColor(modul.category)} px-3 py-1 rounded-lg uppercase text-[10px] font-bold shadow-none border`}>
                                        {modul.category}
                                    </Badge>
                                </div>

                                {/* 2. Content: Title & Desc */}
                                <div className="flex-1 mb-6">
                                    <h3 className="text-xl font-black mb-2 line-clamp-1 text-foreground" title={modul.title}>{modul.title}</h3>
                                    <p className="text-muted-foreground text-sm line-clamp-2 h-10">{modul.description}</p>
                                </div>

                                {/* 3. Footer: Stats & Actions */}
                                <div className="pt-4 border-t-2 border-border/50 flex items-center justify-between gap-3 mt-auto">
                                    
                                    {/* Kiri: Statistik Ringkas */}
                                    <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground">
                                        <div className="flex items-center gap-1" title="Durasi">
                                            <Clock size={14} className="text-primary"/> {modul.duration}
                                        </div>
                                        <div className="w-px h-3 bg-border"></div>
                                        <div className="flex items-center gap-1" title="Jumlah Langkah">
                                            <ListChecks size={14}/> {modul.steps?.length || 0}
                                        </div>
                                        <div className="flex items-center gap-1" title="Jumlah Soal">
                                            <HelpCircle size={14}/> {modul.questions?.length || 0}
                                        </div>
                                    </div>

                                    {/* Kanan: Tombol Aksi (Preview, Edit, Delete) */}
                                    <div className="flex items-center gap-2">
                                        {/* ✅ TOMBOL PREVIEW (Mata) */}
                                        <a 
                                            href={`/pengajar/modul/${modul.id}/preview`} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            title="Preview Tampilan Siswa"
                                        >
                                            <Button 
                                                size="icon" 
                                                variant="outline" 
                                                className="h-9 w-9 rounded-xl border-2 text-muted-foreground hover:text-blue-600 hover:border-blue-600 hover:bg-blue-50 transition-colors"
                                            >
                                                <Eye size={16} />
                                            </Button>
                                        </a>

                                        {/* Tombol Edit */}
                                        <Button 
                                            size="icon" 
                                            variant="outline" 
                                            className="h-9 w-9 rounded-xl border-2 text-muted-foreground hover:text-orange-500 hover:border-orange-500 hover:bg-orange-50 transition-colors" 
                                            onClick={() => handleEdit(modul)}
                                            title="Edit Materi Modul"
                                        >
                                            <Edit2 size={16} />
                                        </Button>

                                        {/* Tombol Hapus */}
                                        <Button 
                                            size="icon" 
                                            variant="outline" 
                                            className="h-9 w-9 rounded-xl border-2 text-muted-foreground hover:text-destructive hover:border-destructive hover:bg-destructive/5 transition-colors" 
                                            onClick={() => handleDelete(modul.id)}
                                            title="Hapus Modul"
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </div>

                            </Card>
                        )) : (
                            <div className="col-span-full text-center py-20 text-muted-foreground bg-muted/20 rounded-[2rem] border-2 border-dashed border-border">
                                <FileText size={48} className="mx-auto mb-4 opacity-50" />
                                <p className="font-bold text-lg">Belum ada modul tersedia.</p>
                                <p className="text-sm">Silakan buat modul baru untuk mengisi bank data.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* CREATE MODAL */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="bg-card rounded-[2rem] max-w-lg border-2 border-border">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black text-foreground">Buat Modul Baru</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div>
                                <Label className="font-bold">Judul Modul</Label>
                                <Input 
                                    value={formData.title} 
                                    onChange={(e) => setFormData({...formData, title: e.target.value})} 
                                    placeholder="Contoh: Teknik V60 Basic" 
                                    className="rounded-xl border-2 bg-background"
                                />
                                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="font-bold">Kategori</Label>
                                    <Select value={formData.category} onValueChange={(val: any) => setFormData({...formData, category: val})}>
                                        <SelectTrigger className="rounded-xl border-2 bg-background"><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="beginner">Beginner</SelectItem>
                                            <SelectItem value="intermediate">Intermediate</SelectItem>
                                            <SelectItem value="advanced">Advanced</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label className="font-bold">Estimasi Durasi</Label>
                                    <Input 
                                        value={formData.duration} 
                                        onChange={(e) => setFormData({...formData, duration: e.target.value})} 
                                        placeholder="Ex: 15 Menit"
                                        className="rounded-xl border-2 bg-background"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label className="font-bold">Deskripsi Singkat</Label>
                                <Textarea 
                                    value={formData.description} 
                                    onChange={(e) => setFormData({...formData, description: e.target.value})} 
                                    placeholder="Jelaskan secara singkat isi modul ini..." 
                                    className="rounded-xl border-2 bg-background h-24 resize-none"
                                />
                                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1 rounded-xl font-bold border-2">Batal</Button>
                                <Button onClick={handleCreate} className="flex-1 rounded-xl font-bold bg-primary text-primary-foreground">Lanjut ke Materi &rarr;</Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    );
}