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

// TypeScript interface for an Academic Stream
interface AcademicStream {
  id: string;
  name: string;
  gradeLevel: string;
  headTeacher: string;
  studentCount: number;
  subjectsCount: number;
  status: 'Active' | 'Finalizing' | 'Archived';
}

// Initial mock data for academic grade streams
const initialStreams: AcademicStream[] = [
  {
    id: 'STR-001',
    name: 'Grade 9 East',
    gradeLevel: 'Grade 9',
    headTeacher: 'Mr. David Wilson',
    studentCount: 95,
    subjectsCount: 8,
    status: 'Active',
  },
  {
    id: 'STR-002',
    name: 'Grade 8 South',
    gradeLevel: 'Grade 8',
    headTeacher: 'Dr. James Anderson',
    studentCount: 88,
    subjectsCount: 7,
    status: 'Active',
  },
  {
    id: 'STR-003',
    name: 'Grade 7 North',
    gradeLevel: 'Grade 7',
    headTeacher: 'Ms. Emily Davis',
    studentCount: 92,
    subjectsCount: 7,
    status: 'Active',
  },
  {
    id: 'STR-004',
    name: 'Grade 6 West',
    gradeLevel: 'Grade 6',
    headTeacher: 'Mrs. Amanda Martinez',
    studentCount: 84,
    subjectsCount: 6,
    status: 'Active',
  },
  {
    id: 'STR-005',
    name: 'Grade 10 North',
    gradeLevel: 'Grade 10',
    headTeacher: 'Dr. James Anderson',
    studentCount: 78,
    subjectsCount: 9,
    status: 'Finalizing',
  },
];

