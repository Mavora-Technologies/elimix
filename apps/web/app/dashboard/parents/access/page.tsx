// apps/web/app/dashboard/parents/access/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

interface PortalAccessRecord {
  id: string;
  guardianName: string;
  email: string;
  lastLogin: string;
  ipAddress: string;
  device: string;
  status: 'Active' | 'Locked' | 'Pending' | 'Revoked';
}

const initialAccessRecords: PortalAccessRecord[] = [
  {
    id: 'ACC-001',
    guardianName: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    lastLogin: '2026-10-02 08:45 AM',
    ipAddress: '197.232.10.45',
    device: 'iPhone 15 / Safari',
    status: 'Active',
  },
  {
    id: 'ACC-002',
    guardianName: 'Rajesh Patel',
    email: 'rajesh.patel@example.com',
    lastLogin: '2026-10-01 06:20 PM',
    ipAddress: '41.204.180.12',
    device: 'Windows PC / Chrome',
    status: 'Active',
  },
  {
    id: 'ACC-003',
    guardianName: 'Elena Gomez',
    email: 'elena.gomez@example.com',
    lastLogin: 'Never',
    ipAddress: '-',
    device: '-',
    status: 'Pending',
  },
  {
    id: 'ACC-004',
    guardianName: 'Mark Smith',
    email: 'mark.smith@example.com',
    lastLogin: '2026-09-28 02:15 PM',
    ipAddress: '105.163.2.89',
    device: 'MacBook Pro / Edge',
    status: 'Locked',
  },
];

export default function ParentPortalAccessPage() {
  const [accessRecords, setAccessRecords] = useState<PortalAccessRecord[]>(initialAccessRecords);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Filter logic
  const filteredRecords = accessRecords.filter((record) => {
    const matchesSearch =
      record.guardianName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.ipAddress.includes(searchQuery);

    const matchesStatus = statusFilter === 'All' || record.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Status badge styling
  const getStatusBadge = (status: PortalAccessRecord['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Locked':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Revoked':
        return 'bg-slate-50 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const handleResetPassword = (name: string) => {
    setActionMessage(`Password reset instructions successfully sent to ${name}.`);
    setTimeout(() => setActionMessage(null), 4000);
  };

  const handleUnlockAccount = (id: string, name: string) => {
    setAccessRecords((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Active' } : item))
    );
    setActionMessage(`Account for ${name} has been successfully unlocked.`);
    setTimeout(() => setActionMessage(null), 4000);
  };

  return (
    <div className="flex-1 w-full min-w-0 bg-[#f4f7fb] min-h-screen p-4 sm:p-6 lg:p-8 font-sans overflow-x-hidden text-[#042954]">
      
      {/* Page Header */}
      <div className="mb-6 lg:mb-8 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-extrabold text-[#042954] mb-1 tracking-tight">
            Parent Portal Access & Security
          </h1>
          <p className="text-[12px] text-[#64748b]">
            Monitor login activity, manage portal credentials, unlock accounts, and review security access logs.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard/parents"
            className="h-[38px] px-4 rounded-xl border border-[#cbd5e1] bg-white text-[12px] font-semibold text-[#042954] hover:bg-slate-50 transition-colors shadow-sm flex items-center"
          >
            <i className="fa-solid fa-users mr-2 text-xs text-[#0ea5e9]"></i> Parent Directory
          </Link>
          <button className="h-[38px] px-4 rounded-xl bg-gradient-to-r from-[#042954] to-[#0ea5e9] text-white text-[12px] font-semibold hover:opacity-95 transition-all shadow-md shadow-sky-500/20 flex items-center justify-center">
            <i className="fa-solid fa-paper-plane mr-2 text-xs"></i> Send Bulk Invites
          </button>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionMessage && (
        <div className="mb-6 rounded-2xl bg-sky-50 border border-sky-200 p-4 text-[#042954] text-xs flex items-center justify-between shadow-sm">
          <div className="flex items-center">
            <i className="fa-solid fa-circle-info text-[#0ea5e9] mr-2 text-base"></i>
            <span className="font-semibold">{actionMessage}</span>
          </div>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 w-full">
        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Active Credentials</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">682</h3>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center mt-1">
              <i className="fa-solid fa-arrow-trend-up mr-1"></i> Fully operational
            </span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-sky-50 text-[#0ea5e9] flex items-center justify-center shrink-0">
            <i className="fa-solid fa-key text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Logins Today</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">148</h3>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Unique active sessions</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-teal-50 text-[#06b6d4] flex items-center justify-center shrink-0">
            <i className="fa-solid fa-right-to-bracket text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Locked Accounts</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">4</h3>
            <span className="text-[11px] text-rose-600 font-semibold mt-1 block">Multiple failed attempts</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-user-lock text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Pending Invites</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">82</h3>
            <span className="text-[11px] text-amber-600 font-semibold mt-1 block">Activation link unclicked</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-clock text-lg"></i>
          </div>
        </div>
      </div>

      {/* Toolbar: Search and Filter */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#e2e8f0] mb-6 w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-[360px]">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[12px]"></i>
          <input
            type="text"
            placeholder="Search guardian name, email, or IP address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[40px] pl-9 pr-3 rounded-xl border border-[#cbd5e1] text-[12px] font-medium text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9] focus:ring-2 focus:ring-sky-500/20"
          />
        </div>

        <div className="flex items-center gap-2 text-[12px] font-medium text-[#64748b]">
          <span>Access Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-[38px] px-3 rounded-xl border border-[#cbd5e1] text-[12px] font-semibold text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9] cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Locked">Locked</option>
            <option value="Pending">Pending</option>
            <option value="Revoked">Revoked</option>
          </select>
        </div>
      </div>

      {/* Portal Access Data Table */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                <th className="py-3.5 px-5">Guardian Name / Email</th>
                <th className="py-3.5 px-5">Last Login</th>
                <th className="py-3.5 px-5">IP Address</th>
                <th className="py-3.5 px-5">Device / Browser</th>
                <th className="py-3.5 px-5">Portal Status</th>
                <th className="py-3.5 px-5 text-right">Security Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/75 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-bold text-[#042954]">{record.guardianName}</div>
                      <div className="text-[11px] text-[#64748b] mt-0.5">{record.email}</div>
                    </td>
                    <td className="py-4 px-5 text-slate-700 text-[12px] font-medium">{record.lastLogin}</td>
                    <td className="py-4 px-5 text-[#64748b] font-mono text-[12px]">{record.ipAddress}</td>
                    <td className="py-4 px-5 text-[#64748b] text-[12px]">{record.device}</td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right space-x-2">
                      <button
                        onClick={() => handleResetPassword(record.guardianName)}
                        className="h-[32px] px-3 rounded-lg bg-sky-50 text-[#0ea5e9] hover:bg-sky-100 font-semibold text-[12px] transition-colors"
                      >
                        Reset Password
                      </button>
                      {record.status === 'Locked' && (
                        <button
                          onClick={() => handleUnlockAccount(record.id, record.guardianName)}
                          className="h-[32px] px-3 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-[12px] transition-colors"
                        >
                          Unlock
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#64748b] text-[13px]">
                    No matching portal access logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}