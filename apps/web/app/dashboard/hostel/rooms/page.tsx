// apps/web/app/dashboard/hostel/rooms/page.tsx

import Link from 'next/link';

/* ==========================================================================
   MOCK DATA
   ========================================================================== */

const STATS = [
  {
    title: 'Total Rooms',
    value: '120',
    subtext: 'Across 6 hostel blocks',
    icon: 'fa-door-open',
    color: 'from-[#006FBF] to-[#04B1D6]',
  },
  {
    title: 'Total Bed Capacity',
    value: '480',
    subtext: '412 currently occupied',
    icon: 'fa-bed',
    color: 'from-[#012E54] to-[#006FBF]',
  },
  {
    title: 'Vacant Beds',
    value: '68',
    subtext: 'Available for immediate allocation',
    icon: 'fa-bed-empty', // using a generic or standard fa-bed if empty doesn't exist, let's use fa-mattress or fa-user-plus
    iconFallback: 'fa-user-plus',
    color: 'from-emerald-600 to-emerald-500',
  },
  {
    title: 'Under Maintenance',
    value: '5 Rooms',
    subtext: 'Currently blocked from allocation',
    icon: 'fa-hammer',
    color: 'from-amber-500 to-amber-600',
  },
];

const ROOMS_LIST = [
  {
    id: 'RM-ELG-101',
    roomNumber: 'Room B-101',
    blockName: 'Elgon House (Boys)',
    floor: 'Ground Floor',
    capacity: 4,
    occupied: 4,
    status: 'Full',
    lastInspected: 'Oct 01, 2026',
  },
  {
    id: 'RM-ELG-102',
    roomNumber: 'Room B-102',
    blockName: 'Elgon House (Boys)',
    floor: 'Ground Floor',
    capacity: 4,
    occupied: 2,
    status: 'Available',
    lastInspected: 'Oct 01, 2026',
  },
  {
    id: 'RM-KIL-204',
    roomNumber: 'Room A-204',
    blockName: 'Kilimanjaro House (Girls)',
    floor: '1st Floor',
    capacity: 4,
    occupied: 3,
    status: 'Maintenance',
    lastInspected: 'Oct 02, 2026',
  },
  {
    id: 'RM-KIL-301',
    roomNumber: 'Room A-301',
    blockName: 'Kilimanjaro House (Girls)',
    floor: '2nd Floor',
    capacity: 4,
    occupied: 4,
    status: 'Full',
    lastInspected: 'Sep 28, 2026',
  },
  {
    id: 'RM-KEN-108',
    roomNumber: 'Room K-108',
    blockName: 'Kenya House (Boys)',
    floor: 'Ground Floor',
    capacity: 4,
    occupied: 0,
    status: 'Maintenance',
    lastInspected: 'Sep 15, 2026',
  },
  {
    id: 'RM-ABE-105',
    roomNumber: 'Room C-105',
    blockName: 'Aberdare House (Girls)',
    floor: 'Ground Floor',
    capacity: 4,
    occupied: 1,
    status: 'Available',
    lastInspected: 'Oct 05, 2026',
  },
  {
    id: 'RM-RUW-202',
    roomNumber: 'Room R-202',
    blockName: 'Ruwenzori House (Girls)',
    floor: '1st Floor',
    capacity: 4,
    occupied: 4,
    status: 'Full',
    lastInspected: 'Sep 30, 2026',
  },
];

/* ==========================================================================
   PAGE COMPONENT
   ========================================================================== */

export default function RoomsManagementPage() {
  return (
    <div className="flex w-full flex-col gap-6 p-6 md:p-8">
      {/* ----------------------------------------------------------------------
          HEADER
          ---------------------------------------------------------------------- */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Rooms Directory
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage individual hostel rooms, monitor bed capacities, and track room maintenance statuses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#006FBF]"
          >
            <i className="fa-solid fa-file-arrow-down mr-2 text-slate-400" />
            Export List
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#006FBF] to-[#04B1D6] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-[#012E54] hover:to-[#006FBF] focus:outline-none focus:ring-2 focus:ring-[#006FBF] focus:ring-offset-2"
          >
            <i className="fa-solid fa-plus mr-2" />
            Add New Room
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
                  <span className="text-3xl font-bold tracking-tight text-slate-900">
                    {stat.value}
                  </span>
                </div>
              </div>
              <div
                className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-inner`}
              >
                <i className={`fa-solid ${stat.iconFallback || stat.icon} text-lg`} />
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
            placeholder="Search room number or block name..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            className="block rounded-xl border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF] sm:text-sm sm:leading-6"
            defaultValue=""
          >
            <option value="" disabled>Hostel Block</option>
            <option value="all">All Blocks</option>
            <option value="elgon">Elgon House (Boys)</option>
            <option value="kilimanjaro">Kilimanjaro House (Girls)</option>
            <option value="kenya">Kenya House (Boys)</option>
          </select>

          <select
            className="block rounded-xl border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF] sm:text-sm sm:leading-6"
            defaultValue=""
          >
            <option value="" disabled>Floor Level</option>
            <option value="all">All Floors</option>
            <option value="ground">Ground Floor</option>
            <option value="1st">1st Floor</option>
            <option value="2nd">2nd Floor</option>
          </select>

          <select
            className="block rounded-xl border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF] sm:text-sm sm:leading-6"
            defaultValue=""
          >
            <option value="" disabled>Occupancy Status</option>
            <option value="all">All Statuses</option>
            <option value="full">Full Occupancy</option>
            <option value="available">Available Beds</option>
            <option value="maintenance">Under Maintenance</option>
          </select>
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          ROOMS TABLE
          ---------------------------------------------------------------------- */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Room Details
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Block & Location
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Capacity & Occupancy
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Last Inspected
                </th>
                <th scope="col" className="relative px-6 py-4 text-right">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {ROOMS_LIST.map((room) => {
                const occupancyPercentage = Math.round((room.occupied / room.capacity) * 100);

                return (
                  <tr key={room.id} className="transition-colors hover:bg-slate-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                          <i className="fa-solid fa-door-open" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{room.roomNumber}</p>
                          <p className="text-xs text-slate-500">ID: {room.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <p className="text-sm font-medium text-slate-900">{room.blockName}</p>
                      <p className="text-xs text-slate-500">{room.floor}</p>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="w-32">
                        <div className="flex items-center justify-between text-xs font-medium text-slate-600 mb-1">
                          <span>{room.occupied} / {room.capacity} Beds</span>
                          <span>{occupancyPercentage}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full ${
                              occupancyPercentage === 100
                                ? 'bg-slate-400'
                                : occupancyPercentage > 0
                                ? 'bg-[#006FBF]'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${occupancyPercentage}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                          room.status === 'Full'
                            ? 'bg-slate-100 text-slate-700 ring-slate-500/20'
                            : room.status === 'Available'
                            ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                            : 'bg-amber-50 text-amber-700 ring-amber-600/20'
                        }`}
                      >
                        {room.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                      {room.lastInspected}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-3">
                        <button className="text-slate-400 hover:text-[#006FBF]" title="Edit Room Info">
                          <i className="fa-solid fa-pen-to-square" />
                        </button>
                        <button className="text-slate-400 hover:text-[#006FBF]" title="View Occupants">
                          <i className="fa-solid fa-users" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-3">
          <p className="text-sm text-slate-600">
            Showing <span className="font-semibold">7</span> of <span className="font-semibold">120</span> rooms
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