// apps/web/app/dashboard/e-learning/progress/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

const BRAND = {
  navy: '#012E54',
  blue: '#006FBF',
  brightBlue: '#0088CE',
  cyan: '#04B1D6',
  teal: '#0199B9',
};

// Dynamic API URL for Local/Production compatibility
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// TypeScript interface for a Student Learning Progress record
interface StudentProgress {
  id: string;
  studentId: string;
  studentName: string;
  courseTitle: string;
  subject: string;
  modulesCompleted: number;
  totalModules: number;
  completionPercentage: number;
  quizAverage: string;
  timeSpentHours: number;
  status: 'On Track' | 'Completed' | 'At Risk' | 'Behind';
}

// Initial mock data for student progress
const initialProgress: StudentProgress[] = [
  {
    id: 'PRG-001',
    studentId: 'STU-2026-014',
    studentName: 'Oliver Twist',
    courseTitle: 'Advanced Algebra II & Quadratic Functions',
    subject: 'Algebra II',
    modulesCompleted: 8,
    totalModules: 8,
    completionPercentage: 100,
    quizAverage: '91.2%',
    timeSpentHours: 24.5,
    status: 'Completed',
  },
  {
    id: 'PRG-002',
    studentId: 'STU-2026-022',
    studentName: 'Charlotte Brontë',
    courseTitle: 'Cellular Biology & Genetics Masterclass',
    subject: 'General Science',
    modulesCompleted: 5,
    totalModules: 6,
    completionPercentage: 83,
    quizAverage: '95.4%',
    timeSpentHours: 19.0,
    status: 'On Track',
  },
  {
    id: 'PRG-003',
    studentId: 'STU-2026-045',
    studentName: 'Arthur Conan Doyle',
    courseTitle: 'World History: The Industrial Revolution',
    subject: 'World History',
    modulesCompleted: 4,
    totalModules: 7,
    completionPercentage: 57,
    quizAverage: '72.1%',
    timeSpentHours: 11.5,
    status: 'Behind',
  },
  {
    id: 'PRG-004',
    studentId: 'STU-2026-089',
    studentName: 'Jane Austen',
    courseTitle: 'Shakespearean Literature & Poetry Analysis',
    subject: 'English Literature',
    modulesCompleted: 1,
    totalModules: 5,
    completionPercentage: 20,
    quizAverage: '54.0%',
    timeSpentHours: 4.2,
    status: 'At Risk',
  },
  {
    id: 'PRG-005',
    studentId: 'STU-2026-102',
    studentName: 'H.G. Wells',
    courseTitle: 'AP Calculus Vector & Derivative Calculus',
    subject: 'Calculus',
    modulesCompleted: 9,
    totalModules: 10,
    completionPercentage: 90,
    quizAverage: '88.9%',
    timeSpentHours: 32.0,
    status: 'On Track',
  },
];

