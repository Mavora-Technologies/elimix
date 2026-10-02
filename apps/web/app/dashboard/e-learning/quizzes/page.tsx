'use client';

import { useState } from 'react';
import Link from 'next/link';

// TypeScript interface for an E-Learning Quiz
interface QuizItem {
  id: string;
  title: string;
  subject: string;
  instructor: string;
  questionsCount: number;
  timeLimitMinutes: number;
  status: 'Active' | 'Draft' | 'Closed';
  averageScore?: string;
}

// Initial mock data for e-learning quizzes
const initialQuizzes: QuizItem[] = [
  {
    id: 'QIZ-001',
    title: 'Algebra II Quadratic Equations Checkpoint',
    subject: 'Algebra II',
    instructor: 'Mr. David Wilson',
    questionsCount: 15,
    timeLimitMinutes: 30,
    status: 'Active',
    averageScore: '82.4%',
  },
  {
    id: 'QIZ-002',
    title: 'Cellular Biology & Mitosis Mid-Unit Quiz',
    subject: 'General Science',
    instructor: 'Ms. Emily Davis',
    questionsCount: 20,
    timeLimitMinutes: 45,
    status: 'Active',
    averageScore: '78.9%',
  },
  {
    id: 'QIZ-003',
    title: 'Industrial Revolution Knowledge Assessment',
    subject: 'World History',
    instructor: 'Dr. James Anderson',
    questionsCount: 10,
    timeLimitMinutes: 20,
    status: 'Closed',
    averageScore: '85.2%',
  },
  {
    id: 'QIZ-004',
    title: 'Hamlet Act III Comprehension & Theme Quiz',
    subject: 'English Literature',
    instructor: 'Mrs. Amanda Martinez',
    questionsCount: 12,
    timeLimitMinutes: 25,
    status: 'Draft',
  },
  {
    id: 'QIZ-005',
    title: 'AP Calculus Derivative Rules & Practice Quiz',
    subject: 'Calculus',
    instructor: 'Mr. David Wilson',
    questionsCount: 18,
    timeLimitMinutes: 40,
    status: 'Active',
    averageScore: '88.6%',
  },
];

export default function ELearningQuizzesPage() {
  const [quizzes, setQuizzes] = useState<QuizItem[]>(initialQuizzes);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Filter logic based on search, status, and subject
  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch =
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || quiz.status === statusFilter;
    const matchesSubject = subjectFilter === 'All' || quiz.subject === subjectFilter;

    return matchesSearch && matchesStatus && matchesSubject;
  });

  // Helper for status badge styling
  const getStatusBadge = (status: QuizItem['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Draft':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Closed':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const handleCreateQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessBanner('New online quiz successfully created and published.');
    setCreateModalOpen(false);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            E-Learning Quizzes & Assessments
          </h1>
          <p className="text-sm text-slate-500">
            Create interactive online quizzes, manage automated grading rules, and track student completion rates.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/e-learning/courses"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <i className="fa-solid fa-laptop-code mr-2 text-xs text-blue-600"></i> All Courses
          </Link>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
          >
            <i className="fa-solid fa-plus mr-2 text-xs"></i> Create Quiz
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
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Quizzes</p>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <i className="fa-solid fa-clipboard-question text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">38</p>
          <span className="text-xs text-emerald-600 font-medium"><i className="fa-solid fa-arrow-trend-up mr-1"></i> Active assessment bank</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Submissions Completed</p>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <i className="fa-solid fa-circle-check text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">1,240</p>
          <span className="text-xs text-emerald-600 font-medium">Auto-graded instantly</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Score</p>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <i className="fa-solid fa-chart-pie text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">83.8%</p>
          <span className="text-xs text-purple-600 font-medium">+2.1% this week</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Quizzes</p>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <i className="fa-solid fa-bolt text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">12</p>
          <span className="text-xs text-amber-600 font-medium">Currently taking submissions</span>
        </div>
      </div>

      {/* Toolbar: Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-xs text-slate-400"></i>
          <input
            type="text"
            placeholder="Search quiz title, subject, or instructor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
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
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quizzes Data Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Quiz Title / ID</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Instructor</th>
                <th className="py-3 px-4">Questions</th>
                <th className="py-3 px-4">Time Limit</th>
                <th className="py-3 px-4">Average Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredQuizzes.length > 0 ? (
                filteredQuizzes.map((quiz) => (
                  <tr key={quiz.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{quiz.title}</div>
                      <div className="text-xs text-slate-500 font-mono">{quiz.id}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium text-xs">{quiz.subject}</td>
                    <td className="py-3.5 px-4 text-slate-800 text-xs font-medium">{quiz.instructor}</td>
                    <td className="py-3.5 px-4 text-slate-700 font-mono text-xs">{quiz.questionsCount} questions</td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-xs">{quiz.timeLimitMinutes} mins</td>
                    <td className="py-3.5 px-4 text-slate-800 font-mono text-xs font-bold">{quiz.averageScore || 'N/A'}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(quiz.status)}`}>
                        {quiz.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-xs px-2 py-1 rounded hover:bg-blue-50 transition-colors">
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 text-sm">
                    No matching e-learning quizzes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Quiz Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <h3 className="font-bold text-slate-900 text-base">Create New Online Quiz</h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleCreateQuiz} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Quiz Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Chemistry Unit 1 Quiz"
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
                    <option value="Calculus">Calculus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Instructor
                  </label>
                  <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500">
                    <option value="Mr. David Wilson">Mr. David Wilson</option>
                    <option value="Ms. Emily Davis">Ms. Emily Davis</option>
                    <option value="Dr. James Anderson">Dr. James Anderson</option>
                    <option value="Mrs. Amanda Martinez">Mrs. Amanda Martinez</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Number of Questions
                  </label>
                  <input
                    type="number"
                    min={1}
                    defaultValue={15}
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Time Limit (Minutes)
                  </label>
                  <input
                    type="number"
                    min={5}
                    defaultValue={30}
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Instructions / Description
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide guidance for students taking this assessment..."
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
                  Publish Quiz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}