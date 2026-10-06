// apps/web/app/dashboard/hostel/incidents/page.tsx

import Link from 'next/link';

/* ==========================================================================
   MOCK DATA
   ========================================================================== */

const STATS = [
  {
    title: 'Active / Open Incidents',
    value: '5',
    subtext: 'Require attention or disciplinary review',
    icon: 'fa-triangle-exclamation',
    color: 'from-rose-600 to-rose-500',
  },
  {
    title: 'Under Investigation',
    value: '3',
    subtext: 'Statements being gathered by matrons',
    icon: 'fa-magnifying-glass-chart',
    color: 'from-amber-500 to-amber-600',
  },
  {
    title: 'Resolved This Term',
    value: '18',
    subtext: 'Closed with student counselling/action',
    icon: 'fa-circle-check',
    color: 'from-emerald-600 to-emerald-500',
  },
  {
    title: 'Total Logged (Term 3)',
    value: '26',
    subtext: 'Across all 6 boarding houses',
    icon: 'fa-clipboard-list',
    color: 'from-[#006FBF] to-[#04B1D6]',
  },
];

const INCIDENTS_RECORDS = [
  {
    id: 'INC-2026-T3-024',
    title: 'Unauthorized Electrical Appliance (Immersion Heater)',
    category: 'Safety Hazard',
    hostelBlock: 'Elgon House',
    roomNumber: 'Room B-102',
    reportedBy: 'Mr. David Njoroge (Patron)',
    studentId: 'STU-2024-045',
    studentName: 'Brian Kiprop',
    date: 'Oct 05, 2026',
    severity: 'Medium',
    status: 'Open',
  },
  {
    id: 'INC-2026-T3-023',
    title: 'Noise Disturbance & Unauthorized Gathering after Prep',
    category: 'Discipline',
    hostelBlock: 'Kilimanjaro House',
    roomNumber: 'Room A-204',
    reportedBy: 'Madam Beatrice Akinyi',
    studentId: 'STU-2024-112',
    studentName: 'Faith Wanjiku',
    date: 'Oct 03, 2026',
    severity: 'Low',
    status: 'Under Investigation',
  },
  {
    id: 'INC-2026-T3-022',
    title: 'Broken Window Pane in Dormitory Washroom',
    category: 'Facility Damage',
    hostelBlock: 'Kenya House',
    roomNumber: 'Washroom 3',
    reportedBy: 'Maintenance Team',
    studentId: 'STU-2025-089',
    studentName: 'Samuel Ochieng',
    date: 'Oct 01, 2026',
    severity: 'Low',
    status: 'Resolved',
  },
  {
    id: 'INC-2026-T3-021',
    title: 'Missing Personal Locker Key & Scuffle over Property',
    category: 'Security / Theft',
    hostelBlock: 'Aberdare House',
    roomNumber: 'Room C-310',
    reportedBy: 'Captain John Mutua',
    studentId: 'STU-2024-201',
    studentName: 'Amina Mohamed',
    date: 'Sep 29, 2026',
    severity: 'High',
    status: 'Resolved',
  },
  {
    id: 'INC-2026-T3-020',
    title: 'Failure to Attend Evening Roll Call & Late Check-in',
    category: 'Attendance',
    hostelBlock: 'Elgon House',
    roomNumber: 'Room B-105',
    reportedBy: 'Mr. David Njoroge (Patron)',
    studentId: 'STU-2026-014',
    studentName: 'Kevin Mutua',
    date: 'Sep 27, 2026',
    severity: 'Medium',
    status: 'Open',
  },
];

/* ==========================================================================
   PAGE COMPONENT
   ========================================================================== */

