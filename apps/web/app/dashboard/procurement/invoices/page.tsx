'use client';

import { useState } from 'react';
import Link from 'next/link';

// TypeScript interface for a Vendor Invoice
interface InvoiceItem {
  id: string;
  poNumber: string;
  vendor: string;
  department: 'Science' | 'Administration' | 'Athletics' | 'IT' | 'Facilities';
  amount: string;
  dueDate: string;
  status: 'Paid' | 'Pending Approval' | 'Scheduled' | 'Overdue';
}

// Initial mock data for vendor invoices
const initialInvoices: InvoiceItem[] = [
  {
    id: 'INV-2026-8801',
    poNumber: 'PO-2026-0501',
    vendor: 'BioScience Equipment Corp.',
    department: 'Science',
    amount: '$4,500.00',
    dueDate: '2026-10-25',
    status: 'Pending Approval',
  },
  {
    id: 'INV-2026-8802',
    poNumber: 'PO-2026-0502',
    vendor: 'Cisco Systems / IT Distributor',
    department: 'IT',
    amount: '$2,850.00',
    dueDate: '2026-10-15',
    status: 'Scheduled',
  },
  {
    id: 'INV-2026-8803',
    poNumber: 'PO-2026-0503',
    vendor: 'Nike Team Sports',
    department: 'Athletics',
    amount: '$1,920.00',
    dueDate: '2026-10-01',
    status: 'Paid',
  },
  {
    id: 'INV-2026-8804',
    poNumber: 'PO-2026-0504',
    vendor: 'Herman Miller Commercial',
    department: 'Administration',
    amount: '$1,200.00',
    dueDate: '2026-09-28',
    status: 'Overdue',
  },
  {
    id: 'INV-2026-8805',
    poNumber: 'PO-2026-0505',
    vendor: 'Trane HVAC Solutions',
    department: 'Facilities',
    amount: '$850.00',
    dueDate: '2026-10-10',
    status: 'Scheduled',
  },
];

export default function ProcurementInvoicesPage() {
  const [invoices, setInvoices] = useState<InvoiceItem[]>(initialInvoices);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Filter logic based on search, department, and status
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.vendor.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = departmentFilter === 'All' || inv.department === departmentFilter;
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  // Helper for status badge styling
  const getStatusBadge = (status: InvoiceItem['status']) => {
    switch (status) {
      case 'Paid':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Scheduled':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Pending Approval':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Overdue':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessBanner('Vendor invoice successfully logged and submitted for accounts payable verification.');
    setCreateModalOpen(false);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Vendor Invoices & Accounts Payable
          </h1>
          <p className="text-sm text-slate-500">
            Manage vendor billing, review 3-way matching against purchase orders, and schedule disbursements.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/procurement/orders"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <i className="fa-solid fa-cart-shopping mr-2 text-xs text-blue-600"></i> Purchase Orders
          </Link>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
          >
            <i className="fa-solid fa-plus mr-2 text-xs"></i> Log Vendor Invoice
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
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Invoices Logged</p>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <i className="fa-solid fa-file-invoice-dollar text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">82</p>
          <span className="text-xs text-emerald-600 font-medium"><i className="fa-solid fa-arrow-trend-up mr-1"></i> Term billing pipeline</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Approval</p>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <i className="fa-solid fa-clock text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">6</p>
          <span className="text-xs text-amber-600 font-medium">Awaiting 3-way match</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Paid YTD</p>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <i className="fa-solid fa-circle-check text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">71</p>
          <span className="text-xs text-emerald-600 font-medium">Disbursed successfully</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total AP Liability</p>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <i className="fa-solid fa-vault text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">$28,400</p>
          <span className="text-xs text-purple-600 font-medium">Pending payment schedule</span>
        </div>
      </div>

      {/* Toolbar: Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-xs text-slate-400"></i>
          <input
            type="text"
            placeholder="Search invoice number, PO reference, or vendor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Filters Group */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Department Filter */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <span>Department:</span>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Departments</option>
              <option value="Science">Science</option>
              <option value="IT">IT</option>
              <option value="Athletics">Athletics</option>
              <option value="Administration">Administration</option>
              <option value="Facilities">Facilities</option>
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
              <option value="Scheduled">Scheduled</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Overdue">Overdue</option>
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
                <th className="py-3 px-4">Invoice ID / PO Ref</th>
                <th className="py-3 px-4">Vendor & Department</th>
                <th className="py-3 px-4">Invoice Amount</th>
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
                      <div className="font-semibold text-slate-900 font-mono text-xs">{inv.id}</div>
                      <div className="text-xs text-blue-600 font-mono font-medium">{inv.poNumber}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-900 font-medium text-xs">{inv.vendor}</div>
                      <div className="text-xs text-slate-500">{inv.department}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-900 font-mono text-xs font-bold">{inv.amount}</td>
                    <td className="py-3.5 px-4 text-slate-700 font-mono text-xs">{inv.dueDate}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(inv.status)}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-xs px-2 py-1 rounded hover:bg-blue-50 transition-colors">
                        View Bill
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 text-sm">
                    No matching vendor invoices found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Vendor Invoice Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <h3 className="font-bold text-slate-900 text-base">Log New Vendor Invoice</h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleCreateInvoice} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Invoice Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. INV-99201"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Purchase Order Ref
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PO-2026-0506"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Vendor Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fisher Scientific"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Department
                  </label>
                  <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500">
                    <option value="Science">Science</option>
                    <option value="IT">IT</option>
                    <option value="Athletics">Athletics</option>
                    <option value="Administration">Administration</option>
                    <option value="Facilities">Facilities</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Invoice Amount ($)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. $1,450.00"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Payment Due Date
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
                  Billing Notes / 3-Way Match Details
                </label>
                <textarea
                  rows={2}
                  placeholder="Attach invoice scan reference or note verification status..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                ></textarea>
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
                  Submit Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}