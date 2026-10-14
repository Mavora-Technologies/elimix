// apps/web/app/dashboard/procurement/requests/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

interface RequestItem {
  id: string;
  itemTitle: string;
  department: 'Science' | 'Administration' | 'Athletics' | 'IT' | 'Facilities';
  requester: string;
  estimatedCost: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Fulfilled';
}

const initialRequests: RequestItem[] = [
  {
    id: 'REQ-2026-0101',
    itemTitle: 'Advanced Binocular Microscopes (Qty: 10)',
    department: 'Science',
    requester: 'Dr. Marie Curie',
    estimatedCost: 'KSh 585,000.00',
    date: '2026-10-01 10:15',
    status: 'Pending',
  },
  {
    id: 'REQ-2026-0102',
    itemTitle: 'Enterprise Wi-Fi 7 Access Points (Qty: 6)',
    department: 'IT',
    requester: 'Dr. Alan Turing',
    estimatedCost: 'KSh 370,500.00',
    date: '2026-09-30 14:40',
    status: 'Approved',
  },
  {
    id: 'REQ-2026-0103',
    itemTitle: 'Varsity Basketball Uniforms & Gear',
    department: 'Athletics',
    requester: 'Coach Jim Miller',
    estimatedCost: 'KSh 249,600.00',
    date: '2026-09-29 09:20',
    status: 'Fulfilled',
  },
  {
    id: 'REQ-2026-0104',
    itemTitle: 'Ergonomic Office Chairs for Admin (Qty: 4)',
    department: 'Administration',
    requester: 'Sarah Jenkins',
    estimatedCost: 'KSh 156,000.00',
    date: '2026-09-28 16:05',
    status: 'Pending',
  },
  {
    id: 'REQ-2026-0105',
    itemTitle: 'HVAC Air Filter Replacements (Set of 20)',
    department: 'Facilities',
    requester: 'Tom Bradley',
    estimatedCost: 'KSh 110,500.00',
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

  // Filter logic
  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.itemTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.requester.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = departmentFilter === 'All' || req.department === departmentFilter;
    const matchesStatus = statusFilter === 'All' || req.status === statusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  // Status badge styling
  const getStatusBadge = (status: RequestItem['status']) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Fulfilled':
        return 'bg-sky-50 text-[#0ea5e9] border-sky-200';
      case 'Rejected':
        return 'bg-rose-50 text-rose-800 border-rose-200';
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
    <div className="flex-1 w-full min-w-0 bg-[#f4f7fb] min-h-screen p-4 sm:p-6 lg:p-8 font-sans overflow-x-hidden text-[#042954]">
      
      {/* Page Header */}
      <div className="mb-6 lg:mb-8 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-extrabold text-[#042954] mb-1 tracking-tight">
            Purchase Requests & Requisitions
          </h1>
          <p className="text-[12px] text-[#64748b]">
            Manage departmental purchasing workflows, track approval pipelines, and audit institutional supply orders.
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
            <i className="fa-solid fa-plus mr-2 text-xs"></i> New Requisition
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
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Total Requests YTD</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">142</h3>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center mt-1">
              <i className="fa-solid fa-arrow-trend-up mr-1"></i> Active workflow
            </span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-sky-50 text-[#0ea5e9] flex items-center justify-center shrink-0">
            <i className="fa-solid fa-box-archive text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Pending Approval</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">12</h3>
            <span className="text-[11px] text-amber-600 font-semibold mt-1 block">Awaiting department review</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-clock text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Approved & Ordered</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">114</h3>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Processing fulfillment</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-teal-50 text-[#06b6d4] flex items-center justify-center shrink-0">
            <i className="fa-solid fa-circle-check text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Total Requisition Spend</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">KSh 23,946,000</h3>
            <span className="text-[11px] text-purple-600 font-semibold mt-1 block">Within annual budget</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-receipt text-lg"></i>
          </div>
        </div>
      </div>

      {/* Toolbar: Search and Filters */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#e2e8f0] mb-6 w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-[360px]">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[12px]"></i>
          <input
            type="text"
            placeholder="Search request ID, item title, or requester..."
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
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Fulfilled">Fulfilled</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests Data Table */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                <th className="py-3.5 px-5">Request ID / Date</th>
                <th className="py-3.5 px-5">Item Description</th>
                <th className="py-3.5 px-5">Department</th>
                <th className="py-3.5 px-5">Requester</th>
                <th className="py-3.5 px-5">Estimated Cost</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/75 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-bold text-[#042954] font-mono text-[12px]">{req.id}</div>
                      <div className="text-[11px] text-[#64748b] mt-0.5">{req.date}</div>
                    </td>
                    <td className="py-4 px-5 text-[#042954] font-semibold text-[12px]">{req.itemTitle}</td>
                    <td className="py-4 px-5 text-slate-700 text-[12px]">{req.department}</td>
                    <td className="py-4 px-5 text-[#042954] text-[12px] font-medium">{req.requester}</td>
                    <td className="py-4 px-5 text-[#042954] font-mono text-[12px] font-bold">{req.estimatedCost}</td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(req.status)}`}>
                        {req.status}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#042954]/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-[#e2e8f0] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] bg-[#f8fafc] px-6 py-4">
              <h3 className="font-bold text-[#042954] text-[15px]">Submit New Purchase Requisition</h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-[#042954] transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleCreateRequest} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                  Item Description / Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Laboratory Spectrophotometer"
                  className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                    Estimated Cost (KES)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. KSh 162,500.00"
                    className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                  Requester Name
                </label>
                <input
                  type="text"
                  required
                  defaultValue="Dr. Marie Curie"
                  className="w-full h-[40px] rounded-xl border border-[#cbd5e1] px-3.5 text-[13px] text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#042954] uppercase tracking-wider mb-1.5">
                  Business Justification
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide brief explanation for institutional necessity..."
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