// apps/web/app/dashboard/reports/students/attendance/page.tsx

import Link from 'next/link';

/* ==========================================================================
   MOCK DATA
   ========================================================================== */

const STATS = [
  {
    title: 'Average Attendance Rate',
    value: '94.2%',
    subtext: '+1.8% compared to last term',
    icon: 'fa-user-check',
    color: 'from-emerald-600 to-emerald-500',
  },
  {
    title: 'Present Today',
    value: '452 / 480',
    subtext: '94.2% of enrolled students',
    icon: 'fa-calendar-check',
    color: 'from-[#006FBF] to-[#04B1D6]',
  },
  {
    title: 'Unexcused Absences',
    value: '18 Students',
    subtext: '3.8% of daily population',
    icon: 'fa-user-xmark',
    color: 'from-rose-600 to-rose-500',
  },
  {
    title: 'Late Arrivals Today',
    value: '10 Students',
    subtext: '2.0% checked in after 8:00 AM',
    icon: 'fa-clock',
    color: 'from-amber-500 to-amber-600',
  },
];

const ATTENDANCE_BY_FORM = [
  { form: 'Form 1', rate: '96.5%', present: 120, absent: 5, late: 2, total: 125, color: 'bg-emerald-500' },
  { form: 'Form 2', rate: '92.8%', present: 109, absent: 9, late: 4, total: 118, color: 'bg-[#006FBF]' },
  { form: 'Form 3', rate: '95.1%', present: 116, absent: 6, late: 1, total: 122, color: 'bg-indigo-500' },
  { form: 'Form 4', rate: '93.0%', present: 107, absent: 8, late: 3, total: 115, color: 'bg-amber-500' },
];

const STREAM_ATTENDANCE = [
  {
    id: 'ATT-1N',
    stream: 'Form 1 North',
    classTeacher: 'Mr. David Ochieng',
    enrolled: 32,
    present: 31,
    absent: 1,
    late: 1,
    rate: '96.9%',
    status: 'Submitted',
    timeMarked: '08:15 AM',
  },
  {
    id: 'ATT-1S',
    stream: 'Form 1 South',
    classTeacher: 'Mrs. Sarah Jenkins',
    enrolled: 31,
    present: 29,
    absent: 2,
    late: 0,
    rate: '93.5%',
    status: 'Submitted',
    timeMarked: '08:10 AM',
  },
  {
    id: 'ATT-2N',
    stream: 'Form 2 North',
    classTeacher: 'Dr. James Mwangi',
    enrolled: 30,
    present: 27,
    absent: 3,
    late: 2,
    rate: '90.0%',
    status: 'Submitted',
    timeMarked: '08:25 AM',
  },
  {
    id: 'ATT-3E',
    stream: 'Form 3 East',
    classTeacher: 'Eng. Paul Njuguna',
    enrolled: 40,
    present: 39,
    absent: 1,
    late: 0,
    rate: '97.5%',
    status: 'Submitted',
    timeMarked: '08:05 AM',
  },
  {
    id: 'ATT-3W',
    stream: 'Form 3 West',
    classTeacher: 'Mrs. Grace Njeri',
    enrolled: 39,
    present: 36,
    absent: 3,
    late: 1,
    rate: '92.3%',
    status: 'Submitted',
    timeMarked: '08:20 AM',
  },
  {
    id: 'ATT-4S',
    stream: 'Form 4 South',
    classTeacher: 'Mwalimu Hassan Juma',
    enrolled: 28,
    present: 25,
    absent: 3,
    late: 1,
    rate: '89.3%',
    status: 'Pending Log',
    timeMarked: '-',
  },
];

/* ==========================================================================
   PAGE COMPONENT
   ========================================================================== */

