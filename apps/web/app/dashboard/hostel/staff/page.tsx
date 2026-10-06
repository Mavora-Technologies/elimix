// apps/web/app/dashboard/hostel/staff/page.tsx

import Link from 'next/link';

/* ==========================================================================
   MOCK DATA
   ========================================================================== */

const STATS = [
  {
    title: 'Total Boarding Staff',
    value: '18',
    subtext: 'Patrons, matrons, and house masters',
    icon: 'fa-users-gear',
    color: 'from-[#006FBF] to-[#04B1D6]',
  },
  {
    title: 'On Duty Today',
    value: '14',
    subtext: 'Active personnel across shifts',
    icon: 'fa-user-check',
    color: 'from-emerald-600 to-emerald-500',
  },
  {
    title: 'Houses Covered',
    value: '6 Houses',
    subtext: '100% administrative coverage',
    icon: 'fa-house-chimney-user',
    color: 'from-indigo-600 to-indigo-500',
  },
  {
    title: 'On Leave / Off',
    value: '4 Staff',
    subtext: 'Scheduled off-duty or annual leave',
    icon: 'fa-user-clock',
    color: 'from-amber-500 to-amber-600',
  },
];

const STAFF_RECORDS = [
  {
    id: 'STF-2023-012',
    name: 'Mr. David Njoroge',
    role: 'Senior Patron',
    hostelBlock: 'Elgon House',
    phone: '+254 722 123 456',
    email: 'david.njoroge@elimix.edu',
    shift: 'Morning & Evening Roll Call',
    status: 'On Duty',
  },
  {
    id: 'STF-2023-018',
    name: 'Madam Beatrice Akinyi',
    role: 'Senior Matron',
    hostelBlock: 'Kilimanjaro House',
    phone: '+254 733 987 654',
    email: 'beatrice.akinyi@elimix.edu',
    shift: 'Full Day Boarding Supervision',
    status: 'On Duty',
  },
  {
    id: 'STF-2024-004',
    name: 'Captain John Mutua',
    role: 'House Master',
    hostelBlock: 'Aberdare House',
    phone: '+254 711 456 789',
    email: 'john.mutua@elimix.edu',
    shift: 'Evening Prep & Night Duty',
    status: 'On Duty',
  },
  {
    id: 'STF-2022-091',
    name: 'Dr. Elizabeth Wamalwa',
    role: 'Boarding Medical Officer',
    hostelBlock: 'Main Dispensary / All Houses',
    phone: '+254 700 112 233',
    email: 'elizabeth.wamalwa@elimix.edu',
    shift: '24hr On-Call Rotational',
    status: 'On Duty',
  },
  {
    id: 'STF-2024-033',
    name: 'Mr. Peter Kamau',
    role: 'Maintenance Supervisor',
    hostelBlock: 'Facility & Hostel Wing',
    phone: '+254 725 667 889',
    email: 'peter.kamau@elimix.edu',
    shift: 'Day Shift (08:00 - 17:00)',
    status: 'On Leave',
  },
  {
    id: 'STF-2023-055',
    name: 'Madam Joy Cheptoo',
    role: 'Assistant Matron',
    hostelBlock: 'Kenya House',
    phone: '+254 720 334 556',
    email: 'joy.cheptoo@elimix.edu',
    shift: 'Morning Shift',
    status: 'On Duty',
  },
];

/* ==========================================================================
   PAGE COMPONENT
   ========================================================================== */

export default function HostelStaffPage() {
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
          <span className="text-slate-900">Boarding Staff & Patrons</span>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Hostel Staff & Duty Roster
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage boarding patrons, matrons, house masters, medical officers, and staff shift schedules.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#006FBF]"
            >
              <i className="fa-solid fa-calendar-days mr-2 text-slate-400" />
              Duty Roster
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#006FBF] to-[#04B1D6] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-[#012E54] hover:to-[#006FBF] focus:outline-none focus:ring-2 focus:ring-[#006FBF] focus:ring-offset-2"
            >
              <i className="fa-solid fa-user-plus mr-2" />
              Assign Staff
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
            placeholder="Search staff name, role, or hostel block..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            className="block rounded-xl border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF] sm:text-sm sm:leading-6"
            defaultValue="all-roles"
          >
            <option value="all-roles">All Roles</option>
            <option value="patron">Patrons</option>
            <option value="matron">Matrons</option>
            <option value="house-master">House Masters</option>
            <option value="medical">Medical / Support</option>
          </select>

          <select
            className="block rounded-xl border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF] sm:text-sm sm:leading-6"
            defaultValue="all-status"
          >
            <option value="all-status">All Statuses</option>
            <option value="on-duty">On Duty</option>
            <option value="leave">On Leave / Off</option>
          </select>
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          STAFF TABLE
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
                  Assigned House / Block
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Shift & Schedule
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
              {STAFF_RECORDS.map((staff) => (
                <tr key={staff.id} className="transition-colors hover:bg-slate-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#006FBF] to-[#04B1D6] text-xs font-bold text-white shadow-inner">
                        {staff.name.split(' ').slice(1).map((n) => n[0]).join('')}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-semibold text-slate-900">
                          {staff.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {staff.role} &bull; <span className="font-mono">{staff.id}</span>
                        </p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="whitespace-nowrap px-6 py-4">
                    <p className="text-sm font-medium text-slate-900">{staff.hostelBlock}</p>
                    <p className="text-xs text-slate-500">
                      <i className="fa-solid fa-phone mr-1 text-slate-400" /> {staff.phone}
                    </p>
                  </td>
                  
                  <td className="whitespace-nowrap px-6 py-4">
                    <p className="text-sm font-medium text-slate-800">{staff.shift}</p>
                    <p className="text-xs text-slate-500">{staff.email}</p>
                  </td>
                  
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                        staff.status === 'On Duty'
                          ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                          : 'bg-amber-50 text-amber-700 ring-amber-600/20'
                      }`}
                    >
                      {staff.status === 'On Duty' && <i className="fa-solid fa-check mr-1.5 opacity-70" />}
                      {staff.status === 'On Leave' && <i className="fa-solid fa-clock mr-1.5 opacity-70" />}
                      {staff.status}
                    </span>
                  </td>
                  
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-3">
                      <button className="text-slate-400 hover:text-[#006FBF]" title="View Profile">
                        <i className="fa-solid fa-eye" />
                      </button>
                      <button className="text-slate-400 hover:text-[#006FBF]" title="Edit Assignment">
                        <i className="fa-solid fa-pen-to-square" />
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
            Showing <span className="font-semibold">6</span> of <span className="font-semibold">18</span> boarding staff members
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