export default function ELearningProgressPage() {
  const [progressList, setProgressList] = useState<StudentProgress[]>(initialProgress);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Filter logic based on search, status, and subject
  const filteredProgress = progressList.filter((item) => {
    const matchesSearch =
      item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesSubject = subjectFilter === 'All' || item.subject === subjectFilter;

    return matchesSearch && matchesStatus && matchesSubject;
  });

  // Helper for status badge styling
  const getStatusBadge = (status: StudentProgress['status']) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'On Track':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Behind':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'At Risk':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const handleExportReport = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessBanner('Student learning progress analytics successfully exported.');
    setExportModalOpen(false);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  return (
    <div className="space-y-6 pb-12 w-full max-w-full overflow-hidden">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            E-Learning Student Progress & Analytics
          </h1>
          <p className="text-sm text-slate-500">
            Monitor student completion rates, module progression, quiz performance, and active study hours.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/e-learning/courses"
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <i className="fa-solid fa-laptop-code mr-2 text-xs text-[#006FBF]"></i> All Courses
          </Link>
          <button
            onClick={() => setExportModalOpen(true)}
            className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:opacity-95"
            style={{
              background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})`,
            }}
          >
            <i className="fa-solid fa-file-arrow-down mr-2 text-xs"></i> Export Progress
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
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tracked Learners</p>
            <div className="rounded-xl bg-[#006FBF]/10 p-2 text-[#006FBF]">
              <i className="fa-solid fa-user-graduate text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">718</p>
          <span className="text-xs text-emerald-600 font-medium"><i className="fa-solid fa-arrow-trend-up mr-1"></i> Active in LMS</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Course Completion</p>
            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
              <i className="fa-solid fa-chart-line text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">78.4%</p>
          <span className="text-xs text-emerald-600 font-medium">+4.2% vs last month</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Certified Completed</p>
            <div className="rounded-xl bg-purple-50 p-2 text-purple-600">
              <i className="fa-solid fa-award text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">324</p>
          <span className="text-xs text-purple-600 font-medium">Finished all modules</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">At-Risk Learners</p>
            <div className="rounded-xl bg-rose-50 p-2 text-rose-600">
              <i className="fa-solid fa-triangle-exclamation text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">22</p>
          <span className="text-xs text-rose-600 font-medium">Requiring faculty intervention</span>
        </div>
      </div>

      {/* Toolbar: Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-xs text-slate-400"></i>
          <input
            type="text"
            placeholder="Search student name, ID, course, or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#006FBF]"
          />
        </div>

        {/* Filters Group */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Subject Filter */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <span>Subject:</span>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#006FBF]"
            >
              <option value="All">All Subjects</option>
              <option value="Algebra II">Algebra II</option>
              <option value="General Science">General Science</option>
              <option value="World History">World History</option>
              <option value="English Literature">English Literature</option>
              <option value="Calculus">Calculus</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#006FBF]"
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="On Track">On Track</option>
              <option value="Behind">Behind</option>
              <option value="At Risk">At Risk</option>
            </select>
          </div>
        </div>
      </div>

      {/* Progress Data Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Student Name / ID</th>
                <th className="py-3 px-4">Enrolled Course</th>
                <th className="py-3 px-4">Modules Progress</th>
                <th className="py-3 px-4">Quiz Avg</th>
                <th className="py-3 px-4">Study Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredProgress.length > 0 ? (
                filteredProgress.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{item.studentName}</div>
                      <div className="text-xs text-slate-500 font-mono">{item.studentId}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-900 font-medium text-xs">{item.courseTitle}</div>
                      <div className="text-xs text-slate-500">{item.subject}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-between text-xs font-mono mb-1">
                        <span className="text-slate-700">{item.modulesCompleted} / {item.totalModules} modules</span>
                        <span className="font-bold text-slate-900">{item.completionPercentage}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full ${
                            item.completionPercentage === 100
                              ? 'bg-emerald-500'
                              : item.completionPercentage > 50
                              ? 'bg-[#006FBF]'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${item.completionPercentage}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-800 font-mono text-xs font-bold">{item.quizAverage}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-xs">{item.timeSpentHours} hrs</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button className="text-[#006FBF] hover:text-[#012E54] font-medium text-xs px-2.5 py-1 rounded-lg hover:bg-blue-50 transition-colors">
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-sm">
                    No matching student progress records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Progress Modal */}
      {exportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <h3 className="font-bold text-slate-900 text-base">Export Progress Analytics</h3>
              <button
                onClick={() => setExportModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleExportReport} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Export Format
                </label>
                <select className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#006FBF]">
                  <option value="CSV">CSV Spreadsheet (.csv)</option>
                  <option value="PDF">Comprehensive PDF Report (.pdf)</option>
                  <option value="Excel">Microsoft Excel (.xlsx)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Subject Scope
                </label>
                <select className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#006FBF]">
                  <option value="All">All Subjects & Courses</option>
                  <option value="Algebra II">Algebra II</option>
                  <option value="General Science">General Science</option>
                  <option value="World History">World History</option>
                  <option value="English Literature">English Literature</option>
                  <option value="Calculus">Calculus</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Include Metrics
                </label>
                <div className="space-y-2 pt-1 text-sm text-slate-700">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#006FBF] focus:ring-[#006FBF]" />
                    <span>Module Completion Percentage</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#006FBF] focus:ring-[#006FBF]" />
                    <span>Quiz Scores & Averages</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#006FBF] focus:ring-[#006FBF]" />
                    <span>Active Study Time (Hours)</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setExportModalOpen(false)}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-95"
                  style={{
                    background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})`,
                  }}
                >
                  Download Export
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}