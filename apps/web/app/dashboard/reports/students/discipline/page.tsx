// apps/web/app/dashboard/reports/students/discipline/page.tsx

import Link from 'next/link';

/* ==========================================================================
   MOCK DATA
   ========================================================================== */

const STATS = [
  {
    title: 'Total Incidents (Term 3)',
    value: '84',
    subtext: '-12% compared to last term',
    icon: 'fa-clipboard-list',
    color: 'from-[#006FBF] to-[#04B1D6]',
  },
  {
    title: 'Active Suspensions',
    value: '3',
    subtext: 'Students currently away',
    icon: 'fa-ban',
    color: 'from-rose-600 to-rose-500',
  },
  {
    title: 'Frequent Offenders',
    value: '12',
    subtext: 'Students with 3+ incidents',
    icon: 'fa-users-slash',
    color: 'from-amber-500 to-amber-600',
  },
  {
    title: 'Most Common Offense',
    value: 'Latecoming',
    subtext: 'Accounts for 35% of all records',
    icon: 'fa-clock-rotate-left',
    color: 'from-indigo-600 to-indigo-500',
  },
];

const INCIDENTS_BY_SEVERITY = [
  { severity: 'Minor', count: 48, percentage: 57.1, description: 'Noise making, minor latecoming, uniform violations', color: 'bg-emerald-500', text: 'text-emerald-600' },
  { severity: 'Moderate', count: 22, percentage: 26.2, description: 'Disruptive behavior, missed assignments, skipping class', color: 'bg-[#006FBF]', text: 'text-[#006FBF]' },
  { severity: 'Major', count: 10, percentage: 11.9, description: 'Insubordination, bullying, vandalism, cheating', color: 'bg-amber-500', text: 'text-amber-600' },
  { severity: 'Critical', count: 4, percentage: 4.8, description: 'Fighting, substance abuse, severe property damage', color: 'bg-rose-500', text: 'text-rose-600' },
];

const RECENT_INCIDENTS = [
  {
    id: 'INC-2026-084',
    date: '06 Oct 2026',
    student: 'Kevin Otieno',
    admNo: 'ADM-2025-089',
    class: 'Form 2 South',
    category: 'Vandalism',
    severity: 'Major',
    actionTaken: 'Parent Summoned',
    status: 'Pending',
    reportedBy: 'Mr. David Ochieng',
  },
  {
    id: 'INC-2026-083',
    date: '05 Oct 2026',
    student: 'Amina Mohamed',
    admNo: 'ADM-2024-041',
    class: 'Form 1 North',
    category: 'Uniform Violation',
    severity: 'Minor',
    actionTaken: 'Verbal Warning',
    status: 'Resolved',
    reportedBy: 'Mrs. Sarah Jenkins',
  },
  {
    id: 'INC-2026-082',
    date: '03 Oct 2026',
    student: 'Brian Kiprop',
    admNo: 'ADM-2023-112',
    class: 'Form 4 North',
    category: 'Fighting',
    severity: 'Critical',
    actionTaken: '2-Week Suspension',
    status: 'Active',
    reportedBy: 'Dr. James Mwangi',
  },
  {
    id: 'INC-2026-081',
    date: '02 Oct 2026',
    student: 'Faith Cherotich',
    admNo: 'ADM-2024-104',
    class: 'Form 3 East',
    category: 'Skipping Class',
    severity: 'Moderate',
    actionTaken: 'Detention',
    status: 'Resolved',
    reportedBy: 'Eng. Paul Njuguna',
  },
  {
    id: 'INC-2026-080',
    date: '01 Oct 2026',
    student: 'David Njuguna',
    admNo: 'ADM-2025-156',
    class: 'Form 2 West',
    category: 'Latecoming',
    severity: 'Minor',
    actionTaken: 'Campus Cleanup',
    status: 'Resolved',
    reportedBy: 'Mwalimu Hassan Juma',
  },
];

/* ==========================================================================
   PAGE COMPONENT
   ========================================================================== */

