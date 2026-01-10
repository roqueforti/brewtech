import { useState } from "react";
import { Plus, Search, Edit2, Trash2, X, Save, Users, Filter, Download, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface Kelas {
  id: number;
  namaKelas: string;
  pelatih: string;
  jumlahPeserta: number;
  color: string;
}

interface Peserta {
  id: number;
  nama: string;
  umur: number;
  jenisDisabilitas: string;
  kelasId: number;
  tanggalMasuk: string;
  progress: number;
  status: string;
  nilaiAkhir?: number;
  modulSelesai: number;
  totalModul: number;
}

interface ManajemenPesertaProps {
  onBack: () => void;
}

export function ManajemenPeserta({ onBack }: ManajemenPesertaProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKelasFilter, setSelectedKelasFilter] = useState<number | "all">("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showManageKelasDialog, setShowManageKelasDialog] = useState(false);
  const [selectedPeserta, setSelectedPeserta] = useState<Peserta | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    nama: "",
    umur: "",
    jenisDisabilitas: "",
    kelasId: "",
    tanggalMasuk: "",
  });

  // Kelas form state
  const [kelasForm, setKelasForm] = useState({
    namaKelas: "",
    pelatih: "",
  });

  // Mock data kelas
  const [kelasList, setKelasList] = useState<Kelas[]>([
    {
      id: 1,
      namaKelas: "Kelas A - Pagi",
      pelatih: "Bu Sari",
      jumlahPeserta: 3,
      color: "from-[#7FFF00] to-[#00E5FF]"
    },
    {
      id: 2,
      namaKelas: "Kelas B - Siang",
      pelatih: "Pak Budi",
      jumlahPeserta: 2,
      color: "from-[#FFEB3B] to-[#FFA500]"
    },
    {
      id: 3,
      namaKelas: "Kelas C - Sore",
      pelatih: "Bu Dewi",
      jumlahPeserta: 1,
      color: "from-[#FF1B6B] to-[#CE93D8]"
    }
  ]);

  // Mock data peserta
  const [pesertaList, setPesertaList] = useState<Peserta[]>([
    {
      id: 1,
      nama: "Andi Wijaya",
      umur: 19,
      jenisDisabilitas: "Motorik Ringan",
      kelasId: 1,
      tanggalMasuk: "2024-01-15",
      progress: 75,
      status: "Siap PKL",
      nilaiAkhir: 85,
      modulSelesai: 3,
      totalModul: 4
    },
    {
      id: 2,
      nama: "Siti Nurhaliza",
      umur: 20,
      jenisDisabilitas: "Pendengaran",
      kelasId: 1,
      tanggalMasuk: "2024-02-01",
      progress: 100,
      status: "Siap PKL",
      nilaiAkhir: 92,
      modulSelesai: 4,
      totalModul: 4
    },
    {
      id: 3,
      nama: "Budi Santoso",
      umur: 18,
      jenisDisabilitas: "Penglihatan Rendah",
      kelasId: 1,
      tanggalMasuk: "2024-01-20",
      progress: 50,
      status: "Dalam Pelatihan",
      modulSelesai: 2,
      totalModul: 4
    },
    {
      id: 4,
      nama: "Dewi Lestari",
      umur: 21,
      jenisDisabilitas: "Motorik Sedang",
      kelasId: 2,
      tanggalMasuk: "2024-02-10",
      progress: 25,
      status: "Dalam Pelatihan",
      modulSelesai: 1,
      totalModul: 4
    },
    {
      id: 5,
      nama: "Eka Putra",
      umur: 19,
      jenisDisabilitas: "Motorik Ringan",
      kelasId: 2,
      tanggalMasuk: "2024-01-25",
      progress: 90,
      status: "Siap PKL",
      nilaiAkhir: 88,
      modulSelesai: 3,
      totalModul: 4
    },
    {
      id: 6,
      nama: "Fitri Handayani",
      umur: 20,
      jenisDisabilitas: "Pendengaran",
      kelasId: 3,
      tanggalMasuk: "2024-02-05",
      progress: 40,
      status: "Dalam Pelatihan",
      modulSelesai: 1,
      totalModul: 4
    }
  ]);

  const jenisDisabilitasOptions = [
    "Motorik Ringan",
    "Motorik Sedang",
    "Pendengaran",
    "Penglihatan Rendah",
    "Autisme Ringan",
    "Down Syndrome"
  ];

  const filteredPeserta = pesertaList.filter(p => {
    const matchSearch = p.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.jenisDisabilitas.toLowerCase().includes(searchQuery.toLowerCase());
    const matchKelas = selectedKelasFilter === "all" || p.kelasId === selectedKelasFilter;
    return matchSearch && matchKelas;
  });

  const handleAddPeserta = () => {
    if (!formData.nama || !formData.umur || !formData.jenisDisabilitas || !formData.kelasId) {
      alert("Mohon lengkapi semua data!");
      return;
    }

    const newPeserta: Peserta = {
      id: pesertaList.length + 1,
      nama: formData.nama,
      umur: parseInt(formData.umur),
      jenisDisabilitas: formData.jenisDisabilitas,
      kelasId: parseInt(formData.kelasId),
      tanggalMasuk: formData.tanggalMasuk || new Date().toISOString().split('T')[0],
      progress: 0,
      status: "Baru Bergabung",
      modulSelesai: 0,
      totalModul: 4
    };

    setPesertaList([...pesertaList, newPeserta]);
    updateKelasCount(parseInt(formData.kelasId), 1);
    setShowAddDialog(false);
    resetForm();
  };

  const handleEditPeserta = () => {
    if (!selectedPeserta || !formData.nama || !formData.umur || !formData.jenisDisabilitas || !formData.kelasId) {
      alert("Mohon lengkapi semua data!");
      return;
    }

    const oldKelasId = selectedPeserta.kelasId;
    const newKelasId = parseInt(formData.kelasId);

    setPesertaList(pesertaList.map(p => 
      p.id === selectedPeserta.id 
        ? { ...p, 
            nama: formData.nama, 
            umur: parseInt(formData.umur),
            jenisDisabilitas: formData.jenisDisabilitas,
            kelasId: newKelasId,
            tanggalMasuk: formData.tanggalMasuk
          }
        : p
    ));

    if (oldKelasId !== newKelasId) {
      updateKelasCount(oldKelasId, -1);
      updateKelasCount(newKelasId, 1);
    }

    setShowEditDialog(false);
    setSelectedPeserta(null);
    resetForm();
  };

  const handleDeletePeserta = () => {
    if (selectedPeserta) {
      setPesertaList(pesertaList.filter(p => p.id !== selectedPeserta.id));
      updateKelasCount(selectedPeserta.kelasId, -1);
      setShowDeleteDialog(false);
      setSelectedPeserta(null);
    }
  };

  const handleAddKelas = () => {
    if (!kelasForm.namaKelas || !kelasForm.pelatih) {
      alert("Mohon lengkapi nama kelas dan pelatih!");
      return;
    }

    const colors = [
      "from-[#7FFF00] to-[#00E5FF]",
      "from-[#FFEB3B] to-[#FFA500]",
      "from-[#FF1B6B] to-[#CE93D8]",
      "from-[#00E5FF] to-[#1E90FF]",
      "from-[#CE93D8] to-[#9C27B0]",
    ];

    const newKelas: Kelas = {
      id: kelasList.length + 1,
      namaKelas: kelasForm.namaKelas,
      pelatih: kelasForm.pelatih,
      jumlahPeserta: 0,
      color: colors[kelasList.length % colors.length]
    };

    setKelasList([...kelasList, newKelas]);
    setKelasForm({ namaKelas: "", pelatih: "" });
  };

  const updateKelasCount = (kelasId: number, delta: number) => {
    setKelasList(kelasList.map(k => 
      k.id === kelasId 
        ? { ...k, jumlahPeserta: Math.max(0, k.jumlahPeserta + delta) }
        : k
    ));
  };

  const resetForm = () => {
    setFormData({
      nama: "",
      umur: "",
      jenisDisabilitas: "",
      kelasId: "",
      tanggalMasuk: "",
    });
  };

  const openEditDialog = (peserta: Peserta) => {
    setSelectedPeserta(peserta);
    setFormData({
      nama: peserta.nama,
      umur: peserta.umur.toString(),
      jenisDisabilitas: peserta.jenisDisabilitas,
      kelasId: peserta.kelasId.toString(),
      tanggalMasuk: peserta.tanggalMasuk,
    });
    setShowEditDialog(true);
  };

  const openDeleteDialog = (peserta: Peserta) => {
    setSelectedPeserta(peserta);
    setShowDeleteDialog(true);
  };

  const getKelasName = (kelasId: number) => {
    const kelas = kelasList.find(k => k.id === kelasId);
    return kelas?.namaKelas || "Unknown";
  };

  const getKelasColor = (kelasId: number) => {
    const kelas = kelasList.find(k => k.id === kelasId);
    return kelas?.color || "from-gray-400 to-gray-500";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Siap PKL":
        return "bg-gradient-to-r from-[#7FFF00] to-[#00E5FF]";
      case "Dalam Pelatihan":
        return "bg-gradient-to-r from-[#FFEB3B] to-[#FFA500]";
      case "Baru Bergabung":
        return "bg-gradient-to-r from-[#00E5FF] to-[#1E90FF]";
      default:
        return "bg-gray-400";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return "from-[#7FFF00] via-[#00E5FF] to-[#00BFFF]";
    if (progress >= 50) return "from-[#FFEB3B] via-[#FFA500] to-[#FF6B6B]";
    return "from-[#00E5FF] via-[#1E90FF] to-[#9C27B0]";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] via-white to-[#fff5f8] p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[#4B4B4B] mb-2">📋 Manajemen Data Peserta</h2>
            <p className="text-[#4B4B4B] opacity-70">Kelola data peserta pelatihan barista berdasarkan kelas</p>
          </div>
          <Button 
            onClick={onBack}
            className="bg-gray-100 hover:bg-gray-200 text-[#4B4B4B] rounded-full border-0"
          >
            Kembali
          </Button>
        </div>

        {/* Kelas Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {kelasList.map((kelas) => (
            <Card 
              key={kelas.id}
              className={`bg-gradient-to-br ${kelas.color} p-5 rounded-3xl border-0 shadow-lg cursor-pointer hover:scale-105 transition-transform ${selectedKelasFilter === kelas.id ? 'ring-4 ring-white ring-offset-2' : ''}`}
              onClick={() => setSelectedKelasFilter(kelas.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-white/90 text-sm mb-1">{kelas.namaKelas}</p>
                  <p className="text-white text-xs opacity-80">👤 {kelas.pelatih}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <p className="text-white text-2xl">{kelas.jumlahPeserta}</p>
                <p className="text-white/80 text-sm">peserta</p>
              </div>
            </Card>
          ))}

          <Card 
            className={`bg-gradient-to-br from-gray-200 to-gray-300 p-5 rounded-3xl border-0 shadow-lg cursor-pointer hover:scale-105 transition-transform ${selectedKelasFilter === "all" ? 'ring-4 ring-gray-400 ring-offset-2' : ''}`}
            onClick={() => setSelectedKelasFilter("all")}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-gray-700 text-sm mb-1">Semua Kelas</p>
                <p className="text-gray-600 text-xs">Tampilkan semua</p>
              </div>
              <div className="w-12 h-12 bg-white/50 backdrop-blur rounded-full flex items-center justify-center">
                <Filter className="w-6 h-6 text-gray-700" strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <p className="text-gray-700 text-2xl">{pesertaList.length}</p>
              <p className="text-gray-600 text-sm">total</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Actions Bar */}
      <Card className="bg-white p-6 rounded-3xl border-0 shadow-lg mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Cari nama peserta atau jenis disabilitas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 rounded-2xl border-2 border-gray-200 focus:border-[#00E5FF] text-lg"
            />
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowManageKelasDialog(true)}
              className="bg-gradient-to-r from-[#FF1B6B] to-[#CE93D8] hover:scale-105 text-white rounded-2xl h-14 px-6 border-0 shadow-lg transition-transform whitespace-nowrap"
            >
              <Users className="w-5 h-5 mr-2" strokeWidth={2.5} />
              Kelola Kelas
            </Button>
            <Button
              onClick={() => setShowAddDialog(true)}
              className="bg-gradient-to-r from-[#7FFF00] via-[#00E5FF] to-[#00BFFF] hover:scale-105 text-white rounded-2xl h-14 px-6 border-0 shadow-lg transition-transform whitespace-nowrap"
            >
              <Plus className="w-5 h-5 mr-2" strokeWidth={2.5} />
              Tambah Peserta
            </Button>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="bg-white rounded-3xl border-0 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-[#f8f9ff] to-[#fff5f8] hover:from-[#f8f9ff] hover:to-[#fff5f8]">
                <TableHead className="text-[#4B4B4B] py-4">No</TableHead>
                <TableHead className="text-[#4B4B4B]">Nama Peserta</TableHead>
                <TableHead className="text-[#4B4B4B]">Umur</TableHead>
                <TableHead className="text-[#4B4B4B]">Jenis Disabilitas</TableHead>
                <TableHead className="text-[#4B4B4B]">Kelas</TableHead>
                <TableHead className="text-[#4B4B4B]">Tanggal Masuk</TableHead>
                <TableHead className="text-[#4B4B4B]">Progress</TableHead>
                <TableHead className="text-[#4B4B4B]">Status</TableHead>
                <TableHead className="text-[#4B4B4B]">Nilai</TableHead>
                <TableHead className="text-[#4B4B4B] text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPeserta.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-[#4B4B4B] mb-2">Tidak ada peserta ditemukan</p>
                    <p className="text-[#4B4B4B] opacity-60 text-sm">
                      {searchQuery ? `Tidak ada hasil untuk "${searchQuery}"` : "Belum ada peserta di kelas ini"}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPeserta.map((peserta, index) => (
                  <TableRow key={peserta.id} className="hover:bg-gradient-to-r hover:from-[#f8f9ff]/50 hover:to-[#fff5f8]/50">
                    <TableCell className="py-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#00E5FF] to-[#1E90FF] rounded-full flex items-center justify-center text-white text-sm">
                        {index + 1}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-[#4B4B4B]">{peserta.nama}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-[#4B4B4B]">{peserta.umur} th</p>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-gray-100 text-[#4B4B4B] border-0 rounded-full">
                        {peserta.jenisDisabilitas}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`bg-gradient-to-r ${getKelasColor(peserta.kelasId)} text-white border-0 rounded-full`}>
                        {getKelasName(peserta.kelasId)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-[#4B4B4B] text-sm">
                        {new Date(peserta.tanggalMasuk).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="w-32">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[#4B4B4B] text-xs">{peserta.modulSelesai}/{peserta.totalModul}</p>
                          <p className="text-[#4B4B4B] text-xs">{peserta.progress}%</p>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${getProgressColor(peserta.progress)}`}
                            style={{ width: `${peserta.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(peserta.status)} text-white border-0 rounded-full text-xs`}>
                        {peserta.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {peserta.nilaiAkhir ? (
                        <div className="flex items-center gap-1">
                          <div className="w-6 h-6 bg-gradient-to-br from-[#FFEB3B] to-[#FFA500] rounded-full flex items-center justify-center text-white text-xs">
                            ✓
                          </div>
                          <p className="text-[#4B4B4B]">{peserta.nilaiAkhir}</p>
                        </div>
                      ) : (
                        <p className="text-[#4B4B4B] opacity-40 text-sm">-</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-center">
                        <Button
                          onClick={() => openEditDialog(peserta)}
                          className="bg-gradient-to-r from-[#00E5FF] to-[#1E90FF] hover:scale-110 text-white rounded-full h-9 w-9 p-0 border-0 shadow-md transition-transform"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => openDeleteDialog(peserta)}
                          className="bg-gradient-to-r from-[#FF1B6B] to-[#FF6B6B] hover:scale-110 text-white rounded-full h-9 w-9 p-0 border-0 shadow-md transition-transform"
                        >
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

        {/* Table Footer */}
        {filteredPeserta.length > 0 && (
          <div className="bg-gradient-to-r from-[#f8f9ff] to-[#fff5f8] px-6 py-4 border-t-2 border-gray-100">
            <div className="flex items-center justify-between">
              <p className="text-[#4B4B4B] opacity-70 text-sm">
                Menampilkan {filteredPeserta.length} dari {pesertaList.length} peserta
              </p>
              <div className="flex gap-2">
                <Button className="bg-white hover:bg-gray-50 text-[#4B4B4B] rounded-full h-10 px-4 border-2 border-gray-200">
                  <Download className="w-4 h-4 mr-2" />
                  Export Excel
                </Button>
                <Button className="bg-white hover:bg-gray-50 text-[#4B4B4B] rounded-full h-10 px-4 border-2 border-gray-200">
                  <Upload className="w-4 h-4 mr-2" />
                  Import Excel
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Manage Kelas Dialog */}
      <Dialog open={showManageKelasDialog} onOpenChange={setShowManageKelasDialog}>
        <DialogContent className="bg-white rounded-3xl max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#4B4B4B]">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FF1B6B] to-[#CE93D8] rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              Kelola Kelas Pelatihan
            </DialogTitle>
            <DialogDescription>
              Tambah kelas baru atau kelola kelas yang sudah ada
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            {/* Add New Kelas Form */}
            <Card className="bg-gradient-to-r from-[#f8f9ff] to-[#fff5f8] p-5 rounded-2xl border-2 border-gray-200 mb-6">
              <h4 className="text-[#4B4B4B] mb-4">➕ Tambah Kelas Baru</h4>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <Input
                  type="text"
                  placeholder="Nama Kelas (misal: Kelas D - Malam)"
                  value={kelasForm.namaKelas}
                  onChange={(e) => setKelasForm({ ...kelasForm, namaKelas: e.target.value })}
                  className="h-12 rounded-2xl border-2 border-gray-200"
                />
                <Input
                  type="text"
                  placeholder="Nama Pelatih"
                  value={kelasForm.pelatih}
                  onChange={(e) => setKelasForm({ ...kelasForm, pelatih: e.target.value })}
                  className="h-12 rounded-2xl border-2 border-gray-200"
                />
              </div>
              <Button
                onClick={handleAddKelas}
                className="bg-gradient-to-r from-[#7FFF00] to-[#00E5FF] hover:scale-105 text-white rounded-2xl h-12 px-6 border-0 shadow-lg transition-transform w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Kelas
              </Button>
            </Card>

            {/* Existing Kelas List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {kelasList.map((kelas) => (
                <Card key={kelas.id} className="p-5 rounded-2xl border-2 border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${kelas.color} rounded-full flex items-center justify-center text-white`}>
                        {kelas.namaKelas.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[#4B4B4B] mb-1">{kelas.namaKelas}</p>
                        <p className="text-[#4B4B4B] opacity-60 text-sm">👤 {kelas.pelatih} • {kelas.jumlahPeserta} peserta</p>
                      </div>
                    </div>
                    <Badge className={`bg-gradient-to-r ${kelas.color} text-white border-0 rounded-full px-4 py-2`}>
                      Aktif
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-white rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#4B4B4B]">
              <div className="w-10 h-10 bg-gradient-to-br from-[#7FFF00] to-[#00E5FF] rounded-full flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
              Tambah Peserta Baru
            </DialogTitle>
            <DialogDescription>
              Lengkapi data peserta yang akan bergabung dalam pelatihan
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="nama" className="text-[#4B4B4B] mb-2 block">Nama Lengkap</Label>
              <Input
                id="nama"
                type="text"
                placeholder="Masukkan nama peserta"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                className="h-12 rounded-2xl border-2 border-gray-200 focus:border-[#00E5FF]"
              />
            </div>

            <div>
              <Label htmlFor="umur" className="text-[#4B4B4B] mb-2 block">Umur</Label>
              <Input
                id="umur"
                type="number"
                placeholder="Masukkan umur"
                value={formData.umur}
                onChange={(e) => setFormData({ ...formData, umur: e.target.value })}
                className="h-12 rounded-2xl border-2 border-gray-200 focus:border-[#00E5FF]"
              />
            </div>

            <div>
              <Label htmlFor="jenisDisabilitas" className="text-[#4B4B4B] mb-2 block">Jenis Disabilitas</Label>
              <Select 
                value={formData.jenisDisabilitas}
                onValueChange={(value) => setFormData({ ...formData, jenisDisabilitas: value })}
              >
                <SelectTrigger className="h-12 rounded-2xl border-2 border-gray-200">
                  <SelectValue placeholder="Pilih jenis disabilitas" />
                </SelectTrigger>
                <SelectContent>
                  {jenisDisabilitasOptions.map((jenis) => (
                    <SelectItem key={jenis} value={jenis}>{jenis}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="kelasId" className="text-[#4B4B4B] mb-2 block">Kelas</Label>
              <Select 
                value={formData.kelasId}
                onValueChange={(value) => setFormData({ ...formData, kelasId: value })}
              >
                <SelectTrigger className="h-12 rounded-2xl border-2 border-gray-200">
                  <SelectValue placeholder="Pilih kelas" />
                </SelectTrigger>
                <SelectContent>
                  {kelasList.map((kelas) => (
                    <SelectItem key={kelas.id} value={kelas.id.toString()}>
                      {kelas.namaKelas} - {kelas.pelatih}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="tanggalMasuk" className="text-[#4B4B4B] mb-2 block">Tanggal Bergabung</Label>
              <Input
                id="tanggalMasuk"
                type="date"
                value={formData.tanggalMasuk}
                onChange={(e) => setFormData({ ...formData, tanggalMasuk: e.target.value })}
                className="h-12 rounded-2xl border-2 border-gray-200 focus:border-[#00E5FF]"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => {
                  setShowAddDialog(false);
                  resetForm();
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-[#4B4B4B] rounded-2xl h-12 border-0"
              >
                <X className="w-4 h-4 mr-2" />
                Batal
              </Button>
              <Button
                onClick={handleAddPeserta}
                className="flex-1 bg-gradient-to-r from-[#7FFF00] to-[#00E5FF] hover:scale-105 text-white rounded-2xl h-12 border-0 shadow-lg transition-transform"
              >
                <Save className="w-4 h-4 mr-2" />
                Simpan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-white rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#4B4B4B]">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00E5FF] to-[#1E90FF] rounded-full flex items-center justify-center">
                <Edit2 className="w-5 h-5 text-white" />
              </div>
              Edit Data Peserta
            </DialogTitle>
            <DialogDescription>
              Perbarui informasi peserta yang sudah terdaftar
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="edit-nama" className="text-[#4B4B4B] mb-2 block">Nama Lengkap</Label>
              <Input
                id="edit-nama"
                type="text"
                placeholder="Masukkan nama peserta"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                className="h-12 rounded-2xl border-2 border-gray-200 focus:border-[#00E5FF]"
              />
            </div>

            <div>
              <Label htmlFor="edit-umur" className="text-[#4B4B4B] mb-2 block">Umur</Label>
              <Input
                id="edit-umur"
                type="number"
                placeholder="Masukkan umur"
                value={formData.umur}
                onChange={(e) => setFormData({ ...formData, umur: e.target.value })}
                className="h-12 rounded-2xl border-2 border-gray-200 focus:border-[#00E5FF]"
              />
            </div>

            <div>
              <Label htmlFor="edit-jenisDisabilitas" className="text-[#4B4B4B] mb-2 block">Jenis Disabilitas</Label>
              <Select 
                value={formData.jenisDisabilitas}
                onValueChange={(value) => setFormData({ ...formData, jenisDisabilitas: value })}
              >
                <SelectTrigger className="h-12 rounded-2xl border-2 border-gray-200">
                  <SelectValue placeholder="Pilih jenis disabilitas" />
                </SelectTrigger>
                <SelectContent>
                  {jenisDisabilitasOptions.map((jenis) => (
                    <SelectItem key={jenis} value={jenis}>{jenis}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-kelasId" className="text-[#4B4B4B] mb-2 block">Kelas</Label>
              <Select 
                value={formData.kelasId}
                onValueChange={(value) => setFormData({ ...formData, kelasId: value })}
              >
                <SelectTrigger className="h-12 rounded-2xl border-2 border-gray-200">
                  <SelectValue placeholder="Pilih kelas" />
                </SelectTrigger>
                <SelectContent>
                  {kelasList.map((kelas) => (
                    <SelectItem key={kelas.id} value={kelas.id.toString()}>
                      {kelas.namaKelas} - {kelas.pelatih}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-tanggalMasuk" className="text-[#4B4B4B] mb-2 block">Tanggal Bergabung</Label>
              <Input
                id="edit-tanggalMasuk"
                type="date"
                value={formData.tanggalMasuk}
                onChange={(e) => setFormData({ ...formData, tanggalMasuk: e.target.value })}
                className="h-12 rounded-2xl border-2 border-gray-200 focus:border-[#00E5FF]"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => {
                  setShowEditDialog(false);
                  setSelectedPeserta(null);
                  resetForm();
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-[#4B4B4B] rounded-2xl h-12 border-0"
              >
                <X className="w-4 h-4 mr-2" />
                Batal
              </Button>
              <Button
                onClick={handleEditPeserta}
                className="flex-1 bg-gradient-to-r from-[#00E5FF] to-[#1E90FF] hover:scale-105 text-white rounded-2xl h-12 border-0 shadow-lg transition-transform"
              >
                <Save className="w-4 h-4 mr-2" />
                Update
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-white rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#4B4B4B]">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FF1B6B] to-[#FF6B6B] rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-white" />
              </div>
              Hapus Peserta
            </DialogTitle>
            <DialogDescription>
              Konfirmasi penghapusan data peserta dari sistem
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <div className="bg-gradient-to-r from-[#FF1B6B]/10 to-[#FF6B6B]/10 p-6 rounded-2xl mb-6">
              <p className="text-[#4B4B4B] text-center mb-2">
                Apakah Anda yakin ingin menghapus peserta:
              </p>
              <p className="text-[#4B4B4B] text-center">
                <strong>{selectedPeserta?.nama}</strong>
              </p>
              <p className="text-[#4B4B4B] opacity-60 text-sm text-center mt-2">
                dari kelas: {selectedPeserta && getKelasName(selectedPeserta.kelasId)}
              </p>
            </div>

            <p className="text-[#4B4B4B] opacity-60 text-sm text-center mb-6">
              ⚠️ Data yang sudah dihapus tidak dapat dikembalikan!
            </p>

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setShowDeleteDialog(false);
                  setSelectedPeserta(null);
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-[#4B4B4B] rounded-2xl h-12 border-0"
              >
                <X className="w-4 h-4 mr-2" />
                Batal
              </Button>
              <Button
                onClick={handleDeletePeserta}
                className="flex-1 bg-gradient-to-r from-[#FF1B6B] to-[#FF6B6B] hover:scale-105 text-white rounded-2xl h-12 border-0 shadow-lg transition-transform"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Hapus
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
