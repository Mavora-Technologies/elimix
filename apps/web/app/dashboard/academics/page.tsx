'use client';

import { useState } from 'react';
import Link from 'next/link';

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
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Finalizing':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Archived':
        return 'bg-slate-50 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Academics Overview & Grade Streams
          </h1>
          <p className="text-sm text-slate-500">
            Manage school curriculums, grade streams, subject allocation, and academic performance tracking.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/academics/timetables"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <i className="fa-solid fa-calendar-days mr-2 text-xs text-blue-600"></i> Master Timetable
          </Link>
          <button className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors">
            <i className="fa-solid fa-plus mr-2 text-xs"></i> Add Grade Stream
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Grade Streams</p>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <i className="fa-solid fa-layer-group text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">18</p>
          <span className="text-xs text-emerald-600 font-medium"><i className="fa-solid fa-arrow-trend-up mr-1"></i> Full capacity</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Enrolled Students</p>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <i className="fa-solid fa-user-graduate text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">764</p>
          <span className="text-xs text-emerald-600 font-medium">Across all streams</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Subjects</p>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <i className="fa-solid fa-book text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">24</p>
          <span className="text-xs text-slate-500 font-medium">Core & electives</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Term Completion</p>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <i className="fa-solid fa-chart-pie text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">65%</p>
          <span className="text-xs text-amber-600 font-medium">Term 3 in progress</span>
        </div>
      </div>

      {/* Toolbar: Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-xs text-slate-400"></i>
          <input
            type="text"
            placeholder="Search stream name, grade level, or head teacher..."
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
              <option value="Grade 6">Grade 6</option>
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
              <option value="Active">Active</option>
              <option value="Finalizing">Finalizing</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grade Streams Data Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Stream Name / ID</th>
                <th className="py-3 px-4">Grade Level</th>
                <th className="py-3 px-4">Head Teacher</th>
                <th className="py-3 px-4">Enrolled Students</th>
                <th className="py-3 px-4">Subjects</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredStreams.length > 0 ? (
                filteredStreams.map((stream) => (
                  <tr key={stream.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{stream.name}</div>
                      <div className="text-xs text-slate-500 font-mono">{stream.id}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium text-xs">{stream.gradeLevel}</td>
                    <td className="py-3.5 px-4 text-slate-800 text-xs font-medium">{stream.headTeacher}</td>
                    <td className="py-3.5 px-4 text-slate-800 font-medium">{stream.studentCount}</td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs font-medium">{stream.subjectsCount} subjects</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(stream.status)}`}>
                        {stream.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <Link
                        href="/dashboard/academics/timetables"
                        className="text-blue-600 hover:text-blue-800 font-medium text-xs px-2 py-1 rounded hover:bg-blue-50 transition-colors inline-block"
                      >
                        Timetable
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-sm">
                    No matching academic grade streams found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}