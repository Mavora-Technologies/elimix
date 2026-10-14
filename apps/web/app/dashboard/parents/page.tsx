// apps/web/app/dashboard/parents/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ParentGuardian {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  relationship: 'Father' | 'Mother' | 'Guardian' | 'Sponsor';
  linkedChildren: { name: string; classGrade: string }[];
  portalStatus: 'Active' | 'Invited' | 'Disabled';
}

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

  // Filter logic
  const filteredParents = parents.filter((parent) => {
    const matchesSearch =
      parent.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parent.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parent.phone.includes(searchQuery) ||
      parent.linkedChildren.some((child) => child.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || parent.portalStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Portal status badge styling
  const getStatusBadge = (status: ParentGuardian['portalStatus']) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Invited':
        return 'bg-sky-50 text-[#0ea5e9] border-sky-200';
      case 'Disabled':
        return 'bg-slate-50 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="flex-1 w-full min-w-0 bg-[#f4f7fb] min-h-screen p-4 sm:p-6 lg:p-8 font-sans overflow-x-hidden text-[#042954]">
      
      {/* Page Header */}
      <div className="mb-6 lg:mb-8 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-extrabold text-[#042954] mb-1 tracking-tight">
            Parent Directory
          </h1>
          <p className="text-[12px] text-[#64748b]">
            Manage parent and guardian profiles, view linked students, and monitor portal access credentials.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard/parents/access"
            className="h-[38px] px-4 rounded-xl border border-[#cbd5e1] bg-white text-[12px] font-semibold text-[#042954] hover:bg-slate-50 transition-colors shadow-sm flex items-center"
          >
            <i className="fa-solid fa-shield-halved mr-2 text-xs text-[#0ea5e9]"></i> Access Logs
          </Link>
          <button className="h-[38px] px-4 rounded-xl bg-gradient-to-r from-[#042954] to-[#0ea5e9] text-white text-[12px] font-semibold hover:opacity-95 transition-all shadow-md shadow-sky-500/20 flex items-center justify-center">
            <i className="fa-solid fa-user-plus mr-2 text-xs"></i> Add Guardian
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 w-full">
        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Total Guardians</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">764</h3>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center mt-1">
              <i className="fa-solid fa-arrow-trend-up mr-1"></i> Connected to student body
            </span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-sky-50 text-[#0ea5e9] flex items-center justify-center shrink-0">
            <i className="fa-solid fa-users text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Active Portal Users</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">682</h3>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">App & web active</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-teal-50 text-[#06b6d4] flex items-center justify-center shrink-0">
            <i className="fa-solid fa-circle-check text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Pending Invites</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">82</h3>
            <span className="text-[11px] text-amber-600 font-semibold mt-1 block">Awaiting activation</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-envelope text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Notifications Sent</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">1,420</h3>
            <span className="text-[11px] text-[#64748b] font-semibold mt-1 block">This month</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-bell text-lg"></i>
          </div>
        </div>
      </div>

      {/* Toolbar: Search and Filter */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#e2e8f0] mb-6 w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-[360px]">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[12px]"></i>
          <input
            type="text"
            placeholder="Search guardian name, email, phone, or child..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[40px] pl-9 pr-3 rounded-xl border border-[#cbd5e1] text-[12px] font-medium text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9] focus:ring-2 focus:ring-sky-500/20"
          />
        </div>

        <div className="flex items-center gap-2 text-[12px] font-medium text-[#64748b]">
          <span>Portal Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-[38px] px-3 rounded-xl border border-[#cbd5e1] text-[12px] font-semibold text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9] cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Invited">Invited</option>
            <option value="Disabled">Disabled</option>
          </select>
        </div>
      </div>

      {/* Parents Data Table */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                <th className="py-3.5 px-5">Parent / Guardian Name</th>
                <th className="py-3.5 px-5">Contact Details</th>
                <th className="py-3.5 px-5">Relationship</th>
                <th className="py-3.5 px-5">Linked Children</th>
                <th className="py-3.5 px-5">Portal Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
              {filteredParents.length > 0 ? (
                filteredParents.map((parent) => (
                  <tr key={parent.id} className="hover:bg-slate-50/75 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-bold text-[#042954]">{parent.fullName}</div>
                      <div className="text-[11px] text-[#64748b] font-mono mt-0.5">{parent.id}</div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="text-[#042954] font-semibold text-[12px]">{parent.email}</div>
                      <div className="text-[11px] text-[#64748b] font-mono mt-0.5">{parent.phone}</div>
                    </td>
                    <td className="py-4 px-5">
                      <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-[11px] font-bold text-slate-700">
                        {parent.relationship}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      {parent.linkedChildren.map((child, idx) => (
                        <div key={idx} className="text-[12px]">
                          <span className="font-bold text-[#042954]">{child.name}</span>
                          <span className="text-[#64748b] ml-1 font-medium">({child.classGrade})</span>
                        </div>
                      ))}
                    </td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(parent.portalStatus)}`}>
                        {parent.portalStatus}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button className="h-[32px] px-3 rounded-lg bg-sky-50 text-[#0ea5e9] hover:bg-sky-100 font-semibold text-[12px] transition-colors">
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#64748b] text-[13px]">
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