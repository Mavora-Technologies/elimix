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
  /* ------------------------------------------------------------------------
     WORKSPACE
     ------------------------------------------------------------------------ */

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

  /* ------------------------------------------------------------------------
     PEOPLE & STUDENTS
     ------------------------------------------------------------------------ */

  {
    title: 'People & Students',
    items: [
      {
        name: 'Student Management',
        icon: 'fa-solid fa-user-graduate',
        description: 'Students, admissions, classes and attendance',
        children: [
          {
            name: 'Admissions & Enrollment',
            href: '/dashboard/students/admissions',
            description: 'Manage student applications and enrollment',
          },
          {
            name: 'Student Directory',
            href: '/dashboard/students',
            description: 'Search and manage students',
          },
          {
            name: 'Classes & Streams',
            href: '/dashboard/students/classes',
            description: 'Manage classes and streams',
          },
          {
            name: 'Daily Attendance',
            href: '/dashboard/students/attendance',
            description: 'Record and review daily attendance',
          },
        ],
      },

      {
        name: 'Parent Portal',
        icon: 'fa-solid fa-users',
        description: 'Parents, guardians and portal access',
        children: [
          {
            name: 'Parent Directory',
            href: '/dashboard/parents',
            description: 'Manage parents and guardians',
          },
          {
            name: 'Linked Children',
            href: '/dashboard/parents/children',
            description: 'View parent-child relationships',
          },
          {
            name: 'Portal Access Logs',
            href: '/dashboard/parents/access',
            description: 'Review parent portal access',
          },
          {
            name: 'Notifications & Alerts',
            href: '/dashboard/parents/notifications',
            description: 'Manage parent notifications',
          },
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------------
     ACADEMICS
     ------------------------------------------------------------------------ */

  {
    title: 'Academics',
    items: [
      {
        name: 'Academics & Teachers',
        icon: 'fa-solid fa-chalkboard-user',
        description: 'Teachers, timetables, lessons and coursework',
        children: [
          {
            name: 'Teacher Directory',
            href: '/dashboard/teachers',
            description: 'Manage teaching staff',
          },
          {
            name: 'Class Timetables',
            href: '/dashboard/academics/timetables',
            description: 'Manage class schedules',
          },
          {
            name: 'Lesson Plans',
            href: '/dashboard/academics/lesson-plans',
            description: 'Create and manage lesson plans',
          },
          {
            name: 'Coursework & Assignments',
            href: '/dashboard/academics/assignments',
            description: 'Manage coursework and assignments',
          },
        ],
      },

      {
        name: 'Examinations',
        icon: 'fa-solid fa-pen-to-square',
        description: 'Assessments, marks, results and reports',
        children: [
          {
            name: 'Assessments & Exams',
            href: '/dashboard/exams',
            description: 'Create and manage assessments',
          },
          {
            name: 'Marks Entry & Results',
            href: '/dashboard/exams/results',
            description: 'Enter marks and publish results',
          },
          {
            name: 'Report Cards & Analytics',
            href: '/dashboard/exams/reports',
            description: 'Report cards and academic analytics',
          },
        ],
      },

      {
        name: 'E-Learning',
        icon: 'fa-solid fa-laptop',
        description: 'Digital learning and student progress',
        children: [
          {
            name: 'Courses & Lessons',
            href: '/dashboard/e-learning/courses',
            description: 'Manage digital courses',
          },
          {
            name: 'Digital Resources',
            href: '/dashboard/e-learning/resources',
            description: 'Manage learning resources',
          },
          {
            name: 'Quizzes & Auto-Marking',
            href: '/dashboard/e-learning/quizzes',
            description: 'Online quizzes and auto-marking',
          },
          {
            name: 'Student Progress',
            href: '/dashboard/e-learning/progress',
            description: 'Track online learning progress',
          },
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------------
     OPERATIONS
     ------------------------------------------------------------------------ */

  {
    title: 'Operations',
    items: [
      {
        name: 'Finance & Fees',
        icon: 'fa-solid fa-wallet',
        description: 'Fees, billing, payments and reconciliation',
        children: [
          {
            name: 'Fee Structures',
            href: '/dashboard/finance/structures',
            description: 'Configure school fee structures',
          },
          {
            name: 'Invoices & Billing',
            href: '/dashboard/finance/invoices',
            description: 'Create and manage invoices',
          },
          {
            name: 'Payments & Receipts',
            href: '/dashboard/finance/payments',
            description: 'Record payments and receipts',
          },
          {
            name: 'Statements & Balances',
            href: '/dashboard/finance/statements',
            description: 'View statements and outstanding balances',
          },
          {
            name: 'Bank Reconciliation',
            href: '/dashboard/finance/reconciliation',
            description: 'Reconcile school bank transactions',
          },
        ],
      },

      {
        name: 'Procurement & Stock',
        icon: 'fa-solid fa-cart-shopping',
        description: 'Purchasing, suppliers and inventory',
        children: [
          {
            name: 'Requests & Approvals',
            href: '/dashboard/procurement/requests',
            description: 'Manage purchase requests',
          },
          {
            name: 'Purchase Orders',
            href: '/dashboard/procurement/orders',
            description: 'Create and manage purchase orders',
          },
          {
            name: 'Goods Received (GRN)',
            href: '/dashboard/procurement/grn',
            description: 'Record received goods',
          },
          {
            name: 'Inventory & Stock',
            href: '/dashboard/procurement/inventory',
            description: 'Manage inventory and stock',
          },
          {
            name: 'Supplier Invoices',
            href: '/dashboard/procurement/invoices',
            description: 'Manage supplier invoices',
          },
          {
            name: 'Supplier Payments',
            href: '/dashboard/procurement/payments',
            description: 'Manage supplier payments',
          },
        ],
      },

      {
        name: 'Library',
        icon: 'fa-solid fa-book-open',
        description: 'Books, circulation and fines',
        children: [
          {
            name: 'Book Catalog',
            href: '/dashboard/library/books',
            description: 'Manage library books',
          },
          {
            name: 'Borrow & Return',
            href: '/dashboard/library/circulation',
            description: 'Manage book circulation',
          },
          {
            name: 'Fines & Overdues',
            href: '/dashboard/library/fines',
            description: 'Manage fines and overdue books',
          },
        ],
      },

      {
        name: 'Human Resources',
        icon: 'fa-solid fa-user-tie',
        description: 'Staff records, attendance, leave and payroll',
        children: [
          {
            name: 'HR Dashboard',
            href: '/dashboard/hr',
            description: 'HR overview, workforce metrics and alerts',
          },
          {
            name: 'Staff Directory',
            href: '/dashboard/hr/staff',
            description: 'Manage teaching and non-teaching staff',
          },
          {
            name: 'Departments & Positions',
            href: '/dashboard/hr/departments',
            description: 'Manage departments, roles and positions',
          },
          {
            name: 'Staff Attendance',
            href: '/dashboard/hr/attendance',
            description: 'Track staff attendance and working hours',
          },
          {
            name: 'Leave Management',
            href: '/dashboard/hr/leave',
            description: 'Manage staff leave applications and approvals',
          },
          {
            name: 'Payroll',
            href: '/dashboard/hr/payroll',
            description: 'Manage salaries, deductions and payroll',
          },
          {
            name: 'Contracts & Documents',
            href: '/dashboard/hr/contracts',
            description: 'Manage staff contracts and HR documents',
          },
          {
            name: 'Performance Management',
            href: '/dashboard/hr/performance',
            description: 'Manage staff appraisals and performance reviews',
          },
          {
            name: 'Recruitment',
            href: '/dashboard/hr/recruitment',
            description: 'Manage vacancies, applicants and recruitment',
          },
        ],
      },

      {
        name: 'Hostel & Boarding',
        icon: 'fa-solid fa-bed',
        description: 'Hostels, rooms, boarding students and welfare',
        children: [
          {
            name: 'Hostel Dashboard',
            href: '/dashboard/hostel',
            description: 'Boarding overview, occupancy and key metrics',
          },
          {
            name: 'Hostels & Houses',
            href: '/dashboard/hostel/hostels',
            description: 'Manage hostels, houses and boarding facilities',
          },
          {
            name: 'Rooms & Beds',
            href: '/dashboard/hostel/rooms',
            description: 'Manage rooms, beds and occupancy',
          },
          {
            name: 'Boarding Students',
            href: '/dashboard/hostel/students',
            description: 'Manage students assigned to boarding',
          },
          {
            name: 'Room Allocation',
            href: '/dashboard/hostel/allocation',
            description: 'Assign students to rooms and beds',
          },
          {
            name: 'Check-In & Check-Out',
            href: '/dashboard/hostel/check-in-out',
            description: 'Track student boarding movements',
          },
          {
            name: 'Hostel Attendance',
            href: '/dashboard/hostel/attendance',
            description: 'Record and review boarding student attendance',
          },
          {
            name: 'Meals & Dining',
            href: '/dashboard/hostel/meals',
            description: 'Manage meals, dining schedules and boarding meals',
          },
          {
            name: 'Hostel Fees',
            href: '/dashboard/hostel/fees',
            description: 'Manage boarding charges and hostel fees',
          },
          {
            name: 'Welfare & Incidents',
            href: '/dashboard/hostel/incidents',
            description: 'Manage student welfare issues and incidents',
          },
          {
            name: 'Hostel Staff',
            href: '/dashboard/hostel/staff',
            description: 'Manage matrons, wardens and hostel staff',
          },
        ],
      },

      {
        name: 'Transport',
        icon: 'fa-solid fa-bus',
        description: 'Routes, vehicles and transport fees',
        children: [
          {
            name: 'Routes & Stages',
            href: '/dashboard/transport/routes',
            description: 'Manage routes and stages',
          },
          {
            name: 'Vehicles & Drivers',
            href: '/dashboard/transport/vehicles',
            description: 'Manage vehicles and drivers',
          },
          {
            name: 'Transport Fee Billing',
            href: '/dashboard/transport/fees',
            description: 'Manage transport fees',
          },
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------------
     SYSTEM
     ------------------------------------------------------------------------ */

  {
    title: 'System',
    items: [
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

const allNavigationItems: SearchResult[] = navigationSections.flatMap(
  (section) =>
    section.items.flatMap((item) => {
      const parentRoute: SearchResult[] = item.href
        ? [
            {
              name: item.name,
              href: item.href,
              icon: item.icon,
              description: item.description,
            },
          ]
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

/**
 * Match an exact route or a nested route.
 *
 * Example:
 * /dashboard/students/classes
 *
 * matches:
 * /dashboard/students
 */
function routeMatches(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Determine whether a navigation item contains the active route.
 */
function itemContainsActiveRoute(pathname: string, item: NavItem) {
  if (item.href) {
    return routeMatches(pathname, item.href);
  }

  return (
    item.children?.some((child) =>
      routeMatches(pathname, child.href),
    ) ?? false
  );
}

/* ==========================================================================
   SIDEBAR
   ========================================================================== */

export function Sidebar({
  mobileOpen = false,
  setMobileOpen,
}: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const searchInputRef = useRef<HTMLInputElement>(null);

  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  /* ------------------------------------------------------------------------
     Active Accordion
     ------------------------------------------------------------------------ */

  useEffect(() => {
    const activeParent = navigationSections
      .flatMap((section) => section.items)
      .find(
        (item) =>
          item.children?.some((child) =>
            routeMatches(pathname, child.href),
          ),
      );

    if (activeParent) {
      setExpandedMenu(activeParent.name);
    }
  }, [pathname]);

  /* ------------------------------------------------------------------------
     Keyboard Shortcut
     ------------------------------------------------------------------------ */

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac =
        typeof navigator !== 'undefined' &&
        navigator.platform.toUpperCase().includes('MAC');

      const modifierPressed = isMac
        ? event.metaKey
        : event.ctrlKey;

      if (modifierPressed && event.key.toLowerCase() === 'k') {
        event.preventDefault();
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

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  /* ------------------------------------------------------------------------
     Mobile
     ------------------------------------------------------------------------ */

  useEffect(() => {
    if (mobileOpen) {
      setWorkspaceOpen(false);
      setQuickActionsOpen(false);
      setUserMenuOpen(false);
    }
  }, [pathname, mobileOpen]);

  /* ------------------------------------------------------------------------
     Search
     ------------------------------------------------------------------------ */

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return [];
    }

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
        /**
         * Important:
         *
         * Multiple menu entries should never create duplicate search
         * destinations. The route itself is our stable identity.
         */
        if (seenRoutes.has(item.href)) {
          return false;
        }

        seenRoutes.add(item.href);
        return true;
      })
      .slice(0, 10);
  }, [searchQuery]);

  /* ------------------------------------------------------------------------
     Handlers
     ------------------------------------------------------------------------ */

  const closeMobileSidebar = () => {
    setMobileOpen?.(false);
  };

  const handleNavigation = () => {
    setSearchQuery('');
    setWorkspaceOpen(false);
    setQuickActionsOpen(false);
    setUserMenuOpen(false);
    closeMobileSidebar();
  };

  const toggleMenu = (name: string) => {
    setExpandedMenu((previous) =>
      previous === name ? null : name,
    );

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

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : 'Administrator';

  const initials = user?.firstName
    ? `${user.firstName.charAt(0)}${
        user.lastName?.charAt(0) || ''
      }`.toUpperCase()
    : 'AD';

  /* ==========================================================================
     BRAND
     ========================================================================== */

  const brandHeader = (
    <div className="flex h-14 flex-shrink-0 items-center justify-between">
      <Link
        href="/dashboard"
        onClick={handleNavigation}
        className="group flex items-center rounded-xl px-1.5 py-1 transition-colors hover:bg-slate-50"
        aria-label="Elimix Dashboard"
      >
        {/* Elimix Mark */}
        <span
          className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-sm transition-transform duration-200 group-hover:scale-[1.03]"
          style={{
            background:
              `linear-gradient(135deg, ${BRAND.navy} 0%, ${BRAND.blue} 52%, ${BRAND.cyan} 100%)`,
          }}
        >
          <i className="fa-solid fa-graduation-cap text-base" />
        </span>

        {/* Brand Name */}
        <span className="ml-2.5 flex flex-col leading-none">
          <span
            className="bg-clip-text text-[17px] font-bold tracking-tight text-transparent"
            style={{
              backgroundImage: `linear-gradient(90deg, ${BRAND.navy}, ${BRAND.blue}, ${BRAND.cyan})`,
            }}
          >
            Elimix
          </span>

          <span className="mt-1 text-[8px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            School Management
          </span>
        </span>
      </Link>

      {setMobileOpen && (
        <button
          type="button"
          onClick={closeMobileSidebar}
          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#006FBF]/20 md:hidden"
          aria-label="Close sidebar"
        >
          <i className="fa-solid fa-xmark text-lg" />
        </button>
      )}
    </div>
  );

  /* ==========================================================================
     WORKSPACE
     ========================================================================== */

  const workspaceSwitcher = (
    <div className="relative mt-3">
      <button
        type="button"
        onClick={() => {
          setWorkspaceOpen((previous) => !previous);
          setQuickActionsOpen(false);
          setUserMenuOpen(false);
        }}
        className="flex w-full items-center rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-left transition-all hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#006FBF]/15"
        aria-expanded={workspaceOpen}
        aria-haspopup="menu"
      >
        <span
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-white shadow-sm"
          style={{
            background:
              `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})`,
          }}
        >
          <i className="fa-solid fa-school text-sm" />
        </span>

        <span className="ml-2.5 min-w-0 flex-1">
          <span className="block truncate text-xs font-semibold text-slate-800">
            Elimix Workspace
          </span>

          <span className="mt-0.5 block truncate text-[10px] text-slate-500">
            School Administration
          </span>
        </span>

        <i
          className={`fa-solid fa-chevron-down ml-2 text-[9px] text-slate-400 transition-transform duration-200 ${
            workspaceOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {workspaceOpen && (
        <div
          className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10"
          role="menu"
        >
          <div className="px-2.5 py-2">
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
              Workspace
            </p>
          </div>

          <div className="flex items-center rounded-lg bg-[#006FBF]/5 px-2.5 py-2">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
              style={{
                background:
                  `linear-gradient(135deg, ${BRAND.navy}, ${BRAND.blue})`,
              }}
            >
              <i className="fa-solid fa-school text-sm" />
            </span>

            <span className="ml-2.5 min-w-0 flex-1">
              <span className="block truncate text-xs font-semibold text-slate-800">
                Elimix Workspace
              </span>

              <span className="block truncate text-[10px] text-slate-500">
                Current school
              </span>
            </span>

            <i
              className="fa-solid fa-check text-xs"
              style={{ color: BRAND.blue }}
            />
          </div>

          <div className="my-1.5 border-t border-slate-100" />

          <Link
            href="/dashboard/settings"
            onClick={handleNavigation}
            className="flex w-full items-center rounded-lg px-2.5 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
            role="menuitem"
          >
            <i className="fa-solid fa-building mr-2.5 w-4 text-center text-slate-400" />
            Workspace settings
          </Link>
        </div>
      )}
    </div>
  );

  /* ==========================================================================
     SEARCH
     ========================================================================== */

  const searchBox = (
    <div className="relative mt-3">
      <div
        className={`flex h-9 items-center rounded-lg border bg-white transition-all ${
          searchQuery
            ? 'border-[#006FBF]/40 ring-2 ring-[#006FBF]/10'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <i
          className="fa-solid fa-magnifying-glass ml-3 text-xs"
          style={{ color: BRAND.blue }}
        />

        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search menu..."
          className="min-w-0 flex-1 bg-transparent px-2 text-xs text-slate-700 outline-none placeholder:text-slate-400"
          aria-label="Search navigation"
        />

        {!searchQuery && (
          <kbd className="mr-2 hidden rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[9px] font-medium text-slate-400 sm:inline-block">
            ⌘K
          </kbd>
        )}

        {searchQuery && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              searchInputRef.current?.focus();
            }}
            className="mr-2 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Clear search"
          >
            <i className="fa-solid fa-xmark text-xs" />
          </button>
        )}
      </div>

      {/* Search Dropdown */}
      {searchQuery && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10">
          {searchResults.length > 0 ? (
            <>
              <div className="px-2.5 py-2">
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Search results
                </p>
              </div>

              {searchResults.map((result) => (
                <Link
                  key={`search-${result.href}`}
                  href={result.href}
                  onClick={handleNavigation}
                  className="flex items-center rounded-lg px-2.5 py-2 transition-colors hover:bg-slate-50"
                >
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                    <i className={`${result.icon} text-xs`} />
                  </span>

                  <span className="ml-2.5 min-w-0 flex-1">
                    <span className="block truncate text-xs font-medium text-slate-700">
                      {result.name}
                    </span>

                    {result.parentName && (
                      <span className="block truncate text-[10px] text-slate-400">
                        {result.parentName}
                      </span>
                    )}
                  </span>

                  <i className="fa-solid fa-arrow-up-right-from-square ml-2 text-[9px] text-slate-300" />
                </Link>
              ))}
            </>
          ) : (
            <div className="px-4 py-8 text-center">
              <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <i className="fa-solid fa-magnifying-glass text-xs" />
              </span>

              <p className="mt-2 text-xs font-medium text-slate-700">
                No results found
              </p>

              <p className="mt-1 text-[10px] text-slate-400">
                Try searching for students, fees, exams or teachers.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  /* ==========================================================================
     NAVIGATION ITEM
     ========================================================================== */

  const renderNavigationItem = (item: NavItem) => {
    const hasChildren = Boolean(item.children?.length);
    const isActive = itemContainsActiveRoute(pathname, item);
    const isExpanded = expandedMenu === item.name;

    /* ------------------------------------------------------------------------
       Single Route
       ------------------------------------------------------------------------ */

    if (!hasChildren && item.href) {
      const exactActive = pathname === item.href;

      return (
        <Link
          key={item.href}
          href={item.href}
          onClick={handleNavigation}
          aria-current={exactActive ? 'page' : undefined}
          className={`group relative flex min-h-10 items-center rounded-lg px-2.5 py-2 transition-all duration-150 ${
            exactActive
              ? 'bg-[#006FBF]/10 text-[#006FBF]'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          {exactActive && (
            <span
              className="absolute bottom-2 left-0 top-2 w-0.5 rounded-full"
              style={{ backgroundColor: BRAND.blue }}
            />
          )}

          <span
            className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md ${
              exactActive
                ? 'text-[#006FBF]'
                : 'text-slate-400 group-hover:text-slate-600'
            }`}
          >
            <i className={`${item.icon} text-sm`} />
          </span>

          <span className="ml-2.5 min-w-0 flex-1 truncate text-[13px] font-medium">
            {item.name}
          </span>
        </Link>
      );
    }

    /* ------------------------------------------------------------------------
       Accordion
       ------------------------------------------------------------------------ */

    return (
      <div key={item.name} className="space-y-1">
        <button
          type="button"
          onClick={() => toggleMenu(item.name)}
          aria-expanded={isExpanded}
          className={`group relative flex min-h-10 w-full items-center rounded-lg px-2.5 py-2 text-left transition-all duration-150 ${
            isActive
              ? 'bg-[#006FBF]/5 text-[#006FBF]'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          {isActive && (
            <span
              className="absolute bottom-2 left-0 top-2 w-0.5 rounded-full"
              style={{ backgroundColor: BRAND.blue }}
            />
          )}

          <span
            className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md ${
              isActive
                ? 'text-[#006FBF]'
                : 'text-slate-400 group-hover:text-slate-600'
            }`}
          >
            <i className={`${item.icon} text-sm`} />
          </span>

          <span className="ml-2.5 min-w-0 flex-1 truncate text-[13px] font-medium">
            {item.name}
          </span>

          <i
            className={`fa-solid fa-chevron-down text-[9px] transition-transform duration-200 ${
              isExpanded
                ? 'rotate-180 text-[#006FBF]'
                : 'text-slate-300 group-hover:text-slate-500'
            }`}
          />
        </button>

        {/* --------------------------------------------------------------------
           Children
           -------------------------------------------------------------------- */}

        {isExpanded && item.children && (
          <div className="ml-5 border-l border-slate-200 pl-3">
            <div className="space-y-0.5">
              {item.children.map((child) => {
                const childActive = routeMatches(
                  pathname,
                  child.href,
                );

                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={handleNavigation}
                    aria-current={childActive ? 'page' : undefined}
                    className={`group relative flex min-h-9 items-center rounded-md px-2.5 py-1.5 transition-colors ${
                      childActive
                        ? 'bg-[#006FBF]/10 text-[#006FBF]'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                    }`}
                  >
                    {childActive && (
                      <span
                        className="absolute -left-[17px] h-4 w-0.5 rounded-full"
                        style={{ backgroundColor: BRAND.cyan }}
                      />
                    )}

                    <span
                      className={`mr-2 h-1.5 w-1.5 flex-shrink-0 rounded-full ${
                        childActive
                          ? 'bg-[#04B1D6]'
                          : 'bg-slate-300 group-hover:bg-slate-400'
                      }`}
                    />

                    <span className="truncate text-xs font-medium">
                      {child.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  /* ==========================================================================
     NAVIGATION
     ========================================================================== */

  const navigation = (
    <nav
      className="mt-5 min-h-0 flex-1 overflow-y-auto pr-1"
      aria-label="Main navigation"
    >
      {searchQuery ? (
        <div className="px-1">
          <p className="mb-2 px-2 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
            Search
          </p>

          {searchResults.length > 0 ? (
            <div className="space-y-0.5">
              {searchResults.map((result) => (
                <Link
                  key={`navigation-search-${result.href}`}
                  href={result.href}
                  onClick={handleNavigation}
                  className="flex items-center rounded-lg px-2.5 py-2 text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-50 text-slate-400">
                    <i className={`${result.icon} text-xs`} />
                  </span>

                  <span className="ml-2.5 min-w-0 flex-1">
                    <span className="block truncate text-xs font-medium">
                      {result.name}
                    </span>

                    {result.parentName && (
                      <span className="block truncate text-[10px] text-slate-400">
                        {result.parentName}
                      </span>
                    )}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center">
              <i className="fa-solid fa-magnifying-glass text-sm text-slate-300" />

              <p className="mt-2 text-xs font-medium text-slate-600">
                No menu items found
              </p>

              <p className="mt-1 text-[10px] text-slate-400">
                Try another search term.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-5 px-1">
          {navigationSections.map((section) => (
            <div key={section.title}>
              <div className="mb-1.5 px-2.5">
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  {section.title}
                </p>
              </div>

              <div className="space-y-0.5">
                {section.items.map(renderNavigationItem)}
              </div>
            </div>
          ))}
        </div>
      )}
    </nav>
  );

  /* ==========================================================================
     QUICK ACTIONS
     ========================================================================== */

  const quickActions = (
    <div className="relative mt-3 flex-shrink-0">
      <button
        type="button"
        onClick={() => {
          setQuickActionsOpen((previous) => !previous);
          setWorkspaceOpen(false);
          setUserMenuOpen(false);
        }}
        className="flex w-full items-center justify-between rounded-xl border border-[#006FBF]/15 bg-gradient-to-r from-[#006FBF]/10 to-[#04B1D6]/10 px-3 py-2.5 text-left transition-all hover:border-[#006FBF]/25 hover:from-[#006FBF]/15 hover:to-[#04B1D6]/15 focus:outline-none focus:ring-2 focus:ring-[#006FBF]/10"
        aria-expanded={quickActionsOpen}
      >
        <span className="flex items-center">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-md text-white shadow-sm"
            style={{
              background:
                `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})`,
            }}
          >
            <i className="fa-solid fa-bolt text-xs" />
          </span>

          <span className="ml-2.5 text-xs font-semibold text-[#006FBF]">
            Quick Action
          </span>
        </span>

        <i
          className={`fa-solid fa-chevron-down text-[9px] text-[#006FBF]/60 transition-transform ${
            quickActionsOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {quickActionsOpen && (
        <div className="absolute bottom-full left-0 right-0 z-50 mb-2 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10">
          <p className="px-2.5 py-2 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
            Common actions
          </p>

          <Link
            href="/dashboard/students/admissions"
            onClick={handleNavigation}
            className="flex items-center rounded-lg px-2.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          >
            <i className="fa-solid fa-user-plus mr-2.5 w-4 text-center text-slate-400" />
            Add Student
          </Link>

          <Link
            href="/dashboard/teachers"
            onClick={handleNavigation}
            className="flex items-center rounded-lg px-2.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          >
            <i className="fa-solid fa-chalkboard-user mr-2.5 w-4 text-center text-slate-400" />
            Add Teacher
          </Link>

          <Link
            href="/dashboard/finance/payments"
            onClick={handleNavigation}
            className="flex items-center rounded-lg px-2.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          >
            <i className="fa-solid fa-money-bill-transfer mr-2.5 w-4 text-center text-slate-400" />
            Record Payment
          </Link>

          <Link
            href="/dashboard/exams"
            onClick={handleNavigation}
            className="flex items-center rounded-lg px-2.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          >
            <i className="fa-solid fa-file-circle-plus mr-2.5 w-4 text-center text-slate-400" />
            Create Assessment
          </Link>

          <Link
            href="/dashboard/library/circulation"
            onClick={handleNavigation}
            className="flex items-center rounded-lg px-2.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          >
            <i className="fa-solid fa-book-open-reader mr-2.5 w-4 text-center text-slate-400" />
            Issue Library Book
          </Link>

          <Link
            href="/dashboard/parents/notifications"
            onClick={handleNavigation}
            className="flex items-center rounded-lg px-2.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          >
            <i className="fa-solid fa-bullhorn mr-2.5 w-4 text-center text-slate-400" />
            Send Announcement
          </Link>
        </div>
      )}
    </div>
  );

  /* ==========================================================================
     FOOTER
     ========================================================================== */

  const footer = (
    <div className="mt-3 flex-shrink-0 border-t border-slate-100 pt-3">
      {/* Notifications */}
      <Link
        href="/dashboard/parents/notifications"
        onClick={handleNavigation}
        className="group flex min-h-9 items-center rounded-lg px-2.5 py-2 text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
      >
        <span className="relative flex h-7 w-7 items-center justify-center text-slate-400 group-hover:text-slate-600">
          <i className="fa-solid fa-bell text-sm" />
        </span>

        <span className="ml-2.5 text-xs font-medium">
          Notifications
        </span>
      </Link>

      {/* User */}
      <div className="relative mt-2">
        <button
          type="button"
          onClick={() => {
            setUserMenuOpen((previous) => !previous);
            setWorkspaceOpen(false);
            setQuickActionsOpen(false);
          }}
          className="flex w-full items-center rounded-xl border border-transparent px-2 py-2 text-left transition-colors hover:border-slate-200 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#006FBF]/15"
          aria-expanded={userMenuOpen}
        >
          <span
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
            style={{
              background:
                `linear-gradient(135deg, ${BRAND.navy}, ${BRAND.blue})`,
            }}
          >
            {initials}
          </span>

          <span className="ml-2.5 min-w-0 flex-1">
            <span className="block truncate text-xs font-semibold text-slate-800">
              {displayName}
            </span>

            <span className="mt-0.5 block truncate text-[10px] text-slate-400">
              {user?.email || 'Administrator'}
            </span>
          </span>

          <i
            className={`fa-solid fa-ellipsis text-slate-400 transition-transform ${
              userMenuOpen ? 'rotate-90' : ''
            }`}
          />
        </button>

        {userMenuOpen && (
          <div className="absolute bottom-full left-0 right-0 z-50 mb-2 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10">
            <div className="px-2.5 py-2">
              <p className="truncate text-xs font-semibold text-slate-800">
                {displayName}
              </p>

              <p className="mt-0.5 truncate text-[10px] text-slate-400">
                {user?.email || ''}
              </p>
            </div>

            <div className="my-1 border-t border-slate-100" />

            <Link
              href="/dashboard/settings"
              onClick={handleNavigation}
              className="flex items-center rounded-lg px-2.5 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
              <i className="fa-solid fa-sliders mr-2.5 w-4 text-center text-slate-400" />
              Account Settings
            </Link>

            <div className="my-1 border-t border-slate-100" />

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center rounded-lg px-2.5 py-2 text-left text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              <i className="fa-solid fa-right-from-bracket mr-2.5 w-4 text-center" />
              Log out
            </button>
          </div>
        )}
      </div>
    </div>
  );

  /* ==========================================================================
     SIDEBAR CONTENT
     ========================================================================== */

  const sidebarContent = (
    <div className="flex h-full min-h-0 flex-col bg-white px-3 pb-3 pt-3">
      {brandHeader}

      {workspaceSwitcher}

      {searchBox}

      {navigation}

      {quickActions}

      {footer}
    </div>
  );

  /* ==========================================================================
     RENDER
     ========================================================================== */

  return (
    <>
      {/* ======================================================================
         DESKTOP SIDEBAR
         ====================================================================== */}

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200 bg-white md:flex">
        {sidebarContent}
      </aside>

      {/* ======================================================================
         MOBILE BACKDROP
         ====================================================================== */}

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[1px] md:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* ======================================================================
         MOBILE SIDEBAR
         ====================================================================== */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white shadow-2xl transition-transform duration-300 ease-out md:hidden ${
          mobileOpen
            ? 'translate-x-0'
            : '-translate-x-full'
        }`}
        aria-label="Mobile navigation"
      >
        {sidebarContent}
      </aside>
    </>
  );
}