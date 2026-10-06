'use client';

import { useState } from 'react';
import Link from 'next/link';

// TypeScript interface for Transport Fee Billing records
interface TransportFeeItem {
  id: string;
  studentName: string;
  studentId: string;
  gradeClass: string;
  zone: string;
  tripType: 'Round Trip' | 'One Way Morning' | 'One Way Evening';
  termFee: string;
  paidAmount: string;
  balance: string;
  dueDate: string;
  status: 'Paid' | 'Partial' | 'Unpaid' | 'Overdue';
}

// Initial mock data for transport fee billings
const initialFees: TransportFeeItem[] = [
  {
    id: 'TRF-2026-101',
    studentName: 'Alex Johnson',
    studentId: 'STD-2026-088',
    gradeClass: 'Grade 8 - Alpha',
    zone: 'Zone 1 (Westlands / Kilimani)',
    tripType: 'Round Trip',
    termFee: '$350.00',
    paidAmount: '$350.00',
    balance: '$0.00',
    dueDate: '2026-09-15',
    status: 'Paid',
  },
  {
    id: 'TRF-2026-102',
    studentName: 'Sarah Jenkins',
    studentId: 'STD-2026-142',
    gradeClass: 'Grade 10 - Science',
    zone: 'Zone 2 (Lavington / Kileleshwa)',
    tripType: 'Round Trip',
    termFee: '$420.00',
    paidAmount: '$200.00',
    balance: '$220.00',
    dueDate: '2026-09-30',
    status: 'Partial',
  },
  {
    id: 'TRF-2026-103',
    studentName: 'Michael Chang',
    studentId: 'STD-2026-104',
    gradeClass: 'Grade 6 - Blue',
    zone: 'Zone 3 (Karen / Hardy)',
    tripType: 'One Way Morning',
    termFee: '$280.00',
    paidAmount: '$0.00',
    balance: '$280.00',
    dueDate: '2026-09-10',
    status: 'Overdue',
  },
  {
    id: 'TRF-2026-104',
    studentName: 'Emily Clark',
    studentId: 'STD-2026-211',
    gradeClass: 'Grade 7 - Red',
    zone: 'Zone 1 (Westlands / Kilimani)',
    tripType: 'Round Trip',
    termFee: '$350.00',
    paidAmount: '$0.00',
    balance: '$350.00',
    dueDate: '2026-10-15',
    status: 'Unpaid',
  },
  {
    id: 'TRF-2026-105',
    studentName: 'David Miller',
    studentId: 'STD-2026-045',
    gradeClass: 'Grade 9 - Gold',
    zone: 'Zone 2 (Lavington / Kileleshwa)',
    tripType: 'One Way Evening',
    termFee: '$250.00',
    paidAmount: '$250.00',
    balance: '$0.00',
    dueDate: '2026-09-15',
    status: 'Paid',
  },
];

