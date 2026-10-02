'use client';

import { useAuth } from '@/context/auth-context';

interface TopNavProps {
  onOpenMobileMenu: () => void;
}

export function TopNav({ onOpenMobileMenu }: TopNavProps) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 flex h-16 flex-shrink-0 border-b bg-white md:pl-64">
      <div className="flex flex-1 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Hamburger Trigger */}
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none"
            aria-label="Open sidebar"
          >
            <i className="fa-solid fa-bars text-xl"></i>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
        </div>
        
        <div className="ml-4 flex items-center gap-4 md:ml-6">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-medium text-gray-900">
              {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Administrator'}
            </span>
            <span className="text-xs text-gray-500 truncate max-w-[180px]">
              {user?.email || ''}
            </span>
          </div>

          <button
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </div>
    </header>
  );
}