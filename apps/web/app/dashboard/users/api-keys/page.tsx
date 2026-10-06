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

type ApiKey = {
  id: string;
  name: string;
  service: string;
  prefix: string;
  scopes: string[];
  lastUsed: string;
  status: 'Active' | 'Expired' | 'Revoked';
  createdAt: string;
};

const INITIAL_KEYS: ApiKey[] = [
  {
    id: 'KEY-001',
    name: 'M-Pesa Daraja Payment Gateway',
    service: 'Finance / Fee Collection',
    prefix: 'elx_live_99a2...',
    scopes: ['finance:write', 'invoices:read', 'webhooks:manage'],
    lastUsed: '2 minutes ago',
    status: 'Active',
    createdAt: 'Jan 15, 2026',
  },
  {
    id: 'KEY-002',
    name: 'Parent Mobile App Sync',
    service: 'Student Portal API',
    prefix: 'elx_live_84f1...',
    scopes: ['students:read', 'grades:read', 'attendance:read'],
    lastUsed: '14 minutes ago',
    status: 'Active',
    createdAt: 'Feb 02, 2026',
  },
  {
    id: 'KEY-003',
    name: 'Biometric Gate Attendance Scanner',
    service: 'Hardware Attendance',
    prefix: 'elx_live_33b8...',
    scopes: ['attendance:write', 'students:read'],
    lastUsed: '1 hour ago',
    status: 'Active',
    createdAt: 'Mar 10, 2026',
  },
  {
    id: 'KEY-004',
    name: 'Legacy SMS Notification Relay',
    service: 'Communication Service',
    prefix: 'elx_test_110a...',
    scopes: ['notifications:write'],
    lastUsed: '3 months ago',
    status: 'Expired',
    createdAt: 'Nov 20, 2025',
  },
];

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>(INITIAL_KEYS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTokenName, setNewTokenName] = useState('');
  const [newServiceType, setNewServiceType] = useState('Finance');
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  const filteredKeys = keys.filter(
    (k) =>
      k.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.service.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyPrefix = (prefix: string, id: string) => {
    navigator.clipboard.writeText(prefix);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleRevokeKey = (id: string) => {
    setKeys(
      keys.map((k) => (k.id === id ? { ...k, status: 'Revoked' as const } : k))
    );
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
            <span className="text-slate-900">API Tokens & Integrations</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            API Tokens & Webhook Integrations
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Manage secure programmatic bearer tokens, webhook endpoints, and third-party app connections.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:opacity-95"
            style={{
              background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})`,
            }}
          >
            <i className="fa-solid fa-plus mr-2" />
            Generate New Token
          </button>
        </div>
      </div>

      {/* ==================================================================
         METRICS OVERVIEW
         ================================================================== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Active Tokens
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {keys.filter((k) => k.status === 'Active').length}
          </p>
          <span className="mt-2 inline-block text-[11px] font-medium text-emerald-600">
            <i className="fa-solid fa-check-circle mr-1" /> Fully operational
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            API Requests (24h)
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">48.2k</p>
          <span className="mt-2 inline-block text-[11px] font-medium text-[#006FBF]">
            <i className="fa-solid fa-chart-line mr-1" /> +12% vs yesterday
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Connected Webhooks
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">3</p>
          <span className="mt-2 inline-block text-[11px] font-medium text-slate-500">
            M-Pesa, SMS, Portal
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Expired / Revoked
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {keys.filter((k) => k.status !== 'Active').length}
          </p>
          <span className="mt-2 inline-block text-[11px] font-medium text-amber-600">
            Archived security keys
          </span>
        </div>
      </div>

      {/* ==================================================================
         SEARCH BAR
         ================================================================== */}
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm">
        <div className="relative flex min-w-0 flex-1 items-center">
          <i className="fa-solid fa-magnifying-glass absolute left-3 text-xs text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search API keys by name or integrated service..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-4 text-xs text-slate-700 outline-none transition-all focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10"
          />
        </div>
      </div>

      {/* ==================================================================
         API KEYS TABLE
         ================================================================== */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 pl-4 pr-3">Token Name & Service</th>
                <th className="px-3 py-3">Key Prefix</th>
                <th className="px-3 py-3">Scopes & Access</th>
                <th className="px-3 py-3">Last Used</th>
                <th className="px-3 py-3">Status</th>
                <th className="py-3 pl-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredKeys.map((key) => (
                <tr key={key.id} className="transition-colors hover:bg-slate-50/50">
                  <td className="py-3 pl-4 pr-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#006FBF]/10 text-[#006FBF]">
                        <i className="fa-solid fa-key text-[11px]" />
                      </span>
                      <div>
                        <span className="font-semibold text-slate-900 block">{key.name}</span>
                        <span className="text-[10px] text-slate-400">{key.service}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {key.prefix}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyPrefix(key.prefix, key.id)}
                        className="text-slate-400 hover:text-[#006FBF]"
                        title="Copy Key Prefix"
                      >
                        <i
                          className={`fa-solid ${
                            copiedKeyId === key.id ? 'fa-check text-emerald-600' : 'fa-copy'
                          } text-xs`}
                        />
                      </button>
                    </div>
                  </td>

                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-1">
                      {key.scopes.map((scope, idx) => (
                        <span
                          key={idx}
                          className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono text-slate-600"
                        >
                          {scope}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="px-3 py-3 text-slate-500 font-medium">{key.lastUsed}</td>

                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                        key.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
                          : key.status === 'Expired'
                          ? 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20'
                          : 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20'
                      }`}
                    >
                      {key.status}
                    </span>
                  </td>

                  <td className="py-3 pl-3 pr-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {key.status === 'Active' && (
                        <button
                          type="button"
                          onClick={() => handleRevokeKey(key.id)}
                          className="rounded-lg px-2.5 py-1 text-[11px] font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================================================================
         GENERATE TOKEN MODAL
         ================================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#006FBF]/10 text-[#006FBF]">
                  <i className="fa-solid fa-key text-xs" />
                </span>
                <h3 className="text-sm font-bold text-slate-900">Generate New API Token</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <i className="fa-solid fa-xmark text-sm" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Token Identifier / Name</label>
                <input
                  type="text"
                  value={newTokenName}
                  onChange={(e) => setNewTokenName(e.target.value)}
                  placeholder="e.g., Library Barcode Scanner Integration"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-slate-700 outline-none focus:border-[#006FBF]/40 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Service / Department Category</label>
                <select
                  value={newServiceType}
                  onChange={(e) => setNewServiceType(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 font-medium text-slate-700 outline-none focus:border-[#006FBF]/40 focus:bg-white"
                >
                  <option value="Finance">Finance & Fee Gateways</option>
                  <option value="Academics">Academics & LMS</option>
                  <option value="Hardware">Hardware / Biometrics</option>
                  <option value="Communication">Communication / SMS</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Access Scope Permissions</label>
                <div className="rounded-xl border border-slate-200 p-3 space-y-2 bg-slate-50/50">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#006FBF]" />
                    <span>Read access to core records (`:read`)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                    <input type="checkbox" className="rounded border-slate-300 text-[#006FBF]" />
                    <span>Write and modify records (`:write`)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                    <input type="checkbox" className="rounded border-slate-300 text-[#006FBF]" />
                    <span>Webhook management endpoints (`webhooks:manage`)</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (newTokenName.trim()) {
                    const newKey: ApiKey = {
                      id: `KEY-00${keys.length + 1}`,
                      name: newTokenName,
                      service: newServiceType,
                      prefix: `elx_live_${Math.random().toString(36).substring(2, 6)}...`,
                      scopes: ['core:read', 'records:write'],
                      lastUsed: 'Never',
                      status: 'Active',
                      createdAt: 'Just now',
                    };
                    setKeys([newKey, ...keys]);
                    setNewTokenName('');
                    setIsModalOpen(false);
                  }
                }}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-95"
                style={{
                  background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})`,
                }}
              >
                Generate Token
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}