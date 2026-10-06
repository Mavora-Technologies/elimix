// apps/web/app/dashboard/reports/operations/transport/page.tsx

import Link from 'next/link';

/* ==========================================================================
   MOCK DATA
   ========================================================================== */

const STATS = [
  {
    title: 'Total Commuters',
    value: '185',
    subtext: '38% of total student population',
    icon: 'fa-users-line',
    color: 'from-[#006FBF] to-[#04B1D6]',
  },
  {
    title: 'Active Fleet',
    value: '5',
    subtext: '4 Buses, 1 Van in service',
    icon: 'fa-bus',
    color: 'from-emerald-600 to-emerald-500',
  },
  {
    title: 'On-Time Performance',
    value: '95.2%',
    subtext: 'Based on morning pickup schedules',
    icon: 'fa-stopwatch',
    color: 'from-indigo-600 to-indigo-500',
  },
  {
    title: 'Vehicles in Maintenance',
    value: '1',
    subtext: 'Scheduled servicing (KCD 890F)',
    icon: 'fa-wrench',
    color: 'from-amber-500 to-amber-600',
  },
];

const FLEET_ROUTES = [
  {
    id: 'RTE-01',
    name: 'Karen / Langata Route',
    vehicle: 'KCA 123A (40-Seater)',
    driver: 'Mr. John Omondi',
    capacity: 40,
    enrolled: 38,
    occupancyRate: 95.0,
    status: 'Active',
    color: 'bg-[#006FBF]',
  },
  {
    id: 'RTE-02',
    name: 'Westlands / Lavington',
    vehicle: 'KCB 456B (40-Seater)',
    driver: 'Mr. Peter Mutua',
    capacity: 40,
    enrolled: 40,
    occupancyRate: 100.0,
    status: 'Full',
    color: 'bg-emerald-500',
  },
  {
    id: 'RTE-03',
    name: 'South B / South C',
    vehicle: 'KCC 789C (33-Seater)',
    driver: 'Mr. Samuel Njuguna',
    capacity: 33,
    enrolled: 29,
    occupancyRate: 87.8,
    status: 'Active',
    color: 'bg-indigo-500',
  },
  {
    id: 'RTE-04',
    name: 'Ruaka / Kiambu Road',
    vehicle: 'KCD 012D (40-Seater)',
    driver: 'Mr. David Kiprop',
    capacity: 40,
    enrolled: 36,
    occupancyRate: 90.0,
    status: 'Active',
    color: 'bg-[#04B1D6]',
  },
  {
    id: 'RTE-05',
    name: 'Kilimani / Kileleshwa',
    vehicle: 'KCE 345E (14-Seater Van)',
    driver: 'Mr. James Mwangi',
    capacity: 14,
    enrolled: 12,
    occupancyRate: 85.7,
    status: 'Active',
    color: 'bg-amber-500',
  },
];

const RECENT_FLEET_LOGS = [
  {
    id: 'LOG-2026-112',
    date: '06 Oct 2026',
    vehicle: 'KCB 456B',
    route: 'Westlands / Lavington',
    type: 'Delay',
    description: 'Delayed by 20 mins due to heavy traffic on Waiyaki Way',
    driver: 'Mr. Peter Mutua',
    status: 'Resolved',
  },
  {
    id: 'LOG-2026-111',
    date: '05 Oct 2026',
    vehicle: 'KCD 890F',
    route: 'Spare / Backup',
    type: 'Maintenance',
    description: 'Routine engine service and oil change',
    driver: 'Workshop',
    status: 'In Progress',
  },
  {
    id: 'LOG-2026-110',
    date: '03 Oct 2026',
    vehicle: 'KCA 123A',
    route: 'Karen / Langata Route',
    type: 'Incident',
    description: 'Minor tire puncture at Langata Road; replaced with spare',
    driver: 'Mr. John Omondi',
    status: 'Resolved',
  },
  {
    id: 'LOG-2026-109',
    date: '01 Oct 2026',
    vehicle: 'KCE 345E',
    route: 'Kilimani / Kileleshwa',
    type: 'Maintenance',
    description: 'Replaced faulty wiper blades',
    driver: 'Mr. James Mwangi',
    status: 'Resolved',
  },
  {
    id: 'LOG-2026-108',
    date: '28 Sep 2026',
    vehicle: 'KCC 789C',
    route: 'South B / South C',
    type: 'Delay',
    description: 'Morning pickup delayed by 15 mins (rain)',
    driver: 'Mr. Samuel Njuguna',
    status: 'Resolved',
  },
];

