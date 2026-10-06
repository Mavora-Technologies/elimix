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

type Role = {
  id: string;
  name: string;
  slug: string;
  description: string;
  userCount: number;
  isSystem: boolean;
  scope: 'Global' | 'Campus' | 'Department';
  modules: string[];
};

const INITIAL_ROLES: Role[] = [
  {
    id: 'role-1',
    name: 'Super Administrator',
    slug: 'super-admin',
    description: 'Complete unconstrained access to all modules, system configurations, and subscription billing.',
    userCount: 2,
    isSystem: true,
    scope: 'Global',
    modules: ['All Modules (Full Access)'],
  },
  {
    id: 'role-2',
    name: 'School Principal / Head',
    slug: 'principal',
    description: 'High-level operational overview including staff performance, academic reports, and disciplinary logs.',
    userCount: 1,
    isSystem: true,
    scope: 'Global',
    modules: ['Academics', 'HR', 'Reports', 'Student Management'],
  },
  {
    id: 'role-3',
    name: 'School Bursar / Finance',
    slug: 'bursar',
    description: 'Manages fee structures, invoicing, payment reconciliations, and financial reporting.',
    userCount: 3,
    isSystem: false,
    scope: 'Global',
    modules: ['Finance & Fees', 'Procurement', 'Financial Reports'],
  },
  {
    id: 'role-4',
    name: 'Head of Teacher Staff',
    slug: 'head-teacher',
    description: 'Oversees timetables, lesson plans, exam mark entries, and teacher directory records.',
    userCount: 12,
    isSystem: false,
    scope: 'Department',
    modules: ['Academics & Teachers', 'Examinations', 'E-Learning'],
  },
  {
    id: 'role-5',
    name: 'Hostel Warden',
    slug: 'hostel-warden',
    description: 'Manages boarding student allocations, room beds, hostel attendance, and welfare incidents.',
    userCount: 4,
    isSystem: false,
    scope: 'Campus',
    modules: ['Hostel & Boarding', 'Operational Reports'],
  },
];

export default function RolesPermissionsPage() {
  const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* ==================================================================
         PAGE HEADER
         ================================================================== */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white shadow-sm"
              style={{
                background: `linear-gradient(135deg, ${BRAND.navy}, ${BRAND.blue})`,
              }}
            >
              <i className="fa-solid fa-shield-halved text-sm" />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Roles & Permissions
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Configure system security roles, access scopes, and granular module permissions.
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

          <button
            type="button"
            onClick={() => {
              setSelectedRole(null);
              setIsEditModalOpen(true);
            }}
            className="inline-flex items-center rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:opacity-95"
            style={{
              background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})`,
            }}
          >
            <i className="fa-solid fa-plus mr-2" />
            Create Custom Role
          </button>
        </div>
      </div>

      {/* ==================================================================
         METRICS OVERVIEW
         ================================================================== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Total Roles
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{roles.length}</p>
          <span className="mt-2 inline-block text-[11px] font-medium text-emerald-600">
            <i className="fa-solid fa-check-circle mr-1" /> All systems secured
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            System Locked Roles
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {roles.filter((r) => r.isSystem).length}
          </p>
          <span className="mt-2 inline-block text-[11px] font-medium text-slate-500">
            Protected core definitions
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Custom Configured Roles
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {roles.filter((r) => !r.isSystem).length}
          </p>
          <span className="mt-2 inline-block text-[11px] font-medium text-[#006FBF]">
            Tailored for school branches
          </span>
        </div>
      </div>

      {/* ==================================================================
         SEARCH & FILTER BAR
         ================================================================== */}
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm">
        <div className="relative flex min-w-0 flex-1 items-center">
          <i className="fa-solid fa-magnifying-glass absolute left-3 text-xs text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search roles by name or description..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-4 text-xs text-slate-700 outline-none transition-all focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10"
          />
        </div>
      </div>

      {/* ==================================================================
         ROLES LIST / TABLE
         ================================================================== */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 pl-4 pr-3">Role Name</th>
                <th className="px-3 py-3">Description</th>
                <th className="px-3 py-3">Scope</th>
                <th className="px-3 py-3">Assigned Users</th>
                <th className="px-3 py-3">Accessible Modules</th>
                <th className="py-3 pl-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredRoles.map((role) => (
                <tr key={role.id} className="transition-colors hover:bg-slate-50/50">
                  <td className="py-3 pl-4 pr-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-white"
                        style={{
                          background: role.isSystem
                            ? `linear-gradient(135deg, ${BRAND.navy}, ${BRAND.blue})`
                            : `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})`,
                        }}
                      >
                        <i
                          className={`fa-solid ${
                            role.isSystem ? 'fa-lock' : 'fa-user-gear'
                          } text-[11px]`}
                        />
                      </span>
                      <div>
                        <span className="font-semibold text-slate-900">{role.name}</span>
                        {role.isSystem && (
                          <span className="ml-2 inline-flex items-center rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-medium text-slate-600">
                            System
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="max-w-xs px-3 py-3 text-slate-500 truncate">
                    {role.description}
                  </td>

                  <td className="px-3 py-3">
                    <span className="inline-flex items-center rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                      {role.scope}
                    </span>
                  </td>

                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1.5 font-medium text-slate-700">
                      <i className="fa-solid fa-users text-[10px] text-slate-400" />
                      {role.userCount} users
                    </div>
                  </td>

                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-1">
                      {role.modules.map((mod, i) => (
                        <span
                          key={i}
                          className="rounded-md bg-[#006FBF]/10 px-2 py-0.5 text-[10px] font-medium text-[#006FBF]"
                        >
                          {mod}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="py-3 pl-3 pr-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRole(role);
                          setIsEditModalOpen(true);
                        }}
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                        title="Edit Permissions"
                      >
                        <i className="fa-solid fa-pen text-xs" />
                      </button>
                      {!role.isSystem && (
                        <button
                          type="button"
                          onClick={() => {
                            setRoles(roles.filter((r) => r.id !== role.id));
                          }}
                          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          title="Delete Role"
                        >
                          <i className="fa-solid fa-trash text-xs" />
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
    </div>
  );
}