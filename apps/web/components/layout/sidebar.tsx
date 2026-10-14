// apps/web/components/layout/sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@/context/auth-context';

interface SidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

type NavChild = {
  name: string;
  href: string;
  description?: string;
};

type NavItem = {
  name: string;
  href?: string;
  icon: string;
  description?: string;
  children?: NavChild[];
};

type NavSection = {
  title: string;
  items: NavItem[];
};

/* ==========================================================================
   ELIMIX BRAND
   ========================================================================== */

const BRAND = {
  navy: '#012E54',
  blue: '#006FBF',
  brightBlue: '#0088CE',
  cyan: '#04B1D6',
  teal: '#0199B9',
};

/* ==========================================================================
   NAVIGATION
   ========================================================================== */

const navigationSections: NavSection[] = [
  {
    title: 'Workspace',
    items: [
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: 'fa-solid fa-chart-pie',
        description: 'School overview and key metrics',
      },
    ],
  },
  {
    title: 'People & Students',
    items: [
      {
        name: 'Student Management',
        icon: 'fa-solid fa-user-graduate',
        description: 'Students, admissions, classes and attendance',
        children: [
          { name: 'Admissions & Enrollment', href: '/dashboard/students/admissions' },
          { name: 'Student Directory', href: '/dashboard/students' },
          { name: 'Classes & Streams', href: '/dashboard/students/classes' },
          { name: 'Daily Attendance', href: '/dashboard/students/attendance' },
        ],
      },
      {
        name: 'Parent Portal',
        icon: 'fa-solid fa-users',
        description: 'Parents, guardians and portal access',
        children: [
          { name: 'Parent Directory', href: '/dashboard/parents' },
          { name: 'Linked Children', href: '/dashboard/parents/children' },
          { name: 'Portal Access Logs', href: '/dashboard/parents/access' },
          { name: 'Notifications & Alerts', href: '/dashboard/parents/notifications' },
        ],
      },
    ],
  },
  {
    title: 'Academics',
    items: [
      {
        name: 'Academics & Teachers',
        icon: 'fa-solid fa-chalkboard-user',
        description: 'Teachers, timetables, lessons and coursework',
        children: [
          { name: 'Teacher Directory', href: '/dashboard/teachers' },
          { name: 'Departments', href: '/dashboard/academics/departments' },
          { name: 'Subjects', href: '/dashboard/academics/subjects' },
          { name: 'Timetables', href: '/dashboard/academics/timetables' },
          { name: 'Lesson Plans', href: '/dashboard/academics/lesson-plans' },
          { name: 'Coursework & Assignments', href: '/dashboard/academics/assignments' },
        ],
      },
      {
        name: 'Examinations',
        icon: 'fa-solid fa-pen-to-square',
        description: 'Assessments, marks, results and reports',
        children: [
          { name: 'Assessments & Exams', href: '/dashboard/exams' },
          { name: 'Marks Entry & Results', href: '/dashboard/exams/results' },
          { name: 'Report Cards & Analytics', href: '/dashboard/exams/reports' },
        ],
      },
      {
        name: 'E-Learning',
        icon: 'fa-solid fa-laptop',
        description: 'Digital learning and student progress',
        children: [
          { name: 'Courses & Lessons', href: '/dashboard/e-learning/courses' },
          { name: 'Digital Resources', href: '/dashboard/e-learning/resources' },
          { name: 'Quizzes & Auto-Marking', href: '/dashboard/e-learning/quizzes' },
          { name: 'Student Progress', href: '/dashboard/e-learning/progress' },
        ],
      },
    ],
  },
  {
    title: 'Operations',
    items: [
      {
        name: 'Finance & Fees',
        icon: 'fa-solid fa-wallet',
        description: 'Fees, billing, payments and reconciliation',
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
        description: 'Purchasing, suppliers and inventory',
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
        name: 'Library',
        icon: 'fa-solid fa-book-open',
        description: 'Books, circulation and fines',
        children: [
          {name: 'Center Overview', href: '/dashboard/library'},
          { name: 'Book Catalog', href: '/dashboard/library/books' },
          { name: 'Borrow & Return', href: '/dashboard/library/circulation' },
          { name: 'Fines & Overdues', href: '/dashboard/library/fines' },
        ],
      },
      {
        name: 'Human Resources',
        icon: 'fa-solid fa-user-tie',
        description: 'Staff records, attendance, leave and payroll',
        children: [
          { name: 'HR Dashboard', href: '/dashboard/hr' },
          { name: 'Staff Directory', href: '/dashboard/hr/staff' },
          { name: 'Departments & Positions', href: '/dashboard/hr/departments' },
          { name: 'Staff Attendance', href: '/dashboard/hr/attendance' },
          { name: 'Leave Management', href: '/dashboard/hr/leave' },
          { name: 'Payroll', href: '/dashboard/hr/payroll' },
          { name: 'Contracts & Documents', href: '/dashboard/hr/contracts' },
          { name: 'Performance Management', href: '/dashboard/hr/performance' },
          { name: 'Recruitment', href: '/dashboard/hr/recruitment' },
        ],
      },
      {
        name: 'Hostel & Boarding',
        icon: 'fa-solid fa-bed',
        description: 'Hostels, rooms, boarding students and welfare',
        children: [
          { name: 'Hostel Dashboard', href: '/dashboard/hostel' },
          { name: 'Hostels & Houses', href: '/dashboard/hostel/hostels' },
          { name: 'Rooms & Beds', href: '/dashboard/hostel/rooms' },
          { name: 'Boarding Students', href: '/dashboard/hostel/students' },
          { name: 'Room Allocation', href: '/dashboard/hostel/allocation' },
          { name: 'Check-In & Check-Out', href: '/dashboard/hostel/check-in-out' },
          { name: 'Hostel Attendance', href: '/dashboard/hostel/attendance' },
          { name: 'Meals & Dining', href: '/dashboard/hostel/meals' },
          { name: 'Hostel Fees', href: '/dashboard/hostel/fees' },
          { name: 'Welfare & Incidents', href: '/dashboard/hostel/incidents' },
          { name: 'Hostel Staff', href: '/dashboard/hostel/staff' },
        ],
      },
      {
        name: 'Transport',
        icon: 'fa-solid fa-bus',
        description: 'Routes, vehicles and transport fees',
        children: [
          {name: 'Fleet Overview', href: '/dashboard/transport/fleet' },
          { name: 'Routes & Stages', href: '/dashboard/transport/routes' },
          { name: 'Vehicles & Drivers', href: '/dashboard/transport/vehicles' },
          { name: 'Transport Fee Billing', href: '/dashboard/transport/fees' },
      
        ],
      },
    ],
  },
  {
    title: 'Reports & Analytics',
    items: [
      {
        name: 'Academic Reports',
        icon: 'fa-solid fa-chart-line',
        description: 'Performance, exam analysis and progress',
        children: [
          { name: 'Exam Performance', href: '/dashboard/reports/academics/exams' },
          { name: 'Subject Analysis', href: '/dashboard/reports/academics/subjects' },
          { name: 'Teacher Performance', href: '/dashboard/reports/academics/teachers' },
        ],
      },
      {
        name: 'Financial Reports',
        icon: 'fa-solid fa-file-invoice-dollar',
        description: 'Revenue, collections and expenses',
        children: [
          { name: 'Fee Collections', href: '/dashboard/reports/finance/collections' },
          { name: 'Fee Defaulters', href: '/dashboard/reports/finance/defaulters' },
          { name: 'Income & Expenditure', href: '/dashboard/reports/finance/income-expenditure' },
        ],
      },
      {
        name: 'Student & Population',
        icon: 'fa-solid fa-chart-user',
        description: 'Demographics, enrollment and attendance',
        children: [
          { name: 'Enrollment Statistics', href: '/dashboard/reports/students/enrollment' },
          { name: 'Attendance Registers', href: '/dashboard/reports/students/attendance' },
          { name: 'Discipline & Welfare', href: '/dashboard/reports/students/discipline' },
        ],
      },
      {
        name: 'Operational Reports',
        icon: 'fa-solid fa-clipboard-list',
        description: 'Transport, hostel, library and inventory',
        children: [
          { name: 'Hostel Occupancy', href: '/dashboard/reports/operations/hostel' },
          { name: 'Transport Utilization', href: '/dashboard/reports/operations/transport' },
          { name: 'Inventory Consumption', href: '/dashboard/reports/operations/inventory' },
        ],
      },
      {
        name: 'Custom Reports',
        icon: 'fa-solid fa-filter',
        description: 'Build and export custom data',
        children: [
          { name: 'Report Builder', href: '/dashboard/reports/custom/builder' },
          { name: 'Scheduled Exports', href: '/dashboard/reports/custom/scheduled' },
        ],
      },
    ],
  },
  {
    title: 'Security & Access',
    items: [
      {
        name: 'User Management',
        icon: 'fa-solid fa-user-shield',
        description: 'System users, administrative roles, permissions and audit trails',
        children: [
          { name: 'User Directory', href: '/dashboard/users' },
          { name: 'Roles & Permissions', href: '/dashboard/users/roles' },
          { name: 'Access Control (ACL)', href: '/dashboard/users/acl' },
          { name: 'Authentication & Security', href: '/dashboard/users/security' },
          { name: 'Audit Logs & Activity', href: '/dashboard/users/audit-logs' },
          { name: 'API Tokens & Integrations', href: '/dashboard/users/api-keys' },
        ],
      },
    ],
  },
  {
    title: 'System & Support',
    items: [
      {
        name: 'Help & Support',
        icon: 'fa-solid fa-life-ring',
        description: 'Knowledge base and support tickets',
        children: [
          { name: 'Knowledge Base', href: '/dashboard/support' },
          { name: 'My Tickets', href: '/dashboard/support/tickets' },
        ],
      },
      {
        name: 'Settings',
        href: '/dashboard/settings',
        icon: 'fa-solid fa-gear',
        description: 'System and account settings',
      },
    ],
  },
];

