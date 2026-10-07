'use client';

import { useState } from 'react';
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

  return (
    <AuthProvider>
      <AuthGuard>
        <div className="min-h-screen bg-gray-50">
          <Sidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />
          <TopNav onOpenMobileMenu={() => setMobileMenuOpen(true)} />
          
          {/* Main Content Area */}
          <main className="md:pl-64">
            {/* REMOVED: mx-auto max-w-7xl and excessive paddings */}
            {/* ADDED: flex-1 w-full h-full to allow edge-to-edge stretching */}
            <div className="flex-1 w-full h-full">
              {children}
            </div>
          </main>
        </div>
      </AuthGuard>
    </AuthProvider>
  );
}