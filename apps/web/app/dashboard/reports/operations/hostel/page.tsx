// apps/web/app/dashboard/reports/operations/hostel/page.tsx

import Link from 'next/link';

/* ==========================================================================
   MOCK DATA
   ========================================================================== */

const STATS = [
  {
    title: 'Total Boarding Students',
    value: '320',
    subtext: '66.7% of total school population',
    icon: 'fa-bed',
    color: 'from-[#006FBF] to-[#04B1D6]',
  },
  {
    title: 'Overall Occupancy Rate',
    value: '88.9%',
    subtext: '320 occupied / 360 total capacity',
    icon: 'fa-building-user',
    color: 'from-emerald-600 to-emerald-500',
  },
  {
    title: 'Open Maintenance Requests',
    value: '7 Issues',
    subtext: '3 high priority pending repairs',
    icon: 'fa-wrench',
    color: 'from-amber-500 to-amber-600',
  },
  {
    title: 'Active Dormitories',
    value: '4 Blocks',
    subtext: '2 Boys dorms, 2 Girls dorms',
    icon: 'fa-house-user',
    color: 'from-indigo-600 to-indigo-500',
  },
];

const HOSTEL_BLOCKS = [
  {
    id: 'HST-BLK-A',
    name: 'Mt. Kenya Hall',
    type: 'Boys Senior (Forms 3 & 4)',
    warden: 'Mr. John Kamau',
    capacity: 100,
    occupied: 92,
    vacancies: 8,
    occupancyRate: 92.0,
    status: 'Optimal',
    color: 'bg-[#006FBF]',
  },
  {
    id: 'HST-BLK-B',
    name: 'Elgon Block',
    type: 'Boys Junior (Forms 1 & 2)',
    warden: 'Mr. Peter Omondi',
    capacity: 80,
    occupied: 74,
    vacancies: 6,
    occupancyRate: 92.5,
    status: 'Optimal',
    color: 'bg-indigo-500',
  },
  {
    id: 'HST-BLK-C',
    name: 'Kilimanjaro Hall',
    type: 'Girls Senior (Forms 3 & 4)',
    warden: 'Mrs. Mary Wanjala',
    capacity: 100,
    occupied: 96,
    vacancies: 4,
    occupancyRate: 96.0,
    status: 'Near Full',
    color: 'bg-rose-500',
  },
  {
    id: 'HST-BLK-D',
    name: 'Mara House',
    type: 'Girls Junior (Forms 1 & 2)',
    warden: 'Ms. Agnes Mutua',
    capacity: 80,
    occupied: 58,
    vacancies: 22,
    occupancyRate: 72.5,
    status: 'Available',
    color: 'bg-emerald-500',
  },
];

const RECENT_MAINTENANCE = [
  {
    id: 'MNT-2026-042',
    hostel: 'Elgon Block',
    room: 'Room B-12',
    category: 'Plumbing',
    description: 'Leaking water pipe in main washroom',
    priority: 'High',
    reportedDate: '05 Oct 2026',
    status: 'In Progress',
    warden: 'Mr. Peter Omondi',
  },
  {
    id: 'MNT-2026-041',
    hostel: 'Kilimanjaro Hall',
    room: 'Room K-08',
    category: 'Electrical',
    description: 'Broken overhead light fixture and socket',
    priority: 'Medium',
    reportedDate: '04 Oct 2026',
    status: 'Pending',
    warden: 'Mrs. Mary Wanjala',
  },
  {
    id: 'MNT-2026-040',
    hostel: 'Mt. Kenya Hall',
    room: 'Room M-03',
    category: 'Carpentry',
    description: 'Broken door lock mechanism',
    priority: 'Critical',
    reportedDate: '03 Oct 2026',
    status: 'Resolved',
    warden: 'Mr. John Kamau',
  },
  {
    id: 'MNT-2026-039',
    hostel: 'Mara House',
    room: 'Room R-15',
    category: 'Furniture',
    description: 'Damaged window latch and frame',
    priority: 'Low',
    reportedDate: '02 Oct 2026',
    status: 'Resolved',
    warden: 'Ms. Agnes Mutua',
  },
  {
    id: 'MNT-2026-038',
    hostel: 'Mt. Kenya Hall',
    room: 'Room M-21',
    category: 'Furniture',
    description: 'Bunk bed frame reinforcement needed',
    priority: 'Medium',
    reportedDate: '01 Oct 2026',
    status: 'Resolved',
    warden: 'Mr. John Kamau',
  },
];

/* ==========================================================================
   PAGE COMPONENT
   ========================================================================== */

