'use client';

import { useState } from 'react';
import Link from 'next/link';

// TypeScript interface for an applicant
interface Applicant {
  id: string;
  applicantName: string;
  gradeApplying: string;
  guardianName: string;
  guardianEmail: string;
  submissionDate: string;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected';
}

// Initial mock data (replace with API/database fetch in production)
const initialApplicants: Applicant[] = [
  {
    id: 'APP-2026-001',
    applicantName: 'Liam Johnson',
    gradeApplying: 'Grade 9',
    guardianName: 'Sarah Johnson',
    guardianEmail: 'sarah.j@example.com',
    submissionDate: '2026-03-28',
    status: 'Pending',
  },
  {
    id: 'APP-2026-002',
    applicantName: 'Aisha Patel',
    gradeApplying: 'Grade 6',
    guardianName: 'Rajesh Patel',
    guardianEmail: 'rajesh.patel@example.com',
    submissionDate: '2026-03-27',
    status: 'Under Review',
  },
  {
    id: 'APP-2026-003',
    applicantName: 'Carlos Gomez',
    gradeApplying: 'Grade 10',
    guardianName: 'Elena Gomez',
    guardianEmail: 'elena.gomez@example.com',
    submissionDate: '2026-03-25',
    status: 'Approved',
  },
  {
    id: 'APP-2026-004',
    applicantName: 'Chloe Smith',
    gradeApplying: 'Grade 8',
    guardianName: 'Mark Smith',
    guardianEmail: 'mark.smith@example.com',
    submissionDate: '2026-03-24',
    status: 'Rejected',
  },
];

export default function AdmissionsPage() {
  const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Filter logic based on search input and status tab selection
  const filteredApplicants = applicants.filter((app) => {
    const matchesSearch =
      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.guardianName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Helper function for status styling badges
  const getStatusBadge = (status: Applicant['status']) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Under Review':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Rejected':
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
            Admissions & Enrollment
          </h1>
          <p className="text-sm text-slate-500">
            Manage incoming student registration forms, entrance evaluations, and onboarding status.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors">
            <i className="fa-solid fa-plus mr-2 text-xs"></i> New Application
          </button>
        </div>
      </div>

      {/* Summary Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Applications</p>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <i className="fa-solid fa-folder-open text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{applicants.length}</p>
          <span className="text-xs text-emerald-600 font-medium"><i className="fa-solid fa-arrow-trend-up mr-1"></i> +12% from last month</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Review</p>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <i className="fa-solid fa-clock text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {applicants.filter(a => a.status === 'Pending').length}
          </p>
          <span className="text-xs text-slate-500 font-medium">Awaiting evaluation</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Approved</p>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <i className="fa-solid fa-circle-check text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {applicants.filter(a => a.status === 'Approved').length}
          </p>
          <span className="text-xs text-emerald-600 font-medium">Ready for fee onboarding</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Enrolled This Term</p>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <i className="fa-solid fa-graduation-cap text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">142</p>
          <span className="text-xs text-slate-500 font-medium">Across all streams</span>
        </div>
      </div>

      {/* Toolbar: Search and Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-xs text-slate-400"></i>
          <input
            type="text"
            placeholder="Search by student name, ID or guardian..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          {['All', 'Pending', 'Under Review', 'Approved', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Applicants Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Applicant / ID</th>
                <th className="py-3 px-4">Target Grade</th>
                <th className="py-3 px-4">Guardian Details</th>
                <th className="py-3 px-4">Submitted On</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredApplicants.length > 0 ? (
                filteredApplicants.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{app.applicantName}</div>
                      <div className="text-xs text-slate-500 font-mono">{app.id}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">{app.gradeApplying}</td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-900 font-medium">{app.guardianName}</div>
                      <div className="text-xs text-slate-500">{app.guardianEmail}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs">{app.submissionDate}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-xs px-2 py-1 rounded hover:bg-blue-50 transition-colors">
                        Review
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 text-sm">
                    No matching admissions applications found.
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