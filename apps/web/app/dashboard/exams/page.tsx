'use client';

import { useState } from 'react';
import Link from 'next/link';

// TypeScript interface for an Examination Record
interface ExamRecord {
  id: string;
  title: string;
  subject: string;
  gradeLevel: string;
  examDate: string;
  totalMarks: number;
  status: 'Upcoming' | 'Ongoing' | 'Grading' | 'Completed';
}

// Initial mock data for examinations
const initialExams: ExamRecord[] = [
  {
    id: 'EXM-001',
    title: 'Term 3 Mid-Term Mathematics Assessment',
    subject: 'Algebra II & Calculus',
    gradeLevel: 'Grade 9 & 10',
    examDate: '2026-10-10 09:00 AM',
    totalMarks: 100,
    status: 'Upcoming',
  },
  {
    id: 'EXM-002',
    title: 'General Science Practical & Theory Quiz',
    subject: 'General Science',
    gradeLevel: 'Grade 7 & 8',
    examDate: '2026-10-02 10:30 AM',
    totalMarks: 50,
    status: 'Ongoing',
  },
  {
    id: 'EXM-003',
    title: 'World History Mid-Term Examination',
    subject: 'World History',
    gradeLevel: 'Grade 8 South',
    examDate: '2026-09-28 08:00 AM',
    totalMarks: 100,
    status: 'Grading',
  },
  {
    id: 'EXM-004',
    title: 'English Literature Essay Examination',
    subject: 'English Literature',
    gradeLevel: 'Grade 9 East',
    examDate: '2026-09-20 09:00 AM',
    totalMarks: 75,
    status: 'Completed',
  },
  {
    id: 'EXM-005',
    title: 'Physics Mechanics Final Test',
    subject: 'Physics',
    gradeLevel: 'Grade 10 North',
    examDate: '2026-10-18 01:00 PM',
    totalMarks: 100,
    status: 'Upcoming',
  },
];

export default function ExamsPage() {
  const [exams, setExams] = useState<ExamRecord[]>(initialExams);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [gradeFilter, setGradeFilter] = useState('All');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Filter logic based on search, status, and grade level
  const filteredExams = exams.filter((exam) => {
    const matchesSearch =
      exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.gradeLevel.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || exam.status === statusFilter;
    const matchesGrade = gradeFilter === 'All' || exam.gradeLevel.includes(gradeFilter);

    return matchesSearch && matchesStatus && matchesGrade;
  });

  // Helper for status badge styling
  const getStatusBadge = (status: ExamRecord['status']) => {
    switch (status) {
      case 'Upcoming':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Ongoing':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Grading':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Completed':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessBanner('New examination successfully scheduled and published.');
    setCreateModalOpen(false);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Examinations & Assessment Management
          </h1>
          <p className="text-sm text-slate-500">
            Schedule exams, monitor grading progress, publish test timetables, and analyze score distributions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/academics"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <i className="fa-solid fa-book-open mr-2 text-xs text-blue-600"></i> Academics Overview
          </Link>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
          >
            <i className="fa-solid fa-plus mr-2 text-xs"></i> Schedule Exam
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
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Scheduled Exams</p>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <i className="fa-solid fa-file-lines text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">14</p>
          <span className="text-xs text-emerald-600 font-medium"><i className="fa-solid fa-arrow-trend-up mr-1"></i> Term 3 Assessment Cycle</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Score</p>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <i className="fa-solid fa-chart-line text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">78.4%</p>
          <span className="text-xs text-emerald-600 font-medium">+2.1% from last term</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Grading</p>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <i className="fa-solid fa-clock text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">3</p>
          <span className="text-xs text-amber-600 font-medium">Exams awaiting final marks</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completion Rate</p>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <i className="fa-solid fa-circle-check text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">85%</p>
          <span className="text-xs text-slate-500 font-medium">Exam cycle progress</span>
        </div>
      </div>

      {/* Toolbar: Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-xs text-slate-400"></i>
          <input
            type="text"
            placeholder="Search exam title, subject, or grade..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Filters Group */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Grade Filter */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <span>Grade Level:</span>
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Grades</option>
              <option value="Grade 7">Grade 7</option>
              <option value="Grade 8">Grade 8</option>
              <option value="Grade 9">Grade 9</option>
              <option value="Grade 10">Grade 10</option>
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
              <option value="Upcoming">Upcoming</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Grading">Grading</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Examinations Data Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Examination Title / ID</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Grade Level</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Total Marks</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredExams.length > 0 ? (
                filteredExams.map((exam) => (
                  <tr key={exam.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{exam.title}</div>
                      <div className="text-xs text-slate-500 font-mono">{exam.id}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium text-xs">{exam.subject}</td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs font-medium">{exam.gradeLevel}</td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs font-mono">{exam.examDate}</td>
                    <td className="py-3.5 px-4 text-slate-800 font-medium text-xs font-mono">{exam.totalMarks} marks</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(exam.status)}`}>
                        {exam.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-xs px-2 py-1 rounded hover:bg-blue-50 transition-colors">
                        View Results
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-sm">
                    No matching examinations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Exam Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <h3 className="font-bold text-slate-900 text-base">Schedule New Examination</h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleCreateExam} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Examination Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Term 3 Final Mathematics Exam"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Subject
                  </label>
                  <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500">
                    <option value="Algebra II">Algebra II</option>
                    <option value="General Science">General Science</option>
                    <option value="World History">World History</option>
                    <option value="English Literature">English Literature</option>
                    <option value="Physics">Physics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Grade Level
                  </label>
                  <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500">
                    <option value="Grade 7 North">Grade 7 North</option>
                    <option value="Grade 8 South">Grade 8 South</option>
                    <option value="Grade 9 East">Grade 9 East</option>
                    <option value="Grade 10 North">Grade 10 North</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Date & Time
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2026-10-25 09:00 AM"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Total Marks
                  </label>
                  <input
                    type="number"
                    required
                    defaultValue={100}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Instructions & Guidelines
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide exam rules, allowed calculators, and duration..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
                >
                  Schedule Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}