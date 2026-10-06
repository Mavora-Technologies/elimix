// apps/web/app/dashboard/hostel/hostels/page.tsx

import Link from 'next/link';

/* ==========================================================================
   MOCK DATA
   ========================================================================== */

const STATS = [
  {
    title: 'Total Hostel Blocks',
    value: '6 Blocks',
    subtext: '3 Boys | 3 Girls Dorms',
    icon: 'fa-building-user',
    color: 'from-[#006FBF] to-[#04B1D6]',
  },
  {
    title: 'Total Bed Capacity',
    value: '480 Beds',
    subtext: 'Across 120 room units',
    icon: 'fa-bed',
    color: 'from-[#012E54] to-[#006FBF]',
  },
  {
    title: 'Active Housemasters',
    value: '6 Patrons',
    subtext: '1 Head warden & 5 assistants',
    icon: 'fa-user-tie',
    color: 'from-emerald-600 to-emerald-500',
  },
  {
    title: 'Blocks Under Renovation',
    value: '1 Block',
    subtext: 'Kenya House (Wing B)',
    icon: 'fa-triangle-exclamation',
    color: 'from-amber-500 to-amber-600',
  },
];

const HOSTELS = [
  {
    id: 'HST-BLK-01',
    name: 'Elgon House',
    gender: 'Boys Wing',
    capacity: 96,
    occupied: 88,
    roomsCount: 24,
    houseMaster: 'Mr. David Njoroge',
    matron: 'N/A',
    floors: 3,
    status: 'Active',
    amenities: ['Study Hall', 'Hot Shower', 'WiFi'],
  },
  {
    id: 'HST-BLK-02',
    name: 'Kilimanjaro House',
    gender: 'Girls Wing',
    capacity: 96,
    occupied: 92,
    roomsCount: 24,
    houseMaster: 'N/A',
    matron: 'Mrs. Grace Mutuku',
    floors: 3,
    status: 'Active',
    amenities: ['Study Hall', 'Laundry Room', 'Hot Shower', 'WiFi'],
  },
  {
    id: 'HST-BLK-03',
    name: 'Kenya House',
    gender: 'Boys Wing',
    capacity: 80,
    occupied: 62,
    roomsCount: 20,
    houseMaster: 'Mr. Peter Kipkorir',
    matron: 'N/A',
    floors: 2,
    status: 'Partial Maintenance',
    amenities: ['Common Lounge', 'Hot Shower'],
  },
  {
    id: 'HST-BLK-04',
    name: 'Aberdare House',
    gender: 'Girls Wing',
    capacity: 72,
    occupied: 70,
    roomsCount: 18,
    houseMaster: 'N/A',
    matron: 'Ms. Lucy Wanjiku',
    floors: 2,
    status: 'Active',
    amenities: ['Study Hall', 'Hot Shower', 'Garden Access'],
  },
  {
    id: 'HST-BLK-05',
    name: 'Ruwenzori House',
    gender: 'Girls Wing',
    capacity: 80,
    occupied: 76,
    roomsCount: 20,
    houseMaster: 'N/A',
    matron: 'Mrs. Sarah Jenkins',
    floors: 2,
    status: 'Active',
    amenities: ['Study Hall', 'Laundry Room', 'WiFi'],
  },
  {
    id: 'HST-BLK-06',
    name: 'Tsavo House',
    gender: 'Boys Wing',
    capacity: 56,
    occupied: 24,
    roomsCount: 14,
    houseMaster: 'Mr. Michael Ochieng',
    matron: 'N/A',
    floors: 2,
    status: 'Active',
    amenities: ['Common Lounge', 'Sports Field Access'],
  },
];

/* ==========================================================================
   PAGE COMPONENT
   ========================================================================== */

export default function HostelsListPage() {
  return (
    <div className="flex w-full flex-col gap-6 p-6 md:p-8">
      {/* ----------------------------------------------------------------------
          HEADER
          ---------------------------------------------------------------------- */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Hostel Blocks Directory
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Overview of all boarding dormitories, capacity utilization, and assigned house masters.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#006FBF]"
          >
            <i className="fa-solid fa-file-export mr-2 text-slate-400" />
            Export Directory
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#006FBF] to-[#04B1D6] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-[#012E54] hover:to-[#006FBF] focus:outline-none focus:ring-2 focus:ring-[#006FBF] focus:ring-offset-2"
          >
            <i className="fa-solid fa-plus mr-2" />
            Add Hostel Block
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
            placeholder="Search hostel name, block ID, or house master..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            className="block rounded-xl border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF] sm:text-sm sm:leading-6"
            defaultValue=""
          >
            <option value="" disabled>Gender Wing</option>
            <option value="boys">Boys Wing</option>
            <option value="girls">Girls Wing</option>
          </select>

          <select
            className="block rounded-xl border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF] sm:text-sm sm:leading-6"
            defaultValue=""
          >
            <option value="" disabled>Status</option>
            <option value="active">Active</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          HOSTEL CARDS GRID
          ---------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {HOSTELS.map((hostel) => {
          const occupancyRate = Math.round((hostel.occupied / hostel.capacity) * 100);

          return (
            <div
              key={hostel.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#006FBF]">
                      <i className="fa-solid fa-building text-xl" />
                    </div>
                    <div>
                      <Link
                        href={`/dashboard/hostel/hostels/${hostel.id}`}
                        className="text-lg font-bold text-slate-900 hover:text-[#006FBF]"
                      >
                        {hostel.name}
                      </Link>
                      <p className="text-xs text-slate-500">{hostel.gender} &bull; {hostel.floors} Floors</p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                      hostel.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                        : 'bg-amber-50 text-amber-700 ring-amber-600/20'
                    }`}
                  >
                    {hostel.status}
                  </span>
                </div>

                {/* Progress / Occupancy */}
                <div className="mt-6">
                  <div className="flex justify-between text-xs font-medium text-slate-600 mb-1.5">
                    <span>Occupancy</span>
                    <span className="font-bold text-slate-900">
                      {hostel.occupied} / {hostel.capacity} Beds ({occupancyRate}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-all ${
                        occupancyRate > 90
                          ? 'bg-rose-500'
                          : occupancyRate > 75
                          ? 'bg-[#006FBF]'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${occupancyRate}%` }}
                    />
                  </div>
                </div>

                {/* Info List */}
                <div className="mt-5 space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Total Rooms:</span>
                    <span className="font-semibold text-slate-800">{hostel.roomsCount} Rooms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">In-Charge:</span>
                    <span className="font-semibold text-slate-800">
                      {hostel.houseMaster !== 'N/A' ? hostel.houseMaster : hostel.matron}
                    </span>
                  </div>
                </div>

                {/* Amenities Badges */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {hostel.amenities.map((item) => (
                    <span
                      key={item}
                      className="rounded-md bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600 ring-1 ring-inset ring-slate-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-xs font-medium text-slate-400">Ref: {hostel.id}</span>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard/hostel/hostels/${hostel.id}`}
                    className="inline-flex items-center justify-center rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-[#006FBF] hover:text-white transition-all"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}