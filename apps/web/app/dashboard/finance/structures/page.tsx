// apps/web/app/dashboard/finance/structures/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

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

const initialStructures: FeeStructureItem[] = [
  {
    id: 'STR-001',
    name: 'High School Comprehensive Tuition Plan',
    gradeLevel: 'Grades 9 - 12',
    academicYear: '2026 / 2027',
    billingFrequency: 'Semester',
    totalAmount: 'KSh 185,000.00',
    enrolledCount: 342,
    status: 'Active',
  },
  {
    id: 'STR-002',
    name: 'Middle School Standard Fee Structure',
    gradeLevel: 'Grades 6 - 8',
    academicYear: '2026 / 2027',
    billingFrequency: 'Semester',
    totalAmount: 'KSh 150,000.00',
    enrolledCount: 218,
    status: 'Active',
  },
  {
    id: 'STR-003',
    name: 'Elementary School Foundation Plan',
    gradeLevel: 'Kindergarten - Grade 5',
    academicYear: '2026 / 2027',
    billingFrequency: 'Monthly',
    totalAmount: 'KSh 120,000.00',
    enrolledCount: 185,
    status: 'Active',
  },
  {
    id: 'STR-004',
    name: 'AP & Honors Advanced Program Add-on',
    gradeLevel: 'Grades 11 - 12',
    academicYear: '2026 / 2027',
    billingFrequency: 'Annual',
    totalAmount: 'KSh 35,000.00',
    enrolledCount: 124,
    status: 'Active',
  },
  {
    id: 'STR-005',
    name: 'International Student Boarding Fee Tier',
    gradeLevel: 'Grades 9 - 12',
    academicYear: '2026 / 2027',
    billingFrequency: 'Semester',
    totalAmount: 'KSh 280,000.00',
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

  // Filter logic
  const filteredStructures = structures.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.gradeLevel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFrequency = frequencyFilter === 'All' || item.billingFrequency === frequencyFilter;
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;

    return matchesSearch && matchesFrequency && matchesStatus;
  });

  // Status badge styling
  const getStatusBadge = (status: FeeStructureItem['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Draft':
        return 'bg-amber-50 text-amber-800 border-amber-200';
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
    <div className="flex-1 w-full min-w-0 bg-[#f4f7fb] min-h-screen p-4 sm:p-6 lg:p-8 font-sans overflow-x-hidden text-[#042954]">
      
      {/* Page Header */}
      <div className="mb-6 lg:mb-8 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-extrabold text-[#042954] mb-1 tracking-tight">
            Fee Structures & Tuition Plans
          </h1>
          <p className="text-[12px] text-[#64748b]">
            Manage tuition tiers, grade level billing policies, itemized fee components, and payment schedules.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard/finance/overview"
            className="h-[38px] px-4 rounded-xl border border-[#cbd5e1] bg-white text-[12px] font-semibold text-[#042954] hover:bg-slate-50 transition-colors shadow-sm flex items-center"
          >
            <i className="fa-solid fa-chart-pie mr-2 text-xs text-[#0ea5e9]"></i> Finance Overview
          </Link>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="h-[38px] px-4 rounded-xl bg-gradient-to-r from-[#042954] to-[#0ea5e9] text-white text-[12px] font-semibold hover:opacity-95 transition-all shadow-md shadow-sky-500/20 flex items-center justify-center"
          >
            <i className="fa-solid fa-plus mr-2 text-xs"></i> Create Structure
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successBanner && (
        <div className="mb-6 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-900 text-xs flex items-center justify-between shadow-sm">
          <div className="flex items-center">
            <i className="fa-solid fa-circle-check text-emerald-600 mr-2 text-base"></i>
            <span className="font-semibold">{successBanner}</span>
          </div>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 w-full">
        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Active Fee Plans</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">14</h3>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center mt-1">
              <i className="fa-solid fa-arrow-trend-up mr-1"></i> Academic year 2026/27
            </span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-sky-50 text-[#0ea5e9] flex items-center justify-center shrink-0">
            <i className="fa-solid fa-file-invoice-dollar text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Avg Annual Tuition</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">KSh 165,000</h3>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Across all grade brackets</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-teal-50 text-[#06b6d4] flex items-center justify-center shrink-0">
            <i className="fa-solid fa-wallet text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Enrolled Students</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">794</h3>
            <span className="text-[11px] text-purple-600 font-semibold mt-1 block">Linked to billing tiers</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-users text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Pending Updates</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">2</h3>
            <span className="text-[11px] text-amber-600 font-semibold mt-1 block">Review required</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-clock-rotate-left text-lg"></i>
          </div>
        </div>
      </div>

      {/* Toolbar: Search and Filters */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#e2e8f0] mb-6 w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-[360px]">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[12px]"></i>
          <input
            type="text"
            placeholder="Search structure name, grade level, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[40px] pl-9 pr-3 rounded-xl border border-[#cbd5e1] text-[12px] font-medium text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9] focus:ring-2 focus:ring-sky-500/20"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-[12px] font-medium text-[#64748b]">
            <span>Billing Frequency:</span>
            <select
              value={frequencyFilter}
              onChange={(e) => setFrequencyFilter(e.target.value)}
              className="h-[38px] px-3 rounded-xl border border-[#cbd5e1] text-[12px] font-semibold text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9] cursor-pointer"
            >
              <option value="All">All Frequencies</option>
              <option value="Annual">Annual</option>
              <option value="Semester">Semester</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-[12px] font-medium text-[#64748b]">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-[38px] px-3 rounded-xl border border-[#cbd5e1] text-[12px] font-semibold text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9] cursor-pointer"
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
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                <th className="py-3.5 px-5">Structure Name / ID</th>
                <th className="py-3.5 px-5">Grade Level</th>
                <th className="py-3.5 px-5">Academic Year</th>
                <th className="py-3.5 px-5">Billing Frequency</th>
                <th className="py-3.5 px-5">Total Amount</th>
                <th className="py-3.5 px-5">Enrolled Students</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
              {filteredStructures.length > 0 ? (
                filteredStructures.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/75 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-bold text-[#042954]">{item.name}</div>
                      <div className="text-[11px] text-[#64748b] font-mono mt-0.5">{item.id}</div>
                    </td>
                    <td className="py-4 px-5 text-slate-700 font-semibold text-[12px]">{item.gradeLevel}</td>
                    <td className="py-4 px-5 text-[#64748b] text-[12px] font-mono">{item.academicYear}</td>
                    <td className="py-4 px-5 text-slate-700 text-[12px] font-medium">{item.billingFrequency}</td>
                    <td className="py-4 px-5 text-[#042954] font-mono text-[12px] font-bold">{item.totalAmount}</td>
                    <td className="py-4 px-5 text-slate-700 font-mono text-[12px]">{item.enrolledCount} students</td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button className="h-[32px] px-3 rounded-lg bg-sky-50 text-[#0ea5e9] hover:bg-sky-100 font-semibold text-[12px] transition-colors">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#64748b] text-[13px]">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#042954]/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-[#e2e8f0] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] bg-[#f8fafc] px-6 py-4">
              <h3 className="font-bold text-[#042954] text-[15px]">Create Fee Structure</h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-[#042954] transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleCreateStructure} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                  Structure Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. High School Advanced Placement Plan"
                  className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                    Grade Level Scope
                  </label>
                  <select className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9]">
                    <option value="Grades 9 - 12">Grades 9 - 12</option>
                    <option value="Grades 6 - 8">Grades 6 - 8</option>
                    <option value="Kindergarten - Grade 5">Kindergarten - Grade 5</option>
                    <option value="All Grades">All Grades</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                    Billing Frequency
                  </label>
                  <select className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9]">
                    <option value="Semester">Semester (Twice/Year)</option>
                    <option value="Annual">Annual (Once/Year)</option>
                    <option value="Monthly">Monthly (10 Installments)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                    Academic Year
                  </label>
                  <input
                    type="text"
                    defaultValue="2026 / 2027"
                    required
                    className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                    Total Amount (KES)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. KSh 185,000.00"
                    required
                    className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                  Itemized Fee Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Detail tuition, lab fees, tech fees, and activity contributions..."
                  className="w-full rounded-xl border border-[#cbd5e1] p-3 text-[13px] text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9]"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f1f5f9]">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="h-[38px] px-4 rounded-xl border border-[#cbd5e1] bg-white text-[12px] font-semibold text-[#042954] hover:bg-slate-50 transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-[38px] px-5 rounded-xl bg-gradient-to-r from-[#042954] to-[#0ea5e9] text-white text-[12px] font-semibold hover:opacity-95 transition-all shadow-md shadow-sky-500/20"
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