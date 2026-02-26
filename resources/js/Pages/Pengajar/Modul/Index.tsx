import { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import SidebarPengajar from '@/Components/SidebarPengajar';
import HeaderPengajar from '@/Components/HeaderPengajar';
import { 
    Plus, Search, MoreHorizontal, Edit3, Trash2, Eye, BookOpen, 
    Settings, Save, X 
} from 'lucide-react';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from "@/Components/ui/dropdown-menu";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from "@/Components/ui/dialog";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { toast } from "sonner"; // Pastikan sudah install sonner

export default function ModulIndex({ auth, modules, globalSoftSkills }: any) {
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Form Helper dari Inertia
    const { data, setData, post, processing, reset, errors } = useForm({
        title: '',
        description: '',
    });

    // --- FILTER SEARCH ---
    const filteredModules = modules.filter((m: any) => 
        m.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // --- HANDLE SUBMIT ---
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/pengajar/modul', {
            onSuccess: () => {
                setIsCreateOpen(false);
                reset();
                toast.success("Modul berhasil dibuat! 🚀");
            },
            onError: () => {
                toast.error("Gagal membuat modul. Periksa inputan.");
            }
        });
    };

    // --- HANDLE DELETE ---
    const handleDelete = (id: number) => {
        if(confirm("Yakin ingin menghapus modul ini? Semua materi di dalamnya akan hilang.")) {
            router.delete(`/pengajar/modul/${id}`, {
                onSuccess: () => toast.success("Modul dihapus.")
            });
        }
    }

    return (
        <div className="flex min-h-screen bg-background font-sans text-foreground">
            <Head title="Bank Modul" />
            <div className="hidden md:block"><SidebarPengajar /></div>
            
            <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#FAFAF9]">
                <HeaderPengajar />
                
                <div className="flex-1 overflow-y-auto p-6 md:p-10">
                    <div className="max-w-5xl mx-auto space-y-8 pb-20">
                        
                        {/* HEADER */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-black text-slate-800 flex items-center gap-2">
                                    Bank Modul & Kuis 📚
                                </h1>
                                <p className="text-slate-500 font-medium">Kelola materi praktikum dan konfigurasi penilaian.</p>
                            </div>
                            <Button 
                                onClick={() => setIsCreateOpen(true)} 
                                className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl h-12 px-6 shadow-lg shadow-orange-200 transition-all hover:scale-105"
                            >
                                <Plus className="mr-2" size={20}/> Modul Baru
                            </Button>
                        </div>

                        {/* SEARCH BAR */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <Input 
                                placeholder="Cari modul..." 
                                className="pl-12 h-14 rounded-2xl border-2 border-slate-100 bg-white focus:border-orange-500 text-lg"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* MODULE LIST */}
                        <div className="grid gap-4">
                            {filteredModules.length > 0 ? filteredModules.map((modul: any) => (
                                <Card key={modul.id} className="p-6 rounded-[1.5rem] border-2 border-slate-100 hover:border-orange-200 transition-all shadow-sm bg-white group">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-5">
                                            <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center text-3xl shadow-inner">
                                                {modul.emoji || '☕'}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-800 mb-1">{modul.title}</h3>
                                                <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                                                    <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                                        <BookOpen size={12}/> {modul.steps_count} Langkah
                                                    </span>
                                                    <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                                        <Settings size={12}/> {modul.questions_count} Soal
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Link href={`/pengajar/modul/${modul.id}/preview`}>
                                                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl" title="Preview">
                                                    <Eye size={20}/>
                                                </Button>
                                            </Link>
                                            <Link href={`/pengajar/modul/${modul.id}/edit`}>
                                                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl" title="Edit">
                                                    <Edit3 size={20}/>
                                                </Button>
                                            </Link>
                                            
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="text-slate-300 hover:text-slate-600 rounded-xl">
                                                        <MoreHorizontal size={20}/>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-xl">
                                                    <DropdownMenuItem onClick={() => handleDelete(modul.id)} className="text-red-600 font-bold focus:bg-red-50 focus:text-red-700 cursor-pointer">
                                                        <Trash2 size={16} className="mr-2"/> Hapus Modul
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </Card>
                            )) : (
                                <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                                    <p className="text-slate-400 font-bold">Belum ada modul yang dibuat.</p>
                                </div>
                            )}
                        </div>

                        {/* GLOBAL SOFT SKILLS CONFIG (Optional) */}
                        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm mt-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                                    <Settings size={24}/>
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-800">Global Soft Skills</h3>
                                    <p className="text-sm text-slate-500">Kriteria ini otomatis muncul saat input nilai soft skill siswa.</p>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mb-6">
                                {globalSoftSkills.map((skill: string, idx: number) => (
                                    <Badge key={idx} variant="secondary" className="px-3 py-1.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-sm">
                                        {skill}
                                    </Badge>
                                ))}
                                <Button variant="outline" size="sm" className="rounded-lg border-dashed border-2 text-slate-400">
                                    + Edit Kriteria (Di Pengaturan)
                                </Button>
                            </div>
                        </div>

                    </div>
                </div>

                {/* --- MODAL CREATE MODUL --- */}
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogContent className="sm:max-w-md rounded-[2rem] p-0 overflow-hidden bg-white">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-black text-slate-800">Buat Modul Baru</DialogTitle>
                                <DialogDescription>
                                    Isi informasi dasar modul. Konten materi bisa ditambahkan setelah ini.
                                </DialogDescription>
                            </DialogHeader>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="font-bold text-slate-700">Judul Modul</Label>
                                <Input 
                                    id="title" 
                                    placeholder="Contoh: Teknik Espresso Dasar" 
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all"
                                    required
                                />
                                {errors.title && <span className="text-red-500 text-xs font-bold">{errors.title}</span>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="desc" className="font-bold text-slate-700">Deskripsi Singkat</Label>
                                <Textarea 
                                    id="desc" 
                                    placeholder="Jelaskan secara singkat apa yang akan dipelajari..." 
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    className="min-h-[100px] rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-all resize-none"
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} className="flex-1 h-12 rounded-xl font-bold border-slate-200 text-slate-600">
                                    Batal
                                </Button>
                                <Button type="submit" disabled={processing} className="flex-1 h-12 rounded-xl font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-200">
                                    {processing ? 'Menyimpan...' : 'Simpan & Lanjut'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

            </main>
        </div>
    );
}