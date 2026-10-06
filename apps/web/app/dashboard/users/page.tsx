// apps/web/app/dashboard/users/page.tsx

import Link from 'next/link';

/* ==========================================================================
   MOCK DATA
   ========================================================================== */

const STATS = [
  {
    title: 'Total System Users',
    value: '48',
    subtext: 'Active accounts across all roles',
    icon: 'fa-users',
    color: 'from-[#006FBF] to-[#04B1D6]',
  },
  {
    title: 'Administrators',
    value: '5',
    subtext: 'Full workspace management access',
    icon: 'fa-user-shield',
    color: 'from-indigo-600 to-indigo-500',
  },
  {
    title: 'Teachers & Educators',
    value: '32',
    subtext: 'Academics, grading, and attendance',
    icon: 'fa-chalkboard-user',
    color: 'from-emerald-600 to-emerald-500',
  },
  {
    title: 'Support & Operations',
    value: '11',
    subtext: 'Finance, hostel, medical, & staff',
    icon: 'fa-user-gear',
    color: 'from-amber-500 to-amber-600',
  },
];

const USERS_RECORDS = [
  {
    id: 'USR-2024-001',
    name: 'Dr. James Mwangi',
    email: 'james.mwangi@elimix.edu',
    role: 'Super Administrator',
    scope: 'All Workspaces & Tenants',
    lastActive: '2 mins ago',
    status: 'Active',
  },
  {
    id: 'USR-2024-002',
    name: 'Prof. Sarah Ouma',
    email: 'sarah.ouma@elimix.edu',
    role: 'Principal / Admin',
    scope: 'Main Campus Workspace',
    lastActive: '15 mins ago',
    status: 'Active',
  },
  {
    id: 'USR-2024-014',
    name: 'Mr. David Njoroge',
    email: 'david.njoroge@elimix.edu',
    role: 'Senior Teacher / Patron',
    scope: 'Elgon House & Mathematics Dept',
    lastActive: '1 hour ago',
    status: 'Active',
  },
  {
    id: 'USR-2024-022',
    name: 'Ms. Brenda Cheruiyot',
    email: 'brenda.cheruiyot@elimix.edu',
    role: 'Finance Officer',
    scope: 'Bursar & Fee Collection',
    lastActive: '3 hours ago',
    status: 'Active',
  },
  {
    id: 'USR-2024-031',
    name: 'Madam Beatrice Akinyi',
    email: 'beatrice.akinyi@elimix.edu',
    role: 'Hostel Matron',
    scope: 'Kilimanjaro House',
    lastActive: 'Yesterday',
    status: 'Active',
  },
  {
    id: 'USR-2024-045',
    name: 'Dr. Elizabeth Wamalwa',
    email: 'elizabeth.wamalwa@elimix.edu',
    role: 'Medical Officer',
    scope: 'School Dispensary & Health',
    lastActive: '2 days ago',
    status: 'Inactive',
  },
];

/* ==========================================================================
   PAGE COMPONENT
   ========================================================================== */

export default function UsersManagementPage() {
  return (
    <div className="flex w-full flex-col gap-6 p-6 md:p-8">
      {/* ----------------------------------------------------------------------
          BREADCRUMBS & HEADER
          ---------------------------------------------------------------------- */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <Link href="/dashboard" className="hover:text-[#006FBF]">
            Dashboard
          </Link>
          <i className="fa-solid fa-chevron-right text-[10px] text-slate-400" />
          <span className="text-slate-900">User & Role Management</span>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Users & Permissions
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage staff accounts, assign workspace roles, and control granular permission levels across Elimix.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#006FBF]"
            >
              <i className="fa-solid fa-shield-halved mr-2 text-slate-400" />
              Role Permissions
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#006FBF] to-[#04B1D6] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-[#012E54] hover:to-[#006FBF] focus:outline-none focus:ring-2 focus:ring-[#006FBF] focus:ring-offset-2"
            >
              <i className="fa-solid fa-user-plus mr-2" />
              Invite New User
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
            placeholder="Search user by name, email, or ID..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            className="block rounded-xl border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF] sm:text-sm sm:leading-6"
            defaultValue="all-roles"
          >
            <option value="all-roles">All Roles</option>
            <option value="admin">Administrators</option>
            <option value="teacher">Teachers</option>
            <option value="finance">Finance</option>
            <option value="support">Support / Staff</option>
          </select>

          <select
            className="block rounded-xl border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF] sm:text-sm sm:leading-6"
            defaultValue="all-status"
          >
            <option value="all-status">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          USERS TABLE
          ---------------------------------------------------------------------- */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  User Account
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Role & Permissions
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Workspace Scope
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Last Active
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
              {USERS_RECORDS.map((user) => (
                <tr key={user.id} className="transition-colors hover:bg-slate-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#006FBF] to-[#04B1D6] text-xs font-bold text-white shadow-inner">
                        {user.name.split(' ').slice(1).map((n) => n[0]).join('')}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-semibold text-slate-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {user.email} &bull; <span className="font-mono">{user.id}</span>
                        </p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      {user.role}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <p className="text-sm font-medium text-slate-800">{user.scope}</p>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-xs text-slate-500">
                    {user.lastActive}
                  </td>
                  
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                        user.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                          : 'bg-slate-50 text-slate-600 ring-slate-500/20'
                      }`}
                    >
                      {user.status === 'Active' && <i className="fa-solid fa-check mr-1.5 opacity-70" />}
                      {user.status}
                    </span>
                  </td>
                  
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-3">
                      <button className="text-slate-400 hover:text-[#006FBF]" title="View Details">
                        <i className="fa-solid fa-eye" />
                      </button>
                      <button className="text-slate-400 hover:text-[#006FBF]" title="Edit User">
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
            Showing <span className="font-semibold">6</span> of <span className="font-semibold">48</span> system users
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