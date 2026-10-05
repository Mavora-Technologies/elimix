// apps/web/app/dashboard/hostel/page.tsx

import Link from 'next/link';

/* ==========================================================================
   MOCK DATA
   ========================================================================== */

const STATS = [
  {
    title: 'Total Boarders',
    value: '412 / 480',
    subtext: '85.8% Overall Occupancy',
    icon: 'fa-bed',
    color: 'from-[#006FBF] to-[#04B1D6]',
  },
  {
    title: 'Hostel Blocks',
    value: '6 Blocks',
    subtext: '3 Boys | 3 Girls Dorms',
    icon: 'fa-building-user',
    color: 'from-[#012E54] to-[#006FBF]',
  },
  {
    title: 'Maintenance Issues',
    value: '7 Active',
    subtext: '3 Urgent repair requests',
    icon: 'fa-screwdriver-wrench',
    color: 'from-amber-500 to-amber-600',
  },
  {
    title: 'House Captains',
    value: '12 Prefects',
    subtext: 'Assigned across all blocks',
    icon: 'fa-user-shield',
    color: 'from-emerald-600 to-emerald-500',
  },
];

const ROOM_ALLOCATIONS = [
  {
    id: 'HST-B1-102',
    studentId: 'STU-2024-045',
    studentName: 'Brian Kiprop',
    classGrade: 'Form 3 Blue',
    blockName: 'Elgon House (Boys)',
    roomNumber: 'Room B-102',
    bedNumber: 'Bed 02 (Lower)',
    houseMaster: 'Mr. David Njoroge',
    status: 'Occupied',
    checkInDate: 'Jan 08, 2026',
  },
  {
    id: 'HST-A2-204',
    studentId: 'STU-2024-112',
    studentName: 'Faith Wanjiku',
    classGrade: 'Form 4 West',
    blockName: 'Kilimanjaro House (Girls)',
    roomNumber: 'Room A-204',
    bedNumber: 'Bed 01 (Upper)',
    houseMaster: 'Mrs. Grace Mutuku',
    status: 'Occupied',
    checkInDate: 'Jan 08, 2026',
  },
  {
    id: 'HST-B2-108',
    studentId: 'STU-2025-089',
    studentName: 'Samuel Ochieng',
    classGrade: 'Form 2 East',
    blockName: 'Kenya House (Boys)',
    roomNumber: 'Room K-108',
    bedNumber: 'Bed 04 (Lower)',
    houseMaster: 'Mr. Peter Kipkorir',
    status: 'Maintenance',
    checkInDate: '--',
  },
  {
    id: 'HST-A1-301',
    studentId: 'STU-2024-201',
    studentName: 'Amina Mohamed',
    classGrade: 'Form 4 North',
    blockName: 'Aberdare House (Girls)',
    roomNumber: 'Room C-301',
    bedNumber: 'Bed 03 (Lower)',
    houseMaster: 'Ms. Lucy Wanjiku',
    status: 'Occupied',
    checkInDate: 'Jan 09, 2026',
  },
  {
    id: 'HST-B3-205',
    studentId: 'STU-2026-014',
    studentName: 'Kevin Mutua',
    classGrade: 'Form 1 South',
    blockName: 'Elgon House (Boys)',
    roomNumber: 'Room B-205',
    bedNumber: 'Bed 01 (Lower)',
    houseMaster: 'Mr. David Njoroge',
    status: 'Reserved',
    checkInDate: 'Pending',
  },
  {
    id: 'HST-A3-104',
    studentId: 'STU-2025-156',
    studentName: 'Joy Chebet',
    classGrade: 'Form 2 Central',
    blockName: 'Ruwenzori House (Girls)',
    roomNumber: 'Room R-104',
    bedNumber: 'Bed 02 (Upper)',
    houseMaster: 'Mrs. Sarah Jenkins',
    status: 'Vacant',
    checkInDate: '--',
  },
];

/* ==========================================================================
   PAGE COMPONENT
   ========================================================================== */

export default function HostelManagementPage() {
  return (
    <div className="flex w-full flex-col gap-6 p-6 md:p-8">
      {/* ----------------------------------------------------------------------
          HEADER
          ---------------------------------------------------------------------- */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Hostel & Boarding Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage dormitories, bed allocations, house masters, and room maintenance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#006FBF]"
          >
            <i className="fa-solid fa-[#006FBF] fa-file-export mr-2 text-slate-400" />
            Occupancy Report
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#006FBF] to-[#04B1D6] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-[#012E54] hover:to-[#006FBF] focus:outline-none focus:ring-2 focus:ring-[#006FBF] focus:ring-offset-2"
          >
            <i className="fa-solid fa-plus mr-2" />
            Assign Bed / Room
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
            placeholder="Search by student name, room no, or house block..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            className="block rounded-xl border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF] sm:text-sm sm:leading-6"
            defaultValue=""
          >
            <option value="" disabled>Hostel Block</option>
            <option value="elgon">Elgon House (Boys)</option>
            <option value="kenya">Kenya House (Boys)</option>
            <option value="kilimanjaro">Kilimanjaro House (Girls)</option>
            <option value="aberdare">Aberdare House (Girls)</option>
            <option value="ruwenzori">Ruwenzori House (Girls)</option>
          </select>

          <select
            className="block rounded-xl border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF] sm:text-sm sm:leading-6"
            defaultValue=""
          >
            <option value="" disabled>Status</option>
            <option value="occupied">Occupied</option>
            <option value="vacant">Vacant</option>
            <option value="reserved">Reserved</option>
            <option value="maintenance">Under Maintenance</option>
          </select>

          <select
            className="block rounded-xl border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF] sm:text-sm sm:leading-6"
            defaultValue=""
          >
            <option value="" disabled>Gender Wing</option>
            <option value="boys">Boys Wing</option>
            <option value="girls">Girls Wing</option>
          </select>
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          HOSTEL ALLOCATIONS TABLE
          ---------------------------------------------------------------------- */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Student / Boarder
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Hostel Block & Room
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Bed Space
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  House Master / Patron
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
              {ROOM_ALLOCATIONS.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-slate-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    {item.studentName !== 'N/A' && item.studentId ? (
                      <div className="flex items-center">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                          {item.studentName.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div className="ml-3">
                          <Link
                            href={`/dashboard/students/${item.studentId}`}
                            className="text-sm font-semibold text-slate-900 hover:text-[#006FBF]"
                          >
                            {item.studentName}
                          </Link>
                          <p className="text-xs text-slate-500">{item.classGrade} &bull; {item.studentId}</p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm italic text-slate-400">Unallocated</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <p className="text-sm font-semibold text-slate-900">{item.blockName}</p>
                    <p className="text-xs text-slate-500">{item.roomNumber}</p>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                      {item.bedNumber}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                    {item.houseMaster}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                        item.status === 'Occupied'
                          ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                          : item.status === 'Reserved'
                          ? 'bg-blue-50 text-blue-700 ring-blue-600/20'
                          : item.status === 'Vacant'
                          ? 'bg-slate-100 text-slate-700 ring-slate-500/20'
                          : 'bg-amber-50 text-amber-700 ring-amber-600/20'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-3">
                      <button className="text-slate-400 hover:text-[#006FBF]" title="Edit Allocation">
                        <i className="fa-solid fa-pen-to-square" />
                      </button>
                      <button className="text-slate-400 hover:text-[#006FBF]" title="Room Details">
                        <i className="fa-solid fa-circle-info" />
                      </button>
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
            Showing <span className="font-semibold">6</span> of <span className="font-semibold">412</span> allocations
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