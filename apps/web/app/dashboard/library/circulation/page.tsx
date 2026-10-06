'use client';

import { useState } from 'react';
import Link from 'next/link';

// TypeScript interface for a Library Circulation / Loan record
interface CirculationItem {
  id: string;
  borrowerName: string;
  borrowerId: string;
  borrowerType: 'Student' | 'Faculty' | 'Staff';
  bookTitle: string;
  isbn: string;
  issueDate: string;
  dueDate: string;
  status: 'Active' | 'Overdue' | 'Returned Today' | 'Fine Pending';
  fineAmount: string;
}

// Initial mock data for library loans
const initialLoans: CirculationItem[] = [
  {
    id: 'CIR-2026-901',
    borrowerName: 'Alex Johnson',
    borrowerId: 'STD-2026-088',
    borrowerType: 'Student',
    bookTitle: 'Campbell Biology (11th Edition)',
    isbn: '978-0134093413',
    issueDate: '2026-09-20',
    dueDate: '2026-10-10',
    status: 'Active',
    fineAmount: '$0.00',
  },
  {
    id: 'CIR-2026-902',
    borrowerName: 'Sarah Jenkins',
    borrowerId: 'FAC-2024-012',
    borrowerType: 'Faculty',
    bookTitle: 'Learning Python, 5th Edition',
    isbn: '978-1449331818',
    issueDate: '2026-09-01',
    dueDate: '2026-09-25',
    status: 'Overdue',
    fineAmount: '$7.50',
  },
  {
    id: 'CIR-2026-903',
    borrowerName: 'Michael Chang',
    borrowerId: 'STD-2026-104',
    borrowerType: 'Student',
    bookTitle: 'The Great Gatsby',
    isbn: '978-0743273565',
    issueDate: '2026-09-28',
    dueDate: '2026-10-12',
    status: 'Active',
    fineAmount: '$0.00',
  },
  {
    id: 'CIR-2026-904',
    borrowerName: 'David Miller',
    borrowerId: 'STD-2026-045',
    borrowerType: 'Student',
    bookTitle: 'A People\'s History of the United States',
    isbn: '978-0060936220',
    issueDate: '2026-09-15',
    dueDate: '2026-10-05',
    status: 'Returned Today',
    fineAmount: '$0.00',
  },
  {
    id: 'CIR-2026-905',
    borrowerName: 'Dr. Robert Vance',
    borrowerId: 'FAC-2022-005',
    borrowerType: 'Faculty',
    bookTitle: 'Oxford English Dictionary',
    isbn: '978-0199232133',
    issueDate: '2026-08-10',
    dueDate: '2026-09-10',
    status: 'Fine Pending',
    fineAmount: '$15.00',
  },
];

