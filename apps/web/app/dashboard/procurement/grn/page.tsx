'use client';

import { useState } from 'react';
import Link from 'next/link';

// TypeScript interface for a Goods Received Note (GRN)
interface GrnItem {
  id: string;
  poNumber: string;
  vendor: string;
  department: 'Science' | 'Administration' | 'Athletics' | 'IT' | 'Facilities';
  receivedDate: string;
  receiver: string;
  itemsSummary: string;
  status: 'Accepted' | 'Pending Inspection' | 'Discrepancy';
}

// Initial mock data for Goods Received Notes
const initialGrns: GrnItem[] = [
  {
    id: 'GRN-2026-0901',
    poNumber: 'PO-2026-0503',
    vendor: 'Nike Team Sports',
    department: 'Athletics',
    receivedDate: '2026-10-02 11:30',
    receiver: 'Tom Bradley',
    itemsSummary: 'Varsity Basketball Uniforms & Gear (Complete)',
    status: 'Accepted',
  },
  {
    id: 'GRN-2026-0902',
    poNumber: 'PO-2026-0502',
    vendor: 'Cisco Systems / IT Distributor',
    department: 'IT',
    receivedDate: '2026-10-01 14:15',
    receiver: 'Sarah Jenkins',
    itemsSummary: 'Enterprise Wi-Fi 7 Access Points (Qty: 6)',
    status: 'Accepted',
  },
  {
    id: 'GRN-2026-0903',
    poNumber: 'PO-2026-0501',
    vendor: 'BioScience Equipment Corp.',
    department: 'Science',
    receivedDate: '2026-09-30 09:45',
    receiver: 'Dr. Marie Curie',
    itemsSummary: 'Advanced Binocular Microscopes (Qty: 10)',
    status: 'Pending Inspection',
  },
  {
    id: 'GRN-2026-0904',
    poNumber: 'PO-2026-0504',
    vendor: 'Herman Miller Commercial',
    department: 'Administration',
    receivedDate: '2026-09-29 15:20',
    receiver: 'Mark Henderson',
    itemsSummary: 'Ergonomic Office Chairs (1 damaged box)',
    status: 'Discrepancy',
  },
];

export default function ProcurementGrnPage() {
  const [grns, setGrns] = useState<GrnItem[]>(initialGrns);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Filter logic based on search, department, and status
  const filteredGrns = grns.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.itemsSummary.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = departmentFilter === 'All' || item.department === departmentFilter;
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  // Helper for status badge styling
  const getStatusBadge = (status: GrnItem['status']) => {
    switch (status) {
      case 'Accepted':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending Inspection':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Discrepancy':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const handleCreateGrn = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessBanner('New Goods Received Note successfully recorded and logged into warehouse inventory.');
    setCreateModalOpen(false);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Goods Received Notes (GRN) & Inspection
          </h1>
          <p className="text-sm text-slate-500">
            Verify inbound vendor shipments, conduct quality inspections, and record official warehouse receipts.
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
            <i className="fa-solid fa-plus mr-2 text-xs"></i> Record New GRN
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
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total GRNs Logged</p>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <i className="fa-solid fa-clipboard-check text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">94</p>
          <span className="text-xs text-emerald-600 font-medium"><i className="fa-solid fa-arrow-trend-up mr-1"></i> Term shipments</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Inspection</p>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <i className="fa-solid fa-magnifying-glass text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">5</p>
          <span className="text-xs text-amber-600 font-medium">Awaiting QA sign-off</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Verified & Accepted</p>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <i className="fa-solid fa-circle-check text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">86</p>
          <span className="text-xs text-emerald-600 font-medium">Stocked in warehouse</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Discrepancies Flagged</p>
            <div className="rounded-lg bg-rose-50 p-2 text-rose-600">
              <i className="fa-solid fa-triangle-exclamation text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">3</p>
          <span className="text-xs text-rose-600 font-medium">Vendor dispute open</span>
        </div>
      </div>

      {/* Toolbar: Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-xs text-slate-400"></i>
          <input
            type="text"
            placeholder="Search GRN ID, PO reference, vendor, or items..."
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
              <option value="Accepted">Accepted</option>
              <option value="Pending Inspection">Pending Inspection</option>
              <option value="Discrepancy">Discrepancy</option>
            </select>
          </div>
        </div>
      </div>

      {/* GRN Data Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">GRN Number / PO Ref</th>
                <th className="py-3 px-4">Vendor & Department</th>
                <th className="py-3 px-4">Received Date / Receiver</th>
                <th className="py-3 px-4">Items Summary</th>
                <th className="py-3 px-4">Inspection Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredGrns.length > 0 ? (
                filteredGrns.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 font-mono text-xs">{item.id}</div>
                      <div className="text-xs text-blue-600 font-mono font-medium">{item.poNumber}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-900 font-medium text-xs">{item.vendor}</div>
                      <div className="text-xs text-slate-500">{item.department}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 font-mono text-xs">{item.receivedDate}</div>
                      <div className="text-xs text-slate-500">Receiver: {item.receiver}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-900 text-xs font-medium">{item.itemsSummary}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-xs px-2 py-1 rounded hover:bg-blue-50 transition-colors">
                        View Note
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 text-sm">
                    No matching Goods Received Notes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record New GRN Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <h3 className="font-bold text-slate-900 text-base">Record New Goods Received Note (GRN)</h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleCreateGrn} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Purchase Order Ref
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PO-2026-0506"
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
                  Received Items Summary
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Laboratory Glassware Set (Qty: 15)"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Receiver / Inspector
                  </label>
                  <input
                    type="text"
                    required
                    defaultValue="Tom Bradley"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Inspection Status
                  </label>
                  <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500">
                    <option value="Accepted">Accepted</option>
                    <option value="Pending Inspection">Pending Inspection</option>
                    <option value="Discrepancy">Discrepancy / Damaged</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Receiving Notes / Comments
                </label>
                <textarea
                  rows={2}
                  placeholder="Note package condition, serial numbers, or missing components..."
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
                  Save & Log GRN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}