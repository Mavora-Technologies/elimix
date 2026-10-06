// apps/web/app/dashboard/reports/finance/income-expenditure/page.tsx

import Link from 'next/link';

/* ==========================================================================
   MOCK DATA
   ========================================================================== */

const STATS = [
  {
    title: 'Total Income (Term 3)',
    value: 'KES 24,850,000',
    subtext: '+5.4% higher than budget target',
    icon: 'fa-chart-line-up',
    color: 'from-emerald-600 to-emerald-500',
  },
  {
    title: 'Total Expenditure',
    value: 'KES 18,320,000',
    subtext: '73.7% of total revenue spent',
    icon: 'fa-arrow-trend-down',
    color: 'from-rose-600 to-rose-500',
  },
  {
    title: 'Net Operating Surplus',
    value: 'KES 6,530,000',
    subtext: '26.3% net operating margin',
    icon: 'fa-piggy-bank',
    color: 'from-[#006FBF] to-[#04B1D6]',
  },
  {
    title: 'Budget Utilization Rate',
    value: '82.4%',
    subtext: 'Within fiscal tolerance limits',
    icon: 'fa-scale-balanced',
    color: 'from-indigo-600 to-indigo-500',
  },
];

const CATEGORY_BREAKDOWN = {
  income: [
    { category: 'Tuition & Academic Fees', amount: 'KES 16,200,000', share: '65.2%', trend: '+3.1%' },
    { category: 'Boarding & Catering Fees', amount: 'KES 5,400,000', share: '21.7%', trend: '+1.5%' },
    { category: 'Government Subsidies & Capitation', amount: 'KES 2,100,000', share: '8.5%', trend: '0.0%' },
    { category: 'Transport & Auxiliary Services', amount: 'KES 1,150,000', share: '4.6%', trend: '+8.2%' },
  ],
  expenditure: [
    { category: 'Staff Payroll & Benefits', amount: 'KES 9,800,000', share: '53.5%', status: 'Normal' },
    { category: 'Catering & Food Supplies', amount: 'KES 3,200,000', share: '17.5%', status: 'Normal' },
    { category: 'Utilities & Campus Facility Ops', amount: 'KES 2,450,000', share: '13.4%', status: 'Near Limit' },
    { category: 'Academic Books & Lab Equipment', amount: 'KES 1,670,000', share: '9.1%', status: 'Normal' },
    { category: 'Admin & Operational Expenses', amount: 'KES 1,200,000', share: '6.5%', status: 'Normal' },
  ],
};

const FINANCIAL_LEDGER = [
  {
    code: 'INC-101',
    accountHead: 'Tuition & Assessment Fees',
    type: 'Income',
    budgeted: 'KES 15,800,000',
    actual: 'KES 16,200,000',
    variance: 'KES +400,000',
    varianceType: 'favorable',
    percentage: '102.5%',
  },
  {
    code: 'INC-102',
    accountHead: 'Boarding & Catering Revenue',
    type: 'Income',
    budgeted: 'KES 5,500,000',
    actual: 'KES 5,400,000',
    variance: 'KES -100,000',
    varianceType: 'unfavorable',
    percentage: '98.2%',
  },
  {
    code: 'EXP-201',
    accountHead: 'Teaching Staff Salaries & Benefits',
    type: 'Expenditure',
    budgeted: 'KES 7,200,000',
    actual: 'KES 7,150,000',
    variance: 'KES +50,000',
    varianceType: 'favorable',
    percentage: '99.3%',
  },
  {
    code: 'EXP-202',
    accountHead: 'Non-Teaching & Support Staff Payroll',
    type: 'Expenditure',
    budgeted: 'KES 2,600,000',
    actual: 'KES 2,650,000',
    variance: 'KES -50,000',
    varianceType: 'unfavorable',
    percentage: '101.9%',
  },
  {
    code: 'EXP-301',
    accountHead: 'Kitchen & Meal Supplies',
    type: 'Expenditure',
    budgeted: 'KES 3,000,000',
    actual: 'KES 3,200,000',
    variance: 'KES -200,000',
    varianceType: 'unfavorable',
    percentage: '106.7%',
  },
  {
    code: 'EXP-401',
    accountHead: 'Electricity, Water & Fuel',
    type: 'Expenditure',
    budgeted: 'KES 2,100,000',
    actual: 'KES 2,450,000',
    variance: 'KES -350,000',
    varianceType: 'unfavorable',
    percentage: '116.6%',
  },
  {
    code: 'EXP-501',
    accountHead: 'Science Lab Equipment & Materials',
    type: 'Expenditure',
    budgeted: 'KES 1,800,000',
    actual: 'KES 1,670,000',
    variance: 'KES +130,000',
    varianceType: 'favorable',
    percentage: '92.7%',
  },
  {
    code: 'EXP-601',
    accountHead: 'ICT Infrastructure & Software Licensing',
    type: 'Expenditure',
    budgeted: 'KES 1,300,000',
    actual: 'KES 1,200,000',
    variance: 'KES +100,000',
    varianceType: 'favorable',
    percentage: '92.3%',
  },
];