export default function StudentDisciplineReportPage() {
  return (
    <div className="flex w-full flex-col gap-6 p-6 md:p-8">
      {/* ----------------------------------------------------------------------
          BREADCRUMBS & HEADER
          ---------------------------------------------------------------------- */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <Link href="/dashboard" className="hover:text-[#006FBF]">
            Dashboard
          </Link>
          <i className="fa-solid fa-chevron-right text-[10px] text-slate-400" />
          <Link href="/dashboard/reports" className="hover:text-[#006FBF]">
            Reports & Analytics
          </Link>
          <i className="fa-solid fa-chevron-right text-[10px] text-slate-400" />
          <span className="text-slate-900">Student Discipline</span>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Student Discipline & Behavior
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Monitor disciplinary incidents, interventions, and behavior patterns across the school.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#006FBF]"
            >
              <i className="fa-solid fa-file-excel mr-2 text-emerald-600" />
              Export Records
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-rose-700 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
            >
              <i className="fa-solid fa-triangle-exclamation mr-2" />
              Log New Incident
            </button>
          </div>
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
                  <span className="text-2xl font-bold tracking-tight text-slate-900">
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
            <p className="mt-3 text-xs text-slate-500">{stat.subtext}</p>
          </div>
        ))}
      </div>

      {/* ----------------------------------------------------------------------
          FILTERS BAR
          ---------------------------------------------------------------------- */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Academic Term
            </label>
            <select
              className="rounded-xl border-0 py-2 pl-3 pr-8 text-xs font-medium text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF]"
              defaultValue="term3"
            >
              <option value="term3">Term 3 (2026)</option>
              <option value="term2">Term 2 (2026)</option>
              <option value="term1">Term 1 (2026)</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Severity Level
            </label>
            <select
              className="rounded-xl border-0 py-2 pl-3 pr-8 text-xs font-medium text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF]"
              defaultValue="all"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="major">Major</option>
              <option value="moderate">Moderate</option>
              <option value="minor">Minor</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Status
            </label>
            <select
              className="rounded-xl border-0 py-2 pl-3 pr-8 text-xs font-medium text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF]"
              defaultValue="all"
            >
              <option value="all">All Statuses</option>
              <option value="resolved">Resolved</option>
              <option value="pending">Pending</option>
              <option value="active">Active (e.g., Suspended)</option>
            </select>
          </div>
        </div>

        <div className="relative w-full lg:w-64">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <i className="fa-solid fa-search text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-xl border-0 py-2 pl-10 pr-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-[#006FBF]"
            placeholder="Search student or offense..."
          />
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          INCIDENTS BY SEVERITY BREAKDOWN
          ---------------------------------------------------------------------- */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Incident Breakdown by Severity</h2>
            <p className="text-xs text-slate-500">Categorization of logged disciplinary actions for the current term</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {INCIDENTS_BY_SEVERITY.map((item) => (
            <div key={item.severity} className="flex flex-col rounded-xl border border-slate-100 bg-slate-50/50 p-4">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-bold uppercase tracking-wide ${item.text}`}>{item.severity}</span>
                <span className="text-sm font-extrabold text-slate-900">{item.count}</span>
              </div>
              <p className="mt-1 text-[10px] text-slate-500 line-clamp-2 h-7">{item.description}</p>
              
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500 mb-1.5">
                <span>Distribution</span>
                <span className="font-semibold text-slate-700">{item.percentage}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                <div className={`h-full ${item.color}`} style={{ width: `${item.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          RECENT INCIDENTS TABLE
          ---------------------------------------------------------------------- */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Recent Disciplinary Incidents</h2>
          <span className="text-xs font-medium text-slate-500">Showing 5 latest logs</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Date & Student
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Class
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Offense & Severity
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Action Taken
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Reported By
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th scope="col" className="relative px-6 py-4 text-right">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {RECENT_INCIDENTS.map((incident) => (
                <tr key={incident.id} className="transition-colors hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 font-bold text-xs">
                        {incident.student.split(' ')[0][0]}{incident.student.split(' ')[1][0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{incident.student}</p>
                        <p className="text-xs text-slate-400 font-mono">{incident.date} • {incident.admNo}</p>
                      </div>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-xs font-medium text-slate-600">
                    {incident.class}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <p className="text-sm font-bold text-slate-900">{incident.category}</p>
                    <span className={`inline-flex mt-1 items-center rounded-md px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${
                      incident.severity === 'Critical' ? 'bg-rose-50 text-rose-700 ring-rose-600/20' :
                      incident.severity === 'Major' ? 'bg-amber-50 text-amber-700 ring-amber-600/20' :
                      incident.severity === 'Moderate' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' :
                      'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                    }`}>
                      {incident.severity}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-700">
                    {incident.actionTaken}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-xs text-slate-500">
                    {incident.reportedBy}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    {incident.status === 'Resolved' && (
                      <span className="inline-flex items-center text-xs font-semibold text-emerald-600">
                        <i className="fa-solid fa-check-circle mr-1.5" /> Resolved
                      </span>
                    )}
                    {incident.status === 'Pending' && (
                      <span className="inline-flex items-center text-xs font-semibold text-amber-600">
                        <i className="fa-solid fa-clock mr-1.5" /> Pending
                      </span>
                    )}
                    {incident.status === 'Active' && (
                      <span className="inline-flex items-center text-xs font-semibold text-rose-600">
                        <i className="fa-solid fa-spinner fa-spin mr-1.5" /> Active
                      </span>
                    )}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <button className="inline-flex items-center rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-all">
                      <i className="fa-solid fa-file-lines mr-1.5 text-slate-500" /> Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}