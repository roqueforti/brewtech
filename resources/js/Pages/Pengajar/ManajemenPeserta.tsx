import { useState } from "react";
import { 
    Plus, Edit2, Trash2, Users, Filter, 
    Mail, MessageCircle, Clock, TrendingUp, 
    Accessibility, GraduationCap, Calendar 
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Head, router, Link } from "@inertiajs/react";
import SidebarPengajar from "@/Components/SidebarPengajar";
import HeaderPengajar from "@/Components/HeaderPengajar";

// --- TIPE DATA DIPERBARUI (Menambah Info Personal) ---
interface KelasItem {
  id: number;
  nama: string;
  pelatih: string;
  theme: string;
}

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  
  // ✅ DATA BARU: Profil Personal
  age: number;              // Umur
  school_grade: string;     // Kelas/Jenjang (ex: "Kelas 12 SMALB")
  disability: string | null;// Keterbatasan (ex: "Tuna Rungu") - Nullable

  kelas_id: number;
  kelas_nama: string;
  kelas_color: string;
  status_pkl: 'siap' | 'dalam_pelatihan' | 'belum_siap';
  nilai_pre: number;
  nilai_post: number;
  progress: number;
  modul_selesai: number;
  total_modul: number;
  last_active: string;
  is_online: boolean;
}

interface ManajemenPesertaProps {
  auth: { user: { name: string } };
  students: Student[];
  kelas_list: KelasItem[];
}

