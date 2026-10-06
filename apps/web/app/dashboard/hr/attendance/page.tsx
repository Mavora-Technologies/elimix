// apps/web/app/dashboard/hr/attendance/page.tsx

import Link from 'next/link';

/* ==========================================================================
   MOCK DATA
   ========================================================================== */

const STATS = [
  {
    title: 'Present Today',
    value: '128',
    subtext: '90.1% attendance rate',
    icon: 'fa-user-check',
    color: 'from-emerald-600 to-emerald-400',
  },
  {
    title: 'Late Arrivals',
    value: '7',
    subtext: 'Clocked in after 08:00 AM',
    icon: 'fa-clock-rotate-left',
    color: 'from-amber-500 to-amber-400',
  },
  {
    title: 'On Leave',
    value: '5',
    subtext: 'Approved leaves today',
    icon: 'fa-calendar-minus',
    color: 'from-[#006FBF] to-[#04B1D6]',
  },
  {
    title: 'Unexcused Absence',
    value: '2',
    subtext: 'Requires follow-up',
    icon: 'fa-user-xmark',
    color: 'from-rose-600 to-rose-400',
  },
];

const ATTENDANCE_RECORDS = [
  {
    id: 'ATT-20261005-01',
    staffId: 'EMP-001',
    staffName: 'Sarah Jenkins',
    role: 'Mathematics Teacher',
    department: 'Academics',
    clockIn: '07:42 AM',
    clockOut: '04:30 PM',
    status: 'Present',
    location: 'Main Gate Kiosk',
  },
  {
    id: 'ATT-20261005-02',
    staffId: 'EMP-002',
    staffName: 'Michael Ochieng',
    role: 'Transport Manager',
    department: 'Transport',
    clockIn: '08:18 AM',
    clockOut: '--:--',
    status: 'Late',
    location: 'Mobile App',
  },
  {
    id: 'ATT-20261005-03',
    staffId: 'EMP-003',
    staffName: 'Grace Mutuku',
    role: 'Librarian',
    department: 'Academics',
    clockIn: '--:--',
    clockOut: '--:--',
    status: 'On Leave',
    location: 'N/A',
  },
  {
    id: 'ATT-20261005-04',
    staffId: 'EMP-004',
    staffName: 'David Njoroge',
    role: 'Senior Accountant',
    department: 'Finance',
    clockIn: '07:51 AM',
    clockOut: '05:05 PM',
    status: 'Present',
    location: 'Admin Office Reader',
  },
  {
    id: 'ATT-20261005-05',
    staffId: 'EMP-005',
    staffName: 'Lucy Wanjiku',
    role: 'School Nurse',
    department: 'Administration',
    clockIn: '08:25 AM',
    clockOut: '--:--',
    status: 'Late',
    location: 'Main Gate Kiosk',
  },
  {
    id: 'ATT-20261005-06',
    staffId: 'EMP-006',
    staffName: 'Peter Kipkorir',
    role: 'Security Guard',
    department: 'Security',
    clockIn: '06:15 AM',
    clockOut: '03:00 PM',
    status: 'Present',
    location: 'Main Gate Kiosk',
  },
  {
    id: 'ATT-20261005-07',
    staffId: 'EMP-007',
    staffName: 'Amina Hassan',
    role: 'Chemistry Teacher',
    department: 'Academics',
    clockIn: '--:--',
    clockOut: '--:--',
    status: 'Absent',
    location: 'N/A',
  },
];

/* ==========================================================================
   PAGE COMPONENT
   ========================================================================== */

export default function AttendancePage() {
  return (
    <div className="flex w-full flex-col gap-6 p-6 md:p-8">
      {/* ----------------------------------------------------------------------
          HEADER
          ---------------------------------------------------------------------- */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Attendance & Time Tracking
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Monitor daily clock-in/out records, track tardiness, and manage attendance logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#006FBF]"
          >
            <i className="fa-solid fa-file-export mr-2 text-slate-400" />
            Export Log
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#006FBF] to-[#04B1D6] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-[#012E54] hover:to-[#006FBF] focus:outline-none focus:ring-2 focus:ring-[#006FBF] focus:ring-offset-2"
          >
            <i className="fa-solid fa-user-clock mr-2" />
            Manual Clock Entry
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
          FILTERS & DATE PICKER
          ---------------------------------------------------------------------- */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        {/* Left Side: Search & Date */}
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-xs">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <i className="fa-solid fa-magnifying-glass text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full rounded-xl border-0 py-2.5 pl-10 pr-4 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-[#006FBF] sm:text-sm sm:leading-6"
              placeholder="Search staff name or ID..."
            />
          </div>

          <div className="relative">
            <input
              type="date"
              defaultValue="2026-10-05"
              className="block rounded-xl border-0 py-2.5 px-3 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-[#006FBF] sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        {/* Right Side: Select Filters */}
        <div className="flex items-center gap-3">
          <select
            className="block rounded-xl border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF] sm:text-sm sm:leading-6"
            defaultValue=""
          >
            <option value="" disabled>Department</option>
            <option value="academics">Academics</option>
            <option value="administration">Administration</option>
            <option value="finance">Finance</option>
            <option value="transport">Transport</option>
            <option value="security">Security</option>
          </select>

          <select
            className="block rounded-xl border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF] sm:text-sm sm:leading-6"
            defaultValue=""
          >
            <option value="" disabled>Status</option>
            <option value="present">Present</option>
            <option value="late">Late</option>
            <option value="leave">On Leave</option>
            <option value="absent">Absent</option>
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
                  Staff Member
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Department
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Clock In
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Clock Out
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Method / Device
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th scope="col" className="relative px-6 py-4">
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
                        {record.staffName.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-semibold text-slate-900">{record.staffName}</p>
                        <p className="text-xs text-slate-500">{record.staffId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <p className="text-sm font-medium text-slate-800">{record.role}</p>
                    <p className="text-xs text-slate-500">{record.department}</p>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-mono font-medium text-slate-800">
                    {record.clockIn}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-mono font-medium text-slate-800">
                    {record.clockOut}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-xs text-slate-500">
                    {record.location}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                        record.status === 'Present'
                          ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                          : record.status === 'Late'
                          ? 'bg-amber-50 text-amber-700 ring-amber-600/20'
                          : record.status === 'On Leave'
                          ? 'bg-blue-50 text-blue-700 ring-blue-600/20'
                          : 'bg-rose-50 text-rose-700 ring-rose-600/20'
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <button className="text-slate-400 hover:text-[#006FBF]" title="Edit Log">
                      <i className="fa-regular fa-pen-to-square" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-3">
          <p className="text-sm text-slate-600">
            Showing <span className="font-semibold">7</span> of <span className="font-semibold">142</span> records for Oct 5, 2026
          </p>
          <Link
            href="/dashboard/hr/staff"
            className="text-sm font-medium text-[#006FBF] hover:text-[#012E54]"
          >
            Manage Staff Members &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}