export default function HostelOperationsReportPage() {
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
          <span className="text-slate-900">Hostel & Boarding</span>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Hostel & Boarding Operations
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Track boarding capacity, room allocations, hostel warden assignments, and maintenance requests.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#006FBF]"
            >
              <i className="fa-solid fa-file-excel mr-2 text-emerald-600" />
              Export Roster
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#006FBF] to-[#04B1D6] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-[#012E54] hover:to-[#006FBF] focus:outline-none focus:ring-2 focus:ring-[#006FBF] focus:ring-offset-2"
            >
              <i className="fa-solid fa-screwdriver-wrench mr-2" />
              Log Maintenance Issue
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
              <option value="term1">Term 1 (2026)</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Dormitory Block
            </label>
            <select
              className="rounded-xl border-0 py-2 pl-3 pr-8 text-xs font-medium text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF]"
              defaultValue="all"
            >
              <option value="all">All Dormitories</option>
              <option value="mt-kenya">Mt. Kenya Hall</option>
              <option value="elgon">Elgon Block</option>
              <option value="kilimanjaro">Kilimanjaro Hall</option>
              <option value="mara">Mara House</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Maintenance Status
            </label>
            <select
              className="rounded-xl border-0 py-2 pl-3 pr-8 text-xs font-medium text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF]"
              defaultValue="all"
            >
              <option value="all">All Priorities / Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
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
            placeholder="Search room, student or warden..."
          />
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          HOSTEL OCCUPANCY BY BLOCK
          ---------------------------------------------------------------------- */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Hostel Block Capacity & Allocation</h2>
            <p className="text-xs text-slate-500">Live boarder distribution and available vacancy count per dormitory block</p>
          </div>
          <span className="inline-flex items-center rounded-md bg-[#006FBF]/10 px-2.5 py-1 text-xs font-medium text-[#006FBF] ring-1 ring-inset ring-[#006FBF]/20">
            Total Capacity: 360 Beds
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HOSTEL_BLOCKS.map((block) => (
            <div key={block.id} className="flex flex-col rounded-xl border border-slate-100 bg-slate-50/50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">{block.name}</span>
                <span className="text-xs font-bold text-slate-500">{block.occupied} / {block.capacity}</span>
              </div>
              <p className="mt-0.5 text-[11px] font-medium text-slate-500">{block.type}</p>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-500 mb-1.5">
                <span>Occupancy</span>
                <span className="font-semibold text-slate-700">{block.occupancyRate}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                <div className={`h-full ${block.color}`} style={{ width: `${block.occupancyRate}%` }} />
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-200/60 pt-3 text-xs">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Hostel Warden</p>
                  <p className="font-semibold text-slate-700">{block.warden}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Vacancies</p>
                  <p className="font-bold text-emerald-600">{block.vacancies} open</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          RECENT MAINTENANCE ISSUES TABLE
          ---------------------------------------------------------------------- */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Recent Hostel Maintenance & Repairs</h2>
          <span className="text-xs font-medium text-slate-500">Showing 5 latest requests</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Hostel & Room
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Category & Issue
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Priority
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Reported Date
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Supervisor
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
              {RECENT_MAINTENANCE.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-[#006FBF]">
                        <i className="fa-solid fa-door-closed text-slate-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{item.hostel}</p>
                        <p className="text-xs font-bold text-[#006FBF]">{item.room}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-900">{item.category}</p>
                    <p className="text-xs text-slate-500 truncate max-w-xs">{item.description}</p>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${
                      item.priority === 'Critical' ? 'bg-rose-50 text-rose-700 ring-rose-600/20' :
                      item.priority === 'High' ? 'bg-amber-50 text-amber-700 ring-amber-600/20' :
                      item.priority === 'Medium' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' :
                      'bg-slate-50 text-slate-700 ring-slate-600/20'
                    }`}>
                      {item.priority}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-xs font-medium text-slate-600">
                    {item.reportedDate}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-xs text-slate-500">
                    {item.warden}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    {item.status === 'Resolved' && (
                      <span className="inline-flex items-center text-xs font-semibold text-emerald-600">
                        <i className="fa-solid fa-check-circle mr-1.5" /> Resolved
                      </span>
                    )}
                    {item.status === 'In Progress' && (
                      <span className="inline-flex items-center text-xs font-semibold text-[#006FBF]">
                        <i className="fa-solid fa-spinner fa-spin mr-1.5" /> In Progress
                      </span>
                    )}
                    {item.status === 'Pending' && (
                      <span className="inline-flex items-center text-xs font-semibold text-amber-600">
                        <i className="fa-solid fa-clock mr-1.5" /> Pending
                      </span>
                    )}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <button className="inline-flex items-center rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-all">
                      <i className="fa-solid fa-gears mr-1.5 text-slate-500" /> Manage
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