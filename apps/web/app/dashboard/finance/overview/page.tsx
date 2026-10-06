'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function FinanceOverviewPage() {
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessBanner('Executive financial audit report successfully generated and queued for download.');
    setReportModalOpen(false);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Financial Overview & Executive Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Monitor institutional revenue streams, collection rates, operating budgets, and rapid access to financial modules.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setReportModalOpen(true)}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <i className="fa-solid fa-download mr-2 text-xs text-blue-600"></i> Export Audit Report
          </button>
          <Link
            href="/dashboard/finance/invoices"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
          >
            <i className="fa-solid fa-file-invoice mr-2 text-xs"></i> View Invoices
          </Link>
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
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Projected Revenue</p>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <i className="fa-solid fa-vault text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">$1,850,000</p>
          <span className="text-xs text-emerald-600 font-medium"><i className="fa-solid fa-arrow-trend-up mr-1"></i> +8.4% vs last academic year</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Collected YTD</p>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <i className="fa-solid fa-circle-check text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">$1,482,500</p>
          <span className="text-xs text-emerald-600 font-medium">80.1% overall collection rate</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Outstanding Receivables</p>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <i className="fa-solid fa-clock text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">$314,100</p>
          <span className="text-xs text-amber-600 font-medium">Pending & overdue balances</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Operating Expenses</p>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <i className="fa-solid fa-receipt text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">$942,300</p>
          <span className="text-xs text-purple-600 font-medium">Within annual budget limits</span>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/dashboard/finance/invoices"
          className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-500 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <i className="fa-solid fa-file-invoice text-base"></i>
            </div>
            <i className="fa-solid fa-arrow-right text-xs text-slate-300 group-hover:text-blue-600 transition-colors"></i>
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Invoices & Billing</h3>
          <p className="text-xs text-slate-500 mt-1">Issue tuition bills, track fees, and manage student invoicing.</p>
        </Link>

        <Link
          href="/dashboard/finance/payments"
          className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-500 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="rounded-lg bg-emerald-50 p-2.5 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <i className="fa-solid fa-cash-register text-base"></i>
            </div>
            <i className="fa-solid fa-arrow-right text-xs text-slate-300 group-hover:text-emerald-600 transition-colors"></i>
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Payment History</h3>
          <p className="text-xs text-slate-500 mt-1">Review transaction logs, card payments, and manual receipts.</p>
        </Link>

        <Link
          href="/dashboard/finance/statements"
          className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-500 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="rounded-lg bg-purple-50 p-2.5 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <i className="fa-solid fa-address-book text-base"></i>
            </div>
            <i className="fa-solid fa-arrow-right text-xs text-slate-300 group-hover:text-purple-600 transition-colors"></i>
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Account Statements</h3>
          <p className="text-xs text-slate-500 mt-1">Audit student ledger balances and dispatch formal statements.</p>
        </Link>

        <Link
          href="/dashboard/finance/reconciliation"
          className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-500 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="rounded-lg bg-amber-50 p-2.5 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <i className="fa-solid fa-scale-balanced text-base"></i>
            </div>
            <i className="fa-solid fa-arrow-right text-xs text-slate-300 group-hover:text-amber-600 transition-colors"></i>
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Bank Reconciliation</h3>
          <p className="text-xs text-slate-500 mt-1">Import bank statement feeds and match ledger transactions.</p>
        </Link>
      </div>

      {/* Two-Column Section: Revenue Breakdown & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Breakdown by Category */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Revenue by Category</h3>
            <span className="text-xs text-slate-500 font-medium">Academic Year 2026</span>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Tuition & Core Academic</span>
                <span className="font-mono">$1,240,000 (67%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '67%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Boarding & Residence</span>
                <span className="font-mono">$385,000 (21%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '21%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Extracurricular Activities</span>
                <span className="font-mono">$145,000 (8%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '8%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Technology & Lab Fees</span>
                <span className="font-mono">$80,000 (4%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '4%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Financial Activity Feed */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Recent Financial Activity</h3>
            <Link href="/dashboard/finance/payments" className="text-xs font-semibold text-blue-600 hover:text-blue-800">
              View All Transactions →
            </Link>
          </div>

          <div className="divide-y divide-slate-200">
            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                  <i className="fa-solid fa-arrow-down text-sm"></i>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Payment Received - Oliver Twist</div>
                  <div className="text-[11px] text-slate-500">Credit Card • Invoice #INV-2026-1001</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold font-mono text-emerald-700">+$3,625.00</div>
                <div className="text-[10px] text-slate-400">Today, 14:22</div>
              </div>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                  <i className="fa-solid fa-arrow-down text-sm"></i>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Payment Received - Charlotte Brontë</div>
                  <div className="text-[11px] text-slate-500">Bank Transfer • Invoice #INV-2026-1002</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold font-mono text-emerald-700">+$3,400.00</div>
                <div className="text-[10px] text-slate-400">Sep 29, 11:05</div>
              </div>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                  <i className="fa-solid fa-file-circle-plus text-sm"></i>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Invoice Issued - H.G. Wells</div>
                  <div className="text-[11px] text-slate-500">Tuition & Lab Fee • Invoice #INV-2026-1005</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold font-mono text-slate-900">$820.00</div>
                <div className="text-[10px] text-slate-400">Sep 26, 09:00</div>
              </div>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                  <i className="fa-solid fa-arrow-down text-sm"></i>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Payment Received - Arthur Conan Doyle</div>
                  <div className="text-[11px] text-slate-500">Credit Card • Invoice #INV-2026-1003</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold font-mono text-emerald-700">+$450.00</div>
                <div className="text-[10px] text-slate-400">Sep 28, 09:40</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Audit Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <h3 className="font-bold text-slate-900 text-base">Export Executive Financial Audit Report</h3>
              <button
                onClick={() => setReportModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleGenerateReport} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Report Scope & Period
                </label>
                <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500">
                  <option value="Current Academic Year">Academic Year 2026–2027 (YTD)</option>
                  <option value="Q3 2026">Q3 Financial Summary (July – September 2026)</option>
                  <option value="Full Annual Audit">Full Annual Audit Package</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Format
                </label>
                <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500">
                  <option value="PDF">Executive PDF Document with Charts</option>
                  <option value="Excel">Detailed Excel Workbook (.xlsx)</option>
                  <option value="CSV">Raw CSV Ledgers</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Include Sections
                </label>
                <div className="space-y-2 pt-1">
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <span>Revenue streams & category breakdown</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <span>Outstanding receivables & aging report</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <span>Bank reconciliation audit logs</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
                >
                  Export Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}