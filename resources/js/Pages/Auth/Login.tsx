import { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Heart, ArrowRight, CheckCircle2, Globe, Users, Coffee, Smartphone, Zap,
    Instagram, Mail, Star, Lock, User, Eye, EyeOff, ChevronRight, BarChart3, 
    ClipboardCheck, FileSpreadsheet, MapPin, Briefcase, BookOpen, Target
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- TIPE DATA DARI DATABASE ---
interface Student { id: number; name: string; kelas_id: number; }
interface KelasTheme { bg: string; border: string; text: string; shadow: string; }
interface KelasData { id: number; nama: string; emoji: string; students: Student[]; theme: KelasTheme; }
interface Props { kelasFromDB: KelasData[]; errors: any; }

export default function LandingPage({ kelasFromDB, errors }: Props) {
    // --- STATE LOGIN & UI ---
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
        <div className="min-h-screen bg-[#FFF8E1] font-sans text-[#3E2723] selection:bg-orange-500 selection:text-white overflow-x-hidden">
            <Head title="Brewtech - Sociopreneurship & Asesmen Barista" />

            {/* --- NAVBAR --- */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#3E2723]/95 backdrop-blur-md py-4 shadow-lg border-b border-white/10' : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    {/* Brand: Brewtech */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-600/20">
                            <Coffee fill="currentColor" size={20} />
                        </div>
                        <div>
                            <span className={`block text-xl font-black tracking-tighter leading-none text-white`}>
                                BREWTECH
                            </span>
                            <span className="text-[10px] font-medium text-orange-200 uppercase tracking-widest">
                                for SLB YPAC Malang
                            </span>
                        </div>
                    </div>
                    
                    {/* Menu */}
                    <div className="hidden md:flex gap-8 items-center text-sm font-medium text-slate-300">
                        <a href="#latar-belakang" className="hover:text-orange-400 transition-colors">Latar Belakang</a>
                        <a href="#fitur" className="hover:text-orange-400 transition-colors">Fitur Utama</a>
                        <a href="#sdgs" className="hover:text-orange-400 transition-colors">Dampak SDGs</a>
                    </div>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <section className="relative min-h-[110vh] lg:min-h-screen flex items-center pt-32 pb-20 lg:pt-0 lg:pb-0 overflow-hidden bg-[#2D1B18]">
                
                {/* Background Image & Overlay */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=1974&auto=format&fit=crop" 
                        alt="Coffee Brewing Background" 
                        className="w-full h-full object-cover opacity-40 mix-blend-overlay" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#2D1B18] via-[#2D1B18]/90 to-[#2D1B18]/60"></div>
                    <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-[#FFF8E1] to-transparent"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                    
                    {/* KIRI: NARASI UTAMA (7 Kolom) */}
                    <div className="lg:col-span-7 text-white space-y-8 animate-in slide-in-from-left-10 duration-1000 fade-in">
                        
                        {/* Location Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-300 font-bold text-xs uppercase tracking-widest backdrop-blur-md">
                            <MapPin size={14} /> SLB YPAC Kota Malang
                        </div>
                        
                        {/* HEADLINE: Integrasi Pembelajaran & Asesmen */}
                        <h1 className="text-4xl lg:text-6xl font-black leading-[1.1] tracking-tight text-white drop-shadow-lg">
                            Integrasi Pembelajaran <br/>
                            & Asesmen <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">Barista Disabilitas.</span>
                        </h1>
                        
                        {/* SUBHEAD: Mendorong Sociopreneurship */}
                        <div className="border-l-4 border-orange-600 pl-6 space-y-4">
                            <p className="text-lg text-white/90 leading-relaxed max-w-2xl font-medium">
                                <strong>BREWTECH</strong> hadir sebagai solusi inovatif berbasis aplikasi mobile untuk mendorong <em>Sociopreneurship</em> di SLB YPAC Kota Malang.
                            </p>
                            <p className="text-sm text-white/60 leading-relaxed max-w-2xl">
                                Menjembatani proses pembelajaran keterampilan dan asesmen kerja yang objektif, guna mencetak lulusan yang siap kerja dan mandiri secara ekonomi.
                            </p>
                        </div>

                        {/* Supported By Logos */}
                        <div className="pt-8 border-t border-white/10">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Didukung Oleh:</p>
                            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 opacity-80 grayscale hover:grayscale-0 transition-all duration-500">
                                <span className="text-white font-bold text-lg tracking-tight">Innovillage</span>
                                <span className="text-white font-bold text-lg tracking-tight">Telkom University</span>
                                <span className="text-white font-bold text-lg tracking-tight">Telkom Indonesia</span>
                                <span className="text-white font-black text-lg tracking-tight">DANANTARA</span>
                            </div>
                        </div>
                    </div>

                    {/* KANAN: FLOATING LOGIN CARD */}
                    <div className="lg:col-span-5 relative animate-in slide-in-from-bottom-10 duration-1000 fade-in delay-200">
                        
                        <div className="flex justify-end mb-3 items-center gap-2">
                            <span className="text-[10px] font-bold text-orange-200 uppercase tracking-widest px-2 py-1 bg-orange-900/40 rounded border border-orange-500/30 backdrop-blur-sm">Aplikasi Asesmen</span>
                            <h3 className="text-xl font-black text-white tracking-tight drop-shadow-md">Akses Sistem</h3>
                        </div>

                        {/* Glass Card Container */}
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-2 rounded-[2rem] shadow-2xl ring-1 ring-white/10">
                            {/* Inner Card */}
                            <div className="bg-[#FFF8E1] rounded-[1.5rem] overflow-hidden shadow-inner border border-white/50">
                                
                                {/* Tab Switcher */}
                                <div className="flex bg-[#F5E6CA] p-1.5 m-1.5 rounded-2xl">
                                    <button 
                                        onClick={() => setMode('student')}
                                        className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${mode === 'student' ? 'bg-white text-[#5D4037] shadow-sm ring-1 ring-orange-100' : 'text-[#8D6E63] hover:text-[#5D4037]'}`}
                                    >
                                        <User size={16}/> Siswa
                                    </button>
                                    <button 
                                        onClick={() => setMode('instructor')}
                                        className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${mode === 'instructor' ? 'bg-white text-[#5D4037] shadow-sm ring-1 ring-orange-100' : 'text-[#8D6E63] hover:text-[#5D4037]'}`}
                                    >
                                        <ClipboardCheck size={16}/> Penilai
                                    </button>
                                </div>

                                {/* Form Container */}
                                <div className="p-6 lg:p-8 min-h-[380px] flex flex-col justify-center bg-white">
                                    {mode === 'student' ? (
                                        <div className="space-y-6">
                                            <div className="text-center">
                                                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-orange-600 border-2 border-orange-100 transform rotate-3">
                                                    <Smartphone size={32}/>
                                                </div>
                                                <h3 className="text-xl font-black text-[#5D4037]">Login Siswa</h3>
                                                <p className="text-sm font-medium text-[#8D6E63]">Akses materi dan lihat hasil asesmenmu.</p>
                                            </div>

                                            {!selectedKelas ? (
                                                <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                                    {kelasList.length > 0 ? kelasList.map((k) => (
                                                        <button key={k.id} onClick={() => { setSelectedKelas(k.id); setSelectedStudentId(null); }}
                                                            className="w-full p-4 rounded-2xl border-2 border-orange-100 hover:border-orange-400 hover:bg-orange-50 transition-all flex items-center gap-4 group text-left bg-white"
                                                        >
                                                            <span className="text-2xl bg-orange-50 p-2 rounded-xl shadow-sm border border-orange-100">{k.emoji}</span>
                                                            <div className="flex-1">
                                                                <h4 className="font-bold text-[#5D4037] group-hover:text-orange-700">{k.nama}</h4>
                                                                <p className="text-xs font-bold text-[#8D6E63]">Masuk Kelas Pelatihan</p>
                                                            </div>
                                                            <ChevronRight className="text-orange-200 group-hover:text-orange-500"/>
                                                        </button>
                                                    )) : (
                                                        <div className="text-center py-8 text-[#8D6E63] text-sm border-2 border-dashed border-orange-200 rounded-2xl bg-orange-50">Data kelas belum tersedia</div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                                                    <div className="flex items-center justify-between p-4 bg-orange-50 rounded-2xl border-2 border-orange-100">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-3xl">{activeClass?.emoji}</span>
                                                            <div>
                                                                <p className="text-[10px] uppercase font-bold text-orange-400 tracking-widest">Kelas</p>
                                                                <p className="font-bold text-[#5D4037] text-base">{activeClass?.nama}</p>
                                                            </div>
                                                        </div>
                                                        <button onClick={() => setSelectedKelas(null)} className="text-xs font-bold text-red-400 hover:underline">Ganti</button>
                                                    </div>

                                                    <div>
                                                        <p className="text-sm font-bold text-[#8D6E63] mb-2 ml-1">Pilih Namamu:</p>
                                                        <div className="grid grid-cols-2 gap-2 max-h-[180px] overflow-y-auto pr-1 custom-scrollbar">
                                                            {activeClass?.students?.map((s) => (
                                                                <button key={s.id} onClick={() => setSelectedStudentId(s.id)}
                                                                    className={`p-3 rounded-xl text-sm font-bold border-2 transition-all ${selectedStudentId === s.id ? 'bg-orange-500 text-white border-orange-600 shadow-md' : 'bg-white text-[#8D6E63] border-orange-100 hover:border-orange-300 hover:bg-orange-50'}`}
                                                                >
                                                                    {s.name}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <button onClick={handleStudentLogin} disabled={!selectedStudentId}
                                                        className={`w-full py-4 rounded-xl font-black text-lg text-white shadow-lg transition-all flex items-center justify-center gap-2 ${selectedStudentId ? 'bg-[#5D4037] hover:bg-[#4E342E] hover:shadow-xl transform hover:-translate-y-1' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                                                    >
                                                        Mulai Belajar <ArrowRight size={18}/>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <form onSubmit={handleInstructorLogin} className="space-y-5 animate-in fade-in slide-in-from-right-4">
                                            <div className="text-center">
                                                <div className="w-16 h-16 bg-[#FFF3E0] rounded-2xl flex items-center justify-center mx-auto mb-3 text-[#FF6F00] border-2 border-[#FFE0B2] transform -rotate-3">
                                                    <ClipboardCheck size={32}/>
                                                </div>
                                                <h3 className="text-xl font-black text-[#5D4037]">Login Penilai</h3>
                                                <p className="text-sm font-medium text-[#8D6E63]">Input asesmen & monitoring skill.</p>
                                            </div>
                                            
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-xs font-black text-[#5D4037] mb-2 ml-1 uppercase tracking-wider">Email</label>
                                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                                        className="w-full px-4 py-3 rounded-xl border-2 border-[#D7CCC8] focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm bg-white font-medium text-[#5D4037] placeholder:text-[#BCAAA4]"
                                                        placeholder="admin@ypac-malang.org"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-black text-[#5D4037] mb-2 ml-1 uppercase tracking-wider">Password</label>
                                                    <div className="relative">
                                                        <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                                                            className="w-full px-4 py-3 rounded-xl border-2 border-[#D7CCC8] focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm bg-white font-medium text-[#5D4037] placeholder:text-[#BCAAA4]"
                                                            placeholder="••••••••"
                                                        />
                                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8D6E63] hover:text-[#5D4037]">
                                                            {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {errors.email && (
                                                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold text-center">
                                                    {errors.email}
                                                </div>
                                            )}

                                            <button type="submit" className="w-full py-4 rounded-2xl font-black text-lg text-white bg-[#FF6F00] hover:bg-[#E65100] transition-all shadow-lg hover:shadow-orange-500/30 transform hover:-translate-y-1">
                                                Masuk Dashboard
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        {/* Decorative Glow */}
                        <div className="absolute -top-12 -right-12 w-64 h-64 bg-orange-500/30 rounded-full blur-[80px] pointer-events-none mix-blend-screen"></div>
                    </div>

                </div>
            </section>

            {/* --- LATAR BELAKANG & TUJUAN --- */}
            <section id="latar-belakang" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="order-2 lg:order-1">
                        <span className="text-orange-600 font-black tracking-widest uppercase text-sm bg-orange-50 px-3 py-1 rounded-full">Latar Belakang</span>
                        <h2 className="text-3xl md:text-4xl font-black text-[#3E2723] mt-4 mb-6 leading-tight">
                            Menjawab Tantangan <br/>Kesiapan Kerja.
                        </h2>
                        <p className="text-lg text-[#5D4037] leading-relaxed mb-6 font-medium">
                            Keterbatasan media pembelajaran berbasis teknologi serta minimnya akses terhadap sistem penilaian keterampilan yang objektif menjadi kendala utama di SLB YPAC Kota Malang.
                        </p>
                        <p className="text-[#8D6E63] leading-relaxed mb-6">
                            Brewtech hadir sebagai inovasi yang menjembatani proses pembelajaran dan asesmen. Memastikan setiap siswa mendapatkan pelatihan yang relevan, terukur, dan berkelanjutan.
                        </p>
                        
                        <div className="p-6 bg-[#FFF8E1] rounded-2xl border border-[#FFE0B2]">
                            <h4 className="font-bold text-[#E65100] mb-2 flex items-center gap-2"><Target size={18}/> Tujuan Utama:</h4>
                            <ul className="space-y-2 text-sm text-[#5D4037] font-medium">
                                <li>✅ Media pembelajaran interaktif yang mandiri.</li>
                                <li>✅ Alat asesmen digital yang objektif dan terintegrasi.</li>
                                <li>✅ Mendorong kemandirian ekonomi & sociopreneurship.</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="order-1 lg:order-2 grid grid-cols-2 gap-4">
                        <div className="bg-orange-50 p-6 rounded-[2rem] border border-orange-100 flex flex-col justify-center items-center text-center">
                            <BookOpen size={40} className="text-orange-500 mb-4"/>
                            <h4 className="font-bold text-[#3E2723]">Quality Education</h4>
                            <p className="text-xs text-[#8D6E63] mt-1">Pembelajaran inklusif & merata.</p>
                        </div>
                        <div className="bg-green-50 p-6 rounded-[2rem] border border-green-100 flex flex-col justify-center items-center text-center mt-8">
                            <Briefcase size={40} className="text-green-600 mb-4"/>
                            <h4 className="font-bold text-[#3E2723]">Decent Work</h4>
                            <p className="text-xs text-[#8D6E63] mt-1">Pekerjaan layak & pertumbuhan ekonomi.</p>
                        </div>
                        <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100 flex flex-col justify-center items-center text-center">
                            <Users size={40} className="text-blue-600 mb-4"/>
                            <h4 className="font-bold text-[#3E2723]">Reduced Inequalities</h4>
                            <p className="text-xs text-[#8D6E63] mt-1">Mengurangi kesenjangan sosial.</p>
                        </div>
                        <div className="bg-purple-50 p-6 rounded-[2rem] border border-purple-100 flex flex-col justify-center items-center text-center mt-8">
                            <Globe size={40} className="text-purple-600 mb-4"/>
                            <h4 className="font-bold text-[#3E2723]">Indonesia Inklusif</h4>
                            <p className="text-xs text-[#8D6E63] mt-1">Cita-cita kemandirian disabilitas.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FITUR UTAMA (ASESMEN) --- */}
            <section id="fitur" className="py-24 bg-[#FFF8E1]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-orange-600 font-black tracking-widest uppercase text-sm bg-white px-3 py-1 rounded-full shadow-sm">Fitur Unggulan</span>
                        <h2 className="text-4xl md:text-5xl font-black text-[#3E2723] mt-4 mb-6 leading-tight">
                            Solusi Digital <br/>Terintegrasi.
                        </h2>
                        <p className="text-lg text-[#8D6E63] leading-relaxed font-medium">
                            Mengubah cara SLB YPAC Kota Malang dalam memantau, menilai, dan mengembangkan potensi peserta didik.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Smartphone size={32} />,
                                title: "Interactive Learning",
                                desc: "Modul pembelajaran visual & audio yang dirancang khusus agar mudah dipahami secara mandiri.",
                                color: "bg-white text-orange-600 border-orange-100"
                            },
                            {
                                icon: <ClipboardCheck size={32} />,
                                title: "Digital Assessment",
                                desc: "Instrumen penilaian keterampilan barista yang terukur, mencakup hard skill dan soft skill.",
                                color: "bg-white text-blue-600 border-blue-100"
                            },
                            {
                                icon: <BarChart3 size={32} />,
                                title: "Talent Pool",
                                desc: "Database kompetensi siswa yang siap diakses sebagai referensi kesiapan kerja bagi industri.",
                                color: "bg-white text-green-600 border-green-100"
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-[#FFF3E0] p-8 rounded-[2rem] border border-[#FFE0B2] hover:border-orange-400 hover:shadow-xl transition-all duration-300 group">
                                <div className={`w-16 h-16 ${item.color} border-2 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm`}>
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-black text-[#3E2723] mb-3">{item.title}</h3>
                                <p className="text-[#8D6E63] leading-relaxed font-medium">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- DAMPAK SDGs --- */}
            <section id="sdgs" className="py-24 bg-[#3E2723] border-t border-white/10 text-white relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600 rounded-full blur-[150px] opacity-20 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-orange-400 font-black tracking-widest uppercase text-sm">Dampak Global</span>
                            <h2 className="text-4xl font-black text-white mt-2 mb-6">Mendukung SDGs & Inklusi Sosial</h2>
                            <p className="text-white/80 text-lg leading-relaxed mb-6 font-medium">
                                Proyek ini dirancang selaras dengan Undang-Undang No. 8 Tahun 2016 tentang Penyandang Disabilitas dan RKPD Kota Malang.
                            </p>
                            <p className="text-white/60 mb-8 font-medium">
                                Kami berkomitmen mewujudkan ekosistem pendidikan yang inklusif, mengurangi ketimpangan, serta menciptakan peluang kerja yang layak melalui pendekatan teknologi.
                            </p>
                            
                            <div className="flex flex-col gap-4">
                                {[
                                    "SDGs Poin 4: Quality Education",
                                    "SDGs Poin 8: Decent Work & Economic Growth",
                                    "SDGs Poin 10: Reduced Inequalities"
                                ].map((txt, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-orange-400 border border-white/10">
                                            <CheckCircle2 size={16} strokeWidth={3}/>
                                        </div>
                                        <span className="font-bold text-white/90">{txt}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute -top-4 -right-4 w-full h-full bg-orange-600 rounded-[2.5rem] opacity-20"></div>
                            <img 
                                src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop" 
                                alt="Inclusive Teamwork" 
                                className="relative rounded-[2.5rem] shadow-2xl border-4 border-[#3E2723] transform hover:scale-[1.02] transition-transform duration-500 z-10 w-full opacity-90 hover:opacity-100"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="bg-[#2D1B18] text-white/60 py-16 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-10">
                        <div className="max-w-xs">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white transform -rotate-6">
                                    <Coffee size={20} fill="currentColor"/>
                                </div>
                                <span className="font-black text-2xl tracking-tight text-white">BREWTECH</span>
                            </div>
                            <p className="text-sm leading-relaxed font-medium">
                                Sistem pendukung keputusan, talent pool, dan penilaian vokasi untuk SLB YPAC Kota Malang.
                            </p>
                        </div>
                        
                        <div className="text-right">
                            <h4 className="font-bold text-lg mb-2 text-white">Mandala Pure Love</h4>
                            <p className="text-sm">Innovillage Team 2026</p>
                            <div className="flex gap-4 justify-end mt-6">
                                <Instagram className="hover:text-orange-500 cursor-pointer transition-colors"/>
                                <Globe className="hover:text-blue-500 cursor-pointer transition-colors"/>
                                <Mail className="hover:text-green-500 cursor-pointer transition-colors"/>
                            </div>
                        </div>
                    </div>
                    
                    <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs font-bold tracking-wide text-white/40">
                        <p>&copy; 2026 Brewtech. Dedicated for SLB YPAC Malang.</p>
                        <p>Supported by Innovillage & Danantara.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}