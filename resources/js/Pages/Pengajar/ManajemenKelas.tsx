import { useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import SidebarPengajar from "@/Components/SidebarPengajar";
import HeaderPengajar from "@/Components/HeaderPengajar";
import { 
    Users, BookOpen, Plus, MoreVertical, Edit, Trash2, 
    Calendar, AlertCircle, CheckCircle2 
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu";
import { toast } from "sonner";
import { Toaster } from "@/Components/ui/sonner";

interface Kelas {
    id: number;
    nama: string;
    pelatih: string;
    periode: string;
    deskripsi: string;
    theme: string;
    status: string;
    emoji: string;
    students_count: number;
    modules_count: number;
    pending_grading: number; // ✅ Data baru dari Controller
}

interface ManajemenKelasProps {
    auth: { user: any };
    kelas_list: Kelas[];
}

export default function ManajemenKelas({ auth, kelas_list }: ManajemenKelasProps) {
    const { errors } = usePage().props;
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedKelas, setSelectedKelas] = useState<Kelas | null>(null);

    const [formData, setFormData] = useState({
        nama: "", pelatih: auth.user.name, periode: "", deskripsi: "", theme: "blue"
    });

    // --- HANDLERS ---
    const resetForm = () => setFormData({ nama: "", pelatih: auth.user.name, periode: "", deskripsi: "", theme: "blue" });

    const handleCreate = () => {
        router.post('/pengajar/kelas', formData, {
            onSuccess: () => { setIsCreateModalOpen(false); resetForm(); toast.success("Kelas berhasil dibuat!"); }
        });
    };

    const handleEdit = (k: Kelas) => {
        setSelectedKelas(k);
        setFormData({ nama: k.nama, pelatih: k.pelatih, periode: k.periode, deskripsi: k.deskripsi, theme: k.theme });
        setIsEditModalOpen(true);
    };

    const handleUpdate = () => {
        if (!selectedKelas) return;
        router.put(`/pengajar/kelas/${selectedKelas.id}`, formData, {
            onSuccess: () => { setIsEditModalOpen(false); toast.success("Kelas diperbarui!"); }
        });
    };

    const handleDelete = (id: number) => {
        if (confirm("Yakin hapus kelas ini? Semua data siswa & nilai di dalamnya akan ikut terhapus.")) {
            router.delete(`/pengajar/kelas/${id}`, { onSuccess: () => toast.success("Kelas dihapus.") });
        }
    };

    const getThemeColors = (theme: string) => {
        switch (theme) {
            case 'orange': return 'bg-gradient-to-br from-orange-100 to-white border-orange-200 hover:border-orange-300';
            case 'purple': return 'bg-gradient-to-br from-purple-100 to-white border-purple-200 hover:border-purple-300';
            case 'green': return 'bg-gradient-to-br from-green-100 to-white border-green-200 hover:border-green-300';
            default: return 'bg-gradient-to-br from-blue-100 to-white border-blue-200 hover:border-blue-300';
        }
    };

    return (
        <div className="flex min-h-screen bg-background font-sans text-foreground">
            <Head title="Manajemen Kelas" />
            <div className="hidden md:block"><SidebarPengajar /></div>
            
            <main className="flex-1 w-full flex flex-col bg-[#FAFAF9]">
                <HeaderPengajar />
                <Toaster />
                
                <div className="p-6 md:p-10 flex-1 overflow-y-auto">
                    <div className="max-w-7xl mx-auto pb-20">
                        
                        {/* HEADER SECTION */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2 tracking-tight">Manajemen Kelas 🏫</h1>
                                <p className="text-muted-foreground font-medium">Kelola kelas, kurikulum modul, dan siswa dalam satu tempat.</p>
                            </div>
                            <Button 
                                onClick={() => { resetForm(); setIsCreateModalOpen(true); }} 
                                className="bg-primary hover:bg-primary/90 text-white rounded-2xl h-12 px-6 font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105"
                            >
                                <Plus className="w-5 h-5 mr-2" strokeWidth={3} /> Buat Kelas Baru
                            </Button>
                        </div>

                        {/* CLASS GRID */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {kelas_list.map((kelas) => (
                                <Link key={kelas.id} href={`/pengajar/kelas/${kelas.id}`} className="block group h-full">
                                    <Card className={`rounded-[2.5rem] border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col relative ${getThemeColors(kelas.theme)}`}>
                                        
                                        {/* 🔥 NOTIFIKASI PENDING GRADING */}
                                        {kelas.pending_grading > 0 && (
                                            <div className="absolute -top-3 -right-3 z-10 animate-in zoom-in duration-300">
                                                <Badge className="bg-red-500 hover:bg-red-600 text-white border-2 border-white shadow-lg px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
                                                    <AlertCircle size={14} fill="currentColor" className="text-red-500 bg-white rounded-full"/> 
                                                    {kelas.pending_grading} Siswa Belum Dinilai
                                                </Badge>
                                            </div>
                                        )}

                                        <CardHeader className="p-6 pb-2">
                                            <div className="flex justify-between items-start">
                                                {/* PERBAIKAN DI SINI: Ubah variant jadi outline dan set text-slate-800 */}
                                                <Badge variant="outline" className="bg-white text-slate-800 border-slate-200 shadow-sm font-bold mb-3 px-3 py-1 rounded-lg flex items-center gap-1.5">
                                                    <Calendar size={12} className="text-slate-500" /> 
                                                    {kelas.periode}
                                                </Badge>
                                                
                                                {/* Stop propagation agar klik menu tidak membuka detail kelas */}
                                                <div onClick={(e) => e.preventDefault()}>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-muted-foreground hover:text-foreground rounded-full">
                                                                <MoreVertical size={18} />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="rounded-xl border-2">
                                                            <DropdownMenuItem onClick={() => handleEdit(kelas)} className="font-medium cursor-pointer">
                                                                <Edit size={14} className="mr-2"/> Edit Info
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleDelete(kelas.id)} className="text-red-600 font-medium cursor-pointer focus:text-red-700 focus:bg-red-50">
                                                                <Trash2 size={14} className="mr-2"/> Hapus Kelas
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>
                                            <CardTitle className="text-2xl font-black text-slate-800 leading-tight group-hover:text-primary transition-colors">
                                                {kelas.nama}
                                            </CardTitle>
                                        </CardHeader>
                                        
                                        <CardContent className="p-6 pt-2 flex-1">
                                            <p className="text-muted-foreground text-sm line-clamp-2 font-medium leading-relaxed">
                                                {kelas.deskripsi || "Tidak ada deskripsi kelas."}
                                            </p>
                                        </CardContent>

                                        <CardFooter className="p-6 pt-0 mt-auto">
                                            <div className="w-full flex items-center justify-between pt-4 border-t border-black/5">
                                                <div className="flex items-center gap-4 text-sm font-bold text-slate-600">
                                                    <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg shadow-sm border">
                                                        <Users size={14} className="text-blue-500"/> {kelas.students_count}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg shadow-sm border">
                                                        <BookOpen size={14} className="text-orange-500"/> {kelas.modules_count}
                                                    </div>
                                                </div>
                                                <div className="text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                                                    Kelola <span className="ml-1 text-lg">&rarr;</span>
                                                </div>
                                            </div>
                                        </CardFooter>
                                    </Card>
                                </Link>
                            ))}

                            {/* EMPTY STATE */}
                            {kelas_list.length === 0 && (
                                <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-300 rounded-[2.5rem] bg-slate-50">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border">
                                        <Calendar size={32} className="text-slate-300" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-700">Belum ada kelas aktif</h3>
                                    <p className="text-slate-500">Buat kelas baru untuk memulai pembelajaran.</p>
                                </div>
                            )}
                        </div>

                        {/* --- MODAL BUAT KELAS --- */}
                        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                            <DialogContent className="rounded-[2rem] p-8 sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-black">Buat Kelas Baru</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label className="font-bold">Nama Kelas</Label>
                                        <Input value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} placeholder="Contoh: Batch 1 - Barista Dasar" className="h-12 rounded-xl border-2 font-medium"/>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="font-bold">Periode</Label>
                                            <Input value={formData.periode} onChange={e => setFormData({...formData, periode: e.target.value})} placeholder="Jan - Mar 2026" className="h-12 rounded-xl border-2 font-medium"/>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="font-bold">Tema Warna</Label>
                                            <select 
                                                value={formData.theme} 
                                                onChange={e => setFormData({...formData, theme: e.target.value})} 
                                                className="w-full h-12 rounded-xl border-2 font-medium bg-background px-3 focus:ring-2 focus:ring-primary/20 outline-none"
                                            >
                                                <option value="blue">Blue (Standar)</option>
                                                <option value="orange">Orange (Semangat)</option>
                                                <option value="green">Green (Alam)</option>
                                                <option value="purple">Purple (Kreatif)</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-bold">Deskripsi Singkat</Label>
                                        <Input value={formData.deskripsi} onChange={e => setFormData({...formData, deskripsi: e.target.value})} placeholder="Keterangan singkat tentang kelas ini..." className="h-12 rounded-xl border-2 font-medium"/>
                                    </div>
                                    <Button onClick={handleCreate} className="w-full h-12 rounded-xl font-bold text-lg shadow-lg mt-2">Simpan & Buat</Button>
                                </div>
                            </DialogContent>
                        </Dialog>

                        {/* --- MODAL EDIT KELAS --- */}
                        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                            <DialogContent className="rounded-[2rem] p-8 sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-black">Edit Informasi Kelas</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label className="font-bold">Nama Kelas</Label>
                                        <Input value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} className="h-12 rounded-xl border-2 font-medium"/>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="font-bold">Periode</Label>
                                            <Input value={formData.periode} onChange={e => setFormData({...formData, periode: e.target.value})} className="h-12 rounded-xl border-2 font-medium"/>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="font-bold">Tema Warna</Label>
                                            <select 
                                                value={formData.theme} 
                                                onChange={e => setFormData({...formData, theme: e.target.value})} 
                                                className="w-full h-12 rounded-xl border-2 font-medium bg-background px-3 focus:ring-2 focus:ring-primary/20 outline-none"
                                            >
                                                <option value="blue">Blue</option>
                                                <option value="orange">Orange</option>
                                                <option value="green">Green</option>
                                                <option value="purple">Purple</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-bold">Deskripsi</Label>
                                        <Input value={formData.deskripsi} onChange={e => setFormData({...formData, deskripsi: e.target.value})} className="h-12 rounded-xl border-2 font-medium"/>
                                    </div>
                                    <Button onClick={handleUpdate} className="w-full h-12 rounded-xl font-bold text-lg shadow-lg mt-2">Simpan Perubahan</Button>
                                </div>
                            </DialogContent>
                        </Dialog>

                    </div>
                </div>
            </main>
        </div>
    );
}