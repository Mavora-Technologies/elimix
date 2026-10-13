// apps/web/components/layout/top-nav.tsx
'use client';

import { useAuth } from '@/context/auth-context';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useMemo } from 'react';

const BRAND = {
  navy: '#012E54',
  blue: '#006FBF',
  brightBlue: '#0088CE',
  cyan: '#04B1D6',
  teal: '#0199B9',
};

interface TopNavProps {
  onOpenMobileMenu: () => void;
}

export function TopNav({ onOpenMobileMenu }: TopNavProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // Generate dynamic breadcrumbs based on the current URL
  const breadcrumbs = useMemo(() => {
    if (!pathname || pathname === '/') return ['Dashboard'];
    const segments = pathname.split('/').filter(Boolean);
    return segments.map((segment) => 
      segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
    );
  }, [pathname]);

  const currentPageTitle = breadcrumbs[breadcrumbs.length - 1] || 'Dashboard';

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : 'Administrator';

  const initials = user?.firstName
    ? `${user.firstName.charAt(0)}${user.lastName?.charAt(0) || ''}`.toUpperCase()
    : 'AD';

  return (
    <header className="sticky top-0 z-20 flex h-[72px] flex-shrink-0 items-center border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all duration-300 md:pl-64 lg:pl-[260px] xl:pl-[280px]">
      <div className="flex flex-1 items-center justify-between px-4 sm:px-6 lg:px-8 h-full">
        
        {/* Left Section: Mobile Trigger & Breadcrumbs */}
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#006FBF]/20 transition-colors"
            aria-label="Open sidebar"
          >
            <i className="fa-solid fa-bars text-lg"></i>
          </button>
          
          <div className="hidden sm:flex flex-col">
            <div className="flex items-center text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">
              {breadcrumbs.map((crumb, index) => (
                <span key={index} className="flex items-center">
                  {index > 0 && <i className="fa-solid fa-chevron-right text-[8px] mx-1.5 opacity-50"></i>}
                  <span className={index === breadcrumbs.length - 1 ? "text-[#006FBF]" : ""}>
                    {crumb}
                  </span>
                </span>
              ))}
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 truncate max-w-[300px]">
              {currentPageTitle}
            </h1>
          </div>
        </div>
        
        {/* Right Section: Global Search, Quick Actions & Profile */}
        <div className="flex items-center gap-3 sm:gap-5">
          
          {/* Global Search (Hidden on Mobile) */}
          <div className="hidden lg:flex items-center relative mr-2">
            <i className="fa-solid fa-magnifying-glass absolute left-3 text-xs text-slate-400"></i>
            <input 
              type="text" 
              placeholder="Search students, staff, or invoices..." 
              className="h-10 w-64 rounded-full border border-slate-200 bg-slate-50 pl-9 pr-4 text-xs font-medium text-slate-700 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 hover:bg-white focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10"
            />
            <div className="absolute right-2 flex items-center justify-center rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[9px] font-bold text-slate-400 shadow-sm">
              ⌘K
            </div>
          </div>

          <div className="h-6 w-px bg-slate-200 hidden sm:block mx-1"></div>

          {/* Quick Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link 
              href="/dashboard/support"
              className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              title="Help & Support"
            >
              <i className="fa-regular fa-circle-question text-[15px]"></i>
            </Link>
            
            <Link 
              href="/dashboard/parents/notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              title="Notifications"
            >
              <i className="fa-regular fa-bell text-[15px]"></i>
              <span className="absolute right-2 top-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500 border border-white"></span>
              </span>
            </Link>
          </div>

          <div className="h-6 w-px bg-slate-200 hidden sm:block mx-1"></div>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-4 pl-1">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[13px] font-bold text-slate-900 leading-tight">
                {displayName}
              </span>
              <span className="text-[11px] font-medium text-slate-500">
                {user?.isSuperAdmin ? 'Platform Admin' : 'Institution Admin'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div 
                className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm ring-2 ring-white"
                style={{ background: `linear-gradient(135deg, ${BRAND.navy}, ${BRAND.blue})` }}
              >
                {initials}
              </div>

              <button
                onClick={logout}
                className="hidden md:flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-600 shadow-sm transition-all hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                title="Secure Logout"
              >
                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                <span>Logout</span>
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </header>
  );
}