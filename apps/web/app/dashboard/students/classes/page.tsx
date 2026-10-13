// apps/web/app/dashboard/students/classes/page.tsx
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

// TypeScript interface matched exactly to the AcademicsService output
interface ClassStream {
  id: string;
  gradeName: string;
  streamName: string;
  classTeacher: string;
  teacherEmail: string;
  studentCount: number;
  capacity: number;
  roomNumber: string;
}

export default function ClassesStreamsPage() {
  const [classes, setClasses] = useState<ClassStream[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('All');

  const getHeaders = () => {
    const token = localStorage.getItem('elimix_token');
    const userStr = localStorage.getItem('elimix_user');
    let tenantId = '00000000-0000-0000-0000-000000000000';
    if (userStr && userStr !== 'undefined' && userStr !== 'null') {
      try { tenantId = JSON.parse(userStr).tenantId || tenantId; } catch (e) {}
    }
    return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'x-tenant-id': tenantId };
  };

  useEffect(() => {
    async function fetchClasses() {
      try {
        setIsLoading(true);
        const res = await fetch(`${API_BASE_URL}/academics/classes`, { headers: getHeaders() });
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || 'Failed to fetch class and stream records.');
        setClasses(result.data || []);
      } catch (err: any) {
        setError(err.message || 'An error occurred while connecting to the server.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchClasses();
  }, []);

  // Filter logic
  const filteredClasses = classes.filter((cls) => {
    const matchesSearch = cls.gradeName.toLowerCase().includes(searchQuery.toLowerCase()) || cls.streamName.toLowerCase().includes(searchQuery.toLowerCase()) || cls.classTeacher.toLowerCase().includes(searchQuery.toLowerCase()) || cls.roomNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = gradeFilter === 'All' || cls.gradeName === gradeFilter;
    return matchesSearch && matchesGrade;
  });

  // Dynamic KPI calculations
  const totalStudentsEnrolled = classes.reduce((acc, curr) => acc + curr.studentCount, 0);
  const totalCapacity = classes.reduce((acc, curr) => acc + curr.capacity, 0);
  const averageClassSize = classes.length > 0 ? Math.round(totalStudentsEnrolled / classes.length) : 0;
  const uniqueGrades = Array.from(new Set(classes.map(c => c.gradeName))).sort();

  const getInitials = (name: string) => name && name !== 'Unassigned' ? name.replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.)\s+/i, '').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'T';

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
            <span className="text-slate-900 truncate">Classes</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 truncate">Classes & Streams</h1>
          <p className="text-xs text-slate-500 mt-0.5 truncate">Organize grade levels, assign class teachers, and monitor rosters.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link href="/dashboard/students/classes/new" className="flex w-full sm:w-auto h-9 items-center justify-center gap-2 rounded-xl px-5 text-xs font-semibold text-white shadow-sm hover:opacity-95 transition-all" style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})` }}>
            <i className="fa-solid fa-plus text-[10px]"></i><span>Add Class Stream</span>
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
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">Total Streams</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{classes.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider truncate">Total Enrolled</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{totalStudentsEnrolled}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">Available Capacity</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{totalCapacity}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider truncate">Avg Class Size</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{averageClassSize}</p>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm">
        <div className="relative flex min-w-0 flex-1 items-center w-full">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 text-xs text-slate-400"></i>
          <input type="text" placeholder="Search stream name, teacher, room..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-4 py-2 text-xs text-slate-800 outline-none focus:border-[#006FBF]/40 focus:bg-white" />
        </div>
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <select value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)} className="w-full sm:w-auto rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-[#006FBF]/40 focus:bg-white">
            <option value="All">All Grades</option>
            {uniqueGrades.map(grade => <option key={grade} value={grade}>{grade}</option>)}
          </select>
        </div>
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden lg:block rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[1000px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 pl-5 pr-3 w-[25%]">Grade & Stream</th>
                <th className="py-4 px-4 w-[25%]">Class Teacher</th>
                <th className="py-4 px-4 w-[15%]">Room No.</th>
                <th className="py-4 px-4 w-[20%]">Enrollment / Capacity</th>
                <th className="py-4 pl-3 pr-5 text-right w-[15%]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={5} className="py-12 text-center text-slate-500"><i className="fa-solid fa-spinner animate-spin mr-2"></i>Loading classes...</td></tr>
              ) : filteredClasses.length > 0 ? (
                filteredClasses.map((cls) => {
                  const percent = cls.capacity > 0 ? Math.round((cls.studentCount / cls.capacity) * 100) : 0;
                  return (
                    <tr key={cls.id} className="hover:bg-slate-50/40 transition-colors text-xs group">
                      <td className="py-4 pl-5 pr-3">
                        <div className="font-semibold text-slate-900 truncate">{cls.gradeName}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{cls.streamName}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 font-medium text-slate-700">
                          <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-bold border border-slate-200/80">
                            {getInitials(cls.classTeacher)}
                          </div>
                          <div>
                            <span className="block truncate max-w-[160px]">{cls.classTeacher}</span>
                            <span className="block text-[10px] text-slate-400 truncate max-w-[160px]">{cls.teacherEmail}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-700 font-mono">{cls.roomNumber || 'TBD'}</td>
                      <td className="py-4 px-4">
                        <div className="text-slate-700 font-mono text-[11px] font-medium mb-1.5 flex justify-between items-center w-32">
                          <span>{cls.studentCount} <span className="text-slate-400">/ {cls.capacity}</span></span>
                          <span className="text-[9px] font-bold text-slate-500">{percent}%</span>
                        </div>
                        <div className="w-32 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(percent, 100)}%`, background: percent >= 100 ? '#f43f5e' : percent >= 85 ? '#f59e0b' : `linear-gradient(90deg, ${BRAND.brightBlue}, ${BRAND.cyan})` }} />
                        </div>
                      </td>
                      <td className="py-4 pl-3 pr-5 text-right">
                        <Link href={`/dashboard/students?class=${encodeURIComponent(cls.gradeName)}`} className="rounded-lg bg-slate-50 px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-[#006FBF] hover:text-white transition-colors border border-slate-200/60 shadow-sm inline-flex items-center gap-1.5">
                          View Roster <i className="fa-solid fa-arrow-right text-[9px]"></i>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan={5} className="py-12 text-center text-slate-400 text-xs">No matching classes found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE & TABLET CARDS VIEW */}
      <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200/80 shadow-sm"><i className="fa-solid fa-spinner animate-spin mr-2"></i>Loading...</div>
        ) : filteredClasses.length > 0 ? (
          filteredClasses.map((cls) => {
            const percent = cls.capacity > 0 ? Math.round((cls.studentCount / cls.capacity) * 100) : 0;
            return (
              <div key={cls.id} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col gap-4 min-w-0">
                <div className="flex justify-between items-start gap-2 min-w-0">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#006FBF]/10 text-[#006FBF]"><i className="fa-solid fa-layer-group text-sm" /></span>
                    <div className="min-w-0 flex-1">
                      <span className="font-semibold text-slate-900 block truncate text-sm">{cls.gradeName}</span>
                      <span className="font-medium text-slate-500 text-[11px] block">{cls.streamName}</span>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">{cls.roomNumber || 'TBD'}</span>
                </div>

                <div className="text-xs text-slate-600 space-y-2 pt-3 border-t border-slate-100 min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <i className="fa-solid fa-user-tie text-slate-400 w-5 text-center flex-shrink-0" />
                    <span className="truncate flex-1 font-medium text-slate-700">{cls.classTeacher}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <div className="flex justify-between items-center text-[10px] font-semibold text-slate-500 mb-1.5">
                    <span>Enrollment Capacity</span>
                    <span>{cls.studentCount} / {cls.capacity} ({percent}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(percent, 100)}%`, background: percent >= 100 ? '#f43f5e' : percent >= 85 ? '#f59e0b' : `linear-gradient(90deg, ${BRAND.brightBlue}, ${BRAND.cyan})` }} />
                  </div>
                </div>

                <div className="pt-2">
                  <Link href={`/dashboard/students?class=${encodeURIComponent(cls.gradeName)}`} className="w-full flex justify-center items-center gap-1.5 rounded-xl bg-slate-50 px-2 py-2.5 text-xs font-semibold text-slate-700 hover:bg-[#006FBF] hover:text-white transition-colors border border-slate-200/60 shadow-sm">
                    View Class Roster <i className="fa-solid fa-arrow-right text-[10px]"></i>
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200/80 shadow-sm text-sm">No classes found.</div>
        )}
      </div>
    </div>
  );
}