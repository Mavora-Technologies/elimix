// apps/web/app/dashboard/reports/academics/subjects/page.tsx

import Link from 'next/link';

/* ==========================================================================
   MOCK DATA
   ========================================================================== */

const STATS = [
  {
    title: 'Top Performing Subject',
    value: 'Mathematics',
    subtext: 'Mean Score: 81.4% (Grade A-)',
    icon: 'fa-calculator',
    color: 'from-[#006FBF] to-[#04B1D6]',
  },
  {
    title: 'Most Improved',
    value: 'Biology',
    subtext: '+6.8% increase compared to Term 2',
    icon: 'fa-arrow-trend-up',
    color: 'from-emerald-600 to-emerald-500',
  },
  {
    title: 'Average Subject Pass Rate',
    value: '86.2%',
    subtext: 'Based on C+ and above across all subjects',
    icon: 'fa-chart-pie',
    color: 'from-indigo-600 to-indigo-500',
  },
  {
    title: 'Total Subjects Assessed',
    value: '14 Subjects',
    subtext: '4 Academic Departments',
    icon: 'fa-book-open',
    color: 'from-amber-500 to-amber-600',
  },
];

const DEPARTMENT_SUMMARY = [
  { name: 'Mathematics & ICT', meanScore: '78.5%', topSubject: 'Mathematics', passRate: '91.2%' },
  { name: 'Sciences', meanScore: '71.8%', topSubject: 'Biology', passRate: '84.0%' },
  { name: 'Languages', meanScore: '74.2%', topSubject: 'English', passRate: '88.5%' },
  { name: 'Humanities & Technicals', meanScore: '76.0%', topSubject: 'History & Govt', passRate: '89.1%' },
];

const SUBJECT_PERFORMANCE = [
  {
    code: 'MAT-101',
    name: 'Mathematics',
    department: 'Mathematics & ICT',
    enrolled: 482,
    meanScore: '81.4%',
    meanGrade: 'A-',
    passRate: '92.1%',
    leadTeacher: 'Dr. James Mwangi',
    trend: 'up',
    trendValue: '+2.4%',
  },
  {
    code: 'ENG-101',
    name: 'English Language & Lit',
    department: 'Languages',
    enrolled: 482,
    meanScore: '75.6%',
    meanGrade: 'B+',
    passRate: '89.4%',
    leadTeacher: 'Mrs. Sarah Jenkins',
    trend: 'up',
    trendValue: '+1.1%',
  },
  {
    code: 'BIO-102',
    name: 'Biology',
    department: 'Sciences',
    enrolled: 360,
    meanScore: '74.8%',
    meanGrade: 'B+',
    passRate: '87.5%',
    leadTeacher: 'Mr. David Ochieng',
    trend: 'up',
    trendValue: '+6.8%',
  },
  {
    code: 'HIS-101',
    name: 'History & Government',
    department: 'Humanities',
    enrolled: 310,
    meanScore: '76.2%',
    meanGrade: 'B+',
    passRate: '90.2%',
    leadTeacher: 'Ms. Alice Wanjiku',
    trend: 'stable',
    trendValue: '0.0%',
  },
  {
    code: 'CHE-102',
    name: 'Chemistry',
    department: 'Sciences',
    enrolled: 360,
    meanScore: '68.3%',
    meanGrade: 'B-',
    passRate: '79.6%',
    leadTeacher: 'Mr. Peter Kamau',
    trend: 'down',
    trendValue: '-1.5%',
  },
  {
    code: 'PHY-103',
    name: 'Physics',
    department: 'Sciences',
    enrolled: 240,
    meanScore: '72.1%',
    meanGrade: 'B',
    passRate: '85.0%',
    leadTeacher: 'Eng. Paul Njuguna',
    trend: 'up',
    trendValue: '+3.2%',
  },
  {
    code: 'KIS-101',
    name: 'Kiswahili',
    department: 'Languages',
    enrolled: 482,
    meanScore: '72.8%',
    meanGrade: 'B',
    passRate: '87.6%',
    leadTeacher: 'Mwalimu Hassan Juma',
    trend: 'down',
    trendValue: '-0.8%',
  },
  {
    code: 'BST-101',
    name: 'Business Studies',
    department: 'Technicals',
    enrolled: 210,
    meanScore: '75.9%',
    meanGrade: 'B+',
    passRate: '88.1%',
    leadTeacher: 'Mrs. Grace Njeri',
    trend: 'up',
    trendValue: '+1.9%',
  },
];

