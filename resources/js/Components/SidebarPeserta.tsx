import { Link, usePage, router } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    User, 
    Award, 
    Map, 
    LogOut, 
    Coffee 
} from 'lucide-react';

export default function SidebarPeserta() {
    const { url } = usePage();
    const isActive = (path: string) => url.startsWith(path);

    // ✅ FIX: Menggunakan Hardcoded URL '/logout'
    // Ini lebih aman jika helper route() bermasalah/error
    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault(); // Mencegah behavior default
        console.log("Tombol logout diklik, memproses..."); // Cek console browser (F12) jika masih gagal
        
        router.post('/logout', {}, {
            onStart: () => console.log("Request logout dimulai..."),
            onFinish: () => console.log("Request selesai."),
        });
    };

    return (
        <aside className="w-64 bg-white h-full border-r border-slate-200 flex flex-col fixed left-0 top-0 z-50 shadow-sm">
            {/* 1. LOGO SECTION */}
            <div className="p-8 pb-4">
                <div className="flex items-center gap-3 text-cyan-600">
                    <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-200">
                       <Coffee size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="font-black text-xl tracking-tight text-slate-800 leading-none">BREWTECH</h1>
                        <p className="text-[10px] font-bold text-slate-400 tracking-widest mt-1">STUDENT PANEL</p>
                    </div>
                </div>
            </div>

            {/* 2. MENU NAVIGATION */}
            <nav className="flex-1 px-6 space-y-2 mt-6">
                <Link 
                    href="/peserta/dashboard" 
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all duration-200
                        ${isActive('/peserta/dashboard') 
                            ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-200 translate-x-1' 
                            : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                        }
                    `}
                >
                    <LayoutDashboard size={20} /> 
                    <span>Dashboard</span>
                </Link>

                <Link href="#" className="flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all">
                    <User size={20} /> <span>Profil Saya</span>
                </Link>
                <Link href="#" className="flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all">
                    <Award size={20} /> <span>Nilai & SPK</span>
                </Link>
                <Link href="#" className="flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all">
                    <Map size={20} /> <span>Alur Belajar</span>
                </Link>
            </nav>

            {/* 3. LOGOUT BUTTON (FIXED) */}
            <div className="p-6 border-t border-slate-100">
                <button 
                    type="button" // Pastikan type button agar tidak dianggap submit form sembarangan
                    onClick={handleLogout} 
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-red-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 group text-left focus:outline-none focus:ring-2 focus:ring-red-200"
                >
                    <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" /> 
                    <span>Keluar Sesi</span>
                </button>
            </div>
        </aside>
    );
}