// apps/web/app/dashboard/reports/academics/exams/page.tsx

import Link from 'next/link';

/* ==========================================================================
   MOCK DATA
   ========================================================================== */

const STATS = [
  {
    title: 'Overall Mean Score',
    value: '72.4%',
    subtext: 'B (Plain) average across all forms',
    icon: 'fa-chart-line',
    color: 'from-[#006FBF] to-[#04B1D6]',
  },
  {
    title: 'Total Candidates',
    value: '482',
    subtext: 'Students assessed in Term 3',
    icon: 'fa-user-graduate',
    color: 'from-indigo-600 to-indigo-500',
  },
  {
    title: 'Pass Rate (C+ & Above)',
    value: '88.6%',
    subtext: '+3.2% increase from Term 2',
    icon: 'fa-award',
    color: 'from-emerald-600 to-emerald-500',
  },
  {
    title: 'Top Performing Stream',
    value: 'Form 4 North',
    subtext: 'Mean Grade: B+ (9.84 points)',
    icon: 'fa-trophy',
    color: 'from-amber-500 to-amber-600',
  },
];

const GRADE_DISTRIBUTION = [
  { grade: 'A', count: 34, percentage: 7.1, color: 'bg-emerald-600' },
  { grade: 'A-', count: 58, percentage: 12.0, color: 'bg-emerald-500' },
  { grade: 'B+', count: 82, percentage: 17.0, color: 'bg-blue-600' },
  { grade: 'B', count: 96, percentage: 19.9, color: 'bg-blue-500' },
  { grade: 'B-', count: 74, percentage: 15.3, color: 'bg-cyan-500' },
  { grade: 'C+', count: 52, percentage: 10.8, color: 'bg-indigo-500' },
  { grade: 'C', count: 41, percentage: 8.5, color: 'bg-amber-500' },
  { grade: 'C- & Below', count: 45, percentage: 9.4, color: 'bg-rose-500' },
];

const EXAM_REPORTS = [
  {
    id: 'EXM-2026-T3-F4',
    title: 'Form 4 Mock Examinations (KCSE Simulation)',
    form: 'Form 4',
    candidates: 120,
    meanScore: '76.8%',
    meanGrade: 'B+',
    passRate: '92.5%',
    topStudent: 'Brian Kiprop (88.4%)',
    status: 'Finalized',
  },
  {
    id: 'EXM-2026-T3-F3',
    title: 'Form 3 End of Term 3 Assessment',
    form: 'Form 3',
    candidates: 118,
    meanScore: '71.2%',
    meanGrade: 'B',
    passRate: '87.2%',
    topStudent: 'Faith Cherotich (86.0%)',
    status: 'Finalized',
  },
  {
    id: 'EXM-2026-T3-F2',
    title: 'Form 2 End of Term 3 Assessment',
    form: 'Form 2',
    candidates: 124,
    meanScore: '69.5%',
    meanGrade: 'B-',
    passRate: '84.6%',
    topStudent: 'Kevin Otieno (84.2%)',
    status: 'Finalized',
  },
  {
    id: 'EXM-2026-T3-F1',
    title: 'Form 1 End of Term 3 Assessment',
    form: 'Form 1',
    candidates: 120,
    meanScore: '72.1%',
    meanGrade: 'B',
    passRate: '90.1%',
    topStudent: 'Amina Mohamed (89.5%)',
    status: 'Finalized',
  },
];

/* ==========================================================================
   PAGE COMPONENT
   ========================================================================== */

export default function ExamPerformanceReportPage() {
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
          <span className="text-slate-900">Exam Performance</span>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Exam Performance Reports
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              In-depth analysis of examination series, class mean grades, student rankings, and pass rates.
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
              Exam Series
            </label>
            <select
              className="rounded-xl border-0 py-2 pl-3 pr-8 text-xs font-medium text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF]"
              defaultValue="end-term"
            >
              <option value="end-term">End of Term Examinations</option>
              <option value="mid-term">Mid-Term Assessments</option>
              <option value="mock">KCSE Mock Exams</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Form / Grade
            </label>
            <select
              className="rounded-xl border-0 py-2 pl-3 pr-8 text-xs font-medium text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF]"
              defaultValue="all"
            >
              <option value="all">All Forms (Form 1 - 4)</option>
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
          GRADE DISTRIBUTION BREAKDOWN
          ---------------------------------------------------------------------- */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Overall Grade Distribution</h2>
            <p className="text-xs text-slate-500">Term 3 Examination performance breakdown by letter grade</p>
          </div>
          <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-[#006FBF] ring-1 ring-inset ring-blue-700/10">
            482 Students Evaluated
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {GRADE_DISTRIBUTION.map((item) => (
            <div key={item.grade} className="flex flex-col rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-center">
              <span className="text-xs font-bold text-slate-500">{item.grade}</span>
              <span className="mt-1 text-lg font-extrabold text-slate-900">{item.count}</span>
              <span className="text-[11px] text-slate-400">{item.percentage}%</span>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                <div className={`h-full ${item.color}`} style={{ width: `${item.percentage * 4}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          EXAM SERIES BREAKDOWN TABLE
          ---------------------------------------------------------------------- */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-bold text-slate-900">Form Performance Summary</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Exam Series & Form
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Candidates
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Mean Score
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Pass Rate
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Top Student
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
              {EXAM_REPORTS.map((report) => (
                <tr key={report.id} className="transition-colors hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#006FBF]">
                        <i className="fa-solid fa-pen-to-square text-sm" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{report.title}</p>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">{report.id}</p>
                      </div>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-700">
                    {report.candidates}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{report.meanScore}</span>
                      <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                        {report.meanGrade}
                      </span>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-emerald-600">
                    {report.passRate}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                    {report.topStudent}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                      <i className="fa-solid fa-check mr-1 text-[10px]" />
                      {report.status}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-3">
                      <button className="inline-flex items-center rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-all">
                        <i className="fa-solid fa-chart-column mr-1.5 text-slate-500" /> Details
                      </button>
                    </div>
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