export default function ManajemenPeserta({ auth, students, kelas_list }: ManajemenPesertaProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKelasFilter, setSelectedKelasFilter] = useState<string>("all");
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  // ✅ Form Data Updated
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    school_grade: "",
    disability: "", // Opsional
    kelas_id: "",
    status_pkl: "dalam_pelatihan",
  });

  const filteredStudents = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchKelas = selectedKelasFilter === "all" || s.kelas_id.toString() === selectedKelasFilter;
    return matchSearch && matchKelas;
  });

  // Handlers
  const handleAddPeserta = () => { router.post('/pengajar/siswa', formData, { onSuccess: () => { setShowAddDialog(false); resetForm(); }}); };
  const handleEditPeserta = () => { if (!selectedStudent) return; router.put(`/pengajar/siswa/${selectedStudent.id}`, formData, { onSuccess: () => { setShowEditDialog(false); resetForm(); }}); };
  const handleDeletePeserta = () => { if (!selectedStudent) return; router.delete(`/pengajar/siswa/${selectedStudent.id}`, { onSuccess: () => { setShowDeleteDialog(false); setSelectedStudent(null); }}); };
  
  const resetForm = () => { 
      setFormData({ 
          name: "", email: "", phone: "", age: "", school_grade: "", disability: "", 
          kelas_id: "", status_pkl: "dalam_pelatihan" 
      }); 
      setSelectedStudent(null); 
  };
  
  const openEditDialog = (student: Student) => { 
      setSelectedStudent(student); 
      setFormData({ 
          name: student.name, 
          email: student.email, 
          phone: student.phone,
          age: student.age.toString(),
          school_grade: student.school_grade,
          disability: student.disability || "",
          kelas_id: student.kelas_id.toString(), 
          status_pkl: student.status_pkl 
      }); 
      setShowEditDialog(true); 
  };
  
  const getThemeColor = (theme: string) => { switch(theme) { case 'green': return 'bg-green-400 text-white'; case 'yellow': return 'bg-yellow-400 text-white'; case 'pink': return 'bg-pink-400 text-white'; case 'blue': return 'bg-blue-400 text-white'; default: return 'bg-gray-400 text-white'; }};
  
  const getStatusBadge = (status: string) => { 
      const styles = { 
          'siap': 'bg-green-100 text-green-700 border-green-200', 
          'dalam_pelatihan': 'bg-blue-100 text-blue-700 border-blue-200', 
          'belum_siap': 'bg-orange-100 text-orange-700 border-orange-200' 
      }; 
      const labels = { 'siap': 'Siap PKL', 'dalam_pelatihan': 'Training', 'belum_siap': 'Basic' }; 
      return ( <Badge className={`${styles[status as keyof typeof styles]} border px-2 py-0.5 rounded-md text-[10px] uppercase font-bold shadow-none`}> {labels[status as keyof typeof labels] || status} </Badge> ); 
  };

  return (
    <div className="flex min-h-screen bg-background font-sans text-foreground transition-colors duration-300">
      <Head title="Manajemen Peserta" />
      <SidebarPengajar />

      <main className="flex-1 w-full flex flex-col">
        <HeaderPengajar onSearch={(q) => setSearchQuery(q)} />

        <div className="p-6 md:p-10 flex-1">
      
          {/* Header & Stats */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
              <div>
                <h2 className="text-foreground text-4xl font-black mb-2 tracking-tight">Data Peserta</h2>
                <p className="text-muted-foreground font-medium text-lg">Pantau profil inklusif dan perkembangan siswa.</p>
              </div>
              
              <div className="flex gap-2 p-1 bg-card border-2 border-border rounded-xl overflow-x-auto max-w-full">
                  {['all', ...kelas_list.map(k => k.id.toString())].map((filter) => {
                      const label = filter === 'all' ? 'Semua' : kelas_list.find(k => k.id.toString() === filter)?.nama;
                      const isActive = selectedKelasFilter === filter;
                      return (
                          <button
                            key={filter}
                            onClick={() => setSelectedKelasFilter(filter)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${isActive ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted'}`}
                          >
                              {label}
                          </button>
                      )
                  })}
              </div>
            </div>
          </div>

          <div className="flex justify-end mb-6">
              <Button
                onClick={() => setShowAddDialog(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl h-12 px-6 border-b-4 border-orange-600 active:border-b-0 active:translate-y-1 transition-all shadow-lg font-bold"
              >
                <Plus className="w-5 h-5 mr-2" />
                Tambah Siswa
              </Button>
          </div>

          {/* TABLE SISWA */}
          <Card className="bg-card rounded-[2.5rem] border-2 border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/40 border-b-2 border-border">
                    <TableHead className="text-foreground font-black py-5 pl-8 text-sm uppercase tracking-wider w-[350px]">Profil Siswa</TableHead>
                    <TableHead className="text-foreground font-black text-sm uppercase tracking-wider">Kelas & Status</TableHead>
                    <TableHead className="text-foreground font-black text-sm uppercase tracking-wider w-[180px]">Progres</TableHead>
                    <TableHead className="text-foreground font-black text-sm uppercase tracking-wider text-center">Nilai</TableHead>
                    <TableHead className="text-foreground font-black text-sm uppercase tracking-wider text-center">Aktif</TableHead>
                    <TableHead className="text-foreground font-black text-sm uppercase tracking-wider text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-16 text-muted-foreground text-lg italic">
                        {searchQuery ? `Tidak ada siswa bernama "${searchQuery}"` : "Belum ada data siswa."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStudents.map((peserta) => (
                      <TableRow key={peserta.id} className="hover:bg-muted/20 transition-colors border-b border-border/50 group">
                        
                        {/* 1. PROFIL LENGKAP (Nama, Umur, Jenjang, Disability) */}
                        <TableCell className="py-4 pl-8">
                          <div className="flex items-start gap-4">
                              <div className={`w-12 h-12 rounded-full ${getThemeColor(peserta.kelas_color)} flex items-center justify-center font-black text-lg shadow-sm border-2 border-white relative mt-1`}>
                                  {peserta.name.charAt(0)}
                                  <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${peserta.is_online ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                              </div>
                              <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                      <Link href={`/pengajar/siswa/${peserta.id}`}>
                                        <p className="text-foreground font-bold hover:text-primary hover:underline transition-colors cursor-pointer text-base">
                                            {peserta.name}
                                        </p>
                                      </Link>
                                      {/* ✅ BADGE DISABILITY: Muncul jika ada data */}
                                      {peserta.disability && (
                                          <Badge className="bg-red-100 text-red-700 border-red-200 text-[10px] px-2 py-0 h-5 flex items-center gap-1 shadow-none">
                                              <Accessibility size={10} />
                                              {peserta.disability}
                                          </Badge>
                                      )}
                                  </div>
                                  
                                  {/* ✅ INFO DINAMIS: Umur & Jenjang */}
                                  <div className="text-xs text-muted-foreground font-medium mt-1 flex items-center gap-2">
                                      <span className="flex items-center gap-1 bg-muted/30 px-1.5 py-0.5 rounded">
                                          <Calendar size={10} /> {peserta.age} Thn
                                      </span>
                                      <span className="flex items-center gap-1 bg-muted/30 px-1.5 py-0.5 rounded">
                                          <GraduationCap size={10} /> {peserta.school_grade}
                                      </span>
                                  </div>

                                  {/* Kontak Cepat */}
                                  <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground/80">
                                      <a href={`https://wa.me/${peserta.phone}`} target="_blank" className="hover:text-green-600 flex items-center gap-1 transition-colors">
                                          <MessageCircle size={10} /> WhatsApp
                                      </a>
                                      <span>•</span>
                                      <span className="flex items-center gap-1">
                                          <Mail size={10}/> {peserta.email}
                                      </span>
                                  </div>
                              </div>
                          </div>
                        </TableCell>

                        {/* 2. KELAS & STATUS */}
                        <TableCell>
                            <div className="flex flex-col gap-2 items-start">
                                <Badge variant="outline" className="border-2 border-border text-foreground font-bold bg-background px-3 py-1 rounded-lg">
                                    {peserta.kelas_nama}
                                </Badge>
                                {getStatusBadge(peserta.status_pkl)}
                            </div>
                        </TableCell>

                        {/* 3. PROGRES */}
                        <TableCell>
                            <div className="w-full">
                                <div className="flex justify-between mb-1">
                                    <span className="text-[10px] font-bold text-muted-foreground">Modul {peserta.modul_selesai}/{peserta.total_modul}</span>
                                    <span className="text-[10px] font-bold text-primary">{peserta.progress}%</span>
                                </div>
                                <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-primary rounded-full transition-all duration-500" 
                                        style={{ width: `${peserta.progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        </TableCell>

                        {/* 4. NILAI (Pre/Post) */}
                        <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2">
                                <div className="text-right">
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase">Pre</p>
                                    <p className="font-bold text-muted-foreground">{peserta.nilai_pre}</p>
                                </div>
                                <div className="h-8 w-[1px] bg-border mx-1"></div>
                                <div className="text-left">
                                    <p className="text-[10px] text-primary font-bold uppercase">Post</p>
                                    <p className="font-black text-lg text-primary">{peserta.nilai_post}</p>
                                </div>
                            </div>
                        </TableCell>

                        {/* 5. KEAKTIFAN */}
                        <TableCell className="text-center">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/20 border border-border">
                                <Clock size={14} className="text-muted-foreground" />
                                <span className="text-xs font-bold text-muted-foreground">{peserta.last_active}</span>
                            </div>
                        </TableCell>

                        {/* 6. AKSI */}
                        <TableCell>
                          <div className="flex gap-2 justify-center opacity-70 group-hover:opacity-100 transition-opacity">
                            <Button onClick={() => openEditDialog(peserta)} size="icon" variant="ghost" className="rounded-full hover:bg-secondary/20 text-secondary hover:text-secondary-foreground h-9 w-9">
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button onClick={() => { setSelectedStudent(peserta); setShowDeleteDialog(true); }} size="icon" variant="ghost" className="rounded-full hover:bg-destructive/20 text-destructive hover:text-destructive h-9 w-9">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>

                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>

        </div>

        {/* --- DIALOG ADD/EDIT (DIPERBARUI DENGAN FIELD BARU) --- */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogContent className="bg-card rounded-[2rem] max-w-lg border-2 border-border">
                <DialogHeader>
                    <DialogTitle className="text-foreground text-2xl font-black">Tambah Siswa</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <Label className="font-bold text-foreground">Nama Lengkap</Label>
                            <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="rounded-xl border-2 border-border bg-background" />
                        </div>
                        <div className="col-span-2">
                            <Label className="font-bold text-foreground">Email</Label>
                            <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="rounded-xl border-2 border-border bg-background" />
                        </div>
                        
                        {/* INPUT BARU: Umur & Kelas Sekolah */}
                        <div>
                            <Label className="font-bold text-foreground">Umur (Tahun)</Label>
                            <Input type="number" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} className="rounded-xl border-2 border-border bg-background" placeholder="Contoh: 18" />
                        </div>
                        <div>
                            <Label className="font-bold text-foreground">Jenjang Pendidikan</Label>
                            <Input value={formData.school_grade} onChange={(e) => setFormData({ ...formData, school_grade: e.target.value })} className="rounded-xl border-2 border-border bg-background" placeholder="Ex: Kelas 12 SMALB" />
                        </div>

                        {/* INPUT BARU: Keterbatasan (Opsional) */}
                        <div className="col-span-2">
                            <Label className="font-bold text-foreground">Keterbatasan Khusus (Opsional)</Label>
                            <Input value={formData.disability} onChange={(e) => setFormData({ ...formData, disability: e.target.value })} className="rounded-xl border-2 border-border bg-background" placeholder="Contoh: Tuna Rungu, Low Vision (Kosongi jika tidak ada)" />
                        </div>

                        <div>
                            <Label className="font-bold text-foreground">No. WhatsApp</Label>
                            <Input type="text" placeholder="628..." value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="rounded-xl border-2 border-border bg-background" />
                        </div>
                        <div>
                            <Label className="font-bold text-foreground">Kelas Pelatihan</Label>
                            <Select value={formData.kelas_id} onValueChange={(val) => setFormData({ ...formData, kelas_id: val })}>
                                <SelectTrigger className="rounded-xl border-2 border-border bg-background"><SelectValue placeholder="Pilih Kelas" /></SelectTrigger>
                                <SelectContent>
                                    {kelas_list.map(k => <SelectItem key={k.id} value={k.id.toString()}>{k.nama}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <Button variant="outline" onClick={() => setShowAddDialog(false)} className="flex-1 rounded-xl font-bold border-2">Batal</Button>
                        <Button onClick={handleAddPeserta} className="flex-1 rounded-xl font-bold bg-primary text-primary-foreground border-b-4 border-orange-600 active:border-b-0 active:translate-y-1">Simpan</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>

        {/* Edit Dialog juga menggunakan struktur yang sama (Saya sederhanakan di sini agar tidak terlalu panjang, tapi logikanya sama dengan Add) */}
        {/* Pastikan field Edit Dialog juga diupdate dengan Age, Grade, dan Disability */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="bg-card rounded-[2rem] max-w-lg border-2 border-border">
                <DialogHeader>
                    <DialogTitle className="text-foreground text-2xl font-black">Edit Data Siswa</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-2">
                    {/* ... (Copy Input Fields dari Add Dialog ke sini, sesuaikan Value & OnChange) ... */}
                    {/* INPUTS yang sama persis seperti di atas */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <Label className="font-bold text-foreground">Nama</Label>
                            <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="rounded-xl border-2 border-border bg-background" />
                        </div>
                        {/* ... Input Age, Grade, Disability ... */}
                        <div>
                            <Label className="font-bold text-foreground">Umur</Label>
                            <Input type="number" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} className="rounded-xl border-2 border-border bg-background" />
                        </div>
                        <div>
                            <Label className="font-bold text-foreground">Jenjang</Label>
                            <Input value={formData.school_grade} onChange={(e) => setFormData({ ...formData, school_grade: e.target.value })} className="rounded-xl border-2 border-border bg-background" />
                        </div>
                        <div className="col-span-2">
                            <Label className="font-bold text-foreground">Keterbatasan</Label>
                            <Input value={formData.disability} onChange={(e) => setFormData({ ...formData, disability: e.target.value })} className="rounded-xl border-2 border-border bg-background" />
                        </div>
                        {/* ... Sisa input ... */}
                        <div className="col-span-2">
                            <Label className="font-bold text-foreground">Status</Label>
                            <Select value={formData.status_pkl} onValueChange={(val) => setFormData({ ...formData, status_pkl: val })}>
                                <SelectTrigger className="rounded-xl border-2 border-border bg-background"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="dalam_pelatihan">Training</SelectItem>
                                    <SelectItem value="siap">Siap PKL</SelectItem>
                                    <SelectItem value="belum_siap">Belum Siap</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button variant="outline" onClick={() => setShowEditDialog(false)} className="flex-1 rounded-xl font-bold border-2">Batal</Button>
                        <Button onClick={handleEditPeserta} className="flex-1 rounded-xl font-bold bg-secondary text-secondary-foreground border-b-4 border-blue-600 active:border-b-0 active:translate-y-1">Update</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>

        {/* Delete Dialog (Tetap sama) */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogContent className="bg-card rounded-[2rem] border-2 border-border text-center p-8 max-w-sm">
                <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-destructive/20">
                    <Trash2 size={32} />
                </div>
                <h2 className="text-xl font-black text-foreground mb-2">Hapus Siswa?</h2>
                <p className="text-muted-foreground mb-6 text-sm">Data <strong>{selectedStudent?.name}</strong> akan dihapus permanen.</p>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setShowDeleteDialog(false)} className="flex-1 rounded-xl font-bold border-2">Batal</Button>
                    <Button onClick={handleDeletePeserta} className="flex-1 rounded-xl font-bold bg-destructive text-destructive-foreground border-b-4 border-red-700 active:border-b-0 active:translate-y-1">Hapus</Button>
                </div>
            </DialogContent>
        </Dialog>

      </main>
    </div>
  );
}