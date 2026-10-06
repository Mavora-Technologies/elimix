'use client';

import { useState } from 'react';
import Link from 'next/link';

// TypeScript interface for a Payment Disbursement
interface PaymentItem {
  id: string;
  invoiceId: string;
  vendor: string;
  department: 'Science' | 'Administration' | 'Athletics' | 'IT' | 'Facilities';
  amount: string;
  paymentDate: string;
  method: 'ACH / Wire' | 'Check' | 'Corporate Card';
  status: 'Completed' | 'Scheduled' | 'Pending Approval' | 'Failed';
}

// Initial mock data for payment disbursements
const initialPayments: PaymentItem[] = [
  {
    id: 'PAY-2026-3011',
    invoiceId: 'INV-2026-8803',
    vendor: 'Nike Team Sports',
    department: 'Athletics',
    amount: '$1,920.00',
    paymentDate: '2026-10-01',
    method: 'ACH / Wire',
    status: 'Completed',
  },
  {
    id: 'PAY-2026-3012',
    invoiceId: 'INV-2026-8802',
    vendor: 'Cisco Systems / IT Distributor',
    department: 'IT',
    amount: '$2,850.00',
    paymentDate: '2026-10-15',
    method: 'ACH / Wire',
    status: 'Scheduled',
  },
  {
    id: 'PAY-2026-3013',
    invoiceId: 'INV-2026-8801',
    vendor: 'BioScience Equipment Corp.',
    department: 'Science',
    amount: '$4,500.00',
    paymentDate: '2026-10-25',
    method: 'ACH / Wire',
    status: 'Pending Approval',
  },
  {
    id: 'PAY-2026-3014',
    invoiceId: 'INV-2026-8804',
    vendor: 'Herman Miller Commercial',
    department: 'Administration',
    amount: '$1,200.00',
    paymentDate: '2026-09-28',
    method: 'Check',
    status: 'Failed',
  },
  {
    id: 'PAY-2026-3015',
    invoiceId: 'INV-2026-8805',
    vendor: 'Trane HVAC Solutions',
    department: 'Facilities',
    amount: '$850.00',
    paymentDate: '2026-10-10',
    method: 'ACH / Wire',
    status: 'Scheduled',
  },
];

export default function ProcurementPaymentsPage() {
  const [payments, setPayments] = useState<PaymentItem[]>(initialPayments);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Filter logic based on search, department, and status
  const filteredPayments = payments.filter((pay) => {
    const matchesSearch =
      pay.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pay.invoiceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pay.vendor.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = departmentFilter === 'All' || pay.department === departmentFilter;
    const matchesStatus = statusFilter === 'All' || pay.status === statusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  // Helper for status badge styling
  const getStatusBadge = (status: PaymentItem['status']) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Scheduled':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Pending Approval':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Failed':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const handleCreatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessBanner('Payment disbursement successfully scheduled and transmitted to banking gateway.');
    setCreateModalOpen(false);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Vendor Disbursements & Payments
          </h1>
          <p className="text-sm text-slate-500">
            Manage vendor disbursements, review banking transmission logs, and authorize ACH/wire transfers.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/procurement/invoices"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <i className="fa-solid fa-file-invoice-dollar mr-2 text-xs text-blue-600"></i> Vendor Invoices
          </Link>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
          >
            <i className="fa-solid fa-plus mr-2 text-xs"></i> Initiate Disbursement
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
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Disbursed YTD</p>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <i className="fa-solid fa-money-bill-transfer text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">$128,450</p>
          <span className="text-xs text-emerald-600 font-medium"><i className="fa-solid fa-arrow-trend-up mr-1"></i> Completed transfers</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Scheduled Transfers</p>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <i className="fa-solid fa-calendar-days text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">8</p>
          <span className="text-xs text-blue-600 font-medium">Queued for banking cycle</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Authorization</p>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <i className="fa-solid fa-shield-halved text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">3</p>
          <span className="text-xs text-amber-600 font-medium">Awaiting CFO sign-off</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Failed / Rejected</p>
            <div className="rounded-lg bg-rose-50 p-2 text-rose-600">
              <i className="fa-solid fa-triangle-exclamation text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">1</p>
          <span className="text-xs text-rose-600 font-medium">Bank routing error</span>
        </div>
      </div>

      {/* Toolbar: Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-xs text-slate-400"></i>
          <input
            type="text"
            placeholder="Search payment ID, invoice reference, or vendor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Filters Group */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Department Filter */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <span>Department:</span>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Departments</option>
              <option value="Science">Science</option>
              <option value="IT">IT</option>
              <option value="Athletics">Athletics</option>
              <option value="Administration">Administration</option>
              <option value="Facilities">Facilities</option>
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
              <option value="Completed">Completed</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Failed">Failed</option>
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
                <th className="py-3 px-4">Payment ID / Invoice Ref</th>
                <th className="py-3 px-4">Vendor & Department</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Date / Method</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 font-mono text-xs">{pay.id}</div>
                      <div className="text-xs text-blue-600 font-mono font-medium">{pay.invoiceId}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-900 font-medium text-xs">{pay.vendor}</div>
                      <div className="text-xs text-slate-500">{pay.department}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-900 font-mono text-xs font-bold">{pay.amount}</td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 font-mono text-xs">{pay.paymentDate}</div>
                      <div className="text-xs text-slate-500">{pay.method}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(pay.status)}`}>
                        {pay.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-xs px-2 py-1 rounded hover:bg-blue-50 transition-colors">
                        View Receipt
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 text-sm">
                    No matching payment records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Initiate Payment Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <h3 className="font-bold text-slate-900 text-base">Initiate Payment Disbursement</h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleCreatePayment} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Invoice Reference
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. INV-2026-8806"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Department
                  </label>
                  <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500">
                    <option value="Science">Science</option>
                    <option value="IT">IT</option>
                    <option value="Athletics">Athletics</option>
                    <option value="Administration">Administration</option>
                    <option value="Facilities">Facilities</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Vendor Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fisher Scientific"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Amount ($)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. $1,450.00"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Disbursement Date
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Payment Method
                  </label>
                  <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500">
                    <option value="ACH / Wire">ACH / Wire Transfer</option>
                    <option value="Check">Physical Check</option>
                    <option value="Corporate Card">Corporate Card</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Initial Status
                  </label>
                  <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500">
                    <option value="Scheduled">Scheduled</option>
                    <option value="Pending Approval">Pending Approval</option>
                    <option value="Completed">Completed Immediately</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Remittance Notes / Memo
                </label>
                <textarea
                  rows={2}
                  placeholder="Enter invoice memo or banking reference notes..."
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
                  Schedule Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}