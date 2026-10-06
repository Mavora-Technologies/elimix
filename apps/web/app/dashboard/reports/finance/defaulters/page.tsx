// apps/web/app/dashboard/reports/finance/defaulters/page.tsx

import Link from 'next/link';

/* ==========================================================================
   MOCK DATA
   ========================================================================== */

const STATS = [
  {
    title: 'Total Outstanding Arrears',
    value: 'KES 3,450,000',
    subtext: 'Across 142 students in Term 3',
    icon: 'fa-triangle-exclamation',
    color: 'from-rose-600 to-rose-500',
  },
  {
    title: 'Total Defaulters',
    value: '142',
    subtext: '29.4% of total student population',
    icon: 'fa-user-minus',
    color: 'from-amber-500 to-amber-600',
  },
  {
    title: 'Highest Deficit Form',
    value: 'Form 2',
    subtext: 'KES 1,240,000 pending',
    icon: 'fa-chart-column',
    color: 'from-[#006FBF] to-[#04B1D6]',
  },
  {
    title: 'Critical (> KES 50k)',
    value: '18 Students',
    subtext: 'Accounts requiring immediate action',
    icon: 'fa-radiation',
    color: 'from-indigo-600 to-indigo-500',
  },
];

const ARREARS_BY_FORM = [
  { form: 'Form 4', amount: 'KES 850,000', count: 32, percentage: 24.6, color: 'bg-emerald-500' },
  { form: 'Form 3', amount: 'KES 950,000', count: 41, percentage: 27.5, color: 'bg-blue-500' },
  { form: 'Form 2', amount: 'KES 1,240,000', count: 48, percentage: 36.0, color: 'bg-amber-500' },
  { form: 'Form 1', amount: 'KES 410,000', count: 21, percentage: 11.9, color: 'bg-indigo-500' },
];

const DEFAULTERS_LIST = [
  {
    id: 'DEF-001',
    student: 'Samuel Omondi',
    admNo: 'ADM-2025-089',
    class: 'Form 2 North',
    parentContact: '+254 712 345 678',
    totalBilled: 'KES 65,000',
    amountPaid: 'KES 10,000',
    balance: 'KES 55,000',
    lastPayment: '12 Aug 2026',
    status: 'critical', // critical, warning, standard
  },
  {
    id: 'DEF-002',
    student: 'Mercy Wanjala',
    admNo: 'ADM-2024-112',
    class: 'Form 3 East',
    parentContact: '+254 722 987 654',
    totalBilled: 'KES 65,000',
    amountPaid: 'KES 15,000',
    balance: 'KES 50,000',
    lastPayment: '05 Sep 2026',
    status: 'critical',
  },
  {
    id: 'DEF-003',
    student: 'Victor Kipchumba',
    admNo: 'ADM-2023-045',
    class: 'Form 4 South',
    parentContact: '+254 733 456 789',
    totalBilled: 'KES 72,000',
    amountPaid: 'KES 35,000',
    balance: 'KES 37,000',
    lastPayment: '28 Sep 2026',
    status: 'warning',
  },
  {
    id: 'DEF-004',
    student: 'Joy Mutheu',
    admNo: 'ADM-2025-167',
    class: 'Form 2 West',
    parentContact: '+254 711 223 344',
    totalBilled: 'KES 65,000',
    amountPaid: 'KES 30,000',
    balance: 'KES 35,000',
    lastPayment: '15 Sep 2026',
    status: 'warning',
  },
  {
    id: 'DEF-005',
    student: 'Ian Kimani',
    admNo: 'ADM-2026-021',
    class: 'Form 1 North',
    parentContact: '+254 722 112 233',
    totalBilled: 'KES 55,000',
    amountPaid: 'KES 40,000',
    balance: 'KES 15,000',
    lastPayment: '01 Oct 2026',
    status: 'standard',
  },
  {
    id: 'DEF-006',
    student: 'Sarah Ndeti',
    admNo: 'ADM-2024-088',
    class: 'Form 3 South',
    parentContact: '+254 733 998 877',
    totalBilled: 'KES 65,000',
    amountPaid: 'KES 53,000',
    balance: 'KES 12,000',
    lastPayment: '20 Sep 2026',
    status: 'standard',
  },
];

