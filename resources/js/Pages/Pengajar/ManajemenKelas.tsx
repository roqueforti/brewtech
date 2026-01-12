import { useState } from "react";
import { 
  Plus, Edit, Trash, Users, BookOpen, 
  Calendar, Search, Coffee 
} from "lucide-react";
import { Head, router } from "@inertiajs/react"; // Import router
import SidebarPengajar from "@/Components/SidebarPengajar";

// --- TIPE DATA DARI DATABASE ---
interface Kelas {
  id: number;
  nama: string;      // Sesuai nama kolom DB
  pelatih: string;
  periode: string;
  deskripsi: string;
  students_count: number;  // dari withCount
  workshops_count: number; // dari withCount
  theme: 'green' | 'yellow' | 'pink' | 'blue';
  status: "Aktif" | "Selesai" | "Draft";
}

interface ManajemenKelasProps {
  auth: { user: { name: string } };
  kelas_list: Kelas[]; // Data dinamis dari controller
}

export default function ManajemenKelas({ auth, kelas_list }: ManajemenKelasProps) {
  
  // --- STATE ---
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedKelas, setSelectedKelas] = useState<Kelas | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    nama: "",
    pelatih: "",
    periode: "",
    deskripsi: "",
    theme: "green" // Default theme
  });

  // --- HELPER WARNA ---
  const getThemeStyle = (theme: string) => {
    switch(theme) {
        case 'green': return { bg: 'bg-[#E8F5E9]', border: 'border-[#C8E6C9]', text: 'text-[#2E7D32]', badge: 'bg-[#2E7D32]' };
        case 'yellow': return { bg: 'bg-[#FFF8E1]', border: 'border-[#FFE0B2]', text: 'text-[#EF6C00]', badge: 'bg-[#EF6C00]' };
        case 'pink': return { bg: 'bg-[#FCE4EC]', border: 'border-[#F8BBD0]', text: 'text-[#C2185B]', badge: 'bg-[#C2185B]' };
        default: return { bg: 'bg-[#E3F2FD]', border: 'border-[#BBDEFB]', text: 'text-[#1565C0]', badge: 'bg-[#1565C0]' };
    }
  };

  // --- HANDLERS (LOGIKA KE DATABASE) ---
  
  // 1. Tambah Kelas
  const handleAddKelas = () => {
    // Random theme biar variatif
    const themes = ['green', 'yellow', 'pink', 'blue'];
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];

    router.post('/pengajar/kelas', {
        ...formData,
        theme: randomTheme
    }, {
        onSuccess: () => {
            setShowAddDialog(false);
            resetForm();
        }
    });
  };

  // 2. Edit Kelas
  const handleEditKelas = () => {
    if (!selectedKelas) return;
    
    router.put(`/pengajar/kelas/${selectedKelas.id}`, formData, {
        onSuccess: () => {
            setShowEditDialog(false);
            resetForm();
        }
    });
  };

  // 3. Hapus Kelas
  const handleDeleteKelas = () => {
    if (!selectedKelas) return;

    router.delete(`/pengajar/kelas/${selectedKelas.id}`, {
        onSuccess: () => {
            setShowDeleteDialog(false);
            setSelectedKelas(null);
        }
    });
  };

  const resetForm = () => {
    setFormData({ nama: "", pelatih: "", periode: "", deskripsi: "", theme: "green" });
    setSelectedKelas(null);
  };

  const openEdit = (kelas: Kelas) => {
    setSelectedKelas(kelas);
    setFormData({ 
        nama: kelas.nama, 
        pelatih: kelas.pelatih, 
        periode: kelas.periode, 
        deskripsi: kelas.deskripsi,
        theme: kelas.theme 
    });
    setShowEditDialog(true);
  };

  return (
    <div className="flex min-h-screen bg-[#FAFAFA] font-sans">
      <Head title="Manajemen Kelas" />
      <SidebarPengajar />

      <main className="flex-1 max-w-[1600px] w-full">
        <div className="p-6 md:p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-black text-[#5D4037]">Manajemen Kelas</h1>
              <p className="text-gray-400 font-medium mt-1">Buat dan atur kurikulum pelatihan Anda</p>
            </div>
            <button 
                onClick={() => setShowAddDialog(true)}
                className="flex items-center gap-2 bg-[#5D4037] hover:bg-[#4E342E] text-[#FFCA28] px-5 py-3 rounded-xl font-bold shadow-md shadow-[#5D4037]/20 transition-all active:scale-95"
            >
                <Plus size={20} strokeWidth={3} />
                <span>Buat Kelas</span>
            </button>
          </div>

          {/* LIST KELAS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {kelas_list.length > 0 ? kelas_list.map((kelas) => {
                const style = getThemeStyle(kelas.theme);
                return (
                    <div key={kelas.id} className={`bg-white rounded-[2rem] border border-gray-200 p-1 shadow-sm hover:shadow-lg transition-all duration-300 group`}>
                        <div className={`rounded-[1.8rem] p-6 ${style.bg} border ${style.border} h-full flex flex-col`}>
                            
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider text-white ${style.badge}`}>
                                    {kelas.status}
                                </span>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openEdit(kelas)} className="p-2 bg-white/50 hover:bg-white rounded-full text-gray-600 transition-colors">
                                        <Edit size={16} />
                                    </button>
                                    <button onClick={() => { setSelectedKelas(kelas); setShowDeleteDialog(true); }} className="p-2 bg-white/50 hover:bg-red-50 rounded-full text-red-500 transition-colors">
                                        <Trash size={16} />
                                    </button>
                                </div>
                            </div>

                            <h3 className={`text-2xl font-black mb-2 ${style.text}`}>{kelas.nama}</h3>
                            <div className="flex items-center gap-2 mb-4 opacity-70">
                                <Calendar size={14} className={style.text} />
                                <span className={`text-xs font-bold ${style.text}`}>{kelas.periode}</span>
                            </div>

                            <p className="text-sm text-gray-500 font-medium mb-6 line-clamp-2 flex-1">
                                {kelas.deskripsi || "Belum ada deskripsi."}
                            </p>

                            <div className="bg-white/60 rounded-2xl p-4 flex justify-between items-center mb-4">
                                <div className="text-center">
                                    <p className="text-[10px] uppercase font-bold text-gray-400">Workshop</p>
                                    <p className={`text-xl font-black ${style.text}`}>{kelas.workshops_count || 0}</p>
                                </div>
                                <div className="w-[1px] h-8 bg-gray-200"></div>
                                <div className="text-center">
                                    <p className="text-[10px] uppercase font-bold text-gray-400">Peserta</p>
                                    <p className={`text-xl font-black ${style.text}`}>{kelas.students_count || 0}</p>
                                </div>
                            </div>

                            <button className={`w-full py-3.5 rounded-xl font-bold bg-white border border-gray-100 shadow-sm text-gray-600 hover:text-white hover:${style.badge} transition-colors flex items-center justify-center gap-2`}>
                                <BookOpen size={18} />
                                Kelola Kurikulum
                            </button>
                        </div>
                    </div>
                );
            }) : (
                <div className="col-span-full py-20 text-center text-gray-400">
                   Belum ada data kelas. Silakan buat baru!
                </div>
            )}
          </div>
        </div>
      </main>

      {/* --- DIALOG MODALS --- */}
      
      {/* 1. Tambah Dialog */}
      {showAddDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-[2rem] w-full max-w-lg p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                  <h2 className="text-2xl font-black text-[#5D4037] mb-6">Buat Kelas Baru ☕</h2>
                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-bold text-[#5D4037] mb-1">Nama Kelas</label>
                          <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white" 
                            value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} placeholder="Contoh: Barista Basic A" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-[#5D4037] mb-1">Periode</label>
                            <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white" 
                                value={formData.periode} onChange={e => setFormData({...formData, periode: e.target.value})} placeholder="Jan 2024" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-[#5D4037] mb-1">Pelatih</label>
                            <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white" 
                                value={formData.pelatih} onChange={e => setFormData({...formData, pelatih: e.target.value})} placeholder="Nama Anda" />
                        </div>
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-[#5D4037] mb-1">Deskripsi</label>
                          <textarea className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white min-h-[100px]" 
                             value={formData.deskripsi} onChange={e => setFormData({...formData, deskripsi: e.target.value})}></textarea>
                      </div>
                      <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                          <button onClick={() => setShowAddDialog(false)} className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100">Batal</button>
                          <button onClick={handleAddKelas} className="flex-1 py-3 rounded-xl font-bold bg-[#5D4037] text-[#FFCA28] hover:bg-[#4E342E]">Simpan</button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* 2. Edit Dialog (Hampir sama, handler beda) */}
      {showEditDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-[2rem] w-full max-w-lg p-8 shadow-2xl">
                  <h2 className="text-2xl font-black text-[#5D4037] mb-6">Edit Kelas ✏️</h2>
                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-bold text-[#5D4037] mb-1">Nama Kelas</label>
                          <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" 
                            value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} />
                      </div>
                      {/* ... Field lainnya sama ... */}
                      <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                          <button onClick={() => setShowEditDialog(false)} className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100">Batal</button>
                          <button onClick={handleEditKelas} className="flex-1 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700">Update</button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* 3. Delete Dialog */}
      {showDeleteDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
              <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl text-center">
                  <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4"><Trash size={32} /></div>
                  <h2 className="text-2xl font-black text-[#5D4037] mb-2">Hapus Kelas?</h2>
                  <p className="text-gray-400 text-sm mb-6">Yakin hapus <strong>{selectedKelas?.nama}</strong>?</p>
                  <div className="flex gap-3">
                      <button onClick={() => setShowDeleteDialog(false)} className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100">Batal</button>
                      <button onClick={handleDeleteKelas} className="flex-1 py-3 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600">Ya, Hapus</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}