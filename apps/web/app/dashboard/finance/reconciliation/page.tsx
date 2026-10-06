'use client';

import { useState } from 'react';
import Link from 'next/link';

// TypeScript interface for a Reconciliation Item
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

// Initial mock data for reconciliation
const initialReconciliations: ReconciliationItem[] = [
  {
    id: 'REC-001',
    bankTxnRef: 'BNK-9842-ACH',
    systemRef: 'TXN-9842-2026',
    entityName: 'Oliver Twist (Tuition)',
    amount: '$3,625.00',
    bankDate: '2026-10-01 14:25',
    bankAccount: 'Chase Operational (*4821)',
    status: 'Matched',
  },
  {
    id: 'REC-002',
    bankTxnRef: 'BNK-9843-WIRE',
    systemRef: 'TXN-9843-2026',
    entityName: 'Charlotte Brontë (Boarding)',
    amount: '$3,400.00',
    bankDate: '2026-09-29 11:10',
    bankAccount: 'Chase Operational (*4821)',
    status: 'Matched',
  },
  {
    id: 'REC-003',
    bankTxnRef: 'BNK-9848-DEP',
    systemRef: 'Pending Match',
    entityName: 'Unknown Depositor (Check #104)',
    amount: '$1,250.00',
    bankDate: '2026-10-02 09:15',
    bankAccount: 'Wells Fargo Trust (*9104)',
    status: 'Unmatched',
  },
  {
    id: 'REC-004',
    bankTxnRef: 'BNK-9850-CC',
    systemRef: 'TXN-9844-2026',
    entityName: 'Arthur Conan Doyle (Tech)',
    amount: '$445.00',
    bankDate: '2026-09-28 09:42',
    bankAccount: 'Stripe Gateway (*1102)',
    status: 'Discrepancy',
  },
  {
    id: 'REC-005',
    bankTxnRef: 'BNK-9852-ACH',
    systemRef: 'Pending Match',
    entityName: 'Global Scholar Grants LLC',
    amount: '$12,500.00',
    bankDate: '2026-10-02 11:30',
    bankAccount: 'Chase Operational (*4821)',
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

  // Filter logic based on search, status, and bank account
  const filteredReconciliations = reconciliations.filter((rec) => {
    const matchesSearch =
      rec.bankTxnRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.systemRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.entityName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || rec.status === statusFilter;
    const matchesAccount = accountFilter === 'All' || rec.bankAccount.includes(accountFilter);

    return matchesSearch && matchesStatus && matchesAccount;
  });

  // Helper for status badge styling
  const getStatusBadge = (status: ReconciliationItem['status']) => {
    switch (status) {
      case 'Matched':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Unmatched':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Discrepancy':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Manual Review':
        return 'bg-purple-50 text-purple-700 border-purple-200';
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Bank Reconciliation & Statement Matching
          </h1>
          <p className="text-sm text-slate-500">
            Audit bank feeds against ledger transactions, resolve payment discrepancies, and reconcile institutional accounts.
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
            onClick={() => setUploadModalOpen(true)}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
          >
            <i className="fa-solid fa-file-arrow-up mr-2 text-xs"></i> Import Bank Feed
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
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Reconciled Rate</p>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <i className="fa-solid fa-scale-balanced text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">96.8%</p>
          <span className="text-xs text-emerald-600 font-medium"><i className="fa-solid fa-arrow-trend-up mr-1"></i> Current period match</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Unmatched Items</p>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <i className="fa-solid fa-clock text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">14</p>
          <span className="text-xs text-amber-600 font-medium">Pending auto-assignment</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Discrepancies</p>
            <div className="rounded-lg bg-rose-50 p-2 text-rose-600">
              <i className="fa-solid fa-triangle-exclamation text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">3</p>
          <span className="text-xs text-rose-600 font-medium">Requires fee verification</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Manual Review</p>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <i className="fa-solid fa-user-check text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">5</p>
          <span className="text-xs text-purple-600 font-medium">Grants & wire transfers</span>
        </div>
      </div>

      {/* Toolbar: Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-xs text-slate-400"></i>
          <input
            type="text"
            placeholder="Search bank reference, system ref, or entity name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Filters Group */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Bank Account Filter */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <span>Account:</span>
            <select
              value={accountFilter}
              onChange={(e) => setAccountFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Bank Accounts</option>
              <option value="Chase Operational">Chase Operational (*4821)</option>
              <option value="Wells Fargo">Wells Fargo Trust (*9104)</option>
              <option value="Stripe">Stripe Gateway (*1102)</option>
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
              <option value="Matched">Matched</option>
              <option value="Unmatched">Unmatched</option>
              <option value="Discrepancy">Discrepancy</option>
              <option value="Manual Review">Manual Review</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reconciliation Data Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Bank Txn Ref / Date</th>
                <th className="py-3 px-4">System Ref</th>
                <th className="py-3 px-4">Entity / Description</th>
                <th className="py-3 px-4">Bank Account</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredReconciliations.length > 0 ? (
                filteredReconciliations.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 font-mono text-xs">{rec.bankTxnRef}</div>
                      <div className="text-xs text-slate-500">{rec.bankDate}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-mono text-xs font-medium">{rec.systemRef}</td>
                    <td className="py-3.5 px-4 text-slate-800 text-xs font-medium">{rec.entityName}</td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs">{rec.bankAccount}</td>
                    <td className="py-3.5 px-4 text-slate-900 font-mono text-xs font-bold">{rec.amount}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(rec.status)}`}>
                        {rec.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-xs px-2 py-1 rounded hover:bg-blue-50 transition-colors">
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-sm">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <h3 className="font-bold text-slate-900 text-base">Import Bank Statement Feed</h3>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleUploadStatement} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Select Bank Account
                </label>
                <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500">
                  <option value="Chase Operational">Chase Operational (*4821)</option>
                  <option value="Wells Fargo">Wells Fargo Trust (*9104)</option>
                  <option value="Stripe">Stripe Gateway (*1102)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Statement File (CSV, OFX, or MT940)
                </label>
                <div className="mt-1 flex justify-center rounded-lg border border-dashed border-slate-300 px-6 py-8 hover:border-blue-500 transition-colors cursor-pointer bg-slate-50/50">
                  <div className="text-center">
                    <i className="fa-solid fa-cloud-arrow-up text-3xl text-slate-400 mb-2"></i>
                    <div className="text-sm text-slate-600 font-medium">
                      Click to upload or drag and drop
                    </div>
                    <p className="text-xs text-slate-400 mt-1">CSV, QFX, OFX up to 10MB</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Reconciliation Rule
                </label>
                <div className="space-y-2 pt-1">
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <span>Run AI auto-matching for exact amount & reference matches</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <span>Flag fee discrepancies greater than $5.00 for review</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
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