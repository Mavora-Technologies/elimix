'use client';

import { useState } from 'react';
import Link from 'next/link';

// TypeScript interface for a Student
interface Student {
  id: string;
  admissionNo: string;
  fullName: string;
  classGrade: string;
  stream: string;
  gender: 'Male' | 'Female';
  guardianName: string;
  guardianPhone: string;
  feeStatus: 'Paid' | 'Partial' | 'Overdue';
}

// Initial mock student data
const initialStudents: Student[] = [
  {
    id: 'STU-2026-001',
    admissionNo: 'ADM/2024/104',
    fullName: 'Liam Johnson',
    classGrade: 'Grade 9',
    stream: 'East',
    gender: 'Male',
    guardianName: 'Sarah Johnson',
    guardianPhone: '+1 (555) 234-5678',
    feeStatus: 'Paid',
  },
  {
    id: 'STU-2026-002',
    admissionNo: 'ADM/2024/115',
    fullName: 'Aisha Patel',
    classGrade: 'Grade 6',
    stream: 'West',
    gender: 'Female',
    guardianName: 'Rajesh Patel',
    guardianPhone: '+1 (555) 876-5432',
    feeStatus: 'Partial',
  },
  {
    id: 'STU-2026-003',
    admissionNo: 'ADM/2023/089',
    fullName: 'Carlos Gomez',
    classGrade: 'Grade 10',
    stream: 'North',
    gender: 'Male',
    guardianName: 'Elena Gomez',
    guardianPhone: '+1 (555) 345-6789',
    feeStatus: 'Overdue',
  },
  {
    id: 'STU-2026-004',
    admissionNo: 'ADM/2025/022',
    fullName: 'Chloe Smith',
    classGrade: 'Grade 8',
    stream: 'South',
    gender: 'Female',
    guardianName: 'Mark Smith',
    guardianPhone: '+1 (555) 987-6543',
    feeStatus: 'Paid',
  },
];

export default function StudentDirectoryPage() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('All');
  const [feeFilter, setFeeFilter] = useState('All');

  // Filter logic based on search, class, and fee status
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.guardianName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesClass = classFilter === 'All' || student.classGrade === classFilter;
    const matchesFee = feeFilter === 'All' || student.feeStatus === feeFilter;

    return matchesSearch && matchesClass && matchesFee;
  });

  // Helper for fee status badge styling
  const getFeeBadge = (status: Student['feeStatus']) => {
    switch (status) {
      case 'Paid':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Partial':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Overdue':
        return 'bg-rose-50 text-rose-700 border-rose-200';
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
            Student Directory
          </h1>
          <p className="text-sm text-slate-500">
            View, manage, and search all currently enrolled students across classes and streams.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/students/admissions"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <i className="fa-solid fa-user-plus mr-2 text-xs"></i> View Admissions
          </Link>
          <button className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors">
            <i className="fa-solid fa-plus mr-2 text-xs"></i> Add Student
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Enrolled</p>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <i className="fa-solid fa-user-graduate text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">842</p>
          <span className="text-xs text-emerald-600 font-medium"><i className="fa-solid fa-arrow-trend-up mr-1"></i> Active term roster</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Present Today</p>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <i className="fa-solid fa-clipboard-user text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">810</p>
          <span className="text-xs text-emerald-600 font-medium">96.2% Attendance Rate</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Fee Balances Clear</p>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <i className="fa-solid fa-wallet text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">653</p>
          <span className="text-xs text-slate-500 font-medium">Fully or partially paid</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Fee Alerts</p>
            <div className="rounded-lg bg-rose-50 p-2 text-rose-600">
              <i className="fa-solid fa-triangle-exclamation text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">189</p>
          <span className="text-xs text-rose-600 font-medium">Requires follow-up</span>
        </div>
      </div>

      {/* Toolbar: Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-xs text-slate-400"></i>
          <input
            type="text"
            placeholder="Search student name, admission no, guardian..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Filters Group */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Class Filter */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <span>Class:</span>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Classes</option>
              <option value="Grade 6">Grade 6</option>
              <option value="Grade 8">Grade 8</option>
              <option value="Grade 9">Grade 9</option>
              <option value="Grade 10">Grade 10</option>
            </select>
          </div>

          {/* Fee Status Filter */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <span>Fees:</span>
            <select
              value={feeFilter}
              onChange={(e) => setFeeFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Student / Admission No</th>
                <th className="py-3 px-4">Class & Stream</th>
                <th className="py-3 px-4">Gender</th>
                <th className="py-3 px-4">Parent / Guardian</th>
                <th className="py-3 px-4">Fee Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{student.fullName}</div>
                      <div className="text-xs text-slate-500 font-mono">{student.admissionNo}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-800">{student.classGrade}</span>
                      <span className="text-xs text-slate-500 ml-1.5">({student.stream})</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs">{student.gender}</td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-900 font-medium">{student.guardianName}</div>
                      <div className="text-xs text-slate-500">{student.guardianPhone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getFeeBadge(student.feeStatus)}`}>
                        {student.feeStatus}
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
                    No matching student records found.
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