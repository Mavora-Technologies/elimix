// apps/web/app/dashboard/finance/reconciliation/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ReconciliationItem {
  id: string;
  bankTxnRef: string;
  systemRef: string;
  entityName: string;
  amount: string;
  bankDate: string;
  bankAccount: string;
  status: 'Matched' | 'Unmatched' | 'Discrepancy' | 'Manual Review';
}

const initialReconciliations: ReconciliationItem[] = [
  {
    id: 'REC-001',
    bankTxnRef: 'BNK-9842-ACH',
    systemRef: 'TXN-9842-2026',
    entityName: 'Oliver Twist (Tuition)',
    amount: 'KSh 45,000.00',
    bankDate: '2026-10-01 14:25',
    bankAccount: 'KCB Operational (*4821)',
    status: 'Matched',
  },
  {
    id: 'REC-002',
    bankTxnRef: 'BNK-9843-WIRE',
    systemRef: 'TXN-9843-2026',
    entityName: 'Charlotte Brontë (Boarding)',
    amount: 'KSh 45,000.00',
    bankDate: '2026-09-29 11:10',
    bankAccount: 'KCB Operational (*4821)',
    status: 'Matched',
  },
  {
    id: 'REC-003',
    bankTxnRef: 'BNK-9848-DEP',
    systemRef: 'Pending Match',
    entityName: 'Unknown Depositor (Check #104)',
    amount: 'KSh 15,500.00',
    bankDate: '2026-10-02 09:15',
    bankAccount: 'Equity Bank Trust (*9104)',
    status: 'Unmatched',
  },
  {
    id: 'REC-004',
    bankTxnRef: 'BNK-9850-CC',
    systemRef: 'TXN-9844-2026',
    entityName: 'Arthur Conan Doyle (Tech)',
    amount: 'KSh 6,500.00',
    bankDate: '2026-09-28 09:42',
    bankAccount: 'M-Pesa Gateway (*1102)',
    status: 'Discrepancy',
  },
  {
    id: 'REC-005',
    bankTxnRef: 'BNK-9852-ACH',
    systemRef: 'Pending Match',
    entityName: 'Global Scholar Grants LLC',
    amount: 'KSh 150,000.00',
    bankDate: '2026-10-02 11:30',
    bankAccount: 'KCB Operational (*4821)',
    status: 'Manual Review',
  },
];