/* ==========================================================================
   PAGE COMPONENT
   ========================================================================== */

export default function IncomeExpenditureReportPage() {
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
          <span className="text-slate-900">Income vs Expenditure</span>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Income vs Expenditure Statement
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Comprehensive financial breakdown comparing operational revenue against actual expenses and budget variances.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#006FBF]"
            >
              <i className="fa-solid fa-file-excel mr-2 text-emerald-600" />
              Export Financial Statement
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#006FBF] to-[#04B1D6] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-[#012E54] hover:to-[#006FBF] focus:outline-none focus:ring-2 focus:ring-[#006FBF] focus:ring-offset-2"
            >
              <i className="fa-solid fa-file-pdf mr-2" />
              Audit Report PDF
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
              Financial Year
            </label>
            <select
              className="rounded-xl border-0 py-2 pl-3 pr-8 text-xs font-medium text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF]"
              defaultValue="2026"
            >
              <option value="2026">2026 Financial Year</option>
              <option value="2025">2025 Financial Year</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Period / Term
            </label>
            <select
              className="rounded-xl border-0 py-2 pl-3 pr-8 text-xs font-medium text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF]"
              defaultValue="term3"
            >
              <option value="term3">Term 3 (Sep - Dec)</option>
              <option value="term2">Term 2 (May - Aug)</option>
              <option value="term1">Term 1 (Jan - Apr)</option>
              <option value="full">Full Year Cumulative</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Ledger Type
            </label>
            <select
              className="rounded-xl border-0 py-2 pl-3 pr-8 text-xs font-medium text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF]"
              defaultValue="all"
            >
              <option value="all">All Accounts (Combined)</option>
              <option value="income">Income Accounts Only</option>
              <option value="expenditure">Expenditure Accounts Only</option>
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
            placeholder="Search account head or code..."
          />
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          INCOME vs EXPENDITURE SIDE-BY-SIDE SUMMARY
          ---------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Income Breakdown */}
        <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <i className="fa-solid fa-circle-arrow-down text-emerald-600" />
                Revenue & Income Streams
              </h2>
              <p className="text-xs text-slate-500">Distribution of incoming cashflow</p>
            </div>
            <span className="text-sm font-extrabold text-emerald-600">KES 24.85M</span>
          </div>

          <div className="mt-4 space-y-4">
            {CATEGORY_BREAKDOWN.income.map((item) => (
              <div key={item.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{item.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{item.amount}</span>
                    <span className="text-slate-400">({item.share})</span>
                  </div>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full bg-emerald-500"
                    style={{ width: item.share }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expenditure Breakdown */}
        <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <i className="fa-solid fa-circle-arrow-up text-rose-600" />
                Operating Expenses
              </h2>
              <p className="text-xs text-slate-500">Distribution of outgoing operational costs</p>
            </div>
            <span className="text-sm font-extrabold text-rose-600">KES 18.32M</span>
          </div>

          <div className="mt-4 space-y-4">
            {CATEGORY_BREAKDOWN.expenditure.map((item) => (
              <div key={item.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{item.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{item.amount}</span>
                    <span className="text-slate-400">({item.share})</span>
                  </div>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full bg-rose-500"
                    style={{ width: item.share }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          FINANCIAL LEDGER TABLE
          ---------------------------------------------------------------------- */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Account Head Ledger & Variance</h2>
          <span className="text-xs font-medium text-slate-500">Comparing Budgeted vs Actuals</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Code & Account Head
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Account Type
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Budgeted Target
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Actual Total
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Variance (KES)
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Execution %
                </th>
                <th scope="col" className="relative px-6 py-4 text-right">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {FINANCIAL_LEDGER.map((row) => (
                <tr key={row.code} className="transition-colors hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-mono font-bold text-[#006FBF]">
                        {row.code.split('-')[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{row.accountHead}</p>
                        <p className="text-xs text-slate-400 font-mono">{row.code}</p>
                      </div>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    {row.type === 'Income' ? (
                      <span className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                        Income
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-md bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-600/20">
                        Expenditure
                      </span>
                    )}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-500">
                    {row.budgeted}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-slate-900">
                    {row.actual}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-xs font-bold">
                    {row.varianceType === 'favorable' ? (
                      <span className="text-emerald-600">{row.variance} (Favorable)</span>
                    ) : (
                      <span className="text-rose-600">{row.variance} (Unfavorable)</span>
                    )}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-xs font-semibold text-slate-700">
                    {row.percentage}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <button className="inline-flex items-center rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-all">
                      <i className="fa-solid fa-list-ul mr-1.5 text-slate-500" /> Sub-Ledger
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