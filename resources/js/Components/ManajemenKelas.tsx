import { useState } from "react";
import { Plus, Edit, Trash, Users, BookOpen, ArrowLeft, Eye, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { HeaderPengajar } from "./HeaderPengajar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface Kelas {
  id: number;
  namaKelas: string;
  pelatih: string;
  periode: string;
  deskripsi: string;
  jumlahPeserta: number;
  jumlahWorkshop: number;
  color: string;
  status: string;
}

interface ManajemenKelasProps {
  onNavigate: (page: string, kelasId?: number) => void;
  currentPage: string;
  onBackToRoleSelection?: () => void;
}

export function ManajemenKelas({ onNavigate, currentPage, onBackToRoleSelection }: ManajemenKelasProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedKelas, setSelectedKelas] = useState<Kelas | null>(null);
  
  const [formData, setFormData] = useState({
    namaKelas: "",
    pelatih: "",
    periode: "",
    deskripsi: "",
  });

  const [kelasList, setKelasList] = useState<Kelas[]>([
    {
      id: 1,
      namaKelas: "Kelas A - Pagi",
      pelatih: "Bu Sari",
      periode: "Januari - Maret 2024",
      deskripsi: "Kelas pagi untuk peserta dengan jadwal fleksibel",
      jumlahPeserta: 3,
      jumlahWorkshop: 4,
      color: "from-[#7FFF00] to-[#00E5FF]",
      status: "Aktif"
    },
    {
      id: 2,
      namaKelas: "Kelas B - Siang",
      pelatih: "Pak Budi",
      periode: "Februari - April 2024",
      deskripsi: "Kelas siang untuk peserta yang bekerja pagi",
      jumlahPeserta: 2,
      jumlahWorkshop: 3,
      color: "from-[#FFEB3B] to-[#FFA500]",
      status: "Aktif"
    },
    {
      id: 3,
      namaKelas: "Kelas C - Sore",
      pelatih: "Bu Dewi",
      periode: "Maret - Mei 2024",
      deskripsi: "Kelas sore untuk peserta dengan kesibukan siang",
      jumlahPeserta: 1,
      jumlahWorkshop: 2,
      color: "from-[#FF1B6B] to-[#CE93D8]",
      status: "Aktif"
    },
  ]);

  const colors = [
    "from-[#7FFF00] to-[#00E5FF]",
    "from-[#FFEB3B] to-[#FFA500]",
    "from-[#FF1B6B] to-[#CE93D8]",
    "from-[#00E5FF] to-[#1E90FF]",
    "from-[#CE93D8] to-[#9C27B0]",
    "from-[#FF6B00] to-[#FF9E40]",
  ];

  const handleAddKelas = () => {
    if (!formData.namaKelas || !formData.pelatih || !formData.periode) {
      alert("Mohon lengkapi data kelas!");
      return;
    }

    const newKelas: Kelas = {
      id: kelasList.length + 1,
      namaKelas: formData.namaKelas,
      pelatih: formData.pelatih,
      periode: formData.periode,
      deskripsi: formData.deskripsi,
      jumlahPeserta: 0,
      jumlahWorkshop: 0,
      color: colors[kelasList.length % colors.length],
      status: "Aktif"
    };

    setKelasList([...kelasList, newKelas]);
    setShowAddDialog(false);
    resetForm();
  };

  const handleEditKelas = () => {
    if (!selectedKelas || !formData.namaKelas || !formData.pelatih || !formData.periode) {
      alert("Mohon lengkapi data kelas!");
      return;
    }

    setKelasList(kelasList.map(k => 
      k.id === selectedKelas.id 
        ? { ...k, 
            namaKelas: formData.namaKelas, 
            pelatih: formData.pelatih,
            periode: formData.periode,
            deskripsi: formData.deskripsi
          }
        : k
    ));

    setShowEditDialog(false);
    setSelectedKelas(null);
    resetForm();
  };

  const handleDeleteKelas = () => {
    if (selectedKelas) {
      setKelasList(kelasList.filter(k => k.id !== selectedKelas.id));
      setShowDeleteDialog(false);
      setSelectedKelas(null);
    }
  };

  const resetForm = () => {
    setFormData({
      namaKelas: "",
      pelatih: "",
      periode: "",
      deskripsi: "",
    });
  };

  const openEditDialog = (kelas: Kelas) => {
    setSelectedKelas(kelas);
    setFormData({
      namaKelas: kelas.namaKelas,
      pelatih: kelas.pelatih,
      periode: kelas.periode,
      deskripsi: kelas.deskripsi,
    });
    setShowEditDialog(true);
  };

  const openDeleteDialog = (kelas: Kelas) => {
    setSelectedKelas(kelas);
    setShowDeleteDialog(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3E5F5] via-[#FCE4EC] to-[#FFF3E0]">
      <HeaderPengajar onNavigate={onNavigate} currentPage={currentPage} onBackToRoleSelection={onBackToRoleSelection} />

      {/* Main Content */}
      <div className="p-8 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-gray-800 text-2xl mb-2">🏫 Manajemen Kelas</h2>
              <p className="text-gray-600">Kelola kelas pelatihan, workshop, dan peserta per kelas</p>
            </div>
            <Button
              onClick={() => setShowAddDialog(true)}
              className="bg-gradient-to-r from-[#9C27B0] to-[#E91E63] hover:opacity-90 text-white border-0 rounded-xl h-11 px-6 shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Tambah Kelas Baru
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-[#00B8D4] to-[#00E5FF] p-5 rounded-3xl border-0 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/90 text-sm mb-1">Total Kelas</p>
                  <p className="text-white text-3xl">{kelasList.length}</p>
                </div>
                <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-[#9C27B0] to-[#CE93D8] p-5 rounded-3xl border-0 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/90 text-sm mb-1">Total Workshop</p>
                  <p className="text-white text-3xl">{kelasList.reduce((sum, k) => sum + k.jumlahWorkshop, 0)}</p>
                </div>
                <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-[#FF6B00] to-[#FF9E40] p-5 rounded-3xl border-0 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/90 text-sm mb-1">Total Peserta</p>
                  <p className="text-white text-3xl">{kelasList.reduce((sum, k) => sum + k.jumlahPeserta, 0)}</p>
                </div>
                <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Kelas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kelasList.map((kelas) => (
            <Card key={kelas.id} className="bg-white rounded-3xl border-0 shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              {/* Header with gradient */}
              <div className={`bg-gradient-to-br ${kelas.color} p-6 relative overflow-hidden`}>
                <div className="absolute right-4 top-4 text-6xl opacity-20">
                  🏫
                </div>
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <Badge className="bg-white/30 text-white border-0 rounded-full backdrop-blur text-xs">
                      {kelas.status}
                    </Badge>
                  </div>
                  <h3 className="text-white text-xl mb-2">{kelas.namaKelas}</h3>
                  <p className="text-white/90 text-sm mb-1">👤 {kelas.pelatih}</p>
                  <p className="text-white/80 text-xs">📅 {kelas.periode}</p>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                <p className="text-gray-600 text-sm mb-4 h-10 line-clamp-2">
                  {kelas.deskripsi || "Deskripsi kelas belum tersedia"}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gradient-to-r from-[#f8f9ff] to-[#fff5f8] rounded-2xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <BookOpen className="w-4 h-4 text-[#9C27B0]" />
                      <p className="text-gray-500 text-xs">Workshop</p>
                    </div>
                    <p className="text-gray-800 text-xl">{kelas.jumlahWorkshop}</p>
                  </div>
                  <div className="bg-gradient-to-r from-[#f8f9ff] to-[#fff5f8] rounded-2xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-[#00B8D4]" />
                      <p className="text-gray-500 text-xs">Peserta</p>
                    </div>
                    <p className="text-gray-800 text-xl">{kelas.jumlahPeserta}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Button 
                    onClick={() => onNavigate('manajemen-modul', kelas.id)}
                    className="w-full bg-gradient-to-r from-[#9C27B0] to-[#E91E63] hover:opacity-90 text-white border-0 rounded-xl h-10 shadow-md"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Kelola Workshop
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </Button>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => openEditDialog(kelas)}
                      className="flex-1 bg-gradient-to-r from-[#00B8D4] to-[#00E5FF] hover:opacity-90 text-white border-0 rounded-xl h-10"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      onClick={() => openDeleteDialog(kelas)}
                      className="flex-1 bg-gradient-to-r from-[#FF1B6B] to-[#FF6B9D] hover:opacity-90 text-white border-0 rounded-xl h-10"
                    >
                      <Trash className="w-4 h-4 mr-2" />
                      Hapus
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {kelasList.length === 0 && (
          <Card className="bg-white rounded-3xl border-0 shadow-lg p-12">
            <div className="text-center">
              <div className="text-8xl mb-6">🏫</div>
              <h3 className="text-gray-800 text-xl mb-2">Belum Ada Kelas</h3>
              <p className="text-gray-600 mb-6">Mulai dengan membuat kelas pelatihan baru</p>
              <Button
                onClick={() => setShowAddDialog(true)}
                className="bg-gradient-to-r from-[#9C27B0] to-[#E91E63] hover:opacity-90 text-white border-0 rounded-xl h-11 px-6 shadow-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Tambah Kelas Pertama
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-white rounded-3xl max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gray-800">
              <div className="w-10 h-10 bg-gradient-to-br from-[#9C27B0] to-[#E91E63] rounded-full flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
              Tambah Kelas Baru
            </DialogTitle>
            <DialogDescription>
              Buat kelas pelatihan baru untuk peserta
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="namaKelas" className="text-gray-700 mb-2 block">Nama Kelas</Label>
              <Input
                id="namaKelas"
                type="text"
                placeholder="Contoh: Kelas D - Malam"
                value={formData.namaKelas}
                onChange={(e) => setFormData({ ...formData, namaKelas: e.target.value })}
                className="h-12 rounded-2xl border-2 border-gray-200 focus:border-[#9C27B0]"
              />
            </div>

            <div>
              <Label htmlFor="pelatih" className="text-gray-700 mb-2 block">Nama Pelatih</Label>
              <Input
                id="pelatih"
                type="text"
                placeholder="Contoh: Bu Ani"
                value={formData.pelatih}
                onChange={(e) => setFormData({ ...formData, pelatih: e.target.value })}
                className="h-12 rounded-2xl border-2 border-gray-200 focus:border-[#9C27B0]"
              />
            </div>

            <div>
              <Label htmlFor="periode" className="text-gray-700 mb-2 block">Periode</Label>
              <Input
                id="periode"
                type="text"
                placeholder="Contoh: Juni - Agustus 2024"
                value={formData.periode}
                onChange={(e) => setFormData({ ...formData, periode: e.target.value })}
                className="h-12 rounded-2xl border-2 border-gray-200 focus:border-[#9C27B0]"
              />
            </div>

            <div>
              <Label htmlFor="deskripsi" className="text-gray-700 mb-2 block">Deskripsi (Opsional)</Label>
              <Textarea
                id="deskripsi"
                placeholder="Deskripsi singkat tentang kelas ini"
                value={formData.deskripsi}
                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                className="rounded-2xl border-2 border-gray-200 focus:border-[#9C27B0] min-h-20"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => setShowAddDialog(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 border-0 rounded-xl h-12"
              >
                Batal
              </Button>
              <Button
                onClick={handleAddKelas}
                className="flex-1 bg-gradient-to-r from-[#9C27B0] to-[#E91E63] hover:opacity-90 text-white border-0 rounded-xl h-12 shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Kelas
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-white rounded-3xl max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gray-800">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00B8D4] to-[#00E5FF] rounded-full flex items-center justify-center">
                <Edit className="w-5 h-5 text-white" />
              </div>
              Edit Kelas
            </DialogTitle>
            <DialogDescription>
              Ubah informasi kelas pelatihan
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="edit-namaKelas" className="text-gray-700 mb-2 block">Nama Kelas</Label>
              <Input
                id="edit-namaKelas"
                type="text"
                value={formData.namaKelas}
                onChange={(e) => setFormData({ ...formData, namaKelas: e.target.value })}
                className="h-12 rounded-2xl border-2 border-gray-200 focus:border-[#00B8D4]"
              />
            </div>

            <div>
              <Label htmlFor="edit-pelatih" className="text-gray-700 mb-2 block">Nama Pelatih</Label>
              <Input
                id="edit-pelatih"
                type="text"
                value={formData.pelatih}
                onChange={(e) => setFormData({ ...formData, pelatih: e.target.value })}
                className="h-12 rounded-2xl border-2 border-gray-200 focus:border-[#00B8D4]"
              />
            </div>

            <div>
              <Label htmlFor="edit-periode" className="text-gray-700 mb-2 block">Periode</Label>
              <Input
                id="edit-periode"
                type="text"
                value={formData.periode}
                onChange={(e) => setFormData({ ...formData, periode: e.target.value })}
                className="h-12 rounded-2xl border-2 border-gray-200 focus:border-[#00B8D4]"
              />
            </div>

            <div>
              <Label htmlFor="edit-deskripsi" className="text-gray-700 mb-2 block">Deskripsi</Label>
              <Textarea
                id="edit-deskripsi"
                value={formData.deskripsi}
                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                className="rounded-2xl border-2 border-gray-200 focus:border-[#00B8D4] min-h-20"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => setShowEditDialog(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 border-0 rounded-xl h-12"
              >
                Batal
              </Button>
              <Button
                onClick={handleEditKelas}
                className="flex-1 bg-gradient-to-r from-[#00B8D4] to-[#00E5FF] hover:opacity-90 text-white border-0 rounded-xl h-12 shadow-lg"
              >
                Simpan Perubahan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-white rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gray-800">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FF1B6B] to-[#FF6B9D] rounded-full flex items-center justify-center">
                <Trash className="w-5 h-5 text-white" />
              </div>
              Hapus Kelas
            </DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus kelas ini?
            </DialogDescription>
          </DialogHeader>
          
          {selectedKelas && (
            <div className="mt-4">
              <Card className={`bg-gradient-to-br ${selectedKelas.color} p-4 rounded-2xl border-0`}>
                <h4 className="text-white mb-1">{selectedKelas.namaKelas}</h4>
                <p className="text-white/80 text-sm mb-2">👤 {selectedKelas.pelatih}</p>
                <p className="text-white/70 text-xs">
                  {selectedKelas.jumlahWorkshop} workshop • {selectedKelas.jumlahPeserta} peserta
                </p>
              </Card>
              
              <div className="mt-4 p-4 bg-red-50 rounded-2xl border-2 border-red-200">
                <p className="text-red-800 text-sm">
                  ⚠️ <strong>Peringatan:</strong> Menghapus kelas akan menghapus semua workshop dan data peserta dalam kelas ini.
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={() => setShowDeleteDialog(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 border-0 rounded-xl h-12"
                >
                  Batal
                </Button>
                <Button
                  onClick={handleDeleteKelas}
                  className="flex-1 bg-gradient-to-r from-[#FF1B6B] to-[#FF6B9D] hover:opacity-90 text-white border-0 rounded-xl h-12 shadow-lg"
                >
                  <Trash className="w-4 h-4 mr-2" />
                  Ya, Hapus Kelas
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
