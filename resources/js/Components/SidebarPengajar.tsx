import { Link, usePage, router } from '@inertiajs/react';
import { Home, BookOpen, Users, BarChart3, LogOut, Coffee, Settings } from 'lucide-react';

export default function SidebarPengajar() {
  const { url, props } = usePage();
  const auth = props.auth as any;

  // Helper untuk cek link aktif
  const isActive = (path: string) => url.startsWith(path);

  // Daftar Menu
  const menus = [
    { label: 'Dashboard', icon: Home, href: '/pengajar/dashboard' },
    { label: 'Manajemen Kelas', icon: BookOpen, href: '/pengajar/kelas' },
    { label: 'Data Siswa', icon: Users, href: '/pengajar/siswa' },
    { label: 'Analisis SPK', icon: BarChart3, href: '/pengajar/analisis' },
  ];

  return (
    <aside className="w-72 bg-white border-r border-[#D7CCC8] h-screen sticky top-0 flex-col justify-between hidden md:flex font-sans shadow-xl shadow-[#5D4037]/5">
      
      {/* --- 1. LOGO SECTION --- */}
      <div className="p-8 pb-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-[#5D4037] p-2.5 rounded-xl shadow-lg shadow-[#5D4037]/20">
            <Coffee className="w-7 h-7 text-[#FFCA28]" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-black text-[#5D4037] tracking-tight leading-none">BREWTECH</h1>
            <p className="text-[10px] uppercase font-bold text-[#8D6E63] tracking-widest mt-0.5">Mentor Panel</p>
          </div>
        </div>

        {/* User Profile Mini */}
        <div className="bg-[#FFF8E1] p-4 rounded-2xl border border-[#FFE0B2] flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#5D4037] text-[#FFCA28] flex items-center justify-center font-black text-sm">
                {auth?.user?.name?.charAt(0) || 'P'}
            </div>
            <div className="overflow-hidden">
                <p className="text-sm font-black text-[#5D4037] truncate">{auth?.user?.name || 'Pengajar'}</p>
                <p className="text-xs text-[#8D6E63] font-medium truncate">{auth?.user?.email}</p>
            </div>
        </div>
      </div>

      {/* --- 2. MENU SECTION --- */}
      <div className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Menu Utama</p>
        
        {menus.map((menu, index) => {
            const active = isActive(menu.href);
            return (
                <Link
                    key={index}
                    href={menu.href}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                        active 
                        ? 'bg-[#5D4037] text-[#FFCA28] shadow-md shadow-[#5D4037]/20 translate-x-1' 
                        : 'text-gray-500 hover:bg-[#EFEBE9] hover:text-[#5D4037]'
                    }`}
                >
                    <menu.icon size={20} strokeWidth={active ? 3 : 2} className={`transition-transform group-hover:scale-110 ${active ? 'text-[#FFCA28]' : 'text-gray-400 group-hover:text-[#5D4037]'}`} />
                    <span className="font-bold text-sm">{menu.label}</span>
                    {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#FFCA28]" />}
                </Link>
            );
        })}
        
        <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mt-8 mb-2">Lainnya</p>
        <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-gray-500 hover:bg-[#EFEBE9] hover:text-[#5D4037] transition-all font-bold text-sm group">
            <Settings size={20} className="text-gray-400 group-hover:text-[#5D4037] transition-transform group-hover:rotate-90" />
            <span>Pengaturan</span>
        </button>
      </div>

      {/* --- 3. LOGOUT SECTION --- */}
      <div className="p-4 border-t border-[#EFEBE9]">
        <button 
            onClick={() => router.post('/logout')}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-red-50 text-red-500 font-black hover:bg-red-100 hover:shadow-inner transition-all border border-red-100"
        >
            <LogOut size={18} strokeWidth={2.5} />
            <span>Keluar Sesi</span>
        </button>
      </div>

    </aside>
  );
}