'use client';

import { useState } from 'react';
import Link from 'next/link';

// TypeScript interface for a Payment Transaction
interface PaymentItem {
  id: string;
  transactionId: string;
  studentName: string;
  studentId: string;
  invoiceRef: string;
  method: 'Credit Card' | 'Bank Transfer' | 'Cash' | 'Check';
  amount: string;
  date: string;
  status: 'Successful' | 'Pending' | 'Failed' | 'Refunded';
}

// Initial mock data for payment transactions
const initialPayments: PaymentItem[] = [
  {
    id: 'PAY-001',
    transactionId: 'TXN-9842-2026',
    studentName: 'Oliver Twist',
    studentId: 'STU-2026-014',
    invoiceRef: 'INV-2026-1001',
    method: 'Credit Card',
    amount: '$3,625.00',
    date: '2026-10-01 14:22',
    status: 'Successful',
  },
  {
    id: 'PAY-002',
    transactionId: 'TXN-9843-2026',
    studentName: 'Charlotte Brontë',
    studentId: 'STU-2026-022',
    invoiceRef: 'INV-2026-1002',
    method: 'Bank Transfer',
    amount: '$3,400.00',
    date: '2026-09-29 11:05',
    status: 'Successful',
  },
  {
    id: 'PAY-003',
    transactionId: 'TXN-9844-2026',
    studentName: 'Arthur Conan Doyle',
    studentId: 'STU-2026-045',
    invoiceRef: 'INV-2026-1003',
    method: 'Credit Card',
    amount: '$450.00',
    date: '2026-09-28 09:40',
    status: 'Successful',
  },
  {
    id: 'PAY-004',
    transactionId: 'TXN-9845-2026',
    studentName: 'Jane Austen',
    studentId: 'STU-2026-089',
    invoiceRef: 'INV-2026-1004',
    method: 'Check',
    amount: '$325.00',
    date: '2026-09-27 16:15',
    status: 'Pending',
  },
  {
    id: 'PAY-005',
    transactionId: 'TXN-9846-2026',
    studentName: 'H.G. Wells',
    studentId: 'STU-2026-102',
    invoiceRef: 'INV-2026-1005',
    method: 'Credit Card',
    amount: '$820.00',
    date: '2026-09-26 13:50',
    status: 'Successful',
  },
];

export default function FinancePaymentsPage() {
  const [payments, setPayments] = useState<PaymentItem[]>(initialPayments);
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Filter logic based on search, payment method, and status
  const filteredPayments = payments.filter((pay) => {
    const matchesSearch =
      pay.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pay.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pay.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pay.invoiceRef.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMethod = methodFilter === 'All' || pay.method === methodFilter;
    const matchesStatus = statusFilter === 'All' || pay.status === statusFilter;

    return matchesSearch && matchesMethod && matchesStatus;
  });

  // Helper for status badge styling
  const getStatusBadge = (status: PaymentItem['status']) => {
    switch (status) {
      case 'Successful':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Failed':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Refunded':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessBanner('New payment transaction successfully recorded and reconciled.');
    setRecordModalOpen(false);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Payment History & Transactions
          </h1>
          <p className="text-sm text-slate-500">
            View transaction logs, reconcile student receipts, and record manual payments or bank deposits.
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
            onClick={() => setRecordModalOpen(true)}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
          >
            <i className="fa-solid fa-plus mr-2 text-xs"></i> Record Payment
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
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Collected Today</p>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <i className="fa-solid fa-cash-register text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">$14,850</p>
          <span className="text-xs text-emerald-600 font-medium"><i className="fa-solid fa-arrow-trend-up mr-1"></i> 18 transactions today</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Monthly Revenue</p>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <i className="fa-solid fa-wallet text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">$218,400</p>
          <span className="text-xs text-emerald-600 font-medium">October 2026 totals</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Success Rate</p>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <i className="fa-solid fa-shield-check text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">98.4%</p>
          <span className="text-xs text-purple-600 font-medium">Gateway performance</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Verification</p>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <i className="fa-solid fa-clock text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">$1,650</p>
          <span className="text-xs text-amber-600 font-medium">Bank wires clearing</span>
        </div>
      </div>

      {/* Toolbar: Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-xs text-slate-400"></i>
          <input
            type="text"
            placeholder="Search student name, ID, transaction ID, or invoice..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Filters Group */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Method Filter */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <span>Method:</span>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Methods</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cash">Cash</option>
              <option value="Check">Check</option>
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
              <option value="Successful">Successful</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Data Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Transaction ID / Date</th>
                <th className="py-3 px-4">Student Name / ID</th>
                <th className="py-3 px-4">Invoice Reference</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 font-mono">{pay.transactionId}</div>
                      <div className="text-xs text-slate-500">{pay.date}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-900 font-medium text-xs">{pay.studentName}</div>
                      <div className="text-xs text-slate-500 font-mono">{pay.studentId}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-mono text-xs">{pay.invoiceRef}</td>
                    <td className="py-3.5 px-4 text-slate-800 text-xs font-medium">{pay.method}</td>
                    <td className="py-3.5 px-4 text-slate-900 font-mono text-xs font-bold">{pay.amount}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(pay.status)}`}>
                        {pay.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-xs px-2 py-1 rounded hover:bg-blue-50 transition-colors">
                        Receipt
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-sm">
                    No matching payment transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {recordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <h3 className="font-bold text-slate-900 text-base">Record New Payment Transaction</h3>
              <button
                onClick={() => setRecordModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleRecordPayment} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Student Name / ID
                </label>
                <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500">
                  <option value="Oliver Twist">Oliver Twist (STU-2026-014)</option>
                  <option value="Charlotte Brontë">Charlotte Brontë (STU-2026-022)</option>
                  <option value="Arthur Conan Doyle">Arthur Conan Doyle (STU-2026-045)</option>
                  <option value="Jane Austen">Jane Austen (STU-2026-089)</option>
                  <option value="H.G. Wells">H.G. Wells (STU-2026-102)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Invoice Reference
                </label>
                <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500">
                  <option value="INV-2026-1001">INV-2026-1001 - High School Fall Semester Tuition ($7,250.00)</option>
                  <option value="INV-2026-1002">INV-2026-1002 - Boarding & Residence Fee ($3,400.00)</option>
                  <option value="INV-2026-1003">INV-2026-1003 - Annual Tech License ($450.00)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Payment Method
                  </label>
                  <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500">
                    <option value="Credit Card">Credit Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                    <option value="Check">Check</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Amount Paid ($)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. $3,625.00"
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Reference / Transaction Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TXN-9951-2026"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRecordModalOpen(false)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
                >
                  Save & Reconcile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}