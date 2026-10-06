'use client';

import { useState } from 'react';
import Link from 'next/link';

// TypeScript interface for a Student Invoice
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

// Initial mock data for student invoices
const initialInvoices: InvoiceItem[] = [
  {
    id: 'INV-001',
    invoiceNumber: 'INV-2026-1001',
    studentName: 'Oliver Twist',
    studentId: 'STU-2026-014',
    title: 'High School Fall Semester Tuition',
    category: 'Tuition',
    amount: '$7,250.00',
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
    amount: '$3,400.00',
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
    amount: '$450.00',
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
    amount: '$650.00',
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
    amount: '$820.00',
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

  // Filter logic based on search, status, and category
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

  // Helper for status badge styling
  const getStatusBadge = (status: InvoiceItem['status']) => {
    switch (status) {
      case 'Paid':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Overdue':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Partially Paid':
        return 'bg-blue-50 text-blue-700 border-blue-200';
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Student Invoices & Billing Records
          </h1>
          <p className="text-sm text-slate-500">
            Track tuition statements, board and lodging fees, payment statuses, and issue new billing notices.
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
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
          >
            <i className="fa-solid fa-plus mr-2 text-xs"></i> Create Invoice
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
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Invoiced</p>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <i className="fa-solid fa-file-invoice text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">$1,482,500</p>
          <span className="text-xs text-emerald-600 font-medium"><i className="fa-solid fa-arrow-trend-up mr-1"></i> Academic year total</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Collected Revenue</p>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <i className="fa-solid fa-circle-check text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">$1,210,400</p>
          <span className="text-xs text-emerald-600 font-medium">81.6% collection rate</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Balance</p>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <i className="fa-solid fa-clock text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">$218,200</p>
          <span className="text-xs text-amber-600 font-medium">Due within 30 days</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overdue Amount</p>
            <div className="rounded-lg bg-rose-50 p-2 text-rose-600">
              <i className="fa-solid fa-triangle-exclamation text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">$53,900</p>
          <span className="text-xs text-rose-600 font-medium">Requires follow-up</span>
        </div>
      </div>

      {/* Toolbar: Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-xs text-slate-400"></i>
          <input
            type="text"
            placeholder="Search student name, ID, invoice #, or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Filters Group */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <span>Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Categories</option>
              <option value="Tuition">Tuition</option>
              <option value="Boarding">Boarding</option>
              <option value="Activities">Activities</option>
              <option value="Technology">Technology</option>
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
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
              <option value="Partially Paid">Partially Paid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoices Data Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Invoice # / Title</th>
                <th className="py-3 px-4">Student Name / ID</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{inv.title}</div>
                      <div className="text-xs text-slate-500 font-mono">{inv.invoiceNumber}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-900 font-medium text-xs">{inv.studentName}</div>
                      <div className="text-xs text-slate-500 font-mono">{inv.studentId}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium text-xs">{inv.category}</td>
                    <td className="py-3.5 px-4 text-slate-900 font-mono text-xs font-bold">{inv.amount}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-xs">{inv.dueDate}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(inv.status)}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-xs px-2 py-1 rounded hover:bg-blue-50 transition-colors">
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-sm">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <h3 className="font-bold text-slate-900 text-base">Issue New Student Invoice</h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleCreateInvoice} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Student Name / ID
                </label>
                <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500">
                  <option value="Oliver Twist">Oliver Twist (STU-2026-014)</option>
                  <option value="Charlotte Brontë">Charlotte Brontë (STU-2026-022)</option>
                  <option value="Arthur Conan Doyle">Arthur Conan Doyle (STU-2026-045)</option>
                  <option value="Jane Austen">Jane Austen (STU-2026-089)</option>
                  <option value="H.G. Wells">H.G. Wells (STU-2026-102)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Invoice Title / Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Spring Semester Tuition Tier 1"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500">
                    <option value="Tuition">Tuition</option>
                    <option value="Boarding">Boarding</option>
                    <option value="Activities">Activities</option>
                    <option value="Technology">Technology</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Amount ($)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. $4,500.00"
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
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

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
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