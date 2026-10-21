// apps/web/app/dashboard/parents/families/page.tsx
'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';

interface SiblingChild {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  gender: string;
  enrollmentStatus: string;
}

interface FamilyRecord {
  id: string;
  familyName: string;
  emergencyContact?: string;
  createdAt?: string;
  siblings: SiblingChild[];
}

export default function FamilyDirectoryPage() {
  const [families, setFamilies] = useState<FamilyRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const fetchFamilies = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/parents/families`, {
        headers: getHeaders(),
      });

      if (res.ok) {
        const json = await res.json();
        setFamilies(Array.isArray(json.data) ? json.data : []);
      } else {
        setError('Failed to fetch family records from database.');
      }
    } catch (err: any) {
      console.error('Error fetching families:', err);
      setError('Unable to reach the backend server.');
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchFamilies();
  }, [fetchFamilies]);

  // Filter logic
  const filteredFamilies = useMemo(() => {
    return families.filter((fam) => {
      const q = searchQuery.toLowerCase();
      const matchesName = fam.familyName.toLowerCase().includes(q);
      const matchesChild = fam.siblings.some(
        (s) =>
          `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
          String(s.admissionNumber || '').toLowerCase().includes(q)
      );
      return matchesName || matchesChild;
    });
  }, [families, searchQuery]);

  const kpis = useMemo(() => {
    const totalFamilies = families.length;
    const multiChildFamilies = families.filter((f) => f.siblings.length > 1).length;
    const totalChildrenLinked = families.reduce((acc, f) => acc + f.siblings.length, 0);
    return { totalFamilies, multiChildFamilies, totalChildrenLinked };
  }, [families]);

  return (
    <div className="flex-1 w-full min-w-0 bg-[#f4f7fb] min-h-screen p-4 sm:p-6 lg:p-8 font-sans overflow-x-hidden text-[#042954]">
      
      {/* Page Header */}
      <div className="mb-6 lg:mb-8 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-extrabold text-[#042954] mb-1 tracking-tight">
            Family & Sibling Groups
          </h1>
          <p className="text-[12px] text-[#64748b]">
            Manage household groupings, view sibling relationships, and coordinate family-wide communications.
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
            onClick={fetchFamilies}
            className="h-[38px] px-4 rounded-xl bg-gradient-to-r from-[#042954] to-[#0ea5e9] text-white text-[12px] font-semibold hover:opacity-95 transition-all shadow-md shadow-sky-500/20 flex items-center justify-center"
          >
            <i className="fa-solid fa-rotate mr-2 text-xs"></i> Refresh Families
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800 flex items-center justify-between">
          <span><i className="fa-solid fa-triangle-exclamation mr-2"></i>{error}</span>
          <button onClick={() => setError(null)} className="font-bold underline">Dismiss</button>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 w-full">
        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Total Families</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">
              {isLoading ? '...' : kpis.totalFamilies.toLocaleString()}
            </h3>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Registered in database</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-sky-50 text-[#0ea5e9] flex items-center justify-center shrink-0">
            <i className="fa-solid fa-people-roof text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Multi-Child Households</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">
              {isLoading ? '...' : kpis.multiChildFamilies.toLocaleString()}
            </h3>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Families with 2+ siblings</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-teal-50 text-[#06b6d4] flex items-center justify-center shrink-0">
            <i className="fa-solid fa-child-reaching text-lg"></i>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center justify-between border border-[#e2e8f0] shadow-sm">
          <div>
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mb-1">Total Linked Children</p>
            <h3 className="text-[24px] font-extrabold text-[#042954]">
              {isLoading ? '...' : kpis.totalChildrenLinked.toLocaleString()}
            </h3>
            <span className="text-[11px] text-[#0ea5e9] font-semibold mt-1 block">Assigned to family units</span>
          </div>
          <div className="h-[52px] w-[52px] rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-graduation-cap text-lg"></i>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#e2e8f0] mb-6 w-full flex items-center justify-between">
        <div className="relative w-full md:w-[380px]">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[12px]"></i>
          <input
            type="text"
            placeholder="Search family name or student name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[40px] pl-9 pr-3 rounded-xl border border-[#cbd5e1] text-[12px] font-medium text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9]"
          />
        </div>
      </div>

      {/* Families Data Table */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                <th className="py-3.5 px-5">Family Name / ID</th>
                <th className="py-3.5 px-5">Emergency Contact</th>
                <th className="py-3.5 px-5">Linked Siblings (Children)</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-[#64748b]">
                    <i className="fa-solid fa-circle-notch animate-spin mr-2 text-[#0ea5e9]"></i>
                    Loading family records from database...
                  </td>
                </tr>
              ) : filteredFamilies.length > 0 ? (
                filteredFamilies.map((fam) => (
                  <tr key={fam.id} className="hover:bg-slate-50/75 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-bold text-[#042954] text-[14px]">{fam.familyName}</div>
                      <div className="text-[11px] text-[#64748b] font-mono mt-0.5">{fam.id}</div>
                    </td>
                    <td className="py-4 px-5 text-slate-700 font-mono text-[12px]">
                      {fam.emergencyContact || 'Not specified'}
                    </td>
                    <td className="py-4 px-5">
                      {fam.siblings.length > 0 ? (
                        <div className="space-y-1.5">
                          {fam.siblings.map((child) => (
                            <div key={child.id} className="flex items-center gap-2 text-[12px]">
                              <span className="h-2 w-2 rounded-full bg-[#0ea5e9]"></span>
                              <span className="font-bold text-[#042954]">
                                {child.firstName} {child.lastName}
                              </span>
                              <span className="text-[11px] font-mono text-[#64748b]">
                                ({child.admissionNumber})
                              </span>
                              <span className="px-2 py-0.5 rounded bg-sky-50 text-[#0ea5e9] text-[10px] font-semibold">
                                {child.enrollmentStatus || 'Active'}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[11px] text-amber-600 font-medium">No students linked to this family</span>
                      )}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <Link
                        href={`/dashboard/parents`}
                        className="h-[32px] px-3 rounded-lg bg-sky-50 text-[#0ea5e9] hover:bg-sky-100 font-semibold text-[12px] transition-colors inline-flex items-center"
                      >
                        Manage Family
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-[#64748b] text-[13px]">
                    No family records found.
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