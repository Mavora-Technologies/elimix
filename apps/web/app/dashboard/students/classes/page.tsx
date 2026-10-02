'use client';

import { useState } from 'react';
import Link from 'next/link';

// TypeScript interface for a Class/Stream
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

// Initial mock data for classes and streams
const initialClasses: ClassStream[] = [
  {
    id: 'CLS-6A',
    gradeName: 'Grade 6',
    streamName: 'East Stream',
    classTeacher: 'Mr. David Wilson',
    teacherEmail: 'david.wilson@elimix.edu',
    studentCount: 38,
    capacity: 40,
    roomNumber: 'Rm 102',
  },
  {
    id: 'CLS-6B',
    gradeName: 'Grade 6',
    streamName: 'West Stream',
    classTeacher: 'Ms. Emily Davis',
    teacherEmail: 'emily.davis@elimix.edu',
    studentCount: 35,
    capacity: 40,
    roomNumber: 'Rm 104',
  },
  {
    id: 'CLS-7A',
    gradeName: 'Grade 7',
    streamName: 'North Stream',
    classTeacher: 'Mr. Robert Taylor',
    teacherEmail: 'robert.taylor@elimix.edu',
    studentCount: 42,
    capacity: 40,
    roomNumber: 'Rm 201',
  },
  {
    id: 'CLS-8A',
    gradeName: 'Grade 8',
    streamName: 'South Stream',
    classTeacher: 'Mrs. Amanda Martinez',
    teacherEmail: 'amanda.martinez@elimix.edu',
    studentCount: 37,
    capacity: 45,
    roomNumber: 'Rm 205',
  },
  {
    id: 'CLS-9A',
    gradeName: 'Grade 9',
    streamName: 'East Stream',
    classTeacher: 'Dr. James Anderson',
    teacherEmail: 'james.anderson@elimix.edu',
    studentCount: 39,
    capacity: 40,
    roomNumber: 'Rm 302',
  },
];

export default function ClassesStreamsPage() {
  const [classes, setClasses] = useState<ClassStream[]>(initialClasses);
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('All');

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

  // Calculate totals
  const totalStudentsEnrolled = classes.reduce((acc, curr) => acc + curr.studentCount, 0);
  const totalCapacity = classes.reduce((acc, curr) => acc + curr.capacity, 0);

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
            <i className="fa-solid fa-plus mr-2 text-xs"></i> Add Class Stream
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
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {Math.round(totalStudentsEnrolled / classes.length)}
          </p>
          <span className="text-xs text-amber-600 font-medium">Optimal teacher-to-student ratio</span>
        </div>
      </div>

      {/* Toolbar: Search and Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Search Bar */}
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

        {/* Grade Filter */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
          <span>Filter Grade:</span>
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Grades</option>
            <option value="Grade 6">Grade 6</option>
            <option value="Grade 7">Grade 7</option>
            <option value="Grade 8">Grade 8</option>
            <option value="Grade 9">Grade 9</option>
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
              {filteredClasses.length > 0 ? (
                filteredClasses.map((cls) => {
                  const percent = Math.round((cls.studentCount / cls.capacity) * 100);
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
                          className="text-blue-600 hover:text-blue-800 font-medium text-xs px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                        >
                          View Roster
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 text-sm">
                    No matching class or stream records found.
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