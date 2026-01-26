import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import SidebarPengajar from "@/Components/SidebarPengajar";
import HeaderPengajar from "@/Components/HeaderPengajar";
import { 
    Plus, Search, Edit2, Trash2, User, School, Accessibility, Eye, MoreHorizontal 
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/Components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Toaster } from "@/Components/ui/sonner";
import { toast } from "sonner";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/Components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu"

// --- TYPES ---
interface Student {
    id: number;
    name: string;
    email: string;
    school_grade?: string; 
    disability?: string;   
    kelas_nama: string; 
    kelas_color?: string;
    joined_at: string;
    phone?: string;
}

export default function ManajemenPeserta({ auth, students }: { auth: any, students: Student[] }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);

    // Form Data State
    const [formData, setFormData] = useState({
        name: "", 
        school_grade: "", 
        disability: "", 
        email: "",
        phone: ""
    });

    // --- LOGIC ---
    const filteredStudents = students.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openModal = (student?: Student) => {
        if (student) {
            setEditingStudent(student);
            setFormData({
                name: student.name,
                school_grade: student.school_grade || "",
                disability: student.disability || "",
                email: student.email,
                phone: student.phone || ""
            });
        } else {
            setEditingStudent(null);
            setFormData({ name: "", school_grade: "", disability: "", email: "", phone: "" });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = () => {
        const submitData = {
            ...formData,
            // Auto-generate email dummy jika kosong untuk kebutuhan backend
            email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '')}@siswa.ypac`,
            password: 'password', 
            role: 'student',
            status_pkl: 'Belum Siap' 
        };

        if (editingStudent) {
            router.put(`/pengajar/siswa/${editingStudent.id}`, submitData, {
                onSuccess: () => { setIsModalOpen(false); toast.success("Biodata siswa diperbarui!"); }
            });
        } else {
            router.post('/pengajar/siswa', submitData, {
                onSuccess: () => { setIsModalOpen(false); toast.success("Siswa baru terdaftar!"); }
            });
        }
    };

    const handleDelete = (id: number) => {
        if(confirm("Hapus data siswa ini secara permanen?")) {
            router.delete(`/pengajar/siswa/${id}`, {
                onSuccess: () => toast.success("Siswa dihapus.")
            });
        }
    };

    return (
        <div className="flex min-h-screen bg-background font-sans text-foreground">
            <Head title="Data Peserta Didik" />
            <div className="hidden md:block"><SidebarPengajar /></div>
            <Toaster position="top-right" />
            
            <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#FAFAF9]">
                <HeaderPengajar />
                
                <div className="flex-1 overflow-y-auto p-6 md:p-10">
                    <div className="max-w-7xl mx-auto space-y-8 pb-20">
                        
                        {/* HEADER & ACTIONS */}
                        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6">
                            <div>
                                <h1 className="text-4xl font-black text-foreground mb-2 tracking-tight">Master Data Siswa 🎓</h1>
                                <p className="text-muted-foreground text-lg font-medium">Database seluruh siswa SLB YPAC.</p>
                            </div>
                            
                            <Button onClick={() => openModal()} className="bg-primary text-primary-foreground font-bold rounded-2xl h-14 px-8 text-lg shadow-lg shadow-orange-200 hover:bg-primary/90 transition-all active:scale-95">
                                <Plus className="mr-2 h-6 w-6" strokeWidth={3} /> Tambah Siswa Baru
                            </Button>
                        </div>

                        {/* LIST SISWA */}
                        <Card className="rounded-[2.5rem] border-2 border-border/60 shadow-sm overflow-hidden bg-white">
                            <div className="p-6 border-b border-border/60 bg-muted/10">
                                <div className="relative w-full md:w-96">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                                    <Input 
                                        placeholder="Cari nama siswa..." 
                                        className="pl-12 h-12 rounded-xl border-2 bg-white focus-visible:ring-primary font-medium"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-muted/20">
                                        <TableRow className="hover:bg-transparent border-border/60">
                                            <TableHead className="pl-8 py-5 font-bold text-muted-foreground uppercase text-xs tracking-wider">Nama Siswa</TableHead>
                                            <TableHead className="font-bold text-muted-foreground uppercase text-xs tracking-wider">Jenjang & Disabilitas</TableHead>
                                            <TableHead className="font-bold text-muted-foreground uppercase text-xs tracking-wider">Status Kelas</TableHead>
                                            <TableHead className="pr-8 text-right font-bold text-muted-foreground uppercase text-xs tracking-wider">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredStudents.length > 0 ? filteredStudents.map((student) => (
                                            <TableRow key={student.id} className="hover:bg-orange-50/30 transition-colors border-border/60 group">
                                                
                                                {/* KOLOM NAMA (Email dihapus) */}
                                                <TableCell className="pl-8 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                                            <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${student.name}`} />
                                                            <AvatarFallback className="bg-orange-100 text-orange-700 font-bold">{student.name.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-bold text-base text-foreground group-hover:text-primary transition-colors">{student.name}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                <TableCell>
                                                    <div className="flex flex-col items-start gap-1.5">
                                                        <div className="flex items-center gap-2">
                                                            <School size={14} className="text-slate-400" />
                                                            <span className="text-sm font-bold text-slate-700">{student.school_grade || "-"}</span>
                                                        </div>
                                                        {student.disability ? (
                                                            <div className="flex items-center gap-2">
                                                                <Accessibility size={14} className="text-slate-400" />
                                                                <Badge variant="secondary" className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border-0">
                                                                    {student.disability}
                                                                </Badge>
                                                            </div>
                                                        ) : <span className="text-xs text-muted-foreground italic pl-6">-</span>}
                                                    </div>
                                                </TableCell>

                                                <TableCell>
                                                    {student.kelas_nama !== 'Belum ada kelas' ? (
                                                        <Badge variant="outline" className="bg-white border-2 border-green-200 text-green-700 font-bold rounded-lg text-[10px] px-2 py-1">
                                                            Aktif: {student.kelas_nama}
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-xs text-slate-400 italic">Belum masuk kelas</span>
                                                    )}
                                                </TableCell>

                                                <TableCell className="pr-8 text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="rounded-xl border-2 shadow-lg w-48">
                                                            <DropdownMenuLabel>Aksi Siswa</DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/pengajar/siswa/${student.id}`} className="cursor-pointer font-medium">
                                                                    <Eye className="mr-2 h-4 w-4" /> Lihat Detail & Nilai
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => openModal(student)} className="cursor-pointer font-medium">
                                                                <Edit2 className="mr-2 h-4 w-4" /> Edit Biodata
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => handleDelete(student.id)} className="cursor-pointer font-medium text-red-600 focus:text-red-600 focus:bg-red-50">
                                                                <Trash2 className="mr-2 h-4 w-4" /> Hapus Siswa
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>

                                            </TableRow>
                                        )) : (
                                            <TableRow>
                                                <TableCell colSpan={4} className="h-40 text-center text-muted-foreground">
                                                    <User size={48} className="mb-2 opacity-20 mx-auto" />
                                                    <p>Tidak ada siswa ditemukan.</p>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* MODAL FORM (Ringkas: Nama, Jenjang, Disabilitas) */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="rounded-[2.5rem] p-8 sm:max-w-[500px] border-2 border-border bg-card">
                        <DialogHeader>
                            <DialogTitle className="text-3xl font-black text-foreground">
                                {editingStudent ? "Edit Biodata" : "Tambah Siswa Baru"}
                            </DialogTitle>
                        </DialogHeader>
                        
                        <div className="space-y-4 py-4">
                            <div className="grid gap-2">
                                <Label className="font-bold ml-1">Nama Lengkap</Label>
                                <Input 
                                    className="pl-4 rounded-xl border-2 h-12 font-medium" 
                                    placeholder="Nama siswa..." 
                                    value={formData.name} 
                                    onChange={e => setFormData({...formData, name: e.target.value})} 
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label className="font-bold ml-1">Jenjang Kelas</Label>
                                <Input 
                                    className="pl-4 rounded-xl border-2 h-12 font-medium" 
                                    placeholder="Contoh: Kelas 1 SMA / 7 SMP" 
                                    value={formData.school_grade} 
                                    onChange={e => setFormData({...formData, school_grade: e.target.value})} 
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label className="font-bold ml-1">Ragam Disabilitas</Label>
                                <Input 
                                    className="pl-4 rounded-xl border-2 h-12 font-medium" 
                                    placeholder="Contoh: Tunarungu, Tunadaksa..." 
                                    value={formData.disability} 
                                    onChange={e => setFormData({...formData, disability: e.target.value})} 
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button onClick={handleSubmit} className="w-full h-14 rounded-2xl font-bold text-lg shadow-lg bg-primary hover:bg-primary/90">
                                {editingStudent ? "Simpan Perubahan" : "Simpan Data"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </main>
        </div>
    );
}