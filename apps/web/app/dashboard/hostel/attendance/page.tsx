// apps/web/app/dashboard/hostel/attendance/page.tsx

import Link from 'next/link';

/* ==========================================================================
   MOCK DATA
   ========================================================================== */

const STATS = [
  {
    title: 'Present Today',
    value: '395',
    subtext: 'Out of 412 total boarders',
    icon: 'fa-user-check',
    color: 'from-emerald-600 to-emerald-500',
  },
  {
    title: 'On Exeat / Leave',
    value: '12',
    subtext: 'Authorized absence',
    icon: 'fa-person-walking-arrow-right',
    color: 'from-[#006FBF] to-[#04B1D6]',
  },
  {
    title: 'In Sick Bay',
    value: '3',
    subtext: 'Currently in sanatorium',
    icon: 'fa-bed-pulse',
    color: 'from-purple-600 to-purple-500',
  },
  {
    title: 'Absent / Unaccounted',
    value: '2',
    subtext: 'Pending verification',
    icon: 'fa-user-xmark',
    color: 'from-rose-600 to-rose-500',
  },
];

const ATTENDANCE_RECORDS = [
  {
    id: 'ATT-2026-1006-01',
    studentId: 'STU-2024-045',
    studentName: 'Brian Kiprop',
    grade: 'Form 3 Blue',
    hostelBlock: 'Elgon House',
    roomNumber: 'Room B-102',
    status: 'Present',
    markedBy: 'Mr. David Njoroge',
    time: 'Oct 06, 2026 at 06:15 AM',
    notes: '--',
  },
  {
    id: 'ATT-2026-1006-02',
    studentId: 'STU-2024-112',
    studentName: 'Faith Wanjiku',
    grade: 'Form 4 West',
    hostelBlock: 'Kilimanjaro House',
    roomNumber: 'Room A-204',
    status: 'Present',
    markedBy: 'Mrs. Grace Mutuku',
    time: 'Oct 06, 2026 at 06:10 AM',
    notes: '--',
  },
  {
    id: 'ATT-2026-1006-03',
    studentId: 'STU-2025-089',
    studentName: 'Samuel Ochieng',
    grade: 'Form 2 East',
    hostelBlock: 'Kenya House',
    roomNumber: 'Room K-108',
    status: 'On Leave',
    markedBy: 'System (Auto)',
    time: 'Oct 06, 2026 at 06:00 AM',
    notes: 'Active Medical Exeat',
  },
  {
    id: 'ATT-2026-1006-04',
    studentId: 'STU-2026-014',
    studentName: 'Kevin Mutua',
    grade: 'Form 1 South',
    hostelBlock: 'Elgon House',
    roomNumber: 'Room B-205',
    status: 'Absent',
    markedBy: 'Mr. David Njoroge',
    time: 'Oct 06, 2026 at 06:20 AM',
    notes: 'Overdue from exeat, parent contacted',
  },
  {
    id: 'ATT-2026-1006-05',
    studentId: 'STU-2024-201',
    studentName: 'Amina Mohamed',
    grade: 'Form 4 North',
    hostelBlock: 'Aberdare House',
    roomNumber: 'Room C-301',
    status: 'Present',
    markedBy: 'Ms. Lucy Wanjiku',
    time: 'Oct 06, 2026 at 06:12 AM',
    notes: '--',
  },
  {
    id: 'ATT-2026-1006-06',
    studentId: 'STU-2025-156',
    studentName: 'Joy Chebet',
    grade: 'Form 2 Central',
    hostelBlock: 'Ruwenzori House',
    roomNumber: 'Room R-104',
    status: 'Sick Bay',
    markedBy: 'Nurse Alice',
    time: 'Oct 06, 2026 at 06:05 AM',
    notes: 'Admitted for observation last night',
  },
  {
    id: 'ATT-2026-1006-07',
    studentId: 'STU-2026-042',
    studentName: 'Ian Kamau',
    grade: 'Form 1 East',
    hostelBlock: 'Tsavo House',
    roomNumber: 'Room T-101',
    status: 'Absent',
    markedBy: 'Mr. John Omondi',
    time: 'Oct 06, 2026 at 06:18 AM',
    notes: 'Not in dorm during morning roll call',
  },
];

/* ==========================================================================
   PAGE COMPONENT
   ========================================================================== */

export default function HostelAttendancePage() {
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
          <span className="text-slate-900">Roll Call & Attendance</span>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Hostel Roll Call Log
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Monitor daily boarding attendance, conduct roll calls, and track absentees.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#006FBF]"
            >
              <i className="fa-solid fa-file-csv mr-2 text-slate-400" />
              Export Log
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#006FBF] to-[#04B1D6] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-[#012E54] hover:to-[#006FBF] focus:outline-none focus:ring-2 focus:ring-[#006FBF] focus:ring-offset-2"
            >
              <i className="fa-solid fa-clipboard-list mr-2" />
              Take Roll Call
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
            placeholder="Search student, block, or dorm room..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            className="block rounded-xl border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF] sm:text-sm sm:leading-6"
            defaultValue="today"
          >
            <option value="today">Today (Oct 06)</option>
            <option value="yesterday">Yesterday (Oct 05)</option>
            <option value="this-week">This Week</option>
            <option value="custom">Custom Date...</option>
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
            <option value="" disabled>Attendance Status</option>
            <option value="all">All Statuses</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="leave">On Leave / Exeat</option>
            <option value="sick">Sick Bay</option>
          </select>
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          ATTENDANCE TABLE
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
                  Status
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Marked By & Time
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Notes
                </th>
                <th scope="col" className="relative px-6 py-4 text-right">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {ATTENDANCE_RECORDS.map((record) => (
                <tr key={record.id} className="transition-colors hover:bg-slate-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                        {record.studentName.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div className="ml-3">
                        <Link
                          href={`/dashboard/students/${record.studentId}`}
                          className="text-sm font-semibold text-slate-900 hover:text-[#006FBF]"
                        >
                          {record.studentName}
                        </Link>
                        <p className="text-xs text-slate-500">
                          {record.hostelBlock} &bull; {record.roomNumber}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                        record.status === 'Present'
                          ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                          : record.status === 'On Leave'
                          ? 'bg-amber-50 text-amber-700 ring-amber-600/20'
                          : record.status === 'Sick Bay'
                          ? 'bg-purple-50 text-purple-700 ring-purple-600/20'
                          : 'bg-rose-50 text-rose-700 ring-rose-600/20'
                      }`}
                    >
                      {record.status === 'Present' && <i className="fa-solid fa-check mr-1.5 opacity-70" />}
                      {record.status === 'Absent' && <i className="fa-solid fa-xmark mr-1.5 opacity-70" />}
                      {record.status === 'Sick Bay' && <i className="fa-solid fa-bed-pulse mr-1.5 opacity-70" />}
                      {record.status === 'On Leave' && <i className="fa-solid fa-person-walking-arrow-right mr-1.5 opacity-70" />}
                      {record.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <p className="text-sm font-medium text-slate-900">{record.markedBy}</p>
                    <p className="text-xs text-slate-500">{record.time}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600 truncate max-w-[200px]" title={record.notes}>
                      {record.notes}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-3">
                      <button className="text-slate-400 hover:text-[#006FBF]" title="Update Status">
                        <i className="fa-solid fa-pen" />
                      </button>
                      <button className="text-slate-400 hover:text-[#006FBF]" title="View History">
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
            Showing <span className="font-semibold">7</span> of <span className="font-semibold">412</span> attendance records
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