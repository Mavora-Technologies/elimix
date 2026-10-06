// apps/web/app/dashboard/reports/custom/builder/page.tsx

import Link from 'next/link';

/* ==========================================================================
   MOCK DATA
   ========================================================================== */

const STATS = [
  {
    title: 'Saved Custom Templates',
    value: '14',
    subtext: 'Across all administrative departments',
    icon: 'fa-bookmark',
    color: 'from-[#006FBF] to-[#04B1D6]',
  },
  {
    title: 'Scheduled Reports',
    value: '6',
    subtext: 'Auto-dispatched weekly / monthly',
    icon: 'fa-clock-rotate-left',
    color: 'from-emerald-600 to-emerald-500',
  },
  {
    title: 'Reports Generated (MTD)',
    value: '82',
    subtext: '+24% compared to last month',
    icon: 'fa-file-arrow-down',
    color: 'from-indigo-600 to-indigo-500',
  },
  {
    title: 'Available Data Entities',
    value: '8 Models',
    subtext: 'Students, Fees, Attendance, Staff, etc.',
    icon: 'fa-database',
    color: 'from-amber-500 to-amber-600',
  },
];

const SAVED_TEMPLATES = [
  {
    id: 'TMP-01',
    name: 'Term 3 Fee Defaulters & Balance',
    source: 'Finance & Accounts',
    lastModified: '04 Oct 2026',
    author: 'CPA Jane Doe',
    frequency: 'Weekly',
  },
  {
    id: 'TMP-02',
    name: 'Low Attendance Alert (Below 85%)',
    source: 'Student Attendance',
    lastModified: '02 Oct 2026',
    author: 'Mr. David Ochieng',
    frequency: 'Daily',
  },
  {
    id: 'TMP-03',
    name: 'Boarding Room Occupancy & Vacancies',
    source: 'Hostel Operations',
    lastModified: '28 Sep 2026',
    author: 'Mr. John Kamau',
    frequency: 'Monthly',
  },
];

const PREVIEW_DATA = [
  {
    admNo: 'ADM-2024-001',
    studentName: 'Brian Kiprop',
    class: 'Form 4 North',
    termFeeBalance: 'KES 14,500',
    attendanceRate: '96.5%',
    disciplineStatus: 'Clean',
  },
  {
    admNo: 'ADM-2024-042',
    studentName: 'Amina Mohamed',
    class: 'Form 3 East',
    termFeeBalance: 'KES 0',
    attendanceRate: '98.2%',
    disciplineStatus: 'Clean',
  },
  {
    admNo: 'ADM-2025-089',
    studentName: 'Kevin Otieno',
    class: 'Form 2 South',
    termFeeBalance: 'KES 28,000',
    attendanceRate: '88.0%',
    disciplineStatus: 'Warning',
  },
  {
    admNo: 'ADM-2024-104',
    studentName: 'Faith Cherotich',
    class: 'Form 3 East',
    termFeeBalance: 'KES 4,200',
    attendanceRate: '94.1%',
    disciplineStatus: 'Clean',
  },
];

/* ==========================================================================
   PAGE COMPONENT
   ========================================================================== */

