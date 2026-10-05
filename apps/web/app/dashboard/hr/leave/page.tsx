// apps/web/app/dashboard/hr/leave/page.tsx

import Link from 'next/link';

/* ==========================================================================
   MOCK DATA
   ========================================================================== */

const STATS = [
  {
    title: 'Pending Approvals',
    value: '8',
    subtext: 'Requires HR/Manager action',
    icon: 'fa-clock-rotate-left',
    color: 'from-amber-500 to-amber-600',
  },
  {
    title: 'Currently On Leave',
    value: '5',
    subtext: 'Out of office today',
    icon: 'fa-user-clock',
    color: 'from-[#006FBF] to-[#04B1D6]',
  },
  {
    title: 'Upcoming Leaves',
    value: '12',
    subtext: 'Scheduled for next 14 days',
    icon: 'fa-calendar-days',
    color: 'from-[#012E54] to-[#006FBF]',
  },
  {
    title: 'Approved YTD',
    value: '142',
    subtext: 'Total requests processed',
    icon: 'fa-circle-check',
    color: 'from-emerald-600 to-emerald-500',
  },
];

const LEAVE_REQUESTS = [
  {
    id: 'L-1042',
    staffId: 'EMP-001',
    staffName: 'Sarah Jenkins',
    role: 'Mathematics Teacher',
    department: 'Academics',
    type: 'Sick Leave',
    startDate: 'Oct 06, 2026',
    endDate: 'Oct 08, 2026',
    days: 3,
    appliedOn: 'Oct 04, 2026',
    status: 'Pending',
    reason: 'Medical consultation and recovery prescribed by doctor.',
  },
  {
    id: 'L-1043',
    staffId: 'EMP-002',
    staffName: 'Michael Ochieng',
    role: 'Transport Manager',
    department: 'Transport',
    type: 'Annual Leave',
    startDate: 'Oct 10, 2026',
    endDate: 'Oct 14, 2026',
    days: 5,
    appliedOn: 'Oct 01, 2026',
    status: 'Approved',
    reason: 'Scheduled end-of-term family vacation.',
  },
  {
    id: 'L-1044',
    staffId: 'EMP-003',
    staffName: 'Grace Mutuku',
    role: 'Librarian',
    department: 'Academics',
    type: 'Maternity Leave',
    startDate: 'Oct 15, 2026',
    endDate: 'Jan 15, 2027',
    days: 90,
    appliedOn: 'Sep 25, 2026',
    status: 'Approved',
    reason: 'Maternity leave allocation.',
  },
  {
    id: 'L-1045',
    staffId: 'EMP-005',
    staffName: 'Lucy Wanjiku',
    role: 'School Nurse',
    department: 'Administration',
    type: 'Compassionate Leave',
    startDate: 'Oct 12, 2026',
    endDate: 'Oct 13, 2026',
    days: 2,
    appliedOn: 'Oct 05, 2026',
    status: 'Pending',
    reason: 'Family emergency attendance.',
  },
  {
    id: 'L-1046',
    staffId: 'EMP-004',
    staffName: 'David Njoroge',
    role: 'Senior Accountant',
    department: 'Finance',
    type: 'Paternity Leave',
    startDate: 'Oct 01, 2026',
    endDate: 'Oct 14, 2026',
    days: 10,
    appliedOn: 'Sep 20, 2026',
    status: 'Approved',
    reason: 'Paternity leave following birth of child.',
  },
  {
    id: 'L-1047',
    staffId: 'EMP-006',
    staffName: 'Peter Kipkorir',
    role: 'Security Guard',
    department: 'Security',
    type: 'Unpaid Leave',
    startDate: 'Sep 20, 2026',
    endDate: 'Sep 22, 2026',
    days: 3,
    appliedOn: 'Sep 18, 2026',
    status: 'Rejected',
    reason: 'Personal urgent matters during short-staffed shift.',
  },
];

/* ==========================================================================
   PAGE COMPONENT
   ========================================================================== */

export default function LeaveManagementPage() {
  return (
    <div className="flex w-full flex-col gap-6 p-6 md:p-8">
      {/* ----------------------------------------------------------------------
          HEADER
          ---------------------------------------------------------------------- */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Leave & Time Off
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Review staff leave applications, approve requests, and manage leave balances.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#006FBF]"
          >
            <i className="fa-solid fa-file-export mr-2 text-slate-400" />
            Export Report
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#006FBF] to-[#04B1D6] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-[#012E54] hover:to-[#006FBF] focus:outline-none focus:ring-2 focus:ring-[#006FBF] focus:ring-offset-2"
          >
            <i className="fa-solid fa-plus mr-2" />
            Apply for Leave
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
            placeholder="Search request by staff name, ID, or leave type..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            className="block rounded-xl border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF] sm:text-sm sm:leading-6"
            defaultValue=""
          >
            <option value="" disabled>Status Filter</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            className="block rounded-xl border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF] sm:text-sm sm:leading-6"
            defaultValue=""
          >
            <option value="" disabled>Leave Type</option>
            <option value="annual">Annual Leave</option>
            <option value="sick">Sick Leave</option>
            <option value="maternity">Maternity Leave</option>
            <option value="paternity">Paternity Leave</option>
            <option value="compassionate">Compassionate Leave</option>
            <option value="unpaid">Unpaid Leave</option>
          </select>

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
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          LEAVE REQUESTS TABLE
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
                  Leave Type
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Dates & Duration
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Applied On
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
              {LEAVE_REQUESTS.map((request) => (
                <tr key={request.id} className="transition-colors hover:bg-slate-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                        {request.staffName.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div className="ml-3">
                        <Link
                          href={`/dashboard/hr/staff/${request.staffId}`}
                          className="text-sm font-semibold text-slate-900 hover:text-[#006FBF]"
                        >
                          {request.staffName}
                        </Link>
                        <p className="text-xs text-slate-500">{request.role} &bull; {request.department}</p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                      {request.type}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <p className="text-sm font-medium text-slate-900">
                      {request.startDate} - {request.endDate}
                    </p>
                    <p className="text-xs text-slate-500">{request.days} day{request.days > 1 ? 's' : ''}</p>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                    {request.appliedOn}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                        request.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                          : request.status === 'Pending'
                          ? 'bg-amber-50 text-amber-700 ring-amber-600/20'
                          : 'bg-rose-50 text-rose-700 ring-rose-600/20'
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    {request.status === 'Pending' ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          className="rounded-lg bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <button className="text-slate-400 hover:text-[#006FBF]" title="View Details">
                        <i className="fa-regular fa-eye" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-3">
          <p className="text-sm text-slate-600">
            Showing <span className="font-semibold">6</span> of <span className="font-semibold">24</span> requests
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