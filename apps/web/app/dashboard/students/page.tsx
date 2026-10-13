// apps/web/app/dashboard/students/page.tsx
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

// Dynamic API URL for Local/Production compatibility
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

interface Student {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  gender: 'Male' | 'Female' | 'Other';
  enrollmentStatus: string;
  classGrade?: string;
  stream?: string;
  guardianName?: string;
  guardianPhone?: string;
  feeStatus?: 'Paid' | 'Partial' | 'Overdue';
}

export default function StudentDirectoryPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('All');
  const [genderFilter, setGenderFilter] = useState('All');

  useEffect(() => {
    async function fetchStudents() {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('elimix_token');
        const userJson = localStorage.getItem('elimix_user');
        const tenantId = userJson ? JSON.parse(userJson).tenantId : '';
        const activeTenantId = tenantId || '00000000-0000-0000-0000-000000000000';

        const headers: Record<string, string> = {
          'Authorization': `Bearer ${token}`,
          'x-tenant-id': activeTenantId,
        };

        const res = await fetch(`${API_BASE_URL}/students`, { headers });
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || 'Failed to fetch student records.');

        setStudents(result.data || []);
      } catch (err: any) {
        setError(err.message || 'An error occurred while connecting to the server.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchStudents();
  }, []);

  const filteredStudents = students.filter((student) => {
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
    const admissionNo = (student.admissionNumber || '').toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || admissionNo.includes(searchQuery.toLowerCase());
    
    const streamName = student.stream ? `${student.classGrade} ${student.stream}` : student.classGrade || 'Unassigned';
    const matchesClass = classFilter === 'All' || streamName === classFilter;
    const matchesGender = genderFilter === 'All' || student.gender === genderFilter;

    return matchesSearch && matchesClass && matchesGender;
  });

  const uniqueClasses = Array.from(new Set(students.map(s => s.stream ? `${s.classGrade} ${s.stream}` : s.classGrade || 'Unassigned'))).sort();
  
  const getStatusBadge = (status: string) => {
    if (!status) return 'bg-emerald-50/80 text-emerald-700 ring-1 ring-inset ring-emerald-600/20';
    const normalized = status.toLowerCase();
    if (normalized.includes('admitted') || normalized.includes('active')) return 'bg-emerald-50/80 text-emerald-700 ring-1 ring-inset ring-emerald-600/20';
    if (normalized.includes('pending') || normalized.includes('review')) return 'bg-amber-50/80 text-amber-700 ring-1 ring-inset ring-amber-600/20';
    return 'bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-200';
  };

  const getInitials = (first: string, last: string) => `${first?.charAt(0) || ''}${last?.charAt(0) || ''}`.toUpperCase();

  return (
    <div className="space-y-6 pb-12 w-full max-w-full overflow-hidden">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1 truncate">
            <Link href="/dashboard" className="hover:text-[#006FBF] transition-colors">Dashboard</Link>
            <i className="fa-solid fa-chevron-right text-[10px]" />
            <span className="text-slate-900 truncate">Students</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 truncate">Student Directory</h1>
          <p className="text-xs text-slate-500 mt-0.5 truncate">View, manage, and search all currently enrolled students.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <Link href="/dashboard/students/admissions" className="inline-flex justify-center items-center rounded-xl bg-white border border-slate-200 px-4 py-2.5 sm:py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 w-full sm:w-auto">
            <i className="fa-solid fa-user-plus mr-2 text-[#006FBF]"></i> View Admissions
          </Link>
          <Link href="/dashboard/students/new" className="inline-flex justify-center items-center rounded-xl px-4 py-2.5 sm:py-2 text-xs font-semibold text-white shadow-sm transition-all hover:opacity-95 w-full sm:w-auto" style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})` }}>
            <i className="fa-solid fa-plus text-[10px] mr-2"></i> Add Student
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
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">Total Enrolled</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{students.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider truncate">Boys</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{students.filter(s => s.gender === 'Male').length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wider truncate">Girls</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{students.filter(s => s.gender === 'Female').length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider truncate">Active Classes</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{uniqueClasses.length}</p>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm">
        <div className="relative flex min-w-0 flex-1 items-center w-full">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 text-xs text-slate-400"></i>
          <input type="text" placeholder="Search student name or admission no..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-4 py-2.5 sm:py-2 text-xs text-slate-800 outline-none focus:border-[#006FBF]/40 focus:bg-white" />
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
          <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} className="w-full sm:w-auto rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 sm:py-2 text-xs font-medium text-slate-700 outline-none focus:border-[#006FBF]/40 focus:bg-white appearance-none pr-8">
            <option value="All">All Classes & Streams</option>
            {uniqueClasses.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)} className="w-full sm:w-auto rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 sm:py-2 text-xs font-medium text-slate-700 outline-none focus:border-[#006FBF]/40 focus:bg-white appearance-none pr-8">
            <option value="All">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden lg:block rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[1000px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 pl-5 pr-3 w-1/3">Student Name & ID</th>
                <th className="py-4 px-4 w-[20%]">Class & Stream</th>
                <th className="py-4 px-4 w-[15%]">Gender</th>
                <th className="py-4 px-4 w-[15%]">Status</th>
                <th className="py-4 pl-3 pr-5 text-right w-[15%]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={5} className="py-12 text-center text-slate-500"><i className="fa-solid fa-spinner animate-spin mr-2 text-[#006FBF]"></i>Loading students...</td></tr>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/40 transition-colors text-xs group">
                    <td className="py-4 pl-5 pr-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-bold border border-slate-200/80 flex-shrink-0">
                          {getInitials(student.firstName, student.lastName)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 truncate max-w-[200px]">{student.firstName} {student.lastName}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">{student.admissionNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-slate-700">{student.classGrade || 'Unassigned'}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{student.stream || 'No Stream'}</div>
                    </td>
                    <td className="py-4 px-4 text-slate-600 font-medium">
                      {student.gender === 'Male' && <i className="fa-solid fa-mars text-blue-500 mr-1.5 w-3 text-center"></i>}
                      {student.gender === 'Female' && <i className="fa-solid fa-venus text-rose-500 mr-1.5 w-3 text-center"></i>}
                      {student.gender}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold ${getStatusBadge(student.enrollmentStatus)}`}>
                        {student.enrollmentStatus || 'Admitted'}
                      </span>
                    </td>
                    <td className="py-4 pl-3 pr-5 text-right">
                      <Link href={`/dashboard/students/${student.id}`} className="rounded-lg bg-slate-50 px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-[#006FBF] hover:text-white transition-colors border border-slate-200/60 shadow-sm inline-flex items-center gap-1.5">
                        View Profile <i className="fa-solid fa-arrow-right text-[9px]"></i>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="py-12 text-center text-slate-400 text-xs">No matching students found in the database.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE & TABLET CARDS VIEW */}
      <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200/80 shadow-sm"><i className="fa-solid fa-spinner animate-spin mr-2"></i>Loading...</div>
        ) : filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <div key={student.id} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col gap-4 min-w-0">
              <div className="flex justify-between items-start gap-2 min-w-0">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-500 font-bold border border-slate-200/80 flex-shrink-0">
                    {getInitials(student.firstName, student.lastName)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-semibold text-slate-900 block truncate text-sm">{student.firstName} {student.lastName}</span>
                    <span className="font-mono text-[10px] font-semibold text-slate-500 block mt-0.5">{student.admissionNumber}</span>
                  </div>
                </div>
                <span className={`inline-flex flex-shrink-0 items-center px-2 py-0.5 rounded-md text-[9px] font-bold ${getStatusBadge(student.enrollmentStatus)}`}>
                  {student.enrollmentStatus || 'Admitted'}
                </span>
              </div>

              <div className="text-xs text-slate-600 space-y-2 pt-3 border-t border-slate-100 min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <i className="fa-solid fa-layer-group text-slate-400 w-4 text-center flex-shrink-0" />
                  <span className="truncate flex-1 font-medium text-slate-700">{student.classGrade || 'Unassigned'} <span className="text-slate-400">({student.stream || 'No stream'})</span></span>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <i className={`fa-solid ${student.gender === 'Male' ? 'fa-mars text-blue-400' : student.gender === 'Female' ? 'fa-venus text-rose-400' : 'fa-user'} w-4 text-center flex-shrink-0`} />
                  <span className="truncate flex-1 text-slate-600">{student.gender}</span>
                </div>
              </div>

              <div className="pt-2">
                <Link href={`/dashboard/students/${student.id}`} className="w-full flex justify-center items-center gap-1.5 rounded-xl bg-slate-50 px-2 py-2.5 text-xs font-semibold text-slate-700 hover:bg-[#006FBF] hover:text-white transition-colors border border-slate-200/60 shadow-sm">
                  View Student Profile <i className="fa-solid fa-arrow-right text-[10px]"></i>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200/80 shadow-sm text-sm">No students found.</div>
        )}
      </div>
    </div>
  );
}