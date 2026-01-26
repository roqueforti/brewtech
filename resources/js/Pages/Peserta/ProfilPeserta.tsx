import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
    Mail, ArrowLeft, Award, TrendingUp, BookOpen, 
    CheckCircle2, Circle, BarChart3, Menu, PlayCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Progress } from "@/Components/ui/progress";
import { Button } from "@/Components/ui/button";

// --- IMPORT SIDEBAR ---
// Sesuaikan path ini dengan lokasi file SidebarPeserta.tsx Anda
import SidebarPeserta from '@/Components/SidebarPeserta'; 

// --- TYPES ---
interface ProgressItem {
    title: string;
    progress_percent: number;
    status: string;
    score_pre: string | number;
    score_post: string | number;
    score_soft: string | number;
}

interface Props {
    auth: { user: any };
    stats?: { completed_workshops: number; total_workshops: number; active_workshops?: number };
    progress_list?: ProgressItem[];
}

export default function ProfilPeserta({ auth, stats, progress_list }: Props) {
    // State untuk Mobile Menu
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const safeList = progress_list || [];
    const safeStats = { 
        completed_workshops: stats?.completed_workshops || 0, 
        total_workshops: stats?.total_workshops || 0,
        active_workshops: stats?.active_workshops || 0 
    };
    
    // Hitung rata-rata
    const validScores = safeList.filter(item => typeof item.score_post === 'number');
    const avgScore = validScores.length > 0 
        ? Math.round(validScores.reduce((a, b) => a + (b.score_post as number), 0) / validScores.length) 
        : 0;

    // Data untuk Grafik
    const chartData = safeList.filter(item => typeof item.score_post === 'number').slice(0, 10);

    return (
        <div className="flex h-screen bg-background font-sans text-foreground selection:bg-primary/20 overflow-hidden">
            <Head title="Profil Siswa" />

            {/* --- 1. SIDEBAR (DESKTOP) --- */}
            <div className="hidden lg:block w-72 shrink-0 h-full border-r border-border bg-white">
                <SidebarPeserta auth={auth} />
            </div>

            {/* --- 2. SIDEBAR (MOBILE OVERLAY) --- */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div 
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-2xl animate-in slide-in-from-left duration-300">
                        <SidebarPeserta auth={auth} />
                    </div>
                </div>
            )}

            {/* --- 3. KONTEN UTAMA --- */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                
                {/* Header Mobile (Hanya muncul di layar kecil) */}
                <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-border sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
                            <Menu className="h-6 w-6" />
                        </Button>
                        <h1 className="font-bold text-lg">Profil Saya</h1>
                    </div>
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {auth.user.name.charAt(0)}
                    </div>
                </div>

                {/* Scrollable Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 scroll-smooth">
                    <div className="max-w-7xl mx-auto w-full">
                        
                        {/* Header Halaman (Desktop) */}
                        <div className="hidden lg:flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-2xl font-black text-foreground">Profil Saya</h1>
                                <p className="text-muted-foreground font-medium">Kelola informasi dan pantau statistik belajar.</p>
                            </div>
                            <Badge variant="outline" className="px-4 py-1.5 rounded-full border-border bg-white text-muted-foreground font-medium shadow-sm">
                                Tahun Ajaran 2025/2026
                            </Badge>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 pb-20">
                            
                            {/* KIRI: PROFIL & SPK (4 Kolom) */}
                            <div className="xl:col-span-4 space-y-6">
                                {/* KARTU PROFIL UTAMA */}
                                <Card className="rounded-[2rem] border-2 border-border bg-white shadow-sm overflow-hidden group hover:border-primary/30 transition-all duration-300 relative">
                                    <div className="h-32 bg-[#FFF3E0] relative overflow-hidden">
                                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-orange-200 rounded-full blur-3xl opacity-50"></div>
                                        <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-yellow-200 rounded-full blur-3xl opacity-50"></div>
                                    </div>
                                    
                                    <div className="px-8 pb-8 relative text-center">
                                        <div className="-mt-16 mb-4 inline-block relative">
                                            <div className="w-32 h-32 rounded-full bg-white p-1.5 shadow-xl ring-4 ring-[#FFF8E1]">
                                                <div className="w-full h-full rounded-full bg-orange-50 flex items-center justify-center text-5xl font-black text-primary border-2 border-orange-100 select-none">
                                                    {auth.user.name.charAt(0).toUpperCase()}
                                                </div>
                                            </div>
                                            <div className={`absolute bottom-2 right-2 w-7 h-7 rounded-full border-4 border-white ${auth.user.status_pkl === 'siap' ? 'bg-green-500' : 'bg-orange-400'} shadow-sm`}></div>
                                        </div>

                                        <h2 className="text-2xl font-black text-foreground mb-1 tracking-tight">{auth.user.name}</h2>
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-muted rounded-full text-xs font-bold text-muted-foreground mb-6">
                                            <Mail size={12}/> {auth.user.email}
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-muted/30 p-3 rounded-2xl border border-border/60">
                                                <div className="text-[10px] text-muted-foreground uppercase font-black tracking-wider mb-1">Kelas</div>
                                                <div className="text-sm font-bold text-foreground truncate">
                                                    {auth.user.kelas?.nama || '-'}
                                                </div>
                                            </div>
                                            <div className="bg-muted/30 p-3 rounded-2xl border border-border/60">
                                                <div className="text-[10px] text-muted-foreground uppercase font-black tracking-wider mb-1">Status PKL</div>
                                                <div className={`text-sm font-bold truncate ${auth.user.status_pkl === 'siap' ? 'text-green-600' : 'text-orange-500'}`}>
                                                    {auth.user.status_pkl === 'siap' ? 'Siap' : 'Belum'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                {/* NAVIGASI SPK */}
                                <Link href="/peserta/nilai-spk">
                                    <div className="rounded-[2rem] p-1 bg-gradient-to-br from-orange-400 to-yellow-400 shadow-lg shadow-orange-200 hover:shadow-orange-300 transition-all cursor-pointer group hover:scale-[1.02] duration-300">
                                        <div className="bg-white rounded-[1.8rem] p-6 flex items-center gap-5 relative overflow-hidden h-full">
                                            <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-orange-50 to-transparent opacity-50"></div>
                                            
                                            <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                                                <Award size={28} strokeWidth={2.5}/>
                                            </div>
                                            <div className="relative z-10">
                                                <h3 className="font-bold text-foreground text-lg group-hover:text-orange-600 transition-colors">Rapor Kompetensi</h3>
                                                <p className="text-sm text-muted-foreground font-medium">Lihat rekomendasi karirmu.</p>
                                            </div>
                                            <div className="ml-auto text-orange-300 group-hover:text-orange-500 transition-colors">
                                                <ArrowLeft className="rotate-180" size={24}/>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>

                            {/* KANAN: STATISTIK & HISTORY (8 Kolom) */}
                            <div className="xl:col-span-8 space-y-8">
                                
                                {/* 1. STATISTIK UTAMA */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {[
                                        { label: 'Modul Selesai', val: safeStats.completed_workshops, sub: `/ ${safeStats.total_workshops}`, icon: <CheckCircle2 size={24}/>, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
                                        { label: 'Sedang Dipelajari', val: safeStats.active_workshops, sub: '', icon: <PlayCircle size={24}/>, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
                                        { label: 'Rata-rata Nilai', val: avgScore, sub: '', icon: <TrendingUp size={24}/>, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
                                    ].map((stat, i) => (
                                        <Card key={i} className="rounded-[2rem] border-2 border-border bg-white shadow-sm p-6 flex flex-col justify-between hover:border-primary/20 transition-colors">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className={`p-3 ${stat.bg} ${stat.color} rounded-2xl border ${stat.border}`}>
                                                    {stat.icon}
                                                </div>
                                            </div>
                                            <div>
                                                <div className={`text-3xl font-black text-foreground`}>
                                                    {stat.val}
                                                    {stat.sub && <span className="text-lg text-muted-foreground/40 font-bold ml-1">{stat.sub}</span>}
                                                </div>
                                                <div className="text-sm font-bold text-muted-foreground mt-1">{stat.label}</div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>

                                {/* 2. GRAFIK NILAI */}
                                <Card className="rounded-[2.5rem] border-2 border-border shadow-sm bg-white overflow-hidden">
                                    <CardHeader className="border-b border-border px-8 py-6 flex flex-row items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-muted rounded-xl text-muted-foreground"><BarChart3 size={20}/></div>
                                            <div>
                                                <CardTitle className="text-lg font-bold text-foreground">Grafik Nilai</CardTitle>
                                                <p className="text-xs text-muted-foreground font-medium">Pre-Test vs Post-Test</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 text-xs font-bold">
                                            <div className="flex items-center gap-2 text-muted-foreground"><div className="w-2.5 h-2.5 rounded-full bg-border"></div> Pre</div>
                                            <div className="flex items-center gap-2 text-primary"><div className="w-2.5 h-2.5 rounded-full bg-primary"></div> Post</div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="px-8 py-8">
                                        {chartData.length > 0 ? (
                                            <div className="flex items-end justify-between gap-4 h-48 w-full">
                                                {chartData.map((item, idx) => {
                                                    const pre = Number(item.score_pre) || 0;
                                                    const post = Number(item.score_post) || 0;
                                                    return (
                                                        <div key={idx} className="flex-1 flex flex-col justify-end items-center gap-3 group">
                                                            <div className="w-full flex items-end justify-center gap-1.5 h-full max-w-[40px]">
                                                                <div className="w-1/2 bg-border rounded-t-sm transition-all group-hover:bg-muted-foreground/40" style={{ height: `${pre}%` }}></div>
                                                                <div className="w-1/2 bg-primary rounded-t-sm transition-all group-hover:bg-primary/80 shadow-[0_0_10px_rgba(255,152,0,0.2)]" style={{ height: `${post}%` }}></div>
                                                            </div>
                                                            <span className="text-[10px] font-bold text-muted-foreground/60">M{idx+1}</span>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        ) : (
                                            <div className="h-48 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-3xl bg-muted/10">
                                                <BarChart3 className="mb-2 opacity-30" size={32}/>
                                                <p className="text-sm font-medium">Belum ada data grafik.</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* 3. LIST RIWAYAT */}
                                <div>
                                    <h3 className="text-lg font-bold text-foreground mb-5 px-1 flex items-center gap-2">
                                        <BookOpen className="text-primary" size={20}/> Riwayat Detail
                                    </h3>
                                    <div className="space-y-4">
                                        {safeList.length > 0 ? (
                                            safeList.map((item, index) => {
                                                const isDone = item.status === 'Selesai';
                                                return (
                                                    <div key={index} className="group bg-white p-5 rounded-[1.5rem] border-2 border-border hover:border-primary/30 transition-all flex flex-col sm:flex-row items-center gap-5">
                                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-2 ${isDone ? 'bg-green-50 border-green-200 text-green-600' : 'bg-muted border-border text-muted-foreground'}`}>
                                                            {isDone ? <CheckCircle2 size={20}/> : <Circle size={20}/>}
                                                        </div>
                                                        <div className="flex-1 text-center sm:text-left w-full">
                                                            <h4 className="font-bold text-foreground text-base line-clamp-1 group-hover:text-primary transition-colors">{item.title}</h4>
                                                            <div className="flex items-center justify-center sm:justify-start gap-3 mt-2">
                                                                <Progress value={item.progress_percent} className="h-1.5 w-24 bg-muted border border-border" indicatorClassName="bg-primary" />
                                                                <span className="text-[10px] font-bold text-muted-foreground">{item.progress_percent}%</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-3 shrink-0">
                                                            <div className="flex flex-col items-center justify-center w-16 h-14 bg-muted/30 rounded-xl border border-border/50">
                                                                <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Pre</span>
                                                                <span className="text-sm font-black text-foreground">{item.score_pre}</span>
                                                            </div>
                                                            <div className="flex flex-col items-center justify-center w-16 h-14 bg-primary/5 rounded-xl border border-primary/10 group-hover:bg-primary/10 transition-colors">
                                                                <span className="text-[9px] text-primary uppercase font-bold tracking-wider">Post</span>
                                                                <span className="text-sm font-black text-primary">{item.score_post}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="p-10 text-center bg-muted/5 rounded-[2rem] border-2 border-dashed border-border text-muted-foreground text-sm">
                                                Belum ada modul yang dikerjakan.
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}