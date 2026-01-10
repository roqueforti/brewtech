import { LogOut, Home } from 'lucide-react';

interface HeaderPesertaProps {
  userName: string;
  onNavigate?: (page: string) => void;
  onBackToRoleSelection?: () => void;
}

export function HeaderPeserta({ userName, onNavigate, onBackToRoleSelection }: HeaderPesertaProps) {
  return (
    <header className="bg-white border-b-4 border-amber-200 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="text-4xl">☕</div>
            <div>
              <h1 className="text-2xl text-gray-800 font-bold">BREWTECH</h1>
              <p className="text-sm text-gray-600">Pelatihan Barista</p>
            </div>
          </div>

          {/* User Info & Actions */}
          <div className="flex items-center gap-4">
            {/* User Badge */}
            <div className="bg-blue-100 border-4 border-blue-300 rounded-2xl px-6 py-2 flex items-center gap-3">
              <div className="text-3xl">👤</div>
              <div>
                <p className="text-sm text-gray-600">Peserta</p>
                <p className="text-lg text-gray-800 font-medium">{userName}</p>
              </div>
            </div>

            {/* Home Button */}
            {onNavigate && (
              <button
                onClick={() => onNavigate('dashboard')}
                className="h-12 px-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl flex items-center gap-2 transition-all shadow-md"
              >
                <Home className="w-5 h-5" />
                <span className="text-sm font-medium">Home</span>
              </button>
            )}

            {/* Logout Button */}
            {onBackToRoleSelection && (
              <button
                onClick={onBackToRoleSelection}
                className="h-12 px-5 bg-red-500 hover:bg-red-600 text-white rounded-xl flex items-center gap-2 transition-all shadow-md"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Keluar</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}