export default function FinanceReconciliationPage() {
  const [reconciliations, setReconciliations] = useState<ReconciliationItem[]>(initialReconciliations);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [accountFilter, setAccountFilter] = useState('All');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Filter logic
  const filteredReconciliations = reconciliations.filter((rec) => {
    const matchesSearch =
      rec.bankTxnRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.systemRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.entityName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || rec.status === statusFilter;
    const matchesAccount = accountFilter === 'All' || rec.bankAccount.includes(accountFilter);

    return matchesSearch && matchesStatus && matchesAccount;
  });

  // Status badge styling
  const getStatusBadge = (status: ReconciliationItem['status']) => {
    switch (status) {
      case 'Matched':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Unmatched':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Discrepancy':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'Manual Review':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const handleUploadStatement = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessBanner('Bank statement successfully imported and auto-reconciliation engine executed.');
    setUploadModalOpen(false);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  return (
    <div className="flex-1 w-full min-w-0 bg-[#f4f7fb] min-h-screen p-4 sm:p-6 lg:p-8 font-sans overflow-x-hidden text-[#042954]">
      
      {/* Page Header */}
      <div className="mb-6 lg:mb-8 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-extrabold text-[#042954] mb-1 tracking-tight">
            Bank Reconciliation & Statement Matching
          </h1>
          <p className="text-[12px] text-[#64748b]">
            Audit bank feeds against ledger transactions, resolve payment discrepancies, and reconcile institutional accounts.
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
            onClick={() => setUploadModalOpen(true)}
            className="h-[38px] px-4 rounded-xl bg-gradient-to-r from-[#042954] to-[#0ea5e9] text-white text-[12px] font-semibold hover:opacity-95 transition-all shadow-md shadow-sky-500/20 flex items-center justify-center"
          >
            <i className="fa-solid fa-file-arrow-up mr-2 text-xs"></i> Import Bank Feed
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
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Reconciled Rate</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">96.8%</h3>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center mt-1">
              <i className="fa-solid fa-arrow-trend-up mr-1"></i> Current period match
            </span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-teal-50 text-[#06b6d4] flex items-center justify-center shrink-0">
            <i className="fa-solid fa-scale-balanced text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Unmatched Items</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">14</h3>
            <span className="text-[11px] text-amber-600 font-semibold mt-1 block">Pending auto-assignment</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-clock text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Discrepancies</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">3</h3>
            <span className="text-[11px] text-rose-600 font-semibold mt-1 block">Requires fee verification</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-triangle-exclamation text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Manual Review</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">5</h3>
            <span className="text-[11px] text-purple-600 font-semibold mt-1 block">Grants & wire transfers</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-user-check text-lg"></i>
          </div>
        </div>
      </div>

      {/* Toolbar: Search and Filters */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#e2e8f0] mb-6 w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-[360px]">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[12px]"></i>
          <input
            type="text"
            placeholder="Search bank reference, system ref, or entity name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[40px] pl-9 pr-3 rounded-xl border border-[#cbd5e1] text-[12px] font-medium text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9] focus:ring-2 focus:ring-sky-500/20"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-[12px] font-medium text-[#64748b]">
            <span>Account:</span>
            <select
              value={accountFilter}
              onChange={(e) => setAccountFilter(e.target.value)}
              className="h-[38px] px-3 rounded-xl border border-[#cbd5e1] text-[12px] font-semibold text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9] cursor-pointer"
            >
              <option value="All">All Bank Accounts</option>
              <option value="KCB Operational">KCB Operational (*4821)</option>
              <option value="Equity Bank">Equity Bank Trust (*9104)</option>
              <option value="M-Pesa">M-Pesa Gateway (*1102)</option>
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
              <option value="Matched">Matched</option>
              <option value="Unmatched">Unmatched</option>
              <option value="Discrepancy">Discrepancy</option>
              <option value="Manual Review">Manual Review</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reconciliation Data Table */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                <th className="py-3.5 px-5">Bank Txn Ref / Date</th>
                <th className="py-3.5 px-5">System Ref</th>
                <th className="py-3.5 px-5">Entity / Description</th>
                <th className="py-3.5 px-5">Bank Account</th>
                <th className="py-3.5 px-5">Amount</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
              {filteredReconciliations.length > 0 ? (
                filteredReconciliations.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/75 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-bold text-[#042954] font-mono text-[12px]">{rec.bankTxnRef}</div>
                      <div className="text-[11px] text-[#64748b] mt-0.5">{rec.bankDate}</div>
                    </td>
                    <td className="py-4 px-5 text-[#64748b] font-mono text-[12px] font-semibold">{rec.systemRef}</td>
                    <td className="py-4 px-5 text-[#042954] text-[12px] font-medium">{rec.entityName}</td>
                    <td className="py-4 px-5 text-[#64748b] text-[12px]">{rec.bankAccount}</td>
                    <td className="py-4 px-5 text-[#042954] font-mono text-[12px] font-bold">{rec.amount}</td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(rec.status)}`}>
                        {rec.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button className="h-[32px] px-3 rounded-lg bg-sky-50 text-[#0ea5e9] hover:bg-sky-100 font-semibold text-[12px] transition-colors">
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#64748b] text-[13px]">
                    No matching reconciliation records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Import Bank Statement Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#042954]/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-[#e2e8f0] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] bg-[#f8fafc] px-6 py-4">
              <h3 className="font-bold text-[#042954] text-[15px]">Import Bank Statement Feed</h3>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="text-slate-400 hover:text-[#042954] transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleUploadStatement} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                  Select Bank Account
                </label>
                <select className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9]">
                  <option value="KCB Operational">KCB Operational (*4821)</option>
                  <option value="Equity Bank">Equity Bank Trust (*9104)</option>
                  <option value="M-Pesa">M-Pesa Gateway (*1102)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                  Statement File (CSV, OFX, or MT940)
                </label>
                <div className="mt-1 flex justify-center rounded-xl border border-dashed border-[#cbd5e1] px-6 py-8 hover:border-[#0ea5e9] transition-colors cursor-pointer bg-[#f8fafc]">
                  <div className="text-center">
                    <i className="fa-solid fa-cloud-arrow-up text-3xl text-[#0ea5e9] mb-2"></i>
                    <div className="text-[13px] text-[#042954] font-semibold">
                      Click to upload or drag and drop
                    </div>
                    <p className="text-[11px] text-[#64748b] mt-1">CSV, QFX, OFX up to 10MB</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                  Reconciliation Rule
                </label>
                <div className="space-y-2.5 pt-1">
                  <label className="flex items-center gap-2.5 text-[13px] font-medium text-[#042954] cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#0ea5e9] focus:ring-[#0ea5e9] w-4 h-4" />
                    <span>Run AI auto-matching for exact amount & reference matches</span>
                  </label>
                  <label className="flex items-center gap-2.5 text-[13px] font-medium text-[#042954] cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#0ea5e9] focus:ring-[#0ea5e9] w-4 h-4" />
                    <span>Flag fee discrepancies greater than KSh 500.00 for review</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f1f5f9]">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="h-[38px] px-4 rounded-xl border border-[#cbd5e1] bg-white text-[12px] font-semibold text-[#042954] hover:bg-slate-50 transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-[38px] px-5 rounded-xl bg-gradient-to-r from-[#042954] to-[#0ea5e9] text-white text-[12px] font-semibold hover:opacity-95 transition-all shadow-md shadow-sky-500/20"
                >
                  Upload & Reconcile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}