// apps/web/app/dashboard/library/circulation/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

/* ==========================================================================
   ELIMIX BRAND PALETTE
   ========================================================================== */
const BRAND = {
  navy: '#012E54',
  blue: '#006FBF',
  brightBlue: '#0088CE',
  cyan: '#04B1D6',
  teal: '#0199B9',
};

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

const initialLoans: CirculationItem[] = [
  {
    id: 'CIR-2026-901',
    borrowerName: 'Brian Kiprop',
    borrowerId: 'STD-2026-088',
    borrowerType: 'Student',
    bookTitle: 'Campbell Biology (11th Edition)',
    isbn: '978-0134093413',
    issueDate: '2026-09-20',
    dueDate: '2026-10-10',
    status: 'Active',
    fineAmount: 'KES 0.00',
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
    fineAmount: 'KES 900.00',
  },
  {
    id: 'CIR-2026-903',
    borrowerName: 'Kevin Otieno',
    borrowerId: 'STD-2026-104',
    borrowerType: 'Student',
    bookTitle: 'The Great Gatsby',
    isbn: '978-0743273565',
    issueDate: '2026-09-28',
    dueDate: '2026-10-12',
    status: 'Active',
    fineAmount: 'KES 0.00',
  },
  {
    id: 'CIR-2026-904',
    borrowerName: 'Grace Wanjiku',
    borrowerId: 'STD-2026-045',
    borrowerType: 'Student',
    bookTitle: "A People's History of the United States",
    isbn: '978-0060936220',
    issueDate: '2026-09-15',
    dueDate: '2026-10-05',
    status: 'Returned Today',
    fineAmount: 'KES 0.00',
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
    fineAmount: 'KES 1,800.00',
  },
];

