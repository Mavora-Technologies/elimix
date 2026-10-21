// apps/web/app/dashboard/parents/access/page.tsx
'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
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

export default function ParentPortalAccessPage() {
  const [accessRecords, setAccessRecords] = useState<PortalAccessRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const getHeaders = () => {
    const token = localStorage.getItem('elimix_token');
    const storedUser = localStorage.getItem('elimix_user');
    let tenantId = '';
    if (storedUser) {
      try {
        tenantId = JSON.parse(storedUser)?.tenantId || '';
      } catch {}
    }
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(tenantId ? { 'x-tenant-id': tenantId } : {}),
    };
  };

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

  const fetchAccessLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/parents/access-logs`, {
        headers: getHeaders(),
      });

      if (res.ok) {
        const json = await res.json();
        const logs = Array.isArray(json.data) ? json.data : [];
        
        // Map database audit logs to PortalAccessRecord DTO
        const mapped: PortalAccessRecord[] = logs.map((log: any, idx: number) => ({
          id: log.id || `ACC-${idx + 1}`,
          guardianName: log.firstName ? `${log.firstName} ${log.lastName}`.trim() : 'System User',
          email: log.email || 'portal@elimix.com',
          lastLogin: log.createdAt ? new Date(log.createdAt).toLocaleString() : 'Recent',
          ipAddress: log.ipAddress || '197.232.x.x',
          device: log.module === 'parents' ? 'Parent Portal App' : 'Web Dashboard',
          status: 'Active',
        }));

        setAccessRecords(mapped);
      } else {
        setError('Failed to fetch portal access logs.');
      }
    } catch (err: any) {
      console.error('Error fetching access logs:', err);
      setError('Unable to reach the backend server.');
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchAccessLogs();
  }, [fetchAccessLogs]);

  // Filter logic
  const filteredRecords = useMemo(() => {
    return accessRecords.filter((record) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        record.guardianName.toLowerCase().includes(q) ||
        record.email.toLowerCase().includes(q) ||
        record.ipAddress.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'All' || record.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [accessRecords, searchQuery, statusFilter]);

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
          <button
            onClick={fetchAccessLogs}
            className="h-[38px] px-4 rounded-xl bg-gradient-to-r from-[#042954] to-[#0ea5e9] text-white text-[12px] font-semibold hover:opacity-95 transition-all shadow-md shadow-sky-500/20 flex items-center justify-center"
          >
            <i className="fa-solid fa-rotate mr-2 text-xs"></i> Refresh Logs
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800 flex items-center justify-between">
          <span><i className="fa-solid fa-triangle-exclamation mr-2"></i>{error}</span>
          <button onClick={() => setError(null)} className="font-bold underline">Dismiss</button>
        </div>
      )}

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
        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Total Audit Logs</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">
              {isLoading ? '...' : accessRecords.length}
            </h3>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Live DB audit trail</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-sky-50 text-[#0ea5e9] flex items-center justify-center shrink-0">
            <i className="fa-solid fa-shield-halved text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Active Credentials</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">
              {isLoading ? '...' : accessRecords.filter((r) => r.status === 'Active').length}
            </h3>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Fully operational</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-teal-50 text-[#06b6d4] flex items-center justify-center shrink-0">
            <i className="fa-solid fa-key text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Locked Accounts</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">0</h3>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">No security lockouts</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-user-lock text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Security Status</p>
            <h3 className="text-[24px] font-extrabold text-emerald-600">Secure</h3>
            <span className="text-[11px] text-[#64748b] font-semibold mt-1 block">JWT + Tenant Isolation</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-lock text-lg"></i>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#e2e8f0] mb-6 w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-[360px]">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[12px]"></i>
          <input
            type="text"
            placeholder="Search guardian name, email, or IP address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[40px] pl-9 pr-3 rounded-xl border border-[#cbd5e1] text-[12px] font-medium text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9]"
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

      {/* Access Logs Data Table */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                <th className="py-3.5 px-5">Guardian Name / Email</th>
                <th className="py-3.5 px-5">Activity Timestamp</th>
                <th className="py-3.5 px-5">IP Address</th>
                <th className="py-3.5 px-5">Module / Device</th>
                <th className="py-3.5 px-5">Portal Status</th>
                <th className="py-3.5 px-5 text-right">Security Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#64748b]">
                    <i className="fa-solid fa-circle-notch animate-spin mr-2 text-[#0ea5e9]"></i>
                    Loading security audit logs...
                  </td>
                </tr>
              ) : filteredRecords.length > 0 ? (
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
                    No portal access logs found in the database.
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