export default function TransportFeesPage() {
  const [fees, setFees] = useState<TransportFeeItem[]>(initialFees);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [tripTypeFilter, setTripTypeFilter] = useState('All');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<TransportFeeItem | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Filter logic based on search query, payment status, and trip type
  const filteredFees = fees.filter((item) => {
    const matchesSearch =
      item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.zone.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesTripType = tripTypeFilter === 'All' || item.tripType === tripTypeFilter;

    return matchesSearch && matchesStatus && matchesTripType;
  });

  // Helper for status badge styling
  const getStatusBadge = (status: TransportFeeItem['status']) => {
    switch (status) {
      case 'Paid':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Partial':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Unpaid':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'Overdue':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const openPaymentModal = (record: TransportFeeItem) => {
    setSelectedRecord(record);
    setPaymentModalOpen(true);
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessBanner(`Transport fee payment recorded successfully for ${selectedRecord?.studentName}.`);
    setPaymentModalOpen(false);
    setSelectedRecord(null);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Transport Fees & Billing
          </h1>
          <p className="text-sm text-slate-500">
            Manage student bus fare billing, track payments by zone, process receipts, and view pending balances.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/transport/routes"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <i className="fa-solid fa-route mr-2 text-xs text-blue-600"></i> Route Catalog
          </Link>
          <button
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
          >
            <i className="fa-solid fa-file-export mr-2 text-xs"></i> Export Statement
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
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Term Revenue</p>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <i className="fa-solid fa-sack-dollar text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">$182,400.00</p>
          <span className="text-xs text-emerald-600 font-medium"><i className="fa-solid fa-arrow-trend-up mr-1"></i> 82% Collected Term 3</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Outstanding Balances</p>
            <div className="rounded-lg bg-rose-50 p-2 text-rose-600">
              <i className="fa-solid fa-triangle-exclamation text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">$32,850.00</p>
          <span className="text-xs text-rose-600 font-medium">142 accounts with balance</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Fully Paid Students</p>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <i className="fa-solid fa-circle-check text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">703</p>
          <span className="text-xs text-blue-600 font-medium">Clear for bus boarding</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overdue Reminders</p>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <i className="fa-solid fa-bell text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">28</p>
          <span className="text-xs text-amber-600 font-medium">Notices auto-queued</span>
        </div>
      </div>

      {/* Toolbar: Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-xs text-slate-400"></i>
          <input
            type="text"
            placeholder="Search student name, ID, zone, or invoice..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Filters Group */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Trip Type Filter */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <span>Trip Option:</span>
            <select
              value={tripTypeFilter}
              onChange={(e) => setTripTypeFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Options</option>
              <option value="Round Trip">Round Trip</option>
              <option value="One Way Morning">One Way Morning</option>
              <option value="One Way Evening">One Way Evening</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <span>Payment Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transport Fees Data Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Invoice ID</th>
                <th className="py-3 px-4">Student Info</th>
                <th className="py-3 px-4">Zone & Trip Type</th>
                <th className="py-3 px-4">Term Fee / Paid</th>
                <th className="py-3 px-4">Balance / Due Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredFees.length > 0 ? (
                filteredFees.map((fee) => (
                  <tr key={fee.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-xs font-semibold text-slate-900">
                      {fee.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 text-xs">{fee.studentName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {fee.studentId} • <span className="text-slate-700 font-medium">{fee.gradeClass}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-900 text-xs">{fee.zone}</div>
                      <div className="text-[11px] text-blue-600 font-medium">{fee.tripType}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-900 font-bold font-mono text-xs">Fee: {fee.termFee}</div>
                      <div className="text-[11px] text-emerald-600 font-mono font-medium">Paid: {fee.paidAmount}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className={`font-mono font-bold text-xs ${fee.balance !== '$0.00' ? 'text-rose-600' : 'text-slate-500'}`}>
                        {fee.balance}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">Due: {fee.dueDate}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(fee.status)}`}>
                        {fee.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      {fee.status !== 'Paid' ? (
                        <button
                          onClick={() => openPaymentModal(fee)}
                          className="text-emerald-600 hover:text-emerald-800 font-medium text-xs px-2 py-1 rounded hover:bg-emerald-50 transition-colors"
                        >
                          Record Payment
                        </button>
                      ) : (
                        <button className="text-slate-600 hover:text-slate-800 font-medium text-xs px-2 py-1 rounded hover:bg-slate-100 transition-colors">
                          <i className="fa-solid fa-receipt mr-1"></i> Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-sm">
                    No transport fee records found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {paymentModalOpen && selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <h3 className="font-bold text-slate-900 text-base">Record Transport Payment</h3>
              <button
                onClick={() => setPaymentModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-slate-500 uppercase">Student Transport Account</span>
                <span className="text-xs font-mono font-semibold text-slate-700">{selectedRecord.id}</span>
              </div>
              <div className="font-semibold text-slate-900">{selectedRecord.studentName} ({selectedRecord.studentId})</div>
              <div className="text-xs text-slate-600 mt-0.5">{selectedRecord.zone} — {selectedRecord.tripType}</div>
              <div className="mt-3 flex gap-4 text-sm font-mono">
                <div><span className="text-slate-500 text-xs">Total Fee:</span> <strong className="text-slate-900">{selectedRecord.termFee}</strong></div>
                <div><span className="text-slate-500 text-xs">Remaining Balance:</span> <strong className="text-rose-600">{selectedRecord.balance}</strong></div>
              </div>
            </div>

            <form onSubmit={handleRecordPayment} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Amount Received ($)
                  </label>
                  <input
                    type="text"
                    required
                    defaultValue={selectedRecord.balance.replace('$', '')}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Payment Method
                  </label>
                  <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500">
                    <option value="M-Pesa / Mobile">Mobile Payment (M-Pesa / Airtel Money)</option>
                    <option value="Bank Transfer">Direct Bank Transfer</option>
                    <option value="Card">Credit / Debit Card</option>
                    <option value="Cheque">School Cheque</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Transaction / Reference No.
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. QX7892KL0P or Bank Ref"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Payment Date
                </label>
                <input
                  type="date"
                  required
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Remarks / Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Optional billing note..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPaymentModalOpen(false)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}