'use client';

import { useState } from 'react';
import Link from 'next/link';

/* ==========================================================================
   ELIMIX BRAND
   ========================================================================== */

const BRAND = {
  navy: '#012E54',
  blue: '#006FBF',
  brightBlue: '#0088CE',
  cyan: '#04B1D6',
  teal: '#0199B9',
};

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

  // Form state for new assignment modal
  const [formData, setFormData] = useState({
    title: 'Chapter 5 Review Questions',
    subject: 'Algebra II',
    gradeStream: 'Grade 9 East',
    teacherName: 'Mr. David Wilson',
    dueDate: '2026-10-20 11:59 PM',
    status: 'Active' as const,
  });

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    const newAssignment: Assignment = {
      id: `ASN-00${assignments.length + 1}`,
      ...formData,
      submissionProgress: `0 / 85`,
    };
    setAssignments([newAssignment, ...assignments]);
    setSuccessBanner('New assignment successfully published and assigned to students.');
    setCreateModalOpen(false);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

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
        return 'bg-emerald-50/85 text-emerald-600 border-emerald-200';
      case 'Grading':
        return 'bg-[#006FBF]/10 text-[#006FBF] border-[#006FBF]/20';
      case 'Closed':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'Draft':
        return 'bg-amber-50/85 text-amber-600 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* ==================================================================
         BREADCRUMBS & HEADER
         ================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2">
            <Link href="/dashboard" className="hover:text-[#006FBF] transition-colors">
              Dashboard
            </Link>
            <i className="fa-solid fa-chevron-right text-[10px]" />
            <Link href="/dashboard/academics" className="hover:text-[#006FBF] transition-colors">
              Academics Overview
            </Link>
            <i className="fa-solid fa-chevron-right text-[10px]" />
            <span className="text-slate-900">Assignments</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Assignments & Homework Tracking
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Monitor student submissions, grading progress, due dates, and homework publishing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/academics"
            className="flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors shadow-sm"
          >
            <i className="fa-solid fa-book-open text-[#006FBF]"></i>
            <span>Academics Overview</span>
          </Link>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex h-9 items-center gap-2 rounded-xl px-5 text-xs font-semibold text-white shadow-sm transition-all hover:opacity-95"
            style={{
              background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})`,
            }}
          >
            <i className="fa-solid fa-plus text-[10px]"></i>
            <span>New Assignment</span>
          </button>
        </div>
      </div>

      {/* ==================================================================
         NOTIFICATIONS
         ================================================================== */}
      {successBanner && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200/80 bg-emerald-50/80 p-3.5 text-xs font-medium text-emerald-800 shadow-sm animate-in fade-in slide-in-from-top-2">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100/80 text-emerald-600">
            <i className="fa-solid fa-check text-[10px]" />
          </span>
          <p className="flex-1">{successBanner}</p>
        </div>
      )}

      {/* ==================================================================
         SUMMARY KPI CARDS
         ================================================================== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Assignments</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#006FBF]/10 text-[#006FBF]">
              <i className="fa-solid fa-file-pen text-xs"></i>
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">34</p>
          <p className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-emerald-600">
            <i className="fa-solid fa-arrow-trend-up"></i>
            <span>Across all streams</span>
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Submission Rate</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <i className="fa-solid fa-square-check text-xs"></i>
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">92.4%</p>
          <p className="mt-1 text-[11px] font-medium text-slate-500">On-time submissions</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Grading</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <i className="fa-solid fa-clock text-xs"></i>
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">42</p>
          <p className="mt-1 text-[11px] font-medium text-amber-600">Submissions awaiting review</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Overdue / Missing</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <i className="fa-solid fa-triangle-exclamation text-xs"></i>
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">14</p>
          <p className="mt-1 text-[11px] font-medium text-rose-600">Flagged for follow-up</p>
        </div>
      </div>

      {/* ==================================================================
         TOOLBAR: SEARCH AND FILTERS
         ================================================================== */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-xs text-slate-400"></i>
            <input
              type="text"
              placeholder="Search title, teacher, or grade stream..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10"
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-500">Subject:</span>
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-700 outline-none transition-all focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10"
              >
                <option value="All">All Subjects</option>
                <option value="Algebra II">Algebra II</option>
                <option value="General Science">General Science</option>
                <option value="World History">World History</option>
                <option value="English Literature">English Literature</option>
                <option value="Calculus">Calculus</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-500">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-700 outline-none transition-all focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10"
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
      </div>

      {/* ==================================================================
         ASSIGNMENTS DATA TABLE
         ================================================================== */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Assignment Title / ID</th>
                <th className="py-3.5 px-6">Subject</th>
                <th className="py-3.5 px-6">Grade Stream</th>
                <th className="py-3.5 px-6">Due Date</th>
                <th className="py-3.5 px-6">Submissions</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAssignments.length > 0 ? (
                filteredAssignments.map((asn) => (
                  <tr key={asn.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="font-semibold text-slate-900 text-xs">{asn.title}</div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono mt-0.5">
                        <span>{asn.id}</span>
                        <span>•</span>
                        <span className="text-slate-500">{asn.teacherName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 text-slate-700 font-medium text-[11px]">{asn.subject}</td>
                    <td className="py-3.5 px-6 text-slate-600 text-[11px] font-medium">{asn.gradeStream}</td>
                    <td className="py-3.5 px-6 text-slate-500 font-mono text-[11px]">{asn.dueDate}</td>
                    <td className="py-3.5 px-6 text-slate-800 font-semibold font-mono text-[11px]">{asn.submissionProgress}</td>
                    <td className="py-3.5 px-6">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${getStatusBadge(asn.status)}`}>
                        {asn.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <button className="text-[#006FBF] hover:text-[#012E54] font-semibold text-[11px] px-2.5 py-1 rounded-lg hover:bg-[#006FBF]/5 transition-colors">
                        View Submissions
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400 mb-3">
                      <i className="fa-solid fa-file-pen text-lg"></i>
                    </div>
                    <p className="text-xs font-semibold text-slate-600">No matching assignments found</p>
                    <p className="text-[11px] text-slate-400 mt-1">Try adjusting your filters or search criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================================================================
         CREATE ASSIGNMENT MODAL
         ================================================================== */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200/80 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Create New Assignment</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Publish coursework and set homework deadlines.</p>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-200/50 hover:text-slate-600 transition-colors"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            <form onSubmit={handleCreateAssignment}>
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Assignment Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Chapter 5 Review Questions"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Subject <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10"
                    >
                      <option value="Algebra II">Algebra II</option>
                      <option value="General Science">General Science</option>
                      <option value="World History">World History</option>
                      <option value="English Literature">English Literature</option>
                      <option value="Calculus">Calculus</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Grade Stream <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.gradeStream}
                      onChange={(e) => setFormData({ ...formData, gradeStream: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10"
                    >
                      <option value="Grade 9 East">Grade 9 East</option>
                      <option value="Grade 8 South">Grade 8 South</option>
                      <option value="Grade 7 North">Grade 7 North</option>
                      <option value="Grade 6 West">Grade 6 West</option>
                      <option value="Grade 10 North">Grade 10 North</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Due Date & Time <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    placeholder="e.g. 2026-10-20 11:59 PM"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Instructions & Guidelines <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide details for students..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs text-slate-800 outline-none focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10"
                  ></textarea>
                </div>
              </div>

              <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:opacity-95"
                  style={{
                    background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})`,
                  }}
                >
                  <i className="fa-solid fa-check text-[10px]"></i>
                  <span>Publish Assignment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}