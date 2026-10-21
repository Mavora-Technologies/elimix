// apps/web/app/dashboard/reports/students/enrollment/page.tsx
'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';

interface ClassEnrollmentItem {
  id: string;
  className: string;
  classTeacher: string;
  capacity: number;
  enrolled: number;
  boys: number;
  girls: number;
  vacancies: number;
  status: 'optimal' | 'full' | 'under-enrolled';
}

interface EnrollmentData {
  stats: {
    totalStudents: number;
    newAdmissions: number;
    boysCount: number;
    girlsCount: number;
    averageClassSize: number;
    totalStreams: number;
  };
  classEnrollment: ClassEnrollmentItem[];
}

export default function StudentEnrollmentReportPage() {
  const [data, setData] = useState<EnrollmentData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [academicYear, setAcademicYear] = useState('2026');
  const [statusFilter, setStatusFilter] = useState('all');
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

  const fetchReport = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/reports/enrollment`, {
        headers: getHeaders(),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
        }
      } else {
        setError('Failed to synchronize enrollment analytics from database.');
      }
    } catch (err: any) {
      console.error('Error fetching enrollment report:', err);
      setError('Unable to reach the backend server.');
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  // Filtered class list
  const filteredClasses = useMemo(() => {
    if (!data?.classEnrollment) return [];
    return data.classEnrollment.filter((cls) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        cls.className.toLowerCase().includes(q) ||
        cls.classTeacher.toLowerCase().includes(q) ||
        cls.id.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'all' || cls.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [data?.classEnrollment, searchQuery, statusFilter]);

  const genderRatioText = useMemo(() => {
    if (!data?.stats) return '0% M / 0% F';
    const total = data.stats.totalStudents;
    if (total === 0) return '0% M / 0% F';
    const mPct = Math.round((data.stats.boysCount / total) * 100);
    const fPct = 100 - mPct;
    return `${mPct}% M / ${fPct}% F`;
  }, [data?.stats]);

  return (
    <div className="flex w-full flex-col gap-6 p-4 sm:p-6 lg:p-8 font-sans bg-[#f4f7fb] min-h-screen text-[#042954]">
      
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <Link href="/dashboard" className="hover:text-[#006FBF]">Dashboard</Link>
          <i className="fa-solid fa-chevron-right text-[10px] text-slate-400" />
          <Link href="/dashboard/reports" className="hover:text-[#006FBF]">Reports & Analytics</Link>
          <i className="fa-solid fa-chevron-right text-[10px] text-slate-400" />
          <span className="text-slate-900 font-semibold">Student Enrollment</span>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#042954]">
              Student Enrollment Report
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Live database analytics for student populations, class capacities, and gender distributions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={fetchReport}
              className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-xs font-semibold text-[#042954] shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-all"
            >
              <i className={`fa-solid fa-rotate mr-2 ${isLoading ? 'animate-spin text-[#0ea5e9]' : 'text-slate-400'}`} />
              Refresh Analytics
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#042954] to-[#0ea5e9] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:opacity-95"
            >
              <i className="fa-solid fa-file-pdf mr-2" />
              Download Report PDF
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800 flex items-center justify-between">
          <span><i className="fa-solid fa-triangle-exclamation mr-2"></i>{error}</span>
          <button onClick={fetchReport} className="font-bold underline">Retry</button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Enrolled</p>
              <h3 className="mt-2 text-2xl font-extrabold text-[#042954]">
                {isLoading ? '...' : (data?.stats.totalStudents ?? 0).toLocaleString()}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-[#0ea5e9] shadow-inner">
              <i className="fa-solid fa-users text-lg" />
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500">Across {data?.stats.totalStreams || 0} active classes</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">New Admissions</p>
              <h3 className="mt-2 text-2xl font-extrabold text-[#042954]">
                {isLoading ? '...' : (data?.stats.newAdmissions ?? 0).toLocaleString()}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shadow-inner">
              <i className="fa-solid fa-user-plus text-lg" />
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500">Admitted in current academic cycle</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Gender Distribution</p>
              <h3 className="mt-2 text-xl font-extrabold text-[#042954]">
                {isLoading ? '...' : genderRatioText}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 shadow-inner">
              <i className="fa-solid fa-venus-mars text-lg" />
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            {data?.stats.boysCount || 0} Boys, {data?.stats.girlsCount || 0} Girls
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Average Class Size</p>
              <h3 className="mt-2 text-2xl font-extrabold text-[#042954]">
                {isLoading ? '...' : data?.stats.averageClassSize ?? 0}
              </h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 shadow-inner">
              <i className="fa-solid fa-chair text-lg" />
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500">Standard institutional capacity is 40</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Academic Year</label>
            <select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="rounded-xl border border-slate-200 py-2 pl-3 pr-8 text-xs font-semibold text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9]"
            >
              <option value="2026">2026 Academic Year</option>
              <option value="2025">2025 Academic Year</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Capacity Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 py-2 pl-3 pr-8 text-xs font-semibold text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9]"
            >
              <option value="all">All Capacities</option>
              <option value="full">Full / Over-Enrolled</option>
              <option value="optimal">Optimal</option>
              <option value="under-enrolled">Under-Enrolled</option>
            </select>
          </div>
        </div>

        <div className="relative w-full lg:w-72">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
          <input
            type="text"
            placeholder="Search class name or teacher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[40px] pl-9 pr-3 rounded-xl border border-slate-200 text-xs font-medium text-[#042954] bg-[#f8fafc] focus:outline-none focus:border-[#0ea5e9]"
          />
        </div>
      </div>

      {/* Class-Level Enrollment Table */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-[#042954]">Class & Stream Roster Breakdown</h2>
          <span className="text-xs font-semibold text-slate-500">Showing {filteredClasses.length} records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-[#f8fafc]">
              <tr>
                <th className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">Class / Stream</th>
                <th className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">Class Teacher</th>
                <th className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">Enrolled / Capacity</th>
                <th className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">Gender Split</th>
                <th className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">Vacancies</th>
                <th className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">Status</th>
                <th className="relative px-6 py-3.5 text-right"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-[13px]">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <i className="fa-solid fa-circle-notch animate-spin mr-2 text-[#0ea5e9]" />
                    Loading live class rosters from database...
                  </td>
                </tr>
              ) : filteredClasses.length > 0 ? (
                filteredClasses.map((cls) => {
                  const pct = Math.min(Math.round((cls.enrolled / cls.capacity) * 100), 100);
                  return (
                    <tr key={cls.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-sky-50 text-xs font-bold text-[#0ea5e9]">
                            {cls.className.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#042954]">{cls.className}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{cls.id}</p>
                          </div>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-700">
                        {cls.classTeacher}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="font-extrabold text-[#042954]">{cls.enrolled}</span>
                        <span className="text-slate-400"> / {cls.capacity}</span>
                        <div className="mt-1 h-1 w-24 overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full bg-[#0ea5e9]" style={{ width: `${pct}%` }} />
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-2 text-xs font-semibold">
                          <span className="text-indigo-600">B: {cls.boys}</span>
                          <span className="text-slate-300">|</span>
                          <span className="text-rose-600">G: {cls.girls}</span>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4">
                        <span className={`text-sm font-bold ${cls.vacancies === 0 ? 'text-slate-400' : 'text-emerald-600'}`}>
                          {cls.vacancies} open
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4">
                        {cls.status === 'optimal' && (
                          <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                            Optimal
                          </span>
                        )}
                        {cls.status === 'full' && (
                          <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-[11px] font-bold text-amber-700 border border-amber-200">
                            Full
                          </span>
                        )}
                        {cls.status === 'under-enrolled' && (
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600 border border-slate-200">
                            Under-enrolled
                          </span>
                        )}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <Link
                          href={`/dashboard/students?grade=${cls.id}`}
                          className="inline-flex items-center rounded-xl bg-sky-50 px-3.5 py-1.5 text-xs font-semibold text-[#0ea5e9] hover:bg-sky-100 transition-all"
                        >
                          <i className="fa-solid fa-eye mr-1.5" /> View Roster
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 text-[13px]">
                    No matching class enrollment records found.
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