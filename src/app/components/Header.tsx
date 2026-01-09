import { LogOut, User, Bell } from "lucide-react";

interface HeaderProps {
  currentUser: {
    name: string;
    role: string;
    state?: string;
    district?: string;
  } | null;
  onLogout: () => void;
}

export function Header({ currentUser, onLogout }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#003d82] rounded-full flex items-center justify-center">
                <div className="w-10 h-10 border-3 border-orange-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-[#003d82]">
                  CEMS
                </h1>
                <p className="text-xs text-gray-600">
                  Central Electoral Management System
                </p>
              </div>
            </div>
            <div className="h-10 w-px bg-gray-300 ml-2"></div>
            <div className="ml-2">
              <p className="text-sm text-gray-500">Election Commission of India</p>
              <p className="text-xs text-gray-400">भारत निर्वाचन आयोग</p>
            </div>
          </div>

          {/* User Info */}
          {currentUser && (
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-[#003d82] rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                  <p className="text-xs text-gray-500">{currentUser.role}</p>
                  {(currentUser.state || currentUser.district) && (
                    <p className="text-xs text-gray-400">
                      {currentUser.district ? `${currentUser.district}, ` : ''}{currentUser.state}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}