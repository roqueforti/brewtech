import { Target, Trophy, Book, Wrench, Briefcase, TrendingUp, ArrowLeft, Star, Zap, Calendar, Award, Lock } from 'lucide-react';
import { router } from '@inertiajs/react';
import BottomNav from '@/Components/BottomNavPeserta';

// --- Interfaces ---
interface SPKData {
  avg_pretest: number;
  avg_posttest: number;
  avg_activity: number;
  predikat_kompetensi: string;
  predikat_pengetahuan: string;
  predikat_keterampilan: string;
  predikat_sikap: string;
  kelebihan: string[];
  area_pengembangan: string[];
  nilai_keseluruhan: number;
  rekomendasi_selanjutnya: string;
}

interface WorkshopRecap {
    id: number;
    title: string;
    date: string;
    score: number;
    status: string;
    insight: string;
    color: string;
}

interface ExtraData {
    persona: string;
    badge: string;
    workshops: WorkshopRecap[];
}

interface PageProps {
  auth: { user: { name: string } };
  spk: SPKData | null; // Bisa null
  extra: ExtraData;
}

export default function NilaiSPK({ auth, spk, extra }: PageProps) {
  
  return (
    <div className="min-h-screen bg-[#FFF8E1] font-sans pb-32">
      
      {/* === HEADER (Sticky di Mobile) === */}
      <div className="sticky top-0 z-30 bg-[#FFFAF0]/90 backdrop-blur-md p-4 border-b-[4px] border-[#D7CCC8] shadow-sm flex items-center justify-between">
         <div className="flex items-center gap-3">
             <button onClick={() => router.visit('/peserta/dashboard')} className="p-2 bg-white rounded-xl border-[3px] border-[#D7CCC8] text-[#8D6E63] hover:bg-gray-50 transition-transform active:scale-95">
                <ArrowLeft className="w-5 h-5" strokeWidth={3} />
             </button>
             <div>
                <h1 className="text-xl font-black text-[#5D4037] leading-none">Rapor Saya</h1>
                <p className="text-xs font-bold text-[#8D6E63]">Hi, {auth.user.name}</p>
             </div>
         </div>
         <div className="bg-[#FFEBEE] px-3 py-1 rounded-full border-[3px] border-[#FFCDD2] text-[#E57373] font-black text-xs flex items-center gap-1">
            <Target className="w-4 h-4" /> Hasil Akhir
         </div>
      </div>

      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        
        {/* === LOGIKA TAMPILAN: KOSONG VS ADA DATA === */}
        {!spk ? (
            
            // --- TAMPILAN "BELUM ADA NILAI" (DESIGN BARU) ---
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-fade-in-up">
                {/* Icon Gembok Besar */}
                <div className="relative">
                    <div className="w-40 h-40 bg-[#FFECB3] rounded-full flex items-center justify-center border-[6px] border-[#FF8F00] shadow-lg animate-bounce-slow">
                        <Lock className="w-20 h-20 text-[#5D4037]" strokeWidth={2.5} />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full border-[3px] border-[#D7CCC8] shadow-sm">
                        <span className="text-2xl">🚧</span>
                    </div>
                </div>

                {/* Card Pesan */}
                <div className="bg-white p-8 rounded-[2.5rem] border-[6px] border-[#8D6E63] shadow-[0_10px_0_rgba(93,64,55,0.2)] max-w-md w-full">
                    <h2 className="text-2xl font-black text-[#5D4037] mb-3">Rapor Masih Terkunci!</h2>
                    <p className="text-[#8D6E63] font-bold text-md leading-relaxed mb-8">
                        Kamu belum menyelesaikan misi <strong>Workshop</strong> apapun. 
                        Yuk, selesaikan praktikum dan upload hasil fotomu untuk membuka analisis ini!
                    </p>
                    
                    <button 
                        onClick={() => router.visit('/peserta/dashboard')}
                        className="w-full py-4 bg-[#FFCA28] text-[#5D4037] font-black rounded-2xl text-lg shadow-lg border-b-[6px] border-[#FF8F00] active:border-b-0 active:translate-y-2 transition-all flex items-center justify-center gap-2"
                    >
                        KE DASHBOARD & MULAI MISI 🚀
                    </button>
                </div>
            </div>

        ) : (

            // --- TAMPILAN DATA RAPOR (GRID RESPONSIVE) ---
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* ... (KODE TAMPILAN RAPOR YANG LAMA TETAP DISINI) ... */}
                {/* SAYA TULIS ULANG AGAR ANDA TIDAK BINGUNG COPY-PASTE */}
                
                {/* --- KOLOM KIRI: INSIGHT UMUM & PERSONA --- */}
                <div className="lg:col-span-1 space-y-6">
                    {/* 1. PERSONA CARD */}
                    <div className="bg-white rounded-[2rem] p-6 border-[5px] border-[#8D6E63] shadow-[0_8px_0_rgba(93,64,55,0.2)] text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#FFF8E1] to-white z-0"></div>
                        <div className="relative z-10">
                            <div className="w-24 h-24 mx-auto bg-white rounded-full border-[4px] border-[#FFCA28] flex items-center justify-center text-5xl shadow-md mb-3">
                                {extra.badge}
                            </div>
                            <h2 className="text-sm font-bold text-[#8D6E63] uppercase tracking-widest mb-1">Tipe Barista Kamu</h2>
                            <h3 className="text-2xl font-black text-[#5D4037] mb-2">{extra.persona}</h3>
                            <div className="inline-block bg-[#E8F5E9] text-[#2E7D32] text-xs font-black px-3 py-1 rounded-full border border-[#A5D6A7]">
                                {spk.predikat_kompetensi}
                            </div>
                        </div>
                    </div>

                    {/* 2. STATISTIK RINGKAS */}
                    <div className="bg-[#FFFAF0] rounded-[2rem] p-6 border-[4px] border-[#D7CCC8]">
                        <h3 className="text-lg font-black text-[#5D4037] mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" /> Statistik Utama
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs font-bold mb-1">
                                    <span className="text-[#5D4037]">Pemahaman Teori</span>
                                    <span className="text-blue-600">{spk.predikat_pengetahuan}</span>
                                </div>
                                <div className="h-4 bg-gray-200 rounded-full overflow-hidden border border-gray-300">
                                    <div className="h-full bg-blue-400 w-[85%] rounded-full shadow-inner"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs font-bold mb-1">
                                    <span className="text-[#5D4037]">Keterampilan Praktek</span>
                                    <span className="text-orange-600">{spk.predikat_keterampilan}</span>
                                </div>
                                <div className="h-4 bg-gray-200 rounded-full overflow-hidden border border-gray-300">
                                    <div className="h-full bg-orange-400 w-[92%] rounded-full shadow-inner"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs font-bold mb-1">
                                    <span className="text-[#5D4037]">Sikap Kerja</span>
                                    <span className="text-purple-600">{spk.predikat_sikap}</span>
                                </div>
                                <div className="h-4 bg-gray-200 rounded-full overflow-hidden border border-gray-300">
                                    <div className="h-full bg-purple-400 w-[88%] rounded-full shadow-inner"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. CATATAN KELEBIHAN & KEKURANGAN */}
                    <div className="bg-white rounded-[2rem] p-5 border-[4px] border-[#D7CCC8] shadow-sm">
                        <h3 className="text-md font-black text-[#5D4037] mb-3">⚡ Kilas Balik</h3>
                        <div className="space-y-3">
                            <div className="bg-[#FFF8E1] p-3 rounded-xl border border-[#FFE082]">
                                <p className="text-xs font-bold text-[#FF6F00] mb-1">👍 Super Power</p>
                                <div className="flex flex-wrap gap-1">
                                    {spk.kelebihan?.slice(0, 2).map((k, i) => (
                                        <span key={i} className="text-[10px] bg-white px-2 py-1 rounded-md border border-[#FFECB3] font-bold text-[#5D4037]">{k}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-[#FFEBEE] p-3 rounded-xl border border-[#FFCDD2]">
                                <p className="text-xs font-bold text-[#D32F2F] mb-1">🚀 Perlu Boost</p>
                                <div className="flex flex-wrap gap-1">
                                    {spk.area_pengembangan?.slice(0, 2).map((k, i) => (
                                        <span key={i} className="text-[10px] bg-white px-2 py-1 rounded-md border border-[#FFCDD2] font-bold text-[#5D4037]">{k}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- KOLOM KANAN: REKAP WORKSHOP & DETAIL --- */}
                <div className="lg:col-span-2 space-y-6">

                    {/* 1. SCOREBOARD UTAMA */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-[#5D4037] p-4 rounded-3xl text-white shadow-lg relative overflow-hidden group">
                            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                                <Trophy className="w-20 h-20" />
                            </div>
                            <p className="text-xs opacity-80 font-bold uppercase mb-1">Total Skor</p>
                            <p className="text-4xl font-black">{spk.nilai_keseluruhan}</p>
                        </div>
                        <div className="bg-white p-4 rounded-3xl border-[3px] border-[#D7CCC8]">
                            <p className="text-xs text-[#8D6E63] font-bold uppercase mb-1">Pre-Test</p>
                            <p className="text-2xl font-black text-[#5D4037]">{spk.avg_pretest}</p>
                        </div>
                        <div className="bg-white p-4 rounded-3xl border-[3px] border-[#D7CCC8]">
                            <p className="text-xs text-[#8D6E63] font-bold uppercase mb-1">Post-Test</p>
                            <p className="text-2xl font-black text-[#2E7D32]">{spk.avg_posttest}</p>
                        </div>
                        <div className="bg-white p-4 rounded-3xl border-[3px] border-[#D7CCC8]">
                            <p className="text-xs text-[#8D6E63] font-bold uppercase mb-1">Poin Naik</p>
                            <p className="text-2xl font-black text-[#1565C0]">+{spk.avg_posttest - spk.avg_pretest}</p>
                        </div>
                    </div>

                    {/* 2. REKAP WORKSHOP */}
                    <div className="bg-white rounded-[2.5rem] p-6 md:p-8 border-[6px] border-[#8D6E63] shadow-[0_10px_0_rgba(93,64,55,0.2)]">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-[#FFCA28] rounded-2xl border-[3px] border-[#FF8F00] shadow-sm">
                                <Book className="w-6 h-6 text-[#5D4037]" strokeWidth={3} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-[#5D4037]">Jurnal Petualangan</h2>
                                <p className="text-xs font-bold text-[#8D6E63]">Rekapan hasil di setiap workshop</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {extra.workshops?.map((ws) => (
                                <div key={ws.id} className="relative pl-6 md:pl-0">
                                    <div className="md:hidden absolute left-0 top-6 bottom-0 w-1 bg-[#D7CCC8] rounded-full"></div>
                                    <div className={`flex flex-col md:flex-row gap-4 p-4 rounded-2xl border-[3px] transition-transform hover:scale-[1.01] ${
                                        ws.status === 'Selesai' ? 'bg-white border-[#8D6E63]' : 'bg-gray-50 border-gray-200'
                                    }`}>
                                        <div className={`w-16 h-16 rounded-2xl flex-shrink-0 flex flex-col items-center justify-center border-[3px] ${
                                            ws.status === 'Selesai' ? 'bg-[#FFECB3] border-[#FFCA28] text-[#5D4037]' : 'bg-gray-200 border-gray-300 text-gray-400'
                                        }`}>
                                            <span className="text-xs font-black uppercase">Skor</span>
                                            <span className="text-xl font-black">{ws.score}</span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="text-lg font-black text-[#5D4037]">{ws.title}</h3>
                                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase border ${
                                                    ws.status === 'Selesai' ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#A5D6A7]' : 'bg-gray-200 text-gray-500 border-gray-300'
                                                }`}>
                                                    {ws.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-bold text-[#8D6E63] mb-2">
                                                <Calendar className="w-3 h-3" /> {ws.date}
                                            </div>
                                            <div className={`p-3 rounded-xl text-sm font-bold border-l-4 ${ws.color}`}>
                                                <div className="flex gap-2">
                                                    <Zap className="w-4 h-4 flex-shrink-0" />
                                                    "{ws.insight}"
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 3. REKOMENDASI BOX */}
                    <div className="bg-gradient-to-r from-[#6A1B9A] to-[#8E24AA] rounded-[2rem] p-6 text-white shadow-lg relative overflow-hidden">
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30 flex-shrink-0">
                                <Award className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black mb-1">Misi Selanjutnya</h3>
                                <p className="text-sm font-bold opacity-90 leading-relaxed">
                                    {spk.rekomendasi_selanjutnya}
                                </p>
                            </div>
                            <button className="flex-shrink-0 bg-[#FFCA28] text-[#5D4037] px-6 py-3 rounded-xl font-black border-b-[4px] border-[#FF8F00] active:border-b-0 active:translate-y-[4px] transition-all">
                                Mulai Misi!
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* FIXED BOTTOM NAV */}
      <BottomNav />
    </div>
  );
}