/* ==========================================================================
   PAGE COMPONENT
   ========================================================================== */

export default function TransportOperationsReportPage() {
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
          <span className="text-slate-900">Transport & Fleet</span>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Transport & Fleet Operations
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage school bus routes, fleet capacity, driver assignments, and maintenance logs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#006FBF]"
            >
              <i className="fa-solid fa-file-excel mr-2 text-emerald-600" />
              Export Route Lists
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#006FBF] to-[#04B1D6] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-[#012E54] hover:to-[#006FBF] focus:outline-none focus:ring-2 focus:ring-[#006FBF] focus:ring-offset-2"
            >
              <i className="fa-solid fa-truck-medical mr-2" />
              Log Fleet Issue
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
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Route Category
            </label>
            <select
              className="rounded-xl border-0 py-2 pl-3 pr-8 text-xs font-medium text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF]"
              defaultValue="all"
            >
              <option value="all">All Routes</option>
              <option value="karen">Karen / Langata</option>
              <option value="westlands">Westlands / Lavington</option>
              <option value="southb">South B / South C</option>
              <option value="ruaka">Ruaka / Kiambu</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Log Type
            </label>
            <select
              className="rounded-xl border-0 py-2 pl-3 pr-8 text-xs font-medium text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF]"
              defaultValue="all"
            >
              <option value="all">All Logs</option>
              <option value="maintenance">Maintenance</option>
              <option value="delay">Delays</option>
              <option value="incident">Incidents</option>
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
            placeholder="Search vehicle or driver..."
          />
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          ROUTE & FLEET ALLOCATION CARDS
          ---------------------------------------------------------------------- */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Route Capacity & Allocation</h2>
            <p className="text-xs text-slate-500">Live commuter distribution and available seats per transport route</p>
          </div>
          <span className="inline-flex items-center rounded-md bg-[#006FBF]/10 px-2.5 py-1 text-xs font-medium text-[#006FBF] ring-1 ring-inset ring-[#006FBF]/20">
            Total Fleet Capacity: 167 Seats
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {FLEET_ROUTES.map((route) => (
            <div key={route.id} className="flex flex-col rounded-xl border border-slate-100 bg-slate-50/50 p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-slate-900 truncate pr-2">{route.name}</span>
                <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">{route.enrolled} / {route.capacity}</span>
              </div>
              <p className="text-xs font-bold text-[#006FBF]">{route.vehicle}</p>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-500 mb-1.5">
                <span>Occupancy</span>
                <span className="font-semibold text-slate-700">{route.occupancyRate}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                <div className={`h-full ${route.color}`} style={{ width: `${route.occupancyRate}%` }} />
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-200/60 pt-3 text-xs">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Driver</p>
                  <p className="font-semibold text-slate-700">{route.driver}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Status</p>
                  <p className={`font-bold ${route.status === 'Full' ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {route.status}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          RECENT FLEET LOGS TABLE
          ---------------------------------------------------------------------- */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Recent Fleet Logs & Incidents</h2>
          <span className="text-xs font-medium text-slate-500">Showing latest records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Vehicle & Route
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Log Type & Description
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Date
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Driver / Reporter
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
              {RECENT_FLEET_LOGS.map((log) => (
                <tr key={log.id} className="transition-colors hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-[#006FBF]">
                        <i className="fa-solid fa-bus text-slate-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{log.vehicle}</p>
                        <p className="text-xs font-medium text-slate-500">{log.route}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`inline-flex mb-1 items-center rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase ring-1 ring-inset ${
                      log.type === 'Maintenance' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' :
                      log.type === 'Delay' ? 'bg-amber-50 text-amber-700 ring-amber-600/20' :
                      'bg-rose-50 text-rose-700 ring-rose-600/20'
                    }`}>
                      {log.type}
                    </span>
                    <p className="text-sm text-slate-700 max-w-md">{log.description}</p>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-xs font-medium text-slate-600">
                    {log.date}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                    {log.driver}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    {log.status === 'Resolved' && (
                      <span className="inline-flex items-center text-xs font-semibold text-emerald-600">
                        <i className="fa-solid fa-check-circle mr-1.5" /> Resolved
                      </span>
                    )}
                    {log.status === 'In Progress' && (
                      <span className="inline-flex items-center text-xs font-semibold text-[#006FBF]">
                        <i className="fa-solid fa-spinner fa-spin mr-1.5" /> In Progress
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