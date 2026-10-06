// apps/web/app/dashboard/reports/page.tsx

import Link from 'next/link';

/* ==========================================================================
   MOCK DATA
   ========================================================================== */

const STATS = [
  {
    title: 'Generated This Term',
    value: '142',
    subtext: 'Reports downloaded or exported',
    icon: 'fa-file-arrow-down',
    color: 'from-[#006FBF] to-[#04B1D6]',
  },
  {
    title: 'Scheduled Reports',
    value: '8',
    subtext: 'Automated weekly/monthly dispatches',
    icon: 'fa-clock-rotate-left',
    color: 'from-indigo-600 to-indigo-500',
  },
  {
    title: 'Report Modules',
    value: '5',
    subtext: 'Academics, Finance, Hostel, Admin, HR',
    icon: 'fa-folder-tree',
    color: 'from-emerald-600 to-emerald-500',
  },
  {
    title: 'Storage Used',
    value: '2.4 GB',
    subtext: 'Archived statements & PDFs',
    icon: 'fa-hard-drive',
    color: 'from-amber-500 to-amber-600',
  },
];

const REPORT_CATEGORIES = [
  {
    title: 'Academic & Examination',
    description: 'Termly report cards, subject grade distributions, GPA rankings, and transcript summaries.',
    icon: 'fa-graduation-cap',
    count: '12 Report Types',
    badge: 'Popular',
    color: 'text-[#006FBF]',
    bg: 'bg-blue-50',
  },
  {
    title: 'Financial & Fee Collections',
    description: 'Fee statements, aged debtor analysis, M-Pesa reconciliation reports, and payroll summaries.',
    icon: 'fa-file-invoice-dollar',
    count: '9 Report Types',
    badge: 'Critical',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    title: 'Hostel & Boarding Operations',
    description: 'Room occupancy audits, exeat movement logs, incident records, and dining attendance.',
    icon: 'fa-house-chimney-user',
    count: '7 Report Types',
    badge: 'Active',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
  },
  {
    title: 'Attendance & Discipline',
    description: 'Daily roll call compliance, chronic absenteeism alerts, and disciplinary action logs.',
    icon: 'fa-clipboard-user',
    count: '6 Report Types',
    badge: 'Daily',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
];

const RECENT_REPORTS = [
  {
    id: 'REP-2026-891',
    name: 'Term 3 Fee Collection & Outstanding Balances Summary',
    category: 'Finance',
    generatedBy: 'Ms. Brenda Cheruiyot',
    date: 'Oct 06, 2026 at 09:15 AM',
    format: 'PDF',
    size: '1.8 MB',
  },
  {
    id: 'REP-2026-890',
    name: 'Form 3 Class Mid-Term Academic Ranking & Grade Sheets',
    category: 'Academics',
    generatedBy: 'Dr. James Mwangi',
    date: 'Oct 05, 2026 at 04:30 PM',
    format: 'Excel',
    size: '3.4 MB',
  },
  {
    id: 'REP-2026-889',
    name: 'Hostel Weekend Exeat & Movement Audit Report',
    category: 'Hostel',
    generatedBy: 'Mr. David Njoroge',
    date: 'Oct 04, 2026 at 06:00 PM',
    format: 'PDF',
    size: '950 KB',
  },
  {
    id: 'REP-2026-888',
    name: 'Staff Attendance & Duty Roster Compliance (September)',
    category: 'Operations',
    generatedBy: 'Prof. Sarah Ouma',
    date: 'Oct 01, 2026 at 08:00 AM',
    format: 'PDF',
    size: '1.2 MB',
  },
];

/* ==========================================================================
   PAGE COMPONENT
   ========================================================================== */

export default function ReportsCenterPage() {
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
          <span className="text-slate-900">Reports & Analytics Center</span>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Reports & Analytics Center
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Generate comprehensive reports across academics, finance, boarding, and institutional operations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#006FBF]"
            >
              <i className="fa-solid fa-clock-rotate-left mr-2 text-slate-400" />
              Scheduled Reports
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#006FBF] to-[#04B1D6] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-[#012E54] hover:to-[#006FBF] focus:outline-none focus:ring-2 focus:ring-[#006FBF] focus:ring-offset-2"
            >
              <i className="fa-solid fa-wand-magic-sparkles mr-2" />
              Custom Report Builder
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
          REPORT CATEGORIES GRID
          ---------------------------------------------------------------------- */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900">Report Categories</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {REPORT_CATEGORIES.map((cat) => (
            <div
              key={cat.title}
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-[#006FBF]/40 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${cat.bg} ${cat.color} text-xl`}>
                    <i className={`fa-solid ${cat.icon}`} />
                  </div>
                  <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
                    {cat.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#006FBF] transition-colors">
                  {cat.title}
                </h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  {cat.description}
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-xs font-semibold text-slate-500">{cat.count}</span>
                <button className="inline-flex items-center text-xs font-semibold text-[#006FBF] hover:underline">
                  Browse <i className="fa-solid fa-arrow-right ml-1 text-[10px]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          RECENTLY GENERATED REPORTS TABLE
          ---------------------------------------------------------------------- */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Recently Generated Reports</h2>
          <button className="text-xs font-semibold text-[#006FBF] hover:underline">View Archive</button>
        </div>

        <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Report Title & ID
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Generated By
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Format & Size
                  </th>
                  <th scope="col" className="relative px-6 py-4 text-right">
                    <span className="sr-only">Download</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {RECENT_REPORTS.map((rep) => (
                  <tr key={rep.id} className="transition-colors hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                          <i className="fa-solid fa-file-lines text-sm" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {rep.name}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            <span className="font-mono">{rep.id}</span> &bull; {rep.date}
                          </p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        {rep.category}
                      </span>
                    </td>
                    
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                      {rep.generatedBy}
                    </td>
                    
                    <td className="whitespace-nowrap px-6 py-4">
                      <p className="text-sm font-medium text-slate-900">{rep.format}</p>
                      <p className="text-xs text-slate-500">{rep.size}</p>
                    </td>
                    
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-3">
                        <button className="inline-flex items-center rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-all">
                          <i className="fa-solid fa-download mr-1.5 text-slate-500" /> Download
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}