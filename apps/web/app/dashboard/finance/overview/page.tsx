// apps/web/app/dashboard/finance/overview/page.tsx
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
    <div className="flex-1 w-full min-w-0 bg-[#f4f7fb] min-h-screen p-4 sm:p-6 lg:p-8 font-sans overflow-x-hidden text-[#042954]">
      
      {/* Page Header */}
      <div className="mb-6 lg:mb-8 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-extrabold text-[#042954] mb-1 tracking-tight">
            Financial Overview & Executive Dashboard
          </h1>
          <p className="text-[12px] text-[#64748b]">
            Monitor institutional revenue streams, collection rates, operating budgets, and rapid access to financial modules.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setReportModalOpen(true)}
            className="h-[38px] px-4 rounded-xl border border-[#cbd5e1] bg-white text-[12px] font-semibold text-[#042954] hover:bg-slate-50 transition-colors shadow-sm flex items-center"
          >
            <i className="fa-solid fa-download mr-2 text-xs text-[#0ea5e9]"></i> Export Audit Report
          </button>
          <Link
            href="/dashboard/finance/invoices"
            className="h-[38px] px-4 rounded-xl bg-gradient-to-r from-[#042954] to-[#0ea5e9] text-white text-[12px] font-semibold hover:opacity-95 transition-all shadow-md shadow-sky-500/20 flex items-center justify-center"
          >
            <i className="fa-solid fa-file-invoice mr-2 text-xs"></i> View Invoices
          </Link>
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
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Total Projected Revenue</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">KSh 23,500,000</h3>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center mt-1">
              <i className="fa-solid fa-arrow-trend-up mr-1"></i> +8.4% vs last academic year
            </span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-sky-50 text-[#0ea5e9] flex items-center justify-center shrink-0">
            <i className="fa-solid fa-vault text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Collected YTD</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">KSh 18,450,000</h3>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">80.1% overall collection rate</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-teal-50 text-[#06b6d4] flex items-center justify-center shrink-0">
            <i className="fa-solid fa-circle-check text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Outstanding Receivables</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">KSh 3,950,000</h3>
            <span className="text-[11px] text-amber-600 font-semibold mt-1 block">Pending & overdue balances</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-clock text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Operating Expenses</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">KSh 11,800,000</h3>
            <span className="text-[11px] text-purple-600 font-semibold mt-1 block">Within annual budget limits</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-receipt text-lg"></i>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 w-full">
        <Link
          href="/dashboard/finance/invoices"
          className="group rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-sm hover:border-[#0ea5e9] hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="h-[44px] w-[44px] rounded-xl bg-sky-50 text-[#0ea5e9] group-hover:bg-[#042954] group-hover:text-white transition-colors flex items-center justify-center">
                <i className="fa-solid fa-file-invoice text-base"></i>
              </div>
              <i className="fa-solid fa-arrow-right text-xs text-[#cbd5e1] group-hover:text-[#0ea5e9] transition-colors"></i>
            </div>
            <h3 className="font-bold text-[#042954] text-[14px] mb-1">Invoices & Billing</h3>
            <p className="text-[12px] text-[#64748b]">Issue tuition bills, track fees, and manage student invoicing.</p>
          </div>
        </Link>

        <Link
          href="/dashboard/finance/payments"
          className="group rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-sm hover:border-[#0ea5e9] hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="h-[44px] w-[44px] rounded-xl bg-teal-50 text-[#06b6d4] group-hover:bg-[#042954] group-hover:text-white transition-colors flex items-center justify-center">
                <i className="fa-solid fa-cash-register text-base"></i>
              </div>
              <i className="fa-solid fa-arrow-right text-xs text-[#cbd5e1] group-hover:text-[#06b6d4] transition-colors"></i>
            </div>
            <h3 className="font-bold text-[#042954] text-[14px] mb-1">Payment History</h3>
            <p className="text-[12px] text-[#64748b]">Review transaction logs, M-Pesa payments, and manual receipts.</p>
          </div>
        </Link>

        <Link
          href="/dashboard/finance/statements"
          className="group rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-sm hover:border-[#0ea5e9] hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="h-[44px] w-[44px] rounded-xl bg-purple-50 text-purple-600 group-hover:bg-[#042954] group-hover:text-white transition-colors flex items-center justify-center">
                <i className="fa-solid fa-address-book text-base"></i>
              </div>
              <i className="fa-solid fa-arrow-right text-xs text-[#cbd5e1] group-hover:text-purple-600 transition-colors"></i>
            </div>
            <h3 className="font-bold text-[#042954] text-[14px] mb-1">Account Statements</h3>
            <p className="text-[12px] text-[#64748b]">Audit student ledger balances and dispatch formal statements.</p>
          </div>
        </Link>

        <Link
          href="/dashboard/finance/reconciliation"
          className="group rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-sm hover:border-[#0ea5e9] hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="h-[44px] w-[44px] rounded-xl bg-amber-50 text-amber-600 group-hover:bg-[#042954] group-hover:text-white transition-colors flex items-center justify-center">
                <i className="fa-solid fa-scale-balanced text-base"></i>
              </div>
              <i className="fa-solid fa-arrow-right text-xs text-[#cbd5e1] group-hover:text-amber-600 transition-colors"></i>
            </div>
            <h3 className="font-bold text-[#042954] text-[14px] mb-1">Bank Reconciliation</h3>
            <p className="text-[12px] text-[#64748b]">Import bank statement feeds and match ledger transactions.</p>
          </div>
        </Link>
      </div>

      {/* Two-Column Section: Revenue Breakdown & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        {/* Revenue Breakdown by Category */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[#042954] text-[15px]">Revenue by Category</h3>
            <span className="text-[11px] text-[#64748b] font-semibold">Academic Year 2026</span>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-[12px] font-semibold text-[#042954] mb-1.5">
                <span>Tuition & Core Academic</span>
                <span className="font-mono">KSh 15,500,000 (67%)</span>
              </div>
              <div className="w-full bg-[#f1f5f9] rounded-full h-2.5 overflow-hidden">
                <div className="bg-[#042954] h-2.5 rounded-full" style={{ width: '67%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[12px] font-semibold text-[#042954] mb-1.5">
                <span>Boarding & Residence</span>
                <span className="font-mono">KSh 4,800,000 (21%)</span>
              </div>
              <div className="w-full bg-[#f1f5f9] rounded-full h-2.5 overflow-hidden">
                <div className="bg-[#06b6d4] h-2.5 rounded-full" style={{ width: '21%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[12px] font-semibold text-[#042954] mb-1.5">
                <span>Extracurricular Activities</span>
                <span className="font-mono">KSh 1,800,000 (8%)</span>
              </div>
              <div className="w-full bg-[#f1f5f9] rounded-full h-2.5 overflow-hidden">
                <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '8%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[12px] font-semibold text-[#042954] mb-1.5">
                <span>Technology & Lab Fees</span>
                <span className="font-mono">KSh 950,000 (4%)</span>
              </div>
              <div className="w-full bg-[#f1f5f9] rounded-full h-2.5 overflow-hidden">
                <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '4%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Financial Activity Feed */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[#042954] text-[15px]">Recent Financial Activity</h3>
            <Link href="/dashboard/finance/payments" className="text-[12px] font-semibold text-[#0ea5e9] hover:underline">
              View All Transactions →
            </Link>
          </div>

          <div className="divide-y divide-[#f1f5f9]">
            <div className="py-3.5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-arrow-down text-sm"></i>
                </div>
                <div>
                  <div className="text-[13px] font-bold text-[#042954]">Payment Received - Oliver Twist</div>
                  <div className="text-[11px] text-[#64748b] mt-0.5">M-PESA • Invoice #INV-2026-1001</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[12px] font-bold font-mono text-emerald-700">+KSh 45,000.00</div>
                <div className="text-[10px] text-[#94a3b8] mt-0.5">Today, 14:22</div>
              </div>
            </div>

            <div className="py-3.5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-arrow-down text-sm"></i>
                </div>
                <div>
                  <div className="text-[13px] font-bold text-[#042954]">Payment Received - Charlotte Brontë</div>
                  <div className="text-[11px] text-[#64748b] mt-0.5">Bank Transfer • Invoice #INV-2026-1002</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[12px] font-bold font-mono text-emerald-700">+KSh 45,000.00</div>
                <div className="text-[10px] text-[#94a3b8] mt-0.5">Sep 29, 11:05</div>
              </div>
            </div>

            <div className="py-3.5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-xl bg-sky-50 text-[#0ea5e9] flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-file-circle-plus text-sm"></i>
                </div>
                <div>
                  <div className="text-[13px] font-bold text-[#042954]">Invoice Issued - H.G. Wells</div>
                  <div className="text-[11px] text-[#64748b] mt-0.5">Tuition & Lab Fee • Invoice #INV-2026-1005</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[12px] font-bold font-mono text-[#042954]">KSh 10,500.00</div>
                <div className="text-[10px] text-[#94a3b8] mt-0.5">Sep 26, 09:00</div>
              </div>
            </div>

            <div className="py-3.5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-arrow-down text-sm"></i>
                </div>
                <div>
                  <div className="text-[13px] font-bold text-[#042954]">Payment Received - Arthur Conan Doyle</div>
                  <div className="text-[11px] text-[#64748b] mt-0.5">Credit Card • Invoice #INV-2026-1003</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[12px] font-bold font-mono text-emerald-700">+KSh 6,500.00</div>
                <div className="text-[10px] text-[#94a3b8] mt-0.5">Sep 28, 09:40</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Audit Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#042954]/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-[#e2e8f0] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] bg-[#f8fafc] px-6 py-4">
              <h3 className="font-bold text-[#042954] text-[15px]">Export Executive Financial Audit Report</h3>
              <button
                onClick={() => setReportModalOpen(false)}
                className="text-slate-400 hover:text-[#042954] transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleGenerateReport} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                  Report Scope & Period
                </label>
                <select className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9]">
                  <option value="Current Academic Year">Academic Year 2026–2027 (YTD)</option>
                  <option value="Q3 2026">Q3 Financial Summary (July – September 2026)</option>
                  <option value="Full Annual Audit">Full Annual Audit Package</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                  Format
                </label>
                <select className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9]">
                  <option value="PDF">Executive PDF Document with Charts</option>
                  <option value="Excel">Detailed Excel Workbook (.xlsx)</option>
                  <option value="CSV">Raw CSV Ledgers</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                  Include Sections
                </label>
                <div className="space-y-2 pt-1">
                  <label className="flex items-center gap-2.5 text-[13px] font-medium text-[#042954] cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#0ea5e9] focus:ring-[#0ea5e9] w-4 h-4" />
                    <span>Revenue streams & category breakdown</span>
                  </label>
                  <label className="flex items-center gap-2.5 text-[13px] font-medium text-[#042954] cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#0ea5e9] focus:ring-[#0ea5e9] w-4 h-4" />
                    <span>Outstanding receivables & aging report</span>
                  </label>
                  <label className="flex items-center gap-2.5 text-[13px] font-medium text-[#042954] cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#0ea5e9] focus:ring-[#0ea5e9] w-4 h-4" />
                    <span>Bank reconciliation audit logs</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f1f5f9]">
                <button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="h-[38px] px-4 rounded-xl border border-[#cbd5e1] bg-white text-[12px] font-semibold text-[#042954] hover:bg-slate-50 transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-[38px] px-5 rounded-xl bg-gradient-to-r from-[#042954] to-[#0ea5e9] text-white text-[12px] font-semibold hover:opacity-95 transition-all shadow-md shadow-sky-500/20"
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