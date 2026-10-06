// apps/web/app/dashboard/hostel/check-in-out/page.tsx

import Link from 'next/link';

/* ==========================================================================
   MOCK DATA
   ========================================================================== */

const STATS = [
  {
    title: 'Currently In Hostel',
    value: '400 Students',
    subtext: '97.1% of total boarders present',
    icon: 'fa-house-user',
    color: 'from-emerald-600 to-emerald-500',
  },
  {
    title: 'Active Exeats / On Leave',
    value: '12 Students',
    subtext: 'Authorized out of school campus',
    icon: 'fa-person-walking-arrow-right',
    color: 'from-[#006FBF] to-[#04B1D6]',
  },
  {
    title: 'Expected Returns Today',
    value: '5 Students',
    subtext: 'Due back by 5:00 PM',
    icon: 'fa-clock-rotate-left',
    color: 'from-[#012E54] to-[#006FBF]',
  },
  {
    title: 'Overdue Returns',
    value: '2 Students',
    subtext: 'Exceeded exeat deadline',
    icon: 'fa-triangle-exclamation',
    color: 'from-rose-600 to-rose-500',
  },
];

const MOVEMENT_LOGS = [
  {
    id: 'LOG-2026-104',
    studentId: 'STU-2025-089',
    studentName: 'Samuel Ochieng',
    grade: 'Form 2 East',
    hostelBlock: 'Kenya House',
    roomNumber: 'Room K-108',
    type: 'Check-Out (Exeat)',
    reason: 'Medical Appointment',
    guardianName: 'Dr. Arthur Ochieng (Father)',
    dateTime: 'Oct 06, 2026 at 09:15 AM',
    expectedReturn: 'Oct 06, 2026 at 04:30 PM',
    status: 'Active Exeat',
    approvedBy: 'Mr. Peter Kipkorir',
  },
  {
    id: 'LOG-2026-103',
    studentId: 'STU-2024-045',
    studentName: 'Brian Kiprop',
    grade: 'Form 3 Blue',
    hostelBlock: 'Elgon House',
    roomNumber: 'Room B-102',
    type: 'Check-In',
    reason: 'Return from Weekend Exeat',
    guardianName: 'Mary Kiprop (Mother)',
    dateTime: 'Oct 06, 2026 at 08:00 AM',
    expectedReturn: 'N/A',
    status: 'Completed',
    approvedBy: 'Mr. David Njoroge',
  },
  {
    id: 'LOG-2026-098',
    studentId: 'STU-2026-014',
    studentName: 'Kevin Mutua',
    grade: 'Form 1 South',
    hostelBlock: 'Elgon House',
    roomNumber: 'Room B-205',
    type: 'Check-Out (Exeat)',
    reason: 'Family Emergency',
    guardianName: 'Joseph Mutua (Guardian)',
    dateTime: 'Oct 05, 2026 at 02:00 PM',
    expectedReturn: 'Oct 05, 2026 at 06:00 PM',
    status: 'Overdue',
    approvedBy: 'Mr. David Njoroge',
  },
  {
    id: 'LOG-2026-095',
    studentId: 'STU-2024-112',
    studentName: 'Faith Wanjiku',
    grade: 'Form 4 West',
    hostelBlock: 'Kilimanjaro House',
    roomNumber: 'Room A-204',
    type: 'Check-In',
    reason: 'Term Opening Arrival',
    guardianName: 'Grace Wanjiku (Mother)',
    dateTime: 'Oct 04, 2026 at 04:20 PM',
    expectedReturn: 'N/A',
    status: 'Completed',
    approvedBy: 'Mrs. Grace Mutuku',
  },
  {
    id: 'LOG-2026-091',
    studentId: 'STU-2024-201',
    studentName: 'Amina Mohamed',
    grade: 'Form 4 North',
    hostelBlock: 'Aberdare House',
    roomNumber: 'Room C-301',
    type: 'Check-Out (Exeat)',
    reason: 'Academic Competition',
    guardianName: 'School Transport / Patron',
    dateTime: 'Oct 04, 2026 at 07:30 AM',
    expectedReturn: 'Oct 06, 2026 at 05:00 PM',
    status: 'Active Exeat',
    approvedBy: 'Ms. Lucy Wanjiku',
  },
  {
    id: 'LOG-2026-088',
    studentId: 'STU-2025-156',
    studentName: 'Joy Chebet',
    grade: 'Form 2 Central',
    hostelBlock: 'Ruwenzori House',
    roomNumber: 'Room R-104',
    type: 'Check-In',
    reason: 'Return from Sick Leave',
    guardianName: 'Peter Chebet (Father)',
    dateTime: 'Oct 03, 2026 at 11:45 AM',
    expectedReturn: 'N/A',
    status: 'Completed',
    approvedBy: 'Mrs. Sarah Jenkins',
  },
];

