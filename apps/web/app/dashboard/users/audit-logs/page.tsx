'use client';

import { useState } from 'react';
import Link from 'next/link';

/* ==========================================================================
   ELIMIX BRAND
   ========================================================================== */

const BRAND = {
  navy: '#012E54',
  blue: '#006FBF',
  brightBlue: '#0088CE',
  cyan: '#04B1D6',
  teal: '#0199B9',
};

type AuditLog = {
  id: string;
  user: string;
  role: string;
  action: string;
  module: 'Finance' | 'Users & Security' | 'Academics' | 'Hostel' | 'Settings';
  ipAddress: string;
  status: 'Success' | 'Warning' | 'Critical';
  timestamp: string;
  details: string;
};

const INITIAL_LOGS: AuditLog[] = [
  {
    id: 'AUD-9001',
    user: 'admin@elimix.edu',
    role: 'Super Administrator',
    action: 'Modified global security policy (2FA enforced)',
    module: 'Users & Security',
    ipAddress: '192.168.1.55',
    status: 'Success',
    timestamp: 'Today, 2:45 PM',
    details: 'Enabled mandatory Two-Factor Authentication for all administrative and bursar accounts.',
  },
  {
    id: 'AUD-9002',
    user: 'bursar@elimix.edu',
    role: 'School Bursar',
    action: 'Updated term fee structure for Form 3',
    module: 'Finance',
    ipAddress: '41.89.22.10',
    status: 'Success',
    timestamp: 'Today, 11:20 AM',
    details: 'Adjusted tuition levy line item from KES 24,500 to KES 26,000 for Term 2.',
  },
  {
    id: 'AUD-9003',
    user: 'unknown_scanner',
    role: 'Guest / Unauthenticated',
    action: 'Multiple failed login attempts detected',
    module: 'Users & Security',
    ipAddress: '197.232.10.4',
    status: 'Critical',
    timestamp: 'Today, 9:05 AM',
    details: 'IP automatically throttled after 5 consecutive incorrect password tries.',
  },
  {
    id: 'AUD-9004',
    user: 'headteacher@elimix.edu',
    role: 'Head of Teacher Staff',
    action: 'Exported end-of-term academic performance summary',
    module: 'Academics',
    ipAddress: '192.168.1.114',
    status: 'Success',
    timestamp: 'Yesterday, 4:15 PM',
    details: 'Generated and downloaded PDF report for Grade 10 aggregate scores.',
  },
  {
    id: 'AUD-9005',
    user: 'warden@elimix.edu',
    role: 'Hostel Warden',
    action: 'Reallocated student bed assignment (Room 204)',
    module: 'Hostel',
    ipAddress: '192.168.1.102',
    status: 'Success',
    timestamp: 'Yesterday, 2:30 PM',
    details: 'Moved student ID #4402 from North Wing to West Wing dormitory block.',
  },
];

export default function AuditLogsPage() {
  const [logs] = useState<AuditLog[]>(INITIAL_LOGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesModule = moduleFilter === 'all' || log.module === moduleFilter;
    return matchesSearch && matchesModule;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* ==================================================================
         PAGE HEADER
         ================================================================== */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <Link href="/dashboard/users" className="hover:text-[#006FBF]">
              User Management
            </Link>
            <i className="fa-solid fa-chevron-right text-[10px]" />
            <span className="text-slate-900">Audit Logs & Activity</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            System Audit Logs & Activity Trail
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Chronological compliance tracking of administrative logins, data modifications, and security events.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50"
          >
            <i className="fa-solid fa-file-arrow-down mr-2 text-slate-400" />
            Export CSV / PDF
          </button>
        </div>
      </div>

      {/* ==================================================================
         METRICS OVERVIEW
         ================================================================== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Total Logged Events
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">1,428</p>
          <span className="mt-2 inline-block text-[11px] font-medium text-emerald-600">
            <i className="fa-solid fa-shield-check mr-1" /> Fully synchronized
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Security Warnings
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">3</p>
          <span className="mt-2 inline-block text-[11px] font-medium text-amber-600">
            Requires monitoring
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Critical Blocks
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">1</p>
          <span className="mt-2 inline-block text-[11px] font-medium text-rose-600">
            IP Throttled Today
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Retention Period
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">365 Days</p>
          <span className="mt-2 inline-block text-[11px] font-medium text-[#006FBF]">
            Compliant archive rule
          </span>
        </div>
      </div>

      {/* ==================================================================
         FILTERS & SEARCH BAR
         ================================================================== */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm">
        <div className="relative flex min-w-0 flex-1 items-center">
          <i className="fa-solid fa-magnifying-glass absolute left-3 text-xs text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by log ID, user email, or action description..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-4 text-xs text-slate-700 outline-none transition-all focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-[#006FBF]/40 focus:bg-white"
          >
            <option value="all">All Modules</option>
            <option value="Finance">Finance</option>
            <option value="Users & Security">Users & Security</option>
            <option value="Academics">Academics</option>
            <option value="Hostel">Hostel</option>
          </select>
        </div>
      </div>

      {/* ==================================================================
         AUDIT LOGS TABLE
         ================================================================== */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 pl-4 pr-3">Log ID</th>
                <th className="px-3 py-3">User & Role</th>
                <th className="px-3 py-3">Action Description</th>
                <th className="px-3 py-3">Module</th>
                <th className="px-3 py-3">Origin IP</th>
                <th className="px-3 py-3">Status</th>
                <th className="py-3 pl-3 pr-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className="cursor-pointer transition-colors hover:bg-slate-50/60"
                >
                  <td className="py-3 pl-4 pr-3 font-mono text-[11px] font-semibold text-[#006FBF]">
                    {log.id}
                  </td>

                  <td className="px-3 py-3">
                    <span className="font-semibold text-slate-900 block">{log.user}</span>
                    <span className="text-[10px] text-slate-400">{log.role}</span>
                  </td>

                  <td className="px-3 py-3 font-medium text-slate-800 max-w-xs truncate">
                    {log.action}
                  </td>

                  <td className="px-3 py-3">
                    <span className="inline-flex items-center rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                      {log.module}
                    </span>
                  </td>

                  <td className="px-3 py-3 font-mono text-[11px] text-slate-500">
                    {log.ipAddress}
                  </td>

                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                        log.status === 'Success'
                          ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
                          : log.status === 'Warning'
                          ? 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20'
                          : 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20'
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>

                  <td className="py-3 pl-3 pr-4 text-right text-slate-500 font-medium">
                    {log.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================================================================
         LOG DETAILS MODAL (When clicking a log row)
         ================================================================== */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#006FBF]/10 text-[#006FBF]">
                  <i className="fa-solid fa-file-lines text-xs" />
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  Audit Details: {selectedLog.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <i className="fa-solid fa-xmark text-sm" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div>
                <span className="font-semibold text-slate-700 block">Action Performed:</span>
                <p className="text-slate-900 font-medium mt-0.5">{selectedLog.action}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold text-slate-700 block">User Account:</span>
                  <span className="text-slate-900">{selectedLog.user}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700 block">Security Role:</span>
                  <span className="text-slate-900">{selectedLog.role}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold text-slate-700 block">Module Category:</span>
                  <span className="text-slate-900">{selectedLog.module}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700 block">Origin IP Address:</span>
                  <span className="font-mono text-slate-900">{selectedLog.ipAddress}</span>
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block">Detailed Payload / Notes:</span>
                <div className="mt-1 rounded-xl bg-slate-50 p-3 font-mono text-[11px] text-slate-700 border border-slate-200">
                  {selectedLog.details}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}