export default function LibraryCirculationPage() {
  const [loans, setLoans] = useState<CirculationItem[]>(initialLoans);
  const [searchQuery, setSearchQuery] = useState('');
  const [borrowerTypeFilter, setBorrowerTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Filter logic
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

  // Status badge styling
  const getStatusBadge = (status: CirculationItem['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-sky-50 text-[#006FBF] border-sky-200';
      case 'Overdue':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'Returned Today':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Fine Pending':
        return 'bg-amber-50 text-amber-800 border-amber-200';
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
    <div className="flex-1 w-full min-w-0 bg-[#f4f7fb] min-h-screen p-4 sm:p-6 lg:p-8 font-sans overflow-x-hidden text-[#012E54]">
      
      {/* Page Header */}
      <div className="mb-6 lg:mb-8 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-extrabold text-[#012E54] mb-1 tracking-tight">
            Circulation Desk & Loans
          </h1>
          <p className="text-[12px] text-[#64748b]">
            Process book checkouts, manage active loans, record returns, and handle overdue fines.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard/library/books"
            className="h-[38px] px-4 rounded-xl border border-[#cbd5e1] bg-white text-[12px] font-semibold text-[#012E54] hover:bg-slate-50 transition-colors shadow-sm flex items-center"
          >
            <i className="fa-solid fa-book mr-2 text-xs text-[#006FBF]"></i> Book Catalog
          </Link>
          <button
            onClick={() => setIssueModalOpen(true)}
            className="h-[38px] px-4 rounded-xl text-white text-[12px] font-semibold hover:opacity-95 transition-all shadow-md shadow-sky-500/20 flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})`,
            }}
          >
            <i className="fa-solid fa-hand-holding-hand mr-2 text-xs"></i> Issue / Checkout Book
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
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Active Book Loans</p>
            <h3 className="text-[24px] font-extrabold text-[#012E54]">1,845</h3>
            <span className="text-[11px] text-[#006FBF] font-semibold mt-1 block">1,420 Students • 425 Faculty</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-sky-50 text-[#006FBF] flex items-center justify-center shrink-0">
            <i className="fa-solid fa-book-open-reader text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Due Today / Soon</p>
            <h3 className="text-[24px] font-extrabold text-[#012E54]">38</h3>
            <span className="text-[11px] text-indigo-600 font-semibold mt-1 block">Due within next 48 hours</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-calendar-day text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Overdue Books</p>
            <h3 className="text-[24px] font-extrabold text-[#012E54]">42</h3>
            <span className="text-[11px] text-rose-600 font-semibold mt-1 block">Reminders sent automatically</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-clock-rotate-left text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Uncollected Fines</p>
            <h3 className="text-[24px] font-extrabold text-[#012E54]">KES 40,860</h3>
            <span className="text-[11px] text-amber-600 font-semibold mt-1 block">28 outstanding fine accounts</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-receipt text-lg"></i>
          </div>
        </div>
      </div>

      {/* Toolbar: Search and Filters */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#e2e8f0] mb-6 w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-[360px]">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[12px]"></i>
          <input
            type="text"
            placeholder="Search borrower name, ID, book title, or ISBN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[40px] pl-9 pr-3 rounded-xl border border-[#cbd5e1] text-[12px] font-medium text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF] focus:ring-2 focus:ring-sky-500/20"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-[12px] font-medium text-[#64748b]">
            <span>Borrower:</span>
            <select
              value={borrowerTypeFilter}
              onChange={(e) => setBorrowerTypeFilter(e.target.value)}
              className="h-[38px] px-3 rounded-xl border border-[#cbd5e1] text-[12px] font-semibold text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF] cursor-pointer"
            >
              <option value="All">All Types</option>
              <option value="Student">Student</option>
              <option value="Faculty">Faculty</option>
              <option value="Staff">Staff</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-[12px] font-medium text-[#64748b]">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-[38px] px-3 rounded-xl border border-[#cbd5e1] text-[12px] font-semibold text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF] cursor-pointer"
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
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                <th className="py-3.5 px-5">Loan ID</th>
                <th className="py-3.5 px-5">Borrower</th>
                <th className="py-3.5 px-5">Book Title & ISBN</th>
                <th className="py-3.5 px-5">Issue / Due Date</th>
                <th className="py-3.5 px-5">Status & Fine</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
              {filteredLoans.length > 0 ? (
                filteredLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-slate-50/75 transition-colors">
                    <td className="py-4 px-5 font-mono text-[12px] font-bold text-[#012E54]">
                      {loan.id}
                    </td>
                    <td className="py-4 px-5">
                      <div className="font-bold text-[#012E54] text-[12px]">{loan.borrowerName}</div>
                      <div className="text-[11px] text-[#64748b] font-mono mt-0.5 flex items-center gap-1.5">
                        <span>{loan.borrowerId}</span>
                        <span className="text-[#006FBF] font-semibold">• {loan.borrowerType}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 max-w-xs">
                      <div className="font-semibold text-[#012E54] text-[12px] truncate">{loan.bookTitle}</div>
                      <div className="text-[11px] text-[#64748b] font-mono mt-0.5">{loan.isbn}</div>
                    </td>
                    <td className="py-4 px-5 font-mono text-[12px]">
                      <div className="text-[#012E54]">Issued: {loan.issueDate}</div>
                      <div className="text-[#64748b] text-[11px] mt-0.5">Due: {loan.dueDate}</div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(loan.status)}`}>
                          {loan.status}
                        </span>
                        {loan.fineAmount !== 'KES 0.00' && (
                          <span className="text-[11px] font-bold text-rose-600 font-mono mt-0.5">
                            Fine: {loan.fineAmount}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-5 text-right space-x-2">
                      {loan.status === 'Active' || loan.status === 'Overdue' ? (
                        <>
                          <button className="h-[32px] px-3 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-[12px] transition-colors">
                            Return Book
                          </button>
                          <button className="h-[32px] px-3 rounded-lg bg-sky-50 text-[#006FBF] hover:bg-sky-100 font-semibold text-[12px] transition-colors">
                            Extend
                          </button>
                        </>
                      ) : (
                        <button className="h-[32px] px-3 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold text-[12px] transition-colors">
                          Details
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#64748b] text-[13px]">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#012E54]/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-[#e2e8f0] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] bg-[#f8fafc] px-6 py-4">
              <h3 className="font-bold text-[#012E54] text-[15px]">Issue / Checkout Book</h3>
              <button
                onClick={() => setIssueModalOpen(false)}
                className="text-slate-400 hover:text-[#012E54] transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleIssueBook} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#012E54] uppercase tracking-wider mb-1.5">
                    Borrower ID / Scan
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. STD-2026-088"
                    className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#012E54] uppercase tracking-wider mb-1.5">
                    Borrower Type
                  </label>
                  <select className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF]">
                    <option value="Student">Student</option>
                    <option value="Faculty">Faculty</option>
                    <option value="Staff">Staff</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#012E54] uppercase tracking-wider mb-1.5">
                  Book ISBN or Barcode ID
                </label>
                <input
                  type="text"
                  required
                  placeholder="Scan or enter ISBN (e.g. 978-0134093413)"
                  className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF] font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#012E54] uppercase tracking-wider mb-1.5">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    required
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#012E54] uppercase tracking-wider mb-1.5">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#012E54] uppercase tracking-wider mb-1.5">
                  Circulation Notes / Remarks
                </label>
                <textarea
                  rows={2}
                  placeholder="Special conditions or condition notes at checkout..."
                  className="w-full rounded-xl border border-[#cbd5e1] p-3 text-[13px] text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF]"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f1f5f9]">
                <button
                  type="button"
                  onClick={() => setIssueModalOpen(false)}
                  className="h-[38px] px-4 rounded-xl border border-[#cbd5e1] bg-white text-[12px] font-semibold text-[#012E54] hover:bg-slate-50 transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-[38px] px-5 rounded-xl text-white text-[12px] font-semibold hover:opacity-95 transition-all shadow-md shadow-sky-500/20"
                  style={{
                    background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})`,
                  }}
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