/* ==========================================================================
   PAGE COMPONENT
   ========================================================================== */

export default function HostelCheckInOutPage() {
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
          <span className="text-slate-900">Check-In & Check-Out</span>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Hostel Check-In / Check-Out Log
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Track real-time boarder movements, process exeat permits, and manage return verification.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#006FBF]"
            >
              <i className="fa-solid fa-qrcode mr-2 text-slate-400" />
              Scan Gate Pass / QR
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#006FBF] to-[#04B1D6] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-[#012E54] hover:to-[#006FBF] focus:outline-none focus:ring-2 focus:ring-[#006FBF] focus:ring-offset-2"
            >
              <i className="fa-solid fa-[#006FBF] fa-ticket mr-2" />
              Issue Exeat Pass
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
            placeholder="Search student, exeat ID, or guardian name..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            className="block rounded-xl border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF] sm:text-sm sm:leading-6"
            defaultValue=""
          >
            <option value="" disabled>Movement Type</option>
            <option value="all">All Movements</option>
            <option value="check-in">Check-In</option>
            <option value="check-out">Check-Out (Exeat)</option>
          </select>

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
            <option value="" disabled>Exeat Status</option>
            <option value="all">All Statuses</option>
            <option value="active">Active Exeat</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          MOVEMENT LOGS TABLE
          ---------------------------------------------------------------------- */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Student & Dorm
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Movement & Reason
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Accompanied By / Guardian
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Timestamp / Schedule
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
              {MOVEMENT_LOGS.map((log) => (
                <tr key={log.id} className="transition-colors hover:bg-slate-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                        {log.studentName.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div className="ml-3">
                        <Link
                          href={`/dashboard/students/${log.studentId}`}
                          className="text-sm font-semibold text-slate-900 hover:text-[#006FBF]"
                        >
                          {log.studentName}
                        </Link>
                        <p className="text-xs text-slate-500">
                          {log.hostelBlock} &bull; {log.roomNumber}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                          log.type.includes('Check-In')
                            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
                            : 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20'
                        }`}
                      >
                        {log.type}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600">{log.reason}</p>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <p className="text-sm font-medium text-slate-900">{log.guardianName}</p>
                    <p className="text-xs text-slate-500">Auth by: {log.approvedBy}</p>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <p className="text-xs font-semibold text-slate-800">{log.dateTime}</p>
                    {log.expectedReturn !== 'N/A' && (
                      <p className="text-[11px] text-slate-500">
                        Expected: <span className="font-medium text-slate-700">{log.expectedReturn}</span>
                      </p>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                        log.status === 'Completed'
                          ? 'bg-slate-100 text-slate-700 ring-slate-500/20'
                          : log.status === 'Active Exeat'
                          ? 'bg-blue-50 text-blue-700 ring-blue-600/20'
                          : 'bg-rose-50 text-rose-700 ring-rose-600/20'
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-3">
                      {log.status === 'Active Exeat' || log.status === 'Overdue' ? (
                        <button
                          className="inline-flex items-center rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
                          title="Mark Student Checked In"
                        >
                          <i className="fa-solid fa-right-to-bracket mr-1.5" />
                          Mark Return
                        </button>
                      ) : null}
                      <button className="text-slate-400 hover:text-[#006FBF]" title="Print Exeat Pass">
                        <i className="fa-solid fa-print" />
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
            Showing <span className="font-semibold">6</span> of <span className="font-semibold">104</span> movement logs
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