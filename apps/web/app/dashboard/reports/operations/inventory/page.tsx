// apps/web/app/dashboard/reports/operations/inventory/page.tsx

import Link from 'next/link';

/* ==========================================================================
   MOCK DATA
   ========================================================================== */

const STATS = [
  {
    title: 'Total Inventory Items',
    value: '1,420',
    subtext: 'Across 4 main store categories',
    icon: 'fa-boxes-stacked',
    color: 'from-[#006FBF] to-[#04B1D6]',
  },
  {
    title: 'Low Stock Alerts',
    value: '5 Items',
    subtext: 'Requires immediate reordering',
    icon: 'fa-triangle-exclamation',
    color: 'from-rose-600 to-rose-500',
  },
  {
    title: 'Estimated Stock Value',
    value: 'KES 4.8M',
    subtext: 'Total valuation of active assets',
    icon: 'fa-vault',
    color: 'from-emerald-600 to-emerald-500',
  },
  {
    title: 'Active Stores',
    value: '3 Depots',
    subtext: 'Main Store, Lab Store, Library',
    icon: 'fa-warehouse',
    color: 'from-indigo-600 to-indigo-500',
  },
];

const INVENTORY_CATEGORIES = [
  {
    category: 'Textbooks & Library',
    totalItems: 450,
    stockLevel: '98%',
    status: 'Optimal',
    depot: 'School Library',
    color: 'bg-[#006FBF]',
  },
  {
    category: 'Science Laboratory',
    totalItems: 280,
    stockLevel: '85%',
    status: 'Good',
    depot: 'Science Complex',
    color: 'bg-emerald-500',
  },
  {
    category: 'Stationery & Office',
    totalItems: 420,
    stockLevel: '92%',
    status: 'Optimal',
    depot: 'Main Store',
    color: 'bg-indigo-500',
  },
  {
    category: 'Uniforms & Sports',
    totalItems: 270,
    stockLevel: '78%',
    status: 'Low Stock',
    depot: 'Bursar Annex',
    color: 'bg-amber-500',
  },
];

const RECENT_INVENTORY_LOGS = [
  {
    id: 'INV-2026-301',
    item: 'Form 3 Mathematics Textbooks',
    category: 'Textbooks & Library',
    qty: '+50 copies',
    type: 'Stock In',
    location: 'School Library',
    date: '06 Oct 2026',
    status: 'Received',
  },
  {
    id: 'INV-2026-300',
    item: 'Hydrochloric Acid (500ml)',
    category: 'Science Laboratory',
    qty: '-12 bottles',
    type: 'Disbursement',
    location: 'Science Complex',
    date: '05 Oct 2026',
    status: 'Dispatched',
  },
  {
    id: 'INV-2026-299',
    item: 'A4 Printing Paper Reams',
    category: 'Stationery & Office',
    qty: '-20 reams',
    type: 'Disbursement',
    location: 'Main Store',
    date: '04 Oct 2026',
    status: 'Dispatched',
  },
  {
    id: 'INV-2026-298',
    item: 'School Branded Sweaters (Size L)',
    category: 'Uniforms & Sports',
    qty: '-15 units',
    type: 'Reorder Needed',
    location: 'Bursar Annex',
    date: '02 Oct 2026',
    status: 'Low Stock',
  },
  {
    id: 'INV-2026-297',
    item: 'Football Match Balls',
    category: 'Uniforms & Sports',
    qty: '+10 pieces',
    type: 'Stock In',
    location: 'Games Store',
    date: '01 Oct 2026',
    status: 'Received',
  },
];

/* ==========================================================================
   PAGE COMPONENT
   ========================================================================== */

