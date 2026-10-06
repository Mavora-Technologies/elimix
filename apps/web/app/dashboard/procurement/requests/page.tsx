'use client';

import { useState } from 'react';
import Link from 'next/link';

// TypeScript interface for a Purchase Request
interface RequestItem {
  id: string;
  itemTitle: string;
  department: 'Science' | 'Administration' | 'Athletics' | 'IT' | 'Facilities';
  requester: string;
  estimatedCost: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Fulfilled';
}

// Initial mock data for purchase requests
const initialRequests: RequestItem[] = [
  {
    id: 'REQ-2026-0101',
    itemTitle: 'Advanced Binocular Microscopes (Qty: 10)',
    department: 'Science',
    requester: 'Dr. Marie Curie',
    estimatedCost: '$4,500.00',
    date: '2026-10-01 10:15',
    status: 'Pending',
  },
  {
    id: 'REQ-2026-0102',
    itemTitle: 'Enterprise Wi-Fi 7 Access Points (Qty: 6)',
    department: 'IT',
    requester: 'Dr. Alan Turing',
    estimatedCost: '$2,850.00',
    date: '2026-09-30 14:40',
    status: 'Approved',
  },
  {
    id: 'REQ-2026-0103',
    itemTitle: 'Varsity Basketball Uniforms & Gear',
    department: 'Athletics',
    requester: 'Coach Jim Miller',
    estimatedCost: '$1,920.00',
    date: '2026-09-29 09:20',
    status: 'Fulfilled',
  },
  {
    id: 'REQ-2026-0104',
    itemTitle: 'Ergonomic Office Chairs for Admin (Qty: 4)',
    department: 'Administration',
    requester: 'Sarah Jenkins',
    estimatedCost: '$1,200.00',
    date: '2026-09-28 16:05',
    status: 'Pending',
  },
  {
    id: 'REQ-2026-0105',
    itemTitle: 'HVAC Air Filter Replacements (Set of 20)',
    department: 'Facilities',
    requester: 'Tom Bradley',
    estimatedCost: '$850.00',
    date: '2026-09-27 11:30',
    status: 'Rejected',
  },
];

export default function ProcurementRequestsPage() {
  const [requests, setRequests] = useState<RequestItem[]>(initialRequests);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Filter logic based on search, department, and status
  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.itemTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.requester.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = departmentFilter === 'All' || req.department === departmentFilter;
    const matchesStatus = statusFilter === 'All' || req.status === statusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  // Helper for status badge styling
  const getStatusBadge = (status: RequestItem['status']) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Fulfilled':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessBanner('Purchase requisition successfully submitted to department heads for approval.');
    setCreateModalOpen(false);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Purchase Requests & Requisitions
          </h1>
          <p className="text-sm text-slate-500">
            Manage departmental purchasing workflows, track approval pipelines, and audit institutional supply orders.
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
            <i className="fa-solid fa-plus mr-2 text-xs"></i> New Requisition
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
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Requests YTD</p>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <i className="fa-solid fa-box-archive text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">142</p>
          <span className="text-xs text-emerald-600 font-medium"><i className="fa-solid fa-arrow-trend-up mr-1"></i> Active workflow</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Approval</p>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <i className="fa-solid fa-clock text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">12</p>
          <span className="text-xs text-amber-600 font-medium">Awaiting department review</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Approved & Ordered</p>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <i className="fa-solid fa-circle-check text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">114</p>
          <span className="text-xs text-emerald-600 font-medium">Processing fulfillment</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Requisition Spend</p>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <i className="fa-solid fa-receipt text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">$184,200</p>
          <span className="text-xs text-purple-600 font-medium">Within annual budget</span>
        </div>
      </div>

      {/* Toolbar: Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-xs text-slate-400"></i>
          <input
            type="text"
            placeholder="Search request ID, item title, or requester..."
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
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Fulfilled">Fulfilled</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests Data Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Request ID / Date</th>
                <th className="py-3 px-4">Item Description</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Requester</th>
                <th className="py-3 px-4">Estimated Cost</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 font-mono text-xs">{req.id}</div>
                      <div className="text-xs text-slate-500">{req.date}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-900 font-medium text-xs">{req.itemTitle}</td>
                    <td className="py-3.5 px-4 text-slate-700 text-xs">{req.department}</td>
                    <td className="py-3.5 px-4 text-slate-800 text-xs font-medium">{req.requester}</td>
                    <td className="py-3.5 px-4 text-slate-900 font-mono text-xs font-bold">{req.estimatedCost}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(req.status)}`}>
                        {req.status}
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
                    No matching purchase requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Requisition Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <h3 className="font-bold text-slate-900 text-base">Submit New Purchase Requisition</h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleCreateRequest} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Item Description / Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Laboratory Spectrophotometer"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Estimated Cost ($)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. $1,250.00"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Requester Name
                </label>
                <input
                  type="text"
                  required
                  defaultValue="Dr. Marie Curie"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Business Justification
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide brief explanation for institutional necessity..."
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
                  Submit Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}