export default function CustomReportBuilderPage() {
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
          <span className="text-slate-900">Custom Report Builder</span>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Custom Report Builder & Query Studio
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Design tailored institutional reports by combining data models, custom filters, metrics, and visualization columns.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#006FBF]"
            >
              <i className="fa-solid fa-bookmark mr-2 text-[#006FBF]" />
              Save as Template
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#006FBF] to-[#04B1D6] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-[#012E54] hover:to-[#006FBF] focus:outline-none focus:ring-2 focus:ring-[#006FBF] focus:ring-offset-2"
            >
              <i className="fa-solid fa-wand-magic-sparkles mr-2" />
              Run & Export Report
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
          BUILDER STUDIO WORKSPACE (GRID)
          ---------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* LEFT CONFIGURATION PANEL (4 COLS) */}
        <div className="flex flex-col gap-6 lg:col-span-4">
          {/* STEP 1: DATA SOURCE */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#006FBF]/10 text-xs font-bold text-[#006FBF]">
                1
              </div>
              <h2 className="text-sm font-bold text-slate-900">Select Primary Data Model</h2>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">
                  Data Entity
                </label>
                <select
                  className="w-full rounded-xl border-0 py-2.5 px-3 text-xs font-medium text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF]"
                  defaultValue="students"
                >
                  <option value="students">Students & Enrollment Directory</option>
                  <option value="finance">Fee Accounts & Transactions</option>
                  <option value="attendance">Daily Roll Call & Attendance Logs</option>
                  <option value="discipline">Disciplinary Records & Incidents</option>
                  <option value="hostel">Hostel Allocations & Bed Capacity</option>
                  <option value="transport">Fleet Routes & Commuters</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">
                  Academic Term / Period
                </label>
                <select
                  className="w-full rounded-xl border-0 py-2.5 px-3 text-xs font-medium text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF]"
                  defaultValue="term3"
                >
                  <option value="term3">Term 3 (2026)</option>
                  <option value="term2">Term 2 (2026)</option>
                  <option value="term1">Term 1 (2026)</option>
                  <option value="full_year">Full Academic Year 2026</option>
                </select>
              </div>
            </div>
          </div>

          {/* STEP 2: COLUMNS & FIELDS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#006FBF]/10 text-xs font-bold text-[#006FBF]">
                2
              </div>
              <h2 className="text-sm font-bold text-slate-900">Choose Columns to Include</h2>
            </div>

            <div className="space-y-2.5 text-xs font-medium text-slate-700">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-[#006FBF] focus:ring-[#006FBF] h-4 w-4" />
                <span>Admission Number / ID</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-[#006FBF] focus:ring-[#006FBF] h-4 w-4" />
                <span>Student Full Name</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-[#006FBF] focus:ring-[#006FBF] h-4 w-4" />
                <span>Form / Class & Stream</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-[#006FBF] focus:ring-[#006FBF] h-4 w-4" />
                <span>Current Term Fee Balance</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-[#006FBF] focus:ring-[#006FBF] h-4 w-4" />
                <span>Attendance Rate (%)</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-[#006FBF] focus:ring-[#006FBF] h-4 w-4" />
                <span>Disciplinary Standing</span>
              </label>
            </div>
          </div>

          {/* STEP 3: FILTERS & CONDITIONS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#006FBF]/10 text-xs font-bold text-[#006FBF]">
                3
              </div>
              <h2 className="text-sm font-bold text-slate-900">Filters & Sorting</h2>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">
                  Filter Condition
                </label>
                <select
                  className="w-full rounded-xl border-0 py-2.5 px-3 text-xs font-medium text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF]"
                  defaultValue="all"
                >
                  <option value="all">Show All Records (No Filter)</option>
                  <option value="defaulters">Fee Balance Greater than 0</option>
                  <option value="low_attendance">Attendance Less than 90%</option>
                  <option value="warning">Active Disciplinary Warnings</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">
                  Sort Order
                </label>
                <select
                  className="w-full rounded-xl border-0 py-2.5 px-3 text-xs font-medium text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF]"
                  defaultValue="name"
                >
                  <option value="name">Alphabetical by Student Name</option>
                  <option value="adm">By Admission Number</option>
                  <option value="balance">Highest Fee Balance First</option>
                  <option value="attendance">Lowest Attendance First</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PREVIEW & TEMPLATES PANEL (8 COLS) */}
        <div className="flex flex-col gap-6 lg:col-span-8">
          {/* LIVE PREVIEW TABLE */}
          <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-eye text-[#006FBF]" />
                <h2 className="text-base font-bold text-slate-900">Live Report Preview</h2>
              </div>
              <span className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                Sample Output (4 records shown)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Adm No
                    </th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Student Name
                    </th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Class
                    </th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Fee Balance
                    </th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Attendance
                    </th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Discipline
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {PREVIEW_DATA.map((row) => (
                    <tr key={row.admNo} className="transition-colors hover:bg-slate-50">
                      <td className="whitespace-nowrap px-6 py-4 text-xs font-mono font-bold text-[#006FBF]">
                        {row.admNo}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900">
                        {row.studentName}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-xs font-medium text-slate-600">
                        {row.class}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-slate-900">
                        {row.termFeeBalance}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-xs font-bold text-emerald-600">
                        {row.attendanceRate}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${
                          row.disciplineStatus === 'Clean' ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' :
                          'bg-amber-50 text-amber-700 ring-amber-600/20'
                        }`}>
                          {row.disciplineStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-3.5 flex items-center justify-between text-xs text-slate-500">
              <span>Showing 4 of 480 total matching student records</span>
              <div className="flex items-center gap-2">
                <button className="rounded-lg bg-white px-3 py-1.5 font-medium shadow-sm ring-1 ring-slate-300 hover:bg-slate-50">
                  Export CSV
                </button>
                <button className="rounded-lg bg-white px-3 py-1.5 font-medium shadow-sm ring-1 ring-slate-300 hover:bg-slate-50">
                  Export Excel
                </button>
                <button className="rounded-lg bg-white px-3 py-1.5 font-medium shadow-sm ring-1 ring-slate-300 hover:bg-slate-50">
                  Export PDF
                </button>
              </div>
            </div>
          </div>

          {/* SAVED TEMPLATES QUICK REFERENCE */}
          <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Saved Report Templates</h2>
              <span className="text-xs font-medium text-slate-500">Quick load existing configurations</span>
            </div>

            <div className="divide-y divide-slate-100">
              {SAVED_TEMPLATES.map((tmpl) => (
                <div key={tmpl.id} className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-[#006FBF]">
                      <i className="fa-solid fa-file-lines" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{tmpl.name}</p>
                      <p className="text-xs text-slate-400">
                        {tmpl.source} • Modified {tmpl.lastModified} by {tmpl.author}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="hidden sm:inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-[#006FBF] ring-1 ring-inset ring-[#006FBF]/20">
                      {tmpl.frequency}
                    </span>
                    <button className="inline-flex items-center rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-all">
                      <i className="fa-solid fa-arrow-up-right-from-square mr-1.5 text-slate-500" /> Load
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}