/* ==========================================================================
   HELPERS
   ========================================================================== */

type SearchResult = {
  name: string;
  href: string;
  icon: string;
  parentName?: string;
  description?: string;
};

const allNavigationItems: SearchResult[] = navigationSections.flatMap((section) =>
  section.items.flatMap((item) => {
    const parentRoute: SearchResult[] = item.href
      ? [{ name: item.name, href: item.href, icon: item.icon, description: item.description }]
      : [];

    const children: SearchResult[] =
      item.children?.map((child) => ({
        name: child.name,
        href: child.href,
        icon: item.icon,
        parentName: item.name,
        description: child.description,
      })) ?? [];

    return [...parentRoute, ...children];
  }),
);

function routeMatches(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function itemContainsActiveRoute(pathname: string, item: NavItem) {
  if (item.href) return routeMatches(pathname, item.href);
  return item.children?.some((child) => routeMatches(pathname, child.href)) ?? false;
}

/* ==========================================================================
   SIDEBAR COMPONENT
   ========================================================================== */

export function Sidebar({ mobileOpen = false, setMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  /* ------------------------------------------------------------------------
     Sidebar Collapse Global Sync
     ------------------------------------------------------------------------ */
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed') === 'true';
    setIsCollapsed(savedState);
    window.dispatchEvent(new CustomEvent('sidebarState', { detail: savedState }));
  }, []);

  const toggleCollapse = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    localStorage.setItem('sidebarCollapsed', String(nextState));
    window.dispatchEvent(new CustomEvent('sidebarState', { detail: nextState }));
    
    // Automatically close any open submenus when collapsing
    if (nextState) {
      setWorkspaceOpen(false);
      setQuickActionsOpen(false);
      setUserMenuOpen(false);
    }
  };

  /* ------------------------------------------------------------------------
     Active Accordion Expansion
     ------------------------------------------------------------------------ */
  useEffect(() => {
    const activeParent = navigationSections
      .flatMap((section) => section.items)
      .find((item) => item.children?.some((child) => routeMatches(pathname, child.href)));

    if (activeParent && !isCollapsed) {
      setExpandedMenu(activeParent.name);
    }
  }, [pathname, isCollapsed]);

  /* ------------------------------------------------------------------------
     Keyboard Shortcut (CMD/CTRL + K)
     ------------------------------------------------------------------------ */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().includes('MAC');
      const modifierPressed = isMac ? event.metaKey : event.ctrlKey;

      if (modifierPressed && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (isCollapsed) toggleCollapse();
        searchInputRef.current?.focus();
      }

      if (event.key === 'Escape') {
        setSearchQuery('');
        setWorkspaceOpen(false);
        setQuickActionsOpen(false);
        setUserMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCollapsed]);

  /* ------------------------------------------------------------------------
     Mobile Reset
     ------------------------------------------------------------------------ */
  useEffect(() => {
    if (mobileOpen) {
      setWorkspaceOpen(false);
      setQuickActionsOpen(false);
      setUserMenuOpen(false);
    }
  }, [pathname, mobileOpen]);

  /* ------------------------------------------------------------------------
     Search Logic
     ------------------------------------------------------------------------ */
  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    const seenRoutes = new Set<string>();

    return allNavigationItems
      .filter((item) => {
        return (
          item.name.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.parentName?.toLowerCase().includes(query)
        );
      })
      .filter((item) => {
        if (seenRoutes.has(item.href)) return false;
        seenRoutes.add(item.href);
        return true;
      })
      .slice(0, 10);
  }, [searchQuery]);

  /* ------------------------------------------------------------------------
     Interaction Handlers
     ------------------------------------------------------------------------ */
  const closeMobileSidebar = () => setMobileOpen?.(false);

  const handleNavigation = () => {
    setSearchQuery('');
    setWorkspaceOpen(false);
    setQuickActionsOpen(false);
    setUserMenuOpen(false);
    closeMobileSidebar();
  };

  const toggleMenu = (name: string) => {
    if (isCollapsed) {
      toggleCollapse();
      setExpandedMenu(name);
    } else {
      setExpandedMenu((previous) => (previous === name ? null : name));
    }
    setWorkspaceOpen(false);
    setQuickActionsOpen(false);
    setUserMenuOpen(false);
  };

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
  };

  /* ------------------------------------------------------------------------
     User Information
     ------------------------------------------------------------------------ */
  const displayName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Administrator';
  const initials = user?.firstName ? `${user.firstName.charAt(0)}${user.lastName?.charAt(0) || ''}`.toUpperCase() : 'AD';

  /* ==========================================================================
     RENDER PARTIALS
     ========================================================================== */

  const brandHeader = (
    <div className={`flex h-16 flex-shrink-0 items-center ${isCollapsed ? 'justify-center' : 'justify-between px-1'}`}>
      <Link href="/dashboard" onClick={handleNavigation} className={`group flex items-center rounded-xl transition-all ${isCollapsed ? 'justify-center' : ''}`} aria-label="Elimix Dashboard">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-sm transition-transform duration-200 group-hover:scale-105 flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${BRAND.navy} 0%, ${BRAND.blue} 52%, ${BRAND.cyan} 100%)` }}
        >
          <i className="fa-solid fa-graduation-cap text-[15px]" />
        </span>
        {!isCollapsed && (
          <span className="ml-3 flex flex-col leading-none whitespace-nowrap overflow-hidden transition-opacity duration-300">
            <span
              className="bg-clip-text text-[18px] font-bold tracking-tight text-transparent"
              style={{ backgroundImage: `linear-gradient(90deg, ${BRAND.navy}, ${BRAND.blue}, ${BRAND.cyan})` }}
            >
              Elimix
            </span>
            <span className="mt-1 text-[8.5px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              School Management
            </span>
          </span>
        )}
      </Link>

      {setMobileOpen && (
        <button
          type="button"
          onClick={closeMobileSidebar}
          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 md:hidden"
          aria-label="Close sidebar"
        >
          <i className="fa-solid fa-xmark text-lg" />
        </button>
      )}
    </div>
  );

  const workspaceSwitcher = (
    <div className={`relative mt-2 ${isCollapsed ? 'flex justify-center' : ''}`}>
      <button
        type="button"
        onClick={() => {
          if (isCollapsed) toggleCollapse();
          else setWorkspaceOpen((prev) => !prev);
          setQuickActionsOpen(false);
          setUserMenuOpen(false);
        }}
        title={isCollapsed ? "Switch Workspace" : undefined}
        className={`flex items-center rounded-xl border border-slate-200 bg-slate-50/80 transition-all hover:border-slate-300 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#006FBF]/15 shadow-sm ${
          isCollapsed ? 'w-10 h-10 justify-center p-0' : 'w-full px-2.5 py-2.5 text-left'
        }`}
        aria-expanded={workspaceOpen}
      >
        <span
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-white shadow-sm"
          style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})` }}
        >
          <i className="fa-solid fa-school text-xs" />
        </span>
        {!isCollapsed && (
          <span className="ml-2.5 min-w-0 flex-1 whitespace-nowrap overflow-hidden transition-opacity duration-300">
            <span className="block truncate text-[13px] font-bold text-slate-800">Elimix Workspace</span>
            <span className="mt-[1px] block truncate text-[10px] font-medium text-slate-500">School Administration</span>
          </span>
        )}
        {!isCollapsed && <i className={`fa-solid fa-chevron-down ml-2 text-[10px] text-slate-400 transition-transform duration-200 ${workspaceOpen ? 'rotate-180' : ''}`} />}
      </button>

      {workspaceOpen && !isCollapsed && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg shadow-slate-900/5">
          <div className="px-2.5 py-2">
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">Workspace</p>
          </div>
          <div className="flex items-center rounded-lg bg-[#006FBF]/5 px-2.5 py-2">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${BRAND.navy}, ${BRAND.blue})` }}
            >
              <i className="fa-solid fa-school text-xs" />
            </span>
            <span className="ml-2.5 min-w-0 flex-1">
              <span className="block truncate text-[13px] font-bold text-slate-800">Elimix Workspace</span>
              <span className="block truncate text-[10px] text-slate-500">Current school</span>
            </span>
            <i className="fa-solid fa-check text-xs text-[#006FBF]" />
          </div>
          <div className="my-1.5 border-t border-slate-100" />
          <Link
            href="/dashboard/settings"
            onClick={handleNavigation}
            className="flex w-full items-center rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            <i className="fa-solid fa-building mr-2.5 w-4 text-center text-slate-400" />
            Workspace settings
          </Link>
        </div>
      )}
    </div>
  );

  const searchBox = (
    <div className={`relative mt-4 ${isCollapsed ? 'flex justify-center' : ''}`}>
      <div 
        className={`flex items-center rounded-lg border bg-white transition-all shadow-sm ${
          searchQuery ? 'border-[#006FBF]/40 ring-2 ring-[#006FBF]/10' : 'border-slate-200 hover:border-slate-300'
        } ${isCollapsed ? 'h-9 w-9 justify-center cursor-pointer' : 'h-9 w-full'}`}
        onClick={() => { if (isCollapsed) toggleCollapse(); searchInputRef.current?.focus(); }}
        title={isCollapsed ? "Search (Cmd+K)" : undefined}
      >
        <i className={`fa-solid fa-magnifying-glass text-xs text-[#006FBF] ${!isCollapsed && 'ml-3'}`} />
        {!isCollapsed && (
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search menu..."
            className="min-w-0 flex-1 bg-transparent px-2 text-[13px] text-slate-700 outline-none placeholder:text-slate-400 font-medium"
          />
        )}
        {!isCollapsed && !searchQuery && (
          <kbd className="mr-2 hidden rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[9px] font-bold text-slate-400 sm:inline-block">
            ⌘K
          </kbd>
        )}
        {!isCollapsed && searchQuery && (
          <button type="button" onClick={(e) => { e.stopPropagation(); setSearchQuery(''); searchInputRef.current?.focus(); }} className="mr-2 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <i className="fa-solid fa-xmark text-xs" />
          </button>
        )}
      </div>

      {searchQuery && !isCollapsed && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[60vh] overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg shadow-slate-900/5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
          {searchResults.length > 0 ? (
            <>
              <div className="px-2.5 py-2">
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">Search results</p>
              </div>
              {searchResults.map((result) => (
                <Link
                  key={`search-${result.href}`}
                  href={result.href}
                  onClick={handleNavigation}
                  className="flex items-center rounded-lg px-2.5 py-2 transition-colors hover:bg-slate-50 group"
                >
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-slate-100/80 text-slate-500 group-hover:bg-white group-hover:shadow-sm">
                    <i className={`${result.icon} text-[11px]`} />
                  </span>
                  <span className="ml-2.5 min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold text-slate-700">{result.name}</span>
                    {result.parentName && <span className="block truncate text-[10px] text-slate-400 font-medium">{result.parentName}</span>}
                  </span>
                  <i className="fa-solid fa-arrow-up-right-from-square ml-2 text-[10px] text-slate-300 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              ))}
            </>
          ) : (
            <div className="px-4 py-8 text-center">
              <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-300 mb-2">
                <i className="fa-solid fa-magnifying-glass text-sm" />
              </span>
              <p className="text-[13px] font-semibold text-slate-700">No results found</p>
              <p className="mt-1 text-[11px] text-slate-400 font-medium">Try searching for students, fees, or exams.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderNavigationItem = (item: NavItem) => {
    const hasChildren = Boolean(item.children?.length);
    const isActive = itemContainsActiveRoute(pathname, item);
    const isExpanded = expandedMenu === item.name;

    if (!hasChildren && item.href) {
      const exactActive = pathname === item.href;
      return (
        <Link
          key={item.href}
          href={item.href}
          onClick={handleNavigation}
          title={isCollapsed ? item.name : undefined}
          className={`group relative flex min-h-10 items-center rounded-lg transition-all duration-200 ${
            exactActive ? 'bg-[#006FBF]/10 text-[#006FBF]' : 'text-slate-600 hover:bg-slate-100/60 hover:text-slate-900'
          } ${isCollapsed ? 'justify-center px-0 w-10 h-10 mx-auto' : 'px-2.5 py-2'}`}
        >
          {exactActive && <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-[#006FBF]" />}
          <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md transition-colors ${exactActive ? 'text-[#006FBF]' : 'text-slate-400 group-hover:text-slate-600'}`}>
            <i className={`${item.icon} text-[13px]`} />
          </span>
          {!isCollapsed && <span className="ml-2.5 min-w-0 flex-1 truncate text-[13px] font-semibold whitespace-nowrap">{item.name}</span>}
        </Link>
      );
    }

    return (
      <div key={item.name} className="space-y-0.5">
        <button
          type="button"
          onClick={() => toggleMenu(item.name)}
          title={isCollapsed ? item.name : undefined}
          className={`group relative flex min-h-10 items-center rounded-lg transition-all duration-200 ${
            isActive ? 'bg-[#006FBF]/5 text-[#006FBF]' : 'text-slate-600 hover:bg-slate-100/60 hover:text-slate-900'
          } ${isCollapsed ? 'w-10 h-10 justify-center px-0 mx-auto' : 'w-full px-2.5 py-2 text-left'}`}
        >
          {isActive && <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-[#006FBF]" />}
          <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md transition-colors ${isActive ? 'text-[#006FBF]' : 'text-slate-400 group-hover:text-slate-600'}`}>
            <i className={`${item.icon} text-[13px]`} />
          </span>
          {!isCollapsed && <span className="ml-2.5 min-w-0 flex-1 truncate text-[13px] font-semibold whitespace-nowrap">{item.name}</span>}
          {!isCollapsed && <i className={`fa-solid fa-chevron-down text-[10px] transition-transform duration-200 ${isExpanded ? 'rotate-180 text-[#006FBF]' : 'text-slate-300 group-hover:text-slate-500'}`} />}
        </button>

        {!isCollapsed && isExpanded && item.children && (
          <div className="ml-5 border-l-2 border-slate-100 pl-2.5 py-1 space-y-0.5 transition-all">
            {item.children.map((child) => {
              const childActive = routeMatches(pathname, child.href);
              return (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={handleNavigation}
                  className={`group relative flex min-h-[34px] items-center rounded-md px-2.5 py-1.5 transition-colors ${
                    childActive ? 'bg-[#006FBF]/10 text-[#006FBF]' : 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-800'
                  }`}
                >
                  {childActive && <span className="absolute -left-[12px] h-4 w-0.5 rounded-full bg-[#04B1D6]" />}
                  <span className={`mr-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full transition-colors ${childActive ? 'bg-[#04B1D6]' : 'bg-slate-300 group-hover:bg-slate-400'}`} />
                  <span className={`truncate text-[13px] ${childActive ? 'font-bold' : 'font-medium'}`}>{child.name}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const navigation = (
    <nav className="mt-5 min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-2 pb-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
      {searchQuery && !isCollapsed ? (
        <div className="hidden" />
      ) : (
        <div className="space-y-6">
          {navigationSections.map((section) => (
            <div key={section.title}>
              {isCollapsed ? (
                <div className="mx-auto my-3 h-px w-6 bg-slate-200" />
              ) : (
                <div className="mb-2 px-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 whitespace-nowrap">{section.title}</p>
                </div>
              )}
              <div className="space-y-1">
                {section.items.map(renderNavigationItem)}
              </div>
            </div>
          ))}
        </div>
      )}
    </nav>
  );

  const quickActions = (
    <div className={`relative mt-4 flex-shrink-0 ${isCollapsed ? 'flex justify-center' : 'pr-2'}`}>
      <button
        type="button"
        onClick={() => {
          if (isCollapsed) toggleCollapse();
          else setQuickActionsOpen((prev) => !prev);
          setWorkspaceOpen(false);
          setUserMenuOpen(false);
        }}
        title={isCollapsed ? "Quick Actions" : undefined}
        className={`flex items-center rounded-xl border border-[#006FBF]/15 bg-gradient-to-r from-[#006FBF]/10 to-[#04B1D6]/10 transition-all hover:border-[#006FBF]/25 hover:from-[#006FBF]/15 hover:to-[#04B1D6]/15 focus:outline-none focus:ring-2 focus:ring-[#006FBF]/10 ${
          isCollapsed ? 'w-10 h-10 justify-center p-0' : 'w-full px-3 py-2.5 justify-between'
        }`}
        aria-expanded={quickActionsOpen}
      >
        <span className={`flex items-center ${isCollapsed ? 'justify-center w-full' : ''}`}>
          <span
            className="flex h-7 w-7 items-center justify-center rounded-md text-white shadow-sm flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})` }}
          >
            <i className="fa-solid fa-bolt text-xs" />
          </span>
          {!isCollapsed && <span className="ml-2.5 text-[13px] font-bold text-[#006FBF] whitespace-nowrap">Quick Action</span>}
        </span>
        {!isCollapsed && <i className={`fa-solid fa-chevron-down text-[10px] text-[#006FBF]/60 transition-transform ${quickActionsOpen ? 'rotate-180' : ''}`} />}
      </button>

      {quickActionsOpen && !isCollapsed && (
        <div className="absolute bottom-full left-0 right-0 z-50 mb-2 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg shadow-slate-900/5">
          <p className="px-2.5 py-2 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">Shortcuts</p>
          <div className="space-y-0.5">
            <Link href="/dashboard/students/admissions" onClick={handleNavigation} className="flex items-center rounded-lg px-2.5 py-2 text-[13px] font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900">
              <i className="fa-solid fa-user-plus w-5 text-center text-slate-400 mr-2" /> Add Student
            </Link>
            <Link href="/dashboard/finance/payments" onClick={handleNavigation} className="flex items-center rounded-lg px-2.5 py-2 text-[13px] font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900">
              <i className="fa-solid fa-money-bill-transfer w-5 text-center text-slate-400 mr-2" /> Record Payment
            </Link>
            <Link href="/dashboard/exams" onClick={handleNavigation} className="flex items-center rounded-lg px-2.5 py-2 text-[13px] font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900">
              <i className="fa-solid fa-file-circle-plus w-5 text-center text-slate-400 mr-2" /> Create Assessment
            </Link>
            <Link href="/dashboard/parents/notifications" onClick={handleNavigation} className="flex items-center rounded-lg px-2.5 py-2 text-[13px] font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900">
              <i className="fa-solid fa-bullhorn w-5 text-center text-slate-400 mr-2" /> Send Announcement
            </Link>
            <Link href="/dashboard/support" onClick={handleNavigation} className="flex items-center rounded-lg px-2.5 py-2 text-[13px] font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900">
              <i className="fa-solid fa-life-ring w-5 text-center text-slate-400 mr-2" /> Get Support
            </Link>
          </div>
        </div>
      )}
    </div>
  );

  const footer = (
    <div className={`mt-4 flex-shrink-0 border-t border-slate-100 pt-3 pb-3 ${isCollapsed ? 'flex flex-col items-center gap-2' : 'pr-2'}`}>
      <Link
        href="/dashboard/parents/notifications"
        onClick={handleNavigation}
        title={isCollapsed ? "Notifications" : undefined}
        className={`group flex items-center rounded-xl transition-colors hover:bg-slate-50 hover:text-slate-900 ${isCollapsed ? 'justify-center w-10 h-10 px-0' : 'min-h-10 px-2.5 py-2 text-slate-600'}`}
      >
        <span className="relative flex h-7 w-7 flex-shrink-0 items-center justify-center text-slate-400 group-hover:text-[#006FBF]">
          <i className="fa-solid fa-bell text-[14px]" />
        </span>
        {!isCollapsed && <span className="ml-2.5 text-[13px] font-bold whitespace-nowrap">Notifications</span>}
      </Link>

      <div className={`relative ${isCollapsed ? 'w-10' : 'mt-1 w-full'}`}>
        <button
          type="button"
          onClick={() => {
            if (isCollapsed) toggleCollapse();
            else setUserMenuOpen((prev) => !prev);
            setWorkspaceOpen(false);
            setQuickActionsOpen(false);
          }}
          title={isCollapsed ? "Profile & Settings" : undefined}
          className={`flex items-center rounded-xl border border-transparent transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#006FBF]/15 ${isCollapsed ? 'justify-center w-10 h-10 p-0' : 'w-full px-2.5 py-2.5 text-left'}`}
        >
          <span
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white shadow-sm"
            style={{ background: `linear-gradient(135deg, ${BRAND.navy}, ${BRAND.blue})` }}
          >
            {initials}
          </span>
          {!isCollapsed && (
            <span className="ml-3 min-w-0 flex-1 whitespace-nowrap overflow-hidden transition-opacity duration-300">
              <span className="block truncate text-[13px] font-bold text-slate-800">{displayName}</span>
              <span className="block truncate text-[10px] font-medium text-slate-500 mt-0.5">{user?.email || 'Administrator'}</span>
            </span>
          )}
          {!isCollapsed && <i className={`fa-solid fa-ellipsis text-slate-400 transition-transform ${userMenuOpen ? 'rotate-90' : ''}`} />}
        </button>

        {userMenuOpen && !isCollapsed && (
          <div className="absolute bottom-full left-0 right-0 z-50 mb-2 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg shadow-slate-900/5">
            <div className="px-3 py-2.5">
              <p className="truncate text-[13px] font-bold text-slate-800">{displayName}</p>
              <p className="truncate text-[11px] font-medium text-slate-500 mt-0.5">{user?.email || ''}</p>
            </div>
            <div className="my-1 border-t border-slate-100" />
            <Link
              href="/dashboard/settings"
              onClick={handleNavigation}
              className="flex items-center rounded-lg px-3 py-2 text-[13px] font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
              <i className="fa-solid fa-sliders w-5 text-center text-slate-400 mr-2" /> Account Settings
            </Link>
            <div className="my-1 border-t border-slate-100" />
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center rounded-lg px-3 py-2 text-left text-[13px] font-bold text-rose-600 transition-colors hover:bg-rose-50"
            >
              <i className="fa-solid fa-right-from-bracket w-5 text-center mr-2" /> Log out
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const sidebarContent = (
    <div className={`flex h-full min-h-0 flex-col bg-white shadow-[1px_0_0_0_rgba(0,0,0,0.05)] relative z-20 transition-all duration-300 ${isCollapsed ? 'px-2 pt-4' : 'pl-4 pt-4'}`}>
      
      {/* COLLAPSE/EXPAND TOGGLE BUTTON */}
      <button
        onClick={toggleCollapse}
        className="hidden md:flex absolute -right-3 top-8 z-50 h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 hover:text-[#006FBF] shadow-sm transition-transform hover:scale-110"
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        <i className={`fa-solid fa-chevron-${isCollapsed ? 'right' : 'left'} text-[10px]`}></i>
      </button>

      {brandHeader}
      <div className={isCollapsed ? '' : 'pr-2'}>
        {workspaceSwitcher}
        {searchBox}
      </div>
      {navigation}
      {quickActions}
      {footer}
    </div>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-30 hidden flex-col bg-white md:flex transition-all duration-300 ease-in-out ${isCollapsed ? 'w-[80px]' : 'w-64 lg:w-[260px] xl:w-[280px]'}`}>
        {sidebarContent}
      </aside>

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 md:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* MOBILE SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] sm:w-[320px] max-w-[85vw] flex-col bg-white shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] md:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Mobile navigation"
      >
        {sidebarContent}
      </aside>
    </>
  );
}