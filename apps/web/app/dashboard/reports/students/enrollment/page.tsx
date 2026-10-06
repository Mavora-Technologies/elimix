// apps/web/app/dashboard/reports/students/enrollment/page.tsx

import Link from 'next/link';

/* ==========================================================================
   MOCK DATA
   ========================================================================== */

const STATS = [
  {
    title: 'Total Enrolled Students',
    value: '480',
    subtext: 'Across 16 streams / classes',
    icon: 'fa-users',
    color: 'from-[#006FBF] to-[#04B1D6]',
  },
  {
    title: 'New Admissions',
    value: '24',
    subtext: 'Joined in current academic year',
    icon: 'fa-user-plus',
    color: 'from-emerald-600 to-emerald-500',
  },
  {
    title: 'Gender Distribution',
    value: '52% M / 48% F',
    subtext: '250 Boys, 230 Girls',
    icon: 'fa-venus-mars',
    color: 'from-indigo-600 to-indigo-500',
  },
  {
    title: 'Average Class Size',
    value: '30',
    subtext: 'Standard capacity is 40',
    icon: 'fa-chair',
    color: 'from-amber-500 to-amber-600',
  },
];

const ENROLLMENT_BY_FORM = [
  { form: 'Form 1', enrolled: 125, capacity: 160, boys: 65, girls: 60, percentage: 78.1, color: 'bg-emerald-500' },
  { form: 'Form 2', enrolled: 118, capacity: 160, boys: 62, girls: 56, percentage: 73.7, color: 'bg-[#006FBF]' },
  { form: 'Form 3', enrolled: 122, capacity: 160, boys: 63, girls: 59, percentage: 76.2, color: 'bg-indigo-500' },
  { form: 'Form 4', enrolled: 115, capacity: 160, boys: 60, girls: 55, percentage: 71.8, color: 'bg-amber-500' },
];

const CLASS_ENROLLMENT = [
  {
    id: 'CLS-1N',
    className: 'Form 1 North',
    classTeacher: 'Mr. David Ochieng',
    capacity: 40,
    enrolled: 32,
    boys: 17,
    girls: 15,
    vacancies: 8,
    status: 'optimal', // optimal, full, under-enrolled
  },
  {
    id: 'CLS-1S',
    className: 'Form 1 South',
    classTeacher: 'Mrs. Sarah Jenkins',
    capacity: 40,
    enrolled: 31,
    boys: 16,
    girls: 15,
    vacancies: 9,
    status: 'optimal',
  },
  {
    id: 'CLS-1E',
    className: 'Form 1 East',
    classTeacher: 'Ms. Alice Wanjiku',
    capacity: 40,
    enrolled: 33,
    boys: 17,
    girls: 16,
    vacancies: 7,
    status: 'optimal',
  },
  {
    id: 'CLS-2N',
    className: 'Form 2 North',
    classTeacher: 'Dr. James Mwangi',
    capacity: 40,
    enrolled: 30,
    boys: 15,
    girls: 15,
    vacancies: 10,
    status: 'under-enrolled',
  },
  {
    id: 'CLS-3E',
    className: 'Form 3 East',
    classTeacher: 'Eng. Paul Njuguna',
    capacity: 40,
    enrolled: 40,
    boys: 21,
    girls: 19,
    vacancies: 0,
    status: 'full',
  },
  {
    id: 'CLS-3W',
    className: 'Form 3 West',
    classTeacher: 'Mrs. Grace Njeri',
    capacity: 40,
    enrolled: 39,
    boys: 20,
    girls: 19,
    vacancies: 1,
    status: 'full',
  },
  {
    id: 'CLS-4S',
    className: 'Form 4 South',
    classTeacher: 'Mwalimu Hassan Juma',
    capacity: 40,
    enrolled: 28,
    boys: 15,
    girls: 13,
    vacancies: 12,
    status: 'under-enrolled',
  },
];

/* ==========================================================================
   PAGE COMPONENT
   ========================================================================== */

