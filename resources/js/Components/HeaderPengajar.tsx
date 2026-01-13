import { useState } from "react";
import { usePage, Link } from "@inertiajs/react"; 
import { 
    Search, Bell, Menu, 
    LayoutDashboard, BookOpen, Layers, Users, 
    BarChart3, Settings, LogOut, Coffee 
} from "lucide-react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { 
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from "@/Components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/Components/ui/sheet"; 
import { cn } from "@/lib/utils"; 

// ✅ INI KUNCINYA: Memberitahu TypeScript bahwa fungsi 'route' itu ada secara global
// Jangan gunakan 'function route() {...}' karena itu akan menimpa fungsi aslinya.
declare var route: any;

interface HeaderPengajarProps {
    onSearch?: (query: string) => void;
}

export default function HeaderPengajar({ onSearch }: HeaderPengajarProps) {
    const { url } = usePage(); 
    const { auth } = usePage().props as any;
    
    const user = auth.user;

    const navItems = [
        { name: 'Dashboard', href: '/pengajar/dashboard', icon: LayoutDashboard },
        { name: 'Manajemen Kelas', href: '/pengajar/kelas', icon: BookOpen },
        { name: 'Bank Modul', href: '/pengajar/modul', icon: Layers },
        { name: 'Data Siswa', href: '/pengajar/siswa', icon: Users },
        { name: 'Analisis SPK', href: '/pengajar/analisis', icon: BarChart3 },
        { name: 'Pengaturan', href: '/pengajar/pengaturan', icon: Settings },
    ];

    return (
        <header className="h-20 border-b-2 border-border px-6 flex items-center justify-between bg-card/50 backdrop-blur-md sticky top-0 z-40">
            
            <div className="flex items-center gap-4 flex-1">
                {/* Mobile Menu */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground hover:text-primary">
                            <Menu size={24} />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-72 p-6 bg-card border-r-2 border-border">
                        <div className="flex items-center gap-3 mb-8 px-2">
                            <div className="p-2.5 bg-primary rounded-xl shadow-lg shadow-orange-500/20 -rotate-3">
                                <Coffee className="text-primary-foreground h-6 w-6" strokeWidth={3} />
                            </div>
                            <div>
                                <h1 className="text-xl font-black text-foreground tracking-tight leading-none">
                                    BREW<span className="text-primary">TECH</span>
                                </h1>
                            </div>
                        </div>

                        <nav className="space-y-2">
                            {navItems.map((item) => {
                                const isActive = url.startsWith(item.href);
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold",
                                            isActive 
                                                ? "bg-primary text-primary-foreground shadow-md shadow-orange-500/20" 
                                                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                        )}
                                    >
                                        <Icon size={20} strokeWidth={2.5} />
                                        {item.name}
                                    </Link>
                                );
                            })}
                            
                            <div className="pt-6 mt-6 border-t-2 border-border">
                                <Link
                                    // ✅ Sekarang ini aman karena kita pakai declare var route
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-destructive font-bold hover:bg-destructive/10"
                                >
                                    <LogOut size={20} strokeWidth={2.5} />
                                    Keluar Sesi
                                </Link>
                            </div>
                        </nav>
                    </SheetContent>
                </Sheet>

                {/* Search Bar */}
                <div className="relative w-full max-w-md hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                        placeholder="Cari data..." 
                        className="pl-10 rounded-full bg-muted/30 border-transparent hover:bg-muted/50 focus:bg-background focus:border-primary transition-all"
                        onChange={(e) => onSearch && onSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Profile Section */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary rounded-full">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2.5 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
                </Button>

                <div className="h-8 w-[2px] bg-border hidden sm:block"></div>

                <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Selamat Siang 👋</p>
                    <p className="text-sm font-black text-foreground">{user?.name}</p>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-12 w-12 rounded-full border-2 border-primary/20 p-1 hover:bg-primary/5 transition-all">
                            <Avatar className="h-full w-full">
                                <AvatarImage src={`https://ui-avatars.com/api/?name=${user?.name}&background=ff9800&color=fff&bold=true`} />
                                <AvatarFallback>AD</AvatarFallback>
                            </Avatar>
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 rounded-2xl border-2 border-border p-2" align="end">
                        <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="rounded-xl cursor-pointer font-medium">Profile</DropdownMenuItem>
                        <DropdownMenuItem className="rounded-xl cursor-pointer font-medium">Settings</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="rounded-xl cursor-pointer font-medium text-red-600 focus:text-red-600 focus:bg-red-50">
                            <Link href={route('logout')} method="post" as="button" className="w-full text-left">
                                Log out
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}