/* ==========================================================================
   PAGE COMPONENT
   ========================================================================== */

export default function FeeDefaultersReportPage() {
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
          <span className="text-slate-900">Fee Defaulters</span>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Fee Defaulters & Arrears
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Identify students with outstanding fee balances and manage debt recovery communications.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#006FBF]"
            >
              <i className="fa-solid fa-file-excel mr-2 text-emerald-600" />
              Export Defaulters List
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-rose-700 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
            >
              <i className="fa-solid fa-envelope-open-text mr-2" />
              Send Bulk SMS Reminders
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
              Academic Year
            </label>
            <select
              className="rounded-xl border-0 py-2 pl-3 pr-8 text-xs font-medium text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF]"
              defaultValue="2026"
            >
              <option value="2026">2026 Academic Year</option>
              <option value="2025">2025 Academic Year</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Form / Class
            </label>
            <select
              className="rounded-xl border-0 py-2 pl-3 pr-8 text-xs font-medium text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF]"
              defaultValue="all"
            >
              <option value="all">All Forms</option>
              <option value="f4">Form 4</option>
              <option value="f3">Form 3</option>
              <option value="f2">Form 2</option>
              <option value="f1">Form 1</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Arrears Bracket
            </label>
            <select
              className="rounded-xl border-0 py-2 pl-3 pr-8 text-xs font-medium text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF]"
              defaultValue="all"
            >
              <option value="all">Any Balance</option>
              <option value="critical">&gt; KES 50,000</option>
              <option value="high">KES 20,000 - 50,000</option>
              <option value="low">&lt; KES 20,000</option>
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
            placeholder="Search student or Adm No..."
          />
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          ARREARS BY FORM BREAKDOWN
          ---------------------------------------------------------------------- */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Arrears Distribution by Form</h2>
            <p className="text-xs text-slate-500">Breakdown of outstanding balances across the school</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ARREARS_BY_FORM.map((item) => (
            <div key={item.form} className="flex flex-col rounded-xl border border-slate-100 bg-slate-50/50 p-4">
              <span className="text-xs font-bold text-slate-500">{item.form}</span>
              <span className="mt-1 text-xl font-extrabold text-slate-900">{item.amount}</span>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                <span>{item.count} Defaulters</span>
                <span className="font-semibold text-slate-700">{item.percentage}%</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                <div className={`h-full ${item.color}`} style={{ width: `${item.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          DEFAULTERS TABLE
          ---------------------------------------------------------------------- */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Student Arrears List</h2>
          <span className="text-xs font-medium text-slate-500">Showing 142 records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Student & Admission
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Class
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Parent Contact
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Total Billed
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Outstanding Balance
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Last Payment
                </th>
                <th scope="col" className="relative px-6 py-4 text-right">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {DEFAULTERS_LIST.map((student) => (
                <tr key={student.id} className="transition-colors hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 font-bold text-xs">
                         {student.student.split(' ')[0][0]}{student.student.split(' ')[1][0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{student.student}</p>
                        <p className="text-xs text-slate-500 font-mono">{student.admNo}</p>
                      </div>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-xs font-medium text-slate-600">
                    {student.class}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <p className="text-sm font-medium text-slate-700">{student.parentContact}</p>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-500">
                    {student.totalBilled}
                    <div className="text-[10px] text-emerald-600 mt-0.5">Paid: {student.amountPaid}</div>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`text-sm font-bold ${
                      student.status === 'critical' ? 'text-rose-600' : 
                      student.status === 'warning' ? 'text-amber-600' : 'text-slate-900'
                    }`}>
                      {student.balance}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-xs text-slate-500">
                    {student.lastPayment}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-slate-100 text-slate-500 hover:bg-[#006FBF] hover:text-white transition-colors" title="View Profile">
                        <i className="fa-solid fa-eye" />
                      </button>
                      <button className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors" title="Send SMS Reminder">
                        <i className="fa-solid fa-bell" />
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