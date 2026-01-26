import { useState } from 'react';
import SidebarPengajar from '@/Components/SidebarPengajar';
import HeaderPengajar from '@/Components/HeaderPengajar';
import { Head } from '@inertiajs/react';
import { 
    CheckCircle2, XCircle, Search, Filter, Eye, BrainCircuit, Activity, 
    TrendingUp, Users, Award, BookOpen, BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Input } from '@/Components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Progress } from "@/Components/ui/progress";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/Components/ui/dialog"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/Components/ui/table"
// [BARU] Import Recharts untuk grafik
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
    ResponsiveContainer, Legend 
} from 'recharts';

export default function AnalisisSPK({ auth, students, classStats = [] }: { auth: any, students: any[], classStats: any[] }) {
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // [BARU] Dummy Data untuk Grafik Tren (Bisa diganti dengan props dari backend nantinya)
    const trendData = [
        { bulan: 'Jan', hard: 65, soft: 70 },
        { bulan: 'Feb', hard: 68, soft: 72 },
        { bulan: 'Mar', hard: 75, soft: 74 },
        { bulan: 'Apr', hard: 72, soft: 76 },
        { bulan: 'Mei', hard: 82, soft: 80 },
        { bulan: 'Jun', hard: 88, soft: 85 },
    ];

    // Filter Search
    const filteredStudents = students.filter(s => 
        s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.kelas.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Hitung Statistik Global
    const siapPkl = students.filter(s => s.status === 'Siap PKL').length;
    const butuhPantau = students.filter(s => s.status === 'Butuh Pendampingan').length;
    const remedial = students.filter(s => s.status === 'Perlu Pelatihan Ulang').length;

    return (
        <div className="flex min-h-screen bg-background font-sans text-foreground">
            <Head title="Analisis SPK & Performa Kelas" />
            <div className="hidden md:block"><SidebarPengajar /></div>
            
            <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#FAFAF9]">
                <HeaderPengajar />
                
                <div className="flex-1 overflow-y-auto p-6 md:p-10">
                    <div className="max-w-7xl mx-auto space-y-8 pb-20">

                        {/* 1. HEADER & GLOBAL STATS */}
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-4xl font-black text-foreground mb-2 tracking-tight">Analisis Kompetensi 📊</h1>
                                <p className="text-muted-foreground text-lg">Pantau performa kelas dan kesiapan siswa secara real-time.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <StatCard title="SIAP TERJUN PKL" count={siapPkl} icon={<CheckCircle2 size={32} />} theme="green" desc="Siswa kompeten & mandiri" />
                                <StatCard title="BUTUH PENGAWASAN" count={butuhPantau} icon={<Activity size={32} />} theme="purple" desc="Perlu mentoring intensif" />
                                <StatCard title="BELUM KOMPETEN" count={remedial} icon={<XCircle size={32} />} theme="orange" desc="Wajib remedial modul" />
                            </div>
                        </div>

                        {/* [BARU] 2. GRAFIK UTAMA: TREN PENINGKATAN SKILL */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Grafik Area Chart */}
                            <Card className="lg:col-span-2 rounded-[2rem] border-2 border-border/60 shadow-sm bg-white overflow-hidden">
                                <CardHeader className="pb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                                            <TrendingUp size={24} />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-black">Tren Peningkatan Kompetensi</CardTitle>
                                            <p className="text-sm font-medium text-muted-foreground">Progres rata-rata Hard Skill vs Soft Skill (Semester Ini)</p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4 pl-0">
                                    <div className="h-[300px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="colorHard" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                                    </linearGradient>
                                                    <linearGradient id="colorSoft" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                                                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <XAxis 
                                                    dataKey="bulan" 
                                                    axisLine={false} 
                                                    tickLine={false} 
                                                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 'bold' }} 
                                                    dy={10}
                                                />
                                                <YAxis 
                                                    axisLine={false} 
                                                    tickLine={false} 
                                                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 'bold' }} 
                                                />
                                                <CartesianGrid vertical={false} stroke="#f1f5f9" strokeDasharray="3 3" />
                                                <RechartsTooltip 
                                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                                    itemStyle={{ fontWeight: 'bold', fontSize: '12px' }}
                                                />
                                                <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                                                <Area 
                                                    type="monotone" 
                                                    dataKey="hard" 
                                                    name="Hard Skill (Visual)" 
                                                    stroke="#3b82f6" 
                                                    strokeWidth={3} 
                                                    fillOpacity={1} 
                                                    fill="url(#colorHard)" 
                                                />
                                                <Area 
                                                    type="monotone" 
                                                    dataKey="soft" 
                                                    name="Soft Skill (Komunikasi)" 
                                                    stroke="#a855f7" 
                                                    strokeWidth={3} 
                                                    fillOpacity={1} 
                                                    fill="url(#colorSoft)" 
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Summary Card Samping (Optional) */}
                            <Card className="rounded-[2rem] border-2 border-border/60 shadow-sm bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col justify-center p-6">
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">
                                            <BarChart3 size={16} /> Total Peningkatan
                                        </div>
                                        <div className="text-4xl font-black text-white">+24%</div>
                                        <p className="text-sm text-slate-400 mt-1 leading-snug">
                                            Kenaikan performa keseluruhan kelas dibandingkan bulan lalu.
                                        </p>
                                    </div>
                                    <div className="space-y-3 pt-6 border-t border-slate-700/50">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-bold text-slate-300">Hard Skill Max</span>
                                            <span className="text-lg font-black text-blue-400">92/100</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-bold text-slate-300">Soft Skill Max</span>
                                            <span className="text-lg font-black text-purple-400">89/100</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* 3. ANALISIS PERFORMA KELAS */}
                        {classStats.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Award className="text-primary h-6 w-6" />
                                    <h2 className="text-2xl font-black text-foreground">Performa Rata-Rata Kelas</h2>
                                </div>
                                
                                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {classStats.map((kelas, idx) => (
                                        <Card key={idx} className="rounded-[2rem] border-2 border-border/60 shadow-sm hover:shadow-md transition-all bg-white group">
                                            <CardHeader className="pb-2">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <CardTitle className="text-xl font-black">{kelas.nama_kelas}</CardTitle>
                                                        <p className="text-sm font-bold text-muted-foreground flex items-center gap-1 mt-1">
                                                            <Users size={14}/> {kelas.total_siswa} Siswa Aktif
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-3xl font-black text-primary">{kelas.avg_score}</span>
                                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Rata-rata</p>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-3 mt-2">
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between text-xs font-bold text-muted-foreground">
                                                            <span>Hard Skill (Visual)</span>
                                                            <span>{kelas.avg_visual}</span>
                                                        </div>
                                                        <Progress value={kelas.avg_visual} className="h-2 bg-muted" indicatorClassName="bg-blue-500" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between text-xs font-bold text-muted-foreground">
                                                            <span>Soft Skill</span>
                                                            <span>{kelas.avg_soft}</span>
                                                        </div>
                                                        <Progress value={kelas.avg_soft} className="h-2 bg-muted" indicatorClassName="bg-purple-500" />
                                                    </div>
                                                </div>

                                                <div className="mt-6 pt-4 border-t border-dashed border-border flex justify-between items-center text-xs font-bold text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <Award size={14} className="text-orange-500" /> 
                                                        MVP: <span className="text-foreground">{kelas.best_student}</span>
                                                    </div>
                                                    <div className="bg-green-100 text-green-700 px-2 py-0.5 rounded-md">
                                                        {kelas.pass_rate}% Lulus
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 4. TABEL DETAIL SISWA */}
                        <Card className="rounded-[2.5rem] border-2 border-border/60 shadow-sm overflow-hidden bg-white">
                            <div className="p-8 border-b border-border/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-muted/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-white border border-border flex items-center justify-center text-primary shadow-sm">
                                        <BrainCircuit size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-foreground">Detail Individu Siswa</h2>
                                        <p className="text-sm text-muted-foreground font-medium">Klik baris untuk melihat detail modul.</p>
                                    </div>
                                </div>
                                <div className="relative w-full md:w-72">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                    <Input 
                                        placeholder="Cari siswa..." 
                                        className="pl-12 h-12 rounded-xl border-2 bg-white focus-visible:ring-primary"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-muted/20">
                                        <TableRow className="hover:bg-transparent border-border/60">
                                            <TableHead className="pl-8 py-5 font-bold text-muted-foreground uppercase text-xs tracking-wider">Siswa</TableHead>
                                            <TableHead className="text-center font-bold text-muted-foreground uppercase text-xs tracking-wider">Modul</TableHead>
                                            <TableHead className="font-bold text-muted-foreground uppercase text-xs tracking-wider w-[250px]">Kompetensi</TableHead>
                                            <TableHead className="text-center font-bold text-muted-foreground uppercase text-xs tracking-wider">Status</TableHead>
                                            <TableHead className="pr-8 text-right font-bold text-muted-foreground uppercase text-xs tracking-wider">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredStudents.map((student) => (
                                            <TableRow key={student.id} className="hover:bg-orange-50/50 transition-colors border-border/60 group cursor-pointer" onClick={() => setSelectedStudent(student)}>
                                                <TableCell className="pl-8 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                                            <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${student.nama}`} />
                                                            <AvatarFallback className="bg-orange-100 text-orange-700 font-bold">{student.nama.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{student.nama}</p>
                                                            <span className="text-[10px] font-bold text-muted-foreground">{student.kelas}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant="secondary" className="bg-muted/50 text-muted-foreground border-transparent">
                                                        {student.module_count} Selesai
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                                                            <span className="w-8">Soft</span>
                                                            <Progress value={student.avg_softskill} className="h-1.5 bg-muted/50" indicatorClassName="bg-purple-400" />
                                                            <span className="w-6 text-right">{student.avg_softskill}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                                                            <span className="w-8">Hard</span>
                                                            <Progress value={student.avg_visual} className="h-1.5 bg-muted/50" indicatorClassName="bg-blue-400" />
                                                            <span className="w-6 text-right">{student.avg_visual}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <StatusBadge status={student.status} color={student.badge_color} />
                                                </TableCell>
                                                <TableCell className="pr-8 text-right">
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-orange-50 rounded-lg">
                                                        <Eye size={16}/>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* MODAL DETAIL SISWA */}
                <Dialog open={!!selectedStudent} onOpenChange={(open) => !open && setSelectedStudent(null)}>
                    <DialogContent className="max-w-2xl rounded-[2.5rem] p-0 overflow-hidden border-0 shadow-2xl">
                        {selectedStudent && (
                            <div className="flex flex-col h-full bg-[#FAFAF9]">
                                <div className="bg-white p-8 pb-6 border-b border-border/50">
                                    <DialogHeader className="mb-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-4">
                                                <Avatar className="h-16 w-16 border-4 border-muted/30">
                                                    <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${selectedStudent.nama}`} />
                                                    <AvatarFallback>{selectedStudent.nama.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <DialogTitle className="text-2xl font-black text-foreground mb-1">
                                                        {selectedStudent.nama}
                                                    </DialogTitle>
                                                    <div className="flex gap-2">
                                                        <Badge variant="outline" className="rounded-md bg-muted/50 text-muted-foreground border-transparent">
                                                            {selectedStudent.kelas}
                                                        </Badge>
                                                        <StatusBadge status={selectedStudent.status} color={selectedStudent.badge_color} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right hidden sm:block">
                                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Skor Global</p>
                                                <p className="text-4xl font-black text-primary">{selectedStudent.global_score}</p>
                                            </div>
                                        </div>
                                    </DialogHeader>
                                    
                                    <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 text-sm text-orange-900 font-medium flex gap-3">
                                        <div className="bg-white p-1.5 rounded-lg shadow-sm shrink-0 h-fit text-xl">💡</div>
                                        <div>
                                            <p className="font-bold mb-0.5 text-orange-800">Rekomendasi Sistem:</p>
                                            <p className="opacity-90 leading-relaxed">{selectedStudent.rekomendasi}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 overflow-y-auto max-h-[50vh] space-y-4">
                                    <h4 className="font-bold text-muted-foreground uppercase text-xs tracking-wider flex items-center gap-2 mb-2">
                                        <BookOpen size={14}/> Riwayat Modul
                                    </h4>
                                    
                                    {selectedStudent.details.length > 0 ? selectedStudent.details.map((modul: any, idx: number) => (
                                        <div key={idx} className="bg-white p-4 rounded-[1.5rem] border border-border shadow-sm flex items-center justify-between">
                                            <div>
                                                <p className="font-bold text-foreground">{modul.module_name}</p>
                                                <div className="flex gap-3 text-xs font-bold text-muted-foreground mt-1">
                                                    <span className="text-blue-600">Vis: {modul.visual}</span>
                                                    <span className="text-purple-600">Soft: {modul.softskill}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-black text-foreground">{modul.total}</p>
                                                <span className={`text-[10px] font-bold uppercase ${modul.status === 'Kompeten' ? 'text-green-600' : 'text-yellow-600'}`}>
                                                    {modul.status}
                                                </span>
                                            </div>
                                        </div>
                                    )) : <p className="text-center text-muted-foreground py-8">Belum ada modul.</p>}
                                </div>
                                
                                <div className="p-6 bg-white border-t border-border flex justify-end">
                                    <Button onClick={() => setSelectedStudent(null)} className="h-10 px-6 rounded-xl font-bold">Tutup</Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    );
}

// --- COMPONENTS ---
function StatCard({ title, count, icon, theme, desc }: any) {
    const styles: any = {
        green: "bg-emerald-50 text-emerald-900 border-emerald-100",
        purple: "bg-violet-50 text-violet-900 border-violet-100",
        orange: "bg-amber-50 text-amber-900 border-amber-100",
    };
    return (
        <Card className={`rounded-[2rem] border-2 shadow-sm ${styles[theme]} transition-transform hover:-translate-y-1`}>
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-2xl bg-white/50">{icon}</div>
                    <span className="text-4xl font-black">{count}</span>
                </div>
                <div>
                    <h3 className="text-sm font-black uppercase tracking-wider opacity-80 mb-1">{title}</h3>
                    <p className="text-sm font-medium opacity-60">{desc}</p>
                </div>
            </CardContent>
        </Card>
    );
}

function StatusBadge({ status, color }: any) {
    const map: any = {
        'green': 'bg-emerald-100 text-emerald-700 border-emerald-200',
        'purple': 'bg-violet-100 text-violet-700 border-violet-200',
        'orange': 'bg-amber-100 text-amber-700 border-amber-200',
        'gray': 'bg-slate-100 text-slate-700 border-slate-200',
    };
    return <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold border ${map[color] || map.gray}`}>{status}</span>;
}