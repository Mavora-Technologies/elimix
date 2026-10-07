'use client';

import { useState, useEffect } from 'react';
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

interface Subject {
  id: string;
  name: string;
  code: string;
  departmentName: string | null;
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  useEffect(() => {
    async function fetchSubjects() {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('elimix_token');
        const userJson = localStorage.getItem('elimix_user');
        const tenantId = userJson ? JSON.parse(userJson).tenantId : '';
        const activeTenantId = tenantId || '00000000-0000-0000-0000-000000000000';

        const res = await fetch('http://localhost:3001/api/v1/academics/subjects', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-tenant-id': activeTenantId,
          },
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.message || 'Failed to fetch subjects.');
        }

        setSubjects(result.data || []);
      } catch (err: any) {
        setError(err.message || 'An error occurred while connecting to the server.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchSubjects();
  }, []);

  // Unique list of departments for filtering
  const availableDepartments = Array.from(
    new Set(subjects.map((s) => s.departmentName).filter((dept): dept is string => Boolean(dept)))
  );

  const filteredSubjects = subjects.filter((sub) => {
    const matchesSearch =
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub.departmentName && sub.departmentName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDept =
      departmentFilter === 'All' ||
      (departmentFilter === 'Unassigned' ? !sub.departmentName : sub.departmentName === departmentFilter);

    return matchesSearch && matchesDept;
  });

  const totalDepartments = new Set(subjects.map((s) => s.departmentName).filter(Boolean)).size;
  const assignedSubjectsCount = subjects.filter((s) => s.departmentName).length;
  const unassignedSubjectsCount = subjects.filter((s) => !s.departmentName).length;

  return (
    <div className="space-y-6 pb-12">
      {/* ==================================================================
         PAGE HEADER
         ================================================================== */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <Link href="/dashboard" className="hover:text-[#006FBF]">
              Dashboard
            </Link>
            <i className="fa-solid fa-chevron-right text-[10px]" />
            <Link href="/dashboard/academics" className="hover:text-[#006FBF]">
              Academics
            </Link>
            <i className="fa-solid fa-chevron-right text-[10px]" />
            <span className="text-slate-900">Subjects & Curriculum</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Subjects & Curriculum
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Manage academic subjects, course codes, and department categories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/academics/subjects/new"
            className="inline-flex items-center rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:opacity-95"
            style={{
              background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})`,
            }}
          >
            <i className="fa-solid fa-plus mr-2 text-xs" /> Add Subject
          </Link>
        </div>
      </div>

      {/* ==================================================================
         METRICS OVERVIEW
         ================================================================== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Total Subjects
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{subjects.length}</p>
          <span className="mt-2 inline-block text-[11px] font-medium text-[#006FBF]">
            <i className="fa-solid fa-book-open mr-1" /> Active courses in curriculum
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Departments
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{totalDepartments}</p>
          <span className="mt-2 inline-block text-[11px] font-medium text-emerald-600">
            <i className="fa-solid fa-building-columns mr-1" /> Academic divisions
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Assigned Subjects
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{assignedSubjectsCount}</p>
          <span className="mt-2 inline-block text-[11px] font-medium text-indigo-600">
            <i className="fa-solid fa-layer-group mr-1" /> Linked to a department
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Unassigned Subjects
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{unassignedSubjectsCount}</p>
          <span className="mt-2 inline-block text-[11px] font-medium text-amber-600">
            <i className="fa-solid fa-circle-exclamation mr-1" /> Requires categorization
          </span>
        </div>
      </div>

      {/* ==================================================================
         SEARCH & FILTER BAR
         ================================================================== */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm">
        <div className="relative flex min-w-0 flex-1 items-center">
          <i className="fa-solid fa-magnifying-glass absolute left-3 text-xs text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subject name, course code, or department..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-4 text-xs text-slate-700 outline-none transition-all focus:border-[#006FBF]/40 focus:bg-white focus:ring-2 focus:ring-[#006FBF]/10"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-[#006FBF]/40 focus:bg-white"
          >
            <option value="All">All Departments</option>
            {availableDepartments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
            <option value="Unassigned">Unassigned</option>
          </select>
        </div>
      </div>

      {/* ==================================================================
         SUBJECTS DATA TABLE
         ================================================================== */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 pl-4 pr-3">Subject Name</th>
                <th className="px-3 py-3">Course Code</th>
                <th className="px-3 py-3">Department</th>
                <th className="py-3 pl-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2 text-xs font-medium">
                      <i className="fa-solid fa-spinner animate-spin text-[#006FBF]" />
                      <span>Loading curriculum data...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-rose-600 text-xs font-medium">
                    <div className="flex items-center justify-center gap-2">
                      <i className="fa-solid fa-triangle-exclamation" />
                      <span>{error}</span>
                    </div>
                  </td>
                </tr>
              ) : filteredSubjects.length > 0 ? (
                filteredSubjects.map((sub) => (
                  <tr key={sub.id} className="transition-colors hover:bg-slate-50/60">
                    <td className="py-3 pl-4 pr-3">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#006FBF]/10 text-[#006FBF]">
                          <i className="fa-solid fa-book text-[11px]" />
                        </span>
                        <span className="font-semibold text-slate-900">{sub.name}</span>
                      </div>
                    </td>

                    <td className="px-3 py-3">
                      <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-700 border border-slate-200">
                        {sub.code}
                      </span>
                    </td>

                    <td className="px-3 py-3">
                      {sub.departmentName ? (
                        <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                          {sub.departmentName}
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                          Unassigned
                        </span>
                      )}
                    </td>

                    <td className="py-3 pl-3 pr-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/dashboard/academics/subjects/edit/${sub.id}`}
                          className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
                        >
                          <i className="fa-solid fa-pen-to-square mr-1 text-[10px] text-slate-500" />
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-500 text-xs">
                    No matching subjects found in the curriculum.
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