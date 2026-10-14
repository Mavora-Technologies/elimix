// apps/web/app/dashboard/finance/invoices/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  studentName: string;
  studentId: string;
  title: string;
  category: 'Tuition' | 'Boarding' | 'Activities' | 'Technology';
  amount: string;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue' | 'Partially Paid';
}

const initialInvoices: InvoiceItem[] = [
  {
    id: 'INV-001',
    invoiceNumber: 'INV-2026-1001',
    studentName: 'Oliver Twist',
    studentId: 'STU-2026-014',
    title: 'High School Fall Semester Tuition',
    category: 'Tuition',
    amount: 'KSh 92,500.00',
    dueDate: '2026-10-15',
    status: 'Pending',
  },
  {
    id: 'INV-002',
    invoiceNumber: 'INV-2026-1002',
    studentName: 'Charlotte Brontë',
    studentId: 'STU-2026-022',
    title: 'Boarding & Residence Fee Tier 1',
    category: 'Boarding',
    amount: 'KSh 45,000.00',
    dueDate: '2026-09-30',
    status: 'Overdue',
  },
  {
    id: 'INV-003',
    invoiceNumber: 'INV-2026-1003',
    studentName: 'Arthur Conan Doyle',
    studentId: 'STU-2026-045',
    title: 'Annual Tech & Device License',
    category: 'Technology',
    amount: 'KSh 6,500.00',
    dueDate: '2026-10-25',
    status: 'Paid',
  },
  {
    id: 'INV-004',
    invoiceNumber: 'INV-2026-1004',
    studentName: 'Jane Austen',
    studentId: 'STU-2026-089',
    title: 'Extracurricular Arts & Athletic Fee',
    category: 'Activities',
    amount: 'KSh 8,500.00',
    dueDate: '2026-10-10',
    status: 'Partially Paid',
  },
  {
    id: 'INV-005',
    invoiceNumber: 'INV-2026-1005',
    studentName: 'H.G. Wells',
    studentId: 'STU-2026-102',
    title: 'AP Course Material & Lab Fee',
    category: 'Tuition',
    amount: 'KSh 10,500.00',
    dueDate: '2026-11-01',
    status: 'Pending',
  },
];

