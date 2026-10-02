'use client';

import { useState } from 'react';
import Link from 'next/link';

// TypeScript interface for a Lesson Plan
interface LessonPlan {
  id: string;
  title: string;
  subject: string;
  teacherName: string;
  gradeStream: string;
  submissionDate: string;
  status: 'Approved' | 'Pending Review' | 'Draft' | 'Needs Revision';
}

// Initial mock data for lesson plans
const initialLessonPlans: LessonPlan[] = [
  {
    id: 'LP-001',
    title: 'Quadratic Equations & Graphing Parabolas',
    subject: 'Algebra II',
    teacherName: 'Mr. David Wilson',
    gradeStream: 'Grade 9 East',
    submissionDate: '2026-10-01',
    status: 'Approved',
  },
  {
    id: 'LP-002',
    title: 'Cellular Respiration & ATP Synthesis',
    subject: 'General Science',
    teacherName: 'Ms. Emily Davis',
    gradeStream: 'Grade 7 North',
    submissionDate: '2026-10-02',
    status: 'Pending Review',
  },
  {
    id: 'LP-003',
    title: 'The Industrial Revolution: Causes & Impact',
    subject: 'World History',
    teacherName: 'Dr. James Anderson',
    gradeStream: 'Grade 8 South',
    submissionDate: '2026-09-28',
    status: 'Approved',
  },
  {
    id: 'LP-004',
    title: 'Poetry Analysis: Shakespearean Sonnets',
    subject: 'English Literature',
    teacherName: 'Mrs. Amanda Martinez',
    gradeStream: 'Grade 9 West',
    submissionDate: '2026-09-25',
    status: 'Needs Revision',
  },
  {
    id: 'LP-005',
    title: 'Introduction to Vector Calculus',
    subject: 'Calculus',
    teacherName: 'Mr. David Wilson',
    gradeStream: 'Grade 10 North',
    submissionDate: '2026-10-02',
    status: 'Draft',
  },
];

export default function LessonPlansPage() {
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>(initialLessonPlans);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Filter logic based on search, status, and subject
  const filteredPlans = lessonPlans.filter((plan) => {
    const matchesSearch =
      plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.gradeStream.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || plan.status === statusFilter;
    const matchesSubject = subjectFilter === 'All' || plan.subject === subjectFilter;

    return matchesSearch && matchesStatus && matchesSubject;
  });

  // Helper for status badge styling
  const getStatusBadge = (status: LessonPlan['status']) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending Review':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Needs Revision':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Draft':
        return 'bg-slate-50 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessBanner('New lesson plan successfully created and submitted for review.');
    setCreateModalOpen(false);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Lesson Plans & Curriculum Tracking
          </h1>
          <p className="text-sm text-slate-500">
            Review, approve, and manage weekly lesson plans submitted by teaching faculty.
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
            <i className="fa-solid fa-plus mr-2 text-xs"></i> New Lesson Plan
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
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Plans</p>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <i className="fa-solid fa-file-lines text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">128</p>
          <span className="text-xs text-emerald-600 font-medium"><i className="fa-solid fa-arrow-trend-up mr-1"></i> Submitted this term</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Approved Plans</p>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <i className="fa-solid fa-clipboard-check text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">110</p>
          <span className="text-xs text-emerald-600 font-medium">Ready for classroom use</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Review</p>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <i className="fa-solid fa-clock text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">12</p>
          <span className="text-xs text-amber-600 font-medium">Awaiting head review</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Needs Revision</p>
            <div className="rounded-lg bg-rose-50 p-2 text-rose-600">
              <i className="fa-solid fa-triangle-exclamation text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">6</p>
          <span className="text-xs text-rose-600 font-medium">Returned to teachers</span>
        </div>
      </div>

      {/* Toolbar: Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-xs text-slate-400"></i>
          <input
            type="text"
            placeholder="Search title, teacher, or grade stream..."
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
              <option value="Approved">Approved</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Needs Revision">Needs Revision</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lesson Plans Data Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Lesson Title / ID</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Teacher Name</th>
                <th className="py-3 px-4">Grade Stream</th>
                <th className="py-3 px-4">Submission Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredPlans.length > 0 ? (
                filteredPlans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{plan.title}</div>
                      <div className="text-xs text-slate-500 font-mono">{plan.id}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium text-xs">{plan.subject}</td>
                    <td className="py-3.5 px-4 text-slate-800 text-xs font-medium">{plan.teacherName}</td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs font-medium">{plan.gradeStream}</td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs font-mono">{plan.submissionDate}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(plan.status)}`}>
                        {plan.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-xs px-2 py-1 rounded hover:bg-blue-50 transition-colors">
                        Review Plan
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-sm">
                    No matching lesson plans found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Submit Lesson Plan Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <h3 className="font-bold text-slate-900 text-base">New Lesson Plan Submission</h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleCreatePlan} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Lesson Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Introduction to Photosynthesis"
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
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Grade Stream
                  </label>
                  <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500">
                    <option value="Grade 9 East">Grade 9 East</option>
                    <option value="Grade 8 South">Grade 8 South</option>
                    <option value="Grade 7 North">Grade 7 North</option>
                    <option value="Grade 6 West">Grade 6 West</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Curriculum Objectives & Notes
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Outline core objectives, materials required, and lesson steps..."
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
                  Submit for Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}