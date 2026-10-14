// apps/web/app/dashboard/library/fines/page.tsx
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

const initialFines: FineItem[] = [
  {
    id: 'FIN-2026-401',
    borrowerName: 'Sarah Jenkins',
    borrowerId: 'FAC-2024-012',
    borrowerType: 'Faculty',
    reason: 'Overdue (15 days)',
    associatedBook: 'Learning Python, 5th Edition',
    amount: 'KES 900.00',
    dateIncurred: '2026-09-25',
    status: 'Unpaid',
  },
  {
    id: 'FIN-2026-402',
    borrowerName: 'Kevin Otieno',
    borrowerId: 'STD-2026-104',
    borrowerType: 'Student',
    reason: 'Lost Book Replacement',
    associatedBook: 'The Great Gatsby',
    amount: 'KES 3,000.00',
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
    amount: 'KES 1,800.00',
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
    amount: 'KES 1,200.00',
    dateIncurred: '2026-09-05',
    status: 'Paid',
  },
  {
    id: 'FIN-2026-405',
    borrowerName: 'Brian Kiprop',
    borrowerId: 'STD-2026-088',
    borrowerType: 'Student',
    reason: 'Overdue (3 days)',
    associatedBook: "A People's History of the United States",
    amount: 'KES 180.00',
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

  // Filter logic
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

  // Status badge styling
  const getStatusBadge = (status: FineItem['status']) => {
    switch (status) {
      case 'Paid':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Unpaid':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'Partial Payment':
        return 'bg-amber-50 text-amber-800 border-amber-200';
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
    <div className="flex-1 w-full min-w-0 bg-[#f4f7fb] min-h-screen p-4 sm:p-6 lg:p-8 font-sans overflow-x-hidden text-[#012E54]">
      
      {/* Page Header */}
      <div className="mb-6 lg:mb-8 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-extrabold text-[#012E54] mb-1 tracking-tight">
            Library Fines & Penalties
          </h1>
          <p className="text-[12px] text-[#64748b]">
            Track overdue book fines, manage lost book penalties, and process student/faculty payments.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard/library/circulation"
            className="h-[38px] px-4 rounded-xl border border-[#cbd5e1] bg-white text-[12px] font-semibold text-[#012E54] hover:bg-slate-50 transition-colors shadow-sm flex items-center"
          >
            <i className="fa-solid fa-hand-holding-hand mr-2 text-xs text-[#006FBF]"></i> Circulation Desk
          </Link>
          <button
            className="h-[38px] px-4 rounded-xl text-white text-[12px] font-semibold hover:opacity-95 transition-all shadow-md shadow-sky-500/20 flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})`,
            }}
          >
            <i className="fa-solid fa-file-invoice mr-2 text-xs"></i> Generate Fine Report
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
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Outstanding Fines</p>
            <h3 className="text-[24px] font-extrabold text-[#012E54]">KES 40,860</h3>
            <span className="text-[11px] text-rose-600 font-semibold mt-1 block">Across 28 accounts</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-triangle-exclamation text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Collected YTD</p>
            <h3 className="text-[24px] font-extrabold text-[#012E54]">KES 154,200</h3>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center mt-1">
              <i className="fa-solid fa-arrow-trend-up mr-1"></i> Transferred to Finance
            </span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-sack-dollar text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Fines Waived YTD</p>
            <h3 className="text-[24px] font-extrabold text-[#012E54]">KES 17,040</h3>
            <span className="text-[11px] text-[#64748b] font-semibold mt-1 block">Amnesty / Grace exceptions</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-handshake-angle text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Lost Books</p>
            <h3 className="text-[24px] font-extrabold text-[#012E54]">12</h3>
            <span className="text-[11px] text-amber-600 font-semibold mt-1 block">Replacement fees pending</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-book-skull text-lg"></i>
          </div>
        </div>
      </div>

      {/* Toolbar: Search and Filters */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#e2e8f0] mb-6 w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-[360px]">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[12px]"></i>
          <input
            type="text"
            placeholder="Search borrower name, ID, or book title..."
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
              <option value="Unpaid">Unpaid</option>
              <option value="Paid">Paid</option>
              <option value="Partial Payment">Partial Payment</option>
              <option value="Waived">Waived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Fines Data Table */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                <th className="py-3.5 px-5">Fine ID</th>
                <th className="py-3.5 px-5">Borrower</th>
                <th className="py-3.5 px-5">Reason / Associated Book</th>
                <th className="py-3.5 px-5">Amount / Date</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
              {filteredFines.length > 0 ? (
                filteredFines.map((fine) => (
                  <tr key={fine.id} className="hover:bg-slate-50/75 transition-colors">
                    <td className="py-4 px-5 font-mono text-[12px] font-bold text-[#012E54]">
                      {fine.id}
                    </td>
                    <td className="py-4 px-5">
                      <div className="font-bold text-[#012E54] text-[12px]">{fine.borrowerName}</div>
                      <div className="text-[11px] text-[#64748b] font-mono mt-0.5 flex items-center gap-1.5">
                        <span>{fine.borrowerId}</span>
                        <span className="text-[#006FBF] font-semibold">• {fine.borrowerType}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 max-w-xs">
                      <div className="font-semibold text-[#012E54] text-[12px] truncate">{fine.reason}</div>
                      <div className="text-[11px] text-[#64748b] truncate mt-0.5">{fine.associatedBook}</div>
                    </td>
                    <td className="py-4 px-5 font-mono text-[12px]">
                      <div className="font-bold text-[#012E54]">{fine.amount}</div>
                      <div className="text-[#64748b] text-[11px] mt-0.5">{fine.dateIncurred}</div>
                    </td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(fine.status)}`}>
                        {fine.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right space-x-2">
                      {(fine.status === 'Unpaid' || fine.status === 'Partial Payment') ? (
                        <button 
                          onClick={() => openProcessModal(fine)}
                          className="h-[32px] px-3 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-[12px] transition-colors"
                        >
                          Process
                        </button>
                      ) : (
                        <button className="h-[32px] px-3 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold text-[12px] transition-colors">
                          Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#64748b] text-[13px]">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#012E54]/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-[#e2e8f0] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] bg-[#f8fafc] px-6 py-4">
              <h3 className="font-bold text-[#012E54] text-[15px]">Process Library Fine</h3>
              <button
                onClick={() => setProcessModalOpen(false)}
                className="text-slate-400 hover:text-[#012E54] transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            
            <div className="px-6 py-4 bg-[#f8fafc] border-b border-[#e2e8f0]">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Borrower Details</span>
                <span className="text-[11px] font-mono font-bold text-[#012E54]">{selectedFine.id}</span>
              </div>
              <div className="font-bold text-[#012E54] text-[13px]">{selectedFine.borrowerName} ({selectedFine.borrowerId})</div>
              <div className="text-[12px] text-[#64748b] mt-0.5">{selectedFine.reason} — {selectedFine.associatedBook}</div>
              <div className="mt-2 text-[16px] font-extrabold text-rose-600">Total Due: {selectedFine.amount}</div>
            </div>

            <form onSubmit={handleProcessFine} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#012E54] uppercase tracking-wider mb-1.5">
                    Action Type
                  </label>
                  <select className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF]">
                    <option value="Payment">Record Payment</option>
                    <option value="Waive">Waive Fine (Amnesty)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#012E54] uppercase tracking-wider mb-1.5">
                    Payment Method
                  </label>
                  <select className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF]">
                    <option value="Cash">Cash</option>
                    <option value="M-Pesa">M-Pesa Mobile Money</option>
                    <option value="Card">Credit / Debit Card</option>
                    <option value="Student Account">Bill to Student Account</option>
                    <option value="N/A">N/A (If Waived)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#012E54] uppercase tracking-wider mb-1.5">
                  Amount Processing (KES)
                </label>
                <input
                  type="text"
                  required
                  defaultValue={selectedFine.amount.replace('KES ', '')}
                  className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF] font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#012E54] uppercase tracking-wider mb-1.5">
                  Notes / Remarks
                </label>
                <textarea
                  rows={2}
                  placeholder="Reason for waiver or payment reference note..."
                  className="w-full rounded-xl border border-[#cbd5e1] p-3 text-[13px] text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF]"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f1f5f9]">
                <button
                  type="button"
                  onClick={() => setProcessModalOpen(false)}
                  className="h-[38px] px-4 rounded-xl border border-[#cbd5e1] bg-white text-[12px] font-semibold text-[#012E54] hover:bg-slate-50 transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-[38px] px-5 rounded-xl bg-emerald-600 text-white text-[12px] font-semibold hover:bg-emerald-500 transition-all shadow-md shadow-emerald-600/25"
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