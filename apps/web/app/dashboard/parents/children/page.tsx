'use client';

import { useState } from 'react';
import Link from 'next/link';

// TypeScript interface for a Linked Child and Guardian Record
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

// Initial mock data for parent-child links
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

  // Filter logic based on search and relationship
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Linked Children & Guardians
          </h1>
          <p className="text-sm text-slate-500">
            Monitor and configure family relationships, primary contact designations, and student sponsorships.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/parents"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <i className="fa-solid fa-users mr-2 text-xs text-blue-600"></i> Parent Directory
          </Link>
          <button className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors">
            <i className="fa-solid fa-link mr-2 text-xs"></i> Link New Child
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Linkages</p>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <i className="fa-solid fa-link text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">842</p>
          <span className="text-xs text-emerald-600 font-medium"><i className="fa-solid fa-arrow-trend-up mr-1"></i> Active student links</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Primary Contacts</p>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <i className="fa-solid fa-user-shield text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">764</p>
          <span className="text-xs text-emerald-600 font-medium">Verified primary guardians</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Multi-Child Families</p>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <i className="fa-solid fa-people-roof text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">98</p>
          <span className="text-xs text-slate-500 font-medium">Families with 2+ students</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Approvals</p>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <i className="fa-solid fa-clock text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">14</p>
          <span className="text-xs text-amber-600 font-medium">Requested linkage updates</span>
        </div>
      </div>

      {/* Toolbar: Search and Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-xs text-slate-400"></i>
          <input
            type="text"
            placeholder="Search student name, admission no, or guardian..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Relationship Filter */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
          <span>Relationship:</span>
          <select
            value={relationshipFilter}
            onChange={(e) => setRelationshipFilter(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
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
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Student Name / Admission</th>
                <th className="py-3 px-4">Class & Stream</th>
                <th className="py-3 px-4">Guardian Name</th>
                <th className="py-3 px-4">Relationship</th>
                <th className="py-3 px-4">Contact Type</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredLinks.length > 0 ? (
                filteredLinks.map((link) => (
                  <tr key={link.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{link.studentName}</div>
                      <div className="text-xs text-slate-500 font-mono">{link.admissionNo}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium text-xs">{link.classGrade}</td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-900 font-medium">{link.guardianName}</div>
                      <div className="text-xs text-slate-500">{link.guardianEmail}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 text-xs font-medium">
                      <span className="px-2 py-1 bg-slate-100 rounded-md">{link.relationship}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      {link.isPrimaryContact ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          Primary Contact
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-200">
                          Secondary
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-xs px-2 py-1 rounded hover:bg-blue-50 transition-colors">
                        Manage Link
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 text-sm">
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