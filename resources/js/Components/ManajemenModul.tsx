import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SidebarPengajar from '@/Components/SidebarPengajar';
import HeaderPengajar from '@/Components/HeaderPengajar';
import { 
    Plus, Search, Eye, Edit2, MoreHorizontal, 
    Layers, FileText, Save, X, Sparkles, Book 
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Card, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { toast } from 'sonner';

// --- TYPES ---
declare function route(name: string, params?: any): string;

interface Module {
    id: number;
    title: string;
    subtitle: string;
    emoji: string;
    steps_count: number;
    questions_count: number;
}

interface Props {
    auth: any;
    modules: Module[];
    globalSoftSkills: string[];
}

// --- SUB-COMPONENT: Empty State (Style Lama) ---
const EmptyState = () => (
    <div className="text-center py-16 bg-white border-2 border-dashed border-slate-200 rounded-[1.5rem] w-full">
        <Book className="mx-auto h-12 w-12 text-slate-300 mb-3"/>
        <p className="text-slate-500 font-medium text-lg">Belum ada modul ditemukan.</p>
    </div>
);

// --- SUB-COMPONENT: Module Card (Style Lama - Lebih Bersih) ---
const ModuleCard = ({ modul, index }: { modul: Module; index: number }) => (
    <Card className="group border border-slate-200 rounded-[1.5rem] hover:border-orange-300 transition-all duration-300 hover:shadow-md bg-white w-full">
        <CardContent className="p-6 flex items-center gap-5">
            {/* Icon Emoji (Style Awal: Background Abu Muda) */}
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-3xl">
                {modul.emoji || '📘'}
            </div>

            {/* Content Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                    <div>
                        {/* Judul Modul */}
                        <h3 className="font-bold text-lg text-slate-800 mb-2 truncate group-hover:text-orange-600 transition-colors">
                            {index + 1}. {modul.title}
                        </h3>
                        
                        {/* Badges (Style Awal: Simple Gray) */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-semibold">
                                <Layers size={14} /> {modul.steps_count} Langkah
                            </div>
                            <div className="flex items-center gap-1.5 bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-semibold">
                                <FileText size={14} /> {modul.questions_count} Soal
                            </div>
                        </div>
                    </div>

                    {/* Mobile Actions */}
                    <div className="sm:hidden">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400"><MoreHorizontal size={18}/></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => window.location.href = route('pengajar.modul.preview', modul.id)}>Preview</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => window.location.href = route('pengajar.modul.edit', modul.id)}>Edit</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">Hapus</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            {/* Desktop Actions (Style Awal: Simple Icons) */}
            <div className="hidden sm:flex items-center gap-1 self-center ml-auto pl-4">
                <Link href={route('pengajar.modul.preview', modul.id)}>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Preview">
                        <Eye size={18} />
                    </Button>
                </Link>
                <Link href={route('pengajar.modul.edit', modul.id)}>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-slate-400 hover:text-orange-600 hover:bg-orange-50 transition-colors" title="Edit">
                        <Edit2 size={18} />
                    </Button>
                </Link>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors">
                            <MoreHorizontal size={18} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 rounded-xl shadow-lg border border-slate-100">
                        <DropdownMenuItem className="text-red-600 focus:text-red-600 cursor-pointer font-medium">
                            <X className="mr-2 h-4 w-4"/> Hapus Modul
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </CardContent>
    </Card>
);

// --- MAIN COMPONENT ---

export default function ManajemenModul({ auth, modules = [], globalSoftSkills = [] }: Props) {
    const [searchQuery, setSearchQuery] = useState("");
    const [softSkills, setSoftSkills] = useState<string[]>(globalSoftSkills);
    const [newSkill, setNewSkill] = useState("");
    
    const { setData, put, processing } = useForm({
        soft_skills: globalSoftSkills
    });

    const filteredModules = modules.filter(m => 
        m.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddSkill = () => {
        if (newSkill.trim() && !softSkills.includes(newSkill)) {
            const updated = [...softSkills, newSkill];
            setSoftSkills(updated);
            setData('soft_skills', updated);
            setNewSkill("");
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        const updated = softSkills.filter(s => s !== skillToRemove);
        setSoftSkills(updated);
        setData('soft_skills', updated);
    };

    const handleSaveSettings = () => {
        put(route('pengajar.modul.global-soft-skills'), {
            onSuccess: () => toast.success("Pengaturan tersimpan!")
        });
    };

    return (
        <div className="flex min-h-screen bg-[#FAFAF9] font-sans text-foreground">
            <Head title="Bank Modul" />
            
            {/* SIDEBAR FIXED */}
            <div className="hidden md:block w-64 fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200">
                <SidebarPengajar />
            </div>

            {/* MAIN CONTENT WRAPPER */}
            <div className="flex-1 flex flex-col md:ml-64 min-h-screen transition-all duration-300 relative">
                
                {/* HEADER (Sticky) */}
                <div className="sticky top-0 z-40 bg-[#FAFAF9]/95 backdrop-blur-sm border-b border-slate-200/50 w-full">
                     <HeaderPengajar />
                </div>

                {/* CONTENT AREA */}
                <main className="flex-1 p-6 md:p-10 w-full">
                    <div className="max-w-7xl mx-auto space-y-8 pb-20">
                        
                        {/* Title & Action */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                                    Bank Modul & Kuis <span className="text-2xl">📚</span>
                                </h1>
                                <p className="text-slate-500 mt-1 font-medium">
                                    Kelola materi praktikum dan konfigurasi penilaian.
                                </p>
                            </div>
                            <Link href={route('pengajar.modul.store')}>
                                <Button className="h-11 px-6 rounded-full font-bold shadow-md bg-orange-500 hover:bg-orange-600 text-white transition-all">
                                    <Plus className="mr-2 h-5 w-5" /> Modul Baru
                                </Button>
                            </Link>
                        </div>

                        {/* Grid Content */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            
                            {/* KIRI: List Modul (8 Kolom) */}
                            <div className="lg:col-span-8 space-y-6">
                                {/* Search Bar (Style Lama: Simple Rounded) */}
                                <div className="relative group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                                    <Input 
                                        placeholder="Cari modul..." 
                                        className="pl-12 h-12 rounded-xl border border-slate-200 bg-white shadow-sm focus:border-orange-500 focus:ring-0 text-base w-full"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>

                                {/* List Cards */}
                                <div className="space-y-4">
                                    {filteredModules.length > 0 ? (
                                        filteredModules.map((modul, index) => (
                                            <ModuleCard key={modul.id} modul={modul} index={index} />
                                        ))
                                    ) : (
                                        <EmptyState />
                                    )}
                                </div>
                            </div>

                            {/* KANAN: Global Settings (Style Lama: Card Putih Bersih) */}
                            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28 w-full">
                                <Card className="rounded-[1.5rem] border border-slate-200 shadow-sm bg-white overflow-hidden w-full">
                                    <CardContent className="p-6 space-y-6">
                                        <div>
                                            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-1">
                                                <span className="bg-orange-100 text-orange-600 p-1.5 rounded-lg">
                                                    <Sparkles size={18} />
                                                </span>
                                                Global Soft Skills
                                            </h3>
                                            <p className="text-xs text-slate-500 leading-relaxed ml-1">
                                                Kriteria ini otomatis muncul saat input nilai soft skill siswa.
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex gap-2 w-full">
                                                <Input 
                                                    placeholder="Tambah kriteria..." 
                                                    className="h-10 rounded-lg text-sm bg-slate-50 border border-slate-200 focus:border-orange-500 focus:ring-0 flex-1"
                                                    value={newSkill}
                                                    onChange={(e) => setNewSkill(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                                                />
                                                <Button size="icon" onClick={handleAddSkill} className="bg-slate-800 hover:bg-slate-700 h-10 w-10 shrink-0 rounded-lg">
                                                    <Plus size={18} />
                                                </Button>
                                            </div>

                                            <div className="flex flex-wrap gap-2 min-h-[60px] content-start w-full">
                                                {softSkills.length > 0 ? (
                                                    softSkills.map((skill, idx) => (
                                                        <Badge key={idx} variant="secondary" className="bg-slate-50 border border-slate-200 text-slate-600 pl-3 pr-1 py-1 rounded-md flex items-center gap-1.5 text-xs font-medium">
                                                            {skill}
                                                            <button onClick={() => handleRemoveSkill(skill)} className="hover:bg-slate-200 rounded-full p-0.5 text-slate-400 hover:text-red-500 transition-colors">
                                                                <X size={12} />
                                                            </button>
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <div className="text-xs text-slate-400 italic w-full text-center py-2">Belum ada kriteria.</div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-slate-100 w-full">
                                            <Button 
                                                onClick={handleSaveSettings} 
                                                disabled={processing}
                                                className="w-full h-10 rounded-xl font-bold bg-green-600 hover:bg-green-700 text-white shadow-sm text-sm"
                                            >
                                                <Save size={16} className="mr-2" /> Simpan Pengaturan
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}