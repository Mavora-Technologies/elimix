'use client';

import { useState } from 'react';
import Link from 'next/link';

// TypeScript interface for Portal Access Record
interface PortalAccessRecord {
  id: string;
  guardianName: string;
  email: string;
  lastLogin: string;
  ipAddress: string;
  device: string;
  status: 'Active' | 'Locked' | 'Pending' | 'Revoked';
}

// Initial mock portal access data
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

  // Filter logic based on search and status
  const filteredRecords = accessRecords.filter((record) => {
    const matchesSearch =
      record.guardianName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.ipAddress.includes(searchQuery);

    const matchesStatus = statusFilter === 'All' || record.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Helper for status badge styling
  const getStatusBadge = (status: PortalAccessRecord['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Locked':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Parent Portal Access & Security
          </h1>
          <p className="text-sm text-slate-500">
            Monitor login activity, manage portal credentials, unlock accounts, and review security access logs.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/parents"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <i className="fa-solid fa-users mr-2 text-xs text-blue-600"></i> Parent Directory
          </Link>
          <button className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors">
            <i className="fa-solid fa-paper-plane mr-2 text-xs"></i> Send Bulk Invites
          </button>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionMessage && (
        <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 text-blue-800 text-sm flex items-center justify-between shadow-sm">
          <div className="flex items-center">
            <i className="fa-solid fa-circle-info text-blue-600 mr-2 text-base"></i>
            <span>{actionMessage}</span>
          </div>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Credentials</p>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <i className="fa-solid fa-key text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">682</p>
          <span className="text-xs text-emerald-600 font-medium"><i className="fa-solid fa-arrow-trend-up mr-1"></i> Fully operational</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Logins Today</p>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <i className="fa-solid fa-right-to-bracket text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">148</p>
          <span className="text-xs text-emerald-600 font-medium">Unique active sessions</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Locked Accounts</p>
            <div className="rounded-lg bg-rose-50 p-2 text-rose-600">
              <i className="fa-solid fa-user-lock text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">4</p>
          <span className="text-xs text-rose-600 font-medium">Multiple failed attempts</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Invites</p>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <i className="fa-solid fa-clock text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">82</p>
          <span className="text-xs text-amber-600 font-medium">Activation link unclicked</span>
        </div>
      </div>

      {/* Toolbar: Search and Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-xs text-slate-400"></i>
          <input
            type="text"
            placeholder="Search guardian name, email, or IP address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
          <span>Access Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
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
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Guardian Name / Email</th>
                <th className="py-3 px-4">Last Login</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4">Device / Browser</th>
                <th className="py-3 px-4">Portal Status</th>
                <th className="py-3 px-4 text-right">Security Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{record.guardianName}</div>
                      <div className="text-xs text-slate-500">{record.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 text-xs font-medium">{record.lastLogin}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-xs">{record.ipAddress}</td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs">{record.device}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleResetPassword(record.guardianName)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-xs px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        Reset Password
                      </button>
                      {record.status === 'Locked' && (
                        <button
                          onClick={() => handleUnlockAccount(record.id, record.guardianName)}
                          className="text-emerald-600 hover:text-emerald-800 font-medium text-xs px-2 py-1 rounded hover:bg-emerald-50 transition-colors"
                        >
                          Unlock
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 text-sm">
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