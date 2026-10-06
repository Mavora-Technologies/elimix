// apps/web/app/dashboard/reports/finance/collections/page.tsx

import Link from 'next/link';

/* ==========================================================================
   MOCK DATA
   ========================================================================== */

const STATS = [
  {
    title: 'Total Collected (Term 3)',
    value: 'KES 18,450,000',
    subtext: '84.2% of expected revenue target',
    icon: 'fa-sack-dollar',
    color: 'from-emerald-600 to-emerald-500',
  },
  {
    title: 'M-Pesa Collections',
    value: 'KES 11,200,000',
    subtext: '60.7% of total payments',
    icon: 'fa-mobile-screen-button',
    color: 'from-[#006FBF] to-[#04B1D6]',
  },
  {
    title: 'Direct Bank Deposits',
    value: 'KES 6,150,000',
    subtext: '33.3% via KCB & Equity Bank',
    icon: 'fa-building-columns',
    color: 'from-indigo-600 to-indigo-500',
  },
  {
    title: 'Pending Bank Clearance',
    value: 'KES 1,100,000',
    subtext: '14 unverified cheque/EFTS',
    icon: 'fa-clock-rotate-left',
    color: 'from-amber-500 to-amber-600',
  },
];

const PAYMENT_METHODS = [
  { method: 'M-Pesa Express / Paybill', amount: 'KES 11,200,000', percentage: 60.7, count: 640, color: 'bg-emerald-600' },
  { method: 'Direct Bank Transfer', amount: 'KES 4,800,000', percentage: 26.0, count: 180, color: 'bg-[#006FBF]' },
  { method: 'Bank Cheques', amount: 'KES 1,350,000', percentage: 7.3, count: 24, color: 'bg-indigo-500' },
  { method: 'Credit / Debit Card', amount: 'KES 1,100,000', percentage: 6.0, count: 42, color: 'bg-amber-500' },
];

const RECENT_COLLECTIONS = [
  {
    receiptNo: 'RCT-2026-0891',
    student: 'Amina Mohamed',
    admNo: 'ADM-2024-041',
    class: 'Form 1 North',
    amount: 'KES 35,000',
    channel: 'M-Pesa',
    reference: 'QKH8912KLX',
    date: '06 Oct 2026, 11:24 AM',
    status: 'Verified',
  },
  {
    receiptNo: 'RCT-2026-0890',
    student: 'Brian Kiprop',
    admNo: 'ADM-2023-112',
    class: 'Form 4 North',
    amount: 'KES 48,500',
    channel: 'Bank Transfer (KCB)',
    reference: 'FT2627918231',
    date: '06 Oct 2026, 10:45 AM',
    status: 'Verified',
  },
  {
    receiptNo: 'RCT-2026-0889',
    student: 'Kevin Otieno',
    admNo: 'ADM-2025-089',
    class: 'Form 2 South',
    amount: 'KES 22,000',
    channel: 'M-Pesa',
    reference: 'QKH7182MM9',
    date: '06 Oct 2026, 09:15 AM',
    status: 'Verified',
  },
  {
    receiptNo: 'RCT-2026-0888',
    student: 'Faith Cherotich',
    admNo: 'ADM-2024-104',
    class: 'Form 3 East',
    amount: 'KES 50,000',
    channel: 'Cheque (NCBA)',
    reference: 'CHQ-004912',
    date: '05 Oct 2026, 03:30 PM',
    status: 'Pending Clearance',
  },
  {
    receiptNo: 'RCT-2026-0887',
    student: 'David Njuguna',
    admNo: 'ADM-2025-156',
    class: 'Form 2 West',
    amount: 'KES 18,500',
    channel: 'Card Payment',
    reference: 'TXN-991204',
    date: '05 Oct 2026, 02:10 PM',
    status: 'Verified',
  },
];

/* ==========================================================================
   PAGE COMPONENT
   ========================================================================== */

