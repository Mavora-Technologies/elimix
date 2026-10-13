// apps/web/app/dashboard/layout.tsx
'use client';

import { useState, useEffect } from 'react';
import { AuthProvider } from '@/context/auth-context';
import { AuthGuard } from '@/components/auth/auth-guard';
import { Sidebar } from '@/components/layout/sidebar';
import { TopNav } from '@/components/layout/top-nav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Sync padding dynamically with sidebar collapse state
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed') === 'true';
    setIsSidebarCollapsed(savedState);

    const handleSidebarToggle = (e: any) => {
      setIsSidebarCollapsed(e.detail);
    };

    window.addEventListener('sidebarState', handleSidebarToggle);
    return () => window.removeEventListener('sidebarState', handleSidebarToggle);
  }, []);

  return (
    <AuthProvider>
      <AuthGuard>
        <div className="min-h-screen bg-slate-50 flex flex-col">
          <Sidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />
          <TopNav onOpenMobileMenu={() => setMobileMenuOpen(true)} />
          
          {/* Main Content Area with Dynamic Padding */}
          <main 
            className={`flex-1 transition-all duration-300 ease-in-out ${
              isSidebarCollapsed 
                ? 'md:pl-[80px]' 
                : 'md:pl-64 lg:pl-[260px] xl:pl-[280px]'
            }`}
          >
            <div className="flex-1 w-full h-full p-4 sm:p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>
      </AuthGuard>
    </AuthProvider>
  );
}