export default function StudentEnrollmentReportPage() {
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
          <Link href="/dashboard/reports" className="hover:text-[#006FBF]">
            Reports & Analytics
          </Link>
          <i className="fa-solid fa-chevron-right text-[10px] text-slate-400" />
          <span className="text-slate-900">Student Enrollment</span>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Student Enrollment Report
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Analyze student population trends, class capacities, and admission statistics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#006FBF]"
            >
              <i className="fa-solid fa-file-excel mr-2 text-emerald-600" />
              Export Roster
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#006FBF] to-[#04B1D6] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-[#012E54] hover:to-[#006FBF] focus:outline-none focus:ring-2 focus:ring-[#006FBF] focus:ring-offset-2"
            >
              <i className="fa-solid fa-file-pdf mr-2" />
              Download Summary PDF
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
          FILTERS BAR
          ---------------------------------------------------------------------- */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Academic Year
            </label>
            <select
              className="rounded-xl border-0 py-2 pl-3 pr-8 text-xs font-medium text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF]"
              defaultValue="2026"
            >
              <option value="2026">2026 Academic Year</option>
              <option value="2025">2025 Academic Year</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Form / Year Level
            </label>
            <select
              className="rounded-xl border-0 py-2 pl-3 pr-8 text-xs font-medium text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF]"
              defaultValue="all"
            >
              <option value="all">All Forms</option>
              <option value="f1">Form 1</option>
              <option value="f2">Form 2</option>
              <option value="f3">Form 3</option>
              <option value="f4">Form 4</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Capacity Status
            </label>
            <select
              className="rounded-xl border-0 py-2 pl-3 pr-8 text-xs font-medium text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF]"
              defaultValue="all"
            >
              <option value="all">All Capacities</option>
              <option value="full">Full / Over-Enrolled</option>
              <option value="optimal">Optimal</option>
              <option value="under">Under-Enrolled</option>
            </select>
          </div>
        </div>

        <div className="relative w-full lg:w-64">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <i className="fa-solid fa-search text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-xl border-0 py-2 pl-10 pr-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-[#006FBF]"
            placeholder="Search stream or class teacher..."
          />
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          ENROLLMENT BY FORM BREAKDOWN
          ---------------------------------------------------------------------- */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Enrollment by Form</h2>
            <p className="text-xs text-slate-500">Form capacity utilization and gender breakdown</p>
          </div>
          <span className="inline-flex items-center rounded-md bg-[#006FBF]/10 px-2.5 py-1 text-xs font-medium text-[#006FBF] ring-1 ring-inset ring-[#006FBF]/20">
            Total Capacity: 640
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ENROLLMENT_BY_FORM.map((item) => (
            <div key={item.form} className="flex flex-col rounded-xl border border-slate-100 bg-slate-50/50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">{item.form}</span>
                <span className="text-[10px] font-bold text-slate-400">{item.enrolled} / {item.capacity}</span>
              </div>
              
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500 mb-1.5">
                <span>Capacity Utilization</span>
                <span className="font-semibold text-slate-700">{item.percentage}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                <div className={`h-full ${item.color}`} style={{ width: `${item.percentage}%` }} />
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-200/60 pt-3">
                <div className="flex items-center gap-1.5 text-xs">
                  <i className="fa-solid fa-mars text-indigo-500" />
                  <span className="font-semibold text-slate-700">{item.boys} Boys</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <i className="fa-solid fa-venus text-rose-500" />
                  <span className="font-semibold text-slate-700">{item.girls} Girls</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          CLASS-LEVEL ENROLLMENT TABLE
          ---------------------------------------------------------------------- */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Class & Stream Details</h2>
          <span className="text-xs font-medium text-slate-500">Showing 16 streams</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Class / Stream
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Class Teacher
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Enrolled / Cap
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Gender Split
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Vacancies
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
              {CLASS_ENROLLMENT.map((cls) => (
                <tr key={cls.id} className="transition-colors hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-[#006FBF]">
                        {cls.className.split(' ')[0][0]}{cls.className.split(' ')[1][0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{cls.className}</p>
                        <p className="text-xs text-slate-400 font-mono">{cls.id}</p>
                      </div>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-600">
                    {cls.classTeacher}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span className="font-bold text-slate-900">{cls.enrolled}</span>
                    <span className="text-slate-500"> / {cls.capacity}</span>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-3 text-xs">
                      <span className="font-semibold text-indigo-600" title="Boys">
                        B: {cls.boys}
                      </span>
                      <span className="text-slate-300">|</span>
                      <span className="font-semibold text-rose-600" title="Girls">
                        G: {cls.girls}
                      </span>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`text-sm font-bold ${cls.vacancies === 0 ? 'text-slate-400' : 'text-emerald-600'}`}>
                      {cls.vacancies} open
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    {cls.status === 'optimal' && (
                      <span className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                        Optimal
                      </span>
                    )}
                    {cls.status === 'full' && (
                      <span className="inline-flex items-center rounded-md bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                        Full
                      </span>
                    )}
                    {cls.status === 'under-enrolled' && (
                      <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/20">
                        Under-enrolled
                      </span>
                    )}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <button className="inline-flex items-center rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-all">
                      <i className="fa-solid fa-eye mr-1.5 text-slate-500" /> View Roster
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}