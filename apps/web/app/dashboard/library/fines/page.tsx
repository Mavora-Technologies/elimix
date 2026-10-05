'use client';

import { useState } from 'react';
import Link from 'next/link';

// TypeScript interface for a Library Fine record
interface FineItem {
  id: string;
  borrowerName: string;
  borrowerId: string;
  borrowerType: 'Student' | 'Faculty' | 'Staff';
  reason: string;
  associatedBook: string;
  amount: string;
  dateIncurred: string;
  status: 'Unpaid' | 'Paid' | 'Waived' | 'Partial Payment';
}

// Initial mock data for library fines
const initialFines: FineItem[] = [
  {
    id: 'FIN-2026-401',
    borrowerName: 'Sarah Jenkins',
    borrowerId: 'FAC-2024-012',
    borrowerType: 'Faculty',
    reason: 'Overdue (15 days)',
    associatedBook: 'Learning Python, 5th Edition',
    amount: '$7.50',
    dateIncurred: '2026-09-25',
    status: 'Unpaid',
  },
  {
    id: 'FIN-2026-402',
    borrowerName: 'Michael Chang',
    borrowerId: 'STD-2026-104',
    borrowerType: 'Student',
    reason: 'Lost Book Replacement',
    associatedBook: 'The Great Gatsby',
    amount: '$25.00',
    dateIncurred: '2026-09-28',
    status: 'Unpaid',
  },
  {
    id: 'FIN-2026-403',
    borrowerName: 'Dr. Robert Vance',
    borrowerId: 'FAC-2022-005',
    borrowerType: 'Faculty',
    reason: 'Overdue (30 days)',
    associatedBook: 'Oxford English Dictionary',
    amount: '$15.00',
    dateIncurred: '2026-09-10',
    status: 'Partial Payment',
  },
  {
    id: 'FIN-2026-404',
    borrowerName: 'Emily Clark',
    borrowerId: 'STD-2026-211',
    borrowerType: 'Student',
    reason: 'Damaged Cover',
    associatedBook: 'Campbell Biology (11th Edition)',
    amount: '$10.00',
    dateIncurred: '2026-09-05',
    status: 'Paid',
  },
  {
    id: 'FIN-2026-405',
    borrowerName: 'John Smith',
    borrowerId: 'STD-2026-305',
    borrowerType: 'Student',
    reason: 'Overdue (3 days)',
    associatedBook: 'A People\'s History of the United States',
    amount: '$1.50',
    dateIncurred: '2026-10-02',
    status: 'Waived',
  },
];

