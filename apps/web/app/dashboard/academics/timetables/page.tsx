'use client';

import { useState } from 'react';
import Link from 'next/link';

// TypeScript interface for an Academic Course
interface CourseItem {
  id: string;
  code: string;
  title: string;
  department: 'Mathematics' | 'Science' | 'Humanities' | 'Arts' | 'Computer Science';
  instructor: string;
  enrolledCount: number;
  capacity: number;
  status: 'Active' | 'Upcoming' | 'Completed';
}

// Initial mock data for academic courses
const initialCourses: CourseItem[] = [
  {
    id: 'CRS-001',
    code: 'MTH-401',
    title: 'Advanced Calculus & Linear Algebra',
    department: 'Mathematics',
    instructor: 'Dr. Robert Langdon',
    enrolledCount: 28,
    capacity: 30,
    status: 'Active',
  },
  {
    id: 'CRS-002',
    code: 'SCI-302',
    title: 'Organic Chemistry & Laboratory',
    department: 'Science',
    instructor: 'Dr. Marie Curie',
    enrolledCount: 24,
    capacity: 25,
    status: 'Active',
  },
  {
    id: 'CRS-003',
    code: 'HUM-201',
    title: 'World Literature & Critical Theory',
    department: 'Humanities',
    instructor: 'Prof. Margaret Atwood',
    enrolledCount: 32,
    capacity: 35,
    status: 'Active',
  },
  {
    id: 'CRS-004',
    code: 'CSC-105',
    title: 'Introduction to Python & Data Structures',
    department: 'Computer Science',
    instructor: 'Dr. Alan Turing',
    enrolledCount: 30,
    capacity: 30,
    status: 'Active',
  },
  {
    id: 'CRS-005',
    code: 'ART-101',
    title: 'Studio Arts & Classical Drawing',
    department: 'Arts',
    instructor: 'Prof. Leonardo da Vinci',
    enrolledCount: 18,
    capacity: 20,
    status: 'Upcoming',
  },
];

export default function AcademicsPage() {
  const [courses, setCourses] = useState<CourseItem[]>(initialCourses);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Filter logic based on search, department, and status
  const filteredCourses = courses.filter((crs) => {
    const matchesSearch =
      crs.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crs.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crs.instructor.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = departmentFilter === 'All' || crs.department === departmentFilter;
    const matchesStatus = statusFilter === 'All' || crs.status === statusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  // Helper for status badge styling
  const getStatusBadge = (status: CourseItem['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Upcoming':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Completed':
        return 'bg-slate-50 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessBanner('New academic course successfully created and published to the catalog.');
    setCreateModalOpen(false);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Academics Management & Courses
          </h1>
          <p className="text-sm text-slate-500">
            Manage institutional course catalogs, faculty assignments, student enrollments, and academic grading periods.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/academics/schedule"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <i className="fa-solid fa-calendar-days mr-2 text-xs text-blue-600"></i> Master Schedule
          </Link>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
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
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Courses</p>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <i className="fa-solid fa-book-open text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">84</p>
          <span className="text-xs text-emerald-600 font-medium"><i className="fa-solid fa-arrow-trend-up mr-1"></i> Fall Semester 2026</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Enrolled Students</p>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <i className="fa-solid fa-user-graduate text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">1,248</p>
          <span className="text-xs text-emerald-600 font-medium">98% course seat capacity</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Faculty Members</p>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <i className="fa-solid fa-chalkboard-user text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">64</p>
          <span className="text-xs text-purple-600 font-medium">Full & part-time instructors</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average GPA</p>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <i className="fa-solid fa-award text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">3.48</p>
          <span className="text-xs text-amber-600 font-medium">Institutional cumulative</span>
        </div>
      </div>

      {/* Toolbar: Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-xs text-slate-400"></i>
          <input
            type="text"
            placeholder="Search course title, code, or instructor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Filters Group */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Department Filter */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <span>Department:</span>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Departments</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
              <option value="Humanities">Humanities</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Arts">Arts</option>
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
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Courses Data Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Course Code / Title</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Instructor</th>
                <th className="py-3 px-4">Enrollment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((crs) => (
                  <tr key={crs.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 font-mono text-xs">{crs.code}</div>
                      <div className="text-xs text-slate-600 font-medium">{crs.title}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 text-xs">{crs.department}</td>
                    <td className="py-3.5 px-4 text-slate-800 text-xs font-medium">{crs.instructor}</td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-900 font-mono text-xs font-semibold">
                        {crs.enrolledCount} / {crs.capacity}
                      </div>
                      <div className="w-24 bg-slate-100 rounded-full h-1.5 mt-1">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full"
                          style={{ width: `${(crs.enrolledCount / crs.capacity) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(crs.status)}`}>
                        {crs.status}
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
                  <td colSpan={6} className="py-8 text-center text-slate-500 text-sm">
                    No matching academic courses found.
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
              <h3 className="font-bold text-slate-900 text-base">Create New Academic Course</h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleCreateCourse} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Course Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PHY-301"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Department
                  </label>
                  <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500">
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="Humanities">Humanities</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Arts">Arts</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Course Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced Quantum Physics"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Assigned Instructor
                </label>
                <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500">
                  <option value="Dr. Robert Langdon">Dr. Robert Langdon</option>
                  <option value="Dr. Marie Curie">Dr. Marie Curie</option>
                  <option value="Prof. Margaret Atwood">Prof. Margaret Atwood</option>
                  <option value="Dr. Alan Turing">Dr. Alan Turing</option>
                  <option value="Prof. Leonardo da Vinci">Prof. Leonardo da Vinci</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Seat Capacity
                  </label>
                  <input
                    type="number"
                    defaultValue={30}
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Semester
                  </label>
                  <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500">
                    <option value="Fall 2026">Fall Semester 2026</option>
                    <option value="Spring 2027">Spring Semester 2027</option>
                  </select>
                </div>
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
                  Save & Publish Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}