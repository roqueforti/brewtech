import { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Heart, ArrowRight, CheckCircle2, Globe, Users, Coffee, Smartphone, Zap,
    Instagram, Mail, Star, Lock, User, Eye, EyeOff, ChevronRight, BarChart3, 
    ClipboardCheck, FileSpreadsheet, MapPin, Briefcase, BookOpen, Target, Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- TIPE DATA ---
interface Student { id: number; name: string; kelas_id: number; }
interface KelasTheme { bg: string; border: string; text: string; shadow: string; }
interface KelasData { id: number; nama: string; emoji: string; students: Student[]; theme: KelasTheme; }
interface Props { kelasFromDB: KelasData[]; errors: any; }

// --- KOMPONEN HIASAN: SELOTIP (TAPE) ---
const Tape = ({ className }: { className?: string }) => (
    <div className={`absolute h-8 w-24 bg-white/40 backdrop-blur-sm border border-white/50 shadow-sm transform ${className}`}></div>
);

export default function LandingPage({ kelasFromDB, errors }: Props) {
    // --- STATE ---
    const [mode, setMode] = useState<'student' | 'instructor'>('student');
    const [selectedKelas, setSelectedKelas] = useState<number | null>(null);
    const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // --- LOGIC ---
    const kelasList = Array.isArray(kelasFromDB) ? kelasFromDB : [];
    const activeClass = selectedKelas ? kelasList.find(k => k.id === selectedKelas) : null;

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleStudentLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedKelas && selectedStudentId) {
            router.post('/login/student', { kelas_id: selectedKelas, user_id: selectedStudentId });
        }
    };

    const handleInstructorLogin = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/pengajar/login', { email, password });
    };

    return (
        <div className="min-h-screen bg-background font-body text-foreground selection:bg-secondary selection:text-white overflow-x-hidden">
            <Head title="Brewtech - Sociopreneurship & Asesmen Barista" />

            {/* --- BACKGROUND PATTERN (DOTS) --- */}
            <div className="fixed inset-0 bg-dots opacity-20 pointer-events-none z-0"></div>

            {/* --- NAVBAR --- */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md py-3 shadow-md border-b border-white/50' : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    {/* Brand */}
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-[4px_4px_0px_rgba(0,0,0,0.1)] transform -rotate-6 border-2 border-white">
                            <Coffee fill="currentColor" size={24} />
                        </div>
                        <div>
                            <span className={`block text-2xl font-display font-black tracking-tight leading-none text-foreground drop-shadow-sm`}>
                                BREWTECH
                            </span>
                            <span className="text-[10px] font-bold text-secondary bg-white px-1 rounded uppercase tracking-widest">
                                for Disability Barista
                            </span>
                        </div>
                    </div>
                    
                    {/* Menu */}
                    <div className="hidden md:flex gap-6 items-center text-sm font-bold text-muted-foreground bg-white/50 px-6 py-2 rounded-full backdrop-blur-sm border border-white">
                        <a href="#latar-belakang" className="hover:text-secondary transition-colors">Latar Belakang</a>
                        <a href="#fitur" className="hover:text-secondary transition-colors">Fitur Utama</a>
                        <a href="#sdgs" className="hover:text-secondary transition-colors">Dampak SDGs</a>
                    </div>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            {/* PERUBAHAN UTAMA DISINI: 
                1. h-screen (Tinggi pas 1 layar)
                2. pt-24 (Jarak atas secukupnya utk navbar) 
                3. lg:pt-0 (Di desktop, biar flexbox yang atur posisi tengah vertikal)
            */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden bg-accent/30 pt-24 lg:pt-0">
                
                {/* Background Blobs */}
                <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>

                {/* Doodle SVG */}
                <svg className="absolute bottom-10 right-10 w-64 h-64 text-secondary/30 pointer-events-none animate-pulse" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path fill="currentColor" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-5.3C93.5,8.6,82.2,21.5,70.6,32.3C59,43.1,47.1,51.8,34.7,59.3C22.3,66.8,9.4,73.1,-2.3,77.1C-14,81.1,-24.5,82.8,-35.1,77.2C-45.7,71.6,-56.4,58.7,-65.4,45.4C-74.4,32.1,-81.7,18.4,-82.5,4.3C-83.3,-9.8,-77.6,-24.3,-68.2,-36.1C-58.8,-47.9,-45.7,-57,-32.5,-64.7C-19.3,-72.4,-6,-78.7,6.3,-89.6L44.7,-76.4Z" transform="translate(100 100)" />
                </svg>

                <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
                    
                    {/* KIRI: NARASI UTAMA */}
                    <div className="lg:col-span-7 space-y-6 lg:space-y-8 animate-in slide-in-from-left-10 duration-1000 fade-in">
                        
                        {/* Sticker Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-primary text-primary font-black text-xs uppercase tracking-widest shadow-[4px_4px_0px_#5BCCEA] transform -rotate-2">
                            <MapPin size={16} className="text-secondary" /> SLB YPAC Kota Malang
                        </div>
                        
                        {/* HEADLINE */}
                        <h1 className="font-display text-4xl lg:text-6xl font-black leading-[1.1] tracking-tight text-slate-900 drop-shadow-sm mt-2">
                            Integrasi <br/>
                            <span 
                                className="relative inline-block text-white transform -rotate-1 mx-1 my-1"
                                style={{ 
                                    textShadow: '3px 3px 0 #5BCCEA, -3px -3px 0 #5BCCEA, 3px -3px 0 #5BCCEA, -3px 3px 0 #5BCCEA, 3px 0 0 #5BCCEA, -3px 0 0 #5BCCEA, 0 3px 0 #5BCCEA, 0 -3px 0 #5BCCEA' 
                                }}
                            >
                                Pembelajaran
                            </span> 
                            <br/>
                            & Asesmen <span className="inline-block bg-secondary text-white px-4 py-1 ml-1 transform rotate-2 rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,0.1)] border-4 border-white text-3xl lg:text-5xl">Barista</span>
                        </h1>
                        
                        {/* SUBHEAD */}
                        <div className="relative bg-white/60 p-5 rounded-3xl border-2 border-dashed border-primary/50 backdrop-blur-sm max-w-xl">
                            <p className="text-lg text-foreground/90 leading-relaxed font-bold font-body">
                                <strong>BREWTECH</strong> hadir sebagai solusi inovatif untuk mendorong <em>Sociopreneurship</em> teman-teman disabilitas.
                            </p>
                            <p className="text-sm text-muted-foreground mt-2 font-medium">
                                Mencetak lulusan yang siap kerja dan mandiri secara ekonomi melalui teknologi yang inklusif.
                            </p>
                            {/* Hiasan Bintang */}
                            <Sparkles className="absolute -top-4 -right-4 text-secondary w-8 h-8 fill-current animate-bounce" />
                        </div>

                        {/* Supported By Logos */}
                        {/* Supported By Logos */}
                        <div className="pt-2 hidden lg:block">
                            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-3 bg-primary/10 inline-block px-2 py-1 rounded">Didukung Oleh:</p>
                            <div className="flex flex-wrap items-center gap-6 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                                
                                {/* 1. DANANTARA (Instansi Utama) */}
                                <img 
                                    src="/images/Logo Danantara.png" 
                                    alt="Danantara" 
                                    // PERUBAHAN: Menggunakan h-12 agar tingginya sama
                                    className="h-12 w-auto object-contain hover:scale-105 transition-transform duration-300"
                                />
                                
                                {/* 2. INNOVILLAGE */}
                                <img 
                                    src="/images/Logo Innovillage.webp" 
                                    alt="Innovillage" 
                                    // PERUBAHAN: Menggunakan h-12 agar tingginya sama
                                    className="h-12 w-auto object-contain hover:scale-105 transition-transform duration-300"
                                />

                                {/* 3. TELKOM UNIVERSITY */}
                                <img 
                                    src="/images/Logo Telkom University.png" 
                                    alt="Telkom University" 
                                    // PERUBAHAN: Menggunakan h-12 agar tingginya sama
                                    className="h-12 w-auto object-contain hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                        </div>
                    </div>

                    {/* KANAN: LOGIN CARD (POLAROID STYLE) */}
                    <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
                        {/* Tape Hiasan */}
                        <Tape className="-top-4 left-1/2 -translate-x-1/2 -rotate-3 z-20" />
                        
                        {/* Main Card */}
                        <div className="w-full max-w-md bg-white p-3 pb-6 rounded-[2rem] shadow-2xl border-4 border-white ring-1 ring-black/5 transform rotate-2 hover:rotate-0 transition-transform duration-500 relative z-10">
                            
                            {/* Inner Blue Container */}
                            <div className="bg-primary/10 rounded-[1.5rem] border-2 border-primary/20 p-5 relative overflow-hidden">
                                
                                {/* Header Login */}
                                <div className="text-center mb-4">
                                    <h3 className="font-display text-2xl font-black text-foreground">Login Area</h3>
                                    <p className="font-body text-xs font-bold text-secondary">Silakan masuk untuk memulai!</p>
                                </div>

                                {/* Tab Switcher */}
                                <div className="flex bg-white p-1 mb-4 rounded-full border-2 border-primary/20 shadow-inner">
                                    <button 
                                        onClick={() => setMode('student')}
                                        className={`flex-1 py-2 text-xs font-black rounded-full transition-all flex items-center justify-center gap-2 ${mode === 'student' ? 'bg-secondary text-white shadow-md transform scale-105' : 'text-muted-foreground hover:text-primary'}`}
                                    >
                                        <User size={14}/> Siswa
                                    </button>
                                    <button 
                                        onClick={() => setMode('instructor')}
                                        className={`flex-1 py-2 text-xs font-black rounded-full transition-all flex items-center justify-center gap-2 ${mode === 'instructor' ? 'bg-secondary text-white shadow-md transform scale-105' : 'text-muted-foreground hover:text-primary'}`}
                                    >
                                        <ClipboardCheck size={14}/> Penilai
                                    </button>
                                </div>

                                {/* Form Content */}
                                <div className="min-h-[220px] flex flex-col justify-center bg-white/50 rounded-2xl p-4 border border-white">
                                    {mode === 'student' ? (
                                        <div className="space-y-3">
                                            {!selectedKelas ? (
                                                <div className="space-y-2 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
                                                    {kelasList.length > 0 ? kelasList.map((k) => (
                                                        <button key={k.id} onClick={() => { setSelectedKelas(k.id); setSelectedStudentId(null); }}
                                                            className="w-full p-3 rounded-xl border-2 border-primary/20 bg-white hover:bg-primary/10 hover:border-primary hover:shadow-sm transition-all flex items-center gap-3 group text-left transform active:scale-95"
                                                        >
                                                            <span className="text-xl">{k.emoji}</span>
                                                            <div className="flex-1">
                                                                <h4 className="font-display font-bold text-foreground text-sm">{k.nama}</h4>
                                                                <p className="text-[10px] font-bold text-muted-foreground uppercase">Masuk Kelas</p>
                                                            </div>
                                                            <ChevronRight className="text-primary w-4 h-4"/>
                                                        </button>
                                                    )) : (
                                                        <div className="text-center py-6 text-muted-foreground text-xs font-bold border-2 border-dashed border-primary/30 rounded-2xl bg-white/50">
                                                            Belum ada data 😔
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="space-y-3 animate-in zoom-in duration-300">
                                                    <div className="flex items-center justify-between p-2 bg-white rounded-xl border-2 border-primary shadow-sm">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xl">{activeClass?.emoji}</span>
                                                            <div>
                                                                <p className="text-[9px] uppercase font-black text-secondary">Kelas Terpilih</p>
                                                                <p className="font-display font-bold text-foreground text-sm">{activeClass?.nama}</p>
                                                            </div>
                                                        </div>
                                                        <button onClick={() => setSelectedKelas(null)} className="text-[10px] font-black text-destructive underline decoration-2 hover:no-underline">Ganti</button>
                                                    </div>

                                                    <div>
                                                        <p className="text-[10px] font-black text-primary uppercase mb-1 ml-1">Pilih Namamu:</p>
                                                        <div className="grid grid-cols-2 gap-2 max-h-[120px] overflow-y-auto pr-1 custom-scrollbar">
                                                            {activeClass?.students?.map((s) => (
                                                                <button key={s.id} onClick={() => setSelectedStudentId(s.id)}
                                                                    className={`p-2 rounded-lg text-xs font-bold border-2 transition-all ${selectedStudentId === s.id ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white text-muted-foreground border-primary/20 hover:border-primary'}`}
                                                                >
                                                                    {s.name}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <button onClick={handleStudentLogin} disabled={!selectedStudentId}
                                                        className={`w-full py-2.5 rounded-xl font-display font-black text-base text-white shadow-lg transition-all flex items-center justify-center gap-2 ${selectedStudentId ? 'bg-secondary hover:bg-secondary/90 shadow-[0px_3px_0px_#C2185B] transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-none' : 'bg-gray-300 cursor-not-allowed'}`}
                                                    >
                                                        Mulai Belajar <ArrowRight size={16} strokeWidth={3}/>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <form onSubmit={handleInstructorLogin} className="space-y-3 animate-in fade-in slide-in-from-right-4">
                                            <div className="space-y-2">
                                                <div>
                                                    <label className="block text-[10px] font-black text-primary mb-1 uppercase tracking-wider">Email</label>
                                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                                        className="w-full px-3 py-2 rounded-xl border-2 border-primary/30 focus:border-secondary focus:ring-0 outline-none transition-all text-xs bg-white font-bold text-foreground placeholder:text-muted-foreground/50 shadow-sm"
                                                        placeholder="admin@ypac.org"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-black text-primary mb-1 uppercase tracking-wider">Password</label>
                                                    <div className="relative">
                                                        <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                                                            className="w-full px-3 py-2 rounded-xl border-2 border-primary/30 focus:border-secondary focus:ring-0 outline-none transition-all text-xs bg-white font-bold text-foreground placeholder:text-muted-foreground/50 shadow-sm"
                                                            placeholder="••••••••"
                                                        />
                                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-secondary">
                                                            {showPassword ? <EyeOff size={14}/> : <Eye size={14}/>}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {errors.email && (
                                                <div className="p-2 bg-destructive/10 border-2 border-destructive/20 rounded-lg text-destructive text-[10px] font-bold text-center">
                                                    {errors.email}
                                                </div>
                                            )}

                                            <button type="submit" className="w-full py-2.5 rounded-xl font-display font-black text-base text-white bg-primary hover:bg-primary/90 transition-all shadow-[0px_3px_0px_#2D8EAA] transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-none">
                                                Masuk Dashboard
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        {/* Kamera Icon Decor (Sticker) */}
                        <div className="absolute -bottom-6 -left-6 bg-white p-2 rounded-2xl shadow-xl transform rotate-12 border-4 border-white z-20 hidden lg:block scale-75 origin-top-right">
                            <div className="bg-gray-800 p-3 rounded-xl">
                                <div className="w-12 h-12 rounded-full border-4 border-gray-600 bg-gray-900 relative">
                                    <div className="absolute top-2 right-2 w-3 h-3 bg-white/50 rounded-full"></div>
                                </div>
                            </div>
                            <Sparkles className="absolute -top-6 -right-4 text-secondary fill-current w-10 h-10" />
                        </div>
                    </div>

                </div>
            </section>

            {/* --- SEKSI BACKGROUND (POLAROID GRID) --- */}
            <section id="latar-belakang" className="py-24 bg-white relative overflow-hidden">
                <div className="absolute top-0 w-full h-8 bg-background" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 0)' }}></div>
                
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="order-2 lg:order-1 relative">
                        <Tape className="-top-4 -left-4 -rotate-12"/>
                        <div className="bg-background p-8 rounded-[3rem] border-4 border-dashed border-primary/30 relative">
                            <span className="inline-block bg-secondary text-white font-display font-black tracking-widest uppercase text-sm px-4 py-2 rounded-lg transform -rotate-2 shadow-md mb-4">Latar Belakang</span>
                            <h2 className="font-display text-4xl md:text-5xl font-black text-foreground mb-6 leading-tight">
                                Menjawab <span className="text-primary underline decoration-wavy decoration-secondary">Tantangan</span> <br/>Kesiapan Kerja.
                            </h2>
                            <p className="text-lg text-foreground/80 leading-relaxed mb-6 font-bold font-body">
                                Keterbatasan media pembelajaran berbasis teknologi serta minimnya akses terhadap sistem penilaian keterampilan yang objektif menjadi kendala utama.
                            </p>
                            
                            <div className="p-6 bg-white rounded-2xl border-2 border-foreground/5 shadow-[4px_4px_0px_hsl(var(--primary))]">
                                <h4 className="font-display font-black text-secondary mb-3 flex items-center gap-2 text-xl"><Target className="fill-secondary text-white" size={24}/> Tujuan Utama:</h4>
                                <ul className="space-y-3 text-sm text-foreground font-bold font-body">
                                    <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary"></div> Media pembelajaran interaktif yang mandiri.</li>
                                    <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary"></div> Alat asesmen digital yang objektif.</li>
                                    <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary"></div> Mendorong sociopreneurship.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div className="order-1 lg:order-2 grid grid-cols-2 gap-4 rotate-2">
                        {[
                            { icon: BookOpen, title: "Quality Education", desc: "Pembelajaran inklusif.", color: "bg-primary text-white" },
                            { icon: Briefcase, title: "Decent Work", desc: "Pekerjaan layak.", color: "bg-white text-foreground border-2 border-primary" },
                            { icon: Users, title: "Reduced Inequalities", desc: "Mengurangi kesenjangan.", color: "bg-white text-foreground border-2 border-secondary" },
                            { icon: Globe, title: "Indonesia Inklusif", desc: "Kemandirian disabilitas.", color: "bg-secondary text-white" }
                        ].map((item, i) => (
                            <div key={i} className={`${item.color} p-6 rounded-[2rem] shadow-lg flex flex-col justify-center items-center text-center transform transition-transform hover:scale-105 hover:rotate-2 ${i%2!==0 ? 'mt-8' : ''}`}>
                                <item.icon size={32} className={`mb-3`}/>
                                <h4 className="font-display font-black text-lg leading-tight">{item.title}</h4>
                                <p className="text-xs font-bold mt-1 opacity-80">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- FITUR UTAMA (CARDS) --- */}
            <section id="fitur" className="py-24 bg-primary/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16 relative">
                        <Tape className="-top-6 left-1/2 -translate-x-1/2 rotate-2"/>
                        <span className="inline-block bg-white text-primary border-2 border-primary font-black tracking-widest uppercase text-sm px-6 py-2 rounded-full shadow-sm">Fitur Unggulan</span>
                        <h2 className="font-display text-4xl md:text-5xl font-black text-foreground mt-6 mb-4 leading-tight">
                            Solusi Digital <br/><span className="text-secondary">Terintegrasi.</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: <Smartphone size={32} />, title: "Interactive Learning", desc: "Modul visual & audio yang mudah dipahami." },
                            { icon: <ClipboardCheck size={32} />, title: "Digital Assessment", desc: "Penilaian hard skill & soft skill terukur." },
                            { icon: <BarChart3 size={32} />, title: "Talent Pool", desc: "Database kompetensi siap kerja untuk industri." }
                        ].map((item, idx) => (
                            <div key={idx} className={`bg-white p-8 rounded-[2.5rem] border-4 border-white shadow-xl hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2`}>
                                <div className={`w-16 h-16 bg-background rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors border-2 border-primary/10 group-hover:border-primary group-hover:rotate-6`}>
                                    {item.icon}
                                </div>
                                <h3 className="font-display text-xl font-black text-foreground mb-3">{item.title}</h3>
                                <p className="text-muted-foreground leading-relaxed font-bold text-sm">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- DAMPAK SDGs (Polaroid Style) --- */}
            <section id="sdgs" className="py-24 bg-foreground text-background relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-primary font-black tracking-widest uppercase text-sm bg-primary/10 px-3 py-1 rounded">Dampak Global</span>
                            <h2 className="font-display text-4xl font-black text-white mt-4 mb-6">Mendukung SDGs & Inklusi Sosial</h2>
                            <p className="text-white/80 text-lg leading-relaxed mb-6 font-bold font-body">
                                Proyek ini dirancang selaras dengan Undang-Undang No. 8 Tahun 2016 tentang Penyandang Disabilitas.
                            </p>
                            
                            <div className="flex flex-col gap-4">
                                {["Quality Education", "Decent Work", "Reduced Inequalities"].map((txt, i) => (
                                    <div key={i} className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/10">
                                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white shadow-lg">
                                            <CheckCircle2 size={16} strokeWidth={4}/>
                                        </div>
                                        <span className="font-display font-bold text-white tracking-wide text-lg">{txt}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {/* Polaroid Photo Frame */}
                        <div className="relative transform rotate-3 hover:rotate-0 transition-transform duration-500">
                            <Tape className="-top-4 right-1/2 translate-x-1/2 rotate-2"/>
                            <div className="bg-white p-4 pb-16 rounded shadow-2xl">
                                <div className="bg-gray-200 rounded overflow-hidden aspect-video relative">
                                    <img 
                                        src="/images/DSC00450.jpg" alt="Inclusivity"
                                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                    />
                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
                                </div>
                                <div className="absolute bottom-4 left-0 w-full text-center">
                                    <p className="font-handwriting font-black text-gray-400 text-sm tracking-widest uppercase">Inclusivity in Action</p>
                                </div>
                            </div>
                            {/* Sticker Flower */}
                            <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-white border-4 border-white shadow-lg animate-spin-slow">
                                <Heart fill="currentColor" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="bg-background text-foreground py-12 border-t-4 border-dashed border-primary/20">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-3 mb-6 bg-white px-6 py-3 rounded-full shadow-sm border border-border">
                        <Coffee size={20} className="text-primary fill-current"/>
                        <span className="font-display font-black text-xl tracking-tight">BREWTECH</span>
                    </div>
                    <p className="font-body font-bold text-muted-foreground mb-8">
                        &copy; 2026 Mandala Pure Love. Innovillage Team.
                    </p>
                    <div className="flex justify-center gap-6">
                        {[Instagram, Globe, Mail].map((Icon, i) => (
                            <a key={i} href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-all shadow-sm border border-border">
                                <Icon size={18}/>
                            </a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
}