export default function LibraryFinesPage() {
  const [fines, setFines] = useState<FineItem[]>(initialFines);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [borrowerTypeFilter, setBorrowerTypeFilter] = useState('All');
  const [processModalOpen, setProcessModalOpen] = useState(false);
  const [selectedFine, setSelectedFine] = useState<FineItem | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Filter logic based on search, status, and borrower type
  const filteredFines = fines.filter((fine) => {
    const matchesSearch =
      fine.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fine.borrowerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fine.borrowerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fine.associatedBook.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || fine.status === statusFilter;
    const matchesType = borrowerTypeFilter === 'All' || fine.borrowerType === borrowerTypeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Helper for status badge styling
  const getStatusBadge = (status: FineItem['status']) => {
    switch (status) {
      case 'Paid':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Unpaid':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Partial Payment':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Waived':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const openProcessModal = (fine: FineItem) => {
    setSelectedFine(fine);
    setProcessModalOpen(true);
  };

  const handleProcessFine = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessBanner(`Fine transaction for ${selectedFine?.borrowerName} successfully processed.`);
    setProcessModalOpen(false);
    setSelectedFine(null);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Library Fines & Penalties
          </h1>
          <p className="text-sm text-slate-500">
            Track overdue book fines, manage lost book penalties, and process student/faculty payments.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/library/circulation"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <i className="fa-solid fa-hand-holding-hand mr-2 text-xs text-blue-600"></i> Circulation Desk
          </Link>
          <button
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
          >
            <i className="fa-solid fa-file-invoice mr-2 text-xs"></i> Generate Fine Report
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
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Outstanding Fines</p>
            <div className="rounded-lg bg-rose-50 p-2 text-rose-600">
              <i className="fa-solid fa-triangle-exclamation text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">$340.50</p>
          <span className="text-xs text-rose-600 font-medium">Across 28 accounts</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Collected YTD</p>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <i className="fa-solid fa-sack-dollar text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">$1,285.00</p>
          <span className="text-xs text-emerald-600 font-medium"><i className="fa-solid fa-arrow-trend-up mr-1"></i> Transferred to Finance</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Fines Waived YTD</p>
            <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
              <i className="fa-solid fa-handshake-angle text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">$142.00</p>
          <span className="text-xs text-slate-500 font-medium">Amnesty / Grace exceptions</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Lost Books</p>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <i className="fa-solid fa-book-skull text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">12</p>
          <span className="text-xs text-amber-600 font-medium">Replacement fees pending</span>
        </div>
      </div>

      {/* Toolbar: Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-xs text-slate-400"></i>
          <input
            type="text"
            placeholder="Search borrower name, ID, or book title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Filters Group */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Borrower Type Filter */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <span>Borrower:</span>
            <select
              value={borrowerTypeFilter}
              onChange={(e) => setBorrowerTypeFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Types</option>
              <option value="Student">Student</option>
              <option value="Faculty">Faculty</option>
              <option value="Staff">Staff</option>
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
              <option value="Unpaid">Unpaid</option>
              <option value="Paid">Paid</option>
              <option value="Partial Payment">Partial Payment</option>
              <option value="Waived">Waived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Fines Data Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Fine ID</th>
                <th className="py-3 px-4">Borrower</th>
                <th className="py-3 px-4">Reason / Associated Book</th>
                <th className="py-3 px-4">Amount / Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredFines.length > 0 ? (
                filteredFines.map((fine) => (
                  <tr key={fine.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-xs font-semibold text-slate-900">
                      {fine.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 text-xs">{fine.borrowerName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {fine.borrowerId} • <span className="text-blue-600 font-medium">{fine.borrowerType}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-medium text-slate-900 text-xs truncate">{fine.reason}</div>
                      <div className="text-[11px] text-slate-500 truncate">{fine.associatedBook}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-900 text-sm font-bold font-mono">{fine.amount}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{fine.dateIncurred}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(fine.status)}`}>
                        {fine.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      {(fine.status === 'Unpaid' || fine.status === 'Partial Payment') ? (
                        <button 
                          onClick={() => openProcessModal(fine)}
                          className="text-emerald-600 hover:text-emerald-800 font-medium text-xs px-2 py-1 rounded hover:bg-emerald-50 transition-colors"
                        >
                          Process
                        </button>
                      ) : (
                        <button className="text-slate-600 hover:text-slate-800 font-medium text-xs px-2 py-1 rounded hover:bg-slate-100 transition-colors">
                          Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 text-sm">
                    No fine records found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Process Fine Modal */}
      {processModalOpen && selectedFine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <h3 className="font-bold text-slate-900 text-base">Process Library Fine</h3>
              <button
                onClick={() => setProcessModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            
            <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase">Borrower Details</span>
                <span className="text-xs font-mono font-semibold text-slate-700">{selectedFine.id}</span>
              </div>
              <div className="font-medium text-slate-900">{selectedFine.borrowerName} ({selectedFine.borrowerId})</div>
              <div className="text-sm text-slate-600 mt-1">{selectedFine.reason} — {selectedFine.associatedBook}</div>
              <div className="mt-3 text-lg font-bold text-rose-600">Total Due: {selectedFine.amount}</div>
            </div>

            <form onSubmit={handleProcessFine} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Action Type
                  </label>
                  <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500">
                    <option value="Payment">Record Payment</option>
                    <option value="Waive">Waive Fine (Amnesty)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Payment Method
                  </label>
                  <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500">
                    <option value="Cash">Cash</option>
                    <option value="Card">Credit / Debit Card</option>
                    <option value="Student Account">Bill to Student Account</option>
                    <option value="N/A">N/A (If Waived)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Amount Processing ($)
                </label>
                <input
                  type="text"
                  required
                  defaultValue={selectedFine.amount.replace('$', '')}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Notes / Remarks
                </label>
                <textarea
                  rows={2}
                  placeholder="Reason for waiver or payment reference note..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setProcessModalOpen(false)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors"
                >
                  Confirm Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}