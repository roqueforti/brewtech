import { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import SidebarPengajar from "@/Components/SidebarPengajar";
import HeaderPengajar from "@/Components/HeaderPengajar";
import { 
    Save, Sliders, ShieldCheck, AlertTriangle, Cpu, LayoutTemplate, 
    CheckCircle2, RefreshCcw, Percent, Trophy, Star, Zap, PenTool, Hash,
    TrendingUp, Award, Settings2
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Toaster } from "@/Components/ui/sonner";
import { toast } from "sonner";
import { Badge } from "@/Components/ui/badge";

export default function Pengaturan({ auth, settings }: { auth: any, settings: any }) {
    const { errors } = usePage().props;
    
    // Default Values (Fallback jika DB kosong)
    const [formData, setFormData] = useState({
        // UMUM
        app_name: settings.app_name || "BrewTech Academy",
        instructor_name: settings.instructor_name || "Hilman Ramadhan",
        
        // SPK (LOGIKA)
        spk_bobot_visual: parseInt(settings.spk_bobot_visual || "60"),
        spk_bobot_soft: parseInt(settings.spk_bobot_soft || "40"),
        spk_threshold_siap: settings.spk_threshold_siap || "85",
        spk_threshold_pantau: settings.spk_threshold_pantau || "75",
    });

    const [isSaving, setIsSaving] = useState(false);

    // --- HANDLERS ---

    const handleChange = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleBobotChange = (val: number) => {
        if (val > 100) val = 100;
        if (val < 0) val = 0;
        setFormData(prev => ({
            ...prev,
            spk_bobot_visual: val,
            spk_bobot_soft: 100 - val
        }));
    };

    // ✅ QUICK PRESETS
    const applyPreset = (type: 'strict' | 'balanced' | 'relaxed') => {
        if (type === 'strict') {
            setFormData(prev => ({ ...prev, spk_threshold_siap: "90", spk_threshold_pantau: "80", spk_bobot_visual: 70, spk_bobot_soft: 30 }));
            toast.info("Mode Ketat Diterapkan", { description: "Standar kelulusan dinaikkan." });
        } else if (type === 'balanced') {
            setFormData(prev => ({ ...prev, spk_threshold_siap: "85", spk_threshold_pantau: "75", spk_bobot_visual: 60, spk_bobot_soft: 40 }));
            toast.info("Mode Seimbang Diterapkan", { description: "Standar default sistem." });
        } else {
            setFormData(prev => ({ ...prev, spk_threshold_siap: "75", spk_threshold_pantau: "60", spk_bobot_visual: 50, spk_bobot_soft: 50 }));
            toast.info("Mode Santai Diterapkan", { description: "Standar kelulusan diturunkan." });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        router.post('/pengajar/pengaturan', formData, {
            onSuccess: () => {
                setIsSaving(false);
                toast.success("Konfigurasi Tersimpan", { description: "Sistem telah diperbarui." });
            },
            onError: () => setIsSaving(false)
        });
    };

    return (
        <div className="flex min-h-screen bg-background font-sans text-foreground">
            <Head title="Pengaturan Sistem" />
            <div className="hidden md:block"><SidebarPengajar /></div>
            <Toaster position="top-right" theme="light" />

            <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#FAFAF9]">
                <HeaderPengajar />
                
                <div className="flex-1 overflow-y-auto p-6 md:p-10">
                    <div className="max-w-5xl mx-auto pb-24 space-y-8">
                        
                        {/* HEADER */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 className="text-4xl font-black text-foreground mb-1 tracking-tight flex items-center gap-3">
                                    Control Center <Settings2 className="text-primary animate-spin-slow" />
                                </h1>
                                <p className="text-muted-foreground text-lg font-medium">Pusat kendali logika penilaian dan identitas aplikasi.</p>
                            </div>
                            <Button 
                                onClick={handleSubmit} 
                                disabled={isSaving}
                                className="h-14 px-8 rounded-2xl font-bold bg-primary text-primary-foreground shadow-xl shadow-orange-200 hover:bg-primary/90 hover:scale-105 transition-all"
                            >
                                {isSaving ? <RefreshCcw className="animate-spin mr-2"/> : <Save className="mr-2"/>}
                                Simpan Konfigurasi
                            </Button>
                        </div>

                        {/* TABS */}
                        <Tabs defaultValue="spk" className="space-y-8">
                            <TabsList className="bg-white p-1.5 rounded-[1.5rem] border border-border h-auto inline-flex shadow-sm gap-2">
                                <TabsTrigger value="spk" className="rounded-2xl px-6 py-3 font-bold data-[state=active]:bg-orange-50 data-[state=active]:text-primary text-muted-foreground text-base transition-all">
                                    <Sliders size={18} className="mr-2"/> Logika SPK
                                </TabsTrigger>
                                <TabsTrigger value="umum" className="rounded-2xl px-6 py-3 font-bold data-[state=active]:bg-orange-50 data-[state=active]:text-primary text-muted-foreground text-base transition-all">
                                    <LayoutTemplate size={18} className="mr-2"/> Umum
                                </TabsTrigger>
                            </TabsList>

                            {/* === TAB 1: LOGIKA SPK === */}
                            <TabsContent value="spk" className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                                
                                {/* ⚡ QUICK PRESETS BAR */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div 
                                        onClick={() => applyPreset('strict')}
                                        className="p-5 bg-white border-2 border-border rounded-[2rem] cursor-pointer hover:border-red-400 hover:bg-red-50 transition-all group relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity"><Zap size={64} className="text-red-500"/></div>
                                        <div className="flex items-center justify-between mb-2">
                                            <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200 font-bold px-3 py-1">Mode Ketat</Badge>
                                        </div>
                                        <p className="text-sm text-slate-600 font-medium leading-relaxed">Ambang batas tinggi (90). Fokus Technical Skill (70%).</p>
                                    </div>
                                    
                                    <div 
                                        onClick={() => applyPreset('balanced')}
                                        className="p-5 bg-white border-2 border-primary rounded-[2rem] cursor-pointer bg-orange-50/50 shadow-md shadow-orange-100 relative overflow-hidden group"
                                    >
                                        <div className="absolute top-0 right-0 p-3 opacity-10"><CheckCircle2 size={64} className="text-primary"/></div>
                                        <div className="flex items-center justify-between mb-2">
                                            <Badge className="bg-primary hover:bg-primary font-bold px-3 py-1">Rekomendasi</Badge>
                                        </div>
                                        <p className="text-sm text-slate-700 font-bold leading-relaxed">Standar industri (85). Bobot Seimbang (60/40).</p>
                                    </div>
                                    
                                    <div 
                                        onClick={() => applyPreset('relaxed')}
                                        className="p-5 bg-white border-2 border-border rounded-[2rem] cursor-pointer hover:border-green-400 hover:bg-green-50 transition-all group relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity"><ShieldCheck size={64} className="text-green-500"/></div>
                                        <div className="flex items-center justify-between mb-2">
                                            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 font-bold px-3 py-1">Mode Pemula</Badge>
                                        </div>
                                        <p className="text-sm text-slate-600 font-medium leading-relaxed">Lebih mudah lulus (75). Bobot rata (50/50).</p>
                                    </div>
                                </div>

                                {/* Slider Bobot */}
                                <Card className="rounded-[2.5rem] border-2 border-border/60 shadow-sm overflow-hidden bg-white">
                                    <CardHeader className="p-8 pb-2">
                                        <CardTitle className="text-2xl font-black flex items-center gap-2"><Percent size={24} className="text-blue-500"/> Distribusi Bobot Nilai</CardTitle>
                                        <CardDescription className="text-base font-medium">Tentukan prioritas penilaian antara Skill Visual (Hasil Jadi) dan Soft Skill (Sikap).</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-8 pt-6">
                                        <div className="bg-slate-100 rounded-3xl p-2 relative h-20 flex items-center mb-4 border-2 border-slate-200 shadow-inner">
                                            <div 
                                                className="h-full rounded-2xl bg-gradient-to-r from-blue-600 to-blue-400 shadow-lg shadow-blue-200 flex items-center justify-start px-6 text-white font-black text-xl transition-all duration-300 relative z-10"
                                                style={{ width: `${formData.spk_bobot_visual}%` }}
                                            >
                                                VISUAL {formData.spk_bobot_visual}%
                                            </div>
                                            <div className="absolute inset-y-2 right-2 left-2 flex items-center justify-end px-6 text-slate-500 font-black text-xl pointer-events-none">
                                                SOFT SKILL {formData.spk_bobot_soft}%
                                            </div>
                                            <input 
                                                type="range" min="10" max="90" 
                                                value={formData.spk_bobot_visual} 
                                                onChange={(e) => handleBobotChange(parseInt(e.target.value))}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                                            />
                                        </div>
                                        <div className="flex justify-between text-sm font-bold text-muted-foreground px-2">
                                            <span>Lebih ke Teknis 🛠️</span>
                                            <span>Seimbang ⚖️</span>
                                            <span>Lebih ke Sikap 🤝</span>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Threshold Inputs */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <ThresholdCard 
                                        title="Ambang Batas LULUS" 
                                        value={formData.spk_threshold_siap} 
                                        onChange={(v:any) => handleChange('spk_threshold_siap', v)}
                                        theme="green"
                                        icon={Award}
                                        desc="Nilai minimum agar siswa dinyatakan SIAP PKL."
                                    />
                                    <ThresholdCard 
                                        title="Ambang Batas REMEDIAL" 
                                        value={formData.spk_threshold_pantau} 
                                        onChange={(v:any) => handleChange('spk_threshold_pantau', v)}
                                        theme="yellow"
                                        icon={AlertTriangle}
                                        desc="Nilai di bawah ini butuh pendampingan khusus."
                                    />
                                </div>
                            </TabsContent>

                            {/* === TAB 2: UMUM === */}
                            <TabsContent value="umum" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <Card className="rounded-[2.5rem] border-2 border-border shadow-sm bg-white">
                                    <CardHeader className="p-8 pb-4 border-b border-border/50">
                                        <CardTitle className="text-2xl font-black">Identitas Aplikasi</CardTitle>
                                        <CardDescription className="text-base font-medium">Informasi ini akan muncul di dashboard dan sertifikat siswa.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-8 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <Label className="font-bold text-base ml-1">Nama Aplikasi / Institusi</Label>
                                                <div className="relative group">
                                                    <LayoutTemplate className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20}/>
                                                    <Input value={formData.app_name} onChange={(e) => handleChange('app_name', e.target.value)} className="pl-12 h-14 rounded-2xl border-2 text-lg font-medium shadow-sm transition-all focus:ring-4 focus:ring-primary/10"/>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="font-bold text-base ml-1">Nama Penanda Tangan (Sertifikat)</Label>
                                                <div className="relative group">
                                                    <PenTool className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20}/>
                                                    <Input value={formData.instructor_name} onChange={(e) => handleChange('instructor_name', e.target.value)} className="pl-12 h-14 rounded-2xl border-2 text-lg font-medium shadow-sm transition-all focus:ring-4 focus:ring-primary/10"/>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>

                    </div>
                </div>
            </main>
        </div>
    );
}

// Sub Component Card Threshold (Reusable)
function ThresholdCard({ title, value, onChange, theme, desc, icon: Icon }: any) {
    const themeClass = theme === 'green' ? 'border-emerald-100 bg-emerald-50/40' : 'border-amber-100 bg-amber-50/40';
    const textClass = theme === 'green' ? 'text-emerald-700' : 'text-amber-700';
    const ringClass = theme === 'green' ? 'focus:border-emerald-400 focus:ring-emerald-400/20' : 'focus:border-amber-400 focus:ring-amber-400/20';
    const bgIcon = theme === 'green' ? 'bg-emerald-100' : 'bg-amber-100';

    return (
        <div className={`p-6 rounded-[2.5rem] border-2 transition-all hover:shadow-lg ${themeClass}`}>
            <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-xl ${bgIcon}`}>
                    <Icon className={textClass} size={24}/>
                </div>
                <h3 className={`font-black text-xl ${textClass}`}>{title}</h3>
            </div>
            <div className="flex items-center gap-6">
                <Input 
                    type="number" 
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`h-20 w-36 text-5xl font-black text-center border-4 border-white bg-white/80 shadow-sm rounded-[2rem] tracking-tighter transition-all ${textClass} ${ringClass}`}
                />
                <p className={`text-sm font-bold leading-tight opacity-80 max-w-[150px] ${textClass}`}>{desc}</p>
            </div>
        </div>
    );
}