import { useState } from "react";
import { ArrowRight, Lock, User, Eye, EyeOff, LogIn, Star } from "lucide-react";

export default function Login() {
    const [mode, setMode] = useState<"student" | "instructor">("student");
    const [selectedKelas, setSelectedKelas] = useState<number | null>(null);
    const [selectedStudent, setSelectedStudent] = useState<string>("");

    // State Instructor
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    // Data Kelas dengan Tema Warna Kartun
    const kelas = [
        {
            id: 1,
            nama: "Morning Batch",
            emoji: "🌅",
            theme: {
                bg: "bg-orange-100",
                border: "border-orange-400",
                text: "text-orange-800",
                shadow: "shadow-orange-200",
            },
        },
        {
            id: 2,
            nama: "Afternoon Batch",
            emoji: "☀️",
            theme: {
                bg: "bg-yellow-100",
                border: "border-yellow-400",
                text: "text-yellow-800",
                shadow: "shadow-yellow-200",
            },
        },
        {
            id: 3,
            nama: "Evening Batch",
            emoji: "🌆",
            theme: {
                bg: "bg-blue-100",
                border: "border-blue-400",
                text: "text-blue-800",
                shadow: "shadow-blue-200",
            },
        },
    ];

    const students = {
        1: [
            "Alex",
            "Bella",
            "Charlie",
            "Diana",
            "Emma",
            "Finn",
            "Grace",
            "Henry",
            "Iris",
            "Jack",
        ],
        2: [
            "Kelly",
            "Liam",
            "Maya",
            "Noah",
            "Olivia",
            "Peter",
            "Quinn",
            "Ryan",
            "Sara",
            "Tom",
        ],
        3: [
            "Uma",
            "Vina",
            "Will",
            "Xena",
            "Yuki",
            "Zara",
            "Andi",
            "Budi",
            "Citra",
            "Dani",
        ],
    };

    const handleStudentLogin = () => {
        if (selectedKelas && selectedStudent) {
            console.log("Login Siswa:", selectedStudent);
        }
    };

    const handleInstructorLogin = () => {
        if (!email || !password) {
            setError("Ups! Email dan password harus diisi ya.");
            return;
        }
        console.log("Login Pengajar");
    };

    // Helper untuk mendapatkan tema kelas aktif
    const activeTheme = selectedKelas
        ? kelas.find((k) => k.id === selectedKelas)?.theme
        : null;

    return (
        <div className="min-h-screen bg-[#FFF8E1] flex items-center justify-center p-4 font-sans">
            {/* Hiasan Background (Floating Icons) */}
            <div className="fixed top-10 left-10 text-6xl opacity-20 rotate-12 pointer-events-none select-none">
                ☕
            </div>
            <div className="fixed bottom-20 right-20 text-6xl opacity-20 -rotate-12 pointer-events-none select-none">
                🥐
            </div>

            <div className="max-w-xl w-full relative z-10">
                {/* HEADER: LOGO KARTUN */}
                <div className="text-center mb-6 md:mb-8">
                    <div className="inline-block animate-bounce">
                        {/* Ubah text-8xl jadi text-6xl untuk HP, dan md:text-8xl untuk Laptop */}
                        <div className="text-6xl md:text-8xl mb-2 drop-shadow-md">
                            ☕
                        </div>
                    </div>

                    {/* Ubah text-6xl jadi text-4xl untuk HP */}
                    <h1
                        className="text-4xl md:text-6xl font-black text-[#5D4037] mb-2 tracking-wide"
                        style={{ textShadow: "3px 3px 0 #FFF" }}
                    >
                        BREWTECH
                    </h1>

                    <div className="inline-block bg-[#FFECB3] border-4 border-[#8D6E63] px-4 md:px-6 py-1 md:py-2 rounded-full transform -rotate-2">
                        {/* Perkecil ukuran font tagline di HP */}
                        <p className="text-sm md:text-lg font-bold text-[#8D6E63]">
                            Pelatihan Barista Ceria! ✨
                        </p>
                    </div>
                </div>

                {/* TOGGLE: TOMBOL BESAR */}
                <div className="flex gap-2 md:gap-4 mb-6 md:mb-8 justify-center">
                    <button
                        onClick={() => setMode("student")}
                        // Ubah padding (py) dan ukuran text agar muat di HP
                        className={`flex-1 py-3 md:py-4 rounded-3xl text-lg md:text-xl font-black border-b-[6px] md:border-b-[8px] border-x-4 border-t-4 transition-all active:scale-95 active:border-b-4 ${
                            mode === "student"
                                ? "bg-[#64B5F6] border-[#1976D2] text-white shadow-xl translate-y-0"
                                : "bg-white border-gray-300 text-gray-400 hover:bg-gray-50"
                        }`}
                    >
                        👶 Peserta
                    </button>
                    <button
                        onClick={() => setMode("instructor")}
                        className={`flex-1 py-3 md:py-4 rounded-3xl text-lg md:text-xl font-black border-b-[6px] md:border-b-[8px] border-x-4 border-t-4 transition-all active:scale-95 active:border-b-4 ${
                            mode === "instructor"
                                ? "bg-[#E57373] border-[#C62828] text-white shadow-xl translate-y-0"
                                : "bg-white border-gray-300 text-gray-400 hover:bg-gray-50"
                        }`}
                    >
                        👩‍🏫 Pengajar
                    </button>
                </div>

                {/* MAIN CARD: Panel Kartun */}
                <div className="bg-[#FFFAF0] rounded-[2.5rem] p-6 md:p-8 border-[6px] border-[#8D6E63] shadow-[0_10px_0_rgba(93,64,55,0.2)]">
                    {mode === "student" ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="text-center mb-6">
                                <h2 className="text-3xl font-black text-[#5D4037]">
                                    Halo, Teman Kecil! 👋
                                </h2>
                                <p className="text-[#8D6E63] font-bold mt-1">
                                    Ayo pilih kelasmu hari ini
                                </p>
                            </div>

                            {/* Step 1: PILIH KELAS */}
                            {!selectedKelas ? (
                                <div className="space-y-4">
                                    {kelas.map((k) => (
                                        <button
                                            key={k.id}
                                            onClick={() => {
                                                setSelectedKelas(k.id);
                                                setSelectedStudent("");
                                            }}
                                            className={`w-full p-4 rounded-3xl border-[5px] flex items-center gap-4 transition-transform hover:scale-105 active:scale-95 bg-white ${k.theme.border} ${k.theme.text}`}
                                        >
                                            <div
                                                className={`text-4xl w-16 h-16 rounded-2xl flex items-center justify-center border-4 ${k.theme.bg} ${k.theme.border}`}
                                            >
                                                {k.emoji}
                                            </div>
                                            <div className="text-left flex-1">
                                                <h3 className="text-xl font-black">
                                                    {k.nama}
                                                </h3>
                                                <p className="font-bold opacity-70 text-sm">
                                                    Klik untuk masuk!
                                                </p>
                                            </div>
                                            <ArrowRight
                                                className="w-8 h-8 opacity-50"
                                                strokeWidth={4}
                                            />
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                /* Step 2: PILIH NAMA */
                                <div className="space-y-6">
                                    {/* Header Kelas Terpilih */}
                                    <div
                                        className={`flex items-center justify-between p-4 rounded-3xl border-[4px] bg-white ${activeTheme?.border} ${activeTheme?.text}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-4xl">
                                                {
                                                    kelas.find(
                                                        (k) =>
                                                            k.id ===
                                                            selectedKelas,
                                                    )?.emoji
                                                }
                                            </span>
                                            <div className="text-left">
                                                <p className="text-xs font-black opacity-60 uppercase">
                                                    KELAS:
                                                </p>
                                                <h3 className="text-xl font-black leading-none">
                                                    {
                                                        kelas.find(
                                                            (k) =>
                                                                k.id ===
                                                                selectedKelas,
                                                        )?.nama
                                                    }
                                                </h3>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() =>
                                                setSelectedKelas(null)
                                            }
                                            className="text-sm font-bold underline decoration-4 hover:scale-110 transition-transform"
                                        >
                                            Ganti
                                        </button>
                                    </div>

                                    <div className="text-center">
                                        <p className="text-xl font-black text-[#5D4037] mb-4">
                                            Siapa Namamu? 👇
                                        </p>
                                        <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                            {students[
                                                selectedKelas as keyof typeof students
                                            ].map((student) => (
                                                <button
                                                    key={student}
                                                    onClick={() =>
                                                        setSelectedStudent(
                                                            student,
                                                        )
                                                    }
                                                    className={`p-3 rounded-2xl border-[4px] text-lg font-bold transition-all active:scale-95 ${
                                                        selectedStudent ===
                                                        student
                                                            ? `${activeTheme?.bg} ${activeTheme?.border} ${activeTheme?.text}`
                                                            : "bg-white border-gray-200 text-gray-400 hover:border-gray-300"
                                                    }`}
                                                >
                                                    {student}
                                                    {selectedStudent ===
                                                        student && (
                                                        <Star className="inline-block w-5 h-5 ml-1 fill-current animate-spin" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleStudentLogin}
                                        disabled={!selectedStudent}
                                        className={`w-full py-5 rounded-3xl text-2xl font-black border-b-[8px] border-x-4 border-t-4 transition-all active:scale-95 active:border-b-4 ${
                                            selectedStudent
                                                ? "bg-[#FFCA28] border-[#FF8F00] text-[#5D4037] shadow-lg"
                                                : "bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed"
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
                                    <Lock
                                        className="w-8 h-8 text-[#C62828]"
                                        strokeWidth={3}
                                    />
                                </div>
                                <h2 className="text-3xl font-black text-[#5D4037]">
                                    Area Pengajar
                                </h2>
                                <p className="text-[#8D6E63] font-bold">
                                    Masukkan kunci rahasia ya!
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-lg font-black text-[#5D4037] mb-1 ml-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setError("");
                                        }}
                                        className="w-full h-14 px-5 rounded-2xl border-[4px] border-[#D7CCC8] focus:border-[#8D6E63] focus:outline-none bg-white text-lg font-bold text-[#5D4037]"
                                        placeholder="admin@brewtech.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg font-black text-[#5D4037] mb-1 ml-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                setError("");
                                            }}
                                            className="w-full h-14 px-5 pr-14 rounded-2xl border-[4px] border-[#D7CCC8] focus:border-[#8D6E63] focus:outline-none bg-white text-lg font-bold text-[#5D4037]"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8D6E63] hover:scale-110 transition-transform"
                                        >
                                            {showPassword ? (
                                                <EyeOff />
                                            ) : (
                                                <Eye />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-100 border-[3px] border-red-300 rounded-2xl text-red-700 font-bold text-center animate-pulse">
                                        🚨 {error}
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
