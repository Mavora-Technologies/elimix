'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

interface SidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

type NavItem = {
  name: string;
  href?: string;
  icon: string;
  children?: { name: string; href: string }[];
};

const navigation: NavItem[] = [
  { name: 'Overview', href: '/dashboard', icon: 'fa-solid fa-chart-pie' },
  {
    name: 'Student Management',
    icon: 'fa-solid fa-user-graduate',
    children: [
      { name: 'Admissions & Enrollment', href: '/dashboard/students/admissions' },
      { name: 'Student Directory', href: '/dashboard/students' },
      { name: 'Classes & Streams', href: '/dashboard/students/classes' },
      { name: 'Daily Attendance', href: '/dashboard/students/attendance' },
    ],
  },
  {
    name: 'Academics & Teachers',
    icon: 'fa-solid fa-chalkboard-user',
    children: [
      { name: 'Teacher Directory', href: '/dashboard/teachers' },
      { name: 'Class Timetables', href: '/dashboard/academics/timetables' },
      { name: 'Lesson Plans', href: '/dashboard/academics/lesson-plans' },
      { name: 'Coursework & Assignments', href: '/dashboard/academics/assignments' },
    ],
  },
  {
    name: 'Examinations',
    icon: 'fa-solid fa-pen-to-square',
    children: [
      { name: 'Assessments & Exams', href: '/dashboard/exams' },
      { name: 'Marks Entry & Results', href: '/dashboard/exams/results' },
      { name: 'Report Cards & Analytics', href: '/dashboard/exams/reports' },
    ],
  },
  {
    name: 'E-Learning',
    icon: 'fa-solid fa-laptop',
    children: [
      { name: 'Courses & Lessons', href: '/dashboard/e-learning/courses' },
      { name: 'Digital Resources', href: '/dashboard/e-learning/resources' },
      { name: 'Quizzes & Auto-Marking', href: '/dashboard/e-learning/quizzes' },
      { name: 'Student Progress', href: '/dashboard/e-learning/progress' },
    ],
  },
  {
    name: 'Finance & Fees',
    icon: 'fa-solid fa-wallet',
    children: [
      { name: 'Fee Structures', href: '/dashboard/finance/structures' },
      { name: 'Invoices & Billing', href: '/dashboard/finance/invoices' },
      { name: 'Payments & Receipts', href: '/dashboard/finance/payments' },
      { name: 'Statements & Balances', href: '/dashboard/finance/statements' },
      { name: 'Bank Reconciliation', href: '/dashboard/finance/reconciliation' },
    ],
  },
  {
    name: 'Procurement & Stock',
    icon: 'fa-solid fa-cart-shopping',
    children: [
      { name: 'Requests & Approvals', href: '/dashboard/procurement/requests' },
      { name: 'Purchase Orders', href: '/dashboard/procurement/orders' },
      { name: 'Goods Received (GRN)', href: '/dashboard/procurement/grn' },
      { name: 'Inventory & Stock', href: '/dashboard/procurement/inventory' },
      { name: 'Supplier Invoices', href: '/dashboard/procurement/invoices' },
      { name: 'Supplier Payments', href: '/dashboard/procurement/payments' },
    ],
  },
  {
    name: 'Parent Portal',
    icon: 'fa-solid fa-users',
    children: [
      { name: 'Parent Directory', href: '/dashboard/parents' },
      { name: 'Linked Children', href: '/dashboard/parents/children' },
      { name: 'Portal Access Logs', href: '/dashboard/parents/access' },
      { name: 'Notifications & Alerts', href: '/dashboard/parents/notifications' },
    ],
  },
  {
    name: 'Library',
    icon: 'fa-solid fa-book-open',
    children: [
      { name: 'Book Catalog', href: '/dashboard/library/books' },
      { name: 'Borrow & Return', href: '/dashboard/library/circulation' },
      { name: 'Fines & Overdues', href: '/dashboard/library/fines' },
    ],
  },
  {
    name: 'Transport',
    icon: 'fa-solid fa-bus',
    children: [
      { name: 'Routes & Stages', href: '/dashboard/transport/routes' },
      { name: 'Vehicles & Drivers', href: '/dashboard/transport/vehicles' },
      { name: 'Transport Fee Billing', href: '/dashboard/transport/fees' },
    ],
  },
  { name: 'Settings', href: '/dashboard/settings', icon: 'fa-solid fa-gear' },
];

export function Sidebar({ mobileOpen = false, setMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  // Track only one expanded menu at a time
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  // Auto-expand the correct accordion based on the active route
  useEffect(() => {
    const activeParent = navigation.find((item) =>
      item.children?.some((child) => pathname.startsWith(child.href))
    );
    
    if (activeParent) {
      setExpandedMenu(activeParent.name);
    } else {
      setExpandedMenu(null); // Close all if on a root route like Overview or Settings
    }
  }, [pathname]);

  const toggleMenu = (name: string) => {
    // If clicking the currently open menu, close it. Otherwise, open the new one (collapsing the previous).
    setExpandedMenu((prev) => (prev === name ? null : name));
  };

  const navContent = (
    <div className="flex flex-grow flex-col overflow-y-auto px-4 pb-4 pt-5 bg-white h-full border-r border-slate-200">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-2 flex-shrink-0">
        <div className="text-xl font-bold tracking-tight text-slate-900 flex items-center">
          <i className="fa-solid fa-graduation-cap text-blue-600 mr-2.5 text-xl"></i> Elimix
        </div>
        {setMobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus:outline-none"
            aria-label="Close sidebar"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="mt-8 flex-1 space-y-1">
        {navigation.map((item) => {
          // Render Single Root Route (Overview, Settings)
          if (!item.children) {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href!}
                onClick={() => setMobileOpen && setMobileOpen(false)}
                className={`group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <i className={`${item.icon} w-5 mr-3 text-center text-base`}></i>
                {item.name}
              </Link>
            );
          }

          // Render Collapsible Workflow Groups
          const isExpanded = expandedMenu === item.name;
          const hasActiveChild = item.children.some((child) => pathname === child.href);

          return (
            <div key={item.name} className="space-y-1">
              <button
                onClick={() => toggleMenu(item.name)}
                className={`group w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  hasActiveChild
                    ? 'bg-blue-50/70 text-blue-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center">
                  <i className={`${item.icon} w-5 mr-3 text-center text-base`}></i>
                  {item.name}
                </div>
                <i
                  className={`fa-solid fa-chevron-down text-[10px] transition-transform duration-200 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                ></i>
              </button>

              {/* Nested Module Links */}
              {isExpanded && (
                <div className="mt-1 space-y-1 pl-9 border-l border-slate-100 ml-3">
                  {item.children.map((child) => {
                    const isChildActive = pathname === child.href;
                    return (
                      <Link
                        key={child.name}
                        href={child.href}
                        onClick={() => setMobileOpen && setMobileOpen(false)}
                        className={`group flex items-center rounded-md py-1.5 px-3 text-xs font-medium transition-colors ${
                          isChildActive
                            ? 'font-semibold text-blue-600 bg-blue-50/60'
                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        {child.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Persistent Desktop Sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col z-20">
        {navContent}
      </div>

      {/* Mobile Drawer Overlay Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden transition-opacity"
          onClick={() => setMobileOpen && setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer Panel */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {navContent}
      </div>
    </>
  );
}