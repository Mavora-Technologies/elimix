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
        return 'bg-emerald-50/80 text-emerald-600 border-emerald-200';
      case 'Upcoming':
        return 'bg-[#006FBF]/10 text-[#006FBF] border-[#006FBF]/20';
      case 'Completed':
        return 'bg-slate-50 text-slate-600 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessBanner('New academic course successfully created and published to the catalog.');
    setCreateModalOpen(false);
    setTimeout(() => setSuccessBanner(null), 4000);
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
            <span className="text-slate-900">Academics & Courses</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Academics Management
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Manage institutional course catalogs, faculty assignments, student enrollments, and academic grading periods.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/academics/schedule"
            className="flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors shadow-sm"
          >
            <i className="fa-solid fa-calendar-days text-[#006FBF]"></i> 
            <span>Master Schedule</span>
          </Link>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex h-9 items-center gap-2 rounded-xl px-5 text-xs font-semibold text-white shadow-sm transition-all hover:opacity-95"
            style={{
              background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})`,
            }}
          >
            <i className="fa-solid fa-plus text-[10px]"></i> 
            <span>Create Course</span>
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
         KPI METRICS
         ================================================================== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Courses</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#006FBF]/10 text-[#006FBF]">
              <i className="fa-solid fa-book-open text-xs"></i>
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">84</p>
          <p className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-emerald-600">
            <i className="fa-solid fa-arrow-trend-up"></i> 
            <span>Fall Semester 2026</span>
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Enrolled Students</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <i className="fa-solid fa-user-graduate text-xs"></i>
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">1,248</p>
          <p className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-emerald-600">
             <i className="fa-solid fa-circle-check"></i>
             <span>98% seat capacity filled</span>
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Faculty Members</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <i className="fa-solid fa-chalkboard-user text-xs"></i>
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">64</p>
          <p className="mt-1 text-[11px] font-medium text-slate-500">
             Full & part-time instructors
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average GPA</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <i className="fa-solid fa-award text-xs"></i>
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">3.48</p>
          <p className="mt-1 text-[11px] font-medium text-slate-500">
             Institutional cumulative
          </p>
        </div>
      </div>

      {/* ==================================================================
         DATA TABLE & TOOLBAR
         ================================================================== */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 border-b border-slate-100 bg-white">
          <div className="relative flex-1 max-w-md">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-xs text-slate-400"></i>
            <input
              type="text"
              placeholder="Search course title, code, or instructor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10"
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-500">Dept:</span>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-700 outline-none transition-all focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10"
              >
                <option value="All">All Departments</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="Humanities">Humanities</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Arts">Arts</option>
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
                <option value="Upcoming">Upcoming</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Course Code / Title</th>
                <th className="py-3.5 px-6">Department</th>
                <th className="py-3.5 px-6">Instructor</th>
                <th className="py-3.5 px-6">Enrollment</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((crs) => (
                  <tr key={crs.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-3 px-6">
                      <div className="font-semibold text-slate-900 font-mono text-xs">{crs.code}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{crs.title}</div>
                    </td>
                    <td className="py-3 px-6 text-slate-600 text-[11px] font-medium">{crs.department}</td>
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-2 text-slate-700 text-[11px] font-medium">
                         <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-bold border border-slate-200/80">
                           {crs.instructor.charAt(0)}
                         </div>
                         {crs.instructor}
                      </div>
                    </td>
                    <td className="py-3 px-6">
                      <div className="text-slate-700 font-mono text-[11px] font-medium mb-1.5 flex justify-between items-center w-28">
                        <span>{crs.enrolledCount} <span className="text-slate-400">/ {crs.capacity}</span></span>
                        <span className="text-[9px] text-slate-400">{Math.round((crs.enrolledCount / crs.capacity) * 100)}%</span>
                      </div>
                      <div className="w-28 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${(crs.enrolledCount / crs.capacity) * 100}%`,
                            background: `linear-gradient(90deg, ${BRAND.brightBlue}, ${BRAND.cyan})`
                          }}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-6">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${getStatusBadge(crs.status)}`}>
                        {crs.status}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-right">
                      <button className="text-[#006FBF] hover:text-[#012E54] font-semibold text-[11px] px-2 py-1 rounded-lg hover:bg-[#006FBF]/5 transition-colors">
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                     <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400 mb-3">
                        <i className="fa-solid fa-book-open-reader text-lg"></i>
                     </div>
                     <p className="text-xs font-semibold text-slate-600">No matching courses found</p>
                     <p className="text-[11px] text-slate-400 mt-1">Try adjusting your filters or search criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================================================================
         CREATE COURSE MODAL
         ================================================================== */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200/80 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Create New Academic Course</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Register a new module to the catalog.</p>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-200/50 hover:text-slate-600 transition-colors"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            <form onSubmit={handleCreateCourse}>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Course Code <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. PHY-301"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-mono uppercase text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Department <span className="text-rose-500">*</span>
                    </label>
                    <select className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 outline-none transition-all focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10">
                      <option value="Mathematics">Mathematics</option>
                      <option value="Science">Science</option>
                      <option value="Humanities">Humanities</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Arts">Arts</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Course Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Advanced Quantum Physics"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Assigned Instructor
                  </label>
                  <select className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 outline-none transition-all focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10">
                    <option value="Dr. Robert Langdon">Dr. Robert Langdon</option>
                    <option value="Dr. Marie Curie">Dr. Marie Curie</option>
                    <option value="Prof. Margaret Atwood">Prof. Margaret Atwood</option>
                    <option value="Dr. Alan Turing">Dr. Alan Turing</option>
                    <option value="Prof. Leonardo da Vinci">Prof. Leonardo da Vinci</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Seat Capacity <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      defaultValue={30}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 outline-none transition-all focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Semester <span className="text-rose-500">*</span>
                    </label>
                    <select className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 outline-none transition-all focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10">
                      <option value="Fall 2026">Fall Semester 2026</option>
                      <option value="Spring 2027">Spring Semester 2027</option>
                    </select>
                  </div>
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