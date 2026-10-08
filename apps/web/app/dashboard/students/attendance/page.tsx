// apps/web/app/dashboard/students/attendance/page.tsx
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

        const headers = { 'Authorization': `Bearer ${token}`, 'x-tenant-id': activeTenantId };

        const [studentsRes, attendanceRes] = await Promise.all([
          fetch('http://localhost:3001/api/v1/students', { headers }),
          fetch(`http://localhost:3001/api/v1/attendance?date=${selectedDate}`, { headers })
        ]);

        const studentsResult = await studentsRes.json();
        if (!studentsRes.ok) throw new Error(studentsResult.message || 'Failed to fetch students.');

        const attendanceResult = await attendanceRes.json();
        
        const savedStatuses: Record<string, any> = {};
        if (attendanceRes.ok && attendanceResult.data) {
          attendanceResult.data.forEach((record: any) => { savedStatuses[record.studentId] = record.status; });
        }

        const mappedStudents: AttendanceStudent[] = (studentsResult.data || []).map((student: any) => {
          const streamName = student.stream ? `${student.classGrade} ${student.stream}` : student.classGrade || 'Unassigned';
          return {
            id: student.id,
            admissionNo: student.admissionNumber,
            studentName: `${student.firstName} ${student.lastName}`,
            stream: streamName,
            status: savedStatuses[student.id] || 'Present',
          };
        });

        setAllStudents(mappedStudents);

        const uniqueStreams = Array.from(new Set(mappedStudents.map(s => s.stream))).sort();
        setAvailableStreams(uniqueStreams);
        
        if (uniqueStreams.length > 0 && !selectedClass) setSelectedClass(uniqueStreams[0]);

      } catch (err: any) {
        setError(err.message || 'An error occurred while connecting to the server.');
      } finally {
        setIsLoading(false);
      }
    }
    loadAttendanceData();
  }, [selectedDate]);

  const currentClassStudents = allStudents.filter(s => s.stream === selectedClass);
  const filteredStudents = currentClassStudents.filter((s) => s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || s.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleStatusChange = (id: string, status: AttendanceStudent['status']) => {
    setAllStudents((prev) => prev.map((student) => (student.id === id ? { ...student, status } : student)));
    setSavedSuccess(false);
  };

  const markAllPresent = () => {
    setAllStudents((prev) => prev.map((student) => (student.stream === selectedClass ? { ...student, status: 'Present' } : student)));
    setSavedSuccess(false);
  };

  const totalCount = currentClassStudents.length;
  const presentCount = currentClassStudents.filter((s) => s.status === 'Present').length;
  const absentCount = currentClassStudents.filter((s) => s.status === 'Absent').length;
  const lateCount = currentClassStudents.filter((s) => s.status === 'Late' || s.status === 'Excused').length;
  const attendancePercentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

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
        records: currentClassStudents.map(s => ({ studentId: s.id, status: s.status }))
      };

      const res = await fetch('http://localhost:3001/api/v1/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'x-tenant-id': activeTenantId },
        body: JSON.stringify(attendancePayload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Failed to save attendance records.');

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || 'Network error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusButtonClass = (currentStatus: string, targetStatus: string) => {
    const isSelected = currentStatus === targetStatus;
    switch (targetStatus) {
      case 'Present': return isSelected ? 'bg-emerald-500 text-white shadow-sm ring-1 ring-emerald-600' : 'bg-transparent text-slate-500 hover:bg-emerald-50 hover:text-emerald-600';
      case 'Absent': return isSelected ? 'bg-rose-500 text-white shadow-sm ring-1 ring-rose-600' : 'bg-transparent text-slate-500 hover:bg-rose-50 hover:text-rose-600';
      case 'Late': return isSelected ? 'bg-amber-500 text-white shadow-sm ring-1 ring-amber-600' : 'bg-transparent text-slate-500 hover:bg-amber-50 hover:text-amber-600';
      case 'Excused': return isSelected ? 'bg-blue-500 text-white shadow-sm ring-1 ring-blue-600' : 'bg-transparent text-slate-500 hover:bg-blue-50 hover:text-blue-600';
      default: return '';
    }
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

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
            <span className="text-slate-900 truncate">Attendance</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 truncate">Daily Class Attendance</h1>
          <p className="text-xs text-slate-500 mt-0.5 truncate">Record, track, and monitor daily student rosters by stream.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <button onClick={markAllPresent} disabled={isLoading || currentClassStudents.length === 0} className="inline-flex justify-center items-center rounded-xl bg-white border border-slate-200 px-4 py-2.5 sm:py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-50 w-full sm:w-auto">
            <i className="fa-solid fa-check-double mr-2 text-emerald-600" /> Mark All Present
          </button>
          <button onClick={handleSaveAttendance} disabled={isLoading || isSaving || currentClassStudents.length === 0} className="inline-flex justify-center items-center rounded-xl px-4 py-2.5 sm:py-2 text-xs font-semibold text-white shadow-sm transition-all hover:opacity-95 disabled:opacity-50 w-full sm:w-auto" style={{ background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.cyan})` }}>
            <i className={`fa-solid ${isSaving ? 'fa-spinner animate-spin' : 'fa-floppy-disk'} mr-2`} /> {isSaving ? 'Saving...' : 'Save Roster'}
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200/80 bg-emerald-50/80 p-3.5 text-xs font-medium text-emerald-800 shadow-sm animate-in fade-in slide-in-from-top-2">
          <i className="fa-solid fa-check text-[10px] bg-emerald-100/80 text-emerald-600 p-1.5 rounded-lg" />
          <p className="flex-1">Attendance records successfully saved and synchronized for {selectedClass}!</p>
        </div>
      )}
      
      {error && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-rose-800 text-sm flex items-center shadow-sm">
          <i className="fa-solid fa-triangle-exclamation text-rose-600 mr-2 text-base"></i><span>{error}</span>
        </div>
      )}

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">Attendance Rate</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{attendancePercentage}%</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider truncate">Present Today</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{presentCount} <span className="text-sm text-slate-400 font-medium">/ {totalCount}</span></p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider truncate">Absent</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{absentCount}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm flex flex-col justify-center min-w-0">
          <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider truncate">Late / Excused</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{lateCount}</p>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative flex items-center w-full sm:w-auto">
            <i className="fa-regular fa-calendar absolute left-3 text-xs text-slate-400"></i>
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full sm:w-auto rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-4 py-2.5 sm:py-2 text-xs font-medium text-slate-700 outline-none focus:border-[#006FBF]/40 focus:bg-white" />
          </div>
          <div className="relative flex items-center w-full sm:w-auto">
            <i className="fa-solid fa-layer-group absolute left-3 text-xs text-slate-400"></i>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} disabled={isLoading || availableStreams.length === 0} className="w-full sm:w-auto rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-8 py-2.5 sm:py-2 text-xs font-medium text-slate-700 outline-none focus:border-[#006FBF]/40 focus:bg-white appearance-none">
              {availableStreams.length === 0 ? <option value="">No streams found</option> : availableStreams.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="relative flex min-w-0 flex-1 items-center w-full max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 text-xs text-slate-400"></i>
          <input type="text" placeholder="Search student name or admission no..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-4 py-2.5 sm:py-2 text-xs text-slate-800 outline-none focus:border-[#006FBF]/40 focus:bg-white" />
        </div>
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden lg:block rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 pl-5 pr-3 w-1/2">Student Details</th>
                <th className="py-4 px-4 w-1/6">Stream</th>
                <th className="py-4 pl-4 pr-5 text-right w-1/3">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={3} className="py-12 text-center text-slate-500"><i className="fa-solid fa-spinner animate-spin mr-2"></i>Loading roster...</td></tr>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/40 transition-colors text-xs">
                    <td className="py-4 pl-5 pr-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-bold border border-slate-200/80 flex-shrink-0">
                          {getInitials(student.studentName)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{student.studentName}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">{student.admissionNo}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-600 font-medium">{student.stream}</td>
                    <td className="py-4 pl-4 pr-5 text-right">
                      <div className="inline-flex items-center p-1 bg-slate-100/80 rounded-xl border border-slate-200/50">
                        {(['Present', 'Absent', 'Late', 'Excused'] as const).map((st) => (
                          <button key={st} type="button" onClick={() => handleStatusChange(student.id, st)} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${getStatusButtonClass(student.status, st)}`}>
                            {st}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={3} className="py-12 text-center text-slate-400 text-xs">No students found matching your search in this stream.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE CARDS VIEW */}
      <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200/80 shadow-sm"><i className="fa-solid fa-spinner animate-spin mr-2"></i>Loading roster...</div>
        ) : filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <div key={student.id} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col gap-4 min-w-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-500 font-bold border border-slate-200/80 flex-shrink-0">
                  {getInitials(student.studentName)}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-semibold text-slate-900 block truncate text-sm">{student.studentName}</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-slate-400 font-mono">{student.admissionNo}</span>
                    <span className="text-[10px] text-slate-300">•</span>
                    <span className="text-[10px] font-medium text-slate-500 truncate">{student.stream}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <div className="flex w-full p-1 bg-slate-100/80 rounded-xl border border-slate-200/50 justify-between">
                  {(['Present', 'Absent', 'Late', 'Excused'] as const).map((st) => (
                    <button key={st} type="button" onClick={() => handleStatusChange(student.id, st)} className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${getStatusButtonClass(student.status, st)}`}>
                      {st}
                    </button>
                  ))}
                </div>
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