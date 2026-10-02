'use client';

import { useState } from 'react';
import Link from 'next/link';

// TypeScript interface for Teacher Attendance Record
interface TeacherAttendanceRecord {
  id: string;
  teacherId: string;
  teacherName: string;
  department: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'Present' | 'Late' | 'Absent' | 'On Leave';
}

// Initial mock data for teacher attendance
const initialAttendance: TeacherAttendanceRecord[] = [
  {
    id: 'ATT-001',
    teacherId: 'TCH-101',
    teacherName: 'Mr. David Wilson',
    department: 'Mathematics',
    date: '2026-10-02',
    checkIn: '07:45 AM',
    checkOut: '04:15 PM',
    status: 'Present',
  },
  {
    id: 'ATT-002',
    teacherId: 'TCH-102',
    teacherName: 'Ms. Emily Davis',
    department: 'Science & Physics',
    date: '2026-10-02',
    checkIn: '08:22 AM',
    checkOut: 'Pending',
    status: 'Late',
  },
  {
    id: 'ATT-003',
    teacherId: 'TCH-103',
    teacherName: 'Dr. James Anderson',
    department: 'Humanities & History',
    date: '2026-10-02',
    checkIn: '07:30 AM',
    checkOut: '03:50 PM',
    status: 'Present',
  },
  {
    id: 'ATT-004',
    teacherId: 'TCH-104',
    teacherName: 'Mrs. Amanda Martinez',
    department: 'Languages & Literature',
    date: '2026-10-02',
    checkIn: '--',
    checkOut: '--',
    status: 'On Leave',
  },
  {
    id: 'ATT-005',
    teacherId: 'TCH-105',
    teacherName: 'Mr. Robert Taylor',
    department: 'Arts & Athletics',
    date: '2026-10-02',
    checkIn: '--',
    checkOut: '--',
    status: 'Absent',
  },
];

export default function TeacherAttendancePage() {
  const [attendanceRecords, setAttendanceRecords] = useState<TeacherAttendanceRecord[]>(initialAttendance);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  // Filter logic based on search, status, and department
  const filteredRecords = attendanceRecords.filter((record) => {
    const matchesSearch =
      record.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.teacherId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || record.status === statusFilter;
    const matchesDept = departmentFilter === 'All' || record.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesDept;
  });

  // Helper for attendance status badge styling
  const getStatusBadge = (status: TeacherAttendanceRecord['status']) => {
    switch (status) {
      case 'Present':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Late':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Absent':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'On Leave':
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
            Staff & Teacher Attendance
          </h1>
          <p className="text-sm text-slate-500">
            Monitor daily check-ins, punctuality, leaves, and attendance logs for faculty members.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/teachers"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <i className="fa-solid fa-chalkboard-user mr-2 text-xs text-blue-600"></i> Teachers Directory
          </Link>
          <button className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors">
            <i className="fa-solid fa-file-arrow-down mr-2 text-xs"></i> Export Report
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Scheduled</p>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <i className="fa-solid fa-users text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">64</p>
          <span className="text-xs text-slate-500 font-medium">Expected on campus</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Present Today</p>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <i className="fa-solid fa-user-check text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">56</p>
          <span className="text-xs text-emerald-600 font-medium"><i className="fa-solid fa-arrow-trend-up mr-1"></i> 87.5% attendance rate</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Late Arrivals</p>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <i className="fa-solid fa-clock text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">4</p>
          <span className="text-xs text-amber-600 font-medium">Checked in after 08:00 AM</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Absent / On Leave</p>
            <div className="rounded-lg bg-rose-50 p-2 text-rose-600">
              <i className="fa-solid fa-user-xmark text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">4</p>
          <span className="text-xs text-rose-600 font-medium">Covered by substitutes</span>
        </div>
      </div>

      {/* Toolbar: Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-xs text-slate-400"></i>
          <input
            type="text"
            placeholder="Search teacher name, ID, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Filters Group */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="Present">Present</option>
              <option value="Late">Late</option>
              <option value="Absent">Absent</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>

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
        </div>
      </div>

      {/* Attendance Data Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Teacher Name / ID</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Check-In Time</th>
                <th className="py-3 px-4">Check-Out Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{record.teacherName}</div>
                      <div className="text-xs text-slate-500 font-mono">{record.teacherId}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium text-xs">{record.department}</td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs font-medium">{record.date}</td>
                    <td className="py-3.5 px-4 text-slate-800 font-mono text-xs">{record.checkIn}</td>
                    <td className="py-3.5 px-4 text-slate-800 font-mono text-xs">{record.checkOut}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-xs px-2 py-1 rounded hover:bg-blue-50 transition-colors">
                        Edit Record
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-sm">
                    No matching teacher attendance records found.
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