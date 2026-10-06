// apps/web/app/dashboard/hr/recruitment/page.tsx

import Link from 'next/link';

/* ==========================================================================
   MOCK DATA
   ========================================================================== */

const STATS = [
  {
    title: 'Active Job Openings',
    value: '6',
    subtext: '12 open positions across 4 departments',
    icon: 'fa-briefcase',
    color: 'from-[#006FBF] to-[#04B1D6]',
  },
  {
    title: 'Total Applications',
    value: '148',
    subtext: '+32 new applicants this week',
    icon: 'fa-users',
    color: 'from-emerald-600 to-emerald-400',
  },
  {
    title: 'Interviews Scheduled',
    value: '12',
    subtext: '4 scheduled for today',
    icon: 'fa-calendar-check',
    color: 'from-indigo-600 to-indigo-400',
  },
  {
    title: 'Offers Extended',
    value: '3',
    subtext: '2 accepted, 1 pending response',
    icon: 'fa-file-signature',
    color: 'from-amber-500 to-amber-400',
  },
];

const JOB_POSTINGS = [
  {
    id: 'REQ-2026-012',
    title: 'Senior Physics Teacher',
    department: 'Academics',
    employmentType: 'Full-time',
    location: 'Main Campus',
    applicantsCount: 34,
    postedDate: 'Sep 15, 2026',
    deadline: 'Oct 15, 2026',
    hiringManager: 'Dr. Robert Kimani',
    status: 'Published',
  },
  {
    id: 'REQ-2026-015',
    title: 'School Bus Driver',
    department: 'Transport',
    employmentType: 'Contract',
    location: 'Main Campus',
    applicantsCount: 19,
    postedDate: 'Sep 20, 2026',
    deadline: 'Oct 20, 2026',
    hiringManager: 'Michael Ochieng',
    status: 'Interviewing',
  },
  {
    id: 'REQ-2026-018',
    title: 'Assistant Accountant',
    department: 'Finance',
    employmentType: 'Full-time',
    location: 'Admin Building',
    applicantsCount: 52,
    postedDate: 'Sep 01, 2026',
    deadline: 'Oct 01, 2026',
    hiringManager: 'Agnes Wambui',
    status: 'Offer Extended',
  },
  {
    id: 'REQ-2026-021',
    title: 'ICT Lab Technician',
    department: 'IT Support',
    employmentType: 'Full-time',
    location: 'Main Campus',
    applicantsCount: 28,
    postedDate: 'Oct 01, 2026',
    deadline: 'Oct 30, 2026',
    hiringManager: 'John Mwangi',
    status: 'Published',
  },
  {
    id: 'REQ-2026-022',
    title: 'School Counselor',
    department: 'Administration',
    employmentType: 'Part-time',
    location: 'Main Campus',
    applicantsCount: 11,
    postedDate: 'Oct 03, 2026',
    deadline: 'Nov 01, 2026',
    hiringManager: 'Agnes Wambui',
    status: 'Draft',
  },
  {
    id: 'REQ-2026-009',
    title: 'French Language Teacher',
    department: 'Academics',
    employmentType: 'Full-time',
    location: 'Main Campus',
    applicantsCount: 4,
    postedDate: 'Aug 10, 2026',
    deadline: 'Sep 10, 2026',
    hiringManager: 'Dr. Robert Kimani',
    status: 'Filled',
  },
];

/* ==========================================================================
   PAGE COMPONENT
   ========================================================================== */

export default function RecruitmentPage() {
  return (
    <div className="flex w-full flex-col gap-6 p-6 md:p-8">
      {/* ----------------------------------------------------------------------
          HEADER
          ---------------------------------------------------------------------- */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Recruitment & Hiring
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage job requisitions, track candidate applications, and schedule interview rounds.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#006FBF]"
          >
            <i className="fa-solid fa-users-viewfinder mr-2 text-slate-400" />
            Candidate Pool
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#006FBF] to-[#04B1D6] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-[#012E54] hover:to-[#006FBF] focus:outline-none focus:ring-2 focus:ring-[#006FBF] focus:ring-offset-2"
          >
            <i className="fa-solid fa-plus mr-2" />
            Create Job Requisition
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
            placeholder="Search job title, requisition ID, or hiring manager..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            className="block rounded-xl border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF] sm:text-sm sm:leading-6"
            defaultValue=""
          >
            <option value="" disabled>Status</option>
            <option value="published">Published</option>
            <option value="interviewing">Interviewing</option>
            <option value="offer">Offer Extended</option>
            <option value="draft">Draft</option>
            <option value="filled">Filled / Closed</option>
          </select>

          <select
            className="block rounded-xl border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF] sm:text-sm sm:leading-6"
            defaultValue=""
          >
            <option value="" disabled>Employment Type</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
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
            <option value="it">IT Support</option>
          </select>
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          RECRUITMENT TABLE
          ---------------------------------------------------------------------- */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Job Position & Requisition
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Department & Type
                </th>
                <th scope="col" className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Applicants
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Hiring Manager
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Deadline
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
              {JOB_POSTINGS.map((job) => (
                <tr key={job.id} className="transition-colors hover:bg-slate-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xs font-bold text-[#006FBF]">
                        <i className="fa-solid fa-briefcase" />
                      </div>
                      <div className="ml-3">
                        <Link
                          href={`/dashboard/hr/recruitment/${job.id}`}
                          className="text-sm font-semibold text-slate-900 hover:text-[#006FBF]"
                        >
                          {job.title}
                        </Link>
                        <p className="text-xs text-slate-500">Ref: {job.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <p className="text-sm font-medium text-slate-900">{job.department}</p>
                    <p className="text-xs text-slate-500">{job.employmentType} &bull; {job.location}</p>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-800">
                      {job.applicantsCount}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                    {job.hiringManager}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                    {job.deadline}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                        job.status === 'Published'
                          ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                          : job.status === 'Interviewing'
                          ? 'bg-indigo-50 text-indigo-700 ring-indigo-600/20'
                          : job.status === 'Offer Extended'
                          ? 'bg-amber-50 text-amber-700 ring-amber-600/20'
                          : job.status === 'Draft'
                          ? 'bg-slate-100 text-slate-700 ring-slate-500/20'
                          : 'bg-blue-50 text-blue-700 ring-blue-600/20'
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/dashboard/hr/recruitment/${job.id}/candidates`}
                        className="text-slate-400 hover:text-[#006FBF]"
                        title="View Candidates"
                      >
                        <i className="fa-solid fa-users" />
                      </Link>
                      <button className="text-slate-400 hover:text-[#006FBF]" title="Edit Requisition">
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
            Showing <span className="font-semibold">6</span> of <span className="font-semibold">12</span> requisitions
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