'use client';

import { useState } from 'react';
import Link from 'next/link';

// TypeScript interface for an Assignment
interface Assignment {
  id: string;
  title: string;
  subject: string;
  gradeStream: string;
  teacherName: string;
  dueDate: string;
  submissionProgress: string;
  status: 'Active' | 'Grading' | 'Closed' | 'Draft';
}

// Initial mock data for assignments
const initialAssignments: Assignment[] = [
  {
    id: 'ASN-001',
    title: 'Quadratic Functions Problem Set #4',
    subject: 'Algebra II',
    gradeStream: 'Grade 9 East',
    teacherName: 'Mr. David Wilson',
    dueDate: '2026-10-05 11:59 PM',
    submissionProgress: '82 / 95',
    status: 'Active',
  },
  {
    id: 'ASN-002',
    title: 'Cellular Respiration Lab Report & Analysis',
    subject: 'General Science',
    gradeStream: 'Grade 7 North',
    teacherName: 'Ms. Emily Davis',
    dueDate: '2026-10-03 05:00 PM',
    submissionProgress: '90 / 92',
    status: 'Grading',
  },
  {
    id: 'ASN-003',
    title: 'Causes & Consequences of the Industrial Revolution',
    subject: 'World History',
    gradeStream: 'Grade 8 South',
    teacherName: 'Dr. James Anderson',
    dueDate: '2026-09-30 11:59 PM',
    submissionProgress: '88 / 88',
    status: 'Closed',
  },
  {
    id: 'ASN-004',
    title: 'Shakespearean Sonnet Creative Writing Piece',
    subject: 'English Literature',
    gradeStream: 'Grade 9 West',
    teacherName: 'Mrs. Amanda Martinez',
    dueDate: '2026-10-10 11:59 PM',
    submissionProgress: '15 / 84',
    status: 'Active',
  },
  {
    id: 'ASN-005',
    title: 'Vector Calculus Mid-Term Practice Test',
    subject: 'Calculus',
    gradeStream: 'Grade 10 North',
    teacherName: 'Mr. David Wilson',
    dueDate: '2026-10-15 03:00 PM',
    submissionProgress: '0 / 78',
    status: 'Draft',
  },
];

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Filter logic based on search, status, and subject
  const filteredAssignments = assignments.filter((asn) => {
    const matchesSearch =
      asn.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asn.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asn.gradeStream.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || asn.status === statusFilter;
    const matchesSubject = subjectFilter === 'All' || asn.subject === subjectFilter;

    return matchesSearch && matchesStatus && matchesSubject;
  });

  // Helper for status badge styling
  const getStatusBadge = (status: Assignment['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Grading':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Closed':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Draft':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessBanner('New assignment successfully published and assigned to students.');
    setCreateModalOpen(false);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Assignments & Homework Tracking
          </h1>
          <p className="text-sm text-slate-500">
            Monitor student submissions, grading progress, due dates, and homework publishing.
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
            <i className="fa-solid fa-plus mr-2 text-xs"></i> New Assignment
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
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Assignments</p>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <i className="fa-solid fa-file-pen text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">34</p>
          <span className="text-xs text-emerald-600 font-medium"><i className="fa-solid fa-arrow-trend-up mr-1"></i> Across all streams</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Submission Rate</p>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <i className="fa-solid fa-square-check text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">92.4%</p>
          <span className="text-xs text-emerald-600 font-medium">On-time submissions</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Grading</p>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <i className="fa-solid fa-clock text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">42</p>
          <span className="text-xs text-amber-600 font-medium">Submissions awaiting review</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overdue / Missing</p>
            <div className="rounded-lg bg-rose-50 p-2 text-rose-600">
              <i className="fa-solid fa-triangle-exclamation text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">14</p>
          <span className="text-xs text-rose-600 font-medium">Flagged for follow-up</span>
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
              <option value="Active">Active</option>
              <option value="Grading">Grading</option>
              <option value="Closed">Closed</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Assignments Data Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Assignment Title / ID</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Grade Stream</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Submissions</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredAssignments.length > 0 ? (
                filteredAssignments.map((asn) => (
                  <tr key={asn.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{asn.title}</div>
                      <div className="text-xs text-slate-500 font-mono">{asn.id} • {asn.teacherName}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium text-xs">{asn.subject}</td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs font-medium">{asn.gradeStream}</td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs font-mono">{asn.dueDate}</td>
                    <td className="py-3.5 px-4 text-slate-800 font-medium text-xs font-mono">{asn.submissionProgress}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(asn.status)}`}>
                        {asn.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-xs px-2 py-1 rounded hover:bg-blue-50 transition-colors">
                        View Submissions
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-sm">
                    No matching assignments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Assignment Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <h3 className="font-bold text-slate-900 text-base">Create New Assignment</h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleCreateAssignment} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Assignment Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chapter 5 Review Questions"
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
                  Due Date & Time
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2026-10-20 11:59 PM"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Instructions & Guidelines
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide details for students..."
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
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}