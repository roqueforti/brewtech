import { Link, usePage } from '@inertiajs/react';
import { Home, BookOpen, Users, BarChart3, LogOut, Coffee } from 'lucide-react';
import { router } from '@inertiajs/react';

// Helper for route handling in TypeScript
declare function route(name: string, params?: any, absolute?: boolean): string;

export default function HeaderPengajar() {
  const { url, props } = usePage();
  const auth = props.auth as any; // Quick fix for auth type

  // Function to check if the link is active
  const isActive = (path: string) => url.startsWith(path);

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-40 shadow-sm/50 backdrop-blur-md bg-white/90">
      {/* --- LOGO & BRAND --- */}
      <div className="flex items-center gap-3">
        <div className="bg-[#5D4037] p-2 rounded-xl shadow-lg shadow-[#5D4037]/20">
          <Coffee className="w-6 h-6 text-[#FFCA28]" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-xl font-black text-[#5D4037] tracking-tight leading-none">BREWTECH</h1>
          <p className="text-[10px] uppercase font-bold text-[#8D6E63] tracking-widest">Mentor Panel</p>
        </div>
      </div>

      {/* --- NAVIGATION MENU --- */}
      <div className="hidden md:flex items-center gap-2 bg-gray-50/50 p-1.5 rounded-2xl border border-gray-100">
        <Link
          href="/pengajar/dashboard"
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all font-bold text-sm ${
            isActive('/pengajar/dashboard')
              ? 'bg-[#5D4037] text-[#FFCA28] shadow-md'
              : 'text-gray-500 hover:bg-white hover:text-[#5D4037]'
          }`}
        >
          <Home size={18} strokeWidth={2.5} />
          <span>Dashboard</span>
        </Link>

        <Link
          href="/pengajar/kelas" // Assuming you will create this route
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all font-bold text-sm ${
            isActive('/pengajar/kelas')
              ? 'bg-[#5D4037] text-[#FFCA28] shadow-md'
              : 'text-gray-500 hover:bg-white hover:text-[#5D4037]'
          }`}
        >
          <BookOpen size={18} strokeWidth={2.5} />
          <span>Manajemen Kelas</span>
        </Link>

        <Link
          href="/pengajar/siswa" // Assuming you will create this route
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all font-bold text-sm ${
            isActive('/pengajar/siswa')
              ? 'bg-[#5D4037] text-[#FFCA28] shadow-md'
              : 'text-gray-500 hover:bg-white hover:text-[#5D4037]'
          }`}
        >
          <Users size={18} strokeWidth={2.5} />
          <span>Data Siswa</span>
        </Link>

        <Link
          href="/pengajar/analisis" // Assuming you will create this route
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all font-bold text-sm ${
            isActive('/pengajar/analisis')
              ? 'bg-[#5D4037] text-[#FFCA28] shadow-md'
              : 'text-gray-500 hover:bg-white hover:text-[#5D4037]'
          }`}
        >
          <BarChart3 size={18} strokeWidth={2.5} />
          <span>Analisis SPK</span>
        </Link>
      </div>

      {/* --- USER PROFILE & LOGOUT --- */}
      <div className="flex items-center gap-4">
        <div className="hidden md:block text-right">
          <p className="text-xs text-gray-400 font-bold">Selamat Datang,</p>
          <p className="text-[#5D4037] font-black leading-none">{auth?.user?.name || 'Pengajar'}</p>
        </div>
        <button
          onClick={() => router.post('/logout')}
          className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors border border-red-100"
          title="Keluar"
        >
          <LogOut size={18} strokeWidth={2.5} />
        </button>
      </div>
    </nav>
  );
}