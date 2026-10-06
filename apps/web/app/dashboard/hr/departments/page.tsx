// apps/web/app/dashboard/hr/departments/page.tsx

import Link from 'next/link';

/* ==========================================================================
   MOCK DATA
   ========================================================================== */

const STATS = [
  {
    title: 'Total Departments',
    value: '5',
    icon: 'fa-building-user',
    color: 'from-[#012E54] to-[#006FBF]',
  },
  {
    title: 'Total Headcount',
    value: '142',
    icon: 'fa-users',
    color: 'from-[#006FBF] to-[#04B1D6]',
  },
  {
    title: 'Open Vacancies',
    value: '4',
    icon: 'fa-briefcase',
    color: 'from-[#10B981] to-[#059669]',
  },
];

const DEPARTMENTS = [
  {
    id: 'DEPT-01',
    name: 'Academics (Teaching)',
    head: 'Sarah Jenkins',
    headAvatar: 'SJ',
    staffCount: 85,
    openRoles: 2,
    description: 'Teaching staff, teaching assistants, and academic coordinators.',
    icon: 'fa-chalkboard-user',
    budgetUsed: '82%',
  },
  {
    id: 'DEPT-02',
    name: 'Administration',
    head: 'Dr. John Doe',
    headAvatar: 'JD',
    staffCount: 12,
    openRoles: 0,
    description: 'School principal, vice-principals, and administrative office staff.',
    icon: 'fa-building',
    budgetUsed: '45%',
  },
  {
    id: 'DEPT-03',
    name: 'Transport',
    head: 'Michael Ochieng',
    headAvatar: 'MO',
    staffCount: 18,
    openRoles: 1,
    description: 'Bus drivers, conductors, and fleet maintenance crew.',
    icon: 'fa-bus',
    budgetUsed: '68%',
  },
  {
    id: 'DEPT-04',
    name: 'Security & Maintenance',
    head: 'Peter Kipkorir',
    headAvatar: 'PK',
    staffCount: 20,
    openRoles: 0,
    description: 'Security guards, janitors, groundskeepers, and repair technicians.',
    icon: 'fa-shield-halved',
    budgetUsed: '90%',
  },
  {
    id: 'DEPT-05',
    name: 'Finance',
    head: 'David Njoroge',
    headAvatar: 'DN',
    staffCount: 7,
    openRoles: 1,
    description: 'Accountants, bursars, and procurement officers.',
    icon: 'fa-wallet',
    budgetUsed: '30%',
  },
];

/* ==========================================================================
   PAGE COMPONENT
   ========================================================================== */

export default function DepartmentsPage() {
  return (
    <div className="flex w-full flex-col gap-6 p-6 md:p-8">
      {/* ----------------------------------------------------------------------
          HEADER
          ---------------------------------------------------------------------- */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Departments
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage organizational structure, department heads, and allocations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#006FBF] to-[#04B1D6] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-[#012E54] hover:to-[#006FBF] focus:outline-none focus:ring-2 focus:ring-[#006FBF] focus:ring-offset-2">
            <i className="fa-solid fa-plus mr-2" />
            Add Department
          </button>
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          STATS WIDGETS
          ---------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {STATS.map((stat) => (
          <div
            key={stat.title}
            className="flex items-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div
              className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-inner`}
            >
              <i className={`fa-solid ${stat.icon} text-lg`} />
            </div>
            <div className="ml-4">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                {stat.title}
              </p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ----------------------------------------------------------------------
          DEPARTMENTS GRID
          ---------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {DEPARTMENTS.map((dept) => (
          <div
            key={dept.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md"
          >
            {/* Card Header */}
            <div className="border-b border-slate-100 p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                    <i className={`fa-solid ${dept.icon} text-lg`} />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">
                      {dept.name}
                    </h2>
                    <p className="text-xs text-slate-500">ID: {dept.id}</p>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-[#006FBF]" title="Edit Department">
                  <i className="fa-solid fa-ellipsis-vertical px-2" />
                </button>
              </div>
              <p className="mt-3 text-sm text-slate-600 line-clamp-2">
                {dept.description}
              </p>
            </div>

            {/* Department Head & Stats */}
            <div className="flex flex-1 flex-col justify-between p-5">
              <div className="mb-4">
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">
                  Head of Department
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#012E54] to-[#006FBF] text-xs font-bold text-white shadow-sm">
                    {dept.headAvatar}
                  </div>
                  <span className="text-sm font-medium text-slate-900">
                    {dept.head}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4">
                <div>
                  <p className="text-xs text-slate-500">Staff Count</p>
                  <p className="mt-1 text-lg font-bold text-slate-900">
                    {dept.staffCount}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Open Roles</p>
                  <p className="mt-1 text-lg font-bold text-[#006FBF]">
                    {dept.openRoles}
                  </p>
                </div>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="grid grid-cols-2 divide-x divide-slate-100 border-t border-slate-100 bg-slate-50/50">
              <Link
                href={`/dashboard/hr/staff?department=${dept.id}`}
                className="flex items-center justify-center py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-[#006FBF]"
              >
                <i className="fa-solid fa-users mr-2 text-xs" />
                View Staff
              </Link>
              <button className="flex items-center justify-center py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-[#006FBF]">
                <i className="fa-solid fa-gear mr-2 text-xs" />
                Manage
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}