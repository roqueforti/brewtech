import { useState } from 'react';
import { ArrowRight, Lock, Eye, EyeOff, LogIn, Star } from 'lucide-react';
import { router } from '@inertiajs/react';

// --- TIPE DATA (Agar Coding Lebih Aman/Rapi) ---
interface Student {
  id: number;
  name: string;
  kelas_id: number;
}

interface KelasTheme {
  bg: string;
  border: string;
  text: string;
  shadow: string;
}

interface KelasData {
  id: number;
  nama: string;
  emoji: string;
  students: Student[];
  theme: KelasTheme;
}

// Props dari Laravel (StudentAuthController) + Errors dari Inertia
interface LoginProps {
  kelasFromDB: KelasData[];
  errors: any; // <--- Tambahkan ini untuk menangkap error dari Server
}

export default function Login({ kelasFromDB, errors }: LoginProps) {
  const [mode, setMode] = useState<'student' | 'instructor'>('student');
  
  // State Login Siswa
  const [selectedKelas, setSelectedKelas] = useState<number | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  
  // State Login Instruktur
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState(''); // Error validasi lokal

  // --- TRANSFORMASI DATA ---
  const kelasList = Array.isArray(kelasFromDB) ? kelasFromDB.map((k) => ({
    ...k,
    theme: k.theme || { 
        bg: 'bg-orange-100', 
        border: 'border-orange-400', 
        text: 'text-orange-800', 
        shadow: 'shadow-orange-200' 
    }
  })) : [];

  const activeClass = selectedKelas ? kelasList.find(k => k.id === selectedKelas) : null;

  // --- LOGIKA LOGIN ---
  
  const handleStudentLogin = () => {
    if (selectedKelas && selectedStudentId) {
      router.post('/login/student', {
        kelas_id: selectedKelas,
        user_id: selectedStudentId
      });
    }
  };

  const handleInstructorLogin = () => {
    if(!email || !password) {
        setLocalError("Email & Password harus diisi!");
        return;
    }
    router.post('/login', { email, password });
  };

  return (
    <div className="min-h-screen bg-[#FFF8E1] flex items-center justify-center p-4 font-sans">
      
      {/* Background Icons */}
      <div className="fixed top-10 left-10 text-6xl opacity-20 rotate-12 pointer-events-none select-none">☕</div>
      <div className="fixed bottom-20 right-20 text-6xl opacity-20 -rotate-12 pointer-events-none select-none">🥐</div>

      <div className="max-w-xl w-full relative z-10">
        
        {/* HEADER */}
        <div className="text-center mb-6 md:mb-8">
          <div className="inline-block animate-bounce">
              <div className="text-6xl md:text-8xl mb-2 drop-shadow-md">☕</div>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-[#5D4037] mb-2 tracking-wide" style={{ textShadow: '3px 3px 0 #FFF' }}>
            BREWTECH
          </h1>
          <div className="inline-block bg-[#FFECB3] border-4 border-[#8D6E63] px-4 md:px-6 py-1 md:py-2 rounded-full transform -rotate-2">
            <p className="text-sm md:text-lg font-bold text-[#8D6E63]">Pelatihan Barista Ceria! ✨</p>
          </div>
        </div>

        {/* TOGGLE */}
        <div className="flex gap-2 md:gap-4 mb-6 md:mb-8 justify-center">
          <button
            onClick={() => setMode('student')}
            className={`flex-1 py-3 md:py-4 rounded-3xl text-lg md:text-xl font-black border-b-[6px] md:border-b-[8px] border-x-4 border-t-4 transition-all active:scale-95 active:border-b-4 ${
              mode === 'student'
                ? 'bg-[#64B5F6] border-[#1976D2] text-white shadow-xl translate-y-0'
                : 'bg-white border-gray-300 text-gray-400 hover:bg-gray-50'
            }`}
          >
            👶 Peserta
          </button>
          <button
            onClick={() => setMode('instructor')}
            className={`flex-1 py-3 md:py-4 rounded-3xl text-lg md:text-xl font-black border-b-[6px] md:border-b-[8px] border-x-4 border-t-4 transition-all active:scale-95 active:border-b-4 ${
              mode === 'instructor'
                ? 'bg-[#E57373] border-[#C62828] text-white shadow-xl translate-y-0'
                : 'bg-white border-gray-300 text-gray-400 hover:bg-gray-50'
            }`}
          >
             👩‍🏫 Pengajar
          </button>
        </div>

        {/* PANEL UTAMA */}
        <div className="bg-[#FFFAF0] rounded-[2.5rem] p-6 md:p-8 border-[6px] border-[#8D6E63] shadow-[0_10px_0_rgba(93,64,55,0.2)]">
          
          {mode === 'student' ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              <div className="text-center mb-6">
                <h2 className="text-3xl font-black text-[#5D4037]">Halo, Teman Kecil! 👋</h2>
                <p className="text-[#8D6E63] font-bold mt-1">Ayo pilih kelasmu hari ini</p>
              </div>

              {/* STEP 1: PILIH KELAS */}
              {!selectedKelas ? (
                <div className="space-y-4">
                    {kelasList.length > 0 ? kelasList.map((k) => (
                    <button
                        key={k.id}
                        onClick={() => { setSelectedKelas(k.id); setSelectedStudentId(null); }}
                        className={`w-full p-4 rounded-3xl border-[5px] flex items-center gap-4 transition-transform hover:scale-105 active:scale-95 bg-white ${k.theme.border} ${k.theme.text}`}
                    >
                        <div className={`text-4xl w-16 h-16 rounded-2xl flex items-center justify-center border-4 ${k.theme.bg} ${k.theme.border}`}>
                          {k.emoji}
                        </div>
                        <div className="text-left flex-1">
                          <h3 className="text-xl font-black">{k.nama}</h3>
                          <p className="font-bold opacity-70 text-sm">Klik untuk masuk!</p>
                        </div>
                        <ArrowRight className="w-8 h-8 opacity-50" strokeWidth={4} />
                    </button>
                    )) : (
                        <p className="text-center text-gray-400 italic">Belum ada data kelas.</p>
                    )}
                </div>
              ) : (
                /* STEP 2: PILIH NAMA */
                <div className="space-y-6">
                  {/* Header Kelas Terpilih */}
                  <div className={`flex items-center justify-between p-4 rounded-3xl border-[4px] bg-white ${activeClass?.theme.border} ${activeClass?.theme.text}`}>
                     <div className="flex items-center gap-3">
                        <span className="text-4xl">{activeClass?.emoji}</span>
                        <div className="text-left">
                            <p className="text-xs font-black opacity-60 uppercase">KELAS:</p>
                            <h3 className="text-xl font-black leading-none">{activeClass?.nama}</h3>
                        </div>
                     </div>
                     <button 
                        onClick={() => setSelectedKelas(null)}
                        className="text-sm font-bold underline decoration-4 hover:scale-110 transition-transform"
                     >
                       Ganti
                     </button>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-xl font-black text-[#5D4037] mb-4">Siapa Namamu? 👇</p>
                    <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                      {activeClass?.students && activeClass.students.length > 0 ? activeClass.students.map((student) => (
                        <button
                          key={student.id}
                          onClick={() => setSelectedStudentId(student.id)}
                          className={`p-3 rounded-2xl border-[4px] text-lg font-bold transition-all active:scale-95 ${
                            selectedStudentId === student.id
                              ? `${activeClass.theme.bg} ${activeClass.theme.border} ${activeClass.theme.text}`
                              : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'
                          }`}
                        >
                          {student.name}
                          {selectedStudentId === student.id && <Star className="inline-block w-5 h-5 ml-1 fill-current animate-spin" />}
                        </button>
                      )) : (
                          <div className="col-span-2 text-gray-400 text-sm italic">Belum ada siswa.</div>
                      )}
                    </div>
                  </div>

                  {/* ERROR MESSAGE DARI SERVER (Baru Ditambahkan) */}
                  {(errors.login_error || errors.user_id) && (
                    <div className="p-3 bg-red-100 border-[3px] border-red-300 rounded-2xl text-red-700 font-bold text-center animate-shake">
                       🚨 {errors.login_error || errors.user_id}
                    </div>
                  )}

                  <button
                    onClick={handleStudentLogin}
                    disabled={!selectedStudentId}
                    className={`w-full py-5 rounded-3xl text-2xl font-black border-b-[8px] border-x-4 border-t-4 transition-all active:scale-95 active:border-b-4 ${
                      selectedStudentId
                        ? 'bg-[#FFCA28] border-[#FF8F00] text-[#5D4037] shadow-lg'
                        : 'bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    MASUK KELAS 🚀
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* LOGIN PENGAJAR */}
              <div className="text-center mb-6">
                <div className="inline-block p-3 bg-red-100 rounded-full border-4 border-red-200 mb-2">
                    <Lock className="w-8 h-8 text-[#C62828]" strokeWidth={3} />
                </div>
                <h2 className="text-3xl font-black text-[#5D4037]">Area Pengajar</h2>
                <p className="text-[#8D6E63] font-bold">Masukkan akun admin ya!</p>
              </div>

              <div className="space-y-4">
                <div>
                    <label className="block text-lg font-black text-[#5D4037] mb-1 ml-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setLocalError(''); }}
                        className="w-full h-14 px-5 rounded-2xl border-[4px] border-[#D7CCC8] focus:border-[#8D6E63] focus:outline-none bg-white text-lg font-bold text-[#5D4037]"
                        placeholder="admin@brewtech.com"
                    />
                </div>

                <div>
                  <label className="block text-lg font-black text-[#5D4037] mb-1 ml-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setLocalError(''); }}
                      className="w-full h-14 px-5 pr-14 rounded-2xl border-[4px] border-[#D7CCC8] focus:border-[#8D6E63] focus:outline-none bg-white text-lg font-bold text-[#5D4037]"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8D6E63] hover:scale-110 transition-transform"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>

                {/* ERROR MESSAGE (Gabungan Local & Server) */}
                {(localError || errors.email || errors.password) && (
                  <div className="p-3 bg-red-100 border-[3px] border-red-300 rounded-2xl text-red-700 font-bold text-center animate-pulse">
                    🚨 {localError || errors.email || errors.password}
                  </div>
                )}

                <button
                  onClick={handleInstructorLogin}
                  className="w-full py-5 mt-2 rounded-3xl text-2xl font-black text-white border-b-[8px] border-x-4 border-t-4 transition-all active:scale-95 active:border-b-4 bg-[#EF5350] border-[#C62828] hover:bg-[#E53935]"
                >
                  BUKA PINTU 🔑
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}