// apps/web/app/dashboard/hostel/fees/page.tsx

import Link from 'next/link';

/* ==========================================================================
   MOCK DATA
   ========================================================================== */

const STATS = [
  {
    title: 'Term 3 Expected Collection',
    value: 'Ksh 14,420,000',
    subtext: 'Total billed across 412 boarders',
    icon: 'fa-money-bill-trend-up',
    color: 'from-[#006FBF] to-[#04B1D6]',
  },
  {
    title: 'Total Collected',
    value: 'Ksh 11,250,000',
    subtext: '78.0% of termly expected fees',
    icon: 'fa-sack-dollar',
    color: 'from-emerald-600 to-emerald-500',
  },
  {
    title: 'Outstanding Balances',
    value: 'Ksh 3,170,000',
    subtext: 'Pending collection',
    icon: 'fa-file-invoice-dollar',
    color: 'from-amber-500 to-amber-600',
  },
  {
    title: 'Defaulters / Overdue',
    value: '42 Students',
    subtext: 'Exceeded fee payment deadline',
    icon: 'fa-triangle-exclamation',
    color: 'from-rose-600 to-rose-500',
  },
];

const FEE_RECORDS = [
  {
    id: 'FEE-2026-T3-045',
    studentId: 'STU-2024-045',
    studentName: 'Brian Kiprop',
    grade: 'Form 3 Blue',
    hostelBlock: 'Elgon House',
    term: '2026 - Term 3',
    amountBilled: 35000,
    amountPaid: 35000,
    balance: 0,
    lastPaymentDate: 'Sep 28, 2026',
    status: 'Cleared',
  },
  {
    id: 'FEE-2026-T3-112',
    studentId: 'STU-2024-112',
    studentName: 'Faith Wanjiku',
    grade: 'Form 4 West',
    hostelBlock: 'Kilimanjaro House',
    term: '2026 - Term 3',
    amountBilled: 35000,
    amountPaid: 20000,
    balance: 15000,
    lastPaymentDate: 'Oct 02, 2026',
    status: 'Partial',
  },
  {
    id: 'FEE-2026-T3-089',
    studentId: 'STU-2025-089',
    studentName: 'Samuel Ochieng',
    grade: 'Form 2 East',
    hostelBlock: 'Kenya House',
    term: '2026 - Term 3',
    amountBilled: 35000,
    amountPaid: 0,
    balance: 35000,
    lastPaymentDate: '--',
    status: 'Unpaid',
  },
  {
    id: 'FEE-2026-T3-201',
    studentId: 'STU-2024-201',
    studentName: 'Amina Mohamed',
    grade: 'Form 4 North',
    hostelBlock: 'Aberdare House',
    term: '2026 - Term 3',
    amountBilled: 35000,
    amountPaid: 35000,
    balance: 0,
    lastPaymentDate: 'Sep 15, 2026',
    status: 'Cleared',
  },
  {
    id: 'FEE-2026-T3-014',
    studentId: 'STU-2026-014',
    studentName: 'Kevin Mutua',
    grade: 'Form 1 South',
    hostelBlock: 'Elgon House',
    term: '2026 - Term 3',
    amountBilled: 35000,
    amountPaid: 10000,
    balance: 25000,
    lastPaymentDate: 'Oct 04, 2026',
    status: 'Partial',
  },
  {
    id: 'FEE-2026-T3-156',
    studentId: 'STU-2025-156',
    studentName: 'Joy Chebet',
    grade: 'Form 2 Central',
    hostelBlock: 'Ruwenzori House',
    term: '2026 - Term 3',
    amountBilled: 35000,
    amountPaid: 0,
    balance: 35000,
    lastPaymentDate: '--',
    status: 'Unpaid',
  },
  {
    id: 'FEE-2026-T3-042',
    studentId: 'STU-2026-042',
    studentName: 'Ian Kamau',
    grade: 'Form 1 East',
    hostelBlock: 'Tsavo House',
    term: '2026 - Term 3',
    amountBilled: 35000,
    amountPaid: 35000,
    balance: 0,
    lastPaymentDate: 'Sep 10, 2026',
    status: 'Cleared',
  },
];

/* ==========================================================================
   FORMATTER UTILS
   ========================================================================== */

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/* ==========================================================================
   PAGE COMPONENT
   ========================================================================== */

