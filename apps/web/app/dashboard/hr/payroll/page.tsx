// apps/web/app/dashboard/hr/payroll/page.tsx

import Link from 'next/link';

/* ==========================================================================
   MOCK DATA
   ========================================================================== */

const STATS = [
  {
    title: 'Total Net Payout',
    value: 'KES 4,250,000',
    subtext: 'For October 2026',
    icon: 'fa-money-bill-wave',
    color: 'from-emerald-600 to-emerald-400',
  },
  {
    title: 'Total Deductions',
    value: 'KES 845,000',
    subtext: 'Taxes, NHIF, NSSF, Loans',
    icon: 'fa-file-invoice-dollar',
    color: 'from-rose-500 to-rose-400',
  },
  {
    title: 'Employees Processed',
    value: '138 / 142',
    subtext: '4 pending review',
    icon: 'fa-users-gear',
    color: 'from-[#006FBF] to-[#04B1D6]',
  },
  {
    title: 'Next Pay Date',
    value: 'Oct 28, 2026',
    subtext: 'Scheduled automated run',
    icon: 'fa-calendar-check',
    color: 'from-[#012E54] to-[#006FBF]',
  },
];

const PAYROLL_RECORDS = [
  {
    id: 'PRL-1001',
    staffId: 'EMP-001',
    staffName: 'Sarah Jenkins',
    role: 'Mathematics Teacher',
    department: 'Academics',
    basicPay: 120000,
    allowances: 15000,
    deductions: 32000,
    netPay: 103000,
    status: 'Processed',
    bank: 'KCB Bank',
  },
  {
    id: 'PRL-1002',
    staffId: 'EMP-002',
    staffName: 'Michael Ochieng',
    role: 'Transport Manager',
    department: 'Transport',
    basicPay: 85000,
    allowances: 10000,
    deductions: 21000,
    netPay: 74000,
    status: 'Processed',
    bank: 'Equity Bank',
  },
  {
    id: 'PRL-1003',
    staffId: 'EMP-003',
    staffName: 'Grace Mutuku',
    role: 'Librarian',
    department: 'Academics',
    basicPay: 65000,
    allowances: 5000,
    deductions: 14000,
    netPay: 56000,
    status: 'Pending',
    bank: 'Co-op Bank',
  },
  {
    id: 'PRL-1004',
    staffId: 'EMP-004',
    staffName: 'David Njoroge',
    role: 'Senior Accountant',
    department: 'Finance',
    basicPay: 140000,
    allowances: 20000,
    deductions: 42000,
    netPay: 118000,
    status: 'Processed',
    bank: 'Standard Chartered',
  },
  {
    id: 'PRL-1005',
    staffId: 'EMP-005',
    staffName: 'Lucy Wanjiku',
    role: 'School Nurse',
    department: 'Administration',
    basicPay: 75000,
    allowances: 8000,
    deductions: 18000,
    netPay: 65000,
    status: 'Processed',
    bank: 'Absa Bank',
  },
  {
    id: 'PRL-1006',
    staffId: 'EMP-006',
    staffName: 'Peter Kipkorir',
    role: 'Security Guard',
    department: 'Security',
    basicPay: 35000,
    allowances: 4000,
    deductions: 6000,
    netPay: 33000,
    status: 'Pending',
    bank: 'Equity Bank',
  },
];

/* ==========================================================================
   FORMATTER UTILITIES
   ========================================================================== */

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(amount);
};

/* ==========================================================================
   PAGE COMPONENT
   ========================================================================== */

export default function PayrollPage() {
  return (
    <div className="flex w-full flex-col gap-6 p-6 md:p-8">
      {/* ----------------------------------------------------------------------
          HEADER
          ---------------------------------------------------------------------- */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Payroll Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Process salaries, manage deductions, and generate payslips for staff.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#006FBF]"
          >
            <i className="fa-solid fa-download mr-2 text-slate-400" />
            Export Bank File
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#006FBF] to-[#04B1D6] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-[#012E54] hover:to-[#006FBF] focus:outline-none focus:ring-2 focus:ring-[#006FBF] focus:ring-offset-2"
          >
            <i className="fa-solid fa-play mr-2" />
            Run Payroll
          </button>
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
                  <span className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
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
          FILTERS & SEARCH
          ---------------------------------------------------------------------- */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <i className="fa-solid fa-magnifying-glass text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-xl border-0 py-2.5 pl-10 pr-4 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-[#006FBF] sm:text-sm sm:leading-6"
            placeholder="Search staff name or ID..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="month"
            defaultValue="2026-10"
            className="block rounded-xl border-0 py-2.5 px-3 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF] sm:text-sm sm:leading-6"
          />

          <select
            className="block rounded-xl border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF] sm:text-sm sm:leading-6"
            defaultValue=""
          >
            <option value="" disabled>Status</option>
            <option value="processed">Processed</option>
            <option value="pending">Pending</option>
            <option value="error">Error</option>
          </select>

          <select
            className="block rounded-xl border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF] sm:text-sm sm:leading-6"
            defaultValue=""
          >
            <option value="" disabled>Department</option>
            <option value="academics">Academics</option>
            <option value="administration">Administration</option>
            <option value="finance">Finance</option>
            <option value="transport">Transport</option>
            <option value="security">Security</option>
          </select>
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          PAYROLL TABLE
          ---------------------------------------------------------------------- */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Staff Member
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Basic Pay
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Allowances
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Deductions
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Net Pay
                </th>
                <th scope="col" className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th scope="col" className="relative px-6 py-4 text-right">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {PAYROLL_RECORDS.map((record) => (
                <tr key={record.id} className="transition-colors hover:bg-slate-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                        {record.staffName.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div className="ml-3">
                        <Link
                          href={`/dashboard/hr/staff/${record.staffId}`}
                          className="text-sm font-semibold text-slate-900 hover:text-[#006FBF]"
                        >
                          {record.staffName}
                        </Link>
                        <p className="text-xs text-slate-500">{record.department}</p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-slate-600">
                    {formatCurrency(record.basicPay)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-emerald-600">
                    + {formatCurrency(record.allowances)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-rose-600">
                    - {formatCurrency(record.deductions)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-bold text-slate-900">
                    {formatCurrency(record.netPay)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                        record.status === 'Processed'
                          ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                          : 'bg-amber-50 text-amber-700 ring-amber-600/20'
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-3">
                      <button className="text-slate-400 hover:text-[#006FBF]" title="Edit Adjustments">
                        <i className="fa-solid fa-pen-to-square" />
                      </button>
                      <button className="text-slate-400 hover:text-[#006FBF]" title="Download Payslip">
                        <i className="fa-solid fa-file-pdf" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
          <div>
            <p className="text-sm font-medium text-slate-900">
              Page Total Net: <span className="font-bold">{formatCurrency(449000)}</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Showing <span className="font-semibold">6</span> of <span className="font-semibold">142</span> records
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#006FBF]">
              Previous
            </button>
            <button className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#006FBF]">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}