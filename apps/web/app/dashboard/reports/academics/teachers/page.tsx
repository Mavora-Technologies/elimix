// apps/web/app/dashboard/reports/academics/teachers/page.tsx

import Link from 'next/link';

/* ==========================================================================
   MOCK DATA
   ========================================================================== */

const STATS = [
  {
    title: 'Total Teaching Staff',
    value: '42',
    subtext: 'Across 4 Academic Departments',
    icon: 'fa-chalkboard-user',
    color: 'from-[#006FBF] to-[#04B1D6]',
  },
  {
    title: 'Average Subject Mean',
    value: '74.5%',
    subtext: 'B (Plain) overall average',
    icon: 'fa-chart-simple',
    color: 'from-indigo-600 to-indigo-500',
  },
  {
    title: 'Highest Value Added',
    value: '+8.4%',
    subtext: 'Mr. David Ochieng (Biology)',
    icon: 'fa-arrow-up-right-dots',
    color: 'from-emerald-600 to-emerald-500',
  },
  {
    title: '100% Pass Rate Classes',
    value: '12',
    subtext: 'Classes with no E grades',
    icon: 'fa-award',
    color: 'from-amber-500 to-amber-600',
  },
];

const TEACHER_PERFORMANCE = [
  {
    id: 'TR-042',
    name: 'Dr. James Mwangi',
    department: 'Mathematics & ICT',
    subject: 'Mathematics',
    classes: ['4 North', '4 South', '3 East'],
    totalStudents: 142,
    meanScore: '82.1%',
    meanGrade: 'A-',
    passRate: '94.5%',
    valueAdded: '+3.2%',
    status: 'exceptional', // exceptional, standard, needs-review
  },
  {
    id: 'TR-018',
    name: 'Mrs. Sarah Jenkins',
    department: 'Languages',
    subject: 'English',
    classes: ['4 East', '3 North', '2 South'],
    totalStudents: 135,
    meanScore: '76.8%',
    meanGrade: 'B+',
    passRate: '91.0%',
    valueAdded: '+1.5%',
    status: 'standard',
  },
  {
    id: 'TR-055',
    name: 'Mr. David Ochieng',
    department: 'Sciences',
    subject: 'Biology',
    classes: ['3 North', '3 South', '2 East', '2 West'],
    totalStudents: 180,
    meanScore: '78.4%',
    meanGrade: 'B+',
    passRate: '88.5%',
    valueAdded: '+8.4%',
    status: 'exceptional',
  },
  {
    id: 'TR-023',
    name: 'Ms. Alice Wanjiku',
    department: 'Humanities',
    subject: 'History',
    classes: ['4 North', '4 West', '1 East'],
    totalStudents: 125,
    meanScore: '74.2%',
    meanGrade: 'B',
    passRate: '85.2%',
    valueAdded: '-0.4%',
    status: 'standard',
  },
  {
    id: 'TR-061',
    name: 'Mr. Peter Kamau',
    department: 'Sciences',
    subject: 'Chemistry',
    classes: ['4 South', '4 East', '3 West'],
    totalStudents: 130,
    meanScore: '65.8%',
    meanGrade: 'C+',
    passRate: '72.4%',
    valueAdded: '-3.1%',
    status: 'needs-review',
  },
  {
    id: 'TR-034',
    name: 'Eng. Paul Njuguna',
    department: 'Sciences',
    subject: 'Physics',
    classes: ['4 North', '3 North', '2 North'],
    totalStudents: 110,
    meanScore: '71.5%',
    meanGrade: 'B-',
    passRate: '82.0%',
    valueAdded: '+2.1%',
    status: 'standard',
  },
  {
    id: 'TR-012',
    name: 'Mwalimu Hassan Juma',
    department: 'Languages',
    subject: 'Kiswahili',
    classes: ['4 West', '3 East', '2 South', '1 North'],
    totalStudents: 190,
    meanScore: '73.9%',
    meanGrade: 'B',
    passRate: '86.5%',
    valueAdded: '-1.2%',
    status: 'standard',
  },
  {
    id: 'TR-077',
    name: 'Mrs. Grace Njeri',
    department: 'Technicals',
    subject: 'Business Studies',
    classes: ['4 East', '3 South', '1 West'],
    totalStudents: 115,
    meanScore: '79.2%',
    meanGrade: 'A-',
    passRate: '92.0%',
    valueAdded: '+4.5%',
    status: 'exceptional',
  },
];

