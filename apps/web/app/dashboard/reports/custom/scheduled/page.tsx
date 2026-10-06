// apps/web/app/dashboard/reports/custom/scheduled/page.tsx

import Link from 'next/link';

/* ==========================================================================
   MOCK DATA
   ========================================================================== */

const STATS = [
  {
    title: 'Active Schedules',
    value: '6',
    subtext: 'Automated recurring reports',
    icon: 'fa-clock-rotate-left',
    color: 'from-[#006FBF] to-[#04B1D6]',
  },
  {
    title: 'Dispatches This Week',
    value: '24',
    subtext: 'Delivered securely to email / portal',
    icon: 'fa-paper-plane',
    color: 'from-emerald-600 to-emerald-500',
  },
  {
    title: 'Failed Dispatches',
    value: '0',
    subtext: '100% successful delivery rate',
    icon: 'fa-circle-check',
    color: 'from-indigo-600 to-indigo-500',
  },
  {
    title: 'Total Recipients',
    value: '18 Stakeholders',
    subtext: 'Board members, principals & bursars',
    icon: 'fa-users-rectangle',
    color: 'from-amber-500 to-amber-600',
  },
];

const SCHEDULED_REPORTS = [
  {
    id: 'SCH-001',
    name: 'Weekly Fee Defaulters & Balance Summary',
    template: 'Term 3 Fee Defaulters & Balance',
    frequency: 'Weekly (Every Monday, 08:00 AM)',
    nextRun: '12 Oct 2026, 08:00 AM',
    recipients: ['principal@school.edu', 'bursar@school.edu', 'board.finance@school.edu'],
    format: 'PDF & Excel',
    status: 'Active',
  },
  {
    id: 'SCH-002',
    name: 'Daily Low Attendance Alert Roll Call',
    template: 'Low Attendance Alert (Below 85%)',
    frequency: 'Daily (Mon - Fri, 04:00 PM)',
    nextRun: '07 Oct 2026, 04:00 PM',
    recipients: ['deputy.principal@school.edu', 'dean@school.edu'],
    format: 'CSV',
    status: 'Active',
  },
  {
    id: 'SCH-003',
    name: 'Monthly Boarding Room Occupancy Report',
    template: 'Boarding Room Occupancy & Vacancies',
    frequency: 'Monthly (1st of Every Month)',
    nextRun: '01 Nov 2026, 09:00 AM',
    recipients: ['boardmaster@school.edu', 'principal@school.edu'],
    format: 'PDF',
    status: 'Active',
  },
  {
    id: 'SCH-004',
    name: 'Termly Asset & Inventory Audit Report',
    template: 'Inventory & Store Operations Summary',
    frequency: 'Termly (End of Term)',
    nextRun: '28 Nov 2026, 05:00 PM',
    recipients: ['procurement@school.edu', 'bursar@school.edu'],
    format: 'Excel',
    status: 'Paused',
  },
];

/* ==========================================================================
   PAGE COMPONENT
   ========================================================================== */

export default function ScheduledReportsPage() {
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
          <span className="text-slate-900">Scheduled Reports</span>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Scheduled Reports & Automated Dispatches
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Configure automated recurring report generation and secure email deliveries to administrative stakeholders.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#006FBF]"
            >
              <i className="fa-solid fa-address-book mr-2 text-[#006FBF]" />
              Manage Recipients
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#006FBF] to-[#04B1D6] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-[#012E54] hover:to-[#006FBF] focus:outline-none focus:ring-2 focus:ring-[#006FBF] focus:ring-offset-2"
            >
              <i className="fa-solid fa-circle-plus mr-2" />
              New Schedule
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
              Frequency
            </label>
            <select
              className="rounded-xl border-0 py-2 pl-3 pr-8 text-xs font-medium text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF]"
              defaultValue="all"
            >
              <option value="all">All Frequencies</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="termly">Termly</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Dispatch Status
            </label>
            <select
              className="rounded-xl border-0 py-2 pl-3 pr-8 text-xs font-medium text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF]"
              defaultValue="all"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
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
            placeholder="Search scheduled report..."
          />
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          SCHEDULED REPORTS TABLE
          ---------------------------------------------------------------------- */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Active & Configured Report Schedules</h2>
            <p className="text-xs text-slate-500">Review automated delivery pipelines and recipient distribution lists</p>
          </div>
          <span className="inline-flex items-center rounded-md bg-[#006FBF]/10 px-2.5 py-1 text-xs font-medium text-[#006FBF] ring-1 ring-inset ring-[#006FBF]/20">
            4 Schedules Configured
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Schedule Name & Template
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Frequency & Next Run
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Recipients
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Format
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
              {SCHEDULED_REPORTS.map((sch) => (
                <tr key={sch.id} className="transition-colors hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-[#006FBF]">
                        <i className="fa-solid fa-clock-rotate-left" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{sch.name}</p>
                        <p className="text-xs text-slate-500">Template: <span className="font-medium text-slate-700">{sch.template}</span></p>
                      </div>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <p className="text-xs font-bold text-slate-900">{sch.frequency}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Next: {sch.nextRun}</p>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {sch.recipients.map((email, idx) => (
                        <span key={idx} className="inline-flex items-center text-xs text-slate-600">
                          <i className="fa-regular fa-envelope mr-1.5 text-slate-400 text-[10px]" />
                          {email}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-[#006FBF] ring-1 ring-inset ring-[#006FBF]/20">
                      {sch.format}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    {sch.status === 'Active' ? (
                      <span className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 mr-1.5 animate-pulse" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400 mr-1.5" /> Paused
                      </span>
                    )}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button className="inline-flex items-center rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-all">
                        <i className="fa-solid fa-pen-to-square mr-1 text-slate-500" /> Edit
                      </button>
                      <button className="inline-flex items-center rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-all">
                        <i className="fa-solid fa-ellipsis-vertical text-slate-500" />
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
  );
}