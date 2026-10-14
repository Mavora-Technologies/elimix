// apps/web/app/dashboard/finance/statements/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

interface StatementItem {
  id: string;
  studentName: string;
  studentId: string;
  grade: string;
  totalCharges: string;
  totalPaid: string;
  currentBalance: string;
  lastStatementDate: string;
  status: 'Balanced' | 'Outstanding' | 'Credit' | 'Overdue';
}

const initialStatements: StatementItem[] = [
  {
    id: 'STM-001',
    studentName: 'Oliver Twist',
    studentId: 'STU-2026-014',
    grade: 'Grade 11',
    totalCharges: 'KSh 96,250.00',
    totalPaid: 'KSh 50,937.50',
    currentBalance: 'KSh 45,312.50',
    lastStatementDate: '2026-10-01',
    status: 'Outstanding',
  },
  {
    id: 'STM-002',
    studentName: 'Charlotte Brontë',
    studentId: 'STU-2026-022',
    grade: 'Grade 12',
    totalCharges: 'KSh 133,125.00',
    totalPaid: 'KSh 133,125.00',
    currentBalance: 'KSh 0.00',
    lastStatementDate: '2026-10-01',
    status: 'Balanced',
  },
  {
    id: 'STM-003',
    studentName: 'Arthur Conan Doyle',
    studentId: 'STU-2026-045',
    grade: 'Grade 10',
    totalCharges: 'KSh 80,625.00',
    totalPaid: 'KSh 86,250.00',
    currentBalance: '-KSh 5,625.00',
    lastStatementDate: '2026-09-28',
    status: 'Credit',
  },
  {
    id: 'STM-004',
    studentName: 'Jane Austen',
    studentId: 'STU-2026-089',
    grade: 'Grade 9',
    totalCharges: 'KSh 101,250.00',
    totalPaid: 'KSh 56,875.00',
    currentBalance: 'KSh 44,375.00',
    lastStatementDate: '2026-09-15',
    status: 'Overdue',
  },
  {
    id: 'STM-005',
    studentName: 'H.G. Wells',
    studentId: 'STU-2026-102',
    grade: 'Grade 11',
    totalCharges: 'KSh 90,000.00',
    totalPaid: 'KSh 79,750.00',
    currentBalance: 'KSh 10,250.00',
    lastStatementDate: '2026-10-01',
    status: 'Outstanding',
  },
];

