import { Link, usePage } from "@inertiajs/react";
import { 
    LayoutDashboard, 
    User, 
    Award, 
    Map, 
    LogOut, 
    Coffee 
} from "lucide-react";

import { cn } from "@/lib/utils"; 

// Mendeklarasikan route agar tidak merah
declare function route(name: string): string;

export default function SidebarPeserta() {
    const { url } = usePage();

    // ✅ MENU KHUSUS PESERTA
    const navItems = [
        { name: 'Dashboard', href: '/peserta/dashboard', icon: LayoutDashboard },
        { name: 'Profil Saya', href: '/peserta/profil', icon: User },
        { name: 'Nilai & SPK', href: '/peserta/nilai-spk', icon: Award },
        { name: 'Alur Belajar', href: '/peserta/workshop-flow', icon: Map },
    ];

    return (
        <aside className="hidden md:flex flex-col w-72 bg-card border-r-2 border-border h-screen sticky top-0 p-6 shadow-sm z-50">
            {/* Logo Section */}
            <div className="flex items-center gap-3 px-2 mb-10">
                <div className="p-2.5 bg-primary rounded-xl shadow-lg shadow-orange-500/20 rotate-3">
                    <Coffee className="text-primary-foreground h-7 w-7" strokeWidth={3} />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-foreground tracking-tight leading-none">
                        BREW<span className="text-primary">TECH</span>
                    </h1>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                        Student Panel {/* ✅ Ganti jadi Student Panel */}
                    </p>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 space-y-2">
                {navItems.map((item) => {
                    const isActive = url.startsWith(item.href);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 font-bold group relative overflow-hidden",
                                isActive 
                                    ? "bg-primary text-primary-foreground shadow-md shadow-orange-500/20 translate-x-1" 
                                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:translate-x-1"
                            )}
                        >
                            <Icon 
                                size={22} 
                                strokeWidth={2.5}
                                className={cn(
                                    "transition-colors",
                                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
                                )}
                            />
                            <span className="relative z-10">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout Section */}
            <div className="mt-auto pt-6 border-t-2 border-border">
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="flex items-center gap-3 px-4 py-3.5 w-full rounded-2xl text-destructive font-bold hover:bg-destructive/10 transition-colors group"
                >
                    <LogOut size={22} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform"/>
                    Keluar Sesi
                </Link>
            </div>
        </aside>
    );
}