export default function FeeCollectionsReportPage() {
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
          <span className="text-slate-900">Fee Collections</span>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Fee Collections Report
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Track revenue receipts, payment channels, daily ledger entries, and bank settlement status.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#006FBF]"
            >
              <i className="fa-solid fa-file-excel mr-2 text-emerald-600" />
              Export Collection Ledger
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#006FBF] to-[#04B1D6] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-[#012E54] hover:to-[#006FBF] focus:outline-none focus:ring-2 focus:ring-[#006FBF] focus:ring-offset-2"
            >
              <i className="fa-solid fa-receipt mr-2" />
              Daily Summary PDF
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
              Term
            </label>
            <select
              className="rounded-xl border-0 py-2 pl-3 pr-8 text-xs font-medium text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF]"
              defaultValue="term3"
            >
              <option value="term3">Term 3</option>
              <option value="term2">Term 2</option>
              <option value="term1">Term 1</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Payment Channel
            </label>
            <select
              className="rounded-xl border-0 py-2 pl-3 pr-8 text-xs font-medium text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF]"
              defaultValue="all"
            >
              <option value="all">All Channels</option>
              <option value="mpesa">M-Pesa</option>
              <option value="bank">Bank Deposit / EFT</option>
              <option value="cheque">Cheque</option>
              <option value="card">Card Payment</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Verification Status
            </label>
            <select
              className="rounded-xl border-0 py-2 pl-3 pr-8 text-xs font-medium text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF]"
              defaultValue="all"
            >
              <option value="all">All Statuses</option>
              <option value="verified">Verified & Cleared</option>
              <option value="pending">Pending Clearance</option>
              <option value="reversed">Reversed / Failed</option>
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
            placeholder="Search receipt, student or Ref..."
          />
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          PAYMENT METHOD BREAKDOWN CARDS
          ---------------------------------------------------------------------- */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Collections by Payment Method</h2>
            <p className="text-xs text-slate-500">Distribution of revenue sources across digital and traditional banking routes</p>
          </div>
          <span className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
            886 Total Transactions
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PAYMENT_METHODS.map((method) => (
            <div key={method.method} className="flex flex-col rounded-xl border border-slate-100 bg-slate-50/50 p-4">
              <span className="text-xs font-bold text-slate-500">{method.method}</span>
              <span className="mt-1 text-xl font-extrabold text-slate-900">{method.amount}</span>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                <span>{method.count} Transactions</span>
                <span className="font-semibold text-slate-700">{method.percentage}%</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                <div className={`h-full ${method.color}`} style={{ width: `${method.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          RECENT TRANSACTIONS TABLE
          ---------------------------------------------------------------------- */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Collection Receipts & Transactions</h2>
          <span className="text-xs font-medium text-slate-500">Showing latest receipts</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Receipt No & Student
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Form / Stream
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Amount Paid
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Payment Channel
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Txn Reference
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Date & Time
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
              {RECENT_COLLECTIONS.map((receipt) => (
                <tr key={receipt.receiptNo} className="transition-colors hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                        <i className="fa-solid fa-file-invoice text-sm" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{receipt.student}</p>
                        <p className="text-xs text-slate-400 font-mono">{receipt.receiptNo} • {receipt.admNo}</p>
                      </div>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-xs font-medium text-slate-600">
                    {receipt.class}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-slate-900">
                    {receipt.amount}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-xs font-medium text-slate-700">
                    {receipt.channel}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-xs font-mono text-slate-500">
                    {receipt.reference}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-xs text-slate-500">
                    {receipt.date}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    {receipt.status === 'Verified' ? (
                      <span className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                        <i className="fa-solid fa-circle-check mr-1 text-[10px]" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-md bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                        <i className="fa-solid fa-clock mr-1 text-[10px]" />
                        Pending
                      </span>
                    )}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <button className="inline-flex items-center rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-all">
                      <i className="fa-solid fa-print mr-1.5 text-slate-500" /> Print
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