// apps/web/app/dashboard/hr/page.tsx

import Link from 'next/link';

/* ==========================================================================
   MOCK DATA
   ========================================================================== */

const STATS = [
  {
    title: 'Total Staff',
    value: '142',
    trend: '+3 this month',
    trendUp: true,
    icon: 'fa-user-tie',
    color: 'from-[#012E54] to-[#006FBF]',
  },
  {
    title: 'Present Today',
    value: '135',
    trend: '95% attendance rate',
    trendUp: true,
    icon: 'fa-clipboard-user',
    color: 'from-[#006FBF] to-[#04B1D6]',
  },
  {
    title: 'Pending Leaves',
    value: '8',
    trend: 'Needs approval',
    trendUp: false,
    icon: 'fa-calendar-minus',
    color: 'from-[#F59E0B] to-[#D97706]',
  },
  {
    title: 'Open Positions',
    value: '4',
    trend: '2 interviews scheduled',
    trendUp: true,
    icon: 'fa-briefcase',
    color: 'from-[#10B981] to-[#059669]',
  },
];

const PENDING_LEAVES = [
  {
    id: 'L-1042',
    staff: 'Sarah Jenkins',
    role: 'Mathematics Teacher',
    type: 'Sick Leave',
    dates: 'Oct 6 - Oct 8',
    days: 3,
  },
  {
    id: 'L-1043',
    staff: 'Michael Ochieng',
    role: 'Transport Manager',
    type: 'Annual Leave',
    dates: 'Oct 10 - Oct 14',
    days: 5,
  },
  {
    id: 'L-1044',
    staff: 'Grace Mutuku',
    role: 'Librarian',
    type: 'Maternity Leave',
    dates: 'Oct 15 - Jan 15',
    days: 90,
  },
];

const DEPARTMENTS = [
  { name: 'Academics (Teaching)', count: 85, icon: 'fa-chalkboard-user' },
  { name: 'Administration', count: 12, icon: 'fa-building' },
  { name: 'Transport', count: 18, icon: 'fa-bus' },
  { name: 'Maintenance & Security', count: 20, icon: 'fa-shield-halved' },
  { name: 'Finance', count: 7, icon: 'fa-wallet' },
];

/* ==========================================================================
   PAGE COMPONENT
   ========================================================================== */

export default function HRDashboardPage() {
  return (
    <div className="flex w-full flex-col gap-6 p-6 md:p-8">
      {/* ----------------------------------------------------------------------
          HEADER
          ---------------------------------------------------------------------- */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            HR & Staff Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Overview of staff attendance, leave requests, and departmental metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/hr/staff/new"
            className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#006FBF]"
          >
            <i className="fa-solid fa-file-export mr-2 text-slate-400" />
            Export Report
          </Link>
          <Link
            href="/dashboard/hr/staff/new"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#006FBF] to-[#04B1D6] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-[#012E54] hover:to-[#006FBF] focus:outline-none focus:ring-2 focus:ring-[#006FBF] focus:ring-offset-2"
          >
            <i className="fa-solid fa-plus mr-2" />
            Add Staff Member
          </Link>
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          STATS GRID
          ---------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <div
            key={stat.title}
            className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  {stat.title}
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-bold tracking-tight text-slate-900">
                    {stat.value}
                  </span>
                </div>
              </div>
              <div
                className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-inner`}
              >
                <i className={`fa-solid ${stat.icon} text-lg`} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <i
                className={`fa-solid ${
                  stat.trendUp ? 'fa-arrow-trend-up text-emerald-500' : 'fa-circle-exclamation text-amber-500'
                } mr-1.5 text-xs`}
              />
              <span
                className={stat.trendUp ? 'text-emerald-600' : 'text-amber-600'}
              >
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ----------------------------------------------------------------------
          MAIN CONTENT AREA
          ---------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* LEAVE REQUESTS (Takes up 2/3 width on large screens) */}
        <div className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <h2 className="text-base font-semibold text-slate-900">
              Pending Leave Approvals
            </h2>
            <Link
              href="/dashboard/hr/attendance-leaves"
              className="text-sm font-medium text-[#006FBF] hover:text-[#012E54]"
            >
              View all requests &rarr;
            </Link>
          </div>
          
          <div className="flex-1 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Staff Member
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Leave Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Duration
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {PENDING_LEAVES.map((leave) => (
                  <tr key={leave.id} className="transition-colors hover:bg-slate-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                          {leave.staff.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-slate-900">{leave.staff}</p>
                          <p className="text-xs text-slate-500">{leave.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                        {leave.type}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <p className="text-sm text-slate-900">{leave.dates}</p>
                      <p className="text-xs text-slate-500">{leave.days} days</p>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <button className="mr-3 text-[#006FBF] hover:text-[#012E54]">
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* DEPARTMENT BREAKDOWN (Takes up 1/3 width on large screens) */}
        <div className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <h2 className="text-base font-semibold text-slate-900">
              Department Headcount
            </h2>
          </div>
          
          <div className="flex-1 p-4">
            <ul className="space-y-4">
              {DEPARTMENTS.map((dept) => (
                <li key={dept.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
                      <i className={`fa-solid ${dept.icon} text-xs`} />
                    </span>
                    <span className="ml-3 text-sm font-medium text-slate-700">
                      {dept.name}
                    </span>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                    {dept.count}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link
                href="/dashboard/hr/staff"
                className="flex w-full items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
              >
                View Staff Directory
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          QUICK ACTIONS WIDGETS
          ---------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link 
          href="/dashboard/hr/payroll" 
          className="group relative flex items-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-[#006FBF]/30 hover:shadow-md"
        >
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#006FBF]/10 text-[#006FBF] transition-transform group-hover:scale-110">
            <i className="fa-solid fa-money-check-dollar text-lg" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-semibold text-slate-900">Run Payroll</p>
            <p className="text-xs text-slate-500">Process this month's salaries</p>
          </div>
        </Link>

        <Link 
          href="/dashboard/hr/recruitment" 
          className="group relative flex items-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-[#006FBF]/30 hover:shadow-md"
        >
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#04B1D6]/10 text-[#04B1D6] transition-transform group-hover:scale-110">
            <i className="fa-solid fa-user-magnifying-glass text-lg" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-semibold text-slate-900">Recruitment</p>
            <p className="text-xs text-slate-500">Review open job postings</p>
          </div>
        </Link>

        <Link 
          href="/dashboard/hr/attendance-leaves" 
          className="group relative flex items-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-[#006FBF]/30 hover:shadow-md"
        >
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#012E54]/10 text-[#012E54] transition-transform group-hover:scale-110">
            <i className="fa-solid fa-clock-rotate-left text-lg" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-semibold text-slate-900">Daily Attendance</p>
            <p className="text-xs text-slate-500">Check staff clock-in times</p>
          </div>
        </Link>
      </div>
    </div>
  );
}