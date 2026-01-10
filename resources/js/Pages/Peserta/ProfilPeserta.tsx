import { Trophy, Star, Flame, BookOpen, Settings, LogOut, Award } from 'lucide-react';
import { router } from '@inertiajs/react';
import BottomNav from '@/Components/BottomNavPeserta';

// --- Interfaces Data ---
interface Achievement {
    id: number;
    title: string;
    emoji: string;
    unlocked: boolean;
}

interface UserStats {
    level: number;
    xp: number;
    streak: number;
    completed_workshops: number;
    total_workshops: number;
}

interface WorkshopProgress {
    title: string;
    progress_percent: number;
    status: 'Selesai' | 'Sedang Belajar' | 'Terkunci';
}

interface ProfilPesertaProps {
  auth: {
    user: {
      name: string;
      email: string;
    }
  };
  // Props ini sekarang DIJAMIN dikirim dari controller
  stats: UserStats; 
  achievements: Achievement[];
  progress_list: WorkshopProgress[];
}

export default function ProfilPeserta({ auth, stats, achievements, progress_list }: ProfilPesertaProps) {

  const handleLogout = () => {
    router.post('/logout');
  };

  return (
    <div className="min-h-screen bg-[#FFF8E1] font-sans pb-32">
      
      {/* HEADER DEKORATIF */}
      <div className="relative bg-[#5D4037] pb-24 rounded-b-[3rem] shadow-[0_10px_0_rgba(93,64,55,0.3)] overflow-hidden">
         <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#FFF 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
         
         <div className="p-6 relative z-10 flex justify-between items-start">
            <h1 className="text-2xl font-black text-[#FFECB3] tracking-wide">Profil Saya</h1>
            <button onClick={handleLogout} className="bg-[#8D6E63] p-2 rounded-xl text-[#FFECB3] hover:bg-[#A1887F] border-2 border-[#A1887F]">
                <LogOut className="w-5 h-5" />
            </button>
         </div>
      </div>

      <div className="px-4 md:px-8 max-w-2xl mx-auto -mt-20 relative z-20 space-y-8">
        
        {/* === CARD PROFIL UTAMA === */}
        <div className="bg-[#FFFAF0] rounded-[2.5rem] p-6 text-center border-[6px] border-[#8D6E63] shadow-[0_10px_0_rgba(93,64,55,0.2)]">
            
            {/* Avatar Besar */}
            <div className="w-28 h-28 bg-[#FFCA28] rounded-full mx-auto -mt-16 mb-4 flex items-center justify-center border-[6px] border-white shadow-lg">
                <span className="text-6xl">😎</span>
            </div>

            <h2 className="text-2xl font-black text-[#5D4037] mb-1">{auth.user.name}</h2>
            <div className="inline-block bg-[#E0E0E0] px-3 py-1 rounded-full text-xs font-bold text-gray-500 mb-6">
                {auth.user.email}
            </div>

            {/* Stats Grid - MENGGUNAKAN DATA ASLI DARI PROPS 'stats' */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#E3F2FD] p-3 rounded-2xl border-[3px] border-[#90CAF9]">
                    <div className="flex items-center justify-center gap-2 mb-1">
                        <Trophy className="w-4 h-4 text-[#1E88E5]" />
                        <span className="text-xs font-black text-[#1565C0] uppercase">Level</span>
                    </div>
                    <div className="text-2xl font-black text-[#0D47A1]">{stats.level}</div>
                </div>
                <div className="bg-[#FFF8E1] p-3 rounded-2xl border-[3px] border-[#FFE082]">
                    <div className="flex items-center justify-center gap-2 mb-1">
                        <Star className="w-4 h-4 text-[#FFB300]" />
                        <span className="text-xs font-black text-[#FF6F00] uppercase">XP Poin</span>
                    </div>
                    <div className="text-2xl font-black text-[#E65100]">{stats.xp}</div>
                </div>
                <div className="bg-[#FFEBEE] p-3 rounded-2xl border-[3px] border-[#FFCDD2]">
                    <div className="flex items-center justify-center gap-2 mb-1">
                        <Flame className="w-4 h-4 text-[#E53935]" />
                        <span className="text-xs font-black text-[#C62828] uppercase">Streak</span>
                    </div>
                    <div className="text-2xl font-black text-[#B71C1C]">{stats.streak} Hari</div>
                </div>
                <div className="bg-[#E8F5E9] p-3 rounded-2xl border-[3px] border-[#A5D6A7]">
                    <div className="flex items-center justify-center gap-2 mb-1">
                        <BookOpen className="w-4 h-4 text-[#43A047]" />
                        <span className="text-xs font-black text-[#2E7D32] uppercase">Materi</span>
                    </div>
                    <div className="text-2xl font-black text-[#1B5E20]">{stats.completed_workshops}/{stats.total_workshops}</div>
                </div>
            </div>
        </div>

        {/* === ACHIEVEMENTS - MENGGUNAKAN DATA ASLI DARI PROPS 'achievements' === */}
        <div className="bg-white rounded-[2.5rem] p-6 border-[5px] border-[#D7CCC8] shadow-sm">
             <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#FFCA28] rounded-xl border-[3px] border-[#FF8F00]">
                    <Award className="w-5 h-5 text-[#5D4037]" strokeWidth={3} />
                </div>
                <h3 className="text-lg font-black text-[#5D4037]">Koleksi Badge</h3>
             </div>

             <div className="grid grid-cols-3 gap-3">
                {achievements.map((badge) => (
                    <div 
                        key={badge.id}
                        className={`aspect-square rounded-2xl flex flex-col items-center justify-center border-[3px] transition-all ${
                            badge.unlocked 
                                ? 'bg-[#FFF8E1] border-[#FFB300] shadow-[0_4px_0_#FF6F00]' 
                                : 'bg-gray-100 border-gray-200 opacity-60'
                        }`}
                    >
                        <div className={`text-3xl mb-1 ${!badge.unlocked && 'grayscale opacity-50'}`}>
                            {badge.emoji}
                        </div>
                        <div className={`text-[10px] font-bold uppercase ${badge.unlocked ? 'text-[#5D4037]' : 'text-gray-400'}`}>
                            {badge.title}
                        </div>
                    </div>
                ))}
             </div>
        </div>

        {/* === PROGRESS BELAJAR - MENGGUNAKAN DATA ASLI DARI PROPS 'progress_list' === */}
        <div className="bg-white rounded-[2.5rem] p-6 border-[5px] border-[#D7CCC8] shadow-sm">
             <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#42A5F5] rounded-xl border-[3px] border-[#1565C0]">
                    <BookOpen className="w-5 h-5 text-white" strokeWidth={3} />
                </div>
                <h3 className="text-lg font-black text-[#5D4037]">Perjalananmu</h3>
             </div>

             <div className="space-y-5">
                {progress_list.map((item, idx) => (
                    <div key={idx}>
                        <div className="flex justify-between items-end mb-1">
                            <h4 className="font-bold text-[#5D4037] text-sm">{item.title}</h4>
                            <span className={`text-xs font-black px-2 py-0.5 rounded-md ${
                                item.status === 'Selesai' ? 'bg-[#C8E6C9] text-[#2E7D32]' :
                                item.status === 'Sedang Belajar' ? 'bg-[#FFECB3] text-[#F57F17]' :
                                'bg-gray-200 text-gray-500'
                            }`}>
                                {item.status}
                            </span>
                        </div>
                        <div className="w-full h-4 bg-[#EFEBE9] rounded-full border-2 border-[#D7CCC8] overflow-hidden">
                            <div 
                                className={`h-full rounded-full transition-all duration-1000 ${
                                    item.status === 'Selesai' ? 'bg-[#66BB6A]' :
                                    item.status === 'Sedang Belajar' ? 'bg-[#FFCA28]' : 'bg-gray-300'
                                }`}
                                style={{ width: `${item.progress_percent}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
             </div>
        </div>

        {/* SETTINGS BUTTON */}
        <button className="w-full py-4 bg-white border-[4px] border-[#D7CCC8] rounded-3xl text-[#8D6E63] font-black text-lg flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-95 transition-transform">
            <Settings className="w-5 h-5" /> Pengaturan Akun
        </button>

      </div>

      <BottomNav />
    </div>
  );
}