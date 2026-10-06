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

type ACLRule = {
  id: string;
  targetName: string;
  targetType: 'Role' | 'Specific User';
  module: string;
  scope: 'Global' | 'Campus: Main' | 'Campus: North' | 'Department: Finance';
  permissions: {
    read: boolean;
    write: boolean;
    delete: boolean;
    approve: boolean;
  };
  status: 'Active' | 'Restricted' | 'Custom Override';
};

const INITIAL_RULES: ACLRule[] = [
  {
    id: 'ACL-001',
    targetName: 'School Bursar / Finance',
    targetType: 'Role',
    module: 'Finance & Fees',
    scope: 'Global',
    permissions: { read: true, write: true, delete: false, approve: true },
    status: 'Active',
  },
  {
    id: 'ACL-002',
    targetName: 'Hostel Warden',
    targetType: 'Role',
    module: 'Hostel & Boarding',
    scope: 'Campus: North',
    permissions: { read: true, write: true, delete: false, approve: false },
    status: 'Active',
  },
  {
    id: 'ACL-003',
    targetName: 'Sarah Jenkins (Assistant Bursar)',
    targetType: 'Specific User',
    module: 'Bank Reconciliation',
    scope: 'Department: Finance',
    permissions: { read: true, write: true, delete: false, approve: false },
    status: 'Custom Override',
  },
  {
    id: 'ACL-004',
    targetName: 'Head of Teacher Staff',
    targetType: 'Role',
    module: 'Examinations & Results',
    scope: 'Global',
    permissions: { read: true, write: true, delete: true, approve: true },
    status: 'Active',
  },
  {
    id: 'ACL-005',
    targetName: 'David Ochieng (Support Staff)',
    targetType: 'Specific User',
    module: 'Procurement & Stock',
    scope: 'Campus: Main',
    permissions: { read: true, write: false, delete: false, approve: false },
    status: 'Restricted',
  },
];

export default function AccessControlPage() {
  const [rules, setRules] = useState<ACLRule[]>(INITIAL_RULES);
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');

  const filteredRules = rules.filter((rule) => {
    const matchesSearch =
      rule.targetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.module.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesModule = moduleFilter === 'all' || rule.module === moduleFilter;
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
            <span className="text-slate-900">Access Control (ACL)</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Access Control Lists & Scope Rules
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Configure granular feature-level permissions and data-level scoping rules per user or role.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50"
          >
            <i className="fa-solid fa-file-export mr-2 text-slate-400" />
            Export ACL Matrix
          </button>
          <button
            type="button"
            className="inline-flex items-center rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:opacity-95"
            style={{
              background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})`,
            }}
          >
            <i className="fa-solid fa-plus mr-2" />
            Add Access Override
          </button>
        </div>
      </div>

      {/* ==================================================================
         METRICS OVERVIEW
         ================================================================== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Total Active Rules
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{rules.length}</p>
          <span className="mt-2 inline-block text-[11px] font-medium text-emerald-600">
            <i className="fa-solid fa-shield mr-1" /> Enforced globally
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Custom Overrides
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {rules.filter((r) => r.status === 'Custom Override').length}
          </p>
          <span className="mt-2 inline-block text-[11px] font-medium text-[#006FBF]">
            User-specific exceptions
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Campus Scoped Rules
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {rules.filter((r) => r.scope.includes('Campus')).length}
          </p>
          <span className="mt-2 inline-block text-[11px] font-medium text-slate-500">
            Branch-restricted data
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Restricted / Blocked
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {rules.filter((r) => r.status === 'Restricted').length}
          </p>
          <span className="mt-2 inline-block text-[11px] font-medium text-amber-600">
            Requires secondary review
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
            placeholder="Search by target entity name or module..."
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
            <option value="Finance & Fees">Finance & Fees</option>
            <option value="Hostel & Boarding">Hostel & Boarding</option>
            <option value="Bank Reconciliation">Bank Reconciliation</option>
            <option value="Examinations & Results">Examinations & Results</option>
            <option value="Procurement & Stock">Procurement & Stock</option>
          </select>
        </div>
      </div>

      {/* ==================================================================
         ACL RULES TABLE
         ================================================================== */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 pl-4 pr-3">Target Entity</th>
                <th className="px-3 py-3">Target Module</th>
                <th className="px-3 py-3">Data Scope</th>
                <th className="px-3 py-3 text-center">Read</th>
                <th className="px-3 py-3 text-center">Write</th>
                <th className="px-3 py-3 text-center">Delete</th>
                <th className="px-3 py-3 text-center">Approve</th>
                <th className="px-3 py-3">Rule Status</th>
                <th className="py-3 pl-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredRules.map((rule) => (
                <tr key={rule.id} className="transition-colors hover:bg-slate-50/50">
                  <td className="py-3 pl-4 pr-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-white"
                        style={{
                          background:
                            rule.targetType === 'Role'
                              ? `linear-gradient(135deg, ${BRAND.navy}, ${BRAND.blue})`
                              : `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})`,
                        }}
                      >
                        <i
                          className={`fa-solid ${
                            rule.targetType === 'Role' ? 'fa-user-shield' : 'fa-user'
                          } text-[11px]`}
                        />
                      </span>
                      <div>
                        <span className="font-semibold text-slate-900">{rule.targetName}</span>
                        <span className="block text-[10px] text-slate-400">{rule.targetType}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-3 py-3 font-medium text-slate-800">{rule.module}</td>

                  <td className="px-3 py-3">
                    <span className="inline-flex items-center rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                      {rule.scope}
                    </span>
                  </td>

                  {/* Permissions matrix column cells */}
                  <td className="px-3 py-3 text-center">
                    <i
                      className={`fa-solid ${
                        rule.permissions.read
                          ? 'fa-circle-check text-emerald-600'
                          : 'fa-circle-xmark text-slate-300'
                      }`}
                    />
                  </td>
                  <td className="px-3 py-3 text-center">
                    <i
                      className={`fa-solid ${
                        rule.permissions.write
                          ? 'fa-circle-check text-emerald-600'
                          : 'fa-circle-xmark text-slate-300'
                      }`}
                    />
                  </td>
                  <td className="px-3 py-3 text-center">
                    <i
                      className={`fa-solid ${
                        rule.permissions.delete
                          ? 'fa-circle-check text-emerald-600'
                          : 'fa-circle-xmark text-slate-300'
                      }`}
                    />
                  </td>
                  <td className="px-3 py-3 text-center">
                    <i
                      className={`fa-solid ${
                        rule.permissions.approve
                          ? 'fa-circle-check text-emerald-600'
                          : 'fa-circle-xmark text-slate-300'
                      }`}
                    />
                  </td>

                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                        rule.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
                          : rule.status === 'Custom Override'
                          ? 'bg-blue-50 text-[#006FBF] ring-1 ring-inset ring-[#006FBF]/20'
                          : 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20'
                      }`}
                    >
                      {rule.status}
                    </span>
                  </td>

                  <td className="py-3 pl-3 pr-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                        title="Edit Rule"
                      >
                        <i className="fa-solid fa-pen text-xs" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setRules(rules.filter((r) => r.id !== rule.id));
                        }}
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        title="Revoke Rule"
                      >
                        <i className="fa-solid fa-trash text-xs" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}