export default function AcademicsOverviewPage() {
  const [streams, setStreams] = useState<AcademicStream[]>(initialStreams);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [gradeFilter, setGradeFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Form state for new grade stream modal
  const [formData, setFormData] = useState({
    name: 'Grade 10 East',
    gradeLevel: 'Grade 10',
    headTeacher: 'Dr. Robert Langdon',
    studentCount: 80,
    subjectsCount: 9,
    status: 'Active' as const,
  });

  const handleCreateStream = (e: React.FormEvent) => {
    e.preventDefault();
    const newStream: AcademicStream = {
      id: `STR-00${streams.length + 1}`,
      ...formData,
    };
    setStreams([newStream, ...streams]);
    setIsModalOpen(false);
    setSuccessBanner('New grade stream successfully created and published to the academic catalog.');
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  // Filter logic based on search, status, and grade level
  const filteredStreams = streams.filter((stream) => {
    const matchesSearch =
      stream.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stream.headTeacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stream.gradeLevel.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || stream.status === statusFilter;
    const matchesGrade = gradeFilter === 'All' || stream.gradeLevel === gradeFilter;

    return matchesSearch && matchesStatus && matchesGrade;
  });

  // Helper for status badge styling
  const getStatusBadge = (status: AcademicStream['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50/80 text-emerald-600 border-emerald-200';
      case 'Finalizing':
        return 'bg-amber-50/80 text-amber-600 border-amber-200';
      case 'Archived':
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
            <span className="text-slate-900">Academics Overview</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Academics Overview & Grade Streams
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Manage school curriculums, grade streams, subject allocation, and academic performance tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/academics/timetables"
            className="flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors shadow-sm"
          >
            <i className="fa-solid fa-calendar-days text-[#006FBF]"></i>
            <span>Master Timetable</span>
          </Link>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex h-9 items-center gap-2 rounded-xl px-5 text-xs font-semibold text-white shadow-sm transition-all hover:opacity-95"
            style={{
              background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})`,
            }}
          >
            <i className="fa-solid fa-plus text-[10px]"></i>
            <span>Add Grade Stream</span>
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
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Grade Streams</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#006FBF]/10 text-[#006FBF]">
              <i className="fa-solid fa-layer-group text-xs"></i>
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">18</p>
          <p className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-emerald-600">
            <i className="fa-solid fa-arrow-trend-up"></i>
            <span>Full capacity</span>
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Enrolled Students</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <i className="fa-solid fa-user-graduate text-xs"></i>
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">764</p>
          <p className="mt-1 text-[11px] font-medium text-slate-500">Across all streams</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Subjects</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <i className="fa-solid fa-book text-xs"></i>
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">24</p>
          <p className="mt-1 text-[11px] font-medium text-slate-500">Core & electives</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Term Completion</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <i className="fa-solid fa-chart-pie text-xs"></i>
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">65%</p>
          <p className="mt-1 text-[11px] font-medium text-amber-600">Term 3 in progress</p>
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
              placeholder="Search stream name, grade level, or head teacher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10"
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-500">Grade Level:</span>
              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-700 outline-none transition-all focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10"
              >
                <option value="All">All Grades</option>
                <option value="Grade 6">Grade 6</option>
                <option value="Grade 7">Grade 7</option>
                <option value="Grade 8">Grade 8</option>
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
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
                <option value="Finalizing">Finalizing</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================================
         GRADE STREAMS DATA TABLE
         ================================================================== */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Stream Name / ID</th>
                <th className="py-3.5 px-6">Grade Level</th>
                <th className="py-3.5 px-6">Head Teacher</th>
                <th className="py-3.5 px-6">Enrolled Students</th>
                <th className="py-3.5 px-6">Subjects</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStreams.length > 0 ? (
                filteredStreams.map((stream) => (
                  <tr key={stream.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="font-semibold text-slate-900 text-xs">{stream.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">{stream.id}</div>
                    </td>
                    <td className="py-3.5 px-6 text-slate-700 font-medium text-[11px]">{stream.gradeLevel}</td>
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-2 text-slate-700 text-[11px] font-medium">
                        <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-bold border border-slate-200/80">
                          {stream.headTeacher.charAt(0)}
                        </div>
                        {stream.headTeacher}
                      </div>
                    </td>
                    <td className="py-3.5 px-6 text-slate-800 font-mono text-[11px] font-semibold">{stream.studentCount}</td>
                    <td className="py-3.5 px-6 text-slate-600 text-[11px] font-medium">{stream.subjectsCount} subjects</td>
                    <td className="py-3.5 px-6">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${getStatusBadge(stream.status)}`}>
                        {stream.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <Link
                        href="/dashboard/academics/timetables"
                        className="text-[#006FBF] hover:text-[#012E54] font-semibold text-[11px] px-2.5 py-1 rounded-lg hover:bg-[#006FBF]/5 transition-colors inline-block"
                      >
                        Timetable
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400 mb-3">
                      <i className="fa-solid fa-layer-group text-lg"></i>
                    </div>
                    <p className="text-xs font-semibold text-slate-600">No matching academic grade streams found</p>
                    <p className="text-[11px] text-slate-400 mt-1">Try adjusting your filters or search criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================================================================
         ADD GRADE STREAM MODAL
         ================================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200/80 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Add New Grade Stream</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Register a new academic stream and allocate faculty.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-200/50 hover:text-slate-600 transition-colors"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            <form onSubmit={handleCreateStream}>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Stream Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Grade 10 East"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Grade Level <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.gradeLevel}
                      onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10"
                    >
                      <option value="Grade 6">Grade 6</option>
                      <option value="Grade 7">Grade 7</option>
                      <option value="Grade 8">Grade 8</option>
                      <option value="Grade 9">Grade 9</option>
                      <option value="Grade 10">Grade 10</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Head Teacher <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.headTeacher}
                    onChange={(e) => setFormData({ ...formData, headTeacher: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10"
                  >
                    <option value="Dr. Robert Langdon">Dr. Robert Langdon</option>
                    <option value="Mr. David Wilson">Mr. David Wilson</option>
                    <option value="Dr. James Anderson">Dr. James Anderson</option>
                    <option value="Ms. Emily Davis">Ms. Emily Davis</option>
                    <option value="Mrs. Amanda Martinez">Mrs. Amanda Martinez</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Initial Student Count <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.studentCount}
                      onChange={(e) => setFormData({ ...formData, studentCount: Number(e.target.value) })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Subject Count <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.subjectsCount}
                      onChange={(e) => setFormData({ ...formData, subjectsCount: Number(e.target.value) })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
                  <span>Save & Publish</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}