export default function StudentAttendanceReportPage() {
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
          <span className="text-slate-900">Student Attendance</span>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Student Attendance Report
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Track daily roll call metrics, absentee patterns, punctuality, and stream registers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#006FBF]"
            >
              <i className="fa-solid fa-file-excel mr-2 text-emerald-600" />
              Export Register Log
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#006FBF] to-[#04B1D6] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:from-[#012E54] hover:to-[#006FBF] focus:outline-none focus:ring-2 focus:ring-[#006FBF] focus:ring-offset-2"
            >
              <i className="fa-solid fa-bell mr-2" />
              Notify Parents (Absentees)
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
              Select Date
            </label>
            <input
              type="date"
              defaultValue="2026-10-06"
              className="rounded-xl border-0 py-1.5 px-3 text-xs font-medium text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF]"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Academic Term
            </label>
            <select
              className="rounded-xl border-0 py-2 pl-3 pr-8 text-xs font-medium text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF]"
              defaultValue="term3"
            >
              <option value="term3">Term 3 (2026)</option>
              <option value="term2">Term 2 (2026)</option>
              <option value="term1">Term 1 (2026)</option>
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
              Register Status
            </label>
            <select
              className="rounded-xl border-0 py-2 pl-3 pr-8 text-xs font-medium text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[#006FBF]"
              defaultValue="all"
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="pending">Pending Log</option>
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
            placeholder="Search stream or teacher..."
          />
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          ATTENDANCE BY FORM SUMMARY CARDS
          ---------------------------------------------------------------------- */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Attendance Rate by Form</h2>
            <p className="text-xs text-slate-500">Daily presence percentage and headcounts per year level</p>
          </div>
          <span className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
            Overall 94.2% Attendance
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ATTENDANCE_BY_FORM.map((item) => (
            <div key={item.form} className="flex flex-col rounded-xl border border-slate-100 bg-slate-50/50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">{item.form}</span>
                <span className="text-sm font-extrabold text-[#006FBF]">{item.rate}</span>
              </div>

              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                <div className={`h-full ${item.color}`} style={{ width: item.rate }} />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-1 border-t border-slate-200/60 pt-3 text-center">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Present</p>
                  <p className="text-xs font-bold text-emerald-600">{item.present}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Absent</p>
                  <p className="text-xs font-bold text-rose-600">{item.absent}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Late</p>
                  <p className="text-xs font-bold text-amber-600">{item.late}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          STREAM ATTENDANCE REGISTER TABLE
          ---------------------------------------------------------------------- */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Class Attendance Registers</h2>
          <span className="text-xs font-medium text-slate-500">Date: 06 Oct 2026</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Stream / Class
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Class Teacher
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Present / Enrolled
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Absent / Late
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Rate
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status & Time
                </th>
                <th scope="col" className="relative px-6 py-4 text-right">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {STREAM_ATTENDANCE.map((stream) => (
                <tr key={stream.id} className="transition-colors hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-[#006FBF]">
                        {stream.stream.split(' ')[0][0]}{stream.stream.split(' ')[1][0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{stream.stream}</p>
                        <p className="text-xs text-slate-400 font-mono">{stream.id}</p>
                      </div>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-600">
                    {stream.classTeacher}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span className="font-bold text-slate-900">{stream.present}</span>
                    <span className="text-slate-500"> / {stream.enrolled}</span>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-3 text-xs">
                      <span className="font-semibold text-rose-600" title="Absent">
                        {stream.absent} Absent
                      </span>
                      <span className="text-slate-300">|</span>
                      <span className="font-semibold text-amber-600" title="Late">
                        {stream.late} Late
                      </span>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-slate-900">
                    {stream.rate}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    {stream.status === 'Submitted' ? (
                      <div>
                        <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                          <i className="fa-solid fa-check mr-1 text-[10px]" />
                          Submitted
                        </span>
                        <p className="text-[10px] text-slate-400 mt-1">{stream.timeMarked}</p>
                      </div>
                    ) : (
                      <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                        <i className="fa-solid fa-clock mr-1 text-[10px]" />
                        Pending
                      </span>
                    )}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <button className="inline-flex items-center rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-all">
                      <i className="fa-solid fa-clipboard-user mr-1.5 text-slate-500" /> View Register
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