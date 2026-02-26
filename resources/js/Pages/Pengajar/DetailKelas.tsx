import { useState, useEffect, useRef } from "react";
import { Head, Link, router, useForm } from "@inertiajs/react";
import SidebarPengajar from "@/Components/SidebarPengajar";
import HeaderPengajar from "@/Components/HeaderPengajar";
import { 
    ArrowLeft, Users, BookOpen, Plus, Trash2, 
    UserPlus, Calendar as CalendarIcon, User, CheckCircle, Clock, 
    PenTool, Search, Edit3, Save,
    Briefcase, GraduationCap as SchoolIcon, Lightbulb,
    Check
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/Components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { toast } from "sonner"; 
import { Toaster } from "@/Components/ui/sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Switch } from "@/Components/ui/switch";

// --- TYPES ---
interface Progress { 
    id?: number; 
    user_id: number;
    module_id: number;
    student_name: string; 
    student_avatar: string; 
    module_title?: string; 
    status: string; 
    hard_pre: number | null;
    hard_post: number | null;
    obs_trainer: number | null;
    obs_teacher: number | null;
    obs_avg: number | null;
    trainer_details: number[] | null;
    trainer_notes: string | null;
    teacher_details: number[] | null;
    teacher_notes: string | null;
    module_criteria: string[]; 
    date: string | null; 
}

interface UserType { id: number; name: string; email: string; role?: string; status_pkl?: string; joined_at?: string; }
interface Module { id: number; title: string; category: string; duration: string; soft_skill_config?: string[]; pivot?: { opens_at: string | null; is_active: number; } }
interface Kelas { id: number; nama: string; pelatih: string; periode: string; theme: string; deskripsi: string; students: UserType[]; modules: Module[]; students_count?: number; modules_count?: number; status: string; }
interface Props { auth: { user: UserType }; kelas: Kelas; kelasProgress: Progress[]; availableModules: Module[]; availableStudents: UserType[]; }

// --- COMPONENT: SCHEDULE PICKER ---
function SchedulePicker({ moduleId, initialDate, isActive, onSave }: { moduleId: number, initialDate: string, isActive: boolean, onSave: (id: number, date: string, active: boolean) => void }) {
    const [date, setDate] = useState(initialDate);
    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => { setDate(initialDate); }, [initialDate]);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { const newDate = e.target.value; setDate(newDate); onSave(moduleId, newDate, isActive); };
    
    const displayDate = date ? new Date(date).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : "Atur Jadwal";
    
    return ( 
        <div className="relative group w-full"> 
            <input type="datetime-local" ref={inputRef} value={date} onChange={handleChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onClick={(e) => e.currentTarget.showPicker()} /> 
            <div className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-all ${date ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                <div className="flex items-center gap-2 overflow-hidden">
                    <CalendarIcon size={14} /> 
                    <span className="truncate text-xs font-bold">{displayDate}</span> 
                </div>
                <Edit3 size={12} className="opacity-50" /> 
            </div> 
        </div> 
    );
}

// --- MAIN PAGE ---
export default function DetailKelas({ auth, kelas, kelasProgress, availableModules, availableStudents }: Props) {
    // States
    const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
    const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
    const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
    const [scoreTab, setScoreTab] = useState("trainer");
    const [selectedModuleId, setSelectedModuleId] = useState<string>("");
    const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
    const [studentSearchQuery, setStudentSearchQuery] = useState("");
    const [activeModuleId, setActiveModuleId] = useState<number>(kelas.modules.length > 0 ? kelas.modules[0].id : 0);
    const [searchStudent, setSearchStudent] = useState("");
    const [selectedProgress, setSelectedProgress] = useState<Progress | null>(null);
    const [softSkillScores, setSoftSkillScores] = useState<number[]>([]);
    const [softNotes, setSoftNotes] = useState("");
    
    const { data, post } = useForm({ progress_id: '', details: [] as number[], soft_skill_notes: '' });

    // Helpers
    const formatDateForInput = (dateStr: string | null | undefined) => { if (!dateStr) return ""; return dateStr.replace(" ", "T").substring(0, 16); };
    const pendingCounts = kelas.modules.reduce((acc, modul) => { const count = kelasProgress.filter(p => p.module_id === modul.id && p.obs_avg === null).length; acc[modul.id] = count; return acc; }, {} as Record<number, number>);

    // Data Processing
    const activeModule = kelas.modules.find(m => m.id === activeModuleId);
    const combinedData = kelas.students.map(student => {
        const prog = kelasProgress.find(p => p.user_id === student.id && p.module_id === activeModuleId);
        if (prog) return prog;
        return {
            user_id: student.id, module_id: activeModuleId, student_name: student.name, student_avatar: student.name.charAt(0),
            status: 'not_started',
            hard_pre: null, hard_post: null,
            obs_trainer: null, obs_teacher: null, obs_avg: null,
            trainer_details: null, trainer_notes: null, teacher_details: null, teacher_notes: null,
            module_criteria: activeModule?.soft_skill_config || [], date: '-'
        } as Progress;
    }).filter(item => item.student_name.toLowerCase().includes(searchStudent.toLowerCase()));

    const filteredStudentsList = kelas.students.filter(s => s.name.toLowerCase().includes(searchStudent.toLowerCase()));
    const filteredAvailableStudents = availableStudents.filter(s => s.name.toLowerCase().includes(studentSearchQuery.toLowerCase()));

    // Handlers
    const handleUpdateSchedule = (moduleId: number, date: string, isActive: boolean) => { const formattedDate = date === "" ? null : date; router.put(`/pengajar/kelas/${kelas.id}/modules/${moduleId}/schedule`, { opens_at: formattedDate, is_active: isActive }, { preserveScroll: true, onSuccess: () => toast.success("Jadwal diperbarui!") }); };
    
    const openScoreModal = (prog: Progress) => {
        setSelectedProgress(prog); setIsScoreModalOpen(true);
        const initialTab = auth.user.role === 'teacher' ? 'teacher' : 'trainer';
        setScoreTab(initialTab); loadScoresForTab(prog, initialTab);
    };

    const loadScoresForTab = (prog: Progress, tab: string) => {
        const criteriaCount = (prog.module_criteria && prog.module_criteria.length > 0) ? prog.module_criteria.length : (activeModule?.soft_skill_config?.length || 3);
        if (tab === 'trainer') {
            setSoftSkillScores(prog.trainer_details || new Array(criteriaCount).fill(0));
            setSoftNotes(prog.trainer_notes || "");
        } else {
            setSoftSkillScores(prog.teacher_details || new Array(criteriaCount).fill(0));
            setSoftNotes(prog.teacher_notes || "");
        }
    };

    const handleTabChange = (val: string) => { setScoreTab(val); if (selectedProgress) loadScoresForTab(selectedProgress, val); };
    const handleScoreChange = (index: number, val: string) => { let numVal = parseInt(val); if (isNaN(numVal)) numVal = 0; if (numVal > 100) numVal = 100; if (numVal < 0) numVal = 0; const newScores = [...softSkillScores]; newScores[index] = numVal; setSoftSkillScores(newScores); };
    const handleSaveSoftSkill = () => { if (!selectedProgress) return; data.progress_id = selectedProgress.id?.toString() || ''; data.details = softSkillScores; data.soft_skill_notes = softNotes; post(route('pengajar.softskill.update'), { onSuccess: () => { setIsScoreModalOpen(false); toast.success("Penilaian Tersimpan"); }, onError: () => toast.error("Gagal menyimpan.") }); };
    const handleAddModule = () => { if (!selectedModuleId) return; router.post(`/pengajar/kelas/${kelas.id}/modules`, { module_id: selectedModuleId }, { onSuccess: () => { setIsModuleModalOpen(false); setSelectedModuleId(""); toast.success("Modul ditambahkan!"); } }); };
    const handleRemoveModule = (moduleId: number) => { if (confirm("Hapus modul?")) { router.delete(`/pengajar/kelas/${kelas.id}/modules/${moduleId}`, { onSuccess: () => toast.success("Modul dihapus.") }); } };
    const toggleStudentSelection = (id: number) => { setSelectedStudentIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]); };
    const handleAddStudents = () => { if (selectedStudentIds.length === 0) return; router.post(`/pengajar/kelas/${kelas.id}/students`, { student_ids: selectedStudentIds }, { onSuccess: () => { setIsStudentModalOpen(false); setSelectedStudentIds([]); setStudentSearchQuery(""); toast.success("Siswa berhasil dimasukkan!"); } }); };
    const handleRemoveStudent = (studentId: number) => { if (confirm("Keluarkan siswa dari kelas ini?")) { router.delete(`/pengajar/kelas/${kelas.id}/students/${studentId}`, { onSuccess: () => toast.success("Siswa dikeluarkan.") }); } };

    return (
        <div className="flex min-h-screen bg-background font-sans text-foreground">
            <Head title={`Detail Kelas - ${kelas?.nama}`} />
            <div className="hidden md:block"><SidebarPengajar /></div>
            
            <main className="flex-1 w-full flex flex-col bg-[#FAFAF9] h-screen overflow-hidden">
                <HeaderPengajar />
                <Toaster />
                
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-7xl mx-auto pb-20">
                        
                        {/* --- HEADER --- */}
                        <div className="mb-8">
                            <Link href="/pengajar/kelas" className="inline-flex items-center text-slate-400 hover:text-primary mb-6 font-bold transition-colors text-xs uppercase tracking-widest">
                                <ArrowLeft size={16} className="mr-2" /> Kembali
                            </Link>
                            
                            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-black text-lg">
                                            {kelas.nama.charAt(0)}
                                        </div>
                                        <h1 className="text-3xl font-black text-slate-800">{kelas.nama}</h1>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                                        <span className="flex items-center gap-1"><CalendarIcon size={14}/> {kelas.periode}</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                        <span className="flex items-center gap-1"><User size={14}/> {kelas.pelatih}</span>
                                    </div>
                                </div>

                                <div className="flex gap-3 w-full md:w-auto">
                                    <div className="flex-1 md:flex-none bg-blue-50 border border-blue-100 px-5 py-3 rounded-2xl flex flex-col items-center justify-center min-w-[100px]">
                                        <span className="text-2xl font-black text-blue-600">{kelas.students_count}</span>
                                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Siswa</span>
                                    </div>
                                    <div className="flex-1 md:flex-none bg-emerald-50 border border-emerald-100 px-5 py-3 rounded-2xl flex flex-col items-center justify-center min-w-[100px]">
                                        <span className="text-2xl font-black text-emerald-600">{kelas.modules_count}</span>
                                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Modul</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- TABS UTAMA --- */}
                        <Tabs defaultValue="progress" className="w-full h-full flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <TabsList className="bg-white p-1.5 rounded-2xl border shadow-sm inline-flex h-auto">
                                    <TabsTrigger value="progress" className="rounded-xl px-5 py-2.5 font-bold text-sm data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all">
                                        Monitoring Progress
                                    </TabsTrigger>
                                    <TabsTrigger value="kurikulum" className="rounded-xl px-5 py-2.5 font-bold text-sm data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all">
                                        Kurikulum
                                    </TabsTrigger>
                                    <TabsTrigger value="siswa" className="rounded-xl px-5 py-2.5 font-bold text-sm data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md transition-all">
                                        Daftar Siswa
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            {/* --- TAB 1: MONITORING PROGRESS --- */}
                            <TabsContent value="progress" className="flex-1 min-h-[500px]">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full items-start">
                                    
                                    {/* Sidebar Modul List */}
                                    <div className="lg:col-span-3 bg-white rounded-[1.5rem] border shadow-sm overflow-hidden flex flex-col sticky top-4 max-h-[calc(100vh-150px)]">
                                        <div className="p-5 border-b bg-slate-50/50">
                                            <h3 className="font-black text-slate-800 text-lg">Modul</h3>
                                            <p className="text-xs text-slate-400 mt-1 font-medium">Pilih modul untuk input nilai.</p>
                                        </div>
                                        <div className="overflow-y-auto flex-1 p-3 space-y-2 custom-scrollbar">
                                            {kelas.modules.map((modul) => (
                                                <button 
                                                    key={modul.id} 
                                                    onClick={() => setActiveModuleId(modul.id)} 
                                                    className={`w-full px-4 py-3 rounded-xl text-sm font-bold text-left transition-all flex items-center justify-between group border relative overflow-hidden
                                                        ${activeModuleId === modul.id 
                                                            ? 'bg-orange-50 border-orange-200 text-orange-700 shadow-sm' 
                                                            : 'bg-white border-transparent hover:bg-slate-50 text-slate-600'
                                                        }
                                                    `}
                                                >
                                                    {activeModuleId === modul.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 rounded-r-full"></div>}
                                                    <span className="line-clamp-1 flex-1 mr-2">{modul.title}</span>
                                                    {pendingCounts[modul.id] > 0 && (
                                                        <Badge className="bg-red-500 text-white h-5 px-1.5 text-[10px] rounded-full shadow-sm hover:bg-red-600 border-0">
                                                            {pendingCounts[modul.id]}
                                                        </Badge>
                                                    )}
                                                </button>
                                            ))}
                                            {kelas.modules.length === 0 && <div className="p-6 text-center text-slate-400 text-xs font-bold">Belum ada modul.</div>}
                                        </div>
                                    </div>
                                    
                                    {/* Main Table Area */}
                                    <div className="lg:col-span-9 bg-white rounded-[1.5rem] border shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                                        {activeModule ? (
                                            <>
                                                <div className="p-6 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/30">
                                                    <div>
                                                        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                                                            {activeModule.title}
                                                        </h2>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">{activeModule.category}</span>
                                                            <p className="text-xs text-slate-400 font-medium">{activeModule.duration} Menit</p>
                                                        </div>
                                                    </div>
                                                    <div className="relative">
                                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
                                                        <Input 
                                                            placeholder="Cari siswa..." 
                                                            value={searchStudent} 
                                                            onChange={(e) => setSearchStudent(e.target.value)} 
                                                            className="pl-9 h-10 w-64 rounded-xl border-slate-200 bg-white focus:ring-primary/20"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="overflow-x-auto">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow className="bg-slate-50 hover:bg-slate-50">
                                                                <TableHead className="w-[300px] pl-6 font-bold text-slate-600">Siswa</TableHead>
                                                                <TableHead className="text-center w-[200px] font-bold text-slate-600">Pre & Post Test</TableHead>
                                                                <TableHead className="text-center w-[250px] font-bold text-slate-600">Observasi Skill</TableHead>
                                                                <TableHead className="text-right pr-6 font-bold text-slate-600">Aksi</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {combinedData.length > 0 ? (combinedData.map((item) => (
                                                                <TableRow key={item.user_id} className="hover:bg-slate-50 transition-colors align-top group">
                                                                    {/* 1. NAMA SISWA & STATUS */}
                                                                    <TableCell className="pl-6 py-5 align-middle">
                                                                        <div className="flex items-center gap-4">
                                                                            <Avatar className="h-10 w-10 bg-slate-100 text-slate-600 border-2 border-white shadow-sm">
                                                                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.student_name}`} />
                                                                                <AvatarFallback>{item.student_avatar}</AvatarFallback>
                                                                            </Avatar>
                                                                            <div>
                                                                                <p className="text-slate-800 font-bold text-sm mb-1">{item.student_name}</p>
                                                                                {item.status === 'completed' ? 
                                                                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-0 text-[10px] gap-1"><CheckCircle size={10}/> Selesai</Badge> : 
                                                                                 item.status === 'not_started' ? 
                                                                                    <Badge variant="outline" className="text-slate-400 border-slate-200 text-[10px]">Belum Mulai</Badge> : 
                                                                                    <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-0 text-[10px] gap-1"><Clock size={10}/> Proses</Badge>
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>

                                                                    {/* 2. TES HARD SKILL (Mini Cards & Clickable) */}
                                                                    <TableCell className="text-center py-5 align-middle">
                                                                        <div className="flex items-center justify-center gap-3">
                                                                            
                                                                            {/* PRE TEST SCORE */}
                                                                            <Link 
                                                                                href={item.hard_pre !== null ? `/pengajar/kelas/${kelas.id}/modul/${activeModuleId}/siswa/${item.user_id}/result/Pre-Test` : '#'}
                                                                                className={`flex flex-col items-center p-1.5 rounded-lg border shadow-sm min-w-[60px] transition-all
                                                                                    ${item.hard_pre !== null 
                                                                                        ? 'bg-white border-orange-200 cursor-pointer hover:bg-orange-50 hover:scale-105 hover:shadow-md group/pre' 
                                                                                        : 'bg-slate-50 border-slate-100 cursor-default opacity-50'
                                                                                    }`}
                                                                            >
                                                                                <span className={`text-[9px] font-extrabold uppercase mb-0.5 ${item.hard_pre !== null ? 'text-orange-400 group-hover/pre:text-orange-600' : 'text-slate-400'}`}>Pre</span>
                                                                                <span className={`text-base font-black ${item.hard_pre !== null ? 'text-orange-600' : 'text-slate-300'}`}>
                                                                                    {item.hard_pre ?? '-'}
                                                                                </span>
                                                                            </Link>

                                                                            <ArrowLeft size={12} className="text-slate-300 rotate-180"/>

                                                                            {/* POST TEST SCORE */}
                                                                            <Link 
                                                                                href={item.hard_post !== null ? `/pengajar/kelas/${kelas.id}/modul/${activeModuleId}/siswa/${item.user_id}/result/Post-Test` : '#'}
                                                                                className={`flex flex-col items-center p-1.5 rounded-lg border shadow-sm min-w-[60px] transition-all
                                                                                    ${item.hard_post !== null 
                                                                                        ? 'bg-white border-blue-200 cursor-pointer hover:bg-blue-50 hover:scale-105 hover:shadow-md group/post' 
                                                                                        : 'bg-slate-50 border-slate-100 cursor-default opacity-50'
                                                                                    }`}
                                                                            >
                                                                                <span className={`text-[9px] font-extrabold uppercase mb-0.5 ${item.hard_post !== null ? 'text-blue-400 group-hover/post:text-blue-600' : 'text-slate-400'}`}>Post</span>
                                                                                <span className={`text-base font-black ${item.hard_post !== null ? 'text-blue-600' : 'text-slate-300'}`}>
                                                                                    {item.hard_post ?? '-'}
                                                                                </span>
                                                                            </Link>

                                                                        </div>
                                                                    </TableCell>

                                                                    {/* 3. OBSERVASI SKILL (Stacked) */}
                                                                    <TableCell className="py-5 align-middle">
                                                                        <div className="flex flex-col gap-2 max-w-[200px] mx-auto bg-slate-50 p-2.5 rounded-xl border border-slate-100/50">
                                                                            <div className="flex items-center justify-between text-xs">
                                                                                <span className="flex items-center gap-1.5 text-slate-500 font-bold text-[10px] uppercase tracking-wide">
                                                                                    <Briefcase size={12} className="text-orange-500"/> Instr.
                                                                                </span>
                                                                                <span className={`font-black ${item.obs_trainer ? 'text-slate-700' : 'text-slate-300'}`}>
                                                                                    {item.obs_trainer ?? '-'}
                                                                                </span>
                                                                            </div>
                                                                            <div className="h-px bg-slate-200 w-full"></div>
                                                                            <div className="flex items-center justify-between text-xs">
                                                                                <span className="flex items-center gap-1.5 text-slate-500 font-bold text-[10px] uppercase tracking-wide">
                                                                                    <SchoolIcon size={12} className="text-blue-500"/> Guru
                                                                                </span>
                                                                                <span className={`font-black ${item.obs_teacher ? 'text-slate-700' : 'text-slate-300'}`}>
                                                                                    {item.obs_teacher ?? '-'}
                                                                                </span>
                                                                            </div>
                                                                            
                                                                            {/* Average Badge */}
                                                                            {item.obs_avg && (
                                                                                <div className="mt-1 pt-1 border-t border-slate-200 flex justify-between items-center">
                                                                                    <span className="text-[9px] font-black text-purple-600 uppercase">Rata-Rata</span>
                                                                                    <Badge className="h-5 bg-purple-600 text-white border-0 text-[10px]">{item.obs_avg}</Badge>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </TableCell>

                                                                    {/* 4. AKSI */}
                                                                    <TableCell className="text-right pr-6 py-5 align-middle">
                                                                        <Button 
                                                                            size="sm" 
                                                                            variant={item.obs_avg ? "outline" : "default"} 
                                                                            className={`h-9 px-4 rounded-xl font-bold text-xs shadow-sm transition-all
                                                                                ${!item.obs_avg 
                                                                                    ? "bg-primary hover:bg-orange-600 text-white" 
                                                                                    : "border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-primary"
                                                                                }
                                                                            `}
                                                                            onClick={() => openScoreModal(item)} 
                                                                            disabled={item.status === 'not_started'}
                                                                        >
                                                                            <PenTool size={14} className="mr-2"/> 
                                                                            {item.obs_avg ? "Edit Nilai" : "Input Nilai"}
                                                                        </Button>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))) : (
                                                                <TableRow>
                                                                    <TableCell colSpan={4} className="h-60 text-center">
                                                                        <div className="flex flex-col items-center justify-center opacity-40">
                                                                            <div className="bg-slate-100 p-4 rounded-full mb-3">
                                                                                <Users size={32} className="text-slate-400"/>
                                                                            </div>
                                                                            <p className="font-bold text-slate-500">Tidak ada siswa ditemukan.</p>
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full text-slate-400 p-10">
                                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                                    <BookOpen size={40} className="opacity-20 text-slate-500"/>
                                                </div>
                                                <p className="font-bold">Pilih modul di sebelah kiri untuk melihat data.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </TabsContent>

                            {/* --- TAB 2: KURIKULUM --- */}
                            <TabsContent value="kurikulum">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-800">Manajemen Kurikulum</h2>
                                        <p className="text-sm text-slate-500 font-medium">Atur jadwal dan visibilitas modul untuk kelas ini.</p>
                                    </div>
                                    <Button onClick={() => setIsModuleModalOpen(true)} className="rounded-xl font-bold h-12 shadow-lg bg-orange-500 hover:bg-orange-600 hover:scale-105 transition-transform">
                                        <Plus className="mr-2 h-5 w-5" /> Tambah Modul
                                    </Button>
                                </div>
                                <div className="grid gap-4">
                                    {kelas.modules.map((modul, index) => { 
                                        const isActive = modul.pivot?.is_active === 1; 
                                        const opensAt = formatDateForInput(modul.pivot?.opens_at); 
                                        return (
                                            <div key={modul.id} className={`bg-white p-6 rounded-[1.5rem] border shadow-sm flex flex-col md:flex-row items-center gap-6 transition-all group hover:border-primary/30 ${!isActive ? 'bg-slate-50/80 border-slate-200' : 'border-slate-100'}`}>
                                                
                                                {/* Left: Info */}
                                                <div className="flex items-center flex-1 w-full">
                                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl mr-5 border-2 shadow-sm shrink-0 transition-colors
                                                        ${isActive ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-slate-100 border-slate-200 text-slate-400'}
                                                    `}>
                                                        {index + 1}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className={`font-bold text-lg mb-1 ${isActive ? 'text-slate-800' : 'text-slate-500'}`}>{modul.title}</h3>
                                                        <div className="flex items-center gap-3">
                                                            <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-slate-200">{modul.category}</Badge>
                                                            <span className="text-xs font-bold text-slate-400 flex items-center gap-1"><Clock size={12}/> {modul.duration} Menit</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right: Controls */}
                                                <div className="flex flex-col sm:flex-row gap-4 items-center w-full md:w-auto bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                                    <div className="flex flex-col gap-1 w-full sm:w-auto">
                                                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Jadwal Buka</Label>
                                                        <SchedulePicker moduleId={modul.id} initialDate={opensAt} isActive={isActive} onSave={handleUpdateSchedule} />
                                                    </div>
                                                    
                                                    <div className="w-px h-8 bg-slate-200 hidden sm:block"></div>

                                                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between">
                                                        <div className="flex flex-col gap-1">
                                                            <Label className="text-[10px] font-black uppercase text-slate-400">Status</Label>
                                                            <div className="flex items-center gap-2">
                                                                <Switch checked={isActive} onCheckedChange={(c) => handleUpdateSchedule(modul.id, opensAt, c)} className="data-[state=checked]:bg-green-500"/>
                                                                <span className={`text-xs font-bold ${isActive ? 'text-green-600' : 'text-slate-400'}`}>{isActive ? 'Aktif' : 'Nonaktif'}</span>
                                                            </div>
                                                        </div>
                                                        <Button variant="ghost" size="icon" onClick={() => handleRemoveModule(modul.id)} className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl">
                                                            <Trash2 size={18}/>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) 
                                    })}
                                </div>
                            </TabsContent>

                            {/* --- TAB 3: SISWA --- */}
                            <TabsContent value="siswa">
                                <Card className="rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden bg-white">
                                    <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
                                        <div>
                                            <h2 className="text-xl font-black text-slate-800">Daftar Siswa</h2>
                                            <p className="text-sm text-slate-500 font-medium mt-1">Kelola akses siswa di kelas ini.</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
                                                <Input 
                                                    placeholder="Cari nama..." 
                                                    value={searchStudent} 
                                                    onChange={e=>setSearchStudent(e.target.value)} 
                                                    className="pl-9 h-10 w-64 rounded-xl border-slate-200 bg-white"
                                                />
                                            </div>
                                            <Button onClick={()=>setIsStudentModalOpen(true)} className="rounded-xl h-10 bg-primary hover:bg-orange-600 font-bold shadow-md">
                                                <UserPlus className="mr-2 h-4 w-4"/> Tambah Siswa
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-slate-50 hover:bg-slate-50">
                                                    <TableHead className="pl-8 w-[40%] font-bold text-slate-600">Nama Lengkap</TableHead>
                                                    <TableHead className="text-center font-bold text-slate-600">Status PKL</TableHead>
                                                    <TableHead className="text-center font-bold text-slate-600">Email</TableHead>
                                                    <TableHead className="text-right pr-8 font-bold text-slate-600">Aksi</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredStudentsList.length > 0 ? filteredStudentsList.map(s => (
                                                    <TableRow key={s.id} className="hover:bg-slate-50 transition-colors">
                                                        <TableCell className="pl-8 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <Avatar className="h-9 w-9 bg-slate-100 text-slate-600 border border-white shadow-sm">
                                                                    <AvatarFallback className="font-bold">{s.name.charAt(0)}</AvatarFallback>
                                                                </Avatar>
                                                                <span className="font-bold text-slate-700">{s.name}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <Badge variant="outline" className="border-slate-200 text-slate-500 bg-slate-50 font-bold">
                                                                {s.status_pkl || 'Belum Siap'}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-center text-slate-500 text-sm font-medium">{s.email}</TableCell>
                                                        <TableCell className="text-right pr-8">
                                                            <Button variant="ghost" size="icon" onClick={() => handleRemoveStudent(s.id)} className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                                                                <Trash2 size={16}/>
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                )) : (
                                                    <TableRow>
                                                        <TableCell colSpan={4} className="h-40 text-center text-slate-400 font-medium">Belum ada siswa di kelas ini.</TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </Card>
                            </TabsContent>
                        </Tabs>

                        {/* --- MODAL INPUT NILAI (Improved) --- */}
                        <Dialog open={isScoreModalOpen} onOpenChange={setIsScoreModalOpen}>
                            <DialogContent className="rounded-[2.5rem] p-0 sm:max-w-[650px] bg-[#FAFAF9] overflow-hidden border-0 shadow-2xl">
                                <div className="p-8 pb-4 bg-white border-b">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-black text-slate-800 flex items-center gap-2">
                                            <PenTool className="text-primary" size={24}/> Penilaian Observasi
                                        </DialogTitle>
                                        <DialogDescription className="text-slate-500 font-medium">
                                            Input penilaian soft skill untuk <strong className="text-slate-800">{selectedProgress?.student_name}</strong> pada modul ini.
                                        </DialogDescription>
                                    </DialogHeader>
                                </div>
                                
                                <div className="p-8 pt-6">
                                    <Tabs value={scoreTab} onValueChange={handleTabChange} className="w-full">
                                        <TabsList className="grid w-full grid-cols-2 bg-slate-200 p-1.5 rounded-2xl h-auto mb-6">
                                            <TabsTrigger value="trainer" className="rounded-xl py-3 font-bold text-sm data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm gap-2 transition-all">
                                                <Briefcase size={18}/> Instruktur
                                            </TabsTrigger>
                                            <TabsTrigger value="teacher" className="rounded-xl py-3 font-bold text-sm data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm gap-2 transition-all">
                                                <SchoolIcon size={18}/> Guru
                                            </TabsTrigger>
                                        </TabsList>
                                        
                                        <div className="space-y-6">
                                            {/* Form Instruktur */}
                                            <TabsContent value="trainer">
                                                <div className={auth.user.role === 'teacher' ? "opacity-50 pointer-events-none grayscale transition-all" : "transition-all"}>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                                        {selectedProgress?.module_criteria.map((c, i) => (
                                                            <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                                                                <Label className="text-xs font-black text-slate-400 mb-2 block uppercase tracking-wider">{c}</Label>
                                                                <Input 
                                                                    type="number" 
                                                                    value={softSkillScores[i] || 0} 
                                                                    onChange={(e) => handleScoreChange(i, e.target.value)} 
                                                                    className="font-black text-3xl h-12 border-0 border-b-2 border-slate-200 rounded-none px-0 text-center focus-visible:ring-0 focus-visible:border-primary bg-transparent text-slate-800"
                                                                    placeholder="0"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="mt-6">
                                                        <Label className="text-xs font-black text-slate-400 mb-2 block uppercase tracking-wider ml-1">Catatan Tambahan</Label>
                                                        <Textarea 
                                                            value={softNotes} 
                                                            onChange={e => setSoftNotes(e.target.value)} 
                                                            placeholder="Tulis evaluasi atau catatan khusus..." 
                                                            className="min-h-[100px] rounded-2xl border-slate-200 bg-white resize-none focus:border-primary focus:ring-primary/20"
                                                        />
                                                    </div>
                                                    <Button onClick={handleSaveSoftSkill} className="w-full mt-6 bg-orange-600 hover:bg-orange-700 font-bold h-14 rounded-2xl text-lg shadow-lg shadow-orange-200" disabled={auth.user.role === 'teacher'}>
                                                        <Save className="mr-2"/> Simpan Nilai Instruktur
                                                    </Button>
                                                </div>
                                            </TabsContent>

                                            {/* Form Guru */}
                                            <TabsContent value="teacher">
                                                <div className={auth.user.role !== 'teacher' && auth.user.role !== 'admin' ? "opacity-50 pointer-events-none grayscale transition-all" : "transition-all"}>
                                                    <div className="bg-blue-50/50 p-4 rounded-2xl mb-4 border border-blue-100">
                                                        <p className="text-xs text-blue-600 font-medium flex items-center gap-2"><Lightbulb size={16}/> Penilaian ini dilakukan oleh Guru pendamping.</p>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                                        {selectedProgress?.module_criteria.map((c, i) => (
                                                            <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
                                                                <Label className="text-xs font-black text-slate-400 mb-2 block uppercase tracking-wider">{c}</Label>
                                                                <Input 
                                                                    type="number" 
                                                                    value={softSkillScores[i] || 0} 
                                                                    onChange={(e) => handleScoreChange(i, e.target.value)} 
                                                                    className="font-black text-3xl h-12 border-0 border-b-2 border-slate-200 rounded-none px-0 text-center focus-visible:ring-0 focus-visible:border-blue-500 bg-transparent text-slate-800"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="mt-6">
                                                        <Label className="text-xs font-black text-slate-400 mb-2 block uppercase tracking-wider ml-1">Catatan Guru</Label>
                                                        <Textarea 
                                                            value={softNotes} 
                                                            onChange={e => setSoftNotes(e.target.value)} 
                                                            placeholder="Catatan dari sudut pandang akademik..." 
                                                            className="min-h-[100px] rounded-2xl border-slate-200 bg-white resize-none focus:border-blue-500 focus:ring-blue-500/20"
                                                        />
                                                    </div>
                                                    <Button onClick={handleSaveSoftSkill} className="w-full mt-6 bg-blue-600 hover:bg-blue-700 font-bold h-14 rounded-2xl text-lg shadow-lg shadow-blue-200" disabled={auth.user.role !== 'teacher' && auth.user.role !== 'admin'}>
                                                        <Save className="mr-2"/> Simpan Nilai Guru
                                                    </Button>
                                                </div>
                                            </TabsContent>
                                        </div>
                                    </Tabs>
                                </div>
                            </DialogContent>
                        </Dialog>

                        {/* --- MODAL LAINNYA (ADD MODULE & ADD STUDENT) --- */}
                        <Dialog open={isModuleModalOpen} onOpenChange={setIsModuleModalOpen}>
                            <DialogContent className="rounded-3xl p-8"><div className="space-y-4"><h3 className="font-bold text-xl text-slate-800">Tambah Modul ke Kurikulum</h3><Select onValueChange={setSelectedModuleId}><SelectTrigger className="h-12 rounded-xl border-slate-200"><SelectValue placeholder="Pilih Modul dari Bank Modul"/></SelectTrigger><SelectContent className="rounded-xl">{availableModules.map(m=><SelectItem key={m.id} value={m.id.toString()}>{m.title}</SelectItem>)}</SelectContent></Select><Button onClick={handleAddModule} className="w-full h-12 rounded-xl font-bold bg-primary hover:bg-orange-600" disabled={!selectedModuleId}>Tambah Sekarang</Button></div></DialogContent>
                        </Dialog>
                        
                        <Dialog open={isStudentModalOpen} onOpenChange={setIsStudentModalOpen}>
                            <DialogContent className="rounded-[2.5rem] p-0 sm:max-w-[550px] overflow-hidden bg-white">
                                <div className="p-6 border-b bg-slate-50"><DialogHeader><DialogTitle className="text-xl font-black text-slate-800">Tambahkan Siswa</DialogTitle><DialogDescription>Pilih siswa yang tersedia untuk dimasukkan ke kelas ini.</DialogDescription></DialogHeader></div>
                                <div className="p-6">
                                    <div className="relative mb-4"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input type="text" placeholder="Cari nama siswa..." value={studentSearchQuery} onChange={(e) => setStudentSearchQuery(e.target.value)} className="w-full pl-10 pr-4 h-12 rounded-xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-primary focus:outline-none transition-all font-medium text-sm"/></div>
                                    <div className="max-h-[280px] overflow-y-auto p-1 space-y-2 custom-scrollbar">
                                        {filteredAvailableStudents.length > 0 ? filteredAvailableStudents.map(s => (
                                            <div key={s.id} onClick={() => toggleStudentSelection(s.id)} className={`p-4 rounded-xl cursor-pointer flex items-center justify-between border-2 transition-all group ${selectedStudentIds.includes(s.id) ? 'bg-orange-50 border-orange-200' : 'bg-white border-slate-100 hover:border-slate-300'}`}>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${selectedStudentIds.includes(s.id) ? 'bg-orange-200 text-orange-700' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}>{s.name.charAt(0)}</div>
                                                    <div><p className={`font-bold text-sm ${selectedStudentIds.includes(s.id) ? 'text-orange-800' : 'text-slate-700'}`}>{s.name}</p><p className="text-xs text-slate-400">{s.email}</p></div>
                                                </div>
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedStudentIds.includes(s.id) ? 'bg-orange-500 border-orange-500 text-white' : 'border-slate-300 bg-white'}`}>{selectedStudentIds.includes(s.id) && <Check size={14} strokeWidth={4} />}</div>
                                            </div>
                                        )) : (<div className="p-8 text-center text-slate-400 text-sm font-medium bg-slate-50 rounded-2xl border border-dashed border-slate-200">Tidak ada siswa yang cocok.</div>)}
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-slate-100"><Button onClick={handleAddStudents} className="w-full h-14 rounded-2xl font-black shadow-lg hover:scale-[1.02] transition-transform bg-primary hover:bg-orange-600 text-lg" disabled={selectedStudentIds.length === 0}>Masukkan {selectedStudentIds.length > 0 ? `${selectedStudentIds.length} Siswa` : 'Siswa'}</Button></div>
                                </div>
                            </DialogContent>
                        </Dialog>

                    </div>
                </div>
            </main>
        </div>
    );
}