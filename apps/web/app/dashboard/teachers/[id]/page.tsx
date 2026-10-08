// apps/web/app/dashboard/teachers/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface TeacherDetail {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  employeeNumber: string;
  qualifications: string;
  department: string;
  subjects: string[];
  assignedClasses: string[];
  status: string;
}

interface RecentAttendance {
  date: string;
  status: 'Present' | 'Late' | 'Absent' | 'On Leave' | 'Not Marked';
  checkIn: string;
}

export default function TeacherProfilePage() {
  const { id } = useParams();
  const [teacher, setTeacher] = useState<TeacherDetail | null>(null);
  const [attendanceLogs, setAttendanceLogs] = useState<RecentAttendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getHeaders = () => {
    const token = localStorage.getItem('elimix_token');
    const userStr = localStorage.getItem('elimix_user');
    let tenantId = '00000000-0000-0000-0000-000000000000';
    if (userStr && userStr !== 'undefined' && userStr !== 'null') {
      try {
        const userJson = JSON.parse(userStr);
        if (userJson && userJson.tenantId) tenantId = userJson.tenantId;
      } catch (e) {}
    }
    return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'x-tenant-id': tenantId };
  };

  useEffect(() => {
    async function fetchTeacherData() {
      setIsLoading(true);
      try {
        const headers = getHeaders();

        // 1. Fetch Teacher Profile
        const res = await fetch(`http://localhost:3001/api/v1/teachers/${id}`, { headers });
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || 'Failed to fetch teacher profile');
        setTeacher(result.data);

        // 2. Fetch Recent Attendance (Last 5 Days)
        // Note: For now, we will fetch today's attendance just to show the UI integration. 
        // A dedicated /api/v1/teachers/attendance/:id route could fetch history later.
        const attRes = await fetch(`http://localhost:3001/api/v1/teachers/attendance?date=${new Date().toISOString().split('T')[0]}`, { headers });
        if (attRes.ok) {
          const attResult = await attRes.json();
          const myAtt = (attResult.data || []).find((r: any) => r.teacherId === id);
          if (myAtt) {
            setAttendanceLogs([{ date: myAtt.date, status: myAtt.status, checkIn: myAtt.checkIn }]);
          } else {
            setAttendanceLogs([{ date: new Date().toISOString().split('T')[0], status: 'Not Marked', checkIn: '--' }]);
          }
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    if (id) fetchTeacherData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500">
        <i className="fa-solid fa-spinner animate-spin text-3xl mb-4 text-[#006FBF]"></i>
        <p className="font-medium">Loading Teacher Profile...</p>
      </div>
    );
  }

  if (error || !teacher) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500">
        <div className="h-16 w-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-4 text-2xl">
          <i className="fa-solid fa-triangle-exclamation"></i>
        </div>
        <h2 className="text-xl font-bold text-slate-900">Profile Not Found</h2>
        <p className="mt-1 text-sm">{error || 'The requested teacher profile does not exist.'}</p>
        <Link href="/dashboard/teachers" className="mt-6 rounded-xl bg-slate-100 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-200 transition-colors">
          Return to Directory
        </Link>
      </div>
    );
  }

  const getCleanInitials = (name: string) => {
    const cleanName = name.replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.)\s+/i, '').replace(/[^a-zA-Z0-9 ]/g, '').trim();
    return cleanName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'T';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Present': return 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20';
      case 'Late': return 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20';
      case 'Absent': return 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20';
      case 'On Leave': return 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20';
      default: return 'bg-slate-50 text-slate-500 ring-1 ring-inset ring-slate-200 border-dashed';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 w-full">
      {/* Header / Back navigation */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/teachers" className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors shadow-sm">
          <i className="fa-solid fa-arrow-left text-sm"></i>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Teacher Profile</h1>
          <p className="text-xs text-slate-500">View detailed staff information, credentials, and assignments.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
            <div className="h-28 bg-gradient-to-br from-[#012E54] via-[#006FBF] to-[#04B1D6] relative">
              <div className="absolute top-4 right-4">
                 <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold shadow-sm backdrop-blur-md bg-white/90 ${
                    teacher.status === 'Active' ? 'text-emerald-600' : 'text-amber-600'
                  }`}>
                  {teacher.status === 'Active' ? <i className="fa-solid fa-circle-check mr-1.5"></i> : <i className="fa-solid fa-clock mr-1.5"></i>}
                  {teacher.status}
                </span>
              </div>
            </div>
            
            <div className="px-6 pb-6 relative flex flex-col items-center flex-1 text-center">
              <div className="absolute -top-14 h-24 w-24 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-3xl font-bold text-[#012E54] shadow-md ring-1 ring-slate-900/5">
                {getCleanInitials(teacher.fullName)}
              </div>

              <div className="pt-12 w-full">
                <h2 className="text-xl font-bold text-slate-900">{teacher.fullName}</h2>
                <p className="text-xs font-mono text-slate-400 mt-1">{teacher.employeeNumber}</p>
                
                <div className="mt-4 flex flex-col gap-2.5">
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <i className="fa-solid fa-envelope text-slate-400 w-4"></i>
                    <a href={`mailto:${teacher.email}`} className="font-medium text-slate-700 hover:text-[#006FBF] transition-colors">{teacher.email}</a>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <i className="fa-solid fa-phone text-slate-400 w-4"></i>
                    <a href={`tel:${teacher.phone}`} className="font-medium text-slate-700 hover:text-[#006FBF] transition-colors">{teacher.phone}</a>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm pt-2 border-t border-slate-100 mt-1">
                    <i className="fa-solid fa-building text-slate-400 w-4"></i>
                    <span className="font-semibold text-slate-800">{teacher.department}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Details & Assignments */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Qualifications & Overview */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
            <h3 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider flex items-center gap-2">
              <i className="fa-solid fa-award"></i> Qualifications & Credentials
            </h3>
            <div className="text-sm text-slate-700 leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              {teacher.qualifications}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Subjects Block */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <i className="fa-solid fa-book-open text-blue-500"></i> Assigned Subjects
                </h3>
                <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{teacher.subjects.length}</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {teacher.subjects && teacher.subjects.length > 0 ? (
                  teacher.subjects.map((sub, i) => (
                    <span key={i} className="inline-flex items-center rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 border border-slate-200 shadow-sm">
                      {sub}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-rose-500 italic font-medium flex items-center gap-1.5 bg-rose-50 px-3 py-2 rounded-lg border border-rose-100 w-full">
                    <i className="fa-solid fa-circle-exclamation"></i> No subjects allocated yet.
                  </span>
                )}
              </div>
            </div>

            {/* Classes Block */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <i className="fa-solid fa-users text-emerald-500"></i> Class Roster
                </h3>
                <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{teacher.assignedClasses.length}</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {teacher.assignedClasses && teacher.assignedClasses.length > 0 ? (
                  teacher.assignedClasses.map((cls, i) => (
                    <span key={i} className="inline-flex items-center rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 border border-emerald-100">
                      {cls}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic font-medium bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 w-full">
                    No classes currently assigned.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Attendance Overview */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
             <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <i className="fa-regular fa-calendar-check text-indigo-500"></i> Recent Attendance (Today)
              </h3>
              <Link href="/dashboard/teachers/attendance" className="text-[10px] font-bold text-[#006FBF] hover:underline">View Full Log &rarr;</Link>
            </div>
            
            <div className="overflow-hidden rounded-xl border border-slate-100">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 text-[10px] font-bold uppercase text-slate-400 border-b border-slate-100">
                    <th className="px-4 py-2.5">Date</th>
                    <th className="px-4 py-2.5">Check-In</th>
                    <th className="px-4 py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {attendanceLogs.map((log, i) => (
                    <tr key={i} className="bg-white">
                      <td className="px-4 py-3 font-medium text-slate-700">{log.date}</td>
                      <td className="px-4 py-3 font-mono text-slate-600">{log.checkIn}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold ${getStatusBadge(log.status)}`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}