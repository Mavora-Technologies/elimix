// apps/web/app/dashboard/hostel/students/page.tsx

import Link from 'next/link';

/* ==========================================================================
   MOCK DATA
   ========================================================================== */

const STATS = [
  {
    title: 'Total Boarders',
    value: '412',
    subtext: 'Out of 480 total bed capacity',
    icon: 'fa-users',
    color: 'from-[#006FBF] to-[#04B1D6]',
  },
  {
    title: 'Boys Wing',
    value: '208',
    subtext: 'Elgon, Kenya, Tsavo Blocks',
    icon: 'fa-child-reaching',
    color: 'from-[#012E54] to-[#006FBF]',
  },
  {
    title: 'Girls Wing',
    value: '204',
    subtext: 'Kilimanjaro, Aberdare, Ruwenzori',
    icon: 'fa-child-dress',
    color: 'from-emerald-600 to-emerald-500',
  },
  {
    title: 'On Leave / Exeat',
    value: '12',
    subtext: 'Currently signed out of hostel',
    icon: 'fa-person-walking-arrow-right',
    color: 'from-amber-500 to-amber-600',
  },
];

const BOARDERS_LIST = [
  {
    id: 'STU-2024-045',
    name: 'Brian Kiprop',
    grade: 'Form 3 Blue',
    blockName: 'Elgon House',
    roomNumber: 'Room B-102',
    bedNumber: 'Bed 02 (Lower)',
    status: 'In Hostel',
    checkInDate: 'Jan 08, 2026',
  },
  {
    id: 'STU-2024-112',
    name: 'Faith Wanjiku',
    grade: 'Form 4 West',
    blockName: 'Kilimanjaro House',
    roomNumber: 'Room A-204',
    bedNumber: 'Bed 01 (Upper)',
    status: 'In Hostel',
    checkInDate: 'Jan 08, 2026',
  },
  {
    id: 'STU-2025-089',
    name: 'Samuel Ochieng',
    grade: 'Form 2 East',
    blockName: 'Kenya House',
    roomNumber: 'Room K-108',
    bedNumber: 'Bed 04 (Lower)',
    status: 'On Leave',
    checkInDate: 'Jan 09, 2026',
  },
  {
    id: 'STU-2024-201',
    name: 'Amina Mohamed',
    grade: 'Form 4 North',
    blockName: 'Aberdare House',
    roomNumber: 'Room C-301',
    bedNumber: 'Bed 03 (Lower)',
    status: 'In Hostel',
    checkInDate: 'Jan 09, 2026',
  },
  {
    id: 'STU-2026-014',
    name: 'Kevin Mutua',
    grade: 'Form 1 South',
    blockName: 'Elgon House',
    roomNumber: 'Room B-205',
    bedNumber: 'Bed 01 (Lower)',
    status: 'Suspended',
    checkInDate: 'Feb 12, 2026',
  },
  {
    id: 'STU-2025-156',
    name: 'Joy Chebet',
    grade: 'Form 2 Central',
    blockName: 'Ruwenzori House',
    roomNumber: 'Room R-104',
    bedNumber: 'Bed 02 (Upper)',
    status: 'In Hostel',
    checkInDate: 'Jan 10, 2026',
  },
  {
    id: 'STU-2026-042',
    name: 'Ian Kamau',
    grade: 'Form 1 East',
    blockName: 'Tsavo House',
    roomNumber: 'Room T-101',
    bedNumber: 'Bed 03 (Upper)',
    status: 'In Hostel',
    checkInDate: 'Feb 05, 2026',
  },
];

/* ==========================================================================
   PAGE COMPONENT
   ========================================================================== */

export default function HostelStudentsPage() {
  return (
    <div className="flex w-full flex-col gap-6 p-6 md:p-8">
      {/* ----------------------------------------------------------------------
          HEADER
          ---------------------------------------------------------------------- */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Boarders Directory
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage hostel residents, track room assignments, and monitor exeat passes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#006FBF]"
          >
            <i className="fa-solid fa-file-export mr-2 text-slate-400" />
            Export Roster
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#006FBF] to-[#04B1D6] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-[#012E54] hover:to-[#006FBF] focus:outline-none focus:ring-2 focus:ring-[#006FBF] focus:ring-offset-2"
          >
            <i className="fa-solid fa-ticket mr-2" />
            Issue Exeat Pass
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
            placeholder="Search student name, ID, or room number..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            className="block rounded-xl border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF] sm:text-sm sm:leading-6"
            defaultValue=""
          >
            <option value="" disabled>Hostel Block</option>
            <option value="all">All Blocks</option>
            <option value="elgon">Elgon House</option>
            <option value="kilimanjaro">Kilimanjaro House</option>
            <option value="kenya">Kenya House</option>
            <option value="aberdare">Aberdare House</option>
          </select>

          <select
            className="block rounded-xl border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF] sm:text-sm sm:leading-6"
            defaultValue=""
          >
            <option value="" disabled>Grade / Class</option>
            <option value="all">All Classes</option>
            <option value="form1">Form 1</option>
            <option value="form2">Form 2</option>
            <option value="form3">Form 3</option>
            <option value="form4">Form 4</option>
          </select>

          <select
            className="block rounded-xl border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF] sm:text-sm sm:leading-6"
            defaultValue=""
          >
            <option value="" disabled>Status</option>
            <option value="all">All Statuses</option>
            <option value="in-hostel">In Hostel</option>
            <option value="on-leave">On Leave / Exeat</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          STUDENTS TABLE
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
                  Class & Grade
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Hostel & Room
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Bed Allocation
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
              {BOARDERS_LIST.map((student) => (
                <tr key={student.id} className="transition-colors hover:bg-slate-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                        {student.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div className="ml-3">
                        <Link
                          href={`/dashboard/students/${student.id}`}
                          className="text-sm font-semibold text-slate-900 hover:text-[#006FBF]"
                        >
                          {student.name}
                        </Link>
                        <p className="text-xs text-slate-500">{student.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="text-sm text-slate-700">{student.grade}</span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <p className="text-sm font-semibold text-slate-900">{student.blockName}</p>
                    <p className="text-xs text-slate-500">{student.roomNumber}</p>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                      <i className="fa-solid fa-bed mr-1.5 text-slate-400" />
                      {student.bedNumber}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                        student.status === 'In Hostel'
                          ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                          : student.status === 'On Leave'
                          ? 'bg-amber-50 text-amber-700 ring-amber-600/20'
                          : 'bg-rose-50 text-rose-700 ring-rose-600/20'
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-3">
                      <button className="text-slate-400 hover:text-[#006FBF]" title="Change Room">
                        <i className="fa-solid fa-person-walking-luggage" />
                      </button>
                      <button className="text-slate-400 hover:text-[#006FBF]" title="View Profile">
                        <i className="fa-solid fa-chevron-right" />
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
            Showing <span className="font-semibold">7</span> of <span className="font-semibold">412</span> boarders
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