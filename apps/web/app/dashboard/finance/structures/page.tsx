'use client';

import { useState } from 'react';
import Link from 'next/link';

// TypeScript interface for a Fee Structure
interface FeeStructureItem {
  id: string;
  name: string;
  gradeLevel: string;
  academicYear: string;
  billingFrequency: 'Annual' | 'Semester' | 'Monthly';
  totalAmount: string;
  enrolledCount: number;
  status: 'Active' | 'Draft' | 'Archived';
}

// Initial mock data for fee structures
const initialStructures: FeeStructureItem[] = [
  {
    id: 'STR-001',
    name: 'High School Comprehensive Tuition Plan',
    gradeLevel: 'Grades 9 - 12',
    academicYear: '2026 / 2027',
    billingFrequency: 'Semester',
    totalAmount: '$14,500.00',
    enrolledCount: 342,
    status: 'Active',
  },
  {
    id: 'STR-002',
    name: 'Middle School Standard Fee Structure',
    gradeLevel: 'Grades 6 - 8',
    academicYear: '2026 / 2027',
    billingFrequency: 'Semester',
    totalAmount: '$12,200.00',
    enrolledCount: 218,
    status: 'Active',
  },
  {
    id: 'STR-003',
    name: 'Elementary School Foundation Plan',
    gradeLevel: 'Kindergarten - Grade 5',
    academicYear: '2026 / 2027',
    billingFrequency: 'Monthly',
    totalAmount: '$9,800.00',
    enrolledCount: 185,
    status: 'Active',
  },
  {
    id: 'STR-004',
    name: 'AP & Honors Advanced Program Add-on',
    gradeLevel: 'Grades 11 - 12',
    academicYear: '2026 / 2027',
    billingFrequency: 'Annual',
    totalAmount: '$2,400.00',
    enrolledCount: 124,
    status: 'Active',
  },
  {
    id: 'STR-005',
    name: 'International Student Boarding Fee Tier',
    gradeLevel: 'Grades 9 - 12',
    academicYear: '2026 / 2027',
    billingFrequency: 'Semester',
    totalAmount: '$22,500.00',
    enrolledCount: 45,
    status: 'Draft',
  },
];

export default function FinanceStructuresPage() {
  const [structures, setStructures] = useState<FeeStructureItem[]>(initialStructures);
  const [searchQuery, setSearchQuery] = useState('');
  const [frequencyFilter, setFrequencyFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Filter logic based on search, billing frequency, and status
  const filteredStructures = structures.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.gradeLevel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFrequency = frequencyFilter === 'All' || item.billingFrequency === frequencyFilter;
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;

    return matchesSearch && matchesFrequency && matchesStatus;
  });

  // Helper for status badge styling
  const getStatusBadge = (status: FeeStructureItem['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Draft':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Archived':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const handleCreateStructure = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessBanner('New fee structure successfully created and published.');
    setCreateModalOpen(false);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Fee Structures & Tuition Plans
          </h1>
          <p className="text-sm text-slate-500">
            Manage tuition tiers, grade level billing policies, itemized fee components, and payment schedules.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/finance/overview"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <i className="fa-solid fa-chart-pie mr-2 text-xs text-blue-600"></i> Finance Overview
          </Link>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
          >
            <i className="fa-solid fa-plus mr-2 text-xs"></i> Create Structure
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successBanner && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 text-sm flex items-center justify-between shadow-sm">
          <div className="flex items-center">
            <i className="fa-solid fa-circle-check text-emerald-600 mr-2 text-base"></i>
            <span>{successBanner}</span>
          </div>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Fee Plans</p>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <i className="fa-solid fa-file-invoice-dollar text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">14</p>
          <span className="text-xs text-emerald-600 font-medium"><i className="fa-solid fa-arrow-trend-up mr-1"></i> Academic year 2026/27</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Annual Tuition</p>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <i className="fa-solid fa-wallet text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">$12,450</p>
          <span className="text-xs text-emerald-600 font-medium">Across all grade brackets</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Enrolled Students</p>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <i className="fa-solid fa-users text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">794</p>
          <span className="text-xs text-purple-600 font-medium">Linked to billing tiers</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Updates</p>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <i className="fa-solid fa-clock-rotate-left text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">2</p>
          <span className="text-xs text-amber-600 font-medium">Review required</span>
        </div>
      </div>

      {/* Toolbar: Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-xs text-slate-400"></i>
          <input
            type="text"
            placeholder="Search structure name, grade level, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Filters Group */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Frequency Filter */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <span>Billing Frequency:</span>
            <select
              value={frequencyFilter}
              onChange={(e) => setFrequencyFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Frequencies</option>
              <option value="Annual">Annual</option>
              <option value="Semester">Semester</option>
              <option value="Monthly">Monthly</option>
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
              <option value="Draft">Draft</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Fee Structures Data Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Structure Name / ID</th>
                <th className="py-3 px-4">Grade Level</th>
                <th className="py-3 px-4">Academic Year</th>
                <th className="py-3 px-4">Billing Frequency</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Enrolled Students</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredStructures.length > 0 ? (
                filteredStructures.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{item.name}</div>
                      <div className="text-xs text-slate-500 font-mono">{item.id}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium text-xs">{item.gradeLevel}</td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs font-mono">{item.academicYear}</td>
                    <td className="py-3.5 px-4 text-slate-700 text-xs font-medium">{item.billingFrequency}</td>
                    <td className="py-3.5 px-4 text-slate-900 font-mono text-xs font-bold">{item.totalAmount}</td>
                    <td className="py-3.5 px-4 text-slate-700 font-mono text-xs">{item.enrolledCount} students</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-xs px-2 py-1 rounded hover:bg-blue-50 transition-colors">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 text-sm">
                    No matching fee structures found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Structure Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <h3 className="font-bold text-slate-900 text-base">Create Fee Structure</h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleCreateStructure} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Structure Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. High School Advanced Placement Plan"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Grade Level Scope
                  </label>
                  <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500">
                    <option value="Grades 9 - 12">Grades 9 - 12</option>
                    <option value="Grades 6 - 8">Grades 6 - 8</option>
                    <option value="Kindergarten - Grade 5">Kindergarten - Grade 5</option>
                    <option value="All Grades">All Grades</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Billing Frequency
                  </label>
                  <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500">
                    <option value="Semester">Semester (Twice/Year)</option>
                    <option value="Annual">Annual (Once/Year)</option>
                    <option value="Monthly">Monthly (10 Installments)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Academic Year
                  </label>
                  <input
                    type="text"
                    defaultValue="2026 / 2027"
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Total Amount ($)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. $14,500.00"
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Itemized Fee Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Detail tuition, lab fees, tech fees, and activity contributions..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
                >
                  Save Fee Structure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}