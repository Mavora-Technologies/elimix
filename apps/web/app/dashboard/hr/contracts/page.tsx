// apps/web/app/dashboard/hr/contracts/page.tsx

import Link from 'next/link';

/* ==========================================================================
   MOCK DATA
   ========================================================================== */

const STATS = [
  {
    title: 'Active Contracts',
    value: '118',
    subtext: '83% of total workforce',
    icon: 'fa-file-signature',
    color: 'from-emerald-600 to-emerald-400',
  },
  {
    title: 'Expiring Soon',
    value: '14',
    subtext: 'Expiring within 60 days',
    icon: 'fa-triangle-exclamation',
    color: 'from-amber-500 to-amber-400',
  },
  {
    title: 'On Probation',
    value: '9',
    subtext: 'Performance review due',
    icon: 'fa-user-clock',
    color: 'from-indigo-600 to-indigo-400',
  },
  {
    title: 'Pending Renewal',
    value: '5',
    subtext: 'Awaiting signature / approval',
    icon: 'fa-hourglass-half',
    color: 'from-[#006FBF] to-[#04B1D6]',
  },
];

const CONTRACT_RECORDS = [
  {
    id: 'CNT-2022-001',
    staffId: 'EMP-001',
    staffName: 'Sarah Jenkins',
    role: 'Mathematics Teacher',
    department: 'Academics',
    contractType: 'Permanent / Full-Time',
    startDate: 'Jan 10, 2022',
    endDate: 'Indefinite',
    probationEnd: 'Jul 10, 2022',
    status: 'Active',
    documentUrl: '#',
  },
  {
    id: 'CNT-2024-018',
    staffId: 'EMP-002',
    staffName: 'Michael Ochieng',
    role: 'Transport Manager',
    department: 'Transport',
    contractType: 'Fixed-Term (2 Years)',
    startDate: 'Nov 15, 2024',
    endDate: 'Nov 14, 2026',
    probationEnd: 'May 15, 2025',
    status: 'Expiring Soon',
    documentUrl: '#',
  },
  {
    id: 'CNT-2023-005',
    staffId: 'EMP-003',
    staffName: 'Grace Mutuku',
    role: 'Librarian',
    department: 'Academics',
    contractType: 'Permanent / Full-Time',
    startDate: 'Mar 01, 2023',
    endDate: 'Indefinite',
    probationEnd: 'Sep 01, 2023',
    status: 'Active',
    documentUrl: '#',
  },
  {
    id: 'CNT-2025-042',
    staffId: 'EMP-004',
    staffName: 'David Njoroge',
    role: 'Senior Accountant',
    department: 'Finance',
    contractType: 'Fixed-Term (1 Year)',
    startDate: 'Nov 01, 2025',
    endDate: 'Oct 31, 2026',
    probationEnd: 'Feb 01, 2026',
    status: 'Expiring Soon',
    documentUrl: '#',
  },
  {
    id: 'CNT-2026-009',
    staffId: 'EMP-005',
    staffName: 'Kevin Kiptoo',
    role: 'Security Specialist',
    department: 'Security',
    contractType: 'Probationary',
    startDate: 'Aug 01, 2026',
    endDate: 'Feb 01, 2027',
    probationEnd: 'Feb 01, 2027',
    status: 'Probation',
    documentUrl: '#',
  },
  {
    id: 'CNT-2026-003',
    staffId: 'EMP-007',
    staffName: 'Amina Hassan',
    role: 'Chemistry Teacher',
    department: 'Academics',
    contractType: 'Consultant',
    startDate: 'May 01, 2026',
    endDate: 'Nov 01, 2026',
    probationEnd: 'N/A',
    status: 'Pending Renewal',
    documentUrl: '#',
  },
];

/* ==========================================================================
   PAGE COMPONENT
   ========================================================================== */

export default function ContractsPage() {
  return (
    <div className="flex w-full flex-col gap-6 p-6 md:p-8">
      {/* ----------------------------------------------------------------------
          HEADER
          ---------------------------------------------------------------------- */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Contracts & Agreements
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage employee employment agreements, fixed-term renewals, and probation periods.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#006FBF]"
          >
            <i className="fa-solid fa-file-export mr-2 text-slate-400" />
            Export Contracts
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#006FBF] to-[#04B1D6] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-[#012E54] hover:to-[#006FBF] focus:outline-none focus:ring-2 focus:ring-[#006FBF] focus:ring-offset-2"
          >
            <i className="fa-solid fa-plus mr-2" />
            New Contract
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
            placeholder="Search staff name, ID, or contract reference..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            className="block rounded-xl border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF] sm:text-sm sm:leading-6"
            defaultValue=""
          >
            <option value="" disabled>Contract Status</option>
            <option value="active">Active</option>
            <option value="expiring">Expiring Soon</option>
            <option value="probation">Probation</option>
            <option value="pending">Pending Renewal</option>
            <option value="terminated">Terminated / Expired</option>
          </select>

          <select
            className="block rounded-xl border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF] sm:text-sm sm:leading-6"
            defaultValue=""
          >
            <option value="" disabled>Contract Type</option>
            <option value="permanent">Permanent / Full-Time</option>
            <option value="fixed-term">Fixed-Term</option>
            <option value="probationary">Probationary</option>
            <option value="consultant">Consultant</option>
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
          CONTRACTS TABLE
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
                  Contract Type
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Start Date
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  End Date
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
              {CONTRACT_RECORDS.map((record) => (
                <tr key={record.id} className="transition-colors hover:bg-slate-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                        {record.staffName.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div className="ml-3">
                        <Link
                          href={`/dashboard/hr/staff/${record.staffId}`}
                          className="text-sm font-semibold text-slate-900 hover:text-[#006FBF]"
                        >
                          {record.staffName}
                        </Link>
                        <p className="text-xs text-slate-500">{record.role} &bull; {record.department}</p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                      {record.contractType}
                    </span>
                    <p className="mt-0.5 text-xs text-slate-400">Ref: {record.id}</p>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                    {record.startDate}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-800">
                    {record.endDate}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                        record.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                          : record.status === 'Expiring Soon'
                          ? 'bg-amber-50 text-amber-700 ring-amber-600/20'
                          : record.status === 'Probation'
                          ? 'bg-indigo-50 text-indigo-700 ring-indigo-600/20'
                          : record.status === 'Pending Renewal'
                          ? 'bg-blue-50 text-blue-700 ring-blue-600/20'
                          : 'bg-rose-50 text-rose-700 ring-rose-600/20'
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-3">
                      <a
                        href={record.documentUrl}
                        className="text-slate-400 hover:text-[#006FBF]"
                        title="Download Document"
                      >
                        <i className="fa-solid fa-file-arrow-down" />
                      </a>
                      <button className="text-slate-400 hover:text-[#006FBF]" title="Renew or Edit Contract">
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
            Showing <span className="font-semibold">6</span> of <span className="font-semibold">142</span> contracts
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