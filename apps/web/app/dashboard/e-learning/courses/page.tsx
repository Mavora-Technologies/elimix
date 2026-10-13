// apps/web/app/dashboard/e-learning/courses/page.tsx
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

// TypeScript interface for an E-Learning Course
interface CourseItem {
  id: string;
  title: string;
  subject: string;
  instructor: string;
  enrolledStudents: number;
  modulesCount: number;
  status: 'Active' | 'Draft' | 'Archived';
}

// Initial mock data for e-learning courses
const initialCourses: CourseItem[] = [
  {
    id: 'CRS-001',
    title: 'Advanced Algebra II & Quadratic Functions',
    subject: 'Algebra II',
    instructor: 'Mr. David Wilson',
    enrolledStudents: 92,
    modulesCount: 8,
    status: 'Active',
  },
  {
    id: 'CRS-002',
    title: 'Cellular Biology & Genetics Masterclass',
    subject: 'General Science',
    instructor: 'Ms. Emily Davis',
    enrolledStudents: 88,
    modulesCount: 6,
    status: 'Active',
  },
  {
    id: 'CRS-003',
    title: 'World History: The Industrial Revolution',
    subject: 'World History',
    instructor: 'Dr. James Anderson',
    enrolledStudents: 85,
    modulesCount: 7,
    status: 'Active',
  },
  {
    id: 'CRS-004',
    title: 'Shakespearean Literature & Poetry Analysis',
    subject: 'English Literature',
    instructor: 'Mrs. Amanda Martinez',
    enrolledStudents: 79,
    modulesCount: 5,
    status: 'Draft',
  },
  {
    id: 'CRS-005',
    title: 'AP Calculus Vector & Derivative Calculus',
    subject: 'Calculus',
    instructor: 'Mr. David Wilson',
    enrolledStudents: 74,
    modulesCount: 10,
    status: 'Active',
  },
];

export default function ELearningCoursesPage() {
  const [courses, setCourses] = useState<CourseItem[]>(initialCourses);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Filter logic based on search, status, and subject
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || course.status === statusFilter;
    const matchesSubject = subjectFilter === 'All' || course.subject === subjectFilter;

    return matchesSearch && matchesStatus && matchesSubject;
  });

  // Helper for status badge styling
  const getStatusBadge = (status: CourseItem['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Draft':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Archived':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessBanner('New e-learning course successfully created and published.');
    setCreateModalOpen(false);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  return (
    <div className="space-y-6 pb-12 w-full max-w-full overflow-hidden">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            E-Learning Courses & Virtual Classes
          </h1>
          <p className="text-sm text-slate-500">
            Manage online course curricula, virtual video lectures, multimedia modules, and student enrollments.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/academics"
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <i className="fa-solid fa-book-open mr-2 text-xs text-[#006FBF]"></i> Academics Overview
          </Link>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:opacity-95"
            style={{
              background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})`,
            }}
          >
            <i className="fa-solid fa-plus mr-2 text-xs"></i> Create Course
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
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Courses</p>
            <div className="rounded-xl bg-[#006FBF]/10 p-2 text-[#006FBF]">
              <i className="fa-solid fa-laptop-code text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">24</p>
          <span className="text-xs text-emerald-600 font-medium"><i className="fa-solid fa-arrow-trend-up mr-1"></i> Active online catalog</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Enrolled Learners</p>
            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
              <i className="fa-solid fa-users text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">718</p>
          <span className="text-xs text-emerald-600 font-medium">Across all course modules</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Virtual Classes Today</p>
            <div className="rounded-xl bg-purple-50 p-2 text-purple-600">
              <i className="fa-solid fa-video text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">8</p>
          <span className="text-xs text-purple-600 font-medium">Live sessions scheduled</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Course Completion</p>
            <div className="rounded-xl bg-amber-50 p-2 text-amber-600">
              <i className="fa-solid fa-award text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">88.2%</p>
          <span className="text-xs text-amber-600 font-medium">+3.4% this month</span>
        </div>
      </div>

      {/* Toolbar: Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-xs text-slate-400"></i>
          <input
            type="text"
            placeholder="Search course title, instructor, or subject..."
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
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Courses Data Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Course Title / ID</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Instructor</th>
                <th className="py-3 px-4">Enrolled Students</th>
                <th className="py-3 px-4">Modules</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{course.title}</div>
                      <div className="text-xs text-slate-500 font-mono">{course.id}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium text-xs">{course.subject}</td>
                    <td className="py-3.5 px-4 text-slate-800 text-xs font-medium">{course.instructor}</td>
                    <td className="py-3.5 px-4 text-slate-800 font-mono text-xs font-medium">{course.enrolledStudents} students</td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs font-medium">{course.modulesCount} modules</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(course.status)}`}>
                        {course.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button className="text-[#006FBF] hover:text-[#012E54] font-medium text-xs px-2.5 py-1 rounded-lg hover:bg-blue-50 transition-colors">
                        Manage Course
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-sm">
                    No matching e-learning courses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Course Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <h3 className="font-bold text-slate-900 text-base">Create New E-Learning Course</h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleCreateCourse} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Course Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Introduction to Organic Chemistry"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#006FBF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Subject
                  </label>
                  <select className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#006FBF]">
                    <option value="Algebra II">Algebra II</option>
                    <option value="General Science">General Science</option>
                    <option value="World History">World History</option>
                    <option value="English Literature">English Literature</option>
                    <option value="Calculus">Calculus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Lead Instructor
                  </label>
                  <select className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#006FBF]">
                    <option value="Mr. David Wilson">Mr. David Wilson</option>
                    <option value="Ms. Emily Davis">Ms. Emily Davis</option>
                    <option value="Dr. James Anderson">Dr. James Anderson</option>
                    <option value="Mrs. Amanda Martinez">Mrs. Amanda Martinez</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Course Description
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Summarize learning outcomes, prerequisite skills, and syllabus outline..."
                  className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 focus:outline-none focus:border-[#006FBF] resize-none"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
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
                  Publish Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}