export default function FinanceInvoicesPage() {
  const [invoices, setInvoices] = useState<InvoiceItem[]>(initialInvoices);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Filter logic
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.title.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || inv.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Status badge styling
  const getStatusBadge = (status: InvoiceItem['status']) => {
    switch (status) {
      case 'Paid':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Overdue':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'Partially Paid':
        return 'bg-sky-50 text-[#0ea5e9] border-sky-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessBanner('New student invoice successfully generated and issued.');
    setCreateModalOpen(false);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  return (
    <div className="flex-1 w-full min-w-0 bg-[#f4f7fb] min-h-screen p-4 sm:p-6 lg:p-8 font-sans overflow-x-hidden text-[#042954]">
      
      {/* Page Header */}
      <div className="mb-6 lg:mb-8 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-extrabold text-[#042954] mb-1 tracking-tight">
            Student Invoices & Billing Records
          </h1>
          <p className="text-[12px] text-[#64748b]">
            Track tuition statements, board and lodging fees, payment statuses, and issue new billing notices.
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
            onClick={() => setCreateModalOpen(true)}
            className="h-[38px] px-4 rounded-xl bg-gradient-to-r from-[#042954] to-[#0ea5e9] text-white text-[12px] font-semibold hover:opacity-95 transition-all shadow-md shadow-sky-500/20 flex items-center justify-center"
          >
            <i className="fa-solid fa-plus mr-2 text-xs"></i> Create Invoice
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
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Total Invoiced</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">KSh 18,450,000</h3>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center mt-1">
              <i className="fa-solid fa-arrow-trend-up mr-1"></i> Academic year total
            </span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-sky-50 text-[#0ea5e9] flex items-center justify-center shrink-0">
            <i className="fa-solid fa-file-invoice text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Collected Revenue</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">KSh 15,100,000</h3>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">81.8% collection rate</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-teal-50 text-[#06b6d4] flex items-center justify-center shrink-0">
            <i className="fa-solid fa-circle-check text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Pending Balance</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">KSh 2,750,000</h3>
            <span className="text-[11px] text-amber-600 font-semibold mt-1 block">Due within 30 days</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-clock text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Overdue Amount</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">KSh 600,000</h3>
            <span className="text-[11px] text-rose-600 font-semibold mt-1 block">Requires follow-up</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-triangle-exclamation text-lg"></i>
          </div>
        </div>
      </div>

      {/* Toolbar: Search and Filters */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#e2e8f0] mb-6 w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-[360px]">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[12px]"></i>
          <input
            type="text"
            placeholder="Search student name, ID, invoice #, or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[40px] pl-9 pr-3 rounded-xl border border-[#cbd5e1] text-[12px] font-medium text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9] focus:ring-2 focus:ring-sky-500/20"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-[12px] font-medium text-[#64748b]">
            <span>Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-[38px] px-3 rounded-xl border border-[#cbd5e1] text-[12px] font-semibold text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9] cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Tuition">Tuition</option>
              <option value="Boarding">Boarding</option>
              <option value="Activities">Activities</option>
              <option value="Technology">Technology</option>
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
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
              <option value="Partially Paid">Partially Paid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoices Data Table */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                <th className="py-3.5 px-5">Invoice # / Title</th>
                <th className="py-3.5 px-5">Student Name / ID</th>
                <th className="py-3.5 px-5">Category</th>
                <th className="py-3.5 px-5">Amount</th>
                <th className="py-3.5 px-5">Due Date</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/75 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-bold text-[#042954]">{inv.title}</div>
                      <div className="text-[11px] text-[#64748b] font-mono mt-0.5">{inv.invoiceNumber}</div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="text-[#042954] font-semibold text-[12px]">{inv.studentName}</div>
                      <div className="text-[11px] text-[#64748b] font-mono mt-0.5">{inv.studentId}</div>
                    </td>
                    <td className="py-4 px-5">
                      <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-[11px] font-bold text-slate-700">
                        {inv.category}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-[#042954] font-mono text-[12px] font-bold">{inv.amount}</td>
                    <td className="py-4 px-5 text-[#64748b] font-mono text-[12px]">{inv.dueDate}</td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(inv.status)}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button className="h-[32px] px-3 rounded-lg bg-sky-50 text-[#0ea5e9] hover:bg-sky-100 font-semibold text-[12px] transition-colors">
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#64748b] text-[13px]">
                    No matching invoices found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Invoice Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#042954]/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-[#e2e8f0] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] bg-[#f8fafc] px-6 py-4">
              <h3 className="font-bold text-[#042954] text-[15px]">Issue New Student Invoice</h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-[#042954] transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleCreateInvoice} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                  Student Name / ID
                </label>
                <select className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9]">
                  <option value="Oliver Twist">Oliver Twist (STU-2026-014)</option>
                  <option value="Charlotte Brontë">Charlotte Brontë (STU-2026-022)</option>
                  <option value="Arthur Conan Doyle">Arthur Conan Doyle (STU-2026-045)</option>
                  <option value="Jane Austen">Jane Austen (STU-2026-089)</option>
                  <option value="H.G. Wells">H.G. Wells (STU-2026-102)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                  Invoice Title / Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Spring Semester Tuition Tier 1"
                  className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9]">
                    <option value="Tuition">Tuition</option>
                    <option value="Boarding">Boarding</option>
                    <option value="Activities">Activities</option>
                    <option value="Technology">Technology</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                    Amount (KES)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. KSh 45,000.00"
                    required
                    className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                  Due Date
                </label>
                <input
                  type="date"
                  required
                  className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f1f5f9]">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="h-[38px] px-4 rounded-xl border border-[#cbd5e1] bg-white text-[12px] font-semibold text-[#042954] hover:bg-slate-50 transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-[38px] px-5 rounded-xl bg-gradient-to-r from-[#042954] to-[#0ea5e9] text-white text-[12px] font-semibold hover:opacity-95 transition-all shadow-md shadow-sky-500/20"
                >
                  Issue Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}