export default function InventoryOperationsReportPage() {
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
          <span className="text-slate-900">Inventory & Assets</span>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Inventory & Store Operations
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Track school asset stock levels, textbook disbursements, laboratory supplies, and reorder alerts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#006FBF]"
            >
              <i className="fa-solid fa-file-excel mr-2 text-emerald-600" />
              Export Asset Register
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#006FBF] to-[#04B1D6] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-[#012E54] hover:to-[#006FBF] focus:outline-none focus:ring-2 focus:ring-[#006FBF] focus:ring-offset-2"
            >
              <i className="fa-solid fa-circle-plus mr-2" />
              Add Stock Item
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
              Store Category
            </label>
            <select
              className="rounded-xl border-0 py-2 pl-3 pr-8 text-xs font-medium text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF]"
              defaultValue="all"
            >
              <option value="all">All Categories</option>
              <option value="textbooks">Textbooks & Library</option>
              <option value="science">Science Laboratory</option>
              <option value="stationery">Stationery & Office</option>
              <option value="uniforms">Uniforms & Sports</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Stock Status
            </label>
            <select
              className="rounded-xl border-0 py-2 pl-3 pr-8 text-xs font-medium text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF]"
              defaultValue="all"
            >
              <option value="all">All Statuses</option>
              <option value="optimal">Optimal Stock</option>
              <option value="low">Low Stock Alert</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Storage Depot
            </label>
            <select
              className="rounded-xl border-0 py-2 pl-3 pr-8 text-xs font-medium text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF]"
              defaultValue="all"
            >
              <option value="all">All Depots</option>
              <option value="library">School Library</option>
              <option value="science">Science Complex</option>
              <option value="main">Main Store</option>
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
            placeholder="Search item or SKU..."
          />
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          INVENTORY CATEGORY SUMMARY CARDS
          ---------------------------------------------------------------------- */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Inventory Levels by Category</h2>
            <p className="text-xs text-slate-500">Live item counts and capacity percentages across storage facilities</p>
          </div>
          <span className="inline-flex items-center rounded-md bg-[#006FBF]/10 px-2.5 py-1 text-xs font-medium text-[#006FBF] ring-1 ring-inset ring-[#006FBF]/20">
            1,420 Items Tracked
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {INVENTORY_CATEGORIES.map((item) => (
            <div key={item.category} className="flex flex-col rounded-xl border border-slate-100 bg-slate-50/50 p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-slate-900">{item.category}</span>
                <span className="text-xs font-bold text-slate-600">{item.totalItems} items</span>
              </div>
              <p className="text-[11px] font-medium text-slate-500">{item.depot}</p>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-500 mb-1.5">
                <span>Stock Level</span>
                <span className="font-semibold text-slate-700">{item.stockLevel}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                <div className={`h-full ${item.color}`} style={{ width: item.stockLevel }} />
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-200/60 pt-3 text-xs">
                <span className="text-slate-400 uppercase font-semibold text-[10px]">Status</span>
                <span className={`font-bold ${item.status === 'Low Stock' ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          RECENT INVENTORY LOGS TABLE
          ---------------------------------------------------------------------- */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Recent Stock Movements & Transactions</h2>
          <span className="text-xs font-medium text-slate-500">Showing latest records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Item & Category
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Transaction Type & Qty
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Storage Location
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Date
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
              {RECENT_INVENTORY_LOGS.map((log) => (
                <tr key={log.id} className="transition-colors hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-[#006FBF]">
                        <i className="fa-solid fa-box text-slate-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{log.item}</p>
                        <p className="text-xs text-slate-500">{log.category}</p>
                      </div>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex mb-1 items-center rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase ring-1 ring-inset ${
                      log.type === 'Stock In' ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' :
                      log.type === 'Disbursement' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' :
                      'bg-amber-50 text-amber-700 ring-amber-600/20'
                    }`}>
                      {log.type}
                    </span>
                    <p className="text-sm font-bold text-slate-900">{log.qty}</p>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-600">
                    {log.location}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-xs font-medium text-slate-600">
                    {log.date}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    {log.status === 'Received' && (
                      <span className="inline-flex items-center text-xs font-semibold text-emerald-600">
                        <i className="fa-solid fa-check-circle mr-1.5" /> Received
                      </span>
                    )}
                    {log.status === 'Dispatched' && (
                      <span className="inline-flex items-center text-xs font-semibold text-[#006FBF]">
                        <i className="fa-solid fa-paper-plane mr-1.5" /> Dispatched
                      </span>
                    )}
                    {log.status === 'Low Stock' && (
                      <span className="inline-flex items-center text-xs font-semibold text-amber-600">
                        <i className="fa-solid fa-triangle-exclamation mr-1.5" /> Low Stock
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