export default function HostelIncidentsPage() {
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
          <span className="text-slate-900">Incident Reports</span>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Hostel Incidents & Disciplinary Logs
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Monitor boarding house safety, record student incidents, and track disciplinary follow-ups.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#006FBF]"
            >
              <i className="fa-solid fa-file-arrow-down mr-2 text-slate-400" />
              Export Report
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#006FBF] to-[#04B1D6] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-[#012E54] hover:to-[#006FBF] focus:outline-none focus:ring-2 focus:ring-[#006FBF] focus:ring-offset-2"
            >
              <i className="fa-solid fa-plus mr-2" />
              Log New Incident
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
            placeholder="Search incident title, student, or room..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            className="block rounded-xl border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF] sm:text-sm sm:leading-6"
            defaultValue="all-houses"
          >
            <option value="all-houses">All Houses</option>
            <option value="elgon">Elgon House</option>
            <option value="kilimanjaro">Kilimanjaro House</option>
            <option value="kenya">Kenya House</option>
            <option value="aberdare">Aberdare House</option>
          </select>

          <select
            className="block rounded-xl border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF] sm:text-sm sm:leading-6"
            defaultValue="all-severity"
          >
            <option value="all-severity">All Severities</option>
            <option value="high">High Severity</option>
            <option value="medium">Medium Severity</option>
            <option value="low">Low Severity</option>
          </select>

          <select
            className="block rounded-xl border-0 py-2.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF] sm:text-sm sm:leading-6"
            defaultValue="all-status"
          >
            <option value="all-status">All Statuses</option>
            <option value="open">Open</option>
            <option value="investigation">Under Investigation</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          INCIDENTS TABLE
          ---------------------------------------------------------------------- */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Incident Details
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Location / Room
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Involved Student
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Severity
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
              {INCIDENTS_RECORDS.map((incident) => (
                <tr key={incident.id} className="transition-colors hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                        <i className="fa-solid fa-triangle-exclamation text-sm" />
                      </div>
                      <div>
                        <span className="text-xs font-mono text-slate-400">{incident.id}</span>
                        <p className="text-sm font-semibold text-slate-900">
                          {incident.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Category: <span className="font-medium text-slate-700">{incident.category}</span> &bull; {incident.date}
                        </p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="whitespace-nowrap px-6 py-4">
                    <p className="text-sm font-medium text-slate-900">{incident.hostelBlock}</p>
                    <p className="text-xs text-slate-500">{incident.roomNumber}</p>
                  </td>
                  
                  <td className="whitespace-nowrap px-6 py-4">
                    <Link
                      href={`/dashboard/students/${incident.studentId}`}
                      className="text-sm font-semibold text-slate-900 hover:text-[#006FBF]"
                    >
                      {incident.studentName}
                    </Link>
                    <p className="text-xs text-slate-500">Reported by {incident.reportedBy}</p>
                  </td>
                  
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                        incident.severity === 'High'
                          ? 'bg-rose-50 text-rose-700 ring-rose-600/20'
                          : incident.severity === 'Medium'
                          ? 'bg-amber-50 text-amber-700 ring-amber-600/20'
                          : 'bg-slate-50 text-slate-700 ring-slate-500/20'
                      }`}
                    >
                      {incident.severity}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                        incident.status === 'Resolved'
                          ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                          : incident.status === 'Under Investigation'
                          ? 'bg-blue-50 text-blue-700 ring-blue-600/20'
                          : 'bg-amber-50 text-amber-700 ring-amber-600/20'
                      }`}
                    >
                      {incident.status === 'Resolved' && <i className="fa-solid fa-check mr-1.5 opacity-70" />}
                      {incident.status === 'Under Investigation' && <i className="fa-solid fa-magnifying-glass mr-1.5 opacity-70" />}
                      {incident.status === 'Open' && <i className="fa-solid fa-clock mr-1.5 opacity-70" />}
                      {incident.status}
                    </span>
                  </td>
                  
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-3">
                      <button className="text-slate-400 hover:text-[#006FBF]" title="View Details">
                        <i className="fa-solid fa-eye" />
                      </button>
                      <button className="text-slate-400 hover:text-[#006FBF]" title="Edit Log">
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
            Showing <span className="font-semibold">5</span> of <span className="font-semibold">26</span> incident logs
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