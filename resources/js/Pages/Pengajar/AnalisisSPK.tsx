import { useState, useMemo } from 'react';
import SidebarPengajar from '@/Components/SidebarPengajar';
import HeaderPengajar from '@/Components/HeaderPengajar';
import { Head } from '@inertiajs/react';
import { 
    CheckCircle2, XCircle, Search, Activity, 
    TrendingUp, Award, BookOpen, BarChart3, Users, BrainCircuit, Eye 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Input } from '@/Components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Progress } from "@/Components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";

// Import Recharts
import { 
    AreaChart, Area, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
    ResponsiveContainer, Legend 
} from 'recharts';

export default function AnalisisSPK({ auth, students, classStats = [] }: { auth: any, students: any[], classStats: any[] }) {
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");
    
    // State untuk Filter Grafik
    const [selectedClassGraph, setSelectedClassGraph] = useState<string>("all");
    const [selectedStudentGraph, setSelectedStudentGraph] = useState<string>("");

    // --- 1. DATA PROCESSING UNTUK GRAFIK KELAS (Bar Chart) ---
    const classPerformanceData = useMemo(() => {
        const targetStudents = selectedClassGraph === "all" 
            ? students 
            : students.filter(s => s.kelas === selectedClassGraph);

        if (targetStudents.length === 0) return [];

        // Ambil daftar unik modul berdasarkan urutan kemunculan di data pertama
        const firstStudent = targetStudents[0];
        if(!firstStudent || !firstStudent.details) return [];

        const modules = firstStudent.details.map((d: any) => d.module_name);

        return modules.map((modName: string, index: number) => {
            // Hitung rata-rata nilai post-test (visual) untuk modul ini
            const scores = targetStudents
                .map(s => s.details.find((d: any) => d.module_name === modName)?.visual || 0)
                .filter(score => score > 0); 
            
            const avg = scores.length > 0 ? Math.round(scores.reduce((a: any, b: any) => a + b, 0) / scores.length) : 0;
            
            return { 
                name: `Modul ${index + 1}`,
                realName: modName, 
                nilai: avg 
            };
        });
    }, [selectedClassGraph, students]);

    // --- 2. DATA PROCESSING UNTUK GRAFIK INDIVIDU (Area Chart) ---
    const studentProgressData = useMemo(() => {
        if (!selectedStudentGraph) return [];
        const student = students.find(s => s.id.toString() === selectedStudentGraph);
        if (!student) return [];

        return student.details.map((d: any, index: number) => ({
            name: `Modul ${index + 1}`,
            realName: d.module_name,
            pre: d.pre_test_score || 0, 
            post: d.visual 
        }));
    }, [selectedStudentGraph, students]);

    // Filter Tabel Utama
    const filteredStudents = students.filter(s => 
        s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.kelas.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Statistik Global
    const siapPkl = students.filter(s => s.status === 'Siap PKL').length;
    const butuhPantau = students.filter(s => s.status === 'Butuh Pendampingan').length;
    const remedial = students.filter(s => s.status === 'Perlu Pelatihan Ulang').length;

    // List Kelas Unik
    const uniqueClasses = Array.from(new Set(students.map(s => s.kelas)));

    // Custom Tooltip Recharts
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-slate-100 shadow-xl rounded-xl text-xs">
                    <p className="font-bold text-slate-700 mb-2">{label}</p>
                    <p className="text-[10px] text-slate-400 mb-2 uppercase tracking-wider">
                        {payload[0].payload.realName}
                    </p>
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                            <span className="font-medium text-slate-600">
                                {entry.name}: <span className="font-bold text-slate-800">{entry.value}</span>
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="flex min-h-screen bg-background font-sans text-foreground">
            <Head title="Analisis SPK & Performa Kelas" />
            <div className="hidden md:block"><SidebarPengajar /></div>
            
            <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#FAFAF9]">
                <HeaderPengajar />
                
                <div className="flex-1 overflow-y-auto p-6 md:p-10">
                    <div className="max-w-7xl mx-auto space-y-8 pb-20">

                        {/* HEADER */}
                        <div>
                            <h1 className="text-4xl font-black text-foreground mb-2 tracking-tight">Analisis Kompetensi 📊</h1>
                            <p className="text-muted-foreground text-lg">Pantau performa kelas dan progres individu secara mendalam.</p>
                        </div>

                        {/* STATS CARDS */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard title="SIAP TERJUN PKL" count={siapPkl} icon={<CheckCircle2 size={32} />} theme="green" desc="Siswa kompeten & mandiri" />
                            <StatCard title="BUTUH PENGAWASAN" count={butuhPantau} icon={<Activity size={32} />} theme="purple" desc="Perlu mentoring intensif" />
                            <StatCard title="BELUM KOMPETEN" count={remedial} icon={<XCircle size={32} />} theme="orange" desc="Wajib remedial modul" />
                        </div>

                        {/* --- GRAFIK ANALISIS --- */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            
                            {/* 1. GRAFIK RATA-RATA KELAS */}
                            <Card className="rounded-[2rem] border-2 border-border/60 shadow-sm bg-white overflow-hidden">
                                <CardHeader className="pb-2 border-b border-dashed">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><BarChart3 size={24} /></div>
                                            <div>
                                                <CardTitle className="text-lg font-black">Rata-Rata Kelas</CardTitle>
                                                <p className="text-xs font-bold text-muted-foreground">Nilai Post-Test (Modul 1 s.d. Selesai)</p>
                                            </div>
                                        </div>
                                        <Select value={selectedClassGraph} onValueChange={setSelectedClassGraph}>
                                            <SelectTrigger className="w-[160px] h-10 rounded-xl font-bold bg-slate-50 border-slate-200">
                                                <SelectValue placeholder="Pilih Kelas" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="all">Semua Kelas</SelectItem>
                                                {uniqueClasses.map((cls:any) => (
                                                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="h-[300px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={classPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                <CartesianGrid vertical={false} stroke="#f1f5f9" strokeDasharray="3 3" />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} dy={10} />
                                                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
                                                <RechartsTooltip content={<CustomTooltip />} cursor={{fill: '#f8fafc'}} />
                                                <Bar dataKey="nilai" name="Rata-rata Kelas" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* 2. GRAFIK PROGRES INDIVIDU */}
                            <Card className="rounded-[2rem] border-2 border-border/60 shadow-sm bg-white overflow-hidden">
                                <CardHeader className="pb-2 border-b border-dashed">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><TrendingUp size={24} /></div>
                                            <div>
                                                <CardTitle className="text-lg font-black">Progres Siswa</CardTitle>
                                                <p className="text-xs font-bold text-muted-foreground">Pre-Test vs Post-Test (Per Modul)</p>
                                            </div>
                                        </div>
                                        <Select value={selectedStudentGraph} onValueChange={setSelectedStudentGraph}>
                                            <SelectTrigger className="w-[200px] h-10 rounded-xl font-bold bg-slate-50 border-slate-200">
                                                <SelectValue placeholder="Pilih Siswa..." />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl max-h-[200px]">
                                                {students.map((s) => (
                                                    <SelectItem key={s.id} value={s.id.toString()}>{s.nama}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    {selectedStudentGraph ? (
                                        <div className="h-[300px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={studentProgressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                    <defs>
                                                        <linearGradient id="colorPost" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                                                            <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid vertical={false} stroke="#f1f5f9" strokeDasharray="3 3" />
                                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} dy={10} />
                                                    <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
                                                    <RechartsTooltip content={<CustomTooltip />} />
                                                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }}/>
                                                    <Area type="monotone" dataKey="post" name="Post-Test" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorPost)" />
                                                    <Area type="monotone" dataKey="pre" name="Pre-Test" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" fillOpacity={0} />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    ) : (
                                        <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground opacity-50">
                                            <Users size={48} className="mb-2"/>
                                            <p className="font-bold">Pilih siswa untuk melihat grafik</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                        </div>

                        {/* TABEL DATA SISWA */}
                        <Card className="rounded-[2rem] border-2 border-border/60 shadow-sm overflow-hidden bg-white">
                            <div className="p-8 border-b border-border/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-muted/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-white border border-border flex items-center justify-center text-primary shadow-sm">
                                        <BrainCircuit size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-foreground">Detail Data Siswa</h2>
                                        <p className="text-sm text-muted-foreground font-medium">Klik baris untuk detail lengkap.</p>
                                    </div>
                                </div>
                                <div className="relative w-full md:w-72">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                    <Input 
                                        placeholder="Cari nama siswa..." 
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
                                            <TableHead className="text-center font-bold text-muted-foreground uppercase text-xs tracking-wider">Modul Selesai</TableHead>
                                            <TableHead className="font-bold text-muted-foreground uppercase text-xs tracking-wider w-[250px]">Rata-Rata Nilai</TableHead>
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
                                                        {student.module_count} Modul
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                                                            <span className="w-8">Hard</span>
                                                            <Progress value={student.avg_visual} className="h-1.5 bg-muted/50" indicatorClassName="bg-blue-400" />
                                                            <span className="w-6 text-right">{student.avg_visual}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                                                            <span className="w-8">Soft</span>
                                                            <Progress value={student.avg_softskill} className="h-1.5 bg-muted/50" indicatorClassName="bg-purple-400" />
                                                            <span className="w-6 text-right">{student.avg_softskill}</span>
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

                        {/* MODAL DETAIL */}
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
                                                            <DialogTitle className="text-2xl font-black text-foreground mb-1">{selectedStudent.nama}</DialogTitle>
                                                            <div className="flex gap-2">
                                                                <Badge variant="outline" className="rounded-md bg-muted/50 text-muted-foreground border-transparent">{selectedStudent.kelas}</Badge>
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
                                                            <span className="text-slate-400">Pre: {modul.pre_test_score || 0}</span>
                                                            <span className="text-blue-600">Post: {modul.visual}</span>
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

                    </div>
                </div>
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