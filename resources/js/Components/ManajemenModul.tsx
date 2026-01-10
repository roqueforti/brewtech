import { useState } from "react";
import { Plus, Edit, Trash, Eye, MessageCircle, CheckCircle, Users as UsersIcon, BookOpen, ArrowLeft, Video, Search, Edit2, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { HeaderPengajar } from "./HeaderPengajar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
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

interface Workshop {
  id: number;
  title: string;
  deskripsi: string;
  jumlahPelajaran: number;
  durasi: string;
  color: string;
  status: string;
  emoji: string;
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

interface ManajemenModulProps {
  onNavigate: (page: string, kelasId?: number) => void;
  currentPage: string;
  kelasId?: number;
  onBackToRoleSelection?: () => void;
}

export function ManajemenModul({ onNavigate, currentPage, kelasId = 1, onBackToRoleSelection }: ManajemenModulProps) {
  const [activeTab, setActiveTab] = useState("workshop");
  
  // Workshop states
  const [showAddWorkshopDialog, setShowAddWorkshopDialog] = useState(false);
  const [showEditWorkshopDialog, setShowEditWorkshopDialog] = useState(false);
  const [showDeleteWorkshopDialog, setShowDeleteWorkshopDialog] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  
  const [workshopFormData, setWorkshopFormData] = useState({
    title: "",
    deskripsi: "",
    jumlahPelajaran: "",
    durasi: "",
    emoji: "☕",
  });

  // Peserta states
  const [showAddPesertaDialog, setShowAddPesertaDialog] = useState(false);
  const [showEditPesertaDialog, setShowEditPesertaDialog] = useState(false);
  const [showDeletePesertaDialog, setShowDeletePesertaDialog] = useState(false);
  const [selectedPeserta, setSelectedPeserta] = useState<Peserta | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [pesertaFormData, setPesertaFormData] = useState({
    nama: "",
    umur: "",
    jenisDisabilitas: "",
    tanggalMasuk: "",
  });

  // Mock data kelas
  const kelasInfo = {
    1: { namaKelas: "Kelas A - Pagi", pelatih: "Bu Sari", color: "from-[#7FFF00] to-[#00E5FF]" },
    2: { namaKelas: "Kelas B - Siang", pelatih: "Pak Budi", color: "from-[#FFEB3B] to-[#FFA500]" },
    3: { namaKelas: "Kelas C - Sore", pelatih: "Bu Dewi", color: "from-[#FF1B6B] to-[#CE93D8]" },
  }[kelasId] || { namaKelas: "Kelas A - Pagi", pelatih: "Bu Sari", color: "from-[#7FFF00] to-[#00E5FF]" };

  const [workshopList, setWorkshopList] = useState<Workshop[]>([
    { 
      id: 1, 
      title: 'Workshop 1: Pengenalan Alat Barista', 
      deskripsi: 'Mengenal berbagai alat barista dan fungsinya',
      jumlahPelajaran: 5,
      durasi: '2 jam',
      color: 'from-[#FF1B6B] to-[#FF6B9D]', 
      status: 'Aktif', 
      emoji: '🔧' 
    },
    { 
      id: 2, 
      title: 'Workshop 2: Teknik Menyeduh Kopi', 
      deskripsi: 'Belajar berbagai teknik menyeduh kopi yang benar',
      jumlahPelajaran: 8,
      durasi: '3 jam',
      color: 'from-[#FF6B00] to-[#FF9E40]', 
      status: 'Aktif', 
      emoji: '☕' 
    },
    { 
      id: 3, 
      title: 'Workshop 3: Latte Art Dasar', 
      deskripsi: 'Membuat latte art sederhana untuk pemula',
      jumlahPelajaran: 10,
      durasi: '4 jam',
      color: 'from-[#9C27B0] to-[#CE93D8]', 
      status: 'Aktif', 
      emoji: '🎨' 
    },
    { 
      id: 4, 
      title: 'Workshop 4: Pelayanan Customer', 
      deskripsi: 'Soft skill dan etika pelayanan di cafe',
      jumlahPelajaran: 6,
      durasi: '2.5 jam',
      color: 'from-[#00B8D4] to-[#00E5FF]', 
      status: 'Draft', 
      emoji: '😊' 
    },
  ]);

  // Mock data peserta - filtered by kelasId
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

  const feedbacks = [
    {
      id: 1,
      student: 'Andi Wijaya',
      module: 'Workshop 2: Teknik Menyeduh Kopi',
      message: 'Bu, saya masih bingung dengan takaran kopi. Bisa dijelaskan lagi?',
      time: '2 jam yang lalu',
      status: 'Belum Dibaca',
      color: 'from-[#FF6B00] to-[#FF9E40]'
    },
    {
      id: 2,
      student: 'Siti Nurhaliza',
      module: 'Workshop 3: Latte Art Dasar',
      message: 'Terima kasih Bu! Saya sudah coba lagi dan hasilnya lebih baik.',
      time: '5 jam yang lalu',
      status: 'Sudah Dibaca',
      color: 'from-[#9C27B0] to-[#CE93D8]'
    },
    {
      id: 3,
      student: 'Budi Santoso',
      module: 'Workshop 1: Pengenalan Alat Barista',
      message: 'Apakah ada video tambahan untuk mengenal mesin espresso?',
      time: '1 hari yang lalu',
      status: 'Belum Dibaca',
      color: 'from-[#FF1B6B] to-[#FF6B9D]'
    },
  ];

  const colors = [
    'from-[#FF1B6B] to-[#FF6B9D]',
    'from-[#FF6B00] to-[#FF9E40]',
    'from-[#9C27B0] to-[#CE93D8]',
    'from-[#00B8D4] to-[#00E5FF]',
    'from-[#7FFF00] to-[#00E5FF]',
    'from-[#FFEB3B] to-[#FFA500]',
  ];

  const emojiOptions = ['☕', '🍫', '🎨', '🔧', '📚', '👨‍🍳', '🥤', '🍰', '😊', '⭐'];

  const jenisDisabilitasOptions = [
    "Motorik Ringan",
    "Motorik Sedang",
    "Pendengaran",
    "Penglihatan Rendah",
    "Autisme Ringan",
    "Down Syndrome"
  ];

  // Filter peserta by kelasId
  const filteredPeserta = pesertaList.filter(p => {
    const matchKelas = p.kelasId === kelasId;
    const matchSearch = p.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.jenisDisabilitas.toLowerCase().includes(searchQuery.toLowerCase());
    return matchKelas && matchSearch;
  });

  // Workshop handlers
  const handleAddWorkshop = () => {
    if (!workshopFormData.title || !workshopFormData.jumlahPelajaran || !workshopFormData.durasi) {
      alert("Mohon lengkapi data workshop!");
      return;
    }

    const newWorkshop: Workshop = {
      id: workshopList.length + 1,
      title: workshopFormData.title,
      deskripsi: workshopFormData.deskripsi,
      jumlahPelajaran: parseInt(workshopFormData.jumlahPelajaran),
      durasi: workshopFormData.durasi,
      color: colors[workshopList.length % colors.length],
      status: "Draft",
      emoji: workshopFormData.emoji
    };

    setWorkshopList([...workshopList, newWorkshop]);
    setShowAddWorkshopDialog(false);
    resetWorkshopForm();
  };

  const handleEditWorkshop = () => {
    if (!selectedWorkshop || !workshopFormData.title || !workshopFormData.jumlahPelajaran || !workshopFormData.durasi) {
      alert("Mohon lengkapi data workshop!");
      return;
    }

    setWorkshopList(workshopList.map(w => 
      w.id === selectedWorkshop.id 
        ? { ...w, 
            title: workshopFormData.title, 
            deskripsi: workshopFormData.deskripsi,
            jumlahPelajaran: parseInt(workshopFormData.jumlahPelajaran),
            durasi: workshopFormData.durasi,
            emoji: workshopFormData.emoji
          }
        : w
    ));

    setShowEditWorkshopDialog(false);
    setSelectedWorkshop(null);
    resetWorkshopForm();
  };

  const handleDeleteWorkshop = () => {
    if (selectedWorkshop) {
      setWorkshopList(workshopList.filter(w => w.id !== selectedWorkshop.id));
      setShowDeleteWorkshopDialog(false);
      setSelectedWorkshop(null);
    }
  };

  const handleToggleStatus = (workshopId: number) => {
    setWorkshopList(workshopList.map(w => 
      w.id === workshopId 
        ? { ...w, status: w.status === 'Aktif' ? 'Draft' : 'Aktif' }
        : w
    ));
  };

  const resetWorkshopForm = () => {
    setWorkshopFormData({
      title: "",
      deskripsi: "",
      jumlahPelajaran: "",
      durasi: "",
      emoji: "☕",
    });
  };

  const openEditWorkshopDialog = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setWorkshopFormData({
      title: workshop.title,
      deskripsi: workshop.deskripsi,
      jumlahPelajaran: workshop.jumlahPelajaran.toString(),
      durasi: workshop.durasi,
      emoji: workshop.emoji,
    });
    setShowEditWorkshopDialog(true);
  };

  const openDeleteWorkshopDialog = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setShowDeleteWorkshopDialog(true);
  };

  // Peserta handlers
  const handleAddPeserta = () => {
    if (!pesertaFormData.nama || !pesertaFormData.umur || !pesertaFormData.jenisDisabilitas) {
      alert("Mohon lengkapi semua data!");
      return;
    }

    const newPeserta: Peserta = {
      id: pesertaList.length + 1,
      nama: pesertaFormData.nama,
      umur: parseInt(pesertaFormData.umur),
      jenisDisabilitas: pesertaFormData.jenisDisabilitas,
      kelasId: kelasId,
      tanggalMasuk: pesertaFormData.tanggalMasuk || new Date().toISOString().split('T')[0],
      progress: 0,
      status: "Baru Bergabung",
      modulSelesai: 0,
      totalModul: 4
    };

    setPesertaList([...pesertaList, newPeserta]);
    setShowAddPesertaDialog(false);
    resetPesertaForm();
  };

  const handleEditPeserta = () => {
    if (!selectedPeserta || !pesertaFormData.nama || !pesertaFormData.umur || !pesertaFormData.jenisDisabilitas) {
      alert("Mohon lengkapi semua data!");
      return;
    }

    setPesertaList(pesertaList.map(p => 
      p.id === selectedPeserta.id 
        ? { ...p, 
            nama: pesertaFormData.nama, 
            umur: parseInt(pesertaFormData.umur),
            jenisDisabilitas: pesertaFormData.jenisDisabilitas,
            tanggalMasuk: pesertaFormData.tanggalMasuk
          }
        : p
    ));

    setShowEditPesertaDialog(false);
    setSelectedPeserta(null);
    resetPesertaForm();
  };

  const handleDeletePeserta = () => {
    if (selectedPeserta) {
      setPesertaList(pesertaList.filter(p => p.id !== selectedPeserta.id));
      setShowDeletePesertaDialog(false);
      setSelectedPeserta(null);
    }
  };

  const resetPesertaForm = () => {
    setPesertaFormData({
      nama: "",
      umur: "",
      jenisDisabilitas: "",
      tanggalMasuk: "",
    });
  };

  const openEditPesertaDialog = (peserta: Peserta) => {
    setSelectedPeserta(peserta);
    setPesertaFormData({
      nama: peserta.nama,
      umur: peserta.umur.toString(),
      jenisDisabilitas: peserta.jenisDisabilitas,
      tanggalMasuk: peserta.tanggalMasuk,
    });
    setShowEditPesertaDialog(true);
  };

  const openDeletePesertaDialog = (peserta: Peserta) => {
    setSelectedPeserta(peserta);
    setShowDeletePesertaDialog(true);
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
    <div className="min-h-screen bg-gradient-to-br from-[#F3E5F5] via-[#FCE4EC] to-[#FFF3E0]">
      <HeaderPengajar onNavigate={onNavigate} currentPage={currentPage} onBackToRoleSelection={onBackToRoleSelection} />

      {/* Main Content */}
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        {/* Breadcrumb & Back Button */}
        <div className="mb-4 md:mb-6">
          <Button
            onClick={() => onNavigate('manajemen-kelas')}
            className="bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 rounded-xl h-9 md:h-10 px-3 md:px-4 shadow-sm mb-4 text-sm md:text-base"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Kembali ke Manajemen Kelas</span>
            <span className="sm:hidden">Kembali</span>
          </Button>
        </div>

        {/* Kelas Header */}
        <Card className={`bg-gradient-to-br ${kelasInfo.color} p-4 md:p-6 rounded-2xl md:rounded-3xl border-0 shadow-lg mb-6 md:mb-8 relative overflow-hidden`}>
          <div className="absolute right-4 top-4 md:right-6 md:top-6 text-6xl md:text-8xl opacity-20">
            🏫
          </div>
          <div className="relative z-10">
            <Badge className="bg-white/30 text-white border-0 rounded-full backdrop-blur mb-2 md:mb-3 text-xs">
              Kelola Kelas
            </Badge>
            <h2 className="text-white text-xl md:text-2xl mb-1 md:mb-2">{kelasInfo.namaKelas}</h2>
            <p className="text-white/90 text-sm md:text-base">👤 Pelatih: {kelasInfo.pelatih}</p>
            <div className="flex items-center gap-3 md:gap-4 mt-2 md:mt-3">
              <p className="text-white/80 text-xs md:text-sm">📚 {workshopList.length} workshop</p>
              <p className="text-white/80 text-xs md:text-sm">👥 {filteredPeserta.length} peserta</p>
            </div>
          </div>
        </Card>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-white rounded-2xl p-1.5 md:p-2 shadow-lg mb-4 md:mb-6 h-auto border-2 border-gray-100 w-full grid grid-cols-3">
            <TabsTrigger 
              value="workshop" 
              className="rounded-xl px-2 md:px-6 py-2 md:py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#9C27B0] data-[state=active]:to-[#E91E63] data-[state=active]:text-white text-xs md:text-base"
            >
              <BookOpen className="w-4 h-4 md:w-5 md:h-5 md:mr-2" />
              <span className="hidden md:inline">Workshop</span>
            </TabsTrigger>
            <TabsTrigger 
              value="peserta" 
              className="rounded-xl px-2 md:px-6 py-2 md:py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00B8D4] data-[state=active]:to-[#00E5FF] data-[state=active]:text-white text-xs md:text-base"
            >
              <UsersIcon className="w-4 h-4 md:w-5 md:h-5 md:mr-2" />
              <span className="hidden md:inline">Peserta</span>
            </TabsTrigger>
            <TabsTrigger 
              value="feedback" 
              className="rounded-xl px-2 md:px-6 py-2 md:py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF6B00] data-[state=active]:to-[#FF9E40] data-[state=active]:text-white text-xs md:text-base relative"
            >
              <MessageCircle className="w-4 h-4 md:w-5 md:h-5 md:mr-2" />
              <span className="hidden md:inline">Feedback</span>
              {feedbacks.filter(f => f.status === 'Belum Dibaca').length > 0 && (
                <Badge className="bg-red-500 text-white border-0 rounded-full ml-1 md:ml-2 text-xs px-1.5 md:px-2 absolute -top-1 -right-1 md:static">
                  {feedbacks.filter(f => f.status === 'Belum Dibaca').length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Tab: Workshop */}
          <TabsContent value="workshop">
            <Card className="bg-white rounded-2xl md:rounded-3xl border-0 shadow-lg overflow-hidden">
              <div className="p-4 md:p-6 border-b-2 border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0">
                <div>
                  <h3 className="text-gray-800 text-lg md:text-xl mb-1">Daftar Workshop Pelatihan</h3>
                  <p className="text-gray-600 text-sm">
                    Kelola konten pembelajaran untuk kelas {kelasInfo.namaKelas}
                  </p>
                </div>
                <Button 
                  onClick={() => setShowAddWorkshopDialog(true)}
                  className="bg-gradient-to-r from-[#9C27B0] to-[#E91E63] hover:opacity-90 text-white border-0 rounded-xl h-10 md:h-11 px-4 md:px-6 shadow-lg w-full md:w-auto text-sm md:text-base"
                >
                  <Plus className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  <span className="hidden sm:inline">Tambah Workshop Baru</span>
                  <span className="sm:hidden">Tambah Workshop</span>
                </Button>
              </div>

              <div className="p-4 md:p-6">
                {workshopList.length === 0 ? (
                  <div className="text-center py-8 md:py-12">
                    <div className="text-6xl md:text-8xl mb-3 md:mb-4">📚</div>
                    <h4 className="text-gray-800 text-lg md:text-xl mb-2">Belum Ada Workshop</h4>
                    <p className="text-gray-600 text-sm md:text-base mb-4 md:mb-6 px-4">Mulai dengan membuat workshop pertama untuk kelas ini</p>
                    <Button 
                      onClick={() => setShowAddWorkshopDialog(true)}
                      className="bg-gradient-to-r from-[#9C27B0] to-[#E91E63] hover:opacity-90 text-white border-0 rounded-xl h-10 md:h-11 px-4 md:px-6 shadow-lg text-sm md:text-base"
                    >
                      <Plus className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                      Tambah Workshop Pertama
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {workshopList.map((workshop) => (
                      <Card key={workshop.id} className={`bg-gradient-to-br ${workshop.color} p-4 md:p-6 rounded-2xl md:rounded-3xl border-0 shadow-lg relative overflow-hidden`}>
                        <div className="absolute right-3 top-3 md:right-4 md:top-4 text-6xl md:text-8xl opacity-20">
                          {workshop.emoji}
                        </div>

                        <div className="relative z-10">
                          <div className="flex items-start justify-between mb-3 md:mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-white/30 rounded-xl md:rounded-2xl flex items-center justify-center text-2xl md:text-3xl backdrop-blur">
                                  {workshop.emoji}
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-white text-base md:text-lg leading-tight">{workshop.title}</h4>
                                  <Badge 
                                    className={`border-0 rounded-full text-xs mt-1 cursor-pointer ${
                                      workshop.status === 'Aktif' 
                                        ? 'bg-white/30 text-white backdrop-blur' 
                                        : 'bg-white/20 text-white/80 backdrop-blur'
                                    }`}
                                    onClick={() => handleToggleStatus(workshop.id)}
                                  >
                                    {workshop.status}
                                  </Badge>
                                </div>
                              </div>
                              
                              <p className="text-white/90 text-xs md:text-sm mb-2 md:mb-3 line-clamp-2">
                                {workshop.deskripsi}
                              </p>

                              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                                <div className="flex items-center gap-1 md:gap-2 bg-white/20 backdrop-blur rounded-full px-2 md:px-3 py-1">
                                  <Video className="w-3 h-3 md:w-4 md:h-4 text-white" />
                                  <span className="text-white text-xs md:text-sm">{workshop.jumlahPelajaran} video</span>
                                </div>
                                <div className="flex items-center gap-1 md:gap-2 bg-white/20 backdrop-blur rounded-full px-2 md:px-3 py-1">
                                  <BookOpen className="w-3 h-3 md:w-4 md:h-4 text-white" />
                                  <span className="text-white text-xs md:text-sm">{workshop.durasi}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button className="flex-1 bg-white/30 hover:bg-white/40 text-white border-0 rounded-xl h-9 md:h-10 backdrop-blur text-xs md:text-sm">
                              <Eye className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                              <span className="hidden sm:inline">Lihat Detail</span>
                              <span className="sm:hidden">Detail</span>
                            </Button>
                            <Button 
                              onClick={() => openEditWorkshopDialog(workshop)}
                              className="bg-white/30 hover:bg-white/40 text-white border-0 rounded-xl h-9 w-9 md:h-10 md:w-10 p-0 backdrop-blur"
                            >
                              <Edit className="w-3 h-3 md:w-4 md:h-4" />
                            </Button>
                            <Button 
                              onClick={() => openDeleteWorkshopDialog(workshop)}
                              className="bg-white/30 hover:bg-white/40 text-white border-0 rounded-xl h-9 w-9 md:h-10 md:w-10 p-0 backdrop-blur"
                            >
                              <Trash className="w-3 h-3 md:w-4 md:h-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Tab: Peserta */}
          <TabsContent value="peserta">
            <Card className="bg-white rounded-2xl md:rounded-3xl border-0 shadow-lg overflow-hidden">
              <div className="p-4 md:p-6 border-b-2 border-gray-100">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0 mb-4">
                  <div>
                    <h3 className="text-gray-800 text-lg md:text-xl mb-1">Peserta di Kelas Ini</h3>
                    <p className="text-gray-600 text-sm">
                      Kelola peserta yang terdaftar di kelas {kelasInfo.namaKelas}
                    </p>
                  </div>
                  <Button 
                    onClick={() => setShowAddPesertaDialog(true)}
                    className="bg-gradient-to-r from-[#00B8D4] to-[#00E5FF] hover:opacity-90 text-white border-0 rounded-xl h-10 md:h-11 px-4 md:px-6 shadow-lg w-full md:w-auto text-sm md:text-base"
                  >
                    <Plus className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    Tambah Peserta
                  </Button>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Cari nama peserta atau jenis disabilitas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 md:pl-12 h-11 md:h-12 rounded-2xl border-2 border-gray-200 focus:border-[#00E5FF] text-sm md:text-base"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-[#f8f9ff] to-[#fff5f8] hover:from-[#f8f9ff] hover:to-[#fff5f8]">
                      <TableHead className="text-gray-700 py-4">No</TableHead>
                      <TableHead className="text-gray-700">Nama Peserta</TableHead>
                      <TableHead className="text-gray-700">Umur</TableHead>
                      <TableHead className="text-gray-700">Jenis Disabilitas</TableHead>
                      <TableHead className="text-gray-700">Tanggal Masuk</TableHead>
                      <TableHead className="text-gray-700">Progress</TableHead>
                      <TableHead className="text-gray-700">Status</TableHead>
                      <TableHead className="text-gray-700">Nilai</TableHead>
                      <TableHead className="text-gray-700 text-center">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPeserta.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-12">
                          <div className="text-6xl mb-4">🔍</div>
                          <p className="text-gray-800 mb-2">Tidak ada peserta ditemukan</p>
                          <p className="text-gray-600 text-sm">
                            {searchQuery ? `Tidak ada hasil untuk "${searchQuery}"` : `Belum ada peserta di ${kelasInfo.namaKelas}`}
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
                            <p className="text-gray-800">{peserta.nama}</p>
                          </TableCell>
                          <TableCell>
                            <p className="text-gray-800">{peserta.umur} th</p>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-gray-100 text-gray-700 border-0 rounded-full">
                              {peserta.jenisDisabilitas}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <p className="text-gray-800 text-sm">
                              {new Date(peserta.tanggalMasuk).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </TableCell>
                          <TableCell>
                            <div className="w-32">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-gray-700 text-xs">{peserta.modulSelesai}/{peserta.totalModul}</p>
                                <p className="text-gray-700 text-xs">{peserta.progress}%</p>
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
                                <p className="text-gray-800">{peserta.nilaiAkhir}</p>
                              </div>
                            ) : (
                              <p className="text-gray-400 text-sm">-</p>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2 justify-center">
                              <Button
                                onClick={() => openEditPesertaDialog(peserta)}
                                className="bg-gradient-to-r from-[#00E5FF] to-[#1E90FF] hover:scale-110 text-white rounded-full h-9 w-9 p-0 border-0 shadow-md transition-transform"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={() => openDeletePesertaDialog(peserta)}
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

              {filteredPeserta.length > 0 && (
                <div className="bg-gradient-to-r from-[#f8f9ff] to-[#fff5f8] px-4 md:px-6 py-3 md:py-4 border-t-2 border-gray-100">
                  <p className="text-gray-600 text-xs md:text-sm">
                    Menampilkan {filteredPeserta.length} peserta di kelas {kelasInfo.namaKelas}
                  </p>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Tab: Feedback */}
          <TabsContent value="feedback">
            <Card className="bg-white rounded-2xl md:rounded-3xl border-0 shadow-lg overflow-hidden">
              <div className="p-4 md:p-6 border-b-2 border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0">
                <div>
                  <h3 className="text-gray-800 text-lg md:text-xl mb-1">Feedback & Pertanyaan Peserta</h3>
                  <p className="text-gray-600 text-sm">
                    <Badge className="bg-gradient-to-r from-[#FF6B00] to-[#FF9E40] text-white border-0 rounded-full mr-2 text-xs">
                      {feedbacks.filter(f => f.status === 'Belum Dibaca').length} Baru
                    </Badge>
                    dari {feedbacks.length} total feedback di kelas ini
                  </p>
                </div>
                <Button className="bg-gradient-to-r from-[#00B8D4] to-[#00E5FF] hover:opacity-90 text-white border-0 rounded-xl h-10 md:h-11 px-4 md:px-6 shadow-lg w-full md:w-auto text-sm md:text-base">
                  <MessageCircle className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  Lihat Semua
                </Button>
              </div>

              <div className="p-4 md:p-6">
                <div className="space-y-3 md:space-y-4">
                  {feedbacks.map((feedback) => (
                    <Card key={feedback.id} className="border-2 border-gray-100 rounded-2xl p-4 md:p-6 hover:shadow-lg transition-all">
                      <div className="flex items-start gap-3 md:gap-4">
                        <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${feedback.color} rounded-full flex items-center justify-center text-white flex-shrink-0`}>
                          {feedback.student.charAt(0)}
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row items-start justify-between mb-2 gap-2 md:gap-0">
                            <div>
                              <h4 className="text-gray-800 text-sm md:text-base">{feedback.student}</h4>
                              <p className="text-gray-500 text-xs md:text-sm">{feedback.module}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge className={`border-0 rounded-full text-xs ${
                                feedback.status === 'Belum Dibaca'
                                  ? 'bg-gradient-to-r from-[#FF6B00] to-[#FF9E40] text-white'
                                  : 'bg-gray-200 text-gray-600'
                              }`}>
                                {feedback.status}
                              </Badge>
                              <span className="text-gray-400 text-xs">{feedback.time}</span>
                            </div>
                          </div>

                          <p className="text-gray-700 text-sm md:text-base mb-3">{feedback.message}</p>

                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button className="bg-gradient-to-r from-[#9C27B0] to-[#E91E63] hover:opacity-90 text-white border-0 rounded-xl h-9 px-4 text-xs md:text-sm">
                              <MessageCircle className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                              Balas
                            </Button>
                            {feedback.status === 'Belum Dibaca' && (
                              <Button className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-0 rounded-xl h-9 px-4 text-xs md:text-sm">
                                <CheckCircle className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                                <span className="hidden md:inline">Tandai Sudah Dibaca</span>
                                <span className="md:hidden">Tandai Dibaca</span>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Workshop Dialogs */}
      <Dialog open={showAddWorkshopDialog} onOpenChange={setShowAddWorkshopDialog}>
        <DialogContent className="bg-white rounded-3xl max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gray-800">
              <div className="w-10 h-10 bg-gradient-to-br from-[#9C27B0] to-[#E91E63] rounded-full flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
              Tambah Workshop Baru
            </DialogTitle>
            <DialogDescription>
              Buat workshop baru untuk kelas {kelasInfo.namaKelas}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="emoji" className="text-gray-700 mb-2 block">Pilih Emoji</Label>
              <div className="flex gap-2 flex-wrap">
                {emojiOptions.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setWorkshopFormData({ ...workshopFormData, emoji })}
                    className={`w-12 h-12 text-2xl rounded-xl border-2 transition-all ${
                      workshopFormData.emoji === emoji 
                        ? 'border-[#9C27B0] bg-purple-50 scale-110' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="title" className="text-gray-700 mb-2 block">Judul Workshop</Label>
              <Input
                id="title"
                type="text"
                placeholder="Contoh: Workshop 5: Customer Service Excellence"
                value={workshopFormData.title}
                onChange={(e) => setWorkshopFormData({ ...workshopFormData, title: e.target.value })}
                className="h-12 rounded-2xl border-2 border-gray-200 focus:border-[#9C27B0]"
              />
            </div>

            <div>
              <Label htmlFor="deskripsi" className="text-gray-700 mb-2 block">Deskripsi</Label>
              <Textarea
                id="deskripsi"
                placeholder="Deskripsi singkat tentang workshop ini..."
                value={workshopFormData.deskripsi}
                onChange={(e) => setWorkshopFormData({ ...workshopFormData, deskripsi: e.target.value })}
                className="rounded-2xl border-2 border-gray-200 focus:border-[#9C27B0] min-h-20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="jumlahPelajaran" className="text-gray-700 mb-2 block">Jumlah Video</Label>
                <Input
                  id="jumlahPelajaran"
                  type="number"
                  placeholder="5"
                  value={workshopFormData.jumlahPelajaran}
                  onChange={(e) => setWorkshopFormData({ ...workshopFormData, jumlahPelajaran: e.target.value })}
                  className="h-12 rounded-2xl border-2 border-gray-200 focus:border-[#9C27B0]"
                />
              </div>

              <div>
                <Label htmlFor="durasi" className="text-gray-700 mb-2 block">Durasi Total</Label>
                <Input
                  id="durasi"
                  type="text"
                  placeholder="2 jam"
                  value={workshopFormData.durasi}
                  onChange={(e) => setWorkshopFormData({ ...workshopFormData, durasi: e.target.value })}
                  className="h-12 rounded-2xl border-2 border-gray-200 focus:border-[#9C27B0]"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => setShowAddWorkshopDialog(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 border-0 rounded-xl h-12"
              >
                Batal
              </Button>
              <Button
                onClick={handleAddWorkshop}
                className="flex-1 bg-gradient-to-r from-[#9C27B0] to-[#E91E63] hover:opacity-90 text-white border-0 rounded-xl h-12 shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Workshop
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditWorkshopDialog} onOpenChange={setShowEditWorkshopDialog}>
        <DialogContent className="bg-white rounded-3xl max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gray-800">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00B8D4] to-[#00E5FF] rounded-full flex items-center justify-center">
                <Edit className="w-5 h-5 text-white" />
              </div>
              Edit Workshop
            </DialogTitle>
            <DialogDescription>
              Ubah informasi workshop
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="edit-emoji" className="text-gray-700 mb-2 block">Pilih Emoji</Label>
              <div className="flex gap-2 flex-wrap">
                {emojiOptions.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setWorkshopFormData({ ...workshopFormData, emoji })}
                    className={`w-12 h-12 text-2xl rounded-xl border-2 transition-all ${
                      workshopFormData.emoji === emoji 
                        ? 'border-[#00B8D4] bg-cyan-50 scale-110' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="edit-title" className="text-gray-700 mb-2 block">Judul Workshop</Label>
              <Input
                id="edit-title"
                type="text"
                value={workshopFormData.title}
                onChange={(e) => setWorkshopFormData({ ...workshopFormData, title: e.target.value })}
                className="h-12 rounded-2xl border-2 border-gray-200 focus:border-[#00B8D4]"
              />
            </div>

            <div>
              <Label htmlFor="edit-deskripsi" className="text-gray-700 mb-2 block">Deskripsi</Label>
              <Textarea
                id="edit-deskripsi"
                value={workshopFormData.deskripsi}
                onChange={(e) => setWorkshopFormData({ ...workshopFormData, deskripsi: e.target.value })}
                className="rounded-2xl border-2 border-gray-200 focus:border-[#00B8D4] min-h-20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-jumlahPelajaran" className="text-gray-700 mb-2 block">Jumlah Video</Label>
                <Input
                  id="edit-jumlahPelajaran"
                  type="number"
                  value={workshopFormData.jumlahPelajaran}
                  onChange={(e) => setWorkshopFormData({ ...workshopFormData, jumlahPelajaran: e.target.value })}
                  className="h-12 rounded-2xl border-2 border-gray-200 focus:border-[#00B8D4]"
                />
              </div>

              <div>
                <Label htmlFor="edit-durasi" className="text-gray-700 mb-2 block">Durasi Total</Label>
                <Input
                  id="edit-durasi"
                  type="text"
                  value={workshopFormData.durasi}
                  onChange={(e) => setWorkshopFormData({ ...workshopFormData, durasi: e.target.value })}
                  className="h-12 rounded-2xl border-2 border-gray-200 focus:border-[#00B8D4]"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => setShowEditWorkshopDialog(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 border-0 rounded-xl h-12"
              >
                Batal
              </Button>
              <Button
                onClick={handleEditWorkshop}
                className="flex-1 bg-gradient-to-r from-[#00B8D4] to-[#00E5FF] hover:opacity-90 text-white border-0 rounded-xl h-12 shadow-lg"
              >
                Simpan Perubahan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteWorkshopDialog} onOpenChange={setShowDeleteWorkshopDialog}>
        <DialogContent className="bg-white rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gray-800">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FF1B6B] to-[#FF6B9D] rounded-full flex items-center justify-center">
                <Trash className="w-5 h-5 text-white" />
              </div>
              Hapus Workshop
            </DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus workshop ini?
            </DialogDescription>
          </DialogHeader>
          
          {selectedWorkshop && (
            <div className="mt-4">
              <Card className={`bg-gradient-to-br ${selectedWorkshop.color} p-4 rounded-2xl border-0`}>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{selectedWorkshop.emoji}</div>
                  <div>
                    <h4 className="text-white mb-1">{selectedWorkshop.title}</h4>
                    <p className="text-white/80 text-sm">
                      {selectedWorkshop.jumlahPelajaran} video • {selectedWorkshop.durasi}
                    </p>
                  </div>
                </div>
              </Card>
              
              <div className="mt-4 p-4 bg-red-50 rounded-2xl border-2 border-red-200">
                <p className="text-red-800 text-sm">
                  ⚠️ <strong>Peringatan:</strong> Menghapus workshop akan menghapus semua konten video dan data progress peserta di workshop ini.
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={() => setShowDeleteWorkshopDialog(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 border-0 rounded-xl h-12"
                >
                  Batal
                </Button>
                <Button
                  onClick={handleDeleteWorkshop}
                  className="flex-1 bg-gradient-to-r from-[#FF1B6B] to-[#FF6B9D] hover:opacity-90 text-white border-0 rounded-xl h-12 shadow-lg"
                >
                  <Trash className="w-4 h-4 mr-2" />
                  Ya, Hapus Workshop
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Peserta Dialogs */}
      <Dialog open={showAddPesertaDialog} onOpenChange={setShowAddPesertaDialog}>
        <DialogContent className="bg-white rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gray-800">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00B8D4] to-[#00E5FF] rounded-full flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
              Tambah Peserta ke Kelas
            </DialogTitle>
            <DialogDescription>
              Tambah peserta baru ke {kelasInfo.namaKelas}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="nama" className="text-gray-700 mb-2 block">Nama Lengkap</Label>
              <Input
                id="nama"
                type="text"
                placeholder="Masukkan nama peserta"
                value={pesertaFormData.nama}
                onChange={(e) => setPesertaFormData({ ...pesertaFormData, nama: e.target.value })}
                className="h-12 rounded-2xl border-2 border-gray-200 focus:border-[#00E5FF]"
              />
            </div>

            <div>
              <Label htmlFor="umur" className="text-gray-700 mb-2 block">Umur</Label>
              <Input
                id="umur"
                type="number"
                placeholder="Masukkan umur"
                value={pesertaFormData.umur}
                onChange={(e) => setPesertaFormData({ ...pesertaFormData, umur: e.target.value })}
                className="h-12 rounded-2xl border-2 border-gray-200 focus:border-[#00E5FF]"
              />
            </div>

            <div>
              <Label htmlFor="jenisDisabilitas" className="text-gray-700 mb-2 block">Jenis Disabilitas</Label>
              <Select 
                value={pesertaFormData.jenisDisabilitas}
                onValueChange={(value) => setPesertaFormData({ ...pesertaFormData, jenisDisabilitas: value })}
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
              <Label htmlFor="tanggalMasuk" className="text-gray-700 mb-2 block">Tanggal Masuk</Label>
              <Input
                id="tanggalMasuk"
                type="date"
                value={pesertaFormData.tanggalMasuk}
                onChange={(e) => setPesertaFormData({ ...pesertaFormData, tanggalMasuk: e.target.value })}
                className="h-12 rounded-2xl border-2 border-gray-200 focus:border-[#00E5FF]"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => setShowAddPesertaDialog(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 border-0 rounded-xl h-12"
              >
                Batal
              </Button>
              <Button
                onClick={handleAddPeserta}
                className="flex-1 bg-gradient-to-r from-[#00B8D4] to-[#00E5FF] hover:opacity-90 text-white border-0 rounded-xl h-12 shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Peserta
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditPesertaDialog} onOpenChange={setShowEditPesertaDialog}>
        <DialogContent className="bg-white rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gray-800">
              <div className="w-10 h-10 bg-gradient-to-br from-[#9C27B0] to-[#E91E63] rounded-full flex items-center justify-center">
                <Edit className="w-5 h-5 text-white" />
              </div>
              Edit Data Peserta
            </DialogTitle>
            <DialogDescription>
              Ubah informasi peserta
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="edit-nama" className="text-gray-700 mb-2 block">Nama Lengkap</Label>
              <Input
                id="edit-nama"
                type="text"
                value={pesertaFormData.nama}
                onChange={(e) => setPesertaFormData({ ...pesertaFormData, nama: e.target.value })}
                className="h-12 rounded-2xl border-2 border-gray-200 focus:border-[#9C27B0]"
              />
            </div>

            <div>
              <Label htmlFor="edit-umur" className="text-gray-700 mb-2 block">Umur</Label>
              <Input
                id="edit-umur"
                type="number"
                value={pesertaFormData.umur}
                onChange={(e) => setPesertaFormData({ ...pesertaFormData, umur: e.target.value })}
                className="h-12 rounded-2xl border-2 border-gray-200 focus:border-[#9C27B0]"
              />
            </div>

            <div>
              <Label htmlFor="edit-jenisDisabilitas" className="text-gray-700 mb-2 block">Jenis Disabilitas</Label>
              <Select 
                value={pesertaFormData.jenisDisabilitas}
                onValueChange={(value) => setPesertaFormData({ ...pesertaFormData, jenisDisabilitas: value })}
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
              <Label htmlFor="edit-tanggalMasuk" className="text-gray-700 mb-2 block">Tanggal Masuk</Label>
              <Input
                id="edit-tanggalMasuk"
                type="date"
                value={pesertaFormData.tanggalMasuk}
                onChange={(e) => setPesertaFormData({ ...pesertaFormData, tanggalMasuk: e.target.value })}
                className="h-12 rounded-2xl border-2 border-gray-200 focus:border-[#9C27B0]"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => setShowEditPesertaDialog(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 border-0 rounded-xl h-12"
              >
                Batal
              </Button>
              <Button
                onClick={handleEditPeserta}
                className="flex-1 bg-gradient-to-r from-[#9C27B0] to-[#E91E63] hover:opacity-90 text-white border-0 rounded-xl h-12 shadow-lg"
              >
                Simpan Perubahan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeletePesertaDialog} onOpenChange={setShowDeletePesertaDialog}>
        <DialogContent className="bg-white rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gray-800">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FF1B6B] to-[#FF6B9D] rounded-full flex items-center justify-center">
                <Trash className="w-5 h-5 text-white" />
              </div>
              Hapus Peserta
            </DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus peserta ini dari kelas?
            </DialogDescription>
          </DialogHeader>
          
          {selectedPeserta && (
            <div className="mt-4">
              <Card className="bg-gradient-to-br from-[#00E5FF] to-[#1E90FF] p-4 rounded-2xl border-0">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center text-white backdrop-blur">
                    {selectedPeserta.nama.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-white mb-1">{selectedPeserta.nama}</h4>
                    <p className="text-white/80 text-sm">
                      {selectedPeserta.umur} tahun • {selectedPeserta.jenisDisabilitas}
                    </p>
                  </div>
                </div>
              </Card>
              
              <div className="mt-4 p-4 bg-red-50 rounded-2xl border-2 border-red-200">
                <p className="text-red-800 text-sm">
                  ⚠️ <strong>Peringatan:</strong> Menghapus peserta akan menghapus semua data progress dan nilai peserta ini dari kelas.
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={() => setShowDeletePesertaDialog(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 border-0 rounded-xl h-12"
                >
                  Batal
                </Button>
                <Button
                  onClick={handleDeletePeserta}
                  className="flex-1 bg-gradient-to-r from-[#FF1B6B] to-[#FF6B9D] hover:opacity-90 text-white border-0 rounded-xl h-12 shadow-lg"
                >
                  <Trash className="w-4 h-4 mr-2" />
                  Ya, Hapus Peserta
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
