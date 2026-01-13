import { useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import SidebarPengajar from "@/Components/SidebarPengajar";
import HeaderPengajar from "@/Components/HeaderPengajar";
import { 
    BookOpen, Plus, Edit2, Trash2, Users, Calendar, MoreVertical 
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/Components/ui/dialog";
import { Textarea } from "@/Components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";

// --- TYPES ---
interface Classroom {
    id: number;
    name: string;
    description: string;
    status: 'active' | 'archived';
    students_count: number;
    modules_count: number;
    created_at: string;
}

export default function ManajemenKelas({ auth, classrooms = [] }: { auth: any, classrooms: Classroom[] }) {
    const { errors } = usePage().props;
    const [searchQuery, setSearchQuery] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "", description: "" });

    const filteredClassrooms = classrooms.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreate = () => {
        router.post('/pengajar/kelas', formData as any, { 
            onSuccess: () => { setIsDialogOpen(false); setFormData({ name: "", description: "" }); }
        });
    };

    const handleDelete = (id: number) => {
        if(confirm("Yakin hapus kelas ini? Semua data siswa di dalamnya akan ikut terhapus.")) {
            router.delete(`/pengajar/kelas/${id}`);
        }
    };

    return (
        <div className="flex min-h-screen bg-background font-sans text-foreground">
            <Head title="Manajemen Kelas" />
            <SidebarPengajar />
            <main className="flex-1 w-full flex flex-col">
                <HeaderPengajar onSearch={setSearchQuery} />
                <div className="p-6 md:p-10 flex-1">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h1 className="text-4xl font-black text-foreground mb-2">Manajemen Kelas 👨‍🏫</h1>
                            <p className="text-muted-foreground">Buat dan atur kurikulum pelatihan Anda</p>
                        </div>
                        <Button onClick={() => setIsDialogOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl h-12 px-6 font-bold shadow-lg">
                            <Plus className="w-5 h-5 mr-2" /> Buat Kelas
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredClassrooms.map((kelas) => (
                            <Card key={kelas.id} className="p-6 rounded-[2rem] border-2 border-border shadow-sm hover:shadow-md transition-all group bg-card flex flex-col h-full relative overflow-hidden">
                                
                                {/* Decorator Circle */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-10 -mt-10 pointer-events-none"></div>

                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 px-3 py-1 rounded-lg uppercase text-[10px] font-bold shadow-none border">
                                        AKTIF
                                    </Badge>
                                    
                                    {/* ✅ ACTION BUTTONS YANG RAPI */}
                                    <div className="flex gap-2">
                                        <Button 
                                            size="icon" 
                                            variant="ghost" 
                                            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-orange-500 hover:bg-orange-50"
                                            title="Edit Info Kelas"
                                        >
                                            <Edit2 size={16} />
                                        </Button>
                                        <Button 
                                            size="icon" 
                                            variant="ghost" 
                                            onClick={() => handleDelete(kelas.id)}
                                            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50"
                                            title="Hapus Kelas"
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </div>

                                <div className="mb-6 relative z-10">
                                    <h3 className="text-2xl font-black mb-1 text-foreground line-clamp-1">{kelas.name}</h3>
                                    <div className="flex items-center text-xs font-bold text-muted-foreground mb-3">
                                        <Calendar size={14} className="mr-1"/> Jan - Mar 2026
                                    </div>
                                    <p className="text-muted-foreground text-sm line-clamp-2 h-10">{kelas.description}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
                                    <div className="bg-muted/30 rounded-2xl p-3 text-center border border-border/50">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Modul</p>
                                        <p className="text-2xl font-black text-primary">{kelas.modules_count || 0}</p>
                                    </div>
                                    <div className="bg-muted/30 rounded-2xl p-3 text-center border border-border/50">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Peserta</p>
                                        <p className="text-2xl font-black text-primary">{kelas.students_count || 0}</p>
                                    </div>
                                </div>

                                <div className="mt-auto relative z-10">
                                    <Button asChild variant="outline" className="w-full h-12 rounded-xl border-2 font-bold hover:border-primary hover:text-primary transition-colors bg-transparent">
                                        <Link href={`/pengajar/kelas/${kelas.id}`}>
                                            <BookOpen size={18} className="mr-2" /> Kelola Kurikulum
                                        </Link>
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* CREATE MODAL (Sederhana) */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="rounded-[2rem] p-6">
                        <DialogHeader><DialogTitle>Buat Kelas Baru</DialogTitle></DialogHeader>
                        <div className="space-y-4 py-4">
                            <div>
                                <Label>Nama Kelas</Label>
                                <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Contoh: Manual Brew Basic" className="rounded-xl border-2"/>
                            </div>
                            <div>
                                <Label>Deskripsi</Label>
                                <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="rounded-xl border-2"/>
                            </div>
                        </div>
                        <DialogFooter><Button onClick={handleCreate} className="rounded-xl font-bold">Buat Kelas</Button></DialogFooter>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    );
}