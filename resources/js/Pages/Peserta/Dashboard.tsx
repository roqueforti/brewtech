import { Play, Lock, Trophy, Award, BookOpen, LogOut } from 'lucide-react';
import { router } from '@inertiajs/react'; 
import { HeaderPeserta } from '../../Components/HeaderPeserta'; 
import BottomNav from '@/Components/BottomNavPeserta'; 

// --- 1. DEFINISI TIPE DATA ---
interface DashboardProps {
  auth: {
    user: {
      name: string;
      kelas: {
        nama: string;
        emoji: string;
        pelatih: string;
      } | null;
    }
  };
  workshops: any[];
  stats: {
    completed: number;
    active: number;
    locked: number;
  };
}

export default function DashboardPeserta({ auth, workshops, stats }: DashboardProps) {
  const { user } = auth;
  
  // Fallback data
  const kelasInfo = user.kelas || { nama: "Umum", pelatih: "-", emoji: "👋" };

  // --- 2. FUNGSI LOGOUT / NAVIGASI ---
  const handleNavigate = (page: string) => {
    if (page === 'workshop-flow') {
        // Default ke ID 1 (V60) untuk saat ini
        router.visit('/workshop/1'); 
    } else if (page === 'login' || page === 'logout') {
        router.post('/logout'); 
    }
  };

  return (
    // Padding bawah pb-32 agar tidak tertutup Bottom Nav
    <div className="min-h-screen bg-[#FFF8E1] font-sans pb-32">
      
      {/* Header */}
      <HeaderPeserta 
        userName={user.name} 
        onNavigate={handleNavigate} 
        onBackToRoleSelection={() => handleNavigate('logout')} 
      />

      <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
        
        {/* === WELCOME CARD === */}
        <div className="bg-[#FFFAF0] rounded-[2.5rem] p-6 md:p-10 shadow-[0_10px_0_rgba(93,64,55,0.2)] border-[6px] border-[#8D6E63] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-10 text-9xl select-none pointer-events-none">
            {kelasInfo.emoji}
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="w-24 h-24 bg-[#FFECB3] rounded-full flex items-center justify-center text-6xl border-[4px] border-[#FFA000] shadow-md animate-bounce">
              👋
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-5xl font-black text-[#5D4037] mb-2 tracking-wide">
                Halo, {user.name}!
              </h1>
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl border-[3px] border-[#D7CCC8]">
                <span className="text-2xl">{kelasInfo.emoji}</span>
                <p className="text-lg font-bold text-[#8D6E63]">
                  {kelasInfo.nama} • <span className="text-[#5D4037]">{kelasInfo.pelatih}</span>
                </p>
              </div>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 md:gap-6 mt-8">
            <div className="bg-[#E8F5E9] rounded-3xl p-4 text-center border-[4px] border-[#66BB6A] shadow-[0_4px_0_#388E3C]">
              <div className="text-4xl font-black text-[#2E7D32] mb-1">{stats.completed}</div>
              <div className="text-xs md:text-sm font-bold text-[#1B5E20] uppercase bg-white/50 rounded-lg py-1">Selesai</div>
            </div>
            <div className="bg-[#E3F2FD] rounded-3xl p-4 text-center border-[4px] border-[#42A5F5] shadow-[0_4px_0_#1976D2]">
              <div className="text-4xl font-black text-[#1565C0] mb-1">{stats.active}</div>
              <div className="text-xs md:text-sm font-bold text-[#0D47A1] uppercase bg-white/50 rounded-lg py-1">Aktif</div>
            </div>
            <div className="bg-[#EEEEEE] rounded-3xl p-4 text-center border-[4px] border-[#BDBDBD] shadow-[0_4px_0_#757575]">
              <div className="text-4xl font-black text-[#616161] mb-1">{stats.locked}</div>
              <div className="text-xs md:text-sm font-bold text-[#424242] uppercase bg-white/50 rounded-lg py-1">Terkunci</div>
            </div>
          </div>
        </div>

        {/* === WORKSHOPS === */}
        <div>
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="p-2 bg-[#FFCA28] rounded-xl border-[3px] border-[#FF8F00] shadow-sm">
                <BookOpen className="w-6 h-6 text-[#5D4037]" strokeWidth={3} />
            </div>
            <h2 className="text-3xl font-black text-[#5D4037]">Misi Belajarmu</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            
            {/* TAMBAHKAN INDEX DI SINI */}
            {workshops.map((workshop, index) => (
              <button
                key={workshop.id}
                onClick={() => workshop.status !== 'locked' && handleNavigate('workshop-flow')}
                disabled={workshop.status === 'locked'}
                className={`relative group rounded-[2rem] p-6 border-[5px] text-left transition-all duration-150 h-full flex flex-col justify-between
                  ${workshop.status === 'locked' 
                    ? 'opacity-80 cursor-not-allowed bg-gray-50 border-gray-200 border-b-[5px]' 
                    : `${workshop.theme.bg} ${workshop.theme.border} border-b-[8px] active:border-b-[5px] active:translate-y-[3px] hover:brightness-105`
                  }`}
              >
                
                {/* === BADGE NOMOR URUT (WORKSHOP 1, 2, DST) === */}
                <div className="absolute top-4 left-4">
                    <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border-2 shadow-sm ${
                         workshop.status === 'locked' 
                            ? 'bg-gray-200 text-gray-400 border-gray-300' 
                            : 'bg-white/60 text-[#5D4037] border-white/40'
                    }`}>
                        Workshop {index + 1}
                    </div>
                </div>

                {/* Status Badge (Kanan Atas) */}
                <div className="absolute top-4 right-4">
                  {workshop.status === 'completed' && (
                    <div className="bg-[#66BB6A] border-[3px] border-[#2E7D32] text-white text-xs font-black px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1 transform rotate-3 group-hover:rotate-6 transition-transform">
                      <Trophy className="w-3 h-3" strokeWidth={4} /> SELESAI
                    </div>
                  )}
                  {workshop.status === 'available' && (
                    <div className="bg-[#42A5F5] border-[3px] border-[#1565C0] text-white text-xs font-black px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1 animate-pulse">
                      <Play className="w-3 h-3" strokeWidth={4} /> MULAI
                    </div>
                  )}
                  {workshop.status === 'locked' && (
                    <div className="bg-[#BDBDBD] border-[3px] border-[#757575] text-white text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1">
                      <Lock className="w-3 h-3" strokeWidth={4} /> KUNCI
                    </div>
                  )}
                </div>

                {/* Content Tengah */}
                <div className="flex flex-col items-center justify-center py-8 mt-4">
                    <div className={`text-7xl mb-4 transform transition-transform ${workshop.status !== 'locked' ? 'group-hover:scale-125 group-hover:rotate-6' : 'grayscale opacity-50'}`}>
                        {workshop.emoji}
                    </div>
                    <h3 className={`text-xl font-black mb-1 text-center leading-tight ${workshop.theme.text}`}>{workshop.title}</h3>
                    <p className="text-sm font-bold opacity-70 text-center">{workshop.subtitle}</p>
                </div>

                {/* Tombol Aksi Bawah */}
                {workshop.status !== 'locked' && (
                    <div className={`mt-auto w-full py-3 rounded-xl text-center text-white font-black text-sm bg-white/20 border-2 border-white/30 backdrop-blur-sm group-hover:bg-white/30 transition-colors`}>
                        {workshop.status === 'completed' ? 'Ulangi Materi ↺' : 'Masuk Kelas ➜'}
                    </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* === ACHIEVEMENTS === */}
        <div className="bg-[#FFFAF0] rounded-[2.5rem] p-8 shadow-[0_10px_0_rgba(93,64,55,0.2)] border-[6px] border-[#8D6E63]">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#EF5350] rounded-xl border-[3px] border-[#C62828] shadow-sm">
                <Award className="w-6 h-6 text-white" strokeWidth={3} />
            </div>
            <h2 className="text-3xl font-black text-[#5D4037]">Koleksi Badge</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
             <div className="bg-[#FFF8E1] rounded-3xl p-4 text-center border-[4px] border-[#FFB300] shadow-[0_5px_0_#FF6F00]">
                <div className="text-5xl mb-2">🏆</div>
                <p className="text-xs font-black text-[#5D4037]">Master</p>
             </div>
             <div className="bg-[#FCE4EC] rounded-3xl p-4 text-center border-[4px] border-[#F06292] shadow-[0_5px_0_#C2185B]">
                <div className="text-5xl mb-2">⭐</div>
                <p className="text-xs font-black text-[#880E4F]">Cepat!</p>
             </div>
             <div className="bg-gray-100 rounded-3xl p-4 text-center border-[4px] border-dashed border-gray-300 opacity-60">
               <div className="text-5xl mb-2 grayscale opacity-50">🎨</div>
               <p className="text-xs font-bold text-gray-500">???</p>
             </div>
             <div className="bg-gray-100 rounded-3xl p-4 text-center border-[4px] border-dashed border-gray-300 opacity-60">
               <div className="text-5xl mb-2 grayscale opacity-50">💯</div>
               <p className="text-xs font-bold text-gray-500">???</p>
             </div>
          </div>
        </div>

        {/* === TOMBOL LOGOUT BESAR === */}
        <div className="flex justify-center mt-8 pb-8">
            <button 
                onClick={() => handleNavigate('logout')}
                className="flex items-center gap-3 bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-3xl font-black text-xl border-b-[6px] border-red-700 active:border-b-0 active:translate-y-[6px] transition-all shadow-xl"
            >
                <LogOut className="w-8 h-8" strokeWidth={3} />
                KELUAR KELAS
            </button>
        </div>

      </div>

      {/* === BOTTOM NAVIGATION === */}
      <BottomNav />
    </div>
  );
}