// apps/web/app/dashboard/hostel/allocation/page.tsx

import Link from 'next/link';

/* ==========================================================================
   MOCK DATA
   ========================================================================== */

const STATS = [
  {
    title: 'Total Boarders Allocated',
    value: '412 / 480',
    subtext: '85.8% Overall Allocation Rate',
    icon: 'fa-bed',
    color: 'from-[#006FBF] to-[#04B1D6]',
  },
  {
    title: 'Unallocated Students',
    value: '18',
    subtext: 'Awaiting bed assignment for Term 3',
    icon: 'fa-user-clock',
    color: 'from-amber-500 to-amber-600',
  },
  {
    title: 'Pending Transfer Requests',
    value: '5',
    subtext: 'Room / Block transfer applications',
    icon: 'fa-right-left',
    color: 'from-[#012E54] to-[#006FBF]',
  },
  {
    title: 'Available Beds',
    value: '68',
    subtext: 'Across 6 hostel blocks',
    icon: 'fa-circle-check',
    color: 'from-emerald-600 to-emerald-500',
  },
];

const ALLOCATIONS_LIST = [
  {
    id: 'ALC-2026-001',
    studentId: 'STU-2024-045',
    studentName: 'Brian Kiprop',
    classGrade: 'Form 3 Blue',
    gender: 'Male',
    hostelBlock: 'Elgon House (Boys)',
    roomNumber: 'Room B-102',
    bedNumber: 'Bed 02 (Lower)',
    termSemester: '2026 - Term 3',
    allocatedBy: 'Mr. David Njoroge',
    allocationDate: 'Jan 08, 2026',
    status: 'Allocated',
  },
  {
    id: 'ALC-2026-002',
    studentId: 'STU-2024-112',
    studentName: 'Faith Wanjiku',
    classGrade: 'Form 4 West',
    gender: 'Female',
    hostelBlock: 'Kilimanjaro House (Girls)',
    roomNumber: 'Room A-204',
    bedNumber: 'Bed 01 (Upper)',
    termSemester: '2026 - Term 3',
    allocatedBy: 'Mrs. Grace Mutuku',
    allocationDate: 'Jan 08, 2026',
    status: 'Allocated',
  },
  {
    id: 'ALC-2026-003',
    studentId: 'STU-2025-089',
    studentName: 'Samuel Ochieng',
    classGrade: 'Form 2 East',
    gender: 'Male',
    hostelBlock: 'Kenya House (Boys)',
    roomNumber: 'Room K-108',
    bedNumber: 'Bed 04 (Lower)',
    termSemester: '2026 - Term 3',
    allocatedBy: 'Mr. Peter Kipkorir',
    allocationDate: 'Jan 09, 2026',
    status: 'Transfer Requested',
  },
  {
    id: 'ALC-2026-004',
    studentId: 'STU-2026-014',
    studentName: 'Kevin Mutua',
    classGrade: 'Form 1 South',
    gender: 'Male',
    hostelBlock: 'Elgon House (Boys)',
    roomNumber: 'Room B-205',
    bedNumber: 'Bed 01 (Lower)',
    termSemester: '2026 - Term 3',
    allocatedBy: 'Mr. David Njoroge',
    allocationDate: 'Pending',
    status: 'Pending',
  },
  {
    id: 'ALC-2026-005',
    studentId: 'STU-2024-201',
    studentName: 'Amina Mohamed',
    classGrade: 'Form 4 North',
    gender: 'Female',
    hostelBlock: 'Aberdare House (Girls)',
    roomNumber: 'Room C-301',
    bedNumber: 'Bed 03 (Lower)',
    termSemester: '2026 - Term 3',
    allocatedBy: 'Ms. Lucy Wanjiku',
    allocationDate: 'Jan 09, 2026',
    status: 'Allocated',
  },
  {
    id: 'ALC-2026-006',
    studentId: 'STU-2025-156',
    studentName: 'Joy Chebet',
    classGrade: 'Form 2 Central',
    gender: 'Female',
    hostelBlock: 'Ruwenzori House (Girls)',
    roomNumber: 'Room R-104',
    bedNumber: 'Bed 02 (Upper)',
    termSemester: '2026 - Term 3',
    allocatedBy: 'Mrs. Sarah Jenkins',
    allocationDate: 'Jan 10, 2026',
    status: 'Allocated',
  },
  {
    id: 'ALC-2026-007',
    studentId: 'STU-2026-092',
    studentName: 'Dennis Kimutai',
    classGrade: 'Form 1 North',
    gender: 'Male',
    hostelBlock: 'Unassigned',
    roomNumber: 'Unassigned',
    bedNumber: 'Unassigned',
    termSemester: '2026 - Term 3',
    allocatedBy: '--',
    allocationDate: '--',
    status: 'Unassigned',
  },
];

