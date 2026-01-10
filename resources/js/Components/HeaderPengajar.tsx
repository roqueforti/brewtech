import { Home, Users, BookOpen, BarChart3, LogOut } from 'lucide-react';

interface HeaderPengajarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onBackToRoleSelection?: () => void;
}

export function HeaderPengajar({ currentPage, onNavigate, onBackToRoleSelection }: HeaderPengajarProps) {
  return (
    <header className="bg-white border-b-4 border-indigo-200 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="text-4xl">☕</div>
            <div>
              <h1 className="text-2xl text-gray-800 font-bold">BREWTECH</h1>
              <p className="text-sm text-gray-600">Dashboard Pengajar</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('dashboard-pengajar')}
              className={`h-12 px-5 rounded-xl flex items-center gap-2 transition-all ${
                currentPage === 'dashboard-pengajar'
                  ? 'bg-indigo-500 text-white shadow-md'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-sm font-medium">Home</span>
            </button>

            <button
              onClick={() => onNavigate('manajemen-kelas')}
              className={`h-12 px-5 rounded-xl flex items-center gap-2 transition-all ${
                currentPage === 'manajemen-kelas'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span className="text-sm font-medium">Kelas</span>
            </button>

            <button
              onClick={() => onNavigate('data-peserta')}
              className={`h-12 px-5 rounded-xl flex items-center gap-2 transition-all ${
                currentPage === 'data-peserta'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="text-sm font-medium">Peserta</span>
            </button>

            <button
              onClick={() => onNavigate('analisis-spk')}
              className={`h-12 px-5 rounded-xl flex items-center gap-2 transition-all ${
                currentPage === 'analisis-spk'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span className="text-sm font-medium">Analisis</span>
            </button>

            {onBackToRoleSelection && (
              <button
                onClick={onBackToRoleSelection}
                className="h-12 px-5 bg-red-500 hover:bg-red-600 text-white rounded-xl flex items-center gap-2 transition-all shadow-md ml-2"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Keluar</span>
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}