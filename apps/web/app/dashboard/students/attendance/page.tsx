'use client';

import { useState, useEffect } from 'react';

interface AttendanceStudent {
  id: string;
  admissionNo: string;
  studentName: string;
  stream: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
}

export default function DailyAttendancePage() {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  
  const [allStudents, setAllStudents] = useState<AttendanceStudent[]>([]);
  const [availableStreams, setAvailableStreams] = useState<string[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch students AND their attendance for the selected date
  useEffect(() => {
    async function loadAttendanceData() {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('elimix_token');
        const userJson = localStorage.getItem('elimix_user');
        const tenantId = userJson ? JSON.parse(userJson).tenantId : '';
        const activeTenantId = tenantId || '00000000-0000-0000-0000-000000000000';

        const headers = {
          'Authorization': `Bearer ${token}`,
          'x-tenant-id': activeTenantId,
        };

        // 1. Fetch Students
        const studentsRes = await fetch('http://localhost:3001/api/v1/students', { headers });
        const studentsResult = await studentsRes.json();
        if (!studentsRes.ok) throw new Error(studentsResult.message || 'Failed to fetch students.');

        // 2. Fetch saved attendance for the specific date
        const attendanceRes = await fetch(`http://localhost:3001/api/v1/attendance?date=${selectedDate}`, { headers });
        const attendanceResult = await attendanceRes.json();
        
        // Create a map of saved statuses for fast lookup: { studentId: 'Late' }
        const savedStatuses: Record<string, any> = {};
        if (attendanceRes.ok && attendanceResult.data) {
          attendanceResult.data.forEach((record: any) => {
            savedStatuses[record.studentId] = record.status;
          });
        }

        // 3. Merge data: Use saved status if it exists, otherwise default to 'Present'
        const mappedStudents: AttendanceStudent[] = (studentsResult.data || []).map((student: any) => {
          const streamName = student.stream ? `${student.classGrade} ${student.stream}` : student.classGrade || 'Unassigned';
          return {
            id: student.id,
            admissionNo: student.admissionNumber,
            studentName: `${student.firstName} ${student.lastName}`,
            stream: streamName,
            status: savedStatuses[student.id] || 'Present', // Merge happens here!
          };
        });

        setAllStudents(mappedStudents);

        // Extract streams for dropdown
        const uniqueStreams = Array.from(new Set(mappedStudents.map(s => s.stream))).sort();
        setAvailableStreams(uniqueStreams);
        
        if (uniqueStreams.length > 0 && !selectedClass) {
          setSelectedClass(uniqueStreams[0]);
        }

      } catch (err: any) {
        setError(err.message || 'An error occurred while connecting to the server.');
      } finally {
        setIsLoading(false);
      }
    }

    loadAttendanceData();
  }, [selectedDate]); // Re-run whenever the date changes!

  // Filter students based on selected class and search query
  const currentClassStudents = allStudents.filter(s => s.stream === selectedClass);
  const filteredStudents = currentClassStudents.filter(
    (s) =>
      s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.admissionNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle individual status toggle
  const handleStatusChange = (id: string, status: AttendanceStudent['status']) => {
    setAllStudents((prev) =>
      prev.map((student) => (student.id === id ? { ...student, status } : student))
    );
    setSavedSuccess(false);
  };

  // Mark all as present quick action
  const markAllPresent = () => {
    setAllStudents((prev) => 
      prev.map((student) => (student.stream === selectedClass ? { ...student, status: 'Present' } : student))
    );
    setSavedSuccess(false);
  };

  // Calculate KPIs
  const totalCount = currentClassStudents.length;
  const presentCount = currentClassStudents.filter((s) => s.status === 'Present').length;
  const absentCount = currentClassStudents.filter((s) => s.status === 'Absent').length;
  const lateCount = currentClassStudents.filter((s) => s.status === 'Late' || s.status === 'Excused').length;
  const attendancePercentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  // Save to backend API
  const handleSaveAttendance = async () => {
    setIsSaving(true);
    setError(null);
    setSavedSuccess(false);

    try {
      const token = localStorage.getItem('elimix_token');
      const userJson = localStorage.getItem('elimix_user');
      const tenantId = userJson ? JSON.parse(userJson).tenantId : '';
      const activeTenantId = tenantId || '00000000-0000-0000-0000-000000000000';

      const attendancePayload = {
        date: selectedDate,
        stream: selectedClass,
        records: currentClassStudents.map(s => ({
          studentId: s.id,
          status: s.status
        }))
      };

      const res = await fetch('http://localhost:3001/api/v1/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-tenant-id': activeTenantId,
        },
        body: JSON.stringify(attendancePayload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Failed to save attendance records.');
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || 'Network error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
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
            disabled={isLoading || currentClassStudents.length === 0}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <i className="fa-solid fa-check-double mr-2 text-xs text-emerald-600"></i> Mark All Present
          </button>
          <button
            onClick={handleSaveAttendance}
            disabled={isLoading || isSaving || currentClassStudents.length === 0}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors disabled:opacity-50"
          >
            <i className={`fa-solid ${isSaving ? 'fa-spinner animate-spin' : 'fa-floppy-disk'} mr-2 text-xs`}></i> 
            {isSaving ? 'Saving...' : 'Save Attendance'}
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 text-sm flex items-center shadow-sm">
          <i className="fa-solid fa-circle-check text-emerald-600 mr-2 text-base"></i>
          <span>Attendance records successfully saved and synchronized for {selectedClass}!</span>
        </div>
      )}
      
      {error && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-rose-800 text-sm flex items-center shadow-sm">
          <i className="fa-solid fa-triangle-exclamation text-rose-600 mr-2 text-base"></i>
          <span>{error}</span>
        </div>
      )}

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

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
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
              disabled={isLoading || availableStreams.length === 0}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            >
              {availableStreams.length === 0 ? (
                <option value="">No streams found</option>
              ) : (
                availableStreams.map((stream) => (
                  <option key={stream} value={stream}>{stream}</option>
                ))
              )}
            </select>
          </div>
        </div>

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
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-slate-500 text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <i className="fa-solid fa-spinner animate-spin text-blue-600"></i>
                      <span>Loading class roster...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length > 0 ? (
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
                  <td colSpan={3} className="py-12 text-center text-slate-500 text-sm">
                    {currentClassStudents.length === 0 
                      ? 'No students found in this class stream.' 
                      : 'No students found matching your search.'}
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