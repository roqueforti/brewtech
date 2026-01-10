import { Home, FileText, User } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';

export default function BottomNav() {
  const { url } = usePage();

  // Cek apakah URL saat ini cocok dengan path menu
  const isActive = (path: string) => url.startsWith(path);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      
      {/* Container Utama: Warna Coklat Tua dengan Sudut Melengkung di Atas */}
      <div className="bg-[#5D4037] pt-2 pb-6 px-4 rounded-t-[2.5rem] shadow-[0_-8px_0_rgba(141,110,99,0.3)] border-t-[6px] border-[#8D6E63]">
        <div className="max-w-md mx-auto flex justify-around items-end h-16 relative">
          
          {/* === TOMBOL HOME (Kuning) === */}
          <Link 
            href="/peserta/dashboard"
            className="group relative flex flex-col items-center justify-end w-20"
          >
            {/* Lingkaran Background (Hanya muncul jika Aktif) */}
            <div className={`absolute transition-all duration-300 ${
               isActive('/peserta/dashboard') 
                 ? '-top-8 bg-[#FFCA28] border-[4px] border-[#FF8F00] w-14 h-14 rounded-full shadow-lg flex items-center justify-center' 
                 : 'top-0 w-0 h-0 opacity-0'
            }`}>
               <Home className="w-7 h-7 text-[#5D4037]" strokeWidth={3} />
            </div>

            {/* Icon Inaktif (Hanya muncul jika TIDAK Aktif) */}
            <div className={`transition-all duration-300 ${isActive('/peserta/dashboard') ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}>
                <Home className="w-7 h-7 text-[#D7CCC8] group-hover:text-white" strokeWidth={2.5} />
            </div>
            
            {/* Label Text */}
            <span className={`text-xs font-black mt-1 transition-colors ${
                isActive('/peserta/dashboard') ? 'text-[#FFCA28] translate-y-1' : 'text-[#D7CCC8] group-hover:text-white'
            }`}>
                Home
            </span>
          </Link>

          {/* === TOMBOL NILAI & SPK (Biru) === */}
          <Link 
            href="/peserta/nilai-spk"
            className="group relative flex flex-col items-center justify-end w-20"
          >
            <div className={`absolute transition-all duration-300 ${
               isActive('/peserta/nilai-spk') 
                 ? '-top-8 bg-[#29B6F6] border-[4px] border-[#0288D1] w-14 h-14 rounded-full shadow-lg flex items-center justify-center' 
                 : 'top-0 w-0 h-0 opacity-0'
            }`}>
               <FileText className="w-7 h-7 text-white" strokeWidth={3} />
            </div>

            <div className={`transition-all duration-300 ${isActive('/peserta/nilai-spk') ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}>
                <FileText className="w-7 h-7 text-[#D7CCC8] group-hover:text-white" strokeWidth={2.5} />
            </div>
            
            <span className={`text-xs font-black mt-1 transition-colors ${
                isActive('/peserta/nilai-spk') ? 'text-[#29B6F6] translate-y-1' : 'text-[#D7CCC8] group-hover:text-white'
            }`}>
                Nilai
            </span>
          </Link>

          {/* === TOMBOL PROFIL (Merah) - SEKARANG AKTIF === */}
          <Link 
            href="/peserta/profil"
            className="group relative flex flex-col items-center justify-end w-20"
          >
            <div className={`absolute transition-all duration-300 ${
               isActive('/peserta/profil') 
                 ? '-top-8 bg-[#EF5350] border-[4px] border-[#C62828] w-14 h-14 rounded-full shadow-lg flex items-center justify-center' 
                 : 'top-0 w-0 h-0 opacity-0'
            }`}>
               <User className="w-7 h-7 text-white" strokeWidth={3} />
            </div>

            <div className={`transition-all duration-300 ${isActive('/peserta/profil') ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}>
                <User className="w-7 h-7 text-[#D7CCC8] group-hover:text-white" strokeWidth={2.5} />
            </div>
            
            <span className={`text-xs font-black mt-1 transition-colors ${
                isActive('/peserta/profil') ? 'text-[#EF5350] translate-y-1' : 'text-[#D7CCC8] group-hover:text-white'
            }`}>
                Profil
            </span>
          </Link>

        </div>
      </div>
    </div>
  );
}