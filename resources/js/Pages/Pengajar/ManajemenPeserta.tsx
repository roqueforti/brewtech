import { useState } from "react";
import { Plus, Search, Edit2, Trash2, X, Save, Users, Filter, Download, Upload, Mail } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { Head, router, Link } from "@inertiajs/react"; // ✅ Pakai Inertia
import SidebarPengajar from "@/Components/SidebarPengajar";

// --- TIPE DATA DARI CONTROLLER ---
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
  kelas_id: number;
  kelas_nama: string;
  kelas_color: string;
  status_pkl: 'siap' | 'dalam_pelatihan' | 'belum_siap';
  nilai_pre: number;
  nilai_post: number;
  joined_at: string;
}

interface ManajemenPesertaProps {
  auth: { user: { name: string } };
  students: Student[];
  kelas_list: KelasItem[];
}

export default function ManajemenPeserta({ auth, students, kelas_list }: ManajemenPesertaProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKelasFilter, setSelectedKelasFilter] = useState<string>("all");
  
  // Dialog States
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    kelas_id: "",
    status_pkl: "dalam_pelatihan",
  });

  // --- FILTERING ---
  const filteredStudents = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchKelas = selectedKelasFilter === "all" || s.kelas_id.toString() === selectedKelasFilter;
    return matchSearch && matchKelas;
  });

  // --- HANDLERS (CRUD) ---

  const handleAddPeserta = () => {
    router.post('/pengajar/siswa', formData, {
      onSuccess: () => {
        setShowAddDialog(false);
        resetForm();
      }
    });
  };

  const handleEditPeserta = () => {
    if (!selectedStudent) return;
    router.put(`/pengajar/siswa/${selectedStudent.id}`, formData, {
        onSuccess: () => {
            setShowEditDialog(false);
            resetForm();
        }
    });
  };

  const handleDeletePeserta = () => {
    if (!selectedStudent) return;
    router.delete(`/pengajar/siswa/${selectedStudent.id}`, {
        onSuccess: () => {
            setShowDeleteDialog(false);
            setSelectedStudent(null);
        }
    });
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", kelas_id: "", status_pkl: "dalam_pelatihan" });
    setSelectedStudent(null);
  };

  const openEditDialog = (student: Student) => {
    setSelectedStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      kelas_id: student.kelas_id.toString(),
      status_pkl: student.status_pkl,
    });
    setShowEditDialog(true);
  };

  // --- HELPERS UI ---
  const getThemeColor = (theme: string) => {
    switch(theme) {
        case 'green': return 'from-green-400 to-green-600';
        case 'yellow': return 'from-yellow-400 to-orange-500';
        case 'pink': return 'from-pink-400 to-purple-500';
        case 'blue': return 'from-blue-400 to-indigo-500';
        default: return 'from-gray-400 to-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
      const styles = {
          'siap': 'bg-green-100 text-green-700',
          'dalam_pelatihan': 'bg-blue-100 text-blue-700',
          'belum_siap': 'bg-gray-100 text-gray-500'
      };
      const labels = {
          'siap': 'Siap PKL',
          'dalam_pelatihan': 'Training',
          'belum_siap': 'Belum Siap'
      };
      return (
          <Badge className={`${styles[status as keyof typeof styles] || styles.belum_siap} border-0 rounded-full hover:bg-opacity-80`}>
              {labels[status as keyof typeof labels] || status}
          </Badge>
      );
  };

  return (
    <div className="flex min-h-screen bg-[#FAFAFA] font-sans">
      <Head title="Manajemen Peserta" />
      <SidebarPengajar />

      <main className="flex-1 max-w-[1600px] w-full p-8">
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[#5D4037] text-3xl font-black mb-2">📋 Data Peserta</h2>
            <p className="text-gray-400 font-medium">Kelola data siswa dan status kelulusan</p>
          </div>
        </div>

        {/* Kelas Filter Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card 
            className={`bg-white p-5 rounded-3xl border-0 shadow-sm cursor-pointer hover:shadow-md transition-all ${selectedKelasFilter === "all" ? 'ring-2 ring-[#5D4037]' : ''}`}
            onClick={() => setSelectedKelasFilter("all")}
          >
            <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-gray-100 rounded-full"><Filter size={20} className="text-gray-600"/></div>
                <span className="text-xs font-bold text-gray-400 uppercase">Total</span>
            </div>
            <p className="text-3xl font-black text-[#5D4037]">{students.length}</p>
            <p className="text-sm text-gray-400">Semua Siswa</p>
          </Card>

          {kelas_list.map((kelas) => (
            <Card 
              key={kelas.id}
              className={`bg-gradient-to-br ${getThemeColor(kelas.theme)} p-5 rounded-3xl border-0 shadow-lg cursor-pointer hover:scale-105 transition-transform text-white ${selectedKelasFilter === kelas.id.toString() ? 'ring-4 ring-white ring-offset-2' : ''}`}
              onClick={() => setSelectedKelasFilter(kelas.id.toString())}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="font-bold text-sm opacity-90 truncate max-w-[100px]">{kelas.nama}</p>
                <Users className="w-5 h-5 opacity-80" />
              </div>
              <p className="text-3xl font-black">{students.filter(s => s.kelas_id === kelas.id).length}</p>
              <p className="text-xs opacity-80">Siswa Aktif</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Actions Bar */}
      <Card className="bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Cari nama atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white transition-all"
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Link href="/pengajar/kelas">
                <Button className="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl h-12 px-6 border-0 w-full md:w-auto">
                <Users className="w-5 h-5 mr-2" />
                Kelola Kelas
                </Button>
            </Link>
            <Button
              onClick={() => setShowAddDialog(true)}
              className="bg-[#5D4037] hover:bg-[#4E342E] text-[#FFCA28] rounded-xl h-12 px-6 border-0 shadow-lg w-full md:w-auto font-bold"
            >
              <Plus className="w-5 h-5 mr-2" />
              Tambah Siswa
            </Button>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#FFF8E1] hover:bg-[#FFF8E1]">
                <TableHead className="text-[#5D4037] font-bold py-4">Siswa</TableHead>
                <TableHead className="text-[#5D4037] font-bold">Kelas</TableHead>
                <TableHead className="text-[#5D4037] font-bold text-center">Status</TableHead>
                <TableHead className="text-[#5D4037] font-bold text-center">Nilai (Pre/Post)</TableHead>
                <TableHead className="text-[#5D4037] font-bold text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-gray-400">
                    Tidak ada data siswa.
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((peserta) => (
                  <TableRow key={peserta.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getThemeColor(peserta.kelas_color)} flex items-center justify-center text-white font-bold`}>
                              {peserta.name.charAt(0)}
                          </div>
                          <div>
                              <p className="text-[#5D4037] font-bold">{peserta.name}</p>
                              <div className="flex items-center gap-1 text-xs text-gray-400">
                                  <Mail size={10}/> {peserta.email}
                              </div>
                          </div>
                      </div>
                    </TableCell>
                    <TableCell>
                        <Badge variant="outline" className="border-gray-200 text-gray-600">
                            {peserta.kelas_nama}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(peserta.status_pkl)}
                    </TableCell>
                    <TableCell className="text-center">
                        <span className="font-medium text-gray-400">{peserta.nilai_pre}</span>
                        <span className="mx-2 text-gray-300">/</span>
                        <span className="font-bold text-[#5D4037]">{peserta.nilai_post}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-center">
                        <Button onClick={() => openEditDialog(peserta)} size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-blue-50 text-blue-600">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button onClick={() => { setSelectedStudent(peserta); setShowDeleteDialog(true); }} size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-red-50 text-red-600">
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

      </main>

      {/* --- MODALS --- */}

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-white rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#5D4037] text-xl font-black">Tambah Siswa Baru</DialogTitle>
            <DialogDescription>Password default: "password"</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <Label className="text-gray-500 mb-1 block">Nama Lengkap</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="rounded-xl bg-gray-50" />
            </div>
            <div>
              <Label className="text-gray-500 mb-1 block">Email</Label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="rounded-xl bg-gray-50" />
            </div>
            <div>
              <Label className="text-gray-500 mb-1 block">Kelas</Label>
              <Select value={formData.kelas_id} onValueChange={(val) => setFormData({ ...formData, kelas_id: val })}>
                <SelectTrigger className="rounded-xl bg-gray-50"><SelectValue placeholder="Pilih Kelas" /></SelectTrigger>
                <SelectContent>
                    {kelas_list.map(k => (
                        <SelectItem key={k.id} value={k.id.toString()}>{k.nama}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowAddDialog(false)} className="flex-1 rounded-xl h-12">Batal</Button>
              <Button onClick={handleAddPeserta} className="flex-1 bg-[#5D4037] text-[#FFCA28] hover:bg-[#4E342E] rounded-xl h-12 font-bold">Simpan</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-white rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#5D4037] text-xl font-black">Edit Data Siswa</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Nama</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="rounded-xl bg-gray-50" />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="rounded-xl bg-gray-50" />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={formData.status_pkl} onValueChange={(val) => setFormData({ ...formData, status_pkl: val })}>
                <SelectTrigger className="rounded-xl bg-gray-50"><SelectValue /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="dalam_pelatihan">Training</SelectItem>
                    <SelectItem value="siap">Siap PKL</SelectItem>
                    <SelectItem value="belum_siap">Belum Siap</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Kelas</Label>
              <Select value={formData.kelas_id} onValueChange={(val) => setFormData({ ...formData, kelas_id: val })}>
                <SelectTrigger className="rounded-xl bg-gray-50"><SelectValue /></SelectTrigger>
                <SelectContent>
                    {kelas_list.map(k => (
                        <SelectItem key={k.id} value={k.id.toString()}>{k.nama}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowEditDialog(false)} className="flex-1 rounded-xl h-12">Batal</Button>
              <Button onClick={handleEditPeserta} className="flex-1 bg-blue-600 text-white hover:bg-blue-700 rounded-xl h-12">Update</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-white rounded-3xl max-w-md text-center p-8">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} />
            </div>
            <h2 className="text-xl font-black text-[#5D4037] mb-2">Hapus Siswa?</h2>
            <p className="text-gray-500 mb-6">Yakin ingin menghapus <strong>{selectedStudent?.name}</strong>? Data yang dihapus tidak bisa dikembalikan.</p>
            <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)} className="flex-1 rounded-xl h-12">Batal</Button>
                <Button onClick={handleDeletePeserta} className="flex-1 bg-red-500 text-white hover:bg-red-600 rounded-xl h-12 font-bold shadow-lg shadow-red-500/30">Ya, Hapus</Button>
            </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}