export default function HostelFeesPage() {
  return (
    <div className="flex w-full flex-col gap-6 p-6 md:p-8">
      {/* ----------------------------------------------------------------------
          BREADCRUMBS & HEADER
          ---------------------------------------------------------------------- */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <Link href="/dashboard/hostel" className="hover:text-[#006FBF]">
            Hostel
          </Link>
          <i className="fa-solid fa-chevron-right text-[10px] text-slate-400" />
          <span className="text-slate-900">Boarding Fees</span>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Hostel Fee Management
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Track boarding fee collections, manage outstanding balances, and generate invoices.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#006FBF]"
            >
              <i className="fa-solid fa-file-invoice mr-2 text-slate-400" />
              Generate Invoices
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#006FBF] to-[#04B1D6] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-[#012E54] hover:to-[#006FBF] focus:outline-none focus:ring-2 focus:ring-[#006FBF] focus:ring-offset-2"
            >
              <i className="fa-solid fa-money-check-dollar mr-2" />
              Record Payment
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
            placeholder="Search student, receipt number, or hostel block..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            className="block rounded-xl border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF] sm:text-sm sm:leading-6"
            defaultValue="term3-2026"
          >
            <option value="term3-2026">2026 - Term 3</option>
            <option value="term2-2026">2026 - Term 2</option>
            <option value="term1-2026">2026 - Term 1</option>
          </select>

          <select
            className="block rounded-xl border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF] sm:text-sm sm:leading-6"
            defaultValue=""
          >
            <option value="" disabled>Hostel Block</option>
            <option value="all">All Blocks</option>
            <option value="elgon">Elgon House</option>
            <option value="kilimanjaro">Kilimanjaro House</option>
            <option value="kenya">Kenya House</option>
          </select>

          <select
            className="block rounded-xl border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF] sm:text-sm sm:leading-6"
            defaultValue=""
          >
            <option value="" disabled>Payment Status</option>
            <option value="all">All Statuses</option>
            <option value="cleared">Cleared</option>
            <option value="partial">Partial Payment</option>
            <option value="unpaid">Unpaid / Defaulters</option>
          </select>
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          FEE RECORDS TABLE
          ---------------------------------------------------------------------- */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Student Details
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Total Billed
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Amount Paid
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Outstanding Balance
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
              {FEE_RECORDS.map((record) => (
                <tr key={record.id} className="transition-colors hover:bg-slate-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                        {record.studentName.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div className="ml-3">
                        <Link
                          href={`/dashboard/students/${record.studentId}`}
                          className="text-sm font-semibold text-slate-900 hover:text-[#006FBF]"
                        >
                          {record.studentName}
                        </Link>
                        <p className="text-xs text-slate-500">
                          {record.grade} &bull; {record.hostelBlock}
                        </p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                    {formatCurrency(record.amountBilled)}
                  </td>
                  
                  <td className="whitespace-nowrap px-6 py-4">
                    <p className="text-sm font-medium text-emerald-600">
                      {formatCurrency(record.amountPaid)}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Last: {record.lastPaymentDate}
                    </p>
                  </td>
                  
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`text-sm font-bold ${record.balance > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                      {formatCurrency(record.balance)}
                    </span>
                  </td>
                  
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                        record.status === 'Cleared'
                          ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                          : record.status === 'Partial'
                          ? 'bg-amber-50 text-amber-700 ring-amber-600/20'
                          : 'bg-rose-50 text-rose-700 ring-rose-600/20'
                      }`}
                    >
                      {record.status === 'Cleared' && <i className="fa-solid fa-check mr-1.5 opacity-70" />}
                      {record.status === 'Partial' && <i className="fa-solid fa-circle-half-stroke mr-1.5 opacity-70" />}
                      {record.status === 'Unpaid' && <i className="fa-solid fa-triangle-exclamation mr-1.5 opacity-70" />}
                      {record.status}
                    </span>
                  </td>
                  
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-3">
                      <button className="text-slate-400 hover:text-[#006FBF]" title="View Statement">
                        <i className="fa-solid fa-file-lines" />
                      </button>
                      <button className="text-slate-400 hover:text-[#006FBF]" title="Add Payment">
                        <i className="fa-solid fa-plus" />
                      </button>
                      {record.balance > 0 && (
                        <button className="text-slate-400 hover:text-amber-600" title="Send Reminder">
                          <i className="fa-regular fa-bell" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-3">
          <p className="text-sm text-slate-600">
            Showing <span className="font-semibold">7</span> of <span className="font-semibold">412</span> fee records
          </p>
          <div className="flex items-center gap-2">
            <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
              Previous
            </button>
            <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}