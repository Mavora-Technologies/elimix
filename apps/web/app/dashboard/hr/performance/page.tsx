// apps/web/app/dashboard/hr/performance/page.tsx

import Link from 'next/link';

/* ==========================================================================
   MOCK DATA
   ========================================================================== */

const STATS = [
  {
    title: 'Average Rating',
    value: '4.2 / 5.0',
    subtext: 'School-wide performance score',
    icon: 'fa-star-half-stroke',
    color: 'from-[#006FBF] to-[#04B1D6]',
  },
  {
    title: 'Upcoming Reviews',
    value: '24',
    subtext: 'Scheduled for Q4 2026',
    icon: 'fa-calendar-check',
    color: 'from-emerald-600 to-emerald-400',
  },
  {
    title: 'Goals Achieved',
    value: '85%',
    subtext: 'Completed organizational KPIs',
    icon: 'fa-bullseye',
    color: 'from-indigo-600 to-indigo-400',
  },
  {
    title: 'Action Required',
    value: '3',
    subtext: 'Staff on improvement plans (PIP)',
    icon: 'fa-triangle-exclamation',
    color: 'from-amber-500 to-amber-400',
  },
];

const PERFORMANCE_RECORDS = [
  {
    id: 'REV-2026-081',
    staffId: 'EMP-001',
    staffName: 'Sarah Jenkins',
    role: 'Mathematics Teacher',
    department: 'Academics',
    reviewCycle: 'Q3 2026',
    evaluator: 'Dr. Robert Kimani',
    score: 4.8,
    grade: 'Exceeds Expectations',
    status: 'Completed',
  },
  {
    id: 'REV-2026-082',
    staffId: 'EMP-002',
    staffName: 'Michael Ochieng',
    role: 'Transport Manager',
    department: 'Transport',
    reviewCycle: 'Q3 2026',
    evaluator: 'James Omondi',
    score: 3.5,
    grade: 'Meets Expectations',
    status: 'Completed',
  },
  {
    id: 'REV-2026-083',
    staffId: 'EMP-003',
    staffName: 'Grace Mutuku',
    role: 'Librarian',
    department: 'Academics',
    reviewCycle: 'Q4 2026',
    evaluator: 'Dr. Robert Kimani',
    score: null,
    grade: 'N/A',
    status: 'Pending',
  },
  {
    id: 'REV-2026-084',
    staffId: 'EMP-004',
    staffName: 'David Njoroge',
    role: 'Senior Accountant',
    department: 'Finance',
    reviewCycle: 'Annual 2026',
    evaluator: 'Agnes Wambui',
    score: 4.2,
    grade: 'Exceeds Expectations',
    status: 'Completed',
  },
  {
    id: 'REV-2026-085',
    staffId: 'EMP-006',
    staffName: 'Peter Kipkorir',
    role: 'Security Guard',
    department: 'Security',
    reviewCycle: 'Q3 2026',
    evaluator: 'Capt. Musa Yego',
    score: 2.1,
    grade: 'Needs Improvement',
    status: 'Action Required',
  },
  {
    id: 'REV-2026-086',
    staffId: 'EMP-005',
    staffName: 'Lucy Wanjiku',
    role: 'School Nurse',
    department: 'Administration',
    reviewCycle: 'Q4 2026',
    evaluator: 'Agnes Wambui',
    score: null,
    grade: 'N/A',
    status: 'In Progress',
  },
];

/* ==========================================================================
   PAGE COMPONENT
   ========================================================================== */

export default function PerformancePage() {
  return (
    <div className="flex w-full flex-col gap-6 p-6 md:p-8">
      {/* ----------------------------------------------------------------------
          HEADER
          ---------------------------------------------------------------------- */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Performance & Appraisals
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Track staff evaluations, review cycles, and manage performance improvement plans.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#006FBF]"
          >
            <i className="fa-solid fa-chart-line mr-2 text-slate-400" />
            Analytics Report
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#006FBF] to-[#04B1D6] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-[#012E54] hover:to-[#006FBF] focus:outline-none focus:ring-2 focus:ring-[#006FBF] focus:ring-offset-2"
          >
            <i className="fa-solid fa-plus mr-2" />
            Initiate Review
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
            placeholder="Search by staff name, ID, or evaluator..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            className="block rounded-xl border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF] sm:text-sm sm:leading-6"
            defaultValue=""
          >
            <option value="" disabled>Review Cycle</option>
            <option value="q4-2026">Q4 2026</option>
            <option value="q3-2026">Q3 2026</option>
            <option value="annual-2026">Annual 2026</option>
            <option value="probation">Probationary</option>
          </select>

          <select
            className="block rounded-xl border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF] sm:text-sm sm:leading-6"
            defaultValue=""
          >
            <option value="" disabled>Status</option>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
            <option value="pending">Pending</option>
            <option value="action-required">Action Required (PIP)</option>
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
          PERFORMANCE TABLE
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
                  Review Details
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Score / Grade
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Evaluator
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
              {PERFORMANCE_RECORDS.map((record) => (
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
                    <p className="text-sm font-medium text-slate-900">{record.reviewCycle}</p>
                    <p className="text-xs text-slate-500">Ref: {record.id}</p>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {record.score ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{record.score}</span>
                        <span className="text-xs text-slate-500">/ 5.0</span>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400">--</span>
                    )}
                    <p className={`text-xs font-medium mt-0.5 ${
                      record.grade === 'Exceeds Expectations' ? 'text-emerald-600' :
                      record.grade === 'Meets Expectations' ? 'text-blue-600' :
                      record.grade === 'Needs Improvement' ? 'text-amber-600' :
                      'text-slate-500'
                    }`}>
                      {record.grade}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                    {record.evaluator}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                        record.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                          : record.status === 'In Progress'
                          ? 'bg-blue-50 text-blue-700 ring-blue-600/20'
                          : record.status === 'Pending'
                          ? 'bg-slate-100 text-slate-700 ring-slate-500/20'
                          : 'bg-amber-50 text-amber-700 ring-amber-600/20'
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-3">
                      {record.status === 'Completed' ? (
                        <>
                          <button className="text-slate-400 hover:text-[#006FBF]" title="View Report">
                            <i className="fa-solid fa-file-contract" />
                          </button>
                          <button className="text-slate-400 hover:text-[#006FBF]" title="Download PDF">
                            <i className="fa-solid fa-download" />
                          </button>
                        </>
                      ) : (
                        <button className="text-slate-400 hover:text-[#006FBF]" title="Edit / Continue Review">
                          <i className="fa-solid fa-pen-to-square" />
                        </button>
                      )}
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
            Showing <span className="font-semibold">6</span> of <span className="font-semibold">48</span> active reviews
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