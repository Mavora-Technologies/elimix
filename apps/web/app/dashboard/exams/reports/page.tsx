'use client';

import { useState } from 'react';
import Link from 'next/link';

// TypeScript interface for an Exam Report record
interface ExamReport {
  id: string;
  title: string;
  term: string;
  gradeLevel: string;
  totalStudents: number;
  averageGpa: number;
  passRate: number;
  status: 'Published' | 'Pending Approval' | 'Draft';
  generatedDate: string;
}

// Initial mock data for examination reports
const initialReports: ExamReport[] = [
  {
    id: 'REP-001',
    title: 'Term 3 Comprehensive Grade 9 Performance Summary',
    term: 'Term 3',
    gradeLevel: 'Grade 9',
    totalStudents: 95,
    averageGpa: 3.42,
    passRate: 94.7,
    status: 'Published',
    generatedDate: '2026-10-01',
  },
  {
    id: 'REP-002',
    title: 'Term 3 Mid-Term General Science Report',
    term: 'Term 3',
    gradeLevel: 'Grade 7 & 8',
    totalStudents: 180,
    averageGpa: 3.15,
    passRate: 91.1,
    status: 'Published',
    generatedDate: '2026-09-30',
  },
  {
    id: 'REP-003',
    title: 'Term 3 World History Assessment Analysis',
    term: 'Term 3',
    gradeLevel: 'Grade 8 South',
    totalStudents: 88,
    averageGpa: 2.89,
    passRate: 86.4,
    status: 'Pending Approval',
    generatedDate: '2026-10-02',
  },
  {
    id: 'REP-004',
    title: 'Term 2 Final Cumulative Transcripts',
    term: 'Term 2',
    gradeLevel: 'All Grades',
    totalStudents: 764,
    averageGpa: 3.35,
    passRate: 92.8,
    status: 'Published',
    generatedDate: '2026-07-15',
  },
  {
    id: 'REP-005',
    title: 'AP Calculus Advanced Diagnostic Report',
    term: 'Term 3',
    gradeLevel: 'Grade 10 North',
    totalStudents: 78,
    averageGpa: 3.68,
    passRate: 97.4,
    status: 'Draft',
    generatedDate: '2026-10-02',
  },
];

export default function ExamReportsPage() {
  const [reports, setReports] = useState<ExamReport[]>(initialReports);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [termFilter, setTermFilter] = useState('All');
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Filter logic based on search, status, and term
  const filteredReports = reports.filter((rep) => {
    const matchesSearch =
      rep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.gradeLevel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || rep.status === statusFilter;
    const matchesTerm = termFilter === 'All' || rep.term === termFilter;

    return matchesSearch && matchesStatus && matchesTerm;
  });

  // Helper for status badge styling
  const getStatusBadge = (status: ExamReport['status']) => {
    switch (status) {
      case 'Published':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending Approval':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Draft':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessBanner('New examination analytics report successfully generated.');
    setGenerateModalOpen(false);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Examination Reports & Analytics
          </h1>
          <p className="text-sm text-slate-500">
            Generate and review comprehensive academic report cards, GPA summaries, and student performance analytics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/exams"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <i className="fa-solid fa-file-lines mr-2 text-xs text-blue-600"></i> All Exams
          </Link>
          <button
            onClick={() => setGenerateModalOpen(true)}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
          >
            <i className="fa-solid fa-plus mr-2 text-xs"></i> Generate Report
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successBanner && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 text-sm flex items-center justify-between shadow-sm">
          <div className="flex items-center">
            <i className="fa-solid fa-circle-check text-emerald-600 mr-2 text-base"></i>
            <span>{successBanner}</span>
          </div>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Reports</p>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <i className="fa-solid fa-chart-bar text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">28</p>
          <span className="text-xs text-emerald-600 font-medium"><i className="fa-solid fa-arrow-trend-up mr-1"></i> Term 3 Cycle</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Campus Average GPA</p>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <i className="fa-solid fa-award text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">3.38 / 4.0</p>
          <span className="text-xs text-emerald-600 font-medium">+0.12 vs previous term</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overall Pass Rate</p>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <i className="fa-solid fa-circle-check text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">92.4%</p>
          <span className="text-xs text-purple-600 font-medium">Stable across streams</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Approvals</p>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <i className="fa-solid fa-clock text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">2</p>
          <span className="text-xs text-amber-600 font-medium">Awaiting principal review</span>
        </div>
      </div>

      {/* Toolbar: Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-xs text-slate-400"></i>
          <input
            type="text"
            placeholder="Search report title, grade level, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Filters Group */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Term Filter */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <span>Term:</span>
            <select
              value={termFilter}
              onChange={(e) => setTermFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Terms</option>
              <option value="Term 3">Term 3</option>
              <option value="Term 2">Term 2</option>
              <option value="Term 1">Term 1</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="Published">Published</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Data Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Report Title / ID</th>
                <th className="py-3 px-4">Term & Grade</th>
                <th className="py-3 px-4">Students</th>
                <th className="py-3 px-4">Average GPA</th>
                <th className="py-3 px-4">Pass Rate</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredReports.length > 0 ? (
                filteredReports.map((rep) => (
                  <tr key={rep.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{rep.title}</div>
                      <div className="text-xs text-slate-500 font-mono">Generated: {rep.generatedDate} • {rep.id}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-900 font-medium text-xs">{rep.term}</div>
                      <div className="text-xs text-slate-500">{rep.gradeLevel}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-mono text-xs font-medium">{rep.totalStudents} students</td>
                    <td className="py-3.5 px-4 text-slate-800 font-mono text-xs font-bold">{rep.averageGpa} / 4.0</td>
                    <td className="py-3.5 px-4 text-emerald-700 font-mono text-xs font-semibold">{rep.passRate}%</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(rep.status)}`}>
                        {rep.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-xs px-2 py-1 rounded hover:bg-blue-50 transition-colors">
                        View PDF
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-sm">
                    No matching examination reports found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Report Modal */}
      {generateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <h3 className="font-bold text-slate-900 text-base">Generate Examination Report</h3>
              <button
                onClick={() => setGenerateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleGenerateReport} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Report Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Term 3 Comprehensive Grade Summary"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Academic Term
                  </label>
                  <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500">
                    <option value="Term 3">Term 3</option>
                    <option value="Term 2">Term 2</option>
                    <option value="Term 1">Term 1</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Grade Level / Stream
                  </label>
                  <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500">
                    <option value="All Grades">All Grades</option>
                    <option value="Grade 7">Grade 7</option>
                    <option value="Grade 8">Grade 8</option>
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 10">Grade 10</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Include Sections
                </label>
                <div className="space-y-2 pt-1 text-sm text-slate-700">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <span>GPA & Cumulative Score Distribution</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <span>Subject-wise Performance Breakdown</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <span>Attendance & Participation Correlation</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setGenerateModalOpen(false)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
                >
                  Generate Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}