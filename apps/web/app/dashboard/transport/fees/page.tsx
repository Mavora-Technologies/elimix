// apps/web/app/dashboard/transport/fees/page.tsx
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

const initialFees: TransportFeeItem[] = [
  {
    id: 'TRF-2026-101',
    studentName: 'Alex Johnson',
    studentId: 'STD-2026-088',
    gradeClass: 'Grade 8 - Alpha',
    zone: 'Zone 1 (Westlands / Kilimani)',
    tripType: 'Round Trip',
    termFee: 'KES 45,000.00',
    paidAmount: 'KES 45,000.00',
    balance: 'KES 0.00',
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
    termFee: 'KES 54,000.00',
    paidAmount: 'KES 25,000.00',
    balance: 'KES 29,000.00',
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
    termFee: 'KES 36,000.00',
    paidAmount: 'KES 0.00',
    balance: 'KES 36,000.00',
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
    termFee: 'KES 45,000.00',
    paidAmount: 'KES 0.00',
    balance: 'KES 45,000.00',
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
    termFee: 'KES 32,000.00',
    paidAmount: 'KES 32,000.00',
    balance: 'KES 0.00',
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

  // Filter logic
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

  // Status badge styling
  const getStatusBadge = (status: TransportFeeItem['status']) => {
    switch (status) {
      case 'Paid':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Partial':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Unpaid':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'Overdue':
        return 'bg-rose-50 text-rose-800 border-rose-200';
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
    <div className="flex-1 w-full min-w-0 bg-[#f4f7fb] min-h-screen p-4 sm:p-6 lg:p-8 font-sans overflow-x-hidden text-[#012E54]">
      
      {/* Page Header */}
      <div className="mb-6 lg:mb-8 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-extrabold text-[#012E54] mb-1 tracking-tight">
            Transport Fees & Billing
          </h1>
          <p className="text-[12px] text-[#64748b]">
            Manage student bus fare billing, track payments by zone, process receipts, and view pending balances.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard/transport/routes"
            className="h-[38px] px-4 rounded-xl border border-[#cbd5e1] bg-white text-[12px] font-semibold text-[#012E54] hover:bg-slate-50 transition-colors shadow-sm flex items-center"
          >
            <i className="fa-solid fa-route mr-2 text-xs text-[#006FBF]"></i> Route Catalog
          </Link>
          <button
            className="h-[38px] px-4 rounded-xl text-white text-[12px] font-semibold hover:opacity-95 transition-all shadow-md shadow-sky-500/20 flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})`,
            }}
          >
            <i className="fa-solid fa-file-export mr-2 text-xs"></i> Export Statement
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
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Total Term Revenue</p>
            <h3 className="text-[24px] font-extrabold text-[#012E54]">KES 23,450,000</h3>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center mt-1">
              <i className="fa-solid fa-arrow-trend-up mr-1"></i> 82% Collected Term 3
            </span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-sack-dollar text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Outstanding Balances</p>
            <h3 className="text-[24px] font-extrabold text-[#012E54]">KES 4,220,000</h3>
            <span className="text-[11px] text-rose-600 font-semibold mt-1 block">142 accounts with balance</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-triangle-exclamation text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Fully Paid Students</p>
            <h3 className="text-[24px] font-extrabold text-[#012E54]">703</h3>
            <span className="text-[11px] text-[#006FBF] font-semibold mt-1 block">Clear for bus boarding</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-sky-50 text-[#006FBF] flex items-center justify-center shrink-0">
            <i className="fa-solid fa-circle-check text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Overdue Reminders</p>
            <h3 className="text-[24px] font-extrabold text-[#012E54]">28</h3>
            <span className="text-[11px] text-amber-600 font-semibold mt-1 block">Notices auto-queued</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-bell text-lg"></i>
          </div>
        </div>
      </div>

      {/* Toolbar: Search and Filters */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#e2e8f0] mb-6 w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-[360px]">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[12px]"></i>
          <input
            type="text"
            placeholder="Search student name, ID, zone, or invoice..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[40px] pl-9 pr-3 rounded-xl border border-[#cbd5e1] text-[12px] font-medium text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF] focus:ring-2 focus:ring-sky-500/20"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-[12px] font-medium text-[#64748b]">
            <span>Trip Option:</span>
            <select
              value={tripTypeFilter}
              onChange={(e) => setTripTypeFilter(e.target.value)}
              className="h-[38px] px-3 rounded-xl border border-[#cbd5e1] text-[12px] font-semibold text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF] cursor-pointer"
            >
              <option value="All">All Options</option>
              <option value="Round Trip">Round Trip</option>
              <option value="One Way Morning">One Way Morning</option>
              <option value="One Way Evening">One Way Evening</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-[12px] font-medium text-[#64748b]">
            <span>Payment Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-[38px] px-3 rounded-xl border border-[#cbd5e1] text-[12px] font-semibold text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF] cursor-pointer"
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
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                <th className="py-3.5 px-5">Invoice ID</th>
                <th className="py-3.5 px-5">Student Info</th>
                <th className="py-3.5 px-5">Zone & Trip Type</th>
                <th className="py-3.5 px-5">Term Fee / Paid</th>
                <th className="py-3.5 px-5">Balance / Due Date</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
              {filteredFees.length > 0 ? (
                filteredFees.map((fee) => (
                  <tr key={fee.id} className="hover:bg-slate-50/75 transition-colors">
                    <td className="py-4 px-5 font-mono text-[12px] font-bold text-[#012E54]">
                      {fee.id}
                    </td>
                    <td className="py-4 px-5">
                      <div className="font-bold text-[#012E54] text-[13px]">{fee.studentName}</div>
                      <div className="text-[11px] text-[#64748b] font-mono mt-0.5 flex items-center gap-1.5 flex-wrap">
                        <span>{fee.studentId}</span>
                        <span className="text-[#012E54] font-semibold">• {fee.gradeClass}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="font-semibold text-[#012E54] text-[12px]">{fee.zone}</div>
                      <div className="text-[11px] text-[#006FBF] font-semibold mt-0.5">{fee.tripType}</div>
                    </td>
                    <td className="py-4 px-5 font-mono text-[12px]">
                      <div className="font-bold text-[#012E54]">Fee: {fee.termFee}</div>
                      <div className="text-emerald-600 font-semibold mt-0.5">Paid: {fee.paidAmount}</div>
                    </td>
                    <td className="py-4 px-5 font-mono text-[12px]">
                      <div className={`font-bold ${fee.balance !== 'KES 0.00' ? 'text-rose-600' : 'text-[#64748b]'}`}>
                        {fee.balance}
                      </div>
                      <div className="text-[#64748b] text-[11px] mt-0.5">Due: {fee.dueDate}</div>
                    </td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(fee.status)}`}>
                        {fee.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right space-x-2">
                      {fee.status !== 'Paid' ? (
                        <button
                          onClick={() => openPaymentModal(fee)}
                          className="h-[32px] px-3 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-[12px] transition-colors"
                        >
                          Record Payment
                        </button>
                      ) : (
                        <button className="h-[32px] px-3 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold text-[12px] transition-colors">
                          <i className="fa-solid fa-receipt mr-1"></i> Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#64748b] text-[13px]">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#012E54]/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-[#e2e8f0] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] bg-[#f8fafc] px-6 py-4">
              <h3 className="font-bold text-[#012E54] text-[15px]">Record Transport Payment</h3>
              <button
                onClick={() => setPaymentModalOpen(false)}
                className="text-slate-400 hover:text-[#012E54] transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <div className="px-6 py-4 bg-[#f8fafc] border-b border-[#e2e8f0]">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Student Transport Account</span>
                <span className="text-[11px] font-mono font-bold text-[#012E54]">{selectedRecord.id}</span>
              </div>
              <div className="font-bold text-[#012E54] text-[13px]">{selectedRecord.studentName} ({selectedRecord.studentId})</div>
              <div className="text-[12px] text-[#64748b] mt-0.5">{selectedRecord.zone} — {selectedRecord.tripType}</div>
              <div className="mt-3 flex gap-6 text-[13px] font-mono">
                <div><span className="text-[#64748b] text-[11px]">Total Fee:</span> <strong className="text-[#012E54]">{selectedRecord.termFee}</strong></div>
                <div><span className="text-[#64748b] text-[11px]">Balance:</span> <strong className="text-rose-600">{selectedRecord.balance}</strong></div>
              </div>
            </div>

            <form onSubmit={handleRecordPayment} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#012E54] uppercase tracking-wider mb-1.5">
                    Amount Received (KES)
                  </label>
                  <input
                    type="text"
                    required
                    defaultValue={selectedRecord.balance.replace('KES ', '')}
                    className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#012E54] uppercase tracking-wider mb-1.5">
                    Payment Method
                  </label>
                  <select className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF]">
                    <option value="M-Pesa">M-Pesa Mobile Money</option>
                    <option value="Bank Transfer">Direct Bank Transfer</option>
                    <option value="Card">Credit / Debit Card</option>
                    <option value="Cash">Cash Deposit</option>
                    <option value="Cheque">School Cheque</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#012E54] uppercase tracking-wider mb-1.5">
                  Transaction / Reference No.
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. QX7892KL0P or Bank Ref"
                  className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF] font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#012E54] uppercase tracking-wider mb-1.5">
                  Payment Date
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
                  Remarks / Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Optional billing note..."
                  className="w-full rounded-xl border border-[#cbd5e1] p-3 text-[13px] text-[#012E54] bg-[#f8fafc] focus:outline-none focus:border-[#006FBF]"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f1f5f9]">
                <button
                  type="button"
                  onClick={() => setPaymentModalOpen(false)}
                  className="h-[38px] px-4 rounded-xl border border-[#cbd5e1] bg-white text-[12px] font-semibold text-[#012E54] hover:bg-slate-50 transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-[38px] px-5 rounded-xl bg-emerald-600 text-white text-[12px] font-semibold hover:bg-emerald-500 transition-all shadow-md shadow-emerald-600/25"
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