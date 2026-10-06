'use client';

import { useState } from 'react';

// TypeScript interface for an Attendance Record
interface AttendanceStudent {
  id: string;
  admissionNo: string;
  studentName: string;
  stream: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
}

// Initial mock attendance data for a selected class
const initialAttendanceList: AttendanceStudent[] = [
  {
    id: 'ATT-001',
    admissionNo: 'ADM/2024/104',
    studentName: 'Liam Johnson',
    stream: 'Grade 9 East',
    status: 'Present',
  },
  {
    id: 'ATT-002',
    admissionNo: 'ADM/2024/112',
    studentName: 'Sophia Williams',
    stream: 'Grade 9 East',
    status: 'Present',
  },
  {
    id: 'ATT-003',
    admissionNo: 'ADM/2024/119',
    studentName: 'Noah Brown',
    stream: 'Grade 9 East',
    status: 'Absent',
  },
  {
    id: 'ATT-004',
    admissionNo: 'ADM/2024/125',
    studentName: 'Olivia Davis',
    stream: 'Grade 9 East',
    status: 'Late',
  },
  {
    id: 'ATT-005',
    admissionNo: 'ADM/2024/130',
    studentName: 'Ethan Miller',
    stream: 'Grade 9 East',
    status: 'Excused',
  },
];

export default function DailyAttendancePage() {
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-02');
  const [selectedClass, setSelectedClass] = useState<string>('Grade 9 East');
  const [students, setStudents] = useState<AttendanceStudent[]>(initialAttendanceList);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Handle individual status toggle
  const handleStatusChange = (id: string, status: AttendanceStudent['status']) => {
    setStudents((prev) =>
      prev.map((student) => (student.id === id ? { ...student, status } : student))
    );
    setSavedSuccess(false);
  };

  // Mark all as present quick action
  const markAllPresent = () => {
    setStudents((prev) => prev.map((student) => ({ ...student, status: 'Present' })));
    setSavedSuccess(false);
  };

  // Filter list by search query
  const filteredStudents = students.filter(
    (s) =>
      s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.admissionNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate KPIs
  const totalCount = students.length;
  const presentCount = students.filter((s) => s.status === 'Present').length;
  const absentCount = students.filter((s) => s.status === 'Absent').length;
  const lateCount = students.filter((s) => s.status === 'Late' || s.status === 'Excused').length;
  const attendancePercentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  const handleSaveAttendance = () => {
    // API call logic goes here
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Badge styling helper
  const getStatusButtonClass = (currentStatus: string, targetStatus: string) => {
    const isSelected = currentStatus === targetStatus;
    switch (targetStatus) {
      case 'Present':
        return isSelected
          ? 'bg-emerald-600 text-white shadow-sm'
          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100';
      case 'Absent':
        return isSelected
          ? 'bg-rose-600 text-white shadow-sm'
          : 'bg-rose-50 text-rose-700 hover:bg-rose-100';
      case 'Late':
        return isSelected
          ? 'bg-amber-600 text-white shadow-sm'
          : 'bg-amber-50 text-amber-700 hover:bg-amber-100';
      case 'Excused':
        return isSelected
          ? 'bg-purple-600 text-white shadow-sm'
          : 'bg-purple-50 text-purple-700 hover:bg-purple-100';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Daily Attendance
          </h1>
          <p className="text-sm text-slate-500">
            Record, track, and monitor daily student attendance rosters by class and stream.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={markAllPresent}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <i className="fa-solid fa-check-double mr-2 text-xs text-emerald-600"></i> Mark All Present
          </button>
          <button
            onClick={handleSaveAttendance}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
          >
            <i className="fa-solid fa-floppy-disk mr-2 text-xs"></i> Save Attendance
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {savedSuccess && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 text-sm flex items-center justify-between shadow-sm">
          <div className="flex items-center">
            <i className="fa-solid fa-circle-check text-emerald-600 mr-2 text-base"></i>
            <span>Attendance records successfully saved and synchronized for {selectedClass}!</span>
          </div>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Attendance Rate</p>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <i className="fa-solid fa-chart-pie text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{attendancePercentage}%</p>
          <span className="text-xs text-emerald-600 font-medium">Based on current roster</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Present Today</p>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <i className="fa-solid fa-user-check text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{presentCount} <span className="text-xs font-normal text-slate-500">/ {totalCount}</span></p>
          <span className="text-xs text-emerald-600 font-medium">In class</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Absent</p>
            <div className="rounded-lg bg-rose-50 p-2 text-rose-600">
              <i className="fa-solid fa-user-xmark text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{absentCount}</p>
          <span className="text-xs text-rose-600 font-medium">Unexcused / Reported</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Late / Excused</p>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <i className="fa-solid fa-clock text-sm"></i>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{lateCount}</p>
          <span className="text-xs text-amber-600 font-medium">Tardy or permitted leave</span>
        </div>
      </div>

      {/* Toolbar: Date Picker, Class Selector, and Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Date & Stream Selectors */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <i className="fa-regular fa-calendar text-slate-400"></i>
            <span>Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <span>Class Stream:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="Grade 6 East">Grade 6 East</option>
              <option value="Grade 6 West">Grade 6 West</option>
              <option value="Grade 8 South">Grade 8 South</option>
              <option value="Grade 9 East">Grade 9 East</option>
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-xs">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3 text-xs text-slate-400"></i>
          <input
            type="text"
            placeholder="Search student name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Attendance Interactive Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Student Name / Admission No</th>
                <th className="py-3 px-4">Stream</th>
                <th className="py-3 px-4 text-center">Attendance Status Marking</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{student.studentName}</div>
                      <div className="text-xs text-slate-500 font-mono">{student.admissionNo}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs font-medium">{student.stream}</td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
                        {(['Present', 'Absent', 'Late', 'Excused'] as const).map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => handleStatusChange(student.id, st)}
                            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${getStatusButtonClass(
                              student.status,
                              st
                            )}`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-slate-500 text-sm">
                    No students found matching your search.
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