export default function LibraryCirculationPage() {
  const [loans, setLoans] = useState<CirculationItem[]>(initialLoans);
  const [searchQuery, setSearchQuery] = useState('');
  const [borrowerTypeFilter, setBorrowerTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Filter logic based on search, borrower type, and status
  const filteredLoans = loans.filter((loan) => {
    const matchesSearch =
      loan.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.borrowerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.borrowerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.isbn.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = borrowerTypeFilter === 'All' || loan.borrowerType === borrowerTypeFilter;
    const matchesStatus = statusFilter === 'All' || loan.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Helper for status badge styling
  const getStatusBadge = (status: CirculationItem['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Overdue':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Returned Today':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Fine Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const handleIssueBook = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessBanner('Book successfully checked out and registered to borrower.');
    setIssueModalOpen(false);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Circulation Desk & Loans
          </h1>
          <p className="text-sm text-slate-500">
            Process book checkouts, manage active loans, record returns, and handle overdue fines.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/library/books"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <i className="fa-solid fa-book mr-2 text-xs text-blue-600"></i> Book Catalog
          </Link>
          <button
            onClick={() => setIssueModalOpen(true)}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
          >
            <i className="fa-solid fa-hand-holding-hand mr-2 text-xs"></i> Issue / Checkout Book
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
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Book Loans</p>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <i className="fa-solid fa-book-open-reader text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">1,845</p>
          <span className="text-xs text-blue-600 font-medium">1,420 Students • 425 Faculty</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Due Today / Soon</p>
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
              <i className="fa-solid fa-calendar-day text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">38</p>
          <span className="text-xs text-indigo-600 font-medium">Due within next 48 hours</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overdue Books</p>
            <div className="rounded-lg bg-rose-50 p-2 text-rose-600">
              <i className="fa-solid fa-clock-rotate-left text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">42</p>
          <span className="text-xs text-rose-600 font-medium">Reminders sent automatically</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Uncollected Fines</p>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <i className="fa-solid fa-receipt text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">$340.50</p>
          <span className="text-xs text-amber-600 font-medium">28 outstanding fine accounts</span>
        </div>
      </div>

      {/* Toolbar: Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-xs text-slate-400"></i>
          <input
            type="text"
            placeholder="Search borrower name, ID, book title, or ISBN..."
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
              <option value="Active">Active</option>
              <option value="Overdue">Overdue</option>
              <option value="Returned Today">Returned Today</option>
              <option value="Fine Pending">Fine Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Circulation Loans Data Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Loan ID</th>
                <th className="py-3 px-4">Borrower</th>
                <th className="py-3 px-4">Book Title & ISBN</th>
                <th className="py-3 px-4">Issue / Due Date</th>
                <th className="py-3 px-4">Status & Fine</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredLoans.length > 0 ? (
                filteredLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-xs font-semibold text-slate-900">
                      {loan.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 text-xs">{loan.borrowerName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {loan.borrowerId} • <span className="text-blue-600 font-medium">{loan.borrowerType}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-medium text-slate-900 text-xs truncate">{loan.bookTitle}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{loan.isbn}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 text-xs font-mono">Issued: {loan.issueDate}</div>
                      <div className="text-xs font-mono font-medium text-slate-600">Due: {loan.dueDate}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(loan.status)}`}>
                          {loan.status}
                        </span>
                        {loan.fineAmount !== '$0.00' && (
                          <span className="text-[11px] font-bold text-rose-600 font-mono">
                            Fine: {loan.fineAmount}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      {loan.status === 'Active' || loan.status === 'Overdue' ? (
                        <>
                          <button className="text-emerald-600 hover:text-emerald-800 font-medium text-xs px-2 py-1 rounded hover:bg-emerald-50 transition-colors">
                            Return Book
                          </button>
                          <button className="text-blue-600 hover:text-blue-800 font-medium text-xs px-2 py-1 rounded hover:bg-blue-50 transition-colors">
                            Extend
                          </button>
                        </>
                      ) : (
                        <button className="text-slate-600 hover:text-slate-800 font-medium text-xs px-2 py-1 rounded hover:bg-slate-100 transition-colors">
                          Details
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 text-sm">
                    No loan or circulation records found matching your query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue / Checkout Book Modal */}
      {issueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <h3 className="font-bold text-slate-900 text-base">Issue / Checkout Book</h3>
              <button
                onClick={() => setIssueModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleIssueBook} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Borrower ID / Scan
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. STD-2026-088"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Borrower Type
                  </label>
                  <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500">
                    <option value="Student">Student</option>
                    <option value="Faculty">Faculty</option>
                    <option value="Staff">Staff</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Book ISBN or Barcode ID
                </label>
                <input
                  type="text"
                  required
                  placeholder="Scan or enter ISBN (e.g. 978-0134093413)"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Issue Date
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
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Circulation Notes / Remarks
                </label>
                <textarea
                  rows={2}
                  placeholder="Special conditions or condition notes at checkout..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIssueModalOpen(false)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
                >
                  Confirm Checkout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}