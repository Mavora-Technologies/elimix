'use client';

import { useState } from 'react';
import Link from 'next/link';

// TypeScript interface for a Student Financial Statement
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

// Initial mock data for student statements
const initialStatements: StatementItem[] = [
  {
    id: 'STM-001',
    studentName: 'Oliver Twist',
    studentId: 'STU-2026-014',
    grade: 'Grade 11',
    totalCharges: '$7,700.00',
    totalPaid: '$4,075.00',
    currentBalance: '$3,625.00',
    lastStatementDate: '2026-10-01',
    status: 'Outstanding',
  },
  {
    id: 'STM-002',
    studentName: 'Charlotte Brontë',
    studentId: 'STU-2026-022',
    grade: 'Grade 12',
    totalCharges: '$10,650.00',
    totalPaid: '$10,650.00',
    currentBalance: '$0.00',
    lastStatementDate: '2026-10-01',
    status: 'Balanced',
  },
  {
    id: 'STM-003',
    studentName: 'Arthur Conan Doyle',
    studentId: 'STU-2026-045',
    grade: 'Grade 10',
    totalCharges: '$6,450.00',
    totalPaid: '$6,900.00',
    currentBalance: '-$450.00',
    lastStatementDate: '2026-09-28',
    status: 'Credit',
  },
  {
    id: 'STM-004',
    studentName: 'Jane Austen',
    studentId: 'STU-2026-089',
    grade: 'Grade 9',
    totalCharges: '$8,100.00',
    totalPaid: '$4,550.00',
    currentBalance: '$3,550.00',
    lastStatementDate: '2026-09-15',
    status: 'Overdue',
  },
  {
    id: 'STM-005',
    studentName: 'H.G. Wells',
    studentId: 'STU-2026-102',
    grade: 'Grade 11',
    totalCharges: '$7,200.00',
    totalPaid: '$6,380.00',
    currentBalance: '$820.00',
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

  // Filter logic based on search, status, and grade
  const filteredStatements = statements.filter((stm) => {
    const matchesSearch =
      stm.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stm.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stm.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || stm.status === statusFilter;
    const matchesGrade = gradeFilter === 'All' || stm.grade === gradeFilter;

    return matchesSearch && matchesStatus && matchesGrade;
  });

  // Helper for status badge styling
  const getStatusBadge = (status: StatementItem['status']) => {
    switch (status) {
      case 'Balanced':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Outstanding':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Credit':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Overdue':
        return 'bg-rose-50 text-rose-700 border-rose-200';
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Student Financial Statements & Ledgers
          </h1>
          <p className="text-sm text-slate-500">
            Review student account summaries, audit lifetime charges and payments, and dispatch formal billing statements.
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
            onClick={() => setGenerateModalOpen(true)}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
          >
            <i className="fa-solid fa-file-pdf mr-2 text-xs"></i> Generate Statements
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
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Ledgers</p>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <i className="fa-solid fa-address-book text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">1,248</p>
          <span className="text-xs text-slate-500 font-medium">Enrolled student accounts</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Balanced Accounts</p>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <i className="fa-solid fa-circle-check text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">924</p>
          <span className="text-xs text-emerald-600 font-medium">74% fully settled</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Outstanding Balances</p>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <i className="fa-solid fa-scale-balanced text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">272</p>
          <span className="text-xs text-amber-600 font-medium">Carrying balances</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overdue Accounts</p>
            <div className="rounded-lg bg-rose-50 p-2 text-rose-600">
              <i className="fa-solid fa-triangle-exclamation text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">52</p>
          <span className="text-xs text-rose-600 font-medium">Requires escalation</span>
        </div>
      </div>

      {/* Toolbar: Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-xs text-slate-400"></i>
          <input
            type="text"
            placeholder="Search student name, ID, or statement ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Filters Group */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Grade Filter */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <span>Grade:</span>
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Grades</option>
              <option value="Grade 9">Grade 9</option>
              <option value="Grade 10">Grade 10</option>
              <option value="Grade 11">Grade 11</option>
              <option value="Grade 12">Grade 12</option>
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
              <option value="Balanced">Balanced</option>
              <option value="Outstanding">Outstanding</option>
              <option value="Credit">Credit Balance</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statements Data Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Student Name / ID</th>
                <th className="py-3 px-4">Grade</th>
                <th className="py-3 px-4">Total Charges</th>
                <th className="py-3 px-4">Total Paid</th>
                <th className="py-3 px-4">Current Balance</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredStatements.length > 0 ? (
                filteredStatements.map((stm) => (
                  <tr key={stm.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 text-xs">{stm.studentName}</div>
                      <div className="text-xs text-slate-500 font-mono">{stm.studentId}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 text-xs font-medium">{stm.grade}</td>
                    <td className="py-3.5 px-4 text-slate-900 font-mono text-xs font-semibold">{stm.totalCharges}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-xs">{stm.totalPaid}</td>
                    <td className="py-3.5 px-4 text-slate-900 font-mono text-xs font-bold">{stm.currentBalance}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(stm.status)}`}>
                        {stm.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-xs px-2 py-1 rounded hover:bg-blue-50 transition-colors">
                        View Ledger
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-sm">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <h3 className="font-bold text-slate-900 text-base">Generate & Dispatch Statements</h3>
              <button
                onClick={() => setGenerateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleGenerateStatement} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Target Student Group
                </label>
                <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500">
                  <option value="All">All Enrolled Students</option>
                  <option value="Outstanding">Students with Outstanding Balances Only</option>
                  <option value="Overdue">Students with Overdue Balances Only</option>
                  <option value="Grade 11">Grade 11 Students Only</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Statement Period
                </label>
                <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500">
                  <option value="Fall 2026">Fall Semester 2026 (YTD)</option>
                  <option value="Current Month">Current Month (October 2026)</option>
                  <option value="Full Academic Year">Full Academic Year 2026–2027</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Delivery Method
                </label>
                <div className="space-y-2 pt-1">
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <span>Email PDF statement to parents/guardians</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <span>Make available on student & parent portals</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setGenerateModalOpen(false)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
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