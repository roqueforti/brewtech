import { Users, BookOpen, CheckCircle, XCircle, Eye, Coffee, AlertCircle } from 'lucide-react';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

declare function route(name: string, params?: any, absolute?: boolean): string;

// --- Interface Data Backend ---
interface Submission {
    id: number;
    student_name: string;
    student_class: string;
    workshop_title: string;
    photo_url: string | null;
    status: 'pending' | 'completed' | 'rejected';
    feedback?: string; // Field feedback dari backend
    submitted_at: string;
}

interface DashboardProps {
    auth: { user: { name: string } };
    submissions: Submission[];
    stats: {
        total_students: number;
        pending_reviews: number;
        completed_workshops: number;
    };
}

export default function Dashboard({ auth, submissions, stats }: DashboardProps) {
  
    // State Modal & Feedback
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
    const [feedbackComment, setFeedbackComment] = useState(''); 
    
    // State Filter Tab (Pending vs History)
    const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');

    // Reset feedback saat modal dibuka/ganti submission
    useEffect(() => {
        if (selectedSubmission) {
            setFeedbackComment(selectedSubmission.feedback || '');
        }
    }, [selectedSubmission]);

    // Fungsi Filter Data berdasarkan Tab
    const filteredSubmissions = submissions.filter(sub => {
        if (activeTab === 'pending') return sub.status === 'pending';
        return sub.status !== 'pending'; // History = completed atau rejected
    });

    const handleReview = (id: number, status: 'completed' | 'rejected') => {
        // Validasi: Wajib isi feedback kalau DITOLAK
        if (!feedbackComment && status === 'rejected') {
            alert("Wajib memberikan feedback/alasan jika menolak tugas!");
            return;
        }

        if(confirm(`Yakin ingin mengubah status menjadi ${status}?`)) {
            router.post(route('pengajar.grade'), {
                submission_id: id,
                status: status,
                feedback: feedbackComment // Kirim feedback ke backend
            }, {
                onSuccess: () => {
                    setSelectedSubmission(null);
                    setFeedbackComment('');
                }
            });
        }
    };

    return (
        <div className="min-h-screen bg-[#F5E6D3] font-sans pb-20">
            <Head title="Dashboard Pengajar" />
            
            {/* --- HEADER --- */}
            <nav className="bg-white border-b-4 border-[#D7CCC8] px-6 py-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="bg-[#5D4037] p-2 rounded-lg shadow-inner">
                        <Coffee className="w-6 h-6 text-[#FFCA28]" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-[#5D4037] leading-none tracking-tight">Ruang Guru</h1>
                        <p className="text-xs text-[#8D6E63] font-bold">BrewTech LMS</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs text-[#8D6E63] font-bold">Pengajar</p>
                        <p className="font-black text-[#5D4037]">{auth.user.name}</p>
                    </div>
                    <button onClick={() => router.post(route('logout'))} className="bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold hover:bg-red-100 border-2 border-transparent hover:border-red-200 transition-all text-sm">
                        Keluar
                    </button>
                </div>
            </nav>

            <div className="p-6 max-w-7xl mx-auto space-y-8">
                
                {/* === STATS GRID === */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Total Siswa */}
                    <div className="bg-white rounded-3xl p-6 border-b-[6px] border-[#64B5F6] shadow-sm flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
                        <div className="p-3 bg-blue-50 rounded-2xl text-[#1E88E5]">
                            <Users className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-4xl font-black text-[#5D4037]">{stats.total_students}</h3>
                            <p className="text-sm font-bold text-[#8D6E63] uppercase tracking-wide">Total Siswa</p>
                        </div>
                    </div>

                    {/* Pending Reviews */}
                    <div className="bg-[#FFF8E1] rounded-3xl p-6 border-b-[6px] border-[#FFB74D] shadow-md flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 text-[#FFE0B2] opacity-50">
                            <AlertCircle className="w-32 h-32" />
                        </div>
                        <div className="p-3 bg-orange-100 rounded-2xl text-[#EF6C00] relative z-10">
                            <AlertCircle className="w-8 h-8" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-4xl font-black text-[#E65100]">{stats.pending_reviews}</h3>
                            <p className="text-sm font-bold text-[#EF6C00] uppercase tracking-wide">Perlu Dinilai</p>
                        </div>
                    </div>

                    {/* Completed */}
                    <div className="bg-white rounded-3xl p-6 border-b-[6px] border-[#81C784] shadow-sm flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
                        <div className="p-3 bg-green-50 rounded-2xl text-[#2E7D32]">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-4xl font-black text-[#5D4037]">{stats.completed_workshops}</h3>
                            <p className="text-sm font-bold text-[#8D6E63] uppercase tracking-wide">Lulus Workshop</p>
                        </div>
                    </div>
                </div>

                {/* === MAIN CONTENT (Table & Tabs) === */}
                <div className="bg-white rounded-[2.5rem] border-[6px] border-[#D7CCC8] shadow-sm overflow-hidden">
                    
                    {/* Header Table & Tabs */}
                    <div className="p-8 pb-0 border-b border-dashed border-[#D7CCC8]">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#5D4037] rounded-xl">
                                    <BookOpen className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-2xl font-black text-[#5D4037]">Daftar Tugas Masuk</h2>
                            </div>
                            
                            {/* TAB FILTER */}
                            <div className="flex bg-[#F5F5F5] p-1 rounded-xl">
                                <button 
                                    onClick={() => setActiveTab('pending')}
                                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                                        activeTab === 'pending' 
                                        ? 'bg-white text-[#E65100] shadow-sm ring-1 ring-gray-200' 
                                        : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                >
                                    Perlu Review ({stats.pending_reviews})
                                </button>
                                <button 
                                    onClick={() => setActiveTab('history')}
                                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                                        activeTab === 'history' 
                                        ? 'bg-white text-[#5D4037] shadow-sm ring-1 ring-gray-200' 
                                        : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                >
                                    Riwayat Penilaian
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Table Container */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#FAF8F5]">
                                <tr className="text-[#8D6E63]">
                                    <th className="py-4 px-6 font-black uppercase text-xs tracking-wider">Siswa</th>
                                    <th className="py-4 px-6 font-black uppercase text-xs tracking-wider">Materi Workshop</th>
                                    <th className="py-4 px-6 font-black uppercase text-xs tracking-wider">Waktu</th>
                                    <th className="py-4 px-6 font-black uppercase text-xs tracking-wider">Status</th>
                                    <th className="py-4 px-6 font-black uppercase text-xs tracking-wider text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredSubmissions.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-400">
                                                <Coffee className="w-12 h-12 mb-3 text-gray-300" />
                                                <p className="font-bold text-lg">Tidak ada data di sini.</p>
                                                <p className="text-sm">Sensei bisa ngopi dulu! ☕</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredSubmissions.map((sub) => (
                                    <tr key={sub.id} className="hover:bg-[#FFF8E1] transition-colors group">
                                        <td className="py-4 px-6">
                                            <div className="font-bold text-[#5D4037]">{sub.student_name}</div>
                                            <div className="text-xs text-[#8D6E63]">{sub.student_class}</div>
                                        </td>
                                        <td className="py-4 px-6 font-medium text-[#5D4037]">{sub.workshop_title}</td>
                                        <td className="py-4 px-6 text-sm text-gray-500 font-mono">{sub.submitted_at}</td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                sub.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                                                sub.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                                {sub.status === 'pending' ? 'MENUNGGU' : sub.status === 'completed' ? 'LULUS' : 'DITOLAK'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <button 
                                                onClick={() => setSelectedSubmission(sub)}
                                                className="bg-white border-2 border-[#D7CCC8] text-[#5D4037] w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#5D4037] hover:text-white hover:border-[#5D4037] transition-all shadow-sm mx-auto"
                                                title="Lihat Detail"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* === MODAL REVIEW (SPLIT VIEW) === */}
            {selectedSubmission && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#5D4037]/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2rem] w-full max-w-4xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col md:flex-row h-[85vh] md:h-auto">
                        
                        {/* KIRI: IMAGE VIEWER */}
                        <div className="w-full md:w-1/2 bg-black flex items-center justify-center relative p-4 bg-pattern">
                            {selectedSubmission.photo_url ? (
                                <img 
                                    src={`/storage/${selectedSubmission.photo_url}`} 
                                    alt="Bukti Siswa" 
                                    className="max-h-full max-w-full object-contain rounded-lg shadow-lg"
                                />
                            ) : (
                                <div className="text-white/50 flex flex-col items-center">
                                    <AlertCircle className="w-12 h-12 mb-2" />
                                    <span>Gambar tidak ditemukan</span>
                                </div>
                            )}
                            <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md">
                                Bukti Foto
                            </div>
                        </div>

                        {/* KANAN: FORM PENILAIAN */}
                        <div className="w-full md:w-1/2 flex flex-col bg-white">
                            {/* Header Modal */}
                            <div className="p-6 border-b border-gray-100 flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-black text-[#5D4037]">{selectedSubmission.student_name}</h3>
                                    <p className="text-sm text-[#8D6E63] font-bold mt-1">{selectedSubmission.workshop_title}</p>
                                </div>
                                <button onClick={() => setSelectedSubmission(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <XCircle className="w-8 h-8 text-gray-300 hover:text-[#5D4037]" />
                                </button>
                            </div>

                            {/* Body Scrollable */}
                            <div className="p-6 overflow-y-auto flex-1 space-y-6">
                                {/* Tips */}
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 items-start">
                                    <div className="bg-blue-100 p-1.5 rounded-full mt-0.5">
                                        <BookOpen className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-blue-800 uppercase mb-1">Panduan Penilaian</p>
                                        <p className="text-sm text-blue-700 leading-relaxed">
                                            Perhatikan <em>flat bed</em> (kerataan ampas) dan warna hasil ekstraksi. Berikan feedback yang membangun jika menolak.
                                        </p>
                                    </div>
                                </div>

                                {/* Feedback Input */}
                                <div>
                                    <label className="block text-sm font-black text-[#5D4037] mb-2">
                                        Catatan / Feedback untuk Siswa
                                    </label>
                                    <textarea 
                                        value={feedbackComment}
                                        onChange={(e) => setFeedbackComment(e.target.value)}
                                        placeholder="Contoh: Tuangan air terlalu cepat sehingga menyebabkan channeling. Coba gunakan gooseneck kettle lebih pelan..."
                                        className="w-full h-40 rounded-xl border-2 border-gray-200 p-4 text-sm focus:border-[#5D4037] focus:ring-0 resize-none transition-all placeholder:text-gray-300 text-[#5D4037]"
                                        readOnly={selectedSubmission.status !== 'pending'}
                                    ></textarea>
                                </div>
                            </div>

                            {/* Footer Actions (Hanya muncul jika status Pending) */}
                            {selectedSubmission.status === 'pending' && (
                                <div className="p-6 border-t border-gray-100 bg-gray-50">
                                    <div className="grid grid-cols-2 gap-4">
                                        <button 
                                            onClick={() => handleReview(selectedSubmission.id, 'rejected')}
                                            className="py-3.5 rounded-xl border-2 border-red-100 bg-white text-red-500 font-black hover:bg-red-50 hover:border-red-200 transition-all flex items-center justify-center gap-2"
                                        >
                                            <XCircle className="w-5 h-5" /> TOLAK TUGAS
                                        </button>
                                        <button 
                                            onClick={() => handleReview(selectedSubmission.id, 'completed')}
                                            className="py-3.5 rounded-xl bg-[#5D4037] text-[#FFCA28] font-black hover:bg-[#4E342E] shadow-lg shadow-orange-900/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle className="w-5 h-5" /> ACC & LULUS
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}