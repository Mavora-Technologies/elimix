// apps/web/app/dashboard/finance/payments/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

interface PaymentItem {
  id: string;
  transactionId: string;
  studentName: string;
  studentId: string;
  invoiceRef: string;
  method: 'Credit Card' | 'Bank Transfer' | 'Cash' | 'Check' | 'M-PESA';
  amount: string;
  date: string;
  status: 'Successful' | 'Pending' | 'Failed' | 'Refunded';
}

const initialPayments: PaymentItem[] = [
  {
    id: 'PAY-001',
    transactionId: 'TXN-9842-2026',
    studentName: 'Oliver Twist',
    studentId: 'STU-2026-014',
    invoiceRef: 'INV-2026-1001',
    method: 'M-PESA',
    amount: 'KSh 45,000.00',
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
    amount: 'KSh 45,000.00',
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
    amount: 'KSh 6,500.00',
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
    amount: 'KSh 8,500.00',
    date: '2026-09-27 16:15',
    status: 'Pending',
  },
  {
    id: 'PAY-005',
    transactionId: 'TXN-9846-2026',
    studentName: 'H.G. Wells',
    studentId: 'STU-2026-102',
    invoiceRef: 'INV-2026-1005',
    method: 'M-PESA',
    amount: 'KSh 10,500.00',
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

  // Filter logic
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

  // Status badge styling
  const getStatusBadge = (status: PaymentItem['status']) => {
    switch (status) {
      case 'Successful':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Failed':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'Refunded':
        return 'bg-purple-50 text-purple-800 border-purple-200';
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
    <div className="flex-1 w-full min-w-0 bg-[#f4f7fb] min-h-screen p-4 sm:p-6 lg:p-8 font-sans overflow-x-hidden text-[#042954]">
      
      {/* Page Header */}
      <div className="mb-6 lg:mb-8 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-extrabold text-[#042954] mb-1 tracking-tight">
            Payment History & Transactions
          </h1>
          <p className="text-[12px] text-[#64748b]">
            View transaction logs, reconcile student receipts, and record manual payments or bank deposits.
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
            onClick={() => setRecordModalOpen(true)}
            className="h-[38px] px-4 rounded-xl bg-gradient-to-r from-[#042954] to-[#0ea5e9] text-white text-[12px] font-semibold hover:opacity-95 transition-all shadow-md shadow-sky-500/20 flex items-center justify-center"
          >
            <i className="fa-solid fa-plus mr-2 text-xs"></i> Record Payment
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
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Collected Today</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">KSh 185,000</h3>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center mt-1">
              <i className="fa-solid fa-arrow-trend-up mr-1"></i> 18 transactions today
            </span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-sky-50 text-[#0ea5e9] flex items-center justify-center shrink-0">
            <i className="fa-solid fa-cash-register text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Monthly Revenue</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">KSh 2,850,000</h3>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">October 2026 totals</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-teal-50 text-[#06b6d4] flex items-center justify-center shrink-0">
            <i className="fa-solid fa-wallet text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Success Rate</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">98.4%</h3>
            <span className="text-[11px] text-purple-600 font-semibold mt-1 block">Gateway performance</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-shield-check text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Pending Verification</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">KSh 215,000</h3>
            <span className="text-[11px] text-amber-600 font-semibold mt-1 block">Bank wires / M-Pesa clearing</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-clock text-lg"></i>
          </div>
        </div>
      </div>

      {/* Toolbar: Search and Filters */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#e2e8f0] mb-6 w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-[360px]">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[12px]"></i>
          <input
            type="text"
            placeholder="Search student name, ID, transaction ID, or invoice..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[40px] pl-9 pr-3 rounded-xl border border-[#cbd5e1] text-[12px] font-medium text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9] focus:ring-2 focus:ring-sky-500/20"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-[12px] font-medium text-[#64748b]">
            <span>Method:</span>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="h-[38px] px-3 rounded-xl border border-[#cbd5e1] text-[12px] font-semibold text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9] cursor-pointer"
            >
              <option value="All">All Methods</option>
              <option value="M-PESA">M-PESA</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cash">Cash</option>
              <option value="Check">Check</option>
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
              <option value="Successful">Successful</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Data Table */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                <th className="py-3.5 px-5">Transaction ID / Date</th>
                <th className="py-3.5 px-5">Student Name / ID</th>
                <th className="py-3.5 px-5">Invoice Reference</th>
                <th className="py-3.5 px-5">Payment Method</th>
                <th className="py-3.5 px-5">Amount</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50/75 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-bold text-[#042954] font-mono">{pay.transactionId}</div>
                      <div className="text-[11px] text-[#64748b] mt-0.5">{pay.date}</div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="text-[#042954] font-semibold text-[12px]">{pay.studentName}</div>
                      <div className="text-[11px] text-[#64748b] font-mono mt-0.5">{pay.studentId}</div>
                    </td>
                    <td className="py-4 px-5 text-[#64748b] font-mono text-[12px]">{pay.invoiceRef}</td>
                    <td className="py-4 px-5">
                      <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-[11px] font-bold text-slate-700">
                        {pay.method}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-[#042954] font-mono text-[12px] font-bold">{pay.amount}</td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(pay.status)}`}>
                        {pay.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button className="h-[32px] px-3 rounded-lg bg-sky-50 text-[#0ea5e9] hover:bg-sky-100 font-semibold text-[12px] transition-colors">
                        Receipt
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#64748b] text-[13px]">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#042954]/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-[#e2e8f0] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] bg-[#f8fafc] px-6 py-4">
              <h3 className="font-bold text-[#042954] text-[15px]">Record New Payment Transaction</h3>
              <button
                onClick={() => setRecordModalOpen(false)}
                className="text-slate-400 hover:text-[#042954] transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleRecordPayment} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                  Student Name / ID
                </label>
                <select className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9]">
                  <option value="Oliver Twist">Oliver Twist (STU-2026-014)</option>
                  <option value="Charlotte Brontë">Charlotte Brontë (STU-2026-022)</option>
                  <option value="Arthur Conan Doyle">Arthur Conan Doyle (STU-2026-045)</option>
                  <option value="Jane Austen">Jane Austen (STU-2026-089)</option>
                  <option value="H.G. Wells">H.G. Wells (STU-2026-102)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                  Invoice Reference
                </label>
                <select className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9]">
                  <option value="INV-2026-1001">INV-2026-1001 - High School Fall Tuition (KSh 92,500.00)</option>
                  <option value="INV-2026-1002">INV-2026-1002 - Boarding & Residence Fee (KSh 45,000.00)</option>
                  <option value="INV-2026-1003">INV-2026-1003 - Annual Tech License (KSh 6,500.00)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                    Payment Method
                  </label>
                  <select className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9]">
                    <option value="M-PESA">M-PESA</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                    <option value="Check">Check</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                    Amount Paid (KES)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. KSh 45,000.00"
                    required
                    className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                  Reference / Transaction Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. QJK892XYZ / TXN-9951-2026"
                  className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f1f5f9]">
                <button
                  type="button"
                  onClick={() => setRecordModalOpen(false)}
                  className="h-[38px] px-4 rounded-xl border border-[#cbd5e1] bg-white text-[12px] font-semibold text-[#042954] hover:bg-slate-50 transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-[38px] px-5 rounded-xl bg-gradient-to-r from-[#042954] to-[#0ea5e9] text-white text-[12px] font-semibold hover:opacity-95 transition-all shadow-md shadow-sky-500/20"
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