export default function FinanceStatementsPage() {
  const [statements, setStatements] = useState<StatementItem[]>(initialStatements);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [gradeFilter, setGradeFilter] = useState('All');
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Filter logic
  const filteredStatements = statements.filter((stm) => {
    const matchesSearch =
      stm.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stm.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stm.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || stm.status === statusFilter;
    const matchesGrade = gradeFilter === 'All' || stm.grade === gradeFilter;

    return matchesSearch && matchesStatus && matchesGrade;
  });

  // Status badge styling
  const getStatusBadge = (status: StatementItem['status']) => {
    switch (status) {
      case 'Balanced':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Outstanding':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Credit':
        return 'bg-sky-50 text-[#0ea5e9] border-sky-200';
      case 'Overdue':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const handleGenerateStatement = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessBanner('Official student account statements successfully generated and dispatched via email.');
    setGenerateModalOpen(false);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  return (
    <div className="flex-1 w-full min-w-0 bg-[#f4f7fb] min-h-screen p-4 sm:p-6 lg:p-8 font-sans overflow-x-hidden text-[#042954]">
      
      {/* Page Header */}
      <div className="mb-6 lg:mb-8 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-extrabold text-[#042954] mb-1 tracking-tight">
            Student Financial Statements & Ledgers
          </h1>
          <p className="text-[12px] text-[#64748b]">
            Review student account summaries, audit lifetime charges and payments, and dispatch formal billing statements.
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
            onClick={() => setGenerateModalOpen(true)}
            className="h-[38px] px-4 rounded-xl bg-gradient-to-r from-[#042954] to-[#0ea5e9] text-white text-[12px] font-semibold hover:opacity-95 transition-all shadow-md shadow-sky-500/20 flex items-center justify-center"
          >
            <i className="fa-solid fa-file-pdf mr-2 text-xs"></i> Generate Statements
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
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Active Ledgers</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">1,248</h3>
            <span className="text-[11px] text-[#64748b] font-semibold mt-1 block">Enrolled student accounts</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-sky-50 text-[#0ea5e9] flex items-center justify-center shrink-0">
            <i className="fa-solid fa-address-book text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Balanced Accounts</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">924</h3>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">74% fully settled</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-teal-50 text-[#06b6d4] flex items-center justify-center shrink-0">
            <i className="fa-solid fa-circle-check text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Outstanding Balances</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">272</h3>
            <span className="text-[11px] text-amber-600 font-semibold mt-1 block">Carrying balances</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-scale-balanced text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Overdue Accounts</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">52</h3>
            <span className="text-[11px] text-rose-600 font-semibold mt-1 block">Requires escalation</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-triangle-exclamation text-lg"></i>
          </div>
        </div>
      </div>

      {/* Toolbar: Search and Filters */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#e2e8f0] mb-6 w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-[360px]">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[12px]"></i>
          <input
            type="text"
            placeholder="Search student name, ID, or statement ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[40px] pl-9 pr-3 rounded-xl border border-[#cbd5e1] text-[12px] font-medium text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9] focus:ring-2 focus:ring-sky-500/20"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-[12px] font-medium text-[#64748b]">
            <span>Grade:</span>
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="h-[38px] px-3 rounded-xl border border-[#cbd5e1] text-[12px] font-semibold text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9] cursor-pointer"
            >
              <option value="All">All Grades</option>
              <option value="Grade 9">Grade 9</option>
              <option value="Grade 10">Grade 10</option>
              <option value="Grade 11">Grade 11</option>
              <option value="Grade 12">Grade 12</option>
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
              <option value="Balanced">Balanced</option>
              <option value="Outstanding">Outstanding</option>
              <option value="Credit">Credit Balance</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statements Data Table */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                <th className="py-3.5 px-5">Student Name / ID</th>
                <th className="py-3.5 px-5">Grade</th>
                <th className="py-3.5 px-5">Total Charges</th>
                <th className="py-3.5 px-5">Total Paid</th>
                <th className="py-3.5 px-5">Current Balance</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
              {filteredStatements.length > 0 ? (
                filteredStatements.map((stm) => (
                  <tr key={stm.id} className="hover:bg-slate-50/75 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-bold text-[#042954] text-[12px]">{stm.studentName}</div>
                      <div className="text-[11px] text-[#64748b] font-mono mt-0.5">{stm.studentId}</div>
                    </td>
                    <td className="py-4 px-5 text-slate-700 text-[12px] font-semibold">{stm.grade}</td>
                    <td className="py-4 px-5 text-[#042954] font-mono text-[12px] font-bold">{stm.totalCharges}</td>
                    <td className="py-4 px-5 text-[#64748b] font-mono text-[12px]">{stm.totalPaid}</td>
                    <td className="py-4 px-5 text-[#042954] font-mono text-[12px] font-extrabold">{stm.currentBalance}</td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(stm.status)}`}>
                        {stm.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button className="h-[32px] px-3 rounded-lg bg-sky-50 text-[#0ea5e9] hover:bg-sky-100 font-semibold text-[12px] transition-colors">
                        View Ledger
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#64748b] text-[13px]">
                    No matching student financial statements found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Statements Modal */}
      {generateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#042954]/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-[#e2e8f0] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] bg-[#f8fafc] px-6 py-4">
              <h3 className="font-bold text-[#042954] text-[15px]">Generate & Dispatch Statements</h3>
              <button
                onClick={() => setGenerateModalOpen(false)}
                className="text-slate-400 hover:text-[#042954] transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleGenerateStatement} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                  Target Student Group
                </label>
                <select className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9]">
                  <option value="All">All Enrolled Students</option>
                  <option value="Outstanding">Students with Outstanding Balances Only</option>
                  <option value="Overdue">Students with Overdue Balances Only</option>
                  <option value="Grade 11">Grade 11 Students Only</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                  Statement Period
                </label>
                <select className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9]">
                  <option value="Fall 2026">Fall Semester 2026 (YTD)</option>
                  <option value="Current Month">Current Month (October 2026)</option>
                  <option value="Full Academic Year">Full Academic Year 2026–2027</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                  Delivery Method
                </label>
                <div className="space-y-2 pt-1">
                  <label className="flex items-center gap-2.5 text-[13px] font-medium text-[#042954] cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#0ea5e9] focus:ring-[#0ea5e9] w-4 h-4" />
                    <span>Email PDF statement to parents/guardians</span>
                  </label>
                  <label className="flex items-center gap-2.5 text-[13px] font-medium text-[#042954] cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#0ea5e9] focus:ring-[#0ea5e9] w-4 h-4" />
                    <span>Make available on student & parent portals</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f1f5f9]">
                <button
                  type="button"
                  onClick={() => setGenerateModalOpen(false)}
                  className="h-[38px] px-4 rounded-xl border border-[#cbd5e1] bg-white text-[12px] font-semibold text-[#042954] hover:bg-slate-50 transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-[38px] px-5 rounded-xl bg-gradient-to-r from-[#042954] to-[#0ea5e9] text-white text-[12px] font-semibold hover:opacity-95 transition-all shadow-md shadow-sky-500/20"
                >
                  Generate & Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}