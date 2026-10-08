// apps/web/app/dashboard/students/admissions/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const BRAND = {
  navy: '#012E54',
  blue: '#006FBF',
  brightBlue: '#0088CE',
  cyan: '#04B1D6',
  teal: '#0199B9',
};

// TypeScript interface aligned with backend schema mapping
interface Applicant {
  id: string;
  applicantName: string;
  admissionNo: string;
  gradeApplying: string;
  guardianName: string;
  guardianEmail: string;
  submissionDate: string;
  status: string;
}

export default function AdmissionsPage() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  useEffect(() => {
    async function fetchApplicants() {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('elimix_token');
        const userJson = localStorage.getItem('elimix_user');
        const tenantId = userJson ? JSON.parse(userJson).tenantId : '';
        const activeTenantId = tenantId || '00000000-0000-0000-0000-000000000000';

        const res = await fetch('http://localhost:3001/api/v1/students', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-tenant-id': activeTenantId,
          },
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.message || 'Failed to fetch admissions data.');

        const mappedApplicants = (result.data || []).map((student: any) => ({
          id: student.id,
          applicantName: `${student.firstName} ${student.lastName}`,
          admissionNo: student.admissionNumber,
          gradeApplying: student.classGrade || 'Unassigned',
          guardianName: student.guardianName || 'Pending Assignment',
          guardianEmail: student.guardianEmail || 'N/A',
          submissionDate: new Date(student.createdAt).toISOString().split('T')[0],
          status: student.enrollmentStatus || 'Pending',
        }));

        setApplicants(mappedApplicants);
      } catch (err: any) {
        setError(err.message || 'An error occurred while connecting to the server.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchApplicants();
  }, []);

  const filteredApplicants = applicants.filter((app) => {
    const matchesSearch = app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) || app.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()) || app.guardianName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const normalized = status.toLowerCase();
    if (normalized.includes('pending')) return 'bg-amber-50/80 text-amber-700 ring-1 ring-inset ring-amber-600/20';
    if (normalized.includes('review')) return 'bg-blue-50/80 text-blue-700 ring-1 ring-inset ring-blue-600/20';
    if (normalized.includes('admit') || normalized.includes('approv') || normalized.includes('enroll')) return 'bg-emerald-50/80 text-emerald-700 ring-1 ring-inset ring-emerald-600/20';
    if (normalized.includes('reject')) return 'bg-rose-50/80 text-rose-700 ring-1 ring-inset ring-rose-600/20';
    return 'bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-200';
  };

  const getInitials = (name: string) => name ? name.replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.)\s+/i, '').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'A';

  return (
    <div className="space-y-6 pb-12 w-full max-w-full overflow-hidden">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1 truncate">
            <Link href="/dashboard" className="hover:text-[#006FBF] transition-colors">Dashboard</Link>
            <i className="fa-solid fa-chevron-right text-[10px]" />
            <Link href="/dashboard/students" className="hover:text-[#006FBF] transition-colors">Students</Link>
            <i className="fa-solid fa-chevron-right text-[10px]" />
            <span className="text-slate-900 truncate">Admissions</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 truncate">Admissions & Enrollment</h1>
          <p className="text-xs text-slate-500 mt-0.5 truncate">Manage incoming student registrations, evaluations, and onboarding.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link href="/dashboard/students/new" className="flex w-full sm:w-auto h-9 items-center justify-center gap-2 rounded-xl px-5 text-xs font-semibold text-white shadow-sm hover:opacity-95 transition-all" style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})` }}>
            <i className="fa-solid fa-plus text-[10px]"></i><span>New Application</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-rose-800 text-sm flex items-center shadow-sm">
          <i className="fa-solid fa-triangle-exclamation text-rose-600 mr-2 text-base"></i><span>{error}</span>
        </div>
      )}

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">Total Applications</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{applicants.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider truncate">Pending Review</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{applicants.filter(a => a.status === 'Pending').length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider truncate">Approved / Admitted</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{applicants.filter(a => ['Approved', 'Admitted', 'Enrolled'].includes(a.status)).length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider truncate">Rejected</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{applicants.filter(a => a.status === 'Rejected').length}</p>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm">
        <div className="relative flex min-w-0 flex-1 items-center w-full max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 text-xs text-slate-400"></i>
          <input type="text" placeholder="Search applicant, admission no, or guardian..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-4 py-2.5 sm:py-2 text-xs text-slate-800 outline-none focus:border-[#006FBF]/40 focus:bg-white" />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 hide-scrollbar w-full md:w-auto">
          {['All', 'Pending', 'Under Review', 'Admitted', 'Enrolled', 'Rejected'].map((status) => (
            <button key={status} onClick={() => setStatusFilter(status)} className={`px-4 py-2 sm:py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${statusFilter === status ? 'bg-white shadow-sm border border-slate-200 text-[#006FBF]' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden lg:block rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[1000px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 pl-5 pr-3 w-[25%]">Applicant & ID</th>
                <th className="py-4 px-4 w-[15%]">Target Grade</th>
                <th className="py-4 px-4 w-[25%]">Guardian Details</th>
                <th className="py-4 px-4 w-[10%]">Submitted</th>
                <th className="py-4 px-4 w-[10%]">Status</th>
                <th className="py-4 pl-3 pr-5 text-right w-[15%]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={6} className="py-12 text-center text-slate-500"><i className="fa-solid fa-spinner animate-spin mr-2 text-[#006FBF]"></i>Loading applications...</td></tr>
              ) : filteredApplicants.length > 0 ? (
                filteredApplicants.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/40 transition-colors text-xs group">
                    <td className="py-4 pl-5 pr-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-bold border border-slate-200/80 flex-shrink-0">
                          {getInitials(app.applicantName)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 truncate max-w-[200px]">{app.applicantName}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">{app.admissionNo}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-700">{app.gradeApplying}</td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-slate-700 truncate max-w-[180px]">{app.guardianName}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[180px] mt-0.5">{app.guardianEmail}</div>
                    </td>
                    <td className="py-4 px-4 text-slate-500 font-mono">{app.submissionDate}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold ${getStatusBadge(app.status)}`}>{app.status}</span>
                    </td>
                    <td className="py-4 pl-3 pr-5 text-right">
                      <Link href={`/dashboard/students/${app.id}`} className="rounded-lg bg-slate-50 px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-[#006FBF] hover:text-white transition-colors border border-slate-200/60 shadow-sm inline-flex items-center gap-1.5">
                        Review <i className="fa-solid fa-arrow-right text-[9px]"></i>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} className="py-12 text-center text-slate-400 text-xs">No matching admissions found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE & TABLET CARDS VIEW */}
      <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200/80 shadow-sm"><i className="fa-solid fa-spinner animate-spin mr-2"></i>Loading...</div>
        ) : filteredApplicants.length > 0 ? (
          filteredApplicants.map((app) => (
            <div key={app.id} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col gap-4 min-w-0">
              <div className="flex justify-between items-start gap-2 min-w-0">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-500 font-bold border border-slate-200/80 flex-shrink-0">
                    {getInitials(app.applicantName)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-semibold text-slate-900 block truncate text-sm">{app.applicantName}</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-slate-400 font-mono">{app.admissionNo}</span>
                      <span className="text-[10px] text-slate-300">•</span>
                      <span className="text-[10px] font-medium text-slate-500 truncate">{app.gradeApplying}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-2 pt-3 border-t border-slate-100 min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <i className="fa-solid fa-user-shield text-slate-400 w-4 text-center flex-shrink-0" />
                  <span className="truncate flex-1 font-medium text-slate-700">{app.guardianName}</span>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <i className="fa-solid fa-envelope text-slate-400 w-4 text-center flex-shrink-0" />
                  <span className="truncate flex-1 text-slate-500">{app.guardianEmail}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                <span className="font-mono text-[10px] text-slate-400">{app.submissionDate}</span>
                <span className={`inline-flex flex-shrink-0 items-center px-2 py-0.5 rounded-md text-[9px] font-bold ${getStatusBadge(app.status)}`}>{app.status}</span>
              </div>

              <div className="pt-2">
                <Link href={`/dashboard/students/${app.id}`} className="w-full flex justify-center items-center gap-1.5 rounded-xl bg-slate-50 px-2 py-2.5 text-xs font-semibold text-slate-700 hover:bg-[#006FBF] hover:text-white transition-colors border border-slate-200/60 shadow-sm">
                  Review Application <i className="fa-solid fa-arrow-right text-[10px]"></i>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200/80 shadow-sm text-sm">No applications found.</div>
        )}
      </div>
    </div>
  );
}