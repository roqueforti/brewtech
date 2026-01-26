import { useState, useEffect, useRef } from "react";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import SidebarPengajar from "@/Components/SidebarPengajar";
import HeaderPengajar from "@/Components/HeaderPengajar";
import { 
    ArrowLeft, Users, BookOpen, Plus, Trash2, 
    UserPlus, Calendar as CalendarIcon, User, Activity, CheckCircle, Clock, 
    PenTool, Calculator, ChevronRight, Search, Edit3, Mail, GraduationCap, X, Save,
    UserCheck, Briefcase, GraduationCap as SchoolIcon, BrainCircuit, Lightbulb,
    Check // Added missing import
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/Components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { toast } from "sonner"; 
import { Toaster } from "@/Components/ui/sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Switch } from "@/Components/ui/switch";

interface Progress { 
    id?: number; 
    user_id: number;
    module_id: number;
    student_name: string; 
    student_avatar: string; 
    module_title?: string; 
    status: string; 
    
    // Updated Score Structure
    hard_pre: number | null;
    hard_post: number | null;
    // Tes Soft Skill dihapus
    
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

function SchedulePicker({ moduleId, initialDate, isActive, onSave }: { moduleId: number, initialDate: string, isActive: boolean, onSave: (id: number, date: string, active: boolean) => void }) {
    const [date, setDate] = useState(initialDate);
    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => { setDate(initialDate); }, [initialDate]);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { const newDate = e.target.value; setDate(newDate); onSave(moduleId, newDate, isActive); };
    const displayDate = date ? new Date(date).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : "Atur Jadwal";
    return ( <div className="relative group"> <input type="datetime-local" ref={inputRef} value={date} onChange={handleChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onClick={(e) => e.currentTarget.showPicker()} /> <Button variant="outline" className={`w-full md:w-56 justify-start font-bold text-left pl-3 border-2 h-10 ${date ? 'text-slate-700 border-slate-200 bg-white' : 'text-slate-400 border-dashed border-slate-300 bg-slate-50'}`}> <CalendarIcon className={`mr-2 h-4 w-4 ${date ? 'text-primary' : 'text-slate-400'}`} /> <span className="truncate flex-1 text-xs">{displayDate}</span> <Edit3 className="ml-2 h-3 w-3 opacity-50" /> </Button> </div> );
}

export default function DetailKelas({ auth, kelas, kelasProgress, availableModules, availableStudents }: Props) {
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
    
    const { data, setData, post, processing } = useForm({ progress_id: '', details: [] as number[], soft_skill_notes: '' });

    const formatDateForInput = (dateStr: string | null | undefined) => { if (!dateStr) return ""; return dateStr.replace(" ", "T").substring(0, 16); };
    const pendingCounts = kelas.modules.reduce((acc, modul) => { const count = kelasProgress.filter(p => p.module_id === modul.id && p.obs_avg === null).length; acc[modul.id] = count; return acc; }, {} as Record<number, number>);

    // Data Gabungan Updated
    const activeModule = kelas.modules.find(m => m.id === activeModuleId);
    const combinedData = kelas.students.map(student => {
        const prog = kelasProgress.find(p => p.user_id === student.id && p.module_id === activeModuleId);
        if (prog) return prog;
        return {
            user_id: student.id, module_id: activeModuleId, student_name: student.name, student_avatar: student.name.charAt(0),
            status: 'not_started',
            hard_pre: null, hard_post: null,
            // soft_test_pre: null, soft_test_post: null, // Removed
            obs_trainer: null, obs_teacher: null, obs_avg: null,
            trainer_details: null, trainer_notes: null, teacher_details: null, teacher_notes: null,
            module_criteria: activeModule?.soft_skill_config || [], date: '-'
        } as Progress;
    }).filter(item => item.student_name.toLowerCase().includes(searchStudent.toLowerCase()));

    const filteredStudentsList = kelas.students.filter(s => s.name.toLowerCase().includes(searchStudent.toLowerCase()));
    const filteredAvailableStudents = availableStudents.filter(s => s.name.toLowerCase().includes(studentSearchQuery.toLowerCase()));

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
                
                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="max-w-7xl mx-auto pb-20">
                        {/* Header Section */}
                        <div className="mb-6">
                            <Link href="/pengajar/kelas" className="inline-flex items-center text-muted-foreground hover:text-primary mb-4 font-bold transition-colors text-sm"><ArrowLeft size={18} className="mr-2" /> Kembali ke Manajemen Kelas</Link>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div><h1 className="text-3xl font-black text-foreground">{kelas.nama}</h1><p className="text-muted-foreground font-medium flex items-center gap-2 mt-1"><CalendarIcon size={16} /> {kelas.periode} <span className="text-slate-300">|</span> <User size={16}/> {kelas.pelatih}</p></div>
                                <div className="flex items-center gap-3"><div className="bg-white px-4 py-2 rounded-xl border font-bold text-sm shadow-sm flex items-center gap-2"><Users size={16} className="text-blue-500"/> {kelas.students_count} Siswa</div><div className="bg-white px-4 py-2 rounded-xl border font-bold text-sm shadow-sm flex items-center gap-2"><BookOpen size={16} className="text-orange-500"/> {kelas.modules_count} Modul</div></div>
                            </div>
                        </div>

                        <Tabs defaultValue="progress" className="w-full h-full flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <TabsList className="bg-white p-1 rounded-xl border shadow-sm inline-flex">
                                    <TabsTrigger value="progress" className="rounded-lg px-4 py-2 font-bold data-[state=active]:bg-primary data-[state=active]:text-white">Monitoring Progress</TabsTrigger>
                                    <TabsTrigger value="kurikulum" className="rounded-lg px-4 py-2 font-bold data-[state=active]:bg-primary data-[state=active]:text-white">Kurikulum</TabsTrigger>
                                    <TabsTrigger value="siswa" className="rounded-lg px-4 py-2 font-bold data-[state=active]:bg-primary data-[state=active]:text-white">Siswa</TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="progress" className="flex-1 min-h-[500px]">
                                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full items-start">
                                    {/* Sidebar Modul */}
                                    <div className="lg:col-span-1 bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col sticky top-0 max-h-[calc(100vh-200px)]">
                                        <div className="p-4 border-b bg-slate-50"><h3 className="font-black text-slate-700">Daftar Modul</h3><p className="text-xs text-muted-foreground mt-1">Pilih modul untuk melihat nilai.</p></div>
                                        <div className="overflow-y-auto flex-1 p-2 space-y-1 custom-scrollbar">
                                            {kelas.modules.map((modul) => (
                                                <button key={modul.id} onClick={() => setActiveModuleId(modul.id)} className={`w-full px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between group ${activeModuleId === modul.id ? 'bg-primary text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}>
                                                    <span className="line-clamp-2 text-left flex-1 mr-2">{modul.title}</span>
                                                    <div className="flex items-center gap-2">{pendingCounts[modul.id] > 0 && (<Badge variant="destructive" className="h-5 px-1.5 text-[10px] rounded-full border-2 border-white shadow-sm">{pendingCounts[modul.id]}</Badge>)}{activeModuleId === modul.id && <ChevronRight size={16} />}</div>
                                                </button>
                                            ))}
                                            {kelas.modules.length === 0 && <div className="p-4 text-center text-slate-400 text-sm">Belum ada modul.</div>}
                                        </div>
                                    </div>
                                    
                                    {/* Tabel Nilai Lengkap */}
                                    <div className="lg:col-span-3 bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                                        {activeModule ? (
                                            <>
                                                <div className="p-6 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
                                                    <div><h2 className="text-xl font-black text-slate-800 flex items-center gap-2">{activeModule.title}</h2><p className="text-sm text-muted-foreground font-medium mt-1">Menampilkan {combinedData.length} siswa di kelas ini.</p></div>
                                                    <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/><Input placeholder="Cari siswa..." value={searchStudent} onChange={(e) => setSearchStudent(e.target.value)} className="pl-9 h-10 w-64 rounded-xl border-slate-200 bg-white"/></div>
                                                </div>
                                                <div className="overflow-x-auto">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow className="bg-slate-50 hover:bg-slate-50">
                                                                <TableHead className="w-[250px] pl-6">Nama Siswa</TableHead>
                                                                <TableHead className="text-center w-[200px]">Tes Hard Skill</TableHead>
                                                                {/* Kolom Tes Soft Skill Dihapus */}
                                                                <TableHead className="text-center w-[250px]">Observasi (Instr/Guru)</TableHead>
                                                                <TableHead className="text-right pr-6">Aksi</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {combinedData.length > 0 ? (combinedData.map((item) => (
                                                                <TableRow key={item.user_id} className="hover:bg-slate-50 transition-colors align-top">
                                                                    {/* Nama & Status */}
                                                                    <TableCell className="pl-6 py-4">
                                                                        <div className="flex flex-col gap-2">
                                                                            <div className="flex items-center gap-3">
                                                                                <Avatar className="h-9 w-9 bg-slate-100 text-slate-600 border"><AvatarFallback>{item.student_avatar}</AvatarFallback></Avatar>
                                                                                <p className="text-slate-800 font-bold text-sm">{item.student_name}</p>
                                                                            </div>
                                                                            <div className="pl-12">
                                                                                {item.status === 'completed' ? <Badge className="bg-green-100 text-green-700 border-green-200 text-[10px]">Selesai</Badge> : 
                                                                                 item.status === 'not_started' ? <Badge variant="outline" className="text-slate-400 border-slate-200 text-[10px]">Belum Mulai</Badge> : 
                                                                                 <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 text-[10px]">Proses</Badge>}
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>

                                                                    {/* 1. TES HARD SKILL */}
                                                                    <TableCell className="text-center py-4">
                                                                        <div className="flex items-center justify-center gap-2">
                                                                            <div className="flex flex-col items-center p-2 bg-slate-50 rounded-lg border border-slate-100 min-w-[60px]">
                                                                                <span className="text-[9px] font-bold text-slate-400 uppercase mb-1">PRE</span>
                                                                                <span className={`font-black text-sm ${item.hard_pre ? 'text-orange-600' : 'text-slate-300'}`}>{item.hard_pre ?? '-'}</span>
                                                                            </div>
                                                                            <div className="flex flex-col items-center p-2 bg-slate-50 rounded-lg border border-slate-100 min-w-[60px]">
                                                                                <span className="text-[9px] font-bold text-slate-400 uppercase mb-1">POST</span>
                                                                                <span className={`font-black text-sm ${item.hard_post ? 'text-blue-600' : 'text-slate-300'}`}>{item.hard_post ?? '-'}</span>
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>

                                                                    {/* 3. OBSERVASI MANUAL */}
                                                                    <TableCell className="py-4">
                                                                        <div className="flex flex-col gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
                                                                            <div className="flex items-center justify-between text-xs px-1">
                                                                                <span className="flex items-center gap-1.5 text-slate-500 font-medium"><Briefcase size={12} className="text-orange-500"/> Instruktur</span>
                                                                                <span className={`font-bold ${item.obs_trainer ? 'text-slate-700' : 'text-slate-300'}`}>{item.obs_trainer ?? '-'}</span>
                                                                            </div>
                                                                            <div className="flex items-center justify-between text-xs px-1">
                                                                                <span className="flex items-center gap-1.5 text-slate-500 font-medium"><SchoolIcon size={12} className="text-blue-500"/> Guru</span>
                                                                                <span className={`font-bold ${item.obs_teacher ? 'text-slate-700' : 'text-slate-300'}`}>{item.obs_teacher ?? '-'}</span>
                                                                            </div>
                                                                            <div className="h-px bg-slate-200"></div>
                                                                            <div className="flex items-center justify-between text-xs px-1">
                                                                                <span className="font-bold text-slate-600 text-[10px] uppercase">AVG</span>
                                                                                <Badge className={`h-5 px-1.5 border-0 font-bold ${item.obs_avg ? 'bg-purple-100 text-purple-700' : 'bg-slate-200 text-slate-400'}`}>{item.obs_avg ?? '-'} </Badge>
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>

                                                                    <TableCell className="text-right pr-6 py-4 align-middle">
                                                                        <Button size="sm" variant={item.obs_avg ? "outline" : "default"} className={`h-9 rounded-xl font-bold text-xs ${!item.obs_avg && "bg-orange-500 hover:bg-orange-600 text-white"}`} onClick={() => openScoreModal(item)} disabled={item.status === 'not_started'}>
                                                                            Input Nilai
                                                                        </Button>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))) : (
                                                                <TableRow>
                                                                    <TableCell colSpan={4} className="h-40 text-center text-muted-foreground flex flex-col items-center justify-center">
                                                                        <Users size={32} className="opacity-20 mb-2"/> Tidak ada siswa ditemukan.
                                                                    </TableCell>
                                                                </TableRow>
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full text-slate-400 p-10"><BookOpen size={48} className="mb-4 opacity-20"/><p>Pilih modul di sebelah kiri untuk melihat data.</p></div>
                                        )}
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="kurikulum">
                                <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold">Daftar Modul & Jadwal</h2><Button onClick={() => setIsModuleModalOpen(true)} className="rounded-xl font-bold h-12 shadow-md bg-orange-500 hover:bg-orange-600"><Plus className="mr-2 h-5 w-5" /> Tambah Modul</Button></div>
                                <div className="grid gap-4">{kelas.modules.map((modul, index) => { const isActive = modul.pivot?.is_active === 1; const opensAt = formatDateForInput(modul.pivot?.opens_at); return (<div key={modul.id} className={`bg-white p-6 rounded-[1.5rem] border-2 shadow-sm flex flex-col md:flex-row items-center gap-6 ${!isActive ? 'opacity-70 bg-slate-50' : ''}`}><div className="flex items-center flex-1"><div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl mr-4 border bg-blue-50 text-blue-600">{index + 1}</div><div className="flex-1"><h3 className="font-bold text-lg">{modul.title}</h3></div></div><div className="flex gap-4 items-center"><div className="flex flex-col gap-1"><Label className="text-[10px] font-bold uppercase text-slate-400">Jadwal</Label><SchedulePicker moduleId={modul.id} initialDate={opensAt} isActive={isActive} onSave={handleUpdateSchedule} /></div><div className="flex flex-col gap-1"><Label className="text-[10px] font-bold uppercase text-slate-400">Status</Label><Switch checked={isActive} onCheckedChange={(c) => handleUpdateSchedule(modul.id, opensAt, c)} className="data-[state=checked]:bg-green-500"/></div><Button variant="ghost" size="icon" onClick={() => handleRemoveModule(modul.id)}><Trash2 size={18} className="text-red-400"/></Button></div></div>) })}</div>
                            </TabsContent>

                            <TabsContent value="siswa">
                                <Card className="rounded-[2.5rem] border-2 border-border/60 shadow-sm overflow-hidden bg-white"><div className="p-6 border-b flex justify-between items-center"><h2 className="text-xl font-black">Siswa Terdaftar</h2><div className="flex gap-2"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/><Input placeholder="Cari..." value={searchStudent} onChange={e=>setSearchStudent(e.target.value)} className="pl-9 h-10 w-64 rounded-xl"/></div><Button onClick={()=>setIsStudentModalOpen(true)} className="rounded-xl h-10 bg-primary font-bold"><UserPlus className="mr-2 h-4 w-4"/> Tambah</Button></div></div><div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead className="pl-8">Nama</TableHead><TableHead className="text-center">Status</TableHead><TableHead className="text-right pr-8">Aksi</TableHead></TableRow></TableHeader><TableBody>{filteredStudentsList.map(s => (<TableRow key={s.id}><TableCell className="pl-8 font-bold text-slate-700">{s.name}</TableCell><TableCell className="text-center"><Badge variant="outline">{s.status_pkl || 'Belum Siap'}</Badge></TableCell><TableCell className="text-right pr-8"><Button variant="ghost" size="icon" onClick={() => handleRemoveStudent(s.id)}><Trash2 size={16}/></Button></TableCell></TableRow>))}</TableBody></Table></div></Card>
                            </TabsContent>
                        </Tabs>

                        <Dialog open={isScoreModalOpen} onOpenChange={setIsScoreModalOpen}>
                            <DialogContent className="rounded-[2rem] p-8 sm:max-w-[650px] bg-white overflow-hidden">
                                <DialogHeader><DialogTitle className="text-2xl font-black text-slate-800">Penilaian Observasi</DialogTitle><DialogDescription>Input penilaian untuk <strong className="text-slate-800">{selectedProgress?.student_name}</strong>.</DialogDescription></DialogHeader>
                                <Tabs value={scoreTab} onValueChange={handleTabChange} className="w-full mt-4">
                                    <TabsList className="grid w-full grid-cols-2 bg-slate-100 p-1 rounded-xl"><TabsTrigger value="trainer" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:text-primary shadow-sm gap-2"><Briefcase size={16}/> Instruktur</TabsTrigger><TabsTrigger value="teacher" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:text-blue-600 shadow-sm gap-2"><SchoolIcon size={16}/> Guru</TabsTrigger></TabsList>
                                    <div className="mt-6 space-y-6">
                                        <TabsContent value="trainer"><div className={auth.user.role === 'teacher' ? "opacity-60 pointer-events-none grayscale" : ""}><div className="grid grid-cols-2 gap-4 max-h-[250px] overflow-y-auto">{selectedProgress?.module_criteria.map((c,i)=>(<div key={i}><Label className="text-xs font-bold text-slate-500 mb-1 block">{c}</Label><Input type="number" value={softSkillScores[i]||0} onChange={(e)=>handleScoreChange(i, e.target.value)} className="font-bold text-center"/></div>))}</div><Textarea value={softNotes} onChange={e=>setSoftNotes(e.target.value)} placeholder="Catatan instruktur..." className="mt-4"/><Button onClick={handleSaveSoftSkill} className="w-full mt-4 bg-orange-600 font-bold h-12 rounded-xl" disabled={auth.user.role === 'teacher'}>Simpan Nilai Instruktur</Button></div></TabsContent>
                                        <TabsContent value="teacher"><div className={auth.user.role !== 'teacher' && auth.user.role !== 'admin' ? "opacity-60 pointer-events-none grayscale" : ""}><div className="grid grid-cols-2 gap-4 max-h-[250px] overflow-y-auto">{selectedProgress?.module_criteria.map((c,i)=>(<div key={i}><Label className="text-xs font-bold text-slate-500 mb-1 block">{c}</Label><Input type="number" value={softSkillScores[i]||0} onChange={(e)=>handleScoreChange(i, e.target.value)} className="font-bold text-center"/></div>))}</div><Textarea value={softNotes} onChange={e=>setSoftNotes(e.target.value)} placeholder="Catatan guru..." className="mt-4"/><Button onClick={handleSaveSoftSkill} className="w-full mt-4 bg-blue-600 font-bold h-12 rounded-xl" disabled={auth.user.role !== 'teacher' && auth.user.role !== 'admin'}>Simpan Nilai Guru</Button></div></TabsContent>
                                    </div>
                                </Tabs>
                            </DialogContent>
                        </Dialog>

                        <Dialog open={isModuleModalOpen} onOpenChange={setIsModuleModalOpen}><DialogContent><div className="space-y-4"><h3 className="font-bold text-xl">Tambah Modul</h3><Select onValueChange={setSelectedModuleId}><SelectTrigger><SelectValue placeholder="Pilih Modul"/></SelectTrigger><SelectContent>{availableModules.map(m=><SelectItem key={m.id} value={m.id.toString()}>{m.title}</SelectItem>)}</SelectContent></Select><Button onClick={handleAddModule} className="w-full" disabled={!selectedModuleId}>Tambah</Button></div></DialogContent></Dialog>
                        
                        <Dialog open={isStudentModalOpen} onOpenChange={setIsStudentModalOpen}>
                            <DialogContent className="rounded-[2rem] p-8 sm:max-w-[500px]">
                                <DialogHeader><DialogTitle className="text-2xl font-black text-slate-800">Pilih Siswa</DialogTitle></DialogHeader>
                                <div className="mt-4">
                                    <div className="p-3 border-b bg-slate-50 flex items-center gap-2 rounded-t-xl border-x border-t"><Search size={18} className="text-slate-400"/><input type="text" placeholder="Cari nama siswa..." value={studentSearchQuery} onChange={(e) => setStudentSearchQuery(e.target.value)} className="bg-transparent border-none outline-none text-sm w-full focus:ring-0"/></div>
                                    <div className="max-h-[300px] overflow-y-auto p-2 border-x border-b rounded-b-xl space-y-1">
                                            {filteredAvailableStudents.length > 0 ? filteredAvailableStudents.map(s => (<div key={s.id} onClick={() => toggleStudentSelection(s.id)} className={`p-3 rounded-lg cursor-pointer flex items-center gap-3 transition-colors ${selectedStudentIds.includes(s.id) ? 'bg-yellow-50 border-yellow-200 border' : 'hover:bg-slate-50 border border-transparent'}`}><div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedStudentIds.includes(s.id) ? 'bg-orange-500 border-orange-500 text-white' : 'border-slate-300 bg-white'}`}>{selectedStudentIds.includes(s.id) && <Check size={14} strokeWidth={3} />}</div><span className={`font-medium ${selectedStudentIds.includes(s.id) ? 'text-orange-900' : 'text-slate-700'}`}>{s.name}</span></div>)) : (<div className="p-4 text-center text-slate-400 text-sm">Tidak ada siswa yang sesuai.</div>)}
                                    </div>
                                    <div className="mt-4 flex justify-end"><Button onClick={handleAddStudents} className="w-full h-12 rounded-xl font-bold shadow-lg hover:scale-[1.02] transition-transform bg-primary" disabled={selectedStudentIds.length === 0}>Masukkan {selectedStudentIds.length > 0 ? `${selectedStudentIds.length} Siswa` : 'Siswa'}</Button></div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </main>
        </div>
    );
}