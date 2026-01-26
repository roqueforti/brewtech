import { Link, usePage } from "@inertiajs/react";
import { 
    LayoutDashboard, 
    BookOpen, 
    Users, 
    BarChart3, 
    Settings, 
    LogOut, 
    Coffee, 
    Book, // Icon untuk Bank Modul
    Layers 
} from "lucide-react";
import { cn } from "@/lib/utils"; 

// Deklarasi agar TypeScript tidak error saat panggil route()
declare function route(name: string): string;

export default function SidebarPengajar() {
    const { url } = usePage();

    // Definisi Menu Navigasi
    const navItems = [
        { 
            name: 'Dashboard', 
            href: '/pengajar/dashboard', 
            icon: LayoutDashboard 
        },
        { 
            name: 'Manajemen Kelas', 
            href: '/pengajar/kelas', 
            icon: Users // Saya ganti ke Users agar beda dengan modul
        },
        { 
            name: 'Bank Modul', 
            href: '/pengajar/modul', // ✅ Mengarah ke ModuleController
            icon: BookOpen 
        },
        { 
            name: 'Data Siswa', 
            href: '/pengajar/siswa', 
            icon: Layers 
        },
        { 
            name: 'Analisis SPK', 
            href: '/pengajar/analisis', 
            icon: BarChart3 
        },
        { 
            name: 'Pengaturan', 
            href: '/pengajar/pengaturan', 
            icon: Settings 
        },
    ];

    return (
        <aside className="hidden md:flex flex-col w-72 bg-white border-r-2 border-slate-200 h-screen sticky top-0 p-6 shadow-sm z-50">
            {/* --- Logo Section --- */}
            <div className="flex items-center gap-3 px-2 mb-10">
                <div className="p-2.5 bg-primary rounded-xl shadow-lg shadow-orange-500/20 rotate-3">
                    <Coffee className="text-white h-7 w-7" strokeWidth={3} />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                        BREW<span className="text-primary">TECH</span>
                    </h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        Mentor Panel
                    </p>
                </div>
            </div>

            {/* --- Navigation Menu --- */}
            <nav className="flex-1 space-y-2">
                {navItems.map((item) => {
                    // Cek apakah URL saat ini diawali dengan href menu (untuk handle sub-menu)
                    const isActive = url.startsWith(item.href);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 font-bold group relative overflow-hidden",
                                isActive 
                                    ? "bg-primary text-white shadow-lg shadow-orange-500/20 translate-x-1" 
                                    : "text-slate-400 hover:bg-slate-50 hover:text-slate-700 hover:translate-x-1"
                            )}
                        >
                            <Icon 
                                size={22} 
                                strokeWidth={2.5} 
                                className={cn(
                                    "transition-colors",
                                    isActive ? "text-white" : "text-slate-400 group-hover:text-primary"
                                )}
                            />
                            <span className="relative z-10">{item.name}</span>
                            
                            {/* Indikator aktif di sebelah kanan (opsional) */}
                            {isActive && (
                                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white/50" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* --- Logout Section --- */}
            <div className="mt-auto pt-6 border-t-2 border-slate-100">
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="flex items-center gap-3 px-4 py-3.5 w-full rounded-2xl text-red-500 font-bold hover:bg-red-50 transition-colors group"
                >
                    <LogOut size={22} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform"/>
                    Keluar Sesi
                </Link>
            </div>
        </aside>
    );
}