'use client';

import { useState } from 'react';
import Link from 'next/link';

// TypeScript interface for a Teacher Profile
interface TeacherProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  subjects: string[];
  assignedClasses: string[];
  status: 'Active' | 'On Leave' | 'Part-Time';
}

// Initial mock data for teachers
const initialTeachers: TeacherProfile[] = [
  {
    id: 'TCH-101',
    fullName: 'Mr. David Wilson',
    email: 'david.wilson@elimix.edu',
    phone: '+1 (555) 112-2334',
    department: 'Mathematics',
    subjects: ['Algebra II', 'Calculus'],
    assignedClasses: ['Grade 6 East', 'Grade 8 South'],
    status: 'Active',
  },
  {
    id: 'TCH-102',
    fullName: 'Ms. Emily Davis',
    email: 'emily.davis@elimix.edu',
    phone: '+1 (555) 223-3445',
    department: 'Science & Physics',
    subjects: ['General Science', 'Chemistry'],
    assignedClasses: ['Grade 6 West', 'Grade 7 North'],
    status: 'Active',
  },
  {
    id: 'TCH-103',
    fullName: 'Dr. James Anderson',
    email: 'james.anderson@elimix.edu',
    phone: '+1 (555) 334-4556',
    department: 'Humanities & History',
    subjects: ['World History', 'Geography'],
    assignedClasses: ['Grade 9 East', 'Grade 10 North'],
    status: 'Active',
  },
  {
    id: 'TCH-104',
    fullName: 'Mrs. Amanda Martinez',
    email: 'amanda.martinez@elimix.edu',
    phone: '+1 (555) 445-5667',
    department: 'Languages & Literature',
    subjects: ['English Literature', 'Creative Writing'],
    assignedClasses: ['Grade 8 South', 'Grade 9 West'],
    status: 'On Leave',
  },
  {
    id: 'TCH-105',
    fullName: 'Mr. Robert Taylor',
    email: 'robert.taylor@elimix.edu',
    phone: '+1 (555) 556-6778',
    department: 'Arts & Athletics',
    subjects: ['Physical Education', 'Fine Arts'],
    assignedClasses: ['Grade 6-10 General'],
    status: 'Part-Time',
  },
];

export default function TeachersDirectoryPage() {
  const [teachers, setTeachers] = useState<TeacherProfile[]>(initialTeachers);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Filter logic based on search, department, and employment status
  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.subjects.some((sub) => sub.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDept = departmentFilter === 'All' || teacher.department === departmentFilter;
    const matchesStatus = statusFilter === 'All' || teacher.status === statusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  // Helper for employment status badge styling
  const getStatusBadge = (status: TeacherProfile['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'On Leave':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Part-Time':
        return 'bg-blue-50 text-blue-700 border-blue-200';
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
            Teachers Directory
          </h1>
          <p className="text-sm text-slate-500">
            Manage faculty profiles, department assignments, teaching workloads, and credentials.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/teachers/attendance"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <i className="fa-solid fa-clipboard-user mr-2 text-xs text-blue-600"></i> Staff Attendance
          </Link>
          <button className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors">
            <i className="fa-solid fa-user-plus mr-2 text-xs"></i> Add Teacher
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Faculty</p>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <i className="fa-solid fa-chalkboard-user text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">64</p>
          <span className="text-xs text-emerald-600 font-medium"><i className="fa-solid fa-arrow-trend-up mr-1"></i> Full & part-time staff</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Today</p>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <i className="fa-solid fa-user-check text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">58</p>
          <span className="text-xs text-emerald-600 font-medium">Present on campus</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Departments</p>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <i className="fa-solid fa-building-columns text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">8</p>
          <span className="text-xs text-slate-500 font-medium">Academic & operational</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Student-Teacher Ratio</p>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <i className="fa-solid fa-scale-balanced text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">14:1</p>
          <span className="text-xs text-amber-600 font-medium">Optimal balance</span>
        </div>
      </div>

      {/* Toolbar: Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-xs text-slate-400"></i>
          <input
            type="text"
            placeholder="Search teacher name, email, department, or subject..."
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
              <option value="Science & Physics">Science & Physics</option>
              <option value="Humanities & History">Humanities & History</option>
              <option value="Languages & Literature">Languages & Literature</option>
              <option value="Arts & Athletics">Arts & Athletics</option>
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
              <option value="On Leave">On Leave</option>
              <option value="Part-Time">Part-Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Teachers Data Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Teacher Name / ID</th>
                <th className="py-3 px-4">Contact Details</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Subjects Taught</th>
                <th className="py-3 px-4">Employment Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{teacher.fullName}</div>
                      <div className="text-xs text-slate-500 font-mono">{teacher.id}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 font-medium text-xs">{teacher.email}</div>
                      <div className="text-xs text-slate-500">{teacher.phone}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium text-xs">{teacher.department}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {teacher.subjects.map((sub, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs">
                            {sub}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(teacher.status)}`}>
                        {teacher.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-xs px-2 py-1 rounded hover:bg-blue-50 transition-colors">
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 text-sm">
                    No matching teacher records found.
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