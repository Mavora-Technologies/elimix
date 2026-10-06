// apps/web/app/dashboard/hr/staff/page.tsx

import Link from 'next/link';

/* ==========================================================================
   MOCK DATA
   ========================================================================== */

const STAFF_MEMBERS = [
  {
    id: 'EMP-001',
    name: 'Sarah Jenkins',
    email: 's.jenkins@school.edu',
    phone: '+254 712 345 678',
    role: 'Mathematics Teacher',
    department: 'Academics',
    status: 'Active',
  },
  {
    id: 'EMP-002',
    name: 'Michael Ochieng',
    email: 'm.ochieng@school.edu',
    phone: '+254 722 987 654',
    role: 'Transport Manager',
    department: 'Transport',
    status: 'On Leave',
  },
  {
    id: 'EMP-003',
    name: 'Grace Mutuku',
    email: 'g.mutuku@school.edu',
    phone: '+254 733 456 789',
    role: 'Librarian',
    department: 'Academics',
    status: 'Active',
  },
  {
    id: 'EMP-004',
    name: 'David Njoroge',
    email: 'd.njoroge@school.edu',
    phone: '+254 799 123 456',
    role: 'Senior Accountant',
    department: 'Finance',
    status: 'Active',
  },
  {
    id: 'EMP-005',
    name: 'Lucy Wanjiku',
    email: 'l.wanjiku@school.edu',
    phone: '+254 711 222 333',
    role: 'School Nurse',
    department: 'Administration',
    status: 'Active',
  },
  {
    id: 'EMP-006',
    name: 'Peter Kipkorir',
    email: 'p.kipkorir@school.edu',
    phone: '+254 744 555 666',
    role: 'Security Guard',
    department: 'Security',
    status: 'Inactive',
  },
  {
    id: 'EMP-007',
    name: 'Amina Hassan',
    email: 'a.hassan@school.edu',
    phone: '+254 777 888 999',
    role: 'Chemistry Teacher',
    department: 'Academics',
    status: 'Active',
  },
];

/* ==========================================================================
   PAGE COMPONENT
   ========================================================================== */

export default function StaffDirectoryPage() {
  return (
    <div className="flex w-full flex-col gap-6 p-6 md:p-8">
      {/* ----------------------------------------------------------------------
          HEADER
          ---------------------------------------------------------------------- */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Staff Directory
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage all employees, update profiles, and track employment status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#006FBF]"
          >
            <i className="fa-solid fa-file-export mr-2 text-slate-400" />
            Export
          </button>
          <Link
            href="/dashboard/hr/staff/new"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#006FBF] to-[#04B1D6] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-[#012E54] hover:to-[#006FBF] focus:outline-none focus:ring-2 focus:ring-[#006FBF] focus:ring-offset-2"
          >
            <i className="fa-solid fa-user-plus mr-2" />
            Add Staff
          </Link>
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          FILTERS & SEARCH
          ---------------------------------------------------------------------- */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <div className="relative flex-1 md:max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <i className="fa-solid fa-magnifying-glass text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-xl border-0 py-2.5 pl-10 pr-4 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-[#006FBF] sm:text-sm sm:leading-6"
            placeholder="Search staff by name, role, or ID..."
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <select
            className="block w-full rounded-xl border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF] sm:text-sm sm:leading-6"
            defaultValue=""
          >
            <option value="" disabled>All Departments</option>
            <option value="academics">Academics</option>
            <option value="administration">Administration</option>
            <option value="finance">Finance</option>
            <option value="transport">Transport</option>
            <option value="security">Security</option>
          </select>
          
          <select
            className="block w-full rounded-xl border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF] sm:text-sm sm:leading-6"
            defaultValue=""
          >
            <option value="" disabled>Status</option>
            <option value="active">Active</option>
            <option value="on-leave">On Leave</option>
            <option value="inactive">Inactive</option>
          </select>

          <button className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700">
            <i className="fa-solid fa-filter" />
          </button>
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          STAFF DATA TABLE
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
                  Contact Info
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Role & Dept
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
              {STAFF_MEMBERS.map((staff) => (
                <tr key={staff.id} className="transition-colors hover:bg-slate-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#012E54] to-[#006FBF] text-sm font-bold text-white">
                        {staff.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-semibold text-slate-900">{staff.name}</p>
                        <p className="text-xs text-slate-500">{staff.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex flex-col text-sm text-slate-700">
                      <span className="flex items-center gap-2">
                        <i className="fa-regular fa-envelope text-slate-400 w-3" />
                        {staff.email}
                      </span>
                      <span className="mt-1 flex items-center gap-2 text-slate-500">
                        <i className="fa-solid fa-phone text-slate-400 w-3" />
                        {staff.phone}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <p className="text-sm font-medium text-slate-900">{staff.role}</p>
                    <p className="text-xs text-slate-500">{staff.department}</p>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                        staff.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                          : staff.status === 'On Leave'
                          ? 'bg-amber-50 text-amber-700 ring-amber-600/20'
                          : 'bg-slate-100 text-slate-700 ring-slate-500/20'
                      }`}
                    >
                      {staff.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-3 text-slate-400">
                      <Link href={`/dashboard/hr/staff/${staff.id}`} className="hover:text-[#006FBF]" title="View Profile">
                        <i className="fa-regular fa-eye" />
                      </Link>
                      <button className="hover:text-[#006FBF]" title="Edit">
                        <i className="fa-regular fa-pen-to-square" />
                      </button>
                      <button className="hover:text-red-600" title="Delete">
                        <i className="fa-regular fa-trash-can" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination (Mock) */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-3">
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-700">
                Showing <span className="font-semibold">1</span> to <span className="font-semibold">7</span> of{' '}
                <span className="font-semibold">142</span> results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0">
                  <span className="sr-only">Previous</span>
                  <i className="fa-solid fa-chevron-left h-4 w-4" />
                </button>
                <button aria-current="page" className="relative z-10 inline-flex items-center bg-[#006FBF] px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006FBF]">
                  1
                </button>
                <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0">
                  2
                </button>
                <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0">
                  3
                </button>
                <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-inset ring-slate-300 focus:outline-offset-0">
                  ...
                </span>
                <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0">
                  14
                </button>
                <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0">
                  <span className="sr-only">Next</span>
                  <i className="fa-solid fa-chevron-right h-4 w-4" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}