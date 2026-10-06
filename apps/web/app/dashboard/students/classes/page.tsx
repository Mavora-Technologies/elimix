// apps/web/app/dashboard/students/classes/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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

  // Fetch real class and stream data from Phase 3 Academics endpoint
  useEffect(() => {
    async function fetchClasses() {
      try {
        setIsLoading(true);
        
        const token = localStorage.getItem('elimix_token');
        const userJson = localStorage.getItem('elimix_user');
        
        let tenantId = '';
        if (userJson) {
          const user = JSON.parse(userJson);
          tenantId = user.tenantId || '';
        }

        const activeTenantId = tenantId || '00000000-0000-0000-0000-000000000000';

        const res = await fetch('http://localhost:3001/api/v1/academics/classes', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-tenant-id': activeTenantId,
          },
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.message || 'Failed to fetch class and stream records.');
        }

        setClasses(result.data || []);
      } catch (err: any) {
        setError(err.message || 'An error occurred while connecting to the server.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchClasses();
  }, []);

  // Filter logic based on search and grade level selection
  const filteredClasses = classes.filter((cls) => {
    const matchesSearch =
      cls.gradeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.streamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.classTeacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.roomNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGrade = gradeFilter === 'All' || cls.gradeName === gradeFilter;

    return matchesSearch && matchesGrade;
  });

  // Dynamic calculations based on live database data
  const totalStudentsEnrolled = classes.reduce((acc, curr) => acc + curr.studentCount, 0);
  const totalCapacity = classes.reduce((acc, curr) => acc + curr.capacity, 0);
  const averageClassSize = classes.length > 0 ? Math.round(totalStudentsEnrolled / classes.length) : 0;

  // Extract unique grades dynamically from the fetched classes for the filter dropdown
  const uniqueGrades = Array.from(new Set(classes.map(c => c.gradeName))).sort();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Classes & Streams
          </h1>
          <p className="text-sm text-slate-500">
            Organize grade levels, assign class teachers, and monitor room capacities and streaming rosters.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors">
            <Link href="/dashboard/students/classes/new">
              <i className="fa-solid fa-plus mr-2 text-xs"></i> Add Class Stream
            </Link>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Streams</p>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <i className="fa-solid fa-layer-group text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{classes.length}</p>
          <span className="text-xs text-slate-500 font-medium">Active operational streams</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Enrolled</p>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <i className="fa-solid fa-user-group text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{totalStudentsEnrolled}</p>
          <span className="text-xs text-emerald-600 font-medium">Students placed in streams</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Available Capacity</p>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <i className="fa-solid fa-school text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{totalCapacity}</p>
          <span className="text-xs text-slate-500 font-medium">Max school desk capacity</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Class Size</p>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <i className="fa-solid fa-chart-pie text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{averageClassSize}</p>
          <span className="text-xs text-amber-600 font-medium">Optimal teacher-to-student ratio</span>
        </div>
      </div>

      {/* Toolbar: Search and Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-xs text-slate-400"></i>
          <input
            type="text"
            placeholder="Search stream name, teacher, room..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
          <span>Filter Grade:</span>
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Grades</option>
            {uniqueGrades.map(grade => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Classes Data Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Grade & Stream</th>
                <th className="py-3 px-4">Class Teacher</th>
                <th className="py-3 px-4">Room No.</th>
                <th className="py-3 px-4">Enrollment / Capacity</th>
                <th className="py-3 px-4">Utilization</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <i className="fa-solid fa-spinner animate-spin text-blue-600"></i>
                      <span>Loading classes from database...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-rose-600 text-sm">
                    <i className="fa-solid fa-triangle-exclamation mr-2"></i> {error}
                  </td>
                </tr>
              ) : filteredClasses.length > 0 ? (
                filteredClasses.map((cls) => {
                  const percent = cls.capacity > 0 ? Math.round((cls.studentCount / cls.capacity) * 100) : 0;
                  return (
                    <tr key={cls.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{cls.gradeName}</div>
                        <div className="text-xs text-slate-500">{cls.streamName}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-900 font-medium">{cls.classTeacher}</div>
                        <div className="text-xs text-slate-500">{cls.teacherEmail}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-mono text-xs">{cls.roomNumber}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-slate-900">{cls.studentCount}</span>
                        <span className="text-xs text-slate-500"> / {cls.capacity} students</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-2 rounded-full ${
                                percent > 95 ? 'bg-rose-500' : percent > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${percent}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-semibold text-slate-600">{percent}%</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <Link
                          href={`/dashboard/students?class=${encodeURIComponent(cls.gradeName)}`}
                          className="text-blue-600 hover:text-blue-800 font-medium text-xs px-2 py-1 rounded hover:bg-blue-50 transition-colors inline-block"
                        >
                          View Roster
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 text-sm">
                    No matching class or stream records found in the database.
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