/* ==========================================================================
   PAGE COMPONENT
   ========================================================================== */

export default function SubjectAnalysisReportPage() {
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
          <span className="text-slate-900">Subject Analysis</span>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Subject Performance Analysis
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Comparative insights across subject disciplines, department averages, and score trends.
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
              Subject Matrix PDF
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
              Form / Class
            </label>
            <select
              className="rounded-xl border-0 py-2 pl-3 pr-8 text-xs font-medium text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF]"
              defaultValue="all"
            >
              <option value="all">All Forms (Combined)</option>
              <option value="f4">Form 4</option>
              <option value="f3">Form 3</option>
              <option value="f2">Form 2</option>
              <option value="f1">Form 1</option>
            </select>
          </div>
        </div>

        <button className="inline-flex items-center justify-center rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors">
          <i className="fa-solid fa-arrows-rotate mr-2 text-slate-500" /> Reset Filters
        </button>
      </div>

      {/* ----------------------------------------------------------------------
          DEPARTMENTAL PERFORMANCE SUMMARY CARDS
          ---------------------------------------------------------------------- */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">Department Overview</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DEPARTMENT_SUMMARY.map((dept) => (
            <div
              key={dept.name}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#006FBF] uppercase tracking-wide">
                    {dept.name}
                  </span>
                  <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                    {dept.passRate} Pass
                  </span>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-slate-900">{dept.meanScore}</span>
                  <span className="text-xs text-slate-500">Mean Score</span>
                </div>
              </div>
              <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
                Top Subject: <span className="font-semibold text-slate-800">{dept.topSubject}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          SUBJECT PERFORMANCE TABLE
          ---------------------------------------------------------------------- */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-bold text-slate-900">Subject Breakdown</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Subject & Code
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Department
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Enrolled Students
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Mean Score & Grade
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Pass Rate
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Head of Subject
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Trend (vs T2)
                </th>
                <th scope="col" className="relative px-6 py-4 text-right">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {SUBJECT_PERFORMANCE.map((subject) => (
                <tr key={subject.code} className="transition-colors hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 font-mono text-xs font-bold text-[#006FBF]">
                        {subject.code.split('-')[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{subject.name}</p>
                        <p className="text-xs text-slate-400 font-mono">{subject.code}</p>
                      </div>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-xs font-medium text-slate-600">
                    {subject.department}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-700">
                    {subject.enrolled}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{subject.meanScore}</span>
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-[#006FBF]">
                        {subject.meanGrade}
                      </span>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-emerald-600">
                    {subject.passRate}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-xs font-medium text-slate-700">
                    {subject.leadTeacher}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    {subject.trend === 'up' && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                        <i className="fa-solid fa-arrow-trend-up text-xs" />
                        {subject.trendValue}
                      </span>
                    )}
                    {subject.trend === 'down' && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600">
                        <i className="fa-solid fa-arrow-trend-down text-xs" />
                        {subject.trendValue}
                      </span>
                    )}
                    {subject.trend === 'stable' && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-400">
                        <i className="fa-solid fa-minus text-xs" />
                        {subject.trendValue}
                      </span>
                    )}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <button className="inline-flex items-center rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-all">
                      <i className="fa-solid fa-chart-line mr-1.5 text-slate-500" /> Topic Analysis
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