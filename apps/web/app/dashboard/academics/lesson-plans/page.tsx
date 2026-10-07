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

  // Form state for new lesson plan modal
  const [formData, setFormData] = useState({
    title: 'Introduction to Photosynthesis',
    subject: 'General Science',
    teacherName: 'Ms. Emily Davis',
    gradeStream: 'Grade 7 North',
    status: 'Pending Review' as const,
  });

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    const newPlan: LessonPlan = {
      id: `LP-00${lessonPlans.length + 1}`,
      ...formData,
      submissionDate: new Date().toISOString().split('T')[0],
    };
    setLessonPlans([newPlan, ...lessonPlans]);
    setSuccessBanner('New lesson plan successfully created and submitted for review.');
    setCreateModalOpen(false);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

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
        return 'bg-emerald-50/80 text-emerald-600 border-emerald-200';
      case 'Pending Review':
        return 'bg-amber-50/80 text-amber-600 border-amber-200';
      case 'Needs Revision':
        return 'bg-rose-50/80 text-rose-600 border-rose-200';
      case 'Draft':
        return 'bg-slate-50 text-slate-600 border-slate-200';
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
            <span className="text-slate-900">Lesson Plans</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Lesson Plans & Curriculum Tracking
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Review, approve, and manage weekly lesson plans submitted by teaching faculty.
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
            <span>New Lesson Plan</span>
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
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Plans</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#006FBF]/10 text-[#006FBF]">
              <i className="fa-solid fa-file-lines text-xs"></i>
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">128</p>
          <p className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-emerald-600">
            <i className="fa-solid fa-arrow-trend-up"></i>
            <span>Submitted this term</span>
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Approved Plans</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <i className="fa-solid fa-clipboard-check text-xs"></i>
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">110</p>
          <p className="mt-1 text-[11px] font-medium text-slate-500">Ready for classroom use</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Review</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <i className="fa-solid fa-clock text-xs"></i>
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">12</p>
          <p className="mt-1 text-[11px] font-medium text-amber-600">Awaiting head review</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Needs Revision</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <i className="fa-solid fa-triangle-exclamation text-xs"></i>
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">6</p>
          <p className="mt-1 text-[11px] font-medium text-rose-600">Returned to teachers</p>
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
                <option value="Approved">Approved</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Needs Revision">Needs Revision</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================================
         LESSON PLANS DATA TABLE
         ================================================================== */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Lesson Title / ID</th>
                <th className="py-3.5 px-6">Subject</th>
                <th className="py-3.5 px-6">Teacher Name</th>
                <th className="py-3.5 px-6">Grade Stream</th>
                <th className="py-3.5 px-6">Submission Date</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPlans.length > 0 ? (
                filteredPlans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="font-semibold text-slate-900 text-xs">{plan.title}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">{plan.id}</div>
                    </td>
                    <td className="py-3.5 px-6 text-slate-700 font-medium text-[11px]">{plan.subject}</td>
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-2 text-slate-700 text-[11px] font-medium">
                        <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-bold border border-slate-200/80">
                          {plan.teacherName.charAt(0)}
                        </div>
                        {plan.teacherName}
                      </div>
                    </td>
                    <td className="py-3.5 px-6 text-slate-600 text-[11px] font-medium">{plan.gradeStream}</td>
                    <td className="py-3.5 px-6 text-slate-500 font-mono text-[11px]">{plan.submissionDate}</td>
                    <td className="py-3.5 px-6">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${getStatusBadge(plan.status)}`}>
                        {plan.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <button className="text-[#006FBF] hover:text-[#012E54] font-semibold text-[11px] px-2.5 py-1 rounded-lg hover:bg-[#006FBF]/5 transition-colors">
                        Review Plan
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400 mb-3">
                      <i className="fa-solid fa-file-lines text-lg"></i>
                    </div>
                    <p className="text-xs font-semibold text-slate-600">No matching lesson plans found</p>
                    <p className="text-[11px] text-slate-400 mt-1">Try adjusting your filters or search criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================================================================
         NEW LESSON PLAN MODAL
         ================================================================== */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200/80 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">New Lesson Plan Submission</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Submit curriculum plans and teaching notes for review.</p>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-200/50 hover:text-slate-600 transition-colors"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            <form onSubmit={handleCreatePlan}>
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Lesson Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Introduction to Photosynthesis"
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
                    Curriculum Objectives & Notes <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Outline core objectives, materials required, and lesson steps..."
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
                  <span>Submit for Review</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}