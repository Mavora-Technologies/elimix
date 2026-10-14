// apps/web/app/dashboard/parents/links/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

interface LinkedChildRecord {
  id: string;
  studentName: string;
  admissionNo: string;
  classGrade: string;
  guardianName: string;
  guardianEmail: string;
  relationship: 'Father' | 'Mother' | 'Guardian' | 'Sponsor';
  isPrimaryContact: boolean;
}

const initialLinks: LinkedChildRecord[] = [
  {
    id: 'LNK-001',
    studentName: 'Liam Johnson',
    admissionNo: 'ADM/2024/104',
    classGrade: 'Grade 9 East',
    guardianName: 'Sarah Johnson',
    guardianEmail: 'sarah.j@example.com',
    relationship: 'Mother',
    isPrimaryContact: true,
  },
  {
    id: 'LNK-002',
    studentName: 'Aisha Patel',
    admissionNo: 'ADM/2024/115',
    classGrade: 'Grade 6 West',
    guardianName: 'Rajesh Patel',
    guardianEmail: 'rajesh.patel@example.com',
    relationship: 'Father',
    isPrimaryContact: true,
  },
  {
    id: 'LNK-003',
    studentName: 'Carlos Gomez',
    admissionNo: 'ADM/2023/089',
    classGrade: 'Grade 10 North',
    guardianName: 'Elena Gomez',
    guardianEmail: 'elena.gomez@example.com',
    relationship: 'Mother',
    isPrimaryContact: true,
  },
  {
    id: 'LNK-004',
    studentName: 'Chloe Smith',
    admissionNo: 'ADM/2025/022',
    classGrade: 'Grade 8 South',
    guardianName: 'Mark Smith',
    guardianEmail: 'mark.smith@example.com',
    relationship: 'Father',
    isPrimaryContact: true,
  },
];

export default function LinkedChildrenPage() {
  const [links, setLinks] = useState<LinkedChildRecord[]>(initialLinks);
  const [searchQuery, setSearchQuery] = useState('');
  const [relationshipFilter, setRelationshipFilter] = useState('All');

  // Filter logic
  const filteredLinks = links.filter((link) => {
    const matchesSearch =
      link.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.guardianName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.guardianEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRelationship =
      relationshipFilter === 'All' || link.relationship === relationshipFilter;

    return matchesSearch && matchesRelationship;
  });

  return (
    <div className="flex-1 w-full min-w-0 bg-[#f4f7fb] min-h-screen p-4 sm:p-6 lg:p-8 font-sans overflow-x-hidden text-[#042954]">
      
      {/* Page Header */}
      <div className="mb-6 lg:mb-8 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-extrabold text-[#042954] mb-1 tracking-tight">
            Linked Children & Guardians
          </h1>
          <p className="text-[12px] text-[#64748b]">
            Monitor and configure family relationships, primary contact designations, and student sponsorships.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard/parents"
            className="h-[38px] px-4 rounded-xl border border-[#cbd5e1] bg-white text-[12px] font-semibold text-[#042954] hover:bg-slate-50 transition-colors shadow-sm flex items-center"
          >
            <i className="fa-solid fa-users mr-2 text-xs text-[#0ea5e9]"></i> Parent Directory
          </Link>
          <button className="h-[38px] px-4 rounded-xl bg-gradient-to-r from-[#042954] to-[#0ea5e9] text-white text-[12px] font-semibold hover:opacity-95 transition-all shadow-md shadow-sky-500/20 flex items-center justify-center">
            <i className="fa-solid fa-link mr-2 text-xs"></i> Link New Child
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 w-full">
        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Total Linkages</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">842</h3>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center mt-1">
              <i className="fa-solid fa-arrow-trend-up mr-1"></i> Active student links
            </span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-sky-50 text-[#0ea5e9] flex items-center justify-center shrink-0">
            <i className="fa-solid fa-link text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Primary Contacts</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">764</h3>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Verified primary guardians</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-teal-50 text-[#06b6d4] flex items-center justify-center shrink-0">
            <i className="fa-solid fa-user-shield text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Multi-Child Families</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">98</h3>
            <span className="text-[11px] text-[#64748b] font-semibold mt-1 block">Families with 2+ students</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-people-roof text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Pending Approvals</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">14</h3>
            <span className="text-[11px] text-amber-600 font-semibold mt-1 block">Requested linkage updates</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-clock text-lg"></i>
          </div>
        </div>
      </div>

      {/* Toolbar: Search and Filter */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#e2e8f0] mb-6 w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-[360px]">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[12px]"></i>
          <input
            type="text"
            placeholder="Search student name, admission no, or guardian..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[40px] pl-9 pr-3 rounded-xl border border-[#cbd5e1] text-[12px] font-medium text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9] focus:ring-2 focus:ring-sky-500/20"
          />
        </div>

        <div className="flex items-center gap-2 text-[12px] font-medium text-[#64748b]">
          <span>Relationship:</span>
          <select
            value={relationshipFilter}
            onChange={(e) => setRelationshipFilter(e.target.value)}
            className="h-[38px] px-3 rounded-xl border border-[#cbd5e1] text-[12px] font-semibold text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9] cursor-pointer"
          >
            <option value="All">All Relationships</option>
            <option value="Father">Father</option>
            <option value="Mother">Mother</option>
            <option value="Guardian">Guardian</option>
            <option value="Sponsor">Sponsor</option>
          </select>
        </div>
      </div>

      {/* Linked Children Data Table */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                <th className="py-3.5 px-5">Student Name / Admission</th>
                <th className="py-3.5 px-5">Class & Stream</th>
                <th className="py-3.5 px-5">Guardian Name</th>
                <th className="py-3.5 px-5">Relationship</th>
                <th className="py-3.5 px-5">Contact Type</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
              {filteredLinks.length > 0 ? (
                filteredLinks.map((link) => (
                  <tr key={link.id} className="hover:bg-slate-50/75 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-bold text-[#042954]">{link.studentName}</div>
                      <div className="text-[11px] text-[#64748b] font-mono mt-0.5">{link.admissionNo}</div>
                    </td>
                    <td className="py-4 px-5 text-slate-700 font-semibold text-[12px]">{link.classGrade}</td>
                    <td className="py-4 px-5">
                      <div className="text-[#042954] font-semibold text-[12px]">{link.guardianName}</div>
                      <div className="text-[11px] text-[#64748b] mt-0.5">{link.guardianEmail}</div>
                    </td>
                    <td className="py-4 px-5">
                      <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-[11px] font-bold text-slate-700">
                        {link.relationship}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      {link.isPrimaryContact ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-sky-50 text-[#0ea5e9] border border-sky-200">
                          Primary Contact
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-slate-50 text-slate-600 border border-slate-200">
                          Secondary
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button className="h-[32px] px-3 rounded-lg bg-sky-50 text-[#0ea5e9] hover:bg-sky-100 font-semibold text-[12px] transition-colors">
                        Manage Link
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#64748b] text-[13px]">
                    No matching child-guardian linkage records found.
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