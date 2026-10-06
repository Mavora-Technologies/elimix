'use client';

import { useState } from 'react';
import Link from 'next/link';

/* ==========================================================================
   ELIMIX BRAND (Consistent with sidebar layout)
   ========================================================================== */

const BRAND = {
  navy: '#012E54',
  blue: '#006FBF',
  brightBlue: '#0088CE',
  cyan: '#04B1D6',
  teal: '#0199B9',
};

type SecurityLog = {
  id: string;
  event: string;
  user: string;
  ipAddress: string;
  status: 'Success' | 'Blocked' | 'Warning';
  timestamp: string;
};

const INITIAL_LOGS: SecurityLog[] = [
  {
    id: 'SEC-101',
    event: 'Password Policy Updated',
    user: 'admin@elimix.edu',
    ipAddress: '192.168.1.55',
    status: 'Success',
    timestamp: 'Today, 2:15 PM',
  },
  {
    id: 'SEC-102',
    event: 'Failed Login Attempt (Wrong 2FA)',
    user: 'bursar@elimix.edu',
    ipAddress: '41.89.22.10',
    status: 'Blocked',
    timestamp: 'Today, 11:42 AM',
  },
  {
    id: 'SEC-103',
    event: 'Forced Session Termination',
    user: 'warden@elimix.edu',
    ipAddress: '192.168.1.102',
    status: 'Warning',
    timestamp: 'Yesterday, 5:30 PM',
  },
];

export default function AuthenticationSecurityPage() {
  const [twoFactorMandatory, setTwoFactorMandatory] = useState(true);
  const [passwordMinLength, setPasswordMinLength] = useState(10);
  const [sessionTimeout, setSessionTimeout] = useState('30 mins');
  const [ipRestrictionEnabled, setIpRestrictionEnabled] = useState(false);
  const [logs] = useState<SecurityLog[]>(INITIAL_LOGS);
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

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
            <span className="text-slate-900">Authentication & Security</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Authentication & Security Policies
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Manage global password complexity rules, Two-Factor Authentication (2FA), and active session timeouts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/users"
            className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50"
          >
            <i className="fa-solid fa-arrow-left mr-2 text-slate-400" />
            Back to Directory
          </Link>
        </div>
      </div>

      {/* ==================================================================
         SUCCESS BANNER NOTIFICATION
         ================================================================== */}
      {savedMessage && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800 shadow-sm">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-circle-check text-emerald-600 text-sm" />
            <span>Security policies have been successfully updated and enforced across all user portals.</span>
          </div>
        </div>
      )}

      {/* ==================================================================
         METRICS OVERVIEW
         ================================================================== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            2FA Enforced Status
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            {twoFactorMandatory ? 'Mandatory (Admins)' : 'Optional'}
          </p>
          <span className="mt-2 inline-block text-[11px] font-medium text-emerald-600">
            <i className="fa-solid fa-shield-halved mr-1" /> High compliance
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Min Password Length
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{passwordMinLength} Chars</p>
          <span className="mt-2 inline-block text-[11px] font-medium text-[#006FBF]">
            Includes symbols & digits
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Inactivity Timeout
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{sessionTimeout}</p>
          <span className="mt-2 inline-block text-[11px] font-medium text-slate-500">
            Auto-lock enabled
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Blocked IP Threat Log
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">12 Attempts</p>
          <span className="mt-2 inline-block text-[11px] font-medium text-rose-600">
            <i className="fa-solid fa-triangle-exclamation mr-1" /> Last 24 hours
          </span>
        </div>
      </div>

      {/* ==================================================================
         SECURITY CONFIGURATION FORM
         ================================================================== */}
      <form onSubmit={handleSaveSettings} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Core Policies */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-5">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <i className="fa-solid fa-lock text-[#006FBF]" />
              Authentication & Password Rules
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Minimum Password Length
                </label>
                <select
                  value={passwordMinLength}
                  onChange={(e) => setPasswordMinLength(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-[#006FBF]/40 focus:bg-white"
                >
                  <option value={8}>8 Characters</option>
                  <option value={10}>10 Characters (Recommended)</option>
                  <option value={12}>12 Characters (Strict)</option>
                  <option value={16}>16 Characters (Enterprise)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Inactivity Session Timeout
                </label>
                <select
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-[#006FBF]/40 focus:bg-white"
                >
                  <option value="15 mins">15 Minutes</option>
                  <option value="30 mins">30 Minutes</option>
                  <option value="60 mins">1 Hour</option>
                  <option value="4 hours">4 Hours</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={twoFactorMandatory}
                  onChange={(e) => setTwoFactorMandatory(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#006FBF] focus:ring-[#006FBF]"
                />
                <div>
                  <span className="block text-xs font-semibold text-slate-800">
                    Enforce Two-Factor Authentication (2FA) for Administrators & Bursars
                  </span>
                  <span className="block text-[11px] text-slate-500">
                    Users with sensitive financial or access permissions must verify login requests via Authenticator app or SMS code.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ipRestrictionEnabled}
                  onChange={(e) => setIpRestrictionEnabled(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#006FBF] focus:ring-[#006FBF]"
                />
                <div>
                  <span className="block text-xs font-semibold text-slate-800">
                    Enable Campus IP Whitelisting Perimeter
                  </span>
                  <span className="block text-[11px] text-slate-500">
                    Restrict administrative modifications strictly to approved school network gateway addresses.
                  </span>
                </div>
              </label>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:opacity-95"
                style={{
                  background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})`,
                }}
              >
                <i className="fa-solid fa-floppy-disk mr-2" />
                Save Security Policies
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Security Tips / Quick Summary */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Security Best Practices
            </h3>
            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-circle-check text-emerald-600 mt-0.5" />
                <span>Require regular rotation of finance staff credentials every 90 days.</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-circle-check text-emerald-600 mt-0.5" />
                <span>Keep automated IP throttling enabled to block brute-force password scanners.</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-circle-check text-emerald-600 mt-0.5" />
                <span>Monitor audit logs routinely for unusual permission modifications.</span>
              </li>
            </ul>
          </div>
        </div>
      </form>

      {/* ==================================================================
         RECENT SECURITY ACTIVITY LOG
         ================================================================== */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <i className="fa-solid fa-shield-cat text-[#006FBF]" />
            Recent Security Events & Alerts
          </h2>
          <Link
            href="/dashboard/users/audit-logs"
            className="text-xs font-semibold text-[#006FBF] hover:underline"
          >
            View Full Audit Logs &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 pl-4 pr-3">Security Event</th>
                <th className="px-3 py-3">Target User</th>
                <th className="px-3 py-3">Origin IP Address</th>
                <th className="px-3 py-3">Status</th>
                <th className="py-3 pl-3 pr-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {logs.map((log) => (
                <tr key={log.id} className="transition-colors hover:bg-slate-50/50">
                  <td className="py-3 pl-4 pr-3 font-semibold text-slate-900">{log.event}</td>
                  <td className="px-3 py-3 text-slate-600">{log.user}</td>
                  <td className="px-3 py-3 font-mono text-[11px] text-slate-500">{log.ipAddress}</td>
                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                        log.status === 'Success'
                          ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
                          : log.status === 'Blocked'
                          ? 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20'
                          : 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20'
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3 pl-3 pr-4 text-right text-slate-400 font-medium">{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}