/* ==========================================================================
   PAGE COMPONENT
   ========================================================================== */

export default function TeacherPerformanceReportPage() {
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
          <span className="text-slate-900">Teacher Performance</span>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Teacher Performance Analysis
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Evaluate teaching effectiveness, class mean scores, and value-added metrics by educator.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#006FBF]"
            >
              <i className="fa-solid fa-file-excel mr-2 text-emerald-600" />
              Export Excel
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#006FBF] to-[#04B1D6] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-[#012E54] hover:to-[#006FBF] focus:outline-none focus:ring-2 focus:ring-[#006FBF] focus:ring-offset-2"
            >
              <i className="fa-solid fa-file-pdf mr-2" />
              Download Staff Report
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
              Term
            </label>
            <select
              className="rounded-xl border-0 py-2 pl-3 pr-8 text-xs font-medium text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF]"
              defaultValue="term3"
            >
              <option value="term3">Term 3</option>
              <option value="term2">Term 2</option>
              <option value="term1">Term 1</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Department
            </label>
            <select
              className="rounded-xl border-0 py-2 pl-3 pr-8 text-xs font-medium text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF]"
              defaultValue="all"
            >
              <option value="all">All Departments</option>
              <option value="math">Mathematics & ICT</option>
              <option value="sciences">Sciences</option>
              <option value="languages">Languages</option>
              <option value="humanities">Humanities & Technicals</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Sort By
            </label>
            <select
              className="rounded-xl border-0 py-2 pl-3 pr-8 text-xs font-medium text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF]"
              defaultValue="mean"
            >
              <option value="mean">Highest Mean Score</option>
              <option value="value">Value Added (High to Low)</option>
              <option value="pass">Pass Rate</option>
              <option value="alpha">Alphabetical (A-Z)</option>
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
            placeholder="Search teacher..."
          />
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          TEACHER PERFORMANCE TABLE
          ---------------------------------------------------------------------- */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-bold text-slate-900">Staff Performance Rankings</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Teacher
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Subject & Classes
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Students
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Mean Score
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Pass Rate
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Value Added
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
              {TEACHER_PERFORMANCE.map((teacher) => (
                <tr key={teacher.id} className="transition-colors hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-[#006FBF]">
                        {teacher.name.split(' ')[1]?.[0]}{teacher.name.split(' ')[2]?.[0] || teacher.name.split(' ')[1]?.[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{teacher.name}</p>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{teacher.id} • {teacher.department}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-700">{teacher.subject}</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {teacher.classes.map((c) => (
                        <span key={c} className="inline-flex rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                          {c}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-700">
                    {teacher.totalStudents}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{teacher.meanScore}</span>
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-[#006FBF]">
                        {teacher.meanGrade}
                      </span>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-700">
                    {teacher.passRate}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    {teacher.valueAdded.startsWith('+') ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                        <i className="fa-solid fa-caret-up text-sm" />
                        {teacher.valueAdded}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600">
                        <i className="fa-solid fa-caret-down text-sm" />
                        {teacher.valueAdded}
                      </span>
                    )}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    {teacher.status === 'exceptional' && (
                      <span className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                        Exceptional
                      </span>
                    )}
                    {teacher.status === 'standard' && (
                      <span className="inline-flex items-center rounded-md bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/20">
                        Standard
                      </span>
                    )}
                    {teacher.status === 'needs-review' && (
                      <span className="inline-flex items-center rounded-md bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-600/20">
                        Needs Review
                      </span>
                    )}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <button className="inline-flex items-center rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-all">
                      <i className="fa-solid fa-eye mr-1.5 text-slate-500" /> View Classes
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