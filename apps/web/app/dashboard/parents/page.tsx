'use client';

import { useState } from 'react';
import Link from 'next/link';

// TypeScript interface for a Parent / Guardian
interface ParentGuardian {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  relationship: 'Father' | 'Mother' | 'Guardian' | 'Sponsor';
  linkedChildren: { name: string; classGrade: string }[];
  portalStatus: 'Active' | 'Invited' | 'Disabled';
}

// Initial mock data for parents
const initialParents: ParentGuardian[] = [
  {
    id: 'PAR-2026-001',
    fullName: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '+1 (555) 234-5678',
    relationship: 'Mother',
    linkedChildren: [{ name: 'Liam Johnson', classGrade: 'Grade 9 East' }],
    portalStatus: 'Active',
  },
  {
    id: 'PAR-2026-002',
    fullName: 'Rajesh Patel',
    email: 'rajesh.patel@example.com',
    phone: '+1 (555) 876-5432',
    relationship: 'Father',
    linkedChildren: [{ name: 'Aisha Patel', classGrade: 'Grade 6 West' }],
    portalStatus: 'Active',
  },
  {
    id: 'PAR-2026-003',
    fullName: 'Elena Gomez',
    email: 'elena.gomez@example.com',
    phone: '+1 (555) 345-6789',
    relationship: 'Mother',
    linkedChildren: [{ name: 'Carlos Gomez', classGrade: 'Grade 10 North' }],
    portalStatus: 'Invited',
  },
  {
    id: 'PAR-2026-004',
    fullName: 'Mark Smith',
    email: 'mark.smith@example.com',
    phone: '+1 (555) 987-6543',
    relationship: 'Father',
    linkedChildren: [{ name: 'Chloe Smith', classGrade: 'Grade 8 South' }],
    portalStatus: 'Active',
  },
];

export default function ParentDirectoryPage() {
  const [parents, setParents] = useState<ParentGuardian[]>(initialParents);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Filter logic based on search and portal status
  const filteredParents = parents.filter((parent) => {
    const matchesSearch =
      parent.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parent.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parent.phone.includes(searchQuery) ||
      parent.linkedChildren.some((child) => child.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || parent.portalStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Helper for portal status badge styling
  const getStatusBadge = (status: ParentGuardian['portalStatus']) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Invited':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Disabled':
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
            Parent Directory
          </h1>
          <p className="text-sm text-slate-500">
            Manage parent and guardian profiles, view linked students, and monitor portal access credentials.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/parents/access"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <i className="fa-solid fa-shield-halved mr-2 text-xs text-blue-600"></i> Access Logs
          </Link>
          <button className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors">
            <i className="fa-solid fa-user-plus mr-2 text-xs"></i> Add Guardian
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Guardians</p>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <i className="fa-solid fa-users text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">764</p>
          <span className="text-xs text-emerald-600 font-medium"><i className="fa-solid fa-arrow-trend-up mr-1"></i> Connected to student body</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Portal Users</p>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <i className="fa-solid fa-circle-check text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">682</p>
          <span className="text-xs text-emerald-600 font-medium">App & web active</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Invites</p>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <i className="fa-solid fa-envelope text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">82</p>
          <span className="text-xs text-amber-600 font-medium">Awaiting activation</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Notifications Sent</p>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <i className="fa-solid fa-bell text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">1,420</p>
          <span className="text-xs text-slate-500 font-medium">This month</span>
        </div>
      </div>

      {/* Toolbar: Search and Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-xs text-slate-400"></i>
          <input
            type="text"
            placeholder="Search guardian name, email, phone, or child..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Portal Status Filter */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
          <span>Portal Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Invited">Invited</option>
            <option value="Disabled">Disabled</option>
          </select>
        </div>
      </div>

      {/* Parents Data Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Parent / Guardian Name</th>
                <th className="py-3 px-4">Contact Details</th>
                <th className="py-3 px-4">Relationship</th>
                <th className="py-3 px-4">Linked Children</th>
                <th className="py-3 px-4">Portal Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredParents.length > 0 ? (
                filteredParents.map((parent) => (
                  <tr key={parent.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{parent.fullName}</div>
                      <div className="text-xs text-slate-500 font-mono">{parent.id}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 font-medium text-xs">{parent.email}</div>
                      <div className="text-xs text-slate-500">{parent.phone}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium text-xs">
                      <span className="px-2 py-1 bg-slate-100 rounded-md">{parent.relationship}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      {parent.linkedChildren.map((child, idx) => (
                        <div key={idx} className="text-xs">
                          <span className="font-medium text-slate-900">{child.name}</span>
                          <span className="text-slate-500 ml-1">({child.classGrade})</span>
                        </div>
                      ))}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(parent.portalStatus)}`}>
                        {parent.portalStatus}
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
                    No matching parent or guardian records found.
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