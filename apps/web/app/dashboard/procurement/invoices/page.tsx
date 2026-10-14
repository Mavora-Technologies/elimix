// apps/web/app/dashboard/procurement/invoices/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

interface InvoiceItem {
  id: string;
  poNumber: string;
  vendor: string;
  department: 'Science' | 'Administration' | 'Athletics' | 'IT' | 'Facilities';
  amount: string;
  dueDate: string;
  status: 'Paid' | 'Pending Approval' | 'Scheduled' | 'Overdue';
}

const initialInvoices: InvoiceItem[] = [
  {
    id: 'INV-2026-8801',
    poNumber: 'PO-2026-0501',
    vendor: 'BioScience Equipment Corp.',
    department: 'Science',
    amount: 'KSh 585,000.00',
    dueDate: '2026-10-25',
    status: 'Pending Approval',
  },
  {
    id: 'INV-2026-8802',
    poNumber: 'PO-2026-0502',
    vendor: 'Cisco Systems / IT Distributor',
    department: 'IT',
    amount: 'KSh 370,500.00',
    dueDate: '2026-10-15',
    status: 'Scheduled',
  },
  {
    id: 'INV-2026-8803',
    poNumber: 'PO-2026-0503',
    vendor: 'Nike Team Sports',
    department: 'Athletics',
    amount: 'KSh 249,600.00',
    dueDate: '2026-10-01',
    status: 'Paid',
  },
  {
    id: 'INV-2026-8804',
    poNumber: 'PO-2026-0504',
    vendor: 'Herman Miller Commercial',
    department: 'Administration',
    amount: 'KSh 156,000.00',
    dueDate: '2026-09-28',
    status: 'Overdue',
  },
  {
    id: 'INV-2026-8805',
    poNumber: 'PO-2026-0505',
    vendor: 'Trane HVAC Solutions',
    department: 'Facilities',
    amount: 'KSh 110,500.00',
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

  // Filter logic
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.vendor.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = departmentFilter === 'All' || inv.department === departmentFilter;
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  // Status badge styling
  const getStatusBadge = (status: InvoiceItem['status']) => {
    switch (status) {
      case 'Paid':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Scheduled':
        return 'bg-sky-50 text-[#0ea5e9] border-sky-200';
      case 'Pending Approval':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Overdue':
        return 'bg-rose-50 text-rose-800 border-rose-200';
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
    <div className="flex-1 w-full min-w-0 bg-[#f4f7fb] min-h-screen p-4 sm:p-6 lg:p-8 font-sans overflow-x-hidden text-[#042954]">
      
      {/* Page Header */}
      <div className="mb-6 lg:mb-8 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-extrabold text-[#042954] mb-1 tracking-tight">
            Vendor Invoices & Accounts Payable
          </h1>
          <p className="text-[12px] text-[#64748b]">
            Manage vendor billing, review 3-way matching against purchase orders, and schedule disbursements.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard/procurement/orders"
            className="h-[38px] px-4 rounded-xl border border-[#cbd5e1] bg-white text-[12px] font-semibold text-[#042954] hover:bg-slate-50 transition-colors shadow-sm flex items-center"
          >
            <i className="fa-solid fa-cart-shopping mr-2 text-xs text-[#0ea5e9]"></i> Purchase Orders
          </Link>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="h-[38px] px-4 rounded-xl bg-gradient-to-r from-[#042954] to-[#0ea5e9] text-white text-[12px] font-semibold hover:opacity-95 transition-all shadow-md shadow-sky-500/20 flex items-center justify-center"
          >
            <i className="fa-solid fa-plus mr-2 text-xs"></i> Log Vendor Invoice
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
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Total Invoices Logged</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">82</h3>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center mt-1">
              <i className="fa-solid fa-arrow-trend-up mr-1"></i> Term billing pipeline
            </span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-sky-50 text-[#0ea5e9] flex items-center justify-center shrink-0">
            <i className="fa-solid fa-file-invoice-dollar text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Pending Approval</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">6</h3>
            <span className="text-[11px] text-amber-600 font-semibold mt-1 block">Awaiting 3-way match</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-clock text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Paid YTD</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">71</h3>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Disbursed successfully</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-teal-50 text-[#06b6d4] flex items-center justify-center shrink-0">
            <i className="fa-solid fa-circle-check text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Total AP Liability</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">KSh 3,692,000</h3>
            <span className="text-[11px] text-purple-600 font-semibold mt-1 block">Pending payment schedule</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-vault text-lg"></i>
          </div>
        </div>
      </div>

      {/* Toolbar: Search and Filters */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#e2e8f0] mb-6 w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-[360px]">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[12px]"></i>
          <input
            type="text"
            placeholder="Search invoice number, PO reference, or vendor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[40px] pl-9 pr-3 rounded-xl border border-[#cbd5e1] text-[12px] font-medium text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9] focus:ring-2 focus:ring-sky-500/20"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-[12px] font-medium text-[#64748b]">
            <span>Department:</span>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="h-[38px] px-3 rounded-xl border border-[#cbd5e1] text-[12px] font-semibold text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9] cursor-pointer"
            >
              <option value="All">All Departments</option>
              <option value="Science">Science</option>
              <option value="IT">IT</option>
              <option value="Athletics">Athletics</option>
              <option value="Administration">Administration</option>
              <option value="Facilities">Facilities</option>
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
              <option value="Scheduled">Scheduled</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Overdue">Overdue</option>
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
                <th className="py-3.5 px-5">Invoice ID / PO Ref</th>
                <th className="py-3.5 px-5">Vendor & Department</th>
                <th className="py-3.5 px-5">Invoice Amount</th>
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
                      <div className="font-bold text-[#042954] font-mono text-[12px]">{inv.id}</div>
                      <div className="text-[11px] text-[#0ea5e9] font-mono font-semibold mt-0.5">{inv.poNumber}</div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="font-bold text-[#042954] text-[12px]">{inv.vendor}</div>
                      <div className="text-[11px] text-[#64748b] mt-0.5">{inv.department}</div>
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
                        View Bill
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#64748b] text-[13px]">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#042954]/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-[#e2e8f0] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] bg-[#f8fafc] px-6 py-4">
              <h3 className="font-bold text-[#042954] text-[15px]">Log New Vendor Invoice</h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-[#042954] transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleCreateInvoice} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                    Invoice Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. INV-99201"
                    className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                    Purchase Order Ref
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PO-2026-0506"
                    className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                    Vendor Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fisher Scientific"
                    className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                    Department
                  </label>
                  <select className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9]">
                    <option value="Science">Science</option>
                    <option value="IT">IT</option>
                    <option value="Athletics">Athletics</option>
                    <option value="Administration">Administration</option>
                    <option value="Facilities">Facilities</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                    Invoice Amount (KES)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. KSh 185,000.00"
                    className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                    Payment Due Date
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                  Billing Notes / 3-Way Match Details
                </label>
                <textarea
                  rows={2}
                  placeholder="Attach invoice scan reference or note verification status..."
                  className="w-full rounded-xl border border-[#cbd5e1] p-3 text-[13px] text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9]"
                ></textarea>
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