/* ==========================================================================
   PAGE COMPONENT
   ========================================================================== */

export default function HostelAllocationPage() {
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
          <span className="text-slate-900">Room & Bed Allocation</span>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Hostel Allocation Management
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Assign students to hostel beds, manage transfer requests, and process bulk room allocations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#006FBF]"
            >
              <i className="fa-solid fa-wand-magic-sparkles mr-2 text-slate-400" />
              Auto-Allocate
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#006FBF] to-[#04B1D6] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-[#012E54] hover:to-[#006FBF] focus:outline-none focus:ring-2 focus:ring-[#006FBF] focus:ring-offset-2"
            >
              <i className="fa-solid fa-plus mr-2" />
              New Bed Allocation
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
            placeholder="Search student, allocation ID, or room number..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            className="block rounded-xl border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF] sm:text-sm sm:leading-6"
            defaultValue=""
          >
            <option value="" disabled>Academic Term</option>
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
            <option value="elgon">Elgon House (Boys)</option>
            <option value="kilimanjaro">Kilimanjaro House (Girls)</option>
            <option value="kenya">Kenya House (Boys)</option>
            <option value="aberdare">Aberdare House (Girls)</option>
            <option value="ruwenzori">Ruwenzori House (Girls)</option>
          </select>

          <select
            className="block rounded-xl border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF] sm:text-sm sm:leading-6"
            defaultValue=""
          >
            <option value="" disabled>Allocation Status</option>
            <option value="all">All Statuses</option>
            <option value="allocated">Allocated</option>
            <option value="pending">Pending</option>
            <option value="transfer">Transfer Requested</option>
            <option value="unassigned">Unassigned</option>
          </select>
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          ALLOCATIONS TABLE
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
                  Assigned Hostel & Room
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Bed Space
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Allocated By & Date
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
              {ALLOCATIONS_LIST.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-slate-50">
                  <td className="whitespace-nowrap px-6 py-4">
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
                        <p className="text-xs text-slate-500">
                          {item.classGrade} &bull; {item.studentId}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {item.hostelBlock !== 'Unassigned' ? (
                      <>
                        <p className="text-sm font-semibold text-slate-900">{item.hostelBlock}</p>
                        <p className="text-xs text-slate-500">{item.roomNumber}</p>
                      </>
                    ) : (
                      <span className="text-sm italic text-slate-400">Not assigned yet</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {item.bedNumber !== 'Unassigned' ? (
                      <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                        <i className="fa-solid fa-bed mr-1.5 text-slate-400" />
                        {item.bedNumber}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">--</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                    {item.allocatedBy !== '--' ? (
                      <div>
                        <p className="font-medium text-slate-800">{item.allocatedBy}</p>
                        <p className="text-xs text-slate-400">{item.allocationDate}</p>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">Unprocessed</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                        item.status === 'Allocated'
                          ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                          : item.status === 'Transfer Requested'
                          ? 'bg-indigo-50 text-indigo-700 ring-indigo-600/20'
                          : item.status === 'Pending'
                          ? 'bg-amber-50 text-amber-700 ring-amber-600/20'
                          : 'bg-rose-50 text-rose-700 ring-rose-600/20'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        className="text-slate-400 hover:text-[#006FBF]"
                        title={item.status === 'Unassigned' ? 'Assign Room' : 'Change Allocation'}
                      >
                        <i className="fa-solid fa-bed-pulse" />
                      </button>
                      <button className="text-slate-400 hover:text-[#006FBF]" title="Allocation History">
                        <i className="fa-solid fa-clock-rotate-left" />
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
            Showing <span className="font-semibold">7</span> of <span className="font-semibold">430</span> allocation records
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